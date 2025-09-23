import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { password, token } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // If token is provided, it's a password reset confirmation
    if (token) {
      // Exchange the token and update password
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        console.error('Password reset confirmation error:', error)
        return NextResponse.json(
          { error: error.message || 'Password reset failed' },
          { status: 400 }
        )
      }

      return NextResponse.json({ message: 'Password updated successfully' })
    } else {
      // This is a password update for an authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        console.error('Password update error:', error)
        return NextResponse.json(
          { error: error.message || 'Password update failed' },
          { status: 400 }
        )
      }

      return NextResponse.json({ message: 'Password updated successfully' })
    }
  } catch (error) {
    console.error('Password confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}