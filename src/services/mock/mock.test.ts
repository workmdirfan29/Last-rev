import { describe, expect, it } from "vitest"
import { MODULE_BY_ID, MODULES } from "@/data/catalog/modules"
import { MOCK_TYPE_DEFS } from "@/data/mock/types"
import { RUBRIC_DIMENSIONS } from "@/data/mock/rubric"
import { QUESTION_INDEX } from "@/data/questions/index.generated"
import {
  learnerProfileSchema,
  mockConfigSchema,
  type CustomQuestion,
  type MockSession,
} from "@/types/learner"
import { customToIndexEntry } from "@/services/content/custom-questions"
import { matchKeywords } from "./keywords"
import {
  buildPool,
  defaultLevels,
  drawQuestions,
  seededRandom,
  typeHasQuestions,
  type PoolInput,
} from "./pool"
import { currentRubric } from "./rubric"
import { ratingPoints, scoreQuestion, scoreSession } from "./score"
import { blankAnswer, newSession } from "./session"

const profile = learnerProfileSchema.parse({
  updatedAt: "2026-11-03T00:00:00.000Z",
  selectedRoles: ["frontend-developer"],
  primaryRole: "frontend-developer",
  experience: "fresher",
})
const base = (over: Partial<PoolInput> = {}): PoolInput => ({
  type: "technical",
  levels: ["fresher"],
  difficulty: "any",
  moduleIds: [],
  index: QUESTION_INDEX,
  own: [],
  profile,
  progress: {},
  ...over,
})
const mine = (id: string, moduleId = "project-questions"): CustomQuestion => ({
  id: `${moduleId}.fresher.my-${id}-abcd`,
  moduleId,
  level: "fresher",
  title: `My question ${id}`,
  answer: "",
  tags: [],
  note: "",
  createdAt: "2026-11-03T00:00:00.000Z",
  updatedAt: "2026-11-03T00:00:00.000Z",
})

const config = (over = {}) =>
  mockConfigSchema.parse({
    type: "technical",
    count: 4,
    durationMinutes: 20,
    levels: ["fresher"],
    ...over,
  })

function session(
  answers: Record<string, Record<string, number>>,
  over: Partial<MockSession> = {},
  cfg = {}
): MockSession {
  const ids = Object.keys(answers)
  const s = newSession({
    config: config(cfg),
    questionIds: ids,
    requested: ids.length,
    seed: 1,
    now: new Date("2026-11-03T10:00:00.000Z"),
  })
  return {
    ...s,
    answers: ids.map((id) => ({
      ...blankAnswer(id),
      text:
        Object.keys(answers[id]).length || id.includes("answered")
          ? "my answer"
          : "",
      ratings: answers[id],
    })),
    ...over,
  }
}

describe("the rubric", () => {
  it("has weights that add up to 100 for each kind, and the weights from the spec", () => {
    for (const dims of Object.values(RUBRIC_DIMENSIONS))
      expect(dims.reduce((n, d) => n + d.weight, 0)).toBe(100)
    expect(RUBRIC_DIMENSIONS.technical.map((d) => d.weight)).toEqual([
      30, 20, 15, 15, 10, 10,
    ])
    expect(RUBRIC_DIMENSIONS.hr.map((d) => d.weight)).toEqual([
      25, 25, 20, 20, 10,
    ])
    expect(RUBRIC_DIMENSIONS.hr.some((d) => d.id === "accuracy")).toBe(false)
  })
})

