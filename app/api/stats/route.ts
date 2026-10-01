import { NextResponse } from "next/server"
import { dayKey, EVENT_RE, isBot, redis, statsEnabled } from "@/lib/stats-server"

// Public counter endpoint.
//   GET  → { enabled, visitors }
//   POST { kind: "visit", first: boolean }  → counts a session (+ a visitor if first)
//   POST { kind: "event", name: "resume_open" } → counts a tracked click
// Bodies may arrive as text/plain (navigator.sendBeacon), so parse manually.

export const dynamic = "force-dynamic"

export async function GET() {
  if (!statsEnabled) return NextResponse.json({ enabled: false })
  try {
    const [visitors] = await redis([["GET", "visitors"]])
    return NextResponse.json({ enabled: true, visitors: Number(visitors) || 0 }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ enabled: false })
  }
}

export async function POST(req: Request) {
  if (!statsEnabled) return NextResponse.json({ enabled: false })
  if (isBot(req.headers.get("user-agent"))) return new NextResponse(null, { status: 204 })

  let body: { kind?: string; first?: boolean; name?: string } = {}
  try {
    body = JSON.parse(await req.text())
  } catch {
    return new NextResponse(null, { status: 400 })
  }

  try {
    if (body.kind === "visit") {
      const day = dayKey()
      const res = await redis([
        ["INCR", "sessions"],
        ["INCR", day],
        ["EXPIRE", day, 60 * 60 * 24 * 400],
        body.first ? ["INCR", "visitors"] : ["GET", "visitors"],
      ])
      return NextResponse.json({ enabled: true, visitors: Number(res[3]) || 0, first: !!body.first })
    }
    if (body.kind === "event" && typeof body.name === "string" && EVENT_RE.test(body.name)) {
      await redis([["HINCRBY", "events", body.name, 1]])
      return new NextResponse(null, { status: 204 })
    }
    return new NextResponse(null, { status: 400 })
  } catch {
    return NextResponse.json({ enabled: false }, { status: 502 })
  }
}
