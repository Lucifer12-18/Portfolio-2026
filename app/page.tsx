"use client"

import { useState } from "react"
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

export default function Home() {
  const [bootScreenDismissed, setBootScreenDismissed] = useState(false)

  return (
    <SystemLogProvider>
      <ReadingStoreProvider>
        <ViewModeProvider>
          <OpeningHero onDismiss={() => setBootScreenDismissed(true)} />
          {bootScreenDismissed && (
            <>
              <Navbar />
              <main
                className="mx-auto w-full max-w-[1440px] lg:max-w-[1680px] px-6 lg:px-4
                 lg:grid lg:grid-cols-[220px_minmax(1000px,1fr)_360px] lg:gap-7"
              >
                {/* Left column: sticky ChapterRail */}
                <div className="hidden lg:block">
                  <div className="sticky top-[96px] h-[calc(100vh-96px)] min-h-0 flex items-center justify-center">
                    <div className="w-full max-h-full overflow-y-auto pb-4">
                      <ChapterRail />
                    </div>
                  </div>
                </div>

                {/* Middle column: all chapters stacked, main reading area */}
                <div className="space-y-24 min-w-0 w-full pt-[72px]">
                  <HeroSection />
                  <AboutSection />
                  <CapabilitiesSection />
                  <ProcessSection />
                  <WorkSection />
                  <NotesSection />
                  <ContactSection />
                </div>

                {/* Right column: SystemLogConsole */}
                <div className="hidden lg:block min-w-0">
                  <div className="sticky top-[120px] self-start z-40">
                    <div className="pt-6 flex justify-end">
                      <SystemLogConsole />
                    </div>
                  </div>
                </div>
              </main>
              <Footer />
            </>
          )}
        </ViewModeProvider>
      </ReadingStoreProvider>
    </SystemLogProvider>
  )
}
