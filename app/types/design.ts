import { Database } from './database'

// Database types
export type Design = Database['public']['Tables']['designs']['Row']
export type DesignOutput = Database['public']['Tables']['design_outputs']['Row']
export type Preferences = Database['public']['Tables']['preferences']['Row']
export type RoiCalculation = Database['public']['Tables']['roi_calculations']['Row']
export type Feedback = Database['public']['Tables']['feedback']['Row']

// Extended types for frontend
export interface DesignWithRelations extends Design {
  preferences?: Preferences
  design_outputs: DesignOutput[]
  roi_calculation?: RoiCalculation
  feedback: Feedback[]
}

export interface GenerationRequest {
  input_prompt: string
  uploaded_image_file?: File
  ai_model: string
  preferences: {
    room_type: string
    size: string
    style_preference: string
    budget?: number
    color_scheme?: string
    material_preferences?: string
    other_requirements?: string
  }
  generation_count: number
  advanced_parameters?: GenerationParameters
}

export interface GenerationParameters {
  seed?: number
  guidance_scale?: number
  num_inference_steps?: number
  negative_prompt?: string
  style_strength?: number
  composition_strength?: number
}

export interface AIProvider {
  id: string
  name: string
  description: string
  models: AIModel[]
  pricing: {
    cost_per_image: number
    currency: string
  }
  capabilities: string[]
  max_variations: number
}

export interface AIModel {
  id: string
  name: string
  description: string
  provider: string
  type: 'image-generation' | 'image-editing' | 'style-transfer'
  resolution: string
  generation_time_estimate: number // seconds
  cost_per_image: number
}

export interface CostEstimate {
  total_cost: number
  cost_per_image: number
  estimated_time: number // seconds
  breakdown: {
    model_cost: number
    storage_cost: number
    processing_cost: number
  }
  currency: string
}

export interface GenerationProgress {
  id: string
  status: 'queued' | 'processing' | 'generating' | 'post-processing' | 'completed' | 'failed'
  progress: number // 0-100
  current_step: string
  estimated_completion: number // seconds remaining
  errors?: string[]
  partial_results?: string[] // URLs to partial/preview images
}

export interface QuickPrompt {
  id: string
  title: string
  prompt: string
  category: 'style' | 'room' | 'mood' | 'special'
  preview_image?: string
  tags: string[]
}

export interface DesignFilter {
  status?: Design['status'][]
  room_type?: string[]
  style_preference?: string[]
  ai_model?: string[]
  date_range?: {
    start: Date
    end: Date
  }
  budget_range?: {
    min: number
    max: number
  }
  rating_min?: number
  search_query?: string
}

export interface DesignStats {
  total_designs: number
  total_spent: number
  total_time_saved: number
  favorite_style: string
  most_used_room: string
  average_rating: number
  monthly_usage: {
    month: string
    count: number
    cost: number
  }[]
}

// Image handling types
export interface ImageUpload {
  file: File
  preview: string
  upload_progress: number
  status: 'pending' | 'uploading' | 'completed' | 'failed'
  error?: string
}

export interface ImageDownload {
  url: string
  filename: string
  resolution: string
  format: 'jpg' | 'png' | 'webp'
  size_mb: number
}

// Sharing types
export interface DesignShare {
  id: string
  design_id: string
  public_url: string
  expires_at?: Date
  access_count: number
  password_protected: boolean
  allow_download: boolean
  created_at: Date
}

// Feedback types
export interface DesignFeedback {
  rating: number
  comments?: string
  type: Database['public']['Enums']['FeedbackType']
  helpful?: boolean
  specific_areas?: {
    creativity: number
    accuracy: number
    quality: number
    usefulness: number
  }
}

// Regeneration types
export interface RegenerationRequest {
  original_design_id: string
  modifications: {
    prompt_changes?: string
    style_adjustments?: string
    color_changes?: string
    layout_changes?: string
  }
  preserve_elements?: string[]
  variation_strength: number // 0-1, how different from original
}

// Room and style presets
export const ROOM_TYPES = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Dining Room',
  'Home Office',
  'Nursery',
  'Guest Room',
  'Basement',
  'Attic',
  'Hallway',
  'Balcony',
  'Patio',
  'Garage',
  'Laundry Room',
  'Walk-in Closet',
  'Pantry',
  'Library',
  'Game Room',
  'Studio',
  'Workshop'
] as const

export const STYLE_PREFERENCES = [
  'Modern',
  'Contemporary',
  'Traditional',
  'Transitional',
  'Industrial',
  'Scandinavian',
  'Bohemian',
  'Mid-Century Modern',
  'Farmhouse',
  'Mediterranean',
  'Colonial',
  'Victorian',
  'Art Deco',
  'Minimalist',
  'Rustic',
  'Eclectic',
  'Glam',
  'Coastal',
  'Country',
  'Asian Zen',
  'Gothic',
  'Southwest',
  'Prairie',
  'Craftsman'
] as const

export const COLOR_SCHEMES = [
  'Neutral',
  'Monochromatic',
  'Warm',
  'Cool',
  'Bold & Vibrant',
  'Pastel',
  'Earth Tones',
  'Black & White',
  'Jewel Tones',
  'Muted',
  'High Contrast'
] as const

export const ROOM_SIZES = [
  'Small (< 150 sq ft)',
  'Medium (150-300 sq ft)',
  'Large (300-500 sq ft)',
  'Extra Large (> 500 sq ft)'
] as const

export type RoomType = typeof ROOM_TYPES[number]
export type StylePreference = typeof STYLE_PREFERENCES[number]
export type ColorScheme = typeof COLOR_SCHEMES[number]
export type RoomSize = typeof ROOM_SIZES[number]