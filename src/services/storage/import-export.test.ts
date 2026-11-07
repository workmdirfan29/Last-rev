import { describe, expect, it } from "vitest"
import { buildExportBundle, parseImport } from "./import-export"
import { preferencesSchema } from "@/types/learner"

const prefs = preferencesSchema.parse({})
const progress = (id: string, updatedAt: string, confidence = 0) => ({
  questionId: id,
  completed: true,
  bookmarked: false,
  difficult: false,
  revision: false,
  confidence,
  note: "",
  attempts: 1,
  revisionStage: 0,
  nextReviewAt: null,
  completedAt: updatedAt,
  removed: false,
  lastStudiedAt: updatedAt,
  updatedAt,
})

describe("parseImport", () => {
  it("rejects non-JSON", () => {
    const r = parseImport("not json")
    expect(r).toEqual({ ok: false, error: "This file is not valid JSON." })
  })

  it("rejects JSON that is not a LastRev export", () => {
    const r = parseImport(JSON.stringify({ hello: "world" }))
    expect(r.ok).toBe(false)
  })

  it("rejects exports from a newer version", () => {
    const bundle = {
      ...buildExportBundle({
        profile: null,
        preferences: prefs,
        questionProgress: [],
        activity: [],
      }),
      version: 99,
    }
    const r = parseImport(JSON.stringify(bundle))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/newer version/)
  })

  it("keeps the latest record when duplicate ids are present", () => {
    const bundle = buildExportBundle({
      profile: null,
      preferences: prefs,
      questionProgress: [
        progress("react.fresher.a-b", "2026-11-01T00:00:00.000Z", 1),
        progress("react.fresher.a-b", "2026-11-02T00:00:00.000Z", 5),
        progress("react.fresher.c-d", "2026-11-01T00:00:00.000Z", 2),
      ],
      activity: [],
    })
    const r = parseImport(JSON.stringify(bundle))
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.summary.questions).toBe(2)
    expect(r.summary.duplicatesMerged).toBe(1)
    expect(
      r.bundle.questionProgress.find(
        (p) => p.questionId === "react.fresher.a-b"
      )?.confidence
    ).toBe(5)
  })

  it("rejects out-of-range values", () => {
    const bundle = buildExportBundle({
      profile: null,
      preferences: prefs,
      questionProgress: [
        progress("react.fresher.a-b", "2026-11-01T00:00:00.000Z", 9),
      ],
      activity: [],
    })
    expect(parseImport(JSON.stringify(bundle)).ok).toBe(false)
  })
})
