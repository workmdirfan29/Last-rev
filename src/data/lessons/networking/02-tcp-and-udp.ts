import { defineLesson } from "@/data/lessons/author"

export default defineLesson("networking", {
  slug: "tcp-and-udp",
  title: "TCP and UDP",
  topic: "TCP/IP",
  minutes: 45,
  overview:
    "Compare TCP's reliable byte stream with UDP's simple datagrams, follow the three-way handshake, and try both with Python sockets on your own machine.",
  objectives: [
    "Explain what TCP guarantees and how it does it",
    "Describe the three-way handshake and connection close",
    "Describe UDP and when it is the better choice",
    "Write a small TCP echo and a UDP exchange",
  ],
  prerequisites: ["lesson.networking.layers-and-encapsulation"],
  sections: [
    {
      kind: "explain",
      heading: "Two transport protocols",
      body: [
        "Both protocols carry data between programs, identified by **ports**, on top of IP. **TCP** (Transmission Control Protocol, RFC 9293) provides a **reliable, ordered byte stream** between two endpoints: data arrives complete, in order and without duplicates, or the application is told that the connection failed. **UDP** (User Datagram Protocol, RFC 768) sends independent **datagrams** with no connection, no retransmission and no ordering: it is simple and fast and the application deals with loss.",
        "TCP achieves reliability with **sequence numbers** (every byte is numbered), **acknowledgements**, **retransmission** of data that is not acknowledged, **flow control** (the receiver's *window* says how much it can accept) and **congestion control** (the sender slows down when the network is overloaded). The price is extra round trips, delays and state.",
      ],
    },
    {
      kind: "diagram",
      heading: "The TCP three-way handshake",
      diagram: {
        kind: "flow",
        title: "Opening a connection",
        steps: [
          {
            label: "SYN",
            detail:
              "The client sends a segment with the SYN flag and its initial sequence number",
          },
          {
            label: "SYN-ACK",
            detail:
              "The server answers with SYN and ACK flags and its own initial sequence number",
          },
          {
            label: "ACK",
            detail:
              "The client acknowledges; the connection is established and data can flow",
          },
          {
            label: "FIN / ACK",
            detail:
              "Closing: each side sends FIN and the other acknowledges it, so each direction closes separately",
          },
        ],
      },
    },
    {
      kind: "diagram",
      heading: "TCP versus UDP",
      diagram: {
        kind: "table",
        title: "Choosing a transport",
        headers: ["", "TCP", "UDP"],
        rows: [
          ["Connection", "Yes: handshake first", "No"],
          [
            "Delivery",
            "Reliable and ordered",
            "Best effort: loss and reordering possible",
          ],
          [
            "Unit",
            "A byte stream with no message boundaries",
            "Datagrams with boundaries preserved",
          ],
          [
            "Overhead",
            "Higher (state, acknowledgements)",
            "Low (8-byte header)",
          ],
          [
            "Typical use",
            "Web (HTTP), email, file transfer, SSH, databases",
            "DNS queries, live audio and video, games, discovery",
          ],
        ],
      },
    },
    {
      kind: "code",
      heading: "A TCP echo on localhost",
      example: {
        title: "Server and client in one script",
        language: "python",
        code: 'import socket, threading\n\nserver = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\nserver.bind(("127.0.0.1", 0))            # port 0: the OS picks a free port\nserver.listen()\nport = server.getsockname()[1]\n\ndef serve():\n    conn, addr = server.accept()          # blocks until a client connects\n    with conn:\n        data = conn.recv(1024)\n        conn.sendall(data.upper())\n\nthreading.Thread(target=serve).start()\n\nwith socket.create_connection(("127.0.0.1", port)) as client:   # the handshake happens here\n    client.sendall(b"hello")\n    print("client got:", client.recv(1024))\n    print("peer address:", client.getpeername()[0])\n    print("is a stream socket:", client.type == socket.SOCK_STREAM)\n\nserver.close()',
        walkthrough: [
          "The server creates a **stream** socket (`SOCK_STREAM` means TCP), binds it to the loopback address and a free port, and calls `listen()` so the operating system accepts connections for it.",
          "`socket.create_connection` makes the client connect; at that moment the three-way handshake runs. `accept()` on the server returns a **new** socket for this one client.",
          'TCP delivers bytes, not messages: `sendall(b"hello")` and `recv(1024)` work here because the message is tiny and local, but a real program must loop on `recv` or use a protocol that marks message ends (a length prefix or a delimiter).',
          "The output shows the reply `b'HELLO'` and the peer address `127.0.0.1`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "UDP datagrams",
      example: {
        title: "No connection, message boundaries kept",
        language: "python",
        code: 'import socket\n\nreceiver = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)\nreceiver.bind(("127.0.0.1", 0))\naddress = receiver.getsockname()\n\nsender = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)\nsender.sendto(b"first", address)           # no connect, no handshake\nsender.sendto(b"second", address)\n\nfor _ in range(2):\n    data, source = receiver.recvfrom(1024)  # one datagram per call\n    print(data, "from", source[0])\n\nsender.close()\nreceiver.close()',
        walkthrough: [
          "A **datagram** socket (`SOCK_DGRAM` means UDP) needs no connection: `sendto` addresses each message separately.",
          "Each `recvfrom` returns exactly one datagram, so the two messages arrive as two separate pieces: `b'first'` and then `b'second'`. This is different from TCP, which has no message boundaries.",
          "On a real network a datagram can be lost, duplicated or reordered, and UDP will not tell you. The loopback interface is reliable, which is why this demonstration is predictable. Protocols built on UDP add their own acknowledgements when they need them.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Assuming one send() equals one recv() on TCP.",
          fix: "TCP is a stream; frame your messages and loop until you have all the bytes.",
        },
        {
          mistake: "Choosing UDP to 'go faster' without handling loss.",
          fix: "Use UDP only if the application can cope with loss or add its own reliability.",
        },
        {
          mistake: "Forgetting timeouts on sockets.",
          fix: "Set a timeout so a dead peer cannot block your program for ever.",
        },
        {
          mistake: "Ignoring that a closed connection returns empty data.",
          fix: "recv returning b'' means the peer closed; stop reading.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Why DNS uses UDP and a download uses TCP",
      scenario:
        "A DNS lookup is a tiny question and answer; a file download is millions of bytes that must all arrive.",
      body: [
        "For DNS, one UDP datagram out and one back avoids the cost of a handshake. If no answer arrives, the resolver simply asks again. For a download, TCP's ordering, retransmission and congestion control are exactly what you need. (DNS falls back to TCP for large answers.)",
        "Real-time calls often choose UDP because a late packet is useless: it is better to skip it than to wait for a retransmission.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "tcp-guarantee",
      prompt: "Which protocol provides reliable, ordered delivery?",
      options: ["TCP", "UDP", "Both"],
      answer: 0,
      explanation: "TCP retransmits and orders data; UDP does not.",
    },
    {
      type: "single",
      id: "handshake-first",
      prompt: "What is the first segment of the three-way handshake?",
      options: ["SYN", "ACK", "FIN"],
      answer: 0,
      explanation: "The client sends SYN, the server SYN-ACK, the client ACK.",
    },
    {
      type: "single",
      id: "udp-use",
      prompt: "Which application is a typical fit for UDP?",
      options: ["A DNS query", "A bank transfer", "A file upload"],
      answer: 0,
      explanation:
        "Small request-response exchanges and real-time media suit UDP.",
    },
    {
      type: "truefalse",
      id: "tcp-boundaries",
      statement: "TCP preserves the boundaries of the messages you send.",
      answer: false,
      explanation:
        "TCP is a byte stream; a receiver may get your bytes in different pieces.",
    },
  ],
  assignment: {
    title: "Sockets in practice",
    task: [
      "Run the TCP echo and the UDP example. Then change the TCP server to keep reading until the client closes, and make the client send three messages. Describe what you observe about message boundaries.",
      "Write a short comparison for a chat app and a video call: which protocol would you choose for each, and why?",
    ],
    checklist: [
      "Both examples ran",
      "The TCP receiver loops until the stream ends",
      "Message boundaries are explained",
      "The protocol choice is justified",
    ],
    hints: ["Use recv in a loop until it returns b''."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "tcp-or-udp",
      title: "TCP or UDP?",
      task: [
        "Write TCP or UDP for: (1) loading a web page; (2) a DNS lookup; (3) an SSH session; (4) a live video call; (5) sending an email.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.",
      solution: "1. TCP\n2. UDP\n3. TCP\n4. UDP\n5. TCP",
      hints: ["Reliability matters or not?"],
      checklist: [
        "Web, SSH and email use TCP",
        "DNS queries and live media use UDP",
      ],
    },
  ],
  revisionNotes: [
    "TCP: connection, reliable ordered byte stream, flow and congestion control",
    "Handshake SYN, SYN-ACK, ACK; close with FIN",
    "UDP: connectionless datagrams, boundaries kept, no guarantees",
    "Socket calls: bind, listen, accept, connect, send, recv",
  ],
  resources: [
    {
      label: "RFC 9293: Transmission Control Protocol (TCP)",
      url: "https://www.rfc-editor.org/rfc/rfc9293.html",
    },
    {
      label: "RFC 768: User Datagram Protocol",
      url: "https://www.rfc-editor.org/rfc/rfc768.html",
    },
    {
      label: "Python: Socket programming HOWTO",
      url: "https://docs.python.org/3/howto/sockets.html",
    },
    {
      label: "tcp(7) manual page",
      url: "https://man7.org/linux/man-pages/man7/tcp.7.html",
    },
  ],
})
