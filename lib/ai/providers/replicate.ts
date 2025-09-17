import Replicate from 'replicate';
import { AiProvider, GenerationOptions, GenerationResult, ProviderConfig } from '../types';

export class ReplicateProvider implements AiProvider {
  public readonly name = 'replicate';
  public readonly models = [
    'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    'stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
    'prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb',
    'lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b83c17a705dc46c1088c41f'
  ];

  private client: Replicate;
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.client = new Replicate({
      auth: config.apiKey,
    });
  }

  async generateImage(prompt: string, options: GenerationOptions = {}): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      const {
        model = this.models[0], // Default to SDXL
        width = 1024,
        height = 1024,
        numOutputs = 1,
        guidanceScale = 7.5,
        numInferenceSteps = 50,
        seed,
      } = options;

      const input = {
        prompt,
        negative_prompt: "blurry, low quality, distorted, unrealistic proportions, bad lighting, cluttered, messy, unprofessional",
        width,
        height,
        num_outputs: numOutputs,
        guidance_scale: guidanceScale,
        num_inference_steps: numInferenceSteps,
        ...(seed && { seed }),
      };

      console.log(`Replicate generation started with model: ${model}`);

      const output = await this.client.run(model as any, {
        input,
      });

      const images = Array.isArray(output) ? output : [output];
      const processingTime = Date.now() - startTime;
      const cost = this.estimateCost(options);

      return {
        success: true,
        images: images.filter(img => typeof img === 'string') as string[],
        cost,
        modelUsed: model,
        parameters: options,
        metadata: {
          seed: seed || Math.floor(Math.random() * 1000000),
          processingTime,
          provider: this.name,
        },
      };

    } catch (error: any) {
      console.error('Replicate generation error:', error);

      return {
        success: false,
        images: [],
        cost: 0,
        modelUsed: options.model || this.models[0],
        parameters: options,
        error: error.message || 'Unknown error occurred during image generation',
      };
    }
  }

  estimateCost(options: GenerationOptions = {}): number {
    const {
      model = this.models[0],
      numOutputs = 1,
      numInferenceSteps = 50,
    } = options;

    // Cost estimation based on Replicate pricing (approximate)
    // SDXL: ~$0.002 per image
    // Stable Diffusion: ~$0.0012 per image
    // Additional cost for more inference steps

    let baseCostPerImage = 0.002; // SDXL default

    if (model.includes('stable-diffusion') && !model.includes('sdxl')) {
      baseCostPerImage = 0.0012;
    }

    // Adjust for inference steps (more steps = higher cost)
    const stepMultiplier = Math.max(1, numInferenceSteps / 50);

    return baseCostPerImage * numOutputs * stepMultiplier;
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Test with a simple prediction to check if service is available
      await this.client.models.list();
      return true;
    } catch (error) {
      console.error('Replicate availability check failed:', error);
      return false;
    }
  }

  async getModelInfo(modelId: string): Promise<any> {
    try {
      const [owner, name] = modelId.split('/');
      return await this.client.models.get(owner, name);
    } catch (error) {
      console.error('Failed to get model info:', error);
      return null;
    }
  }

  getDefaultOptions(): GenerationOptions {
    return {
      model: this.models[0],
      width: 1024,
      height: 1024,
      numOutputs: 3,
      guidanceScale: 7.5,
      numInferenceSteps: 50,
    };
  }

  // Interior design specific optimizations
  getInteriorDesignOptions(style: string): GenerationOptions {
    const baseOptions = this.getDefaultOptions();

    // Adjust parameters based on interior design style
    switch (style.toLowerCase()) {
      case 'minimalist':
        return {
          ...baseOptions,
          guidanceScale: 6.0, // Less aggressive for clean, simple designs
          numInferenceSteps: 40,
        };

      case 'maximalist':
      case 'bohemian':
        return {
          ...baseOptions,
          guidanceScale: 8.5, // More detailed for complex designs
          numInferenceSteps: 60,
        };

      case 'photorealistic':
      case 'contemporary':
        return {
          ...baseOptions,
          guidanceScale: 7.5,
          numInferenceSteps: 50,
          model: this.models[0], // Use SDXL for photorealism
        };

      default:
        return baseOptions;
    }
  }
}