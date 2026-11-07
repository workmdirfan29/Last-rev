import { defineLesson } from "@/data/lessons/author"

export default defineLesson("networking", {
  slug: "internet-fundamentals",
  title: "How the Internet fits together",
  topic: "Internet fundamentals",
  minutes: 45,
  overview:
    "See the big picture: networks of networks, packets, ISPs and exchange points, CDNs, what happens when you open a web page, and why latency and bandwidth are different things.",
  objectives: [
    "Describe the Internet as a network of networks that share common protocols",
    "List the steps from typing a URL to seeing a page",
    "Explain latency, bandwidth and round trips with numbers",
    "Explain what a CDN and an ISP do",
    "Break a URL into its parts",
  ],
  prerequisites: ["lesson.networking.routing", "lesson.networking.dns"],
  sections: [
    {
      kind: "explain",
      heading: "A network of networks",
      body: [
        "The **Internet** is not one network. It is a very large number of independent networks (home and company networks, universities, access providers, data centres) that agree to use the same protocols, mainly **IP**, **TCP/UDP** and **DNS**, and to exchange traffic with one another. Nobody owns the whole: each network operator manages its own part and connects to others.",
        "Data travels as **packets**. A message is cut into small packets, each carries the destination address and each is forwarded independently by routers (**packet switching**), possibly along different paths, then reassembled at the destination. This makes the network resilient and lets many users share the same links.",
      ],
    },
    {
      kind: "explain",
      heading: "Who is who",
      body: [
        "An **Internet service provider (ISP)** connects homes and companies to the Internet. ISPs connect to each other directly or at **Internet exchange points (IXPs)**, places where many networks meet and swap traffic. Large providers and content companies run **data centres** that hold servers. A **content delivery network (CDN)** is a network of servers placed in many locations that keep copies of popular content close to users, which reduces latency and load on the original server.",
        "Clients (browsers, phones, apps) send requests to servers in the **client-server model**; in **peer-to-peer** systems devices exchange data directly with each other.",
      ],
    },
    {
      kind: "diagram",
      heading: "Opening https://www.example.com/index.html",
      diagram: {
        kind: "flow",
        title: "What happens in order",
        steps: [
          {
            label: "1. Parse the URL",
            detail:
              "The browser splits it into scheme (https), host (www.example.com), port (default 443) and path",
          },
          {
            label: "2. DNS",
            detail:
              "The host name is resolved to an IP address (from a cache or through the resolver)",
          },
          {
            label: "3. TCP",
            detail:
              "A connection to the server's address and port 443 is opened with the three-way handshake",
          },
          {
            label: "4. TLS",
            detail:
              "The browser and server agree on keys and the server proves its identity with a certificate",
          },
          {
            label: "5. HTTP",
            detail:
              "The browser sends the request over the secure connection and receives the response",
          },
          {
            label: "6. Render",
            detail:
              "The browser parses the HTML and fetches more files (styles, scripts, images), repeating the process, often reusing the connection",
          },
        ],
      },
    },
    {
      kind: "code",
      heading: "Anatomy of a URL",
      example: {
        title: "urllib.parse",
        language: "python",
        code: 'from urllib.parse import urlsplit\n\nurl = urlsplit("https://www.example.com:8443/docs/guide.html?lang=en&page=2#intro")\nprint("scheme:", url.scheme)\nprint("host:", url.hostname)\nprint("port:", url.port)\nprint("path:", url.path)\nprint("query:", url.query)\nprint("fragment:", url.fragment)',
        walkthrough: [
          "The **scheme** (`https`) selects the protocol and default port. The **host** is looked up in DNS. An explicit **port** (`8443`) overrides the default.",
          "The **path** names the resource on the server and the **query** (`lang=en&page=2`) carries parameters. The **fragment** (`intro`) is used only by the browser to scroll to a part of the page and is never sent to the server.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Latency and bandwidth",
      example: {
        title: "Why small requests feel slow",
        language: "python",
        code: 'def transfer_time(size_mb, bandwidth_mbps, rtt_ms, round_trips=1):\n    """Seconds = waiting for round trips + time to push the bits through the link."""\n    return round_trips * rtt_ms / 1000 + size_mb * 8 / bandwidth_mbps\n\nprint("one 10 MB file, 100 Mbit/s, 50 ms RTT:", round(transfer_time(10, 100, 50), 3), "s")\nprint("same file, 1000 Mbit/s:", round(transfer_time(10, 1000, 50), 3), "s")\nprint("20 tiny requests, one after another:", round(transfer_time(0.01, 100, 50, round_trips=20), 3), "s")\nprint("20 tiny requests, same link, 10 ms RTT:", round(transfer_time(0.01, 100, 10, round_trips=20), 3), "s")',
        walkthrough: [
          "**Bandwidth** is how many bits per second a link can carry. **Latency** is how long a bit takes to travel; the **round-trip time (RTT)** is the time for a message to go there and back. They are different: bandwidth is the width of a pipe, latency is its length.",
          "For a large download the bandwidth term dominates: 10 MB is 80 megabits, which takes `0.8` s at 100 Mbit/s, plus `0.05` s for one round trip, `0.85` s in total. A ten times faster link brings it down to `0.13` s, not to a tenth, because the round trip does not shrink.",
          "For many small requests the latency dominates: 20 sequential round trips of 50 ms cost a full second, however fast the link. With a 10 ms RTT (a nearby server, which is what a CDN provides) the same work takes about `0.2` s. This is why web pages reduce the number of round trips, reuse connections and place content near users.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Seeing the connection",
      example: {
        title: "curl -w shows what it connected to",
        language: "bash",
        code: 'curl -s -o /dev/null -w "%{remote_ip} %{remote_port} %{http_version}\\n" http://localhost:8000/openapi.json\ncurl -s -o /dev/null -w "%{http_code} %{content_type}\\n" http://localhost:8000/openapi.json',
        walkthrough: [
          "`curl -w` prints details of the transfer after it finishes. For a request to `localhost:8000` it reports that the connection went to remote IP `127.0.0.1`, port `8000`, using HTTP version `1.1`.",
          "Against a real site you can also print `%{time_namelookup}` (DNS), `%{time_connect}` (TCP), `%{time_appconnect}` (TLS) and `%{time_starttransfer}` (first byte). Together they show the stages of the previous diagram with real numbers for your connection.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Thinking the Internet is one big network owned by someone.",
          fix: "It is many independent networks that choose to interconnect.",
        },
        {
          mistake: "Confusing bandwidth with latency.",
          fix: "A fatter pipe does not make it shorter; round trips still cost time.",
        },
        {
          mistake: "Believing the web is the Internet.",
          fix: "The web (HTTP) is one application among many, like email, DNS and video calls.",
        },
        {
          mistake: "Assuming packets always take the same path.",
          fix: "Routes change; the protocols handle reordering and loss.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Why the page loads slowly for distant users",
      scenario:
        "Users on another continent complain that the site is slow, although your servers are fast.",
      body: [
        "Round trips and distance are the cause. Put static files on a CDN so they come from a nearby location, enable connection reuse and HTTP/2 or HTTP/3 to avoid repeated handshakes, compress responses and reduce the number of requests.",
        "Measure with the browser's network tab: look at DNS, connection and time to first byte for each request.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "net-of-nets",
      prompt: "Which statement describes the Internet best?",
      options: [
        "Many independent networks using common protocols",
        "One network owned by a single company",
        "The World Wide Web",
      ],
      answer: 0,
      explanation: "The Internet interconnects independent networks.",
    },
    {
      type: "single",
      id: "cdn-purpose",
      prompt: "What is the main benefit of a CDN?",
      options: [
        "Content served from servers close to users, reducing latency",
        "Stronger passwords",
        "More IP addresses",
      ],
      answer: 0,
      explanation: "A CDN caches content near users.",
    },
    {
      type: "single",
      id: "order-steps",
      prompt: "Which order is correct when a browser opens an HTTPS page?",
      options: [
        "DNS, TCP, TLS, HTTP",
        "TLS, DNS, HTTP, TCP",
        "HTTP, DNS, TCP, TLS",
      ],
      answer: 0,
      explanation:
        "The name must be resolved, then a connection opened and secured, then the request sent.",
    },
    {
      type: "output",
      id: "transfer-math",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "print(10 * 8 / 100)",
      },
      options: ["0.8", "80.0", "8.0"],
      answer: 0,
      explanation:
        "10 megabytes are 80 megabits; at 100 Mbit/s that takes 0.8 seconds.",
    },
  ],
  assignment: {
    title: "Anatomy of a page load",
    task: [
      "Open your browser's developer tools (Network tab) on any website. For one request, record the DNS, connection, TLS and first-byte times, and match them to the steps in the diagram.",
      "Explain, using the latency formula, why 30 small requests in a row are slower than one request of the same total size.",
    ],
    checklist: [
      "The timing stages were recorded for a real request",
      "Each stage is matched to a protocol step",
      "Latency versus bandwidth is explained with numbers",
      "A CDN's role is described",
    ],
    hints: ["The Network tab's Timing view lists the stages."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "transfer-fn",
      title: "Transfer time",
      task: [
        "Write transferTime(sizeMb, mbps, rttMs) that returns the time in seconds to fetch a file in one round trip: rttMs / 1000 plus sizeMb * 8 / mbps, rounded to 3 decimals.",
      ],
      language: "javascript",
      starter: "function transferTime(sizeMb, mbps, rttMs) {\n}",
      solution:
        "function transferTime(sizeMb, mbps, rttMs) {\n  const seconds = rttMs / 1000 + (sizeMb * 8) / mbps\n  return Math.round(seconds * 1000) / 1000\n}",
      hints: [
        "Megabytes times 8 gives megabits. Round with Math.round(x * 1000) / 1000.",
      ],
      checklist: [
        "Converts megabytes to megabits",
        "Adds one round trip in seconds",
        "Rounds to 3 decimals",
      ],
      run: {
        entry: "transferTime",
        cases: [
          {
            name: "10 MB at 100",
            args: [10, 100, 50],
            expected: 0.85,
          },
          {
            name: "10 MB at 1000",
            args: [10, 1000, 50],
            expected: 0.13,
          },
          {
            name: "zero size",
            args: [0, 100, 20],
            expected: 0.02,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "The Internet is many networks sharing protocols (IP, TCP/UDP, DNS)",
    "Packet switching; ISPs, IXPs, data centres, CDNs; client-server and peer-to-peer",
    "URL -> DNS -> TCP -> TLS -> HTTP -> render",
    "Latency (round trips) versus bandwidth (capacity); CDNs reduce distance",
  ],
  resources: [
    {
      label: "MDN: How does the Internet work?",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work",
    },
    {
      label: "MDN: What is a URL?",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL",
    },
    {
      label: "MDN: CDN",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/CDN",
    },
    {
      label: "MDN: Latency",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/Latency",
    },
  ],
})
