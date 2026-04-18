"use client"

import { useState } from "react"
import { SectionWrapper } from "@/components/section-wrapper"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { NOTES, type NoteMetadata } from "@/lib/notes-data"
import { Spotlight } from "@/components/spotlight"

/** Convert an #rrggbb hex into "r, g, b" for Spotlight's `color` prop. */
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

const filters = ["All", "UX", "AI", "Systems", "Career"]

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease },
  }),
}

/**
 * Featured note — oversized editorial treatment for the first article.
 */
function FeaturedNote({ note }: { note: NoteMetadata }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      custom={0}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link href={`/notes/${note.slug}`}>
        <Spotlight size={420} color={hexToRgb(note.accentColor)} intensity={0.13} className="rounded-2xl">
        <motion.article
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3, ease }}
          className="relative rounded-2xl overflow-hidden group cursor-pointer"
          style={{
            background: "rgba(8, 15, 40, 0.65)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: hovered
              ? `1px solid ${note.accentColor}`
              : "1px solid rgba(255, 255, 255, 0.07)",
            boxShadow: hovered
              ? `0 0 0 1px ${note.accentColor}22, 0 16px 48px rgba(0,0,0,0.5)`
              : "0 2px 12px rgba(0,0,0,0.25)",
            transition: "box-shadow 0.4s ease, border-color 0.4s ease",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1px] z-10"
            style={{
              background: `linear-gradient(90deg, transparent, ${note.accentColor}, transparent)`,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.35s ease",
            }}
          />

          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto overflow-hidden">
              <Image
                src={note.imagePath}
                alt={note.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, transparent 60%, rgba(8,15,40,0.5))`,
                }}
              />
            </div>

            <div className="md:col-span-3 p-7 md:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-mono uppercase tracking-[0.28em]"
                    style={{ color: note.accentColor }}
                  >
                    Featured Note · {note.tag}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{note.date}</span>
                </div>

                <h3
                  className="font-display font-bold leading-[1.08] tracking-[-0.025em] transition-colors duration-300"
                  style={{
                    fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                    color: hovered ? note.accentColor : "rgb(240, 244, 252)",
                  }}
                >
                  {note.title}
                </h3>

                <p className="text-[15px] text-slate-400 leading-[1.65] max-w-xl">
                  {note.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                  {note.file}
                </span>
                <motion.span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: note.accentColor }}
                  animate={{ x: hovered ? 3 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Read note
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </motion.span>
              </div>
            </div>
          </div>
        </motion.article>
        </Spotlight>
      </Link>
    </motion.div>
  )
}

function NoteCard({ note, index }: { note: NoteMetadata; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease }}
    >
      <Link href={`/notes/${note.slug}`}>
        <Spotlight size={300} color={hexToRgb(note.accentColor)} intensity={0.13} className="rounded-xl h-full block">
        <article
          className="relative rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col"
          style={{
            background: "rgba(8, 15, 40, 0.65)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: hovered
              ? `1px solid ${note.accentColor}`
              : "1px solid rgba(255, 255, 255, 0.07)",
            boxShadow: hovered
              ? `0 0 0 1px ${note.accentColor}22, 0 10px 36px rgba(0,0,0,0.4)`
              : "0 2px 8px rgba(0,0,0,0.2)",
            transition: "box-shadow 0.4s ease, border-color 0.4s ease",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1px] z-10"
            style={{
              background: `linear-gradient(90deg, transparent, ${note.accentColor}, transparent)`,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />

          <div className="w-full aspect-[16/9] relative overflow-hidden">
            <Image
              src={note.imagePath || "/placeholder.svg"}
              alt={note.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, transparent 55%, rgba(8,15,40,0.5))`,
              }}
            />
          </div>

          <div className="p-6 flex flex-col flex-1 gap-3">
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.24em]"
                style={{ color: note.accentColor }}
              >
                {note.tag}
              </span>
              <span className="text-[10px] font-mono text-slate-500">{note.date}</span>
            </div>

            <h3
              className="font-display font-semibold leading-[1.15] tracking-[-0.02em] transition-colors duration-300"
              style={{
                fontSize: "1.1875rem",
                color: hovered ? note.accentColor : "rgb(232, 238, 248)",
              }}
            >
              {note.title}
            </h3>

            <p className="text-[13.5px] text-slate-400 leading-[1.65] line-clamp-3 flex-grow">
              {note.excerpt}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.18em]">
                {note.file}
              </span>
              <motion.span
                className="inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: note.accentColor }}
                animate={{ x: hovered ? 2 : 0 }}
                transition={{ duration: 0.2 }}
              >
                Read
                <ArrowUpRight className="h-3 w-3" />
              </motion.span>
            </div>
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
    <SectionWrapper
      id="chapter-5"
      windowTitle="NOTES · OBSERVATIONS FROM THE FIELD"
      moduleLabel="NOTES · OBSERVATIONS FROM THE FIELD"
    >
      {/* Decorative chapter numeral */}
      <div aria-hidden="true" className="absolute top-4 right-6 md:right-10 marquee-num select-none">
        05
      </div>

      <div className="relative space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="space-y-4 max-w-3xl"
        >
          <span className="eyebrow">Chapter 05 · Notes from the Field</span>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
            className="display-lg text-slate-50"
          >
            Short dispatches{" "}
            <em className="not-italic text-gradient">from in-between work.</em>
          </motion.h2>

          <p className="lede">
            Between big projects I keep short notes — little system logs on what I'm learning
            about UX, AI, and working with teams. Not polished essays. Honest snapshots of
            how I think.
          </p>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap gap-2"
        >
          {filters.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.2em] transition-all"
              style={{
                background:
                  activeFilter === filter
                    ? "rgba(74, 123, 247, 0.18)"
                    : "rgba(15, 23, 42, 0.5)",
                border:
                  activeFilter === filter
                    ? "1px solid rgba(74, 123, 247, 0.5)"
                    : "1px solid rgba(255,255,255,0.07)",
                color: activeFilter === filter ? "rgb(147, 197, 253)" : "rgb(148, 163, 184)",
                boxShadow: activeFilter === filter ? "0 0 14px rgba(74,123,247,0.18)" : "none",
              }}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>

        <div className="rule-tick" />

        {/* Featured note */}
        {featured && <FeaturedNote note={featured} />}

        {/* Supporting grid */}
        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
            {rest.map((note, i) => (
              <NoteCard key={note.slug} note={note} index={i + 1} />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
