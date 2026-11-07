import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "pipes-and-redirection",
  title: "Pipes and redirection",
  topic: "Pipes & redirect",
  minutes: 18,
  overview:
    "Send command output into files with > and >>, into other commands with |, to the screen and a file with tee, and redirect error messages.",
  objectives: [
    "Overwrite a file with > and append with >>",
    "Chain commands with a pipe",
    "Use tee to write to the screen and a file",
    "Redirect error output with 2>",
  ],
  prerequisites: ["lesson.linux-commands.viewing-files"],
  sections: [
    {
      kind: "explain",
      heading: "Standard streams",
      body: [
        "Every command has three streams: **standard input** (0), **standard output** (1) and **standard error** (2). By default output and errors appear on the screen. The shell can redirect them before the command runs.",
        "`command > file` sends standard output to a file, **overwriting** it. `command >> file` **appends**. `command1 | command2` connects the output of the first to the input of the second. `tee file` copies its input to the file **and** to the screen. `2> file` redirects only the error stream.",
      ],
    },
    {
      kind: "code",
      heading: "Redirect, pipe and tee",
      example: {
        title: "Streams in practice",
        language: "bash",
        code: 'echo one > f.txt\necho two >> f.txt\necho three > f.txt\ncat f.txt\necho hi | tee out.txt\necho more | tee -a out.txt > /dev/null\ncat out.txt\nls nofile 2> err.txt\ncat err.txt\nls nofile > /dev/null 2>&1; echo "exit=$?"\necho "a b c" | wc -w\nprintf "b\\na\\nc\\n" | sort | head -n 2',
        walkthrough: [
          "`echo one > f.txt` creates the file; `>>` adds a second line; the next `>` **replaces** everything, so the file now holds only `three`.",
          "`echo hi | tee out.txt` shows `hi` on the screen and also writes it to `out.txt`. With `-a`, `tee` appends instead of overwriting; the extra `> /dev/null` hides the screen copy. `cat out.txt` then prints `hi` and `more`.",
          "`ls nofile 2> err.txt` saves the error message in `err.txt` instead of showing it.",
          "`> /dev/null 2>&1` throws away both output and errors; the exit status `2` still tells you the command failed.",
          "A pipe passes output along: `wc -w` counts `3` words, and `sort | head -n 2` prints the first two sorted lines, `a` and `b`.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Operators",
      diagram: {
        kind: "table",
        title: "Redirection cheat sheet",
        headers: ["Operator", "Meaning"],
        rows: [
          ["> file", "Standard output to file (overwrite)"],
          [">> file", "Standard output appended to file"],
          ["2> file", "Standard error to file"],
          ["2>&1", "Send errors to the same place as output"],
          ["a | b", "Output of a becomes input of b"],
          ["| tee file", "Output to the screen and to file"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using > when you meant >>.",
          fix: "A single > destroys the old content. Think twice before you redirect to an existing file.",
        },
        {
          mistake:
            "Redirecting a file onto itself, such as sort f.txt > f.txt.",
          fix: "The shell empties the file first. Write to a new file, or use sort -o.",
        },
        {
          mistake: "Expecting > to capture error messages.",
          fix: "Use 2> or 2>&1.",
        },
        {
          mistake:
            "Forgetting the space is optional but quoting matters: echo a > b writes to a file named b.",
          fix: "Check the target name.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Saving command output",
      scenario:
        "You want a record of which processes were running and to see it at the same time.",
      body: [
        "`ps -ef | tee processes.txt` prints the list and saves it. To keep several snapshots in one file, use `ps -ef >> history.txt`.",
        "`command > out.txt 2> err.txt` splits normal output and errors into two files.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "append-op",
      prompt: "Which operator appends to a file?",
      options: [">>", ">", "|"],
      answer: 0,
      explanation: ">> appends; > overwrites.",
    },
    {
      type: "output",
      id: "overwrite-out",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "echo one > f.txt\necho two > f.txt\ncat f.txt",
      },
      options: ["two", "one two", "one"],
      answer: 0,
      explanation: "The second > replaced the file.",
    },
    {
      type: "truefalse",
      id: "tee-both",
      statement: "tee writes its input to the screen and to a file.",
      answer: true,
      explanation: "That is the purpose of tee.",
    },
    {
      type: "blank",
      id: "error-redir",
      prompt: "To send only error messages to a file, use ___> errors.txt.",
      answer: "2",
      explanation: "File descriptor 2 is standard error.",
    },
  ],
  assignment: {
    title: "Stream practice",
    task: [
      "Create a file with > and add two lines with >>. Then show the file and the number of lines in one pipeline.",
      "Run a command that fails, save its error to a file with 2>, and also use tee once.",
    ],
    checklist: [
      "> and >> were both used",
      "A pipe connected two commands",
      "2> captured an error message",
      "tee produced output on screen and in a file",
    ],
    hints: ["ls /nonexistent 2> err.txt"],
    minutes: 10,
  },
  exercises: [
    {
      slug: "redirect-recipes",
      title: "Redirect it",
      task: [
        "Write commands to: (1) save the sorted lines of names.txt into sorted.txt; (2) append the date to log.txt; (3) show the first 3 lines of names.txt and also save them to top3.txt.",
      ],
      language: "bash",
      starter: "# 1\n# 2\n# 3",
      solution:
        "sort names.txt > sorted.txt\ndate >> log.txt\nhead -n 3 names.txt | tee top3.txt",
      hints: ["Use tee for the third."],
      checklist: ["> for the overwrite", ">> for the append", "tee for both"],
    },
  ],
  revisionNotes: [
    "> overwrite, >> append, | pipe, tee both, 2> errors, 2>&1 merge",
    "A pipe connects stdout to stdin",
    "Never redirect a file onto itself",
    "Check > versus >> before you press Enter",
  ],
  resources: [
    {
      label: "tee(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/tee.1.html",
    },
    {
      label: "Bash manual: Redirections",
      url: "https://www.gnu.org/software/bash/manual/html_node/Redirections.html",
    },
    {
      label: "pipe(7): overview of pipes",
      url: "https://man7.org/linux/man-pages/man7/pipe.7.html",
    },
  ],
})
