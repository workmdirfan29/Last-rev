import { useCallback, useEffect, useRef } from "react"
import { useLearnerStore } from "@/stores/learner-store"

/** Time on task is logged only after this many active seconds, and is capped per visit. */
export const MIN_ACTIVE_SECONDS = 15
export const MAX_MINUTES_PER_VISIT = 20
/** A moment counts as active when the page is visible and the learner did something in the last minute. */
export const IDLE_AFTER_MS = 60_000

/** Whole minutes to log for some active seconds: at least 1 once there is real activity, never more than the cap. */
export function minutesForActive(seconds: number): number {
  if (seconds < MIN_ACTIVE_SECONDS) return 0
  return Math.min(MAX_MINUTES_PER_VISIT, Math.max(1, Math.round(seconds / 60)))
}

/**
 * Counts real active time on a screen and logs it as English activity (minutes = time on task, not an estimate).
 * `flush()` logs what has been counted so far and starts again; it also runs when the screen is left.
 */
export function useTimeOnTask(area: string) {
  const logActivity = useLearnerStore((s) => s.logActivity)
  const seconds = useRef(0)
  const lastTouch = useRef(0)
  const startedAt = useRef(new Date().toISOString())

  const flush = useCallback(() => {
    const minutes = minutesForActive(seconds.current)
    seconds.current = 0
    if (minutes > 0) {
      void logActivity(
        "english",
        `en-time:${area}:${startedAt.current}:${Date.now()}`,
        minutes
      )
    }
    startedAt.current = new Date().toISOString()
  }, [area, logActivity])

  useEffect(() => {
    lastTouch.current = Date.now()
    const touch = () => {
      lastTouch.current = Date.now()
    }
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const
    for (const e of events) window.addEventListener(e, touch, { passive: true })
    const tick = setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastTouch.current < IDLE_AFTER_MS
      )
        seconds.current += 1
    }, 1000)
    const onHide = () => document.visibilityState === "hidden" && flush()
    document.addEventListener("visibilitychange", onHide)
    return () => {
      clearInterval(tick)
      for (const e of events) window.removeEventListener(e, touch)
      document.removeEventListener("visibilitychange", onHide)
      flush()
    }
  }, [flush])

  return { flush }
}
