import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "calculator-and-viewers",
  title: "Utilities: bc, xcalc and file viewers",
  topic: "Utilities",
  minutes: 24,
  overview:
    "Calculate in the terminal with bc and learn which graphical helpers (xcalc, gnome-open, eog) open a calculator, a PDF or a picture when a desktop is available.",
  objectives: [
    "Calculate with bc, including decimals and square roots",
    "Control the number of decimals with scale",
    "Know what xcalc, gnome-open and eog open",
    "Recognise when a graphical tool will not work",
  ],
  prerequisites: ["lesson.linux-commands.pipes-and-redirection"],
  sections: [
    {
      kind: "explain",
      heading: "bc, the command-line calculator",
      body: [
        '`bc` is a calculator language. Run it with no arguments and type expressions, or pipe an expression into it: `echo "2+3*4" | bc`. Integer division truncates, because the default `scale` (number of digits after the decimal point) is `0`. Set it in the same input: `echo "scale=2; 10/3" | bc` gives `3.33`. The option `-l` loads a math library, sets the scale to 20 and adds functions like `sqrt`, `s` (sine) and `l` (log).',
        "`obase` and `ibase` set the output and input number base, which is a quick way to convert between decimal and binary.",
      ],
    },
    {
      kind: "code",
      heading: "bc in the terminal",
      example: {
        title: "Pipe expressions into bc",
        language: "bash",
        code: 'echo "2+3*4" | bc\necho "(2+3)*4" | bc\necho "10/3" | bc\necho "scale=2; 10/3" | bc\necho "2^10" | bc\necho "sqrt(16)" | bc -l\necho "obase=2; 10" | bc\necho "ibase=2; 1010" | bc',
        walkthrough: [
          "`2+3*4` follows the usual precedence (multiplication first): `14`; with parentheses `(2+3)*4` is `20`.",
          "`10/3` prints `3` because `scale` is 0. With `scale=2` the answer is `3.33`.",
          "`2^10` is exponentiation: `1024`. With `-l`, `sqrt(16)` prints `4.00000000000000000000` (20 decimals).",
          "`obase=2; 10` converts decimal 10 to binary `1010`; `ibase=2; 1010` reads `1010` as binary and prints `10`.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Graphical helpers",
      diagram: {
        kind: "table",
        title: "Commands that need a desktop",
        headers: ["Command", "Opens", "Needs"],
        rows: [
          [
            "xcalc",
            "A calculator window",
            "A graphical display and the xcalc package",
          ],
          [
            "gnome-open file.pdf",
            "The PDF in the default viewer",
            "A GNOME desktop; modern systems use xdg-open",
          ],
          [
            "eog picture.jpg",
            "The image in Eye of GNOME",
            "A graphical display and the eog package",
          ],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Graphical tools over SSH",
      body: [
        "`xcalc`, `gnome-open` and `eog` draw windows, so they only work in a session that has a display. On a server reached over SSH you will normally see an error such as `cannot open display`. Use `bc` for calculations, and copy files to your own machine (`scp`) to view them. `gnome-open` is an old command; on current desktops `xdg-open file.pdf` opens a file with the default application.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Expecting bc to show decimals by default.",
          fix: "Set scale, or use bc -l.",
        },
        {
          mistake:
            "Running xcalc, eog or gnome-open on a server without a display.",
          fix: "Use text tools there or copy the file to a desktop.",
        },
        {
          mistake: "Forgetting quotes around expressions with * or ^.",
          fix: "Quote the expression so the shell does not expand it.",
        },
        {
          mistake: "Using floating-point shell arithmetic for money.",
          fix: "$(( )) is integer-only; use bc for decimals.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A quick conversion in a script",
      scenario:
        "A script must compute a 18% tax on a price held in a variable and show two decimals.",
      body: [
        '`echo "scale=2; $price * 18 / 100" | bc` prints the tax with two decimals. Because bc truncates (it does not round), check the result for amounts where rounding matters.',
        'To convert a number to binary for a quick check, `echo "obase=2; 42" | bc` gives `101010`.',
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "bc-scale",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: 'echo "scale=2; 10/3" | bc',
      },
      options: ["3.33", "3", "3.3333333333"],
      answer: 0,
      explanation: "scale=2 keeps two digits after the decimal point.",
    },
    {
      type: "output",
      id: "bc-int",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: 'echo "10/3" | bc',
      },
      options: ["3", "3.33", "3.3333"],
      answer: 0,
      explanation: "The default scale is 0, so the division is truncated.",
    },
    {
      type: "truefalse",
      id: "xcalc-ssh",
      statement:
        "xcalc works in a plain SSH session without any graphical display.",
      answer: false,
      explanation: "xcalc draws a window and needs a display.",
    },
    {
      type: "blank",
      id: "bc-lib",
      prompt:
        "bc ___ loads the math library with sqrt and 20 digits of precision.",
      answer: "-l",
      explanation: "`bc -l` sets scale=20 and defines the math functions.",
      accepted: ["l"],
    },
  ],
  assignment: {
    title: "Terminal calculator",
    task: [
      "Use bc to compute 17*23, 100/7 with 3 decimals, 2^16 and the square root of 2. Convert 255 to binary and 11111111 from binary to decimal.",
      "Explain why the graphical tools xcalc, gnome-open and eog fail on a headless server and what you would use instead.",
    ],
    checklist: [
      "Four calculations were done with bc",
      "scale and -l were used",
      "A base conversion was done in both directions",
      "The display limitation is explained",
    ],
    hints: ["Quote expressions that contain * or ^."],
    minutes: 10,
  },
  exercises: [
    {
      slug: "bc-recipes",
      title: "Calculate it",
      task: [
        "Write commands that print: (1) 7 to the power of 4, (2) 22/7 with 4 decimals, (3) the binary form of 19.",
      ],
      language: "bash",
      starter: "# 1\n# 2\n# 3",
      solution:
        'echo "7^4" | bc\necho "scale=4; 22/7" | bc\necho "obase=2; 19" | bc',
      hints: ["scale and obase are set inside the expression."],
      checklist: [
        "^ for the power",
        "scale=4 for decimals",
        "obase=2 for binary",
      ],
    },
  ],
  revisionNotes: [
    'bc: echo "expr" | bc; scale for decimals; -l for sqrt and 20 digits',
    "ibase/obase convert number bases",
    "xcalc, gnome-open and eog need a display",
    "xdg-open is the modern gnome-open",
  ],
  resources: [
    {
      label: "GNU bc manual",
      url: "https://www.gnu.org/software/bc/manual/html_mono/bc.html",
    },
  ],
})
