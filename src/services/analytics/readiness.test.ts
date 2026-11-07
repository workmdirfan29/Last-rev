import { describe, expect, it } from "vitest"
import { computeReadiness, scoreArea } from "./readiness"

describe("readiness", () => {
  it("returns null overall when no content is measurable", () => {
    expect(computeReadiness([])).toEqual({ overall: null, areas: [] })
    expect(
      computeReadiness([
        { area: "frontend", total: 0, completed: 0, confidenceSum: 0 },
      ]).overall
    ).toBeNull()
  })

  it("scores 0 for an untouched area", () => {
    expect(
      scoreArea({ area: "frontend", total: 10, completed: 0, confidenceSum: 0 })
        .score
    ).toBe(0)
  })

  it("applies the documented 60/40 weighting", () => {
    // 5 of 10 complete (0.5) and confidence 25/50 (0.5) → 0.6*0.5 + 0.4*0.5 = 0.5
    expect(
      scoreArea({
        area: "frontend",
        total: 10,
        completed: 5,
        confidenceSum: 25,
      }).score
    ).toBeCloseTo(0.5)
    // all complete, no confidence rated → 0.6
    expect(
      scoreArea({ area: "backend", total: 4, completed: 4, confidenceSum: 0 })
        .score
    ).toBeCloseTo(0.6)
    // perfect → 1
    expect(
      scoreArea({ area: "backend", total: 4, completed: 4, confidenceSum: 20 })
        .score
    ).toBeCloseTo(1)
  })

  it("merges inputs for the same area before scoring", () => {
    const r = computeReadiness([
      { area: "frontend", total: 5, completed: 5, confidenceSum: 25 },
      { area: "frontend", total: 5, completed: 0, confidenceSum: 0 },
    ])
    expect(r.areas).toHaveLength(1)
    expect(r.areas[0].total).toBe(10)
    expect(r.overall).toBe(50)
  })

  it("averages areas equally and ignores empty areas", () => {
    const r = computeReadiness([
      { area: "frontend", total: 10, completed: 10, confidenceSum: 50 },
      { area: "database", total: 10, completed: 0, confidenceSum: 0 },
      { area: "linux", total: 0, completed: 0, confidenceSum: 0 },
    ])
    expect(r.areas.map((a) => a.area)).toEqual(["frontend", "database"])
    expect(r.overall).toBe(50)
  })
})
