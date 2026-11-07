import {
  BookmarkIcon,
  FlagIcon,
  LibraryIcon,
  NotebookPenIcon,
  RotateCcwIcon,
  type LucideIcon,
} from "lucide-react"
import { isDue } from "@/services/revision/schedule"
import type { QuestionIndexEntry } from "@/types/content"
import type { QuestionProgress } from "@/types/learner"

export type LibraryListId = "all" | "saved" | "difficult" | "revision" | "notes"
export type LibraryFlag = "bookmarked" | "difficult" | "revision"

export interface LibraryListMeta {
  id: LibraryListId
  /** Last URL segment; empty for the "all" list at `/library`. */
  slug: string
  path: string
  title: string
  description: string
  icon: LucideIcon
  /** Flags a row can clear inline in this list. */
  flags: LibraryFlag[]
  empty: { title: string; description: string }
}

/** Single source for the sidebar items, the mobile picker and the page copy. */
export const LIBRARY_LISTS: LibraryListMeta[] = [
  {
    id: "all",
    slug: "",
    path: "/library",
    title: "All saved items",
    description:
      "Everything you've bookmarked, marked difficult, queued for revision or written a note on.",
    icon: LibraryIcon,
    flags: ["bookmarked", "difficult", "revision"],
    empty: {
      title: "Nothing saved yet",
      description:
        "Bookmark a question, mark it difficult, queue it for revision or add a note, and it will be listed here.",
    },
  },
  {
    id: "saved",
    slug: "saved",
    path: "/library/saved",
    title: "Saved",
    description: "Questions you bookmarked to find again quickly.",
    icon: BookmarkIcon,
    flags: ["bookmarked"],
    empty: {
      title: "No bookmarks yet",
      description: "Bookmark a question to find it here quickly.",
    },
  },
  {
    id: "difficult",
    slug: "difficult",
    path: "/library/difficult",
    title: "Difficult",
    description: "Tricky questions you marked so you can drill them later.",
    icon: FlagIcon,
    flags: ["difficult"],
    empty: {
      title: "Nothing marked difficult",
      description: "Mark tricky questions so you can drill them later.",
    },
  },
  {
    id: "revision",
    slug: "revision",
    path: "/library/revision",
    title: "Revision queue",
    description:
      "Questions queued for revision, plus completed ones scheduled for their next review.",
    icon: RotateCcwIcon,
    flags: ["revision"],
    empty: {
      title: "Revision queue is empty",
      description:
        "Completed questions are scheduled automatically (day 1, 3, 7, 14, 30 by default).",
    },
  },
  {
    id: "notes",
    slug: "notes",
    path: "/library/notes",
    title: "My notes",
    description: "Questions you have written a note on.",
    icon: NotebookPenIcon,
    flags: [],
    empty: {
      title: "No notes yet",
      description: "Notes you write on a question appear here.",
    },
  },
]

export const getLibraryList = (slug: string | undefined) =>
  LIBRARY_LISTS.find((l) => l.slug === (slug ?? ""))

/**
 * A question the learner removed from their plan (`QuestionProgress.removed`).
 * Read defensively so a record without the field counts as present.
 */
export const isRemoved = (p: QuestionProgress): boolean =>
  (p as { removed?: boolean }).removed === true

export interface LibraryLists {
  lists: Record<LibraryListId, QuestionIndexEntry[]>
  /** Scheduled reviews that are due now. */
  due: number
}

/**
 * Derive every library list from progress. Removed questions and questions
 * missing from the index are excluded everywhere. "All" is the union of what
 * the learner flagged or noted; items only auto-scheduled after completion
 * appear in the revision queue alone.
 */
export function selectLibrary(
  progress: Record<string, QuestionProgress>,
  index: QuestionIndexEntry[],
  now: Date
): LibraryLists {
  const byId = new Map(index.map((q) => [q.id, q]))
  const live = Object.values(progress).filter(
    (p) => !isRemoved(p) && byId.has(p.questionId)
  )
  const toQuestions = (ps: QuestionProgress[]) =>
    ps.map((p) => byId.get(p.questionId)!)

  const scheduled = live
    .filter((p) => p.completed && p.nextReviewAt)
    .sort((a, b) => a.nextReviewAt!.localeCompare(b.nextReviewAt!))
  const hasNote = (p: QuestionProgress) => p.note.trim().length > 0
  const queued = [
    ...new Map(
      [...scheduled, ...live.filter((p) => p.revision)].map((p) => [
        p.questionId,
        p,
      ])
    ).values(),
  ]

  return {
    lists: {
      all: toQuestions(
        live.filter(
          (p) => p.bookmarked || p.difficult || p.revision || hasNote(p)
        )
      ),
      saved: toQuestions(live.filter((p) => p.bookmarked)),
      difficult: toQuestions(live.filter((p) => p.difficult)),
      revision: toQuestions(queued),
      notes: toQuestions(live.filter(hasNote)),
    },
    due: scheduled.filter((p) => isDue(p, now)).length,
  }
}
