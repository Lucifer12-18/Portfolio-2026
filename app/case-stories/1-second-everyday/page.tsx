import type React from "react"
import type { Metadata } from "next"
import { caseBySlug } from "@/lib/cases"
import {
  CaseHero,
  CaseShell,
  Columns,
  ContractDiagram,
  Decisions,
  DesignSystemBoard,
  Findings,
  Insight,
  KeyTable,
  PhoneFrame,
  Scene,
  Stage,
  StatesGrid,
  ThirtySecondRead,
} from "@/components/case/blocks"
import { Reveal } from "@/components/case/kit"
import { ShotOr } from "@/components/case/shot"
import {
  AddFutureDay,
  AddPastDay,
  AuditCameraLibrary,
  AuditLibraryFirst,
  AuditManualSelect,
  AuditMashBrowse,
  AuditPlayer,
  AuditProjectGrid,
  AuditQuickFill,
  AuditRewindSaved,
  AuditRewindViewer,
  AuditYourDay,
  CustomRange,
  DayAfterCapture,
  DayState,
  DayToday,
  GapOption,
  MashBrowse,
  MashEnd,
  MashPlayer,
  PermissionAfter,
  PermissionBefore,
  QuickFillPreview,
  RewindKept,
  RewindMoment,
} from "@/components/case/onese/screens"
import { DayTile, FONT, PillBtn, RecordRing, S } from "@/components/case/onese/ui"

const meta = caseBySlug("1-second-everyday")!

export const metadata: Metadata = {
  title: "1 Second Everyday · Case Study",
  description: meta.hook,
  openGraph: { title: "1 Second Everyday · Case Study", description: meta.hook, type: "article" },
}

const SCENES = [
  { id: "thesis", label: "The pattern" },
  { id: "a-audit", label: "A · Audit" },
  { id: "a-sheet", label: "A · Add sheet" },
  { id: "a-states", label: "A · States" },
  { id: "a-rework", label: "A · Rework" },
  { id: "a-hifi", label: "A · Hi-fi" },
  { id: "b-audit", label: "B · Audit" },
  { id: "b-flow", label: "B · Flow" },
  { id: "b-gaps", label: "B · Gaps" },
  { id: "b-metrics", label: "B · Metrics" },
  { id: "c-audit", label: "C · Audit" },
  { id: "c-flow", label: "C · Rewind" },
  { id: "system", label: "Design system" },
]

const P = "case/1se"

/** A row of phones on a stage, each with a caption. */
function Phones({ items, cols = 3 }: { items: { node: React.ReactNode; label: string; src?: string }[]; cols?: 2 | 3 | 4 }) {
  const grid = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[cols]
  return (
    <Stage pad="px-6 py-10 md:px-10 md:py-14">
      <div className={`grid gap-10 sm:gap-6 ${grid}`}>
        {items.map((it) => (
          <PhoneFrame key={it.label} label={it.label}>
            {it.src ? (
              <ShotOr src={it.src} alt={it.label} width={390} height={844}>
                {it.node}
              </ShotOr>
            ) : (
              it.node
            )}
          </PhoneFrame>
        ))}
      </div>
    </Stage>
  )
}

