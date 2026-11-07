import { describe, expect, it } from "vitest"
import { validateResearch } from "@/services/research/gate"
import { RESEARCH, RESEARCH_FILES } from "./index"

/** The gate over the real research entries. It passes with none: entries are added from sources the author read. */
describe("the research dataset", () => {
  it("passes every rule", () => {
    const entries = [...RESEARCH_FILES].flatMap(([fileKey, list]) =>
      list.map((entry) => ({ fileKey, entry }))
    )
    expect(validateResearch(entries)).toEqual([])
  })
  it("never lists a 2027 entry as observed, and always flags a recommendation as a prediction", () => {
    for (const e of RESEARCH) {
      if (e.horizon === 2027) expect(e.predicted, e.id).toBe(true)
      expect(e.evidence.type === "preparation-recommendation", e.id).toBe(
        e.predicted
      )
      if (e.predicted) expect(e.confidence, e.id).not.toBe("high")
    }
  })
})
