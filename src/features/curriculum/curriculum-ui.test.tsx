import { questionsIn } from "@/test/content-counts"
import { useState } from "react"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Providers } from "@/app/providers"
import { MODULES } from "@/data/catalog/modules"
import { SKILLS, SKILL_GROUPS } from "@/data/curriculum/skills"
import { defaultsForRoles } from "@/services/curriculum/relevance"
import {
  resolveSyllabus,
  type SyllabusOverrides,
} from "@/services/curriculum/syllabus"
import { toHours } from "@/services/curriculum/time"
import { useLearnerStore } from "@/stores/learner-store"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
  seedStudyLearner,
} from "@/test/render-app"
import {
  CurriculumBuilder,
  type CurriculumBuilderProps,
} from "./curriculum-builder"
import { SkillPicker } from "./skill-picker"

const TIMEOUT = { timeout: 10000 }

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

function Harness(
  props: Partial<CurriculumBuilderProps> & { initial?: SyllabusOverrides }
) {
  const [value, setValue] = useState<SyllabusOverrides>(props.initial ?? {})
  return (
    <Providers>
      <MemoryRouter>
        <CurriculumBuilder
          source={{ kind: "roles", roleIds: ["frontend-developer"] }}
          experience="fresher"
          dailyMinutes={120}
          targetDays={60}
          value={value}
          onChange={setValue}
          {...props}
        />
      </MemoryRouter>
    </Providers>
  )
}

/** Areas other than the first two start collapsed; open one by its heading. */
async function openArea(
  user: ReturnType<typeof userEvent.setup>,
  label: string
) {
  const trigger = await screen.findByRole("button", {
    name: new RegExp(`^${label}`),
  })
  if (trigger.getAttribute("aria-expanded") === "false")
    await user.click(trigger)
}

const expected = (roleIds: string[], overrides: SyllabusOverrides = {}) =>
  resolveSyllabus({
    defaults: defaultsForRoles(roleIds),
    overrides,
    experience: "fresher",
  }).filter((e) => e.selected)

