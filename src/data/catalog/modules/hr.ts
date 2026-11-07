import { mod } from "./factory"

/**
 * The 20 HR interview categories. Each is a module of its own so it can be released, dropped from a syllabus
 * and tracked on its own. Interview-only (domain "career"): never part of a Study syllabus. Questions are
 * level-neutral and filed under `<module>/fresher.ts`; every category studies the same three steps.
 */
const STEPS = [
  ["Understand what is asked", 15],
  ["Draft your STAR answer", 15],
  ["Practise aloud", 15],
] as const

/** `[id, title, description]` in the order the categories are shown. */
const CATEGORIES = [
  [
    "hr-tell-me-about-yourself",
    "Tell me about yourself",
    "The opening question: a short, structured introduction that fits the role.",
  ],
  [
    "hr-why-hire-you",
    "Why should we hire you?",
    "Connect what you offer to what the role needs, without exaggerating.",
  ],
  [
    "hr-strengths-weaknesses",
    "Strengths and weaknesses",
    "Name real strengths with evidence and a weakness you are working on.",
  ],
  [
    "hr-career-goals",
    "Career goals",
    "Where you want to grow, and how this role is a step toward it.",
  ],
  [
    "hr-why-this-company",
    "Why this company?",
    "Show you researched the employer and have a genuine reason to join.",
  ],
  [
    "hr-changing-jobs",
    "Why are you changing jobs?",
    "Explain a move honestly and positively, without blaming anyone.",
  ],
  [
    "hr-salary-expectations",
    "Salary expectations",
    "Discuss pay with research, a range and confidence.",
  ],
  [
    "hr-handling-pressure",
    "Handling pressure",
    "Show how you stay organised and calm when deadlines and stakes rise.",
  ],
  [
    "hr-teamwork",
    "Teamwork",
    "Describe how you work with others and what you contribute to a team.",
  ],
  [
    "hr-conflict-resolution",
    "Conflict resolution",
    "Handle disagreements with colleagues in a calm, solution-focused way.",
  ],
  [
    "hr-failure-challenges",
    "Failure and challenges",
    "Talk about setbacks honestly: what you did and what you learned.",
  ],
  [
    "hr-leadership",
    "Leadership",
    "Show initiative, ownership and how you guide or influence others.",
  ],
  [
    "hr-communication",
    "Communication",
    "Explain how you share information clearly and listen well.",
  ],
  [
    "hr-work-ethics",
    "Work ethics",
    "Reliability, honesty, accountability and how you treat commitments.",
  ],
  [
    "hr-joining-availability",
    "Joining availability",
    "Answer notice period and start-date questions clearly and professionally.",
  ],
  [
    "hr-employment-gaps",
    "Employment gaps",
    "Explain a gap truthfully and show what you did or learned during it.",
  ],
  [
    "hr-fresher-specific",
    "Fresher-specific questions",
    "Questions asked of candidates with little or no work experience. For freshers.",
  ],
  [
    "hr-experienced-candidate",
    "Experienced-candidate questions",
    "Questions asked of candidates with work history. For experienced candidates.",
  ],
  [
    "hr-tricky-questions",
    "Tricky HR questions",
    "Unexpected or awkward questions, and how to answer them calmly and honestly.",
  ],
  [
    "hr-behavioural",
    "Behavioural interviews",
    "Answer 'tell me about a time when...' questions using the STAR method.",
  ],
] as const

export const HR_MODULES = CATEGORIES.map(([id, title, description]) =>
  mod(id, title, "hr", "career", "beginner", description, STEPS)
)

/** Category ids in display order. */
export const HR_MODULE_IDS: readonly string[] = CATEGORIES.map(([id]) => id)

/** The two categories written for one experience group; shown as a plain note on their cards and pages. */
export const HR_AUDIENCE_NOTE: Readonly<Record<string, string>> = {
  "hr-fresher-specific": "For freshers",
  "hr-experienced-candidate": "For experienced candidates",
}
