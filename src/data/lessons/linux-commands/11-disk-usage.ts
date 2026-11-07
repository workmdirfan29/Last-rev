import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "disk-usage",
  title: "Checking disk space with df and du",
  topic: "Disk & storage",
  minutes: 15,
  overview:
    "See how full each file system is with df -Th and how large a file or directory is with du -sh.",
  objectives: [
    "Read the columns of df -Th",
    "Measure a file or directory with du -sh",
    "Explain the difference between df and du",
  ],
  prerequisites: ["lesson.linux-commands.listing-ls"],
  sections: [
    {
      kind: "explain",
      heading: "Two questions, two commands",
      body: [
        '`df` (disk free) answers "how full is each **file system**?" `-T` adds the file system type and `-h` prints sizes in human-readable units. The columns are Filesystem, Type, Size, Used, Avail, Use% and Mounted on. A `Use%` near 100 on a mount point means that disk is almost full.',
        '`du` (disk usage) answers "how much space does this **file or directory** use?" `-s` prints a single total (a summary) instead of every subdirectory and `-h` makes it readable: `du -sh logs/`.',
      ],
    },
    {
      kind: "code",
      heading: "du -sh",
      example: {
        title: "Measuring files and folders",
        language: "bash",
        code: "head -c 1048576 /dev/zero > big.bin\nmkdir d\nhead -c 2097152 /dev/zero > d/b.bin\ndu -sh big.bin\ndu -sh d\ndu -sh .\ndu -sb big.bin",
        walkthrough: [
          "`head -c 1048576 /dev/zero` creates a file of exactly 1 MiB (1048576 bytes) filled with zero bytes.",
          "`du -sh big.bin` prints `1.0M` and `du -sh d` prints `2.1M` (the 2 MiB file plus the directory entry itself). `du -sh .` adds both, `3.1M`.",
          "`du -sb big.bin` prints the apparent size in bytes: `1048576`. `du` normally reports **disk usage** (space allocated in blocks), which can differ a little from the file size.",
          "`df -Th` has no fixed output because it depends on your machine; run it and read the `Size`, `Used`, `Avail` and `Use%` columns for each `Mounted on` path such as `/`.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "df or du?",
      diagram: {
        kind: "table",
        title: "Which command",
        headers: ["Question", "Command"],
        rows: [
          ["How full is the disk or partition?", "df -h (add -T for the type)"],
          [
            "Which folder is using the space?",
            "du -sh folder (or du -h --max-depth=1)",
          ],
          ["What is the size of this one file?", "du -sh file or ls -lh file"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Confusing df and du.",
          fix: "df looks at whole file systems; du measures what is inside a path.",
        },
        {
          mistake: "Running du -sh / on a big server and waiting.",
          fix: "Limit the path or use --max-depth=1.",
        },
        {
          mistake: "Reading sizes in bytes as megabytes.",
          fix: "Use -h for readable units.",
        },
        {
          mistake: "Deleting a big file and seeing no change in df.",
          fix: "A running program may still hold the file open; space is freed when it closes.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "The disk is full",
      scenario: "A server reports 'No space left on device'.",
      body: [
        "`df -h` shows which mount is at 100%. Then `du -h --max-depth=1 /var` and repeat on the biggest folder to find what is using the space, usually logs or caches.",
        "Delete or archive carefully; use `ls -lh` to confirm file sizes first.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "df-purpose",
      prompt: "What does df show?",
      options: [
        "Free and used space of each file system",
        "The size of one directory",
        "The list of deleted files",
      ],
      answer: 0,
      explanation: "df reports on file systems; du reports on paths.",
    },
    {
      type: "output",
      id: "du-size",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "head -c 1048576 /dev/zero > f\ndu -sh f",
      },
      options: ["1.0M\tf", "1M", "1048576"],
      answer: 0,
      explanation: "1048576 bytes is 1.0 MiB, shown as 1.0M.",
    },
    {
      type: "truefalse",
      id: "du-s",
      statement:
        "du -s prints only the total for each argument instead of every subdirectory.",
      answer: true,
      explanation: "-s stands for summarize.",
    },
    {
      type: "blank",
      id: "df-types",
      prompt: "To show the file system type column in df, add the option -___.",
      answer: "T",
      explanation: "`df -T` adds the Type column; `-h` makes sizes readable.",
    },
  ],
  assignment: {
    title: "Where did my space go?",
    task: [
      "Run df -Th and note the file system that holds /. Then use du -sh on three directories of your choice and rank them.",
      "Create a 5 MB test file with head -c and verify its size with du -sh and ls -lh.",
    ],
    checklist: [
      "I read the Use% of the root file system",
      "I measured three directories with du -sh",
      "I created a file of a known size and checked it",
      "I can explain df versus du",
    ],
    hints: ["du -sh * shows the size of each item in a folder."],
    minutes: 10,
  },
  exercises: [
    {
      slug: "space-commands",
      title: "Pick the command",
      task: [
        "Write the commands to (1) show human-readable disk usage with types for every file system and (2) show the size of the directory /var/log.",
      ],
      language: "bash",
      starter: "# 1\n# 2",
      solution: "df -Th\ndu -sh /var/log",
      hints: ["-T for types, -h for human-readable."],
      checklist: ["df has -T and -h", "du has -s and -h"],
    },
  ],
  revisionNotes: [
    "df -Th: file systems, types, Use%",
    "du -sh path: total size of a path",
    "du reports disk usage; -b gives apparent bytes",
    "Find big folders with du -h --max-depth=1",
  ],
  resources: [
    {
      label: "df(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/df.1.html",
    },
    {
      label: "du(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/du.1.html",
    },
    {
      label: "GNU Coreutils manual",
      url: "https://www.gnu.org/software/coreutils/manual/html_node/index.html",
    },
  ],
})
