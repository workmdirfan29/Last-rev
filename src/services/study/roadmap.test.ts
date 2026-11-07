import { describe, expect, it } from "vitest"
import { ROADMAPS } from "@/data/catalog/roadmaps"
import { phasesOf } from "@/data/catalog/phases"
import { defaultsForRoadmap } from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import type { QuestionProgress } from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { topicIdOf } from "@/utils/topic-id"
import {
  currentPhase,
  lessonsInPhase,
  phaseState,
  phaseStats,
  resolvePhases,
  roadmapLessons,
} from "./roadmap"
import { moduleProgress } from "./module-progress"
import { moduleQuizId } from "./quiz"

const java = ROADMAPS[0]
const entries = (overrides = {}) =>
  resolveSyllabus({
    defaults: defaultsForRoadmap(java.id),
    overrides,
    experience: "fresher",
    scope: "study",
  })

const lesson = (
  moduleId: string,
  slug: string,
  topic: string,
  order = 1,
  extra: Partial<StudyLessonIndexEntry> = {}
): StudyLessonIndexEntry => ({
  id: `lesson.${moduleId}.${slug}`,
  moduleId,
  slug,
  file: `${moduleId}/0${order}-${slug}`,
  order,
  title: slug,
  topic,
  topicId: topicIdOf(moduleId, topic),
  minutes: 40,
  overview: "o",
  objectives: 2,
  check: [
    { id: "a", type: "single" },
    { id: "b", type: "single" },
    { id: "c", type: "single" },
  ],
  assignment: { checklist: 3, minutes: 10 },
  exercises: [],
  prerequisites: [],
  resources: 1,
  ...extra,
})
const done = (id: string): QuestionProgress => ({
  questionId: id,
  completed: true,
  bookmarked: false,
  difficult: false,
  revision: false,
  confidence: 0,
  note: "",
  attempts: 0,
  revisionStage: 0,
  nextReviewAt: null,
  completedAt: "2026-11-04T09:00:00.000Z",
  removed: false,
  lastStudiedAt: null,
  updatedAt: "2026-11-04T09:00:00.000Z",
})

describe("resolving phases against the learner's syllabus", () => {
  it("keeps the phases in order, narrows each to selected modules, and counts what was taken out", () => {
    const views = resolvePhases(
      phasesOf(java.id),
      entries({ "java-multithreading": { selected: false } })
    )
    expect(views).toHaveLength(12)
    const p1 = views[0]
    expect(p1.modules.map((m) => m.module.id)).not.toContain(
      "java-multithreading"
    )
    // dev-tools is optional (off by default) and multithreading was taken out
    const base = resolvePhases(phasesOf(java.id), entries())[0].hiddenModules
    expect(p1.hiddenModules).toBe(base + 1)
    expect(p1.projectLed).toBe(false)
    expect(views[11].projectLed).toBe(true)
    expect(views[7].modules.map((m) => m.module.id)).toContain(
      "backend-architecture"
    )
  })

  it("restricts a split module to the topics of the phase", () => {
    const mern = ROADMAPS.find((r) => r.id === "mern-full-stack-ai")!
    const views = resolvePhases(
      phasesOf(mern.id),
      resolveSyllabus({
        defaults: defaultsForRoadmap(mern.id),
        overrides: {},
        experience: "fresher",
        scope: "study",
      })
    )
    const js1 = views[0].modules.find((m) => m.module.id === "javascript")!
    const js2 = views[1].modules.find((m) => m.module.id === "javascript")!
    expect(js1.topics.map((t) => t.title)).toContain("Data types")
    expect(js1.topics.map((t) => t.title)).not.toContain("Closures")
    expect(js2.topics.map((t) => t.title)).toContain("Closures")
  })
})

