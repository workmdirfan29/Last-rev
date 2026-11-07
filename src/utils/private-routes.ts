/**
 * Pages that show the learner's resume text. Their error pages and logs never include an error's message,
 * because a message could carry that text.
 */
export const isPrivatePath = (pathname: string): boolean =>
  pathname === "/resume" ||
  pathname.startsWith("/resume/") ||
  pathname.startsWith("/interview/question/resume-")
