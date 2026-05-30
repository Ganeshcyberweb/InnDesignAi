/**
 * GET /api/admin/audit?action=&page=&pageSize=
 *
 * Paginated audit-log feed. Joins the actor's email from auth.users for
 * readability, and exposes the `before`/`after` JSON for inspection.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/guard'

interface AuditRow {
  id: string
  actor_id: string | null
  actor_role: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  before: unknown
  after: unknown
  ip_address: string | null
  created_at: Date
  actor_email: string | null
}

interface CountRow {
  total: number | bigint
}

const DEFAULT_PAGE_SIZE = 30
const MAX_PAGE_SIZE = 100

export async function GET(request: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')?.trim() || null
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.get('pageSize') || `${DEFAULT_PAGE_SIZE}`, 10) || DEFAULT_PAGE_SIZE)
  )
  const offset = (page - 1) * pageSize

  try {
    const rows = await prisma.$queryRawUnsafe<AuditRow[]>(
      `
      SELECT
        al.id, al.actor_id, al.actor_role, al.action,
        al.entity_type, al.entity_id, al.before, al.after,
        al.ip_address, al.created_at,
        u.email AS actor_email
      FROM audit_logs al
      LEFT JOIN auth.users u ON u.id = al.actor_id
      WHERE ($1::text IS NULL OR al.action = $1)
      ORDER BY al.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      action,
      pageSize,
      offset
    )

    const totalRows = await prisma.$queryRawUnsafe<CountRow[]>(
      `SELECT COUNT(*)::int AS total FROM audit_logs WHERE ($1::text IS NULL OR action = $1)`,
      action
    )
    const total = Number(totalRows[0]?.total ?? 0)

    return NextResponse.json({
      success: true,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      entries: rows.map((r) => ({
        id: r.id,
        actorId: r.actor_id,
        actorRole: r.actor_role,
        actorEmail: r.actor_email,
        action: r.action,
        entityType: r.entity_type,
        entityId: r.entity_id,
        before: r.before,
        after: r.after,
        ipAddress: r.ip_address,
        createdAt: r.created_at,
      })),
    })
  } catch (error) {
    console.error('GET /api/admin/audit failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load audit log' },
      { status: 500 }
    )
  }
}
