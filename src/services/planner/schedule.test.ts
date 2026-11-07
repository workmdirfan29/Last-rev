import { describe, expect, it } from "vitest"
import { assessFeasibility } from "@/services/curriculum/feasibility"
import { defaultsForRoles } from "@/services/curriculum/relevance"
import {
  prepareCoreFirst,
  resolveSyllabus,
} from "@/services/curriculum/syllabus"
import {
  buildBlocks,
  countStudyDays,
  isShortPart,
  distribute,
  moduleCompletion,
  moduleTopicProgress,
  orderModules,
  revisionBlock,
  schedule,
  todayView,
  topicIdOf,
  topicSlug,
  weekStrip,
  type ScheduleInput,
} from "./schedule"

const TODAY = "2026-11-04" // a Wednesday
const ALL = [0, 1, 2, 3, 4, 5, 6]

const entriesFor = (roleIds: string[], overrides = {}) =>
  resolveSyllabus({
    defaults: defaultsForRoles(roleIds),
    overrides,
    experience: "fresher",
  })
const selectedMinutes = (entries: ReturnType<typeof entriesFor>) =>
  entries.filter((e) => e.selected).reduce((n, e) => n + e.minutes, 0)

function input(
  over: Partial<ScheduleInput> & { roles?: string[]; daily?: number }
): ScheduleInput {
  const daily = over.daily ?? 120
  const blocks =
    over.blocks ??
    buildBlocks(
      orderModules(entriesFor(over.roles ?? ["frontend-developer"])),
      daily
    )
  return {
    blocks,
    doneOn: {},
    moves: {},
    today: TODAY,
    startDate: TODAY,
    deadline: null,
    dailyMinutes: daily,
    studyDays: ALL,
    ...over,
  }
}

describe("distribute", () => {
  it("adds up exactly and follows the weights", () => {
    expect(distribute(100, [1, 1, 1])).toEqual([34, 33, 33])
    expect(distribute(10, [3, 1])).toEqual([8, 2])
    expect(distribute(0, [1, 2])).toEqual([0, 0])
    for (const total of [7, 99, 1234])
      expect(
        distribute(total, [60, 45, 90, 30, 75]).reduce((a, b) => a + b, 0)
      ).toBe(total)
  })
})

describe("blocks and their order", () => {
  it("add up to exactly the hours shown on the review step, for different roles", () => {
    for (const roles of [
      ["frontend-developer"],
      ["java-full-stack"],
      ["data-science"],
      ["frontend-developer", "java-developer"],
    ]) {
      const entries = entriesFor(roles)
      const blocks = buildBlocks(orderModules(entries), 120)
      expect(
        blocks.reduce((n, b) => n + b.minutes, 0),
        roles.join()
      ).toBe(selectedMinutes(entries))
    }
  })

  it("has unique ids, valid topic slugs and splits a topic longer than a day into labelled parts", () => {
    const blocks = buildBlocks(
      orderModules(entriesFor(["frontend-developer"])),
      30
    )
    expect(new Set(blocks.map((b) => b.id)).size).toBe(blocks.length)
    const parts = blocks.filter((b) => b.part)
    expect(parts.length).toBeGreaterThan(0)
    for (const b of blocks) expect(b.minutes).toBeLessThanOrEqual(30)
    const p = parts[0]
    expect(p.id).toMatch(/-p\d+$/)
    expect(p.part!.index).toBeLessThanOrEqual(p.part!.of)
    expect(p.topicId).toBe(topicIdOf(p.moduleId, p.topic))
    // the parts of one topic add up to the topic
    const same = blocks.filter((b) => b.topicId === p.topicId)
    expect(same).toHaveLength(p.part!.of)
    expect(topicSlug("Props & state")).toBe("props-and-state")
  })

  it("puts prerequisites first and core before recommended before optional, with 'Later' last", () => {
    const entries = entriesFor(["frontend-developer"], {
      "react-native": { selected: true },
    })
    const order = orderModules(entries).map((e) => e.module.id)
    for (const e of entries.filter((x) => x.selected)) {
      const at = order.indexOf(e.module.id)
      for (const pre of e.module.prerequisites)
        if (order.includes(pre))
          expect(
            order.indexOf(pre),
            `${pre} before ${e.module.id}`
          ).toBeLessThan(at)
    }
    expect(order.indexOf("javascript")).toBeLessThan(order.indexOf("react"))
    expect(order.indexOf("react")).toBeLessThan(order.indexOf("react-hooks"))
    // a recommended module never comes before every core module (core goes first), apart from prerequisites
    const firstRecommended = order.findIndex(
      (id) => entries.find((e) => e.module.id === id)!.tier === "recommended"
    )
    const lastCore = order
      .map((id) => entries.find((e) => e.module.id === id)!.tier)
      .lastIndexOf("core")
    expect(firstRecommended).toBeGreaterThan(-1)
    expect(lastCore).toBeGreaterThan(-1)

    const later = prepareCoreFirst({}, entries)
    const laterOrder = orderModules(entriesFor(["frontend-developer"], later))
    const deferredAt = laterOrder.findIndex((e) => e.deferred)
    expect(
      laterOrder.slice(deferredAt).every((e) => e.deferred || e.core)
    ).toBe(true) // only prerequisites of Later modules may follow a Later one
  })
})

