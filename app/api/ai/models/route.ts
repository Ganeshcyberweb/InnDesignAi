import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { AiManager } from '@/lib/ai/ai-manager';
import { z } from 'zod';

const aiManager = new AiManager();

// Schema for query parameters
const modelsQuerySchema = z.object({
  provider: z.enum(['replicate', 'openai']).optional(),
});

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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    const queryParams = modelsQuerySchema.parse({
      provider: provider || undefined,
    });

    // If specific provider requested, return only those models
    if (queryParams.provider) {
      const models = aiManager.getProviderModels(queryParams.provider);

      const modelDetails = models.map(modelId => {
        return getModelDetails(queryParams.provider!, modelId);
      });

      return NextResponse.json({
        success: true,
        data: {
          provider: queryParams.provider,
          models: modelDetails,
          totalModels: models.length,
        }
      });
    }

    // Return all models from all providers
    const providers = aiManager.getAvailableProviders();
    const allModels: any[] = [];

    providers.forEach(provider => {
      provider.models.forEach(modelId => {
        allModels.push(getModelDetails(provider.name as any, modelId));
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        models: allModels,
        totalModels: allModels.length,
        providerBreakdown: providers.map(p => ({
          provider: p.name,
          modelCount: p.models.length,
        })),
      }
    });

  } catch (error: any) {
    console.error('Error getting AI models:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get detailed model information
function getModelDetails(provider: 'replicate' | 'openai', modelId: string) {
  let name = '';
  let description = '';
  let strengths: string[] = [];
  let idealFor: string[] = [];
  let costLevel = 'medium';
  let speed = 'medium';
  let maxResolution = '1024x1024';
  let maxOutputs = 1;
  let version = '';

  if (provider === 'replicate') {
    if (modelId.includes('sdxl')) {
      name = 'Stable Diffusion XL';
      description = 'Latest SDXL model with superior image quality and text rendering';
      strengths = [
        'Highest quality outputs',
        'Better text rendering',
        'Improved composition',
        'High-resolution generation'
      ];
      idealFor = [
        'Professional architectural visualization',
        'Marketing materials',
        'High-end interior design presentations'
      ];
      costLevel = 'medium';
      speed = 'medium';
      maxResolution = '1024x1024';
      maxOutputs = 10;
      version = 'SDXL 1.0';
    } else if (modelId.includes('stable-diffusion')) {
      name = 'Stable Diffusion v1.5';
      description = 'Classic Stable Diffusion model, fast and reliable';
      strengths = [
        'Fast generation',
        'Lower cost',
        'Proven reliability',
        'Good for iterations'
      ];
      idealFor = [
        'Quick concept exploration',
        'Budget-conscious projects',
        'Rapid prototyping'
      ];
      costLevel = 'low';
      speed = 'fast';
      maxResolution = '768x768';
      maxOutputs = 10;
      version = 'v1.5';
    } else if (modelId.includes('openjourney')) {
      name = 'OpenJourney';
      description = 'Midjourney-style model optimized for artistic interior designs';
      strengths = [
        'Artistic style',
        'Creative compositions',
        'Unique aesthetic',
        'Great for inspiration'
      ];
      idealFor = [
        'Artistic interior concepts',
        'Creative exploration',
        'Unique design styles'
      ];
      costLevel = 'low';
      speed = 'fast';
      maxResolution = '768x768';
      maxOutputs = 10;
      version = 'v4';
    } else if (modelId.includes('animate-diff')) {
      name = 'AnimateDiff';
      description = 'Animation-capable model for creating design transitions';
      strengths = [
        'Animation capabilities',
        'Smooth transitions',
        'Dynamic presentations',
        'Unique output format'
      ];
      idealFor = [
        'Animated design presentations',
        'Before/after transitions',
        'Marketing videos'
      ];
      costLevel = 'high';
      speed = 'slow';
      maxResolution = '512x512';
      maxOutputs = 1;
      version = 'v1.0';
    }
  } else if (provider === 'openai') {
    if (modelId === 'dall-e-3') {
      name = 'DALL-E 3';
      description = 'OpenAI\'s latest model with exceptional prompt understanding';
      strengths = [
        'Superior prompt understanding',
        'Natural language processing',
        'High-quality outputs',
        'Great detail rendering'
      ];
      idealFor = [
        'Complex design briefs',
        'Natural language descriptions',
        'High-quality single images'
      ];
      costLevel = 'high';
      speed = 'fast';
      maxResolution = '1792x1024';
      maxOutputs = 1;
      version = 'v3';
    } else if (modelId === 'dall-e-2') {
      name = 'DALL-E 2';
      description = 'OpenAI\'s proven model for creative image generation';
      strengths = [
        'Creative outputs',
        'Multiple variations',
        'Lower cost than DALL-E 3',
        'Good for experimentation'
      ];
      idealFor = [
        'Creative exploration',
        'Multiple variation generation',
        'Budget-conscious projects'
      ];
      costLevel = 'medium';
      speed = 'fast';
      maxResolution = '1024x1024';
      maxOutputs = 10;
      version = 'v2';
    }
  }

  return {
    id: modelId,
    provider,
    name: name || modelId,
    description,
    strengths,
    idealFor,
    specifications: {
      costLevel,
      speed,
      maxResolution,
      maxOutputs,
      version,
    },
    recommended: (provider === 'replicate' && modelId.includes('sdxl')) ||
                 (provider === 'openai' && modelId === 'dall-e-3'),
  };
}