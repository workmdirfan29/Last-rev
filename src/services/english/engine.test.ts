import { describe, expect, it } from "vitest"
import example from "@/data/english/_example"
import {
  blankEnglishState,
  type ActivityEntry,
  type EnglishState,
  type QuestionProgress,
} from "@/types/learner"
import type { ChallengeDay } from "@/types/english"
import {
  confidenceSummary,
  dayStatuses,
  englishStreak,
  scheduledDate,
  summarise,
} from "./challenge"
import {
  buildSession,
  checkExercise,
  exercisesForItem,
  matchExercise,
  wordDiff,
} from "./exercises"
import { isLearned, isPractised } from "./learned"
import {
  RECOGNISE_ERROR_MESSAGE,
  browserEnv,
  capabilities,
  pickVoice,
  recognise,
  startRecording,
  wordMatch,
  type SpeechEnv,
  type VoiceLike,
} from "./speech"

const lesson = example[0]
const item = (slug: string) => lesson.items.find((i) => i.slug === slug)!

describe("exercises", () => {
  it("builds type, arrange and speak for a sentence, blank/choose only when authored, and never hands over the answer in order", () => {
    const s = item("good-morning-how-are-you")
    const kinds = exercisesForItem(s, 1).map((e) => e.kind)
    expect(kinds).toEqual(["type", "arrange", "speak"])
    const arrange = exercisesForItem(s, 1).find((e) => e.kind === "arrange")!
    if (arrange.kind === "arrange") {
      expect([...arrange.tokens].sort()).toEqual(
        s.kind === "sentence" ? s.en.split(" ").sort() : []
      )
      expect(arrange.tokens.join(" ")).not.toBe((s as { en: string }).en)
    }
    expect(
      exercisesForItem(item("morning"), 1)
        .map((e) => e.kind)
        .sort()
    ).toEqual(["choose", "type"])
    expect(exercisesForItem(item("am-is-are"), 1).map((e) => e.kind)).toEqual([
      "blank",
    ])
    expect(exercisesForItem(item("meeting-a-colleague"), 1)).toEqual([])
  })

  it("is deterministic for a seed and differs between seeds", () => {
    const a = exercisesForItem(item("good-morning-how-are-you"), 7)
    expect(exercisesForItem(item("good-morning-how-are-you"), 7)).toEqual(a)
    const tokens = (seed: number) => {
      const e = exercisesForItem(item("good-morning-how-are-you"), seed).find(
        (x) => x.kind === "arrange"
      )!
      return e.kind === "arrange" ? e.tokens.join(" ") : ""
    }
    expect(new Set([1, 2, 3, 4, 5, 6].map(tokens)).size).toBeGreaterThan(1)
  })

  it("checks typed answers exactly: case, punctuation and contractions are tolerated, a misspelling is not", () => {
    const type = exercisesForItem(item("i-am-fine-thank-you"), 1)[0]
    expect(checkExercise(type, "i am fine thank you").correct).toBe(true)
    expect(checkExercise(type, "I'm fine, thanks.").correct).toBe(true) // an accepted variant
    expect(checkExercise(type, "Im fine thank you").correct).toBe(false)
    const wrong = checkExercise(type, "I am fine")
    expect(wrong).toMatchObject({
      correct: false,
      expected: "I'm fine, thank you.",
    })
    expect(wrong.diff.map((d) => d.status)).toEqual(
      ["ok", "ok", "ok", "missing", "missing"].slice(0, wrong.diff.length)
    )
  })

  it("checks blank and choose by the answer, and arrange by the order", () => {
    const blank = exercisesForItem(item("am-is-are"), 1)[0]
    expect(checkExercise(blank, "Is").correct).toBe(true)
    expect(checkExercise(blank, "are").correct).toBe(false)
    const choose = exercisesForItem(item("morning"), 1).find(
      (e) => e.kind === "choose"
    )!
    expect(checkExercise(choose, "morning").correct).toBe(true)
    expect(checkExercise(choose, "night").correct).toBe(false)
    const arrange = exercisesForItem(item("good-morning-how-are-you"), 1).find(
      (e) => e.kind === "arrange"
    )!
    expect(
      checkExercise(arrange, "Good morning. How are you today?").correct
    ).toBe(true)
    expect(
      checkExercise(arrange, "How are you today? Good morning.").correct
    ).toBe(false)
  })

  it("shows which expected words were found in order", () => {
    const d = wordDiff("Could you help me please", "could you please help")
    expect(
      d.diff.filter((w) => w.status === "ok").length
    ).toBeGreaterThanOrEqual(3)
    expect(wordDiff("a b c", "a b c")).toEqual({
      diff: [
        { word: "a", status: "ok" },
        { word: "b", status: "ok" },
        { word: "c", status: "ok" },
      ],
      extra: [],
    })
    expect(wordDiff("a b", "a x b").extra).toEqual(["x"])
  })

  it("builds a match exercise from at least four sentence or vocabulary items, and checks pairs", () => {
    expect(matchExercise(lesson.items, 1)).toBeNull() // only 3 usable items in the example
    const many = [
      ...lesson.items,
      ...lesson.items.map((i) => ({ ...i, id: i.id + "x" })),
    ] as typeof lesson.items
    const m = matchExercise(many, 1)!
    expect(m.kind).toBe("match")
    if (m.kind === "match") {
      expect(m.pairs.length).toBeGreaterThanOrEqual(4)
      expect(
        checkExercise(
          m,
          m.pairs.map((_, i) => i)
        ).correct
      ).toBe(true)
      expect(
        checkExercise(
          m,
          m.pairs.map((_, i) => (i + 1) % m.pairs.length)
        ).correct
      ).toBe(false)
    }
  })

  it("picks a seeded session with no repeats and says how many exist when the pool is short", () => {
    const s = buildSession(example, {
      kinds: ["type", "arrange"],
      count: 50,
      seed: 3,
    })
    expect(s.exercises.length).toBe(s.available)
    expect(new Set(s.exercises.map((e) => e.id)).size).toBe(s.exercises.length)
    expect(
      buildSession(example, {
        kinds: ["type", "arrange"],
        count: 50,
        seed: 3,
      }).exercises.map((e) => e.id)
    ).toEqual(s.exercises.map((e) => e.id))
    expect(
      buildSession(example, { kinds: ["blank"], count: 2, seed: 1 }).exercises
    ).toHaveLength(1)
    expect(buildSession([], { kinds: ["type"], count: 5, seed: 1 })).toEqual({
      exercises: [],
      available: 0,
    })
  })
})

