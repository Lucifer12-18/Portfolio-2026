import { caseBySlug, DEEP_CASES } from "@/lib/cases"
import { accentHex } from "@/lib/chapter-palette"
import { caseOgCard, OG_SIZE } from "@/lib/og-card"

// The share card for this case study (LinkedIn, Slack, iMessage previews).
const c = caseBySlug("hirello-platform")!

export const alt = `${c.title.replace(" · ", ": ")}, a case study by Vishal Deshmukh`
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return caseOgCard({ ...c, pigment: accentHex(c.pigment), n: DEEP_CASES.indexOf(c) + 1 })
}
