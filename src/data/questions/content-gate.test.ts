import { describe, expect, it } from "vitest"
import { CONTENT_STATUS } from "@/data/catalog/content-status"
import {
  HR_RELEASE_MIN_QUESTIONS,
  RELEASE_MIN_FRESHER_QUESTIONS,
} from "@/data/catalog/module-types"
import { MODULE_BY_ID } from "@/data/catalog/modules"
import {
  findFrequencyClaim,
  findNearDuplicates,
  isAllowedSource,
} from "@/services/content/quality"
import { validateHrQuestion } from "@/services/content/hr-rules"
import { isHrModuleId, type Question } from "@/types/content"
import { QUESTION_INDEX } from "./index.generated"
import { loadModuleQuestions } from "./loaders"

/**
 * The content gate. A module may be labelled "released" only if every rule below holds for it, and the
 * rules about sources, duplicates and claims hold for every question in every module.
 */
const moduleIds = [...new Set(QUESTION_INDEX.map((q) => q.moduleId))].sort()

/**
 * Modules exempt from the one-official-source rule, other than the `hr-*` family. A project question coaches
 * the learner to explain THEIR OWN project, so no official document can back it. This list is deliberate and
 * short: it exempts only the source rule. Such a module is still held to the HR content rules (no statistic,
 * frequency, company or invented-metric claims, with the framework fields), the near-duplicate rule, the
 * word limit and the release minimum. Adding an id here is an editorial decision.
 */
const SOURCE_EXEMPT_MODULES: ReadonlySet<string> = new Set(["project-questions"])
const isSourceExempt = (id: string) =>
  isHrModuleId(id) || SOURCE_EXEMPT_MODULES.has(id)
const byModule = new Map<string, Question[]>()
async function questionsOf(id: string): Promise<Question[]> {
  if (!byModule.has(id)) byModule.set(id, await loadModuleQuestions(id))
  return byModule.get(id)!
}

/** Every piece of text a learner can read in a question. */
function textOf(q: Question): string {
  return [
    ...(q.weakAnswer ? [q.weakAnswer] : []),
    ...(q.weakAnswerWhy ?? []),
    ...(q.recruiterExpects ?? []),
    ...(q.answerFramework ?? []),
    q.title,
    q.interviewerIntent,
    q.shortAnswer,
    ...q.detailedAnswer,
    q.realWorldExample,
    ...q.commonMistakes,
    ...q.answerTips,
    ...q.keyPoints,
    ...q.revisionNotes,
    ...q.followUps.flatMap((f) => [f.question, f.hint ?? ""]),
    ...q.codeExamples.flatMap((c) => [c.title, ...c.walkthrough]),
  ].join("\n")
}

describe("content status is honest", () => {
  it("only names modules that exist, with a valid status", () => {
    for (const [id, status] of Object.entries(CONTENT_STATUS)) {
      expect(MODULE_BY_ID.has(id), id).toBe(true)
      expect(["released", "in-progress", "planned"]).toContain(status)
    }
  })

  it("a module with questions is not 'planned', and a module without any is not 'released' or 'in-progress'", () => {
    const withQuestions = new Set(moduleIds)
    for (const m of MODULE_BY_ID.values()) {
      if (withQuestions.has(m.id))
        expect(m.contentStatus, m.id).not.toBe("planned")
      else expect(m.contentStatus, m.id).toBe("planned")
    }
  })

  it(`every released module has at least ${RELEASE_MIN_FRESHER_QUESTIONS} fresher questions`, async () => {
    const released = [...MODULE_BY_ID.values()].filter(
      (m) => m.contentStatus === "released" && !isHrModuleId(m.id)
    )
    expect(released.length).toBeGreaterThan(0)
    for (const m of released) {
      const fresher = (await questionsOf(m.id)).filter(
        (q) => q.level === "fresher"
      ).length
      expect(
        fresher,
        `${m.id} has ${fresher} fresher questions`
      ).toBeGreaterThanOrEqual(RELEASE_MIN_FRESHER_QUESTIONS)
    }
  })
})

describe("HR interview modules", () => {
  const hrIds = moduleIds.filter(isHrModuleId)

  it(`a released HR module has at least ${HR_RELEASE_MIN_QUESTIONS} questions in total (they are level-neutral)`, async () => {
    for (const m of MODULE_BY_ID.values()) {
      if (!isHrModuleId(m.id) || m.contentStatus !== "released") continue
      const n = (await questionsOf(m.id)).length
      expect(n, `${m.id} has ${n}`).toBeGreaterThanOrEqual(
        HR_RELEASE_MIN_QUESTIONS
      )
    }
  })

  it("every HR question has the HR fields, makes no statistic, frequency or company claim, and states no metric as fact", async () => {
    for (const id of hrIds)
      for (const q of await questionsOf(id))
        expect(validateHrQuestion(q), q.id).toEqual([])
  })
})

describe("project-questions (exempt from the source rule only)", () => {
  it("the exemption list holds exactly project-questions", () => {
    expect([...SOURCE_EXEMPT_MODULES]).toEqual(["project-questions"])
    expect(isSourceExempt("project-questions")).toBe(true)
    expect(isSourceExempt("git")).toBe(false)
    expect(isSourceExempt("hr-teamwork")).toBe(true)
  })

  it("every project question has the coaching fields and makes no statistic, frequency, company or invented-metric claim", async () => {
    for (const q of await questionsOf("project-questions"))
      expect(validateHrQuestion(q), q.id).toEqual([])
  })

  it("any source a project question does cite must still be on the allowlist", async () => {
    for (const q of await questionsOf("project-questions"))
      for (const s of q.sourceRefs)
        expect(isAllowedSource(s.url), `${q.id}: ${s.url}`).toBe(true)
  })
})

describe("every question", () => {
  it("has at least one source (not required for HR questions), and every source is on the official-source allowlist", async () => {
    for (const id of moduleIds) {
      for (const q of await questionsOf(id)) {
        if (!isSourceExempt(id))
          expect(
            q.sourceRefs.length,
            `${q.id} has no source`
          ).toBeGreaterThanOrEqual(1)
        for (const s of q.sourceRefs)
          expect(
            isAllowedSource(s.url),
            `${q.id}: ${s.url} is not an allowed source`
          ).toBe(true)
      }
    }
  })

  it("is not a near-duplicate of another question in its module", async () => {
    for (const id of moduleIds) {
      const dupes = findNearDuplicates(await questionsOf(id))
      expect(dupes, `${id}: ${JSON.stringify(dupes)}`).toEqual([])
    }
  })

  it("makes no claim about how often it is asked unless it cites a survey or statistics source", async () => {
    for (const id of moduleIds) {
      for (const q of await questionsOf(id)) {
        const claim = findFrequencyClaim(textOf(q))
        if (!claim) continue
        const cited = q.sourceRefs.some((s) =>
          /survey|statistic/i.test(s.label)
        )
        expect(
          cited,
          `${q.id} claims "${claim}" without a survey or statistics source`
        ).toBe(true)
      }
    }
  })
})
