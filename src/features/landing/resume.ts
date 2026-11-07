/**
 * The landing page resumes a returning learner only on the first entry to `/`
 * after a page load. Later visits (for example browser Back from a journey)
 * show the choices, so Back never bounces forward again. Module-level and not
 * persisted: a reload starts fresh.
 */
let handled = false

export const resumeAlreadyHandled = () => handled
export const markResumeHandled = () => {
  handled = true
}

/** Test helper: behave like a fresh page load. */
export const resetResumeForTests = () => {
  handled = false
}
