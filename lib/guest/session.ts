/**
 * Server-side helpers for the "Continue as guest" free-trial flow.
 *
 * A guest session is identified by an httpOnly cookie holding a UUID that
 * references a row in `guest_sessions`. The cookie is httpOnly so the client
 * cannot tamper with it; all prompt counting happens server-side, with the
 * counter incremented atomically by SQL so concurrent requests can't race past
 * the limit.
 */
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { GUEST_COOKIE_NAME, GUEST_PROMPT_LIMIT } from '@/lib/guest/constants'

// Re-export so existing route imports (`from '@/lib/guest/session'`) keep working.
export { GUEST_COOKIE_NAME, GUEST_PROMPT_LIMIT }

const GUEST_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

export interface GuestSummary {
  id: string
  promptCount: number
  promptLimit: number
  promptsRemaining: number
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function isValidUuid(s: string): boolean {
  return UUID_RE.test(s)
}

export async function getGuestCookieId(): Promise<string | null> {
  const store = await cookies()
  return store.get(GUEST_COOKIE_NAME)?.value ?? null
}

export async function setGuestCookie(id: string): Promise<void> {
  const store = await cookies()
  store.set(GUEST_COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: GUEST_COOKIE_MAX_AGE_SECONDS,
  })
}

export async function clearGuestCookie(): Promise<void> {
  const store = await cookies()
  store.delete(GUEST_COOKIE_NAME)
}

export async function createGuestSession(opts: {
  ipAddress?: string | null
  userAgent?: string | null
} = {}): Promise<{ id: string; promptCount: number }> {
  const session = await prisma.guestSession.create({
    data: {
      ipAddress: opts.ipAddress ?? null,
      userAgent: opts.userAgent ?? null,
    },
    select: { id: true, promptCount: true },
  })
  return session
}

export async function getGuestSession(id: string) {
  if (!isValidUuid(id)) return null
  return prisma.guestSession.findUnique({
    where: { id },
    select: { id: true, promptCount: true, convertedUserId: true, createdAt: true },
  })
}

export function summarizeGuest(session: { id: string; promptCount: number }): GuestSummary {
  return {
    id: session.id,
    promptCount: session.promptCount,
    promptLimit: GUEST_PROMPT_LIMIT,
    promptsRemaining: Math.max(0, GUEST_PROMPT_LIMIT - session.promptCount),
  }
}

/**
 * Atomically increment the prompt count if still under the limit and the guest
 * hasn't already converted to a registered user. Returns the new count on
 * success, or null if the session is at the cap / converted / not found.
 *
 * The check-and-increment happens in a single UPDATE, so two concurrent
 * requests can't both squeak past the limit.
 */
export async function tryIncrementGuestPrompt(id: string): Promise<number | null> {
  if (!isValidUuid(id)) return null

  const rows = await prisma.$queryRawUnsafe<Array<{ prompt_count: number }>>(
    `UPDATE guest_sessions
       SET prompt_count = prompt_count + 1,
           last_seen_at = NOW(),
           updated_at = NOW()
     WHERE id = $1::uuid
       AND converted_user_id IS NULL
       AND prompt_count < $2
     RETURNING prompt_count`,
    id,
    GUEST_PROMPT_LIMIT
  )

  return rows[0]?.prompt_count ?? null
}

/**
 * Mark a guest session as converted to a registered user. Called at signup
 * when a guest cookie is present. Idempotent.
 */
export async function linkGuestToUser(guestId: string, userId: string): Promise<void> {
  if (!isValidUuid(guestId) || !isValidUuid(userId)) return
  try {
    await prisma.guestSession.update({
      where: { id: guestId },
      data: { convertedUserId: userId },
    })
  } catch {
    // If the session row doesn't exist (e.g., manually deleted), silently skip.
  }
}

/**
 * Best-effort extraction of the client IP from a Next request. Vercel sets
 * `x-forwarded-for`; we take the first hop and trim.
 */
export function ipFromHeaders(headers: Headers): string | null {
  const xff = headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() || null
  return headers.get('x-real-ip')
}