describe("CurriculumBuilder", () => {
  it("takes every total from data: two roles give two different, correct summaries", async () => {
    const fe = render(
      <Harness source={{ kind: "roles", roleIds: ["frontend-developer"] }} />
    )
    const feModules = await screen.findByTestId("summary-modules", {}, TIMEOUT)
    const feExpected = expected(["frontend-developer"])
    expect(feModules).toHaveTextContent(String(feExpected.length))
    expect(screen.getByTestId("summary-hours")).toHaveTextContent(
      `${toHours(feExpected.reduce((n, e) => n + e.minutes, 0))} h`
    )
    fe.unmount()

    render(<Harness source={{ kind: "roles", roleIds: ["java-full-stack"] }} />)
    const jfsExpected = expected(["java-full-stack"])
    expect(await screen.findByTestId("summary-modules")).toHaveTextContent(
      String(jfsExpected.length)
    )
    expect(jfsExpected.length).not.toBe(feExpected.length)
    expect(screen.getByTestId("summary-hours")).toHaveTextContent(
      `${toHours(jfsExpected.reduce((n, e) => n + e.minutes, 0))} h`
    )
  })

  it("is honest about content that does not exist: lessons are in preparation and questions are real counts", async () => {
    render(<Harness />)
    const summary = await screen.findByRole(
      "region",
      { name: "Syllabus summary" },
      TIMEOUT
    )
    // the count is read from the data: "in preparation" only while none of the selected modules has a lesson
    const lessonTotal = expected(["frontend-developer"]).reduce(
      (n, e) => n + e.module.lessons.length,
      0
    )
    expect(
      within(summary).getByText("Lessons").nextElementSibling
    ).toHaveTextContent(
      lessonTotal > 0 ? String(lessonTotal) : "in preparation"
    )
    expect(
      within(summary).getByText("Questions ready").nextElementSibling
    ).toHaveTextContent(/\d+/)
    expect(
      screen.getByText(/planning estimates, not measurements/)
    ).toBeInTheDocument()
  })

  it("explains core modules, and lets recommended and optional ones be toggled, updating the summary", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await screen.findByTestId("summary-modules", {}, TIMEOUT)

    const react = screen.getByRole("checkbox", { name: "Include React" })
    expect(react).toBeChecked()
    expect(react).toBeEnabled()
    expect(react).toHaveAccessibleDescription(/Core for your path/)

    const before = Number(screen.getByTestId("summary-modules").textContent)
    const hoursBefore = screen.getByTestId("summary-hours").textContent
    await openArea(user, "Mobile")
    const rn = screen.getByRole("checkbox", { name: "Include React Native" })
    expect(rn).not.toBeChecked()
    await user.click(rn)
    expect(rn).toBeChecked()
    expect(Number(screen.getByTestId("summary-modules").textContent)).toBe(
      before + 1
    )
    expect(screen.getByTestId("summary-hours").textContent).not.toBe(
      hoursBefore
    )

    const query = screen.getByRole("checkbox", {
      name: "Include TanStack Query",
    })
    expect(query).toBeChecked() // recommended: on by default
    await user.click(query)
    // a removed recommended module leaves the list and waits in "Removed", where it can be restored
    expect(
      await screen.findByRole("button", { name: "Restore TanStack Query" })
    ).toBeInTheDocument()
    expect(Number(screen.getByTestId("summary-modules").textContent)).toBe(
      before
    )
    // the summary bar is a polite live region that announces the totals
    expect(
      document.querySelector(
        '[role="status"][aria-live="polite"][aria-atomic="true"]'
      )
    ).toHaveTextContent(/modules/)
  })

  it("asks before removing a core module, then moves it to Removed with a Restore that brings it back", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await screen.findByTestId("summary-modules", {}, TIMEOUT)
    const before = Number(screen.getByTestId("summary-modules").textContent)

    await user.click(screen.getByRole("checkbox", { name: "Include React" }))
    const dialog = await screen.findByRole("alertdialog")
    expect(
      within(dialog).getByText(
        /Core for your path. Remove anyway\? You can restore it any time/
      )
    ).toBeInTheDocument()
    // Keeping it changes nothing.
    await user.click(within(dialog).getByRole("button", { name: "Keep it" }))
    expect(Number(screen.getByTestId("summary-modules").textContent)).toBe(
      before
    )
    expect(
      screen.getByRole("checkbox", { name: "Include React" })
    ).toBeChecked()

    await user.click(screen.getByRole("checkbox", { name: "Include React" }))
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Remove",
      })
    )
    await waitFor(() =>
      expect(Number(screen.getByTestId("summary-modules").textContent)).toBe(
        before - 1
      )
    )
    const removed = screen.getByRole("region", {
      name: /Removed from your syllabus/,
    })
    expect(within(removed).getByText("React")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Restore React" }))
    await waitFor(() =>
      expect(Number(screen.getByTestId("summary-modules").textContent)).toBe(
        before
      )
    )
    expect(
      screen.queryByRole("region", { name: /Removed from your syllabus/ })
    ).not.toBeInTheDocument()
  })

  it("removes a recommended module without a prompt", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await screen.findByTestId("summary-modules", {}, TIMEOUT)
    await user.click(
      screen.getByRole("checkbox", { name: "Include TanStack Query" })
    )
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    expect(
      screen.getByRole("region", { name: /Removed from your syllabus/ })
    ).toBeInTheDocument()
  })

  it("shows only data that exists in an expanded module: topics with minutes, questions against targets, lessons in preparation", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await screen.findByTestId("summary-modules", {}, TIMEOUT)
    await user.click(
      screen.getByRole("button", { name: "Show details for React" })
    )
    const topics = await screen.findByRole("region", { name: "React topics" })
    expect(within(topics).getByText("JSX")).toBeInTheDocument()
    expect(within(topics).getAllByText(/\d+ min/).length).toBeGreaterThan(5)
    const questions = screen.getByRole("region", { name: "React questions" })
    expect(
      within(questions).getByText(
        new RegExp(
          `${questionsIn("react", "fresher").length} available · target 25`
        )
      )
    ).toBeInTheDocument()
    expect(
      within(questions).getByText(
        new RegExp(
          `${questionsIn("react", "intermediate").length} available · target 50`
        )
      )
    ).toBeInTheDocument()
    expect(
      within(questions).getByText(
        new RegExp(
          `${questionsIn("react", "advanced").length} available · target 75`
        )
      )
    ).toBeInTheDocument()
    const content = screen.getByRole("region", { name: "React content" })
    const reactLessons = MODULES.find((m) => m.id === "react")!.lessons.length
    expect(
      within(content).getByText(
        reactLessons > 0
          ? new RegExp(`Lessons: ${reactLessons}`)
          : /Lessons: in preparation/
      )
    ).toBeInTheDocument()
    expect(
      within(content).getByText(/Practical assignments: none yet/)
    ).toBeInTheDocument()
    expect(within(content).getByText(/Projects: none yet/)).toBeInTheDocument()
    expect(
      within(content).getByText(/Builds on: JavaScript/)
    ).toBeInTheDocument()
  })

  it("lets a learner replace a module's time and go back to the estimate", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await screen.findByTestId("summary-modules", {}, TIMEOUT)
    await user.click(
      screen.getByRole("button", { name: "Show details for CSS3" })
    )
    const hours = await screen.findByLabelText(
      "Your time for this module (hours)"
    )
    await user.clear(hours)
    await user.type(hours, "20{Enter}")
    expect(await screen.findByText("20 h (yours)")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Use the estimate" }))
    await waitFor(() =>
      expect(screen.queryByText("20 h (yours)")).not.toBeInTheDocument()
    )
  })

  it("links Linux modules to Linux practice in Study Path only", async () => {
    const user = userEvent.setup()
    const interview = render(
      <Harness source={{ kind: "roles", roleIds: ["java-full-stack"] }} />
    )
    await screen.findByTestId("summary-modules", {}, TIMEOUT)
    await user.click(
      screen.getByRole("button", {
        name: "Show details for Linux Command Mastery",
      })
    )
    expect(
      screen.queryByRole("link", { name: /Linux practice/ })
    ).not.toBeInTheDocument()
    interview.unmount()

    render(
      <Harness source={{ kind: "roadmap", roadmapId: "java-full-stack-ai" }} />
    )
    await screen.findByTestId("summary-modules")
    await user.click(
      screen.getByRole("button", {
        name: "Show details for Linux Command Mastery",
      })
    )
    expect(
      await screen.findByRole("link", { name: /Practise in Linux practice/ })
    ).toHaveAttribute("href", "/linux")
  })

  it("filters by search, status and the full catalogue toggle", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await screen.findByTestId("summary-modules", {}, TIMEOUT)
    expect(
      screen.queryByRole("checkbox", { name: "Include Spring Boot" })
    ).not.toBeInTheDocument() // not in a Frontend path

    await user.click(
      screen.getByRole("switch", { name: "Also show topics outside my path" })
    )
    expect(
      await screen.findByRole("checkbox", { name: "Include Spring Boot" })
    ).toBeInTheDocument()
    expect(screen.getAllByText("Not in your path").length).toBeGreaterThan(0)

    await user.type(screen.getByLabelText("Search modules"), "redux")
    expect(
      await screen.findByText("Showing 1 of", { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Include State Management" })
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Clear filters" }))

    await user.click(screen.getByRole("button", { name: "Core" }))
    expect(
      await screen.findByRole("checkbox", { name: "Include React" })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("checkbox", { name: "Include TanStack Query" })
    ).not.toBeInTheDocument()
  })

  it("shows the ambitious state with three options, and Prepare core first defers without removing anything, with Undo", async () => {
    const user = userEvent.setup()
    const extend = vi.fn()
    const more = vi.fn()
    render(
      <Harness
        dailyMinutes={60}
        targetDays={90}
        onExtendDeadline={extend}
        onIncreaseDaily={more}
      />
    )
    expect(
      await screen.findByText(
        "Your target is ambitious for the selected syllabus.",
        {},
        TIMEOUT
      )
    ).toBeInTheDocument()
    const options = screen.getByRole("list", { name: "Ways to make it fit" })
    expect(
      within(options).getByText(/A\. Extend the deadline/)
    ).toBeInTheDocument()
    expect(
      within(options).getByText(/B\. Prepare core first/)
    ).toBeInTheDocument()
    expect(
      within(options).getByText(/C\. Study more each day/)
    ).toBeInTheDocument()

    const modulesBefore = screen.getByTestId("summary-modules").textContent
    const hoursBefore = screen.getByTestId("summary-hours").textContent
    await user.click(screen.getByRole("button", { name: "Prepare core first" }))
    expect(await screen.findByText(/Core first is on/)).toBeInTheDocument()
    expect(screen.getByTestId("summary-modules")).toHaveTextContent(
      modulesBefore!
    ) // nothing removed
    expect(screen.getByTestId("summary-hours").textContent).not.toBe(
      hoursBefore
    ) // only "now" hours count
    expect(screen.getAllByText("Later").length).toBeGreaterThan(0)

    await user.click(screen.getByRole("button", { name: "Undo" }))
    await waitFor(() =>
      expect(screen.queryByText(/Core first is on/)).not.toBeInTheDocument()
    )
    expect(screen.getByTestId("summary-hours").textContent).toBe(hoursBefore)

    await user.click(
      screen.getByRole("button", { name: /Set deadline to \d+ days/ })
    )
    expect(extend).toHaveBeenCalledWith(expect.any(Number))
    await user.click(
      screen.getByRole("button", { name: /Study [\d.]+ h a day/ })
    )
    expect(more).toHaveBeenCalled()
  })

  it("does not offer studying an unrealistic number of hours a day", async () => {
    render(
      <Harness dailyMinutes={30} targetDays={7} onIncreaseDaily={vi.fn()} />
    )
    expect(
      await screen.findByText(/which is not realistic/, {}, TIMEOUT)
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /Study [\d.]+ h a day/ })
    ).not.toBeInTheDocument()
  })

  it("says the deadline is realistic when it fits, and offers no options", async () => {
    render(<Harness dailyMinutes={720} targetDays={365} />)
    expect(
      await screen.findByText(
        "Your deadline looks realistic for this syllabus.",
        {},
        TIMEOUT
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("list", { name: "Ways to make it fit" })
    ).not.toBeInTheDocument()
  })

  it("marks modules whose technologies the learner knows, without changing hours", async () => {
    const plain = render(<Harness />)
    await screen.findByTestId("summary-modules", {}, TIMEOUT)
    const hours = screen.getByTestId("summary-hours").textContent
    plain.unmount()
    render(<Harness knownSkillIds={["react-router"]} />)
    await screen.findByTestId("summary-modules")
    expect(screen.getAllByText("You know this").length).toBeGreaterThan(0)
    expect(screen.getByTestId("summary-hours").textContent).toBe(hours)
  })
})

