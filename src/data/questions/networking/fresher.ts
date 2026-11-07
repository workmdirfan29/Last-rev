import { defineQuestions } from "../author"
import { q } from "../compact"

const RFC = "https://www.rfc-editor.org/rfc"
const MAN = "https://man7.org/linux/man-pages"
const MDN = "https://developer.mozilla.org/en-US/docs/Glossary"

export default defineQuestions("networking", "fresher", [
  q({
    slug: "tcp-ip-layers-model",
    topic: "TCP/IP",
    d: "easy",
    title: "What are the layers of the TCP/IP model?",
    kw: [
      "tcp/ip model",
      "layers",
      "application layer",
      "transport layer",
      "internet layer",
    ],
    intent: "A foundation question: checks you can place protocols in layers.",
    short:
      "The TCP/IP model organises networking into four layers. The link layer moves frames across one physical network, for example Ethernet or Wi-Fi. The internet layer (IP) addresses packets and routes them between networks. The transport layer (TCP or UDP) delivers data between applications on hosts, using port numbers, with or without reliability. The application layer holds the protocols applications use, such as HTTP, DNS and SSH. Each layer uses the one below it and hides its details, which lets protocols evolve independently.",
    detail: [
      "The OSI model splits the same ideas into seven layers and is often used as a teaching vocabulary.",
      "Data gains a header at each layer on the way down (encapsulation) and loses it on the way up.",
      "A problem can be isolated by finding the layer where it occurs.",
    ],
    ex: "An HTTP request is carried in a TCP segment, inside an IP packet, inside an Ethernet frame.",
    mistakes: [
      "Mixing up layers, for example calling TCP an application protocol.",
      "Assuming one layer's guarantees apply to another.",
    ],
    follow: ["Which layer uses port numbers?"],
    points: [
      "Link, internet, transport, application",
      "IP routes, TCP/UDP deliver to applications",
      "Encapsulation adds headers",
      "Layers hide details",
    ],
    notes: ["Frame in packet in segment."],
    src: [
      ["RFC 1122: Requirements for Internet Hosts", `${RFC}/rfc1122`],
      ["MDN: Protocol", `${MDN}/Protocol`],
    ],
  }),
  q({
    slug: "tcp-three-way-handshake",
    topic: "TCP/IP",
    d: "easy",
    title: "How does the TCP three-way handshake work?",
    kw: [
      "three-way handshake",
      "syn",
      "syn-ack",
      "ack",
      "connection establishment",
    ],
    intent: "A staple networking question.",
    short:
      "TCP is connection-oriented, so before sending data the two ends establish a connection with a three-way handshake. The client sends a SYN segment with its initial sequence number, the server replies with a SYN-ACK that acknowledges it and carries its own initial sequence number, and the client answers with an ACK. After that both sides can send data. The exchange synchronises sequence numbers and confirms both ends can send and receive. Closing a connection uses FIN segments, and a RST abruptly resets it.",
    detail: [
      "The handshake costs one round trip before data, which is why connection reuse matters for latency.",
      "A flood of SYNs without ACKs is a SYN flood attack; servers use mitigations like SYN cookies.",
      "TLS adds its own handshake on top of TCP.",
    ],
    ex: "Before an HTTPS request, the browser completes a TCP handshake and then a TLS handshake with the server.",
    mistakes: [
      "Forgetting that connection setup adds latency.",
      "Confusing FIN (graceful close) with RST (abort).",
    ],
    follow: ["What does SYN stand for?"],
    points: [
      "SYN, SYN-ACK, ACK",
      "Synchronises sequence numbers",
      "One round trip before data",
      "FIN closes, RST aborts",
    ],
    notes: ["SYN, SYN-ACK, ACK."],
    src: [
      ["RFC 9293: Transmission Control Protocol", `${RFC}/rfc9293`],
      ["MDN: TCP handshake", `${MDN}/TCP_handshake`],
    ],
  }),
  q({
    slug: "tcp-vs-udp",
    topic: "TCP/IP",
    d: "easy",
    title: "What is the difference between TCP and UDP?",
    kw: ["tcp", "udp", "reliable", "connectionless", "transport protocol"],
    intent: "One of the most common networking questions.",
    short:
      "TCP provides a reliable, ordered byte stream: it sets up a connection, numbers the data, acknowledges it, retransmits lost segments, and controls flow and congestion. UDP is a simple connectionless protocol that sends independent datagrams with minimal overhead and no guarantee of delivery, order or duplicate protection. Use TCP when correctness matters, such as web pages, email and file transfer, and UDP where speed and low latency matter more than occasional loss, such as DNS queries, voice, video and games. QUIC builds reliable streams on top of UDP.",
    detail: [
      "UDP's header is only 8 bytes.",
      "With UDP the application must handle loss, ordering and retries if it needs them.",
      "TCP's reliability can add delay when packets are lost (head-of-line blocking).",
    ],
    ex: "A DNS lookup uses a single UDP request and response, while downloading a file uses TCP.",
    mistakes: [
      "Assuming UDP is always faster in practice.",
      "Expecting TCP to preserve message boundaries.",
    ],
    follow: ["Name an application that uses UDP."],
    points: [
      "TCP: reliable ordered stream",
      "UDP: connectionless datagrams",
      "TCP has retransmission and congestion control",
      "UDP suits low latency, loss-tolerant uses",
    ],
    notes: ["Reliable stream versus fast datagrams."],
    src: [
      ["RFC 9293: TCP", `${RFC}/rfc9293`],
      ["RFC 768: User Datagram Protocol", `${RFC}/rfc768`],
      ["MDN: UDP", `${MDN}/UDP`],
    ],
  }),
  q({
    slug: "tcp-reliability-flow-congestion",
    topic: "TCP/IP",
    d: "medium",
    title:
      "How does TCP achieve reliability, flow control and congestion control?",
    kw: [
      "sequence numbers",
      "retransmission",
      "window size",
      "congestion control",
      "slow start",
    ],
    intent: "Checks you understand why TCP behaves the way it does.",
    short:
      "TCP numbers every byte it sends and the receiver acknowledges what it has received, so the sender retransmits anything not acknowledged in time, and the receiver reassembles data in order and discards duplicates. Flow control stops a fast sender from overwhelming a slow receiver: the receiver advertises a window of how much data it can accept. Congestion control stops senders from overloading the network: they start slowly (slow start), grow the sending rate until loss indicates congestion, then back off, as described in RFC 5681. Together these make TCP reliable but add delay on lossy networks.",
    detail: [
      "Checksums detect corrupted segments.",
      "Throughput depends on the round-trip time and the window size.",
      "Modern variants tune congestion control for different network types.",
    ],
    ex: "A large download speeds up as the congestion window grows and slows if packets are dropped.",
    mistakes: [
      "Confusing flow control (receiver) with congestion control (network).",
      "Ignoring RTT when reasoning about throughput.",
    ],
    follow: ["What is slow start?"],
    points: [
      "Sequence numbers and acknowledgements",
      "Retransmit lost data",
      "Flow control via receiver window",
      "Congestion control backs off on loss",
    ],
    notes: ["Reliable, paced, polite."],
    src: [
      ["RFC 9293: TCP", `${RFC}/rfc9293`],
      ["RFC 5681: TCP Congestion Control", `${RFC}/rfc5681`],
    ],
  }),
  q({
    slug: "icmp-ping-traceroute-ttl",
    topic: "TCP/IP",
    d: "medium",
    title: "How do ping and traceroute work (ICMP and TTL)?",
    kw: ["icmp", "ping", "traceroute", "ttl", "hop limit"],
    intent: "Checks you understand the tools you use to test connectivity.",
    short:
      "ICMP is the control protocol used by IP for error and diagnostic messages. `ping` sends ICMP echo requests and measures the echo replies, giving reachability and round-trip time. Every IP packet has a time-to-live (TTL) value that each router decrements; when it reaches zero the router drops the packet and returns an ICMP 'time exceeded' message. `traceroute` exploits this by sending packets with TTL 1, 2, 3 and so on, so each router along the path reveals itself. Many networks block or rate-limit ICMP, so a failed ping does not always mean the host is down.",
    detail: [
      "TTL prevents packets from circulating forever in routing loops.",
      "IPv6 calls the field hop limit and uses ICMPv6.",
      "Use `curl` or `nc` to test a specific TCP port instead of ping.",
    ],
    ex: "`traceroute example.com` lists each router hop and its delay, showing where delay starts.",
    mistakes: [
      "Concluding a service is down because ping fails.",
      "Reading each hop's delay as end-to-end latency.",
    ],
    follow: ["Why does traceroute increase the TTL?"],
    points: [
      "ICMP for diagnostics and errors",
      "ping uses echo request and reply",
      "TTL decrements per hop",
      "traceroute maps hops via TTL expiry",
    ],
    notes: ["TTL expires, router reports."],
    src: [
      ["RFC 792: Internet Control Message Protocol", `${RFC}/rfc792`],
      ["traceroute(8)", `${MAN}/man8/traceroute.8.html`],
      ["ping(8)", `${MAN}/man8/ping.8.html`],
    ],
  }),
  q({
    slug: "ipv4-addresses-private-ranges",
    topic: "IP addressing & subnets",
    d: "easy",
    title: "What is an IPv4 address, and what are private addresses?",
    kw: ["ipv4", "private ip", "public ip", "loopback", "rfc 1918"],
    intent: "Checks you know the address types you meet daily.",
    short:
      "An IPv4 address is a 32-bit number written as four decimal bytes, such as 192.168.1.10, identifying a network interface. Public addresses are routable on the internet, while private ranges reserved by RFC 1918, 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16, are used inside homes, offices and clouds and are not routed on the public internet; devices using them reach the internet through NAT. 127.0.0.1 is the loopback address referring to the machine itself, and 169.254.0.0/16 is used for link-local addresses when no DHCP server answers.",
    detail: [
      "There are about 4.3 billion possible IPv4 addresses, which led to NAT and IPv6.",
      "`ip addr` shows the addresses assigned to interfaces.",
      "Cloud networks (VPCs) use private ranges and need non-overlapping choices when connected.",
    ],
    ex: "A laptop at home has 192.168.1.23 locally, but websites see the router's public address.",
    mistakes: [
      "Choosing overlapping private ranges for networks that must be connected.",
      "Thinking localhost addresses are reachable from other machines.",
    ],
    follow: ["Name the three private ranges."],
    points: [
      "32-bit address in four bytes",
      "RFC 1918 private ranges",
      "127.0.0.1 is loopback",
      "NAT connects private hosts to the internet",
    ],
    notes: ["10/8, 172.16/12, 192.168/16."],
    src: [
      ["RFC 791: Internet Protocol", `${RFC}/rfc791`],
      ["RFC 1918: Address Allocation for Private Internets", `${RFC}/rfc1918`],
      ["MDN: IPv4", `${MDN}/IPv4`],
    ],
  }),
  q({
    slug: "cidr-notation-and-subnet-masks",
    topic: "IP addressing & subnets",
    d: "medium",
    title: "What is CIDR notation and how does a subnet mask work?",
    kw: ["cidr", "subnet mask", "/24", "network prefix", "hosts per subnet"],
    intent: "A frequent test: can you read and size a subnet?",
    short:
      "CIDR notation writes an address followed by the number of leading bits that identify the network, for example 192.168.1.0/24. The rest of the bits identify hosts in that network. The subnet mask is the same idea as a bit pattern: /24 is 255.255.255.0. A /n IPv4 network has 2^(32-n) addresses; the first is the network address and the last the broadcast address, so usable hosts are two fewer: /24 has 256 addresses and 254 hosts, /26 has 64 addresses and 62 hosts. Two hosts are on the same subnet when their addresses match in the network bits.",
    detail: [
      "Each reduction of the prefix length by one doubles the size.",
      "Cloud providers reserve a few more addresses in each subnet.",
      "CIDR replaced the old fixed classes (A, B, C) and allows efficient allocation and route aggregation.",
    ],
    ex: "10.0.0.0/16 can be split into 256 subnets of /24, each with 254 usable addresses.",
    mistakes: [
      "Forgetting to subtract network and broadcast addresses.",
      "Reading /24 as 24 hosts.",
    ],
    follow: ["How many hosts fit in a /27?"],
    points: [
      "Prefix length = network bits",
      "/24 = 255.255.255.0",
      "Size is 2^(32-n)",
      "Same subnet = same network bits",
    ],
    notes: ["32 minus prefix gives host bits."],
    src: [["RFC 4632: CIDR", `${RFC}/rfc4632`]],
  }),
  q({
    slug: "subnetting-example-calculation",
    topic: "IP addressing & subnets",
    d: "medium",
    title: "How would you split 192.168.10.0/24 into four equal subnets?",
    kw: [
      "subnetting",
      "borrow bits",
      "network address",
      "broadcast address",
      "usable range",
    ],
    intent: "Checks you can do the calculation, not just recite theory.",
    short:
      "Four subnets need two extra network bits (2^2 = 4), so the prefix grows from /24 to /26, and each subnet has 64 addresses (62 usable). The networks are 192.168.10.0/26 (hosts .1 to .62, broadcast .63), 192.168.10.64/26 (.65 to .126, broadcast .127), 192.168.10.128/26 (.129 to .190, broadcast .191) and 192.168.10.192/26 (.193 to .254, broadcast .255). The block size is 256 divided by 4 = 64, so each network starts at a multiple of 64. Routers need routes for each subnet, or one aggregate route for the whole /24.",
    detail: [
      "Work out how many subnets and hosts you need first, then pick the prefix length.",
      "Variable-length subnet masks allow subnets of different sizes.",
      "Leave room for growth.",
    ],
    ex: "A small office gives each of four departments its own /26 subnet.",
    code: [
      [
        "The four /26 subnets",
        "text",
        `192.168.10.0/26     hosts .1-.62     broadcast .63\n192.168.10.64/26    hosts .65-.126   broadcast .127\n192.168.10.128/26   hosts .129-.190  broadcast .191\n192.168.10.192/26   hosts .193-.254  broadcast .255`,
        ["Each subnet has 64 addresses.", "Networks begin at multiples of 64."],
      ],
    ],
    mistakes: [
      "Starting a subnet at an address that is not a multiple of the block size.",
      "Counting the network and broadcast addresses as hosts.",
    ],
    follow: ["How many hosts does each subnet hold?"],
    points: [
      "Borrow bits for subnets",
      "Block size = 256 / subnets",
      "Network and broadcast reserved",
      "Aggregate routes where possible",
    ],
    notes: ["/24 to /26 gives four subnets."],
    src: [
      ["RFC 4632: CIDR", `${RFC}/rfc4632`],
      ["RFC 791: Internet Protocol", `${RFC}/rfc791`],
    ],
  }),
  q({
    slug: "nat-and-port-forwarding",
    topic: "IP addressing & subnets",
    d: "medium",
    title: "What is NAT and how does port forwarding relate to it?",
    kw: ["nat", "pat", "port forwarding", "private addresses", "public ip"],
    intent: "Checks you know how private networks reach the internet.",
    short:
      "Network address translation lets many devices with private addresses share one public IP address. The router rewrites the source address (and usually the source port) of outgoing packets and remembers the mapping so replies can be translated back to the right device. Because inbound connections have no mapping, hosts behind NAT are not directly reachable from the internet. Port forwarding adds a static rule, such as 'public port 8080 goes to 192.168.1.20:80', so outside connections can reach a chosen internal service. NAT is also one reason IPv4 has lasted despite address exhaustion.",
    detail: [
      "NAT is not a security feature by itself; use a firewall.",
      "Peer-to-peer applications need NAT traversal techniques.",
      "Cloud instances in private subnets use a NAT gateway to reach the internet for updates.",
    ],
    ex: "A home router lets all devices browse through one public address and forwards port 22 to a Raspberry Pi.",
    mistakes: [
      "Treating NAT as a firewall.",
      "Exposing services by port forwarding without securing them.",
    ],
    follow: [
      "Why can't outside hosts start connections to a NAT'd device by default?",
    ],
    points: [
      "Many private hosts share one public IP",
      "Translation table maps connections",
      "Port forwarding maps inbound ports",
      "Not a replacement for a firewall",
    ],
    notes: ["NAT hides, forwarding exposes."],
    src: [
      ["RFC 3022: Traditional IP Network Address Translator", `${RFC}/rfc3022`],
      ["MDN: NAT", `${MDN}/NAT`],
    ],
  }),
  q({
    slug: "ipv6-basics",
    topic: "IP addressing & subnets",
    d: "medium",
    title: "What is IPv6 and how does it differ from IPv4?",
    kw: [
      "ipv6",
      "128-bit address",
      "address exhaustion",
      "slaac",
      "dual stack",
    ],
    intent: "Checks you know the successor protocol and its main features.",
    short:
      "IPv6 is the successor to IPv4, with 128-bit addresses written in hexadecimal groups separated by colons, such as 2001:db8::1, where `::` abbreviates a run of zeros. The huge address space solves exhaustion and removes the need for NAT, giving each device a globally unique address. IPv6 also simplifies the header, supports stateless address autoconfiguration, and mandates features such as neighbour discovery in place of ARP. Networks usually run dual stack, supporting IPv4 and IPv6 together, while the transition continues.",
    detail: [
      "A typical subnet in IPv6 is a /64.",
      "Services should listen on both families and publish AAAA DNS records.",
      "Firewalls still matter, because global addresses are directly reachable.",
    ],
    ex: "A site publishes both A and AAAA records so clients on IPv6 networks connect over IPv6.",
    mistakes: [
      "Assuming IPv6 is only for the future: many users already use it.",
      "Forgetting IPv6 firewall rules.",
    ],
    follow: ["What does :: mean in an IPv6 address?"],
    points: [
      "128-bit addresses",
      "Hex groups with colons and ::",
      "No need for NAT",
      "Dual stack during transition",
    ],
    notes: ["More addresses, simpler routing."],
    src: [
      ["RFC 8200: Internet Protocol, Version 6", `${RFC}/rfc8200`],
      ["RFC 4291: IPv6 Addressing Architecture", `${RFC}/rfc4291`],
      ["ipv6(7)", `${MAN}/man7/ipv6.7.html`],
    ],
  }),
  q({
    slug: "arp-dhcp-local-network",
    topic: "IP addressing & subnets",
    d: "medium",
    title: "What do ARP and DHCP do on a local network?",
    kw: ["arp", "dhcp", "mac address", "ip lease", "local network"],
    intent:
      "Checks you know how a device gets an address and finds its neighbours.",
    short:
      "DHCP automatically configures devices: a new device broadcasts a request, and a DHCP server leases it an IP address along with the subnet mask, default gateway and DNS servers, for a limited time. ARP resolves an IPv4 address to a hardware (MAC) address on the local network: to send to 192.168.1.1, a host broadcasts 'who has this address?' and the owner replies with its MAC address, which the sender caches. On Ethernet, frames are delivered using MAC addresses, while IP addresses identify hosts across networks.",
    detail: [
      "`ip neigh` shows the neighbour (ARP) cache.",
      "Servers usually have static or reserved addresses so they do not change.",
      "IPv6 uses neighbour discovery instead of ARP.",
    ],
    ex: "A laptop joining Wi-Fi gets an address, gateway and DNS from the router through DHCP.",
    mistakes: [
      "Two devices configured with the same static IP.",
      "Confusing MAC addresses with IP addresses.",
    ],
    follow: ["What does a DHCP lease include?"],
    points: [
      "DHCP leases addresses and settings",
      "ARP maps IP to MAC locally",
      "Frames use MAC addresses",
      "IPv6 uses neighbour discovery",
    ],
    notes: ["DHCP assigns, ARP resolves."],
    src: [
      ["RFC 2131: Dynamic Host Configuration Protocol", `${RFC}/rfc2131`],
      ["RFC 826: Address Resolution Protocol", `${RFC}/rfc826`],
      ["ip-neighbour(8)", `${MAN}/man8/ip-neighbour.8.html`],
    ],
  }),
  q({
    slug: "dns-how-resolution-works",
    topic: "DNS",
    d: "easy",
    title: "How does DNS resolve a domain name to an IP address?",
    kw: ["dns", "resolver", "root server", "authoritative", "recursive"],
    intent: "A core question: checks you can trace a lookup end to end.",
    short:
      "DNS is the distributed, hierarchical system that maps names to addresses. Your device asks a recursive resolver, usually run by your ISP or a public service. If the answer is not cached, the resolver asks a root server, which refers it to the top-level domain servers for `.com`, which refer it to the domain's authoritative name servers, which return the record for `www.example.com`. The resolver returns the answer and caches it for the record's TTL. The operating system and browser also cache results, so repeated lookups are fast.",
    detail: [
      "Authoritative servers hold the zone's records; resolvers only ask and cache.",
      "DNS normally uses UDP port 53, falling back to TCP for large responses.",
      "`dig` shows each step with `+trace`.",
    ],
    ex: "Typing example.com triggers a lookup chain, and the browser then connects to the IP address returned.",
    mistakes: [
      "Confusing recursive resolvers with authoritative servers.",
      "Forgetting caching when changes seem slow to appear.",
    ],
    follow: ["What is the role of the root servers?"],
    points: [
      "Hierarchical distributed database",
      "Recursive resolver asks root, TLD, authoritative",
      "Answers cached by TTL",
      "UDP/TCP port 53",
    ],
    notes: ["Root, TLD, authoritative."],
    src: [
      ["RFC 1034: Domain Names - Concepts and Facilities", `${RFC}/rfc1034`],
      ["RFC 1035: Domain Names - Implementation", `${RFC}/rfc1035`],
      ["MDN: DNS", `${MDN}/DNS`],
    ],
  }),
  q({
    slug: "dns-record-types",
    topic: "DNS",
    d: "easy",
    title: "What are the common DNS record types?",
    kw: ["a record", "aaaa", "cname", "mx", "txt", "ns"],
    intent: "Checks you can configure a domain.",
    short:
      "An A record maps a name to an IPv4 address and an AAAA record to an IPv6 address. A CNAME makes one name an alias of another name (not allowed at the zone apex alongside other records). MX records name the mail servers for a domain, with priorities. TXT records hold text used for verification and email policies such as SPF, DKIM and DMARC. NS records list the domain's authoritative name servers, and the SOA record holds zone metadata. PTR records map addresses back to names for reverse DNS.",
    detail: [
      "Use `dig example.com MX` to query a specific type.",
      "Some providers offer ALIAS or ANAME records to mimic a CNAME at the apex.",
      "Each record has a TTL that controls caching.",
    ],
    ex: "A site sets an A record for `example.com`, a CNAME for `www`, and MX records for its email provider.",
    mistakes: [
      "A CNAME at the zone apex.",
      "Missing TXT records for email authentication.",
    ],
    follow: ["What is the difference between A and CNAME?"],
    points: ["A/AAAA to addresses", "CNAME alias", "MX for mail", "TXT and NS"],
    notes: ["A address, CNAME alias, MX mail."],
    src: [
      ["RFC 1035: Domain Names - Implementation", `${RFC}/rfc1035`],
      ["MDN: Domain name", `${MDN}/Domain_name`],
    ],
  }),
  q({
    slug: "dns-ttl-caching-propagation",
    topic: "DNS",
    d: "medium",
    title: "What is DNS TTL, and why do DNS changes take time to 'propagate'?",
    kw: ["ttl", "dns caching", "propagation", "negative caching", "flush dns"],
    intent: "Checks you understand why a change is not instant.",
    short:
      "Each DNS record has a time to live (TTL) in seconds that tells resolvers how long they may cache it. When you change a record, resolvers that cached the old value keep serving it until its TTL expires, so different users see the change at different times; this is what people call propagation, though DNS does not push updates. Before a planned change, lower the TTL in advance so caches expire quickly, make the change, then raise it again. Failed lookups can be cached too (negative caching), so a name created just after a failed lookup may not resolve immediately.",
    detail: [
      "The operating system and browser add their own caches.",
      "`dig +ttl` and `dig @8.8.8.8` help check what different resolvers return.",
      "Very low TTLs increase DNS load and lookup latency.",
    ],
    ex: "A migration lowers TTL from 24 hours to 5 minutes the day before switching the A record.",
    mistakes: [
      "Changing the record and expecting immediate effect everywhere.",
      "Leaving a very low TTL forever.",
    ],
    follow: ["How do you prepare for a DNS cutover?"],
    points: [
      "TTL controls caching time",
      "Old values live until TTL expires",
      "Lower TTL before changes",
      "Negative caching exists",
    ],
    notes: ["Lower the TTL first."],
    src: [
      ["RFC 1034: Domain Names", `${RFC}/rfc1034`],
      ["RFC 2308: Negative Caching of DNS Queries", `${RFC}/rfc2308`],
      ["MDN: TTL", `${MDN}/TTL`],
    ],
  }),
  q({
    slug: "dns-tools-dig-resolv-hosts",
    topic: "DNS",
    d: "medium",
    title:
      "How do you troubleshoot DNS on Linux: dig, /etc/hosts and resolv.conf?",
    kw: ["dig", "/etc/hosts", "resolv.conf", "nsswitch", "name resolution"],
    intent: "Checks you can find why a name does not resolve.",
    short:
      "`dig example.com` queries DNS and shows the answer, the TTL and which server replied; `dig @1.1.1.1 example.com` asks a specific resolver, and `dig +trace` follows the delegation from the root. Name lookups by programs follow the order in `/etc/nsswitch.conf`, usually the `/etc/hosts` file first and then DNS using the servers in `/etc/resolv.conf` (often a local stub resolver managed by systemd-resolved). So a wrong entry in `/etc/hosts` can override DNS, and an unreachable resolver causes slow or failing lookups. `getent hosts name` shows what applications would get.",
    detail: [
      "Compare answers from your resolver and a public one to spot stale caches.",
      "`resolvectl status` shows resolver settings on systemd systems.",
      "Check both A and AAAA records when IPv6 is involved.",
    ],
    ex: "A site resolves on one machine but not another because of an old `/etc/hosts` line.",
    mistakes: [
      "Testing with ping only.",
      "Forgetting /etc/hosts can override DNS.",
    ],
    follow: ["What decides the order of hosts file versus DNS?"],
    points: [
      "dig queries DNS directly",
      "nsswitch.conf sets lookup order",
      "/etc/hosts overrides",
      "resolv.conf lists resolvers",
    ],
    notes: ["dig for DNS, getent for what apps see."],
    src: [
      ["hosts(5)", `${MAN}/man5/hosts.5.html`],
      ["resolv.conf(5)", `${MAN}/man5/resolv.conf.5.html`],
      ["nsswitch.conf(5)", `${MAN}/man5/nsswitch.conf.5.html`],
    ],
  }),
  q({
    slug: "dns-security-doh-dot",
    topic: "DNS",
    d: "hard",
    title: "What are DNS over TLS and DNS over HTTPS?",
    kw: ["dns over tls", "dns over https", "dns privacy", "port 853", "dnssec"],
    intent:
      "Checks you know that plain DNS is unencrypted and how that is addressed.",
    short:
      "Traditional DNS queries and answers are sent in clear text, so anyone on the path can see which names you look up and may tamper with replies. DNS over TLS (DoT, RFC 7858) wraps DNS in a TLS connection, usually on port 853, and DNS over HTTPS (DoH, RFC 8484) carries DNS queries inside HTTPS requests. Both protect privacy and integrity between the client and the resolver, but the resolver itself still sees the queries. DNSSEC is a different mechanism: it signs DNS data so that its authenticity can be validated, without encrypting it.",
    detail: [
      "Browsers and operating systems can enable DoH or DoT to a chosen resolver.",
      "Encrypted DNS can complicate network filtering in organisations.",
      "Encrypting transport and signing records solve different problems.",
    ],
    ex: "A browser sends lookups to a public resolver over HTTPS so the local network cannot read them.",
    mistakes: [
      "Assuming DNSSEC encrypts queries.",
      "Believing encrypted DNS hides all browsing from everyone.",
    ],
    follow: ["What does DNSSEC provide?"],
    points: [
      "Classic DNS is plaintext",
      "DoT on port 853, DoH over HTTPS",
      "Protects the client-resolver path",
      "DNSSEC signs, does not encrypt",
    ],
    notes: ["Encryption versus authenticity."],
    src: [
      ["RFC 7858: DNS over TLS", `${RFC}/rfc7858`],
      ["RFC 8484: DNS over HTTPS", `${RFC}/rfc8484`],
    ],
  }),
  q({
    slug: "ports-and-well-known-services",
    topic: "Ports & sockets",
    d: "easy",
    title: "What is a port number, and which common ports should you know?",
    kw: [
      "port numbers",
      "well-known ports",
      "ephemeral ports",
      "http 80",
      "ssh 22",
    ],
    intent: "A basic question every developer should answer quickly.",
    short:
      "A port is a 16-bit number (0 to 65535) that identifies a service or connection endpoint on a host, so one IP address can serve many applications. Ports 0 to 1023 are well-known system ports, 1024 to 49151 are registered ports, and 49152 to 65535 are dynamic or ephemeral ports used by clients for outgoing connections. Common ones: 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS, 3306 MySQL, 5432 PostgreSQL, 6379 Redis and 27017 MongoDB. Only one process can listen on a given port and address at a time.",
    detail: [
      "Linux's ephemeral range is configurable, and the default differs slightly from IANA's.",
      "`ss -tulpn` shows listening ports and owning processes.",
      "A firewall decides which ports are reachable.",
    ],
    ex: "A web server listens on port 443 for HTTPS, while a browser connects from a random ephemeral port.",
    mistakes: [
      "Starting two servers on the same port.",
      "Exposing database ports to the internet.",
    ],
    follow: ["Which port does HTTPS use?"],
    points: [
      "16-bit port numbers",
      "Well-known, registered, dynamic ranges",
      "Know 22, 53, 80, 443 and database ports",
      "One listener per port",
    ],
    notes: ["IP finds the host, the port finds the service."],
    src: [
      [
        "RFC 6335: IANA Procedures for Service Names and Port Numbers",
        `${RFC}/rfc6335`,
      ],
      ["MDN: Port", `${MDN}/Port`],
      ["services(5)", `${MAN}/man5/services.5.html`],
    ],
  }),
  q({
    slug: "sockets-bind-listen-accept",
    topic: "Ports & sockets",
    d: "medium",
    title: "What is a socket, and how do a server and client use sockets?",
    kw: ["socket", "bind", "listen", "accept", "connect"],
    intent: "Checks you understand the API behind network programs.",
    short:
      "A socket is an endpoint for communication, identified by a protocol, an IP address and a port; the operating system exposes it to programs like a file descriptor. A TCP server creates a socket, `bind`s it to an address and port, calls `listen` to accept incoming connection requests, and `accept`s each one, which returns a new socket for that client. A client creates a socket and `connect`s to the server's address and port. A TCP connection is identified by the four values of source address and port and destination address and port, so one server port can serve many clients.",
    detail: [
      "High-level libraries such as Node's `net` and `http` modules wrap these calls.",
      "A server bound to 127.0.0.1 accepts only local connections, while 0.0.0.0 accepts connections on all interfaces.",
      "'Address already in use' means the port is held by another process or in TIME_WAIT.",
    ],
    ex: "An Express app calling `listen(3000)` creates a listening socket, and each browser connection gets its own accepted socket.",
    mistakes: [
      "Binding to localhost and expecting remote access.",
      "Ignoring the difference between the listening socket and connection sockets.",
    ],
    follow: ["What does accept return?"],
    points: [
      "Endpoint = protocol, address, port",
      "Server: bind, listen, accept",
      "Client: connect",
      "Connection = 4-tuple",
    ],
    notes: ["bind, listen, accept."],
    src: [
      ["socket(2)", `${MAN}/man2/socket.2.html`],
      ["bind(2)", `${MAN}/man2/bind.2.html`],
      ["listen(2)", `${MAN}/man2/listen.2.html`],
    ],
  }),
  q({
    slug: "localhost-0-0-0-0-binding",
    topic: "Ports & sockets",
    d: "easy",
    title:
      "What is the difference between binding to localhost and to 0.0.0.0?",
    kw: [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "bind address",
      "network exposure",
    ],
    intent: "A frequent source of 'works locally but not remotely' bugs.",
    short:
      "The address a server binds to decides which network interfaces it accepts connections on. Binding to `127.0.0.1` (localhost, the loopback interface) accepts only connections from the same machine, which is safe for development and for services meant only for a local reverse proxy. Binding to `0.0.0.0` listens on all IPv4 interfaces, so the service is reachable from other machines if the firewall allows it. Inside a container, an app bound only to 127.0.0.1 is unreachable through published ports, so it must listen on 0.0.0.0. Databases should normally be bound to localhost or a private address.",
    detail: [
      "`::` is the IPv6 equivalent of 0.0.0.0.",
      "`ss -tulpn` shows the bound address of each listener.",
      "Security groups and firewalls add another access layer.",
    ],
    ex: 'Node `app.listen(3000, "127.0.0.1")` serves only local requests, which suits an app behind nginx.',
    mistakes: [
      "App in a container bound to 127.0.0.1.",
      "Databases bound to 0.0.0.0 on a public server.",
    ],
    follow: ["How can you check which address a service is bound to?"],
    points: [
      "127.0.0.1 = same machine only",
      "0.0.0.0 = all interfaces",
      "Containers need 0.0.0.0",
      "Keep databases private",
    ],
    notes: ["Bind as narrowly as you can."],
    src: [
      ["ip(7)", `${MAN}/man7/ip.7.html`],
      [
        "MDN: What is a web server?",
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server",
      ],
    ],
  }),
  q({
    slug: "tcp-connection-states-time-wait",
    topic: "Ports & sockets",
    d: "hard",
    title:
      "What are TCP connection states such as ESTABLISHED, TIME_WAIT and CLOSE_WAIT?",
    kw: ["tcp states", "time_wait", "close_wait", "established", "ss -tan"],
    intent: "Checks you can read socket statistics when debugging.",
    short:
      "A TCP connection moves through states: LISTEN (server waiting), SYN_SENT and SYN_RECEIVED during the handshake, ESTABLISHED while data flows, and closing states such as FIN_WAIT and CLOSE_WAIT. The side that closes first ends in TIME_WAIT for a period, which prevents delayed packets from an old connection being mistaken for a new one. Many sockets in TIME_WAIT are normal on busy clients. A growing number in CLOSE_WAIT usually means the application received the peer's close but never closed its own socket, which indicates a bug such as a leaked connection. `ss -tan` lists states.",
    detail: [
      "Connection pooling and keep-alive reduce churn.",
      "Running out of ephemeral ports can follow from very many short connections.",
      "Tuning TIME_WAIT blindly can cause subtle failures.",
    ],
    ex: "A service leaks HTTP client connections; `ss` shows thousands of sockets in CLOSE_WAIT.",
    mistakes: [
      "Treating TIME_WAIT as a leak.",
      "Ignoring CLOSE_WAIT build-up.",
    ],
    follow: ["What does a pile of CLOSE_WAIT sockets suggest?"],
    points: [
      "LISTEN, ESTABLISHED, closing states",
      "TIME_WAIT protects against stale packets",
      "CLOSE_WAIT = app has not closed",
      "ss -tan shows states",
    ],
    notes: ["TIME_WAIT is normal, CLOSE_WAIT is suspicious."],
    src: [
      ["RFC 9293: TCP (connection states)", `${RFC}/rfc9293`],
      ["tcp(7)", `${MAN}/man7/tcp.7.html`],
      ["ss(8)", `${MAN}/man8/ss.8.html`],
    ],
  }),
  q({
    slug: "routing-tables-default-gateway",
    topic: "Routing",
    d: "medium",
    title: "How does a host or router decide where to send a packet?",
    kw: [
      "routing table",
      "default gateway",
      "longest prefix match",
      "next hop",
      "ip route",
    ],
    intent: "Checks you understand forwarding decisions.",
    short:
      "Each host and router has a routing table of destination networks, each with a next hop and interface. For a packet, the device finds the table entries whose prefix matches the destination address and uses the most specific one, the longest prefix match. Destinations on the local network are delivered directly; anything else goes to a gateway, and the default route (0.0.0.0/0) sends all other traffic to the default gateway, usually the home or office router, which repeats the process. `ip route` shows the table, and `ip route get 8.8.8.8` shows which route would be used.",
    detail: [
      "Each router only decides the next hop; it does not know the full path.",
      "A missing or wrong default route is a common reason for 'network unreachable'.",
      "Static routes are added manually and dynamic routes are learned through routing protocols.",
    ],
    ex: "A laptop at 192.168.1.23 sends a packet for 8.8.8.8 to its gateway 192.168.1.1 because only the default route matches.",
    mistakes: [
      "Forgetting the default gateway when configuring a static IP.",
      "Overlapping routes that send traffic the wrong way.",
    ],
    follow: ["What is longest prefix match?"],
    points: [
      "Table of prefixes and next hops",
      "Most specific route wins",
      "Default route 0.0.0.0/0",
      "ip route and ip route get",
    ],
    notes: ["Most specific match wins."],
    src: [
      ["RFC 1122: Requirements for Internet Hosts", `${RFC}/rfc1122`],
      ["ip-route(8)", `${MAN}/man8/ip-route.8.html`],
    ],
  }),
  q({
    slug: "routing-protocols-bgp-ospf",
    topic: "Routing",
    d: "hard",
    title: "What are routing protocols such as OSPF and BGP?",
    kw: ["ospf", "bgp", "autonomous system", "dynamic routing", "igp egp"],
    intent: "Checks that you know how routes are learned at scale.",
    short:
      "Routing protocols let routers share information so they can build routing tables automatically and adapt to failures. Inside one organisation's network, an interior gateway protocol such as OSPF computes shortest paths from a shared map of the links (link-state). Between organisations on the internet, the Border Gateway Protocol (BGP) exchanges reachability information between autonomous systems, the independently managed networks identified by AS numbers, and applies policies about which routes to prefer. BGP holds the internet together, and mistakes or hijacks in it can disrupt traffic widely.",
    detail: [
      "An ISP uses BGP to advertise the prefixes it can reach.",
      "Cloud providers expose BGP for private connectivity such as VPN or direct links.",
      "Application developers rarely configure these protocols, but outages often involve them.",
    ],
    ex: "Two companies' networks are connected by BGP sessions that exchange which IP prefixes each can reach.",
    mistakes: [
      "Confusing interior and exterior routing protocols.",
      "Assuming the internet has a central routing authority.",
    ],
    follow: ["What is an autonomous system?"],
    points: [
      "Dynamic routes learned automatically",
      "OSPF inside a network",
      "BGP between autonomous systems",
      "Policies and prefixes",
    ],
    notes: ["OSPF inside, BGP between."],
    src: [
      ["RFC 4271: A Border Gateway Protocol 4 (BGP-4)", `${RFC}/rfc4271`],
      ["RFC 2328: OSPF Version 2", `${RFC}/rfc2328`],
    ],
  }),
  q({
    slug: "switch-router-hub-firewall-roles",
    topic: "Routing",
    d: "easy",
    title: "What is the difference between a switch, a router and a firewall?",
    kw: ["switch", "router", "firewall", "layer 2", "layer 3"],
    intent: "Checks you know the devices in a network.",
    short:
      "A switch connects devices within the same local network and forwards Ethernet frames by MAC address, only to the port where the destination is. A router connects different networks and forwards IP packets between them using routing tables; the home 'router' also does NAT and DHCP. A firewall filters traffic according to rules, allowing or blocking by address, port, protocol or state; it can be a dedicated device, part of a router, or software on a host. Cloud networks provide the same functions virtually through subnets, route tables and security groups.",
    detail: [
      "A switch operates at the link layer, a router at the internet layer.",
      "Hubs, which repeat to all ports, are obsolete.",
      "Defence in depth uses firewalls at several levels.",
    ],
    ex: "In an office, switches link the desks, a router links the office to the ISP, and a firewall filters inbound traffic.",
    mistakes: [
      "Expecting a switch to route between subnets.",
      "Assuming a firewall is only at the network edge.",
    ],
    follow: ["Which device uses MAC addresses to forward?"],
    points: [
      "Switch: frames by MAC, one network",
      "Router: packets between networks",
      "Firewall: rule-based filtering",
      "Cloud equivalents are virtual",
    ],
    notes: ["Switch within, router between, firewall filters."],
    src: [
      ["MDN: Router", `${MDN}/Router`],
      ["MDN: Firewall", `${MDN}/Firewall`],
    ],
  }),
  q({
    slug: "how-the-internet-works-request-journey",
    topic: "Internet fundamentals",
    d: "easy",
    title: "What happens when you type a URL into a browser?",
    kw: [
      "url to page",
      "dns lookup",
      "tcp tls handshake",
      "http request",
      "rendering",
    ],
    intent:
      "The classic end-to-end question; checks you can connect all the layers.",
    short:
      "The browser parses the URL, checks its caches, and resolves the host name to an IP address with DNS. It opens a TCP connection to the server (three-way handshake), and for HTTPS performs a TLS handshake to authenticate the server and set up encryption. It then sends an HTTP request, the server (often behind a CDN, load balancer or reverse proxy) processes it and returns a response with a status code, headers and the HTML. The browser parses the HTML, fetches linked resources such as CSS, JavaScript and images, builds the page and renders it. Connections may be reused for later requests.",
    detail: [
      "HTTP/2 and HTTP/3 multiplex many requests over one connection.",
      "Caching can skip steps: DNS, HTTP and connection reuse all save time.",
      "Each step adds latency, which is why performance tuning targets them.",
    ],
    ex: "Opening https://example.com triggers DNS, TCP, TLS, an HTTP GET and then many sub-requests for page assets.",
    mistakes: [
      "Skipping DNS or TLS in the explanation.",
      "Forgetting that most work happens in subsequent resource requests.",
    ],
    follow: ["Which steps can caching avoid?"],
    points: [
      "DNS, TCP, TLS, HTTP request and response",
      "Browser parses and fetches resources",
      "Caches and CDNs shorten the path",
      "Connections are reused",
    ],
    notes: ["DNS, connect, secure, request, render."],
    src: [
      [
        "MDN: How the Web works",
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works",
      ],
      [
        "MDN: Overview of HTTP",
        "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview",
      ],
    ],
  }),
  q({
    slug: "latency-bandwidth-throughput",
    topic: "Internet fundamentals",
    d: "easy",
    title: "What is the difference between latency, bandwidth and throughput?",
    kw: [
      "latency",
      "bandwidth",
      "throughput",
      "round trip time",
      "packet loss",
    ],
    intent: "Checks you can reason about network performance.",
    short:
      "Latency is the time for data to travel from one point to another, often measured as round-trip time (RTT) in milliseconds, and it is limited by distance and the speed of light plus processing delays. Bandwidth is the maximum amount of data a link can carry per second, such as 100 Mbit/s. Throughput is the data rate actually achieved, which is lower than bandwidth because of protocol overhead, packet loss, congestion and latency effects such as TCP's windowing. A high-bandwidth link can still feel slow for many small requests if latency is high, so reducing round trips often helps more than adding bandwidth.",
    detail: [
      "Moving content closer with a CDN reduces latency.",
      "Packet loss triggers retransmissions and slows TCP.",
      "Jitter is variation in latency, important for voice and video.",
    ],
    ex: "Loading a page needing 50 sequential requests over a 200 ms RTT link is slow even with a very fast connection.",
    mistakes: [
      "Equating speed with bandwidth only.",
      "Ignoring round trips in application design.",
    ],
    follow: ["How can you reduce latency for global users?"],
    points: [
      "Latency = delay, RTT",
      "Bandwidth = capacity",
      "Throughput = achieved rate",
      "Fewer round trips help",
    ],
    notes: ["Capacity versus delay."],
    src: [
      ["MDN: Latency", `${MDN}/Latency`],
      ["MDN: Bandwidth", `${MDN}/Bandwidth`],
      ["MDN: Round Trip Time", `${MDN}/Round_Trip_Time`],
    ],
  }),
  q({
    slug: "cdn-and-load-balancer-roles",
    topic: "Internet fundamentals",
    d: "medium",
    title: "What do a CDN and a load balancer do in a web architecture?",
    kw: ["cdn", "load balancer", "edge cache", "health checks", "scaling"],
    intent: "Checks you know the standard components in front of web apps.",
    short:
      "A content delivery network is a set of servers around the world that cache and serve content from a location near the user, cutting latency and relieving the origin server; it handles static assets well and can add TLS termination and protection against attacks. A load balancer distributes incoming requests across several backend servers, using health checks to avoid unhealthy ones, so the service can scale horizontally and survive failures. A typical path is user, CDN, load balancer, application servers, database.",
    detail: [
      "Load balancers operate at layer 4 (TCP) or layer 7 (HTTP) and can route by path or host.",
      "Cache headers decide what a CDN may store.",
      "Applications behind a load balancer should be stateless or use shared session storage.",
    ],
    ex: "Images and scripts load from the CDN, while API calls pass through a load balancer to three app instances.",
    mistakes: [
      "Caching personalised responses at the CDN.",
      "Stateful instances behind a load balancer.",
    ],
    follow: ["What is a health check?"],
    points: [
      "CDN caches near users",
      "Load balancer spreads requests",
      "Health checks remove failed backends",
      "Stateless apps scale",
    ],
    notes: ["Edge caches, balancers distribute."],
    src: [
      ["MDN: CDN", `${MDN}/CDN`],
      [
        "nginx: Using nginx as HTTP load balancer",
        "https://nginx.org/en/docs/http/load_balancing.html",
      ],
    ],
  }),
  q({
    slug: "tls-https-basics-networking",
    topic: "Internet fundamentals",
    d: "medium",
    title: "How does TLS secure a connection?",
    kw: ["tls", "https", "certificate", "handshake", "encryption"],
    intent: "Checks you understand what HTTPS provides.",
    short:
      "TLS provides three things: encryption so eavesdroppers cannot read the data, integrity so it cannot be modified undetected, and authentication of the server through its certificate. During the handshake the client and server agree on parameters, the server presents a certificate signed by a trusted certificate authority that proves its identity, and they derive shared session keys using key exchange, after which data is encrypted with fast symmetric encryption. TLS 1.3 (RFC 8446) shortens the handshake and removes older, weak options. HTTPS is HTTP carried over TLS.",
    detail: [
      "Browsers verify that the certificate matches the host name and is not expired or revoked.",
      "TLS protects data in transit only, not data at rest or against a compromised server.",
      "Certificates from Let's Encrypt are free and automated.",
    ],
    ex: "The padlock in the browser means the connection is encrypted and the certificate matched the domain.",
    mistakes: [
      "Assuming HTTPS means the site is trustworthy.",
      "Letting certificates expire.",
    ],
    follow: ["What does a certificate authority do?"],
    points: [
      "Encryption, integrity, authentication",
      "Certificate proves identity",
      "Key exchange then symmetric encryption",
      "TLS 1.3 is faster and simpler",
    ],
    notes: ["Certificates authenticate, keys encrypt."],
    src: [
      ["RFC 8446: TLS 1.3", `${RFC}/rfc8446`],
      ["MDN: TLS", `${MDN}/TLS`],
    ],
  }),
  q({
    slug: "proxy-vs-vpn-basics",
    topic: "Internet fundamentals",
    d: "medium",
    title: "What is the difference between a proxy and a VPN?",
    kw: ["proxy server", "vpn", "tunnel", "encryption", "ip address"],
    intent: "Checks you know when each is used.",
    short:
      "A proxy server relays requests on behalf of a client (forward proxy) or a server (reverse proxy). A forward proxy can filter, cache or hide the client's address for the traffic it handles, and does not necessarily encrypt anything. A VPN creates an encrypted tunnel between a device and a VPN endpoint, so all traffic from the device, not just one application's, travels securely to that network and appears to come from it. VPNs are used to reach private company or cloud networks safely, while reverse proxies like nginx sit in front of servers.",
    detail: [
      "A VPN protects traffic from local snooping but moves trust to the VPN operator.",
      "Site-to-site VPNs connect whole networks, such as an office and a cloud VPC.",
      "Neither is a substitute for HTTPS end to end.",
    ],
    ex: "A developer connects through a VPN to reach a database that is not exposed to the internet.",
    mistakes: [
      "Assuming a proxy encrypts traffic.",
      "Trusting a VPN provider blindly.",
    ],
    follow: ["What is a reverse proxy?"],
    points: [
      "Proxy relays requests",
      "VPN encrypts a tunnel for all traffic",
      "Reverse proxy fronts servers",
      "HTTPS still matters",
    ],
    notes: ["Proxy relays, VPN tunnels."],
    src: [
      [
        "MDN: Proxy server",
        "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Proxy_servers_and_tunneling",
      ],
      ["MDN: Router", `${MDN}/Router`],
    ],
  }),
])
