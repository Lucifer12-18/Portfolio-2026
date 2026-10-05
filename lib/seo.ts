import type { Metadata } from "next"
import { PROFILE, EXPERIENCE } from "@/lib/profile"
import type { CaseMeta } from "@/lib/cases"

// ─────────────────────────────────────────────────────────────────────────────
// SEO — one place for the public origin, page metadata and structured data
// (JSON-LD). Share cards and canonicals must always resolve against the public
// domain: per-deployment Vercel URLs sit behind Vercel's login, so crawlers and
// LinkedIn/Slack previews can't read them.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vishal-deshmukh.vercel.app"
export const SITE_NAME = "Vishal Deshmukh · Product Designer"

/** The origin metadata resolves against: the public domain on any Vercel build. */
export const METADATA_BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL ? SITE_URL : "http://localhost:3001")

export const abs = (path: string) => new URL(path, SITE_URL).toString()

const PERSON_ID = abs("/#person")
const current = EXPERIENCE.find((r) => r.current)

/** Who the site is about — referenced by every other node via @id. */
export const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: PROFILE.name,
  url: SITE_URL,
  image: abs("/images/vishal-portrait-2026.jpg"),
  jobTitle: current ? current.role : PROFILE.title,
  worksFor: current ? { "@type": "Organization", name: `${current.org}${current.orgNote ? ` ${current.orgNote}` : ""}` } : undefined,
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Maryland, Baltimore County" },
  address: { "@type": "PostalAddress", addressLocality: "Baltimore", addressRegion: "MD", addressCountry: "US" },
  description: PROFILE.summary,
  knowsAbout: ["Product design", "Design systems", "Interaction design", "AI product design", "User research", "Prototyping"],
  sameAs: [PROFILE.linkedin],
}

export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": abs("/#website"),
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "en",
      author: { "@id": PERSON_ID },
    },
    personNode,
  ],
}

const crumbs = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
})

/** A case study as an Article, plus its breadcrumb trail. */
export function caseGraph(c: CaseMeta) {
  const url = abs(c.href!)
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: c.title.replace(" · ", ": "),
        description: c.summary,
        url,
        mainEntityOfPage: url,
        image: abs(`${c.href}/opengraph-image`),
        datePublished: c.published,
        dateModified: c.updated,
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        keywords: c.tags.join(", "),
        about: c.tags,
        inLanguage: "en",
      },
      crumbs([
        { name: "Home", path: "/" },
        { name: "Work", path: "/#chapter-4" },
        { name: c.title.replace(" · ", ": "), path: c.href! },
      ]),
    ],
  }
}

export function noteGraph(n: { slug: string; title: string; excerpt: string; isoDate: string; tag: string }) {
  const path = `/notes/${n.slug}`
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${abs(path)}#post`,
        headline: n.title,
        description: n.excerpt,
        url: abs(path),
        mainEntityOfPage: abs(path),
        image: abs(`${path}/opengraph-image`),
        datePublished: n.isoDate,
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        keywords: n.tag,
        inLanguage: "en",
      },
      crumbs([
        { name: "Home", path: "/" },
        { name: "Notes", path: "/#chapter-5" },
        { name: n.title, path },
      ]),
    ],
  }
}

/** Page metadata for a deep case study: title, canonical, share card text. */
export function caseMetadata(c: CaseMeta): Metadata {
  const title = `${c.title.replace(" · ", ": ")} · Case Study`
  return {
    title,
    description: c.summary,
    keywords: [...c.tags, "case study", "product design portfolio", PROFILE.name],
    alternates: { canonical: c.href },
    openGraph: {
      type: "article",
      url: c.href,
      siteName: SITE_NAME,
      title,
      description: c.summary,
      publishedTime: c.published,
      modifiedTime: c.updated,
      authors: [SITE_URL],
      tags: c.tags,
    },
    twitter: { card: "summary_large_image", title, description: c.summary },
  }
}
