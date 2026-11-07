import { Navigate, Route, Routes } from "react-router"
import { HistoryPage } from "./history-page"
import { MockHomePage } from "./mock-home-page"
import { ResultPage } from "./result-page"
import { SessionPage } from "./session-page"
import { SetupPage } from "./setup-page"

/** `/mock/*`: home, setup, a running session, its result, and the history. */
export function Component() {
  return (
    <Routes>
      <Route index element={<MockHomePage />} />
      <Route path="new" element={<SetupPage />} />
      <Route path="history" element={<HistoryPage />} />
      <Route path=":id" element={<SessionPage />} />
      <Route path=":id/result" element={<ResultPage />} />
      <Route path="*" element={<Navigate to="/mock" replace />} />
    </Routes>
  )
}
