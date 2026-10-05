import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Azeret_Mono, Fraunces, Inter, Figtree } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SoundLayer } from "@/components/sound"
import { ClarityGame } from "@/components/interlude/clarity-game"
import { StatsBeacon } from "@/components/stats"

// Geist — one variable family for display AND text. Medium weights + tight
// tracking carry the editorial voice; no second display face needed.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

// Azeret Mono — the system voice: labels, buttons, telemetry. Sentence case.
const azeret = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

// Product faces for the case-study mockups — Hirello's own Fraunces + Inter,
// and Figtree standing in for 1SE's geometric sans. preload:false keeps them
// off every page's critical path; the browser fetches a file only when a
// mockup actually renders text in it.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", preload: false })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: false })
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap", preload: false })

// Share cards always resolve against the public domain. Every Vercel build
// (previews included) pins it: per-deployment URLs sit behind Vercel's login,
// so LinkedIn and Slack can't fetch an og:image from them.
const PRODUCTION_URL = "https://vishal-deshmukh.vercel.app"
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL ? PRODUCTION_URL : "http://localhost:3001")

const siteTitle = "Vishal Deshmukh · Product Designer · Pixelogic OS"
const siteDescription =
  "Vishal Deshmukh designs customer-facing AI products end-to-end: interaction design, design systems, and research. Product Designer, Design Systems at TasteMakers (Taste Labs); previously Founding Product Designer at Hirello.ai."

export const viewport: Viewport = {
  themeColor: "#0f0f0e",
  width: "device-width",
  initialScale: 1,
  // no maximum-scale / user-scalable restrictions — pinch zoom stays available
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s · Vishal Deshmukh",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "Pixelogic OS",
    title: siteTitle,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${azeret.variable} ${fraunces.variable} ${inter.variable} ${figtree.variable} font-sans antialiased`}
      >
        {children}
        <SoundLayer />
        <ClarityGame />
        <StatsBeacon />
        <Analytics />
      </body>
    </html>
  )
}
