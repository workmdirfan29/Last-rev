import { defineQuestions } from "../author"

export default defineQuestions("hr-work-ethics", "fresher", [
  {
    slug: "what-does-work-ethic-mean-to-you",
    topic: "Values",
    difficulty: "easy",
    title: "What does work ethic mean to you?",
    keywords: ["work ethic", "values", "responsibility", "integrity"],
    interviewerIntent:
      "The interviewer checks your values and whether you can show them through behaviour, not slogans.",
    shortAnswer:
      "To me, work ethic means doing what I committed to, doing it well, and being honest about problems. It includes being on time, owning my mistakes and helping the team when needed. For example, in [situation], I [action showing it], and [result]. I believe small consistent habits matter more than big words.",
    detailedAnswer: [
      "Define it in two or three behaviours, such as reliability, honesty and effort.",
      "Back it with a real example.",
      "Avoid vague phrases like hard work only.",
    ],
    realWorldExample:
      "A student always shared project updates on time, which let teammates plan their own work.",
    commonMistakes: [
      "Giving a dictionary definition.",
      "Saying long hours equal ethic.",
    ],
    followUps: [{ question: "How do you show it when nobody is watching?" }],
    answerTips: ["Pick behaviours you really practise."],
    keyPoints: ["Reliable", "Honest", "Owns mistakes", "Example"],
    weakAnswer:
      "Work ethic means working very long hours and sacrificing everything.",
    weakAnswerWhy: [
      "It equates hours with quality.",
      "It ignores balance.",
      "It has no examples.",
    ],
    recruiterExpects: ["Clear values", "Evidence", "Reliability"],
    answerFramework: [
      "Definition: To me it means [behaviours].",
      "Example: In [situation] I [action].",
      "Result: [outcome].",
      "Habit: I keep [habit].",
    ],
    starPrompts: {
      situation: "Recall a time your reliability mattered to others.",
      task: "What had you committed to?",
      action: "What did you do to keep the commitment?",
      result: "What was the effect?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "meeting-commitments",
    topic: "Reliability",
    difficulty: "medium",
    title:
      "Tell me about a time you kept a commitment even when it was difficult.",
    keywords: ["commitment", "reliability", "accountability", "follow through"],
    interviewerIntent:
      "The interviewer looks for follow-through and honesty when things get hard.",
    shortAnswer:
      "I had committed to [task] by [date] and then [what made it hard]. I considered asking to drop it, but I had given my word, so I [action: re-planned, asked for help or used extra time]. I also told [person] about the risk early. I delivered [outcome], and I learned to estimate more carefully before committing.",
    detailedAnswer: [
      "Pick a story where keeping the commitment cost you effort.",
      "Show communication, not silent struggling.",
      "Mention what you changed about making commitments.",
    ],
    realWorldExample:
      "A volunteer organised an event after a sudden drop in helpers by recruiting friends and simplifying the programme.",
    commonMistakes: [
      "Making it sound like a heroic all-nighter.",
      "Skipping the lesson.",
    ],
    followUps: [{ question: "When would you renegotiate a commitment?" }],
    answerTips: ["Add the communication step."],
    keyPoints: [
      "Honour your word",
      "Communicate risks",
      "Find a way",
      "Learn about estimating",
    ],
    weakAnswer: "I always keep commitments. There was never any difficulty.",
    weakAnswerWhy: [
      "It gives no example.",
      "It is unrealistic.",
      "It shows no reflection.",
    ],
    recruiterExpects: ["Reliability", "Honesty", "Resilience"],
    answerFramework: [
      "Commitment: I promised [task] by [date].",
      "Difficulty: Then [obstacle].",
      "Action: I [steps] and told [person].",
      "Result: [outcome] and I learned [lesson].",
    ],
    starPrompts: {
      situation: "What had you promised and what got in the way?",
      task: "What did you need to deliver?",
      action: "What did you do to keep your word?",
      result: "What happened?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "integrity-when-nobody-is-watching",
    topic: "Integrity",
    difficulty: "hard",
    title:
      "Tell me about a time you did the right thing even when it was inconvenient.",
    keywords: ["integrity", "ethics", "honesty", "courage"],
    interviewerIntent:
      "The interviewer checks your values under pressure and that you will speak up about problems.",
    shortAnswer:
      "In [situation], I noticed [issue, such as an error in my work or a shortcut that was not right]. Staying quiet would have been easier, but I [action: reported it, corrected it or refused the shortcut]. It cost me [time or comfort], but [result]. I would act the same way again because trust matters more than convenience.",
    detailedAnswer: [
      "Use a real situation involving honesty, such as correcting your own error.",
      "Describe the cost honestly, and the reason you acted.",
      "Show that you stayed professional and constructive.",
    ],
    realWorldExample:
      "A student found a mistake in their own submitted analysis and reported it before the results were used.",
    commonMistakes: [
      "Choosing a dramatic story you cannot back.",
      "Judging others harshly.",
    ],
    followUps: [
      {
        question: "What would you do if a colleague asked you to bend a rule?",
      },
    ],
    answerTips: ["A small, true story is more convincing than a big one."],
    keyPoints: [
      "Real situation",
      "Cost acknowledged",
      "Constructive action",
      "Trust matters",
    ],
    weakAnswer: "I would never do anything wrong, so I have no such story.",
    weakAnswerWhy: [
      "It provides no evidence.",
      "It sounds rehearsed.",
      "It avoids the question.",
    ],
    recruiterExpects: ["Honesty", "Courage", "Maturity"],
    answerFramework: [
      "Issue: I noticed [issue].",
      "Choice: I could have [easy path] but I [right action].",
      "Cost: It cost [time or comfort].",
      "Result: [outcome].",
    ],
    starPrompts: {
      situation: "What was the situation and the temptation?",
      task: "What was the right thing to do?",
      action: "What did you do and say?",
      result: "What happened afterwards?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "punctuality-and-discipline",
    topic: "Reliability",
    difficulty: "easy",
    title: "How do you manage your time and stay disciplined?",
    keywords: ["discipline", "time management", "routine", "planning"],
    interviewerIntent:
      "The interviewer checks that you have habits that make you dependable, especially for remote or flexible work.",
    shortAnswer:
      "I plan my day the evening before by choosing the top tasks, and I block time for focused work. I use [tool or habit] to track deadlines and I review progress at the end of each day. I treat start times and meetings as commitments. When I slip, I look at the reason and adjust my routine instead of blaming myself.",
    detailedAnswer: [
      "Describe two or three habits you actually follow.",
      "Mention how you handle distractions.",
      "Show that you adjust the system when it fails.",
    ],
    realWorldExample:
      "A student prepared a weekly timetable with study blocks and kept a short checklist each evening.",
    commonMistakes: [
      "Naming tools without a routine.",
      "Claiming perfect discipline.",
    ],
    followUps: [{ question: "How do you handle distractions?" }],
    answerTips: ["Describe a real daily routine."],
    keyPoints: ["Plan ahead", "Focus blocks", "Track deadlines", "Adjust"],
    weakAnswer: "I am naturally disciplined and do not need any system.",
    weakAnswerWhy: [
      "It gives no method.",
      "It is unconvincing.",
      "It shows low self-awareness.",
    ],
    recruiterExpects: ["Habits", "Reliability", "Self-awareness"],
    answerFramework: [
      "Plan: I plan by [method].",
      "Focus: I protect [time] for [work].",
      "Track: I use [tool] and review [when].",
      "Adjust: When I slip, I [action].",
    ],
    starPrompts: {
      situation: "Describe a busy period you managed well.",
      task: "What had to be completed?",
      action: "What routine did you follow?",
      result: "What did you achieve?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "handling-confidential-information",
    topic: "Integrity",
    difficulty: "medium",
    title: "How do you handle confidential or sensitive information at work?",
    keywords: [
      "confidentiality",
      "trust",
      "data protection",
      "professional boundaries",
    ],
    interviewerIntent:
      "The interviewer checks that you understand the duty to protect information and follow company rules.",
    shortAnswer:
      "I treat confidential information as something I only share with people who need it for their work, and only through approved channels. I do not discuss it in public places or on personal chats, and I follow the company's policies on storing data. If I am unsure whether something is confidential, I ask before sharing. Trust is built by being careful consistently.",
    detailedAnswer: [
      "Show awareness of need-to-know, approved tools and asking when unsure.",
      "Mention care about screens, public spaces and messages.",
      "Avoid giving real confidential examples from past employers.",
    ],
    realWorldExample:
      "A team member used the company's approved storage for client files instead of personal email.",
    commonMistakes: [
      "Sharing details of past employers' secrets.",
      "Saying it is not a concern.",
    ],
    followUps: [
      {
        question:
          "What would you do if you accidentally shared something sensitive?",
      },
    ],
    answerTips: ["Do not reveal confidential facts in the interview itself."],
    keyPoints: [
      "Need-to-know",
      "Approved channels",
      "Ask if unsure",
      "Report mistakes",
    ],
    weakAnswer: "I share everything with friends. Information should be free.",
    weakAnswerWhy: [
      "It shows no sense of duty.",
      "It is a serious risk.",
      "It would end the interview.",
    ],
    recruiterExpects: ["Integrity", "Care", "Awareness"],
    answerFramework: [
      "Principle: I share only what is needed.",
      "Channels: I use [approved tools].",
      "Unsure: I ask [person].",
      "Mistakes: I report [how].",
    ],
    starPrompts: {
      situation: "Recall a time you handled information that was not public.",
      task: "What was your responsibility?",
      action: "How did you protect it?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
])
