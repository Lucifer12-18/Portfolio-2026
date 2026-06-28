"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectDetails {
  title: string
  file: string
  tags: string[]
  tools: string[]
  problem: string
  approach: string[]
  outcome: string
  imagePath?: string
}

interface ProjectModalProps {
  project: ProjectDetails | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — heavy blur + dark overlay so content behind disappears */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[60]"
            onClick={onClose}
          />

          {/* Modal - scale and fade in */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-4 md:inset-auto md:top-[5vh] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl md:h-[90vh] z-[70] flex flex-col"
          >
            <div className="w-full flex-1 min-h-0 bg-slate-950 rounded-xl border border-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
              {/* Window title bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={onClose}
                      className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 transition-colors flex items-center justify-center group"
                    >
                      <X className="w-2 h-2 text-[#4A0000] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                    case_story_{project.file}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-h-0 p-6 overflow-y-auto bg-slate-950 modal-scroll">
                <div className="w-full h-48 rounded-xl relative overflow-hidden mb-6 border border-white/8">
                  <Image
                    src={project.imagePath || "/images/hirello-mockup.jpg"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-cover"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} className="bg-violet-900/50 text-violet-300 border-0 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-slate-100 mb-6">{project.title}</h2>

                {/* Problem → What was broken or unclear */}
                <div className="mb-6">
                  <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-[#A78BFA] rounded-[1px]" />
                    What was broken or unclear
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{project.problem}</p>
                </div>

                {/* Approach → How I explored, mapped and designed */}
                <div className="mb-6">
                  <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-[#A78BFA] rounded-[1px]" />
                    How I explored, mapped and designed
                  </h3>
                  <ul className="space-y-2">
                    {project.approach.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcome → What changed for users / stakeholders */}
                <div className="mb-6">
                  <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-[#A78BFA] rounded-[1px]" />
                    What changed for users / stakeholders
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{project.outcome}</p>
                </div>

                {/* Tools */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 bg-[#A78BFA] rounded-[1px]" />
                      Tools used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tools.map((tool) => (
                        <Badge key={tool} variant="secondary" className="font-mono text-xs bg-slate-800 text-slate-400">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Hirello-specific CTA to full case study (Level 3) */}
                  {project.file === "hirello_ai.tsx" && (
                    <div className="border border-dashed border-white/10 rounded-lg px-4 py-3 bg-slate-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-[11px] font-mono uppercase tracking-wide text-slate-500">NEXT MODULE</p>
                        <p className="text-sm font-medium text-slate-100">Explore Full Case Study</p>
                        <p className="text-xs text-slate-400">
                          Decisions, flows, tradeoffs, and what shipped.
                        </p>
                      </div>
                      <Link
                        href="/case-stories/hirello-ai/full"
                        className="text-xs font-semibold inline-flex items-center gap-1 rounded-full px-4 py-1.5 border border-white/10 bg-slate-800 text-white hover:bg-white hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F59E0B]"
                      >
                        Open system log →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
