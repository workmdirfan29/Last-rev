import { newId } from "@/utils/id"
import type { ResumeProfile } from "@/types/learner"

/**
 * Best-effort structure from text lines. It splits by a dictionary of headings and simple patterns (date
 * ranges, bullets, "Role | Company" lines). It WILL be wrong sometimes: the result is only a first draft that
 * the learner reviews and corrects before anything is generated from it. Lines it cannot place are kept
 * (`unplaced`), never dropped, so nothing the learner wrote disappears.
 */

type SectionKey =
  | "summary"
  | "skills"
  | "jobs"
  | "projects"
  | "education"
  | "certs"
  | "achievements"
  | "other"

const HEADINGS: [RegExp, SectionKey][] = [
  [
    /^((professional|career|personal) )?(summary|profile|objective|about( me)?)$/i,
    "summary",
  ],
  [
    /^((technical|key|core) )?(skills|competencies|technologies|tech(nology)? stack|proficiency|skill set)$|^technical (skills|proficiency|expertise)$|^core competencies$/i,
    "skills",
  ],
  [
    /^((work|professional|relevant|industry) )?(experience|history|employment( history)?)$|^work history$|^career (history|journey)$|^(internships?|internship experience|industrial training)$/i,
    "jobs",
  ],
  [/^((key|academic|personal|major|selected) )?projects?$/i, "projects"],
  [
    /^(education|academic background|academics|qualifications?|education(al)? (background|qualifications?))$/i,
    "education",
  ],
  [
    /^(certifications?|courses|licen[sc]es|training)( (and|&) (certifications?|courses))?$/i,
    "certs",
  ],
  [
    /^(achievements?|awards?|honou?rs|accomplishments|key achievements)( (and|&) (awards?|honou?rs|achievements?|recognition))?$/i,
    "achievements",
  ],
  // Sections that are kept for the learner but never used for questions.
  [
    /^(languages?( known)?|interests?|hobbies( (and|&) interests)?|hobbies|areas of interest|declaration|references?|personal (details|information|data)|strengths|publications?|volunteer(ing)?( experience| work)?|extra-?curricular( activities)?|soft skills|co-?curricular( activities)?)$/i,
    "other",
  ],
]

const ROLE_WORDS =
  /\b(engineer|developer|analyst|manager|intern|lead|architect|consultant|designer|tester|administrator|officer|associate|programmer|specialist|trainee|scientist|executive|head|director|assistant|coordinator|technician|support)\b/i
// Bullet glyphs from symbol fonts often come out as private-use characters (U+E000 to U+F8FF), or as a stray
// "§" or "Ø" in front of the text.
const MARK =
  /^(?:[•●▪◦■‣·⁃\uE000-\uF8FF§Ø]|[-–—*]|o)\s+|^[•●▪◦■‣·⁃\uE000-\uF8FF*]/
const MON = "(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?"
const DATE = `(?:${MON}\\s+\\d{4}|\\d{1,2}[/.]\\d{4}|\\d{4})`
const RANGE = new RegExp(
  `(${DATE})\\s*(?:-|\\u2013|\\u2014|to)\\s*(${DATE}|present|current|now|ongoing|till date|to date)`,
  "i"
)
const TECH_LINE =
  /^(technologies|tech(nology)? stack|tools|built with|stack|environment)\s*:\s*(.+)$/i

export function headingOf(line: string): SectionKey | null {
  const t = line.replace(/[:\s]+$/, "").trim()
  if (t.length === 0 || t.length > 40) return null
  for (const [re, key] of HEADINGS) if (re.test(t)) return key
  return null
}

/** A short all-capitals line that is not a known heading: probably a heading the dictionary does not know. */
const looksLikeHeading = (line: string) =>
  line.length <= 40 &&
  /[A-Z]/.test(line) &&
  line === line.toUpperCase() &&
  !/\d/.test(line)

/** A line that reads like a sentence rather than a heading, a company or a role. */
const looksLikeSentence = (line: string) =>
  line.length > 45 || /[.!?]$/.test(line) || /^[a-z]/.test(line)

const item = (text: string) => ({ uid: newId("r"), text })
const splitList = (s: string) =>
  s
    .split(/[,;|•]|\s{2,}/)
    .map((x) => x.trim().replace(/^[-–*]\s*/, ""))
    .filter((x) => x.length > 0 && x.length <= 80)

