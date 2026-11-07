import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-fundamentals", {
  slug: "strings-and-io",
  title: "Strings, formatting and file input/output",
  topic: "Strings & I/O",
  minutes: 60,
  overview:
    "Work with immutable strings, slicing and methods, format output with f-strings, read input, and read and write text files safely with a with block.",
  objectives: [
    "Slice and transform strings with methods",
    "Format values with f-strings and format specifiers",
    "Read user input and print with sep and end",
    "Read and write text files using with and an explicit encoding",
  ],
  prerequisites: ["lesson.python-fundamentals.types"],
  sections: [
    {
      kind: "explain",
      heading: "Strings",
      body: [
        "A `str` is an **immutable** sequence of Unicode characters. You cannot change a character in place: `t[0] = \"x\"` raises a `TypeError`. Methods such as `strip()`, `lower()` and `replace()` return a **new** string.",
        "Strings support indexing and slicing like lists. `s[1:4]` is the characters at positions 1, 2 and 3; `s[-3:]` is the last three; `s[::-1]` is the reversed string. `len()` counts characters, not bytes.",
        "Common methods: `split()`, `join()`, `strip()`, `replace()`, `find()`, `count()`, `startswith()`, `upper()`, `lower()` and `title()`.",
      ],
    },
    {
      kind: "code",
      heading: "Methods and slices",
      example: {
        title: "Transforming text",
        language: "python",
        code: "t = \"  Hello, World  \"\nprint(t.strip())\nprint(t.strip().lower())\nprint(t.split(\",\"))\nprint(\"-\".join([\"a\", \"b\"]))\nprint(\"python\"[1:4], \"python\"[-3:], \"abc\"[::-1])\nprint(\"a b  c\".split())\nprint(\"banana\".count(\"a\"), \"abc\".find(\"z\"))",
        walkthrough: [
          "`strip()` removes whitespace at both ends, and `lower()` lower-cases: `hello, world`.",
          "`split(\",\")` returns a list: `['  Hello', ' World  ']`. With no argument, `split()` splits on any run of whitespace, so `\"a b  c\".split()` is `['a', 'b', 'c']`.",
          "`\"-\".join([\"a\", \"b\"])` glues a list of strings with the separator: `a-b`.",
          "Slices give `yth`, `hon` and `cba`. `find` returns `-1` when the text is not found, and `count` counts non-overlapping matches.",
        ],
      },
    },
    {
      kind: "code",
      heading: "f-strings",
      example: {
        title: "Formatting numbers",
        language: "python",
        code: "name = \"Ana\"\nprice = 3.14159\nqty = 7\nprint(f\"{name} paid {price:.2f}\")\nprint(f\"[{qty:>5}] [{qty:<5}] [{qty:05d}]\")\nprint(f\"{1234567:,}\")\nprint(f\"{0.256:.1%}\")\nprint(\"a\", \"b\", sep=\"-\", end=\"!\\n\")",
        walkthrough: [
          "An **f-string** starts with `f` and evaluates expressions inside braces. A format specifier follows a colon.",
          "`:.2f` means two decimal places: `3.14`. `:>5` right-aligns in a width of 5, `:<5` left-aligns, and `:05d` pads an integer with zeros to 5 digits.",
          "`:,` adds thousands separators (`1,234,567`) and `:.1%` shows a ratio as a percentage (`25.6%`).",
          "`print` accepts `sep` (between items) and `end` (after the last item, default newline): the last line prints `a-b!`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Reading and writing files",
      example: {
        title: "Using with",
        language: "python",
        code: "with open(\"notes.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"first\\n\")\n    f.write(\"second\\n\")\n\nwith open(\"notes.txt\", encoding=\"utf-8\") as f:\n    for line in f:\n        print(line.rstrip())\n\nwith open(\"notes.txt\", \"a\", encoding=\"utf-8\") as f:\n    f.write(\"third\\n\")",
        walkthrough: [
          "`open(path, mode, encoding=...)` returns a file object. Modes: `\"r\"` read (default), `\"w\"` write (replaces the file), `\"a\"` append.",
          "Using `with` closes the file automatically, even if an error occurs, so you do not need to call `close()`.",
          "Iterating over the file gives one line at a time, including the newline; `rstrip()` removes it.",
          "State `encoding=\"utf-8\"` explicitly so the behaviour does not depend on the machine's default.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Trying to change a character with s[0] = 'x'.",
          fix: "Build a new string, for example with slicing or replace().",
        },
        {
          mistake: "Building a long string with += in a loop.",
          fix: "Collect pieces in a list and use ''.join(parts).",
        },
        {
          mistake: "Opening a file without with and forgetting to close it.",
          fix: "Always use a with block.",
        },
        {
          mistake: "Opening with mode 'w' on a file you meant to keep.",
          fix: "'w' truncates the file; use 'a' to append.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Counting words in a file",
      scenario:
        "You need the number of lines and words in a text file.",
      body: [
        "Open the file with `with open(path, encoding=\"utf-8\") as f:`, loop over the lines, and add `len(line.split())` to a running total. Print the result with an f-string such as `f\"{lines} lines, {words} words\"`.",
        "Because the file is read line by line, the program works even for a large file.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "slice-output",
      prompt: "What does this print?",
      code: { language: "python", code: "print(\"python\"[1:4])" },
      options: ["yth", "pyth", "ytho"],
      answer: 0,
      explanation:
        "A slice includes the start index and excludes the stop index: positions 1, 2 and 3.",
    },
    {
      type: "output",
      id: "fstring-output",
      prompt: "What does this print?",
      code: { language: "python", code: "print(f\"{3.14159:.2f}\")" },
      options: ["3.14", "3.1", "3.14159"],
      answer: 0,
      explanation:
        ".2f rounds to two decimal places.",
    },
    {
      type: "single",
      id: "write-mode",
      prompt: "What does opening a file with mode \"w\" do to an existing file?",
      options: [
        "Replaces its contents",
        "Appends to the end",
        "Opens it read-only",
      ],
      answer: 0,
      explanation:
        "Mode 'w' truncates the file. Use 'a' to append.",
    },
    {
      type: "truefalse",
      id: "str-immutable",
      statement: "Strings are immutable, so s.upper() returns a new string and leaves s unchanged.",
      answer: true,
      explanation:
        "String methods never modify the original string.",
    },
  ],
  assignment: {
    title: "A text report",
    task: [
      "Write a script that reads a text file, then writes a report file with the number of lines, the number of words and the three longest words, formatted with f-strings.",
      "Use with for both files and strip each line before counting.",
    ],
    checklist: [
      "Both files are opened with with and an explicit encoding",
      "Counts are correct for a sample file",
      "The report uses f-strings with a format specifier",
      "The script does not load the whole file when counting lines",
    ],
    hints: ["`sorted(words, key=len, reverse=True)[:3]` gives the three longest words."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "clean-and-join",
      title: "Clean and join",
      task: [
        "Write tidy(parts) that takes a list of strings, strips each one, drops the blank ones, lower-cases the rest and returns them joined with a comma and no spaces.",
      ],
      language: "python",
      starter: "def tidy(parts):\n    pass",
      solution:
        "def tidy(parts):\n    cleaned = [p.strip().lower() for p in parts if p.strip()]\n    return ','.join(cleaned)",
      hints: ["Strip before testing whether the piece is blank."],
      checklist: [
        "tidy([' A ', '', 'B']) is 'a,b'",
        "An all-blank list returns ''",
        "The original list is not changed",
      ],
    },
  ],
  revisionNotes: [
    "Strings are immutable; methods return new strings",
    "Slicing s[start:stop:step]; split and join are inverses",
    "f-string specs: .2f, >5, 05d, comma, .1%",
    "Use with open(..., encoding='utf-8'); r, w (truncates), a",
  ],
  resources: [
    {
      label: "The Python Tutorial: Input and output",
      url: "https://docs.python.org/3/tutorial/inputoutput.html",
    },
    {
      label: "Format specification mini-language",
      url: "https://docs.python.org/3/library/string.html#format-specification-mini-language",
    },
    {
      label: "Text sequence type: str",
      url: "https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str",
    },
  ],
})
