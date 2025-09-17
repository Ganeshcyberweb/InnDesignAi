/**
 * GET/PATCH /api/auth/profile
 * Get and update user profile
 */

import { NextRequest, NextResponse } from 'next/server'
import { getUserProfile, updateUserProfile } from '@/app/lib/database'
import { profileUpdateSchema, validateAuthData } from '@/app/lib/validations/auth'
import { createAuthSuccessResponse, createAuthErrorResponse, protectApiRoute } from '@/app/lib/auth/helpers'

export async function GET(request: NextRequest) {
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

    // Get complete profile data
    const { profile: fullProfile, error: profileError } = await getUserProfile(user.id)

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return createAuthErrorResponse(
        'Failed to fetch profile',
        500,
        'PROFILE_FETCH_ERROR'
      )
    }

    return createAuthSuccessResponse({
      profile: fullProfile,
      message: 'Profile retrieved successfully',
    })

  } catch (error) {
    console.error('Profile GET API error:', error)
    return createAuthErrorResponse(
      'Internal server error',
      500,
      'INTERNAL_ERROR'
    )
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json()

    // Validate input data
    const validation = validateAuthData(profileUpdateSchema, body)
    if (!validation.success) {
      return createAuthErrorResponse(
        'Validation failed',
        400,
        'VALIDATION_ERROR'
      )
    }

    const updateData = validation.data!

    // Remove undefined values to avoid overwriting with undefined
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    )

    // Update profile in database
    const { profile: updatedProfile, error: updateError } = await updateUserProfile(
      user.id,
      cleanUpdateData
    )

    if (updateError) {
      console.error('Profile update error:', updateError)
      return createAuthErrorResponse(
        'Failed to update profile',
        500,
        'PROFILE_UPDATE_ERROR'
      )
    }

    return createAuthSuccessResponse({
      profile: updatedProfile,
      message: 'Profile updated successfully',
    })

  } catch (error) {
    console.error('Profile PATCH API error:', error)
    return createAuthErrorResponse(
      'Internal server error',
      500,
      'INTERNAL_ERROR'
    )
  }
}

export async function PUT(request: NextRequest) {
  // PUT and PATCH have the same functionality for profile updates
  return PATCH(request)
}

export async function DELETE(request: NextRequest) {
  try {
    // Protect the route and get authenticated user
    const { user, error } = await protectApiRoute(request)

    if (error) {
      return error
    }

    if (!user) {
      return createAuthErrorResponse(
        'User not found',
        404,
        'NOT_FOUND'
      )
    }

    // Delete profile and all associated data
    const { deleteUserProfile } = await import('@/app/lib/database')
    const { success, error: deleteError } = await deleteUserProfile(user.id)

    if (!success || deleteError) {
      console.error('Profile deletion error:', deleteError)
      return createAuthErrorResponse(
        'Failed to delete profile',
        500,
        'PROFILE_DELETE_ERROR'
      )
    }

    // Also delete the user from Supabase Auth
    const { createClient } = await import('@/app/lib/supabase/server')
    const supabase = await createClient()

    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id)

    if (authDeleteError) {
      console.error('Auth user deletion error:', authDeleteError)
      // Profile is already deleted, so we continue
    }

    return createAuthSuccessResponse({
      message: 'Profile deleted successfully',
    })

  } catch (error) {
    console.error('Profile DELETE API error:', error)
    return createAuthErrorResponse(
      'Internal server error',
      500,
      'INTERNAL_ERROR'
    )
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET, PATCH, PUT, DELETE' } }
  )
}