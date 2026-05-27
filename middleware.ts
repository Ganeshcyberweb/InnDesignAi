/**
 * Next.js Middleware for Supabase Auth
 * Handles session refresh and route protection
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { normalizeRole, isAdminRole } from '@/lib/auth/roles'

// Define protected routes and their required roles (canonical RBAC model).
// Legacy CLIENT/DESIGNER roles are normalized to USER before these checks.
const PROTECTED_ROUTES = {
  '/dashboard': ['USER', 'ADMIN', 'SUPER_ADMIN'],
  '/profile': ['USER', 'ADMIN', 'SUPER_ADMIN'],
  '/designs': ['USER', 'ADMIN', 'SUPER_ADMIN'],
  '/admin': ['ADMIN', 'SUPER_ADMIN'],
} as const

// Public routes that don't require authentication.
// Marketing / informational pages are intentionally open so visitors can
// browse the site (and refresh on them) without being redirected to login.
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/reset-password',
  '/confirm-email',
  '/about',
  '/features',
  '/pricing',
  '/guide',
  '/help',
  '/support',
  '/contact',
  '/privacy',
  '/terms',
]


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
    if (user && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // All API routes require authentication
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Admin APIs require an admin role — return a proper 403 otherwise.
    if (pathname.startsWith('/api/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!isAdminRole(profile?.role)) {
        return NextResponse.json(
          { success: false, error: 'Forbidden - Admin access required' },
          { status: 403 }
        )
      }
    }

    // Add user ID to request headers for API routes
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
      // Default to USER when the profile is missing/unreadable: regular routes
      // stay accessible, admin routes are denied. Legacy roles are normalized.
      let role: string = 'USER'
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single()
        role = normalizeRole(profile?.role)
      } catch (error) {
        console.error('Middleware error checking user role:', error)
      }

      if (!(requiredRoles as readonly string[]).includes(role)) {
        // Insufficient role — send them to a page they can access.
        return NextResponse.redirect(new URL('/dashboard', request.url))
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