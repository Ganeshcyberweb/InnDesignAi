/**
 * POST /api/profile/setup
 * Handle initial profile setup with optional avatar upload
 */

import { NextRequest, NextResponse } from 'next/server'
import { getUserProfile, updateUserProfile } from '@/app/lib/database'
import { profileSetupSchema, validateAuthData } from '@/app/lib/validations/auth'
import { createAuthSuccessResponse, createAuthErrorResponse, protectApiRoute } from '@/app/lib/auth/helpers'
import { uploadAvatar, ensureAvatarsBucket, validateAvatarFile } from '@/app/lib/storage/avatar-upload'
import type { UserRole } from '@/src/generated/prisma'

export async function POST(request: NextRequest) {
  try {
    // Protect the route and get authenticated user
    const { user, profile, error } = await protectApiRoute(request)

    if (error) {
      return error
    }

    if (!user || !profile) {
      return createAuthErrorResponse(
        'User or profile not found',
        404,
        'NOT_FOUND'
      )
    }

    // Check if profile is already completed (has name and role)
    if (profile.name && profile.role) {
      return createAuthErrorResponse(
        'Profile setup has already been completed',
        409,
        'PROFILE_ALREADY_COMPLETED'
      )
    }

    // Parse FormData
    const formData = await request.formData()

    // Extract form fields
    const formFields = {
      name: formData.get('name')?.toString()?.trim(),
      role: formData.get('role')?.toString() as UserRole,
      company: formData.get('company')?.toString()?.trim() || undefined,
      avatar: formData.get('avatar') as File | null
    }

    // Validate form data (excluding avatar file which needs special handling)
    const dataToValidate = {
      name: formFields.name,
      role: formFields.role,
      company: formFields.company,
      avatar: formFields.avatar ? 'file' : undefined // Just indicate presence for validation
    }

    const validation = validateAuthData(profileSetupSchema, dataToValidate)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validation.errors
        },
        { status: 400 }
      )
    }

    const validatedData = validation.data!

    // Prepare update data
    const updateData: {
      name: string
      role: UserRole
      company?: string
      avatar?: string
    } = {
      name: validatedData.name,
      role: validatedData.role,
      company: validatedData.company
    }

    // Handle avatar upload if provided
    if (formFields.avatar && formFields.avatar.size > 0) {
      // Validate avatar file
      const avatarValidation = validateAvatarFile(formFields.avatar)
      if (!avatarValidation.valid) {
        return createAuthErrorResponse(
          avatarValidation.error!,
          400,
          'INVALID_AVATAR_FILE'
        )
      }

      // Ensure avatars bucket exists
      const bucketReady = await ensureAvatarsBucket()
      if (!bucketReady) {
        return createAuthErrorResponse(
          'Failed to prepare avatar storage',
          500,
          'STORAGE_ERROR'
        )
      }

      // Upload avatar
      const uploadResult = await uploadAvatar(user.id, formFields.avatar)
      if (!uploadResult.success) {
        return createAuthErrorResponse(
          uploadResult.error || 'Failed to upload avatar',
          500,
          'AVATAR_UPLOAD_ERROR'
        )
      }

      updateData.avatar = uploadResult.avatarUrl
    }

    // Update profile in database
    const { profile: updatedProfile, error: updateError } = await updateUserProfile(
      user.id,
      updateData
    )

    if (updateError) {
      console.error('Profile setup error:', updateError)
      return createAuthErrorResponse(
        'Failed to complete profile setup',
        500,
        'PROFILE_SETUP_ERROR'
      )
    }

    // Get complete profile data with relationships
    const { profile: fullProfile, error: profileError } = await getUserProfile(user.id)

    if (profileError) {
      console.error('Profile fetch error after update:', profileError)
      // Return basic updated profile if full fetch fails
      return createAuthSuccessResponse({
        profile: updatedProfile,
        message: 'Profile setup completed successfully'
      })
    }

    return createAuthSuccessResponse({
      profile: fullProfile,
      message: 'Profile setup completed successfully'
    })

  } catch (error) {
    console.error('Profile setup API error:', error)
    return createAuthErrorResponse(
      'Internal server error',
      500,
      'INTERNAL_ERROR'
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed. Use POST for profile setup.' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}

export async function PATCH() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed. Use POST for profile setup or use /api/auth/profile for updates.' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed. Use POST for profile setup or use /api/auth/profile for updates.' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed. Use POST for profile setup.' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}