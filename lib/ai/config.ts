import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // Database
  DATABASE_URL: z.string().url(),

  // AI Providers (optional - at least one must be configured)
  REPLICATE_API_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),

  // Optional: Additional AI providers
  STABILITY_API_KEY: z.string().optional(),

  // Application settings
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export interface AiConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  providers: {
    replicate: {
      enabled: boolean;
      apiKey?: string;
    };
    openai: {
      enabled: boolean;
      apiKey?: string;
    };
    stability: {
      enabled: boolean;
      apiKey?: string;
    };
  };
  storage: {
    bucketName: string;
    maxFileSize: number;
    allowedMimeTypes: string[];
  };
  generation: {
    maxDailyCostPerUser: number;
    defaultProvider: 'replicate' | 'openai';
    fallbackProvider: 'replicate' | 'openai';
    maxVariationsPerRequest: number;
    defaultNumVariations: number;
  };
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
}

// Validate environment variables
export function validateEnvironment(): z.SafeParseReturnType<any, any> {
  return envSchema.safeParse(process.env);
}

// Get validated configuration
export function getAiConfig(): AiConfig {
  const env = validateEnvironment();

  if (!env.success) {
    console.error('Environment validation failed:', env.error.errors);
    throw new Error('Invalid environment configuration');
  }

  const data = env.data;

  // Check that at least one AI provider is configured
  const hasReplicate = !!data.REPLICATE_API_TOKEN;
  const hasOpenAI = !!data.OPENAI_API_KEY;

  if (!hasReplicate && !hasOpenAI) {
    throw new Error('At least one AI provider (Replicate or OpenAI) must be configured');
  }

  return {
    supabase: {
      url: data.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    providers: {
      replicate: {
        enabled: hasReplicate,
        apiKey: data.REPLICATE_API_TOKEN,
      },
      openai: {
        enabled: hasOpenAI,
        apiKey: data.OPENAI_API_KEY,
      },
      stability: {
        enabled: !!data.STABILITY_API_KEY,
        apiKey: data.STABILITY_API_KEY,
      },
    },
    storage: {
      bucketName: 'design-images',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    generation: {
      maxDailyCostPerUser: 10.0, // $10 per day
      defaultProvider: hasReplicate ? 'replicate' : 'openai',
      fallbackProvider: hasOpenAI ? 'openai' : 'replicate',
      maxVariationsPerRequest: 5,
      defaultNumVariations: 3,
    },
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerHour: 100,
      requestsPerDay: 200,
    },
  };
}

// Configuration constants
export const AI_MODELS = {
  replicate: {
    sdxl: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    stableDiffusion: 'stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
    openjourney: 'prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb',
  },
  openai: {
    dalle3: 'dall-e-3',
    dalle2: 'dall-e-2',
  },
} as const;

export const STYLE_PROMPTS = {
  modern: 'clean lines, minimalist, contemporary furniture, neutral colors, geometric shapes',
  traditional: 'classic furniture, rich textures, warm colors, ornate details, timeless elements',
  scandinavian: 'light woods, white and neutral tones, cozy textures, functional design, hygge',
  industrial: 'exposed brick, metal accents, concrete, Edison bulbs, urban aesthetic',
  bohemian: 'eclectic patterns, vibrant colors, layered textures, plants, artistic elements',
  minimalist: 'clean spaces, essential furniture only, monochromatic, uncluttered',
  rustic: 'natural materials, wood beams, stone, earthy colors, cozy atmosphere',
  contemporary: 'current trends, mixed materials, bold accents, innovative design',
} as const;

export const ROOM_SPECIFICS = {
  living_room: 'comfortable seating arrangements, focal point, natural lighting, entertainment area',
  bedroom: 'restful atmosphere, privacy, storage solutions, comfortable bedding',
  kitchen: 'functional workflow, storage, food preparation areas, dining integration',
  bathroom: 'clean lines, moisture resistance, storage, privacy, lighting',
  dining_room: 'entertaining space, table focal point, ambient lighting',
  home_office: 'productivity focus, ergonomic furniture, organization, natural lighting',
  outdoor: 'weather-resistant materials, natural integration, outdoor living comfort',
} as const;

export const BUDGET_MATERIALS = {
  budget: 'affordable materials, laminate, engineered wood, budget-friendly textiles, DIY elements',
  mid_range: 'quality materials, solid wood accents, branded appliances, designer-inspired pieces',
  luxury: 'premium materials, natural stone, hardwood floors, high-end appliances, custom furniture',
} as const;

// Validation helper functions
export function isValidProvider(provider: string): provider is 'replicate' | 'openai' {
  return ['replicate', 'openai'].includes(provider);
}

export function isValidModel(provider: 'replicate' | 'openai', model: string): boolean {
  if (provider === 'replicate') {
    return Object.values(AI_MODELS.replicate).includes(model as any);
  } else if (provider === 'openai') {
    return Object.values(AI_MODELS.openai).includes(model as any);
  }
  return false;
}

export function isValidStyle(style: string): style is keyof typeof STYLE_PROMPTS {
  return Object.keys(STYLE_PROMPTS).includes(style);
}

export function isValidRoom(room: string): room is keyof typeof ROOM_SPECIFICS {
  return Object.keys(ROOM_SPECIFICS).includes(room);
}

export function isValidBudget(budget: string): budget is keyof typeof BUDGET_MATERIALS {
  return Object.keys(BUDGET_MATERIALS).includes(budget);
}

// Cost estimation utilities
export const PRICING = {
  replicate: {
    sdxl: 0.002, // $0.002 per image
    stableDiffusion: 0.0012, // $0.0012 per image
    openjourney: 0.001, // $0.001 per image
  },
  openai: {
    dalle3: {
      standard_1024: 0.04, // $0.04 per 1024x1024 standard
      standard_wide: 0.08, // $0.08 per 1024x1792 or 1792x1024 standard
      hd_1024: 0.08, // $0.08 per 1024x1024 HD
      hd_wide: 0.12, // $0.12 per 1024x1792 or 1792x1024 HD
    },
    dalle2: {
      size_1024: 0.02, // $0.02 per 1024x1024
      size_512: 0.018, // $0.018 per 512x512
      size_256: 0.016, // $0.016 per 256x256
    },
  },
} as const;

// Error codes for AI operations
export const AI_ERROR_CODES = {
  PROVIDER_UNAVAILABLE: 'PROVIDER_UNAVAILABLE',
  API_KEY_INVALID: 'API_KEY_INVALID',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  COST_LIMIT_EXCEEDED: 'COST_LIMIT_EXCEEDED',
  INVALID_PROMPT: 'INVALID_PROMPT',
  GENERATION_FAILED: 'GENERATION_FAILED',
  STORAGE_FAILED: 'STORAGE_FAILED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type AiErrorCode = keyof typeof AI_ERROR_CODES;