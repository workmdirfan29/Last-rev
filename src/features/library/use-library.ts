import { useMemo } from "react"
import { useFullIndex } from "@/hooks/use-content"
import { useLearnerStore } from "@/stores/learner-store"
import type { QuestionIndexEntry } from "@/types/content"
import type { QuestionProgress } from "@/types/learner"
import { selectLibrary, type LibraryLists } from "./lists"

// The sidebar, the page and the picker all ask for the same derivation; compute it once per change.
let last: {
  progress: Record<string, QuestionProgress>
  index: QuestionIndexEntry[]
  result: LibraryLists
} | null = null

function derive(
  progress: Record<string, QuestionProgress>,
  index: QuestionIndexEntry[]
): LibraryLists {
  if (last?.progress === progress && last.index === index) return last.result
  const result = selectLibrary(progress, index, new Date())
  last = { progress, index, result }
  return result
}

/** Live library lists, or null while the question index loads. */
export function useLibrary(): LibraryLists | null {
  const progress = useLearnerStore((s) => s.progress)
  // Curated questions plus the learner's own (written, from their resume, or imported).
  const index = useFullIndex()
  return useMemo(
    () => (index ? derive(progress, index) : null),
    [progress, index]
  )
}
