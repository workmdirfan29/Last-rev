import Dexie, { type Table } from "dexie"
import {
  preferencesSchema,
  type ActivityEntry,
  type CustomQuestion,
  type ExportBundle,
  type HrAnswer,
  type LearnerProfile,
  type MockSession,
  type Preferences,
  type ProjectState,
  type QuizAttempt,
  type ReadinessSnapshot,
  type TargetRole,
  type EnglishState,
  type QuestionProgress,
  type ResumeProfile,
  type ResumeQuestion,
} from "@/types/learner"
import type { LearnerRepository, LearnerSnapshot } from "./repository"

const PROFILE_KEY = "profile"
const PREFS_STORAGE_KEY = "lastrev:preferences"

interface KvRow {
  key: string
  value: unknown
}

class LastRevDb extends Dexie {
  kv!: Table<KvRow, string>
  questionProgress!: Table<QuestionProgress, string>
  activity!: Table<ActivityEntry, string>
  customQuestions!: Table<CustomQuestion, string>
  hrAnswers!: Table<HrAnswer, string>
  mockSessions!: Table<MockSession, string>
  resume!: Table<ResumeProfile, string>
  resumeQuestions!: Table<ResumeQuestion, string>
  english!: Table<EnglishState, string>
  quizAttempts!: Table<QuizAttempt, string>
  projectStates!: Table<ProjectState, string>
  readinessSnapshots!: Table<ReadinessSnapshot, string>
  targetRoles!: Table<TargetRole, string>

  constructor(name: string) {
    super(name)
    this.version(1).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
    })
    // v2 adds the learner's own questions. Existing tables and rows are untouched,
    // so an upgrade cannot lose data; the new table simply starts empty.
    this.version(2).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
    })
    // v3 adds the learner's saved HR answers. Again nothing existing is touched.
    this.version(3).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
      hrAnswers: "id, questionId, updatedAt",
    })
    // v4 adds mock interview sessions. Nothing existing is touched.
    this.version(4).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
      hrAnswers: "id, questionId, updatedAt",
      mockSessions: "id, status, startedAt",
    })
    // v5 adds the resume profile and the questions generated from it. Nothing existing is touched.
    this.version(5).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
      hrAnswers: "id, questionId, updatedAt",
      mockSessions: "id, status, startedAt",
      resume: "id",
      resumeQuestions: "id, section, setId",
    })
    // v6 adds the spoken English state. Nothing existing is touched.
    this.version(6).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
      hrAnswers: "id, questionId, updatedAt",
      mockSessions: "id, status, startedAt",
      resume: "id",
      resumeQuestions: "id, section, setId",
      english: "id",
    })
    // v7 adds quiz attempts and project states. Nothing existing is touched.
    this.version(7).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
      hrAnswers: "id, questionId, updatedAt",
      mockSessions: "id, status, startedAt",
      resume: "id",
      resumeQuestions: "id, section, setId",
      english: "id",
      quizAttempts: "id, quizId, takenAt",
      projectStates: "id",
    })
    // v8 adds weekly readiness snapshots and saved target roles. Nothing existing is touched.
    this.version(8).stores({
      kv: "key",
      questionProgress: "questionId, updatedAt, nextReviewAt",
      activity: "id, date, type",
      customQuestions: "id, moduleId, updatedAt",
      hrAnswers: "id, questionId, updatedAt",
      mockSessions: "id, status, startedAt",
      resume: "id",
      resumeQuestions: "id, section, setId",
      english: "id",
      quizAttempts: "id, quizId, takenAt",
      projectStates: "id",
      readinessSnapshots: "id",
      targetRoles: "id, savedAt",
    })
  }
}

/** localStorage is for lightweight preferences only; it can be blocked or cleared. */
function readPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY)
    if (raw) return preferencesSchema.parse(JSON.parse(raw))
  } catch {
    /* fall through to defaults */
  }
  return preferencesSchema.parse({})
}

function writePreferences(preferences: Preferences): void {
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    /* storage unavailable — preferences simply won't persist */
  }
}

