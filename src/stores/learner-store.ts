import { MAX_ATTEMPTS_PER_QUIZ } from "@/config/study"
import { create } from "zustand"
import { createDexieRepository } from "@/services/storage/dexie-repository"
import { buildExportBundle } from "@/services/storage/import-export"
import type { LearnerRepository } from "@/services/storage/repository"
import { recordReview, scheduleFirstReview } from "@/services/revision/schedule"
import {
  preferencesSchema,
  learnerProfileSchema,
  type ActivityEntry,
  type ActivityType,
  type CustomQuestion,
  type HrAnswer,
  type HrAnswerField,
  type MockSession,
  type EnglishState,
  type ProjectState,
  type QuizAttempt,
  type ReadinessSnapshot,
  type TargetRole,
  MAX_TARGET_ROLES,
  blankEnglishState,
  type ResumeProfile,
  type ResumeQuestion,
  type ExportBundle,
  type LearnerProfile,
  type LearningMode,
  type PlanState,
  type Preferences,
  type QuestionProgress,
} from "@/types/learner"
import { migrateKnownSkills } from "@/services/curriculum/skills-migration"
import { toDateKey } from "@/utils/dates"
import { makeCustomQuestionId } from "@/services/content/custom-questions"
import { newId } from "@/utils/id"

export interface LearnerState {
  status: "loading" | "ready" | "error"
  profile: LearnerProfile | null
  preferences: Preferences
  progress: Record<string, QuestionProgress>
  activity: ActivityEntry[]
  /** Questions the learner wrote. */
  customQuestions: CustomQuestion[]
  hrAnswers: HrAnswer[]
  mockSessions: MockSession[]
  resume: ResumeProfile | null
  resumeQuestions: ResumeQuestion[]
  english: EnglishState | null
  /** Every quiz attempt, oldest first (capped per quiz). */
  quizAttempts: QuizAttempt[]
  projectStates: ProjectState[]
  readinessSnapshots: ReadinessSnapshot[]
  targetRoles: TargetRole[]

  hydrate: () => Promise<void>
  saveProfile: (
    patch: Partial<Omit<LearnerProfile, "updatedAt">>
  ) => Promise<void>
  updatePreferences: (patch: Partial<Preferences>) => Promise<void>

