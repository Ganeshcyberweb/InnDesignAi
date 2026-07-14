import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { faqSchema, breadcrumbSchema, type FaqItem } from "@/lib/seo/schema"

const title = "Help Center — FAQs & Support | InnDesign"
const description =
  "Answers to the most common questions about InnDesign AI: generating designs, ROI analysis, download options, image formats, and how to get help."

/**
 * Keep this in sync with the visible FAQ Accordion in app/help/page.tsx.
 * Google requires the FAQPage schema's answers to match the on-page text.
 */
const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I generate a design?",
    answer:
      "Open the Design Assistant from your dashboard, upload 1–3 photos of your space (JPG, PNG, or WebP), describe your design vision in the prompt field, fill in room type, style, and budget, then click Generate Design. The AI returns multiple design variations with ROI analysis for each option.",
  },
  {
    question: "What is ROI analysis and how does it work?",
    answer:
      "ROI analysis estimates the financial impact of your design choices — current property value, projected post-renovation value, estimated cost, expected net gain, and ROI percentage. These are AI-generated estimates; always consult professionals for accurate valuations.",
  },
  {
    question: "How many designs can I create?",
    answer:
      "It depends on your plan. Free: 3 designs per month. Pro: 50 designs per month. Enterprise: unlimited. Each generation creates multiple theme variations, so you get several options per request.",
  },
  {
    question: "How do I download my designs?",
    answer:
      "From the Design Assistant, click the download icon on any image to save it, or Download All as ZIP to grab every image plus the ROI analysis. From the History page, find your design and click Download for a full ZIP with images, metadata, and ROI analysis.",
  },
  {
    question: "Can I regenerate or modify a design?",
    answer:
      "Yes. Open a design's detail page from History, click Regenerate Design, tweak your prompt, style, or budget, and generate new variations. The original stays saved and all regenerations are tracked so you can compare versions.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "InnDesign supports JPEG (.jpg, .jpeg), PNG (.png), and WebP (.webp). For best results, upload high-quality images (at least 1024×1024 px) with good lighting. You can upload up to 3 images per design.",
  },
  {
    question: "How long does it take to generate a design?",
    answer:
      "Typically 30–90 seconds, depending on how many images you uploaded, prompt complexity, and current server load. A progress indicator runs during generation and the page updates automatically when your designs are ready.",
  },
]

export const metadata: Metadata = {
  title: "Help Center",
  description,
  keywords: [
    "InnDesign help",
    "InnDesign FAQ",
    "AI interior design help",
    "InnDesign support",
    "interior design questions",
  ],
  alternates: { canonical: "/help" },
  openGraph: {
    title,
    description,
    url: "/help",
    type: "website",
  },
  twitter: {
    title,
    description,
  },
}

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="help"
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Help Center", path: "/help" },
          ]),
          faqSchema(FAQ_ITEMS),
        ]}
      />
      {children}
    </>
  )
}
