import { defineLesson } from "@/data/lessons/author"

export default defineLesson("docker", {
  slug: "containers",
  title: "Running and managing containers",
  topic: "Containers",
  minutes: 60,
  overview:
    "Run containers with docker run, publish ports, pass environment variables, follow the container lifecycle, read logs, open a shell inside and clean up.",
  objectives: [
    "Explain what a container is and how it differs from a virtual machine",
    "Use docker run with -d, -p, -e, --name and --rm",
    "Follow the lifecycle: create, start, stop, remove",
    "Use ps, logs and exec to inspect running containers",
  ],
  prerequisites: ["lesson.docker.images"],
  sections: [
    {
      kind: "explain",
      heading: "What a container is",
      body: [
        "A **container** is an isolated process (or group of processes) started from an image. It has its own file system built from the image layers plus a thin writable layer, its own process view and its own network interface, but it shares the host's operating system kernel.",
        "That is why containers start in moments and use little memory compared with a **virtual machine**, which runs a full guest operating system on virtualised hardware. Containers are isolated from each other and from the host by default, but they are not a separate machine.",
        "The writable layer of a container is **temporary**: when the container is removed, the data written inside it is gone. Data that must survive belongs in a volume (next lessons).",
      ],
    },
    {
      kind: "code",
      heading: "docker run",
      example: {
        title: "Create and start in one step",
        language: "bash",
        code: "docker run --rm hello-world\n\ndocker run -d --name web -p 8080:80 -e GREETING=hi nginx:1.27\ndocker ps\ndocker logs web\ndocker exec -it web sh\ndocker stop web\ndocker rm web",
        walkthrough: [
          "`docker run IMAGE` creates a container from the image and starts it. If the image is not present locally, Docker pulls it first. `--rm` removes the container automatically when it exits.",
          "`-d` (detach) runs the container in the background and prints its ID. `--name web` gives it a readable name instead of a random one.",
          "`-p 8080:80` publishes container port 80 on host port 8080, so the app is reachable at `localhost:8080`. The order is `host:container`.",
          "`-e GREETING=hi` sets an environment variable inside the container; `--env-file` loads several from a file.",
          "`docker ps` lists running containers (`-a` includes stopped ones), `docker logs` shows the output, and `docker exec -it web sh` opens an interactive shell inside the running container.",
          "`docker stop` asks the main process to stop; `docker rm` deletes the stopped container.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Lifecycle",
      diagram: {
        kind: "flow",
        title: "States of a container",
        steps: [
          { label: "created", detail: "docker create makes it without starting it" },
          { label: "running", detail: "docker start, or docker run which creates and starts" },
          { label: "exited", detail: "the main process ended or docker stop; data in the writable layer is kept until removal" },
          { label: "removed", detail: "docker rm deletes the container and its writable layer" },
        ],
      },
    },
    {
      kind: "code",
      heading: "Observing the lifecycle",
      example: {
        title: "Create, start, inspect",
        language: "bash",
        code: "docker create --name demo -p 8080:80 -e GREETING=hi hello-world\ndocker ps -a --filter name=demo\ndocker inspect demo --format '{{.State.Status}}'\ndocker start -a demo\ndocker inspect demo --format '{{.State.ExitCode}}'\ndocker rm demo",
        walkthrough: [
          "`docker create` prepares the container with its port mapping and environment but does not run it: its status is `created`.",
          "`docker start -a` starts it and attaches to its output. The `hello-world` program prints its message and exits.",
          "After it exits the status is `Exited (0)`. Exit code `0` means success; a non-zero code means the process failed.",
          "`docker inspect` prints the full configuration and state as JSON, and `--format` picks a field. `docker rm` finally deletes it.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "One process per container",
      body: [
        "A container lives as long as its main process (the `CMD` or `ENTRYPOINT`). If that process exits, the container stops. This is why a container that runs a web server stays up, but one that runs a short script exits when the script ends.",
        "Run one concern per container (a web app, a database) and connect them with a network. Logs should go to the standard output and error streams so that `docker logs` can show them.",
        "You can override the image defaults at run time: pass a different command after the image name, or set `--entrypoint`, environment variables and the working directory.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Storing important data inside the container's writable layer.",
          fix: "Use a volume; the writable layer disappears with the container.",
        },
        {
          mistake: "Forgetting -p and wondering why localhost does not respond.",
          fix: "Publish the port: -p hostPort:containerPort.",
        },
        {
          mistake: "Leaving many stopped containers around.",
          fix: "Use --rm for throwaway runs and docker rm for the rest.",
        },
        {
          mistake: "Running multiple unrelated services in one container.",
          fix: "Use separate containers and connect them with a network.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Debugging a failing container",
      scenario:
        "A container starts and exits straight away with status Exited (1).",
      body: [
        "Run `docker ps -a` to see the status, then `docker logs <name>` to read the error output. The last lines usually name the missing file, bad variable or crash.",
        "To explore, start a shell in a fresh container from the same image with `docker run -it --rm --entrypoint sh IMAGE`, or use `docker exec -it` on a running one.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "port-order",
      prompt: "In docker run -p 8080:80, which port is on the host?",
      options: ["8080", "80", "Both"],
      answer: 0,
      explanation:
        "The format is host:container, so 8080 is the host port and 80 is the container port.",
    },
    {
      type: "single",
      id: "container-vs-vm",
      prompt: "What does a container share with the host that a virtual machine does not?",
      options: [
        "The operating system kernel",
        "The same file system as the host",
        "Nothing",
      ],
      answer: 0,
      explanation:
        "Containers use the host kernel, which is why they are lightweight. A VM runs its own guest OS.",
    },
    {
      type: "truefalse",
      id: "writable-layer",
      statement: "Data written to a container's own writable layer is kept after the container is removed.",
      answer: false,
      explanation:
        "The writable layer is deleted with the container. Use a volume to persist data.",
    },
    {
      type: "blank",
      id: "logs-cmd",
      prompt: "To see the output of a container named web, run docker ___ web.",
      answer: "logs",
      explanation:
        "`docker logs` prints what the container wrote to stdout and stderr.",
    },
  ],
  assignment: {
    title: "Run and inspect",
    task: [
      "Run a web server container in the background with a name, a published port and an environment variable. Open it in a browser, read its logs, open a shell inside it and list a directory.",
      "Stop and remove it, then run a throwaway container with --rm. Write down what happened to the data you created inside the first one.",
    ],
    checklist: [
      "The container ran detached with a name and -p",
      "I used logs and exec",
      "The container was stopped and removed",
      "I can explain why data in the writable layer was lost",
    ],
    hints: ["`docker ps -a` shows stopped containers too."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "run-commands",
      title: "Run commands",
      task: [
        "Write the commands to: start nginx:1.27 in the background named site with host port 9000 mapped to container port 80; show its logs; stop it; remove it.",
      ],
      language: "bash",
      starter: "# your commands",
      solution:
        "docker run -d --name site -p 9000:80 nginx:1.27\ndocker logs site\ndocker stop site\ndocker rm site",
      hints: ["Use -d, --name and -p."],
      checklist: [
        "-p maps 9000 to 80 in host:container order",
        "The container is named site",
        "It is stopped before it is removed",
      ],
    },
  ],
  revisionNotes: [
    "Container = isolated process from an image; shares the host kernel",
    "run -d --name -p host:container -e --rm",
    "create, start, stop, rm; ps -a; logs; exec -it; inspect",
    "Writable layer is temporary; the main process defines the container's lifetime",
  ],
  resources: [
    {
      label: "What is a container?",
      url: "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/",
    },
    {
      label: "docker container run",
      url: "https://docs.docker.com/reference/cli/docker/container/run/",
    },
    {
      label: "Overriding container defaults",
      url: "https://docs.docker.com/get-started/docker-concepts/running-containers/overriding-container-defaults/",
    },
    {
      label: "Publishing ports",
      url: "https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/",
    },
  ],
})
