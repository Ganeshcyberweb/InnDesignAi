/**
 * GET /api/admin/overview
 *
 * Single payload that powers all three admin tabs (Overview / Users / Guests).
 * Each section is built with read-only aggregations against the analytics
 * tables. Series use generate_series so charts include zero-days cleanly.
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/guard'
import { GUEST_PROMPT_LIMIT } from '@/lib/guest/constants'

interface SeriesRow {
  date: string
  n: number
}

interface ScalarRow<K extends string = 'n'> {
  // PG returns SUM/COUNT as bigint via Prisma raw — we cast to ::int / ::bigint
  // in the queries below but keep the type permissive.
  [k: string]: number | bigint | null
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

const TOP_USERS_SQL = `
  SELECT
    COALESCE(p.name, '(no name)')                         AS name,
    u.email                                                AS email,
    p.role::text                                           AS role,
    COUNT(ag.id)::int                                      AS prompts,
    COUNT(ag.id) FILTER (WHERE ag.status = 'success')::int AS successful_generations,
    COALESCE(SUM(ag.image_count) FILTER (WHERE ag.status = 'success'), 0)::int AS images,
    COALESCE(SUM(ag.tokens_input) + SUM(ag.tokens_output), 0)::int AS tokens,
    to_char(MAX(ag.created_at), 'YYYY-MM-DD HH24:MI')      AS last_active
  FROM profiles p
  LEFT JOIN auth.users u ON u.id = p.user_id
  LEFT JOIN ai_generations ag
    ON ag.user_id = p.user_id
   AND ag.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY p.user_id, p.name, u.email, p.role
  ORDER BY prompts DESC, images DESC
  LIMIT 10
`

const RECENT_CONVERSIONS_SQL = `
  SELECT
    u.email                                          AS email,
    to_char(gs.converted_at, 'YYYY-MM-DD HH24:MI')   AS converted_at,
    gs.prompt_count                                   AS prompts_used
  FROM guest_sessions gs
  LEFT JOIN auth.users u ON u.id = gs.converted_user_id
  WHERE gs.converted_user_id IS NOT NULL
  ORDER BY gs.converted_at DESC NULLS LAST
  LIMIT 10
`

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const [
      totalUsers,
      totalGuests,
      totalInteractionsRows,
      totalTokensRows,
      tokenGeneratingUsersRows,
      dauRows,
      signups7d,
      conversionsTotal,
      active24hRows,
      avgPromptsRows,
      atLimitRows,
      signupSeries,
      generationSeries,
      topUsers,
      recentConversions,
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.guestSession.count(),

      // Total interactions = total AI generation attempts (any status).
      prisma.$queryRawUnsafe<Array<ScalarRow>>(
        `SELECT COUNT(*)::bigint AS total FROM ai_generations`
      ),

      // Total tokens (input + output) all-time.
      prisma.$queryRawUnsafe<Array<ScalarRow>>(
        `SELECT COALESCE(SUM(tokens_input) + SUM(tokens_output), 0)::bigint AS total FROM ai_generations`
      ),

      // Number of distinct users who have ever generated — denominator for avg tokens/user.
      prisma.$queryRawUnsafe<Array<ScalarRow>>(
        `SELECT COUNT(DISTINCT user_id)::int AS total FROM ai_generations WHERE user_id IS NOT NULL`
      ),

      // DAU: distinct signed-in users in the last 24h (auth_events signin).
      prisma.$queryRawUnsafe<Array<ScalarRow>>(
        `SELECT COUNT(DISTINCT user_id)::int AS total
         FROM auth_events
         WHERE event_type = 'signin'
           AND user_id IS NOT NULL
           AND created_at >= NOW() - INTERVAL '24 hours'`
      ),

      prisma.authEvent.count({
        where: {
          eventType: 'signup',
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),

      prisma.guestSession.count({ where: { convertedUserId: { not: null } } }),

      // Guests active in the last 24h (last_seen_at refreshed by the limit increment).
      prisma.$queryRawUnsafe<Array<ScalarRow>>(
        `SELECT COUNT(*)::int AS total
         FROM guest_sessions
         WHERE last_seen_at >= NOW() - INTERVAL '24 hours'`
      ),

      // Average prompts per guest session (across the entire population).
      prisma.$queryRawUnsafe<Array<ScalarRow>>(
        `SELECT COALESCE(AVG(prompt_count), 0)::float AS total FROM guest_sessions`
      ),

      // Guests who hit the per-session prompt cap.
      prisma.$queryRawUnsafe<Array<ScalarRow>>(
        `SELECT COUNT(*)::int AS total FROM guest_sessions WHERE prompt_count >= $1`,
        GUEST_PROMPT_LIMIT
      ),

      prisma.$queryRawUnsafe<SeriesRow[]>(SIGNUPS_SERIES_SQL),
      prisma.$queryRawUnsafe<SeriesRow[]>(GENERATIONS_SERIES_SQL),
      prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(TOP_USERS_SQL),
      prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(RECENT_CONVERSIONS_SQL),
    ])

    const totalInteractions = Number(totalInteractionsRows[0]?.total ?? 0)
    const totalTokens = Number(totalTokensRows[0]?.total ?? 0)
    const tokenGeneratingUsers = Number(tokenGeneratingUsersRows[0]?.total ?? 0)
    const dau = Number(dauRows[0]?.total ?? 0)
    const avgTokensPerUser =
      tokenGeneratingUsers > 0 ? Math.round(totalTokens / tokenGeneratingUsers) : 0

    const active24h = Number(active24hRows[0]?.total ?? 0)
    const avgPrompts = Number(avgPromptsRows[0]?.total ?? 0)
    const atLimit = Number(atLimitRows[0]?.total ?? 0)
    const conversionRate =
      totalGuests > 0 ? Math.round((conversionsTotal / totalGuests) * 1000) / 10 : 0

    return NextResponse.json({
      success: true,
      overview: {
        kpis: {
          totalUsers,
          totalInteractions,
          totalTokens,
          avgTokensPerUser,
          dau,
          signups7d,
        },
        series: {
          signups30d: signupSeries,
          generations30d: generationSeries,
        },
      },
      users: {
        topUsers,
      },
      guests: {
        kpis: {
          totalGuests,
          active24h,
          conversions: conversionsTotal,
          conversionRate, // percentage with one decimal
          avgPrompts: Math.round(avgPrompts * 10) / 10,
          atLimit,
          promptLimit: GUEST_PROMPT_LIMIT,
        },
        recentConversions,
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
