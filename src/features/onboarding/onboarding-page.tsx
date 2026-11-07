import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon, ArrowRightIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brand } from "@/components/shared/brand"
import { useLearnerStore } from "@/stores/learner-store"
import { MODE_HOME } from "@/app/nav"
import { FooterSlotContext } from "@/features/curriculum/footer-slot"
import { planStateSchema, type LearningMode } from "@/types/learner"
import {
  onboardingSchema,
  profilePatchFromValues,
  studyOnboardingSchema,
  studyPatchFromValues,
  valuesFromProfile,
  type OnboardingValues,
} from "./schema"
import { RoadmapStep } from "./steps/roadmap-step"
import { StudyReviewStep } from "./steps/study-review-step"
import { RoleStep } from "./steps/role-step"
import { ExperienceStep } from "./steps/experience-step"
import { SkillsStep } from "./steps/skills-step"
import { TargetStep } from "./steps/target-step"
import { ReviewStep } from "./steps/review-step"

type StepDef = {
  id: string
  label: string
  optional?: boolean
  fields: (keyof OnboardingValues)[]
  Component: typeof RoleStep
}

const INTERVIEW_STEPS: StepDef[] = [
  {
    id: "role",
    label: "Career path",
    fields: ["selectedRoles"],
    Component: RoleStep,
  },
  {
    id: "experience",
    label: "Experience",
    fields: ["experience"],
    Component: ExperienceStep,
  },
  {
    id: "skills",
    label: "Skills",
    optional: true,
    fields: [],
    Component: SkillsStep,
  },
  {
    id: "target",
    label: "Pace & target",
    fields: [
      "dailyStudyHours",
      "studyDays",
      "targetPreset",
      "targetDate",
      "interviewDate",
      "displayName",
      "targetRole",
    ],
    Component: TargetStep,
  },
  { id: "review", label: "Review", fields: [], Component: ReviewStep },
]

/** Study Path has no interview date, so its pace step hides that field. */
const StudyPaceStep: typeof RoleStep = ({ form }) => (
  <TargetStep form={form} showInterviewDate={false} />
)

const STUDY_STEPS: StepDef[] = [
  {
    id: "roadmap",
    label: "Roadmap",
    fields: ["studyRoadmap"],
    Component: RoadmapStep,
  },
  {
    id: "experience",
    label: "Experience",
    fields: ["experience"],
    Component: ExperienceStep,
  },
  {
    id: "target",
    label: "Pace & target",
    fields: [
      "dailyStudyHours",
      "studyDays",
      "targetPreset",
      "targetDate",
      "displayName",
      "targetRole",
    ],
    Component: StudyPaceStep,
  },
  { id: "review", label: "Review", fields: [], Component: StudyReviewStep },
]

const INTRO: Record<LearningMode, { eyebrow: string; title: string }> = {
  interview: {
    eyebrow: "Interview Prep",
    title: "Set up your interview preparation",
  },
  study: { eyebrow: "Study Path", title: "Set up your study plan" },
}

