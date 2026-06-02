/**
 * POST /api/auth/signin
 * User sign-in with email and password
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateUserProfile } from '@/lib/database'
import { signInSchema, validateAuthData } from '@/lib/validations/auth'
import { createAuthSuccessResponse, createAuthErrorResponse } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'
import {
  ipFromHeaders,
  trackAuthEvent,
  userAgentFromHeaders,
} from '@/lib/analytics/track'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input data
    const validation = validateAuthData(signInSchema, body)
    if (!validation.success) {
      return createAuthErrorResponse(
        'Validation failed',
        400,
        'VALIDATION_ERROR'
      )
    }

    const { email, password } = validation.data!

    // Extracted once for the analytics events below.
    const ipAddress = ipFromHeaders(request.headers)
    const userAgent = userAgentFromHeaders(request.headers)

    const supabase = await createClient()

    // Sign in user with Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Supabase auth signin error:', authError)

      // Record the failure once — covers all the specific error branches below.
      trackAuthEvent({
        email,
        eventType: 'signin_failed',
        ipAddress,
        userAgent,
      })

      // Handle specific auth errors
      if (authError.message.includes('Invalid login credentials')) {
        return createAuthErrorResponse(
          'Invalid email or password',
          401,
          'INVALID_CREDENTIALS'
        )
      }

      if (authError.message.includes('Email not confirmed')) {
        return createAuthErrorResponse(
          'Please confirm your email address before signing in',
          401,
          'EMAIL_NOT_CONFIRMED'
        )
      }

      if (authError.message.includes('Too many requests')) {
        return createAuthErrorResponse(
          'Too many sign-in attempts. Please try again later.',
          429,
          'RATE_LIMITED'
        )
      }

      return createAuthErrorResponse(
        'Sign-in failed. Please try again.',
        400,
        'AUTH_ERROR'
      )
    }

    if (!data.user || !data.session) {
      return createAuthErrorResponse(
        'Sign-in failed - no user data returned',
        500,
        'NO_USER_DATA'
      )
    }

    // Record the successful signin + bump last_login. Both are fire-and-forget
    // so they never delay the response.
    trackAuthEvent({
      userId: data.user.id,
      email: data.user.email ?? email,
      eventType: 'signin',
      ipAddress,
      userAgent,
    })
    prisma.profile
      .update({
        where: { userId: data.user.id },
        data: { lastLogin: new Date() },
      })
      .catch((err) => {
        // Common case: no profile row yet — getOrCreateUserProfile below will
        // create one, and we'll capture last_login on the next signin.
        console.warn('Failed to bump last_login (likely missing profile):', err?.message ?? err)
      })

    // Get or create user profile
    const { profile, error: profileError, created } = await getOrCreateUserProfile(data.user)

    if (profileError) {
      console.error('Profile error during signin:', profileError)
      // Continue with signin even if profile has issues
    }

    let message = 'Sign-in successful!'
    if (created) {
      message = 'Welcome! Your profile has been created.'
    }

    return createAuthSuccessResponse({
      user: data.user,
      profile: profile || undefined,
      session: data.session,
      message,
    })

  } catch (error) {
    console.error('Signin API error:', error)
    return createAuthErrorResponse(
      'Internal server error during sign-in',
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