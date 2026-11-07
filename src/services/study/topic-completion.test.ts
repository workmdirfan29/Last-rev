import { describe, expect, it } from "vitest"
import type { QuestionProgress } from "@/types/learner"
import type { StudyLessonIndexEntry } from "@/types/lesson"
import { topicLessons } from "./topic-completion"

const l = (
  slug: string,
  order: number,
  minutes: number
): StudyLessonIndexEntry => ({
  id: `lesson.m.${slug}`,
  moduleId: "m",
  slug,
  file: `m/0${order}-${slug}`,
  order,
  title: slug,
  topic: "T",
  topicId: "topic.m.t",
  minutes,
  overview: "o",
  objectives: 2,
  check: [],
  assignment: { checklist: 3, minutes: 10 },
  exercises: [],
  prerequisites: [],
  resources: 1,
})
const done = (id: string) => ({
  [id]: { questionId: id, completed: true } as QuestionProgress,
})

describe("a topic through its lessons", () => {
  const index = [l("a", 1, 45), l("b", 2, 45)]
  it("completes only when the lessons cover the topic (within 25%) and all are finished", () => {
    const none = topicLessons("m", "T", 90, index, {})
    expect(none).toMatchObject({
      finished: 0,
      covers: true,
      allFinished: false,
      complete: false,
    })
    expect(none.next?.slug).toBe("a")
    const one = topicLessons("m", "T", 90, index, done("lesson.m.a"))
    expect(one.next?.slug).toBe("b")
    expect(one.complete).toBe(false)
    const both = topicLessons("m", "T", 90, index, {
      ...done("lesson.m.a"),
      ...done("lesson.m.b"),
    })
    expect(both.complete).toBe(true)
  })
  it("never completes a topic whose lessons are only part-written", () => {
    const part = topicLessons(
      "m",
      "T",
      180,
      [l("a", 1, 45)],
      done("lesson.m.a")
    )
    expect(part).toMatchObject({
      covers: false,
      allFinished: true,
      complete: false,
    })
  })
  it("a topic without lessons has nothing to complete", () => {
    expect(topicLessons("m", "Other", 60, index, {})).toMatchObject({
      lessons: [],
      complete: false,
      next: null,
    })
  })
})
