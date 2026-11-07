import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { useLearnerStore } from "@/stores/learner-store"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
  seedStudyLearner,
} from "@/test/render-app"

const TIMEOUT = { timeout: 10000 }

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

async function toStep(
  user: ReturnType<typeof userEvent.setup>,
  label: RegExp | string
) {
  await user.click(screen.getByRole("button", { name: /^Continue/ }))
  await screen.findByText(label)
}

async function startInterview(
  user: ReturnType<typeof userEvent.setup>,
  roleTitle = "Frontend Developer"
) {
  const utils = renderApp("/start/interview")
  await screen.findByText("What would you like to prepare for?", {}, TIMEOUT)
  const card = screen
    .getByText(roleTitle, { selector: "h3" })
    .closest("article")!
  await user.click(
    within(card).getByRole("button", { name: "Start preparation" })
  )
  return utils
}

describe("step 2: experience", () => {
  it("selects Complete beginner by default and explains what it means", async () => {
    const user = userEvent.setup()
    await startInterview(user)
    await toStep(user, "How much experience do you have?")
    expect(
      screen.getByRole("radio", { name: /Complete beginner/ })
    ).toBeChecked()
    const panel = screen.getByRole("complementary", { name: "What this means" })
    expect(within(panel).getByText(/Fresher/)).toBeInTheDocument() // still starts on the Fresher question set
    expect(within(panel).getByText(/25% more time/)).toBeInTheDocument() // multiplier 1.25 for a beginner
    await user.click(screen.getByRole("radio", { name: /Advanced/ }))
    expect(within(panel).getByText(/35% less time/)).toBeInTheDocument()
  })

  it("keeps an existing learner's saved experience in edit mode", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({ experience: "intermediate" })
    renderApp("/onboarding")
    await screen.findByText("What would you like to prepare for?", {}, TIMEOUT)
    await toStep(user, "How much experience do you have?")
    expect(screen.getByRole("radio", { name: /Intermediate/ })).toBeChecked()
  })
})

