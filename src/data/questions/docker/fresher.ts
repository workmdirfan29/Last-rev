import { defineQuestions } from "../author"
import { q } from "../compact"

const D = "https://docs.docker.com"
const CON = `${D}/get-started/docker-concepts`

export default defineQuestions("docker", "fresher", [
  q({
    slug: "what-is-docker-and-why",
    topic: "Containers",
    d: "easy",
    title: "What is Docker and what problem does it solve?",
    kw: [
      "docker",
      "containerization",
      "it works on my machine",
      "portability",
      "packaging",
    ],
    intent:
      "A foundation question: checks you can explain containers in plain words.",
    short:
      "Docker is a platform for building, shipping and running applications in containers. A container packages an application together with its runtime, libraries and configuration, so it runs the same way on a laptop, a test server and production. That removes the classic 'it works on my machine' problem caused by different installed versions and settings. Containers start quickly and let you run many isolated applications on one host.",
    detail: [
      "The same image can be run anywhere that has a container runtime.",
      "Docker separates what you build (an image) from what runs (a container).",
      "It makes environments reproducible and disposable.",
    ],
    ex: "A team ships its Node API as an image; the same image runs on the developer's laptop, in CI and on the server.",
    mistakes: [
      "Thinking Docker is a virtual machine.",
      "Installing dependencies by hand on servers instead of in the image.",
    ],
    follow: ["How is a container different from a virtual machine?"],
    points: [
      "Packages app plus dependencies",
      "Same behaviour everywhere",
      "Image builds, container runs",
      "Fast and disposable",
    ],
    notes: ["Package once, run anywhere."],
    src: [
      ["Docker: What is Docker?", `${D}/get-started/docker-overview/`],
      [
        "Docker: What is a container?",
        `${CON}/the-basics/what-is-a-container/`,
      ],
    ],
  }),
  q({
    slug: "container-vs-virtual-machine",
    topic: "Containers",
    d: "easy",
    title: "What is the difference between a container and a virtual machine?",
    kw: [
      "container",
      "virtual machine",
      "hypervisor",
      "shared kernel",
      "isolation",
    ],
    intent: "Checks you understand the isolation model and its trade-offs.",
    short:
      "A virtual machine includes a full guest operating system with its own kernel, running on a hypervisor that emulates hardware, so each VM is large and slow to start. A container is an isolated process that shares the host's operating system kernel and carries only the application and its dependencies, so it is much smaller and starts in seconds or less. The trade-off is weaker isolation than a VM, since containers share the kernel, which is why security hardening matters.",
    detail: [
      "Linux containers use kernel features such as namespaces and cgroups for isolation and resource limits.",
      "A container image still needs to match the host kernel type, such as Linux.",
      "Containers and VMs are often combined, with containers running inside VMs in the cloud.",
    ],
    ex: "One server runs dozens of small containers, whereas the same server could host only a few full VMs.",
    mistakes: [
      "Assuming containers are fully isolated like VMs.",
      "Putting an entire OS inside an image without need.",
    ],
    follow: ["What Linux features provide isolation?"],
    points: [
      "VM: own kernel on a hypervisor",
      "Container: process sharing the host kernel",
      "Containers are lighter and faster",
      "Weaker isolation than VMs",
    ],
    notes: ["Shared kernel is the key difference."],
    src: [
      [
        "Docker: What is a container?",
        `${CON}/the-basics/what-is-a-container/`,
      ],
      ["Docker: Docker overview", `${D}/get-started/docker-overview/`],
    ],
  }),
  q({
    slug: "image-vs-container",
    topic: "Images",
    d: "easy",
    title: "What is the difference between a Docker image and a container?",
    kw: [
      "image",
      "container",
      "template",
      "running instance",
      "writable layer",
    ],
    intent: "The most basic Docker distinction; checks you do not mix them up.",
    short:
      "An image is a read-only template that contains the application, its dependencies and instructions for running it. A container is a running instance of an image: Docker adds a thin writable layer on top and starts a process. Many containers can be started from one image, each isolated from the others. Changes made inside a container live in its writable layer and are lost when the container is removed, unless stored in a volume.",
    detail: [
      "Images are built once and are immutable; containers are created, started, stopped and removed.",
      "Images are stored in registries and identified by name and tag.",
      "Think of an image as a class and a container as an object.",
    ],
    ex: "`docker run nginx` creates and starts a container from the `nginx` image; running it twice gives two separate containers.",
    mistakes: [
      "Editing files in a running container and expecting them to persist.",
      "Calling a running container an image.",
    ],
    follow: ["What happens to data in a container when it is removed?"],
    points: [
      "Image = read-only template",
      "Container = running instance",
      "Writable layer is temporary",
      "Many containers from one image",
    ],
    notes: ["Image is the recipe, container is the dish."],
    src: [
      ["Docker: What is an image?", `${CON}/the-basics/what-is-an-image/`],
      [
        "Docker: What is a container?",
        `${CON}/the-basics/what-is-a-container/`,
      ],
    ],
  }),
  q({
    slug: "image-layers-and-caching",
    topic: "Images",
    d: "medium",
    title: "What are image layers and how does the build cache work?",
    kw: [
      "image layers",
      "build cache",
      "dockerfile order",
      "layer invalidation",
      "package.json",
    ],
    intent: "Checks you can order Dockerfile instructions for fast builds.",
    short:
      "An image is made of layers, one for each filesystem-changing instruction in the Dockerfile. Docker caches each layer, and on rebuild reuses a cached layer if the instruction and its inputs are unchanged. Once a layer changes, all the layers after it are rebuilt. So put rarely changing steps first and frequently changing ones last: copy `package.json` and install dependencies before copying the source code, so editing code does not trigger a reinstall of all dependencies.",
    detail: [
      "Layers are shared between images, which saves disk space and download time.",
      "A `.dockerignore` file keeps unneeded files out of the build context and avoids cache invalidation.",
      "Each `RUN`, `COPY` and `ADD` creates a layer.",
    ],
    ex: "A Node image reinstalls dependencies only when `package.json` or the lockfile changes, so most rebuilds take seconds.",
    code: [
      [
        "Cache-friendly order",
        "dockerfile",
        `FROM node:22-slim\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD ["node", "server.js"]`,
        [
          "Dependency files are copied first and installed.",
          "Source is copied after, so code changes reuse the install layer.",
        ],
      ],
    ],
    mistakes: [
      "Copying the whole source before installing dependencies.",
      "No .dockerignore, so node_modules and .git enter the context.",
    ],
    follow: ["Why does changing one layer rebuild the ones after it?"],
    points: [
      "One layer per instruction",
      "Unchanged layers come from cache",
      "A change invalidates later layers",
      "Stable steps first",
    ],
    notes: ["Order by how often it changes."],
    src: [
      [
        "Docker: Understanding image layers",
        `${CON}/building-images/understanding-image-layers/`,
      ],
      [
        "Docker: Using the build cache",
        `${CON}/building-images/using-the-build-cache/`,
      ],
    ],
  }),
  q({
    slug: "dockerfile-basics",
    topic: "Images",
    d: "easy",
    title: "What are the main Dockerfile instructions?",
    kw: ["dockerfile", "FROM", "RUN", "COPY", "CMD", "WORKDIR"],
    intent: "Checks you can read and write a simple Dockerfile.",
    short:
      "A Dockerfile is a text file of instructions to build an image. `FROM` sets the base image, `WORKDIR` sets the working directory, `COPY` copies files from the build context into the image, `RUN` executes a command at build time such as installing dependencies, `ENV` sets environment variables, `EXPOSE` documents the listening port, and `CMD` (or `ENTRYPOINT`) defines the default command run when a container starts. You build it with `docker build -t name:tag .`.",
    detail: [
      "Instructions run in order, each creating a layer.",
      "`CMD` can be overridden at `docker run`; `ENTRYPOINT` sets the main executable.",
      'Use exec form `CMD ["node", "server.js"]` rather than shell form.',
    ],
    ex: "A small Node API image is defined in about eight lines and built with one command.",
    code: [
      [
        "A Node API Dockerfile",
        "dockerfile",
        `FROM node:22-slim\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]`,
        [
          "`FROM` picks the base.",
          "`RUN` installs dependencies at build time.",
          "`CMD` starts the app at run time.",
        ],
      ],
    ],
    mistakes: [
      "Using RUN to start the app.",
      "Using the latest tag for the base image.",
    ],
    follow: ["What is the difference between RUN and CMD?"],
    points: [
      "FROM, WORKDIR, COPY, RUN",
      "ENV, EXPOSE",
      "CMD is the default start command",
      "Build with docker build -t",
    ],
    notes: ["RUN at build, CMD at run."],
    src: [
      [
        "Docker: Writing a Dockerfile",
        `${CON}/building-images/writing-a-dockerfile/`,
      ],
      ["Docker: Dockerfile reference", `${D}/reference/dockerfile/`],
    ],
  }),
  q({
    slug: "cmd-vs-entrypoint-and-exec-form",
    topic: "Images",
    d: "medium",
    title:
      "What is the difference between CMD and ENTRYPOINT, and why use the exec form?",
    kw: ["CMD", "ENTRYPOINT", "exec form", "shell form", "signals"],
    intent: "Checks you know how containers start and stop correctly.",
    short:
      '`ENTRYPOINT` defines the executable that always runs when the container starts, and `CMD` provides default arguments (or the default command if there is no entrypoint) that can be overridden on the `docker run` command line. The exec form, a JSON array like `CMD ["node", "server.js"]`, runs the program directly as the main process. The shell form runs it inside `/bin/sh -c`, so the app is not PID 1 and may not receive signals such as SIGTERM, which delays or breaks graceful shutdown.',
    detail: [
      "Only the last `CMD` in a Dockerfile takes effect.",
      "`docker stop` sends SIGTERM and then SIGKILL after a timeout.",
      "Node apps should handle SIGTERM to close connections gracefully.",
    ],
    ex: 'An image with `ENTRYPOINT ["node"]` and `CMD ["server.js"]` can be run with another script by overriding only the command.',
    code: [
      [
        "Exec form",
        "dockerfile",
        `ENTRYPOINT ["node"]\nCMD ["server.js"]`,
        [
          "The entrypoint is fixed.",
          "CMD gives the default argument that can be replaced.",
        ],
      ],
    ],
    mistakes: [
      "Shell form that hides the app from signals.",
      "Several CMD lines expecting all to run.",
    ],
    follow: ["What does docker stop send first?"],
    points: [
      "ENTRYPOINT is the executable",
      "CMD gives defaults, overridable",
      "Exec form makes the app PID 1",
      "Shell form can swallow signals",
    ],
    notes: ["Prefer exec form."],
    src: [
      [
        "Docker: Dockerfile reference (CMD, ENTRYPOINT)",
        `${D}/reference/dockerfile/`,
      ],
    ],
  }),
  q({
    slug: "dockerignore-and-build-context",
    topic: "Images",
    d: "easy",
    title: "What is the build context and what does .dockerignore do?",
    kw: [
      ".dockerignore",
      "build context",
      "node_modules",
      "image size",
      "secrets",
    ],
    intent: "Checks you keep builds small, fast and free of secrets.",
    short:
      "The build context is the set of files, usually the directory you pass to `docker build`, that is sent to the builder and available to `COPY`. A `.dockerignore` file lists patterns of files and folders to exclude from it, such as `node_modules`, `.git`, `.env` and logs. This makes the context smaller so builds are faster, avoids needlessly invalidating the cache, keeps images small, and stops secrets or local files from being copied into the image by mistake.",
    detail: [
      "The syntax is similar to `.gitignore`.",
      "`COPY . .` copies everything in the context that is not ignored.",
      "Dependencies are installed fresh inside the image, not copied from the host.",
    ],
    ex: "Ignoring `node_modules` and `.env` stops a 400 MB folder and local secrets from being sent to the build.",
    code: [
      [
        ".dockerignore",
        "text",
        `node_modules\n.git\n.env\n*.log\ndist`,
        [
          "Heavy and sensitive paths are excluded.",
          "`COPY . .` now copies only what is needed.",
        ],
      ],
    ],
    mistakes: [
      "No .dockerignore, so .env ends up in the image.",
      "Copying host node_modules over the installed ones.",
    ],
    follow: ["Why exclude .env from the context?"],
    points: [
      "Context = files sent to the builder",
      ".dockerignore excludes patterns",
      "Faster builds, smaller images",
      "Keeps secrets out",
    ],
    notes: ["Always add a .dockerignore."],
    src: [["Docker: Build context", `${D}/build/concepts/context/`]],
  }),
  q({
    slug: "image-tags-and-registries",
    topic: "Images",
    d: "easy",
    title:
      "What are image tags and registries, and why avoid the latest tag in production?",
    kw: ["image tag", "registry", "docker hub", "latest tag", "digest"],
    intent: "Checks you can name, publish and pin images safely.",
    short:
      "An image name has the form `registry/repository:tag`. A tag such as `1.4.2` or `22-slim` labels a version, and a registry such as Docker Hub stores and distributes images, so you `docker push` after building and others `docker pull`. `latest` is only a default tag, not a guarantee of the newest or stable version, and it can change under you. Pin specific version tags, or even the image digest, in production so deployments are repeatable and rollbacks are possible.",
    detail: [
      "`docker tag` gives an image another name without copying it.",
      "A digest, such as `sha256:...`, identifies exact image content.",
      "Private registries need `docker login`.",
    ],
    ex: "The deploy uses `myapp:1.8.0`, so rolling back means redeploying `myapp:1.7.3`.",
    mistakes: [
      "Deploying latest and getting different versions on different servers.",
      "Overwriting a version tag with new content.",
    ],
    follow: ["What is an image digest?"],
    points: [
      "registry/repository:tag",
      "Push and pull",
      "latest is just a tag",
      "Pin versions for repeatability",
    ],
    notes: ["Pin versions; avoid floating tags."],
    src: [
      ["Docker: What is a registry?", `${CON}/the-basics/what-is-a-registry/`],
      [
        "Docker: Build, tag and publish an image",
        `${CON}/building-images/build-tag-and-publish-an-image/`,
      ],
    ],
  }),
  q({
    slug: "run-container-basic-flags",
    topic: "Containers",
    d: "easy",
    title: "What do the common docker run flags do?",
    kw: ["docker run", "-d", "-p", "-e", "--name", "--rm"],
    intent: "Checks you can start a container with the usual options.",
    short:
      "`docker run` creates and starts a container from an image. `-d` runs it in the background (detached), `-p 8080:80` publishes container port 80 on host port 8080, `-e KEY=value` sets an environment variable, `--name` gives it a name, `-v` mounts a volume or directory, `--rm` removes the container when it exits, and `-it` attaches an interactive terminal. The image name and optional command come last.",
    detail: [
      "Without `-p`, a service inside a container is not reachable from outside the host.",
      "Use `docker ps` to list running containers and `docker logs` to read output.",
      "`--restart` sets a restart policy for long-running services.",
    ],
    ex: "`docker run -d --name web -p 8080:80 nginx` serves nginx at port 8080 on the host.",
    code: [
      [
        "Run nginx",
        "bash",
        `docker run -d --name web -p 8080:80 nginx\ndocker ps\ndocker logs web\ndocker stop web && docker rm web`,
        [
          "Start in the background and publish a port.",
          "Inspect running containers and logs.",
          "Stop and remove it.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting -p and wondering why the app is unreachable.",
      "Leaving stopped containers piling up.",
    ],
    follow: ["What does -p 8080:80 mean?"],
    points: [
      "-d detached",
      "-p host:container",
      "-e environment variable",
      "--rm removes on exit",
    ],
    notes: ["-p host:container."],
    src: [
      [
        "Docker: Publishing and exposing ports",
        `${CON}/running-containers/publishing-ports/`,
      ],
      [
        "Docker: docker container run",
        `${D}/reference/cli/docker/container/run/`,
      ],
    ],
  }),
  q({
    slug: "container-lifecycle-and-debugging",
    topic: "Containers",
    d: "medium",
    title: "How do you inspect and debug a running container?",
    kw: [
      "docker logs",
      "docker exec",
      "docker ps",
      "docker inspect",
      "exit code",
    ],
    intent: "Checks you have a practical debugging workflow.",
    short:
      "Use `docker ps -a` to see containers and their status, including ones that exited. `docker logs -f name` shows the application's standard output and error, which is the first place to look. `docker exec -it name sh` opens a shell inside a running container to check files and environment, and `docker inspect` shows its configuration, networks and mounts. A container that exits immediately usually means its main process ended or crashed, so check the logs and exit code.",
    detail: [
      "Containers live only while their main process runs.",
      "`docker stats` shows live CPU and memory use.",
      "Write logs to stdout and stderr so Docker can collect them.",
    ],
    ex: "An API container keeps restarting; `docker logs` shows a missing environment variable, which is then added.",
    code: [
      [
        "Debugging commands",
        "bash",
        `docker ps -a\ndocker logs -f api\ndocker exec -it api sh\ndocker inspect api`,
        [
          "`ps -a` includes stopped containers.",
          "`logs -f` follows output.",
          "`exec` opens a shell inside.",
        ],
      ],
    ],
    mistakes: [
      "Logging to files inside the container only.",
      "Not checking exit codes of crashed containers.",
    ],
    follow: ["Why might a container exit immediately?"],
    points: [
      "docker ps -a, logs, exec, inspect",
      "Main process defines the lifetime",
      "Log to stdout/stderr",
      "Check exit codes",
    ],
    notes: ["Logs first, then exec."],
    src: [
      [
        "Docker: docker container logs",
        `${D}/reference/cli/docker/container/logs/`,
      ],
      [
        "Docker: docker container exec",
        `${D}/reference/cli/docker/container/exec/`,
      ],
    ],
  }),
  q({
    slug: "env-vars-and-secrets-in-containers",
    topic: "Containers",
    d: "medium",
    title: "How should configuration and secrets be passed to a container?",
    kw: [
      "environment variables",
      "ARG vs ENV",
      "secrets",
      "env_file",
      "image history",
    ],
    intent: "Checks you keep config out of images and secrets out of layers.",
    short:
      "Keep configuration out of the image and supply it at run time with `-e`, `--env-file` or the `environment` and `env_file` keys in Compose, so the same image works in every environment. `ARG` is available only at build time, while `ENV` persists in the image and the running container. Never bake secrets into an image with `ENV`, `ARG` or `COPY`, because they remain visible in the image layers and history. Use runtime injection, a secrets manager, or build secrets for values needed only during the build.",
    detail: [
      "Do not commit `.env` files to git and list them in `.dockerignore`.",
      "Anyone who can pull the image can read what is inside its layers.",
      "Orchestrators provide their own secret mechanisms.",
    ],
    ex: "The same image runs in staging and production with different `DATABASE_URL` values passed at start.",
    mistakes: [
      "Putting passwords in the Dockerfile.",
      "Copying .env into the image.",
    ],
    follow: ["What is the difference between ARG and ENV?"],
    points: [
      "Inject config at run time",
      "ARG build-time, ENV persists",
      "No secrets in layers",
      "Use env files and secret managers",
    ],
    notes: ["Image holds code, environment holds config."],
    src: [
      [
        "Docker: Overriding container defaults",
        `${CON}/running-containers/overriding-container-defaults/`,
      ],
      ["Docker: Build secrets", `${D}/build/building/secrets/`],
    ],
  }),
  q({
    slug: "run-as-non-root-and-small-images",
    topic: "Containers",
    d: "medium",
    title:
      "What are the key Dockerfile best practices for security and image size?",
    kw: [
      "non-root user",
      "slim base image",
      "pin versions",
      "best practices",
      "attack surface",
    ],
    intent: "Checks you build secure, lean images.",
    short:
      "Use a small, trusted base image such as a slim or Alpine variant to reduce size and attack surface, and pin its version. Run the application as a non-root user with the `USER` instruction so a compromise has fewer privileges. Install only what is needed, combine related `RUN` steps, and use multi-stage builds so compilers and build tools stay out of the final image. Use `.dockerignore`, keep one main process per container, and rebuild regularly to pick up security fixes.",
    detail: [
      "Scan images for known vulnerabilities as part of CI.",
      "Prefer official or verified images from trusted publishers.",
      "Add a `HEALTHCHECK` so the platform knows whether the app is healthy.",
    ],
    ex: "The Node image switches to the built-in `node` user before starting the app.",
    code: [
      [
        "Drop root",
        "dockerfile",
        `FROM node:22-slim\nWORKDIR /app\nCOPY --chown=node:node . .\nUSER node\nCMD ["node", "server.js"]`,
        [
          "Files are owned by the non-root user.",
          "`USER node` runs the app without root.",
        ],
      ],
    ],
    mistakes: [
      "Running everything as root.",
      "Full OS images with compilers in production.",
    ],
    follow: ["Why does a smaller image help security?"],
    points: [
      "Small pinned base images",
      "Non-root USER",
      "Multi-stage to drop build tools",
      "Scan and rebuild regularly",
    ],
    notes: ["Small, pinned, non-root."],
    src: [
      [
        "Docker: Building best practices",
        `${D}/build/building/best-practices/`,
      ],
    ],
  }),
  q({
    slug: "resource-limits-and-restart-policies",
    topic: "Containers",
    d: "medium",
    title:
      "How do you limit container resources and make containers restart automatically?",
    kw: ["memory limit", "cpus", "restart policy", "unless-stopped", "oom"],
    intent:
      "Checks you can keep one container from starving the host and recover from crashes.",
    short:
      "By default a container can use as much of the host's CPU and memory as the kernel allows. Set limits with `--memory` and `--cpus` on `docker run`, or the equivalents in Compose, so a misbehaving container cannot take the whole host down; exceeding the memory limit gets the process killed. For recovery, use a restart policy such as `--restart unless-stopped`, which restarts a container if it exits or when Docker starts, unless you stopped it manually. Restart policies complement, not replace, fixing the crash.",
    detail: [
      "Other policies are `no`, `on-failure` and `always`.",
      "Health checks help detect an app that is running but broken.",
      "Orchestrators such as Kubernetes provide richer restart and scaling behaviour.",
    ],
    ex: "A production API runs with `--memory 512m --restart unless-stopped`.",
    code: [
      [
        "Limits and restart",
        "bash",
        `docker run -d --name api \\\n  --memory 512m --cpus 1 \\\n  --restart unless-stopped \\\n  myapp:1.8.0`,
        [
          "Memory and CPU are capped.",
          "The container restarts after a crash or reboot.",
        ],
      ],
    ],
    mistakes: [
      "No limits on shared hosts.",
      "Using restart policy to hide a crash loop.",
    ],
    follow: ["What happens when a container exceeds its memory limit?"],
    points: [
      "--memory and --cpus",
      "Exceeding memory kills the process",
      "--restart unless-stopped",
      "Fix the crash too",
    ],
    notes: ["Cap resources; restart on failure."],
    src: [
      [
        "Docker: Resource constraints",
        `${D}/engine/containers/resource_constraints/`,
      ],
      [
        "Docker: Start containers automatically",
        `${D}/engine/containers/start-containers-automatically/`,
      ],
    ],
  }),
  q({
    slug: "why-volumes-and-persistence",
    topic: "Volumes",
    d: "easy",
    title: "Why do containers need volumes?",
    kw: [
      "volumes",
      "persistent data",
      "ephemeral container",
      "named volume",
      "database data",
    ],
    intent:
      "Checks you understand that container storage is temporary by default.",
    short:
      "A container's writable layer is deleted when the container is removed, so data written there is lost. Volumes are storage managed by Docker that live outside the container's lifecycle, so data survives when containers are stopped, replaced or upgraded. You mount a named volume into a path in the container, for example a database's data directory, and the same volume can be shared between containers. Use volumes for anything that must persist, such as database files and uploads.",
    detail: [
      "Create one with `docker volume create` or let `-v name:/path` create it.",
      "Volumes are the preferred mechanism for persisting data generated by containers.",
      "Back up volumes like any other data.",
    ],
    ex: "A Postgres container stores its data in a named volume, so upgrading the image does not delete the database.",
    code: [
      [
        "Named volume for a database",
        "bash",
        `docker run -d --name db \\\n  -e POSTGRES_PASSWORD=secret \\\n  -v pgdata:/var/lib/postgresql/data \\\n  postgres:16`,
        [
          "`pgdata` is a named volume.",
          "It is mounted at the database's data directory.",
        ],
      ],
    ],
    mistakes: [
      "Storing database files in the container layer.",
      "Deleting volumes with docker volume prune by accident.",
    ],
    follow: ["What happens to the volume when the container is removed?"],
    points: [
      "Container layer is temporary",
      "Volumes outlive containers",
      "Managed by Docker",
      "Use for databases and uploads",
    ],
    notes: ["Persist data outside the container."],
    src: [
      [
        "Docker: Persisting container data",
        `${CON}/running-containers/persisting-container-data/`,
      ],
      ["Docker: Volumes", `${D}/engine/storage/volumes/`],
    ],
  }),
  q({
    slug: "volume-vs-bind-mount",
    topic: "Volumes",
    d: "medium",
    title: "What is the difference between a named volume and a bind mount?",
    kw: [
      "bind mount",
      "named volume",
      "tmpfs",
      "host path",
      "development workflow",
    ],
    intent: "Checks you can choose the right mount type.",
    short:
      "A named volume is created and managed by Docker in its own storage area, so it is portable, easy to back up and independent of the host's directory layout. A bind mount maps a specific host file or directory into the container, so both see the same files. Bind mounts are handy in development, for example mounting your source code so changes appear instantly, but they depend on the host path and permissions. `tmpfs` mounts keep data in memory only.",
    detail: [
      "Use volumes for persistent production data.",
      "Bind-mount permissions can cause file ownership issues between host and container.",
      "Mount read-only with `:ro` when the container should not change the files.",
    ],
    ex: "In development the project folder is bind-mounted into a Node container with live reload, while the database uses a named volume.",
    code: [
      [
        "Both mount types",
        "bash",
        `# named volume\ndocker run -v appdata:/data myapp\n# bind mount of the current directory\ndocker run -v "$(pwd)":/app myapp`,
        [
          "The first uses Docker-managed storage.",
          "The second maps a host directory.",
        ],
      ],
    ],
    mistakes: [
      "Bind mounting production data paths without thinking about permissions.",
      "Using bind mounts where a volume would be portable.",
    ],
    follow: ["When is a bind mount the better choice?"],
    points: [
      "Volume: Docker-managed",
      "Bind mount: host path",
      "Bind mounts for development",
      "Volumes for persistent data",
    ],
    notes: ["Volume for data, bind mount for source."],
    src: [
      ["Docker: Volumes", `${D}/engine/storage/volumes/`],
      ["Docker: Bind mounts", `${D}/engine/storage/bind-mounts/`],
    ],
  }),
  q({
    slug: "docker-bridge-networks-and-dns",
    topic: "Networking",
    d: "medium",
    title: "How do containers talk to each other on a user-defined network?",
    kw: [
      "bridge network",
      "user-defined network",
      "container dns",
      "service name",
      "docker network create",
    ],
    intent: "Checks you know containers reach each other by name.",
    short:
      "By default containers attach to the default bridge network. On a user-defined bridge network, which you create with `docker network create`, containers can reach each other by container name or service name through Docker's built-in DNS, and they are isolated from containers on other networks. So an API container connects to the database at `db:5432` instead of an IP address. Docker Compose creates such a network for your project automatically.",
    detail: [
      "Container IPs change, so use names, not addresses.",
      "Only containers on the same network can talk to each other.",
      "Ports need to be published to the host only for access from outside the Docker network.",
    ],
    ex: "The API uses `postgres://user:pass@db:5432/app` where `db` is the database service name.",
    code: [
      [
        "Create a network",
        "bash",
        `docker network create appnet\ndocker run -d --name db --network appnet postgres:16\ndocker run -d --name api --network appnet -p 3000:3000 myapp`,
        ["Both containers join `appnet`.", "`api` can reach `db` by name."],
      ],
    ],
    mistakes: [
      "Hard-coding container IPs.",
      "Publishing database ports to the world when only the API needs it.",
    ],
    follow: ["Why use names instead of IP addresses?"],
    points: [
      "User-defined bridge gives DNS by name",
      "Isolated between networks",
      "IPs are not stable",
      "Compose creates a network for you",
    ],
    notes: ["Reach containers by name."],
    src: [
      ["Docker: Networking", `${D}/engine/network/`],
      ["Docker: Bridge network driver", `${D}/engine/network/drivers/bridge/`],
    ],
  }),
  q({
    slug: "port-publishing-and-localhost-pitfall",
    topic: "Networking",
    d: "medium",
    title:
      "How does port publishing work, and why doesn't localhost reach another container?",
    kw: [
      "port publishing",
      "-p",
      "expose",
      "localhost in container",
      "host.docker.internal",
    ],
    intent: "Checks you understand container network namespaces.",
    short:
      "Container ports are not reachable from outside by default. Publishing with `-p HOST:CONTAINER` forwards a host port to a container port, and `EXPOSE` in a Dockerfile only documents the port; it does not publish it. Inside a container, `localhost` refers to that container itself, not the host and not other containers, so an app in one container cannot reach a database on `localhost`. Connect to other containers by service name on a shared network, and publish ports only for what must be reachable from outside.",
    detail: [
      "Binding the app to `0.0.0.0` inside the container is needed for published ports to work, not only to 127.0.0.1.",
      "Bind published ports to `127.0.0.1:8080:80` to limit access to the host itself.",
      "Reaching a service running on the host needs a special host name or host networking.",
    ],
    ex: "An API container fails with 'connection refused' to `localhost:5432` because the database is in another container; changing the host to `db` fixes it.",
    mistakes: [
      "Using localhost to reach another container.",
      "App listening only on 127.0.0.1 inside the container.",
    ],
    follow: ["What does EXPOSE actually do?"],
    points: [
      "-p publishes host to container port",
      "EXPOSE only documents",
      "localhost is the container itself",
      "Listen on 0.0.0.0, use service names",
    ],
    notes: ["localhost means this container."],
    src: [
      [
        "Docker: Publishing and exposing ports",
        `${CON}/running-containers/publishing-ports/`,
      ],
      [
        "Docker: Port publishing and mapping",
        `${D}/engine/network/port-publishing/`,
      ],
    ],
  }),
  q({
    slug: "compose-what-and-why",
    topic: "Compose",
    d: "easy",
    title: "What is Docker Compose and why use it?",
    kw: [
      "docker compose",
      "compose.yaml",
      "multi-container",
      "services",
      "docker compose up",
    ],
    intent: "Checks you can run a multi-container app from one file.",
    short:
      "Docker Compose defines and runs multi-container applications from a single YAML file, usually `compose.yaml`. It lists services (for example the API, the database and a cache) with their images or build instructions, ports, environment, volumes and networks. `docker compose up -d` creates the network, volumes and containers and starts them, and `docker compose down` removes them. It replaces long chains of `docker run` commands and makes a whole local environment reproducible with one command.",
    detail: [
      "Compose creates a default network where services reach each other by service name.",
      "The file can be committed to git alongside the code.",
      "Modern Docker uses the `docker compose` command (with a space).",
    ],
    ex: "New teammates run `docker compose up` and get the API, Postgres and Redis running locally.",
    code: [
      [
        "A small compose.yaml",
        "yaml",
        `services:\n  api:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      DATABASE_URL: postgres://app:secret@db:5432/app\n    depends_on:\n      - db\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: secret\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\nvolumes:\n  pgdata:`,
        [
          "Two services share a default network.",
          "The API reaches the database at host `db`.",
          "A named volume persists the data.",
        ],
      ],
    ],
    mistakes: [
      "Treating compose as a production orchestrator for large systems.",
      "Committing real passwords in the file.",
    ],
    follow: ["How do services find each other?"],
    points: [
      "One YAML file for many containers",
      "Services, volumes, networks",
      "up -d and down",
      "Services reach each other by name",
    ],
    notes: ["One command for the whole stack."],
    src: [
      [
        "Docker: What is Docker Compose?",
        `${CON}/the-basics/what-is-docker-compose/`,
      ],
      ["Docker: Compose", `${D}/compose/`],
    ],
  }),
  q({
    slug: "compose-depends-on-healthcheck",
    topic: "Compose",
    d: "hard",
    title: "Does depends_on wait until the database is ready?",
    kw: [
      "depends_on",
      "healthcheck",
      "service_healthy",
      "startup order",
      "readiness",
    ],
    intent: "Checks you know the difference between started and ready.",
    short:
      "By default `depends_on` only controls start order: it starts the dependency container first but does not wait for the software inside to be ready, so an API can still fail to connect to a database that is starting up. To wait for readiness, define a `healthcheck` on the dependency and use `depends_on` with `condition: service_healthy`. Applications should also retry their connections, since services can restart or start slowly at any time.",
    detail: [
      "A health check is a command Docker runs periodically to test the service.",
      "Compose also offers `service_started` and `service_completed_successfully` conditions.",
      "Retry with backoff in the app is the most robust approach.",
    ],
    ex: "The API waits for Postgres to report healthy using `pg_isready` before it starts.",
    code: [
      [
        "Wait for healthy",
        "yaml",
        `services:\n  db:\n    image: postgres:16\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U app"]\n      interval: 5s\n      retries: 10\n  api:\n    build: .\n    depends_on:\n      db:\n        condition: service_healthy`,
        [
          "The health check tests Postgres readiness.",
          "`service_healthy` makes the API wait for it.",
        ],
      ],
    ],
    mistakes: ["Assuming started means ready.", "No retry logic in the app."],
    follow: ["What does a health check run?"],
    points: [
      "depends_on controls order",
      "Not readiness by default",
      "healthcheck plus service_healthy",
      "Apps should retry",
    ],
    notes: ["Started is not ready."],
    src: [
      [
        "Docker: Control startup order in Compose",
        `${D}/compose/how-tos/startup-order/`,
      ],
      [
        "Docker: Compose services reference",
        `${D}/reference/compose-file/services/`,
      ],
    ],
  }),
  q({
    slug: "compose-env-profiles-and-dev-prod",
    topic: "Compose",
    d: "medium",
    title:
      "How do you manage environment variables and different environments in Compose?",
    kw: [
      "env_file",
      "environment",
      "compose override",
      "profiles",
      "dev vs prod",
    ],
    intent: "Checks you can keep dev and production settings separate.",
    short:
      "Set variables with the `environment` key or load them from a file with `env_file`, and use `${VAR}` interpolation to read values from the shell or a `.env` file. Keep secrets out of the committed file. For differences between environments, layer files: a base `compose.yaml` plus an override such as `compose.override.yaml` (applied automatically) or a `-f` flag with a production file. Profiles let you mark optional services, like a debugging tool, that only start when requested.",
    detail: [
      "Development files often add bind mounts and published database ports that production should not have.",
      "Use `docker compose config` to see the final merged configuration.",
      "Production often uses a platform like Kubernetes or a managed service instead of Compose.",
    ],
    ex: "Local runs add a bind mount for live reload through an override file; production uses only the base file.",
    mistakes: [
      "Committing .env with real secrets.",
      "Using the development file in production.",
    ],
    follow: ["How do you see the merged configuration?"],
    points: [
      "environment, env_file, interpolation",
      "Override files for environments",
      "Profiles for optional services",
      "Secrets not committed",
    ],
    notes: ["Base file plus overrides."],
    src: [
      [
        "Docker: Set environment variables in Compose",
        `${D}/compose/how-tos/environment-variables/set-environment-variables/`,
      ],
      ["Docker: Compose in production", `${D}/compose/how-tos/production/`],
    ],
  }),
  q({
    slug: "compose-volumes-networks-commands",
    topic: "Compose",
    d: "easy",
    title: "Which Compose commands do you use day to day?",
    kw: ["docker compose up", "docker compose down", "logs", "build", "exec"],
    intent: "Checks you can operate a Compose project.",
    short:
      "`docker compose up -d` starts the project in the background, building images if needed with `--build`. `docker compose ps` lists its containers, `docker compose logs -f api` follows a service's logs, and `docker compose exec api sh` opens a shell in a running service. `docker compose down` stops and removes the containers and the network, and adding `-v` also deletes named volumes, which erases their data, so use it deliberately. `docker compose restart` and `stop` control individual services.",
    detail: [
      "Rebuild after changing the Dockerfile or dependencies with `up --build`.",
      "`docker compose pull` fetches newer images.",
      "`docker compose config` validates and prints the final configuration.",
    ],
    ex: "After changing a dependency, the developer runs `docker compose up -d --build api`.",
    mistakes: [
      "Running down -v and deleting the database.",
      "Forgetting --build after changing the Dockerfile.",
    ],
    follow: ["What does down -v delete that down does not?"],
    points: [
      "up -d, ps, logs -f, exec",
      "down removes containers and networks",
      "down -v removes volumes too",
      "up --build rebuilds",
    ],
    notes: ["down -v deletes data."],
    src: [
      ["Docker: docker compose up", `${D}/reference/cli/docker/compose/up/`],
      [
        "Docker: docker compose down",
        `${D}/reference/cli/docker/compose/down/`,
      ],
    ],
  }),
  q({
    slug: "multi-stage-builds-purpose",
    topic: "Multi-stage builds",
    d: "medium",
    title: "What is a multi-stage build and why use it?",
    kw: [
      "multi-stage build",
      "builder stage",
      "COPY --from",
      "image size",
      "build tools",
    ],
    intent: "Checks you can keep build tools out of the runtime image.",
    short:
      "A multi-stage build uses several `FROM` instructions in one Dockerfile. Early stages have the compilers and dev dependencies to build the application, and the final stage starts from a clean, small base and copies only the build output with `COPY --from=build`. Everything else from the earlier stages is discarded, so the production image is smaller, faster to pull and has less attack surface, and you do not need separate Dockerfiles for building and running.",
    detail: [
      "Stages can be named with `AS name`.",
      "You can build a specific stage with `--target`.",
      "It also keeps source code and secrets used only during the build out of the final image.",
    ],
    ex: "A Java app is compiled with Maven in one stage and only the JAR is copied into a slim JRE image.",
    code: [
      [
        "Two stages",
        "dockerfile",
        `FROM node:22 AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:22-slim\nWORKDIR /app\nCOPY --from=build /app/dist ./dist\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCMD ["node", "dist/server.js"]`,
        [
          "The first stage builds.",
          "The final stage copies only `dist` and production dependencies.",
        ],
      ],
    ],
    mistakes: [
      "Shipping the full build toolchain.",
      "Copying everything from the build stage.",
    ],
    follow: ["What does --target do?"],
    points: [
      "Multiple FROM stages",
      "COPY --from to take only outputs",
      "Smaller and safer final image",
      "Name stages with AS",
    ],
    notes: ["Build in one stage, run in another."],
    src: [
      [
        "Docker: Multi-stage builds",
        `${CON}/building-images/multi-stage-builds/`,
      ],
      ["Docker: Multi-stage reference", `${D}/build/building/multi-stage/`],
    ],
  }),
  q({
    slug: "multi-stage-react-nginx",
    topic: "Multi-stage builds",
    d: "medium",
    title:
      "How would you containerize a React app with a multi-stage build and nginx?",
    kw: [
      "react dockerfile",
      "nginx static serving",
      "vite build",
      "spa fallback",
      "multi-stage",
    ],
    intent: "Checks you can ship a static front end in a small image.",
    short:
      "Build the React app in a Node stage with `npm ci` and `npm run build`, which outputs static files, then use a second stage from an nginx image and copy the build output into nginx's web root. The final image contains only nginx and static files, not Node or `node_modules`, so it is small and fast. Add an nginx config with a `try_files` fallback to `index.html`, so client-side routes work when the page is refreshed.",
    detail: [
      "Environment values that are baked in at build time must be passed as build arguments.",
      "Hashed asset file names can be served with long cache headers.",
      "Serve over HTTPS through a reverse proxy or load balancer in production.",
    ],
    ex: "A Vite app is built in Node and served by nginx from `/usr/share/nginx/html`.",
    code: [
      [
        "React with nginx",
        "dockerfile",
        `FROM node:22 AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:1.27-alpine\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\nCOPY --from=build /app/dist /usr/share/nginx/html`,
        [
          "Node builds the static files.",
          "nginx serves them with a custom config.",
        ],
      ],
    ],
    mistakes: [
      "Shipping Node to serve static files.",
      "No SPA fallback, so refresh on a route returns 404.",
    ],
    follow: ["Why is try_files needed?"],
    points: [
      "Node stage builds",
      "nginx stage serves",
      "No Node in the final image",
      "try_files fallback for SPAs",
    ],
    notes: ["Build with Node, serve with nginx."],
    src: [
      [
        "Docker: Containerize a React.js application",
        `${D}/guides/reactjs/containerize/`,
      ],
      [
        "Docker: Multi-stage builds",
        `${CON}/building-images/multi-stage-builds/`,
      ],
    ],
  }),
  q({
    slug: "multi-stage-node-api",
    topic: "Multi-stage builds",
    d: "medium",
    title: "How do you build a lean production image for a Node.js API?",
    kw: [
      "node dockerfile",
      "npm ci omit dev",
      "production image",
      "non-root",
      "graceful shutdown",
    ],
    intent: "Checks you apply the standard recipe for Node services.",
    short:
      'Use a pinned slim Node base image. Copy `package.json` and the lockfile first and run `npm ci --omit=dev` so only production dependencies are installed, then copy the source (or the compiled output for TypeScript, built in an earlier stage). Run as the non-root `node` user, set `NODE_ENV=production`, use the exec-form `CMD ["node", "server.js"]` so signals reach the app, and have the app handle SIGTERM to shut down gracefully. Add `.dockerignore` and a health check endpoint.',
    detail: [
      "`npm ci` installs exactly what the lockfile says, which is reproducible.",
      "A TypeScript app builds in one stage and copies `dist` into the runtime stage.",
      "Do not run `npm start` through npm as PID 1 if signals matter; call node directly.",
    ],
    ex: "The API image is under 200 MB, runs as `node`, and stops cleanly within a second when the platform sends SIGTERM.",
    code: [
      [
        "Lean Node image",
        "dockerfile",
        `FROM node:22-slim\nENV NODE_ENV=production\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY --chown=node:node . .\nUSER node\nEXPOSE 3000\nCMD ["node", "server.js"]`,
        [
          "Only production dependencies are installed.",
          "The app runs as a non-root user.",
          "Exec form delivers signals.",
        ],
      ],
    ],
    mistakes: [
      "npm install instead of npm ci.",
      "Running as root with dev dependencies installed.",
    ],
    follow: ["Why call node directly instead of npm start?"],
    points: [
      "Slim pinned base",
      "npm ci --omit=dev",
      "Non-root user",
      "Exec-form CMD and SIGTERM handling",
    ],
    notes: ["Reproducible, minimal, non-root."],
    src: [
      [
        "Docker: Containerize a Node.js application",
        `${D}/guides/nodejs/containerize/`,
      ],
      [
        "Docker: Building best practices",
        `${D}/build/building/best-practices/`,
      ],
    ],
  }),
  q({
    slug: "docker-cleanup-and-disk",
    topic: "Images",
    d: "easy",
    title: "How do you clean up unused Docker images, containers and volumes?",
    kw: [
      "docker system prune",
      "dangling images",
      "disk space",
      "docker image prune",
      "volumes",
    ],
    intent: "Checks you can reclaim disk safely.",
    short:
      "Images, stopped containers, networks and build cache accumulate and can fill a disk. `docker image prune` removes dangling images, `docker container prune` removes stopped containers, and `docker system prune` removes unused containers, networks, dangling images and build cache; adding `-a` also removes all unused images, and `--volumes` includes unused volumes. Read what will be deleted before confirming, and be especially careful with volumes, since pruning them deletes data permanently.",
    detail: [
      "`docker system df` shows how much space Docker is using.",
      "On servers, schedule cleanup carefully and keep recent images for rollback.",
      "Dangling images are untagged layers left over from rebuilds.",
    ],
    ex: "A build server runs out of disk; `docker system df` shows build cache is the largest item and is pruned.",
    mistakes: [
      "Pruning volumes on a server with a database.",
      "Removing the previous image and losing the rollback option.",
    ],
    follow: ["What is a dangling image?"],
    points: [
      "prune for images, containers, system",
      "-a removes all unused images",
      "--volumes deletes data",
      "docker system df shows usage",
    ],
    notes: ["Check before you prune volumes."],
    src: [
      [
        "Docker: docker system prune",
        `${D}/reference/cli/docker/system/prune/`,
      ],
      ["Docker: docker image prune", `${D}/reference/cli/docker/image/prune/`],
    ],
  }),
  q({
    slug: "docker-logging-basics",
    topic: "Containers",
    d: "easy",
    title: "How does Docker handle container logs?",
    kw: [
      "docker logs",
      "logging driver",
      "json-file",
      "stdout stderr",
      "log rotation",
    ],
    intent:
      "Checks you know where container output goes and how to keep it from filling the disk.",
    short:
      "Docker captures everything a container writes to standard output and standard error, and `docker logs` reads it. A logging driver decides where the logs go; the default `json-file` driver stores them as JSON files on the host, which grow without limit unless you configure rotation with options like `max-size` and `max-file`. For production you can use another driver or ship logs to a central system. So applications should log to stdout and stderr rather than to files inside the container.",
    detail: [
      "`docker logs --tail 100 -f name` follows the most recent output.",
      "Logging configuration can be set per container or in the daemon settings.",
      "Structured logs, such as JSON lines, are easier to search centrally.",
    ],
    ex: "A noisy container filled the host disk with a huge JSON log file until `max-size` was configured.",
    mistakes: [
      "Writing logs to a file inside the container.",
      "Unbounded json-file logs on a busy service.",
    ],
    follow: ["What is the default logging driver?"],
    points: [
      "stdout and stderr are captured",
      "docker logs reads them",
      "json-file default needs rotation",
      "Ship centrally in production",
    ],
    notes: ["Log to stdout; rotate the files."],
    src: [
      ["Docker: Logging overview", `${D}/engine/logging/`],
      ["Docker: Configure logging drivers", `${D}/engine/logging/configure/`],
    ],
  }),
])
