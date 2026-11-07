import { HR_DENIED_NAMES } from "@/data/questions/hr-denylist"
import {
  findDeniedName,
  findFrequencyClaim,
  findStatisticClaim,
} from "@/services/content/quality"
import {
  ANSWER_LEVELS,
  challengeDaySchema,
  type Activity,
  type ChallengeDay,
  type EnglishItem,
  type EnglishLesson,
} from "@/types/english"
import { countWords, normalise, words } from "./normalise"

/**
 * The English content gate: every rule a machine can check. It cannot tell whether the English or the Hindi is
 * correct (that needs a teacher, hence the module `review` flag); it checks that every item is complete,
 * well formed, practicable and free of invented claims.
 */
export type Problem = string

/** Latin letters as a share of all letters, ignoring quoted English phrases ('so' "so" ‘so’ “so”). */
export function latinShare(text: string): number {
  const unquoted = text
    .replace(/'[^']*'|"[^"]*"|‘[^’]*’|“[^”]*”/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
  const letters = unquoted.match(/\p{L}/gu) ?? []
  if (letters.length === 0) return 0
  const latin = letters.filter((c) => /\p{Script=Latin}/u.test(c)).length
  return latin / letters.length
}

const MAX_LATIN_IN_HINDI = 0.2

function englishTexts(it: EnglishItem): string[] {
  switch (it.kind) {
    case "sentence":
      return [
        it.en,
        it.whenToUse,
        ...(it.accepted ?? []),
        ...it.example.map((l) => l.en),
        it.note?.en ?? "",
        ...activityTexts(it.activity),
      ]
    case "vocab":
      return [
        it.word,
        it.exampleEn,
        ...(it.activity ? activityTexts(it.activity) : []),
      ]
    case "grammar":
      return [
        it.title,
        it.rule.en,
        ...it.examples.map((e) => e.en),
        it.commonMistake.wrong,
        it.commonMistake.right,
        it.commonMistake.why.en,
        it.note?.en ?? "",
        ...activityTexts(it.activity),
      ]
    case "dialogue":
      return [it.title, it.situation.en, ...it.lines.map((l) => l.en)]
    case "answer":
      return [it.question, ...it.variants.map((v) => v.en), ...it.tips]
  }
}
function hindiTexts(it: EnglishItem): string[] {
  switch (it.kind) {
    case "sentence":
      return [it.hi, ...it.example.map((l) => l.hi), it.note?.hi ?? ""]
    case "vocab":
      return [it.hi, it.exampleHi]
    case "grammar":
      return [
        it.rule.hi,
        ...it.examples.map((e) => e.hi),
        it.commonMistake.why.hi,
        it.note?.hi ?? "",
      ]
    case "dialogue":
      return [it.situation.hi, ...it.lines.map((l) => l.hi)]
    case "answer":
      return it.variants.map((v) => v.hi)
  }
}
function activityTexts(a: Activity): string[] {
  return a.type === "blank"
    ? [a.text, a.answer]
    : a.type === "choose"
      ? [a.prompt, ...a.options]
      : []
}

function checkActivity(
  id: string,
  a: Activity,
  sentence: string | null,
  allowed: readonly Activity["type"][]
): Problem[] {
  const out: Problem[] = []
  if (!allowed.includes(a.type))
    out.push(
      `${id}: activity "${a.type}" is not allowed here (use ${allowed.join(", ")})`
    )
  if (a.type === "blank") {
    const blanks = a.text.split("___").length - 1
    if (blanks !== 1)
      out.push(`${id}: a blank activity needs exactly one ___ in its text`)
    if (
      normalise(a.text.replace("___", ""))
        .split(" ")
        .includes(normalise(a.answer)) &&
      normalise(a.answer).split(" ").length === 1
    )
      out.push(`${id}: the blank's answer already appears in its text`)
  }
  if (a.type === "choose") {
    const norm = a.options.map(normalise)
    if (new Set(norm).size !== norm.length)
      out.push(`${id}: choose options must be different`)
    if (!norm.includes(normalise(a.answer)))
      out.push(`${id}: the answer must be one of the options`)
  }
  if (a.type === "arrange" && sentence !== null) {
    const n = words(sentence).length
    if (n < 3 || n > 14)
      out.push(`${id}: arrange needs 3 to 14 words (this has ${n})`)
  }
  return out
}

