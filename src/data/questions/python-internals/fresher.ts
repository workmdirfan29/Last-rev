import { defineQuestions } from "../author"
import { q } from "../compact"

const D = "https://docs.python.org/3"
const PEP = "https://peps.python.org"

export default defineQuestions("python-internals", "fresher", [
  q({
    slug: "objects-identity-type-value",
    topic: "Memory model",
    d: "easy",
    title:
      "How are objects, names and references organised in Python's memory model?",
    kw: ["python objects", "identity", "type", "value", "name binding"],
    intent: "Checks the basic model of Python data.",
    short:
      "Everything in Python is an object, and each object has an identity (which never changes during its life, and which `id()` returns in CPython as the memory address), a type and a value. Variables are names bound to objects, not boxes holding values: `b = a` binds a second name to the same object, and `is` tests whether two names refer to one object. Assignment never copies data; it only rebinds names. Mutable objects can change their value in place, so a change made through one name is visible through every other name that refers to it. When no references remain, the object can be freed.",
    detail: [
      "`type(obj)` gives the type, and an object's type does not change.",
      "Containers hold references to other objects, not copies.",
      "Using `id()` values as stable addresses is meaningless once the object is freed.",
    ],
    ex: "Two names bound to one list: appending through one name changes what the other sees.",
    code: [
      [
        "Names refer to objects",
        "python",
        `a = [1, 2]\nb = a\nprint(a is b, id(a) == id(b))   # True True\nb.append(3)\nprint(a)                         # [1, 2, 3]\nc = list(a)\nprint(a is c, a == c)            # False True`,
        [
          "`b = a` shares the object.",
          "`list(a)` creates a new, equal object.",
        ],
      ],
    ],
    mistakes: [
      "Thinking variables hold values.",
      "Treating id() as a permanent address.",
    ],
    follow: ["What does the is operator compare?"],
    points: [
      "Objects have identity, type, value",
      "Names are bindings",
      "Assignment copies no data",
      "Freed when no references remain",
    ],
    notes: ["Names point at objects."],
    src: [
      [
        "Python: Data model - objects, values and types",
        `${D}/reference/datamodel.html`,
      ],
      ["Python: id()", `${D}/library/functions.html`],
    ],
  }),
  q({
    slug: "reference-counting-basics",
    topic: "Memory model",
    d: "medium",
    title: "How does reference counting work in CPython?",
    kw: [
      "reference counting",
      "refcount",
      "object lifetime",
      "deallocation",
      "cpython memory",
    ],
    intent: "Checks how most memory is reclaimed in CPython.",
    short:
      "In CPython every object keeps a count of how many references point to it. Binding a name, putting the object in a container or passing it as an argument increases the count, and rebinding the name, deleting it, leaving a scope or removing it from a container decreases it. When the count reaches zero the object is deallocated immediately and its memory returned, so most objects are freed promptly and predictably without waiting for a garbage collector. The weakness is reference cycles, where objects refer to each other and their counts never reach zero; the cyclic garbage collector exists to handle those. Reference counting is a CPython implementation detail.",
    detail: [
      "Promptly freed objects are why `with open(...)` is still preferred: other implementations may not close files immediately.",
      "Reference counting adds overhead to every assignment.",
      "Other implementations, such as PyPy, use different garbage collection strategies.",
    ],
    ex: "A temporary list created in a function is freed as soon as the function returns.",
    mistakes: [
      "Relying on immediate destruction for resource cleanup.",
      "Assuming other Python implementations behave the same.",
    ],
    follow: ["Why is a collector still needed?"],
    points: [
      "Each object has a reference count",
      "Zero count means freed immediately",
      "Cycles are not handled by counting",
      "CPython implementation detail",
    ],
    notes: ["Count references, free at zero."],
    src: [
      ["Python: C API - Reference counting", `${D}/c-api/refcounting.html`],
      ["Python: Data model", `${D}/reference/datamodel.html`],
    ],
  }),
  q({
    slug: "sys-getrefcount-and-getsizeof",
    topic: "Memory model",
    d: "medium",
    title:
      "What do `sys.getrefcount()` and `sys.getsizeof()` tell you, and what do they not?",
    kw: [
      "sys.getrefcount",
      "sys.getsizeof",
      "object size",
      "shallow size",
      "memory inspection",
    ],
    intent: "Checks careful use of introspection tools.",
    short:
      "`sys.getrefcount(obj)` returns the object's reference count, which is usually one higher than expected because the call itself holds a temporary reference as the argument. `sys.getsizeof(obj)` returns the size in bytes of the object itself only: the documentation says it accounts only for the memory directly attributed to the object, not for objects it refers to. So a list of a million large strings reports just the list's array of pointers. To estimate the total, walk the references (for example with `pympler` or `tracemalloc`). Treat both numbers as diagnostics, since they depend on the implementation and version.",
    detail: [
      "`getsizeof` includes the garbage collector's overhead for container objects.",
      "Sizes grow in steps for lists, as they over-allocate when they resize.",
      "Use `tracemalloc` to see allocation totals by line.",
    ],
    ex: "`sys.getsizeof([])` is small, but `sys.getsizeof([big_object])` does not include the big object.",
    code: [
      [
        "Shallow sizes",
        "python",
        `import sys\n\nx = []\nprint(sys.getrefcount(x))       # 2: the name x plus the argument\nbig = "a" * 1_000_000\nholder = [big]\nprint(sys.getsizeof(holder))    # small: just the list\nprint(sys.getsizeof(big))       # about a million bytes`,
        [
          "The argument adds one temporary reference.",
          "`getsizeof` is shallow.",
        ],
      ],
    ],
    mistakes: [
      "Reading getsizeof as total memory use.",
      "Expecting an exact refcount of 1.",
    ],
    follow: ["How would you measure the full memory of a data structure?"],
    points: [
      "getrefcount is +1 for the argument",
      "getsizeof is shallow",
      "Totals need traversal or tracemalloc",
      "Implementation-dependent",
    ],
    notes: ["Shallow size, extra reference."],
    src: [
      ["Python: sys.getrefcount", `${D}/library/sys.html`],
      ["Python: sys.getsizeof", `${D}/library/sys.html`],
    ],
  }),
  q({
    slug: "small-int-caching-and-interning",
    topic: "Memory model",
    d: "hard",
    title:
      "What are small-integer caching and string interning, and can you rely on them?",
    kw: [
      "integer caching",
      "string interning",
      "sys.intern",
      "is vs ==",
      "implementation detail",
    ],
    intent: "Checks understanding of optimisations that leak into behaviour.",
    short:
      "CPython keeps preallocated objects for small integers (the C API documentation says -5 to 256), so two names bound to `100` refer to the same object, while larger values created separately may be distinct objects. Strings that look like identifiers are often interned, meaning stored once and shared, and `sys.intern(s)` lets you intern a string explicitly, which can speed up repeated comparisons of the same keys. These are optimisations of the implementation, not language guarantees, and they can differ between versions, between code compiled together or separately, and between interpreters. That is why you compare values with `==` and never use `is` for numbers or strings.",
    detail: [
      "`a is b` can be True for equal small ints but False for large ones, which confuses beginners.",
      "Interning is useful for many repeated identical keys, such as in parsers.",
      "Only `is None`, `is True` and similar singleton checks are reliable uses of `is`.",
    ],
    ex: "`x = 256; y = 256; x is y` is True in CPython, but the result for 1000 depends on how the code was compiled.",
    mistakes: [
      "Using `is` to compare numbers or strings.",
      "Treating caching as a language feature.",
    ],
    follow: ["When is sys.intern useful?"],
    points: [
      "Small ints are shared in CPython",
      "Some strings are interned",
      "sys.intern interns on demand",
      "Never use is for values",
    ],
    notes: ["Optimisation, not a guarantee."],
    src: [
      [
        "Python: C API - Integer objects (small integers)",
        `${D}/c-api/long.html`,
      ],
      ["Python: sys.intern", `${D}/library/sys.html`],
    ],
  }),
  q({
    slug: "weak-references",
    topic: "Memory model",
    d: "medium",
    title: "What is a weak reference, and when would you use one?",
    kw: [
      "weakref",
      "WeakValueDictionary",
      "weak reference",
      "caches",
      "object lifetime",
    ],
    intent:
      "Checks understanding of references that do not keep objects alive.",
    short:
      "A weak reference refers to an object without increasing its reference count, so it does not keep the object alive. `weakref.ref(obj)` returns a callable; calling it gives the object, or `None` once the object has been freed. Weak references are used for caches and registries that should not prevent cleanup: `WeakValueDictionary` drops entries when their values disappear, `WeakSet` and `WeakKeyDictionary` behave similarly, and `weakref.finalize` registers a cleanup callback. Not every object supports weak references: instances of ordinary classes do, but built-ins like `list`, `dict`, `int` and `str` do not unless subclassed, and a class with `__slots__` needs a `__weakref__` slot.",
    detail: [
      "Observers or parent links held weakly avoid reference cycles.",
      "Always check the result of dereferencing for `None`.",
      "Weak references work with the cyclic garbage collector too.",
    ],
    ex: "An image cache that forgets images as soon as no part of the program uses them.",
    code: [
      [
        "weakref.ref",
        "python",
        `import weakref\n\nclass Image: pass\n\nimg = Image()\nr = weakref.ref(img)\nprint(r() is img)   # True\ndel img\nprint(r())          # None (object freed)`,
        ["The weak reference does not keep `img` alive."],
      ],
    ],
    mistakes: [
      "Weak-referencing lists or dicts directly.",
      "Using the dereferenced object without checking for None.",
    ],
    follow: ["How do weak references help avoid cycles?"],
    points: [
      "Does not increase refcount",
      "Returns None when freed",
      "WeakValueDictionary for caches",
      "Not all types support it",
    ],
    notes: ["Reference without ownership."],
    src: [
      ["Python: weakref", `${D}/library/weakref.html`],
      [
        "Python: Data model (__slots__ and __weakref__)",
        `${D}/reference/datamodel.html`,
      ],
    ],
  }),
  q({
    slug: "memoryview-zero-copy",
    topic: "Memory model",
    d: "hard",
    title: "What is `memoryview`, and how does it avoid copying data?",
    kw: [
      "memoryview",
      "buffer protocol",
      "zero copy",
      "bytes slicing",
      "bytearray",
    ],
    intent: "Checks awareness of copy costs.",
    short:
      "Slicing `bytes` or `bytearray` creates a new object and copies the data, which is expensive for big buffers. A `memoryview` wraps any object that supports the buffer protocol and lets you access its memory without copying: slicing a memoryview gives another view over the same bytes. On a writable buffer such as a `bytearray` you can modify the underlying data through the view. This is useful for parsing network protocols, reading into a preallocated buffer with `readinto`, and passing slices of large arrays around. Release views when done, since an exported buffer blocks resizing of the underlying object.",
    detail: [
      "`view.cast('I')` reinterprets the memory as another format.",
      "A `bytes` object is read-only, so its memoryview is read-only.",
      "`tobytes()` copies the visible data into a new bytes object.",
    ],
    ex: "A parser slicing header and payload from a 100 MB buffer without creating copies.",
    code: [
      [
        "Views share memory",
        "python",
        `data = bytearray(b"hello world")\nview = memoryview(data)\nchunk = view[0:5]\nchunk[0] = ord("J")\nprint(data)          # bytearray(b'Jello world')\nprint(bytes(chunk))  # b'Jello'`,
        ["Changing the slice changed the original bytearray."],
      ],
    ],
    mistakes: [
      "Slicing huge bytes objects repeatedly.",
      "Forgetting that a live view locks the buffer size.",
    ],
    follow: ["What does tobytes do?"],
    points: [
      "View over a buffer without copying",
      "Slices share memory",
      "Writable for bytearray",
      "Release when finished",
    ],
    notes: ["Share the memory, skip the copy."],
    src: [
      ["Python: Memory views", `${D}/library/stdtypes.html`],
      ["Python: io.BufferedIOBase.readinto", `${D}/library/io.html`],
    ],
  }),
  q({
    slug: "tracemalloc-find-memory-growth",
    topic: "Memory model",
    d: "medium",
    title:
      "How do you find where a Python program allocates memory or leaks it?",
    kw: [
      "tracemalloc",
      "memory leak",
      "snapshot",
      "compare_to",
      "allocation tracking",
    ],
    intent: "Checks practical memory debugging.",
    short:
      "The standard library's `tracemalloc` tracks memory blocks allocated by Python. Call `tracemalloc.start()`, run the code, then `snapshot = tracemalloc.take_snapshot()` and print `snapshot.statistics('lineno')` to see which source lines allocated the most. To find a leak, take two snapshots at different times and call `second.compare_to(first, 'lineno')` to list what grew. `tracemalloc.get_traced_memory()` returns current and peak sizes. Tracing adds overhead and memory use, so enable it only while investigating. Combine with `gc` inspection to see which objects are still referenced.",
    detail: [
      "Start tracing early, because earlier allocations are not recorded.",
      "Set the number of frames kept for deeper tracebacks.",
      "Native extension memory that bypasses Python's allocators is not shown.",
    ],
    ex: "Comparing snapshots before and after processing 1,000 requests shows a growing dictionary in a caching module.",
    code: [
      [
        "Snapshot comparison",
        "python",
        `import tracemalloc\n\ntracemalloc.start()\nfirst = tracemalloc.take_snapshot()\n\ndata = [str(i) * 10 for i in range(100_000)]\n\nsecond = tracemalloc.take_snapshot()\nfor stat in second.compare_to(first, "lineno")[:1]:\n    print(stat)`,
        ["The report lists the lines whose memory grew most."],
      ],
    ],
    mistakes: [
      "Starting tracemalloc too late.",
      "Leaving it on in production.",
    ],
    follow: ["What does compare_to show?"],
    points: [
      "start, take_snapshot",
      "statistics by line",
      "compare_to finds growth",
      "Overhead, use temporarily",
    ],
    notes: ["Snapshot, run, compare."],
    src: [
      ["Python: tracemalloc", `${D}/library/tracemalloc.html`],
      ["Python: gc", `${D}/library/gc.html`],
    ],
  }),
  q({
    slug: "common-python-memory-leaks",
    topic: "Memory model",
    d: "medium",
    title:
      "How can a Python program 'leak' memory even though it has garbage collection?",
    kw: [
      "memory leak",
      "unbounded cache",
      "global references",
      "reference cycles",
      "lingering references",
    ],
    intent: "Checks practical understanding of why memory stays allocated.",
    short:
      "Python frees objects that are no longer reachable, so a 'leak' is usually an object that is still reachable and forgotten. Typical causes: unbounded caches or lists in module globals or class attributes that only grow, memoisation without a size limit, registries and event handlers that are never removed, long-lived references from closures, exceptions and tracebacks that keep frames alive, objects in cycles waiting for the collector, and C extensions that fail to release native memory. Find the growth with `tracemalloc`, check what refers to suspect objects with `gc.get_referrers`, and fix by bounding caches (`lru_cache(maxsize=...)`), removing listeners and using weak references.",
    detail: [
      "Large allocations may not be returned to the operating system immediately even after being freed in Python.",
      "Per-request data stored in global dicts is a classic web-app leak.",
      "Monitor memory over time rather than guessing.",
    ],
    ex: "A service that stores every request's payload in a module-level list until it runs out of memory.",
    mistakes: ["Unbounded caches.", "Forgetting to unregister callbacks."],
    follow: ["How would you find what still refers to an object?"],
    points: [
      "Still reachable but unwanted",
      "Unbounded caches and registries",
      "Cycles and tracebacks hold memory",
      "Use tracemalloc and weak references",
    ],
    notes: ["Leaks are forgotten references."],
    src: [
      ["Python: tracemalloc", `${D}/library/tracemalloc.html`],
      ["Python: gc.get_referrers", `${D}/library/gc.html`],
    ],
  }),
  q({
    slug: "python-memory-manager-private-heap",
    topic: "Memory model",
    d: "hard",
    title:
      "How does Python manage memory internally (private heap and small-object allocation)?",
    kw: [
      "python memory manager",
      "private heap",
      "pymalloc",
      "small objects",
      "arena",
    ],
    intent: "Checks awareness of the allocator layer.",
    short:
      "Python objects live in a private heap managed by the Python memory manager, not directly by the system `malloc`. The manager has different layers: raw allocators that get memory from the operating system, and object-specific allocators. For small objects (the documentation says 512 bytes or less) CPython uses `pymalloc`, which carves memory from larger blocks to make many small allocations fast and reduce fragmentation. Freed small-object memory is often reused by the interpreter rather than returned to the operating system, so a process's memory footprint may not shrink even after objects are freed. The details are an implementation matter and may change.",
    detail: [
      "Environment settings like `PYTHONMALLOC` can switch allocators for debugging.",
      "Memory fragmentation explains why resident size can stay high.",
      "Application developers rarely touch this layer, but it explains observed behaviour.",
    ],
    ex: "A process creates millions of small objects, frees them, and still shows a high resident memory size.",
    mistakes: [
      "Expecting freed objects to reduce process memory at once.",
      "Assuming allocator details are stable across versions.",
    ],
    follow: ["Why might process memory stay high after objects are freed?"],
    points: [
      "Private heap for all objects",
      "pymalloc for small objects",
      "Memory is often reused, not returned",
      "Implementation detail",
    ],
    notes: ["Freed to Python's heap, not always to the OS."],
    src: [
      ["Python: C API - Memory management", `${D}/c-api/memory.html`],
      [
        "Python: Environment variables (PYTHONMALLOC)",
        `${D}/using/cmdline.html`,
      ],
    ],
  }),
  q({
    slug: "cyclic-garbage-collector",
    topic: "Garbage collection",
    d: "medium",
    title: "What does Python's cyclic garbage collector do?",
    kw: [
      "garbage collector",
      "reference cycle",
      "gc module",
      "unreachable objects",
      "gc.collect",
    ],
    intent: "A core question on Python memory management.",
    short:
      "Reference counting cannot free objects that refer to each other in a cycle, such as a parent that holds its child while the child holds the parent: their counts never reach zero even when nothing else can reach them. CPython's cyclic garbage collector periodically scans container objects (lists, dicts, class instances and so on) for groups that are reachable only from each other and frees them. It runs automatically based on allocation counts, and you can control it through the `gc` module: `gc.collect()` forces a run, `gc.disable()` and `gc.enable()` toggle it, and `gc.get_threshold()` shows the trigger settings. It supplements reference counting rather than replacing it.",
    detail: [
      "Objects without container references, like ints and strings, never form cycles.",
      "If you are sure a program creates no cycles, the collector can be disabled for speed, but this is risky.",
      "The collector's details differ between Python versions.",
    ],
    ex: "Two nodes referencing each other are freed by `gc.collect()` after the names are deleted.",
    code: [
      [
        "Cycle collected",
        "python",
        `import gc\n\nclass Node:\n    def __init__(self):\n        self.other = None\n\na, b = Node(), Node()\na.other, b.other = b, a\ndel a, b\nprint(gc.collect() > 0)   # True: the cycle was found and freed`,
        ["Counts never reached zero because of the cycle."],
      ],
    ],
    mistakes: [
      "Disabling gc without understanding the consequences.",
      "Assuming reference counting alone handles everything.",
    ],
    follow: ["Which objects can take part in cycles?"],
    points: [
      "Finds unreachable cycles",
      "Supplements reference counting",
      "Controlled via the gc module",
      "Runs automatically by allocation counts",
    ],
    notes: ["Cycles need the collector."],
    src: [
      ["Python: gc", `${D}/library/gc.html`],
      ["Python: C API - Reference counting", `${D}/c-api/refcounting.html`],
    ],
  }),
  q({
    slug: "gc-generations-and-tuning",
    topic: "Garbage collection",
    d: "hard",
    title:
      "What are GC generations and thresholds, and when would you tune the collector?",
    kw: [
      "gc generations",
      "gc.get_threshold",
      "gc.set_threshold",
      "gc.get_stats",
      "young objects",
    ],
    intent: "Checks awareness of GC tuning without overclaiming.",
    short:
      "The cyclic collector is generational: most objects die young, so recently created objects are examined often and objects that have survived are examined less often, which reduces the cost of collection. The `gc` module exposes the settings: `gc.get_threshold()` returns the trigger values, `gc.set_threshold()` changes them, and `gc.get_stats()` and `gc.get_count()` report activity. The default values and exact scheme have changed between Python versions, so read the documentation for your version and measure rather than memorising numbers. Tuning is for special cases, such as batch jobs that allocate huge numbers of long-lived container objects where frequent collections waste time.",
    detail: [
      "A common technique is to disable the collector during a big load and run `gc.collect()` afterwards.",
      "Profile before tuning: most programs never need it.",
      "`gc.set_debug(gc.DEBUG_STATS)` prints collection details.",
    ],
    ex: "Raising the threshold when loading a million objects at startup so the loader is not interrupted by collections.",
    mistakes: [
      "Tuning without measuring.",
      "Relying on specific default threshold numbers.",
    ],
    follow: ["Why is a generational design efficient?"],
    points: [
      "Young objects scanned more often",
      "get_threshold and set_threshold",
      "Details vary by version",
      "Tune only with measurements",
    ],
    notes: ["Measure before tuning."],
    src: [
      [
        "Python: gc (get_threshold, set_threshold, get_stats)",
        `${D}/library/gc.html`,
      ],
      ["PEP 442: Safe object finalization", `${PEP}/pep-0442/`],
    ],
  }),
  q({
    slug: "del-method-and-reference-cycles",
    topic: "Garbage collection",
    d: "hard",
    title:
      "What are the risks of `__del__`, and how do cycles with finalizers behave?",
    kw: ["__del__", "finalizer", "pep 442", "gc.garbage", "resource cleanup"],
    intent: "Checks knowledge of finalisation pitfalls.",
    short:
      "`__del__` is a finalizer called when an object is about to be destroyed, but when it runs is up to the implementation. It may be delayed or, for objects still alive at interpreter exit, never called, and exceptions raised inside it are printed and ignored. Before Python 3.4, objects with `__del__` in a reference cycle could not be collected and ended up in `gc.garbage`; PEP 442 made such cycles collectable. Because of this uncertainty, do not use `__del__` for essential cleanup such as flushing data or closing connections. Use context managers (`with`), explicit `close()` methods or `weakref.finalize` instead.",
    detail: [
      "A finalizer can resurrect the object by storing a reference to `self`; avoid it.",
      "Order of destruction at shutdown is not guaranteed.",
      "`weakref.finalize` runs a callback when an object is collected, and also at exit.",
    ],
    ex: "A database wrapper that commits in `__del__` can lose data when the interpreter exits unexpectedly.",
    mistakes: [
      "Relying on __del__ to release resources.",
      "Raising exceptions in __del__.",
    ],
    follow: ["What replaces __del__ for cleanup?"],
    points: [
      "Timing is not guaranteed",
      "Exceptions are ignored",
      "PEP 442 allows collecting cycles with finalizers",
      "Use with, close or weakref.finalize",
    ],
    notes: ["Don't count on __del__."],
    src: [
      ["Python: Data model (object.__del__)", `${D}/reference/datamodel.html`],
      ["PEP 442: Safe object finalization", `${PEP}/pep-0442/`],
    ],
  }),
  q({
    slug: "gc-collect-disable-freeze",
    topic: "Garbage collection",
    d: "medium",
    title:
      "What do `gc.collect()`, `gc.disable()` and `gc.freeze()` do, and when are they useful?",
    kw: [
      "gc.collect",
      "gc.disable",
      "gc.freeze",
      "copy on write",
      "forked workers",
    ],
    intent: "Checks practical use of the gc module.",
    short:
      "`gc.collect()` runs a full collection immediately and returns the number of unreachable objects it found, which is handy in tests, after releasing a large structure, or before taking a memory snapshot. `gc.disable()` stops automatic cyclic collection; it can speed up allocation-heavy start-up phases, or short-lived programs, but any cycles created are not freed until you re-enable or call `collect`. `gc.freeze()` moves all current objects into a permanent generation that is ignored by later collections; it is designed for pre-fork servers, so worker processes do not touch the shared objects' memory and copy-on-write sharing is preserved. Reference counting continues regardless of these settings.",
    detail: [
      "Disabling gc does not disable reference counting.",
      "`gc.get_objects()` and `gc.get_referrers()` help investigate leaks.",
      "Measure memory and speed before and after changing gc behaviour.",
    ],
    ex: "A pre-forking web server calls `gc.freeze()` after loading the application and before forking workers.",
    mistakes: [
      "Disabling gc in a long-running service that creates cycles.",
      "Assuming collect() frees everything.",
    ],
    follow: ["Why is freeze useful before forking?"],
    points: [
      "collect forces a run",
      "disable stops automatic runs",
      "freeze ignores existing objects",
      "Reference counting still works",
    ],
    notes: ["Tools for special cases."],
    src: [
      ["Python: gc.freeze and gc.collect", `${D}/library/gc.html`],
      ["Python: os.fork", `${D}/library/os.html`],
    ],
  }),
  q({
    slug: "del-statement-versus-deleting-objects",
    topic: "Garbage collection",
    d: "easy",
    title: "What does the `del` statement actually delete?",
    kw: [
      "del statement",
      "name binding",
      "reference count",
      "deleting list items",
      "free memory",
    ],
    intent: "Checks a common misconception.",
    short:
      "`del x` removes the name `x` from the namespace; it does not directly destroy the object. The object is freed only if that was its last reference, which reduces its reference count to zero. If another name or container still refers to it, it lives on. `del lst[i]`, `del lst[a:b]` and `del d[key]` remove items from containers by dropping the container's references. So `del` is about removing bindings, not about commanding memory release. Deleting a large object that is still referenced elsewhere frees nothing, and using a deleted name afterwards raises `NameError`.",
    detail: [
      "Rebinding a name, for example `x = None`, drops the old reference in the same way.",
      "Object destruction timing follows reference counting in CPython.",
      "Prefer scoping and function boundaries to manual `del`.",
    ],
    ex: "`b = a; del a` leaves the list alive because `b` still refers to it.",
    code: [
      [
        "del removes the name",
        "python",
        `a = [1, 2, 3]\nb = a\ndel a\nprint(b)       # [1, 2, 3] still alive\ntry:\n    print(a)\nexcept NameError:\n    print("a is gone")`,
        ["Only the name was deleted."],
      ],
    ],
    mistakes: [
      "Thinking del frees memory immediately.",
      "Using del instead of clear() to empty a list shared elsewhere (both affect sharing differently).",
    ],
    follow: ["When is the object actually freed?"],
    points: [
      "Removes a binding",
      "Object freed at zero references",
      "Works on items and slices",
      "NameError afterwards",
    ],
    notes: ["Unbind, not destroy."],
    src: [
      ["Python: Simple statements (del)", `${D}/reference/simple_stmts.html`],
      ["Python: Data model", `${D}/reference/datamodel.html`],
    ],
  }),
  q({
    slug: "cleanup-with-context-managers-not-refcounts",
    topic: "Garbage collection",
    d: "medium",
    title:
      "Why should you use `with` instead of relying on garbage collection to close resources?",
    kw: [
      "resource management",
      "context manager",
      "refcount timing",
      "resourcewarning",
      "unclosed file",
    ],
    intent: "Checks reasoning about deterministic cleanup.",
    short:
      "In CPython, a file opened without `with` is usually closed when its last reference disappears, but that is an implementation detail: other implementations (PyPy, for example) may delay finalisation, and a reference held in an exception traceback, a cycle or a long-lived variable keeps the file open longer than expected. Unclosed files can hold locks, lose buffered writes or exhaust file descriptors. The `with` statement closes the resource at a well-defined point, even when exceptions occur. Python warns about unclosed files with `ResourceWarning`, which is hidden by default but shown in development mode (`-X dev`) and tests.",
    detail: [
      "The same applies to sockets, database connections and locks.",
      "`contextlib.closing` adapts objects that have only `close()`.",
      "Run tests with warnings enabled to catch leaks early.",
    ],
    ex: "A script that opens thousands of files in a loop without closing them hits the descriptor limit under another interpreter.",
    mistakes: [
      "Opening files and leaving them to the collector.",
      "Ignoring ResourceWarning messages.",
    ],
    follow: ["How can you see ResourceWarnings?"],
    points: [
      "Refcount cleanup is an implementation detail",
      "with gives deterministic closing",
      "Unclosed resources cause leaks",
      "ResourceWarning flags them",
    ],
    notes: ["Close explicitly, with with."],
    src: [
      [
        "Python: Warning categories (ResourceWarning)",
        `${D}/library/warnings.html`,
      ],
      ["Python: contextlib.closing", `${D}/library/contextlib.html`],
    ],
  }),
  q({
    slug: "bytecode-and-pyc-files",
    topic: "Bytecode",
    d: "easy",
    title: "What is Python bytecode, and what are `.pyc` files?",
    kw: [
      "bytecode",
      "pyc files",
      "__pycache__",
      "cpython virtual machine",
      "compilation",
    ],
    intent: "Checks how Python code actually runs.",
    short:
      "Python is not run directly from source. CPython first compiles source code into bytecode, a compact set of instructions for its virtual machine, and then the interpreter loop executes those instructions. For imported modules, the compiled bytecode is cached in `.pyc` files inside a `__pycache__` directory (named with the interpreter version, like `module.cpython-312.pyc`) so that later imports skip recompilation. The cache is checked against the source file's modification time, and is recompiled when stale. Running a script directly does not cache its own bytecode. Bytecode is an implementation detail of CPython and can change between versions.",
    detail: [
      "`.pyc` files are not machine code and need the Python interpreter.",
      "They load faster, but do not make the program itself run faster.",
      "Deleting `__pycache__` is safe; it will be regenerated.",
    ],
    ex: "A project folder gains `__pycache__/utils.cpython-312.pyc` after `utils` is imported.",
    mistakes: [
      "Calling .pyc files an executable format.",
      "Committing __pycache__ to version control.",
    ],
    follow: ["Does a .pyc make the program run faster?"],
    points: [
      "Source compiled to bytecode",
      "VM executes the bytecode",
      "Imported modules cached in __pycache__",
      "Version-specific and stale-checked",
    ],
    notes: ["Compile once, run on the VM."],
    src: [
      ["Python tutorial: Compiled Python files", `${D}/tutorial/modules.html`],
      ["Python: dis - bytecode disassembler", `${D}/library/dis.html`],
    ],
  }),
  q({
    slug: "dis-module-reading-bytecode",
    topic: "Bytecode",
    d: "medium",
    title:
      "How do you inspect bytecode with the `dis` module, and what can it teach you?",
    kw: [
      "dis module",
      "disassemble",
      "bytecode instructions",
      "LOAD_FAST",
      "performance insight",
    ],
    intent: "Checks the ability to look under the hood.",
    short:
      "`dis.dis(function)` prints the bytecode instructions the interpreter will run, such as loading variables, calling functions and returning values. It is a window into what a line of Python really does: you can compare two ways of writing something, see how many operations an expression takes, or confirm why a local variable lookup is faster than a global one. CPython is a stack-based virtual machine, so most instructions push or pop values on an evaluation stack. The documentation warns that bytecode is an implementation detail with no guarantees across versions, so use `dis` for learning and debugging, not as a stable interface.",
    detail: [
      "`dis.dis('a + b')` accepts source strings too.",
      "Opcode names differ between Python versions.",
      "Most performance questions are better answered with `timeit` or a profiler than by reading bytecode.",
    ],
    ex: "Disassembling a function to see that a global name is loaded with a different instruction than a local one.",
    code: [
      [
        "dis.dis",
        "python",
        `import dis\n\ndef add(a, b):\n    return a + b\n\ndis.dis(add)\n# shows loads of a and b, a binary add, then a return`,
        ["Each line of the output is one bytecode instruction."],
      ],
    ],
    mistakes: [
      "Depending on specific opcodes in application code.",
      "Optimising by bytecode length without measuring.",
    ],
    follow: ["Why is bytecode described as stack-based?"],
    points: [
      "dis.dis shows instructions",
      "Stack-based VM",
      "Version-specific implementation detail",
      "Learn, then measure",
    ],
    notes: ["Peek at what Python runs."],
    src: [
      ["Python: dis", `${D}/library/dis.html`],
      ["Python: compile()", `${D}/library/functions.html`],
    ],
  }),
  q({
    slug: "source-to-execution-pipeline",
    topic: "Bytecode",
    d: "medium",
    title:
      "What steps does CPython take from source code to running a program?",
    kw: [
      "compilation pipeline",
      "tokenizer",
      "ast",
      "code object",
      "interpreter loop",
    ],
    intent: "Checks understanding of the execution pipeline.",
    short:
      "CPython reads the source and tokenises it, parses it into an abstract syntax tree (AST), compiles the tree into a code object containing bytecode, constants and names, and then the interpreter's evaluation loop executes that bytecode. You can observe the stages from Python: `ast.parse(source)` returns the tree, `compile(source, filename, mode)` returns a code object (`co_code`, `co_consts`, `co_names`), `dis.dis` shows its instructions, and `exec` or `eval` runs it. Syntax errors are found at the parsing stage, before any code runs, while names and types are checked only at run time, which is why Python is called dynamically typed.",
    detail: [
      "A function's code object is available as `func.__code__`.",
      "Compilation happens once per module import (or per `exec` of source).",
      "The AST module is the basis for linters and code-analysis tools.",
    ],
    ex: "A `SyntaxError` appears as soon as a module is imported, even if the faulty line would not have run.",
    mistakes: [
      "Expecting type errors at compile time.",
      "Confusing compiling with static type checking.",
    ],
    follow: ["When is a SyntaxError raised?"],
    points: [
      "Tokenise, parse to AST",
      "Compile to a code object",
      "Evaluation loop runs bytecode",
      "Syntax checked early, types at run time",
    ],
    notes: ["Source, AST, bytecode, run."],
    src: [
      ["Python: ast", `${D}/library/ast.html`],
      ["Python: dis (code objects)", `${D}/library/dis.html`],
    ],
  }),
  q({
    slug: "pyc-invalidation-and-b-flag",
    topic: "Bytecode",
    d: "medium",
    title: "How does Python decide whether a cached `.pyc` is still valid?",
    kw: [
      "pyc invalidation",
      "timestamp",
      "hash-based pyc",
      "PYTHONDONTWRITEBYTECODE",
      "compileall",
    ],
    intent: "Checks understanding of import-time caching.",
    short:
      "By default a `.pyc` records the source file's modification time and size, and on import Python compares them with the current source; if they differ, it recompiles and rewrites the cache. PEP 552 added hash-based `.pyc` files that store a hash of the source instead, which makes builds reproducible and is used by deployment tools; they can be checked on every import or trusted without checking. The environment variable `PYTHONDONTWRITEBYTECODE` or the `-B` option stops Python writing `.pyc` files, which is useful in read-only or containerised environments. `python -m compileall` precompiles a tree ahead of time.",
    detail: [
      "A `.pyc` for the wrong Python version is ignored, because the file name includes the version tag.",
      "Importing from a read-only directory still works; caching just does not happen.",
      "Precompiling can speed up the first start of a container.",
    ],
    ex: "A Docker image runs `python -m compileall` during the build so the first request is not slowed by compilation.",
    mistakes: [
      "Assuming .pyc is portable across Python versions.",
      "Committing generated caches to the repository.",
    ],
    follow: ["Why add hash-based pyc files?"],
    points: [
      "Timestamp and size check by default",
      "Hash-based option (PEP 552)",
      "-B stops writing bytecode",
      "compileall precompiles",
    ],
    notes: ["Stale cache is rebuilt."],
    src: [
      ["Python: compileall", `${D}/library/compileall.html`],
      ["PEP 552: Deterministic pycs", `${PEP}/pep-0552/`],
    ],
  }),
  q({
    slug: "python-implementations-cpython-pypy",
    topic: "Bytecode",
    d: "easy",
    title:
      "What is CPython, and how does it differ from other Python implementations?",
    kw: [
      "cpython",
      "pypy",
      "python implementations",
      "jit",
      "reference implementation",
    ],
    intent:
      "Checks awareness that Python is a language with several implementations.",
    short:
      "Python is a language specification; CPython, written in C, is the reference implementation that most people use when they run `python`. It compiles to bytecode and interprets it, with reference counting plus a cyclic collector and, in the standard build, a GIL. Other implementations exist: PyPy, written in Python and featuring a just-in-time compiler that can make long-running pure-Python code much faster, plus implementations targeting other platforms such as the JVM or .NET. They follow the language but differ in details such as garbage collection timing, C-extension compatibility and performance characteristics, so behaviour that depends on CPython internals is not portable.",
    detail: [
      "Library compatibility, especially for C extensions, varies by implementation.",
      "Features like immediate object destruction at refcount zero are CPython-specific.",
      "For most application work, CPython is the default choice.",
    ],
    ex: "A CPU-bound pure-Python script running faster under PyPy's JIT, while a NumPy-heavy script is best left on CPython.",
    mistakes: [
      "Assuming CPython details are language guarantees.",
      "Ignoring extension compatibility when switching implementations.",
    ],
    follow: ["What does a JIT compiler add?"],
    points: [
      "Python is a language, CPython is an implementation",
      "Bytecode interpreter in C",
      "PyPy has a JIT",
      "Details are not portable",
    ],
    notes: ["Language versus implementation."],
    src: [
      [
        "Python: Language reference - Alternate implementations",
        `${D}/reference/introduction.html`,
      ],
      ["Python: Language reference", `${D}/reference/index.html`],
    ],
  }),
  q({
    slug: "eval-exec-compile-risks",
    topic: "Bytecode",
    d: "medium",
    title:
      "What do `eval`, `exec` and `compile` do, and why are they dangerous with untrusted input?",
    kw: ["eval", "exec", "compile", "ast.literal_eval", "code injection"],
    intent: "Checks security awareness around dynamic code execution.",
    short:
      "`compile(source, filename, mode)` turns source text into a code object. `eval(expression)` evaluates one expression and returns its value; `exec(code)` runs statements. Both execute arbitrary Python, so passing them text from users, files or the network allows code injection: for example, a string that imports `os` and deletes files. Restricting `globals` and `builtins` does not make that safe. For parsing data, use the right parser instead: `json.loads` for JSON and `ast.literal_eval` for Python literals such as numbers, strings, lists and dicts. `literal_eval` only evaluates literals, but the documentation warns that a sufficiently large or complex string can still crash the interpreter, so limit input size.",
    detail: [
      "Avoid `eval` for calculators; use a proper expression parser.",
      "Dynamic execution makes code harder to analyse and debug.",
      "Template engines and plugins should use defined APIs, not `exec`.",
    ],
    ex: "A web app that used `eval` on a query parameter let an attacker execute commands on the server.",
    mistakes: [
      "Calling eval on user input.",
      "Thinking an empty globals dict makes eval safe.",
    ],
    follow: ["What is the safe alternative for parsing Python literals?"],
    points: [
      "Execute arbitrary code",
      "Never use with untrusted input",
      "ast.literal_eval for literals",
      "json.loads for JSON",
    ],
    notes: ["eval is code execution."],
    src: [
      ["Python: eval()", `${D}/library/functions.html`],
      ["Python: ast.literal_eval", `${D}/library/ast.html`],
    ],
  }),
  q({
    slug: "profiling-with-cprofile",
    topic: "Profiling",
    d: "medium",
    title: "How do you find slow parts of a Python program with `cProfile`?",
    kw: [
      "cProfile",
      "pstats",
      "tottime cumtime",
      "deterministic profiling",
      "performance bottleneck",
    ],
    intent: "Checks a practical performance workflow.",
    short:
      "Measure before optimising. `python -m cProfile -s cumulative script.py` runs a program under the deterministic profiler and prints, for each function, the number of calls, `tottime` (time in the function itself, excluding sub-calls) and `cumtime` (time including everything it called). Save results with `-o out.prof` and explore them with `pstats.Stats('out.prof').sort_stats('cumulative').print_stats(20)`. Sorting by `cumtime` finds the expensive call chains, and by `tottime` finds the functions doing the work themselves. The documentation recommends `cProfile` over the pure-Python `profile` module because of its lower overhead; profiling still slows the program.",
    detail: [
      "Profile realistic workloads, not toy inputs.",
      "Optimise the biggest cost first, then re-measure.",
      "Visualisation tools such as snakeviz read the same `.prof` files.",
    ],
    ex: "A report generator spends 80% of its time in a function that re-parses the same date format for each row.",
    code: [
      [
        "Profile a function",
        "python",
        `import cProfile, pstats\n\ndef work():\n    return sum(i * i for i in range(500_000))\n\nprofiler = cProfile.Profile()\nprofiler.enable()\nwork()\nprofiler.disable()\npstats.Stats(profiler).sort_stats("cumulative").print_stats(5)`,
        ["`cumulative` sorts by time including sub-calls."],
      ],
    ],
    mistakes: [
      "Optimising without profiling.",
      "Profiling tiny unrepresentative inputs.",
    ],
    follow: ["What is the difference between tottime and cumtime?"],
    points: [
      "Measure first",
      "tottime vs cumtime",
      "-o and pstats for analysis",
      "cProfile has lower overhead",
    ],
    notes: ["Find the hot spot, then fix it."],
    src: [
      ["Python: The Python profilers", `${D}/library/profile.html`],
      ["Python: timeit", `${D}/library/timeit.html`],
    ],
  }),
  q({
    slug: "timeit-microbenchmarks",
    topic: "Profiling",
    d: "easy",
    title: "How do you compare the speed of two code snippets reliably?",
    kw: ["timeit", "microbenchmark", "repeat", "min time", "benchmarking"],
    intent: "Checks sound benchmarking basics.",
    short:
      'Use the `timeit` module, which runs a snippet many times with a high-resolution timer and disables garbage collection during timing to reduce noise. From the command line, `python -m timeit -s "setup" "statement"` picks a sensible number of loops. In code, `timeit.repeat(stmt, number=n, repeat=5)` returns several measurements; the documentation advises taking the minimum, since higher values come from other processes interfering rather than from your code. Keep setup out of the timed statement and use realistic data sizes; micro-benchmarks only compare tiny snippets, so confirm with a profiler.',
    detail: [
      "Pass `globals=globals()` to time code that uses your names.",
      "Beware of caching effects and constant folding in tiny examples.",
      "Do not time with `time.time()` in loops by hand when `timeit` exists.",
    ],
    ex: "Comparing a list comprehension with a `for` loop that appends, over 100,000 items.",
    code: [
      [
        "Comparing two approaches",
        "python",
        `import timeit\n\nloop = """\nout = []\nfor i in range(1000):\n    out.append(i * 2)\n"""\ncomp = "[i * 2 for i in range(1000)]"\n\nprint(min(timeit.repeat(loop, number=2000, repeat=5)))\nprint(min(timeit.repeat(comp, number=2000, repeat=5)))`,
        ["Take the minimum of several repeats."],
      ],
    ],
    mistakes: ["Timing once.", "Including setup cost in the measurement."],
    follow: ["Why use the minimum of repeated timings?"],
    points: [
      "timeit runs many loops",
      "GC disabled while timing",
      "Use min of repeats",
      "Confirm with a profiler",
    ],
    notes: ["Measure, don't guess."],
    src: [
      ["Python: timeit", `${D}/library/timeit.html`],
      ["Python tutorial: Performance measurement", `${D}/tutorial/stdlib.html`],
    ],
  }),
  q({
    slug: "deterministic-versus-sampling-profilers",
    topic: "Profiling",
    d: "medium",
    title:
      "What is the difference between deterministic and sampling profilers?",
    kw: [
      "deterministic profiling",
      "statistical profiling",
      "sampling profiler",
      "profiler overhead",
      "production profiling",
    ],
    intent: "Checks understanding of tool trade-offs.",
    short:
      "A deterministic profiler such as `cProfile` hooks every function call and return, recording exact call counts and timings. It gives complete data about calls but adds overhead that distorts short functions and slows the program noticeably. A sampling (statistical) profiler instead looks at the running program's stack many times per second and counts where it is; it has low overhead, so it can be used on production-like workloads, and shows where time is spent but gives only approximate figures and no exact call counts. Third-party tools such as `py-spy` provide sampling. Choose by whether you need exact call counts or minimal overhead.",
    detail: [
      "Newer Python versions also support integration with Linux `perf`.",
      "Line-level profilers add detail inside one function at higher cost.",
      "Always profile with realistic data and settings.",
    ],
    ex: "Using `cProfile` locally to find a slow call chain and a sampling profiler to look at a live slow process.",
    mistakes: [
      "Trusting exact numbers from a heavily instrumented run.",
      "Profiling with unrealistic input.",
    ],
    follow: ["Why does cProfile add overhead?"],
    points: [
      "Deterministic: every call recorded",
      "Sampling: periodic stack snapshots",
      "Sampling has low overhead",
      "Pick by need",
    ],
    notes: ["Exact versus cheap."],
    src: [
      [
        "Python: The Python profilers (deterministic profiling)",
        `${D}/library/profile.html`,
      ],
      [
        "Python: Python support for the Linux perf profiler",
        `${D}/howto/perf_profiling.html`,
      ],
    ],
  }),
  q({
    slug: "python-performance-tips-measured",
    topic: "Profiling",
    d: "medium",
    title: "What are sensible ways to make slow Python code faster?",
    kw: [
      "python performance",
      "algorithmic complexity",
      "built-in functions",
      "local variables",
      "numpy vectorization",
    ],
    intent: "Checks a measured, priority-ordered approach.",
    short:
      "Measure first with a profiler, then work from the biggest wins down. Choose better algorithms and data structures (a `set` for membership instead of scanning a list). Do less work: cache repeated results with `functools.cache`, avoid recomputing inside loops and process data lazily. Use built-ins and standard library functions such as `sum`, `sorted`, `str.join` and `collections`, which run in C. Push heavy numeric work to vectorised libraries like NumPy, move hotspots into compiled code (Cython, C extensions, Rust bindings) or use processes for parallel CPU-bound work. Micro-optimisations such as caching attribute lookups in locals usually matter least.",
    detail: [
      "Readable code that is fast enough beats cryptic code that is slightly faster.",
      "I/O, network and database access are often the real bottlenecks.",
      "Re-measure after each change to confirm it helped.",
    ],
    ex: "Replacing a nested loop that checked membership in a list with a set turned a 40-second job into under a second.",
    mistakes: [
      "Optimising before profiling.",
      "Micro-optimising code that is not the bottleneck.",
    ],
    follow: ["Which change usually gives the largest improvement?"],
    points: [
      "Profile first",
      "Better algorithm beats tuning",
      "Use built-ins and libraries in C",
      "Parallelise CPU-bound work with processes",
    ],
    notes: ["Measure, then change the big thing."],
    src: [
      [
        "Python: Data structures (sets and dicts)",
        `${D}/tutorial/datastructures.html`,
      ],
      ["Python: functools.cache", `${D}/library/functools.html`],
    ],
  }),
  q({
    slug: "recursion-limit-and-recursionerror",
    topic: "Profiling",
    d: "medium",
    title:
      "Why does Python raise `RecursionError`, and how should you handle deep recursion?",
    kw: [
      "recursion limit",
      "RecursionError",
      "sys.setrecursionlimit",
      "iterative conversion",
      "call stack",
    ],
    intent: "Checks understanding of limits in the interpreter.",
    short:
      "Each function call uses a frame on the call stack, and Python limits the recursion depth to protect against stack overflow; the default limit is about 1000, shown by `sys.getrecursionlimit()`. Exceeding it raises `RecursionError`. Python does not optimise tail calls, so even simple recursive loops hit the limit. Prefer an iterative solution with a loop or an explicit stack for deep problems, or add memoisation to cut the depth for dynamic programming. You can raise the limit with `sys.setrecursionlimit()`, but the documentation warns that too high a value can crash the interpreter, so use that sparingly and test.",
    detail: [
      "Infinite recursion from a missing base case is the usual cause.",
      "Recursive tree and graph algorithms on deep structures should be iterative.",
      "Threads have their own stack size limits too.",
    ],
    ex: "A recursive depth-first search over a long linked structure fails at about 1000 nodes.",
    code: [
      [
        "Recursion limit",
        "python",
        `import sys\n\ndef depth(n):\n    return depth(n + 1)\n\nprint(sys.getrecursionlimit())   # commonly 1000\ntry:\n    depth(0)\nexcept RecursionError as e:\n    print("RecursionError:", e)`,
        ["The call stack is limited, not unbounded."],
      ],
    ],
    mistakes: [
      "Raising the limit instead of fixing the algorithm.",
      "Forgetting the base case.",
    ],
    follow: ["How would you convert a recursive function to an iterative one?"],
    points: [
      "Depth limited (about 1000 by default)",
      "RecursionError on overflow",
      "No tail-call optimisation",
      "Iterate or memoise instead",
    ],
    notes: ["Loop when it gets deep."],
    src: [
      ["Python: sys.setrecursionlimit", `${D}/library/sys.html`],
      ["Python: RecursionError", `${D}/library/exceptions.html`],
    ],
  }),
  q({
    slug: "debugging-with-pdb-and-breakpoint",
    topic: "Profiling",
    d: "easy",
    title: "How do you debug Python code with `breakpoint()` and `pdb`?",
    kw: [
      "pdb",
      "breakpoint",
      "debugger commands",
      "post mortem",
      "step through code",
    ],
    intent: "Checks use of the built-in debugger.",
    short:
      "Insert `breakpoint()` where you want to stop; it calls `sys.breakpointhook()`, which by default opens the `pdb` debugger at that line (setting the environment variable `PYTHONBREAKPOINT=0` disables all such calls). At the `(Pdb)` prompt: `n` runs the next line, `s` steps into a call, `c` continues, `l` lists source, `p expr` prints a value, `bt` shows the stack, `b` sets breakpoints and `q` quits. You can also start a script under the debugger with `python -m pdb script.py`, or inspect a crash afterwards with post-mortem debugging (`pdb.pm()`). Remove breakpoints before committing code.",
    detail: [
      "IDEs provide the same functionality with a graphical interface.",
      "Logging is often better for issues in production, where you cannot stop the program.",
      "`PYTHONBREAKPOINT` can select another debugger such as `ipdb`.",
    ],
    ex: "Placing `breakpoint()` before a failing calculation to inspect its inputs.",
    mistakes: [
      "Leaving breakpoint() in committed code.",
      "Using print debugging for complex state.",
    ],
    follow: ["How do you turn off every breakpoint() call?"],
    points: [
      "breakpoint() opens pdb",
      "n, s, c, p, l, q commands",
      "python -m pdb script.py",
      "PYTHONBREAKPOINT=0 disables",
    ],
    notes: ["Stop, look, step."],
    src: [
      ["Python: pdb - the Python debugger", `${D}/library/pdb.html`],
      ["Python: breakpoint()", `${D}/library/functions.html`],
    ],
  }),
])
