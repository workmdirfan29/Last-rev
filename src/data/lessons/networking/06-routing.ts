import { defineLesson } from "@/data/lessons/author"

export default defineLesson("networking", {
  slug: "routing",
  title: "Routing and forwarding",
  topic: "Routing",
  minutes: 60,
  overview:
    "Understand how routers move packets between networks: routing tables, the default gateway, longest-prefix match, TTL and traceroute, static versus dynamic routing, and NAT.",
  objectives: [
    "Explain what a router does and what a routing table holds",
    "Apply longest-prefix match to choose a route",
    "Describe the default gateway and next hop",
    "Explain how traceroute uses TTL",
    "Compare static and dynamic routing",
  ],
  prerequisites: ["lesson.networking.ip-addressing-and-subnets"],
  sections: [
    {
      kind: "explain",
      heading: "Forwarding between networks",
      body: [
        "Devices on the same subnet talk directly. To reach a different network a host sends the packet to its **default gateway**, a router on its own subnet. A **router** has an interface in each network it connects. For every packet it looks at the destination address, consults its **routing table** and forwards the packet to the **next hop**: another router or the final destination. Each router makes its own decision, hop by hop; no router knows the whole path.",
        "A **routing table** entry contains a destination network (a prefix), the next hop or outgoing interface and often a metric (cost). When several entries match, the router uses the **most specific** one: the entry with the **longest prefix**. A **default route** (`0.0.0.0/0`) matches everything and is used when nothing else does.",
      ],
    },
    {
      kind: "code",
      heading: "Longest-prefix match",
      example: {
        title: "Choosing a route",
        language: "python",
        code: 'import ipaddress\n\nROUTES = [\n    ("10.0.0.0/8", "via 192.168.1.2"),\n    ("10.1.0.0/16", "via 192.168.1.3"),\n    ("10.1.2.0/24", "via 192.168.1.4"),\n    ("0.0.0.0/0", "default via 192.168.1.1"),\n]\n\ndef lookup(destination):\n    ip = ipaddress.ip_address(destination)\n    matches = [(ipaddress.ip_network(prefix), hop) for prefix, hop in ROUTES if ip in ipaddress.ip_network(prefix)]\n    network, hop = max(matches, key=lambda m: m[0].prefixlen)\n    return f"{destination:11} -> {hop:24} (matched {network})"\n\nfor dest in ["10.1.2.3", "10.1.9.9", "10.200.0.1", "8.8.8.8"]:\n    print(lookup(dest))',
        walkthrough: [
          "`10.1.2.3` matches three routes (`/8`, `/16` and `/24`) and the default. The router picks the **longest prefix**, `/24`, because it is the most specific: the next hop is `192.168.1.4`.",
          "`10.1.9.9` matches `/16` and `/8`, so the `/16` route wins. `10.200.0.1` matches only the `/8` route. `8.8.8.8` matches nothing except the default route, so it goes to the default gateway.",
          "Specific routes override general ones. This is how an organisation can send most traffic out through one link, but a particular subnet through another.",
        ],
      },
    },
    {
      kind: "code",
      heading: "TTL and traceroute",
      example: {
        title: "How a path is discovered",
        language: "python",
        code: 'PATH = ["router A", "router B", "router C", "server"]\n\ndef send(ttl):\n    for hop in PATH[:-1]:\n        ttl -= 1\n        if ttl == 0:\n            return f"{hop} replies: time exceeded"\n    return "server replies: reached"\n\nfor ttl in range(1, 5):\n    print("ttl", ttl, "->", send(ttl))',
        walkthrough: [
          "Every router subtracts 1 from the packet's **TTL**; when it reaches zero the router discards the packet and sends back an ICMP *time exceeded* message. This also stops packets looping for ever.",
          "`traceroute` (or `tracepath` on Linux) uses this on purpose. It sends packets with TTL 1, 2, 3 and so on. The first router replies to TTL 1, the second to TTL 2, and so on, until the destination answers. The list of replying addresses is the path.",
          "In the simulation a packet with TTL 4 survives the three routers and reaches the server.",
          "On a real machine `ping -c 3 host` checks reachability and round-trip time, and `ip route` shows the routing table: lines such as `default via 192.168.0.1 dev wlan0` (the default gateway) and `192.168.0.0/24 dev wlan0 scope link` (the directly connected subnet). `ip route get 8.8.8.8` shows which route would be used.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Static or dynamic?",
      diagram: {
        kind: "table",
        title: "How routes get into the table",
        headers: ["Kind", "How", "Typical use"],
        rows: [
          [
            "Directly connected",
            "Created automatically for each configured interface",
            "Every device",
          ],
          [
            "Static route",
            "Configured by an administrator",
            "Small networks, default routes",
          ],
          [
            "Dynamic routing",
            "Routers exchange route information with a routing protocol (for example OSPF inside an organisation, BGP between organisations)",
            "Large and changing networks, the Internet",
          ],
        ],
      },
    },
    {
      kind: "explain",
      heading: "NAT and the Internet's routing",
      body: [
        "Between your home network and the Internet, your router performs **NAT**: it replaces the private source address with its public one and remembers the mapping, so replies find their way back. Between organisations, routers exchange reachability using **BGP**, which keeps the Internet's global routing table. Routing decisions can change at any time, so two packets of the same connection may take different paths; TCP reorders them at the receiver.",
        "Problems often show up as 'no route to host' (no matching route and no default), timeouts (a router drops the packet or the return path is broken), or looping packets that end with TTL exceeded.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Setting the wrong default gateway or none at all.",
          fix: "The gateway must be an address on your own subnet; without it, only local traffic works.",
        },
        {
          mistake: "Forgetting the return route.",
          fix: "Packets need a route back as well; one-way routing causes timeouts.",
        },
        {
          mistake: "Assuming the path is fixed.",
          fix: "Routes and paths change; do not depend on a particular hop.",
        },
        {
          mistake: "Overlapping subnets on different interfaces.",
          fix: "That makes the routing choice ambiguous; plan unique ranges.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Debugging 'I can ping the router but not the Internet'",
      scenario: "A laptop reaches its local gateway but no website opens.",
      body: [
        "Check `ip route`: is there a default route? Ping the gateway, then an address beyond it (for example the ISP's or a public address), then a name. If the address works but the name does not, DNS is the problem; if the address fails, look at the gateway's own uplink or at the routing beyond it with `tracepath`.",
        "Work outward one hop at a time.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "lpm",
      prompt:
        "A router has routes for 10.0.0.0/8 and 10.1.0.0/16. Which one carries a packet for 10.1.5.5?",
      options: ["10.1.0.0/16", "10.0.0.0/8", "Neither"],
      answer: 0,
      explanation: "The longest prefix (most specific route) wins.",
    },
    {
      type: "single",
      id: "default-gw",
      prompt: "What is the default gateway?",
      options: [
        "The router a host uses for destinations outside its own subnet",
        "The DNS server",
        "The first host on the subnet",
      ],
      answer: 0,
      explanation: "Hosts send non-local traffic to the default gateway.",
    },
    {
      type: "single",
      id: "ttl-zero",
      prompt: "What happens when a packet's TTL reaches zero?",
      options: [
        "The router drops it and sends back a time-exceeded message",
        "It is delivered immediately",
        "It is encrypted",
      ],
      answer: 0,
      explanation: "This prevents loops and makes traceroute possible.",
    },
    {
      type: "output",
      id: "route-pick",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "import ipaddress\nprint(max([n for n in ['10.0.0.0/8', '10.1.0.0/16'] if ipaddress.ip_address('10.1.5.5') in ipaddress.ip_network(n)], key=lambda n: ipaddress.ip_network(n).prefixlen))",
      },
      options: ["10.1.0.0/16", "10.0.0.0/8", "0.0.0.0/0"],
      answer: 0,
      explanation: "Both match, and /16 is longer than /8.",
    },
  ],
  assignment: {
    title: "Read a routing table",
    task: [
      "Run ip route on your machine, identify the default route, the directly connected subnet and any extra routes, and say which route a packet to 8.8.8.8 and to your own subnet would use (check with ip route get).",
      "Draw a network with three subnets and two routers, write each router's routing table and trace a packet from a host in the first to a host in the third, showing TTL at each hop.",
    ],
    checklist: [
      "The default route and local subnet were identified",
      "ip route get confirmed the choice",
      "The routing tables use longest-prefix match correctly",
      "TTL was decreased at each hop",
    ],
    hints: ["Use documentation ranges such as 192.0.2.0/24 for the drawing."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "pick-route",
      title: "Pick the next hop",
      task: [
        "Write the matching route (prefix) from this table for each destination: routes are 10.0.0.0/8, 10.1.0.0/16, 0.0.0.0/0. Destinations: (1) 10.1.4.4; (2) 10.9.9.9; (3) 172.20.1.1.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.",
      solution: "1. 10.1.0.0/16\n2. 10.0.0.0/8\n3. 0.0.0.0/0",
      hints: ["Longest matching prefix wins."],
      checklist: [
        "The /16 beats the /8 for 10.1.x.x",
        "The default route catches the rest",
      ],
    },
  ],
  revisionNotes: [
    "Router forwards by destination using its routing table, hop by hop",
    "Longest-prefix match; default route 0.0.0.0/0; default gateway",
    "TTL decremented per hop; traceroute uses TTL; ip route, ping, tracepath",
    "Static versus dynamic routing; NAT at the edge",
  ],
  resources: [
    {
      label: "RFC 1812: Requirements for IP version 4 routers",
      url: "https://www.rfc-editor.org/rfc/rfc1812.html",
    },
    {
      label: "RFC 3022: Traditional IP Network Address Translator",
      url: "https://www.rfc-editor.org/rfc/rfc3022.html",
    },
    {
      label: "ip(8) manual page",
      url: "https://man7.org/linux/man-pages/man8/ip.8.html",
    },
    {
      label: "MDN: Router",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/Router",
    },
  ],
})
