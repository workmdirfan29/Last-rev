import { defineLesson } from "@/data/lessons/author"

export default defineLesson("git", {
  slug: "github-pull-requests",
  title: "GitHub pull requests",
  topic: "GitHub pull requests",
  minutes: 45,
  overview:
    "Open, describe and merge a pull request on GitHub: what it is, how to write a good one, draft pull requests, checks, and the merge options.",
  objectives: [
    "Explain what a pull request is and what it needs",
    "Write a clear title and description and link an issue",
    "Choose between merge commit, squash and merge, and rebase and merge",
    "Explain how protected branches can block a merge",
  ],
  prerequisites: ["lesson.git.workflows"],
  sections: [
    {
      kind: "explain",
      heading: "What a pull request is",
      body: [
        "A **pull request** is a proposal to merge the changes on one branch into another, with a place to discuss them first. You push a branch, open a pull request, collaborators review it, and when it is approved you merge it.",
        "When you push more commits to the branch, the pull request updates automatically. GitHub keeps the comments and commits with the pull request, which helps later contributors understand why a change was made.",
      ],
    },
    {
      kind: "explain",
      heading: "Writing a good pull request",
      body: [
        "Give it a clear title and a description with a **summary of the changes and the problem they solve**. Images, links and tables can help. If it relates to an issue, link the issue; with a closing keyword, the issue closes when the pull request merges.",
        "If you want early feedback before the work is finished, mark the pull request as a **draft**. Keep it small and focused on one change, because small pull requests get faster, better reviews.",
        "If your repository has checks configured, their results appear on the pull request, so you can catch failures before merging. You can also add comments on specific lines to point something out to reviewers.",
      ],
    },
    {
      kind: "diagram",
      heading: "Merge options",
      diagram: {
        kind: "table",
        title: "How a pull request can be merged",
        headers: ["Option", "Result", "Choose when"],
        rows: [
          ["Merge commit", "Keeps every commit and adds an explicit merge point", "Complete history matters"],
          ["Squash and merge", "Combines all commits into one commit on the base branch", "The pull request is one logical change with many fixup commits"],
          ["Rebase and merge", "Adds each commit onto the base branch without a merge commit", "The team wants a linear history and the commits are tidy"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Conflicts and protection",
      body: [
        "GitHub tells you if the pull request has conflicts that must be resolved before it can be merged. You resolve them by updating your branch with the base branch, locally or on the website.",
        "A **protected branch** can require, for example, a number of approving reviews or passing status checks before a pull request may merge. Merging needs write permission on the repository.",
        "After merging, delete the branch. The pull request and commit history are kept, and a deleted branch can be restored.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "A huge pull request that changes many unrelated things.",
          fix: "Split it into separate branches and pull requests.",
        },
        {
          mistake: "An empty description.",
          fix: "Explain what changed and why, and link the issue.",
        },
        {
          mistake: "Merging with failing checks.",
          fix: "Fix the failures first, and protect the branch to require passing checks.",
        },
        {
          mistake: "Leaving merged branches in the repository.",
          fix: "Delete the branch after merging.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Opening your first pull request",
      scenario:
        "You pushed the branch add-search-filter and want a teammate to review it.",
      body: [
        "Open a pull request from the branch into main. Write a title such as 'Add search filter', describe the change and how to try it, link the issue, and request a reviewer. If it is not ready, open it as a draft.",
        "Respond to comments by pushing more commits. When it is approved and checks pass, merge it with the strategy your team uses and delete the branch.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "pr-purpose",
      prompt: "What is a pull request?",
      options: [
        "A proposal to merge one branch into another, with a place to review it",
        "A command that downloads remote commits",
        "A backup of a repository",
      ],
      answer: 0,
      explanation:
        "A pull request lets collaborators discuss and review changes before they are merged.",
    },
    {
      type: "single",
      id: "squash-result",
      prompt: "What does Squash and merge do?",
      options: [
        "Combines the pull request's commits into one commit on the base branch",
        "Keeps every commit and adds a merge commit",
        "Deletes the base branch",
      ],
      answer: 0,
      explanation:
        "Squash and merge produces a single commit for the whole pull request.",
    },
    {
      type: "truefalse",
      id: "pr-updates",
      statement: "Pushing more commits to the branch updates an open pull request.",
      answer: true,
      explanation:
        "The pull request follows the branch, so new commits appear in it automatically.",
    },
    {
      type: "blank",
      id: "early-feedback",
      prompt: "To ask for early feedback on unfinished work, open the pull request as a ___.",
      answer: "draft",
      explanation:
        "A draft pull request signals the work is not ready to merge.",
    },
  ],
  assignment: {
    title: "Practice pull request",
    task: [
      "In a practice repository on GitHub, push a branch with one small change and open a pull request with a clear title and description.",
      "Push a second commit in response to a comment you write yourself, then merge it using squash and merge and delete the branch.",
    ],
    checklist: [
      "The title and description say what and why",
      "The pull request updated after the second push",
      "I merged with a deliberate choice of strategy",
      "The branch was deleted afterwards",
    ],
    hints: ["Open the pull request as a draft first, then mark it ready for review."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "write-pr-description",
      title: "Write a description",
      task: [
        "Write a short pull request description in Markdown for a change that adds input validation to a signup form. Include a summary, why, how to test and a link to an issue.",
      ],
      language: "markdown",
      starter: "## Summary\n",
      solution:
        "## Summary\nValidate the email and password fields on the signup form.\n\n## Why\nInvalid input reached the server and produced unclear errors.\n\n## How to test\n1. Open the signup page.\n2. Submit an invalid email.\n3. Check the inline error message.\n\nCloses #12",
      hints: ["Explain the problem before the solution."],
      checklist: [
        "A summary of the change",
        "The reason for the change",
        "Steps to test it",
        "A link to an issue",
      ],
    },
  ],
  revisionNotes: [
    "A pull request proposes a merge and hosts the review",
    "Clear title and description, linked issue, small scope, draft for early feedback",
    "Merge commit, squash and merge, rebase and merge",
    "Protected branches can require reviews and checks; delete the branch afterwards",
  ],
  resources: [
    {
      label: "About pull requests",
      url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests",
    },
    {
      label: "About pull request merges",
      url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges",
    },
    {
      label: "About protected branches",
      url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
    },
  ],
})
