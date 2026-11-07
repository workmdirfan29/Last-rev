import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "packages-apt",
  title: "Installing software with apt",
  topic: "Packages",
  minutes: 18,
  overview:
    "List, install and remove software on Debian and Ubuntu systems with apt list and apt-get, and understand why you need sudo.",
  objectives: [
    "List installed packages with apt list --installed",
    "Install and remove packages with sudo apt-get",
    "Explain why package commands need administrator rights",
    "Refresh the package index before installing",
  ],
  prerequisites: ["lesson.linux-commands.pipes-and-redirection"],
  sections: [
    {
      kind: "explain",
      heading: "Package managers",
      body: [
        "A **package** bundles a program with the information the system needs to install, upgrade and remove it, including the other packages it depends on. On Debian and Ubuntu the tools are `apt` and `apt-get`, and the packages come from **repositories** listed in the system's configuration.",
        "Installing and removing change the whole system, so they need administrator rights: prefix the command with `sudo`. Reading information, such as `apt list --installed`, does not.",
      ],
    },
    {
      kind: "code",
      heading: "Everyday apt commands",
      example: {
        title: "List, install and remove",
        language: "bash",
        code: "apt list --installed | head -n 5\napt list --installed 2>/dev/null | grep -c installed\nsudo apt-get update\nsudo apt-get install tree\nsudo apt-get remove tree",
        walkthrough: [
          "`apt list --installed` prints every installed package with its version; piping it to `head` or `grep` makes the long list manageable. The output differs from machine to machine, so there is no fixed result here.",
          "`sudo apt-get update` refreshes the **package index**, the list of what is available. Do this before installing so you get current versions.",
          "`sudo apt-get install tree` downloads and installs the package and any packages it depends on, asking for confirmation. Add `-y` to answer yes automatically.",
          "`sudo apt-get remove tree` uninstalls the program but keeps its configuration files; `purge` also deletes the configuration.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Package tasks",
      diagram: {
        kind: "table",
        title: "Commands",
        headers: ["Task", "Command"],
        rows: [
          ["Show installed packages", "apt list --installed"],
          ["Refresh the package index", "sudo apt-get update"],
          ["Install a package", "sudo apt-get install name"],
          ["Remove a package", "sudo apt-get remove name"],
          ["Remove it with its configuration", "sudo apt-get purge name"],
          ["Upgrade installed packages", "sudo apt-get upgrade"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Installing without running apt-get update first.",
          fix: "An old index may point to versions that no longer exist.",
        },
        {
          mistake: "Running everything as root with sudo for no reason.",
          fix: "Use sudo only for commands that change the system.",
        },
        {
          mistake: "Adding unknown repositories.",
          fix: "Third-party sources can replace system software; trust them carefully.",
        },
        {
          mistake:
            "Using apt-get install -y blindly in a script on a real server.",
          fix: "Read what will be installed and removed first.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Installing a tool",
      scenario: "You need the tree command to show folders as a tree.",
      body: [
        "Run `sudo apt-get update`, then `sudo apt-get install tree`, and check with `tree --version`. If you no longer need it, `sudo apt-get remove tree`.",
        "To see whether a package is already installed, `apt list --installed | grep tree` answers in one line.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "sudo-reason",
      prompt: "Why do install and remove commands need sudo?",
      options: [
        "They change the whole system, which needs administrator rights",
        "They are slow",
        "They use the network",
      ],
      answer: 0,
      explanation:
        "Only the administrator may install or remove system software.",
    },
    {
      type: "single",
      id: "update-purpose",
      prompt: "What does apt-get update do?",
      options: [
        "Refreshes the list of available packages",
        "Upgrades every installed package",
        "Removes unused packages",
      ],
      answer: 0,
      explanation:
        "update refreshes the index; upgrade installs newer versions.",
    },
    {
      type: "truefalse",
      id: "remove-config",
      statement: "apt-get remove keeps the package's configuration files.",
      answer: true,
      explanation: "Use purge to remove configuration files as well.",
    },
    {
      type: "blank",
      id: "list-flag",
      prompt: "apt list --___ shows the packages installed on the system.",
      answer: "installed",
      explanation: "`--installed` limits the list to installed packages.",
    },
  ],
  assignment: {
    title: "Package inspection",
    task: [
      "List the installed packages, count them, and check whether three tools of your choice are installed using grep.",
      "Describe the steps (without running them on a production machine) you would follow to install and later remove one package.",
    ],
    checklist: [
      "I counted the installed packages",
      "I checked specific packages with grep",
      "I explained the role of update",
      "I explained the sudo requirement",
    ],
    hints: ["apt list --installed | wc -l counts lines."],
    minutes: 10,
  },
  exercises: [
    {
      slug: "install-commands",
      title: "Install and remove",
      task: [
        "Write the commands to refresh the index, install htop, and later remove htop together with its configuration files.",
      ],
      language: "bash",
      starter: "# commands",
      solution:
        "sudo apt-get update\nsudo apt-get install htop\nsudo apt-get purge htop",
      hints: ["purge removes configuration too."],
      checklist: [
        "update comes first",
        "install uses sudo",
        "purge is used for the final removal",
      ],
    },
  ],
  revisionNotes: [
    "apt list --installed shows what is installed",
    "sudo apt-get update refreshes the index; install and remove change the system",
    "remove keeps configuration; purge deletes it",
    "Needs sudo; read the proposed changes",
  ],
  resources: [
    {
      label: "Ubuntu Server: package management",
      url: "https://ubuntu.com/server/docs/how-to/software/package-management/",
    },
    {
      label: "grep(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/grep.1.html",
    },
  ],
})
