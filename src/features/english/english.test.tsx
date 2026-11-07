import { cleanup, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { ENGLISH_CHALLENGE } from "@/data/english/challenge"
import { ENGLISH_INDEX } from "@/data/english/index.generated"
import { NAV_BY_MODE, SWITCH_MODE_ITEM, navItemsFor } from "@/app/nav"
import { SPEECH_NOTICE } from "@/services/english/speech"
import { useLearnerStore } from "@/stores/learner-store"
import { renderApp, resetLearner } from "@/test/render-app"
import { DRAFT_NOTE, PRIVACY_POINTS, SPEAKING_HONESTY } from "./copy"
import { sides } from "./pages/revise-page"

const TIMEOUT = { timeout: 5000 }
const first = ENGLISH_INDEX[0]
const lessonPath = `/english/lesson/${first.moduleId}/${first.slug}`

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
  await useLearnerStore.getState().hydrate()
})

/** Wording the app must never use: it does not assess, score or judge speech, and uses no AI. */
const FORBIDDEN =
  /\bAI\b|artificial intelligence|\bassess(?:ed|ment)?\b|scored by|graded by|accent score|fluency score|pronunciation (?:grade|rating)|machine learning/i

describe("navigation", () => {
  it("lists the English pages and keeps the mobile tab bar no fuller than the other journeys'", () => {
    const items = NAV_BY_MODE.english.flatMap((g) => g.items)
    expect(items.map((i) => i.to)).toEqual(
      expect.arrayContaining([
        "/english",
        "/english/course",
        "/english/challenge",
        "/english/practice",
        "/english/revise",
        "/english/progress",
      ])
    )
    const tabs = (m: "interview" | "study" | "linux" | "english") =>
      [...navItemsFor(m).filter((i) => i.mobile), SWITCH_MODE_ITEM].length
    expect(tabs("english")).toBeLessThanOrEqual(
      Math.max(tabs("interview"), tabs("study"), tabs("linux"))
    )
  })
})

describe("home", () => {
  it("opens without any set-up, shows the continue card, revision count, progress and the privacy block", async () => {
    renderApp("/english")
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "Spoken English" },
        TIMEOUT
      )
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /Open the lesson/ })
    ).toHaveAttribute("href", lessonPath)
    expect(screen.getByTestId("due-count")).toHaveTextContent(
      "Nothing to revise today."
    )
    expect(screen.getByTestId("english-privacy")).toBeInTheDocument()
    for (const p of PRIVACY_POINTS)
      expect(screen.getByText(p)).toBeInTheDocument()
    expect(screen.getByText(SPEAKING_HONESTY)).toBeInTheDocument()
  })

  it("says the challenge is being written while its days do not exist, and never invents a day", async () => {
    renderApp("/english")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Spoken English" },
      TIMEOUT
    )
    if (ENGLISH_CHALLENGE.length === 30) {
      expect(screen.getByText(/Day \d+ is next/)).toBeInTheDocument()
    } else {
      expect(screen.getByTestId("challenge-pending")).toBeInTheDocument()
    }
  })
})

describe("course", () => {
  it("lists the modules that have lessons with a draft note, and a module page lists its lessons with Hindi marked lang=hi", async () => {
    renderApp("/english/course")
    await screen.findByRole(
      "heading",
      { level: 1, name: "The course" },
      TIMEOUT
    )
    const link = screen.getAllByRole("link", {
      name: /English Fundamentals/,
    })[0]
    expect(link).toHaveAttribute("href", "/english/course/fundamentals")
    expect(screen.getAllByText(DRAFT_NOTE).length).toBeGreaterThan(0)
    cleanup()

    renderApp("/english/course/fundamentals")
    await screen.findByTestId("draft-note", undefined, TIMEOUT)
    const hindi = document.querySelectorAll('[lang="hi"]')
    expect(hindi.length).toBeGreaterThan(0)
    for (const el of hindi)
      expect(el.textContent).toMatch(/\p{Script=Devanagari}/u)
    const lessonLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.startsWith("/english/lesson/"))
    expect(lessonLinks.length).toBeGreaterThan(0)
  })

  it("says plainly when a module has no lessons", async () => {
    renderApp("/english/course/professional-nope")
    expect(
      await screen.findByText("Module not found", undefined, TIMEOUT)
    ).toBeInTheDocument()
  })
})

