import { defineQuestions } from "../author"

export default defineQuestions("hr-experienced-candidate", "fresher", [
  {
    slug: "your-biggest-professional-achievement",
    topic: "Achievements",
    difficulty: "medium",
    title: "What is your biggest professional achievement?",
    keywords: ["achievement", "impact", "ownership", "results"],
    interviewerIntent:
      "The interviewer looks for ownership and measurable, honest impact, together with what you personally did.",
    shortAnswer:
      "My biggest achievement was [project or outcome]. The situation was [context], and I was responsible for [your part]. I [key actions], and together with [team] we [result, with a number only if it is true and you can explain it]. It mattered because [reason], and I learned [lesson].",
    detailedAnswer: [
      "Pick an achievement relevant to the new role and clearly describe your own contribution.",
      "Use a real number only if you can explain how it was measured.",
      "Credit the team and describe what you learned.",
    ],
    realWorldExample:
      "An engineer describes leading the migration of a service and explains how the team verified it before switching.",
    commonMistakes: [
      "Inflating results.",
      "Describing the team's work as only yours.",
    ],
    followUps: [{ question: "How was the result measured?" }],
    answerTips: ["Choose something you can discuss in detail."],
    keyPoints: ["Relevant", "Your part", "Honest result", "Credit the team"],
    weakAnswer: "I did a lot of great work and everyone appreciated me.",
    weakAnswerWhy: [
      "It is vague.",
      "It has no result.",
      "It shows no actions.",
    ],
    recruiterExpects: ["Ownership", "Honesty", "Impact"],
    answerFramework: [
      "Context: [situation and goal].",
      "My part: I [responsibility and actions].",
      "Result: [result you can explain].",
      "Learning: I learned [lesson].",
    ],
    starPrompts: {
      situation: "What was the project or problem?",
      task: "What were you responsible for?",
      action: "What did you personally do?",
      result: "What changed because of it?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "how-have-you-grown-in-your-career",
    topic: "Growth",
    difficulty: "medium",
    title: "How have you grown professionally in your last role?",
    keywords: ["professional growth", "responsibility", "skills", "learning"],
    interviewerIntent:
      "The interviewer checks progression, learning and increasing responsibility.",
    shortAnswer:
      "When I started, I [early responsibilities]. Over time I took on [larger responsibilities], learned [new skills], and began [mentoring or owning a part of the system]. A moment I remember is [short example]. I want to keep growing in [direction], which is one reason I am interested in this role.",
    detailedAnswer: [
      "Show a path of increasing scope, skills and ownership.",
      "Give one short example to illustrate the growth.",
      "Link the next step to the new role.",
    ],
    realWorldExample:
      "A developer progressed from fixing bugs to owning a module and helping new joiners.",
    commonMistakes: [
      "Listing years instead of growth.",
      "Not linking to the new role.",
    ],
    followUps: [{ question: "What skill do you want to build next?" }],
    answerTips: ["Use before and after."],
    keyPoints: [
      "Increasing responsibility",
      "New skills",
      "Example",
      "Link to next step",
    ],
    weakAnswer: "I did the same work for years. Nothing changed.",
    weakAnswerWhy: [
      "It signals no growth.",
      "It sounds disengaged.",
      "It gives no value.",
    ],
    recruiterExpects: ["Progression", "Learning", "Direction"],
    answerFramework: [
      "Start: I began with [responsibility].",
      "Growth: I took on [larger scope] and learned [skills].",
      "Example: For instance [example].",
      "Next: I want to [direction].",
    ],
    starPrompts: {
      situation: "Describe how your role changed over time.",
      task: "What new responsibility did you take on?",
      action: "How did you prepare for it?",
      result: "What did you achieve?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "leading-or-mentoring-others-experienced",
    topic: "Leadership",
    difficulty: "medium",
    title:
      "Have you mentored or led junior team members? How did you support them?",
    keywords: ["mentoring", "leading juniors", "coaching", "knowledge sharing"],
    interviewerIntent:
      "The interviewer checks the ability to grow other people and share knowledge.",
    shortAnswer:
      "Yes. I mentored [number or description of juniors] by [pairing, code review, regular check-ins]. I explained why, not only what, and I let them solve problems with guidance. One of them [specific progress]. I learned that clear expectations and patience help people grow faster.",
    detailedAnswer: [
      "Describe how you taught and gave feedback, not only that you were a mentor.",
      "Show a concrete improvement in the person or the team.",
      "Mention what you learned as a mentor.",
    ],
    realWorldExample:
      "A senior developer ran a short weekly session on code reviews for new joiners.",
    commonMistakes: [
      "Describing supervision as mentoring.",
      "Taking credit for their growth.",
    ],
    followUps: [
      { question: "How do you give difficult feedback to a junior?" },
    ],
    answerTips: ["Mention feedback methods."],
    keyPoints: ["Pairing and reviews", "Explain why", "Progress", "Patience"],
    weakAnswer: "I do not have time to mentor. Juniors should figure it out.",
    weakAnswerWhy: [
      "It shows low leadership.",
      "It ignores team growth.",
      "It is a concern for senior roles.",
    ],
    recruiterExpects: ["Mentoring", "Patience", "Impact"],
    answerFramework: [
      "Who: I mentored [people].",
      "How: By [methods].",
      "Result: They [progress].",
      "Learning: I learned [lesson].",
    ],
    starPrompts: {
      situation: "Who did you support and why?",
      task: "What did they need to learn?",
      action: "How did you teach and give feedback?",
      result: "What changed for them?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "why-are-you-overqualified-or-underqualified",
    topic: "Fit",
    difficulty: "hard",
    title: "You seem overqualified for this role. Why do you want it?",
    keywords: ["overqualified", "fit", "motivation", "commitment"],
    interviewerIntent:
      "The interviewer worries about boredom or quick departure and checks your reasons.",
    shortAnswer:
      "I understand the concern. I chose this role deliberately because [specific reasons, such as the domain, the team, the technology or the balance of work]. I am not looking only for a title. I want to [contribute in a specific way], and I am happy to take on [responsibilities]. I plan to grow with the team over time.",
    detailedAnswer: [
      "Acknowledge the concern and give real, specific reasons for choosing the role.",
      "Show that you will be engaged and are not seeking a short stop.",
      "Offer how you will add value beyond the basic job.",
    ],
    realWorldExample:
      "A senior engineer moving to a smaller team explains they want hands-on work and closer collaboration.",
    commonMistakes: ["Appearing arrogant.", "Giving a vague answer."],
    followUps: [{ question: "What will keep you motivated here?" }],
    answerTips: ["Be specific about why this role fits."],
    keyPoints: ["Acknowledge", "Specific reasons", "Commitment", "Add value"],
    weakAnswer: "I just need any job for now until something better appears.",
    weakAnswerWhy: [
      "It confirms the concern.",
      "It shows low commitment.",
      "It ends the conversation.",
    ],
    recruiterExpects: ["Honesty", "Commitment", "Fit"],
    answerFramework: [
      "Acknowledge: I understand the concern.",
      "Reasons: I chose it because [reasons].",
      "Contribution: I can [value].",
      "Commitment: I want to grow with [team].",
    ],
    starPrompts: {
      situation:
        "Recall a time you took a role with a smaller scope for a good reason.",
      task: "What did you want from it?",
      action: "How did you make it valuable?",
      result: "What did you gain?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "how-do-you-keep-your-skills-current",
    topic: "Learning",
    difficulty: "medium",
    title: "How do you keep your skills current in a fast-changing field?",
    keywords: [
      "continuous learning",
      "upskilling",
      "habits",
      "technology change",
    ],
    interviewerIntent:
      "The interviewer checks that you have a repeatable learning habit and apply what you learn.",
    shortAnswer:
      "I set aside regular time for learning, mostly through [official documentation, courses or reading], and I apply new ideas in small side projects or at work. I follow [reliable sources] and I share what I learn with colleagues. For example, recently I learned [topic], and I used it to [result].",
    detailedAnswer: [
      "Describe a repeatable routine and where you learn from.",
      "Give a recent example of learning and applying something.",
      "Mention sharing knowledge, which reinforces learning.",
    ],
    realWorldExample:
      "An engineer spends a short block each week reading release notes and tries new features in a sample project.",
    commonMistakes: [
      "Naming courses without applying them.",
      "Claiming to know everything.",
    ],
    followUps: [{ question: "What did you learn most recently?" }],
    answerTips: ["Mention your latest learning."],
    keyPoints: ["Routine", "Reliable sources", "Apply it", "Share it"],
    weakAnswer: "I already know everything I need for this job.",
    weakAnswerWhy: [
      "It shows no growth.",
      "It is unrealistic in a changing field.",
      "It sounds arrogant.",
    ],
    recruiterExpects: ["Habit", "Curiosity", "Application"],
    answerFramework: [
      "Routine: I learn through [method] about [how often].",
      "Sources: I rely on [sources].",
      "Application: I used [new thing] to [result].",
      "Sharing: I share with [people].",
    ],
    starPrompts: {
      situation: "What new technology or practice did you learn recently?",
      task: "Why did you need it?",
      action: "How did you learn and apply it?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
])
