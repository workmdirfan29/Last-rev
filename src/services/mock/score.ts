import type { MockAnswer, MockSession, RubricSnapshot } from "@/types/learner"
import type { RubricKind } from "@/data/mock/rubric"
import { kindOfModule } from "./rubric"

/** A rating of 1 is worth 0 points, 3 is 50 and 5 is 100. */
export const ratingPoints = (rating: number) => ((rating - 1) / 4) * 100

export interface ScoreLine {
  id: string
  label: string
  weight: number
  /** The learner's own rating, or null when they did not rate this dimension. */
  rating: number | null
  /** Points this line contributes to the question's score before dividing by the weights used. */
  weighted: number
  /** Counted in the formula (rated, or the keyword line when switched on). */
  used: boolean
}

export interface QuestionScore {
  questionId: string
  moduleId: string
  kind: RubricKind
  lines: ScoreLine[]
  weightUsed: number
  /** 0 to 100, or null when nothing was rated ("answered, not rated": never a default). */
  points: number | null
}

export const hasAnswer = (a: MockAnswer) => a.text.trim() !== ""
const moduleOfQuestion = (id: string) => id.split(".")[0]

/**
 * One question's points: the weighted mean of the dimensions the learner rated, each rating turned into 0 to
 * 100. The keyword line is added only when the session turned it on, and it needs at least one rating.
 */
export function scoreQuestion(
  answer: MockAnswer,
  rubric: RubricSnapshot,
  includeKeywords: boolean
): QuestionScore {
  const moduleId = moduleOfQuestion(answer.questionId)
  const kind = kindOfModule(moduleId)
  const dims = rubric.kinds[kind] ?? []
  const lines: ScoreLine[] = dims.map((d) => {
    const rating = answer.ratings[d.id] ?? null
    return {
      id: d.id,
      label: d.label,
      weight: d.weight,
      rating,
      weighted: rating === null ? 0 : d.weight * ratingPoints(rating),
      used: rating !== null,
    }
  })
  const anyRated = lines.some((l) => l.used)
  if (
    includeKeywords &&
    anyRated &&
    answer.keywordsTotal !== null &&
    answer.keywordsTotal > 0 &&
    answer.keywordsHit !== null
  ) {
    lines.push({
      id: "keywords",
      label: "Keyword coverage (text match)",
      weight: rubric.keywordWeight,
      rating: null,
      weighted:
        rubric.keywordWeight *
        (answer.keywordsHit / answer.keywordsTotal) *
        100,
      used: true,
    })
  }
  const weightUsed = lines
    .filter((l) => l.used)
    .reduce((n, l) => n + l.weight, 0)
  const points =
    anyRated && weightUsed > 0
      ? lines.filter((l) => l.used).reduce((n, l) => n + l.weighted, 0) /
        weightUsed
      : null
  return {
    questionId: answer.questionId,
    moduleId,
    kind,
    lines,
    weightUsed,
    points,
  }
}

export type AreaStatus = "strong" | "weak" | "middle" | "not-enough"

export interface ModuleResult {
  moduleId: string
  asked: number
  rated: number
  mean: number | null
  status: AreaStatus
}

export interface DimensionResult {
  id: string
  label: string
  /** Average of the learner's ratings (1 to 5) and how many ratings it rests on. */
  average: number
  n: number
}

export interface SessionResult {
  asked: number
  requested: number
  answered: number
  rated: number
  unanswered: string[]
  /** Answered but not rated: they have no points and are not counted in the score. */
  unrated: string[]
  questions: QuestionScore[]
  /** Mean of the rated questions' points, or null when nothing was rated. */
  score: number | null
  /** The same total if every unanswered or unrated question counted as zero. */
  scoreIfZero: number | null
  dimensions: DimensionResult[]
  modules: ModuleResult[]
  strong: string[]
  weak: string[]
  /** Rated questions below the weak threshold. */
  weakQuestions: string[]
  secondsAnswering: number
  includeKeywords: boolean
}

const mean = (xs: number[]) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null

export function scoreSession(session: MockSession): SessionResult {
  const { rubric } = session
  const includeKeywords = session.config.includeKeywords
  const questions = session.answers.map((a) =>
    scoreQuestion(a, rubric, includeKeywords)
  )
  const byId = new Map(questions.map((q) => [q.questionId, q]))
  const answered = session.answers.filter(hasAnswer)
  const rated = questions.filter((q) => q.points !== null)
  const asked = session.questionIds.length

  const dims = new Map<string, { label: string; sum: number; n: number }>()
  for (const a of session.answers) {
    const kind = kindOfModule(moduleOfQuestion(a.questionId))
    for (const d of rubric.kinds[kind] ?? []) {
      const r = a.ratings[d.id]
      if (r === undefined) continue
      const cur = dims.get(d.id) ?? { label: d.label, sum: 0, n: 0 }
      cur.sum += r
      cur.n += 1
      dims.set(d.id, cur)
    }
  }

  const modules = new Map<string, QuestionScore[]>()
  const askedByModule = new Map<string, number>()
  for (const a of session.answers) {
    const m = moduleOfQuestion(a.questionId)
    askedByModule.set(m, (askedByModule.get(m) ?? 0) + 1)
    const q = byId.get(a.questionId)!
    if (q.points !== null) modules.set(m, [...(modules.get(m) ?? []), q])
  }
  const moduleResults: ModuleResult[] = [...askedByModule.entries()].map(
    ([moduleId, n]) => {
      const list = modules.get(moduleId) ?? []
      const m = mean(list.map((q) => q.points!))
      const status: AreaStatus =
        list.length < rubric.minRated || m === null
          ? "not-enough"
          : m >= rubric.strongAt
            ? "strong"
            : m < rubric.weakBelow
              ? "weak"
              : "middle"
      return { moduleId, asked: n, rated: list.length, mean: m, status }
    }
  )

  const total = rated.reduce((n, q) => n + q.points!, 0)
  return {
    asked,
    requested: session.requested,
    answered: answered.length,
    rated: rated.length,
    unanswered: session.answers
      .filter((a) => !hasAnswer(a))
      .map((a) => a.questionId),
    unrated: session.answers
      .filter((a) => hasAnswer(a) && byId.get(a.questionId)!.points === null)
      .map((a) => a.questionId),
    questions,
    score: rated.length ? total / rated.length : null,
    scoreIfZero: asked > 0 && rated.length ? total / asked : null,
    dimensions: [...dims.entries()].map(([id, d]) => ({
      id,
      label: d.label,
      average: d.sum / d.n,
      n: d.n,
    })),
    modules: moduleResults,
    strong: moduleResults
      .filter((m) => m.status === "strong")
      .map((m) => m.moduleId),
    weak: moduleResults
      .filter((m) => m.status === "weak")
      .map((m) => m.moduleId),
    weakQuestions: rated
      .filter((q) => q.points! < rubric.weakBelow)
      .map((q) => q.questionId),
    secondsAnswering: session.elapsedSeconds,
    includeKeywords,
  }
}
