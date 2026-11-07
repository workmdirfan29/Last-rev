import { defineLesson } from "@/data/lessons/author"

export default defineLesson("networking", {
  slug: "ports-and-sockets",
  title: "Ports and sockets",
  topic: "Ports & sockets",
  minutes: 45,
  overview:
    "Use port numbers to reach the right program, understand sockets and the difference between listening and connected sockets, the well-known ports, ephemeral ports, and the common 'address already in use' error.",
  objectives: [
    "Explain what a port number is and the port ranges",
    "Describe a socket and a connection as a 4-tuple",
    "Use the socket calls bind, listen, accept and connect",
    "Diagnose 'address already in use' and 'connection refused'",
    "List listening ports with ss",
  ],
  prerequisites: ["lesson.networking.tcp-and-udp"],
  sections: [
    {
      kind: "explain",
      heading: "Ports",
      body: [
        "An IP address finds a **machine**; a **port** finds a **program** on it. A port is a 16-bit number from 0 to 65535, used with TCP or UDP. Ports are grouped by convention: **well-known ports** (0 to 1023) for standard services, such as 22 (SSH), 25 (mail), 53 (DNS), 80 (HTTP) and 443 (HTTPS), usually need administrator rights to listen on; **registered ports** (1024 to 49151) are used by applications; **dynamic or ephemeral ports** (the upper range) are picked by the operating system for outgoing client connections. On Linux, the file `/etc/services` maps names to numbers.",
        "A **socket** is the endpoint a program uses to communicate: an IP address, a port and a protocol. A TCP **connection** is identified by four values: source address, source port, destination address and destination port. That is why a server on port 443 can talk to thousands of clients at once: each client has a different address or ephemeral port, so every connection is unique.",
      ],
    },
    {
      kind: "code",
      heading: "Sockets in Python",
      example: {
        title: "Service names, bind errors and many clients",
        language: "python",
        code: 'import socket, threading\n\nprint(socket.getservbyname("https"), socket.getservbyname("ssh"), socket.getservbyport(53, "udp"))\n\nserver = socket.socket()\nserver.bind(("127.0.0.1", 0))\nserver.listen()\nport = server.getsockname()[1]\nprint("listening on a free port:", 1024 <= port <= 65535)\n\nother = socket.socket()\ntry:\n    other.bind(("127.0.0.1", port))\nexcept OSError as e:\n    print("second bind failed:", e.errno, e.strerror)\n\npeers = []\ndef accept_two():\n    for _ in range(2):\n        conn, addr = server.accept()\n        peers.append(addr[1])\n        conn.close()\n\nt = threading.Thread(target=accept_two)\nt.start()\nclients = [socket.create_connection(("127.0.0.1", port)) for _ in range(2)]\nt.join()\nprint("different client ports:", len(set(peers)) == 2, "| server port unchanged:", port not in peers)\nfor c in clients:\n    c.close()\n\nclosed = socket.socket()\nclosed.bind(("127.0.0.1", 0))\nfree_port = closed.getsockname()[1]\nclosed.close()\ntry:\n    socket.create_connection(("127.0.0.1", free_port), timeout=1)\nexcept ConnectionRefusedError as e:\n    print("connect failed:", e.strerror)',
        walkthrough: [
          "`getservbyname` reads the services database: `https` is `443`, `ssh` is `22` and UDP port `53` is `domain` (DNS) in the system list.",
          "The server **binds** to the loopback address and port 0 (the operating system chooses a free port) and **listens**. A second socket that tries to bind the same address and port fails with `errno 98: Address already in use`: only one program can listen on a given port.",
          "Two clients connect to the same server port. Each gets its own ephemeral port from the operating system, so the server sees two different peer ports, while the server's own port stays the same. Four values identify each connection.",
          "Connecting to a port where nobody is listening fails at once with `Connection refused`: the machine answered, but no program owns that port. A firewall that silently drops packets causes a timeout instead, which is a different symptom.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Which ports are listening?",
      example: {
        title: "ss shows sockets",
        language: "bash",
        code: "python3 -c 'import socket, time; s = socket.socket(); s.bind((\"127.0.0.1\", 8765)); s.listen(); time.sleep(3)' &\nsleep 1\nss -ltn 'sport = :8765' | tail -n +2 | awk '{print $1, $4}'\nwait",
        walkthrough: [
          "A background Python process listens on port 8765 for three seconds.",
          "`ss -ltn` lists **l**istening **t**CP sockets with **n**umeric addresses and ports (`-u` would show UDP, `-p` shows the owning process when you have permission). The filter `sport = :8765` keeps only that port.",
          "The output is `LISTEN 127.0.0.1:8765`: the state, then the local address and port. The same tool shows established connections with `ss -tn`.",
          "To test whether a remote port is reachable use `nc -vz host port`; `connection refused` and a timeout mean different things, as explained above.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Common ports",
      diagram: {
        kind: "table",
        title: "Well-known services",
        headers: ["Port", "Service", "Protocol"],
        rows: [
          ["22", "SSH and SFTP/SCP", "TCP"],
          ["25", "SMTP (mail between servers)", "TCP"],
          ["53", "DNS", "UDP and TCP"],
          ["80", "HTTP", "TCP"],
          ["443", "HTTPS", "TCP"],
          ["3306", "MySQL database", "TCP"],
          ["5432", "PostgreSQL database", "TCP"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Binding a server to 0.0.0.0 by accident, which exposes it to the network.",
          fix: "Bind to 127.0.0.1 for local-only services; open ports to the network deliberately.",
        },
        {
          mistake: "Leaving a program on a port and starting a second copy.",
          fix: "Check with ss -ltn first; stop the old process or choose another port.",
        },
        {
          mistake: "Confusing 'connection refused' with a timeout.",
          fix: "Refused: host reachable, nothing listening. Timeout: packets dropped or host unreachable.",
        },
        {
          mistake: "Hard-coding client ports.",
          fix: "Let the operating system pick ephemeral ports for clients.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Why won't my app start?",
      scenario:
        "A web app fails to start with 'EADDRINUSE: address already in use :::3000'.",
      body: [
        "Another process owns port 3000. Run `ss -ltnp 'sport = :3000'` to see which, stop it (or start your app on another port), and start again. Never kill a process before you know what it is.",
        "In containers, remember that publishing a port (`-p 8080:80`) binds it on the host and must also be free.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "port-range",
      prompt: "What is the valid range of TCP and UDP port numbers?",
      options: ["0 to 65535", "1 to 255", "0 to 1023 only"],
      answer: 0,
      explanation: "Ports are 16-bit numbers.",
    },
    {
      type: "single",
      id: "tuple-unique",
      prompt: "What makes a TCP connection unique?",
      options: [
        "Source and destination addresses and ports",
        "Only the destination port",
        "The process name",
      ],
      answer: 0,
      explanation: "The four-value tuple identifies the connection.",
    },
    {
      type: "single",
      id: "refused-meaning",
      prompt: "What does 'connection refused' usually mean?",
      options: [
        "The host answered but nothing is listening on that port",
        "The network cable is unplugged",
        "The firewall dropped the packet silently",
      ],
      answer: 0,
      explanation:
        "A closed port is actively refused; dropped packets cause timeouts.",
    },
    {
      type: "output",
      id: "service-lookup",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "import socket\nprint(socket.getservbyname('https'))",
      },
      options: ["443", "80", "22"],
      answer: 0,
      explanation: "The system services database maps https to port 443.",
    },
  ],
  assignment: {
    title: "Port investigator",
    task: [
      "List the listening TCP ports on your computer with ss -ltn and identify what three of them are. Then start a small server on a chosen port and confirm with ss that it listens.",
      "Start a second server on the same port, record the error, and then test a closed port with nc -vz and explain the message.",
    ],
    checklist: [
      "I listed and explained listening ports",
      "I saw 'address already in use'",
      "I distinguished refused from timed out",
      "I used 127.0.0.1 versus 0.0.0.0 correctly",
    ],
    hints: ["ss -ltnp shows process names for your own processes."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "port-facts",
      title: "Port facts",
      task: [
        "Write the port number for: (1) HTTPS; (2) SSH; (3) HTTP; (4) DNS; (5) PostgreSQL's default.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.",
      solution: "1. 443\n2. 22\n3. 80\n4. 53\n5. 5432",
      hints: ["The well-known ports are below 1024."],
      checklist: [
        "443 for HTTPS",
        "22 for SSH",
        "80 for HTTP",
        "53 for DNS",
        "5432 for PostgreSQL",
      ],
    },
  ],
  revisionNotes: [
    "Port = 16-bit number identifying a program; well-known <1024, registered, ephemeral",
    "Socket = address + port + protocol; connection = 4-tuple",
    "bind, listen, accept (server); connect (client)",
    "Address already in use = port taken; refused = nothing listening; timeout = dropped; ss -ltn",
  ],
  resources: [
    {
      label: "Python: Socket programming HOWTO",
      url: "https://docs.python.org/3/howto/sockets.html",
    },
    {
      label: "socket(7) manual page",
      url: "https://man7.org/linux/man-pages/man7/socket.7.html",
    },
    {
      label: "ss(8) manual page",
      url: "https://man7.org/linux/man-pages/man8/ss.8.html",
    },
    {
      label: "services(5) manual page",
      url: "https://man7.org/linux/man-pages/man5/services.5.html",
    },
  ],
})
