import type { UseFormReturn } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { EXPERIENCE_MULTIPLIER } from "@/data/curriculum/time-model"
import { LEVEL_META } from "@/types/content"
import { PROFILE_EXPERIENCE, PROFILE_EXPERIENCE_META } from "@/types/learner"
import { cn } from "@/lib/utils"
import type { OnboardingValues } from "../schema"

const DETAIL: Record<(typeof PROFILE_EXPERIENCE)[number], string> = {
  beginner:
    "New to programming or to this stack. Starts with the basics and the Fresher question set.",
  fresher:
    "Some projects or internships. Focuses on definitions, basics and common fresher questions.",
  intermediate:
    "Real-world implementation, debugging and architecture decisions.",
  advanced: "Deep internals, scalability, security and trade-offs.",
}

/** "1.25x" becomes "25% more time"; "0.8x" becomes "20% less time". */
function timeSentence(multiplier: number): string {
  if (multiplier === 1) return "the standard time"
  const pct = Math.round(Math.abs(multiplier - 1) * 100)
  return multiplier > 1
    ? `${pct}% more time than the standard plan`
    : `${pct}% less time than the standard plan`
}

export function ExperienceStep({
  form,
}: {
  form: UseFormReturn<OnboardingValues>
}) {
  const value = form.watch("experience")
  const meta = PROFILE_EXPERIENCE_META[value]
  const level = LEVEL_META[meta.defaultLevel]

  return (
    <section aria-labelledby="exp-heading" className="space-y-5">
      <div className="space-y-1.5">
        <h2
          id="exp-heading"
          className="font-heading text-xl font-semibold tracking-tight sm:text-2xl"
        >
          How much experience do you have?
        </h2>
        <p className="text-sm text-muted-foreground">
          This sets where your questions start and how much time we plan for
          each topic. You can open any level at any time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <RadioGroup
          value={value}
          onValueChange={(v) =>
            form.setValue("experience", v as OnboardingValues["experience"], {
              shouldDirty: true,
            })
          }
          className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1"
          aria-label="Your experience"
        >
          {PROFILE_EXPERIENCE.map((key) => {
            const m = PROFILE_EXPERIENCE_META[key]
            const id = `exp-${key}`
            return (
              <Label
                key={key}
                htmlFor={id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 font-normal",
                  value === key
                    ? "border-primary ring-1 ring-primary/60"
                    : "border-border hover:border-muted-foreground/40"
                )}
              >
                <RadioGroupItem id={id} value={key} className="mt-0.5" />
                <span className="space-y-1">
                  <span className="flex items-baseline gap-2 text-sm font-medium">
                    {m.label}
                    <span className="text-xs font-normal text-muted-foreground">
                      {m.hint}
                    </span>
                  </span>
                  <span className="block text-xs/relaxed text-muted-foreground">
                    {DETAIL[key]}
                  </span>
                </span>
              </Label>
            )
          })}
        </RadioGroup>

        <aside
          aria-label="What this means"
          className="h-fit space-y-3 rounded-xl border border-border bg-card p-5 text-sm lg:sticky lg:top-6"
        >
          <h3 className="lr-eyebrow">What this means for you</h3>
          <p>
            You start on the <span className="font-medium">{level.label}</span>{" "}
            questions ({level.experience}).
          </p>
          <p>
            Your study plan allows{" "}
            <span className="font-medium">
              {timeSentence(EXPERIENCE_MULTIPLIER[value])}
            </span>{" "}
            for each topic.
          </p>
          <p className="text-xs text-muted-foreground">
            You can change this later in Settings. Your progress is never lost.
          </p>
        </aside>
      </div>
    </section>
  )
}
