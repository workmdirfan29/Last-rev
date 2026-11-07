import { screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { a11yViolations } from "@/test/a11y"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
  seedStudyLearner,
} from "@/test/render-app"

/** Automated accessibility checks (axe-core) over the main screens, as a regression gate. */
const PAGES: [string, string, RegExp][] = [
  ["landing", "/choose", /What would you like to do today/],
  ["dashboard", "/dashboard", /Overview|Good (morning|afternoon|evening)/],
  ["interview zone", "/interview", /Common interview questions/],
  ["readiness", "/readiness", /Job readiness/],
  ["job match", "/job-match", /Match a job description/],
  ["research", "/research", /What the evidence says/],
  ["how we decide", "/how-we-decide", /How we decide what to study/],
  ["linux", "/linux", /Linux practice/],
  ["english", "/english", /Spoken English/],
  ["english lesson", "/english/lesson/fundamentals/alphabet", /alphabet/i],
  ["study home", "/study", /Java Full Stack AI Engineer/],
  ["roadmap", "/study/roadmap", /^Roadmap$/],
  ["study lessons", "/study/lessons", /^Lessons$/],
  [
    "study lesson",
    "/study/lesson/java-core/first-program",
    /first Java program/i,
  ],
  ["study practice", "/study/practice", /^Practice$/],
  ["study quizzes", "/study/quizzes", /^Quizzes$/],
  ["study revise", "/study/revise", /^Revise$/],
  ["study progress", "/study/progress", /My progress/],
  ["settings", "/settings", /^Settings$/],
]

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
  await seedOnboardedLearner()
  await seedStudyLearner()
})

describe("axe-core finds no violations", () => {
  for (const [name, path, heading] of PAGES)
    it(
      name,
      async () => {
        renderApp(path)
        await screen.findByRole(
          "heading",
          { level: 1, name: heading },
          { timeout: 15000 }
        )
        await new Promise((r) => setTimeout(r, 300))
        expect(await a11yViolations()).toEqual([])
      },
      30000
    )
})
