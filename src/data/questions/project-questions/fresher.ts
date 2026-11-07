import { defineQuestions, type AuthoredQuestion } from "../author"

/**
 * Project-based questions. They coach the learner to talk about THEIR OWN project, so nothing here states a fact
 * about a technology or a number. Sample answers use [bracketed placeholders] for the learner's own details.
 */
interface ProjectQuestion {
  slug: string
  topic: "Architecture" | "Ownership" | "Trade-offs" | "Challenges"
  d: "easy" | "medium" | "hard"
  title: string
  kw: string[]
  intent: string
  short: string
  detail: string[]
  ex: string
  mistakes: string[]
  follow: string[]
  tip: string
  points: string[]
  weak: string
  why: string[]
  expects: string[]
  framework: string[]
  star: [situation: string, task: string, action: string, result: string]
  check: string[]
}

const pq = (c: ProjectQuestion): AuthoredQuestion => ({
  slug: c.slug,
  topic: c.topic,
  difficulty: c.d,
  title: c.title,
  keywords: c.kw,
  interviewerIntent: c.intent,
  shortAnswer: c.short,
  detailedAnswer: c.detail,
  realWorldExample: c.ex,
  commonMistakes: c.mistakes,
  followUps: c.follow.map((question) => ({ question })),
  answerTips: [c.tip],
  keyPoints: c.points,
  weakAnswer: c.weak,
  weakAnswerWhy: c.why,
  recruiterExpects: c.expects,
  answerFramework: c.framework,
  starPrompts: {
    situation: c.star[0],
    task: c.star[1],
    action: c.star[2],
    result: c.star[3],
  },
  selfCheck: c.check,
  estimatedMinutes: 4,
})

