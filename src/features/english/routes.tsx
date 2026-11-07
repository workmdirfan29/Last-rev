import { Route, Routes } from "react-router"
import { NotFoundPage } from "@/components/shared/not-found"
import { ChallengePage } from "./pages/challenge-page"
import { CoursePage } from "./pages/course-page"
import { HomePage } from "./pages/home-page"
import { LessonPage } from "./pages/lesson-page"
import { ModulePage } from "./pages/module-page"
import { PracticePage } from "./pages/practice-page"
import { ProgressPage } from "./pages/progress-page"
import { RevisePage } from "./pages/revise-page"

/** `/english/*`: the Spoken English journey owns its sub-routes (paths are relative to /english). */
export function Component() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="course" element={<CoursePage />} />
      <Route path="course/:module" element={<ModulePage />} />
      <Route path="lesson/:module/:lesson" element={<LessonPage />} />
      <Route path="practice" element={<PracticePage />} />
      <Route path="challenge" element={<ChallengePage />} />
      <Route path="progress" element={<ProgressPage />} />
      <Route path="revise" element={<RevisePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
