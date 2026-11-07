import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "processes",
  title: "Watching and stopping processes",
  topic: "Processes",
  minutes: 18,
  overview:
    "See what is running with top and ps -eaf, and stop a process by its ID with kill and kill -9.",
  objectives: [
    "Explain what a process and a PID are",
    "List processes with ps -eaf and monitor them with top",
    "Stop a process with kill and force it with kill -9",
    "Read exit statuses 143 and 137",
  ],
  prerequisites: ["lesson.linux-commands.pipes-and-redirection"],
  sections: [
    {
      kind: "explain",
      heading: "Processes",
      body: [
        "A running program is a **process**, and the system gives each one a number, its **PID** (process ID). `ps -eaf` prints a snapshot of every process (`-e` everyone, `-a` all, `-f` full format with the user, PID, parent PID, start time and command). `top` is a live view that refreshes every few seconds and shows CPU and memory use; press `q` to quit.",
        "`kill PID` sends the process a polite request to end, signal `SIGTERM` (15), which the program can handle and use to clean up. `kill -9 PID` sends `SIGKILL` (9), which cannot be caught or ignored: the system ends the process immediately without cleanup. Try `kill` first and use `-9` only when a process does not respond.",
      ],
    },
    {
      kind: "code",
      heading: "Start, find and stop a process",
      example: {
        title: "ps and kill",
        language: "bash",
        code: 'sleep 300 &\npid=$!\nps -p $pid -o comm=\nkill $pid\nwait $pid 2>/dev/null; echo "exit=$?"\nsleep 300 &\npid=$!\nkill -9 $pid\nwait $pid 2>/dev/null; echo "exit=$?"\nkill -l | head -n 3',
        walkthrough: [
          "`sleep 300 &` starts a harmless process in the background and `$!` holds its PID. `ps -p $pid -o comm=` prints the command name, `sleep`.",
          "`kill $pid` sends SIGTERM. The shell reports the exit status as `128 + signal number`, so `exit=143` means the process ended by signal 15.",
          "With `kill -9`, the status is `137` (128 + 9). The program had no chance to clean up.",
          "`kill -l` lists signal names: `1) SIGHUP 2) SIGINT 3) SIGQUIT ... 9) SIGKILL ... 15) SIGTERM`.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Process commands",
      diagram: {
        kind: "table",
        title: "What to run",
        headers: ["Goal", "Command"],
        rows: [
          ["Snapshot of all processes", "ps -eaf"],
          ["Find a process by name", "ps -eaf | grep name"],
          ["Live view of CPU and memory", "top (q to quit)"],
          ["Ask a process to stop", "kill PID"],
          ["Force a process to stop", "kill -9 PID"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using kill -9 first.",
          fix: "Try plain kill so the program can save data and clean up.",
        },
        {
          mistake: "Killing the wrong PID.",
          fix: "Double-check the PID with ps before you kill it.",
        },
        {
          mistake:
            "Forgetting that grep matches itself in ps -eaf | grep name.",
          fix: "Use grep [n]ame or pgrep name.",
        },
        {
          mistake: "Expecting kill to work on other users' processes.",
          fix: "You can only signal your own processes unless you use sudo.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A hung program",
      scenario: "A program stopped responding and holds a lock file.",
      body: [
        "`ps -eaf | grep programname` finds its PID. `kill PID` first; if it is still there after a few seconds, `kill -9 PID`. Then remove the stale lock file if the program documentation says so.",
        "In `top`, you can press `k`, enter the PID and a signal to kill from inside.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "kill-9",
      prompt: "What does kill -9 PID do?",
      options: [
        "Forces the process to end without letting it clean up",
        "Pauses the process",
        "Lowers its priority",
      ],
      answer: 0,
      explanation: "SIGKILL cannot be handled or ignored.",
    },
    {
      type: "output",
      id: "exit-status",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: "sleep 100 &\nkill -9 $!\nwait $! 2>/dev/null\necho $?",
      },
      options: ["137", "9", "0"],
      answer: 0,
      explanation: "A process ended by signal 9 has status 128 + 9 = 137.",
    },
    {
      type: "truefalse",
      id: "top-quit",
      statement: "You leave top by pressing q.",
      answer: true,
      explanation: "q quits top.",
    },
    {
      type: "blank",
      id: "ps-cmd",
      prompt: "To list all processes in full format, run ps -___.",
      answer: "eaf",
      explanation: "The options -e, -a and -f combine into `ps -eaf`.",
      accepted: ["ef", "aux"],
    },
  ],
  assignment: {
    title: "Process hunt",
    task: [
      "Start two sleep processes in the background. Find them with ps -eaf and grep, end one with kill and the other with kill -9, and record the exit status of each.",
      "Open top, find the process using the most CPU, then quit.",
    ],
    checklist: [
      "Both processes were found by PID",
      "kill and kill -9 were each used once",
      "143 and 137 were explained",
      "top was opened and closed with q",
    ],
    hints: ["wait $pid; echo $? shows the exit status."],
    minutes: 10,
  },
  exercises: [
    {
      slug: "stop-process",
      title: "Stop a process",
      task: [
        "A process named worker is running. Write the commands to find its PID, ask it to stop and, only if it is still running, force it to stop. Use 4321 as the PID.",
      ],
      language: "bash",
      starter: "# commands",
      solution: "ps -eaf | grep worker\nkill 4321\nkill -9 4321",
      hints: ["Use plain kill first."],
      checklist: ["ps and grep find the PID", "kill comes before kill -9"],
    },
  ],
  revisionNotes: [
    "Process = running program with a PID",
    "ps -eaf snapshot; top live (q quits)",
    "kill = SIGTERM (15); kill -9 = SIGKILL, no cleanup",
    "Exit status 128 + signal number",
  ],
  resources: [
    {
      label: "ps(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/ps.1.html",
    },
    {
      label: "top(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/top.1.html",
    },
    {
      label: "kill(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/kill.1.html",
    },
    {
      label: "signal(7): overview of signals",
      url: "https://man7.org/linux/man-pages/man7/signal.7.html",
    },
  ],
})
