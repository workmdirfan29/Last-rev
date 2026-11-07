import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useTerminal, type TerminalSession } from "./terminal/use-terminal"

interface LinuxContextValue {
  /** The free-practice terminal; it keeps its state while the learner moves between tabs. */
  terminal: TerminalSession
  /** A command waiting in the terminal's input, sent from the library or a calculator. */
  prefill: string
  sendToTerminal: (command: string) => void
}

const LinuxContext = createContext<LinuxContextValue | null>(null)

export function LinuxProvider({ children }: { children: ReactNode }) {
  const terminal = useTerminal()
  const [prefill, setPrefill] = useState("")
  const value = useMemo(
    () => ({ terminal, prefill, sendToTerminal: setPrefill }),
    [terminal, prefill]
  )
  return <LinuxContext.Provider value={value}>{children}</LinuxContext.Provider>
}

export function useLinux(): LinuxContextValue {
  const ctx = useContext(LinuxContext)
  if (!ctx) throw new Error("useLinux must be used inside <LinuxProvider>")
  return ctx
}
