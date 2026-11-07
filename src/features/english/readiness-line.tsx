import { Link } from "react-router"
import { ENGLISH_INDEX } from "@/data/english/index.generated"
import { lessonFinished } from "@/services/english/progress"
import { useLearnerStore } from "@/stores/learner-store"

/**
 * "Spoken English: N of M lessons finished", on its own line under the readiness breakdown. It is a count of
 * lessons, not a skill area, so it is never part of the overall readiness figure.
 */
export function SpokenEnglishLine() {
  const progress = useLearnerStore((s) => s.progress)
  if (ENGLISH_INDEX.length === 0) return null
  const done = ENGLISH_INDEX.filter((l) =>
    lessonFinished(l.id, progress)
  ).length
  return (
    <p
      className="mt-4 border-t border-border pt-3 text-xs"
      data-testid="english-readiness-line"
    >
      <Link className="underline underline-offset-4" to="/english/course">
        Spoken English: {done} of {ENGLISH_INDEX.length} lessons finished
      </Link>
      <span className="text-muted-foreground">
        {" "}
        (not part of the score above)
      </span>
    </p>
  )
}
