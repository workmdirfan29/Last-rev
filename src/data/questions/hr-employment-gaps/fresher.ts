import { defineQuestions } from "../author"

export default defineQuestions("hr-employment-gaps", "fresher", [
  {
    slug: "explain-the-gap-in-your-resume",
    topic: "Explaining gaps",
    difficulty: "hard",
    title: "There is a gap in your resume. Can you explain it?",
    keywords: ["employment gap", "career break", "honesty", "explanation"],
    interviewerIntent:
      "The interviewer wants a short, honest explanation and evidence that you stayed current and are ready to work.",
    shortAnswer:
      "Yes. Between [start] and [end], I [honest reason, such as family responsibilities, health recovery, further study or a job search in a tough market]. During that time I also [what you did to stay current, such as courses or projects]. I am fully ready to work now, and I would be glad to discuss how my skills are up to date.",
    detailedAnswer: [
      "Be brief and truthful. You do not need to share private medical or family details beyond what you choose.",
      "Show that you kept learning or stayed in touch with your field.",
      "Move quickly to your current readiness.",
    ],
    realWorldExample:
      "A candidate who took time for family care completed an online course and built a small project during the break.",
    commonMistakes: [
      "Lying or hiding the gap.",
      "Over-explaining or sounding defensive.",
    ],
    followUps: [{ question: "What did you do to stay current?" }],
    answerTips: ["Practise a calm two-sentence version."],
    keyPoints: [
      "Honest and brief",
      "Stayed current",
      "Ready now",
      "No defensiveness",
    ],
    weakAnswer: "I do not want to talk about it. It is not relevant.",
    weakAnswerWhy: [
      "It raises suspicion.",
      "It sounds defensive.",
      "It gives no reassurance.",
    ],
    recruiterExpects: ["Honesty", "Composure", "Readiness"],
    answerFramework: [
      "Fact: From [dates] I [reason].",
      "Activity: I also [learning or project].",
      "Now: I am ready to [work].",
      "Skills: My skills in [area] are current.",
    ],
    starPrompts: {
      situation: "Describe the reason for the break neutrally.",
      task: "What did you want to keep up during that time?",
      action: "What did you do?",
      result: "What are you able to do now?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "what-did-you-do-during-your-career-break",
    topic: "Staying current",
    difficulty: "medium",
    title: "What did you do during your career break to stay up to date?",
    keywords: ["career break", "upskilling", "projects", "learning"],
    interviewerIntent:
      "The interviewer looks for concrete proof that you kept learning.",
    shortAnswer:
      "I used the time to [learning activity, such as completing a course or building a project]. For example, I built [project] using [technologies], and I practised [skills] regularly. I also followed [community or documentation] to keep up with changes. I can show the work I did and talk about what I learned.",
    detailedAnswer: [
      "List two or three concrete activities and be ready to demonstrate them.",
      "Avoid vague claims like I studied a lot.",
      "Mention practical output: a project, certificate or contributions.",
    ],
    realWorldExample:
      "A candidate shows a small web app built during the break and explains the design decisions.",
    commonMistakes: [
      "Naming courses without any project.",
      "Overstating what you did.",
    ],
    followUps: [{ question: "Can you walk me through that project?" }],
    answerTips: ["Bring something you can demonstrate."],
    keyPoints: [
      "Concrete activities",
      "Practical output",
      "Honest",
      "Ready to demonstrate",
    ],
    weakAnswer: "I took a long rest and did nothing special.",
    weakAnswerWhy: [
      "It gives no reassurance about skills.",
      "It sounds careless in an interview.",
      "It misses a chance.",
    ],
    recruiterExpects: ["Evidence", "Initiative", "Honesty"],
    answerFramework: [
      "Activities: I [activities].",
      "Output: I built or finished [output].",
      "Learning: I learned [skills].",
      "Show: I can demonstrate [work].",
    ],
    starPrompts: {
      situation: "What was your situation during the break?",
      task: "What skills did you want to keep or build?",
      action: "What did you do each week?",
      result: "What can you show now?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "gap-after-graduation",
    topic: "Explaining gaps",
    difficulty: "medium",
    title: "Why did you not start working immediately after your degree?",
    keywords: [
      "gap after graduation",
      "job search",
      "skill building",
      "explanation",
    ],
    interviewerIntent:
      "The interviewer checks that the time was used purposefully.",
    shortAnswer:
      "After my degree I decided to [reason, such as strengthen my skills in a specific area before applying]. During that time I [what you did: course, projects, practice], and I applied to roles that matched [target]. I am now more prepared than when I graduated, and I can show [project or skill].",
    detailedAnswer: [
      "Give a direct, honest reason.",
      "Explain what you accomplished in the period.",
      "Emphasise how you are better prepared now.",
    ],
    realWorldExample:
      "A graduate used the time to complete a full-stack project and practise interview questions regularly.",
    commonMistakes: [
      "Blaming the market only.",
      "Giving no evidence of progress.",
    ],
    followUps: [
      { question: "How did you decide what to study during that time?" },
    ],
    answerTips: ["Show progress with dates and outputs."],
    keyPoints: [
      "Honest reason",
      "Purposeful use of time",
      "Evidence",
      "More prepared now",
    ],
    weakAnswer: "I did not feel like working, so I waited.",
    weakAnswerWhy: [
      "It signals low motivation.",
      "It gives no reassurance.",
      "It sounds unprofessional.",
    ],
    recruiterExpects: ["Purpose", "Evidence", "Motivation"],
    answerFramework: [
      "Decision: I chose to [reason].",
      "Activity: I [what you did].",
      "Search: I applied to [target roles].",
      "Now: I can show [proof].",
    ],
    starPrompts: {
      situation: "What was your situation after finishing your degree?",
      task: "What did you decide to focus on?",
      action: "What did you do?",
      result: "What are you able to do now?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "returning-to-work-after-a-long-break",
    topic: "Returning to work",
    difficulty: "hard",
    title: "How will you adjust to returning to work after a long break?",
    keywords: ["returning to work", "readiness", "adjustment", "confidence"],
    interviewerIntent:
      "The interviewer checks readiness and whether you have a plan for getting up to speed.",
    shortAnswer:
      "I have prepared for the return by [what you did: refreshed skills, built a project, adjusted routines]. In my first weeks I will focus on learning the team's tools and ways of working and ask questions early. I am motivated to return, and I am looking forward to contributing and to rebuilding my routine.",
    detailedAnswer: [
      "Show preparation for both skills and routine.",
      "Mention learning plans and asking for support.",
      "Show enthusiasm and realistic expectations.",
    ],
    realWorldExample:
      "A returning candidate agreed a short onboarding plan with the manager and joined a refresher session on the tools.",
    commonMistakes: [
      "Appearing unsure or apologetic.",
      "Overpromising immediate full productivity.",
    ],
    followUps: [{ question: "What support would help you settle in?" }],
    answerTips: ["Prepare one concrete example of getting ready."],
    keyPoints: ["Prepared", "Learning plan", "Ask for support", "Enthusiasm"],
    weakAnswer: "I am not sure I can do it, but I will try.",
    weakAnswerWhy: [
      "It signals low confidence.",
      "It gives no plan.",
      "It worries the employer.",
    ],
    recruiterExpects: ["Readiness", "Planning", "Confidence"],
    answerFramework: [
      "Preparation: I have [prepared by].",
      "First weeks: I will [learn and ask].",
      "Support: I would value [support].",
      "Motivation: I am excited to [contribute].",
    ],
    starPrompts: {
      situation: "Recall a time you returned to something after a pause.",
      task: "What did you need to relearn?",
      action: "How did you get back up to speed?",
      result: "How did it go?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "will-you-leave-again",
    topic: "Commitment",
    difficulty: "hard",
    title: "How can we be sure you will not take another long break soon?",
    keywords: ["commitment", "reassurance", "long term", "stability"],
    interviewerIntent:
      "The interviewer wants reassurance without prying into personal matters.",
    shortAnswer:
      "I understand why you ask. The circumstances that led to the break are [resolved or managed, as true for you], and I have planned for [practical arrangements]. I chose this role carefully because [reason], and I am looking for a long-term place to grow. I am happy to talk about how I will manage my commitments.",
    detailedAnswer: [
      "Answer honestly and reassure with facts you can support.",
      "You do not have to give private details. A brief statement is enough.",
      "Show that you selected the role deliberately.",
    ],
    realWorldExample:
      "A candidate explained they had arranged care support and had chosen a role close to home.",
    commonMistakes: [
      "Making promises you cannot keep.",
      "Getting angry about the question.",
    ],
    followUps: [{ question: "What does a long-term plan look like for you?" }],
    answerTips: ["Stay calm and factual."],
    keyPoints: [
      "Honest",
      "Practical arrangements",
      "Deliberate choice",
      "Calm",
    ],
    weakAnswer:
      "It is a personal matter and I will not answer any such question.",
    weakAnswerWhy: [
      "It sounds hostile.",
      "It gives no reassurance.",
      "It ends the conversation.",
    ],
    recruiterExpects: ["Reassurance", "Honesty", "Composure"],
    answerFramework: [
      "Acknowledge: I understand the concern.",
      "Facts: The situation is [state] and I have [arrangements].",
      "Choice: I chose this role because [reason].",
      "Commitment: I want to grow here for [time].",
    ],
    starPrompts: {
      situation: "Recall a long commitment you completed.",
      task: "What did you have to maintain?",
      action: "How did you stay consistent?",
      result: "What was the outcome?",
    },
    estimatedMinutes: 3,
  },
])