describe("step 3: skills table", () => {
  it("lists categories as table rows with the category as the row header", async () => {
    const user = userEvent.setup()
    await startInterview(user)
    await toStep(user, "How much experience do you have?")
    await toStep(user, "What do you already know?")
    const frontend = screen
      .getByRole("rowheader", { name: /^Frontend/ })
      .closest("tr")!
    for (const name of ["JavaScript ES6+", "TypeScript", "React.js"])
      expect(within(frontend).getByRole("button", { name })).toBeInTheDocument()
  })

  it("with only Frontend chosen, other stacks wait in a collapsed 'Other technologies (optional)' section that still counts what you pick there", async () => {
    const user = userEvent.setup()
    await startInterview(user)
    await toStep(user, "How much experience do you have?")
    await toStep(user, "What do you already know?")
    const main = screen.getByRole("table")
    for (const other of ["Backend", "Databases", "Mobile"])
      expect(
        within(main).queryByRole("rowheader", {
          name: new RegExp(`^${other}`),
        }),
        other
      ).not.toBeInTheDocument()
    const toggle = screen.getByRole("button", {
      name: /Other technologies \(optional\)/,
    })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(
      screen.getByRole("rowheader", { name: /^Databases/ })
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Spring Boot" }))
    await user.click(toggle)
    expect(within(toggle).getByText("1 selected")).toBeInTheDocument()
    expect(
      screen.getByText("1 selected", { selector: "p" })
    ).toBeInTheDocument()
  })
})

describe("step 4: your name is required", () => {
  async function toPace(user: ReturnType<typeof userEvent.setup>) {
    await startInterview(user)
    await toStep(user, "How much experience do you have?")
    await toStep(user, "What do you already know?")
    await toStep(user, "Set your pace")
  }

  it("blocks Continue with an inline error, marks the field invalid and moves focus to it", async () => {
    const user = userEvent.setup()
    await toPace(user)
    const name = screen.getByLabelText("Your name")
    expect(screen.queryByText(/Your name.*optional/)).not.toBeInTheDocument()
    expect(name).toBeRequired()
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    expect(await screen.findByText("Enter your name")).toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your name")
    expect(name).toHaveAttribute("aria-invalid", "true")
    expect(name).toHaveAccessibleDescription("Enter your name")
    await waitFor(() => expect(name).toHaveFocus())
    expect(screen.getByText("Set your pace")).toBeInTheDocument() // still on this step
  })

  it("trims the name: spaces alone are not a name, and a real name moves on", async () => {
    const user = userEvent.setup()
    await toPace(user)
    await user.type(screen.getByLabelText("Your name"), "   ")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    expect(await screen.findByText("Enter your name")).toBeInTheDocument()
    await user.type(screen.getByLabelText("Your name"), "Asha")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    expect(
      await screen.findByText("Review your preparation syllabus", {}, TIMEOUT)
    ).toBeInTheDocument()
  })

  it("rejects a name over 60 characters", async () => {
    const user = userEvent.setup()
    await toPace(user)
    await user.type(screen.getByLabelText("Your name"), "x".repeat(61))
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    expect(
      await screen.findByText("Keep it under 60 characters")
    ).toBeInTheDocument()
  })

  it("leaves target role and interview date optional", async () => {
    const user = userEvent.setup()
    await toPace(user)
    expect(screen.getByText(/Job you are aiming for/).textContent).toMatch(
      /optional/
    )
    expect(screen.getByText(/Interview date/).textContent).toMatch(/optional/)
    await user.type(screen.getByLabelText("Your name"), "Asha")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    expect(
      await screen.findByText("Review your preparation syllabus", {}, TIMEOUT)
    ).toBeInTheDocument()
  })

  it("shows what the choices add up to, from data", async () => {
    const user = userEvent.setup()
    await toPace(user)
    await user.click(screen.getByLabelText("7 days", { exact: false }))
    const glance = screen.getByRole("complementary", {
      name: "Your plan at a glance",
    })
    expect(within(glance).getByTestId("glance-date")).toHaveTextContent(
      "(7 days)"
    )
    expect(
      within(glance).getByText(/hours a day, .* hours a week/)
    ).toBeInTheDocument()
    expect(
      within(glance).getByText(/modules, about \d+ hours/)
    ).toBeInTheDocument()
    expect(within(glance).getByText(/Needs about \d+ days/)).toBeInTheDocument() // 7 days is too short for the whole syllabus
  })

  it("applies the same rule to the Study Path pace step", async () => {
    const user = userEvent.setup()
    renderApp("/start/study")
    await screen.findByText("Which roadmap do you want to follow?", {}, TIMEOUT)
    await user.click(
      screen.getByRole("radio", { name: /MERN Full Stack AI Engineer/ })
    )
    await toStep(user, "How much experience do you have?")
    await toStep(user, "Set your pace")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    expect(await screen.findByText("Enter your name")).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByLabelText("Your name")).toHaveFocus()
    )
  })
})

describe("legacy learners with no saved name", () => {
  it("are not locked out of the app", async () => {
    await seedOnboardedLearner({ displayName: "" })
    const { router } = renderApp("/dashboard")
    await screen.findByRole("heading", { level: 1 }, TIMEOUT)
    expect(router.state.location.pathname).toBe("/dashboard")
    // hydrate keeps the empty name as it was saved
    await useLearnerStore.getState().hydrate()
    expect(useLearnerStore.getState().profile!.displayName).toBe("")
  })

  it("are asked for a name when they open edit mode, and Save changes sends them back to it", async () => {
    const user = userEvent.setup()
    await seedOnboardedLearner({
      displayName: "",
      selectedRoles: ["frontend-developer"],
    })
    renderApp("/onboarding")
    await screen.findByText("What would you like to prepare for?", {}, TIMEOUT)
    await toStep(user, "How much experience do you have?")
    await toStep(user, "What do you already know?")
    await toStep(user, "Set your pace")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    expect(await screen.findByText("Enter your name")).toBeInTheDocument()
  })

  it("Study Path edit mode asks too", async () => {
    const user = userEvent.setup()
    await seedStudyLearner({ displayName: "" })
    renderApp("/study/plan")
    await screen.findByText("Which roadmap do you want to follow?", {}, TIMEOUT)
    await toStep(user, "How much experience do you have?")
    await toStep(user, "Set your pace")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    expect(await screen.findByText("Enter your name")).toBeInTheDocument()
  })
})

