import { defineQuestions } from "../author"

export default defineQuestions("hr-career-goals", "fresher", [
  {
    slug: "where-do-you-see-yourself",
    topic: "Career vision",
    difficulty: "medium",
    title: "Where do you see yourself in five years?",
    keywords: ["career goals", "five years", "growth", "ambition"],
    interviewerIntent:
      "The interviewer wants realistic ambition that fits the company's path and suggests you will stay and grow.",
    shortAnswer:
      "In the short term I want to become strong in [skill or area] and be a dependable contributor on [type of work]. Over the next few years I would like to take on [larger responsibility, such as owning features or mentoring newer people]. I see this role as the right place to build that foundation, and I will adapt my goals as I learn what the team needs.",
    detailedAnswer: [
      "Describe a progression: learn, contribute, then take more responsibility. This shows realism.",
      "Stay flexible. Rigid titles can sound unrealistic, and goals that are unrelated to the company suggest you may leave.",
      "Connect the goals to what this role and company can offer.",
    ],
    realWorldExample:
      "A fresher developer says they want to own small features within the first years and later help review others' work.",
    commonMistakes: [
      "Saying you want the interviewer's job.",
      "Naming goals outside the company or field.",
      "Saying you have no plan.",
    ],
    followUps: [{ question: "What skills do you need to build to get there?" }],
    answerTips: ["Focus on skills and responsibility, not job titles."],
    keyPoints: [
      "Realistic progression",
      "Skills over titles",
      "Linked to the role",
      "Flexible",
    ],
    weakAnswer:
      "I will be your manager, or maybe I will start my own company and leave.",
    weakAnswerWhy: [
      "It sounds unrealistic or disloyal.",
      "It does not relate to the role.",
      "It has no plan.",
    ],
    recruiterExpects: [
      "Ambition that is realistic",
      "Commitment",
      "Fit with the company's path",
    ],
    answerFramework: [
      "Now: I want to build [core skills] in this role.",
      "Next: Then I would like to [take more responsibility].",
      "Later: Over time I see myself [growth direction].",
      "Fit: This role helps because [reason].",
    ],
    starPrompts: {
      situation: "Recall a goal you set earlier and worked towards.",
      task: "What was the goal?",
      action: "What steps did you take?",
      result: "What did you achieve?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "short-term-and-long-term-goals",
    topic: "Career vision",
    difficulty: "easy",
    title: "What are your short-term and long-term career goals?",
    keywords: ["short term goals", "long term goals", "planning", "growth"],
    interviewerIntent:
      "The interviewer checks that you plan ahead and that your plan makes sense in this field.",
    shortAnswer:
      "In the short term, my goal is to [learn the stack or domain and deliver reliably in my first role]. In the long term I want to [specialise in an area or grow into a broader responsibility]. I review my goals regularly and I am ready to adjust them based on feedback and opportunities in the team.",
    detailedAnswer: [
      "Separate the two time horizons clearly. Short-term goals are concrete, such as skills and responsibilities. Long-term goals are directions.",
      "Link both to the role so the company sees how it benefits.",
      "Mention how you track progress, which shows discipline.",
    ],
    realWorldExample:
      "A candidate sets a short-term goal of mastering the team's tools and a long-term goal of becoming a reliable technical lead.",
    commonMistakes: [
      "Only describing long-term dreams.",
      "Having goals unrelated to the job.",
    ],
    followUps: [{ question: "How are you working towards them now?" }],
    answerTips: ["Use measurable short-term goals."],
    keyPoints: [
      "Two horizons",
      "Concrete short term",
      "Directional long term",
      "Link to the role",
    ],
    weakAnswer: "I do not know yet. I will see what happens.",
    weakAnswerWhy: [
      "It shows no direction.",
      "It suggests low motivation.",
      "It gives the interviewer nothing.",
    ],
    recruiterExpects: ["Direction", "Realism", "Motivation"],
    answerFramework: [
      "Short term: I want to [specific skill goal] within [time you choose].",
      "Long term: I would like to [direction].",
      "How: I plan to [actions].",
      "Fit: This role supports it because [reason].",
    ],
    starPrompts: {
      situation: "Describe a time you planned a goal for yourself.",
      task: "What did you want to reach?",
      action: "What steps did you set?",
      result: "How did it go?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "how-does-this-role-fit-your-goals",
    topic: "Career fit",
    difficulty: "medium",
    title: "How does this role fit into your career goals?",
    keywords: ["role fit", "career path", "motivation", "alignment"],
    interviewerIntent:
      "The interviewer checks whether you chose this role deliberately and will stay motivated.",
    shortAnswer:
      "My goal is to [career direction], and this role gives me [specific opportunity from the job description, such as working with a certain technology or team]. It lets me build [skills] that I need for the next step. I have also looked at how [team or product] works, and I can see myself contributing to it.",
    detailedAnswer: [
      "Show you have read about the role and can name two specific things that match your goals.",
      "Avoid describing the job as a stepping stone to somewhere else.",
      "Mention what you will give back to the team, not only what you will gain.",
    ],
    realWorldExample:
      "A candidate who wants to grow in backend development points to the role's exposure to services and databases.",
    commonMistakes: [
      "Giving a generic answer that fits any job.",
      "Treating the role as temporary.",
    ],
    followUps: [{ question: "What else have you considered applying for?" }],
    answerTips: ["Use two details from the job description."],
    keyPoints: [
      "Specific match",
      "Skills you will build",
      "What you will give back",
      "Not a stepping stone",
    ],
    weakAnswer: "I just want any job that pays well for now.",
    weakAnswerWhy: [
      "It shows no interest in the role.",
      "It suggests short-term thinking.",
      "It is not specific.",
    ],
    recruiterExpects: ["Deliberate choice", "Genuine interest", "Commitment"],
    answerFramework: [
      "Goal: I want to [direction].",
      "Match: This role offers [two specific things].",
      "Skills: I will build [skills].",
      "Give back: I can contribute [strength].",
    ],
    starPrompts: {
      situation: "Recall how you decided to pursue this field.",
      task: "What did you want to learn or achieve?",
      action: "What did you do to prepare?",
      result: "What did you learn about what you want?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "plan-to-reach-your-goals",
    topic: "Planning",
    difficulty: "medium",
    title: "What steps are you taking to achieve your career goals?",
    keywords: ["action plan", "learning", "initiative", "self development"],
    interviewerIntent:
      "The interviewer checks that goals are backed by action and that you take initiative.",
    shortAnswer:
      "I am working on it in three ways. I am building [skill] through [course, project or practice], I am applying it in [project], and I ask [mentor or peers] for feedback about [how often]. Recently I [specific recent step]. After joining, I would continue by [plan with the team].",
    detailedAnswer: [
      "Describe habits and projects you already do, not future intentions.",
      "Include feedback from others and a recent concrete step.",
      "Show that you will continue learning on the job.",
    ],
    realWorldExample:
      "A candidate lists a small personal project, a regular coding practice and mentor feedback sessions.",
    commonMistakes: [
      "Only talking about plans.",
      "Listing courses with no application.",
    ],
    followUps: [{ question: "What did you learn from that project?" }],
    answerTips: ["Mention something you did in the last month."],
    keyPoints: [
      "Real actions",
      "Recent step",
      "Feedback loop",
      "Continuing plan",
    ],
    weakAnswer: "I will start learning after I get the job.",
    weakAnswerWhy: [
      "It shows no initiative.",
      "It has no current action.",
      "It does not build trust.",
    ],
    recruiterExpects: ["Initiative", "Concrete steps", "Consistency"],
    answerFramework: [
      "Learning: I am learning [skill] through [method].",
      "Practice: I apply it in [project].",
      "Feedback: I get feedback from [person or group].",
      "Next: I plan to [next step].",
    ],
    starPrompts: {
      situation: "Pick a skill you have been building recently.",
      task: "What did you aim to learn?",
      action: "What did you do each week?",
      result: "What can you do now that you could not before?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "what-if-your-goals-change",
    topic: "Career vision",
    difficulty: "hard",
    title: "What if your career goals change after you join us?",
    keywords: ["changing goals", "commitment", "flexibility", "honesty"],
    interviewerIntent:
      "The interviewer tests honesty and commitment: you cannot promise the future, but you can show how you would handle it.",
    shortAnswer:
      "Goals can evolve as I learn, so I will not pretend they never will. If that happens, I would first talk to my manager about options inside the company, such as [different area or responsibility]. My aim is to keep delivering well and to be open about what I want, so that the team can plan with me.",
    detailedAnswer: [
      "Be honest that goals may evolve, without suggesting you will leave soon.",
      "Show that you would discuss it openly and look for internal options first.",
      "Emphasise your commitment to delivering during your time on the team.",
    ],
    realWorldExample:
      "An engineer who becomes interested in data work asks for a small data task within the same team before considering a change.",
    commonMistakes: [
      "Saying goals will never change.",
      "Suggesting you will leave if things change.",
    ],
    followUps: [{ question: "How have your interests changed so far?" }],
    answerTips: ["Balance honesty with commitment."],
    keyPoints: [
      "Honest",
      "Talk to the manager first",
      "Internal options",
      "Keep delivering",
    ],
    weakAnswer: "If my goals change I will simply resign and move on.",
    weakAnswerWhy: [
      "It signals low commitment.",
      "It skips communication.",
      "It worries the employer.",
    ],
    recruiterExpects: ["Honesty", "Maturity", "Communication"],
    answerFramework: [
      "Honesty: My goals may evolve as I learn.",
      "Step: I would discuss [options] with my manager.",
      "Commitment: Meanwhile I would keep [delivering].",
      "Aim: To grow in a way that also helps the team.",
    ],
    starPrompts: {
      situation: "When did your interests or plans change before?",
      task: "What decision did you have to make?",
      action: "How did you handle it and who did you talk to?",
      result: "What was the result?",
    },
    estimatedMinutes: 3,
  },
])
