/**
 * POST /api/guest/start
 *
 * Creates a guest session row, sets the httpOnly guest cookie, and returns the
 * starting summary. If the caller already has a valid (non-converted) guest
 * cookie, returns the existing session instead of resetting the prompt count.
 */
import { NextRequest, NextResponse } from 'next/server'
import {
  GUEST_PROMPT_LIMIT,
  createGuestSession,
  getGuestCookieId,
  getGuestSession,
  ipFromHeaders,
  setGuestCookie,
  summarizeGuest,
} from '@/lib/guest/session'

export async function POST(request: NextRequest) {
  try {
    // Reuse an existing guest session if the caller already has one.
    const existingId = await getGuestCookieId()
    if (existingId) {
      const existing = await getGuestSession(existingId)
      if (existing && !existing.convertedUserId) {
        return NextResponse.json({
          success: true,
          guest: summarizeGuest({ id: existing.id, promptCount: existing.promptCount }),
        })
      }
    }

    const ipAddress = ipFromHeaders(request.headers)
    const userAgent = request.headers.get('user-agent')

    const session = await createGuestSession({ ipAddress, userAgent })
    await setGuestCookie(session.id)

    return NextResponse.json({
      success: true,
      guest: summarizeGuest(session),
    })
  } catch (error) {
    console.error('POST /api/guest/start failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to start guest session' },
      { status: 500 }
    )
  }
}

export const GET = () =>
  NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  )

export const PROMPT_LIMIT = GUEST_PROMPT_LIMIT
