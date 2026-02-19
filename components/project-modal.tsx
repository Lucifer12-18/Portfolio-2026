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
          {/* Backdrop - tinted background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-primary/10 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Modal - scale and fade in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-[70] flex items-center justify-center"
          >
            <div className="w-full max-h-[90vh] bg-white rounded-xl border border-[#E8E4DE] shadow-2xl overflow-hidden flex flex-col">
              {/* Window title bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#F7F6F3] border-b border-[#E8E4DE] flex-shrink-0">
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
                  <span className="text-xs font-mono text-[#6B6B7B] uppercase tracking-wide">
                    case_story_{project.file}
                  </span>
                </div>
              </div>

              <div className="p-6 overflow-y-auto bg-gradient-to-br from-[#F8F7FF] via-white to-[#F0F7FF]">
                <div className="w-full h-48 rounded-xl relative overflow-hidden mb-6 border border-slate-200">
                  <Image
                    src={project.imagePath || "/images/hirello-mockup.jpg"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} className="bg-[#EDE9FE] text-[#7C3AED] border-0 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-6">{project.title}</h2>

                {/* Problem → What was broken or unclear */}
                <div className="mb-6">
                  <h3 className="text-sm font-mono text-[#6B6B7B] uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-[#A78BFA] rounded-[1px]" />
                    What was broken or unclear
                  </h3>
                  <p className="text-[#4a4a5a] leading-relaxed">{project.problem}</p>
                </div>

                {/* Approach → How I explored, mapped and designed */}
                <div className="mb-6">
                  <h3 className="text-sm font-mono text-[#6B6B7B] uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-[#A78BFA] rounded-[1px]" />
                    How I explored, mapped and designed
                  </h3>
                  <ul className="space-y-2">
                    {project.approach.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#4a4a5a]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4A7BF7] mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcome → What changed for users / stakeholders */}
                <div className="mb-6">
                  <h3 className="text-sm font-mono text-[#6B6B7B] uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-[#A78BFA] rounded-[1px]" />
                    What changed for users / stakeholders
                  </h3>
                  <p className="text-[#4a4a5a] leading-relaxed">{project.outcome}</p>
                </div>

                {/* Tools */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-mono text-[#6B6B7B] uppercase tracking-wide mb-2 flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 bg-[#A78BFA] rounded-[1px]" />
                      Tools used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tools.map((tool) => (
                        <Badge key={tool} variant="secondary" className="font-mono text-xs bg-[#F0EDE8] text-[#6B6B7B]">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Hirello-specific CTA to full case study (Level 3) */}
                  {project.file === "hirello_ai.tsx" && (
                    <div className="border border-dashed border-[#D4D4DD] rounded-lg px-4 py-3 bg-white/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-[11px] font-mono uppercase tracking-wide text-[#6B6B7B]">NEXT MODULE</p>
                        <p className="text-sm font-medium text-[#1a1a2e]">Explore Full Case Study</p>
                        <p className="text-xs text-[#6B6B7B]">
                          Decisions, flows, tradeoffs, and what shipped.
                        </p>
                      </div>
                      <Link
                        href="/case-stories/hirello-ai/full"
                        className="text-xs font-semibold inline-flex items-center gap-1 rounded-full px-4 py-1.5 border border-transparent bg-[#1f2937] text-white hover:bg-white hover:text-[#1f2937] hover:border-[#1f2937]/60 transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4A7BF7]"
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
