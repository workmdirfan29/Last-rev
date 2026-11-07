import { defaultsForRoadmap } from "@/services/curriculum/relevance"
import {
  resolveSyllabus,
  selectedModuleIds,
} from "@/services/curriculum/syllabus"
import type { LearnerProfile } from "@/types/learner"

/** The modules in the learner's syllabus, from Interview Prep and the Study Path (either or both). */
export function learnerModuleIds(profile: LearnerProfile | null): Set<string> {
  const ids = new Set<string>()
  if (!profile) return ids
  if (profile.selectedRoles.length > 0)
    for (const id of selectedModuleIds(
      profile.selectedRoles,
      profile.syllabusOverrides,
      profile.experience
    ))
      ids.add(id)
  if (profile.studyRoadmap)
    for (const e of resolveSyllabus({
      defaults: defaultsForRoadmap(profile.studyRoadmap),
      overrides: profile.studySyllabusOverrides,
      experience: profile.experience,
      scope: "study",
    }))
      if (e.selected) ids.add(e.module.id)
  return ids
}
