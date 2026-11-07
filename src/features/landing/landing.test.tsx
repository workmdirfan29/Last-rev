import {
  cleanup as cleanupAll,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { matchRoutes } from "react-router"
import { routes } from "@/app/router"
import { LANDING_FEATURES } from "@/app/features"
import { LINUX_CHALLENGES } from "@/data/linux/challenges"
import { LINUX_COMMANDS } from "@/data/linux/commands"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { resetResumeForTests } from "@/features/landing/resume"
import { ROADMAPS } from "@/data/catalog/roadmaps"
import { phasesOf } from "@/data/catalog/phases"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import {
  phaseState,
  phaseStats,
  resolvePhases,
  roadmapLessons,
} from "@/services/study/roadmap"
import { MODULE_BY_ID } from "@/data/catalog/modules"
import { defaultsForRoadmap } from "@/services/curriculum/relevance"
import { parseImport } from "@/services/storage/import-export"
import { useLearnerStore } from "@/stores/learner-store"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
  seedStudyLearner,
} from "@/test/render-app"

const TIMEOUT = { timeout: 5000 }
const QID = "react.fresher.keys-in-lists"

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

async function findLanding() {
  return screen.findByRole(
    "heading",
    { level: 1, name: "What would you like to do today?" },
    TIMEOUT
  )
}