/* ------------------------------- speech fakes ------------------------------- */

const v = (
  lang: string,
  local: boolean,
  name = lang + (local ? "-l" : "-r")
): VoiceLike => ({ name, lang, localService: local })
const synthEnv = (voices: VoiceLike[]) =>
  ({
    speechSynthesis: {
      getVoices: () => voices,
      cancel: () => {},
      speak: () => {},
    } as unknown as SpeechSynthesis,
    SpeechSynthesisUtterance:
      class {} as unknown as typeof SpeechSynthesisUtterance,
    isSecureContext: true,
  }) satisfies SpeechEnv

describe("listening: voices and capabilities", () => {
  it("prefers Indian English, then British, then American, and a device voice over an online one", () => {
    expect(
      pickVoice([v("en-US", true), v("en-GB", true), v("en-IN", false)])?.voice
        .lang
    ).toBe("en-IN")
    expect(pickVoice([v("en-US", true), v("en-GB", true)])?.voice.lang).toBe(
      "en-GB"
    )
    expect(pickVoice([v("en-GB", false), v("en-US", true)])?.voice.lang).toBe(
      "en-GB"
    ) // region first, then locality
    expect(
      pickVoice([v("en-GB", false), v("en-GB", true, "local")])?.voice.name
    ).toBe("local")
    expect(pickVoice([v("hi-IN", true), v("fr-FR", true)])).toBeNull()
  })
  it("marks an online voice so the page can say the text is sent to it", () => {
    expect(pickVoice([v("en-US", false)])?.remote).toBe(true)
    expect(pickVoice([v("en-US", true)])?.remote).toBe(false)
  })
  it("offers Listen only with synthesis and an English voice (the capability matrix)", () => {
    const voices = (vs: VoiceLike[]) => vs as SpeechSynthesisVoice[]
    expect(capabilities({ isSecureContext: true }, []).listen).toBe(false) // no synth
    expect(capabilities(synthEnv([]), voices([])).listen).toBe(false) // synth, no voices
    expect(
      capabilities(synthEnv([v("hi-IN", true)]), voices([v("hi-IN", true)]))
        .listen
    ).toBe(false) // no English voice
    const online = capabilities(
      synthEnv([v("en-US", false)]),
      voices([v("en-US", false)])
    )
    expect(online.listen).toBe(true)
    expect(online.voice?.remote).toBe(true)
    expect(
      capabilities(synthEnv([v("en-GB", true)]), voices([v("en-GB", true)]))
        .voice?.remote
    ).toBe(false)
  })
  it("only offers recording in a secure context with MediaRecorder and a microphone API, and recognition only when present", () => {
    const base: SpeechEnv = {
      isSecureContext: true,
      MediaRecorder: class {} as unknown as typeof MediaRecorder,
      getUserMedia: async () => ({}) as MediaStream,
    }
    expect(capabilities(base, []).record).toBe(true)
    expect(capabilities({ ...base, isSecureContext: false }, []).record).toBe(
      false
    )
    expect(capabilities({ ...base, getUserMedia: undefined }, []).record).toBe(
      false
    )
    expect(capabilities(base, []).recognise).toBe(false)
    expect(
      capabilities({ ...base, SpeechRecognition: class {} as never }, [])
        .recognise
    ).toBe(true)
  })
  it("reads the real browser environment without throwing in a test environment", () => {
    expect(() => browserEnv()).not.toThrow()
  })
})

