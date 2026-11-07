import { useState } from "react"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/** A list of short tags: type one and press Enter or comma; each tag has a named remove button. */
export function TagsField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string[]
  onChange: (next: string[]) => void
}) {
  const [text, setText] = useState("")
  const add = () => {
    const parts = text
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    if (parts.length === 0) return
    onChange([...value, ...parts.filter((p) => !value.includes(p))])
    setText("")
  }
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <ul className="flex flex-wrap gap-1.5" aria-label={label}>
        {value.map((t) => (
          <li key={t}>
            <Button
              type="button"
              size="xs"
              variant="secondary"
              aria-label={`Remove ${t}`}
              onClick={() => onChange(value.filter((x) => x !== t))}
            >
              {t} <XIcon aria-hidden />
            </Button>
          </li>
        ))}
      </ul>
      <Input
        id={id}
        value={text}
        placeholder="Type one and press Enter"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            add()
          }
        }}
        onBlur={add}
      />
    </div>
  )
}
