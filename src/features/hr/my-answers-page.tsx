import { useMemo, useState } from "react"
import { Link } from "react-router"
import { SearchIcon } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MODULE_BY_ID } from "@/data/catalog/modules"
import { STAR_FIELDS } from "@/data/hr/guidance"
import { useQuestionIndex } from "@/hooks/use-content"
import { useLearnerStore } from "@/stores/learner-store"
import { AnswerCard } from "./answer-card"

/** `/hr/answers`: every STAR answer you saved, grouped by category, searchable. */
export function MyAnswersPage() {
  const answers = useLearnerStore((s) => s.hrAnswers)
  const { data: index } = useQuestionIndex()
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()

  const titleOf = useMemo(
    () => new Map((index ?? []).map((e) => [e.id, e.title])),
    [index]
  )
  const shown = useMemo(
    () =>
      answers
        .filter((a) => {
          if (q === "") return true
          const hay = [
            a.title,
            titleOf.get(a.questionId) ?? "",
            ...STAR_FIELDS.map((g) => a[g.field]),
          ]
            .join(" ")
            .toLowerCase()
          return hay.includes(q)
        })
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [answers, q, titleOf]
  )
  const groups = useMemo(() => {
    const byModule = new Map<string, typeof shown>()
    for (const a of shown) {
      const moduleId = a.questionId.split(".")[0]
      byModule.set(moduleId, [...(byModule.get(moduleId) ?? []), a])
    }
    return [...byModule.entries()]
  }, [shown])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="HR interview"
        title="My answers"
        description="The STAR answers you wrote. They are stored on this device and included in your export. Nothing here is marked or judged."
        actions={
          <Button asChild variant="outline">
            <Link to="/hr">All categories</Link>
          </Button>
        }
      />

      {answers.length === 0 ? (
        <EmptyState
          title="You have not saved any answers yet"
          description="Open an HR question, write your answer in the four STAR parts and save it. It will appear here."
          action={
            <Button asChild>
              <Link to="/hr">Start with a category</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="relative min-w-0 sm:max-w-sm">
            <SearchIcon
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              aria-label="Search my answers"
              placeholder="Search my answers"
              className="ps-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <p
            role="status"
            aria-live="polite"
            className="text-xs text-muted-foreground"
          >
            Showing {shown.length} of {answers.length}{" "}
            {answers.length === 1 ? "answer" : "answers"}
          </p>
          {shown.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No answer matches "{query}".
            </p>
          )}
          {groups.map(([moduleId, list]) => (
            <section
              key={moduleId}
              aria-labelledby={`cat-${moduleId}`}
              className="space-y-3"
            >
              <h2 id={`cat-${moduleId}`} className="lr-eyebrow">
                {MODULE_BY_ID.get(moduleId)?.title ?? moduleId}
              </h2>
              <ul className="space-y-3">
                {list.map((a) => (
                  <li key={a.id}>
                    <AnswerCard
                      answer={a}
                      questionTitle={titleOf.get(a.questionId) ?? "Question"}
                      questionHref={`/interview/question/${a.questionId}`}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
