/**
 * Server-side Supabase client for Next.js App Router
 * Handles server-side authentication and database operations
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/app/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    "https://hyokzduxwgldgtlgguin.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5b2t6ZHV4d2dsZGd0bGdndWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1OTIwMzAsImV4cCI6MjA3MzE2ODAzMH0.8_MGOUU3wV5o7rkF4dRl9jMmHc7bi2F4kNT61TYpLo4",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Server-side client for use in Server Actions and Route Handlers
 */
export async function createServerActionClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    "https://hyokzduxwgldgtlgguin.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5b2t6ZHV4d2dsZGd0bGdndWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1OTIwMzAsImV4cCI6MjA3MzE2ODAzMH0.8_MGOUU3wV5o7rkF4dRl9jMmHc7bi2F4kNT61TYpLo4",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

/**
 * Admin client with service role key for server-side admin operations
 */
export function createAdminClient() {
  return createServerClient<Database>(
    "https://hyokzduxwgldgtlgguin.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // Admin client doesn't need cookies
        },
      },
    }
  )
}

/**
 * Get authenticated user from server-side
 */
export async function getUser() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      return { user: null, error }
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

/**
 * Get session from server-side
 */
export async function getSession() {
  const supabase = await createClient()

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      return { session: null, error }
    }

    return { session, error: null }
  } catch (error) {
    return { session: null, error }
  }
}