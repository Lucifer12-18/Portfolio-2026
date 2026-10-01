"use client"

import { useEffect, useRef, useState } from "react"
import { SectionWrapper } from "@/components/section-wrapper"
import { DecodeText } from "@/components/decode-text"
import { ActionLink } from "@/components/primitives"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { childRise, childRiseHeavy, childSlide, EASE_SETTLE } from "@/lib/motion"
import { CURRENT_ROLE, PROFILE } from "@/lib/profile"
import { useReadingStore } from "@/contexts/reading-store-context"
import { FormationGlyph } from "@/components/storyboard"
import { CHAPTERS } from "@/lib/chapters-config"
import { accentHex } from "@/lib/chapter-palette"
import { railHover } from "@/lib/pointer-state"
import Image from "next/image"
import { sfx } from "@/lib/sound"
import { PlayButton } from "@/components/interlude/play-button"

/** Roll credits — the whole storyboard in one strip, each frame a way back. */
function Credits() {
  const { setActiveChapterIndex } = useReadingStore()
  return (
    <motion.nav
      aria-label="Replay a scene"
      variants={childRise}
      initial="hidden"
      animate="show"
      custom={5}
      className="border-t border-hair pt-5"
    >
      <p className="label-mono mb-3">Replay any scene</p>
      <ol className="grid grid-cols-7 gap-1.5 max-w-xl">
        {CHAPTERS.map((c) => {
          const i = c.chapterNumber
          const last = i === CHAPTERS.length - 1
          return (
            <li key={c.id}>
              <button
                type="button"
                disabled={last}
                onClick={() => setActiveChapterIndex(i)}
                onMouseEnter={() => (railHover.chapter = i)}
                onMouseLeave={() => {
                  if (railHover.chapter === i) railHover.chapter = -1
                }}
                aria-label={`Replay scene ${i}: ${c.label}`}
                className="group block w-full"
              >
                <span
                  className={`relative block aspect-[4/3] overflow-hidden rounded-[7px] border bg-[#131312] transition-colors ${
                    last ? "border-chapter" : "border-hair group-hover:border-hair-3"
                  }`}
                  style={{ color: accentHex(i) }}
                >
                  <span className="absolute inset-[16%] transition-transform duration-500 group-hover:scale-110">
                    <FormationGlyph index={i} dot={3.2} gap={6.4} />
                  </span>
                </span>
                <span className={`mt-1.5 block truncate font-mono text-[9px] ${last ? "text-bone" : "text-bone-3"}`}>
                  {String(i).padStart(2, "0")}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </motion.nav>
  )
}

/** The email "field" — reads like an input, acts like a copy button + CTA. */
function EmailBar() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      sfx.chime(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${PROFILE.email}`
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 rounded-[12px] border border-hair-2 bg-[rgb(22_22_21/0.6)] p-1.5">
      <button
        type="button"
        onClick={copy}
        data-sfx-skip
        className="group flex flex-1 items-center justify-between gap-3 rounded-[8px] px-3.5 h-11 text-left transition-colors hover:bg-white/[0.03]"
        aria-label={`Copy email address ${PROFILE.email}`}
      >
        <span className="font-mono text-[12.5px] text-bone-2 truncate">{PROFILE.email}</span>
        <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-bone-3 group-hover:text-bone transition-colors">
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span key="ok" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2, ease: EASE_SETTLE }} className="flex items-center gap-1.5 text-bone">
                <Check className="h-3 w-3" aria-hidden /> Copied
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2, ease: EASE_SETTLE }} className="flex items-center gap-1.5">
                <Copy className="h-3 w-3" aria-hidden /> Copy
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>
      <span role="status" className="sr-only">{copied ? "Email address copied" : ""}</span>
      <a href={`mailto:${PROFILE.email}`} className="btn-solid h-11 px-5">
        Send a note
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
      </a>
    </div>
  )
}

export function ContactSection() {
  return (
    <SectionWrapper id="epilogue" windowTitle="EPILOGUE · OPEN CHANNEL" moduleLabel="EPILOGUE · OPEN CHANNEL">
      <div className="grid @3xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-10 @3xl:gap-14 h-full">
        {/* ── Left — the ask ─────────────────────────────────────────── */}
        <div className="flex flex-col justify-center space-y-7">
          <motion.div variants={childRise} initial="hidden" animate="show" custom={0}>
            <span className="eyebrow">Scene 06 · Epilogue</span>
          </motion.div>

          <motion.h2 variants={childRiseHeavy} initial="hidden" animate="show" custom={1} className="display-lg text-bone">
            <span className="ink-dim">What I&apos;m looking</span>
            <br />
            <DecodeText text="for next." delay={300} className="ink-accent" />
          </motion.h2>

          <motion.p variants={childRise} initial="hidden" animate="show" custom={2} className="lede">
            Teams with complexity under the hood, and a need for calm on the surface.
          </motion.p>

          <motion.div variants={childRise} initial="hidden" animate="show" custom={3} className="max-w-xl">
            <EmailBar />
          </motion.div>

          <motion.div variants={childRise} initial="hidden" animate="show" custom={4} className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <ActionLink href={PROFILE.linkedin} external>
              Connect on LinkedIn
            </ActionLink>
            <ActionLink href={PROFILE.resume} external>
              Read the résumé
            </ActionLink>
          </motion.div>

          <Credits />

          <motion.div
            variants={childRise}
            initial="hidden"
            animate="show"
            custom={6}
            className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-hair-2 bg-[rgb(22_22_21/0.5)] px-4 py-3.5"
          >
            <span className="min-w-0">
              <span className="label-mono block">Before you go</span>
              <span className="mt-1 block text-[14px] text-bone-2">
                <span className="text-bone">Clarity.</span> A small game about turning noise into order.
              </span>
            </span>
            <PlayButton labelClassName="inline" />
          </motion.div>
        </div>

        {/* ── Right — profile card ─────────────────────────────────────── */}
        <motion.div variants={childSlide} initial="hidden" animate="show" custom={2} className="flex flex-col justify-center">
          <div className="group surface overflow-hidden">
            <div className="flex items-center justify-between px-5 h-10 border-b border-hair font-mono text-[10.5px] text-bone-3">
              <span>contact.json</span>
              <span className="text-bone-4">v2</span>
            </div>

            <div className="p-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-hair-2">
                  <Image
                    src="/images/vishal-portrait.jpg"
                    alt={PROFILE.name}
                    width={64}
                    height={64}
                    sizes="64px"
                    className="h-full w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[17px] tracking-[-0.02em] text-bone">{PROFILE.name}</p>
                  <p className="mt-0.5 text-[13px] text-bone-3">{CURRENT_ROLE.role}</p>
                  <p className="text-[13px] text-bone-3">
                    {CURRENT_ROLE.org} · {CURRENT_ROLE.orgNote}
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-2 border-y border-hair">
                <div className="py-3.5 pr-3">
                  <dt className="label-mono">Status</dt>
                  <dd className="mt-1.5 flex items-center gap-2 text-[13.5px] text-bone">
                    <span className="live-dot" aria-hidden />
                    Open to roles
                  </dd>
                </div>
                <div className="py-3.5 pl-3.5 border-l border-hair">
                  <dt className="label-mono">Location</dt>
                  <dd className="mt-1.5 text-[13.5px] text-bone">{PROFILE.location}</dd>
                </div>
              </dl>

              <div>
                <p className="label-mono mb-2">Work preference</p>
                <ul className="flex gap-1.5">
                  {["Remote", "Hybrid", "On-site"].map((mode, i) => (
                    <li
                      key={mode}
                      className={`rounded-md px-2.5 py-1 font-mono text-[10.5px] border ${
                        i === 0 ? "border-chapter bg-chapter text-[#111110]" : "border-hair-2 text-bone-3"
                      }`}
                    >
                      {mode}
                    </li>
                  ))}
                </ul>
              </div>

              <div aria-hidden className="flex items-center gap-3 pt-1">
                <span className="h-px flex-1 bg-hair" />
                <span className="font-mono text-[10px] text-bone-4">EOF</span>
                <span className="h-px flex-1 bg-hair" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
