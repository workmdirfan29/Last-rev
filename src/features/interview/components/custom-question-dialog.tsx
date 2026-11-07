import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { MODULES } from "@/data/catalog/modules"
import {
  EXPERIENCE_LEVELS,
  LEVEL_META,
  type ExperienceLevel,
} from "@/types/content"
import { useLearnerStore } from "@/stores/learner-store"
import type { CustomQuestion } from "@/types/learner"

const MODULE_OPTIONS = MODULES.filter((m) => m.domainId !== "career").sort(
  (a, b) => a.title.localeCompare(b.title)
)

interface Draft {
  title: string
  moduleId: string
  level: ExperienceLevel
  answer: string
  tags: string
  note: string
}

const blank = (): Draft => ({
  title: "",
  moduleId: "",
  level: "fresher",
  answer: "",
  tags: "",
  note: "",
})
const fromQuestion = (q: CustomQuestion): Draft => ({
  title: q.title,
  moduleId: q.moduleId,
  level: q.level,
  answer: q.answer,
  tags: q.tags.join(", "),
  note: q.note,
})

/** Add or edit one of the learner's own questions. The form resets each time it opens. */
export function CustomQuestionDialog({
  open,
  onOpenChange,
  question,
  defaultModuleId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present when editing. */
  question?: CustomQuestion
  defaultModuleId?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
        {open && (
          <Form
            key={question?.id ?? "new"}
            question={question}
            defaultModuleId={defaultModuleId}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function Form({
  question,
  defaultModuleId,
  onDone,
}: {
  question?: CustomQuestion
  defaultModuleId?: string
  onDone: () => void
}) {
  const add = useLearnerStore((s) => s.addCustomQuestion)
  const update = useLearnerStore((s) => s.updateCustomQuestion)
  const [draft, setDraft] = useState<Draft>(() =>
    question
      ? fromQuestion(question)
      : { ...blank(), moduleId: defaultModuleId ?? "" }
  )
  const [errors, setErrors] = useState<{ title?: string; moduleId?: string }>(
    {}
  )
  const patch = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }))

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (draft.title.trim().length < 3)
      next.title = "Write the question (at least 3 characters)."
    if (!draft.moduleId)
      next.moduleId = "Choose the module this question belongs to."
    setErrors(next)
    if (Object.keys(next).length) return
    const tags = [
      ...new Set(
        draft.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      ),
    ].slice(0, 12)
    if (question) {
      await update(question.id, {
        title: draft.title.trim(),
        moduleId: draft.moduleId,
        level: draft.level,
        answer: draft.answer,
        tags,
        note: draft.note,
      })
    } else {
      await add({
        title: draft.title,
        moduleId: draft.moduleId,
        level: draft.level,
        answer: draft.answer,
        tags,
        note: draft.note,
      })
    }
    onDone()
  }

  return (
    <form onSubmit={save} className="space-y-4" noValidate>
      <DialogHeader>
        <DialogTitle>
          {question ? "Edit your question" : "Add your own question"}
        </DialogTitle>
        <DialogDescription>
          It is saved on this device, labelled "Yours", and tracked like any
          other question.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-1.5">
        <Label htmlFor="cq-title">Question</Label>
        <Input
          id="cq-title"
          value={draft.title}
          onChange={(e) => patch({ title: e.target.value })}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "cq-title-error" : undefined}
          maxLength={200}
        />
        {errors.title && (
          <p
            id="cq-title-error"
            role="alert"
            className="text-xs text-destructive"
          >
            {errors.title}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cq-module">Module</Label>
          <Select
            value={draft.moduleId}
            onValueChange={(v) => patch({ moduleId: v })}
          >
            <SelectTrigger
              id="cq-module"
              aria-invalid={!!errors.moduleId}
              aria-describedby={errors.moduleId ? "cq-module-error" : undefined}
              className="w-full"
            >
              <SelectValue placeholder="Choose a module" />
            </SelectTrigger>
            <SelectContent>
              {MODULE_OPTIONS.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.moduleId && (
            <p
              id="cq-module-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {errors.moduleId}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cq-level">Level</Label>
          <Select
            value={draft.level}
            onValueChange={(v) => patch({ level: v as ExperienceLevel })}
          >
            <SelectTrigger id="cq-level" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((l) => (
                <SelectItem key={l} value={l}>
                  {LEVEL_META[l].label} ({LEVEL_META[l].experience})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cq-answer">
          Your answer{" "}
          <span className="font-normal text-muted-foreground">
            (simple markdown: blank line for a new paragraph, - for a list,
            **bold**, `code`)
          </span>
        </Label>
        <Textarea
          id="cq-answer"
          rows={6}
          value={draft.answer}
          onChange={(e) => patch({ answer: e.target.value })}
          maxLength={20000}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cq-tags">
            Tags{" "}
            <span className="font-normal text-muted-foreground">
              (optional, comma separated)
            </span>
          </Label>
          <Input
            id="cq-tags"
            value={draft.tags}
            onChange={(e) => patch({ tags: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cq-note">
            Note{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Input
            id="cq-note"
            value={draft.note}
            onChange={(e) => patch({ note: e.target.value })}
            maxLength={5000}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit">
          {question ? "Save changes" : "Add question"}
        </Button>
      </DialogFooter>
    </form>
  )
}
