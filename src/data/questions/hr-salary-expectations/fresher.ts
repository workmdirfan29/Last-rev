import { defineQuestions } from "../author"

export default defineQuestions("hr-salary-expectations", "fresher", [
  {
    slug: "what-are-your-salary-expectations",
    topic: "Salary discussion",
    difficulty: "hard",
    title: "What are your salary expectations?",
    keywords: ["salary expectations", "range", "research", "negotiation"],
    interviewerIntent:
      "The interviewer checks that your expectations are realistic and researched, and that you can discuss money professionally.",
    shortAnswer:
      "Based on my research of similar roles in [your city or market] for [your experience level], I am looking at a range of [your researched range]. I am flexible, because I also value [learning, growth or the team], and I would like to understand the full package and the responsibilities before settling on a number.",
    detailedAnswer: [
      "Research typical ranges for the role, location and experience using reliable salary sources before the interview.",
      "Give a range, not a single number, and keep the lower end at a level you would truly accept.",
      "Show flexibility without undervaluing yourself, and ask about the whole package.",
    ],
    realWorldExample:
      "A candidate researches ranges for similar roles and states a range, then asks about the benefits and review cycle.",
    commonMistakes: [
      "Giving a number with no research.",
      "Saying you will accept anything.",
      "Naming an unrealistic figure.",
    ],
    followUps: [
      { question: "How did you arrive at that range?" },
      { question: "Is that number flexible?" },
    ],
    answerTips: ["Know your minimum acceptable figure before you walk in."],
    keyPoints: [
      "Research first",
      "Give a range",
      "Stay flexible",
      "Consider the whole package",
    ],
    weakAnswer: "Whatever you give is fine. I just need a job.",
    weakAnswerWhy: [
      "It undervalues you.",
      "It gives the employer no information.",
      "It weakens your negotiation.",
    ],
    recruiterExpects: ["Realism", "Preparation", "Professionalism"],
    answerFramework: [
      "Research: Based on [source of information] for [role and market].",
      "Range: I am looking at [range].",
      "Flexibility: I am open to discuss based on [responsibilities and package].",
      "Question: Could you tell me the range for this role?",
    ],
    starPrompts: {
      situation: "Recall a time you negotiated or agreed on terms.",
      task: "What outcome did you want?",
      action: "How did you prepare and what did you say?",
      result: "What was agreed?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "what-is-your-current-salary",
    topic: "Salary discussion",
    difficulty: "hard",
    title: "What is your current salary?",
    keywords: ["current salary", "disclosure", "negotiation", "boundaries"],
    interviewerIntent:
      "The interviewer asks to anchor an offer. They check how you handle a sensitive question calmly and truthfully.",
    shortAnswer:
      "My current package is [your real figure or components if you choose to share it]. I would prefer to focus on the value of this role and the market range for its responsibilities. For this position I am looking for [your researched range], and I am happy to explain how I arrived at it.",
    detailedAnswer: [
      "Never lie about your current pay, since offers can be verified. You can politely steer the conversation to the role's market range.",
      "Some regions allow or require you to decline to share. Know the norms where you live, and decide your approach beforehand.",
      "Keep a calm, professional tone either way.",
    ],
    realWorldExample:
      "A candidate shares the real figure briefly and then redirects to the researched range for the new responsibilities.",
    commonMistakes: [
      "Inflating your current salary.",
      "Refusing rudely.",
      "Sharing before you have thought about it.",
    ],
    followUps: [{ question: "Why do you expect a change from that figure?" }],
    answerTips: ["Decide beforehand how much you will share."],
    keyPoints: [
      "Never lie",
      "Steer to market range",
      "Stay calm",
      "Know local norms",
    ],
    weakAnswer: "I will tell you a higher number so that you offer me more.",
    weakAnswerWhy: [
      "It is dishonest and can be verified.",
      "It risks losing the offer.",
      "It damages trust.",
    ],
    recruiterExpects: ["Honesty", "Composure", "Clarity"],
    answerFramework: [
      "Fact: My current package is [figure or decision not to share].",
      "Redirect: For this role I am looking at [range].",
      "Reason: This reflects [responsibilities and research].",
      "Open: I am happy to discuss.",
    ],
    starPrompts: {
      situation:
        "Recall a sensitive conversation you had to handle professionally.",
      task: "What did you need to protect or achieve?",
      action: "How did you respond?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "is-your-salary-negotiable",
    topic: "Negotiation",
    difficulty: "medium",
    title: "Is your salary expectation negotiable?",
    keywords: ["negotiation", "flexibility", "package", "priorities"],
    interviewerIntent:
      "The interviewer checks that you are reasonable and clear about what matters to you beyond the base figure.",
    shortAnswer:
      "I am open to discussing it, because the whole package matters to me: [learning, growth, benefits, flexibility]. I have a range in mind that reflects my research, and within it I am flexible depending on the responsibilities and the growth path. I would like to understand how the role develops before we settle on a final figure.",
    detailedAnswer: [
      "Show you are reasonable without giving up your minimum.",
      "Mention non-salary factors only if they are truly important to you.",
      "Ask questions about the review cycle and growth, which shows long-term thinking.",
    ],
    realWorldExample:
      "A candidate accepts a slightly lower base when the role includes a clear learning plan and a review after a period.",
    commonMistakes: [
      "Saying everything is negotiable.",
      "Refusing any discussion.",
    ],
    followUps: [{ question: "What matters to you besides salary?" }],
    answerTips: [
      "Know your priorities and your minimum before the conversation.",
    ],
    keyPoints: [
      "Open but not desperate",
      "Whole package",
      "Ask about growth",
      "Know your minimum",
    ],
    weakAnswer: "No, it is fixed, and I will not discuss it.",
    weakAnswerWhy: [
      "It sounds rigid.",
      "It ends the conversation.",
      "It shows a lack of flexibility.",
    ],
    recruiterExpects: ["Flexibility", "Clarity", "Professionalism"],
    answerFramework: [
      "Openness: I am open to discuss.",
      "Priorities: What matters to me is [factors].",
      "Range: My researched range is [range].",
      "Question: Could we talk about [growth or review cycle]?",
    ],
    starPrompts: {
      situation: "Recall a decision where you balanced two priorities.",
      task: "What did you have to decide?",
      action: "How did you weigh them?",
      result: "What did you choose?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "salary-as-a-fresher",
    topic: "Salary discussion",
    difficulty: "medium",
    title: "As a fresher, what salary do you expect and why?",
    keywords: ["fresher salary", "entry level", "learning", "market rate"],
    interviewerIntent:
      "The interviewer checks that a fresher's expectation matches the market and that you value learning over a high number.",
    shortAnswer:
      "I understand that I am starting my career, so I researched entry-level ranges for [role] in [location]. I am looking for a package within [range], and I am more interested in learning, mentoring and growth here. I would like to understand how the company reviews performance and how I can grow with the team.",
    detailedAnswer: [
      "Use public data to understand entry-level ranges and avoid comparing yourself with experienced people.",
      "Emphasise learning and growth while staying clear about your minimum.",
      "Ask about the review process and training, which shows you plan to grow.",
    ],
    realWorldExample:
      "A fresher states a researched range and asks about the mentoring programme and review cycle.",
    commonMistakes: [
      "Quoting a figure from social media without research.",
      "Saying salary does not matter at all.",
    ],
    followUps: [{ question: "How did you research that range?" }],
    answerTips: ["Check more than one source."],
    keyPoints: [
      "Entry-level research",
      "Learning focus",
      "Clear range",
      "Ask about growth",
    ],
    weakAnswer: "I want the same as my friend who works in a big city.",
    weakAnswerWhy: [
      "It is not based on research for this role.",
      "It compares without context.",
      "It sounds immature.",
    ],
    recruiterExpects: [
      "Realistic expectations",
      "Maturity",
      "Interest in growth",
    ],
    answerFramework: [
      "Research: For entry-level [role] in [location] I found [range].",
      "Expectation: I am looking within [range].",
      "Priority: I value [learning and mentoring].",
      "Question: How does the review process work?",
    ],
    starPrompts: {
      situation: "Recall a time you researched before making a decision.",
      task: "What did you want to find out?",
      action: "Which sources did you use?",
      result: "What did you conclude?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "if-the-offer-is-lower-than-expected",
    topic: "Negotiation",
    difficulty: "hard",
    title: "What will you do if our offer is lower than your expectation?",
    keywords: ["offer", "negotiation", "counter", "decision"],
    interviewerIntent:
      "The interviewer checks that you can negotiate respectfully and decide rationally.",
    shortAnswer:
      "I would thank you for the offer and ask for time to review it. I would compare it with my range and the other parts of the package. If it is lower than I expected, I would explain my reasoning politely, for example [your relevant skills or research], and ask whether there is flexibility. If not, I would decide based on growth and fit, and respond respectfully either way.",
    detailedAnswer: [
      "Stay polite and appreciative. Ask for time, which is a normal request.",
      "Make a clear, evidence-based case when you counter, using skills and market research.",
      "Be ready to accept or decline calmly, depending on your priorities.",
    ],
    realWorldExample:
      "A candidate responds with thanks, requests a day, then proposes a figure within their researched range.",
    commonMistakes: [
      "Accepting immediately and resenting it later.",
      "Responding angrily or giving an ultimatum.",
    ],
    followUps: [{ question: "What would make you accept the offer?" }],
    answerTips: ["Rehearse one calm sentence for asking time."],
    keyPoints: [
      "Thank them",
      "Ask for time",
      "Evidence-based counter",
      "Decide calmly",
    ],
    weakAnswer:
      "I will refuse immediately and tell you the offer is an insult.",
    weakAnswerWhy: [
      "It is rude.",
      "It ends the relationship.",
      "It shows poor judgement.",
    ],
    recruiterExpects: ["Professionalism", "Reasoned negotiation", "Composure"],
    answerFramework: [
      "Thanks: Thank you for the offer.",
      "Time: May I take [time] to review it?",
      "Case: Based on [skills and research], I was hoping for [range].",
      "Decision: I will decide on [priorities] and respond promptly.",
    ],
    starPrompts: {
      situation: "Recall a disagreement about terms or expectations.",
      task: "What outcome did you want?",
      action: "How did you present your case?",
      result: "How was it resolved?",
    },
    estimatedMinutes: 4,
  },
])
