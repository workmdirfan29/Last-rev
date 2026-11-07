import { describe, expect, it } from "vitest"
import { defineResearch } from "@/data/research/author"
import { type HostLists } from "@/data/research/hosts"
import {
  researchEntrySchema,
  type AuthoredResearchEntry,
} from "@/types/research"
import {
  buildBibliography,
  filterResearch,
  NO_FILTERS,
  normaliseUrl,
  PREDICTION_LABEL,
} from "./bibliography"
import { findNumberClaim, validateResearch } from "./gate"

const official: AuthoredResearchEntry = {
  id: "react-state",
  topic: "State in React function components",
  area: "frontend",
  level: "fresher",
  claim:
    "React's documentation teaches state in function components with the useState Hook.",
  evidence: {
    type: "official-documentation",
    sources: [
      {
        title: "useState",
        publisher: "React",
        url: "https://react.dev/reference/react/useState",
      },
    ],
  },
  researchedOn: "2026-11-05",
  confidence: "high",
  horizon: 2026,
  predicted: false,
}
const prediction: AuthoredResearchEntry = {
  id: "ai-retrieval-2027",
  topic: "Retrieval basics",
  area: "ai",
  level: "intermediate",
  claim:
    "Explaining how retrieval fits around a language-model API is likely to be useful preparation in 2027.",
  evidence: {
    type: "preparation-recommendation",
    sources: [],
    basis:
      "It follows from how the official guides describe retrieval today; a forecast, not a finding.",
  },
  researchedOn: "2026-11-05",
  confidence: "low",
  horizon: 2027,
  predicted: true,
}
const hosts: HostLists = {
  official: [{ host: "react.dev", note: "React" }],
  market: [{ host: "reports.example", note: "a market publisher" }],
  experience: [{ host: "forum.example", note: "a forum" }],
}
const market: AuthoredResearchEntry = {
  id: "market-1",
  topic: "Demand",
  area: "jobs",
  level: "all",
  claim: "A published survey reports that 40% of respondents use TypeScript.",
  evidence: {
    type: "job-market-trend",
    sources: [
      {
        title: "Survey",
        publisher: "Example Reports",
        url: "https://reports.example/survey",
        publishedOn: "2026",
      },
    ],
  },
  researchedOn: "2026-11-05",
  confidence: "medium",
  horizon: 2026,
  predicted: false,
}
const clone = <T>(x: T): T => structuredClone(x)
const check = (e: AuthoredResearchEntry, fileKey = e.area, h = hosts) =>
  validateResearch([{ fileKey, entry: defineResearch([e])[0] }], h)
const fails = (patch: Partial<AuthoredResearchEntry>, base = official) =>
  !researchEntrySchema.safeParse({ ...clone(base), ...patch }).success

describe("the research schema guard rails", () => {
  it("accepts the observed and the predicted example", () => {
    expect(check(official)).toEqual([])
    expect(check(prediction)).toEqual([])
  })
  it("a 2027 entry can never be typed as observed, and a prediction is never typed as anything but a recommendation", () => {
    expect(fails({ horizon: 2027 })).toBe(true)
    expect(fails({ predicted: true })).toBe(true)
    expect(fails({ predicted: false, horizon: 2026 }, prediction)).toBe(true)
    expect(
      fails({
        horizon: 2027,
        predicted: false,
        evidence: {
          type: "job-market-trend",
          sources: market.evidence.sources,
        },
      })
    ).toBe(true)
  })
  it("a prediction cannot have high confidence", () => {
    expect(fails({ confidence: "high" }, prediction)).toBe(true)
  })
  it("each evidence type needs what it needs", () => {
    expect(
      fails({ evidence: { type: "official-documentation", sources: [] } })
    ).toBe(true)
    expect(
      fails({
        evidence: {
          type: "reported-experiences",
          sources: official.evidence.sources,
        },
      })
    ).toBe(true)
    expect(
      fails(
        { evidence: { type: "preparation-recommendation", sources: [] } },
        prediction
      )
    ).toBe(true) // no basis
    expect(
      fails({
        evidence: {
          type: "official-documentation",
          sources: official.evidence.sources,
          basis: "x",
        },
      })
    ).toBe(true)
    expect(
      fails({
        evidence: {
          type: "official-documentation",
          sources: [{ title: "x", publisher: "y", url: "http://react.dev/x" }],
        },
      })
    ).toBe(true)
    expect(
      fails({
        evidence: {
          type: "official-documentation",
          sources: [
            {
              title: "x",
              publisher: "y",
              url: "https://react.dev/x",
              publishedOn: "2027",
            },
          ],
        },
      })
    ).toBe(true)
  })
})

