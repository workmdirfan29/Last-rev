import { Badge } from "@/components/ui/badge"
import { getModule } from "@/data/catalog/modules"
import { RESUME_SKILL_GROUPS } from "@/data/curriculum/resume-skills"
import { getSkill } from "@/data/curriculum/skills"
import { skillCoverage } from "@/services/curriculum/coverage"

/**
 * Audit of the resume skill inventory: every skill is traced to a module and a
 * topic, and marked as in or out of the learner's syllabus. It runs on this
 * device; nothing is uploaded.
 */
export function SkillCoveragePanel({
  selectedModuleIds,
  knownSkillIds,
}: {
  selectedModuleIds: ReadonlySet<string>
  knownSkillIds: ReadonlySet<string>
}) {
  const skills = [
    ...new Set(RESUME_SKILL_GROUPS.flatMap((g) => g.skillIds)),
  ].flatMap((id) => {
    const s = getSkill(id)
    return s ? [s] : []
  })
  const coverage = new Map(
    skillCoverage(selectedModuleIds, skills).map((c) => [c.skill.id, c])
  )
  const covered = [...coverage.values()].filter((c) => c.covered).length
  const inSyllabus = [...coverage.values()].filter((c) => c.inSyllabus).length

  return (
    <div className="space-y-5">
      <p role="status" className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {covered} of {skills.length}
        </span>{" "}
        resume skills are covered by the catalogue, and{" "}
        <span className="font-medium text-foreground">{inSyllabus}</span> are in
        your current syllabus. This list stays on your device.
      </p>
      {RESUME_SKILL_GROUPS.map((group) => (
        <section
          key={group.label}
          aria-labelledby={`cov-${group.label}`}
          className="space-y-2"
        >
          <h3 id={`cov-${group.label}`} className="lr-eyebrow">
            {group.label}
          </h3>
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {group.skillIds.map((id) => {
              const c = coverage.get(id)
              if (!c) return null
              const module = getModule(c.skill.moduleId)
              return (
                <li
                  key={id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm"
                >
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">{c.skill.title}</span>
                    {knownSkillIds.has(id) && (
                      <span className="ms-2 text-xs text-muted-foreground">
                        you know this
                      </span>
                    )}
                    <span className="block text-xs text-muted-foreground">
                      {module?.title} · {c.skill.topic}
                    </span>
                  </span>
                  <Badge variant={c.inSyllabus ? "default" : "outline"}>
                    {c.inSyllabus ? "In your syllabus" : "Not in your syllabus"}
                  </Badge>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
