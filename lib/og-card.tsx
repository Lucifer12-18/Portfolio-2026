import { ImageResponse } from "next/og"

// ─────────────────────────────────────────────────────────────────────────────
// OG CARD — the share image for a case study or a note (1200×630, rendered by
// next/og at build time). Same language as the site: charcoal, bone type, one
// pigment. Each route's opengraph-image.tsx calls this, so a link pasted into
// LinkedIn, Slack or iMessage previews as that page, not the home card.
// ─────────────────────────────────────────────────────────────────────────────

export const OG_SIZE = { width: 1200, height: 630 }

const BONE = "#f2f1ec"
const BONE_3 = "#8f8e88"
const INK = "#0f0f0e"
const SPECTRUM = "linear-gradient(90deg, #f2a65a, #e67e62, #e07a9e, #a890e8, #7a9cf2, #6ec4aa, #ecd6aa)"

export function ogCard({
  kicker,
  title,
  accent,
  line,
  footer,
  pigment,
}: {
  kicker: string
  title: string
  accent: string
  line: string
  footer: string
  pigment: string
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          backgroundImage: `radial-gradient(circle at 88% 12%, ${pigment}55 0%, transparent 42%)`,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10, fontSize: 24, fontWeight: 600, letterSpacing: 1 }}>
            <span style={{ color: BONE }}>VISHAL</span>
            <span style={{ color: pigment }}>DESHMUKH</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: BONE_3, fontSize: 22, fontFamily: "monospace" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: pigment }} />
            {kicker}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: BONE, fontSize: 92, fontWeight: 500, letterSpacing: -4, lineHeight: 1 }}>{title}</div>
          <div style={{ color: pigment, fontSize: accent.length > 30 ? 52 : 64, fontWeight: 500, letterSpacing: -2.5, lineHeight: 1.08, marginTop: 10, maxWidth: 1000 }}>{accent}</div>
          <div style={{ color: BONE_3, fontSize: 30, lineHeight: 1.35, marginTop: 28, maxWidth: 940 }}>{line}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ width: "100%", height: 2, background: SPECTRUM }} />
          <div style={{ display: "flex", justifyContent: "space-between", color: BONE_3, fontSize: 22, fontFamily: "monospace" }}>
            <span>{footer}</span>
            <span>vishal-deshmukh.vercel.app</span>
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  )
}

/** The share card for one deep case study, by slug and reading order. */
export function caseOgCard(c: {
  title: string
  hook: string
  role: string
  timeline: string
  pigment: string
  n: number
}) {
  const [name, subtitle] = c.title.split(" · ")
  return ogCard({
    kicker: `Case study ${String(c.n).padStart(2, "0")}`,
    title: name,
    accent: subtitle ?? "",
    line: c.hook,
    footer: `${c.role.split(" · ")[0]} · ${c.timeline}`,
    pigment: c.pigment,
  })
}