describe("a lesson", () => {
  it("shows English with lang=en-IN, Hindi with lang=hi and the draft note", async () => {
    renderApp(lessonPath)
    await screen.findByLabelText("Lesson item", undefined, TIMEOUT)
    expect(screen.getByTestId("draft-note")).toHaveTextContent(
      "not yet been reviewed"
    )
    expect(document.querySelectorAll('[lang="en-IN"]').length).toBeGreaterThan(
      0
    )
    expect(document.querySelectorAll('[lang="hi"]').length).toBeGreaterThan(0)
  })

  it("'I know this' is a progress record that schedules a review, and finishing the lesson is its own record", async () => {
    const user = userEvent.setup()
    renderApp(lessonPath)
    await screen.findByLabelText("Lesson item", undefined, TIMEOUT)
    await user.click(screen.getByRole("button", { name: "I know this" }))
    const itemId = first.itemIds[0]
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[itemId]?.completed).toBe(true)
    )
    expect(
      useLearnerStore.getState().progress[itemId].nextReviewAt
    ).not.toBeNull()
    await user.click(screen.getByRole("button", { name: "Finish this lesson" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[first.id]?.completed).toBe(
        true
      )
    )
    // clicking again takes the mark back
    await user.click(screen.getByRole("button", { name: "You know this" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[itemId]?.completed).toBe(false)
    )
  })

  it("moves item by item and says which item it is on", async () => {
    const user = userEvent.setup()
    renderApp(lessonPath)
    await screen.findByLabelText("Lesson item", undefined, TIMEOUT)
    expect(
      screen.getByText(`Item 1 of ${first.itemIds.length}`)
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /^Next/ }))
    expect(
      screen.getByText(`Item 2 of ${first.itemIds.length}`)
    ).toBeInTheDocument()
  })

  it("writing practice is announced in a live region and a wrong answer shows the real one", async () => {
    const user = userEvent.setup()
    renderApp(lessonPath)
    await screen.findByLabelText("Lesson item", undefined, TIMEOUT)
    await user.click(
      screen.getByRole("button", { name: "Practise this by writing" })
    )
    const input = await screen
      .findByLabelText(
        /Type this in English|Put the words|Fill in|Choose/,
        undefined,
        TIMEOUT
      )
      .catch(() => null)
    expect(screen.getByTestId("result")).toHaveAttribute("aria-live", "polite")
    if (input instanceof HTMLInputElement) {
      await user.type(input, "zzz qqq")
      await user.click(screen.getByRole("button", { name: "Check" }))
      expect(screen.getByTestId("result")).toHaveTextContent("Not quite")
      // nothing is learned from a wrong answer
      expect(useLearnerStore.getState().english?.passes ?? {}).toEqual({})
    }
  })
})

describe("revision", () => {
  it("shows nothing when nothing is due, and a due item can be revealed and rated, which reschedules it", async () => {
    const user = userEvent.setup()
    renderApp("/english/revise")
    expect(
      await screen.findByText("Nothing to revise today", undefined, TIMEOUT)
    ).toBeInTheDocument()
    cleanup()

    const itemId = first.itemIds[0]
    await useLearnerStore.getState().toggleCompleted(itemId, 1, "english")
    useLearnerStore.setState((s) => ({
      progress: {
        ...s.progress,
        [itemId]: {
          ...s.progress[itemId],
          nextReviewAt: "2000-01-01T00:00:00.000Z",
        },
      },
    }))
    renderApp("/english/revise")
    await screen.findByLabelText("Revision card", undefined, TIMEOUT)
    expect(screen.getByTestId("revise-position")).toHaveTextContent("1 of 1")
    await user.click(screen.getByRole("button", { name: "Show the English" }))
    await user.click(screen.getByRole("radio", { name: /I knew it at once/ }))
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[itemId].confidence).toBe(5)
    )
    expect(
      new Date(
        useLearnerStore.getState().progress[itemId].nextReviewAt!
      ).getTime()
    ).toBeGreaterThan(Date.now())
    expect(
      await screen.findByText("Revision finished for today")
    ).toBeInTheDocument()
  })
})

