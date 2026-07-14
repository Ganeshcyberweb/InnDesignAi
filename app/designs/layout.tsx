import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Designs",
  description: "Your generated interior designs and iteration history.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function DesignsLayout({ children }: { children: React.ReactNode }) {
  return children
}
