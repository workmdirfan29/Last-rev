import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-fundamentals", {
  slug: "virtual-environments-and-pip",
  title: "Virtual environments and pip",
  topic: "Virtual environments & pip",
  minutes: 40,
  overview:
    "Isolate each project's packages in a virtual environment with venv, install and pin dependencies with pip, and share them through requirements.txt.",
  objectives: [
    "Explain why projects need separate environments",
    "Create, activate and deactivate a virtual environment",
    "Install, upgrade, list and remove packages with pip",
    "Record and restore dependencies with requirements.txt",
  ],
  prerequisites: ["lesson.python-fundamentals.modules"],
  sections: [
    {
      kind: "explain",
      heading: "Why virtual environments",
      body: [
        "Applications often need packages that are not in the standard library, and sometimes a specific version of them. One Python installation cannot hold two versions of the same package, so two applications with conflicting needs would break each other.",
        "A **virtual environment** is a self-contained directory tree with a Python installation for a particular version of Python plus its own set of packages. Each project gets its own environment, so upgrading a library for one project does not affect another.",
        "The module that creates them is `venv`, part of the standard library. `pip` installs packages, by default from the Python Package Index (PyPI).",
      ],
    },
    {
      kind: "code",
      heading: "Create and use",
      example: {
        title: "A project environment",
        language: "bash",
        code: "python -m venv .venv\n\n# Unix or macOS\nsource .venv/bin/activate\n# Windows\n.venv\\Scripts\\activate\n\npython -m pip install requests\npython -m pip install \"requests==2.31.0\"\npython -m pip list\npython -m pip freeze > requirements.txt\ndeactivate",
        walkthrough: [
          "`python -m venv .venv` creates the environment in a directory named `.venv`, a common choice for the name.",
          "Activating it changes your shell so `python` and `pip` refer to the environment's copies. The prompt usually shows the environment name. Activation commands differ by operating system.",
          "`python -m pip install requests` installs the latest version; `package==version` installs a specific one; `--upgrade` moves to the newest.",
          "`pip list` shows what is installed; `pip freeze` prints it in the format `pip install` can read, and redirecting it creates `requirements.txt`. `deactivate` leaves the environment.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Sharing and restoring",
      body: [
        "Commit `requirements.txt` to version control, but not the `.venv` directory itself. Anyone can then recreate the environment: create a new venv, activate it and run `python -m pip install -r requirements.txt`.",
        "`python -m pip uninstall <name>` removes a package and `python -m pip show <name>` displays information about one.",
        "Running pip as `python -m pip` makes sure you use the pip that belongs to the Python you intended, which matters when several Pythons are installed.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Installing every package into the system Python.",
          fix: "Create an environment per project and install into it.",
        },
        {
          mistake: "Forgetting to activate the environment, then wondering why an import fails.",
          fix: "Check the prompt, or run python -m pip list to see what the active Python has.",
        },
        {
          mistake: "Committing the .venv directory.",
          fix: "Add .venv to .gitignore and commit requirements.txt instead.",
        },
        {
          mistake: "Copying an environment folder to another machine.",
          fix: "Recreate it from requirements.txt; environments are tied to their location and Python.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Onboarding a teammate",
      scenario:
        "A new teammate clones your project and needs to run it.",
      body: [
        "They run `python -m venv .venv`, activate it and run `python -m pip install -r requirements.txt`. Everyone now has the same package versions you recorded with `pip freeze`.",
        "When you add a new dependency, install it and regenerate `requirements.txt` before committing.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "venv-purpose",
      prompt: "Why use a virtual environment per project?",
      options: [
        "So projects can use different package versions without conflicting",
        "To make Python run faster",
        "To avoid writing requirements.txt",
      ],
      answer: 0,
      explanation:
        "Each environment holds its own packages, so version needs do not clash.",
    },
    {
      type: "single",
      id: "restore-cmd",
      prompt: "Which command installs everything listed in requirements.txt?",
      options: [
        "python -m pip install -r requirements.txt",
        "python -m pip freeze requirements.txt",
        "python -m venv requirements.txt",
      ],
      answer: 0,
      explanation:
        "-r tells pip to read the requirements from a file.",
    },
    {
      type: "truefalse",
      id: "commit-venv",
      statement: "You should commit the .venv directory to version control so teammates have the packages.",
      answer: false,
      explanation:
        "Commit requirements.txt and let each person recreate their own environment.",
    },
    {
      type: "blank",
      id: "freeze-cmd",
      prompt: "python -m pip ___ prints installed packages in the format pip install expects.",
      answer: "freeze",
      explanation:
        "`pip freeze` is used to create a requirements file.",
    },
  ],
  assignment: {
    title: "Reproducible project",
    task: [
      "Create a new folder with a virtual environment, install one third-party package, write a three-line script that imports it and generate requirements.txt.",
      "Delete the environment, recreate it from requirements.txt and run the script again.",
    ],
    checklist: [
      "The environment lives in .venv and was activated",
      "requirements.txt lists the pinned package",
      "The recreated environment runs the script",
      ".venv is listed in .gitignore",
    ],
    hints: ["Use python -m pip list to confirm what is installed."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "env-commands",
      title: "Environment commands",
      task: [
        "Write the shell commands (Unix) to: create an environment in .venv, activate it, install version 2.31.0 of requests, and save the dependencies to requirements.txt.",
      ],
      language: "bash",
      starter: "# your commands",
      solution:
        "python -m venv .venv\nsource .venv/bin/activate\npython -m pip install \"requests==2.31.0\"\npython -m pip freeze > requirements.txt",
      hints: ["The version is given with == after the package name."],
      checklist: [
        "The environment is created with python -m venv",
        "It is activated before installing",
        "The version is pinned with ==",
        "freeze output goes to requirements.txt",
      ],
    },
  ],
  revisionNotes: [
    "A virtual environment isolates a project's Python and packages",
    "python -m venv .venv; activate; deactivate",
    "python -m pip install name, name==version, --upgrade, list, freeze, uninstall",
    "Commit requirements.txt, not .venv; restore with install -r",
  ],
  resources: [
    {
      label: "The Python Tutorial: Virtual environments and packages",
      url: "https://docs.python.org/3/tutorial/venv.html",
    },
    {
      label: "venv: creation of virtual environments",
      url: "https://docs.python.org/3/library/venv.html",
    },
  ],
})
