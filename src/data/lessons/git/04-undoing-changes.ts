import { defineLesson } from "@/data/lessons/author"

export default defineLesson("git", {
  slug: "undoing-changes",
  title: "Undoing changes safely",
  topic: "Undoing changes",
  minutes: 60,
  overview:
    "Pick the right undo for each situation: discard edits, unstage, amend, revert a shared commit, reset a local branch, stash, and recover with the reflog.",
  objectives: [
    "Match each situation to restore, amend, revert, reset or stash",
    "Explain the difference between reset --soft, --mixed and --hard",
    "Explain why revert is safe for shared history and reset is not",
    "Recover a lost commit with git reflog",
  ],
  prerequisites: ["lesson.git.git-basics"],
  sections: [
    {
      kind: "explain",
      heading: "First ask: where is the change?",
      body: [
        "The right tool depends on where the mistake is: in the **working directory** (not staged), in the **staging area**, in a **local commit**, or in a commit you have already **pushed**.",
        "Commands that only affect the working directory can destroy uncommitted work for good, because Git has no copy of it. Commands that move branch pointers are usually recoverable for a while through the reflog.",
      ],
    },
    {
      kind: "diagram",
      heading: "Which command?",
      diagram: {
        kind: "table",
        title: "Choosing an undo",
        headers: ["Situation", "Command"],
        rows: [
          ["Discard edits in a file that is not staged", "git restore file"],
          ["Unstage a file but keep the edits", "git restore --staged file"],
          ["Fix the last commit message or add a forgotten file (not pushed)", "git commit --amend"],
          ["Undo a commit that is already shared", "git revert <commit>"],
          ["Move a local branch back and drop commits", "git reset"],
          ["Put edits aside to switch tasks", "git stash"],
        ],
      },
    },
    {
      kind: "code",
      heading: "The commands",
      example: {
        title: "Undo in practice",
        language: "bash",
        code: "git restore notes.txt\ngit restore --staged notes.txt\n\ngit commit --amend -m \"Better message\"\n\ngit revert 1a2b3c4\n\ngit reset --soft HEAD~1\ngit reset HEAD~1\ngit reset --hard HEAD~1\n\ngit stash\ngit stash pop\n\ngit reflog",
        walkthrough: [
          "`git restore notes.txt` discards unstaged edits to that file. They cannot be recovered, so use it deliberately.",
          "`git restore --staged notes.txt` unstages the file and keeps your edits.",
          "`git commit --amend` replaces the last commit with a new one. It rewrites history, so avoid it once the commit is pushed and shared.",
          "`git revert 1a2b3c4` creates a **new commit that applies the opposite changes**. It leaves history intact, which makes it safe on shared branches.",
          "`git reset --soft HEAD~1` moves the branch back one commit but keeps the changes staged. The default (`--mixed`) keeps the changes in the working directory but unstages them. `--hard` also discards the changes.",
          "`git stash` saves modified tracked files and reverts the working directory; `git stash pop` brings them back. `git reflog` lists where HEAD has been, so you can find a commit after a mistaken reset.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Rules of thumb",
      body: [
        "If the commit is **only on your machine**, you may amend or reset it freely. If it is **already pushed and shared**, prefer `git revert`.",
        "Before a risky command, run `git status` and consider making a safety branch with `git branch backup`. A commit that exists on any branch or in the reflog can be recovered.",
        "`git reset --hard` and `git restore` on unstaged edits are the dangerous ones: they delete work Git has never recorded.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using reset --hard on a branch others have pulled, then force pushing.",
          fix: "Use git revert so history stays consistent for everyone.",
        },
        {
          mistake: "Running git restore on a file with edits you wanted to keep.",
          fix: "Commit or stash first if you are not sure.",
        },
        {
          mistake: "Assuming a reset commit is gone forever.",
          fix: "Check git reflog; the commit can usually be recovered for some time.",
        },
        {
          mistake: "Amending a commit that was already pushed.",
          fix: "Make a new commit, or coordinate before rewriting shared history.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Bad commit on main",
      scenario:
        "A commit that breaks the build was pushed to main and your teammates have pulled it.",
      body: [
        "Find the commit with `git log --oneline`, run `git revert <commit>`, and push the new revert commit. Everyone gets the fix with a normal pull.",
        "Rewriting main with reset and a force push would break every teammate's copy.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "unstage-only",
      prompt: "Which command unstages a file but keeps your edits?",
      options: [
        "git restore --staged file",
        "git reset --hard",
        "git revert HEAD",
      ],
      answer: 0,
      explanation:
        "git restore --staged moves the file out of the staging area and leaves the working copy alone.",
    },
    {
      type: "single",
      id: "shared-undo",
      prompt: "A bad commit has been pushed and others pulled it. What is the safest undo?",
      options: ["git revert", "git reset --hard then force push", "git commit --amend then force push"],
      answer: 0,
      explanation:
        "Revert adds a new commit and does not rewrite shared history.",
    },
    {
      type: "truefalse",
      id: "restore-recoverable",
      statement: "git restore on an unstaged file can always be undone later with the reflog.",
      answer: false,
      explanation:
        "Unstaged edits were never recorded by Git, so discarding them cannot be undone.",
    },
    {
      type: "blank",
      id: "find-lost",
      prompt: "To list where HEAD has pointed recently and find a lost commit, run git ___.",
      answer: "reflog",
      explanation:
        "The reflog records movements of HEAD and branches in your local repository.",
    },
  ],
  assignment: {
    title: "Undo toolbox",
    task: [
      "In a practice repository, make three commits and practise each undo: amend the last message, revert the middle commit, and use reset --soft, --mixed and --hard in turn.",
      "After a hard reset, bring the commits back using git reflog.",
    ],
    checklist: [
      "I amended a commit message",
      "I reverted a commit and saw the new revert commit",
      "I can describe the three reset modes",
      "I recovered a commit with the reflog",
    ],
    hints: ["Read the reflog entries; the commit ID is on the left."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "undo-choices",
      title: "Pick the undo",
      task: [
        "Write the command for each: (1) unstage app.js but keep the edits; (2) undo the pushed commit abc1234 without rewriting history.",
      ],
      language: "bash",
      starter: "# 1\n# 2",
      solution: "git restore --staged app.js\ngit revert abc1234",
      hints: ["One command moves a file out of the staging area; the other adds a new commit."],
      checklist: [
        "The first command uses restore --staged",
        "The second uses revert with the commit ID",
      ],
    },
  ],
  revisionNotes: [
    "restore for files; amend for the last commit; revert for shared; reset for local",
    "reset: --soft keeps staged, --mixed keeps unstaged, --hard discards",
    "revert adds a new commit and is safe on shared branches",
    "stash saves edits aside; reflog finds lost commits",
  ],
  resources: [
    {
      label: "Pro Git: Undoing things",
      url: "https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things",
    },
    {
      label: "Pro Git: Reset demystified",
      url: "https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified",
    },
    {
      label: "Pro Git: Stashing and cleaning",
      url: "https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning",
    },
  ],
})
