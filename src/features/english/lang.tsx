import type { ElementType, ReactNode } from "react"
import { cn } from "@/lib/utils"

/** English text, marked as Indian English for screen readers and hyphenation. */
export function En({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode
  className?: string
  as?: ElementType
}) {
  return (
    <Tag lang="en-IN" className={className}>
      {children}
    </Tag>
  )
}

/** Hindi text: Devanagari with its own font and line height, never truncated (it wraps). */
export function Hi({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode
  className?: string
  as?: ElementType
}) {
  return (
    <Tag lang="hi" className={cn("break-words", className)}>
      {children}
    </Tag>
  )
}
