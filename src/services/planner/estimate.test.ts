import { describe, expect, it } from "vitest"
import { daysUntil, estimatePlan, resolveTargetDate } from "./estimate"
import { defaultsForRoles } from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"

const today = new Date(2026, 10, 2) // 2 Nov 2026, local

describe("estimatePlan", () => {
  it("sums catalogue hours for the selected roles", () => {
    const selected = resolveSyllabus({
      defaults: defaultsForRoles(["frontend-developer"]),
      overrides: {},
      experience: "fresher",
    }).filter((x) => x.selected)
    const minutes = selected.reduce((n, x) => n + x.minutes, 0)
    const e = estimatePlan({
      roleIds: ["frontend-developer"],
      dailyHours: 2,
      targetDays: 30,
    })
    expect(e.totalHours).toBe(Math.round(minutes / 60))
    expect(e.moduleCount).toBe(selected.length)
    expect(e.daysNeeded).toBe(Math.ceil(minutes / 120))
  })

  it("does not double-count modules shared between roles", () => {
    const a = estimatePlan({
      roleIds: ["java-full-stack"],
      dailyHours: 2,
      targetDays: 30,
    })
    const both = estimatePlan({
      roleIds: ["java-full-stack", "java-developer"],
      dailyHours: 2,
      targetDays: 30,
    })
    const separate =
      estimatePlan({
        roleIds: ["java-developer"],
        dailyHours: 2,
        targetDays: 30,
      }).totalHours + a.totalHours
    expect(both.totalHours).toBeLessThan(separate)
  })

  it("reports whether the target is achievable at the chosen pace", () => {
    expect(
      estimatePlan({
        roleIds: ["frontend-developer"],
        dailyHours: 12,
        targetDays: 30,
      }).fits
    ).toBe(true)
    expect(
      estimatePlan({
        roleIds: ["java-full-stack"],
        dailyHours: 0.5,
        targetDays: 7,
      }).fits
    ).toBe(false)
  })

  it("computes the required hours per day", () => {
    const e = estimatePlan({
      roleIds: ["frontend-developer"],
      dailyHours: 2,
      targetDays: 10,
    })
    expect(e.requiredHoursPerDay).toBeCloseTo(e.totalHours / 10, 1)
  })

  it("handles an empty selection", () => {
    const e = estimatePlan({ roleIds: [], dailyHours: 2, targetDays: 30 })
    expect(e).toMatchObject({
      moduleCount: 0,
      totalHours: 0,
      daysNeeded: 0,
      fits: true,
    })
  })
})

describe("resolveTargetDate", () => {
  it("adds the preset length to today", () => {
    expect(resolveTargetDate("7d", null, today)).toBe("2026-11-09")
    expect(resolveTargetDate("15d", null, today)).toBe("2026-11-17")
    expect(resolveTargetDate("30d", null, today)).toBe("2026-12-02")
  })
  it("uses the custom date as given", () => {
    expect(resolveTargetDate("custom", "2027-01-15", today)).toBe("2027-01-15")
    expect(resolveTargetDate("custom", null, today)).toBeNull()
  })
})

describe("daysUntil", () => {
  it("counts calendar days", () => {
    expect(daysUntil("2026-11-09", today)).toBe(7)
    expect(daysUntil("2026-11-02", today)).toBe(0)
  })
})
