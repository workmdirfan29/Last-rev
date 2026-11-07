import { defineQuestions } from "../author"

export default defineQuestions("hr-fresher-specific", "fresher", [
  {
    slug: "you-have-no-experience-why-hire-you",
    topic: "Fresher questions",
    difficulty: "medium",
    title: "You have no work experience. Why should we hire you?",
    keywords: ["fresher", "no experience", "potential", "projects"],
    interviewerIntent:
      "The interviewer checks how you present potential, projects and learning ability in the absence of job history.",
    shortAnswer:
      "I do not have a job history yet, but I have [projects, internships or coursework] where I used [skills], for example [specific project]. I learn quickly and I take feedback seriously. I would bring energy, up-to-date knowledge and a strong wish to grow in this team, and I am ready to be trained on how you work.",
    detailedAnswer: [
      "Use projects, internships, coursework and open-source or personal work as evidence.",
      "Highlight learning ability, attitude and up-to-date skills.",
      "Be positive and honest about being at the start of your career.",
    ],
    realWorldExample:
      "A fresher presents a final-year project with a deployed demo and explains the decisions they made.",
    commonMistakes: [
      "Apologising for being a fresher.",
      "Having no project to show.",
    ],
    followUps: [{ question: "Tell me about your best project." }],
    answerTips: ["Have one project ready to explain in depth."],
    keyPoints: [
      "Projects as evidence",
      "Learning speed",
      "Positive attitude",
      "Ready to be trained",
    ],
    weakAnswer:
      "I have no experience, so please give me a chance because I need a job.",
    weakAnswerWhy: [
      "It pleads instead of showing value.",
      "It gives no evidence.",
      "It sounds unprepared.",
    ],
    recruiterExpects: ["Evidence of skills", "Attitude", "Potential"],
    answerFramework: [
      "Evidence: I built [project] using [skills].",
      "Learning: I learn by [method].",
      "Attitude: I take [feedback and initiative].",
      "Fit: I want to grow in [team].",
    ],
    starPrompts: {
      situation:
        "Describe a project or internship where you applied your skills.",
      task: "What were you responsible for?",
      action: "What did you build or decide?",
      result: "What did you learn or deliver?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "tell-me-about-your-final-year-project",
    topic: "Fresher questions",
    difficulty: "medium",
    title: "Tell me about your final year project.",
    keywords: [
      "final year project",
      "project explanation",
      "role",
      "technologies",
    ],
    interviewerIntent:
      "The interviewer checks depth of understanding and your own contribution, not only the project's title.",
    shortAnswer:
      "My project was [name and purpose], built to solve [problem]. Our team of [size] used [technologies]. I was responsible for [your part], and I implemented [specific features]. A challenge was [challenge], which I solved by [approach]. The result was [outcome], and I learned [lessons].",
    detailedAnswer: [
      "Explain the problem, the solution, your role and a technical challenge.",
      "Be precise about what you built versus what the team built.",
      "Be prepared for follow-ups on any technology you mention.",
    ],
    realWorldExample:
      "A student explains how they designed the database tables and the login flow of a placement portal.",
    commonMistakes: [
      "Claiming the whole project.",
      "Not understanding the technology you list.",
    ],
    followUps: [
      { question: "What would you improve if you had more time?" },
      { question: "Why did you choose that technology?" },
    ],
    answerTips: ["Prepare a two-minute version and a deeper version."],
    keyPoints: ["Problem and solution", "Your role", "A challenge", "Lessons"],
    weakAnswer: "It was a website. We made it in a group. It was good.",
    weakAnswerWhy: [
      "It has no detail.",
      "It does not state your role.",
      "It does not show understanding.",
    ],
    recruiterExpects: ["Depth", "Honesty about role", "Clarity"],
    answerFramework: [
      "Purpose: The project [purpose].",
      "Team and role: I [role] in a team of [size].",
      "Challenge: A difficulty was [challenge] and I [approach].",
      "Result: We [outcome] and I learned [lesson].",
    ],
    starPrompts: {
      situation: "What problem did the project solve?",
      task: "What was your own responsibility?",
      action: "What did you design or build?",
      result: "What was the result?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "why-did-you-choose-this-career-as-a-fresher",
    topic: "Motivation",
    difficulty: "easy",
    title: "Why did you choose this career path?",
    keywords: ["career choice", "motivation", "interest", "story"],
    interviewerIntent:
      "The interviewer checks that your interest is genuine and has substance.",
    shortAnswer:
      "I became interested in [field] when [moment or experience]. Since then I [what you did to explore it], and I found that I enjoy [aspect of the work]. It combines [things you like] with [skills you have], and I want to build a career where I can [aim]. This role is a strong step towards that.",
    detailedAnswer: [
      "Tell a short story with a trigger moment and actions you took.",
      "Avoid saying you chose it only because of salary or family pressure.",
      "Connect your interest to the role.",
    ],
    realWorldExample:
      "A candidate built a small game in college and discovered they enjoyed solving logic problems.",
    commonMistakes: [
      "Saying it was the only option.",
      "Giving a generic answer.",
    ],
    followUps: [{ question: "What do you enjoy most about it?" }],
    answerTips: ["Use a true personal story."],
    keyPoints: [
      "Trigger moment",
      "Actions taken",
      "Real enjoyment",
      "Link to the role",
    ],
    weakAnswer: "My parents told me to do this because it pays well.",
    weakAnswerWhy: [
      "It shows no personal interest.",
      "It sounds passive.",
      "It weakens motivation.",
    ],
    recruiterExpects: ["Genuine interest", "Substance", "Motivation"],
    answerFramework: [
      "Trigger: I became interested when [moment].",
      "Exploration: I [actions].",
      "Enjoyment: I enjoy [aspect].",
      "Aim: I want to [goal].",
    ],
    starPrompts: {
      situation: "What first drew you to this field?",
      task: "What did you decide to try?",
      action: "What did you do next?",
      result: "What did you discover?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "are-you-ready-to-start-at-the-bottom",
    topic: "Expectations",
    difficulty: "medium",
    title:
      "Are you comfortable starting with basic tasks and learning from the beginning?",
    keywords: ["entry level", "humility", "learning", "expectations"],
    interviewerIntent:
      "The interviewer checks that your expectations are realistic for an entry-level role.",
    shortAnswer:
      "Yes. I know the first months are about learning how the team works, so I am happy to take on [smaller tasks, testing or bug fixes] and do them well. I see them as the way to understand the product. I will ask questions, take feedback, and look for ways to take on more as I grow.",
    detailedAnswer: [
      "Show humility and eagerness to learn, while still showing ambition.",
      "Mention that you see small tasks as a way to understand the product.",
      "Do not sound resentful or overly passive.",
    ],
    realWorldExample:
      "A new developer started with fixing small bugs, which taught them the codebase, and then moved to features.",
    commonMistakes: [
      "Expecting senior work immediately.",
      "Sounding unmotivated by basic tasks.",
    ],
    followUps: [{ question: "How will you ask for more responsibility?" }],
    answerTips: ["Show eagerness and ambition together."],
    keyPoints: [
      "Humble",
      "Learn the product",
      "Do small tasks well",
      "Ask for more later",
    ],
    weakAnswer:
      "I want to work on big projects immediately. Small tasks are a waste of my time.",
    weakAnswerWhy: [
      "It shows poor attitude.",
      "It ignores learning needs.",
      "It is a red flag.",
    ],
    recruiterExpects: ["Realism", "Humility", "Ambition"],
    answerFramework: [
      "Attitude: I am happy to start with [tasks].",
      "Reason: They help me learn [what].",
      "Method: I will [ask questions and take feedback].",
      "Growth: I will aim to take on [more] over time.",
    ],
    starPrompts: {
      situation: "Recall a time you started something new from the basics.",
      task: "What did you need to learn?",
      action: "How did you progress?",
      result: "What did you achieve?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "how-did-you-prepare-for-this-interview",
    topic: "Preparation",
    difficulty: "easy",
    title: "How did you prepare for this interview?",
    keywords: ["preparation", "research", "practice", "initiative"],
    interviewerIntent:
      "The interviewer checks effort, organisation and genuine interest.",
    shortAnswer:
      "I read the job description and mapped it to my skills, researched the company's products, and revised the topics the role needs, such as [topics]. I practised explaining my projects aloud and prepared questions for you. I also tried [mock practice or coding practice] to build confidence.",
    detailedAnswer: [
      "List three or four concrete steps: role research, company research, technical revision and practice.",
      "Mention questions you prepared, which shows interest.",
      "Be honest and specific.",
    ],
    realWorldExample:
      "A candidate rehearsed a two-minute introduction and prepared three questions about the team.",
    commonMistakes: [
      "Saying you did not prepare.",
      "Giving only a generic answer.",
    ],
    followUps: [{ question: "What questions do you have for us?" }],
    answerTips: ["Mention one thing you learned about the company."],
    keyPoints: [
      "Job description",
      "Company research",
      "Technical revision",
      "Practice and questions",
    ],
    weakAnswer:
      "I did not prepare. I thought I would just answer whatever you ask.",
    weakAnswerWhy: [
      "It shows low interest.",
      "It is a poor impression.",
      "It signals low effort.",
    ],
    recruiterExpects: ["Effort", "Organisation", "Interest"],
    answerFramework: [
      "Role: I studied [job description].",
      "Company: I researched [aspects].",
      "Revision: I revised [topics].",
      "Practice: I practised [activity] and prepared [questions].",
    ],
    starPrompts: {
      situation:
        "Recall how you prepared for an important exam or presentation.",
      task: "What did you need to be ready for?",
      action: "What steps did you take?",
      result: "How did it go?",
    },
    estimatedMinutes: 3,
  },
])
