import { migrateKnownSkills } from "@/services/curriculum/skills-migration"
import {
  EXPORT_VERSION,
  exportBundleSchema,
  type ActivityEntry,
  type ExportBundle,
  type QuestionProgress,
} from "@/types/learner"

export type ImportResult =
  | { ok: true; bundle: ExportBundle; summary: ImportSummary }
  | { ok: false; error: string }

export interface ImportSummary {
  questions: number
  activity: number
  duplicatesMerged: number
  hasProfile: boolean
}

export function buildExportBundle(
  state: Pick<
    ExportBundle,
    "profile" | "preferences" | "questionProgress" | "activity"
  > & {
    customQuestions?: ExportBundle["customQuestions"]
    hrAnswers?: ExportBundle["hrAnswers"]
    mockSessions?: ExportBundle["mockSessions"]
    resume?: ExportBundle["resume"]
    resumeQuestions?: ExportBundle["resumeQuestions"]
    english?: ExportBundle["english"]
    quizAttempts?: ExportBundle["quizAttempts"]
    projectStates?: ExportBundle["projectStates"]
    readinessSnapshots?: ExportBundle["readinessSnapshots"]
    targetRoles?: ExportBundle["targetRoles"]
  },
  now: Date = new Date()
): ExportBundle {
  return {
    app: "lastrev",
    version: EXPORT_VERSION,
    exportedAt: now.toISOString(),
    ...state,
    customQuestions: state.customQuestions ?? [],
    hrAnswers: state.hrAnswers ?? [],
    mockSessions: state.mockSessions ?? [],
    resume: state.resume ?? null,
    resumeQuestions: state.resumeQuestions ?? [],
    english: state.english ?? null,
    quizAttempts: state.quizAttempts ?? [],
    projectStates: state.projectStates ?? [],
    readinessSnapshots: state.readinessSnapshots ?? [],
    targetRoles: state.targetRoles ?? [],
  }
}

/** Keep the most recently updated record when the same id appears twice. */
function dedupeByLatest(items: QuestionProgress[]): {
  items: QuestionProgress[]
  merged: number
} {
  const map = new Map<string, QuestionProgress>()
  for (const item of items) {
    const prev = map.get(item.questionId)
    if (!prev || item.updatedAt >= prev.updatedAt)
      map.set(item.questionId, item)
  }
  return { items: [...map.values()], merged: items.length - map.size }
}

function dedupeActivity(items: ActivityEntry[]): {
  items: ActivityEntry[]
  merged: number
} {
  const map = new Map<string, ActivityEntry>()
  for (const item of items) map.set(item.id, item)
  return { items: [...map.values()], merged: items.length - map.size }
}

/** Parse + validate untrusted JSON text from a user-selected file. */
export function parseImport(text: string): ImportResult {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return { ok: false, error: "This file is not valid JSON." }
  }

  const parsed = exportBundleSchema.safeParse(json)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    const where = first?.path.length ? ` (at ${first.path.join(".")})` : ""
    return {
      ok: false,
      error: `This does not look like a LastRev export${where}: ${first?.message ?? "invalid data"}`,
    }
  }
  if (parsed.data.version > EXPORT_VERSION) {
    return {
      ok: false,
      error: `This export was created by a newer version of LastRev (v${parsed.data.version}).`,
    }
  }

  const q = dedupeByLatest(parsed.data.questionProgress)
  const a = dedupeActivity(parsed.data.activity)
  const profile = parsed.data.profile
    ? {
        ...parsed.data.profile,
        knownSkills: migrateKnownSkills(parsed.data.profile.knownSkills),
      }
    : null
  const bundle: ExportBundle = {
    ...parsed.data,
    profile,
    questionProgress: q.items,
    activity: a.items,
  }
  return {
    ok: true,
    bundle,
    summary: {
      questions: q.items.length,
      activity: a.items.length,
      duplicatesMerged: q.merged + a.merged,
      hasProfile: parsed.data.profile !== null,
    },
  }
}
