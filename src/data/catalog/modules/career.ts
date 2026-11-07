import { mod } from "./factory"

/** Interview-only content. Shown in Interview Prep, never in a Study syllabus. */
export const CAREER_MODULES = [
  mod(
    "project-questions",
    "Project-Based Questions",
    "hr",
    "career",
    "intermediate",
    "Explaining architecture, trade-offs, ownership and impact of your projects.",
    [
      ["Architecture", 45],
      ["Ownership", 30],
      ["Trade-offs", 40],
      ["Challenges", 30],
    ]
  ),
]
