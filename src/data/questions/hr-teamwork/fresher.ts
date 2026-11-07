import { defineQuestions } from "../author"

export default defineQuestions("hr-teamwork", "fresher", [
  {
    slug: "are-you-a-team-player",
    topic: "Collaboration",
    difficulty: "easy",
    title: "Are you a team player? Give an example.",
    keywords: ["teamwork", "collaboration", "contribution", "example"],
    interviewerIntent:
      "The interviewer wants evidence of how you actually work with others, not the phrase team player.",
    shortAnswer:
      "Yes, I enjoy working with others. In [project or course], our team had to [goal]. I took responsibility for [your part], and I also helped [teammate] with [specific help]. We agreed on [how the team communicated], and together we [result]. I like that different views usually lead to better solutions.",
    detailedAnswer: [
      "Pick a real team situation and describe your part and how you supported others.",
      "Mention communication habits such as short updates or shared notes.",
      "Credit the team as well as yourself.",
    ],
    realWorldExample:
      "A student group split a project into modules, reviewed each other's code and helped a teammate stuck on a bug.",
    commonMistakes: [
      "Saying yes without an example.",
      "Describing only your own tasks.",
    ],
    followUps: [{ question: "What role do you usually take in a team?" }],
    answerTips: ["Use a team result and show your contribution to it."],
    keyPoints: [
      "Real example",
      "Your part",
      "Supporting others",
      "Shared result",
    ],
    weakAnswer: "Yes, I am a team player. I always work well with everyone.",
    weakAnswerWhy: [
      "It has no evidence.",
      "It is a generic claim.",
      "It tells the interviewer nothing.",
    ],
    recruiterExpects: ["Evidence", "Collaboration", "Humility"],
    answerFramework: [
      "Context: In [project] our team [goal].",
      "My part: I handled [responsibility].",
      "Support: I also [helped someone].",
      "Result: Together we [outcome].",
    ],
    starPrompts: {
      situation: "Describe a team project you were part of.",
      task: "What was your responsibility?",
      action: "What did you do for the team?",
      result: "What did the team achieve?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "your-role-in-a-team",
    topic: "Collaboration",
    difficulty: "medium",
    title: "What role do you usually play in a team?",
    keywords: ["team role", "self awareness", "flexibility", "contribution"],
    interviewerIntent:
      "The interviewer looks for self-awareness and flexibility in the roles you take.",
    shortAnswer:
      "It depends on what the team needs. I often take the role of [for example, the person who plans, builds or checks details], because I am good at [strength]. When the team needs something different, I adapt: in [situation], I [took a different role]. I try to notice gaps and fill them.",
    detailedAnswer: [
      "Name a role you naturally take and show you can adapt to others.",
      "Give one example for each, briefly.",
      "Avoid saying you always lead or always follow.",
    ],
    realWorldExample:
      "A candidate who usually organises tasks took over testing when the team lacked a tester.",
    commonMistakes: [
      "Saying you are always the leader.",
      "Saying you just do what you are told.",
    ],
    followUps: [
      { question: "Have you ever disliked the role you were given?" },
    ],
    answerTips: ["Show flexibility with a real example."],
    keyPoints: ["Natural role", "Adaptable", "Fill gaps", "Examples"],
    weakAnswer: "I am always the leader. Teams cannot work without me.",
    weakAnswerWhy: [
      "It sounds arrogant.",
      "It ignores others.",
      "It shows low flexibility.",
    ],
    recruiterExpects: ["Self-awareness", "Flexibility", "Humility"],
    answerFramework: [
      "Natural role: I often [role] because [strength].",
      "Adapting: When needed, I [other role].",
      "Example: In [situation], I [action].",
      "Aim: I fill gaps so the team succeeds.",
    ],
    starPrompts: {
      situation: "Recall a team where roles were unclear.",
      task: "What did the team need?",
      action: "What role did you take?",
      result: "How did it help?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "working-with-a-difficult-teammate",
    topic: "Interpersonal skills",
    difficulty: "hard",
    title: "Tell me about a time you worked with a difficult teammate.",
    keywords: ["difficult teammate", "empathy", "communication", "resolution"],
    interviewerIntent:
      "The interviewer checks empathy, direct communication and professionalism when working with someone challenging.",
    shortAnswer:
      "In [project], a teammate [neutral description of the behaviour, such as missing deadlines or disagreeing often]. I spoke to them privately and asked about [their perspective], and I learned [reason]. We agreed on [change, such as clearer tasks or check-ins]. After that, [result]. I learned that asking before judging helps.",
    detailedAnswer: [
      "Describe the behaviour, not the person's character. Stay neutral and respectful.",
      "Show that you tried to understand their view and agreed on a practical change.",
      "Mention escalation only after you tried to resolve it directly, and say what you learned.",
    ],
    realWorldExample:
      "A teammate who skipped meetings turned out to have a time-zone conflict, and the team moved the meeting.",
    commonMistakes: [
      "Complaining about the person.",
      "Skipping your own part in the solution.",
    ],
    followUps: [
      { question: "What would you do if the conversation did not help?" },
    ],
    answerTips: ["Keep the tone fair, even if the situation was frustrating."],
    keyPoints: [
      "Describe behaviour, not character",
      "Talk directly",
      "Understand their view",
      "Agree on change",
    ],
    weakAnswer:
      "My teammate was lazy and useless, so I did all his work and complained to the manager.",
    weakAnswerWhy: [
      "It is blaming.",
      "It skipped direct communication.",
      "It shows poor collaboration.",
    ],
    recruiterExpects: ["Empathy", "Directness", "Professionalism"],
    answerFramework: [
      "Situation: A teammate [behaviour] in [project].",
      "Conversation: I asked [question] and learned [reason].",
      "Agreement: We agreed [practical change].",
      "Result: [outcome], and I learned [lesson].",
    ],
    starPrompts: {
      situation: "Describe the team and the challenging behaviour neutrally.",
      task: "What outcome did the team need?",
      action: "How did you talk to the person and what did you propose?",
      result: "What changed?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "helping-a-struggling-teammate",
    topic: "Support",
    difficulty: "medium",
    title: "Tell me about a time you helped a teammate who was struggling.",
    keywords: ["helping others", "mentoring", "support", "team success"],
    interviewerIntent:
      "The interviewer checks generosity and whether you support the team beyond your own tasks.",
    shortAnswer:
      "A teammate was stuck on [task] and the deadline was close. I offered to pair for [time], explained [concept or approach], and showed them where to find [resource]. I let them do the work so they would learn. They finished [outcome], and I kept my own work on track by [how].",
    detailedAnswer: [
      "Show that you noticed the problem and offered help without taking over.",
      "Explain how you balanced helping with your own work.",
      "Describe the result for the person and for the team.",
    ],
    realWorldExample:
      "A student paired with a classmate to debug an error and showed them how to read the error message.",
    commonMistakes: [
      "Doing the work for them.",
      "Telling a story where you only gave orders.",
    ],
    followUps: [{ question: "How did you balance this with your own tasks?" }],
    answerTips: ["Mention what the other person learned."],
    keyPoints: [
      "Notice and offer",
      "Teach rather than take over",
      "Balance your own work",
      "Team result",
    ],
    weakAnswer:
      "I do not have time to help others. Everyone should handle their own tasks.",
    weakAnswerWhy: [
      "It shows no teamwork.",
      "It signals poor attitude.",
      "It misses a key interview expectation.",
    ],
    recruiterExpects: ["Helpfulness", "Judgement", "Teamwork"],
    answerFramework: [
      "Notice: I noticed [teammate] was stuck on [task].",
      "Offer: I offered to [help in this way].",
      "Method: I let them [learn by doing].",
      "Result: They [outcome], and my work [stayed on track].",
    ],
    starPrompts: {
      situation: "Recall when someone on your team was struggling.",
      task: "What did they need to finish?",
      action: "How did you help?",
      result: "What happened for them and for the team?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "team-or-individual-work",
    topic: "Work style",
    difficulty: "easy",
    title: "Do you prefer working alone or in a team?",
    keywords: ["work style", "independence", "collaboration", "flexibility"],
    interviewerIntent:
      "The interviewer checks that your preferences fit the role and that you are flexible.",
    shortAnswer:
      "I value both. I do my best focused work independently, such as [task type], and I enjoy teamwork for [planning, reviews or brainstorming] because other people catch things I miss. In my [project or role], I [example of both]. I adapt to what the task needs.",
    detailedAnswer: [
      "Show flexibility: some tasks are best alone, others in a team.",
      "Tailor your answer to the role. Most technical jobs involve both.",
      "Give a short example that shows both modes.",
    ],
    realWorldExample:
      "A developer codes alone for focused work, then reviews with teammates before merging.",
    commonMistakes: [
      "Choosing one extreme.",
      "Giving an answer that conflicts with the role.",
    ],
    followUps: [{ question: "Which is harder for you?" }],
    answerTips: ["Check how collaborative the role is."],
    keyPoints: ["Both have value", "Flexible", "Fit the role", "Example"],
    weakAnswer: "I prefer working alone because other people slow me down.",
    weakAnswerWhy: [
      "It signals poor teamwork.",
      "It does not fit most jobs.",
      "It sounds dismissive.",
    ],
    recruiterExpects: ["Flexibility", "Collaboration", "Self-awareness"],
    answerFramework: [
      "Alone: I do focused work like [task] on my own.",
      "Team: I like teamwork for [activities].",
      "Example: In [situation] I [used both].",
      "Adapt: I adjust to what the task needs.",
    ],
    starPrompts: {
      situation: "Recall a project that needed both solo and team work.",
      task: "What did each part require?",
      action: "How did you split your time?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
])
