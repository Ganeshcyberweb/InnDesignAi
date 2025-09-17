import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/app/lib/supabase/server';
import { z } from 'zod';

const RegenerateSchema = z.object({
  designId: z.string(),
  modifications: z.object({
    style: z.string().optional(),
    roomType: z.string().optional(),
    colorScheme: z.string().optional(),
    materials: z.string().optional(),
    budget: z.number().optional(),
    additionalPrompt: z.string().optional(),
  }),
  aiProvider: z.string().optional(),
  variationCount: z.number().min(1).max(4).default(1),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { designId, modifications, aiProvider, variationCount } = RegenerateSchema.parse(body);

    // Get original design
    const { data: originalDesign, error: designError } = await supabase
      .from('designs')
      .select(`
        *,
        preferences (*),
        design_outputs (*)
      `)
      .eq('id', designId)
      .eq('user_id', user.id)
      .single();

    if (designError || !originalDesign) {
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404 }
      );
    }

    // Create modified prompt based on original and modifications
    const originalPreferences = originalDesign.preferences;
    const modifiedPrompt = createModifiedPrompt(
      originalDesign.input_prompt,
      originalPreferences,
      modifications
    );

    // Update design status to processing
    await supabase
      .from('designs')
      .update({
        status: 'PROCESSING',
        updated_at: new Date().toISOString(),
      })
      .eq('id', designId);

    // Generate new variations
    const generations = [];

    for (let i = 0; i < variationCount; i++) {
      try {
        const generationResult = await generateDesignVariation(
          modifiedPrompt,
          aiProvider || originalDesign.ai_model_used,
          originalDesign.uploaded_image_url
        );

        if (generationResult.success) {
          // Save new design output
          const { error: outputError } = await supabase
            .from('design_outputs')
            .insert({
              design_id: designId,
              output_image_url: generationResult.imageUrl,
              variation_name: `Regenerated ${i + 1}`,
              generation_parameters: JSON.stringify({
                modifications,
                aiProvider,
                originalPrompt: originalDesign.input_prompt,
                modifiedPrompt,
                timestamp: new Date().toISOString(),
              }),
            });

          if (!outputError) {
            generations.push({
              imageUrl: generationResult.imageUrl,
              variationName: `Regenerated ${i + 1}`,
              parameters: {
                modifications,
                aiProvider,
                timestamp: new Date().toISOString(),
              },
            });
          }
        }
      } catch (genError) {
        console.error(`Error generating variation ${i + 1}:`, genError);
      }
    }

    // Update design status
    const finalStatus = generations.length > 0 ? 'COMPLETED' : 'FAILED';
    await supabase
      .from('designs')
      .update({
        status: finalStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', designId);

    // Update preferences if modifications were made
    if (Object.keys(modifications).length > 0) {
      const updatedPreferences = {
        ...originalPreferences,
        ...modifications,
        updated_at: new Date().toISOString(),
      };

      await supabase
        .from('preferences')
        .update(updatedPreferences)
        .eq('design_id', designId);
    }

    return NextResponse.json({
      success: true,
      data: {
        designId,
        generationsCreated: generations.length,
        generations,
        modifiedPrompt,
        status: finalStatus,
      },
    });

  } catch (error) {
    console.error('Regeneration error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function createModifiedPrompt(
  originalPrompt: string,
  originalPreferences: any,
  modifications: any
): string {
  let prompt = originalPrompt;

  // Apply style modifications
  if (modifications.style && modifications.style !== originalPreferences?.style_preference) {
    prompt += ` Update the style to ${modifications.style}.`;
  }

  // Apply color scheme modifications
  if (modifications.colorScheme && modifications.colorScheme !== originalPreferences?.color_scheme) {
    prompt += ` Change the color scheme to ${modifications.colorScheme}.`;
  }

  // Apply material modifications
  if (modifications.materials && modifications.materials !== originalPreferences?.material_preferences) {
    prompt += ` Use ${modifications.materials} materials.`;
  }

  // Apply budget modifications
  if (modifications.budget && modifications.budget !== originalPreferences?.budget) {
    const budgetLevel = modifications.budget < 10000 ? 'budget-friendly' :
                      modifications.budget < 30000 ? 'mid-range' : 'luxury';
    prompt += ` Focus on ${budgetLevel} options within a $${modifications.budget} budget.`;
  }

  // Add additional prompt
  if (modifications.additionalPrompt) {
    prompt += ` ${modifications.additionalPrompt}`;
  }

  return prompt;
}

async function generateDesignVariation(
  prompt: string,
  aiProvider: string,
  referenceImage?: string | null
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    // Call the main AI generation API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/generate-design`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        provider: aiProvider,
        referenceImage,
        parameters: {
          width: 1024,
          height: 1024,
          guidance_scale: 7.5,
          num_inference_steps: 20,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Generation failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success && result.imageUrl) {
      return {
        success: true,
        imageUrl: result.imageUrl,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Generation failed',
      };
    }
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}