interface JobDraft {
  company: string
  role: string
  start: string
  end: string
  bullets: string[]
}

/** Which of two parts of a header is the role: the one with a role word. */
function splitHeader(parts: string[]): { company: string; role: string } {
  const clean = parts.map((p) => p.trim()).filter(Boolean)
  if (clean.length === 0) return { company: "", role: "" }
  if (clean.length === 1)
    return ROLE_WORDS.test(clean[0])
      ? { company: "", role: clean[0] }
      : { company: clean[0], role: "" }
  const roleIndex = clean.findIndex((p) => ROLE_WORDS.test(p))
  if (roleIndex === -1) return { company: clean[0], role: clean[1] }
  const role = clean[roleIndex]
  const company = clean.filter((_, i) => i !== roleIndex).join(", ")
  return { company, role }
}

function splitHead(head: string): string[] {
  const at = /^(.+?)\s+at\s+(.+)$/i.exec(head)
  if (at) return [at[1], at[2]]
  if (/[|]/.test(head)) return head.split("|")
  if (/\s[–—-]\s/.test(head)) return head.split(/\s[–—-]\s/)
  const comma = head.indexOf(",")
  if (comma > 0) return [head.slice(0, comma), head.slice(comma + 1)]
  return [head]
}

export interface ParsedResume {
  profile: Omit<ResumeProfile, "importedAt" | "updatedAt" | "sourceName" | "id">
  /** What was found, for the "found 2 jobs, please check" hints. */
  counts: { jobs: number; projects: number; skills: number; unplaced: number }
}