describe("scheduling", () => {
  it("fills each day up to the daily minutes, keeps blocks in order, and schedules every block", () => {
    const i = input({})
    const s = schedule(i)
    expect(s.blocks).toHaveLength(i.blocks.length)
    expect(s.days[0].date).toBe(TODAY)
    for (const d of s.days) expect(d.minutes, d.date).toBeLessThanOrEqual(120)
    const order = s.blocks.map((b) => b.id)
    expect(order).toEqual(i.blocks.map((b) => b.id))
    const dates = s.blocks.map((b) => b.date)
    expect(dates).toEqual([...dates].sort())
    expect(s.remainingMinutes).toBe(i.blocks.reduce((n, b) => n + b.minutes, 0))
  })

  it("skips days the learner does not study, and counts study days not calendar days", () => {
    const weekdays = [1, 2, 3, 4, 5]
    const s = schedule(input({ studyDays: weekdays }))
    for (const b of s.blocks)
      expect(weekdays).toContain(new Date(b.date + "T00:00:00").getDay())
    expect(countStudyDays("2026-11-02", "2026-11-08", weekdays)).toBe(5)
    expect(countStudyDays("2026-11-02", "2026-11-08", ALL)).toBe(7)
    expect(s.studyDaysNeeded).toBeGreaterThan(0)
  })

  it("keeps finished blocks on the day they were finished and counts them against that day", () => {
    const base = input({})
    const first = base.blocks.slice(0, 2)
    const s = schedule({
      ...base,
      doneOn: { [first[0].id]: TODAY, [first[1].id]: TODAY },
    })
    const today = s.days.find((d) => d.date === TODAY)!
    expect(today.blocks.filter((b) => b.done).map((b) => b.id)).toEqual(
      first.map((b) => b.id)
    )
    // open blocks only fill what is left of the day after the finished ones (finished work may itself exceed a day)
    const open = today.blocks
      .filter((b) => !b.done)
      .reduce((n, b) => n + b.minutes, 0)
    expect(today.doneMinutes + open).toBeLessThanOrEqual(
      Math.max(120, today.doneMinutes)
    )
    expect(s.remainingMinutes).toBe(
      base.blocks.reduce((n, b) => n + b.minutes, 0) -
        first[0].minutes -
        first[1].minutes
    )
  })

  it("redistributes missed days over the days ahead and says what moved, dropping nothing", () => {
    const base = input({ startDate: "2026-10-30" }) // five days ago, nothing done
    const s = schedule(base)
    expect(s.catchUp).not.toBeNull()
    expect(s.catchUp!.fromDates[0]).toBe("2026-10-30")
    expect(s.catchUp!.blocks).toBeGreaterThan(0)
    expect(s.catchUp!.toFirst >= TODAY).toBe(true)
    expect(s.blocks.every((b) => b.date >= TODAY)).toBe(true) // nothing is left in the past
    expect(s.blocks.some((b) => b.missed)).toBe(true)
    expect(s.remainingMinutes).toBe(
      base.blocks.reduce((n, b) => n + b.minutes, 0)
    ) // never silently dropped
    expect(Object.keys(s.missedByDate).sort()[0]).toBe("2026-10-30")
  })

  it("has no catch-up when the plan starts today", () => {
    expect(schedule(input({})).catchUp).toBeNull()
  })

  it("pins a manually moved block to its date and packs the others around it", () => {
    const base = input({})
    const target = base.blocks[0]
    const moved = schedule({ ...base, moves: { [target.id]: "2026-11-10" } })
    const b = moved.blocks.find((x) => x.id === target.id)!
    expect(b).toMatchObject({ date: "2026-11-10", moved: true, missed: false })
    expect(
      moved.days.find((d) => d.date === "2026-11-10")!.blocks.map((x) => x.id)
    ).toContain(target.id)
    // a move into the past is ignored (the picker does not allow it)
    const stale = schedule({ ...base, moves: { [target.id]: "2026-10-01" } })
    expect(stale.blocks.find((x) => x.id === target.id)!.moved).toBe(false)
  })

  it("reports an infeasible deadline with the days it really needs, flags what lands after it, and never compresses minutes", () => {
    const base = input({ deadline: "2026-11-10" })
    const s = schedule(base)
    expect(s.feasible).toBe(false)
    expect(s.studyDaysAvailable).toBe(7)
    expect(s.studyDaysNeeded).toBeGreaterThan(s.studyDaysAvailable!)
    expect(s.afterDeadline.blocks).toBeGreaterThan(0)
    expect(s.afterDeadline.minutes).toBeLessThan(s.remainingMinutes)
    expect(
      s.blocks
        .filter((b) => b.afterDeadline)
        .every((b) => b.date > "2026-11-10")
    ).toBe(true)
    expect(
      s.blocks
        .filter((b) => !b.afterDeadline)
        .every((b) => b.date <= "2026-11-10")
    ).toBe(true)
    expect(s.remainingMinutes).toBe(
      base.blocks.reduce((n, b) => n + b.minutes, 0)
    )
  })

  it("is feasible when the deadline is far enough away", () => {
    const s = schedule(input({ deadline: "2027-12-31" }))
    expect(s.feasible).toBe(true)
    expect(s.afterDeadline).toEqual({ blocks: 0, minutes: 0 })
  })

  it("differs between roles: different syllabuses give different plans", () => {
    const fe = schedule(input({ roles: ["frontend-developer"] }))
    const jfs = schedule(input({ roles: ["java-full-stack"] }))
    expect(jfs.remainingMinutes).toBeGreaterThan(fe.remainingMinutes)
    expect(jfs.studyDaysNeeded).toBeGreaterThan(fe.studyDaysNeeded)
  })
})

