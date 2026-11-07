import { Link } from "react-router"
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ModeFeature {
  label: string
  /** Not built yet. Shown with a clock icon and a "Soon" tag instead of a check, so the card never promises more than the app does. */
  soon?: boolean
}

export interface ModeCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: ModeFeature[]
  cta: string
  to: string
  /** The learner used this journey last. */
  current?: boolean
  /** Called when the card is chosen (a journey without set-up remembers itself here). */
  onChoose?: () => void
}

/**
 * One journey on the landing page. The whole card is a single link: the
 * call-to-action link is stretched over the card, so a click anywhere, the
 * keyboard and a screen reader all reach the same destination.
 */
export function ModeCard({
  icon: Icon,
  title,
  description,
  features,
  cta,
  to,
  current,
  onChoose,
}: ModeCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-6 transition-colors sm:p-8",
        "hover:border-brand-ink/50 has-[a:focus-visible]:border-brand-ink has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-brand-ink/40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-brand-ink">
          <Icon className="size-6" aria-hidden />
        </div>
        {current && <Badge variant="secondary">Last used</Badge>}
      </div>

      <div className="space-y-2">
        <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
        <p className="text-sm/relaxed text-muted-foreground">{description}</p>
      </div>

      <ul className="space-y-2.5 text-sm" aria-label={`${title} includes`}>
        {features.map((f) => (
          <li key={f.label} className="flex items-start gap-2.5">
            {f.soon ? (
              <ClockIcon
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            ) : (
              <CheckIcon
                className="mt-0.5 size-4 shrink-0 text-brand-ink"
                aria-hidden
              />
            )}
            <span className="min-w-0">
              {f.label}
              {f.soon && (
                <span className="ms-2 rounded border border-border px-1.5 py-px align-middle text-[0.625rem] font-medium tracking-wide text-muted-foreground uppercase">
                  Soon
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <Link
          to={to}
          onClick={onChoose}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors",
            "hover:bg-primary/90 focus-visible:outline-none",
            // Stretch the link's hit area over the whole card.
            "after:absolute after:inset-0 after:rounded-2xl after:content-['']"
          )}
        >
          {cta}
          <ArrowRightIcon
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </article>
  )
}