export default function OneSecondEverydayCase() {
  return (
    <CaseShell meta={meta} scenes={SCENES}>
      <CaseHero
        kicker="Case 03 · 1 Second Everyday · Home task"
        dim="Three tracks,"
        accent="one commit contract."
        hook="1SE asked me to redesign three features: the Day screen, mashing, and Rewind. Auditing them showed the same failure three times, so the answer became a system rather than three screens: every path into the app ends the same way."
        meta={[
          { k: "Role", v: meta.role },
          { k: "Scope", v: "Day screen · Mashing · Rewind" },
          { k: "Timeline", v: meta.timeline },
          { k: "Platform", v: meta.platform },
          { k: "Status", v: meta.status },
        ]}
        visual={
          <Stage shot="SH 01 · day screen, today" pad="px-6 py-12 md:px-10 md:py-16">
            <div className="grid items-center gap-8 sm:grid-cols-3">
              <PhoneFrame label="Track A · today, camera first">
                <ShotOr src={`${P}/day-today.png`} alt="Day screen today" width={390} height={844}>
                  <DayToday />
                </ShotOr>
              </PhoneFrame>
              <PhoneFrame label="Track B · full-bleed player" className="sm:scale-[1.06]">
                <MashPlayer />
              </PhoneFrame>
              <PhoneFrame label="Track C · feel it first, then Keep">
                <RewindMoment controls />
              </PhoneFrame>
            </div>
          </Stage>
        }
      />

      <ThirtySecondRead
        bullets={[
          "Audited the shipped app track by track and named the shared failure: many entry points, each with its own commit behaviour.",
          "Designed one contract across capture, mashing and Rewind, so the mental model holds everywhere in the app.",
          "Went past screens: every state, the edge cases, success metrics with a Pro-conversion guardrail, and a now-versus-later plan.",
        ]}
        stats={[
          { value: "4·6·3", label: "Entry points found in A · B · C" },
          { value: "1", label: "Commit contract" },
          { value: "29", label: "States designed" },
          { value: "6", label: "Success metrics + 1 guardrail" },
        ]}
      />

      <Scene
        id="thesis"
        n={1}
        label="The pattern"
        title={
          <>
            <span className="ink-dim">Same pattern,</span> three times.
          </>
        }
        caption="The Day screen had four ways to add a moment. Mashing had six ways to start one. Rewind had three surfaces for the same memory. One outcome each, and every door behaved a little differently."
      >
        <Insight>“Four entry points in Track A, six in Track B, three in Track C. One outcome, inconsistent contracts, every time.”</Insight>
        <ContractDiagram
          label="Every path ends the same way"
          commit="Committed to the project, with one confirm step and one verb."
          entries={["Track A · tap a day → capture", "Track A · Quick Fill → preview", "Track B · Suggested or Custom → player", "Track C · Rewind → Keep this day"]}
        />
      </Scene>

      {/* ── TRACK A ─────────────────────────────────────────────────────── */}

      <Scene
        id="a-audit"
        n={2}
        label="Track A · Day screen"
        title={
          <>
            <span className="ink-dim">Four doors</span> to one outcome.
          </>
        }
        caption="Re-drawn from the shipped app, photos replaced. Each pin is a finding."
      >
        <Phones
          cols={4}
          items={[
            { node: <AuditProjectGrid />, label: "Project grid" },
            { node: <AuditLibraryFirst />, label: "Library picker" },
            { node: <AuditCameraLibrary />, label: "Camera screen" },
            { node: <AuditQuickFill />, label: "Quick Fill" },
          ]}
        />
        <Findings
          cols={4}
          items={[
            "Four entry points to one outcome: the + tile, a floating two-button pill, tap-a-day and Quick Fill. Each behaves slightly differently.",
            "The library opens first. The camera is a small icon in the top right.",
            "The camera screen is still titled “Library”. The app doesn't know which screen it's on.",
            "Quick Fill says 22 days will be filled, and never shows which moments it picked from 862 videos.",
          ]}
        />
      </Scene>

      <Scene
        id="a-sheet"
        n={3}
        label="Adaptive add sheet"
        title={
          <>
            <span className="ink-dim">One sheet</span> that knows what day it is.
          </>
        }
        caption="Context decides the layout, because what's possible differs by day. Today: the camera is live on open. A past day: say live capture isn't possible. A future day: no controls, just when to come back."
      >
        <Phones
          items={[
            { node: <DayToday />, label: "Today · capture is the default" },
            { node: <AddPastDay />, label: "Past day · library, stated plainly" },
            { node: <AddFutureDay />, label: "Future day · expectation, not failure" },
          ]}
        />
        <Decisions
          items={[
            { decision: "Capture is the default, not a corner icon.", why: "One record control. The library is demoted to a text link, still one tap away." },
            { decision: "Say “impossible” instead of showing a dead button.", why: "You can't record a past day live. The sheet says so and opens the library." },
            { decision: "Future days get no add controls.", why: "Setting the expectation beats failing silently when someone taps December 19." },
          ]}
        />
      </Scene>

      <Scene
        id="a-states"
        n={4}
        label="Day screen states"
        title={
          <>
            <span className="ink-dim">Six states,</span> one skeleton.
          </>
        }
        caption="Same date header, same stage, same button zone. State changes show up in the stage content alone, so nothing rearranges when the state does."
      >
        <StatesGrid
          phone
          states={[
            { label: "Empty · today", node: <PhoneFrame><DayState state="empty" /></PhoneFrame> },
            { label: "Filled snippet", node: <PhoneFrame><DayState state="filled" /></PhoneFrame> },
            { label: "Recording", node: <PhoneFrame><DayState state="recording" /></PhoneFrame> },
            { label: "Processing", node: <PhoneFrame><DayState state="processing" /></PhoneFrame> },
            { label: "Upload failed · offline", node: <PhoneFrame><DayState state="failed" /></PhoneFrame> },
            { label: "Permission denied", node: <PhoneFrame><DayState state="denied" /></PhoneFrame> },
          ]}
        />
      </Scene>

      <Scene
        id="a-rework"
        n={5}
        label="Remove · keep · rework"
        title={
          <>
            <span className="ink-dim">What goes,</span> what stays, what changes.
          </>
        }
        caption="Quick Fill now previews every pick before anything commits, and permissions are asked at the moment they're useful, with the reason first."
      >
        <Columns
          cols={[
            { title: "Remove", tone: "dim", items: ["Duplicate entry points with different commit behaviour", "Pro-gating inside the daily editor", "Location permission at capture"] },
            { title: "Keep", items: ["The calendar as home", "The scrub slider for picking your best second", "The one-second constraint", "Freestyle as undated capture"] },
            { title: "Rework", tone: "accent", items: ["The picker becomes camera-first", "One commit contract across all paths", "Quick Fill shows its picks and lets you swap them", "Permissions asked at the moment of value, with a reason"] },
          ]}
        />
        <Phones
          items={[
            { node: <QuickFillPreview />, label: "Quick Fill · preview, swap any pick" },
            { node: <PermissionBefore />, label: "Before · asked up front, location too" },
            { node: <PermissionAfter />, label: "After · asked when it's needed, why first" },
          ]}
        />
      </Scene>

      <Scene
        id="a-hifi"
        n={6}
        label="High fidelity"
        title={
          <>
            <span className="ink-dim">The date</span> is the hero.
          </>
        }
        caption="The Day screen reads like a title page for the day, not a utility. Yellow appears once, on the record ring; restraint is what makes it read as the action."
      >
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Phones
            cols={2}
            items={[
              { node: <DayToday />, label: "Today · empty", src: `${P}/day-today.png` },
              { node: <DayAfterCapture />, label: "After capture", src: `${P}/day-after.png` },
            ]}
          />
          <Findings
            cols={1}
            items={[
              "Camera is live on open. The primary action needs no discovery.",
              "“Thursday, September 10 · Day 214 of your project.” The date is the headline.",
              "Yellow appears once, on the record ring.",
              "Library is present and one tap away, but no longer the default.",
            ]}
          />
        </div>
      </Scene>

      {/* ── TRACK B ─────────────────────────────────────────────────────── */}

      <Scene
        id="b-audit"
        n={7}
        label="Track B · Mashing"
        title={
          <>
            <span className="ink-dim">Choice up front,</span> craft at the back.
          </>
        }
        caption="Mashing is how 1SE content gets watched, and it was the least loved part of the flow."
      >
        <Phones
          items={[
            { node: <AuditMashBrowse />, label: "Mash browse" },
            { node: <AuditManualSelect />, label: "Manual selection" },
            { node: <AuditPlayer />, label: "Player" },
          ]}
        />
        <Findings
          cols={2}
          items={[
            "Six ways to start one mash: Months, Years, Seasons, Shuffle, Manual Selection, and a floating Choose Dates button on top of the content it competes with.",
            "Per-day thumbnails are good, but a range gets no summary: no day count, no count of days that actually have moments.",
            "Add to Mash is disabled with no explanation. Select (All) reads as a label, not a control. The hide icon is unexplained.",
            "The payoff is letterboxed: the movie plays small, in white bars, under eight equal-weight toggles with Pro locks mid-strip.",
            "Your year ends on an app-store promo card, and removing it costs money.",
          ]}
        />
        <Insight by="Diagnosis">The app front-loads choice and back-loads craft.</Insight>
      </Scene>

      <Scene
        id="b-flow"
        n={8}
        label="Revised flow"
        title={
          <>
            <span className="ink-dim">Two paths,</span> one player.
          </>
        }
        caption="Suggested or Custom. The floating Choose Dates button folds into Custom, every path lands on the same full-bleed player, and a mash is saved as something you come back to, not a one-off render."
      >
        <Phones
          cols={4}
          items={[
            { node: <MashBrowse />, label: "One browse surface" },
            { node: <CustomRange />, label: "Custom · range with a summary" },
            { node: <MashPlayer />, label: "Player · full bleed" },
            { node: <MashPlayer sheet />, label: "Adjust · three named groups" },
          ]}
        />
        <Decisions
          items={[
            { decision: "Eight toggles become three named groups.", why: "Timing, Sound, Look. Hierarchy replaces a horizontal scroll strip." },
            { decision: "Pro is tagged, not locked mid-strip.", why: "Pro options stay visible with their peers. The upgrade is offered beside the moment, not inside it." },
            { decision: "Confirm says “Watch”, not “Done”.", why: "The next step is the movie, not a settings screen. The end card becomes a Look option." },
          ]}
        />
      </Scene>

      <Scene
        id="b-gaps"
        n={9}
        label="Gap handling"
        title={
          <>
            <span className="ink-dim">Gaps are part of</span> the honest record.
          </>
        }
        caption="Option A skips empty days silently. Option B, the one I chose, gives each gap a brief date beat. Hiding gaps makes the mash a nicer story than the stretch actually was."
      >
        <Phones
          items={[
            { node: <GapOption option="A" />, label: "Option A · skip silently" },
            { node: <GapOption option="B" />, label: "Option B · a brief beat (chosen)" },
            { node: <MashEnd />, label: "End of playback · the memory, not a promo" },
          ]}
        />
      </Scene>

      <Scene
        id="b-metrics"
        n={10}
        label="Success metrics"
        title={
          <>
            <span className="ink-dim">How we&apos;d know</span> it worked.
          </>
        }
        caption="If mashing is how content gets consumed, consumption should be the headline metric, and today it isn't tracked as one."
      >
        <KeyTable
          highlightFirst
          head={["Metric", "Why it matters"]}
          rows={[
            ["Weekly mash viewers (% of active users)", "Primary. The consumption metric the app doesn't track yet."],
            ["Mashes watched per user per month", "Repeat consumption, not one-off creation."],
            ["Playback completion rate", "A letterboxed movie under a toggle strip isn't watched to the end. This should move."],
            ["Watch-to-export ratio", "Separates watching from exporting so each improves on its own terms."],
            ["Return-to-saved-mash rate", "Whether saved mashes become a library worth coming back to."],
            ["D30 retention: watched a mash vs didn't", "Ties the payoff loop to retention."],
            ["Guardrail: Pro conversion", "Moving Music and End card out of the mid-flow lock shouldn't make it fall."],
          ]}
        />
        <Columns
          cols={[
            {
              title: "12 states designed",
              items: ["Too few moments", "Playing · paused", "Adjust sheet open · music preview", "Exporting · complete · failed", "Offline", "Pro option tapped", "Empty range selected", "End of playback"],
            },
            {
              title: "Edge cases",
              tone: "dim",
              items: [
                "Ranges with gaps, or zero moments",
                "Very long ranges and export cost",
                "Moments still uploading at playback",
                "Mixed aspect ratios (the letterbox, surfacing)",
                "Original audio against a music track",
                "Backgrounded mid-export · storage full",
                "A day with several moments · source deleted",
              ],
            },
          ]}
        />
      </Scene>

      {/* ── TRACK C ─────────────────────────────────────────────────────── */}

      <Scene
        id="c-audit"
        n={11}
        label="Track C · Rewind"
        title={
          <>
            <span className="ink-dim">A gift,</span> delivered as a chore.
          </>
        }
        caption="Rewind resurfaces moments from your camera roll on the same date in past years. It's the one place the app tells you something about your own life, and it was framed as a queue."
      >
        <Phones
          items={[
            { node: <AuditRewindViewer />, label: "Rewind viewer" },
            { node: <AuditRewindSaved />, label: "Rewind saved view" },
            { node: <AuditYourDay />, label: "Rewinds in Your Day" },
          ]}
        />
        <Findings
          cols={2}
          items={[
            "The source is labelled “From your library”, but 1SE calls its own picker Library too. The one line meant to explain uses the app's most overloaded word.",
            "A second viewer for the same content, with a different verb (Save instead of Add to Project), and a 1SE.CO watermark burned onto a 2023 memory.",
            "A third surface inside Your Day. Three places, three contracts, one piece of content.",
            "Counted, not offered. A badge and a “2 Rewinds” pill turn a memory into an item to process.",
            "Sharing a resurfaced memory routes through the same movie export as a mash.",
          ]}
        />
        <Columns
          cols={[
            {
              title: "What already works",
              tone: "accent",
              items: [
                "“3 Years Ago” is the right frame: relative time lands where a date doesn't.",
                "Full-bleed story format is the right container for one moment.",
                "A blurred fill behind off-ratio clips beats the white letterbox in the mash player.",
                "Sourcing from the camera roll means a brand-new user can be delighted in week one, not year two.",
              ],
            },
            {
              title: "The aha moment",
              items: [
                "Being handed back a moment you forgot you had.",
                "Not “this day in past years”: that's the mechanism, not the feeling.",
                "Not “fill your empty days”: that's a chore.",
              ],
            },
          ]}
        />
      </Scene>

      <Scene
        id="c-flow"
        n={12}
        label="Redesigned Rewind"
        title={
          <>
            <span className="ink-dim">Feel it first.</span> Then one verb: Keep.
          </>
        }
        caption="No badge, no count. Rewind opens straight onto the moment, full bleed, with no controls for the first beat. Then one clear action. Kept days use the same commit as Track A and can become a Track B mash."
      >
        <Phones
          items={[
            { node: <RewindMoment />, label: "The first beat · no controls" },
            { node: <RewindMoment controls />, label: "Then one action" },
            { node: <RewindKept />, label: "Kept · same commit as Track A" },
          ]}
        />
        <ContractDiagram
          label="Three verbs collapse into one"
          commit="Keep this day. Adds it as that day's moment, the same commit as capture."
          entries={["Viewer · Add to Project", "Saved view · Save", "Your Day · Rewinds list"]}
        />
        <Columns
          cols={[
            {
              title: "Fix now",
              tone: "accent",
              items: ["Remove the badge and the count framing", "Open directly on the moment, full bleed", "Say “from your camera roll” in plain words", "One verb across every surface", "No 1SE watermark on an unshared memory"],
            },
            {
              title: "Fix later",
              items: ["Smarter selection: what makes a moment worth resurfacing beyond a matching date", "Seasonal and milestone moments, not only anniversaries", "Notifications timed to when someone's receptive", "A kept-moments view that becomes a mash directly"],
            },
          ]}
        />
      </Scene>

      <Scene
        id="system"
        n={13}
        label="Design system"
        title={
          <>
            <span className="ink-dim">The contract,</span> as components.
          </>
        }
        caption="Built on 1SE's own language, sampled from the app: teal for the brand, yellow for the one action per screen, a black canvas so the moments carry the colour. The contract lives in a handful of shared parts."
      >
        <DesignSystemBoard
          name="1 Second Everyday · contract components"
          surface={S.canvas}
          ink={S.text}
          colors={[
            { name: "Teal", hex: "#0C8A93", role: "Brand, headers" },
            { name: "Teal light", hex: "#63ABBB", role: "Links, back, secondary" },
            { name: "Yellow", hex: "#FFBA00", role: "The one action: record, keep" },
            { name: "Canvas", hex: "#0C0C0C", role: "Background; moments bring colour" },
            { name: "Panel", hex: "#1F1F1F", role: "Cards, notices" },
            { name: "Raised", hex: "#2A2A2C", role: "Bottom sheets" },
            { name: "Tab bar", hex: "#353A40", role: "Navigation" },
            { name: "Record red", hex: "#FF453A", role: "Recording, and only recording" },
          ]}
          type={[
            { family: "Figtree", cssVar: "--font-figtree", role: "Stand-in for 1SE's geometric sans", sample: "Thursday", weight: 800, specs: "Date hero 40 / 800 · Title 34 / 800 · Body 15 / 400 · Label 12 caps +0.08em" },
            { family: "Day numerals", cssVar: "--font-figtree", role: "Tiles", sample: "214", weight: 800, specs: "30 / 800 on every day tile · weekday 12 / 500 above it" },
          ]}
          shape={[
            { label: "Tile", value: "0 · full bleed", radius: 0 },
            { label: "Card", value: "18px", radius: 18 },
            { label: "Stage", value: "30px", radius: 30 },
            { label: "Pill", value: "999px", radius: 999 },
          ]}
          motion={[
            { name: "Record ring", spec: "fills over the one second you're capturing" },
            { name: "Sheet", spec: "rises 320ms; the stage behind dims, never moves" },
            { name: "First beat", spec: "Rewind holds ~1.2s with no controls" },
            { name: "Reduced", spec: "crossfades only" },
          ]}
          components={
            <div className="flex flex-wrap items-center gap-6" style={{ fontFamily: FONT, color: S.text }}>
              <span className="flex flex-col items-center gap-1">
                <RecordRing />
                <span className="text-[12px] font-semibold">Hold to record</span>
              </span>
              <span className="flex flex-col items-center gap-1">
                <RecordRing recording progress={0.6} />
                <span className="text-[12px] font-semibold">Recording</span>
              </span>
              <span className="flex w-[220px] flex-col gap-2">
                <PillBtn kind="yellow">Keep this day</PillBtn>
                <PillBtn>Watch</PillBtn>
                <PillBtn kind="ghost">Next memory</PillBtn>
              </span>
              <span className="grid w-[200px] grid-cols-2 gap-[2px] overflow-hidden rounded-[12px]">
                <DayTile i={1} dow="THU" n={10} className="aspect-square" />
                <DayTile i={4} dow="FRI" n={11} className="aspect-square" />
              </span>
              <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: S.yellow, color: "#111" }}>
                PRO
              </span>
            </div>
          }
        />
        <Reveal>
          <p className="text-center font-mono text-[11px] text-bone-3">
            Home task for 1 Second Everyday. Shipped-app screens are re-drawn with abstract stand-ins for personal photos.
          </p>
        </Reveal>
      </Scene>
    </CaseShell>
  )
}