describe("today and the week", () => {
  it("shows today's blocks with done minutes, and revision as an additive, capped block", () => {
    const base = input({})
    const first = base.blocks[0]
    const s = schedule({ ...base, doneOn: { [first.id]: TODAY } })
    const view = todayView(s, TODAY, 3, 120, ALL)
    expect(view.blocks.length).toBeGreaterThan(0)
    expect(view.doneMinutes).toBe(first.minutes)
    expect(view.revision).toEqual({ items: 3, minutes: 6 })
    expect(view.ringTotal).toBe(view.plannedMinutes + 6)
    expect(view.ringDone).toBe(view.doneMinutes)
    // never scheduled ahead: the blocks do not change when revision is due
    expect(todayView(s, TODAY, 0, 120, ALL).blocks).toEqual(view.blocks)
    expect(revisionBlock(100, 120)).toEqual({ items: 100, minutes: 24 }) // capped at 20% of the day
    expect(revisionBlock(0, 120)).toBeNull()
    expect(revisionBlock(5, 4)).toBeNull() // a day too short to reserve even a minute
  })

  it("flags a rest day", () => {
    const s = schedule(input({ studyDays: [1, 2, 4, 5] })) // no Wednesday
    const view = todayView(s, TODAY, 0, 120, [1, 2, 4, 5])
    expect(view.blocks).toHaveLength(0)
    expect(view.restDay).toBe(true)
  })

  it("gives every day of the strip a text status, including missed days", () => {
    const base = input({ startDate: "2026-11-02" })
    const s = schedule(base)
    const strip = weekStrip(s, TODAY, ALL)
    expect(strip).toHaveLength(7)
    expect(strip.map((d) => d.date)[0]).toBe("2026-11-02")
    expect(strip.find((d) => d.date === TODAY)!.status).toBe("today")
    const past = strip.filter((d) => d.date < TODAY)
    expect(past.every((d) => d.status === "missed")).toBe(true)
    for (const d of strip) expect(d.label.length).toBeGreaterThan(3)
    expect(
      strip.filter((d) => d.date > TODAY).every((d) => d.status === "upcoming")
    ).toBe(true)
  })
})

