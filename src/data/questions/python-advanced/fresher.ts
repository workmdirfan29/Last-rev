import { defineQuestions } from "../author"
import { q } from "../compact"

const D = "https://docs.python.org/3"
const PEP = "https://peps.python.org"

export default defineQuestions("python-advanced", "fresher", [
  q({
    slug: "closures-explained",
    topic: "Closures",
    d: "easy",
    title: "What is a closure in Python?",
    kw: [
      "closure",
      "enclosing scope",
      "inner function",
      "free variable",
      "function factory",
    ],
    intent: "Checks understanding of functions remembering their environment.",
    short:
      "A closure is an inner function that keeps access to variables of the enclosing function even after the outer function has returned. Those variables are called free variables. The classic use is a function factory: `make_multiplier(3)` returns a function that multiplies by 3, remembering `3`. Closures give you private state without writing a class and are the basis of most decorators. To rebind such a variable from the inner function, declare it `nonlocal`. The captured variables are stored in the function's `__closure__` cells.",
    detail: [
      "The closure captures the variable itself, not a copy of its value at definition time.",
      "A small class is clearer when you need several methods or lots of state.",
      "Closures keep referenced objects alive as long as the function exists.",
    ],
    ex: "A `make_counter()` returns a function that increments a hidden count.",
    code: [
      [
        "Function factory",
        "python",
        `def make_multiplier(n):\n    def multiply(x):\n        return x * n    # n is a free variable\n    return multiply\n\ndouble = make_multiplier(2)\nprint(double(5))  # 10`,
        ["`multiply` remembers `n` after `make_multiplier` returns."],
      ],
    ],
    mistakes: [
      "Forgetting nonlocal when updating the captured variable.",
      "Expecting the value to be copied.",
    ],
    follow: ["What is a free variable?"],
    points: [
      "Inner function plus its environment",
      "Free variables from the enclosing scope",
      "nonlocal to rebind",
      "Basis of decorators",
    ],
    notes: ["Function with memory."],
    src: [
      ["Python tutorial: Scopes and namespaces", `${D}/tutorial/classes.html`],
      [
        "Python: Data model (function __closure__)",
        `${D}/reference/datamodel.html`,
      ],
    ],
  }),
  q({
    slug: "late-binding-closure-in-loops",
    topic: "Closures",
    d: "medium",
    title: "Why do lambdas created in a loop all return the same value?",
    kw: [
      "late binding",
      "closure in loop",
      "lambda default argument",
      "functools.partial",
      "classic gotcha",
    ],
    intent: "A famous Python gotcha with closures.",
    short:
      "A closure looks up its free variables when it is called, not when it is defined. In `fns = [lambda: i for i in range(3)]` all three lambdas refer to the same variable `i` of the enclosing scope, so after the loop every call sees its final value and returns 2. The Python FAQ describes this. Fix it by binding the current value at definition time with a default argument, `lambda i=i: i`, or with `functools.partial`, or by creating the function through a factory function so each call has its own scope.",
    detail: [
      "The issue applies to loops that create callbacks, such as button handlers.",
      "A default argument is evaluated once when the lambda is defined.",
      "A factory function gives each closure a separate variable.",
    ],
    ex: "Creating one button handler per item in a loop where every handler acts on the last item.",
    code: [
      [
        "Gotcha and fix",
        "python",
        `bad = [lambda: i for i in range(3)]\nprint([f() for f in bad])    # [2, 2, 2]\n\ngood = [lambda i=i: i for i in range(3)]\nprint([f() for f in good])   # [0, 1, 2]`,
        [
          "The first version shares one `i`.",
          "The default argument captures the current value.",
        ],
      ],
    ],
    mistakes: [
      "Assuming each closure captures the loop value.",
      "Overlooking the problem until callbacks misbehave.",
    ],
    follow: ["How else could you fix it?"],
    points: [
      "Closures bind variables, not values",
      "Lookup happens at call time",
      "Default argument captures the value",
      "partial or a factory also work",
    ],
    notes: ["Late binding."],
    src: [
      [
        "Python FAQ: Why do lambdas defined in a loop return the same result?",
        `${D}/faq/programming.html`,
      ],
      ["Python: functools.partial", `${D}/library/functools.html`],
    ],
  }),
  q({
    slug: "closures-vs-classes-for-state",
    topic: "Closures",
    d: "medium",
    title: "When would you use a closure instead of a class to hold state?",
    kw: [
      "closure vs class",
      "stateful function",
      "partial application",
      "callback",
      "encapsulation",
    ],
    intent: "Checks design trade-offs.",
    short:
      "A closure is enough when you need one behaviour with a small amount of private state, such as a counter, a configured validator or a callback that remembers settings. It is short and hides the state without any attribute access. A class is better when there are several operations on the same state, when you want to inspect or test the state, when you need inheritance, or when others must read and change it. `functools.partial` is another light option when you only want to pre-fill arguments. Choose the simplest form that stays readable.",
    detail: [
      "The state of a closure is hard to inspect and not easily pickled.",
      "Classes document their state through attributes.",
      "A callable object (`__call__`) sits between the two.",
    ],
    ex: "A retry handler configured with a delay can be a closure; a connection pool with several methods should be a class.",
    mistakes: [
      "Building a large hidden-state closure that needs several operations.",
      "Using a class for a one-line transformation.",
    ],
    follow: ["What does functools.partial give you?"],
    points: [
      "Closure: one behaviour, small state",
      "Class: multiple operations, visible state",
      "partial for pre-filled arguments",
      "Pick the simplest readable option",
    ],
    notes: ["Small state, closure; rich state, class."],
    src: [
      ["Python: functools.partial", `${D}/library/functools.html`],
      ["Python tutorial: Classes", `${D}/tutorial/classes.html`],
    ],
  }),
  q({
    slug: "decorator-basics",
    topic: "Decorators",
    d: "easy",
    title: "What is a decorator in Python, and how does the `@` syntax work?",
    kw: [
      "decorator",
      "@ syntax",
      "higher-order function",
      "wrapper",
      "pep 318",
    ],
    intent: "A staple question on functions as values.",
    short:
      "A decorator is a callable that takes a function and returns a replacement, usually a wrapper that adds behaviour before or after the original call, such as logging, timing, caching or access checks. The syntax `@decorator` above `def f(): ...` is shorthand for `f = decorator(f)`, run once when the function is defined. The wrapper typically accepts `*args, **kwargs` and passes them through, so it works for any signature, and returns the original result. Decorators rely on functions being first-class objects and on closures.",
    detail: [
      "Decorators can also be applied to classes.",
      "Use `functools.wraps` so the wrapper keeps the original name and docstring.",
      "Keep the decorated function's behaviour unchanged unless the decorator's purpose is to change it.",
    ],
    ex: "A `@timed` decorator prints how long each call to a function takes.",
    code: [
      [
        "A timing decorator",
        "python",
        `import time\nfrom functools import wraps\n\ndef timed(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = fn(*args, **kwargs)\n        print(f"{fn.__name__} took {time.perf_counter() - start:.4f}s")\n        return result\n    return wrapper\n\n@timed\ndef work():\n    return sum(range(1_000_000))\n\nwork()`,
        [
          "`@timed` means `work = timed(work)`.",
          "The wrapper forwards arguments and result.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to return the wrapper.",
      "Dropping the return value of the wrapped function.",
    ],
    follow: ["What does @decorator expand to?"],
    points: [
      "Callable that wraps a function",
      "@d is f = d(f)",
      "Wrapper forwards *args and **kwargs",
      "Uses closures",
    ],
    notes: ["Wrap behaviour around a function."],
    src: [
      [
        "Python: Compound statements (function definitions)",
        `${D}/reference/compound_stmts.html`,
      ],
      ["PEP 318: Decorators for functions and methods", `${PEP}/pep-0318/`],
    ],
  }),
  q({
    slug: "functools-wraps",
    topic: "Decorators",
    d: "medium",
    title: "Why should decorators use `functools.wraps`?",
    kw: [
      "functools.wraps",
      "__name__",
      "docstring",
      "__wrapped__",
      "introspection",
    ],
    intent: "Checks decorator hygiene.",
    short:
      "Without `wraps`, the wrapper replaces the original function, so `f.__name__`, `f.__doc__` and the signature shown by `help()` and tools become those of the wrapper. That confuses debugging, documentation generators, and frameworks that look at names. Applying `@functools.wraps(fn)` to the wrapper copies attributes such as `__module__`, `__name__`, `__qualname__`, `__doc__` and the annotations from the original, merges its `__dict__` and sets `__wrapped__` pointing to the original, which `inspect.signature` follows. Always use it when writing decorators.",
    detail: [
      "`wraps` is itself a decorator built on `functools.update_wrapper`.",
      "Test frameworks and web frameworks use function names, e.g. for routes or fixtures.",
      "`__wrapped__` lets you reach the undecorated function.",
    ],
    ex: "Without `wraps`, every decorated view in an app shows the name `wrapper` in logs.",
    mistakes: [
      "Skipping wraps in a quick decorator.",
      "Using wraps on the decorator instead of the wrapper.",
    ],
    follow: ["What does __wrapped__ give you?"],
    points: [
      "Preserves name, doc and annotations",
      "Sets __wrapped__",
      "Place it on the wrapper",
      "Helps debugging and frameworks",
    ],
    notes: ["Keep the original's identity."],
    src: [
      ["Python: functools.wraps", `${D}/library/functools.html`],
      ["Python: inspect.signature", `${D}/library/inspect.html`],
    ],
  }),
  q({
    slug: "decorators-with-arguments",
    topic: "Decorators",
    d: "medium",
    title:
      "How do you write a decorator that takes arguments, such as `@retry(times=3)`?",
    kw: [
      "decorator factory",
      "parametrised decorator",
      "three nested functions",
      "retry decorator",
      "arguments",
    ],
    intent: "Checks the extra level of nesting.",
    short:
      "A decorator with arguments is a function that returns a decorator. `@retry(times=3)` first calls `retry(3)`, which returns the real decorator, and that decorator is then applied to the function. So you need three levels: the outer function takes the settings, the middle function takes the function to decorate, and the inner wrapper does the work. Apply `functools.wraps` to the wrapper. A common design lets the decorator work both with and without parentheses, but that adds complexity, so keep it explicit unless there is a good reason.",
    detail: [
      "`@retry(times=3)` is `f = retry(times=3)(f)`.",
      "Avoid catching broad exceptions in retry decorators; retry only on errors you expect.",
      "Class-based decorators can store settings as attributes.",
    ],
    ex: "A `@retry(times=3)` decorator re-runs a flaky network call a few times.",
    code: [
      [
        "Decorator factory",
        "python",
        `from functools import wraps\n\ndef repeat(times):\n    def decorator(fn):\n        @wraps(fn)\n        def wrapper(*args, **kwargs):\n            result = None\n            for _ in range(times):\n                result = fn(*args, **kwargs)\n            return result\n        return wrapper\n    return decorator\n\n@repeat(times=2)\ndef hello():\n    print("hi")\n\nhello()  # prints hi twice`,
        [
          "`repeat(2)` returns `decorator`.",
          "`decorator` is applied to `hello`.",
        ],
      ],
    ],
    mistakes: [
      "Writing @repeat without calling it.",
      "Retrying on every exception type.",
    ],
    follow: ["What does @retry(3) expand to?"],
    points: [
      "Decorator returns a decorator",
      "Three nested functions",
      "@d(args) is d(args)(f)",
      "Use wraps",
    ],
    notes: ["Configure, decorate, wrap."],
    src: [
      [
        "Python: Compound statements (decorators)",
        `${D}/reference/compound_stmts.html`,
      ],
      ["Python: functools.wraps", `${D}/library/functools.html`],
    ],
  }),
  q({
    slug: "stacked-and-class-decorators",
    topic: "Decorators",
    d: "medium",
    title:
      "In what order do stacked decorators apply, and can classes be decorators?",
    kw: [
      "stacked decorators",
      "decorator order",
      "class decorator",
      "callable class",
      "__call__",
    ],
    intent: "Checks understanding of decorator composition.",
    short:
      "Stacked decorators apply from the bottom up: `@a` above `@b` above `def f` is `f = a(b(f))`, so `b` wraps the function first and `a` wraps the result; at call time `a`'s wrapper runs first. Order matters, for example `@login_required` should wrap the function after a route decorator registers it only if the route decorator is outermost. A decorator can also be a class whose `__init__` takes the function and whose `__call__` runs the wrapper, which suits decorators that keep state such as call counts. A decorator can also be applied to a class to modify or register it.",
    detail: [
      "A class-based decorator needs `functools.update_wrapper(self, fn)` to look like the function.",
      "Methods wrapped by class-based decorators need extra work to bind `self`.",
      "Function-based decorators are simpler for most needs.",
    ],
    ex: "`@app.route` registers a view, so access-check decorators are placed below it.",
    code: [
      [
        "Order of application",
        "python",
        `def a(fn):\n    def w(*x): print("a before"); return fn(*x)\n    return w\ndef b(fn):\n    def w(*x): print("b before"); return fn(*x)\n    return w\n\n@a\n@b\ndef f(): print("f")\n\nf()\n# a before\n# b before\n# f`,
        ["`f = a(b(f))`.", "The outer wrapper runs first when called."],
      ],
    ],
    mistakes: [
      "Placing decorators in the wrong order.",
      "Forgetting binding issues for class-based decorators on methods.",
    ],
    follow: ["What is the expansion of two stacked decorators?"],
    points: [
      "Bottom-up application",
      "f = a(b(f))",
      "Outermost wrapper runs first",
      "Class-based decorators use __call__",
    ],
    notes: ["Closest to the function applies first."],
    src: [
      [
        "Python: Compound statements (function definitions)",
        `${D}/reference/compound_stmts.html`,
      ],
      ["Python: functools.update_wrapper", `${D}/library/functools.html`],
    ],
  }),
  q({
    slug: "lru-cache-memoization",
    topic: "Decorators",
    d: "medium",
    title: "How does `functools.lru_cache` work, and what are its limitations?",
    kw: [
      "lru_cache",
      "memoization",
      "functools.cache",
      "cache_info",
      "hashable arguments",
    ],
    intent: "Checks use of built-in memoisation.",
    short:
      "`@functools.lru_cache(maxsize=128)` wraps a function so results are remembered per argument combination; a repeat call with the same arguments returns the cached result without running the function. When the cache is full it discards the least recently used entry, and `maxsize=None` or `functools.cache` (3.9+) makes it unbounded. Arguments must be hashable, so lists and dicts cannot be passed. Use `cache_info()` to see hits and misses and `cache_clear()` to reset. Only cache pure functions, whose result depends only on their arguments.",
    detail: [
      "On methods, the cache holds a reference to `self`, which can keep instances alive.",
      "Cached results that are mutable objects are shared between callers.",
      "Memoising recursive functions such as Fibonacci turns exponential time into linear.",
    ],
    ex: "Caching the result of an expensive pure computation like parsing a configuration by path.",
    code: [
      [
        "Memoised Fibonacci",
        "python",
        `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nprint(fib(80))\nprint(fib.cache_info())`,
        ["Each `n` is computed once.", "`cache_info` shows hits and misses."],
      ],
    ],
    mistakes: [
      "Caching functions with side effects.",
      "Passing unhashable arguments.",
    ],
    follow: ["Why must arguments be hashable?"],
    points: [
      "Remembers results per arguments",
      "Least-recently-used eviction",
      "Arguments must be hashable",
      "Cache pure functions only",
    ],
    notes: ["Remember pure results."],
    src: [
      ["Python: functools.lru_cache", `${D}/library/functools.html`],
      ["Python FAQ: How do I cache method calls?", `${D}/faq/programming.html`],
    ],
  }),
  q({
    slug: "functools-partial-and-reduce",
    topic: "Closures",
    d: "easy",
    title: "What do `functools.partial` and `functools.reduce` do?",
    kw: [
      "functools.partial",
      "reduce",
      "partial application",
      "fold",
      "callable",
    ],
    intent: "Checks functional utilities.",
    short:
      "`functools.partial(func, *args, **kwargs)` returns a new callable with some arguments already filled in, so `int_from_binary = partial(int, base=2)` then `int_from_binary('101')` gives 5. It is useful for callbacks that need extra data. `functools.reduce(function, iterable, initial)` applies a two-argument function cumulatively to the items, folding them into a single value, for example multiplying all numbers. For sums, products and joins, built-ins such as `sum`, `math.prod` and `str.join` are clearer than `reduce`, so reserve it for operations without a built-in.",
    detail: [
      "A partial object exposes `.func`, `.args` and `.keywords`.",
      "`reduce` with an empty iterable and no initial value raises `TypeError`.",
      "`itertools.accumulate` returns the running results instead of only the last.",
    ],
    ex: "Passing `partial(send_email, sender='noreply@example.com')` as a callback.",
    code: [
      [
        "partial and reduce",
        "python",
        `from functools import partial, reduce\n\nbinary = partial(int, base=2)\nprint(binary("101"))                       # 5\nprint(reduce(lambda a, b: a * b, [1, 2, 3, 4], 1))  # 24`,
        [
          "`partial` fixes the keyword `base`.",
          "`reduce` folds the list into one product.",
        ],
      ],
    ],
    mistakes: [
      "Using reduce where sum or join is clearer.",
      "Forgetting the initial value for possibly empty input.",
    ],
    follow: [
      "What happens when you reduce an empty list without an initial value?",
    ],
    points: [
      "partial pre-fills arguments",
      "reduce folds to one value",
      "Prefer sum, prod, join",
      "accumulate shows running results",
    ],
    notes: ["Pre-fill or fold."],
    src: [
      ["Python: functools", `${D}/library/functools.html`],
      ["Python: itertools.accumulate", `${D}/library/itertools.html`],
    ],
  }),
  q({
    slug: "iterable-versus-iterator",
    topic: "Iterators",
    d: "easy",
    title: "What is the difference between an iterable and an iterator?",
    kw: ["iterable", "iterator", "iter", "next", "single pass"],
    intent: "A basic but essential distinction.",
    short:
      "An iterable is any object you can loop over: it provides an `__iter__` method that returns an iterator (lists, strings, dicts, files, ranges). An iterator is the object that does the traversal: it has `__next__`, which returns the next item and raises `StopIteration` when exhausted, and `__iter__` returning itself. `iter(x)` gets an iterator from an iterable and `next(it)` advances it. Iterables like lists can be looped many times because each loop gets a fresh iterator, but an iterator is consumed once and cannot be reset.",
    detail: [
      "`next(it, default)` returns a default instead of raising at the end.",
      "File objects, generators and `zip`, `map` and `enumerate` results are iterators.",
      "Convert an iterator to a list to reuse it.",
    ],
    ex: "Looping over `zip(a, b)` twice yields nothing the second time.",
    code: [
      [
        "Manual iteration",
        "python",
        `nums = [1, 2]\nit = iter(nums)\nprint(next(it), next(it))   # 1 2\nprint(next(it, "done"))     # done\n\npairs = zip("ab", "cd")\nprint(list(pairs), list(pairs))  # [('a','c'),('b','d')] []`,
        [
          "The iterator is exhausted after two items.",
          "The second `list(pairs)` is empty.",
        ],
      ],
    ],
    mistakes: [
      "Iterating an iterator twice.",
      "Confusing iterable with iterator.",
    ],
    follow: ["What does a for loop call under the hood?"],
    points: [
      "Iterable has __iter__",
      "Iterator has __next__",
      "Iterators are single use",
      "iter() and next()",
    ],
    notes: ["Iterable makes an iterator."],
    src: [
      ["Python tutorial: Iterators", `${D}/tutorial/classes.html`],
      ["Python: Iterator types", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "custom-iterator-class",
    topic: "Iterators",
    d: "medium",
    title: "How do you write your own iterator class?",
    kw: [
      "custom iterator",
      "__iter__",
      "__next__",
      "stopiteration",
      "iterator protocol",
    ],
    intent: "Checks implementation of the protocol.",
    short:
      "Define a class with `__iter__` returning `self` and `__next__` returning the next value or raising `StopIteration` when finished. The class keeps its position in instance attributes. After that, `for` loops, `list()`, unpacking and `in` all work with it. If you want a reusable iterable instead, make `__iter__` return a new iterator each time, for example by writing it as a generator method; that lets the object be looped repeatedly. In practice a generator function is a much shorter way to produce an iterator, so write a class only when you need extra methods or state.",
    detail: [
      "Raising `StopIteration` is what ends the `for` loop silently.",
      "An iterator that returns itself from `__iter__` can only be used once.",
      "Separate the container from its iterator when both are needed.",
    ],
    ex: "A `Countdown(3)` iterator yields 3, 2, 1.",
    code: [
      [
        "Iterator class",
        "python",
        `class Countdown:\n    def __init__(self, start):\n        self.n = start\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.n <= 0:\n            raise StopIteration\n        self.n -= 1\n        return self.n + 1\n\nprint(list(Countdown(3)))  # [3, 2, 1]`,
        ["State lives in `self.n`.", "`StopIteration` ends the loop."],
      ],
    ],
    mistakes: [
      "Forgetting to raise StopIteration, causing an endless loop.",
      "Returning self from __iter__ for a container that should be reusable.",
    ],
    follow: ["How would a generator simplify this?"],
    points: [
      "__iter__ returns an iterator",
      "__next__ returns or raises StopIteration",
      "State in attributes",
      "Generators are shorter",
    ],
    notes: ["Two methods make an iterator."],
    src: [
      ["Python tutorial: Iterators", `${D}/tutorial/classes.html`],
      [
        "Python: Data model (__iter__ and __next__)",
        `${D}/reference/datamodel.html`,
      ],
    ],
  }),
  q({
    slug: "for-loop-desugaring-stopiteration",
    topic: "Iterators",
    d: "medium",
    title:
      "What does a `for` loop do internally, and how does `StopIteration` fit in?",
    kw: [
      "for loop internals",
      "iter next",
      "stopiteration",
      "two-argument iter",
      "sentinel",
    ],
    intent: "Checks understanding of what for really does.",
    short:
      "`for x in obj:` first calls `iter(obj)` to get an iterator, then repeatedly calls `next()` on it and binds the result to `x`, running the body each time. When the iterator raises `StopIteration`, the loop ends quietly; any other exception propagates. This is why anything implementing the protocol works in a `for` loop, a comprehension, `sum()` or unpacking. The two-argument form `iter(callable, sentinel)` calls the callable repeatedly until it returns the sentinel, which is handy for reading in blocks, as in `iter(lambda: f.read(1024), b'')`.",
    detail: [
      "`StopIteration` raised inside the loop body is not swallowed by the loop.",
      "Iterating a dict gives its keys, a file gives lines.",
      "`next(it)` called manually at the end raises `StopIteration`.",
    ],
    ex: "Reading a binary file in 1 KB chunks with the two-argument `iter`.",
    code: [
      [
        "Equivalent while loop",
        "python",
        `it = iter([10, 20])\nwhile True:\n    try:\n        x = next(it)\n    except StopIteration:\n        break\n    print(x)`,
        ["This mimics `for x in [10, 20]`."],
      ],
    ],
    mistakes: [
      "Calling next() with no default at the end of data.",
      "Treating StopIteration as an error in loops.",
    ],
    follow: ["What does iter(callable, sentinel) do?"],
    points: [
      "iter() then repeated next()",
      "StopIteration ends the loop",
      "Any protocol-following object works",
      "Two-argument iter uses a sentinel",
    ],
    notes: ["for = iter + next."],
    src: [
      [
        "Python: Compound statements (for)",
        `${D}/reference/compound_stmts.html`,
      ],
      ["Python: iter() and next()", `${D}/library/functions.html`],
    ],
  }),
  q({
    slug: "itertools-essentials",
    topic: "Iterators",
    d: "medium",
    title: "Which `itertools` functions are worth knowing?",
    kw: ["itertools", "chain", "islice", "product", "combinations"],
    intent: "Checks knowledge of the standard iterator toolbox.",
    short:
      "`itertools` provides fast, lazy building blocks. `chain(a, b)` joins iterables, `islice(it, n)` takes a slice from any iterator, `count()` and `cycle()` produce endless sequences, `product`, `permutations` and `combinations` generate combinatorial tuples, `groupby` groups consecutive equal keys (so sort first), `zip_longest` pads shorter inputs, `accumulate` gives running totals and `takewhile` stops at the first false item. Since they are iterators they use little memory, but like any iterator they can be consumed only once.",
    detail: [
      "`pairwise` (3.10) yields overlapping pairs, `batched` (3.12) yields chunks.",
      "Wrap with `list()` to see the results while experimenting.",
      "Infinite iterators need a limiter like `islice` or `takewhile`.",
    ],
    ex: "Taking the first 5 lines of a huge file with `islice(f, 5)`.",
    code: [
      [
        "A few tools",
        "python",
        `from itertools import chain, islice, count, combinations\n\nprint(list(chain([1, 2], [3])))              # [1, 2, 3]\nprint(list(islice(count(10), 3)))            # [10, 11, 12]\nprint(list(combinations("abc", 2)))          # [('a','b'),('a','c'),('b','c')]`,
        ["All three results are produced lazily."],
      ],
    ],
    mistakes: [
      "Calling groupby on unsorted data.",
      "Looping over an infinite iterator without a limit.",
    ],
    follow: ["Why does groupby need sorted data?"],
    points: [
      "Lazy iterator tools",
      "chain, islice, count, cycle",
      "product, permutations, combinations",
      "groupby needs sorting",
    ],
    notes: ["Iterator Lego bricks."],
    src: [
      ["Python: itertools", `${D}/library/itertools.html`],
      ["Python: Functional programming HOWTO", `${D}/howto/functional.html`],
    ],
  }),
  q({
    slug: "generator-functions-and-yield",
    topic: "Generators",
    d: "easy",
    title: "What is a generator function, and how does `yield` work?",
    kw: [
      "generator",
      "yield",
      "lazy sequence",
      "generator function",
      "pause and resume",
    ],
    intent: "Checks understanding of generators.",
    short:
      "A function containing `yield` is a generator function: calling it does not run the body but returns a generator object, which is an iterator. Each `next()` runs the body until the next `yield`, hands the value to the caller and pauses, keeping local variables and position until it is resumed. When the function ends, it raises `StopIteration`. Generators produce values lazily, one at a time, so they can describe huge or infinite sequences with constant memory and are much simpler than writing an iterator class.",
    detail: [
      "A generator can be iterated only once.",
      "`return` inside a generator ends it, and its value is attached to `StopIteration`.",
      "Generator expressions `(x for x in ...)` are the compact form.",
    ],
    ex: "A generator that yields Fibonacci numbers forever.",
    code: [
      [
        "Infinite generator",
        "python",
        `def fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\ng = fib()\nprint([next(g) for _ in range(8)])  # [0, 1, 1, 2, 3, 5, 8, 13]`,
        [
          "The function pauses at each `yield`.",
          "State persists between `next` calls.",
        ],
      ],
    ],
    mistakes: [
      "Expecting the body to run when the function is called.",
      "Reusing an exhausted generator.",
    ],
    follow: ["How is a generator different from returning a list?"],
    points: [
      "yield makes a generator function",
      "Returns an iterator",
      "Pauses and resumes with state",
      "Lazy and memory-light",
    ],
    notes: ["Produce values on demand."],
    src: [
      ["Python tutorial: Generators", `${D}/tutorial/classes.html`],
      ["PEP 255: Simple generators", `${PEP}/pep-0255/`],
    ],
  }),
  q({
    slug: "generator-pipelines-large-data",
    topic: "Generators",
    d: "medium",
    title: "How do generators help process large files or streams?",
    kw: [
      "generator pipeline",
      "large file",
      "lazy processing",
      "memory efficient",
      "streaming",
    ],
    intent: "A practical use case question.",
    short:
      "Generators let you process data one item at a time instead of loading everything into memory. You chain steps, each a generator that consumes the previous one: read lines, filter them, parse them, aggregate them. Because nothing is computed until the final consumer asks for values, a multi-gigabyte log file can be handled with a small constant amount of memory, and processing can stop early. File objects are themselves lazy line iterators, so `for line in f` already streams. The cost is that you cannot index or take the length of a generator.",
    detail: [
      "Each stage is small and easy to test.",
      "Use `itertools.islice` to look at only the first few results.",
      "If you need to reuse results, store them in a list or file first.",
    ],
    ex: "Counting error lines in a 5 GB log without reading it all.",
    code: [
      [
        "Pipeline",
        "python",
        `def lines(path):\n    with open(path, encoding="utf-8") as f:\n        for line in f:\n            yield line.rstrip("\\n")\n\ndef errors(it):\n    return (l for l in it if "ERROR" in l)\n\nprint(sum(1 for _ in errors(lines("app.log"))))`,
        ["Each step pulls one line at a time.", "Memory use stays constant."],
      ],
    ],
    mistakes: [
      "Calling readlines() on huge files.",
      "Trying to len() or index a generator.",
    ],
    follow: ["How would you inspect the first 10 results?"],
    points: [
      "Process one item at a time",
      "Chain generator stages",
      "Constant memory",
      "No indexing or len",
    ],
    notes: ["Stream, don't load."],
    src: [
      ["Python tutorial: Generator expressions", `${D}/tutorial/classes.html`],
      ["Python: itertools.islice", `${D}/library/itertools.html`],
    ],
  }),
  q({
    slug: "generator-send-close-yield-from",
    topic: "Generators",
    d: "hard",
    title: "What do `send()`, `close()` and `yield from` do with generators?",
    kw: [
      "generator send",
      "yield from",
      "generator close",
      "delegation",
      "pep 380",
    ],
    intent: "Checks advanced generator features.",
    short:
      "`yield` is an expression: `gen.send(value)` resumes the generator and makes the paused `yield` evaluate to `value`, so data can flow in as well as out. The generator must be started with `next()` or `send(None)` first. `gen.close()` raises `GeneratorExit` at the paused point so cleanup in `finally` blocks can run, and `gen.throw()` raises an exception inside it. `yield from sub` delegates to another iterable or generator: values, `send` and `throw` pass through, and the sub-generator's `return` value becomes the value of the `yield from` expression (PEP 380).",
    detail: [
      "`yield from` replaces a `for` loop that re-yields each item and handles forwarding correctly.",
      "These features were the basis of old-style coroutines before `async`/`await`.",
      "A `finally` block in a generator runs on `close()`.",
    ],
    ex: "A running-average generator receives each new number through `send`.",
    code: [
      [
        "send and yield from",
        "python",
        `def averager():\n    total = count = 0\n    avg = None\n    while True:\n        x = yield avg\n        total += x\n        count += 1\n        avg = total / count\n\ng = averager()\nnext(g)               # prime it\nprint(g.send(10))     # 10.0\nprint(g.send(20))     # 15.0\n\ndef both():\n    yield from range(2)\n    yield from "ab"\nprint(list(both()))   # [0, 1, 'a', 'b']`,
        [
          "`send` supplies the value of the yield.",
          "`yield from` delegates to sub-iterables.",
        ],
      ],
    ],
    mistakes: [
      "Calling send(value) before the generator started.",
      "Forgetting to prime the generator.",
    ],
    follow: ["What does close() raise inside the generator?"],
    points: [
      "send passes values in",
      "close raises GeneratorExit",
      "yield from delegates",
      "Sub-generator return becomes the result",
    ],
    notes: ["Two-way generators."],
    src: [
      [
        "Python: Expressions (yield expressions)",
        `${D}/reference/expressions.html`,
      ],
      ["PEP 380: Syntax for delegating to a subgenerator", `${PEP}/pep-0380/`],
    ],
  }),
  q({
    slug: "stopiteration-in-generators-pep-479",
    topic: "Generators",
    d: "hard",
    title: "What happens if `StopIteration` is raised inside a generator?",
    kw: [
      "pep 479",
      "stopiteration",
      "runtimeerror",
      "generator return",
      "next inside generator",
    ],
    intent: "Checks a subtle rule.",
    short:
      "Since Python 3.7 (PEP 479), if a `StopIteration` exception escapes from inside a generator body, Python converts it into a `RuntimeError`. Before, it silently ended the generator, which hid bugs such as a stray `next()` call on an empty iterator. A generator should end by returning, and `return value` is how it supplies a result, carried by the `StopIteration` that the caller sees. If you call `next(it)` inside a generator and the inner iterator might be exhausted, pass a default `next(it, None)` or catch `StopIteration` explicitly.",
    detail: [
      "A normal `return` or falling off the end is the correct way to stop.",
      "The same conversion applies to generator expressions.",
      "`for` loops over an iterator are safe because they handle `StopIteration` themselves.",
    ],
    ex: "A helper that calls `next(pairs)` without a default crashes the generator with `RuntimeError` when data runs out.",
    mistakes: [
      "Calling next() without a default inside a generator.",
      "Raising StopIteration manually to stop.",
    ],
    follow: ["How should a generator signal its end?"],
    points: [
      "StopIteration becomes RuntimeError",
      "Return to finish",
      "Use next(it, default)",
      "Introduced by PEP 479",
    ],
    notes: ["Return, don't raise StopIteration."],
    src: [
      [
        "PEP 479: Change StopIteration handling inside generators",
        `${PEP}/pep-0479/`,
      ],
      [
        "Python: Expressions (generator-iterator methods)",
        `${D}/reference/expressions.html`,
      ],
    ],
  }),
  q({
    slug: "with-statement-context-manager-protocol",
    topic: "Context managers",
    d: "easy",
    title: "What is a context manager, and what does the `with` statement do?",
    kw: [
      "context manager",
      "with statement",
      "__enter__",
      "__exit__",
      "resource cleanup",
    ],
    intent: "Checks resource management basics.",
    short:
      "A context manager sets something up and guarantees cleanup. The `with` statement calls the object's `__enter__` method, binds its return value to the name after `as`, runs the block, and then always calls `__exit__`, whether the block finished normally or raised an exception. It is the standard way to handle files, locks, database transactions and network connections, replacing `try`/`finally` boilerplate. `__exit__(exc_type, exc, tb)` receives the exception details and can suppress the exception by returning a true value.",
    detail: [
      "`with open(...) as f` closes the file even on errors.",
      "Locks in `threading` can be used with `with lock:`.",
      "PEP 343 introduced the statement.",
    ],
    ex: "`with open('data.txt') as f:` reads a file and closes it automatically.",
    code: [
      [
        "Class-based context manager",
        "python",
        `class Timer:\n    def __enter__(self):\n        import time\n        self.start = time.perf_counter()\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        import time\n        print(f"took {time.perf_counter() - self.start:.3f}s")\n        return False   # do not suppress exceptions\n\nwith Timer():\n    sum(range(1_000_000))`,
        ["`__enter__` runs first.", "`__exit__` always runs afterwards."],
      ],
    ],
    mistakes: [
      "Opening resources without with.",
      "Returning True from __exit__ by accident, hiding errors.",
    ],
    follow: ["What does returning True from __exit__ do?"],
    points: [
      "__enter__ and __exit__",
      "Cleanup always runs",
      "as binds __enter__'s result",
      "True from __exit__ suppresses",
    ],
    notes: ["Setup and guaranteed teardown."],
    src: [
      [
        "Python: Data model (with statement context managers)",
        `${D}/reference/datamodel.html`,
      ],
      ["PEP 343: The with statement", `${PEP}/pep-0343/`],
    ],
  }),
  q({
    slug: "contextlib-contextmanager",
    topic: "Context managers",
    d: "medium",
    title:
      "How do you write a context manager with `contextlib.contextmanager`?",
    kw: [
      "contextmanager",
      "contextlib",
      "generator context manager",
      "try finally",
      "yield",
    ],
    intent: "Checks the shorthand for writing context managers.",
    short:
      "Decorate a generator function that yields exactly once with `@contextlib.contextmanager`. The code before `yield` is the setup (`__enter__`), the yielded value is bound after `as`, and the code after `yield` is the teardown (`__exit__`). If the `with` body raises an exception, it is re-raised at the `yield`, so wrap the `yield` in `try`/`finally` to guarantee cleanup. This is shorter than a class with two dunder methods. Use it for temporary changes like switching directories, holding a lock, or timing a block.",
    detail: [
      "Catching the exception at the `yield` and not re-raising suppresses it.",
      "The decorated function can be used as a decorator too, because the result supports `ContextDecorator`.",
      "Do not yield more than once.",
    ],
    ex: "A context manager that changes the working directory and restores it afterwards.",
    code: [
      [
        "Generator-based",
        "python",
        `import os\nfrom contextlib import contextmanager\n\n@contextmanager\ndef chdir(path):\n    old = os.getcwd()\n    os.chdir(path)\n    try:\n        yield\n    finally:\n        os.chdir(old)\n\nwith chdir("/tmp"):\n    print(os.getcwd())`,
        ["`try`/`finally` makes the restore reliable."],
      ],
    ],
    mistakes: [
      "Skipping try/finally, so cleanup is lost on errors.",
      "Yielding twice.",
    ],
    follow: ["How does an exception in the with body reach the generator?"],
    points: [
      "Decorate a one-yield generator",
      "Before yield = setup",
      "After yield = teardown",
      "Use try/finally",
    ],
    notes: ["Generator instead of a class."],
    src: [
      ["Python: contextlib.contextmanager", `${D}/library/contextlib.html`],
      [
        "Python: Compound statements (with)",
        `${D}/reference/compound_stmts.html`,
      ],
    ],
  }),
  q({
    slug: "suppressing-exceptions-in-context-managers",
    topic: "Context managers",
    d: "hard",
    title: "How can a context manager handle or suppress exceptions?",
    kw: [
      "__exit__ suppress",
      "contextlib.suppress",
      "exception handling",
      "exc_type",
      "swallow exception",
    ],
    intent: "Checks the exception side of context managers.",
    short:
      "When the `with` block raises, `__exit__` receives the exception type, value and traceback. If it returns a true value, the exception is suppressed and execution continues after the `with` statement; if it returns false or `None`, the exception propagates. `contextlib.suppress(FileNotFoundError)` packages the common case of ignoring specific, expected exceptions. Suppress only the narrow exceptions you expect, since hiding errors makes bugs hard to find. For logging or rollback, do the work in `__exit__` and let the exception continue.",
    detail: [
      "In `@contextmanager`, handling the exception around `yield` and not re-raising suppresses it.",
      "Never suppress `BaseException` broadly; it includes `KeyboardInterrupt`.",
      "A transaction manager commits on success and rolls back on an exception.",
    ],
    ex: "Deleting a temporary file, ignoring the case where it is already gone.",
    code: [
      [
        "suppress",
        "python",
        `from contextlib import suppress\nimport os\n\nwith suppress(FileNotFoundError):\n    os.remove("maybe-missing.tmp")\nprint("continues either way")`,
        ["Only `FileNotFoundError` is ignored."],
      ],
    ],
    mistakes: [
      "Suppressing every exception.",
      "Returning True from __exit__ without checking the type.",
    ],
    follow: ["How does a transaction context manager use __exit__?"],
    points: [
      "__exit__ gets exception details",
      "True suppresses",
      "contextlib.suppress for expected errors",
      "Keep it narrow",
    ],
    notes: ["Suppress narrowly."],
    src: [
      ["Python: contextlib.suppress", `${D}/library/contextlib.html`],
      ["Python: Data model (__exit__)", `${D}/reference/datamodel.html`],
    ],
  }),
  q({
    slug: "exitstack-and-multiple-context-managers",
    topic: "Context managers",
    d: "medium",
    title:
      "How do you use several context managers together, or a dynamic number of them?",
    kw: [
      "multiple with",
      "exitstack",
      "nested context managers",
      "parenthesized with",
      "dynamic resources",
    ],
    intent: "Checks managing several resources.",
    short:
      "Separate several managers with commas in one statement: `with open(a) as src, open(b, 'w') as dst:`. They are entered left to right and exited in reverse order. Python 3.10 officially allows wrapping them in parentheses so a long list can span lines. When the number of resources is only known at run time, use `contextlib.ExitStack`: call `stack.enter_context(cm)` for each one inside a `with ExitStack() as stack:` block, and all are closed in reverse order when the block ends, even if one fails to open. `stack.callback(func)` registers any cleanup function.",
    detail: [
      "`contextlib.closing(obj)` wraps an object that has `close()` but is not a context manager.",
      "`nullcontext()` is a do-nothing manager useful for optional behaviour.",
      "ExitStack avoids deeply nested `with` blocks.",
    ],
    ex: "Opening every file in a list of paths at once and closing them all together.",
    code: [
      [
        "ExitStack",
        "python",
        `from contextlib import ExitStack\n\npaths = ["a.txt", "b.txt"]\nwith ExitStack() as stack:\n    files = [stack.enter_context(open(p, encoding="utf-8")) for p in paths]\n    print([f.readline() for f in files])`,
        [
          "Each file is registered with the stack.",
          "All close in reverse order on exit.",
        ],
      ],
    ],
    mistakes: [
      "Nesting many with blocks when a list is needed.",
      "Opening resources outside the stack and forgetting to close them.",
    ],
    follow: ["In what order are the managers exited?"],
    points: [
      "Comma-separated with",
      "Exit in reverse order",
      "ExitStack for dynamic numbers",
      "closing and nullcontext helpers",
    ],
    notes: ["Stack the cleanups."],
    src: [
      ["Python: contextlib.ExitStack", `${D}/library/contextlib.html`],
      [
        "Python: Compound statements (with)",
        `${D}/reference/compound_stmts.html`,
      ],
    ],
  }),
  q({
    slug: "decorator-registry-pattern",
    topic: "Decorators",
    d: "medium",
    title:
      "How can a decorator register functions, as web frameworks do for routes?",
    kw: [
      "registry decorator",
      "plugin registration",
      "route decorator",
      "dispatch table",
      "decorator returns original",
    ],
    intent: "Checks a practical, non-wrapping use of decorators.",
    short:
      "A decorator does not have to wrap the function. A registering decorator stores the function in a dictionary and returns it unchanged, so the function still works normally while the framework knows about it. This is how `@app.route('/home')` in web frameworks, command-line command registries and plugin systems collect handlers. The decorator factory takes the key as its argument, adds `registry[key] = fn` and returns `fn`. The registration happens at import time, when the decorator runs, so the module must be imported for the handler to be registered.",
    detail: [
      "Returning the original function keeps tracebacks and testing simple.",
      "Registered handlers can be dispatched by key without long `if`/`elif` chains.",
      "Be careful with import order: unimported modules register nothing.",
    ],
    ex: "A CLI where `@command('init')` and `@command('build')` add functions to a dispatch table.",
    code: [
      [
        "Registry",
        "python",
        `HANDLERS = {}\n\ndef command(name):\n    def register(fn):\n        HANDLERS[name] = fn\n        return fn\n    return register\n\n@command("hello")\ndef hello():\n    return "hi"\n\nprint(HANDLERS["hello"]())  # hi`,
        ["The decorator stores and returns the same function."],
      ],
    ],
    mistakes: [
      "Forgetting to return the function, leaving None.",
      "Expecting registration without importing the module.",
    ],
    follow: ["When does registration happen?"],
    points: [
      "Store and return the original",
      "Runs at definition time",
      "Replaces if/elif dispatch",
      "Needs the module imported",
    ],
    notes: ["Decorate to register, not to wrap."],
    src: [
      [
        "Python: Compound statements (function definitions)",
        `${D}/reference/compound_stmts.html`,
      ],
      ["Python: Data model", `${D}/reference/datamodel.html`],
    ],
  }),
  q({
    slug: "writing-a-memoize-decorator",
    topic: "Decorators",
    d: "medium",
    title: "How would you write your own memoisation decorator?",
    kw: [
      "memoize decorator",
      "cache dictionary",
      "args as key",
      "pure function",
      "functools.cache",
    ],
    intent: "Checks you can combine closures, dicts and decorators.",
    short:
      "Create a dictionary inside the decorator, define a wrapper that builds a key from the arguments, such as the `args` tuple plus a tuple of sorted `kwargs` items, returns the cached value when the key exists and otherwise calls the function, stores the result and returns it. Arguments must be hashable. The cache lives in the closure, so each decorated function has its own. In real code use `functools.cache` or `lru_cache`, which are tested, thread-safe and offer size limits and statistics; writing your own is mainly a way to understand how decorators and closures combine.",
    detail: [
      "Unbounded caches can grow without limit.",
      "Only memoise pure functions.",
      "Use `wraps` so the decorated function keeps its name.",
    ],
    ex: "Caching a slow recursive function such as counting paths in a grid.",
    code: [
      [
        "Own memoize",
        "python",
        `from functools import wraps\n\ndef memoize(fn):\n    cache = {}\n    @wraps(fn)\n    def wrapper(*args):\n        if args not in cache:\n            cache[args] = fn(*args)\n        return cache[args]\n    return wrapper\n\n@memoize\ndef square(n):\n    print("computing", n)\n    return n * n\n\nsquare(4); square(4)   # computing printed once`,
        [
          "`cache` is captured by the closure.",
          "The second call is a dictionary hit.",
        ],
      ],
    ],
    mistakes: [
      "Ignoring keyword arguments in the key.",
      "Memoising functions with side effects.",
    ],
    follow: ["What would you use instead in production code?"],
    points: [
      "Dict in a closure",
      "Key built from arguments",
      "Hashable arguments only",
      "Prefer functools.cache",
    ],
    notes: ["Closure plus dict."],
    src: [
      ["Python: functools.cache and lru_cache", `${D}/library/functools.html`],
      ["Python tutorial: Dictionaries", `${D}/tutorial/datastructures.html`],
    ],
  }),
  q({
    slug: "iterator-versus-generator",
    topic: "Generators",
    d: "medium",
    title:
      "How do generators relate to iterators, and when would you still write an iterator class?",
    kw: [
      "generator vs iterator",
      "iterator class",
      "generator object",
      "stateful iterator",
      "extra methods",
    ],
    intent: "Checks the relationship between the two concepts.",
    short:
      "Every generator is an iterator: a generator object has `__iter__` and `__next__`, created automatically from a function with `yield` or from a generator expression. Generators save the boilerplate because Python keeps the local variables and the position for you. Not every iterator is a generator, though. You write an iterator class when you need extra methods or attributes on the iterator itself, such as `peek()` or `reset()`, when the iteration state must be inspected or copied, or when the object must support `__len__` or other behaviours along with iteration. Otherwise choose a generator.",
    detail: [
      "Generators also support `send`, `throw` and `close`, which plain iterator classes do not unless you add them.",
      "A class can return a generator from `__iter__` to be reusable.",
      "`isinstance(g, collections.abc.Iterator)` is True for generators.",
    ],
    ex: "A tokenizer iterator class that also exposes a `peek()` method for the next token.",
    mistakes: [
      "Writing an iterator class for a simple loop.",
      "Assuming every iterator supports send().",
    ],
    follow: [
      "How can a container class be iterated several times using a generator?",
    ],
    points: [
      "Generators are iterators",
      "Less boilerplate",
      "Class when extra methods are needed",
      "Reusable via __iter__ returning a generator",
    ],
    notes: ["Generator by default."],
    src: [
      ["Python tutorial: Generators", `${D}/tutorial/classes.html`],
      ["Python: collections.abc.Iterator", `${D}/library/collections.abc.html`],
    ],
  }),
  q({
    slug: "lazy-builtins-map-filter-zip",
    topic: "Iterators",
    d: "medium",
    title:
      "Which built-ins return lazy iterators in Python 3, and what does that change?",
    kw: ["map", "filter", "zip", "lazy evaluation", "range object"],
    intent: "Checks Python 3 behaviour compared with older code.",
    short:
      "In Python 3, `map()`, `filter()`, `zip()`, `enumerate()` and `reversed()` return iterators, not lists, and `range()` returns a lazy sequence object, so values are produced on demand and little memory is used. The consequences: printing the result shows an object, not its items; the result can be consumed only once, so `list(map(...))` is needed to reuse it; exceptions in the mapped function appear only when you iterate; and `len()` or indexing fails on map and filter results. A list comprehension or generator expression is often clearer than `map` or `filter` with a lambda.",
    detail: [
      "`range` supports `len`, indexing and `in`, unlike other lazy iterators.",
      "`dict.keys()` returns a view, which is also dynamic.",
      "Laziness lets you combine steps without building intermediate lists.",
    ],
    ex: "`doubled = map(lambda n: n * 2, nums)` does no work until a loop or `list()` uses it.",
    code: [
      [
        "Lazy and single pass",
        "python",
        `nums = [1, 2, 3]\ndoubled = map(lambda n: n * 2, nums)\nprint(list(doubled))   # [2, 4, 6]\nprint(list(doubled))   # [] , already consumed`,
        ["`map` returns an iterator.", "The second pass finds it exhausted."],
      ],
    ],
    mistakes: [
      "Reusing a map or filter object.",
      "Printing a map object expecting its values.",
    ],
    follow: ["Why can len() not be used on a map object?"],
    points: [
      "map, filter, zip return iterators",
      "range is a lazy sequence",
      "Single pass",
      "Comprehensions are often clearer",
    ],
    notes: ["Convert with list() to reuse."],
    src: [
      ["Python: Built-in functions", `${D}/library/functions.html`],
      ["Python: range type", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "itertools-tee-and-reusing-iterators",
    topic: "Iterators",
    d: "hard",
    title:
      "How can you iterate over the same iterator twice, and what does `itertools.tee` do?",
    kw: [
      "itertools.tee",
      "reuse iterator",
      "exhausted iterator",
      "buffering",
      "memory trade-off",
    ],
    intent: "Checks handling of one-shot iterators.",
    short:
      "An iterator can be consumed only once. To use its items twice, either store them (`items = list(it)`), or build a fresh iterator from the original iterable, or use `itertools.tee(it, n)`, which returns n independent iterators over the same input. `tee` buffers items that one iterator has consumed and others have not, so if one copy runs far ahead it stores much data in memory, and the original iterator must not be used after splitting. For a modest amount of data a list is simpler. Prefer designing the code to need only one pass when the data is large.",
    detail: [
      "Generators passed into a function are consumed by the first loop.",
      "`tee` objects are not thread-safe.",
      "Re-creating the generator by calling its function again is often easiest.",
    ],
    ex: "Computing both the minimum and the maximum from a generator without reading the source twice.",
    code: [
      [
        "tee",
        "python",
        `from itertools import tee\n\ngen = (n * n for n in range(5))\na, b = tee(gen)\nprint(sum(a), max(b))   # 30 16`,
        [
          "Both iterators see all five values.",
          "Don't touch `gen` after `tee`.",
        ],
      ],
    ],
    mistakes: [
      "Looping twice over a generator.",
      "Using tee with one copy far ahead of the other.",
    ],
    follow: ["What is the memory cost of tee?"],
    points: [
      "Iterators are single use",
      "list() stores everything",
      "tee gives independent copies",
      "tee buffers unconsumed items",
    ],
    notes: ["Copy the stream or store it."],
    src: [
      ["Python: itertools.tee", `${D}/library/itertools.html`],
      ["Python: Iterator types", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "inspecting-closures-and-free-variables",
    topic: "Closures",
    d: "hard",
    title: "How can you see what a closure has captured?",
    kw: [
      "__closure__",
      "cell_contents",
      "co_freevars",
      "closure cell",
      "introspection",
    ],
    intent: "Checks understanding of how closures are stored.",
    short:
      "A function that closes over variables has a `__closure__` attribute: a tuple of cell objects, one per free variable, and `fn.__code__.co_freevars` lists their names in the same order. Reading `fn.__closure__[0].cell_contents` shows the current value, and it changes if the enclosing variable is rebound with `nonlocal`, because the cell is shared, not copied. A function with no free variables has `__closure__` set to `None`. This is useful for debugging surprising closures, such as the late-binding loop problem, and for understanding why captured objects stay alive as long as the function does.",
    detail: [
      "Two closures from the same call share cells for the same variable.",
      "Cells are an implementation detail; avoid depending on them in application code.",
      "Memory held in cells is released only when the closure is deleted.",
    ],
    ex: "Checking why a callback still holds a large list by inspecting its closure cells.",
    code: [
      [
        "Looking inside",
        "python",
        `def outer():\n    count = 5\n    def inner():\n        return count\n    return inner\n\nf = outer()\nprint(f.__code__.co_freevars)          # ('count',)\nprint(f.__closure__[0].cell_contents)  # 5`,
        ["The name and the value are stored separately."],
      ],
    ],
    mistakes: [
      "Assuming the value is copied into the closure.",
      "Relying on cell internals in production code.",
    ],
    follow: ["What is __closure__ for a function with no free variables?"],
    points: [
      "__closure__ holds cells",
      "co_freevars lists names",
      "Cells are shared, not copied",
      "Captured objects stay alive",
    ],
    notes: ["Names in code, values in cells."],
    src: [
      [
        "Python: Data model (function objects)",
        `${D}/reference/datamodel.html`,
      ],
      [
        "Python: Execution model (naming and binding)",
        `${D}/reference/executionmodel.html`,
      ],
    ],
  }),
])
