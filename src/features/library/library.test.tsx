import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeAll, beforeEach, describe, expect, it } from "vitest"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
  seedStudyLearner,
} from "@/test/render-app"
import { getModule } from "@/data/catalog/modules"
import { QUESTION_INDEX } from "@/data/questions/index.generated"
import { useLearnerStore } from "@/stores/learner-store"
import { LIBRARY_LISTS, selectLibrary } from "./lists"

const TIMEOUT = { timeout: 5000 }
const store = () => useLearnerStore.getState()
const entry = (id: string) => QUESTION_INDEX.find((q) => q.id === id)!
const title = (id: string) => entry(id).title

// Saved + note, difficult, saved + difficult, queued, completed (auto-scheduled).
const KEYS = "react.fresher.keys-in-lists"
const CLOSURES = "javascript.fresher.closures"
const FINAL = "java-core.fresher.final-keyword"
const HOISTING = "javascript.fresher.hoisting"
const VAR_LET = "javascript.fresher.var-let-const"

async function seedProgress() {
  await seedOnboardedLearner()
  await store().toggleFlag(KEYS, "bookmarked")
  await store().setNote(KEYS, "remember the key prop")
  await store().toggleFlag(CLOSURES, "difficult")
  await store().toggleFlag(FINAL, "bookmarked")
  await store().toggleFlag(FINAL, "difficult")
  await store().toggleFlag(HOISTING, "revision")
  await store().toggleCompleted(VAR_LET)
}

const EXPECTED: Record<string, string[]> = {
  "/library": [KEYS, CLOSURES, FINAL, HOISTING],
  "/library/saved": [KEYS, FINAL],
  "/library/difficult": [CLOSURES, FINAL],
  "/library/revision": [HOISTING, VAR_LET],
  "/library/notes": [KEYS],
}

const rowTitles = () =>
  screen.queryAllByRole("link").map((a) => a.textContent ?? "")
const sidebarLink = (name: string) => screen.getByRole("link", { name })
const badgeOf = (name: string) =>
  sidebarLink(name).closest("li")!.querySelector('[data-sidebar="menu-badge"]')

beforeAll(() => {
  // Radix Select needs pointer-capture and scroll APIs that jsdom lacks.
  Element.prototype.hasPointerCapture ??= () => false
  Element.prototype.setPointerCapture ??= () => {}
  Element.prototype.releasePointerCapture ??= () => {}
})

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

describe("library lists", () => {
  it.each(Object.entries(EXPECTED))(
    "%s lists exactly its questions",
    async (path, ids) => {
      await seedProgress()
      renderApp(path)
      await screen.findByText(title(ids[0]), {}, TIMEOUT)
      const text = rowTitles().join("\n")
      for (const q of QUESTION_INDEX) {
        if (ids.includes(q.id)) expect(text).toContain(q.title)
        else expect(text).not.toContain(q.title)
      }
    }
  )

  it("shows title, module, level, difficulty and the flags on each row", async () => {
    await seedProgress()
    renderApp("/library")
    const link = (await screen.findByText(title(KEYS), {}, TIMEOUT)).closest(
      "a"
    )!
    expect(link).toHaveAttribute("href", `/interview/question/${KEYS}`)
    expect(link).toHaveTextContent(getModule(entry(KEYS).moduleId)!.title)
    expect(within(link).getByText("Fresher")).toBeInTheDocument()
    expect(within(link).getByText(entry(KEYS).difficulty)).toBeInTheDocument()
    expect(within(link).getByText("Saved")).toBeInTheDocument()
    expect(within(link).getByText("Has note")).toBeInTheDocument()
    expect(within(link).queryByText("Difficult")).not.toBeInTheDocument()
  })

  it("heads each list with its name and count", async () => {
    await seedProgress()
    renderApp("/library/difficult")
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "Difficult" },
        TIMEOUT
      )
    ).toBeInTheDocument()
    expect(screen.getByText("2 questions")).toBeInTheDocument()
  })

  it("excludes removed questions from lists and counts", async () => {
    await seedProgress()
    await store().setQuestionRemoved(FINAL, true)
    renderApp("/library/saved")
    await screen.findByText(title(KEYS), {}, TIMEOUT)
    expect(screen.queryByText(title(FINAL))).not.toBeInTheDocument()
    await waitFor(() => expect(badgeOf("Saved")).toHaveTextContent(/^1/))
    expect(badgeOf("Difficult")).toHaveTextContent(/^1/)
    expect(badgeOf("All saved items")).toHaveTextContent(/^3/)
  })

  it("selects the same lists with or without a removed field on the record", () => {
    const p = (id: string, extra: object) => ({
      questionId: id,
      completed: false,
      bookmarked: true,
      difficult: false,
      revision: false,
      confidence: 0,
      note: "",
      attempts: 0,
      revisionStage: 0,
      nextReviewAt: null,
      completedAt: null,
      lastStudiedAt: null,
      updatedAt: "2026-01-01T00:00:00.000Z",
      removed: false,
      ...extra,
    })
    const legacy = p(KEYS, {}) as Record<string, unknown>
    delete legacy.removed
    const progress = {
      [KEYS]: legacy,
      [FINAL]: p(FINAL, { removed: true }),
    } as never
    expect(
      selectLibrary(progress, QUESTION_INDEX, new Date()).lists.saved.map(
        (q) => q.id
      )
    ).toEqual([KEYS])
  })
})

