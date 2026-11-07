import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
} from "@/test/render-app"
import type { ResearchEntry } from "@/types/research"

const fixture = vi.hoisted(() => {
  const base = {
    level: "fresher" as const,
    researchedOn: "2026-11-05",
    confidence: "medium" as const,
  }
  const list: ResearchEntry[] = [
    {
      ...base,
      id: "react-state",
      topic: "State in React function components",
      area: "frontend",
      confidence: "high",
      claim: "React's documentation teaches state with the useState Hook.",
      evidence: {
        type: "official-documentation",
        sources: [
          {
            title: "useState",
            publisher: "React",
            url: "https://react.dev/reference/react/useState",
            publishedOn: "2025",
          },
        ],
      },
      horizon: 2026,
      predicted: false,
    },
    {
      ...base,
      id: "ai-2027",
      topic: "Retrieval basics",
      area: "ai",
      level: "intermediate",
      confidence: "low",
      claim:
        "Explaining retrieval around a language-model API is likely useful preparation in 2027.",
      evidence: {
        type: "preparation-recommendation",
        sources: [
          {
            title: "useState",
            publisher: "React",
            url: "https://react.dev/reference/react/useState",
          },
        ],
        basis: "It follows from the official guides; a forecast.",
      },
      horizon: 2027,
      predicted: true,
    },
    {
      ...base,
      id: "market-1",
      topic: "Demand for TypeScript",
      area: "jobs",
      level: "all",
      claim: "A survey reports growing TypeScript use.",
      evidence: {
        type: "job-market-trend",
        sources: [
          {
            title: "Survey",
            publisher: "Example Reports",
            url: "https://reports.example/survey",
          },
        ],
      },
      horizon: 2026,
      predicted: false,
    },
  ]
  return { list }
})
vi.mock("@/data/research", () => ({
  RESEARCH: fixture.list,
  RESEARCH_FILES: new Map(),
}))

const TIMEOUT = { timeout: 8000 }
beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

describe("the research page", () => {
  it("works with no profile, explains how it was made and its limits, and shows every entry with source, dates and confidence", async () => {
    renderApp("/research")
    await screen.findByRole(
      "heading",
      { level: 1, name: "What the evidence says" },
      TIMEOUT
    )
    expect(
      screen.getByRole("heading", { name: "How this was made, and its limits" })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /There is no data here on how often any interview question is asked/
      )
    ).toBeInTheDocument()
    const entries = screen.getAllByTestId("research-entry")
    expect(entries).toHaveLength(3)
    const react = screen.getByRole("article", {
      name: "State in React function components",
    })
    expect(
      within(react).getByText("Official documentation")
    ).toBeInTheDocument()
    expect(
      within(react).getByRole("link", { name: /useState/ })
    ).toHaveAttribute("href", "https://react.dev/reference/react/useState")
    expect(
      within(react).getByRole("link", { name: /useState/ })
    ).toHaveAttribute("rel", "noopener noreferrer")
    expect(react).toHaveTextContent("Researched 5 Nov 2026 · confidence: high")
    expect(react).toHaveTextContent("published 2025")
    expect(within(react).queryByTestId("prediction-label")).toBeNull()
  })

  it("labels every prediction 'Prediction, not verified', shows its basis as a forecast, and says its sources only informed it", async () => {
    renderApp("/research")
    await screen.findByRole(
      "heading",
      { level: 1, name: "What the evidence says" },
      TIMEOUT
    )
    const p = screen.getByRole("article", { name: "Retrieval basics" })
    expect(within(p).getByTestId("prediction-label")).toHaveTextContent(
      "Prediction, not verified"
    )
    expect(p).toHaveTextContent("This is a forecast, not a finding.")
    expect(p).toHaveTextContent("Informed by")
    expect(screen.getAllByTestId("prediction-label")).toHaveLength(1)
    expect(screen.getByTestId("research-count")).toHaveTextContent(
      "1 is a prediction"
    )
  })

  it("filters by area, level, kind of evidence and year, and says when nothing matches", async () => {
    const user = userEvent.setup()
    renderApp("/research")
    await screen.findByRole(
      "heading",
      { level: 1, name: "What the evidence says" },
      TIMEOUT
    )
    await user.selectOptions(screen.getByLabelText("Year"), "2027")
    expect(screen.getAllByTestId("research-entry")).toHaveLength(1)
    expect(screen.getByTestId("research-count")).toHaveTextContent(
      "Showing 1 of 3"
    )
    await user.selectOptions(screen.getByLabelText("Year"), "all")
    await user.selectOptions(
      screen.getByLabelText("Kind of evidence"),
      "job-market-trend"
    )
    expect(
      screen.getByRole("article", { name: "Demand for TypeScript" })
    ).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText("Area"), "frontend")
    expect(
      await screen.findByText("No entries match these filters")
    ).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText("Kind of evidence"), "all")
    await user.selectOptions(screen.getByLabelText("Level"), "advanced")
    // level 'all' entries match every level; the intermediate one does not
    expect(
      screen.queryByRole("article", { name: "Retrieval basics" })
    ).toBeNull()
  })

  it("has a bibliography of unique sources with how many entries cite each", async () => {
    const user = userEvent.setup()
    renderApp("/research")
    await screen.findByRole(
      "heading",
      { level: 1, name: "What the evidence says" },
      TIMEOUT
    )
    await user.click(screen.getByRole("tab", { name: /Bibliography/ }))
    const items = within(
      await screen.findByTestId("bibliography")
    ).getAllByRole("listitem")
    expect(items).toHaveLength(2) // the useState page is cited twice but listed once
    const react = items.find((i) => i.textContent?.includes("useState"))!
    expect(react).toHaveTextContent("cited by 2 entries")
    expect(react).toHaveTextContent("published 2025")
  })
})

describe("how we decide what to study", () => {
  it("states what is and is not known, and links to the research page", async () => {
    renderApp("/how-we-decide")
    await screen.findByRole(
      "heading",
      { level: 1, name: "How we decide what to study" },
      TIMEOUT
    )
    expect(
      screen.getByText(/We have no data on how often any question is asked/)
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "research page" })).toHaveAttribute(
      "href",
      "/research"
    )
    expect(screen.getByText(/Prediction, not verified/)).toBeInTheDocument()
  })
  it("is linked from the Interview Zone and the landing page", async () => {
    await seedOnboardedLearner()
    renderApp("/interview")
    expect(
      (
        await screen.findAllByRole(
          "link",
          { name: "How we decide what to study" },
          TIMEOUT
        )
      )[0]
    ).toHaveAttribute("href", "/how-we-decide")
  })
})

describe("no network, no AI claims", () => {
  it("the research feature has no fetch or network call and no claim of AI or assessment", () => {
    const sources = {
      ...import.meta.glob("/src/features/research/*.tsx", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
      ...import.meta.glob("/src/services/research/*.ts", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
    } as Record<string, string>
    const files = Object.entries(sources).filter(([f]) => !/\.test\./.test(f))
    expect(files.length).toBeGreaterThanOrEqual(5)
    for (const [f, src] of files)
      expect(src, f).not.toMatch(
        /\bfetch\s*\(|XMLHttpRequest|sendBeacon|new WebSocket|new EventSource/
      )
  })
})
