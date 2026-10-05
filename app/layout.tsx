import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Azeret_Mono, Fraunces, Inter, Figtree } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SoundLayer } from "@/components/sound"
import { ClarityGame } from "@/components/interlude/clarity-game"
import { StatsBeacon } from "@/components/stats"
import { METADATA_BASE, SITE_NAME, SITE_URL, siteGraph } from "@/lib/seo"
import { PROFILE } from "@/lib/profile"

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

const siteTitle = "Vishal Deshmukh · Product Designer · Design Systems & AI"
// ~155 characters: the length Google shows before truncating.
const siteDescription =
  "Vishal Deshmukh, product designer for AI products and design systems. Case studies from Hirello and 1 Second Everyday: research, interaction design, and build."

export const viewport: Viewport = {
  themeColor: "#0f0f0e",
  width: "device-width",
  initialScale: 1,
  // no maximum-scale / user-scalable restrictions — pinch zoom stays available
}

export const metadata: Metadata = {
  // Share cards and canonicals resolve against the public domain (lib/seo).
  metadataBase: new URL(METADATA_BASE),
  applicationName: SITE_NAME,
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  keywords: [
    "Vishal Deshmukh",
    "product designer",
    "design systems",
    "AI product design",
    "UX designer portfolio",
    "interaction design",
    "Baltimore",
  ],
  // Every route overrides this with its own canonical.
  alternates: { canonical: "/" },
  title: {
    default: siteTitle,
    template: "%s · Vishal Deshmukh",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
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
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geist.variable} ${azeret.variable} ${fraunces.variable} ${inter.variable} ${figtree.variable} font-sans antialiased`}
      >
        {/* Who this site is about, for search engines (WebSite + Person). */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph) }} />
        {children}
        <SoundLayer />
        <ClarityGame />
        <StatsBeacon />
        <Analytics />
      </body>
    </html>
  )
}
