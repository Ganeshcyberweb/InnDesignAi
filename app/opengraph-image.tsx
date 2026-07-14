import { ImageResponse } from "next/og"
import { OG_ALT, OG_SIZE, OgImageJsx } from "@/lib/seo/og-image"

// Route metadata for the Next.js file convention.
export const runtime = "edge"
export const alt = OG_ALT
export const size = OG_SIZE
export const contentType = "image/png"

export default async function OpengraphImage() {
  return new ImageResponse(<OgImageJsx />, { ...size })
}
