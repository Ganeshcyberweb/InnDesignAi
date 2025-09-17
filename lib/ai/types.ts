export interface AiProvider {
  name: string;
  models: string[];
  generateImage: (prompt: string, options?: GenerationOptions) => Promise<GenerationResult>;
  estimateCost: (options?: GenerationOptions) => number;
}

export interface GenerationOptions {
  model?: string;
  width?: number;
  height?: number;
  numOutputs?: number;
  guidanceScale?: number;
  numInferenceSteps?: number;
  seed?: number;
  style?: string;
  quality?: 'standard' | 'hd';
}

export interface GenerationResult {
  success: boolean;
  images: string[];
  cost: number;
  modelUsed: string;
  parameters: GenerationOptions;
  metadata?: {
    seed?: number;
    processingTime?: number;
    provider: string;
  };
  error?: string;
}

export interface PromptTemplate {
  room_type: string;
  style_preference: string;
  size: string;
  budget_level: 'budget' | 'mid_range' | 'luxury';
  color_scheme?: string;
  material_preferences?: string[];
  additional_requirements?: string;
  uploaded_image_context?: string;
}

export interface DesignGenerationRequest {
  userId: string;
  designId: string;
  prompt_template: PromptTemplate;
  preferences: {
    room_type: string;
    style_preference: string;
    size: string;
    budget: string;
    color_scheme?: string;
    material_preferences?: string[];
    other_requirements?: string;
  };
  provider?: 'replicate' | 'openai';
  model?: string;
  num_variations?: number;
}

export type AiProviderName = 'replicate' | 'openai';

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  rateLimit?: {
    requestsPerMinute: number;
    tokensPerMinute?: number;
  };
}