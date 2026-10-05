import { AppShell, Avatar, Btn, H, Label, SANS, SERIF } from "@/components/case/hirello/ui"

// Platform screens — the dashboard row, the Toolbox mega-menu and the agent
// tasks popup, re-drawn from the shipped components at product pixels.

// ── Dashboard: Your Network → Opportunity Pipeline ──────────────────────────

const STAGES = [
  { t: "Leadgen", n: 9, line: "Run a campaign to find leads", c: H.stage.lead, v: 0.55 },
  { t: "Cold Leads", n: 14, line: "4 waiting on a first reply", c: "#1F6BEF", v: 0.8 },
  { t: "Engaged", n: 5, line: "2 replies to review", c: "#F59E0B", v: 0.35 },
  { t: "Interview", n: 1, line: "Thu 10:30 · Stripe", c: "#22C55E", v: 0.12 },
]

export function YourNetworkCard() {
  return (
    <div
      className="relative flex h-[192px] w-[245px] flex-shrink-0 flex-col overflow-hidden rounded-[16px] p-5 text-white"
      style={{ background: "linear-gradient(150deg, #3B4CC0 0%, #2A3595 100%)", fontFamily: SANS }}
    >
      <span aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#7C8CFF] opacity-30 blur-2xl" />
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] opacity-75">Your network</span>
      <span className="mt-1 text-[44px] leading-none" style={{ fontFamily: SERIF }}>
        412
      </span>
      <span className="mt-1 text-[12px] opacity-80">contacts across 8 groups</span>
      <span className="mt-3 flex gap-1.5 text-[11px]">
        <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7FB2FF]" /> 128 reached
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_0_3px_rgba(74,222,128,0.25)]" /> 23 replied
        </span>
      </span>
      <span className="mt-auto flex items-center justify-between text-[12px]">
        <span className="rounded-full bg-white px-3 py-1 font-medium text-[#2A3595]">Networking Hub →</span>
        <span className="rounded-full border border-dashed border-white/50 px-2.5 py-1">Import</span>
      </span>
    </div>
  )
}

