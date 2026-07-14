import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your InnDesign account to generate AI interior designs, view your history, and manage favourites.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