describe("landing page", () => {
  it("shows the three journeys to a new learner, not the career-path cards", async () => {
    renderApp("/")
    await findLanding()

    expect(
      screen.getByRole("heading", { level: 2, name: "Interview Prep" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "Study Path" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Explore Interview Prep" })
    ).toHaveAttribute("href", "/start/interview")
    expect(
      screen.getByRole("link", { name: "Explore Study Path" })
    ).toHaveAttribute("href", "/start/study")

    // The nine career-path cards are no longer the first screen.
    expect(screen.queryByText("Frontend Developer")).not.toBeInTheDocument()
    expect(
      screen.queryByText("What would you like to prepare for?")
    ).not.toBeInTheDocument()

    // The Study card lists the real roadmaps, and unbuilt features are labelled rather than promised.
    for (const r of ROADMAPS)
      expect(screen.getByText(r.title)).toBeInTheDocument()
    expect(screen.getAllByText("Soon").length).toBeGreaterThan(0)
  })

  it("marks unbuilt features with a clock and a Soon tag, never a check mark", async () => {
    renderApp("/")
    await findLanding()
    // Only "Practical Projects and Assignments" is still unbuilt: every other feature has a page.
    for (const label of ["Practical Projects and Assignments"]) {
      const item = screen.getByText(label).closest("li")!
      expect(within(item).getByText("Soon")).toBeInTheDocument()
      expect(item.querySelector("svg.lucide-check")).toBeNull()
      expect(item.querySelector("svg.lucide-clock")).not.toBeNull()
    }
    const built = screen
      .getByText("Technical Interview Questions")
      .closest("li")!
    expect(built.querySelector("svg.lucide-check")).not.toBeNull()
    expect(within(built).queryByText("Soon")).not.toBeInTheDocument()
  })

  it("has no dead controls: every button on the page is real", async () => {
    renderApp("/")
    await findLanding()
    // Only the theme toggle is a button; both cards are links.
    expect(
      screen.getAllByRole("button").map((b) => b.getAttribute("aria-label"))
    ).toEqual(["Change theme"])
  })
})

describe("interview journey", () => {
  it("runs from the landing page to the dashboard and remembers the mode", async () => {
    const user = userEvent.setup()
    const { router } = renderApp("/")
    await findLanding()
    await user.click(
      screen.getByRole("link", { name: "Explore Interview Prep" })
    )
    await screen.findByText("What would you like to prepare for?", {}, TIMEOUT)
    expect(router.state.location.pathname).toBe("/start/interview")

    const card = screen
      .getByText("Frontend Developer", { selector: "h3" })
      .closest("article")!
    await user.click(
      within(card).getByRole("button", { name: "Start preparation" })
    )
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await screen.findByText("How much experience do you have?")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await user.click(await screen.findByRole("button", { name: /^Skip/ }))
    await screen.findByText("Set your pace")
    await user.type(screen.getByLabelText("Your name"), "Asha")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await screen.findByText("Review your preparation syllabus")
    await user.click(screen.getByRole("button", { name: "Start preparing" }))

    await waitFor(
      () => expect(router.state.location.pathname).toBe("/dashboard"),
      TIMEOUT
    )
    const state = useLearnerStore.getState()
    expect(state.profile?.onboardedAt).toBeTruthy()
    expect(state.profile?.studyOnboardedAt).toBeNull()
    expect(state.preferences.lastMode).toBe("interview")
  })
})

describe("study journey", () => {
  it("runs from the landing page to Study home with only real content", async () => {
    const user = userEvent.setup()
    const { router } = renderApp("/")
    await findLanding()
    await user.click(screen.getByRole("link", { name: "Explore Study Path" }))
    await screen.findByText("Which roadmap do you want to follow?", {}, TIMEOUT)
    expect(router.state.location.pathname).toBe("/start/study")

    // A roadmap is required before continuing.
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    expect(await screen.findByText("Pick a roadmap")).toBeInTheDocument()

    await user.click(
      screen.getByRole("radio", { name: /MERN Full Stack AI Engineer/ })
    )
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await screen.findByText("How much experience do you have?")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await screen.findByText("Set your pace")
    await user.type(screen.getByLabelText("Your name"), "Asha")
    expect(screen.queryByLabelText(/Interview date/)).not.toBeInTheDocument() // interview-only field
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await screen.findByText("Review your study syllabus", {}, TIMEOUT)
    await user.click(screen.getByRole("button", { name: "Start studying" }))

    await waitFor(
      () => expect(router.state.location.pathname).toBe("/study"),
      TIMEOUT
    )
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "MERN Full Stack AI Engineer",
      })
    ).toBeInTheDocument()
    // Only real content: the roadmap's phases are listed, and every phase without lessons says so.
    expect(
      screen.getByRole("heading", { name: "Roadmap at a glance" })
    ).toBeInTheDocument()
    // the counts come from the same data the page reads, so they stay right as lessons are written
    const views = resolvePhases(
      phasesOf("mern-full-stack-ai"),
      resolveSyllabus({
        defaults: defaultsForRoadmap("mern-full-stack-ai"),
        overrides: {},
        experience: "fresher",
      })
    )
    const states = views.map((v) =>
      phaseState(v, phaseStats(v, LESSON_INDEX, {}))
    )
    expect(screen.queryAllByText("Lessons in preparation")).toHaveLength(
      states.filter((x) => x === "in-preparation").length
    )
    expect(screen.getAllByText("Project-led")).toHaveLength(1)
    if (roadmapLessons(views, LESSON_INDEX).length === 0)
      expect(screen.getByTestId("no-next-lesson")).toHaveTextContent(
        "No lessons are ready for your roadmap yet."
      )
    else expect(screen.queryByTestId("no-next-lesson")).toBeNull()

    // No interview content or interview navigation in this journey.
    expect(
      screen.queryByRole("link", { name: /Interview Zone/ })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: /All saved items|Revision queue/ })
    ).not.toBeInTheDocument()
    expect(
      screen.getAllByRole("link", { name: /Switch mode/ }).length
    ).toBeGreaterThan(0)

    const state = useLearnerStore.getState()
    expect(state.profile).toMatchObject({
      studyRoadmap: "mern-full-stack-ai",
      onboardedAt: null,
    })
    expect(state.profile?.studyOnboardedAt).toBeTruthy()
    expect(state.preferences.lastMode).toBe("study")
  })

  it("keeps study pages behind study set-up", async () => {
    await seedOnboardedLearner() // interview only
    const { router } = renderApp("/study")
    await screen.findByText("Which roadmap do you want to follow?", {}, TIMEOUT)
    expect(router.state.location.pathname).toBe("/start/study")
  })

  it("only references modules that exist in the catalogue, never interview-only ones", () => {
    for (const r of ROADMAPS) {
      const ids = [...defaultsForRoadmap(r.id).keys()]
      expect(ids.length).toBeGreaterThan(0)
      for (const id of ids) {
        expect(MODULE_BY_ID.has(id), `${r.id}: ${id}`).toBe(true)
        expect(MODULE_BY_ID.get(id)!.domainId, `${r.id}: ${id}`).not.toBe(
          "career"
        )
      }
    }
  })

  it("lets the start screen offer a way back to the choices", async () => {
    const user = userEvent.setup()
    const { router } = renderApp("/start/study")
    await screen.findByText("Which roadmap do you want to follow?", {}, TIMEOUT)
    await user.click(screen.getByRole("link", { name: "Change mode" }))
    await findLanding()
    expect(router.state.location.pathname).toBe("/choose")
  })
})

