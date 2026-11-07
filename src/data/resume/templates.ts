import type { ResumeSection } from "@/types/learner"

/**
 * The templates resume questions are made from. Plain text with {slots}; a slot is only ever filled with
 * the learner's own words from their reviewed resume, never with anything invented. A template is skipped when
 * a slot is empty. Nothing here is AI: it is the same text every time for the same resume.
 */

/** Per-source cap on responsibility, follow-up and achievement questions; the learner can raise it. */
export const CAP_PER_SOURCE = 4
/** Scenario questions are made for this many technologies, the ones the resume mentions most. */
export const SCENARIO_TECHNOLOGIES = 6
/** At most this many "listed but not used" skills become questions. */
export const UNUSED_SKILL_CAP = 5
/** A job shorter than this many months, and a gap longer than this, become neutral date questions. */
export const SHORT_TENURE_MONTHS = 12
export const GAP_MONTHS = 6
/** More skills than this makes the "which three" question. */
export const MANY_SKILLS = 15
/** Slot text longer than this is cut at a word and ends with an ellipsis. */
export const SLOT_MAX_CHARS = 140

export type EachSource =
  | "profile"
  | "skill"
  | "job"
  | "jobBullet"
  | "project"
  | "projectBullet"
  | "certification"
  | "achievement"
  | "derived"

export interface Template {
  id: string
  section: ResumeSection
  each: EachSource
  /** Wording with {slot} placeholders. */
  text: string
  /** A fill-in outline with [placeholders]: no sample answer, because only the learner knows their facts. */
  framework: string[]
}

const t = (
  id: string,
  section: ResumeSection,
  each: EachSource,
  text: string,
  framework: string[]
): Template => ({ id, section, each, text, framework })

