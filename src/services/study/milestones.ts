import { addDays, parseISO, startOfWeek } from "date-fns"
import type { ScheduledBlock } from "@/services/planner/schedule"
import type { QuestionProgress, QuizAttempt } from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { type Project } from "@/types/project"
import { fromDateKey, toDateKey } from "@/utils/dates"
import { topicIdOf } from "@/utils/topic-id"
import { assignmentProgress, lessonFinished } from "./progress"
import { projectProgress, stepDone } from "./projects"
import {
  moduleQuizInfo,
  phaseQuizInfo,
  quizPath,
  type QuizInfo,
} from "./quizzes"
import type { PhaseView } from "./roadmap"

type Progress = Readonly<Record<string, QuestionProgress>>

/** Weeks run Monday to Sunday, like the plan's week strip. */
export const weekStartOf = (dateKey: string): string =>
  toDateKey(startOfWeek(fromDateKey(dateKey), { weekStartsOn: 1 }))
export const weekEndOf = (weekStart: string): string =>
  toDateKey(addDays(parseISO(weekStart), 6))

export interface WeekTopic {
  topicId: string
  moduleId: string
  moduleTitle: string
  topic: string
  minutes: number
  done: boolean
}
export interface WeekQuiz {
  quiz: QuizInfo
  path: string
  passed: boolean
  /** Why it is due this week: the module's or phase's last planned block lands in it. */
  reason: string
}
export interface WeekStep {
  project: Project
  stepIndex: number
  title: string
  done: boolean
}
export interface WeekMilestones {
  weekStart: string
  weekEnd: string
  topics: WeekTopic[]
  lessons: { entry: StudyLessonIndexEntry; finished: boolean }[]
  assignments: { entry: StudyLessonIndexEntry; done: number; total: number }[]
  quizzes: WeekQuiz[]
  projectSteps: WeekStep[]
  /** Topics planned this week that have no lesson yet. */
  topicsWithoutLessons: WeekTopic[]
}

export interface MilestoneInput {
  blocks: readonly ScheduledBlock[]
  views: readonly PhaseView[]
  index: readonly StudyLessonIndexEntry[]
  projects: readonly Project[]
  roadmapId: string
  progress: Progress
  attempts: readonly QuizAttempt[]
}

const maxDate = (dates: readonly string[]) =>
  dates.reduce((a, b) => (a > b ? a : b))

/** Every Monday that has planned blocks, in order. */
export function plannedWeeks(
  blocks: readonly Pick<ScheduledBlock, "date">[]
): string[] {
  return [...new Set(blocks.map((b) => weekStartOf(b.date)))].sort()
}

/**
 * What the study plan asks of one week, derived from the schedule and the learner's records (nothing is stored):
 * the topics planned, their lessons and assignments, the module and phase quizzes that fall due when a module's or
 * phase's last block lands in the week, and the project steps that become due once their lessons are scheduled.
 */
export function weekMilestones(
  week: string,
  input: MilestoneInput
): WeekMilestones {
  const { blocks, views, index, projects, progress, attempts } = input
  const end = weekEndOf(week)
  const inWeek = blocks.filter((b) => b.date >= week && b.date <= end)

  const topicMap = new Map<string, WeekTopic>()
  for (const b of inWeek) {
    const prev = topicMap.get(b.topicId)
    const allBlocksDone = blocks
      .filter((x) => x.topicId === b.topicId)
      .every((x) => x.done)
    topicMap.set(b.topicId, {
      topicId: b.topicId,
      moduleId: b.moduleId,
      moduleTitle: b.moduleTitle,
      topic: b.topic,
      minutes: (prev?.minutes ?? 0) + b.minutes,
      done: progress[b.topicId]?.completed === true || allBlocksDone,
    })
  }
  const topics = [...topicMap.values()]

  const lessons = topics
    .flatMap((t) => index.filter((l) => l.topicId === t.topicId))
    .sort((a, b) => a.moduleId.localeCompare(b.moduleId) || a.order - b.order)
  const topicsWithoutLessons = topics.filter(
    (t) => !index.some((l) => l.topicId === t.topicId)
  )

  // quizzes: a module's quiz is due in the week its last planned block lands; a phase's likewise
  const lastDateOfModule = new Map<string, string>()
  for (const b of blocks)
    lastDateOfModule.set(
      b.moduleId,
      maxDate([b.date, lastDateOfModule.get(b.moduleId) ?? b.date])
    )
  const quizzes: WeekQuiz[] = []
  const seenModules = new Set(topics.map((t) => t.moduleId))
  for (const moduleId of seenModules) {
    const last = lastDateOfModule.get(moduleId)
    if (!last || last < week || last > end) continue
    const title = topics.find((t) => t.moduleId === moduleId)!.moduleTitle
    const q = moduleQuizInfo(moduleId, title, index, progress, attempts)
    if (q.available)
      quizzes.push({
        quiz: q,
        path: quizPath(q),
        passed: q.summary.passed,
        reason: `${title} ends this week`,
      })
  }
  for (const v of views) {
    if (v.projectLed) continue
    const phaseTopics = new Set(
      v.modules.flatMap((m) =>
        m.topics.map((t) => topicIdOf(m.module.id, t.title))
      )
    )
    const dates = blocks
      .filter((b) => phaseTopics.has(b.topicId))
      .map((b) => b.date)
    if (dates.length === 0) continue
    const last = maxDate(dates)
    if (last < week || last > end) continue
    const q = phaseQuizInfo(v, index, progress, attempts)
    if (q.available)
      quizzes.push({
        quiz: q,
        path: quizPath(q),
        passed: q.summary.passed,
        reason: `Phase ${v.phase.number} ends this week`,
      })
  }

  // project steps: due the week after the lessons they follow are scheduled to end
  const lastDateOfTopic = new Map<string, string>()
  for (const b of blocks)
    lastDateOfTopic.set(
      b.topicId,
      maxDate([b.date, lastDateOfTopic.get(b.topicId) ?? b.date])
    )
  const projectSteps: WeekStep[] = []
  for (const project of projects) {
    const pp = projectProgress(project, progress)
    let previous: string | null = null
    project.steps.forEach((step, i) => {
      const lessonIds = step.afterLessons.length
        ? step.afterLessons
        : i === 0
          ? project.buildsOn
          : []
      let available: string | null = previous
      if (lessonIds.length > 0) {
        const dates: string[] = []
        let known = true
        for (const id of lessonIds) {
          const e = index.find((l) => l.id === id)
          const d = e ? lastDateOfTopic.get(e.topicId) : undefined
          if (!d) known = false
          else dates.push(d)
        }
        available = known && dates.length > 0 ? maxDate(dates) : null
      }
      previous = available
      if (!available) return
      const dueWeek = weekStartOf(toDateKey(addDays(parseISO(available), 7)))
      if (dueWeek === week)
        projectSteps.push({
          project,
          stepIndex: i,
          title: step.title,
          done: stepDone(pp, i),
        })
    })
  }

  return {
    weekStart: week,
    weekEnd: end,
    topics,
    lessons: lessons.map((entry) => ({
      entry,
      finished: lessonFinished(entry.id, progress),
    })),
    assignments: lessons.map((entry) => ({
      entry,
      ...assignmentProgress(entry, progress),
    })),
    quizzes,
    projectSteps,
    topicsWithoutLessons,
  }
}