describe("recording", () => {
  const fakeStream = () => {
    const stopped: boolean[] = []
    return {
      stream: {
        getTracks: () => [{ stop: () => stopped.push(true) }],
      } as unknown as MediaStream,
      stopped,
    }
  }
  class FakeRecorder {
    state = "inactive"
    mimeType = "audio/webm"
    ondataavailable: ((e: { data: Blob }) => void) | null = null
    onstop: (() => void) | null = null
    start() {
      this.state = "recording"
      this.ondataavailable?.({ data: new Blob(["x"]) })
    }
    stop() {
      this.state = "inactive"
      this.onstop?.()
    }
  }
  it("asks for the microphone only when started, returns the audio in memory and releases the microphone", async () => {
    const { stream, stopped } = fakeStream()
    let asked = 0
    const env: SpeechEnv = {
      isSecureContext: true,
      MediaRecorder: FakeRecorder as never,
      getUserMedia: async () => {
        asked++
        return stream
      },
    }
    expect(asked).toBe(0)
    const rec = await startRecording(env)
    expect(asked).toBe(1)
    const blob = await rec.stop()
    expect(blob.size).toBeGreaterThan(0)
    expect(stopped).toEqual([true]) // the microphone is released
  })
  it("reports denied, unavailable and failed separately, and cancel throws everything away", async () => {
    const env = (name: string): SpeechEnv => ({
      isSecureContext: true,
      MediaRecorder: FakeRecorder as never,
      getUserMedia: async () => {
        throw Object.assign(new Error("x"), { name })
      },
    })
    await expect(startRecording(env("NotAllowedError"))).rejects.toMatchObject({
      code: "denied",
    })
    await expect(startRecording(env("NotFoundError"))).rejects.toMatchObject({
      code: "failed",
    })
    await expect(
      startRecording({ isSecureContext: false })
    ).rejects.toMatchObject({ code: "unavailable" })
    const { stream, stopped } = fakeStream()
    const rec = await startRecording({
      isSecureContext: true,
      MediaRecorder: FakeRecorder as never,
      getUserMedia: async () => stream,
    })
    rec.cancel()
    expect(stopped).toEqual([true])
  })
})

