// ─────────────────────────────────────────────────────────────────────────────
// SOUND — a cinematic, AAA-style UI score, SYNTHESIZED live with Web Audio:
// no files, no licensing, every cue designed for its exact moment.
//
// The palette is textural, not melodic: muted ticks, weighted "thocks",
// saturated sub-bass impacts, filtered-noise whooshes that travel in stereo,
// dark open pads (root · fifth · ninth, no third), and glassy FM shimmer for
// the bright accents. A long, darkened room ties it together and a compressor
// glues the mix.
//
// Each chapter has a root note, rising across the story the way the pigments
// move dusk → dawn (D2 → F#3, low for weight). A chapter change plays a cue
// scored to the 3s formation window: suck-in → impact → compile → land.
//
// Browsers only allow audio after a user gesture; <SoundLayer/> unlocks the
// context on the first pointer/key press. Preference persists (plx.sound).
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "plx.sound"

// Chapter roots (MIDI): D2, F#2, A2, B2, D3, E3, F#3 — the arc, an octave low.
const CHAPTER_ROOTS = [38, 42, 45, 47, 50, 52, 54]
// Transition cue timing mirrors page.tsx (EXIT 380ms + WATCH 2600ms).
const LAND_AT = 2.98

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)
const rand = (a: number, b: number) => a + Math.random() * (b - a)

type Listener = () => void