describe("scoring", () => {
  const rubric = currentRubric()
  const all = (r: number) =>
    Object.fromEntries(RUBRIC_DIMENSIONS.technical.map((d) => [d.id, r]))

  it("turns a rating of 1 into 0, 3 into 50 and 5 into 100", () => {
    expect([1, 2, 3, 4, 5].map(ratingPoints)).toEqual([0, 25, 50, 75, 100])
  })

  it("is the weighted mean of what was rated, over the weights of those dimensions only", () => {
    const a = {
      ...blankAnswer("react.fresher.x"),
      text: "t",
      ratings: { accuracy: 5, completeness: 1 },
    }
    const q = scoreQuestion(a, rubric, false)
    // accuracy 30 x 100 + completeness 20 x 0 = 3000, over 50
    expect(q.weightUsed).toBe(50)
    expect(q.points).toBeCloseTo(60, 9)
    expect(q.lines.filter((l) => l.used).map((l) => l.id)).toEqual([
      "accuracy",
      "completeness",
    ])
    // every rating at 5 is 100, at 1 is 0, at 3 is 50 whatever the weights
    expect(scoreQuestion({ ...a, ratings: all(5) }, rubric, false).points).toBe(
      100
    )
    expect(scoreQuestion({ ...a, ratings: all(1) }, rubric, false).points).toBe(
      0
    )
    expect(scoreQuestion({ ...a, ratings: all(3) }, rubric, false).points).toBe(
      50
    )
  })

  it("gives an unrated question no points at all, never a default", () => {
    const a = { ...blankAnswer("react.fresher.x"), text: "typed but not rated" }
    expect(scoreQuestion(a, rubric, false).points).toBeNull()
    expect(
      scoreQuestion({ ...a, keywordsHit: 3, keywordsTotal: 3 }, rubric, true)
        .points
    ).toBeNull() // keywords alone never score
  })

  it("uses the HR weights for HR questions (no technical accuracy)", () => {
    const a = {
      ...blankAnswer("hr-teamwork.fresher.x"),
      text: "t",
      ratings: { structure: 5, completeness: 1 },
    }
    const q = scoreQuestion(a, rubric, false)
    expect(q.kind).toBe("hr")
    expect(q.weightUsed).toBe(50) // 25 + 25
    expect(q.points).toBe(50)
  })

  it("leaves the text match out of the total by default, and adds it as one named, renormalised line when switched on", () => {
    const a = {
      ...blankAnswer("react.fresher.x"),
      text: "t",
      ratings: { accuracy: 5 },
      keywordsHit: 1,
      keywordsTotal: 4,
    }
    const off = scoreQuestion(a, rubric, false)
    const on = scoreQuestion(a, rubric, true)
    expect(off.points).toBe(100)
    expect(off.lines.some((l) => l.id === "keywords")).toBe(false)
    expect(on.lines.filter((l) => l.id === "keywords")).toHaveLength(1)
    expect(on.weightUsed).toBe(40) // 30 + 10
    expect(on.points).toBeCloseTo((30 * 100 + 10 * 25) / 40, 9)
    // the session-level default: nothing about keywords reaches the score unless the config says so
    const s = session({ "react.fresher.a": { accuracy: 5 } })
    s.answers[0] = { ...s.answers[0], keywordsHit: 0, keywordsTotal: 5 }
    expect(scoreSession(s).score).toBe(100)
    expect(
      scoreSession({ ...s, config: { ...s.config, includeKeywords: true } })
        .score
    ).toBeCloseTo((30 * 100 + 0) / 40, 9)
  })

  it("scores a session as the mean of rated questions, with the 'if counted as zero' line beside it", () => {
    const s = session({
      "react.fresher.a": all(5),
      "react.fresher.b": all(3),
      "javascript.fresher.c": {},
      "javascript.fresher.d": {},
    })
    s.answers[2] = { ...s.answers[2], text: "typed, not rated" }
    const r = scoreSession(s)
    expect(r.asked).toBe(4)
    expect(r.answered).toBe(3)
    expect(r.rated).toBe(2)
    expect(r.score).toBe(75)
    expect(r.scoreIfZero).toBe(37.5) // 150 / 4
    expect(r.unanswered).toEqual(["javascript.fresher.d"])
    expect(r.unrated).toEqual(["javascript.fresher.c"])
  })

  it("has no score when nothing was rated", () => {
    const s = session({ "react.fresher.a": {} })
    expect(scoreSession(s)).toMatchObject({
      score: null,
      scoreIfZero: null,
      rated: 0,
    })
  })

  it("labels modules strong, weak or 'not enough answers' by the documented thresholds", () => {
    const s = session({
      "react.fresher.a": all(5),
      "react.fresher.b": all(5),
      "sql.fresher.a": all(1),
      "sql.fresher.b": all(2),
      "javascript.fresher.a": all(5),
      "react-hooks.fresher.a": all(3),
      "react-hooks.fresher.b": all(3),
    })
    const byModule = Object.fromEntries(
      scoreSession(s).modules.map((m) => [m.moduleId, m])
    )
    expect(byModule.react.status).toBe("strong")
    expect(byModule.sql.status).toBe("weak")
    expect(byModule.javascript.status).toBe("not-enough") // one rated question is not enough to judge a module
    expect(byModule["react-hooks"].status).toBe("middle")
    const r = scoreSession(s)
    expect(r.strong).toEqual(["react"])
    expect(r.weak).toEqual(["sql"])
    expect(r.weakQuestions).toEqual(["sql.fresher.a", "sql.fresher.b"])
  })

  it("averages the learner's own ratings per dimension and says how many ratings each rests on", () => {
    const s = session({
      "react.fresher.a": { accuracy: 4, communication: 2 },
      "react.fresher.b": { accuracy: 2 },
    })
    const dims = Object.fromEntries(
      scoreSession(s).dimensions.map((d) => [d.id, d])
    )
    expect(dims.accuracy).toMatchObject({ average: 3, n: 2 })
    expect(dims.communication).toMatchObject({ average: 2, n: 1 })
  })

  it("recomputes an old session from its own rubric snapshot, even after the weights change", () => {
    const s = session({ "react.fresher.a": { accuracy: 5, completeness: 1 } })
    const before = scoreSession(s).score
    const changed = {
      ...s,
      rubric: {
        ...s.rubric,
        kinds: {
          ...s.rubric.kinds,
          technical: s.rubric.kinds.technical.map((d) => ({
            ...d,
            weight: d.weight * 2,
          })),
        },
      },
    }
    expect(scoreSession(s).score).toBe(before) // untouched
    expect(scoreSession(changed).score).toBe(before) // doubling every weight changes nothing here, but the snapshot is what is used
    const skewed = {
      ...s,
      rubric: {
        ...s.rubric,
        kinds: {
          ...s.rubric.kinds,
          technical: s.rubric.kinds.technical.map((d) =>
            d.id === "accuracy" ? { ...d, weight: 1 } : d
          ),
        },
      },
    }
    expect(scoreSession(skewed).score).not.toBe(before)
  })
})

