import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-exceptions-files", {
  slug: "files",
  title: "Reading and writing files",
  topic: "Files",
  minutes: 40,
  overview:
    "Open text and binary files with the right mode and encoding, read in different ways, append safely, handle file errors and always close files with with.",
  objectives: [
    "Choose among the r, w, a, x modes and text or binary",
    "Read a whole file, line by line or by chunks",
    "Handle FileNotFoundError and FileExistsError",
    "Explain why with and an explicit encoding matter",
  ],
  prerequisites: ["lesson.python-exceptions-files.exceptions"],
  sections: [
    {
      kind: "explain",
      heading: "Opening files",
      body: [
        "`open(path, mode, encoding=...)` returns a file object. The common modes are `\"r\"` (read, the default), `\"w\"` (write, **truncating** the file), `\"a\"` (append) and `\"x\"` (create, failing if the file exists). Add `\"b\"` for binary mode, for example `\"rb\"`.",
        "In text mode you read and write `str` and the file is decoded or encoded with an **encoding**. Always pass `encoding=\"utf-8\"` explicitly so the program behaves the same on every machine. In binary mode you get `bytes`.",
        "Use `with open(...) as f:`. The file is closed automatically when the block ends, even if an error happens, which also makes sure written data is flushed.",
      ],
    },
    {
      kind: "code",
      heading: "Writing and reading",
      example: {
        title: "Three ways to read",
        language: "python",
        code: "path = \"a.txt\"\nwith open(path, \"w\", encoding=\"utf-8\") as f:\n    print(f.write(\"one\\ntwo\\n\"))\n\nwith open(path, encoding=\"utf-8\") as f:\n    print(repr(f.read()))\n\nwith open(path, encoding=\"utf-8\") as f:\n    print(repr(f.readline()), f.readlines())\n\nwith open(path, \"a\", encoding=\"utf-8\") as f:\n    f.writelines([\"three\\n\"])\n\nwith open(path, encoding=\"utf-8\") as f:\n    print([line.rstrip() for line in f])\n\nwith open(path, \"rb\") as f:\n    print(f.read(3))\nprint(f.closed)",
        walkthrough: [
          "`write` returns the number of characters written (`8`). It does not add newlines for you.",
          "`read()` returns the whole file as one string; `readline()` returns one line, and `readlines()` returns the remaining lines as a list. Each line keeps its `\\n`.",
          "Iterating over the file object yields one line at a time without loading the whole file, which is the best choice for large files. `rstrip()` removes the newline.",
          "Opening with `\"a\"` adds to the end. Binary mode returns `bytes`: `f.read(3)` gives `b'one'`. After the `with` block, `f.closed` is `True`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Handling file errors",
      example: {
        title: "Missing and existing files",
        language: "python",
        code: "import contextlib\n\ntry:\n    open(\"/no/such/file.txt\")\nexcept FileNotFoundError as e:\n    print(type(e).__name__, e.errno, e.strerror)\n\nwith open(\"b.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"x\")\n\ntry:\n    open(\"b.txt\", \"x\")\nexcept FileExistsError:\n    print(\"FileExistsError\")\n\nwith contextlib.suppress(FileNotFoundError):\n    open(\"/no/such\").read()\nprint(\"suppressed\")",
        walkthrough: [
          "A missing file raises `FileNotFoundError`, a subclass of `OSError`. It carries `errno` and `strerror`.",
          "Mode `\"x\"` refuses to overwrite: if `b.txt` exists you get `FileExistsError`. This is a safe way to create a new file.",
          "`contextlib.suppress` ignores listed exceptions inside a block. Use it only when ignoring the error is the correct behaviour.",
          "Other related errors are `PermissionError` and `IsADirectoryError`; catch `OSError` to handle all file-system errors together.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Opening with mode 'w' on a file you meant to read or keep.",
          fix: "Double-check the mode; 'w' erases the existing content immediately.",
        },
        {
          mistake: "Reading a huge file with read().",
          fix: "Iterate over the file line by line, or read in chunks.",
        },
        {
          mistake: "Not closing a file.",
          fix: "Always use with.",
        },
        {
          mistake: "Relying on the default encoding.",
          fix: "Pass encoding='utf-8' for text files.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A line-count tool",
      scenario:
        "You need to count the lines that contain a keyword in a large log file.",
      body: [
        "Open the file with `with open(path, encoding=\"utf-8\") as f:` and loop `for line in f:`, adding `1` when `keyword in line`. Memory use stays small however large the file is.",
        "Wrap the open in `try`/`except FileNotFoundError` to print a clear message when the path is wrong.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "write-returns",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "with open(\"a.txt\", \"w\", encoding=\"utf-8\") as f:\n    print(f.write(\"one\\ntwo\\n\"))",
      },
      options: ["8", "2", "None"],
      answer: 0,
      explanation:
        "write returns the number of characters written: 'one\\ntwo\\n' has 8.",
    },
    {
      type: "output",
      id: "binary-read",
      prompt: "What does this print (the file holds the text one, newline, two, newline)?",
      code: {
        language: "python",
        code: "with open(\"a.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"one\\ntwo\\n\")\nwith open(\"a.txt\", \"rb\") as f:\n    print(f.read(3))",
      },
      options: ["b'one'", "'one'", "[111, 110, 101]"],
      answer: 0,
      explanation:
        "Binary mode returns bytes, shown with a b prefix.",
    },
    {
      type: "single",
      id: "x-mode",
      prompt: "What does opening a file with mode \"x\" do when the file already exists?",
      options: ["Raises FileExistsError", "Overwrites it", "Appends to it"],
      answer: 0,
      explanation:
        "x is exclusive creation: it fails rather than overwrite.",
    },
    {
      type: "truefalse",
      id: "with-closes",
      statement: "A file opened in a with block is closed when the block ends, even if an exception occurs.",
      answer: true,
      explanation:
        "The context manager's __exit__ closes the file in every case.",
    },
  ],
  assignment: {
    title: "A log filter",
    task: [
      "Write a script that reads a text file line by line, writes only the lines that contain the word ERROR to a new file, and prints how many lines were copied.",
      "Handle a missing input file with a friendly message and never overwrite an existing output file (use mode x).",
    ],
    checklist: [
      "Both files are opened with with and utf-8",
      "The input is read line by line",
      "FileNotFoundError and FileExistsError are handled",
      "The count is printed at the end",
    ],
    hints: ["Open both files in the same with statement."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "count-lines",
      title: "Count lines",
      task: [
        "Write count_lines(path) that returns the number of lines in a UTF-8 text file without loading the whole file. Return 0 if the file does not exist.",
      ],
      language: "python",
      starter: "def count_lines(path):\n    pass",
      solution:
        "def count_lines(path):\n    try:\n        with open(path, encoding='utf-8') as f:\n            return sum(1 for _ in f)\n    except FileNotFoundError:\n        return 0",
      hints: ["Iterate over the file object and count."],
      checklist: [
        "A three-line file returns 3",
        "A missing file returns 0",
        "The file is not read all at once",
      ],
    },
  ],
  revisionNotes: [
    "Modes r, w (truncates), a, x (fail if exists), b for bytes",
    "read, readline, readlines; iterate for large files",
    "FileNotFoundError, FileExistsError, PermissionError are OSError subclasses",
    "Use with and encoding='utf-8'",
  ],
  resources: [
    {
      label: "The Python Tutorial: Reading and writing files",
      url: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files",
    },
    {
      label: "Built-in functions: open",
      url: "https://docs.python.org/3/library/functions.html#open",
    },
    {
      label: "io: core tools for working with streams",
      url: "https://docs.python.org/3/library/io.html",
    },
  ],
})
