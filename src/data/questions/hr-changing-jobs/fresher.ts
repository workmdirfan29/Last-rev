import { defineQuestions } from "../author"

export default defineQuestions("hr-changing-jobs", "fresher", [
  {
    slug: "why-are-you-leaving-your-current-job",
    topic: "Reason for leaving",
    difficulty: "hard",
    title: "Why are you leaving your current job?",
    keywords: [
      "reason for leaving",
      "career move",
      "positive framing",
      "professionalism",
    ],
    interviewerIntent:
      "The interviewer wants a professional, forward-looking reason and checks that you do not blame others.",
    shortAnswer:
      "I have learned a lot at [current or last company type], especially [skill or experience]. Now I want [what you are looking for: a bigger scope, a new domain or deeper skills in an area], and this role offers [specific reason]. I am leaving on good terms and I am moving towards something rather than away from something.",
    detailedAnswer: [
      "Frame the move as going towards a goal: growth, scope, learning or a better match with your skills.",
      "Be truthful, but keep it constructive. Avoid blaming your manager, colleagues or the company.",
      "Connect the reason to what this role offers so it sounds like a deliberate step.",
    ],
    realWorldExample:
      "A developer who has worked on maintenance explains that they want to build new features and sees that opportunity in the new role.",
    commonMistakes: [
      "Criticising your current employer.",
      "Giving a reason about money only.",
      "Being vague or evasive.",
    ],
    followUps: [
      { question: "Have you spoken to your manager about these goals?" },
      { question: "What would have kept you there?" },
    ],
    answerTips: [
      "Prepare one positive, true reason and rehearse it so it sounds calm.",
    ],
    keyPoints: [
      "Move towards a goal",
      "No blame",
      "Truthful and calm",
      "Link to this role",
    ],
    weakAnswer:
      "My manager is terrible, the team does not listen and the company is badly run, so I want out.",
    weakAnswerWhy: [
      "It blames others.",
      "It suggests you may speak badly of this company too.",
      "It does not show what you are seeking.",
    ],
    recruiterExpects: [
      "Professionalism",
      "A forward-looking reason",
      "Honesty",
    ],
    answerFramework: [
      "Gratitude: At [company or role] I learned [skill].",
      "Goal: Now I am looking for [growth or scope].",
      "Fit: This role offers [specific thing].",
      "Close: I am leaving on good terms.",
    ],
    starPrompts: {
      situation:
        "Describe the point where you felt you had outgrown your current responsibilities.",
      task: "What did you want to achieve next?",
      action:
        "What steps did you take, such as asking for new work or learning new skills?",
      result: "What did you decide, and why?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "why-did-you-change-jobs-so-often",
    topic: "Job history",
    difficulty: "hard",
    title: "Your resume shows several short jobs. Why did you change so often?",
    keywords: ["job hopping", "stability", "short tenure", "explanation"],
    interviewerIntent:
      "The interviewer checks whether the pattern shows instability and whether you can explain it honestly and show you will stay.",
    shortAnswer:
      "Looking back, the moves had real reasons: [reason for the first move, such as a contract ending or a company closing] and [reason for the second]. From each I learned [skills]. What I am looking for now is [stability and long-term growth], and I chose this role because [specific reason it fits for the long run].",
    detailedAnswer: [
      "Give true, brief reasons for each move without making excuses.",
      "Show a lesson learned and that your priorities now favour stability.",
      "Point to what is different about this role and how you chose it carefully.",
    ],
    realWorldExample:
      "A candidate whose short roles were fixed-term contracts explains the contract nature and shows continuity in the skills they built.",
    commonMistakes: [
      "Blaming every employer.",
      "Pretending the moves were all planned.",
      "Getting defensive.",
    ],
    followUps: [{ question: "What will make you stay longer here?" }],
    answerTips: ["Show a thread of growth through the moves."],
    keyPoints: [
      "Honest reasons",
      "Lessons learned",
      "Stability now",
      "Why this role",
    ],
    weakAnswer: "I get bored easily, so I move when a job stops being fun.",
    weakAnswerWhy: [
      "It confirms the concern.",
      "It shows no commitment.",
      "It gives the employer a reason to worry.",
    ],
    recruiterExpects: ["Honesty", "Self-awareness", "Commitment"],
    answerFramework: [
      "Reasons: My moves were because [reason one] and [reason two].",
      "Learning: I gained [skills].",
      "Now: I am looking for [stability and growth].",
      "Why here: This role fits because [reason].",
    ],
    starPrompts: {
      situation: "Describe the circumstances of the most recent move.",
      task: "What did you need to decide?",
      action: "What did you do?",
      result: "What did you learn about what you want?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "switching-domain-or-technology",
    topic: "Career change",
    difficulty: "medium",
    title: "Why do you want to switch to a different domain or technology?",
    keywords: [
      "career switch",
      "transferable skills",
      "new domain",
      "motivation",
    ],
    interviewerIntent:
      "The interviewer checks that the switch is deliberate, backed by effort, and that your existing skills transfer.",
    shortAnswer:
      "In my current work with [old domain or tool] I became interested in [new domain or tool] when [what triggered it]. Since then I have [specific learning or project], and my skills in [transferable skills] carry over directly. I am ready to start at the right level and learn quickly.",
    detailedAnswer: [
      "Explain the trigger for your interest, then show actions you have already taken.",
      "List transferable skills such as problem solving, debugging and teamwork.",
      "Show realistic expectations about starting at a more junior level in some areas.",
    ],
    realWorldExample:
      "A tester who built small automation scripts moves to a development role and shows the scripts as proof.",
    commonMistakes: [
      "Saying you are bored of the old field.",
      "Showing no preparation for the new one.",
    ],
    followUps: [{ question: "How are you preparing for the switch?" }],
    answerTips: ["Bring something you built or completed in the new area."],
    keyPoints: [
      "Clear trigger",
      "Proof of effort",
      "Transferable skills",
      "Realistic expectations",
    ],
    weakAnswer: "The new technology pays better, so I want to switch.",
    weakAnswerWhy: [
      "It focuses only on money.",
      "It shows no commitment to the new area.",
      "It gives no evidence of effort.",
    ],
    recruiterExpects: ["Motivation", "Preparation", "Realism"],
    answerFramework: [
      "Trigger: I became interested in [new area] when [event].",
      "Action: Since then I [learning or project].",
      "Transfer: My [skills] carry over.",
      "Expectation: I am ready to learn [what].",
    ],
    starPrompts: {
      situation: "What moment made you want to explore the new area?",
      task: "What did you decide to learn first?",
      action: "What did you build or study?",
      result: "What can you do now?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "what-would-make-you-stay",
    topic: "Retention",
    difficulty: "medium",
    title: "What would make you stay in a job for a long time?",
    keywords: ["retention", "motivation", "growth", "culture"],
    interviewerIntent:
      "The interviewer learns what motivates you and whether the role can provide it.",
    shortAnswer:
      "Three things matter for me. First, learning: [type of challenges and mentoring]. Second, meaningful work: [what kind of impact]. Third, a respectful team where I can [collaborate or get feedback]. From what I have seen of this role, I think these are present, and I would also be open to discussing what the team needs.",
    detailedAnswer: [
      "Name two or three real motivators and link them to what you know about the role.",
      "Avoid listing only salary or perks.",
      "Show that you also think about what you will give to the team.",
    ],
    realWorldExample:
      "A candidate who values mentoring mentions looking forward to code reviews with senior engineers.",
    commonMistakes: [
      "Naming only money.",
      "Listing conditions that sound demanding.",
    ],
    followUps: [{ question: "What made you leave previous teams, if any?" }],
    answerTips: ["Pick motivators that this role can plausibly provide."],
    keyPoints: [
      "Learning",
      "Meaningful work",
      "Good team",
      "What you give back",
    ],
    weakAnswer: "If the pay is high and the work is easy, I will stay.",
    weakAnswerWhy: [
      "It shows low ambition.",
      "It names no real motivators.",
      "It sounds unprofessional.",
    ],
    recruiterExpects: ["Realistic motivators", "Fit with the role", "Maturity"],
    answerFramework: [
      "Learning: I stay where I can [learn].",
      "Work: I like work that [impact].",
      "People: I value [team qualities].",
      "Give back: I will contribute [what].",
    ],
    starPrompts: {
      situation: "Recall a project or team where you felt most motivated.",
      task: "What was your part?",
      action: "What did you do?",
      result: "What made it satisfying?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "were-you-asked-to-leave",
    topic: "Reason for leaving",
    difficulty: "hard",
    title: "Were you asked to leave your last job? What happened?",
    keywords: ["termination", "layoff", "honesty", "accountability"],
    interviewerIntent:
      "The interviewer checks that you answer honestly and calmly, and that you take appropriate accountability and learned from the situation.",
    shortAnswer:
      "[State the fact briefly and truthfully, for example: the role was affected by restructuring, or my work was not meeting expectations.] I understood the reasons, and I learned [specific lesson]. Since then I have [action you took, such as improving a skill]. I can give you references who can speak about [real strengths], and I am ready to show what I can do now.",
    detailedAnswer: [
      "Tell the truth in a few calm sentences. Inventing a story creates risk when employers check references.",
      "If it was a layoff, say so plainly. If it was performance, take responsibility and show what you changed.",
      "Move to what you learned and what you are doing now, rather than dwelling on the past.",
    ],
    realWorldExample:
      "A candidate whose team was affected by restructuring explains briefly and moves to the new skills they built since.",
    commonMistakes: [
      "Lying or hiding the truth.",
      "Blaming everyone else.",
      "Becoming emotional or angry.",
    ],
    followUps: [
      { question: "What would your former manager say about your work?" },
    ],
    answerTips: ["Practise saying it calmly in two or three sentences."],
    keyPoints: ["Truthful", "Brief", "Accountable", "Forward-looking"],
    weakAnswer: "My boss hated me and everyone in that company was against me.",
    weakAnswerWhy: [
      "It blames others.",
      "It sounds emotional.",
      "It shows no learning.",
    ],
    recruiterExpects: ["Honesty", "Composure", "Learning"],
    answerFramework: [
      "Fact: [brief truthful statement].",
      "Understanding: I understood that [reason].",
      "Learning: I learned [lesson].",
      "Action: Since then I [action], and I can provide references.",
    ],
    starPrompts: {
      situation: "Describe the circumstances in a neutral, factual way.",
      task: "What was expected of you?",
      action: "What did you do afterwards to improve?",
      result: "What is different about how you work now?",
    },
    estimatedMinutes: 4,
  },
])
