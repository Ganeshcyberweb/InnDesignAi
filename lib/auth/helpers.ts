/**
 * Authentication helper functions
 * Provides utilities for session management, route protection, and user operations
 */

import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import { createClient, getUser, getSession } from '@/lib/supabase/server'
import { getUserProfile, getOrCreateUserProfile } from '@/lib/database'
import type { User, Session } from '@supabase/supabase-js'
import type { UserRole } from '@/lib/generated/prisma'

export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    name?: string
    avatar_url?: string
    [key: string]: any
  }
  app_metadata: {
    provider?: string
    providers?: string[]
    [key: string]: any
  }
  created_at: string
  updated_at?: string
  last_sign_in_at?: string
  email_confirmed_at?: string
}

export interface AuthProfile {
  id: string
  userId: string
  name: string | null
  company: string | null
  role: UserRole
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  user: AuthUser
  profile: AuthProfile
  session: Session
}

/**
 * Get authenticated user with profile - server-side only
 */
export async function getAuthUser(): Promise<AuthSession | null> {
  try {
    const { user, error: userError } = await getUser()

    if (userError || !user) {
      return null
    }

    const { session, error: sessionError } = await getSession()

    if (sessionError || !session) {
      return null
    }

    const { profile, error: profileError } = await getUserProfile(user.id)

    if (profileError || !profile) {
      // Try to create profile if it doesn't exist
      const { profile: newProfile } = await getOrCreateUserProfile(user)
      if (!newProfile) {
        return null
      }

      return {
        user: user as AuthUser,
        profile: newProfile as AuthProfile,
        session
      }
    }

    return {
      user: user as AuthUser,
      profile: profile as AuthProfile,
      session
    }
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(redirectTo: string = '/auth/signin'): Promise<AuthSession> {
  const authUser = await getAuthUser()

  if (!authUser) {
    redirect(redirectTo)
  }

  return authUser
}

/**
 * Require specific role - redirects if user doesn't have required role
 */
export async function requireRole(
  requiredRole: UserRole | UserRole[],
  redirectTo: string = '/unauthorized'
): Promise<AuthSession> {
  const authUser = await requireAuth()

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

  if (!roles.includes(authUser.profile.role)) {
    redirect(redirectTo)
  }

  return authUser
}

/**
 * Check if user has specific role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  return roles.includes(userRole)
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'ADMIN'
}

/**
 * Check if user is designer
 */
export function isDesigner(userRole: UserRole): boolean {
  return userRole === 'DESIGNER'
}

/**
 * Check if user is client
 */
export function isClient(userRole: UserRole): boolean {
  return userRole === 'CLIENT'
}

/**
 * Protect API routes - returns user or error response
 */
export async function protectApiRoute(request: NextRequest): Promise<{
  user: AuthUser | null
  profile: AuthProfile | null
  session: Session | null
  error?: NextResponse
}> {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return {
        user: null,
        profile: null,
        session: null,
        error: NextResponse.json(
          { success: false, error: 'Unauthorized - Please sign in' },
          { status: 401 }
        )
      }
    }

    return {
      user: authUser.user,
      profile: authUser.profile,
      session: authUser.session
    }
  } catch (error) {
    console.error('Error protecting API route:', error)
    return {
      user: null,
      profile: null,
      session: null,
      error: NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Protect API routes with role requirement
 */
export async function protectApiRouteWithRole(
  request: NextRequest,
  requiredRole: UserRole | UserRole[]
): Promise<{
  user: AuthUser | null
  profile: AuthProfile | null
  session: Session | null
  error?: NextResponse
}> {
  const { user, profile, session, error } = await protectApiRoute(request)

  if (error || !profile) {
    return { user, profile, session, error }
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

  if (!roles.includes(profile.role)) {
    return {
      user: null,
      profile: null,
      session: null,
      error: NextResponse.json(
        { success: false, error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      )
    }
  }

  return { user, profile, session }
}

/**
 * Sign out helper
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return { success: false, error: 'Failed to sign out' }
  }
}

/**
 * Get auth URLs for redirects
 */
export function getAuthUrls() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    signIn: `${baseUrl}/auth/signin`,
    signUp: `${baseUrl}/auth/signup`,
    resetPassword: `${baseUrl}/auth/reset-password`,
    callback: `${baseUrl}/auth/callback`,
    signOut: `${baseUrl}/auth/signout`,
    profile: `${baseUrl}/profile`,
    dashboard: `${baseUrl}/dashboard`,
    home: `${baseUrl}`,
  }
}

/**
 * Create auth response helpers
 */
export function createAuthSuccessResponse(data: {
  user?: User
  profile?: AuthProfile
  session?: Session
  message?: string
}) {
  return NextResponse.json({
    success: true,
    data,
    message: data.message || 'Success'
  })
}

export function createAuthErrorResponse(
  error: string,
  status: number = 400,
  code?: string
) {
  return NextResponse.json(
    {
      success: false,
      error,
      code
    },
    { status }
  )
}

/**
 * Validate session freshness
 */
export function isSessionFresh(session: Session, maxAgeHours: number = 24): boolean {
  if (!session.expires_at) return false

  const expiresAt = new Date(session.expires_at * 1000)
  const maxAge = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000)

  return expiresAt > maxAge
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: AuthUser, profile?: AuthProfile): string {
  if (profile?.name) return profile.name
  if (user.user_metadata?.name) return user.user_metadata.name
  if (user.email) return user.email.split('@')[0]
  return 'User'
}

/**
 * Get user initials for avatars
 */
export function getUserInitials(user: AuthUser, profile?: AuthProfile): string {
  const name = getUserDisplayName(user, profile)
  const words = name.split(' ')

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }

  return name.substring(0, 2).toUpperCase()
}

/**
 * Format user role for display
 */
export function formatUserRole(role: UserRole): string {
  switch (role) {
    case 'CLIENT':
      return 'Client'
    case 'DESIGNER':
      return 'Designer'
    case 'ADMIN':
      return 'Administrator'
    default:
      return role
  }
}