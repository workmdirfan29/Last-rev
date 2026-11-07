import { defineQuestions } from "../author"

export default defineQuestions("hr-handling-pressure", "fresher", [
  {
    slug: "how-do-you-handle-pressure",
    topic: "Stress management",
    difficulty: "medium",
    title: "How do you handle pressure at work or in your studies?",
    keywords: ["pressure", "stress", "prioritisation", "calm"],
    interviewerIntent:
      "The interviewer wants a practical method and a real example, not a claim that pressure never affects you.",
    shortAnswer:
      "When pressure rises, I first stop and list what has to be done, then I order the tasks by importance and deadline. I break the biggest item into small steps and start with the one that unblocks others. I tell my team early if something is at risk. For example, when [situation], I [action], and [result].",
    detailedAnswer: [
      "Describe a repeatable method: list, prioritise, break down, communicate.",
      "Include a short real example so the method sounds real.",
      "Admit that pressure is normal, and show how you recover, such as short breaks or exercise.",
    ],
    realWorldExample:
      "A student facing two deadlines splits each into daily tasks and tells the supervisor which one might need an extension.",
    commonMistakes: [
      "Claiming you never feel stress.",
      "Describing panic or last-minute work as a strength.",
    ],
    followUps: [
      {
        question: "Tell me about a time you were close to missing a deadline.",
      },
    ],
    answerTips: ["Use a calm, concrete example."],
    keyPoints: [
      "List and prioritise",
      "Break into steps",
      "Communicate early",
      "Recover well",
    ],
    weakAnswer:
      "I work best under pressure. I leave everything to the last minute and then it gets done.",
    weakAnswerWhy: [
      "It suggests poor planning.",
      "It carries a risk of missed deadlines.",
      "It gives no method.",
    ],
    recruiterExpects: ["A method", "Calm", "Honesty"],
    answerFramework: [
      "Method: I list tasks and order them by [criteria].",
      "Breakdown: I split [big task] into [steps].",
      "Communication: I tell [person] about [risk].",
      "Example: When [situation], I [action] and [result].",
    ],
    starPrompts: {
      situation: "Describe a time you had several urgent tasks at once.",
      task: "What did you need to deliver and by when?",
      action: "How did you plan and what did you do first?",
      result: "What happened, and what did you learn?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "tight-deadline-example",
    topic: "Deadlines",
    difficulty: "medium",
    title: "Tell me about a time you worked under a tight deadline.",
    keywords: ["tight deadline", "time management", "STAR", "delivery"],
    interviewerIntent:
      "A behavioural question. The interviewer looks for planning, communication and an honest account of the result.",
    shortAnswer:
      "In [situation], we had [limited time] to deliver [task]. My responsibility was [your part]. I listed what was essential, agreed on a smaller scope with [person], and focused on [priority]. I updated the team [how often]. We delivered [what], and I learned [lesson about planning or scope].",
    detailedAnswer: [
      "Use the STAR structure and spend the most time on your actions.",
      "Mention scope trade-offs, because meeting a deadline often means choosing what to cut.",
      "Be honest about the result, including what you would do differently.",
    ],
    realWorldExample:
      "A team reduced a feature to its core flow to deliver a demo on the agreed date, then added the rest afterwards.",
    commonMistakes: [
      "Telling a story where you worked all night without any planning.",
      "Taking all the credit for a team result.",
    ],
    followUps: [
      { question: "What would you do differently?" },
      { question: "Did you tell anyone the deadline was at risk?" },
    ],
    answerTips: ["Choose a true story with a clear result."],
    keyPoints: ["STAR", "Scope trade-offs", "Communication", "Honest result"],
    weakAnswer:
      "We had a deadline, I worked very hard and somehow we finished. It was fine.",
    weakAnswerWhy: [
      "It has no details.",
      "It shows no actions.",
      "It has no learning.",
    ],
    recruiterExpects: ["Planning", "Teamwork", "Accountability"],
    answerFramework: [
      "Situation: We had [time] to deliver [task].",
      "Task: I was responsible for [part].",
      "Action: I [prioritised, agreed scope, communicated].",
      "Result: We [outcome] and I learned [lesson].",
    ],
    starPrompts: {
      situation: "Describe the project and the deadline.",
      task: "What was your own responsibility?",
      action: "What did you do step by step?",
      result: "What was the outcome and the lesson?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "multiple-priorities",
    topic: "Prioritisation",
    difficulty: "medium",
    title:
      "How do you prioritise when you have several tasks and not enough time?",
    keywords: ["prioritisation", "urgent important", "planning", "trade-offs"],
    interviewerIntent:
      "The interviewer checks your decision method and whether you involve others when priorities conflict.",
    shortAnswer:
      "I separate what is urgent from what is important, and I check each task's deadline and who depends on it. I pick the task that blocks others first, then the one with the highest impact. If priorities conflict, I ask my lead which matters more instead of guessing. I then review the list each day because things change.",
    detailedAnswer: [
      "Mention a simple framework: urgency, importance, dependencies.",
      "Say that you clarify with the person who sets priorities when needed.",
      "Show that you revisit priorities regularly.",
    ],
    realWorldExample:
      "An engineer with a bug report and a feature deadline asks the lead which one blocks the release before choosing.",
    commonMistakes: [
      "Saying you do everything at once.",
      "Deciding alone when priorities clash.",
    ],
    followUps: [
      { question: "What if two managers give you conflicting priorities?" },
    ],
    answerTips: ["Mention a tool or habit you actually use."],
    keyPoints: [
      "Urgent versus important",
      "Dependencies",
      "Ask when unsure",
      "Review daily",
    ],
    weakAnswer: "I do whichever task I like first and the rest later.",
    weakAnswerWhy: [
      "It is not a method.",
      "It ignores deadlines.",
      "It risks missed commitments.",
    ],
    recruiterExpects: ["A framework", "Communication", "Reliability"],
    answerFramework: [
      "Sort: I sort by [urgency and importance].",
      "Dependencies: I check what [blocks others].",
      "Clarify: I ask [person] when priorities conflict.",
      "Review: I re-check [how often].",
    ],
    starPrompts: {
      situation: "Recall a time when two tasks competed for your attention.",
      task: "What had to be done and by when?",
      action: "How did you choose and who did you talk to?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "when-you-make-a-mistake-under-pressure",
    topic: "Accountability",
    difficulty: "medium",
    title: "What do you do when you make a mistake under pressure?",
    keywords: ["mistake", "accountability", "recovery", "communication"],
    interviewerIntent:
      "The interviewer checks honesty, speed of recovery and whether you learn from errors.",
    shortAnswer:
      "I tell the people affected as soon as I notice, so nobody is surprised later. Then I fix the problem or limit the damage, and I check that the fix works. Afterwards I look for the cause and add a safeguard, such as [a check, test or habit], so it does not repeat. For example, when [situation], I [action].",
    detailedAnswer: [
      "Own the mistake early and stay factual. Avoid hiding or blaming.",
      "Prioritise the fix first, then the root cause.",
      "Add a safeguard and share what you learned with the team.",
    ],
    realWorldExample:
      "A developer who pushed a faulty change told the team immediately, rolled back, and added a test to prevent it.",
    commonMistakes: ["Hiding the mistake.", "Blaming tools or other people."],
    followUps: [
      { question: "Tell me about a mistake you made and how you handled it." },
    ],
    answerTips: ["Pick a real mistake with a clear fix and lesson."],
    keyPoints: [
      "Own it early",
      "Fix first",
      "Find the cause",
      "Add a safeguard",
    ],
    weakAnswer:
      "I rarely make mistakes, and if I do I quietly fix it so nobody notices.",
    weakAnswerWhy: [
      "It is unbelievable.",
      "Hiding issues is risky.",
      "It shows no learning.",
    ],
    recruiterExpects: ["Honesty", "Responsibility", "Learning"],
    answerFramework: [
      "Tell: I tell [people] as soon as I notice.",
      "Fix: I [fix or limit damage].",
      "Cause: I find out [cause].",
      "Prevent: I add [safeguard].",
    ],
    starPrompts: {
      situation: "Describe a mistake you made while busy or stressed.",
      task: "What needed to be fixed?",
      action: "What did you do first, and who did you tell?",
      result: "What changed afterwards?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "staying-calm-in-a-crisis",
    topic: "Stress management",
    difficulty: "hard",
    title:
      "Describe a situation when things went wrong at the last minute. How did you stay calm?",
    keywords: ["crisis", "last minute", "calm", "problem solving"],
    interviewerIntent:
      "The interviewer looks for composure, clear thinking and teamwork when plans fail.",
    shortAnswer:
      "Shortly before [event or deadline], [what went wrong]. I took a moment to understand what was actually affected, then I focused on the smallest fix that would work and asked [person] for help with [part]. I kept the team updated in short messages. We [outcome], and afterwards we [follow-up to prevent it].",
    detailedAnswer: [
      "Describe the problem factually and say how you slowed down to think.",
      "Show specific actions: assess, choose a fix, involve others, communicate.",
      "End with the result and what you changed afterwards.",
    ],
    realWorldExample:
      "Before a demo, the database failed to connect, so the team switched to saved sample data and explained it to the audience.",
    commonMistakes: [
      "Describing panic or blaming others.",
      "Leaving out your own role.",
    ],
    followUps: [{ question: "What would you do differently next time?" }],
    answerTips: [
      "Mention one calming habit, such as writing down what you know.",
    ],
    keyPoints: [
      "Pause and assess",
      "Smallest working fix",
      "Ask for help",
      "Follow up afterwards",
    ],
    weakAnswer: "I panicked but luckily someone else solved it.",
    weakAnswerWhy: [
      "It shows no action from you.",
      "It suggests poor composure.",
      "It has no learning.",
    ],
    recruiterExpects: ["Composure", "Action", "Teamwork"],
    answerFramework: [
      "Situation: Just before [event], [problem].",
      "Task: I needed to [goal].",
      "Action: I [assess, choose fix, ask for help, communicate].",
      "Result: [outcome], and later I [prevention].",
    ],
    starPrompts: {
      situation: "What went wrong, and how close was the deadline?",
      task: "What outcome did you need to protect?",
      action: "What did you do in the first minutes?",
      result: "How did it end, and what did you change?",
    },
    estimatedMinutes: 4,
  },
])
