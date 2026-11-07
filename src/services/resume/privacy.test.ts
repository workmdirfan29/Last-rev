import { describe, expect, it } from "vitest"
import { MODULES } from "@/data/catalog/modules"
import {
  defaultsForRoles,
  orderedModuleIds,
} from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import { ROLE_ORDER } from "@/data/curriculum/role-relevance"
import { RESUME_SECTIONS, resumeModuleId } from "@/types/learner"

const sources = import.meta.glob(
  [
    "/src/features/resume/*.{ts,tsx}",
    "/src/services/resume/*.{ts,tsx}",
    "/src/data/resume/*.ts",
    "/src/services/content/own-questions.ts",
  ],
  { query: "?raw", import: "default", eager: true }
) as Record<string, string>
const files = Object.entries(sources).filter(
  ([p]) => !/\.test\.tsx?$/.test(p) && !p.includes("/test/")
)
const strip = (t: string) =>
  t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")

describe("the resume feature keeps your resume on this device", () => {
  it("has source files to check", () => {
    expect(files.length).toBeGreaterThanOrEqual(8)
  })

  it("makes no network request: no fetch, XMLHttpRequest, WebSocket, EventSource or sendBeacon in its code", () => {
    for (const [path, text] of files)
      expect(
        strip(text).match(
          /\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\b/
        )?.[0] ?? null,
        path
      ).toBeNull()
  })

  it("never writes to the console", () => {
    for (const [path, text] of files)
      expect(strip(text).match(/\bconsole\s*\./)?.[0] ?? null, path).toBeNull()
  })

  it("reads PDFs with remote fetching switched off and loads pdf.js only when a file is chosen", () => {
    const reader = sources["/src/services/resume/pdf-reader.ts"]
    for (const option of [
      "disableAutoFetch: true",
      "disableStream: true",
      "disableRange: true",
    ])
      expect(reader, option).toContain(option)
    expect(reader).toMatch(/await Promise\.all\(\[\s*import\("pdfjs-dist"\)/)
    expect(reader).not.toMatch(/^import .*pdfjs-dist/m)
  })

  it("does not put resume text in an error message", () => {
    for (const [path, text] of files)
      expect(
        strip(text).match(
          /new (?:Error|ResumeReadError)\(\s*`[^`]*\$\{/
        )?.[0] ?? null,
        path
      ).toBeNull()
  })
})

describe("resume modules are generated questions, never curriculum", () => {
  it("are registered for titles and lists but are in no syllabus, plan order or study scope", () => {
    for (const s of RESUME_SECTIONS)
      expect(MODULES.some((m) => m.id === resumeModuleId(s))).toBe(true)
    for (const role of ROLE_ORDER) {
      const defaults = defaultsForRoles([role])
      for (const id of orderedModuleIds(defaults))
        expect(id.startsWith("resume-"), `${role} ${id}`).toBe(false)
      for (const scope of ["interview", "study"] as const) {
        const entries = resolveSyllabus({
          defaults,
          overrides: {},
          experience: "fresher",
          scope,
        })
        expect(entries.some((e) => e.module.id.startsWith("resume-"))).toBe(
          false
        )
      }
    }
    // even a learner who tries to switch one on through an override gets nothing
    const entries = resolveSyllabus({
      defaults: defaultsForRoles(["frontend-developer"]),
      overrides: { "resume-project": { selected: true } },
      experience: "fresher",
    })
    expect(entries.some((e) => e.module.id === "resume-project")).toBe(false)
  })
})
