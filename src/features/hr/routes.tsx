import { Navigate, Route, Routes } from "react-router"
import { HrHomePage } from "./hr-home-page"
import { MyAnswersPage } from "./my-answers-page"

/** `/hr/*`: the HR interview home and the learner's saved answers. Questions open on the shared question route. */
export function Component() {
  return (
    <Routes>
      <Route index element={<HrHomePage />} />
      <Route path="answers" element={<MyAnswersPage />} />
      <Route path="*" element={<Navigate to="/hr" replace />} />
    </Routes>
  )
}
