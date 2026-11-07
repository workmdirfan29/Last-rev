import { Navigate } from "react-router"
import { MODE_HOME } from "@/app/nav"
import { OnboardingPage } from "@/features/onboarding/onboarding-page"
import { useLearnerStore } from "@/stores/learner-store"

/** `/start/study` — set up Study Path. Already set up learners go straight to Study home. */
export function Component() {
  const onboarded = useLearnerStore((s) => !!s.profile?.studyOnboardedAt)
  if (onboarded) return <Navigate to={MODE_HOME.study} replace />
  return <OnboardingPage mode="first" kind="study" />
}
