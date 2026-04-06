import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const listItemVariants = cva(
  "flex items-start gap-2 text-muted-foreground leading-relaxed",
  {
    variants: {
      size: {
        sm:   "text-xs md:text-sm",
        base: "text-sm md:text-base",
      },
      marker: {
        bullet:  "",
        dot:     "",
        dash:    "",
        numbered:"",
        none:    "",
      },
    },
    defaultVariants: {
      size: "base",
      marker: "bullet",
    },
  }
)

const markerVariants = cva("flex-shrink-0", {
  variants: {
    marker: {
      bullet:  "mt-[0.45em] h-1.5 w-1.5 rounded-full bg-primary/70",
      dot:     "mt-[0.45em] h-1.5 w-1.5 rounded-full bg-primary",
      dash:    "mt-[0.6em] h-px w-3 bg-muted-foreground/50",
      numbered:"",
      none:    "hidden",
    },
  },
  defaultVariants: { marker: "bullet" },
})

interface ListItemProps
  extends React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof listItemVariants> {
  index?: number
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, size, marker, index, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn(listItemVariants({ size, marker }), className)}
        {...props}
      >
        {marker === "numbered" ? (
          <span className="flex-shrink-0 mt-[0.1em] font-mono text-[10px] text-muted-foreground/60 min-w-[1.25rem] leading-relaxed">
            {index !== undefined ? String(index + 1).padStart(2, "0") : "—"}
          </span>
        ) : (
          <span aria-hidden className={markerVariants({ marker })} />
        )}
        <span>{children}</span>
      </li>
    )
  }
)
ListItem.displayName = "ListItem"

// ─── List wrapper ──────────────────────────────────────────────────────────────
interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  spacing?: "tight" | "normal" | "loose"
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, spacing = "normal", children, ...props }, ref) => {
    const spacingClass = {
      tight:  "space-y-1",
      normal: "space-y-1.5",
      loose:  "space-y-3",
    }[spacing]

    return (
      <ul
        ref={ref}
        className={cn(spacingClass, className)}
        {...props}
      >
        {React.Children.map(children, (child, i) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<ListItemProps>, { index: i })
            : child
        )}
      </ul>
    )
  }
)
List.displayName = "List"

export { List, ListItem, listItemVariants }
