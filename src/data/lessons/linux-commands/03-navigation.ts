import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "navigation",
  title: "Navigating the file system",
  topic: "Navigation",
  minutes: 30,
  overview:
    "Find out where you are with pwd, move with cd using absolute and relative paths, and use the shortcuts ~, ., .. and cd -.",
  objectives: [
    "Print the working directory with pwd",
    "Move with cd using absolute and relative paths",
    "Use ~, . and .. correctly",
    "Return to the previous directory with cd -",
  ],
  prerequisites: ["lesson.linux-commands.directories"],
  sections: [
    {
      kind: "explain",
      heading: "Where am I?",
      body: [
        'Your shell is always "in" one directory, the **current working directory**. `pwd` (print working directory) shows it as an absolute path from the root `/`. `cd path` changes it.',
        "An **absolute path** starts with `/` and works from anywhere (`/usr/bin`). A **relative path** does not start with `/` and is resolved from the current directory (`../lib`). Special names: `.` is the current directory, `..` is the parent, and `~` is your home directory.",
      ],
    },
    {
      kind: "code",
      heading: "pwd and cd",
      example: {
        title: "Moving around",
        language: "bash",
        code: "cd /tmp\npwd\ncd /usr/bin\npwd\ncd ../lib\npwd\ncd -\ncd /\npwd\ncd /usr\ncd ..\npwd\necho $OLDPWD",
        walkthrough: [
          "`cd /tmp` goes to an absolute path, and `pwd` confirms `/tmp`.",
          "`cd /usr/bin` and then `cd ../lib` uses a relative path: `..` goes up to `/usr`, and `lib` goes down into `/usr/lib`.",
          "`cd -` jumps back to the previous directory (`/usr/bin`) and prints it. The shell remembers it in the variable `OLDPWD`.",
          "`cd /` goes to the root. `cd /usr` then `cd ..` returns to `/`.",
          "`cd` with no argument (or `cd ~`) goes to your home directory.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Path shortcuts",
      diagram: {
        kind: "table",
        title: "Special names",
        headers: ["Symbol", "Meaning"],
        rows: [
          ["/", "The root directory (and the separator in paths)"],
          ["~", "Your home directory"],
          [".", "The current directory"],
          ["..", "The parent directory"],
          ["-", "With cd: the previous directory"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Typing cd and a name with spaces without quotes.",
          fix: 'Quote it: cd "My Documents".',
        },
        {
          mistake: "Mixing up relative and absolute paths.",
          fix: "A leading / means absolute. Run pwd if unsure.",
        },
        {
          mistake: "Forgetting that .. goes up one level only.",
          fix: "Chain them: ../../logs.",
        },
        {
          mistake:
            "Creating files in the wrong directory because you did not check.",
          fix: "Run pwd before you create or delete.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Jumping between two folders",
      scenario:
        "You are editing files in /var/log and your project in /home/dev/app and keep switching.",
      body: [
        "`cd -` toggles between the two last directories without retyping paths. Use `cd ~/app` as a shortcut to the project from anywhere.",
        "Tab completion (type the first letters and press Tab) fills in directory names and avoids typos.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "pwd-meaning",
      prompt: "What does pwd print?",
      options: [
        "The absolute path of the current directory",
        "The password",
        "The parent directory only",
      ],
      answer: 0,
      explanation: "pwd stands for print working directory.",
    },
    {
      type: "output",
      id: "cd-relative",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "cd /usr/bin\ncd ../lib\npwd",
      },
      options: ["/usr/lib", "/usr/bin", "/lib"],
      answer: 0,
      explanation: ".. moves from /usr/bin to /usr, then lib gives /usr/lib.",
    },
    {
      type: "truefalse",
      id: "cd-dash",
      statement: "cd - returns to the previous directory.",
      answer: true,
      explanation: "The shell keeps the previous directory in OLDPWD.",
    },
    {
      type: "blank",
      id: "home-symbol",
      prompt: "The symbol ___ stands for your home directory.",
      answer: "~",
      explanation: "`~` expands to your home directory, as does a plain `cd`.",
      accepted: ["tilde"],
    },
  ],
  assignment: {
    title: "Map the tree",
    task: [
      "Starting from your home directory, visit /, /usr, /usr/bin and /tmp using both absolute and relative paths, printing pwd after every move.",
      "Use cd - at least twice and explain what it does.",
    ],
    checklist: [
      "I used both absolute and relative paths",
      "pwd confirmed each location",
      "cd - was used and explained",
      "I returned home with cd and no argument",
    ],
    hints: ["Use cd .. and cd ../.. to climb."],
    minutes: 10,
  },
  exercises: [
    {
      slug: "path-moves",
      title: "Path moves",
      task: [
        "Starting in /usr/bin, write one cd command (relative) that goes to /usr/lib, and one (absolute) that goes to /tmp.",
      ],
      language: "bash",
      starter: "# your commands",
      solution: "cd ../lib\ncd /tmp",
      hints: ["Go up with .. then down."],
      checklist: [
        "The first command uses .. relative to /usr/bin",
        "The second starts with /",
      ],
    },
  ],
  revisionNotes: [
    "pwd shows where you are; cd changes it",
    "Absolute paths start with /; relative ones do not",
    "~ home, . here, .. parent, cd - previous",
    "Quote names with spaces; use Tab completion",
  ],
  resources: [
    {
      label: "pwd(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/pwd.1.html",
    },
    {
      label: "path_resolution(7): how a pathname is resolved",
      url: "https://man7.org/linux/man-pages/man7/path_resolution.7.html",
    },
    {
      label: "Bash builtins (cd)",
      url: "https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html",
    },
  ],
})
