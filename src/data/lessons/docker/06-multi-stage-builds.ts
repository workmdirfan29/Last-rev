import { defineLesson } from "@/data/lessons/author"

export default defineLesson("docker", {
  slug: "multi-stage-builds",
  title: "Multi-stage builds and smaller images",
  topic: "Multi-stage builds",
  minutes: 45,
  overview:
    "Use several FROM stages in one Dockerfile to build in a full toolchain image and ship only the result, choose small base images, and run as a non-root user.",
  objectives: [
    "Explain why build tools should not ship in the final image",
    "Write a Dockerfile with a build stage and a final stage using COPY --from",
    "Build a specific stage with --target",
    "Apply further size and security practices",
  ],
  prerequisites: ["lesson.docker.images"],
  sections: [
    {
      kind: "explain",
      heading: "The problem",
      body: [
        "Building an application often needs compilers, package managers and test tools. Those are not needed to run it. If everything lives in one stage, the final image carries all the build tooling, which makes it larger to store and download and gives an attacker more to work with.",
        "A **multi-stage build** uses several `FROM` instructions in one Dockerfile. Each `FROM` starts a new stage with a fresh file system. You build in an early stage and copy only the needed output into the last stage; everything else is left behind.",
      ],
    },
    {
      kind: "code",
      heading: "A build stage and a runtime stage",
      example: {
        title: "Node.js application",
        language: "dockerfile",
        code: "FROM node:22 AS build\nWORKDIR /app\nCOPY package.json package-lock.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:22-alpine AS runtime\nWORKDIR /app\nENV NODE_ENV=production\nCOPY package.json package-lock.json ./\nRUN npm ci --omit=dev\nCOPY --from=build /app/dist ./dist\nUSER node\nEXPOSE 3000\nCMD [\"node\", \"dist/server.js\"]",
        walkthrough: [
          "`FROM node:22 AS build` names the first stage `build`. It has the full toolchain, installs all dependencies and compiles the app into `dist`.",
          "The second `FROM` starts the final stage from a smaller image. It installs only production dependencies with `--omit=dev`.",
          "`COPY --from=build /app/dist ./dist` copies just the compiled output from the first stage. Source files, dev dependencies and caches stay in the build stage and are not in the final image.",
          "`USER node` runs the process as an unprivileged user instead of root, which limits the damage if the app is compromised.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Stages, --target and image size",
      example: {
        title: "Compare stages",
        language: "bash",
        code: "docker build -t myapp:build --target build .\ndocker build -t myapp:1.0 .\ndocker image ls myapp\ndocker history myapp:1.0",
        walkthrough: [
          "`--target build` stops the build at the named stage. This is useful for debugging a stage, running tests in a test stage, or using a debug stage with extra tools while production uses a lean one.",
          "Building without `--target` builds up to the last stage, which becomes the image you ship.",
          "Comparing `docker image ls` for the two tags shows how much smaller the final image is, and `docker history` shows that only the final stage's layers are in it.",
          "Earlier stages are used only during the build. Their layers help the build cache but are not part of the final image.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "More ways to shrink and harden",
      body: [
        "Pick a small, official base image and pin its version. A final stage can even start from `scratch`, an empty image, for a statically linked program.",
        "Combine related shell commands in one `RUN` and clean up in the same layer (for example removing package lists after `apt-get install`), because files deleted in a later layer still exist in the earlier one.",
        "Install only what you need, keep secrets out of the image, use a `.dockerignore`, and run as a non-root `USER`. Rebuild regularly to pick up base image updates.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Shipping the build stage as the final image.",
          fix: "Make the last stage a slim runtime image and copy only the output into it.",
        },
        {
          mistake: "Copying the whole build stage with COPY --from=build /app .",
          fix: "Copy only the needed output, such as dist.",
        },
        {
          mistake: "Deleting files in a later RUN and expecting the image to shrink.",
          fix: "Clean up within the same RUN instruction that created the files.",
        },
        {
          mistake: "Running the application as root.",
          fix: "Create or use a non-root user and switch with USER.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Shrinking a large image",
      scenario:
        "A service image is large and the registry transfers are slow.",
      body: [
        "Split the Dockerfile into a `build` stage and a runtime stage from a small base, copy only the compiled output and production dependencies, add `.dockerignore` and switch to a non-root user.",
        "Compare sizes with `docker image ls` before and after, and keep a `--target test` stage for running the tests in CI.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "multi-stage-purpose",
      prompt: "What is the main benefit of a multi-stage build?",
      options: [
        "The final image contains only what is needed to run the app",
        "The build runs on several machines",
        "Containers start in parallel",
      ],
      answer: 0,
      explanation:
        "Build tools stay in earlier stages and are left out of the final image.",
    },
    {
      type: "single",
      id: "copy-from",
      prompt: "Which instruction takes files from an earlier stage?",
      options: ["COPY --from=build", "ADD --stage=build", "RUN copy build"],
      answer: 0,
      explanation:
        "COPY --from=<stage> copies files from another stage.",
    },
    {
      type: "truefalse",
      id: "target-flag",
      statement: "docker build --target build stops after the stage named build.",
      answer: true,
      explanation:
        "--target builds the specified stage instead of the last one.",
    },
    {
      type: "truefalse",
      id: "delete-later",
      statement: "Deleting a file in a later RUN instruction removes its size from the earlier layer.",
      answer: false,
      explanation:
        "Layers are immutable. Clean up inside the same RUN that created the files.",
    },
  ],
  assignment: {
    title: "Slim down an image",
    task: [
      "Take a Dockerfile for a small compiled or built application and rewrite it as a two-stage build with a pinned slim runtime image and a non-root user.",
      "Build the single-stage and multi-stage versions, record the sizes with docker image ls, and explain which layers account for the difference.",
    ],
    checklist: [
      "There is a named build stage and a final stage",
      "COPY --from copies only the needed output",
      "The final image runs as a non-root user",
      "Both image sizes are recorded and compared",
    ],
    hints: ["`docker build --target build` builds only the first stage."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "two-stage-go",
      title: "Two-stage Dockerfile",
      task: [
        "Write a two-stage Dockerfile for a Go program: build it with golang:1.23 into /bin/app (stage name build), and run it in a final stage from scratch using CMD in exec form. CGO_ENABLED=0 is set for a static binary.",
      ],
      language: "dockerfile",
      starter: "FROM golang:1.23 AS build\n",
      solution:
        "FROM golang:1.23 AS build\nWORKDIR /src\nCOPY . .\nRUN CGO_ENABLED=0 go build -o /bin/app .\n\nFROM scratch\nCOPY --from=build /bin/app /app\nCMD [\"/app\"]",
      hints: ["Copy the binary from the build stage into scratch."],
      checklist: [
        "The first stage is named build",
        "The final stage starts FROM scratch",
        "COPY --from=build copies only the binary",
        "CMD uses the exec form",
      ],
    },
  ],
  revisionNotes: [
    "Multiple FROM stages; build in one, copy output into a slim final stage",
    "COPY --from=<stage>; docker build --target <stage>",
    "Small pinned base, clean up in the same RUN, .dockerignore, non-root USER",
    "Layers are immutable: deleting later does not shrink earlier layers",
  ],
  resources: [
    {
      label: "Multi-stage builds",
      url: "https://docs.docker.com/build/building/multi-stage/",
    },
    {
      label: "Multi-stage builds (concepts)",
      url: "https://docs.docker.com/get-started/docker-concepts/building-images/multi-stage-builds/",
    },
    {
      label: "Building best practices",
      url: "https://docs.docker.com/build/building/best-practices/",
    },
  ],
})
