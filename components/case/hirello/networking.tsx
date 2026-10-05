import { AppShell, Avatar, Bar, Btn, Card, Crumbs, H, Label, Pill, SERIF, Steps, Title } from "@/components/case/hirello/ui"

// Networking Hub screens — re-drawn from the shipped module, at 1280×800.

// ── Hub (the command center) ─────────────────────────────────────────────────

const CAMPAIGNS = [
  { name: "Coffee chats · Alumni", status: "Running", color: H.stage.interview, sent: 18, total: 40, replies: 4, next: "Step 2 sends Thu" },
  { name: "Recruiter outreach", status: "Paused", color: H.stage.engaged, sent: 9, total: 25, replies: 2, next: "Paused while editing" },
  { name: "Dream companies", status: "Draft", color: H.faint, sent: 0, total: 12, replies: 0, next: "Pick a template to start" },
]

export function HubDashboard() {
  return (
    <AppShell>
      <Crumbs items={["Dashboard", "Networking Hub"]} />
      <div
        className="mt-4 flex items-end justify-between overflow-hidden rounded-[18px] px-9 py-8 text-white"
        style={{ background: H.grad }}
      >
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] opacity-80">Networking Hub</p>
          <h3 className="mt-2 text-[40px] leading-[1.05] tracking-[-0.02em]" style={{ fontFamily: SERIF }}>
            Your network, working for you.
          </h3>
          <p className="mt-2 text-[14px] opacity-85">3 campaigns · 2 replies waiting on you</p>
          <div className="mt-5 flex gap-2.5">
            <Btn kind="white">+ Start new campaign</Btn>
            <span className="inline-flex items-center rounded-full border border-white/40 px-4 py-[8px] text-[13px] font-medium">Add sources</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {[
            ["128", "Contacted"],
            ["412", "Contacts added"],
            ["23", "Replied"],
            ["6", "Meetings booked"],
          ].map(([v, l]) => (
            <div key={l} className="w-[118px] rounded-[14px] bg-white/[0.13] px-4 py-3.5 backdrop-blur">
              <p className="text-[32px] leading-none" style={{ fontFamily: SERIF }}>
                {v}
              </p>
              <p className="mt-1.5 text-[11.5px] opacity-85">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[1.75fr_1fr] gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-[17px] font-semibold">Campaigns</h4>
            <div className="flex gap-1 text-[12.5px]">
              {["All", "Running", "Paused", "Completed", "Draft"].map((t, i) => (
                <span key={t} className="rounded-full px-3 py-1" style={i === 0 ? { background: H.soft, color: H.primary, fontWeight: 500 } : { color: H.muted }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            {CAMPAIGNS.map((c) => (
              <div key={c.name} className="grid grid-cols-[1.4fr_1fr_90px] items-center gap-5 rounded-[12px] border px-4 py-3.5" style={{ borderColor: H.border }}>
                <div>
                  <p className="text-[14.5px] font-semibold">{c.name}</p>
                  <p className="mt-0.5 text-[12px]" style={{ color: H.muted }}>
                    {c.next}
                  </p>
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between text-[11.5px]" style={{ color: H.muted }}>
                    <span>
                      {c.sent}/{c.total} sent
                    </span>
                    <span>{c.replies} replies</span>
                  </div>
                  <Bar value={c.sent / c.total} color={c.color} />
                </div>
                <span className="justify-self-end">
                  <Pill color={c.color}>● {c.status}</Pill>
                </span>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-[15px] font-semibold">Upcoming meetings</h4>
              <span className="text-[12px]" style={{ color: H.primary }}>
                View all
              </span>
            </div>
            {[
              ["Priya Nair", "Thu · 10:30 · Coffee chat"],
              ["Marcus Lee", "Mon · 16:00 · Referral call"],
            ].map(([n, t], i) => (
              <div key={n} className="mt-3.5 flex items-center gap-3">
                <Avatar name={n} i={i} size={34} />
                <div>
                  <p className="text-[13.5px] font-medium">{n}</p>
                  <p className="text-[12px]" style={{ color: H.muted }}>
                    {t}
                  </p>
                </div>
              </div>
            ))}
          </Card>
          <Card className="p-5">
            <h4 className="text-[15px] font-semibold">Sending health</h4>
            <div className="mt-3 flex items-baseline justify-between text-[12.5px]" style={{ color: H.muted }}>
              <span>Today&apos;s Gmail quota</span>
              <span>
                <b style={{ color: H.ink, fontFamily: SERIF, fontSize: 18 }}>18</b> / 50
              </span>
            </div>
            <div className="mt-2">
              <Bar value={18 / 50} color={H.stage.interview} />
            </div>
            <p className="mt-2.5 text-[12px]" style={{ color: H.muted }}>
              Caps reset at midnight. Nothing sends past them.
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

// ── Import ───────────────────────────────────────────────────────────────────

function SourceLogo({ kind }: { kind: "google" | "icloud" | "linkedin" }) {
  if (kind === "linkedin")
    return (
      <span className="grid h-14 w-14 place-items-center rounded-[14px] text-[24px] font-bold text-white" style={{ background: H.linkedin }}>
        in
      </span>
    )
  if (kind === "icloud")
    return (
      <span className="grid h-14 w-14 place-items-center rounded-[14px] bg-gradient-to-b from-[#5AC8FA] to-[#007AFF]">
        <span className="h-5 w-8 rounded-full bg-white" />
      </span>
    )
  return (
    <span className="grid h-14 w-14 place-items-center rounded-[14px] border bg-white text-[26px] font-bold" style={{ borderColor: H.border }}>
      <span style={{ background: "conic-gradient(#EA4335 0 25%,#FBBC05 0 50%,#34A853 0 75%,#4285F4 0)", WebkitBackgroundClip: "text", color: "transparent" }}>G</span>
    </span>
  )
}

export function ImportSources() {
  const sources = [
    { kind: "google" as const, name: "Google Contacts", note: "Names and email addresses", hover: false },
    { kind: "icloud" as const, name: "iCloud Contacts", note: "Your phone's address book", hover: false },
    { kind: "linkedin" as const, name: "LinkedIn Connections", note: "Names, roles and companies", hover: true },
  ]
  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <Crumbs items={["Dashboard", "Networking Hub", "Import"]} />
        <Steps at={0} />
      </div>
      <div className="mx-auto mt-12 max-w-[980px] text-center">
        <h3 className="text-[40px] leading-[1.1] tracking-[-0.02em]" style={{ fontFamily: SERIF }}>
          Import your network
        </h3>
        <p className="mt-2 text-[15px]" style={{ color: H.muted }}>
          Bring in the people you already know. You choose who hears from you, always.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-5">
          {sources.map((s) => (
            <div
              key={s.name}
              className="flex flex-col items-center rounded-[18px] border bg-white px-6 pb-7 pt-9"
              style={
                s.hover
                  ? { borderColor: H.primary, boxShadow: "0 24px 50px -20px rgba(59,91,255,0.35)", transform: "translateY(-4px)" }
                  : { borderColor: H.border }
              }
            >
              <SourceLogo kind={s.kind} />
              <p className="mt-5 text-[17px] font-semibold">{s.name}</p>
              <p className="mt-1 text-[13px]" style={{ color: H.muted }}>
                {s.note}
              </p>
              <span className="mt-6">
                {s.hover ? <Btn>Connect LinkedIn</Btn> : <Pill color={H.muted} bg="#F3F4F8">Connect</Pill>}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[13.5px]" style={{ color: H.muted }}>
          or{" "}
          <span className="underline underline-offset-4" style={{ color: H.primary }}>
            upload a Connections.csv
          </span>{" "}
          · LinkedIn shares no email addresses, so Google or a CSV fills them in
        </p>
        <Card className="mx-auto mt-9 flex max-w-[720px] items-center justify-between px-5 py-4 text-left">
          <span className="flex items-center gap-3.5">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] text-[13px] font-bold text-white" style={{ background: H.linkedin }}>
              in
            </span>
            <span>
              <span className="block text-[14px] font-semibold">Last import · LinkedIn</span>
              <span className="block text-[12.5px]" style={{ color: H.muted }}>
                312 connections · 2 days ago · 96 still need an email
              </span>
            </span>
          </span>
          <Btn kind="soft">Organize them →</Btn>
        </Card>
      </div>
    </AppShell>
  )
}

// ── Organize ────────────────────────────────────────────────────────────────

export const GROUPS = [
  { name: "Hiring managers", n: 12, c: "#3B5BFF" },
  { name: "Inner circle", n: 9, c: "#7C5CFF" },
  { name: "Alumni", n: 34, c: "#10A37F" },
  { name: "Previous coworkers", n: 27, c: "#E5A02E" },
  { name: "Previous bosses", n: 5, c: "#DC5B4A" },
  { name: "Recruiters", n: 14, c: "#0A66C2" },
  { name: "Friends & family", n: 18, c: "#C026D3" },
  { name: "Unsorted", n: 47, c: "#9A9EB2" },
]

const PEOPLE = [
  ["Priya Nair", "Design Lead · Stripe"],
  ["Marcus Lee", "Recruiter · Figma"],
  ["Elena Ruiz", "PM · Notion"],
  ["Sam Okafor", "Eng Manager · Linear"],
  ["Dana Whitfield", "UX Researcher · Airbnb"],
  ["Tom Becker", "Founder · Loop"],
  ["Aisha Khan", "Product Designer · Duolingo"],
  ["Leo Martins", "Talent Partner · Spotify"],
  ["Nina Patel", "Staff Designer · Datadog"],
]

export function OrganizeGroups() {
  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <Crumbs items={["Dashboard", "Networking Hub", "Organize"]} />
        <Steps at={1} />
      </div>
      <div className="mt-5 flex items-end justify-between">
        <Title sub="Drag people onto a group, or let Hiro sort them. 412 contacts.">Organize your network</Title>
        <div className="flex items-center gap-2">
          <span className="w-[220px] rounded-full border bg-white px-4 py-[8px] text-[13px]" style={{ borderColor: H.border, color: H.faint }}>
            Search contacts
          </span>
          <Btn kind="ghost">Select</Btn>
          <span className="inline-flex rounded-full border bg-white p-1 text-[12.5px]" style={{ borderColor: H.border }}>
            <span className="rounded-full px-3 py-1" style={{ background: H.soft, color: H.primary, fontWeight: 500 }}>
              Circles
            </span>
            <span className="px-3 py-1" style={{ color: H.muted }}>
              List
            </span>
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-[14px] px-5 py-3" style={{ background: H.soft }}>
        <span className="flex items-center gap-3 text-[13.5px]">
          <span className="grid h-7 w-7 place-items-center rounded-full text-[12px] font-semibold text-white" style={{ background: H.grad }}>
            H
          </span>
          <span>
            <b>Hiro suggests</b> sorting <b>47 unsorted contacts</b> into 6 groups
          </span>
        </span>
        <span className="flex gap-2">
          <Btn kind="ghost">Review</Btn>
          <Btn>Accept all</Btn>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[250px_1fr] gap-5">
        <Card className="p-3">
          <p className="px-2 pb-2 pt-1">
            <Label>Groups</Label>
          </p>
          {GROUPS.map((g, i) => (
            <div
              key={g.name}
              className="flex items-center justify-between rounded-[10px] px-3 py-[9px] text-[13.5px]"
              style={i === 2 ? { background: H.soft, outline: `2px dashed ${H.primary}`, outlineOffset: -2 } : undefined}
            >
              <span className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.c }} />
                {g.name}
              </span>
              <span style={{ color: H.faint }}>{i === 2 ? g.n + 1 : g.n}</span>
            </div>
          ))}
          <p className="mt-1 px-3 py-2 text-[13px]" style={{ color: H.primary }}>
            + New group
          </p>
        </Card>
        <div className="relative grid grid-cols-3 content-start gap-3">
          {PEOPLE.map(([n, r], i) => (
            <div
              key={n}
              className="flex items-center gap-3 rounded-[12px] border bg-white px-3.5 py-3"
              style={
                i === 1
                  ? { borderColor: H.border, opacity: 0.35, borderStyle: "dashed" }
                  : { borderColor: H.border }
              }
            >
              <Avatar name={n} i={i} size={36} />
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-medium">{n}</p>
                <p className="truncate text-[12px]" style={{ color: H.muted }}>
                  {r}
                </p>
              </div>
            </div>
          ))}
          {/* The card in flight — dragged toward Alumni */}
          <div
            className="absolute flex w-[270px] items-center gap-3 rounded-[12px] border bg-white px-3.5 py-3"
            style={{ left: -150, top: 88, transform: "rotate(-4deg)", borderColor: H.primary, boxShadow: "0 22px 40px -14px rgba(23,24,38,0.35)" }}
          >
            <Avatar name="Marcus Lee" i={1} size={36} />
            <div>
              <p className="text-[13.5px] font-medium">Marcus Lee</p>
              <p className="text-[12px]" style={{ color: H.muted }}>
                Recruiter · Figma
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ── Build outreach ───────────────────────────────────────────────────────────

export function BuildOutreach() {
  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <Crumbs items={["Networking Hub", "LeadGen", "Build outreach"]} />
        <Steps steps={["Select contacts", "Build sequence"]} at={1} />
      </div>
      <div className="mt-5">
        <Title sub="Alumni · 34 contacts with an email, not yet in your pipeline">Build your outreach</Title>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {[
          { t: "Manual single outreach", d: "One message, written now, sent by you.", on: false, tag: "Quick" },
          { t: "Custom automated sequence", d: "A few gentle steps over two weeks. Pauses the moment they reply.", on: true, tag: "Recommended" },
        ].map((m) => (
          <div
            key={m.t}
            className="rounded-[16px] border bg-white p-5"
            style={m.on ? { borderColor: H.primary, boxShadow: `0 0 0 3px ${H.soft}` } : { borderColor: H.border }}
          >
            <div className="flex items-center justify-between">
              <span className="grid h-5 w-5 place-items-center rounded-full border-2" style={{ borderColor: m.on ? H.primary : H.border }}>
                {m.on && <span className="h-2.5 w-2.5 rounded-full" style={{ background: H.primary }} />}
              </span>
              <Pill color={m.on ? H.primary : H.muted}>{m.tag}</Pill>
            </div>
            <p className="mt-4 text-[18px] font-semibold">{m.t}</p>
            <p className="mt-1 text-[13.5px]" style={{ color: H.muted }}>
              {m.d}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between">
        <span className="flex items-center gap-3">
          <Label>Sequence templates for</Label>
          <Pill color={H.stage.interview}>● Alumni</Pill>
        </span>
        <span className="text-[12.5px]" style={{ color: H.faint }}>
          4 hiring-manager templates hidden for this group
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-4">
        {[
          { t: "Alumni coffee chat", s: 3, d: "9 days", on: true },
          { t: "Warm reconnect", s: 2, d: "5 days", on: false },
          { t: "Referral ask", s: 4, d: "14 days", on: false },
        ].map((t) => (
          <Card key={t.t} className="p-5" style={t.on ? { borderColor: H.primary } : undefined}>
            <p className="text-[15.5px] font-semibold">{t.t}</p>
            <p className="mt-1 text-[12.5px]" style={{ color: H.muted }}>
              {t.s} steps · over {t.d}
            </p>
            <div className="mt-5 flex items-center">
              {Array.from({ length: t.s }, (_, i) => (
                <span key={i} className="flex items-center">
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold"
                    style={i === 0 ? { background: H.grad, color: "#fff" } : { background: H.soft, color: H.primary }}
                  >
                    {i + 1}
                  </span>
                  {i < t.s - 1 && <span className="h-[2px] w-9" style={{ background: H.border }} />}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[12.5px]" style={{ color: t.on ? H.primary : H.faint }}>
              {t.on ? "Selected · Customize steps →" : "Preview"}
            </p>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}

// ── Sequence editor ─────────────────────────────────────────────────────────

const STEPS = [
  { kind: "Connection request", ch: "LinkedIn", day: 0, count: "212 / 300", state: "sent" },
  { kind: "Message", ch: "LinkedIn", day: 3, count: "486 / 8,000", state: "editing" },
  { kind: "Email", ch: "Gmail", day: 7, count: "Subject + body", state: "queued" },
  { kind: "InMail", ch: "LinkedIn", day: 12, count: "0 / 1,900", state: "queued" },
]

export function SequenceEditor() {
  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <Crumbs items={["Networking Hub", "Coffee chats · Alumni", "Sequence"]} />
        <span className="text-[12.5px]" style={{ color: H.muted }}>
          18 of 40 contacted
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-[14px] border px-5 py-3" style={{ background: "#FFF8EC", borderColor: "#F6DFB1" }}>
        <span className="text-[13.5px]" style={{ color: "#8A5A08" }}>
          <b>Paused while editing.</b> Nothing sends until you resume, so a half-edited step can never go out.
        </span>
        <Btn>Resume campaign</Btn>
      </div>
      <div className="mt-5 grid grid-cols-[1.35fr_1fr] gap-5">
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <Card
              key={s.kind}
              className="flex items-center gap-4 p-4"
              style={s.state === "editing" ? { borderColor: H.primary, boxShadow: `0 0 0 3px ${H.soft}` } : s.state === "sent" ? { background: "#FAFAFC" } : undefined}
            >
              <span
                className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full text-[13px] font-semibold"
                style={s.state === "sent" ? { background: "#E7F7F1", color: H.stage.interview } : { background: H.soft, color: H.primary }}
              >
                {s.state === "sent" ? "✓" : i + 1}
              </span>
              <div className="flex-1">
                <p className="text-[14.5px] font-semibold">
                  {s.kind} <span className="font-normal" style={{ color: H.muted }}>· {s.ch}</span>
                </p>
                <p className="text-[12.5px]" style={{ color: H.muted }}>
                  Day {s.day} · {s.count}
                </p>
              </div>
              {s.state === "sent" ? (
                <Pill color={H.muted} bg="#EEF0F6">🔒 Sent · locked</Pill>
              ) : s.state === "editing" ? (
                <Pill>Editing</Pill>
              ) : (
                <span className="text-[12.5px]" style={{ color: H.faint }}>
                  Queued
                </span>
              )}
            </Card>
          ))}
          <p className="pl-1 text-[13px]" style={{ color: H.primary }}>
            + Add step
          </p>
        </div>
        <Card className="p-5">
          <Label>Timeline</Label>
          <div className="relative mt-5 pl-6">
            <span className="absolute bottom-3 left-[7px] top-1 w-[2px]" style={{ background: H.border }} />
            {STEPS.map((s, i) => (
              <div key={s.kind} className="relative mb-5 last:mb-0">
                <span
                  className="absolute -left-6 top-0.5 h-4 w-4 rounded-full border-[3px] bg-white"
                  style={{ borderColor: s.state === "sent" ? H.stage.interview : i === 1 ? H.primary : H.border }}
                />
                <p className="text-[13.5px] font-medium">Day {s.day}</p>
                <p className="text-[12.5px]" style={{ color: H.muted }}>
                  {s.kind}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[12px] p-4" style={{ background: H.bg }}>
            <p className="text-[12px]" style={{ color: H.muted }}>
              Preview · step 2
            </p>
            <p className="mt-1.5 text-[13px] leading-[1.55]">
              Hi <span className="rounded px-1" style={{ background: H.soft, color: H.primary }}>{"{{first_name}}"}</span>, fellow alum here. I loved your
              talk on design ops at <span className="rounded px-1" style={{ background: H.soft, color: H.primary }}>{"{{company}}"}</span>…
            </p>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

// ── Replies / Pipeline / Targets — the tracking half ─────────────────────────

export function RepliesInbox() {
  const list = [
    ["Priya Nair", "Happy to chat! Thursday works…", true],
    ["Marcus Lee", "Thanks for reaching out, can you share…", true],
    ["Elena Ruiz", "Not hiring right now, but…", false],
    ["Sam Okafor", "Let me loop in our recruiter", false],
  ] as const
  return (
    <AppShell>
      <Title sub="2 need a reply. Handled ones leave the tray.">Replies to act on</Title>
      <div className="mt-5 grid h-[560px] grid-cols-[330px_1fr] overflow-hidden rounded-[16px] border bg-white" style={{ borderColor: H.border }}>
        <div className="border-r" style={{ borderColor: H.border }}>
          {list.map(([n, m, unread], i) => (
            <div key={n} className="flex gap-3 border-b px-4 py-4" style={{ borderColor: H.border, background: i === 0 ? H.soft : undefined }}>
              <Avatar name={n} i={i} size={36} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center justify-between text-[13.5px] font-semibold">
                  {n}
                  {unread && <span className="h-2 w-2 rounded-full" style={{ background: H.primary }} />}
                </p>
                <p className="truncate text-[12.5px]" style={{ color: H.muted }}>
                  {m}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col p-6">
          <p className="text-[15px] font-semibold">Priya Nair · Design Lead, Stripe</p>
          <div className="mt-4 max-w-[520px] rounded-[14px] rounded-tl-[4px] px-4 py-3 text-[13.5px] leading-[1.55]" style={{ background: H.bg }}>
            Happy to chat! Thursday works for me. What would you like to cover?
          </div>
          <div className="mt-auto rounded-[14px] border p-4" style={{ borderColor: H.border }}>
            <div className="flex items-center justify-between">
              <Label>Suggested reply</Label>
              <span className="flex gap-1.5">
                {["Warm", "Brief", "Formal"].map((t, i) => (
                  <Pill key={t} color={i === 0 ? H.primary : H.muted} bg={i === 0 ? H.soft : "#F3F4F8"}>
                    {t}
                  </Pill>
                ))}
              </span>
            </div>
            <p className="mt-3 text-[13.5px] leading-[1.55]">
              Thank you, Priya! Thursday at 10:30 is perfect. I&apos;d love to hear how your team runs design crits, and any advice for someone moving into
              design systems.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Btn kind="ghost">Edit</Btn>
              <Btn>Send reply</Btn>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export function PipelineBoard() {
  const cols = [
    { t: "LeadGen", c: H.stage.lead, items: [["Linear", "Sam Okafor"], ["Loop", "Tom Becker"], ["Datadog", "Nina Patel"]] },
    { t: "Cold", c: H.stage.cold, items: [["Spotify", "Leo Martins"], ["Notion", "Elena Ruiz"]] },
    { t: "Engaged", c: H.stage.engaged, items: [["Figma", "Marcus Lee"], ["Airbnb", "Dana Whitfield"]] },
    { t: "Interview", c: H.stage.interview, items: [["Stripe", "Priya Nair"]] },
  ]
  return (
    <AppShell>
      <Title sub="Everyone you've messaged, by how warm the conversation is.">Opportunity Pipeline</Title>
      <div className="mt-6 grid grid-cols-4 gap-4">
        {cols.map((col) => (
          <div key={col.t} className="rounded-[16px] p-3" style={{ background: `color-mix(in oklab, ${col.c} 7%, white)` }}>
            <div className="flex items-center justify-between px-1.5 pb-3 pt-1">
              <span className="flex items-center gap-2 text-[14px] font-semibold">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: col.c }} />
                {col.t}
              </span>
              <span className="text-[22px]" style={{ fontFamily: SERIF, color: col.c }}>
                {col.items.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {col.items.map(([co, n], i) => (
                <Card key={co} className="p-3.5">
                  <p className="text-[14px] font-semibold">{co}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar name={n} i={i + col.t.length} size={24} />
                    <span className="text-[12.5px]" style={{ color: H.muted }}>
                      {n}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}

export function TargetCompanies() {
  const rows = [
    { co: "Stripe", d: 3, a: 6, f: 4, v: "Strong", c: H.stage.interview },
    { co: "Figma", d: 1, a: 5, f: 3, v: "Warming", c: H.stage.engaged },
    { co: "Notion", d: 1, a: 2, f: 1, v: "Warming", c: H.stage.engaged },
    { co: "Duolingo", d: 0, a: 1, f: 1, v: "Weak, build first", c: H.error },
  ]
  return (
    <AppShell>
      <Title sub="Strength = direct × 3 + alumni × 1.5 + through friends">Target companies</Title>
      <Card className="mt-6 overflow-hidden">
        {rows.map((r, i) => {
          const s = r.d * 3 + r.a * 1.5 + r.f
          return (
            <div key={r.co} className="grid grid-cols-[180px_1fr_200px_170px] items-center gap-6 border-b px-6 py-5 last:border-0" style={{ borderColor: H.border }}>
              <span className="flex items-center gap-3 text-[15px] font-semibold">
                <span className="grid h-9 w-9 place-items-center rounded-[10px] text-[13px] font-bold" style={{ background: H.soft, color: H.primary }}>
                  {r.co[0]}
                </span>
                {r.co}
              </span>
              <div>
                <Bar value={Math.min(1, s / 22)} color={r.c} h={8} />
              </div>
              <span className="text-[12.5px]" style={{ color: H.muted }}>
                {r.d} direct · {r.a} alumni · {r.f} via friends
              </span>
              <span className="justify-self-end">
                <Pill color={r.c}>{r.v}</Pill>
              </span>
              {i === 0 && null}
            </div>
          )
        })}
      </Card>
      <p className="mt-4 text-[13px]" style={{ color: H.muted }}>
        Open a company to see every path in, warmest first.
      </p>
    </AppShell>
  )
}

/** v1's four tiers, re-drawn in v1's own style — the "before" for Organize. */
export function TiersV1() {
  const tiers = [
    { t: "Inner Circle", bar: "linear-gradient(90deg,#4F8BFF,#6A5CFF)", people: ["Priya Nair", "Marcus Lee", "Elena Ruiz"] },
    { t: "Close Network", bar: "linear-gradient(90deg,#F6A13A,#E94B5A)", people: ["Sam Okafor", "Dana Whitfield"] },
    { t: "Specialty Recruiting Firms", bar: "linear-gradient(90deg,#B04BF0,#E040A0)", people: ["Leo Martins", "Aisha Khan", "Tom Becker"] },
    { t: "Previous Co-Workers", bar: "linear-gradient(90deg,#7ED67E,#4FC3C8)", people: ["Nina Patel", "Ravi Shah"] },
  ]
  return (
    <AppShell>
      <div className="grid h-full grid-cols-[300px_1fr] gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            <p className="flex items-center gap-1.5 text-[12px]" style={{ color: H.muted }}>
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" /> Ready
            </p>
            <div className="mt-3 flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-[16px] bg-[#1F2433] text-[22px]">🤖</span>
              <span className="flex items-center gap-[3px]">
                {[6, 10, 16, 24, 16, 10, 6, 10, 6].map((h, i) => (
                  <span key={i} className="w-[4px] rounded-full bg-[#3B9BFF]" style={{ height: h }} />
                ))}
              </span>
            </div>
          </Card>
          <Card className="p-4 text-[13px]" style={{ color: H.muted }}>
            “Let me show you what I can do for you…”
          </Card>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[22px] font-semibold">My Contacts</p>
            <span className="rounded-[8px] px-3.5 py-2 text-[13px] font-medium text-white" style={{ background: "linear-gradient(90deg,#B04BF0,#E040A0)" }}>
              + Add New Contact
            </span>
          </div>
          <p className="mt-1 text-[13px]" style={{ color: H.muted }}>
            Assign every contact a tier and fill in the form for each.
          </p>
          <div className="mt-5 grid grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <div key={tier.t} className="overflow-hidden rounded-[12px] border bg-white shadow-[0_8px_20px_-14px_rgba(0,0,0,0.25)]" style={{ borderColor: H.border }}>
                <div className="h-[6px]" style={{ background: tier.bar }} />
                <div className="p-4">
                  <p className="text-[14.5px] font-medium">{tier.t}</p>
                  {tier.people.map((n, k) => (
                    <div key={n} className="mt-3 rounded-[10px] border px-3 py-2.5" style={{ borderColor: H.border }}>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={n} i={k} size={28} />
                        <span className="text-[13px]">{n}</span>
                      </div>
                      <p className="mt-2 text-[11.5px]" style={{ color: H.faint }}>
                        Status: Not Contacted
                      </p>
                      <span className="mt-2 flex gap-1">
                        <span className="rounded-full bg-[#ECEEFF] px-2 py-0.5 text-[10.5px] text-[#4F6BFF]">Tag1</span>
                        <span className="rounded-full bg-[#FFEFE3] px-2 py-0.5 text-[10.5px] text-[#E8833A]">Tag2</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
