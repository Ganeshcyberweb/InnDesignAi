import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo/config"

/**
 * Allow crawlers on all public marketing pages; keep authenticated app
 * surfaces and API routes out of the index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/designs/",
          "/settings",
          "/profile",
          "/notifications",
          "/login",
          "/signup",
          "/reset-password",
          "/confirm-email",
          "/auth/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
