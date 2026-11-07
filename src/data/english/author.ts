import {
  lessonId,
  itemId,
  lessonSchema,
  type AuthoredLesson,
  type EnglishLesson,
  type EnglishModuleId,
} from "../../types/english"

/**
 * Authoring helper. Parses lessons with the schema (so a malformed lesson fails loudly) and fills in the
 * stable ids: `en.<module>.<lesson>` and `en.<module>.<lesson>.<item slug>`.
 *
 *   export default defineLessons("daily", [{ slug: "greetings", title: ..., items: [...] }])
 */
export function defineLessons(
  moduleId: EnglishModuleId,
  lessons: AuthoredLesson[]
): EnglishLesson[] {
  return lessons.map((raw) => {
    const lesson = lessonSchema.parse(raw)
    return {
      ...lesson,
      id: lessonId(moduleId, lesson.slug),
      moduleId,
      items: lesson.items.map((it) => ({
        ...it,
        id: itemId(moduleId, lesson.slug, it.slug),
      })),
    }
  })
}
