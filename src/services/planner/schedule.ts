import { topicIdOf, topicSlug } from "@/utils/topic-id"
import { MODULES } from "@/data/catalog/modules"
import type { DomainId } from "@/data/catalog/module-types"
import type { SyllabusEntry } from "@/services/curriculum/syllabus"
import { fromDateKey, shiftDateKey, toDateKey } from "@/utils/dates"

/**
 * The daily-plan engine. Pure functions: the schedule is always recomputed from the effective
 * syllabus, the learner's pace and the blocks they have finished. Only deviations are stored
 * (see PlanState). Minutes are never compressed to fit a deadline; a deadline that is too short is
 * reported, and what lands after it is flagged.
 */

/* ------------------------------------ blocks ----------------------------------- */

export interface PlanBlock {
  /** `topic.<moduleId>.<topic-slug>`, plus `-p<N>` for part N of a topic split across days. */
  id: string
  /** The topic this block belongs to (the id without any part suffix). */
  topicId: string
  moduleId: string
  moduleTitle: string
  topic: string
  minutes: number
  /** Present when a topic is split across days: "Part 1 of 2". */
  part: { index: number; of: number } | null
  /** The module is under "Later" (core first): scheduled after the rest, left out of the deadline check. */
  deferred: boolean
}

/** A split part shorter than this is labelled "Short part": the exact day count wins over avoiding small tails. */
export const SHORT_PART_MINUTES = 15
export const isShortPart = (b: { part: PlanBlock["part"]; minutes: number }) =>
  b.part !== null && b.minutes < SHORT_PART_MINUTES

export { topicSlug, topicIdOf }

/** Split `total` across weights as whole numbers that add up to exactly `total` (largest remainder). */
export function distribute(
  total: number,
  weights: readonly number[]
): number[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  if (sum <= 0 || total <= 0) return weights.map(() => 0)
  const raw = weights.map((w) => (w / sum) * total)
  const out = raw.map((r) => Math.floor(r))
  let left = total - out.reduce((a, b) => a + b, 0)
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac)
  for (const { i } of order) {
    if (left <= 0) break
    out[i]++
    left--
  }
  return out
}

const TIER_RANK = { core: 0, recommended: 1 } as const

/**
 * Modules in the order they are studied: core first, then recommended, then everything else the learner
 * chose; "Later" modules last; inside a tier by domain order (foundation first) and then catalogue
 * order. A module's selected prerequisites always come before it.
 */
export function orderModules(
  entries: readonly SyllabusEntry[],
  domainOrder?: readonly DomainId[]
): SyllabusEntry[] {
  const selected = entries.filter((e) => e.selected)
  const position = new Map(MODULES.map((m, i) => [m.id, i]))
  const domainRank = (d: DomainId) => (domainOrder ? domainOrder.indexOf(d) : 0)
  const rank = (e: SyllabusEntry) =>
    e.deferred
      ? 3
      : e.tier && e.tier in TIER_RANK
        ? TIER_RANK[e.tier as keyof typeof TIER_RANK]
        : 2
  const sorted = [...selected].sort(
    (a, b) =>
      rank(a) - rank(b) ||
      domainRank(a.module.domainId) - domainRank(b.module.domainId) ||
      position.get(a.module.id)! - position.get(b.module.id)!
  )
  const byId = new Map(sorted.map((e) => [e.module.id, e]))
  const out: SyllabusEntry[] = []
  const seen = new Set<string>()
  const visit = (e: SyllabusEntry) => {
    if (seen.has(e.module.id)) return
    seen.add(e.module.id)
    for (const p of e.module.prerequisites) {
      const pe = byId.get(p)
      if (pe) visit(pe)
    }
    out.push(e)
  }
  sorted.forEach(visit)
  return out
}

