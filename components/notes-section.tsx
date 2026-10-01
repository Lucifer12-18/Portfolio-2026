"use client"

import { useState } from "react"
import { SectionWrapper } from "@/components/section-wrapper"
import { motion, LayoutGroup } from "framer-motion"
import { NoteCover } from "@/components/covers"
import { notePigment } from "@/lib/note-covers"
import Link from "next/link"
import { NOTES, type NoteMetadata } from "@/lib/notes-data"
import { Spotlight } from "@/components/spotlight"
import { DecodeText } from "@/components/decode-text"
import { ArrowChip } from "@/components/primitives"
import { childRise, childRiseHeavy, childSlide, SNAP } from "@/lib/motion"

const filters = ["All", "UX", "AI", "Systems", "Career"]

/** "#rrggbb" → "r, g, b" for Spotlight. */
const hexToRgbTriple = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ")

/** Featured note — the first article gets the wide editorial treatment. */
function FeaturedNote({ note, number }: { note: NoteMetadata; number: number }) {
  return (
    <motion.div variants={childSlide} initial="hidden" animate="show" custom={3}>
      <Link href={`/notes/${note.slug}`} data-track={`note_open:${note.slug}`} className="group block rounded-2xl">
        <Spotlight size={420} color={hexToRgbTriple(notePigment(note.slug))} intensity={0.09} className="rounded-2xl">
          <article className="surface surface-interactive overflow-hidden grid @2xl:grid-cols-5">
            <div className="@2xl:col-span-3 relative aspect-[16/10] @2xl:aspect-auto @2xl:min-h-[280px] overflow-hidden border-b @2xl:border-b-0 @2xl:border-r border-hair">
              <NoteCover slug={note.slug} number={number} tag={note.tag} />
            </div>

            <div className="@2xl:col-span-2 p-6 @2xl:p-7 flex flex-col justify-between gap-6">
              <div className="space-y-3.5">
                <p className="label-mono tabular-nums">Latest · {note.date}</p>
                <h3 className="text-[clamp(1.35rem,2.2vw,1.7rem)] leading-[1.12] tracking-[-0.035em] text-bone">{note.title}</h3>
                <p className="text-[14px] text-bone-3 leading-[1.6] line-clamp-3">{note.excerpt}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-hair">
                <span className="font-mono text-[12px] text-bone">Read note</span>
                <ArrowChip />
              </div>
            </div>
          </article>
        </Spotlight>
      </Link>
    </motion.div>
  )
}

function NoteCard({ note, index, number }: { note: NoteMetadata; index: number; number: number }) {
  return (
    <motion.div variants={childSlide} initial="hidden" animate="show" custom={3 + index} className="h-full">
      <Link href={`/notes/${note.slug}`} data-track={`note_open:${note.slug}`} className="group block h-full rounded-2xl">
        <Spotlight size={300} color={hexToRgbTriple(notePigment(note.slug))} intensity={0.09} className="rounded-2xl h-full">
          <article className="surface surface-interactive h-full overflow-hidden flex flex-col">
            <div className="w-full aspect-[16/10] relative overflow-hidden border-b border-hair">
              <NoteCover slug={note.slug} number={number} tag={note.tag} />
            </div>

            <div className="p-5 flex flex-1 items-end justify-between gap-4">
              <div className="space-y-1.5">
                <p className="label-mono tabular-nums">{note.date}</p>
                <h3 className="text-[17px] leading-[1.2] tracking-[-0.025em] text-bone">{note.title}</h3>
              </div>
              <ArrowChip />
            </div>
          </article>
        </Spotlight>
      </Link>
    </motion.div>
  )
}

export function NotesSection() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredNotes =
    activeFilter === "All"
      ? NOTES
      : NOTES.filter((note) => note.category === activeFilter || note.tag.includes(activeFilter))

  const [featured, ...rest] = filteredNotes

  return (
    <SectionWrapper id="chapter-5" windowTitle="NOTES · OBSERVATIONS FROM THE FIELD" moduleLabel="NOTES · OBSERVATIONS FROM THE FIELD">
      <div className="relative space-y-8">
        <div className="grid @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 @3xl:gap-12 items-end">
          <div className="space-y-6">
            <motion.div variants={childRise} initial="hidden" animate="show" custom={0}>
              <span className="eyebrow">Scene 05 · Notes</span>
            </motion.div>
            <motion.h2 variants={childRiseHeavy} initial="hidden" animate="show" custom={1} className="display-lg text-bone">
              <span className="ink-dim">Short dispatches</span>
              <br />
              <DecodeText text="from in-between work." delay={300} className="ink-accent" />
            </motion.h2>
          </div>
          <motion.p variants={childRise} initial="hidden" animate="show" custom={2} className="lede">
            Short notes from between projects. One idea each.
          </motion.p>
        </div>

        {/* Filters — a segmented row; the bone pill slides to the active one */}
        <motion.div variants={childRise} initial="hidden" animate="show" custom={2} role="group" aria-label="Filter notes by topic">
          <LayoutGroup id="note-filters">
            <div className="inline-flex flex-wrap gap-1 rounded-[10px] border border-hair p-1">
              {filters.map((filter) => {
                const active = activeFilter === filter
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={active}
                    className={`relative isolate h-8 px-3.5 rounded-[7px] font-mono text-[11px] transition-colors ${
                      active ? "text-[#111110]" : "text-bone-3 hover:text-bone"
                    }`}
                  >
                    {active && (
                      <motion.span layoutId="note-filter-pill" className="absolute inset-0 -z-10 rounded-[7px] bg-bone" transition={SNAP} />
                    )}
                    <span className="relative">{filter}</span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>
        </motion.div>

        {featured ? (
          <FeaturedNote key={`f-${featured.slug}`} note={featured} number={NOTES.indexOf(featured) + 1} />
        ) : (
          <p className="text-[14px] text-bone-3">No notes in this topic yet.</p>
        )}

        {rest.length > 0 && (
          <div className="grid @xl:grid-cols-2 @5xl:grid-cols-3 gap-4">
            {rest.map((note, i) => (
              <NoteCard key={note.slug} note={note} index={i + 1} number={NOTES.indexOf(note) + 1} />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
