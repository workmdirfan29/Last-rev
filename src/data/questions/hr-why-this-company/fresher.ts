import { defineQuestions } from "../author"

export default defineQuestions("hr-why-this-company", "fresher", [
  {
    slug: "why-do-you-want-to-join-us",
    topic: "Company interest",
    difficulty: "medium",
    title: "Why do you want to work for this company?",
    keywords: ["company research", "motivation", "culture", "product"],
    interviewerIntent:
      "The interviewer checks whether you did real research and whether your reasons are specific, not copied from a generic template.",
    shortAnswer:
      "I read about [specific product, project, value or news from the company's own website], and what interests me is [specific reason]. The role involves [aspect of the job], which matches my experience in [your skill]. I would like to be part of a team that [what the company does or values].",
    detailedAnswer: [
      "Research the company's products, mission and recent public updates before the interview.",
      "Give two reasons: one about the work and one about the team or values.",
      "Avoid reasons based only on salary, brand name or convenience.",
    ],
    realWorldExample:
      "A candidate mentions a feature from the company's public documentation and explains how it relates to a project they built.",
    commonMistakes: [
      "Giving an answer that could fit any company.",
      "Mentioning only salary or location.",
    ],
    followUps: [
      { question: "What do you know about our products?" },
      { question: "What would you change about them?" },
    ],
    answerTips: [
      "Write down two specific facts from the company's website and keep them ready.",
    ],
    keyPoints: [
      "Specific research",
      "Work plus values",
      "Link to your skills",
      "Avoid generic reasons",
    ],
    weakAnswer:
      "It is a big company with a famous name, and the salary is good.",
    weakAnswerWhy: [
      "It shows no research.",
      "It focuses only on benefits to you.",
      "It could apply to any employer.",
    ],
    recruiterExpects: ["Preparation", "Genuine interest", "Fit"],
    answerFramework: [
      "Research: I read about [specific fact] on [source].",
      "Interest: It interests me because [reason].",
      "Match: It links to my experience in [skill or project].",
      "Contribution: I would like to contribute to [area].",
    ],
    starPrompts: {
      situation:
        "Recall how you first learned about this company or its product.",
      task: "What were you trying to find out?",
      action: "What did you read or try?",
      result: "What made you want to apply?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "what-do-you-know-about-us",
    topic: "Company interest",
    difficulty: "medium",
    title: "What do you know about our company?",
    keywords: ["research", "mission", "products", "values"],
    interviewerIntent:
      "The interviewer checks the depth of your preparation and whether you understand what the company actually does.",
    shortAnswer:
      "From your website and public material, I understand that you [what the company does, in your own words]. Your main products or services include [products], used by [type of customers]. I also noticed [recent public update or value]. I would be glad to learn more about [team or area] from you.",
    detailedAnswer: [
      "Say only what you actually found. Do not guess or repeat rumours.",
      "Cover what the company does, who it serves, and one recent public fact.",
      "End with a question that shows curiosity.",
    ],
    realWorldExample:
      "A candidate summarises the company's main product in two sentences and mentions a recent public blog post.",
    commonMistakes: [
      "Saying you did not have time to research.",
      "Repeating the company's slogan without understanding.",
    ],
    followUps: [{ question: "Who do you think our main users are?" }],
    answerTips: [
      "Use the company's website, documentation and public social pages.",
    ],
    keyPoints: [
      "What they do",
      "Who they serve",
      "One recent fact",
      "Show curiosity",
    ],
    weakAnswer: "I do not know much. I only saw the job post.",
    weakAnswerWhy: [
      "It shows no preparation.",
      "It signals low interest.",
      "It leaves the interviewer to explain everything.",
    ],
    recruiterExpects: ["Preparation", "Accuracy", "Curiosity"],
    answerFramework: [
      "What: Your company [what it does].",
      "Who: Your customers are [who].",
      "Recent: I noticed [recent public fact].",
      "Curious: I would like to learn more about [area].",
    ],
    starPrompts: {
      situation:
        "Think of a time you researched an organisation before meeting them.",
      task: "What did you want to learn?",
      action: "Where did you look and what did you note?",
      result: "How did it help you in the conversation?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "why-this-role",
    topic: "Role interest",
    difficulty: "medium",
    title: "Why did you apply for this particular role?",
    keywords: ["role fit", "job description", "motivation", "skills match"],
    interviewerIntent:
      "The interviewer checks that you understand the role and chose it deliberately.",
    shortAnswer:
      "The role of [job title] combines [two parts of the job description] that I enjoy. I have [relevant experience or project], and I want to go deeper in [area]. The job description also mentions [specific item], which tells me I would be working on [type of problem], and that is the work I want to do.",
    detailedAnswer: [
      "Quote two specific things from the job description and match each to something you have done or want to learn.",
      "Show that you understand the day-to-day work, not just the title.",
      "Avoid saying that you applied to many roles and this is just one of them.",
    ],
    realWorldExample:
      "A candidate who built a dashboard project links it to the role's work on reporting features.",
    commonMistakes: [
      "Describing the role incorrectly.",
      "Saying you applied because it was available.",
    ],
    followUps: [{ question: "Which part of the role looks most challenging?" }],
    answerTips: [
      "Highlight the job description and prepare two matching examples.",
    ],
    keyPoints: [
      "Specific match",
      "Understand daily work",
      "Show interest",
      "Honest",
    ],
    weakAnswer: "I am applying to many jobs, and this one was open.",
    weakAnswerWhy: [
      "It shows no commitment.",
      "It makes the role seem unimportant to you.",
      "It gives no reasons.",
    ],
    recruiterExpects: ["Understanding", "Intent", "Fit"],
    answerFramework: [
      "Role: I applied for [title] because it involves [two parts].",
      "Evidence: I have [experience or project].",
      "Growth: I want to deepen [skill].",
      "Interest: I am looking forward to [problem type].",
    ],
    starPrompts: {
      situation:
        "Recall the first time you worked on something similar to this role.",
      task: "What did you have to do?",
      action: "What steps did you take?",
      result: "What did you enjoy or learn?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "what-can-you-contribute-to-our-mission",
    topic: "Contribution",
    difficulty: "medium",
    title: "How can you contribute to our company's goals?",
    keywords: ["contribution", "goals", "alignment", "impact"],
    interviewerIntent:
      "The interviewer checks whether you think about the team's results and not just your own growth.",
    shortAnswer:
      "From what I understand, your goal is [company or team goal]. I can contribute through [skill or strength], which I have used in [example]. In practice, I would [specific way you would help], and I would work closely with the team to keep what I build useful for [users or customers].",
    detailedAnswer: [
      "Start with the company's goal as you understand it, then connect your strength to it.",
      "Give one practical example of how you would help.",
      "Show you care about users and teamwork, not only about tasks.",
    ],
    realWorldExample:
      "A candidate for a front-end role talks about building accessible, fast pages because the company says it serves a wide audience.",
    commonMistakes: [
      "Only talking about what you will gain.",
      "Making claims you cannot support.",
    ],
    followUps: [
      { question: "Can you give an example of something similar you did?" },
    ],
    answerTips: ["Link one skill to one company goal."],
    keyPoints: [
      "Company goal first",
      "Your strength",
      "Practical example",
      "Teamwork and users",
    ],
    weakAnswer: "I will work hard and do whatever is told.",
    weakAnswerWhy: [
      "It has no specifics.",
      "It sounds passive.",
      "It does not mention the company's goals.",
    ],
    recruiterExpects: ["Alignment", "Initiative", "Specific value"],
    answerFramework: [
      "Goal: The team aims to [goal].",
      "Strength: I can help with [strength].",
      "Example: I did something similar when [example].",
      "Approach: I would work with [team] to [action].",
    ],
    starPrompts: {
      situation: "Recall a team goal you contributed to.",
      task: "What was your part?",
      action: "What did you do to help?",
      result: "How did the team benefit?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "other-offers-and-our-company",
    topic: "Company interest",
    difficulty: "hard",
    title: "Have you applied to other companies? Why should you choose us?",
    keywords: ["other offers", "comparison", "commitment", "honesty"],
    interviewerIntent:
      "The interviewer tests honesty and how strongly you prefer this company without bad-mouthing others.",
    shortAnswer:
      "Yes, I am speaking with a few companies, because I want the right fit. What makes this role stand out for me is [specific reasons about work, team or learning]. I have asked myself what I want from my first years, and this role matches it. I would be happy to share how my process is going if it helps.",
    detailedAnswer: [
      "Be honest. Interviewers know that candidates can have other options.",
      "Do not name or criticise other employers. Focus on what attracts you here.",
      "Do not exaggerate or invent offers.",
    ],
    realWorldExample:
      "A candidate admits other conversations and names two specific reasons this team's work is their first choice.",
    commonMistakes: [
      "Inventing offers to create pressure.",
      "Criticising other companies.",
    ],
    followUps: [
      { question: "If you received two offers, how would you decide?" },
    ],
    answerTips: ["Stay positive and specific."],
    keyPoints: [
      "Honest",
      "No comparison with named companies",
      "Specific reasons",
      "Calm tone",
    ],
    weakAnswer: "I have five offers already, but yours is the easiest.",
    weakAnswerWhy: [
      "It is likely untrue or arrogant.",
      "It insults the company.",
      "It gives no real reasons.",
    ],
    recruiterExpects: ["Honesty", "Genuine interest", "Professionalism"],
    answerFramework: [
      "Honesty: I am talking to a few places.",
      "Reason one: This role attracts me because [reason].",
      "Reason two: Also [reason about team or learning].",
      "Close: This matches what I look for in [stage of career].",
    ],
    starPrompts: {
      situation: "Recall a time you chose between two options.",
      task: "What did you need to decide?",
      action: "How did you compare them?",
      result: "What did you choose and why?",
    },
    estimatedMinutes: 3,
  },
])