/**
 * Turn the ordered modules into blocks. Each module's minutes are shared across its topics in proportion
 * to the authored topic minutes, so the blocks add up to exactly the hours shown on the review step.
 *
 * The plan is one stream of minutes cut into days of `dailyMinutes`: a topic that does not fit in the rest
 * of a day is split there (Part 1 of N, Part 2 of N), so every day is full and the number of study days is
 * exactly ceil(total minutes / daily minutes). The cuts depend only on the syllabus order and the daily
 * time, never on what was finished, moved or missed, so a finished part keeps its size and its id.
 * Removed blocks leave the stream's cuts where they were.
 */
export function buildBlocks(
  ordered: readonly SyllabusEntry[],
  dailyMinutes: number,
  removed: ReadonlySet<string> = new Set()
): PlanBlock[] {
  const day = Math.max(1, dailyMinutes)
  const blocks: PlanBlock[] = []
  let filled = 0 // minutes already in the day the stream has reached
  for (const entry of ordered) {
    const topics = entry.module.topicList
    const minutes = distribute(
      entry.minutes,
      topics.map((t) => t.minutes)
    )
    topics.forEach((topic, i) => {
      const m = minutes[i]
      if (m <= 0) return
      const sizes: number[] = []
      for (let left = m; left > 0;) {
        const take = Math.min(left, day - filled)
        sizes.push(take)
        left -= take
        filled = (filled + take) % day
      }
      const topicId = topicIdOf(entry.module.id, topic.title)
      sizes.forEach((size, p) => {
        const id = sizes.length > 1 ? `${topicId}-p${p + 1}` : topicId
        if (removed.has(id)) return
        blocks.push({
          id,
          topicId,
          moduleId: entry.module.id,
          moduleTitle: entry.module.title,
          topic: topic.title,
          minutes: size,
          part: sizes.length > 1 ? { index: p + 1, of: sizes.length } : null,
          deferred: entry.deferred,
        })
      })
    })
  }
  return blocks
}

/* ---------------------------------- scheduling --------------------------------- */

export interface ScheduledBlock extends PlanBlock {
  date: string
  done: boolean
  /** Planned for an earlier day, not done, so it was moved forward. */
  missed: boolean
  /** The learner pinned it to this date. */
  moved: boolean
  /** Lands after the deadline. */
  afterDeadline: boolean
}

export interface PlanDay {
  date: string
  weekday: number
  studyDay: boolean
  blocks: ScheduledBlock[]
  minutes: number
  doneMinutes: number
  capacity: number
  /** More is planned than the daily minutes (only when the learner pinned blocks onto the day). */
  over: boolean
}

export interface CatchUp {
  blocks: number
  minutes: number
  /** The days these blocks were first planned for. */
  fromDates: string[]
  /** Where they are now. */
  toFirst: string
  toLast: string
}

export interface Schedule {
  days: PlanDay[]
  blocks: ScheduledBlock[]
  remainingBlocks: number
  remainingMinutes: number
  /** Unfinished blocks under "Later" (core first): planned after the rest, outside the deadline check. */
  later: { blocks: number; minutes: number }
  /** Last date with unfinished work, or null when everything is done. */
  lastDate: string | null
  /** Study days from today to `lastDate`: what the work really needs. */
  studyDaysNeeded: number
  /** Study days from today to the deadline, or null without a deadline. */
  studyDaysAvailable: number | null
  afterDeadline: { blocks: number; minutes: number }
  catchUp: CatchUp | null
  /** Unfinished blocks that were first planned for each earlier day, by date. */
  missedByDate: Record<string, number>
  feasible: boolean
}

export interface ScheduleInput {
  /** Ordered blocks (see buildBlocks), already without removed ones. */
  blocks: readonly PlanBlock[]
  /** When each finished block was completed (yyyy-MM-dd). */
  doneOn: Readonly<Record<string, string>>
  moves: Readonly<Record<string, string>>
  today: string
  /** The plan's first day; clamped to today if it is in the future. */
  startDate: string
  deadline: string | null
  dailyMinutes: number
  studyDays: readonly number[]
}

const weekdayOf = (dateKey: string) => fromDateKey(dateKey).getDay()
const MAX_DAYS = 3650

