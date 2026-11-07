import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-oop", {
  slug: "dataclasses",
  title: "Dataclasses",
  topic: "dataclasses",
  minutes: 45,
  overview:
    "Let @dataclass generate __init__, __repr__ and __eq__ for classes that mainly hold data, and use defaults, default_factory, frozen, order, __post_init__, asdict and replace.",
  objectives: [
    "Declare a dataclass with typed fields and defaults",
    "Use field(default_factory=...) for mutable defaults",
    "Use frozen=True and order=True when appropriate",
    "Use __post_init__, asdict and replace",
  ],
  prerequisites: ["lesson.python-oop.classes"],
  sections: [
    {
      kind: "explain",
      heading: "Less boilerplate for data classes",
      body: [
        "Many classes mostly store data. Writing `__init__`, `__repr__` and `__eq__` by hand for each is repetitive. The `@dataclass` decorator from the `dataclasses` module reads the **annotated class attributes** (the fields) and generates those methods for you.",
        "Fields are declared as `name: type` and may have defaults. Fields without defaults must come before fields with defaults, as with function parameters. The annotations are used to find the fields; Python does not enforce the types at run time.",
      ],
    },
    {
      kind: "code",
      heading: "A basic dataclass",
      example: {
        title: "Generated methods",
        language: "python",
        code: "from dataclasses import dataclass, field, asdict, replace\n\n@dataclass\nclass P:\n    x: int\n    y: int = 0\n    tags: list = field(default_factory=list)\n\np = P(1)\nprint(p)\nprint(p == P(1))\nprint(asdict(p))\nprint(replace(p, y=5))",
        walkthrough: [
          "`P(1)` uses the generated `__init__`; `y` defaults to `0` and `tags` to a new empty list. The generated `__repr__` prints `P(x=1, y=0, tags=[])`.",
          "The generated `__eq__` compares the fields as a tuple, so `P(1) == P(1)` is `True`.",
          "`asdict` converts the instance to a dictionary. `replace` returns a **copy** with the given fields changed, leaving the original untouched.",
          "A mutable default such as `tags: list = []` is rejected with a `ValueError`; use `field(default_factory=list)` so each instance gets its own list.",
        ],
      },
    },
    {
      kind: "code",
      heading: "frozen, order and __post_init__",
      example: {
        title: "Options on the decorator",
        language: "python",
        code: "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass F:\n    a: int\n\nf = F(1)\ntry:\n    f.a = 2\nexcept Exception as e:\n    print(type(e).__name__, e)\n\n@dataclass(order=True)\nclass O:\n    n: int\n\nprint(O(1) < O(2), sorted([O(3), O(1)]))\n\n@dataclass\nclass Q:\n    a: int\n\n    def __post_init__(self):\n        self.b = self.a * 2\n\nprint(Q(3).b)",
        walkthrough: [
          "`frozen=True` makes instances read-only: assigning a field raises `FrozenInstanceError`. A frozen dataclass with `eq=True` also gets a `__hash__`, so it can be a dictionary key or set member.",
          "`order=True` generates `<`, `<=`, `>` and `>=`, comparing the fields in order. That allows `sorted` on a list of them.",
          "`__post_init__` runs right after the generated `__init__`. Use it for validation or for derived values such as `b`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "When to use one",
      body: [
        "Use a dataclass for records: configuration, rows, results, messages. Use a normal class when behaviour matters more than data, or when you need to control `__init__` closely.",
        "For a lightweight immutable record, `namedtuple` also works, but a dataclass supports defaults, methods, type annotations and inheritance more naturally.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using a list or dict as a plain default value.",
          fix: "Use field(default_factory=list) or dict.",
        },
        {
          mistake: "Putting a field with a default before one without.",
          fix: "Order fields without defaults first.",
        },
        {
          mistake: "Expecting the type annotations to be enforced.",
          fix: "They are hints; validate in __post_init__ if you need checks.",
        },
        {
          mistake: "Mutating a frozen dataclass.",
          fix: "Create a changed copy with dataclasses.replace.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A settings record",
      scenario:
        "An application reads host, port and debug settings and passes them around as one value.",
      body: [
        "`@dataclass(frozen=True) class Settings: host: str; port: int = 8000; debug: bool = False` gives a readable, immutable record with sensible defaults.",
        "`replace(settings, port=9000)` produces a variant for a test without touching the original.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "dc-eq",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "from dataclasses import dataclass\n\n@dataclass\nclass P:\n    x: int\n    y: int = 0\n\nprint(P(1) == P(1, 0))",
      },
      options: ["True", "False", "A TypeError"],
      answer: 0,
      explanation:
        "The generated __eq__ compares the fields, which are equal.",
    },
    {
      type: "output",
      id: "dc-repr",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "from dataclasses import dataclass\n\n@dataclass\nclass P:\n    x: int\n    y: int = 0\n\nprint(P(1))",
      },
      options: ["P(x=1, y=0)", "<P object>", "P(1)"],
      answer: 0,
      explanation:
        "The generated __repr__ lists the field names and values.",
    },
    {
      type: "single",
      id: "mutable-default",
      prompt: "How do you give a dataclass field a new empty list per instance?",
      options: [
        "field(default_factory=list)",
        "tags: list = []",
        "tags: list = list",
      ],
      answer: 0,
      explanation:
        "A plain list default is rejected; default_factory creates a fresh list per instance.",
    },
    {
      type: "truefalse",
      id: "frozen-assign",
      statement: "Assigning to a field of a frozen dataclass instance raises an error.",
      answer: true,
      explanation:
        "frozen=True makes instances immutable and raises FrozenInstanceError on assignment.",
    },
  ],
  assignment: {
    title: "Order lines",
    task: [
      "Create a frozen dataclass Product (name, price) and a dataclass OrderLine (product, quantity=1) with a method total().",
      "Create a dataclass Order with a list of lines (default_factory), a method total(), and show asdict output and a replace call.",
    ],
    checklist: [
      "A frozen dataclass is used for Product",
      "The lines list uses default_factory",
      "total() sums the lines correctly",
      "asdict and replace are both demonstrated",
    ],
    hints: ["`sum(line.total() for line in self.lines)` is a compact total."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "point-dataclass",
      title: "A point",
      task: [
        "Write a frozen, ordered dataclass Point with int fields x and y. Add a method dist2() that returns x*x + y*y. Point(1, 2) < Point(1, 3) is True.",
      ],
      language: "python",
      starter: "from dataclasses import dataclass\n\nclass Point:\n    pass",
      solution:
        "from dataclasses import dataclass\n\n@dataclass(frozen=True, order=True)\nclass Point:\n    x: int\n    y: int\n\n    def dist2(self):\n        return self.x * self.x + self.y * self.y",
      hints: ["Pass frozen=True and order=True to @dataclass."],
      checklist: [
        "Point(1, 2) < Point(1, 3) is True",
        "Point(1, 2).dist2() is 5",
        "Assigning to a field raises an error",
      ],
    },
  ],
  revisionNotes: [
    "@dataclass generates __init__, __repr__ and __eq__ from annotated fields",
    "Mutable defaults need field(default_factory=...)",
    "frozen=True is read-only and hashable; order=True adds comparisons",
    "__post_init__, asdict and replace",
  ],
  resources: [
    {
      label: "dataclasses: Data classes",
      url: "https://docs.python.org/3/library/dataclasses.html",
    },
  ],
})
