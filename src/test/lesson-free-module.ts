import { MODULES } from "@/data/catalog/modules"

/**
 * A module that has topics but no lesson yet, found from the data. Tests of the "no lessons" states use this
 * instead of naming a module, so they keep holding as lessons are written. It is null once every module has
 * lessons, and then those tests have nothing left to show.
 */
export function lessonFreeModule() {
  const m = MODULES.find(
    (x) => x.lessons.length === 0 && x.topicList.some((t) => t.minutes > 0)
  )
  if (!m) return null
  return {
    id: m.id,
    title: m.title,
    topic: m.topicList.find((t) => t.minutes > 0)!.title,
  }
}
