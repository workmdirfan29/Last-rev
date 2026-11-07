import { Fragment, useMemo, useRef, useState } from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { useFullIndex } from "@/hooks/use-content"
import {
  defaultsForRoadmap,
  defaultsForRoles,
} from "@/services/curriculum/relevance"
import { resolveSyllabus, setSelected } from "@/services/curriculum/syllabus"
import {
  coverage,
  gapList,
  type CoverageRow,
} from "@/services/jobmatch/coverage"
import { MAX_CHARS, analyse, type Analysis } from "@/services/jobmatch/matcher"
import { learnerModuleIds } from "@/services/readiness/learner-modules"
import { useLearnerStore } from "@/stores/learner-store"
import { MAX_TARGET_ROLES } from "@/types/learner"
import { newId } from "@/utils/id"

const MAX_FILE_BYTES = 200_000

function Sentence({
  s,
  start,
  end,
}: {
  s: string
  start: number
  end: number
}) {
  return (
    <>
      {s.slice(0, start)}
      <mark className="rounded bg-primary/25 px-0.5 text-foreground">
        {s.slice(start, end)}
      </mark>
      {s.slice(end)}
    </>
  )
}

/** Paste a job description; see which technologies it names, what you already have for each, and the gaps. Local only. */
export function JobMatchPage() {
  const profile = useLearnerStore((s) => s.profile)
  const progress = useLearnerStore((s) => s.progress)
  const attempts = useLearnerStore((s) => s.quizAttempts)
  const roles = useLearnerStore((s) => s.targetRoles)
  const saveProfile = useLearnerStore((s) => s.saveProfile)
  const saveRole = useLearnerStore((s) => s.saveTargetRole)
  const deleteRole = useLearnerStore((s) => s.deleteTargetRole)
  const index = useFullIndex()
  const [text, setText] = useState("")
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [keepText, setKeepText] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  const interview = (profile?.selectedRoles.length ?? 0) > 0
  const defaults = useMemo(
    () =>
      interview
        ? defaultsForRoles(profile!.selectedRoles)
        : profile?.studyRoadmap
          ? defaultsForRoadmap(profile.studyRoadmap)
          : new Map(),
    [interview, profile]
  )
  const selectedModules = useMemo(() => learnerModuleIds(profile), [profile])
  const rows: CoverageRow[] = useMemo(
    () =>
      analysis && index
        ? coverage({
            matches: analysis.matches,
            defaults,
            selectedModules,
            knownSkills: profile?.knownSkills ?? [],
            index,
            progress,
            lessons: LESSON_INDEX,
            attempts,
          })
        : [],
    [
      analysis,
      index,
      defaults,
      selectedModules,
      profile?.knownSkills,
      progress,
      attempts,
    ]
  )
  const gaps = gapList(rows)
  const primary = profile?.primaryRole ?? profile?.selectedRoles[0]

  async function onFile(f: File | undefined) {
    setFileError(null)
    if (!f) return
    if (!/\.txt$/i.test(f.name) && f.type !== "text/plain")
      return setFileError("Choose a plain text (.txt) file, or paste the text.")
    if (f.size > MAX_FILE_BYTES)
      return setFileError(
        "That file is too large. Paste the relevant part instead."
      )
    setText((await f.text()).slice(0, MAX_CHARS))
    setAnalysis(null)
  }

  function addToSyllabus(row: CoverageRow) {
    if (!profile) return
    const key = interview ? "syllabusOverrides" : "studySyllabusOverrides"
    const before = profile[key]
    const entries = resolveSyllabus({
      defaults,
      overrides: before,
      experience: profile.experience,
      scope: interview ? "interview" : "study",
    })
    const entry = entries.find((e) => e.module.id === row.moduleId)
    if (!entry) return
    void saveProfile({ [key]: setSelected(before, entry, true) })
    toast(`Added to your syllabus: ${row.moduleTitle}`, {
      action: {
        label: "Undo",
        onClick: () => void saveProfile({ [key]: before }),
      },
    })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Job match"
        title="Match a job description to your prep"
        description="Paste a job description. LastRev finds the technologies it names by exact name, shows the sentence for each, and compares them with what you have done. It runs in your browser: nothing is uploaded."
      />

      <section className="space-y-3" aria-labelledby="jd-input">
        <h2 id="jd-input" className="sr-only">
          Job description
        </h2>
        <div className="space-y-1.5">
          <Label htmlFor="jd-text">Job description</Label>
          <Textarea
            id="jd-text"
            rows={10}
            value={text}
            maxLength={MAX_CHARS}
            onChange={(e) => {
              setText(e.target.value)
              setAnalysis(null)
            }}
            placeholder="Paste the text of a job description here…"
          />
          <p className="text-xs text-muted-foreground tabular-nums">
            {text.length} of {MAX_CHARS} characters
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            disabled={text.trim() === ""}
            onClick={() => setAnalysis(analyse(text))}
          >
            Find the skills
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
          >
            Choose a .txt file
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,text/plain"
            className="sr-only"
            aria-label="Choose a text file"
            tabIndex={-1}
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setText("")
              setAnalysis(null)
            }}
          >
            Clear
          </Button>
        </div>
        {fileError && (
          <p role="alert" className="text-sm">
            {fileError}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          It finds names, not meaning: a line that says &quot;no Kafka
          needed&quot; still lists Kafka. It does not read PDF or Word files,
          and it cannot know what a role really needs, only what the text
          mentions.
        </p>
      </section>

      {analysis && (
        <section
          className="space-y-6"
          aria-labelledby="jd-results"
          data-testid="jd-results"
        >
          <div>
            <h2
              id="jd-results"
              className="font-heading text-lg font-semibold tracking-tight"
            >
              What it names
            </h2>
            <p
              className="text-sm text-muted-foreground tabular-nums"
              role="status"
              aria-live="polite"
              data-testid="jd-summary"
            >
              {analysis.matches.length === 0
                ? `No technology from the skills list was found in ${analysis.sentences} ${analysis.sentences === 1 ? "sentence" : "sentences"}.`
                : `Found ${analysis.matches.length} ${analysis.matches.length === 1 ? "technology" : "technologies"} in ${analysis.sentences} ${analysis.sentences === 1 ? "sentence" : "sentences"}. Gaps: ${gaps.length} · Already covered: ${rows.length - gaps.length}.`}
              {analysis.truncated
                ? ` Only the first ${MAX_CHARS} characters were read.`
                : ""}
            </p>
          </div>

          {rows.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[40rem] text-sm">
                <caption className="sr-only">
                  Technologies found, with what you have for each
                </caption>
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th scope="col" className="p-2 font-medium">
                      Skill
                    </th>
                    <th scope="col" className="p-2 font-medium">
                      Mentions
                    </th>
                    <th scope="col" className="p-2 font-medium">
                      In your path
                    </th>
                    <th scope="col" className="p-2 font-medium">
                      Known
                    </th>
                    <th scope="col" className="p-2 font-medium">
                      Lessons
                    </th>
                    <th scope="col" className="p-2 font-medium">
                      Questions
                    </th>
                    <th scope="col" className="p-2 font-medium">
                      Checks passed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <Fragment key={r.skillId}>
                      <tr className="border-t border-border align-top">
                        <th scope="row" className="p-2 text-left font-medium">
                          {r.title}
                          <span className="block text-xs font-normal text-muted-foreground">
                            {r.moduleTitle}
                          </span>
                        </th>
                        <td className="p-2 tabular-nums">{r.match.mentions}</td>
                        <td className="p-2">
                          {r.tier
                            ? `${r.tier}${r.inSyllabus ? "" : ", not in your syllabus"}`
                            : r.inSyllabus
                              ? "in your syllabus"
                              : "not in your path"}
                        </td>
                        <td className="p-2">{r.known ? "Yes" : "No"}</td>
                        <td className="p-2 tabular-nums">
                          {r.lessons.ready > 0
                            ? `${r.lessons.finished} of ${r.lessons.ready}`
                            : "none yet"}
                        </td>
                        <td className="p-2 tabular-nums">
                          {r.questions.ready > 0
                            ? `${r.questions.done} of ${r.questions.ready}`
                            : "none yet"}
                        </td>
                        <td className="p-2 tabular-nums">{r.checksPassed}</td>
                      </tr>
                      <tr>
                        <td
                          colSpan={7}
                          className="px-2 pb-2 text-xs text-muted-foreground"
                        >
                          Found in:{" "}
                          {r.match.evidence.map((e, i) => (
                            <span key={i} className="me-3 inline-block">
                              &quot;
                              <Sentence
                                s={e.sentence}
                                start={e.start}
                                end={e.end}
                              />
                              &quot;
                            </span>
                          ))}
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {gaps.length > 0 && (
            <div className="space-y-2" data-testid="jd-gaps">
              <h3 className="text-sm font-medium">Gaps ({gaps.length})</h3>
              <p className="text-xs text-muted-foreground">
                Mentioned in the job description, not ticked as known, and
                nothing finished or done yet in the skill&apos;s module.
              </p>
              <ul className="space-y-2">
                {gaps.map((r) => (
                  <li
                    key={r.skillId}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card p-3 text-sm"
                  >
                    <span className="font-medium">{r.title}</span>
                    <span className="flex flex-wrap items-center gap-2 text-xs">
                      {r.questions.ready > 0 && primary && (
                        <Link
                          className="underline underline-offset-4"
                          to={`/interview/${primary}/${r.moduleId}`}
                        >
                          Question library
                        </Link>
                      )}
                      {r.lessons.ready > 0 && (
                        <Link
                          className="underline underline-offset-4"
                          to={`/study/lessons/${r.moduleId}`}
                        >
                          Lessons
                        </Link>
                      )}
                      {!r.inSyllabus && (
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          onClick={() => addToSyllabus(r)}
                        >
                          Add to my syllabus
                        </Button>
                      )}
                      {r.inSyllabus &&
                        r.questions.ready === 0 &&
                        r.lessons.ready === 0 && (
                          <span className="text-muted-foreground">
                            No content for it yet
                          </span>
                        )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.unrecognised.length > 0 && (
            <p
              className="rounded-lg border border-dashed border-border p-3 text-sm"
              data-testid="jd-unrecognised"
            >
              We did not recognise these words:{" "}
              {analysis.unrecognised.join(", ")}. This list may include ordinary
              words. They are not guessed at and are not counted as matches.
            </p>
          )}

          <form
            className="space-y-2 rounded-xl border border-border bg-card p-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!name.trim() || analysis.matches.length === 0) return
              void saveRole({
                id: newId("role"),
                name: name.trim(),
                savedAt: new Date().toISOString(),
                matched: analysis.matches.map((m) => ({
                  skillId: m.skillId,
                  mentions: m.mentions,
                })),
                text: keepText ? text.slice(0, 20_000) : null,
              })
              setName("")
            }}
          >
            <h3 className="text-sm font-medium">Save as a target role</h3>
            <div className="flex flex-wrap items-end gap-2">
              <div className="space-y-1">
                <Label htmlFor="role-name">Name</Label>
                <Input
                  id="role-name"
                  value={name}
                  maxLength={80}
                  onChange={(e) => setName(e.target.value)}
                  className="w-64"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                disabled={!name.trim() || analysis.matches.length === 0}
              >
                Save
              </Button>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                className="size-4 accent-[var(--primary)]"
                checked={!keepText}
                onChange={(e) => setKeepText(!e.target.checked)}
              />
              Do not keep the text (keep only the list of skills)
            </label>
            <p className="text-xs text-muted-foreground">
              Stored on this device only, at most {MAX_TARGET_ROLES} roles.
              Nothing is saved unless you press Save.
            </p>
          </form>
        </section>
      )}

      <section className="space-y-3" aria-labelledby="roles">
        <h2 id="roles" className="text-sm font-medium">
          Your target roles
        </h2>
        {roles.length === 0 ? (
          <p className="text-xs text-muted-foreground">None saved.</p>
        ) : (
          <ul className="space-y-2" data-testid="target-roles">
            {roles.map((r) => {
              const now = coverage({
                matches: r.matched.map((m) => ({
                  skillId: m.skillId,
                  mentions: m.mentions,
                  evidence: [],
                })),
                defaults,
                selectedModules,
                knownSkills: profile?.knownSkills ?? [],
                index: index ?? [],
                progress,
                lessons: LESSON_INDEX,
                attempts,
              })
              const open = now.filter((x) => x.gap).length
              return (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card p-3 text-sm"
                >
                  <span>
                    <span className="font-medium">{r.name}</span>
                    <span className="block text-xs text-muted-foreground tabular-nums">
                      {r.matched.length} skills · {open} still gaps today ·
                      saved {r.savedAt.slice(0, 10)}
                    </span>
                  </span>
                  <span className="flex gap-2">
                    {r.text && (
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          setText(r.text!)
                          setAnalysis(analyse(r.text!))
                        }}
                      >
                        Open
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="xs"
                      variant="ghost"
                      aria-label={`Delete ${r.name}`}
                      onClick={() => void deleteRole(r.id)}
                    >
                      Delete
                    </Button>
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
      {!profile && (
        <EmptyState
          title="Set up a journey first"
          description="Job match compares a job description with your syllabus."
        />
      )}
    </div>
  )
}
