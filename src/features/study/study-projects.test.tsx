import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useLearnerStore } from "@/stores/learner-store"
import { renderApp, resetLearner, seedStudyLearner } from "@/test/render-app"
import type { Project } from "@/types/project"

const fixture = vi.hoisted(() => {
  const mk = (
    id: string,
    kind: "mini" | "major",
    title: string,
    phase: number
  ): Project => ({
    id,
    kind,
    title,
    summary: `${title} summary.`,
    hours: kind === "mini" ? 4 : 40,
    roadmaps: [{ roadmapId: "java-full-stack-ai", phase }],
    buildsOn: ["lesson.java-core.first-program"],
    userStories: ["As a user, a.", "As a user, b.", "As a user, c."],
    requirements: ["Req one.", "Req two.", "Req three."],
    structure: ["src/Main.java"],
    steps: [
      {
        title: "Print",
        summary: "Print.",
        acceptance: ["It compiles", "It prints"],
        afterLessons: ["lesson.java-core.first-program"],
      },
      {
        title: "Read",
        summary: "Read.",
        acceptance: ["It asks", "It uses the name"],
        afterLessons: [],
      },
      {
        title: "Polish",
        summary: "Polish.",
        acceptance: ["Empty input handled", "README exists"],
        afterLessons: [],
      },
    ],
    stretch: ["Add a language"],
    resources: [
      {
        label: "Basic I/O",
        url: "https://docs.oracle.com/javase/tutorial/essential/io/index.html",
      },
    ],
  })
  const list = [
    mk("hello-cli", "mini", "Greeting tool", 1),
    mk("capstone", "major", "Capstone app", 12),
  ]
  return { list }
})
vi.mock("@/data/projects", () => ({
  PROJECTS: fixture.list,
  PROJECT_FILES: new Map(),
  getProject: (id?: string) => fixture.list.find((p) => p.id === id),
  projectsOfPhase: (r: string, n: number) =>
    fixture.list.filter((p) =>
      p.roadmaps.some((x) => x.roadmapId === r && x.phase === n)
    ),
  projectsOfRoadmap: (r: string) =>
    fixture.list.filter((p) => p.roadmaps.some((x) => x.roadmapId === r)),
}))

const TIMEOUT = { timeout: 8000 }
beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
  await seedStudyLearner()
})

describe("the projects list", () => {
  it("lists the roadmap's projects with kind, phase, hours and real progress, and filters by kind", async () => {
    const user = userEvent.setup()
    renderApp("/study/projects")
    await screen.findByRole("heading", { level: 1, name: "Projects" }, TIMEOUT)
    expect(
      screen.getByText(/2 projects are ready for your roadmap/)
    ).toBeInTheDocument()
    const list = screen.getByRole("list", { name: "Projects" })
    expect(within(list).getAllByRole("link")).toHaveLength(2)
    expect(within(list).getByText("Mini-project")).toBeInTheDocument()
    expect(within(list).getByText("Major project")).toBeInTheDocument()
    expect(
      within(list).getAllByText(/0 of 6 ticked \(0%\) · not started/)
    ).toHaveLength(2)
    await user.selectOptions(screen.getByLabelText("Show"), "major")
    expect(within(list).getAllByRole("link")).toHaveLength(1)
    expect(screen.getByRole("link", { name: /Capstone app/ })).toHaveAttribute(
      "href",
      "/study/projects/capstone"
    )
  })
})