export const TEMPLATES: readonly Template[] = [
  // Resume introduction
  t(
    "intro.walk",
    "intro",
    "profile",
    "Walk me through your resume, starting with your role as {role} at {company}.",
    [
      "Where I started: [your first step and what you learned].",
      "Then: [the move that followed and why].",
      "Now: [what you do today at {company}].",
      "Next: [why this role is the right next step].",
    ]
  ),
  t(
    "intro.summary",
    "intro",
    "profile",
    'Your summary says: "{summary}". Which part would you like to expand on?',
    [
      "The part I would expand on: [one phrase from your summary].",
      "An example that shows it: [a real example].",
      "What it says about how I work: [one sentence].",
    ]
  ),
  t(
    "intro.strengths",
    "intro",
    "profile",
    "Of the skills on your resume ({skill1}, {skill2}, {skill3}), which are you strongest in, and why?",
    [
      "My strongest: [one skill].",
      "Why: [where you used it most and what you built].",
      "Where I am still growing: [one skill and what you are doing about it].",
    ]
  ),
  // Technical skills (per skill)
  t(
    "skill.problem",
    "skills",
    "skill",
    "You list {skill}. Describe a problem you solved with it.",
    [
      "The problem: [what was wrong or needed].",
      "What I did with {skill}: [your steps].",
      "The result: [what changed, only what you can explain].",
    ]
  ),
  t(
    "skill.depth",
    "skills",
    "skill",
    "How would you describe your level in {skill}, and what do you still want to learn about it?",
    [
      "My level: [honest level and one example that shows it].",
      "What I can do alone: [tasks you can finish without help].",
      "What I want to learn next: [one specific thing].",
    ]
  ),
  // Companies (per job)
  t(
    "company.role",
    "company",
    "job",
    "What was your role at {company}, and what did a typical week look like?",
    [
      "My role: [your title and main responsibility].",
      "A typical week: [what you did on most days].",
      "What I owned: [what was yours alone].",
    ]
  ),
  t(
    "company.team",
    "company",
    "job",
    "Who did you work with at {company}, and how did you share the work?",
    [
      "The team: [who you worked with].",
      "How we split the work: [how tasks were shared].",
      "How I helped the team: [one example].",
    ]
  ),
  t(
    "company.learned",
    "company",
    "job",
    "What did you learn at {company} that you did not know when you started?",
    [
      "What I did not know: [a skill or habit].",
      "How I learned it: [what you did].",
      "How I use it now: [an example].",
    ]
  ),
  t("company.leave", "company", "job", "Why did you leave {company}?", [
    "What I was looking for: [what you wanted next].",
    "What I valued at {company}: [something true and positive].",
    "Why this move made sense: [one sentence, no blame].",
  ]),
  t(
    "company.stay",
    "company",
    "job",
    "What would make you stay at {company} longer?",
    [
      "What I value there: [what you like about the work].",
      "What I still want to do: [what you want to grow into].",
      "What would help me grow: [one specific thing].",
    ]
  ),
  // Responsibilities (per bullet)
  t(
    "resp.walk",
    "responsibility",
    "jobBullet",
    'You wrote: "{bullet}". Walk me through how you did that.',
    [
      "The situation: [why it was needed].",
      "My steps: [what you did, in order].",
      "What I would do the same or differently: [one point].",
    ]
  ),
  // Technology-specific follow-ups
  t(
    "follow.use",
    "followup",
    "jobBullet",
    'You mention {skill} in "{bullet}". How exactly did you use it there?',
    [
      "What I used {skill} for: [the task].",
      "How: [one concrete detail, such as a feature or setting].",
      "Why it fit: [the reason].",
    ]
  ),
  t(
    "follow.limits",
    "followup",
    "skill",
    "What are the limits of {skill}, and when would you choose something else?",
    [
      "Where {skill} is a good fit: [two cases].",
      "Where it is not: [one case and why].",
      "What I would pick instead: [an option and the reason].",
    ]
  ),
  // Projects (per project)
  t(
    "project.pitch",
    "project",
    "project",
    "Tell me about {project}: what problem did it solve and who used it?",
    [
      "The problem: [what it solved].",
      "Who used it: [the users].",
      "My part: [what you did].",
      "The result: [an outcome you can explain].",
    ]
  ),
  t(
    "project.part",
    "project",
    "project",
    "What was your own part in {project}?",
    [
      "What I built or decided: [your work].",
      "What others did: [the rest of the team, if any].",
      "How I know it was mine: [one detail you can explain].",
    ]
  ),
  t(
    "project.challenge",
    "project",
    "project",
    "What was the hardest problem in {project}, and how did you solve it?",
    [
      "The problem: [what made it hard].",
      "What I tried: [options you considered].",
      "What worked and why: [your solution].",
    ]
  ),
  t(
    "project.change",
    "project",
    "project",
    "If you rebuilt {project} today, what would you change?",
    [
      "What I would keep: [one good decision].",
      "What I would change: [one thing and why].",
      "What I learned from it: [one lesson].",
    ]
  ),
  t(
    "project.ship",
    "project",
    "project",
    "How did you test and release {project}?",
    [
      "How I tested: [what you checked and how].",
      "How it was released: [where and how it ran].",
      "What went wrong, if anything: [one example and the fix].",
    ]
  ),
  // Architecture (per project with technologies)
  t(
    "arch.walk",
    "architecture",
    "project",
    "Walk me through the architecture of {project}.",
    [
      "The parts: [the main pieces, for example screens, services, storage].",
      "How they talk: [how the pieces connect].",
      "Where {tech1} fits: [its role].",
    ]
  ),
  t(
    "arch.fit",
    "architecture",
    "project",
    "What made {tech1} a good fit for {project}?",
    [
      "What {project} needed: [the requirement].",
      "Why {tech1} suited it: [the reason].",
      "What else I considered: [an alternative and why not].",
    ]
  ),
  t(
    "arch.flow",
    "architecture",
    "project",
    "How does data move through {project}, from the user's action to storage?",
    [
      "The action: [what the user does].",
      "The path: [each step the data takes].",
      "Where it is stored and read: [storage and how you read it back].",
    ]
  ),
  t(
    "arch.growth",
    "architecture",
    "project",
    "How would {project} behave with ten times as many users, and what would you change first?",
    [
      "What would break first: [the weakest part].",
      "How I would find out: [what you would measure].",
      "My first change: [one change and why].",
    ]
  ),
  // Achievements
  t(
    "ach.how",
    "achievement",
    "jobBullet",
    'Tell me how you achieved this: "{bullet}". What was your part?',
    [
      "The situation: [what was the problem or goal].",
      "What I did: [your actions, in order].",
      "The result: [what changed, and how you know].",
    ]
  ),
  t(
    "ach.proof",
    "achievement",
    "jobBullet",
    'How did you know it worked? What evidence did you have for: "{bullet}"?',
    [
      "What I measured or observed: [the evidence].",
      "Before and after: [what you can honestly compare].",
      "What I could not measure: [a limit, stated honestly].",
    ]
  ),
  t(
    "ach.cert",
    "achievement",
    "certification",
    "Why did you pursue {certification}, and what have you used from it?",
    [
      "Why I did it: [your reason].",
      "What I learned: [one or two things].",
      "Where I used it: [a real example, or what you plan to do].",
    ]
  ),
  t(
    "ach.entry",
    "achievement",
    "achievement",
    'Tell me how you achieved this: "{achievement}". What was your part?',
    [
      "The situation: [context].",
      "What I did: [your actions].",
      "The result: [what changed].",
    ]
  ),
  // Difficult resume questions (derived from the data)
  t(
    "diff.unused",
    "difficult",
    "derived",
    "You list {skill}, but it does not appear in your experience or projects. Where have you used it?",
    [
      "Where I used it: [a real place: study, a side project, or work].",
      "How deep: [what you can and cannot do with it].",
      "If I have not used it much: [say so, and how you are learning it].",
    ]
  ),
  t(
    "diff.tenure",
    "difficult",
    "derived",
    "Your role at {company} lasted about {months} months. How would you explain that?",
    [
      "What happened: [the facts, briefly and honestly].",
      "What I achieved in that time: [one real thing].",
      "What I learned: [one lesson].",
    ]
  ),
  t(
    "diff.gap",
    "difficult",
    "derived",
    "There are about {months} months between {companyA} and {companyB}. What were you doing then?",
    [
      "What I was doing: [the facts].",
      "What I learned or built: [anything real].",
      "Why I came back ready: [one sentence].",
    ]
  ),
  t(
    "diff.numbers",
    "difficult",
    "derived",
    "None of your bullets include a number. Which result could you back with a figure, and where would it come from?",
    [
      "The result: [one result from your work].",
      "The figure I could give: [a number you can explain, or none].",
      "Where it comes from: [the source or how you measured it].",
    ]
  ),
  t(
    "diff.many",
    "difficult",
    "derived",
    "Your resume lists {count} skills. Which three would you be comfortable being tested on today?",
    [
      "My three: [three skills].",
      "Why these: [evidence for each].",
      "What I would not claim yet: [a skill you are still learning].",
    ]
  ),
  // Scenarios (generic engineering, keyed to the learner's technologies)
  t(
    "scen.fail",
    "scenario",
    "skill",
    "{skill} in production starts failing now and then. How would you investigate?",
    [
      "First: [what you would look at first].",
      "Then: [how you would narrow it down].",
      "Fixing it: [how you would fix and prevent it].",
    ]
  ),
  t(
    "scen.slow",
    "scenario",
    "skill",
    "A feature built with {skill} gets slower as the data grows. What would you check first?",
    [
      "What I would measure: [the evidence you would gather].",
      "Likely causes: [two or three].",
      "What I would change first: [one change and why].",
    ]
  ),
]

