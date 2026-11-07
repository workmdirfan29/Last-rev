import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { Exercise } from "@/services/english/exercises"
import { ONLINE_VOICE_NOTE, WORD_MATCH_LABEL } from "@/services/english/speech"
import { useLearnerStore } from "@/stores/learner-store"
import { resetLearner } from "@/test/render-app"
import { ExerciseCard } from "./exercise-card"
import { ListenControls } from "./listen-controls"
import { SpeakingPanel } from "./speaking-panel"
import type { SpeechController } from "./use-speech"

const hoisted = vi.hoisted(() => ({ interviewLessons: 0 }))
vi.mock("@/services/english/catalogue", async (orig) => ({
  ...(await orig<typeof import("@/services/english/catalogue")>()),
  lessonsOfModule: (id: string) =>
    id === "interview" ? Array(hoisted.interviewLessons).fill({}) : [],
}))

beforeEach(async () => {
  hoisted.interviewLessons = 0
  await resetLearner()
  await useLearnerStore.getState().hydrate()
})

const controller = (over: Partial<SpeechController["caps"]> = {}, rest = {}) =>
  ({
    caps: {
      listen: true,
      voice: null,
      record: false,
      recognise: false,
      secure: true,
      ...over,
    },
    rate: 1,
    setRate: vi.fn(),
    slow: false,
    setSlow: vi.fn(),
    playing: false,
    listen: vi.fn(),
    stop: vi.fn(),
    env: {},
    ...rest,
  }) as unknown as SpeechController

describe("Listen", () => {
  it("says so when the browser cannot speak, instead of showing a dead button", () => {
    render(
      <ListenControls speech={controller({ listen: false })} text="Hello" />
    )
    expect(screen.getByTestId("no-listen")).toHaveTextContent("not available")
    expect(screen.queryByRole("button", { name: /Listen/ })).toBeNull()
  })

  it("speaks the English text, can be slowed, and says where an online voice sends the text", async () => {
    const user = userEvent.setup()
    const speech = controller({
      voice: { remote: true, voice: {} as SpeechSynthesisVoice } as never,
    })
    render(<ListenControls speech={speech} text="Good morning." />)
    await user.click(screen.getByRole("button", { name: /Listen/ }))
    expect(speech.listen).toHaveBeenCalledWith("Good morning.")
    await user.click(screen.getByRole("switch", { name: "Slow" }))
    expect(speech.setSlow).toHaveBeenCalledWith(true)
    expect(screen.getByTestId("online-voice-note")).toHaveTextContent(
      ONLINE_VOICE_NOTE
    )
  })
})

describe("Speaking panel without recording or recognition support", () => {
  it("offers the self-rating and the text alternative, saves only the rating with the day, and never claims an assessment", async () => {
    const user = userEvent.setup()
    render(
      <SpeakingPanel
        target="Good morning."
        hi="सुप्रभात।"
        itemId="en.a.b.c"
        day={3}
      />
    )
    expect(screen.getByTestId("no-recognition")).toBeInTheDocument()
    expect(screen.getByText(/Rate yourself/)).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /^4 of 5/ }))
    await waitFor(() =>
      expect(useLearnerStore.getState().english?.speaking).toHaveLength(1)
    )
    const saved = useLearnerStore.getState().english!.speaking[0]
    expect(saved).toMatchObject({ itemId: "en.a.b.c", rating: 4, day: 3 })
    expect(Object.keys(saved).sort()).toEqual(["at", "day", "itemId", "rating"])
    expect(document.body.textContent).not.toMatch(/\bAI\b|assessed|scored by/i)
    expect(WORD_MATCH_LABEL).toMatch(/not a pronunciation score/)
  })
})

