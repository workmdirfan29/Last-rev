import {
  CAP_PER_SOURCE,
  GAP_MONTHS,
  MANY_SKILLS,
  SCENARIO_TECHNOLOGIES,
  SHORT_TENURE_MONTHS,
  SLOT_MAX_CHARS,
  TEMPLATE_BY_ID,
  UNUSED_SKILL_CAP,
  type Template,
} from "@/data/resume/templates"
import {
  resumeModuleId,
  type ResumeProfile,
  type ResumeQuestion,
  type ResumeSection,
} from "@/types/learner"

/** A question before it is saved: everything but the timestamps and flags. */
export interface Draft {
  id: string
  section: ResumeSection
  title: string
  framework: string[]
  templateId: string
  sourceKind: string
  sourceUid: string
  slotKey: string
}

/** cyrb53: a small, stable 53-bit hash. Used only to make short ids, never for security. */
export function hash53(text: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

/** `resume-<section>.fresher.<hash>`: made from the template, the resume item's own uid and a slot key, never from its wording. */
export function questionId(
  section: ResumeSection,
  templateId: string,
  sourceUid: string,
  slotKey: string
): string {
  const h = hash53(`${templateId}|${sourceUid}|${slotKey}`)
    .toString(36)
    .padStart(10, "0")
  return `${resumeModuleId(section)}.fresher.${h}`
}

/** Cut at a word and end with an ellipsis when longer than the slot limit. */
export function clip(text: string, max = SLOT_MAX_CHARS): string {
  const t = text
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.!?]+$/, "")
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const space = cut.lastIndexOf(" ")
  return `${(space > max * 0.5 ? cut.slice(0, space) : cut).trimEnd()}…`
}

const fill = (text: string, slots: Record<string, string>): string | null => {
  let missing = false
  const out = text.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = (slots[k] ?? "").trim()
    if (!v) missing = true
    return v
  })
  return missing ? null : out
}
const fillAll = (items: string[], slots: Record<string, string>) =>
  items.map((s) =>
    s.replace(/\{(\w+)\}/g, (_, k: string) => slots[k]?.trim() || "[...]")
  )

const ACHIEVEMENT_VERB =
  /\b(reduced|improved|increased|saved|led|launched|cut|boosted|grew|delivered|won|achieved|optimi[sz]ed|automated|migrated|scaled)\b/i
const isAchievement = (bullet: string) =>
  /\d/.test(bullet) || ACHIEVEMENT_VERB.test(bullet)

const MONTHS: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
}
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const mentions = (text: string, term: string) =>
  term.trim() !== "" &&
  new RegExp(`(?<![A-Za-z0-9])${escape(term.trim())}(?![A-Za-z0-9])`, "i").test(
    text
  )

/** Months since year 0 for "Jan 2022", "01/2022" or a bare year (a bare year is not precise enough: null). */
export function monthIndex(text: string): number | null {
  const named = /([A-Za-z]{3})[a-z]*\.?\s+(\d{4})/.exec(text)
  if (named) {
    const m = MONTHS[named[1].toLowerCase()]
    return m ? Number(named[2]) * 12 + m : null
  }
  const num = /(\d{1,2})[/.](\d{4})/.exec(text)
  if (num && Number(num[1]) >= 1 && Number(num[1]) <= 12)
    return Number(num[2]) * 12 + Number(num[1])
  return null
}
const isCurrent = (end: string) =>
  /present|current|now|ongoing|till date|to date/i.test(end)

/** A skill row short enough to be a technology (up to 3 words and 30 characters), not a sentence fragment. */
export const isSkillName = (name: string): boolean => {
  const t = name.trim()
  return t.length > 0 && t.length <= 30 && t.split(/\s+/).length <= 3
}

