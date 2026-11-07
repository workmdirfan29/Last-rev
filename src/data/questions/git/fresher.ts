import { defineQuestions } from "../author"
import { g } from "../brief"

const D = "https://git-scm.com/docs"
const B = "https://git-scm.com/book/en/v2"

export default defineQuestions("git", "fresher", [
  g({
    slug: "what-is-git",
    topic: "Basics",
    d: "easy",
    title: "What is Git and why do teams use it?",
    kw: ["git", "version control", "distributed", "history", "repository"],
    intent:
      "Checks that you understand the purpose of version control, not just the commands.",
    short:
      "Git is a distributed version control system. It records snapshots of a project over time, so you can see what changed, who changed it and why, go back to an earlier state, and work on separate lines of development at the same time. Every developer has a full copy of the repository with its whole history, so most work happens locally and offline, and teams combine their work by merging branches.",
    detail: [
      "Distributed means there is no single required server. Each clone is a complete repository.",
      "Git stores snapshots of the files at each commit, and stores unchanged files as references to the earlier version.",
      "Teams use it to review changes, undo mistakes safely, work on features in parallel and release from a known state.",
    ],
    ex: "Two developers add different features to the same project on separate branches, and merge both into the main branch after review.",
    mistakes: [
      "Treating Git as a backup tool for files instead of a history of meaningful changes.",
      "Saying Git needs an internet connection for everyday work.",
    ],
    follow: ["What is the difference between Git and GitHub?"],
    points: [
      "Distributed version control",
      "Full history in every clone",
      "Branches allow parallel work",
      "Local and fast",
    ],
    notes: "Git records snapshots; every clone has the full history.",
    src: [
      ["Pro Git: What is Git?", `${B}/Getting-Started-What-is-Git%3F`],
      [
        "Pro Git: About Version Control",
        `${B}/Getting-Started-About-Version-Control`,
      ],
    ],
  }),
  g({
    slug: "git-vs-github",
    topic: "Basics",
    d: "easy",
    title: "What is the difference between Git and GitHub?",
    kw: ["git", "github", "remote", "hosting", "pull request"],
    intent: "Checks a very common confusion between a tool and a service.",
    short:
      "Git is the version control tool that runs on your computer. GitHub is a website and service that hosts Git repositories online and adds collaboration features on top, such as pull requests, issues, code review and access control. You can use Git without GitHub, and other services such as GitLab and Bitbucket host Git repositories too.",
    detail: [
      "Git works on your machine. A hosting service gives the team a shared remote to push to and pull from.",
      "Pull requests, issues and code review are features of the hosting service, not of Git itself.",
      "Moving a repository between hosting services is possible because the history is Git data.",
    ],
    ex: "You commit on your laptop with Git, then push the branch to GitHub and open a pull request for your team to review.",
    mistakes: [
      "Saying that GitHub and Git are the same product.",
      "Thinking a pull request is a Git command.",
    ],
    follow: ["What is a remote?"],
    points: [
      "Git is the tool",
      "GitHub hosts repositories",
      "Pull requests belong to the host",
      "Other hosts exist",
    ],
    notes:
      "Git = tool on your machine. GitHub = hosting and collaboration service.",
    src: [
      ["Pro Git: Getting Started", `${B}/Getting-Started-What-is-Git%3F`],
      [
        "GitHub Docs: About Git",
        "https://docs.github.com/en/get-started/using-git/about-git",
      ],
    ],
  }),
  g({
    slug: "three-areas-of-git",
    topic: "Basics",
    d: "easy",
    title:
      "What are the working directory, the staging area and the repository?",
    kw: ["working directory", "staging area", "index", "repository", "commit"],
    intent:
      "Checks that you understand how a change moves before it becomes a commit.",
    short:
      "The working directory holds the files you are editing. The staging area, also called the index, is where you choose exactly which changes will go into the next commit, using `git add`. The repository, the `.git` folder, stores the committed history. A change moves from the working directory, to the staging area with `git add`, to the repository with `git commit`.",
    detail: [
      "A file can be modified, staged or committed, and it can even have some changes staged and others not.",
      "The staging area lets you build a clean commit from a messy working directory, for example by staging only one fix.",
      "`git status` shows which files are in each area.",
    ],
    ex: "You fix a bug and also tidy a comment in the same file. You stage only the bug fix, commit it, and then commit the tidy-up separately.",
    mistakes: [
      "Thinking `git commit` records every change in the working directory.",
      "Forgetting that a file edited after `git add` has new, unstaged changes.",
    ],
    follow: ["How can you stage only part of a file?"],
    points: [
      "Edit, stage, commit",
      "Index is the staging area",
      "Commit records only what is staged",
    ],
    notes:
      "Working directory → `git add` → staging area → `git commit` → repository.",
    src: [
      [
        "Pro Git: Recording Changes to the Repository",
        `${B}/Git-Basics-Recording-Changes-to-the-Repository`,
      ],
      ["git-add documentation", `${D}/git-add`],
    ],
  }),
  g({
    slug: "init-and-clone",
    topic: "Basics",
    d: "easy",
    title: "What is the difference between `git init` and `git clone`?",
    kw: ["git init", "git clone", "repository", "remote", "origin"],
    intent: "Checks that you know how a repository starts its life.",
    short:
      "`git init` creates a new, empty repository in the current folder by adding a `.git` directory. `git clone <url>` copies an existing repository, with its full history, to your computer, checks out the default branch, and sets up a remote called `origin` that points to where it came from.",
    detail: [
      "Use `init` when you start a project from scratch, then add a remote later with `git remote add`.",
      "Use `clone` to join an existing project. The clone already tracks the remote branches.",
      "`git clone` creates a new folder named after the repository unless you give a name.",
    ],
    ex: "You start a new tool with `git init`, but you join your team's service by cloning its repository.",
    code: [
      "Starting a repository",
      "git init notes-app\ncd notes-app\n\n# or copy an existing one\ngit clone https://example.com/team/service.git\ncd service\ngit remote -v",
      [
        "`git init` makes a new empty repository in `notes-app`.",
        "`git clone` downloads a full copy with the history.",
        "`git remote -v` lists `origin`, which was set up by the clone.",
      ],
    ],
    mistakes: [
      "Running `git init` inside a folder that is already a clone, which creates nested repositories.",
      "Expecting `git init` to download anything.",
    ],
    follow: ["What is origin?"],
    points: [
      "init creates a new repository",
      "clone copies an existing one",
      "clone sets origin",
    ],
    notes: "`init` = new empty repo, `clone` = full copy with `origin`.",
    src: [
      ["git-init documentation", `${D}/git-init`],
      ["git-clone documentation", `${D}/git-clone`],
    ],
  }),
  g({
    slug: "add-and-commit",
    topic: "Basics",
    d: "easy",
    title: "What do `git add` and `git commit` do?",
    kw: ["git add", "git commit", "staging", "snapshot", "commit"],
    intent: "Checks the core everyday workflow.",
    short:
      '`git add <file>` copies the current state of a file into the staging area, ready for the next commit. `git commit -m "message"` takes what is staged and records it as a new commit: a snapshot with an author, a time, a message and a link to its parent commit. Changes that were not staged are not part of the commit.',
    detail: [
      "`git add .` stages changes in the current folder, and `git add -p` lets you pick pieces of a file.",
      "A commit is identified by a hash. It is permanent history on your branch.",
      "`git commit -a` stages already tracked files for you, but it does not add new files.",
    ],
    ex: "After adding a login page, you stage its files and commit them with the message `Add login page`.",
    code: [
      "A basic commit",
      'git status\ngit add src/login.ts\ngit commit -m "Add login form validation"\ngit log --oneline -1',
      [
        "`git status` shows what changed.",
        "`git add` stages only `login.ts`.",
        "`git commit` records the staged snapshot.",
        "`git log --oneline -1` shows the new commit.",
      ],
    ],
    mistakes: [
      "Committing everything with one huge commit.",
      "Forgetting to stage a new file and wondering why it is missing from the commit.",
    ],
    follow: ["What makes a good commit message?"],
    points: [
      "add stages",
      "commit records the staged snapshot",
      "Commits have a hash, author and parent",
    ],
    notes:
      "`add` stages, `commit` records. Unstaged changes are not committed.",
    src: [
      ["git-add documentation", `${D}/git-add`],
      ["git-commit documentation", `${D}/git-commit`],
    ],
  }),
  g({
    slug: "good-commit-messages",
    topic: "Basics",
    d: "easy",
    title: "What makes a good commit message?",
    kw: ["commit message", "history", "subject line", "imperative", "atomic"],
    intent:
      "Checks whether you care about a history that other people can read.",
    short:
      "A good commit message has a short subject line, around 50 characters, written in the imperative, such as `Fix crash when the cart is empty`, followed by a blank line and, when needed, a body that explains why the change was made. Each commit should be one logical change, so the history can be read, reviewed and reverted piece by piece.",
    detail: [
      "The body explains what problem this solves and why this approach, not a line-by-line description. The diff already shows the lines.",
      "Small, focused commits make `git bisect`, `git revert` and code review much easier.",
      "Many teams add a prefix or an issue reference, which follows the team's own convention.",
    ],
    ex: "Instead of `fixed stuff`, the commit says `Validate email before saving the profile`, with a body explaining that blank emails crashed the sender.",
    mistakes: [
      "Messages such as `update` or `changes`.",
      "Mixing a refactor, a bug fix and a new feature in one commit.",
    ],
    follow: ["How would you split a large change into commits?"],
    points: [
      "Short imperative subject",
      "Body explains why",
      "One logical change per commit",
    ],
    notes:
      "Subject: imperative, about 50 characters. Body: why. One change per commit.",
    src: [
      [
        "Pro Git: Commit Guidelines",
        `${B}/Distributed-Git-Contributing-to-a-Project`,
      ],
      ["git-commit documentation", `${D}/git-commit`],
    ],
  }),
  g({
    slug: "status-and-diff",
    topic: "Basics",
    d: "easy",
    title: "How do you see what has changed? (`git status`, `git diff`)",
    kw: ["git status", "git diff", "staged", "changes", "--staged"],
    intent: "Checks that you inspect changes before you commit them.",
    short:
      "`git status` lists which files are modified, staged or untracked. `git diff` shows the line-level changes in the working directory that are not staged yet. `git diff --staged` shows the changes that are staged and will go into the next commit. Checking both before you commit avoids surprises.",
    detail: [
      "`git diff <commit1> <commit2>` compares two commits, and `git diff main...feature` shows what a branch added.",
      "`git status -s` gives a compact view.",
      "Untracked files do not appear in `git diff` until they are added.",
    ],
    ex: "Before committing you run `git diff --staged` and notice a leftover debugging line, so you remove it first.",
    code: [
      "Reading changes",
      "git status\ngit diff              # not staged yet\ngit diff --staged     # what the next commit will contain",
      [
        "`git status` summarises each file.",
        "Plain `git diff` shows unstaged edits.",
        "`--staged` shows what is already staged.",
      ],
    ],
    mistakes: [
      "Running `git diff` and thinking it shows staged files.",
      "Committing without reading the diff.",
    ],
    follow: ["How do you compare two branches?"],
    points: [
      "status: file overview",
      "diff: unstaged lines",
      "diff --staged: next commit",
    ],
    notes: "`diff` = unstaged, `diff --staged` = staged.",
    src: [
      ["git-status documentation", `${D}/git-status`],
      ["git-diff documentation", `${D}/git-diff`],
    ],
  }),
  g({
    slug: "reading-history-with-log",
    topic: "Basics",
    d: "easy",
    title: "How do you look at the history of a repository?",
    kw: ["git log", "history", "oneline", "graph", "blame"],
    intent: "Checks that you can find out who changed what and when.",
    short:
      "`git log` lists commits from newest to oldest. `git log --oneline` shows one line per commit, `--graph` draws the branch structure, and `git log -p` includes the changes. `git log -- <path>` shows commits that touched a file, and `git blame <file>` shows who last changed each line.",
    detail: [
      "`git show <commit>` displays one commit with its changes.",
      '`git log --author="name"` and `--since="2 weeks ago"` filter the list.',
      "`git log --oneline --graph --all` gives a quick map of all branches.",
    ],
    ex: "A line behaves oddly, so you run `git blame` on it, find the commit, and read its message to learn why it was written.",
    code: [
      "Useful log commands",
      "git log --oneline --graph --all\ngit log -p -- src/cart.ts\ngit show a1b2c3d\ngit blame src/cart.ts",
      [
        "The first command is a compact map of every branch.",
        "`-p -- path` shows the changes to one file over time.",
        "`git show` prints a single commit.",
        "`git blame` annotates every line with its last commit.",
      ],
    ],
    mistakes: [
      "Scrolling through a long log instead of filtering it.",
      "Using `blame` to blame a person instead of finding the reason for a change.",
    ],
    follow: ["How do you find which commit introduced a bug?"],
    points: [
      "log lists commits",
      "--oneline and --graph for overview",
      "blame is per line",
    ],
    notes: "`log --oneline --graph`, `log -- <file>`, `show`, `blame`.",
    src: [
      ["git-log documentation", `${D}/git-log`],
      ["git-blame documentation", `${D}/git-blame`],
    ],
  }),
  g({
    slug: "gitignore-file",
    topic: "Basics",
    d: "easy",
    title: "What is a `.gitignore` file used for?",
    kw: [".gitignore", "ignore", "untracked", "node_modules", "secrets"],
    intent: "Checks that you keep generated files and secrets out of history.",
    short:
      "A `.gitignore` file lists patterns of files and folders that Git should not track, such as `node_modules/`, build output, logs and local environment files with secrets. Git then leaves them out of `git status` and `git add`. It only affects files that are not already tracked, so a file that was committed before must be removed from the index with `git rm --cached`.",
    detail: [
      "Patterns support wildcards, and a leading `!` re-includes a file.",
      "Commit the `.gitignore` file itself so that the whole team shares it.",
      "Never rely on it to remove a secret that was already committed. That secret stays in history.",
    ],
    ex: "A Node project ignores `node_modules/`, `dist/` and `.env`, so none of them end up in the repository.",
    code: [
      "A small .gitignore",
      "node_modules/\ndist/\n.env\n*.log\n\n# if .env was tracked by mistake\ngit rm --cached .env",
      [
        "Each line is a pattern. A trailing slash matches a folder.",
        "`git rm --cached` stops tracking the file but keeps it on disk.",
      ],
    ],
    mistakes: [
      "Adding a pattern for a file that is already tracked and expecting it to disappear.",
      "Committing `.env` files with passwords or keys.",
    ],
    follow: ["A password was committed by mistake. What now?"],
    points: [
      "Lists patterns Git should not track",
      "Does not affect tracked files",
      "Commit it with the project",
    ],
    notes:
      "`.gitignore` only affects untracked files. Use `git rm --cached` for tracked ones.",
    src: [
      ["gitignore documentation", `${D}/gitignore`],
      [
        "Pro Git: Ignoring Files",
        `${B}/Git-Basics-Recording-Changes-to-the-Repository`,
      ],
    ],
  }),
  g({
    slug: "what-is-a-branch",
    topic: "Branching",
    d: "easy",
    title: "What is a branch in Git and why is it cheap?",
    kw: ["branch", "pointer", "HEAD", "main", "commit"],
    intent:
      "Checks that you understand branches as lightweight pointers and not as copies.",
    short:
      "A branch is a movable pointer to a commit. Creating one just writes a small file holding a commit hash, so it is instant and costs almost no space, because no files are copied. When you commit on a branch, its pointer moves forward to the new commit. Branches let you work on a feature or a fix in isolation and merge it back later.",
    detail: [
      "`HEAD` is a special pointer that says which branch, and so which commit, you currently have checked out.",
      "The default branch is often called `main`, but it is an ordinary branch with no special powers.",
      "Because branching is cheap, teams create a short branch for each task.",
    ],
    ex: "You create `fix/login-redirect` from `main`, make two commits on it, and merge it back once it is reviewed.",
    mistakes: [
      "Believing a branch is a full copy of the project.",
      "Working for weeks on a long-lived branch that drifts far away from `main`.",
    ],
    follow: ["What is HEAD?"],
    points: [
      "Branch = pointer to a commit",
      "Moves on every commit",
      "HEAD is the current branch",
    ],
    notes:
      "A branch is a lightweight pointer to a commit; creating one is instant.",
    src: [
      [
        "Pro Git: Branches in a Nutshell",
        `${B}/Git-Branching-Branches-in-a-Nutshell`,
      ],
      ["git-branch documentation", `${D}/git-branch`],
    ],
  }),
  g({
    slug: "create-and-switch-branches",
    topic: "Branching",
    d: "easy",
    title:
      "How do you create and switch branches? (`git switch` and `git checkout`)",
    kw: [
      "git switch",
      "git checkout",
      "git branch",
      "create branch",
      "delete branch",
    ],
    intent: "Checks the everyday branch commands.",
    short:
      "`git branch <name>` creates a branch, and `git switch <name>` moves to it. `git switch -c <name>` creates and switches in one step. The older `git checkout <name>` and `git checkout -b <name>` do the same. `git switch` was added to separate branch switching from `git checkout`'s other job of restoring files, which is now done by `git restore`.",
    detail: [
      "`git branch` lists local branches, and `git branch -d <name>` deletes a merged branch.",
      "Git refuses to switch when uncommitted changes would be overwritten. Commit or stash them first.",
      "`git switch -` returns to the previous branch.",
    ],
    ex: "You start a task with `git switch -c feature/search`, and delete the branch with `git branch -d` after it is merged.",
    code: [
      "Branch commands",
      "git switch -c feature/search\ngit branch\ngit switch main\ngit branch -d feature/search",
      [
        "`-c` creates the branch and moves to it.",
        "`git branch` lists local branches.",
        "`git switch main` goes back.",
        "`-d` deletes the branch only if it is already merged.",
      ],
    ],
    mistakes: [
      "Making commits on `main` by accident because you forgot to switch.",
      "Using `git branch -D` and losing unmerged work.",
    ],
    follow: ["What does git checkout do besides switching branches?"],
    points: [
      "switch -c creates and moves",
      "checkout still works",
      "-d deletes only merged branches",
    ],
    notes:
      "`git switch -c name` = create + switch. `-d` safe delete, `-D` force.",
    src: [
      ["git-switch documentation", `${D}/git-switch`],
      ["git-branch documentation", `${D}/git-branch`],
    ],
  }),
  g({
    slug: "head-and-detached-head",
    topic: "Branching",
    d: "medium",
    title: "What is HEAD, and what is a detached HEAD?",
    kw: [
      "HEAD",
      "detached HEAD",
      "checkout commit",
      "branch pointer",
      "reflog",
    ],
    intent: "Checks that you understand Git's idea of the current position.",
    short:
      "HEAD is Git's pointer to the commit you currently have checked out. Normally it points to a branch, and that branch points to a commit. A detached HEAD means HEAD points straight to a commit instead of a branch, for example after `git checkout <hash>` or checking out a tag. Commits made there belong to no branch, so you should create a branch with `git switch -c <name>` before leaving, or they become hard to find.",
    detail: [
      "A detached HEAD is useful for looking at old code or testing an older version.",
      "If you leave without a branch, the commits are not deleted at once, and you can often recover them with `git reflog`.",
      "`HEAD~1` and `HEAD^` mean the parent of the current commit.",
    ],
    ex: "You check out a tag to reproduce a bug from a release. You then want to fix it, so you create a branch from that point.",
    mistakes: [
      "Committing in a detached HEAD state and then switching away without making a branch.",
      "Thinking a detached HEAD means the repository is broken.",
    ],
    follow: ["How do you recover commits made in a detached HEAD?"],
    points: [
      "HEAD = current position",
      "Detached: points to a commit",
      "Create a branch to keep new commits",
    ],
    notes:
      "Detached HEAD: make a branch before you leave, or use the reflog to recover.",
    src: [
      [
        "Pro Git: Git Branching Basics",
        `${B}/Git-Branching-Basic-Branching-and-Merging`,
      ],
      ["git-switch documentation", `${D}/git-switch`],
    ],
  }),
  g({
    slug: "merge-fast-forward-vs-merge-commit",
    topic: "Branching",
    d: "medium",
    title: "What are a fast-forward merge and a three-way merge?",
    kw: ["git merge", "fast-forward", "merge commit", "three-way", "--no-ff"],
    intent: "Checks that you know what `git merge` actually produces.",
    short:
      "`git merge <branch>` brings another branch's commits into the current branch. If the current branch has not moved since the other branch started, Git just moves the pointer forward, which is a fast-forward and creates no new commit. If both branches have new commits, Git does a three-way merge using the common ancestor and creates a merge commit with two parents. `--no-ff` forces a merge commit even when a fast-forward is possible.",
    detail: [
      "A fast-forward keeps a straight, linear history.",
      "A merge commit records that two lines of work were joined and keeps the branch history visible.",
      "Merging does not change the commits on either branch, it only adds to the current one.",
    ],
    ex: "You branch from `main`. Nobody else touches `main`, so merging your branch fast-forwards. If someone else pushed meanwhile, you get a merge commit.",
    code: [
      "Merging a feature",
      "git switch main\ngit merge feature/search\ngit merge --no-ff feature/search",
      [
        "You stand on the branch that receives the changes.",
        "The first merge fast-forwards when it can.",
        "`--no-ff` always records a merge commit.",
      ],
    ],
    mistakes: [
      "Merging while standing on the wrong branch.",
      "Thinking a merge deletes the source branch.",
    ],
    follow: ["What is a merge conflict?"],
    points: [
      "Fast-forward moves the pointer",
      "Three-way creates a merge commit",
      "Merge adds history, never rewrites it",
    ],
    notes:
      "Fast-forward = no new commit. Diverged = merge commit with two parents.",
    src: [
      [
        "Pro Git: Basic Branching and Merging",
        `${B}/Git-Branching-Basic-Branching-and-Merging`,
      ],
      ["git-merge documentation", `${D}/git-merge`],
    ],
  }),
  g({
    slug: "resolving-merge-conflicts",
    topic: "Branching",
    d: "medium",
    title: "What is a merge conflict and how do you resolve one?",
    kw: [
      "merge conflict",
      "conflict markers",
      "resolve",
      "git merge --abort",
      "mergetool",
    ],
    intent: "Checks that you stay calm and know the steps when a merge stops.",
    short:
      "A merge conflict happens when both branches changed the same lines, or one changed a file the other deleted, so Git cannot decide which change to keep. Git stops and marks the file with conflict markers `<<<<<<<`, `=======` and `>>>>>>>`. You edit the file to the correct final content, remove the markers, run `git add` on the file, and finish with `git commit`, or `git merge --continue`. `git merge --abort` returns to the state before the merge.",
    detail: [
      "`git status` shows the files that are in conflict, under `both modified`.",
      "Understand both changes and talk to the other author when it is not clear. Do not just pick one side.",
      "Run the tests after resolving. A conflict-free text can still be a broken program.",
    ],
    ex: "Two people edited the same function. You keep both validation checks, remove the markers, run the tests and commit the merge.",
    code: [
      "A conflict in a file",
      "<<<<<<< HEAD\nconst limit = 10\n=======\nconst limit = 25\n>>>>>>> feature/search\n\n# after editing the file\ngit add src/config.ts\ngit commit",
      [
        "The part above `=======` is your current branch.",
        "The part below is the branch being merged.",
        "Edit to the final content, and delete all three marker lines.",
        "`git add` tells Git the conflict is resolved.",
      ],
    ],
    mistakes: [
      "Leaving conflict markers in the file and committing it.",
      "Accepting one side everywhere without reading it.",
    ],
    follow: ["How can you reduce the number of conflicts?"],
    points: [
      "Same lines changed on both sides",
      "Edit, remove markers, add, commit",
      "--abort undoes the merge attempt",
    ],
    notes: "Fix the file, `git add`, then commit. `--abort` to back out.",
    src: [
      [
        "Pro Git: Basic Merge Conflicts",
        `${B}/Git-Branching-Basic-Branching-and-Merging`,
      ],
      ["git-merge documentation", `${D}/git-merge`],
    ],
  }),
  g({
    slug: "merge-vs-rebase",
    topic: "Merge vs rebase",
    d: "medium",
    title: "What is the difference between `git merge` and `git rebase`?",
    kw: [
      "git rebase",
      "git merge",
      "linear history",
      "rewrite history",
      "merge commit",
    ],
    intent:
      "Checks whether you understand how both integrate work and what each costs.",
    short:
      "Both combine work from one branch into another. Merge joins the two histories with a merge commit and keeps every commit as it was. Rebase takes your branch's commits and replays them on top of another branch, creating new commits with new hashes, which gives a straight, linear history. Merge is non-destructive and keeps the true history, and rebase makes the history cleaner but rewrites it.",
    detail: [
      "A common team habit is to rebase your own feature branch onto `main` to update it, then merge it with a pull request.",
      "After a rebase the old commits still exist for a while, but nothing on the branch points to them.",
      "Conflicts are resolved commit by commit during a rebase, and all at once during a merge.",
    ],
    ex: "Before opening a pull request you run `git rebase main` on your feature branch, so that your commits sit on top of the latest `main`.",
    code: [
      "Updating a feature branch",
      "git switch feature/search\ngit rebase main\n\n# if a conflict stops it\ngit add src/search.ts\ngit rebase --continue",
      [
        "The rebase replays your commits onto the tip of `main`.",
        "On a conflict, fix the file and `git add` it.",
        "`--continue` goes on with the next commit. `--abort` cancels.",
      ],
    ],
    mistakes: [
      "Saying that rebase and merge give the same history.",
      "Rebasing without understanding that commit hashes change.",
    ],
    follow: ["When should you never rebase?"],
    points: [
      "Merge keeps history, adds a merge commit",
      "Rebase replays commits and rewrites them",
      "Rebase gives a linear history",
    ],
    notes: "Merge = keep history. Rebase = replay commits, new hashes, linear.",
    src: [
      ["Pro Git: Rebasing", `${B}/Git-Branching-Rebasing`],
      ["git-rebase documentation", `${D}/git-rebase`],
    ],
  }),
  g({
    slug: "golden-rule-of-rebasing",
    topic: "Merge vs rebase",
    d: "medium",
    title: "What is the golden rule of rebasing?",
    kw: [
      "rebase",
      "shared branch",
      "force push",
      "rewrite history",
      "force-with-lease",
    ],
    intent:
      "Checks that you know the one situation where rebase hurts other people.",
    short:
      "Do not rebase commits that other people already have, such as commits pushed to a shared branch. A rebase creates new commits with new hashes, so a teammate's copy of the old commits no longer matches yours, and pulling then produces duplicates and confusing conflicts. It is safe to rebase commits that exist only on your own machine, or on your own feature branch that nobody else uses.",
    detail: [
      "After rebasing a branch you already pushed, a normal push is rejected. You would have to force it, which is only acceptable on your own branch.",
      "`git push --force-with-lease` is safer than `--force`, because it refuses to overwrite commits you have not seen.",
      "Teams usually forbid force pushes to `main`.",
    ],
    ex: "You rebase your private `fix/typo` branch and force-push it with lease. You never rebase `main`, which everyone uses.",
    mistakes: [
      "Rebasing a shared branch and force-pushing over teammates' work.",
      "Using plain `--force` instead of `--force-with-lease`.",
    ],
    follow: ["What does --force-with-lease do?"],
    points: [
      "Never rebase shared commits",
      "Rebase changes commit hashes",
      "Prefer --force-with-lease on your own branch",
    ],
    notes:
      "Rebase only unpublished or private commits. `--force-with-lease`, not `--force`.",
    src: [
      [
        "Pro Git: The Perils of Rebasing",
        `${B}/Git-Branching-Rebasing#_rebase_peril`,
      ],
      ["git-push documentation", `${D}/git-push`],
    ],
  }),
  g({
    slug: "fetch-vs-pull",
    topic: "Workflows",
    d: "easy",
    title: "What is the difference between `git fetch` and `git pull`?",
    kw: ["git fetch", "git pull", "remote", "origin/main", "update"],
    intent: "Checks whether you know when your own branch is changed.",
    short:
      "`git fetch` downloads new commits and branch updates from the remote and updates the remote-tracking branches such as `origin/main`, but it does not change your own branches or working files. `git pull` is `git fetch` followed by an integration into your current branch, which is a merge by default, or a rebase with `git pull --rebase`.",
    detail: [
      "Fetching first lets you look at what changed with `git log main..origin/main` before you decide to integrate.",
      "`pull` can create a merge commit or conflicts, because it changes your branch.",
      "`git pull --ff-only` refuses anything that is not a fast-forward.",
    ],
    ex: "You run `git fetch`, read the incoming commits, and then merge them when you are ready.",
    code: [
      "Fetch, inspect, integrate",
      "git fetch origin\ngit log --oneline main..origin/main\ngit merge origin/main\n\n# the shortcut\ngit pull",
      [
        "Fetch updates `origin/main` only.",
        "The log shows commits you do not have yet.",
        "Merge brings them into your branch.",
        "`git pull` does fetch and merge in one step.",
      ],
    ],
    mistakes: [
      "Using `git pull` with uncommitted work and getting conflicts.",
      "Thinking that fetch changes your files.",
    ],
    follow: ["What is a remote-tracking branch?"],
    points: [
      "fetch downloads only",
      "pull = fetch + merge (or rebase)",
      "fetch is always safe",
    ],
    notes:
      "`fetch` is safe and changes nothing local. `pull` = fetch + integrate.",
    src: [
      ["git-fetch documentation", `${D}/git-fetch`],
      ["git-pull documentation", `${D}/git-pull`],
    ],
  }),
  g({
    slug: "remotes-and-push",
    topic: "Workflows",
    d: "easy",
    title: "What is a remote, and how do you push a branch?",
    kw: ["remote", "origin", "git push", "upstream", "-u"],
    intent: "Checks that you can share work with the team.",
    short:
      "A remote is a named link to another copy of the repository, usually on a hosting service. The default name is `origin`. `git push origin <branch>` uploads your commits on that branch. The first time you push a new branch, `git push -u origin <branch>` also sets its upstream, so later `git push` and `git pull` need no arguments. `git remote -v` lists your remotes.",
    detail: [
      "A push is rejected if the remote branch has commits you do not have. Fetch and integrate them first.",
      "`git remote add <name> <url>` adds a remote, for example `upstream` for the original repository of a fork.",
      "Pushing does not push tags unless you ask: `git push --tags`.",
    ],
    ex: "You finish a feature and run `git push -u origin feature/search`, then open a pull request.",
    code: [
      "Publishing a branch",
      "git remote -v\ngit push -u origin feature/search\ngit push",
      [
        "`remote -v` shows names and URLs.",
        "`-u` pushes and remembers the upstream.",
        "Later pushes from this branch need no arguments.",
      ],
    ],
    mistakes: [
      "Forgetting `-u` and then wondering why `git pull` asks for a branch.",
      "Force-pushing to fix a rejected push without understanding why it was rejected.",
    ],
    follow: ["Why is my push rejected?"],
    points: [
      "origin is a convention for the main remote",
      "-u sets the upstream",
      "Fetch and integrate when a push is rejected",
    ],
    notes:
      "`git push -u origin <branch>` the first time, then just `git push`.",
    src: [
      ["git-push documentation", `${D}/git-push`],
      ["git-remote documentation", `${D}/git-remote`],
    ],
  }),
  g({
    slug: "pull-request-workflow",
    topic: "GitHub pull requests",
    d: "easy",
    title: "What is a pull request and how does the review flow work?",
    kw: ["pull request", "code review", "feature branch", "merge", "github"],
    intent:
      "Checks that you understand the usual team workflow around branches.",
    short:
      "A pull request is a request to merge the commits of one branch into another, opened on a hosting service such as GitHub. Teammates review the changes, comment on lines, request updates and approve, and automated checks such as tests can run on it. Once it is approved, the branch is merged. The usual flow is: create a branch, commit, push, open a pull request, address the review comments by pushing more commits, then merge and delete the branch.",
    detail: [
      "A pull request shows the diff, the commit list and the discussion in one place.",
      "Many repositories protect `main`, so changes can only enter through a reviewed pull request with passing checks.",
      "The host can merge by a merge commit, a squash into one commit, or a rebase, depending on the repository's settings.",
    ],
    ex: "You push `feature/search`, open a pull request, fix two review comments with new commits, and a teammate approves and merges it.",
    mistakes: [
      "Opening a huge pull request that nobody can review properly.",
      "Pushing straight to `main` when the team uses pull requests.",
    ],
    follow: ["What does squash and merge do?"],
    points: [
      "Request to merge a branch",
      "Review, comments, checks",
      "Often required for protected branches",
    ],
    notes: "Branch, push, pull request, review, merge, delete the branch.",
    src: [
      [
        "GitHub Docs: About pull requests",
        "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests",
      ],
      [
        "Pro Git: Contributing to a Project",
        `${B}/GitHub-Contributing-to-a-Project`,
      ],
    ],
  }),
  g({
    slug: "restore-working-changes",
    topic: "Undoing changes",
    d: "easy",
    title:
      "How do you discard changes in a file, or unstage a file? (`git restore`)",
    kw: ["git restore", "discard changes", "unstage", "--staged", "checkout"],
    intent: "Checks that you can undo an edit safely and know what is lost.",
    short:
      "`git restore <file>` throws away the uncommitted changes in a file and brings back the version from the last commit or the index. This cannot be undone, because those edits were never committed. `git restore --staged <file>` removes a file from the staging area and keeps your edits in the working directory. These replace the older `git checkout -- <file>` and `git reset HEAD <file>`.",
    detail: [
      "Check with `git diff` before you discard, so you know what will be lost.",
      "To keep the work for later instead of deleting it, use `git stash`.",
      "`git restore --source=<commit> <file>` brings back a file as it was in another commit.",
    ],
    ex: "You staged `config.json` by mistake. `git restore --staged config.json` unstages it and leaves your changes in place.",
    code: [
      "Two different undos",
      "git restore --staged src/config.ts   # unstage, keep the edit\ngit restore src/config.ts            # discard the edit",
      [
        "The first command only changes the staging area.",
        "The second one overwrites the working file with the committed version.",
      ],
    ],
    mistakes: [
      "Discarding changes that were never committed and then wanting them back.",
      "Mixing up unstage and discard.",
    ],
    follow: ["How can you recover discarded uncommitted changes?"],
    points: [
      "restore discards edits permanently",
      "--staged only unstages",
      "Replaces checkout -- file",
    ],
    notes: "`restore --staged` = unstage. `restore` = discard (permanent).",
    src: [
      ["git-restore documentation", `${D}/git-restore`],
      ["Pro Git: Undoing Things", `${B}/Git-Basics-Undoing-Things`],
    ],
  }),
  g({
    slug: "reset-soft-mixed-hard",
    topic: "Undoing changes",
    d: "medium",
    title: "What do `git reset --soft`, `--mixed` and `--hard` do?",
    kw: ["git reset", "--soft", "--mixed", "--hard", "HEAD~1"],
    intent:
      "Checks whether you know what each reset keeps and what it destroys.",
    short:
      "`git reset <commit>` moves the current branch to another commit. `--soft` moves only the branch, so the undone changes stay staged. `--mixed`, the default, moves the branch and clears the staging area, so the changes stay in your files as unstaged edits. `--hard` moves the branch and also resets the staging area and the working files to that commit, which discards uncommitted work.",
    detail: [
      "`git reset --soft HEAD~1` undoes the last commit but keeps everything ready to commit again.",
      "`--hard` is the only mode that destroys uncommitted changes, so use it carefully.",
      "Reset rewrites the branch. Do not reset commits that have been pushed and shared.",
    ],
    ex: "You committed too early. `git reset --soft HEAD~1` removes the commit, but keeps the changes staged so you can add a missing file and commit again.",
    code: [
      "Undoing the last commit",
      "git reset --soft HEAD~1   # keep changes staged\ngit reset HEAD~1          # keep changes, unstaged (mixed)\ngit reset --hard HEAD~1   # discard the commit and the changes",
      [
        "All three move the branch back by one commit.",
        "They differ in what happens to the index and the files.",
        "Only `--hard` throws the changes away.",
      ],
    ],
    mistakes: [
      "Running `--hard` with uncommitted work you wanted.",
      "Resetting a shared branch and then force-pushing.",
    ],
    follow: ["What is the difference between reset and revert?"],
    points: [
      "soft: keep staged",
      "mixed: keep unstaged",
      "hard: discard everything",
    ],
    notes: "soft keeps index and files, mixed keeps files, hard keeps nothing.",
    src: [
      ["git-reset documentation", `${D}/git-reset`],
      ["Pro Git: Reset Demystified", `${B}/Git-Tools-Reset-Demystified`],
    ],
  }),
  g({
    slug: "revert-vs-reset",
    topic: "Undoing changes",
    d: "medium",
    title: "What is the difference between `git revert` and `git reset`?",
    kw: ["git revert", "git reset", "undo commit", "shared branch", "history"],
    intent: "Checks that you can undo a commit safely on a shared branch.",
    short:
      "`git revert <commit>` creates a new commit that applies the opposite of an earlier commit, so the history stays intact and the undo is recorded. `git reset` moves the branch pointer back and drops commits from the branch, which rewrites history. Use `revert` for commits that are already pushed and shared, and `reset` for local commits that nobody else has.",
    detail: [
      "A revert can be reverted again, and it does not break anyone's copy of the branch.",
      "Reverting a merge commit needs the `-m` option to choose the parent to keep.",
      "A revert undoes one commit's changes. It does not remove the old commit.",
    ],
    ex: "A bad commit reached `main` and was pushed. You run `git revert <hash>` and push the new revert commit.",
    code: [
      "Undo a pushed commit",
      "git log --oneline -3\ngit revert a1b2c3d\ngit push",
      [
        "Find the hash of the bad commit.",
        "`revert` adds a new commit that cancels it.",
        "A normal push is enough, because no history was rewritten.",
      ],
    ],
    mistakes: [
      "Using `reset --hard` and force-push on a shared branch to undo something.",
      "Thinking that revert deletes the commit.",
    ],
    follow: ["How do you revert a merge commit?"],
    points: [
      "revert adds an undo commit",
      "reset rewrites history",
      "Revert for shared, reset for local",
    ],
    notes: "Shared branch → `revert`. Local-only commits → `reset`.",
    src: [
      ["git-revert documentation", `${D}/git-revert`],
      ["git-reset documentation", `${D}/git-reset`],
    ],
  }),
  g({
    slug: "amend-last-commit",
    topic: "Undoing changes",
    d: "easy",
    title: "How do you fix the last commit? (`git commit --amend`)",
    kw: [
      "git commit --amend",
      "last commit",
      "message",
      "rewrite",
      "--no-edit",
    ],
    intent: "Checks that you can correct a recent commit and know the limit.",
    short:
      "`git commit --amend` replaces the last commit with a new one. You can change its message, or stage more changes first and have them included. It creates a new commit with a new hash, so it rewrites history. Amend only a commit that has not been pushed, or one on your own branch where you can safely force-push with lease.",
    detail: [
      "`git commit --amend --no-edit` adds staged changes and keeps the old message.",
      "Only the latest commit can be amended directly. For older ones use an interactive rebase.",
      "The old commit stays in the reflog for a while.",
    ],
    ex: "You forgot to add a test file to your commit. You stage it and run `git commit --amend --no-edit`.",
    code: [
      "Add a forgotten file",
      "git add tests/search.test.ts\ngit commit --amend --no-edit",
      [
        "The forgotten file is staged.",
        "`--amend` rewrites the last commit to include it.",
        "`--no-edit` keeps the existing message.",
      ],
    ],
    mistakes: [
      "Amending a commit that is already pushed and shared.",
      "Thinking that amend edits the commit in place. It makes a new one.",
    ],
    follow: ["How do you change a commit that is not the latest?"],
    points: [
      "Replaces the last commit",
      "New hash, rewrites history",
      "Only for unpublished commits",
    ],
    notes:
      "`--amend` = new commit replacing the last one. Not for pushed commits.",
    src: [
      ["git-commit documentation", `${D}/git-commit`],
      ["Pro Git: Undoing Things", `${B}/Git-Basics-Undoing-Things`],
    ],
  }),
  g({
    slug: "git-stash",
    topic: "Workflows",
    d: "easy",
    title: "What does `git stash` do and when do you use it?",
    kw: [
      "git stash",
      "stash pop",
      "stash apply",
      "uncommitted",
      "switch branch",
    ],
    intent: "Checks that you can pause work without making a messy commit.",
    short:
      "`git stash` saves your uncommitted changes to a stack and returns the working directory to the last commit, so you can switch to something else. `git stash pop` brings back the most recent stash and removes it from the stack, and `git stash apply` brings it back and keeps it. `git stash list` shows what is saved. By default only tracked files are stashed, and `-u` includes untracked files.",
    detail: [
      "It is useful when you must switch branches for an urgent fix and your current work is not ready to commit.",
      "Stashes belong to your local repository and are not pushed.",
      "A stash can cause a conflict when it is applied onto changed code.",
    ],
    ex: "You are halfway through a feature when a bug report arrives. You stash, fix the bug on another branch, and then pop your work.",
    code: [
      "Pause and resume",
      'git stash push -m "search form WIP"\ngit switch main\n# ...fix something...\ngit switch feature/search\ngit stash pop',
      [
        "`stash push -m` saves the work with a label.",
        "The working directory is clean, so switching is safe.",
        "`pop` restores the saved changes.",
      ],
    ],
    mistakes: [
      "Forgetting stashes for weeks and losing track of them.",
      "Expecting untracked files to be stashed without `-u`.",
    ],
    follow: ["What is the difference between stash pop and stash apply?"],
    points: [
      "Saves uncommitted work on a stack",
      "pop removes, apply keeps",
      "-u for untracked files",
    ],
    notes: "`stash push`, `stash list`, `stash pop`. Use `-u` for new files.",
    src: [
      ["git-stash documentation", `${D}/git-stash`],
      [
        "Pro Git: Stashing and Cleaning",
        `${B}/Git-Tools-Stashing-and-Cleaning`,
      ],
    ],
  }),
  g({
    slug: "cherry-pick",
    topic: "Workflows",
    d: "medium",
    title: "What does `git cherry-pick` do?",
    kw: [
      "git cherry-pick",
      "single commit",
      "hotfix",
      "backport",
      "copy commit",
    ],
    intent: "Checks that you can move one change between branches.",
    short:
      "`git cherry-pick <commit>` applies the changes of one existing commit onto the current branch as a new commit, with a new hash. It is used to take a single fix from one branch to another without merging the whole branch, for example backporting a bug fix to a release branch.",
    detail: [
      "It can conflict, and you resolve it like a merge, then run `git cherry-pick --continue`.",
      "Several commits can be picked in a row, or a range with `A..B`.",
      "Overusing it creates duplicate commits and makes history harder to follow.",
    ],
    ex: "A bug was fixed on `main`. You cherry-pick that single fix onto `release/1.4` and ship a patch.",
    code: [
      "Backport one fix",
      "git switch release/1.4\ngit cherry-pick a1b2c3d",
      [
        "You stand on the branch that should receive the fix.",
        "The commit's change is applied as a new commit.",
      ],
    ],
    mistakes: [
      "Cherry-picking many commits instead of merging a branch.",
      "Forgetting that it creates a copy, so the same change exists twice.",
    ],
    follow: ["What happens when a cherry-pick conflicts?"],
    points: [
      "Copies one commit onto the current branch",
      "New commit, new hash",
      "Good for backports",
    ],
    notes: "`cherry-pick <hash>` = copy one commit to here.",
    src: [
      ["git-cherry-pick documentation", `${D}/git-cherry-pick`],
      ["Pro Git: Rebasing (cherry-pick)", `${B}/Git-Branching-Rebasing`],
    ],
  }),
  g({
    slug: "git-tags",
    topic: "Workflows",
    d: "easy",
    title: "What is a Git tag? Lightweight and annotated tags",
    kw: ["git tag", "release", "annotated tag", "lightweight tag", "version"],
    intent: "Checks that you can mark releases in history.",
    short:
      'A tag is a fixed name for a specific commit, usually used to mark a release such as `v1.2.0`. Unlike a branch, it does not move. A lightweight tag is just a name that points to a commit. An annotated tag, created with `git tag -a v1.2.0 -m "message"`, is a full object that stores the tagger, the date and a message, and it is the form recommended for releases. Tags are not pushed by default, so use `git push origin v1.2.0` or `git push --tags`.',
    detail: [
      "`git tag` lists tags, and `git checkout v1.2.0` or `git switch --detach v1.2.0` looks at that version.",
      "`git tag -d <name>` deletes a tag locally.",
      "Semantic versioning, such as major.minor.patch, is a common naming convention.",
    ],
    ex: "After the release is tested, the team tags the commit `v2.0.0` and pushes the tag, and CI builds the release from it.",
    code: [
      "Tagging a release",
      'git tag -a v1.2.0 -m "Release 1.2.0"\ngit push origin v1.2.0\ngit tag',
      [
        "`-a` creates an annotated tag with a message.",
        "Tags must be pushed explicitly.",
        "`git tag` lists them.",
      ],
    ],
    mistakes: [
      "Thinking a tag moves like a branch.",
      "Creating a tag and forgetting to push it.",
    ],
    follow: ["How do you check out the code of an old release?"],
    points: [
      "Fixed name for a commit",
      "Annotated tags store a message",
      "Push tags explicitly",
    ],
    notes:
      "Annotated tag for releases: `git tag -a v1.0.0 -m ...`, then push it.",
    src: [
      ["git-tag documentation", `${D}/git-tag`],
      ["Pro Git: Tagging", `${B}/Git-Basics-Tagging`],
    ],
  }),
  g({
    slug: "recover-with-reflog",
    topic: "Undoing changes",
    d: "hard",
    title: "How can you recover a commit you thought you lost? (`git reflog`)",
    kw: ["git reflog", "recover", "lost commit", "reset --hard", "HEAD@{1}"],
    intent: "Checks that you know history is rarely truly gone.",
    short:
      "`git reflog` shows a local log of where `HEAD` and your branches have pointed over time, including after resets, rebases and switches. If you lose commits after a bad reset or a deleted branch, you find the commit's hash in the reflog and run `git switch -c <name> <hash>` or `git reset --hard <hash>` to bring it back. The reflog is local, and old entries are removed after a time, so recover soon.",
    detail: [
      "Commits that are not reachable from any branch are not deleted at once, they are cleaned up later by garbage collection.",
      "`HEAD@{1}` means where HEAD was one move ago.",
      "The reflog does not recover uncommitted changes that were discarded, because they were never recorded.",
    ],
    ex: "After `git reset --hard HEAD~3`, you notice you wanted those commits. `git reflog` shows the old tip, and you reset back to it.",
    code: [
      "Getting a lost commit back",
      "git reflog\ngit switch -c rescued a1b2c3d",
      [
        "The reflog lists recent positions of HEAD with their hashes.",
        "A new branch at that hash makes the commit reachable again.",
      ],
    ],
    mistakes: [
      "Believing a hard reset destroys committed work forever.",
      "Expecting the reflog to help with files that were never committed.",
    ],
    follow: ["What does git gc do to unreachable commits?"],
    points: [
      "Local log of HEAD movements",
      "Recovers committed work",
      "Does not recover uncommitted edits",
    ],
    notes: "`git reflog` → find hash → `git switch -c name <hash>`.",
    src: [
      ["git-reflog documentation", `${D}/git-reflog`],
      [
        "Pro Git: Maintenance and Data Recovery",
        `${B}/Git-Internals-Maintenance-and-Data-Recovery`,
      ],
    ],
  }),
  g({
    slug: "forks-and-upstream",
    topic: "GitHub repositories & forks",
    d: "medium",
    title: "What is a fork, and how do you keep it up to date?",
    kw: ["fork", "upstream", "origin", "open source", "sync fork"],
    intent: "Checks that you can contribute to a repository you do not own.",
    short:
      "A fork is your own copy of someone else's repository on the hosting service. You clone your fork, create a branch, push to it, and open a pull request to the original repository. The usual remote names are `origin` for your fork and `upstream` for the original. To keep your fork current, you fetch `upstream` and merge or rebase its default branch into yours.",
    detail: [
      "Forks are common in open source, where contributors cannot push to the main repository.",
      "Inside a company, teams usually share one repository and use branches instead of forks.",
      "GitHub also has a button to sync a fork with its upstream.",
    ],
    ex: "You fork a library, fix a typo on a branch of your fork, and open a pull request to the library's maintainers.",
    code: [
      "Sync a fork",
      "git remote add upstream https://example.com/original/lib.git\ngit fetch upstream\ngit switch main\ngit merge upstream/main",
      [
        "`upstream` points at the original repository.",
        "Fetch downloads its latest commits.",
        "Merge brings them into your local `main`.",
      ],
    ],
    mistakes: [
      "Committing to the fork's `main` and then having trouble syncing.",
      "Confusing `origin` and `upstream`.",
    ],
    follow: ["When would a team use branches instead of forks?"],
    points: [
      "Fork = your copy on the host",
      "origin = fork, upstream = original",
      "Contribute through a pull request",
    ],
    notes: "Fork, clone, branch, push, pull request. Sync with `upstream`.",
    src: [
      [
        "GitHub Docs: About forks",
        "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks",
      ],
      [
        "GitHub Docs: Syncing a fork",
        "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork",
      ],
    ],
  }),
  g({
    slug: "branching-strategies",
    topic: "Workflows",
    d: "medium",
    title:
      "What are common branching workflows, such as feature branches and trunk-based development?",
    kw: [
      "branching strategy",
      "feature branch",
      "trunk-based",
      "gitflow",
      "release branch",
    ],
    intent: "Checks that you have seen how teams organise branches.",
    short:
      "In a feature-branch workflow, every task gets its own short branch from `main` and is merged back through a pull request. Trunk-based development keeps branches very short, merges to `main` many times a day, and uses feature flags to hide unfinished work. Gitflow uses long-lived `develop` and `release` branches and suits planned release cycles, but it adds more merging. The right choice depends on how often the team releases and how much automation it has.",
    detail: [
      "Short branches reduce merge conflicts, because less time passes between branching and merging.",
      "Release branches let a team stabilise a version while new work continues on `main`.",
      "Whatever the model, the team should agree on branch names, review rules and who may merge.",
    ],
    ex: "A web team that deploys several times a day uses short feature branches and pull requests into a protected `main`.",
    mistakes: [
      "Keeping feature branches alive for weeks.",
      "Having no agreed workflow, so everyone pushes where they like.",
    ],
    follow: ["What is a feature flag?"],
    points: [
      "Feature branch plus pull request is the common default",
      "Trunk-based: very short branches",
      "Gitflow: long-lived release branches",
    ],
    notes:
      "Short branches + pull requests. Match the workflow to the release rhythm.",
    src: [
      [
        "Pro Git: Branching Workflows",
        `${B}/Git-Branching-Branching-Workflows`,
      ],
      ["gitworkflows documentation", `${D}/gitworkflows`],
    ],
  }),
  g({
    slug: "find-a-bug-with-bisect",
    topic: "Undoing changes",
    d: "hard",
    title:
      "How does `git bisect` help you find the commit that broke something?",
    kw: [
      "git bisect",
      "binary search",
      "regression",
      "good commit",
      "bad commit",
    ],
    intent: "Checks that you have a method for finding where a bug started.",
    short:
      "`git bisect` does a binary search through history. You mark a commit that is bad, the current one, and an older commit that was good. Git checks out the commit in the middle, you test it and tell Git `good` or `bad`, and it halves the range again until it names the first bad commit. With many commits, it needs only a few steps, and `git bisect run <script>` can automate the test.",
    detail: [
      "Small, focused commits make the answer much more useful.",
      "`git bisect reset` returns you to your original branch when you finish.",
      "The test must give a clear pass or fail for the same bug at each step.",
    ],
    ex: "A page broke sometime in the last 200 commits. In about eight steps, bisect points at the commit that changed the date parsing.",
    code: [
      "A bisect session",
      "git bisect start\ngit bisect bad\ngit bisect good v1.4.0\n# test, then mark: git bisect good / git bisect bad\ngit bisect reset",
      [
        "`start` begins the session.",
        "`bad` marks the current commit and `good` marks a known-good tag.",
        "Each test narrows the range, and `reset` ends it.",
      ],
    ],
    mistakes: [
      "Marking a commit good or bad without testing the same condition each time.",
      "Forgetting `git bisect reset` and staying on a detached HEAD.",
    ],
    follow: ["How do you automate a bisect?"],
    points: [
      "Binary search over history",
      "Needs one good and one bad commit",
      "run automates the test",
    ],
    notes:
      "`bisect start`, mark `bad` and `good`, repeat, then `bisect reset`.",
    src: [
      ["git-bisect documentation", `${D}/git-bisect`],
      ["Pro Git: Debugging with Git", `${B}/Git-Tools-Debugging-with-Git`],
    ],
  }),
])
