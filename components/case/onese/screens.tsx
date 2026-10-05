import { DateHero, DayTile, moment, Pin, PillBtn, RecordRing, S, Screen, StatusBar, TabBar, TealHeader } from "@/components/case/onese/ui"

// 1 Second Everyday screens at 390×844. "Audit" screens re-draw the shipped
// app (with numbered pins matching the findings); the rest are the redesign,
// re-built from the Figma file.

const DOW = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

// ─────────────────────────────────────────────────────────────────────────────
// TRACK A · DAY SCREEN
// ─────────────────────────────────────────────────────────────────────────────

export function AuditProjectGrid() {
  return (
    <Screen>
      <TealHeader
        title="My 1SE ⌄"
        right={
          <span className="flex items-center gap-1 rounded-full bg-[#2a2a2a] p-1">
            <span className="h-[30px] w-[30px] rounded-full" />
            <span className="grid h-[30px] w-[30px] place-items-center rounded-full" style={{ background: S.yellow }}>
              <span className="grid grid-cols-2 gap-[2px]">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-[5px] w-[5px] rounded-[1px] border border-black" />
                ))}
              </span>
            </span>
          </span>
        }
      />
      <div className="grid grid-cols-3 gap-[2px]">
        {[15, 16, 19, 21, 24, 26, 29, 30].map((n, i) => (
          <DayTile key={n} i={i} dow={DOW[(n + 2) % 7]} n={n} className="aspect-square" />
        ))}
        <div className="grid aspect-square place-items-center text-[44px] font-light" style={{ background: "#5c4500", color: "rgba(255,255,255,0.6)" }}>
          +
        </div>
      </div>
      <p className="px-6 pt-6 text-[26px] font-extrabold" style={{ color: "rgba(255,255,255,0.75)" }}>
        SEPTEMBER
      </p>
      <div className="absolute bottom-[110px] left-1/2 flex -translate-x-1/2 overflow-hidden rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <span className="px-5 py-3 text-[15px] font-bold" style={{ background: S.yellow, color: "#111" }}>
          ● Record
        </span>
        <span className="px-5 py-3 text-[15px] font-bold" style={{ background: "#fff", color: "#111" }}>
          Library
        </span>
      </div>
      <TabBar />
      <Pin n={1} x={195} y={500} />
    </Screen>
  )
}

export function AuditLibraryFirst() {
  return (
    <Screen>
      <StatusBar />
      <div className="flex items-center justify-between px-5 pb-3">
        <span className="text-[17px]">Cancel</span>
        <span className="text-[17px] font-bold">Library</span>
        <span className="h-[26px] w-[30px] rounded-[6px] border-2 border-white/80" />
      </div>
      <div className="grid grid-cols-4 gap-[2px]">
        {Array.from({ length: 28 }, (_, i) => (
          <DayTile key={i} i={i + 3} className="aspect-square" />
        ))}
      </div>
      <Pin n={2} x={348} y={92} />
    </Screen>
  )
}

export function AuditCameraLibrary() {
  return (
    <Screen bg="#000">
      <StatusBar />
      <div className="flex items-center justify-between px-5 pb-3">
        <span className="text-[17px]">×</span>
        <span className="text-[17px] font-bold">Library</span>
        <span className="w-4" />
      </div>
      <div className="mx-3 flex-1 rounded-[18px]" style={{ background: moment(6) }} />
      <div className="grid h-[170px] place-items-center">
        <span className="h-[76px] w-[76px] rounded-full border-[5px] border-white" />
      </div>
      <Pin n={3} x={195} y={86} />
    </Screen>
  )
}

export function AuditQuickFill() {
  return (
    <Screen>
      <StatusBar />
      <p className="px-6 pt-2 text-[15px]" style={{ color: S.muted }}>
        Quick Fill · August
      </p>
      <div className="mx-6 mt-24 rounded-[22px] p-7 text-center" style={{ background: S.panel }}>
        <p className="text-[58px] font-extrabold leading-none tracking-[-0.04em]">22</p>
        <p className="mt-2 text-[18px] font-bold">days will be filled</p>
        <p className="mt-3 text-[14px] leading-[1.5]" style={{ color: S.muted }}>
          We&apos;ll pick the best moments from 862 videos in your library.
        </p>
      </div>
      <div className="mt-auto px-6 pb-12">
        <PillBtn kind="yellow">Fill my days</PillBtn>
      </div>
      <Pin n={4} x={195} y={300} />
    </Screen>
  )
}

