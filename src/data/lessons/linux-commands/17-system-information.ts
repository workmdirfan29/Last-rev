import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "system-information",
  title: "System information, restart and shutdown",
  topic: "System",
  minutes: 36,
  overview:
    "Inspect the CPU, memory and operating system with lscpu, free -h and uname -a, and understand what reboot, init 0 and init 6 do before you run them.",
  objectives: [
    "Read the output of lscpu, free -h and uname -a",
    "Tell memory that is free from memory that is available",
    "Explain the effect of reboot, init 0 and init 6",
    "Apply caution before restarting a remote machine",
  ],
  prerequisites: ["lesson.linux-commands.processes"],
  sections: [
    {
      kind: "explain",
      heading: "Looking at the machine",
      body: [
        "`uname -a` prints the kernel name and release, the host name, the architecture and the build date; `uname -s` prints just the kernel name, `Linux`, and `uname -r` the kernel release. `lscpu` describes the processor: architecture, number of CPUs, threads per core, model name and cache sizes. `free -h` shows memory in human-readable units.",
        "`free -h` prints a table with the columns **total**, **used**, **free**, **shared**, **buff/cache** and **available**, for `Mem:` (RAM) and `Swap:`. Linux uses spare memory to cache files, so a low `free` number is normal. The column to watch is **available**: the amount of memory that programs can still obtain.",
      ],
    },
    {
      kind: "code",
      heading: "Inspecting the system",
      example: {
        title: "uname, free and lscpu",
        language: "bash",
        code: "uname -s\nuname -m | grep -c .\nfree -h | awk 'NR==1 {print NF}'\nlscpu | grep -c '^Architecture:'",
        walkthrough: [
          "`uname -s` prints `Linux`. `uname -m` prints the machine architecture such as `x86_64`; the pipeline only counts that one line was printed.",
          "The header of `free -h` has six column names (`total used free shared buff/cache available`), which `awk` counts as `6` fields.",
          "`lscpu` has an `Architecture:` line (for example `x86_64`), and the grep confirms there is exactly `1`.",
          "Run `uname -a`, `lscpu` and `free -h` yourself to see the full, machine-specific output.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Restart and shutdown",
      diagram: {
        kind: "table",
        title: "Commands that stop the machine",
        headers: ["Command", "Effect"],
        rows: [
          ["reboot", "Restart the machine"],
          ["init 0", "Halt and power off (runlevel 0)"],
          ["init 6", "Reboot (runlevel 6)"],
          ["shutdown -h now", "Power off now (the same job, more options)"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Be careful with restarts",
      body: [
        "`reboot`, `init 0` and `init 6` need administrator rights (use `sudo`) and **end every running program**. On a remote server they can cut your own SSH connection and leave you locked out until someone restarts the machine. On a system that uses systemd, `init` is a compatibility command that maps to the same targets as `poweroff` and `reboot`.",
        "Before you restart a shared machine, check who is logged in, warn users and save your work. In the practice terminal these commands are safe to try.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Reading used memory without cache in mind and panicking.",
          fix: "Look at the available column, not free.",
        },
        {
          mistake: "Running reboot or init 0 on the wrong machine.",
          fix: "Check the host name first with hostname or the prompt.",
        },
        {
          mistake:
            "Powering off a remote server and expecting it to come back.",
          fix: "init 0 powers it off; use reboot to restart.",
        },
        {
          mistake: "Assuming uname shows the distribution.",
          fix: "uname shows the kernel; use cat /etc/os-release for the distribution.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Is the machine big enough?",
      scenario:
        "Before installing an application you must check that the server has enough CPU and memory.",
      body: [
        "`lscpu` shows how many CPUs and what model; `free -h` shows the total RAM and what is available now; `uname -a` tells you the architecture, which decides which build of the software to download.",
        "Record the values in a ticket so the decision can be reviewed later.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "free-column",
      prompt:
        "Which column of free -h shows the memory programs can still use?",
      options: ["available", "free", "shared"],
      answer: 0,
      explanation: "available accounts for cache that can be released.",
    },
    {
      type: "single",
      id: "init-six",
      prompt: "What does init 6 do?",
      options: ["Reboots the machine", "Powers it off", "Starts six processes"],
      answer: 0,
      explanation: "Runlevel 6 is reboot; runlevel 0 is halt.",
    },
    {
      type: "output",
      id: "uname-kernel",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "uname -s",
      },
      options: ["Linux", "x86_64", "5.15"],
      answer: 0,
      explanation: "uname -s prints the kernel name.",
    },
    {
      type: "blank",
      id: "cpu-cmd",
      prompt:
        "To see the processor architecture, number of CPUs and model, run ___.",
      answer: "lscpu",
      explanation: "`lscpu` gathers CPU information.",
    },
  ],
  assignment: {
    title: "System card",
    task: [
      "Run uname -a, lscpu and free -h and write a short 'system card': kernel, architecture, number of CPUs, total and available memory.",
      "Explain, without running them, what reboot, init 0 and init 6 would do and what you would check first on a remote server.",
    ],
    checklist: [
      "The card has kernel, architecture, CPUs and memory",
      "I used the available column",
      "I explained all three restart commands",
      "I named at least one precaution",
    ],
    hints: ["lscpu | grep -E 'Model name|^CPU\\(s\\)' shows key lines."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "system-commands",
      title: "Pick the command",
      task: [
        "Write commands to show (1) the kernel release, (2) memory in human-readable units and (3) CPU information.",
      ],
      language: "bash",
      starter: "# 1\n# 2\n# 3",
      solution: "uname -r\nfree -h\nlscpu",
      hints: ["Each is a single command."],
      checklist: [
        "uname -r for the kernel release",
        "free -h for memory",
        "lscpu for the CPU",
      ],
    },
  ],
  revisionNotes: [
    "uname -a / -s / -r / -m; lscpu; free -h",
    "available memory is what matters, not free",
    "reboot restarts; init 0 halts; init 6 reboots",
    "Check which machine you are on before restarting",
  ],
  resources: [
    {
      label: "uname(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/uname.1.html",
    },
    {
      label: "lscpu(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/lscpu.1.html",
    },
    {
      label: "free(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/free.1.html",
    },
    {
      label: "reboot(8) manual page",
      url: "https://man7.org/linux/man-pages/man8/reboot.8.html",
    },
  ],
})
