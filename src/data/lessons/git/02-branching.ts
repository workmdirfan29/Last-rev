import { defineLesson } from "@/data/lessons/author"

export default defineLesson("git", {
  slug: "branching",
  title: "Branches and merging",
  topic: "Branching",
  minutes: 60,
  overview:
    "Understand a branch as a movable pointer to a commit, create and switch branches, merge them, resolve conflicts and manage remote branches.",
  objectives: [
    "Explain that a branch is a lightweight pointer to a commit and HEAD says where you are",
    "Create, switch, merge and delete branches",
    "Resolve a merge conflict and work with remote-tracking branches",
  ],
  prerequisites: ["lesson.git.git-basics"],
  sections: [
    {
      kind: "explain",
      heading: "A branch is a pointer",
      body: [
        "A **branch** in Git is a lightweight, movable pointer to a commit. The default branch is usually called `main`. When you commit, the current branch pointer moves forward to the new commit.",
        "`HEAD` is a special pointer that says which branch (or commit) you currently have checked out. Switching branches changes the files in your working directory to match that branch's latest commit.",
        "Because a branch is only a pointer, creating one is instant. That makes it normal to start a new branch for each piece of work, try an idea safely and merge it back when it is ready.",
      ],
    },
    {
      kind: "code",
      heading: "Create, switch and merge",
      example: {
        title: "A feature branch",
        language: "bash",
        code: "git switch -c login-page\n# edit files, then\ngit add .\ngit commit -m \"Add login page\"\n\ngit switch main\ngit merge login-page\ngit branch -d login-page\n\ngit branch\ngit branch -a",
        walkthrough: [
          "`git switch -c login-page` creates the branch and switches to it. (`git checkout -b` does the same in older versions.)",
          "Commits made now move only the `login-page` pointer; `main` stays where it was.",
          "Back on `main`, `git merge login-page` brings the branch's work in. If `main` has not moved, Git simply moves the pointer forward, which is a **fast-forward**.",
          "`git branch -d` deletes the merged branch pointer. The commits remain in the history. `git branch -a` lists local and remote-tracking branches.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Merge conflicts",
      body: [
        "If both branches changed the same lines, Git cannot decide which version to keep. It stops the merge, marks the file as conflicted and writes both versions into the file between `<<<<<<<`, `=======` and `>>>>>>>` markers.",
        "To resolve it, edit the file to the content you want and remove the markers, then run `git add` on the file and `git commit` to finish the merge. `git merge --abort` cancels the merge and returns to the state before it.",
        "`git status` lists the files that are unmerged. A merge that is not a fast-forward creates a **merge commit** with two parents.",
      ],
    },
    {
      kind: "explain",
      heading: "Remote branches",
      body: [
        "A **remote-tracking branch**, such as `origin/main`, records where a branch was on the remote the last time you communicated with it. You do not move it yourself; `git fetch` updates it.",
        "`git push origin login-page` publishes your branch. `git push -u origin login-page` also sets the upstream, so later `git push` and `git pull` need no arguments.",
        "`git pull` is a fetch followed by a merge (or a rebase, if configured). Fetching first lets you look at what changed before combining it.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Working directly on main for everything.",
          fix: "Create a branch for each piece of work and merge it when it is ready.",
        },
        {
          mistake: "Switching branches with uncommitted changes and being surprised.",
          fix: "Commit or stash first; Git may refuse the switch to protect your changes.",
        },
        {
          mistake: "Committing a file with conflict markers still in it.",
          fix: "Search for the markers before staging the resolved file.",
        },
        {
          mistake: "Leaving old merged branches around.",
          fix: "Delete branches once they are merged.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Fixing a bug while a feature is in progress",
      scenario:
        "You are halfway through a feature when an urgent bug appears on main.",
      body: [
        "Commit your work in progress on the feature branch (or stash it), switch to `main`, create a `fix-bug` branch, fix, commit and merge it, then switch back to the feature branch and carry on.",
        "Because each task has its own branch, the two pieces of work never mix.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "branch-meaning",
      prompt: "What is a Git branch?",
      options: [
        "A movable pointer to a commit",
        "A full copy of the repository",
        "A backup folder",
      ],
      answer: 0,
      explanation:
        "A branch is a lightweight pointer, which is why creating one is instant.",
    },
    {
      type: "single",
      id: "make-and-switch",
      prompt: "Which command creates a branch and switches to it?",
      options: ["git switch -c name", "git branch -d name", "git merge name"],
      answer: 0,
      explanation:
        "git switch -c creates the branch and switches to it. git checkout -b is the older form.",
    },
    {
      type: "truefalse",
      id: "fetch-merges",
      statement: "git fetch merges remote changes into your current branch.",
      answer: false,
      explanation:
        "git fetch only updates remote-tracking branches. git pull = fetch + merge.",
    },
    {
      type: "blank",
      id: "conflict-abort",
      prompt: "To cancel a merge that has conflicts, run git merge --___.",
      answer: "abort",
      explanation:
        "`git merge --abort` returns to the state before the merge started.",
    },
  ],
  assignment: {
    title: "Create and resolve a conflict",
    task: [
      "In a practice repository, create two branches that change the same line of a file differently, merge them and resolve the conflict.",
      "Then push a branch to a remote and fetch it from a second clone.",
    ],
    checklist: [
      "I created and merged a feature branch",
      "I saw conflict markers and resolved them",
      "I used git merge --abort at least once",
      "I can explain origin/main versus main",
    ],
    hints: ["Use git log --oneline --graph --all to see the branches."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "branch-commands",
      title: "Branch and merge",
      task: [
        "Write the commands to: create and switch to a branch named search-box, then (after committing work) switch back to main, merge it and delete the branch.",
      ],
      language: "bash",
      starter: "# your commands",
      solution:
        "git switch -c search-box\n# work and commit\ngit switch main\ngit merge search-box\ngit branch -d search-box",
      hints: ["Merge into the branch you are standing on."],
      checklist: [
        "The branch is created with switch -c",
        "You are on main when merging",
        "The merged branch is deleted with -d",
      ],
    },
  ],
  revisionNotes: [
    "A branch is a pointer; HEAD says where you are",
    "switch -c creates; merge combines; branch -d deletes",
    "Conflicts: edit, remove markers, add, commit; or merge --abort",
    "fetch updates origin/*; pull = fetch + merge",
  ],
  resources: [
    {
      label: "Pro Git: Branches in a nutshell",
      url: "https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell",
    },
    {
      label: "Pro Git: Basic branching and merging",
      url: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging",
    },
    {
      label: "Pro Git: Remote branches",
      url: "https://git-scm.com/book/en/v2/Git-Branching-Remote-Branches",
    },
  ],
})