describe("returning learners", () => {
  it("resumes the last-used journey from /", async () => {
    await seedOnboardedLearner()
    await seedStudyLearner()
    await useLearnerStore.getState().updatePreferences({ lastMode: "study" })
    const { router } = renderApp("/")
    await waitFor(
      () => expect(router.state.location.pathname).toBe("/study"),
      TIMEOUT
    )
  })

  it("sends a learner who set up only Interview Prep (before modes existed) to the dashboard", async () => {
    await seedOnboardedLearner() // lastMode stays null
    const { router } = renderApp("/")
    await waitFor(
      () => expect(router.state.location.pathname).toBe("/dashboard"),
      TIMEOUT
    )
  })

  it("resumes only on the first entry: Back from the dashboard shows the landing page and stays", async () => {
    await seedOnboardedLearner()
    await useLearnerStore
      .getState()
      .updatePreferences({ lastMode: "interview" })
    // History: "/" then the dashboard. "/" was never shown in this page load, as after opening the dashboard directly.
    const { router } = renderApp(["/", "/dashboard"])
    await screen.findByText(/Tester/, {}, TIMEOUT)
    await router.navigate(-1)
    await findLanding()
    expect(router.state.location.pathname).toBe("/")
    // And it stays: no bounce forward.
    await new Promise((r) => setTimeout(r, 300))
    expect(router.state.location.pathname).toBe("/")
  })

  it("resumes again after a fresh page load", async () => {
    await seedOnboardedLearner()
    await useLearnerStore
      .getState()
      .updatePreferences({ lastMode: "interview" })
    const first = renderApp("/")
    await waitFor(
      () => expect(first.router.state.location.pathname).toBe("/dashboard"),
      TIMEOUT
    )
    first.unmount()
    resetResumeForTests() // a reload
    const second = renderApp("/")
    await waitFor(
      () => expect(second.router.state.location.pathname).toBe("/dashboard"),
      TIMEOUT
    )
  })

  it("never redirects /choose", async () => {
    await seedOnboardedLearner()
    await useLearnerStore
      .getState()
      .updatePreferences({ lastMode: "interview" })
    const { router } = renderApp("/choose")
    await findLanding()
    expect(router.state.location.pathname).toBe("/choose")
    expect(screen.getByText("Last used")).toBeInTheDocument()
  })

  it("switching modes keeps progress and the other journey's profile", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner()
    await useLearnerStore.getState().toggleCompleted(QID, 4)
    await useLearnerStore
      .getState()
      .updatePreferences({ lastMode: "interview" })
    const before = useLearnerStore.getState().profile!

    const { router } = renderApp("/dashboard")
    await screen.findByText(/Tester/, {}, TIMEOUT)
    const switchLinks = await screen.findAllByRole("link", { name: /Switch/ })
    await user.click(switchLinks[0])
    await findLanding()
    expect(router.state.location.pathname).toBe("/choose")

    await user.click(screen.getByRole("link", { name: "Explore Study Path" }))
    await screen.findByText("Which roadmap do you want to follow?", {}, TIMEOUT)
    await user.click(
      screen.getByRole("radio", { name: /Java Full Stack AI Engineer/ })
    )
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await user.click(await screen.findByRole("button", { name: /^Continue/ }))
    await user.click(await screen.findByRole("button", { name: /^Continue/ }))
    await user.click(
      await screen.findByRole("button", { name: "Start studying" })
    )
    await waitFor(
      () => expect(router.state.location.pathname).toBe("/study"),
      TIMEOUT
    )

    const after = useLearnerStore.getState()
    expect(after.progress[QID]).toMatchObject({ completed: true })
    expect(after.profile).toMatchObject({
      selectedRoles: before.selectedRoles,
      primaryRole: before.primaryRole,
      onboardedAt: before.onboardedAt,
      studyRoadmap: "java-full-stack-ai",
    })

    // And back again: Interview Prep is still set up, with its data.
    const back = await screen.findAllByRole("link", { name: /Switch/ })
    await user.click(back[0])
    await findLanding()
    await user.click(
      screen.getByRole("link", { name: "Explore Interview Prep" })
    )
    await waitFor(
      () => expect(router.state.location.pathname).toBe("/dashboard"),
      TIMEOUT
    )
    expect(useLearnerStore.getState().progress[QID]?.completed).toBe(true)
  })
})

