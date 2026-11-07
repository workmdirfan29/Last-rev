import { defineQuestions } from "../author"

export default defineQuestions("hr-tell-me-about-yourself", "fresher", [
  {
    slug: "tell-me-about-yourself",
    topic: "Self-introduction",
    difficulty: "easy",
    title: "Tell me about yourself.",
    keywords: [
      "introduction",
      "present past future",
      "elevator pitch",
      "self introduction",
    ],
    interviewerIntent:
      "The interviewer wants to hear how you organise your story and whether you can link your background to this role in about a minute.",
    shortAnswer:
      "I am [your current role or course]. Recently I worked on [one relevant project or responsibility], where I used [key skills]. Before that I [short background: study, earlier role or training]. I enjoy [what you like about the work], and I am looking for a role like this one where I can [what you want to contribute and learn].",
    detailedAnswer: [
      "Use a present, past, future order. Present: who you are and what you do now. Past: the one or two experiences that prepared you. Future: why this role is the next step.",
      "Keep it to about a minute. Pick facts that connect to the job description instead of listing everything on your resume.",
      "End with a forward-looking sentence so the interviewer has an easy next question to ask.",
    ],
    realWorldExample:
      "A candidate who opens with the project most similar to the job gets follow-up questions on that project, which keeps the conversation in their strongest area.",
    commonMistakes: [
      "Reading the resume line by line.",
      "Sharing personal details unrelated to the job, such as family background or age.",
    ],
    followUps: [
      { question: "Which part of what you just said are you most proud of?" },
      { question: "Why did you choose this career path?" },
    ],
    answerTips: [
      "Practise it aloud until it fits in a minute, then adjust it for each job.",
    ],
    keyPoints: [
      "Present, past, future",
      "About a minute",
      "Link to the role",
      "End with why you are here",
    ],
    weakAnswer:
      "My name is [name], I am from [city], I have two sisters and I like cricket. I studied [degree] and I am looking for a job.",
    weakAnswerWhy: [
      "It shares personal details but nothing about skills.",
      "It does not connect to the role.",
      "It ends without a reason for applying.",
    ],
    recruiterExpects: [
      "A clear, short summary",
      "Skills and experience relevant to the role",
      "Confident, structured delivery",
    ],
    answerFramework: [
      "Present: I am [role or course] and I work with [skills].",
      "Past: I built or learned [relevant experience] at [where].",
      "Strength: one thing you do well, for example [strength with evidence].",
      "Future: I am applying because [reason linked to the role].",
    ],
    starPrompts: {
      situation:
        "Pick the experience you want the interviewer to remember: where were you and what was the context?",
      task: "What were you responsible for in that experience?",
      action: "What did you personally do, in one or two steps?",
      result: "What was the outcome, and what did you learn?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "walk-me-through-your-resume",
    topic: "Self-introduction",
    difficulty: "easy",
    title: "Walk me through your resume.",
    keywords: [
      "resume walkthrough",
      "career story",
      "chronology",
      "highlights",
    ],
    interviewerIntent:
      "The interviewer checks that you understand your own history and can explain choices and progress without reading from the page.",
    shortAnswer:
      "I will start with [education or earliest relevant step] and then move forward. At [stage one] I [main responsibility and what I learned]. At [stage two] I [next step and how it built on the first]. Most recently I [current work]. Each step added [skill], which is why this role is a natural next move for me.",
    detailedAnswer: [
      "Tell it as a story with a thread, such as growing responsibility or deeper skill in one area, instead of reciting dates.",
      "Spend more time on recent and relevant items and move quickly through older ones.",
      "Be ready to go deeper on anything you mention. Only include what you can discuss in detail.",
    ],
    realWorldExample:
      "A candidate summarises each project in one sentence, then pauses so the interviewer can pick the one to explore.",
    commonMistakes: [
      "Spending equal time on every line.",
      "Mentioning tools or projects you cannot explain.",
    ],
    followUps: [
      {
        question:
          "Why did you move from your first role or project to the next?",
      },
      {
        question:
          "Which item on your resume would you like to talk about most?",
      },
    ],
    answerTips: [
      "Prepare a one-sentence summary for each resume item before the interview.",
    ],
    keyPoints: [
      "Tell a story, not a list",
      "More time on recent work",
      "Only claim what you can explain",
      "Invite follow-up questions",
    ],
    weakAnswer:
      "It is all written there. I did a course, then a project, then another project. You can read it.",
    weakAnswerWhy: [
      "It avoids the question.",
      "It shows no understanding of how the experiences connect.",
      "It sounds disinterested.",
    ],
    recruiterExpects: [
      "A logical flow",
      "Understanding of your own choices",
      "Honest highlights",
    ],
    answerFramework: [
      "Start: I began with [education or first role] where I [what you did].",
      "Middle: Next I [next step] because [reason].",
      "Recent: Now I [current work] using [skills].",
      "Close: Together these prepared me for [target role].",
    ],
    starPrompts: {
      situation: "Choose the resume item you know best: what was the setting?",
      task: "What problem or goal did you own?",
      action: "What steps did you take?",
      result: "What changed, and what did you gain from it?",
    },
    estimatedMinutes: 4,
  },
  {
    slug: "something-not-on-your-resume",
    topic: "Self-introduction",
    difficulty: "medium",
    title: "Tell me something that is not on your resume.",
    keywords: ["beyond resume", "personality", "interests", "initiative"],
    interviewerIntent:
      "The interviewer looks for a side of you the resume cannot show, such as curiosity, initiative or values, while checking that you stay professional.",
    shortAnswer:
      "Outside my [work or studies] I [activity, for example volunteer, build small tools or learn a skill]. A recent example is [specific thing you did]. It taught me [lesson that also applies to work]. It shows that I like to [quality, such as learning on my own or helping others], which I would bring to this team.",
    detailedAnswer: [
      "Choose something true that supports a quality the role needs, such as learning fast, persistence or teamwork.",
      "Tell it briefly with one concrete detail, and end by connecting it back to work.",
      "Avoid controversial topics and anything that raises questions about availability or focus.",
    ],
    realWorldExample:
      "A candidate mentions a small tool they built for a community group, which shows initiative that a resume line would not.",
    commonMistakes: [
      "Saying there is nothing else.",
      "Choosing a story that is not relevant or not appropriate for work.",
    ],
    followUps: [
      { question: "What did you learn from that?" },
      { question: "How do you balance it with your studies or job?" },
    ],
    answerTips: ["Prepare one or two stories like this in advance."],
    keyPoints: [
      "True and positive",
      "One concrete detail",
      "Connect to work",
      "Stay professional",
    ],
    weakAnswer: "There is nothing really, I only focus on my job.",
    weakAnswerWhy: [
      "It misses the chance to show personality.",
      "It can sound rigid or unprepared.",
      "It gives the interviewer nothing new.",
    ],
    recruiterExpects: [
      "Authenticity",
      "A relevant quality",
      "Clear and brief storytelling",
    ],
    answerFramework: [
      "What: Outside work I [activity].",
      "Detail: For example I [specific action or result].",
      "Lesson: It taught me [skill or value].",
      "Link: That helps me at work because [connection].",
    ],
    starPrompts: {
      situation:
        "What activity or project outside your formal work did you take on?",
      task: "What did you set out to achieve?",
      action: "What did you do, step by step?",
      result: "What did you learn or achieve?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "outside-of-work-or-college",
    topic: "Interests",
    difficulty: "easy",
    title: "What do you do outside of work or college?",
    keywords: ["hobbies", "interests", "work life balance", "personality"],
    interviewerIntent:
      "The interviewer wants to see how you stay energised and whether your interests show qualities useful at work, such as discipline or teamwork.",
    shortAnswer:
      "I enjoy [hobby or interest], which I do [how often]. It helps me [benefit, such as focus, fitness or creativity]. I also [second activity, such as learning a new skill or volunteering]. Having a routine outside work helps me stay balanced, and I bring that energy to my work.",
    detailedAnswer: [
      "Name one or two real activities and say what you get from them. Honest and specific is better than impressive and vague.",
      "Where possible, point to a transferable quality: teamwork from a sport, patience from a creative hobby, curiosity from learning.",
      "Keep it short and positive, and avoid anything the interviewer may judge negatively.",
    ],
    realWorldExample:
      "A candidate who plays team sport mentions how coordinating with teammates taught them to communicate under pressure.",
    commonMistakes: [
      "Listing five hobbies without detail.",
      "Claiming interests you cannot discuss.",
    ],
    followUps: [
      {
        question: "How do you manage time between your hobbies and your work?",
      },
    ],
    answerTips: ["Pick a hobby you can talk about with real enthusiasm."],
    keyPoints: [
      "Be genuine",
      "One or two activities",
      "Show a transferable quality",
      "Keep it brief",
    ],
    weakAnswer: "I watch TV and sleep. Nothing special.",
    weakAnswerWhy: [
      "It shows no energy or interest.",
      "It misses the chance to show a useful quality.",
      "It sounds unprepared.",
    ],
    recruiterExpects: ["Honesty", "Balance", "Positive qualities"],
    answerFramework: [
      "Activity: I enjoy [hobby] about [how often].",
      "Benefit: It gives me [what you get].",
      "Quality: It has built my [skill or trait].",
      "Link: That helps me at work by [connection].",
    ],
    starPrompts: {
      situation:
        "Describe one moment in your hobby or activity that you remember well.",
      task: "What challenge or goal did you have?",
      action: "What did you do?",
      result: "What did you learn about yourself?",
    },
    estimatedMinutes: 3,
  },
  {
    slug: "how-would-others-describe-you",
    topic: "Self-awareness",
    difficulty: "medium",
    title: "How would your friends or colleagues describe you?",
    keywords: ["self description", "feedback", "reputation", "qualities"],
    interviewerIntent:
      "The interviewer checks self-awareness and whether your self-image matches what references are likely to say.",
    shortAnswer:
      "I think they would say I am [quality one] and [quality two]. For example, [short evidence for the first quality], and when [situation] people said [paraphrased feedback you really received]. They might also say I can be [honest minor trait], and I am working on it by [small action].",
    detailedAnswer: [
      "Choose two or three qualities that fit the role and back each with a brief real example or feedback you actually received.",
      "Include a small, honest development area only if it is sincere and you have a plan, otherwise keep to strengths.",
      "Do not exaggerate. References may be contacted, and the answers should match.",
    ],
    realWorldExample:
      "A candidate says teammates describe them as dependable and supports it by recalling a time they stayed to help finish a shared task.",
    commonMistakes: [
      "Using empty words such as hardworking without evidence.",
      "Claiming feedback you never received.",
    ],
    followUps: [
      { question: "Can you give an example of that quality in action?" },
      { question: "Is there anything they might wish you did differently?" },
    ],
    answerTips: [
      "Remember real comments from teachers, teammates or managers and reuse them.",
    ],
    keyPoints: [
      "Two or three qualities",
      "Evidence for each",
      "Honest and consistent",
      "Relevant to the job",
    ],
    weakAnswer: "Everyone says I am perfect and I never make mistakes.",
    weakAnswerWhy: [
      "It sounds arrogant and unbelievable.",
      "It gives no evidence.",
      "It shows low self-awareness.",
    ],
    recruiterExpects: [
      "Self-awareness",
      "Evidence",
      "Consistency with references",
    ],
    answerFramework: [
      "Quality: People describe me as [quality].",
      "Evidence: For example [specific moment or feedback].",
      "Second quality: They also mention [quality] because [reason].",
      "Growth: I am improving [honest area] by [action].",
    ],
    starPrompts: {
      situation:
        "Recall a time someone commented on a quality of yours: what was happening?",
      task: "What were you trying to achieve then?",
      action: "What did you do that showed the quality?",
      result: "What did the other person say or what changed?",
    },
    estimatedMinutes: 3,
  },
])
