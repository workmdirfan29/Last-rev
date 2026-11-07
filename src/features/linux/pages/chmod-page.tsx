import { useState } from "react"
import { useNavigate } from "react-router"
import { TerminalSquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PERMISSION_LEVELS } from "@/data/linux/reference"
import { CopyButton } from "../components/copy-button"
import {
  PERMISSION_BITS,
  PERMISSION_CLASSES,
  digitsToOctal,
  digitsToSymbolic,
  parseOctal,
  parseSymbolic,
  toggleBit,
  type PermissionDigits,
} from "../engine/permissions"
import { useLinux } from "../linux-context"

const CLASS_LABEL = {
  user: "Owner (user)",
  group: "Group",
  other: "Everyone else (other)",
} as const

/** A name safe to show in a command: quoted if it has spaces or shell characters. */
function shown(file: string): string {
  const name = file.trim() || "file.txt"
  return /^[\w./~-]+$/.test(name) ? name : `'${name.replace(/'/g, `'\\''`)}'`
}

export function ChmodPage() {
  const navigate = useNavigate()
  const { sendToTerminal } = useLinux()
  const [digits, setDigits] = useState<PermissionDigits>([7, 4, 2])
  const [octalText, setOctalText] = useState("742")
  const [symbolicText, setSymbolicText] = useState("rwxr---w-")
  const [file, setFile] = useState("file.txt")

  function apply(next: PermissionDigits) {
    setDigits(next)
    setOctalText(digitsToOctal(next))
    setSymbolicText(digitsToSymbolic(next))
  }

  const octal = digitsToOctal(digits)
  const command = `chmod ${octal} ${shown(file)}`
  const octalInvalid = parseOctal(octalText) === null
  const symbolicInvalid = parseSymbolic(symbolicText) === null

  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-sm text-muted-foreground">
        Every permission digit is{" "}
        <strong className="text-foreground">r=4 + w=2 + x=1</strong>. Tick the
        boxes, or type a number or the nine letters, and the other forms and the{" "}
        <code className="lr-inline-code">chmod</code> command update.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {PERMISSION_CLASSES.map((cls, index) => (
          <fieldset
            key={cls}
            className="space-y-3 rounded-xl border border-border bg-card p-4"
          >
            <legend className="px-1 text-sm font-medium">
              {CLASS_LABEL[cls]}
            </legend>
            {PERMISSION_BITS.map((bit) => {
              const id = `perm-${cls}-${bit.id}`
              return (
                <div key={bit.id} className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    checked={(digits[index] & bit.value) !== 0}
                    onCheckedChange={() =>
                      apply(toggleBit(digits, cls, bit.id))
                    }
                  />
                  <Label htmlFor={id} className="font-normal capitalize">
                    {bit.id}{" "}
                    <span className="text-xs text-muted-foreground">
                      (+{bit.value})
                    </span>
                  </Label>
                </div>
              )
            })}
          </fieldset>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="octal">Number (octal)</Label>
          <Input
            id="octal"
            inputMode="numeric"
            maxLength={4}
            value={octalText}
            aria-invalid={octalText !== "" && octalInvalid}
            onChange={(e) => {
              setOctalText(e.target.value)
              const parsed = parseOctal(e.target.value)
              if (parsed) {
                setDigits(parsed)
                setSymbolicText(digitsToSymbolic(parsed))
              }
            }}
            className="font-mono"
          />
          {octalInvalid && (
            <p role="alert" className="text-xs text-destructive">
              Use three digits from 0 to 7, such as 742.
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="symbolic">Letters (symbolic)</Label>
          <Input
            id="symbolic"
            maxLength={9}
            value={symbolicText}
            aria-invalid={symbolicText !== "" && symbolicInvalid}
            onChange={(e) => {
              setSymbolicText(e.target.value)
              const parsed = parseSymbolic(e.target.value)
              if (parsed) {
                setDigits(parsed)
                setOctalText(digitsToOctal(parsed))
              }
            }}
            className="font-mono"
          />
          {symbolicInvalid && (
            <p role="alert" className="text-xs text-destructive">
              Nine characters of r, w, x or -, such as rwxr---w-.
            </p>
          )}
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="chmod-file">File name</Label>
          <Input
            id="chmod-file"
            value={file}
            onChange={(e) => setFile(e.target.value)}
            className="font-mono sm:max-w-xs"
          />
        </div>
      </div>

      <section
        aria-label="Result"
        className="space-y-3 rounded-xl border border-border bg-card p-5 font-mono"
      >
        <p className="text-xs text-muted-foreground">
          octal → symbolic → command
        </p>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <output
            className="text-2xl font-semibold tracking-widest text-brand-ink"
            aria-label="Octal result"
          >
            {octal}
          </output>
          <output
            className="text-2xl tracking-widest"
            aria-label="Symbolic result"
          >
            {digitsToSymbolic(digits)}
          </output>
        </div>
        <pre
          tabIndex={0}
          className="lr-scroll overflow-x-auto text-sm"
          aria-label="Command"
        >
          <span className="text-brand-ink select-none">$ </span>
          {command}
        </pre>
        <div className="flex flex-wrap gap-2 font-sans">
          <CopyButton text={command} label="Copy chmod command" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              sendToTerminal(command)
              navigate("/linux/terminal")
            }}
          >
            <TerminalSquareIcon /> Try in the terminal
          </Button>
        </div>
      </section>

      <section aria-labelledby="perm-table" className="space-y-2">
        <h2 id="perm-table" className="text-sm font-medium">
          Number to letters
        </h2>
        <div className="lr-scroll overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th scope="col" className="px-4 py-2">
                  Number
                </th>
                <th scope="col" className="px-4 py-2">
                  Permission
                </th>
                <th scope="col" className="px-4 py-2">
                  Letters
                </th>
              </tr>
            </thead>
            <tbody>
              {PERMISSION_LEVELS.map((p) => (
                <tr key={p.digit} className="border-t border-border">
                  <td className="px-4 py-1.5 font-mono font-semibold text-brand-ink">
                    {p.digit}
                  </td>
                  <td className="px-4 py-1.5">{p.meaning}</td>
                  <td className="px-4 py-1.5 font-mono">{p.symbol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
