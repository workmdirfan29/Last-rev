import { newId } from "@/utils/id"
import type { MockConfig, MockSession } from "@/types/learner"
import { currentRubric } from "./rubric"

export const blankAnswer = (questionId: string) => ({
  questionId,
  text: "",
  visited: false,
  skipped: false,
  hintUsed: false,
  secondsSpent: 0,
  ticks: [],
  ratings: {},
  keywordsHit: null,
  keywordsTotal: null,
})

export function newSession(input: {
  config: MockConfig
  questionIds: string[]
  requested: number
  seed: number
  now: Date
}): MockSession {
  const at = input.now.toISOString()
  return {
    id: newId("mock"),
    config: input.config,
    seed: input.seed,
    requested: input.requested,
    questionIds: input.questionIds,
    rubric: currentRubric(),
    status: "in-progress",
    phase: "interview",
    current: 0,
    answers: input.questionIds.map(blankAnswer),
    elapsedSeconds: 0,
    startedAt: at,
    finishedAt: null,
    updatedAt: at,
  }
}

export const durationSeconds = (c: MockConfig) => c.durationMinutes * 60
export const secondsLeft = (s: MockSession) =>
  Math.max(0, durationSeconds(s.config) - s.elapsedSeconds)
/** A guide to time per question: the duration shared across the questions. */
export const guideSeconds = (s: MockSession) =>
  s.questionIds.length
    ? Math.round(durationSeconds(s.config) / s.questionIds.length)
    : 0

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const sec = totalSeconds % 60
  return `${m}:${String(sec).padStart(2, "0")}`
}
