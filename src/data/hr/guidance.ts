import type { HrAnswerField } from "@/types/learner"

/**
 * Guidance for the STAR answer builder. These are common rules of thumb, shown to the learner as a
 * guideline, never as a rule or a score: no statistic about what interviewers prefer is claimed.
 */
export const STAR_GUIDELINE_NOTE =
  "A common guideline, not a rule. Use it to keep your answer short enough to say out loud."

/** A comfortable speaking pace for an interview answer. A rule of thumb used only for the time hint. */
export const SPEAKING_WORDS_PER_MINUTE = 130

/** An answer of about this many seconds or less is easy for an interviewer to follow. */
export const COMFORTABLE_ANSWER_SECONDS = 120

export interface StarFieldGuide {
  field: HrAnswerField
  letter: string
  label: string
  /** What to put in this part. */
  guidance: string
  /** Suggested words, low and high. */
  words: readonly [number, number]
  placeholder: string
}

export const STAR_FIELDS: readonly StarFieldGuide[] = [
  {
    field: "situation",
    letter: "S",
    label: "Situation",
    guidance:
      "Set the scene in a sentence or two: where, when, who was involved and why it mattered.",
    words: [30, 50],
    placeholder: "In my [course, project or job], ...",
  },
  {
    field: "task",
    letter: "T",
    label: "Task",
    guidance: "Your own responsibility: what you needed to achieve or fix.",
    words: [15, 30],
    placeholder: "I was responsible for ...",
  },
  {
    field: "action",
    letter: "A",
    label: "Action",
    guidance:
      'What you did, step by step. Say "I", not "we". This is the longest and most important part.',
    words: [60, 100],
    placeholder: "First I ..., then I ...",
  },
  {
    field: "result",
    letter: "R",
    label: "Result",
    guidance:
      "What happened because of what you did, and what you learned. Give a number only if it is real and you can explain it.",
    words: [30, 50],
    placeholder: "As a result, ... I learned ...",
  },
]

export const countWords = (text: string): number =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length

/** Seconds to speak `words` words at the guideline pace, rounded up to 5. */
export const speakSeconds = (words: number): number =>
  words <= 0
    ? 0
    : Math.max(5, Math.ceil(((words / SPEAKING_WORDS_PER_MINUTE) * 60) / 5) * 5)

export function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${seconds} s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s === 0 ? `${m} min` : `${m} min ${s} s`
}

/**
 * The shared self-check list. The learner ticks what is true of THEIR answer. It is a self-assessment: it
 * is not scored, and nothing in the app judges the answer.
 */
export interface SelfCheckItem {
  id: string
  label: string
}

export const SELF_CHECK_ITEMS: readonly SelfCheckItem[] = [
  {
    id: "specific",
    label: "I described one specific situation, not a general habit.",
  },
  { id: "my-part", label: 'I said what I did myself ("I", not "we").' },
  {
    id: "result",
    label: "I gave a real result or what I learned, and I can explain it.",
  },
  {
    id: "honest",
    label:
      "Everything in it is true, and I could answer follow-up questions about it.",
  },
  { id: "length", label: "I can say it in about two minutes or less." },
  {
    id: "role",
    label: "I connected it to the role or to what the employer needs.",
  },
]

export const SELF_CHECK_NOTE =
  "This is a self-check. LastRev does not read, score or judge your answer; you decide what is true of it."

/** Shown above every sample answer. */
export const SAMPLE_LABEL =
  "Sample, written to show the structure. Replace the details with your own facts."
