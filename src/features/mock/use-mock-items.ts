import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { loadQuestion } from "@/services/content/content-service"
import {
  itemFromCustom,
  itemFromResume,
  itemFromQuestion,
  type MockItem,
} from "@/services/mock/items"
import { useLearnerStore } from "@/stores/learner-store"
import type { MockSession } from "@/types/learner"

/** The full questions of a session, by id. Curated ones load from the bank; the learner's own come from the store. */
export function useMockItems(session: MockSession | undefined) {
  const custom = useLearnerStore((s) => s.customQuestions)
  const resume = useLearnerStore((s) => s.resumeQuestions)
  const ids = useMemo(() => session?.questionIds ?? [], [session?.questionIds])
  const customById = useMemo(
    () => new Map(custom.map((c) => [c.id, c])),
    [custom]
  )
  const resumeById = useMemo(
    () => new Map(resume.map((r) => [r.id, r])),
    [resume]
  )
  const curatedIds = ids.filter(
    (id) => !customById.has(id) && !resumeById.has(id)
  )
  const { data, isLoading } = useQuery({
    queryKey: ["mock-items", curatedIds],
    queryFn: async () =>
      (await Promise.all(curatedIds.map((id) => loadQuestion(id)))).flatMap(
        (q) => (q ? [itemFromQuestion(q)] : [])
      ),
    staleTime: Infinity,
    enabled: !!session,
  })
  const items = useMemo(() => {
    const map = new Map<string, MockItem>()
    for (const i of data ?? []) map.set(i.id, i)
    for (const id of ids) {
      const c = customById.get(id)
      if (c) map.set(id, itemFromCustom(c))
      const r = resumeById.get(id)
      if (r) map.set(id, itemFromResume(r))
    }
    return map
  }, [data, ids, customById, resumeById])
  const ready = !isLoading && ids.every((id) => items.has(id))
  return { items, ready }
}
