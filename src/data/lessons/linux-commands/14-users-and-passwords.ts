import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "users-and-passwords",
  title: "Managing users and passwords",
  topic: "Users",
  minutes: 18,
  overview:
    "Add and delete users with adduser and deluser, change your password with passwd, and understand why these commands need sudo.",
  objectives: [
    "Create and delete a user account",
    "Change your own password",
    "Explain where user accounts are recorded",
    "Apply least privilege when giving access",
  ],
  prerequisites: ["lesson.linux-commands.packages-apt"],
  sections: [
    {
      kind: "explain",
      heading: "Accounts",
      body: [
        "Every person or service that uses the system has a **user account** with a name, a numeric user ID, a primary group and usually a home directory such as `/home/ana`. The accounts are recorded in `/etc/passwd`, one line per user, with fields separated by colons; password hashes are kept separately in a protected file.",
        "On Debian and Ubuntu, `sudo adduser username` creates a user: it creates the home directory, asks for a password and some optional details. `sudo deluser username` deletes the account (its home directory is kept unless you ask for `--remove-home`). `passwd` changes **your** password; `sudo passwd username` sets another user's password.",
      ],
    },
    {
      kind: "code",
      heading: "Account commands",
      example: {
        title: "adduser, deluser, passwd",
        language: "bash",
        code: "whoami\nid -un\ngrep -c '^root:' /etc/passwd\ncut -d ':' -f 1 /etc/passwd | head -n 1\nsudo adduser ana\nsudo deluser ana\npasswd",
        walkthrough: [
          "`whoami` and `id -un` print your own user name. `/etc/passwd` is world-readable, so `grep` and `cut` can read it: the first line starts with the user `root`.",
          "`sudo adduser ana` creates the account `ana` and asks for a password and optional full name, room number and phone number. Run it only on a machine you administer.",
          "`sudo deluser ana` deletes the account; add `--remove-home` to delete the home directory too.",
          "`passwd` asks for your current password and then the new password twice. Nothing is displayed while you type.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "User tasks",
      diagram: {
        kind: "table",
        title: "Commands",
        headers: ["Task", "Command"],
        rows: [
          ["Who am I?", "whoami"],
          ["Add a user", "sudo adduser name"],
          ["Delete a user", "sudo deluser name"],
          ["Delete user and home directory", "sudo deluser --remove-home name"],
          ["Change my password", "passwd"],
          ["Set another user's password", "sudo passwd name"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Sharing one account between several people.",
          fix: "Give each person an account so actions can be traced and access revoked.",
        },
        {
          mistake: "Using weak or reused passwords.",
          fix: "Use long unique passwords or SSH keys.",
        },
        {
          mistake: "Deleting a user without checking what they own.",
          fix: "Back up or reassign their files and stop their processes first.",
        },
        {
          mistake: "Giving every user sudo rights.",
          fix: "Grant administrator access only to those who need it.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Onboarding a contractor",
      scenario: "A contractor needs temporary access to a server.",
      body: [
        "Create an account with `sudo adduser contractor`, give them a temporary password and ask them to change it with `passwd` at first login. When the contract ends, `sudo deluser --remove-home contractor` removes the account after you have copied anything that must be kept.",
        "Record who created the account and when.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "passwd-own",
      prompt: "What does passwd with no arguments do?",
      options: [
        "Changes your own password",
        "Deletes your account",
        "Shows the password file",
      ],
      answer: 0,
      explanation:
        "Without a user name passwd changes the password of the current user.",
    },
    {
      type: "single",
      id: "adduser-cmd",
      prompt: "Which command creates a user on Debian or Ubuntu?",
      options: ["sudo adduser name", "sudo makeuser name", "passwd name"],
      answer: 0,
      explanation: "adduser is the friendly front-end for creating users.",
    },
    {
      type: "truefalse",
      id: "account-file",
      statement: "User accounts are listed in /etc/passwd.",
      answer: true,
      explanation: "Each line describes one account.",
    },
    {
      type: "blank",
      id: "delete-user",
      prompt: "To delete a user account, run sudo ___ username.",
      answer: "deluser",
      explanation: "`deluser` removes an account.",
    },
  ],
  assignment: {
    title: "Account plan",
    task: [
      "Write a short procedure (commands and reasons) for adding a user, forcing them to set their own password and removing them later, including what to do with their files.",
      "Inspect /etc/passwd with cut to list all user names, and explain what the numbers in the third field mean.",
    ],
    checklist: [
      "The procedure uses adduser, passwd and deluser",
      "Cleanup of files is covered",
      "/etc/passwd was read with cut",
      "Least privilege is mentioned",
    ],
    hints: ["cut -d ':' -f 1,3 /etc/passwd shows names and IDs."],
    minutes: 10,
  },
  exercises: [
    {
      slug: "user-commands",
      title: "Pick the command",
      task: [
        "Write commands to: add the user mia; later delete mia together with her home directory; change your own password.",
      ],
      language: "bash",
      starter: "# commands",
      solution: "sudo adduser mia\nsudo deluser --remove-home mia\npasswd",
      hints: ["Use sudo for account changes."],
      checklist: [
        "adduser and deluser use sudo",
        "--remove-home is used",
        "passwd has no user name",
      ],
    },
  ],
  revisionNotes: [
    "User accounts live in /etc/passwd",
    "sudo adduser / deluser (--remove-home); passwd for your own password",
    "One account per person; least privilege",
    "Back up files before deleting an account",
  ],
  resources: [
    {
      label: "passwd(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/passwd.1.html",
    },
    {
      label: "passwd(5): the password file",
      url: "https://man7.org/linux/man-pages/man5/passwd.5.html",
    },
    {
      label: "useradd(8) manual page",
      url: "https://man7.org/linux/man-pages/man8/useradd.8.html",
    },
    {
      label: "userdel(8) manual page",
      url: "https://man7.org/linux/man-pages/man8/userdel.8.html",
    },
  ],
})
