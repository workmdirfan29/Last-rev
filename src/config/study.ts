/**
 * Every number the Study Zone's lessons, quizzes and sandbox depend on, in one place. Change a value here and
 * the app, the content gate and the tests follow; nothing else hard-codes them.
 */

/** A quiz is passed with at least this share of items answered correctly. */
export const PASS_MARK = 0.7
export const PASS_MARK_PERCENT = Math.round(PASS_MARK * 100)

/** Items in an assembled quiz (fewer when the pool is smaller; the screen says so). */
export const MODULE_QUIZ_ITEMS = 10
export const PHASE_QUIZ_ITEMS = 20
/** A phase quiz is offered only when the phase's lessons hold at least this many knowledge-check items. */
export const PHASE_QUIZ_MIN_POOL = 12
export const MODULE_QUIZ_MIN_POOL = 6
/** Share of a phase's released lessons to have finished before the phase quiz is suggested (text, never a lock). */
export const PHASE_QUIZ_SUGGEST_AT = 0.6
/** Attempts kept per quiz; the oldest are dropped. */
export const MAX_ATTEMPTS_PER_QUIZ = 500

/** The lessons of a topic add up to its minutes within this tolerance (see `services/lessons/gate.ts`). */
export const MINUTES_TOLERANCE = 0.25
/** A module is released when it has at least this many lessons (and covers every topic that has minutes). */
export const RELEASE_MIN_LESSONS = 3

/**
 * The Study plan's block order rules. Raise it when a change moves existing blocks (it was 1 when the plan began
 * following the roadmap's phases). A learner whose plan has history is offered "Restart plan from today" once.
 */
export const STUDY_ORDER_VERSION = 1

/** Running JavaScript exercises in the isolated sandbox. `false` makes every exercise self-check only. */
export const RUN_JS = true
export const SANDBOX = {
  /** Time allowed for one test case. */
  caseTimeoutMs: 2000,
  /** Characters of console output kept per run. */
  maxOutputChars: 10_000,
  maxConsoleLines: 50,
  maxCases: 12,
} as const
