import { ImageResponse } from "next/og"

// Share card (OpenGraph/Twitter) — rendered at build/request time by next/og,
// so no binary asset lives in the repo. Ink on charcoal, like the site.
export const alt = "Vishal Deshmukh, Product Designer, Design Systems · Pixelogic OS"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f0f0e",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Top — wordmark + current role */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10, fontSize: 26, fontWeight: 600, letterSpacing: 1 }}>
            <span style={{ color: "#f2f1ec" }}>PIXELOGIC</span>
            <span style={{ color: "#8f8e88" }}>OS</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#8f8e88", fontSize: 22, fontFamily: "monospace" }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#f0a647" }} />
            Now · Design Systems at TasteMakers
          </div>
        </div>

        {/* Center — name, two-tone */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#f2f1ec", fontSize: 104, fontWeight: 500, letterSpacing: -5, lineHeight: 1 }}>
            Vishal Deshmukh
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", color: "#8f8e88", fontSize: 50, fontWeight: 500, letterSpacing: -2, marginTop: 18 }}>
            Designing <span style={{ color: "#f2a65a", marginLeft: 14, marginRight: 14 }}>clarity</span> inside complex systems.
          </div>
        </div>

        {/* Bottom — hairline + focus */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ width: "100%", height: 2, background: "linear-gradient(90deg, #f2a65a, #e67e62, #e07a9e, #a890e8, #7a9cf2, #6ec4aa, #ecd6aa)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", color: "#8f8e88", fontSize: 22, fontFamily: "monospace" }}>
            <span>Product Designer · AI products · design systems · research</span>
            <span>Baltimore, MD</span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
