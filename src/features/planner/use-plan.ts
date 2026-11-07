import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { phasesOf } from "@/data/catalog/phases"
import { getRoadmap } from "@/data/catalog/roadmaps"
import { orderByPhases } from "@/services/study/phase-order"
import { resolveSource } from "@/features/curriculum/curriculum-source"
import {
  prepareCoreFirst,
  resolveSyllabus,
  restorePriorities,
  type SyllabusOverrides,
} from "@/services/curriculum/syllabus"
import {
  buildBlocks,
  dateOfStudyDay,
  orderModules,
  schedule,
  type PlanBlock,
  type Schedule,
  type ScheduledBlock,
} from "@/services/planner/schedule"
import { useLearnerStore } from "@/stores/learner-store"
import {
  ALL_WEEKDAYS,
  type LearningMode,
  type PlanState,
} from "@/types/learner"
import { toDateKey } from "@/utils/dates"

export interface Plan {
  mode: LearningMode
  today: string
  plan: PlanState
  dailyMinutes: number
  deadline: string | null
  entries: ReturnType<typeof resolveSyllabus>
  blocks: PlanBlock[]
  /** Blocks the learner took out of the plan, with their details, so they can be listed and restored. */
  removedBlocks: PlanBlock[]
  /** Removed block ids that no longer match the syllabus (it changed since); they can still be cleared. */
  staleRemoved: string[]
  schedule: Schedule
}

/**
 * The learner's daily plan for one journey: the effective syllabus turned into blocks, scheduled from
 * today with what they have finished, moved and removed. Everything is derived; nothing here is stored
 * except the learner's own changes (see PlanState).
 */
export function usePlan(mode: LearningMode): Plan | null {
  const profile = useLearnerStore((s) => s.profile)
  const progress = useLearnerStore((s) => s.progress)
  const updatePlan = useLearnerStore((s) => s.updatePlan)
  // The day is read once per mount; a plan view opened after midnight starts on the new day.
  const [today] = useState(() => toDateKey(new Date()))

  // A learner's plan starts the first day they open it, so a long-standing profile never shows weeks of missed days.
  const needsStart = !!profile && profile.plans[mode].startDate === null
  useEffect(() => {
    if (needsStart) void updatePlan(mode, (p) => ({ ...p, startDate: today }))
  }, [needsStart, mode, today, updatePlan])

  return useMemo(() => {
    if (!profile) return null
    const plan = profile.plans[mode]
    const overrides: SyllabusOverrides =
      mode === "study"
        ? profile.studySyllabusOverrides
        : profile.syllabusOverrides
    const source =
      mode === "study"
        ? resolveSource({ kind: "roadmap", roadmapId: profile.studyRoadmap })
        : resolveSource({ kind: "roles", roleIds: profile.selectedRoles })
    const entries = resolveSyllabus({
      defaults: source.defaults,
      overrides,
      experience: profile.experience,
      scope: source.scope,
    })
    const dailyMinutes = Math.round(profile.dailyStudyHours * 60)
    const domainOrder =
      source.domainOrder ?? getRoadmap(profile.studyRoadmap)?.domainOrder
    // The Study Path plan follows the roadmap's phases; Interview Prep keeps the domain order.
    const phases = mode === "study" ? phasesOf(profile.studyRoadmap ?? "") : []
    const ordered = phases.length
      ? orderByPhases(entries, phases, domainOrder)
      : orderModules(entries, domainOrder)
    const removedIds = new Set(plan.removed)
    const everything = buildBlocks(ordered, dailyMinutes)
    const blocks = everything.filter((b) => !removedIds.has(b.id))
    const removedBlocks = everything.filter((b) => removedIds.has(b.id))
    const known = new Set(removedBlocks.map((b) => b.id))
    const staleRemoved = plan.removed.filter((id) => !known.has(id))
    const doneOn: Record<string, string> = {}
    for (const b of blocks) {
      // A part without a record of its own inherits its topic's (a topic finished before it was split).
      const p = progress[b.id] ?? (b.part ? progress[b.topicId] : undefined)
      if (p?.completed)
        doneOn[b.id] = p.completedAt
          ? toDateKey(new Date(p.completedAt))
          : today
    }
    const sched = schedule({
      blocks,
      doneOn,
      moves: plan.moves,
      today,
      startDate: plan.startDate ?? today,
      deadline: profile.targetDate,
      dailyMinutes,
      studyDays: plan.studyDays.length ? plan.studyDays : [...ALL_WEEKDAYS],
    })
    return {
      mode,
      today,
      plan,
      dailyMinutes,
      deadline: profile.targetDate,
      entries,
      blocks,
      removedBlocks,
      staleRemoved,
      schedule: sched,
    }
  }, [profile, progress, mode, today])
}

