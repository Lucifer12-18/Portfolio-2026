// ─────────────────────────────────────────────────────────────────────────────
// CLARITY — engine. Framework-free canvas physics + rendering for the
// interlude game. React owns the HUD; this owns every frame.
//
// The thesis as a mechanic: the screen is noise (a drifting flow field). Your
// pointer is a viewfinder lens. Every particle whose HOME lies inside the lens
// is pulled toward it — from anywhere on screen — so sweeping along the ghost
// outline paints the formation into existence. Particles that settle home
// BIND (they hold, glow in the scene's pigment, and chime). Noise storms roll
// through and unbind what they cross. Bind 90% and the formation is yours.
// ─────────────────────────────────────────────────────────────────────────────

import { formationPoints } from "@/lib/formations"

export const LEVEL_COUNT = 7
export const WIN_AT = 0.9

export interface ClarityCallbacks {
  onLock?: (binding: number) => void
  onStorm?: () => void
  onFormed?: () => void
  onFirstMove?: () => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  home: number // index into homes
  settle: number
  /** 1 → 0: the lens touched this particle recently; it keeps homing. */
  claim: number
  locked: boolean
  flash: number
  seed: number
}

interface Ring {
  x: number
  y: number
  t0: number
  id?: number
}

const STORM_CHARGE = 0.9 // s of visible build-up before the front expands
const STORM_SPEED = 300 // px/s
const STORM_BITE = 0.3 // share of bound particles a front unbinds
const HOME_SPEED = 360 // px/s cap while streaming home

type Rgb = [number, number, number]

function makeSprite([r, g, b]: Rgb, core = 1): HTMLCanvasElement {
  const c = document.createElement("canvas")
  c.width = c.height = 64
  const x = c.getContext("2d")!
  const grd = x.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, `rgba(${r},${g},${b},${core})`)
  grd.addColorStop(0.18, `rgba(${r},${g},${b},${0.55 * core})`)
  grd.addColorStop(0.5, `rgba(${r},${g},${b},${0.12 * core})`)
  grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
  x.fillStyle = grd
  x.fillRect(0, 0, 64, 64)
  return c
}

export function levelConfig(level: number) {
  return {
    entropy: 125 + level * 16, // px/s² push from the flow field
    stormEvery: level < 2 ? 0 : Math.max(7, 12.5 - level), // seconds; 0 = calm (first two formations)
  }
}

export class ClarityEngine {
  private ctx: CanvasRenderingContext2D
  private dpr = 1
  private w = 0
  private h = 0
  private particles: Particle[] = []
  private homesNorm: [number, number][] = []
  private homes: [number, number][] = []
  private scale = 1
  private cx = 0
  private cy = 0
  private level = 0
  private pigment: Rgb = [242, 166, 90]
  private sprite!: HTMLCanvasElement
  private boneSprite!: HTMLCanvasElement
  private raf = 0
  private last = 0
  private time = 0
  private playingSince = -1
  private formedAt = -1
  private nextStorm = Infinity
  private storms: Ring[] = []
  private ripples: Ring[] = []
  private bound = 0
  private moved = false
  private lens = { x: 0, y: 0, r: 110, alpha: 0, press: 0 }
  private stormId = 0
  private pointer = { x: -999, y: -999, inside: false, down: false }
  state: "idle" | "playing" | "formed" = "idle"

  constructor(
    private canvas: HTMLCanvasElement,
    private cb: ClarityCallbacks,
    private reduced = false,
  ) {
    this.ctx = canvas.getContext("2d", { alpha: false })!
    this.boneSprite = makeSprite([242, 241, 236], 0.55)
    this.resize()
    this.spawn()
    this.setLevel(0, this.pigment, false)
  }

