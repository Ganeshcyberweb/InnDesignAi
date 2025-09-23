/**
 * Next.js Middleware for Supabase Auth
 * Handles session refresh and route protection
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Define protected routes and their required roles
const PROTECTED_ROUTES = {
  '/dashboard': ['CLIENT', 'DESIGNER', 'ADMIN'],
  '/profile': ['CLIENT', 'DESIGNER', 'ADMIN'],
  '/designs': ['CLIENT', 'DESIGNER', 'ADMIN'],
  '/admin': ['ADMIN'],
  '/designer': ['DESIGNER', 'ADMIN'],
} as const

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/reset-password',
  '/confirm-email',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
]

// Profile setup route - requires authentication but no role check
const PROFILE_SETUP_ROUTE = '/profile/setup'

// API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/reset-password',
  '/api/auth/confirm',
  '/api/auth/callback',
  '/api/health',
]

// Auth routes that don't require authentication
const AUTH_ROUTES = [
  '/auth/callback',
]

// API routes that require authentication but no role check
const SETUP_API_ROUTES = [
  '/api/profile/setup',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    "https://hyokzduxwgldgtlgguin.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5b2t6ZHV4d2dsZGd0bGdndWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1OTIwMzAsImV4cCI6MjA3MzE2ODAzMH0.8_MGOUU3wV5o7rkF4dRl9jMmHc7bi2F4kNT61TYpLo4",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Handle public routes and auth callback
  if (PUBLIC_ROUTES.includes(pathname) || PUBLIC_API_ROUTES.includes(pathname) || AUTH_ROUTES.includes(pathname)) {
    // If user is authenticated and trying to access auth pages, redirect appropriately
    if (user && (pathname === '/login' || pathname === '/signup')) {
      // Check if user has a complete profile
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single()

        if (error || !profile) {
          // User needs to complete profile setup
          return NextResponse.redirect(new URL('/profile/setup', request.url))
        } else {
          // User has complete profile, redirect to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      } catch (error) {
        console.error('Error checking profile during auth page redirect:', error)
        // Default to dashboard if there's an error
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
    return response
  }

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // Setup API routes require authentication but no role check
    if (SETUP_API_ROUTES.includes(pathname)) {
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized - Please sign in' },
          { status: 401 }
        )
      }
      // Add user ID to request headers and allow access
      response.headers.set('x-user-id', user.id)
      return response
    }

    // All other API routes require authentication
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Add user ID to request headers for API routes
    response.headers.set('x-user-id', user.id)
    return response
  }

  // Handle profile setup route - requires authentication but no role check
  if (pathname === PROFILE_SETUP_ROUTE) {
    if (!user) {
      // Redirect unauthenticated users to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user already has a complete profile
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!error && profile) {
        // User already has a profile, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      console.error('Error checking profile during setup route access:', error)
      // Continue to allow access if there's an error checking profile
    }

    // Allow authenticated users without profiles to access profile setup
    response.headers.set('x-user-id', user.id)
    return response
  }

  // Handle protected routes
  if (!user) {
    // Redirect unauthenticated users to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access for protected routes
  for (const [route, requiredRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      try {
        // Get user profile to check role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single()

        if (error || !profile) {
          // For OAuth users, allow access and let the app handle profile creation
          // This prevents redirect loops after successful OAuth
          if (user.app_metadata?.provider && user.app_metadata.provider !== 'email') {
            // OAuth user - allow access, profile will be created by trigger or app logic
            response.headers.set('x-user-id', user.id)
            return response
          } else {
            // Email/password user without profile - redirect to profile setup
            return NextResponse.redirect(new URL('/profile/setup', request.url))
          }
        }

        if (!requiredRoles.includes(profile.role as any)) {
          // Redirect to unauthorized page if user doesn't have required role
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      } catch (error) {
        console.error('Middleware error checking user role:', error)
        return NextResponse.redirect(new URL('/login', request.url))
      }
      break
    }
  }

  // Add user ID to request headers for all authenticated routes
  response.headers.set('x-user-id', user.id)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}