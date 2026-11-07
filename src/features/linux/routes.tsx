import { Route, Routes } from "react-router"
import { NotFoundPage } from "@/components/shared/not-found"
import { ChallengePage } from "./pages/challenge-page"
import { ChallengesPage } from "./pages/challenges-page"
import { ChmodPage } from "./pages/chmod-page"
import { CommandPage } from "./pages/command-page"
import { DatesPage } from "./pages/dates-page"
import { LibraryPage } from "./pages/library-page"
import { TerminalPage } from "./pages/terminal-page"
import { LinuxLayout } from "./linux-layout"

/** `/linux/*` — the Linux feature owns its sub-routes (paths are relative to /linux). */
export function Component() {
  return (
    <Routes>
      <Route element={<LinuxLayout />}>
        <Route index element={<LibraryPage />} />
        <Route path="command/:slug" element={<CommandPage />} />
        <Route path="terminal" element={<TerminalPage />} />
        <Route path="chmod" element={<ChmodPage />} />
        <Route path="dates" element={<DatesPage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="challenges/:slug" element={<ChallengePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
