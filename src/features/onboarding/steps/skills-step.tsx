import { useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { SKILLS } from "@/data/curriculum/skills"
import { SkillPicker } from "@/features/curriculum/skill-picker"
import { defaultsForRoles } from "@/services/curriculum/relevance"
import type { OnboardingValues } from "../schema"

export function SkillsStep({
  form,
}: {
  form: UseFormReturn<OnboardingValues>
}) {
  const known = form.watch("knownSkills")
  const roles = form.watch("selectedRoles")
  // The same relevance the curriculum uses: what is core or recommended for the chosen roles leads.
  const relevance = useMemo(
    () => defaultsForRoles(roles, { includeCareer: false }),
    [roles]
  )

  return (
    <section aria-labelledby="skills-heading" className="space-y-5">
      <div className="space-y-1.5">
        <h2
          id="skills-heading"
          className="font-heading text-xl font-semibold tracking-tight sm:text-2xl"
        >
          What do you already know?{" "}
          <span className="text-sm font-normal text-muted-foreground">
            Optional
          </span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Tap the technologies you're already comfortable with. They are marked
          in your syllabus, and nothing is removed or shortened because of them.
          You can skip this. Technologies outside your chosen path are tucked
          under "Other technologies (optional)".
        </p>
      </div>
      <SkillPicker
        skills={SKILLS}
        value={known}
        relevance={relevance}
        onChange={(next) =>
          form.setValue("knownSkills", next, { shouldDirty: true })
        }
      />
    </section>
  )
}
