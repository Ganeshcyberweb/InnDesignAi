/**
 * GET /api/auth/callback
 * Handle auth callbacks from Supabase (OAuth, email confirmations, etc.)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { getOrCreateUserProfile } from '@/app/lib/database'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const error_description = requestUrl.searchParams.get('error_description')
    const next = requestUrl.searchParams.get('next') || '/dashboard'

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, error_description)
      const errorUrl = new URL('/auth/signin', requestUrl.origin)
      errorUrl.searchParams.set('error', error)
      if (error_description) {
        errorUrl.searchParams.set('error_description', error_description)
      }
      return NextResponse.redirect(errorUrl)
    }

    if (!code) {
      console.error('No authorization code provided')
      const errorUrl = new URL('/auth/signin', requestUrl.origin)
      errorUrl.searchParams.set('error', 'no_code')
      return NextResponse.redirect(errorUrl)
    }

    const supabase = await createClient()

    // Exchange the authorization code for a session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      const errorUrl = new URL('/auth/signin', requestUrl.origin)
      errorUrl.searchParams.set('error', 'exchange_failed')
      return NextResponse.redirect(errorUrl)
    }

    if (!data.user || !data.session) {
      console.error('No user or session data after code exchange')
      const errorUrl = new URL('/auth/signin', requestUrl.origin)
      errorUrl.searchParams.set('error', 'no_session')
      return NextResponse.redirect(errorUrl)
    }

    // Get or create user profile
    const { profile, error: profileError, created } = await getOrCreateUserProfile(data.user)

    if (profileError) {
      console.error('Profile error during callback:', profileError)
      // Continue to redirect even if profile has issues - can be resolved later
    }

    // Redirect to the appropriate page
    let redirectUrl: string

    if (created) {
      // New user - redirect to profile setup
      redirectUrl = '/profile/setup?welcome=true'
    } else {
      // Existing user - redirect to requested page or dashboard
      redirectUrl = next.startsWith('/') ? next : '/dashboard'
    }

    const successUrl = new URL(redirectUrl, requestUrl.origin)

    // Add success parameter to URL
    successUrl.searchParams.set('authenticated', 'true')

    return NextResponse.redirect(successUrl)

  } catch (error) {
    console.error('Auth callback error:', error)
    const errorUrl = new URL('/auth/signin', request.url)
    errorUrl.searchParams.set('error', 'callback_error')
    return NextResponse.redirect(errorUrl)
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET' } }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET' } }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET' } }
  )
}