describe("SkillPicker", () => {
  function PickerHarness({ initial = [] }: { initial?: string[] }) {
    const [value, setValue] = useState<string[]>(initial)
    return <SkillPicker skills={SKILLS} value={value} onChange={setValue} />
  }

  it("is a real table: one row per category with the category as the row header", async () => {
    render(<PickerHarness />)
    const table = screen.getByRole("table")
    const frontend = within(table).getByRole("row", { name: /Frontend/ })
    expect(within(frontend).getByRole("rowheader")).toHaveTextContent(
      "Frontend"
    )
    // featured technologies first: the user's own examples are all there
    for (const name of ["JavaScript ES6+", "TypeScript", "React.js"])
      expect(within(frontend).getByRole("button", { name })).toBeInTheDocument()
    // One Backend row merges Java, Node.js and Python, with the user's examples featured first.
    const backend = within(table)
      .getByRole("rowheader", { name: /^Backend/ })
      .closest("tr")!
    for (const name of [
      "Java",
      "Spring Boot",
      "Node.js",
      "Express.js",
      "Python",
      "Django",
      "FastAPI",
    ])
      expect(within(backend).getByRole("button", { name })).toBeInTheDocument()
    expect(
      within(table).queryByRole("rowheader", { name: /^(Java|Python|MERN)/ })
    ).not.toBeInTheDocument()
  })

  it("every category shows 3 to 8 featured technologies, and Show more reveals the rest of that row only", async () => {
    const user = userEvent.setup()
    render(<PickerHarness />)
    const frontend = screen.getByRole("row", { name: /Frontend/ })
    const before = within(frontend)
      .getAllByRole("button", { pressed: false })
      .filter((b) => b.hasAttribute("aria-pressed")).length
    expect(before).toBeGreaterThanOrEqual(3)
    expect(before).toBeLessThanOrEqual(8)
    expect(
      within(frontend).queryByRole("button", { name: "Lighthouse" })
    ).not.toBeInTheDocument()
    await user.click(
      within(frontend).getByRole("button", { name: /Show \d+ more/ })
    )
    expect(
      within(frontend).getByRole("button", { name: "Lighthouse" })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Razorpay" })
    ).not.toBeInTheDocument() // another row, still folded
    await user.click(
      within(frontend).getByRole("button", { name: "Show fewer" })
    )
    expect(
      within(frontend).queryByRole("button", { name: "Lighthouse" })
    ).not.toBeInTheDocument()
  })

  it("splits the expanded Backend row under Java, Node.js and Python labels", async () => {
    const user = userEvent.setup()
    render(<PickerHarness />)
    const backend = screen
      .getByRole("rowheader", { name: /^Backend/ })
      .closest("tr")!
    expect(
      within(backend).queryByRole("group", { name: "Java" })
    ).not.toBeInTheDocument() // folded: featured only
    await user.click(
      within(backend).getByRole("button", { name: /Show \d+ more/ })
    )
    for (const stack of ["Java", "Node.js", "Python"]) {
      const group = within(backend).getByRole("group", { name: stack })
      expect(within(group).getAllByRole("button").length).toBeGreaterThan(2)
    }
    expect(
      within(within(backend).getByRole("group", { name: "Java" })).getByRole(
        "button",
        { name: "Spring Security" }
      )
    ).toBeInTheDocument()
    expect(
      within(within(backend).getByRole("group", { name: "Node.js" })).getByRole(
        "button",
        { name: "JWT" }
      )
    ).toBeInTheDocument()
    expect(
      within(within(backend).getByRole("group", { name: "Python" })).getByRole(
        "button",
        { name: "Django" }
      )
    ).toBeInTheDocument()
  })

  it("offers every catalogue technology exactly once once all rows are expanded, and nothing missing from the catalogue", async () => {
    const user = userEvent.setup()
    render(<PickerHarness />)
    for (const more of screen.queryAllByRole("button", {
      name: /Show \d+ more/,
    }))
      await user.click(more)
    const names = screen
      .getAllByRole("button")
      .filter((b) => b.hasAttribute("aria-pressed"))
      .map((b) => b.textContent)
    expect(names).toHaveLength(SKILLS.length)
    expect(new Set(names).size).toBe(SKILLS.length)
    for (const name of names)
      expect(
        SKILLS.some((s) => s.title === name),
        name
      ).toBe(true)
    for (const required of [
      "React.js",
      "Spring Boot",
      "Razorpay",
      "Jira",
      "Let's Encrypt",
      "EAS Build",
      "Mongoose",
      "LangChain",
    ])
      expect(names).toContain(required)
  })

  it("searches by title or alias, toggles, and counts the selection live", async () => {
    const user = userEvent.setup()
    render(<PickerHarness />)
    await user.type(screen.getByLabelText("Search technologies"), "rtl")
    const chip = await screen.findByRole("button", {
      name: "React Testing Library",
    })
    expect(chip).toHaveAttribute("aria-pressed", "false")
    await user.click(chip)
    expect(chip).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("1 selected")).toBeInTheDocument()
    await user.click(chip)
    expect(screen.getByText("0 selected")).toBeInTheDocument()
    await user.clear(screen.getByLabelText("Search technologies"))
    await user.type(screen.getByLabelText("Search technologies"), "zzzz")
    expect(await screen.findByText(/No technology matches/)).toBeInTheDocument()
  })

  it("keeps older free-text entries visible and removable", async () => {
    const user = userEvent.setup()
    render(<PickerHarness initial={["react", "Underwater Basket Weaving"]} />)
    expect(screen.getByRole("button", { name: "React.js" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByText("2 selected")).toBeInTheDocument()
    await user.click(
      screen.getByRole("button", { name: "Remove Underwater Basket Weaving" })
    )
    expect(screen.getByText("1 selected")).toBeInTheDocument()
  })
})

describe("onboarding and settings", () => {
  it("step 3 offers every technology, and the review step saves customisations that survive a reload", async () => {
    const user = userEvent.setup()
    const { router } = renderApp("/start/interview")
    await screen.findByText("What would you like to prepare for?", {}, TIMEOUT)
    const card = screen
      .getByText("Frontend Developer", { selector: "h3" })
      .closest("article")!
    await user.click(
      within(card).getByRole("button", { name: "Start preparation" })
    )
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await user.click(await screen.findByRole("button", { name: /^Continue/ })) // experience -> skills

    await screen.findByText("What do you already know?")
    await user.type(screen.getByLabelText("Search technologies"), "spring")
    await user.click(await screen.findByRole("button", { name: "Spring Boot" }))
    await user.clear(screen.getByLabelText("Search technologies"))
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await screen.findByText("Set your pace")
    await user.type(screen.getByLabelText("Your name"), "Asha")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))

    expect(
      await screen.findByText("Review your preparation syllabus", {}, TIMEOUT)
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Your personalized learning and interview preparation plan/
      )
    ).toBeInTheDocument()
    await openArea(user, "Mobile")
    await user.click(
      await screen.findByRole("checkbox", { name: "Include React Native" })
    )
    await user.click(screen.getByRole("button", { name: "Start preparing" }))
    await waitFor(
      () => expect(router.state.location.pathname).toBe("/dashboard"),
      TIMEOUT
    )

    const profile = useLearnerStore.getState().profile!
    expect(profile.knownSkills).toEqual(["spring-boot"])
    expect(profile.syllabusOverrides).toEqual({
      "react-native": { selected: true },
    })

    // "Reload": a fresh store hydration reads the same data back.
    await useLearnerStore.getState().hydrate()
    expect(useLearnerStore.getState().profile!.syllabusOverrides).toEqual({
      "react-native": { selected: true },
    })
  })

  it("Settings: edits the syllabus and saves each change, edits known skills, and audits skill coverage", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    renderApp("/settings/syllabus")
    await openArea(user, "Mobile")
    await user.click(
      await screen.findByRole(
        "checkbox",
        { name: "Include React Native" },
        TIMEOUT
      )
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().profile!.syllabusOverrides).toEqual({
        "react-native": { selected: true },
      })
    )

    await user.click(screen.getByRole("tab", { name: "Known skills" }))
    await user.click(await screen.findByRole("button", { name: "React.js" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().profile!.knownSkills).toContain("react")
    )

    await user.click(screen.getByRole("tab", { name: "Skill coverage" }))
    expect(
      await screen.findByText(/resume skills are covered by the catalogue/)
    ).toBeInTheDocument()
    const react = screen
      .getByText("React.js", { selector: "span.font-medium" })
      .closest("li")!
    expect(within(react).getByText("In your syllabus")).toBeInTheDocument()
    expect(within(react).getByText("you know this")).toBeInTheDocument()
    const spring = screen
      .getByText("Spring Boot", { selector: "span.font-medium" })
      .closest("li")!
    expect(within(spring).getByText("Not in your syllabus")).toBeInTheDocument()
    const expo = screen
      .getByText("Expo", { selector: "span.font-medium" })
      .closest("li")!
    // choosing React Native adds only that module, not Expo
    expect(within(expo).getByText("Not in your syllabus")).toBeInTheDocument()
  })

  it("Settings Study syllabus keeps its own overrides apart from the interview ones", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({
      selectedRoles: ["frontend-developer"],
      syllabusOverrides: { "react-native": { selected: true } },
    })
    await seedStudyLearner({ studyRoadmap: "python-full-stack-ai" })
    await useLearnerStore.getState().updatePreferences({ lastMode: "study" })
    renderApp("/settings/syllabus")
    await screen.findByText("Study syllabus", {}, TIMEOUT)
    await openArea(user, "Python Engineering")
    await user.click(
      await screen.findByRole("checkbox", { name: "Include Django" })
    )
    await waitFor(() =>
      expect(
        useLearnerStore.getState().profile!.studySyllabusOverrides
      ).toEqual({ django: { selected: false } })
    )
    expect(useLearnerStore.getState().profile!.syllabusOverrides).toEqual({
      "react-native": { selected: true },
    })
  })
})

