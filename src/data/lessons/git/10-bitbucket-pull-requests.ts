import { defineLesson } from "@/data/lessons/author"

export default defineLesson("git", {
  slug: "bitbucket-pull-requests",
  title: "Pull requests on Bitbucket",
  topic: "Bitbucket pull requests",
  minutes: 30,
  overview:
    "Create, review and merge a pull request in Bitbucket Cloud: reviewers and approvals, tasks, and the merge strategies you can choose.",
  objectives: [
    "Create a pull request with reviewers",
    "Approve a pull request and use tasks in a review",
    "Choose between merge commit, squash and fast forward",
    "Explain what declining a pull request means",
  ],
  prerequisites: ["lesson.git.bitbucket-repositories-and-permissions"],
  sections: [
    {
      kind: "explain",
      heading: "The Bitbucket flow",
      body: [
        "A pull request in Bitbucket Cloud works like on other hosting services: you push a branch, create a pull request from it into a destination branch, reviewers look at the changes, and the pull request is merged when it is approved.",
        "When you create a pull request you choose the source and destination branches, write a title and description, and add reviewers. A reviewer receives a notification. You can also let default reviewers or code owners be added for you.",
        "While the pull request is open, you can keep pushing commits to the source branch and they appear in it.",
      ],
    },
    {
      kind: "explain",
      heading: "Reviewing",
      body: [
        "Reviewers read the diff, comment on lines, and **approve** the pull request when it is ready. Users with Read permission or higher can approve.",
        "A comment can be turned into a **task**, a to-do item the author needs to complete as part of their update. A repository administrator can require that all tasks are resolved before merging with a merge checklist.",
        "If the changes should not go ahead in their current state, the pull request can be **declined**. A declined pull request is closed without merging.",
      ],
    },
    {
      kind: "diagram",
      heading: "Merge strategies",
      diagram: {
        kind: "table",
        title: "Options when merging",
        headers: ["Strategy", "Effect", "Same as"],
        rows: [
          ["Merge commit", "Keeps all commits from the source branch and makes them part of the destination branch", "git merge --no-ff"],
          ["Squash", "Combines your commits when merging the source into the destination", "git merge --squash"],
          ["Fast forward", "Moves commits to the destination, if the destination has no new commits", "git merge --ff-only"],
        ],
      },
    },
    {
      kind: "code",
      heading: "From branch to merge",
      example: {
        title: "Before opening the pull request",
        language: "bash",
        code: "git switch -c add-export-button\n# edit and commit\ngit push -u origin add-export-button\n\n# on the website: Create pull request, add reviewers, then merge after approval\ngit switch main\ngit pull",
        walkthrough: [
          "Push the branch so Bitbucket can see it.",
          "Create the pull request on the website, choosing main as the destination.",
          "After approval and passing checks, merge using the strategy your team agreed.",
          "Update your local main afterwards with `git pull`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Merging without waiting for an approval.",
          fix: "Wait for reviewers, and require approvals through merge checks.",
        },
        {
          mistake: "Choosing a merge strategy at random.",
          fix: "Agree one default as a team so the history stays predictable.",
        },
        {
          mistake: "Leaving tasks unresolved.",
          fix: "Resolve or answer every task before merging.",
        },
        {
          mistake: "Opening a pull request with no description.",
          fix: "Say what changed and why, and how a reviewer can test it.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A pull request with a task",
      scenario:
        "A reviewer finds a missing error message in your pull request.",
      body: [
        "They comment on the line and turn the comment into a task. You push a fix, resolve the task, and the reviewer approves. If your repository has a merge checklist, it confirms that tasks are done before you merge.",
        "Finally you merge with the agreed strategy and update your local main.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "squash-equivalent",
      prompt: "Which Git command is the Squash merge strategy the same as?",
      options: ["git merge --squash", "git merge --no-ff", "git merge --ff-only"],
      answer: 0,
      explanation:
        "Squash combines the source branch commits, like git merge --squash.",
    },
    {
      type: "single",
      id: "decline-meaning",
      prompt: "What does declining a pull request do?",
      options: [
        "Closes it without merging the changes",
        "Merges it with a squash",
        "Deletes the repository",
      ],
      answer: 0,
      explanation:
        "Decline is for changes that should not be merged in their current state.",
    },
    {
      type: "truefalse",
      id: "task-from-comment",
      statement: "A comment on a pull request can be turned into a task for the author.",
      answer: true,
      explanation:
        "Tasks give the author a list of action items to complete.",
    },
    {
      type: "blank",
      id: "ff-only",
      prompt: "The fast forward strategy is the same as git merge --___-only.",
      answer: "ff",
      explanation:
        "`git merge --ff-only` moves the pointer only when no new commits exist on the destination.",
    },
  ],
  assignment: {
    title: "Complete a Bitbucket review cycle",
    task: [
      "In a practice repository on Bitbucket, push a branch and create a pull request with a description and a reviewer.",
      "Add a comment turned into a task, fix it, get an approval and merge with a squash. Note which strategy you chose and why.",
    ],
    checklist: [
      "The pull request has a clear description",
      "A task was created and resolved",
      "The pull request was approved before merging",
      "I can explain my choice of merge strategy",
    ],
    hints: ["Use a second account or a friend as the reviewer."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "choose-strategy",
      title: "Pick a merge strategy",
      task: [
        "For each case, write merge commit, squash or fast forward: (1) a branch with ten tiny fixup commits that is one logical change; (2) a team that wants every commit kept with an explicit merge point; (3) a destination with no new commits where you want a straight line.",
      ],
      language: "markdown",
      starter: "1. \n2. \n3. ",
      solution: "1. squash\n2. merge commit\n3. fast forward",
      hints: ["Match each need to what the strategy does to the commits."],
      checklist: [
        "Fixup commits are squashed",
        "Keeping every commit uses a merge commit",
        "A straight line with no new destination commits uses fast forward",
      ],
    },
  ],
  revisionNotes: [
    "Push branch, create pull request, add reviewers, approve, merge",
    "Comments can become tasks; a merge checklist can require them resolved",
    "Merge commit, squash and fast forward match git merge --no-ff, --squash, --ff-only",
    "Decline closes a pull request without merging",
  ],
  resources: [
    {
      label: "Create a pull request to merge your change",
      url: "https://support.atlassian.com/bitbucket-cloud/docs/create-a-pull-request-to-merge-your-change/",
    },
    {
      label: "Use pull requests for code review",
      url: "https://support.atlassian.com/bitbucket-cloud/docs/use-pull-requests-for-code-review/",
    },
    {
      label: "Merge a pull request",
      url: "https://support.atlassian.com/bitbucket-cloud/docs/merge-a-pull-request/",
    },
  ],
})
