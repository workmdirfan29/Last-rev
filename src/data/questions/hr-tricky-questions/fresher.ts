import { defineQuestions } from "../author"

export default defineQuestions("hr-tricky-questions", "fresher", [
  {
    slug: "sell-me-this-pen",
    topic: "Tricky questions",
    difficulty: "hard",
    title: "Sell me this pen.",
    keywords: ["sales pitch", "listening", "needs", "persuasion"],
    interviewerIntent:
      "The interviewer looks at whether you ask about needs before pitching, and how you stay calm with an unusual task.",
    shortAnswer:
      "Before selling, I would like to understand your needs. How often do you write, and what do you usually write with? Based on that, I would show the features that matter to you, such as [comfort, reliability or style], and explain how it solves your problem. If it fits, I would ask whether you would like to try it.",
    detailedAnswer: [
      "The best answers start with questions, not with a list of features.",
      "Connect each feature to a benefit for the other person.",
      "Close politely by asking for a decision.",
    ],
    realWorldExample:
      "A candidate asked the interviewer how they take notes, then explained how the pen would suit their meetings.",
    commonMistakes: ["Listing features immediately.", "Freezing or refusing."],
    followUps: [
      { question: "What would you do if I said I do not need a pen?" },
    ],
    answerTips: ["Ask first, then pitch."],
    keyPoints: [
      "Ask about needs",
      "Features to benefits",
      "Stay calm",
      "Ask for a decision",
    ],
    weakAnswer: "This pen is good. It is cheap. Please buy it.",
    weakAnswerWhy: [
      "It does not ask about needs.",
      "It lists vague features.",
      "It is not persuasive.",
    ],
    recruiterExpects: ["Composure", "Listening", "Persuasion"],
    answerFramework: [
      "Ask: Tell me how you use [item].",
      "Match: Based on that, [feature] helps you [benefit].",
      "Handle objection: If [concern], then [response].",
      "Close: Would you like to [next step]?",
    ],
    starPrompts: {
      situation: "Recall a time you persuaded someone to try an idea.",
      task: "What did they need?",
      action: "How did you present it?",
      result: "What did they decide?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "what-is-your-biggest-regret",
    topic: "Tricky questions",
    difficulty: "hard",
    title: "What is your biggest regret?",
    keywords: ["regret", "reflection", "learning", "maturity"],
    interviewerIntent:
      "The interviewer checks self-reflection and whether you can discuss a mistake without bitterness.",
    shortAnswer:
      "One thing I regret is [a real but not damaging decision, such as not asking for help earlier]. At the time, I [short explanation]. What I took from it is [lesson], and since then I [change you made]. I try to see regret as a signal for what matters to me and to improve from it.",
    detailedAnswer: [
      "Pick a real, relatively safe regret and keep the tone calm.",
      "Spend the second half on what you changed.",
      "Avoid regrets that raise serious concerns about integrity or reliability.",
    ],
    realWorldExample:
      "A candidate regrets not joining a coding community earlier and describes how they now attend regular meetups.",
    commonMistakes: [
      "Saying you have no regrets.",
      "Choosing something alarming.",
    ],
    followUps: [{ question: "What would you do differently now?" }],
    answerTips: ["Use a small, true story."],
    keyPoints: ["Real but safe", "Calm tone", "Lesson", "Change"],
    weakAnswer: "I regret nothing. My life has been perfect.",
    weakAnswerWhy: [
      "It is unrealistic.",
      "It shows no reflection.",
      "It avoids the question.",
    ],
    recruiterExpects: ["Reflection", "Maturity", "Honesty"],
    answerFramework: [
      "Regret: I regret [decision].",
      "Context: At that time [reason].",
      "Lesson: I learned [lesson].",
      "Change: Now I [change].",
    ],
    starPrompts: {
      situation: "What decision do you wish you had made differently?",
      task: "What were you trying to achieve?",
      action: "What did you do and not do?",
      result: "What did you learn and change?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "if-you-were-an-animal",
    topic: "Tricky questions",
    difficulty: "medium",
    title: "If you could be any animal, which would you be and why?",
    keywords: ["personality question", "creativity", "values", "composure"],
    interviewerIntent:
      "An unusual question to see composure, creativity and how you connect an odd prompt to real qualities.",
    shortAnswer:
      "I would choose [animal] because [quality it shows, such as teamwork, patience or adaptability]. I see that in myself when [short real example]. It is also a quality that would help in this role because [link]. I think the interesting part is how an animal's strengths match how we work.",
    detailedAnswer: [
      "Stay relaxed and choose quickly. There is no wrong animal, but the reasoning matters.",
      "Tie the quality to a real example and to the job.",
      "Keep it short and good-humoured.",
    ],
    realWorldExample:
      "A candidate who picked an animal known for cooperation described a group project where they coordinated others.",
    commonMistakes: [
      "Refusing to answer.",
      "Choosing an answer that sounds negative.",
    ],
    followUps: [
      { question: "What animal would your colleagues choose for you?" },
    ],
    answerTips: ["Prepare one quality and one example in advance."],
    keyPoints: [
      "Stay relaxed",
      "Reason matters",
      "Link to real quality",
      "Keep it short",
    ],
    weakAnswer: "That is a silly question. I do not want to answer it.",
    weakAnswerWhy: [
      "It sounds rude.",
      "It shows low flexibility.",
      "It wastes the chance.",
    ],
    recruiterExpects: ["Composure", "Creativity", "Link to qualities"],
    answerFramework: [
      "Choice: I would be [animal].",
      "Quality: Because [quality].",
      "Example: I show it when [example].",
      "Link: It helps in [role].",
    ],
    starPrompts: {
      situation: "Recall a moment you showed the quality you chose.",
      task: "What was needed?",
      action: "What did you do?",
      result: "What happened?",
    },
    estimatedMinutes: 2,
  },
  {
    slug: "do-you-have-any-questions-for-us",
    topic: "Closing",
    difficulty: "medium",
    title: "Do you have any questions for us?",
    keywords: [
      "questions for the interviewer",
      "curiosity",
      "closing",
      "role clarity",
    ],
    interviewerIntent:
      "The interviewer checks real interest and whether you prepared thoughtful questions.",
    shortAnswer:
      "Yes, I have a few. What does a typical first month look like for someone in this role? How does the team give feedback and support learning? And what are the main challenges the team is working on at the moment? Also, what are the next steps in the process?",
    detailedAnswer: [
      "Prepare three or four questions about the role, the team, learning and next steps.",
      "Avoid asking about salary and holidays in the first interview unless the interviewer raises it.",
      "Avoid questions that were already answered.",
    ],
    realWorldExample:
      "A candidate asked how the team reviews code, which led to a useful discussion about practices.",
    commonMistakes: ["Saying no questions.", "Asking only about benefits."],
    followUps: [{ question: "Why is that important to you?" }],
    answerTips: ["Write your questions down and bring them."],
    keyPoints: [
      "Prepare questions",
      "Role and team",
      "Learning and feedback",
      "Next steps",
    ],
    weakAnswer: "No questions. I am happy with everything. When do I get paid?",
    weakAnswerWhy: [
      "It shows low interest.",
      "It focuses only on pay.",
      "It misses the chance.",
    ],
    recruiterExpects: ["Curiosity", "Preparation", "Interest"],
    answerFramework: [
      "Role: What does [period] look like in this role?",
      "Team: How does the team [practice]?",
      "Challenge: What is the team working on that is [difficult]?",
      "Next: What are the next steps?",
    ],
    starPrompts: {
      situation:
        "Recall a time you asked a good question that helped you decide.",
      task: "What did you need to learn?",
      action: "What did you ask?",
      result: "What did you find out?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "describe-yourself-in-three-words",
    topic: "Tricky questions",
    difficulty: "medium",
    title: "Describe yourself in three words.",
    keywords: ["three words", "self description", "brevity", "evidence"],
    interviewerIntent:
      "The interviewer checks self-awareness and whether you can back words with short evidence.",
    shortAnswer:
      "I would say [word one], [word two] and [word three]. For example, [word one] describes how I [short example], [word two] shows in [short example], and [word three] is why I [short example]. I picked these because they match how I work with a team.",
    detailedAnswer: [
      "Choose words that fit the role and that you can support with a real example.",
      "Briefly explain each word in one sentence.",
      "Avoid clichés unless you have evidence.",
    ],
    realWorldExample:
      "A candidate chose curious, dependable and clear, and gave a small example for each.",
    commonMistakes: [
      "Giving three words with no explanation.",
      "Choosing words that conflict with your resume.",
    ],
    followUps: [{ question: "Which of these is the hardest to live up to?" }],
    answerTips: ["Pick words you can illustrate."],
    keyPoints: ["Three relevant words", "One example each", "Short", "Honest"],
    weakAnswer: "Hardworking, honest, smart. That is all.",
    weakAnswerWhy: [
      "It has no explanation.",
      "It is generic.",
      "It tells the interviewer nothing.",
    ],
    recruiterExpects: ["Self-awareness", "Evidence", "Brevity"],
    answerFramework: [
      "Words: [word one], [word two], [word three].",
      "Proof one: [example].",
      "Proof two: [example].",
      "Proof three: [example].",
    ],
    starPrompts: {
      situation: "Think of a moment that shows one of your words.",
      task: "What was needed?",
      action: "What did you do?",
      result: "What happened?",
    },
    estimatedMinutes: 2,
  },
])
