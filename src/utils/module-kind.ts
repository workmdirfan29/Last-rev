import { isHrModuleId } from "@/types/content"
import { isResumeModuleId } from "@/types/learner"

/** HR and resume questions are level-neutral: no level badge, crumb or filter is shown for them. */
export const isLevelNeutralModule = (moduleId: string): boolean =>
  isHrModuleId(moduleId) || isResumeModuleId(moduleId)
