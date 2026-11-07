import { defineLesson } from "@/data/lessons/author"

export default defineLesson("git", {
  slug: "git-basics",
  title: "Git basics: repositories, staging and commits",
  topic: "Basics",
  minutes: 60,
  overview:
    "Learn what Git records, the three areas a file moves through, and the everyday commands: init, clone, status, add, commit, log, diff and .gitignore.",
  objectives: [
    "Explain what a repository, a commit and the staging area are",
    "Use init, status, add, commit, log and diff in a normal workflow",
    "Write a useful commit message and ignore files with .gitignore",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "What Git is",
      body: [
        "Git is a **distributed version control system**. It records snapshots of your project over time, so you can see what changed, go back to an earlier state, and work with others. Every clone of a repository holds the full history, so most operations are local and fast.",
        "Git thinks in **snapshots**. At each commit it records what all the files look like at that moment, and stores unchanged files as references to the earlier version.",
        "Files in a working directory are in one of two broad states: **tracked** (Git knows about them) or **untracked**. Tracked files can be unmodified, modified or staged.",
      ],
    },
    {
      kind: "diagram",
      heading: "The three areas",
      diagram: {
        kind: "flow",
        title: "How a change travels",
        steps: [
          { label: "Working directory", detail: "You edit files here." },
          { label: "Staging area (index)", detail: "git add marks what goes into the next commit." },
          { label: "Repository", detail: "git commit saves a snapshot in the history." },
        ],
      },
    },
    {
      kind: "code",
      heading: "A first session",
      example: {
        title: "Create, stage and commit",
        language: "bash",
        code: "git init\necho \"hello\" > notes.txt\ngit status\ngit add notes.txt\ngit commit -m \"Add notes file\"\n\necho \"more\" >> notes.txt\ngit diff\ngit add notes.txt\ngit commit -m \"Add a second line\"\n\ngit log --oneline",
        walkthrough: [
          "`git init` creates a new repository in the current folder. `git clone <url>` copies an existing one instead.",
          "`git status` shows which files are untracked, modified or staged. Use it often.",
          "`git add` stages a file: it puts the current version into the staging area for the next commit.",
          "`git commit -m` records the staged snapshot with a message.",
          "`git diff` shows changes you have not staged yet. `git diff --staged` shows what is staged. `git log --oneline` lists commits, newest first.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Good habits",
      body: [
        "Commit small, related changes. A commit should do one thing, so it can be understood, reviewed and undone on its own.",
        "Write the message in the imperative mood, with a short first line: 'Fix login redirect', not 'fixed stuff'. Add a blank line and details if the reason is not obvious.",
        "A `.gitignore` file lists patterns of files Git should not track, such as build output, dependency folders and secrets files. It only affects untracked files: a file already committed stays tracked until you remove it from the index.",
        "Set your name and email once with `git config --global user.name` and `git config --global user.email`, because they are stored in every commit.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using git add . without looking at git status.",
          fix: "Check what you are staging, so you do not commit secrets or build files.",
        },
        {
          mistake: "Vague messages such as 'update' or 'fix'.",
          fix: "Say what changed and why in the first line.",
        },
        {
          mistake: "Committing files that should be ignored.",
          fix: "Add them to .gitignore before the first commit, and remove already tracked ones with git rm --cached.",
        },
        {
          mistake: "Large commits that mix unrelated changes.",
          fix: "Stage and commit related changes separately.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Starting a project",
      scenario:
        "You start a small project and want a clean history from the first day.",
      body: [
        "Run `git init`, create a `.gitignore` for your tools, make a first commit with the initial files, and then commit each small step. Use `git log --oneline` to check that the story reads well.",
        "When the project is ready to share, add a remote and push it.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "staging-purpose",
      prompt: "What does git add do?",
      options: [
        "Puts a file's current version into the staging area",
        "Saves a commit",
        "Uploads files to a server",
      ],
      answer: 0,
      explanation:
        "git add stages changes. git commit then records the staged snapshot.",
    },
    {
      type: "single",
      id: "show-unstaged",
      prompt: "Which command shows changes that are not staged yet?",
      options: ["git diff", "git log", "git init"],
      answer: 0,
      explanation:
        "git diff compares the working directory with the staging area.",
    },
    {
      type: "truefalse",
      id: "gitignore-tracked",
      statement: "Adding a file to .gitignore removes it from Git if it was already committed.",
      answer: false,
      explanation:
        "A file that is already tracked stays tracked. Remove it from the index with git rm --cached.",
    },
    {
      type: "blank",
      id: "make-repo",
      prompt: "To create a new repository in the current folder, run git ___.",
      answer: "init",
      explanation:
        "`git init` creates a new, empty repository.",
    },
  ],
  assignment: {
    title: "A tidy first repository",
    task: [
      "Create a new folder, run git init, add a README and a .gitignore, and make three separate commits with clear messages.",
      "Use git status, git diff, git diff --staged and git log --oneline between the steps.",
    ],
    checklist: [
      "The repository has at least three commits",
      "Each message is a clear short sentence in the imperative mood",
      ".gitignore excludes a folder I create",
      "I can explain the working directory, staging area and repository",
    ],
    hints: ["Make a change, check git status, stage it, check again, and then commit."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "commit-flow",
      title: "Commit a change",
      task: [
        "You edited app.js and want to record it with the message 'Fix greeting'. Write the commands: check the state, stage only app.js, and commit.",
      ],
      language: "bash",
      starter: "# your commands",
      solution: "git status\ngit add app.js\ngit commit -m \"Fix greeting\"",
      hints: ["Stage the one file by name instead of using a dot."],
      checklist: [
        "The state is checked first",
        "Only app.js is staged",
        "The commit message is given with -m",
      ],
    },
  ],
  revisionNotes: [
    "Working directory, staging area, repository: add stages, commit records",
    "git status, git diff, git diff --staged, git log --oneline",
    "Small commits, imperative messages",
    ".gitignore affects untracked files only",
  ],
  resources: [
    {
      label: "Pro Git: What is Git?",
      url: "https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F",
    },
    {
      label: "Pro Git: Recording changes to the repository",
      url: "https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository",
    },
    {
      label: "Pro Git: Viewing the commit history",
      url: "https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History",
    },
  ],
})
