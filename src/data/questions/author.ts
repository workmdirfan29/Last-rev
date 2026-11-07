import type { z } from "zod"
import {
  questionSchema,
  type ExperienceLevel,
  type Question,
} from "@/types/content"

/**
 * Authoring input: the full question minus the fields derived from file
 * location. `slug` becomes the last segment of the stable id
 * `<moduleId>.<level>.<slug>`. Parsing applies schema defaults and fails
 * loudly on malformed content, so bad data never reaches the UI.
 */
export type AuthoredQuestion = Omit<
  z.input<typeof questionSchema>,
  "id" | "moduleId" | "level"
> & {
  slug: string
}

export function defineQuestions(
  moduleId: string,
  level: ExperienceLevel,
  items: AuthoredQuestion[]
): Question[] {
  return items.map(({ slug, ...rest }) =>
    questionSchema.parse({
      ...rest,
      id: `${moduleId}.${level}.${slug}`,
      moduleId,
      level,
    })
  )
}
