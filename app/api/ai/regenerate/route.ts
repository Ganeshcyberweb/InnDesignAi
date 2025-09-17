import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AiManager } from '@/lib/ai/ai-manager';
import { DesignGenerationRequest } from '@/lib/ai/types';

const prisma = new PrismaClient();
const aiManager = new AiManager();

// Validation schema for the regeneration request
const regenerateDesignSchema = z.object({
  designId: z.string().cuid(),
  modifications: z.object({
    stylePreference: z.string().optional(),
    colorScheme: z.string().optional(),
    additionalRequirements: z.string().optional(),
    roomType: z.string().optional(),
    budget: z.string().optional(),
  }).optional(),
  provider: z.enum(['replicate', 'openai']).optional(),
  model: z.string().optional(),
  numVariations: z.number().min(1).max(5).optional().default(3),
  variationIndex: z.number().optional(), // If regenerating a specific variation
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
    const validatedData = regenerateDesignSchema.parse(body);

    // Get existing design with preferences
    const existingDesign = await prisma.design.findFirst({
      where: {
        id: validatedData.designId,
        userId: user.id,
      },
      include: {
        preferences: true,
        designOutputs: true,
      },
    });

    if (!existingDesign) {
      return NextResponse.json(
        { success: false, error: 'Design not found or access denied' },
        { status: 404 }
      );
    }

    if (!existingDesign.preferences) {
      return NextResponse.json(
        { success: false, error: 'Design preferences not found' },
        { status: 400 }
      );
    }

    // Merge existing preferences with modifications
    const updatedPreferences = {
      roomType: validatedData.modifications?.roomType || existingDesign.preferences.roomType,
      stylePreference: validatedData.modifications?.stylePreference || existingDesign.preferences.stylePreference,
      size: existingDesign.preferences.size,
      budget: validatedData.modifications?.budget || 'mid_range', // Default fallback
      colorScheme: validatedData.modifications?.colorScheme || existingDesign.preferences.colorScheme,
      materialPreferences: existingDesign.preferences.materialPreferences
        ? JSON.parse(existingDesign.preferences.materialPreferences as string)
        : [],
      otherRequirements: validatedData.modifications?.additionalRequirements || existingDesign.preferences.otherRequirements,
    };

    // Check cost limits
    const userCost = aiManager.getUserCost(user.id);
    const estimatedCost = aiManager.estimateGenerationCost({
      userId: user.id,
      designId: validatedData.designId,
      prompt_template: {
        room_type: updatedPreferences.roomType,
        style_preference: updatedPreferences.stylePreference,
        size: updatedPreferences.size,
        budget_level: updatedPreferences.budget as 'budget' | 'mid_range' | 'luxury',
        color_scheme: updatedPreferences.colorScheme || undefined,
        material_preferences: updatedPreferences.materialPreferences,
        additional_requirements: updatedPreferences.otherRequirements || undefined,
      },
      preferences: updatedPreferences,
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

    // Update design status to regenerating
    await prisma.design.update({
      where: { id: validatedData.designId },
      data: {
        status: 'GENERATING',
        aiModelUsed: validatedData.provider || existingDesign.aiModelUsed || 'replicate',
      },
    });

    // Update preferences if modifications were provided
    if (validatedData.modifications) {
      await prisma.preferences.update({
        where: { designId: validatedData.designId },
        data: {
          ...(validatedData.modifications.stylePreference && {
            stylePreference: validatedData.modifications.stylePreference
          }),
          ...(validatedData.modifications.colorScheme && {
            colorScheme: validatedData.modifications.colorScheme
          }),
          ...(validatedData.modifications.additionalRequirements && {
            otherRequirements: validatedData.modifications.additionalRequirements
          }),
          ...(validatedData.modifications.roomType && {
            roomType: validatedData.modifications.roomType
          }),
        },
      });
    }

    // Prepare generation request with updated preferences
    const generationRequest: DesignGenerationRequest = {
      userId: user.id,
      designId: validatedData.designId,
      prompt_template: {
        room_type: updatedPreferences.roomType,
        style_preference: updatedPreferences.stylePreference,
        size: updatedPreferences.size,
        budget_level: updatedPreferences.budget as 'budget' | 'mid_range' | 'luxury',
        color_scheme: updatedPreferences.colorScheme || undefined,
        material_preferences: updatedPreferences.materialPreferences,
        additional_requirements: updatedPreferences.otherRequirements || undefined,
        uploaded_image_context: existingDesign.uploadedImageUrl
          ? `Based on uploaded reference image: ${existingDesign.uploadedImageUrl}`
          : undefined,
      },
      preferences: updatedPreferences,
      provider: validatedData.provider,
      model: validatedData.model,
      num_variations: validatedData.numVariations,
    };

    // Generate new variations
    console.log(`Regenerating design for user ${user.id}, design ${validatedData.designId}`);
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
          error: result.error || 'Regeneration failed',
          cost: result.cost,
        },
        { status: 500 }
      );
    }

    // If regenerating a specific variation, remove the old one
    if (validatedData.variationIndex !== undefined) {
      const oldOutput = existingDesign.designOutputs[validatedData.variationIndex];
      if (oldOutput) {
        // Delete old image from storage
        try {
          const fileName = oldOutput.outputImageUrl.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('design-images')
              .remove([`designs/${validatedData.designId}/${fileName}`]);
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }

        // Delete old output record
        await prisma.designOutput.delete({
          where: { id: oldOutput.id },
        });
      }
    }

    // Upload new images to Supabase Storage and save DesignOutput records
    const designOutputs = [];

    for (let i = 0; i < result.images.length; i++) {
      const imageUrl = result.images[i];

      try {
        // Upload image to Supabase Storage
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const fileName = `designs/${validatedData.designId}/regenerated_${Date.now()}_${i + 1}.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('design-images')
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading regenerated image:', uploadError);
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
            variationName: `Regenerated Variation ${i + 1}`,
            generationParameters: JSON.stringify({
              provider: result.metadata?.provider,
              model: result.modelUsed,
              parameters: result.parameters,
              cost: result.cost / result.images.length,
              modifications: validatedData.modifications,
              regenerated: true,
              originalVariationIndex: validatedData.variationIndex,
            }),
          },
        });

        designOutputs.push(designOutput);

      } catch (uploadError) {
        console.error('Error processing regenerated image:', uploadError);
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

    // Get updated design with all outputs
    const updatedDesign = await prisma.design.findFirst({
      where: { id: validatedData.designId },
      include: {
        designOutputs: {
          orderBy: { createdAt: 'desc' },
        },
        preferences: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        designId: validatedData.designId,
        status: 'COMPLETED',
        newOutputs: designOutputs,
        allOutputs: updatedDesign?.designOutputs || [],
        cost: result.cost,
        modelUsed: result.modelUsed,
        generationTime: result.metadata?.processingTime,
        modifications: validatedData.modifications,
        regeneratedVariations: result.images.length,
      },
      message: `Successfully regenerated ${result.images.length} design variations with modifications`,
    });

  } catch (error: any) {
    console.error('Design regeneration error:', error);

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