import { useEffect } from "react"
import { Navigate, Outlet } from "react-router"
import { Button } from "@/components/ui/button"
import { Brand } from "@/components/shared/brand"
import { useLearnerStore } from "@/stores/learner-store"
import {
  LEARNING_MODES,
  type LearnerProfile,
  type AppMode,
  type LearningMode,
} from "@/types/learner"

/** Loads local data once, then renders the matched route. */
export function AppBootstrap() {
  const status = useLearnerStore((s) => s.status)
  const hydrate = useLearnerStore((s) => s.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  if (status === "loading") {
    return (
      <div
        className="flex min-h-svh items-center justify-center"
        role="status"
        aria-label="Loading your data"
      >
        <Brand className="animate-pulse" />
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <Brand />
        <h1 className="font-heading text-lg font-semibold">
          Couldn't open your local data
        </h1>
        <p className="text-sm text-muted-foreground">
          LastRev stores progress in your browser's IndexedDB. It may be blocked
          (private window or strict privacy settings). Allow site storage and
          reload.
        </p>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    )
  }

  return <Outlet />
}

/** Whether the learner has finished onboarding for a journey. */
export function isOnboardedFor(
  profile: LearnerProfile | null,
  mode: LearningMode
): boolean {
  return mode === "interview"
    ? !!profile?.onboardedAt
    : !!profile?.studyOnboardedAt
}

/**
 * The journey to resume: the last one used if it is still set up, otherwise the
 * only one that is (learners from before modes existed have no `lastMode`).
 */
export function resumeMode(
  profile: LearnerProfile | null,
  lastMode: AppMode | null
): AppMode | null {
  // Linux Practice needs no set-up, so it can always be resumed.
  if (lastMode === "linux" || lastMode === "english") return lastMode
  if (lastMode && isOnboardedFor(profile, lastMode)) return lastMode
  const ready = LEARNING_MODES.filter((m) => isOnboardedFor(profile, m))
  return ready.length === 1 ? ready[0] : null
}

/** Guards one journey's routes: a learner who hasn't set it up goes to its start screen. */
export function RequireMode({ mode }: { mode: LearningMode }) {
  const onboarded = useLearnerStore((s) => isOnboardedFor(s.profile, mode))
  return onboarded ? <Outlet /> : <Navigate to={`/start/${mode}`} replace />
}

/** Guards shared pages (settings): any set-up journey is enough. */
export function RequireAnyMode() {
  // A learner who only uses Linux Practice has no profile; Settings (export, import, reset) is still theirs.
  const any = useLearnerStore(
    (s) =>
      s.preferences.lastMode === "linux" ||
      s.preferences.lastMode === "english" ||
      LEARNING_MODES.some((m) => isOnboardedFor(s.profile, m))
  )
  return any ? <Outlet /> : <Navigate to="/" replace />
}
