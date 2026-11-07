import { defineLesson } from "@/data/lessons/author"

export default defineLesson("git", {
  slug: "workflows",
  title: "Git team workflows",
  topic: "Workflows",
  minutes: 45,
  overview:
    "See how teams organise branches: the centralized workflow, topic (feature) branches, long-running branches and the branch-based flow used with pull requests.",
  objectives: [
    "Describe the centralized, feature-branch and fork-based workflows",
    "Explain topic branches and long-running branches",
    "Follow a branch, commit, pull request, review, merge sequence",
    "Choose branch names and keep branches short-lived",
  ],
  prerequisites: ["lesson.git.merge-vs-rebase"],
  sections: [
    {
      kind: "explain",
      heading: "Why a workflow",
      body: [
        "Git does not force one way of working. A **workflow** is an agreement about how a team uses branches, who may change which branch, and how changes reach the shared branch. Without one, people overwrite each other's work or break the main branch.",
        "Distributed version control allows several shapes. A small team can share one central repository. A large open project can have each contributor work in their own copy and ask a maintainer to pull changes.",
      ],
    },
    {
      kind: "diagram",
      heading: "Common shapes",
      diagram: {
        kind: "table",
        title: "Workflows at a glance",
        headers: ["Workflow", "How it works", "Typical fit"],
        rows: [
          ["Centralized", "Everyone pushes to one shared branch of one repository", "Very small teams"],
          ["Feature (topic) branch", "Each task gets a short-lived branch that is merged back after review", "Most teams"],
          ["Long-running branches", "Branches such as main and develop stay open and work flows from one to the next", "Projects with staged releases"],
          ["Forking", "Contributors push to their own fork and open a pull request to the upstream repository", "Open projects with many outside contributors"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Topic branches",
      body: [
        "A **topic branch** is a short-lived branch created for one feature, fix or experiment. You make commits on it, publish it, ask for review and then merge it and delete it.",
        "Branches are cheap in Git, so there is no reason to mix unrelated work. Keep each branch small and focused so reviews stay quick and conflicts stay few.",
        "**Long-running branches** stay open for a long time, for example a stable branch and a development branch. Work is merged from less stable branches into more stable ones as it matures.",
      ],
    },
    {
      kind: "code",
      heading: "A branch-based flow",
      example: {
        title: "From idea to merged work",
        language: "bash",
        code: "git switch main\ngit pull\ngit switch -c add-search-filter\n\n# edit, then\ngit add .\ngit commit -m \"Add search filter\"\ngit push -u origin add-search-filter\n\n# open a pull request, get a review, merge it on the hosting site\ngit switch main\ngit pull\ngit branch -d add-search-filter",
        walkthrough: [
          "Start from an up-to-date main so the branch begins from the latest shared work.",
          "Name the branch after what it does, so collaborators can see ongoing work at a glance.",
          "Commit and push as you go. Pushing backs up your work and lets others see it.",
          "Open a pull request to ask for feedback. After approval, merge it on the hosting site.",
          "Update your local main and delete the finished branch.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Keeping a feature branch alive for weeks.",
          fix: "Split the work and merge small pieces often, so conflicts stay small.",
        },
        {
          mistake: "Several unrelated changes on one branch.",
          fix: "Use a separate branch for each set of unrelated changes.",
        },
        {
          mistake: "Pushing broken work straight to the shared branch.",
          fix: "Use a branch and a pull request, and protect the shared branch.",
        },
        {
          mistake: "Branch names like 'test2' or 'stuff'.",
          fix: "Use short, descriptive names such as add-search-filter.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Agreeing a team workflow",
      scenario:
        "Four developers share one repository and the main branch keeps breaking.",
      body: [
        "Agree that nobody commits directly to main. Every change goes on a topic branch, is reviewed in a pull request and is merged only when checks pass. Protect main so the rule is enforced, not just remembered.",
        "Write the agreement down in the repository's README or contributing guide so new members follow it too.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "topic-branch",
      prompt: "What is a topic branch?",
      options: [
        "A short-lived branch for one feature or fix",
        "The branch every developer shares forever",
        "A backup of the repository",
      ],
      answer: 0,
      explanation:
        "A topic branch holds one task and is deleted after it is merged.",
    },
    {
      type: "single",
      id: "forking-fit",
      prompt: "Which workflow suits an open project with many outside contributors?",
      options: [
        "Forking, with pull requests to the upstream repository",
        "Everyone pushing to main",
        "No branches at all",
      ],
      answer: 0,
      explanation:
        "Outside contributors usually do not have write access, so they work in their own fork and propose changes.",
    },
    {
      type: "truefalse",
      id: "branches-cheap",
      statement: "In Git, creating a branch is cheap, so one branch per task is practical.",
      answer: true,
      explanation:
        "A branch is just a pointer to a commit, so it costs almost nothing.",
    },
    {
      type: "blank",
      id: "protect-shared",
      prompt: "To enforce that nobody pushes straight to the shared branch, set up branch ___.",
      answer: "protection",
      accepted: ["protection rules", "permissions", "restrictions"],
      explanation:
        "Branch protection (or branch permissions) enforces the rules in the hosting service.",
    },
  ],
  assignment: {
    title: "Write a team workflow",
    task: [
      "Write a half-page working agreement for a team of four: branch naming, how a change reaches main, who reviews, and when a branch is deleted.",
      "Then follow it once in a practice repository, from branch to merge.",
    ],
    checklist: [
      "Branch names are described with an example",
      "Direct pushes to main are ruled out",
      "A review step is part of the flow",
      "Finished branches are deleted",
    ],
    hints: ["Keep it short enough that a new joiner reads it all."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "start-topic-branch",
      title: "Start a topic branch",
      task: [
        "Write the commands to update main, create a branch called fix-header-spacing, and publish it so that later pushes need no arguments.",
      ],
      language: "bash",
      starter: "# your commands",
      solution:
        "git switch main\ngit pull\ngit switch -c fix-header-spacing\ngit push -u origin fix-header-spacing",
      hints: ["The -u flag sets the upstream."],
      checklist: [
        "main is updated first",
        "The branch is created with switch -c",
        "The push sets the upstream",
      ],
    },
  ],
  revisionNotes: [
    "A workflow is an agreement on branches, reviews and merging",
    "Topic branches are short-lived and focused",
    "Forking suits outside contributors; protect the shared branch",
    "Branch, commit, push, pull request, review, merge, delete",
  ],
  resources: [
    {
      label: "Pro Git: Branching workflows",
      url: "https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows",
    },
    {
      label: "Pro Git: Distributed workflows",
      url: "https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows",
    },
    {
      label: "GitHub flow",
      url: "https://docs.github.com/en/get-started/using-github/github-flow",
    },
  ],
})
