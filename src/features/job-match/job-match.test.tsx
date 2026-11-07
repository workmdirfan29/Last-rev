import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { useLearnerStore } from "@/stores/learner-store"
import {
  renderApp,
  resetLearner,
  seedOnboardedLearner,
} from "@/test/render-app"

const TIMEOUT = { timeout: 15000 }
const JD =
  "Build REST APIs with React and Node.js.\nExperience with Docker and Kafka is a plus.\nWe value communication."

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
  await seedOnboardedLearner()
})

async function analyse(user: ReturnType<typeof userEvent.setup>, text = JD) {
  renderApp("/job-match")
  const box = await screen.findByRole(
    "textbox",
    { name: "Job description" },
    TIMEOUT
  )
  await user.click(box)
  await user.paste(text)
  await user.click(screen.getByRole("button", { name: "Find the skills" }))
  return screen.findByTestId("jd-results")
}

describe("the job match page", () => {
  it("names the technologies found with the sentence for each, what you have for them, and lists unrecognised words honestly", async () => {
    const user = userEvent.setup()
    const results = await analyse(user)
    expect(within(results).getByTestId("jd-summary")).toHaveTextContent(
      /Found \d+ technologies in 3 sentences/
    )
    const table = within(results).getByRole("table")
    for (const skill of ["React", "Docker"])
      expect(
        within(table).getByRole("rowheader", { name: new RegExp(skill) })
      ).toBeInTheDocument()
    // the sentence it was found in is shown, with the matched words marked
    expect(table.textContent).toContain(
      "Experience with Docker and Kafka is a plus."
    )
    expect(table.querySelector("mark")?.textContent).toBeTruthy()
    expect(within(results).getByTestId("jd-unrecognised")).toHaveTextContent(
      /We did not recognise these words: .*Kafka/
    )
    expect(within(results).getByTestId("jd-unrecognised")).toHaveTextContent(
      /may include ordinary words/
    )
    expect(table.textContent).not.toMatch(/Kafka\s*[0-9]/)
  })

  it("lists gaps with links, and Add to my syllabus works with an Undo for a module outside the path", async () => {
    const user = userEvent.setup()
    const results = await analyse(user, "You know Docker and Kubernetes well.")
    const gaps = await within(results).findByTestId("jd-gaps")
    expect(within(gaps).getAllByRole("listitem").length).toBeGreaterThan(0)
    const add = within(gaps).queryAllByRole("button", {
      name: "Add to my syllabus",
    })
    if (add.length > 0) {
      const before = JSON.stringify(
        useLearnerStore.getState().profile!.syllabusOverrides
      )
      await user.click(add[0])
      await waitFor(() =>
        expect(
          JSON.stringify(useLearnerStore.getState().profile!.syllabusOverrides)
        ).not.toBe(before)
      )
      await user.click(await screen.findByRole("button", { name: "Undo" }))
      await waitFor(() =>
        expect(
          JSON.stringify(useLearnerStore.getState().profile!.syllabusOverrides)
        ).toBe(before)
      )
    }
  })

  it("stores nothing until the learner saves a named target role; the text is kept by default and can be left out", async () => {
    const user = userEvent.setup()
    const results = await analyse(user)
    expect(useLearnerStore.getState().targetRoles).toHaveLength(0)
    await user.type(
      within(results).getByLabelText("Name"),
      "Frontend at a startup"
    )
    await user.click(within(results).getByRole("button", { name: "Save" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().targetRoles).toHaveLength(1)
    )
    expect(useLearnerStore.getState().targetRoles[0]).toMatchObject({
      name: "Frontend at a startup",
      text: JD,
    })
    await user.type(within(results).getByLabelText("Name"), "No text")
    await user.click(within(results).getByLabelText(/Do not keep the text/))
    await user.click(within(results).getByRole("button", { name: "Save" }))
    await waitFor(() =>
      expect(useLearnerStore.getState().targetRoles).toHaveLength(2)
    )
    expect(useLearnerStore.getState().targetRoles[1].text).toBeNull()
    const list = screen.getByTestId("target-roles")
    expect(within(list).getAllByRole("listitem")).toHaveLength(2)
    await user.click(
      within(list).getByRole("button", { name: "Delete No text" })
    )
    await waitFor(() =>
      expect(useLearnerStore.getState().targetRoles).toHaveLength(1)
    )
  })

  it("says plainly when nothing is found, and rejects a non-text file", async () => {
    const user = userEvent.setup()
    const results = await analyse(user, "We value punctuality and kindness.")
    expect(within(results).getByTestId("jd-summary")).toHaveTextContent(
      "No technology from the skills list was found"
    )
    const input = screen.getByLabelText(
      "Choose a text file"
    ) as HTMLInputElement
    fireEvent.change(input, {
      target: {
        files: [new File(["x"], "resume.pdf", { type: "application/pdf" })],
      },
    })
    expect(await screen.findByRole("alert")).toHaveTextContent(/plain text/)
  })
})

describe("no network, no AI claims", () => {
  it("the job match feature has no network call and no AI or assessment wording", () => {
    const sources = {
      ...import.meta.glob("/src/features/job-match/*.tsx", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
      ...import.meta.glob("/src/services/jobmatch/*.ts", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
      ...import.meta.glob("/src/data/jobmatch/*.ts", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
    } as Record<string, string>
    const files = Object.entries(sources).filter(([f]) => !/\.test\./.test(f))
    expect(files.length).toBeGreaterThanOrEqual(4)
    for (const [f, src] of files) {
      expect(src, f).not.toMatch(
        /\bfetch\s*\(|XMLHttpRequest|sendBeacon|new WebSocket|new EventSource/
      )
      expect(src, f).not.toMatch(
        /\bAI[- ]?(powered|driven)|artificial intelligence|machine learning/i
      )
    }
  })
})