export function OnboardingPage({
  mode,
  kind = "interview",
}: {
  mode: "first" | "edit"
  /** Which journey is being set up. */
  kind?: LearningMode
}) {
  const navigate = useNavigate()
  const profile = useLearnerStore((s) => s.profile)
  const saveProfile = useLearnerStore((s) => s.saveProfile)
  const updatePreferences = useLearnerStore((s) => s.updatePreferences)
  const STEPS = kind === "study" ? STUDY_STEPS : INTERVIEW_STEPS
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [footerSlot, setFooterSlot] = useState<HTMLElement | null>(null)
  // A field to focus once the step that holds it is on screen (set when finishing jumps back to a step).
  const focusAfterStep = useRef<keyof OnboardingValues | null>(null)

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(
      kind === "study" ? studyOnboardingSchema : onboardingSchema
    ) as Resolver<OnboardingValues>,
    defaultValues: valuesFromProfile(profile, kind),
    mode: "onChange",
  })

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const StepComponent = current.Component

  useEffect(() => {
    if (focusAfterStep.current) {
      form.setFocus(focusAfterStep.current)
      focusAfterStep.current = null
    }
  }, [step, form])

  const firstError = (fields: (keyof OnboardingValues)[]) =>
    fields.find((f) => form.getFieldState(f).error)

  async function next() {
    if (current.fields.length && !(await form.trigger(current.fields))) {
      const field = firstError(current.fields)
      if (field) form.setFocus(field)
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({ top: 0 })
  }

  async function finish() {
    if (!(await form.trigger())) {
      // Take the learner to the step that needs fixing, with the field focused.
      for (let i = 0; i < STEPS.length; i++) {
        const field = firstError(STEPS[i].fields)
        if (field) {
          if (i === step) form.setFocus(field)
          else {
            focusAfterStep.current = field
            setStep(i)
          }
          window.scrollTo({ top: 0 })
          break
        }
      }
      return
    }
    setSaving(true)
    try {
      const now = new Date()
      const values = form.getValues()
      // The study days belong to this journey's plan; the plan's other fields are the learner's own changes and stay.
      const plans = profile?.plans ?? {
        interview: planStateSchema.parse({}),
        study: planStateSchema.parse({}),
      }
      const plansPatch = {
        plans: {
          ...plans,
          [kind]: { ...plans[kind], studyDays: [...values.studyDays].sort() },
        },
      }
      await saveProfile(
        kind === "study"
          ? {
              ...studyPatchFromValues(values, now),
              ...plansPatch,
              studyOnboardedAt: profile?.studyOnboardedAt ?? now.toISOString(),
            }
          : {
              ...profilePatchFromValues(values, now),
              ...plansPatch,
              onboardedAt: profile?.onboardedAt ?? now.toISOString(),
            }
      )
      await updatePreferences({ lastMode: kind })
      navigate(MODE_HOME[kind], { replace: true })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Brand />
        {mode === "edit" ? (
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        ) : (
          <Button asChild variant="ghost">
            <Link to="/choose">Change mode</Link>
          </Button>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-32 sm:px-6">
        <div className="mb-8 space-y-3">
          {mode === "first" && step === 0 && (
            <div className="space-y-2 pb-3">
              <p className="lr-eyebrow flex items-center gap-1.5">
                <SparklesIcon className="size-3.5 text-brand-ink" aria-hidden />{" "}
                {INTRO[kind].eyebrow}
              </p>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {INTRO[kind].title}
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground">
                A few quick choices set up your plan. Everything stays in this
                browser — no account, no upload.
              </p>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Step {step + 1} of {STEPS.length} ·{" "}
              <span className="text-foreground">{current.label}</span>
              {current.optional && " (optional)"}
            </span>
          </div>
          <Progress
            value={((step + 1) / STEPS.length) * 100}
            aria-label="Onboarding progress"
          />
        </div>

        <FooterSlotContext.Provider value={footerSlot}>
          <StepComponent form={form} />
        </FooterSlotContext.Provider>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          {/* The review step puts its summary here, so there is one bar and nothing overlaps the page. */}
          <div
            ref={setFooterSlot}
            className="order-first w-full min-w-0 empty:hidden sm:order-none sm:w-auto sm:flex-1"
          />
          <div className="ms-auto flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeftIcon /> Back
            </Button>
            {current.optional && (
              <Button variant="ghost" onClick={next}>
                Skip this step
              </Button>
            )}
            {isLast ? (
              <Button onClick={finish} disabled={saving}>
                {mode === "edit"
                  ? "Save changes"
                  : kind === "study"
                    ? "Start studying"
                    : "Start preparing"}
                <ArrowRightIcon />
              </Button>
            ) : (
              <Button onClick={next}>
                Continue to {STEPS[step + 1].label} <ArrowRightIcon />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
