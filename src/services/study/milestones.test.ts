import { describe, expect, it } from "vitest"
import { phasesOf } from "@/data/catalog/phases"
import { defineProject } from "@/data/projects/author"
import { defaultsForRoadmap } from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import type { ScheduledBlock } from "@/services/planner/schedule"
import type { QuestionProgress } from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { topicIdOf } from "@/utils/topic-id"
import {
  plannedWeeks,
  weekEndOf,
  weekMilestones,
  weekStartOf,
  type MilestoneInput,
} from "./milestones"
import { resolvePhases } from "./roadmap"

const block = (
  date: string,
  moduleId: string,
  topic: string,
  minutes = 60,
  done = false
): ScheduledBlock => ({
  id: topicIdOf(moduleId, topic),
  topicId: topicIdOf(moduleId, topic),
  moduleId,
  moduleTitle: moduleId === "java-core" ? "Core Java" : moduleId,
  topic,
  minutes,
  part: null,
  deferred: false,
  date,
  done,
  missed: false,
  moved: false,
  afterDeadline: false,
})
const lesson = (
  slug: string,
  order: number,
  topic: string,
  checks = 4
): StudyLessonIndexEntry => ({
  id: `lesson.java-core.${slug}`,
  moduleId: "java-core",
  slug,
  file: `java-core/0${order}-${slug}`,
  order,
  title: slug,
  topic,
  topicId: topicIdOf("java-core", topic),
  minutes: 30,
  overview: "o",
  objectives: 2,
  check: Array.from({ length: checks }, (_, i) => ({
    id: `c${i}`,
    type: "single" as const,
  })),
  assignment: { checklist: 3, minutes: 10 },
  exercises: [],
  prerequisites: [],
  resources: 1,
})
const done = (id: string) => ({
  [id]: { questionId: id, completed: true } as QuestionProgress,
})

const entries = resolveSyllabus({
  defaults: defaultsForRoadmap("java-full-stack-ai"),
  overrides: {},
  experience: "fresher",
  scope: "study",
})
const views = resolvePhases(phasesOf("java-full-stack-ai"), entries)

// 2026-11-02 is a Monday
const W1 = "2026-11-02"
const W2 = "2026-11-09"
const blocks = [
  block("2026-11-03", "java-core", "Basics"),
  block("2026-11-05", "java-core", "Data types"),
  block("2026-11-10", "java-core", "Strings"),
  block("2026-11-11", "java-exceptions", "Exceptions"),
]
const index = [
  lesson("first", 1, "Basics"),
  lesson("second", 2, "Basics"),
  lesson("types", 3, "Data types"),
]
const input = (over: Partial<MilestoneInput> = {}): MilestoneInput => ({
  blocks,
  views,
  index,
  projects: [],
  roadmapId: "java-full-stack-ai",
  progress: {},
  attempts: [],
  ...over,
})

describe("weeks", () => {
  it("run Monday to Sunday and are listed only when something is planned", () => {
    expect(weekStartOf("2026-11-08")).toBe(W1) // a Sunday belongs to the week before
    expect(weekStartOf("2026-11-09")).toBe(W2)
    expect(weekEndOf(W1)).toBe("2026-11-08")
    expect(plannedWeeks(blocks)).toEqual([W1, W2])
  })
})