/** Study days between two dates, both included. */
export function countStudyDays(
  from: string,
  to: string,
  studyDays: readonly number[]
): number {
  let n = 0
  let d = from
  for (let i = 0; i < MAX_DAYS && d <= to; i++) {
    if (studyDays.includes(weekdayOf(d))) n++
    d = shiftDateKey(d, 1)
  }
  return n
}

/** The date on which the Nth study day (counting today as day 1 when it is one) falls. */
export function dateOfStudyDay(
  from: string,
  n: number,
  studyDays: readonly number[]
): string {
  let d = from
  let count = 0
  for (let i = 0; i < MAX_DAYS; i++) {
    if (studyDays.includes(weekdayOf(d))) count++
    if (count >= n) return d
    d = shiftDateKey(d, 1)
  }
  return d
}

/**
 * Place blocks one after another on study days, never above the daily minutes (a lone oversized block still
 * gets a day). A block is never placed before its `anchor` date, so finishing early leaves free time instead
 * of pulling tomorrow's work forward.
 */
function place(
  blocks: readonly PlanBlock[],
  anchors: ReadonlyMap<string, string> | null,
  from: string,
  used: Map<string, number>,
  capacity: number,
  studyDays: readonly number[]
): Map<string, string> {
  const placed = new Map<string, string>()
  let cursor = from
  let guard = 0
  for (const b of blocks) {
    const anchor = anchors?.get(b.id)
    if (anchor && anchor > cursor) cursor = anchor
    for (; guard < MAX_DAYS * 4; guard++) {
      const isStudy = studyDays.includes(weekdayOf(cursor))
      const load = used.get(cursor) ?? 0
      if (isStudy && (load === 0 || load + b.minutes <= capacity)) {
        used.set(cursor, load + b.minutes)
        placed.set(b.id, cursor)
        break
      }
      cursor = shiftDateKey(cursor, 1)
    }
  }
  return placed
}

