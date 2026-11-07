import { defineQuestions } from "../author"
import { q } from "../compact"

const D = "https://docs.python.org/3"
const PEP = "https://peps.python.org"

export default defineQuestions("python-fundamentals", "fresher", [
  q({
    slug: "dynamic-typing-and-type-hints",
    topic: "Types",
    d: "easy",
    title:
      "What does it mean that Python is dynamically typed, and what are type hints?",
    kw: [
      "dynamic typing",
      "type hints",
      "duck typing",
      "names and objects",
      "static analysis",
    ],
    intent: "Checks you understand names, objects and the role of annotations.",
    short:
      "In Python a variable is a name bound to an object, and types belong to objects, not names. The same name can be rebound to a value of another type, and type errors appear at run time when an operation is unsupported, such as adding a string to an integer. Type hints like `def f(x: int) -> str` are optional annotations. The Python runtime does not enforce them; tools such as mypy and editors use them for static checking and completion. Python is dynamically but strongly typed: it will not silently convert incompatible types.",
    detail: [
      "Hints document intent and catch mistakes before running the code, if you run a type checker.",
      "Duck typing means an object is accepted if it has the methods you call, regardless of its class.",
      "Use `isinstance` for checks that must happen at run time.",
    ],
    ex: "Passing a string to a function hinted as taking an int still runs; only a type checker flags it.",
    mistakes: [
      "Believing hints are checked when the program runs.",
      "Confusing dynamic with weak typing.",
    ],
    follow: ["How do you check types at run time?"],
    points: [
      "Names are bound to objects",
      "Types belong to objects",
      "Hints are not enforced at run time",
      "Dynamic but strong typing",
    ],
    notes: ["Hints help tools, not the interpreter."],
    src: [
      ["Python: typing", `${D}/library/typing.html`],
      ["PEP 484: Type Hints", `${PEP}/pep-0484/`],
    ],
  }),
  q({
    slug: "mutable-vs-immutable-types",
    topic: "Types",
    d: "easy",
    title:
      "What is the difference between mutable and immutable types in Python?",
    kw: ["mutable", "immutable", "tuple", "list", "hashable"],
    intent: "A core concept that explains many bugs.",
    short:
      "A mutable object can change its value after creation; an immutable object cannot. Lists, dictionaries and sets are mutable. Integers, floats, strings, tuples, bytes and frozensets are immutable, so operations on them create new objects. Mutability matters when an object is shared: changing a list through one name changes it for every name bound to it. Immutable objects are safe to share and, if their contents are also immutable, can be used as dictionary keys or set members. A tuple that contains a list is immutable in its references, but the inner list can still change.",
    detail: [
      "`s += 'x'` on a string creates a new string, while `lst += [1]` extends the same list.",
      "Use `copy.copy` or `copy.deepcopy` when you need an independent copy.",
      "Hashability is what allows keys in dictionaries.",
    ],
    ex: "Two variables that point to the same list both see an `append` made through either one.",
    code: [
      [
        "Shared mutable object",
        "python",
        `a = [1, 2]\nb = a        # same list, two names\nb.append(3)\nprint(a)     # [1, 2, 3]\n\nc = a.copy() # independent shallow copy\nc.append(4)\nprint(a)     # [1, 2, 3]`,
        [
          "`b = a` copies the reference, not the list.",
          "`copy()` creates a new list.",
        ],
      ],
    ],
    mistakes: [
      "Assuming assignment copies a list.",
      "Using a list as a dictionary key.",
    ],
    follow: ["Why can a tuple with a list inside still change?"],
    points: [
      "Mutable: list, dict, set",
      "Immutable: int, str, tuple, frozenset",
      "Aliasing shares changes",
      "Immutable and hashable work as keys",
    ],
    notes: ["Same object, many names."],
    src: [
      [
        "Python: Data model (objects, values and types)",
        `${D}/reference/datamodel.html`,
      ],
      ["Python: copy", `${D}/library/copy.html`],
    ],
  }),
  q({
    slug: "is-versus-equals-operator",
    topic: "Types",
    d: "easy",
    title: "What is the difference between `==` and `is` in Python?",
    kw: ["is operator", "equality", "identity", "is none", "id function"],
    intent: "Classic check of identity versus equality.",
    short:
      "`==` compares values: it calls the objects' `__eq__` method, so two different lists with the same items are equal. `is` compares identity, meaning whether both names refer to the very same object; `id()` returns that identity. Use `==` for comparing values and `is` for singletons, most importantly `x is None` or `x is not None`, as PEP 8 recommends. Do not use `is` to compare numbers or strings, because whether equal values share an object is an implementation detail that you should not rely on.",
    detail: [
      "A class can define `__eq__` to customise `==`, but `is` cannot be overridden.",
      "`is` is faster and cannot be fooled by an unusual `__eq__`.",
      "`True` and `False` are also singletons, but comparing them with `==` is rarely needed; use truthiness.",
    ],
    ex: "`[1, 2] == [1, 2]` is True but `[1, 2] is [1, 2]` is False, since two list objects are created.",
    mistakes: [
      "Writing `if x == None`.",
      "Comparing strings or integers with `is`.",
    ],
    follow: ["How do you make `==` work for your own class?"],
    points: [
      "`==` compares values",
      "`is` compares identity",
      "Use `is None`",
      "Never rely on `is` for numbers or strings",
    ],
    notes: ["Value versus same object."],
    src: [
      ["Python: Expressions (comparisons)", `${D}/reference/expressions.html`],
      ["PEP 8: Programming recommendations", `${PEP}/pep-0008/`],
    ],
  }),
  q({
    slug: "truthy-and-falsy-values",
    topic: "Types",
    d: "easy",
    title: "Which values are falsy in Python, and how does truth testing work?",
    kw: ["truthy", "falsy", "truth value testing", "bool", "empty collection"],
    intent: "Checks you know how conditions are evaluated.",
    short:
      "Any object can be tested in an `if` or `while` condition. By default an object is true unless its class defines `__bool__` returning False or `__len__` returning 0. The built-in falsy values are `None`, `False`, zero of any numeric type (`0`, `0.0`, `0j`), and empty sequences and collections such as `''`, `[]`, `()`, `{}`, `set()` and `range(0)`. Everything else is truthy. This lets you write `if items:` instead of `if len(items) > 0`, but use `is None` when you need to tell `None` apart from an empty value.",
    detail: [
      "`0` and `[]` are both falsy, so `if not value` cannot tell them apart from `None`.",
      "`and` and `or` return one of their operands, not necessarily a boolean.",
      "`bool(x)` converts any object to True or False.",
    ],
    ex: "`name = user_input or 'guest'` falls back to 'guest' when the input is an empty string.",
    mistakes: [
      "Using `if not x` when 0 is a valid value.",
      "Assuming `and`/`or` return booleans.",
    ],
    follow: ["What does `0 or 5` return?"],
    points: [
      "None, False, zero and empty containers are falsy",
      "Everything else is truthy",
      "`__bool__` and `__len__` customise it",
      "`or` returns an operand",
    ],
    notes: ["Empty means false."],
    src: [
      [
        "Python: Built-in types (truth value testing)",
        `${D}/library/stdtypes.html`,
      ],
      ["Python: Data model (__bool__)", `${D}/reference/datamodel.html`],
    ],
  }),
  q({
    slug: "numbers-int-float-decimal",
    topic: "Types",
    d: "medium",
    title:
      "Why does `0.1 + 0.2` not equal `0.3` in Python, and what can you do about it?",
    kw: [
      "floating point",
      "decimal",
      "math.isclose",
      "int precision",
      "rounding error",
    ],
    intent:
      "Checks you understand binary floating point and when to use Decimal.",
    short:
      "Python floats are binary floating-point numbers, and most decimal fractions such as 0.1 cannot be stored exactly in binary, so `0.1 + 0.2` gives `0.30000000000000004`. This is how floating point works in general, not a Python bug. Compare floats with `math.isclose` instead of `==`. For exact decimal arithmetic, such as money, use the `decimal` module (created from strings) or integer amounts in the smallest unit. Python integers, by contrast, have unlimited range, limited only by available memory.",
    detail: [
      "`round()` helps with display, but does not make the stored value exact.",
      "Create `Decimal('0.10')` from a string; `Decimal(0.1)` captures the float's error.",
      "`/` always returns a float; `//` does floor division.",
    ],
    ex: "A billing system stores prices as integer paise or uses Decimal so totals add up exactly.",
    code: [
      [
        "Float versus Decimal",
        "python",
        `import math\nfrom decimal import Decimal\n\nprint(0.1 + 0.2 == 0.3)                # False\nprint(math.isclose(0.1 + 0.2, 0.3))    # True\nprint(Decimal("0.1") + Decimal("0.2"))  # 0.3`,
        [
          "`isclose` allows a small tolerance.",
          "Decimal built from strings is exact.",
        ],
      ],
    ],
    mistakes: [
      "Using `==` to compare floats.",
      "Building Decimal from a float.",
    ],
    follow: ["How would you store money in a program?"],
    points: [
      "Floats are binary approximations",
      "Use math.isclose to compare",
      "Decimal for exact decimal arithmetic",
      "int has unlimited range",
    ],
    notes: ["Compare with a tolerance."],
    src: [
      [
        "Python tutorial: Floating-point arithmetic",
        `${D}/tutorial/floatingpoint.html`,
      ],
      ["Python: decimal", `${D}/library/decimal.html`],
      ["Python: math.isclose", `${D}/library/math.html`],
    ],
  }),
  q({
    slug: "arithmetic-operators-and-division",
    topic: "Types",
    d: "easy",
    title: "How do `/`, `//`, `%` and `**` behave in Python?",
    kw: [
      "true division",
      "floor division",
      "modulo",
      "power operator",
      "divmod",
    ],
    intent:
      "Checks basic numeric operator knowledge, including negative numbers.",
    short:
      "`/` is true division and always returns a float, even for `4 / 2` which gives `2.0`. `//` is floor division: it divides and rounds down toward negative infinity, so `7 // 2` is 3 and `-7 // 2` is -4. `%` returns the remainder consistent with floor division, so `-7 % 3` is 2, and the result takes the sign of the divisor. `**` raises to a power. `divmod(a, b)` returns both the quotient and the remainder in one call. Dividing by zero raises `ZeroDivisionError`.",
    detail: [
      "`a == (a // b) * b + (a % b)` always holds.",
      "Use `%` for checks like even or odd and for wrapping indices.",
      "Operator precedence puts `**` above multiplication and division.",
    ],
    ex: "Converting 135 minutes to hours and minutes: `divmod(135, 60)` gives `(2, 15)`.",
    mistakes: [
      "Expecting `//` to truncate toward zero for negatives.",
      "Expecting `/` to return an int.",
    ],
    follow: ["What is `-7 // 2`?"],
    points: [
      "`/` returns a float",
      "`//` floors",
      "`%` follows floor division",
      "divmod returns both",
    ],
    notes: ["Floor, not truncate."],
    src: [
      ["Python tutorial: Numbers", `${D}/tutorial/introduction.html`],
      ["Python: Built-in types (numeric)", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "type-conversion-and-input-errors",
    topic: "Types",
    d: "easy",
    title:
      "How do you convert between types in Python, and what happens with bad input?",
    kw: ["type conversion", "int", "str", "valueerror", "input"],
    intent: "Checks you handle user input safely.",
    short:
      "Conversion uses the type as a function: `int('42')`, `float('3.5')`, `str(10)`, `list('abc')`, `bool(0)`. Python converts explicitly; it does not silently turn strings into numbers in arithmetic. `input()` always returns a string, so convert it before doing maths. When the text is not valid, such as `int('abc')`, Python raises `ValueError`, so wrap the conversion in `try`/`except ValueError` when the data comes from users or files, and ask again or use a default.",
    detail: [
      "`int(3.9)` truncates to 3; use `round()` if you want rounding.",
      "`int('12', 2)`-style bases are available as a second argument for strings.",
      "Validate before converting when you can.",
    ],
    ex: "A prompt for age reads text, tries `int(text)`, and asks again on `ValueError`.",
    code: [
      [
        "Safe conversion",
        "python",
        `def read_int(text, default=None):\n    try:\n        return int(text)\n    except ValueError:\n        return default\n\nprint(read_int("42"))    # 42\nprint(read_int("abc"))   # None`,
        [
          "`int` raises `ValueError` on bad text.",
          "The function returns a default instead of crashing.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting that input() returns a string.",
      "Catching every exception instead of ValueError.",
    ],
    follow: ["What does `int(3.9)` return?"],
    points: [
      "Types act as converters",
      "input() returns str",
      "Invalid text raises ValueError",
      "Catch the specific exception",
    ],
    notes: ["Convert, then handle ValueError."],
    src: [
      ["Python: Built-in functions", `${D}/library/functions.html`],
      ["Python tutorial: Handling exceptions", `${D}/tutorial/errors.html`],
    ],
  }),
  q({
    slug: "if-elif-else-and-match-statement",
    topic: "Control flow",
    d: "medium",
    title: "How do `if`/`elif`/`else` work, and what is the `match` statement?",
    kw: [
      "if elif else",
      "match statement",
      "structural pattern matching",
      "conditional expression",
      "short-circuit",
    ],
    intent: "Checks you know branching and modern pattern matching.",
    short:
      "`if`, `elif` and `else` evaluate conditions in order and run the first block whose condition is truthy; blocks are defined by indentation. `and` and `or` short-circuit, so the right side runs only when needed. A conditional expression writes a simple choice in one line: `label = 'adult' if age >= 18 else 'minor'`. Since Python 3.10, `match` offers structural pattern matching: it compares a value against patterns such as literals, sequences or class shapes, binds variables, and uses `_` as a wildcard. It is more than a switch statement.",
    detail: [
      "`match` needs Python 3.10 or newer.",
      "Patterns can have `if` guards.",
      "Plain `if`/`elif` is still the clearest choice for simple conditions.",
    ],
    ex: "A command handler matches `['go', direction]` or `['quit']` to choose an action.",
    code: [
      [
        "match with patterns",
        "python",
        `def describe(cmd):\n    match cmd:\n        case ["go", direction]:\n            return f"moving {direction}"\n        case ["quit"]:\n            return "bye"\n        case _:\n            return "unknown"\n\nprint(describe(["go", "north"]))  # moving north`,
        ["The first pattern binds `direction`.", "`_` is the catch-all case."],
      ],
    ],
    mistakes: [
      "Using `match` on Python older than 3.10.",
      "Forgetting the wildcard case.",
    ],
    follow: ["How does a conditional expression differ from an if statement?"],
    points: [
      "First truthy branch runs",
      "and/or short-circuit",
      "Conditional expression is one line",
      "match is structural pattern matching (3.10+)",
    ],
    notes: ["match is more than switch."],
    src: [
      [
        "Python tutorial: Control flow (if, match)",
        `${D}/tutorial/controlflow.html`,
      ],
      ["PEP 636: Structural pattern matching tutorial", `${PEP}/pep-0636/`],
    ],
  }),
  q({
    slug: "loops-range-enumerate-zip",
    topic: "Control flow",
    d: "easy",
    title:
      "How do `for` loops work, and when do you use `range`, `enumerate` and `zip`?",
    kw: ["for loop", "range", "enumerate", "zip", "iterable"],
    intent: "Checks idiomatic iteration.",
    short:
      "A Python `for` loop iterates over any iterable, taking each item in turn, rather than counting an index. `range(n)` produces integers from 0 to n-1 without building a list. `enumerate(items)` yields `(index, item)` pairs when you need both, which is better than manual `range(len(items))`. `zip(a, b)` pairs items from several iterables and stops at the shortest one; `zip(..., strict=True)` raises an error if lengths differ (3.10+). Use a `while` loop when the number of repetitions is not known up front.",
    detail: [
      "Do not modify a list while looping over it; build a new one or iterate over a copy.",
      "`reversed()` and `sorted()` let you iterate in other orders without changing the data.",
      "`dict.items()` gives key-value pairs.",
    ],
    ex: "Printing a numbered shopping list uses `for i, item in enumerate(items, start=1)`.",
    code: [
      [
        "Idiomatic loops",
        "python",
        `names = ["Asha", "Ravi"]\nscores = [90, 82]\n\nfor i, name in enumerate(names, start=1):\n    print(i, name)\n\nfor name, score in zip(names, scores):\n    print(name, score)`,
        ["`enumerate` supplies the index.", "`zip` walks two lists together."],
      ],
    ],
    mistakes: [
      "Using range(len(x)) just to index.",
      "Removing items from a list during iteration.",
    ],
    follow: ["What does zip do with lists of different lengths?"],
    points: [
      "for iterates over iterables",
      "range makes integers lazily",
      "enumerate gives index and item",
      "zip pairs iterables",
    ],
    notes: ["Iterate items, not indexes."],
    src: [
      [
        "Python tutorial: for statements and range",
        `${D}/tutorial/controlflow.html`,
      ],
      [
        "Python: Built-in functions (enumerate, zip)",
        `${D}/library/functions.html`,
      ],
    ],
  }),
  q({
    slug: "break-continue-and-loop-else",
    topic: "Control flow",
    d: "medium",
    title: "What do `break`, `continue` and the loop `else` clause do?",
    kw: ["break", "continue", "for else", "while else", "loop control"],
    intent: "Checks a feature many learners find surprising.",
    short:
      "`break` leaves the innermost loop immediately, and `continue` skips to the next iteration. A loop can also have an `else` clause: it runs when the loop finishes normally, because the iterable is exhausted or the `while` condition became false, but it is skipped if the loop was ended by `break`. That makes it suited to search loops: if you find the item, `break`; the `else` block handles the 'not found' case without a flag variable. `pass` does nothing and is a placeholder.",
    detail: [
      "`break` and `continue` affect only the innermost loop.",
      "A `return` inside a loop also skips `else`.",
      "Some teams avoid loop `else` for readability; know it so you can read it.",
    ],
    ex: "Looking for a prime factor: `break` when one is found, `else` reports that the number is prime.",
    code: [
      [
        "Search with else",
        "python",
        `for n in range(2, 10):\n    for x in range(2, n):\n        if n % x == 0:\n            break\n    else:\n        print(n, "is prime")`,
        [
          "The inner `else` belongs to `for`.",
          "It runs only when no `break` happened.",
        ],
      ],
    ],
    mistakes: [
      "Thinking else runs only when the loop did not execute.",
      "Expecting break to leave all nested loops.",
    ],
    follow: ["How would you exit two nested loops at once?"],
    points: [
      "break leaves the loop",
      "continue skips an iteration",
      "else runs if no break",
      "pass is a placeholder",
    ],
    notes: ["else means no break."],
    src: [
      [
        "Python tutorial: break, continue and else on loops",
        `${D}/tutorial/controlflow.html`,
      ],
      [
        "Python: Compound statements (for)",
        `${D}/reference/compound_stmts.html`,
      ],
    ],
  }),
  q({
    slug: "walrus-assignment-expression",
    topic: "Control flow",
    d: "medium",
    title: "What is the walrus operator `:=`?",
    kw: [
      "walrus operator",
      "assignment expression",
      "pep 572",
      "python 3.8",
      "while loop",
    ],
    intent: "Checks awareness of modern syntax and its limits.",
    short:
      "The walrus operator `:=`, added in Python 3.8 by PEP 572, is an assignment expression: it assigns a value to a name and also evaluates to that value, so you can use and store a result in one place. It avoids calling a function twice or writing a separate line, for example `if (n := len(items)) > 10:` or `while chunk := file.read(1024):`. It must be parenthesised in many contexts and is not allowed as a bare statement. Use it where it shortens code without hurting clarity.",
    detail: [
      "The assigned name stays available after the expression.",
      "In comprehensions it avoids computing the same value twice.",
      "Overusing it makes code harder to read.",
    ],
    ex: "Reading a file in blocks until `read()` returns an empty string.",
    code: [
      [
        "Walrus in a loop",
        "python",
        `import io\n\nf = io.StringIO("abcdef")\nwhile chunk := f.read(2):\n    print(chunk)   # ab, cd, ef`,
        [
          "Each `read` result is stored in `chunk`.",
          "An empty string ends the loop.",
        ],
      ],
    ],
    mistakes: ["Using it everywhere for brevity.", "Confusing := with ==."],
    follow: ["Which Python version added it?"],
    points: [
      "Assigns and returns a value",
      "Python 3.8+",
      "Avoids repeated calls",
      "Use sparingly",
    ],
    notes: ["Assign inside an expression."],
    src: [
      ["PEP 572: Assignment expressions", `${PEP}/pep-0572/`],
      ["Python: Expressions", `${D}/reference/expressions.html`],
    ],
  }),
  q({
    slug: "function-parameters-args-kwargs",
    topic: "Functions",
    d: "medium",
    title:
      "What are positional, keyword, default, `*args` and `**kwargs` parameters?",
    kw: [
      "args and kwargs",
      "keyword-only arguments",
      "default arguments",
      "positional-only",
      "unpacking",
    ],
    intent: "A staple question on function signatures.",
    short:
      "Positional arguments are matched by order and keyword arguments by name. Parameters can have defaults, making them optional. `*args` collects extra positional arguments into a tuple and `**kwargs` collects extra keyword arguments into a dict. Parameters after a bare `*` (or after `*args`) are keyword-only, and parameters before a `/` are positional-only (3.8+). At a call site `*` and `**` unpack sequences and dictionaries into arguments. Parameters must be ordered: positional-only, normal, `*args`, keyword-only, `**kwargs`.",
    detail: [
      "Keyword-only parameters make call sites self-explanatory, such as `connect(host, *, timeout=5)`.",
      "`**kwargs` is useful for forwarding options to another function.",
      "Prefer explicit parameters over `**kwargs` when you can.",
    ],
    ex: "`print(*items, sep=', ')` unpacks a list into separate arguments.",
    code: [
      [
        "Signature forms",
        "python",
        `def f(a, b=2, /, c=3, *args, d, **kwargs):\n    return a, b, c, args, d, kwargs\n\nprint(f(1, 2, 3, 4, 5, d=6, e=7))\n# (1, 2, 3, (4, 5), 6, {'e': 7})`,
        [
          "`a` and `b` are positional-only.",
          "`d` must be passed by keyword.",
          "Extras land in `args` and `kwargs`.",
        ],
      ],
    ],
    mistakes: [
      "Passing a keyword-only argument by position.",
      "Hiding the real arguments behind **kwargs.",
    ],
    follow: ["What does a bare `*` in the signature do?"],
    points: [
      "*args is a tuple",
      "**kwargs is a dict",
      "Bare * starts keyword-only",
      "/ ends positional-only",
    ],
    notes: ["Order matters in signatures."],
    src: [
      [
        "Python tutorial: More on defining functions",
        `${D}/tutorial/controlflow.html`,
      ],
      ["PEP 570: Positional-only parameters", `${PEP}/pep-0570/`],
    ],
  }),
  q({
    slug: "mutable-default-argument-pitfall",
    topic: "Functions",
    d: "medium",
    title:
      "Why is a mutable default argument such as `def f(x, items=[])` a bug?",
    kw: [
      "mutable default argument",
      "default evaluated once",
      "none sentinel",
      "function bug",
      "shared state",
    ],
    intent: "One of the best-known Python gotchas.",
    short:
      "Default values are evaluated once, when the function is defined, not on each call. If the default is a mutable object such as a list or dict, every call that omits the argument shares that same object, so changes accumulate between calls. The Python tutorial warns about exactly this. The fix is to use `None` as the default and create a new object inside the function: `if items is None: items = []`. Immutable defaults like numbers, strings and tuples are safe.",
    detail: [
      "The shared default is stored on the function object.",
      "Linters such as Ruff and pylint flag this pattern.",
      "Use a different sentinel if `None` is a valid value.",
    ],
    ex: "An `add_task(task, tasks=[])` helper returns a list that keeps growing across unrelated calls.",
    code: [
      [
        "Bug and fix",
        "python",
        `def bad(x, items=[]):\n    items.append(x)\n    return items\n\nprint(bad(1))  # [1]\nprint(bad(2))  # [1, 2]  (surprise)\n\ndef good(x, items=None):\n    if items is None:\n        items = []\n    items.append(x)\n    return items`,
        [
          "The default list is created once.",
          "The fixed version builds a new list per call.",
        ],
      ],
    ],
    mistakes: ["Using [] or {} as a default.", "Fixing it with a global list."],
    follow: ["When is a default safe?"],
    points: [
      "Defaults evaluated once at definition",
      "Mutable default is shared between calls",
      "Use None and create inside",
      "Immutable defaults are fine",
    ],
    notes: ["Default None, then create."],
    src: [
      [
        "Python tutorial: Default argument values",
        `${D}/tutorial/controlflow.html`,
      ],
      ["Python FAQ: Programming", `${D}/faq/programming.html`],
    ],
  }),
  q({
    slug: "scope-legb-global-nonlocal",
    topic: "Functions",
    d: "medium",
    title:
      "How does variable scope work in Python (LEGB, `global`, `nonlocal`)?",
    kw: [
      "scope",
      "legb",
      "global keyword",
      "nonlocal keyword",
      "unboundlocalerror",
    ],
    intent: "Checks you can reason about name lookup.",
    short:
      "Python looks up a name in the Local scope, then any Enclosing function scopes, then the Global (module) scope, then the Built-in names; this is the LEGB rule. Assigning to a name inside a function makes it local to that function, so reading the same name earlier in the function raises `UnboundLocalError`. To rebind a module-level name from inside a function use `global`; to rebind a variable of an enclosing function use `nonlocal`. Reading a global needs no keyword, and mutating a global list needs none either, since that is not rebinding.",
    detail: [
      "Prefer passing values in and returning results over `global`.",
      "`nonlocal` is what makes counters inside closures work.",
      "Loop variables and comprehension variables have their own rules; comprehensions have a private scope.",
    ],
    ex: "A `counter()` closure uses `nonlocal count` so each call increments the enclosing variable.",
    code: [
      [
        "nonlocal counter",
        "python",
        `def make_counter():\n    count = 0\n    def inc():\n        nonlocal count\n        count += 1\n        return count\n    return inc\n\nc = make_counter()\nprint(c(), c())  # 1 2`,
        [
          "`inc` rebinds the enclosing `count`.",
          "Without `nonlocal` it would raise UnboundLocalError.",
        ],
      ],
    ],
    mistakes: [
      "Assuming assignment inside a function changes the global.",
      "Overusing global state.",
    ],
    follow: ["What causes UnboundLocalError?"],
    points: [
      "LEGB lookup order",
      "Assignment creates a local",
      "global rebinds module names",
      "nonlocal rebinds enclosing names",
    ],
    notes: ["Assigning makes it local."],
    src: [
      ["Python tutorial: Scopes and namespaces", `${D}/tutorial/classes.html`],
      [
        "Python: Execution model (naming and binding)",
        `${D}/reference/executionmodel.html`,
      ],
    ],
  }),
  q({
    slug: "how-arguments-are-passed",
    topic: "Functions",
    d: "medium",
    title: "Does Python pass arguments by value or by reference?",
    kw: [
      "pass by object reference",
      "call by value",
      "argument passing",
      "rebinding",
      "mutation",
    ],
    intent: "Checks you can explain the real model instead of a slogan.",
    short:
      "Neither exactly. Python passes object references by value, sometimes called call by object reference or by assignment. The parameter becomes a new name bound to the same object the caller passed. If the function mutates a mutable object, such as appending to a list, the caller sees the change. If the function rebinds the parameter to a different object, for example `items = items + [1]`, the caller's variable is unaffected. The Python tutorial describes it as call by value where the value is always an object reference.",
    detail: [
      "Immutable arguments cannot be changed in place, so they behave like values.",
      "Copy a mutable argument at the start if the function should not alter the caller's data.",
      "Returning a new object is often clearer than mutating arguments.",
    ],
    ex: "`def add(items): items.append(1)` changes the caller's list, but `items = []` inside changes nothing outside.",
    code: [
      [
        "Mutation versus rebinding",
        "python",
        `def mutate(items):\n    items.append(1)      # caller sees this\n\ndef rebind(items):\n    items = [99]         # caller does not\n\nxs = []\nmutate(xs); rebind(xs)\nprint(xs)  # [1]`,
        [
          "`append` changes the shared object.",
          "Assignment only rebinds the local name.",
        ],
      ],
    ],
    mistakes: [
      "Saying Python is purely pass by reference.",
      "Mutating arguments unintentionally.",
    ],
    follow: ["How do you protect the caller's list?"],
    points: [
      "Object references passed by value",
      "Mutation is visible to the caller",
      "Rebinding is not",
      "Copy to protect inputs",
    ],
    notes: ["Share the object, rebind the name."],
    src: [
      ["Python tutorial: Defining functions", `${D}/tutorial/controlflow.html`],
      [
        "Python FAQ: How do I write a function with output parameters?",
        `${D}/faq/programming.html`,
      ],
    ],
  }),
  q({
    slug: "lambda-and-first-class-functions",
    topic: "Functions",
    d: "easy",
    title:
      "What are lambda functions, and what does 'functions are first-class objects' mean?",
    kw: [
      "lambda",
      "first-class functions",
      "sorted key",
      "higher-order function",
      "map filter",
    ],
    intent: "Checks functional basics.",
    short:
      "A lambda is a small anonymous function limited to a single expression, written `lambda x: x * 2`. Functions in Python are first-class objects: you can assign them to variables, store them in lists and dictionaries, pass them as arguments and return them from other functions. Functions that take or return functions are higher-order functions. The common use of lambda is a short key function, for example `sorted(users, key=lambda u: u['age'])`. For anything longer than one expression, write a named `def`, which is easier to test and debug.",
    detail: [
      "`operator.itemgetter` and `attrgetter` are alternatives to simple lambdas.",
      "`map` and `filter` exist, but comprehensions are usually more readable.",
      "A lambda has no statements, only an expression.",
    ],
    ex: "Sorting a list of dictionaries by their 'age' field with a key lambda.",
    code: [
      [
        "Function as value",
        "python",
        `ops = {"double": lambda x: x * 2, "square": lambda x: x * x}\nprint(ops["square"](4))  # 16\n\nwords = ["pear", "fig", "banana"]\nprint(sorted(words, key=len))  # ['fig', 'pear', 'banana']`,
        [
          "Functions live in a dict like any value.",
          "`key` accepts any callable.",
        ],
      ],
    ],
    mistakes: [
      "Cramming complex logic into a lambda.",
      "Assigning a lambda to a name instead of using def.",
    ],
    follow: ["What does the key argument of sorted do?"],
    points: [
      "Lambda is one expression",
      "Functions are objects",
      "Higher-order functions take functions",
      "Use def for anything complex",
    ],
    notes: ["Small, anonymous, one expression."],
    src: [
      ["Python tutorial: Lambda expressions", `${D}/tutorial/controlflow.html`],
      ["Python: Sorting techniques", `${D}/howto/sorting.html`],
    ],
  }),
  q({
    slug: "list-comprehensions",
    topic: "Comprehensions",
    d: "easy",
    title: "What is a list comprehension, and how does it compare with a loop?",
    kw: [
      "list comprehension",
      "filter condition",
      "nested comprehension",
      "readability",
      "map filter",
    ],
    intent: "Checks idiomatic Python.",
    short:
      "A list comprehension builds a list from an iterable in one expression: `[expr for item in iterable if condition]`. `[n * n for n in nums if n % 2 == 0]` squares the even numbers. It replaces the common pattern of creating an empty list, looping and appending, and is usually shorter and clearer for simple transformations and filters. Nested loops are allowed but quickly hurt readability, so use a regular loop when the logic needs several steps or side effects. Comprehension variables do not leak into the surrounding scope in Python 3.",
    detail: [
      "A conditional expression goes before `for`: `[x if x > 0 else 0 for x in xs]`.",
      "A filtering `if` goes at the end.",
      "Do not use a comprehension only for its side effects.",
    ],
    ex: "Extracting the email field of every user in a list.",
    code: [
      [
        "Loop versus comprehension",
        "python",
        `nums = [1, 2, 3, 4]\n\nsquares = []\nfor n in nums:\n    if n % 2 == 0:\n        squares.append(n * n)\n\nsquares2 = [n * n for n in nums if n % 2 == 0]\nprint(squares == squares2)  # True`,
        [
          "Both build [4, 16].",
          "The comprehension states the intent directly.",
        ],
      ],
    ],
    mistakes: [
      "Deeply nested comprehensions.",
      "Using them for side effects like printing.",
    ],
    follow: ["Where does an if-else go in a comprehension?"],
    points: [
      "[expr for x in it if cond]",
      "Replaces append loops",
      "Keep them simple",
      "Own scope for the loop variable",
    ],
    notes: ["Transform and filter in one line."],
    src: [
      [
        "Python tutorial: List comprehensions",
        `${D}/tutorial/datastructures.html`,
      ],
      ["Python: Expressions (displays)", `${D}/reference/expressions.html`],
    ],
  }),
  q({
    slug: "dict-and-set-comprehensions",
    topic: "Comprehensions",
    d: "easy",
    title: "How do dictionary and set comprehensions work?",
    kw: [
      "dict comprehension",
      "set comprehension",
      "invert dictionary",
      "unique values",
      "key value",
    ],
    intent: "Checks you can build other collections the same way.",
    short:
      "A dictionary comprehension uses braces with a key and value: `{name: len(name) for name in names}`. A set comprehension uses braces with a single expression: `{n % 3 for n in nums}`, producing unique values. Both can filter with a trailing `if`. They are handy for building lookup tables, inverting a mapping (`{v: k for k, v in d.items()}`, which assumes values are unique and hashable) and de-duplicating while transforming. As with lists, keep them short; if the logic is complex, use a loop.",
    detail: [
      "If duplicate keys are produced, later ones overwrite earlier ones.",
      "`{}` alone creates an empty dict, not an empty set; use `set()`.",
      "Keys and set members must be hashable.",
    ],
    ex: "Building an id-to-user lookup from a list of user dictionaries.",
    code: [
      [
        "Lookup tables",
        "python",
        `users = [{"id": 1, "name": "Asha"}, {"id": 2, "name": "Ravi"}]\nby_id = {u["id"]: u for u in users}\nprint(by_id[2]["name"])  # Ravi\n\nlengths = {len(u["name"]) for u in users}\nprint(lengths)  # {4}`,
        [
          "The dict comprehension indexes users by id.",
          "The set keeps unique lengths.",
        ],
      ],
    ],
    mistakes: [
      "Using {} for an empty set.",
      "Inverting a mapping with duplicate values.",
    ],
    follow: ["What happens when two items give the same key?"],
    points: [
      "{k: v for ...} for dicts",
      "{x for ...} for sets",
      "Later duplicates overwrite",
      "{} is an empty dict",
    ],
    notes: ["Same pattern, different braces."],
    src: [
      [
        "Python tutorial: Dictionaries and sets",
        `${D}/tutorial/datastructures.html`,
      ],
      [
        "Python: Expressions (dict displays)",
        `${D}/reference/expressions.html`,
      ],
    ],
  }),
  q({
    slug: "generator-expression-vs-list",
    topic: "Comprehensions",
    d: "medium",
    title:
      "What is a generator expression, and when is it better than a list comprehension?",
    kw: [
      "generator expression",
      "lazy evaluation",
      "memory usage",
      "sum of squares",
      "iterator",
    ],
    intent: "Checks you understand lazy evaluation.",
    short:
      "A generator expression looks like a list comprehension but uses parentheses: `(n * n for n in nums)`. Instead of building the whole list, it produces one item at a time when asked, so memory use stays small even for huge or endless sequences. It is the better choice when you only iterate once, for example when passing it to `sum`, `max`, `any` or `all`: `sum(n * n for n in range(1_000_000))`. A generator can be consumed only once; if you need to iterate several times, index the result or take its length, build a list.",
    detail: [
      "When it is the only argument, a function call needs no extra parentheses.",
      "`any()` and `all()` stop early on a generator, saving work.",
      "Generators cannot be indexed or measured with `len`.",
    ],
    ex: "Summing a million squares without storing a million numbers.",
    mistakes: [
      "Trying to reuse an exhausted generator.",
      "Calling len() on a generator.",
    ],
    follow: ["What happens if you iterate a generator twice?"],
    points: [
      "Parentheses, not brackets",
      "Lazy, one item at a time",
      "Low memory",
      "Single pass",
    ],
    notes: ["Compute on demand."],
    src: [
      ["Python tutorial: Generator expressions", `${D}/tutorial/classes.html`],
      [
        "Python: Expressions (generator expressions)",
        `${D}/reference/expressions.html`,
      ],
    ],
  }),
  q({
    slug: "import-system-and-module-search",
    topic: "Modules",
    d: "easy",
    title: "How does `import` work, and where does Python look for modules?",
    kw: [
      "import",
      "from import",
      "sys.path",
      "module search path",
      "namespace",
    ],
    intent: "Checks understanding of modules and namespaces.",
    short:
      "A module is a Python file; `import math` loads it once and gives you the namespace `math`, while `from math import sqrt` binds just the name `sqrt`. Python first checks whether the module is already loaded, then looks for built-in modules, and then searches the directories in `sys.path`: the directory of the running script, the `PYTHONPATH` entries and installation-specific defaults. A loaded module is cached in `sys.modules`, so its code runs only the first time. Avoid `from module import *`, which pollutes the namespace.",
    detail: [
      "Naming your file the same as a standard library module, such as `random.py`, shadows it.",
      "`import x as y` renames for convenience.",
      "Imports belong at the top of the file, grouped as standard library, third party and local.",
    ],
    ex: "A local file called `json.py` breaks `import json` because the script's folder is searched first.",
    mistakes: [
      "Naming a file like a standard module.",
      "Using import * in real code.",
    ],
    follow: ["What is sys.modules?"],
    points: [
      "import loads a module once",
      "sys.path controls the search",
      "from-import binds names",
      "Do not shadow stdlib names",
    ],
    notes: ["Cached after first import."],
    src: [
      ["Python tutorial: Modules", `${D}/tutorial/modules.html`],
      ["Python: The import system", `${D}/reference/import.html`],
    ],
  }),
  q({
    slug: "name-main-guard",
    topic: "Modules",
    d: "easy",
    title: 'What does `if __name__ == "__main__":` do?',
    kw: [
      "__name__",
      "__main__",
      "script vs module",
      "entry point",
      "import side effects",
    ],
    intent: "Checks understanding of scripts versus importable modules.",
    short:
      "When a file runs as a script, Python sets its `__name__` to `'__main__'`; when the same file is imported, `__name__` is the module's name. The guard `if __name__ == '__main__':` therefore runs code only when the file is executed directly, not when another module imports it. This lets one file be both a reusable module and a command-line program, and keeps imports free of side effects such as starting servers or reading input. Place the program's entry point, usually a `main()` function, under the guard.",
    detail: [
      "Importing a module runs its top-level code, so heavy work should be in functions.",
      "Tests can import the module and call `main()` without launching the program.",
      "`python -m package` runs a package's `__main__.py`.",
    ],
    ex: "A utility script defines helper functions and runs `main()` only when executed from the command line.",
    code: [
      [
        "Script and module in one",
        "python",
        `def greet(name):\n    return f"Hello, {name}"\n\ndef main():\n    print(greet("Asha"))\n\nif __name__ == "__main__":\n    main()`,
        [
          "Importing the file only defines functions.",
          "Running it calls `main()`.",
        ],
      ],
    ],
    mistakes: [
      "Leaving script code at top level so it runs on import.",
      "Misspelling __name__ or the string.",
    ],
    follow: ["What is __name__ when the file is imported?"],
    points: [
      "Script: __name__ is '__main__'",
      "Import: __name__ is the module name",
      "Guard prevents side effects",
      "Put main() under it",
    ],
    notes: ["Run directly versus imported."],
    src: [
      [
        "Python tutorial: Executing modules as scripts",
        `${D}/tutorial/modules.html`,
      ],
      [
        "Python: __main__ top-level script environment",
        `${D}/library/__main__.html`,
      ],
    ],
  }),
  q({
    slug: "packages-init-and-relative-imports",
    topic: "Modules",
    d: "medium",
    title: "What is a package in Python, and what does `__init__.py` do?",
    kw: [
      "package",
      "__init__.py",
      "relative import",
      "namespace package",
      "project layout",
    ],
    intent: "Checks you can structure a multi-file project.",
    short:
      "A package is a directory of modules, imported with dotted names such as `shop.orders.pricing`. The `__init__.py` file marks a regular package and runs when the package is imported; it can be empty or can re-export names to give the package a tidy public interface. Inside a package you can use absolute imports (`from shop.orders import pricing`), which are preferred, or relative imports (`from . import pricing`, `from ..utils import log`). Directories without `__init__.py` can still work as namespace packages, but a regular package is clearer for beginners.",
    detail: [
      "Relative imports work only inside packages, not in a script run directly.",
      "`__all__` controls what `from package import *` exports.",
      "Keep `__init__.py` light to avoid slow imports and import cycles.",
    ],
    ex: "A project with `app/models.py`, `app/views.py` and `app/__init__.py` is imported as `app.models`.",
    mistakes: [
      "Running a file inside a package as a script and using relative imports.",
      "Putting heavy logic in __init__.py.",
    ],
    follow: ["When would you use a relative import?"],
    points: [
      "Package is a directory of modules",
      "__init__.py marks and initialises it",
      "Absolute imports preferred",
      "Relative imports need a package context",
    ],
    notes: ["Directory plus __init__.py."],
    src: [
      ["Python tutorial: Packages", `${D}/tutorial/modules.html`],
      ["Python: The import system (packages)", `${D}/reference/import.html`],
    ],
  }),
  q({
    slug: "circular-imports",
    topic: "Modules",
    d: "hard",
    title: "What is a circular import, and how do you fix it?",
    kw: [
      "circular import",
      "import cycle",
      "sys.modules",
      "importerror",
      "refactoring",
    ],
    intent: "Checks you understand how imports execute.",
    short:
      "A circular import happens when module A imports module B while B imports A. Python registers a module in `sys.modules` before its code finishes running, so the second import gets a half-initialised module, and accessing a name not yet defined raises `ImportError` or `AttributeError`. Fixes are structural: move shared code to a third module that both import, import the module rather than names from it, move an import inside the function that needs it, or merge modules that are too tightly coupled. Type-only imports can be placed under `typing.TYPE_CHECKING`.",
    detail: [
      "The error often depends on which module is imported first.",
      "Function-level imports delay the import until call time but hide dependencies, so use them sparingly.",
      "A cycle often signals that responsibilities are mixed.",
    ],
    ex: "`orders.py` imports `customers.py` for a type while `customers.py` imports `orders.py` for a helper.",
    mistakes: [
      "Fixing cycles with scattered inline imports without refactoring.",
      "Ignoring the design smell behind the cycle.",
    ],
    follow: ["What does TYPE_CHECKING do?"],
    points: [
      "A imports B, B imports A",
      "Partially initialised module in sys.modules",
      "Extract shared code",
      "Import module not names, or import late",
    ],
    notes: ["Break the cycle by restructuring."],
    src: [
      ["Python: The import system (sys.modules)", `${D}/reference/import.html`],
      ["Python: typing.TYPE_CHECKING", `${D}/library/typing.html`],
    ],
  }),
  q({
    slug: "f-strings-and-formatting",
    topic: "Strings & I/O",
    d: "easy",
    title: "How do f-strings work, and how do you format numbers with them?",
    kw: [
      "f-string",
      "string formatting",
      "format spec",
      "str.format",
      "debug specifier",
    ],
    intent: "Checks modern string formatting.",
    short:
      "An f-string is a string literal prefixed with `f` that evaluates expressions inside braces: `f'{name} is {age}'`. A format specification after a colon controls presentation: `f'{price:.2f}'` shows two decimals, `f'{n:,}'` adds thousands separators, `f'{n:05d}'` zero-pads, `f'{ratio:.1%}'` shows a percentage. Since Python 3.8 `f'{value=}'` prints the expression and its value, which helps debugging. F-strings are generally clearer than `%` formatting or `str.format`. Do not build SQL queries or shell commands with them.",
    detail: [
      "Use `{{` and `}}` for literal braces.",
      "`!r` applies `repr` to the value.",
      "Alignment is available: `f'{name:<10}|{score:>5}'`.",
    ],
    ex: "Printing a receipt line with a name left-aligned and a price with two decimals.",
    code: [
      [
        "Format specs",
        "python",
        `price = 1234.5\nname = "Pen"\nprint(f"{name:<6}|{price:>10,.2f}")  # Pen   |  1,234.50\nx = 7\nprint(f"{x=}")                        # x=7`,
        [
          "`<6` pads on the right.",
          "`,.2f` adds separators and two decimals.",
          "`=` shows name and value.",
        ],
      ],
    ],
    mistakes: [
      "Building SQL with f-strings.",
      "Forgetting to double braces for literal braces.",
    ],
    follow: ["How do you show a float with two decimals?"],
    points: [
      "f'{expr}' evaluates inline",
      "Format spec after a colon",
      "{x=} for debugging",
      "Not for SQL or shell commands",
    ],
    notes: ["Expression, colon, format."],
    src: [
      [
        "Python tutorial: Formatted string literals",
        `${D}/tutorial/inputoutput.html`,
      ],
      [
        "Python: Format specification mini-language",
        `${D}/library/string.html`,
      ],
    ],
  }),
  q({
    slug: "string-methods-and-immutability",
    topic: "Strings & I/O",
    d: "easy",
    title:
      "Which string methods should you know, and why are strings immutable?",
    kw: [
      "string methods",
      "split join",
      "strip",
      "immutable strings",
      "slicing",
    ],
    intent: "Checks day-to-day string handling.",
    short:
      "Strings are immutable sequences of Unicode characters, so methods return new strings instead of changing the original. Useful ones: `split()` and `join()` to break and combine text, `strip()` to trim whitespace, `lower()`/`upper()`, `replace()`, `startswith()`/`endswith()`, `find()` and `in` for searching, and `splitlines()`. Slicing `s[1:4]` and `s[::-1]` extract or reverse text. Because repeated `+=` in a loop copies the string each time and has quadratic cost, collect pieces in a list and call `''.join(parts)` at the end.",
    detail: [
      "`s.find(x)` returns -1 when absent, whereas `s.index(x)` raises `ValueError`.",
      "For case-insensitive comparisons prefer `casefold()`.",
      "Strings are iterable, giving one-character strings.",
    ],
    ex: "Cleaning a CSV field with `value.strip().lower()`.",
    code: [
      [
        "Common methods",
        "python",
        `s = "  Hello, World  "\nprint(s.strip().lower())          # hello, world\nprint(", ".join(["a", "b", "c"]))  # a, b, c\nprint("a,b,c".split(","))        # ['a', 'b', 'c']`,
        [
          "Each method returns a new string.",
          "`join` is the efficient way to combine.",
        ],
      ],
    ],
    mistakes: ["Expecting s.upper() to modify s.", "Concatenating in loops."],
    follow: ["Why is join faster than +=?"],
    points: [
      "Strings are immutable",
      "Methods return new strings",
      "split/join/strip/replace",
      "Use join to build",
    ],
    notes: ["New string every time."],
    src: [
      ["Python: Built-in types (str methods)", `${D}/library/stdtypes.html`],
      ["Python tutorial: Strings", `${D}/tutorial/introduction.html`],
    ],
  }),
  q({
    slug: "reading-and-writing-files-with",
    topic: "Strings & I/O",
    d: "easy",
    title: "How do you read and write text files safely in Python?",
    kw: ["open", "with statement", "file modes", "utf-8 encoding", "readlines"],
    intent: "Checks resource handling basics.",
    short:
      "Use `open(path, mode, encoding='utf-8')` inside a `with` block so the file is closed automatically, even if an error occurs: `with open('data.txt', encoding='utf-8') as f: text = f.read()`. Modes include `'r'` to read, `'w'` to write (truncating the file), `'a'` to append and `'b'` for binary. Iterating over the file object reads line by line without loading everything, which suits large files. The tutorial recommends specifying `encoding='utf-8'` unless you need another encoding, because the default can depend on the platform.",
    detail: [
      "`'w'` erases existing content, so choose `'a'` to add.",
      "`pathlib.Path.read_text()` and `write_text()` are shorter for small files.",
      "Handle `FileNotFoundError` when the file may not exist.",
    ],
    ex: "Reading a log file line by line to count error lines.",
    code: [
      [
        "Line by line",
        "python",
        `with open("app.log", encoding="utf-8") as f:\n    errors = sum(1 for line in f if "ERROR" in line)\nprint(errors)`,
        ["`with` closes the file.", "Iterating reads one line at a time."],
      ],
    ],
    mistakes: ["Not closing files.", "Opening with 'w' and losing data."],
    follow: ["What is the difference between 'w' and 'a'?"],
    points: [
      "Use with open(...)",
      "Specify encoding",
      "w truncates, a appends",
      "Iterate for large files",
    ],
    notes: ["with closes it for you."],
    src: [
      [
        "Python tutorial: Reading and writing files",
        `${D}/tutorial/inputoutput.html`,
      ],
      ["Python: open()", `${D}/library/functions.html`],
    ],
  }),
  q({
    slug: "virtual-environments-venv",
    topic: "Virtual environments & pip",
    d: "easy",
    title: "What is a virtual environment, and why use one?",
    kw: [
      "venv",
      "virtual environment",
      "dependency isolation",
      "activate",
      "site-packages",
    ],
    intent: "A practical question every Python developer meets early.",
    short:
      "A virtual environment is a self-contained directory with its own Python interpreter link and its own installed packages. Each project gets its own, so one project can use version 1 of a library while another uses version 2 without conflict, and you avoid changing the system Python. Create one with `python -m venv .venv`, activate it (`source .venv/bin/activate` on Linux and macOS, `.venv\\Scripts\\activate` on Windows), and then `pip install` puts packages inside it. Deactivate with `deactivate`. Do not commit the environment folder to version control.",
    detail: [
      "The environment can be thrown away and recreated from a requirements file.",
      "Editors need to be pointed to the environment's interpreter.",
      "Add `.venv/` to `.gitignore`.",
    ],
    ex: "Two projects needing different versions of Django each live in their own `.venv`.",
    code: [
      [
        "Create and use",
        "bash",
        `python -m venv .venv\nsource .venv/bin/activate\npip install requests\npip list\ndeactivate`,
        [
          "`venv` creates the environment.",
          "Installs go into it after activation.",
        ],
      ],
    ],
    mistakes: [
      "Installing project packages globally.",
      "Committing the .venv directory.",
    ],
    follow: ["How do you recreate an environment on another machine?"],
    points: [
      "Isolated packages per project",
      "python -m venv .venv",
      "Activate before pip install",
      "Do not commit it",
    ],
    notes: ["One environment per project."],
    src: [
      [
        "Python tutorial: Virtual environments and packages",
        `${D}/tutorial/venv.html`,
      ],
      ["Python: venv", `${D}/library/venv.html`],
    ],
  }),
  q({
    slug: "pip-requirements-and-freeze",
    topic: "Virtual environments & pip",
    d: "medium",
    title: "How do you manage and share project dependencies with pip?",
    kw: [
      "pip install",
      "requirements.txt",
      "pip freeze",
      "version pinning",
      "reproducible",
    ],
    intent: "Checks reproducible-environment habits.",
    short:
      "`pip install name` installs a package and `pip install name==1.2.3` pins a version; `pip install --upgrade name` updates it. `pip freeze` lists the installed packages with exact versions, and writing that to a file with `pip freeze > requirements.txt` records the environment. Others recreate it with `pip install -r requirements.txt` inside a fresh virtual environment. Pinning exact versions gives reproducible builds, though you must update them deliberately to receive security fixes. `pip list` shows installed packages, and `pip uninstall` removes one.",
    detail: [
      "Freeze includes transitive dependencies, which can make files long; some teams keep a hand-written top-level file as well.",
      "Always use the `pip` of the active environment, for example `python -m pip`.",
      "Review dependencies you add, since they run with your program's permissions.",
    ],
    ex: "A teammate clones the repo, creates a venv and runs `pip install -r requirements.txt` to match your setup.",
    mistakes: [
      "Running pip outside the virtual environment.",
      "Leaving dependencies unpinned and getting different results later.",
    ],
    follow: ["What does pip freeze output?"],
    points: [
      "pip install name==version",
      "pip freeze > requirements.txt",
      "pip install -r requirements.txt",
      "Pin for reproducibility",
    ],
    notes: ["Freeze, share, install."],
    src: [
      [
        "Python tutorial: Managing packages with pip",
        `${D}/tutorial/venv.html`,
      ],
      ["Python: Installing Python modules", `${D}/installing/index.html`],
    ],
  }),
  q({
    slug: "pep8-style-and-zen",
    topic: "Functions",
    d: "easy",
    title: "What is PEP 8, and which style conventions should you follow?",
    kw: ["pep 8", "naming conventions", "code style", "snake_case", "linting"],
    intent: "Checks professional hygiene.",
    short:
      "PEP 8 is the style guide for Python code. Key points: indent with four spaces, keep lines to a maximum of 79 characters, use `snake_case` for functions and variables, `CapWords` for classes and `UPPER_CASE` for constants, put imports at the top in groups (standard library, third party, local), and use `is None` for None comparisons. Consistency matters more than any single rule, and tools help: a formatter such as Black or Ruff's formatter fixes layout and a linter finds problems. `import this` prints the Zen of Python (PEP 20), a set of design principles.",
    detail: [
      "Docstrings describe what a module, class or function does.",
      "Follow the project's existing style when it differs.",
      "Run the formatter and linter in CI.",
    ],
    ex: "A pull request is easy to review when names are `calculate_total` and `OrderItem` and imports are grouped.",
    mistakes: ["Mixing tabs and spaces.", "Naming a function in camelCase."],
    follow: ["Which tools enforce style automatically?"],
    points: [
      "4-space indentation",
      "snake_case and CapWords",
      "79-character lines in PEP 8",
      "Use formatters and linters",
    ],
    notes: ["Readable, consistent code."],
    src: [
      ["PEP 8: Style guide for Python code", `${PEP}/pep-0008/`],
      ["PEP 20: The Zen of Python", `${PEP}/pep-0020/`],
    ],
  }),
])
