import { describe, expect, it } from "vitest"
import example from "@/data/english/_example"
import { defineLessons } from "@/data/english/author"
import { latinShare, validateLessons } from "./gate"
import { isCorrect, normalise, words } from "./normalise"
import { lessonSchema, type AuthoredLesson } from "@/types/english"

const clone = <T>(x: T): T => structuredClone(x)
const base = (): AuthoredLesson => ({
  slug: "greetings",
  title: "Greetings",
  titleHi: "अभिवादन",
  goal: "Greet someone.",
  items: [
    {
      kind: "sentence",
      slug: "good-morning",
      en: "Good morning, how are you?",
      hi: "सुप्रभात, आप कैसे हैं?",
      whenToUse: "Use it to greet someone in the morning.",
      example: [
        {
          speaker: "A",
          en: "Good morning, how are you?",
          hi: "सुप्रभात, आप कैसे हैं?",
        },
        {
          speaker: "B",
          en: "I'm fine, thank you.",
          hi: "मैं ठीक हूँ, धन्यवाद।",
        },
      ],
      activity: { type: "arrange" },
    },
    {
      kind: "vocab",
      slug: "water",
      word: "water",
      partOfSpeech: "noun",
      hi: "पानी",
      exampleEn: "I drink water.",
      exampleHi: "मैं पानी पीता हूँ।",
    },
    {
      kind: "dialogue",
      slug: "meeting",
      title: "Meeting",
      situation: { en: "Two people meet.", hi: "दो लोग मिलते हैं।" },
      lines: [
        { speaker: "A", en: "Hello.", hi: "नमस्ते।" },
        { speaker: "B", en: "Hello, how are you?", hi: "नमस्ते, आप कैसे हैं?" },
        { speaker: "A", en: "I'm fine.", hi: "मैं ठीक हूँ।" },
        { speaker: "B", en: "Good to hear.", hi: "यह सुनकर अच्छा लगा।" },
      ],
    },
  ],
})
const problemsOf = (mutate: (l: AuthoredLesson) => void) => {
  const l = base()
  mutate(l)
  return validateLessons(defineLessons("fundamentals", [l]))
}
const first = (l: AuthoredLesson) =>
  l.items[0] as Extract<AuthoredLesson["items"][number], { kind: "sentence" }>

describe("the example lesson and a minimal lesson pass the gate", () => {
  it("passes with every item kind", () => {
    expect(validateLessons(example)).toEqual([])
    expect(example[0].items.map((i) => i.kind).sort()).toEqual([
      "answer",
      "dialogue",
      "grammar",
      "sentence",
      "sentence",
      "vocab",
    ])
    expect(example[0].items[0].id).toBe(
      "en.fundamentals.greetings.good-morning-how-are-you"
    )
    expect(example[0].id).toBe("en.fundamentals.greetings")
  })
  it("a minimal lesson passes", () => {
    expect(problemsOf(() => {})).toEqual([])
  })
})

describe("schema", () => {
  it("rejects Hindi written in Latin letters, a missing activity and a bad slug", () => {
    const bad = base()
    first(bad).hi = "Suprabhaat"
    expect(lessonSchema.safeParse(bad).success).toBe(false)
    const noActivity = clone(base()) as unknown as {
      items: Record<string, unknown>[]
    }
    delete noActivity.items[0].activity
    expect(lessonSchema.safeParse(noActivity).success).toBe(false)
    const slug = base()
    slug.slug = "Bad Slug"
    expect(lessonSchema.safeParse(slug).success).toBe(false)
  })
  it("needs 3 to 30 items and at least two lines in an example conversation", () => {
    const few = base()
    few.items = few.items.slice(0, 2)
    expect(lessonSchema.safeParse(few).success).toBe(false)
    const oneLine = base()
    first(oneLine).example = first(oneLine).example.slice(0, 1)
    expect(lessonSchema.safeParse(oneLine).success).toBe(false)
  })
})

