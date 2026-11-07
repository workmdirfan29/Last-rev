import { defineLesson } from "@/data/lessons/author"

export default defineLesson("git", {
  slug: "github-code-review",
  title: "Code review on GitHub",
  topic: "GitHub code review",
  minutes: 40,
  overview:
    "Learn the review decisions on GitHub, how to comment on lines and suggest changes, how reviews are requested and required, and how to give and receive feedback well.",
  objectives: [
    "Name the three review decisions and what each means",
    "Comment on a line and suggest an exact change",
    "Explain how reviews are requested and required",
    "Give feedback that is specific, kind and actionable",
  ],
  prerequisites: ["lesson.git.github-pull-requests"],
  sections: [
    {
      kind: "explain",
      heading: "What a review is for",
      body: [
        "Pull request reviews let people comment on changes, suggest improvements, and approve or request changes before the code is merged. They help catch mistakes, keep the code consistent and share knowledge across the team.",
        "Anyone with read access can review and comment on proposed changes. Review conversations appear in the pull request timeline so the team can track feedback and decisions.",
      ],
    },
    {
      kind: "diagram",
      heading: "Review decisions",
      diagram: {
        kind: "table",
        title: "What a reviewer can submit",
        headers: ["Decision", "Meaning"],
        rows: [
          ["Comment", "General feedback without approving or requesting changes"],
          ["Approve", "The changes are ready to merge"],
          ["Request changes", "Feedback the author should address before merging"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Doing a review",
      body: [
        "Open the **Files changed** tab and read the diff. You can comment on a specific line or a range of lines, or on the whole pull request. A **suggested change** lets you propose exact replacement text that the author can accept with one click.",
        "Start a review and add several comments, then submit them together with one decision. That sends one notification instead of one per comment.",
        "Requesting a review needs write access. You can request a review from a person or a team, and a `CODEOWNERS` file can request owners automatically when their files change. Repository administrators can require approving reviews before merging, using protected branches.",
      ],
    },
    {
      kind: "explain",
      heading: "Good feedback",
      body: [
        "Be specific: point to the line and say what you would change and why. Ask questions where you are unsure instead of assuming a mistake. Separate must-fix problems from optional suggestions.",
        "Review the change, not the person. Say what the code does, not what the author did wrong. As an author, respond to every comment, push fixes as new commits so reviewers can see what changed, and thank people for their time.",
        "Keep pull requests small. A reviewer can examine a small change carefully; a very large one tends to get skimmed.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Approving without reading the diff.",
          fix: "Read it, and run it if the change is risky. An approval means you reviewed it.",
        },
        {
          mistake: "Vague comments such as 'this is bad'.",
          fix: "Point to the line, explain the problem and suggest a direction.",
        },
        {
          mistake: "Submitting each comment separately.",
          fix: "Start a review, batch the comments and submit once.",
        },
        {
          mistake: "Taking feedback personally as an author.",
          fix: "Treat comments as feedback on the code, ask for clarification if needed.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Reviewing a teammate's pull request",
      scenario:
        "A teammate asks you to review a pull request that adds a discount calculation.",
      body: [
        "Read the description first to understand the goal, then read the diff. Comment on the line where a negative total is possible and suggest a fix. Ask whether a test covers it.",
        "Submit the review with 'Request changes' if the problem must be fixed, or 'Approve' with a few optional comments if it is only small suggestions.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "decisions",
      prompt: "Which review decision flags feedback that must be addressed before merging?",
      options: ["Request changes", "Comment", "Approve"],
      answer: 0,
      explanation:
        "Request changes signals that the author should address the feedback first.",
    },
    {
      type: "single",
      id: "suggested-change",
      prompt: "What is a suggested change?",
      options: [
        "Exact replacement text the author can accept with one click",
        "A new branch created for the reviewer",
        "An automatic merge",
      ],
      answer: 0,
      explanation:
        "Suggestions let a reviewer propose a precise edit inside a comment.",
    },
    {
      type: "truefalse",
      id: "read-access-review",
      statement: "Anyone with read access to the repository can review and comment on a pull request.",
      answer: true,
      explanation:
        "Reading and commenting need read access. Approving counts towards a required review depending on the repository's rules.",
    },
    {
      type: "blank",
      id: "owners-file",
      prompt: "A ___ file can request reviews automatically from the owners of the changed files.",
      answer: "CODEOWNERS",
      explanation:
        "The CODEOWNERS file maps paths to people or teams that should review them.",
    },
  ],
  assignment: {
    title: "Review a practice pull request",
    task: [
      "Ask a friend, or use a second account, to open a small pull request in a practice repository.",
      "Leave three line comments (one as a suggested change), then submit a review with a decision and write a one-paragraph summary of your feedback.",
    ],
    checklist: [
      "I commented on specific lines",
      "I used a suggested change",
      "I submitted all comments together with one decision",
      "My feedback was specific and polite",
    ],
    hints: ["Say what you would change and why, not just that it is wrong."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "rewrite-comments",
      title: "Improve review comments",
      task: [
        "Rewrite these three comments so they are specific and kind: 'this is wrong', 'why would you do this', 'fix naming'.",
      ],
      language: "markdown",
      starter: "1. \n2. \n3. ",
      solution:
        "1. This loop skips the last item because the condition uses < length - 1. Could it use < length?\n2. I am not sure why this value is cached here. Could you add a short comment about the reason?\n3. The name `data2` does not say what it holds. Would `activeUsers` be clearer?",
      hints: ["Point to the line, explain the issue, and offer a direction."],
      checklist: [
        "Each comment says what the issue is",
        "Each comment is polite and offers a direction",
        "No comment attacks the author",
      ],
    },
  ],
  revisionNotes: [
    "Comment, Approve, Request changes",
    "Line comments, suggested changes, batched review",
    "Reviews can be requested and required; CODEOWNERS automates requests",
    "Feedback: specific, kind, actionable; keep pull requests small",
  ],
  resources: [
    {
      label: "About pull request reviews",
      url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews",
    },
    {
      label: "Reviewing proposed changes in a pull request",
      url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request",
    },
    {
      label: "Commenting on a pull request",
      url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request",
    },
  ],
})
