import { describe, expect, it } from "vitest"
import { DEFAULT_FILTERS, filterQuestions, scoreMatch } from "./search"
import type { QuestionIndexEntry } from "@/types/content"
import type { QuestionProgress } from "@/types/learner"

const mk = (
  id: string,
  over: Partial<QuestionIndexEntry> = {}
): QuestionIndexEntry => ({
  id,
  moduleId: "react",
  level: "fresher",
  topic: "Basics",
  difficulty: "easy",
  title: `Title ${id}`,
  keywords: [],
  estimatedMinutes: 3,
  ...over,
})

const prog = (
  id: string,
  over: Partial<QuestionProgress> = {}
): QuestionProgress => ({
  questionId: id,
  completed: false,
  bookmarked: false,
  difficult: false,
  revision: false,
  confidence: 0,
  note: "",
  attempts: 0,
  revisionStage: 0,
  nextReviewAt: null,
  completedAt: null,
  removed: false,
  lastStudiedAt: null,
  updatedAt: "2026-11-02T00:00:00.000Z",
  ...over,
})

describe("scoreMatch", () => {
  const doc = {
    title: "What is a closure?",
    topic: "Closures",
    keywords: ["scope", "lexical"],
    shortAnswer: "A function plus its scope",
  }

  it("returns a positive score for an empty query", () => {
    expect(scoreMatch(doc, "")).toBeGreaterThan(0)
  })
  it("requires every token to match", () => {
    expect(scoreMatch(doc, "closure lexical")).toBeGreaterThan(0)
    expect(scoreMatch(doc, "closure banana")).toBe(0)
  })
  it("weights title above answer text", () => {
    expect(scoreMatch(doc, "closure")).toBeGreaterThan(
      scoreMatch(doc, "function")
    )
  })
  it("is case-insensitive and handles symbols like C# and .NET", () => {
    expect(
      scoreMatch({ title: "C# basics", topic: "x", keywords: [] }, "c#")
    ).toBeGreaterThan(0)
  })
})

describe("filterQuestions", () => {
  const items = [
    mk("a", {
      difficulty: "hard",
      level: "advanced",
      title: "Hard advanced thing",
    }),
    mk("b", { difficulty: "easy", title: "Easy one", topic: "Lists" }),
    mk("c", {
      difficulty: "medium",
      level: "intermediate",
      title: "Medium closure thing",
      keywords: ["closure"],
    }),
  ]

  it("keeps default order grouped by level", () => {
    expect(
      filterQuestions(items, DEFAULT_FILTERS, {}).map((i) => i.id)
    ).toEqual(["b", "c", "a"])
  })
  it("filters by level, difficulty and topic", () => {
    expect(
      filterQuestions(
        items,
        { ...DEFAULT_FILTERS, levels: ["advanced"] },
        {}
      ).map((i) => i.id)
    ).toEqual(["a"])
    expect(
      filterQuestions(
        items,
        { ...DEFAULT_FILTERS, difficulties: ["easy", "medium"] },
        {}
      ).map((i) => i.id)
    ).toEqual(["b", "c"])
    expect(
      filterQuestions(items, { ...DEFAULT_FILTERS, topic: "Lists" }, {}).map(
        (i) => i.id
      )
    ).toEqual(["b"])
  })
  it("filters by learner status", () => {
    const progress = {
      a: prog("a", { completed: true }),
      b: prog("b", { bookmarked: true }),
    }
    expect(
      filterQuestions(
        items,
        { ...DEFAULT_FILTERS, status: "completed" },
        progress
      ).map((i) => i.id)
    ).toEqual(["a"])
    expect(
      filterQuestions(
        items,
        { ...DEFAULT_FILTERS, status: "bookmarked" },
        progress
      ).map((i) => i.id)
    ).toEqual(["b"])
    expect(
      filterQuestions(
        items,
        { ...DEFAULT_FILTERS, status: "todo" },
        progress
      ).map((i) => i.id)
    ).toEqual(["b", "c"])
  })
  it("sorts by relevance when searching", () => {
    const out = filterQuestions(
      items,
      { ...DEFAULT_FILTERS, query: "closure", sort: "relevance" },
      {}
    )
    expect(out.map((i) => i.id)).toEqual(["c"])
  })
  it("sorts by difficulty and by incomplete-first", () => {
    expect(
      filterQuestions(
        items,
        { ...DEFAULT_FILTERS, sort: "difficulty" },
        {}
      ).map((i) => i.id)
    ).toEqual(["b", "c", "a"])
    const progress = { b: prog("b", { completed: true }) }
    expect(
      filterQuestions(
        items,
        { ...DEFAULT_FILTERS, sort: "completion" },
        progress
      ).map((i) => i.id)[2]
    ).toBe("b")
  })
  it("falls back to default order for relevance sort without a query", () => {
    expect(
      filterQuestions(items, { ...DEFAULT_FILTERS, sort: "relevance" }, {}).map(
        (i) => i.id
      )
    ).toEqual(["b", "c", "a"])
  })
})
