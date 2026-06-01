/**
 * GET /api/admin/reports?type=...&from=YYYY-MM-DD&to=YYYY-MM-DD
 *
 * Report shapes (each returns its own column set; the page renders columns
 * dynamically from the first row):
 *
 *  - per_user    : one row per user — prompts, successful generations,
 *                  images produced, tokens, last activity (within the range).
 *  - per_guest   : one row per guest_session created within the range — prompt
 *                  count, IP, conversion status, generations produced.
 *  - ai_usage    : one row per day — generations by status + token totals.
 *  - conversion  : one row per day — guests created vs converted.
 *
 * The `to` day is inclusive (treated as < to + 1 day).
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/guard'

const VALID_TYPES = ['per_user', 'per_guest', 'ai_usage', 'conversion'] as const
type ReportType = (typeof VALID_TYPES)[number]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function parseDateOrNull(raw: string | null): string | null {
  if (!raw || !ISO_DATE.test(raw)) return null
  return raw
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function isoDaysAgo(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

export async function GET(request: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const { searchParams } = new URL(request.url)
  const typeParam = (searchParams.get('type') || 'per_user') as ReportType
  if (!VALID_TYPES.includes(typeParam)) {
    return NextResponse.json(
      { success: false, error: `Invalid report type — expected one of: ${VALID_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  const from = parseDateOrNull(searchParams.get('from')) ?? isoDaysAgo(29)
  const to = parseDateOrNull(searchParams.get('to')) ?? todayIso()

  if (from > to) {
    return NextResponse.json(
      { success: false, error: '`from` must be on or before `to`' },
      { status: 400 }
    )
  }

  try {
    const rows = await runReport(typeParam, from, to)
    return NextResponse.json({
      success: true,
      type: typeParam,
      from,
      to,
      rows,
    })
  } catch (error) {
    console.error('GET /api/admin/reports failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to build report' },
      { status: 500 }
    )
  }
}

async function runReport(type: ReportType, from: string, to: string) {
  switch (type) {
    case 'per_user':
      // One row per registered user. Activity counts are scoped to the date
      // range so the admin can see who's been active recently.
      return prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        `
        SELECT
          COALESCE(p.name, '(no name)')                       AS user,
          u.email                                              AS email,
          p.role::text                                         AS role,
          CASE WHEN p.is_active THEN 'active' ELSE 'suspended' END AS status,
          COUNT(ag.id)::int                                    AS prompts,
          COUNT(ag.id) FILTER (WHERE ag.status = 'success')::int  AS successful_generations,
          COUNT(ag.id) FILTER (WHERE ag.status = 'failed')::int   AS failed_generations,
          COALESCE(SUM(ag.image_count) FILTER (WHERE ag.status = 'success'), 0)::int AS images_generated,
          COALESCE(SUM(ag.tokens_input), 0)::int               AS tokens_input,
          COALESCE(SUM(ag.tokens_output), 0)::int              AS tokens_output,
          to_char(MAX(ag.created_at), 'YYYY-MM-DD HH24:MI')    AS last_generation,
          to_char(p.last_login, 'YYYY-MM-DD HH24:MI')          AS last_login,
          to_char(p.created_at, 'YYYY-MM-DD')                  AS joined
        FROM profiles p
        LEFT JOIN auth.users u ON u.id = p.user_id
        LEFT JOIN ai_generations ag
          ON ag.user_id = p.user_id
         AND ag.created_at >= $1::date
         AND ag.created_at <  ($2::date + INTERVAL '1 day')
        GROUP BY p.user_id, p.name, u.email, p.role, p.is_active, p.last_login, p.created_at
        ORDER BY prompts DESC, images_generated DESC, p.created_at DESC
        LIMIT 500
        `,
        from,
        to
      )

    case 'per_guest':
      // One row per guest session created in the range. Joins ai_generations
      // by guest_session_id so we can show what the guest actually produced.
      return prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        `
        SELECT
          SUBSTRING(gs.id::text, 1, 8) || '…'                    AS guest_id,
          gs.prompt_count::int                                    AS prompts_used,
          COUNT(ag.id) FILTER (WHERE ag.status = 'success')::int  AS successful_generations,
          COALESCE(SUM(ag.image_count) FILTER (WHERE ag.status = 'success'), 0)::int AS images_generated,
          gs.ip_address                                            AS ip,
          to_char(gs.created_at, 'YYYY-MM-DD HH24:MI')             AS created,
          to_char(gs.last_seen_at, 'YYYY-MM-DD HH24:MI')           AS last_seen,
          CASE WHEN gs.converted_user_id IS NULL THEN 'no' ELSE 'yes' END AS converted,
          to_char(gs.converted_at, 'YYYY-MM-DD HH24:MI')           AS converted_at,
          u.email                                                  AS converted_to_email
        FROM guest_sessions gs
        LEFT JOIN auth.users u ON u.id = gs.converted_user_id
        LEFT JOIN ai_generations ag ON ag.guest_session_id = gs.id
        WHERE gs.created_at >= $1::date
          AND gs.created_at <  ($2::date + INTERVAL '1 day')
        GROUP BY gs.id, gs.prompt_count, gs.ip_address, gs.created_at,
                 gs.last_seen_at, gs.converted_user_id, gs.converted_at, u.email
        ORDER BY gs.created_at DESC
        LIMIT 500
        `,
        from,
        to
      )

    case 'ai_usage':
      return prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        `
        WITH days AS (
          SELECT generate_series($1::date, $2::date, INTERVAL '1 day')::date AS day
        )
        SELECT
          to_char(days.day, 'YYYY-MM-DD') AS date,
          COALESCE(SUM(CASE WHEN ag.status = 'success'       THEN 1 ELSE 0 END), 0)::int AS successful_generations,
          COALESCE(SUM(CASE WHEN ag.status = 'failed'        THEN 1 ELSE 0 END), 0)::int AS failed_generations,
          COALESCE(SUM(CASE WHEN ag.status = 'limit_reached' THEN 1 ELSE 0 END), 0)::int AS limit_reached,
          COALESCE(SUM(ag.image_count) FILTER (WHERE ag.status = 'success'), 0)::int AS images_generated,
          COALESCE(SUM(ag.tokens_input), 0)::int  AS tokens_input,
          COALESCE(SUM(ag.tokens_output), 0)::int AS tokens_output
        FROM days
        LEFT JOIN ai_generations ag
          ON date_trunc('day', ag.created_at)::date = days.day
        GROUP BY days.day
        ORDER BY days.day
        `,
        from,
        to
      )

    case 'conversion':
      return prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        `
        WITH days AS (
          SELECT generate_series($1::date, $2::date, INTERVAL '1 day')::date AS day
        )
        SELECT
          to_char(days.day, 'YYYY-MM-DD') AS date,
          COALESCE(SUM(CASE WHEN date_trunc('day', gs.created_at)::date    = days.day THEN 1 ELSE 0 END), 0)::int AS guests_created,
          COALESCE(SUM(CASE WHEN date_trunc('day', gs.converted_at)::date = days.day THEN 1 ELSE 0 END), 0)::int AS guests_converted
        FROM days
        LEFT JOIN guest_sessions gs
          ON date_trunc('day', gs.created_at)::date     = days.day
          OR date_trunc('day', gs.converted_at)::date  = days.day
        GROUP BY days.day
        ORDER BY days.day
        `,
        from,
        to
      )
  }
}
