import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Use Prisma to fetch the user profile
    const profile = await prisma.profile.findUnique({
      where: {
        userId: user.id
      }
    })

    // Return user data with profile
    const userData = {
      id: user.id,
      email: user.email,
      email_verified: user.email_confirmed_at ? true : false,
      created_at: user.created_at,
      updated_at: user.updated_at,
      profile: profile || null,
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}