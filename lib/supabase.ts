import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Create a Supabase client for use in the browser (client components)
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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