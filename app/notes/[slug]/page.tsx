import { getAllNoteSlugs, getNoteBySlug } from "@/lib/notes"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Clock, Calendar } from "lucide-react"

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
  return {
    title: `${note.title} — Vishal Deshmukh`,
    description: note.excerpt,
    openGraph: {
      title: note.title,
      description: note.excerpt,
      images: [{ url: note.imagePath }],
      type: "article",
      publishedTime: note.isoDate,
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
    <div
      className="min-h-screen"
      style={{
        background: "#0a0a0c",
        backgroundImage: "radial-gradient(circle, rgba(34, 211, 238, 0.04) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Top nav bar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{
          background: "rgba(10, 10, 12, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <Link
          href="/#chapter-5"
          className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.24em] transition-colors hover:text-slate-200"
          style={{ color: "rgb(148, 163, 184)" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Notes
        </Link>

        <span
          className="text-[10px] font-mono uppercase tracking-[0.24em] px-2.5 py-1 rounded border"
          style={{
            color: note.accentColor,
            background: `${note.accentColor}14`,
            borderColor: `${note.accentColor}30`,
          }}
        >
          {note.tag}
        </span>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-16 md:py-20">
        {/* Article header — editorial */}
        <header className="mb-12 space-y-6">
          <span
            className="eyebrow"
            style={{ color: note.accentColor }}
          >
            Note · {note.category}
          </span>

          <h1
            className="font-display font-bold leading-[1.02] tracking-[-0.035em]"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              color: "rgb(240, 244, 252)",
            }}
          >
            {note.title}
          </h1>

          <p
            className="font-light leading-[1.55] tracking-[-0.005em]"
            style={{
              fontSize: "clamp(1.0625rem, 1.35vw, 1.25rem)",
              color: "rgba(203, 213, 225, 0.92)",
              maxWidth: "42ch",
            }}
          >
            {note.excerpt}
          </p>

          {/* Meta row */}
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[11px] font-mono uppercase tracking-[0.2em]"
            style={{ color: "rgb(100, 116, 139)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              <time dateTime={note.isoDate}>{note.date}</time>
            </span>
            <span style={{ color: "rgb(51, 65, 85)" }}>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {note.readingTime} min read
            </span>
            <span style={{ color: "rgb(51, 65, 85)" }}>·</span>
            <span className="opacity-80">{note.file}</span>
          </div>
        </header>

        {/* Hero image — cinematic wide ratio */}
        <div
          className="relative w-full aspect-[21/10] rounded-2xl overflow-hidden mb-12 border"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Image
            src={note.imagePath}
            alt={note.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 35%, rgba(10,10,12,0.6))`,
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${note.accentColor}, transparent)`,
            }}
          />
        </div>

        {/* Note body — drop cap on first paragraph applied via .note-prose */}
        <article
          className="note-prose"
          dangerouslySetInnerHTML={{ __html: note.contentHtml }}
        />

        {/* Footer */}
        <footer
          className="mt-16 pt-6 border-t flex items-center justify-between"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <Link
            href="/#chapter-5"
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.24em] transition-colors hover:text-slate-200"
            style={{ color: "rgb(148, 163, 184)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All notes
          </Link>

          <span
            className="text-[10px] font-mono uppercase tracking-[0.2em]"
            style={{ color: "rgb(71, 85, 105)" }}
          >
            Vishal Deshmukh · {note.date}
          </span>
        </footer>
      </main>
    </div>
  )
}
