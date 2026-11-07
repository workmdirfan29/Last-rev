import { SKILL_BY_ID, SKILLS } from "@/data/curriculum/skills"

const norm = (s: string) => s.trim().toLowerCase()

const BY_NAME: ReadonlyMap<string, string> = new Map(
  SKILLS.flatMap((s) =>
    [s.title, ...s.aliases].map((name) => [norm(name), s.id] as const)
  )
)

/** Ids a saved display string stands for. Empty when the string is not a catalogue technology. */
function idsFor(value: string): string[] {
  if (SKILL_BY_ID.has(value)) return [value]
  const direct = BY_NAME.get(norm(value))
  if (direct) return [direct]
  // Older role skill chips such as "Django / FastAPI" or "HTML/CSS" named more than one technology.
  const parts = value.split(/\s*\/\s*/).filter(Boolean)
  if (parts.length > 1) {
    const ids = parts.map((p) => BY_NAME.get(norm(p)))
    if (ids.every((id): id is string => !!id)) return ids
  }
  return []
}

/**
 * Older profiles stored display names ("Node.js"). Map them to stable skill ids
 * by title or alias; keep anything unrecognised as written instead of dropping it.
 */
export function migrateKnownSkills(values: readonly string[]): string[] {
  const out: string[] = []
  const push = (v: string) => out.includes(v) || out.push(v)
  for (const value of values) {
    const ids = idsFor(value)
    if (ids.length) ids.forEach(push)
    else push(value)
  }
  return out
}

/** Entries that are not catalogue ids: older free text the learner can still see and remove. */
export const legacySkills = (values: readonly string[]): string[] =>
  values.filter((v) => !SKILL_BY_ID.has(v))
