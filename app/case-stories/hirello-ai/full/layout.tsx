import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Hirello: Full Case Study",
  description:
    "The full Hirello case study: problem, design principles, the Networking Intelligence and AI Interview Gym modules, impact, and lessons. By Vishal Deshmukh, Founding Product Designer.",
}

export default function HirelloFullLayout({ children }: { children: React.ReactNode }) {
  return children
}