export default defineQuestions("project-questions", "fresher", [
  /* ------------------------------- Architecture ------------------------------- */
  pq({
    slug: "explain-your-project-briefly",
    topic: "Architecture",
    d: "easy",
    title: "Can you explain your project to me in two minutes?",
    kw: ["project overview", "elevator pitch", "problem", "users", "scope"],
    intent:
      "The interviewer wants to see whether you can describe a whole project clearly, starting from the problem and not from the tools.",
    short:
      "My project is [name], built for [who uses it] to solve [the problem]. The main things a user can do are [two or three features]. I built it using [main technologies], and my part was [your role]. The part I found most interesting was [one detail], and the next thing I would improve is [one improvement].",
    detail: [
      "Start with the problem and the user, then the features, then how it is built.",
      "Keep it short enough that the interviewer can steer you to the area they want to explore.",
      "End by pointing to one part you are ready to go deeper on.",
    ],
    ex: "A candidate described a notes app by its problem first, then in one sentence each how it stored notes and how it synced, and invited questions on either.",
    mistakes: [
      "Listing technologies without saying what the project does.",
      "Talking for too long with no pause for questions.",
    ],
    follow: ["Which part of this would you like to go deeper on?"],
    tip: "Practise the two-minute version aloud until it needs no notes.",
    points: [
      "Problem and user first",
      "Features next",
      "How it is built last",
      "Invite questions",
    ],
    weak: "It is a web application. I used a few frameworks and a database. It has many pages.",
    why: [
      "It never says what problem the project solves.",
      "It lists parts without a story.",
      "It gives the interviewer nothing to ask about.",
    ],
    expects: ["A clear problem", "Your role", "Structure and brevity"],
    framework: [
      "Problem: [who has what problem].",
      "Solution: [what the project does for them].",
      "Build: [how it is put together, in one sentence].",
      "My part: [what you personally did].",
    ],
    star: [
      "What was the project for, and who was it for?",
      "What were you trying to achieve?",
      "What did you build or do?",
      "What was the outcome, and what would you add next?",
    ],
    check: [
      "Can I say what the project does without naming a technology?",
      "Does my answer fit in about two minutes?",
    ],
  }),
  pq({
    slug: "main-parts-and-how-they-connect",
    topic: "Architecture",
    d: "medium",
    title: "What are the main parts of your project and how do they talk to each other?",
    kw: ["components", "architecture", "interfaces", "data flow", "layers"],
    intent:
      "The interviewer checks that you understand the structure of what you built, not only the code you typed.",
    short:
      "My project has [number] main parts: [part one], which does [job]; [part two], which does [job]; and [part three], which does [job]. [Part one] talks to [part two] by [how they communicate], and the data moves from [source] to [destination]. I kept them separate so that [reason].",
    detail: [
      "Name each part by its job, not by its file name.",
      "Describe what passes between parts: what is sent, and what comes back.",
      "Give the reason for the separation in your own words.",
    ],
    ex: "A candidate drew three boxes, interface, service and storage, and explained what crossed each arrow.",
    mistakes: [
      "Describing folders instead of responsibilities.",
      "Not knowing what data crosses from one part to another.",
    ],
    follow: ["What would you do if one of these parts failed?"],
    tip: "Draw the parts as boxes and arrows; practise explaining each arrow.",
    points: [
      "Parts named by their job",
      "How parts communicate",
      "What data flows",
      "Reason for the split",
    ],
    weak: "It has a frontend and a backend and they are connected. The backend does the logic.",
    why: [
      "It is too general to be useful.",
      "It does not say how they are connected.",
      "It does not show your own understanding.",
    ],
    expects: [
      "Clear responsibilities",
      "Understanding of data flow",
      "Reasons for the structure",
    ],
    framework: [
      "Parts: [list of parts and the job of each].",
      "Connection: [part A] sends [what] to [part B] by [how].",
      "Reason: I separated them because [reason].",
      "Weak spot: the part I would watch most is [part] because [reason].",
    ],
    star: [
      "How was the project divided?",
      "What did each part need to do?",
      "How did you connect them?",
      "What did the structure make easier or harder?",
    ],
    check: [
      "Can I name every part by its job?",
      "Do I know what data each arrow carries?",
    ],
  }),
  pq({
    slug: "data-model-and-storage",
    topic: "Architecture",
    d: "medium",
    title: "How is the data in your project organised, and why did you organise it that way?",
    kw: ["data model", "storage", "entities", "relationships", "schema"],
    intent:
      "The interviewer wants to know whether you thought about what data you keep and how the pieces relate.",
    short:
      "The main things my project keeps are [entity one], [entity two] and [entity three]. [Entity one] is related to [entity two] because [relationship]. I stored them in [kind of storage] because [reason]. One thing I changed after starting was [change], when I realised [what you learned].",
    detail: [
      "Name the main entities and how they relate in plain words.",
      "Give one reason for the storage choice that comes from your project's needs.",
      "Mention a change you made, because it shows you tested your design against reality.",
    ],
    ex: "A candidate explained that orders belong to customers, items belong to orders, and why a copy of the item name was kept with each order.",
    mistakes: [
      "Describing tables or collections without saying what they represent.",
      "Claiming the design was perfect from the start.",
    ],
    follow: ["How would you handle a change in the shape of your data?"],
    tip: "Be ready to sketch the entities and their relationships on paper.",
    points: [
      "Entities and relationships",
      "Reason for the storage choice",
      "A change you made",
      "Honest about limits",
    ],
    weak: "I used a database and stored everything there. It worked fine.",
    why: [
      "It says nothing about what was stored.",
      "It gives no reason for the choice.",
      "It suggests no real thought about design.",
    ],
    expects: ["Clear entities", "A reason, not a habit", "Willingness to adjust"],
    framework: [
      "Entities: [the main things the project stores].",
      "Relationships: [entity A] has [relationship] with [entity B].",
      "Choice: I chose [storage] because [reason from your needs].",
      "Change: I later changed [what] because [what you learned].",
    ],
    star: [
      "What data did the project need to keep?",
      "What did you need to decide about storing it?",
      "How did you design and adjust it?",
      "What did you learn about your design?",
    ],
    check: [
      "Can I sketch my entities and how they connect?",
      "Is my reason for the storage choice about my project?",
    ],
  }),
  pq({
    slug: "follow-one-action-through-the-system",
    topic: "Architecture",
    d: "medium",
    title: "Walk me through what happens from the moment a user takes an action until they see the result.",
    kw: ["request flow", "end to end", "sequence", "user action", "response"],
    intent:
      "The interviewer checks that you can follow one action through every part of your project.",
    short:
      "Take the action [specific user action]. First, [the interface] collects [what] and sends it to [next part]. Then [that part] checks [validation] and calls [next part], which [reads or writes what]. Finally the result goes back through [path] and the user sees [what they see]. If something goes wrong at [step], the user gets [what happens].",
    detail: [
      "Choose one real action and follow it from start to finish.",
      "Name the check at each step and what happens when it fails.",
      "End with what the user sees, to close the loop.",
    ],
    ex: "A candidate followed one 'add item' click through validation, storage and the screen update, and described the error message at each stage.",
    mistakes: [
      "Skipping the error cases entirely.",
      "Jumping between parts without the order of steps.",
    ],
    follow: ["Where would you add logging to understand a failure in this flow?"],
    tip: "Pick the flow you know best and rehearse it step by step.",
    points: [
      "One concrete action",
      "Steps in order",
      "Checks and failures",
      "What the user finally sees",
    ],
    weak: "The user clicks and the app works and then the page updates.",
    why: [
      "It hides all the steps in the middle.",
      "It has no failure cases.",
      "It does not show you know the system.",
    ],
    expects: ["Correct order", "Awareness of failure", "End-to-end understanding"],
    framework: [
      "Action: the user does [action].",
      "Steps: first [step], then [step], then [step].",
      "Failure: if [step] fails, then [what happens].",
      "Result: the user finally sees [result].",
    ],
    star: [
      "Which user action will you follow?",
      "What has to happen for it to succeed?",
      "What does each part do, in order?",
      "What does the user see, including on failure?",
    ],
    check: [
      "Can I name every step in order?",
      "Do I know what happens when each step fails?",
    ],
  }),
  pq({
    slug: "why-these-technologies",
    topic: "Architecture",
    d: "medium",
    title: "Why did you choose the technologies you used for this project?",
    kw: ["technology choice", "reasons", "alternatives", "constraints", "learning goals"],
    intent:
      "The interviewer wants honest reasons for choices, including learning goals and constraints, not a pretended perfect decision.",
    short:
      "I chose [technology] for [part of the project] because [reason from your needs]. I also considered [alternative], but I preferred [technology] because [reason]. Part of my reason was [honest factor, such as wanting to learn it or the course requirement]. Looking back, I would [keep or change it] because [reason].",
    detail: [
      "Give reasons that connect to what the project needed.",
      "It is fine to say that learning goals or constraints influenced you, if you say so honestly.",
      "Show that you can judge your choice afterwards.",
    ],
    ex: "A candidate said the team already knew one tool, that it suited the problem, and that a second option was considered but needed more setup time.",
    mistakes: [
      "Saying a technology is simply the best.",
      "Claiming you compared many alternatives when you did not.",
    ],
    follow: ["What would make you change this choice?"],
    tip: "Never invent reasons. An honest, specific reason beats an impressive vague one.",
    points: [
      "Reasons from the project",
      "An alternative considered",
      "Honest factors",
      "A reflection afterwards",
    ],
    weak: "Everyone uses it, so I used it. It is the best technology.",
    why: [
      "It gives popularity as the only reason.",
      "It makes a claim it cannot support.",
      "It shows no judgement.",
    ],
    expects: ["Specific reasons", "Honesty", "Reflection"],
    framework: [
      "Choice: I used [technology] for [purpose].",
      "Reason: it fitted because [reason from your needs].",
      "Alternative: I also looked at [alternative], but [reason].",
      "Reflection: looking back, I would [keep or change] because [reason].",
    ],
    star: [
      "What did the project need at that point?",
      "What did you have to decide?",
      "How did you decide, and with whom?",
      "How did the choice work out?",
    ],
    check: [
      "Is each reason true for my project?",
      "Can I say what I would change?",
    ],
  }),
  pq({
    slug: "draw-your-project-on-a-whiteboard",
    topic: "Architecture",
    d: "hard",
    title: "If I gave you a whiteboard, how would you draw your project's design?",
    kw: ["design diagram", "whiteboard", "boxes and arrows", "communication", "abstraction"],
    intent:
      "The interviewer checks that you can communicate a design visually and at the right level of detail.",
    short:
      "I would start with the user at one side and draw the main parts as boxes: [part], [part] and [part]. Then I would add arrows for the main flows, labelling each with [what it carries]. I would mark where data is stored and where [important concern, such as sign-in] happens. Then I would ask which area you want in more detail, and zoom in on that.",
    detail: [
      "Start at a high level and add detail only where asked.",
      "Label arrows with what travels along them.",
      "Say what you left out and why.",
    ],
    ex: "A candidate drew four boxes, labelled the arrows, then asked which flow to expand.",
    mistakes: [
      "Starting with small details and running out of space.",
      "Drawing without explaining aloud.",
    ],
    follow: ["Which box on this diagram worries you most, and why?"],
    tip: "Practise drawing your project on paper in under two minutes.",
    points: [
      "High level first",
      "Labelled arrows",
      "Mark storage and key concerns",
      "Zoom where asked",
    ],
    weak: "I would just draw some boxes and lines. It is hard to draw.",
    why: [
      "It shows no preparation.",
      "It avoids the question.",
      "It gives no structure.",
    ],
    expects: ["A clear layout", "Talking while drawing", "Flexibility"],
    framework: [
      "Start: the user and the main parts are [parts].",
      "Flows: [part A] to [part B] carries [what].",
      "Storage: data is kept in [where].",
      "Detail: I would then zoom into [area] to show [what].",
    ],
    star: [
      "What does the whole project look like at a high level?",
      "What must the diagram communicate?",
      "How would you draw and explain it?",
      "What would you add if asked?",
    ],
    check: [
      "Can I draw my project from memory?",
      "Do my arrows say what travels along them?",
    ],
  }),
  pq({
    slug: "running-outside-your-own-computer",
    topic: "Architecture",
    d: "medium",
    title: "How does your project run outside your own computer?",
    kw: ["deployment", "environments", "configuration", "hosting", "setup"],
    intent:
      "The interviewer wants to know whether you have thought about running software for other people, or at least about what it would take.",
    short:
      "On my own computer I run [how you run it locally]. For other people, I [deployed it to / would deploy it to] [where]. Settings that differ between environments, such as [examples], are kept in [where] and not in the code. If I had to set it up again, the steps would be [short list]. What I have not done yet is [honest gap].",
    detail: [
      "If you did not deploy it, say what you would do and what you would need to learn.",
      "Mention how settings and secrets are kept out of the code.",
      "Describe how someone else could set up your project.",
    ],
    ex: "A candidate who had only run the project locally described the steps they would take to host it, and what they would change to keep passwords out of the code.",
    mistakes: [
      "Claiming a deployment that you did not do.",
      "Keeping passwords or keys in the source code.",
    ],
    follow: ["How would a new teammate set up your project?"],
    tip: "Be honest about what you have and have not deployed; interviewers respect it.",
    points: [
      "Local run and other environments",
      "Settings kept outside code",
      "Repeatable steps",
      "Honest about gaps",
    ],
    weak: "It runs fine on my laptop. I have not thought about anything else.",
    why: [
      "It shows no awareness of real use.",
      "It gives the interviewer nothing to build on.",
      "It sounds unprepared.",
    ],
    expects: ["Honesty", "Awareness of configuration", "Repeatable setup"],
    framework: [
      "Local: I run it with [steps].",
      "Elsewhere: I [did / would] host it on [where] by [steps].",
      "Settings: [which settings] are kept in [where], not in code.",
      "Gap: what I have not done is [gap], and I would learn it by [plan].",
    ],
    star: [
      "Where did your project need to run?",
      "What did you need to set up?",
      "What steps did you take, or plan?",
      "What worked, and what is still open?",
    ],
    check: [
      "Is every deployment claim true?",
      "Could I list the setup steps for a new person?",
    ],
  }),

  /* -------------------------------- Ownership --------------------------------- */
  pq({
    slug: "what-exactly-was-your-part",
    topic: "Ownership",
    d: "easy",
    title: "What exactly was your part in this project?",
    kw: ["role", "responsibility", "contribution", "team project", "ownership"],
    intent:
      "The interviewer separates what you did from what the team did, and listens for specifics.",
    short:
      "The project was done by [team size / just me]. I was responsible for [areas]. Concretely, I [specific things you built or decided]. Others worked on [what they did], and I coordinated with them on [interface or task]. The part I know best is [area], and I can go into detail on it.",
    detail: [
      "Say 'I' for what you did and 'we' for what the team did, and keep them separate.",
      "Be specific about features, not just areas.",
      "Mention how your part connected to others'.",
    ],
    ex: "A candidate named the three features they built end to end and the two they only reviewed.",
    mistakes: [
      "Saying 'we' for everything and hiding your own work.",
      "Claiming credit for work that was done by others.",
    ],
    follow: ["Which part of the code could you explain line by line?"],
    tip: "Know your part well enough to explain any piece of it in detail.",
    points: [
      "Clear split of I and we",
      "Specific features",
      "Connection to others",
      "Truthful",
    ],
    weak: "We built the whole thing together. I did a bit of everything.",
    why: [
      "It is vague about your contribution.",
      "It gives no detail to test.",
      "It makes the interviewer unsure what you did.",
    ],
    expects: ["Specific contribution", "Honesty", "Depth in your area"],
    framework: [
      "Team: the project was by [team or solo].",
      "Mine: I built [specific parts].",
      "Others: [teammates] worked on [parts], and I worked with them on [interface].",
      "Depth: I can explain [part] in detail.",
    ],
    star: [
      "How was the work divided?",
      "What were you responsible for?",
      "What did you personally build or decide?",
      "What came out of your part?",
    ],
    check: [
      "Can I explain everything I claim to have built?",
      "Did I say 'I' only for my own work?",
    ],
  }),
  pq({
    slug: "part-you-are-proudest-of",
    topic: "Ownership",
    d: "easy",
    title: "Which part of the project are you most proud of, and why?",
    kw: ["pride", "quality", "craft", "impact", "motivation"],
    intent:
      "The interviewer learns what you value in your work and whether you can explain quality in concrete terms.",
    short:
      "I am proudest of [specific part]. It mattered because [why it mattered to users or the project]. What made it hard was [challenge], and I handled it by [approach]. I am proud of it because [honest reason, such as how it works or what it taught you], and I would still improve [something].",
    detail: [
      "Pick something you can explain in depth, not the biggest-sounding feature.",
      "Say what makes it good in concrete terms.",
      "Show humility by naming one thing you would still improve.",
    ],
    ex: "A candidate chose a small error-handling feature because it made the app understandable when something went wrong.",
    mistakes: [
      "Choosing something you cannot explain in detail.",
      "Saying nothing could be improved.",
    ],
    follow: ["What would you improve in it if you had more time?"],
    tip: "Choose a part where you can talk about both the problem and the details.",
    points: [
      "A specific part",
      "Why it mattered",
      "How you handled the difficulty",
      "One improvement left",
    ],
    weak: "All of it. It is all very good and I am proud of everything.",
    why: [
      "It avoids choosing.",
      "It gives no detail.",
      "It sounds like boasting.",
    ],
    expects: ["Specificity", "Self-awareness", "Depth"],
    framework: [
      "Part: I am proudest of [part].",
      "Why it mattered: [reason].",
      "How I did it: I [approach] because [reason].",
      "Still to improve: [improvement].",
    ],
    star: [
      "What was the part and where did it fit?",
      "What did it need to do well?",
      "What did you do to make it good?",
      "What did you learn or still want to improve?",
    ],
    check: [
      "Can I explain this part in depth?",
      "Do I name something I would still improve?",
    ],
  }),
  pq({
    slug: "working-with-teammates",
    topic: "Ownership",
    d: "medium",
    title: "How did you work with other people on the project?",
    kw: ["collaboration", "communication", "version control", "reviews", "coordination"],
    intent:
      "The interviewer wants to know how you coordinate work, share code and handle differences.",
    short:
      "We organised the work by [how tasks were split and tracked]. We shared code through [how], and before merging we [reviewed or tested]. When two of us changed the same area, we [how you resolved it]. I kept others updated by [communication habit]. What I would do differently is [improvement].",
    detail: [
      "Describe how tasks were split and tracked, even if it was simple.",
      "Explain how changes were shared and checked.",
      "Say how you handled overlaps or disagreements.",
    ],
    ex: "A candidate described splitting work by feature, reviewing each other's changes, and agreeing an interface before building both sides.",
    mistakes: [
      "Saying there were never any problems.",
      "Not explaining how work was combined.",
    ],
    follow: ["Tell me about a time two people's changes conflicted."],
    tip: "If the project was solo, describe how you would have worked with others and how you kept your own work organised.",
    points: [
      "Task split and tracking",
      "How code was shared and checked",
      "Handling overlaps",
      "Something to improve",
    ],
    weak: "We just worked together and it was fine. We talked when needed.",
    why: [
      "It gives no real process.",
      "It does not show how work was combined.",
      "It suggests no reflection.",
    ],
    expects: ["A real process", "Communication", "Reflection"],
    framework: [
      "Split: we divided work by [method] and tracked it in [where].",
      "Sharing: changes were combined by [how], checked by [how].",
      "Overlap: when [situation], we [resolution].",
      "Improvement: next time I would [improvement].",
    ],
    star: [
      "How big was the team and what was the work?",
      "What did you need to coordinate?",
      "What did you do to keep work in step?",
      "How well did it work, and what would you change?",
    ],
    check: [
      "Is my description of the process true?",
      "Do I have one thing I would improve?",
    ],
  }),
  pq({
    slug: "a-decision-you-made-yourself",
    topic: "Ownership",
    d: "medium",
    title: "Tell me about a decision you made on your own in this project.",
    kw: ["decision making", "judgement", "independence", "reasoning", "outcome"],
    intent:
      "The interviewer assesses judgement: whether you can decide, explain the reasoning and accept the outcome.",
    short:
      "In [situation], I had to decide [decision]. The options were [option one] and [option two]. I decided on [choice] because [reason], after checking [what you checked or whom you asked]. The result was [outcome], and what I learned was [lesson].",
    detail: [
      "Pick a decision with real options, not an obvious one.",
      "Explain how you gathered information before deciding.",
      "Describe the outcome honestly, including if it was not ideal.",
    ],
    ex: "A candidate chose between two ways to organise a screen, tried both quickly, and kept the simpler one.",
    mistakes: [
      "Choosing a decision where only one option was possible.",
      "Hiding the outcome when it was imperfect.",
    ],
    follow: ["Would you make the same decision again?"],
    tip: "Choose a decision where you can describe the options and your thinking.",
    points: [
      "A real choice",
      "Options and reasoning",
      "How you checked",
      "Outcome and lesson",
    ],
    weak: "I decided to use the best option. It worked out well.",
    why: [
      "It names no options.",
      "It explains no reasoning.",
      "It claims success without detail.",
    ],
    expects: ["Reasoning", "Honesty about results", "Learning"],
    framework: [
      "Situation: I had to decide [decision].",
      "Options: [option one] or [option two].",
      "Choice: I chose [choice] because [reason], after [what you checked].",
      "Result: [outcome], and I learned [lesson].",
    ],
    star: [
      "What was the situation that needed a decision?",
      "What did you have to decide, and by when?",
      "How did you weigh the options?",
      "What happened, and what did you learn?",
    ],
    check: [
      "Did I name at least two real options?",
      "Is the outcome described honestly?",
    ],
  }),
  pq({
    slug: "what-you-had-to-learn",
    topic: "Ownership",
    d: "easy",
    title: "What did you have to learn to build this project, and how did you learn it?",
    kw: ["learning", "self-study", "documentation", "growth", "resourcefulness"],
    intent:
      "The interviewer checks how you learn something new and whether you take ownership of gaps in your knowledge.",
    short:
      "To build [feature], I had to learn [topic]. I started with [official documentation or course], then built a small test version of [what], and asked [person or community] when I got stuck on [issue]. After that I used it in the project to [what]. Now I can [what you can do], and the next gap I want to close is [gap].",
    detail: [
      "Show a repeatable method: read, try something small, ask, apply.",
      "Mention the reliable sources you use.",
      "Admit what you still do not know.",
    ],
    ex: "A candidate built a tiny practice version of a feature before adding it to the project.",
    mistakes: [
      "Saying you already knew everything.",
      "Naming no method, only 'I searched online'.",
    ],
    follow: ["What is the next thing you want to learn?"],
    tip: "Prefer official documentation as the source you mention first.",
    points: [
      "Something you really learned",
      "A method",
      "Reliable sources",
      "Next gap",
    ],
    weak: "I learned everything from videos and just copied what worked.",
    why: [
      "It shows copying without understanding.",
      "It names no method.",
      "It shows no curiosity.",
    ],
    expects: ["A method for learning", "Honesty about gaps", "Initiative"],
    framework: [
      "Gap: I did not know [topic] and needed it for [feature].",
      "Method: I read [source], tried [small experiment], and asked [who].",
      "Use: I then applied it to [part of the project].",
      "Next: I still want to learn [topic].",
    ],
    star: [
      "What did the project need that you did not know?",
      "What did you have to learn?",
      "How did you learn it?",
      "What can you do now?",
    ],
    check: [
      "Can I explain what I learned without notes?",
      "Do I name a real next gap?",
    ],
  }),
  pq({
    slug: "feedback-on-your-work",
    topic: "Ownership",
    d: "medium",
    title: "How did you handle feedback or criticism of your work on the project?",
    kw: ["feedback", "code review", "criticism", "improvement", "humility"],
    intent:
      "The interviewer wants to see that you accept feedback, separate it from ego and act on it.",
    short:
      "When [person] reviewed [my work] and pointed out [feedback], I first made sure I understood it by [how]. I agreed with [part] and explained my view on [part], and we settled on [outcome]. I changed [what], and afterwards I [habit I adopted]. It made the work better because [reason].",
    detail: [
      "Show that you listened first and asked questions.",
      "It is fine to disagree politely, with reasons.",
      "Describe what you changed in the work and in your habits.",
    ],
    ex: "A candidate received comments about unclear names, renamed things, and started reading their own changes before sharing them.",
    mistakes: [
      "Saying you never get criticism.",
      "Describing feedback as unfair without examining it.",
    ],
    follow: ["Have you ever disagreed with a review comment?"],
    tip: "Choose real feedback you took on board, and say what changed afterwards.",
    points: [
      "Listen and clarify",
      "Respectful disagreement",
      "A concrete change",
      "A lasting habit",
    ],
    weak: "I do not get much feedback because my code works. If someone criticises it, I explain why they are wrong.",
    why: [
      "It rejects feedback.",
      "It shows defensiveness.",
      "It shows no growth.",
    ],
    expects: ["Openness", "Reasoned discussion", "Improvement"],
    framework: [
      "Feedback: [person] told me [feedback] about [work].",
      "Understanding: I made sure I understood by [how].",
      "Action: I changed [what], and we agreed on [outcome].",
      "Habit: since then I [habit].",
    ],
    star: [
      "What was the work and who reviewed it?",
      "What did the feedback ask you to change?",
      "How did you respond?",
      "What changed in the work and in you?",
    ],
    check: [
      "Is my example real feedback I received?",
      "Do I name a habit that changed?",
    ],
  }),
  pq({
    slug: "if-you-owned-the-next-release",
    topic: "Ownership",
    d: "hard",
    title: "If you owned the next version of this project, what would you do first?",
    kw: ["prioritisation", "roadmap", "ownership", "improvement", "planning"],
    intent:
      "The interviewer checks that you can see weaknesses in your own work and prioritise.",
    short:
      "First I would look at what hurts users or the project most, which I think is [issue], and fix that before adding anything new. Then I would [second priority], because [reason]. I would leave [lower priority] for later. To decide, I would [how you would find evidence, such as asking users or checking where it fails].",
    detail: [
      "Name real weaknesses you already know about.",
      "Prioritise by impact on users and risk, and say why.",
      "Explain how you would confirm your priorities with evidence.",
    ],
    ex: "A candidate said the first step would be better error handling, then tests, then new features, and explained the order.",
    mistakes: [
      "Listing only new features.",
      "Claiming the project needs no changes.",
    ],
    follow: ["How would you know the change helped?"],
    tip: "Show that you can be honest about weaknesses and still sound constructive.",
    points: [
      "Known weaknesses",
      "Priority and reason",
      "Defer lower priorities",
      "Evidence for decisions",
    ],
    weak: "I would add many new features to make it bigger and better.",
    why: [
      "It ignores existing problems.",
      "It gives no prioritisation.",
      "It shows no evidence-based thinking.",
    ],
    expects: ["Honest self-assessment", "Prioritisation", "Practical thinking"],
    framework: [
      "Problem first: the biggest weakness is [weakness].",
      "Next: then I would [action] because [reason].",
      "Later: I would defer [item] because [reason].",
      "Evidence: I would confirm by [how].",
    ],
    star: [
      "What state is the project in now?",
      "What would you be responsible for?",
      "What would you do, in order?",
      "How would you know it worked?",
    ],
    check: [
      "Are the weaknesses I name real?",
      "Can I defend my order of priorities?",
    ],
  }),

  /* -------------------------------- Trade-offs -------------------------------- */
  pq({
    slug: "a-trade-off-you-made",
    topic: "Trade-offs",
    d: "medium",
    title: "Describe a trade-off you made while building this project.",
    kw: ["trade-off", "compromise", "constraints", "priorities", "reasoning"],
    intent:
      "The interviewer wants to see that you understand that choices have costs and can explain which cost you accepted.",
    short:
      "I had to choose between [benefit A] and [benefit B]. I chose [A] because [reason from the project's needs], and the cost was [what you gave up]. I reduced the cost by [mitigation]. If the situation changed to [condition], I would choose differently.",
    detail: [
      "State both sides of the trade-off clearly.",
      "Explain why one side mattered more for this project.",
      "Say what you gave up, and how you limited the damage.",
    ],
    ex: "A candidate chose a simpler design that was easier to change over one that handled more cases, and wrote down the cases it did not handle.",
    mistakes: [
      "Claiming your choice had no downside.",
      "Describing a trade-off without saying what was given up.",
    ],
    follow: ["When would you reverse that choice?"],
    tip: "Always name the cost you accepted; it is what makes it a trade-off.",
    points: [
      "Two competing benefits",
      "Reason for the choice",
      "The cost accepted",
      "When you would reverse it",
    ],
    weak: "I picked the best way. There were no downsides to it.",
    why: [
      "It denies that there was a trade-off.",
      "It shows no analysis.",
      "It cannot be tested with a follow-up.",
    ],
    expects: ["Both sides named", "Reasoning", "Acceptance of costs"],
    framework: [
      "Tension: I had to choose between [A] and [B].",
      "Choice: I chose [A] because [reason].",
      "Cost: I gave up [cost], and limited it by [mitigation].",
      "Revisit: I would reconsider if [condition].",
    ],
    star: [
      "What were you building when the choice came up?",
      "What were the two competing needs?",
      "What did you choose and what did you do about the cost?",
      "What happened, and would you choose again?",
    ],
    check: [
      "Did I say what I gave up?",
      "Do I know when I would change the choice?",
    ],
  }),
  pq({
    slug: "what-you-left-out",
    topic: "Trade-offs",
    d: "medium",
    title: "How did you decide what to leave out of the project?",
    kw: ["scope", "prioritisation", "minimum", "deadline", "cutting features"],
    intent:
      "The interviewer checks that you can control scope and make practical choices under limits.",
    short:
      "I started with a list of [features] and ranked them by how much users need them and how hard they are to build. I kept [must-have items] and left out [items] because [reason]. I made sure the project worked end to end first. I wrote down [what was left out] so it could be added later, and I would build [item] next.",
    detail: [
      "Show a method for deciding, such as need versus effort.",
      "Make sure the core worked before extras.",
      "Keep a record of what was deferred.",
    ],
    ex: "A candidate listed all ideas, circled the few needed for a working version, and kept the rest in a notes file.",
    mistakes: [
      "Saying you included everything.",
      "Leaving out something essential and not noticing.",
    ],
    follow: ["What was the hardest thing to cut?"],
    tip: "Describe the method as well as the result.",
    points: [
      "Rank by need and effort",
      "Core first",
      "Record deferred items",
      "Next step",
    ],
    weak: "I did everything I wanted to do and nothing was left out.",
    why: [
      "It is not credible for a real project.",
      "It shows no prioritisation.",
      "It suggests no limits were considered.",
    ],
    expects: ["A method for prioritising", "Realism", "Focus"],
    framework: [
      "Ideas: I listed [features].",
      "Ranking: I ranked them by [criteria].",
      "Cut: I left out [items] because [reason].",
      "Next: I recorded them and would do [item] next.",
    ],
    star: [
      "What did you want to build, and what limits did you have?",
      "What had to be decided?",
      "How did you rank and choose?",
      "What did you ship, and what remained?",
    ],
    check: [
      "Is my method clear enough to repeat?",
      "Can I name something I really left out?",
    ],
  }),
  pq({
    slug: "alternatives-you-considered",
    topic: "Trade-offs",
    d: "medium",
    title: "What other approaches did you consider for the main part of the project, and why did you not use them?",
    kw: ["alternatives", "options", "comparison", "evaluation", "decision"],
    intent:
      "The interviewer wants to see whether you explored options before settling on one.",
    short:
      "For [part], I considered [option one], [option two] and the approach I used, [chosen option]. [Option one] was attractive because [benefit] but it would have cost [cost]. [Option two] [reason it was not chosen]. I chose [chosen option] because it best matched [need]. I would reconsider if [condition].",
    detail: [
      "Describe each option fairly, with its strength.",
      "Compare using the needs of the project.",
      "Be honest if you did not explore very many.",
    ],
    ex: "A candidate listed three ways to store data and compared them on setup effort and fit.",
    mistakes: [
      "Naming alternatives and dismissing them without reasons.",
      "Inventing a long comparison you did not do.",
    ],
    follow: ["What would change your mind?"],
    tip: "Two honest alternatives are better than five invented ones.",
    points: [
      "Fair description of options",
      "Compared against needs",
      "Reason for the chosen one",
      "Condition to reconsider",
    ],
    weak: "There was no other way to do it, so I just did it.",
    why: [
      "It shows no exploration.",
      "It is rarely true.",
      "It leaves nothing to discuss.",
    ],
    expects: ["Fair comparison", "Honesty", "Reasoning"],
    framework: [
      "Options: [option one], [option two], and [chosen option].",
      "Strengths: [option one] offered [benefit].",
      "Reason: I chose [chosen] because [need].",
      "Reconsider: I would look again if [condition].",
    ],
    star: [
      "What part of the project needed a solution?",
      "What were the requirements?",
      "What options did you look at, and how did you compare them?",
      "What did you pick, and was it right?",
    ],
    check: [
      "Did I really consider each option I name?",
      "Are my reasons about the needs of the project?",
    ],
  }),
  pq({
    slug: "simple-versus-flexible",
    topic: "Trade-offs",
    d: "hard",
    title: "Where did you choose a simple solution over a more flexible one, or the other way round?",
    kw: ["simplicity", "flexibility", "over-engineering", "maintainability", "future needs"],
    intent:
      "The interviewer checks your sense of when extra flexibility is worth its cost.",
    short:
      "In [part], I chose a [simple / flexible] approach. I did that because [reason: current need, likely change, or time]. The cost was [cost]. For example, I [what you did] and [what you did not do]. If [future condition] happens, I will [what you would change].",
    detail: [
      "Simple code is easier to understand, and flexible code costs more to build; state this in terms of your project.",
      "Base the choice on a need you actually have.",
      "Say what would make you revisit it.",
    ],
    ex: "A candidate kept one fixed list instead of a configurable system because only one list was needed, and noted when that would change.",
    mistakes: [
      "Building for needs that never appeared.",
      "Choosing simple without noticing a known change coming.",
    ],
    follow: ["How do you tell the difference between a real need and a guess?"],
    tip: "Tie each choice to a real, current need and mention the condition for revisiting it.",
    points: [
      "Based on a real need",
      "State the cost",
      "What you did and did not build",
      "Condition to revisit",
    ],
    weak: "I always make everything as flexible as possible so I never have to change it.",
    why: [
      "It ignores the cost of flexibility.",
      "It guesses future needs.",
      "It shows no judgement.",
    ],
    expects: ["Judgement", "Awareness of cost", "Practicality"],
    framework: [
      "Choice: in [part] I chose a [simple / flexible] design.",
      "Reason: because [current need].",
      "Cost: it meant [cost].",
      "Revisit: I would change it if [condition].",
    ],
    star: [
      "What was the part and what was needed?",
      "What did you have to decide about its design?",
      "What did you build or leave out?",
      "What did it cost, and did it hold up?",
    ],
    check: [
      "Is the need I describe a real one?",
      "Do I know what would make me redesign it?",
    ],
  }),
  pq({
    slug: "speed-versus-clarity",
    topic: "Trade-offs",
    d: "medium",
    title: "Did you ever choose between making something faster and keeping it easy to understand?",
    kw: ["performance", "readability", "optimisation", "measurement", "maintainability"],
    intent:
      "The interviewer wants to see that you measure before optimising and that you value maintainable code.",
    short:
      "In [part], I noticed [slow behaviour or concern]. Before changing anything, I [measured or observed how]. I found that [finding]. I chose to [optimise / leave it clear] because [reason]. If I optimised, I kept it understandable by [how]. I would only optimise further if [condition].",
    detail: [
      "Describe how you found out whether there was a real problem.",
      "Explain why the speed gain was or was not worth the added complexity.",
      "Keep the optimised code documented.",
    ],
    ex: "A candidate timed a slow page, found the real delay was one step, and fixed only that step.",
    mistakes: [
      "Optimising without measuring.",
      "Making code hard to read for a gain nobody would notice.",
    ],
    follow: ["How did you measure it?"],
    tip: "Describe how you measured; it is the strongest part of this answer.",
    points: [
      "Measure first",
      "Compare gain and complexity",
      "Keep it understandable",
      "Condition to optimise more",
    ],
    weak: "I made everything as fast as possible. Readability is not important.",
    why: [
      "It values speed over everything.",
      "It shows no measurement.",
      "It ignores maintainers.",
    ],
    expects: ["Evidence-based thinking", "Balance", "Care for maintainability"],
    framework: [
      "Concern: in [part] I noticed [concern].",
      "Measure: I checked it by [method] and found [finding].",
      "Choice: I decided to [action] because [reason].",
      "Clarity: I kept it understandable by [how].",
    ],
    star: [
      "What seemed slow or complicated?",
      "What did you need to find out?",
      "What did you measure and change?",
      "What was the effect on speed and on clarity?",
    ],
    check: [
      "Can I describe how I measured?",
      "Is the code still understandable?",
    ],
  }),
  pq({
    slug: "time-versus-quality",
    topic: "Trade-offs",
    d: "medium",
    title: "How did you balance time pressure against quality in the project?",
    kw: ["deadline", "quality", "technical debt", "testing", "prioritisation"],
    intent:
      "The interviewer wants to see how you act when time is short without hiding problems.",
    short:
      "With [deadline], I protected what mattered most: [critical parts such as correctness of main flow]. I accepted [shortcut] in [less critical part] and wrote it down as [note or task] so it would not be forgotten. I told [person] about the shortcut and planned to fix it by [when]. Afterwards, I [what you did to repay it].",
    detail: [
      "Decide in advance which parts must not be rushed.",
      "Be open about shortcuts instead of hiding them.",
      "Plan to repay the shortcut.",
    ],
    ex: "A candidate kept the main flow carefully tested, left a plain screen unpolished, and recorded it as a task.",
    mistakes: [
      "Cutting corners on the most critical part.",
      "Hiding a shortcut from the team.",
    ],
    follow: ["What happens to shortcuts you never repay?"],
    tip: "Show that you tell people about shortcuts and plan to fix them.",
    points: [
      "Protect the critical parts",
      "Accept a visible shortcut",
      "Record and communicate it",
      "Repay it later",
    ],
    weak: "I just worked faster and skipped the checks to finish on time.",
    why: [
      "It sacrifices checks blindly.",
      "It hides risk.",
      "It shows no plan to recover.",
    ],
    expects: ["Prioritisation", "Transparency", "Responsibility"],
    framework: [
      "Pressure: the deadline was [deadline].",
      "Protected: I did not rush [critical parts].",
      "Shortcut: I accepted [shortcut] and recorded it as [where].",
      "Repay: I told [person] and fixed it by [when].",
    ],
    star: [
      "What was the deadline and what remained?",
      "What did you have to protect?",
      "What did you rush, and what did you do about it?",
      "What happened to the shortcut afterwards?",
    ],
    check: [
      "Did I protect the parts that matter most?",
      "Did I record and share the shortcut?",
    ],
  }),
  pq({
    slug: "what-breaks-with-more-use",
    topic: "Trade-offs",
    d: "hard",
    title: "What would break first if many more people started using your project?",
    kw: ["scalability", "bottleneck", "limits", "capacity", "growth"],
    intent:
      "The interviewer checks that you can reason about limits without needing exact numbers.",
    short:
      "The first thing I expect to struggle is [part], because [reason, such as it does work for every request or keeps everything in one place]. I have not tested this at scale, so I would first [measure or simulate how]. To relieve it I could [option], which would cost [cost]. After that I would watch [next part].",
    detail: [
      "Be honest if you have not tested at scale.",
      "Reason from how your design works, not from invented numbers.",
      "Suggest a way to find out and a way to relieve the problem.",
    ],
    ex: "A candidate pointed to one step that repeated work on every request and described how to measure it before changing anything.",
    mistakes: [
      "Inventing figures for load or speed.",
      "Saying nothing would ever break.",
    ],
    follow: ["How would you test that guess?"],
    tip: "Reason from the design and say how you would check, rather than quoting numbers you do not have.",
    points: [
      "Likely bottleneck and why",
      "Honest about testing",
      "How to measure",
      "Option and its cost",
    ],
    weak: "It would handle a million users with no problem because it is well written.",
    why: [
      "It makes an unsupported claim.",
      "It shows no analysis.",
      "It sounds untruthful.",
    ],
    expects: ["Reasoned guess", "Honesty about limits", "A way to check"],
    framework: [
      "Guess: [part] would struggle first because [reason from the design].",
      "Honesty: I have [not] tested this.",
      "Check: I would find out by [method].",
      "Relief: I could [option], at the cost of [cost].",
    ],
    star: [
      "How is the project used today?",
      "What if use grew a lot?",
      "How would you find the limit and what would you change?",
      "What would you expect to improve?",
    ],
    check: [
      "Did I avoid inventing any figures?",
      "Can I explain why the weak point is weak?",
    ],
  }),

  /* -------------------------------- Challenges -------------------------------- */
  pq({
    slug: "hardest-problem-you-solved",
    topic: "Challenges",
    d: "medium",
    title: "What was the hardest problem you solved in this project?",
    kw: ["problem solving", "difficulty", "persistence", "approach", "learning"],
    intent:
      "The interviewer wants to see how you tackle a difficult problem step by step.",
    short:
      "The hardest problem was [problem], which showed up as [symptom]. At first I [first attempt] but that did not work because [reason]. I narrowed it down by [method], found that [cause], and fixed it by [fix]. I checked the fix by [how]. What I took from it is [lesson].",
    detail: [
      "Describe the symptom before the cause.",
      "Show the order of your investigation, including dead ends.",
      "Close with how you verified the fix and what it taught you.",
    ],
    ex: "A candidate described a screen that sometimes showed old data, how they narrowed it to one step, and how they proved it was fixed.",
    mistakes: [
      "Describing only the solution and not the process.",
      "Choosing a problem that was not actually hard.",
    ],
    follow: ["What would you do differently if it happened again?"],
    tip: "Include a dead end; it makes the story honest and shows how you think.",
    points: [
      "Symptom first",
      "Method and dead ends",
      "Cause and fix",
      "How you verified",
    ],
    weak: "There were no big problems. I solved everything easily.",
    why: [
      "It is not believable.",
      "It gives no story to discuss.",
      "It shows no reflection.",
    ],
    expects: ["A real problem", "A method", "Learning"],
    framework: [
      "Problem: [symptom] in [part].",
      "Approach: I first tried [attempt], then narrowed it by [method].",
      "Cause and fix: the cause was [cause] and I fixed it with [fix].",
      "Check and lesson: I verified by [how] and learned [lesson].",
    ],
    star: [
      "What was the situation and what went wrong?",
      "What did you have to solve?",
      "What steps did you take?",
      "What was the result and the lesson?",
    ],
    check: [
      "Can I describe the dead ends as well as the fix?",
      "Did I explain how I verified it?",
    ],
  }),
  pq({
    slug: "how-you-debug-a-problem",
    topic: "Challenges",
    d: "medium",
    title: "Tell me how you track down a bug you do not understand.",
    kw: ["debugging", "reproduction", "hypothesis", "isolation", "logging"],
    intent:
      "The interviewer checks that your debugging is systematic, not guesswork.",
    short:
      "First I try to reproduce the bug reliably and write down the exact steps. Then I narrow where it happens by [method, such as checking each step's input and output]. I form a guess about the cause and test it with a small change or a log, one thing at a time. When I find it, I fix it, add a check so it cannot silently return, and note what I learned. An example was [your example].",
    detail: [
      "Reproduction comes before any fixing.",
      "Change one thing at a time so you know what mattered.",
      "Keep a record of what you tried.",
    ],
    ex: "A candidate wrote the steps to reproduce a bug, removed parts until it disappeared, and found the cause in the last part removed.",
    mistakes: [
      "Changing many things at once.",
      "Fixing the symptom without finding the cause.",
    ],
    follow: ["What do you do if you cannot reproduce it?"],
    tip: "Use a real example from your project to illustrate the steps.",
    points: [
      "Reproduce first",
      "Narrow down",
      "One change at a time",
      "Prevent recurrence",
    ],
    weak: "I change things until the error goes away.",
    why: [
      "It is guesswork.",
      "It may leave the real cause unfixed.",
      "It teaches nothing.",
    ],
    expects: ["A systematic method", "Patience", "Verification"],
    framework: [
      "Reproduce: I note the steps to trigger [bug].",
      "Narrow: I check [where] by [method].",
      "Test: I try one change, [change], and watch [what].",
      "Fix and prevent: I fix [cause] and add [check] to stop it returning.",
    ],
    star: [
      "What bug did you face?",
      "What did you need to find out?",
      "What did you try, in order?",
      "What was the cause, and how did you make sure it stayed fixed?",
    ],
    check: [
      "Do I start with reproduction?",
      "Do I have a real example to go with the method?",
    ],
  }),
  pq({
    slug: "a-bug-found-late",
    topic: "Challenges",
    d: "hard",
    title: "Tell me about a bug that was found late, after you thought the work was finished.",
    kw: ["late bug", "accountability", "testing", "root cause", "prevention"],
    intent:
      "The interviewer wants to see how you take responsibility and improve your process after a miss.",
    short:
      "After I thought [feature] was done, [who] found that [problem]. I did not argue; I first reproduced it and told [person] what I knew. The cause was [cause], which my checks missed because [reason]. I fixed it and added [check or habit] so it would be caught earlier. What I do differently now is [change].",
    detail: [
      "Own the mistake without excuses.",
      "Explain why your process missed it.",
      "Describe one concrete change that came from it.",
    ],
    ex: "A candidate found that an empty input broke a screen, fixed it, and began testing empty and unusual inputs for every feature.",
    mistakes: [
      "Blaming someone else.",
      "Describing the fix but no change in how you work.",
    ],
    follow: ["How do you check unusual cases now?"],
    tip: "Make the lesson specific: a check, a habit or a question you now ask.",
    points: [
      "Own it",
      "Reproduce and communicate",
      "Why it was missed",
      "A lasting change",
    ],
    weak: "That has never happened to me because I test everything carefully.",
    why: [
      "It is not credible.",
      "It avoids showing how you handle mistakes.",
      "It gives no story.",
    ],
    expects: ["Accountability", "Root cause thinking", "Improvement"],
    framework: [
      "Miss: after I thought [feature] was done, [problem] appeared.",
      "Response: I [reproduced it / told whom].",
      "Cause: it was missed because [reason].",
      "Change: now I [habit].",
    ],
    star: [
      "What was finished, and what was found afterwards?",
      "What did you have to do about it?",
      "How did you fix it and tell others?",
      "What changed in how you work?",
    ],
    check: [
      "Did I own the mistake plainly?",
      "Is the change I name specific?",
    ],
  }),
  pq({
    slug: "when-requirements-were-unclear",
    topic: "Challenges",
    d: "medium",
    title: "What did you do when the requirements were unclear or changed during the project?",
    kw: ["requirements", "ambiguity", "change", "assumptions", "communication"],
    intent:
      "The interviewer checks how you cope with uncertainty and change without freezing or guessing silently.",
    short:
      "When [requirement] was unclear, I wrote down my assumption about it and asked [person] to confirm. While waiting, I built [part] in a way that would not be wasted if the answer changed. When it changed to [new requirement], I looked at what it affected, told [people] the impact, and updated [parts]. It taught me to [lesson].",
    detail: [
      "Ask early, and write assumptions down.",
      "Build the parts that do not depend on the unknown first.",
      "Explain the impact of a change before doing it.",
    ],
    ex: "A candidate listed assumptions at the top of a task, got them confirmed, and built the stable parts first.",
    mistakes: [
      "Guessing silently and building the wrong thing.",
      "Refusing to proceed until everything is clear.",
    ],
    follow: ["How did you decide what to build first?"],
    tip: "Show both sides: you ask questions, and you keep making progress.",
    points: [
      "Write assumptions",
      "Ask early",
      "Build stable parts first",
      "Communicate impact",
    ],
    weak: "I waited until someone told me exactly what to build.",
    why: [
      "It shows no initiative.",
      "It wastes time.",
      "It does not show how you handle uncertainty.",
    ],
    expects: ["Initiative", "Communication", "Adaptability"],
    framework: [
      "Unclear: [requirement] was not clear.",
      "Assumption: I wrote [assumption] and checked it with [person].",
      "Progress: meanwhile I built [parts that do not depend on it].",
      "Change: when it changed to [new], I [updated what] and told [who].",
    ],
    star: [
      "What was unclear or changed?",
      "What were you responsible for delivering?",
      "What did you do to clarify and keep going?",
      "How did it turn out, and what did you learn?",
    ],
    check: [
      "Did I show both asking and progressing?",
      "Can I name a real assumption I recorded?",
    ],
  }),
  pq({
    slug: "how-you-knew-it-worked",
    topic: "Challenges",
    d: "medium",
    title: "How did you know your project worked correctly?",
    kw: ["testing", "verification", "test cases", "edge cases", "confidence"],
    intent:
      "The interviewer wants to know how you gain confidence in your own work.",
    short:
      "I checked it at several levels. For the important logic I wrote [kind of checks, such as automated tests] covering normal cases, edge cases like [example], and failure cases. For the whole flow I [tried it manually / had others try it]. I also [other checks]. I am confident about [area]; I am less sure about [area], which I would test next.",
    detail: [
      "Cover normal, edge and failure cases.",
      "Say what you checked automatically and what by hand.",
      "Be honest about the areas you are less sure of.",
    ],
    ex: "A candidate tested the main calculations with a list of cases, including empty and very large inputs, and had a friend try the full flow.",
    mistakes: [
      "Saying you tested it by using it a few times.",
      "Claiming complete coverage.",
    ],
    follow: ["Which test was most useful?"],
    tip: "Give one concrete example of an edge case that you tested.",
    points: [
      "Normal, edge and failure cases",
      "Automated and manual",
      "Others trying it",
      "Honest about gaps",
    ],
    weak: "It worked when I ran it, so I knew it was correct.",
    why: [
      "It treats one success as proof.",
      "It names no cases.",
      "It shows low standards.",
    ],
    expects: ["A testing approach", "Edge cases", "Honesty about gaps"],
    framework: [
      "Checks: I tested [areas] with [kind of checks].",
      "Cases: normal, [edge case] and [failure case].",
      "Whole flow: I [how you tried it end to end].",
      "Gaps: I am less sure about [area] and would test it by [how].",
    ],
    star: [
      "What did the project need to get right?",
      "How would you know it was right?",
      "What checks did you write or run?",
      "What did they find, and what remained uncertain?",
    ],
    check: [
      "Can I name a real edge case I tested?",
      "Did I admit what I did not test?",
    ],
  }),
  pq({
    slug: "protecting-user-data",
    topic: "Challenges",
    d: "hard",
    title: "How did you think about protecting users' data and handling mistakes safely in your project?",
    kw: ["security", "privacy", "input validation", "secrets", "error handling"],
    intent:
      "The interviewer checks whether you consider safety and privacy as part of the design, at the level of a beginner.",
    short:
      "I thought about it in [areas]. I check what users send me before using it by [how]. Passwords or keys are kept [where] and not in the code. Error messages tell users [what] but do not reveal [what not]. I know I have not covered [gap], and I would learn it by reading [official source type] and reviewing [part].",
    detail: [
      "Name concrete things you did, not general intentions.",
      "Keep secrets out of the source code and out of messages.",
      "Be open about what you have not covered.",
    ],
    ex: "A candidate described validating input on both sides, keeping keys in settings outside the code, and keeping error messages plain.",
    mistakes: [
      "Claiming the project is fully secure.",
      "Saying you did not think about it at all.",
    ],
    follow: ["What is the first thing you would check in a review?"],
    tip: "Do not claim more than you did. Honest, specific steps are better than big claims.",
    points: [
      "Concrete steps",
      "Validate input",
      "Keep secrets out of code",
      "Be honest about gaps",
    ],
    weak: "Security is handled by the framework, so I did not need to do anything.",
    why: [
      "It passes responsibility to a tool without understanding.",
      "It shows no concrete step.",
      "It claims safety it cannot demonstrate.",
    ],
    expects: ["Awareness", "Concrete practice", "Humility"],
    framework: [
      "Input: I check [what] by [how].",
      "Secrets: [keys or passwords] are kept in [where].",
      "Errors: messages show [what] and hide [what].",
      "Gap: I have not yet covered [gap], so I would [plan].",
    ],
    star: [
      "What data or actions in the project needed protection?",
      "What could go wrong?",
      "What did you do about it?",
      "What did you verify, and what remains open?",
    ],
    check: [
      "Is every protection I claim really in the project?",
      "Do I admit at least one gap?",
    ],
  }),
  pq({
    slug: "biggest-lesson-from-the-project",
    topic: "Challenges",
    d: "easy",
    title: "What is the biggest lesson you took from this project?",
    kw: ["lessons learned", "reflection", "growth", "improvement", "retrospective"],
    intent:
      "The interviewer wants to see reflection and whether you improve from experience.",
    short:
      "The biggest lesson was [lesson]. I learned it when [moment in the project]. Before, I used to [old habit]; now I [new habit]. I have already applied it in [where], and it helped by [how]. I am still working on [remaining area].",
    detail: [
      "Choose a lesson that changed what you do, not a general statement.",
      "Link it to a specific moment.",
      "Show where you have used it since.",
    ],
    ex: "A candidate said they learned to write down the plan before coding, and described how it changed their next small project.",
    mistakes: [
      "Giving a vague lesson such as 'teamwork is important'.",
      "Claiming you already knew everything.",
    ],
    follow: ["Where have you used that lesson since?"],
    tip: "Make it a behaviour change you can show with an example.",
    points: [
      "A specific lesson",
      "A moment that taught it",
      "Old habit and new habit",
      "Applied since",
    ],
    weak: "I learned that programming is hard but worth it.",
    why: [
      "It is too general.",
      "It shows no changed behaviour.",
      "It gives nothing to discuss.",
    ],
    expects: ["Reflection", "Concrete change", "Growth mindset"],
    framework: [
      "Lesson: I learned [lesson].",
      "Moment: it became clear when [moment].",
      "Change: I used to [old] and now I [new].",
      "Applied: I used it in [where] and it helped by [how].",
    ],
    star: [
      "What happened in the project that taught you something?",
      "What did you need to get right?",
      "What did you change in how you work?",
      "Where has it helped since?",
    ],
    check: [
      "Is my lesson something I do differently now?",
      "Can I give an example of using it?",
    ],
  }),
])
