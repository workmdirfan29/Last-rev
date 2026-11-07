import { defineLesson } from "@/data/lessons/author"

export default defineLesson("docker", {
  slug: "compose",
  title: "Docker Compose",
  topic: "Compose",
  minutes: 70,
  overview:
    "Define a multi-container application in one compose.yaml file: services, networks, volumes, environment, health checks and start-up order, and manage it with docker compose.",
  objectives: [
    "Describe an application with services, networks and volumes in compose.yaml",
    "Use build, image, ports, environment and volumes on a service",
    "Control start-up order with depends_on and health checks",
    "Run and tear down a stack with docker compose up and down",
  ],
  prerequisites: ["lesson.docker.networking", "lesson.docker.volumes"],
  sections: [
    {
      kind: "explain",
      heading: "Why Compose",
      body: [
        "Running several containers with long `docker run` commands is repetitive and error-prone. **Docker Compose** lets you describe the whole application in one YAML file, usually `compose.yaml`, and manage it with a few commands.",
        "The top-level elements are `services` (the containers), `networks` and `volumes`. By default Compose sets up a **single network** for the application: every service joins it, is reachable by the other services, and is discoverable by its **service name**. So a web service can connect to the database at the host name `db`.",
        "Compose names the project from the directory (or the top-level `name`) and prefixes the networks and volumes it creates with the project name.",
      ],
    },
    {
      kind: "code",
      heading: "A two-service application",
      example: {
        title: "compose.yaml",
        language: "yaml",
        code: "name: shop\nservices:\n  web:\n    build: .\n    ports:\n      - \"8080:3000\"\n    environment:\n      DATABASE_URL: postgres://app:secret@db:5432/shop\n    depends_on:\n      db:\n        condition: service_healthy\n    networks:\n      - backend\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: app\n      POSTGRES_PASSWORD: secret\n      POSTGRES_DB: shop\n    volumes:\n      - dbdata:/var/lib/postgresql/data\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U app -d shop\"]\n      interval: 5s\n      timeout: 3s\n      retries: 5\n    networks:\n      - backend\nvolumes:\n  dbdata:\nnetworks:\n  backend:",
        walkthrough: [
          "`web` is built from the Dockerfile in the current directory (`build: .`); `db` uses a ready-made image. Each service becomes one or more containers.",
          "`ports` publishes `8080` on the host to `3000` in the container, like `-p`. Quote port mappings in YAML. The `environment` map sets variables; the app reaches the database at the host name `db`.",
          "`volumes` on `db` mounts the named volume `dbdata`, declared in the top-level `volumes` section, so the data survives recreating the container.",
          "`healthcheck` runs a command periodically to decide whether the service is healthy. With `depends_on` and `condition: service_healthy`, Compose starts `web` only after `db` reports healthy. A plain `depends_on` only waits until the dependency has been started, not until it is ready.",
          "`networks` defines a named network `backend` that both services join. You can omit it and rely on the default network for simple applications.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Commands",
      example: {
        title: "Everyday Compose commands",
        language: "bash",
        code: "docker compose config\ndocker compose config --services\ndocker compose up -d\ndocker compose ps\ndocker compose logs -f web\ndocker compose exec db psql -U app -d shop\ndocker compose down\ndocker compose down -v",
        walkthrough: [
          "`docker compose config` validates the file and prints the fully resolved configuration; `--services` lists the service names, here `db` and `web`. Run it before `up` to catch mistakes.",
          "`docker compose up -d` creates the network and volumes, builds images where needed and starts the services in the background. Add `--build` to force a rebuild.",
          "`ps` shows the project's containers, `logs -f` follows the output of a service, and `exec` runs a command in a running service container.",
          "`docker compose down` stops and removes the containers and the networks. Named volumes are **kept**, so your data survives. `down -v` also deletes the volumes, which is destructive.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Configuration tips",
      body: [
        "Do not hard-code secrets in the file you commit. Use an `.env` file (which Compose reads for variable substitution) or `env_file`, and keep it out of version control. Reference values with `${VARIABLE}`, optionally with a default such as `${PORT:-8080}`.",
        "For development, bind-mount your source into the service and use a profile or an override file (`compose.override.yaml`) for settings you do not want in production.",
        "Pin image versions, give every stateful service a volume, and use health checks so dependent services start in a sensible order.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Assuming depends_on waits until the database is ready.",
          fix: "Use condition: service_healthy with a healthcheck, or make the app retry its connection.",
        },
        {
          mistake: "Using localhost as the database host from the web service.",
          fix: "Use the service name, such as db.",
        },
        {
          mistake: "Running docker compose down -v casually.",
          fix: "-v deletes named volumes and their data; use plain down to keep it.",
        },
        {
          mistake: "Indentation errors in the YAML file.",
          fix: "Use spaces only, and run docker compose config to validate.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A new teammate's first day",
      scenario:
        "A new developer must run your web app and its database locally.",
      body: [
        "With a `compose.yaml` in the repository, they clone the project, create their `.env`, and run `docker compose up -d`. The database, network and volume are created and the app is available on its published port.",
        "When they finish, `docker compose down` removes the containers but keeps the database volume for next time.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "service-name-host",
      prompt: "In Compose, how does the web service reach a service called db?",
      options: [
        "Using the host name db on the default network",
        "Using localhost",
        "Only by looking up its IP address",
      ],
      answer: 0,
      explanation:
        "Services share a network and are discoverable by their service names.",
    },
    {
      type: "single",
      id: "down-keeps",
      prompt: "What does docker compose down (without -v) leave behind?",
      options: ["Named volumes and their data", "The containers", "The network"],
      answer: 0,
      explanation:
        "down removes containers and networks; named volumes are kept unless you add -v.",
    },
    {
      type: "truefalse",
      id: "depends-on-ready",
      statement: "A plain depends_on guarantees the dependency is ready to accept connections.",
      answer: false,
      explanation:
        "It waits for the container to start. Use a healthcheck with condition: service_healthy for readiness.",
    },
    {
      type: "blank",
      id: "validate-cmd",
      prompt: "To validate a Compose file and print the resolved configuration, run docker compose ___.",
      answer: "config",
      explanation:
        "`docker compose config` parses, resolves and prints the configuration.",
    },
  ],
  assignment: {
    title: "Compose a stack",
    task: [
      "Write a compose.yaml for a web service built from a Dockerfile and a database with a named volume and a health check. The web service must wait for the database to be healthy and read its database URL from an environment variable.",
      "Validate it with docker compose config, start it, check the logs, then stop it with down and show that the volume is still there.",
    ],
    checklist: [
      "The file has services, volumes and a network (or the default)",
      "The database uses a named volume and a healthcheck",
      "depends_on uses service_healthy",
      "docker compose config validates without errors",
    ],
    hints: ["`docker volume ls` shows the volume named after the project."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "cache-service",
      title: "Add a service",
      task: [
        "Add a redis service (image redis:7-alpine) to a compose.yaml that already has a web service, and make web depend on it. Show the lines that you add.",
      ],
      language: "yaml",
      starter: "services:\n  web:\n    build: .\n",
      solution:
        "services:\n  web:\n    build: .\n    depends_on:\n      - cache\n  cache:\n    image: redis:7-alpine",
      hints: ["depends_on can be a simple list of service names."],
      checklist: [
        "A cache service uses image redis:7-alpine",
        "web lists cache in depends_on",
        "The YAML indentation is consistent",
      ],
    },
  ],
  revisionNotes: [
    "compose.yaml: services, networks, volumes; one default network, reach services by name",
    "build or image, ports, environment, volumes, healthcheck, depends_on with condition",
    "config, up -d, ps, logs -f, exec, down, down -v",
    "depends_on waits for start, not readiness; keep secrets in .env, out of version control",
  ],
  resources: [
    {
      label: "What is Docker Compose?",
      url: "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-docker-compose/",
    },
    {
      label: "Compose application model",
      url: "https://docs.docker.com/compose/intro/compose-application-model/",
    },
    {
      label: "Compose file: services",
      url: "https://docs.docker.com/reference/compose-file/services/",
    },
    {
      label: "Control startup order in Compose",
      url: "https://docs.docker.com/compose/how-tos/startup-order/",
    },
  ],
})
