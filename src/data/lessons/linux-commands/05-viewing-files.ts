import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "viewing-files",
  title: "Viewing and writing text files",
  topic: "View files",
  minutes: 42,
  overview:
    "Read files with cat, tac, more, head and tail, and write small files from the terminal with cat and redirection.",
  objectives: [
    "Show a whole file with cat and in reverse with tac",
    "Page through a long file with more",
    "Show the first or last lines with head and tail",
    "Create and append to a file with cat and redirection",
  ],
  prerequisites: ["lesson.linux-commands.listing-ls"],
  sections: [
    {
      kind: "explain",
      heading: "Reading files",
      body: [
        "`cat file` prints a file completely (the name comes from *concatenate*: with several files it prints them one after another). `tac` does the same in **reverse line order** (it is `cat` backwards). For a file that is longer than the screen, `more file` shows one page at a time: press the space bar for the next page and `q` to quit.",
        "`head` prints the first lines and `tail` the last lines. Both default to 10; give a number with `-n`: `head -n 2 file`. The older form `head -2 file` also works. `tail -n +5 file` is special: it starts printing **from** line 5.",
      ],
    },
    {
      kind: "code",
      heading: "cat, tac, head and tail",
      example: {
        title: "Read parts of a file",
        language: "bash",
        code: 'printf "one\\ntwo\\nthree\\nfour\\nfive\\nsix\\n" > f.txt\ncat f.txt\ntac f.txt\nhead -n 2 f.txt\ntail -n 2 f.txt\ntail -n +5 f.txt\ncat -n f.txt | head -2',
        walkthrough: [
          "`printf` writes six lines into `f.txt` (the `\\n` marks line ends); `cat f.txt` prints them in order.",
          "`tac f.txt` prints the same lines from `six` up to `one`.",
          "`head -n 2` shows `one` and `two`; `tail -n 2` shows `five` and `six`; `tail -n +5` also shows `five` and `six` because it starts at line 5.",
          "`cat -n` numbers the lines; piping to `head -2` keeps the first two numbered lines.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Writing files with cat",
      example: {
        title: "Overwrite and append",
        language: "bash",
        code: "cat > g.txt <<EOF\nfirst\nEOF\ncat >> g.txt <<EOF\nsecond\nEOF\ncat g.txt",
        walkthrough: [
          "`cat > g.txt` writes what you type into `g.txt` and **overwrites** any existing content. Normally you type the text and finish with Ctrl+D; here a here-document (`<<EOF ... EOF`) supplies the text so the example can run in a script.",
          "`cat >> g.txt` **appends**: the old content stays and the new text is added at the end.",
          "The final `cat g.txt` prints `first` and `second`. The `>` and `>>` operators belong to the shell and are covered in the redirection lesson.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Which viewer?",
      diagram: {
        kind: "table",
        title: "Choosing a command",
        headers: ["Need", "Command"],
        rows: [
          ["The whole file", "cat file"],
          ["The file backwards", "tac file"],
          [
            "A long file, page by page",
            "more file (space = next page, q = quit)",
          ],
          ["The first N lines", "head -n N file"],
          ["The last N lines", "tail -n N file"],
          ["New lines as they are written", "tail -f file (Ctrl+C to stop)"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using cat > file on a file you want to keep.",
          fix: "> truncates the file at once. Use >> to add to the end.",
        },
        {
          mistake: "Printing a huge file with cat and flooding the terminal.",
          fix: "Use more, head or tail.",
        },
        {
          mistake: "Forgetting to finish cat > file.",
          fix: "Press Ctrl+D on an empty line to end the input.",
        },
        {
          mistake: "Expecting more to scroll back.",
          fix: "more only moves forward; q quits.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Checking the end of a log",
      scenario:
        "An application writes a long log file and you want to know what happened last.",
      body: [
        "`tail -n 20 app.log` shows the last 20 lines. To watch new lines arrive, use `tail -f app.log` and stop with Ctrl+C. Use `head -n 5 app.log` to check the header of the file.",
        "To read the whole log slowly, `more app.log` pages through it.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "tac-meaning",
      prompt: "What does tac do?",
      options: [
        "Prints a file with its lines in reverse order",
        "Counts the lines in a file",
        "Appends to a file",
      ],
      answer: 0,
      explanation: "tac is cat backwards.",
    },
    {
      type: "output",
      id: "tail-plus",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "seq 1 6 | tail -n +5",
      },
      options: ["5 6", "6", "1 2 3 4"],
      answer: 0,
      explanation: "tail -n +5 starts at line 5, so it prints 5 and 6.",
    },
    {
      type: "single",
      id: "cat-gt",
      prompt: "What does cat > file do with an existing file?",
      options: ["Overwrites its content", "Appends to it", "Prints it"],
      answer: 0,
      explanation: "A single > truncates the file. Use >> to append.",
    },
    {
      type: "blank",
      id: "head-opt",
      prompt:
        "To print only the first 3 lines of a file, run head -n ___ file.",
      answer: "3",
      explanation: "`head -n 3 file` prints the first three lines.",
      accepted: ["-3"],
    },
  ],
  assignment: {
    title: "Notes from the terminal",
    task: [
      "Create a notes.txt file using cat > and add two more lines with cat >>.",
      "Show the file normally, reversed, only the first line and only the last line.",
    ],
    checklist: [
      "The file was created and appended to, not overwritten the second time",
      "I used tac",
      "head and tail show the first and last lines",
      "I paged a long file with more",
    ],
    hints: ["seq 1 100 > numbers.txt gives you a long file to try more on."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "first-last",
      title: "First and last",
      task: [
        "Write the commands to print the first 5 and the last 5 lines of server.log.",
      ],
      language: "bash",
      starter: "# your commands",
      solution: "head -n 5 server.log\ntail -n 5 server.log",
      hints: ["Both commands take -n."],
      checklist: [
        "head -n 5 is used for the start",
        "tail -n 5 is used for the end",
      ],
    },
  ],
  revisionNotes: [
    "cat prints, tac reverses, more pages, head/tail show the ends",
    "head -n N, tail -n N, tail -n +N, tail -f",
    "cat > overwrites; cat >> appends; Ctrl+D ends input",
    "Page or slice long files instead of cat-ing them",
  ],
  resources: [
    {
      label: "cat(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/cat.1.html",
    },
    {
      label: "tac(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/tac.1.html",
    },
    {
      label: "head(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/head.1.html",
    },
    {
      label: "tail(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/tail.1.html",
    },
    {
      label: "more(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/more.1.html",
    },
  ],
})