describe("existing learners", () => {
  it("with no overrides still see every module they could browse, and read the same data back", async () => {
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    expect(useLearnerStore.getState().profile!.syllabusOverrides).toEqual({})
    renderApp("/interview")
    expect(
      await screen.findByText("Common interview questions", {}, TIMEOUT)
    ).toBeInTheDocument()
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"))
    for (const slug of ["react", "javascript", "react-hooks"])
      expect(hrefs).toContain(`/interview/frontend-developer/${slug}`)
    expect(screen.getAllByText("Core").length).toBeGreaterThan(0)
  })
})

describe("Interview Zone home follows the learner's path", () => {
  it("leads with the path's core and recommended modules and keeps the rest under a collapsed 'Explore other topics (optional)'", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ selectedRoles: ["frontend-developer"] })
    const tiers = defaultsForRoles(["frontend-developer"])
    const outside = MODULES.filter(
      (m) => !tiers.has(m.id) && questionsIn(m.id).length > 0
    )
    const optionalTier = MODULES.filter(
      (m) => tiers.get(m.id) === "optional" && questionsIn(m.id).length > 0
    )
    expect(outside.length + optionalTier.length).toBeGreaterThan(0)
    renderApp("/interview")
    await screen.findByText("Common interview questions", {}, TIMEOUT)
    const toggle = await screen.findByRole("button", {
      name: /Explore other topics \(optional\)/,
    })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    const hrefs = () =>
      screen.getAllByRole("link").map((a) => a.getAttribute("href"))
    expect(hrefs()).toContain("/interview/frontend-developer/react")
    for (const m of [...outside, ...optionalTier])
      expect(hrefs()).not.toContain(`/interview/frontend-developer/${m.id}`)

    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    for (const m of [...outside, ...optionalTier].slice(0, 5))
      expect(hrefs()).toContain(`/interview/frontend-developer/${m.id}`)
    expect(screen.getAllByText("Optional").length).toBeGreaterThan(0)
    // the path's own modules are still where they were
    expect(hrefs()).toContain("/interview/frontend-developer/react")
  })
})

