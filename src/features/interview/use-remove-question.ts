import { useCallback } from "react"
import { toast } from "sonner"
import { useLearnerStore } from "@/stores/learner-store"

/**
 * Take a question out of the learner's prep, with an Undo toast. Removal only
 * flags the question: its notes, confidence and progress are untouched, so
 * restoring brings everything back.
 */
export function useRemoveQuestion() {
  const setRemoved = useLearnerStore((s) => s.setQuestionRemoved)
  return useCallback(
    (questionId: string, title: string) => {
      void setRemoved(questionId, true)
      toast(`Removed from your prep: ${title}`, {
        description:
          "Your notes are kept. You can restore it in Manage my prep.",
        action: {
          label: "Undo",
          onClick: () => void setRemoved(questionId, false),
        },
      })
    },
    [setRemoved]
  )
}
