import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your InnDesign notifications and activity.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return children
}
