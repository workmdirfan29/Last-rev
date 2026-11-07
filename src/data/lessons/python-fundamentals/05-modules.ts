import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-fundamentals", {
  slug: "modules",
  title: "Modules and packages",
  topic: "Modules",
  minutes: 50,
  overview:
    "Organise code into modules and packages, use import in its forms, understand the __name__ == '__main__' guard and where Python looks for modules.",
  objectives: [
    "Import a module in the common forms and use its names",
    "Create your own module and package",
    "Use the __name__ == '__main__' guard",
    "Explain how sys.path decides what can be imported",
  ],
  prerequisites: ["lesson.python-fundamentals.functions"],
  sections: [
    {
      kind: "explain",
      heading: "What a module is",
      body: [
        "A **module** is a file of Python code, such as `shapes.py`. Its name is the file name without `.py`. A **package** is a directory of modules; a directory with an `__init__.py` file is the traditional marker of a regular package.",
        "Modules keep related code together and give it its own **namespace**, so a function called `parse` in two modules does not collide. The standard library is a large collection of ready-made modules.",
      ],
    },
    {
      kind: "code",
      heading: "Import forms",
      example: {
        title: "Four ways to import",
        language: "python",
        code: "import math\nfrom math import sqrt, pi\nimport math as m\nfrom collections import Counter\n\nprint(math.sqrt(16))\nprint(sqrt(25))\nprint(round(pi, 3))\nprint(m.floor(2.7))\nprint(Counter(\"banana\").most_common(1))",
        walkthrough: [
          "`import math` binds the module name `math`; use its names with a dot: `math.sqrt(16)` is `4.0`.",
          "`from math import sqrt, pi` copies those names into your namespace so you can write `sqrt(25)` directly.",
          "`import math as m` gives the module a shorter alias.",
          "Avoid `from module import *`: it hides where names come from and can overwrite your own.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Your own module and the main guard",
      example: {
        title: "shapes.py",
        language: "python",
        code: "# shapes.py\ndef area(width, height):\n    return width * height\n\ndef main():\n    print(area(3, 4))\n\nif __name__ == \"__main__\":\n    main()",
        walkthrough: [
          "Running `python shapes.py` executes the file with `__name__` set to `\"__main__\"`, so `main()` runs and prints `12`.",
          "From another file, `import shapes` sets `__name__` to `\"shapes\"`, so the guard is false and the module only defines `area` and `main` without running anything.",
          "The guard lets one file be both reusable code and a runnable script.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "How Python finds modules",
      body: [
        "On `import name`, Python first checks whether the module is already loaded (in `sys.modules`). A module is executed only the first time it is imported; later imports reuse the loaded module.",
        "Otherwise it searches the directories in `sys.path`: the directory of the running script, the paths from `PYTHONPATH`, and the installation's standard library and site-packages. If nothing matches you get `ModuleNotFoundError`.",
        "Do not name your own file after a standard library module, such as `random.py` or `math.py`, because yours may be found first and shadow the real one.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Naming a file after a standard module, such as random.py.",
          fix: "Pick a distinct name so the real module is imported.",
        },
        {
          mistake: "Using from module import * everywhere.",
          fix: "Import only the names you need, or the module itself.",
        },
        {
          mistake: "Running code at the top level of a module that others import.",
          fix: "Put it in a function called under the __main__ guard.",
        },
        {
          mistake: "Circular imports between two modules.",
          fix: "Move the shared code to a third module or import inside the function that needs it.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Splitting a script",
      scenario:
        "A single 400-line script has grown hard to read: it parses files, calculates results and prints a report.",
      body: [
        "Move the parsing into `parsing.py`, the calculations into `calc.py` and keep `main.py` as the entry point that imports them. Put the work in functions and call `main()` under the guard.",
        "Each file can now be read, tested and reused on its own.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "main-guard",
      prompt: "When is __name__ equal to \"__main__\"?",
      options: [
        "When the file is run directly as a script",
        "When the file is imported by another file",
        "Always",
      ],
      answer: 0,
      explanation:
        "On import, __name__ is the module name. Only a directly run file gets \"__main__\".",
    },
    {
      type: "output",
      id: "import-use",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "import math\nprint(math.sqrt(16))",
      },
      options: ["4.0", "4", "16"],
      answer: 0,
      explanation:
        "math.sqrt returns a float, so the result is 4.0.",
    },
    {
      type: "truefalse",
      id: "import-once",
      statement: "A module's top-level code runs every time you write import for it.",
      answer: false,
      explanation:
        "A module is executed on the first import; later imports reuse the loaded module.",
    },
    {
      type: "blank",
      id: "search-path",
      prompt: "Python searches the directories listed in sys.___ to find a module.",
      answer: "path",
      explanation:
        "`sys.path` is the list of directories used to locate modules.",
    },
  ],
  assignment: {
    title: "Split and import",
    task: [
      "Create two files: temperature.py with two conversion functions (Celsius to Fahrenheit and back), and app.py that imports them and prints a small table.",
      "Add a main guard to temperature.py that prints a quick self-test when it is run directly, and show that importing it prints nothing.",
    ],
    checklist: [
      "app.py imports from temperature",
      "temperature.py has a __main__ guard",
      "Running each file gives the expected output",
      "The file names do not clash with standard modules",
    ],
    hints: ["Run both files from the same folder."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "main-guard",
      title: "Add a main guard",
      task: [
        "Rewrite this script so importing it does not print anything but running it does:\n\nprint(greet('Ana'))\ndef greet(name): return 'Hello ' + name",
      ],
      language: "python",
      starter: "print(greet('Ana'))\ndef greet(name):\n    return 'Hello ' + name",
      solution:
        "def greet(name):\n    return 'Hello ' + name\n\nif __name__ == '__main__':\n    print(greet('Ana'))",
      hints: ["Define the function first, and call it only under the guard."],
      checklist: [
        "greet is defined before it is used",
        "The print is under the __main__ guard",
        "Importing the module prints nothing",
      ],
    },
  ],
  revisionNotes: [
    "Module = file; package = directory (with __init__.py)",
    "import m, from m import x, import m as alias; avoid import *",
    "if __name__ == '__main__' lets a file be a script and a module",
    "Search order: sys.modules, then sys.path; do not shadow standard modules",
  ],
  resources: [
    {
      label: "The Python Tutorial: Modules",
      url: "https://docs.python.org/3/tutorial/modules.html",
    },
    {
      label: "The import system",
      url: "https://docs.python.org/3/reference/import.html",
    },
    {
      label: "__main__: top-level code environment",
      url: "https://docs.python.org/3/library/__main__.html",
    },
  ],
})
