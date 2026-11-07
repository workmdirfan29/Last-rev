import type { CatalogModule } from "@/data/catalog/module-types"
import { LESSON_DENIED_NAMES } from "@/data/lessons/denylist"
import {
  findDeniedName,
  findFrequencyClaim,
  findStatisticClaim,
  isAllowedSource,
} from "@/services/content/quality"
import { MINUTES_TOLERANCE, RELEASE_MIN_LESSONS } from "@/config/study"
import type { CheckItem, StudyLesson } from "@/types/lesson"

/**
 * The lesson content gate: every rule a machine can check. It cannot tell whether an explanation is right,
 * only that a lesson is complete, well formed, practicable, sourced from official documentation and free of
 * invented claims. Run over the real lessons by `data/lessons/content-gate.test.ts`.
 */
export type Problem = string

export type GateModule = Pick<CatalogModule, "id" | "topicList">
export interface GateContext {
  modules: ReadonlyMap<string, GateModule>
  /** Every lesson id in the pool (for prerequisite checks). */
  lessonIds: ReadonlySet<string>
}

const normalise = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ")

/* ----------------------------- code structure check ----------------------------- */

const BRACKET_LANGUAGES = new Set([
  "java",
  "javascript",
  "js",
  "jsx",
  "typescript",
  "ts",
  "tsx",
  "python",
  "py",
  "json",
  "css",
  "c",
  "cpp",
  "csharp",
  "go",
  "kotlin",
])
const PAIRS: Record<string, string> = { ")": "(", "]": "[", "}": "{" }

/**
 * A cheap structural check, not a compiler: brackets balance outside strings and comments, and no string or
 * block comment is left open. Languages without that syntax (SQL, shell, YAML, text) are not checked.
 */
export function balancedBrackets(code: string, language: string): boolean {
  const lang = language.toLowerCase()
  if (!BRACKET_LANGUAGES.has(lang)) return true
  const hashComments = lang === "python" || lang === "py"
  const stack: string[] = []
  for (let i = 0; i < code.length; i++) {
    const c = code[i]
    const next = code[i + 1]
    if (c === "/" && next === "/" && !hashComments) {
      while (i < code.length && code[i] !== "\n") i++
    } else if (c === "/" && next === "*" && lang !== "python") {
      const end = code.indexOf("*/", i + 2)
      if (end < 0) return false
      i = end + 1
    } else if (c === "#" && hashComments) {
      while (i < code.length && code[i] !== "\n") i++
    } else if (c === '"' || c === "'" || c === "`") {
      const triple = (c === '"' || c === "'") && code.startsWith(c.repeat(3), i)
      const quote = triple ? c.repeat(3) : c
      i += quote.length
      let closed = false
      while (i < code.length) {
        if (code[i] === "\\" && !triple) {
          i += 2
          continue
        }
        if (code.startsWith(quote, i)) {
          i += quote.length - 1
          closed = true
          break
        }
        // an ordinary string cannot span lines (template literals and triple quotes can)
        if (code[i] === "\n" && quote.length === 1 && c !== "`") break
        i++
      }
      if (!closed) {
        // an apostrophe in a comment-less prose-like line is not an open string; only quotes that wrap code count
        return false
      }
    } else if (c === "(" || c === "[" || c === "{") stack.push(c)
    else if (c in PAIRS) {
      if (stack.pop() !== PAIRS[c]) return false
    }
  }
  return stack.length === 0
}

/* ----------------------------------- text ----------------------------------- */

const checkText = (c: CheckItem): string[] => {
  switch (c.type) {
    case "single":
      return [c.prompt, ...c.options, c.explanation, c.code?.code ?? ""]
    case "multi":
      return [c.prompt, ...c.options, c.explanation]
    case "truefalse":
      return [c.statement, c.explanation]
    case "blank":
      return [c.prompt, c.answer, c.explanation]
    case "output":
      return [c.prompt, c.code.code, ...c.options, c.explanation]
  }
}
/**
 * What makes two check items the same question: the prompt together with its code and options. Two "What does
 * this print?" items with different code are different questions.
 */
const checkKey = (c: CheckItem): string => {
  switch (c.type) {
    case "truefalse":
      return normalise(c.statement)
    case "blank":
      return normalise(`${c.prompt}|${c.answer}`)
    case "multi":
      return normalise(`${c.prompt}|${[...c.options].sort().join("|")}`)
    case "single":
      return normalise(
        `${c.prompt}|${c.code?.code ?? ""}|${[...c.options].sort().join("|")}`
      )
    case "output":
      return normalise(
        `${c.prompt}|${c.code.code}|${[...c.options].sort().join("|")}`
      )
  }
}

