import { SKILLS, skillResolves, type Skill } from "@/data/curriculum/skills"

export type CoverageStatus = "in-syllabus" | "covered" | "not-in-syllabus"

export interface SkillCoverage {
  skill: Skill
  /** The catalogue has a module and a topic for this skill. */
  covered: boolean
  /** The skill's module is in the learner's selected syllabus. */
  inSyllabus: boolean
  status: CoverageStatus
}

/**
 * Coverage audit: for each skill, whether the catalogue covers it and whether
 * it is in the learner's syllabus. "Covered" means covered by the catalogue but
 * the learner has not selected that module.
 */
export function skillCoverage(
  selectedModuleIds: ReadonlySet<string>,
  skills: readonly Skill[] = SKILLS
): SkillCoverage[] {
  return skills.map((skill) => {
    const covered = skillResolves(skill)
    const inSyllabus = covered && selectedModuleIds.has(skill.moduleId)
    return {
      skill,
      covered,
      inSyllabus,
      status: inSyllabus
        ? "in-syllabus"
        : covered
          ? "covered"
          : "not-in-syllabus",
    }
  })
}
