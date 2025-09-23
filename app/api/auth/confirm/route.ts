/**
 * POST /api/auth/confirm
 * Confirm email address or password reset
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resetPasswordConfirmSchema, validateAuthData } from '@/lib/validations/auth'
import { createAuthSuccessResponse, createAuthErrorResponse, protectApiRoute } from '@/lib/auth/helpers'

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token_hash = url.searchParams.get('token_hash')
    const type = url.searchParams.get('type')

    if (!token_hash || !type) {
      return createAuthErrorResponse(
        'Missing required parameters',
        400,
        'MISSING_PARAMETERS'
      )
    }

    const supabase = await createClient()

    // Handle email confirmation
    if (type === 'email') {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: 'email',
      })

      if (error) {
        console.error('Email confirmation error:', error)
        return createAuthErrorResponse(
          'Email confirmation failed. The link may be expired or invalid.',
          400,
          'CONFIRMATION_ERROR'
        )
      }

      return createAuthSuccessResponse({
        user: data.user || undefined,
        session: data.session || undefined,
        message: 'Email confirmed successfully!',
      })
    }

    // Handle password reset confirmation
    if (type === 'recovery') {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: 'recovery',
      })

      if (error) {
        console.error('Recovery confirmation error:', error)
        return createAuthErrorResponse(
          'Password reset link is invalid or expired.',
          400,
          'RECOVERY_ERROR'
        )
      }

      // For password reset, we need to update the password
      const body = await request.json()
      const validation = validateAuthData(resetPasswordConfirmSchema, body)

      if (!validation.success) {
        return createAuthErrorResponse(
          'Invalid password format',
          400,
          'VALIDATION_ERROR'
        )
      }

      const { password } = validation.data!

      // Update password
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        console.error('Password update error:', updateError)
        return createAuthErrorResponse(
          'Failed to update password',
          400,
          'PASSWORD_UPDATE_ERROR'
        )
      }

      return createAuthSuccessResponse({
        user: updateData.user,
        message: 'Password updated successfully!',
      })
    }

    return createAuthErrorResponse(
      'Invalid confirmation type',
      400,
      'INVALID_TYPE'
    )

  } catch (error) {
    console.error('Confirm API error:', error)
    return createAuthErrorResponse(
      'Internal server error during confirmation',
      500,
      'INTERNAL_ERROR'
    )
  }
}

// Handle GET requests for email/recovery confirmations from email links
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token_hash = url.searchParams.get('token_hash')
    const type = url.searchParams.get('type')

    if (!token_hash || !type) {
      return NextResponse.redirect(new URL('/auth/signin?error=invalid_link', request.url))
    }

    const supabase = await createClient()

    if (type === 'email') {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: 'email',
      })

      if (error) {
        return NextResponse.redirect(new URL('/auth/signin?error=confirmation_failed', request.url))
      }

      return NextResponse.redirect(new URL('/dashboard?confirmed=true', request.url))
    }

    if (type === 'recovery') {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: 'recovery',
      })

      if (error) {
        return NextResponse.redirect(new URL('/auth/reset-password?error=invalid_link', request.url))
      }

      return NextResponse.redirect(new URL('/auth/reset-password?step=2', request.url))
    }

    return NextResponse.redirect(new URL('/auth/signin?error=invalid_type', request.url))

  } catch (error) {
    console.error('Confirm GET API error:', error)
    return NextResponse.redirect(new URL('/auth/signin?error=server_error', request.url))
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET, POST' } }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET, POST' } }
  )
}