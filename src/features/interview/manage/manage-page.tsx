import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router"
import {
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  Undo2Icon,
  XIcon,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getModule } from "@/data/catalog/modules"
import { CurriculumBuilder } from "@/features/curriculum/curriculum-builder"
import { RemovedModules } from "@/features/curriculum/removed-modules"
import { RemovedPlanBlocks } from "@/features/planner/removed-blocks"
import { useOwnQuestionEntries, useQuestionIndex } from "@/hooks/use-content"
import { defaultsForRoles } from "@/services/curriculum/relevance"
import { resolveSyllabus, setSelected } from "@/services/curriculum/syllabus"
import { countStudyDays } from "@/services/planner/schedule"
import { toDateKey } from "@/utils/dates"
import { isResumeModuleId } from "@/types/learner"
import { useLearnerStore } from "@/stores/learner-store"
import type { QuestionIndexEntry } from "@/types/content"
import { CustomQuestionDialog } from "../components/custom-question-dialog"
import { useRemoveQuestion } from "../use-remove-question"
import { QuestionPickerList } from "./question-picker-list"

const TABS = ["modules", "questions", "mine", "removed"] as const
type Tab = (typeof TABS)[number]

/**
 * Manage my prep: take modules and questions out of your preparation and put them back, write
 * your own questions, and see everything you removed. Nothing here deletes your notes.
 */
