import { defineLesson } from "@/data/lessons/author"

export default defineLesson("docker", {
  slug: "networking",
  title: "Container networking",
  topic: "Networking",
  minutes: 60,
  overview:
    "Connect containers with Docker networks: the default bridge, user-defined bridges with name resolution, published ports, the host and none drivers, and how to inspect a network.",
  objectives: [
    "Describe the bridge, host and none network drivers",
    "Explain why a user-defined bridge is better than the default one",
    "Make two containers talk to each other by name",
    "Publish a port correctly and tell it apart from EXPOSE",
  ],
  prerequisites: ["lesson.docker.containers"],
  sections: [
    {
      kind: "explain",
      heading: "How containers connect",
      body: [
        "Every container can be attached to one or more **networks**. A network gives its containers IP addresses and lets them reach each other. Containers do not know whether their peers are containers or other workloads, and a container only sees the networks it is connected to.",
        "The default driver is **bridge**. When Docker starts, it creates a default bridge network called `bridge`, and new containers join it unless you say otherwise. You can also create your own bridge networks.",
        "Other drivers include **host**, where the container shares the host's network stack and has no isolation of its own, and **none**, which disables networking apart from the loopback interface.",
      ],
    },
    {
      kind: "diagram",
      heading: "Default bridge versus user-defined bridge",
      diagram: {
        kind: "table",
        title: "Why create your own bridge",
        headers: ["", "Default bridge", "User-defined bridge"],
        rows: [
          ["Finding other containers", "By IP address only", "By container name or alias (automatic DNS)"],
          ["Isolation", "All containers without a network setting share it", "Only containers you attach can talk to each other"],
          ["Created by", "Docker at startup", "docker network create"],
        ],
      },
    },
    {
      kind: "code",
      heading: "A user-defined network",
      example: {
        title: "Two containers by name",
        language: "bash",
        code: "docker network create appnet\ndocker network ls\n\ndocker run -d --name db --network appnet -e POSTGRES_PASSWORD=secret postgres:16-alpine\ndocker run -d --name web --network appnet --network-alias site -p 8080:80 nginx:1.27\n\ndocker exec web getent hosts db\ndocker network inspect appnet --format '{{.Driver}} {{.Internal}}'\n\ndocker rm -f web db\ndocker network rm appnet",
        walkthrough: [
          "`docker network create appnet` makes a user-defined network. Without `--driver` it uses `bridge`, which `docker network inspect` shows as `bridge false` (the second value says the network is not internal).",
          "Both containers join `appnet` with `--network`. On a user-defined bridge, containers resolve each other by **name or alias**: from `web`, the hostname `db` (or `site` for web itself) resolves to the right container. An app inside `web` can connect to `db:5432` without any IP address.",
          "`-p 8080:80` publishes a port to the **host**. Other containers on `appnet` can reach `web` on port 80 directly, whether or not it is published; publishing is only for traffic from outside the Docker network.",
          "`docker network ls` shows the built-in networks `bridge`, `host` and `none` plus yours. Remove containers before removing the network.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Ports",
      body: [
        "`EXPOSE 3000` in a Dockerfile only **documents** that the app listens on that port. It does not make it reachable from the host. To publish, use `-p hostPort:containerPort` (or `-P` to publish all exposed ports to random host ports).",
        "Publishing binds the port on the host, so only one container can use a given host port at a time. If two containers both listen on 80 inside, publish them on different host ports, such as `8080:80` and `8081:80`.",
        "Inside a container, `localhost` means the container itself, not the host and not another container. To reach another container, use its name on a shared user-defined network.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Connecting to localhost from one container to reach another.",
          fix: "Use the other container's name on a shared user-defined network.",
        },
        {
          mistake: "Relying on the default bridge and container IP addresses.",
          fix: "Create a user-defined network so names resolve and IPs do not matter.",
        },
        {
          mistake: "Publishing a database port to the host when only other containers need it.",
          fix: "Leave it unpublished and let containers reach it over the network.",
        },
        {
          mistake: "Thinking EXPOSE opens a port.",
          fix: "Publish with -p when running the container.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "App and database",
      scenario:
        "A web app container must connect to a PostgreSQL container, and only the web app should be reachable from your browser.",
      body: [
        "Create a network, run the database on it without publishing any port, and run the app on the same network with `-p 8080:3000`. Configure the app's database host as `db`, the container name.",
        "From your browser you reach the app on port 8080, while the database is reachable only from containers on that network.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "default-driver",
      prompt: "Which network driver is the default for a new container network?",
      options: ["bridge", "host", "none"],
      answer: 0,
      explanation:
        "Containers join the default bridge network unless told otherwise, and user-defined networks default to bridge.",
    },
    {
      type: "single",
      id: "name-resolution",
      prompt: "Where do containers resolve each other by name?",
      options: [
        "On a user-defined bridge network",
        "Only on the default bridge network",
        "Never; only by IP",
      ],
      answer: 0,
      explanation:
        "User-defined bridges provide automatic DNS resolution by container name or alias.",
    },
    {
      type: "truefalse",
      id: "localhost-meaning",
      statement: "Inside a container, localhost refers to the container itself.",
      answer: true,
      explanation:
        "To reach another container use its name; to reach the host use a published port or host networking.",
    },
    {
      type: "blank",
      id: "publish-flag",
      prompt: "To make container port 80 reachable on host port 8080, run with -___ 8080:80.",
      answer: "p",
      accepted: ["--publish"],
      explanation:
        "`-p hostPort:containerPort` (or --publish) publishes a port.",
    },
  ],
  assignment: {
    title: "A two-container network",
    task: [
      "Create a user-defined network. Run a database container and a second container (any image with a shell) on it, and show that the second can resolve the database by name.",
      "Publish one port from one container, check it from the host, and explain in two sentences why the database port needs no publishing.",
    ],
    checklist: [
      "A user-defined network was created",
      "Name resolution was demonstrated with exec",
      "Only one port is published",
      "Network and containers were cleaned up",
    ],
    hints: ["`docker exec <name> getent hosts <other>` works on many images."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "network-commands",
      title: "Network commands",
      task: [
        "Write commands to: create a network named shop; run redis:7-alpine as cache on it; run nginx:1.27 as proxy on it with host port 9090 mapped to container port 80.",
      ],
      language: "bash",
      starter: "# your commands",
      solution:
        "docker network create shop\ndocker run -d --name cache --network shop redis:7-alpine\ndocker run -d --name proxy --network shop -p 9090:80 nginx:1.27",
      hints: ["Use --network on both containers."],
      checklist: [
        "The network is created first",
        "Both containers use --network shop",
        "Only the proxy publishes a port",
      ],
    },
  ],
  revisionNotes: [
    "Drivers: bridge (default), host, none",
    "User-defined bridge = DNS by name or alias; default bridge = IP only",
    "-p host:container publishes; EXPOSE only documents; localhost is the container itself",
    "Do not publish ports that only other containers need",
  ],
  resources: [
    {
      label: "Networking overview",
      url: "https://docs.docker.com/engine/network/",
    },
    {
      label: "Bridge network driver",
      url: "https://docs.docker.com/engine/network/drivers/bridge/",
    },
    {
      label: "Publishing ports",
      url: "https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/",
    },
  ],
})
