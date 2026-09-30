import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Hirello: AI Interview Gym Case Study",
  description:
    "Designing structured AI interview feedback: diagnostic scoring, STAR compliance, and learning loops that tell candidates what went wrong and how to fix it.",
}

export default function HirelloInterviewLayout({ children }: { children: React.ReactNode }) {
  return children
}
