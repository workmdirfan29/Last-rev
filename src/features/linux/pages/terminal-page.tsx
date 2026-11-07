import { RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TerminalView } from "../terminal/terminal-view"
import { useLinux } from "../linux-context"

/** Starter lines, all taken from the reference file's own examples. */
const STARTERS = [
  "help",
  "ls -lrth",
  "cat file.txt",
  "wc -l file.txt",
  "date +'%d-%m-%Y'",
  "mkdir mydir",
]

export function TerminalPage() {
  const { terminal, prefill, sendToTerminal } = useLinux()

  return (
    <div className="space-y-4">
      <p className="max-w-3xl text-sm text-muted-foreground">
        A safe simulation over a small virtual filesystem. It never runs real
        commands, reads your files or uses the network. Commands it cannot
        simulate say so instead of guessing, and system views such as{" "}
        <code className="lr-inline-code">df</code> and{" "}
        <code className="lr-inline-code">free</code> show labelled sample
        output.
      </p>

      <div
        className="flex flex-wrap items-center gap-2"
        aria-label="Starter commands"
        role="group"
      >
        {STARTERS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => sendToTerminal(cmd)}
            className={cn(
              "rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors",
              "hover:text-foreground"
            )}
          >
            {cmd}
          </button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ms-auto"
          onClick={() => {
            terminal.reset()
            sendToTerminal("")
          }}
        >
          <RotateCcwIcon /> Reset sandbox
        </Button>
      </div>

      {/* Keyed by the prefill so choosing a starter puts it in the input. */}
      <TerminalView key={prefill} session={terminal} initialValue={prefill} />
    </div>
  )
}