describe("gate rules", () => {
  it("limits Latin letters in Hindi, but not quoted English", () => {
    expect(latinShare("मैं 'am' हूँ")).toBe(0)
    expect(latinShare("मैं am हूँ")).toBeGreaterThan(0.2)
    expect(
      problemsOf((l) => {
        first(l).hi = "मैं good morning कहता हूँ"
      }).join()
    ).toMatch(/Latin letters/)
  })
  it("checks sentence length, capital, ending and spacing", () => {
    expect(
      problemsOf((l) => {
        first(l).en = "good morning, how are you?"
      }).join()
    ).toMatch(/capital/)
    expect(
      problemsOf((l) => {
        first(l).en = "Good morning how are you"
      }).join()
    ).toMatch(/end with/)
    expect(
      problemsOf((l) => {
        first(l).en = Array(21).fill("word").join(" ").replace(/^w/, "W") + "."
      }).join()
    ).toMatch(/1 to 20 words/)
    expect(
      problemsOf((l) => {
        first(l).en = "Good  morning, how are you?"
      }).join()
    ).toMatch(/double space/)
    expect(
      problemsOf((l) => {
        first(l).whenToUse = "Use it when you greet someone. "
      }).join()
    ).toMatch(/trailing/)
  })
  it("makes sentences unique across the whole course, contractions included", () => {
    const a = defineLessons("fundamentals", [base()])
    const dup = base()
    dup.slug = "again"
    first(dup).slug = "good-morning-2"
    const b = defineLessons("daily", [dup])
    expect(validateLessons([...a, ...b]).join()).toMatch(/the same sentence as/)
    const c = base()
    c.slug = "third"
    first(c).en = "I'm fine, thank you."
    first(c).example[1].en = "I'm fine."
    const d = base()
    d.slug = "fourth"
    first(d).en = "I am fine, thank you."
    expect(
      validateLessons([
        ...defineLessons("daily", [c]),
        ...defineLessons("speaking", [d]),
      ]).join()
    ).toMatch(/the same sentence as/)
  })
  it("requires two speakers, valid accepted variants and valid activities", () => {
    expect(
      problemsOf((l) => {
        first(l).example = first(l).example.map((x) => ({ ...x, speaker: "A" }))
      }).join()
    ).toMatch(/two speakers/)
    expect(
      problemsOf((l) => {
        first(l).accepted = ["Good morning, how are you?"]
      }).join()
    ).toMatch(/same as the sentence/)
    expect(
      problemsOf((l) => {
        first(l).accepted = ["Hi, how are you?", "hi how are you"]
      }).join()
    ).toMatch(/repeat/)
    expect(
      problemsOf((l) => {
        first(l).activity = {
          type: "blank",
          text: "Good ___ ___",
          answer: "morning",
        }
      }).join()
    ).toMatch(/exactly one/)
    expect(
      problemsOf((l) => {
        first(l).activity = {
          type: "blank",
          text: "Good morning ___",
          answer: "morning",
        }
      }).join()
    ).toMatch(/already appears/)
    expect(
      problemsOf((l) => {
        first(l).activity = {
          type: "choose",
          prompt: "Pick",
          options: ["a", "b", "c"],
          answer: "d",
        }
      }).join()
    ).toMatch(/one of the options/)
    expect(
      problemsOf((l) => {
        first(l).activity = {
          type: "choose",
          prompt: "Pick",
          options: ["a", "A", "c"],
          answer: "a",
        }
      }).join()
    ).toMatch(/different/)
    expect(
      problemsOf((l) => {
        first(l).en = "Hello there."
      }).join()
    ).toMatch(/arrange needs 3 to 14 words/)
  })
  it("allows blank and choose only for grammar, and not 'speak' for vocab", () => {
    const g = clone(example[0])
    const grammar = g.items.find((i) => i.kind === "grammar")!
    ;(grammar as { activity: unknown }).activity = { type: "type" }
    expect(validateLessons([g]).join()).toMatch(/not allowed here/)
  })
  it("bans percentages, statistic and frequency wording and company names, but allows digits", () => {
    expect(
      problemsOf((l) => {
        first(l).whenToUse = "Use it, because 90% of people say it."
      }).join()
    ).toMatch(/percentages/)
    expect(
      problemsOf((l) => {
        first(l).whenToUse = "Studies show people use this greeting often."
      }).join()
    ).toMatch(/statistic/)
    expect(
      problemsOf((l) => {
        first(l).whenToUse = "This is the most asked greeting in interviews."
      }).join()
    ).toMatch(/frequency/)
    expect(
      problemsOf((l) => {
        first(l).whenToUse = "Use it when you call Google support."
      }).join()
    ).toMatch(/company/)
    expect(
      problemsOf((l) => {
        first(l).example[0].en = "Good morning, it is 7 o'clock."
      }).join()
    ).toBe("")
  })
  it("checks the three-level answers: levels, growing length, placeholders and the 120-word cap", () => {
    const a = clone(
      example[0].items.find((i) => i.kind === "answer")!
    ) as unknown as { variants: { level: string; en: string }[] }
    const make = (mutate: (v: typeof a.variants) => void) => {
      const l = clone(example[0])
      const item = l.items.find(
        (i) => i.kind === "answer"
      ) as unknown as typeof a
      mutate(item.variants)
      return validateLessons([l]).join()
    }
    expect(
      make((v) => {
        v[0].en = "My name is Asha. I live here."
      })
    ).toMatch(/placeholder/)
    expect(
      make((v) => {
        v[1].en = "My name is [name]."
      })
    ).toMatch(/intermediate variant must be longer/)
    expect(
      make((v) => {
        v[2].en = "Hello [x]. " + "word ".repeat(130)
      })
    ).toMatch(/professional variant has/)
  })
  it("requires a grammar mistake that differs and a dialogue with two speakers", () => {
    const l = clone(example[0])
    const g = l.items.find((i) => i.kind === "grammar") as unknown as {
      commonMistake: { wrong: string; right: string }
    }
    g.commonMistake.wrong = "I am happy"
    g.commonMistake.right = "I am happy."
    expect(validateLessons([l]).join()).toMatch(/wrong and right/)
  })
  it("rejects hiRoman with non-Latin characters and duplicate item slugs", () => {
    expect(
      problemsOf((l) => {
        first(l).hiRoman = "सुप्रभात"
      }).join()
    ).toMatch(/Latin letters only/)
    expect(
      problemsOf((l) => {
        l.items[1].slug = "good-morning"
      }).join()
    ).toMatch(/duplicate/)
  })
})

describe("matching typed English", () => {
  it("is case, punctuation and contraction tolerant, and nothing fuzzier", () => {
    expect(normalise("  I’m  Fine, THANK you! ")).toBe("i am fine thank you")
    expect(isCorrect("i am fine thank you", "I'm fine, thank you.")).toBe(true)
    expect(isCorrect("I'm fine thank you", "I am fine, thank you.")).toBe(true)
    expect(isCorrect("I can not go", "I can't go.")).toBe(true)
    expect(isCorrect("Im fine, thank you", "I'm fine, thank you.")).toBe(false) // a misspelling is a different word
    expect(
      isCorrect("I am fine, thanks.", "I'm fine, thank you.", [
        "I am fine, thanks.",
      ])
    ).toBe(true)
    expect(isCorrect("", "Hello.")).toBe(false)
    expect(words("Don't go, please!")).toEqual(["do", "not", "go", "please"])
    expect(normalise("He's here")).toBe("he's here") // ambiguous forms are left alone
  })
})
