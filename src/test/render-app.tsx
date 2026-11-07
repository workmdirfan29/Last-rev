import { render } from "@testing-library/react"
import { RouterProvider } from "react-router"
import { Providers } from "@/app/providers"
import { createTestRouter } from "@/app/router"
import { resetResumeForTests } from "@/features/landing/resume"
import { useLearnerStore } from "@/stores/learner-store"
import type { LearnerProfile } from "@/types/learner"

/** Give the singleton store a completed onboarding profile before the app mounts. */
export async function seedOnboardedLearner(
  over: Partial<Omit<LearnerProfile, "updatedAt">> = {}
) {
  await useLearnerStore.getState().hydrate()
  await useLearnerStore.getState().saveProfile({
    displayName: "Tester",
    selectedRoles: ["frontend-developer"],
    primaryRole: "frontend-developer",
    experience: "fresher",
    dailyStudyHours: 2,
    targetPreset: "30d",
    targetDate: "2099-01-01",
    onboardedAt: new Date().toISOString(),
    ...over,
  })
}

/** Give the singleton store a completed Study Path set-up (no interview onboarding). */
export async function seedStudyLearner(
  over: Partial<Omit<LearnerProfile, "updatedAt">> = {}
) {
  await useLearnerStore.getState().hydrate()
  await useLearnerStore.getState().saveProfile({
    displayName: "Tester",
    studyRoadmap: "java-full-stack-ai",
    experience: "fresher",
    dailyStudyHours: 2,
    targetPreset: "30d",
    targetDate: "2099-01-01",
    studyOnboardedAt: new Date().toISOString(),
    ...over,
  })
}

export async function resetLearner() {
  resetResumeForTests() // a test starts like a fresh page load
  await useLearnerStore.getState().resetAll()
  useLearnerStore.setState({ status: "loading" })
}

/** Pass several paths to start with a history stack; the last one is the current page. */
export function renderApp(path: string | string[]) {
  const router = createTestRouter(Array.isArray(path) ? path : [path])
  const utils = render(
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
  return { router, ...utils }
}
