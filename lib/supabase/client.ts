/**
 * Client-side Supabase client for Next.js App Router
 * Handles client-side authentication and real-time subscriptions
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    "https://hyokzduxwgldgtlgguin.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5b2t6ZHV4d2dsZGd0bGdndWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1OTIwMzAsImV4cCI6MjA3MzE2ODAzMH0.8_MGOUU3wV5o7rkF4dRl9jMmHc7bi2F4kNT61TYpLo4"
  )
}

/**
 * Singleton client instance for client-side operations
 */
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}