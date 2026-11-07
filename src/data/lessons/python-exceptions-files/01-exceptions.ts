import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-exceptions-files", {
  slug: "exceptions",
  title: "Exceptions: handling, raising and designing",
  topic: "Exceptions",
  minutes: 50,
  overview:
    "Handle errors with try, except, else and finally, raise your own exceptions, chain causes, and design a small exception hierarchy for an application.",
  objectives: [
    "Use try, except, else and finally and know when each part runs",
    "Catch specific exceptions and avoid bare except",
    "Raise exceptions, re-raise, and chain with raise ... from",
    "Define custom exception classes",
  ],
  prerequisites: ["python-fundamentals"],
  sections: [
    {
      kind: "explain",
      heading: "What exceptions are",
      body: [
        "An **exception** is an object that signals an error. When one is raised, normal execution stops and Python looks up the call stack for a matching `except` clause. If none is found, the program ends and prints a traceback.",
        "Exceptions form a class hierarchy. `BaseException` is the root; `Exception` is the base for ordinary errors. `ValueError`, `TypeError`, `KeyError` and `IndexError` (the last two under `LookupError`) and `ZeroDivisionError` (under `ArithmeticError`) are common built-ins. File problems such as `FileNotFoundError` are subclasses of `OSError`. `KeyboardInterrupt` derives from `BaseException`, not `Exception`, so `except Exception` does not swallow Ctrl+C.",
      ],
    },
    {
      kind: "code",
      heading: "try, except, else, finally",
      example: {
        title: "All four clauses",
        language: "python",
        code: "def div(a, b):\n    try:\n        r = a / b\n    except ZeroDivisionError as e:\n        print(\"caught:\", e)\n        return None\n    except (TypeError, ValueError):\n        print(\"type/value\")\n        return None\n    else:\n        print(\"else ran\")\n        return r\n    finally:\n        print(\"finally ran\")\n\nprint(div(4, 2))\nprint(div(1, 0))\nprint(div(\"a\", 1))",
        walkthrough: [
          "The `try` block holds the code that might fail. The first matching `except` runs; list several exception types in a tuple to handle them the same way.",
          "`else` runs only when the `try` block raised **no** exception. It keeps the success path out of the `try` so you only guard the code that can fail.",
          "`finally` runs **always**: after success, after a handled error, and even when the block returns. Use it for cleanup.",
          "`div(4, 2)` prints `else ran`, `finally ran`, then `2.0`. `div(1, 0)` prints `caught: division by zero` and `finally ran`. `div(\"a\", 1)` raises `TypeError`, printing `type/value` and `finally ran`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Raising and chaining",
      example: {
        title: "raise, re-raise and from",
        language: "python",
        code: "def check(age):\n    if age < 0:\n        raise ValueError(\"age must be >= 0\")\n    return age\n\ntry:\n    check(-1)\nexcept ValueError as e:\n    print(e)\n\ntry:\n    try:\n        1 / 0\n    except ZeroDivisionError:\n        print(\"log\")\n        raise\nexcept ZeroDivisionError:\n    print(\"re-raised\")\n\ntry:\n    try:\n        int(\"x\")\n    except ValueError as e:\n        raise RuntimeError(\"bad config\") from e\nexcept RuntimeError as e:\n    print(e, \"| cause:\", repr(e.__cause__))",
        walkthrough: [
          "`raise ValueError(\"...\")` creates and raises an exception. Choose the built-in type that matches the problem and write a message that says what was wrong.",
          "A bare `raise` inside an `except` re-raises the active exception after you did something, such as logging it.",
          "`raise NewError(...) from e` **chains** exceptions: the new error keeps the original as `__cause__`, so the traceback shows both and you do not lose the root cause.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Custom exceptions",
      example: {
        title: "An application hierarchy",
        language: "python",
        code: "class AppError(Exception):\n    pass\n\nclass NotFound(AppError):\n    def __init__(self, key):\n        super().__init__(f\"{key} not found\")\n        self.key = key\n\ntry:\n    raise NotFound(\"user7\")\nexcept AppError as e:\n    print(type(e).__name__, e, e.key)",
        walkthrough: [
          "Create a base exception for your application (`AppError`) and derive specific ones from it. Callers can then catch the base to handle everything from your library, or a subclass to handle one case.",
          "Add extra data as attributes (`key`) when callers need it, and pass a clear message to `super().__init__`.",
          "Catching `AppError` also catches `NotFound`, so the output is `NotFound user7 not found user7`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "A bare except: or except Exception: that silently passes.",
          fix: "Catch specific exceptions, and log or handle them meaningfully.",
        },
        {
          mistake: "Wrapping large blocks of code in a single try.",
          fix: "Guard only the lines that can fail; use else for the rest.",
        },
        {
          mistake: "Using exceptions for normal control flow in hot paths, or returning error codes instead of raising.",
          fix: "Raise for exceptional conditions and let callers decide how to handle them.",
        },
        {
          mistake: "Losing the original error when wrapping it.",
          fix: "Use raise NewError(...) from e.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Parsing user input",
      scenario:
        "A program asks for a number and should keep asking until the input is valid.",
      body: [
        "Loop with `while True`. In the `try`, convert with `int(text)`; on `ValueError` print a helpful message and continue; in `else`, `break` out of the loop with the value.",
        "Catching only `ValueError` means unrelated bugs still surface instead of being hidden.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "finally-return",
      prompt: "What does this print, in order?",
      code: {
        language: "python",
        code: "def f():\n    try:\n        return \"try\"\n    finally:\n        print(\"cleanup\")\n\nprint(f())",
      },
      options: ["cleanup then try", "try then cleanup", "try only"],
      answer: 0,
      explanation:
        "finally runs before the function actually returns, so cleanup prints first.",
    },
    {
      type: "output",
      id: "else-clause",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "try:\n    x = 10 / 2\nexcept ZeroDivisionError:\n    print(\"zero\")\nelse:\n    print(\"ok\", x)",
      },
      options: ["ok 5.0", "zero", "ok 5"],
      answer: 0,
      explanation:
        "No exception was raised, so else runs. True division gives 5.0.",
    },
    {
      type: "single",
      id: "keyboard-interrupt",
      prompt: "Why does except Exception not catch KeyboardInterrupt?",
      options: [
        "KeyboardInterrupt derives from BaseException, not Exception",
        "It is not a real exception",
        "Python ignores Ctrl+C",
      ],
      answer: 0,
      explanation:
        "Exception is below BaseException, and KeyboardInterrupt sits beside it.",
    },
    {
      type: "truefalse",
      id: "raise-from",
      statement: "raise NewError(...) from e keeps the original exception available as __cause__.",
      answer: true,
      explanation:
        "Chaining preserves the root cause in the traceback and on the new exception.",
    },
  ],
  assignment: {
    title: "A safe converter",
    task: [
      "Write a function parse_age(text) that returns an int, raising a custom InvalidAge exception (derived from ValueError) with a clear message when the text is not a number or is outside 0 to 150. Chain the original error when conversion fails.",
      "Write a loop that calls it on a list of inputs and prints a friendly message for each failure, plus a finally that prints how many inputs were processed.",
    ],
    checklist: [
      "InvalidAge is a custom exception class",
      "The original ValueError is chained with from",
      "Only specific exceptions are caught",
      "A finally block runs once at the end",
    ],
    hints: ["Raise from inside the except ValueError block."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "safe-int",
      title: "Safe int",
      task: [
        "Write safe_int(text, default=None) that returns int(text), or default when text is not a valid integer. safe_int('42') is 42 and safe_int('x', 0) is 0. Catch only the right exceptions (including None as input).",
      ],
      language: "python",
      starter: "def safe_int(text, default=None):\n    pass",
      solution:
        "def safe_int(text, default=None):\n    try:\n        return int(text)\n    except (ValueError, TypeError):\n        return default",
      hints: ["int(None) raises TypeError, not ValueError."],
      checklist: [
        "safe_int('42') is 42",
        "safe_int('x', 0) is 0",
        "safe_int(None) is None",
        "No bare except",
      ],
    },
  ],
  revisionNotes: [
    "try/except/else/finally: else on no error, finally always",
    "Catch specific types; Exception below BaseException; OSError family for files",
    "raise, bare raise to re-raise, raise ... from e to chain",
    "Custom hierarchy: a base AppError with specific subclasses",
  ],
  resources: [
    {
      label: "The Python Tutorial: Errors and exceptions",
      url: "https://docs.python.org/3/tutorial/errors.html",
    },
    {
      label: "Built-in exceptions",
      url: "https://docs.python.org/3/library/exceptions.html",
    },
  ],
})