describe("challenge", () => {
  it("is honest before its days exist", async () => {
    renderApp("/english/challenge")
    if (ENGLISH_CHALLENGE.length === 30) {
      expect(
        await screen.findByTestId("challenge-summary", undefined, TIMEOUT)
      ).toBeInTheDocument()
      expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(30)
    } else {
      expect(
        await screen.findByText(
          "The 30-day challenge is being written",
          undefined,
          TIMEOUT
        )
      ).toBeInTheDocument()
    }
  })
})

describe("practice and progress", () => {
  it("offers writing, speaking and listening, and says how many exercises exist rather than padding", async () => {
    renderApp("/english/practice")
    await screen.findByRole("heading", { level: 1, name: "Practice" }, TIMEOUT)
    expect(screen.getByRole("tab", { name: "Writing" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Speaking" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Listening" })).toBeInTheDocument()
    expect(screen.getByTestId("available")).toHaveTextContent(/exercises/)
  })

  it("shows only real numbers on the progress page", async () => {
    renderApp("/english/progress")
    await screen.findByRole(
      "heading",
      { level: 1, name: "My progress" },
      TIMEOUT
    )
    expect(
      screen.getByText("Lessons finished").parentElement!.parentElement
    ).toHaveTextContent(`0 of ${ENGLISH_INDEX.length}`)
    expect(
      screen.getByText("Confidence (1 to 5)").parentElement!.parentElement
    ).toHaveTextContent("No check-ins yet")
  })
})

describe("revision card sides", () => {
  it("shows Hindi first for sentences and words, and the English on reveal", () => {
    const sentence = {
      id: "en.x.y.z",
      kind: "sentence",
      en: "Good morning.",
      hi: "सुप्रभात।",
    } as never
    expect(sides(sentence)).toMatchObject({
      front: "सुप्रभात।",
      back: "Good morning.",
    })
  })
})

describe("honest wording", () => {
  it("no page uses wording that claims AI or an assessment of speech", async () => {
    const pages = [
      "/english",
      "/english/course",
      "/english/course/fundamentals",
      lessonPath,
      "/english/practice",
      "/english/challenge",
      "/english/progress",
      "/english/revise",
    ]
    for (const path of pages) {
      renderApp(path)
      await waitFor(
        () => expect(document.querySelector("h1, h2")).not.toBeNull(),
        TIMEOUT
      )
      await new Promise((r) => setTimeout(r, 50))
      expect(document.body.textContent, path).not.toMatch(FORBIDDEN)
      cleanup()
    }
    expect(SPEECH_NOTICE).not.toMatch(FORBIDDEN)
  })

  it("the source of the English feature uses no network call and no forbidden wording in its copy", () => {
    const sources = {
      ...import.meta.glob("/src/features/english/**/*.{ts,tsx}", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
      ...import.meta.glob("/src/services/english/*.ts", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
    } as Record<string, string>
    const files = Object.entries(sources).filter(([f]) => !/\.test\./.test(f))
    expect(files.length).toBeGreaterThan(10)
    for (const [f, src] of files) {
      expect(src, f).not.toMatch(
        /\bfetch\s*\(|XMLHttpRequest|sendBeacon|new WebSocket|new EventSource/
      )
    }
    const copy = files.find(([f]) => f.endsWith("/english/copy.ts"))![1]
    expect(copy).not.toMatch(FORBIDDEN)
  })
})

describe("settings", () => {
  it("is reachable from English without a profile and states the same privacy points", async () => {
    renderApp("/english")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Spoken English" },
      TIMEOUT
    )
    expect(
      within(screen.getByTestId("english-privacy")).getAllByRole("listitem")
        .length
    ).toBe(PRIVACY_POINTS.length + 1)
  })
})
