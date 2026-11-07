import { useState } from "react"
import { addDays, format } from "date-fns"
import type { UseFormReturn } from "react-hook-form"
import { countStudyDays } from "@/services/planner/schedule"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { roadmapDefaultSummary } from "@/services/curriculum/highlights"
import {
  daysUntil,
  estimateFromMinutes,
  estimatePlan,
  PRESET_DAYS,
  resolveTargetDate,
} from "@/services/planner/estimate"
import { cn } from "@/lib/utils"
import { toDateKey } from "@/utils/dates"
import type { OnboardingValues } from "../schema"

const WEEK = [
  { day: 1, label: "Mon", long: "Monday" },
  { day: 2, label: "Tue", long: "Tuesday" },
  { day: 3, label: "Wed", long: "Wednesday" },
  { day: 4, label: "Thu", long: "Thursday" },
  { day: 5, label: "Fri", long: "Friday" },
  { day: 6, label: "Sat", long: "Saturday" },
  { day: 0, label: "Sun", long: "Sunday" },
] as const

const PRESETS = [
  { value: "7d", label: "7 days", hint: "A quick sprint" },
  { value: "15d", label: "15 days", hint: "Focused" },
  { value: "30d", label: "30 days", hint: "Steady" },
  { value: "custom", label: "Pick a date", hint: "You choose" },
] as const

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="text-xs text-destructive">
      {message}
    </p>
  ) : null
}

