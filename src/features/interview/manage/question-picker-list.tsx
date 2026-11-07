import { Link } from "react-router"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { getModule } from "@/data/catalog/modules"
import { isCustomQuestionId } from "@/services/content/custom-questions"
import type { QuestionIndexEntry } from "@/types/content"

/** A selectable list of questions (title opens the question; the checkbox is for bulk actions). */
export function QuestionPickerList({
  questions,
  selected,
  onToggle,
  renderAction,
  emptyText,
}: {
  questions: readonly QuestionIndexEntry[]
  selected: ReadonlySet<string>
  onToggle: (id: string) => void
  renderAction: (q: QuestionIndexEntry) => React.ReactNode
  emptyText: string
}) {
  if (questions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        {emptyText}
      </p>
    )
  }
  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-card">
      {questions.map((q) => (
        <li key={q.id} className="flex items-start gap-3 px-4 py-3">
          <Checkbox
            checked={selected.has(q.id)}
            onCheckedChange={() => onToggle(q.id)}
            aria-label={`Select ${q.title}`}
            className="mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <Link
              to={`/interview/question/${q.id}`}
              className="text-sm leading-snug font-medium hover:underline focus-visible:underline"
            >
              {q.title}
            </Link>
            <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {isCustomQuestionId(q.id) && (
                <Badge variant="secondary">Yours</Badge>
              )}
              <span>
                {getModule(q.moduleId)?.title ?? q.moduleId} ·{" "}
                <span className="capitalize">{q.level}</span>
              </span>
            </p>
          </div>
          {renderAction(q)}
        </li>
      ))}
    </ul>
  )
}
