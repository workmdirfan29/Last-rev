import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "grep-and-find",
  title: "Searching with grep and find",
  topic: "Grep & find",
  minutes: 48,
  overview:
    "Search inside files with grep (case, whole words, anchors, alternatives, inverting) and search for files by name with find.",
  objectives: [
    "Search a file for a word with grep and make it case-insensitive",
    "Match line starts and ends with ^ and $",
    "Search several words, show only the match, and invert a match",
    "Find files by name or type with find",
  ],
  prerequisites: ["lesson.linux-commands.viewing-files"],
  sections: [
    {
      kind: "explain",
      heading: "grep",
      body: [
        "`grep pattern file` prints the **lines** of the file that match the pattern. It is case-sensitive by default. Useful options: `-i` ignore case, `-o` print only the matching text, `-v` invert (show lines that do **not** match), `-n` show line numbers, `-c` count matching lines, `-w` match whole words only and `-r` search directories recursively.",
        'In a pattern, `^` anchors to the start of a line and `$` to the end. `\\|` between words means OR in basic patterns; `grep -E "a|b"` is the extended form that many people prefer. grep exits with status `0` when something matched and `1` when nothing did.',
      ],
    },
    {
      kind: "code",
      heading: "grep in action",
      example: {
        title: "Patterns and options",
        language: "bash",
        code: 'printf "Error: disk full\\nwarning: low memory\\nok done\\nerror again\\nERROR big\\nstart here\\nthe end\\n" > log.txt\ngrep error log.txt\ngrep -i error log.txt\ngrep -o error log.txt\ngrep "^ok" log.txt\ngrep "end$" log.txt\ngrep "disk\\|memory" log.txt\ngrep -v -i error log.txt\ngrep -n -i error log.txt\ngrep -c -i error log.txt\ngrep nothing log.txt; echo "exit=$?"',
        walkthrough: [
          "`grep error` matches only lowercase `error`, so one line is printed: `error again`.",
          "`-i` ignores case, so `Error: disk full`, `error again` and `ERROR big` all match.",
          "`-o` prints only the matched text instead of the whole line: just `error`.",
          "`^ok` finds lines that **start** with ok; `end$` finds lines that **end** with end.",
          "`disk\\|memory` matches either word and prints two lines.",
          "`-v -i error` shows every line that does not contain error in any case. `-n` prefixes the line numbers (1, 4 and 5), and `-c` prints the count, `3`.",
          "When nothing matches, grep prints nothing and returns exit status `1`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "find",
      example: {
        title: "Find files by name and type",
        language: "bash",
        code: 'mkdir -p src/lib docs\ntouch a.txt src/b.txt src/lib/c.txt src/lib/d.log docs/e.txt docs/F.TXT\nfind . -name "*.txt" | sort\nfind . -iname "*.txt" | sort\nfind . -type d | sort\nfind src -name "*.log"\nfind . -maxdepth 1 -type f',
        walkthrough: [
          '`find where -name pattern` walks the directory tree starting at `where` and prints the paths whose **file name** matches. Quote the pattern (`"*.txt"`) so the shell does not expand it first.',
          "`-name` is case-sensitive, so `F.TXT` is not matched. `-iname` ignores case and also finds `./docs/F.TXT`.",
          "`-type d` finds directories and `-type f` regular files; `find . -type d` lists `.`, `./docs`, `./src` and `./src/lib`.",
          '`find src -name "*.log"` searches only under `src` and prints `src/lib/d.log`.',
          "`-maxdepth 1` limits the search to the starting directory: here only `./a.txt`.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "grep or find?",
      diagram: {
        kind: "table",
        title: "Which tool",
        headers: ["You want to...", "Use"],
        rows: [
          ["Search the contents of files", "grep"],
          ["Search for files by name, type or size", "find"],
          ["Search all files below a folder for a word", "grep -r word folder"],
          ["List the matching file names only", "grep -rl word folder"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Forgetting to quote a pattern with spaces or special characters.",
          fix: 'Quote it: grep "disk full" file.',
        },
        {
          mistake:
            'Using find -name "txt" and expecting a match on the extension.',
          fix: '-name matches the whole file name; use "*.txt".',
        },
        {
          mistake:
            "Forgetting -i and missing lines with different capitalisation.",
          fix: "Add -i.",
        },
        {
          mistake:
            "Leaving the pattern unquoted so the shell expands * in the current folder.",
          fix: "Quote wildcard patterns passed to find.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Looking for a failure",
      scenario:
        "A service log has thousands of lines and you want the errors, with line numbers, but not the known harmless ones.",
      body: [
        "`grep -n -i error app.log | grep -v harmless` finds error lines and removes the known noise. `grep -c -i error app.log` tells you how many there are.",
        'To find which config file mentions a port, `grep -r "8080" /etc/myapp` searches the whole folder.',
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "grep-v",
      prompt: "What does grep -v word file print?",
      options: [
        "Lines that do not contain word",
        "Lines with word in verbose mode",
        "Only the word",
      ],
      answer: 0,
      explanation: "-v inverts the match.",
    },
    {
      type: "output",
      id: "grep-count",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: 'printf "a1\\nb2\\na3\\n" | grep -c a',
      },
      options: ["2", "1", "3"],
      answer: 0,
      explanation: "Two lines contain a.",
    },
    {
      type: "single",
      id: "anchor-end",
      prompt: "Which pattern matches lines that END with the word done?",
      options: ["done$", "^done", "done\\|"],
      answer: 0,
      explanation: "$ anchors to the end of a line.",
    },
    {
      type: "blank",
      id: "iname",
      prompt: 'To find files by name ignoring case, use find . -___ "*.txt".',
      answer: "iname",
      explanation: "`-iname` is the case-insensitive version of `-name`.",
    },
  ],
  assignment: {
    title: "Search toolbox",
    task: [
      "Create a text file with at least ten lines of mixed case. Use grep with -i, -n, -c, -v, -o and an anchored pattern, and note what each does.",
      "Create a small folder tree and use find to list all .txt files, then only directories.",
    ],
    checklist: [
      "I used six different grep options",
      "I searched two words with the \\| or -E form",
      "find listed files by name and by type",
      "I quoted my patterns",
    ],
    hints: ['Use grep -E "a|b" for alternatives.'],
    minutes: 20,
  },
  exercises: [
    {
      slug: "grep-recipes",
      title: "Pick the command",
      task: [
        "Write commands to: (1) show lines containing ERROR or WARN in app.log; (2) count the lines that do not contain debug in app.log (ignore case); (3) find all .conf files below /etc.",
      ],
      language: "bash",
      starter: "# 1\n# 2\n# 3",
      solution:
        'grep -E "ERROR|WARN" app.log\ngrep -v -i -c debug app.log\nfind /etc -name "*.conf"',
      hints: ["-c counts lines."],
      checklist: [
        "The OR pattern is used",
        "-v with -c counts the non-matching lines",
        "find has a quoted pattern",
      ],
    },
  ],
  revisionNotes: [
    "grep prints matching lines: -i -o -v -n -c -w -r",
    "^ start of line, $ end of line, \\| or -E for alternatives",
    "find path -name/-iname pattern, -type f/d, -maxdepth",
    "Quote patterns; grep exits 1 when nothing matched",
  ],
  resources: [
    {
      label: "grep(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/grep.1.html",
    },
    {
      label: "find(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/find.1.html",
    },
    {
      label: "regex(7): regular expressions",
      url: "https://man7.org/linux/man-pages/man7/regex.7.html",
    },
  ],
})
