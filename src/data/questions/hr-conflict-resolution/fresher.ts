import { defineQuestions } from "../author"

export default defineQuestions("hr-conflict-resolution", "fresher", [
  {
    slug: "handling-a-disagreement-with-a-colleague",
    topic: "Disagreements",
    difficulty: "medium",
    title:
      "Tell me about a time you disagreed with a colleague. How did you resolve it?",
    keywords: [
      "disagreement",
      "conflict resolution",
      "listening",
      "compromise",
    ],
    interviewerIntent:
      "The interviewer checks that you handle disagreement respectfully, listen, and look for a solution that serves the goal.",
    shortAnswer:
      "In [project], a colleague and I disagreed about [topic]. I asked them to explain their reasoning and I explained mine, and we compared both against [goal or data]. We agreed to [solution or trial], and [outcome]. I learned that focusing on the goal instead of who is right makes disagreements productive.",
    detailedAnswer: [
      "Pick a real, work-related disagreement, not a personal one.",
      "Show active listening, a shared goal and a concrete decision method such as a small test or asking a senior person.",
      "Finish with the result and the relationship afterwards.",
    ],
    realWorldExample:
      "Two developers disagreed about a library choice and settled it by building a small prototype with each and comparing results.",
    commonMistakes: [
      "Saying you never disagree.",
      "Describing a fight where you won.",
    ],
    followUps: [{ question: "What if you were still not convinced?" }],
    answerTips: [
      "Show you changed your mind or compromised if the facts supported it.",
    ],
    keyPoints: [
      "Listen first",
      "Shared goal",
      "Decide with evidence",
      "Keep the relationship",
    ],
    weakAnswer:
      "I never disagree with anyone. If there is a problem, I just keep quiet.",
    weakAnswerWhy: [
      "It is unrealistic.",
      "Staying silent hides problems.",
      "It gives no example.",
    ],
    recruiterExpects: ["Respect", "Problem solving", "Maturity"],
    answerFramework: [
      "Situation: [Colleague] and I disagreed about [topic].",
      "Listening: I asked [question] to understand their view.",
      "Decision: We used [method] to decide.",
      "Result: [outcome] and our working relationship [state].",
    ],
    starPrompts: {
      situation: "What was the disagreement about, and who was involved?",
      task: "What decision did the team need to make?",
      action: "How did you discuss it and decide?",
      result: "What was decided, and what did you learn?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "disagreeing-with-your-manager",
    topic: "Disagreements",
    difficulty: "hard",
    title: "What would you do if you disagreed with your manager's decision?",
    keywords: ["disagree with manager", "respect", "feedback", "escalation"],
    interviewerIntent:
      "The interviewer checks that you can speak up respectfully and still commit to the team's decision.",
    shortAnswer:
      "I would first make sure I understand the reason behind the decision. Then I would share my concern privately with facts, for example [your data or example], and suggest an alternative. If the manager still chooses the original plan, I would support it fully, because the decision is theirs to make, and I would watch the results so we can learn from them.",
    detailedAnswer: [
      "Ask questions first. You may be missing context.",
      "Raise concerns in private, with evidence and an alternative, not as criticism.",
      "Commit to the final decision. Disagree and commit shows maturity.",
    ],
    realWorldExample:
      "An engineer questioned a release date, provided a list of open risks, and then supported the manager's choice to ship with monitoring.",
    commonMistakes: [
      "Complaining to colleagues.",
      "Refusing to follow the decision.",
    ],
    followUps: [
      { question: "Have you ever been proven right or wrong afterwards?" },
    ],
    answerTips: ["Use the pattern: understand, share evidence, commit."],
    keyPoints: [
      "Understand the reason",
      "Private, evidence-based",
      "Offer an alternative",
      "Commit to the decision",
    ],
    weakAnswer: "I would tell everyone my manager is wrong and do it my way.",
    weakAnswerWhy: [
      "It is disrespectful.",
      "It breaks team trust.",
      "It ignores the manager's authority.",
    ],
    recruiterExpects: ["Respect", "Courage", "Commitment"],
    answerFramework: [
      "Understand: I ask [question] about the reason.",
      "Share: I explain [concern] with [evidence].",
      "Alternative: I suggest [option].",
      "Commit: If the decision stands, I support it and [follow up].",
    ],
    starPrompts: {
      situation:
        "Recall a time you saw things differently from a lead or teacher.",
      task: "What was at stake?",
      action:
        "How did you raise it and how did you respond to the final decision?",
      result: "What happened?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "resolving-conflict-between-two-people",
    topic: "Mediation",
    difficulty: "hard",
    title: "Have you ever helped resolve a conflict between two other people?",
    keywords: ["mediation", "neutrality", "listening", "team harmony"],
    interviewerIntent:
      "The interviewer checks emotional maturity, fairness and leadership without authority.",
    shortAnswer:
      "In [situation], two teammates disagreed about [topic] and it was affecting the team. I spoke to each separately to understand their view, then I suggested a short conversation focused on the goal. I stayed neutral, and we agreed on [solution]. The team went back to [normal work], and I learned to listen to both sides before suggesting anything.",
    detailedAnswer: [
      "Show neutrality: listen to both sides and avoid taking sides.",
      "Shift the discussion from people to the shared goal.",
      "If it is beyond you, say you involved a lead, which is also mature.",
    ],
    realWorldExample:
      "A student leader met two group members separately and then agreed with them on clear task ownership.",
    commonMistakes: ["Taking sides.", "Gossiping about the conflict."],
    followUps: [{ question: "When would you involve a manager?" }],
    answerTips: [
      "Mention that you involved a manager if the issue was serious.",
    ],
    keyPoints: [
      "Listen to both",
      "Stay neutral",
      "Focus on the goal",
      "Involve a lead if needed",
    ],
    weakAnswer:
      "That is not my problem. I stay away from other people's fights.",
    weakAnswerWhy: [
      "It shows no initiative.",
      "It ignores team impact.",
      "It misses a leadership signal.",
    ],
    recruiterExpects: ["Neutrality", "Initiative", "Empathy"],
    answerFramework: [
      "Situation: Two people disagreed about [topic].",
      "Listening: I spoke to each about [their view].",
      "Goal: I brought the focus back to [shared goal].",
      "Result: They agreed on [solution].",
    ],
    starPrompts: {
      situation: "Describe the conflict and its effect on the team.",
      task: "Why did you decide to help?",
      action: "What did you do and say?",
      result: "What changed?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "conflict-with-a-client-or-customer",
    topic: "External conflict",
    difficulty: "hard",
    title: "How would you handle an unhappy client or customer?",
    keywords: ["customer", "client", "empathy", "service recovery"],
    interviewerIntent:
      "The interviewer checks empathy, calm communication and a problem-solving approach when someone external is upset.",
    shortAnswer:
      "I would let them explain without interrupting, and acknowledge the problem so they feel heard. Then I would clarify the facts, explain what I can do and by when, and follow through. If I cannot solve it myself, I would involve the right person and keep the customer updated. Afterwards I would note the cause so the issue does not repeat.",
    detailedAnswer: [
      "Start with listening and empathy, which reduces tension.",
      "Be honest about what you can and cannot do. Do not promise what you cannot deliver.",
      "Follow up after resolving, which builds trust.",
    ],
    realWorldExample:
      "A support engineer apologised for a delayed fix, shared a clear timeline and messaged again when it was done.",
    commonMistakes: [
      "Arguing with the customer.",
      "Making promises you cannot keep.",
    ],
    followUps: [
      { question: "Tell me about a time you dealt with an upset person." },
    ],
    answerTips: ["Use calm, simple language."],
    keyPoints: ["Listen", "Acknowledge", "Clear plan", "Follow up"],
    weakAnswer: "I would tell them they are wrong and explain our policy.",
    weakAnswerWhy: [
      "It is confrontational.",
      "It ignores their feelings.",
      "It does not solve the problem.",
    ],
    recruiterExpects: ["Empathy", "Calm", "Ownership"],
    answerFramework: [
      "Listen: I let them explain and acknowledge [problem].",
      "Clarify: I confirm [facts].",
      "Plan: I explain [what I will do and when].",
      "Follow up: I check back [how].",
    ],
    starPrompts: {
      situation: "Recall someone upset with your work or service.",
      task: "What did they need?",
      action: "How did you respond?",
      result: "How did they react afterwards?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "when-you-were-wrong-in-a-conflict",
    topic: "Accountability",
    difficulty: "medium",
    title:
      "Tell me about a time you realised you were wrong during a disagreement.",
    keywords: ["humility", "accountability", "learning", "open mind"],
    interviewerIntent:
      "The interviewer checks humility and willingness to change your mind when evidence says so.",
    shortAnswer:
      "In [situation], I believed [your position]. When [colleague or evidence] showed [fact], I realised I had missed [what]. I said so directly and thanked them, and we changed the plan to [new approach]. I learned to check my assumptions before arguing for them.",
    detailedAnswer: [
      "Choose a story where you changed your mind because of evidence, not pressure.",
      "Show that you admitted it clearly and moved on constructively.",
      "Mention how this changed your habits.",
    ],
    realWorldExample:
      "A developer insisted on a solution until a teammate's test showed it failed under load, and then adopted the alternative.",
    commonMistakes: [
      "Saying you are never wrong.",
      "Telling a story where you were only slightly wrong.",
    ],
    followUps: [{ question: "How do you check your assumptions now?" }],
    answerTips: ["Say 'I was wrong' plainly, it builds trust."],
    keyPoints: [
      "Admit it clearly",
      "Change based on evidence",
      "Thank the other person",
      "Learn the habit",
    ],
    weakAnswer:
      "I am always right. If someone disagrees, they usually come around.",
    weakAnswerWhy: [
      "It signals arrogance.",
      "It shows no learning.",
      "It is unrealistic.",
    ],
    recruiterExpects: ["Humility", "Openness", "Learning"],
    answerFramework: [
      "Belief: I thought [position].",
      "Evidence: [Person or data] showed [fact].",
      "Admission: I said [plain acknowledgement].",
      "Change: We [new approach] and I now [habit].",
    ],
    starPrompts: {
      situation: "What was the disagreement and what did you believe?",
      task: "What decision was pending?",
      action: "How did you react when you saw the evidence?",
      result: "What did you change?",
    },
    estimatedMinutes: 3,
  },
])
