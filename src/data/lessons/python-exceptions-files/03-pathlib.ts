import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-exceptions-files", {
  slug: "pathlib",
  title: "pathlib: working with paths",
  topic: "pathlib",
  minutes: 35,
  overview:
    "Build, inspect and use file-system paths with pathlib.Path: the / operator, name parts, existence checks, directories, globbing, reading and writing text.",
  objectives: [
    "Build paths with Path and the / operator",
    "Read name, stem, suffix and parent",
    "Create directories, list and glob files",
    "Read and write text with Path methods",
  ],
  prerequisites: ["lesson.python-exceptions-files.files"],
  sections: [
    {
      kind: "explain",
      heading: "Paths as objects",
      body: [
        "The `pathlib` module represents file-system paths as **objects** instead of strings. `Path(\"a/b\")` works on every operating system and handles separators for you, so you do not glue strings together with `/` or `\\`.",
        "Join parts with the `/` operator: `Path(\"data\") / \"sub\" / \"x.csv\"`. A `Path` can be passed to `open()` and most standard library functions.",
        "Pure operations such as getting the name only work on the path text. Others, such as `exists()` or `mkdir()`, talk to the file system.",
      ],
    },
    {
      kind: "code",
      heading: "Parts of a path",
      example: {
        title: "Name, stem, suffix and parent",
        language: "python",
        code: "from pathlib import Path\n\nq = Path(\"data\") / \"sub\" / \"data.csv\"\nprint(q.name, q.stem, q.suffix, q.parent.name)\nprint(q.with_suffix(\".json\").name, q.is_absolute())\nprint(Path(\"a/b/../c\").parts)\nprint(Path(\"x.tar.gz\").suffixes)\nprint(Path(\"/a/b\").relative_to(\"/a\"))\nprint(Path(\"report.txt\").with_name(\"final.txt\"))",
        walkthrough: [
          "`name` is `data.csv`, `stem` is the name without the last suffix (`data`), `suffix` is `.csv` and `parent` is the directory `sub`.",
          "`with_suffix` and `with_name` return a **new** path; paths are immutable.",
          "`parts` splits the path into components, without resolving `..`. `suffixes` lists all suffixes: `['.tar', '.gz']`.",
          "`relative_to` returns the part after the given prefix: `b`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Working with the file system",
      example: {
        title: "mkdir, write_text, glob",
        language: "python",
        code: "from pathlib import Path\n\nbase = Path(\"work\")\nq = base / \"sub\" / \"data.csv\"\nq.parent.mkdir(parents=True, exist_ok=True)\nprint(q.exists())\nprint(q.write_text(\"a,b\\n1,2\\n\", encoding=\"utf-8\"))\nprint(q.exists(), q.is_file(), q.parent.is_dir())\nprint(q.read_text(encoding=\"utf-8\").splitlines())\n(base / \"note.txt\").write_text(\"hi\", encoding=\"utf-8\")\nprint(sorted(x.name for x in base.iterdir()))\nprint(sorted(x.name for x in base.glob(\"**/*.csv\")))\nprint(sorted(x.name for x in base.rglob(\"*.txt\")))\nprint(q.stat().st_size)\nq.unlink()\nprint(q.exists())",
        walkthrough: [
          "`mkdir(parents=True, exist_ok=True)` creates all missing parent directories and does not fail if the directory already exists.",
          "`write_text` writes a string and returns the number of characters written; `read_text` reads the whole file back. Pass `encoding` explicitly.",
          "`iterdir()` lists the entries of one directory. `glob(\"**/*.csv\")` and `rglob(\"*.csv\")` search recursively for matching names.",
          "`stat().st_size` is the file size in bytes. `unlink()` deletes a file, after which `exists()` is `False`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Building paths with string concatenation and hard-coded separators.",
          fix: "Use Path and the / operator.",
        },
        {
          mistake: "Assuming a relative path refers to the script's folder.",
          fix: "Relative paths depend on the current working directory; build from Path(__file__).parent when needed.",
        },
        {
          mistake: "Checking exists() and then opening, trusting nothing changed in between.",
          fix: "Open inside try/except FileNotFoundError.",
        },
        {
          mistake: "Forgetting that mkdir fails if the folder exists.",
          fix: "Pass exist_ok=True.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Organising downloads",
      scenario:
        "You want to list all .pdf files in a folder tree and move them into one folder.",
      body: [
        "`target = Path(\"pdfs\"); target.mkdir(exist_ok=True)` then `for p in Path(\"downloads\").rglob(\"*.pdf\"): p.rename(target / p.name)`.",
        "Use `p.name` for the destination so each file keeps its name, and check for name clashes first if the folder may already contain files with the same name.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "path-parts",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "from pathlib import Path\nq = Path(\"data\") / \"sub\" / \"data.csv\"\nprint(q.stem, q.suffix)",
      },
      options: ["data .csv", "data.csv csv", "sub .csv"],
      answer: 0,
      explanation:
        "stem is the file name without its last suffix, and suffix includes the dot.",
    },
    {
      type: "output",
      id: "path-suffixes",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "from pathlib import Path\nprint(Path(\"x.tar.gz\").suffixes)",
      },
      options: ["['.tar', '.gz']", "['.gz']", "['tar', 'gz']"],
      answer: 0,
      explanation:
        "suffixes lists every suffix in order, each with its dot.",
    },
    {
      type: "single",
      id: "mkdir-flags",
      prompt: "Which call creates a directory and all missing parents without failing if it exists?",
      options: [
        "mkdir(parents=True, exist_ok=True)",
        "mkdir()",
        "touch()",
      ],
      answer: 0,
      explanation:
        "parents=True creates the parents and exist_ok=True ignores an existing directory.",
    },
    {
      type: "truefalse",
      id: "path-immutable",
      statement: "Path.with_suffix(\".json\") changes the original path object.",
      answer: false,
      explanation:
        "Path objects are immutable; the method returns a new path.",
    },
  ],
  assignment: {
    title: "A folder report",
    task: [
      "Write a script that takes a folder path, walks it recursively with rglob and prints, for each file extension, how many files have it and their total size in bytes.",
      "Write the report to report.txt inside that folder using Path.write_text, and skip directories.",
    ],
    checklist: [
      "Only files are counted (is_file)",
      "Extensions are grouped, including files with no extension",
      "The report is written with write_text and utf-8",
      "No path is built with string concatenation",
    ],
    hints: ["`collections.Counter` or a dict keyed by `p.suffix` works well."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "change-extension",
      title: "Change extensions",
      task: [
        "Write to_json_names(paths) that takes a list of path strings and returns a list of file names (not full paths) with the extension replaced by .json. to_json_names(['a/x.csv', 'b/y.txt']) is ['x.json', 'y.json'].",
      ],
      language: "python",
      starter: "from pathlib import Path\n\ndef to_json_names(paths):\n    pass",
      solution:
        "from pathlib import Path\n\ndef to_json_names(paths):\n    return [Path(p).with_suffix('.json').name for p in paths]",
      hints: ["with_suffix then name."],
      checklist: [
        "to_json_names(['a/x.csv', 'b/y.txt']) is ['x.json', 'y.json']",
        "Directories are not included in the result",
        "An empty list returns an empty list",
      ],
    },
  ],
  revisionNotes: [
    "Path objects, / to join, immutable; name, stem, suffix, parent, with_suffix",
    "exists, is_file, is_dir, mkdir(parents, exist_ok), unlink, rename",
    "iterdir, glob, rglob; read_text and write_text with encoding",
    "Relative paths depend on the working directory",
  ],
  resources: [
    {
      label: "pathlib: object-oriented filesystem paths",
      url: "https://docs.python.org/3/library/pathlib.html",
    },
    {
      label: "The Python Tutorial: Reading and writing files",
      url: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files",
    },
  ],
})
