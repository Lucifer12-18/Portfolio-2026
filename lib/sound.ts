// ─────────────────────────────────────────────────────────────────────────────
// SOUND — every effect is SYNTHESIZED live with the Web Audio API: no files, no
// licensing, and each sound is designed for its exact moment in the site.
//
// Musical logic: each chapter has a root note, rising across the story the way
// the pigments move dusk → dawn (D pentatonic: D3 → F#4). A chapter change
// plays a scored cue timed to the 3s formation window — inhale as content
// implodes, a low bloom at the burst, a pad that "compiles" with the particles,
// a soft landing note as the new scene enters.
//
// Browsers only allow audio after a user gesture; <SoundLayer/> unlocks the
// context on the first pointer/key press. Preference persists (plx.sound).
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "plx.sound"

// Chapter roots (MIDI): D3, F#3, A3, B3, D4, E4, F#4 — the dusk→dawn arc in sound.
const CHAPTER_ROOTS = [50, 54, 57, 59, 62, 64, 66]
// Transition cue timing mirrors page.tsx (EXIT 380ms + WATCH 2600ms).
const LAND_AT = 2.98

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

type Listener = () => void

interface Voice {
  gain?: number
  attack?: number
  decay?: number
  when?: number
  type?: OscillatorType
  send?: number
  detune?: number
  dest?: AudioNode
}

