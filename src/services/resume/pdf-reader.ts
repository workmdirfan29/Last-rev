import {
  buildLines,
  nonLatinShare,
  type PageText,
  type ReadResult,
} from "./extract"

export const MAX_PDF_BYTES = 10 * 1024 * 1024
export const MAX_PDF_PAGES = 10

export type ReadErrorCode =
  | "too-large"
  | "too-many-pages"
  | "password"
  | "no-text"
  | "non-latin"
  | "unreadable"

/** Plain messages for every way reading can fail. They never include any of the file's text. */
export const READ_ERROR_MESSAGE: Record<ReadErrorCode, string> = {
  "too-large":
    "This file is larger than 10 MB. Paste your resume text instead.",
  "too-many-pages":
    "This PDF has more than 10 pages, which is too long for a resume. Paste your resume text instead.",
  password:
    "This PDF is password protected. Remove the password and try again.",
  "no-text": "This PDF has no selectable text. Paste your resume text instead.",
  "non-latin":
    "Most of this resume is not in Latin script, which the reader does not support yet. Paste the text instead and check each section.",
  unreadable:
    "This file could not be read as a PDF. Paste your resume text instead.",
}

export class ResumeReadError extends Error {
  readonly code: ReadErrorCode
  constructor(code: ReadErrorCode) {
    super(READ_ERROR_MESSAGE[code])
    this.code = code
  }
}

/** The part of a pdf.js document the reader uses, so tests can supply the Node build. */
export interface PdfDocumentLike {
  numPages: number
  getPage(n: number): Promise<{
    getViewport(o: { scale: number }): { width: number }
    getTextContent(): Promise<{
      items: readonly (
        { str: string; transform: number[]; width: number } | object
      )[]
    }>
  }>
}

/** Turn a pdf.js document into lines. Throws ResumeReadError for pages over the limit and for empty or non-Latin text. */
export async function readDocument(
  doc: PdfDocumentLike,
  columnAware = true
): Promise<ReadResult> {
  if (doc.numPages > MAX_PDF_PAGES) throw new ResumeReadError("too-many-pages")
  const pages: PageText[] = []
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n)
    const content = await page.getTextContent()
    pages.push({
      width: page.getViewport({ scale: 1 }).width,
      items: content.items.flatMap((i) =>
        "str" in i
          ? [
              {
                str: i.str,
                x: i.transform[4],
                y: i.transform[5],
                w: i.width,
                h: Math.abs(i.transform[3]),
              },
            ]
          : []
      ),
    })
  }
  const result = buildLines(pages, columnAware)
  if (result.characters === 0 || result.lines.length === 0)
    throw new ResumeReadError("no-text")
  if (nonLatinShare(result.lines) > 0.3) throw new ResumeReadError("non-latin")
  return result
}

/**
 * Read a PDF the learner chose, entirely in this browser. pdf.js is loaded only now (not with the rest of the
 * app) and runs in its own worker. Nothing is fetched: no remote fonts or maps, no range or streaming requests.
 */
export async function readPdfFile(
  file: File,
  columnAware = true
): Promise<ReadResult> {
  if (file.size > MAX_PDF_BYTES) throw new ResumeReadError("too-large")
  const data = new Uint8Array(await file.arrayBuffer())
  try {
    const [pdfjs, worker] = await Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
    ])
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default
    const task = pdfjs.getDocument({
      data,
      disableAutoFetch: true,
      disableStream: true,
      disableRange: true,
      useSystemFonts: true,
    })
    try {
      const doc = await task.promise
      return await readDocument(doc as unknown as PdfDocumentLike, columnAware)
    } finally {
      void task.destroy()
    }
  } catch (error) {
    if (error instanceof ResumeReadError) throw error
    if ((error as { name?: string } | null)?.name === "PasswordException")
      throw new ResumeReadError("password")
    throw new ResumeReadError("unreadable")
  }
}
