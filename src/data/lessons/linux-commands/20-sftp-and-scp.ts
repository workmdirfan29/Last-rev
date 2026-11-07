import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "sftp-and-scp",
  title: "Copying files between machines with sftp and scp",
  topic: "Network & transfer",
  minutes: 45,
  overview:
    "Pull files and directories from a remote machine and push local ones with sftp sessions, sftp one-liners and scp.",
  objectives: [
    "Start an sftp session and use get and get -r",
    "Use sftp and scp one-liners to pull files",
    "Push a file or directory to a remote machine with scp",
    "Choose between sftp and scp",
  ],
  prerequisites: ["lesson.linux-commands.network-config-and-ssh"],
  sections: [
    {
      kind: "explain",
      heading: "Two tools, one secure channel",
      body: [
        "Both `sftp` and `scp` copy files over an encrypted SSH connection and use the same authentication as `ssh`. `sftp` can run **interactively**: you log in and then use commands such as `ls`, `cd`, `get` (download), `put` (upload) and `bye` to leave. `scp` is a **one-shot copy** command that is easy to put in scripts.",
        "In an sftp session, commands that change the *remote* side are `ls`, `cd` and `pwd`; their local equivalents start with `l` (`lls`, `lcd`, `lpwd`). `get file` downloads to the current local directory, `get file dest` to a given path and `get -r dir` downloads a directory recursively.",
      ],
    },
    {
      kind: "code",
      heading: "sftp",
      example: {
        title: "Interactive session and one-liners",
        language: "bash",
        code: "sftp username@192.168.1.10\nsftp> ls\nsftp> get report.txt\nsftp> get -r project\nsftp> get report.txt /tmp/\nsftp> bye\n\nsftp username@192.168.1.10:/home/user/report.txt /tmp/\nsftp -r username@192.168.1.10:/home/user/project /tmp/",
        walkthrough: [
          "`sftp user@host` opens a session. Inside it, `ls` shows the remote directory.",
          "`get report.txt` copies the remote file to your current local directory; `get -r project` copies a whole directory; `get report.txt /tmp/` stores it in a chosen local folder.",
          "`bye` (or `exit`) ends the session.",
          "The one-liners pull without an interactive session: `sftp user@host:/path/file localdest` for a file and `sftp -r user@host:/path/dir localdest` for a directory.",
        ],
      },
    },
    {
      kind: "code",
      heading: "scp",
      example: {
        title: "Pull and push",
        language: "bash",
        code: "scp username@192.168.1.10:/home/user/file.txt /tmp/\nscp -r username@192.168.1.10:/home/user/project /tmp/\nscp /home/user/file.txt username@192.168.1.10:/tmp/\nscp -r /home/user/project username@192.168.1.10:/tmp/",
        walkthrough: [
          "`scp source destination` copies from the first to the second. A remote path has the form `user@host:path`.",
          "When the remote path comes **first**, you **pull** (download) to the local destination. `-r` is needed for directories.",
          "When the local path comes first and the remote path second, you **push** (upload). The last two commands push a file and a directory.",
          "To use a non-default port with `scp` or `sftp` write `-P 2222` (capital P).",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "sftp or scp?",
      diagram: {
        kind: "table",
        title: "Choosing",
        headers: ["Situation", "Use"],
        rows: [
          ["Explore the remote folders and choose files", "sftp (interactive)"],
          ["Copy one known file or directory in a script", "scp"],
          [
            "Download with a one-liner",
            "scp user@host:path dest or sftp user@host:path dest",
          ],
          ["Upload a file", "scp file user@host:dest (or put in sftp)"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Mixing up the order of source and destination.",
          fix: "scp copies from the first argument to the last; the remote one is user@host:path.",
        },
        {
          mistake: "Forgetting -r for directories.",
          fix: "Without -r a directory is not copied.",
        },
        {
          mistake: "Using -p for the port with scp and sftp.",
          fix: "They use capital -P; lowercase -p preserves times and modes in scp.",
        },
        {
          mistake: "Overwriting files without noticing.",
          fix: "Both tools replace existing destination files; copy to a new folder first when unsure.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Collecting logs",
      scenario:
        "You need a copy of an application's logs from a server for analysis.",
      body: [
        "`scp -r deploy@10.0.0.5:/var/log/myapp ./logs-2024` copies the whole folder to a local directory. If you only need one file, `scp deploy@10.0.0.5:/var/log/myapp/error.log .` brings it to the current directory.",
        "To send a config file in the other direction, put the local path first: `scp app.conf deploy@10.0.0.5:/tmp/`.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "scp-order",
      prompt: "In scp a.txt user@host:/tmp/, what happens?",
      options: [
        "a.txt is uploaded to /tmp on the remote host",
        "a.txt is downloaded",
        "a.txt is deleted",
      ],
      answer: 0,
      explanation:
        "The local file is first and the remote path is last, so it is pushed.",
    },
    {
      type: "single",
      id: "scp-dir",
      prompt: "Which option copies a directory with scp?",
      options: ["-r", "-d", "-a"],
      answer: 0,
      explanation: "-r copies directories recursively.",
    },
    {
      type: "truefalse",
      id: "sftp-secure",
      statement: "sftp transfers files over an encrypted SSH connection.",
      answer: true,
      explanation: "Both sftp and scp use SSH.",
    },
    {
      type: "blank",
      id: "sftp-leave",
      prompt: "To leave an sftp session, type ___.",
      answer: "bye",
      explanation: "`bye` ends the session; `exit` also works.",
      accepted: ["exit", "quit"],
    },
  ],
  assignment: {
    title: "Transfer plan",
    task: [
      "Write the commands (without running them on a real server) to: download one file, download a directory, upload a file and upload a directory using scp, then repeat the two downloads with an sftp session.",
      "State the single difference between where the remote path appears for a pull and for a push.",
    ],
    checklist: [
      "All four scp commands are correct",
      "The sftp session uses get and get -r",
      "-r is used for directories",
      "Pull and push are distinguished correctly",
    ],
    hints: ["The remote path is user@host:path."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "transfer-commands",
      title: "Pull and push",
      task: [
        "Write the commands to: copy /var/log/app.log from ana@10.0.0.5 to your current directory; copy the local folder site to /srv on the same host.",
      ],
      language: "bash",
      starter: "# 1\n# 2",
      solution:
        "scp ana@10.0.0.5:/var/log/app.log .\nscp -r site ana@10.0.0.5:/srv",
      hints: ["The remote part is user@host:path."],
      checklist: [
        "The first is a pull with the remote path first",
        "The second pushes a directory with -r",
      ],
    },
  ],
  revisionNotes: [
    "sftp: interactive (ls, cd, get, get -r, put, bye); one-liners with user@host:path",
    "scp source destination; remote path = user@host:path; -r for directories",
    "Pull: remote first. Push: local first",
    "Ports use -P for scp and sftp",
  ],
  resources: [
    {
      label: "scp(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/scp.1.html",
    },
    {
      label: "sftp(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/sftp.1.html",
    },
    {
      label: "ssh(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/ssh.1.html",
    },
  ],
})
