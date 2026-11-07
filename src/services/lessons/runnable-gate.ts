import { runCasesInProcess } from "@/services/study/sandbox/in-process"
import { allPassed } from "@/services/study/sandbox/report"
import type { StudyLesson } from "@/types/lesson"
import type { Problem } from "./gate"

/**
 * The one rule that runs code: for every JavaScript exercise with test cases, the reference solution passes every
 * case, and the starter code does not (an exercise whose starter already passes teaches nothing). Test-time only,
 * in-process; authored code on a developer machine.
 */
export async function runnableExerciseProblems(
  lessons: readonly StudyLesson[]
): Promise<Problem[]> {
  const problems: Problem[] = []
  for (const l of lessons)
    for (const e of l.exercises) {
      if (!e.run) continue
      const at = `${l.id} exercise ${e.slug}`
      try {
        const solution = await runCasesInProcess(
          e.solution,
          e.run.entry,
          e.run.cases
        )
        if (!allPassed(solution)) {
          const bad = solution.cases.filter((c) => !c.passed).map((c) => c.name)
          problems.push(
            `${at}: the reference solution fails ${solution.message ?? `case(s) ${bad.join(", ")}`}`
          )
        }
        const starter = await runCasesInProcess(
          e.starter,
          e.run.entry,
          e.run.cases
        )
        if (allPassed(starter))
          problems.push(`${at}: the starter code already passes every case`)
      } catch (error) {
        problems.push(
          `${at}: could not run (${error instanceof Error ? error.message : String(error)})`
        )
      }
    }
  return problems
}