/** The redesign's hero screen: today, camera live on open. */
export function DayToday() {
  return (
    <Screen>
      <StatusBar />
      <DateHero dow="Thursday" date="September 10" sub="Day 214 of your project" />
      <div className="relative mx-5 mt-6 flex-1 overflow-hidden rounded-[30px]" style={{ background: moment(0) }}>
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[12px] font-semibold backdrop-blur">
          <span className="h-2 w-2 rounded-full" style={{ background: S.red }} /> Live
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[12px] font-semibold backdrop-blur">1s</span>
      </div>
      <div className="flex flex-col items-center pb-9 pt-5">
        <RecordRing />
        <p className="mt-1 text-[14px] font-semibold">Hold to record</p>
        <p className="mt-4 text-[15px] underline underline-offset-4" style={{ color: S.muted }}>
          Choose from library
        </p>
      </div>
    </Screen>
  )
}

export function DayAfterCapture() {
  return (
    <Screen>
      <StatusBar />
      <DateHero dow="Thursday" date="September 10" sub="Day 214 of your project" />
      <div className="relative mx-5 mt-6 flex-1 overflow-hidden rounded-[30px]" style={{ background: moment(1) }}>
        <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[12px] font-semibold backdrop-blur">1s</span>
        <div className="absolute inset-x-4 bottom-4 flex h-[44px] gap-[2px] overflow-hidden rounded-[10px] border-2" style={{ borderColor: S.yellow }}>
          {[1, 0, 3, 2, 1, 6, 4, 1].map((m, i) => (
            <span key={i} className="flex-1" style={{ background: moment(m) }} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 px-5 pt-5">
        {["Replace", "Trim", "Add note"].map((a) => (
          <span key={a} className="flex flex-col items-center gap-1.5 rounded-[16px] py-3 text-[13px] font-semibold" style={{ background: S.panel }}>
            <span className="h-5 w-5 rounded-[6px] border-2 border-white/70" />
            {a}
          </span>
        ))}
      </div>
      <div className="px-5 pb-9 pt-4">
        <PillBtn>Add to Sep 10</PillBtn>
      </div>
    </Screen>
  )
}

export function AddPastDay() {
  return (
    <Screen>
      <StatusBar />
      <DateHero dow="Monday" date="June 1, 2026" />
      <div className="mx-5 mt-6 rounded-[22px] p-5" style={{ background: S.panel }}>
        <p className="text-[16px] font-bold">Live recording is unavailable for past days.</p>
        <p className="mt-1.5 text-[14px]" style={{ color: S.muted }}>
          Choose from your library below. These are from June 1.
        </p>
      </div>
      <div className="mx-5 mt-4 grid grid-cols-3 gap-[3px] overflow-hidden rounded-[18px]">
        {[2, 4, 7, 3, 5, 0].map((m, i) => (
          <DayTile key={i} i={m} className="aspect-square" style={i === 1 ? { outline: `3px solid ${S.yellow}`, outlineOffset: -3 } : undefined} />
        ))}
      </div>
      <div className="mt-auto px-5 pb-10">
        <PillBtn>Select from library</PillBtn>
      </div>
    </Screen>
  )
}

export function AddFutureDay() {
  return (
    <Screen>
      <StatusBar />
      <DateHero dow="Saturday" date="December 19, 2026" />
      <div className="mx-5 mt-6 grid flex-1 place-items-center rounded-[30px] border border-dashed" style={{ borderColor: S.hair }}>
        <div className="px-10 text-center">
          <p className="text-[20px] font-bold">This day hasn&apos;t happened yet.</p>
          <p className="mt-2 text-[15px] leading-[1.5]" style={{ color: S.muted }}>
            Come back on December 19 to add your moment.
          </p>
        </div>
      </div>
      <p className="pb-12 pt-8 text-center text-[14px]" style={{ color: S.faint }}>
        No actions available
      </p>
    </Screen>
  )
}

/** One skeleton, six states: same header, same stage, same button zone. */
export function DayState({ state }: { state: "empty" | "filled" | "recording" | "processing" | "failed" | "denied" }) {
  const stage = {
    empty: (
      <div className="grid h-full place-items-center rounded-[30px] border border-dashed" style={{ borderColor: S.hair }}>
        <p className="text-[18px] font-semibold" style={{ color: S.muted }}>
          Tap to add today&apos;s moment
        </p>
      </div>
    ),
    filled: (
      <div className="relative h-full rounded-[30px]" style={{ background: moment(4) }}>
        <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[13px] font-semibold">1s</span>
      </div>
    ),
    recording: (
      <div className="relative h-full rounded-[30px]" style={{ background: moment(0) }}>
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[13px] font-bold">
          <span className="h-2 w-2 rounded-full" style={{ background: S.red }} /> REC 00:00
        </span>
      </div>
    ),
    processing: (
      <div className="relative grid h-full place-items-center rounded-[30px]" style={{ background: moment(4), filter: "saturate(0.4) brightness(0.6)" }}>
        <p className="text-[18px] font-semibold">Processing…</p>
      </div>
    ),
    failed: (
      <div className="relative h-full rounded-[30px]" style={{ background: moment(4) }}>
        <span className="absolute inset-x-4 bottom-4 rounded-[14px] bg-black/60 px-4 py-3 text-[14px] backdrop-blur">
          <b>Upload failed · Offline</b>
          <span className="block" style={{ color: S.muted }}>
            Saved locally. We&apos;ll retry.
          </span>
        </span>
      </div>
    ),
    denied: (
      <div className="grid h-full place-items-center rounded-[30px]" style={{ background: S.panel }}>
        <div className="px-8 text-center">
          <p className="text-[18px] font-bold">Camera access required</p>
          <p className="mt-1.5 text-[14px]" style={{ color: S.muted }}>
            Enable in Settings to record today&apos;s moment
          </p>
          <span className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-[14px] font-bold text-black">Open Settings</span>
        </div>
      </div>
    ),
  }[state]
  return (
    <Screen>
      <StatusBar />
      <div className="px-6 pt-4">
        <p className="text-[34px] font-extrabold tracking-[-0.03em]">Today</p>
      </div>
      <div className="mx-5 mt-5 flex-1">{stage}</div>
      <div className="flex flex-col items-center pb-10 pt-6">
        {state === "recording" ? <RecordRing recording progress={0.6} /> : <RecordRing />}
        <p className="mt-1 text-[14px] font-semibold" style={{ opacity: state === "denied" ? 0.4 : 1 }}>
          {state === "recording" ? "Recording" : "Hold to record"}
        </p>
      </div>
    </Screen>
  )
}

export function QuickFillPreview() {
  return (
    <Screen>
      <StatusBar />
      <div className="px-6 pt-1">
        <span className="text-[14px] font-medium" style={{ color: S.tealSoft }}>
          ‹ Quick Fill
        </span>
        <p className="mt-3 text-[34px] font-extrabold tracking-[-0.03em]">August 2026</p>
        <p className="mt-1 text-[15px]" style={{ color: S.muted }}>
          22 days will be filled. Tap any pick to swap it.
        </p>
      </div>
      <div className="mx-5 mt-5 grid grid-cols-4 gap-[3px] overflow-hidden rounded-[18px]">
        {Array.from({ length: 24 }, (_, i) => {
          const gap = i === 14 || i === 21
          return gap ? (
            <div key={i} className="grid aspect-square place-items-center text-[13px]" style={{ background: S.panel, color: S.faint }}>
              {i + 1}
            </div>
          ) : (
            <div key={i} className="relative aspect-square" style={{ background: moment(i * 3) }}>
              <span className="absolute left-1.5 top-1 text-[13px] font-extrabold">{i + 1}</span>
              {i === 6 && (
                <span className="absolute inset-0 grid place-items-center bg-black/45 text-[12px] font-bold" style={{ outline: `3px solid ${S.yellow}`, outlineOffset: -3 }}>
                  ⇄ Swap
                </span>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-auto space-y-3 px-5 pb-9">
        <PillBtn>Add 22 days to project</PillBtn>
        <p className="text-center text-[15px] underline underline-offset-4" style={{ color: S.muted }}>
          Review each day
        </p>
      </div>
    </Screen>
  )
}

function SystemAlert({ title, body }: { title: string; body: string }) {
  return (
    <div className="w-[270px] overflow-hidden rounded-[14px] text-center" style={{ background: "rgba(40,40,42,0.96)" }}>
      <div className="px-4 pb-4 pt-5">
        <p className="text-[16px] font-semibold">{title}</p>
        <p className="mt-1 text-[13px] leading-[1.4]" style={{ color: S.muted }}>
          {body}
        </p>
      </div>
      <div className="grid grid-cols-2 border-t text-[16px]" style={{ borderColor: S.hair, color: "#0A84FF" }}>
        <span className="border-r py-3" style={{ borderColor: S.hair }}>
          Don&apos;t Allow
        </span>
        <span className="py-3 font-semibold">Allow</span>
      </div>
    </div>
  )
}

export function PermissionBefore() {
  return (
    <Screen>
      <StatusBar />
      <div className="absolute inset-0 grid place-items-center bg-black/60">
        <div className="space-y-4">
          <SystemAlert title={`Allow "1SE" to use your location?`} body="Your location is used to tag your snippets." />
          <SystemAlert title={`Allow "1SE" to access the Camera?`} body="1SE would like to access your camera to record video." />
        </div>
      </div>
    </Screen>
  )
}

export function PermissionAfter() {
  return (
    <Screen>
      <StatusBar />
      <DateHero dow="Today" date="Thursday, September 10" />
      <div className="mx-5 mt-6 flex-1 rounded-[30px]" style={{ background: S.panel }} />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[30px] px-6 pb-10 pt-7" style={{ background: S.raised }}>
        <span className="mx-auto mb-5 block h-1 w-10 rounded-full bg-white/30" />
        <p className="text-[22px] font-bold leading-[1.2]">Record today&apos;s second, live.</p>
        <p className="mt-2 text-[15px] leading-[1.5]" style={{ color: S.muted }}>
          Camera access lets you capture the moment as it happens. No location needed.
        </p>
        <div className="mt-6">
          <PillBtn>Continue</PillBtn>
        </div>
      </div>
    </Screen>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACK B · MASHING
// ─────────────────────────────────────────────────────────────────────────────

export function AuditMashBrowse() {
  return (
    <Screen bg="#1C1C1C">
      <TealHeader title="Mash Your Memories" left={<span className="text-[26px] font-light">×</span>} />
      <p className="px-6 pt-7 text-[26px] font-bold">Months</p>
      <div className="relative mx-6 mt-4 h-[330px] overflow-hidden rounded-[18px] border-[3px] border-white" style={{ background: moment(1) }}>
        <p className="absolute bottom-12 left-5 text-[36px] font-bold">July &apos;26</p>
        <p className="absolute bottom-5 left-9 text-[15px]">17 snippets</p>
      </div>
      <p className="px-6 pt-7 text-[26px] font-bold">Years</p>
      <div className="mx-6 mt-4 h-[160px] rounded-[18px] border-[3px] border-white" style={{ background: moment(0) }} />
      <span className="absolute bottom-[56px] left-1/2 -translate-x-1/2 rounded-full px-8 py-4 text-[17px] font-bold" style={{ background: S.tealSoft, color: "#0b2b30" }}>
        ▦ Choose Dates
      </span>
      <Pin n={1} x={330} y={790} />
    </Screen>
  )
}

export function AuditManualSelect() {
  return (
    <Screen>
      <div style={{ background: S.teal }}>
        <StatusBar />
        <div className="flex h-[60px] items-center justify-between px-6">
          <span className="text-[30px] font-light">‹</span>
          <span className="flex items-center gap-3 text-[18px] font-bold">
            Select (All) <span className="text-[20px]" style={{ color: "#FF6B6B" }}>⊘</span>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[2px]">
        {[10, 13, 14, 15, 16, 19, 21, 24, 26, 29, 30].map((n, i) => (
          <DayTile key={n} i={i + 1} dow={DOW[(n + 3) % 7]} n={n} className="aspect-square" />
        ))}
      </div>
      <div className="mt-auto px-12 pb-10">
        <PillBtn kind="disabled">Add to Mash</PillBtn>
      </div>
      <Pin n={2} x={70} y={300} />
      <Pin n={3} x={310} y={790} />
    </Screen>
  )
}

export function AuditPlayer() {
  return (
    <Screen bg="#000">
      <StatusBar />
      <div className="mt-16 h-[230px] bg-white">
        <div className="mx-auto h-full w-[60%]" style={{ background: moment(5) }} />
      </div>
      <div className="mt-8 flex gap-2 overflow-hidden px-4">
        {["Speed", "Music", "Sound", "Date", "Filter", "Order", "End", "Size"].map((t, i) => (
          <span key={t} className="flex w-[70px] flex-shrink-0 flex-col items-center gap-1.5 rounded-[12px] py-3 text-[12px]" style={{ background: S.panel }}>
            <span className="h-5 w-5 rounded-[6px] border-2 border-white/60" />
            {t}
            {(i === 1 || i === 4 || i === 6) && <span className="text-[9px] font-bold" style={{ color: S.yellow }}>🔒 PRO</span>}
          </span>
        ))}
      </div>
      <Pin n={4} x={195} y={200} />
    </Screen>
  )
}

export function MashBrowse() {
  return (
    <Screen>
      <StatusBar />
      <div className="px-6 pt-1">
        <p className="text-[34px] font-extrabold tracking-[-0.03em]">Mashes</p>
        <div className="mt-4 inline-flex rounded-full p-1" style={{ background: S.panel }}>
          <span className="rounded-full bg-white px-5 py-2 text-[15px] font-bold text-black">Suggested</span>
          <span className="px-5 py-2 text-[15px] font-semibold" style={{ color: S.muted }}>
            Custom
          </span>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 px-5">
        {[
          ["July '26", "17 moments", 1],
          ["Summer", "62 moments", 7],
          ["2025", "301 moments", 0],
          ["Shuffle", "A surprise", 4],
        ].map(([t, s, m]) => (
          <div key={t as string} className="relative h-[210px] overflow-hidden rounded-[20px]" style={{ background: moment(m as number) }}>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10">
              <span className="block text-[20px] font-extrabold">{t}</span>
              <span className="block text-[13px]" style={{ color: S.muted }}>
                {s}
              </span>
            </span>
          </div>
        ))}
      </div>
      <p className="px-6 pt-6 text-[13px] font-bold tracking-[0.06em]" style={{ color: S.faint }}>
        YOUR MASHES
      </p>
      <div className="flex gap-3 px-5 pt-3">
        {[5, 3].map((m) => (
          <span key={m} className="h-[64px] w-[64px] rounded-[14px]" style={{ background: moment(m) }} />
        ))}
      </div>
      <TabBar active="Rewind" />
    </Screen>
  )
}

export function CustomRange() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  return (
    <Screen>
      <StatusBar />
      <div className="px-6 pt-1">
        <span className="text-[14px] font-medium" style={{ color: S.tealSoft }}>
          ‹ Mashes
        </span>
        <p className="mt-3 text-[34px] font-extrabold tracking-[-0.03em]">June 2026</p>
      </div>
      <div className="mt-5 grid grid-cols-7 px-5 text-center text-[13px]" style={{ color: S.faint }}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-y-2 px-5">
        {days.map((d) => {
          const sel = d >= 23 && d <= 26
          const has = [2, 3, 5, 8, 9, 12, 15, 16, 19, 20, 23, 24, 25, 26, 28].includes(d)
          return (
            <span
              key={d}
              className="mx-auto grid h-[42px] w-full place-items-center text-[16px] font-semibold"
              style={
                sel
                  ? { background: "#fff", color: "#111", borderRadius: d === 23 ? "21px 0 0 21px" : d === 26 ? "0 21px 21px 0" : 0 }
                  : { color: has ? S.text : S.faint }
              }
            >
              <span className="relative">
                {d}
                {has && !sel && <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full" style={{ background: S.tealSoft }} />}
              </span>
            </span>
          )
        })}
      </div>
      <div className="mx-5 mt-auto rounded-[18px] px-5 py-4" style={{ background: S.panel }}>
        <p className="text-[18px] font-bold">June 23–26</p>
        <p className="mt-0.5 text-[14px]" style={{ color: S.muted }}>
          4 days · 4 have moments
        </p>
      </div>
      <div className="px-5 pb-9 pt-3">
        <PillBtn>Watch</PillBtn>
      </div>
    </Screen>
  )
}

export function MashPlayer({ sheet }: { sheet?: boolean }) {
  return (
    <Screen bg="#000">
      <div className="absolute inset-0" style={{ background: moment(4), filter: sheet ? "brightness(0.45)" : undefined }} />
      <div className="relative">
        <StatusBar />
        <div className="flex gap-1 px-5 pt-1">
          {[1, 1, 0.4, 0].map((v, i) => (
            <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              <span className="block h-full bg-white" style={{ width: `${v * 100}%` }} />
            </span>
          ))}
        </div>
        <p className="px-5 pt-4 text-[15px] font-bold">June 23–26 · 4 moments</p>
      </div>
      {!sheet && (
        <div className="relative mt-auto flex justify-between px-5 pb-10">
          <span className="rounded-full bg-black/40 px-5 py-3 text-[15px] font-bold backdrop-blur">Adjust</span>
          <span className="rounded-full bg-white px-6 py-3 text-[15px] font-bold text-black">Share</span>
        </div>
      )}
      {sheet && (
        <div className="relative mt-auto rounded-t-[30px] px-6 pb-9 pt-5" style={{ background: S.raised }}>
          <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-white/30" />
          {[
            { g: "TIMING", rows: [["One moment per day", "On"], ["Speed", "1×"]] },
            { g: "SOUND", rows: [["Original sound", "On"], ["Music", "PRO"]] },
            { g: "LOOK", rows: [["Orientation", "Portrait"], ["Date stamp", "On"], ["End card", "PRO"]] },
          ].map((grp) => (
            <div key={grp.g} className="mb-3">
              <p className="text-[12px] font-bold tracking-[0.08em]" style={{ color: S.faint }}>
                {grp.g}
              </p>
              {grp.rows.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b py-2.5 text-[16px]" style={{ borderColor: S.hair }}>
                  <span>{k}</span>
                  {v === "PRO" ? (
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: S.yellow, color: "#111" }}>
                      PRO
                    </span>
                  ) : (
                    <span style={{ color: S.muted }}>{v}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className="pt-2">
            <PillBtn>Done</PillBtn>
          </div>
        </div>
      )}
    </Screen>
  )
}

export function MashEnd() {
  return (
    <Screen bg="#000">
      <div className="absolute inset-0" style={{ background: moment(4), filter: "blur(18px) brightness(0.5)", transform: "scale(1.2)" }} />
      <div className="relative grid flex-1 place-items-center px-8 text-center">
        <div>
          <p className="text-[34px] font-extrabold tracking-[-0.03em]">June 23–26</p>
          <p className="mt-1 text-[16px]" style={{ color: S.muted }}>
            4 moments
          </p>
          <div className="mt-10 space-y-3">
            <PillBtn>Watch again</PillBtn>
            <PillBtn kind="ghost">Share</PillBtn>
          </div>
        </div>
      </div>
    </Screen>
  )
}

/** Gap handling, option A (skip silently) vs B (a brief date beat). */
export function GapOption({ option }: { option: "A" | "B" }) {
  return (
    <Screen bg="#000">
      <StatusBar />
      <div className="relative mx-4 mt-6 flex-1 overflow-hidden rounded-[24px]" style={{ background: option === "A" ? moment(2) : "#111" }}>
        {option === "B" && (
          <div className="grid h-full place-items-center text-center">
            <div>
              <p className="text-[15px]" style={{ color: S.faint }}>
                no moments
              </p>
              <p className="mt-1 text-[44px] font-extrabold tracking-[-0.03em]">Mar 15</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-[3px] px-4 pb-10 pt-4">
        {(option === "A" ? [2, 5, 1, 6, 3] : [2, 5, -1, 1, 6]).map((m, i) => (
          <span key={i} className="h-[50px] flex-1 rounded-[6px]" style={m < 0 ? { background: "#222", outline: `2px solid ${S.yellow}` } : { background: moment(m) }} />
        ))}
      </div>
    </Screen>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACK C · REWIND
// ─────────────────────────────────────────────────────────────────────────────

export function AuditRewindViewer() {
  return (
    <Screen bg="#000">
      <div className="absolute inset-0" style={{ background: moment(6) }} />
      <div className="relative">
        <StatusBar />
        <div className="mx-auto mt-4 w-fit rounded-full bg-white/80 px-8 py-3 text-[20px] font-bold text-black">3 Years Ago</div>
      </div>
      <div className="relative mt-auto px-8 pb-10">
        <p className="text-[18px] italic">From your library</p>
        <p className="mt-1 text-[22px] font-extrabold tracking-[0.06em]">SEP 11 2023</p>
        <div className="mt-6">
          <PillBtn kind="yellow">Add to Project</PillBtn>
        </div>
      </div>
      <Pin n={1} x={110} y={690} />
    </Screen>
  )
}

export function AuditRewindSaved() {
  return (
    <Screen bg="#181616">
      <StatusBar />
      <p className="pt-3 text-center text-[24px] font-bold">Share</p>
      <div className="relative mx-auto mt-10 h-[420px] w-[230px] overflow-hidden rounded-[16px]" style={{ background: moment(1) }}>
        <p className="absolute inset-x-0 top-[22%] text-center text-[12px] font-bold">3 YEARS AGO</p>
        <p className="absolute bottom-16 left-6 text-[10px] font-bold opacity-90">▮ 1SE.CO</p>
        <p className="absolute bottom-14 right-8 text-[18px] font-extrabold">2023</p>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-3 px-5 pb-12">
        {["Save Movie", "Share Movie", "Create Share Link"].map((t) => (
          <span key={t} className="rounded-[14px] py-5 text-center text-[13px] font-semibold" style={{ background: S.panel }}>
            <span className="mx-auto mb-2 block h-5 w-5 rounded-[5px] border-2" style={{ borderColor: S.yellow }} />
            {t}
          </span>
        ))}
      </div>
      <Pin n={2} x={70} y={520} />
      <Pin n={5} x={330} y={700} />
    </Screen>
  )
}

export function AuditYourDay() {
  return (
    <Screen>
      <TealHeader title="Your Day" />
      <div className="relative mx-5 mt-5 h-[300px] rounded-[20px]" style={{ background: moment(3) }} />
      <div className="mx-5 mt-4 flex items-center justify-between rounded-[18px] px-5 py-4" style={{ background: S.panel }}>
        <span className="text-[17px] font-bold">Rewinds</span>
        <span className="rounded-full px-3 py-1 text-[13px] font-bold" style={{ background: S.yellow, color: "#111" }}>
          2 Rewinds
        </span>
      </div>
      <TabBar active="Now" />
      <span className="absolute bottom-[58px] left-[190px] grid h-6 w-6 place-items-center rounded-full text-[12px] font-bold" style={{ background: S.red }}>
        4
      </span>
      <Pin n={3} x={22} y={482} />
      <Pin n={4} x={250} y={482} />
    </Screen>
  )
}

export function RewindMoment({ controls }: { controls?: boolean }) {
  return (
    <Screen bg="#000">
      <div className="absolute inset-0" style={{ background: moment(6) }} />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 to-transparent" />
      <div className="relative">
        <StatusBar />
        <p className="mt-6 text-center text-[15px] font-semibold tracking-[0.02em]" style={{ color: "rgba(255,255,255,0.85)" }}>
          3 years ago today
        </p>
      </div>
      <div className="relative mt-auto px-6 pb-10" style={{ opacity: controls ? 1 : 0 }}>
        <p className="text-[14px]" style={{ color: S.muted }}>
          From your camera roll · Sep 11, 2023
        </p>
        <div className="mt-5 space-y-3">
          <PillBtn kind="yellow">Keep this day</PillBtn>
          <p className="text-center text-[15px]" style={{ color: S.muted }}>
            Not this one
          </p>
        </div>
      </div>
    </Screen>
  )
}

export function RewindKept() {
  return (
    <Screen bg="#000">
      <div className="absolute inset-0" style={{ background: moment(6), filter: "brightness(0.5)" }} />
      <div className="relative">
        <StatusBar />
      </div>
      <div className="relative mt-auto rounded-t-[30px] px-6 pb-10 pt-7" style={{ background: S.raised }}>
        <span className="grid h-11 w-11 place-items-center rounded-full text-[20px] font-bold text-black" style={{ background: S.yellow }}>
          ✓
        </span>
        <p className="mt-4 text-[24px] font-extrabold tracking-[-0.02em]">Added to Sep 11</p>
        <p className="mt-1 text-[15px]" style={{ color: S.muted }}>
          Same as any day you capture. It&apos;s in your project now.
        </p>
        <div className="mt-6 space-y-3">
          <PillBtn>See it in your project</PillBtn>
          <PillBtn kind="ghost">Next memory</PillBtn>
        </div>
      </div>
    </Screen>
  )
}
