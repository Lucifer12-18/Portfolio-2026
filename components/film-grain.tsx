"use client"

/**
 * FilmGrain — a very subtle SVG noise overlay that sits on top of the entire page.
 *
 * Uses `feTurbulence` so we don't ship a noise PNG. Rendered at low opacity
 * with `mix-blend-mode: overlay` so it reads as film grain rather than static.
 *
 * Intentionally respects `prefers-reduced-motion` — grain can aggravate
 * vestibular issues when paired with other animation.
 */
export function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9990] opacity-[0.055] mix-blend-overlay motion-reduce:hidden"
      style={{
        // Repeatable SVG turbulence — rendered once by the browser, cached
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
        backgroundSize: "220px 220px",
        // A very slow drift keeps the grain from feeling static without being
        // distracting. 6s is long enough that viewers don't consciously track it.
        animation: "film-grain-drift 6s steps(4) infinite",
      }}
    />
  )
}
