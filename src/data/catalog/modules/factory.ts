import { PRACTICE_REVISION_ALLOWANCE } from "@/data/curriculum/time-model"
import type { SkillArea } from "@/types/content"
import type {
  CatalogModule,
  Difficulty,
  DomainId,
  Topic,
} from "../module-types"

/** `[title, minutes, submodule?]`: the compact form topics are authored in. */
export type TopicSpec = readonly [
  title: string,
  minutes: number,
  group?: string,
]

export interface ModuleOptions {
  prerequisites?: string[]
  alsoIn?: DomainId[]
}

/**
 * Build one catalogue module. Topics and their minutes are the source of truth:
 * `topics` (titles) and `estimatedStudyHours` (fresher baseline) are derived,
 * so no module carries a hand-typed total.
 */
export function mod(
  id: string,
  title: string,
  skillArea: SkillArea,
  domainId: DomainId,
  difficulty: Difficulty,
  description: string,
  topics: readonly TopicSpec[],
  options: ModuleOptions = {}
): CatalogModule {
  const topicList: Topic[] = topics.map(([t, minutes, group]) =>
    group ? { title: t, minutes, group } : { title: t, minutes }
  )
  const totalMinutes = topicList.reduce((sum, t) => sum + t.minutes, 0)
  return {
    id,
    title,
    description,
    skillArea,
    domainId,
    alsoIn: options.alsoIn ?? [],
    difficulty,
    topics: topicList.map((t) => t.title),
    topicList,
    prerequisites: options.prerequisites ?? [],
    estimatedStudyHours: Math.round(
      (totalMinutes * (1 + PRACTICE_REVISION_ALLOWANCE)) / 60
    ),
    contentStatus: "planned",
    lessonStatus: "planned",
    lessons: [],
    assignmentIds: [],
    projectIds: [],
  }
}