export function schedule(input: ScheduleInput): Schedule {
  const { blocks, doneOn, moves, today, deadline, dailyMinutes, studyDays } =
    input
  const startDate = input.startDate > today ? today : input.startDate
  const capacity = Math.max(1, dailyMinutes)
  const days = studyDays.length ? studyDays : [0, 1, 2, 3, 4, 5, 6]

  // Baseline: the plan as it would run from the start date if nothing had slipped and nothing was moved.
  const baseline = place(blocks, null, startDate, new Map(), capacity, days)

  // Finished blocks stay on the day they were finished; pinned blocks stay where the learner put them.
  const used = new Map<string, number>()
  const dateOf = new Map<string, string>()
  const flags = new Map<string, { moved: boolean }>()
  const open: PlanBlock[] = []
  for (const b of blocks) {
    const finished = doneOn[b.id]
    const pin = moves[b.id]
    if (finished) {
      dateOf.set(b.id, finished)
      used.set(finished, (used.get(finished) ?? 0) + b.minutes)
    } else if (pin && pin >= today) {
      dateOf.set(b.id, pin)
      flags.set(b.id, { moved: true })
      used.set(pin, (used.get(pin) ?? 0) + b.minutes)
    } else {
      open.push(b)
    }
  }
  for (const [id, date] of place(open, baseline, today, used, capacity, days))
    dateOf.set(id, date)

  const scheduled: ScheduledBlock[] = blocks.map((b) => {
    const date = dateOf.get(b.id) ?? today
    const done = Boolean(doneOn[b.id])
    const moved = flags.get(b.id)?.moved ?? false
    const missed = !done && !moved && (baseline.get(b.id) ?? date) < today
    return {
      ...b,
      date,
      done,
      moved,
      missed,
      afterDeadline:
        !done && !b.deferred && deadline !== null && date > deadline,
    }
  })

  // The day list covers the first day of the plan to the last scheduled day.
  const dates = scheduled.map((b) => b.date)
  const first = dates.length ? [startDate, ...dates].sort()[0] : startDate
  const last = dates.length ? [...dates].sort().at(-1)! : startDate
  const dayList: PlanDay[] = []
  for (
    let d = first, i = 0;
    d <= last && i < MAX_DAYS;
    d = shiftDateKey(d, 1), i++
  ) {
    const dayBlocks = scheduled.filter((b) => b.date === d)
    const minutes = dayBlocks.reduce((n, b) => n + b.minutes, 0)
    dayList.push({
      date: d,
      weekday: weekdayOf(d),
      studyDay: days.includes(weekdayOf(d)),
      blocks: dayBlocks,
      minutes,
      doneMinutes: dayBlocks
        .filter((b) => b.done)
        .reduce((n, b) => n + b.minutes, 0),
      capacity,
      over: minutes > capacity,
    })
  }

  // Blocks under "Later" are scheduled after the rest but do not count toward the deadline.
  const unfinished = scheduled.filter((b) => !b.done && !b.deferred)
  const later = scheduled.filter((b) => !b.done && b.deferred)
  const missed = unfinished.filter((b) => b.missed)
  const missedByDate: Record<string, number> = {}
  for (const b of unfinished) {
    const planned = baseline.get(b.id)
    if (planned && planned < today && !b.moved)
      missedByDate[planned] = (missedByDate[planned] ?? 0) + 1
  }
  const lastDate = unfinished.length
    ? unfinished
        .map((b) => b.date)
        .sort()
        .at(-1)!
    : null
  const after = unfinished.filter((b) => b.afterDeadline)

  return {
    days: dayList,
    blocks: scheduled,
    remainingBlocks: unfinished.length,
    remainingMinutes: unfinished.reduce((n, b) => n + b.minutes, 0),
    later: {
      blocks: later.length,
      minutes: later.reduce((n, b) => n + b.minutes, 0),
    },
    lastDate,
    studyDaysNeeded: lastDate ? countStudyDays(today, lastDate, days) : 0,
    studyDaysAvailable:
      deadline && deadline >= today
        ? countStudyDays(today, deadline, days)
        : deadline
          ? 0
          : null,
    afterDeadline: {
      blocks: after.length,
      minutes: after.reduce((n, b) => n + b.minutes, 0),
    },
    catchUp: missed.length
      ? {
          blocks: missed.length,
          minutes: missed.reduce((n, b) => n + b.minutes, 0),
          fromDates: [
            ...new Set(missed.map((b) => baseline.get(b.id)!)),
          ].sort(),
          toFirst: missed.map((b) => b.date).sort()[0],
          toLast: missed
            .map((b) => b.date)
            .sort()
            .at(-1)!,
        }
      : null,
    missedByDate,
    feasible: after.length === 0,
  }
}

/* ----------------------------------- selectors --------------------------------- */

/** Revision is additive, never scheduled ahead: 2 minutes per due item, at most 20% of the day. */
export const REVISION_MINUTES_PER_ITEM = 2
export const REVISION_MAX_SHARE = 0.2

export function revisionBlock(
  dueItems: number,
  dailyMinutes: number
): { items: number; minutes: number } | null {
  if (dueItems <= 0) return null
  const cap = Math.floor(dailyMinutes * REVISION_MAX_SHARE)
  const minutes = Math.min(dueItems * REVISION_MINUTES_PER_ITEM, cap)
  return minutes > 0 ? { items: dueItems, minutes } : null
}

export interface TodayView {
  date: string
  blocks: ScheduledBlock[]
  plannedMinutes: number
  doneMinutes: number
  revision: { items: number; minutes: number } | null
  /** Ring total: the day's blocks plus revision time. */
  ringTotal: number
  ringDone: number
  /** True when today is not one of the learner's study days and has no blocks. */
  restDay: boolean
}

