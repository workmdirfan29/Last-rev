import { useMemo } from "react"
import { Link, useParams } from "react-router"
import { SearchXIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { getModule } from "@/data/catalog/modules"
import { getRole } from "@/data/catalog/roles"
import { useModuleQuestions, useOwnQuestionEntries } from "@/hooks/use-content"
import { filterQuestions } from "@/services/content/search"
import { isLevelNeutralModule } from "@/utils/module-kind"
import { isResumeModuleId } from "@/types/learner"
import { useLearnerStore } from "@/stores/learner-store"
import { EXPERIENCE_LEVELS, LEVEL_META } from "@/types/content"
import { HR_RELEASE_MIN_QUESTIONS } from "@/data/catalog/module-types"
import { LibraryToolbar } from "./components/library-toolbar"
import { QuestionRow } from "./components/question-row"
import { useRemoveQuestion } from "./use-remove-question"
import { useLibraryFilters } from "./use-library-filters"

export function LibraryPage() {
  const { roleId = "", moduleId = "" } = useParams()
  const mod = getModule(moduleId)
  const role = getRole(roleId)
  const { data: questions, isLoading } = useModuleQuestions(moduleId)
  const progress = useLearnerStore((s) => s.progress)
  const own = useOwnQuestionEntries()
  const removeQuestion = useRemoveQuestion()
  const { filters, update, clear, active } = useLibraryFilters()

  // The module's questions as the learner sees them: curated plus their own, minus what they removed.
  const pool = useMemo(
    () =>
      questions
        ? [
            ...questions.filter((q) => !progress[q.id]?.removed),
            ...own.filter(
              (c) => c.moduleId === moduleId && !progress[c.id]?.removed
            ),
          ]
        : [],
    [questions, own, progress, moduleId]
  )
  const mine =
    pool.length -
    (questions ?? []).filter((q) => !progress[q.id]?.removed).length
  const removedCount = (questions ?? []).filter(
    (q) => progress[q.id]?.removed
  ).length

  const visible = useMemo(
    () =>
      questions
        ? filterQuestions(pool, filters, progress, (id) => getModule(id)?.title)
        : [],
    [questions, pool, filters, progress]
  )
  const topics = useMemo(
    () => [...new Set(pool.map((q) => q.topic))].sort(),
    [pool]
  )

  if (!mod) {
    return (
      <EmptyState
        title="Module not found"
        description="That module isn't in the catalogue."
        action={
          <Button asChild>
            <Link to="/interview">Back to Interview Zone</Link>
          </Button>
        }
      />
    )
  }
  if (isLoading || !questions) return <ScreenLoader />

  const hr = isLevelNeutralModule(moduleId)
  const done = pool.filter((q) => progress[q.id]?.completed).length
  const counts = EXPERIENCE_LEVELS.map((l) => ({
    l,
    n: pool.filter((q) => q.level === l).length,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={role ? `${role.title} · Interview Zone` : "Interview Zone"}
        title={mod.title}
        description={mod.description}
      />

      <section
        className="space-y-3 rounded-xl border border-border bg-card p-4"
        aria-label="Module progress"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span>
            <span className="font-medium tabular-nums">{done}</span> of{" "}
            <span className="tabular-nums">{pool.length}</span> completed
          </span>
          <span className="text-xs text-muted-foreground">
            {isResumeModuleId(moduleId)
              ? "Made from your resume with templates"
              : hr
                ? `${Math.min(pool.length, HR_RELEASE_MIN_QUESTIONS)} of ${HR_RELEASE_MIN_QUESTIONS} ready (goal: at least ${HR_RELEASE_MIN_QUESTIONS})`
                : `${counts
                    .map(
                      ({ l, n }) =>
                        `${LEVEL_META[l].label} ${n}/${LEVEL_META[l].minQuestions}`
                    )
                    .join(" · ")} ready (goal: at least 25 per level)`}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {pool.length - mine} curated{mine > 0 ? ` + ${mine} yours` : ""}
          {removedCount > 0 && (
            <>
              {" "}
              ·{" "}
              <Link
                className="underline underline-offset-4"
                to="/interview/manage?tab=removed"
              >
                {removedCount} removed
              </Link>
            </>
          )}
        </p>
        <Progress
          value={pool.length ? (done / pool.length) * 100 : 0}
          aria-label="Module completion"
        />
      </section>

      {pool.length === 0 && questions.length === 0 ? (
        <EmptyState
          title="No questions in this module yet"
          description="This module is in preparation. Content is added in reviewed batches rather than padded with filler."
          action={
            <Button asChild variant="outline">
              <Link to="/interview">Browse available modules</Link>
            </Button>
          }
        />
      ) : (
        <>
          <LibraryToolbar
            filters={filters}
            topics={topics}
            active={active}
            onChange={update}
            onClear={clear}
            hideLevel={hr}
          />
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Showing {visible.length} of {pool.length}
          </p>
          {visible.length === 0 ? (
            <EmptyState
              icon={SearchXIcon}
              title="No questions match these filters"
              action={
                <Button variant="outline" onClick={clear}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ol className="-mx-1 space-y-0.5">
              {visible.map((q, i) => (
                <QuestionRow
                  key={q.id}
                  q={q}
                  number={i + 1}
                  progress={progress[q.id]}
                  onRemove={(row) => removeQuestion(row.id, row.title)}
                />
              ))}
            </ol>
          )}
        </>
      )}
    </div>
  )
}