export function PipelineBubble() {
  return (
    <div className="flex-1 rounded-[18px] border bg-white p-4" style={{ borderColor: H.border, fontFamily: SANS }}>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-[15px] font-semibold" style={{ color: H.ink }}>
          Opportunity Pipeline
        </span>
        <span className="rounded-full px-3 py-1 text-[12px] font-medium" style={{ background: H.soft, color: H.primary }}>
          Open pipeline →
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {STAGES.map((s) => (
          <div key={s.t} className="rounded-[12px] px-3.5 py-3" style={{ background: `color-mix(in oklab, ${s.c} 8%, white)` }}>
            <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: H.muted }}>
              <span className="h-2 w-2 rounded-full" style={{ background: s.c }} />
              {s.t}
            </span>
            <span className="mt-1 block text-[34px] leading-none" style={{ fontFamily: SERIF, color: H.ink }}>
              {s.n}
            </span>
            <span className="mt-1.5 block h-[30px] text-[11.5px] leading-[1.3]" style={{ color: H.muted }}>
              {s.line}
            </span>
            <span className="mt-1 block h-[5px] overflow-hidden rounded-full bg-white">
              <span className="block h-full rounded-full" style={{ width: `${s.v * 100}%`, background: s.c }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardRow() {
  return (
    <AppShell>
      <p className="text-[13px]" style={{ color: H.faint }}>
        Good morning, Alex
      </p>
      <h3 className="mt-1 text-[30px] tracking-[-0.02em]" style={{ fontFamily: SERIF, color: H.ink }}>
        Here&apos;s where your search stands.
      </h3>
      <div className="mt-5 grid grid-cols-[1fr_300px] gap-5">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <YourNetworkCard />
            <span className="flex gap-1.5" aria-hidden>
              {[0.35, 0.6, 0.9].map((o, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: H.primary, opacity: o }} />
              ))}
              <span className="-mt-[5px] text-[13px]" style={{ color: H.primary }}>
                →
              </span>
            </span>
            <PipelineBubble />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-[16px] border bg-white p-5" style={{ borderColor: H.border }}>
              <Label>Hiro</Label>
              <p className="mt-2 text-[15px] leading-[1.5]" style={{ color: H.ink }}>
                Priya replied to your coffee-chat note. Want a warm reply drafted for Thursday?
              </p>
              <div className="mt-4 flex gap-2">
                <Btn>Draft reply</Btn>
                <Btn kind="ghost">Later</Btn>
              </div>
            </div>
            <div className="rounded-[16px] border bg-white p-5" style={{ borderColor: H.border }}>
              <Label>This week</Label>
              {[
                ["Coffee chat · Priya Nair", "Thu 10:30"],
                ["Interview Gym · STAR drill", "15 min"],
                ["Follow up · Marcus Lee", "Due Fri"],
              ].map(([a, b]) => (
                <div key={a} className="mt-3 flex justify-between text-[13.5px]">
                  <span style={{ color: H.ink }}>{a}</span>
                  <span style={{ color: H.muted }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-[16px] p-5 text-white" style={{ background: "linear-gradient(140deg,#3D5AFE,#6A7DFF)" }}>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] opacity-80">Goal</span>
            <p className="mt-2 text-[24px] leading-[1.15]" style={{ fontFamily: SERIF }}>
              Senior Product Designer
            </p>
            <p className="mt-1.5 text-[12.5px] opacity-85">Remote · US · $150–175k</p>
          </div>
          <div className="rounded-[16px] border bg-white p-5" style={{ borderColor: H.border }}>
            <Label>Chance of getting the job</Label>
            <svg viewBox="0 0 120 104" className="mx-auto mt-3 h-[120px]" aria-hidden>
              {[1, 0.66, 0.33].map((k) => (
                <polygon
                  key={k}
                  points={[0, 1, 2, 3, 4, 5].map((i) => `${60 + Math.sin((i * Math.PI) / 3) * 50 * k},${52 - Math.cos((i * Math.PI) / 3) * 50 * k}`).join(" ")}
                  fill="none"
                  stroke={H.border}
                />
              ))}
              <polygon
                points={[0.8, 0.6, 0.7, 0.45, 0.75, 0.55].map((v, i) => `${60 + Math.sin((i * Math.PI) / 3) * 50 * v},${52 - Math.cos((i * Math.PI) / 3) * 50 * v}`).join(" ")}
                fill="rgba(59,91,255,0.15)"
                stroke={H.primary}
                strokeWidth={1.5}
              />
            </svg>
            <p className="mt-2 text-center text-[12px]" style={{ color: H.muted }}>
              Keep working your list to raise your chances with Hiro.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ── Toolbox mega-menu ───────────────────────────────────────────────────────

const TOOLS = [
  {
    col: "Grow your network",
    items: [
      ["Networking Hub", "Campaigns, replies and meetings", "#3B5BFF", "#ECEEFF", true],
      ["Contact sources", "Google, iCloud, LinkedIn", "#0A66C2", "#E6F1FB", false],
      ["LinkedIn Labs", "A profile recruiters stop on", "#7C5CFF", "#F0ECFF", false],
      ["Elevator Pitch", "Your story in 30 seconds", "#E5A02E", "#FFF4E0", false],
    ],
  },
  {
    col: "Sharpen your application",
    items: [
      ["Resume Optimizer", "Tailored to the role", "#10A37F", "#E7F7F1", false],
      ["Cover Letter Generator", "A first draft in your voice", "#C026D3", "#FBEAFD", false],
      ["Skill Gap Analyzer", "What stands between you and the job", "#DC5B4A", "#FDECEA", false],
    ],
  },
  {
    col: "Prepare & navigate",
    items: [
      ["Interview Gym", "Practice with diagnostic feedback", "#3B82F6", "#E8F1FE", false],
      ["Career GPS", "Is this job worth it?", "#7C3AED", "#F1EAFE", false],
    ],
  },
] as const

export function ToolboxMegaMenu() {
  return (
    <div className="h-full w-full p-6" style={{ background: H.bg, fontFamily: SANS, color: H.ink }}>
      <div className="flex justify-center">
        <span className="flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium text-white" style={{ background: H.grad }}>
          <span className="grid grid-cols-2 gap-[2px]">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-[5px] w-[5px] rounded-[1px] bg-white" />
            ))}
          </span>
          Toolbox
          <span className="rounded-full bg-white/25 px-1.5 text-[11px]">9 tools</span>
          <span className="rotate-180 text-[10px]">▾</span>
        </span>
      </div>
      <div className="mx-auto mt-3 w-[900px] overflow-hidden rounded-[18px] border bg-white shadow-[0_30px_70px_-25px_rgba(23,24,38,0.35)]" style={{ borderColor: H.border }}>
        <div className="h-[3px]" style={{ background: H.grad }} />
        <div className="grid grid-cols-3 gap-6 p-6">
          {TOOLS.map((c) => (
            <div key={c.col}>
              <Label>{c.col}</Label>
              <div className="mt-3 space-y-1">
                {c.items.map(([name, desc, fg, bg, current]) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 rounded-[12px] px-2.5 py-2.5"
                    style={current ? { background: H.soft } : undefined}
                  >
                    <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-[12px]" style={{ background: bg }}>
                      <span className="h-4 w-4 rounded-[5px]" style={{ background: fg }} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-[14px] font-semibold">
                        {name}
                        {name === "Career GPS" && (
                          <span className="rounded-full px-1.5 py-px text-[10px] font-semibold text-white" style={{ background: H.grad }}>
                            New
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-[12.5px]" style={{ color: H.muted }}>
                        {desc}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t px-6 py-3.5 text-[13px]" style={{ borderColor: H.border, background: "#FAFAFC" }}>
          <span style={{ color: H.muted }}>Not sure where to start?</span>
          <span className="font-medium" style={{ color: H.primary }}>
            Ask Hiro to pick a tool →
          </span>
        </div>
      </div>
    </div>
  )
}

/** v1's Toolbox — a plain list of links (the "before"). */
export function ToolboxV1() {
  return (
    <div className="h-full w-full p-6" style={{ background: H.bg, fontFamily: SANS }}>
      <div className="flex justify-center">
        <span className="rounded-full px-4 py-2 text-[14px]" style={{ color: H.muted }}>
          Toolbox ▾
        </span>
      </div>
      <div className="mx-auto mt-3 w-[300px] rounded-[12px] border bg-white py-2 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)]" style={{ borderColor: H.border }}>
        {["Networking Wizard", "LinkedIn Labs", "Elevator Pitch", "Resume Optimizer", "Cover Letter Generator", "Skill Gap Analyzer", "Interview Gym", "Career GPS"].map((t) => (
          <p key={t} className="px-4 py-2.5 text-[14px]" style={{ color: H.ink }}>
            {t}
          </p>
        ))}
      </div>
    </div>
  )
}

// ── Agent tasks popup ───────────────────────────────────────────────────────

export function AgentTasksPopup() {
  const rows = [
    { t: "Upload your résumé", m: "Setup · 2 mins", kind: "action", c: "#EC4899", bg: "#FDECF4", done: false },
    { t: "STAR answers in four minutes", m: "Video · 4 mins", kind: "video", c: "#7C5CFF", bg: "#F0ECFF", done: false },
    { t: "Questions to ask your interviewer", m: "Article · 6 mins", kind: "article", c: "#E5A02E", bg: "#FFF4E0", done: false },
    { t: "Connect LinkedIn", m: "Done automatically", kind: "action", c: "#10A37F", bg: "#E7F7F1", done: true },
  ]
  return (
    <div className="grid h-full w-full place-items-center p-8" style={{ background: "rgba(23,24,38,0.55)", fontFamily: SANS, color: H.ink }}>
      <div className="w-[540px] overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)]">
        <div className="relative px-7 pb-6 pt-6 text-white" style={{ background: H.accent }}>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11.5px] font-semibold">3 left</span>
            <span className="text-[18px] opacity-80">×</span>
          </div>
          <div className="mt-5 flex items-center justify-center gap-3" aria-hidden>
            <Avatar name="Alex Rivera" size={44} i={3} />
            <span className="text-[22px]">✦</span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-[16px] font-bold" style={{ color: "#C026D3" }}>
              H
            </span>
          </div>
          <div className="mt-5 flex justify-center gap-1.5" aria-hidden>
            {[1, 0, 0, 0].map((d, i) => (
              <span key={i} className="h-1.5 rounded-full bg-white" style={{ width: d ? 18 : 6, opacity: d ? 1 : 0.5 }} />
            ))}
          </div>
        </div>
        <div className="px-7 pb-7 pt-6">
          <h4 className="text-[24px] leading-[1.15] tracking-[-0.01em]" style={{ fontFamily: SERIF }}>
            3 steps unlock your Interview Gym
          </h4>
          <p className="mt-1.5 text-[13.5px]" style={{ color: H.muted }}>
            Picked for this agent. Finish a course and you land right back here.
          </p>
          <div className="mt-5 space-y-2">
            {rows.map((r) => (
              <div key={r.t} className="flex items-center gap-3.5 rounded-[14px] border px-3.5 py-3" style={{ borderColor: H.border, opacity: r.done ? 0.5 : 1 }}>
                <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-[12px]" style={{ background: r.bg }}>
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: r.c }} />
                </span>
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold" style={r.done ? { textDecoration: "line-through" } : undefined}>
                    {r.t}
                  </span>
                  <span className="block text-[12px]" style={{ color: H.muted }}>
                    {r.m}
                  </span>
                </span>
                {r.done ? (
                  <span className="text-[13px] font-semibold" style={{ color: "#10A37F" }}>
                    ✓
                  </span>
                ) : (
                  <span className="rounded-full px-4 py-1.5 text-[12.5px] font-semibold text-white" style={{ background: H.accent }}>
                    Start
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Prompt chips under an agent's chat box (team work, shown for context). */
export function AgentChips() {
  return (
    <div className="h-full w-full p-6" style={{ background: H.bg, fontFamily: SANS, color: H.ink }}>
      <div className="rounded-[16px] border bg-white p-4" style={{ borderColor: H.border }}>
        <div className="rounded-[12px] border px-4 py-3 text-[14px]" style={{ borderColor: H.border, color: H.faint }}>
          Ask Hiro anything about your interview…
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["I have an interview next week", "Drill me on STAR answers", "What should I ask them?", "Review my last answer"].map((c) => (
            <span key={c} className="rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium" style={{ borderColor: H.primary, color: H.primary }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
