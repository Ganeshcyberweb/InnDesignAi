import { AiProvider, AiProviderName, GenerationOptions, GenerationResult, DesignGenerationRequest, ProviderConfig } from './types';
import { ReplicateProvider } from './providers/replicate';
import { OpenAIProvider } from './providers/openai';
import { PromptEngineer } from './prompt-engineering';

export class AiManager {
  private providers: Map<AiProviderName, AiProvider> = new Map();
  private activeProvider: AiProviderName = 'replicate';
  private fallbackProvider: AiProviderName = 'openai';
  private costTracker: Map<string, number> = new Map(); // userId -> total cost
  private maxCostPerUser: number = 10.0; // $10 daily limit per user

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize Replicate provider
    if (process.env.REPLICATE_API_TOKEN) {
      const replicateConfig: ProviderConfig = {
        apiKey: process.env.REPLICATE_API_TOKEN,
        timeout: 300000, // 5 minutes
        maxRetries: 3,
        rateLimit: {
          requestsPerMinute: 60,
        },
      };
      this.providers.set('replicate', new ReplicateProvider(replicateConfig));
    }

    // Initialize OpenAI provider
    if (process.env.OPENAI_API_KEY) {
      const openaiConfig: ProviderConfig = {
        apiKey: process.env.OPENAI_API_KEY,
        timeout: 120000, // 2 minutes
        maxRetries: 2,
        rateLimit: {
          requestsPerMinute: 50,
        },
      };
      this.providers.set('openai', new OpenAIProvider(openaiConfig));
    }

