import { ENGLISH_INDEX } from "@/data/english/index.generated"
import { DAILY_CATEGORIES, ENGLISH_MODULES } from "@/data/english/modules"
import type { EnglishLessonIndexEntry, ItemKind } from "@/types/english"

/** Everything the course page, home and progress read without loading lesson bodies. */
export const lessonsOfModule = (moduleId: string): EnglishLessonIndexEntry[] =>
  ENGLISH_INDEX.filter((l) => l.moduleId === moduleId)

export const lessonEntry = (id: string): EnglishLessonIndexEntry | undefined =>
  ENGLISH_INDEX.find((l) => l.id === id)

/** Module id and lesson slug of a lesson id `en.<module>.<lesson>`. */
export function parseLessonId(
  id: string
): { moduleId: string; slug: string } | null {
  const m = /^en\.([a-z-]+)\.([a-z0-9-]+)$/.exec(id)
  return m ? { moduleId: m[1], slug: m[2] } : null
}

/** The lesson id an item id `en.<module>.<lesson>.<slug>` belongs to. */
export const lessonOfItem = (itemId: string): string =>
  itemId.split(".").slice(0, 3).join(".")

const KIND_BY_ITEM: ReadonlyMap<string, ItemKind> = new Map(
  ENGLISH_INDEX.flatMap((l) =>
    l.itemIds.map((id, i) => [id, l.itemKinds[i]] as const)
  )
)
export const kindOfItem = (itemId: string): ItemKind | undefined =>
  KIND_BY_ITEM.get(itemId)
export const itemIdsOfKind = (kind: ItemKind): string[] =>
  ENGLISH_INDEX.flatMap((l) =>
    l.itemIds.filter((_, i) => l.itemKinds[i] === kind)
  )

export interface CourseTotals {
  lessons: number
  sentences: number
  vocab: number
  grammar: number
  dialogues: number
  answers: number
}
export function courseTotals(): CourseTotals {
  const t: CourseTotals = {
    lessons: ENGLISH_INDEX.length,
    sentences: 0,
    vocab: 0,
    grammar: 0,
    dialogues: 0,
    answers: 0,
  }
  for (const l of ENGLISH_INDEX) {
    t.sentences += l.counts.sentence
    t.vocab += l.counts.vocab
    t.grammar += l.counts.grammar
    t.dialogues += l.counts.dialogue
    t.answers += l.counts.answer
  }
  return t
}

/** Modules that have at least one lesson, in course order, with their lessons (Daily English grouped by category). */
export function courseOutline() {
  return ENGLISH_MODULES.map((m) => {
    const lessons = lessonsOfModule(m.id)
    const categories =
      m.layout === "folder"
        ? DAILY_CATEGORIES.map((c) => ({
            ...c,
            lessons: lessons.filter((l) => l.category === c.slug),
          })).filter((c) => c.lessons.length > 0)
        : []
    return { module: m, lessons, categories }
  }).filter((x) => x.lessons.length > 0)
}
