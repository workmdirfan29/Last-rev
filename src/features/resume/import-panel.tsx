import { useRef, useState } from "react"
import { FileTextIcon, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { textToLines } from "@/services/resume/parse"
import {
  READ_ERROR_MESSAGE,
  ResumeReadError,
  readPdfFile,
} from "@/services/resume/pdf-reader"

interface Loaded {
  name: string
  lines: string[]
  detail: string
  columns: number
  /** The PDF, kept in memory only so it can be read again as one column. Never stored. */
  file: File | null
}

/**
 * Choose a PDF or paste text. The text lives only in this component's memory until "Build my profile";
 * nothing is stored or sent anywhere before the learner has reviewed it.
 */
export function ImportPanel({
  onBuild,
  busy,
}: {
  onBuild: (lines: string[], sourceName: string) => void
  busy: boolean
}) {
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reading, setReading] = useState(false)
  const [pasted, setPasted] = useState("")
  const pdfRef = useRef<HTMLInputElement>(null)
  const txtRef = useRef<HTMLInputElement>(null)
  const [oneColumn, setOneColumn] = useState(false)

  async function readPdf(file: File, columnAware: boolean) {
    setReading(true)
    setError(null)
    try {
      const r = await readPdfFile(file, columnAware)
      setLoaded({
        name: file.name,
        lines: r.lines,
        columns: r.columns,
        file,
        detail: `Read ${r.lines.length} lines from ${r.pages} ${r.pages === 1 ? "page" : "pages"}${r.columns > 1 ? ", read as 2 columns" : ""}.`,
      })
    } catch (e) {
      setLoaded(null)
      setError(
        e instanceof ResumeReadError ? e.message : READ_ERROR_MESSAGE.unreadable
      )
    } finally {
      setReading(false)
    }
  }

  async function onPdf(file: File | undefined) {
    if (!file) return
    setOneColumn(false)
    await readPdf(file, true)
    if (pdfRef.current) pdfRef.current.value = ""
  }

  async function onTxt(file: File | undefined) {
    if (!file) return
    const text = await file.text()
    if (txtRef.current) txtRef.current.value = ""
    takeText(text, file.name)
  }

  function takeText(text: string, name = "pasted text") {
    const lines = textToLines(text)
    if (lines.every((l) => l.trim() === "")) {
      setError("There is no text to use. Paste your resume text first.")
      return
    }
    setError(null)
    setLoaded({
      name,
      lines,
      columns: 1,
      file: null,
      detail: `Using ${lines.filter((l) => l.trim()).length} lines of text.`,
    })
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <section
          aria-labelledby="pdf-heading"
          className="space-y-3 rounded-xl border border-border bg-card p-4"
        >
          <h3
            id="pdf-heading"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <FileTextIcon className="size-4" aria-hidden /> Choose a PDF
          </h3>
          <p className="text-xs text-muted-foreground">
            The PDF is read in this browser and is never uploaded or stored.
            Only text you can select in the PDF can be read.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => pdfRef.current?.click()}
            disabled={reading}
          >
            <UploadIcon /> {reading ? "Reading..." : "Choose a PDF"}
          </Button>
          <input
            ref={pdfRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            aria-label="Choose your resume PDF"
            onChange={(e) => void onPdf(e.target.files?.[0])}
          />
        </section>

        <section
          aria-labelledby="paste-heading"
          className="space-y-3 rounded-xl border border-border bg-card p-4"
        >
          <h3 id="paste-heading" className="text-sm font-medium">
            Paste your resume text
          </h3>
          <Label htmlFor="paste-text" className="sr-only">
            Resume text
          </Label>
          <Textarea
            id="paste-text"
            rows={5}
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            placeholder="Paste the text of your resume here, with a heading such as EXPERIENCE above each section."
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => takeText(pasted)}
            >
              Use this text
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => txtRef.current?.click()}
            >
              Import a .txt file
            </Button>
            <input
              ref={txtRef}
              type="file"
              accept="text/plain,.txt"
              className="sr-only"
              aria-label="Choose a text file"
              onChange={(e) => void onTxt(e.target.files?.[0])}
            />
          </div>
        </section>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm"
        >
          {error}
        </p>
      )}

      {loaded && (
        <section
          aria-label="What was read"
          className="space-y-3 rounded-xl border border-border bg-card p-4"
        >
          <p role="status" className="text-sm" data-testid="read-detail">
            {loaded.detail}
          </p>
          {loaded.file && loaded.columns > 1 && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="one-column"
                checked={oneColumn}
                onCheckedChange={(v) => {
                  setOneColumn(v === true)
                  void readPdf(loaded.file!, v !== true)
                }}
              />
              <Label htmlFor="one-column" className="font-normal">
                Read as one column instead
              </Label>
            </div>
          )}
          <details className="text-sm">
            <summary className="cursor-pointer">
              See the text that was read
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-muted/40 p-3 text-xs whitespace-pre-wrap">
              {loaded.lines.join("\n")}
            </pre>
          </details>
          <p className="text-xs text-muted-foreground">
            Reading is best effort. Next you check every section and fix what is
            wrong before any question is made.
          </p>
          <Button
            type="button"
            size="lg"
            disabled={busy}
            onClick={() => onBuild(loaded.lines, loaded.name)}
          >
            Build my profile
          </Button>
        </section>
      )}
    </div>
  )
}