describe("phase statistics come from the lessons that exist", () => {
  const views = resolvePhases(phasesOf(java.id), entries())
  const index = [
    lesson("java-core", "first-program", "Basics", 1),
    lesson("java-core", "variables", "Basics", 2),
    lesson("java-core", "strings-intro", "Strings", 3),
    lesson("java-oop", "classes", "Classes & objects", 1),
  ]

  it("counts lessons ready and finished, topics covered and done, and the quiz pool, per phase", () => {
    const progress = {
      "lesson.java-core.first-program": done("lesson.java-core.first-program"),
      [topicIdOf("java-core", "Basics")]: done(
        topicIdOf("java-core", "Basics")
      ),
    }
    const s1 = phaseStats(views[0], index, progress)
    expect(s1).toMatchObject({
      lessonsReady: 3,
      lessonsFinished: 1,
      topicsDone: 1,
      topicsCovered: 2,
      modulesWithLessons: 1,
      checkItems: 9,
    })
    expect(s1.topicsTotal).toBeGreaterThan(20)
    const s2 = phaseStats(views[1], index, progress)
    expect(s2.lessonsReady).toBe(1)
    expect(lessonsInPhase(views[1], index).map((l) => l.slug)).toEqual([
      "classes",
    ])
    const s3 = phaseStats(views[2], index, progress)
    expect(s3).toMatchObject({
      lessonsReady: 0,
      lessonsFinished: 0,
      checkItems: 0,
    })
  })

  it("names the state honestly: in preparation without lessons, project-led without modules, done only when every topic is", () => {
    const none = phaseStats(views[2], [], {})
    expect(phaseState(views[2], none)).toBe("in-preparation")
    expect(phaseState(views[11], phaseStats(views[11], [], {}))).toBe(
      "project-led"
    )
    expect(phaseState(views[0], phaseStats(views[0], index, {}))).toBe(
      "not-started"
    )
    expect(
      phaseState(
        views[0],
        phaseStats(views[0], index, {
          "lesson.java-core.first-program": done("x"),
        })
      )
    ).toBe("in-progress")
    const allTopics = Object.fromEntries(
      views[3].modules.flatMap((m) =>
        m.topics.map((t) => [topicIdOf(m.module.id, t.title), done("t")])
      )
    )
    expect(phaseState(views[3], phaseStats(views[3], [], allTopics))).toBe(
      "done"
    )
  })

  it("orders ready lessons by phase, module and lesson, and finds the current phase", () => {
    expect(roadmapLessons(views, index).map((l) => l.slug)).toEqual([
      "first-program",
      "variables",
      "strings-intro",
      "classes",
    ])
    expect(currentPhase(views, index, {})?.phase.number).toBe(1)
    const allP1 = Object.fromEntries(
      views[0].modules.flatMap((m) =>
        m.topics.map((t) => [topicIdOf(m.module.id, t.title), done("t")])
      )
    )
    expect(currentPhase(views, index, allP1)?.phase.number).toBe(2)
  })
})

describe("module completion", () => {
  const mod = {
    id: "java-core",
    topicList: [
      { title: "Basics", minutes: 90 },
      { title: "Strings", minutes: 130 },
    ],
  }
  const l1 = lesson("java-core", "first-program", "Basics", 1)
  const noQuestions = { done: 0, available: 0 }

  it("with no lessons and no questions it is topics alone; with questions it is the old 50/50", () => {
    const p = { [topicIdOf("java-core", "Basics")]: done("t") }
    expect(moduleProgress(mod, [], p, [], noQuestions).percent).toBeCloseTo(0.5)
    expect(
      moduleProgress(mod, [], p, [], { done: 10, available: 20 }).percent
    ).toBeCloseTo(0.5)
    expect(
      moduleProgress(mod, [], p, [], { done: 20, available: 20 }).percent
    ).toBeCloseTo(0.75)
  })

  it("lessons add practice and quizzes as equal parts, and the raw counts are exact", () => {
    const progress = {
      [topicIdOf("java-core", "Basics")]: done("t"),
      "lesson.java-core.first-program": done("l"),
      "task.java-core.first-program.1": done("t1"),
    }
    const attempts = [
      {
        id: "a",
        quizId: l1.id,
        kind: "lesson" as const,
        takenAt: "2026-11-04T09:00:00.000Z",
        seed: 1,
        total: 3,
        correct: 3,
        passMark: 0.7,
        passed: true,
        items: [],
      },
    ]
    const m = moduleProgress(mod, [l1], progress, attempts, {
      done: 5,
      available: 20,
    })
    expect(m.topics).toEqual({ done: 1, total: 2 })
    expect(m.lessons).toEqual({ done: 1, total: 1 })
    expect(m.assignments).toEqual({ done: 1, total: 3 })
    expect(m.checks).toEqual({ passed: 1, total: 1 })
    expect(m.moduleQuiz.exists).toBe(false) // 3 items is below the pool a module quiz needs
    expect(m.components).toMatchObject({
      learning: 0.5,
      practice: 1 / 3,
      quizzes: 1,
      questions: 0.25,
    })
    expect(m.percent).toBeCloseTo((0.5 + 1 / 3 + 1 + 0.25) / 4)
  })

  it("a module quiz appears once the lessons hold enough items, and counts when passed", () => {
    const big = [l1, lesson("java-core", "variables", "Basics", 2)]
    const none = moduleProgress(mod, big, {}, [], noQuestions)
    expect(none.moduleQuiz).toEqual({ exists: true, passed: false })
    const pass = moduleProgress(
      mod,
      big,
      {},
      [
        {
          id: "q",
          quizId: moduleQuizId("java-core"),
          kind: "module",
          takenAt: "2026-11-04T09:00:00.000Z",
          seed: 1,
          total: 6,
          correct: 5,
          passMark: 0.7,
          passed: true,
          items: [],
        },
      ],
      noQuestions
    )
    expect(pass.moduleQuiz.passed).toBe(true)
    expect(pass.components.quizzes).toBeCloseTo(1 / 3)
  })
})
