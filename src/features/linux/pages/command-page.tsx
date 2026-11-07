import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { ArrowLeftIcon, TerminalSquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EmptyState } from "@/components/shared/empty-state"
import { LINUX_CATEGORY_LABEL } from "@/data/linux/schema"
import { cn } from "@/lib/utils"
import { useLearnerStore } from "@/stores/learner-store"
import { CommandActions } from "../components/command-actions"
import { CopyButton } from "../components/copy-button"
import { SupportBadge } from "../components/support-badge"
import { commandBySlug } from "../library"
import { useLinux } from "../linux-context"

export function CommandPage() {
  const { slug } = useParams()
  const command = commandBySlug(slug)
  const navigate = useNavigate()
  const { sendToTerminal } = useLinux()
  const progress = useLearnerStore((s) =>
    command ? s.progress[command.id] : undefined
  )
  const markViewed = useLearnerStore((s) => s.markViewed)
  const setConfidence = useLearnerStore((s) => s.setConfidence)
  const setNote = useLearnerStore((s) => s.setNote)
  const [note, setNoteText] = useState(progress?.note ?? "")
  const id = command?.id

  useEffect(() => {
    if (id) void markViewed(id)
  }, [id, markViewed])

  if (!command) {
    return (
      <EmptyState
        title="Command not found"
        description="That command is not in the library."
        action={
          <Button asChild>
            <Link to="/linux">Back to commands</Link>
          </Button>
        }
      />
    )
  }

  return (
    <article className="max-w-3xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ms-2">
        <Link to="/linux">
          <ArrowLeftIcon /> All commands
        </Link>
      </Button>

      <header className="space-y-2">
        <p className="text-xs text-muted-foreground">
          #{command.number} · {LINUX_CATEGORY_LABEL[command.category]}
          {command.direction && ` · ${command.direction}`}
        </p>
        <h2 className="font-mono text-xl font-semibold break-words">
          {command.syntax}
        </h2>
        <p className="text-sm text-muted-foreground">{command.description}</p>
        {command.note && (
          <p className="text-sm text-muted-foreground italic">{command.note}</p>
        )}
        {command.caution && (
          <p role="note" className="text-sm text-warning">
            The reference marks this command as dangerous: it skips
            confirmation.
          </p>
        )}
      </header>

      <section aria-labelledby="example-heading" className="space-y-2">
        <h3 id="example-heading" className="lr-eyebrow">
          Example
        </h3>
        <pre
          tabIndex={0}
          aria-label="Command"
          className="lr-scroll overflow-x-auto rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm"
        >
          <span className="text-brand-ink select-none">$ </span>
          {command.example}
        </pre>
        <div className="flex flex-wrap items-center gap-2">
          <SupportBadge example={command.example} />
          <CopyButton text={command.example} label="Copy example" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              sendToTerminal(command.example)
              navigate("/linux/terminal")
            }}
          >
            <TerminalSquareIcon /> Try in the terminal
          </Button>
        </div>
      </section>

      {command.erratum && (
        <section
          aria-labelledby="erratum-heading"
          className="space-y-2 rounded-xl border border-warning/40 bg-warning/10 p-4"
        >
          <h3 id="erratum-heading" className="text-sm font-medium">
            Corrected from your reference
          </h3>
          <p className="text-sm text-muted-foreground">
            {command.erratum.note}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Reference said:</span>{" "}
            {command.erratum.original}
          </p>
        </section>
      )}

      <section
        aria-labelledby="progress-heading"
        className="space-y-4 rounded-xl border border-border bg-card p-4"
      >
        <h3 id="progress-heading" className="text-sm font-medium">
          Your progress
        </h3>
        <CommandActions command={command} />
        <div className="space-y-1.5" role="group" aria-label="Your confidence">
          <p className="text-xs font-medium">How confident are you? (1 to 5)</p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Button
                key={n}
                type="button"
                size="sm"
                variant={progress?.confidence === n ? "default" : "outline"}
                aria-pressed={progress?.confidence === n}
                onClick={() => void setConfidence(command.id, n)}
                className={cn("w-9")}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="command-note">Your notes</Label>
          <Textarea
            id="command-note"
            rows={3}
            value={note}
            onChange={(e) => setNoteText(e.target.value)}
            onBlur={() =>
              note !== (progress?.note ?? "") && void setNote(command.id, note)
            }
            placeholder="Anything you want to remember about this command"
          />
        </div>
      </section>
    </article>
  )
}