describe("sidebar", () => {
  it("lists the five library items as links with live counts", async () => {
    await seedProgress()
    renderApp("/library")
    await screen.findByText(title(KEYS), {}, TIMEOUT)
    const hrefs: Record<string, string> = {
      "All saved items": "/library",
      Saved: "/library/saved",
      Difficult: "/library/difficult",
      "Revision queue": "/library/revision",
      "My notes": "/library/notes",
    }
    const counts: Record<string, number> = {
      "All saved items": 4,
      Saved: 2,
      Difficult: 2,
      "Revision queue": 2,
      "My notes": 1,
    }
    for (const [name, href] of Object.entries(hrefs)) {
      expect(sidebarLink(name)).toHaveAttribute("href", href)
      await waitFor(() =>
        expect(badgeOf(name)).toHaveTextContent(new RegExp(`^${counts[name]}`))
      )
    }
    expect(
      screen.queryByRole("link", { name: "Bookmarks" })
    ).not.toBeInTheDocument()
  })

  it("counts equal what each page lists", async () => {
    await seedProgress()
    for (const list of LIBRARY_LISTS) {
      const { unmount } = renderApp(list.path)
      await screen.findByRole(
        "heading",
        { level: 1, name: list.title },
        TIMEOUT
      )
      const listed = EXPECTED[list.path].length
      await waitFor(() =>
        expect(badgeOf(list.title)).toHaveTextContent(new RegExp(`^${listed}`))
      )
      expect(
        screen.getAllByText(
          `${listed} ${listed === 1 ? "question" : "questions"}`
        ).length
      ).toBeGreaterThan(0)
      unmount()
    }
  })

  it("highlights only the active list", async () => {
    await seedProgress()
    renderApp("/library/revision")
    await screen.findByText(title(HOISTING), {}, TIMEOUT)
    for (const l of LIBRARY_LISTS) {
      const link = sidebarLink(l.title)
      if (l.id === "revision") {
        expect(link).toHaveAttribute("aria-current", "page")
        expect(link).toHaveAttribute("data-active", "true")
      } else {
        expect(link).not.toHaveAttribute("aria-current")
        expect(link).toHaveAttribute("data-active", "false")
      }
    }
  })

  it("highlights All saved items on /library only", async () => {
    await seedProgress()
    renderApp("/library")
    await screen.findByText(title(KEYS), {}, TIMEOUT)
    expect(sidebarLink("All saved items")).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(sidebarLink("Saved")).not.toHaveAttribute("aria-current")
  })

  it("does not show library items in Study Path", async () => {
    await seedStudyLearner()
    renderApp("/study")
    await screen.findAllByRole("link", { name: /Study home/ }, TIMEOUT)
    expect(
      screen.queryByRole("link", { name: "All saved items" })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: "Revision queue" })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: "Library" })
    ).not.toBeInTheDocument()
  })
})

describe("mobile", () => {
  it("has a Library tab that opens Saved and stays highlighted on every list", async () => {
    await seedProgress()
    renderApp("/library/notes")
    await screen.findByText(title(KEYS), {}, TIMEOUT)
    const bar = screen.getByRole("navigation", { name: "Primary" })
    expect(
      within(bar).queryByRole("link", { name: "Bookmarks" })
    ).not.toBeInTheDocument()
    const tab = within(bar).getByRole("link", { name: "Library" })
    expect(tab).toHaveAttribute("href", "/library/saved")
    expect(tab).toHaveAttribute("aria-current", "page")
    expect(within(bar).getAllByRole("link")).toHaveLength(5) // four tabs plus Switch
  })

  it("switches lists with the Show select, which is hidden from md up", async () => {
    const user = userEvent.setup()
    await seedProgress()
    const { router } = renderApp("/library/saved")
    await screen.findByText(title(KEYS), {}, TIMEOUT)
    const picker = screen.getByRole("combobox", { name: "Show:" })
    expect(picker.closest("div")).toHaveClass("md:hidden")
    expect(picker).toHaveTextContent("Saved (2)")

    await user.click(picker)
    await user.click(
      await screen.findByRole("option", { name: "Difficult (2)" })
    )
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/library/difficult")
    )
    expect(await screen.findByText(title(CLOSURES))).toBeInTheDocument()
    expect(screen.queryByText(title(KEYS))).not.toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Show:" })).toHaveTextContent(
      "Difficult (2)"
    )
  })
})

