import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/schema"

const title = "About InnDesign — Our Story & Mission"
const description =
  "Meet the team behind InnDesign AI. We're building AI tools that turn any room photo into photorealistic interior designs, so homeowners, hoteliers and designers can plan renovations with confidence."

export const metadata: Metadata = {
  title: "About",
  description,
  keywords: [
    "about InnDesign",
    "InnDesign AI company",
    "AI interior design team",
    "interior design startup",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title,
    description,
    url: "/about",
    type: "website",
  },
  twitter: {
    title,
    description,
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      {children}
    </>
  )
}