  /** Record that a question was opened, so "continue learning" can resume here. */
  markViewed: (questionId: string) => Promise<void>
  /**
   * `activityType` lets non-interview features (e.g. Linux) reuse the same
   * progress record while logging their own kind of activity.
   */
  toggleCompleted: (
    questionId: string,
    minutes?: number,
    activityType?: ActivityType
  ) => Promise<void>
  toggleFlag: (
    questionId: string,
    flag: "bookmarked" | "difficult" | "revision"
  ) => Promise<void>
  setConfidence: (questionId: string, confidence: number) => Promise<void>
  setNote: (questionId: string, note: string) => Promise<void>
  /** Take a question out of the learner's prep (or put it back). Notes and progress are kept. */
  setQuestionRemoved: (questionId: string, removed: boolean) => Promise<void>
  /** Explicit, confirmed action: forget this question's notes and progress entirely. */
  deleteQuestionData: (questionId: string) => Promise<void>
  addCustomQuestion: (
    input: Pick<CustomQuestion, "moduleId" | "level" | "title"> &
      Partial<Pick<CustomQuestion, "answer" | "tags" | "note">>
  ) => Promise<CustomQuestion>
  updateCustomQuestion: (
    id: string,
    patch: Partial<
      Pick<
        CustomQuestion,
        "moduleId" | "level" | "title" | "answer" | "tags" | "note"
      >
    >
  ) => Promise<void>
  /** Delete the learner's own question and its progress. */
  deleteCustomQuestion: (id: string) => Promise<void>
  /** Save a new STAR answer to an HR question. At least one field must have text; returns null otherwise. */
  addHrAnswer: (
    input: {
      questionId: string
      title?: string
      selfCheck?: string[]
    } & Partial<Record<HrAnswerField, string>>
  ) => Promise<HrAnswer | null>
  updateHrAnswer: (
    id: string,
    patch: Partial<Pick<HrAnswer, "title" | "selfCheck" | HrAnswerField>>
  ) => Promise<void>
  deleteHrAnswer: (id: string) => Promise<void>
  /** Save a new mock interview session (already built from the setup). */
  createMockSession: (session: MockSession) => Promise<void>
  /** Change a session (answers, position, phase, elapsed time). Persisted on every call. */
  updateMockSession: (
    id: string,
    change: (session: MockSession) => MockSession
  ) => Promise<void>
  /** End a session: mark it finished or abandoned, and log a "mock" activity with the real answering minutes. */
  endMockSession: (
    id: string,
    status: "finished" | "abandoned"
  ) => Promise<void>
  deleteMockSession: (id: string) => Promise<void>
  /** Change the spoken English state (challenge, speaking log, passes). Created on first use. */
  updateEnglish: (
    change: (state: EnglishState) => EnglishState
  ) => Promise<void>
  /** Keep a finished quiz attempt. At most `MAX_ATTEMPTS_PER_QUIZ` stay per quiz; the oldest are dropped. */
  recordQuizAttempt: (attempt: QuizAttempt) => Promise<void>
  /** Keep this week's readiness snapshot (one per week; an existing one is left alone). */
  recordReadinessSnapshot: (s: ReadinessSnapshot) => Promise<void>
  /** Save a target role (at most MAX_TARGET_ROLES; the oldest is dropped). */
  saveTargetRole: (r: TargetRole) => Promise<void>
  deleteTargetRole: (id: string) => Promise<void>
  /** Create or change a project's state (notes, repository link, start date). */
  saveProjectState: (
    id: string,
    change: (state: ProjectState) => ProjectState
  ) => Promise<void>
  /** Save the reviewed resume profile (autosaved by the editor). */
  saveResume: (profile: ResumeProfile) => Promise<void>
  /** Replace the stored resume questions with this list (generated, imported and edited ones together). */
  setResumeQuestions: (questions: ResumeQuestion[]) => Promise<void>
  /** Change one resume question (its wording, or back to the generated wording). */
  updateResumeQuestion: (
    id: string,
    patch: Partial<Pick<ResumeQuestion, "title" | "edited">>
  ) => Promise<void>
  /** Remove resume questions with their notes, progress and saved answers. */
  deleteResumeQuestions: (ids: string[]) => Promise<void>
  /** Delete the resume, every question made from it, and the learner's notes and answers for them. Imported sets stay. */
  deleteResume: () => Promise<void>
  /** Set a flag on a question without toggling it (so "add to revision" never un-flags). */
  setFlag: (
    questionId: string,
    flag: "bookmarked" | "difficult" | "revision",
    value: boolean
  ) => Promise<void>
  /**
   * Check a plan block off (or undo it). The block is a normal progress record, so module completion stays
   * derived. Undo clears `completed` but keeps the activity entry: history is not rewritten. When a topic is split
   * into parts, the topic's own record is complete only while every part is.
   */
  setBlockDone: (
    block: { id: string; topicId: string; minutes: number },
    partIds: readonly string[],
    done: boolean
  ) => Promise<void>
  /** Change one journey's plan: study days, pinned blocks, removed blocks, start date, dismissed notice. */
  updatePlan: (
    mode: LearningMode,
    change: (plan: PlanState) => PlanState
  ) => Promise<void>
  /**
   * A topic's lessons are all finished: complete its plan blocks (and the topic's own record) without logging
   * study time again, because each lesson already logged its minutes. Undo with `done = false`.
   */
  setTopicDoneFromLessons: (
    topicId: string,
    partIds: readonly string[],
    done: boolean
  ) => Promise<void>
  /** Record the outcome of a spaced-repetition review. */
  reviewQuestion: (questionId: string, confidence: number) => Promise<void>

  logActivity: (
    type: ActivityType,
    refId?: string,
    minutes?: number
  ) => Promise<void>

  exportData: () => ExportBundle
  importData: (bundle: ExportBundle) => Promise<void>
  resetAll: () => Promise<void>
}

/** Older profiles stored skill display names; keep them working by mapping to stable skill ids. */
const upgradeProfile = (p: LearnerProfile): LearnerProfile => ({
  ...p,
  knownSkills: migrateKnownSkills(p.knownSkills),
})

const defaultPreferences = (): Preferences => preferencesSchema.parse({})

function blankProgress(questionId: string, now: Date): QuestionProgress {
  return {
    questionId,
    completed: false,
    bookmarked: false,
    difficult: false,
    revision: false,
    confidence: 0,
    note: "",
    attempts: 0,
    revisionStage: 0,
    nextReviewAt: null,
    completedAt: null,
    removed: false,
    lastStudiedAt: null,
    updatedAt: now.toISOString(),
  }
}

/**
 * Store factory. The repository is injected so tests can use an isolated
 * database and a future backend can be swapped in without touching the UI.
 */
