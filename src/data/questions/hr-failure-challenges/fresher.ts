import { defineQuestions } from "../author"

export default defineQuestions("hr-failure-challenges", "fresher", [
  {
    slug: "tell-me-about-a-failure",
    topic: "Failure",
    difficulty: "hard",
    title: "Tell me about a time you failed. What did you learn?",
    keywords: ["failure", "learning", "accountability", "growth"],
    interviewerIntent:
      "The interviewer checks honesty, accountability and whether you turn setbacks into improvements.",
    shortAnswer:
      "In [situation], I was responsible for [task] and it did not go as planned because [real cause, including your part]. I told [person] early, we [recovery step], and I took ownership of [fix]. Since then I [specific change in how you work], and the same kind of problem has not happened again in [later situation].",
    detailedAnswer: [
      "Pick a real failure that is not catastrophic and that you can explain calmly.",
      "Own your part. Do not blame circumstances alone.",
      "Spend the second half on what you changed and the proof that it worked.",
    ],
    realWorldExample:
      "A student underestimated a project, missed a milestone, and now breaks work into smaller weekly goals.",
    commonMistakes: [
      "Choosing a fake failure like working too hard.",
      "Blaming others.",
      "Giving no lesson.",
    ],
    followUps: [{ question: "What would you do differently?" }],
    answerTips: ["Rehearse a real story with a clear lesson."],
    keyPoints: [
      "Real failure",
      "Own your part",
      "Recovery",
      "Change in behaviour",
    ],
    weakAnswer: "I have never failed at anything important.",
    weakAnswerWhy: [
      "It is not credible.",
      "It shows no self-awareness.",
      "It gives no learning.",
    ],
    recruiterExpects: ["Honesty", "Ownership", "Learning"],
    answerFramework: [
      "Situation: I was responsible for [task].",
      "Failure: It failed because [cause including my part].",
      "Recovery: I [actions].",
      "Learning: Now I [change].",
    ],
    starPrompts: {
      situation: "Describe the project and what went wrong.",
      task: "What were you responsible for?",
      action: "What did you do to recover?",
      result: "What changed in how you work?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "biggest-challenge-you-faced",
    topic: "Challenges",
    difficulty: "medium",
    title:
      "What is the biggest challenge you have faced and how did you overcome it?",
    keywords: ["challenge", "problem solving", "persistence", "resilience"],
    interviewerIntent:
      "The interviewer looks for how you approach hard problems and what you do when the first attempt does not work.",
    shortAnswer:
      "The biggest challenge was [challenge] in [project or situation]. It was hard because [reason]. I broke it into [parts], tried [first approach], and when that did not work I [second approach or asked for help]. In the end [outcome]. It taught me [lesson] that I now use in [later work].",
    detailedAnswer: [
      "Choose a challenge that shows skill or persistence, ideally related to the role.",
      "Describe at least two attempts, which shows resilience.",
      "End with the result and what you learned.",
    ],
    realWorldExample:
      "A candidate debugged a failing deployment by narrowing the problem step by step and documenting the fix for the team.",
    commonMistakes: [
      "Choosing a trivial challenge.",
      "Skipping the steps you took.",
    ],
    followUps: [{ question: "What did you try that did not work?" }],
    answerTips: [
      "Add a detail about a failed attempt, it makes the story believable.",
    ],
    keyPoints: [
      "Real challenge",
      "Steps taken",
      "Persistence",
      "Result and lesson",
    ],
    weakAnswer: "My biggest challenge was waking up early for college.",
    weakAnswerWhy: [
      "It is trivial for a job interview.",
      "It shows no skills.",
      "It misses the chance to impress.",
    ],
    recruiterExpects: ["Problem solving", "Resilience", "Learning"],
    answerFramework: [
      "Challenge: [challenge] in [situation].",
      "Difficulty: It was hard because [reason].",
      "Actions: I [first attempt], then [second attempt].",
      "Result: [outcome] and I learned [lesson].",
    ],
    starPrompts: {
      situation: "What was the situation and why was it difficult?",
      task: "What did you need to achieve?",
      action: "What did you try, in order?",
      result: "What happened, and what did you learn?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "a-project-that-did-not-go-as-planned",
    topic: "Failure",
    difficulty: "medium",
    title: "Describe a project that did not go as planned.",
    keywords: ["project setback", "adaptation", "replanning", "communication"],
    interviewerIntent:
      "The interviewer checks how you adapt when plans change and whether you communicate and replan.",
    shortAnswer:
      "In [project], we planned to [plan], but [what changed, such as a technical issue or a requirement change]. I raised it early, we re-scoped to [new plan], and I focused on [your task]. We delivered [outcome], not exactly the original plan. I learned to build in time for the unknown and to review risks regularly.",
    detailedAnswer: [
      "Explain the cause honestly, whether it was estimation, requirements or technology.",
      "Show replanning, communication and your own contribution.",
      "State what you would do differently in planning.",
    ],
    realWorldExample:
      "A team found an integration harder than expected, cut one feature, and delivered a smaller working version on time.",
    commonMistakes: [
      "Blaming a teammate or the customer.",
      "Leaving out what you did.",
    ],
    followUps: [{ question: "How do you plan for risks now?" }],
    answerTips: ["Mention one process change you adopted afterwards."],
    keyPoints: ["Honest cause", "Replan", "Communicate early", "Lessons"],
    weakAnswer: "Everything was fine in my projects. Nothing ever went wrong.",
    weakAnswerWhy: [
      "It is unrealistic.",
      "It shows no experience of setbacks.",
      "It gives no content.",
    ],
    recruiterExpects: ["Honesty", "Adaptability", "Learning"],
    answerFramework: [
      "Plan: We planned to [plan].",
      "Change: But [what changed].",
      "Response: I [raised it, replanned, delivered part].",
      "Lesson: Next time I will [change].",
    ],
    starPrompts: {
      situation: "What was the plan and what changed?",
      task: "What was your responsibility in the new situation?",
      action: "How did you help the team adapt?",
      result: "What was delivered and what did you learn?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "learning-from-feedback-after-a-setback",
    topic: "Resilience",
    difficulty: "medium",
    title: "How do you handle criticism or negative feedback?",
    keywords: ["criticism", "feedback", "resilience", "growth mindset"],
    interviewerIntent:
      "The interviewer checks that you receive criticism calmly and use it to improve.",
    shortAnswer:
      "I listen first without defending myself, and I ask for specific examples so I understand exactly what to change. Then I think about it separately, decide what to act on, and make a small change. For example, when [feedback you received], I [change you made], and later [result]. I also thank people for honest feedback.",
    detailedAnswer: [
      "Show that you separate feelings from facts, and ask clarifying questions.",
      "Give a real example of feedback you acted on.",
      "Mention how you follow up to check that the change worked.",
    ],
    realWorldExample:
      "A junior developer received review comments about unclear names, then started using naming guidelines and asked for another review.",
    commonMistakes: [
      "Getting defensive.",
      "Saying you never get negative feedback.",
    ],
    followUps: [{ question: "What feedback was hardest to hear?" }],
    answerTips: ["Use feedback you really acted on."],
    keyPoints: ["Listen first", "Ask for specifics", "Act on it", "Follow up"],
    weakAnswer:
      "I do not like criticism. If someone criticises me, I ignore them.",
    weakAnswerWhy: [
      "It shows low openness.",
      "It blocks learning.",
      "It is a concern in any team.",
    ],
    recruiterExpects: ["Openness", "Maturity", "Action"],
    answerFramework: [
      "Listen: I listen and ask for [specific examples].",
      "Reflect: I decide what to change.",
      "Act: For example I [change].",
      "Follow up: I check [how].",
    ],
    starPrompts: {
      situation: "When did you receive critical feedback?",
      task: "What did you need to improve?",
      action: "What did you change?",
      result: "What difference did it make?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "working-on-something-you-did-not-know",
    topic: "Challenges",
    difficulty: "medium",
    title:
      "Tell me about a time you had to learn something quickly to complete a task.",
    keywords: [
      "quick learning",
      "adaptability",
      "self study",
      "resourcefulness",
    ],
    interviewerIntent:
      "The interviewer checks learning speed and resourcefulness, which matter for any technical role.",
    shortAnswer:
      "For [project or task] I needed [new skill or tool] and had [limited time]. I started with the official documentation, built a small example to test my understanding, and asked [person] to review my approach. Within [time frame you choose], I [delivered what]. The method I now use is learn the basics, build small, ask for review.",
    detailedAnswer: [
      "Describe your learning method: reliable sources, small experiments, feedback.",
      "Give a real, concrete outcome.",
      "Mention that you share what you learned with others if relevant.",
    ],
    realWorldExample:
      "A candidate learned a testing library from its documentation in a few days and added tests to a project.",
    commonMistakes: [
      "Saying you learn quickly without proof.",
      "Not mentioning how.",
    ],
    followUps: [{ question: "How do you decide what to learn first?" }],
    answerTips: ["Mention at least one source and one practice step."],
    keyPoints: ["Reliable sources", "Build small", "Ask for review", "Deliver"],
    weakAnswer: "I can learn anything instantly, it is not a problem.",
    weakAnswerWhy: [
      "It has no evidence.",
      "It sounds exaggerated.",
      "It gives no method.",
    ],
    recruiterExpects: ["Learning ability", "Method", "Results"],
    answerFramework: [
      "Need: I needed [skill] for [task].",
      "Method: I used [sources] and built [small example].",
      "Feedback: I asked [person] to review.",
      "Result: I delivered [outcome].",
    ],
    starPrompts: {
      situation: "What task required a skill you did not have?",
      task: "How much time did you have?",
      action: "How did you learn and practise?",
      result: "What did you deliver?",
    },
    estimatedMinutes: 3,
  },
])
