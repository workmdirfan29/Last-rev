import { Navigate, Route, Routes } from "react-router"
import { ResumePage } from "./resume-page"

/** `/resume`: one page with tabs. Questions open on the shared question route. */
export function Component() {
  return (
    <Routes>
      <Route index element={<ResumePage />} />
      <Route path="*" element={<Navigate to="/resume" replace />} />
    </Routes>
  )
}