export function ManagePage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get("tab")
  const tab: Tab = (TABS as readonly string[]).includes(requested ?? "")
    ? (requested as Tab)
    : "modules"
  const profile = useLearnerStore((s) => s.profile)
  const customQuestions = useLearnerStore((s) => s.customQuestions)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interview Zone"
        title="Manage my prep"
        description="Choose what you prepare. Remove a module or a question you do not need, write your own questions, and restore anything you removed. Your notes are never deleted by removing."
      />
      {!profile || profile.selectedRoles.length === 0 ? (
        <EmptyState
          title="Choose a career path first"
          description="Manage my prep works on the modules of your career path."
          action={
            <Button asChild>
              <Link to="/onboarding">Choose a career path</Link>
            </Button>
          }
        />
      ) : (
        <Tabs
          value={tab}
          onValueChange={(v) =>
            setParams(new URLSearchParams({ tab: v }), { replace: true })
          }
          className="gap-5"
        >
          <TabsList>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="mine">
              My questions ({customQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="removed">Removed</TabsTrigger>
          </TabsList>
          <TabsContent value="modules">
            <ModulesTab />
          </TabsContent>
          <TabsContent value="questions">
            <QuestionsTab />
          </TabsContent>
          <TabsContent value="mine">
            <MyQuestionsTab />
          </TabsContent>
          <TabsContent value="removed">
            <RemovedTab />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

/** Hook: every question in the learner's syllabus (curated and their own), with removed ones split out. */
function usePrepQuestions() {
  const profile = useLearnerStore((s) => s.profile)
  const progress = useLearnerStore((s) => s.progress)
  const own = useOwnQuestionEntries()
  const { data: curated } = useQuestionIndex()
  return useMemo(() => {
    if (!profile) return { active: [], removed: [] }
    const entries = resolveSyllabus({
      defaults: defaultsForRoles(profile.selectedRoles),
      overrides: profile.syllabusOverrides,
      experience: profile.experience,
    })
    const inSyllabus = new Set(
      entries.filter((e) => e.selected).map((e) => e.module.id)
    )
    const all: QuestionIndexEntry[] = [...(curated ?? []), ...own]
    // A removed question stays removed even if its module is later taken out, so list every removed one.
    return {
      // Questions made from the learner's resume are not curriculum, so they are not tied to the syllabus.
      active: all.filter(
        (q) =>
          (inSyllabus.has(q.moduleId) || isResumeModuleId(q.moduleId)) &&
          !progress[q.id]?.removed
      ),
      removed: all.filter((q) => progress[q.id]?.removed),
    }
  }, [profile, curated, own, progress])
}

function ModulesTab() {
  const profile = useLearnerStore((s) => s.profile)!
  const saveProfile = useLearnerStore((s) => s.saveProfile)
  return (
    <CurriculumBuilder
      source={{ kind: "roles", roleIds: profile.selectedRoles }}
      experience={profile.experience}
      dailyMinutes={Math.round(profile.dailyStudyHours * 60)}
      targetDays={
        profile.targetDate
          ? Math.max(
              1,
              countStudyDays(
                toDateKey(new Date()),
                profile.targetDate,
                profile.plans.interview.studyDays
              )
            )
          : null
      }
      deadlineLabel={profile.targetDate}
      value={profile.syllabusOverrides}
      onChange={(next) => void saveProfile({ syllabusOverrides: next })}
      knownSkillIds={profile.knownSkills}
      barClassName="bottom-16 md:bottom-3"
    />
  )
}

function QuestionsTab() {
  const { active } = usePrepQuestions()
  const setRemoved = useLearnerStore((s) => s.setQuestionRemoved)
  const removeOne = useRemoveQuestion()
  const [query, setQuery] = useState("")
  const [moduleId, setModuleId] = useState("all")
  const [selected, setSelectedIds] = useState<ReadonlySet<string>>(new Set())

  const moduleOptions = useMemo(
    () =>
      [...new Set(active.map((q) => q.moduleId))]
        .map((id) => ({ id, title: getModule(id)?.title ?? id }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [active]
  )
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return active.filter(
      (x) =>
        (moduleId === "all" || x.moduleId === moduleId) &&
        (q === "" ||
          x.title.toLowerCase().includes(q) ||
          x.keywords.some((k) => k.toLowerCase().includes(q)))
    )
  }, [active, query, moduleId])
  const chosen = shown.filter((q) => selected.has(q.id))

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <SearchIcon
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            aria-label="Search questions"
            placeholder="Search questions"
            className="ps-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={moduleId} onValueChange={setModuleId}>
          <SelectTrigger aria-label="Module" className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All modules</SelectItem>
            {moduleOptions.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          disabled={chosen.length === 0}
          onClick={() => {
            for (const q of chosen) void setRemoved(q.id, true)
            setSelectedIds(new Set())
          }}
        >
          <XIcon /> Remove selected ({chosen.length})
        </Button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className="text-xs text-muted-foreground"
      >
        Showing {shown.length} of {active.length} questions in your prep
      </p>
      <QuestionPickerList
        questions={shown}
        selected={selected}
        onToggle={toggle}
        emptyText="No questions match. Questions you remove move to the Removed tab."
        renderAction={(q) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeOne(q.id, q.title)}
            aria-label={`Remove from my prep: ${q.title}`}
          >
            <XIcon /> Remove
          </Button>
        )}
      />
    </div>
  )
}

function MyQuestionsTab() {
  const customQuestions = useLearnerStore((s) => s.customQuestions)
  const deleteCustom = useLearnerStore((s) => s.deleteCustomQuestion)
  const [editing, setEditing] = useState<string | "new" | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()
  const shown = customQuestions.filter(
    (c) =>
      q === "" ||
      c.title.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  )
  const editingQuestion = customQuestions.find((c) => c.id === editing)
  const progress = useLearnerStore((s) => s.progress)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <SearchIcon
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            aria-label="Search my questions"
            placeholder="Search my questions or tags"
            className="ps-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="button" onClick={() => setEditing("new")}>
          <PlusIcon /> Add a question
        </Button>
      </div>

      {customQuestions.length === 0 ? (
        <EmptyState
          title="You have not added any questions yet"
          description="Write a question you were asked, or one you want to practise. It stays on this device and works like any other question."
          action={
            <Button onClick={() => setEditing("new")}>
              Add your first question
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {shown.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-start gap-x-3 gap-y-2 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <Link
                  to={`/interview/question/${c.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {c.title}
                </Link>
                <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge variant="secondary">Yours</Badge>
                  {getModule(c.moduleId)?.title ?? c.moduleId} ·{" "}
                  <span className="capitalize">{c.level}</span>
                  {c.tags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                  {progress[c.id]?.removed && (
                    <Badge variant="outline">Removed</Badge>
                  )}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(c.id)}
                  aria-label={`Edit ${c.title}`}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleting(c.id)}
                  aria-label={`Delete ${c.title}`}
                >
                  <Trash2Icon /> Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <CustomQuestionDialog
        open={editing !== null}
        onOpenChange={(o) => !o && setEditing(null)}
        question={editingQuestion}
      />
      <AlertDialog
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes your question and its notes and progress. It cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleting) void deleteCustom(deleting)
                setDeleting(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function RemovedTab() {
  const { removed } = usePrepQuestions()
  const profile = useLearnerStore((s) => s.profile)!
  const saveProfile = useLearnerStore((s) => s.saveProfile)
  const setRemoved = useLearnerStore((s) => s.setQuestionRemoved)
  const deleteData = useLearnerStore((s) => s.deleteQuestionData)
  const [selected, setSelectedIds] = useState<ReadonlySet<string>>(new Set())
  const [confirm, setConfirm] = useState<QuestionIndexEntry | null>(null)

  const entries = useMemo(
    () =>
      resolveSyllabus({
        defaults: defaultsForRoles(profile.selectedRoles),
        overrides: profile.syllabusOverrides,
        experience: profile.experience,
      }),
    [profile]
  )
  const removedModules = entries.filter((e) => e.removed)
  const chosen = removed.filter((q) => selected.has(q.id))

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <RemovedModules
        entries={removedModules}
        onRestore={(entry) =>
          void saveProfile({
            syllabusOverrides: setSelected(
              profile.syllabusOverrides,
              entry,
              true
            ),
          })
        }
      />

      <RemovedPlanBlocks mode="interview" />

      <section
        aria-labelledby="removed-questions-heading"
        className="space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="removed-questions-heading" className="text-sm font-medium">
            Removed questions ({removed.length})
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={chosen.length === 0}
            onClick={() => {
              for (const q of chosen) void setRemoved(q.id, false)
              setSelectedIds(new Set())
            }}
          >
            <Undo2Icon /> Restore selected ({chosen.length})
          </Button>
        </div>
        <QuestionPickerList
          questions={removed}
          selected={selected}
          onToggle={toggle}
          emptyText="Nothing removed. Questions you remove appear here and can be restored."
          renderAction={(q) => (
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void setRemoved(q.id, false)}
                aria-label={`Restore ${q.title}`}
              >
                Restore
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setConfirm(q)}
                aria-label={`Delete my notes and progress for ${q.title}`}
              >
                <Trash2Icon />
              </Button>
            </div>
          )}
        />
      </section>

      <AlertDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your notes and progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your note, confidence rating, completion
              and any saved HR answers for "{confirm?.title}". The question
              stays removed. It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep them</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (confirm) {
                  await deleteData(confirm.id)
                  await setRemoved(confirm.id, true) // the question itself stays removed
                }
                setConfirm(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
