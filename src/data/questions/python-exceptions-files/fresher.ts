import { defineQuestions } from "../author"
import { q } from "../compact"

const D = "https://docs.python.org/3"
const PEP = "https://peps.python.org"

export default defineQuestions("python-exceptions-files", "fresher", [
  q({
    slug: "try-except-else-finally",
    topic: "Exceptions",
    d: "easy",
    title: "How do `try`, `except`, `else` and `finally` work together?",
    kw: [
      "try except",
      "else clause",
      "finally",
      "exception handling",
      "control flow",
    ],
    intent: "Checks the full shape of exception handling.",
    short:
      "Code that might fail goes in the `try` block. If an exception occurs, Python looks for the first matching `except` clause and runs it; otherwise the exception propagates up the call stack. The optional `else` block runs only when the `try` block raised nothing, which keeps code that should not be protected out of the `try`. The optional `finally` block always runs, whether or not there was an exception, and is meant for cleanup such as closing resources. An `except` clause can name several types in a tuple and bind the exception with `as e`.",
    detail: [
      "Keep the `try` body as small as possible so you catch only what you expect.",
      "`with` statements usually replace `finally` for cleanup of files and locks.",
      "The name bound by `as e` is deleted at the end of the except block.",
    ],
    ex: "Parsing user input in `try`, using the value in `else`, and always logging in `finally`.",
    code: [
      [
        "Full structure",
        "python",
        `def parse(text):\n    try:\n        n = int(text)\n    except ValueError as e:\n        print("bad number:", e)\n        return None\n    else:\n        return n * 2\n    finally:\n        print("done")\n\nprint(parse("21"))   # done, 42\nprint(parse("x"))    # bad number..., done, None`,
        ["`else` runs only on success.", "`finally` runs both times."],
      ],
    ],
    mistakes: [
      "Putting too much code inside try.",
      "Catching an exception and doing nothing.",
    ],
    follow: ["When does the else clause run?"],
    points: [
      "try holds risky code",
      "except handles matching errors",
      "else runs on success",
      "finally always runs",
    ],
    notes: ["Try, handle, else, finally."],
    src: [
      ["Python tutorial: Errors and exceptions", `${D}/tutorial/errors.html`],
      [
        "Python: Compound statements (try)",
        `${D}/reference/compound_stmts.html`,
      ],
    ],
  }),
  q({
    slug: "specific-exceptions-and-bare-except",
    topic: "Exceptions",
    d: "easy",
    title: "Why is a bare `except:` or `except Exception:` usually a bad idea?",
    kw: [
      "bare except",
      "except Exception",
      "baseexception",
      "keyboardinterrupt",
      "swallowing errors",
    ],
    intent: "Checks good handling habits.",
    short:
      "A bare `except:` catches everything, including `KeyboardInterrupt` and `SystemExit`, so the program cannot be stopped with Ctrl+C and real programming errors are hidden; the Python tutorial advises using it with extreme caution. `except Exception:` is narrower, because `KeyboardInterrupt`, `SystemExit` and `GeneratorExit` derive directly from `BaseException`, but it still hides bugs such as `TypeError` or `NameError`. Catch the most specific exceptions you can actually handle, and let others propagate to a top-level handler that logs them. If you must catch broadly, log the traceback and re-raise.",
    detail: [
      "A silent `except: pass` is one of the hardest bugs to diagnose.",
      "Order `except` clauses from most specific to most general.",
      "Handle an error where you can do something useful about it.",
    ],
    ex: "Catching `FileNotFoundError` to create a default file, but letting permission problems surface.",
    mistakes: ["except: pass.", "Catching Exception around a large block."],
    follow: ["Which exceptions does except Exception not catch?"],
    points: [
      "Bare except catches even Ctrl+C",
      "Exception excludes system-exiting errors",
      "Catch what you can handle",
      "Log and re-raise if broad",
    ],
    notes: ["Be specific."],
    src: [
      ["Python tutorial: Handling exceptions", `${D}/tutorial/errors.html`],
      [
        "Python: Built-in exceptions (hierarchy)",
        `${D}/library/exceptions.html`,
      ],
    ],
  }),
  q({
    slug: "builtin-exception-types",
    topic: "Exceptions",
    d: "easy",
    title:
      "Which built-in exceptions should you recognise, and what causes them?",
    kw: ["valueerror", "typeerror", "keyerror", "indexerror", "attributeerror"],
    intent: "Checks knowledge of everyday exceptions.",
    short:
      "`ValueError`: right type, unsuitable value, like `int('abc')`. `TypeError`: wrong type for an operation, like `'a' + 1`. `KeyError`: missing dictionary key. `IndexError`: sequence index out of range. `AttributeError`: the object has no such attribute. `NameError`: a name that is not defined. `ZeroDivisionError`: division by zero. `FileNotFoundError` and `PermissionError` are subclasses of `OSError`. `ImportError` (and its subclass `ModuleNotFoundError`) signals failed imports, `StopIteration` marks the end of an iterator and `AssertionError` is raised by a failing `assert`. `KeyError` and `IndexError` share the parent `LookupError`.",
    detail: [
      "Catching `OSError` covers many file and network problems.",
      "`UnboundLocalError` is a subclass of `NameError`.",
      "Read the traceback's last line first: it names the exception and message.",
    ],
    ex: "`{}['x']` raises `KeyError`, while `[][0]` raises `IndexError`.",
    mistakes: [
      "Confusing ValueError with TypeError.",
      "Catching LookupError when you meant only KeyError.",
    ],
    follow: ["Which common parent do KeyError and IndexError share?"],
    points: [
      "ValueError vs TypeError",
      "KeyError and IndexError are LookupErrors",
      "File problems are OSError subclasses",
      "Read the last traceback line",
    ],
    notes: ["Know the usual suspects."],
    src: [
      ["Python: Built-in exceptions", `${D}/library/exceptions.html`],
      ["Python tutorial: Errors and exceptions", `${D}/tutorial/errors.html`],
    ],
  }),
  q({
    slug: "raise-and-reraise",
    topic: "Exceptions",
    d: "medium",
    title: "How do you raise an exception and re-raise one you caught?",
    kw: [
      "raise",
      "re-raise",
      "bare raise",
      "raise from",
      "exception propagation",
    ],
    intent: "Checks raising and propagation.",
    short:
      "`raise ValueError('message')` raises an exception instance; `raise ValueError` raises the class and Python creates the instance. Inside an `except` block, a bare `raise` re-raises the exception being handled with its original traceback, which is the right way to log or clean up and then let the error continue. Raising a new exception inside an `except` block links it to the original automatically. Use `raise NewError(...) from original` to state the cause explicitly. Pick the exception type that matches the problem, with a clear message that names the bad value.",
    detail: [
      "Use `raise` rather than `raise e`, so the traceback is not extended unnecessarily.",
      "Do not use exceptions for ordinary control flow where a simple check is clearer.",
      "Validate arguments early and raise `ValueError` or `TypeError` with a helpful message.",
    ],
    ex: "A function that logs a database error and then re-raises it to the caller.",
    code: [
      [
        "Log and re-raise",
        "python",
        `import logging\n\ndef load(path):\n    try:\n        return open(path, encoding="utf-8").read()\n    except OSError:\n        logging.exception("cannot read %s", path)\n        raise   # same exception continues\n\ndef set_age(age):\n    if age < 0:\n        raise ValueError(f"age must be >= 0, got {age}")`,
        [
          "Bare `raise` keeps the original error.",
          "The message includes the bad value.",
        ],
      ],
    ],
    mistakes: [
      "Swallowing the exception after logging.",
      "Vague messages like 'error'.",
    ],
    follow: ["What does a bare raise do outside an except block?"],
    points: [
      "raise Class(msg)",
      "Bare raise re-raises",
      "Preserves traceback",
      "Clear messages",
    ],
    notes: ["Raise early, re-raise after cleanup."],
    src: [
      ["Python tutorial: Raising exceptions", `${D}/tutorial/errors.html`],
      ["Python: Simple statements (raise)", `${D}/reference/simple_stmts.html`],
    ],
  }),
  q({
    slug: "exception-chaining-from",
    topic: "Exceptions",
    d: "medium",
    title:
      "What is exception chaining, and what do `raise ... from` and `from None` do?",
    kw: [
      "exception chaining",
      "raise from",
      "__cause__",
      "__context__",
      "from None",
    ],
    intent: "Checks understanding of tracebacks with multiple errors.",
    short:
      "If a new exception is raised while another is being handled, Python links them implicitly: the earlier one is stored in `__context__` and the traceback says 'During handling of the above exception, another exception occurred'. With `raise NewError(...) from err`, you chain explicitly: `err` becomes `__cause__` and the message says it was the direct cause. This is useful for translating low-level errors, such as `KeyError`, into domain errors, such as `ConfigError`, while keeping the original for debugging. `raise ... from None` hides the earlier exception from the displayed traceback when it adds only noise.",
    detail: [
      "Keep the original cause unless it leaks sensitive details.",
      "Logging the full chain helps diagnose issues across layers.",
      "PEP 3134 introduced chaining.",
    ],
    ex: "A config loader turns a missing key into `ConfigError('database url missing') from e`.",
    code: [
      [
        "Explicit chaining",
        "python",
        `class ConfigError(Exception): pass\n\ndef get(cfg, key):\n    try:\n        return cfg[key]\n    except KeyError as e:\n        raise ConfigError(f"missing setting: {key}") from e\n\ntry:\n    get({}, "url")\nexcept ConfigError as err:\n    print(type(err.__cause__).__name__)  # KeyError`,
        ["The original error is kept as the cause."],
      ],
    ],
    mistakes: [
      "Dropping the original error and losing debugging information.",
      "Overusing from None.",
    ],
    follow: ["What is the difference between __cause__ and __context__?"],
    points: [
      "Implicit chaining sets __context__",
      "from sets __cause__",
      "from None hides context",
      "Translate errors between layers",
    ],
    notes: ["Keep the cause."],
    src: [
      ["Python tutorial: Exception chaining", `${D}/tutorial/errors.html`],
      [
        "PEP 3134: Exception chaining and embedded tracebacks",
        `${PEP}/pep-3134/`,
      ],
    ],
  }),
  q({
    slug: "custom-exception-classes",
    topic: "Exceptions",
    d: "medium",
    title: "When and how should you define custom exception classes?",
    kw: [
      "custom exception",
      "exception hierarchy",
      "domain errors",
      "exception attributes",
      "base exception class",
    ],
    intent: "Checks API design with exceptions.",
    short:
      "Define a custom exception when callers need to catch a specific failure of your library or domain, such as `InsufficientFundsError`. Subclass `Exception` (not `BaseException`), usually end the name with `Error`, and create a project base class like `AppError` so callers can catch everything from your code with one clause. Add attributes for useful data, for example the requested and available amounts, and pass a clear message to `super().__init__`. Reuse built-in exceptions such as `ValueError` when they already describe the problem; avoid creating a class for every possible message.",
    detail: [
      "Exception classes can form a hierarchy: `AppError` > `PaymentError` > `CardDeclinedError`.",
      "Keep constructors simple so pickling and re-raising work.",
      "Document which exceptions each public function can raise.",
    ],
    ex: "A `withdraw()` that raises `InsufficientFundsError(balance, amount)`.",
    code: [
      [
        "Custom hierarchy",
        "python",
        `class AppError(Exception):\n    """Base class for this app's errors."""\n\nclass InsufficientFundsError(AppError):\n    def __init__(self, balance, amount):\n        super().__init__(f"balance {balance} is less than {amount}")\n        self.balance, self.amount = balance, amount\n\ntry:\n    raise InsufficientFundsError(10, 50)\nexcept AppError as e:\n    print(e)`,
        ["Callers can catch `AppError` for any app failure."],
      ],
    ],
    mistakes: [
      "Inheriting from BaseException.",
      "Creating custom classes where ValueError would do.",
    ],
    follow: ["Why create a common base class?"],
    points: [
      "Subclass Exception",
      "Name ends with Error",
      "Common base class",
      "Add useful attributes",
    ],
    notes: ["Specific failures deserve their own type."],
    src: [
      ["Python tutorial: User-defined exceptions", `${D}/tutorial/errors.html`],
      ["Python: Built-in exceptions", `${D}/library/exceptions.html`],
    ],
  }),
  q({
    slug: "finally-pitfalls-and-cleanup",
    topic: "Exceptions",
    d: "medium",
    title: "What are the guarantees and pitfalls of the `finally` clause?",
    kw: [
      "finally",
      "return in finally",
      "cleanup",
      "exception override",
      "resource release",
    ],
    intent: "Checks careful understanding of finally semantics.",
    short:
      "A `finally` block runs on every exit from the `try` statement: normal completion, an exception, or a `return`, `break` or `continue` inside the block. It is the place for cleanup that must always happen, such as releasing a lock. Pitfalls: if `finally` itself contains `return`, `break` or `continue`, it overrides the pending return value and discards an active exception, silently hiding errors; and an exception raised inside `finally` replaces the one in flight. Keep `finally` short and free of control-flow statements, and prefer a `with` statement for resources.",
    detail: [
      "The tutorial explains the order of execution for returns in `try` and `finally`.",
      "`finally` does not run if the process is killed or the interpreter crashes.",
      "`sys.exit()` raises `SystemExit`, so `finally` still runs.",
    ],
    ex: "A lock is released in `finally`, but a `return` there accidentally swallowed an earlier error.",
    code: [
      [
        "Return in finally",
        "python",
        `def f():\n    try:\n        return "try"\n    finally:\n        print("cleanup")\n\ndef g():\n    try:\n        raise ValueError("lost")\n    finally:\n        return "finally wins"   # hides the error\n\nprint(f())  # cleanup, try\nprint(g())  # finally wins`,
        [
          "`finally` runs before the return completes.",
          "A return in `finally` eats the exception.",
        ],
      ],
    ],
    mistakes: [
      "return or break inside finally.",
      "Doing work in finally that can itself fail.",
    ],
    follow: ["What happens to an exception when finally returns?"],
    points: [
      "Runs on every exit",
      "Return in finally overrides",
      "Errors in finally replace the original",
      "Prefer with",
    ],
    notes: ["Always runs, so keep it simple."],
    src: [
      [
        "Python tutorial: Defining clean-up actions",
        `${D}/tutorial/errors.html`,
      ],
      [
        "Python: Compound statements (try)",
        `${D}/reference/compound_stmts.html`,
      ],
    ],
  }),
  q({
    slug: "eafp-versus-lbyl",
    topic: "Exceptions",
    d: "easy",
    title: "What are EAFP and LBYL, and which is more Pythonic?",
    kw: [
      "eafp",
      "lbyl",
      "ask forgiveness",
      "look before you leap",
      "race condition",
    ],
    intent: "Checks Python style and its reasons.",
    short:
      "LBYL ('look before you leap') checks conditions first: `if key in d: value = d[key]`. EAFP ('easier to ask forgiveness than permission') just tries and handles failure: `try: value = d[key] except KeyError: ...`. Python's glossary describes EAFP as a common style: it is clean when failure is exceptional, and it avoids race conditions, because a check such as 'does the file exist?' can become false before you use it. LBYL can be clearer when the check is cheap and failure is expected often, because exceptions are slower than a simple test when they are actually raised.",
    detail: [
      "Use `dict.get` when a default is enough.",
      "File operations are the typical place for EAFP, since the file system can change between steps.",
      "Do not wrap large blocks in `try`; keep the risky operation small.",
    ],
    ex: "Open a file and catch `FileNotFoundError` instead of calling `os.path.exists` first.",
    mistakes: [
      "Checking existence then opening, leaving a race window.",
      "Using exceptions for very frequent, expected cases.",
    ],
    follow: ["Why can an existence check be unsafe?"],
    points: [
      "LBYL checks first",
      "EAFP tries then handles",
      "EAFP avoids race conditions",
      "Choose by how often failure happens",
    ],
    notes: ["Try it, handle failure."],
    src: [
      ["Python: Glossary - EAFP", `${D}/glossary.html`],
      ["Python: Glossary - LBYL", `${D}/glossary.html`],
    ],
  }),
  q({
    slug: "exception-groups-except-star",
    topic: "Exceptions",
    d: "hard",
    title: "What are exception groups and `except*` in Python 3.11+?",
    kw: [
      "exceptiongroup",
      "except star",
      "pep 654",
      "multiple errors",
      "concurrent errors",
    ],
    intent: "Checks awareness of modern exception features.",
    short:
      "Python 3.11 added `ExceptionGroup`, an exception that wraps a list of unrelated exceptions, for situations where several things fail at once, such as concurrent tasks. The `except*` syntax handles a group by type: each `except*` clause receives a new group holding only the matching exceptions, and any unhandled ones keep propagating. For example `except* ValueError as eg:` handles the value errors in the group while `TypeError` entries continue. `asyncio.TaskGroup` raises exception groups when child tasks fail. Ordinary `except` clauses still work with single exceptions.",
    detail: [
      "`BaseExceptionGroup` wraps `BaseException` types.",
      "`except*` cannot be mixed with plain `except` in the same `try`.",
      "Groups can be nested; handlers see the leaves by type.",
    ],
    ex: "Running several downloads concurrently and reporting each network error in one group.",
    code: [
      [
        "except*",
        "python",
        `try:\n    raise ExceptionGroup("batch", [ValueError("a"), TypeError("b")])\nexcept* ValueError as eg:\n    print("values:", [str(e) for e in eg.exceptions])\nexcept* TypeError as eg:\n    print("types:", [str(e) for e in eg.exceptions])`,
        ["Each clause gets only its matching errors."],
      ],
    ],
    mistakes: [
      "Using plain except for exception groups.",
      "Mixing except and except* in one try.",
    ],
    follow: ["Which asyncio feature raises exception groups?"],
    points: [
      "ExceptionGroup wraps several errors",
      "except* matches by type",
      "Unhandled errors keep propagating",
      "Added in 3.11 by PEP 654",
    ],
    notes: ["Many errors at once."],
    src: [
      [
        "Python tutorial: Raising and handling multiple unrelated exceptions",
        `${D}/tutorial/errors.html`,
      ],
      ["PEP 654: Exception groups and except*", `${PEP}/pep-0654/`],
    ],
  }),
  q({
    slug: "assert-statement-usage",
    topic: "Exceptions",
    d: "easy",
    title: "What does `assert` do, and when should you not use it?",
    kw: [
      "assert",
      "assertionerror",
      "python -O",
      "debugging",
      "input validation",
    ],
    intent: "Checks the purpose and limits of assertions.",
    short:
      "`assert condition, message` raises `AssertionError` if the condition is false. It documents and checks assumptions that should always hold, mainly internal invariants during development and in tests. Assertions can be turned off: when Python runs with the `-O` option, assert statements are not executed, so they must never be used for input validation or security checks, which have to work in production. For validating arguments and user data raise real exceptions like `ValueError` instead. Do not assert on tuples such as `assert (x, 'msg')`, which is always true.",
    detail: [
      "The condition expression is not even evaluated when assertions are disabled.",
      "Test frameworks such as pytest rewrite asserts to give detailed failure output.",
      "Use asserts for 'this cannot happen' situations, not for expected errors.",
    ],
    ex: "`assert len(result) == len(items)` after a transformation that must preserve length.",
    mistakes: [
      "Validating user input with assert.",
      "Putting side effects in the assert condition.",
    ],
    follow: ["What happens to assert under python -O?"],
    points: [
      "Raises AssertionError",
      "For internal invariants",
      "Removed with -O",
      "Not for validation",
    ],
    notes: ["Assumptions, not validation."],
    src: [
      [
        "Python: Simple statements (assert)",
        `${D}/reference/simple_stmts.html`,
      ],
      [
        "Python: Built-in exceptions (AssertionError)",
        `${D}/library/exceptions.html`,
      ],
    ],
  }),
  q({
    slug: "logging-exceptions-and-tracebacks",
    topic: "Exceptions",
    d: "medium",
    title: "How do you log an exception with its traceback?",
    kw: [
      "logging.exception",
      "traceback",
      "exc_info",
      "error logging",
      "stack trace",
    ],
    intent: "Checks diagnosing errors in real programs.",
    short:
      "Inside an `except` block, call `logger.exception('message')`, which logs at ERROR level and appends the current traceback. Equivalently, `logger.error('message', exc_info=True)`. Do this rather than `print(e)`, which loses the stack trace, the logger name and the timestamp. The `traceback` module can format or print tracebacks manually, for example `traceback.format_exc()`. Log once at the layer that handles the error, not at every layer, to avoid duplicated noise, and avoid logging secrets that may appear in exception messages.",
    detail: [
      "Configure logging handlers and levels once at application start.",
      "Use `%s` style arguments: `logger.exception('failed %s', path)`.",
      "Re-raise after logging if callers must know about the failure.",
    ],
    ex: "A background job logs the traceback of a failed record and continues with the next one.",
    code: [
      [
        "logger.exception",
        "python",
        `import logging\nlogging.basicConfig(level=logging.INFO)\nlog = logging.getLogger(__name__)\n\ntry:\n    1 / 0\nexcept ZeroDivisionError:\n    log.exception("calculation failed")   # includes traceback`,
        ["`exception()` is for use inside except blocks."],
      ],
    ],
    mistakes: [
      "print(e) instead of logging the traceback.",
      "Logging and swallowing the same error at every layer.",
    ],
    follow: ["What level does logger.exception log at?"],
    points: [
      "logger.exception in except",
      "ERROR level plus traceback",
      "traceback.format_exc()",
      "Log once, avoid secrets",
    ],
    notes: ["Log with the stack."],
    src: [
      ["Python: logging", `${D}/library/logging.html`],
      ["Python: traceback", `${D}/library/traceback.html`],
    ],
  }),
  q({
    slug: "text-versus-binary-file-modes",
    topic: "Files",
    d: "easy",
    title:
      "What are the file modes in `open()`, and what is the difference between text and binary?",
    kw: ["open modes", "text mode", "binary mode", "append", "read write"],
    intent: "Checks file opening basics.",
    short:
      "The mode string chooses what you can do: `'r'` read (default), `'w'` write and truncate (creating if missing), `'a'` append, `'x'` create exclusively and fail if the file exists, and `'+'` for update, such as `'r+'`. Adding `'b'` selects binary mode, which reads and writes `bytes` without decoding; without it, files open in text mode and read and write `str`, decoding with an encoding and translating line endings. Use text mode for human-readable files with an explicit `encoding='utf-8'`, and binary mode for images, archives and network data. Always open with `with`.",
    detail: [
      "`'w'` destroys existing content immediately at open time.",
      "`'x'` is a safe way to avoid overwriting.",
      "Binary files do not accept an `encoding` argument.",
    ],
    ex: "Copying an image requires `'rb'` and `'wb'`.",
    mistakes: [
      "Opening binary data in text mode.",
      "Using 'w' on a file you meant to append to.",
    ],
    follow: ["What does mode 'x' do?"],
    points: [
      "r, w, a, x, + modes",
      "b selects binary bytes",
      "Text mode decodes to str",
      "w truncates",
    ],
    notes: ["Mode picks the capabilities."],
    src: [
      ["Python: open()", `${D}/library/functions.html`],
      [
        "Python tutorial: Reading and writing files",
        `${D}/tutorial/inputoutput.html`,
      ],
    ],
  }),
  q({
    slug: "reading-large-files-efficiently",
    topic: "Files",
    d: "medium",
    title: "How do you read large files without running out of memory?",
    kw: [
      "large files",
      "read in chunks",
      "iterate lines",
      "memory",
      "generator",
    ],
    intent: "Checks scalable file processing.",
    short:
      "Avoid `read()` or `readlines()` on huge files, since they load everything into memory. Iterate over the file object, `for line in f:`, which reads one buffered line at a time. For binary or fixed-size processing read in chunks: `while chunk := f.read(1024 * 1024):`. Wrap the iteration in a generator to build processing pipelines that use constant memory, and write results as you go instead of collecting them. For tabular data, `csv` readers stream rows too. Remember the file must stay open while you iterate.",
    detail: [
      "Line iteration handles any line length but a single huge line is still loaded whole.",
      "Compressed files can be streamed with `gzip.open` in the same way.",
      "Measure memory use for important jobs.",
    ],
    ex: "Counting lines containing 'ERROR' in a multi-gigabyte log.",
    code: [
      [
        "Chunked copy",
        "python",
        `with open("big.bin", "rb") as src, open("copy.bin", "wb") as dst:\n    while chunk := src.read(1024 * 1024):\n        dst.write(chunk)`,
        ["Only 1 MB is in memory at a time."],
      ],
    ],
    mistakes: [
      "Calling readlines() on a huge file.",
      "Using the file after the with block closed it.",
    ],
    follow: ["How does iterating a file object read data?"],
    points: [
      "Iterate lines instead of read()",
      "Read fixed-size chunks",
      "Stream results out",
      "Keep the file open while reading",
    ],
    notes: ["One piece at a time."],
    src: [
      [
        "Python tutorial: Methods of file objects",
        `${D}/tutorial/inputoutput.html`,
      ],
      ["Python: io", `${D}/library/io.html`],
    ],
  }),
  q({
    slug: "file-encoding-and-newlines",
    topic: "Files",
    d: "medium",
    title:
      "What problems do encodings and line endings cause when reading files?",
    kw: [
      "encoding utf-8",
      "unicodedecodeerror",
      "universal newlines",
      "errors replace",
      "bom",
    ],
    intent: "Checks practical text handling.",
    short:
      "Text files are bytes interpreted with an encoding. If you read a file with the wrong encoding you get `UnicodeDecodeError` or garbled characters. The tutorial recommends `encoding='utf-8'` unless you know you need something else; without it the default is platform-dependent. For files with a few bad bytes, `errors='replace'` or `errors='ignore'` avoids crashes at the cost of data. In text mode, line endings are translated: `\\n`, `\\r\\n` and `\\r` are read as `\\n`, and written using the platform's convention unless you pass `newline`. The `csv` module requires `newline=''`.",
    detail: [
      "A file saved with a byte order mark can be read with `encoding='utf-8-sig'`.",
      "Know the encoding of data from other systems, and state it in your documentation.",
      "Do not silently ignore errors in important data.",
    ],
    ex: "A CSV exported from a spreadsheet fails with the default encoding until you read it as UTF-8 with a BOM.",
    mistakes: [
      "Relying on the platform default encoding.",
      "Using errors='ignore' without noticing data loss.",
    ],
    follow: ["What does newline='' do?"],
    points: [
      "Always specify encoding",
      "Wrong encoding raises UnicodeDecodeError",
      "Text mode translates newlines",
      "errors= trades safety for convenience",
    ],
    notes: ["Say which encoding you mean."],
    src: [
      ["Python: open() (encoding and newline)", `${D}/library/functions.html`],
      [
        "Python tutorial: Reading and writing files",
        `${D}/tutorial/inputoutput.html`,
      ],
    ],
  }),
  q({
    slug: "atomic-file-writes",
    topic: "Files",
    d: "hard",
    title:
      "How do you write a file safely so a crash cannot leave it half-written?",
    kw: [
      "atomic write",
      "os.replace",
      "temporary file",
      "fsync",
      "data corruption",
    ],
    intent: "Checks reliability thinking for file output.",
    short:
      "Opening a file with `'w'` truncates it immediately, so a crash in the middle leaves a partial or empty file. The safer pattern is to write the new content to a temporary file in the same directory, flush and `os.fsync` it, then replace the target with `os.replace(tmp, target)`. According to the documentation, a successful rename is atomic on POSIX, and `os.replace` overwrites an existing destination, so readers see either the old complete file or the new complete file. The temporary file must be on the same filesystem as the target, otherwise the rename can fail. Clean up the temporary file if writing fails.",
    detail: [
      "`tempfile.NamedTemporaryFile(dir=..., delete=False)` creates a safe temp file.",
      "Atomicity guards against partial writes, not against concurrent writers.",
      "Databases handle durability for you; use them when data matters.",
    ],
    ex: "A configuration file updated by a program that may be killed at any moment.",
    code: [
      [
        "Write then replace",
        "python",
        `import os, tempfile\n\ndef write_atomic(path, text):\n    folder = os.path.dirname(os.path.abspath(path))\n    fd, tmp = tempfile.mkstemp(dir=folder)\n    try:\n        with os.fdopen(fd, "w", encoding="utf-8") as f:\n            f.write(text)\n            f.flush()\n            os.fsync(f.fileno())\n        os.replace(tmp, path)\n    except BaseException:\n        os.unlink(tmp)\n        raise`,
        ["Write to a temp file first.", "`os.replace` swaps it in atomically."],
      ],
    ],
    mistakes: [
      "Writing directly to the live file.",
      "Putting the temp file on another filesystem.",
    ],
    follow: ["Why must the temp file be in the same directory?"],
    points: [
      "'w' truncates immediately",
      "Temp file then os.replace",
      "Same filesystem required",
      "fsync for durability",
    ],
    notes: ["Replace, don't overwrite in place."],
    src: [
      ["Python: os.replace", `${D}/library/os.html`],
      ["Python: tempfile", `${D}/library/tempfile.html`],
    ],
  }),
  q({
    slug: "tempfile-usage",
    topic: "Files",
    d: "medium",
    title: "How do you create temporary files and directories safely?",
    kw: [
      "tempfile",
      "TemporaryDirectory",
      "NamedTemporaryFile",
      "mkstemp",
      "cleanup",
    ],
    intent: "Checks safe temporary resources.",
    short:
      "The `tempfile` module creates temporary files securely, with unpredictable names, so you avoid the risks of hard-coded paths like `/tmp/data.txt`. `TemporaryFile` and `NamedTemporaryFile` give file objects that are deleted when closed; `TemporaryDirectory` is a context manager whose directory and contents are removed on exit; `mkstemp` and `mkdtemp` are lower-level functions that leave cleanup to you. They are ideal for tests, intermediate results and downloads. Pass `dir=` to control where the file is created, for instance to stay on the same filesystem as the final destination.",
    detail: [
      "A `NamedTemporaryFile` cannot be reopened by name on Windows while still open.",
      "Use `pytest`'s `tmp_path` fixture in tests.",
      "Call `tempfile.gettempdir()` to find the default location.",
    ],
    ex: "A test that writes sample files into a `TemporaryDirectory` and lets it vanish afterwards.",
    code: [
      [
        "TemporaryDirectory",
        "python",
        `import tempfile\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as tmp:\n    p = Path(tmp) / "note.txt"\n    p.write_text("hello", encoding="utf-8")\n    print(p.read_text(encoding="utf-8"))\n# directory is gone here`,
        ["Cleanup is automatic."],
      ],
    ],
    mistakes: [
      "Hard-coding /tmp file names.",
      "Forgetting to remove files from mkstemp.",
    ],
    follow: ["Which tempfile function cleans up automatically?"],
    points: [
      "Secure, unpredictable names",
      "TemporaryDirectory as context manager",
      "mkstemp needs manual cleanup",
      "dir= controls location",
    ],
    notes: ["Temp resources that clean up."],
    src: [
      ["Python: tempfile", `${D}/library/tempfile.html`],
      ["Python: pathlib", `${D}/library/pathlib.html`],
    ],
  }),
  q({
    slug: "shutil-copy-move-delete",
    topic: "Files",
    d: "easy",
    title: "How do you copy, move and delete files and directories in Python?",
    kw: ["shutil", "copy", "move", "rmtree", "copytree"],
    intent: "Checks high-level file operations.",
    short:
      "The `shutil` module provides high-level operations. `shutil.copy(src, dst)` copies a file's content and permissions, `copy2` also tries to preserve metadata such as timestamps, `copytree` copies a whole directory tree, `move` renames or moves across locations, and `rmtree` deletes a directory and everything inside it. Single files can be removed with `os.remove` or `Path.unlink()`, and empty directories with `os.rmdir` or `Path.rmdir()`. `shutil.make_archive` creates zip and tar archives. Be very careful with `rmtree` and variables built from user input, because deletion is permanent.",
    detail: [
      "`Path.unlink(missing_ok=True)` ignores an already-missing file.",
      "Check and normalise paths before deleting anything.",
      "`shutil.disk_usage` reports total, used and free space.",
    ],
    ex: "A backup script that copies a project folder into a dated directory.",
    mistakes: [
      "rmtree on a path computed from untrusted input.",
      "Assuming copy preserves timestamps.",
    ],
    follow: ["What is the difference between copy and copy2?"],
    points: [
      "shutil.copy and copy2",
      "copytree and rmtree for directories",
      "move across locations",
      "Deletion is permanent",
    ],
    notes: ["shutil for the big operations."],
    src: [
      ["Python: shutil", `${D}/library/shutil.html`],
      ["Python: pathlib (unlink, rmdir)", `${D}/library/pathlib.html`],
    ],
  }),
  q({
    slug: "pathlib-basics",
    topic: "pathlib",
    d: "easy",
    title: "How do you work with file paths using `pathlib`?",
    kw: ["pathlib", "Path", "path operator", "read_text", "mkdir"],
    intent: "Checks modern path handling.",
    short:
      "`pathlib.Path` represents a file system path as an object. Join parts with the `/` operator, `Path('data') / 'users.json'`, which uses the correct separator on every platform. Useful members: `.exists()`, `.is_file()`, `.is_dir()`, `.read_text()` and `.write_text()` for small files, `.mkdir(parents=True, exist_ok=True)`, `.unlink()`, and properties `.name`, `.stem`, `.suffix`, `.parent` and `.parts`. `Path.cwd()` gives the current directory, `Path.home()` the home directory and `.resolve()` an absolute path with symlinks resolved. It replaces most string manipulation of paths.",
    detail: [
      "`with_suffix('.txt')` and `with_name()` return modified copies.",
      "Paths are immutable and hashable.",
      "Most standard library functions accept `Path` objects directly.",
    ],
    ex: "Building the path to a log file inside the user's home directory.",
    code: [
      [
        "Path operations",
        "python",
        `from pathlib import Path\n\nlog_dir = Path.home() / "app" / "logs"\nlog_dir.mkdir(parents=True, exist_ok=True)\nf = log_dir / "run.txt"\nf.write_text("ok", encoding="utf-8")\nprint(f.name, f.stem, f.suffix)   # run.txt run .txt\nprint(f.parent == log_dir)         # True`,
        ["`/` joins path parts.", "Properties split the name."],
      ],
    ],
    mistakes: [
      "Joining paths with string concatenation.",
      "Forgetting parents=True when creating nested folders.",
    ],
    follow: ["How do you create a directory only if it is missing?"],
    points: [
      "Path objects with / operator",
      "read_text and write_text",
      "name, stem, suffix, parent",
      "mkdir(parents, exist_ok)",
    ],
    notes: ["Paths as objects."],
    src: [
      ["Python: pathlib", `${D}/library/pathlib.html`],
      [
        "Python tutorial: Brief tour of the standard library",
        `${D}/tutorial/stdlib.html`,
      ],
    ],
  }),
  q({
    slug: "pathlib-versus-os-path",
    topic: "pathlib",
    d: "medium",
    title: "How does `pathlib` compare with `os.path`, and why prefer it?",
    kw: [
      "pathlib vs os.path",
      "path object",
      "os.path.join",
      "cross-platform paths",
      "pure paths",
    ],
    intent: "Checks comparison of the two approaches.",
    short:
      "`os.path` works on plain strings with functions such as `join`, `dirname`, `splitext` and `exists`. `pathlib` wraps the same ideas into objects: `Path('a') / 'b'` instead of `os.path.join('a', 'b')`, `p.suffix` instead of `os.path.splitext(p)[1]`, `p.exists()` instead of `os.path.exists(p)`. The object style reads left to right, chains well and keeps operations together. `Path` handles Windows and POSIX differences, and `PurePath` classes do path arithmetic without touching the file system. `os.path` remains fine for existing code, and the two interoperate: `os.fspath(p)` or `str(p)` converts.",
    detail: [
      "Functions like `open()` and `os.listdir` accept `Path` objects.",
      "`os` still provides process, environment and low-level operations.",
      "`os.PathLike` is the protocol that path-aware APIs accept.",
    ],
    ex: "Replacing `os.path.join(base, 'a', 'b.txt')` with `base / 'a' / 'b.txt'`.",
    mistakes: [
      "Mixing string concatenation and Path objects.",
      "Assuming Path operations never touch the disk (only PurePath is pure).",
    ],
    follow: ["What is PurePath for?"],
    points: [
      "os.path uses strings",
      "pathlib uses objects",
      "/ operator joins",
      "Interoperable with str and os.fspath",
    ],
    notes: ["Same job, object style."],
    src: [
      [
        "Python: pathlib (correspondence to os tools)",
        `${D}/library/pathlib.html`,
      ],
      ["Python: os.path", `${D}/library/os.path.html`],
    ],
  }),
  q({
    slug: "listing-and-searching-files",
    topic: "pathlib",
    d: "medium",
    title: "How do you list or search files in a directory tree?",
    kw: ["iterdir", "glob", "rglob", "os.walk", "directory traversal"],
    intent: "Checks directory traversal tools.",
    short:
      "`Path.iterdir()` lists the direct children of a directory. `Path.glob('*.py')` matches names in that directory, and `Path.rglob('*.py')` searches recursively through subdirectories. For full control, `os.walk(top)` yields `(dirpath, dirnames, filenames)` for each directory in the tree, and you can prune `dirnames` in place to skip folders; `Path.walk()` offers the same in Python 3.12+. The results are generators, so they are lazy and handle large trees. Filter with `is_file()` and sort the results if you need a stable order, as file system order is arbitrary.",
    detail: [
      "`os.scandir` is the efficient primitive used by many of these.",
      "Hidden files are included by default in `iterdir`.",
      "Handle `PermissionError` for directories you cannot read.",
    ],
    ex: "Finding every `.log` file under a project folder.",
    code: [
      [
        "Recursive search",
        "python",
        `from pathlib import Path\n\nfor p in sorted(Path(".").rglob("*.py")):\n    if p.is_file():\n        print(p)`,
        [
          "`rglob` searches all subdirectories.",
          "`sorted` makes the order stable.",
        ],
      ],
    ],
    mistakes: [
      "Assuming a sorted order from iterdir.",
      "Not handling permission errors on protected folders.",
    ],
    follow: ["What does os.walk return?"],
    points: [
      "iterdir lists children",
      "glob and rglob match patterns",
      "os.walk traverses trees",
      "Sort for stable order",
    ],
    notes: ["Lazy directory walking."],
    src: [
      ["Python: pathlib (glob, iterdir)", `${D}/library/pathlib.html`],
      ["Python: os.walk", `${D}/library/os.html`],
    ],
  }),
  q({
    slug: "json-dump-load-basics",
    topic: "JSON/CSV",
    d: "easy",
    title: "How do you read and write JSON in Python?",
    kw: ["json", "json.dumps", "json.loads", "json.dump", "serialization"],
    intent: "Checks the basic JSON API.",
    short:
      "The `json` module converts between Python objects and JSON text. `json.dumps(obj)` returns a string and `json.loads(text)` parses one; `json.dump(obj, file)` and `json.load(file)` work directly with file objects. Dictionaries become JSON objects, lists and tuples become arrays, strings, numbers, `True`/`False` and `None` map to the matching JSON values (`null` for `None`). Options include `indent=2` for pretty output, `sort_keys=True` for stable ordering and `ensure_ascii=False` to keep non-ASCII characters readable. Open the file with `encoding='utf-8'`.",
    detail: [
      "Parsing returns lists, dicts, str, int, float, bool and None.",
      "JSON has no comments and does not allow trailing commas.",
      "Never build JSON by string concatenation.",
    ],
    ex: "Saving user settings to `settings.json` and loading them at startup.",
    code: [
      [
        "Round trip",
        "python",
        `import json\n\ndata = {"name": "Asha", "tags": ["a", "b"], "active": True}\ntext = json.dumps(data, indent=2)\nprint(json.loads(text) == data)    # True\n\nwith open("data.json", "w", encoding="utf-8") as f:\n    json.dump(data, f, indent=2)`,
        [
          "`dumps` and `loads` work on strings.",
          "`dump` and `load` work on files.",
        ],
      ],
    ],
    mistakes: [
      "Confusing dump/dumps and load/loads.",
      "Assembling JSON by hand.",
    ],
    follow: ["How do you pretty-print JSON?"],
    points: [
      "dumps/loads for strings",
      "dump/load for files",
      "dict → object, list → array",
      "indent and sort_keys options",
    ],
    notes: ["s means string."],
    src: [
      ["Python: json", `${D}/library/json.html`],
      [
        "Python tutorial: Saving structured data with json",
        `${D}/tutorial/inputoutput.html`,
      ],
    ],
  }),
  q({
    slug: "json-type-mapping-and-custom-encoding",
    topic: "JSON/CSV",
    d: "medium",
    title:
      "What does JSON not support, and how do you serialise things like dates?",
    kw: [
      "json default",
      "datetime not serializable",
      "tuple becomes list",
      "string keys",
      "custom encoder",
    ],
    intent: "Checks the limits of JSON.",
    short:
      "JSON only has objects, arrays, strings, numbers, booleans and null. So `json.dumps` raises `TypeError: Object of type datetime is not JSON serializable` for dates, sets, `Decimal` and custom classes. Provide a `default=` function that converts such values, for example `isoformat()` for dates, or subclass `JSONEncoder`. Some conversions are lossy: tuples come back as lists, dictionary keys are converted to strings (an integer key `1` returns as `'1'`), and decoding does not recreate your classes. Use dataclass helpers like `asdict` and rebuild objects explicitly when loading.",
    detail: [
      "`object_hook` customises decoding of objects.",
      "Agree on date formats such as ISO 8601 strings with other systems.",
      "Binary data needs encoding, for example base64.",
    ],
    ex: "Saving a record that contains a `datetime` as an ISO 8601 string.",
    code: [
      [
        "default hook",
        "python",
        `import json\nfrom datetime import datetime\n\ndef encode(o):\n    if isinstance(o, datetime):\n        return o.isoformat()\n    raise TypeError(f"cannot serialise {type(o).__name__}")\n\nprint(json.dumps({"at": datetime(2026, 11, 4, 9, 30)}, default=encode))\n# {"at": "2026-11-04T09:30:00"}`,
        ["`default` is called for unsupported objects."],
      ],
    ],
    mistakes: [
      "Expecting tuples or int keys to round-trip.",
      "Hiding the TypeError instead of handling the type.",
    ],
    follow: ["What happens to integer dictionary keys?"],
    points: [
      "Only basic JSON types",
      "default= for other types",
      "Tuples become lists",
      "Keys become strings",
    ],
    notes: ["Convert unsupported types yourself."],
    src: [
      ["Python: json (encoders and decoders)", `${D}/library/json.html`],
      ["Python: datetime.isoformat", `${D}/library/datetime.html`],
    ],
  }),
  q({
    slug: "handling-invalid-json",
    topic: "JSON/CSV",
    d: "easy",
    title: "How do you handle invalid JSON input safely?",
    kw: [
      "jsondecodeerror",
      "invalid json",
      "validation",
      "untrusted input",
      "error position",
    ],
    intent: "Checks defensive parsing.",
    short:
      "`json.loads` and `json.load` raise `json.JSONDecodeError`, a subclass of `ValueError`, when the text is not valid JSON. The exception has `msg`, `lineno` and `colno` attributes that say where parsing failed. Wrap parsing of external data in `try`/`except json.JSONDecodeError` and return a clear error or fallback. Parsing success does not mean the structure is right: validate that expected keys exist and have the right types before using the data, either manually or with a validation library. Unlike `pickle`, loading JSON from untrusted sources does not execute code, though huge or deeply nested input can still be a resource problem.",
    detail: [
      "A missing file raises `FileNotFoundError`, a different problem to handle separately.",
      "Check types after parsing: the top level may be a list or a number.",
      "Limit the size of untrusted input.",
    ],
    ex: "A web handler returns a 400 response when the request body is not valid JSON.",
    code: [
      [
        "Safe parse",
        "python",
        `import json\n\ntry:\n    cfg = json.loads('{"port": 80,}')   # trailing comma\nexcept json.JSONDecodeError as e:\n    print(f"line {e.lineno}, col {e.colno}: {e.msg}")`,
        ["The error says where parsing failed."],
      ],
    ],
    mistakes: [
      "Trusting parsed data without validation.",
      "Catching only generic Exception.",
    ],
    follow: ["Which built-in exception is JSONDecodeError a subclass of?"],
    points: [
      "JSONDecodeError (a ValueError)",
      "msg, lineno, colno",
      "Validate structure after parsing",
      "JSON does not execute code",
    ],
    notes: ["Parse, then validate."],
    src: [
      ["Python: json.JSONDecodeError", `${D}/library/json.html`],
      [
        "Python: Built-in exceptions (ValueError)",
        `${D}/library/exceptions.html`,
      ],
    ],
  }),
  q({
    slug: "csv-reader-writer-dictreader",
    topic: "JSON/CSV",
    d: "easy",
    title: "How do you read and write CSV files with the `csv` module?",
    kw: ["csv", "csv.reader", "DictReader", "DictWriter", "delimiter"],
    intent: "Checks tabular text handling.",
    short:
      "`csv.reader(f)` yields each row as a list of strings and `csv.writer(f)` writes rows with `writerow` or `writerows`. `csv.DictReader` uses the header row to give each row as a dictionary, and `csv.DictWriter` writes dictionaries given `fieldnames`. Everything read is a string, so convert numbers yourself. Open files with `newline=''` and an explicit encoding so the module can handle line breaks inside quoted fields. The module handles quoting, embedded commas and different delimiters (`delimiter=';'`), which is why you should not split lines on commas yourself.",
    detail: [
      "`DictWriter.writeheader()` writes the header row.",
      "For large analysis tasks, pandas offers `read_csv` with type inference.",
      "Excel exports may use semicolons or a BOM.",
    ],
    ex: "Reading a list of products where the price column must be converted with `float()`.",
    code: [
      [
        "DictReader and DictWriter",
        "python",
        `import csv\n\nwith open("people.csv", "w", newline="", encoding="utf-8") as f:\n    w = csv.DictWriter(f, fieldnames=["name", "age"])\n    w.writeheader()\n    w.writerow({"name": "Asha", "age": 30})\n\nwith open("people.csv", newline="", encoding="utf-8") as f:\n    for row in csv.DictReader(f):\n        print(row["name"], int(row["age"]))`,
        ["`newline=''` is required.", "Values come back as strings."],
      ],
    ],
    mistakes: [
      "Splitting lines on commas manually.",
      "Forgetting newline='' and getting blank lines.",
    ],
    follow: ["Why is newline='' needed?"],
    points: [
      "reader/writer for lists",
      "DictReader/DictWriter for dicts",
      "Everything is a string",
      "Open with newline=''",
    ],
    notes: ["Let csv handle quoting."],
    src: [
      ["Python: csv", `${D}/library/csv.html`],
      [
        "Python tutorial: Reading and writing files",
        `${D}/tutorial/inputoutput.html`,
      ],
    ],
  }),
  q({
    slug: "csv-quoting-and-edge-cases",
    topic: "JSON/CSV",
    d: "medium",
    title:
      "What edge cases make CSV tricky, and how does the `csv` module deal with them?",
    kw: [
      "csv quoting",
      "embedded comma",
      "multiline field",
      "dialect",
      "csv injection",
    ],
    intent: "Checks real-world CSV awareness.",
    short:
      "CSV has no single strict standard, so details vary. Fields containing the delimiter, quotes or line breaks are wrapped in quotes, and quotes inside are doubled; the `csv` module applies these rules when reading and writing, controlled by `quotechar`, `quoting` (for example `QUOTE_MINIMAL` or `QUOTE_ALL`) and the `dialect` settings. Different producers use different delimiters, encodings and line endings, and `csv.Sniffer` can guess a dialect. Missing values are just empty strings. Beware of spreadsheet formula injection: cells starting with `=`, `+`, `-` or `@` in exported data can be interpreted as formulas when opened in spreadsheet software.",
    detail: [
      "Rows can have a different number of fields; `DictReader` fills missing ones with `None` by default (`restval`).",
      "Test with fields containing commas, quotes and newlines.",
      "For nested data, JSON is a better format.",
    ],
    ex: "An address field like `Flat 3, Main Road` stays in one column because it is quoted.",
    mistakes: [
      "Parsing CSV with str.split(',').",
      "Exporting untrusted values that start with '=' for spreadsheets.",
    ],
    follow: ["How do you read a file that uses semicolons?"],
    points: [
      "Quoting protects delimiters",
      "Quotes inside are doubled",
      "Dialects and delimiter options",
      "Empty string for missing values",
    ],
    notes: ["Don't hand-parse CSV."],
    src: [
      [
        "Python: csv (dialects and formatting parameters)",
        `${D}/library/csv.html`,
      ],
      ["Python: io", `${D}/library/io.html`],
    ],
  }),
  q({
    slug: "pickle-security-and-alternatives",
    topic: "JSON/CSV",
    d: "hard",
    title: "What is `pickle`, and why is it unsafe for untrusted data?",
    kw: [
      "pickle",
      "unpickle",
      "security risk",
      "arbitrary code execution",
      "serialization",
    ],
    intent: "Checks security awareness around serialisation.",
    short:
      "`pickle` serialises almost any Python object to bytes, preserving types, so it can save custom classes that JSON cannot. But the documentation warns that the pickle module is not secure: only unpickle data you trust, because a crafted pickle can execute arbitrary code when loaded. Never unpickle data from the network, from users, or from files others can modify. For exchanging data prefer a safe, language-neutral format such as JSON, and use pickle only for trusted, short-lived, same-version caches. Pickle data is also tied to Python and class definitions, which makes it fragile across versions.",
    detail: [
      "Signing pickles with HMAC prevents tampering but still requires trust in the signer.",
      "Machine-learning model files often use pickle internally; load only from sources you trust.",
      "`json`, `csv`, `sqlite3` and `struct` cover many persistence needs.",
    ],
    ex: "A web service that unpickled a cookie value let attackers run commands on the server.",
    mistakes: [
      "Loading pickles from user uploads.",
      "Using pickle for long-term storage.",
    ],
    follow: ["Which safer format would you use instead?"],
    points: [
      "pickle runs code while loading",
      "Only unpickle trusted data",
      "Not portable across languages or versions",
      "Prefer JSON for exchange",
    ],
    notes: ["Pickle is for trusted data only."],
    src: [
      ["Python: pickle (security warning)", `${D}/library/pickle.html`],
      ["Python: json", `${D}/library/json.html`],
    ],
  }),
  q({
    slug: "choosing-a-storage-format",
    topic: "JSON/CSV",
    d: "medium",
    title:
      "How do you choose between JSON, CSV, pickle and a database for storing data?",
    kw: [
      "storage format",
      "json vs csv",
      "sqlite3",
      "serialization choice",
      "interoperability",
    ],
    intent: "Checks design judgement for persistence.",
    short:
      "Use JSON for structured, nested data exchanged between systems or stored as configuration; it is human-readable and language-neutral but has few types. Use CSV for flat tables that spreadsheets and data tools consume. Use `pickle` only for trusted, temporary Python-only data. Use a database such as SQLite (the `sqlite3` module is built in) when you need queries, updates, concurrent access, constraints or more data than you would want to load whole. Consider size, whether humans must edit the file, schema evolution, security of the source and how often the data changes.",
    detail: [
      "Text formats are easy to inspect and diff in version control.",
      "Binary formats such as Parquet suit large analytical datasets.",
      "Start simple and move to a database when files become hard to manage.",
    ],
    ex: "A to-do app starting with a JSON file and moving to SQLite when users want search and filters.",
    mistakes: [
      "Rewriting a whole large file for each small change.",
      "Using pickle to store user data.",
    ],
    follow: ["When is a database better than a file?"],
    points: [
      "JSON for nested data",
      "CSV for flat tables",
      "pickle only for trusted Python-only data",
      "Database for queries and updates",
    ],
    notes: ["Match format to use."],
    src: [
      ["Python: sqlite3", `${D}/library/sqlite3.html`],
      ["Python: json", `${D}/library/json.html`],
    ],
  }),
  q({
    slug: "file-existence-checks-and-race-conditions",
    topic: "Files",
    d: "medium",
    title: "Why is checking `exists()` before opening a file unreliable?",
    kw: [
      "toctou",
      "race condition",
      "exists then open",
      "file not found",
      "exclusive create",
    ],
    intent: "Checks understanding of time-of-check to time-of-use problems.",
    short:
      "Between the check `if os.path.exists(path)` and the following `open(path)`, another process can delete, create or change the file, so the check can be stale and the open can still fail. This is a time-of-check to time-of-use (TOCTOU) race. In Python the EAFP style fixes it: attempt the operation and handle `FileNotFoundError` or `FileExistsError`. To create a file only if it does not exist, open it with mode `'x'`, which fails atomically if the file exists. `exists()` is fine for messages and for cases where a race is harmless, but it is not a guarantee.",
    detail: [
      "The same applies to checking permissions with `os.access` before use.",
      "Exclusive creation also protects against symlink attacks when combined with proper permissions.",
      "Handle the failure where you can recover, such as creating a default.",
    ],
    ex: "Two worker processes both see that a lock file is missing and both create it, unless 'x' mode is used.",
    code: [
      [
        "Exclusive creation",
        "python",
        `try:\n    with open("job.lock", "x") as f:\n        f.write("pid")\nexcept FileExistsError:\n    print("another worker already holds the lock")`,
        ["The create-if-missing step is atomic."],
      ],
    ],
    mistakes: ["Checking then acting.", "Ignoring FileExistsError."],
    follow: ["What does mode 'x' guarantee?"],
    points: [
      "Check then use is racy",
      "Try and handle the error",
      "'x' creates exclusively",
      "TOCTOU",
    ],
    notes: ["Just try it."],
    src: [
      ["Python: open() (mode x)", `${D}/library/functions.html`],
      ["Python: Glossary - EAFP", `${D}/glossary.html`],
    ],
  }),
])
