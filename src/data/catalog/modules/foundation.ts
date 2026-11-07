import { LINUX_COMMANDS } from "@/data/linux/commands"
import { LINUX_CATEGORIES, LINUX_CATEGORY_LABEL } from "@/data/linux/schema"
import { mod, type TopicSpec } from "./factory"

/** Linux Command Mastery: one topic per command category of the Linux practice library, ~6 minutes per command. */
const LINUX_COMMAND_TOPICS: TopicSpec[] = LINUX_CATEGORIES.map((category) => {
  const count = LINUX_COMMANDS.filter((c) => c.category === category).length
  return [LINUX_CATEGORY_LABEL[category], Math.max(15, count * 6)] as const
}).filter(([title]) =>
  LINUX_COMMANDS.some((c) => LINUX_CATEGORY_LABEL[c.category] === title)
)

export const FOUNDATION_MODULES = [
  mod(
    "computer-fundamentals",
    "Computer Fundamentals",
    "programming",
    "foundation",
    "beginner",
    "How a computer works: CPU, memory, storage and how programs run.",
    [
      ["CPU & instruction cycle", 60],
      ["Memory (RAM and cache)", 60],
      ["Storage", 45],
      ["Processes & programs", 60],
      ["Binary & data representation", 60],
      ["Input/output & devices", 30],
    ]
  ),
  mod(
    "operating-systems",
    "Operating Systems",
    "programming",
    "foundation",
    "intermediate",
    "Processes, threads, memory, scheduling and file systems.",
    [
      ["Processes & threads", 90],
      ["Memory management", 90],
      ["CPU scheduling", 75],
      ["File systems", 60],
      ["Synchronization & deadlocks", 90],
      ["System calls", 45],
    ],
    { prerequisites: ["computer-fundamentals"] }
  ),
  mod(
    "linux",
    "Linux Fundamentals",
    "linux",
    "foundation",
    "beginner",
    "Filesystem, permissions, processes, networking and shell fundamentals.",
    [
      ["Filesystem", 80],
      ["Permissions", 80],
      ["Processes", 70],
      ["Text processing", 90],
      ["Networking", 70],
      ["Shell scripting", 110],
    ]
  ),
  mod(
    "linux-commands",
    "Linux Command Mastery",
    "linux",
    "foundation",
    "beginner",
    "Practise the reference command set in the safe practice terminal: files, search, text processing, permissions and more.",
    LINUX_COMMAND_TOPICS,
    { prerequisites: ["linux"] }
  ),
  mod(
    "ubuntu-admin",
    "Ubuntu 24.04 Administration",
    "linux",
    "foundation",
    "intermediate",
    "Installing and running an Ubuntu server: packages, services, logs and users.",
    [
      ["Installation", 60],
      ["Package manager (apt)", 60],
      ["Services (systemd)", 75],
      ["Logs (journalctl)", 60],
      ["Users & groups", 60],
    ],
    { prerequisites: ["linux"], alsoIn: ["devops"] }
  ),
  mod(
    "networking",
    "Computer Networking",
    "devops",
    "foundation",
    "intermediate",
    "TCP/IP, addressing, DNS, ports and routing, and how the internet fits together.",
    [
      ["TCP/IP", 90],
      ["IP addressing & subnets", 75],
      ["DNS", 60],
      ["Ports & sockets", 45],
      ["Routing", 60],
      ["Internet fundamentals", 45],
    ]
  ),
  mod(
    "http",
    "HTTP and HTTPS",
    "apis",
    "foundation",
    "beginner",
    "Methods, headers, status codes, cookies and how TLS secures a connection.",
    [
      ["Methods", 45],
      ["Headers", 45],
      ["Status codes", 40],
      ["HTTPS & TLS", 60],
      ["Cookies & caching headers", 45],
    ]
  ),
  mod(
    "git",
    "Git, GitHub & Bitbucket",
    "git",
    "foundation",
    "beginner",
    "Branching, merging, rebasing, history rewriting, and working in teams on GitHub and Bitbucket.",
    [
      ["Basics", 60, "Git"],
      ["Branching", 60, "Git"],
      ["Merge vs rebase", 75, "Git"],
      ["Undoing changes", 60, "Git"],
      ["Workflows", 45, "Git"],
      ["GitHub pull requests", 45, "GitHub"],
      ["GitHub code review", 40, "GitHub"],
      ["GitHub repositories & forks", 30, "GitHub"],
      ["Bitbucket repositories & permissions", 30, "Bitbucket"],
      ["Bitbucket pull requests", 30, "Bitbucket"],
    ]
  ),
  mod(
    "testing",
    "Software Testing",
    "testing",
    "foundation",
    "intermediate",
    "Unit, integration, regression and end-to-end testing, mocking and test design.",
    [
      ["Unit tests", 75],
      ["Integration tests", 75],
      ["Mocking", 60],
      ["E2E", 60],
      ["TDD", 60],
      ["Regression testing", 45],
      ["API testing with Postman", 60],
    ]
  ),
  mod(
    "rest-apis",
    "REST APIs",
    "apis",
    "foundation",
    "intermediate",
    "Resource design, HTTP semantics, status codes, versioning, pagination, idempotency, documentation and integration.",
    [
      ["CRUD design", 45],
      ["HTTP methods", 45],
      ["Status codes", 40],
      ["Versioning", 30],
      ["Pagination", 40],
      ["Idempotency", 40],
      ["HATEOAS", 30],
      ["Filtering & sorting", 30],
      ["API documentation (Swagger/OpenAPI)", 60],
      ["API integration", 45],
    ],
    { alsoIn: ["java-backend", "mern-backend"] }
  ),
  mod(
    "debugging",
    "Debugging and Troubleshooting",
    "programming",
    "foundation",
    "intermediate",
    "Reading logs and stack traces, finding root causes and fixing bugs, in development and in production.",
    [
      ["Reading logs", 45],
      ["Stack traces", 45],
      ["Root-cause analysis", 60],
      ["Reproducing bugs", 40],
      ["Production troubleshooting", 60],
      ["Debugging tools", 45],
    ]
  ),
  mod(
    "agile",
    "Agile, Jira & Requirements",
    "programming",
    "foundation",
    "beginner",
    "Sprints, backlogs, estimation, collaboration and turning requirements into tasks.",
    [
      ["Sprints", 40],
      ["Tasks & backlog (Jira)", 60],
      ["Estimation", 45],
      ["Collaboration", 30],
      ["Requirement gathering", 60],
    ]
  ),
  mod(
    "dev-tools",
    "Developer Tools",
    "programming",
    "foundation",
    "beginner",
    "Everyday tooling: the editor, design hand-off and quick UI prototyping.",
    [
      ["VS Code", 45],
      ["Figma basics", 60],
      ["UI prototyping", 60],
    ]
  ),
  mod(
    "dsa",
    "DSA & Problem Solving",
    "dsa",
    "foundation",
    "advanced",
    "Arrays, strings, hashing, trees, graphs, recursion and complexity analysis.",
    [
      ["Complexity", 240],
      ["Arrays & strings", 420],
      ["Hashing", 300],
      ["Trees", 420],
      ["Graphs", 420],
      ["Dynamic programming", 480],
    ]
  ),
  mod(
    "system-design",
    "System Design",
    "system-design",
    "foundation",
    "advanced",
    "Scalability, caching, databases, queues and designing systems end-to-end.",
    [
      ["Scalability", 180],
      ["Caching", 120],
      ["Databases", 180],
      ["Queues", 120],
      ["Load balancing", 100],
      ["Trade-offs", 120],
    ]
  ),
]
