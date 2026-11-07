/**
 * Checks that every question sourceRef URL, lesson resource, project resource and research source URL answers with HTTP 200 (after redirects).
 * Run it by hand, never in the unit tests: it makes real network requests.
 *
 *   pnpm content:verify-links            check every URL
 *   pnpm content:verify-links --list     only list the URLs, no requests
 *   pnpm content:verify-links --concurrency 4
 *
 * Exits with 1 if any URL fails.
 */
import { readdirSync, statSync } from "node:fs"
import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { EXPERIENCE_LEVELS, type Question } from "../src/types/content.ts"
import type { StudyLesson } from "../src/types/lesson.ts"
import type { Project } from "../src/types/project.ts"
import type { ResearchEntry } from "../src/types/research.ts"

// Slow-to-answer hosts (www.gnu.org) otherwise fail Node's 250 ms dual-stack connection attempt with ETIMEDOUT.
setDefaultAutoSelectFamilyAttemptTimeout(3000)

const args = process.argv.slice(2)
const listOnly = args.includes("--list")
const concurrencyIndex = args.indexOf("--concurrency")
const concurrency =
  concurrencyIndex >= 0
    ? Math.max(1, Number(args[concurrencyIndex + 1]) || 6)
    : 6

const root = resolve(import.meta.dirname, "../src/data/questions")
const links = new Map<string, string[]>() // url -> question ids using it

for (const moduleId of readdirSync(root).sort()) {
  const dir = join(root, moduleId)
  if (!statSync(dir).isDirectory()) continue
  for (const level of EXPERIENCE_LEVELS) {
    const file = join(dir, `${level}.ts`)
    try {
      statSync(file)
    } catch {
      continue
    }
    const mod = (await import(pathToFileURL(file).href)) as {
      default: Question[]
    }
    for (const q of mod.default) {
      for (const s of q.sourceRefs)
        links.set(s.url, [...(links.get(s.url) ?? []), q.id])
    }
  }
}

// Study Zone lessons: one file per lesson under src/data/lessons/<module>/
const lessonRoot = resolve(import.meta.dirname, "../src/data/lessons")
for (const moduleId of readdirSync(lessonRoot).sort()) {
  const dir = join(lessonRoot, moduleId)
  if (!statSync(dir).isDirectory()) continue
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith(".ts")) continue
    const lesson = (
      (await import(pathToFileURL(join(dir, f)).href)) as {
        default: StudyLesson
      }
    ).default
    for (const r of lesson.resources)
      links.set(r.url, [...(links.get(r.url) ?? []), lesson.id])
  }
}

// Study projects: one file per project
const projectRoot = resolve(import.meta.dirname, "../src/data/projects")
for (const f of readdirSync(projectRoot).sort()) {
  if (
    !f.endsWith(".ts") ||
    ["author.ts", "index.ts"].includes(f) ||
    f.endsWith(".test.ts")
  )
    continue
  const p = (
    (await import(pathToFileURL(join(projectRoot, f)).href)) as {
      default: Project
    }
  ).default
  for (const r of p.resources)
    links.set(r.url, [...(links.get(r.url) ?? []), `project ${p.id}`])
}

// Research entries: one file per area
const researchRoot = resolve(import.meta.dirname, "../src/data/research")
for (const f of readdirSync(researchRoot).sort()) {
  if (
    !f.endsWith(".ts") ||
    ["author.ts", "index.ts", "areas.ts", "hosts.ts"].includes(f) ||
    f.endsWith(".test.ts")
  )
    continue
  const list = (
    (await import(pathToFileURL(join(researchRoot, f)).href)) as {
      default: ResearchEntry[]
    }
  ).default
  for (const e of list)
    for (const s of e.evidence.sources)
      links.set(s.url, [...(links.get(s.url) ?? []), `research ${e.id}`])
}

console.log(
  `${links.size} unique source URLs from ${[...links.values()].flat().length} references`
)
if (listOnly) {
  for (const [url, ids] of links) console.log(`${url}  (${ids.length})`)
  process.exit(0)
}

async function check(
  url: string
): Promise<{ ok: boolean; status: number | string }> {
  for (const method of ["HEAD", "GET"] as const) {
    try {
      let res = await fetch(url, {
        method,
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
        headers: { "user-agent": "LastRev-link-check/1.0" },
      })
      // 429 means rate limited (the page exists): back off and ask again instead of reporting a broken link.
      for (let wait = 3; res.status === 429 && wait <= 48; wait *= 2) {
        await new Promise((r) => setTimeout(r, wait * 1000))
        res = await fetch(url, {
          method,
          redirect: "follow",
          signal: AbortSignal.timeout(20_000),
          headers: { "user-agent": "LastRev-link-check/1.0" },
        })
      }
      if (res.status === 200) return { ok: true, status: 200 }
      // Some servers reject HEAD; retry once with GET before reporting.
      if (method === "GET") return { ok: false, status: res.status }
    } catch (error) {
      if (method === "GET")
        return {
          ok: false,
          status: error instanceof Error ? error.message : "error",
        }
    }
  }
  return { ok: false, status: "unknown" }
}

const queue = [...links.keys()]
const failures: { url: string; status: number | string; ids: string[] }[] = []
let done = 0

async function worker() {
  for (let url = queue.shift(); url !== undefined; url = queue.shift()) {
    const result = await check(url)
    done++
    if (!result.ok)
      failures.push({ url, status: result.status, ids: links.get(url)! })
    process.stdout.write(
      `\r${done}/${links.size} checked, ${failures.length} failing`
    )
  }
}

await Promise.all(Array.from({ length: concurrency }, worker))
console.log("")
for (const f of failures)
  console.log(`FAIL ${f.status}  ${f.url}\n     used by ${f.ids.join(", ")}`)
console.log(
  failures.length === 0
    ? "All source links returned 200."
    : `${failures.length} source link(s) did not return 200.`
)
process.exit(failures.length === 0 ? 0 : 1)
