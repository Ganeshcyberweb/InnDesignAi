/**
 * GET /api/admin/users?search=&role=&status=&page=&pageSize=
 *
 * Paginated user list joining `profiles` with `auth.users` for email +
 * verification. Search matches name OR email (case-insensitive).
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/guard'
import { normalizeRole } from '@/lib/auth/roles'

interface UserRow {
  id: string
  user_id: string
  name: string | null
  company: string | null
  role: string
  avatar_url: string | null
  is_active: boolean
  last_login: Date | null
  created_at: Date
  email: string | null
  email_verified: boolean
}

interface CountRow {
  total: number | bigint
}

const MAX_PAGE_SIZE = 100
const DEFAULT_PAGE_SIZE = 20

export async function GET(request: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.trim() || null
  const role = searchParams.get('role')?.trim() || null
  const statusParam = searchParams.get('status') // 'active' | 'suspended' | null
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.get('pageSize') || `${DEFAULT_PAGE_SIZE}`, 10) || DEFAULT_PAGE_SIZE)
  )
  const offset = (page - 1) * pageSize

  // Normalize role filter so callers can pass either canonical or legacy values.
  const roleFilter = role ? normalizeRole(role) : null
  const isActiveFilter =
    statusParam === 'active' ? true : statusParam === 'suspended' ? false : null

  try {
    const rows = await prisma.$queryRawUnsafe<UserRow[]>(
      `
      SELECT
        p.id,
        p.user_id,
        p.name,
        p.company,
        p.role::text AS role,
        p.avatar_url,
        p.is_active,
        p.last_login,
        p.created_at,
        u.email,
        (u.email_confirmed_at IS NOT NULL) AS email_verified
      FROM profiles p
      LEFT JOIN auth.users u ON u.id = p.user_id
      WHERE ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%' OR u.email ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR p.role::text = $2)
        AND ($3::boolean IS NULL OR p.is_active = $3)
      ORDER BY p.created_at DESC
      LIMIT $4 OFFSET $5
      `,
      search,
      roleFilter,
      isActiveFilter,
      pageSize,
      offset
    )

    const totalRows = await prisma.$queryRawUnsafe<CountRow[]>(
      `
      SELECT COUNT(*)::int AS total
      FROM profiles p
      LEFT JOIN auth.users u ON u.id = p.user_id
      WHERE ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%' OR u.email ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR p.role::text = $2)
        AND ($3::boolean IS NULL OR p.is_active = $3)
      `,
      search,
      roleFilter,
      isActiveFilter
    )

    const total = Number(totalRows[0]?.total ?? 0)

    return NextResponse.json({
      success: true,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      users: rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        name: r.name,
        company: r.company,
        role: normalizeRole(r.role),
        rawRole: r.role,
        avatarUrl: r.avatar_url,
        isActive: r.is_active,
        lastLogin: r.last_login,
        createdAt: r.created_at,
        email: r.email,
        emailVerified: r.email_verified,
      })),
    })
  } catch (error) {
    console.error('GET /api/admin/users failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load users' },
      { status: 500 }
    )
  }
}
