/**
 * Role model + client-safe role helpers (Phase 2 RBAC).
 *
 * Canonical roles: GUEST | USER | ADMIN | SUPER_ADMIN.
 * Legacy CLIENT/DESIGNER values may still exist in the database during the
 * migration window and are normalized to USER everywhere in the app.
 *
 * This module is intentionally dependency-free (no server/Prisma imports) so it
 * can be used safely in both client and server components.
 */

export type AppRole = 'GUEST' | 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export const ROLES = {
  GUEST: 'GUEST',
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const

/** Roles allowed into the admin area / admin APIs. */
export const ADMIN_ROLES: AppRole[] = ['ADMIN', 'SUPER_ADMIN']

const ROLE_LABELS: Record<AppRole, string> = {
  GUEST: 'Guest',
  USER: 'User',
  ADMIN: 'Administrator',
  SUPER_ADMIN: 'Super Admin',
}

/**
 * Map any stored/raw role (including legacy CLIENT/DESIGNER) to a canonical role.
 * Unknown/empty values default to USER.
 */
export function normalizeRole(role: string | null | undefined): AppRole {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'SUPER_ADMIN'
    case 'ADMIN':
      return 'ADMIN'
    case 'GUEST':
      return 'GUEST'
    case 'USER':
    case 'CLIENT': // legacy
    case 'DESIGNER': // legacy
      return 'USER'
    default:
      return 'USER'
  }
}

/** Human-readable label for any role value. */
export function formatRole(role: string | null | undefined): string {
  return ROLE_LABELS[normalizeRole(role)]
}

export function isSuperAdmin(role: string | null | undefined): boolean {
  return normalizeRole(role) === 'SUPER_ADMIN'
}

/** True for ADMIN or SUPER_ADMIN. */
export function isAdminRole(role: string | null | undefined): boolean {
  return ADMIN_ROLES.includes(normalizeRole(role))
}

/** Whether the role may access the admin area / admin APIs. */
export function canAccessAdmin(role: string | null | undefined): boolean {
  return isAdminRole(role)
}

/** True when the (normalized) role is one of the allowed roles. */
export function hasRole(role: string | null | undefined, allowed: AppRole[]): boolean {
  return allowed.includes(normalizeRole(role))
}
