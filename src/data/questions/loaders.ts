import type { ExperienceLevel, Question } from "@/types/content"
import { EXPERIENCE_LEVELS } from "@/types/content"

/**
 * Every `<moduleId>/<level>.ts` file becomes its own lazily-loaded chunk.
 * Adding content never requires touching a registry — drop in the file and run
 * `pnpm content:index`.
 */
const files = import.meta.glob<{ default: Question[] }>("./*/*.ts")

type Key = `${string}:${ExperienceLevel}`
const loaders = new Map<Key, () => Promise<{ default: Question[] }>>()

for (const [path, loader] of Object.entries(files)) {
  const match = /^\.\/([^/]+)\/([^/]+)\.ts$/.exec(path)
  if (!match) continue
  const [, moduleId, level] = match
  if ((EXPERIENCE_LEVELS as readonly string[]).includes(level)) {
    loaders.set(`${moduleId}:${level as ExperienceLevel}`, loader)
  }
}

const cache = new Map<Key, Promise<Question[]>>()

export function hasQuestions(
  moduleId: string,
  level: ExperienceLevel
): boolean {
  return loaders.has(`${moduleId}:${level}`)
}

export function loadQuestions(
  moduleId: string,
  level: ExperienceLevel
): Promise<Question[]> {
  const key: Key = `${moduleId}:${level}`
  const loader = loaders.get(key)
  if (!loader) return Promise.resolve([])
  let pending = cache.get(key)
  if (!pending) {
    pending = loader().then((m) => m.default)
    cache.set(key, pending)
  }
  return pending
}

export async function loadModuleQuestions(
  moduleId: string
): Promise<Question[]> {
  const parts = await Promise.all(
    EXPERIENCE_LEVELS.map((l) => loadQuestions(moduleId, l))
  )
  return parts.flat()
}
