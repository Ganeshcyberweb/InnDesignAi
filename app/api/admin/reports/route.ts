/**
 * GET /api/admin/reports?type=...&from=YYYY-MM-DD&to=YYYY-MM-DD
 *
 * Three report types, each returns a row-per-day series for the date range:
 *  - user_activity:   signins, signin_failed, signups, signouts
 *  - ai_usage:        successful generations, failed, limit_reached, tokens_in/out
 *  - conversion:      guests created, guests converted
 *
 * The route returns rows JSON; the page builds the CSV client-side.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/guard'

const VALID_TYPES = ['user_activity', 'ai_usage', 'conversion'] as const
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
  const typeParam = (searchParams.get('type') || 'user_activity') as ReportType
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
  // Inclusive of the `to` day — add one day to the upper bound.
  switch (type) {
    case 'user_activity':
      return prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        `
        WITH days AS (
          SELECT generate_series($1::date, $2::date, INTERVAL '1 day')::date AS day
        )
        SELECT
          to_char(days.day, 'YYYY-MM-DD') AS date,
          COALESCE(SUM(CASE WHEN ae.event_type = 'signin'        THEN 1 ELSE 0 END), 0)::int AS signins,
          COALESCE(SUM(CASE WHEN ae.event_type = 'signin_failed' THEN 1 ELSE 0 END), 0)::int AS signin_failed,
          COALESCE(SUM(CASE WHEN ae.event_type = 'signup'        THEN 1 ELSE 0 END), 0)::int AS signups,
          COALESCE(SUM(CASE WHEN ae.event_type = 'signout'       THEN 1 ELSE 0 END), 0)::int AS signouts
        FROM days
        LEFT JOIN auth_events ae
          ON date_trunc('day', ae.created_at)::date = days.day
        GROUP BY days.day
        ORDER BY days.day
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
