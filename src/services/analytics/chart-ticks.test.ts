import { describe, expect, it } from "vitest"
import { formatMinuteTick, minuteTicks } from "./chart-ticks"

describe("minuteTicks", () => {
  it("gives distinct whole ascending ticks from 0 that cover the maximum", () => {
    for (const max of [0, 5, 63, 130, 600, 1, 29, 30, 119, 1440]) {
      const { ticks, top } = minuteTicks(max)
      expect(ticks[0], `max ${max}`).toBe(0)
      expect(new Set(ticks).size, `max ${max}`).toBe(ticks.length)
      expect(ticks.length, `max ${max}`).toBeGreaterThanOrEqual(3)
      expect(ticks.length, `max ${max}`).toBeLessThanOrEqual(6)
      for (const t of ticks) expect(Number.isInteger(t)).toBe(true)
      expect([...ticks].sort((a, b) => a - b)).toEqual(ticks)
      expect(top).toBeGreaterThanOrEqual(max)
    }
  })

  it("uses sensible units for the maxima the dashboard meets", () => {
    expect(minuteTicks(0).ticks).toEqual([0, 5, 10])
    expect(minuteTicks(5).ticks).toEqual([0, 5, 10])
    expect(minuteTicks(63).ticks).toEqual([0, 30, 60, 90])
    expect(minuteTicks(130).ticks).toEqual([0, 60, 120, 180])
    expect(minuteTicks(600).ticks).toEqual([0, 180, 360, 540, 720])
  })

  it("labels ticks briefly, and differently for different values", () => {
    expect(minuteTicks(63).ticks.map(formatMinuteTick)).toEqual([
      "0",
      "30m",
      "1h",
      "1.5h",
    ])
    expect(minuteTicks(130).ticks.map(formatMinuteTick)).toEqual([
      "0",
      "1h",
      "2h",
      "3h",
    ])
  })
})
