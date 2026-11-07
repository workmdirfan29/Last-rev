import { defineQuestions } from "../author"

export default defineQuestions("hr-communication", "fresher", [
  {
    slug: "how-would-you-rate-your-communication",
    topic: "Communication skills",
    difficulty: "medium",
    title: "How would you rate your communication skills?",
    keywords: [
      "communication skills",
      "self assessment",
      "listening",
      "clarity",
    ],
    interviewerIntent:
      "The interviewer checks self-awareness and evidence for how you communicate in writing and speaking.",
    shortAnswer:
      "I would say I am [honest self-rating, such as good and improving]. My strengths are [for example, clear written updates or listening before answering], and I have shown that when [example]. I am still working on [honest area, such as speaking in large groups] by [what you do]. I ask for feedback to keep improving.",
    detailedAnswer: [
      "Rate yourself honestly and back the rating with a real example.",
      "Cover both speaking and writing, and listening.",
      "Name one area you are improving and how.",
    ],
    realWorldExample:
      "A candidate who writes clear project updates mentions that teammates use them for planning, and says they are practising presentations.",
    commonMistakes: [
      "Giving yourself a perfect score.",
      "Rating yourself low with no plan.",
    ],
    followUps: [
      { question: "Give an example of explaining something complex simply." },
    ],
    answerTips: ["Mention listening, which many people forget."],
    keyPoints: ["Honest rating", "Evidence", "Listening", "Improvement plan"],
    weakAnswer: "My communication is perfect. Ten out of ten.",
    weakAnswerWhy: [
      "It sounds arrogant.",
      "It has no evidence.",
      "It shows low self-awareness.",
    ],
    recruiterExpects: ["Honesty", "Evidence", "Growth"],
    answerFramework: [
      "Rating: I would rate myself [rating] because [reason].",
      "Evidence: For example [example].",
      "Improvement: I am working on [area] by [action].",
      "Feedback: I ask [person] for feedback.",
    ],
    starPrompts: {
      situation: "Recall a time your communication mattered for a result.",
      task: "What did you need to explain or understand?",
      action: "How did you communicate?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "explain-a-complex-topic-simply",
    topic: "Clarity",
    difficulty: "medium",
    title:
      "Tell me about a time you explained something complex to someone who was not technical.",
    keywords: ["explaining simply", "non technical", "analogy", "audience"],
    interviewerIntent:
      "The interviewer checks that you can adapt language to the audience, which matters when working with non-technical people.",
    shortAnswer:
      "I had to explain [topic] to [audience, such as a client or a classmate from another field]. I started with what they cared about, used an everyday analogy of [analogy], avoided jargon, and checked their understanding by asking them to summarise. They [outcome, such as made a decision]. I learned to start with the benefit, not the mechanism.",
    detailedAnswer: [
      "Know your audience and what they need to decide or do.",
      "Use analogies and examples, and avoid jargon.",
      "Check understanding by asking questions, not just by asking if it is clear.",
    ],
    realWorldExample:
      "A developer explained caching to a manager by comparing it to keeping frequently used files on your desk instead of in a cabinet.",
    commonMistakes: [
      "Using technical terms without explanation.",
      "Talking too long.",
    ],
    followUps: [{ question: "How do you know the person understood?" }],
    answerTips: ["Practise one explanation with an analogy."],
    keyPoints: [
      "Know the audience",
      "Analogies",
      "No jargon",
      "Check understanding",
    ],
    weakAnswer:
      "I explained it in detail with all the technical terms. They did not understand, but that is their problem.",
    weakAnswerWhy: [
      "It blames the listener.",
      "It ignores the audience.",
      "It misses the communication skill.",
    ],
    recruiterExpects: ["Adaptability", "Clarity", "Empathy"],
    answerFramework: [
      "Audience: I explained [topic] to [audience].",
      "Approach: I used [analogy] and avoided [jargon].",
      "Check: I asked them to [summarise].",
      "Result: They [outcome].",
    ],
    starPrompts: {
      situation: "Who needed to understand something technical?",
      task: "What did they need to do with the information?",
      action: "How did you explain it?",
      result: "What happened as a result?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "a-misunderstanding-at-work",
    topic: "Misunderstandings",
    difficulty: "medium",
    title:
      "Tell me about a time a miscommunication caused a problem. How did you fix it?",
    keywords: ["miscommunication", "clarification", "assumptions", "follow up"],
    interviewerIntent:
      "The interviewer checks that you can identify communication failures and fix the process.",
    shortAnswer:
      "In [situation], I and [person] had different understandings of [task or requirement]. I noticed when [sign of the problem], so I talked to them, confirmed what each of us expected, and fixed [what needed redoing]. Afterwards I started [habit, such as writing down agreements and confirming them]. It has prevented similar problems since.",
    detailedAnswer: [
      "Describe the cause plainly, including your part in it.",
      "Show you fixed the immediate issue and the process.",
      "Mention simple habits: confirm in writing, repeat back, ask early.",
    ],
    realWorldExample:
      "Two teammates built different versions of the same feature because the task description was vague, so they began writing short acceptance notes.",
    commonMistakes: ["Blaming the other person.", "Skipping the lesson."],
    followUps: [{ question: "How do you confirm expectations now?" }],
    answerTips: ["Mention a concrete habit."],
    keyPoints: [
      "Own your part",
      "Fix the issue",
      "Fix the process",
      "Confirm in writing",
    ],
    weakAnswer: "It was entirely their fault because they did not listen.",
    weakAnswerWhy: [
      "It blames others.",
      "It shows no self-reflection.",
      "It offers no learning.",
    ],
    recruiterExpects: ["Ownership", "Problem solving", "Learning"],
    answerFramework: [
      "Problem: We understood [requirement] differently.",
      "Discovery: I noticed when [sign].",
      "Fix: I [action].",
      "Habit: Now I [habit].",
    ],
    starPrompts: {
      situation: "What was the misunderstanding about?",
      task: "What needed to be corrected?",
      action: "How did you resolve it?",
      result: "What habit did you adopt?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "communicating-bad-news",
    topic: "Difficult conversations",
    difficulty: "hard",
    title:
      "How would you communicate bad news, such as a delayed project, to a manager or client?",
    keywords: ["bad news", "transparency", "early warning", "solution focus"],
    interviewerIntent:
      "The interviewer checks honesty, timing and whether you bring solutions with the problem.",
    shortAnswer:
      "I would share it as early as I can, in a direct and calm way, with the facts: what is delayed, why, and the impact. I would come with options, such as [reduced scope or new date], and a recommendation. I would then keep them updated until it is resolved. Early honesty protects trust more than late surprises.",
    detailedAnswer: [
      "Tell the person yourself and early. Do not wait for them to discover it.",
      "State facts without excuses, and present at least one way forward.",
      "Follow up regularly after the first conversation.",
    ],
    realWorldExample:
      "A developer told the lead a feature would slip by a few days, proposed shipping a smaller version first, and updated daily.",
    commonMistakes: [
      "Hiding the problem and hoping.",
      "Giving the news with no options.",
    ],
    followUps: [
      { question: "Tell me about a time you had to deliver bad news." },
    ],
    answerTips: ["Use the pattern: fact, impact, options, recommendation."],
    keyPoints: ["Early", "Facts and impact", "Options", "Keep updating"],
    weakAnswer: "I would wait until the last day and hope it works out.",
    weakAnswerWhy: [
      "It breaks trust.",
      "It removes time to react.",
      "It shows poor ownership.",
    ],
    recruiterExpects: ["Honesty", "Ownership", "Solution focus"],
    answerFramework: [
      "Early: I tell [person] as soon as I know.",
      "Facts: [what, why, impact].",
      "Options: I suggest [options] and recommend [one].",
      "Update: I will update [how often].",
    ],
    starPrompts: {
      situation:
        "When did you have to share unwelcome news at work or college?",
      task: "What did the other person need to know?",
      action: "How did you present it?",
      result: "How did they react and what was decided?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "listening-skills",
    topic: "Listening",
    difficulty: "easy",
    title:
      "How do you make sure you understand what someone is asking you to do?",
    keywords: [
      "active listening",
      "clarifying questions",
      "paraphrasing",
      "requirements",
    ],
    interviewerIntent:
      "The interviewer checks that you verify understanding before starting work, which prevents rework.",
    shortAnswer:
      "I listen fully before answering, then I repeat the request in my own words and ask clarifying questions about the goal, the deadline and what a good result looks like. If it is a larger task, I write a short summary and send it to confirm. This takes a minute and saves a lot of rework.",
    detailedAnswer: [
      "Paraphrasing shows you listened and exposes gaps.",
      "Ask about the purpose, not only the steps.",
      "Confirm in writing for anything important.",
    ],
    realWorldExample:
      "A team member confirmed a task by email summary and discovered that the report format was different from what they had assumed.",
    commonMistakes: [
      "Starting without asking.",
      "Nodding without understanding.",
    ],
    followUps: [{ question: "When did asking a question save you time?" }],
    answerTips: ["Say that you confirm in writing."],
    keyPoints: [
      "Listen fully",
      "Paraphrase",
      "Clarify the goal",
      "Confirm in writing",
    ],
    weakAnswer:
      "I just start the work. If it is wrong, they can tell me later.",
    weakAnswerWhy: [
      "It causes rework.",
      "It shows low care.",
      "It risks missed expectations.",
    ],
    recruiterExpects: ["Attention", "Clarity", "Efficiency"],
    answerFramework: [
      "Listen: I let them finish.",
      "Paraphrase: I repeat [request] in my words.",
      "Clarify: I ask about [goal, deadline, result].",
      "Confirm: I send a short note.",
    ],
    starPrompts: {
      situation: "Recall a task whose requirements were unclear.",
      task: "What did you need to know?",
      action: "What did you ask or confirm?",
      result: "How did it help?",
    },
    estimatedMinutes: 3,
  },
])