export function todayView(
  s: Schedule,
  today: string,
  dueReviews: number,
  dailyMinutes: number,
  studyDays: readonly number[]
): TodayView {
  const blocks = s.blocks.filter((b) => b.date === today)
  const plannedMinutes = blocks.reduce((n, b) => n + b.minutes, 0)
  const doneMinutes = blocks
    .filter((b) => b.done)
    .reduce((n, b) => n + b.minutes, 0)
  const revision = revisionBlock(dueReviews, dailyMinutes)
  return {
    date: today,
    blocks,
    plannedMinutes,
    doneMinutes,
    revision,
    ringTotal: plannedMinutes + (revision?.minutes ?? 0),
    ringDone: doneMinutes,
    restDay: blocks.length === 0 && !studyDays.includes(weekdayOf(today)),
  }
}

export type DayStatus =
  "done" | "partial" | "missed" | "today" | "upcoming" | "rest" | "empty"

export interface StripDay {
  date: string
  status: DayStatus
  /** A plain-words status, so the strip never relies on colour alone. */
  label: string
  blocks: number
  minutes: number
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

/** A week of days around today, each with a text status. */
export function weekStrip(
  s: Schedule,
  today: string,
  studyDays: readonly number[],
  before = 2,
  span = 7
): StripDay[] {
  const byDate = new Map(s.days.map((d) => [d.date, d]))
  return Array.from({ length: span }, (_, i) => {
    const date = shiftDateKey(today, i - before)
    const day = byDate.get(date)
    const studyDay = studyDays.includes(weekdayOf(date))
    const blocks = day?.blocks ?? []
    const minutes = day?.minutes ?? 0
    const doneAll = blocks.length > 0 && blocks.every((b) => b.done)
    const doneAny = blocks.some((b) => b.done)
    const missed = s.missedByDate[date] ?? 0
    let status: DayStatus
    let label: string
    if (date === today) {
      status = "today"
      label = blocks.length
        ? `Today: ${doneAll ? "all done" : `${plural(blocks.filter((b) => !b.done).length, "block")} to do`}`
        : studyDay
          ? "Today: nothing planned"
          : "Today: rest day"
    } else if (date < today) {
      if (missed > 0) {
        status = "missed"
        label = `${plural(missed, "block")} missed, moved forward`
      } else if (doneAll) {
        status = "done"
        label = "All done"
      } else if (doneAny) {
        status = "partial"
        label = "Partly done"
      } else {
        status = studyDay ? "empty" : "rest"
        label = studyDay ? "Nothing planned" : "Rest day"
      }
    } else if (blocks.length) {
      status = "upcoming"
      label = `${plural(blocks.length, "block")}, ${minutes} min`
    } else {
      status = studyDay ? "empty" : "rest"
      label = studyDay ? "Nothing planned" : "Rest day"
    }
    return { date, status, label, blocks: blocks.length, minutes }
  })
}

/* ------------------------------ topic and module progress ----------------------- */

export interface ModuleTopicProgress {
  topicsDone: number
  topicsTotal: number
}

/** Topics finished in a module. A topic counts only when its own record is complete (all its parts done). */
export function moduleTopicProgress(
  entry: SyllabusEntry,
  completed: (topicId: string) => boolean
): ModuleTopicProgress {
  const topics = entry.module.topicList.filter((t) => t.minutes > 0)
  return {
    topicsDone: topics.filter((t) =>
      completed(topicIdOf(entry.module.id, t.title))
    ).length,
    topicsTotal: topics.length,
  }
}

/**
 * Module completion: half from topics and half from questions when the module has questions, all from
 * topics when it has none. The UI always shows both raw numbers next to this percentage.
 */
export function moduleCompletion(p: {
  topicsDone: number
  topicsTotal: number
  questionsDone: number
  questionsAvailable: number
}): number {
  const topics = p.topicsTotal > 0 ? p.topicsDone / p.topicsTotal : 0
  if (p.questionsAvailable <= 0) return topics
  return 0.5 * topics + 0.5 * (p.questionsDone / p.questionsAvailable)
}

export const todayKey = (d: Date = new Date()) => toDateKey(d)
