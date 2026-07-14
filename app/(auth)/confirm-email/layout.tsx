import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Confirm Email",
  description: "Confirm your email address to activate your InnDesign account.",
}

export default function ConfirmEmailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
