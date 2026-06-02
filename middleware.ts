/**
 * Next.js Middleware for Supabase Auth
 * Handles session refresh and route protection
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { normalizeRole } from '@/lib/auth/roles'
import { GUEST_COOKIE_NAME } from '@/lib/guest/constants'

// Define protected routes and their required roles (canonical RBAC model).
// Legacy CLIENT/DESIGNER roles are normalized to USER before these checks.
//
// NOTE: /admin is NOT listed here. The Edge middleware queries `profiles`
// via supabase-js + the user JWT, and the table's RLS policy can hide the
// row from that client — which incorrectly demoted real super-admins to the
// USER fallback and bounced them to /dashboard. Role enforcement for the
// admin area now lives in the layout (app/admin/layout.tsx) and each admin
// route handler (lib/admin/guard.ts), both of which read the role via
// Prisma (postgres user → bypasses RLS).
const PROTECTED_ROUTES = {
  '/dashboard': ['USER', 'ADMIN', 'SUPER_ADMIN'],
  '/profile': ['USER', 'ADMIN', 'SUPER_ADMIN'],
  '/designs': ['USER', 'ADMIN', 'SUPER_ADMIN'],
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
  // Guest-trial endpoints: callable while logged out.
  '/api/guest/start',
  '/api/guest/me',
]

// API routes that work for BOTH authenticated users and guests with a valid
// guest cookie. The route handlers themselves enforce the per-guest limit.
const GUEST_ALLOWED_API_ROUTES = [
  '/api/ai/generate-themes',
]

// Page routes a guest (no auth, valid guest cookie) is allowed to load. Other
// authenticated pages (history, settings, profile, notifications) still require login.
const GUEST_ALLOWED_PAGE_ROUTES = [
  '/dashboard',
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

  const hasGuestCookie = !!request.cookies.get(GUEST_COOKIE_NAME)?.value

  // Handle public routes and auth callback
  if (PUBLIC_ROUTES.includes(pathname) || PUBLIC_API_ROUTES.includes(pathname) || AUTH_ROUTES.includes(pathname)) {
    if (user && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // Guest-allowed APIs: pass through if either authed OR a guest cookie is
    // present. The route handler does its own per-guest counter check.
    if (GUEST_ALLOWED_API_ROUTES.includes(pathname)) {
      if (!user && !hasGuestCookie) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized - Please sign in or continue as guest' },
          { status: 401 }
        )
      }
      if (user) response.headers.set('x-user-id', user.id)
      return response
    }

    // All other API routes require an authenticated user.
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Admin role enforcement for /api/admin/* lives in each handler's
    // requireAdmin (lib/admin/guard.ts) — it queries `profiles` via Prisma
    // and so isn't fooled by RLS the way a supabase-js anon-key lookup is.

    // Add user ID to request headers for API routes
    response.headers.set('x-user-id', user.id)
    return response
  }

  // Handle protected routes
  if (!user) {
    // Guests with a valid cookie may load the explicitly guest-allowed pages
    // (currently just /dashboard). Everything else still redirects to login.
    const guestAllowed = GUEST_ALLOWED_PAGE_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
    if (guestAllowed && hasGuestCookie) {
      return response
    }
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