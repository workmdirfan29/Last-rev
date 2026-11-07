import { useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getRole } from "@/data/catalog/roles"
import { CurriculumBuilder } from "@/features/curriculum/curriculum-builder"
import { resolveTargetDate } from "@/services/planner/estimate"
import { countStudyDays, dateOfStudyDay } from "@/services/planner/schedule"
import { toDateKey } from "@/utils/dates"
import type { OnboardingValues } from "../schema"

/** Days to the deadline and its label for the current pace and target choice. */
function deadlineOf(v: OnboardingValues) {
  const date = resolveTargetDate(v.targetPreset, v.targetDate)
  // The deadline is counted in the learner's study days, not calendar days.
  const days = date
    ? Math.max(1, countStudyDays(toDateKey(new Date()), date, v.studyDays))
    : null
  return { date, days }
}

/** Shared by both review steps: the learner can move the deadline or the daily time from the feasibility options. */
export function useReviewAdjustments(form: UseFormReturn<OnboardingValues>) {
  return {
    extendDeadline(days: number) {
      form.setValue("targetPreset", "custom", {
        shouldDirty: true,
        shouldValidate: true,
      })
      // `days` is a number of study days; turn it into the calendar date it falls on.
      form.setValue(
        "targetDate",
        dateOfStudyDay(
          toDateKey(new Date()),
          Math.max(2, days),
          form.getValues("studyDays")
        ),
        { shouldDirty: true, shouldValidate: true }
      )
    },
    increaseDaily(minutes: number) {
      const hours = Math.min(12, Math.max(0.5, Math.ceil(minutes / 30) / 2))
      form.setValue("dailyStudyHours", hours, { shouldDirty: true })
    },
  }
}

/** Interview Prep review: the full preparation syllabus, customisable before the learner starts. */
export function ReviewStep({
  form,
}: {
  form: UseFormReturn<OnboardingValues>
}) {
  const v = form.watch()
  const { date, days } = useMemo(() => deadlineOf(v), [v])
  const adjust = useReviewAdjustments(form)

  return (
    <section aria-labelledby="review-heading" className="space-y-6">
      <div className="space-y-1.5">
        <h2
          id="review-heading"
          className="font-heading text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Review your preparation syllabus
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Your personalized learning and interview preparation plan. Review
          modules, customize your syllabus and choose what to prioritize.
        </p>
      </div>

      {v.selectedRoles.length > 1 && (
        <fieldset className="space-y-2">
          <legend className="text-xs/relaxed font-medium">
            Primary path (shown on your overview)
          </legend>
          <RadioGroup
            value={v.primaryRole ?? v.selectedRoles[0]}
            onValueChange={(id) =>
              form.setValue("primaryRole", id, { shouldDirty: true })
            }
            className="grid gap-2 sm:grid-cols-2"
          >
            {v.selectedRoles.map((id) => (
              <Label
                key={id}
                htmlFor={`primary-${id}`}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card p-3 font-normal"
              >
                <RadioGroupItem id={`primary-${id}`} value={id} />
                {getRole(id)?.title}
              </Label>
            ))}
          </RadioGroup>
        </fieldset>
      )}

      <CurriculumBuilder
        source={{ kind: "roles", roleIds: v.selectedRoles }}
        experience={v.experience}
        dailyMinutes={Math.round(v.dailyStudyHours * 60)}
        targetDays={days}
        deadlineLabel={date}
        value={v.syllabusOverrides}
        onChange={(next) =>
          form.setValue("syllabusOverrides", next, { shouldDirty: true })
        }
        knownSkillIds={v.knownSkills}
        onExtendDeadline={adjust.extendDeadline}
        onIncreaseDaily={adjust.increaseDaily}
        barClassName="bottom-[4.75rem]"
      />
    </section>
  )
}