describe("keyword text match", () => {
  it("is plain, case-insensitive and whole-term", () => {
    const m = matchKeywords(
      "React uses a Virtual DOM and keys; hooks are great.",
      ["virtual dom", "keys", "hook", "Reconciliation", "keys"]
    )
    expect(m.matched.sort()).toEqual(["keys", "virtual dom"])
    expect(m.total).toBe(4) // duplicates counted once; "hook" is not a whole-term match for "hooks"
  })
  it("treats regex characters literally", () => {
    expect(matchKeywords("use C++ here", ["C++"]).matched).toEqual(["C++"])
    expect(matchKeywords("anything", ["a.c"]).matched).toEqual([])
  })
})

describe("question pools", () => {
  it("HR draws only from hr-* modules and is level-neutral", () => {
    const pool = buildPool(base({ type: "hr", levels: ["advanced"] }))
    expect(pool.length).toBeGreaterThan(0)
    expect(pool.every((q) => q.moduleId.startsWith("hr-"))).toBe(true)
  })

  it("Technical draws the learner's syllabus modules at the chosen levels, never HR", () => {
    const pool = buildPool(base())
    expect(pool.length).toBeGreaterThan(0)
    expect(
      pool.every((q) => !q.moduleId.startsWith("hr-") && q.level === "fresher")
    ).toBe(true)
    const none = buildPool(base({ levels: ["advanced"] }))
    expect(none).toEqual([])
    // narrowing to one module
    const only = buildPool(base({ moduleIds: ["react"] }))
    expect([...new Set(only.map((q) => q.moduleId))]).toEqual(["react"])
  })

  it("path types use their own domains, so a type with no questions is empty instead of borrowing others'", () => {
    expect(typeHasQuestions(base({ type: "java" }))).toBeGreaterThan(0)
    // Data-driven: the Java pool draws only from the java-backend domain, whichever of its modules are released.
    expect(
      buildPool(base({ type: "java" })).every((q) =>
        MOCK_TYPE_DEFS.java.domains!.includes(
          MODULE_BY_ID.get(q.moduleId)!.domainId
        )
      )
    ).toBe(true)
    const mern = new Set(
      buildPool(base({ type: "mern" })).map((q) => q.moduleId)
    )
    expect(mern.has("react")).toBe(true)
    expect(mern.has("sql")).toBe(false) // SQL is a database module: Technical, Mixed and Custom only
    // Data-driven: whether Python or Data Science have questions changes as content is released. Whatever the pool
    // holds, it comes only from the type's own domains (and is empty when there are none), never borrowed from SQL etc.
    for (const type of ["python", "data-science"] as const) {
      const domains = MOCK_TYPE_DEFS[type].domains!
      expect(
        buildPool(base({ type })).every((q) =>
          domains.includes(MODULE_BY_ID.get(q.moduleId)!.domainId)
        )
      ).toBe(true)
    }
  })

  it("Project uses project-questions and the learner's own questions, with no difficulty filter on theirs", () => {
    // authored project questions only, when the learner has none of their own
    const authored = buildPool(base({ type: "project" }))
    expect(authored.length).toBeGreaterThan(0)
    expect(authored.every((q) => q.moduleId === "project-questions")).toBe(true)
    expect(authored.some((q) => q.mine)).toBe(false)
    const pool = buildPool(
      base({
        type: "project",
        own: [mine("a"), mine("b", "react")].map(customToIndexEntry),
        difficulty: "hard",
      })
    )
    // both of the learner's questions are drawn, whatever their difficulty
    const own = pool.filter((q) => q.mine)
    expect(own.length).toBe(2)
    expect(own.map((q) => q.title)).toContain("My question a")
    // the authored questions are still filtered by difficulty
    expect(
      pool.filter((q) => !q.mine).every((q) => q.difficulty === "hard")
    ).toBe(true)
  })

  it("Mixed is Technical plus HR; Custom offers any module with questions", () => {
    const mixed = buildPool(base({ type: "mixed" }))
    expect(mixed.some((q) => q.moduleId.startsWith("hr-"))).toBe(true)
    expect(mixed.some((q) => !q.moduleId.startsWith("hr-"))).toBe(true)
    const custom = buildPool(
      base({ type: "custom", moduleIds: ["sql", "hr-teamwork"] })
    )
    // only modules that have questions are drawn from, whatever was chosen
    const expected = ["sql", "hr-teamwork"].filter((id) =>
      QUESTION_INDEX.some((q) => q.moduleId === id)
    )
    expect(new Set(custom.map((q) => q.moduleId))).toEqual(new Set(expected))
    // Data-driven: which modules still have no questions changes as content is released, so the module for the
    // "nothing to draw from" case is picked at run time. If every module has questions there is nothing to check.
    const empty = MODULES.find(
      (m) => !QUESTION_INDEX.some((q) => q.moduleId === m.id)
    )
    if (empty)
      expect(
        buildPool(base({ type: "custom", moduleIds: [empty.id] }))
      ).toEqual([])
  })

  it("filters by difficulty and leaves out removed questions", () => {
    const easy = buildPool(base({ difficulty: "easy" }))
    expect(easy.length).toBeGreaterThan(0)
    expect(easy.every((q) => q.difficulty === "easy")).toBe(true)
    const first = buildPool(base())[0]
    const progress = {
      [first.id]: { questionId: first.id, removed: true },
    } as never
    expect(buildPool(base({ progress })).some((q) => q.id === first.id)).toBe(
      false
    )
  })

  it("defaults the levels from the learner's experience", () => {
    expect(defaultLevels("beginner")).toEqual(["fresher"])
    expect(defaultLevels("fresher")).toEqual(["fresher"])
    expect(defaultLevels("intermediate")).toEqual(["intermediate"])
    expect(defaultLevels("advanced")).toEqual(["advanced"])
  })
})