/** Every piece of prose a learner reads in a lesson (code is not prose and is checked separately). */
export function lessonText(l: StudyLesson): string {
  return [
    l.title,
    l.overview,
    ...l.objectives,
    ...l.sections.flatMap((s) => {
      switch (s.kind) {
        case "explain":
          return [s.heading, ...s.body]
        case "code":
          return [
            s.heading,
            s.intro ?? "",
            s.example.title,
            ...s.example.walkthrough,
          ]
        case "diagram":
          return [
            s.heading,
            s.diagram.title,
            ...(s.diagram.kind === "flow"
              ? s.diagram.steps.flatMap((x) => [x.label, x.detail ?? ""])
              : [...s.diagram.headers, ...s.diagram.rows.flat()]),
          ]
        case "mistakes":
          return [s.heading, ...s.items.flatMap((m) => [m.mistake, m.fix])]
        case "practical":
          return [
            s.heading,
            s.scenario,
            ...s.body,
            ...(s.example ? [s.example.title, ...s.example.walkthrough] : []),
          ]
      }
    }),
    ...l.check.flatMap((c) => checkText(c).filter((t) => t !== c.id)),
    l.assignment.title,
    ...l.assignment.task,
    ...l.assignment.checklist,
    ...l.assignment.hints,
    ...l.exercises.flatMap((e) => [
      e.title,
      ...e.task,
      ...e.hints,
      ...e.checklist,
    ]),
    ...l.revisionNotes,
    ...l.resources.map((r) => r.label),
  ].join("\n")
}

/** Every code block in a lesson with a name for error messages. */
function codeBlocks(
  l: StudyLesson
): { where: string; language: string; code: string }[] {
  const out: { where: string; language: string; code: string }[] = []
  l.sections.forEach((s, i) => {
    if (s.kind === "code")
      out.push({ where: `section ${i + 1}`, ...pick(s.example) })
    if (s.kind === "practical" && s.example)
      out.push({ where: `section ${i + 1} example`, ...pick(s.example) })
  })
  l.check.forEach((c) => {
    if (c.type === "output" || (c.type === "single" && c.code))
      out.push({
        where: `check ${c.id}`,
        language: c.type === "output" ? c.code.language : c.code!.language,
        code: c.type === "output" ? c.code.code : c.code!.code,
      })
  })
  l.exercises.forEach((e) => {
    out.push({
      where: `exercise ${e.slug} starter`,
      language: e.language,
      code: e.starter,
    })
    out.push({
      where: `exercise ${e.slug} solution`,
      language: e.language,
      code: e.solution,
    })
  })
  return out
}
const pick = (e: { language: string; code: string }) => ({
  language: e.language,
  code: e.code,
})

/* ------------------------------- one lesson ------------------------------- */

export function validateLesson(l: StudyLesson, ctx: GateContext): Problem[] {
  const problems: Problem[] = []
  const add = (msg: string) => problems.push(`${l.id}: ${msg}`)
  const mod = ctx.modules.get(l.moduleId)
  if (!mod) {
    add(`module "${l.moduleId}" is not in the catalogue`)
  } else {
    const topic = mod.topicList.find((t) => t.title === l.topic)
    if (!topic)
      add(
        `topic "${l.topic}" is not a topic of ${l.moduleId} (use the exact title)`
      )
    else if (topic.minutes <= 0)
      add(`topic "${l.topic}" has no minutes in the plan`)
  }

  l.prerequisites.forEach((p) => {
    if (p === l.id) add("a lesson cannot be its own prerequisite")
    else if (p.startsWith("lesson.")) {
      if (!ctx.lessonIds.has(p)) add(`prerequisite ${p} is not a lesson`)
    } else if (!ctx.modules.has(p))
      add(`prerequisite ${p} is neither a lesson id nor a module id`)
  })

  l.resources.forEach((r) => {
    if (!isAllowedSource(r.url))
      add(`resource ${r.url} is not on the official-source allowlist`)
  })

  const checkKeys = l.check.map(checkKey)
  if (new Set(checkKeys).size !== checkKeys.length)
    add("two knowledge-check items ask the same thing")

  for (const b of codeBlocks(l)) {
    if (b.code.trim() === "") add(`${b.where}: empty code`)
    if (!balancedBrackets(b.code, b.language))
      add(
        `${b.where}: ${b.language} code has unbalanced brackets or an unclosed string`
      )
  }

  for (const e of l.exercises) {
    if (e.run) {
      const entry = new RegExp(`\\b${e.run.entry.replace(/\$/g, "\\$")}\\b`)
      if (!entry.test(e.starter))
        add(
          `exercise ${e.slug}: the starter code does not declare ${e.run.entry}`
        )
      if (!entry.test(e.solution))
        add(`exercise ${e.slug}: the solution does not declare ${e.run.entry}`)
    }
  }

  const text = lessonText(l)
  const freq = findFrequencyClaim(text)
  if (freq) add(`frequency claim: "${freq}"`)
  const stat = findStatisticClaim(text)
  if (stat) add(`statistic claim: "${stat}"`)
  const name = findDeniedName(text, LESSON_DENIED_NAMES)
  if (name) add(`names a company or brand: "${name}"`)

  return problems
}

