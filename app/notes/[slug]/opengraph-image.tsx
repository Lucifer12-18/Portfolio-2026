import { NOTES } from "@/lib/notes-data"
import { NOTE_COVERS, notePigment } from "@/lib/note-covers"
import { ogCard, OG_SIZE } from "@/lib/og-card"

// Each note's share card: its cover word, title and pigment. Replaces the old
// SVG thumbnails, which LinkedIn, X and Slack can't show as previews.
export const alt = "A note by Vishal Deshmukh"
export const size = OG_SIZE
export const contentType = "image/png"

export function generateStaticParams() {
  return NOTES.map((n) => ({ slug: n.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const note = NOTES.find((n) => n.slug === slug)
  const cover = NOTE_COVERS[slug]
  const excerpt = note?.excerpt ?? ""
  return ogCard({
    kicker: `Note · ${note?.tag ?? "Notes"}`,
    title: cover?.word ?? "Note.",
    accent: note?.title ?? "",
    line: excerpt.length > 110 ? `${excerpt.slice(0, excerpt.lastIndexOf(" ", 107))}…` : excerpt,
    footer: note?.date ?? "",
    pigment: notePigment(slug),
  })
}
