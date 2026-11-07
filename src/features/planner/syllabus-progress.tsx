import { useMemo } from "react"
import { Link } from "react-router"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { DOMAIN_IDS, DOMAIN_LABEL } from "@/data/catalog/module-types"
import { useFullIndex } from "@/hooks/use-content"
import { questionStatsLookup } from "@/services/curriculum/progress"
import {
  moduleCompletion,
  moduleTopicProgress,
} from "@/services/planner/schedule"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { moduleProgress } from "@/services/study/module-progress"
import { useLearnerStore } from "@/stores/learner-store"
import type { Plan } from "./use-plan"

/**
 * Progress through the whole syllabus, by technology area, with one row per selected module. Every row
 * shows both raw numbers (topics done, questions done of those ready) next to the blended percentage.
 */
export function SyllabusProgress({
  plan,
  libraryRoleId,
}: {
  plan: Plan
  libraryRoleId?: string
}) {
  const progress = useLearnerStore((s) => s.progress)
  const attempts = useLearnerStore((s) => s.quizAttempts)
  const full = useFullIndex()
  const stats = useMemo(() => {
    const index = (full ?? []).filter((q) => !progress[q.id]?.removed)
    return questionStatsLookup(index, progress)
  }, [full, progress])

  const rows = useMemo(
    () =>
      plan.entries
        .filter((e) => e.selected)
        .map((entry) => {
          const t = moduleTopicProgress(
            entry,
            (id) => progress[id]?.completed === true
          )
          const q = stats(entry.module.id)
          // In the Study Path, lessons add practice and quizzes to the module's completion (equal parts).
          const study =
            plan.mode === "study" &&
            LESSON_INDEX.some((l) => l.moduleId === entry.module.id)
              ? moduleProgress(entry.module, LESSON_INDEX, progress, attempts, {
                  done: q.completed,
                  available: q.available,
                })
              : null
          return {
            entry,
            ...t,
            questionsDone: q.completed,
            questionsAvailable: q.available,
            study,
          }
        }),
    [plan.entries, plan.mode, progress, attempts, stats]
  )
  const groups = DOMAIN_IDS.map((domainId) => ({
    domainId,
    rows: rows.filter((r) => r.entry.module.domainId === domainId),
  })).filter((g) => g.rows.length > 0)
  const totalTopics = rows.reduce((n, r) => n + r.topicsTotal, 0)
  const doneTopics = rows.reduce((n, r) => n + r.topicsDone, 0)

  if (groups.length === 0) return null

  return (
    <section aria-labelledby="syllabus-progress-heading" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="syllabus-progress-heading" className="text-sm font-medium">
          Syllabus progress by area
        </h2>
        <p className="text-xs text-muted-foreground tabular-nums">
          {doneTopics} of {totalTopics} topics done
        </p>
      </div>
      <Accordion
        type="multiple"
        className="rounded-xl border border-border bg-card px-3 sm:px-4"
      >
        {groups.map(({ domainId, rows: list }) => {
          const done = list.reduce((n, r) => n + r.topicsDone, 0)
          const total = list.reduce((n, r) => n + r.topicsTotal, 0)
          return (
            <AccordionItem key={domainId} value={domainId}>
              <AccordionTrigger>
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-medium">{DOMAIN_LABEL[domainId]}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {list.length} modules · {done} of {total} topics
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="divide-y divide-border">
                  {list.map((r) => {
                    const pct = Math.round(
                      (r.study ? r.study.percent : moduleCompletion(r)) * 100
                    )
                    const library =
                      libraryRoleId &&
                      (r.questionsAvailable > 0 ||
                        r.entry.module.contentStatus !== "planned")
                    return (
                      <li
                        key={r.entry.module.id}
                        className="space-y-1.5 py-2.5"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <span className="text-sm font-medium">
                            {r.entry.module.title}
                          </span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {pct}%
                          </span>
                        </div>
                        <Progress
                          value={pct}
                          aria-label={`${r.entry.module.title} progress`}
                        />
                        <p className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                          <span>
                            {r.topicsDone} of {r.topicsTotal} topics
                          </span>
                          {r.study && (
                            <span>
                              Lessons {r.study.lessons.done} of{" "}
                              {r.study.lessons.total} · assignment ticks{" "}
                              {r.study.assignments.done} of{" "}
                              {r.study.assignments.total} · checks passed{" "}
                              {r.study.checks.passed} of {r.study.checks.total}
                            </span>
                          )}
                          <span>
                            {r.questionsAvailable > 0
                              ? `${r.questionsDone} of ${r.questionsAvailable} questions`
                              : "no questions yet"}
                          </span>
                          {library ? (
                            <Link
                              className="underline underline-offset-4"
                              to={`/interview/${libraryRoleId}/${r.entry.module.id}`}
                            >
                              Questions ready: {r.questionsAvailable}
                            </Link>
                          ) : libraryRoleId ? (
                            <span>Questions ready: {r.questionsAvailable}</span>
                          ) : null}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </section>
  )
}