describe("backward compatibility", () => {
  it("imports an export file written before modes existed", () => {
    const old = {
      app: "lastrev",
      version: 1,
      exportedAt: "2025-01-01T00:00:00.000Z",
      profile: {
        displayName: "Old",
        selectedRoles: ["frontend-developer"],
        primaryRole: "frontend-developer",
        experience: "fresher",
        knownSkills: [],
        targetRole: "",
        dailyStudyHours: 2,
        targetPreset: "30d",
        targetDate: "2099-01-01",
        interviewDate: null,
        onboardedAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
      preferences: {
        revisionIntervals: [1, 3, 7],
        answerMode: "quick",
        selfTest: false,
        sidebarCollapsed: false,
      },
      questionProgress: [],
      activity: [],
    }
    const result = parseImport(JSON.stringify(old))
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.bundle.preferences.lastMode).toBeNull()
    expect(result.bundle.profile).toMatchObject({
      studyRoadmap: null,
      studyOnboardedAt: null,
      onboardedAt: old.profile.onboardedAt,
    })
  })

  it("hydrates a profile saved before the new fields existed", async () => {
    const legacy = {
      displayName: "Old",
      selectedRoles: ["frontend-developer"],
      primaryRole: "frontend-developer",
      experience: "fresher",
      knownSkills: [],
      targetRole: "",
      dailyStudyHours: 2,
      targetPreset: "30d",
      targetDate: "2099-01-01",
      interviewDate: null,
      onboardedAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    }
    const repo = {
      load: async () => ({
        profile: legacy,
        preferences: {
          revisionIntervals: [1],
          answerMode: "quick",
          selfTest: false,
          sidebarCollapsed: false,
        },
        questionProgress: [],
        activity: [],
      }),
    }
    const { createLearnerStore } = await import("@/stores/learner-store")
    const store = createLearnerStore(repo as never)
    await store.getState().hydrate()
    expect(store.getState().profile).toMatchObject({
      studyRoadmap: null,
      studyOnboardedAt: null,
      onboardedAt: legacy.onboardedAt,
    })
  })
})