const TRAINING_WORD = /\b(intern(ship)?|training|trainee|apprentice(ship)?)\b/i
/** A job entry under about 3 months with a training or internship title: normal for those, shown as a short entry. */
export function isShortEntry(job: {
  role: string
  company: string
  start: string
  end: string
}): boolean {
  if (!TRAINING_WORD.test(`${job.role} ${job.company}`)) return false
  const a = monthIndex(job.start)
  const b = monthIndex(job.end)
  return a !== null && b !== null && b >= a && b - a < 3
}

export interface GenerateOptions {
  /** Also make the neutral date questions (tenure, gaps). */
  includeDateQuestions: boolean
  raiseCaps: boolean
}

/**
 * Every question the reviewed profile supports, from the templates and nothing else. Deterministic: the same
 * profile always gives the same questions with the same ids. A template is skipped when a slot is empty,
 * and per-source caps keep a long resume from flooding the bank (the learner can raise them).
 */
export function generateQuestions(
  profile: Pick<
    ResumeProfile,
    | "summary"
    | "skills"
    | "experiences"
    | "projects"
    | "certifications"
    | "achievements"
  >,
  options: GenerateOptions
): Draft[] {
  const out: Draft[] = []
  const seenIds = new Set<string>()
  const seenText = new Set<string>()
  const cap = options.raiseCaps ? Number.POSITIVE_INFINITY : CAP_PER_SOURCE

  const add = (
    templateId: string,
    sourceKind: string,
    sourceUid: string,
    slotKey: string,
    slots: Record<string, string>
  ) => {
    const tpl: Template = TEMPLATE_BY_ID.get(templateId)!
    const title = fill(tpl.text, slots)
    if (!title) return false
    const id = questionId(tpl.section, tpl.id, sourceUid, slotKey)
    const norm = `${tpl.section}|${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()}`
    if (seenIds.has(id) || seenText.has(norm)) return false
    seenIds.add(id)
    seenText.add(norm)
    out.push({
      id,
      section: tpl.section,
      title,
      framework: fillAll(tpl.framework, slots),
      templateId,
      sourceKind,
      sourceUid,
      slotKey,
    })
    return true
  }

  // Only rows that read as a technology become questions: a sentence fragment never becomes "You list <sentence>".
  const skills = profile.skills.filter((s) => isSkillName(s.name))
  const allSkillCount = profile.skills.filter((s) => s.name.trim()).length
  const jobs = profile.experiences
  const bulletTexts = [
    ...jobs.flatMap((j) => j.bullets.map((b) => b.text)),
    ...profile.projects.flatMap((p) => p.bullets.map((b) => b.text)),
  ]

  // Resume introduction
  const latest = jobs.find((j) => j.role.trim() && j.company.trim())
  if (latest)
    add("intro.walk", "job", latest.uid, "", {
      role: clip(latest.role),
      company: clip(latest.company),
    })
  if (profile.summary.trim())
    add("intro.summary", "summary", "summary", "", {
      summary: clip(profile.summary),
    })
  if (skills.length >= 3)
    add("intro.strengths", "skills", "skills", "", {
      skill1: skills[0].name,
      skill2: skills[1].name,
      skill3: skills[2].name,
    })

  // Technical skills and follow-ups per skill
  for (const s of skills) {
    add("skill.problem", "skill", s.uid, "", { skill: s.name })
    add("skill.depth", "skill", s.uid, "", { skill: s.name })
    if (
      bulletTexts.some((b) => mentions(b, s.name)) ||
      profile.projects.some((p) =>
        p.technologies.some((t) => t.toLowerCase() === s.name.toLowerCase())
      )
    )
      add("follow.limits", "skill", s.uid, "", { skill: s.name })
  }

  // Companies, responsibilities, achievements, follow-ups per bullet
  for (const j of jobs) {
    const company = clip(j.company)
    if (company) {
      add("company.role", "job", j.uid, "", { company })
      add("company.team", "job", j.uid, "", { company })
      add("company.learned", "job", j.uid, "", { company })
      if (j.end.trim()) {
        if (isCurrent(j.end)) add("company.stay", "job", j.uid, "", { company })
        else add("company.leave", "job", j.uid, "", { company })
      }
    }
    let resp = 0
    let ach = 0
    let follow = 0
    for (const b of j.bullets) {
      const text = clip(b.text)
      if (!text) continue
      if (isAchievement(b.text)) {
        if (ach < cap) {
          const a = add("ach.how", "bullet", b.uid, "", { bullet: text })
          const c = add("ach.proof", "bullet", b.uid, "", { bullet: text })
          if (a || c) ach++
        }
      } else if (resp < cap) {
        if (add("resp.walk", "bullet", b.uid, "", { bullet: text })) resp++
      }
      const skill = skills.find((s) => mentions(b.text, s.name))
      if (
        skill &&
        follow < cap &&
        add("follow.use", "bullet", b.uid, skill.uid, {
          skill: skill.name,
          bullet: text,
        })
      )
        follow++
    }
  }
  for (const p of profile.projects) {
    let resp = 0
    let ach = 0
    let follow = 0
    for (const b of p.bullets) {
      const text = clip(b.text)
      if (!text) continue
      if (isAchievement(b.text)) {
        if (ach < cap) {
          const a = add("ach.how", "bullet", b.uid, "", { bullet: text })
          const c = add("ach.proof", "bullet", b.uid, "", { bullet: text })
          if (a || c) ach++
        }
      } else if (
        resp < cap &&
        add("resp.walk", "bullet", b.uid, "", { bullet: text })
      )
        resp++
      const skill = skills.find((s) => mentions(b.text, s.name))
      if (
        skill &&
        follow < cap &&
        add("follow.use", "bullet", b.uid, skill.uid, {
          skill: skill.name,
          bullet: text,
        })
      )
        follow++
    }
  }
  for (const c of profile.certifications)
    if (c.text.trim())
      add("ach.cert", "certification", c.uid, "", {
        certification: clip(c.text),
      })
  for (const a of profile.achievements)
    if (a.text.trim())
      add("ach.entry", "achievement", a.uid, "", { achievement: clip(a.text) })

  // Projects and architecture
  for (const p of profile.projects) {
    const project = clip(p.name)
    if (!project) continue
    for (const id of [
      "project.pitch",
      "project.part",
      "project.challenge",
      "project.change",
      "project.ship",
    ])
      add(id, "project", p.uid, "", { project })
    const tech1 = p.technologies.map((x) => x.trim()).find(Boolean)
    if (tech1) {
      add("arch.walk", "project", p.uid, "", { project, tech1 })
      add("arch.fit", "project", p.uid, "", { project, tech1 })
      add("arch.flow", "project", p.uid, "", { project })
      add("arch.growth", "project", p.uid, "", { project })
    }
  }

  // Difficult questions, derived from the reviewed data
  const usedText = [
    ...bulletTexts,
    ...jobs.flatMap((j) => [j.role, j.company]),
    ...profile.projects.flatMap((p) => [
      p.name,
      p.description,
      ...p.technologies,
    ]),
  ].join("\n")
  if (bulletTexts.length + profile.projects.length > 0) {
    let n = 0
    for (const s of skills) {
      if (n >= UNUSED_SKILL_CAP) break
      if (
        !mentions(usedText, s.name) &&
        add("diff.unused", "skill", s.uid, "", { skill: s.name })
      )
        n++
    }
  }
  if (options.includeDateQuestions) {
    for (const j of jobs) {
      const a = monthIndex(j.start)
      const b = isCurrent(j.end) ? null : monthIndex(j.end)
      if (
        a !== null &&
        b !== null &&
        b >= a &&
        b - a < SHORT_TENURE_MONTHS &&
        j.company.trim()
      )
        add("diff.tenure", "job", j.uid, "tenure", {
          company: clip(j.company),
          months: String(Math.max(1, b - a)),
        })
    }
    const dated = jobs
      .map((j) => ({
        j,
        start: monthIndex(j.start),
        end: isCurrent(j.end) ? null : monthIndex(j.end),
      }))
      .filter((x) => x.start !== null)
      .sort((x, y) => x.start! - y.start!)
    for (let i = 0; i + 1 < dated.length; i++) {
      const prev = dated[i]
      const next = dated[i + 1]
      if (prev.end === null || next.start === null) continue
      const gap = next.start - prev.end
      if (gap > GAP_MONTHS && prev.j.company.trim() && next.j.company.trim())
        add("diff.gap", "job", next.j.uid, `gap:${prev.j.uid}`, {
          months: String(gap),
          companyA: clip(prev.j.company),
          companyB: clip(next.j.company),
        })
    }
  }
  if (bulletTexts.length >= 3 && bulletTexts.every((b) => !/\d/.test(b)))
    add("diff.numbers", "bullets", "bullets", "", {})
  if (allSkillCount > MANY_SKILLS)
    add("diff.many", "skills", "skills", "many", {
      count: String(allSkillCount),
    })

  // Scenarios for the technologies the resume mentions most
  const ranked = skills
    .map((s, order) => ({
      s,
      order,
      n:
        bulletTexts.filter((b) => mentions(b, s.name)).length +
        profile.projects.filter((p) =>
          p.technologies.some((t) => t.toLowerCase() === s.name.toLowerCase())
        ).length,
    }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || a.order - b.order)
    .slice(0, SCENARIO_TECHNOLOGIES)
  for (const { s } of ranked) {
    add("scen.fail", "skill", s.uid, "", { skill: s.name })
    add("scen.slow", "skill", s.uid, "", { skill: s.name })
  }
  return out
}

/**
 * Bring the stored questions in line with a fresh generation. A question keeps its id (so notes, answers,
 * confidence and bookmarks survive); wording is refreshed unless the learner edited it; one whose source is
 * gone is marked "source removed" instead of vanishing. Imported questions are never touched.
 */
export function reconcile(
  existing: readonly ResumeQuestion[],
  drafts: readonly Draft[],
  now: string
): ResumeQuestion[] {
  const byId = new Map(drafts.map((d) => [d.id, d]))
  const kept = new Set<string>()
  const result: ResumeQuestion[] = []
  for (const q of existing) {
    if (q.setId !== "") {
      result.push(q)
      continue
    }
    const d = byId.get(q.id)
    if (!d) {
      result.push(
        q.status === "source-removed"
          ? q
          : { ...q, status: "source-removed", updatedAt: now }
      )
      continue
    }
    kept.add(q.id)
    result.push({
      ...q,
      title: q.edited ? q.title : d.title,
      generatedTitle: d.title,
      framework: d.framework,
      status: "active",
      updatedAt: now,
    })
  }
  for (const d of drafts)
    if (!kept.has(d.id) && !existing.some((q) => q.id === d.id))
      result.push({
        id: d.id,
        section: d.section,
        title: d.title,
        generatedTitle: d.title,
        framework: d.framework,
        templateId: d.templateId,
        sourceKind: d.sourceKind,
        sourceUid: d.sourceUid,
        slotKey: d.slotKey,
        status: "active",
        edited: false,
        setId: "",
        setLabel: "",
        createdAt: now,
        updatedAt: now,
      })
  return result
}

export interface PendingChanges {
  added: number
  updated: number
  removed: number
  total: number
}

/** What "Update my questions" would do right now, so the learner can see their resume has changed. */
export function pendingChanges(
  existing: readonly ResumeQuestion[],
  drafts: readonly Draft[]
): PendingChanges {
  const byId = new Map(existing.map((q) => [q.id, q]))
  const draftIds = new Set(drafts.map((d) => d.id))
  let added = 0
  let updated = 0
  for (const d of drafts) {
    const q = byId.get(d.id)
    if (!q) added++
    else if (
      q.status !== "active" ||
      q.generatedTitle !== d.title ||
      q.framework.join("\n") !== d.framework.join("\n")
    )
      updated++
  }
  const removed = existing.filter(
    (q) => q.setId === "" && q.status === "active" && !draftIds.has(q.id)
  ).length
  return { added, updated, removed, total: added + updated + removed }
}
