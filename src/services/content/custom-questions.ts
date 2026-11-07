import type { ExperienceLevel, QuestionIndexEntry } from "@/types/content"
import type { CustomQuestion } from "@/types/learner"

/** Title shown for the learner's own questions in lists that group by topic. */
export const CUSTOM_TOPIC = "My questions"

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "")

/**
 * A new id: `<module>.<level>.my-<title-slug>-<suffix>`. The `my-` prefix keeps it from
 * ever colliding with a curated id, and the suffix keeps two questions with the same
 * title apart. It is a valid id for the question route.
 */
export function makeCustomQuestionId(
  moduleId: string,
  level: ExperienceLevel,
  title: string,
  taken: ReadonlySet<string>,
  random: () => number = Math.random
): string {
  const base = slugify(title) || "question"
  for (let attempt = 0; attempt < 20; attempt++) {
    const suffix = Math.floor(random() * 36 ** 4)
      .toString(36)
      .padStart(4, "0")
    const id = `${moduleId}.${level}.my-${base}-${suffix}`
    if (!taken.has(id)) return id
  }
  throw new Error("Could not create a unique question id")
}

/** A custom question in the shape lists, search and analytics already understand. */
export function customToIndexEntry(c: CustomQuestion): QuestionIndexEntry {
  return {
    id: c.id,
    moduleId: c.moduleId,
    level: c.level,
    topic: CUSTOM_TOPIC,
    difficulty: "medium",
    title: c.title,
    keywords: c.tags.length ? c.tags : [c.title],
    estimatedMinutes: 3,
  }
}

export type AnswerBlock =
  { kind: "paragraph"; text: string } | { kind: "list"; items: string[] }

/** Simple markdown for answers: blank-line separated paragraphs and `-` / `*` lists. Inline `code` and **bold** are left to the renderer. */
export function parseAnswer(answer: string): AnswerBlock[] {
  const blocks: AnswerBlock[] = []
  for (const chunk of answer.replace(/\r\n/g, "\n").split(/\n{2,}/)) {
    const lines = chunk.split("\n").filter((l) => l.trim() !== "")
    if (lines.length === 0) continue
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      blocks.push({
        kind: "list",
        items: lines.map((l) => l.replace(/^\s*[-*]\s+/, "")),
      })
    } else {
      blocks.push({ kind: "paragraph", text: lines.join(" ") })
    }
  }
  return blocks
}

/** Whether a question id belongs to a question the learner wrote. */
export const isCustomQuestionId = (id: string): boolean =>
  /^[^.]+\.(?:fresher|intermediate|advanced)\.my-/.test(id)