describe("a week's milestones", () => {
  it("lists the topics planned, their lessons and assignments, with done derived from progress", () => {
    const m = weekMilestones(
      W1,
      input({
        progress: {
          ...done("lesson.java-core.first"),
          ...done("task.java-core.first.1"),
        },
      })
    )
    expect(m.topics.map((t) => t.topic)).toEqual(["Basics", "Data types"])
    expect(m.lessons.map((l) => [l.entry.slug, l.finished])).toEqual([
      ["first", true],
      ["second", false],
      ["types", false],
    ])
    expect(m.assignments.find((a) => a.entry.slug === "first")).toMatchObject({
      done: 1,
      total: 3,
    })
    expect(m.topicsWithoutLessons).toEqual([])
  })

  it("says which topics have no lesson yet instead of inventing any", () => {
    const m = weekMilestones(W2, input())
    expect(m.lessons).toEqual([])
    expect(m.topicsWithoutLessons.map((t) => t.topic)).toEqual([
      "Strings",
      "Exceptions",
    ])
  })

  it("a topic is done when its record is complete or all its blocks are", () => {
    const viaBlocks = weekMilestones(
      W1,
      input({
        blocks: [
          block("2026-11-03", "java-core", "Basics", 60, true),
          ...blocks.slice(1),
        ],
      })
    )
    expect(viaBlocks.topics.find((t) => t.topic === "Basics")!.done).toBe(true)
    const viaRecord = weekMilestones(
      W1,
      input({ progress: done(topicIdOf("java-core", "Data types")) })
    )
    expect(viaRecord.topics.find((t) => t.topic === "Data types")!.done).toBe(
      true
    )
  })

  it("puts a module's quiz in the week its last block lands, only when its lessons hold enough items", () => {
    const only = [
      block("2026-11-03", "java-core", "Basics"),
      block("2026-11-05", "java-core", "Data types"),
    ]
    const m = weekMilestones(W1, input({ blocks: only }))
    expect(m.quizzes.map((q) => q.quiz.id)).toContain("module.java-core")
    expect(m.quizzes.find((q) => q.quiz.id === "module.java-core")!.path).toBe(
      "/study/quiz/module/java-core"
    )
    // Core Java continues into the next week, so its quiz is not due in week 1
    expect(
      weekMilestones(W1, input()).quizzes.map((q) => q.quiz.id)
    ).not.toContain("module.java-core")
    // too few items: no quiz
    expect(
      weekMilestones(
        W1,
        input({ blocks: only, index: [lesson("first", 1, "Basics", 2)] })
      ).quizzes
    ).toEqual([])
  })

  it("puts a phase quiz in the week its last block lands, when its lessons hold enough items", () => {
    const m = weekMilestones(W2, input())
    expect(m.quizzes.map((q) => q.quiz.id)).toContain(
      "phase.java-full-stack-ai.1"
    )
    expect(m.quizzes.find((q) => q.quiz.kind === "phase")!.reason).toBe(
      "Phase 1 ends this week"
    )
    expect(
      weekMilestones(W1, input()).quizzes.map((q) => q.quiz.id)
    ).not.toContain("phase.java-full-stack-ai.1")
  })

  it("marks a quiz passed once an attempt passed", () => {
    const only = [block("2026-11-03", "java-core", "Basics")]
    const attempts = [
      {
        id: "a",
        quizId: "module.java-core",
        kind: "module" as const,
        takenAt: "2026-11-04T09:00:00.000Z",
        seed: 1,
        total: 6,
        correct: 6,
        passMark: 0.7,
        passed: true,
        items: [],
      },
    ]
    const m = weekMilestones(W1, input({ blocks: only, attempts }))
    expect(m.quizzes[0].passed).toBe(true)
  })

  it("lists a project step the week after the lessons it follows are scheduled to end", () => {
    const project = defineProject({
      id: "demo",
      kind: "mini",
      title: "Demo",
      summary: "s",
      hours: 4,
      roadmaps: [{ roadmapId: "java-full-stack-ai", phase: 1 }],
      buildsOn: ["lesson.java-core.first", "lesson.java-core.types"],
      userStories: ["a", "b", "c"],
      requirements: ["a", "b", "c"],
      steps: [
        {
          title: "One",
          summary: "s",
          acceptance: ["a1", "a2"],
          afterLessons: ["lesson.java-core.first"],
        },
        {
          title: "Two",
          summary: "s",
          acceptance: ["b1", "b2"],
          afterLessons: [],
        },
        {
          title: "Three",
          summary: "s",
          acceptance: ["c1", "c2"],
          afterLessons: ["lesson.java-core.types"],
        },
      ],
    })
    // "first" is in Basics (3 Nov, week 1) -> step One due week 2; Two inherits; "types" (5 Nov) -> Three due week 2
    const w2 = weekMilestones(W2, input({ projects: [project] }))
    expect(w2.projectSteps.map((s) => s.title)).toEqual(["One", "Two", "Three"])
    expect(
      weekMilestones(W1, input({ projects: [project] })).projectSteps
    ).toEqual([])
    const ticked = { ...done("proj.demo.1"), ...done("proj.demo.2") }
    expect(
      weekMilestones(
        W2,
        input({ projects: [project], progress: ticked })
      ).projectSteps.map((s) => s.done)
    ).toEqual([true, false, false])
  })

  it("leaves a project step out when its lessons are not scheduled or not written", () => {
    const project = defineProject({
      id: "demo2",
      kind: "mini",
      title: "Demo2",
      summary: "s",
      hours: 4,
      roadmaps: [{ roadmapId: "java-full-stack-ai", phase: 1 }],
      buildsOn: ["lesson.java-core.unwritten"],
      userStories: ["a", "b", "c"],
      requirements: ["a", "b", "c"],
      steps: [
        {
          title: "One",
          summary: "s",
          acceptance: ["a1", "a2"],
          afterLessons: ["lesson.java-core.unwritten"],
        },
        { title: "Two", summary: "s", acceptance: ["b1", "b2"] },
        { title: "Three", summary: "s", acceptance: ["c1", "c2"] },
      ],
    })
    for (const w of [W1, W2])
      expect(
        weekMilestones(w, input({ projects: [project] })).projectSteps
      ).toEqual([])
  })
})
