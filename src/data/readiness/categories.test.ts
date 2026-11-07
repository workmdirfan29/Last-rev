import { describe, expect, it } from "vitest"
import { MODULES } from "@/data/catalog/modules"
import { isResumeModuleId } from "@/types/learner"
import {
  READINESS_CATEGORIES,
  UNMAPPED,
  categoriesOfModule,
} from "./categories"

describe("the readiness categories", () => {
  it("are the 16 named categories plus Data science and Mobile, with unique ids", () => {
    expect(READINESS_CATEGORIES).toHaveLength(18)
    expect(new Set(READINESS_CATEGORIES.map((c) => c.id)).size).toBe(18)
    expect(READINESS_CATEGORIES.map((c) => c.label)).toEqual(
      expect.arrayContaining([
        "Programming fundamentals",
        "Data structures and algorithms",
        "Frontend",
        "Backend",
        "Databases",
        "APIs",
        "Authentication and security",
        "System design",
        "Testing",
        "Deployment",
        "Linux",
        "Git",
        "AI integration",
        "Technical interview preparation",
        "HR preparation",
        "Spoken English",
        "Data science",
        "Mobile",
      ])
    )
  })
  it("name only modules that exist", () => {
    const ids = new Set(MODULES.map((m) => m.id))
    for (const c of READINESS_CATEGORIES)
      for (const m of c.modules) expect(ids.has(m), `${c.id}: ${m}`).toBe(true)
  })
  it("cover every catalogue module at least once, or say why not", () => {
    for (const m of MODULES) {
      const mapped = categoriesOfModule(m.id).length > 0
      expect(
        mapped || m.id in UNMAPPED,
        `${m.id} is in no readiness category`
      ).toBe(true)
    }
    for (const id of Object.keys(UNMAPPED))
      expect(categoriesOfModule(id)).toHaveLength(0)
  })
  it("count the technical question modules once, in their own area; Technical interview preparation holds only project and resume modules", () => {
    const tech = READINESS_CATEGORIES.find(
      (c) => c.id === "technical-interview"
    )!
    for (const m of tech.modules)
      expect(m === "project-questions" || isResumeModuleId(m), m).toBe(true)
    expect(tech.also).toContain("mock-interviews")
    // the 20 HR modules are in HR preparation only
    const hr = READINESS_CATEGORIES.find((c) => c.id === "hr-preparation")!
    expect(hr.modules).toHaveLength(20)
    for (const m of hr.modules)
      expect(categoriesOfModule(m).map((c) => c.id)).toEqual(["hr-preparation"])
  })
  it("allow a module in several categories where it genuinely belongs", () => {
    expect(
      categoriesOfModule("backend-architecture")
        .map((c) => c.id)
        .sort()
    ).toEqual(["backend", "system-design"])
    expect(
      categoriesOfModule("microservices")
        .map((c) => c.id)
        .sort()
    ).toEqual(["backend", "system-design"])
  })
})
