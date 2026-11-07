import { cleanup, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { ENGLISH_CHALLENGE } from "@/data/english/challenge"
import { ENGLISH_INDEX } from "@/data/english/index.generated"
import { useLearnerStore } from "@/stores/learner-store"
import { renderApp, resetLearner } from "@/test/render-app"
import { toDateKey } from "@/utils/dates"
import type { ChallengeDay } from "@/types/english"

const TIMEOUT = { timeout: 5000 }

/** 30 fixture days made from real item ids: sentences and words come from the lessons that really have them. */
function fixtureDays(): ChallengeDay[] {
  const sentenceLesson = ENGLISH_INDEX.find((l) => l.counts.sentence >= 4)!
  const vocabLesson = ENGLISH_INDEX.find((l) => l.counts.vocab >= 3)
  const sentences = sentenceLesson.itemIds.filter(
    (_, i) => sentenceLesson.itemKinds[i] === "sentence"
  )
  // when no lesson has words yet, sentences stand in for them: the page treats both the same way
  const vocab = vocabLesson
    ? vocabLesson.itemIds.filter((_, i) => vocabLesson.itemKinds[i] === "vocab")
    : sentences
  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    lesson: sentenceLesson.id,
    vocab: vocab.slice(0, 3),
    sentences: sentences.slice(0, 3),
    speaking: sentences[3],
    exercise: { lesson: sentenceLesson.id, count: 3 },
  }))
}

beforeEach(async () => {
  localStorage.clear()
  await resetLearner()
  await useLearnerStore.getState().hydrate()
  ENGLISH_CHALLENGE.splice(0, ENGLISH_CHALLENGE.length, ...fixtureDays())
})
afterEach(() => {
  cleanup()
  ENGLISH_CHALLENGE.splice(0, ENGLISH_CHALLENGE.length)
})

describe("the 30-day challenge screen", () => {
  it("shows 30 independent day cards, 'Day 1 is next', and works before any start date is chosen", async () => {
    renderApp("/english/challenge")
    expect(
      await screen.findByTestId("challenge-summary", undefined, TIMEOUT)
    ).toHaveTextContent("Day 1 is next. 0 of 30 days finished.")
    const days = within(
      screen.getByRole("navigation", { name: "The 30 days" })
    ).getAllByRole("button")
    expect(days).toHaveLength(30)
    expect(days[0]).toHaveAccessibleName("Day 1 Open")
    expect(
      await screen.findByTestId("day-detail", undefined, TIMEOUT)
    ).toBeInTheDocument()
  })

  it("a start date puts a date on each day and a day in the past that is not done is listed as missed, never reset", async () => {
    const user = userEvent.setup()
    const start = new Date()
    start.setDate(start.getDate() - 3)
    renderApp("/english/challenge")
    await screen.findByTestId("challenge-summary", undefined, TIMEOUT)
    const input = screen.getByLabelText("Day 1 is on")
    await user.clear(input)
    await user.type(input, toDateKey(start))
    await waitFor(() =>
      expect(screen.getByTestId("missed")).toHaveTextContent(
        "Day 1, Day 2, Day 3"
      )
    )
    expect(screen.getByTestId("challenge-summary")).toHaveTextContent(
      "Day 1 is next"
    )
    // a missed day can still be opened and done
    await user.click(screen.getByRole("button", { name: /^Day 2 / }))
    expect(screen.getByRole("heading", { name: /^Day 2/ })).toBeInTheDocument()
    expect(useLearnerStore.getState().english?.challenge.startDate).toBe(
      toDateKey(start)
    )
  })

  it("the check-in records a rating for the day and the page keeps every other task as it was", async () => {
    const user = userEvent.setup()
    renderApp("/english/challenge?day=5")
    await screen.findByTestId("day-detail", undefined, TIMEOUT)
    await user.click(screen.getByRole("radio", { name: /Confident$/ }))
    await waitFor(() =>
      expect(
        useLearnerStore.getState().english?.challenge.checkins["5"]?.rating
      ).toBe(4)
    )
    expect(useLearnerStore.getState().english?.challenge.exercises).toEqual({})
  })

  it("a day is done only when all six tasks are, and then reads 'Day N is complete'", async () => {
    const day = ENGLISH_CHALLENGE[0]
    for (const id of [day.lesson, ...day.vocab, ...day.sentences])
      await useLearnerStore.getState().toggleCompleted(id, 1, "english")
    await useLearnerStore.getState().updateEnglish((s) => ({
      ...s,
      speaking: [
        {
          itemId: day.speaking,
          rating: 3,
          at: new Date().toISOString(),
          day: 1,
        },
      ],
      challenge: {
        ...s.challenge,
        exercises: { "1": true },
        checkins: { "1": { rating: 4, at: new Date().toISOString() } },
      },
    }))
    renderApp("/english/challenge")
    expect(
      await screen.findByTestId("challenge-summary", undefined, TIMEOUT)
    ).toHaveTextContent("Day 2 is next. 1 of 30 days finished.")
    cleanup()
    renderApp("/english/challenge?day=1")
    expect(
      await screen.findByText("Day 1 is complete.", undefined, TIMEOUT)
    ).toBeInTheDocument()
  })

  it("the home page says which day is next once the challenge exists", async () => {
    renderApp("/english")
    expect(
      await screen.findByText("Day 1 is next.", undefined, TIMEOUT)
    ).toBeInTheDocument()
  })
})
