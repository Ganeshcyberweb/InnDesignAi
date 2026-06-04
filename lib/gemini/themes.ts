/**
 * Theme + view definitions for the multi-theme generation route, plus a
 * structured prompt assembler.
 *
 * The previous version of these constants was generic enough that Gemini kept
 * producing visually similar outputs across themes. This file replaces each
 * theme with concrete visual anchors (specific materials, hex palette, named
 * furniture pieces, lighting style, atmosphere) and each view with explicit
 * camera framing — so the three themes look distinct and the two views per
 * theme feel like two different photos from the same shoot.
 */
import type { FurnitureProduct } from '@/types/furniture'

export interface ThemeAnchors {
  /** Stable id used in URLs / DB / analytics. */
  theme: string
  /** User-facing label. */
  label: string
  /** One-line essence — what makes this theme feel itself. */
  signature: string
  /** Concrete materials list. */
  materials: string
  /** Palette with hex anchors and accent rules. */
  palette: string
  /** Signature furniture pieces and silhouettes. */
  furniture: string
  /** Lighting characteristics + time-of-day cues. */
  lighting: string
  /** Atmosphere / mood callouts. */
  atmosphere: string
}

export interface ViewSpec {
  /** Stable id stored on outputs. */
  angle: string
  /** Short user-facing label. */
  label: string
  /** Camera position, lens, eye height, field of view. */
  framing: string
  /** What the shot emphasises. */
  focus: string
  /** Depth-of-field characteristics. */
  depth: string
}

export const THEMES: ThemeAnchors[] = [
  {
    theme: 'modern',
    label: 'Modern Minimalist',
    signature: 'Serene, breath-of-fresh-air minimalism with deliberate negative space.',
    materials:
      'white oak floors, matte black metal accents, polished concrete or microcement walls, frosted glass, natural linen textiles, raw wool rugs',
    palette:
      'warm whites (#F5F1E8), soft greys (#D8D5D0), charcoal (#2C2C2C), and ONE restrained accent — pick from sage green (#9CAE96), soft terracotta (#C97B5D), or muted ocean blue (#7A9CA8). No multi-colour accents',
    furniture:
      'low-profile sectional in boucle or linen with clean lines, minimal-frame lounge chair (Eames-style), floating shelves, single sculptural piece (chair or pendant) as a focal point, no ornate hardware, slim metal or wood legs',
    lighting:
      'recessed LEDs + one sculptural pendant or arc lamp, abundant filtered daylight through sheer linen drapes, soft no-shadow late-morning light at ~5500K',
    atmosphere:
      'gallery-quiet, uncluttered, intentional. The room should feel like it could be photographed for Dwell magazine',
  },
  {
    theme: 'cozy',
    label: 'Cozy Traditional',
    signature: "Warm, lived-in, like a favourite library on a rainy evening.",
    materials:
      'warm walnut and aged oak, aged brass hardware, wool boucle and silk velvet, Persian or kilim rugs (rich reds and blues), hand-troweled plaster walls',
    palette:
      'cream (#EFE2C5), deep ochre (#B8864A), forest green (#3A5440), burgundy accents (#7A2F2F), unified by rich wood tones throughout',
    furniture:
      'tufted Chesterfield-style sofa, wing-back armchair, antique-look wood coffee table, layered area rugs, bookshelves with curated objects and books, table lamps with linen shades',
    lighting:
      'layered warm lighting — table lamps + floor lamps + candlelit accents, filament Edison-style bulbs at ~2700K, soft amber glow suggesting evening, never overhead-only',
    atmosphere:
      'inviting, conversation-ready, textured. The room should feel like someone actually lives there — books out of place, a throw on the chair',
  },
  {
    theme: 'luxury',
    label: 'Luxury Contemporary',
    signature: 'Hotel-suite glamour with gallery-quality finishes.',
    materials:
      'book-matched marble with prominent veining, polished brass, silk velvet, lacquered black wood, crystal and cut-glass, mirror-finish metals',
    palette:
      'deep saturated tones — charcoal (#1E1E1E), emerald (#2E5D4D) OR sapphire (#1B3A5C), gold accents (#B89968), set against warm cream walls (#E8DECE). Pick one jewel tone, do not mix both',
    furniture:
      'statement sofa in jewel-tone velvet, sculptural coffee table in marble or burl wood, designer chair as focal point (Wassily or Barcelona-style), brass-detailed shelving, an oversized art piece on one wall',
    lighting:
      'dramatic chandelier or large sculptural pendant as centerpiece, accent uplighting on artwork, controlled directional shadows for cinematic depth, low-key dramatic lighting at ~3000K',
    atmosphere:
      'sophisticated, considered, cinematic. The room should feel like a five-star hotel suite or a Soho House lounge',
  },
]

export const VIEWS: ViewSpec[] = [
  {
    angle: 'main',
    label: 'Wide establishing shot',
    framing:
      "wide-angle from the room's entry or far corner, camera at 5'2\" eye height, 24mm equivalent lens, slight downward tilt to capture the floor plane, ~75° field of view",
    focus:
      'the complete room layout — primary furniture grouping and focal point are clearly visible. Conveys the spatial sense of the room',
    depth: 'deep depth-of-field — sharp throughout from foreground to background',
  },
  {
    angle: 'detail',
    label: 'Mid-range focal moment',
    framing:
      "35mm equivalent lens, camera at 4' height (slightly below eye level, more intimate), positioned at an asymmetric angle DIFFERENT from the wide shot, framing tighter on a key area — the seating conversation, a hero piece of furniture, or a styled surface",
    focus:
      'material textures and finishes clearly visible, secondary decor and styling details readable. The focal area "speaks" while the rest of the room provides context',
    depth:
      'shallow depth-of-field on the focal subject with the background softly defocused for cinematic separation',
  },
]

