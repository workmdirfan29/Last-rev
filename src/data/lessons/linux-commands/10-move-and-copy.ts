import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "move-and-copy",
  title: "Moving, renaming and copying",
  topic: "mv / cp",
  minutes: 42,
  overview:
    "Rename and move files with mv, copy files and directories with cp, and avoid overwriting by accident.",
  objectives: [
    "Rename a file with mv",
    "Move files to another directory or to the current one",
    "Copy files with cp and directories with cp -r",
    "Use -i and -n to avoid overwriting",
  ],
  prerequisites: ["lesson.linux-commands.files"],
  sections: [
    {
      kind: "explain",
      heading: "mv and cp",
      body: [
        '`mv old new` **renames** a file (same directory, new name) or **moves** it (different directory). It does not leave a copy behind. `cp source dest` **copies**: the original stays. A `.` as the destination means "the current directory", so `mv ../other/file .` brings a file here.',
        "If the destination is an existing directory the file is placed inside it; if it is an existing **file** it is replaced silently. `cp` needs `-r` to copy directories.",
      ],
    },
    {
      kind: "code",
      heading: "Rename, move and copy",
      example: {
        title: "mv and cp",
        language: "bash",
        code: "echo hi > old.txt\nmv old.txt new.txt\nls\nmkdir dest\nmv new.txt dest\nls\nls dest\nmkdir src\necho data > src/f.txt\nmv src/f.txt .\nls\ncp f.txt dest\nls dest\ncp dest/f.txt copy.txt\nls\nmkdir -p tree/sub\ncp tree copy_tree\ncp -r tree copy_tree\nls copy_tree",
        walkthrough: [
          "`mv old.txt new.txt` renames the file. `mv new.txt dest` moves it into the directory `dest`; the second `ls` shows `dest` only and `ls dest` shows `new.txt`.",
          "`mv src/f.txt .` moves a file from `src` into the **current** directory (the dot).",
          "`cp f.txt dest` copies the file into `dest`: now both `f.txt` and `new.txt` are there. `cp dest/f.txt copy.txt` copies and renames at once.",
          "`cp tree copy_tree` fails with `cp: -r not specified; omitting directory 'tree'`. `cp -r tree copy_tree` copies the directory with its content, so `ls copy_tree` shows `sub`.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Useful options",
      diagram: {
        kind: "table",
        title: "Safety flags",
        headers: ["Option", "Meaning"],
        rows: [
          ["-i", "Ask before overwriting"],
          ["-n", "Never overwrite an existing file"],
          ["-v", "Verbose: print what was done"],
          ["cp -r", "Copy directories recursively"],
          ["cp -p", "Keep mode, ownership and timestamps"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Overwriting an existing file without noticing.",
          fix: "Use -i or -n, or check with ls first.",
        },
        {
          mistake: "Using cp on a directory without -r.",
          fix: "Add -r.",
        },
        {
          mistake: "Thinking mv makes a backup.",
          fix: "mv moves; the old name is gone.",
        },
        {
          mistake: "Forgetting the destination, such as mv file.",
          fix: "mv and cp need a source and a destination.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Reorganising downloads",
      scenario:
        "Your downloads folder is full and you want the PDFs in a documents folder, keeping a backup of one important file.",
      body: [
        "`mkdir -p ~/documents && mv *.pdf ~/documents` moves all PDFs in one command. `cp -i report.pdf ~/backup/` copies the important one and asks before replacing an existing file.",
        "`mv -n` is a good habit when the destination may already contain files with the same names.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "mv-copy",
      prompt: "Does mv leave a copy of the file at the old place?",
      options: ["No, the file is moved", "Yes", "Only with -r"],
      answer: 0,
      explanation: "mv moves or renames; cp copies.",
    },
    {
      type: "output",
      id: "mv-rename",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "echo hi > a\nmv a b\nls",
      },
      options: ["b", "a b", "a"],
      answer: 0,
      explanation: "a was renamed to b.",
    },
    {
      type: "single",
      id: "cp-dir",
      prompt: "Which option lets cp copy a directory?",
      options: ["-r", "-d", "-n"],
      answer: 0,
      explanation: "-r (recursive) copies directories and their contents.",
    },
    {
      type: "blank",
      id: "current-dir",
      prompt:
        "The destination ___ means the current directory, as in mv ../other/file .",
      answer: ".",
      explanation: "A single dot is the current directory.",
    },
  ],
  assignment: {
    title: "Reorganise a folder",
    task: [
      "Create a messy folder with several files, rename one, move two into a new subfolder, and copy a folder tree with cp -r.",
      "Show how mv -n and cp -i protect an existing file.",
    ],
    checklist: [
      "I renamed and moved files",
      "I copied a directory recursively",
      "An existing file was protected with -n or -i",
      "I verified each step with ls",
    ],
    hints: ["Use ls after every command."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "move-copy-recipes",
      title: "Pick the command",
      task: [
        "Write commands to: (1) rename draft.txt to final.txt; (2) copy final.txt into the existing folder archive without overwriting an existing file; (3) copy the folder photos and all its content to photos_backup.",
      ],
      language: "bash",
      starter: "# 1\n# 2\n# 3",
      solution:
        "mv draft.txt final.txt\ncp -n final.txt archive\ncp -r photos photos_backup",
      hints: ["-n prevents overwriting."],
      checklist: [
        "mv renames",
        "-n is used in the second command",
        "-r is used in the third",
      ],
    },
  ],
  revisionNotes: [
    "mv renames or moves; cp copies; . is the current directory",
    "cp -r for directories",
    "-i asks before overwriting, -n never overwrites",
    "Destination directory: file goes inside; destination file: replaced",
  ],
  resources: [
    {
      label: "mv(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/mv.1.html",
    },
    {
      label: "cp(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/cp.1.html",
    },
    {
      label: "GNU Coreutils manual",
      url: "https://www.gnu.org/software/coreutils/manual/html_node/index.html",
    },
  ],
})
