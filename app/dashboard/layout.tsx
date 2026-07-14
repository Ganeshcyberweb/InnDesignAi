import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Generate AI interior designs, view your design history, and manage favourites.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
