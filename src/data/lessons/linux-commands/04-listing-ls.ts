import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "listing-ls",
  title: "Listing files with ls",
  topic: "Listing (ls)",
  minutes: 24,
  overview:
    "List directory contents with ls and its common options: hidden files (-a), long format (-l), human sizes (-h) and sorting by time (-t).",
  objectives: [
    "List files with ls and show hidden files with -a",
    "Read the long format of ls -l",
    "Combine options such as -lrt and -lrth",
    "Sort by time and reverse the order",
  ],
  prerequisites: ["lesson.linux-commands.navigation"],
  sections: [
    {
      kind: "explain",
      heading: "What ls shows",
      body: [
        "`ls` lists the names in a directory. By default it sorts them alphabetically and **hides** names that begin with a dot (hidden files such as `.bashrc`). When the output goes to a pipe or file (not a terminal), it prints one name per line.",
        "Options can be combined in one word: `ls -lrt` means `-l -r -t`.",
      ],
    },
    {
      kind: "code",
      heading: "Common options",
      example: {
        title: "ls and its options",
        language: "bash",
        code: "touch b.txt a.txt .hidden\nmkdir dir1\necho hello > a.txt\nls\nls -a\nls -d */\nls -R",
        walkthrough: [
          "`ls` shows `a.txt b.txt dir1`, sorted by name; `.hidden` is not shown.",
          "`ls -a` (all) also shows hidden entries, including the special entries `.` (this directory) and `..` (the parent).",
          "`ls -d */` lists only directories: `-d` stops `ls` from listing inside them, and `*/` matches names ending in a slash.",
          "`ls -R` lists recursively. The output starts with `.:` followed by the names and then a section for `./dir1:`.",
          "`ls -l` (long format) shows one entry per line: type and permissions, link count, owner, group, size in bytes, modification time and name. `ls -lh` adds human-readable sizes such as `4.0K`. The first character is `-` for a file and `d` for a directory.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Options to remember",
      diagram: {
        kind: "table",
        title: "ls options",
        headers: ["Option", "Effect"],
        rows: [
          ["-a", "Include hidden files"],
          ["-l", "Long format (permissions, owner, size, date)"],
          ["-h", "Human-readable sizes with -l"],
          ["-t", "Sort by modification time, newest first"],
          ["-r", "Reverse the order"],
          ["-R", "List subdirectories recursively"],
          ["-d", "List directories themselves, not their contents"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Reading -lrt and -lrth",
      body: [
        "`ls -lrt` combines the long format (-l), reverse order (-r) and time sort (-t). Because `-t` puts the newest first and `-r` reverses it, **the newest file ends up last**, right above your next prompt. That makes it a popular way to see the most recent file in a folder of logs.",
        "`ls -lrth` adds `-h` so sizes read as `4.0K` or `1.2M`.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Thinking a folder is empty because ls shows nothing.",
          fix: "Try ls -a: hidden files are not listed by default.",
        },
        {
          mistake: "Reading ls -l sizes as KB.",
          fix: "Without -h the size is in bytes.",
        },
        {
          mistake: "Using ls to count files in scripts.",
          fix: "Use find or wc -l on the output; ls formatting can change.",
        },
        {
          mistake: "Forgetting that -d is needed to list a directory itself.",
          fix: "ls -d dir shows dir; ls dir shows its contents.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Finding the newest log",
      scenario:
        "A log folder has hundreds of files and you want the latest one.",
      body: [
        "`ls -lrt` puts the newest at the bottom; pair it with `tail -n 1` to see just that line. Add `-h` to see sizes at a glance.",
        "For a quick listing of everything including hidden files, use `ls -la`.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "lrt-newest",
      prompt: "In ls -lrt, where does the newest file appear?",
      options: ["Last", "First", "In the middle"],
      answer: 0,
      explanation:
        "-t puts the newest first and -r reverses it, so the newest is last.",
    },
    {
      type: "output",
      id: "ls-a-count",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "touch a .b\nls -a | wc -l",
      },
      options: ["4", "2", "1"],
      answer: 0,
      explanation: "ls -a lists the four names ., .., .b and a.",
    },
    {
      type: "truefalse",
      id: "ls-hidden",
      statement: "ls hides names that begin with a dot unless you use -a.",
      answer: true,
      explanation: "Hidden files start with a dot.",
    },
    {
      type: "blank",
      id: "human-sizes",
      prompt: "ls -l ___ prints sizes like 4.0K instead of bytes.",
      answer: "-h",
      explanation: "Adding `-h` makes sizes human-readable (ls -lh).",
      accepted: ["h"],
    },
  ],
  assignment: {
    title: "Know your folder",
    task: [
      "In a practice folder with a few files, hidden files and a subdirectory, run ls with -a, -l, -lh, -d */ and -R and write one sentence about what each shows.",
      "Use ls -lrt to find the newest file after touching a new one.",
    ],
    checklist: [
      "I listed hidden files",
      "I read the columns of ls -l",
      "I found the newest file with -lrt",
      "I used -d */ to list only directories",
    ],
    hints: ["Create files with touch at different moments."],
    minutes: 10,
  },
  exercises: [
    {
      slug: "ls-recipes",
      title: "Pick the option",
      task: [
        "Write the ls command that (1) lists all files including hidden with human-readable long format, and (2) lists only the directories in the current folder.",
      ],
      language: "bash",
      starter: "# 1\n# 2",
      solution: "ls -lah\nls -d */",
      hints: ["Options can be combined: -lah."],
      checklist: [
        "The first command combines -l, -a and -h",
        "The second uses -d with */",
      ],
    },
  ],
  revisionNotes: [
    "ls -a hidden, -l long, -h human sizes, -t by time, -r reverse, -R recursive, -d directories",
    "ls -lrt shows the newest last",
    "In a pipe ls prints one name per line",
    "Sizes in -l are bytes unless -h",
  ],
  resources: [
    {
      label: "ls(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/ls.1.html",
    },
    {
      label: "GNU Coreutils manual",
      url: "https://www.gnu.org/software/coreutils/manual/html_node/index.html",
    },
  ],
})
