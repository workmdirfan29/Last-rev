import { defineQuestions } from "../author"

export default defineQuestions("hr-why-hire-you", "fresher", [
  {
    slug: "why-should-we-hire-you",
    topic: "Value proposition",
    difficulty: "medium",
    title: "Why should we hire you?",
    keywords: ["value", "fit", "skills", "pitch"],
    interviewerIntent:
      "The interviewer wants a clear, evidence-based case for how you will help the team, not a list of adjectives.",
    shortAnswer:
      "From the job description, you need someone who can [main requirement]. I have [relevant skill] and used it in [project or experience] to [what you achieved]. I also learn quickly: when I needed [new skill], I [how you learned it]. I would like to bring that reliability and curiosity to your team.",
    detailedAnswer: [
      "Match two or three requirements from the job description with specific proof from your experience.",
      "Add one quality, such as learning speed or ownership, backed by a real example.",
      "Be confident but not arrogant. You are showing fit, not claiming to be better than others.",
    ],
    realWorldExample:
      "A candidate for a React role names the exact skills in the advert and describes one project where they used them.",
    commonMistakes: [
      "Repeating the resume without linking to the role.",
      "Criticising other candidates.",
    ],
    followUps: [
      { question: "Which of those skills have you used most recently?" },
      { question: "What would your first month look like?" },
    ],
    answerTips: [
      "Study the job description and prepare two matching proofs before the interview.",
    ],
    keyPoints: [
      "Match the job description",
      "Use specific evidence",
      "One personal quality",
      "Confident, not arrogant",
    ],
    weakAnswer:
      "I am hardworking, honest and a quick learner, so you should hire me. I really need this job.",
    weakAnswerWhy: [
      "It lists qualities without evidence.",
      "It does not mention the role's needs.",
      "Saying you need the job puts the focus on you, not the company.",
    ],
    recruiterExpects: [
      "Relevant skills",
      "Evidence",
      "Enthusiasm for the role",
    ],
    answerFramework: [
      "Need: You are looking for [requirement from the job description].",
      "Proof: I have [skill] and used it to [specific example].",
      "Quality: I also [trait], for example [evidence].",
      "Close: I would bring this to [team or product].",
    ],
    starPrompts: {
      situation:
        "Pick a project or task that matches a key requirement of the job.",
      task: "What were you responsible for?",
      action: "Which skills and steps did you use?",
      result: "What was delivered and what did you learn?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "what-makes-you-different",
    topic: "Value proposition",
    difficulty: "medium",
    title: "What makes you different from other candidates?",
    keywords: [
      "differentiator",
      "unique",
      "strengths",
      "combination of skills",
    ],
    interviewerIntent:
      "The interviewer looks for a distinct, believable combination of skills or experiences without comparison to specific people.",
    shortAnswer:
      "I cannot speak for other candidates, but my combination is [skill one] with [skill two]. For example, in [project] I used both to [result]. I also [distinct experience or habit, such as writing documentation or mentoring peers]. That mix helps me solve [type of problem] from end to end.",
    detailedAnswer: [
      "Do not compare yourself directly with others. Describe your own mix of skills, experiences or habits.",
      "A combination is usually more believable than a single claim, for example technical depth plus communication.",
      "Support it with one specific example from your work or studies.",
    ],
    realWorldExample:
      "A developer who also writes clear user guides points to a project where better documentation reduced repeated questions from teammates.",
    commonMistakes: [
      "Claiming to be the best candidate.",
      "Naming a difference that is not useful for the job.",
    ],
    followUps: [
      { question: "Can you give an example where that combination helped?" },
    ],
    answerTips: [
      "Choose a difference that the job description actually values.",
    ],
    keyPoints: [
      "Own mix of skills",
      "Do not compare with others",
      "One concrete example",
      "Useful to the role",
    ],
    weakAnswer:
      "Nobody works as hard as I do. Other candidates will not match my dedication.",
    weakAnswerWhy: [
      "It compares with others without evidence.",
      "It sounds arrogant.",
      "It gives no example.",
    ],
    recruiterExpects: ["A believable differentiator", "Humility", "Relevance"],
    answerFramework: [
      "Mix: I combine [skill] and [skill].",
      "Example: In [project] that let me [what happened].",
      "Habit: I also [habit].",
      "Value: For your team that means [benefit].",
    ],
    starPrompts: {
      situation:
        "Describe a situation where your combination of skills made the difference.",
      task: "What did the situation require?",
      action: "How did you use both skills?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "first-months-value",
    topic: "Contribution",
    difficulty: "medium",
    title: "What value can you add to our team in the first few months?",
    keywords: ["onboarding", "first 90 days", "contribution", "learning plan"],
    interviewerIntent:
      "The interviewer wants to see realistic expectations, a learning plan and willingness to contribute early.",
    shortAnswer:
      "In the first month I would learn [your codebase, product and team practices] and fix [small, safe tasks] to get familiar. In the next months I would take on [larger task type] using my experience with [skill]. I will ask questions early, share what I learn, and aim to be a reliable contributor by [time frame you consider realistic].",
    detailedAnswer: [
      "Show a simple plan: learn first, then contribute, then own something. Avoid promising big changes before you know the team.",
      "Mention how you will learn: pairing, reading documentation, asking questions and getting feedback.",
      "Link your existing skills to the kind of work they will give you first.",
    ],
    realWorldExample:
      "A fresher says they will start with bug fixes and tests to learn the codebase, then pick up a small feature.",
    commonMistakes: [
      "Promising to transform the product immediately.",
      "Saying you have no plan until you start.",
    ],
    followUps: [{ question: "How do you usually learn a new codebase?" }],
    answerTips: ["Mention listening and learning before changing things."],
    keyPoints: [
      "Learn, contribute, own",
      "Realistic expectations",
      "Use existing skills",
      "Ask for feedback",
    ],
    weakAnswer:
      "I will fix everything that is wrong with your product and make the team much faster in one month.",
    weakAnswerWhy: [
      "It is unrealistic.",
      "It dismisses the current team.",
      "It has no plan.",
    ],
    recruiterExpects: ["Realism", "Initiative", "Willingness to learn"],
    answerFramework: [
      "Month one: I will learn [areas] and handle [small tasks].",
      "Next: I will take on [bigger work] using [skill].",
      "Habits: I will [ask questions, share notes, seek feedback].",
      "Goal: To be a dependable contributor in [area].",
    ],
    starPrompts: {
      situation: "Recall a time you joined a new team, course or project.",
      task: "What did you need to learn quickly?",
      action: "How did you get up to speed?",
      result: "When did you start contributing, and how?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "not-meeting-every-requirement",
    topic: "Gaps",
    difficulty: "hard",
    title:
      "You do not meet every requirement in the job description. Why should we still consider you?",
    keywords: [
      "skill gap",
      "learning ability",
      "transferable skills",
      "honesty",
    ],
    interviewerIntent:
      "The interviewer checks honesty about gaps and your ability to learn, not whether you pretend to know everything.",
    shortAnswer:
      "That is true, I have not yet used [missing skill] professionally. What I do have is [strongest matching skills], and I have learned similar tools quickly before. For example, I picked up [related skill] by [how] and used it in [project]. I have already started on [missing skill] through [course or practice], and I would continue it on the job.",
    detailedAnswer: [
      "Accept the gap honestly. Never claim a skill you do not have.",
      "Point to transferable skills and a past example of learning something new quickly.",
      "Show that you have already started closing the gap, with something concrete you can demonstrate.",
    ],
    realWorldExample:
      "A candidate lacking one framework shows a small project in a similar framework and a plan to learn the missing one.",
    commonMistakes: [
      "Pretending to know the missing skill.",
      "Getting defensive.",
    ],
    followUps: [
      { question: "How long would it take you to become productive in it?" },
      { question: "What have you learned on your own recently?" },
    ],
    answerTips: [
      "Prepare evidence of learning speed: a small project, certificate or notes.",
    ],
    keyPoints: [
      "Be honest",
      "Highlight transferable skills",
      "Show learning speed",
      "Show you have started",
    ],
    weakAnswer:
      "I know that technology very well. I have worked with it a lot.",
    weakAnswerWhy: [
      "If untrue, it will be exposed in technical questions.",
      "It damages trust.",
      "It misses the chance to show learning ability.",
    ],
    recruiterExpects: ["Honesty", "Learning ability", "A plan"],
    answerFramework: [
      "Honesty: I have not used [skill] professionally yet.",
      "Strength: I do have [related skills].",
      "Proof: I learned [similar tool] by [method] and used it in [example].",
      "Plan: I have begun [action] and will continue.",
    ],
    starPrompts: {
      situation: "Recall a time you had to learn a skill you did not have.",
      task: "What did you need to deliver?",
      action: "How did you learn it and apply it?",
      result: "What did you deliver and how quickly?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "what-will-we-lose",
    topic: "Value proposition",
    difficulty: "hard",
    title: "What will we lose if we do not hire you?",
    keywords: ["impact", "confidence", "humility", "value"],
    interviewerIntent:
      "This is a pressure question. The interviewer checks confidence balanced with humility and your ability to state value without arrogance.",
    shortAnswer:
      "I would not say the company loses everything, because I am sure you have good candidates. What you would miss with me is [specific strength] combined with [specific interest in the role]. For example, I [short evidence]. If you choose someone else, I will respect that, and I would still like feedback so I can improve.",
    detailedAnswer: [
      "Stay calm and avoid threats or bold claims. Pair confidence with respect for the decision.",
      "State two specific things you bring and one piece of evidence.",
      "Showing that you welcome feedback is a positive signal.",
    ],
    realWorldExample:
      "A candidate answers evenly, names one strength with a project example and asks for feedback either way.",
    commonMistakes: [
      "Saying the company will fail without you.",
      "Getting defensive or offended.",
    ],
    followUps: [{ question: "How do you handle rejection?" }],
    answerTips: ["Smile, pause, and answer with facts."],
    keyPoints: [
      "Calm and respectful",
      "Specific strength",
      "Evidence",
      "Open to feedback",
    ],
    weakAnswer:
      "You will lose the best employee you could ever get. Anyone else will be a mistake.",
    weakAnswerWhy: [
      "It is arrogant.",
      "It is not backed by evidence.",
      "It shows poor teamwork attitude.",
    ],
    recruiterExpects: ["Composure", "Humility", "Clear value"],
    answerFramework: [
      "Respect: I know you will have strong candidates.",
      "Value: What I can offer is [strength] and [interest].",
      "Evidence: For example, [short proof].",
      "Close: I would value your feedback either way.",
    ],
    starPrompts: {
      situation:
        "Recall a situation where you had to stay composed under challenge.",
      task: "What did you need to achieve?",
      action: "How did you respond?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
])