  // ── Setup ────────────────────────────────────────────────────────────────
  resize() {
    const rect = this.canvas.getBoundingClientRect()
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.w = Math.max(1, rect.width)
    this.h = Math.max(1, rect.height)
    this.canvas.width = Math.round(this.w * this.dpr)
    this.canvas.height = Math.round(this.h * this.dpr)
    this.scale = Math.min(this.w * 0.25, this.h * 0.3)
    this.cx = this.w / 2
    this.cy = this.h * 0.53
    // Lens scales with the FORMATION, not the viewport, so difficulty holds
    // from phone to ultrawide (min 36px keeps it finger-sized).
    this.lens.r = Math.max(36, Math.min(100, this.scale * 0.3))
    this.homes = this.homesNorm.map(([x, y]) => [this.cx + x * this.scale, this.cy + y * this.scale])
    this.ctx.fillStyle = "#0b0b0a"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private spawn() {
    const n = Math.round(Math.max(320, Math.min(620, (this.w * this.h) / 2300)))
    this.particles = Array.from({ length: n }, (_, i) => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: 0,
      vy: 0,
      home: i,
      settle: 0,
      claim: 0,
      locked: false,
      flash: 0,
      seed: Math.random() * Math.PI * 2,
    }))
  }

  /** New formation: fresh homes, everything unbinds and bursts outward. */
  setLevel(level: number, pigment: Rgb, burst = true) {
    this.level = level
    this.pigment = pigment
    this.sprite = makeSprite(pigment)
    const n = this.particles.length
    this.homesNorm = formationPoints(level, n)
    this.homes = this.homesNorm.map(([x, y]) => [this.cx + x * this.scale, this.cy + y * this.scale])
    // Shuffle which particle owns which home, so every formation gathers from everywhere
    const order = Array.from({ length: n }, (_, i) => i).sort(() => Math.random() - 0.5)
    this.particles.forEach((p, i) => {
      p.home = order[i]
      p.locked = false
      p.settle = 0
      p.claim = 0
      if (burst) {
        const a = Math.atan2(p.y - this.cy, p.x - this.cx) + (Math.random() - 0.5) * 0.8
        const s = 260 + Math.random() * 380
        p.vx = Math.cos(a) * s
        p.vy = Math.sin(a) * s
      }
    })
    this.bound = 0
    this.storms = []
    this.ripples = []
    this.formedAt = -1
    this.state = "idle"
    this.moved = false
  }

  /** Begin play on the current level (ghost fades in, storms arm). */
  play() {
    this.state = "playing"
    this.playingSince = this.time
    const every = levelConfig(this.level).stormEvery
    this.nextStorm = every ? this.time + every * 0.9 : Infinity
  }

  setPointer(x: number, y: number, inside: boolean, down?: boolean) {
    this.pointer.x = x
    this.pointer.y = y
    this.pointer.inside = inside
    if (down !== undefined) this.pointer.down = down
    if (inside && this.state === "playing" && !this.moved) {
      this.moved = true
      this.cb.onFirstMove?.()
    }
  }

  get binding() {
    return this.particles.length ? this.bound / this.particles.length : 0
  }

  // ── Loop ─────────────────────────────────────────────────────────────────
  start() {
    this.last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(1 / 30, (now - this.last) / 1000)
      this.last = now
      this.update(dt)
      this.render()
      this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }

  stop() {
    cancelAnimationFrame(this.raf)
  }

  private update(dt: number) {
    this.time += dt
    const t = this.time
    const { entropy, stormEvery } = levelConfig(this.level)
    const E = this.reduced ? entropy * 0.6 : entropy
    const lens = this.lens
    const P = this.pointer

    // Lens follows the pointer on a soft spring; presses tighten it.
    const k = 1 - Math.exp(-16 * dt)
    lens.x += (P.x - lens.x) * k
    lens.y += (P.y - lens.y) * k
    lens.alpha += ((P.inside && this.state !== "formed" ? 1 : 0) - lens.alpha) * (1 - Math.exp(-8 * dt))
    lens.press += ((P.down ? 1 : 0) - lens.press) * (1 - Math.exp(-12 * dt))
    const R = lens.r * (1 - lens.press * 0.18)
    const playing = this.state === "playing"
    const pull = 52 * (1 + lens.press * 1.2)

    // Storms
    if (this.state === "playing" && t >= this.nextStorm) {
      const a = Math.random() * Math.PI * 2
      this.storms.push({ x: this.cx + Math.cos(a) * this.scale * 0.9, y: this.cy + Math.sin(a) * this.scale * 0.6, t0: t, id: ++this.stormId })
      this.nextStorm = t + stormEvery * (0.75 + Math.random() * 0.5)
      this.cb.onStorm?.()
    }
    const stormMax = Math.max(this.w, this.h) * 0.75
    const front = (s: Ring) => Math.max(0, t - s.t0 - STORM_CHARGE) * STORM_SPEED
    this.storms = this.storms.filter((s) => front(s) < stormMax)

    const formed = this.state === "formed"
    for (const p of this.particles) {
      const [hx, hy] = this.homes[p.home]
      let ax = 0
      let ay = 0

      if (p.locked || formed) {
        // Bound: a stiff, critically-damped spring home, with a faint breath.
        const bx = hx + Math.sin(t * 1.3 + p.seed) * 0.7
        const by = hy + Math.cos(t * 1.1 + p.seed) * 0.7
        ax = (bx - p.x) * 90 - p.vx * 17
        ay = (by - p.y) * 90 - p.vy * 17
      } else {
        // Noise — a slowly turning flow field
        const ang =
          Math.sin(p.x * 0.0041 + t * 0.32 + p.seed * 0.2) * 2.2 + Math.cos(p.y * 0.0036 - t * 0.27) * 2.4 + p.seed * 0.15
        ax = Math.cos(ang) * E
        ay = Math.sin(ang) * E

        // The lens claims particles whose home sits inside it.
        // A spring toward home whose damping is derived from its stiffness
        // (~critical), so particles stream in fast and arrive without wobble.
        // The lens CLAIMS particles whose home is inside it; a claimed
        // particle keeps homing for ~1s after the lens moves on, so one
        // sweep actually lands.
        let damp = 1.1
        if (playing && P.inside && Math.hypot(hx - lens.x, hy - lens.y) < R) p.claim = 1
        else p.claim = Math.max(0, p.claim - dt / 1.1)
        if (playing && p.claim > 0) {
          const K = pull * (0.45 + p.claim) // 1/s²
          ax = ax * 0.12 + (hx - p.x) * K
          ay = ay * 0.12 + (hy - p.y) * K
          damp = 1.8 * Math.sqrt(K)
        }
        p.vx *= Math.exp(-damp * dt)
        p.vy *= Math.exp(-damp * dt)

        // Settling → binding
        const dist = Math.hypot(hx - p.x, hy - p.y)
        if (playing && dist < 10 && Math.hypot(p.vx, p.vy) < 140) {
          p.settle += dt
          if (p.settle > 0.1) {
            p.locked = true
            p.flash = 1
            this.bound++
            this.ripples.push({ x: hx, y: hy, t0: t })
            this.cb.onLock?.(this.binding)
          }
        } else {
          p.settle = Math.max(0, p.settle - dt * 2)
        }
      }

      // Storm fronts unbind and scatter what they cross
      for (const s of this.storms) {
        const r = front(s)
        if (r <= 0) continue
        const d = Math.hypot(p.x - s.x, p.y - s.y)
        if (Math.abs(d - r) < 18 && !formed) {
          // Each front bites a stable ~40% of what it crosses
          const bites = ((Math.sin(p.seed * 9301 + (s.id ?? 0) * 49297) + 1) / 2) % 1 < STORM_BITE
          if (p.locked) {
            if (!bites) continue
            p.locked = false
            p.settle = 0
            p.claim = 0
            this.bound--
          }
          // Shove outward while the front passes (~140 px/s total)
          p.vx += ((p.x - s.x) / (d || 1)) * 1200 * dt
          p.vy += ((p.y - s.y) / (d || 1)) * 1200 * dt
        }
      }

      p.vx += ax * dt
      p.vy += ay * dt
      // Claimed particles STREAM home at a capped speed (holding the lens
      // nearly doubles it) — far pieces need you to linger, and the streams
      // read as light rather than teleports.
      if (!p.locked && !formed && p.claim > 0) {
        const vmax = HOME_SPEED * (1 + lens.press * 0.85)
        const v = Math.hypot(p.vx, p.vy)
        if (v > vmax) {
          p.vx *= vmax / v
          p.vy *= vmax / v
        }
      }
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.flash = Math.max(0, p.flash - dt * 2.2)

      // Free particles wrap so the noise never thins out
      if (!p.locked && !formed) {
        if (p.x < -24) p.x = this.w + 24
        else if (p.x > this.w + 24) p.x = -24
        if (p.y < -24) p.y = this.h + 24
        else if (p.y > this.h + 24) p.y = -24
      }
    }

    this.ripples = this.ripples.filter((r) => t - r.t0 < 0.6)

    // Win: bind the rest at once — the whole formation snaps into clarity.
    if (this.state === "playing" && this.binding >= WIN_AT) {
      this.state = "formed"
      this.formedAt = t
      this.storms = []
      for (const p of this.particles) {
        if (!p.locked) {
          p.locked = true
          p.flash = 1
        }
      }
      this.bound = this.particles.length
      this.cb.onFormed?.()
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  private render() {
    const c = this.ctx
    const t = this.time
    const [r, g, b] = this.pigment
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)

    // Trails: a translucent wash instead of a clear
    c.globalCompositeOperation = "source-over"
    c.fillStyle = this.reduced ? "rgb(11,11,10)" : "rgba(11,11,10,0.3)"
    c.fillRect(0, 0, this.w, this.h)

    // A pool of the scene's pigment behind the formation
    const glow = c.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.scale * 1.9)
    glow.addColorStop(0, `rgba(${r},${g},${b},${0.035 + this.binding * 0.05})`)
    glow.addColorStop(1, "rgba(0,0,0,0)")
    c.fillStyle = glow
    c.fillRect(0, 0, this.w, this.h)

    // Ghost outline — where order wants to be
    if (this.state !== "idle") {
      const ghost = Math.min(1, (t - this.playingSince) / 1.2) * (this.state === "formed" ? 0 : 0.11)
      if (ghost > 0) {
        c.fillStyle = `rgba(242,241,236,${ghost})`
        for (const p of this.particles) {
          if (p.locked) continue
          const [hx, hy] = this.homes[p.home]
          c.fillRect(hx - 0.7, hy - 0.7, 1.4, 1.4)
        }
      }
    }

    // Particles — additive light
    c.globalCompositeOperation = "lighter"
    const formedGlow = this.formedAt >= 0 ? Math.max(0, 1 - (t - this.formedAt) / 1.4) : 0
    for (const p of this.particles) {
      if (p.locked) {
        const s = 9 + p.flash * 10 + formedGlow * 8
        c.drawImage(this.sprite, p.x - s / 2, p.y - s / 2, s, s)
      } else {
        c.globalAlpha = 0.85
        c.drawImage(this.boneSprite, p.x - 3.5, p.y - 3.5, 7, 7)
        c.globalAlpha = 1
      }
    }
    c.fillStyle = `rgb(${Math.min(255, r + 30)},${Math.min(255, g + 30)},${Math.min(255, b + 30)})`
    for (const p of this.particles) if (p.locked) c.fillRect(p.x - 0.8, p.y - 0.8, 1.6, 1.6)

    // Bind ripples
    c.lineWidth = 1
    for (const rp of this.ripples) {
      const k = (t - rp.t0) / 0.6
      c.strokeStyle = `rgba(${r},${g},${b},${0.5 * (1 - k)})`
      c.beginPath()
      c.arc(rp.x, rp.y, 2 + k * 14, 0, Math.PI * 2)
      c.stroke()
    }

    // Storm fronts — dashed noise rings
    c.globalCompositeOperation = "source-over"
    for (const s of this.storms) {
      const age = t - s.t0
      if (age < STORM_CHARGE) {
        // Telegraph: a tightening, pulsing knot of noise where it will break
        const k = age / STORM_CHARGE
        c.setLineDash([2, 5])
        c.lineDashOffset = t * 60
        c.strokeStyle = `rgba(242,241,236,${0.25 + 0.35 * Math.abs(Math.sin(age * 14))})`
        c.lineWidth = 1
        c.beginPath()
        c.arc(s.x, s.y, 34 * (1 - k) + 6, 0, Math.PI * 2)
        c.stroke()
        c.setLineDash([])
        continue
      }
      const rr = (age - STORM_CHARGE) * STORM_SPEED
      const fade = 1 - rr / (Math.max(this.w, this.h) * 0.75)
      c.setLineDash([2, 9])
      c.lineDashOffset = -t * 40
      c.strokeStyle = `rgba(242,241,236,${0.32 * fade})`
      c.lineWidth = 1.2
      c.beginPath()
      c.arc(s.x, s.y, rr, 0, Math.PI * 2)
      c.stroke()
      c.setLineDash([])
      c.strokeStyle = `rgba(242,241,236,${0.08 * fade})`
      c.lineWidth = 18
      c.beginPath()
      c.arc(s.x, s.y, rr, 0, Math.PI * 2)
      c.stroke()
    }

    // Formation complete — a shockwave in pigment
    if (this.formedAt >= 0) {
      const k = (t - this.formedAt) / 1.3
      if (k < 1 && !this.reduced) {
        c.strokeStyle = `rgba(${r},${g},${b},${0.55 * (1 - k)})`
        c.lineWidth = 2
        c.beginPath()
        c.arc(this.cx, this.cy, k * Math.max(this.w, this.h) * 0.7, 0, Math.PI * 2)
        c.stroke()
      }
    }

    // The lens — a storyboard viewfinder
    const L = this.lens
    if (L.alpha > 0.01) {
      const R = L.r * (1 - L.press * 0.18)
      c.globalAlpha = L.alpha
      c.setLineDash([1.5, 7])
      c.lineDashOffset = -t * 18
      c.strokeStyle = `rgba(${r},${g},${b},${0.55 + L.press * 0.4})`
      c.lineWidth = 1.2
      c.beginPath()
      c.arc(L.x, L.y, R, 0, Math.PI * 2)
      c.stroke()
      c.setLineDash([])
      // crop marks on the diagonals
      const m = R * 0.74
      const arm = 10
      c.strokeStyle = `rgba(242,241,236,${0.55 + L.press * 0.3})`
      c.lineWidth = 1
      for (const [sx, sy] of [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ]) {
        const x = L.x + sx * m
        const y = L.y + sy * m
        c.beginPath()
        c.moveTo(x, y - sy * arm)
        c.lineTo(x, y)
        c.lineTo(x - sx * arm, y)
        c.stroke()
      }
      c.fillStyle = `rgba(${r},${g},${b},0.9)`
      c.fillRect(L.x - 1.5, L.y - 1.5, 3, 3)
      c.globalAlpha = 1
    }
  }
}
