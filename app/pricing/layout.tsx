import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/schema"

const title = "Pricing — Free, Pro & Enterprise Plans | InnDesign"
const description =
  "Start free — no credit card required. Compare InnDesign AI's Free, Pro, and Enterprise plans and pick the interior design workflow that fits your team."

export const metadata: Metadata = {
  title: "Pricing",
  description,
  keywords: [
    "InnDesign pricing",
    "AI interior design pricing",
    "AI room design cost",
    "interior design software plans",
    "free AI interior design",
  ],
  alternates: { canonical: "/pricing" },
  openGraph: {
    title,
    description,
    url: "/pricing",
    type: "website",
  },
  twitter: {
    title,
    description,
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      {children}
    </>
  )
}
