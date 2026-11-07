import { KeyboardIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const SHORTCUTS: readonly {
  keys: string
  does: string
  typing?: boolean
}[] = [
  {
    keys: "Ctrl + Enter",
    does: "Save and go to the next question",
    typing: true,
  },
  {
    keys: "Esc",
    does: "Leave the answer box so the single keys below work",
    typing: true,
  },
  { keys: "N or →", does: "Next question" },
  { keys: "P or ←", does: "Previous question" },
  { keys: "H", does: "Show or hide the hint (when hints are on)" },
  { keys: "S", does: "Skip this question" },
  { keys: "R", does: "Reveal the model answer (when you are rating)" },
]

/** The keyboard shortcuts of a mock interview. Single keys do not fire while typing; Ctrl+Enter and Esc do. */
export function ShortcutsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <KeyboardIcon /> Keyboard shortcuts
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 space-y-2">
        <p className="text-sm font-medium">Keyboard shortcuts</p>
        <p className="text-xs text-muted-foreground">
          Single keys work outside the answer box. While you type, only Ctrl +
          Enter and Esc are active.
        </p>
        <dl className="space-y-1.5 text-sm">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex justify-between gap-3">
              <dt className="font-mono text-xs">{s.keys}</dt>
              <dd className="text-end text-xs text-muted-foreground">
                {s.does}
              </dd>
            </div>
          ))}
        </dl>
      </PopoverContent>
    </Popover>
  )
}
