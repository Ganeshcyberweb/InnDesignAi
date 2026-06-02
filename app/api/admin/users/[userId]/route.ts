/**
 * PATCH /api/admin/users/:userId
 *
 * Body: { action: 'suspend' | 'unsuspend' | 'promote_admin' | 'demote_to_user' }
 *
 * Admin can suspend/unsuspend non-super-admin users. Promote/demote require
 * SUPER_ADMIN. Self-targeting destructive actions (suspend, demote) are
 * blocked. Every successful action writes an audit_logs row.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, requireSuperAdmin } from '@/lib/admin/guard'
import { normalizeRole } from '@/lib/auth/roles'
import { ipFromHeaders, trackAuditLog } from '@/lib/analytics/track'
import { UserRole } from '@/lib/generated/prisma'

const VALID_ACTIONS = ['suspend', 'unsuspend', 'promote_admin', 'demote_to_user'] as const
type Action = (typeof VALID_ACTIONS)[number]
const SUPER_ONLY: Action[] = ['promote_admin', 'demote_to_user']

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params
  if (!isValidUuid(userId)) {
    return NextResponse.json({ success: false, error: 'Invalid user id' }, { status: 400 })
  }

  let body: { action?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const action = body.action as Action
  if (!VALID_ACTIONS.includes(action)) {
    return NextResponse.json(
      { success: false, error: `Invalid action — expected one of: ${VALID_ACTIONS.join(', ')}` },
      { status: 400 }
    )
  }

  const guard = SUPER_ONLY.includes(action)
    ? await requireSuperAdmin()
    : await requireAdmin()
  if (!guard.ok) return guard.response
  const actor = guard.actor

  // Self-targeting safety: no self-suspend, no self-demote.
  if (actor.userId === userId && (action === 'suspend' || action === 'demote_to_user')) {
    return NextResponse.json(
      { success: false, error: 'You cannot perform this action on your own account' },
      { status: 400 }
    )
  }

  // Load the target so we can validate role + capture before/after for audit.
  const target = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true, userId: true, role: true, isActive: true, name: true },
  })
  if (!target) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
  }

  const targetRole = normalizeRole(target.role)

  // Super admins are sacrosanct — only super admins may touch them, and even
  // then we don't allow demoting the only super admin.
  if (targetRole === 'SUPER_ADMIN' && actor.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Only a super admin can modify another super admin' },
      { status: 403 }
    )
  }
  if (action === 'demote_to_user' && targetRole === 'SUPER_ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Demote the super admin from a database operation, not the admin UI' },
      { status: 400 }
    )
  }

  try {
    let updated
    switch (action) {
      case 'suspend':
        if (!target.isActive) {
          return NextResponse.json({ success: true, user: target, noop: true })
        }
        updated = await prisma.profile.update({
          where: { userId },
          data: { isActive: false },
          select: { userId: true, role: true, isActive: true, name: true },
        })
        break
      case 'unsuspend':
        if (target.isActive) {
          return NextResponse.json({ success: true, user: target, noop: true })
        }
        updated = await prisma.profile.update({
          where: { userId },
          data: { isActive: true },
          select: { userId: true, role: true, isActive: true, name: true },
        })
        break
      case 'promote_admin':
        if (targetRole === 'ADMIN' || targetRole === 'SUPER_ADMIN') {
          return NextResponse.json({ success: true, user: target, noop: true })
        }
        updated = await prisma.profile.update({
          where: { userId },
          data: { role: UserRole.ADMIN, createdByAdmin: actor.userId },
          select: { userId: true, role: true, isActive: true, name: true },
        })
        break
      case 'demote_to_user':
        if (targetRole !== 'ADMIN') {
          return NextResponse.json({ success: true, user: target, noop: true })
        }
        updated = await prisma.profile.update({
          where: { userId },
          data: { role: UserRole.USER },
          select: { userId: true, role: true, isActive: true, name: true },
        })
        break
    }

    trackAuditLog({
      actorId: actor.userId,
      actorRole: actor.role,
      action: `user.${action}`,
      entityType: 'user',
      entityId: userId,
      before: { role: target.role, isActive: target.isActive },
      after: { role: updated.role, isActive: updated.isActive },
      ipAddress: ipFromHeaders(request.headers),
    })

    return NextResponse.json({ success: true, user: updated })
  } catch (error) {
    console.error(`PATCH /api/admin/users/${userId} (${action}) failed:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

function isValidUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
}
