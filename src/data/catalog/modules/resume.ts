import {
  RESUME_SECTIONS,
  resumeModuleId,
  type ResumeSection,
} from "@/types/learner"
import { mod } from "./factory"

/** Display names of the ten resume question sections. */
export const RESUME_SECTION_LABEL: Record<ResumeSection, string> = {
  intro: "Resume introduction",
  skills: "Technical skills",
  company: "Companies",
  project: "Projects",
  responsibility: "Responsibilities",
  followup: "Technology follow-ups",
  achievement: "Achievements",
  difficult: "Difficult resume questions",
  architecture: "Project architecture",
  scenario: "Scenarios",
}

/**
 * One module per resume question section, so the questions made from the learner's resume get library lists,
 * progress and titles like any question. They are GENERATED content, not curriculum: they are interview-only,
 * have no relevance row, are never in a syllabus, a plan or a "questions ready" goal (resolveSyllabus leaves
 * them out), and are level-neutral (all filed under "fresher" for id validity).
 */
export const RESUME_MODULES = RESUME_SECTIONS.map((section) =>
  mod(
    resumeModuleId(section),
    `Resume: ${RESUME_SECTION_LABEL[section]}`,
    "hr",
    "career",
    "beginner",
    "Questions generated from your own resume with templates.",
    [["Practise", 15]]
  )
)