describe("/bookmarks", () => {
  it("redirects to /library/saved", async () => {
    await seedProgress()
    const { router } = renderApp("/bookmarks")
    await screen.findByText(title(KEYS), {}, TIMEOUT)
    expect(router.state.location.pathname).toBe("/library/saved")
  })

  it("replaces the history entry so Back does not bounce", async () => {
    await seedProgress()
    const { router } = renderApp(["/dashboard", "/bookmarks"])
    await screen.findByText(title(KEYS), {}, TIMEOUT)
    await router.navigate(-1)
    expect(router.state.location.pathname).toBe("/dashboard")
  })

  it("answers an unknown list with not-found", async () => {
    await seedOnboardedLearner()
    renderApp("/library/nope")
    expect(
      await screen.findByText("Page not found", {}, TIMEOUT)
    ).toBeInTheDocument()
  })
})

describe("clearing flags inline", () => {
  it("un-saving removes the row and updates the counts", async () => {
    const user = userEvent.setup()
    await seedProgress()
    renderApp("/library/saved")
    await screen.findByText(title(KEYS), {}, TIMEOUT)
    await user.click(
      screen.getByRole("button", { name: `Remove from Saved: ${title(KEYS)}` })
    )

    await waitFor(() =>
      expect(screen.queryByText(title(KEYS))).not.toBeInTheDocument()
    )
    expect(screen.getByText(title(FINAL))).toBeInTheDocument()
    expect(store().progress[KEYS].bookmarked).toBe(false)
    expect(store().progress[KEYS].note).toBe("remember the key prop") // only the flag is cleared
    expect(badgeOf("Saved")).toHaveTextContent(/^1/)
    expect(badgeOf("My notes")).toHaveTextContent(/^1/)
    expect(screen.getByText("1 question")).toBeInTheDocument()
  })

  it("un-flagging difficult keeps the question in Saved", async () => {
    const user = userEvent.setup()
    await seedProgress()
    renderApp("/library/difficult")
    await screen.findByText(title(FINAL), {}, TIMEOUT)
    await user.click(
      screen.getByRole("button", { name: `Clear difficult: ${title(FINAL)}` })
    )
    await waitFor(() =>
      expect(screen.queryByText(title(FINAL))).not.toBeInTheDocument()
    )
    expect(store().progress[FINAL]).toMatchObject({
      difficult: false,
      bookmarked: true,
    })
    expect(badgeOf("Saved")).toHaveTextContent(/^2/)
    expect(badgeOf("Difficult")).toHaveTextContent(/^1/)
  })

  it("offers no clear button for notes or for scheduled-only revision items", async () => {
    await seedProgress()
    const { unmount } = renderApp("/library/notes")
    await screen.findByText(title(KEYS), {}, TIMEOUT)
    expect(
      screen.queryByRole("button", { name: /Remove|Clear/ })
    ).not.toBeInTheDocument()
    unmount()

    renderApp("/library/revision")
    await screen.findByText(title(VAR_LET), {}, TIMEOUT)
    expect(
      screen.getByRole("button", {
        name: `Remove from revision queue: ${title(HOISTING)}`,
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", {
        name: `Remove from revision queue: ${title(VAR_LET)}`,
      })
    ).not.toBeInTheDocument()
    expect(screen.getByText(/Next review/)).toBeInTheDocument()
  })
})

describe("search and module filter", () => {
  it("filters by text and by module, and can be cleared", async () => {
    const user = userEvent.setup()
    await seedProgress()
    renderApp("/library")
    await screen.findByText(title(KEYS), {}, TIMEOUT)

    await user.type(
      screen.getByRole("searchbox", { name: "Search All saved items" }),
      "closure"
    )
    expect(await screen.findByText(title(CLOSURES))).toBeInTheDocument()
    expect(screen.queryByText(title(KEYS))).not.toBeInTheDocument()
    expect(screen.getByText("Showing 1 of 4")).toBeInTheDocument()

    await user.type(screen.getByRole("searchbox"), "zzzz")
    expect(await screen.findByText("No matching questions")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Clear filters" }))
    expect(await screen.findByText(title(KEYS))).toBeInTheDocument()

    await user.click(screen.getByRole("combobox", { name: "Module" }))
    await user.click(
      await screen.findByRole("option", {
        name: getModule("javascript")!.title,
      })
    )
    await waitFor(() =>
      expect(screen.queryByText(title(KEYS))).not.toBeInTheDocument()
    )
    expect(screen.getByText(title(CLOSURES))).toBeInTheDocument()
    expect(screen.getByText(title(HOISTING))).toBeInTheDocument()
    expect(screen.getByText("Showing 2 of 4")).toBeInTheDocument()
  })
})

describe("empty states", () => {
  it.each(LIBRARY_LISTS)("$title explains how to fill it", async (list) => {
    await seedOnboardedLearner()
    renderApp(list.path)
    expect(
      await screen.findByText(list.empty.title, {}, TIMEOUT)
    ).toBeInTheDocument()
    expect(screen.getByText(list.empty.description)).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Open Interview Zone" })
    ).toHaveAttribute("href", "/interview")
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument()
  })

  it("gives each list its own message", () => {
    expect(new Set(LIBRARY_LISTS.map((l) => l.empty.title)).size).toBe(
      LIBRARY_LISTS.length
    )
  })
})
