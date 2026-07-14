import { ImageResponse } from "next/og"
import { OG_ALT, OG_SIZE, OgImageJsx } from "@/lib/seo/og-image"

// Same visual as opengraph-image — shared JSX in lib/seo/og-image.tsx.
export const runtime = "edge"
export const alt = OG_ALT
export const size = OG_SIZE
export const contentType = "image/png"

export default async function TwitterImage() {
  return new ImageResponse(<OgImageJsx />, { ...size })
}
