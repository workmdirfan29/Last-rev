import { describe, expect, it } from "vitest"
import { HR_DENIED_NAMES } from "@/data/questions/hr-denylist"
import { questionSchema, type Question } from "@/types/content"
import {
  findDeniedName,
  findStatisticClaim,
  findUnbracketedMetric,
} from "./quality"
import { validateHrQuestion } from "./hr-rules"

const good = (over: Record<string, unknown> = {}): Question =>
  questionSchema.parse({
    id: "hr-teamwork.fresher.a-time-you-helped",
    moduleId: "hr-teamwork",
    topic: "Understand what is asked",
    level: "fresher",
    difficulty: "easy",
    title: "Tell me about a time you helped a teammate.",
    keywords: ["teamwork"],
    interviewerIntent: "HR wants to see how you work with others.",
    shortAnswer:
      "In my [project or course], a teammate was stuck on [task]. I offered to pair for an hour, we found the cause together, and the team finished on time. I learned that asking early saves everyone time, and I now check in on teammates during busy weeks.",
    detailedAnswer: [
      "The answer names a [situation], your own action and a result.",
    ],
    realWorldExample:
      "A study group where you explained a topic to a classmate.",
    commonMistakes: ["Saying 'we' for everything."],
    followUps: [{ question: "What would you do differently?" }],
    keyPoints: ["Be specific"],
    answerTips: ["Speak for about two minutes."],
    weakAnswer: "I am a good team player and always help everyone.",
    weakAnswerWhy: ["It is general and gives no example."],
    recruiterExpects: ["A real example", "Your own contribution"],
    answerFramework: ["When [situation], I [your action], so [your result]."],
    starPrompts: {
      situation: "Where and when?",
      task: "What was needed?",
      action: "What did you do?",
      result: "What changed?",
    },
    ...over,
  })

describe("validateHrQuestion", () => {
  it("accepts a complete question with placeholders", () => {
    expect(validateHrQuestion(good())).toEqual([])
  })

  it("requires every HR field", () => {
    const base = good()
    const { weakAnswer: _a, ...noWeak } = base
    void _a
    expect(validateHrQuestion(noWeak as Question)).toContain(
      "missing weakAnswer"
    )
    for (const field of [
      "weakAnswerWhy",
      "recruiterExpects",
      "answerFramework",
      "starPrompts",
    ] as const) {
      const q = { ...base } as Record<string, unknown>
      delete q[field]
      expect(validateHrQuestion(q as unknown as Question), field).toContain(
        `missing ${field}`
      )
    }
    expect(validateHrQuestion(good({ answerTips: [] }))).toContain(
      "missing answerTips"
    )
  })

  it("needs bracketed placeholders in the framework", () => {
    expect(
      validateHrQuestion(
        good({ answerFramework: ["Describe what you did."] })
      ).join()
    ).toMatch(/placeholders/)
  })

  it("rejects an invented metric in a sample answer unless it is a [placeholder]", () => {
    const bad = good({
      shortAnswer:
        "I led a project in my final year and we increased the accuracy by 40% after I rewrote the pipeline, which impressed my guide and the whole department a lot.",
    })
    expect(validateHrQuestion(bad).join()).toMatch(/metric/)
    const ok = good({
      shortAnswer:
        "I led a project in my final year and we increased the accuracy by [X]% after I rewrote the pipeline, which impressed my guide and the whole department a lot.",
    })
    expect(validateHrQuestion(ok)).toEqual([])
  })

  it("rejects statistics, frequency claims and company names", () => {
    expect(
      validateHrQuestion(
        good({
          answerTips: ["Studies show that 80% of recruiters read this first."],
        })
      ).join()
    ).toMatch(/statistic/)
    expect(
      validateHrQuestion(
        good({ keyPoints: ["The most asked HR question."] })
      ).join()
    ).toMatch(/frequency/)
    expect(
      validateHrQuestion(
        good({ realWorldExample: "At Google I once led a team." })
      ).join()
    ).toMatch(/company/)
  })

  it("files HR questions at the fresher level", () => {
    const q = good({
      id: "hr-teamwork.advanced.a-time-you-helped",
      level: "advanced",
    })
    expect(validateHrQuestion(q).join()).toMatch(/fresher/)
  })
})

describe("the HR claim detectors", () => {
  it("find statistics wording but not ordinary advice", () => {
    for (const t of [
      "Studies show interviewers decide in 90 seconds.",
      "Research suggests that confident candidates win.",
      "80% of recruiters check this.",
      "Most recruiters dislike long answers.",
      "9 out of 10 hiring managers agree.",
    ])
      expect(findStatisticClaim(t), t).not.toBeNull()
    for (const t of [
      "Recruiters often listen for a specific example.",
      "Keep your answer to about two minutes.",
      "Interviewers may ask a follow-up.",
    ])
      expect(findStatisticClaim(t), t).toBeNull()
  })

  it("flag metrics stated as fact, ignore placeholders and plain numbers", () => {
    for (const t of [
      "Sales went up and we increased sales by 40 per cent.",
      "I improved response time to 200 ms",
      "It saved $5,000 a month.",
      "I led 12 engineers.",
      "Revenue grew 25%.",
      "We served 5000 users.",
    ])
      expect(findUnbracketedMetric(t), t).not.toBeNull()
    for (const t of [
      "Revenue grew [your percentage]%.",
      "I led [number of people] people.",
      "Speak for 2 minutes in 4 short steps.",
      "In the first 30 seconds, say who you are.",
    ])
      expect(findUnbracketedMetric(t), t).toBeNull()
  })

  it("find denied names as whole words only", () => {
    expect(findDeniedName("I applied to Amazon.", HR_DENIED_NAMES)).toBe(
      "Amazon"
    )
    expect(
      findDeniedName("A metadata plan, amazonian, Googles", HR_DENIED_NAMES)
    ).toBeNull()
    expect(
      findDeniedName("my goal is to ask about meta skills", HR_DENIED_NAMES)
    ).toBeNull()
  })
})
