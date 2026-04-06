"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ModuleBadge } from "@/components/module-badge"
import { SectionWrapper } from "@/components/section-wrapper"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { NOTES, type NoteMetadata } from "@/lib/notes-data"

const filters = ["All", "UX", "AI", "Systems", "Career"]

const notes = NOTES

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
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
      transition={{ duration: 0.2 }}
    >
      <div
        className="relative rounded-xl overflow-hidden group"
        style={{
          background: "rgba(8, 15, 40, 0.65)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: hovered
            ? `1px solid ${note.accentColor}`
            : "1px solid rgba(255, 255, 255, 0.07)",
          boxShadow: hovered
            ? `0 0 0 1px ${note.accentColor}22, 0 8px 32px rgba(0,0,0,0.4)`
            : "0 2px 8px rgba(0,0,0,0.2)",
          transition: "box-shadow 0.35s ease, border-color 0.35s ease",
        }}
      >
        {/* Shimmer top accent on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] z-10"
          style={{
            background: `linear-gradient(90deg, transparent, ${note.accentColor}, transparent)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Filename badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded text-[10px] font-mono text-slate-400 border border-white/8 z-20">
          {note.file}
        </div>

        <div className="p-5 flex flex-col h-full">
          {/* Image */}
          <div className="w-full h-28 rounded-lg relative overflow-hidden flex-shrink-0 mb-4 border border-white/8">
            <Image
              src={note.imagePath || "/placeholder.svg"}
              alt={note.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background: `linear-gradient(to bottom, transparent 50%, rgba(8,15,40,0.4))`,
              }}
            />
          </div>

          <div className="flex items-center justify-between mb-3">
            <Badge
              className="border-0 text-xs px-2 py-0.5"
              style={{
                background: `${note.accentColor}18`,
                color: note.accentColor,
              }}
            >
              {note.tag}
            </Badge>
            <span className="text-xs text-slate-500 font-mono">{note.date}</span>
          </div>

          <h3
            className="text-base font-semibold mb-2 leading-snug transition-colors duration-200"
            style={{ color: hovered ? note.accentColor : "rgb(226, 232, 240)" }}
          >
            {note.title}
          </h3>

          <p className="text-sm text-slate-400 leading-relaxed flex-grow mb-4">{note.excerpt}</p>

          <div className="flex items-center justify-end mt-auto">
            <Link href={`/notes/${note.slug}`}>
              <motion.span
                className="inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: note.accentColor }}
                animate={{ x: hovered ? 2 : 0 }}
                transition={{ duration: 0.2 }}
              >
                Read note
                <ArrowUpRight className="h-3 w-3" />
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function NotesSection() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredNotes =
    activeFilter === "All"
      ? notes
      : notes.filter((note) => note.category === activeFilter || note.tag.includes(activeFilter))

  return (
    <SectionWrapper
      id="chapter-5"
      windowTitle="NOTES · OBSERVATIONS FROM THE FIELD"
      moduleLabel="NOTES · OBSERVATIONS FROM THE FIELD"
    >
      <ModuleBadge module="05" label="NOTES" />

      <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Observations from the Field</h2>

      <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
        Between big projects, I keep short notes—little system logs on what I'm learning about UX, AI, and working with
        teams. Not polished essays, just honest snapshots of how I think.
      </p>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((filter) => (
          <motion.button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background:
                activeFilter === filter
                  ? "rgba(74, 123, 247, 0.2)"
                  : "rgba(15, 23, 42, 0.6)",
              border:
                activeFilter === filter
                  ? "1px solid rgba(74, 123, 247, 0.5)"
                  : "1px solid rgba(255,255,255,0.07)",
              color: activeFilter === filter ? "rgb(74, 123, 247)" : "rgb(148, 163, 184)",
              boxShadow: activeFilter === filter ? "0 0 10px rgba(74,123,247,0.15)" : "none",
            }}
          >
            {filter}
          </motion.button>
        ))}
      </div>

      {/* Desktop masonry layout */}
      <div className="hidden md:grid grid-cols-2 gap-5">
        {/* Left column */}
        <div className="space-y-5">
          {filteredNotes
            .filter((_, i) => i % 2 === 0)
            .map((note, i) => (
              <NoteCard key={note.title} note={note} index={i} />
            ))}
        </div>

        {/* Right column — offset for masonry effect */}
        <div className="space-y-5 pt-10">
          {filteredNotes
            .filter((_, i) => i % 2 === 1)
            .map((note, i) => (
              <NoteCard key={note.title} note={note} index={i + 1} />
            ))}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden space-y-4">
        {filteredNotes.map((note, i) => (
          <NoteCard key={note.title} note={note} index={i} />
        ))}
      </div>
    </SectionWrapper>
  )
}
