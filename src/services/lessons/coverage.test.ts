import { describe, expect, it } from "vitest"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { lessonCoverage, lessonCoverageText } from "./coverage"

const entry = (
  moduleId: string,
  slug: string,
  topic: string,
  minutes: number
): StudyLessonIndexEntry => ({
  id: `lesson.${moduleId}.${slug}`,
  moduleId,
  slug,
  file: `${moduleId}/01-${slug}`,
  order: 1,
  title: slug,
  topic,
  topicId: "t",
  minutes,
  overview: "o",
  objectives: 2,
  check: [],
  assignment: { checklist: 3, minutes: 10 },
  exercises: [],
  prerequisites: [],
  resources: 1,
})
const mod = {
  id: "m",
  topicList: [
    { title: "A", minutes: 60 },
    { title: "B", minutes: 90 },
    { title: "C", minutes: 0 },
  ],
}

describe("lesson coverage", () => {
  it("says 'in preparation' with no lessons and counts only topics that have minutes", () => {
    const c = lessonCoverage(mod, [])
    expect(c).toMatchObject({ lessons: 0, topicsCovered: 0, topicsTotal: 2 })
    expect(lessonCoverageText(c)).toBe("in preparation")
  })

  it("counts lessons ready and the topics they cover, once per topic", () => {
    const index = [
      entry("m", "a1", "A", 30),
      entry("m", "a2", "A", 30),
      entry("other", "x", "B", 40),
    ]
    const c = lessonCoverage(mod, index)
    expect(c).toMatchObject({
      lessons: 2,
      topicsCovered: 1,
      topicsTotal: 2,
      lessonMinutes: 60,
      coveredTopicMinutes: 60,
    })
    expect(lessonCoverageText(c)).toBe("2 ready · covers 1 of 2 topics")
  })
})
