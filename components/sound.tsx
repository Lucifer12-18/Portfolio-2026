"use client"

import { useEffect, useSyncExternalStore } from "react"
import { sfx } from "@/lib/sound"
import { cn } from "@/lib/utils"

const INTERACTIVE = 'a[href],button,[role="button"],[role="tab"],[role="slider"]'

export function useSoundEnabled() {
  return useSyncExternalStore(sfx.subscribe, sfx.getEnabled, () => true)
}

/**
 * Mount once (root layout). Unlocks audio on the first gesture and gives every
 * interactive element the same quiet hover tick + press tap — so the whole site
 * sounds consistent without wiring each component. Elements (or ancestors)
 * marked `data-sfx-skip` play their own cue instead.
 */
export function SoundLayer() {
  useEffect(() => {
    let hovered: Element | null = null

    const unlock = () => sfx.unlock()
    const find = (t: EventTarget | null) => (t instanceof Element ? t.closest(INTERACTIVE) : null)
    const skipped = (el: Element) => !!el.closest("[data-sfx-skip]") || (el as HTMLButtonElement).disabled

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const el = find(e.target)
      if (!el || el === hovered) return
      hovered = el
      if (!skipped(el)) sfx.hover()
    }
    const onOut = (e: PointerEvent) => {
      if (hovered && !(e.relatedTarget instanceof Node && hovered.contains(e.relatedTarget))) hovered = null
    }
    const onClick = (e: MouseEvent) => {
      const el = find(e.target)
      if (el && !skipped(el)) sfx.tap()
    }

    document.addEventListener("pointerdown", unlock, true)
    document.addEventListener("keydown", unlock, true)
    document.addEventListener("pointerover", onOver)
    document.addEventListener("pointerout", onOut)
    document.addEventListener("click", onClick, true)
    return () => {
      document.removeEventListener("pointerdown", unlock, true)
      document.removeEventListener("keydown", unlock, true)
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("pointerout", onOut)
      document.removeEventListener("click", onClick, true)
    }
  }, [])
  return null
}

/** Sound on/off — four bars that dance while sound is on. */
export function SoundToggle({ className }: { className?: string }) {
  const on = useSoundEnabled()
  return (
    <button
      type="button"
      data-sfx-skip
      onClick={() => sfx.setEnabled(!on)}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title={on ? "Sound on" : "Sound off"}
      className={cn(
        "group flex h-9 w-9 items-center justify-center rounded-[9px] border transition-colors",
        on ? "border-hair-2 hover:border-chapter" : "border-hair hover:border-hair-3",
        className,
      )}
    >
      <span aria-hidden className="flex h-3.5 items-end gap-[2.5px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn("w-[2px] rounded-full transition-colors", on ? "bg-chapter sfx-bar" : "bg-bone-4 h-[2px]")}
            style={on ? { animationDelay: `${i * 0.13}s`, height: `${[6, 12, 8, 10][i]}px` } : undefined}
          />
        ))}
      </span>
    </button>
  )
}