/* ------------------------------ the whole pool ------------------------------ */

/** Minutes of a module's lessons per topic title. */
function minutesByTopic(lessons: readonly StudyLesson[]) {
  const m = new Map<string, number>()
  for (const l of lessons) m.set(l.topic, (m.get(l.topic) ?? 0) + l.minutes)
  return m
}

/** Every per-lesson rule, plus the rules that need the whole pool. */
export function validateLessons(
  lessons: readonly StudyLesson[],
  modules: ReadonlyMap<string, GateModule>
): Problem[] {
  const ctx: GateContext = {
    modules,
    lessonIds: new Set(lessons.map((l) => l.id)),
  }
  const problems: Problem[] = []
  const ids = new Set<string>()
  const titles = new Map<string, string>()
  const prompts = new Map<string, string>()
  for (const l of lessons) {
    if (ids.has(l.id)) problems.push(`${l.id}: duplicate lesson`)
    ids.add(l.id)
    const title = `${l.moduleId}|${normalise(l.title)}`
    if (titles.has(title))
      problems.push(`${l.id}: same title as ${titles.get(title)}`)
    titles.set(title, l.id)
    for (const c of l.check) {
      const key = checkKey(c)
      const seen = prompts.get(key)
      if (seen && seen !== l.id)
        problems.push(
          `${l.id}: check item ${c.id} repeats a question from ${seen}`
        )
      prompts.set(key, l.id)
    }
    problems.push(...validateLesson(l, ctx))
  }

  // prerequisites form no cycle
  const graph = new Map(
    lessons.map((l) => [
      l.id,
      l.prerequisites.filter((p) => p.startsWith("lesson.")),
    ])
  )
  const state = new Map<string, 1 | 2>()
  const visit = (id: string, path: string[]): void => {
    if (state.get(id) === 2) return
    if (state.get(id) === 1) {
      problems.push(`prerequisite cycle: ${[...path, id].join(" -> ")}`)
      return
    }
    state.set(id, 1)
    for (const p of graph.get(id) ?? [])
      if (graph.has(p)) visit(p, [...path, id])
    state.set(id, 2)
  }
  for (const id of graph.keys()) visit(id, [])

  // the lessons of a topic never add up to much more than the topic's minutes (less is fine until release)
  const byModule = new Map<string, StudyLesson[]>()
  for (const l of lessons)
    byModule.set(l.moduleId, [...(byModule.get(l.moduleId) ?? []), l])
  for (const [moduleId, mine] of byModule) {
    const mod = modules.get(moduleId)
    if (!mod) continue
    for (const [topic, minutes] of minutesByTopic(mine)) {
      const t = mod.topicList.find((x) => x.title === topic)
      if (t && t.minutes > 0 && minutes > t.minutes * (1 + MINUTES_TOLERANCE))
        problems.push(
          `${moduleId}: lessons for "${topic}" add up to ${minutes} min, more than ${Math.round(MINUTES_TOLERANCE * 100)}% over the topic's ${t.minutes} min`
        )
    }
  }
  return problems
}

/**
 * What a module needs before it may be listed as "released": a lesson for every topic with minutes,
 * lesson minutes within the tolerance of each topic's minutes, and at least `RELEASE_MIN_LESSONS` lessons.
 */
export function releaseProblems(
  mod: GateModule,
  lessons: readonly StudyLesson[]
): Problem[] {
  const problems: Problem[] = []
  const mine = lessons.filter((l) => l.moduleId === mod.id)
  if (mine.length < RELEASE_MIN_LESSONS)
    problems.push(
      `${mod.id}: ${mine.length} lessons, at least ${RELEASE_MIN_LESSONS} are needed`
    )
  const byTopic = minutesByTopic(mine)
  for (const t of mod.topicList.filter((x) => x.minutes > 0)) {
    const minutes = byTopic.get(t.title)
    if (minutes === undefined) {
      problems.push(`${mod.id}: topic "${t.title}" has no lesson`)
      continue
    }
    const low = t.minutes * (1 - MINUTES_TOLERANCE)
    const high = t.minutes * (1 + MINUTES_TOLERANCE)
    if (minutes < low || minutes > high)
      problems.push(
        `${mod.id}: lessons for "${t.title}" add up to ${minutes} min, the topic is ${t.minutes} min (allowed ${Math.ceil(low)}-${Math.floor(high)})`
      )
  }
  return problems
}
