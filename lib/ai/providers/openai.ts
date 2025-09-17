import OpenAI from 'openai';
import { AiProvider, GenerationOptions, GenerationResult, ProviderConfig } from '../types';

export class OpenAIProvider implements AiProvider {
  public readonly name = 'openai';
  public readonly models = ['dall-e-3', 'dall-e-2'];

  private client: OpenAI;
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async generateImage(prompt: string, options: GenerationOptions = {}): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      const {
        model = 'dall-e-3',
        width = 1024,
        height = 1024,
        numOutputs = 1,
        quality = 'standard',
        style = 'natural',
      } = options;

      // DALL-E 3 supports only 1 image per request
      const actualNumOutputs = model === 'dall-e-3' ? 1 : Math.min(numOutputs, 10);

      // Determine size format for OpenAI
      let size: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792";

      if (model === 'dall-e-3') {
        if (width > height) {
          size = "1792x1024";
        } else if (height > width) {
          size = "1024x1792";
        } else {
          size = "1024x1024";
        }
      } else {
        // DALL-E 2 supports square sizes only
        if (width >= 1024 || height >= 1024) {
          size = "1024x1024";
        } else if (width >= 512 || height >= 512) {
          size = "512x512";
        } else {
          size = "256x256";
        }
      }

      console.log(`OpenAI generation started with model: ${model}`);

      const images: string[] = [];

      // Generate images (potentially multiple requests for DALL-E 2)
      for (let i = 0; i < actualNumOutputs; i++) {
        const response = await this.client.images.generate({
          model,
          prompt,
          n: 1,
          size,
          ...(model === 'dall-e-3' && {
            quality: quality as 'standard' | 'hd',
            style: style as 'natural' | 'vivid',
          }),
        });

        if (response.data && response.data.length > 0) {
          const imageUrl = response.data[0].url;
          if (imageUrl) {
            images.push(imageUrl);
          }
        }
      }

      const processingTime = Date.now() - startTime;
      const cost = this.estimateCost(options);

      return {
        success: true,
        images,
        cost,
        modelUsed: model,
        parameters: options,
        metadata: {
          processingTime,
          provider: this.name,
        },
      };

    } catch (error: any) {
      console.error('OpenAI generation error:', error);

      return {
        success: false,
        images: [],
        cost: 0,
        modelUsed: options.model || 'dall-e-3',
        parameters: options,
        error: this.parseOpenAIError(error),
      };
    }
  }

  estimateCost(options: GenerationOptions = {}): number {
    const {
      model = 'dall-e-3',
      numOutputs = 1,
      quality = 'standard',
      width = 1024,
      height = 1024,
    } = options;

    // OpenAI DALL-E pricing (as of 2024)
    if (model === 'dall-e-3') {
      // DALL-E 3 only supports 1 image per request
      if (quality === 'hd') {
        if (width === 1024 && height === 1024) {
          return 0.08; // $0.080 per 1024×1024 HD image
        } else {
          return 0.12; // $0.120 per 1024×1792 or 1792×1024 HD image
        }
      } else {
        if (width === 1024 && height === 1024) {
          return 0.04; // $0.040 per 1024×1024 standard image
        } else {
          return 0.08; // $0.080 per 1024×1792 or 1792×1024 standard image
        }
      }
    } else if (model === 'dall-e-2') {
      // DALL-E 2 pricing
      if (width >= 1024 || height >= 1024) {
        return 0.02 * numOutputs; // $0.020 per 1024×1024 image
      } else if (width >= 512 || height >= 512) {
        return 0.018 * numOutputs; // $0.018 per 512×512 image
      } else {
        return 0.016 * numOutputs; // $0.016 per 256×256 image
      }
    }

    return 0.04; // Default fallback
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Test with a simple models list call
      await this.client.models.list();
      return true;
    } catch (error) {
      console.error('OpenAI availability check failed:', error);
      return false;
    }
  }

  getDefaultOptions(): GenerationOptions {
    return {
      model: 'dall-e-3',
      width: 1024,
      height: 1024,
      numOutputs: 1, // DALL-E 3 limitation
      quality: 'standard',
      style: 'natural',
    };
  }

  // Interior design specific optimizations
  getInteriorDesignOptions(style: string): GenerationOptions {
    const baseOptions = this.getDefaultOptions();

    // Adjust parameters based on interior design style
    switch (style.toLowerCase()) {
      case 'photorealistic':
      case 'contemporary':
      case 'modern':
        return {
          ...baseOptions,
          quality: 'hd',
          style: 'natural',
        };

      case 'artistic':
      case 'bohemian':
      case 'eclectic':
        return {
          ...baseOptions,
          quality: 'standard',
          style: 'vivid',
        };

      case 'minimalist':
      case 'scandinavian':
        return {
          ...baseOptions,
          quality: 'standard',
          style: 'natural',
        };

      default:
        return baseOptions;
    }
  }

  private parseOpenAIError(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }

    if (error.message) {
      return error.message;
    }

    if (error.code) {
      switch (error.code) {
        case 'content_policy_violation':
          return 'The prompt violates OpenAI content policy. Please try a different description.';
        case 'rate_limit_exceeded':
          return 'Rate limit exceeded. Please try again in a few moments.';
        case 'insufficient_quota':
          return 'API quota exceeded. Please check your OpenAI account.';
        default:
          return `OpenAI API error: ${error.code}`;
      }
    }

    return 'Unknown error occurred during image generation';
  }

  // Generate multiple variations by calling the API multiple times
  async generateVariations(prompt: string, count: number = 3, options: GenerationOptions = {}): Promise<GenerationResult> {
    if (options.model === 'dall-e-3' && count > 1) {
      // For DALL-E 3, make multiple individual requests
      const results: GenerationResult[] = [];

      for (let i = 0; i < count; i++) {
        const result = await this.generateImage(prompt, { ...options, numOutputs: 1 });
        results.push(result);
      }

      // Combine results
      const allImages = results.flatMap(r => r.images);
      const totalCost = results.reduce((sum, r) => sum + r.cost, 0);
      const hasError = results.some(r => !r.success);

      return {
        success: !hasError,
        images: allImages,
        cost: totalCost,
        modelUsed: options.model || 'dall-e-3',
        parameters: options,
        metadata: {
          provider: this.name,
          variationCount: count,
        },
        ...(hasError && {
          error: 'Some variations failed to generate'
        }),
      };
    } else {
      // For DALL-E 2 or single image requests
      return this.generateImage(prompt, { ...options, numOutputs: count });
    }
  }
}