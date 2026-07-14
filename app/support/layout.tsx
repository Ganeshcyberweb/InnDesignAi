import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/schema"

const title = "Contact Support — InnDesign AI"
const description =
  "Need a hand? Reach the InnDesign team with questions about billing, features, or your account — we typically reply within one business day."

export const metadata: Metadata = {
  title: "Contact Support",
  description,
  keywords: [
    "InnDesign support",
    "InnDesign contact",
    "InnDesign customer service",
    "AI interior design help",
  ],
  alternates: { canonical: "/support" },
  openGraph: {
    title,
    description,
    url: "/support",
    type: "website",
  },
  twitter: {
    title,
    description,
  },
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact Support", path: "/support" },
        ])}
      />
      {children}
    </>
  )
}
