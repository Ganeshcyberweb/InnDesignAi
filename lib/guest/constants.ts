/**
 * Constants for the guest free-trial flow.
 *
 * Kept in a separate file so the Edge-runtime middleware can import them
 * without pulling in Prisma (which is Node-only and would break the Edge build).
 */
export const GUEST_COOKIE_NAME = 'inndesign_guest_id'
// Bumped from 2 -> 4 alongside the Phase 6 follow-back refinement: each
// prompt now yields a better-targeted result, so guests get more "wow"
// moments before the auth modal.
export const GUEST_PROMPT_LIMIT = 4
