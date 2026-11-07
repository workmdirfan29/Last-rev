import { useMemo } from "react"
import { Link } from "react-router"
import { InterviewEnglishLink } from "@/features/english/interview-english-link"
import { LockIcon, NotebookPenIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { HR_RELEASE_MIN_QUESTIONS } from "@/data/catalog/module-types"
import { MODULE_BY_ID } from "@/data/catalog/modules"
import { HR_AUDIENCE_NOTE, HR_MODULE_IDS } from "@/data/catalog/modules/hr"
import { useModuleCounts } from "@/hooks/use-content"
import { defaultsForRoles, TIER_LABEL } from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import { useLearnerStore } from "@/stores/learner-store"

/** `/hr`: the 20 HR interview categories, with your progress and your saved answers. */
export function HrHomePage() {
  const profile = useLearnerStore((s) => s.profile)
  const progress = useLearnerStore((s) => s.progress)
  const answers = useLearnerStore((s) => s.hrAnswers)
  const { counts, index } = useModuleCounts()
  const roleId =
    profile?.primaryRole ?? profile?.selectedRoles[0] ?? "frontend-developer"

  const entries = useMemo(
    () =>
      new Map(
        resolveSyllabus({
          defaults: defaultsForRoles(profile?.selectedRoles ?? []),
          overrides: profile?.syllabusOverrides ?? {},
          experience: profile?.experience ?? "fresher",
        }).map((e) => [e.module.id, e])
      ),
    [profile]
  )
  const doneByModule = useMemo(() => {
    const map = new Map<string, number>()
    for (const q of index ?? [])
      if (progress[q.id]?.completed && !progress[q.id]?.removed)
        map.set(q.moduleId, (map.get(q.moduleId) ?? 0) + 1)
    return map
  }, [index, progress])

  if (!counts) return <ScreenLoader />
  const started = HR_MODULE_IDS.filter(
    (id) => (doneByModule.get(id) ?? 0) > 0
  ).length
  const withAnswers = new Set(answers.map((a) => a.questionId.split(".")[0]))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interview Prep"
        title="HR interview"
        description="Twenty categories of HR questions. For each question you see why HR asks it, write and save your own STAR answer, then compare it with a sample once you have tried. Nothing here judges your answer: you do the self-check."
        actions={
          <Button asChild variant="outline">
            <Link to="/hr/answers">
              <NotebookPenIcon /> My answers ({answers.length})
            </Link>
          </Button>
        }
      />

      <p className="text-sm text-muted-foreground" role="status">
        {started} of {HR_MODULE_IDS.length} categories started ·{" "}
        {answers.length} {answers.length === 1 ? "answer" : "answers"} saved
      </p>

      <InterviewEnglishLink />

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {HR_MODULE_IDS.map((id) => {
          const m = MODULE_BY_ID.get(id)!
          const total = counts.get(id)?.total ?? 0
          const done = doneByModule.get(id) ?? 0
          const entry = entries.get(id)
          const note = HR_AUDIENCE_NOTE[id]
          const body = (
            <>
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-medium">{m.title}</h2>
                {total === 0 ? (
                  <Badge variant="outline" className="shrink-0">
                    <LockIcon aria-hidden /> In preparation
                  </Badge>
                ) : entry?.selected && entry.tier ? (
                  <Badge variant="secondary" className="shrink-0">
                    {TIER_LABEL[entry.tier]}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="shrink-0">
                    {entry?.removed ? "Removed" : "Optional"}
                  </Badge>
                )}
              </div>
              <p className="line-clamp-2 text-xs/relaxed text-muted-foreground">
                {m.description}
              </p>
              {note && <p className="text-xs font-medium">{note}</p>}
              {total > 0 && (
                <div className="mt-auto space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {total < HR_RELEASE_MIN_QUESTIONS
                        ? `${total} of ${HR_RELEASE_MIN_QUESTIONS} ready`
                        : `${total} questions ready`}
                      {withAnswers.has(id) ? " · you have saved answers" : ""}
                    </span>
                    <span className="tabular-nums">
                      {done}/{total}
                    </span>
                  </div>
                  <Progress
                    value={(done / total) * 100}
                    aria-label={`${m.title} progress`}
                  />
                </div>
              )}
            </>
          )
          return (
            <li key={id}>
              {total > 0 ? (
                <Link
                  to={`/interview/${roleId}/${id}`}
                  className="flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {body}
                </Link>
              ) : (
                <div
                  className="flex h-full flex-col gap-2 rounded-xl border border-dashed border-border p-4 opacity-70"
                  aria-disabled="true"
                >
                  {body}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
