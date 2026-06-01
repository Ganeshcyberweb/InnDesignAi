/**
 * Server-side admin gate.
 *
 * The Edge middleware already redirects non-admin pages and rejects non-admin
 * API calls under /api/admin* with 403. These helpers add a second layer:
 *  - `requireAdmin()` resolves the current admin's id + canonical role for use
 *    inside admin route handlers (returns null + a 401/403 NextResponse when
 *    the caller isn't an admin, so the handler can `return` it directly).
 *  - `requireSuperAdmin()` is the stricter version for super-admin-only
 *    actions (role changes, system settings).
 *
 * Both prefer fail-closed: any unexpected error means "not authorized".
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import {
  type AppRole,
  isAdminRole,
  isSuperAdmin,
  normalizeRole,
} from '@/lib/auth/roles'

export interface AdminActor {
  userId: string
  email: string | null
  role: AppRole
}

export type AdminGuardResult =
  | { ok: true; actor: AdminActor }
  | { ok: false; response: NextResponse }

async function loadActor(): Promise<AdminActor | { error: 'unauthenticated' | 'no_profile' }> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return { error: 'unauthenticated' }

  // Read the role via Prisma (postgres user) so RLS on the `profiles` table
  // can't hide the row from the user's anon-key JWT. supabase-js queries here
  // were silently returning null and dropping us back to the USER fallback.
  const profile = await prisma.profile
    .findUnique({
      where: { userId: user.id },
      select: { role: true },
    })
    .catch((err) => {
      console.error('admin guard: prisma profile lookup failed', err)
      return null
    })

  if (!profile) return { error: 'no_profile' }

  return {
    userId: user.id,
    email: user.email ?? null,
    role: normalizeRole(profile.role),
  }
}

export async function requireAdmin(): Promise<AdminGuardResult> {
  const actor = await loadActor()
  if ('error' in actor) {
    if (actor.error === 'unauthenticated') {
      return {
        ok: false,
        response: NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        ),
      }
    }
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'Forbidden - admin access required' },
        { status: 403 }
      ),
    }
  }
  if (!isAdminRole(actor.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'Forbidden - admin access required' },
        { status: 403 }
      ),
    }
  }
  return { ok: true, actor }
}

export async function requireSuperAdmin(): Promise<AdminGuardResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return guard
  if (!isSuperAdmin(guard.actor.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'Forbidden - super admin access required' },
        { status: 403 }
      ),
    }
  }
  return guard
}

/**
 * Helper for server components / layouts (not route handlers). Returns the
 * actor or null — the layout decides where to redirect.
 */
export async function getAdminActor(): Promise<AdminActor | null> {
  const actor = await loadActor()
  if ('error' in actor) return null
  if (!isAdminRole(actor.role)) return null
  return actor
}
