"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModuleBadge } from "@/components/module-badge"
import { SectionWrapper } from "@/components/section-wrapper"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const filters = ["All", "UX", "AI", "Systems", "Career"]

const notes = [
  {
    tag: "AI & Design",
    category: "AI",
    file: "ai_ux_balance.md",
    title: "Designing with AI without overwhelming users",
    excerpt:
      "How to introduce AI features that augment rather than complicate the user experience. Lessons from recent projects on progressive disclosure and trust-building.",
    date: "Nov 2024",
    link: "#",
    height: "tall",
    imagePath: "/images/ai-article.jpg",
  },
  {
    tag: "Career",
    category: "Career",
    file: "is_to_ux.md",
    title: "From engineering to UX: thinking in systems",
    excerpt:
      "My transition from Information Systems to Product Design, and why a technical background shapes how I approach design problems.",
    date: "Oct 2024",
    link: "#",
    height: "short",
    imagePath: "/images/systems-article.jpg",
  },
  {
    tag: "Process",
    category: "UX",
    file: "storytelling.md",
    title: "Why complex tools need simple stories",
    excerpt:
      "On the importance of narrative in enterprise design—helping users understand not just what to do, but why it matters.",
    date: "Sep 2024",
    link: "#",
    height: "medium",
    imagePath: "/images/storytelling-article.jpg",
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
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

      <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
        Between big projects, I keep short notes—little system logs on what I'm learning about UX, AI, and working with
        teams. They're not polished essays, just snapshots of my thinking.
      </p>

      {/* Filter pills - unchanged */}
      <div className="flex flex-wrap gap-2 mb-10">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === filter
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Desktop masonry layout with paper background */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {filteredNotes
            .filter((_, i) => i % 2 === 0)
            .map((note, i) => (
              <motion.div
                key={note.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`border-border shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden ${
                    note.height === "tall" ? "min-h-[320px]" : note.height === "medium" ? "min-h-[260px]" : ""
                  }`}
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px),
                      repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(0,0,0,0.02) 24px, rgba(0,0,0,0.02) 25px)
                    `,
                    backgroundColor: "#fefefe",
                  }}
                >
                  {/* Filename label */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-mono text-muted-foreground border border-border/50">
                    {note.file}
                  </div>

                  <CardContent className="p-6 h-full flex flex-col relative z-10">
                    <div className="w-full h-24 rounded-lg relative overflow-hidden flex-shrink-0 mb-4 border border-border/50">
                      <Image
                        src={note.imagePath || "/placeholder.svg"}
                        alt={note.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-accent/10 text-accent border-0 text-xs">{note.tag}</Badge>
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                      {note.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">{note.excerpt}</p>

                    <div className="flex items-center justify-end mt-auto">
                      <a
                        href={note.link}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Read note
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* Right column - offset for masonry effect */}
        <div className="space-y-6 pt-12">
          {filteredNotes
            .filter((_, i) => i % 2 === 1)
            .map((note, i) => (
              <motion.div
                key={note.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`border-border shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden ${
                    note.height === "tall" ? "min-h-[320px]" : note.height === "medium" ? "min-h-[260px]" : ""
                  }`}
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px),
                      repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(0,0,0,0.02) 24px, rgba(0,0,0,0.02) 25px)
                    `,
                    backgroundColor: "#fefefe",
                  }}
                >
                  {/* Filename label */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-mono text-muted-foreground border border-border/50">
                    {note.file}
                  </div>

                  <CardContent className="p-6 h-full flex flex-col relative z-10">
                    <div className="w-full h-24 rounded-lg relative overflow-hidden flex-shrink-0 mb-4 border border-border/50">
                      <Image
                        src={note.imagePath || "/placeholder.svg"}
                        alt={note.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-accent/10 text-accent border-0 text-xs">{note.tag}</Badge>
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                      {note.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">{note.excerpt}</p>

                    <div className="flex items-center justify-end mt-auto">
                      <a
                        href={note.link}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Read note
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Mobile layout - unchanged */}
      <div className="md:hidden space-y-4">
        {filteredNotes.map((note, i) => (
          <motion.div
            key={note.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-5">
                <div className="w-full h-20 rounded-lg relative overflow-hidden flex-shrink-0 mb-4">
                  <Image src={note.imagePath || "/placeholder.svg"} alt={note.title} fill className="object-cover" />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-accent/10 text-accent border-0 text-xs">{note.tag}</Badge>
                  <span className="text-xs font-mono text-muted-foreground">{note.file}</span>
                </div>

                <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {note.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{note.excerpt}</p>

                <div className="flex items-center justify-between">
                  <a
                    href={note.link}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Read note
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                  <span className="text-xs text-muted-foreground">{note.date}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
