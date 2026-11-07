import { useEffect, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLearnerStore } from "@/stores/learner-store"

/** Autosaving personal note. Mount with `key={questionId}` so state resets per question. */
export function NotesEditor({ questionId }: { questionId: string }) {
  const saved = useLearnerStore((s) => s.progress[questionId]?.note ?? "")
  const setNote = useLearnerStore((s) => s.setNote)
  const [value, setValue] = useState(saved)
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")
  const latest = useRef(value)
  const dirty = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function flush() {
    if (!dirty.current) return
    dirty.current = false
    setStatus("saving")
    await setNote(questionId, latest.current)
    setStatus("saved")
  }

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
      if (dirty.current) void setNote(questionId, latest.current)
    }
  }, [questionId, setNote])

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={`note-${questionId}`}>Your notes</Label>
        <span
          className="text-[0.6875rem] text-muted-foreground"
          aria-live="polite"
        >
          {status === "saving"
            ? "Saving…"
            : status === "saved"
              ? "Saved on this device"
              : ""}
        </span>
      </div>
      <Textarea
        id={`note-${questionId}`}
        value={value}
        rows={4}
        placeholder="Write the answer in your own words, or what you want to remember…"
        onChange={(e) => {
          setValue(e.target.value)
          latest.current = e.target.value
          dirty.current = true
          setStatus("idle")
          if (timer.current) clearTimeout(timer.current)
          timer.current = setTimeout(() => void flush(), 600)
        }}
        onBlur={() => void flush()}
      />
    </div>
  )
}