/** Pace step: daily time, the target, and who you are. The right-hand panel shows what the choices add up to. */
export function TargetStep({
  form,
  showInterviewDate = true,
}: {
  form: UseFormReturn<OnboardingValues>
  /** Interview Prep asks for a real interview date; Study Path does not. */
  showInterviewDate?: boolean
}) {
  const hours = form.watch("dailyStudyHours")
  const preset = form.watch("targetPreset")
  const customDate = form.watch("targetDate")
  const experience = form.watch("experience")
  const studyDays = form.watch("studyDays")
  const roles = form.watch("selectedRoles")
  const roadmap = form.watch("studyRoadmap")
  const { errors } = form.formState
  // Computed once per mount: render must stay pure.
  const [today] = useState(() => new Date())
  const tomorrow = toDateKey(addDays(today, 1))

  const targetKey = resolveTargetDate(preset, customDate, today)
  const targetDays =
    preset === "custom"
      ? targetKey
        ? Math.max(1, daysUntil(targetKey, today))
        : null
      : PRESET_DAYS[preset]
  // The deadline is judged in study days, not calendar days.
  const targetStudyDays =
    targetDays === null || !targetKey
      ? null
      : Math.max(1, countStudyDays(toDateKey(today), targetKey, studyDays))
  const plan =
    targetDays === null
      ? null
      : showInterviewDate
        ? roles.length
          ? estimatePlan({
              roleIds: roles,
              dailyHours: hours,
              targetDays: targetStudyDays ?? targetDays,
              experience,
            })
          : null
        : roadmap
          ? (() => {
              const s = roadmapDefaultSummary(roadmap, experience)
              return estimateFromMinutes({
                moduleCount: s.modules,
                totalMinutes: s.minutes,
                dailyHours: hours,
                targetDays: targetStudyDays ?? targetDays,
              })
            })()
          : null

  return (
    <section aria-labelledby="target-heading" className="space-y-6">
      <div className="space-y-1.5">
        <h2
          id="target-heading"
          className="font-heading text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Set your pace
        </h2>
        <p className="text-sm text-muted-foreground">
          Tell us who you are and how much time you have. Your target changes
          the plan, never your saved progress.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-7">
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Your name</Label>
            <Input
              id="displayName"
              placeholder="e.g. Shahab"
              autoComplete="given-name"
              aria-required="true"
              aria-invalid={!!errors.displayName}
              aria-describedby={
                errors.displayName ? "displayName-error" : undefined
              }
              className="sm:max-w-sm"
              {...form.register("displayName")}
            />
            <FieldError
              id="displayName-error"
              message={errors.displayName?.message}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="hours">
                How much time can you study each day?
              </Label>
              <span className="font-heading text-lg font-semibold tabular-nums">
                {hours}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {hours === 1 ? "hour" : "hours"} a day
                </span>
              </span>
            </div>
            <Slider
              id="hours"
              min={0.5}
              max={8}
              step={0.5}
              value={[hours]}
              onValueChange={([v]) =>
                form.setValue("dailyStudyHours", v, { shouldDirty: true })
              }
              aria-label="Study hours each day"
            />
            <div className="flex justify-between text-[0.6875rem] text-muted-foreground">
              <span>30 minutes</span>
              <span>8 hours</span>
            </div>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">
              Which days do you study?
            </legend>
            <div className="flex flex-wrap gap-2">
              {WEEK.map(({ day, label, long }) => {
                const on = studyDays.includes(day)
                return (
                  <Button
                    key={day}
                    type="button"
                    size="sm"
                    variant={on ? "default" : "outline"}
                    aria-pressed={on}
                    aria-label={long}
                    onClick={() =>
                      form.setValue(
                        "studyDays",
                        on
                          ? studyDays.filter((d) => d !== day)
                          : [...studyDays, day],
                        { shouldDirty: true, shouldValidate: true }
                      )
                    }
                    className="w-12"
                  >
                    {label}
                  </Button>
                )
              })}
            </div>
            <FieldError
              id="studyDays-error"
              message={errors.studyDays?.message}
            />
            <p className="text-xs text-muted-foreground">
              Your plan skips the other days and your deadline counts only the
              days you pick.
            </p>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-medium">
              When do you want to be ready?
            </legend>
            <RadioGroup
              value={preset}
              onValueChange={(v) =>
                form.setValue(
                  "targetPreset",
                  v as OnboardingValues["targetPreset"],
                  { shouldDirty: true, shouldValidate: true }
                )
              }
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {PRESETS.map((p) => (
                <Label
                  key={p.value}
                  htmlFor={`preset-${p.value}`}
                  className={cn(
                    "flex cursor-pointer flex-col gap-1 rounded-xl border bg-card p-3 font-normal",
                    preset === p.value
                      ? "border-primary ring-1 ring-primary/60"
                      : "border-border hover:border-muted-foreground/40"
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <RadioGroupItem id={`preset-${p.value}`} value={p.value} />
                    {p.label}
                  </span>
                  <span className="ps-6 text-xs text-muted-foreground">
                    {p.hint}
                  </span>
                </Label>
              ))}
            </RadioGroup>
            {preset === "custom" && (
              <div className="space-y-1.5">
                <Label htmlFor="targetDate">Be ready by</Label>
                <Input
                  id="targetDate"
                  type="date"
                  min={tomorrow}
                  className="w-full sm:w-52"
                  value={customDate ?? ""}
                  onChange={(e) =>
                    form.setValue("targetDate", e.target.value || null, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  aria-invalid={!!errors.targetDate}
                  aria-describedby={
                    errors.targetDate ? "targetDate-error" : undefined
                  }
                />
                <FieldError
                  id="targetDate-error"
                  message={errors.targetDate?.message}
                />
              </div>
            )}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="targetRole">
                Job you are aiming for{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="targetRole"
                placeholder="e.g. Full Stack Developer at a product company"
                {...form.register("targetRole")}
              />
              <FieldError
                id="targetRole-error"
                message={errors.targetRole?.message}
              />
            </div>
            {showInterviewDate && (
              <div className="space-y-1.5">
                <Label htmlFor="interviewDate">
                  Interview date{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="interviewDate"
                  type="date"
                  min={toDateKey(today)}
                  className="w-full sm:w-52"
                  value={form.watch("interviewDate") ?? ""}
                  onChange={(e) =>
                    form.setValue("interviewDate", e.target.value || null, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  aria-invalid={!!errors.interviewDate}
                  aria-describedby={
                    errors.interviewDate ? "interviewDate-error" : undefined
                  }
                />
                <FieldError
                  id="interviewDate-error"
                  message={errors.interviewDate?.message}
                />
              </div>
            )}
          </div>
        </div>

        <aside
          aria-label="Your plan at a glance"
          className="h-fit space-y-3 rounded-xl border border-border bg-card p-5 text-sm lg:sticky lg:top-6"
        >
          <h3 className="lr-eyebrow">Your plan at a glance</h3>
          <dl className="space-y-2.5">
            <div>
              <dt className="text-xs text-muted-foreground">Study time</dt>
              <dd className="font-medium">
                {hours} {hours === 1 ? "hour" : "hours"} a day,{" "}
                {Math.round(hours * 7 * 10) / 10} hours a week
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Ready by</dt>
              <dd className="font-medium" data-testid="glance-date">
                {targetKey
                  ? format(new Date(targetKey + "T00:00:00"), "d MMM yyyy")
                  : "Choose a date"}
                {targetDays !== null && (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    ({targetDays} days)
                  </span>
                )}
              </dd>
            </div>
            {plan && (
              <>
                <div>
                  <dt className="text-xs text-muted-foreground">Your plan</dt>
                  <dd className="font-medium">
                    {plan.moduleCount} modules, about {plan.totalHours} hours
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">
                    At your pace
                  </dt>
                  <dd className="font-medium">
                    {plan.fits
                      ? `Fits: about ${plan.daysNeeded} days needed`
                      : `Needs about ${plan.daysNeeded} days, or ${plan.requiredHoursPerDay} hours a day`}
                  </dd>
                </div>
              </>
            )}
          </dl>
          <p className="text-xs text-muted-foreground">
            These are planning estimates. You review and change the full
            syllabus on the last step.
          </p>
        </aside>
      </div>
    </section>
  )
}