describe("speech recognition adapter", () => {
  class FakeRecognition {
    static last: FakeRecognition | null = null
    lang = ""
    interimResults = true
    maxAlternatives = 0
    continuous = true
    onresult: ((e: { results: { transcript: string }[][] }) => void) | null =
      null
    onerror: ((e: { error: string }) => void) | null = null
    onend: (() => void) | null = null
    static failStart = false
    constructor() {
      FakeRecognition.last = this
    }
    start() {
      if (FakeRecognition.failStart) throw new Error("boom")
    }
    stop() {
      this.onend?.()
    }
    abort() {}
  }
  const env: SpeechEnv = {
    isSecureContext: true,
    SpeechRecognition: FakeRecognition as never,
  }
  const collect = () => {
    const events: string[] = []
    return {
      events,
      handlers: {
        onTranscript: (t: string) => events.push("text:" + t),
        onError: (c: string) => events.push("error:" + c),
        onEnd: () => events.push("end"),
      },
    }
  }

  it("reports unsupported when the browser has no recognition, so the text alternative is shown", () => {
    const { events, handlers } = collect()
    expect(recognise({ isSecureContext: true }, handlers as never)).toBeNull()
    expect(events).toEqual(["error:unsupported"])
  })
  it("uses Indian English, no interim results, and delivers the transcript", () => {
    const { events, handlers } = collect()
    const stop = recognise(env, handlers as never)
    expect(stop).not.toBeNull()
    expect(FakeRecognition.last).toMatchObject({
      lang: "en-IN",
      interimResults: false,
      continuous: false,
    })
    FakeRecognition.last!.onresult!({
      results: [[{ transcript: "could you help me" }]],
    })
    FakeRecognition.last!.onend!()
    expect(events).toEqual(["text:could you help me", "end"])
  })
  it("maps every browser error to a plain message, and a start that throws becomes an error, not a crash", () => {
    for (const [browser, ours] of [
      ["not-allowed", "blocked"],
      ["service-not-allowed", "blocked"],
      ["no-speech", "no-speech"],
      ["network", "network"],
      ["audio-capture", "no-microphone"],
      ["something-new", "failed"],
    ] as const) {
      const { events, handlers } = collect()
      recognise(env, handlers as never)
      FakeRecognition.last!.onerror!({ error: browser })
      expect(events).toEqual([`error:${ours}`])
      expect(RECOGNISE_ERROR_MESSAGE[ours].length).toBeGreaterThan(10)
    }
    FakeRecognition.failStart = true
    const { events, handlers } = collect()
    expect(recognise(env, handlers as never)).toBeNull()
    expect(events).toEqual(["error:failed"])
    FakeRecognition.failStart = false
  })
})

describe("word match", () => {
  it("lists which target words appear in the transcript, in order, and nothing more", () => {
    const m = wordMatch(
      "Could you please help me with this?",
      "could you help me with this"
    )
    expect(m.total).toBe(7)
    expect(m.found).toBe(6)
    expect(m.words.find((w) => w.word === "please")?.found).toBe(false)
    expect(wordMatch("Hello there.", "").found).toBe(0)
    expect(wordMatch("I'm fine.", "I am fine").found).toBe(3) // contractions match both ways
    expect(wordMatch("a b c", "c b a").found).toBe(1) // order matters
  })
})

/* ------------------------------ challenge engine ----------------------------- */

