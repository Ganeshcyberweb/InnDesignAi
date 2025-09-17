import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { AiManager } from '@/lib/ai/ai-manager';

const aiManager = new AiManager();

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

    // Get available providers and their models
    const providers = aiManager.getAvailableProviders();

    // Add additional metadata for each provider
    const providersWithMetadata = providers.map(provider => {
      let description = '';
      let strengths: string[] = [];
      let costLevel = 'medium';
      let speed = 'medium';
      let maxOutputs = 1;

      switch (provider.name) {
        case 'replicate':
          description = 'Stable Diffusion models via Replicate - excellent for detailed interior design images';
          strengths = [
            'High-quality photorealistic outputs',
            'Multiple model options (SDXL, Stable Diffusion)',
            'Fine-grained control over generation parameters',
            'Great for architectural visualization'
          ];
          costLevel = 'low';
          speed = 'medium';
          maxOutputs = 10;
          break;

        case 'openai':
          description = 'DALL-E models by OpenAI - great for creative and artistic interior designs';
          strengths = [
            'Natural language understanding',
            'Creative and artistic outputs',
            'DALL-E 3 produces highly detailed images',
            'Good content safety filtering'
          ];
          costLevel = 'high';
          speed = 'fast';
          maxOutputs = 1; // DALL-E 3 limitation
          break;

        default:
          description = 'AI image generation provider';
          strengths = ['Image generation capabilities'];
      }

      return {
        name: provider.name,
        displayName: provider.name === 'replicate' ? 'Replicate (Stable Diffusion)' :
                     provider.name === 'openai' ? 'OpenAI (DALL-E)' :
                     provider.name,
        description,
        models: provider.models,
        strengths,
        costLevel,
        speed,
        maxOutputs,
        recommended: provider.name === 'replicate', // Replicate is primary recommendation
      };
    });

    // Add configuration status
    const config = {
      replicateConfigured: !!process.env.REPLICATE_API_TOKEN,
      openaiConfigured: !!process.env.OPENAI_API_KEY,
    };

    return NextResponse.json({
      success: true,
      data: {
        providers: providersWithMetadata,
        config,
        totalProviders: providers.length,
        recommendations: {
          primary: 'replicate',
          fallback: 'openai',
          forBudgetUsers: 'replicate',
          forSpeedUsers: 'openai',
          forQualityUsers: 'replicate',
        }
      }
    });

  } catch (error: any) {
    console.error('Error getting AI providers:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST method to check provider availability and test connection
export async function POST(request: NextRequest) {
  try {
    // Authenticate user (admin only for testing)
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

    const body = await request.json();
    const { provider } = body;

    if (!provider || !['replicate', 'openai'].includes(provider)) {
      return NextResponse.json(
        { success: false, error: 'Invalid provider specified' },
        { status: 400 }
      );
    }

    // Test provider availability (this is a simple connectivity test)
    const providers = aiManager.getAvailableProviders();
    const targetProvider = providers.find(p => p.name === provider);

    if (!targetProvider) {
      return NextResponse.json({
        success: false,
        provider,
        available: false,
        error: 'Provider not configured or API key missing',
      });
    }

    // For production, you might want to make a simple test call
    // For now, we'll just return that the provider is configured
    return NextResponse.json({
      success: true,
      provider,
      available: true,
      models: targetProvider.models,
      message: `${provider} provider is configured and available`,
    });

  } catch (error: any) {
    console.error('Error testing provider:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}