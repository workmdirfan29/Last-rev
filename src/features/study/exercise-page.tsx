import { useState } from "react"
import { Link, useParams } from "react-router"
import { ArrowLeftIcon } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { Button } from "@/components/ui/button"
import { getModule } from "@/data/catalog/modules"
import { sandboxSupported } from "@/services/study/sandbox/sandbox"
import { lessonIdOf } from "@/types/lesson"
import { ExerciseView } from "./lesson/exercise-view"
import { RunnablePanel } from "./practice/runnable-panel"
import { useStudyLesson } from "./use-study-lessons"

/** One exercise on its own page: the editor and tests for a runnable one, the self-check view for the rest. */
export function ExercisePage() {
  const { module = "", lesson = "", exercise = "" } = useParams()
  const { data, isLoading } = useStudyLesson(lessonIdOf(module, lesson))
  const [passed, setPassed] = useState(false)
  const ex = data?.exercises.find((e) => e.slug === exercise)
  if (isLoading) return <ScreenLoader />
  if (!data || !ex)
    return (
      <EmptyState
        title="Exercise not found"
        description="That exercise is not in the lessons."
        action={
          <Button asChild>
            <Link to="/study/practice">Back to practice</Link>
          </Button>
        }
      />
    )
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow={`${getModule(module)?.title} · ${data.title}`}
        title={ex.title}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/study/practice">
                <ArrowLeftIcon /> All exercises
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to={`/study/lesson/${module}/${lesson}`}>
                Open the lesson
              </Link>
            </Button>
          </>
        }
      />
      <ExerciseView
        key={ex.slug}
        moduleId={module}
        lessonSlug={data.slug}
        exercise={ex}
        runner={
          ex.run && sandboxSupported()
            ? {
                passed,
                node: <RunnablePanel exercise={ex} onPassed={setPassed} />,
              }
            : undefined
        }
      />
    </div>
  )
}