export const TEMPLATE_BY_ID: ReadonlyMap<string, Template> = new Map(
  TEMPLATES.map((x) => [x.id, x])
)

/** Short tips shown on every question of a section. */
export const SECTION_TIPS: Record<ResumeSection, string[]> = {
  intro: [
    "Keep it to about a minute and end with why this role.",
    "Everything you say must be on your resume or true; interviewers pick one line and ask about it.",
  ],
  skills: [
    "Name a real project or task, not a definition.",
    "If you used it only a little, say so plainly and say what you know.",
  ],
  company: [
    "Describe your own work, not the team's.",
    "Speak of past employers neutrally; do not blame anyone.",
  ],
  project: [
    "Say what you did yourself and what the team did.",
    "Only claim results you can explain step by step.",
  ],
  responsibility: [
    "Pick the steps in order and mention one decision you made.",
    "Be ready for a follow-up on any tool you name.",
  ],
  followup: [
    "Give one concrete detail about how you used the technology.",
    "It is fine to say what you would look up.",
  ],
  achievement: [
    "Use the situation, action, result order.",
    "Give a number only if it is real and you can explain where it comes from.",
  ],
  difficult: [
    "Answer calmly and honestly, in a few sentences.",
    "Finish with what you learned or what you do differently now.",
  ],
  architecture: [
    "Draw it in your head: parts first, then how they connect.",
    "Name one trade-off you made.",
  ],
  scenario: [
    "Start with what you would measure before you change anything.",
    "Say what you would try first and why.",
  ],
}

export const GENERATED_LABEL =
  "Generated from your resume with a template. No AI is involved."
