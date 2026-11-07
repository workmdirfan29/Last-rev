import { describe, expect, it } from "vitest"
import { computeStreak } from "./streak"

describe("computeStreak", () => {
  it("returns zeros with no activity", () => {
    expect(computeStreak([], "2026-11-02")).toEqual({
      current: 0,
      longest: 0,
      studiedToday: false,
    })
  })

  it("counts consecutive days ending today", () => {
    const r = computeStreak(
      ["2026-10-31", "2026-11-01", "2026-11-02"],
      "2026-11-02"
    )
    expect(r).toEqual({ current: 3, longest: 3, studiedToday: true })
  })

  it("keeps the streak alive if today has not been studied yet", () => {
    const r = computeStreak(["2026-10-31", "2026-11-01"], "2026-11-02")
    expect(r.current).toBe(2)
    expect(r.studiedToday).toBe(false)
  })

  it("breaks after a missed full day but remembers the longest run", () => {
    const r = computeStreak(
      ["2026-10-20", "2026-10-21", "2026-10-22", "2026-11-01"],
      "2026-11-02"
    )
    expect(r.current).toBe(1)
    expect(r.longest).toBe(3)
  })

  it("is zero when the last study day was two or more days ago", () => {
    expect(computeStreak(["2026-10-30"], "2026-11-02").current).toBe(0)
  })

  it("ignores duplicate dates and input order", () => {
    const r = computeStreak(
      ["2026-11-02", "2026-11-01", "2026-11-02"],
      "2026-11-02"
    )
    expect(r.current).toBe(2)
  })

  it("handles month boundaries", () => {
    const r = computeStreak(
      ["2026-10-30", "2026-10-31", "2026-11-01"],
      "2026-11-01"
    )
    expect(r.current).toBe(3)
  })
})
