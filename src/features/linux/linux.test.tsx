import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { LINUX_COMMANDS } from "@/data/linux/commands"
import { EMPTY_FILTERS, filterCommands } from "./library"
import { useLearnerStore } from "@/stores/learner-store"
import { renderApp, resetLearner, seedStudyLearner } from "@/test/render-app"

const TIMEOUT = { timeout: 10000 }

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
})

async function openLinux(path = "/linux") {
  await seedStudyLearner()
  const utils = renderApp(path)
  await screen.findByRole(
    "heading",
    { level: 1, name: "Linux practice" },
    TIMEOUT
  )
  return utils
}

async function runInTerminal(
  user: ReturnType<typeof userEvent.setup>,
  line: string
) {
  const input = await screen.findByLabelText("Terminal input")
  await user.type(input, `${line}{Enter}`)
}

describe("linux routing and navigation", () => {
  it("appears in the Study Path navigation", async () => {
    await seedStudyLearner()
    renderApp("/study")
    const links = await screen.findAllByRole(
      "link",
      { name: "Linux practice" },
      TIMEOUT
    )
    for (const link of links) expect(link).toHaveAttribute("href", "/linux")
  })

  it("is reachable without any set-up or profile (it is its own journey as well as part of Study Path)", async () => {
    await useLearnerStore.getState().hydrate()
    const { router } = renderApp("/linux")
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "Linux practice" },
        TIMEOUT
      )
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe("/linux")
    expect(useLearnerStore.getState().profile).toBeNull()
    // reached without Study set-up it is the Linux Practice journey: eyebrow, sidebar sections, no Study navigation
    expect(screen.getAllByText("Linux Practice").length).toBeGreaterThan(0)
    expect(
      screen.queryByRole("link", { name: "Study home" })
    ).not.toBeInTheDocument()
    await waitFor(() =>
      expect(useLearnerStore.getState().preferences.lastMode).toBe("linux")
    )
  })

  it("shows a friendly state for an unknown command and an unknown page", async () => {
    await openLinux("/linux/command/nope")
    expect(await screen.findByText("Command not found")).toBeInTheDocument()
  })
})

