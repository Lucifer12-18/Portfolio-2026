import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NoteNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-ink-0 text-center">
      <p className="label-mono mb-5">404 · Note not found</p>
      <h1 className="display-md text-bone mb-8">
        <span className="ink-dim">This note</span> doesn&apos;t exist.
      </h1>
      <Link href="/#chapter-5" className="btn-ghost">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
        Back to notes
      </Link>
    </div>
  )
}
