import { useCallback, useMemo } from "react"
import {
  generateQuestions,
  pendingChanges,
  reconcile,
} from "@/services/resume/generate"
import { parseResume } from "@/services/resume/parse"
import { useLearnerStore } from "@/stores/learner-store"
import { resumeProfileSchema, type ResumeProfile } from "@/types/learner"

/** The saved resume and what updating its questions would change. */
export function useResume() {
  const resume = useLearnerStore((s) => s.resume)
  const questions = useLearnerStore((s) => s.resumeQuestions)
  const pending = useMemo(
    () =>
      resume
        ? pendingChanges(questions, generateQuestions(resume, resume))
        : null,
    [resume, questions]
  )
  return { resume, questions, pending }
}

export function useResumeActions() {
  const saveResume = useLearnerStore((s) => s.saveResume)
  const setQuestions = useLearnerStore((s) => s.setResumeQuestions)

  /** Make a profile from the lines the learner chose to use. Nothing but the reviewed profile is kept. */
  const build = useCallback(
    async (lines: readonly string[], sourceName: string) => {
      const parsed = parseResume(lines)
      const now = new Date().toISOString()
      const profile = resumeProfileSchema.parse({
        ...parsed.profile,
        sourceName,
        importedAt: now,
        updatedAt: now,
      })
      await saveResume(profile)
      const existing = useLearnerStore.getState().resumeQuestions
      await setQuestions(
        reconcile(existing, generateQuestions(profile, profile), now)
      )
      return parsed.counts
    },
    [saveResume, setQuestions]
  )

  /** Bring the questions in line with the profile as it is now. */
  const update = useCallback(
    async (profile: ResumeProfile) => {
      const now = new Date().toISOString()
      const existing = useLearnerStore.getState().resumeQuestions
      await setQuestions(
        reconcile(existing, generateQuestions(profile, profile), now)
      )
    },
    [setQuestions]
  )
  return { build, update }
}
