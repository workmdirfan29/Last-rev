import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "counting-sorting",
  title: "Counting, sorting and numbering text",
  topic: "Text processing",
  minutes: 60,
  overview:
    "Count lines, words and characters with wc, order lines with sort, remove duplicates with uniq and number lines with nl.",
  objectives: [
    "Count lines, words and bytes with wc",
    "Sort alphabetically and numerically, ascending and descending",
    "Remove or show duplicate lines with uniq after sorting",
    "Number lines with nl",
  ],
  prerequisites: ["lesson.linux-commands.pipes-and-redirection"],
  sections: [
    {
      kind: "explain",
      heading: "Small tools that work together",
      body: [
        "Text-processing commands each do one job and are designed to be connected with pipes. `wc` counts, `sort` orders, `uniq` collapses repeated lines and `nl` numbers lines.",
        "`wc -l` counts lines, `wc -w` words and `wc -c` bytes (characters in ASCII text). Without options `wc` prints all three. When you give `wc` input from a pipe or with `<`, it prints only the numbers, without a file name.",
      ],
    },
    {
      kind: "code",
      heading: "wc and nl",
      example: {
        title: "Counting and numbering",
        language: "bash",
        code: 'printf "the quick brown fox\\njumps over\\nthe lazy dog\\n" > t.txt\nwc -l t.txt\nwc -w t.txt\nwc -c t.txt\nwc t.txt\nwc -l < t.txt\nnl t.txt\nprintf "a\\n\\nb\\n" > blank.txt\nnl blank.txt\nnl -b a blank.txt',
        walkthrough: [
          "The file has `3` lines, `9` words and `44` bytes. `wc` with no option prints lines, words and bytes together: ` 3  9 44 t.txt`.",
          "`wc -l < t.txt` reads from standard input, so only the number `3` is printed.",
          "`nl` numbers lines. By default it numbers only **non-empty** lines, so the empty line in `blank.txt` gets no number and `b` becomes `2`.",
          "`nl -b a` sets the body numbering style to **a**ll lines, so the empty line is numbered too: `a` is 1, the empty line 2, `b` 3.",
        ],
      },
    },
    {
      kind: "code",
      heading: "sort and uniq",
      example: {
        title: "Ordering and duplicates",
        language: "bash",
        code: 'printf "pear\\napple\\nfig\\napple\\n" > fruit.txt\nsort fruit.txt\nsort -r fruit.txt\nuniq fruit.txt\nsort fruit.txt | uniq\nsort fruit.txt | uniq -d\nsort fruit.txt | uniq -c\nprintf "10\\n9\\n100\\n1\\n" > n.txt\nsort n.txt\nsort -n n.txt\nsort -nr n.txt',
        walkthrough: [
          "`sort` orders lines alphabetically: `apple apple fig pear`. `-r` reverses: `pear fig apple apple`.",
          "`uniq` removes only **adjacent** duplicates. On the unsorted file `apple` is not next to `apple`, so nothing is removed. Sorting first brings duplicates together: `sort | uniq` gives `apple fig pear`.",
          "`uniq -d` shows only the lines that are duplicated (`apple`), and `uniq -c` prefixes each line with its count, so `2 apple`.",
          "Plain `sort` compares text, so `100` comes before `9`. `sort -n` sorts by **number**: `1 9 10 100`. `-nr` gives the descending order `100 10 9 1`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Locale and sorting",
      body: [
        "Sort order depends on the **locale**. In some locales upper and lower case are mixed (`apple Banana cherry`); with `LC_ALL=C` all uppercase letters sort before lowercase ones. If results look strange in a script, check the locale. The examples here use lowercase names, which sort the same way everywhere.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using uniq without sort first.",
          fix: "uniq only collapses neighbours. Pipe through sort.",
        },
        {
          mistake: "Sorting numbers as text.",
          fix: "Use sort -n so 9 comes before 10.",
        },
        {
          mistake:
            "Counting bytes and expecting characters for non-ASCII text.",
          fix: "wc -c counts bytes; wc -m counts characters.",
        },
        {
          mistake: "Expecting nl to number blank lines.",
          fix: "Use nl -b a to number all lines.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Counting visitors",
      scenario:
        "A file lists one visitor name per line with many repeats, and you want the most frequent names first.",
      body: [
        "`sort names.txt | uniq -c | sort -nr` counts each name and puts the largest count at the top. Add `| head -n 3` for the top three.",
        "`wc -l names.txt` tells you how many lines there are in total.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "uniq-adjacent",
      prompt: "Why do you usually sort before uniq?",
      options: [
        "uniq only removes adjacent duplicate lines",
        "uniq cannot read files",
        "sort makes uniq faster",
      ],
      answer: 0,
      explanation:
        "Duplicates must be next to each other for uniq to collapse them.",
    },
    {
      type: "output",
      id: "sort-n",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: 'printf "10\\n9\\n100\\n" | sort -n',
      },
      options: ["9 10 100", "10 100 9", "100 10 9"],
      answer: 0,
      explanation: "-n sorts numerically.",
    },
    {
      type: "output",
      id: "sort-uniq",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: 'printf "b\\na\\nb\\n" | sort | uniq',
      },
      options: ["a b", "b a b", "a b b"],
      answer: 0,
      explanation:
        "After sorting, the duplicate b lines are adjacent, so uniq keeps one.",
    },
    {
      type: "blank",
      id: "wc-lines",
      prompt: "To count only the lines of a file, run wc -___ file.",
      answer: "l",
      explanation: "`wc -l` counts lines.",
    },
  ],
  assignment: {
    title: "Word frequencies",
    task: [
      "Create a text file with about ten lines containing repeated words, one per line. Use wc to count its lines, words and bytes.",
      "Produce a frequency table with sort | uniq -c | sort -nr and number the result with nl.",
    ],
    checklist: [
      "wc -l, -w and -c were used",
      "Sorting happened before uniq",
      "The frequency table is sorted by count, descending",
      "nl numbered the final output",
    ],
    hints: ["Pipe the final result into nl."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "top-words",
      title: "Top three",
      task: [
        "Write a pipeline that prints the three most frequent lines of words.txt with their counts.",
      ],
      language: "bash",
      starter: "# your pipeline",
      solution: "sort words.txt | uniq -c | sort -nr | head -n 3",
      hints: ["Count, then sort numerically in reverse."],
      checklist: [
        "sort comes before uniq -c",
        "sort -nr orders by the count",
        "head -n 3 keeps three lines",
      ],
    },
  ],
  revisionNotes: [
    "wc -l/-w/-c, nl and nl -b a",
    "sort, -r, -n, -nr; sort before uniq",
    "uniq -d for duplicates, uniq -c for counts",
    "Locale affects text sort order",
  ],
  resources: [
    {
      label: "wc(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/wc.1.html",
    },
    {
      label: "sort(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/sort.1.html",
    },
    {
      label: "uniq(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/uniq.1.html",
    },
    {
      label: "nl(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/nl.1.html",
    },
  ],
})
