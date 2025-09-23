/**
 * POST /api/auth/signout
 * User sign-out and session cleanup
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAuthSuccessResponse, createAuthErrorResponse } from '@/lib/auth/helpers'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Sign out user from Supabase Auth
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Supabase auth signout error:', error)
      return createAuthErrorResponse(
        'Sign-out failed. Please try again.',
        400,
        'SIGNOUT_ERROR'
      )
    }

    return createAuthSuccessResponse({
      message: 'Sign-out successful',
    })

  } catch (error) {
    console.error('Signout API error:', error)
    return createAuthErrorResponse(
      'Internal server error during sign-out',
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