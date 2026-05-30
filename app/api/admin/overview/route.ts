/**
 * GET /api/admin/overview
 *
 * Aggregated KPIs + 30-day time series for the admin overview page.
 * Reads-only — uses generate_series so the series include zero-days for clean
 * charts.
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/guard'

interface SeriesRow {
  date: string
  n: number
}

const SIGNUPS_SERIES_SQL = `
  WITH days AS (
    SELECT generate_series(
      date_trunc('day', NOW() - INTERVAL '29 days'),
      date_trunc('day', NOW()),
      INTERVAL '1 day'
    )::date AS day
  )
  SELECT to_char(days.day, 'YYYY-MM-DD') AS date,
         COALESCE(COUNT(ae.id), 0)::int AS n
  FROM days
  LEFT JOIN auth_events ae
    ON ae.event_type = 'signup'
   AND date_trunc('day', ae.created_at)::date = days.day
  GROUP BY days.day
  ORDER BY days.day
`

const GENERATIONS_SERIES_SQL = `
  WITH days AS (
    SELECT generate_series(
      date_trunc('day', NOW() - INTERVAL '29 days'),
      date_trunc('day', NOW()),
      INTERVAL '1 day'
    )::date AS day
  )
  SELECT to_char(days.day, 'YYYY-MM-DD') AS date,
         COALESCE(COUNT(ag.id), 0)::int AS n
  FROM days
  LEFT JOIN ai_generations ag
    ON ag.status = 'success'
   AND date_trunc('day', ag.created_at)::date = days.day
  GROUP BY days.day
  ORDER BY days.day
`

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  try {
    const [
      totalUsers,
      totalGuests,
      generations7d,
      signups7d,
      failedSignins7d,
      convertedGuests,
      tokens7dRows,
      signupSeries,
      generationSeries,
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.guestSession.count(),
      prisma.aiGeneration.count({
        where: { status: 'success', createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.authEvent.count({
        where: { eventType: 'signup', createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.authEvent.count({
        where: { eventType: 'signin_failed', createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.guestSession.count({
        where: { convertedUserId: { not: null } },
      }),
      prisma.$queryRawUnsafe<Array<{ total: number | bigint | null }>>(
        `SELECT COALESCE(SUM(tokens_input) + SUM(tokens_output), 0)::bigint AS total
         FROM ai_generations
         WHERE created_at >= NOW() - INTERVAL '7 days'`
      ),
      prisma.$queryRawUnsafe<SeriesRow[]>(SIGNUPS_SERIES_SQL),
      prisma.$queryRawUnsafe<SeriesRow[]>(GENERATIONS_SERIES_SQL),
    ])

    const conversionPct =
      totalGuests > 0 ? Math.round((convertedGuests / totalGuests) * 100) : 0

    const tokens7d = Number(tokens7dRows[0]?.total ?? 0)

    return NextResponse.json({
      success: true,
      kpis: {
        totalUsers,
        totalGuests,
        generations7d,
        signups7d,
        failedSignins7d,
        convertedGuests,
        conversionPct,
        tokens7d,
      },
      series: {
        signups30d: signupSeries,
        generations30d: generationSeries,
      },
    })
  } catch (error) {
    console.error('GET /api/admin/overview failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load overview' },
      { status: 500 }
    )
  }
}
