import { useEffect, useState } from "react"
import { Navigate } from "react-router"
import { MODE_HOME } from "@/app/nav"
import { resumeMode } from "@/app/bootstrap"
import { useLearnerStore } from "@/stores/learner-store"
import { LandingPage } from "./landing-page"
import { markResumeHandled, resumeAlreadyHandled } from "./resume"

/**
 * `/` — on the first entry after a page load, a returning learner is sent to the
 * journey they were last using. Every later visit shows the two choices.
 */
export function Component() {
  const profile = useLearnerStore((s) => s.profile)
  const lastMode = useLearnerStore((s) => s.preferences.lastMode)
  const [firstEntry] = useState(() => !resumeAlreadyHandled())
  useEffect(() => markResumeHandled(), [])

  const resume = firstEntry ? resumeMode(profile, lastMode) : null
  if (resume) return <Navigate to={MODE_HOME[resume]} replace />
  return <LandingPage />
}

/** `/choose` — the same choices, never redirecting. This is where "Switch mode" leads. */
export function ChooseComponent() {
  return <LandingPage />
}
