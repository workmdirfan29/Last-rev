import { defineLesson } from "@/data/lessons/author"

export default defineLesson("networking", {
  slug: "ip-addressing-and-subnets",
  title: "IP addressing and subnets",
  topic: "IP addressing & subnets",
  minutes: 75,
  overview:
    "Read IPv4 addresses and prefixes, calculate network, broadcast and host ranges, split a network into subnets, recognise private and special addresses, and see how IPv6 differs.",
  objectives: [
    "Explain an IPv4 address, a prefix length and a subnet mask",
    "Calculate network address, broadcast address and usable hosts",
    "Split a network into equal subnets",
    "Recognise private, loopback and link-local ranges and NAT",
    "Read and compress an IPv6 address",
  ],
  prerequisites: ["lesson.networking.layers-and-encapsulation"],
  sections: [
    {
      kind: "explain",
      heading: "IPv4 addresses",
      body: [
        "An **IPv4 address** is a 32-bit number, written as four decimal numbers from 0 to 255 separated by dots (`192.168.10.77`), one for each byte. Every interface that talks on an IP network needs an address.",
        "An address has two parts: a **network part** (which network) and a **host part** (which device in it). The **prefix length** tells where the split is. `192.168.10.0/24` means the first 24 bits are the network and the last 8 bits are the host. The same split can be written as a **subnet mask**: `/24` is `255.255.255.0` (24 ones followed by 8 zeros). This notation is **CIDR** (RFC 4632); the old fixed classes A, B and C are no longer used.",
      ],
    },
    {
      kind: "code",
      heading: "Network, broadcast and hosts",
      example: {
        title: "Calculate with the ipaddress module",
        language: "python",
        code: 'import ipaddress\n\nnet = ipaddress.ip_network("192.168.10.0/24")\nprint("network:", net.network_address)\nprint("mask:", net.netmask)\nprint("broadcast:", net.broadcast_address)\nprint("addresses:", net.num_addresses, "usable hosts:", net.num_addresses - 2)\n\nhost = ipaddress.ip_interface("192.168.10.77/26")\nsubnet = host.network\nhosts = list(subnet.hosts())\nprint("host", host.ip, "is in", subnet)\nprint("first host:", hosts[0], "last host:", hosts[-1], "broadcast:", subnet.broadcast_address)\nprint("usable hosts:", len(hosts))\nprint("same network as .100?", ipaddress.ip_address("192.168.10.100") in subnet)',
        walkthrough: [
          "For `/24` there are 8 host bits, so `2 ** 8 = 256` addresses. The first (`192.168.10.0`) is the **network address** and the last (`192.168.10.255`) is the **broadcast address**; neither is given to a device, so there are `256 - 2 = 254` usable hosts.",
          "For `192.168.10.77/26` the prefix is longer: 6 host bits, so each subnet has 64 addresses. The host falls in `192.168.10.64/26`, which covers `.64` to `.127`: first host `.65`, last host `.126`, broadcast `.127`, and `62` usable hosts.",
          "`.100` is also between `.64` and `.127`, so it is on the same subnet; two devices can talk directly only when they are on the same subnet (otherwise they go through a router).",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Prefix length and size",
      diagram: {
        kind: "table",
        title: "Common prefixes",
        headers: ["Prefix", "Mask", "Addresses", "Usable hosts"],
        rows: [
          ["/8", "255.0.0.0", "16,777,216", "16,777,214"],
          ["/16", "255.255.0.0", "65,536", "65,534"],
          ["/24", "255.255.255.0", "256", "254"],
          ["/26", "255.255.255.192", "64", "62"],
          ["/30", "255.255.255.252", "4", "2"],
          ["/32", "255.255.255.255", "1", "a single host"],
        ],
      },
    },
    {
      kind: "code",
      heading: "Subnetting",
      example: {
        title: "Split one network into four",
        language: "python",
        code: 'import ipaddress\n\nnet = ipaddress.ip_network("192.168.10.0/24")\nfor sub in net.subnets(new_prefix=26):\n    first, last = list(sub.hosts())[0], list(sub.hosts())[-1]\n    print(sub, "hosts", first, "-", last)\n\n# how many bits do we borrow to get at least 6 subnets?\nneeded = 6\nbits = (needed - 1).bit_length()\nprint("borrow", bits, "bits ->", 2 ** bits, "subnets of /" + str(24 + bits))',
        walkthrough: [
          "Moving the boundary from `/24` to `/26` **borrows** 2 host bits for the network part, giving `2 ** 2 = 4` subnets of 64 addresses each: `.0/26`, `.64/26`, `.128/26` and `.192/26`.",
          "Each subnet loses two addresses (network and broadcast), so each has 62 usable hosts.",
          "To get at least 6 subnets you need 3 borrowed bits (2 bits give only 4), which produces 8 subnets of `/27`, each with 30 usable hosts. Subnetting trades the number of subnets against the number of hosts per subnet.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Special and private addresses",
      example: {
        title: "Which addresses are routable on the Internet?",
        language: "python",
        code: 'import ipaddress\n\nfor text in ["10.1.2.3", "172.16.0.1", "172.32.0.1", "192.168.1.1", "127.0.0.1", "169.254.1.1", "8.8.8.8"]:\n    ip = ipaddress.ip_address(text)\n    kind = "loopback" if ip.is_loopback else "link-local" if ip.is_link_local else "private" if ip.is_private else "public"\n    print(f"{text:12} {kind}")',
        walkthrough: [
          "**Private** ranges (RFC 1918) are used inside homes and companies and are not routed on the public Internet: `10.0.0.0/8`, `172.16.0.0/12` (that is `172.16.0.0` to `172.31.255.255`) and `192.168.0.0/16`. So `172.32.0.1` is outside the private block.",
          "`127.0.0.0/8` is **loopback** (the machine itself, usually `127.0.0.1`, name `localhost`). `169.254.0.0/16` is **link-local**: a device uses it when it cannot get an address from a DHCP server.",
          "Devices with private addresses reach the Internet through **NAT** (network address translation): the router rewrites the source address to its own public address and keeps a table to send replies back to the right device. DHCP hands out addresses automatically.",
        ],
      },
    },
    {
      kind: "code",
      heading: "IPv6",
      example: {
        title: "128-bit addresses",
        language: "python",
        code: 'import ipaddress\n\nip = ipaddress.ip_address("2001:0db8:0000:0000:0000:0000:0000:0001")\nprint(ip.compressed)\nprint(ip.exploded)\nnet = ipaddress.ip_network("2001:db8::/32")\nprint(net.num_addresses == 2 ** 96, ipaddress.ip_address("::1").is_loopback)\nprint(ipaddress.ip_address("fe80::1").is_link_local)',
        walkthrough: [
          "An **IPv6** address has 128 bits, written as eight groups of four hexadecimal digits separated by colons. Leading zeros in a group may be dropped and **one** run of all-zero groups may be replaced by `::`, so the long form becomes `2001:db8::1`.",
          "`::1` is the IPv6 loopback address and `fe80::/10` is link-local. A typical subnet is a `/64`, and the huge address space (`2 ** 128`) removes the need for NAT.",
          "IPv6 (RFC 8200) is used alongside IPv4 on many networks, so many hosts have both.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Treating the first and last address of a subnet as usable hosts.",
          fix: "They are the network and broadcast addresses (except on special /31 and /32 uses).",
        },
        {
          mistake: "Putting two devices of one subnet on different masks.",
          fix: "Use the same mask on all hosts of a subnet.",
        },
        {
          mistake: "Using overlapping subnets.",
          fix: "Plan the address space so ranges do not overlap.",
        },
        {
          mistake: "Thinking a private address is reachable from the Internet.",
          fix: "Private addresses need NAT or a VPN to be reached.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Planning the office network",
      scenario:
        "A company has 4 departments of up to 25 devices each and the block 192.168.10.0/24.",
      body: [
        "Each department needs at least 25 + 2 addresses, so a `/27` (32 addresses, 30 hosts) fits. Four `/27` subnets use 128 addresses, leaving the upper half free for growth: `192.168.10.0/27`, `.32/27`, `.64/27` and `.96/27`.",
        "Document the plan, reserve the first usable address of each subnet for the router (the default gateway) and keep spare ranges.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "slash24-hosts",
      prompt: "How many usable host addresses does a /24 network have?",
      options: ["254", "256", "24"],
      answer: 0,
      explanation: "256 addresses minus the network and broadcast addresses.",
    },
    {
      type: "output",
      id: "mask-prefix",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "import ipaddress\nprint(ipaddress.ip_network('10.0.0.0/26').num_addresses)",
      },
      options: ["64", "26", "62"],
      answer: 0,
      explanation: "A /26 leaves 6 host bits: 2 ** 6 = 64 addresses.",
    },
    {
      type: "output",
      id: "private-check",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "import ipaddress\nprint(ipaddress.ip_address('172.32.0.1').is_private)",
      },
      options: ["False", "True", "None"],
      answer: 0,
      explanation: "The private block 172.16.0.0/12 ends at 172.31.255.255.",
    },
    {
      type: "single",
      id: "nat-purpose",
      prompt: "What does NAT let devices with private addresses do?",
      options: [
        "Reach the Internet through a shared public address",
        "Get faster speeds",
        "Encrypt their traffic",
      ],
      answer: 0,
      explanation:
        "NAT rewrites addresses at the router so private hosts can use one public address.",
    },
  ],
  assignment: {
    title: "Subnet plan",
    task: [
      "Take 10.20.0.0/16 and design subnets for four sites needing 500, 200, 100 and 50 hosts. For each, give the prefix, network address, first and last host and broadcast.",
      "Verify your answers with Python's ipaddress module and write one sentence about what is left over.",
    ],
    checklist: [
      "Each subnet has enough hosts",
      "Subnets do not overlap",
      "Network, broadcast and host range are listed",
      "The results were checked in code",
    ],
    hints: [
      "Find the smallest prefix whose usable hosts cover the requirement.",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "usable-hosts",
      title: "Usable hosts",
      task: [
        "Write usableHosts(prefix) for an IPv4 subnet with that prefix length (30 or less): the number of host addresses without the network and broadcast addresses.",
      ],
      language: "javascript",
      starter: "function usableHosts(prefix) {\n}",
      solution:
        "function usableHosts(prefix) {\n  return 2 ** (32 - prefix) - 2\n}",
      hints: ["There are 32 - prefix host bits."],
      checklist: [
        "Uses 2 to the power of the host bits",
        "Subtracts the network and broadcast addresses",
      ],
      run: {
        entry: "usableHosts",
        cases: [
          {
            name: "/24",
            args: [24],
            expected: 254,
          },
          {
            name: "/26",
            args: [26],
            expected: 62,
          },
          {
            name: "/30",
            args: [30],
            expected: 2,
          },
          {
            name: "/16",
            args: [16],
            expected: 65534,
          },
        ],
      },
    },
    {
      slug: "ip-to-int",
      title: "IP to number",
      task: [
        "Write ipToInt(ip) that converts a dotted IPv4 address string into its 32-bit unsigned integer value.",
      ],
      language: "javascript",
      starter: "function ipToInt(ip) {\n}",
      solution:
        'function ipToInt(ip) {\n  return ip.split(".").reduce((acc, part) => acc * 256 + Number(part), 0)\n}',
      hints: ["Each part is a base-256 digit."],
      checklist: ["Handles all four parts", "Result is not negative"],
      run: {
        entry: "ipToInt",
        cases: [
          {
            name: "zero",
            args: ["0.0.0.0"],
            expected: 0,
          },
          {
            name: "one",
            args: ["0.0.0.1"],
            expected: 1,
          },
          {
            name: "private",
            args: ["192.168.1.1"],
            expected: 3232235777,
          },
          {
            name: "max",
            args: ["255.255.255.255"],
            expected: 4294967295,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "IPv4: 32 bits, dotted decimal; prefix length /n = n network bits; mask 255.255.255.0 = /24",
    "Usable hosts = 2^(32-n) - 2; network and broadcast addresses are reserved",
    "Private: 10/8, 172.16/12, 192.168/16; loopback 127/8; link-local 169.254/16; NAT",
    "IPv6: 128 bits, hex groups, :: compresses one run of zeros",
  ],
  resources: [
    {
      label: "RFC 4632: Classless Inter-domain Routing (CIDR)",
      url: "https://www.rfc-editor.org/rfc/rfc4632.html",
    },
    {
      label: "RFC 1918: Address allocation for private internets",
      url: "https://www.rfc-editor.org/rfc/rfc1918.html",
    },
    {
      label: "RFC 8200: Internet Protocol, Version 6 (IPv6) specification",
      url: "https://www.rfc-editor.org/rfc/rfc8200.html",
    },
    {
      label: "Python: ipaddress library",
      url: "https://docs.python.org/3/library/ipaddress.html",
    },
  ],
})
