import type { StudyLesson } from "../../types/lesson"
import { LESSON_INDEX } from "./index.generated"

/**
 * Lesson files are lazily loaded chunks, one per lesson (`<module>/<NN>-<slug>.ts`), like the question files.
 * The light index decides what exists; these loaders fetch a body only when it is opened.
 */
const files = import.meta.glob<{ default: StudyLesson }>("./*/*.ts")

const loaders = new Map<string, () => Promise<{ default: StudyLesson }>>()
for (const [path, loader] of Object.entries(files)) {
  const m = /^\.\/([a-z0-9-]+\/\d{2}-[a-z0-9-]+)\.ts$/.exec(path)
  if (m) loaders.set(m[1], loader)
}

/** Every lesson file that exists, as `<module>/<NN>-<slug>`. */
export const lessonFileKeys = (): string[] => [...loaders.keys()].sort()

const cache = new Map<string, Promise<StudyLesson>>()
function loadFile(key: string): Promise<StudyLesson> | null {
  const loader = loaders.get(key)
  if (!loader) return null
  let p = cache.get(key)
  if (!p) {
    p = loader().then((m) => m.default)
    cache.set(key, p)
  }
  return p
}

/** One lesson by id, loading only its file (found through the index). */
export async function loadStudyLesson(id: string): Promise<StudyLesson | null> {
  const entry = LESSON_INDEX.find((l) => l.id === id)
  return entry ? ((await loadFile(entry.file)) ?? null) : null
}

/** All lessons of one module, in lesson order. */
export async function loadModuleStudyLessons(
  moduleId: string
): Promise<StudyLesson[]> {
  const entries = LESSON_INDEX.filter((l) => l.moduleId === moduleId).sort(
    (a, b) => a.order - b.order
  )
  const loaded = await Promise.all(entries.map((e) => loadFile(e.file)))
  return loaded.filter((l): l is StudyLesson => l !== null)
}

export async function loadAllStudyLessons(): Promise<StudyLesson[]> {
  return (
    await Promise.all([...loaders.keys()].sort().map((k) => loadFile(k)))
  ).filter((l): l is StudyLesson => l !== null)
}
