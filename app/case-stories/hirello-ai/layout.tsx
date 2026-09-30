import type { Metadata } from "next"
import type React from "react"
import { ChapterTint } from "@/components/chapter-tint"

// Metadata lives here because page.tsx is a client component.
// Nested segments (full/interview/networking) override with their own layouts.
export const metadata: Metadata = {
  // Nested template: keeps the "· Vishal Deshmukh" suffix on the sub-case pages
  // (a plain-string title here would sever the root template for grandchildren).
  title: {
    default: "Hirello · AI Career OS · Case Snapshot",
    template: "%s · Vishal Deshmukh",
  },
  description:
    "How Vishal Deshmukh designed Hirello's Networking Intelligence system and AI Interview Gym, turning a chaotic job search into a structured, feedback-driven workflow.",
}

// Case stories belong to the Work chapter — they wear its pigment.
export default function HirelloCaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChapterTint index={4} />
      {children}
    </>
  )
}
