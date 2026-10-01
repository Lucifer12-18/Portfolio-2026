// ─────────────────────────────────────────────────────────────────────────────
// FORMATIONS as paths — the seven particle shapes (same geometry as the
// storyboard FormationGlyph, in its 100×64 space) expressed as polylines, plus
// an even arc-length sampler. The Clarity game turns these into N "home"
// points so the particles bind into crisp, dotted versions of each scene.
// ─────────────────────────────────────────────────────────────────────────────

export type Pt = [number, number]
type Poly = Pt[]

const curve = (fn: (t: number) => Pt, steps: number, t0: number, t1: number): Poly =>
  Array.from({ length: steps + 1 }, (_, i) => fn(t0 + ((t1 - t0) * i) / steps))

const ellipse = (cx: number, cy: number, rx: number, ry: number): Poly =>
  curve((t) => [cx + rx * Math.cos(t), cy + ry * Math.sin(t)], 96, 0, Math.PI * 2)

const line = (...pts: Pt[]): Poly => pts

function shape(index: number): Poly[] {
  switch (index) {
    case 0: // fibonacci sphere
      return [ellipse(50, 32, 26, 26), ellipse(50, 32, 26, 8), ellipse(50, 32, 26, 17), ellipse(50, 32, 10, 26)]
    case 1: {
      // double helix + rungs
      const y = (x: number, ph: number) => 32 + 15 * Math.sin((x / 40) * Math.PI * 2 + ph)
      const rungs = Array.from({ length: 11 }, (_, i) => {
        const x = 12 + i * 7.6
        return line([x, y(x, 0)], [x, y(x, Math.PI)])
      })
      return [curve((x) => [x, y(x, 0)], 80, 8, 92), curve((x) => [x, y(x, Math.PI)], 80, 8, 92), ...rungs]
    }
    case 2: // torus
      return [ellipse(50, 33, 40, 21), ellipse(50, 33, 27, 13), ellipse(50, 31, 14, 5.5)]
    case 3: // trefoil knot
      return [
        curve(
          (t) => [50 + 8.6 * (Math.sin(t) + 2 * Math.sin(2 * t)), 33 + 8.6 * 0.95 * (Math.cos(t) - 2 * Math.cos(2 * t))],
          240,
          0,
          Math.PI * 2,
        ),
      ]
    case 4: // crystal lattice — isometric cube + inner grid
      return [
        line([50, 8], [74, 20], [50, 32], [26, 20], [50, 8]),
        line([26, 20], [26, 44], [50, 56], [74, 44], [74, 20]),
        line([50, 32], [50, 56]),
        line([38, 14], [62, 26]),
        line([62, 14], [38, 26]),
      ]
    case 5: // wave surface
      return [0, 1, 2, 3].map((i) =>
        curve((x) => [x, 17 + i * 10 + (6.5 - i * 1.1) * Math.sin((x / 26) * Math.PI + i * 0.9)], 80, 8, 92),
      )
    default: {
      // starburst
      return Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        const r = i % 2 ? 17 : 27
        return line([50 + Math.cos(a) * 6, 32 + Math.sin(a) * 6], [50 + Math.cos(a) * r, 32 + Math.sin(a) * r])
      })
    }
  }
}

/**
 * N points spread evenly along the formation's total path length, centred on
 * the origin and normalised so the shape's height is ~2 units (−1…1).
 */
export function formationPoints(index: number, n: number): Pt[] {
  const polys = shape(index)
  const segs: { a: Pt; b: Pt; len: number }[] = []
  for (const p of polys) {
    for (let i = 1; i < p.length; i++) {
      const a = p[i - 1]
      const b = p[i]
      segs.push({ a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1]) })
    }
  }
  const total = segs.reduce((s, x) => s + x.len, 0)
  const out: Pt[] = []
  let si = 0
  let acc = 0
  for (let k = 0; k < n; k++) {
    const target = ((k + 0.5) / n) * total
    while (si < segs.length - 1 && acc + segs[si].len < target) {
      acc += segs[si].len
      si++
    }
    const s = segs[si]
    const t = s.len ? (target - acc) / s.len : 0
    out.push([((s.a[0] + (s.b[0] - s.a[0]) * t) - 50) / 26, ((s.a[1] + (s.b[1] - s.a[1]) * t) - 32) / 26])
  }
  return out
}
