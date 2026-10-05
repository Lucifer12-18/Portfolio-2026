import { getAllNoteSlugs, getNoteBySlug } from "@/lib/notes"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { NoteCover } from "@/components/covers"
import { notePigmentIndex } from "@/lib/note-covers"
import { NOTES } from "@/lib/notes-data"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { ChapterTint } from "@/components/chapter-tint"
import { noteGraph, SITE_NAME, SITE_URL } from "@/lib/seo"

export async function generateStaticParams() {
  const slugs = getAllNoteSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const note = await getNoteBySlug(slug)
  if (!note) return {}
  // The share image comes from ./opengraph-image.tsx (a PNG card); the old
  // SVG thumbnails can't be shown by LinkedIn, X or Slack.
  return {
    title: note.title,
    description: note.excerpt,
    alternates: { canonical: `/notes/${slug}` },
    openGraph: {
      title: note.title,
      description: note.excerpt,
      type: "article",
      url: `/notes/${slug}`,
      siteName: SITE_NAME,
      publishedTime: note.isoDate,
      authors: [SITE_URL],
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.excerpt,
    },
  }
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const note = await getNoteBySlug(slug)
  if (!note) notFound()

  return (
    <div className="min-h-screen bg-ink-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(noteGraph({ ...note, slug: note.slug })) }}
      />
      {/* Each note wears its cover's pigment */}
      <ChapterTint index={notePigmentIndex(note.slug)} />
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-14 border-b border-hair bg-[rgb(15_15_14/0.8)] backdrop-blur-xl">
        <Link
          href="/#chapter-5"
          className="inline-flex items-center gap-2 font-mono text-[11px] text-bone-3 transition-colors hover:text-bone"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
          Back to notes
        </Link>
        <span className="font-sans text-[14px] font-semibold uppercase tracking-[0.02em]">
          <span className="text-bone">Pixelogic</span> <span className="text-chapter">OS</span>
        </span>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
        {/* Article header — editorial */}
        <header className="mb-12 space-y-6">
          <span className="eyebrow">
            Note · {note.tag}
          </span>

          <h1 className="text-bone font-medium leading-[1.02] tracking-[-0.045em] text-[clamp(2.25rem,5vw,3.75rem)]">
            {note.title}
          </h1>

          <p className="lede !max-w-[52ch]">{note.excerpt}</p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 font-mono text-[11px] text-bone-3">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3" strokeWidth={1.6} />
              <time dateTime={note.isoDate}>{note.date}</time>
            </span>
            <span className="text-bone-4" aria-hidden>/</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" strokeWidth={1.6} />
              {note.readingTime} min read
            </span>
            <span className="text-bone-4" aria-hidden>/</span>
            <span>{note.file}</span>
          </div>
        </header>

        {/* Cover — the same poster the Notes card showed */}
        <div className="group relative w-full aspect-[21/10] rounded-2xl overflow-hidden mb-14 border border-hair">
          <NoteCover slug={note.slug} number={NOTES.findIndex((n) => n.slug === note.slug) + 1} tag={note.tag} />
        </div>

        {/* Note body — drop cap on first paragraph applied via .note-prose */}
        <article className="note-prose" dangerouslySetInnerHTML={{ __html: note.contentHtml }} />

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-hair flex items-center justify-between">
          <Link
            href="/#chapter-5"
            className="group inline-flex items-center gap-3 font-mono text-[12px] text-bone"
          >
            <span className="arrow-chip">
              <ArrowLeft strokeWidth={1.6} />
            </span>
            All notes
          </Link>
          <span className="font-mono text-[11px] text-bone-3">Vishal Deshmukh · {note.date}</span>
        </footer>
      </main>
    </div>
  )
}