export function createLearnerStore(
  repo: LearnerRepository,
  clock: () => Date = () => new Date()
) {
  return create<LearnerState>()((set, get) => {
    /**
     * Loading is done once per data set. A second load (React StrictMode runs effects twice; a test mounts
     * the app after seeding) would read the database before the changes made in the meantime and then
     * overwrite them in memory. `generation` changes when the data is cleared, so a load that started
     * before that can never apply its result.
     */
    let generation = 0
    let loading: { generation: number; done: Promise<void> } | null = null

    /** Apply a change to one question's progress and persist it. */
    async function mutate(
      questionId: string,
      change: (p: QuestionProgress, now: Date) => QuestionProgress
    ) {
      const now = clock()
      const current =
        get().progress[questionId] ?? blankProgress(questionId, now)
      const next = { ...change(current, now), updatedAt: now.toISOString() }
      set((s) => ({ progress: { ...s.progress, [questionId]: next } }))
      await repo.saveQuestionProgress(next)
    }

    return {
      status: "loading",
      profile: null,
      preferences: defaultPreferences(),
      progress: {},
      activity: [],
      customQuestions: [],
      hrAnswers: [],
      mockSessions: [],
      resume: null,
      resumeQuestions: [],
      english: null,
      quizAttempts: [],
      projectStates: [],
      readinessSnapshots: [],
      targetRoles: [],

      hydrate() {
        if (get().status === "ready") return Promise.resolve()
        if (loading && loading.generation === generation) return loading.done
        const mine = generation
        const done = (async () => {
          try {
            const snap = await repo.load()
            if (mine !== generation || get().status === "ready") return
            set({
              status: "ready",
              // Re-parse so profiles saved before newer fields existed pick up their defaults.
              profile: snap.profile
                ? upgradeProfile(learnerProfileSchema.parse(snap.profile))
                : null,
              preferences: snap.preferences,
              progress: Object.fromEntries(
                snap.questionProgress.map((p) => [p.questionId, p])
              ),
              activity: snap.activity,
              customQuestions: snap.customQuestions,
              hrAnswers: snap.hrAnswers,
              mockSessions: snap.mockSessions,
              resume: snap.resume,
              resumeQuestions: snap.resumeQuestions,
              english: snap.english,
              quizAttempts: snap.quizAttempts,
              projectStates: snap.projectStates,
              readinessSnapshots: snap.readinessSnapshots,
              targetRoles: snap.targetRoles,
            })
          } catch (error) {
            console.error("LastRev: failed to load local data", error)
            if (mine === generation) set({ status: "error" })
          }
        })()
        loading = { generation: mine, done }
        return done
      },

      async saveProfile(patch) {
        const now = clock()
        const base =
          get().profile ??
          learnerProfileSchema.parse({ updatedAt: now.toISOString() })
        const next: LearnerProfile = {
          ...base,
          ...patch,
          updatedAt: now.toISOString(),
        }
        set({ profile: next })
        await repo.saveProfile(next)
      },

      async updatePreferences(patch) {
        const next = preferencesSchema.parse({ ...get().preferences, ...patch })
        set({ preferences: next })
        await repo.savePreferences(next)
      },

      async markViewed(questionId) {
        await mutate(questionId, (p, now) => ({
          ...p,
          lastStudiedAt: now.toISOString(),
        }))
      },

      async toggleCompleted(
        questionId,
        minutes = 3,
        activityType = "question"
      ) {
        const wasCompleted = get().progress[questionId]?.completed ?? false
        const intervals = get().preferences.revisionIntervals
        await mutate(questionId, (p, now) =>
          p.completed
            ? {
                ...p,
                completed: false,
                completedAt: null,
                revisionStage: 0,
                nextReviewAt: null,
              }
            : {
                ...p,
                completed: true,
                completedAt: now.toISOString(),
                lastStudiedAt: now.toISOString(),
                attempts: p.attempts + 1,
                ...scheduleFirstReview(intervals, now),
              }
        )
        if (!wasCompleted)
          await get().logActivity(activityType, questionId, minutes)
      },

      async toggleFlag(questionId, flag) {
        await mutate(questionId, (p, now) => ({
          ...p,
          [flag]: !p[flag],
          lastStudiedAt: now.toISOString(),
        }))
      },

      async setConfidence(questionId, confidence) {
        await mutate(questionId, (p, now) => ({
          ...p,
          // Clicking the active rating clears it.
          confidence: p.confidence === confidence ? 0 : confidence,
          lastStudiedAt: now.toISOString(),
        }))
      },

      async setNote(questionId, note) {
        await mutate(questionId, (p) => ({ ...p, note }))
      },

      async setQuestionRemoved(questionId, removed) {
        await mutate(questionId, (p) => ({ ...p, removed }))
      },

      async deleteQuestionData(questionId) {
        set((s) => {
          const { [questionId]: _gone, ...rest } = s.progress
          void _gone
          return {
            progress: rest,
            hrAnswers: s.hrAnswers.filter((a) => a.questionId !== questionId),
          }
        })
        await repo.deleteQuestionProgress(questionId)
        await repo.deleteHrAnswersFor(questionId)
      },

      async addCustomQuestion(input) {
        const now = clock().toISOString()
        const taken = new Set(get().customQuestions.map((q) => q.id))
        const question: CustomQuestion = {
          id: makeCustomQuestionId(
            input.moduleId,
            input.level,
            input.title,
            taken
          ),
          moduleId: input.moduleId,
          level: input.level,
          title: input.title.trim(),
          answer: input.answer ?? "",
          tags: input.tags ?? [],
          note: input.note ?? "",
          createdAt: now,
          updatedAt: now,
        }
        set((s) => ({ customQuestions: [...s.customQuestions, question] }))
        await repo.saveCustomQuestion(question)
        return question
      },

      async updateCustomQuestion(id, patch) {
        const current = get().customQuestions.find((q) => q.id === id)
        if (!current) return
        const next: CustomQuestion = {
          ...current,
          ...patch,
          updatedAt: clock().toISOString(),
        }
        set((s) => ({
          customQuestions: s.customQuestions.map((q) =>
            q.id === id ? next : q
          ),
        }))
        await repo.saveCustomQuestion(next)
      },

      async deleteCustomQuestion(id) {
        set((s) => {
          const { [id]: _gone, ...rest } = s.progress
          void _gone
          return {
            customQuestions: s.customQuestions.filter((q) => q.id !== id),
            progress: rest,
          }
        })
        await repo.deleteCustomQuestion(id)
        await repo.deleteQuestionProgress(id)
      },

      async addHrAnswer(input) {
        const fields = {
          situation: input.situation ?? "",
          task: input.task ?? "",
          action: input.action ?? "",
          result: input.result ?? "",
        }
        if (Object.values(fields).every((v) => v.trim() === "")) return null
        const now = clock().toISOString()
        const answer: HrAnswer = {
          id: newId("ans"),
          questionId: input.questionId,
          title: (input.title ?? "").trim(),
          ...fields,
          selfCheck: input.selfCheck ?? [],
          createdAt: now,
          updatedAt: now,
        }
        set((s) => ({ hrAnswers: [...s.hrAnswers, answer] }))
        await repo.saveHrAnswer(answer)
        return answer
      },

      async updateHrAnswer(id, patch) {
        const current = get().hrAnswers.find((a) => a.id === id)
        if (!current) return
        const next: HrAnswer = {
          ...current,
          ...patch,
          updatedAt: clock().toISOString(),
        }
        set((s) => ({
          hrAnswers: s.hrAnswers.map((a) => (a.id === id ? next : a)),
        }))
        await repo.saveHrAnswer(next)
      },

      async deleteHrAnswer(id) {
        set((s) => ({ hrAnswers: s.hrAnswers.filter((a) => a.id !== id) }))
        await repo.deleteHrAnswer(id)
      },

      async createMockSession(session) {
        set((s) => ({ mockSessions: [...s.mockSessions, session] }))
        await repo.saveMockSession(session)
      },

      async updateMockSession(id, change) {
        const current = get().mockSessions.find((m) => m.id === id)
        if (!current) return
        const next: MockSession = {
          ...change(current),
          updatedAt: clock().toISOString(),
        }
        set((s) => ({
          mockSessions: s.mockSessions.map((m) => (m.id === id ? next : m)),
        }))
        await repo.saveMockSession(next)
      },

      async endMockSession(id, status) {
        const current = get().mockSessions.find((m) => m.id === id)
        if (!current || current.status !== "in-progress") return
        const now = clock()
        const next: MockSession = {
          ...current,
          status,
          finishedAt: now.toISOString(),
          updatedAt: now.toISOString(),
        }
        set((s) => ({
          mockSessions: s.mockSessions.map((m) => (m.id === id ? next : m)),
        }))
        await repo.saveMockSession(next)
        // Only real answering time counts: pause and rating time are not part of elapsedSeconds.
        const minutes = Math.round(next.elapsedSeconds / 60)
        if (status === "finished" && minutes > 0)
          await get().logActivity("mock", id, minutes)
      },

      async deleteMockSession(id) {
        set((s) => ({
          mockSessions: s.mockSessions.filter((m) => m.id !== id),
        }))
        await repo.deleteMockSession(id)
      },

      async setFlag(questionId, flag, value) {
        if ((get().progress[questionId]?.[flag] ?? false) === value) return
        await mutate(questionId, (p) => ({ ...p, [flag]: value }))
      },

      async updateEnglish(change) {
        const now = clock().toISOString()
        const current = get().english ?? blankEnglishState(now)
        const next = { ...change(current), updatedAt: now }
        set({ english: next })
        await repo.saveEnglish(next)
      },

      async recordQuizAttempt(attempt) {
        const same = get().quizAttempts.filter(
          (a) => a.quizId === attempt.quizId
        )
        const drop = same.slice(
          0,
          Math.max(0, same.length + 1 - MAX_ATTEMPTS_PER_QUIZ)
        )
        const dropped = new Set(drop.map((a) => a.id))
        set((s) => ({
          quizAttempts: [
            ...s.quizAttempts.filter((a) => !dropped.has(a.id)),
            attempt,
          ],
        }))
        await repo.saveQuizAttempt(attempt)
        if (dropped.size) await repo.deleteQuizAttempts([...dropped])
      },

      async recordReadinessSnapshot(snap) {
        if (get().readinessSnapshots.some((x) => x.id === snap.id)) return
        set((s) => ({ readinessSnapshots: [...s.readinessSnapshots, snap] }))
        await repo.saveReadinessSnapshot(snap)
      },

      async saveTargetRole(role) {
        const all = [
          ...get().targetRoles.filter((r) => r.id !== role.id),
          role,
        ].sort((a, b) => a.savedAt.localeCompare(b.savedAt))
        const keep = all.slice(-MAX_TARGET_ROLES)
        const dropped = all.filter((r) => !keep.includes(r))
        set({ targetRoles: keep })
        await repo.saveTargetRole(role)
        for (const d of dropped) await repo.deleteTargetRole(d.id)
      },

      async deleteTargetRole(id) {
        set((s) => ({ targetRoles: s.targetRoles.filter((r) => r.id !== id) }))
        await repo.deleteTargetRole(id)
      },

      async saveProjectState(id, change) {
        const now = clock().toISOString()
        const current: ProjectState = get().projectStates.find(
          (p) => p.id === id
        ) ?? { id, startedAt: null, repoUrl: "", notes: "", updatedAt: now }
        const next = { ...change(current), id, updatedAt: now }
        set((s) => ({
          projectStates: s.projectStates.some((p) => p.id === id)
            ? s.projectStates.map((p) => (p.id === id ? next : p))
            : [...s.projectStates, next],
        }))
        await repo.saveProjectState(next)
      },

      async saveResume(profile) {
        const next = { ...profile, updatedAt: clock().toISOString() }
        set({ resume: next })
        await repo.saveResume(next)
      },

      async setResumeQuestions(questions) {
        const previous = get().resumeQuestions
        const keep = new Set(questions.map((q) => q.id))
        const gone = previous.filter((q) => !keep.has(q.id)).map((q) => q.id)
        set({ resumeQuestions: questions })
        await repo.saveResumeQuestions(questions)
        if (gone.length) await repo.deleteResumeQuestions(gone)
      },

      async updateResumeQuestion(id, patch) {
        const current = get().resumeQuestions.find((q) => q.id === id)
        if (!current) return
        const next = { ...current, ...patch, updatedAt: clock().toISOString() }
        set((s) => ({
          resumeQuestions: s.resumeQuestions.map((q) =>
            q.id === id ? next : q
          ),
        }))
        await repo.saveResumeQuestions([next])
      },

      async deleteResumeQuestions(ids) {
        if (ids.length === 0) return
        const drop = new Set(ids)
        set((s) => {
          const progress = { ...s.progress }
          for (const id of drop) delete progress[id]
          return {
            resumeQuestions: s.resumeQuestions.filter((q) => !drop.has(q.id)),
            hrAnswers: s.hrAnswers.filter((a) => !drop.has(a.questionId)),
            progress,
          }
        })
        await repo.deleteResumeQuestions(ids)
        for (const id of ids) {
          await repo.deleteQuestionProgress(id)
          await repo.deleteHrAnswersFor(id)
        }
      },

      async deleteResume() {
        const ids = get()
          .resumeQuestions.filter((q) => q.setId === "")
          .map((q) => q.id)
        set({ resume: null })
        await repo.deleteResume()
        await get().deleteResumeQuestions(ids)
      },

      async setBlockDone(block, partIds, done) {
        const now = clock()
        // A part with no record of its own inherits the topic's: a topic finished whole before it was split.
        const topicWasDone = get().progress[block.topicId]?.completed ?? false
        await mutate(block.id, (p) => ({
          ...p,
          completed: done,
          completedAt: done ? now.toISOString() : null,
          lastStudiedAt: now.toISOString(),
        }))
        if (done) await get().logActivity("lesson", block.id, block.minutes)
        if (block.id !== block.topicId) {
          const all = partIds.every((id) => {
            const rec = get().progress[id]
            return rec ? rec.completed : topicWasDone
          })
          await mutate(block.topicId, (p) => ({
            ...p,
            completed: all,
            completedAt: all ? now.toISOString() : null,
          }))
        }
      },

      async setTopicDoneFromLessons(topicId, partIds, done) {
        for (const id of new Set([topicId, ...partIds]))
          await mutate(id, (p, now) => ({
            ...p,
            completed: done,
            completedAt: done ? (p.completedAt ?? now.toISOString()) : null,
            lastStudiedAt: now.toISOString(),
          }))
      },

      async updatePlan(mode, change) {
        const profile = get().profile
        if (!profile) return
        const next = change(profile.plans[mode])
        await get().saveProfile({ plans: { ...profile.plans, [mode]: next } })
      },

      async reviewQuestion(questionId, confidence) {
        const intervals = get().preferences.revisionIntervals
        await mutate(questionId, (p, now) => ({
          ...p,
          confidence,
          attempts: p.attempts + 1,
          lastStudiedAt: now.toISOString(),
          ...recordReview(p.revisionStage, confidence, intervals, now),
        }))
        await get().logActivity("revision", questionId, 2)
      },

      async logActivity(type, refId, minutes = 0) {
        const now = clock()
        const date = toDateKey(now)
        // One entry per (type, item, day): re-toggling an item must not farm activity.
        if (
          refId &&
          get().activity.some(
            (a) => a.type === type && a.refId === refId && a.date === date
          )
        ) {
          return
        }
        const entry: ActivityEntry = {
          id: newId("act"),
          type,
          refId,
          date,
          minutes,
          at: now.toISOString(),
        }
        set((s) => ({ activity: [...s.activity, entry] }))
        await repo.addActivity(entry)
      },

      exportData() {
        const s = get()
        return buildExportBundle(
          {
            profile: s.profile,
            preferences: s.preferences,
            questionProgress: Object.values(s.progress),
            activity: s.activity,
            customQuestions: s.customQuestions,
            hrAnswers: s.hrAnswers,
            mockSessions: s.mockSessions,
            resume: s.resume,
            resumeQuestions: s.resumeQuestions,
            english: s.english,
            quizAttempts: s.quizAttempts,
            projectStates: s.projectStates,
            readinessSnapshots: s.readinessSnapshots,
            targetRoles: s.targetRoles,
          },
          clock()
        )
      },

      async importData(bundle) {
        await repo.replaceAll(bundle)
        set({
          profile: bundle.profile,
          preferences: bundle.preferences,
          progress: Object.fromEntries(
            bundle.questionProgress.map((p) => [p.questionId, p])
          ),
          activity: bundle.activity,
          customQuestions: bundle.customQuestions,
          hrAnswers: bundle.hrAnswers,
          mockSessions: bundle.mockSessions,
          resume: bundle.resume,
          resumeQuestions: bundle.resumeQuestions,
          english: bundle.english,
          quizAttempts: bundle.quizAttempts,
          projectStates: bundle.projectStates,
          readinessSnapshots: bundle.readinessSnapshots,
          targetRoles: bundle.targetRoles,
        })
      },

      async resetAll() {
        generation++
        await repo.clear()
        set({
          profile: null,
          preferences: defaultPreferences(),
          progress: {},
          activity: [],
          customQuestions: [],
          hrAnswers: [],
          mockSessions: [],
          resume: null,
          resumeQuestions: [],
          english: null,
          quizAttempts: [],
          projectStates: [],
          readinessSnapshots: [],
          targetRoles: [],
        })
      },
    }
  })
}

export const useLearnerStore = createLearnerStore(createDexieRepository())
