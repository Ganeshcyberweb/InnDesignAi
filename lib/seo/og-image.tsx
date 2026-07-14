/**
 * Shared JSX for the sitewide OG / Twitter card image.
 *
 * Consumed by both app/opengraph-image.tsx and app/twitter-image.tsx so both
 * files render identical pixels without duplicating markup. Kept plain — no
 * external fonts, no images — so it runs on the edge runtime with zero
 * network calls at request time.
 */

import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "./config"

export const OG_SIZE = {
  width: 1200,
  height: 630,
} as const

export const OG_ALT = `${SITE_NAME} — ${SITE_TAGLINE}`

/** JSX passed into ImageResponse. Styles use inline CSS-in-JS (satori subset). */
export function OgImageJsx() {
  const hostname = SITE_URL.replace(/^https?:\/\//, "")

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #312e81 100%)",
        color: "#f8fafc",
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
      }}
    >
      {/* Decorative gradient ring, top-right */}
      <div
        style={{
          position: "absolute",
          top: -220,
          right: -220,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.55), transparent 60%)",
          filter: "blur(4px)",
          display: "flex",
        }}
      />
      {/* Decorative blob, bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: -180,
          left: -160,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 60% 60%, rgba(59,130,246,0.5), transparent 65%)",
          filter: "blur(4px)",
          display: "flex",
        }}
      />

      {/* Top row — wordmark + eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background:
              "linear-gradient(135deg, #a855f7 0%, #6366f1 60%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 800,
            color: "#0b1220",
          }}
        >
          I
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
            {SITE_NAME}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#a5b4fc",
              marginTop: 2,
            }}
          >
            {hostname}
          </div>
        </div>
      </div>

      {/* Middle — headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          zIndex: 1,
          maxWidth: 1000,
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: -2.5,
            lineHeight: 1.02,
            color: "#f8fafc",
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.3,
            color: "#cbd5e1",
            maxWidth: 900,
          }}
        >
          Turn any room photo into three photorealistic designs — with cost &
          ROI analysis — in under a minute.
        </div>
      </div>

      {/* Bottom row — pill chips */}
      <div
        style={{
          display: "flex",
          gap: 14,
          zIndex: 1,
        }}
      >
        {[
          "AI photorealistic renders",
          "Cost & ROI",
          "Per-theme refinement",
        ].map((label) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 22px",
              borderRadius: 999,
              background: "rgba(248,250,252,0.08)",
              border: "1px solid rgba(248,250,252,0.18)",
              fontSize: 22,
              color: "#e2e8f0",
              fontWeight: 500,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