describe("command library", () => {
  it("states the real count and the reference size", async () => {
    await openLinux()
    expect(
      screen.getByText(/107 unique commands from a 108-row reference/)
    ).toBeInTheDocument()
    expect(await screen.findByText("Showing 107 of 107")).toBeInTheDocument()
  })

  it("filters by search text and category, keeps them in the URL, and clears", async () => {
    const user = userEvent.setup()
    const { router } = await openLinux()
    await user.type(screen.getByLabelText("Search commands"), "grep")
    await screen.findByText(
      `Showing ${filterCommands(LINUX_COMMANDS, { ...EMPTY_FILTERS, query: "grep" }, () => false).length} of 107`
    )
    expect(router.state.location.search).toContain("q=grep")

    await user.clear(screen.getByLabelText("Search commands"))
    await user.click(screen.getByRole("button", { name: /^Directories/ }))
    await screen.findByText("Showing 5 of 107")
    expect(router.state.location.search).toBe("?cat=dir")

    await user.type(screen.getByLabelText("Search commands"), "zzzznope")
    expect(
      await screen.findByText("No commands match these filters")
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Clear filters" }))
    await screen.findByText("Showing 107 of 107")
    expect(router.state.location.search).toBe("")
  })

  it("saves a command through the learner store and filters to saved commands", async () => {
    const user = userEvent.setup()
    await openLinux()
    await user.click(
      screen.getByRole("button", { name: "Save: mkdir <dirname>" })
    )
    await waitFor(() =>
      expect(
        useLearnerStore.getState().progress["linux.command.001-mkdir-dirname"]
          ?.bookmarked
      ).toBe(true)
    )

    await user.click(
      screen.getByRole("button", { name: /Saved commands \(1\)/ })
    )
    await screen.findByText("Showing 1 of 107")
    expect(
      screen.getByRole("button", { name: "Saved: mkdir <dirname>" })
    ).toBeInTheDocument()
  })

  it("marks a command learned, logging Linux activity", async () => {
    const user = userEvent.setup()
    await openLinux()
    await user.click(
      screen.getByRole("button", { name: "Mark learned: mkdir <dirname>" })
    )
    await waitFor(() =>
      expect(
        useLearnerStore.getState().progress["linux.command.001-mkdir-dirname"]
          ?.completed
      ).toBe(true)
    )
    expect(
      useLearnerStore
        .getState()
        .activity.some(
          (a) =>
            a.type === "linux" && a.refId === "linux.command.001-mkdir-dirname"
        )
    ).toBe(true)
    expect(
      await screen.findByText("1 of 107 commands marked learned")
    ).toBeInTheDocument()
  })

  it("labels what the terminal can and cannot run", async () => {
    await openLinux()
    const sudoCard = (
      await screen.findByText("sudo apt-get install <pkg>")
    ).closest("article")!
    expect(within(sudoCard).getByText("Not simulated")).toBeInTheDocument()
    const mkdirCard = screen
      .getByText("mkdir <dirname>", { selector: "a" })
      .closest("article")!
    expect(
      within(mkdirCard).getByText("Runs in the practice terminal")
    ).toBeInTheDocument()
  })

  it("shows the correction and the original wording on a corrected command", async () => {
    await openLinux("/linux/command/066-nl-b-file")
    expect(
      await screen.findByText("Corrected from your reference")
    ).toBeInTheDocument()
    expect(screen.getByText(/invalid body numbering style/)).toBeInTheDocument()
    expect(screen.getByText(/nl -b <file>: Number lines/)).toBeInTheDocument()
  })

  it("keeps notes and confidence for a command", async () => {
    const user = userEvent.setup()
    await openLinux("/linux/command/001-mkdir-dirname")
    await user.click(
      within(
        await screen.findByRole("group", { name: "Your confidence" })
      ).getByRole("button", { name: "4" })
    )
    await user.type(screen.getByLabelText("Your notes"), "-p for parents")
    await user.tab()
    await waitFor(() => {
      const p =
        useLearnerStore.getState().progress["linux.command.001-mkdir-dirname"]
      expect(p).toMatchObject({ confidence: 4, note: "-p for parents" })
    })
  })
})

describe("practice terminal", () => {
  it("runs commands against the virtual filesystem", async () => {
    const user = userEvent.setup()
    await openLinux("/linux/terminal")
    await runInTerminal(user, "ls")
    expect(await screen.findByText(/fruits\.txt/)).toBeInTheDocument()
    await runInTerminal(user, "mkdir mydir")
    await runInTerminal(user, "cd mydir")
    expect(
      screen.getByLabelText("Terminal input").closest("form")
    ).toHaveTextContent("student@linuxbox:~/mydir$")
  })

  it("refuses a command it cannot simulate, honestly", async () => {
    const user = userEvent.setup()
    await openLinux("/linux/terminal")
    await runInTerminal(user, "sudo apt-get install nginx")
    expect(
      await screen.findByText(
        /sudo: not simulated here, because the sandbox never has administrator rights/
      )
    ).toBeInTheDocument()
    await runInTerminal(user, "frobnicate")
    expect(
      await screen.findByText("bash: frobnicate: command not found")
    ).toBeInTheDocument()
  })

  it("labels sample output as sample output", async () => {
    const user = userEvent.setup()
    await openLinux("/linux/terminal")
    await runInTerminal(user, "df -Th")
    expect(
      await screen.findByText(/Sample output for practice/)
    ).toBeInTheDocument()
  })

  it("receives an example from the library and keeps its state between tabs", async () => {
    const user = userEvent.setup()
    await openLinux()
    await user.click(
      screen.getByRole("button", {
        name: "Try mkdir <dirname> in the terminal",
      })
    )
    expect(await screen.findByLabelText("Terminal input")).toHaveValue(
      "mkdir mydir"
    )
    await user.keyboard("{Enter}")
    await runInTerminal(user, "ls")
    expect((await screen.findAllByText(/mydir/)).length).toBeGreaterThan(0)

    // the page's own section tabs (the sidebar lists the same pages too)
    const tabs = within(
      screen.getByRole("navigation", { name: "Linux practice sections" })
    )
    await user.click(tabs.getByRole("link", { name: "Permissions" }))
    await user.click(await tabs.findByRole("link", { name: "Terminal" }))
    expect((await screen.findAllByText(/mydir/)).length).toBeGreaterThan(0)
  })

  it("resets the sandbox", async () => {
    const user = userEvent.setup()
    await openLinux("/linux/terminal")
    await runInTerminal(user, "mkdir mydir")
    await user.click(screen.getByRole("button", { name: /Reset sandbox/ }))
    await runInTerminal(user, "cd mydir")
    expect(
      await screen.findByText("bash: cd: mydir: No such file or directory")
    ).toBeInTheDocument()
  })
})

describe("permissions calculator", () => {
  it("updates the number, the letters and the command from the checkboxes", async () => {
    const user = userEvent.setup()
    await openLinux("/linux/chmod")
    expect(await screen.findByLabelText("Octal result")).toHaveTextContent(
      "742"
    )
    expect(screen.getByLabelText("Symbolic result")).toHaveTextContent(
      "rwxr---w-"
    )

    await user.click(screen.getAllByLabelText(/^execute/i)[0]) // owner execute off: 7 -> 6
    expect(screen.getByLabelText("Octal result")).toHaveTextContent("642")
    expect(screen.getByLabelText("Symbolic result")).toHaveTextContent(
      "rw-r---w-"
    )
    expect(screen.getByLabelText("Command")).toHaveTextContent(
      "chmod 642 file.txt"
    )
  })

  it("accepts a number or letters and rejects invalid input", async () => {
    const user = userEvent.setup()
    await openLinux("/linux/chmod")
    const octal = await screen.findByLabelText("Number (octal)")
    await user.clear(octal)
    await user.type(octal, "755")
    expect(screen.getByLabelText("Symbolic result")).toHaveTextContent(
      "rwxr-xr-x"
    )
    await user.clear(octal)
    await user.type(octal, "789")
    expect(
      await screen.findByText(/three digits from 0 to 7/)
    ).toBeInTheDocument()
    const letters = screen.getByLabelText("Letters (symbolic)")
    await user.clear(letters)
    await user.type(letters, "rw-r--r--")
    expect(screen.getByLabelText("Octal result")).toHaveTextContent("644")
  })
})

describe("date explorer", () => {
  it("lists every reference specifier with a live value and answers relative dates", async () => {
    const user = userEvent.setup()
    await openLinux("/linux/dates")
    const list = (
      await screen.findByRole("heading", { name: "Format specifiers" })
    ).closest("section")!
    expect(within(list).getAllByRole("listitem")).toHaveLength(14)
    expect(
      within(list).getByText(String(new Date().getFullYear()))
    ).toBeInTheDocument()

    const format = screen.getByLabelText("Format")
    await user.clear(format)
    await user.type(format, "%Y")
    expect(screen.getByTestId("format-result")).toHaveTextContent(
      String(new Date().getFullYear())
    )
    await user.clear(screen.getByLabelText(/Relative date/))
    await user.type(screen.getByLabelText(/Relative date/), "2 year ago")
    expect(screen.getByTestId("relative-result")).toHaveTextContent(
      String(new Date().getFullYear() - 2)
    )
    await user.clear(screen.getByLabelText(/Relative date/))
    await user.type(screen.getByLabelText(/Relative date/), "gibberish")
    expect(screen.getByTestId("relative-result")).toHaveTextContent(
      "Not understood"
    )
  })
})

describe("challenges", () => {
  it("lists the challenges with progress", async () => {
    await openLinux("/linux/challenges")
    expect(
      await screen.findByText("0 of 14 challenges completed")
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole("link", { name: /Make a directory/ })
    ).not.toHaveLength(0)
  })

  it("completes a challenge when the files end up right, recording it in the store", async () => {
    const user = userEvent.setup()
    await openLinux("/linux/challenges/make-a-directory")
    expect(
      await screen.findByText("~/mydir is a directory")
    ).toBeInTheDocument()
    expect(screen.queryByText("Challenge complete.")).not.toBeInTheDocument()

    await runInTerminal(user, "mkdir mydir")
    expect(await screen.findByText("Challenge complete.")).toBeInTheDocument()
    const id = "linux.challenge.make-a-directory"
    await waitFor(() =>
      expect(useLearnerStore.getState().progress[id]?.completed).toBe(true)
    )
    expect(
      useLearnerStore
        .getState()
        .activity.some((a) => a.type === "linux" && a.refId === id)
    ).toBe(true)
  })

  it("does not pass on a wrong answer, and reveals hints and the solution on request", async () => {
    const user = userEvent.setup()
    await openLinux("/linux/challenges/make-a-directory")
    await runInTerminal(user, "mkdir otherdir")
    expect(screen.queryByText("Challenge complete.")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Show a hint" }))
    expect(
      await screen.findByText("mkdir creates directories.")
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Show solution" }))
    expect(screen.getByLabelText("Solution")).toHaveTextContent("mkdir mydir")
    expect(
      useLearnerStore.getState().progress["linux.challenge.make-a-directory"]
        ?.completed
    ).toBeFalsy()
  })

  it("accepts any command line that reaches the right state", async () => {
    const user = userEvent.setup()
    await openLinux("/linux/challenges/find-the-mangoes")
    await runInTerminal(user, "grep mango fruits.txt | tee mango.txt")
    expect(await screen.findByText("Challenge complete.")).toBeInTheDocument()
  })
})
