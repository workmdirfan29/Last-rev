import { defineLesson } from "@/data/lessons/author"

export default defineLesson("networking", {
  slug: "dns",
  title: "DNS: names to addresses",
  topic: "DNS",
  minutes: 60,
  overview:
    "Understand how the Domain Name System turns names into IP addresses: the hierarchy, resolvers and authoritative servers, record types, caching with TTL, and the structure of a DNS message.",
  objectives: [
    "Explain the DNS hierarchy and who answers what",
    "Follow the steps of a recursive resolution",
    "Name the common record types",
    "Explain TTL and caching",
    "Read the header of a DNS query",
  ],
  prerequisites: ["lesson.networking.tcp-and-udp"],
  sections: [
    {
      kind: "explain",
      heading: "What DNS does",
      body: [
        "People use names like `www.example.com`; networks route by IP address. The **Domain Name System (DNS)** is the Internet's distributed directory that maps names to addresses and other data. No single server knows everything: the data is split into a **hierarchy** of zones, each run by a different owner.",
        "A name is read from right to left: the **root** (an implicit final dot), then the **top-level domain** (`com`, `org`, a country code), then the domain you register (`example`), then names you create under it (`www`). Servers at each level know who is responsible for the level below.",
      ],
    },
    {
      kind: "diagram",
      heading: "Resolving www.example.com",
      diagram: {
        kind: "flow",
        title: "What a resolver does when nothing is cached",
        steps: [
          {
            label: "Client asks its resolver",
            detail:
              "Your device sends the question to a recursive resolver (usually run by your network or provider) over UDP port 53",
          },
          {
            label: "Resolver asks a root server",
            detail:
              "The root does not know the answer but refers it to the servers for com",
          },
          {
            label: "Resolver asks the com servers",
            detail: "They refer it to the name servers of example.com",
          },
          {
            label: "Resolver asks the authoritative server",
            detail:
              "The authoritative server for example.com returns the answer: the address and a TTL",
          },
          {
            label: "Resolver caches and replies",
            detail:
              "The answer is cached for the TTL and returned to the client",
          },
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Record types",
      diagram: {
        kind: "table",
        title: "What a DNS zone can hold",
        headers: ["Type", "Meaning", "Example use"],
        rows: [
          ["A", "Name to IPv4 address", "www.example.com to 203.0.113.10"],
          ["AAAA", "Name to IPv6 address", "www.example.com to 2001:db8::10"],
          [
            "CNAME",
            "Alias to another name",
            "blog.example.com to sites.example.net",
          ],
          ["MX", "Mail servers for the domain, with priority", "mail routing"],
          ["NS", "Name servers responsible for the zone", "delegation"],
          [
            "TXT",
            "Free text, used for verification and email policies",
            "domain ownership checks",
          ],
          ["PTR", "Address back to a name (reverse lookup)", "log readability"],
        ],
      },
    },
    {
      kind: "code",
      heading: "Simulating the resolution",
      example: {
        title: "A toy iterative resolver with a cache",
        language: "python",
        code: 'ROOT = {"com": "the .com servers"}\nTLD = {"example.com": "ns.example.com"}\nAUTH = {"www.example.com": ("203.0.113.10", 300)}   # (address, ttl in seconds)\n\ncache = {}\n\ndef resolve(name, now):\n    hit = cache.get(name)\n    if hit and hit[1] > now:\n        return f"cache hit at t={now}: {hit[0]}"\n    lines = []\n    if hit:\n        lines.append(f"cache expired at t={now}, asking again")\n    tld = name.split(".")[-1]\n    lines.append(f"asking root about {name}")\n    lines.append(f"  -> referral to {ROOT[tld]}")\n    zone = ".".join(name.split(".")[-2:])\n    lines.append(f"asking the .{tld} servers about {name}")\n    lines.append(f"  -> referral to {TLD[zone]}")\n    lines.append(f"asking {TLD[zone]} about {name}")\n    address, ttl = AUTH[name]\n    lines.append(f"  -> answer {address} (ttl {ttl})")\n    cache[name] = (address, now + ttl)\n    return "\\n".join(lines)\n\nprint(resolve("www.example.com", 0))\nprint(resolve("www.example.com", 100))\nprint(resolve("www.example.com", 400))',
        walkthrough: [
          "The resolver starts with an empty cache. It asks a **root** server, which only knows who is responsible for `com` and sends a **referral**. The `com` servers know the name servers of `example.com` and send another referral. Finally the **authoritative** server for the zone gives the answer: the address `203.0.113.10` (a documentation address) with a **TTL** of 300 seconds.",
          "The resolver stores the answer in its **cache** until time 300. The second question at `t=100` is answered from the cache without asking anyone, which is why most lookups are fast.",
          "At `t=400` the TTL has expired, so the resolver walks the hierarchy again. A short TTL lets changes spread quickly but causes more lookups; a long TTL reduces load but delays changes. Operating systems and browsers also keep their own caches.",
        ],
      },
    },
    {
      kind: "code",
      heading: "What a DNS query looks like",
      example: {
        title: "Build and read a query message",
        language: "python",
        code: 'import socket, struct\n\ndef build_query(name, qtype=1, ident=0x1234):\n    header = struct.pack("!HHHHHH", ident, 0x0100, 1, 0, 0, 0)   # recursion desired, 1 question\n    qname = b"".join(bytes([len(label)]) + label.encode() for label in name.split(".")) + b"\\x00"\n    return header + qname + struct.pack("!HH", qtype, 1)           # type A, class IN\n\nquery = build_query("example.com")\nprint(len(query), "bytes")\nprint(query.hex())\nident, flags, questions, answers, authority, additional = struct.unpack("!HHHHHH", query[:12])\nprint("id:", hex(ident), "| recursion desired:", bool(flags & 0x0100), "| questions:", questions)\nprint("name labels:", query[12:25])\nprint("localhost ->", socket.gethostbyname("localhost"))',
        walkthrough: [
          "A DNS message starts with a 12-byte **header**: an identifier that matches answers to questions, flags (here the *recursion desired* bit, so the resolver does the work for us), and the number of questions, answers, authority and additional records.",
          "The name is not sent as text with dots. Each **label** is preceded by its length: `\\x07example\\x03com\\x00` (a zero length ends the name). After the name come the **type** (`1` is an A record) and the **class** (`1` is IN, the Internet).",
          "The whole query is `29` bytes: small enough for one UDP datagram on port 53. A real client sends it to a resolver and parses the answer records that come back.",
          '`socket.gethostbyname("localhost")` shows the system resolver at work: before asking DNS, the operating system consults local sources such as `/etc/hosts`, where `localhost` maps to `127.0.0.1`.',
        ],
      },
    },
    {
      kind: "code",
      heading: "Query tools",
      example: {
        title:
          "dig, nslookup and host (not run here: the answers depend on the Internet)",
        language: "bash",
        code: "dig example.com A +short\ndig example.com MX\ndig example.com NS +short\ndig @1.1.1.1 example.com\ndig +trace example.com\nnslookup example.com\nhost example.com\ngetent hosts localhost",
        walkthrough: [
          "`dig name type` queries a record type; `+short` prints only the answer. `dig name MX` shows mail servers with priorities.",
          "`dig @server name` asks a specific resolver instead of the system's, which helps to see whether a problem is local. `dig +trace name` follows the hierarchy from the root, like the simulation above.",
          "`nslookup` and `host` are simpler alternatives. `getent hosts localhost` uses the system's normal resolution order, including `/etc/hosts`.",
          "The answer section lists the name, the TTL (it counts down while the resolver has it cached), the class `IN`, the record type and the data.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Expecting a DNS change to be visible everywhere at once.",
          fix: "Cached answers live until their TTL expires; lower the TTL before planned changes.",
        },
        {
          mistake:
            "Putting a CNAME at the zone apex or beside other records for the same name.",
          fix: "A CNAME must be the only record for its name; use A/AAAA records or provider alias features at the apex.",
        },
        {
          mistake: "Assuming the problem is the server when it is the name.",
          fix: "Check resolution first: dig the name, then try the IP address directly.",
        },
        {
          mistake: "Hard-coding IP addresses instead of names.",
          fix: "Use names, so the address can change without touching clients.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Moving a website to a new server",
      scenario: "The site's address will change on Saturday.",
      body: [
        "A week before, lower the TTL of the A record from a day to five minutes. On Saturday, change the record to the new address; within about five minutes caches expire and visitors reach the new server. Keep the old server running a while, then raise the TTL again.",
        "Check with `dig +short www.example.com` against several resolvers.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "dns-purpose",
      prompt: "What does DNS do?",
      options: [
        "Maps names to IP addresses and other data",
        "Encrypts web traffic",
        "Assigns IP addresses to devices",
      ],
      answer: 0,
      explanation: "DNS is the Internet's name directory.",
    },
    {
      type: "single",
      id: "ttl-meaning",
      prompt: "What does the TTL of a DNS record control?",
      options: [
        "How long the answer may be cached",
        "How many hops a packet may take",
        "The size of the record",
      ],
      answer: 0,
      explanation: "Resolvers keep the answer until its TTL expires.",
    },
    {
      type: "single",
      id: "mx-record",
      prompt: "Which record type lists the mail servers of a domain?",
      options: ["MX", "A", "CNAME"],
      answer: 0,
      explanation: "MX records name the mail exchangers and their priority.",
    },
    {
      type: "output",
      id: "dns-port-bytes",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "labels = 'example.com'.split('.')\nprint([len(l) for l in labels])",
      },
      options: ["[7, 3]", "[11]", "[2]"],
      answer: 0,
      explanation:
        "In a DNS message each label is preceded by its length byte: 7 for example and 3 for com.",
    },
  ],
  assignment: {
    title: "Trace a lookup",
    task: [
      "Pick a domain name. Describe, step by step, what happens when your browser needs its address, including the caches you pass on the way.",
      "On your computer, run dig (or nslookup) for the A, MX and NS records of a domain you own or of example.com and explain each line of the answer, including the TTL.",
    ],
    checklist: [
      "The hierarchy root, TLD, authoritative is described",
      "Caching at each level is mentioned",
      "Record types A, MX and NS were queried",
      "TTL is explained from real output",
    ],
    hints: ["dig +trace shows the referrals."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "dns-records",
      title: "Which record?",
      task: [
        "Write the record type for: (1) the IPv4 address of a website; (2) the mail servers of a domain; (3) a second name that points to the first; (4) the IPv6 address of a website; (5) the servers that are authoritative for the zone.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.\n4.\n5.",
      solution: "1. A\n2. MX\n3. CNAME\n4. AAAA\n5. NS",
      hints: ["A for IPv4, AAAA for IPv6."],
      checklist: [
        "A and AAAA for addresses",
        "MX for mail",
        "CNAME for an alias",
        "NS for name servers",
      ],
    },
  ],
  revisionNotes: [
    "DNS: a distributed, hierarchical name directory (root, TLD, domain)",
    "Recursive resolver asks root, TLD, authoritative; answers are cached for the TTL",
    "Records: A, AAAA, CNAME, MX, NS, TXT, PTR",
    "DNS usually uses UDP/TCP port 53; tools: dig, nslookup, host",
  ],
  resources: [
    {
      label: "RFC 1034: Domain names - concepts and facilities",
      url: "https://www.rfc-editor.org/rfc/rfc1034.html",
    },
    {
      label: "RFC 1035: Domain names - implementation and specification",
      url: "https://www.rfc-editor.org/rfc/rfc1035.html",
    },
    {
      label: "MDN: What is a domain name?",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name",
    },
    {
      label: "MDN: DNS",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/DNS",
    },
  ],
})
