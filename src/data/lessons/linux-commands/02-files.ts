import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "files",
  title: "Creating and removing files",
  topic: "Files",
  minutes: 48,
  overview:
    "Create empty files with touch, delete files with rm, use wildcards and the -r, -f and -i options, and learn why deletion has no undo.",
  objectives: [
    "Create one or several files with touch",
    "Delete files with rm, including by pattern",
    "Use rm -r for directories, rm -f to ignore missing files and rm -i to confirm",
    "Explain the risk of rm -rf",
  ],
  prerequisites: ["lesson.linux-commands.directories"],
  sections: [
    {
      kind: "explain",
      heading: "Files and deletion",
      body: [
        "`touch name` creates an empty file if it does not exist (and, if it does exist, updates its modification time). `rm name` removes a file. On Linux, `rm` does **not** move files to a trash: the file is gone, and there is no undo.",
        "Because of this, check what a pattern matches before you delete: `ls *.log` shows what `rm *.log` would remove. The shell expands `*` before `rm` runs.",
      ],
    },
    {
      kind: "code",
      heading: "touch and rm",
      example: {
        title: "Create and delete",
        language: "bash",
        code: 'touch notes.txt\ntouch a.txt b.txt c.txt\nls\nrm notes.txt\nrm a.txt b.txt\nls\ntouch x.log y.log z.txt\nrm *.log\nls\nmkdir -p d/e && touch d/e/f\nrm d\nrm -r d\nls\nrm missing.txt\nrm -f missing.txt; echo "exit=$?"',
        walkthrough: [
          "`touch` creates `notes.txt`, then three more files. The first `ls` shows `a.txt b.txt c.txt notes.txt`.",
          "`rm notes.txt` deletes one file; `rm a.txt b.txt` deletes two. Only `c.txt` is left.",
          "`rm *.log` uses a **wildcard**: the shell replaces `*.log` with `x.log y.log`, so both are removed and `c.txt z.txt` remain.",
          "`rm d` fails with `rm: cannot remove 'd': Is a directory`. `rm -r d` removes the directory **recursively**, with everything inside it.",
          "`rm missing.txt` reports `No such file or directory`. With `-f` (force), `rm` ignores files that do not exist and never asks, so the exit status is `0`.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "The options you will use",
      diagram: {
        kind: "table",
        title: "rm options",
        headers: ["Option", "Meaning", "Risk"],
        rows: [
          ["rm file", "Delete a file", "Permanent"],
          [
            "rm -r dir",
            "Delete a directory and everything in it",
            "Deletes the whole tree",
          ],
          ["rm -i file", "Ask before each deletion", "Safest for beginners"],
          ["rm -f file", "Never ask; ignore missing files", "No safety prompt"],
          [
            "rm -rf dir",
            "Force-delete a tree without asking",
            "The most dangerous combination",
          ],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Staying safe",
      body: [
        "Never run `rm -rf` with a path you have not checked, and never with a variable that might be empty (`rm -rf \"$DIR\"/` becomes `rm -rf /` if `DIR` is empty on some systems). Use `rm -i` while learning: it asks `rm: remove regular file 'x'?` and only a `y` answer deletes.",
        "Use `ls` first, then recall the command with the up arrow and replace `ls` with `rm`. In the practice terminal you can experiment freely; on a real server, there is no undo.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Running rm -rf with a typo, such as a stray space: rm -rf dir /",
          fix: "Read the command twice; use ls on the same path first.",
        },
        {
          mistake: "Expecting a recycle bin.",
          fix: "rm deletes permanently; keep backups of important data.",
        },
        {
          mistake: "Using rm on a directory and being confused by the error.",
          fix: "Use rm -r for directories, or rmdir for empty ones.",
        },
        {
          mistake: "Using * without checking what it matches.",
          fix: "Run ls with the same pattern first.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Cleaning log files",
      scenario:
        "A project folder has many *.log and *.tmp files and you want to remove only the logs.",
      body: [
        "`ls *.log` lists exactly what would go. If the list is right, `rm *.log` removes them and leaves other files alone. Use `rm -i *.log` if you want to confirm each file.",
        "Never start with `rm -rf *` in a folder you have not looked at.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "rm-dir-error",
      prompt: "What happens when you run rm on a directory without options?",
      options: [
        "It fails: 'Is a directory'",
        "It deletes the directory",
        "It moves it to the trash",
      ],
      answer: 0,
      explanation: "Use rm -r (or rmdir for an empty directory).",
    },
    {
      type: "output",
      id: "wildcard-rm",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "touch x.log y.log z.txt\nrm *.log\nls",
      },
      options: ["z.txt", "x.log y.log z.txt", "x.log y.log"],
      answer: 0,
      explanation:
        "The shell expands *.log to x.log and y.log, so only z.txt is left.",
    },
    {
      type: "truefalse",
      id: "rm-trash",
      statement:
        "Files deleted with rm go to a trash folder and can be restored.",
      answer: false,
      explanation: "rm deletes permanently; there is no undo.",
    },
    {
      type: "blank",
      id: "confirm-flag",
      prompt: "To make rm ask before every deletion, use rm -___ file.",
      answer: "i",
      explanation: "`-i` is interactive mode.",
      accepted: ["--interactive"],
    },
  ],
  assignment: {
    title: "Safe cleanup",
    task: [
      "In a practice folder, create ten files with different extensions using touch.",
      "List only one extension, delete those files, and show the result. Then delete a directory tree with rm -r and explain why you used ls first.",
    ],
    checklist: [
      "touch created several files in one command",
      "I previewed the wildcard with ls",
      "I deleted by pattern",
      "I used rm -r on a practice directory only",
    ],
    hints: ["Brace expansion works too: touch file{1..5}.txt"],
    minutes: 20,
  },
  exercises: [
    {
      slug: "clean-logs",
      title: "Delete by pattern",
      task: [
        "Create app.log, db.log and readme.txt, preview the .log files, then delete only the .log files.",
      ],
      language: "bash",
      starter: "# your commands",
      solution: "touch app.log db.log readme.txt\nls *.log\nrm *.log",
      hints: ["Use ls with the same pattern before rm."],
      checklist: ["The wildcard is previewed with ls", "readme.txt survives"],
    },
  ],
  revisionNotes: [
    "touch creates empty files; rm deletes permanently",
    "rm -r for directories, -f ignores missing and never asks, -i asks first",
    "The shell expands wildcards before rm runs: preview with ls",
    "Avoid rm -rf on unchecked paths",
  ],
  resources: [
    {
      label: "touch(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/touch.1.html",
    },
    {
      label: "rm(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/rm.1.html",
    },
    {
      label: "glob(7): shell wildcard patterns",
      url: "https://man7.org/linux/man-pages/man7/glob.7.html",
    },
  ],
})