describe("module progress", () => {
  it("counts a topic only when its own record is complete, and blends topics and questions only when questions exist", () => {
    const entry = entriesFor(["frontend-developer"]).find(
      (e) => e.module.id === "react"
    )!
    const done = new Set([
      topicIdOf("react", "JSX"),
      topicIdOf("react", "Components"),
    ])
    expect(moduleTopicProgress(entry, (id) => done.has(id))).toEqual({
      topicsDone: 2,
      topicsTotal: entry.module.topicList.length,
    })
    expect(
      moduleCompletion({
        topicsDone: 5,
        topicsTotal: 10,
        questionsDone: 0,
        questionsAvailable: 0,
      })
    ).toBeCloseTo(0.5)
    expect(
      moduleCompletion({
        topicsDone: 5,
        topicsTotal: 10,
        questionsDone: 8,
        questionsAvailable: 8,
      })
    ).toBeCloseTo(0.75)
    expect(
      moduleCompletion({
        topicsDone: 0,
        topicsTotal: 10,
        questionsDone: 4,
        questionsAvailable: 8,
      })
    ).toBeCloseTo(0.25)
    expect(
      moduleCompletion({
        topicsDone: 0,
        topicsTotal: 0,
        questionsDone: 0,
        questionsAvailable: 0,
      })
    ).toBe(0)
  })
})