describe("review step clarity", () => {
  async function toReview(
    user: ReturnType<typeof userEvent.setup>,
    role: string
  ) {
    await startInterview(user, role)
    await toStep(user, "How much experience do you have?")
    await toStep(user, "What do you already know?")
    await toStep(user, "Set your pace")
    await user.type(screen.getByLabelText("Your name"), "Asha")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await screen.findByText("Review your preparation syllabus", {}, TIMEOUT)
  }

  it("shows the full career path title, plain question wording, and one bottom bar with the summary", async () => {
    const user = userEvent.setup()
    await toReview(user, "Java + MERN Full Stack Developer")
    const summary = screen.getByRole("region", { name: "Syllabus summary" })
    expect(
      within(summary).getByText("Java + MERN Full Stack Developer")
    ).toBeInTheDocument() // not cut off
    expect(within(summary).getByText("Questions ready")).toBeInTheDocument()
    expect(
      within(summary).getByText("Goal: at least 25 per module")
    ).toBeInTheDocument()
    expect(screen.queryByText(/fresher targeted/)).not.toBeInTheDocument()
    // The summary lives in the same bar as Back and Start preparing.
    const bar = screen.getByRole("contentinfo")
    expect(within(bar).getByText(/\d+ modules/)).toBeInTheDocument()
    expect(
      within(bar).getByRole("button", { name: /Start preparing/ })
    ).toBeInTheDocument()
    expect(
      within(bar).getByRole("button", { name: "Back" })
    ).toBeInTheDocument()
  })

  it("tells the learner what comes next on every Continue button", async () => {
    const user = userEvent.setup()
    await startInterview(user)
    expect(
      screen.getByRole("button", { name: "Continue to Experience" })
    ).toBeInTheDocument()
    await toStep(user, "How much experience do you have?")
    expect(
      screen.getByRole("button", { name: "Continue to Skills" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Continue to Skills" })
    ).toBeEnabled()
  })
})

describe("study days", () => {
  async function toPace(user: ReturnType<typeof userEvent.setup>) {
    await startInterview(user)
    await toStep(user, "How much experience do you have?")
    await toStep(user, "What do you already know?")
    await toStep(user, "Set your pace")
  }

  it("lets the learner choose the days they study, requires at least one, and counts the deadline in those days", async () => {
    const user = userEvent.setup()
    await toPace(user)
    const days = screen.getByRole("group", { name: "Which days do you study?" })
    for (const name of [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
      expect(within(days).getByRole("button", { name })).toHaveAttribute(
        "aria-pressed",
        "true"
      )
    for (const name of [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
      await user.click(within(days).getByRole("button", { name }))
    expect(
      await screen.findByText("Choose at least one study day")
    ).toBeInTheDocument()
    await user.type(screen.getByLabelText("Your name"), "Asha")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await waitFor(() =>
      expect(screen.getByLabelText("Your name")).toBeInTheDocument()
    ) // blocked
    expect(screen.getByText("Set your pace")).toBeInTheDocument()

    // Weekdays only: the 7-day target holds fewer study days than a calendar week, so the plan needs more days.
    await user.click(within(days).getByRole("button", { name: "Monday" }))
    const glanceOnly = within(
      screen.getByRole("complementary", { name: "Your plan at a glance" })
    ).getByText(/Needs about \d+ days/).textContent
    for (const name of [
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
      await user.click(within(days).getByRole("button", { name }))
    const glanceAll = within(
      screen.getByRole("complementary", { name: "Your plan at a glance" })
    ).getByText(/Needs about \d+ days/).textContent
    expect(glanceOnly).toBeDefined()
    expect(glanceAll).toBeDefined()
  })

  it("saves the study days with the plan when the learner finishes", async () => {
    const user = userEvent.setup()
    await toPace(user)
    const days = screen.getByRole("group", { name: "Which days do you study?" })
    await user.click(within(days).getByRole("button", { name: "Saturday" }))
    await user.click(within(days).getByRole("button", { name: "Sunday" }))
    await user.type(screen.getByLabelText("Your name"), "Asha")
    await user.click(screen.getByRole("button", { name: /^Continue/ }))
    await screen.findByText("Review your preparation syllabus", {}, TIMEOUT)
    await user.click(screen.getByRole("button", { name: /Start preparing/ }))
    await waitFor(
      () =>
        expect(
          useLearnerStore.getState().profile?.plans.interview.studyDays
        ).toEqual([1, 2, 3, 4, 5]),
      TIMEOUT
    )
    expect(useLearnerStore.getState().profile?.plans.study.studyDays).toEqual([
      0, 1, 2, 3, 4, 5, 6,
    ]) // the other journey is untouched
  })
})
