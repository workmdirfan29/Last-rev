import type {
  ActivityEntry,
  CustomQuestion,
  ExportBundle,
  HrAnswer,
  LearnerProfile,
  MockSession,
  Preferences,
  ProjectState,
  QuizAttempt,
  ReadinessSnapshot,
  TargetRole,
  EnglishState,
  QuestionProgress,
  ResumeProfile,
  ResumeQuestion,
} from "@/types/learner"

export interface LearnerSnapshot {
  profile: LearnerProfile | null
  preferences: Preferences
  questionProgress: QuestionProgress[]
  activity: ActivityEntry[]
  customQuestions: CustomQuestion[]
  hrAnswers: HrAnswer[]
  mockSessions: MockSession[]
  resume: ResumeProfile | null
  resumeQuestions: ResumeQuestion[]
  english: EnglishState | null
  quizAttempts: QuizAttempt[]
  projectStates: ProjectState[]
  readinessSnapshots: ReadinessSnapshot[]
  targetRoles: TargetRole[]
}

/**
 * Persistence boundary. The UI and stores only ever talk to this interface, so
 * replacing IndexedDB with a remote API means writing one new implementation.
 */
export interface LearnerRepository {
  load(): Promise<LearnerSnapshot>
  saveProfile(profile: LearnerProfile): Promise<void>
  savePreferences(preferences: Preferences): Promise<void>
  saveQuestionProgress(progress: QuestionProgress): Promise<void>
  /** Delete one question's progress record (notes included). Only used by the explicit "delete my notes and progress" action. */
  deleteQuestionProgress(questionId: string): Promise<void>
  addActivity(entry: ActivityEntry): Promise<void>
  saveCustomQuestion(question: CustomQuestion): Promise<void>
  deleteCustomQuestion(id: string): Promise<void>
  saveHrAnswer(answer: HrAnswer): Promise<void>
  deleteHrAnswer(id: string): Promise<void>
  /** Delete every saved answer of one question (the explicit "delete my notes and progress" action). */
  deleteHrAnswersFor(questionId: string): Promise<void>
  saveMockSession(session: MockSession): Promise<void>
  deleteMockSession(id: string): Promise<void>
  saveResume(profile: ResumeProfile): Promise<void>
  deleteResume(): Promise<void>
  saveResumeQuestions(questions: ResumeQuestion[]): Promise<void>
  deleteResumeQuestions(ids: string[]): Promise<void>
  saveEnglish(state: EnglishState): Promise<void>
  saveQuizAttempt(attempt: QuizAttempt): Promise<void>
  deleteQuizAttempts(ids: string[]): Promise<void>
  saveProjectState(state: ProjectState): Promise<void>
  saveReadinessSnapshot(s: ReadinessSnapshot): Promise<void>
  saveTargetRole(r: TargetRole): Promise<void>
  deleteTargetRole(id: string): Promise<void>
  /** Replace everything (used by import). */
  replaceAll(bundle: ExportBundle): Promise<void>
  /** Delete all learner data (used by reset). */
  clear(): Promise<void>
}
