/**
 * Authentication validation schemas using Zod
 * Provides type-safe validation for all auth-related API endpoints
 */

import { z } from 'zod'

// User role validation
export const userRoleSchema = z.enum(['CLIENT', 'DESIGNER', 'ADMIN'])

// Email validation (more strict than default)
const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email must not exceed 254 characters')
  .toLowerCase()
  .trim()

// Password validation with security requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number')

// Name validation
const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must not exceed 100 characters')
  .trim()
  .optional()

// Company validation
const companySchema = z
  .string()
  .max(200, 'Company name must not exceed 200 characters')
  .trim()
  .optional()

// Sign up validation schema
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  company: companySchema,
  role: userRoleSchema.optional().default('CLIENT'),
})

export type SignUpData = z.infer<typeof signUpSchema>

// Sign in validation schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional().default(false),
})

export type SignInData = z.infer<typeof signInSchema>

// Password reset request schema
export const resetPasswordRequestSchema = z.object({
  email: emailSchema,
})

export type ResetPasswordRequestData = z.infer<typeof resetPasswordRequestSchema>

// Password reset confirmation schema
export const resetPasswordConfirmSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ResetPasswordConfirmData = z.infer<typeof resetPasswordConfirmSchema>

// Email confirmation schema
export const confirmEmailSchema = z.object({
  token: z.string().min(1, 'Confirmation token is required'),
  email: emailSchema,
})

export type ConfirmEmailData = z.infer<typeof confirmEmailSchema>

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .optional(),
  company: z
    .string()
    .max(200, 'Company name must not exceed 200 characters')
    .trim()
    .optional()
    .nullable(),
  role: userRoleSchema.optional(),
  avatar: z
    .string()
    .url('Avatar must be a valid URL')
    .optional()
    .nullable(),
})

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

// Change password schema (for authenticated users)
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
})

export type ChangePasswordData = z.infer<typeof changePasswordSchema>

// Resend confirmation email schema
export const resendConfirmationSchema = z.object({
  email: emailSchema,
})

export type ResendConfirmationData = z.infer<typeof resendConfirmationSchema>

// Query parameter validation for auth callbacks
export const authCallbackSchema = z.object({
  code: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
  token_type: z.string().optional(),
  expires_in: z.string().optional(),
})

export type AuthCallbackData = z.infer<typeof authCallbackSchema>

// User profile response schema (for API responses)
export const userProfileResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().nullable(),
  company: z.string().nullable(),
  role: userRoleSchema,
  avatar: z.string().url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>

// API response schemas
export const authSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    user: z.any(), // Supabase User type
    profile: userProfileResponseSchema.optional(),
    session: z.any().optional(), // Supabase Session type
  }),
  message: z.string().optional(),
})

export const authErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
})

export type AuthSuccessResponse = z.infer<typeof authSuccessResponseSchema>
export type AuthErrorResponse = z.infer<typeof authErrorResponseSchema>

// Combined response type
export type AuthResponse = AuthSuccessResponse | AuthErrorResponse

// Profile setup validation schema for initial setup
export const profileSetupSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  role: z.enum(['CLIENT', 'DESIGNER', 'ADMIN'], {
    required_error: 'Please select your role'
  }),
  company: z
    .string()
    .max(200, 'Company name must not exceed 200 characters')
    .trim()
    .optional(),
  avatar: z
    .any()
    .optional(), // Will be a File object from FormData
}).refine((data) => {
  if (data.role === 'DESIGNER' && (!data.company || data.company.trim().length === 0)) {
    return false
  }
  return true
}, {
  message: 'Company name is required for designers',
  path: ['company'],
})

export type ProfileSetupData = z.infer<typeof profileSetupSchema>

/**
 * Validation helper function that returns formatted error messages
 */
export function validateAuthData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string>
  message?: string
} {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return {
        success: false,
        errors,
        message: 'Validation failed',
      }
    }
    return {
      success: false,
      message: 'Validation error occurred',
    }
  }
}

/**
 * Sanitize and validate email input
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/**
 * Check password strength
 */
export function getPasswordStrength(password: string): {
  score: number // 0-4
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  else feedback.push('Use at least 8 characters')

  if (/[a-z]/.test(password)) score++
  else feedback.push('Include lowercase letters')

  if (/[A-Z]/.test(password)) score++
  else feedback.push('Include uppercase letters')

  if (/\d/.test(password)) score++
  else feedback.push('Include numbers')

  if (/[^a-zA-Z\d]/.test(password)) {
    score++
    feedback.push('Great! You included special characters')
  } else {
    feedback.push('Consider adding special characters')
  }

  // Cap score at 4
  score = Math.min(score, 4)

  return { score, feedback }
}