import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/schema"

const title = "Features — AI Interior Design Tools | InnDesign"
const description =
  "See everything InnDesign AI can do: multi-theme room generation, cost & ROI analysis, per-theme regeneration, design history, favourites, and a full admin analytics suite."

export const metadata: Metadata = {
  title: "Features",
  description,
  keywords: [
    "AI interior design features",
    "AI room generator features",
    "ROI analysis interior design",
    "AI home renovation tools",
    "design regeneration AI",
  ],
  alternates: { canonical: "/features" },
  openGraph: {
    title,
    description,
    url: "/features",
    type: "website",
  },
  twitter: {
    title,
    description,
  },
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />
      {children}
    </>
  )
}
