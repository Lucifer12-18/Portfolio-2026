import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ─── ModuleCard ───────────────────────────────────────────────────────────────
// Used in case studies to introduce each module (e.g. "Module 1 — Networking
// Intelligence System"). Matches the WindowShell / case-study aesthetic.

const moduleCardVariants = cva(
  "rounded-lg border transition-shadow",
  {
    variants: {
      variant: {
        default:  "border-slate-200 bg-slate-50/60",
        elevated: "border-slate-200 bg-white shadow-sm",
        dashed:   "border-dashed border-slate-300/80 bg-slate-50/60",
        ghost:    "border-transparent bg-transparent",
      },
      size: {
        sm: "px-4 py-3",
        md: "px-4 py-4 md:px-5 md:py-5",
        lg: "px-5 py-5 md:px-6 md:py-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface ModuleCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof moduleCardVariants> {
  /** Short label shown above the title, e.g. "MODULE 01" */
  eyebrow?: string
  /** Main heading */
  title?: string
  /** Supporting description */
  description?: string
  /** Optional accent colour for the left border stripe */
  accentColor?: string
}

const ModuleCard = React.forwardRef<HTMLDivElement, ModuleCardProps>(
  (
    { className, variant, size, eyebrow, title, description, accentColor, children, style, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(moduleCardVariants({ variant, size }), "relative overflow-hidden", className)}
        style={{
          ...(accentColor
            ? { borderLeftColor: accentColor, borderLeftWidth: "2px" }
            : {}),
          ...style,
        }}
        {...props}
      >
        {eyebrow && (
          <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/70">
            {eyebrow}
          </p>
        )}
        {title && (
          <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
        {children}
      </div>
    )
  }
)
ModuleCard.displayName = "ModuleCard"

// ─── ModuleCardGrid ───────────────────────────────────────────────────────────
// Wraps multiple ModuleCards in a responsive grid.

interface ModuleCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3
}

const ModuleCardGrid = React.forwardRef<HTMLDivElement, ModuleCardGridProps>(
  ({ className, cols = 2, children, ...props }, ref) => {
    const colClass = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-3",
    }[cols]

    return (
      <div
        ref={ref}
        className={cn("grid gap-3", colClass, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ModuleCardGrid.displayName = "ModuleCardGrid"

export { ModuleCard, ModuleCardGrid, moduleCardVariants }
