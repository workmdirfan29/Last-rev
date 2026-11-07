import type { QuestionProgress } from "@/types/learner"
import { acceptanceItems, projectTickId, type Project } from "@/types/project"

type Progress = Readonly<Record<string, QuestionProgress>>

export interface ProjectProgress {
  done: number
  total: number
  percent: number
  /** Ticks done and total per step, in order. */
  steps: { done: number; total: number }[]
  complete: boolean
}

/** A project's progress is the learner's ticks of its acceptance items, nothing else. */
export function projectProgress(
  p: Project,
  progress: Progress
): ProjectProgress {
  const items = acceptanceItems(p)
  const steps = p.steps.map(() => ({ done: 0, total: 0 }))
  let done = 0
  for (const it of items) {
    steps[it.stepIndex].total++
    if (progress[projectTickId(p.id, it.n)]?.completed) {
      steps[it.stepIndex].done++
      done++
    }
  }
  return {
    done,
    total: items.length,
    percent: items.length ? Math.round((done / items.length) * 100) : 0,
    steps,
    complete: items.length > 0 && done === items.length,
  }
}

/** A step is done when all its acceptance items are ticked. */
export const stepDone = (pp: ProjectProgress, stepIndex: number) =>
  pp.steps[stepIndex].total > 0 &&
  pp.steps[stepIndex].done === pp.steps[stepIndex].total

/** The learner's pasted link, accepted only as an https URL; anything else is rejected, never stored. */
export function parseRepoUrl(
  raw: string
): { ok: true; url: string } | { ok: false; reason: string } {
  const v = raw.trim()
  if (v === "") return { ok: true, url: "" }
  if (v.length > 300) return { ok: false, reason: "That link is too long." }
  try {
    const u = new URL(v)
    if (u.protocol !== "https:")
      return { ok: false, reason: "Use a link that starts with https://" }
    return { ok: true, url: u.toString() }
  } catch {
    return {
      ok: false,
      reason:
        "That does not look like a link. Use https://… or leave it empty.",
    }
  }
}
