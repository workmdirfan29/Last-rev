import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-exceptions-files", {
  slug: "json-csv",
  title: "Reading and writing JSON and CSV",
  topic: "JSON/CSV",
  minutes: 45,
  overview:
    "Serialize Python data to JSON and read it back, understand which types survive the round trip, and read and write CSV files with csv.reader, DictReader, writer and DictWriter.",
  objectives: [
    "Convert between Python objects and JSON text or files",
    "Explain which Python values do not survive a JSON round trip",
    "Read and write CSV with the csv module and newline=''",
    "Handle JSON and CSV errors",
  ],
  prerequisites: ["lesson.python-exceptions-files.pathlib"],
  sections: [
    {
      kind: "explain",
      heading: "Two common formats",
      body: [
        "**JSON** is a text format for nested data: objects (key-value pairs), arrays, strings, numbers, `true`, `false` and `null`. The `json` module maps these to Python `dict`, `list`, `str`, `int`/`float`, `True`, `False` and `None`.",
        "**CSV** (comma-separated values) stores a table as lines of text, one row per line, with fields separated by a delimiter. The `csv` module handles quoting, so a field such as `New York, NY` that contains a comma is written and read correctly.",
        "Functions ending in `s` work with **strings** (`dumps`, `loads`); the ones without it work with **file objects** (`dump`, `load`).",
      ],
    },
    {
      kind: "code",
      heading: "JSON round trip",
      example: {
        title: "dumps, loads, dump and load",
        language: "python",
        code: "import json\n\ndata = {\"name\": \"Ana\", \"age\": 30, \"tags\": [\"a\", \"b\"], \"ok\": True, \"none\": None, \"pi\": 3.14}\ns = json.dumps(data)\nprint(s)\nback = json.loads(s)\nprint(back == data)\nprint(json.dumps({\"x\": (1, 2)}))\nprint(json.dumps({1: \"a\"}), json.loads(json.dumps({1: \"a\"})))\nprint(json.dumps(\"\\u00e9\"), json.dumps(\"\\u00e9\", ensure_ascii=False))\n\nwith open(\"d.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(data, f, indent=2)\nwith open(\"d.json\", encoding=\"utf-8\") as f:\n    print(json.load(f)[\"name\"])",
        walkthrough: [
          "`dumps` turns the object into text: `True` becomes `true` and `None` becomes `null`. `loads` parses it back, so `back == data` is `True`.",
          "Not everything survives. A **tuple** becomes a JSON array and returns as a **list**. Dictionary keys must be strings in JSON, so an integer key `1` becomes `\"1\"` and comes back as a string.",
          "By default non-ASCII characters are escaped (`\"\\u00e9\"`). `ensure_ascii=False` keeps the readable character.",
          "`dump(obj, f)` and `load(f)` use a file. `indent=2` pretty-prints; `sort_keys=True` orders the keys.",
        ],
      },
    },
    {
      kind: "code",
      heading: "JSON errors",
      example: {
        title: "Bad input and unsupported types",
        language: "python",
        code: "import json\n\ntry:\n    json.loads(\"{'a': 1}\")\nexcept json.JSONDecodeError as e:\n    print(\"JSONDecodeError:\", e)\n\ntry:\n    json.dumps({1, 2})\nexcept TypeError as e:\n    print(\"TypeError:\", e)",
        walkthrough: [
          "JSON requires **double quotes**. Single-quoted text is invalid, so `loads` raises `JSONDecodeError`, a subclass of `ValueError`, with the position of the problem.",
          "A `set` has no JSON equivalent, so `dumps` raises `TypeError: Object of type set is not JSON serializable`. Convert it first, for example `sorted(my_set)`, or pass a `default=` function.",
        ],
      },
    },
    {
      kind: "code",
      heading: "CSV",
      example: {
        title: "reader, DictReader, writer and DictWriter",
        language: "python",
        code: "import csv\n\nwith open(\"t.csv\", \"w\", newline=\"\", encoding=\"utf-8\") as f:\n    w = csv.writer(f)\n    w.writerow([\"name\", \"city\"])\n    w.writerow([\"Ana\", \"New York, NY\"])\n    w.writerows([[\"Bo\", \"Rome\"]])\n\nwith open(\"t.csv\", encoding=\"utf-8\") as f:\n    print(f.read().splitlines())\n\nwith open(\"t.csv\", newline=\"\", encoding=\"utf-8\") as f:\n    print(list(csv.reader(f)))\n\nwith open(\"t.csv\", newline=\"\", encoding=\"utf-8\") as f:\n    for row in csv.DictReader(f):\n        print(row[\"name\"], row[\"city\"])\n\nwith open(\"u.csv\", \"w\", newline=\"\", encoding=\"utf-8\") as f:\n    dw = csv.DictWriter(f, fieldnames=[\"id\", \"name\"])\n    dw.writeheader()\n    dw.writerow({\"id\": 1, \"name\": \"A\"})\nwith open(\"u.csv\", newline=\"\", encoding=\"utf-8\") as f:\n    row = list(csv.reader(f))[1]\n    print(row, type(row[0]).__name__)",
        walkthrough: [
          "Open CSV files with `newline=\"\"` so the module controls line endings itself.",
          "`writerow` writes one row; `writerows` writes many. The field `New York, NY` contains a comma, so it is written in quotes: `Ana,\"New York, NY\"`.",
          "`csv.reader` yields each row as a **list of strings**; the quoted field is read back as one value.",
          "`csv.DictReader` uses the first row as keys and yields a dict per row, so you read by column name. `DictWriter` needs `fieldnames`, and `writeheader()` writes them.",
          "Every value read from CSV is a **string**, even a number: `['1', 'A']` has type `str`. Convert with `int()` or `float()` yourself. Another delimiter can be set with `delimiter=\";\"`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Splitting CSV lines with line.split(',').",
          fix: "Use the csv module so quoted commas and newlines are handled.",
        },
        {
          mistake: "Opening a CSV file without newline=''.",
          fix: "Pass newline='' so line endings are not mangled or doubled.",
        },
        {
          mistake: "Assuming numbers read from CSV are numbers.",
          fix: "They are strings; convert them explicitly.",
        },
        {
          mistake: "Expecting a tuple, set or integer dict key to survive JSON.",
          fix: "Remember tuples become lists and keys become strings; convert sets before dumping.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Converting CSV to JSON",
      scenario:
        "You have a customers.csv file and an API that expects a JSON array of objects.",
      body: [
        "Read with `csv.DictReader`, convert numeric columns, collect the rows in a list and write them with `json.dump(rows, f, indent=2)`.",
        "Because every CSV value starts as a string, convert columns such as `age` with `int()` before dumping, or the JSON will carry the numbers as strings.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "tuple-json",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "import json\nprint(json.loads(json.dumps({\"x\": (1, 2)})))",
      },
      options: ["{'x': [1, 2]}", "{'x': (1, 2)}", "A TypeError"],
      answer: 0,
      explanation:
        "JSON has arrays, not tuples, so the tuple comes back as a list.",
    },
    {
      type: "output",
      id: "int-key-json",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "import json\nprint(json.loads(json.dumps({1: \"a\"})))",
      },
      options: ["{'1': 'a'}", "{1: 'a'}", "A TypeError"],
      answer: 0,
      explanation:
        "JSON object keys are always strings, so the integer key becomes '1'.",
    },
    {
      type: "output",
      id: "csv-types",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "import csv, io\nrow = next(csv.reader(io.StringIO(\"1,A\\n\")))\nprint(row)",
      },
      options: ["['1', 'A']", "[1, 'A']", "('1', 'A')"],
      answer: 0,
      explanation:
        "csv.reader returns lists of strings; numbers must be converted by you.",
    },
    {
      type: "truefalse",
      id: "json-single-quotes",
      statement: "json.loads(\"{'a': 1}\") works because Python accepts single quotes.",
      answer: false,
      explanation:
        "JSON requires double quotes. Single quotes raise JSONDecodeError.",
    },
  ],
  assignment: {
    title: "CSV to JSON converter",
    task: [
      "Write a script that reads people.csv (name, age, city) with DictReader, converts age to int, drops rows with an invalid age (printing a warning), and writes the result to people.json with indent.",
      "Then read people.json back and write a summary CSV with the city and the number of people in it.",
    ],
    checklist: [
      "Both csv and json modules are used, not manual splitting",
      "age is converted and invalid rows are skipped with a message",
      "Files are opened with encoding and newline='' for CSV",
      "The summary CSV has a header row",
    ],
    hints: ["Catch ValueError around int(row['age'])."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "csv-total",
      title: "Sum a column",
      task: [
        "Write total_price(text) that takes CSV text with the header 'item,price' and returns the sum of the price column as a float. Use csv.DictReader with io.StringIO. total_price('item,price\\na,1.5\\nb,2\\n') is 3.5.",
      ],
      language: "python",
      starter: "import csv\nimport io\n\ndef total_price(text):\n    pass",
      solution:
        "import csv\nimport io\n\ndef total_price(text):\n    reader = csv.DictReader(io.StringIO(text))\n    return sum(float(row['price']) for row in reader)",
      hints: ["Convert each price with float()."],
      checklist: [
        "total_price('item,price\\na,1.5\\nb,2\\n') is 3.5",
        "Header-only text returns 0",
        "csv.DictReader is used",
      ],
    },
  ],
  revisionNotes: [
    "dumps/loads use strings; dump/load use files; indent and sort_keys",
    "Tuples become lists, keys become strings, sets need conversion",
    "csv.reader gives lists, DictReader gives dicts; always newline=''",
    "All CSV values are strings; JSONDecodeError for invalid JSON",
  ],
  resources: [
    {
      label: "json: JSON encoder and decoder",
      url: "https://docs.python.org/3/library/json.html",
    },
    {
      label: "csv: CSV file reading and writing",
      url: "https://docs.python.org/3/library/csv.html",
    },
    {
      label: "The Python Tutorial: Saving structured data with json",
      url: "https://docs.python.org/3/tutorial/inputoutput.html#saving-structured-data-with-json",
    },
  ],
})
