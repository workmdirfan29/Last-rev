import { defineLesson } from "@/data/lessons/author"

export default defineLesson("git", {
  slug: "merge-vs-rebase",
  title: "Merge versus rebase",
  topic: "Merge vs rebase",
  minutes: 75,
  overview:
    "Compare the two ways to combine work from one branch into another, see how each shapes the history, and learn when rebasing is safe.",
  objectives: [
    "Explain what a merge commit and a fast-forward are",
    "Explain that rebase replays commits and creates new ones",
    "Apply the rule: do not rebase commits that others already have",
    "Use squash, interactive rebase and force-with-lease correctly",
  ],
  prerequisites: ["lesson.git.branching"],
  sections: [
    {
      kind: "explain",
      heading: "Two ways to integrate",
      body: [
        "Suppose `main` has moved on while you worked on a `feature` branch. Both branches now have commits the other lacks. You can bring them together in two main ways.",
        "**Merge** creates a new **merge commit** with two parents that ties the two lines of history together. Nothing existing is changed, so the history shows exactly what happened, including the branching.",
        "**Rebase** takes the commits from your branch and **replays** them, one by one, on top of the other branch's latest commit. The result looks like a single straight line. The replayed commits are **new commits with new IDs**, even though they hold the same changes.",
      ],
    },
    {
      kind: "diagram",
      heading: "Side by side",
      diagram: {
        kind: "table",
        title: "Merge and rebase compared",
        headers: ["", "Merge", "Rebase"],
        rows: [
          ["History", "Keeps the real branching and adds a merge commit", "Linear, as if the work started from the latest main"],
          ["Existing commits", "Unchanged", "Rewritten as new commits with new IDs"],
          ["Conflicts", "Resolved once, in the merge commit", "May need resolving commit by commit"],
          ["Safe on shared branches", "Yes", "No, once others have the commits"],
        ],
      },
    },
    {
      kind: "code",
      heading: "Both in practice",
      example: {
        title: "Update a feature branch",
        language: "bash",
        code: "# option 1: merge main into the feature\ngit switch feature\ngit merge main\n\n# option 2: rebase the feature onto main\ngit switch feature\ngit rebase main\n\n# if a conflict stops the rebase\n# edit the file, then\ngit add file.txt\ngit rebase --continue\n# or give up\ngit rebase --abort",
        walkthrough: [
          "Merging `main` into `feature` adds one merge commit on `feature` and leaves its earlier commits as they were.",
          "Rebasing `feature` onto `main` moves the start of your branch to the tip of `main` and rewrites your commits.",
          "If a conflict occurs while rebasing, Git stops. Fix the file, `git add` it and run `git rebase --continue`. `git rebase --abort` returns to where you started.",
          "After a rebase, a branch that was already pushed has different commit IDs, so a normal push is rejected. `git push --force-with-lease` replaces it, but refuses if someone else pushed in the meantime.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The golden rule and useful variants",
      body: [
        "**Do not rebase commits that exist outside your repository and that people may have based work on.** Rewriting shared history forces everyone else to reconcile the old and new versions. Rebase your own local or personal branches freely.",
        "`git rebase -i` (interactive) lets you reorder, edit, reword, drop or **squash** commits, which is how you tidy a branch before opening a pull request.",
        "`git merge --squash feature` stages all the changes of a branch as one set, ready to commit as a single commit. `git merge --no-ff` forces a merge commit even when a fast-forward is possible.",
        "`git pull --rebase` fetches and rebases your local commits on top of the remote ones instead of creating a merge commit.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Rebasing a branch that teammates have already pulled.",
          fix: "Merge instead, or agree with the team before rewriting shared history.",
        },
        {
          mistake: "Using git push --force after a rebase.",
          fix: "Use --force-with-lease so you do not overwrite work you have not seen.",
        },
        {
          mistake: "Believing rebase changes no commits.",
          fix: "The changes are the same but every replayed commit is new, with a new ID.",
        },
        {
          mistake: "Panicking during a conflicted rebase.",
          fix: "Run git status, fix and continue, or abort to return to the start.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Cleaning up before a pull request",
      scenario:
        "Your feature branch has ten small commits, including 'fix typo' and 'oops'. Only you have the branch.",
      body: [
        "Run `git rebase -i main`, squash the fixup commits into the ones they belong to, reword unclear messages, and then push with `--force-with-lease` if the branch was pushed before.",
        "Reviewers now read a short, clear history. If the branch were shared, you would merge instead.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "rebase-ids",
      prompt: "What happens to your commits when you rebase a branch?",
      options: [
        "They are replayed as new commits with new IDs",
        "They keep their IDs and move unchanged",
        "They are deleted",
      ],
      answer: 0,
      explanation:
        "Rebase recreates each commit on the new base, so the IDs change.",
    },
    {
      type: "single",
      id: "safe-shared",
      prompt: "Which is safe to use on a branch other people have already pulled?",
      options: ["merge", "rebase followed by a force push", "reset --hard followed by a force push"],
      answer: 0,
      explanation:
        "A merge adds history without rewriting it. Rewriting shared history disrupts others.",
    },
    {
      type: "truefalse",
      id: "merge-commit-parents",
      statement: "A merge commit has two parents.",
      answer: true,
      explanation:
        "A true merge commit records both lines of history as its parents.",
    },
    {
      type: "blank",
      id: "interactive-flag",
      prompt: "To squash and reword commits before a pull request, run git rebase ___ main.",
      answer: "-i",
      accepted: ["--interactive"],
      explanation:
        "`git rebase -i` opens an interactive list of commits you can edit.",
    },
  ],
  assignment: {
    title: "Merge once, rebase once",
    task: [
      "In a practice repository, create the same situation twice: a feature branch and a main branch that both have new commits.",
      "Integrate the first with a merge and the second with a rebase, then compare git log --oneline --graph for both.",
    ],
    checklist: [
      "I produced a merge commit with two parents",
      "I produced a linear history using rebase",
      "I resolved a conflict during a rebase and continued",
      "I can state when each approach is the right choice",
    ],
    hints: ["Use git log --oneline --graph --all after each attempt."],
    minutes: 35,
  },
  exercises: [
    {
      slug: "rebase-flow",
      title: "Rebase and push",
      task: [
        "Your private branch feature was already pushed once. Write the commands to rebase it onto main and then update the remote safely.",
      ],
      language: "bash",
      starter: "# your commands",
      solution:
        "git switch feature\ngit rebase main\ngit push --force-with-lease",
      hints: ["The safe force option checks the remote has not moved."],
      checklist: [
        "You rebase onto main while on the branch",
        "The push uses --force-with-lease",
      ],
    },
  ],
  revisionNotes: [
    "Merge keeps history and adds a merge commit; rebase replays commits as new ones",
    "Never rebase commits others already have",
    "rebase --continue / --abort; push --force-with-lease",
    "rebase -i to squash and reword; pull --rebase avoids merge commits",
  ],
  resources: [
    {
      label: "Pro Git: Rebasing",
      url: "https://git-scm.com/book/en/v2/Git-Branching-Rebasing",
    },
    {
      label: "Pro Git: Basic branching and merging",
      url: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging",
    },
    {
      label: "Pro Git: Rewriting history",
      url: "https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History",
    },
  ],
})
