import { defineLesson } from "@/data/lessons/author"

export default defineLesson("docker", {
  slug: "volumes",
  title: "Volumes, bind mounts and tmpfs",
  topic: "Volumes",
  minutes: 45,
  overview:
    "Persist and share container data with named volumes, bind mounts and tmpfs mounts, choose between them, and use -v and --mount correctly.",
  objectives: [
    "Explain why container data needs volumes",
    "Create and use a named volume",
    "Use a bind mount for development and a read-only mount",
    "Choose between volume, bind mount and tmpfs",
  ],
  prerequisites: ["lesson.docker.containers"],
  sections: [
    {
      kind: "explain",
      heading: "Why storage outside the container",
      body: [
        "Everything a container writes goes to its temporary writable layer, which is deleted when the container is removed. To keep data, or to share it between containers or with the host, you mount storage into the container.",
        "Docker offers three main kinds. A **volume** is a storage location created and managed by Docker; it is the preferred way to persist data. A **bind mount** maps a specific file or directory of the host into the container. A **tmpfs mount** keeps data in the host's memory only, and it disappears when the container stops.",
      ],
    },
    {
      kind: "diagram",
      heading: "Choosing a mount",
      diagram: {
        kind: "table",
        title: "Volume, bind mount or tmpfs",
        headers: ["Type", "Where the data lives", "Typical use"],
        rows: [
          ["Named volume", "Managed by Docker on the host", "Databases and any data that must outlive the container"],
          ["Bind mount", "A path you choose on the host", "Source code during development, sharing config files"],
          ["tmpfs", "Host memory only", "Temporary or sensitive data that should not be written to disk"],
        ],
      },
    },
    {
      kind: "code",
      heading: "Using each type",
      example: {
        title: "Create and mount",
        language: "bash",
        code: "docker volume create dbdata\ndocker volume ls\ndocker run -d --name db -v dbdata:/var/lib/postgresql/data postgres:16-alpine\n\ndocker run -d --name dev -v \"$PWD\":/app:ro node:22-alpine sleep 3600\ndocker run -d --name cache --mount type=tmpfs,destination=/cache alpine sleep 3600\n\ndocker inspect db --format '{{range .Mounts}}{{.Type}} {{.Name}} {{.Destination}}{{end}}'\ndocker rm -f db dev cache\ndocker volume rm dbdata",
        walkthrough: [
          "`docker volume create dbdata` makes a named volume. `-v dbdata:/var/lib/postgresql/data` mounts it at the path where the database stores its files, so the data survives removing the container and can be attached to a new one.",
          "In `-v source:destination:options`, a source that is a **name** is a volume, while an absolute path is a **bind mount**. The `:ro` option makes the mount read-only inside the container.",
          "`--mount` is the longer, explicit form with key=value pairs, such as `type=tmpfs,destination=/cache`. It is clearer and reports an error if a bind-mount source does not exist, where `-v` would create it.",
          "`docker inspect` lists the mounts with their type, name and destination. A volume must not be attached to any container before you remove it with `docker volume rm`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Practical guidance",
      body: [
        "Use volumes for production data such as databases. They work the same on every operating system and do not depend on the host's directory layout.",
        "Use bind mounts in development so you can edit code on the host and see changes in the container immediately. Mount as read-only (`:ro`) when the container only needs to read.",
        "Mounting over a non-empty directory in the container hides the original contents of that directory. Removing a container with `docker rm` does not remove its named volumes; remove them explicitly. Back up important volumes.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Running a database without a volume.",
          fix: "Mount a named volume at the database's data directory.",
        },
        {
          mistake: "Using a relative path as a bind-mount source with -v and getting a named volume instead.",
          fix: "Use an absolute path such as \"$PWD\"/data, or --mount type=bind.",
        },
        {
          mistake: "Assuming docker rm deleted the data.",
          fix: "Named volumes persist until you remove them with docker volume rm.",
        },
        {
          mistake: "Bind-mounting the whole host file system or sensitive paths.",
          fix: "Mount only what the container needs, read-only where possible.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Keeping a database",
      scenario:
        "A development database loses all its tables every time the container is recreated.",
      body: [
        "Create a named volume and mount it at the database's data directory in the run command or the Compose file. Recreate the container: the new one starts with the data from the volume.",
        "Use `docker volume ls` to see volumes and `docker volume rm` to delete one you no longer need.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "persist-best",
      prompt: "Which mount type is the preferred way to persist data for containers?",
      options: ["A named volume", "tmpfs", "The writable layer"],
      answer: 0,
      explanation:
        "Volumes are managed by Docker and are the preferred mechanism for persisting data.",
    },
    {
      type: "single",
      id: "dev-mount",
      prompt: "Which type suits editing source code on the host and seeing it in the container immediately?",
      options: ["Bind mount", "tmpfs", "Image layer"],
      answer: 0,
      explanation:
        "A bind mount maps a host directory into the container, so changes appear on both sides.",
    },
    {
      type: "truefalse",
      id: "rm-volume",
      statement: "Running docker rm on a container also deletes its named volumes.",
      answer: false,
      explanation:
        "Named volumes persist. Remove them with docker volume rm when they are not needed.",
    },
    {
      type: "blank",
      id: "readonly-flag",
      prompt: "Adding :___ to a -v mount makes it read-only inside the container.",
      answer: "ro",
      explanation:
        "`:ro` mounts the source as read-only.",
    },
  ],
  assignment: {
    title: "Persist and share data",
    task: [
      "Start a database container with a named volume, create some data, remove the container and start a new one with the same volume to confirm the data is still there.",
      "Then run a container with a read-only bind mount of a host folder, and a tmpfs mount, and show them with docker inspect.",
    ],
    checklist: [
      "The data survived recreating the container",
      "The bind mount is read-only",
      "A tmpfs mount is present",
      "I removed the volume at the end",
    ],
    hints: ["Use docker inspect with a --format template to list Mounts."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "mount-commands",
      title: "Mount commands",
      task: [
        "Write commands to: create a volume named uploads; run nginx:1.27 detached as files with that volume mounted at /usr/share/nginx/html; run another container that bind-mounts the current directory read-only at /site.",
      ],
      language: "bash",
      starter: "# your commands",
      solution:
        "docker volume create uploads\ndocker run -d --name files -v uploads:/usr/share/nginx/html nginx:1.27\ndocker run -d --name viewer -v \"$PWD\":/site:ro nginx:1.27",
      hints: ["A name as the source is a volume; an absolute path is a bind mount."],
      checklist: [
        "The volume is created and mounted by name",
        "The bind mount uses an absolute path",
        "The bind mount has :ro",
      ],
    },
  ],
  revisionNotes: [
    "Container writable layer is temporary; mount storage to persist",
    "Volume (managed, preferred), bind mount (host path), tmpfs (memory only)",
    "-v source:dest[:ro] versus --mount type=...,source=...,destination=...",
    "docker rm keeps named volumes; mounting over a directory hides its contents",
  ],
  resources: [
    {
      label: "Persisting container data",
      url: "https://docs.docker.com/get-started/docker-concepts/running-containers/persisting-container-data/",
    },
    {
      label: "Volumes",
      url: "https://docs.docker.com/engine/storage/volumes/",
    },
    {
      label: "Bind mounts",
      url: "https://docs.docker.com/engine/storage/bind-mounts/",
    },
  ],
})
