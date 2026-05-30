/**
 * GET /api/guest/me
 *
 * Returns the current guest session summary, or { guest: null } if there is no
 * guest cookie / the row is gone / the session has already been converted to a
 * registered user. Used by the client to render the "X of 2 prompts left"
 * counter without ever reading the httpOnly cookie itself.
 */
import { NextResponse } from 'next/server'
import { getGuestCookieId, getGuestSession, summarizeGuest } from '@/lib/guest/session'

export async function GET() {
  const id = await getGuestCookieId()
  if (!id) {
    return NextResponse.json({ guest: null })
  }

  const session = await getGuestSession(id)
  if (!session || session.convertedUserId) {
    return NextResponse.json({ guest: null })
  }

  return NextResponse.json({
    guest: summarizeGuest({ id: session.id, promptCount: session.promptCount }),
  })
}