// ----- Prompt assembly -------------------------------------------------------

export interface UserDesignContext {
  /** The user's free-text prompt (already enriched with any refinement note). */
  prompt?: string
  /** Internal room type id, e.g. "living_room". */
  roomType?: string
  /** Free-text size (e.g. "200" or "200 sq ft"). */
  roomSize?: string
  /** Formatted budget (e.g. "$5,000 - $15,000"). Empty when not set. */
  budgetRange?: string
  /** Preset palette name or "custom". */
  colorPalette?: string
  /** Three hex colors when colorPalette === "custom". */
  customColors?: string[]
  /** Furniture pieces the user has explicitly selected to include. */
  selectedFurnitureItems?: FurnitureProduct[]
}

const ROOM_TYPE_DESCRIPTIONS: Record<string, string> = {
  living_room: 'living room with comfortable seating and entertainment area',
  bedroom: 'peaceful bedroom with sleeping and relaxation spaces',
  kitchen: 'functional kitchen with cooking and dining areas',
  bathroom: 'clean bathroom with proper fixtures and storage',
  dining_room: 'elegant dining room for meals and gatherings',
  office: 'productive office space for work and study',
}

function describeColorPreference(context: UserDesignContext): string | null {
  const { colorPalette, customColors } = context
  if (!colorPalette) return null
  if (colorPalette === 'custom' && customColors && customColors.length === 3) {
    return `Custom palette anchored on ${customColors[0]}, ${customColors[1]}, and ${customColors[2]} — integrate these throughout walls, furniture, and accents. Respect this preference even where it tensions with the theme palette below; treat the theme palette as guidance, custom colors as override`
  }
  const PRESETS: Record<string, string> = {
    neutral:
      'Neutral preference — lean toward the theme’s grey/white/black anchors with restrained colour',
    warm: 'Warm preference — push toward deeper reds, ochre, and cream within the theme',
    cool: 'Cool preference — lean toward blues, sage, and cooler greys within the theme',
    earth: 'Earth-tone preference — emphasise browns, oranges, and warm creams within the theme',
  }
  return PRESETS[colorPalette] ?? null
}

function describeFurniture(items?: FurnitureProduct[]): string | null {
  if (!items || items.length === 0) return null
  const list = items
    .map(
      (item) =>
        `${item.name} (${item.category}, ${item.wood_type}, ${item.dimensions.width}"W × ${item.dimensions.height}"H × ${item.dimensions.depth}"D)`
    )
    .join('; ')
  return `Incorporate these specific pieces naturally into the room layout: ${list}`
}

/**
 * Build the full prompt sent to Gemini for one (theme, view) combination.
 * Sections are explicit and labelled so the model treats theme anchors and
 * user preferences as authoritative — instead of melting them together into a
 * generic interior.
 */
export function buildThemePrompt(
  context: UserDesignContext,
  theme: ThemeAnchors,
  view: ViewSpec
): string {
  const roomDescription =
    ROOM_TYPE_DESCRIPTIONS[context.roomType ?? ''] ?? context.roomType ?? 'interior space'

  const userPrompt = (context.prompt ?? '').trim() || '(no additional brief — interpret freely within the theme)'

  const preferences: string[] = []
  if (context.roomSize?.trim()) {
    preferences.push(`Approximate room size: ${context.roomSize} square feet`)
  }
  if (context.budgetRange?.trim()) {
    preferences.push(
      `Budget tier: ${context.budgetRange} — finishes and furniture quality should read at this price point, neither cheaper nor more expensive`
    )
  }
  const colorNote = describeColorPreference(context)
  if (colorNote) preferences.push(colorNote)
  const furnitureNote = describeFurniture(context.selectedFurnitureItems)
  if (furnitureNote) preferences.push(furnitureNote)

  const preferencesBlock =
    preferences.length > 0
      ? preferences.map((p) => `- ${p}`).join('\n')
      : '- (none provided)'

  return `
ROOM: ${roomDescription}

USER BRIEF: "${userPrompt}"

THEME — ${theme.label}
Signature: ${theme.signature}
- Materials: ${theme.materials}
- Palette: ${theme.palette}
- Furniture: ${theme.furniture}
- Lighting: ${theme.lighting}
- Atmosphere: ${theme.atmosphere}

VIEW — ${view.label}
- Framing: ${view.framing}
- Focus: ${view.focus}
- Depth of field: ${view.depth}

USER PREFERENCES:
${preferencesBlock}

NEGATIVE GUIDANCE — avoid all of these:
- Generic Pinterest symmetry; use asymmetric framing where it serves the shot.
- Sterile, over-staged emptiness — rooms should look lived-in (a book on a table, a throw on a chair, a steam-curl from a coffee cup) unless the theme specifically calls for gallery emptiness.
- Mixing materials or palettes from OTHER themes (no warm walnut in the modern theme; no concrete in the cozy theme; no farmhouse beige drift).
- Identical or near-identical compositions between the wide shot and the detail shot — they must vary in camera angle, height, and emphasis.
- Floating furniture, impossible architecture, duplicated decor elements within frame, distorted scale.

OUTPUT REQUIREMENT:
A single photorealistic interior rendering that visualises THIS specific theme + view brief. The image must be visually distinguishable from a render of any other theme in the set — different palette, different materials, different lighting temperature, different atmosphere. Treat each request as one frame from a curated portfolio, not a generic stock photo.
  `.trim()
}