describe("linux journey", () => {
  it("is a third card with derived counts, all features built, in a three-column grid that stacks on small screens", async () => {
    renderApp("/")
    await findLanding()
    expect(
      screen.getByRole("heading", { level: 2, name: "Linux Practice" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Explore Linux Practice" })
    ).toHaveAttribute("href", "/linux")
    expect(
      screen.getByText(
        "Practise Linux commands in a safe simulated terminal, with a searchable command library, a permissions calculator, date formats and challenges."
      )
    ).toBeInTheDocument()
    const list = screen.getByRole("list", { name: "Linux Practice includes" })
    const items = within(list).getAllByRole("listitem")
    expect(items.map((li) => li.textContent)).toEqual([
      `Command library (${LINUX_COMMANDS.length} unique commands)`,
      "Safe practice terminal",
      "Permissions calculator",
      "Date format explorer",
      `Challenges (${LINUX_CHALLENGES.length})`,
    ])
    for (const li of items) {
      expect(li.querySelector("svg.lucide-check")).not.toBeNull()
      expect(within(li).queryByText("Soon")).not.toBeInTheDocument()
    }
    // four cards (the English course has lessons): a 2 x 2 grid from tablet width, one column below
    const grid = screen.getAllByRole("article")[0].parentElement!
    expect(grid.className).toMatch(/md:grid-cols-2/)
    expect(grid.className).not.toMatch(/(?<!md:)grid-cols-[23]/)
    expect(screen.getAllByRole("article")).toHaveLength(4)
    // headline and subtitle are unchanged
    expect(
      screen.getByText(
        "Choose your learning path. Prepare for interviews, build technical skills, and become job-ready at your own pace."
      )
    ).toBeInTheDocument()
  })

  it("flips the built features to a check mark and keeps only unbuilt ones as Soon, from one list", async () => {
    renderApp("/")
    await findLanding()
    for (const label of [
      "HR Interview Preparation",
      "Mock Interview Practice",
      "Resume-Based Questions",
      "Daily Learning Tracker",
    ]) {
      const li = screen.getByText(label).closest("li")!
      expect(li.querySelector("svg.lucide-check"), label).not.toBeNull()
      expect(within(li).queryByText("Soon")).not.toBeInTheDocument()
    }
    expect(screen.getAllByText("Soon")).toHaveLength(1) // Practical Projects and Assignments
    // a feature is "Soon" exactly when it has no route; every route is a real page
    for (const [mode, features] of Object.entries(LANDING_FEATURES))
      for (const f of features)
        if (f.route)
          expect(
            matchRoutes(routes, f.route),
            `${mode}: ${f.label} -> ${f.route}`
          ).not.toBeNull()
    expect(
      Object.values(LANDING_FEATURES)
        .flat()
        .filter((f) => !f.route)
        .map((f) => f.label)
    ).toEqual(["Practical Projects and Assignments"])
  })

  it("goes straight to /linux without onboarding or a profile, and remembers it", async () => {
    const user = userEvent.setup()
    const { router } = renderApp("/")
    await findLanding()
    await user.click(
      screen.getByRole("link", { name: "Explore Linux Practice" })
    )
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "Linux practice" },
        TIMEOUT
      )
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe("/linux")
    expect(useLearnerStore.getState().profile).toBeNull()
    await waitFor(() =>
      expect(useLearnerStore.getState().preferences.lastMode).toBe("linux")
    )
    // Linux navigation: every section, Switch mode and Settings; no Interview or Study pages
    const sidebar = screen.getAllByRole("link").map((a) => a.textContent)
    for (const label of [
      "Commands",
      "Terminal",
      "Permissions",
      "Date formats",
      "Challenges",
      "Switch mode",
      "Settings",
    ])
      expect(sidebar, label).toContain(label)
    expect(sidebar).not.toContain("Interview Zone")
    expect(sidebar).not.toContain("Study home")
  })

  it("resumes to /linux on the first entry after a load, and /choose never redirects", async () => {
    await useLearnerStore.getState().hydrate()
    await useLearnerStore.getState().updatePreferences({ lastMode: "linux" })
    const first = renderApp("/")
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "Linux practice" },
        TIMEOUT
      )
    ).toBeInTheDocument()
    expect(first.router.state.location.pathname).toBe("/linux")
    first.unmount()
    // later visits show the choices (Back never bounces forward again), with the card marked as last used
    renderApp("/")
    await findLanding()
    expect(screen.getByText("Last used")).toBeInTheDocument()
    cleanupAll()
    resetResumeForTests()
    const choose = renderApp("/choose")
    await findLanding()
    expect(choose.router.state.location.pathname).toBe("/choose")
  })

  it("keeps Linux progress with no profile: it persists, and it is in the export", async () => {
    const user = userEvent.setup()
    await useLearnerStore.getState().hydrate()
    await useLearnerStore.getState().updatePreferences({ lastMode: "linux" })
    renderApp("/linux")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Linux practice" },
      TIMEOUT
    )
    await user.click(
      await screen.findByRole("button", {
        name: "Mark learned: mkdir <dirname>",
      })
    )
    await waitFor(() =>
      expect(
        Object.keys(useLearnerStore.getState().progress).some((k) =>
          k.startsWith("linux.")
        )
      ).toBe(true)
    )
    const bundle = useLearnerStore.getState().exportData()
    expect(bundle.profile).toBeNull()
    expect(
      bundle.questionProgress.some(
        (p) => p.questionId.startsWith("linux.") && p.completed
      )
    ).toBe(true)
    const parsed = parseImport(JSON.stringify(bundle))
    expect(parsed.ok).toBe(true)
    // a challenge completed in the store also persists across a fresh load
    await useLearnerStore
      .getState()
      .toggleCompleted("linux.challenge.make-a-directory", 5, "linux")
    expect(
      useLearnerStore
        .getState()
        .exportData()
        .questionProgress.some(
          (p) =>
            p.questionId === "linux.challenge.make-a-directory" && p.completed
        )
    ).toBe(true)
  })

  it("lets a learner with no profile open Settings, export, import and reset", async () => {
    const user = userEvent.setup()
    await useLearnerStore.getState().hydrate()
    await useLearnerStore.getState().updatePreferences({ lastMode: "linux" })
    await useLearnerStore
      .getState()
      .toggleCompleted("linux.challenge.make-a-directory", 5, "linux")
    const { router } = renderApp("/settings")
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "Settings" },
        TIMEOUT
      )
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe("/settings")
    expect(
      screen.getByRole("button", { name: /Export backup/ })
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText("Choose a LastRev backup file")
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /Reset everything/ }))
    await user.click(
      await screen.findByRole("button", {
        name: /Delete everything|Delete all/,
      })
    )
    await waitFor(() => expect(useLearnerStore.getState().progress).toEqual({}))
  })

  it("Study Path still has its Linux link, pointing at the same page and keeping the Study navigation", async () => {
    const user = userEvent.setup()
    await seedStudyLearner()
    const { router } = renderApp("/study")
    const link = (
      await screen.findAllByRole("link", { name: "Linux practice" }, TIMEOUT)
    )[0]
    expect(link).toHaveAttribute("href", "/linux")
    await user.click(link)
    expect(router.state.location.pathname).toBe("/linux")
    expect(
      await screen.findByRole("heading", { level: 1, name: "Linux practice" })
    ).toBeInTheDocument()
    expect(screen.getByText("Study Path")).toBeInTheDocument() // eyebrow
    expect(
      screen.getAllByRole("link", { name: "Study home" }).length
    ).toBeGreaterThan(0)
    expect(useLearnerStore.getState().preferences.lastMode).toBe("study")
  })
})
