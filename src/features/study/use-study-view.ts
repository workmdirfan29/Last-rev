import { useMemo } from "react"
import { phasesOf } from "@/data/catalog/phases"
import { getRoadmap } from "@/data/catalog/roadmaps"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import type { Plan } from "@/features/planner/use-plan"
import { nextLesson } from "@/services/study/progress"
import {
  currentPhase,
  resolvePhases,
  roadmapLessons,
} from "@/services/study/roadmap"
import { useLearnerStore } from "@/stores/learner-store"

/** The learner's roadmap as phases narrowed to their syllabus, the ready lessons in learning order, and where they are. */
export function useStudyView(plan: Plan | null) {
  const profile = useLearnerStore((s) => s.profile)
  const progress = useLearnerStore((s) => s.progress)
  return useMemo(() => {
    const roadmap = getRoadmap(profile?.studyRoadmap)
    if (!plan || !roadmap) return null
    const views = resolvePhases(phasesOf(roadmap.id), plan.entries)
    const lessons = roadmapLessons(views, LESSON_INDEX)
    return {
      roadmap,
      views,
      lessons,
      next: nextLesson(lessons, progress),
      current: currentPhase(views, LESSON_INDEX, progress),
    }
  }, [plan, profile?.studyRoadmap, progress])
}
