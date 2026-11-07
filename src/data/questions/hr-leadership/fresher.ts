import { defineQuestions } from "../author"

export default defineQuestions("hr-leadership", "fresher", [
  {
    slug: "describe-your-leadership-style",
    topic: "Leadership style",
    difficulty: "medium",
    title: "How would you describe your leadership style?",
    keywords: ["leadership style", "guidance", "delegation", "example"],
    interviewerIntent:
      "The interviewer checks self-awareness about how you guide others and whether your style fits the team.",
    shortAnswer:
      "I lead by [clear approach, for example setting clear goals and supporting people]. I explain the purpose of a task, I check in without micromanaging, and I make time to listen. For example, in [situation] I [action] and the team [result]. I adjust my style depending on how experienced the person is.",
    detailedAnswer: [
      "Name your style in plain words and support it with one real example.",
      "Show flexibility. Different people need different levels of guidance.",
      "Leadership can happen without a title, such as in a college project.",
    ],
    realWorldExample:
      "A student project lead assigned tasks by strengths, held short stand-ups, and was available to unblock people.",
    commonMistakes: [
      "Describing authority instead of influence.",
      "Giving no example.",
    ],
    followUps: [
      { question: "How do you motivate someone who is not performing?" },
    ],
    answerTips: ["Use a real example, even from a small group."],
    keyPoints: ["Clear goals", "Support, not micromanage", "Listen", "Adapt"],
    weakAnswer:
      "I tell people what to do and they must follow. I do not take opinions.",
    weakAnswerWhy: [
      "It sounds controlling.",
      "It ignores team input.",
      "It does not match modern teams.",
    ],
    recruiterExpects: ["Self-awareness", "Empathy", "Examples"],
    answerFramework: [
      "Style: I lead by [approach].",
      "How: I [explain purpose, check in, listen].",
      "Example: In [situation], I [action].",
      "Adaptation: I adjust for [person or context].",
    ],
    starPrompts: {
      situation: "Describe a time you guided a group.",
      task: "What did the group need to achieve?",
      action: "How did you organise and support them?",
      result: "What did the group achieve?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "a-time-you-took-the-lead",
    topic: "Initiative",
    difficulty: "medium",
    title:
      "Tell me about a time you took the lead on something without being asked.",
    keywords: ["initiative", "ownership", "taking the lead", "proactive"],
    interviewerIntent:
      "The interviewer looks for initiative and ownership, which signal growth potential.",
    shortAnswer:
      "In [situation], I noticed [problem or gap] and nobody was handling it. I proposed [solution] to [person], and with their agreement I [what you organised or did]. I kept the team updated and asked for feedback. As a result, [outcome]. It showed me that small initiative can make a real difference.",
    detailedAnswer: [
      "Show that you noticed a need, checked with the right people and acted.",
      "Describe your actions, not only the idea.",
      "Share the result honestly, and credit others.",
    ],
    realWorldExample:
      "A student noticed missing documentation for a group project, wrote a short guide, and the team used it for hand-over.",
    commonMistakes: [
      "Acting without telling anyone.",
      "Taking all the credit.",
    ],
    followUps: [{ question: "What did you learn about leading others?" }],
    answerTips: ["Pick a story that shows ownership and teamwork together."],
    keyPoints: ["Notice a gap", "Check with others", "Act", "Share credit"],
    weakAnswer: "I only do what I am assigned. Taking the lead is not my job.",
    weakAnswerWhy: [
      "It shows no initiative.",
      "It limits growth.",
      "It does not fit most roles.",
    ],
    recruiterExpects: ["Initiative", "Ownership", "Collaboration"],
    answerFramework: [
      "Gap: I noticed [problem].",
      "Proposal: I suggested [solution] to [person].",
      "Action: I [steps].",
      "Result: [outcome] and the team [benefit].",
    ],
    starPrompts: {
      situation: "What problem did you notice that nobody owned?",
      task: "Why did you decide to act?",
      action: "What did you do and who did you involve?",
      result: "What happened?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "motivating-a-team",
    topic: "Motivation",
    difficulty: "hard",
    title: "How do you motivate others when morale is low?",
    keywords: ["motivation", "morale", "empathy", "team spirit"],
    interviewerIntent:
      "The interviewer checks empathy and practical actions that help a team recover momentum.",
    shortAnswer:
      "First I listen to find out why morale is low, because the reason decides what helps. Then I act on what I can: clarify goals, recognise small wins, and remove blockers. In [situation], the team felt [reason], so I [action], and [result]. Honest, regular communication matters most.",
    detailedAnswer: [
      "Diagnose before acting. Low morale can come from unclear goals, overload or lack of recognition.",
      "Use practical actions: acknowledge progress, share the purpose, fix small irritants.",
      "Be honest about what you cannot change.",
    ],
    realWorldExample:
      "During a long project, a lead began ending each week with a short note of what the team had finished, which restored focus.",
    commonMistakes: ["Offering empty positivity.", "Ignoring the real cause."],
    followUps: [{ question: "What if the cause is outside your control?" }],
    answerTips: ["Use a real, small example."],
    keyPoints: [
      "Listen first",
      "Find the cause",
      "Recognise progress",
      "Be honest",
    ],
    weakAnswer: "I tell them to work harder and be positive.",
    weakAnswerWhy: [
      "It ignores the cause.",
      "It can feel dismissive.",
      "It offers no action.",
    ],
    recruiterExpects: ["Empathy", "Practical action", "Communication"],
    answerFramework: [
      "Listen: I ask [people] what is wrong.",
      "Cause: I found [reason].",
      "Action: I [practical step].",
      "Result: [outcome].",
    ],
    starPrompts: {
      situation: "Recall a time the group felt discouraged.",
      task: "What did the group need?",
      action: "What did you do?",
      result: "How did the mood and work change?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "delegating-tasks",
    topic: "Delegation",
    difficulty: "medium",
    title: "How do you delegate tasks to others?",
    keywords: ["delegation", "trust", "clarity", "follow up"],
    interviewerIntent:
      "The interviewer checks that you can share work with clear expectations and follow-up.",
    shortAnswer:
      "I match tasks to people's strengths and growth goals, explain the outcome I need and the deadline, and ask if anything is unclear. I agree on when to check in, rather than hovering. When it is done, I give feedback and credit. For example, in [situation], I [action] and the task was [result].",
    detailedAnswer: [
      "Good delegation needs clear expectations, the right person and agreed check-ins.",
      "Trust the person, but stay available for questions.",
      "Give feedback and credit afterwards.",
    ],
    realWorldExample:
      "A group leader gave a teammate the testing part because they wanted to learn it, and agreed on a mid-point check.",
    commonMistakes: [
      "Dumping tasks without context.",
      "Taking back work at the first problem.",
    ],
    followUps: [{ question: "What if the person misses the deadline?" }],
    answerTips: ["Mention clarity and follow-up."],
    keyPoints: [
      "Right person",
      "Clear outcome",
      "Agreed check-ins",
      "Feedback and credit",
    ],
    weakAnswer:
      "I do all the important work myself because others make mistakes.",
    weakAnswerWhy: [
      "It does not scale.",
      "It shows low trust.",
      "It limits the team.",
    ],
    recruiterExpects: ["Trust", "Clarity", "Fairness"],
    answerFramework: [
      "Match: I assign [task] to [person] because [reason].",
      "Clarity: I explain [outcome and deadline].",
      "Check-in: We agree [when].",
      "Feedback: I give [feedback and credit].",
    ],
    starPrompts: {
      situation: "Recall a time you divided work in a group.",
      task: "What needed to be done?",
      action: "How did you assign and follow up?",
      result: "How did it turn out?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "leading-without-authority",
    topic: "Influence",
    difficulty: "hard",
    title: "How do you influence people when you do not have formal authority?",
    keywords: ["influence", "persuasion", "credibility", "collaboration"],
    interviewerIntent:
      "The interviewer checks whether you can lead through trust, evidence and communication, which is essential early in a career.",
    shortAnswer:
      "I build credibility by delivering what I promise, and I explain the benefit of an idea in terms of the other person's goals. I use evidence, such as [data or a small demo], and I ask for their view instead of pushing. In [situation], I persuaded [person or group] to [change], and [result].",
    detailedAnswer: [
      "Influence rests on trust, listening and evidence.",
      "Frame ideas around shared goals, not personal preference.",
      "Be ready to adapt your idea based on feedback.",
    ],
    realWorldExample:
      "A junior engineer demonstrated a faster build setup on their own branch, and the team adopted it.",
    commonMistakes: [
      "Pushing your idea harder.",
      "Waiting for a title before acting.",
    ],
    followUps: [{ question: "What did you do when someone resisted?" }],
    answerTips: ["Use a story where you persuaded with facts and respect."],
    keyPoints: ["Credibility", "Shared goals", "Evidence", "Listening"],
    weakAnswer: "I cannot influence anyone unless I am the manager.",
    weakAnswerWhy: [
      "It shows low confidence.",
      "It ignores informal leadership.",
      "It limits growth.",
    ],
    recruiterExpects: ["Credibility", "Communication", "Collaboration"],
    answerFramework: [
      "Goal: I connected my idea to [their goal].",
      "Evidence: I showed [data or demo].",
      "Listening: I asked [question] and adapted.",
      "Result: They agreed to [change].",
    ],
    starPrompts: {
      situation:
        "When did you need others to agree with you without being their lead?",
      task: "What change did you want?",
      action: "How did you present and adapt your idea?",
      result: "What was decided?",
    },
    estimatedMinutes: 4,
  },
])
