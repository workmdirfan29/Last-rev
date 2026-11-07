import { defineQuestions } from "../author"

export default defineQuestions("hr-strengths-weaknesses", "fresher", [
  {
    slug: "greatest-strengths",
    topic: "Strengths",
    difficulty: "easy",
    title: "What are your greatest strengths?",
    keywords: ["strengths", "evidence", "skills", "self awareness"],
    interviewerIntent:
      "The interviewer wants two or three strengths that fit the role, each backed by evidence rather than just named.",
    shortAnswer:
      "One strength is [strength one]. For example, in [situation] I [what you did], which led to [result]. Another is [strength two], which I showed when [short example]. I believe both help in a role like this because [link to the job's needs].",
    detailedAnswer: [
      "Choose strengths from the job description: technical skills, learning speed, communication or ownership.",
      "For each, give a short real example. A strength without evidence is only a claim.",
      "Finish by linking the strengths to what the team needs.",
    ],
    realWorldExample:
      "A candidate for a support role names patience and clear writing, and describes helping a classmate debug an issue step by step.",
    commonMistakes: [
      "Listing many adjectives with no example.",
      "Choosing strengths unrelated to the job.",
    ],
    followUps: [
      { question: "Can you give an example of that strength under pressure?" },
    ],
    answerTips: ["Prepare two strengths and one example for each."],
    keyPoints: [
      "Two or three strengths",
      "Evidence for each",
      "Relevant to the role",
      "Short and clear",
    ],
    weakAnswer:
      "I am hardworking, honest, punctual, friendly, creative and a team player.",
    weakAnswerWhy: [
      "It is a list of unproven adjectives.",
      "It has no examples.",
      "It is not focused on the role.",
    ],
    recruiterExpects: ["Relevant strengths", "Evidence", "Self-awareness"],
    answerFramework: [
      "Strength: One of my strengths is [strength].",
      "Evidence: For example, when [situation] I [action].",
      "Result: This led to [result].",
      "Link: It will help me in [job need].",
    ],
    starPrompts: {
      situation:
        "Recall a time your strength was clearly visible: what was happening?",
      task: "What did you need to achieve?",
      action: "What did you do that used the strength?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "biggest-weakness",
    topic: "Weaknesses",
    difficulty: "hard",
    title: "What is your biggest weakness?",
    keywords: ["weakness", "development area", "honesty", "improvement plan"],
    interviewerIntent:
      "The interviewer checks honesty, self-awareness and whether you actively improve, not whether you are flawless.",
    shortAnswer:
      "One area I am improving is [real, non-critical weakness]. It showed up when [short example]. To work on it, I [specific actions, such as a routine or tool], and I have already noticed [small improvement]. I keep working on it because [reason it matters for work].",
    detailedAnswer: [
      "Choose a real weakness that is not essential to the job. Avoid disguised strengths such as being a perfectionist.",
      "Show the steps you are taking and any progress, which matters more than the weakness itself.",
      "Keep it short and finish positively.",
    ],
    realWorldExample:
      "A candidate admits hesitating to ask for help, and describes setting a rule to ask after a fixed time of being stuck.",
    commonMistakes: [
      "Saying you have none.",
      "Naming a weakness that is critical for the role.",
      "Using a clichéd humble brag.",
    ],
    followUps: [
      { question: "How do you know you are improving?" },
      { question: "How has this weakness affected your work?" },
    ],
    answerTips: [
      "Spend more time on what you do about it than on describing it.",
    ],
    keyPoints: [
      "Real and non-critical",
      "Specific actions",
      "Show progress",
      "Stay positive",
    ],
    weakAnswer:
      "My weakness is that I work too hard and care too much about perfection.",
    weakAnswerWhy: [
      "It is a disguised strength and sounds rehearsed.",
      "It shows no real self-awareness.",
      "It gives no improvement plan.",
    ],
    recruiterExpects: ["Honesty", "An improvement plan", "Maturity"],
    answerFramework: [
      "Weakness: I am working on [weakness].",
      "Example: It showed up when [situation].",
      "Action: I now [steps you take].",
      "Progress: As a result [small improvement].",
    ],
    starPrompts: {
      situation: "When did this weakness affect your work or studies?",
      task: "What did you need to do at that time?",
      action: "What did you change afterwards?",
      result: "What improved?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "working-on-your-weakness",
    topic: "Weaknesses",
    difficulty: "medium",
    title: "What are you doing to improve that weakness?",
    keywords: ["improvement", "feedback", "habits", "growth"],
    interviewerIntent:
      "The interviewer follows up on the weakness to see whether your plan is concrete and sustained.",
    shortAnswer:
      "I use three things. First, [specific habit or tool]. Second, I ask [mentor, teacher or teammate] for feedback on [area] about [how often]. Third, I review my progress by [simple method]. Since starting, I have noticed [observable change], and I plan to continue until [goal].",
    detailedAnswer: [
      "Give two or three concrete actions that you actually do, not intentions.",
      "Include feedback from other people and a way to measure progress.",
      "Show that improvement is ongoing and not a one-time fix.",
    ],
    realWorldExample:
      "A candidate who struggled with deadlines now breaks tasks into small steps and reviews progress at the end of each day.",
    commonMistakes: [
      "Saying you will try harder.",
      "Giving a plan you have not started.",
    ],
    followUps: [{ question: "What feedback have you received so far?" }],
    answerTips: ["Have a real routine you can describe."],
    keyPoints: [
      "Concrete actions",
      "Seek feedback",
      "Measure progress",
      "Keep going",
    ],
    weakAnswer: "I will just try harder and be more careful next time.",
    weakAnswerWhy: [
      "It has no concrete steps.",
      "It cannot be checked.",
      "It does not show real effort.",
    ],
    recruiterExpects: ["A real plan", "Initiative", "Openness to feedback"],
    answerFramework: [
      "Habit: I now [habit or tool].",
      "Feedback: I ask [person] for feedback [how often].",
      "Tracking: I check progress by [method].",
      "Change: I have seen [improvement].",
    ],
    starPrompts: {
      situation: "Describe the moment you decided to work on this.",
      task: "What was your goal?",
      action: "What steps do you take regularly?",
      result: "What difference have you noticed?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "strength-most-relevant-to-role",
    topic: "Strengths",
    difficulty: "medium",
    title: "Which of your strengths is most relevant to this role?",
    keywords: ["relevance", "job description", "fit", "prioritise"],
    interviewerIntent:
      "The interviewer checks that you understood the role and can pick the single strongest match.",
    shortAnswer:
      "From the job description, [requirement] looks central, and that matches my strength in [strength]. I have used it in [project or experience], where I [action] and [result]. I would bring it to [specific part of the role] from the first week.",
    detailedAnswer: [
      "Read the job description before the interview and mark the top requirements.",
      "Choose the strength that matches the main requirement, not the one you like most.",
      "Give evidence and say how you would use it on day one.",
    ],
    realWorldExample:
      "For a role that emphasises teamwork, the candidate picks collaboration and describes a group project with a clear split of responsibilities.",
    commonMistakes: [
      "Choosing a strength that does not match the advert.",
      "Giving no example.",
    ],
    followUps: [{ question: "How would you use it in your first week?" }],
    answerTips: [
      "Mirror the language of the job description where it is honest to do so.",
    ],
    keyPoints: [
      "Match the requirement",
      "One strength, deeply",
      "Evidence",
      "Say how you would use it",
    ],
    weakAnswer: "All my strengths are relevant. I can do everything.",
    weakAnswerWhy: [
      "It avoids choosing.",
      "It shows no understanding of the role.",
      "It sounds unrealistic.",
    ],
    recruiterExpects: ["Understanding of the role", "Focus", "Evidence"],
    answerFramework: [
      "Requirement: The role needs [requirement].",
      "Strength: I bring [strength].",
      "Proof: I used it when [example].",
      "Use: I would apply it by [plan].",
    ],
    starPrompts: {
      situation:
        "Find an experience that mirrors a main requirement of the role.",
      task: "What did it require of you?",
      action: "How did you apply your strength?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "manager-improvement-feedback",
    topic: "Feedback",
    difficulty: "medium",
    title:
      "What would your manager or teacher say is your area for improvement?",
    keywords: ["feedback", "manager", "improvement", "self awareness"],
    interviewerIntent:
      "The interviewer checks how well you listen to feedback and whether your answer is consistent with what a reference would say.",
    shortAnswer:
      "[Manager, teacher or mentor] once told me that I could improve [area]. I agreed, because [short reason]. Since then I have [specific change], and the next time I [situation] they noticed [improvement]. I still ask for feedback in that area.",
    detailedAnswer: [
      "Use real feedback you have received. References may be contacted, so be honest.",
      "Show that you accepted the feedback and acted on it.",
      "Mention the change in behaviour and a result if you can.",
    ],
    realWorldExample:
      "A student who was told their code lacked comments started adding short explanations and received better review comments.",
    commonMistakes: [
      "Claiming no feedback ever.",
      "Blaming the person who gave it.",
    ],
    followUps: [{ question: "How did you feel when you heard it?" }],
    answerTips: [
      "Remember one specific piece of feedback and the change you made.",
    ],
    keyPoints: [
      "Real feedback",
      "You accepted it",
      "You acted on it",
      "You still ask",
    ],
    weakAnswer:
      "My manager always said I was perfect, and there was nothing to improve.",
    weakAnswerWhy: [
      "It is unbelievable.",
      "It shows no openness to feedback.",
      "It gives no learning.",
    ],
    recruiterExpects: ["Openness", "Action on feedback", "Honesty"],
    answerFramework: [
      "Feedback: I was told to improve [area].",
      "Reaction: I agreed because [reason].",
      "Action: I changed [behaviour].",
      "Result: [improvement], and I still seek feedback.",
    ],
    starPrompts: {
      situation: "When did someone give you constructive feedback?",
      task: "What did you need to change?",
      action: "What did you do differently?",
      result: "What improved afterwards?",
    },
    estimatedMinutes: 3,
  },
])