class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private send: GainNode | null = null
  private noise: AudioBuffer | null = null
  private drive: Float32Array | null = null
  private cueBus: GainNode | null = null
  private seam: { g: GainNode; logic: GainNode; exp: GainNode; oscs: OscillatorNode[] } | null = null
  private lastHover = 0
  private lastBind = 0
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

      // Glue: gentle bus compression into the output
      const comp = ctx.createDynamicsCompressor()
      comp.threshold.value = -20
      comp.knee.value = 12
      comp.ratio.value = 4
      comp.attack.value = 0.004
      comp.release.value = 0.25
      comp.connect(ctx.destination)

      const master = ctx.createGain()
      master.gain.value = 0.55
      master.connect(comp)

      // A long, DARK room: decaying noise whose brightness falls over time
      // (one-pole lowpass closing as the tail ages), 18ms pre-delay.
      const sr = ctx.sampleRate
      const len = Math.floor(sr * 3.2)
      const ir = ctx.createBuffer(2, len, sr)
      const pre = Math.floor(sr * 0.018)
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch)
        let y = 0
        for (let i = pre; i < len; i++) {
          const k = (i - pre) / (len - pre)
          const a = 0.55 * (1 - k) + 0.04
          y += a * ((Math.random() * 2 - 1) - y)
          d[i] = y * Math.pow(1 - k, 2.6)
        }
      }
      const verb = ctx.createConvolver()
      verb.buffer = ir
      const wet = ctx.createGain()
      wet.gain.value = 0.42
      const send = ctx.createGain()
      send.connect(verb)
      verb.connect(wet)
      wet.connect(comp)

      const nb = ctx.createBuffer(1, sr * 2, sr)
      const nd = nb.getChannelData(0)
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1

      // Saturation curve — weight on impacts
      const curve = new Float32Array(1024)
      for (let i = 0; i < curve.length; i++) {
        const x = (i / (curve.length - 1)) * 2 - 1
        curve[i] = Math.tanh(2.6 * x)
      }

      this.ctx = ctx
      this.master = master
      this.send = send
      this.noise = nb
      this.drive = curve
    }
    if (this.ctx.state === "suspended") void this.ctx.resume()
  }

  private live(): AudioContext | null {
    // A context still resuming from the unlocking gesture is fine: nodes
    // scheduled now start the moment it runs (time is frozen till then).
    if (!this.enabled || !this.ctx || this.ctx.state === "closed") return null
    return this.ctx
  }

  /** Route a voice to the mix (or a cue bus) with an amount sent to the room. */
  private out(node: AudioNode, send = 0.3, dest?: AudioNode) {
    node.connect(dest ?? this.master!)
    if (send > 0 && this.send) {
      const s = this.ctx!.createGain()
      s.gain.value = send
      node.connect(s)
      s.connect(this.send)
    }
  }

  private pan(from: number, to = from, t = 0, dur = 0): AudioNode {
    const ctx = this.ctx!
    if (!ctx.createStereoPanner) return ctx.createGain()
    const p = ctx.createStereoPanner()
    p.pan.setValueAtTime(from, t)
    if (dur > 0) p.pan.linearRampToValueAtTime(to, t + dur)
    return p
  }

  private env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  }

  // ── Primitives ───────────────────────────────────────────────────────────

  /** A muted, tight transient — filtered noise, 10–20ms. */
  private tick(when = 0, freq = 3600, gain = 0.02, q = 4, pan = 0, dest?: AudioNode) {
    const ctx = this.ctx!
    const t = ctx.currentTime + when
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const f = ctx.createBiquadFilter()
    f.type = "bandpass"
    f.frequency.value = freq
    f.Q.value = q
    const g = ctx.createGain()
    this.env(g, t, gain, 0.001, 0.014)
    const p = this.pan(pan, pan, t)
    src.connect(f)
    f.connect(g)
    g.connect(p)
    this.out(p, 0.12, dest)
    src.start(t, rand(0, 1.5))
    src.stop(t + 0.05)
  }

  /** A body: sine with a fast pitch drop, saturated — "thock" to "boom". */
  private thump(when = 0, from = 160, to = 50, gain = 0.08, decay = 0.14, send = 0.18, dest?: AudioNode) {
    const ctx = this.ctx!
    const t = ctx.currentTime + when
    const o = ctx.createOscillator()
    o.frequency.setValueAtTime(from, t)
    o.frequency.exponentialRampToValueAtTime(to, t + Math.max(0.03, decay * 0.55))
    const sh = ctx.createWaveShaper()
    sh.curve = this.drive as Float32Array<ArrayBuffer>
    const g = ctx.createGain()
    this.env(g, t, gain, 0.003, decay)
    o.connect(sh)
    sh.connect(g)
    this.out(g, send, dest)
    o.start(t)
    o.stop(t + decay + 0.1)
  }

  /** A cinematic hit: saturated sub drop + a crack of air + a low noise body. */
  private impact(when = 0, from = 120, to = 32, gain = 0.22, decay = 1.2, dest?: AudioNode) {
    this.thump(when, from, to, gain, decay, 0.35, dest)
    this.air(0.04, 6000, 2500, gain * 0.35, { when, type: "highpass", q: 0.7, attack: 0.002, send: 0.3, dest })
    this.air(decay * 0.55, 380, 90, gain * 0.28, { when, type: "lowpass", q: 0.6, attack: 0.01, send: 0.4, dest })
  }

  /** Filtered noise with a moving cutoff and stereo travel — whooshes, swells, rumble. */
  private air(
    dur: number,
    from: number,
    to: number,
    gain: number,
    v: { when?: number; type?: BiquadFilterType; q?: number; attack?: number; dest?: AudioNode; send?: number; panFrom?: number; panTo?: number } = {},
  ) {
    const ctx = this.ctx!
    const t = ctx.currentTime + (v.when ?? 0)
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.loop = true
    const f = ctx.createBiquadFilter()
    f.type = v.type ?? "bandpass"
    f.Q.value = v.q ?? 1
    f.frequency.setValueAtTime(from, t)
    f.frequency.exponentialRampToValueAtTime(to, t + dur)
    const g = ctx.createGain()
    const a = v.attack ?? dur * 0.5
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + a)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    const p = this.pan(v.panFrom ?? 0, v.panTo ?? v.panFrom ?? 0, t, dur)
    src.connect(f)
    f.connect(g)
    g.connect(p)
    this.out(p, v.send ?? 0.35, v.dest)
    src.start(t, rand(0, 1.5))
    src.stop(t + dur + 0.05)
  }

  /** Glassy FM shimmer — inharmonic partials, a bright index that decays. */
  private shimmer(freqs: number[], gain = 0.015, decay = 2.2, when = 0, pan = 0, dest?: AudioNode) {
    const ctx = this.ctx!
    const t = ctx.currentTime + when
    for (const fr of freqs) {
      const car = ctx.createOscillator()
      car.frequency.value = fr
      const mod = ctx.createOscillator()
      mod.frequency.value = fr * 2.756
      const idx = ctx.createGain()
      idx.gain.setValueAtTime(fr * 2.4, t)
      idx.gain.exponentialRampToValueAtTime(fr * 0.05, t + decay * 0.5)
      mod.connect(idx)
      idx.connect(car.frequency)
      const g = ctx.createGain()
      this.env(g, t, gain, 0.004, decay)
      const p = this.pan(pan)
      car.connect(g)
      g.connect(p)
      this.out(p, 0.75, dest)
      car.start(t)
      mod.start(t)
      car.stop(t + decay + 0.1)
      mod.stop(t + decay + 0.1)
    }
  }

  /** A dark pad — detuned saws through a lowpass that opens over time. */
  private pad(midis: number[], dur: number, gain: number, cutFrom: number, cutTo: number, when = 0, attack = 0.8, release = 1.4, dest?: AudioNode) {
    const ctx = this.ctx!
    const t = ctx.currentTime + when
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.Q.value = 0.8
    lp.frequency.setValueAtTime(cutFrom, t)
    lp.frequency.exponentialRampToValueAtTime(cutTo, t + Math.max(0.1, dur * 0.85))
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(1, t + attack)
    g.gain.setValueAtTime(1, t + dur)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + release)
    lp.connect(g)
    this.out(g, 0.55, dest)
    for (const m of midis) {
      for (const det of [-8, 8]) {
        const o = ctx.createOscillator()
        o.type = "sawtooth"
        o.frequency.value = hz(m)
        o.detune.value = det
        const og = ctx.createGain()
        og.gain.value = gain
        o.connect(og)
        og.connect(lp)
        o.start(t)
        o.stop(t + dur + release + 0.1)
      }
    }
  }

  // ── The cues ─────────────────────────────────────────────────────────────

  /** Pointer passes over something interactive — a muted tick, felt more than heard. */
  hover() {
    if (!this.live()) return
    const now = performance.now()
    if (now - this.lastHover < 70) return
    this.lastHover = now
    this.tick(0, rand(3000, 3900), 0.011, 5)
    this.thump(0, 240, 130, 0.01, 0.03, 0.05)
  }

  /** A press — a weighted "thock". */
  tap() {
    if (!this.live()) return
    this.tick(0, 2500, 0.032, 3)
    this.thump(0, 190, 55, 0.075, 0.11)
  }

  /** Chapter change — suck-in → impact → compile → land, scored to the window. */
  transition(chapter: number) {
    const ctx = this.live()
    if (!ctx) return
    this.retireCue()
    const bus = ctx.createGain()
    bus.gain.value = 1
    bus.connect(this.master!)
    this.cueBus = bus
    const root = CHAPTER_ROOTS[chapter] ?? 38

    // 1 · suck-in — a reverse swell as the content implodes (0 → 0.38s)
    this.air(0.4, 220, 4600, 0.075, { type: "lowpass", q: 0.7, attack: 0.37, panFrom: -0.5, panTo: 0.2, dest: bus, send: 0.3 })
    const rs = ctx.createOscillator()
    rs.type = "sawtooth"
    rs.frequency.setValueAtTime(hz(root + 12), ctx.currentTime)
    rs.frequency.exponentialRampToValueAtTime(hz(root + 24), ctx.currentTime + 0.38)
    const rf = ctx.createBiquadFilter()
    rf.type = "lowpass"
    rf.frequency.value = 1400
    const rg = ctx.createGain()
    rg.gain.setValueAtTime(0.0001, ctx.currentTime)
    rg.gain.exponentialRampToValueAtTime(0.022, ctx.currentTime + 0.36)
    rg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
    rs.connect(rf)
    rf.connect(rg)
    this.out(rg, 0.3, bus)
    rs.start()
    rs.stop(ctx.currentTime + 0.45)

    // 2 · impact at the burst + the blast travelling outward
    this.impact(0.38, 110, 30, 0.24, 1.3, bus)
    this.air(0.9, 3400, 380, 0.055, { when: 0.38, type: "bandpass", q: 0.8, attack: 0.04, panFrom: 0.45, panTo: -0.45, dest: bus, send: 0.5 })

    // 3 · compile — a dark open pad that filters open with the formation
    this.pad([root, root + 7, root + 12, root + 14, root + 19], LAND_AT - 0.5, 0.0105, 200, 1700, 0.45, 0.9, 1.6, bus)
    // telemetry chatter, scattered in stereo
    for (let i = 0; i < 14; i++) {
      this.tick(rand(0.9, 2.6), rand(2600, 6800), rand(0.006, 0.013), 9, rand(-0.7, 0.7), bus)
    }

    // 4 · land — the scene arrives
    this.thump(LAND_AT, 150, 48, 0.13, 0.32, 0.3, bus)
    this.tick(LAND_AT, 5200, 0.022, 3, 0, bus)
    this.shimmer([hz(root + 36), hz(root + 43), hz(root + 31)], 0.011, 2.8, LAND_AT, 0, bus)
  }

  private retireCue() {
    const old = this.cueBus
    if (!old || !this.ctx) return
    old.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05)
    setTimeout(() => old.disconnect(), 500)
    this.cueBus = null
  }

  /** Headline scramble — dense data chatter while the glyphs resolve. */
  decode(durationMs = 460) {
    if (!this.live()) return
    const n = 12
    for (let i = 0; i < n; i++) {
      this.tick((i / n) * (durationMs / 1000), rand(3200, 7200), 0.0075, 9, rand(-0.4, 0.4))
    }
  }

  /** Method's metronome — a clock-like thump, the downbeat accented. */
  beat(i: number, chapter = 3) {
    if (!this.live()) return
    const down = i % 4 === 0
    this.thump(0, down ? 170 : 130, 44, down ? 0.11 : 0.075, 0.18, 0.25)
    this.tick(0, down ? 2100 : 3000, down ? 0.024 : 0.016, 4)
    if (down) this.shimmer([hz((CHAPTER_ROOTS[chapter] ?? 47) + 43)], 0.006, 1.6)
  }

  /** Recruiter ↔ designer — a mechanical latch. */
  toggle(toDesigner: boolean) {
    if (!this.live()) return
    this.tick(0, toDesigner ? 2600 : 3400, 0.03, 4, toDesigner ? 0.2 : -0.2)
    this.tick(0.045, toDesigner ? 3400 : 2600, 0.028, 4, toDesigner ? -0.2 : 0.2)
    this.thump(0.045, 170, 80, 0.045, 0.06, 0.1)
  }

  /** Confirm (email copied, sound on) — "access granted": a latch + glass. */
  chime(up = true) {
    if (!this.live()) return
    this.tick(0, 3000, 0.026, 4)
    this.thump(0, 180, 70, 0.05, 0.09, 0.15)
    this.shimmer(up ? [1760, 2637] : [1318, 1760], 0.009, 1.8, 0.05)
  }

  /** Case modal opens / closes — a panel sliding through air. */
  sheet(open: boolean) {
    if (!this.live()) return
    if (open) {
      this.air(0.38, 280, 3600, 0.05, { type: "lowpass", q: 0.7, attack: 0.3, panFrom: -0.4, panTo: 0.3 })
      this.thump(0.3, 130, 48, 0.07, 0.22, 0.3)
    } else {
      this.air(0.3, 3200, 260, 0.045, { type: "lowpass", q: 0.7, attack: 0.04, panFrom: 0.3, panTo: -0.4 })
      this.tick(0.02, 2400, 0.02, 4)
    }
  }

  /** Entering the OS — riser into a hit, the first chord of the story. */
  boot() {
    if (!this.live()) return
    this.air(0.6, 180, 6000, 0.06, { type: "lowpass", q: 0.8, attack: 0.58, panFrom: -0.6, panTo: 0.6 })
    this.impact(0.6, 120, 30, 0.22, 1.5)
    this.pad([38, 45, 50, 52, 57], 1.6, 0.01, 260, 2400, 0.6, 0.4, 2.2)
    this.shimmer([hz(74), hz(81), hz(86)], 0.01, 3, 0.62)
  }

  // ── Briefing (onboarding tour) ───────────────────────────────────────────

  /** The briefing begins — a low swell resolving into a soft hit. */
  tourOpen() {
    if (!this.live()) return
    this.air(0.55, 160, 2800, 0.05, { type: "lowpass", q: 0.8, attack: 0.5 })
    this.thump(0.5, 120, 40, 0.1, 0.5, 0.4)
    this.shimmer([hz(81), hz(86)], 0.008, 2.4, 0.52)
  }

  /** The spotlight travels to the next element — a short traverse + lock-on tick. */
  tourStep(dir = 1) {
    if (!this.live()) return
    this.air(0.3, 700, 2600, 0.035, { type: "bandpass", q: 1.2, attack: 0.18, panFrom: -0.35 * dir, panTo: 0.35 * dir })
    this.tick(0.26, 4200, 0.022, 5)
    this.tick(0.3, 3000, 0.016, 5)
    this.thump(0.28, 150, 70, 0.035, 0.07, 0.15)
  }

  /** The briefing ends — the HUD powers down. */
  tourClose() {
    if (!this.live()) return
    this.air(0.4, 2600, 220, 0.04, { type: "lowpass", q: 0.7, attack: 0.04 })
    this.thump(0.05, 140, 40, 0.07, 0.3, 0.3)
  }

  // ── Clarity (the interlude game) ─────────────────────────────────────────

  /** A particle binds — a glass crystal forming; brighter as the formation fills. */
  bind(level: number, progress: number) {
    if (!this.live()) return
    const now = performance.now()
    if (now - this.lastBind < 45) return
    this.lastBind = now
    const root = (CHAPTER_ROOTS[level] ?? 38) + 36
    const tones = [0, 7, 12, 14, 19, 24]
    const i = Math.min(tones.length - 1, Math.floor(progress * (tones.length - 1) + Math.random() * 1.5))
    this.shimmer([hz(root + tones[i])], 0.009 + progress * 0.006, 1.3, 0, rand(-0.6, 0.6))
  }

  /** A noise storm — sub rumble, a front of air, static crackle. */
  storm() {
    if (!this.live()) return
    this.air(1.8, 90, 200, 0.12, { type: "lowpass", q: 0.7, attack: 0.5, send: 0.4 })
    this.thump(0.1, 72, 26, 0.17, 1.3, 0.35)
    this.air(1.4, 1900, 220, 0.04, { type: "bandpass", q: 0.9, attack: 0.3, panFrom: -0.6, panTo: 0.6 })
    for (let i = 0; i < 9; i++) this.tick(rand(0.1, 1.2), rand(700, 1600), rand(0.015, 0.03), 2, rand(-0.8, 0.8))
  }

  /** A formation is bound — the big hit, a chord that finally resolves. */
  formed(level: number) {
    if (!this.live()) return
    const root = CHAPTER_ROOTS[level] ?? 38
    this.impact(0, 140, 28, 0.26, 1.7)
    this.air(1.1, 4200, 300, 0.05, { type: "bandpass", q: 0.8, attack: 0.03, panFrom: -0.5, panTo: 0.5, send: 0.6 })
    this.pad([root, root + 7, root + 12, root + 16, root + 19], 1.6, 0.012, 400, 3600, 0.02, 0.25, 2.4)
    this.shimmer([hz(root + 36), hz(root + 43), hz(root + 48)], 0.014, 3.2, 0.05)
  }

  // ── Shift's lens — logic (nasal, digital) ⇄ experience (warm, open) ──────
  seamStart(experience: number) {
    const ctx = this.live()
    if (!ctx || this.seam) return
    const base = hz(CHAPTER_ROOTS[2] + 12)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.1)
    this.out(g, 0.4)

    // Logic: a square through a narrow band — digital, boxy
    const logic = ctx.createGain()
    const lf = ctx.createBiquadFilter()
    lf.type = "bandpass"
    lf.frequency.value = 700
    lf.Q.value = 4
    logic.connect(lf)
    lf.connect(g)
    const sq = ctx.createOscillator()
    sq.type = "square"
    sq.frequency.value = base
    sq.connect(logic)

    // Experience: detuned saws (root + fifth) through a soft lowpass — warm
    const exp = ctx.createGain()
    const ef = ctx.createBiquadFilter()
    ef.type = "lowpass"
    ef.frequency.value = 1300
    exp.connect(ef)
    ef.connect(g)
    const s1 = ctx.createOscillator()
    s1.type = "sawtooth"
    s1.frequency.value = base
    s1.detune.value = -7
    const s2 = ctx.createOscillator()
    s2.type = "sawtooth"
    s2.frequency.value = base * 1.5
    s2.detune.value = 7
    s1.connect(exp)
    s2.connect(exp)
    ;[sq, s1, s2].forEach((o) => o.start())

    this.seam = { g, logic, exp, oscs: [sq, s1, s2] }
    this.seamMove(experience)
  }

  seamMove(experience: number) {
    if (!this.seam || !this.ctx) return
    const e = Math.max(0, Math.min(1, experience))
    const t = this.ctx.currentTime
    this.seam.logic.gain.setTargetAtTime(0.016 * (1 - e), t, 0.03)
    this.seam.exp.gain.setTargetAtTime(0.011 * e, t, 0.03)
  }

  seamEnd() {
    const s = this.seam
    if (!s || !this.ctx) return
    const t = this.ctx.currentTime
    s.g.gain.setTargetAtTime(0.0001, t, 0.08)
    s.oscs.forEach((o) => o.stop(t + 0.5))
    this.seam = null
  }
}

/** The one engine. Import `sfx` anywhere and call a cue. */
export const sfx = new SoundEngine()
