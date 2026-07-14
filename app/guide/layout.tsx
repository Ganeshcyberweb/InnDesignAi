import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/schema"

const title = "User Guide — Get Started with InnDesign AI"
const description =
  "Step-by-step guide to generating your first AI interior design, refining themes with feedback, and reading cost & ROI analysis in InnDesign."

export const metadata: Metadata = {
  title: "User Guide",
  description,
  keywords: [
    "InnDesign guide",
    "how to use InnDesign",
    "AI interior design tutorial",
    "AI room design guide",
    "InnDesign getting started",
  ],
  alternates: { canonical: "/guide" },
  openGraph: {
    title,
    description,
    url: "/guide",
    type: "article",
  },
  twitter: {
    title,
    description,
  },
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "User Guide", path: "/guide" },
        ])}
      />
      {children}
    </>
  )
}
