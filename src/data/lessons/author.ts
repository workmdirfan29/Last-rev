import {
  lessonIdOf,
  studyLessonSchema,
  type AuthoredStudyLesson,
  type StudyLesson,
} from "../../types/lesson"

/**
 * Authoring helper. Parses a lesson with the schema (so a malformed lesson fails loudly) and fills in the
 * stable id `lesson.<module>.<slug>`.
 *
 *   // src/data/lessons/java-core/01-first-program.ts
 *   export default defineLesson("java-core", { slug: "first-program", title: "...", topic: "Basics", ... })
 */
export function defineLesson(
  moduleId: string,
  lesson: AuthoredStudyLesson
): StudyLesson {
  const parsed = studyLessonSchema.parse(lesson)
  return { ...parsed, id: lessonIdOf(moduleId, parsed.slug), moduleId }
}
