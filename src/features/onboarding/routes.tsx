import { Navigate } from "react-router"
import { MODE_HOME } from "@/app/nav"
import { useLearnerStore } from "@/stores/learner-store"
import { OnboardingPage } from "./onboarding-page"

/** `/start/interview` — set up Interview Prep. Already set up learners go straight to the overview. */
export function Component() {
  const onboarded = useLearnerStore((s) => !!s.profile?.onboardedAt)
  if (onboarded) return <Navigate to={MODE_HOME.interview} replace />
  return <OnboardingPage mode="first" kind="interview" />
}

/** `/onboarding` — edit the existing interview plan. Progress is never touched. */
export function EditComponent() {
  return <OnboardingPage mode="edit" kind="interview" />
}
