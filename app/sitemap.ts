import type { MetadataRoute } from "next"
import { DEEP_CASES } from "@/lib/cases"
import { NOTES } from "@/lib/notes-data"
import { abs } from "@/lib/seo"

// /sitemap.xml — every page worth indexing. The home page is one interactive
// document (its chapters are hash states, not routes), so it's a single entry;
// the case studies and notes are real pages with their own canonicals.

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: abs("/"), changeFrequency: "monthly", priority: 1 },
    ...DEEP_CASES.map((c) => ({
      url: abs(c.href!),
      lastModified: c.updated,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...NOTES.map((n) => ({
      url: abs(`/notes/${n.slug}`),
      lastModified: n.isoDate,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}
