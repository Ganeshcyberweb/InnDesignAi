/**
 * Zod validation schemas for InnDesign AI database operations
 * Ensures type safety and data validation for all API endpoints
 */

import { z } from 'zod'

// ================================
// Base Schemas
// ================================

export const uuidSchema = z.string().uuid('Invalid UUID format')

export const userRoleSchema = z.enum(['CLIENT', 'DESIGNER', 'ADMIN'])

export const designStatusSchema = z.enum([
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'ARCHIVED',
])

export const feedbackTypeSchema = z.enum([
  'GENERAL',
  'QUALITY',
  'ACCURACY',
  'USABILITY',
  'FEATURE_REQUEST',
  'BUG_REPORT',
])

// ================================
// Profile Schemas
// ================================

export const createProfileSchema = z.object({
  userId: uuidSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  role: userRoleSchema.default('CLIENT'),
  avatar: z.string().url('Invalid avatar URL').optional(),
})

export const updateProfileSchema = createProfileSchema.omit({ userId: true })

// ================================
// Design Schemas
// ================================

export const preferencesSchema = z.object({
  roomType: z.string().min(1, 'Room type is required').max(50, 'Room type too long'),
  size: z.string().min(1, 'Size is required').max(50, 'Size too long'),
  stylePreference: z.string().min(1, 'Style preference is required').max(50, 'Style too long'),
  budget: z.number().min(0, 'Budget must be positive').optional(),
  colorScheme: z.string().max(100, 'Color scheme too long').optional(),
  materialPreferences: z.string().max(200, 'Material preferences too long').optional(),
  otherRequirements: z.string().max(500, 'Requirements too long').optional(),
})

export const createDesignSchema = z.object({
  userId: uuidSchema,
  inputPrompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000, 'Prompt too long'),
  uploadedImageUrl: z.string().url('Invalid image URL').optional(),
  aiModelUsed: z.string().min(1, 'AI model is required').max(50, 'AI model name too long'),
  preferences: preferencesSchema,
})

export const updateDesignStatusSchema = z.object({
  designId: uuidSchema,
  status: designStatusSchema,
})

// ================================
// Design Output Schemas
// ================================

export const createDesignOutputSchema = z.object({
  designId: uuidSchema,
  outputImageUrl: z.string().url('Invalid output image URL'),
  variationName: z.string().max(100, 'Variation name too long').optional(),
  generationParameters: z.record(z.any()).optional(),
})

// ================================
// ROI Calculation Schemas
// ================================

export const createRoiCalculationSchema = z.object({
  designId: uuidSchema,
  estimatedCost: z.number().min(0, 'Estimated cost must be positive'),
  roiPercentage: z.number().min(-100, 'ROI percentage too low').max(1000, 'ROI percentage too high'),
  paybackTimeline: z.string().max(100, 'Payback timeline too long').optional(),
  costBreakdown: z.record(z.any()).optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
})

// ================================
// Feedback Schemas
// ================================

export const createFeedbackSchema = z.object({
  designId: uuidSchema,
  userId: uuidSchema,
  rating: z.number().int('Rating must be an integer').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comments: z.string().max(1000, 'Comments too long').optional(),
  type: feedbackTypeSchema.default('GENERAL'),
  helpful: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
})

// ================================
// Query Schemas
// ================================

export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit too high').default(10),
})

export const getUserDesignsSchema = z.object({
  userId: uuidSchema,
  ...paginationSchema.shape,
  status: designStatusSchema.optional(),
  orderBy: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
  orderDirection: z.enum(['asc', 'desc']).default('desc'),
})

export const searchDesignsSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(200, 'Query too long'),
  ...paginationSchema.shape,
  userId: uuidSchema.optional(),
  status: designStatusSchema.optional(),
  roomType: z.string().max(50, 'Room type too long').optional(),
  stylePreference: z.string().max(50, 'Style preference too long').optional(),
})

// ================================
// API Request/Response Schemas
// ================================

export const apiSuccessSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
})

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
})

export const apiResponseSchema = z.union([apiSuccessSchema, apiErrorSchema])

// ================================
// Utility Functions
// ================================

/**
 * Validate data against a schema and return typed result
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: string[]
} {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
      }
    }
    return {
      success: false,
      errors: ['Validation failed'],
    }
  }
}

/**
 * Safe parse with detailed error information
 */
export function safeParseSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  error?: {
    message: string
    issues: Array<{
      path: string
      message: string
      code: string
    }>
  }
} {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return {
    success: false,
    error: {
      message: 'Validation failed',
      issues: result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
      })),
    },
  }
}

// ================================
// Type Exports
// ================================

export type CreateProfileInput = z.infer<typeof createProfileSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type PreferencesInput = z.infer<typeof preferencesSchema>
export type CreateDesignInput = z.infer<typeof createDesignSchema>
export type CreateDesignOutputInput = z.infer<typeof createDesignOutputSchema>
export type CreateRoiCalculationInput = z.infer<typeof createRoiCalculationSchema>
export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>
export type GetUserDesignsInput = z.infer<typeof getUserDesignsSchema>
export type SearchDesignsInput = z.infer<typeof searchDesignsSchema>
export type ApiSuccessResponse<T = any> = {
  success: true
  data: T
  message?: string
}
export type ApiErrorResponse = {
  success: false
  error: string
  code?: string
  details?: any
}