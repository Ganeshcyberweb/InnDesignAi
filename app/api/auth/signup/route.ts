/**
 * POST /api/auth/signup
 * User registration with automatic profile creation
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { createUserProfile } from '@/app/lib/database'
import { signUpSchema, validateAuthData } from '@/app/lib/validations/auth'
import { createAuthSuccessResponse, createAuthErrorResponse, getAuthUrls } from '@/app/lib/auth/helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input data
    const validation = validateAuthData(signUpSchema, body)
    if (!validation.success) {
      return createAuthErrorResponse(
        'Validation failed',
        400,
        'VALIDATION_ERROR'
      )
    }

    const { email, password, name, company, role } = validation.data!

    const supabase = await createClient()
    const authUrls = getAuthUrls()

    // Sign up user with Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          company,
          role,
        },
        emailRedirectTo: authUrls.callback,
      },
    })

    if (authError) {
      console.error('Supabase auth signup error:', authError)

      // Handle specific auth errors
      if (authError.message.includes('User already registered')) {
        return createAuthErrorResponse(
          'An account with this email already exists',
          409,
          'USER_EXISTS'
        )
      }

      if (authError.message.includes('Password should be at least')) {
        return createAuthErrorResponse(
          'Password does not meet security requirements',
          400,
          'WEAK_PASSWORD'
        )
      }

      return createAuthErrorResponse(
        'Registration failed. Please try again.',
        400,
        'AUTH_ERROR'
      )
    }

    if (!data.user) {
      return createAuthErrorResponse(
        'Registration failed - no user data returned',
        500,
        'NO_USER_DATA'
      )
    }

    // Create user profile in database
    const { profile, error: profileError } = await createUserProfile(data.user, {
      name,
      company,
      role,
    })

    if (profileError) {
      console.error('Profile creation error:', profileError)

      // Note: User is already created in auth, but profile creation failed
      // This is recoverable - profile can be created on first sign-in
      return createAuthSuccessResponse({
        user: data.user,
        session: data.session,
        message: 'Registration successful! Please check your email to confirm your account.',
      })
    }

    // Registration successful with profile
    return createAuthSuccessResponse({
      user: data.user,
      profile,
      session: data.session,
      message: 'Registration successful! Please check your email to confirm your account.',
    })

  } catch (error) {
    console.error('Signup API error:', error)
    return createAuthErrorResponse(
      'Internal server error during registration',
      500,
      'INTERNAL_ERROR'
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}