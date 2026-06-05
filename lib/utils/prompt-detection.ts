/**
 * Light heuristics for pulling structured intent out of the user's free-text
 * prompt. Used so the chat input takes priority over any leftover form-store
 * defaults — e.g. when a user types "give me design kitchen" the chip
 * selector's stale "Living room" pick doesn't poison the generation.
 */

const ROOM_KEYWORDS: Array<{ id: string; patterns: RegExp[] }> = [
  // Order matters — multi-word phrases must be tested BEFORE the single-word
  // fallbacks they contain, so "living room" doesn't accidentally match
  // "dining room" first or vice versa.
  { id: 'living_room', patterns: [/\bliving\s+room\b/i, /\blounge\b/i, /\bfamily\s+room\b/i] },
  { id: 'dining_room', patterns: [/\bdining\s+room\b/i, /\bdining\b/i] },
  { id: 'bedroom', patterns: [/\bbedrooms?\b/i, /\bmaster\s+suite\b/i] },
  { id: 'bathroom', patterns: [/\bbathrooms?\b/i, /\bensuite\b/i, /\bpowder\s+room\b/i] },
  { id: 'kitchen', patterns: [/\bkitchens?\b/i, /\bkitchenette\b/i] },
  { id: 'office', patterns: [/\bhome\s+office\b/i, /\boffice\b/i, /\bstudy\b/i, /\bwork\s*room\b/i] },
]

/**
 * Returns a canonical room type id if the prompt clearly mentions one, else
 * null. Falls through silently — call sites should `?? formData.roomType`.
 */
export function detectRoomTypeFromPrompt(text: string | null | undefined): string | null {
  if (!text) return null
  const trimmed = text.trim()
  if (!trimmed) return null
  for (const room of ROOM_KEYWORDS) {
    if (room.patterns.some((p) => p.test(trimmed))) return room.id
  }
  return null
}