/** What the learner can do to their plan. Every change is a deviation stored on the profile or a progress record. */
export function usePlanActions(plan: Plan | null) {
  const setBlockDone = useLearnerStore((s) => s.setBlockDone)
  const updatePlan = useLearnerStore((s) => s.updatePlan)
  const profile = useLearnerStore((s) => s.profile)
  const saveProfile = useLearnerStore((s) => s.saveProfile)
  const mode = plan?.mode ?? "interview"
  const overridesKey =
    mode === "study" ? "studySyllabusOverrides" : "syllabusOverrides"

  const toggleDone = useCallback(
    (block: ScheduledBlock | PlanBlock, done: boolean) => {
      if (!plan) return
      const partIds = plan.blocks
        .filter((b) => b.topicId === block.topicId)
        .map((b) => b.id)
      void setBlockDone(block, partIds, done)
    },
    [plan, setBlockDone]
  )

  const moveBlock = useCallback(
    (blockId: string, date: string) =>
      void updatePlan(mode, (p) => ({
        ...p,
        moves: { ...p.moves, [blockId]: date },
      })),
    [mode, updatePlan]
  )

  const clearMove = useCallback(
    (blockId: string) =>
      void updatePlan(mode, (p) => {
        const { [blockId]: _gone, ...moves } = p.moves
        void _gone
        return { ...p, moves }
      }),
    [mode, updatePlan]
  )

  const removeBlock = useCallback(
    (block: PlanBlock) => {
      void updatePlan(mode, (p) => ({
        ...p,
        removed: [...new Set([...p.removed, block.id])],
      }))
      const label = block.part
        ? `${block.moduleTitle}: ${block.topic} (part ${block.part.index})`
        : `${block.moduleTitle}: ${block.topic}`
      toast(`Removed from your plan: ${label}`, {
        description: "The module stays in your syllabus.",
        action: {
          label: "Undo",
          onClick: () =>
            void updatePlan(mode, (p) => ({
              ...p,
              removed: p.removed.filter((id) => id !== block.id),
            })),
        },
      })
    },
    [mode, updatePlan]
  )

  const restoreBlock = useCallback(
    (blockId: string) =>
      void updatePlan(mode, (p) => ({
        ...p,
        removed: p.removed.filter((id) => id !== blockId),
      })),
    [mode, updatePlan]
  )

  const restoreAllBlocks = useCallback(
    () => void updatePlan(mode, (p) => ({ ...p, removed: [] })),
    [mode, updatePlan]
  )

  const restart = useCallback(
    () =>
      void updatePlan(mode, (p) => ({
        ...p,
        startDate: toDateKey(new Date()),
        moves: {},
        catchUpDismissedOn: null,
      })),
    [mode, updatePlan]
  )

  const dismissCatchUp = useCallback(
    () =>
      void updatePlan(mode, (p) => ({
        ...p,
        catchUpDismissedOn: toDateKey(new Date()),
      })),
    [mode, updatePlan]
  )

  const setStudyDays = useCallback(
    (days: number[]) =>
      void updatePlan(mode, (p) => ({
        ...p,
        studyDays: days.length ? days : p.studyDays,
      })),
    [mode, updatePlan]
  )

  /** Option A of the deadline check: move the target to the day the plan really finishes (in study days from today). */
  const extendDeadline = useCallback(
    (studyDays: number) => {
      if (!plan) return
      void saveProfile({
        targetPreset: "custom",
        targetDate: dateOfStudyDay(
          plan.today,
          Math.max(2, studyDays),
          plan.plan.studyDays.length ? plan.plan.studyDays : [...ALL_WEEKDAYS]
        ),
      })
    },
    [plan, saveProfile]
  )

  /** Option C: study this many minutes a day, in half-hour steps. */
  const increaseDaily = useCallback(
    (minutes: number) =>
      void saveProfile({
        dailyStudyHours: Math.min(
          12,
          Math.max(0.5, Math.ceil(minutes / 30) / 2)
        ),
      }),
    [saveProfile]
  )

  /** Option B: everything that is not core goes to "Later". Reversible, with an Undo. */
  const prepareCore = useCallback(() => {
    if (!plan || !profile) return
    const before = profile[overridesKey]
    void saveProfile({
      [overridesKey]: prepareCoreFirst(before, plan.entries),
    })
    toast("Core first is on", {
      description:
        "Everything else is planned for later. It stays in your syllabus.",
      action: {
        label: "Undo",
        onClick: () => void saveProfile({ [overridesKey]: before }),
      },
    })
  }, [plan, profile, overridesKey, saveProfile])

  const restoreCore = useCallback(() => {
    if (!profile) return
    void saveProfile({
      [overridesKey]: restorePriorities(profile[overridesKey]),
    })
  }, [profile, overridesKey, saveProfile])

  return {
    extendDeadline,
    increaseDaily,
    prepareCore,
    restoreCore,
    toggleDone,
    moveBlock,
    clearMove,
    removeBlock,
    restoreBlock,
    restoreAllBlocks,
    restart,
    dismissCatchUp,
    setStudyDays,
  }
}
