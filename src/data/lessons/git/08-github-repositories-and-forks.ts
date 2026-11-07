import { defineLesson } from "@/data/lessons/author"

export default defineLesson("git", {
  slug: "github-repositories-and-forks",
  title: "GitHub repositories and forks",
  topic: "GitHub repositories & forks",
  minutes: 30,
  overview:
    "Learn what a GitHub repository holds, the difference between cloning and forking, and how to keep a fork in sync with the upstream repository.",
  objectives: [
    "Describe what a repository contains and who can use it",
    "Tell clone, fork, remote and upstream apart",
    "Fork a repository, clone it and add the upstream remote",
    "Sync a fork and open a pull request from it",
  ],
  prerequisites: ["lesson.git.github-pull-requests"],
  sections: [
    {
      kind: "explain",
      heading: "Repositories on GitHub",
      body: [
        "A repository holds your code, your files and each file's revision history. It can have several collaborators and can be public or private. You can also manage work with issues, discussions and pull requests inside it.",
        "A repository on GitHub is a **remote**: it lives on the hosting service, not on your computer. A **clone** is a full local copy that includes all versions of every file. You push your commits to the remote and pull other people's changes from it.",
      ],
    },
    {
      kind: "diagram",
      heading: "Terms",
      diagram: {
        kind: "table",
        title: "Repository vocabulary",
        headers: ["Term", "Meaning"],
        rows: [
          ["Clone", "A full local copy of a repository, with all its history"],
          ["Remote", "A repository stored on a server rather than on your computer"],
          ["Fork", "A new repository that starts as a copy of another one, called the upstream"],
          ["Upstream", "The original repository that a fork was made from"],
          ["Pull request", "A request to merge changes from one branch into another"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Fork or branch?",
      body: [
        "A **branch** is part of one repository. A **fork** is a separate repository with its own settings, branches, issues and pull requests, connected to the upstream repository.",
        "You fork when you do not have write access to the original, for example when contributing to someone else's project. You can fork any public repository to your own account. Public repositories produce public forks.",
        "Inside a team where everyone has write access, branches in the one shared repository are usually simpler.",
      ],
    },
    {
      kind: "code",
      heading: "Forking in practice",
      example: {
        title: "Contribute from a fork",
        language: "bash",
        code: "# after clicking Fork on the website\ngit clone https://github.com/YOUR-USERNAME/project.git\ncd project\ngit remote add upstream https://github.com/ORIGINAL-OWNER/project.git\ngit remote -v\n\ngit fetch upstream\ngit switch main\ngit merge upstream/main\ngit push origin main\n\ngit switch -c fix-typo\n# edit, commit\ngit push -u origin fix-typo",
        walkthrough: [
          "You fork on the website, then clone your fork. Git names its URL `origin` automatically.",
          "`git remote add upstream <url>` adds the original repository under the name `upstream`. `git remote -v` lists your remotes.",
          "`git fetch upstream` downloads the original's new commits; merging `upstream/main` into your `main` and pushing keeps your fork in sync. It is good practice to sync regularly.",
          "Do your work on a branch, push it to your fork and open a pull request from the fork's branch to the upstream repository.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Committing straight to the fork's main branch.",
          fix: "Create a branch for each contribution and keep main synced with upstream.",
        },
        {
          mistake: "Never syncing the fork.",
          fix: "Fetch from upstream before starting new work so you do not build on old code.",
        },
        {
          mistake: "Cloning the upstream repository when you want to contribute.",
          fix: "Clone your fork; you can only push to repositories you have write access to.",
        },
        {
          mistake: "Confusing a fork with a branch.",
          fix: "A branch lives inside one repository; a fork is a separate repository.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Fixing a typo in a public project",
      scenario:
        "You notice a typo in a public project's documentation and want to fix it.",
      body: [
        "Fork the project, clone your fork, create a branch, fix the typo, push it and open a pull request to the upstream repository. Describe the change in one line.",
        "The maintainers review and merge it. Afterwards, sync your fork with upstream.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "fork-meaning",
      prompt: "What is a fork?",
      options: [
        "A separate repository that starts as a copy of another one",
        "A branch inside the same repository",
        "A local copy of the files only",
      ],
      answer: 0,
      explanation:
        "A fork is its own repository with its own settings, connected to the upstream.",
    },
    {
      type: "single",
      id: "upstream-remote",
      prompt: "By convention, which remote name points at the original repository you forked?",
      options: ["upstream", "origin", "branch"],
      answer: 0,
      explanation:
        "`origin` is your fork (what you cloned). `upstream` is the original.",
    },
    {
      type: "truefalse",
      id: "fork-auto-sync",
      statement: "A fork automatically stays identical to the upstream repository.",
      answer: false,
      explanation:
        "You must sync it yourself, for example by fetching upstream and merging.",
    },
    {
      type: "blank",
      id: "add-remote",
      prompt: "To add the original repository as a second remote, run git remote ___ upstream <url>.",
      answer: "add",
      explanation:
        "`git remote add <name> <url>` registers another remote.",
    },
  ],
  assignment: {
    title: "Fork and sync",
    task: [
      "Fork a practice repository, clone your fork and add the original as upstream.",
      "Make a change in the original (or ask a friend to), then fetch and merge it into your fork's main and push.",
    ],
    checklist: [
      "git remote -v shows origin and upstream",
      "My fork's main matches the upstream after syncing",
      "I created a branch for my own change",
      "I can explain fork versus branch versus clone",
    ],
    hints: ["Use git log --oneline upstream/main to see what you are about to merge."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "sync-fork",
      title: "Sync a fork",
      task: [
        "Your upstream remote is already added. Write the commands to bring upstream's main into your local main and publish it to your fork.",
      ],
      language: "bash",
      starter: "# your commands",
      solution:
        "git fetch upstream\ngit switch main\ngit merge upstream/main\ngit push origin main",
      hints: ["Fetch first, then merge the remote-tracking branch."],
      checklist: [
        "You fetch from upstream",
        "You merge upstream/main on main",
        "You push to origin",
      ],
    },
  ],
  revisionNotes: [
    "Repository: code, files and history; public or private",
    "Clone = local copy; fork = new repository connected to the upstream",
    "origin is your fork; upstream is the original",
    "Branch per contribution; sync regularly; open the pull request from the fork",
  ],
  resources: [
    {
      label: "About repositories",
      url: "https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories",
    },
    {
      label: "About forks",
      url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks",
    },
    {
      label: "Fork a repository",
      url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo",
    },
  ],
})
