import { MODULE_BY_ID } from "@/data/catalog/modules"
import { SKILLS, type Skill } from "@/data/curriculum/skills"
import { QUESTION_INDEX } from "@/data/questions/index.generated"
import { migrateKnownSkills } from "@/services/curriculum/skills-migration"
import type { ResumeProfile } from "@/types/learner"

const BY_ID = new Map(SKILLS.map((s) => [s.id, s]))

export interface MappedSkill {
  name: string
  skill: Skill | null
  /** Questions in the skill's module, when the module has any. */
  practise: { moduleId: string; moduleTitle: string; questions: number } | null
}

/** Match the resume's skills to catalogue technologies by title or alias (the same helper old saved skills use). */
export function mapSkills(skills: ResumeProfile["skills"]): MappedSkill[] {
  const seen = new Set<string>()
  const out: MappedSkill[] = []
  for (const s of skills) {
    const key = s.name.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    const [id] = migrateKnownSkills([s.name]).filter((v) => BY_ID.has(v))
    const skill = id ? (BY_ID.get(id) ?? null) : null
    const questions = skill
      ? QUESTION_INDEX.filter((q) => q.moduleId === skill.moduleId).length
      : 0
    out.push({
      name: s.name,
      skill,
      practise:
        skill && questions > 0
          ? {
              moduleId: skill.moduleId,
              moduleTitle:
                MODULE_BY_ID.get(skill.moduleId)?.title ?? skill.moduleId,
              questions,
            }
          : null,
    })
  }
  return out
}
