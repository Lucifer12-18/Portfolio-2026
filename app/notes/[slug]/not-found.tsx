import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NoteNotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        background: "#020617",
        backgroundImage: "radial-gradient(circle, rgba(34, 211, 238, 0.04) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <p className="text-xs font-mono mb-3" style={{ color: "rgb(71, 85, 105)" }}>
        404 · NOTE NOT FOUND
      </p>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: "rgb(226, 232, 240)" }}>
        This note doesn&apos;t exist.
      </h1>
      <Link
        href="/#chapter-5"
        className="inline-flex items-center gap-2 text-sm transition-colors"
        style={{ color: "rgb(148, 163, 184)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Notes
      </Link>
    </div>
  )
}