const day = (n: number, over: Partial<ChallengeDay> = {}): ChallengeDay => ({
  day: n,
  lesson: `en.fundamentals.l${n}`,
  vocab: [
    `en.fundamentals.l${n}.v1`,
    `en.fundamentals.l${n}.v2`,
    `en.fundamentals.l${n}.v3`,
  ],
  sentences: [
    `en.fundamentals.l${n}.s1`,
    `en.fundamentals.l${n}.s2`,
    `en.fundamentals.l${n}.s3`,
  ],
  speaking: `en.fundamentals.l${n}.s1`,
  exercise: { lesson: `en.fundamentals.l${n}`, count: 3 },
  ...over,
})
const rec = (
  id: string,
  over: Partial<QuestionProgress> = {}
): QuestionProgress => ({
  questionId: id,
  completed: true,
  bookmarked: false,
  difficult: false,
  revision: false,
  confidence: 0,
  note: "",
  attempts: 1,
  revisionStage: 0,
  nextReviewAt: null,
  completedAt: null,
  removed: false,
  lastStudiedAt: null,
  updatedAt: "2026-11-04T00:00:00.000Z",
  ...over,
})
const state = (over: Partial<EnglishState> = {}): EnglishState => ({
  ...blankEnglishState("2026-11-04T00:00:00.000Z"),
  ...over,
})
const act = (
  date: string,
  type: ActivityEntry["type"] = "english"
): ActivityEntry => ({
  id: date + type,
  type,
  date,
  minutes: 5,
  at: date + "T10:00:00.000Z",
})

describe("learned and practised", () => {
  it("learned = marked 'I know this' or passed a text exercise twice; one pass is only practised; failing changes nothing", () => {
    const id = "en.fundamentals.l1.v1"
    expect(isLearned(id, {}, null)).toBe(false)
    expect(isLearned(id, { [id]: rec(id) }, null)).toBe(true)
    expect(isLearned(id, {}, state({ passes: { [id]: 1 } }))).toBe(false)
    expect(isPractised(id, {}, state({ passes: { [id]: 1 } }))).toBe(true)
    expect(isLearned(id, {}, state({ passes: { [id]: 2 } }))).toBe(true)
  })
})

describe("the 30-day challenge", () => {
  const days = Array.from({ length: 30 }, (_, i) => day(i + 1))
  const doneDay = (n: number) => {
    const d = days[n - 1]
    const progress: Record<string, QuestionProgress> = {
      [d.lesson]: rec(d.lesson),
    }
    for (const id of [...d.vocab, ...d.sentences]) progress[id] = rec(id)
    return {
      progress,
      speaking: {
        itemId: d.speaking,
        rating: 4,
        at: "2026-11-04T10:00:00.000Z",
        day: n,
      },
      exercise: { [String(n)]: true as const },
      checkin: {
        [String(n)]: {
          rating: 4,
          at: "2026-11-0" + (n % 9) + "T10:00:00.000Z",
        },
      },
    }
  }
  const compose = (finished: number[], start: string | null = "2026-11-01") => {
    const progress: Record<string, QuestionProgress> = {}
    const speaking: EnglishState["speaking"] = []
    const exercises: Record<string, true> = {}
    const checkins: EnglishState["challenge"]["checkins"] = {}
    for (const n of finished) {
      const d = doneDay(n)
      Object.assign(progress, d.progress)
      speaking.push(d.speaking)
      Object.assign(exercises, d.exercise)
      Object.assign(checkins, d.checkin)
    }
    return {
      progress,
      state: state({
        speaking,
        challenge: { startDate: start, exercises, checkins },
      }),
    }
  }

  it("schedules each day from the start date and needs every task for a day to be done", () => {
    expect(scheduledDate("2026-11-01", 1)).toBe("2026-11-01")
    expect(scheduledDate("2026-11-01", 30)).toBe("2026-11-30")
    const ctx = compose([1])
    const s = dayStatuses(days, ctx, "2026-11-01")
    expect(s[0]).toMatchObject({
      done: true,
      state: "done",
      date: "2026-11-01",
    })
    expect(s[1]).toMatchObject({ done: false, state: "upcoming" })
    // remove one task from day 1: it is no longer done
    const partial = {
      ...ctx,
      state: state({
        ...ctx.state,
        challenge: { ...ctx.state.challenge, checkins: {} },
      }),
    }
    const p = dayStatuses(days, partial, "2026-11-01")[0]
    expect(p.done).toBe(false)
    expect(p.tasks).toMatchObject({
      lesson: true,
      vocab: true,
      sentences: true,
      speaking: true,
      exercise: true,
      checkin: false,
    })
  })

  it("says Day N is next, lists missed days, never resets, and lets any day be done in any order", () => {
    const ctx = compose([1, 2, 5]) // days 3 and 4 skipped, today is Nov 6 (day 6)
    const statuses = dayStatuses(days, ctx, "2026-11-06")
    const sum = summarise(statuses, "2026-11-01", "2026-11-06")
    expect(sum).toMatchObject({
      started: true,
      calendarDay: 6,
      finished: 3,
      next: 3,
      complete: false,
    })
    expect(sum.missed).toEqual([3, 4])
    expect(statuses.find((s) => s.day === 6)!.state).toBe("today")
    // recovering a missed day later: day 3 done, day 4 is next
    const again = summarise(
      dayStatuses(days, compose([1, 2, 3, 5]), "2026-11-20"),
      "2026-11-01",
      "2026-11-20"
    )
    expect(again.next).toBe(4)
    expect(again.missed).toContain(4)
    expect(again.missed).not.toContain(3)
  })

  it("works before a start date is chosen, and clamps the calendar day to 1..30", () => {
    const none = summarise(
      dayStatuses(days, { progress: {}, state: null }, "2026-11-01"),
      null,
      "2026-11-01"
    )
    expect(none).toMatchObject({
      started: false,
      calendarDay: null,
      next: 1,
      finished: 0,
      missed: [],
    })
    expect(
      summarise(
        dayStatuses(days, compose([], "2026-11-01"), "2026-10-20"),
        "2026-11-01",
        "2026-10-20"
      ).calendarDay
    ).toBe(1)
    expect(
      summarise(
        dayStatuses(days, compose([], "2026-11-01"), "2027-03-01"),
        "2026-11-01",
        "2027-03-01"
      ).calendarDay
    ).toBe(30)
    expect(
      summarise(
        dayStatuses(days, compose(days.map((d) => d.day)), "2026-12-30"),
        "2026-11-01",
        "2026-12-30"
      ).complete
    ).toBe(true)
  })
})

