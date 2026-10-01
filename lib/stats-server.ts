// ─────────────────────────────────────────────────────────────────────────────
// STATS (server) — tiny first-party counters in Upstash Redis via its REST API
// (no SDK). Works with either env naming the Vercel ⇄ Upstash integration
// creates. With no env vars configured, everything reports `enabled: false`
// and the UI simply hides its counter.
//
// Keys:  visitors (unique browsers) · sessions · day:YYYY-MM-DD (sessions/day)
//        events (hash: event name → count)
// No cookies, no IPs, no personal data — counts only.
// ─────────────────────────────────────────────────────────────────────────────

const URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN

export const statsEnabled = Boolean(URL && TOKEN)

type Cmd = (string | number)[]

/** Run commands in one round trip; returns each command's result. */
export async function redis(cmds: Cmd[]): Promise<unknown[]> {
  if (!statsEnabled) return []
  const res = await fetch(`${URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`redis ${res.status}`)
  const out = (await res.json()) as { result?: unknown; error?: string }[]
  return out.map((r) => r.result)
}

export const dayKey = (d = new Date()) => `day:${d.toISOString().slice(0, 10)}`

// Event names: lowercase words, optional ":detail" (e.g. case_open:hirello_ai)
export const EVENT_RE = /^[a-z][a-z0-9_]{1,30}(:[a-z0-9_.-]{1,40})?$/

const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor|curl|wget/i
export const isBot = (ua: string | null) => !ua || BOT_RE.test(ua)

export interface StatsSnapshot {
  enabled: boolean
  visitors: number
  sessions: number
  days: { date: string; sessions: number }[]
  events: { name: string; count: number }[]
}

/** Everything the private /stats page shows. */
export async function getStats(days = 14): Promise<StatsSnapshot> {
  if (!statsEnabled) return { enabled: false, visitors: 0, sessions: 0, days: [], events: [] }
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - (days - 1 - i))
    return d
  })
  const res = await redis([["GET", "visitors"], ["GET", "sessions"], ["HGETALL", "events"], ...dates.map((d) => ["GET", dayKey(d)])])
  const flat = (res[2] as string[] | null) ?? []
  const events: { name: string; count: number }[] = []
  for (let i = 0; i < flat.length; i += 2) events.push({ name: flat[i], count: Number(flat[i + 1]) || 0 })
  events.sort((a, b) => b.count - a.count)
  return {
    enabled: true,
    visitors: Number(res[0]) || 0,
    sessions: Number(res[1]) || 0,
    days: dates.map((d, i) => ({ date: d.toISOString().slice(0, 10), sessions: Number(res[3 + i]) || 0 })),
    events,
  }
}
