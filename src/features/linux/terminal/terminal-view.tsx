import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { cn } from "@/lib/utils"
import type { TerminalSession } from "./use-terminal"

const KIND_CLASS = {
  cmd: "text-foreground",
  out: "text-foreground/90",
  err: "text-destructive",
  info: "text-warning",
} as const

/**
 * The terminal screen: transcript, prompt and input. It knows nothing about
 * what the commands do; the session's sandbox does.
 */
export function TerminalView({
  session,
  initialValue = "",
  height = "h-[52vh]",
}: {
  session: TerminalSession
  /** Text to put in the input, e.g. an example sent from the command library. */
  initialValue?: string
  height?: string
}) {
  const [value, setValue] = useState(initialValue)
  const [historyIndex, setHistoryIndex] = useState(-1)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { sandbox, transcript } = session

  useEffect(() => {
    if (outputRef.current)
      outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [transcript])

  useEffect(() => {
    if (initialValue) inputRef.current?.focus()
  }, [initialValue])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    session.run(value)
    setValue("")
    setHistoryIndex(-1)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const history = sandbox.history
    if (e.key === "ArrowUp" && !sandbox.awaitingInput) {
      e.preventDefault()
      const next = Math.min(historyIndex + 1, history.length - 1)
      if (next >= 0) {
        setHistoryIndex(next)
        setValue(history[history.length - 1 - next])
      }
    } else if (e.key === "ArrowDown" && !sandbox.awaitingInput) {
      e.preventDefault()
      const next = Math.max(historyIndex - 1, -1)
      setHistoryIndex(next)
      setValue(next < 0 ? "" : history[history.length - 1 - next])
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault()
      session.clear()
    } else if (
      e.ctrlKey &&
      e.key.toLowerCase() === "d" &&
      sandbox.awaitingInput === "write"
    ) {
      e.preventDefault()
      session.endInput()
      setValue("")
    }
  }

  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-background"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={outputRef}
        role="log"
        aria-label="Terminal output"
        aria-live="polite"
        tabIndex={0}
        className={cn(
          "lr-scroll overflow-y-auto p-4 font-mono text-[0.8125rem] leading-relaxed",
          height
        )}
      >
        {transcript.map((entry) =>
          entry.kind === "cmd" ? (
            <div key={entry.id} className="break-all whitespace-pre-wrap">
              <span className="text-brand-ink">{entry.prompt} </span>
              <span className={KIND_CLASS.cmd}>{entry.text}</span>
            </div>
          ) : (
            <div
              key={entry.id}
              className={cn(
                "break-words whitespace-pre-wrap",
                KIND_CLASS[entry.kind]
              )}
            >
              {entry.text || " "}
            </div>
          )
        )}
      </div>
      <form
        onSubmit={submit}
        className="flex items-center gap-2 border-t border-border px-4 py-3 font-mono text-[0.8125rem]"
      >
        <label htmlFor="terminal-input" className="shrink-0 text-brand-ink">
          {sandbox.prompt || "?"}
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
          placeholder={
            sandbox.awaitingInput === "write"
              ? "Type text, then EOF to finish"
              : "Type a command and press Enter"
          }
        />
      </form>
    </div>
  )
}