describe("the research gate", () => {
  it("needs a real area, and the file named after it", () => {
    expect(check(official, "backend").join()).toMatch(/is in backend\.ts/)
    expect(check({ ...clone(official), area: "nope" }, "nope").join()).toMatch(
      /unknown area/
    )
    for (const a of [
      "jobs",
      "interview-process",
      "languages-and-frameworks",
      "ai",
      "ai-integration",
      "frontend",
    ])
      expect(check({ ...clone(official), area: a }, a)).toEqual([])
  })
  it("allows a source only on the host list for its evidence type", () => {
    expect(
      check({
        ...clone(official),
        evidence: {
          type: "official-documentation",
          sources: [
            { title: "x", publisher: "y", url: "https://example.com/doc" },
          ],
        },
      }).join()
    ).toMatch(/not on the host list for official-documentation/)
    expect(
      check({
        ...clone(market),
        evidence: {
          type: "job-market-trend",
          sources: [{ title: "x", publisher: "y", url: "https://react.dev/x" }],
        },
      }).join()
    ).toMatch(/host list for job-market-trend/)
    expect(check(market)).toEqual([])
  })
  it("allows a statistic only in a job-market-trend or official-documentation entry that carries a source", () => {
    expect(check(market)).toEqual([]) // 40% with a market source: allowed
    const stat = {
      ...clone(official),
      claim: "About 40% of developers use it.",
    }
    expect(check(stat)).toEqual([]) // official documentation with a URL: allowed
    const experience: AuthoredResearchEntry = {
      ...clone(market),
      id: "exp",
      evidence: {
        type: "reported-experiences",
        sources: [
          { title: "a", publisher: "F", url: "https://forum.example/a" },
          { title: "b", publisher: "F", url: "https://forum.example/b" },
        ],
      },
    }
    expect(check(experience).join()).toMatch(
      /needs a job-market-trend or official-documentation entry/
    )
    expect(
      check({
        ...clone(prediction),
        claim: "Most employers will want this in 2027.",
      }).join()
    ).toMatch(/statistic/)
    expect(
      check({
        ...clone(prediction),
        claim: "About 30 percent of roles will need it.",
      }).join()
    ).toMatch(/statistic/)
  })
  it("finds statistic-like numbers", () => {
    for (const t of [
      "40%",
      "7 out of 10 candidates",
      "most of the roles",
      "12,000 job postings",
      "two thirds of employers",
      "3.5 percent",
    ])
      expect(findNumberClaim(`about ${t}`), t).not.toBeNull()
    for (const t of [
      "version 18",
      "the 2026 edition",
      "Java 21 is supported",
      "in three steps",
    ])
      expect(findNumberClaim(t), t).toBeNull()
  })
  it("keeps brands and company-specific interview content out, and frequency claims", () => {
    expect(
      check({
        ...clone(official),
        claim: "Flipkart asks this in every interview.",
      }).join()
    ).toMatch(/company or brand/)
    expect(
      check({
        ...clone(official),
        claim: "This is asked in almost every interview.",
      }).join()
    ).toMatch(/frequency claim/)
  })
  it("checks dates and duplicates", () => {
    expect(
      check({ ...clone(official), researchedOn: "2030-01-01" }).join()
    ).toMatch(/outside 2024-01-01 to 2027-12-31/)
    const a = defineResearch([official])[0]
    expect(
      validateResearch(
        [
          { fileKey: "frontend", entry: a },
          { fileKey: "frontend", entry: a },
        ],
        hosts
      ).join()
    ).toMatch(/duplicate id/)
    expect(
      validateResearch(
        [
          { fileKey: "frontend", entry: a },
          { fileKey: "frontend", entry: { ...a, id: "other" } },
        ],
        hosts
      ).join()
    ).toMatch(/same topic and claim/)
  })
})

describe("the bibliography and filters", () => {
  const entries = defineResearch([
    official,
    prediction,
    {
      ...clone(official),
      id: "react-state-2",
      topic: "Another topic",
      claim: "Another claim about the same page.",
      evidence: {
        type: "official-documentation",
        sources: [
          {
            title: "useState",
            publisher: "React",
            url: "https://REACT.dev/reference/react/useState/#top",
          },
        ],
      },
    },
  ])
  it("lists each source once, with how many entries cite it", () => {
    const b = buildBibliography(entries)
    expect(b).toHaveLength(1)
    expect(b[0].entryIds).toEqual(["react-state", "react-state-2"])
    expect(b[0].onlyPredictions).toBe(false)
    expect(normaliseUrl("https://REACT.dev/a/#x")).toBe("https://react.dev/a")
  })
  it("marks a source that only informs forecasts", () => {
    const informed = defineResearch([
      {
        ...clone(prediction),
        evidence: {
          type: "preparation-recommendation",
          sources: official.evidence.sources,
          basis: "b",
        },
      },
    ])
    expect(buildBibliography(informed)[0].onlyPredictions).toBe(true)
  })
  it("filters by area, level, type and horizon, treating level 'all' as every level", () => {
    expect(filterResearch(entries, NO_FILTERS)).toHaveLength(3)
    expect(
      filterResearch(entries, { ...NO_FILTERS, horizon: "2027" }).map(
        (e) => e.id
      )
    ).toEqual(["ai-retrieval-2027"])
    expect(
      filterResearch(entries, { ...NO_FILTERS, type: "official-documentation" })
    ).toHaveLength(2)
    expect(filterResearch(entries, { ...NO_FILTERS, area: "ai" })).toHaveLength(
      1
    )
    expect(
      filterResearch(defineResearch([{ ...clone(official), level: "all" }]), {
        ...NO_FILTERS,
        level: "advanced",
      })
    ).toHaveLength(1)
    expect(PREDICTION_LABEL).toBe("Prediction, not verified")
  })
})
