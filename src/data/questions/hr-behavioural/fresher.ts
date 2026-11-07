import { defineQuestions } from "../author"

export default defineQuestions("hr-behavioural", "fresher", [
  {
    slug: "what-is-the-star-method",
    topic: "STAR method",
    difficulty: "easy",
    title: "How do you structure an answer to a behavioural question?",
    keywords: ["STAR", "behavioural interview", "structure", "storytelling"],
    interviewerIntent:
      "Behavioural questions ask for real past examples, and a clear structure shows that you can tell one concisely.",
    shortAnswer:
      "I use the STAR method. I describe the Situation in a sentence or two, the Task I was responsible for, the Actions I personally took, and the Result with what I learned. I spend the most time on the actions, keep the whole answer to about two minutes, and finish by connecting the story to the role.",
    detailedAnswer: [
      "Situation and task set the scene briefly. Actions are the core of the answer and should say what you did, using I.",
      "Result should be honest, with a lesson even when it did not go perfectly.",
      "Prepare four or five stories that can be reused for different questions.",
    ],
    realWorldExample:
      "A candidate prepared stories about a deadline, a conflict, a failure and a leadership moment, and adapted them to each question.",
    commonMistakes: [
      "Long background with no actions.",
      "Using we throughout and hiding your part.",
    ],
    followUps: [{ question: "Give me an example using STAR." }],
    answerTips: ["Time yourself: about two minutes per story."],
    keyPoints: [
      "Situation, Task, Action, Result",
      "Most time on actions",
      "Honest result",
      "Reusable stories",
    ],
    weakAnswer:
      "I just talk about what comes to mind. A structure is not needed.",
    weakAnswerWhy: [
      "It risks rambling.",
      "It may skip the key points.",
      "It shows poor preparation.",
    ],
    recruiterExpects: ["Structure", "Clarity", "Preparation"],
    answerFramework: [
      "Situation: [one or two sentences of context].",
      "Task: My responsibility was [task].",
      "Action: I [specific steps].",
      "Result: [outcome and lesson].",
    ],
    starPrompts: {
      situation: "Pick a story you want to prepare: what was the context?",
      task: "What were you responsible for?",
      action: "What did you do, in order?",
      result: "What was the result and the lesson?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "a-time-you-showed-initiative",
    topic: "Behavioural stories",
    difficulty: "medium",
    title: "Tell me about a time you went beyond what was expected of you.",
    keywords: ["initiative", "extra mile", "ownership", "impact"],
    interviewerIntent:
      "The interviewer checks motivation and ownership beyond the minimum.",
    shortAnswer:
      "In [situation], my task was [basic task], but I noticed [gap or opportunity]. I [extra step you took], without neglecting my main work, and checked with [person] first. As a result, [outcome]. It showed me that a small extra effort at the right time can help the whole team.",
    detailedAnswer: [
      "Pick an example where the extra effort created real value.",
      "Show that you checked with others and kept your own commitments.",
      "Credit the team and describe the outcome.",
    ],
    realWorldExample:
      "A student added a short setup guide to a group project, which saved time for new teammates.",
    commonMistakes: [
      "Describing overwork as initiative.",
      "Ignoring your main responsibilities.",
    ],
    followUps: [{ question: "How did you decide what was worth doing?" }],
    answerTips: ["Pick a small but real example."],
    keyPoints: [
      "Notice a gap",
      "Check with others",
      "Do the extra step",
      "Real value",
    ],
    weakAnswer: "I never do extra work. I only do what is given.",
    weakAnswerWhy: [
      "It shows no initiative.",
      "It limits growth.",
      "It does not fit a team culture.",
    ],
    recruiterExpects: ["Initiative", "Ownership", "Judgement"],
    answerFramework: [
      "Task: I was asked to [task].",
      "Gap: I noticed [opportunity].",
      "Action: I [extra step].",
      "Result: [outcome].",
    ],
    starPrompts: {
      situation: "What was your assigned task and what else did you notice?",
      task: "Why did you choose to act?",
      action: "What did you do?",
      result: "What was the benefit?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "a-time-you-adapted-to-change",
    topic: "Behavioural stories",
    difficulty: "medium",
    title: "Tell me about a time you had to adapt to a sudden change.",
    keywords: ["adaptability", "change", "flexibility", "resilience"],
    interviewerIntent:
      "The interviewer checks flexibility and how you respond when plans or priorities change.",
    shortAnswer:
      "In [project], [what changed suddenly, such as requirements, team members or tools]. I first made sure I understood what the change meant for my tasks, then I re-planned my work and agreed new priorities with [person]. I learned [new thing needed] quickly. We [outcome], and I learned to stay flexible while keeping the main goal in sight.",
    detailedAnswer: [
      "Show a calm, structured response: understand, replan, communicate, act.",
      "Mention what you learned or changed.",
      "Be honest about difficulties.",
    ],
    realWorldExample:
      "A team switched libraries mid-project, and one member learned the new one in a few days and shared notes with others.",
    commonMistakes: [
      "Complaining about the change.",
      "Describing no concrete steps.",
    ],
    followUps: [{ question: "How did you feel about the change at first?" }],
    answerTips: ["Mention the communication step."],
    keyPoints: ["Understand the change", "Replan", "Communicate", "Learn"],
    weakAnswer: "I dislike change. I prefer things to stay the same.",
    weakAnswerWhy: [
      "It shows rigidity.",
      "It is a concern in dynamic teams.",
      "It gives no example.",
    ],
    recruiterExpects: ["Flexibility", "Planning", "Learning"],
    answerFramework: [
      "Change: [what changed].",
      "Understanding: I checked [impact].",
      "Action: I [replanned and learned].",
      "Result: [outcome].",
    ],
    starPrompts: {
      situation: "What changed and how suddenly?",
      task: "What did you need to deliver after the change?",
      action: "What did you do to adapt?",
      result: "How did it turn out?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "a-time-you-made-a-decision-with-limited-information",
    topic: "Behavioural stories",
    difficulty: "hard",
    title:
      "Tell me about a time you made an important decision with limited information.",
    keywords: ["decision making", "uncertainty", "judgement", "risk"],
    interviewerIntent:
      "The interviewer checks your judgement, how you reduce risk and whether you own the decision.",
    shortAnswer:
      "In [situation], I had to decide [decision] by [time], and I did not have all the facts. I identified what I did know, asked [person or source] for the most important missing piece, and chose the option that was easiest to reverse if I was wrong. I decided on [choice], and [outcome]. I learned to decide with a plan for checking results.",
    detailedAnswer: [
      "Show how you gathered what you could in the time available.",
      "Mention risk reduction, such as choosing reversible options and checking early.",
      "Own the outcome, and say what you learned.",
    ],
    realWorldExample:
      "A team lead chose a simpler design for a demo because it could be replaced later if requirements changed.",
    commonMistakes: [
      "Waiting indefinitely.",
      "Deciding without checking anything.",
    ],
    followUps: [
      { question: "What would you do differently with the same information?" },
    ],
    answerTips: ["Highlight the reversible choice and the follow-up check."],
    keyPoints: [
      "Use what you know",
      "Ask the key question",
      "Prefer reversible options",
      "Check results",
    ],
    weakAnswer: "I wait until someone tells me what to do. I avoid decisions.",
    weakAnswerWhy: [
      "It shows no ownership.",
      "It slows the team.",
      "It signals low confidence.",
    ],
    recruiterExpects: ["Judgement", "Ownership", "Risk awareness"],
    answerFramework: [
      "Situation: I had to decide [decision] by [time].",
      "Gathering: I checked [what] and asked [whom].",
      "Choice: I chose [option] because [reason].",
      "Follow-up: I checked [how] and [result].",
    ],
    starPrompts: {
      situation: "What decision was needed and what was missing?",
      task: "Who depended on the decision?",
      action: "How did you decide?",
      result: "What happened and what did you learn?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "a-time-you-received-difficult-feedback",
    topic: "Behavioural stories",
    difficulty: "medium",
    title: "Tell me about a time you received feedback that was hard to hear.",
    keywords: ["feedback", "growth", "humility", "behavioural"],
    interviewerIntent:
      "The interviewer checks how you react to feedback and whether you turn it into change.",
    shortAnswer:
      "[Person] told me that [feedback]. My first reaction was [honest reaction], but I took time to think about it and asked for examples. I realised [what was true in it], so I [specific change]. Later, [result or recognition]. It taught me that useful feedback is often uncomfortable.",
    detailedAnswer: [
      "Be honest about your first reaction, which makes the story human.",
      "Show what you did with the feedback and the effect afterwards.",
      "Thank the person, which shows maturity.",
    ],
    realWorldExample:
      "A student was told their presentations were too fast, practised with a timer, and received better feedback next time.",
    commonMistakes: ["Choosing trivial feedback.", "Showing no action."],
    followUps: [{ question: "How do you ask for feedback now?" }],
    answerTips: ["Use feedback that changed you."],
    keyPoints: ["Honest reaction", "Reflect", "Act", "Result"],
    weakAnswer: "I have never received hard feedback. Everyone likes my work.",
    weakAnswerWhy: [
      "It is unrealistic.",
      "It shows no openness.",
      "It gives no example.",
    ],
    recruiterExpects: ["Openness", "Growth", "Action"],
    answerFramework: [
      "Feedback: I was told [feedback].",
      "Reaction: At first I [reaction], then I [reflection].",
      "Change: I [action].",
      "Result: [outcome].",
    ],
    starPrompts: {
      situation: "Who gave you feedback and what was it?",
      task: "What did you need to improve?",
      action: "What did you do?",
      result: "What changed?",
    },
    estimatedMinutes: 3,
  },
])