describe("SkillPicker follows the learner's path", () => {
  const OPTIONAL = /Other technologies \(optional\)/
  const FRONTEND = defaultsForRoles(["frontend-developer"], {
    includeCareer: false,
  })

  function PathHarness({
    roles,
    initial = [],
  }: {
    roles: string[]
    initial?: string[]
  }) {
    const [value, setValue] = useState<string[]>(initial)
    return (
      <SkillPicker
        skills={SKILLS}
        value={value}
        onChange={setValue}
        relevance={defaultsForRoles(roles, { includeCareer: false })}
      />
    )
  }
  const rowheaders = (scope: HTMLElement) =>
    within(scope)
      .queryAllByRole("rowheader")
      .map((h) => h.textContent ?? "")
  const label = (g: (typeof SKILL_GROUPS)[number]) =>
    ({
      frontend: "Frontend",
      backend: "Backend",
      databases: "Databases",
      mobile: "Mobile",
      devops: "DevOps & Cloud",
      ai: "AI",
      "data-science": "Data Science",
      tools: "Tools & practices",
      foundation: "Foundation",
    })[g]

  it("with only Frontend selected, backend, database, mobile, AI and data categories are not in the main table but sit in a collapsed optional section", async () => {
    const user = userEvent.setup()
    render(<PathHarness roles={["frontend-developer"]} />)
    const main = screen.getByRole("table")
    const names = rowheaders(main)
    for (const wanted of ["Frontend", "Tools", "Foundation", "DevOps"])
      expect(
        names.some((n) => n.startsWith(wanted)),
        wanted
      ).toBe(true)
    for (const hidden of [
      "Backend",
      "Databases",
      "Mobile",
      "AI",
      "Data Science",
    ])
      expect(
        names.some((n) => n.startsWith(hidden)),
        hidden
      ).toBe(false)
    // strongest first: Frontend (core) before DevOps (recommended only)
    expect(names.findIndex((n) => n.startsWith("Frontend"))).toBeLessThan(
      names.findIndex((n) => n.startsWith("DevOps"))
    )

    const toggle = screen.getByRole("button", { name: OPTIONAL })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(
      screen.getByText(
        "Not part of your selected path. Open it if you already know some of these, or want to explore."
      )
    ).toBeVisible()
    expect(screen.getAllByRole("table")).toHaveLength(1) // collapsed: nothing of it rendered
    expect(
      screen.queryByRole("button", { name: "Spring Boot" })
    ).not.toBeInTheDocument()

    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    const [, other] = screen.getAllByRole("table")
    const otherNames = rowheaders(other)
    for (const shown of [
      "Backend",
      "Databases",
      "Mobile",
      "AI",
      "Data Science",
    ])
      expect(
        otherNames.some((n) => n.startsWith(shown)),
        shown
      ).toBe(true)
    expect(
      within(other).getByRole("button", { name: "Spring Boot" })
    ).toBeInTheDocument()
    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "false")
  })

  it("shows the Backend row in the main table once the path needs it (Java + MERN)", () => {
    render(<PathHarness roles={["java-mern-full-stack"]} />)
    const main = screen.getByRole("table")
    const names = rowheaders(main)
    expect(names.some((n) => n.startsWith("Backend"))).toBe(true)
    expect(names.some((n) => n.startsWith("Databases"))).toBe(true)
    expect(names.some((n) => n.startsWith("Mobile"))).toBe(false)
    expect(names.some((n) => n.startsWith("AI"))).toBe(false)
    expect(
      within(main).getByRole("button", { name: "Spring Boot" })
    ).toBeInTheDocument()
  })

  it("searching 'spring' while only Frontend is selected opens the optional section, and clearing closes it again", async () => {
    const user = userEvent.setup()
    render(<PathHarness roles={["frontend-developer"]} />)
    await user.type(screen.getByLabelText("Search technologies"), "spring")
    const toggle = screen.getByRole("button", { name: OPTIONAL })
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(
      await screen.findByRole("button", { name: "Spring Boot" })
    ).toBeInTheDocument()
    await user.clear(screen.getByLabelText("Search technologies"))
    expect(screen.getByRole("button", { name: OPTIONAL })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    // a search that matches nothing in the section leaves it out
    await user.type(screen.getByLabelText("Search technologies"), "redux")
    expect(
      screen.queryByRole("button", { name: OPTIONAL })
    ).not.toBeInTheDocument()
  })

  it("counts selected technologies inside the collapsed section, and says so on its header", async () => {
    const user = userEvent.setup()
    render(
      <PathHarness
        roles={["frontend-developer"]}
        initial={["spring-boot", "react"]}
      />
    )
    expect(screen.getByText("2 selected")).toBeInTheDocument()
    const toggle = screen.getByRole("button", { name: OPTIONAL })
    expect(within(toggle).getByText("1 selected")).toBeInTheDocument()
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    await user.click(toggle)
    expect(
      screen.getByRole("button", { name: "Spring Boot", pressed: true })
    ).toBeInTheDocument()
  })

  it("inside a category on the path, only path technologies are in the normal grid and the rest are labelled Optional behind Show more", async () => {
    const user = userEvent.setup()
    render(<PathHarness roles={["data-science"]} />)
    const backend = screen
      .getByRole("rowheader", { name: /^Backend/ })
      .closest("tr")!
    const pressable = () =>
      within(backend)
        .getAllByRole("button")
        .filter((b) => b.hasAttribute("aria-pressed"))
    const onPath = SKILLS.filter(
      (s) =>
        s.group === "backend" &&
        ["core", "recommended"].includes(
          defaultsForRoles(["data-science"], { includeCareer: false }).get(
            s.moduleId
          ) ?? ""
        )
    )
    expect(onPath.length).toBeGreaterThan(0)
    expect(pressable().map((b) => b.textContent)).toEqual(
      onPath.map((s) => s.title)
    )
    expect(within(backend).queryByText("Optional")).not.toBeInTheDocument()
    await user.click(
      within(backend).getByRole("button", { name: /Show \d+ more/ })
    )
    expect(pressable().length).toBe(
      SKILLS.filter((s) => s.group === "backend").length
    )
    expect(within(backend).getAllByText("Optional").length).toBe(
      SKILLS.filter((s) => s.group === "backend").length - onPath.length
    )
  })

  it("keeps every technology reachable exactly once with the optional section open and every row expanded", async () => {
    const user = userEvent.setup()
    render(<PathHarness roles={["frontend-developer"]} />)
    await user.click(screen.getByRole("button", { name: OPTIONAL }))
    for (const more of screen.queryAllByRole("button", {
      name: /Show \d+ more/,
    }))
      await user.click(more)
    const names = screen
      .getAllByRole("button")
      .filter((b) => b.hasAttribute("aria-pressed"))
      .map((b) => (b.textContent ?? "").replace(/Optional$/, ""))
    expect(names).toHaveLength(SKILLS.length)
    expect(new Set(names).size).toBe(SKILLS.length)
  })

  it.each([
    ["Frontend", ["frontend-developer"]],
    ["Java Full Stack", ["java-full-stack"]],
    ["Data Science", ["data-science"]],
  ])(
    "%s: the main table holds exactly the categories that have a core or recommended technology, the section the rest",
    async (_name, roles) => {
      const user = userEvent.setup()
      render(<PathHarness roles={roles} />)
      const rel = defaultsForRoles(roles, { includeCareer: false })
      const onPath = (g: (typeof SKILL_GROUPS)[number]) =>
        SKILLS.some(
          (s) =>
            s.group === g &&
            ["core", "recommended"].includes(rel.get(s.moduleId) ?? "")
        )
      const expectMain = SKILL_GROUPS.filter(onPath).map(label)
      const expectOther = SKILL_GROUPS.filter((g) => !onPath(g)).map(label)
      const strip = (names: string[]) =>
        names.map((n) => n.replace(/\d+ of \d+ selected$/, ""))
      const main = strip(rowheaders(screen.getByRole("table")))
      expect([...main].sort()).toEqual([...expectMain].sort())
      expect(FRONTEND.size).toBeGreaterThan(0)
      if (expectOther.length > 0) {
        await user.click(screen.getByRole("button", { name: OPTIONAL }))
        const other = strip(rowheaders(screen.getAllByRole("table")[1]))
        expect([...other].sort()).toEqual([...expectOther].sort())
      } else
        expect(
          screen.queryByRole("button", { name: OPTIONAL })
        ).not.toBeInTheDocument()
    }
  )

  it("shows every category normally when no path is given", () => {
    render(
      <SkillPicker skills={SKILLS} value={[]} onChange={() => undefined} />
    )
    expect(
      screen.queryByRole("button", { name: OPTIONAL })
    ).not.toBeInTheDocument()
    expect(rowheaders(screen.getByRole("table"))).toHaveLength(
      SKILL_GROUPS.length
    )
  })
})
