import { describe, expect, it } from "vitest"
import { ROADMAPS } from "@/data/catalog/roadmaps"
import { MODULE_BY_ID } from "@/data/catalog/modules"
import { defaultsForRoadmap } from "@/services/curriculum/relevance"
import { PHASES, phasesOf, refModule } from "./phases"

/** The phase titles of the specification, word for word. */
const SPEC: Record<string, string[]> = {
  "java-full-stack-ai": [
    "Java fundamentals and advanced Java",
    "OOP, Collections, DSA and problem solving",
    "SQL and PostgreSQL",
    "JDBC, Hibernate and JPA",
    "Spring and Spring Boot",
    "REST, authentication and security",
    "React and TypeScript",
    "Full stack application development",
    "Testing and software architecture",
    "Docker, Linux, AWS and CI/CD",
    "AI integration, LLM APIs, RAG and AI apps",
    "Capstone and interview prep",
  ],
  "python-full-stack-ai": [
    "Python fundamentals",
    "Advanced Python and OOP",
    "Data structures and algorithms",
    "SQL and PostgreSQL",
    "Django and FastAPI",
    "REST and authentication",
    "React and TypeScript",
    "Full stack applications",
    "Testing and architecture",
    "Docker, Linux, AWS and CI/CD",
    "ML and AI fundamentals",
    "LLMs, RAG, vector databases and agents",
    "Production AI applications",
    "Capstone and interview prep",
  ],
  "mern-full-stack-ai": [
    "HTML, CSS and JavaScript",
    "Advanced JavaScript and TypeScript",
    "React ecosystem",
    "Node and Express",
    "MongoDB and database architecture",
    "Authentication and security",
    "Full stack architecture",
    "Data structures and algorithms",
    "Testing and QA",
    "Docker, Linux, Nginx and deployment",
    "AI APIs and LLM integration",
    "RAG, vector search and agents",
    "Production AI applications",
    "Capstone and interview prep",
  ],
}

describe("roadmap phases", () => {
  it("has exactly the phases of the specification, numbered from 1 with no gaps", () => {
    for (const r of ROADMAPS) {
      const phases = phasesOf(r.id)
      expect(
        phases.map((p) => p.number),
        r.id
      ).toEqual(phases.map((_, i) => i + 1))
      expect(
        phases.map((p) => p.title),
        r.id
      ).toEqual(SPEC[r.id])
      expect(phases.every((p) => p.outcome.length > 20)).toBe(true)
    }
    expect(
      PHASES.every((p) => ROADMAPS.some((r) => r.id === p.roadmapId))
    ).toBe(true)
  })

  it("names only modules and topics that exist", () => {
    for (const p of PHASES)
      for (const ref of p.modules) {
        const m = MODULE_BY_ID.get(refModule(ref))
        expect(
          m,
          `${p.roadmapId} phase ${p.number}: ${refModule(ref)}`
        ).toBeDefined()
        if (typeof ref !== "string")
          for (const t of ref.topics)
            expect(
              m!.topicList.some((x) => x.title === t),
              `${refModule(ref)} has no topic "${t}"`
            ).toBe(true)
      }
  })

  it("places every topic of every core or recommended module of a roadmap in exactly one phase", () => {
    for (const r of ROADMAPS) {
      const tiers = defaultsForRoadmap(r.id)
      expect(tiers.size, "the roadmap has a module pool").toBeGreaterThan(40)
      const owner = new Map<string, number>() // "module|topic" -> phase number
      for (const p of phasesOf(r.id))
        for (const ref of p.modules) {
          const id = refModule(ref)
          const m = MODULE_BY_ID.get(id)!
          const topics =
            typeof ref === "string"
              ? m.topicList.map((t) => t.title)
              : ref.topics
          for (const t of topics) {
            const key = `${id}|${t}`
            expect(
              owner.has(key),
              `${r.id}: ${key} is in phase ${owner.get(key)} and phase ${p.number}`
            ).toBe(false)
            owner.set(key, p.number)
          }
        }
      for (const [id, tier] of tiers) {
        if (tier !== "core" && tier !== "recommended") continue
        for (const t of MODULE_BY_ID.get(id)!.topicList)
          expect(
            owner.has(`${id}|${t.title}`),
            `${r.id}: ${id} / "${t.title}" (${tier}) is in no phase`
          ).toBe(true)
      }
    }
  })

  it("links the Docker, Linux and CI/CD phase to Linux practice and the capstone phases to the interview tools", () => {
    for (const r of ROADMAPS) {
      const phases = phasesOf(r.id)
      const linuxPhase = phases.find((p) =>
        p.modules.some((m) => refModule(m) === "linux-commands")
      )!
      expect(linuxPhase.links.map((l) => l.to)).toContain("/linux")
      const last = phases.at(-1)!
      expect(last.modules).toEqual([])
      expect(last.links.map((l) => l.to)).toEqual(["/hr", "/mock", "/resume"])
    }
  })
})
