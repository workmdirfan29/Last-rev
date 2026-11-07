import { ROADMAPS } from "@/data/catalog/roadmaps"
import { LINUX_CHALLENGES } from "@/data/linux/challenges"
import { LINUX_COMMANDS } from "@/data/linux/commands"
import { ENGLISH_INDEX } from "@/data/english/index.generated"
import { ENGLISH_CHALLENGE } from "@/data/english/challenge"
import type { AppMode } from "@/types/learner"

/**
 * What each journey's landing card lists. ONE list, next to the nav registry, so a feature cannot be shown as
 * "Soon" after it is built (or as built before it exists): a feature is built when it has a `route`, and it
 * is "Soon" only when it has none. A test checks every route resolves to a real page.
 */
export interface LandingFeature {
  label: string
  /** The page that proves the feature exists. Omit it while the feature is not built (shown as "Soon"). */
  route?: string
}

const ROADMAP_FEATURES: LandingFeature[] = ROADMAPS.map((r) => ({
  label: r.title,
  route: "/study",
}))

/** Spoken English lists only what the course really contains: counts come from the generated content index. */
function englishFeatures(): LandingFeature[] {
  const lessons = ENGLISH_INDEX.length
  if (lessons === 0) return []
  const sentences = ENGLISH_INDEX.reduce((n, l) => n + l.counts.sentence, 0)
  return [
    {
      label: `${lessons} ${lessons === 1 ? "lesson" : "lessons"}`,
      route: "/english/course",
    },
    ...(sentences > 0
      ? [
          {
            label: `${sentences} sentences with Hindi meaning`,
            route: "/english/course",
          },
        ]
      : []),
    ...(ENGLISH_CHALLENGE.length === 30
      ? [{ label: "30-day speaking challenge", route: "/english/challenge" }]
      : []),
    {
      label: "Typing, word-order and speaking practice",
      route: "/english/practice",
    },
    { label: "Spaced revision of what you know", route: "/english/revise" },
  ]
}

export const LANDING_FEATURES: Record<AppMode, LandingFeature[]> = {
  interview: [
    { label: "Technical Interview Questions", route: "/interview" },
    { label: "HR Interview Preparation", route: "/hr" },
    { label: "Mock Interview Practice", route: "/mock" },
    { label: "Resume-Based Questions", route: "/resume" },
    { label: "Interview Progress Tracker", route: "/dashboard" },
  ],
  study: [
    ...ROADMAP_FEATURES,
    { label: "Practical Projects and Assignments" },
    { label: "Daily Learning Tracker", route: "/study" },
  ],
  linux: [
    {
      label: `Command library (${LINUX_COMMANDS.length} unique commands)`,
      route: "/linux",
    },
    { label: "Safe practice terminal", route: "/linux/terminal" },
    { label: "Permissions calculator", route: "/linux/chmod" },
    { label: "Date format explorer", route: "/linux/dates" },
    {
      label: `Challenges (${LINUX_CHALLENGES.length})`,
      route: "/linux/challenges",
    },
  ],
  english: englishFeatures(),
}