export function parseResume(allLines: readonly string[]): ParsedResume {
  const lines = allLines.map((l) => l.trim()).filter((l) => l !== "")
  const summary: string[] = []
  const skills: ResumeProfile["skills"] = []
  const jobs: JobDraft[] = []
  const projects: ResumeProfile["projects"] = []
  const education: string[] = []
  const certs: string[] = []
  const achievements: string[] = []
  const unplaced: string[] = []
  const others: { heading: string; lines: string[] }[] = []
  let currentOther: { heading: string; lines: string[] } | null = null
  const openOther = (heading: string) => {
    currentOther = { heading, lines: [] }
    others.push(currentOther)
  }

  let section: SectionKey | null = null
  let seenHeading = false
  let job: JobDraft | null = null
  let project: ResumeProfile["projects"][number] | null = null
  let pending: string[] = [] // non-bullet lines in the experience section waiting for their dates
  let lastWasBullet = false

  const appendToLastBullet = (text: string) => {
    if (job && job.bullets.length)
      job.bullets[job.bullets.length - 1] += ` ${text}`
    else if (project && project.bullets.length)
      project.bullets[project.bullets.length - 1].text += ` ${text}`
  }
  const endsSentence = (s: string) => /[.!?]$/.test(s.trim())

  lines.forEach((line, index) => {
    const h = headingOf(line)
    if (h) {
      section = h
      if (h === "other") openOther(line.replace(/[:\s]+$/, ""))
      seenHeading = true
      job = null
      project = null
      pending = []
      lastWasBullet = false
      return
    }
    // Unknown all-caps heading: lines after it are not placed until a known heading appears.
    if (looksLikeHeading(line) && !MARK.test(line) && section !== "skills") {
      if (seenHeading || index > 1) {
        // A heading the dictionary does not know opens its own "other" section instead of joining the previous one.
        section = "other"
        seenHeading = true
        openOther(line.replace(/[:\s]+$/, ""))
        job = null
        project = null
        pending = []
        return
      }
    }
    const bullet = MARK.test(line)
    const body = bullet ? line.replace(MARK, "").trim() : line

    switch (section) {
      case null:
        // The first lines before any heading are the name and contact details: not part of the profile.
        if (seenHeading) unplaced.push(line)
        else if (index > 2) unplaced.push(line)
        break
      case "other":
        currentOther?.lines.push(body)
        break
      case "summary":
        summary.push(body)
        break
      case "skills": {
        const m = /^([^:]{2,40}):\s*(.+)$/.exec(body)
        const group = m ? m[1].trim() : ""
        for (const name of splitList(m ? m[2] : body))
          skills.push({ uid: newId("r"), group, name })
        break
      }
      case "jobs": {
        const range = RANGE.exec(line)
        if (range && !bullet) {
          const head = line
            .replace(RANGE, "")
            .replace(/[()\s|,–—-]+$/, "")
            .replace(/^[()\s|,–—-]+/, "")
            .trim()
          const candidates = head ? splitHead(head) : [...pending]
          let { company, role } = splitHeader(candidates)
          // a header with one part: the other part may be on the line before
          if (head && candidates.length === 1 && pending.length === 1) {
            const prev = pending[0]
            if (role && !company) company = prev
            else if (company && !role) role = prev
          }
          job = { company, role, start: range[1], end: range[2], bullets: [] }
          jobs.push(job)
          pending = []
          lastWasBullet = false
        } else if (bullet) {
          if (job) job.bullets.push(body)
          else unplaced.push(line)
          lastWasBullet = true
        } else if (
          job &&
          lastWasBullet &&
          !endsSentence(job.bullets.at(-1) ?? "")
        ) {
          appendToLastBullet(body) // a wrapped bullet
        } else if (
          job &&
          !job.role &&
          ROLE_WORDS.test(body) &&
          body.length < 70 &&
          job.bullets.length === 0
        ) {
          job.role = body // the role on the line after the company
        } else if (
          job &&
          !job.company &&
          body.length < 70 &&
          job.bullets.length === 0
        ) {
          job.company = body
        } else if (
          job &&
          lastWasBullet &&
          !(endsSentence(job.bullets.at(-1) ?? "") && /^[A-Z]/.test(body))
        ) {
          appendToLastBullet(body)
        } else if (job && job.role && job.company && looksLikeSentence(body)) {
          // A bullet whose marker was lost when the PDF was read.
          job.bullets.push(body)
          lastWasBullet = true
        } else {
          pending.push(body)
          if (pending.length > 2) unplaced.push(pending.shift()!)
        }
        break
      }
      case "projects": {
        const tech = TECH_LINE.exec(body)
        if (tech && project) project.technologies = splitList(tech[3])
        else if (bullet) {
          if (project) project.bullets.push(item(body))
          else unplaced.push(line)
          lastWasBullet = true
        } else if (
          project &&
          lastWasBullet &&
          !endsSentence(project.bullets.at(-1)?.text ?? ".")
        ) {
          appendToLastBullet(body)
        } else if (
          project &&
          !project.description &&
          project.bullets.length === 0 &&
          body.length > 60
        ) {
          project.description = body
        } else if (project && looksLikeSentence(body)) {
          // A bullet whose marker was lost when the PDF was read.
          project.bullets.push(item(body))
          lastWasBullet = true
        } else {
          project = {
            uid: newId("r"),
            name: body.replace(/\s*[|–—-]\s*.*$/, "").trim() || body,
            role: "",
            description: "",
            technologies: [],
            bullets: [],
          }
          projects.push(project)
          lastWasBullet = false
        }
        break
      }
      case "education":
        education.push(body)
        break
      case "certs":
        certs.push(body)
        break
      case "achievements":
        achievements.push(body)
        break
    }
  })

  const profile = {
    summary: summary.join(" ").slice(0, 1500),
    skills,
    experiences: jobs.map((j) => ({
      uid: newId("r"),
      company: j.company,
      role: j.role,
      start: j.start,
      end: j.end,
      bullets: j.bullets.map(item),
    })),
    projects,
    education: education.map(item),
    certifications: certs.map(item),
    achievements: achievements.map(item),
    unplaced: unplaced.map(item),
    other: others.map((o) => ({
      uid: newId("r"),
      heading: o.heading,
      text: o.lines.join("\n"),
    })),
    includeDateQuestions: true,
    raiseCaps: false,
  }
  return {
    profile,
    counts: {
      jobs: jobs.length,
      projects: projects.length,
      skills: skills.length,
      unplaced: unplaced.length,
    },
  }
}

/** Plain text pasted or loaded from a .txt file, as lines. */
export const textToLines = (text: string): string[] =>
  text.replace(/\r\n?/g, "\n").split("\n")
