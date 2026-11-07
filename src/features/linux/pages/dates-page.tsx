import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { TerminalSquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DATE_SPECIFIERS } from "@/data/linux/reference"
import { CopyButton } from "../components/copy-button"
import { formatDate, parseRelativeDate } from "../engine/date"
import { useLinux } from "../linux-context"

/** The clock, ticking each second, so the values behave like running `date`. */
function useNow(): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

export function DatesPage() {
  const now = useNow()
  const navigate = useNavigate()
  const { sendToTerminal } = useLinux()
  const [format, setFormat] = useState("%d-%m-%Y")
  const [relative, setRelative] = useState("tomorrow")

  const relativeDate = parseRelativeDate(relative, now)
  const formatCommand = `date +'${format}'`
  const relativeCommand = `date --date "${relative}" +'${format}'`

  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Values come from your computer's clock, like running{" "}
        <code className="lr-inline-code">date +'%X'</code>. They update every
        second.
      </p>

      <section
        aria-labelledby="builder-heading"
        className="max-w-3xl space-y-4 rounded-xl border border-border bg-card p-5"
      >
        <h2 id="builder-heading" className="text-sm font-medium">
          Try your own format
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="date-format">Format</Label>
            <Input
              id="date-format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="font-mono"
              spellCheck={false}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date-relative">Relative date (optional)</Label>
            <Input
              id="date-relative"
              value={relative}
              onChange={(e) => setRelative(e.target.value)}
              className="font-mono"
              spellCheck={false}
              placeholder="tomorrow, 2 year ago, next tue"
            />
          </div>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="lr-eyebrow">Now</dt>
            <dd
              className="mt-1 font-mono text-brand-ink"
              data-testid="format-result"
            >
              {formatDate(now, format)}
            </dd>
          </div>
          <div>
            <dt className="lr-eyebrow">For "{relative}"</dt>
            <dd className="mt-1 font-mono" data-testid="relative-result">
              {relativeDate
                ? formatDate(relativeDate, format)
                : "Not understood. Try tomorrow, yesterday, 2 year ago, 5 sec ago or next tue."}
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2">
          <CopyButton text={formatCommand} label="Copy date command" />
          <CopyButton
            text={relativeCommand}
            label="Copy relative date command"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              sendToTerminal(formatCommand)
              navigate("/linux/terminal")
            }}
          >
            <TerminalSquareIcon /> Try in the terminal
          </Button>
        </div>
      </section>

      <section aria-labelledby="specifiers-heading" className="space-y-3">
        <h2 id="specifiers-heading" className="text-sm font-medium">
          Format specifiers
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DATE_SPECIFIERS.map((s) => (
            <li
              key={s.token}
              className="rounded-xl border border-border bg-card p-4"
            >
              <code className="font-mono text-brand-ink">{s.token}</code>
              <p className="mt-1 text-xs text-muted-foreground">
                {s.description}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                <span className="font-mono text-xs text-muted-foreground">
                  date +'{s.token}'
                </span>
                <span className="font-mono font-semibold tabular-nums">
                  {formatDate(now, s.token)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