/** Every rule, over a set of lessons (pass the whole course so uniqueness is checked across it). */
export function validateLessons(lessons: readonly EnglishLesson[]): Problem[] {
  const problems: Problem[] = []
  const ids = new Set<string>()
  const sentences = new Map<string, string>()
  const lessonSlugs = new Set<string>()

  for (const lesson of lessons) {
    const key = `${lesson.moduleId}/${lesson.slug}`
    if (lessonSlugs.has(key)) problems.push(`${lesson.id}: duplicate lesson`)
    lessonSlugs.add(key)
    const itemSlugs = new Set<string>()
    for (const it of lesson.items) {
      const id = it.id
      if (ids.has(id)) problems.push(`${id}: duplicate id`)
      ids.add(id)
      if (itemSlugs.has(it.slug))
        problems.push(`${id}: duplicate item slug in its lesson`)
      itemSlugs.add(it.slug)

      // Hindi: Devanagari (the schema) with few Latin letters outside quoted English
      for (const h of hindiTexts(it).filter(Boolean))
        if (latinShare(h) > MAX_LATIN_IN_HINDI)
          problems.push(
            `${id}: Hindi text has too many Latin letters (put English words in quotes): "${h.slice(0, 40)}"`
          )

      // English text hygiene
      for (const t of englishTexts(it).filter((x) => x !== "")) {
        if (t !== t.trim())
          problems.push(
            `${id}: English text has leading or trailing spaces: "${t.slice(0, 30)}"`
          )
        if (/ {2,}/.test(t))
          problems.push(
            `${id}: English text has a double space: "${t.slice(0, 30)}"`
          )
        if (t.includes("%"))
          problems.push(`${id}: no percentages ("${t.slice(0, 30)}")`)
        const stat = findStatisticClaim(t) ?? findFrequencyClaim(t)
        if (stat)
          problems.push(`${id}: no statistic or frequency claims ("${stat}")`)
        const name = findDeniedName(t, HR_DENIED_NAMES)
        if (name) problems.push(`${id}: names a company or product: "${name}"`)
      }

      switch (it.kind) {
        case "sentence": {
          const n = countWords(it.en)
          if (n < 1 || n > 20)
            problems.push(`${id}: a sentence has 1 to 20 words (this has ${n})`)
          if (!/^[A-Z0-9"'‘“]/.test(it.en))
            problems.push(
              `${id}: the sentence must start with a capital letter`
            )
          if (!/[.?!]["'’”]?$/.test(it.en))
            problems.push(`${id}: the sentence must end with . ? or !`)
          const norm = normalise(it.en)
          const prior = sentences.get(norm)
          if (prior) problems.push(`${id}: the same sentence as ${prior}`)
          else sentences.set(norm, id)
          if (it.hiRoman !== undefined && /[^\u0020-\u007E]/.test(it.hiRoman))
            problems.push(`${id}: hiRoman must use Latin letters only`)
          const speakers = new Set(it.example.map((l) => l.speaker))
          if (speakers.size < 2)
            problems.push(`${id}: the example conversation needs two speakers`)
          const acc = (it.accepted ?? []).map(normalise)
          if (new Set(acc).size !== acc.length)
            problems.push(`${id}: accepted variants repeat`)
          if (acc.includes(norm))
            problems.push(
              `${id}: an accepted variant is the same as the sentence`
            )
          problems.push(
            ...checkActivity(id, it.activity, it.en, [
              "type",
              "arrange",
              "speak",
              "blank",
              "choose",
            ])
          )
          break
        }
        case "vocab":
          if (it.activity)
            problems.push(
              ...checkActivity(id, it.activity, null, [
                "type",
                "blank",
                "choose",
              ])
            )
          break
        case "grammar": {
          if (
            normalise(it.commonMistake.wrong) ===
            normalise(it.commonMistake.right)
          )
            problems.push(
              `${id}: the common mistake's wrong and right wording are the same`
            )
          problems.push(
            ...checkActivity(id, it.activity, null, ["blank", "choose"])
          )
          break
        }
        case "dialogue": {
          const speakers = new Set(it.lines.map((l) => l.speaker))
          if (speakers.size < 2)
            problems.push(`${id}: a dialogue needs two speakers`)
          break
        }
        case "answer": {
          const levels = it.variants.map((v) => v.level)
          if (
            ANSWER_LEVELS.some((l) => !levels.includes(l)) ||
            new Set(levels).size !== 3
          )
            problems.push(
              `${id}: needs exactly one easy, one intermediate and one professional variant`
            )
          const by = Object.fromEntries(it.variants.map((v) => [v.level, v]))
          const w = (l: (typeof ANSWER_LEVELS)[number]) =>
            countWords(by[l]?.en ?? "")
          for (const l of ANSWER_LEVELS) {
            if (w(l) < 1 || w(l) > 120)
              problems.push(
                `${id}: the ${l} variant has ${w(l)} words (1 to 120)`
              )
            if (by[l] && !/\[[^\]]+\]/.test(by[l].en))
              problems.push(
                `${id}: the ${l} variant needs a [placeholder] for the learner's own fact`
              )
          }
          if (by.easy && by.intermediate && w("intermediate") <= w("easy"))
            problems.push(
              `${id}: the intermediate variant must be longer than the easy one`
            )
          if (
            by.intermediate &&
            by.professional &&
            w("professional") <= w("intermediate")
          )
            problems.push(
              `${id}: the professional variant must be longer than the intermediate one`
            )
          break
        }
      }
    }
  }
  return problems
}

/**
 * The 30-day challenge gate: either no days at all (the page then says it is being written) or exactly 30
 * valid ones, with every referenced lesson and item present in the course, sentences and words of the right
 * kind, and the speaking item a sentence.
 */
export function validateChallenge(
  days: readonly ChallengeDay[],
  lessons: readonly EnglishLesson[]
): Problem[] {
  if (days.length === 0) return []
  const problems: Problem[] = []
  if (days.length !== 30)
    problems.push(`the challenge has ${days.length} days, it must have 30`)
  const byLesson = new Map(lessons.map((l) => [l.id, l]))
  const items = new Map(lessons.flatMap((l) => l.items.map((i) => [i.id, i])))
  const seen = new Set<number>()
  for (const [index, d] of days.entries()) {
    const at = `day ${d.day}`
    const parsed = challengeDaySchema.safeParse(d)
    if (!parsed.success)
      problems.push(`${at}: ${parsed.error.issues[0]?.message}`)
    if (d.day !== index + 1)
      problems.push(
        `${at}: days must be in order from 1 (found at position ${index + 1})`
      )
    if (seen.has(d.day)) problems.push(`${at}: duplicate day`)
    seen.add(d.day)
    if (!byLesson.has(d.lesson))
      problems.push(`${at}: unknown lesson ${d.lesson}`)
    const ex = byLesson.get(d.exercise.lesson)
    if (!ex)
      problems.push(`${at}: unknown exercise lesson ${d.exercise.lesson}`)
    const kind = (id: string) => items.get(id)?.kind
    for (const id of d.vocab) {
      if (!items.has(id)) problems.push(`${at}: unknown item ${id}`)
      else if (kind(id) !== "vocab" && kind(id) !== "sentence")
        problems.push(`${at}: ${id} is not a word or a sentence`)
    }
    for (const id of d.sentences)
      if (kind(id) !== "sentence")
        problems.push(`${at}: ${id} is not a known sentence`)
    if (kind(d.speaking) !== "sentence")
      problems.push(
        `${at}: the speaking item ${d.speaking} is not a known sentence`
      )
    if (new Set(d.vocab).size !== d.vocab.length)
      problems.push(`${at}: repeated words`)
    if (new Set(d.sentences).size !== d.sentences.length)
      problems.push(`${at}: repeated sentences`)
    if (ex) {
      const supply = ex.items.filter(
        (i) =>
          i.kind === "sentence" ||
          i.kind === "vocab" ||
          (i.kind === "grammar" && i.activity)
      ).length
      if (supply < d.exercise.count)
        problems.push(
          `${at}: the exercise lesson cannot supply ${d.exercise.count} exercises`
        )
    }
  }
  return problems
}
