import { defineLesson } from "@/data/lessons/author"

export default defineLesson("networking", {
  slug: "layers-and-encapsulation",
  title: "The TCP/IP model and encapsulation",
  topic: "TCP/IP",
  minutes: 45,
  overview:
    "See how network software is organised in layers (link, internet, transport, application), how data is wrapped in headers on its way down the stack, and read a real IPv4 header.",
  objectives: [
    "Name the four TCP/IP layers and their jobs",
    "Relate the TCP/IP layers to the seven-layer OSI model",
    "Explain encapsulation and decapsulation",
    "Read the main fields of an IPv4 header",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "Why layers",
      body: [
        "A network is too complex for one big program, so it is built in **layers**. Each layer does one job, offers a simple service to the layer above and uses the service of the layer below. A web browser does not need to know whether the data travels over Wi-Fi or a cable, and a Wi-Fi card does not need to know about web pages. Layers can be replaced independently.",
        "The **TCP/IP model**, the model of the real Internet, has four layers. The **OSI model** is a teaching model with seven layers; the two are often compared.",
      ],
    },
    {
      kind: "diagram",
      heading: "The four layers",
      diagram: {
        kind: "table",
        title: "TCP/IP model with OSI and examples",
        headers: ["TCP/IP layer", "OSI layers", "Job", "Examples"],
        rows: [
          [
            "Application",
            "5 to 7: session, presentation, application",
            "What the programs say to each other",
            "HTTP, DNS, SSH, SMTP, TLS",
          ],
          [
            "Transport",
            "4: transport",
            "Delivery between programs on two hosts, using ports",
            "TCP, UDP",
          ],
          [
            "Internet",
            "3: network",
            "Addressing and routing packets between networks",
            "IP (IPv4, IPv6), ICMP",
          ],
          [
            "Link",
            "1 and 2: physical, data link",
            "Moving frames across one local link",
            "Ethernet, Wi-Fi, MAC addresses",
          ],
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Encapsulation",
      diagram: {
        kind: "flow",
        title: "What happens when a browser sends a request",
        steps: [
          {
            label: "Application",
            detail: "The browser creates the HTTP request (the data)",
          },
          {
            label: "Transport",
            detail:
              "TCP adds a header with ports and sequence numbers: a segment",
          },
          {
            label: "Internet",
            detail:
              "IP adds a header with source and destination addresses: a packet",
          },
          {
            label: "Link",
            detail:
              "Ethernet or Wi-Fi adds a header and a trailer for the local hop: a frame",
          },
          {
            label: "Receiver",
            detail:
              "Each layer strips its own header (decapsulation) and passes the rest up",
          },
        ],
      },
    },
    {
      kind: "explain",
      heading: "Encapsulation in words",
      body: [
        "As data goes **down** the stack at the sender, each layer wraps it with its own **header** (and the link layer adds a trailer too). This is **encapsulation**. At the receiver the process is reversed: each layer removes its header and hands the payload to the layer above (**decapsulation**). Routers in the middle only look at the headers up to the internet layer; they forward packets without reading your HTTP data.",
        "A frame has a maximum payload size, the **MTU** (1500 bytes is typical on Ethernet). Larger IP packets are split into fragments or, more commonly, the sender uses smaller TCP segments to avoid fragmentation.",
      ],
    },
    {
      kind: "code",
      heading: "Reading an IPv4 header",
      example: {
        title: "Parse 20 bytes with struct",
        language: "python",
        code: 'import struct, ipaddress\n\ndef checksum(data):\n    total = sum(struct.unpack("!%dH" % (len(data) // 2), data))\n    while total >> 16:\n        total = (total & 0xFFFF) + (total >> 16)\n    return ~total & 0xFFFF\n\nheader = bytearray.fromhex("45000054" "1c464000" "40010000" "c0a80197" "08080808")\nheader[10:12] = struct.pack("!H", checksum(bytes(header)))\n\nver_ihl, tos, total_len, ident, flags_frag, ttl, proto, csum, src, dst = struct.unpack("!BBHHHBBH4s4s", bytes(header))\nprint("version:", ver_ihl >> 4)\nprint("header length:", (ver_ihl & 0x0F) * 4, "bytes")\nprint("total length:", total_len, "bytes")\nprint("flags: DF set" if flags_frag & 0x4000 else "flags: DF clear")\nprint("ttl:", ttl)\nprint("protocol:", proto, "(ICMP)" if proto == 1 else "(TCP)" if proto == 6 else "(UDP)" if proto == 17 else "")\nprint("source:", ipaddress.ip_address(src))\nprint("destination:", ipaddress.ip_address(dst))\nprint("checksum valid:", checksum(bytes(header)) == 0)',
        walkthrough: [
          'The 20 bytes are an IPv4 header. `struct.unpack("!BBHHHBBH4s4s", ...)` reads them in **network byte order** (big-endian, the `!`).',
          "The first byte holds two 4-bit numbers: the **version** (`4`) and the **header length** in 32-bit words (`5`), which is `5 * 4 = 20` bytes.",
          "`total length` is the size of the whole packet including the header: `84` bytes. The **DF** flag means *do not fragment*.",
          "**TTL** (time to live) starts at some value (here `64`) and every router subtracts one; at zero the packet is dropped. This stops packets from circling for ever. The **protocol** field says what is inside: `1` is ICMP, `6` is TCP and `17` is UDP.",
          "The header also holds the **source** and **destination** addresses. The checksum covers the header only: summing the 16-bit words including the checksum gives zero when the header is intact, so `checksum valid` is `True`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Thinking routers read the web page.",
          fix: "Routers forward by the IP header only; encryption protects the content end to end.",
        },
        {
          mistake: "Mixing up a frame, a packet and a segment.",
          fix: "Frame = link layer, packet = IP layer, segment = TCP unit, datagram = UDP unit.",
        },
        {
          mistake:
            "Memorising OSI layers without relating them to real protocols.",
          fix: "Map each real protocol you use (HTTP, TCP, IP, Ethernet) to its layer.",
        },
        {
          mistake: "Assuming one packet equals one request.",
          fix: "A request can span many packets, and packets can take different paths.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Finding the layer of a problem",
      scenario: "A user says 'the website is down'.",
      body: [
        "Work up or down the layers. Is the cable or Wi-Fi connected (link)? Does the machine have an IP address and a route (internet)? Can you reach the port (`nc -vz host 443`, transport)? Does the server answer HTTP correctly (application)? Each test eliminates one layer.",
        "This layered approach is the basis of most network troubleshooting.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "transport-layer",
      prompt:
        "Which TCP/IP layer uses port numbers to deliver data to the right program?",
      options: ["Transport", "Link", "Internet"],
      answer: 0,
      explanation: "TCP and UDP (transport) use ports.",
    },
    {
      type: "single",
      id: "encap-order",
      prompt:
        "Which layer's header is added LAST when sending, closest to the wire?",
      options: ["Link", "Application", "Transport"],
      answer: 0,
      explanation:
        "The link layer wraps the IP packet in a frame just before transmission.",
    },
    {
      type: "output",
      id: "ihl-bytes",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "ver_ihl = 0x45\nprint((ver_ihl & 0x0F) * 4)",
      },
      options: ["20", "5", "4"],
      answer: 0,
      explanation:
        "The low nibble is the header length in 32-bit words: 5 words are 20 bytes.",
    },
    {
      type: "truefalse",
      id: "ttl-purpose",
      statement:
        "TTL is decremented by each router so that packets cannot circulate for ever.",
      answer: true,
      explanation: "When TTL reaches zero the packet is discarded.",
    },
  ],
  assignment: {
    title: "Trace a request through the layers",
    task: [
      "Draw (or list) what happens to a single HTTP request from your browser to a server: name the data unit and the protocol at each layer, and which headers are added.",
      "Use the Python example to change the TTL and protocol and explain what changes in the output.",
    ],
    checklist: [
      "All four layers are named with an example protocol",
      "Segment, packet and frame are used correctly",
      "Decapsulation at the receiver is described",
      "The IPv4 header fields are explained",
    ],
    hints: ["Change bytes in the hex string and recompute the checksum."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "layer-match",
      title: "Match protocol to layer",
      task: [
        "Write the TCP/IP layer (Application, Transport, Internet or Link) for: (1) HTTP; (2) TCP; (3) IP; (4) Ethernet; (5) DNS; (6) UDP.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.\n6.",
      solution:
        "1. Application\n2. Transport\n3. Internet\n4. Link\n5. Application\n6. Transport",
      hints: ["Ports mean transport; addresses and routing mean internet."],
      checklist: [
        "HTTP and DNS are application protocols",
        "TCP and UDP are transport",
        "IP is internet",
        "Ethernet is link",
      ],
    },
  ],
  revisionNotes: [
    "Four layers: application, transport, internet, link (OSI has seven)",
    "Encapsulation adds headers going down; decapsulation removes them",
    "Frame (link), packet (IP), segment (TCP), datagram (UDP)",
    "IPv4 header: version, header length, total length, TTL, protocol, addresses, checksum",
  ],
  resources: [
    {
      label: "RFC 791: Internet Protocol",
      url: "https://www.rfc-editor.org/rfc/rfc791.html",
    },
    {
      label: "RFC 1122: Requirements for Internet hosts",
      url: "https://www.rfc-editor.org/rfc/rfc1122.html",
    },
    {
      label: "MDN: How does the Internet work?",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work",
    },
  ],
})
