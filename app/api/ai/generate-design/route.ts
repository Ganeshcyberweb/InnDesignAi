import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AiManager } from '@/lib/ai/ai-manager';
import { DesignGenerationRequest } from '@/lib/ai/types';

const prisma = new PrismaClient();
const aiManager = new AiManager();

// Validation schema for the request body
const generateDesignSchema = z.object({
  designId: z.string().cuid(),
  preferences: z.object({
    roomType: z.string(),
    stylePreference: z.string(),
    size: z.string(),
    budget: z.string(),
    colorScheme: z.string().optional(),
    materialPreferences: z.array(z.string()).optional(),
    otherRequirements: z.string().optional(),
  }),
  provider: z.enum(['replicate', 'openai']).optional(),
  model: z.string().optional(),
  numVariations: z.number().min(1).max(5).optional().default(3),
  uploadedImageContext: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedData = generateDesignSchema.parse(body);

    // Check if design exists and belongs to user
    const existingDesign = await prisma.design.findFirst({
      where: {
        id: validatedData.designId,
        userId: user.id,
      },
      include: {
        preferences: true,
      },
    });

    if (!existingDesign) {
      return NextResponse.json(
        { success: false, error: 'Design not found or access denied' },
        { status: 404 }
      );
    }

    // Check if user has exceeded cost limits
    const userCost = aiManager.getUserCost(user.id);
    const estimatedCost = aiManager.estimateGenerationCost({
      userId: user.id,
      designId: validatedData.designId,
      prompt_template: {
        room_type: validatedData.preferences.roomType,
        style_preference: validatedData.preferences.stylePreference,
        size: validatedData.preferences.size,
        budget_level: validatedData.preferences.budget as 'budget' | 'mid_range' | 'luxury',
        color_scheme: validatedData.preferences.colorScheme,
        material_preferences: validatedData.preferences.materialPreferences,
        additional_requirements: validatedData.preferences.otherRequirements,
        uploaded_image_context: validatedData.uploadedImageContext,
      },
      preferences: validatedData.preferences,
      provider: validatedData.provider,
      model: validatedData.model,
      num_variations: validatedData.numVariations,
    });

    if (userCost + estimatedCost > 10.0) { // $10 daily limit
      return NextResponse.json(
        {
          success: false,
          error: 'Daily generation limit reached. Please try again tomorrow.',
          currentCost: userCost,
          estimatedCost,
          limit: 10.0,
        },
        { status: 429 }
      );
    }

    // Update design status to generating
    await prisma.design.update({
      where: { id: validatedData.designId },
      data: {
        status: 'GENERATING',
        aiModelUsed: validatedData.provider || 'replicate',
      },
    });

    // Prepare generation request
    const generationRequest: DesignGenerationRequest = {
      userId: user.id,
      designId: validatedData.designId,
      prompt_template: {
        room_type: validatedData.preferences.roomType,
        style_preference: validatedData.preferences.stylePreference,
        size: validatedData.preferences.size,
        budget_level: validatedData.preferences.budget as 'budget' | 'mid_range' | 'luxury',
        color_scheme: validatedData.preferences.colorScheme,
        material_preferences: validatedData.preferences.materialPreferences,
        additional_requirements: validatedData.preferences.otherRequirements,
        uploaded_image_context: validatedData.uploadedImageContext,
      },
      preferences: validatedData.preferences,
      provider: validatedData.provider,
      model: validatedData.model,
      num_variations: validatedData.numVariations,
    };

    // Generate the design
    console.log(`Starting design generation for user ${user.id}, design ${validatedData.designId}`);
    const result = await aiManager.generateDesign(generationRequest);

    if (!result.success) {
      // Update design status to failed
      await prisma.design.update({
        where: { id: validatedData.designId },
        data: {
          status: 'FAILED',
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Generation failed',
          cost: result.cost,
        },
        { status: 500 }
      );
    }

    // Upload images to Supabase Storage and save DesignOutput records
    const designOutputs = [];

    for (let i = 0; i < result.images.length; i++) {
      const imageUrl = result.images[i];

      try {
        // Upload image to Supabase Storage
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const fileName = `designs/${validatedData.designId}/output_${i + 1}_${Date.now()}.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('design-images')
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('design-images')
          .getPublicUrl(fileName);

        // Create DesignOutput record
        const designOutput = await prisma.designOutput.create({
          data: {
            designId: validatedData.designId,
            outputImageUrl: publicUrl,
            variationName: `Variation ${i + 1}`,
            generationParameters: JSON.stringify({
              provider: result.metadata?.provider,
              model: result.modelUsed,
              parameters: result.parameters,
              cost: result.cost / result.images.length, // Cost per image
            }),
          },
        });

        designOutputs.push(designOutput);

      } catch (uploadError) {
        console.error('Error processing image:', uploadError);
        // Continue with other images
      }
    }

    // Update design status to completed
    await prisma.design.update({
      where: { id: validatedData.designId },
      data: {
        status: 'COMPLETED',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        designId: validatedData.designId,
        status: 'COMPLETED',
        outputs: designOutputs,
        cost: result.cost,
        modelUsed: result.modelUsed,
        generationTime: result.metadata?.processingTime,
        variations: result.images.length,
      },
      message: `Successfully generated ${result.images.length} design variations`,
    });

  } catch (error: any) {
    console.error('Design generation error:', error);

    // If we have a designId, update its status to failed
    const body = await request.json().catch(() => ({}));
    if (body.designId) {
      try {
        await prisma.design.update({
          where: { id: body.designId },
          data: { status: 'FAILED' },
        });
      } catch (updateError) {
        console.error('Error updating design status:', updateError);
      }
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET method to check generation status
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const designId = searchParams.get('designId');

    if (!designId) {
      return NextResponse.json(
        { success: false, error: 'Design ID is required' },
        { status: 400 }
      );
    }

    // Get design with outputs
    const design = await prisma.design.findFirst({
      where: {
        id: designId,
        userId: user.id,
      },
      include: {
        designOutputs: true,
        preferences: true,
      },
    });

    if (!design) {
      return NextResponse.json(
        { success: false, error: 'Design not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: design.id,
        status: design.status,
        outputs: design.designOutputs,
        preferences: design.preferences,
        aiModelUsed: design.aiModelUsed,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
      },
    });

  } catch (error) {
    console.error('Error getting design status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}