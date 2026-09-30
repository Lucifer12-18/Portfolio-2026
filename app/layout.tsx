import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Azeret_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SoundLayer } from "@/components/sound"

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

// Resolves share-card URLs: explicit site URL → Vercel deployment → localhost.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001")

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
      <body className={`${geist.variable} ${azeret.variable} font-sans antialiased`}>
        {children}
        <SoundLayer />
        <Analytics />
      </body>
    </html>
  )
}
