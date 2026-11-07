import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "directories",
  title: "Creating and removing directories",
  topic: "Directories",
  minutes: 30,
  overview:
    "Create directories with mkdir (one, several, or a whole path with -p) and remove empty ones with rmdir.",
  objectives: [
    "Create one or several directories in a single command",
    "Create a nested path with mkdir -p",
    "Remove empty directories with rmdir and explain why it refuses others",
    "Read the common error messages",
  ],
  prerequisites: ["linux"],
  sections: [
    {
      kind: "explain",
      heading: "Directories in the file system",
      body: [
        "A **directory** (folder) holds files and other directories. The file system is one tree that starts at the root directory `/`. Every command you run works relative to your **current directory** unless you give a path that starts with `/`.",
        "`mkdir` (make directory) creates directories and `rmdir` (remove directory) removes **empty** ones. Both accept several names at once.",
      ],
    },
    {
      kind: "code",
      heading: "mkdir and rmdir",
      example: {
        title: "Make, list and remove",
        language: "bash",
        code: "mkdir projects\nmkdir logs backups tmp\nmkdir -p site/css/fonts\nls\nls site/css\nrmdir tmp\nrmdir logs backups\nls\nmkdir full && touch full/a.txt\nrmdir full\nmkdir projects",
        walkthrough: [
          "`mkdir projects` creates one directory. `mkdir logs backups tmp` creates three in one command.",
          "`mkdir -p site/css/fonts` creates the whole path. Without `-p`, `mkdir` fails if a parent directory such as `site/css` does not exist yet. With `-p` it also does not complain when a directory already exists.",
          "`ls` lists the names: `backups logs projects site tmp`. `ls site/css` shows `fonts`.",
          "`rmdir tmp` removes one empty directory and `rmdir logs backups` removes two. Afterwards only `projects` and `site` are left.",
          "`rmdir full` fails with `rmdir: failed to remove 'full': Directory not empty` because `full` contains a file. `rmdir` only removes empty directories; deleting a directory with content is a job for `rm -r` (a later lesson).",
          "Running `mkdir projects` again fails with `mkdir: cannot create directory 'projects': File exists`.",
        ],
      },
      intro: "Run these in an empty practice folder.",
    },
    {
      kind: "diagram",
      heading: "Command summary",
      diagram: {
        kind: "table",
        title: "Directory commands",
        headers: ["Command", "What it does"],
        rows: [
          ["mkdir name", "Create one directory"],
          ["mkdir a b c", "Create several directories"],
          [
            "mkdir -p a/b/c",
            "Create the full path, including missing parents; no error if it exists",
          ],
          ["rmdir name", "Remove an empty directory"],
          ["rmdir a b c", "Remove several empty directories"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using mkdir a/b/c without -p when a does not exist.",
          fix: "Add -p so the missing parents are created.",
        },
        {
          mistake:
            "Trying to remove a directory that still has files with rmdir.",
          fix: "Empty it first, or use rm -r when you really mean to delete everything inside.",
        },
        {
          mistake: "Spaces in names: mkdir my notes creates two directories.",
          fix: 'Quote the name: mkdir "my notes", or avoid spaces.',
        },
        {
          mistake: "Running commands in the wrong directory.",
          fix: "Check with pwd before you create or remove things.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Project skeleton",
      scenario:
        "You start a new web project and need folders for source, styles and images.",
      body: [
        "`mkdir -p myapp/src myapp/assets/images myapp/assets/css` creates all of them in one go. Because `-p` is idempotent for existing directories, you can run the same line again safely.",
        "If you made a folder by mistake and it is empty, `rmdir` removes it without any risk of deleting data.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "mkdir-p-purpose",
      prompt: "What does mkdir -p a/b/c do?",
      options: [
        "Creates a, b and c as needed and does not fail if they exist",
        "Prints the path a/b/c",
        "Protects the directory from deletion",
      ],
      answer: 0,
      explanation:
        "-p creates missing parent directories and ignores directories that already exist.",
    },
    {
      type: "single",
      id: "rmdir-nonempty",
      prompt: "What does rmdir do on a directory that contains a file?",
      options: [
        "It fails with 'Directory not empty'",
        "It deletes the file and the directory",
        "It moves the file to the trash",
      ],
      answer: 0,
      explanation: "rmdir only removes empty directories.",
    },
    {
      type: "output",
      id: "ls-after-mkdir",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "mkdir a b c\nrmdir b\nls",
      },
      options: ["a c", "a b c", "b"],
      answer: 0,
      explanation:
        "Three directories were created, then b was removed, leaving a and c.",
    },
    {
      type: "blank",
      id: "mkdir-flag",
      prompt:
        "To create a nested path with its missing parents, run mkdir ___ a/b/c.",
      answer: "-p",
      explanation: "`mkdir -p` creates parent directories as needed.",
      accepted: ["--parents"],
    },
  ],
  assignment: {
    title: "Folder skeleton",
    task: [
      "In a practice folder, create a folder structure for a small blog with at least two levels, using mkdir -p once.",
      "List it, then remove one empty folder with rmdir and show the error you get when you try rmdir on a folder that is not empty.",
    ],
    checklist: [
      "The structure was created with a single mkdir -p command",
      "I listed the result with ls",
      "I removed an empty folder with rmdir",
      "I produced the 'Directory not empty' error and explained it",
    ],
    hints: ["Use ls -R to see the whole tree."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "make-tree",
      title: "Make a tree",
      task: [
        "Write the commands to create the directories photos/2024/spring and photos/2024/summer, then remove the empty directory photos/2024/spring.",
      ],
      language: "bash",
      starter: "# your commands",
      solution:
        "mkdir -p photos/2024/spring photos/2024/summer\nrmdir photos/2024/spring",
      hints: ["mkdir -p accepts several paths."],
      checklist: [
        "Both paths are created with mkdir -p",
        "Only an empty directory is removed with rmdir",
      ],
    },
  ],
  revisionNotes: [
    "mkdir name, mkdir a b c, mkdir -p a/b/c",
    "rmdir removes only empty directories",
    "Quote names that contain spaces",
    "pwd tells you where you are",
  ],
  resources: [
    {
      label: "mkdir(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/mkdir.1.html",
    },
    {
      label: "rmdir(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/rmdir.1.html",
    },
    {
      label: "GNU Coreutils manual",
      url: "https://www.gnu.org/software/coreutils/manual/html_node/index.html",
    },
  ],
})