class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private send: GainNode | null = null
  private noise: AudioBuffer | null = null
  private cueBus: GainNode | null = null
  private seam: { g: GainNode; logic: GainNode; exp: GainNode; oscs: OscillatorNode[] } | null = null
  private lastHover = 0
  private enabled = true
  private listeners = new Set<Listener>()

  constructor() {
    if (typeof window === "undefined") return
    try {
      if (window.localStorage.getItem(KEY) === "off") this.enabled = false
    } catch {}
  }

  // ── Preference (useSyncExternalStore-compatible) ─────────────────────────
  subscribe = (l: Listener) => {
    this.listeners.add(l)
    return () => {
      this.listeners.delete(l)
    }
  }
  getEnabled = () => this.enabled

  setEnabled(on: boolean) {
    this.enabled = on
    try {
      window.localStorage.setItem(KEY, on ? "on" : "off")
    } catch {}
    this.listeners.forEach((l) => l())
    if (on) {
      this.unlock()
      // The toggle confirms itself: a small rising two-note "on".
      setTimeout(() => this.chime(true), 40)
    } else {
      this.seamEnd()
      this.retireCue()
    }
  }

  // ── Context + graph ──────────────────────────────────────────────────────
  unlock() {
    if (typeof window === "undefined") return
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return
      const ctx = new AC()
      const comp = ctx.createDynamicsCompressor()
      comp.threshold.value = -18
      comp.ratio.value = 3
      comp.connect(ctx.destination)

      const master = ctx.createGain()
      master.gain.value = 0.6
      master.connect(comp)

      // A small room — generated impulse, no file.
      const len = Math.floor(ctx.sampleRate * 2.2)
      const ir = ctx.createBuffer(2, len, ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch)
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2)
      }
      const verb = ctx.createConvolver()
      verb.buffer = ir
      const wet = ctx.createGain()
      wet.gain.value = 0.32
      const send = ctx.createGain()
      send.connect(verb)
      verb.connect(wet)
      wet.connect(comp)

      const nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
      const nd = nb.getChannelData(0)
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1

      this.ctx = ctx
      this.master = master
      this.send = send
      this.noise = nb
    }
    if (this.ctx.state === "suspended") void this.ctx.resume()
  }

  private live(): AudioContext | null {
    // A context still resuming from the unlocking gesture is fine: nodes
    // scheduled now simply start the moment it runs (time is frozen till then).
    if (!this.enabled || !this.ctx || this.ctx.state === "closed") return null
    return this.ctx
  }

  private out(node: AudioNode, send = 0.35, dest?: AudioNode) {
    node.connect(dest ?? this.master!)
    if (send > 0 && this.send) {
      const s = this.ctx!.createGain()
      s.gain.value = send
      node.connect(s)
      s.connect(this.send)
    }
  }

  /** One enveloped oscillator. */
  private tone(freq: number, v: Voice = {}) {
    const ctx = this.ctx!
    const t = ctx.currentTime + (v.when ?? 0)
    const o = ctx.createOscillator()
    o.type = v.type ?? "sine"
    o.frequency.value = freq
    if (v.detune) o.detune.value = v.detune
    const g = ctx.createGain()
    const peak = v.gain ?? 0.05
    const a = v.attack ?? 0.004
    const d = v.decay ?? 0.3
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + a)
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d)
    o.connect(g)
    this.out(g, v.send ?? 0.35, v.dest)
    o.start(t)
    o.stop(t + a + d + 0.05)
    return o
  }

  /** A soft plucked note — sine body + a quieter octave. */
  private pluck(freq: number, gain: number, when = 0, decay = 0.6, dest?: AudioNode) {
    this.tone(freq, { gain, decay, when, send: 0.5, dest })
    this.tone(freq * 2, { gain: gain * 0.28, decay: decay * 0.6, when, send: 0.5, dest })
  }

  /** Filtered noise with a moving cutoff — whooshes, ticks, air. */
  private air(dur: number, from: number, to: number, gain: number, v: { when?: number; type?: BiquadFilterType; q?: number; attack?: number; dest?: AudioNode; send?: number } = {}) {
    const ctx = this.ctx!
    const t = ctx.currentTime + (v.when ?? 0)
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.loop = true
    const f = ctx.createBiquadFilter()
    f.type = v.type ?? "bandpass"
    f.Q.value = v.q ?? 1.2
    f.frequency.setValueAtTime(from, t)
    f.frequency.exponentialRampToValueAtTime(to, t + dur)
    const g = ctx.createGain()
    const a = v.attack ?? dur * 0.6
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + a)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f)
    f.connect(g)
    this.out(g, v.send ?? 0.3, v.dest)
    src.start(t, Math.random() * 0.5)
    src.stop(t + dur + 0.05)
  }

  // ── The cues ─────────────────────────────────────────────────────────────

  /** Pointer passes over something interactive — barely there. */
  hover() {
    if (!this.live()) return
    const now = performance.now()
    if (now - this.lastHover < 85) return
    this.lastHover = now
    this.tone(2300 + Math.random() * 400, { gain: 0.014, decay: 0.045, send: 0.1 })
  }

  /** A press — soft key: a tick of air over a small body. */
  tap() {
    if (!this.live()) return
    this.air(0.035, 3200, 1800, 0.05, { attack: 0.004, q: 1.6, send: 0.1 })
    this.tone(330, { gain: 0.045, decay: 0.09, send: 0.15 })
  }

  /** Chapter change — scored to the formation window, pitched per chapter. */
  transition(chapter: number) {
    const ctx = this.live()
    if (!ctx) return
    this.retireCue()
    const bus = ctx.createGain()
    bus.gain.value = 1
    bus.connect(this.master!)
    this.cueBus = bus
    const root = CHAPTER_ROOTS[chapter] ?? 50

    // 1 · inhale — content implodes (0 → 0.38s)
    this.air(0.42, 400, 3800, 0.09, { type: "bandpass", q: 0.9, attack: 0.36, dest: bus, send: 0.4 })
    this.tone(hz(root + 12), { gain: 0.02, attack: 0.3, decay: 0.12, type: "triangle", dest: bus })

    // 2 · bloom — the burst, a low body that falls
    const t = ctx.currentTime + 0.38
    const o = ctx.createOscillator()
    o.frequency.setValueAtTime(hz(root - 12) * 2, t)
    o.frequency.exponentialRampToValueAtTime(hz(root - 12), t + 0.5)
    const og = ctx.createGain()
    og.gain.setValueAtTime(0.0001, t)
    og.gain.exponentialRampToValueAtTime(0.16, t + 0.02)
    og.gain.exponentialRampToValueAtTime(0.0001, t + 1.1)
    o.connect(og)
    this.out(og, 0.5, bus)
    o.start(t)
    o.stop(t + 1.2)

    // 3 · compile — an open chord whose filter opens as the formation binds
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.Q.value = 0.7
    lp.frequency.setValueAtTime(380, t)
    lp.frequency.exponentialRampToValueAtTime(2600, t + 2.2)
    this.out(lp, 0.6, bus)
    ;[0, 7, 12, 16, 19].forEach((iv, k) => {
      const po = ctx.createOscillator()
      po.type = k % 2 ? "sine" : "triangle"
      po.frequency.value = hz(root + iv)
      po.detune.value = (k - 2) * 4
      const pg = ctx.createGain()
      pg.gain.setValueAtTime(0.0001, t)
      pg.gain.exponentialRampToValueAtTime(0.022, t + 0.8)
      pg.gain.setValueAtTime(0.022, ctx.currentTime + LAND_AT - 0.1)
      pg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + LAND_AT + 1.4)
      po.connect(pg)
      pg.connect(lp)
      po.start(t)
      po.stop(ctx.currentTime + LAND_AT + 1.5)
    })

    // Sparkles — the "binding 0.00 → 1.00" readout, as notes
    ;[24, 26, 28, 31, 33, 36].forEach((iv, k) => {
      this.tone(hz(root + iv), { gain: 0.016, decay: 0.45, when: 0.95 + k * 0.26, type: "triangle", send: 0.7, dest: bus })
    })

    // 4 · land — the scene arrives
    this.pluck(hz(root + 12), 0.07, LAND_AT, 0.9, bus)
    this.air(0.18, 5200, 2600, 0.02, { when: LAND_AT, attack: 0.01, dest: bus })
  }

  private retireCue() {
    const old = this.cueBus
    if (!old || !this.ctx) return
    old.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05)
    setTimeout(() => old.disconnect(), 500)
    this.cueBus = null
  }

  /** Headline scramble — a quiet crackle of mono glyphs resolving. */
  decode(durationMs = 460) {
    if (!this.live()) return
    const n = 8
    for (let i = 0; i < n; i++) {
      this.tone(1800 + Math.random() * 1800, { gain: 0.007, decay: 0.012, when: (i / n) * (durationMs / 1000), type: "square", send: 0.05 })
    }
  }

  /** Method's metronome — a pluck on each beat, climbing the chord. */
  beat(i: number, chapter = 3) {
    if (!this.live()) return
    const root = CHAPTER_ROOTS[chapter] ?? 59
    this.pluck(hz(root + 12 + [0, 4, 7, 12][i % 4]), 0.05, 0, 0.7)
  }

  /** Recruiter ↔ designer. */
  toggle(toDesigner: boolean) {
    if (!this.live()) return
    const [a, b] = toDesigner ? [660, 990] : [990, 660]
    this.tone(a, { gain: 0.035, decay: 0.08, type: "triangle", send: 0.2 })
    this.tone(b, { gain: 0.035, decay: 0.12, type: "triangle", when: 0.06, send: 0.2 })
  }

  /** Email copied / sound switched on. */
  chime(up = true) {
    if (!this.live()) return
    const [a, b] = up ? [hz(74), hz(81)] : [hz(81), hz(74)]
    this.pluck(a, 0.045, 0, 0.5)
    this.pluck(b, 0.045, 0.09, 0.7)
  }

  /** Case modal opens / closes — paper through air. */
  sheet(open: boolean) {
    if (!this.live()) return
    if (open) {
      this.air(0.32, 300, 2600, 0.05, { type: "lowpass", q: 0.6, attack: 0.22 })
      this.pluck(hz(62), 0.035, 0.18, 0.6)
    } else {
      this.air(0.26, 2600, 300, 0.04, { type: "lowpass", q: 0.6, attack: 0.05 })
    }
  }

  /** Entering the OS from the boot screen — the whole arc, rising. */
  boot() {
    if (!this.live()) return
    CHAPTER_ROOTS.forEach((m, k) => this.pluck(hz(m + 12), 0.035, k * 0.07, 0.8))
    this.air(0.7, 300, 3000, 0.04, { type: "lowpass", attack: 0.5 })
  }

  // ── Shift's lens — logic (buzzy, filtered) ⇄ experience (warm, open) ─────
  seamStart(experience: number) {
    const ctx = this.live()
    if (!ctx || this.seam) return
    const base = hz(CHAPTER_ROOTS[2])
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.08)
    this.out(g, 0.35)

    const logic = ctx.createGain()
    const lf = ctx.createBiquadFilter()
    lf.type = "lowpass"
    lf.frequency.value = 900
    logic.connect(lf)
    lf.connect(g)
    const exp = ctx.createGain()
    exp.connect(g)

    const sq = ctx.createOscillator()
    sq.type = "square"
    sq.frequency.value = base
    sq.connect(logic)
    const s1 = ctx.createOscillator()
    s1.frequency.value = base * 2
    const s2 = ctx.createOscillator()
    s2.type = "triangle"
    s2.frequency.value = base * 3
    const s2g = ctx.createGain()
    s2g.gain.value = 0.4
    s1.connect(exp)
    s2.connect(s2g)
    s2g.connect(exp)
    ;[sq, s1, s2].forEach((o) => o.start())

    this.seam = { g, logic, exp, oscs: [sq, s1, s2] }
    this.seamMove(experience)
  }

  seamMove(experience: number) {
    if (!this.seam || !this.ctx) return
    const e = Math.max(0, Math.min(1, experience))
    const t = this.ctx.currentTime
    this.seam.logic.gain.setTargetAtTime(0.022 * (1 - e), t, 0.03)
    this.seam.exp.gain.setTargetAtTime(0.03 * e, t, 0.03)
  }

  seamEnd() {
    const s = this.seam
    if (!s || !this.ctx) return
    const t = this.ctx.currentTime
    s.g.gain.setTargetAtTime(0.0001, t, 0.07)
    s.oscs.forEach((o) => o.stop(t + 0.45))
    this.seam = null
  }
}

/** The one engine. Import `sfx` anywhere and call a cue. */
export const sfx = new SoundEngine()
