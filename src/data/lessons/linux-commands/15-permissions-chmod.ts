import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "permissions-chmod",
  title: "File permissions with chmod",
  topic: "Permissions",
  minutes: 15,
  overview:
    "Read the permission string of ls -l and change permissions with chmod using octal numbers such as 742 and symbolic modes.",
  objectives: [
    "Read r, w and x for user, group and others",
    "Convert between letters and the octal digits 4, 2 and 1",
    "Change permissions with chmod NNN",
    "Explain why 777 is a bad default",
  ],
  prerequisites: ["lesson.linux-commands.listing-ls"],
  sections: [
    {
      kind: "explain",
      heading: "Reading the permission string",
      body: [
        "`ls -l` starts each line with ten characters, for example `-rwxr---w-`. The first is the type (`-` file, `d` directory). The next nine are three groups of three for the **user** (owner), the **group** and **others**. In each group `r` is read, `w` is write and `x` is execute; a `-` means the permission is missing.",
        "For a directory, `r` lets you list it, `w` lets you create or delete entries in it and `x` lets you enter it and reach the files inside.",
      ],
    },
    {
      kind: "diagram",
      heading: "Octal digits",
      diagram: {
        kind: "table",
        title: "Permission values",
        headers: ["Letters", "Value", "Digit"],
        rows: [
          ["r--", "4", "4"],
          ["-w-", "2", "2"],
          ["--x", "1", "1"],
          ["rw-", "4 + 2", "6"],
          ["rwx", "4 + 2 + 1", "7"],
          ["r-x", "4 + 1", "5"],
        ],
      },
    },
    {
      kind: "code",
      heading: "chmod with numbers",
      example: {
        title: "742 means u=7 g=4 o=2",
        language: "bash",
        code: "touch f\nmkdir dd\nchmod 742 f\nls -l f | cut -c1-10\nchmod 644 f\nls -l f | cut -c1-10\nchmod 755 dd\nls -ld dd | cut -c1-10\nchmod 600 f\nls -l f | cut -c1-10\nchmod u+x,g-r,o=r f\nls -l f | cut -c1-10\nchmod 999 f",
        walkthrough: [
          "`chmod 742 f` gives the user `7` (rwx), the group `4` (r--) and others `2` (-w-): `-rwxr---w-`.",
          "`644` is the usual mode of a text file: the owner reads and writes, everybody else only reads (`-rw-r--r--`). `755` is common for directories and programs (`drwxr-xr-x`). `600` keeps a file private (`-rw-------`).",
          "The symbolic form changes only what you name: `u+x` adds execute for the user, `g-r` removes read for the group and `o=r` sets others to exactly read. Starting from `600` (`-rw-------`), the result is `-rwx---r--`.",
          "`chmod 999` fails with `chmod: invalid mode: '999'` because each octal digit must be 0 to 7.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using chmod 777 to make an error go away.",
          fix: "It lets everyone modify the file. Find out which permission is really missing.",
        },
        {
          mistake: "Forgetting that directories need x to be entered.",
          fix: "Use 755 for shared directories.",
        },
        {
          mistake: "Using digits above 7.",
          fix: "Each digit is a sum of 4, 2 and 1, so the maximum is 7.",
        },
        {
          mistake: "Changing permissions on system files.",
          fix: "Wrong modes on system files can lock you out or open security holes.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A private key and a script",
      scenario:
        "An SSH key file must be readable only by you, and a script must be runnable.",
      body: [
        "`chmod 600 id_key` allows only the owner to read and write the key. `chmod 755 deploy.sh` lets everyone run the script, while only the owner can edit it. Verify both with `ls -l`.",
        "To make a script executable only for yourself, use `chmod 700 deploy.sh` or `chmod u+x deploy.sh`.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "octal-742",
      prompt: "What do the permissions of chmod 742 mean?",
      options: [
        "User rwx, group r--, others -w-",
        "User r--, group rwx, others -w-",
        "User rwx, group -w-, others r--",
      ],
      answer: 0,
      explanation: "7 = rwx, 4 = r--, 2 = -w-.",
    },
    {
      type: "output",
      id: "chmod-644",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "touch f\nchmod 644 f\nls -l f | cut -c1-10",
      },
      options: ["-rw-r--r--", "-rwxr-xr-x", "-rw-------"],
      answer: 0,
      explanation: "644 is rw- for the owner and r-- for group and others.",
    },
    {
      type: "truefalse",
      id: "digit-8",
      statement: "chmod 888 file is a valid octal mode.",
      answer: false,
      explanation: "Octal digits go from 0 to 7.",
    },
    {
      type: "blank",
      id: "digit-sum",
      prompt: "Read = 4, write = 2, execute = ___.",
      answer: "1",
      explanation: "r + w + x = 4 + 2 + 1 = 7.",
    },
  ],
  assignment: {
    title: "Permission lab",
    task: [
      "In a practice folder, create a file and a directory. Set the file to 644, 600 and 755 in turn and write the ls -l string after each. Predict before you check.",
      "Remove all permissions from the file with chmod 000, try to read it and explain the error.",
    ],
    checklist: [
      "I predicted and checked three modes",
      "I used both octal and symbolic chmod",
      "I explained 'Permission denied'",
      "I explained why 777 is risky",
    ],
    hints: ["ls -l file | cut -c1-10 prints just the mode."],
    minutes: 10,
  },
  exercises: [
    {
      slug: "chmod-recipes",
      title: "Choose the mode",
      task: [
        "Write the chmod commands for: (1) notes.txt readable and writable by the owner, readable by everyone else; (2) secret.key readable and writable only by the owner; (3) run.sh executable by everyone, writable only by the owner.",
      ],
      language: "bash",
      starter: "# 1\n# 2\n# 3",
      solution: "chmod 644 notes.txt\nchmod 600 secret.key\nchmod 755 run.sh",
      hints: ["Add up 4, 2 and 1 for each class."],
      checklist: ["644 for notes.txt", "600 for secret.key", "755 for run.sh"],
    },
  ],
  revisionNotes: [
    "ls -l: type, then user / group / others",
    "r = 4, w = 2, x = 1; 742 = rwx r-- -w-",
    "644 files, 755 programs and directories, 600 private",
    "Never use 777 as a quick fix",
  ],
  resources: [
    {
      label: "chmod(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/chmod.1.html",
    },
    {
      label: "credentials(7): process identifiers",
      url: "https://man7.org/linux/man-pages/man7/credentials.7.html",
    },
    {
      label: "GNU Coreutils manual",
      url: "https://www.gnu.org/software/coreutils/manual/html_node/index.html",
    },
  ],
})
