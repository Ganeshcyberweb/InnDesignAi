/**
 * Constants for the guest free-trial flow.
 *
 * Kept in a separate file so the Edge-runtime middleware can import them
 * without pulling in Prisma (which is Node-only and would break the Edge build).
 */
export const GUEST_COOKIE_NAME = 'inndesign_guest_id'
// Original 2-prompt free trial. The Phase 6 chip refinement step doesn't
// consume a generation prompt — it just steers the next one — so the limit
// can stay at 2 without shortchanging guests.
export const GUEST_PROMPT_LIMIT = 2