describe("the draw", () => {
  const pool = buildPool(base())
  const opts = (count: number, seed = 7) => ({
    count,
    seed,
    preferUnpractised: false,
    progress: {},
  })

  it("is seeded: the same seed gives the same questions, another seed another order", () => {
    const a = drawQuestions(pool, "technical", opts(10, 1)).ids
    expect(drawQuestions(pool, "technical", opts(10, 1)).ids).toEqual(a)
    expect(drawQuestions(pool, "technical", opts(10, 2)).ids).not.toEqual(a)
    const r1 = seededRandom(5),
      r2 = seededRandom(5)
    expect([r1(), r1()]).toEqual([r2(), r2()])
  })

  it("never repeats a question and never pads: a short pool runs with what it has", () => {
    const short = pool.slice(0, 12)
    const d = drawQuestions(short, "technical", opts(30))
    expect(d.ids).toHaveLength(12)
    expect(new Set(d.ids).size).toBe(12)
    expect(d.requested).toBe(30)
    expect(d.ids.every((id) => short.some((q) => q.id === id))).toBe(true)
    expect(drawQuestions([], "technical", opts(5)).ids).toEqual([])
    const full = drawQuestions(pool, "technical", opts(20))
    expect(new Set(full.ids).size).toBe(20)
  })

  it("prefers questions not yet practised when asked, and only then falls back to practised ones", () => {
    const practised = Object.fromEntries(
      pool
        .slice(0, pool.length - 3)
        .map((q) => [q.id, { questionId: q.id, completed: true }])
    ) as never
    const d = drawQuestions(pool, "technical", {
      count: 5,
      seed: 3,
      preferUnpractised: true,
      progress: practised,
    })
    const fresh = pool.slice(pool.length - 3).map((q) => q.id)
    expect(fresh.every((id) => d.ids.includes(id))).toBe(true)
    expect(d.ids).toHaveLength(5)
  })

  it("draws Mixed in proportion and always includes an HR question when the pool has one and the count is 4 or more", () => {
    const mixed = buildPool(base({ type: "mixed" }))
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const d = drawQuestions(mixed, "mixed", { ...opts(4, seed) })
      expect(d.ids).toHaveLength(4)
      expect(d.hrCount).toBeGreaterThanOrEqual(1)
      expect(d.ids.some((id) => id.startsWith("hr-"))).toBe(true)
    }
    const small = drawQuestions(mixed, "mixed", opts(3, 1))
    expect(small.ids).toHaveLength(3)
    // a short technical part is topped up from HR, never padded
    const hrOnly = mixed.filter((q) => q.moduleId.startsWith("hr-"))
    const few = [
      ...hrOnly.slice(0, 10),
      ...mixed.filter((q) => !q.moduleId.startsWith("hr-")).slice(0, 2),
    ]
    const d = drawQuestions(few, "mixed", opts(8, 2))
    expect(d.ids).toHaveLength(8)
    expect(new Set(d.ids).size).toBe(8)
  })
})
