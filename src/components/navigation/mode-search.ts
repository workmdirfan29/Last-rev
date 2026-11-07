import { LINUX_COMMANDS } from "@/data/linux/commands"
import { ENGLISH_MODULES } from "@/data/english/modules"
import { ENGLISH_INDEX } from "@/data/english/index.generated"
import { phasesOf } from "@/data/catalog/phases"
import { getRoadmap } from "@/data/catalog/roadmaps"
import { PROJECTS } from "@/data/projects"
import { defaultsForRoadmap } from "@/services/curriculum/relevance"
import { resolveSyllabus } from "@/services/curriculum/syllabus"
import {
  moduleQuizInfo,
  phaseQuizInfo,
  quizPath,
  type QuizInfo,
} from "@/services/study/quizzes"
import { resolvePhases } from "@/services/study/roadmap"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { getModule } from "@/data/catalog/modules"
import { scoreMatch } from "@/services/content/search"
import type { EnglishLesson } from "@/types/english"
import type { AppMode } from "@/types/learner"

/** Each journey's header search: what it is called, and what it searches besides pages. */
export const SEARCH_COPY: Record<
  AppMode,
  { trigger: string; placeholder: string; label: string; description: string }
> = {
  interview: {
    trigger: "Search questions…",
    placeholder: "Search questions or pages…",
    label: "Search questions and pages",
    description: "Search questions and pages",
  },
  study: {
    trigger: "Search lessons…",
    placeholder: "Search lessons, projects, quizzes or pages…",
    label: "Search lessons, projects, quizzes and pages",
    description: "Search lessons, projects, quizzes and pages",
  },
  linux: {
    trigger: "Search commands…",
    placeholder: "Search commands or pages…",
    label: "Search commands and pages",
    description: "Search commands and pages",
  },
  english: {
    trigger: "Search the course…",
    placeholder: "Search lessons, sentences or pages…",
    label: "Search the course and pages",
    description: "Search lessons, sentences and pages",
  },
}

export interface SearchHit {
  key: string
  title: string
  hint: string
  to: string
}

const MAX = 8

/** Study Path lessons (from the light index): by title, topic, overview and module. */
export function searchStudyLessons(query: string): SearchHit[] {
  if (!query.trim()) return []
  return LESSON_INDEX.map((l) => ({
    l,
    score: scoreMatch(
      {
        title: l.title,
        topic: l.topic,
        keywords: [l.overview],
        moduleTitle: getModule(l.moduleId)?.title,
      },
      query
    ),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX)
    .map(({ l }) => ({
      key: l.id,
      title: l.title,
      hint: getModule(l.moduleId)?.title ?? "",
      to: `/study/lesson/${l.moduleId}/${l.slug}`,
    }))
}

/** Study projects by title and summary. */
export function searchStudyProjects(query: string): SearchHit[] {
  if (!query.trim()) return []
  return PROJECTS.map((p) => ({
    p,
    score: scoreMatch(
      {
        title: p.title,
        topic: p.kind === "major" ? "major project" : "mini-project",
        keywords: [p.summary],
      },
      query
    ),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX)
    .map(({ p }) => ({
      key: `project.${p.id}`,
      title: p.title,
      hint: p.kind === "major" ? "Major project" : "Mini-project",
      to: `/study/projects/${p.id}`,
    }))
}

/**
 * Study quizzes that exist: a module quiz for every module whose lessons hold enough check items, and a phase
 * quiz for every phase of the roadmap in the same position. Only what the Quizzes page lists is found.
 */
export function searchStudyQuizzes(
  query: string,
  roadmapId: string | null | undefined
): SearchHit[] {
  if (!query.trim()) return []
  const hits: (SearchHit & { score: number })[] = []
  const add = (q: QuizInfo) => {
    if (!q.available) return
    const score = scoreMatch(
      { title: q.title, topic: "quiz", keywords: [] },
      query
    )
    if (score > 0)
      hits.push({
        key: q.id,
        title: q.title,
        hint: "Quiz",
        to: quizPath(q),
        score,
      })
  }
  for (const id of new Set(LESSON_INDEX.map((l) => l.moduleId))) {
    const m = getModule(id)
    if (m) add(moduleQuizInfo(id, m.title, LESSON_INDEX, {}, []))
  }
  const roadmap = getRoadmap(roadmapId)
  if (roadmap) {
    const entries = resolveSyllabus({
      defaults: defaultsForRoadmap(roadmap.id),
      overrides: {},
      experience: "fresher",
      scope: "study",
    })
    for (const v of resolvePhases(phasesOf(roadmap.id), entries))
      if (!v.projectLed) add(phaseQuizInfo(v, LESSON_INDEX, {}, []))
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, MAX)
}

/** Linux commands by syntax, description, example and note. */
export function searchLinux(query: string): SearchHit[] {
  if (!query.trim()) return []
  return LINUX_COMMANDS.map((c) => ({
    c,
    score: scoreMatch(
      {
        title: c.syntax,
        topic: c.category,
        keywords: [c.description, c.example, c.note ?? ""],
      },
      query
    ),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX)
    .map(({ c }) => ({
      key: c.id,
      title: c.syntax,
      hint: c.description,
      to: `/linux/command/${c.slug}`,
    }))
}

/** Lessons from the light index (no bodies needed): by title, Hindi title and goal. */
export function searchEnglishLessons(query: string): SearchHit[] {
  if (!query.trim()) return []
  return ENGLISH_INDEX.map((l) => ({
    l,
    score: scoreMatch(
      {
        title: l.title,
        topic: l.titleHi,
        keywords: [l.goal],
        moduleTitle: ENGLISH_MODULES.find((m) => m.id === l.moduleId)?.title,
      },
      query
    ),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX)
    .map(({ l }) => ({
      key: l.id,
      title: l.title,
      hint: l.titleHi,
      to: `/english/lesson/${l.moduleId}/${l.slug}`,
    }))
}

/** Sentences and words (English or Hindi) from loaded lessons; opens the lesson at that item. */
export function searchEnglishItems(
  lessons: readonly EnglishLesson[],
  query: string
): SearchHit[] {
  if (!query.trim()) return []
  const hits: (SearchHit & { score: number })[] = []
  for (const l of lessons)
    for (const it of l.items) {
      const [en, hi] =
        it.kind === "sentence"
          ? [it.en, it.hi]
          : it.kind === "vocab"
            ? [it.word, it.hi]
            : ["", ""]
      if (!en) continue
      const score = scoreMatch(
        { title: en, topic: hi, keywords: [], moduleTitle: l.title },
        query
      )
      if (score > 0)
        hits.push({
          key: it.id,
          title: en,
          hint: hi,
          to: `/english/lesson/${l.moduleId}/${l.slug}?item=${it.slug}`,
          score,
        })
    }
  return hits.sort((a, b) => b.score - a.score).slice(0, MAX)
}
