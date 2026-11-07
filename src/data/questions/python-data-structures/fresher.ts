import { defineQuestions } from "../author"
import { q } from "../compact"

const D = "https://docs.python.org/3"
const PEP = "https://peps.python.org"
const WIKI = "https://wiki.python.org/moin/TimeComplexity"

export default defineQuestions("python-data-structures", "fresher", [
  q({
    slug: "list-indexing-and-slicing",
    topic: "list",
    d: "easy",
    title: "How do indexing and slicing work on Python lists?",
    kw: [
      "list indexing",
      "slicing",
      "negative index",
      "step slice",
      "shallow copy",
    ],
    intent: "Checks basic sequence handling.",
    short:
      "Lists are ordered, zero-indexed sequences. `items[0]` is the first element and `items[-1]` the last; an out-of-range index raises `IndexError`. A slice `items[start:stop:step]` returns a new list from `start` up to but not including `stop`, and out-of-range slice bounds are forgiven rather than raising. `items[::-1]` is a reversed copy and `items[:]` is a shallow copy. Slices can also be assigned to, which replaces or removes a section of the list in place. Slicing never changes the original unless you assign to the slice.",
    detail: [
      "Omitted bounds default to the start and end.",
      "A shallow copy shares the inner objects, which matters for nested lists.",
      "The same slicing works for strings, tuples and other sequences.",
    ],
    ex: "Taking the first three results with `results[:3]` and the last with `results[-1]`.",
    code: [
      [
        "Index and slice",
        "python",
        `a = [10, 20, 30, 40, 50]\nprint(a[1:4])    # [20, 30, 40]\nprint(a[-2:])    # [40, 50]\nprint(a[::2])    # [10, 30, 50]\nprint(a[::-1])   # [50, 40, 30, 20, 10]`,
        ["The stop index is excluded.", "A negative step walks backwards."],
      ],
    ],
    mistakes: [
      "Forgetting that the stop index is exclusive.",
      "Assuming a slice is a view that changes with the original.",
    ],
    follow: ["How do you make an independent copy of a list?"],
    points: [
      "Zero-based, negative from the end",
      "Slice stop is exclusive",
      "Slices return new lists",
      "Bad slice bounds do not raise",
    ],
    notes: ["Start inclusive, stop exclusive."],
    src: [
      ["Python tutorial: Lists", `${D}/tutorial/introduction.html`],
      ["Python: Sequence types", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "list-append-extend-insert-remove",
    topic: "list",
    d: "easy",
    title:
      "What is the difference between `append`, `extend`, `insert`, `remove`, `pop` and `del`?",
    kw: ["append vs extend", "insert", "remove", "pop", "del"],
    intent: "Checks common list mutation methods.",
    short:
      "`append(x)` adds one item at the end, so `a.append([1, 2])` adds a nested list, while `extend(iterable)` (or `+=`) adds each element of the iterable. `insert(i, x)` puts an item at a position. `remove(x)` deletes the first item equal to x and raises `ValueError` if absent. `pop()` removes and returns the last item, `pop(i)` the item at i. `del a[i]` or `del a[i:j]` deletes by position or slice without returning anything. `clear()` empties the list. All of these change the list in place and return `None`, except `pop`.",
    detail: [
      "Methods that mutate in place return `None`, so `a = a.sort()` is a bug.",
      "`insert` and removal near the front shift elements.",
      "Use a list comprehension to filter rather than removing during iteration.",
    ],
    ex: "Collecting all words from several sentences with `words.extend(sentence.split())`.",
    code: [
      [
        "append versus extend",
        "python",
        `a = [1, 2]\na.append([3, 4])\nprint(a)   # [1, 2, [3, 4]]\n\nb = [1, 2]\nb.extend([3, 4])\nprint(b)   # [1, 2, 3, 4]`,
        ["`append` adds one object.", "`extend` unpacks the iterable."],
      ],
    ],
    mistakes: [
      "Using append when you meant extend.",
      "Assigning the result of an in-place method.",
    ],
    follow: ["What does remove do if the value is not found?"],
    points: [
      "append adds one item",
      "extend adds each item",
      "remove by value, pop by position",
      "In-place methods return None",
    ],
    notes: ["One versus many."],
    src: [
      ["Python tutorial: More on lists", `${D}/tutorial/datastructures.html`],
      ["Python: Mutable sequence types", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "list-time-complexity",
    topic: "list",
    d: "medium",
    title:
      "What are the time costs of common list operations, and when is a list the wrong choice?",
    kw: [
      "list complexity",
      "append amortized",
      "insert o(n)",
      "membership o(n)",
      "pop(0)",
    ],
    intent: "Checks you can reason about performance of built-ins.",
    short:
      "A list is a dynamic array. Indexing and `append` and `pop()` at the end are constant time (append is amortized), while `insert(0, x)`, `pop(0)` and `remove` shift elements and take O(n). Membership with `x in items` scans the list, so it is O(n), and sorting is O(n log n). The collections documentation warns that lists incur O(n) memory movement for `pop(0)` and `insert(0, v)`. If you need a queue use `collections.deque`, and if you need fast membership tests use a `set` or `dict`.",
    detail: [
      "Repeated `x in items` inside a loop turns linear work into quadratic.",
      "Building a list by appending is efficient; building by `lst = lst + [x]` is not.",
      "The Python wiki lists complexities for built-in types.",
    ],
    ex: "Checking 100,000 ids against a list is far slower than checking them against a set.",
    mistakes: [
      "Using a list as a queue with pop(0).",
      "Using `in` on a large list inside a loop.",
    ],
    follow: ["What would you use instead for fast membership tests?"],
    points: [
      "Index and append O(1)",
      "Insert or pop at the front O(n)",
      "`in` is O(n)",
      "Use deque or set for those needs",
    ],
    notes: ["A list is a dynamic array."],
    src: [
      ["Python wiki: Time complexity", WIKI],
      ["Python: collections.deque", `${D}/library/collections.html`],
    ],
  }),
  q({
    slug: "sort-versus-sorted",
    topic: "list",
    d: "easy",
    title:
      "What is the difference between `list.sort()` and `sorted()`, and how does `key` work?",
    kw: ["sort", "sorted", "key function", "reverse", "stable sort"],
    intent: "Checks sorting basics and stability.",
    short:
      "`list.sort()` sorts a list in place and returns `None`; `sorted(iterable)` accepts any iterable and returns a new sorted list. Both take `key`, a function applied to each element to produce the value to compare, and `reverse=True` for descending order. For example `sorted(users, key=lambda u: u['age'])`. Python's sort is stable: items that compare equal keep their original relative order, so you can sort by one key and then by another. Comparing values of incompatible types, such as `int` and `str`, raises `TypeError`.",
    detail: [
      "To sort by several fields, return a tuple from the key: `key=lambda u: (u['dept'], u['name'])`.",
      "`operator.itemgetter` and `attrgetter` are faster alternatives to simple lambdas.",
      "`sorted(d.items())` sorts a dictionary's pairs.",
    ],
    ex: "Sorting employees by department and then by salary descending.",
    code: [
      [
        "Key and reverse",
        "python",
        `words = ["pear", "fig", "banana"]\nprint(sorted(words))             # alphabetical\nprint(sorted(words, key=len))    # ['fig', 'pear', 'banana']\nwords.sort(reverse=True)         # in place\nprint(words)`,
        ["`sorted` returns a new list.", "`sort` modifies and returns None."],
      ],
    ],
    mistakes: ["Writing `items = items.sort()`.", "Sorting mixed types."],
    follow: ["What does it mean that sort is stable?"],
    points: [
      "sort() in place, sorted() new list",
      "key function for custom order",
      "Stable sort",
      "Tuples as keys for multi-level sorts",
    ],
    notes: ["sort() returns None."],
    src: [
      ["Python: Sorting techniques", `${D}/howto/sorting.html`],
      ["Python: Built-in functions (sorted)", `${D}/library/functions.html`],
    ],
  }),
  q({
    slug: "shallow-versus-deep-copy",
    topic: "list",
    d: "medium",
    title:
      "What is the difference between assignment, a shallow copy and a deep copy?",
    kw: ["shallow copy", "deep copy", "copy module", "aliasing", "nested list"],
    intent: "A classic aliasing question.",
    short:
      "Assignment (`b = a`) creates no copy; both names refer to the same object. A shallow copy, from `a.copy()`, `a[:]`, `list(a)` or `copy.copy(a)`, creates a new outer container but its elements are the same objects, so changing a nested list through one copy shows through the other. A deep copy, `copy.deepcopy(a)`, recursively copies the contents so the result is fully independent. Deep copies cost more and can be tricky with objects that hold resources or cyclic references, so copy only what you need.",
    detail: [
      "For flat lists of immutable items a shallow copy is enough.",
      "Classes can customise copying with `__copy__` and `__deepcopy__`.",
      "Prefer building new data over copying and mutating where possible.",
    ],
    ex: "A grid stored as nested lists needs `deepcopy` (or a comprehension) to be duplicated safely.",
    code: [
      [
        "Nested lists",
        "python",
        `import copy\n\na = [[1, 2], [3]]\nshallow = a.copy()\ndeep = copy.deepcopy(a)\na[0].append(99)\nprint(shallow[0])  # [1, 2, 99]  shared\nprint(deep[0])     # [1, 2]      independent`,
        [
          "The shallow copy shares inner lists.",
          "The deep copy duplicated them.",
        ],
      ],
    ],
    mistakes: [
      "Assuming list(a) copies nested lists too.",
      "Deep copying large structures needlessly.",
    ],
    follow: ["Which copies are enough for a list of ints?"],
    points: [
      "Assignment shares one object",
      "Shallow copies share elements",
      "Deep copy is recursive",
      "Choose by nesting",
    ],
    notes: ["Shallow = one level."],
    src: [
      ["Python: copy", `${D}/library/copy.html`],
      [
        "Python tutorial: Lists (slices copy)",
        `${D}/tutorial/introduction.html`,
      ],
    ],
  }),
  q({
    slug: "list-multiplication-aliasing-gotcha",
    topic: "list",
    d: "medium",
    title: "Why does `[[0] * 3] * 3` create a buggy 2-D list?",
    kw: [
      "nested list",
      "list multiplication",
      "aliasing",
      "2d list",
      "comprehension",
    ],
    intent: "A well-known gotcha behind grid bugs.",
    short:
      "`[0] * 3` is fine because the integers are immutable. But `[[0] * 3] * 3` creates an outer list of three references to the same inner list, so changing `grid[0][0]` appears to change every row. The Python FAQ explains this for multidimensional lists. Build each row separately with a list comprehension: `[[0] * 3 for _ in range(3)]`, which evaluates `[0] * 3` once per row and so creates three independent lists.",
    detail: [
      "Multiplying a sequence repeats references, not copies.",
      "For numeric grids, libraries like NumPy are a better fit.",
      "Check identity with `grid[0] is grid[1]`.",
    ],
    ex: "A tic-tac-toe board where marking one cell fills the whole column.",
    code: [
      [
        "Bug and fix",
        "python",
        `bad = [[0] * 3] * 3\nbad[0][0] = 1\nprint(bad)   # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]\n\ngood = [[0] * 3 for _ in range(3)]\ngood[0][0] = 1\nprint(good)  # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]`,
        [
          "The bad grid repeats one row object.",
          "The comprehension builds new rows.",
        ],
      ],
    ],
    mistakes: [
      "Multiplying a list of mutable objects.",
      "Not noticing the shared reference.",
    ],
    follow: ["How can you check that two rows are the same object?"],
    points: [
      "`*` repeats references",
      "Mutable inner lists get shared",
      "Use a comprehension per row",
      "Check with `is`",
    ],
    notes: ["Build rows separately."],
    src: [
      [
        "Python FAQ: How do I create a multidimensional list?",
        `${D}/faq/programming.html`,
      ],
      ["Python: Sequence operations", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "sequence-unpacking-and-star",
    topic: "list",
    d: "medium",
    title: "How does unpacking work, including the star `*` target?",
    kw: [
      "unpacking",
      "star expression",
      "swap variables",
      "extended unpacking",
      "multiple assignment",
    ],
    intent: "Checks idiomatic assignment.",
    short:
      "Unpacking assigns the items of an iterable to several names at once: `x, y = point`. The number of names must match unless you use a starred name, which collects the leftover items into a list: `first, *middle, last = values`. It also gives the Pythonic swap `a, b = b, a`, which needs no temporary variable. In loops, `for key, value in d.items()` unpacks each pair. At a call site `f(*args)` and `f(**kwargs)` unpack into arguments. A mismatch in count raises `ValueError`.",
    detail: [
      "Use `_` as a throwaway name for values you ignore.",
      "Only one starred target is allowed per assignment.",
      "Extended unpacking was added by PEP 3132.",
    ],
    ex: "Splitting a CSV row into `name, *scores = row`.",
    code: [
      [
        "Star unpacking",
        "python",
        `first, *rest = [1, 2, 3, 4]\nprint(first, rest)   # 1 [2, 3, 4]\n\na, b = 1, 2\na, b = b, a\nprint(a, b)          # 2 1`,
        [
          "`*rest` takes the remaining items.",
          "The swap evaluates the right side first.",
        ],
      ],
    ],
    mistakes: [
      "Mismatched counts without a starred name.",
      "Two starred targets.",
    ],
    follow: ["How do you ignore a value while unpacking?"],
    points: [
      "Names must match item count",
      "*name collects the rest",
      "Swap with a, b = b, a",
      "Works for any iterable",
    ],
    notes: ["Many names, one line."],
    src: [
      ["PEP 3132: Extended iterable unpacking", `${PEP}/pep-3132/`],
      [
        "Python tutorial: Tuples and sequences",
        `${D}/tutorial/datastructures.html`,
      ],
    ],
  }),
  q({
    slug: "tuples-versus-lists",
    topic: "tuple",
    d: "easy",
    title:
      "What is the difference between a tuple and a list, and when do you use each?",
    kw: [
      "tuple",
      "immutable sequence",
      "list vs tuple",
      "hashable",
      "heterogeneous",
    ],
    intent: "A very common comparison.",
    short:
      "Both are ordered sequences that support indexing and slicing. A list is mutable: you can add, remove or change items. A tuple is immutable: once created its items cannot be reassigned. Use lists for collections of similar items that change, and tuples for fixed groups of related values, such as a coordinate `(x, y)` or a database row. Because tuples cannot change, they can be dictionary keys or set members as long as all their items are hashable. A one-item tuple needs a trailing comma: `(5,)`.",
    detail: [
      "Functions often return multiple values as a tuple.",
      "A tuple containing a mutable list still lets that list change.",
      "Tuples are slightly smaller and faster to create than lists.",
    ],
    ex: "Using `(lat, lon)` tuples as dictionary keys for a cache of locations.",
    mistakes: [
      "Writing (5) and expecting a tuple.",
      "Trying to modify a tuple element.",
    ],
    follow: ["Can a tuple be a dictionary key?"],
    points: [
      "Tuple immutable, list mutable",
      "Tuples as fixed records",
      "Hashable if items are hashable",
      "Single item needs a comma",
    ],
    notes: ["Fixed record versus changing collection."],
    src: [
      [
        "Python tutorial: Tuples and sequences",
        `${D}/tutorial/datastructures.html`,
      ],
      ["Python: Tuples", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "namedtuple-as-lightweight-record",
    topic: "tuple",
    d: "medium",
    title:
      "What is a `namedtuple`, and how does it compare with a plain tuple, dict or class?",
    kw: [
      "namedtuple",
      "typing.namedtuple",
      "record",
      "readable fields",
      "immutable",
    ],
    intent: "Checks you can pick a lightweight record type.",
    short:
      "`collections.namedtuple` creates a tuple subclass whose fields can be read by name as well as by index: `Point = namedtuple('Point', ['x', 'y'])`, then `p.x`. It stays immutable, hashable and memory-light like a tuple, but the code reads better than `p[0]`. `typing.NamedTuple` gives the same with a class syntax and type hints. Compared with a dict it has fixed fields and no per-instance dictionary; compared with a normal class it has little boilerplate, but it is immutable. For mutable records with defaults and methods, a dataclass is the usual choice.",
    detail: [
      "Use `_replace()` to produce a modified copy.",
      "`_asdict()` converts it to a dictionary.",
      "Unpacking works: `x, y = p`.",
    ],
    ex: "Returning `(min, max)` from a function as a `Range` tuple with named fields.",
    code: [
      [
        "namedtuple",
        "python",
        `from collections import namedtuple\n\nPoint = namedtuple("Point", ["x", "y"])\np = Point(1, 2)\nprint(p.x, p[1])      # 1 2\nprint(p._replace(x=9)) # Point(x=9, y=2)`,
        ["Fields are readable by name.", "`_replace` returns a new tuple."],
      ],
    ],
    mistakes: [
      "Trying to assign to a field.",
      "Using it when mutability is needed.",
    ],
    follow: ["When would you prefer a dataclass?"],
    points: [
      "Tuple with named fields",
      "Immutable and hashable",
      "typing.NamedTuple adds type hints",
      "Dataclass for mutable records",
    ],
    notes: ["Readable tuples."],
    src: [
      ["Python: collections.namedtuple", `${D}/library/collections.html`],
      ["Python: typing.NamedTuple", `${D}/library/typing.html`],
    ],
  }),
  q({
    slug: "dict-get-setdefault-and-keyerror",
    topic: "dict",
    d: "easy",
    title: "How do you read and update dictionary entries safely?",
    kw: ["dict get", "keyerror", "setdefault", "in operator", "pop default"],
    intent: "Checks safe dictionary access.",
    short:
      "A dictionary maps unique, hashable keys to values. `d[key]` raises `KeyError` if the key is missing. `d.get(key, default)` returns the default (or `None`) without raising, and `key in d` tests presence. `d.setdefault(key, default)` returns the existing value or inserts the default and returns it, which is useful for grouping. `d.pop(key, default)` removes a key and returns its value, and `del d[key]` removes it or raises `KeyError`. `d[key] = value` adds or replaces an entry.",
    detail: [
      "`get` does not insert the key, but `setdefault` does.",
      "Use `try`/`except KeyError` when the missing key is the exceptional case.",
      "A default that is expensive to build is evaluated even if the key exists.",
    ],
    ex: "Looking up a config option with `config.get('timeout', 30)`.",
    code: [
      [
        "Safe access",
        "python",
        `d = {"a": 1}\nprint(d.get("b", 0))        # 0\nd.setdefault("tags", []).append("x")\nprint(d)                    # {'a': 1, 'tags': ['x']}\nprint(d.pop("a", None))     # 1`,
        ["`get` avoids KeyError.", "`setdefault` creates the list once."],
      ],
    ],
    mistakes: [
      "Indexing a missing key without handling.",
      "Confusing get with setdefault.",
    ],
    follow: ["What is the difference between get and setdefault?"],
    points: [
      "d[key] may raise KeyError",
      "get returns a default",
      "setdefault inserts it",
      "in tests for a key",
    ],
    notes: ["get reads, setdefault writes."],
    src: [
      ["Python tutorial: Dictionaries", `${D}/tutorial/datastructures.html`],
      ["Python: Mapping types - dict", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "dict-order-and-hashable-keys",
    topic: "dict",
    d: "medium",
    title:
      "Are dictionaries ordered, and what can be used as a dictionary key?",
    kw: [
      "dict order",
      "insertion order",
      "hashable key",
      "unhashable type",
      "hash table",
    ],
    intent: "Checks understanding of dict guarantees and keys.",
    short:
      "Since Python 3.7 the language guarantees that dictionaries keep insertion order, so iteration follows the order keys were first added; updating an existing key does not move it. Keys must be hashable: immutable built-in types such as numbers, strings and tuples of hashable items qualify, while lists, dicts and sets raise `TypeError: unhashable type`. Lookup uses a hash table, so reading, inserting and deleting are O(1) on average. Two keys that are equal, like `1` and `1.0`, count as the same key.",
    detail: [
      "Equality of dicts ignores order: `{'a': 1, 'b': 2} == {'b': 2, 'a': 1}`.",
      "Objects used as keys must give the same hash for the whole time they are in the dictionary.",
      "To get a sorted view, use `sorted(d.items())`.",
    ],
    ex: "Using a tuple of (row, column) as the key for a sparse grid.",
    mistakes: ["Using a list as a key.", "Assuming dicts are sorted by key."],
    follow: ["Why must keys be hashable?"],
    points: [
      "Insertion order guaranteed from 3.7",
      "Keys must be hashable",
      "O(1) average operations",
      "Equality ignores order",
    ],
    notes: ["Ordered by insertion, not by value."],
    src: [
      ["Python: Mapping types - dict", `${D}/library/stdtypes.html`],
      ["Python: Glossary - hashable", `${D}/glossary.html`],
    ],
  }),
  q({
    slug: "dict-merge-and-update",
    topic: "dict",
    d: "medium",
    title: "How can you merge dictionaries in Python?",
    kw: [
      "merge dictionaries",
      "update method",
      "union operator",
      "dict unpacking",
      "overwrite keys",
    ],
    intent: "Checks knowledge of modern idioms.",
    short:
      "`a.update(b)` merges `b` into `a` in place; keys in `b` overwrite those in `a`. To make a new dictionary without changing the originals use `{**a, **b}` or, since Python 3.9, the union operator `a | b`; `a |= b` updates in place. In every form, when a key appears in both, the right-hand value wins. These operations are shallow: nested dictionaries are shared, not merged recursively, so deep merging needs your own function.",
    detail: [
      "`dict(a, **b)` works only with string keys.",
      "The `|` operator was added by PEP 584.",
      "Order follows insertion, with new keys added after existing ones.",
    ],
    ex: "Applying user settings over default settings: `settings = defaults | user`.",
    code: [
      [
        "Merging",
        "python",
        `defaults = {"theme": "light", "size": 12}\nuser = {"size": 14}\nprint(defaults | user)        # {'theme': 'light', 'size': 14}\nprint({**defaults, **user})   # same result\ndefaults.update(user)         # changes defaults`,
        [
          "The right operand overrides.",
          "Only `update` and `|=` modify in place.",
        ],
      ],
    ],
    mistakes: ["Expecting a deep merge.", "Using | on Python older than 3.9."],
    follow: ["Which value wins for a repeated key?"],
    points: [
      "update merges in place",
      "{**a, **b} and a | b create new dicts",
      "Right side wins",
      "Merges are shallow",
    ],
    notes: ["Last one wins."],
    src: [
      ["PEP 584: Add union operators to dict", `${PEP}/pep-0584/`],
      ["Python: Mapping types - dict", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "dict-views-and-safe-iteration",
    topic: "dict",
    d: "easy",
    title:
      "What are `keys()`, `values()` and `items()`, and can you change a dictionary while looping?",
    kw: [
      "dict views",
      "items",
      "keys",
      "values",
      "runtimeerror dictionary changed size",
    ],
    intent: "Checks iteration rules.",
    short:
      "`keys()`, `values()` and `items()` return dynamic view objects that reflect later changes to the dictionary; `items()` yields `(key, value)` pairs, ideal for `for k, v in d.items()`. Iterating over a dictionary directly gives its keys. Adding or removing entries while iterating can raise `RuntimeError: dictionary changed size during iteration` or skip entries. To delete or add during a loop, iterate over a copy such as `list(d)` or build a new dictionary with a comprehension. Changing the value of an existing key during iteration is allowed.",
    detail: [
      "Keys and items views behave like sets for operations such as `&`.",
      "Views are not lists: convert with `list()` to index them.",
      "`len(d.keys())` is the same as `len(d)`.",
    ],
    ex: "Removing all expired sessions with `for k in list(sessions): if expired(k): del sessions[k]`.",
    mistakes: [
      "Deleting keys inside a plain loop over the dict.",
      "Indexing a view like a list.",
    ],
    follow: ["How do you remove entries while looping?"],
    points: [
      "Views are dynamic",
      "items gives pairs",
      "Do not change size while iterating",
      "Iterate a copy or build a new dict",
    ],
    notes: ["Live views, copy to mutate."],
    src: [
      ["Python: Dictionary view objects", `${D}/library/stdtypes.html`],
      [
        "Python tutorial: Looping techniques",
        `${D}/tutorial/datastructures.html`,
      ],
    ],
  }),
  q({
    slug: "group-items-by-key",
    topic: "dict",
    d: "medium",
    title:
      "How would you group a list of records by a field using dictionaries?",
    kw: [
      "group by",
      "setdefault",
      "defaultdict",
      "aggregation",
      "itertools.groupby",
    ],
    intent: "A practical task testing dict idioms.",
    short:
      "Create a dictionary that maps each key to a list and append each record to the right list. With `setdefault`: `groups.setdefault(r['dept'], []).append(r)`. With `collections.defaultdict(list)` the missing key is created automatically: `groups[r['dept']].append(r)`. `itertools.groupby` also groups, but only adjacent items, so the data must be sorted by the key first. For counting rather than collecting, use `Counter` or `defaultdict(int)`. All of these run in a single pass, O(n).",
    detail: [
      "`groupby` returns lazy iterators that are invalidated as you advance.",
      "Convert a `defaultdict` to a normal dict with `dict(d)` if needed.",
      "For large tabular data, pandas `groupby` is the usual tool.",
    ],
    ex: "Grouping orders by customer id to compute a total per customer.",
    code: [
      [
        "defaultdict grouping",
        "python",
        `from collections import defaultdict\n\nrows = [("eng", "Asha"), ("ops", "Ravi"), ("eng", "Meera")]\ngroups = defaultdict(list)\nfor dept, name in rows:\n    groups[dept].append(name)\nprint(dict(groups))  # {'eng': ['Asha', 'Meera'], 'ops': ['Ravi']}`,
        ["Missing keys start as empty lists.", "One pass over the data."],
      ],
    ],
    mistakes: [
      "Using groupby on unsorted data.",
      "Checking membership then inserting on separate lines.",
    ],
    follow: ["Why does groupby need sorted input?"],
    points: [
      "Map key to list",
      "setdefault or defaultdict(list)",
      "groupby needs sorted data",
      "Single pass O(n)",
    ],
    notes: ["Key to list of records."],
    src: [
      ["Python: collections.defaultdict", `${D}/library/collections.html`],
      ["Python: itertools.groupby", `${D}/library/itertools.html`],
    ],
  }),
  q({
    slug: "defaultdict-behaviour",
    topic: "collections module",
    d: "medium",
    title: "How does `collections.defaultdict` work, and what is its catch?",
    kw: [
      "defaultdict",
      "default_factory",
      "missing key",
      "counting",
      "grouping",
    ],
    intent: "Checks understanding of automatic defaults.",
    short:
      "`defaultdict(factory)` behaves like a dictionary but when you read a missing key it calls `factory()` with no arguments, stores the result under that key and returns it. `defaultdict(list)` is used for grouping, `defaultdict(int)` for counting and `defaultdict(set)` for unique collections. The catch is that merely reading `d[key]` inserts the key, so lookups can grow the dictionary and `key in d` becomes the only safe test. The `get` method does not trigger the factory. Passing no factory makes it behave like a regular dictionary raising `KeyError`.",
    detail: [
      "The factory can be any zero-argument callable, such as `lambda: [0, 0]`.",
      "It is a subclass of `dict`, so all dict methods work.",
      "Convert to `dict` before sending it to code that would be confused by auto-creation.",
    ],
    ex: "Counting word occurrences with `counts = defaultdict(int)` and `counts[word] += 1`.",
    mistakes: [
      "Reading missing keys and accidentally creating them.",
      "Expecting `get` to call the factory.",
    ],
    follow: ["What happens when you read a missing key?"],
    points: [
      "default_factory creates missing values",
      "Reading a missing key inserts it",
      "get() does not call the factory",
      "Subclass of dict",
    ],
    notes: ["Reading can write."],
    src: [
      ["Python: collections.defaultdict", `${D}/library/collections.html`],
      ["Python: Mapping types - dict", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "counter-and-most-common",
    topic: "collections module",
    d: "easy",
    title: "How do you count items with `collections.Counter`?",
    kw: ["counter", "most_common", "frequency count", "multiset", "word count"],
    intent: "Checks use of a practical built-in.",
    short:
      "`Counter(iterable)` builds a dictionary subclass that maps each element to how many times it appears: `Counter('banana')` gives `{'a': 3, 'n': 2, 'b': 1}`. `most_common(n)` returns the n highest counts as `(element, count)` pairs. A missing element returns a count of 0 instead of raising `KeyError`. Counters support arithmetic: adding counters sums counts and subtracting removes them, keeping only positive results. They replace the manual loop with `d[x] = d.get(x, 0) + 1` and are ideal for word frequencies and anagram checks.",
    detail: [
      "`update(iterable)` adds counts rather than replacing.",
      "`elements()` expands counts back to repeated items.",
      "Two words are anagrams if their Counters are equal.",
    ],
    ex: "Finding the three most repeated words in a text file.",
    code: [
      [
        "Word counts",
        "python",
        `from collections import Counter\n\nwords = "to be or not to be".split()\nc = Counter(words)\nprint(c.most_common(2))  # [('to', 2), ('be', 2)]\nprint(c["missing"])      # 0`,
        ["`most_common` sorts by count.", "Missing keys return 0."],
      ],
    ],
    mistakes: [
      "Counting with manual dict code.",
      "Forgetting that missing keys return 0, not an error.",
    ],
    follow: ["How would you test whether two strings are anagrams?"],
    points: [
      "Counts hashable items",
      "most_common(n)",
      "Missing key is 0",
      "Supports counter arithmetic",
    ],
    notes: ["Frequencies in one line."],
    src: [
      ["Python: collections.Counter", `${D}/library/collections.html`],
      [
        "Python tutorial: Brief tour of the standard library",
        `${D}/tutorial/stdlib.html`,
      ],
    ],
  }),
  q({
    slug: "deque-for-queues",
    topic: "collections module",
    d: "medium",
    title: "When should you use `collections.deque` instead of a list?",
    kw: ["deque", "queue", "popleft", "maxlen", "double-ended queue"],
    intent: "Checks you pick the right structure for queues.",
    short:
      "A `deque` (double-ended queue) supports appends and pops from either end in O(1): `append`, `appendleft`, `pop`, `popleft`. A list is slow at the front because `pop(0)` and `insert(0, x)` shift every element, so use a deque for queues, breadth-first search and sliding windows. With `maxlen=n` it keeps only the latest n items, discarding from the other end, which suits 'last N' histories. The trade-off is that indexing in the middle is O(n), so it is not a replacement for lists when you need random access.",
    detail: [
      "`rotate(n)` shifts items around.",
      "`queue.Queue` is the thread-safe queue for threads; deque is a plain data structure.",
      "Slicing is not supported on a deque.",
    ],
    ex: "Keeping the last 5 log lines using `deque(maxlen=5)`.",
    code: [
      [
        "Queue and bounded history",
        "python",
        `from collections import deque\n\nq = deque([1, 2, 3])\nq.append(4)\nprint(q.popleft())   # 1\n\nlast = deque(maxlen=2)\nfor n in range(5):\n    last.append(n)\nprint(list(last))    # [3, 4]`,
        ["`popleft` is O(1).", "`maxlen` drops the oldest item."],
      ],
    ],
    mistakes: [
      "Using list.pop(0) for a queue.",
      "Indexing into the middle of a large deque repeatedly.",
    ],
    follow: ["What does maxlen do?"],
    points: [
      "O(1) at both ends",
      "popleft for queues",
      "maxlen for bounded history",
      "Middle access is O(n)",
    ],
    notes: ["Fast at both ends."],
    src: [
      ["Python: collections.deque", `${D}/library/collections.html`],
      ["Python wiki: Time complexity (deque)", WIKI],
    ],
  }),
  q({
    slug: "ordereddict-vs-dict",
    topic: "collections module",
    d: "medium",
    title: "Is `OrderedDict` still needed now that dicts keep insertion order?",
    kw: ["ordereddict", "move_to_end", "popitem", "lru cache", "dict order"],
    intent: "Checks nuance about a legacy-looking type.",
    short:
      "Regular dictionaries keep insertion order since Python 3.7, so most code no longer needs `OrderedDict`. It still differs in useful ways: equality between two OrderedDicts is order-sensitive, while two plain dicts with the same items are equal regardless of order; it has `move_to_end(key)` to reposition a key, and `popitem(last=False)` to remove from the front. These make it convenient for building least-recently-used caches. For everyday ordered mappings, use a plain `dict`.",
    detail: [
      "`functools.lru_cache` is available if you only need to cache function results.",
      "OrderedDict gives explicit intent that order matters.",
      "Comparing an OrderedDict with a regular dict ignores order.",
    ],
    ex: "An LRU cache moves a key to the end on each hit and evicts from the front when full.",
    mistakes: [
      "Using OrderedDict by habit.",
      "Assuming dict equality considers order.",
    ],
    follow: ["What does move_to_end do?"],
    points: [
      "Plain dicts keep insertion order",
      "OrderedDict equality is order-sensitive",
      "move_to_end and popitem(last=False)",
      "Useful for LRU caches",
    ],
    notes: ["Order matters in equality."],
    src: [
      ["Python: collections.OrderedDict", `${D}/library/collections.html`],
      ["Python: functools.lru_cache", `${D}/library/functools.html`],
    ],
  }),
  q({
    slug: "set-operations",
    topic: "set",
    d: "easy",
    title: "What are sets, and which operations do they support?",
    kw: ["set", "union", "intersection", "difference", "symmetric difference"],
    intent: "Checks use of set algebra.",
    short:
      "A set is an unordered collection of unique, hashable elements. Create one with `{1, 2, 3}` or `set(iterable)`; an empty set must be `set()` because `{}` is a dict. Operations mirror mathematics: union `a | b`, intersection `a & b`, difference `a - b` (in a but not b), symmetric difference `a ^ b` (in exactly one), plus tests like `a <= b` for subset and `isdisjoint`. Adding is `add`, removal is `remove` (raises `KeyError` if absent) or `discard` (silent). Membership `x in s` is O(1) on average.",
    detail: [
      "Sets do not support indexing or slicing.",
      "Duplicates are discarded automatically.",
      "Elements must be hashable, so a set cannot contain lists.",
    ],
    ex: "Finding the users who are in both of two mailing lists with `list_a & list_b`.",
    code: [
      [
        "Set algebra",
        "python",
        `a = {1, 2, 3}\nb = {3, 4}\nprint(a | b)   # {1, 2, 3, 4}\nprint(a & b)   # {3}\nprint(a - b)   # {1, 2}\nprint(a ^ b)   # {1, 2, 4}`,
        ["Each operator returns a new set."],
      ],
    ],
    mistakes: [
      "Writing {} for an empty set.",
      "Expecting a set to keep order.",
    ],
    follow: ["What is the difference between remove and discard?"],
    points: [
      "Unique hashable elements",
      "| & - ^ operators",
      "{} is an empty dict",
      "O(1) average membership",
    ],
    notes: ["Math sets in code."],
    src: [
      ["Python tutorial: Sets", `${D}/tutorial/datastructures.html`],
      ["Python: Set types", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "remove-duplicates-keep-order",
    topic: "set",
    d: "easy",
    title:
      "How do you remove duplicates from a list, and how do you keep the order?",
    kw: [
      "remove duplicates",
      "dict.fromkeys",
      "set",
      "preserve order",
      "unique items",
    ],
    intent: "A practical question on sets and dicts.",
    short:
      "`list(set(items))` removes duplicates quickly in O(n), but sets are unordered, so the original order is lost. To keep the first occurrence of each item in order, use `list(dict.fromkeys(items))`, relying on dictionaries preserving insertion order, or track a `seen` set while looping. Both require hashable items. For unhashable items such as lists, convert them to tuples first or compare with a slower loop. Checking `x in some_list` inside a loop would make the job O(n²), so avoid it.",
    detail: [
      "Sorting first and removing adjacent duplicates is another approach.",
      "`sorted(set(items))` gives unique items in sorted order.",
      "Define what counts as a duplicate, such as case-insensitive matching, before starting.",
    ],
    ex: "Deduplicating a list of email addresses while keeping the order users signed up.",
    code: [
      [
        "Order-preserving unique",
        "python",
        `items = [3, 1, 3, 2, 1]\nprint(list(set(items)))          # order not guaranteed\nprint(list(dict.fromkeys(items)))  # [3, 1, 2]`,
        ["`dict.fromkeys` keeps first-seen order."],
      ],
    ],
    mistakes: [
      "Assuming a set preserves order.",
      "Using nested loops for deduplication.",
    ],
    follow: ["What if the items are lists?"],
    points: [
      "set removes duplicates, loses order",
      "dict.fromkeys keeps order",
      "Items must be hashable",
      "Avoid O(n²) membership loops",
    ],
    notes: ["set for uniqueness, dict for order."],
    src: [
      ["Python: dict.fromkeys", `${D}/library/stdtypes.html`],
      ["Python: Set types", `${D}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "frozenset-and-hashable-sets",
    topic: "set",
    d: "medium",
    title: "What is a `frozenset`, and when do you need one?",
    kw: [
      "frozenset",
      "immutable set",
      "hashable",
      "set of sets",
      "dictionary key",
    ],
    intent: "Checks understanding of hashability and immutability.",
    short:
      "A `frozenset` is an immutable version of a set: it supports the same read operations such as union and intersection but has no `add` or `remove`. Because it cannot change, it is hashable, so it can be a dictionary key or an element of another set, which a normal `set` cannot be. Use it for constants, for sets of sets, such as storing groups of items where the order does not matter, or as a cache key built from a collection of options. Operations between a set and a frozenset return the type of the left operand.",
    detail: [
      "`frozenset(iterable)` is the only constructor; there is no literal.",
      "A set containing a frozenset works, but a set containing a set raises `TypeError`.",
      "Elements still need to be hashable themselves.",
    ],
    ex: "Using `frozenset({'read', 'write'})` as a key in a permissions lookup.",
    mistakes: [
      "Trying to put a set inside a set.",
      "Expecting mutation methods.",
    ],
    follow: ["Why can a frozenset be a dict key?"],
    points: [
      "Immutable set",
      "Hashable",
      "Can be a key or set member",
      "No add or remove",
    ],
    notes: ["Hashable because immutable."],
    src: [
      ["Python: Set types (frozenset)", `${D}/library/stdtypes.html`],
      ["Python: Glossary - hashable", `${D}/glossary.html`],
    ],
  }),
  q({
    slug: "heapq-priority-queue",
    topic: "collections module",
    d: "medium",
    title:
      "How do you build a priority queue or find the k largest items with `heapq`?",
    kw: ["heapq", "priority queue", "min-heap", "nlargest", "heappush"],
    intent: "Checks use of the standard heap module.",
    short:
      "`heapq` implements a min-heap on a plain list, so the smallest item is always at `heap[0]`. `heappush(heap, x)` and `heappop(heap)` add and remove in O(log n), and `heapify(list)` turns a list into a heap in O(n). `nlargest(k, iterable)` and `nsmallest(k, iterable)` return the k extremes without fully sorting. For a priority queue, push tuples `(priority, item)`; lower numbers come out first. There is no max-heap, so negate priorities to get one. Add a tie-breaker counter if items themselves cannot be compared.",
    detail: [
      "A heap list is not sorted; only the smallest item is guaranteed in front.",
      "For multi-threaded programs use `queue.PriorityQueue`.",
      "`nlargest` is best for small k; `sorted()` is fine when k is close to n.",
    ],
    ex: "A job scheduler always runs the task with the earliest deadline.",
    code: [
      [
        "Priority queue",
        "python",
        `import heapq\n\nheap = []\nheapq.heappush(heap, (2, "write"))\nheapq.heappush(heap, (1, "plan"))\nprint(heapq.heappop(heap))        # (1, 'plan')\nprint(heapq.nlargest(2, [5, 1, 9, 3]))  # [9, 5]`,
        [
          "The lowest priority number pops first.",
          "`nlargest` avoids a full sort.",
        ],
      ],
    ],
    mistakes: [
      "Assuming the heap list is sorted.",
      "Pushing items that cannot be compared on ties.",
    ],
    follow: ["How do you get a max-heap?"],
    points: [
      "Min-heap on a list",
      "push and pop are O(log n)",
      "heap[0] is the smallest",
      "Negate priorities for a max-heap",
    ],
    notes: ["Smallest first."],
    src: [
      ["Python: heapq", `${D}/library/heapq.html`],
      ["Python: queue.PriorityQueue", `${D}/library/queue.html`],
    ],
  }),
  q({
    slug: "bisect-for-sorted-lists",
    topic: "collections module",
    d: "medium",
    title: "How does the `bisect` module help with sorted lists?",
    kw: ["bisect", "binary search", "insort", "sorted list", "bisect_left"],
    intent: "Checks you can reuse standard binary search.",
    short:
      "`bisect` does binary search on an already sorted list. `bisect_left(a, x)` returns the leftmost position where x could be inserted to keep the order, `bisect_right` the rightmost, and `insort(a, x)` inserts x while keeping the list sorted. Finding the position takes O(log n). The documentation points out that `insort` is still O(n) overall because inserting into a list shifts elements. Use it to look up values in sorted data, map scores to grade ranges or maintain a small sorted list. The list must be sorted first.",
    detail: [
      "To check presence, compare `a[i] == x` after `bisect_left` returns i.",
      "Since Python 3.10 functions accept a `key` argument.",
      "For frequent inserts into large data, consider a heap or a tree-based library.",
    ],
    ex: "Mapping marks to grades using breakpoints `[60, 70, 80, 90]` and `bisect`.",
    code: [
      [
        "Grade lookup",
        "python",
        `from bisect import bisect\n\ndef grade(score, cuts=(60, 70, 80, 90), letters="FDCBA"):\n    return letters[bisect(cuts, score)]\n\nprint(grade(85), grade(55))  # B F`,
        ["`bisect` finds the range index in O(log n)."],
      ],
    ],
    mistakes: [
      "Using bisect on an unsorted list.",
      "Expecting insort to be O(log n).",
    ],
    follow: ["What is the difference between bisect_left and bisect_right?"],
    points: [
      "Binary search on sorted lists",
      "bisect_left/right return positions",
      "insort inserts in order",
      "Insertion is still O(n)",
    ],
    notes: ["Sorted input required."],
    src: [
      ["Python: bisect", `${D}/library/bisect.html`],
      ["Python wiki: Time complexity", WIKI],
    ],
  }),
  q({
    slug: "common-sequence-operations",
    topic: "list",
    d: "easy",
    title: "Which operations do all Python sequence types share?",
    kw: ["sequence types", "len", "in operator", "concatenation", "range"],
    intent: "Checks the unifying idea behind list, tuple, str and range.",
    short:
      "Lists, tuples, strings, bytes and ranges are sequences and share a common set of operations: indexing `s[i]`, slicing `s[i:j]`, `len(s)`, `min`/`max`, membership `x in s`, concatenation `s + t`, repetition `s * n`, and the methods `s.index(x)` and `s.count(x)`, and they can be iterated in order. Mutable sequences such as lists add item assignment and methods like `append`. `range` produces its numbers lazily, taking constant memory. Knowing this lets you write code that works for any sequence.",
    detail: [
      "`reversed(s)` and `sorted(s)` work on sequences, and `enumerate(s)` pairs items with positions.",
      "Concatenating many strings or tuples in a loop is quadratic; use `join` or a list.",
      "`x in s` is O(n) for lists and strings.",
    ],
    ex: "A function that counts items works the same on a list, a tuple or a string.",
    mistakes: [
      "Assuming every sequence is mutable.",
      "Concatenating inside loops.",
    ],
    follow: ["Which sequence types are immutable?"],
    points: [
      "Index, slice, len, in",
      "Concatenate and repeat",
      "index and count methods",
      "range is lazy",
    ],
    notes: ["One interface, many types."],
    src: [
      ["Python: Common sequence operations", `${D}/library/stdtypes.html`],
      ["Python tutorial: Data structures", `${D}/tutorial/datastructures.html`],
    ],
  }),
  q({
    slug: "custom-objects-as-keys-hash-and-eq",
    topic: "dict",
    d: "hard",
    title:
      "How do `__eq__` and `__hash__` affect using your own objects as dict keys or set members?",
    kw: [
      "__hash__",
      "__eq__",
      "hashable objects",
      "unhashable class",
      "dataclass frozen",
    ],
    intent: "Checks understanding of the hash contract.",
    short:
      "Dictionaries and sets locate entries by hash and then confirm with equality, so objects that compare equal must have the same hash. If a class defines `__eq__` without defining `__hash__`, Python sets `__hash__` to `None` and instances become unhashable, which raises `TypeError` when used as keys. Define both, based on the same immutable fields: `hash((self.x, self.y))`. Mutable objects should generally not be hashable, because changing a field after insertion would make the entry impossible to find. Frozen dataclasses and namedtuples generate both methods for you.",
    detail: [
      "Default object equality and hash use identity.",
      "`@dataclass(frozen=True)` produces `__eq__` and `__hash__` from the fields.",
      "Never base a hash on a value that can change while the object is in a set.",
    ],
    ex: "A `Point(x, y)` class used as a dictionary key needs matching `__eq__` and `__hash__`.",
    code: [
      [
        "Hashable value object",
        "python",
        `class Point:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __eq__(self, other):\n        return isinstance(other, Point) and (self.x, self.y) == (other.x, other.y)\n    def __hash__(self):\n        return hash((self.x, self.y))\n\nprint({Point(1, 2): "a"}[Point(1, 2)])  # a`,
        ["Equal points hash equally.", "Both methods use the same fields."],
      ],
    ],
    mistakes: ["Defining __eq__ only.", "Hashing mutable fields."],
    follow: ["What happens to __hash__ when you define __eq__ only?"],
    points: [
      "Equal objects need equal hashes",
      "__eq__ alone makes it unhashable",
      "Hash from immutable fields",
      "Frozen dataclasses do it for you",
    ],
    notes: ["Eq and hash go together."],
    src: [
      ["Python: Data model (__hash__)", `${D}/reference/datamodel.html`],
      ["Python: dataclasses", `${D}/library/dataclasses.html`],
    ],
  }),
  q({
    slug: "modifying-list-while-iterating",
    topic: "list",
    d: "medium",
    title:
      "Why is it risky to remove items from a list while iterating over it, and what should you do?",
    kw: [
      "modify while iterating",
      "list comprehension filter",
      "skipped items",
      "iterate over copy",
      "remove",
    ],
    intent: "Checks a classic bug.",
    short:
      "A `for` loop over a list walks an internal position index. If you remove an item, the items after it shift left and the loop skips the element that moved into the current position, so some items are never examined. Safer options are to build a new list with a comprehension, `items = [x for x in items if keep(x)]`, to iterate over a copy (`for x in items[:]`), or to collect the unwanted items and remove them afterwards. Loop over indices backwards if you must delete in place.",
    detail: [
      "Adding to a list while iterating over it can cause an endless loop.",
      "`filter()` is another way to build a filtered result.",
      "The same applies to sets and dictionaries, which raise a `RuntimeError` instead of skipping.",
    ],
    ex: "Removing all even numbers from `[2, 4, 6, 7]` with `remove` inside a loop leaves 4 behind.",
    code: [
      [
        "Skipping bug and fix",
        "python",
        `nums = [2, 4, 6, 7]\nfor n in nums:\n    if n % 2 == 0:\n        nums.remove(n)\nprint(nums)      # [4, 7]  (4 was skipped)\n\nnums = [2, 4, 6, 7]\nnums = [n for n in nums if n % 2]\nprint(nums)      # [7]`,
        [
          "Removing shifts later items left.",
          "The comprehension builds a clean result.",
        ],
      ],
    ],
    mistakes: [
      "Removing inside the loop.",
      "Not realising items were skipped.",
    ],
    follow: ["How do dicts behave in the same situation?"],
    points: [
      "Removal shifts later items",
      "Loop skips elements",
      "Use a comprehension",
      "Or iterate over a copy",
    ],
    notes: ["Build a new list."],
    src: [
      [
        "Python tutorial: Looping techniques",
        `${D}/tutorial/datastructures.html`,
      ],
      ["Python FAQ: Programming", `${D}/faq/programming.html`],
    ],
  }),
  q({
    slug: "choosing-the-right-container",
    topic: "collections module",
    d: "medium",
    title: "How do you choose between a list, tuple, dict, set and deque?",
    kw: [
      "choose data structure",
      "list vs set",
      "dict lookup",
      "deque queue",
      "performance",
    ],
    intent: "Checks design judgement.",
    short:
      "Start from the operations you need. Use a list for an ordered collection you append to, iterate and index. Use a tuple for a fixed record or a key made of several values. Use a dict for lookup by key, counting and grouping. Use a set for uniqueness, fast membership tests and set algebra. Use a deque for queues and bounded histories, a heap for always getting the smallest item, and a `Counter` for frequencies. The main performance rule: membership in a list is O(n), but in a set or dict it is O(1) on average.",
    detail: [
      "Prefer clarity first; optimise after measuring.",
      "Use `namedtuple` or a dataclass instead of anonymous tuples when fields need names.",
      "Wrong choices usually show up as slow `in` checks or `pop(0)` calls.",
    ],
    ex: "Checking if a username is taken: keep usernames in a set, not a list.",
    mistakes: [
      "Searching big lists repeatedly.",
      "Using dictionaries when a simple list would do.",
    ],
    follow: ["Which structure gives O(1) lookup by key?"],
    points: [
      "List: ordered, indexed",
      "Dict: key lookup",
      "Set: uniqueness and membership",
      "Deque and heap for queues",
    ],
    notes: ["Operations pick the type."],
    src: [
      ["Python tutorial: Data structures", `${D}/tutorial/datastructures.html`],
      ["Python wiki: Time complexity", WIKI],
    ],
  }),
])
