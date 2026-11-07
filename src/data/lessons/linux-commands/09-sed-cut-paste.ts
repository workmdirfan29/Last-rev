import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "sed-cut-paste",
  title: "Editing streams with sed, cut and paste",
  topic: "Text processing",
  minutes: 60,
  overview:
    "Print or delete lines and replace text with sed, extract fields and characters with cut, and join files side by side with paste.",
  objectives: [
    "Print line numbers or ranges and delete lines with sed",
    "Replace text with sed s/old/new/ and the g flag",
    "Extract fields and character ranges with cut",
    "Merge files line by line with paste",
  ],
  prerequisites: ["lesson.linux-commands.counting-sorting"],
  sections: [
    {
      kind: "explain",
      heading: "sed, the stream editor",
      body: [
        "`sed` reads text line by line, applies an edit and prints the result. It does **not** change the input file unless you ask (`-i`). Common commands: `sed -n '10p' file` prints only line 10 (`-n` turns off the default printing and `p` prints), `sed -n '11,13p' file` prints a range, `sed '10d' file` prints everything except line 10 and `sed '6,15d' file` removes lines 6 to 15 from the output.",
        "`sed 's/old/new/' file` **s**ubstitutes the first `old` on each line; add the `g` flag (`s/old/new/g`) to replace every occurrence on each line. `sed -i.bak` edits the file in place and keeps a backup named `file.bak`.",
      ],
    },
    {
      kind: "code",
      heading: "sed",
      example: {
        title: "Print, delete and replace",
        language: "bash",
        code: 'seq 1 20 > n.txt\nsed -n "10p" n.txt\nsed -n "11,13p" n.txt\nsed "10d" n.txt | wc -l\nsed "6,15d" n.txt | tr "\\n" " "; echo\nprintf "cat cat dog\\ncat\\n" > a.txt\nsed "s/cat/bird/" a.txt\nsed "s/cat/bird/g" a.txt\nsed -i.bak "s/dog/fish/" a.txt\ncat a.txt\nls',
        walkthrough: [
          '`sed -n "10p"` prints line `10`; `-n "11,13p"` prints `11`, `12` and `13`.',
          '`sed "10d"` removes one line, so the output has `19` lines. `sed "6,15d"` removes ten lines and leaves `1 2 3 4 5 16 17 18 19 20`.',
          "Without `g`, `s/cat/bird/` changes only the first `cat` on each line: `bird cat dog` and `bird`. With `g`, every `cat` changes: `bird bird dog` and `bird`.",
          "`-i.bak` changes `a.txt` itself (`cat cat fish`, the second line `cat`) and leaves the original in `a.txt.bak`. Without `-i`, the file is never modified.",
          "The command accepts a different delimiter: `s|/usr|/opt|` is easier to read than escaping slashes.",
        ],
      },
    },
    {
      kind: "code",
      heading: "cut and paste",
      example: {
        title: "Fields, characters and merging",
        language: "bash",
        code: 'printf "root:x:0:bash\\nana:y:1000:zsh\\n" > p.txt\ncut -d ":" -f 1 p.txt\ncut -d ":" -f 1,4 p.txt\nprintf "abcdefghij\\n0123456789\\n" > c.txt\ncut -c 3-5 c.txt\ncut -c 1-3,8- c.txt\nprintf "a\\nb\\nc\\n" > l1\nprintf "1\\n2\\n3\\n" > l2\npaste l1 l2\npaste -d "," l1 l2\npaste -s -d "," l1',
        walkthrough: [
          '`cut -d ":" -f 1` splits each line at the delimiter `:` and prints field 1: `root` and `ana`. A list such as `-f 1,4` prints several fields, joined with the same delimiter.',
          "`cut -c 3-5` cuts by **character position**: characters 3 to 5 are `cde` and `234`. `1-3,8-` means characters 1 to 3 plus everything from 8 on.",
          '`paste l1 l2` joins files **line by line**, side by side, separated by a tab. `-d ","` uses a comma instead, and `-s` puts one file\'s lines on a single line: `a,b,c`.',
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Expecting sed s/old/new/ to change the file.",
          fix: "It prints the result. Use sed -i (preferably -i.bak) to edit in place.",
        },
        {
          mistake:
            "Forgetting the g flag and replacing only the first match per line.",
          fix: "Add g for every occurrence.",
        },
        {
          mistake: 'Using cut -d " " on text with several spaces in a row.',
          fix: 'cut treats each space as a separator; consider awk or squeeze spaces with tr -s " ".',
        },
        {
          mistake: "Running sed -i without a backup on an important file.",
          fix: "Use -i.bak, or test without -i first.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Quick data extraction",
      scenario:
        "A CSV-like file holds user:shell pairs and you need all the shells and a cleaned copy where /bin/bash is replaced by /usr/bin/bash.",
      body: [
        '`cut -d ":" -f 2 users.txt | sort | uniq` lists the distinct shells. `sed "s|/bin/bash|/usr/bin/bash|g" users.txt > users.new` writes the cleaned copy without touching the original.',
        "Compare the two files before you replace the original.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "sed-g",
      prompt: "What does the g flag do in sed s/a/b/g?",
      options: [
        "Replaces every occurrence on each line",
        "Makes the command global to all files",
        "Runs in the background",
      ],
      answer: 0,
      explanation: "Without g only the first match per line is replaced.",
    },
    {
      type: "output",
      id: "sed-first",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: 'echo "aaa" | sed "s/a/b/"',
      },
      options: ["baa", "bbb", "aaa"],
      answer: 0,
      explanation: "Without g only the first a is replaced.",
    },
    {
      type: "output",
      id: "cut-field",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: 'echo "x:y:z" | cut -d ":" -f 2',
      },
      options: ["y", "x:y", "z"],
      answer: 0,
      explanation: "Field 2 with ':' as delimiter is y.",
    },
    {
      type: "blank",
      id: "sed-print",
      prompt: "To print only line 10 of a file, run sed -n '10___' file.",
      answer: "p",
      explanation:
        "`p` prints the selected line; `-n` suppresses the default output.",
    },
  ],
  assignment: {
    title: "Text surgery",
    task: [
      "Create a ten-line file. With sed, print line 3, print lines 4 to 6, show the file without line 2 and replace a word globally in a copy.",
      "Create a colon-separated file and use cut to print two of its fields, then paste two small files side by side.",
    ],
    checklist: [
      "sed printed single and ranged lines",
      "sed substituted with and without g",
      "cut extracted fields",
      "paste merged two files",
    ],
    hints: ["Use seq 1 10 > n.txt for test data."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "sed-cut-recipes",
      title: "Pick the tool",
      task: [
        "Write commands to: (1) print lines 5 to 8 of data.txt; (2) replace every http with https in links.txt and write the result to safe.txt; (3) print the third comma-separated field of rows.csv.",
      ],
      language: "bash",
      starter: "# 1\n# 2\n# 3",
      solution:
        'sed -n "5,8p" data.txt\nsed "s/http/https/g" links.txt > safe.txt\ncut -d "," -f 3 rows.csv',
      hints: ["Remember -n with p."],
      checklist: [
        "The range uses 5,8p with -n",
        "The substitution uses g and a redirect",
        "cut uses -d and -f",
      ],
    },
  ],
  revisionNotes: [
    "sed -n 'Np', 'N,Mp', 'Nd', 'N,Md', s/old/new/ and the g flag",
    "sed -i.bak edits in place with a backup",
    "cut -d sep -f N and cut -c start-end",
    "paste joins files line by line (-d delimiter, -s serial)",
  ],
  resources: [
    {
      label: "sed(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/sed.1.html",
    },
    {
      label: "cut(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/cut.1.html",
    },
    {
      label: "paste(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/paste.1.html",
    },
    {
      label: "GNU sed manual",
      url: "https://www.gnu.org/software/sed/manual/sed.html",
    },
  ],
})
