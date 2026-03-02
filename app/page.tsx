"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { OpeningHero } from "@/components/opening-hero"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { CapabilitiesSection } from "@/components/capabilities-section"
import { WorkSection } from "@/components/work-section"
import { ProcessSection } from "@/components/process-section"
import { NotesSection } from "@/components/notes-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { SystemLogConsole } from "@/components/system-log-console"
import { ChapterRail } from "@/components/chapter-rail"
import { ViewModeProvider } from "@/contexts/view-mode-context"
import { SystemLogProvider } from "@/contexts/system-log-context"
import { ReadingStoreProvider } from "@/contexts/reading-store-context"

const PersistentScene = dynamic(() => import("@/components/persistent-scene"), { ssr: false })

const ACCENT_STOPS = [
  { scroll: 0.00, r: 34, g: 211, b: 238 },
  { scroll: 0.17, r:  6, g: 182, b: 212 },
  { scroll: 0.36, r: 124, g: 58, b: 237 },
  { scroll: 0.53, r: 167, g: 139, b: 250 },
  { scroll: 0.70, r: 56, g: 189, b: 248 },
  { scroll: 0.86, r: 147, g: 197, b: 253 },
  { scroll: 1.00, r: 224, g: 249, b: 255 },
]

function lerpAccent(s: number) {
  s = Math.max(0, Math.min(1, s))
  for (let i = 0; i < ACCENT_STOPS.length - 1; i++) {
    const a = ACCENT_STOPS[i], b = ACCENT_STOPS[i + 1]
    if (s >= a.scroll && s <= b.scroll) {
      const t = (s - a.scroll) / (b.scroll - a.scroll)
      return {
        r: Math.round(a.r + (b.r - a.r) * t),
        g: Math.round(a.g + (b.g - a.g) * t),
        b: Math.round(a.b + (b.b - a.b) * t),
      }
    }
  }
  const last = ACCENT_STOPS[ACCENT_STOPS.length - 1]
  return { r: last.r, g: last.g, b: last.b }
}

function ScrollGradientOverlay() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const s = max > 0 ? window.scrollY / max : 0
      const c = lerpAccent(s)
      if (ref.current) {
        ref.current.style.background =
          `radial-gradient(ellipse at 50% 30%, rgba(${c.r},${c.g},${c.b},0.06) 0%, transparent 65%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}

export default function Home() {
  const [bootScreenDismissed, setBootScreenDismissed] = useState(false)

  return (
    <SystemLogProvider>
      <ReadingStoreProvider>
        <ViewModeProvider>
          <OpeningHero onDismiss={() => setBootScreenDismissed(true)} />

          {bootScreenDismissed && (
            <>
              {/* Persistent 3D scene — fixed behind all content */}
              <div
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 1 }}
              >
                <PersistentScene />
              </div>

              {/* Scroll-reactive gradient overlay — adds colored tint that shifts with scroll */}
              <ScrollGradientOverlay />

              {/* All content above the 3D background */}
              <div className="relative bg-transparent" style={{ zIndex: 2 }}>
                <Navbar />
                <main
                  className="mx-auto w-full max-w-[1440px] lg:max-w-[1680px] px-6 lg:px-4
                   lg:grid lg:grid-cols-[220px_1fr_360px] lg:gap-7"
                >
                  {/* Left column: sticky ChapterRail — transparent, 3D shows through */}
                  <div className="hidden lg:block">
                    <div className="sticky top-[96px] h-[calc(100vh-96px)] min-h-0 flex items-center justify-center">
                      <div className="w-full max-h-full overflow-y-auto pb-4">
                        <ChapterRail />
                      </div>
                    </div>
                  </div>

                  {/* Middle column: glass chapter cards floating over the 3D world */}
                  <div className="space-y-24 min-w-0 w-full pt-[72px]">
                    <HeroSection />
                    <AboutSection />
                    <CapabilitiesSection />
                    <ProcessSection />
                    <WorkSection />
                    <NotesSection />
                    <ContactSection />
                  </div>

                  {/* Right column: SystemLogConsole — already dark, blends with 3D world */}
                  <div className="hidden lg:block min-w-0">
                    <div className="sticky top-[120px] self-start z-40">
                      <div className="pt-6 flex justify-end">
                        <SystemLogConsole />
                      </div>
                    </div>
                  </div>
                </main>
                <Footer />
              </div>
            </>
          )}
        </ViewModeProvider>
      </ReadingStoreProvider>
    </SystemLogProvider>
  )
}
