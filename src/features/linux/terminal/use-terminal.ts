import { useCallback, useState } from "react"
import { Sandbox, type OutLine } from "../engine/sandbox"

export type TranscriptEntry =
  | { id: number; kind: "cmd"; prompt: string; text: string }
  | { id: number; kind: OutLine["kind"]; text: string }

export interface TerminalSession {
  sandbox: Sandbox
  transcript: TranscriptEntry[]
  /** Run one typed line. Returns the sandbox so callers can inspect the new state. */
  run: (line: string) => Sandbox
  /** Ctrl+D: finish a `cat > file` session. */
  endInput: () => void
  clear: () => void
  /** Start over with a fresh filesystem. */
  reset: () => void
}

const INTRO: OutLine[] = [
  {
    kind: "info",
    text: "Practice terminal. Everything here is simulated: no real command runs and nothing leaves this page.",
  },
  { kind: "info", text: "Type help to see what is supported." },
]

let nextId = 1
const entries = (lines: OutLine[]): TranscriptEntry[] =>
  lines.map((l) => ({ id: nextId++, ...l }))

/** One practice terminal: a sandbox plus the transcript the learner sees. */
export function useTerminal(): TerminalSession {
  const [sandbox, setSandbox] = useState(() => new Sandbox())
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(() =>
    entries(INTRO)
  )

  const run = useCallback(
    (line: string) => {
      const prompt = sandbox.prompt
      const result = sandbox.run(line)
      setTranscript((t) => {
        if (result.clear) return []
        return [
          ...t,
          { id: nextId++, kind: "cmd", prompt, text: line },
          ...entries(result.lines),
        ]
      })
      return sandbox
    },
    [sandbox]
  )

  const endInput = useCallback(() => {
    const prompt = sandbox.prompt
    const result = sandbox.endInput()
    setTranscript((t) => [
      ...t,
      { id: nextId++, kind: "cmd", prompt, text: "^D" },
      ...entries(result.lines),
    ])
  }, [sandbox])

  const clear = useCallback(() => setTranscript([]), [])

  const reset = useCallback(() => {
    setSandbox(new Sandbox())
    setTranscript(entries(INTRO))
  }, [])

  return { sandbox, transcript, run, endInput, clear, reset }
}
