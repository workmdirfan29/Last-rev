import { Route, Routes } from "react-router"
import { NotFoundPage } from "@/components/shared/not-found"
import { LessonPage } from "./lesson-page"
import { LessonsPage } from "./lessons-page"
import { ModuleLessonsPage } from "./module-lessons-page"
import { ExercisePage } from "./exercise-page"
import { PracticePage } from "./practice-page"
import { ProjectPage } from "./project-page"
import { ProjectsPage } from "./projects-page"
import { QuizPage } from "./quiz-page"
import { QuizzesPage } from "./quizzes-page"
import { RevisePage } from "./revise-page"
import { RoadmapPage } from "./roadmap-page"
import { StudyProgressPage } from "./progress-page"
import { StudyHomePage } from "./study-home-page"

/** `/study/*`: the Study Path owns its sub-routes (paths are relative to /study). */
export function Component() {
  return (
    <Routes>
      <Route index element={<StudyHomePage />} />
      <Route path="roadmap" element={<RoadmapPage />} />
      <Route path="progress" element={<StudyProgressPage />} />
      <Route path="practice" element={<PracticePage />} />
      <Route
        path="practice/:module/:lesson/:exercise"
        element={<ExercisePage />}
      />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="projects/:id" element={<ProjectPage />} />
      <Route path="quizzes" element={<QuizzesPage />} />
      <Route path="quiz/:kind/:id" element={<QuizPage />} />
      <Route path="revise" element={<RevisePage />} />
      <Route path="lessons" element={<LessonsPage />} />
      <Route path="lessons/:module" element={<ModuleLessonsPage />} />
      <Route path="lesson/:module/:lesson" element={<LessonPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
