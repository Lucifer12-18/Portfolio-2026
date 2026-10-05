"use client"

import { useEffect, useRef } from "react"
import { sfx } from "@/lib/sound"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowChip } from "@/components/primitives"
import { X } from "lucide-react"
import { CaseCover } from "@/components/covers"
import Link from "next/link"

interface ProjectDetails {
  title: string
  file: string
  tags: string[]
  tools: string[]
  problem: string
  approach: string[]
  outcome: string
  href?: string
}

interface ProjectModalProps {
  project: ProjectDetails | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const wasOpen = useRef(false)

  // Open/close cue — only on real transitions, never on first mount
  useEffect(() => {
    if (isOpen !== wasOpen.current) sfx.sheet(isOpen)
    wasOpen.current = isOpen
  }, [isOpen])
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
      // Focus management: remember the opener (the project card), move focus
      // into the dialog, and restore it on close — the card keeps its place
      // in the tab order for keyboard users.
      openerRef.current = document.activeElement as HTMLElement | null
      // setTimeout (not rAF): rAF doesn't fire in hidden/background documents.
      setTimeout(() => dialogRef.current?.focus({ preventScroll: true }), 0)
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
      if (isOpen) openerRef.current?.focus?.({ preventScroll: true })
    }
  }, [isOpen, onClose])

  // Minimal focus trap — Tab cycles within the dialog while it's open.
  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement
    if (e.shiftKey && (active === first || active === dialogRef.current)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

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
            className="fixed inset-0 bg-[rgb(10_10_9/0.72)] backdrop-blur-xl z-[60]"
            onClick={onClose}
          />

          {/* Modal - scale and fade in */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            onKeyDown={trapTab}
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-4 md:inset-auto md:top-[5vh] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl md:h-[90vh] z-[70] flex flex-col focus:outline-none"
          >
            <div className="w-full flex-1 min-h-0 rounded-[18px] border border-hair-2 bg-ink-1 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center justify-between gap-4 px-5 h-12 border-b border-hair flex-shrink-0">
                <span className="font-mono text-[11px] text-bone-3 truncate">case_story / {project.file}</span>
                <button
                  onClick={onClose}
                  aria-label="Close case study"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-hair-2 text-bone-2 transition-colors hover:border-bone hover:bg-bone hover:text-[#111110]"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.6} />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto modal-scroll">
                {/* Same cover the card showed — the modal opens INTO the picture */}
                <div className="group relative w-full aspect-[16/9] overflow-hidden border-b border-hair">
                  <CaseCover file={project.file} featured />
                </div>

                <div className="p-6 md:p-8">
                  <ul className="flex flex-wrap gap-1.5 mb-4" aria-label="Tags">
                    {project.tags.map((tag) => (
                      <li key={tag} className="rounded-full border border-hair-2 px-2.5 py-0.5 font-mono text-[10.5px] text-bone-2">
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <h2 id="project-modal-title" className="text-[clamp(1.5rem,3vw,2rem)] leading-[1.08] tracking-[-0.04em] text-bone">
                    {project.title.split(" · ")[0]}
                    {project.title.includes(" · ") && (
                      <span className="block text-bone-3">{project.title.split(" · ")[1]}</span>
                    )}
                  </h2>

                  <div className="mt-8 divide-y divide-hair border-y border-hair">
                    <section className="grid md:grid-cols-[150px_1fr] gap-2 md:gap-6 py-5">
                      <h3 className="label-mono pt-0.5">The problem</h3>
                      <p className="text-[15px] leading-[1.65] text-bone-2">{project.problem}</p>
                    </section>

                    <section className="grid md:grid-cols-[150px_1fr] gap-2 md:gap-6 py-5">
                      <h3 className="label-mono pt-0.5">What I did</h3>
                      <ul className="space-y-2">
                        {project.approach.map((item, i) => (
                          <li key={i} className="flex gap-2.5 text-[15px] leading-[1.6] text-bone-2">
                            <span aria-hidden className="mt-[0.62em] h-[4px] w-[4px] flex-shrink-0 rounded-[1px] bg-bone-4" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="grid md:grid-cols-[150px_1fr] gap-2 md:gap-6 py-5">
                      <h3 className="label-mono pt-0.5">What changed</h3>
                      <p className="text-[16px] leading-[1.55] tracking-[-0.01em] text-bone">{project.outcome}</p>
                    </section>

                    <section className="grid md:grid-cols-[150px_1fr] gap-2 md:gap-6 py-5">
                      <h3 className="label-mono pt-0.5">Tools &amp; methods</h3>
                      <p className="font-mono text-[12px] leading-[1.7] text-bone-2">{project.tools.join("  ·  ")}</p>
                    </section>
                  </div>

                  {/* The trailer's payoff — the deep page, when the case has one */}
                  {project.href && (
                    <Link
                      href={project.href}
                      data-track={`case_full:${project.file}`}
                      className="group mt-6 flex items-center justify-between gap-4 rounded-[14px] border border-hair-2 px-5 py-4 transition-colors hover:border-bone/50"
                    >
                      <span>
                        <span className="label-mono block">Full case study</span>
                        <span className="mt-1 block text-[16px] tracking-[-0.02em] text-bone">Read the full case study</span>
                        <span className="block text-[13px] text-bone-3">Screens, decisions, the design system, and what shipped.</span>
                      </span>
                      <ArrowChip large />
                    </Link>
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
