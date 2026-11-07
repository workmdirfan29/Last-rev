import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-7 items-center justify-center rounded-md bg-brand font-heading text-sm font-bold text-brand-foreground",
        className
      )}
    >
      L
    </span>
  )
}

export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <BrandMark />
      <span className="font-heading text-base font-semibold tracking-tight">
        Last<span className="text-brand-ink">Rev</span>
      </span>
    </span>
  )
}
