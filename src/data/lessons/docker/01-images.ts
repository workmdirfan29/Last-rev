import { defineLesson } from "@/data/lessons/author"

export default defineLesson("docker", {
  slug: "images",
  title: "Docker images, layers and the Dockerfile",
  topic: "Images",
  minutes: 60,
  overview:
    "Understand what an image is, how a Dockerfile builds it layer by layer, how the build cache works, and how to tag images and keep them small with .dockerignore.",
  objectives: [
    "Explain an image, a layer, a tag and a registry",
    "Read and write a basic Dockerfile",
    "Order instructions to make good use of the build cache",
    "Use .dockerignore and tags correctly",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "What an image is",
      body: [
        "A container **image** is a read-only package that holds everything an application needs to run: the files, libraries, runtime and default configuration. An image is the template; a container is a running instance of it. You build an image once and run it on any machine that has Docker.",
        "Images are made of **layers**. Each layer records a set of file-system changes, and layers are stacked. Layers are immutable and can be shared between images, so Docker stores and transfers only the layers that are missing.",
        "Images are stored in a **registry**. Docker Hub is the default public registry, and you can also use private registries. An image name looks like `registry/namespace/name:tag`; the **tag** (such as `1.0` or `latest`) selects a version. `latest` is just a tag, not a guarantee of the newest build, so pin explicit versions in real projects.",
      ],
    },
    {
      kind: "code",
      heading: "A Dockerfile",
      example: {
        title: "Building a small Node.js image",
        language: "dockerfile",
        code: "FROM node:22-alpine\nWORKDIR /app\nCOPY package.json package-lock.json ./\nRUN npm ci\nCOPY . .\nENV NODE_ENV=production\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]",
        walkthrough: [
          "`FROM` chooses the **base image** that everything else builds on. Pin a specific version rather than `latest` so builds are repeatable.",
          "`WORKDIR` sets the working directory for the following instructions and creates it if needed.",
          "`COPY package.json package-lock.json ./` copies only the dependency files first, and `RUN npm ci` installs them. Because this layer only changes when those files change, Docker can reuse it from the cache on most builds.",
          "`COPY . .` then copies the source code. `ENV` sets an environment variable that stays in the image. `EXPOSE` documents the port the app listens on; it does **not** publish the port.",
          "`CMD` sets the default command. Use the exec form (a JSON array) so the process starts directly, without a shell in between.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Common instructions",
      diagram: {
        kind: "table",
        title: "Dockerfile instructions you will use most",
        headers: ["Instruction", "Purpose"],
        rows: [
          ["FROM", "Choose the base image (starts a build stage)"],
          ["RUN", "Run a command at build time and save the result as a layer"],
          ["COPY", "Copy files from the build context (or another stage) into the image"],
          ["ADD", "Like COPY, with extras: remote URLs and automatic tar extraction. Prefer COPY unless you need these"],
          ["ENV / ARG", "ENV persists in the image and containers; ARG exists only at build time"],
          ["WORKDIR / USER", "Set the working directory / switch to a non-root user"],
          ["CMD / ENTRYPOINT", "Default command / the fixed executable that CMD arguments are passed to"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "The build cache",
      body: [
        "When you build, Docker goes through the instructions in order and checks whether it can reuse the result from the cache. If an instruction or the files it copies have changed, that layer is rebuilt, and **every layer after it is rebuilt too**.",
        "So put what changes rarely (system packages, dependency installation) near the top and what changes often (your source code) near the bottom. Copying only the dependency manifest before installing dependencies is the standard way to keep installs cached.",
        "A `.dockerignore` file lists files and directories to leave out of the **build context**, the set of files sent to the builder. Excluding `node_modules`, `.git`, logs and secret files speeds up builds, keeps images smaller and keeps secrets out. Its patterns work like those in `.gitignore`.",
      ],
    },
    {
      kind: "code",
      heading: "Build, tag and inspect",
      example: {
        title: "Everyday image commands",
        language: "bash",
        code: "docker build -t myapp:1.0 .\ndocker build -t myapp:1.0 .   # unchanged: steps are CACHED\ndocker image ls\ndocker history myapp:1.0\ndocker tag myapp:1.0 myapp:latest\ndocker image rm myapp:latest",
        walkthrough: [
          "`docker build -t name:tag .` builds from the Dockerfile in the current directory; the final `.` is the build context.",
          "Running the same build again with no changes reports the steps as `CACHED`. If you edit a copied file, that `COPY` step and all later steps run again.",
          "`docker image ls` lists local images and `docker history` shows the layers and the instruction that created each.",
          "`docker tag` adds another name to the same image, and `docker image rm` removes a tag. The layers stay while any other tag or container uses them.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using the latest tag for the base image.",
          fix: "Pin a specific version so the build is repeatable.",
        },
        {
          mistake: "COPY . . before installing dependencies.",
          fix: "Copy the dependency files first, install, then copy the source.",
        },
        {
          mistake: "Baking secrets into the image with ENV or COPY.",
          fix: "Pass secrets at run time or use build secrets; keep secret files in .dockerignore.",
        },
        {
          mistake: "Believing EXPOSE publishes a port.",
          fix: "Publish with -p when you run the container.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Slow builds",
      scenario:
        "Every small code change reinstalls all dependencies and takes minutes.",
      body: [
        "Look at the Dockerfile order. If `COPY . .` comes before `RUN npm ci`, any source change invalidates the install layer. Move the copy of the dependency files and the install above the copy of the source.",
        "Add a `.dockerignore` so the large `node_modules` folder and `.git` are not sent to the builder.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "image-vs-container",
      prompt: "What is the relationship between an image and a container?",
      options: [
        "A container is a running instance of an image",
        "An image is a running instance of a container",
        "They are the same thing",
      ],
      answer: 0,
      explanation:
        "The image is the read-only template; a container is created from it.",
    },
    {
      type: "single",
      id: "cache-order",
      prompt: "When one layer in a build changes, which layers are rebuilt?",
      options: [
        "That layer and every layer after it",
        "Only that layer",
        "Every layer in the image",
      ],
      answer: 0,
      explanation:
        "Layers are stacked, so a changed layer invalidates all layers that follow.",
    },
    {
      type: "truefalse",
      id: "expose-publish",
      statement: "The EXPOSE instruction publishes the port to the host.",
      answer: false,
      explanation:
        "EXPOSE documents the port. You publish ports with -p when running the container.",
    },
    {
      type: "blank",
      id: "ignore-file",
      prompt: "A ___ file lists files to leave out of the build context.",
      answer: ".dockerignore",
      accepted: ["dockerignore"],
      explanation:
        "`.dockerignore` works like .gitignore for the files sent to the builder.",
    },
  ],
  assignment: {
    title: "Dockerize a small app",
    task: [
      "Write a Dockerfile for a small web app in any language you know, with a pinned base image, a non-root user, the dependency files copied first and a CMD in exec form.",
      "Add a .dockerignore, build the image twice, and record which steps were cached. Then change one source file and note which steps re-ran.",
    ],
    checklist: [
      "The base image has an explicit version tag",
      "Dependencies are installed before the source is copied",
      ".dockerignore excludes dependencies, .git and secret files",
      "I can explain which layers were reused and why",
    ],
    hints: ["`docker build --progress=plain .` prints each step and CACHED marks."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "python-dockerfile",
      title: "Write a Dockerfile",
      task: [
        "Write a Dockerfile for a Python script app.py with a requirements.txt: use python:3.12-slim, set /app as the working directory, install the requirements before copying the source (without caching pip downloads), and run app.py with CMD in exec form.",
      ],
      language: "dockerfile",
      starter: "FROM ",
      solution:
        "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD [\"python\", \"app.py\"]",
      hints: ["Copy requirements.txt first, install, then copy everything else."],
      checklist: [
        "The base image is pinned",
        "requirements.txt is copied and installed before the source",
        "CMD uses the exec form",
      ],
    },
  ],
  revisionNotes: [
    "Image = read-only layered template; container = running instance; tags select versions",
    "FROM, WORKDIR, COPY, RUN, ENV, EXPOSE, CMD; prefer COPY over ADD",
    "A changed layer rebuilds all later layers: dependencies first, source last",
    ".dockerignore trims the build context and keeps secrets out",
  ],
  resources: [
    {
      label: "What is an image?",
      url: "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/",
    },
    {
      label: "Understanding image layers",
      url: "https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/",
    },
    {
      label: "Dockerfile reference",
      url: "https://docs.docker.com/reference/dockerfile/",
    },
    {
      label: "Building best practices",
      url: "https://docs.docker.com/build/building/best-practices/",
    },
  ],
})
