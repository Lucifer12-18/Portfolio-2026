import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

// /robots.txt — everything public is crawlable; the private stats dashboard
// and the API are not. Vercel already marks preview deployments noindex.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/stats", "/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