export function createDexieRepository(dbName = "lastrev"): LearnerRepository {
  const db = new LastRevDb(dbName)

  return {
    async load(): Promise<LearnerSnapshot> {
      const [
        profileRow,
        questionProgress,
        activity,
        customQuestions,
        hrAnswers,
        mockSessions,
        resumeRows,
        resumeQuestions,
        englishRows,
        quizAttempts,
        projectStates,
        readinessSnapshots,
        targetRoles,
      ] = await Promise.all([
        db.kv.get(PROFILE_KEY),
        db.questionProgress.toArray(),
        db.activity.toArray(),
        db.customQuestions.toArray(),
        db.hrAnswers.toArray(),
        db.mockSessions.toArray(),
        db.resume.toArray(),
        db.resumeQuestions.toArray(),
        db.english.toArray(),
        db.quizAttempts.toArray(),
        db.projectStates.toArray(),
        db.readinessSnapshots.toArray(),
        db.targetRoles.toArray(),
      ])
      return {
        profile: (profileRow?.value as LearnerProfile | undefined) ?? null,
        preferences: readPreferences(),
        questionProgress,
        activity,
        customQuestions,
        hrAnswers,
        mockSessions,
        resume: resumeRows[0] ?? null,
        resumeQuestions,
        english: englishRows[0] ?? null,
        quizAttempts,
        projectStates,
        readinessSnapshots,
        targetRoles,
      }
    },

    async saveProfile(profile) {
      await db.kv.put({ key: PROFILE_KEY, value: profile })
    },

    async savePreferences(preferences) {
      writePreferences(preferences)
    },

    async saveQuestionProgress(progress) {
      await db.questionProgress.put(progress)
    },

    async deleteQuestionProgress(questionId) {
      await db.questionProgress.delete(questionId)
    },

    async saveCustomQuestion(question) {
      await db.customQuestions.put(question)
    },

    async deleteCustomQuestion(id) {
      await db.customQuestions.delete(id)
    },

    async saveHrAnswer(answer) {
      await db.hrAnswers.put(answer)
    },

    async deleteHrAnswer(id) {
      await db.hrAnswers.delete(id)
    },

    async deleteHrAnswersFor(questionId) {
      await db.hrAnswers.where("questionId").equals(questionId).delete()
    },

    async saveMockSession(session) {
      await db.mockSessions.put(session)
    },

    async deleteMockSession(id) {
      await db.mockSessions.delete(id)
    },

    async saveResume(profile) {
      await db.resume.put(profile)
    },

    async deleteResume() {
      await db.resume.clear()
    },

    async saveEnglish(state) {
      await db.english.put(state)
    },

    async saveQuizAttempt(attempt) {
      await db.quizAttempts.put(attempt)
    },

    async deleteQuizAttempts(ids) {
      await db.quizAttempts.bulkDelete(ids)
    },

    async saveProjectState(state) {
      await db.projectStates.put(state)
    },

    async saveReadinessSnapshot(s) {
      await db.readinessSnapshots.put(s)
    },

    async saveTargetRole(r) {
      await db.targetRoles.put(r)
    },

    async deleteTargetRole(id) {
      await db.targetRoles.delete(id)
    },

    async saveResumeQuestions(questions) {
      await db.resumeQuestions.bulkPut(questions)
    },

    async deleteResumeQuestions(ids) {
      await db.resumeQuestions.bulkDelete(ids)
    },

    async addActivity(entry) {
      await db.activity.put(entry)
    },

    async replaceAll(bundle: ExportBundle) {
      await db.transaction(
        "rw",
        [
          db.kv,
          db.questionProgress,
          db.activity,
          db.customQuestions,
          db.hrAnswers,
          db.mockSessions,
          db.resume,
          db.resumeQuestions,
          db.english,
          db.quizAttempts,
          db.projectStates,
          db.readinessSnapshots,
          db.targetRoles,
        ],
        async () => {
          await Promise.all([
            db.kv.clear(),
            db.questionProgress.clear(),
            db.activity.clear(),
            db.customQuestions.clear(),
            db.hrAnswers.clear(),
            db.mockSessions.clear(),
            db.resume.clear(),
            db.resumeQuestions.clear(),
            db.english.clear(),
            db.quizAttempts.clear(),
            db.projectStates.clear(),
            db.readinessSnapshots.clear(),
            db.targetRoles.clear(),
          ])
          if (bundle.profile)
            await db.kv.put({ key: PROFILE_KEY, value: bundle.profile })
          await db.questionProgress.bulkPut(bundle.questionProgress)
          await db.activity.bulkPut(bundle.activity)
          await db.customQuestions.bulkPut(bundle.customQuestions)
          await db.hrAnswers.bulkPut(bundle.hrAnswers)
          await db.mockSessions.bulkPut(bundle.mockSessions)
          if (bundle.resume) await db.resume.put(bundle.resume)
          await db.resumeQuestions.bulkPut(bundle.resumeQuestions)
          if (bundle.english) await db.english.put(bundle.english)
          await db.quizAttempts.bulkPut(bundle.quizAttempts)
          await db.projectStates.bulkPut(bundle.projectStates)
          await db.readinessSnapshots.bulkPut(bundle.readinessSnapshots)
          await db.targetRoles.bulkPut(bundle.targetRoles)
        }
      )
      writePreferences(bundle.preferences)
    },

    async clear() {
      await db.transaction(
        "rw",
        [
          db.kv,
          db.questionProgress,
          db.activity,
          db.customQuestions,
          db.hrAnswers,
          db.mockSessions,
          db.resume,
          db.resumeQuestions,
          db.english,
          db.quizAttempts,
          db.projectStates,
          db.readinessSnapshots,
          db.targetRoles,
        ],
        async () => {
          await Promise.all([
            db.kv.clear(),
            db.questionProgress.clear(),
            db.activity.clear(),
            db.customQuestions.clear(),
            db.hrAnswers.clear(),
            db.mockSessions.clear(),
            db.resume.clear(),
            db.resumeQuestions.clear(),
            db.english.clear(),
            db.quizAttempts.clear(),
            db.projectStates.clear(),
            db.readinessSnapshots.clear(),
            db.targetRoles.clear(),
          ])
        }
      )
      try {
        localStorage.removeItem(PREFS_STORAGE_KEY)
      } catch {
        /* ignore */
      }
    },
  }
}
