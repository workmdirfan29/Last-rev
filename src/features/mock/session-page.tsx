import { useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { EmptyState } from "@/components/shared/empty-state"
import { ScreenLoader } from "@/components/shared/screen-loader"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { InterviewView } from "./interview-view"
import { ReviewView } from "./review-view"
import { useMockActions, useMockSession } from "./use-session"
import { useMockItems } from "./use-mock-items"

/** `/mock/:id`: the running session. A finished one goes to its result; an in-progress one resumes where it was. */
export function SessionPage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const session = useMockSession(id)
  const { items, ready } = useMockItems(session)
  const actions = useMockActions(id)
  const [abandoning, setAbandoning] = useState(false)

  if (!session)
    return (
      <EmptyState
        title="Mock interview not found"
        description="It may have been deleted."
        action={
          <Button asChild>
            <Link to="/mock">Back to mock interviews</Link>
          </Button>
        }
      />
    )
  if (session.status === "finished")
    return <Navigate to={`/mock/${id}/result`} replace />
  if (session.status === "abandoned")
    return (
      <EmptyState
        title="This interview was abandoned"
        description="An abandoned interview has no score."
        action={
          <Button asChild>
            <Link to="/mock">Back to mock interviews</Link>
          </Button>
        }
      />
    )
  if (!ready) return <ScreenLoader />

  return (
    <div className="space-y-4">
      {session.phase === "interview" ? (
        <InterviewView
          key={session.id}
          session={session}
          items={items}
          onFinished={(toReview) => {
            if (!toReview) navigate(`/mock/${id}/result`, { replace: true })
          }}
        />
      ) : (
        <ReviewView
          key={session.id}
          session={session}
          items={items}
          onDone={() => navigate(`/mock/${id}/result`, { replace: true })}
        />
      )}
      <div className="mx-auto max-w-3xl">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setAbandoning(true)}
        >
          Abandon this interview
        </Button>
      </div>
      <AlertDialog open={abandoning} onOpenChange={setAbandoning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abandon this interview?</AlertDialogTitle>
            <AlertDialogDescription>
              It will have no score. Your answers stay in the history, marked
              abandoned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep going</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void actions
                  .abandon()
                  .then(() => navigate("/mock", { replace: true }))
              }}
            >
              Abandon
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
