import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if this is an email confirmation (signup flow)
      // If the user just confirmed their email, sign them out and redirect to home
      if (type === 'signup' || type === 'email') {
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/?email_verified=true`)
      }

      // For other flows (OAuth, magic link login), redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Unable to authenticate`)
}