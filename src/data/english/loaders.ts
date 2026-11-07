import { ENGLISH_MODULES, getEnglishModule } from "./modules"
import { ENGLISH_INDEX } from "./index.generated"
import type { EnglishLesson } from "../../types/english"

/**
 * Lesson files are lazily loaded chunks, like the question files. A "file" module is `<module>.ts`; a
 * "folder" module (Daily English) is `<module>/<category>.ts`. The files themselves are the source of truth;
 * `pnpm english:index` writes the lightweight index the course page and the landing card read.
 */
const files = import.meta.glob<{ default: EnglishLesson[] }>([
  "./*.ts",
  "./*/*.ts",
  // not lesson files: helpers, data, the generated index and tests stay out of the production bundle
  "!./*.test.ts",
  "!./modules.ts",
  "!./index.generated.ts",
  "!./author.ts",
  "!./kit.ts",
  "!./challenge.ts",
  "!./loaders.ts",
  "!./_*.ts",
])

const loaders = new Map<string, () => Promise<{ default: EnglishLesson[] }>>()
for (const [path, loader] of Object.entries(files)) {
  const folder = /^\.\/([a-z-]+)\/([a-z0-9-]+)\.ts$/.exec(path)
  const single = /^\.\/([a-z-]+)\.ts$/.exec(path)
  if (folder) {
    const meta = getEnglishModule(folder[1])
    if (meta?.layout === "folder")
      loaders.set(`${folder[1]}/${folder[2]}`, loader)
  } else if (single) {
    const meta = getEnglishModule(single[1])
    if (meta?.layout === "file") loaders.set(single[1], loader)
  }
}

/** Every content file that exists, as `<module>` or `<module>/<category>`. */
export const contentFileKeys = (): string[] => [...loaders.keys()].sort()

const cache = new Map<string, Promise<EnglishLesson[]>>()
export function loadLessonFile(key: string): Promise<EnglishLesson[]> {
  const loader = loaders.get(key)
  if (!loader) return Promise.resolve([])
  let p = cache.get(key)
  if (!p) {
    p = loader().then((m) => m.default)
    cache.set(key, p)
  }
  return p
}

/** All lessons of one module (every category file of a folder module). */
export async function loadModuleLessons(
  moduleId: string
): Promise<EnglishLesson[]> {
  const keys = [...loaders.keys()].filter(
    (k) => k === moduleId || k.startsWith(`${moduleId}/`)
  )
  return (await Promise.all(keys.sort().map(loadLessonFile))).flat()
}

/** One lesson by id, loading only the file that holds it (found through the index). */
export async function loadLesson(id: string): Promise<EnglishLesson | null> {
  const entry = ENGLISH_INDEX.find((l) => l.id === id)
  if (!entry) return null
  const key = entry.category
    ? `${entry.moduleId}/${entry.category}`
    : entry.moduleId
  return (await loadLessonFile(key)).find((l) => l.id === id) ?? null
}

export async function loadAllLessons(): Promise<EnglishLesson[]> {
  return (
    await Promise.all(ENGLISH_MODULES.map((m) => loadModuleLessons(m.id)))
  ).flat()
}
