import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { ownQuestionEntries } from "@/services/content/own-questions"
import type { QuestionIndexEntry } from "@/types/content"
import { useLearnerStore } from "@/stores/learner-store"
import {
  countByModule,
  loadModuleQuestions,
  loadQuestion,
  loadQuestionIndex,
} from "@/services/content/content-service"

/** Content is immutable at runtime, so it is cached forever per session. */
const STATIC = { staleTime: Infinity, gcTime: Infinity } as const

export function useQuestionIndex() {
  return useQuery({
    queryKey: ["question-index"],
    queryFn: loadQuestionIndex,
    ...STATIC,
  })
}

/**
 * Curated question counts per module (leaving out questions the learner removed), and
 * how many questions of their own they added, kept separate so a total reads
 * "32 curated + 3 yours".
 */
export function useModuleCounts() {
  const { data, ...rest } = useQuestionIndex()
  const progress = useLearnerStore((s) => s.progress)
  const own = useOwnQuestionEntries()
  const counts = useMemo(
    () =>
      data
        ? countByModule(data.filter((q) => !progress[q.id]?.removed))
        : undefined,
    [data, progress]
  )
  const mine = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of own)
      if (!progress[c.id]?.removed)
        map.set(c.moduleId, (map.get(c.moduleId) ?? 0) + 1)
    return map
  }, [own, progress])
  return { counts, mine, index: data, ...rest }
}

/**
 * The learner's own questions (written by them, made from their resume or imported in a set) as index entries.
 * This is the one place they are merged; every list, count, search and pool starts from here.
 */
export function useOwnQuestionEntries(): QuestionIndexEntry[] {
  const custom = useLearnerStore((s) => s.customQuestions)
  const resume = useLearnerStore((s) => s.resumeQuestions)
  return useMemo(() => ownQuestionEntries(custom, resume), [custom, resume])
}

/** The curated bank plus the learner's own questions, or undefined while the bank loads. */
export function useFullIndex(): QuestionIndexEntry[] | undefined {
  const { data } = useQuestionIndex()
  const own = useOwnQuestionEntries()
  return useMemo(() => (data ? [...data, ...own] : undefined), [data, own])
}

export function useModuleQuestions(moduleId: string) {
  return useQuery({
    queryKey: ["module-questions", moduleId],
    queryFn: () => loadModuleQuestions(moduleId),
    ...STATIC,
  })
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => loadQuestion(id),
    ...STATIC,
  })
}
