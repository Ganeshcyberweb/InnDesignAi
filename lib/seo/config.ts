/**
 * Central SEO configuration for InnDesign.
 * Everything reads from here so page-level metadata stays consistent.
 *
 * Set NEXT_PUBLIC_SITE_URL in production (Vercel) to override the fallback.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://inn-design-ai.vercel.app"

export const SITE_NAME = "InnDesign AI"
export const SITE_SHORT_NAME = "InnDesign"
export const SITE_TAGLINE = "AI-Powered Interior Design"

export const SITE_DESCRIPTION =
  "Transform any room into three photorealistic interior designs in under a minute. Upload a photo, describe your vision, and get AI-generated concepts with cost estimates and ROI analysis."

export const DEFAULT_KEYWORDS = [
  "AI interior design",
  "interior design generator",
  "AI room design",
  "virtual home staging",
  "AI home renovation",
  "interior design software",
  "room visualizer AI",
  "renovation ROI calculator",
  "AI decorator",
  "interior design app",
]

// OG / Twitter image is generated dynamically by app/opengraph-image.tsx and
// app/twitter-image.tsx (Next.js file conventions) — see lib/seo/og-image.tsx
// for the shared JSX.

export const TWITTER_HANDLE = "@inndesignai"

export const ORG_LOGO = `${SITE_URL}/favicon.ico`

/** Absolute URL builder — useful for canonical + og:url + JSON-LD `@id`s. */
export function absoluteUrl(path: string = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${p}`
}
