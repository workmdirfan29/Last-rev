import { Link } from "react-router"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { LESSON_INDEX } from "@/data/lessons/index.generated"
import { usePlan } from "@/features/planner/use-plan"
import { useLearnerStore } from "@/stores/learner-store"
import { phaseStats } from "@/services/study/roadmap"
import { PhaseDetail, PhaseSummary } from "./phase-card"
import { useStudyView } from "./use-study-view"

/** The roadmap's phases, expandable. Phases without lessons say so; nothing is padded. */
export function RoadmapPage() {
  const plan = usePlan("study")
  const view = useStudyView(plan)
  const progress = useLearnerStore((s) => s.progress)
  if (!view)
    return (
      <EmptyState
        title="No roadmap chosen yet"
        description="Pick a roadmap to see its phases."
        action={
          <Button asChild>
            <Link to="/study/plan">Choose a roadmap</Link>
          </Button>
        }
      />
    )
  const ready = view.views.filter(
    (v) => phaseStats(v, LESSON_INDEX, progress).lessonsReady > 0
  ).length
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study Path"
        title="Roadmap"
        description={`${view.roadmap.title}: ${view.views.length} phases. ${view.lessons.length} ${view.lessons.length === 1 ? "lesson is" : "lessons are"} ready so far, in ${ready} of ${view.views.length} phases. These phases are a starting structure; your syllabus and plan stay yours to change.`}
      />
      <Accordion
        type="multiple"
        defaultValue={
          view.current ? [`phase-${view.current.phase.number}`] : []
        }
        className="rounded-xl border border-border bg-card px-3 sm:px-4"
      >
        {view.views.map((v) => (
          <AccordionItem key={v.phase.number} value={`phase-${v.phase.number}`}>
            <AccordionTrigger>
              <PhaseSummary view={v} />
            </AccordionTrigger>
            <AccordionContent>
              <PhaseDetail view={v} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
