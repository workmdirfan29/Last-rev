import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "network-config-and-ssh",
  title: "Network configuration and ssh",
  topic: "Network & transfer",
  minutes: 45,
  overview:
    "Inspect network settings with ifconfig and hostname -I, restart the network service, and log in to another machine securely with ssh.",
  objectives: [
    "Show the network interfaces and the machine's IP addresses",
    "Restart the network service with service",
    "Connect to a remote machine with ssh -p port user@host",
    "Explain host keys and why ssh is encrypted",
  ],
  prerequisites: ["lesson.linux-commands.system-information"],
  sections: [
    {
      kind: "explain",
      heading: "Network configuration",
      body: [
        "A machine talks to others through **network interfaces** (wired, Wi-Fi, loopback). `ifconfig` prints each interface with its IP address, netmask, broadcast address and packet counters; the loopback interface `lo` is `127.0.0.1`. `ifconfig` belongs to the older **net-tools** package, and on modern systems the same information comes from `ip addr`, but you will meet `ifconfig` in many guides.",
        "`hostname -I` prints all IP addresses of the machine on one line, separated by spaces, which is handy in scripts and quick checks. `-I` (capital i) lists every address, while the lowercase `-i` prints the address that the host name resolves to.",
      ],
    },
    {
      kind: "code",
      heading: "Look and restart",
      example: {
        title: "ifconfig, hostname -I and service",
        language: "bash",
        code: "ifconfig\nhostname -I\nsudo service network-manager restart\nservice network-manager restart",
        walkthrough: [
          "`ifconfig` lists interfaces such as `eth0` or `wlan0` and `lo`. Look for the `inet` line to find the IPv4 address.",
          "`hostname -I` prints something like `192.168.1.10`; the exact output depends on your machine.",
          "`sudo service network-manager restart` stops and starts the network manager, which reconnects your interfaces. It needs administrator rights, so without `sudo` (`service network-manager restart`) a normal user is usually refused.",
          "Restarting the network drops existing connections, **including your own SSH session**. Do it on a remote server only if you have another way in.",
        ],
      },
    },
    {
      kind: "code",
      heading: "ssh",
      example: {
        title: "A remote login",
        language: "bash",
        code: "ssh -p 22 username@192.168.1.10\nhostname\nexit",
        walkthrough: [
          "`ssh` (secure shell) opens a terminal on another machine. `username@192.168.1.10` says which account on which host; `-p 22` is the port (22 is the default and can be left out).",
          "The first time you connect, ssh shows the server's **host key fingerprint** and asks you to confirm. It stores the key so that it can warn you if the server's identity changes later.",
          "After you authenticate with a password or an SSH key, commands such as `hostname` run on the **remote** machine. `exit` (or Ctrl+D) closes the session.",
          "Everything sent over ssh is encrypted, unlike older tools such as telnet.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Network commands",
      diagram: {
        kind: "table",
        title: "At a glance",
        headers: ["Command", "Purpose"],
        rows: [
          ["ifconfig", "Show interfaces and their settings"],
          ["hostname -I", "Print the machine's IP addresses"],
          [
            "sudo service network-manager restart",
            "Restart the network manager",
          ],
          ["ssh -p PORT user@host", "Log in to a remote machine securely"],
          ["exit", "Leave the remote session"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Restarting the network on a remote server over ssh.",
          fix: "You will lose the connection. Use the console or schedule it carefully.",
        },
        {
          mistake: "Ignoring a changed host key warning.",
          fix: "It may mean the server was rebuilt or someone is impersonating it. Verify before you continue.",
        },
        {
          mistake: "Typing -P instead of -p for ssh.",
          fix: "ssh uses lowercase -p for the port; scp and sftp use capital -P.",
        },
        {
          mistake: "Sharing a password for the server.",
          fix: "Use key-based login and personal accounts.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Reaching a new server",
      scenario: "You received a server's IP address and a user name.",
      body: [
        "Run `ssh username@IP`. Confirm the host key fingerprint with the provider, log in, and use `hostname -I` there to confirm which machine you are on. Use `exit` when you finish.",
        "For regular access, create an SSH key with `ssh-keygen` and install the public key on the server, then you do not need a password.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "hostname-i",
      prompt: "What does hostname -I print?",
      options: [
        "All the machine's IP addresses",
        "The machine's name only",
        "The router's address",
      ],
      answer: 0,
      explanation: "-I lists every network address of the host.",
    },
    {
      type: "single",
      id: "ssh-port",
      prompt: "In ssh -p 22 user@host, what is 22?",
      options: ["The port number", "The user ID", "The number of retries"],
      answer: 0,
      explanation: "22 is the default SSH port.",
    },
    {
      type: "truefalse",
      id: "ssh-encrypted",
      statement: "ssh encrypts the traffic between the two machines.",
      answer: true,
      explanation: "SSH stands for secure shell.",
    },
    {
      type: "blank",
      id: "ssh-exit",
      prompt: "To leave a remote ssh session, type ___.",
      answer: "exit",
      explanation: "`exit` (or Ctrl+D) ends the session.",
      accepted: ["logout"],
    },
  ],
  assignment: {
    title: "Know your address",
    task: [
      "On your machine, find the IP address two ways: with ifconfig (or ip addr) and with hostname -I, and explain any difference.",
      "Write the exact ssh command to log in to 192.168.1.10 on port 2222 as the user deploy, and list three precautions before restarting networking on a remote server.",
    ],
    checklist: [
      "Both methods found the address",
      "The ssh command uses -p and user@host",
      "Host key verification is explained",
      "Three precautions are listed",
    ],
    hints: ["ssh -p 2222 user@host"],
    minutes: 15,
  },
  exercises: [
    {
      slug: "ssh-commands",
      title: "Connect",
      task: [
        "Write the commands to: print this machine's IP addresses, then log in to 10.0.0.5 as ana on the default port, and later leave the session.",
      ],
      language: "bash",
      starter: "# commands",
      solution: "hostname -I\nssh ana@10.0.0.5\nexit",
      hints: ["The default port is 22."],
      checklist: [
        "hostname -I is used",
        "ssh user@host is correct",
        "exit closes the session",
      ],
    },
  ],
  revisionNotes: [
    "ifconfig shows interfaces; hostname -I lists addresses",
    "service ... restart needs sudo and drops connections",
    "ssh -p PORT user@host; confirm the host key; exit to leave",
    "ssh uses -p, scp/sftp use -P",
  ],
  resources: [
    {
      label: "ifconfig(8) manual page",
      url: "https://man7.org/linux/man-pages/man8/ifconfig.8.html",
    },
    {
      label: "hostname(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/hostname.1.html",
    },
    {
      label: "ssh(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/ssh.1.html",
    },
  ],
})
