import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Copies text; says so if the browser refuses instead of pretending it worked. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setState("copied")
    } catch {
      setState("failed")
    }
    setTimeout(() => setState("idle"), 1500)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={copy}
      aria-label={
        state === "copied"
          ? "Copied"
          : state === "failed"
            ? "Select and copy"
            : label
      }
    >
      {state === "copied" ? <CheckIcon /> : <CopyIcon />}
      {state === "copied"
        ? "Copied"
        : state === "failed"
          ? "Select and copy"
          : "Copy"}
    </Button>
  )
}
