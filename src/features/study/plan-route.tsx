import { OnboardingPage } from "@/features/onboarding/onboarding-page"

/** `/study/plan` — change roadmap or pace. Progress is never touched. */
export function Component() {
  return <OnboardingPage mode="edit" kind="study" />
}
