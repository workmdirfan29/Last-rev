import { useMemo, useRef, useState } from "react"
import { DownloadIcon, UploadIcon } from "lucide-react"
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
import { RESUME_SECTION_LABEL } from "@/data/catalog/modules/resume"
import {
  buildQuestionSet,
  parseQuestionSet,
  planImport,
  type ImportPlan,
} from "@/services/resume/question-set"
import { useLearnerStore } from "@/stores/learner-store"
import type { QuestionSet, ResumeSection } from "@/types/learner"
import { useResume } from "./use-resume"

/** Export your resume questions as a file, import someone's set (with a preview first), and remove an imported set. */
export function SetsPanel() {
  const { resume, questions } = useResume()
  const setQuestions = useLearnerStore((s) => s.setResumeQuestions)
  const deleteQuestions = useLearnerStore((s) => s.deleteResumeQuestions)
  const [name, setName] = useState("My resume questions")
  const [includeProfile, setIncludeProfile] = useState(false)
  const [preview, setPreview] = useState<{
    plan: ImportPlan
    set: QuestionSet
    file: string
  } | null>(null)
  const [removing, setRemoving] = useState<{
    setId: string
    label: string
    ids: string[]
  } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const own = questions.filter((q) => q.setId === "" && q.status === "active")
  const sets = useMemo(() => {
    const map = new Map<
      string,
      { setId: string; label: string; ids: string[] }
    >()
    for (const q of questions)
      if (q.setId !== "") {
        const cur = map.get(q.setId) ?? {
          setId: q.setId,
          label: q.setLabel,
          ids: [],
        }
        cur.ids.push(q.id)
        map.set(q.setId, cur)
      }
    return [...map.values()]
  }, [questions])

  function download() {
    const set = buildQuestionSet(questions, resume, {
      name,
      includeProfile,
      now: new Date(),
    })
    const blob = new Blob([JSON.stringify(set, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lastrev-question-set-${set.exportedAt.slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${set.questions.length} questions`)
  }

  async function onFile(file: File | undefined) {
    if (!file) return
    const text = await file.text()
    if (fileRef.current) fileRef.current.value = ""
    const parsed = parseQuestionSet(text)
    if (!parsed.ok) {
      toast.error(parsed.error)
      return
    }
    setPreview({
      set: parsed.set,
      file: file.name,
      plan: planImport(
        parsed.set,
        questions,
        file.name,
        new Date().toISOString()
      ),
    })
  }

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="export-heading"
        className="space-y-3 rounded-xl border border-border bg-card p-4"
      >
        <h3 id="export-heading" className="text-sm font-medium">
          Export your questions
        </h3>
        <p className="text-xs text-muted-foreground">
          The file holds the questions and their outlines ({own.length}{" "}
          questions). The wording of the questions includes text from your
          resume, such as company and project names. It does not include your
          notes or answers.
        </p>
        <div className="space-y-1.5 sm:max-w-sm">
          <Label htmlFor="set-name">Name of the set</Label>
          <Input
            id="set-name"
            value={name}
            maxLength={200}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="include-profile"
            checked={includeProfile}
            onCheckedChange={(v) => setIncludeProfile(v === true)}
            disabled={!resume}
            className="mt-0.5"
          />
          <Label htmlFor="include-profile" className="font-normal">
            Include my resume profile
            <span className="block text-xs text-muted-foreground">
              Off by default. The profile has your whole resume text, so only
              tick this for a file you keep yourself.
            </span>
          </Label>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={own.length === 0}
          onClick={download}
        >
          <DownloadIcon /> Export question set
        </Button>
      </section>

      <section
        aria-labelledby="import-heading"
        className="space-y-3 rounded-xl border border-border bg-card p-4"
      >
        <h3 id="import-heading" className="text-sm font-medium">
          Import a question set
        </h3>
        <p className="text-xs text-muted-foreground">
          You see what will be added before anything is saved. Imported
          questions are labelled with the file they came from and can be removed
          as a set.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
        >
          <UploadIcon /> Choose a question set file
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Choose a question set file"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
      </section>

      <section aria-labelledby="sets-heading" className="space-y-2">
        <h3 id="sets-heading" className="text-sm font-medium">
          Imported sets ({sets.length})
        </h3>
        {sets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No imported sets.</p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {sets.map((s) => (
              <li
                key={s.setId}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
              >
                <span>
                  {s.label}{" "}
                  <span className="text-muted-foreground">
                    · {s.ids.length} questions
                  </span>
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={`Remove the set ${s.label}`}
                  onClick={() => setRemoving(s)}
                >
                  Remove set
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AlertDialog
        open={preview !== null}
        onOpenChange={(o) => !o && setPreview(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import this question set?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm" data-testid="import-preview">
                <p>
                  <strong>{preview?.plan.toAdd.length}</strong> questions will
                  be added from {preview?.file}
                  {preview && preview.set.name
                    ? ` ("${preview.set.name}")`
                    : ""}
                  . <strong>{preview?.plan.duplicates}</strong> already in your
                  bank are skipped.
                </p>
                <ul className="list-disc ps-5">
                  {preview &&
                    Object.entries(preview.plan.bySection).map(([s, n]) => (
                      <li key={s}>
                        {RESUME_SECTION_LABEL[s as ResumeSection]}: {n}
                      </li>
                    ))}
                </ul>
                {preview?.set.profile && (
                  <p className="text-muted-foreground">
                    This file also contains a resume profile. It is not
                    imported.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!preview || preview.plan.toAdd.length === 0}
              onClick={() => {
                if (!preview) return
                void setQuestions([...questions, ...preview.plan.toAdd]).then(
                  () => toast(`Added ${preview.plan.toAdd.length} questions`)
                )
              }}
            >
              Add to my bank
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={removing !== null}
        onOpenChange={(o) => !o && setRemoving(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this set?</AlertDialogTitle>
            <AlertDialogDescription>
              The {removing?.ids.length} questions from {removing?.label} are
              removed, with your notes, progress and saved answers for them. It
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removing && void deleteQuestions(removing.ids)}
            >
              Remove set
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
