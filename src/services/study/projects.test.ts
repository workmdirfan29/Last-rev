import { describe, expect, it } from "vitest"
import { defineProject } from "@/data/projects/author"
import type { QuestionProgress } from "@/types/learner"
import { parseRepoUrl, projectProgress, stepDone } from "./projects"

const p = defineProject({
  id: "demo",
  kind: "mini",
  title: "Demo",
  summary: "s",
  hours: 4,
  roadmaps: [{ roadmapId: "java-full-stack-ai", phase: 1 }],
  userStories: ["a", "b", "c"],
  requirements: ["a", "b", "c"],
  steps: [
    { title: "One", summary: "s", acceptance: ["a1", "a2"] },
    { title: "Two", summary: "s", acceptance: ["b1", "b2", "b3"] },
    { title: "Three", summary: "s", acceptance: ["c1", "c2"] },
  ],
})
const done = (...ns: number[]) =>
  Object.fromEntries(
    ns.map((n) => [
      `proj.demo.${n}`,
      { questionId: `proj.demo.${n}`, completed: true } as QuestionProgress,
    ])
  )

describe("project progress", () => {
  it("is the ticks over all acceptance items, per step and overall", () => {
    expect(projectProgress(p, {})).toMatchObject({
      done: 0,
      total: 7,
      percent: 0,
      complete: false,
    })
    const pp = projectProgress(p, done(1, 2, 3))
    expect(pp).toMatchObject({ done: 3, total: 7, percent: 43 })
    expect(pp.steps).toEqual([
      { done: 2, total: 2 },
      { done: 1, total: 3 },
      { done: 0, total: 2 },
    ])
    expect(stepDone(pp, 0)).toBe(true)
    expect(stepDone(pp, 1)).toBe(false)
    expect(projectProgress(p, done(1, 2, 3, 4, 5, 6, 7)).complete).toBe(true)
  })
})

describe("the repository link", () => {
  it("accepts https links and an empty value, and rejects everything else", () => {
    expect(parseRepoUrl("")).toEqual({ ok: true, url: "" })
    expect(parseRepoUrl("  https://example.org/me/demo ")).toEqual({
      ok: true,
      url: "https://example.org/me/demo",
    })
    expect(parseRepoUrl("http://example.org/x").ok).toBe(false)
    expect(parseRepoUrl("javascript:alert(1)").ok).toBe(false)
    expect(parseRepoUrl("not a link").ok).toBe(false)
    expect(parseRepoUrl("https://example.org/" + "a".repeat(400)).ok).toBe(
      false
    )
  })
})