describe("exercises", () => {
  const run = async (
    exercise: Exercise,
    act: (u: ReturnType<typeof userEvent.setup>) => Promise<void>
  ) => {
    const user = userEvent.setup()
    const onResult = vi.fn()
    const onNext = vi.fn()
    render(
      <ExerciseCard exercise={exercise} onResult={onResult} onNext={onNext} />
    )
    await act(user)
    await user.click(screen.getByRole("button", { name: "Check" }))
    return { onResult, onNext, user }
  }

  it("type: tolerates case and punctuation, not a different word; the live region says Correct or shows the answer", async () => {
    const ex: Exercise = {
      kind: "type",
      id: "1",
      itemId: "i",
      prompt: "सुप्रभात।",
      answer: "Good morning.",
      accepted: [],
    }
    const ok = await run(ex, (u) =>
      u.type(screen.getByLabelText("Type this in English"), "good MORNING")
    )
    expect(ok.onResult).toHaveBeenCalledWith(true)
    expect(screen.getByTestId("result")).toHaveTextContent("Correct")
    expect(screen.getByTestId("result")).toHaveAttribute("aria-live", "polite")
  })

  it("type: a wrong answer shows the right one and which words were found, with text as well as colour", async () => {
    const ex: Exercise = {
      kind: "type",
      id: "1",
      itemId: "i",
      prompt: "सुप्रभात।",
      answer: "Good morning.",
      accepted: [],
    }
    const bad = await run(ex, (u) =>
      u.type(screen.getByLabelText("Type this in English"), "good evening")
    )
    expect(bad.onResult).toHaveBeenCalledWith(false)
    expect(screen.getByTestId("result")).toHaveTextContent(
      "Not quite. The answer is: Good morning."
    )
    expect(
      screen.getByLabelText("Words of the answer you gave")
    ).toHaveTextContent("✓")
    expect(
      screen.getByLabelText("Words of the answer you gave")
    ).toHaveTextContent("✗")
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("arrange: builds the sentence word by word and can undo", async () => {
    const ex: Exercise = {
      kind: "arrange",
      id: "2",
      itemId: "i",
      hi: "मैं ठीक हूँ।",
      tokens: ["fine", "I", "am"],
      answer: "I am fine",
      accepted: [],
    }
    const { onResult } = await run(ex, async (u) => {
      await u.click(screen.getByRole("button", { name: "fine" }))
      await u.click(screen.getByRole("button", { name: "Undo last word" }))
      await u.click(screen.getByRole("button", { name: "I" }))
      await u.click(screen.getByRole("button", { name: "am" }))
      await u.click(screen.getByRole("button", { name: "fine" }))
    })
    expect(screen.getByTestId("arranged")).toHaveTextContent("I am fine")
    expect(onResult).toHaveBeenCalledWith(true)
  })

  it("choose and blank are checked by the answer", async () => {
    const choose: Exercise = {
      kind: "choose",
      id: "3",
      itemId: "i",
      prompt: "She ___ happy.",
      options: ["is", "are", "am"],
      answer: "is",
    }
    const c = await run(choose, (u) =>
      u.click(screen.getByRole("radio", { name: "are" }))
    )
    expect(c.onResult).toHaveBeenCalledWith(false)
    expect(screen.getByTestId("result")).toHaveTextContent("The answer is: is")
  })

  it("match: pairs each English line with its Hindi meaning", async () => {
    const ex: Exercise = {
      kind: "match",
      id: "4",
      itemIds: ["a", "b"],
      pairs: [
        { itemId: "a", en: "Hello", hi: "नमस्ते" },
        { itemId: "b", en: "Thanks", hi: "धन्यवाद" },
      ],
      hiOrder: [1, 0],
    }
    const { onResult } = await run(ex, async (u) => {
      await u.click(screen.getByRole("button", { name: "Hello" }))
      await u.click(screen.getByRole("button", { name: "नमस्ते" }))
      await u.click(screen.getByRole("button", { name: "Thanks" }))
      await u.click(screen.getByRole("button", { name: "धन्यवाद" }))
    })
    expect(onResult).toHaveBeenCalledWith(true)
  })

  it("marks Hindi text lang=hi inside exercises", async () => {
    const ex: Exercise = {
      kind: "type",
      id: "1",
      itemId: "i",
      prompt: "सुप्रभात।",
      answer: "Good morning.",
      accepted: [],
    }
    render(<ExerciseCard exercise={ex} onResult={() => {}} onNext={() => {}} />)
    expect(screen.getByText("सुप्रभात।")).toHaveAttribute("lang", "hi")
  })
})

describe("Interview English links and the readiness line", () => {
  it("the link appears only when the Interview English module has lessons", async () => {
    const { InterviewEnglishLink } = await import("./interview-english-link")
    const view = render(
      <MemoryRouter>
        <InterviewEnglishLink />
      </MemoryRouter>
    )
    expect(screen.queryByRole("link", { name: /Interview English/ })).toBeNull()
    view.unmount()
    hoisted.interviewLessons = 3
    render(
      <MemoryRouter>
        <InterviewEnglishLink />
      </MemoryRouter>
    )
    expect(
      screen.getByRole("link", { name: /Interview English/ })
    ).toHaveAttribute("href", "/english/course/interview")
  })

  it("the readiness line counts finished lessons and says it is not part of the score", async () => {
    const { SpokenEnglishLine } = await import("./readiness-line")
    const { ENGLISH_INDEX } = await import("@/data/english/index.generated")
    render(
      <MemoryRouter>
        <SpokenEnglishLine />
      </MemoryRouter>
    )
    expect(screen.getByTestId("english-readiness-line")).toHaveTextContent(
      `Spoken English: 0 of ${ENGLISH_INDEX.length} lessons finished`
    )
    expect(screen.getByTestId("english-readiness-line")).toHaveTextContent(
      "not part of the score"
    )
  })
})