    console.log(`Initialized ${this.providers.size} AI providers:`, Array.from(this.providers.keys()));
  }

  async generateDesign(request: DesignGenerationRequest): Promise<GenerationResult> {
    const { userId, designId, prompt_template, provider, num_variations = 3 } = request;

    // Check cost limits
    const userCost = this.costTracker.get(userId) || 0;
    if (userCost >= this.maxCostPerUser) {
      return {
        success: false,
        images: [],
        cost: 0,
        modelUsed: '',
        parameters: {},
        error: 'Daily cost limit reached. Please try again tomorrow.',
      };
    }

    // Generate optimized prompt
    const basePrompt = PromptEngineer.generatePrompt(prompt_template);
    const prompts = PromptEngineer.generateVariationPrompts(basePrompt, num_variations);

    // Determine which provider to use
    const targetProvider = provider || this.activeProvider;
    let selectedProvider = this.providers.get(targetProvider);

    // Fallback to other provider if primary is unavailable
    if (!selectedProvider || !(await this.isProviderAvailable(targetProvider))) {
      console.log(`Primary provider ${targetProvider} unavailable, falling back to ${this.fallbackProvider}`);
      selectedProvider = this.providers.get(this.fallbackProvider);
    }

    if (!selectedProvider) {
      return {
        success: false,
        images: [],
        cost: 0,
        modelUsed: '',
        parameters: {},
        error: 'No AI providers available. Please check configuration.',
      };
    }

    try {
      // Optimize prompt for the selected provider
      const optimizedPrompt = PromptEngineer.optimizeForProvider(basePrompt, selectedProvider.name as AiProviderName);

      // Get appropriate generation options
      const options = this.getOptimizedOptions(selectedProvider, prompt_template);

      console.log(`Generating design with ${selectedProvider.name}, prompt: ${optimizedPrompt.substring(0, 100)}...`);

      // Generate the images
      const result = await this.generateWithRetry(selectedProvider, optimizedPrompt, options, 3);

      // Update cost tracking
      if (result.success) {
        this.updateCostTracker(userId, result.cost);
      }

      // Add metadata
      result.metadata = {
        ...result.metadata,
        designId,
        userId,
        originalPrompt: basePrompt,
        optimizedPrompt,
      };

      return result;

    } catch (error: any) {
      console.error('Design generation error:', error);
      return {
        success: false,
        images: [],
        cost: 0,
        modelUsed: selectedProvider.name,
        parameters: {},
        error: error.message || 'Unexpected error during generation',
      };
    }
  }

  private async generateWithRetry(
    provider: AiProvider,
    prompt: string,
    options: GenerationOptions,
    maxRetries: number = 3
  ): Promise<GenerationResult> {
    let lastError: string = '';

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Generation attempt ${attempt}/${maxRetries}`);

        const result = await provider.generateImage(prompt, options);

        if (result.success && result.images.length > 0) {
          return result;
        }

        lastError = result.error || 'Unknown error';

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

      } catch (error: any) {
        lastError = error.message;
        console.error(`Attempt ${attempt} failed:`, error);

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    return {
      success: false,
      images: [],
      cost: 0,
      modelUsed: provider.name,
      parameters: options,
      error: `Generation failed after ${maxRetries} attempts. Last error: ${lastError}`,
    };
  }

  private getOptimizedOptions(provider: AiProvider, template: any): GenerationOptions {
    // Get provider-specific default options
    let options: GenerationOptions;

    if (provider.name === 'replicate') {
      const replicateProvider = provider as ReplicateProvider;
      options = replicateProvider.getInteriorDesignOptions(template.style_preference);
    } else if (provider.name === 'openai') {
      const openaiProvider = provider as OpenAIProvider;
      options = openaiProvider.getInteriorDesignOptions(template.style_preference);
    } else {
      options = {
        width: 1024,
        height: 1024,
        numOutputs: 3,
      };
    }

    // Adjust based on room type and budget
    options = this.adjustOptionsForBudget(options, template.budget_level);
    options = this.adjustOptionsForRoom(options, template.room_type);

    return options;
  }

  private adjustOptionsForBudget(options: GenerationOptions, budget: string): GenerationOptions {
    switch (budget) {
      case 'budget':
        return {
          ...options,
          numOutputs: Math.min(options.numOutputs || 3, 2), // Fewer variations to save cost
          quality: 'standard',
        };
      case 'luxury':
        return {
          ...options,
          numOutputs: Math.max(options.numOutputs || 3, 4), // More variations for luxury
          quality: 'hd',
          numInferenceSteps: Math.max(options.numInferenceSteps || 50, 60),
        };
      default:
        return options;
    }
  }

  private adjustOptionsForRoom(options: GenerationOptions, roomType: string): GenerationOptions {
    // Adjust aspect ratio based on room type
    switch (roomType) {
      case 'living_room':
      case 'dining_room':
        return {
          ...options,
          width: 1792,
          height: 1024, // Wider aspect for living spaces
        };
      case 'bathroom':
        return {
          ...options,
          width: 1024,
          height: 1792, // Taller aspect for bathrooms
        };
      default:
        return options;
    }
  }

  private async isProviderAvailable(provider: AiProviderName): Promise<boolean> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) return false;

    try {
      // Check if provider has an availability method
      if ('isAvailable' in providerInstance && typeof providerInstance.isAvailable === 'function') {
        return await providerInstance.isAvailable();
      }
      return true;
    } catch (error) {
      console.error(`Provider ${provider} availability check failed:`, error);
      return false;
    }
  }

  private updateCostTracker(userId: string, cost: number): void {
    const currentCost = this.costTracker.get(userId) || 0;
    this.costTracker.set(userId, currentCost + cost);
  }

  // Public methods for API endpoints

  getAvailableProviders(): Array<{ name: string; models: string[] }> {
    return Array.from(this.providers.entries()).map(([name, provider]) => ({
      name,
      models: provider.models,
    }));
  }

  getProviderModels(providerName: AiProviderName): string[] {
    const provider = this.providers.get(providerName);
    return provider ? provider.models : [];
  }

  estimateGenerationCost(request: DesignGenerationRequest): number {
    const provider = this.providers.get(request.provider || this.activeProvider);
    if (!provider) return 0;

    const options = this.getOptimizedOptions(provider, request.prompt_template);
    return provider.estimateCost(options);
  }

  getUserCost(userId: string): number {
    return this.costTracker.get(userId) || 0;
  }

  resetUserCost(userId: string): void {
    this.costTracker.delete(userId);
  }

  setActiveProvider(provider: AiProviderName): boolean {
    if (this.providers.has(provider)) {
      this.activeProvider = provider;
      return true;
    }
    return false;
  }

  // Reset daily cost tracker (should be called by a cron job)
  resetDailyCosts(): void {
    this.costTracker.clear();
    console.log('Daily cost tracker reset');
  }
}