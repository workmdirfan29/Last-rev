import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { isShortEntry, isSkillName } from "@/services/resume/generate"
import { mapSkills } from "@/services/resume/skills"
import { useLearnerStore } from "@/stores/learner-store"
import type { ResumeProfile } from "@/types/learner"
import { newId } from "@/utils/id"
import { TagsField } from "./tags-field"
import { useResume } from "./use-resume"

const uid = () => newId("r")
type Job = ResumeProfile["experiences"][number]
type Project = ResumeProfile["projects"][number]
type Item = { uid: string; text: string }

function Hint({ n, what }: { n: number; what: string }) {
  return (
    <p className="text-xs text-muted-foreground" data-testid={`hint-${what}`}>
      {n === 0
        ? `Found no ${what}: check the unplaced text below, or add them yourself.`
        : `Found ${n} ${what}: please check.`}
    </p>
  )
}

function move<T>(list: T[], i: number, by: -1 | 1): T[] {
  const j = i + by
  if (j < 0 || j >= list.length) return list
  const next = [...list]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

/** A list of one-line text items (education, certifications, achievements) with add, edit, remove. */
function ItemList({
  id,
  label,
  items,
  onChange,
  onRemoved,
}: {
  id: string
  label: string
  items: Item[]
  onChange: (next: Item[]) => void
  onRemoved: (what: string, restore: Item[]) => void
}) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={it.uid} className="flex gap-2">
          <Input
            aria-label={`${label} ${i + 1}`}
            value={it.text}
            maxLength={400}
            onChange={(e) =>
              onChange(
                items.map((x) =>
                  x.uid === it.uid ? { ...x, text: e.target.value } : x
                )
              )
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${label} ${i + 1}`}
            onClick={() => {
              onRemoved(label.toLowerCase(), items)
              onChange(items.filter((x) => x.uid !== it.uid))
            }}
          >
            <Trash2Icon />
          </Button>
        </div>
      ))}
      <Button
        id={id}
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, { uid: uid(), text: "" }])}
      >
        <PlusIcon /> Add {label.toLowerCase()}
      </Button>
    </div>
  )
}

/**
 * Review and correct everything read from the resume. The reader is best effort and will be wrong
 * sometimes, so nothing is generated from raw text: only from this reviewed profile. Changes are saved as
 * you make them, and a removal can be undone.
 */
export function ProfileEditor() {
  const { resume, pending } = useResume()
  const saveResume = useLearnerStore((s) => s.saveResume)
  const deleteResume = useLearnerStore((s) => s.deleteResume)
  const saveProfile = useLearnerStore((s) => s.saveProfile)
  const knownSkills = useLearnerStore((s) => s.profile?.knownSkills ?? [])
  const roleId = useLearnerStore(
    (s) =>
      s.profile?.primaryRole ??
      s.profile?.selectedRoles[0] ??
      "frontend-developer"
  )
  const [draft, setDraft] = useState<ResumeProfile>(resume!)
  const [status, setStatus] = useState<"saved" | "saving">("saved")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmKnown, setConfirmKnown] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latest = useRef(draft)
  const dirty = useRef(false)

  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    if (!dirty.current) return
    dirty.current = false
    void saveResume(latest.current).then(() => setStatus("saved"))
  }, [saveResume])
  useEffect(() => () => flush(), [flush])

  const commit = useCallback(
    (next: ResumeProfile) => {
      latest.current = next
      dirty.current = true
      setDraft(next)
      setStatus("saving")
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(flush, 500)
    },
    [flush]
  )
  const patch = (p: Partial<ResumeProfile>) =>
    commit({ ...latest.current, ...p })

  /** Offer Undo after something is removed: restores the whole profile as it was. */
  function removed(what: string, before: ResumeProfile) {
    toast(`Removed ${what}`, {
      action: { label: "Undo", onClick: () => commit(before) },
    })
  }
  const snap = () => latest.current

  if (!resume) return null
  const p = draft
  const mapped = mapSkills(p.skills)
  const groups = [...new Set(p.skills.map((s) => s.group))]
  const mappedKnown = mapped.flatMap((m) => (m.skill ? [m.skill.id] : []))
  const newKnown = mappedKnown.filter((id) => !knownSkills.includes(id))

  const setJob = (j: Job) =>
    patch({ experiences: p.experiences.map((x) => (x.uid === j.uid ? j : x)) })
  const setProject = (j: Project) =>
    patch({ projects: p.projects.map((x) => (x.uid === j.uid ? j : x)) })

  const assign = (u: Item, to: string) => {
    const rest = p.unplaced.filter((x) => x.uid !== u.uid)
    if (to === "summary")
      patch({
        unplaced: rest,
        summary: `${p.summary} ${u.text}`.trim().slice(0, 1500),
      })
    else if (to === "skills")
      patch({
        unplaced: rest,
        skills: [
          ...p.skills,
          ...u.text
            .split(/[,;|]/)
            .map((t) => t.trim())
            .filter(Boolean)
            .map((name) => ({ uid: uid(), group: "", name })),
        ],
      })
    else if (to === "education")
      patch({ unplaced: rest, education: [...p.education, u] })
    else if (to === "certifications")
      patch({ unplaced: rest, certifications: [...p.certifications, u] })
    else if (to === "achievements")
      patch({ unplaced: rest, achievements: [...p.achievements, u] })
  }

  const section = "space-y-3 rounded-xl border border-border bg-card p-4"
  const h = "text-sm font-medium"

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Check every section. Questions are made only from what you keep here.
        </p>
        <p
          role="status"
          aria-live="polite"
          className="text-xs text-muted-foreground"
          data-testid="save-status"
        >
          {status === "saved" ? "Saved" : "Saving..."}
        </p>
      </div>

      {pending && pending.total > 0 && (
        <p
          className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 p-3 text-sm"
          data-testid="pending"
        >
          Your resume changed. {pending.total}{" "}
          {pending.total === 1 ? "question" : "questions"} to update.{" "}
          <Link
            className="underline underline-offset-4"
            to="/resume?tab=questions"
          >
            Review and update them
          </Link>
        </p>
      )}

      <section aria-labelledby="ed-summary" className={section}>
        <h3 id="ed-summary" className={h}>
          Summary
        </h3>
        <Hint n={p.summary.trim() ? 1 : 0} what="summary" />
        <Label htmlFor="summary" className="sr-only">
          Summary
        </Label>
        <Textarea
          id="summary"
          rows={3}
          maxLength={1500}
          value={p.summary}
          onChange={(e) => patch({ summary: e.target.value })}
        />
      </section>

      <section aria-labelledby="ed-skills" className={section}>
        <h3 id="ed-skills" className={h}>
          Skills
        </h3>
        <Hint n={p.skills.length} what="skills" />
        {groups.map((g) => (
          <div
            key={g || "none"}
            className="space-y-2 rounded-lg border border-border p-3"
          >
            <div className="flex items-center gap-2">
              <Label htmlFor={`group-${g || "none"}`} className="shrink-0">
                Group
              </Label>
              <Input
                id={`group-${g || "none"}`}
                value={g}
                placeholder="No group"
                className="max-w-xs"
                onChange={(e) =>
                  patch({
                    skills: p.skills.map((s) =>
                      s.group === g ? { ...s, group: e.target.value } : s
                    ),
                  })
                }
              />
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {p.skills
                .filter((s) => s.group === g)
                .map((s) => (
                  <li key={s.uid} className="flex flex-wrap gap-1">
                    {!isSkillName(s.name) && (
                      <p
                        className="basis-full text-xs text-warning"
                        data-testid="sentence-hint"
                      >
                        Looks like a sentence: check. No question is made from
                        it.
                      </p>
                    )}
                    <Input
                      aria-label={`Skill ${s.name}`}
                      value={s.name}
                      maxLength={80}
                      onChange={(e) =>
                        patch({
                          skills: p.skills.map((x) =>
                            x.uid === s.uid ? { ...x, name: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Select
                      value={g}
                      onValueChange={(to) =>
                        patch({
                          skills: p.skills.map((x) =>
                            x.uid === s.uid
                              ? { ...x, group: to === "__none" ? "" : to }
                              : x
                          ),
                        })
                      }
                    >
                      <SelectTrigger
                        aria-label={`Group for ${s.name}`}
                        className="w-28 shrink-0"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((x) => (
                          <SelectItem key={x || "none"} value={x || "__none"}>
                            {x || "No group"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!isSkillName(s.name) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        aria-label={`Move skill ${s.name} to Other sections`}
                        onClick={() => {
                          removed("a skill row", snap())
                          patch({
                            skills: p.skills.filter((x) => x.uid !== s.uid),
                            other: [
                              ...p.other,
                              {
                                uid: uid(),
                                heading: "Moved from skills",
                                text: s.name,
                              },
                            ],
                          })
                        }}
                      >
                        Move to Other
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove skill ${s.name}`}
                      onClick={() => {
                        removed(`skill ${s.name}`, snap())
                        patch({
                          skills: p.skills.filter((x) => x.uid !== s.uid),
                        })
                      }}
                    >
                      <Trash2Icon />
                    </Button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <TagsField
          id="add-skills"
          label="Add skills (to No group)"
          value={[]}
          onChange={(names) =>
            patch({
              skills: [
                ...p.skills,
                ...names.map((name) => ({ uid: uid(), group: "", name })),
              ],
            })
          }
        />
        {mapped.some((m) => m.skill) && (
          <div
            className="space-y-2 rounded-lg bg-muted/30 p-3 text-sm"
            data-testid="skill-map"
          >
            <p className="font-medium">
              You can practise these from the question bank
            </p>
            <ul className="space-y-1">
              {mapped
                .filter((m) => m.practise)
                .map((m) => (
                  <li key={m.name}>
                    {m.name}:{" "}
                    <Link
                      className="underline underline-offset-4"
                      to={`/interview/${roleId}/${m.practise!.moduleId}`}
                    >
                      {m.practise!.moduleTitle}, {m.practise!.questions}{" "}
                      questions
                    </Link>
                  </li>
                ))}
            </ul>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={newKnown.length === 0}
              onClick={() => setConfirmKnown(true)}
            >
              Mark these as known skills ({newKnown.length})
            </Button>
          </div>
        )}
      </section>

      <section aria-labelledby="ed-exp" className={section}>
        <h3 id="ed-exp" className={h}>
          Experience
        </h3>
        <Hint n={p.experiences.length} what="jobs" />
        {p.experiences.map((j, i) => (
          <fieldset
            key={j.uid}
            className="space-y-3 rounded-lg border border-border p-3"
          >
            <legend className="px-1 text-xs text-muted-foreground">
              Job {i + 1}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor={`co-${j.uid}`}>Company</Label>
                <Input
                  id={`co-${j.uid}`}
                  value={j.company}
                  maxLength={120}
                  onChange={(e) => setJob({ ...j, company: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`ro-${j.uid}`}>Role</Label>
                <Input
                  id={`ro-${j.uid}`}
                  value={j.role}
                  maxLength={120}
                  onChange={(e) => setJob({ ...j, role: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`st-${j.uid}`}>Start</Label>
                <Input
                  id={`st-${j.uid}`}
                  value={j.start}
                  maxLength={40}
                  onChange={(e) => setJob({ ...j, start: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`en-${j.uid}`}>End</Label>
                <Input
                  id={`en-${j.uid}`}
                  value={j.end}
                  maxLength={40}
                  placeholder="Present"
                  onChange={(e) => setJob({ ...j, end: e.target.value })}
                />
              </div>
            </div>
            {j.bullets.length === 0 && (
              <p className="text-xs text-warning" data-testid="no-bullets-hint">
                This job has no bullets. If it is not a job, move it to Other or
                delete it.
              </p>
            )}
            {isShortEntry(j) && (
              <p
                className="text-xs text-muted-foreground"
                data-testid="short-entry"
              >
                Short entry: a training or internship of under 3 months.
              </p>
            )}
            <ItemList
              id={`add-b-${j.uid}`}
              label="Bullet"
              items={j.bullets}
              onChange={(bullets) => setJob({ ...j, bullets })}
              onRemoved={(what) => removed(what, snap())}
            />
            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={i === 0}
                aria-label={`Move job ${i + 1} up`}
                onClick={() =>
                  patch({ experiences: move(p.experiences, i, -1) })
                }
              >
                <ArrowUpIcon /> Up
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={i === p.experiences.length - 1}
                aria-label={`Move job ${i + 1} down`}
                onClick={() =>
                  patch({ experiences: move(p.experiences, i, 1) })
                }
              >
                <ArrowDownIcon /> Down
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Move job ${i + 1} to Other sections`}
                onClick={() => {
                  removed(`job ${j.company || i + 1}`, snap())
                  patch({
                    experiences: p.experiences.filter((x) => x.uid !== j.uid),
                    other: [
                      ...p.other,
                      {
                        uid: uid(),
                        heading: "Moved from experience",
                        text: [
                          [j.company, j.role].filter(Boolean).join(", "),
                          [j.start, j.end].filter(Boolean).join(" - "),
                          ...j.bullets.map((b) => b.text),
                        ]
                          .filter(Boolean)
                          .join("\n"),
                      },
                    ],
                  })
                }}
              >
                Not a job: move to Other
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Remove job ${i + 1}`}
                className="text-muted-foreground"
                onClick={() => {
                  removed(`job ${j.company || i + 1}`, snap())
                  patch({
                    experiences: p.experiences.filter((x) => x.uid !== j.uid),
                  })
                }}
              >
                <Trash2Icon /> Remove job
              </Button>
            </div>
          </fieldset>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            patch({
              experiences: [
                ...p.experiences,
                {
                  uid: uid(),
                  company: "",
                  role: "",
                  start: "",
                  end: "",
                  bullets: [],
                },
              ],
            })
          }
        >
          <PlusIcon /> Add job
        </Button>
      </section>

      <section aria-labelledby="ed-proj" className={section}>
        <h3 id="ed-proj" className={h}>
          Projects
        </h3>
        <Hint n={p.projects.length} what="projects" />
        {p.projects.map((pr, i) => (
          <fieldset
            key={pr.uid}
            className="space-y-3 rounded-lg border border-border p-3"
          >
            <legend className="px-1 text-xs text-muted-foreground">
              Project {i + 1}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor={`pn-${pr.uid}`}>Project name</Label>
                <Input
                  id={`pn-${pr.uid}`}
                  value={pr.name}
                  maxLength={120}
                  onChange={(e) => setProject({ ...pr, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`pr-${pr.uid}`}>Your role</Label>
                <Input
                  id={`pr-${pr.uid}`}
                  value={pr.role}
                  maxLength={120}
                  onChange={(e) => setProject({ ...pr, role: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor={`pd-${pr.uid}`}>Description</Label>
              <Textarea
                id={`pd-${pr.uid}`}
                rows={2}
                maxLength={600}
                value={pr.description}
                onChange={(e) =>
                  setProject({ ...pr, description: e.target.value })
                }
              />
            </div>
            <TagsField
              id={`pt-${pr.uid}`}
              label={`Technologies for ${pr.name || `project ${i + 1}`}`}
              value={pr.technologies}
              onChange={(technologies) => setProject({ ...pr, technologies })}
            />
            <ItemList
              id={`add-pb-${pr.uid}`}
              label="Project bullet"
              items={pr.bullets}
              onChange={(bullets) => setProject({ ...pr, bullets })}
              onRemoved={(what) => removed(what, snap())}
            />
            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={i === 0}
                aria-label={`Move project ${i + 1} up`}
                onClick={() => patch({ projects: move(p.projects, i, -1) })}
              >
                <ArrowUpIcon /> Up
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={i === p.projects.length - 1}
                aria-label={`Move project ${i + 1} down`}
                onClick={() => patch({ projects: move(p.projects, i, 1) })}
              >
                <ArrowDownIcon /> Down
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Remove project ${i + 1}`}
                className="text-muted-foreground"
                onClick={() => {
                  removed(`project ${pr.name || i + 1}`, snap())
                  patch({
                    projects: p.projects.filter((x) => x.uid !== pr.uid),
                  })
                }}
              >
                <Trash2Icon /> Remove project
              </Button>
            </div>
          </fieldset>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            patch({
              projects: [
                ...p.projects,
                {
                  uid: uid(),
                  name: "",
                  role: "",
                  description: "",
                  technologies: [],
                  bullets: [],
                },
              ],
            })
          }
        >
          <PlusIcon /> Add project
        </Button>
      </section>

      {(
        [
          ["education", "Education", "ed-edu"],
          ["certifications", "Certification", "ed-cert"],
          ["achievements", "Achievement", "ed-ach"],
        ] as const
      ).map(([key, label, id]) => (
        <section key={key} aria-labelledby={id} className={section}>
          <h3 id={id} className={h}>
            {label === "Education" ? "Education" : `${label}s`}
          </h3>
          <ItemList
            id={`add-${key}`}
            label={label}
            items={p[key]}
            onChange={(next) => patch({ [key]: next })}
            onRemoved={(what) => removed(what, snap())}
          />
        </section>
      ))}

      <section aria-labelledby="ed-other" className={section}>
        <h3 id="ed-other" className={h}>
          Other sections (not used for questions) ({p.other.length})
        </h3>
        <p className="text-xs text-muted-foreground">
          Languages, interests, declarations and headings the reader did not
          know. They are kept for you and never become questions or part of a
          question set.
        </p>
        {p.other.length === 0 ? (
          <p className="text-sm text-muted-foreground">None.</p>
        ) : (
          p.other.map((o, i) => (
            <div
              key={o.uid}
              className="space-y-2 rounded-lg border border-border p-3"
            >
              <div className="space-y-1">
                <Label htmlFor={`oh-${o.uid}`}>Heading</Label>
                <Input
                  id={`oh-${o.uid}`}
                  value={o.heading}
                  maxLength={120}
                  onChange={(e) =>
                    patch({
                      other: p.other.map((x) =>
                        x.uid === o.uid ? { ...x, heading: e.target.value } : x
                      ),
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`ot-${o.uid}`}>Text</Label>
                <Textarea
                  id={`ot-${o.uid}`}
                  rows={3}
                  maxLength={3000}
                  value={o.text}
                  onChange={(e) =>
                    patch({
                      other: p.other.map((x) =>
                        x.uid === o.uid ? { ...x, text: e.target.value } : x
                      ),
                    })
                  }
                />
              </div>
              <div className="flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={`Move the lines of ${o.heading || `other section ${i + 1}`} to unplaced text`}
                  onClick={() =>
                    patch({
                      other: p.other.filter((x) => x.uid !== o.uid),
                      unplaced: [
                        ...p.unplaced,
                        ...o.text
                          .split("\n")
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .map((text) => ({ uid: uid(), text })),
                      ],
                    })
                  }
                >
                  Move lines to unplaced text
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label={`Delete other section ${i + 1}`}
                  onClick={() => {
                    removed("a section", snap())
                    patch({ other: p.other.filter((x) => x.uid !== o.uid) })
                  }}
                >
                  <Trash2Icon /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </section>

      <section aria-labelledby="ed-unplaced" className={section}>
        <h3 id="ed-unplaced" className={h}>
          Unplaced text ({p.unplaced.length})
        </h3>
        <p className="text-xs text-muted-foreground">
          Lines the reader could not place. Assign each one to a section, or
          delete it. Nothing here is used for questions until you assign it.
        </p>
        {p.unplaced.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing is unplaced.</p>
        ) : (
          <ul className="space-y-2">
            {p.unplaced.map((u, i) => (
              <li
                key={u.uid}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2"
              >
                <p className="min-w-0 flex-1 text-sm break-words">{u.text}</p>
                <Select onValueChange={(to) => assign(u, to)}>
                  <SelectTrigger
                    aria-label={`Assign unplaced line ${i + 1} to`}
                    className="w-40"
                  >
                    <SelectValue placeholder="Assign to..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="skills">Skills</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="certifications">
                      Certifications
                    </SelectItem>
                    <SelectItem value="achievements">Achievements</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete unplaced line ${i + 1}`}
                  onClick={() => {
                    removed("an unplaced line", snap())
                    patch({
                      unplaced: p.unplaced.filter((x) => x.uid !== u.uid),
                    })
                  }}
                >
                  <Trash2Icon />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="ed-settings" className={section}>
        <h3 id="ed-settings" className={h}>
          Question settings
        </h3>
        <div className="flex items-start gap-2">
          <Checkbox
            id="date-q"
            checked={p.includeDateQuestions}
            onCheckedChange={(v) => patch({ includeDateQuestions: v === true })}
            className="mt-0.5"
          />
          <Label htmlFor="date-q" className="font-normal">
            Include difficult questions about dates (tenure, gaps)
            <span className="block text-xs text-muted-foreground">
              These can be sensitive. They are worded neutrally and only made
              when both dates are clear.
            </span>
          </Label>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="raise-caps"
            checked={p.raiseCaps}
            onCheckedChange={(v) => patch({ raiseCaps: v === true })}
            className="mt-0.5"
          />
          <Label htmlFor="raise-caps" className="font-normal">
            Make questions for every bullet
            <span className="block text-xs text-muted-foreground">
              By default at most 4 responsibility, follow-up and achievement
              questions are made for each job or project.
            </span>
          </Label>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="text-destructive"
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2Icon /> Delete my resume
        </Button>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes your resume profile, every question made from it, and
              your notes, progress and saved answers for those questions.
              Question sets you imported stay. It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction onClick={() => void deleteResume()}>
              Delete my resume
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmKnown} onOpenChange={setConfirmKnown}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark these as known skills?</AlertDialogTitle>
            <AlertDialogDescription>
              {newKnown.length} technologies from your resume will be marked as
              skills you already know in your syllabus. Nothing is removed or
              shortened because of them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void saveProfile({ knownSkills: [...knownSkills, ...newKnown] })
                toast(`${newKnown.length} skills marked as known`)
              }}
            >
              Mark as known
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
