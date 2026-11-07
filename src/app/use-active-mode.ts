import { useLocation } from "react-router"
import { useLearnerStore } from "@/stores/learner-store"
import type { AppMode } from "@/types/learner"
import { activeMode } from "./nav"

/** The journey the current page belongs to; shared pages use the last-used journey. */
export function useActiveMode(): AppMode {
  const { pathname } = useLocation()
  const lastMode = useLearnerStore((s) => s.preferences.lastMode)
  return activeMode(pathname, lastMode)
}
