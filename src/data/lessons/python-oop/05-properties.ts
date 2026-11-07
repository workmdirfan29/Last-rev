import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-oop", {
  slug: "properties",
  title: "Properties and attribute access",
  topic: "Properties",
  minutes: 40,
  overview:
    "Use @property for computed and validated attributes, add setters, make read-only attributes, and keep the public interface stable while the internals change.",
  objectives: [
    "Create a read-only computed attribute with @property",
    "Add a setter that validates the value",
    "Explain why Python code uses plain attributes first",
    "Use underscore names for the stored value",
  ],
  prerequisites: ["lesson.python-oop.classes"],
  sections: [
    {
      kind: "explain",
      heading: "Plain attributes first",
      body: [
        "In Python you normally begin with a simple public attribute, `account.balance`, instead of writing getter and setter methods up front. If you later need validation or a computed value, you can turn the attribute into a **property** without changing any calling code.",
        "A property looks like an attribute to the caller but runs a method. `@property` creates a **getter**; `@name.setter` adds a **setter**. The value is usually stored in an attribute with a leading underscore, such as `_c`.",
      ],
    },
    {
      kind: "code",
      heading: "Getter, setter and computed value",
      example: {
        title: "Temperature",
        language: "python",
        code: "class T:\n    def __init__(self, c):\n        self._c = c\n\n    @property\n    def c(self):\n        return self._c\n\n    @c.setter\n    def c(self, v):\n        if v < -273.15:\n            raise ValueError(\"below absolute zero\")\n        self._c = v\n\n    @property\n    def f(self):\n        return self._c * 9 / 5 + 32\n\nt = T(100)\nprint(t.c, t.f)\nt.c = 0\nprint(t.f)\ntry:\n    t.c = -300\nexcept ValueError as e:\n    print(\"ValueError:\", e)\ntry:\n    t.f = 1\nexcept AttributeError as e:\n    print(\"AttributeError:\", e)",
        walkthrough: [
          "`t.c` calls the getter and returns `100`; `t.f` is computed on every access: `212.0`.",
          "`t.c = 0` calls the setter, which checks the value before storing it. Then `t.f` is `32.0`.",
          "A value below absolute zero is rejected with `ValueError: below absolute zero`, so the object never holds an invalid state.",
          "`f` has no setter, so it is **read-only**. Assigning raises `AttributeError`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Design notes",
      body: [
        "Keep getters cheap and free of surprising side effects; callers treat them as plain attribute reads. If an operation is expensive or changes state, make it a method.",
        "In `__init__`, assign through the public name (`self.c = c`) if you want validation to run on creation too.",
        "Related tools: `functools.cached_property` computes a value once and stores it; `__slots__` fixes the attributes an instance can have; and `__getattr__` and `__setattr__` customise access in general. Properties are the simplest tool and cover most needs.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Writing get_x() and set_x() methods by habit from other languages.",
          fix: "Use a plain attribute and switch to a property only when you need logic.",
        },
        {
          mistake: "Using the same name for the property and the stored value, causing infinite recursion.",
          fix: "Store the value as _name and expose name as the property.",
        },
        {
          mistake: "Doing slow work in a property getter.",
          fix: "Use a method, or cache the result with functools.cached_property.",
        },
        {
          mistake: "Forgetting the setter and being surprised by AttributeError.",
          fix: "Add @name.setter if assignment should be allowed.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A validated email field",
      scenario:
        "A User class must never hold an email without an @ sign.",
      body: [
        "Store `_email` and expose `email` as a property. The setter strips and lower-cases the text and raises `ValueError` if there is no `@`.",
        "Code that already wrote `user.email = value` keeps working and now gets the validation.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "prop-computed",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "class T:\n    def __init__(self, c):\n        self._c = c\n\n    @property\n    def f(self):\n        return self._c * 9 / 5 + 32\n\nprint(T(100).f)",
      },
      options: ["212.0", "212", "100"],
      answer: 0,
      explanation:
        "The property runs on access; 100 * 9 / 5 + 32 is 212.0 (true division gives a float).",
    },
    {
      type: "output",
      id: "prop-readonly",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "class T:\n    def __init__(self, c):\n        self._c = c\n\n    @property\n    def f(self):\n        return self._c\n\ntry:\n    T(1).f = 5\nexcept AttributeError:\n    print(\"read-only\")",
      },
      options: ["read-only", "Nothing", "5"],
      answer: 0,
      explanation:
        "A property without a setter cannot be assigned to, which raises AttributeError.",
    },
    {
      type: "single",
      id: "start-simple",
      prompt: "In Python, what is the usual first step for an attribute that may later need validation?",
      options: [
        "Use a plain public attribute and add a property later if needed",
        "Always write get_ and set_ methods",
        "Make it a static method",
      ],
      answer: 0,
      explanation:
        "A property can replace a plain attribute without changing the calling code.",
    },
    {
      type: "truefalse",
      id: "prop-cheap",
      statement: "A property getter should usually be cheap and free of surprising side effects.",
      answer: true,
      explanation:
        "Callers expect attribute reads to be cheap and safe.",
    },
  ],
  assignment: {
    title: "A validated Person",
    task: [
      "Write a Person class with a name property (non-empty after stripping), an age property (0 to 150) and a read-only is_adult property.",
      "Show a valid object, each validation error and the read-only error.",
    ],
    checklist: [
      "Stored values use underscore names",
      "Both setters raise ValueError on invalid input",
      "Validation also runs on creation",
      "is_adult has no setter",
    ],
    hints: ["Assign to self.age in __init__ so the setter runs."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "circle-radius",
      title: "Circle",
      task: [
        "Write class Circle(radius) with a radius property that rejects negative values with ValueError, and a read-only property diameter equal to twice the radius.",
      ],
      language: "python",
      starter: "class Circle:\n    pass",
      solution:
        "class Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    @property\n    def radius(self):\n        return self._radius\n\n    @radius.setter\n    def radius(self, value):\n        if value < 0:\n            raise ValueError('radius must not be negative')\n        self._radius = value\n\n    @property\n    def diameter(self):\n        return self._radius * 2",
      hints: ["Assign through self.radius in __init__ so validation runs."],
      checklist: [
        "Circle(2).diameter is 4",
        "Circle(-1) raises ValueError",
        "Setting diameter raises AttributeError",
      ],
    },
  ],
  revisionNotes: [
    "Start with plain attributes; add @property when logic is needed",
    "@property getter, @name.setter setter; no setter means read-only",
    "Store the value in _name; validate in the setter",
    "Keep getters cheap; use a method for expensive work",
  ],
  resources: [
    {
      label: "Built-in functions: property",
      url: "https://docs.python.org/3/library/functions.html#property",
    },
    {
      label: "Descriptor HowTo Guide",
      url: "https://docs.python.org/3/howto/descriptor.html",
    },
  ],
})
