/**
 * POST /api/auth/reset-password
 * Send password reset email
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resetPasswordRequestSchema, validateAuthData } from '@/lib/validations/auth'
import { createAuthSuccessResponse, createAuthErrorResponse, getAuthUrls } from '@/lib/auth/helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input data
    const validation = validateAuthData(resetPasswordRequestSchema, body)
    if (!validation.success) {
      return createAuthErrorResponse(
        'Validation failed',
        400,
        'VALIDATION_ERROR'
      )
    }

    const { email } = validation.data!

    const supabase = await createClient()
    const authUrls = getAuthUrls()

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${authUrls.resetPassword}?step=2`, // Step 2 = new password form
    })

    if (error) {
      console.error('Supabase password reset error:', error)

      // Don't reveal specific errors for security reasons
      // Always return success message to prevent email enumeration
      return createAuthSuccessResponse({
        message: 'If an account with that email exists, a password reset link has been sent.',
      })
    }

    return createAuthSuccessResponse({
      message: 'If an account with that email exists, a password reset link has been sent.',
    })

  } catch (error) {
    console.error('Reset password API error:', error)
    return createAuthErrorResponse(
      'Internal server error during password reset',
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