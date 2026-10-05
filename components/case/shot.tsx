import type React from "react"
import fs from "node:fs"
import path from "node:path"
import Image from "next/image"

// Real screenshots, when they exist. Drop a PNG at public/case/<slug>/<name>.png
// and every <ShotOr> pointing at it swaps the coded mockup for the real
// screen at the next build; until then the mockup renders. Checked on the
// server, so nothing ships to the browser for missing files.

export function hasShot(rel: string) {
  return fs.existsSync(path.join(process.cwd(), "public", rel))
}

export function ShotOr({
  src,
  alt,
  width = 1280,
  height = 800,
  children,
}: {
  src: string
  alt: string
  width?: number
  height?: number
  children: React.ReactNode
}) {
  if (!hasShot(src)) return <>{children}</>
  return (
    <div className="relative bg-white" style={{ width, height }}>
      <Image src={`/${src}`} alt={alt} fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover object-top" />
    </div>
  )
}
