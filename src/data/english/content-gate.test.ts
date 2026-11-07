import { describe, expect, it } from "vitest"
import { validateChallenge, validateLessons } from "@/services/english/gate"
import { ENGLISH_CHALLENGE } from "./challenge"
import { ENGLISH_MODULES, DAILY_CATEGORIES } from "./modules"
import { ENGLISH_INDEX } from "./index.generated"
import { contentFileKeys, loadAllLessons } from "./loaders"
import { ITEM_KINDS } from "@/types/english"

/** The gate over the real course content. It passes with no content at all (the first module is authored next). */
describe("the English course", () => {
  it("passes every content rule", async () => {
    const lessons = await loadAllLessons()
    expect(validateLessons(lessons)).toEqual([])
  })

  it("has the generated index up to date (run `pnpm english:index`)", async () => {
    const lessons = await loadAllLessons()
    expect(ENGLISH_INDEX.map((l) => l.id).sort()).toEqual(
      lessons.map((l) => l.id).sort()
    )
    for (const entry of ENGLISH_INDEX) {
      const lesson = lessons.find((l) => l.id === entry.id)!
      expect(entry.itemIds).toEqual(lesson.items.map((i) => i.id))
      expect(entry.itemKinds).toEqual(lesson.items.map((i) => i.kind))
      expect(entry.title).toBe(lesson.title)
      expect(entry.moduleId).toBe(lesson.moduleId)
      for (const k of ITEM_KINDS)
        expect(entry.counts[k]).toBe(
          lesson.items.filter((i) => i.kind === k).length
        )
    }
  })

  it("keeps every lesson in the right file: its module, and for Daily English a declared category", async () => {
    const categories = new Set(DAILY_CATEGORIES.map((c) => c.slug))
    for (const key of contentFileKeys()) {
      const [moduleId, category] = key.split("/")
      expect(
        ENGLISH_MODULES.some((m) => m.id === moduleId),
        key
      ).toBe(true)
      if (category)
        expect(
          categories.has(category),
          `${key} is not a declared Daily English category`
        ).toBe(true)
    }
    for (const entry of ENGLISH_INDEX) {
      const meta = ENGLISH_MODULES.find((m) => m.id === entry.moduleId)!
      expect(entry.category !== "", entry.id).toBe(meta.layout === "folder")
    }
  })

  it("marks modules draft or teacher-reviewed consistently", () => {
    expect(new Set(ENGLISH_MODULES.map((m) => m.id)).size).toBe(
      ENGLISH_MODULES.length
    )
    for (const m of ENGLISH_MODULES) {
      expect(["draft", "teacher-reviewed"]).toContain(m.review)
      if (m.review === "teacher-reviewed") {
        expect(m.reviewer?.trim(), `${m.id} needs a reviewer`).toBeTruthy()
        expect(m.reviewedOn, `${m.id} needs a review date`).toMatch(
          /^\d{4}-\d{2}-\d{2}$/
        )
      }
    }
    expect(DAILY_CATEGORIES).toHaveLength(13)
    expect(new Set(DAILY_CATEGORIES.map((c) => c.slug)).size).toBe(13)
  })

  it("has a challenge that is either empty or exactly 30 valid days built from real lessons and items", async () => {
    const lessons = await loadAllLessons()
    expect(validateChallenge(ENGLISH_CHALLENGE, lessons)).toEqual([])
  })

  it("rejects a challenge that is short, out of order or points at things that do not exist", async () => {
    const lessons = await loadAllLessons()
    const l = lessons.find(
      (x) => x.items.filter((i) => i.kind === "sentence").length >= 4
    )!
    const s = l.items.filter((i) => i.kind === "sentence").map((i) => i.id)
    const day = (n: number) => ({
      day: n,
      lesson: l.id,
      vocab: s.slice(0, 3),
      sentences: s.slice(0, 3),
      speaking: s[3],
      exercise: { lesson: l.id, count: 3 },
    })
    const thirty = Array.from({ length: 30 }, (_, i) => day(i + 1))
    expect(validateChallenge(thirty, lessons)).toEqual([])
    expect(validateChallenge(thirty.slice(0, 29), lessons).join()).toMatch(
      /must have 30/
    )
    expect(
      validateChallenge(
        [thirty[1], ...thirty.slice(2), thirty[0]],
        lessons
      ).join()
    ).toMatch(/in order/)
    expect(
      validateChallenge(
        [{ ...day(1), lesson: "en.nope.nope" }, ...thirty.slice(1)],
        lessons
      ).join()
    ).toMatch(/unknown lesson/)
    expect(
      validateChallenge(
        [{ ...day(1), speaking: "en.x.y.z" }, ...thirty.slice(1)],
        lessons
      ).join()
    ).toMatch(/speaking item/)
    expect(validateChallenge([], lessons)).toEqual([])
  })
})
