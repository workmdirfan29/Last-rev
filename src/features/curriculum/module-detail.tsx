import { lessonCoverage, lessonCoverageText } from "@/services/lessons/coverage"
import { useState } from "react"
import { Link } from "react-router"
import { TerminalSquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CONTENT_STATUS_LABEL } from "@/data/catalog/module-types"
import { getModule } from "@/data/catalog/modules"
import { skillsForModule } from "@/data/curriculum/skills"
import { TIME_MODEL_NOTE } from "@/data/curriculum/time-model"
import type { QuestionStats } from "@/services/curriculum/progress"
import type { SyllabusEntry } from "@/services/curriculum/syllabus"
import { toHours } from "@/services/curriculum/time"
import { useLearnerStore } from "@/stores/learner-store"
import { LEVEL_META } from "@/types/content"

const LEVELS = ["fresher", "intermediate", "advanced"] as const

/** The expanded view of one module: topics, questions, lessons, assignments, and the learner's own time. */
export function ModuleDetail({
  entry,
  stats,
  knownSkillIds,
  onCustomMinutes,
  linuxPracticeLink = false,
}: {
  entry: SyllabusEntry
  stats: QuestionStats
  knownSkillIds: ReadonlySet<string>
  /** Omit to hide the time editor (read-only views). */
  onCustomMinutes?: (minutes: number | undefined) => void
  /** Study Path only: link the Linux modules to the Linux practice feature. */
  linuxPracticeLink?: boolean
}) {
  const { module: m } = entry
  const intervals = useLearnerStore((s) => s.preferences.revisionIntervals)
  const skills = skillsForModule(m.id)
  const groups = [...new Set(m.topicList.map((t) => t.group ?? ""))]
  const [hours, setHours] = useState(String(toHours(entry.minutes)))
  const prerequisites = m.prerequisites.map((id) => getModule(id)?.title ?? id)

  function commitHours() {
    const value = Number(hours)
    if (!onCustomMinutes || !Number.isFinite(value) || value < 0)
      return setHours(String(toHours(entry.minutes)))
    onCustomMinutes(Math.round(value * 60))
  }

  return (
    <div className="grid gap-5 border-t border-border bg-background/40 px-4 py-4 text-sm md:grid-cols-2">
      <section aria-label={`${m.title} topics`} className="space-y-2">
        <h3 className="lr-eyebrow">Topics ({m.topicList.length})</h3>
        {groups.map((group) => (
          <div key={group || "all"} className="space-y-1">
            {group && <p className="text-xs font-medium">{group}</p>}
            <ul className="space-y-0.5">
              {m.topicList
                .filter((t) => (t.group ?? "") === group)
                .map((t) => (
                  <li
                    key={t.title}
                    className="flex justify-between gap-3 text-xs text-muted-foreground"
                  >
                    <span>{t.title}</span>
                    <span className="tabular-nums">{t.minutes} min</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Topic minutes are authored for a fresher; practice, revision and your
          experience are added on top.
        </p>
      </section>

      <div className="space-y-4">
        <section aria-label={`${m.title} questions`} className="space-y-1.5">
          <h3 className="lr-eyebrow">Common interview questions</h3>
          <ul className="space-y-0.5 text-xs">
            {LEVELS.map((level) => (
              <li key={level} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {LEVEL_META[level].label}{" "}
                  <span className="text-[0.6875rem]">
                    ({LEVEL_META[level].experience})
                  </span>
                </span>
                <span className="tabular-nums">
                  {stats.byLevel[level].available} available · target{" "}
                  {stats.byLevel[level].target}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            {CONTENT_STATUS_LABEL[m.contentStatus]}.{" "}
            {stats.available === 0
              ? "Questions for this module are being written."
              : `${stats.completed} of ${stats.available} available questions completed.`}
          </p>
        </section>

        <section
          aria-label={`${m.title} content`}
          className="space-y-1 text-xs"
        >
          <h3 className="lr-eyebrow">Learning content</h3>
          <ul className="space-y-1">
            <li>Lessons: {lessonCoverageText(lessonCoverage(m))}</li>
            <li>
              Practical assignments:{" "}
              {m.assignmentIds.length > 0 ? m.assignmentIds.length : "none yet"}
            </li>
            <li>
              Projects:{" "}
              {m.projectIds.length > 0 ? m.projectIds.length : "none yet"}
            </li>
            <li>
              Revision: spaced repetition at day {intervals.join(", ")} after
              you complete a question.
            </li>
            <li>
              Difficulty: <span className="capitalize">{m.difficulty}</span>
            </li>
            {prerequisites.length > 0 && (
              <li>Builds on: {prerequisites.join(", ")}</li>
            )}
          </ul>
          {linuxPracticeLink &&
            (m.id === "linux" || m.id === "linux-commands") && (
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link to="/linux">
                  <TerminalSquareIcon /> Practise in Linux practice
                </Link>
              </Button>
            )}
        </section>

        {skills.length > 0 && (
          <section
            aria-label={`${m.title} technologies`}
            className="space-y-1 text-xs"
          >
            <h3 className="lr-eyebrow">Technologies</h3>
            <p className="text-muted-foreground">
              {skills
                .map((s) =>
                  knownSkillIds.has(s.id)
                    ? `${s.title} (you know this)`
                    : s.title
                )
                .join(", ")}
            </p>
          </section>
        )}

        {onCustomMinutes && (
          <section aria-label={`${m.title} time`} className="space-y-1.5">
            <Label htmlFor={`hours-${m.id}`} className="text-xs">
              Your time for this module (hours)
            </Label>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                id={`hours-${m.id}`}
                type="number"
                min={0}
                step={0.5}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                onBlur={commitHours}
                onKeyDown={(e) => e.key === "Enter" && commitHours()}
                className="h-8 w-24"
              />
              {entry.customized && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onCustomMinutes(undefined)
                    setHours(
                      String(
                        toHours(
                          Math.round(
                            m.topicList.reduce((n, t) => n + t.minutes, 0) *
                              1.25
                          )
                        )
                      )
                    )
                  }}
                >
                  Use the estimate
                </Button>
              )}
            </div>
            <p className="text-[0.6875rem] text-muted-foreground">
              {TIME_MODEL_NOTE}
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
