import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { renderApp, resetLearner, seedStudyLearner } from "@/test/render-app"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { ENGLISH_INDEX } from "@/data/english/index.generated"
import {
  searchEnglishLessons,
  searchLinux,
  searchStudyLessons,
  SEARCH_COPY,
} from "./mode-search"

const TIMEOUT = { timeout: 5000 }
beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

describe("per-journey search (pure)", () => {
  it("Linux searches commands only; English searches lessons by title, Hindi title and goal", () => {
    const hits = searchLinux("mkdir")
    expect(hits.length).toBeGreaterThan(0)
    expect(hits.every((h) => h.to.startsWith("/linux/command/"))).toBe(true)
    expect(searchLinux("   ")).toEqual([])
    const first = ENGLISH_INDEX[0]
    const found = searchEnglishLessons(first.title.split(" ").at(-1)!)
    expect(found.some((h) => h.key === first.id)).toBe(true)
    expect(found.every((h) => h.to.startsWith("/english/lesson/"))).toBe(true)
  })

  it("Study searches its lessons by title, topic and module", () => {
    const l = LESSON_INDEX[0]
    const hits = searchStudyLessons(l.title.split(" ")[0])
    expect(hits.some((h) => h.key === l.id)).toBe(true)
    expect(hits.every((h) => h.to.startsWith("/study/lesson/"))).toBe(true)
    expect(searchStudyLessons("   ")).toEqual([])
    expect(SEARCH_COPY.study.trigger).toBe("Search lessons…")
  })

  it("names each journey's search for what it searches", () => {
    expect(SEARCH_COPY.english.trigger).toBe("Search the course…")
    expect(SEARCH_COPY.linux.trigger).toBe("Search commands…")
    expect(SEARCH_COPY.interview.trigger).toBe("Search questions…")
  })
})

describe("the header search in each journey", () => {
  it("English: relabelled, finds lessons and sentences, opens a sentence at its item", async () => {
    const user = userEvent.setup()
    renderApp("/english")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Spoken English" },
      TIMEOUT
    )
    expect(screen.getByText("Search the course…")).toBeInTheDocument()
    await user.keyboard("{Control>}k{/Control}")
    const input = await screen.findByPlaceholderText(
      /Search lessons, sentences/
    )
    await user.type(input, "good morning")
    expect(
      await screen.findByText("Sentences and words", undefined, TIMEOUT)
    ).toBeInTheDocument()
    const option = (await screen.findAllByRole("option")).find((o) =>
      /Good morning/.test(o.textContent ?? "")
    )!
    await user.click(option)
    expect(
      await screen.findByLabelText("Lesson item", undefined, TIMEOUT)
    ).toBeInTheDocument()
  })

  it("Linux: relabelled and finds commands, not interview questions", async () => {
    const user = userEvent.setup()
    renderApp("/linux")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Linux practice" },
      TIMEOUT
    )
    expect(screen.getByText("Search commands…")).toBeInTheDocument()
    await user.keyboard("{Control>}k{/Control}")
    const input = await screen.findByPlaceholderText(/Search commands or pages/)
    await user.type(input, "mkdir")
    const options = await screen.findAllByRole("option", undefined, TIMEOUT)
    expect(options.some((o) => /mkdir/.test(o.textContent ?? ""))).toBe(true)
    expect(screen.queryByText("Questions")).toBeNull()
  })

  it("Study: finds lessons and opens one", async () => {
    const user = userEvent.setup()
    await seedStudyLearner()
    renderApp("/study/lessons")
    await screen.findByRole("heading", { level: 1, name: "Lessons" }, TIMEOUT)
    await user.keyboard("{Control>}k{/Control}")
    const input = await screen.findByPlaceholderText(
      /Search lessons, projects, quizzes or pages/
    )
    await user.type(input, LESSON_INDEX[0].title.split(" ")[0])
    const options = await screen.findAllByRole("option", undefined, TIMEOUT)
    await user.click(
      options.find((o) =>
        (o.textContent ?? "").includes(LESSON_INDEX[0].title)
      )!
    )
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: LESSON_INDEX[0].title },
        TIMEOUT
      )
    ).toBeInTheDocument()
  })
})
