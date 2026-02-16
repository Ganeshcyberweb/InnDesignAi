import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Fallback values for local development
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hyokzduxwgldgtlgguin.supabase.co"
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5b2t6ZHV4d2dsZGd0bGdndWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1OTIwMzAsImV4cCI6MjA3MzE2ODAzMH0.8_MGOUU3wV5o7rkF4dRl9jMmHc7bi2F4kNT61TYpLo4"

/**
 * Create a Supabase client for use in the browser (client components)
 */
export function createClient() {
  return createBrowserClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  )
}

/**
 * Singleton instance for client-side usage
 */
let browserClient: ReturnType<typeof createClient> | undefined

export function getBrowserClient() {
  if (!browserClient) {
    browserClient = createClient()
  }
  return browserClient
}