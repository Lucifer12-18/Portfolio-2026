import Link from "next/link"

// Global 404 — stays in the Pixelogic OS voice and, critically, gives visitors
// a way BACK. Server component: no motion, loads instantly.
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink-0 px-6 text-center">
      <p className="label-mono mb-6">Error 404</p>
      <h1 className="display-lg text-bone">
        <span className="ink-dim">Module</span> <span className="ink-accent">not found.</span>
      </h1>
      <p className="mt-5 text-[15px] text-bone-3 max-w-md leading-relaxed">
        The page you requested doesn&apos;t exist in this build of Pixelogic OS. The rest of the system is fully
        operational.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link href="/" className="btn-solid">
          ← Back home
        </Link>
        <Link href="/#chapter-4" className="btn-ghost">
          Jump to case stories
        </Link>
      </div>
    </div>
  )
}
