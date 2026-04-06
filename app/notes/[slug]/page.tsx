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
        background: "#020617",
        backgroundImage: "radial-gradient(circle, rgba(34, 211, 238, 0.04) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Top nav bar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{
          background: "rgba(2, 6, 23, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <Link
          href="/#chapter-5"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: "rgb(148, 163, 184)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Link>

        <span
          className="text-xs font-mono px-2 py-1 rounded border"
          style={{
            color: note.accentColor,
            background: `${note.accentColor}14`,
            borderColor: `${note.accentColor}30`,
          }}
        >
          {note.tag}
        </span>
      </header>

      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-5 text-xs font-mono" style={{ color: "rgb(100, 116, 139)" }}>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              <time dateTime={note.isoDate}>{note.date}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {note.readingTime} min read
            </span>
            <span className="font-mono opacity-60">{note.file}</span>
          </div>

          <h1
            className="text-2xl md:text-3xl font-semibold leading-snug mb-4"
            style={{ color: "rgb(226, 232, 240)" }}
          >
            {note.title}
          </h1>

          <p className="text-base leading-relaxed" style={{ color: "rgb(148, 163, 184)" }}>
            {note.excerpt}
          </p>
        </header>

        {/* Hero image */}
        <div
          className="relative w-full h-52 md:h-64 rounded-xl overflow-hidden mb-10 border"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Image
            src={note.imagePath}
            alt={note.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 40%, rgba(2,6,23,0.5))`,
            }}
          />
          {/* Accent top border */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${note.accentColor}, transparent)`,
            }}
          />
        </div>

        {/* Note body */}
        <article
          className="note-prose"
          dangerouslySetInnerHTML={{ __html: note.contentHtml }}
        />

        {/* Footer */}
        <footer
          className="mt-14 pt-6 border-t flex items-center justify-between"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <Link
            href="/#chapter-5"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: "rgb(148, 163, 184)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            All notes
          </Link>

          <span className="text-xs font-mono" style={{ color: "rgb(71, 85, 105)" }}>
            Vishal Deshmukh · {note.date}
          </span>
        </footer>
      </main>
    </div>
  )
}
