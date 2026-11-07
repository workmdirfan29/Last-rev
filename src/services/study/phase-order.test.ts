import { describe, expect, it } from "vitest"
import { ROADMAPS } from "@/data/catalog/roadmaps"
import { phasesOf } from "@/data/catalog/phases"
import { defaultsForRoadmap } from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import { buildBlocks } from "@/services/planner/schedule"
import { orderByPhases } from "./phase-order"

const entriesFor = (roadmapId: string, overrides = {}) =>
  resolveSyllabus({
    defaults: defaultsForRoadmap(roadmapId),
    overrides,
    experience: "fresher",
    scope: "study",
  })

describe("the Study plan follows the roadmap's phases", () => {
  for (const r of ROADMAPS) {
    const entries = entriesFor(r.id)
    const ordered = orderByPhases(entries, phasesOf(r.id), r.domainOrder)

    it(`${r.id}: keeps every selected module's minutes exactly, once`, () => {
      const selected = entries.filter((e) => e.selected)
      const total = (list: typeof entries) =>
        list.reduce((n, e) => n + e.minutes, 0)
      expect(total(ordered)).toBe(total(selected))
      const ids = new Set(ordered.map((e) => e.module.id))
      expect(ids).toEqual(new Set(selected.map((e) => e.module.id)))
      // topic blocks add up to the same minutes as the module-level plan
      const blocks = buildBlocks(ordered, 120)
      expect(blocks.reduce((n, b) => n + b.minutes, 0)).toBe(total(selected))
    })

    it(`${r.id}: a module's selected prerequisites come before it`, () => {
      const position = new Map<string, number>()
      ordered.forEach((e, i) =>
        position.set(e.module.id, Math.min(position.get(e.module.id) ?? 1e9, i))
      )
      for (const e of ordered.filter((x) => !x.deferred))
        for (const p of e.module.prerequisites)
          if (
            position.has(p) &&
            !ordered.find((x) => x.module.id === p)!.deferred
          )
            expect(position.get(p)!, `${e.module.id} needs ${p}`).toBeLessThan(
              position.get(e.module.id)!
            )
    })
  }

  it("Java: phase 1 before OOP, OOP before Spring, Spring before React, Docker after the frontend", () => {
    const java = ROADMAPS[0]
    const order = orderByPhases(
      entriesFor(java.id),
      phasesOf(java.id),
      java.domainOrder
    ).map((e) => e.module.id)
    const at = (id: string) => order.indexOf(id)
    expect(at("java-core")).toBeLessThan(at("java-oop"))
    expect(at("java-oop")).toBeLessThan(at("spring-boot"))
    expect(at("spring-boot")).toBeLessThan(at("react"))
    expect(at("react")).toBeLessThan(at("docker"))
    expect(at("docker")).toBeLessThan(at("llm-apis"))
  })

  it("MERN: JavaScript is split by topic across phases 1 and 2, sharing its minutes", () => {
    const mern = ROADMAPS.find((r) => r.id === "mern-full-stack-ai")!
    const entries = entriesFor(mern.id)
    const ordered = orderByPhases(entries, phasesOf(mern.id), mern.domainOrder)
    const parts = ordered.filter((e) => e.module.id === "javascript")
    expect(parts).toHaveLength(2)
    expect(parts[0].module.topicList.map((t) => t.title)).toContain(
      "Data types"
    )
    expect(parts[1].module.topicList.map((t) => t.title)).toContain("Closures")
    const whole = entries.find((e) => e.module.id === "javascript")!
    expect(parts[0].minutes + parts[1].minutes).toBe(whole.minutes)
    expect(
      parts[0].module.topicList.length + parts[1].module.topicList.length
    ).toBe(whole.module.topicList.length)
    expect(ordered.indexOf(parts[0])).toBeLessThan(
      ordered.findIndex((e) => e.module.id === "typescript")
    )
    expect(ordered.indexOf(parts[1])).toBeGreaterThan(ordered.indexOf(parts[0]))
  })

  it("puts modules set to Later last", () => {
    const java = ROADMAPS[0]
    const entries = entriesFor(java.id, { agile: { priority: "low" } })
    const ordered = orderByPhases(entries, phasesOf(java.id), java.domainOrder)
    const agile = ordered.find((e) => e.module.id === "agile")!
    expect(agile.deferred).toBe(true)
    const firstLater = ordered.findIndex((e) => e.deferred)
    expect(ordered.slice(firstLater).every((e) => e.deferred)).toBe(true)
    expect(ordered.indexOf(agile)).toBeGreaterThan(
      ordered.findIndex((e) => e.module.id === "ai-production")
    )
  })
})
