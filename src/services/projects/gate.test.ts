import { describe, expect, it } from "vitest"
import { defineProject } from "@/data/projects/author"
import {
  projectSchema,
  acceptanceItems,
  projectTickId,
  type AuthoredProject,
} from "@/types/project"
import { validateProjects } from "./gate"

const base = (): AuthoredProject => ({
  id: "hello-cli",
  kind: "mini",
  title: "Greeting command line tool",
  summary: "A small program that prints a greeting.",
  hours: 4,
  roadmaps: [{ roadmapId: "java-full-stack-ai", phase: 1 }],
  buildsOn: ["lesson.java-core.first-program"],
  userStories: [
    "As a user, I run it.",
    "As a user, I give a name.",
    "As a user, I see a greeting.",
  ],
  requirements: [
    "It reads a name.",
    "It prints a greeting.",
    "It handles empty input.",
  ],
  structure: ["src/Main.java"],
  steps: [
    {
      title: "Print",
      summary: "Print a fixed greeting.",
      acceptance: ["It compiles", "It prints"],
      afterLessons: ["lesson.java-core.first-program"],
    },
    {
      title: "Read",
      summary: "Read a name.",
      acceptance: ["It asks", "It uses the name"],
      afterLessons: [],
    },
    {
      title: "Polish",
      summary: "Handle empty input.",
      acceptance: ["Empty input is handled", "README exists"],
      afterLessons: [],
    },
  ],
  stretch: [],
  resources: [
    {
      label: "Basic I/O",
      url: "https://docs.oracle.com/javase/tutorial/essential/io/index.html",
    },
  ],
})
const ctx = { lessonIds: new Set(["lesson.java-core.first-program"]) }
const check = (
  patch: (p: AuthoredProject) => void = () => {},
  fileKey = "hello-cli"
) => {
  const p = structuredClone(base())
  patch(p)
  return validateProjects([{ fileKey, project: defineProject(p) }], ctx)
}

describe("the project schema", () => {
  it("accepts a complete project and numbers its acceptance items across steps", () => {
    expect(check()).toEqual([])
    const items = acceptanceItems(defineProject(base()))
    expect(items.map((i) => i.n)).toEqual([1, 2, 3, 4, 5, 6])
    expect(items[2]).toMatchObject({ stepIndex: 1, text: "It asks" })
    expect(projectTickId("hello-cli", 3)).toBe("proj.hello-cli.3")
  })
  it("rejects what the schema can see", () => {
    const fails = (patch: (p: AuthoredProject) => void) => {
      const p = structuredClone(base())
      patch(p)
      return !projectSchema.safeParse(p).success
    }
    expect(fails((p) => (p.steps = p.steps.slice(0, 2)))).toBe(true)
    expect(fails((p) => (p.steps[0].acceptance = ["only one"]))).toBe(true)
    expect(fails((p) => (p.userStories = ["one", "two"]))).toBe(true)
    expect(fails((p) => (p.id = "Bad Id"))).toBe(true)
    expect(
      fails((p) => (p.steps[0].afterLessons = ["lesson.java-core.other"]))
    ).toBe(true) // not in buildsOn
  })
})

describe("the project gate", () => {
  it("needs the file to be named after the id, and hours that fit the kind", () => {
    expect(check(() => {}, "other").join()).toMatch(/must be hello-cli\.ts/)
    expect(check((p) => (p.hours = 40)).join()).toMatch(
      /mini project is 2-16 hours/
    )
    expect(
      check((p) => {
        p.kind = "major"
        p.hours = 40
      }).join()
    ).toEqual("")
    expect(
      check((p) => {
        p.kind = "major"
        p.hours = 4
      }).join()
    ).toMatch(/major project is 20-120 hours/)
  })
  it("needs real roadmaps, phases and lessons", () => {
    expect(
      check((p) => (p.roadmaps = [{ roadmapId: "nope", phase: 1 }])).join()
    ).toMatch(/unknown roadmap/)
    expect(
      check(
        (p) => (p.roadmaps = [{ roadmapId: "java-full-stack-ai", phase: 20 }])
      ).join()
    ).toMatch(/has no phase 20/)
    expect(
      check((p) => {
        p.buildsOn = ["lesson.java-core.missing"]
        p.steps[0].afterLessons = []
      }).join()
    ).toMatch(/is not a lesson/)
  })
  it("allows official documentation only, and no invented claims or brands", () => {
    expect(
      check(
        (p) => (p.resources = [{ label: "x", url: "https://example.com" }])
      ).join()
    ).toMatch(/allowlist/)
    expect(
      check(
        (p) => (p.requirements[0] = "Studies show most users like it.")
      ).join()
    ).toMatch(/statistic claim/)
    expect(
      check((p) => (p.summary = "A tool like the one Flipkart uses.")).join()
    ).toMatch(/company or brand/)
  })
  it("rejects repeated acceptance items, repeated step titles and duplicate ids", () => {
    expect(
      check((p) => (p.steps[1].acceptance = ["It compiles", "It asks"])).join()
    ).toMatch(/say the same thing/)
    expect(check((p) => (p.steps[1].title = "Print")).join()).toMatch(
      /share a title/
    )
    const a = defineProject(base())
    expect(
      validateProjects(
        [
          { fileKey: "hello-cli", project: a },
          { fileKey: "hello-cli", project: a },
        ],
        ctx
      ).join()
    ).toMatch(/duplicate/)
  })
})
