/**
 * JSON-LD schema builders. Each function returns a plain object that can be
 * serialised inside a <script type="application/ld+json"> tag.
 *
 * Keep these small and typed loosely (`Record<string, unknown>`) — schema.org
 * types are open and google's docs favour permissiveness over strict typing.
 */

import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  ORG_LOGO,
  absoluteUrl,
} from "./config"

type JsonLd = Record<string, unknown>

/** Sitewide Organization. Used in the root layout. */
export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: ORG_LOGO,
    },
    description: SITE_DESCRIPTION,
    sameAs: [
      // Add real profile URLs when they exist.
      // "https://twitter.com/inndesignai",
      // "https://www.linkedin.com/company/inndesignai",
    ],
  }
}

/** Sitewide WebSite entity + a SearchAction so Google can render a sitelinks searchbox. */
export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  }
}

/**
 * SoftwareApplication entity for the home page. Presents InnDesign as an app
 * so Google can render richer results (rating, pricing) in the future.
 */
export function softwareApplicationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#app`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    applicationCategory: "DesignApplication",
    applicationSubCategory: "InteriorDesign",
    operatingSystem: "Web",
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    featureList: [
      "AI photorealistic room rendering",
      "Multi-theme design variations",
      "Cost and ROI analysis",
      "Per-theme regeneration with feedback",
      "Guest free trial",
      "Design history and favourites",
    ],
  }
}

export interface FaqItem {
  question: string
  answer: string
}

/** FAQPage — used on /help. */
export function faqSchema(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export interface BreadcrumbItem {
  name: string
  path: string
}

/** BreadcrumbList — pass a top-down list ending at the current page. */
export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
