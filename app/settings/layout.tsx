import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your InnDesign account, profile, and preferences.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
