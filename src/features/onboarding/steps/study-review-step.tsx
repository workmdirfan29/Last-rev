import { useMemo } from "react"
import { resolveTargetDate } from "@/services/planner/estimate"
import { countStudyDays } from "@/services/planner/schedule"
import { toDateKey } from "@/utils/dates"
import type { UseFormReturn } from "react-hook-form"
import { CurriculumBuilder } from "@/features/curriculum/curriculum-builder"
import type { OnboardingValues } from "../schema"
import { useReviewAdjustments } from "./review-step"

/** Study Path review: the roadmap's syllabus, with the same builder as Interview Prep. */
export function StudyReviewStep({
  form,
}: {
  form: UseFormReturn<OnboardingValues>
}) {
  const v = form.watch()
  const adjust = useReviewAdjustments(form)
  const { date, days } = useMemo(() => {
    const d = resolveTargetDate(v.targetPreset, v.targetDate)
    // The deadline is counted in the learner's study days.
    return {
      date: d,
      days: d
        ? Math.max(1, countStudyDays(toDateKey(new Date()), d, v.studyDays))
        : null,
    }
  }, [v.targetPreset, v.targetDate, v.studyDays])

  return (
    <section aria-labelledby="study-review-heading" className="space-y-6">
      <div className="space-y-1.5">
        <h2
          id="study-review-heading"
          className="font-heading text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Review your study syllabus
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          The modules of your roadmap, in learning order. Review them, customize
          what you study and choose what to prioritize.
        </p>
      </div>
      <CurriculumBuilder
        source={{ kind: "roadmap", roadmapId: v.studyRoadmap }}
        experience={v.experience}
        dailyMinutes={Math.round(v.dailyStudyHours * 60)}
        targetDays={days}
        deadlineLabel={date}
        value={v.studySyllabusOverrides}
        onChange={(next) =>
          form.setValue("studySyllabusOverrides", next, { shouldDirty: true })
        }
        knownSkillIds={v.knownSkills}
        onExtendDeadline={adjust.extendDeadline}
        onIncreaseDaily={adjust.increaseDaily}
        barClassName="bottom-[4.75rem]"
      />
    </section>
  )
}
