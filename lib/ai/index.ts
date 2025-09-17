// Main AI module exports
export { AiManager } from './ai-manager';
export { PromptEngineer } from './prompt-engineering';
export { CostTracker } from './cost-tracker';
export { DesignStorageManager } from './storage-utils';
export { AiErrorHandler, withErrorHandling } from './error-handler';

// Provider exports
export { ReplicateProvider } from './providers/replicate';
export { OpenAIProvider } from './providers/openai';

// Configuration exports
export {
  getAiConfig,
  validateEnvironment,
  isValidProvider,
  isValidModel,
  isValidStyle,
  isValidRoom,
  isValidBudget,
  AI_MODELS,
  STYLE_PROMPTS,
  ROOM_SPECIFICS,
  BUDGET_MATERIALS,
  PRICING,
  AI_ERROR_CODES,
} from './config';

// Type exports
export type {
  AiProvider,
  GenerationOptions,
  GenerationResult,
  PromptTemplate,
  DesignGenerationRequest,
  AiProviderName,
  ProviderConfig,
  AiConfig,
  AiErrorCode,
} from './types';

export type {
  CostEntry,
  CostSummary,
} from './cost-tracker';

export type {
  StorageUploadResult,
} from './storage-utils';

export type {
  AiError,
} from './error-handler';

// Utility functions for easy integration
export const aiUtils = {
  // Quick cost estimation
  estimateCost: (provider: string, model: string, numOutputs: number = 1) => {
    return CostTracker.estimateGenerationCost(provider, model, { numOutputs });
  },

  // Generate a simple prompt for testing
  generateTestPrompt: (roomType: string, style: string) => {
    return PromptEngineer.generatePrompt({
      room_type: roomType,
      style_preference: style,
      size: 'medium',
      budget_level: 'mid_range',
    });
  },

  // Check if environment is properly configured
  checkConfiguration: () => {
    const validation = validateEnvironment();
    const config = validation.success ? getAiConfig() : null;

    return {
      valid: validation.success,
      errors: validation.success ? [] : validation.error.errors,
      providers: config ? {
        replicate: config.providers.replicate.enabled,
        openai: config.providers.openai.enabled,
      } : null,
    };
  },

  // Format cost for display
  formatCost: (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
    }).format(cost);
  },

  // Format generation time
  formatDuration: (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  },
};

// Constants for easy access
export const AI_CONSTANTS = {
  PROVIDERS: ['replicate', 'openai'] as const,
  ROOM_TYPES: ['living_room', 'bedroom', 'kitchen', 'bathroom', 'dining_room', 'home_office', 'outdoor'] as const,
  STYLE_PREFERENCES: ['modern', 'traditional', 'scandinavian', 'industrial', 'bohemian', 'minimalist', 'rustic', 'contemporary'] as const,
  BUDGET_LEVELS: ['budget', 'mid_range', 'luxury'] as const,
  SIZES: ['small', 'medium', 'large'] as const,
  COLOR_SCHEMES: ['neutral', 'warm', 'cool', 'monochrome', 'bold'] as const,
  MAX_VARIATIONS: 5,
  DEFAULT_VARIATIONS: 3,
  DAILY_COST_LIMIT: 10.0,
  MONTHLY_COST_LIMIT: 200.0,
};

// Helper function to initialize AI services
export async function initializeAiServices(): Promise<{
  success: boolean;
  manager?: AiManager;
  error?: string;
}> {
  try {
    // Validate environment
    const envValidation = validateEnvironment();
    if (!envValidation.success) {
      return {
        success: false,
        error: `Environment validation failed: ${envValidation.error.errors.map(e => e.message).join(', ')}`,
      };
    }

    // Initialize AI manager
    const manager = new AiManager();

    // Check if at least one provider is available
    const providers = manager.getAvailableProviders();
    if (providers.length === 0) {
      return {
        success: false,
        error: 'No AI providers configured. Please set up API keys for Replicate or OpenAI.',
      };
    }

    console.log(`AI services initialized with ${providers.length} provider(s):`, providers.map(p => p.name));

    return {
      success: true,
      manager,
    };

  } catch (error: any) {
    console.error('Failed to initialize AI services:', error);
    return {
      success: false,
      error: error.message || 'Unknown initialization error',
    };
  }
}

// Export a default initialized instance for convenience
let defaultAiManager: AiManager | null = null;

export function getDefaultAiManager(): AiManager {
  if (!defaultAiManager) {
    defaultAiManager = new AiManager();
  }
  return defaultAiManager;
}

// Version information
export const AI_MODULE_VERSION = '1.0.0';
export const SUPPORTED_PROVIDERS = ['replicate', 'openai'];
export const SUPPORTED_MODELS = {
  replicate: ['stability-ai/sdxl', 'stability-ai/stable-diffusion', 'prompthero/openjourney'],
  openai: ['dall-e-3', 'dall-e-2'],
};

console.log(`🎨 InnDesign AI Module v${AI_MODULE_VERSION} loaded`);
console.log(`📦 Supported providers: ${SUPPORTED_PROVIDERS.join(', ')}`);
console.log(`🔧 Configuration: ${aiUtils.checkConfiguration().valid ? '✅ Valid' : '❌ Invalid'}`);