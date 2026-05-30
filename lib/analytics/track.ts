/**
 * Fire-and-forget analytics writers.
 *
 * Each helper kicks off a Prisma create() WITHOUT awaiting and swallows
 * errors so a misbehaving analytics table can never break a real user
 * request. If write throughput ever becomes a problem these are the right
 * place to batch / queue / move off-process.
 *
 * Writers ONLY — no readers live here. The admin dashboard (Phase 5) will
 * read these tables with its own aggregation queries.
 */
import { prisma } from '@/lib/prisma'

const MAX_PROMPT_PREVIEW = 500

// ---------- AI generations ---------------------------------------------------

export type AiGenerationStatus =
  | 'success'
  | 'failed'
  | 'limit_reached'
  | 'auth_required'

export interface AiGenerationRecord {
  userId?: string | null
  guestSessionId?: string | null
  promptText?: string | null
  status: AiGenerationStatus
  themeCount?: number
  imageCount?: number
  tokensInput?: number | null
  tokensOutput?: number | null
  durationMs?: number | null
  errorMessage?: string | null
}

export function trackAiGeneration(record: AiGenerationRecord): void {
  prisma.aiGeneration
    .create({
      data: {
        userId: record.userId ?? null,
        guestSessionId: record.guestSessionId ?? null,
        promptPreview: truncate(record.promptText, MAX_PROMPT_PREVIEW),
        status: record.status,
        themeCount: record.themeCount ?? 0,
        imageCount: record.imageCount ?? 0,
        tokensInput: record.tokensInput ?? null,
        tokensOutput: record.tokensOutput ?? null,
        durationMs: record.durationMs ?? null,
        errorMessage: truncate(record.errorMessage, 2000),
      },
    })
    .catch((err) => {
      console.error('analytics.trackAiGeneration failed:', err)
    })
}

// ---------- Auth events ------------------------------------------------------

export type AuthEventType =
  | 'signin'
  | 'signin_failed'
  | 'signup'
  | 'signout'
  | 'password_reset_requested'

export interface AuthEventRecord {
  userId?: string | null
  email?: string | null
  eventType: AuthEventType
  ipAddress?: string | null
  userAgent?: string | null
}

export function trackAuthEvent(record: AuthEventRecord): void {
  prisma.authEvent
    .create({
      data: {
        userId: record.userId ?? null,
        email: record.email ?? null,
        eventType: record.eventType,
        ipAddress: record.ipAddress ?? null,
        userAgent: record.userAgent ?? null,
      },
    })
    .catch((err) => {
      console.error('analytics.trackAuthEvent failed:', err)
    })
}

// ---------- Audit log (Phase 5 writers; helper is ready now) -----------------

export interface AuditLogRecord {
  actorId?: string | null
  actorRole?: string | null
  action: string
  entityType?: string | null
  entityId?: string | null
  before?: unknown
  after?: unknown
  ipAddress?: string | null
}

export function trackAuditLog(record: AuditLogRecord): void {
  prisma.auditLog
    .create({
      data: {
        actorId: record.actorId ?? null,
        actorRole: record.actorRole ?? null,
        action: record.action,
        entityType: record.entityType ?? null,
        entityId: record.entityId ?? null,
        before: (record.before ?? null) as never,
        after: (record.after ?? null) as never,
        ipAddress: record.ipAddress ?? null,
      },
    })
    .catch((err) => {
      console.error('analytics.trackAuditLog failed:', err)
    })
}

// ---------- Helpers ----------------------------------------------------------

/**
 * Best-effort client IP extraction (Vercel sets x-forwarded-for; we take the
 * first hop). Duplicate of the helper in lib/guest/session.ts but kept local
 * so the analytics module has no cross-feature dependencies.
 */
export function ipFromHeaders(headers: Headers): string | null {
  const xff = headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() || null
  return headers.get('x-real-ip')
}

export function userAgentFromHeaders(headers: Headers): string | null {
  return headers.get('user-agent')
}

function truncate(value: string | null | undefined, max: number): string | null {
  if (!value) return null
  return value.length > max ? value.slice(0, max) : value
}