describe("streak and confidence", () => {
  it("counts consecutive days with English activity, only English, and keeps today's streak alive until the day ends", () => {
    const a = [
      "2026-11-01",
      "2026-11-02",
      "2026-11-03",
      "2026-11-05",
      "2026-11-06",
    ].map((d) => act(d))
    expect(englishStreak(a, "2026-11-06")).toEqual({ current: 2, longest: 3 })
    expect(englishStreak(a, "2026-11-07")).toEqual({ current: 2, longest: 3 }) // yesterday counts
    expect(englishStreak(a, "2026-11-08")).toEqual({ current: 0, longest: 3 }) // a day missed
    expect(
      englishStreak([act("2026-11-06", "question")], "2026-11-06")
    ).toEqual({ current: 0, longest: 0 })
    expect(englishStreak([], "2026-11-06")).toEqual({ current: 0, longest: 0 })
  })
  it("averages check-ins and shows a trend only with at least 4 in each window", () => {
    const entries = (ratings: number[]) =>
      Object.fromEntries(
        ratings.map((rating, i) => [
          String(i + 1),
          {
            rating,
            at: `2026-11-${String(i + 1).padStart(2, "0")}T10:00:00.000Z`,
          },
        ])
      )
    const s = (ratings: number[]) =>
      confidenceSummary(
        state({
          challenge: {
            startDate: null,
            exercises: {},
            checkins: entries(ratings),
          },
        })
      )
    expect(s([])).toEqual({ count: 0, average: null, trend: null })
    expect(s([3, 4, 5]).trend).toBeNull()
    expect(s([2, 2, 2, 2, 3, 3, 3, 3]).trend).toBeNull() // 7 recent, only 1 before: not enough
    expect(s([2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3]).trend).toMatchObject({
      direction: "up",
      delta: 1,
    })
    expect(s([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]).trend).toMatchObject({
      direction: "steady",
      delta: 0,
    })
    expect(s([5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3]).trend).toMatchObject({
      direction: "down",
    })
    expect(s([1, 2, 3]).average).toBe(2)
  })
})
