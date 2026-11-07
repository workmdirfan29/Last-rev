import { defineQuestions } from "../author"

export default defineQuestions("hr-joining-availability", "fresher", [
  {
    slug: "when-can-you-join",
    topic: "Joining date",
    difficulty: "easy",
    title: "When can you join us?",
    keywords: ["joining date", "availability", "notice period", "start date"],
    interviewerIntent:
      "The interviewer plans the hiring timeline and checks that you are clear and realistic about your availability.",
    shortAnswer:
      "I can join [date or after a period], which allows me to [reason, such as complete my notice period or my final exams]. If the team needs an earlier start, I am happy to discuss whether that is possible within my current commitments. I want to leave my present responsibilities in good order.",
    detailedAnswer: [
      "State a real date or period you can honour. Do not promise something you cannot do.",
      "Give a short reason and show flexibility within real limits.",
      "Leaving commitments properly is a positive signal.",
    ],
    realWorldExample:
      "A final-year student gives the date after their last exam and offers to start remote orientation earlier if useful.",
    commonMistakes: ["Giving a date you cannot meet.", "Being vague."],
    followUps: [{ question: "Can the date be earlier?" }],
    answerTips: ["Check your notice or exam dates before the interview."],
    keyPoints: [
      "Real date",
      "Reason",
      "Flexible within limits",
      "Leave properly",
    ],
    weakAnswer: "Maybe next month, I am not sure. I will see.",
    weakAnswerWhy: [
      "It is vague.",
      "It prevents planning.",
      "It suggests low interest.",
    ],
    recruiterExpects: ["Clarity", "Realism", "Professionalism"],
    answerFramework: [
      "Date: I can join on [date].",
      "Reason: This is because [reason].",
      "Flexibility: I can [option] if needed.",
      "Care: I will hand over [responsibilities].",
    ],
    starPrompts: {
      situation: "Recall a time you had to plan around two commitments.",
      task: "What had to be completed first?",
      action: "How did you schedule?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "can-you-reduce-your-notice-period",
    topic: "Notice period",
    difficulty: "medium",
    title: "Can you reduce your notice period?",
    keywords: ["notice period", "negotiation", "handover", "commitment"],
    interviewerIntent:
      "The interviewer checks flexibility and professionalism towards your current employer.",
    shortAnswer:
      "I would need to speak with my current manager to see what is possible under my contract. I would like to leave on good terms, with a proper handover of [work]. If a shorter notice can be agreed, I will let you know quickly, and if not, I can confirm the exact date I am available.",
    detailedAnswer: [
      "Do not promise to break your contract. Show respect for current commitments.",
      "Offer to find out and respond promptly.",
      "Mention a proper handover, which new employers value.",
    ],
    realWorldExample:
      "A candidate agreed with their manager to complete a handover in a shorter period and confirmed the new date in writing.",
    commonMistakes: [
      "Promising a date without checking.",
      "Speaking badly about the current employer.",
    ],
    followUps: [{ question: "Is there a buy-out option in your contract?" }],
    answerTips: ["Read your contract terms in advance."],
    keyPoints: [
      "Respect the contract",
      "Check with the manager",
      "Handover",
      "Reply promptly",
    ],
    weakAnswer:
      "I can just leave tomorrow. I do not care about the notice period.",
    weakAnswerWhy: [
      "It shows disrespect for commitments.",
      "It worries the new employer.",
      "It may breach a contract.",
    ],
    recruiterExpects: ["Professionalism", "Honesty", "Flexibility"],
    answerFramework: [
      "Process: I would speak to [person] about options.",
      "Handover: I will complete [handover].",
      "Reply: I will confirm by [time].",
      "Fallback: Otherwise I can join on [date].",
    ],
    starPrompts: {
      situation: "Recall a time you handed over responsibilities.",
      task: "What needed to be passed on?",
      action: "How did you organise the handover?",
      result: "How did it go?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "are-you-willing-to-relocate",
    topic: "Relocation",
    difficulty: "medium",
    title: "Are you willing to relocate or work from another location?",
    keywords: ["relocation", "flexibility", "remote", "location"],
    interviewerIntent:
      "The interviewer checks real flexibility, so promises do not collapse after the offer.",
    shortAnswer:
      "Yes, I am open to relocating to [location], and I have thought about [practical considerations, such as housing and timing]. I would need about [time you choose] to arrange it. If there is a remote or hybrid arrangement, I am comfortable with that too. I would like to understand what the team expects in the first months.",
    detailedAnswer: [
      "Answer honestly. Do not agree to something you will not do.",
      "Mention practical planning to show it is a real option.",
      "Ask about expectations for in-office or remote work.",
    ],
    realWorldExample:
      "A fresher confirmed readiness to relocate after arranging temporary accommodation and asked about the onboarding schedule.",
    commonMistakes: [
      "Saying yes and refusing later.",
      "Not asking about expectations.",
    ],
    followUps: [
      { question: "What would you need from us to make the move easier?" },
    ],
    answerTips: ["Decide beforehand where you are really willing to work."],
    keyPoints: [
      "Honest",
      "Practical planning",
      "Time needed",
      "Ask expectations",
    ],
    weakAnswer: "I will say yes now and decide later.",
    weakAnswerWhy: [
      "It is dishonest.",
      "It creates problems later.",
      "It breaks trust.",
    ],
    recruiterExpects: ["Honesty", "Practicality", "Commitment"],
    answerFramework: [
      "Answer: I am willing to [relocate or work remotely].",
      "Planning: I have thought about [practicalities].",
      "Time: I need [time].",
      "Question: What does the team expect in [period]?",
    ],
    starPrompts: {
      situation: "Recall a time you moved or travelled for study or work.",
      task: "What did you need to arrange?",
      action: "How did you prepare?",
      result: "How did it go?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "willing-to-work-shifts-or-overtime",
    topic: "Work conditions",
    difficulty: "medium",
    title:
      "Are you comfortable working in shifts or occasionally beyond regular hours?",
    keywords: ["shifts", "overtime", "flexibility", "work life balance"],
    interviewerIntent:
      "The interviewer checks flexibility for genuine business needs and that you will be honest about limits.",
    shortAnswer:
      "Yes, I understand that some projects have busy periods or support needs, and I am comfortable with occasional extra hours when there is a real need. I would like to know how often that happens and how the team plans for it. I stay productive by planning ahead so that extra hours are the exception, not the routine.",
    detailedAnswer: [
      "Show willingness for real business needs while staying honest about limits.",
      "Ask how often and how it is handled, which is reasonable.",
      "Avoid promising unlimited availability.",
    ],
    realWorldExample:
      "A support engineer accepted a rotating on-call schedule after asking about compensation and rest rules.",
    commonMistakes: [
      "Agreeing to everything without thinking.",
      "Refusing any flexibility.",
    ],
    followUps: [{ question: "How do you protect your own rest and balance?" }],
    answerTips: ["Ask a calm question about frequency."],
    keyPoints: [
      "Flexible for real needs",
      "Ask about frequency",
      "Plan ahead",
      "Be honest",
    ],
    weakAnswer: "I will work any hours, even 24 hours a day, for free.",
    weakAnswerWhy: [
      "It is unrealistic.",
      "It devalues you.",
      "It is a poor basis for a sustainable job.",
    ],
    recruiterExpects: ["Flexibility", "Honesty", "Realism"],
    answerFramework: [
      "Openness: I am comfortable with [occasional extra hours].",
      "Question: How often does it happen?",
      "Planning: I plan ahead by [method].",
      "Balance: I make sure to [rest habit].",
    ],
    starPrompts: {
      situation: "Recall a busy period when you worked extra time.",
      task: "What had to be completed?",
      action: "How did you manage your energy?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "do-you-have-any-commitments",
    topic: "Availability",
    difficulty: "easy",
    title:
      "Do you have any commitments, such as exams or other plans, that could affect your joining?",
    keywords: ["commitments", "exams", "availability", "disclosure"],
    interviewerIntent:
      "The interviewer wants to avoid surprises and plan for your start.",
    shortAnswer:
      "I want to be open about this. My only commitment is [commitment, such as final exams or a notice period] until [date]. After that I am fully available. If it helps, I can share the schedule, and I will make sure it does not affect my work after I join.",
    detailedAnswer: [
      "List real commitments and dates. Honest disclosure builds trust.",
      "Say when you will be fully available.",
      "Offer to share details if useful.",
    ],
    realWorldExample:
      "A final-year student shared their exam schedule and agreed a start date after it.",
    commonMistakes: ["Hiding a commitment.", "Being unclear about dates."],
    followUps: [{ question: "Could you start part-time before that date?" }],
    answerTips: ["Have your dates ready."],
    keyPoints: [
      "Open",
      "Real dates",
      "Full availability after",
      "Offer details",
    ],
    weakAnswer: "I have no commitments. I will manage everything somehow.",
    weakAnswerWhy: [
      "It may not be true.",
      "It risks problems later.",
      "It lacks clarity.",
    ],
    recruiterExpects: ["Honesty", "Clarity", "Planning"],
    answerFramework: [
      "Disclosure: I have [commitment] until [date].",
      "Availability: After that I am fully available.",
      "Plan: I will [manage by].",
      "Offer: I can share [details].",
    ],
    starPrompts: {
      situation: "Recall a time you balanced two responsibilities.",
      task: "What had to be handled?",
      action: "How did you plan?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
])
