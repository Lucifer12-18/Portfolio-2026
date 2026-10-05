import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { getStats } from "@/lib/stats-server"
import { CASE_NAMES } from "@/lib/cases"

// Private dashboard: /stats?key=<STATS_KEY>. Without the right key it's a 404,
// so the page doesn't even admit to existing. Never indexed.

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Stats", robots: { index: false, follow: false } }

const LABELS: Record<string, string> = {
  resume_open: "Résumé opened",
  email_copy: "Email copied",
  email_send: "“Send a note” clicked",
  linkedin_open: "LinkedIn opened",
  play_clarity: "Clarity started",
  clarity_complete: "Clarity finished (all 7)",
  briefing_done: "Briefing finished",
  briefing_skip: "Briefing skipped",
  case_full: "Full Hirello case study opened (retired link)",
  mode_recruiter: "Switched to Recruiter view",
  mode_designer: "Switched to Designer view",
}

const caseName = (file?: string) => CASE_NAMES[file ?? ""] ?? file?.replace(/[_.]/g, " ")

const label = (name: string) => {
  const [base, detail] = name.split(":")
  if (base === "case_open") return `Case opened · ${caseName(detail)}`
  if (base === "case_full" && detail) return `Full case study read · ${caseName(detail)}`
  if (base === "note_open") return `Note opened · ${detail?.replace(/_/g, " ")}`
  return LABELS[name] ?? name
}

export default async function StatsPage({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams
  const secret = process.env.STATS_KEY
  if (!secret || key !== secret) notFound()

  const s = await getStats(14)
  const max = Math.max(1, ...s.days.map((d) => d.sessions))
  const last7 = s.days.slice(-7).reduce((a, d) => a + d.sessions, 0)

  return (
    <main className="min-h-screen bg-ink-0 px-6 py-14 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">Pixelogic OS · Telemetry</span>
          <Link href="/" className="font-mono text-[11px] text-bone-3 hover:text-bone">
            ← Back to the site
          </Link>
        </div>
        <h1 className="mt-5 display-lg text-bone">
          <span className="ink-dim">Who&apos;s been</span> <span className="ink-accent">watching.</span>
        </h1>

        {!s.enabled ? (
          <p className="mt-8 max-w-xl text-[15px] leading-[1.6] text-bone-2">
            Counting isn&apos;t switched on yet. Connect an Upstash Redis database to this project in Vercel (Storage →
            Create Database → Upstash), redeploy, and numbers will start appearing here.
          </p>
        ) : (
          <>
            <dl className="mt-10 grid grid-cols-3 border-y border-hair">
              {[
                { k: "Visitors", v: s.visitors, note: "unique browsers" },
                { k: "Sessions", v: s.sessions, note: "all visits" },
                { k: "Last 7 days", v: last7, note: "sessions" },
              ].map((x, i) => (
                <div key={x.k} className={`py-6 ${i ? "pl-6 border-l border-hair" : ""}`}>
                  <dt className="label-mono">{x.k}</dt>
                  <dd className="mt-2 text-[40px] leading-none tracking-[-0.05em] text-bone tabular-nums">
                    {x.v.toLocaleString("en-US")}
                  </dd>
                  <dd className="mt-2 font-mono text-[10.5px] text-bone-3">{x.note}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-10">
              <p className="label-mono">Sessions · last 14 days</p>
              <div className="mt-4 flex h-40 items-end gap-1.5">
                {s.days.map((d) => (
                  <div key={d.date} className="group flex flex-1 flex-col items-center gap-2">
                    <span className="font-mono text-[9.5px] text-bone-3 opacity-0 transition-opacity group-hover:opacity-100 tabular-nums">
                      {d.sessions}
                    </span>
                    <span
                      className="w-full rounded-t-[3px] bg-chapter/80 transition-colors group-hover:bg-chapter"
                      style={{ height: `${Math.max(2, (d.sessions / max) * 120)}px` }}
                      title={`${d.date}: ${d.sessions}`}
                    />
                    <span className="font-mono text-[9px] text-bone-4 tabular-nums">{d.date.slice(8)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <div className="flex items-baseline justify-between border-b border-hair pb-3">
                <span className="label-mono">Clicks that matter</span>
                <span className="label-mono tabular-nums">{s.events.reduce((a, e) => a + e.count, 0)}</span>
              </div>
              {s.events.length === 0 ? (
                <p className="py-6 text-[14px] text-bone-3">No tracked clicks yet.</p>
              ) : (
                <ul>
                  {s.events.map((e) => (
                    <li key={e.name} className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-hair py-3.5">
                      <span className="text-[15px] text-bone-2">{label(e.name)}</span>
                      <span className="font-mono text-[13px] text-bone tabular-nums">{e.count.toLocaleString("en-US")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <p className="mt-10 font-mono text-[10.5px] leading-[1.7] text-bone-4">
              Counts only: no cookies, no IPs, no personal data. Countries, devices and referrers live in Vercel →
              Analytics.
            </p>
          </>
        )}
      </div>
    </main>
  )
}
