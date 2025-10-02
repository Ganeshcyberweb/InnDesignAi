export const COLOR_PALETTES = [
  { id: "neutral", label: "Neutral", colors: ["#1a1a1a", "#6b7280", "#f3f4f6"] },
  { id: "warm", label: "Warm", colors: ["#991b1b", "#f59e0b", "#fef3c7"] },
  { id: "cool", label: "Cool", colors: ["#1e40af", "#3b82f6", "#dbeafe"] },
  { id: "earth", label: "Earth", colors: ["#92400e", "#d97706", "#fef7cd"] },
] as const;

export type ColorPaletteId = typeof COLOR_PALETTES[number]['id'];