describe("full days: the stream is cut into days of exactly the daily minutes", () => {
  const sum = (xs: { minutes: number }[]) =>
    xs.reduce((n, b) => n + b.minutes, 0)
  const entry = (minutes: number) => ({
    ...entriesFor(["frontend-developer"]).find((e) => e.selected)!,
    minutes,
  })

  it("1,000 minutes at 120 a day is exactly 9 study days, every day full and the last day 40", () => {
    const blocks = buildBlocks([entry(1000)], 120)
    expect(sum(blocks)).toBe(1000)
    const s = schedule(input({ blocks }))
    expect(s.studyDaysNeeded).toBe(9)
    const loads = s.days.map((d) => d.minutes)
    expect(loads).toEqual([120, 120, 120, 120, 120, 120, 120, 120, 40])
    // a topic that straddles a day boundary is split there and labelled
    const parts = blocks.filter((b) => b.part)
    expect(parts.length).toBeGreaterThan(0)
    for (const b of parts) {
      expect(b.id).toBe(`${b.topicId}-p${b.part!.index}`)
      expect(b.part!.index).toBeLessThanOrEqual(b.part!.of)
      expect(blocks.filter((x) => x.topicId === b.topicId)).toHaveLength(
        b.part!.of
      )
    }
  })

  it("needs ceil(total / daily) study days whatever the syllabus and pace, as the review step says", () => {
    for (const roles of [
      ["frontend-developer"],
      ["java-full-stack"],
      ["data-science"],
      ["frontend-developer", "java-developer"],
    ])
      for (const daily of [45, 90, 120, 200, 480]) {
        const entries = entriesFor(roles)
        const total = selectedMinutes(entries)
        const s = schedule(
          input({ blocks: buildBlocks(orderModules(entries), daily), daily })
        )
        const min = assessFeasibility({
          totalMinutes: total,
          coreMinutes: 0,
          dailyMinutes: daily,
          targetDays: null,
        }).minimumDays
        expect(s.studyDaysNeeded, `${roles} @ ${daily}`).toBe(min)
        // every day but the last is full
        for (const d of s.days.slice(0, -1))
          expect(d.minutes, `${roles} @ ${daily} ${d.date}`).toBe(daily)
      }
  })

  it("leaves 'Later' modules out of the deadline check but still plans them after the rest", () => {
    const entries = resolveSyllabus({
      defaults: defaultsForRoles(["frontend-developer"]),
      overrides: {},
      experience: "fresher",
    })
    const core = prepareCoreFirst({}, entries)
    const coreEntries = resolveSyllabus({
      defaults: defaultsForRoles(["frontend-developer"]),
      overrides: core,
      experience: "fresher",
    })
    const now = coreEntries
      .filter((e) => e.selected && !e.deferred)
      .reduce((n, e) => n + e.minutes, 0)
    const s = schedule(
      input({ blocks: buildBlocks(orderModules(coreEntries), 120) })
    )
    expect(s.later.minutes).toBeGreaterThan(0)
    expect(s.remainingMinutes).toBe(now)
    expect(s.studyDaysNeeded).toBe(Math.ceil(now / 120))
  })

  it("keeps pins and moves working when blocks are split", () => {
    const blocks = buildBlocks([entry(1000)], 120)
    const part = blocks.find((b) => b.part)!
    const s = schedule(input({ blocks, moves: { [part.id]: "2026-11-20" } }))
    const placed = s.blocks.find((b) => b.id === part.id)!
    expect(placed).toMatchObject({ date: "2026-11-20", moved: true })
    expect(s.remainingMinutes).toBe(1000)
    // the others still keep their order and never exceed a day (other than the pinned day, which is the learner's call)
    for (const d of s.days.filter((d) => d.date !== "2026-11-20"))
      expect(d.minutes).toBeLessThanOrEqual(120)
  })

  it("never re-splits finished parts: sizes and ids depend only on the syllabus and the daily time", () => {
    const blocks = buildBlocks([entry(1000)], 120)
    const doneIds = blocks.slice(0, 4).map((b) => b.id)
    const doneOn = Object.fromEntries(doneIds.map((id) => [id, TODAY]))
    // tomorrow, with progress, days missed and a block removed: the very same parts exist
    const again = buildBlocks([entry(1000)], 120)
    expect(again.map((b) => [b.id, b.minutes])).toEqual(
      blocks.map((b) => [b.id, b.minutes])
    )
    const s = schedule(
      input({ blocks: again, doneOn, startDate: "2026-11-01" })
    )
    for (const id of doneIds) {
      const b = s.blocks.find((x) => x.id === id)!
      expect(b.done).toBe(true)
      expect(b.minutes).toBe(blocks.find((x) => x.id === id)!.minutes)
      expect(b.date).toBe(TODAY)
    }
    // removing a later block leaves the cuts of every other block where they were
    const gone = blocks[blocks.length - 3]
    const withoutOne = buildBlocks([entry(1000)], 120, new Set([gone.id]))
    expect(withoutOne.map((b) => [b.id, b.minutes])).toEqual(
      blocks.filter((b) => b.id !== gone.id).map((b) => [b.id, b.minutes])
    )
  })

  it("does not pull tomorrow's work into the time freed by finishing early", () => {
    const blocks = buildBlocks([entry(1000)], 120)
    const todayIds = schedule(input({ blocks })).blocks.filter(
      (b) => b.date === TODAY
    )
    // finish only part of today's work: the rest of today stays free, tomorrow stays tomorrow
    const first = todayIds[0]
    const s = schedule(input({ blocks, doneOn: { [first.id]: TODAY } }))
    const base = schedule(input({ blocks }))
    for (const b of s.blocks.filter((x) => !x.done))
      expect(b.date, b.id).toBe(base.blocks.find((x) => x.id === b.id)!.date)
    // and finishing a whole day's worth early does not shorten the plan
    const doneAll = Object.fromEntries(todayIds.map((b) => [b.id, TODAY]))
    const s2 = schedule(input({ blocks, doneOn: doneAll }))
    expect(s2.days.find((d) => d.date === shiftDay(TODAY, 1))!.minutes).toBe(
      120
    )
  })
})

const shiftDay = (key: string, n: number) => {
  const d = new Date(key + "T00:00:00")
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

describe("short parts", () => {
  it("are split pieces under 15 minutes, never a whole topic, and stay in stream order next to their sibling", () => {
    const entries = entriesFor(["frontend-developer"])
    const blocks = buildBlocks(orderModules(entries), 120)
    const short = blocks.filter(isShortPart)
    expect(short.length).toBeGreaterThan(0)
    for (const b of short) {
      expect(b.part).not.toBeNull()
      expect(b.minutes).toBeLessThan(15)
    }
    expect(blocks.filter((b) => !b.part).every((b) => !isShortPart(b))).toBe(
      true
    )
    // a part sits directly beside its sibling in the plan's order
    for (const b of short) {
      const i = blocks.findIndex((x) => x.id === b.id)
      const neighbours = [blocks[i - 1], blocks[i + 1]].filter(Boolean)
      expect(neighbours.some((n) => n.topicId === b.topicId)).toBe(true)
    }
  })
})
