import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Typography primitives ────────────────────────────────────────────────────
// Thin wrappers that encode the type scale used across Pixelogic OS.
// All components forward refs and accept standard HTML element props.
// Usage mirrors the rest of the project: className overrides are always allowed.

// Page-level heading — used once per page
const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn("text-2xl md:text-3xl font-semibold tracking-wide text-foreground", className)}
      {...props}
    />
  )
)
H1.displayName = "H1"

// Section heading
const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-base md:text-lg font-semibold text-foreground", className)}
      {...props}
    />
  )
)
H2.displayName = "H2"

// Sub-section heading
const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-sm font-semibold text-foreground", className)}
      {...props}
    />
  )
)
H3.displayName = "H3"

// Sub-heading / card title
const H4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
)
H4.displayName = "H4"

// Body paragraph — default prose
const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm md:text-base text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
)
P.displayName = "P"

// Emphasis paragraph — bold body, used for key takeaways
const Lead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm md:text-base font-semibold text-foreground/90 leading-relaxed", className)}
      {...props}
    />
  )
)
Lead.displayName = "Lead"

// Uppercase mono label — "MODULE 01 · NETWORKING"
const Label = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-[10px] md:text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
Label.displayName = "Label"

// Section label with dot marker — used as <h2> in case studies
const SectionLabel = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "flex items-center gap-2 text-sm font-mono uppercase tracking-[0.18em] text-muted-foreground",
        className
      )}
      {...props}
    >
      <span aria-hidden className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-[2px] bg-primary" />
      {children}
    </h2>
  )
)
SectionLabel.displayName = "SectionLabel"

// Inline code / monospace snippet
const Mono = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("font-mono text-sm text-foreground/80", className)}
      {...props}
    />
  )
)
Mono.displayName = "Mono"

// Small caption text — image captions, footnotes
const Caption = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs md:text-sm text-muted-foreground/80 leading-relaxed", className)}
      {...props}
    />
  )
)
Caption.displayName = "Caption"

export { H1, H2, H3, H4, P, Lead, Label, SectionLabel, Mono, Caption }
