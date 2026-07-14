import type { Metadata } from "next"

/**
 * Group layout for all authentication routes. Sets a sitewide `noindex` so
 * login / signup / password-reset pages don't rank in Google — they're
 * transactional, not marketing.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  return children
}