describe("a project", () => {
  it("shows the brief, builds-on lessons with their status, steps, stretch goals and official docs", async () => {
    renderApp("/study/projects/hello-cli")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Greeting tool" },
      TIMEOUT
    )
    for (const h of [
      "User stories",
      "Requirements",
      "Suggested structure",
      "Steps",
      "Stretch goals",
      "Build on these lessons",
      "Official documentation",
    ])
      expect(screen.getByRole("heading", { name: h })).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Your first Java program" })
    ).toHaveAttribute("href", "/study/lesson/java-core/first-program")
    expect(screen.getByRole("link", { name: /Basic I\/O/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    )
    expect(
      screen.getByText(/does not run or check your code/)
    ).toBeInTheDocument()
  })

  it("ticks are progress records, the percent follows them, and Start sets a start date", async () => {
    const user = userEvent.setup()
    renderApp("/study/projects/hello-cli")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Greeting tool" },
      TIMEOUT
    )
    expect(screen.getByTestId("project-progress")).toHaveTextContent(
      "0 of 6 acceptance items ticked (0%)"
    )
    await user.click(screen.getByRole("button", { name: "Start this project" }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().projectStates[0]?.startedAt
      ).toBeTruthy()
    )
    await user.click(screen.getByRole("checkbox", { name: "It compiles" }))
    await user.click(screen.getByRole("checkbox", { name: "It prints" }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().progress["proj.hello-cli.2"]?.completed
      ).toBe(true)
    )
    expect(screen.getByTestId("project-progress")).toHaveTextContent(
      "2 of 6 acceptance items ticked (33%)"
    )
    expect(
      within(screen.getByRole("group", { name: /Step 1: Print/ })).getByText(
        "Done"
      )
    ).toBeInTheDocument()
    await user.click(screen.getByRole("checkbox", { name: "It prints" }))
    await waitFor(() =>
      expect(screen.getByTestId("project-progress")).toHaveTextContent("1 of 6")
    )
  })

  it("accepts a pasted https link as plain text, rejects anything else, and never fetches it", async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, "fetch")
    renderApp("/study/projects/hello-cli")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Greeting tool" },
      TIMEOUT
    )
    const input = screen.getByLabelText(/Link to your repository/)
    await user.type(input, "javascript:alert(1)")
    await user.click(screen.getByRole("button", { name: "Save link" }))
    expect(await screen.findByRole("alert")).toHaveTextContent(/https/)
    expect(useLearnerStore.getState().projectStates).toHaveLength(0)
    await user.clear(input)
    await user.type(input, "https://example.org/me/hello")
    await user.click(screen.getByRole("button", { name: "Save link" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().projectStates[0]?.repoUrl).toBe(
        "https://example.org/me/hello"
      )
    )
    const link = await screen.findByRole("link", {
      name: /Open your repository/,
    })
    expect(link).toHaveAttribute("href", "https://example.org/me/hello")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
    expect(
      fetchSpy.mock.calls.filter((c) => String(c[0]).includes("example.org"))
    ).toHaveLength(0)
    fetchSpy.mockRestore()
  })

  it("saves notes when the learner leaves the box", async () => {
    const user = userEvent.setup()
    renderApp("/study/projects/hello-cli")
    await screen.findByRole(
      "heading",
      { level: 1, name: "Greeting tool" },
      TIMEOUT
    )
    await user.type(screen.getByLabelText("Your notes"), "first idea")
    await user.tab()
    await waitFor(() =>
      expect(useLearnerStore.getState().projectStates[0]?.notes).toBe(
        "first idea"
      )
    )
    expect(await screen.findByText("Saved on this device.")).toBeInTheDocument()
  })

  it("an unknown project says so", async () => {
    renderApp("/study/projects/nope")
    expect(
      await screen.findByText("Project not found", undefined, TIMEOUT)
    ).toBeInTheDocument()
  })
})

describe("projects in the roadmap", () => {
  it("shows a phase's project with its ticks, and a project-led phase without one says it is in preparation", async () => {
    const user = userEvent.setup()
    renderApp("/study/roadmap")
    await screen.findByRole("heading", { level: 1, name: "Roadmap" }, TIMEOUT)
    expect(
      within(
        screen.getByRole("list", { name: "Projects in this phase" })
      ).getByRole("link", { name: /Mini-project: Greeting tool/ })
    ).toHaveAttribute("href", "/study/projects/hello-cli")
    await user.click(
      screen.getByRole("button", { name: /12\. Capstone and interview prep/ })
    )
    expect(
      await screen.findByRole("link", { name: /Major project: Capstone app/ })
    ).toBeInTheDocument()
  })
})
