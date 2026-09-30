import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Hirello: Networking Intelligence Case Study",
  description:
    "Designing a CRM for job seekers: contact tiers, guided outreach, and a visual opportunity pipeline that turns ad-hoc networking into a repeatable system.",
}

export default function HirelloNetworkingLayout({ children }: { children: React.ReactNode }) {
  return children
}
