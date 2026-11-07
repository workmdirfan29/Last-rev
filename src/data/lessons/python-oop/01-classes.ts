import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-oop", {
  slug: "classes",
  title: "Classes, objects and methods",
  topic: "Classes",
  minutes: 60,
  overview:
    "Define classes with __init__, instance and class attributes, instance, class and static methods, and readable __repr__ and __str__ output.",
  objectives: [
    "Define a class and create objects from it",
    "Tell instance attributes and class attributes apart",
    "Use instance methods, @classmethod and @staticmethod",
    "Write __repr__ and __str__ for readable output",
  ],
  prerequisites: ["python-fundamentals"],
  sections: [
    {
      kind: "explain",
      heading: "Classes and objects",
      body: [
        "A **class** is a blueprint; an **object** (instance) is one thing built from it. `class Dog:` defines a class, and `Dog(\"Rex\")` creates an instance. Everything in Python is an object, and a class is itself an object whose type is `type`.",
        "`__init__(self, ...)` is the **initializer**: it runs when the object is created and usually sets **instance attributes** with `self.name = name`. `self` is the instance the method was called on; Python passes it automatically, but you must list it as the first parameter.",
        "An attribute assigned inside a class body, outside any method, is a **class attribute** shared by all instances. Assigning `d.species = \"wolf\"` on an instance creates an instance attribute that shadows the class attribute for that object only.",
      ],
    },
    {
      kind: "code",
      heading: "A first class",
      example: {
        title: "Dog",
        language: "python",
        code: "class Dog:\n    species = \"canine\"\n\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f\"{self.name} says woof\"\n\n    def __repr__(self):\n        return f\"Dog({self.name!r})\"\n\n    def __str__(self):\n        return f\"Dog named {self.name}\"\n\nd = Dog(\"Rex\")\nprint(d.speak(), d.species, Dog.species)\nprint(repr(d))\nprint(d)\nd.species = \"wolf\"\nprint(d.species, Dog.species, Dog(\"Y\").species)\nprint(isinstance(d, Dog), type(d).__name__)",
        walkthrough: [
          "`d.speak()` is the same as `Dog.speak(d)`: the instance becomes `self`. The class attribute `species` is readable through the instance or the class.",
          "`__repr__` should be an unambiguous representation for developers, ideally looking like the code that builds the object: `Dog('Rex')`. `__str__` is the friendly text used by `print` and `str()`. If only `__repr__` exists it is used for both.",
          "After `d.species = \"wolf\"`, only `d` has its own value; `Dog.species` and other instances still show `canine`.",
          "`isinstance(d, Dog)` is `True` and `type(d).__name__` is `Dog`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Three kinds of method",
      example: {
        title: "Instance, class and static methods",
        language: "python",
        code: "class Counter:\n    count = 0\n\n    def __init__(self):\n        Counter.count += 1\n\n    @classmethod\n    def made(cls):\n        return cls.count\n\n    @staticmethod\n    def helper(x):\n        return x * 2\n\nCounter()\nCounter()\nprint(Counter.made(), Counter.helper(4))",
        walkthrough: [
          "An **instance method** takes `self` and works on one object.",
          "A **class method** (`@classmethod`) takes the class as `cls`. It suits alternative constructors and data shared by the class, such as `count`.",
          "A **static method** (`@staticmethod`) takes neither `self` nor `cls`; it is a plain function placed in the class for organisation.",
          "Two objects were created, so `Counter.made()` is `2`, and `helper(4)` is `8`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Naming and privacy",
      body: [
        "Python has no enforced private attributes. By convention a single leading underscore, `_balance`, means 'internal, do not rely on it'. A double leading underscore, `__secret`, triggers **name mangling**: the attribute is stored as `_ClassName__secret` to avoid accidental clashes in subclasses; it is not real security.",
        "Without your own `__eq__`, two separate objects with the same data are **not equal**: `NoEq(1) == NoEq(1)` is `False`, because the default compares identity. Without `__repr__` you get something like `<__main__.NoRepr object at 0x...>`.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Forgetting self in a method definition or when using an attribute.",
          fix: "List self first, and write self.name to reach instance data.",
        },
        {
          mistake: "Putting a mutable value such as a list in a class attribute and expecting one per object.",
          fix: "Create it in __init__ so each instance gets its own.",
        },
        {
          mistake: "Assuming a double underscore makes an attribute private.",
          fix: "It only mangles the name; rely on conventions and documentation.",
        },
        {
          mistake: "No __repr__, making debugging output unreadable.",
          fix: "Add a __repr__ that shows the important fields.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A bank account",
      scenario:
        "You model an account with an owner, a balance, deposit and withdraw operations.",
      body: [
        "`__init__(self, owner, balance=0)` stores the state. `deposit` and `withdraw` change `self.balance`, and `withdraw` raises `ValueError` if the amount is more than the balance.",
        "A `__repr__` such as `Account('Ana', 120)` makes test failures and logs easy to read, and a class method `from_dict` can build an account from stored data.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "class-attr-shadow",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "class Dog:\n    species = \"canine\"\n\nd = Dog()\nd.species = \"wolf\"\nprint(d.species, Dog.species)",
      },
      options: ["wolf canine", "wolf wolf", "canine canine"],
      answer: 0,
      explanation:
        "Assigning through the instance creates an instance attribute and leaves the class attribute alone.",
    },
    {
      type: "output",
      id: "default-eq",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "class NoEq:\n    def __init__(self, x):\n        self.x = x\n\nprint(NoEq(1) == NoEq(1))",
      },
      options: ["False", "True", "A TypeError"],
      answer: 0,
      explanation:
        "Without __eq__, objects compare by identity, and these are two different objects.",
    },
    {
      type: "single",
      id: "classmethod-first-arg",
      prompt: "What is the first parameter of a @classmethod?",
      options: ["cls, the class", "self, the instance", "Nothing"],
      answer: 0,
      explanation:
        "A class method receives the class itself, conventionally named cls.",
    },
    {
      type: "truefalse",
      id: "repr-vs-str",
      statement: "__repr__ is meant for developers, while __str__ is meant for readable output to users.",
      answer: true,
      explanation:
        "print uses __str__ and falls back to __repr__ when __str__ is missing.",
    },
  ],
  assignment: {
    title: "Model a library book",
    task: [
      "Write a Book class with title, author and a borrowed flag, methods borrow() and give_back() that raise ValueError on invalid use, a class attribute counting books, and a class method from_string('Title|Author').",
      "Add __repr__ and __str__ and write a short script that creates three books and prints them.",
    ],
    checklist: [
      "State is set in __init__ with instance attributes",
      "Invalid borrow or return raises ValueError",
      "A class method builds a Book from a string",
      "__repr__ and __str__ give different, useful output",
    ],
    hints: ["`title, author = text.split('|')` unpacks the pieces."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "rectangle-class",
      title: "Rectangle",
      task: [
        "Write a class Rectangle(width, height) with a method area() and a method scale(factor) that multiplies both sides in place. Add __repr__ so Rectangle(2, 3) shows as 'Rectangle(2, 3)'.",
      ],
      language: "python",
      starter: "class Rectangle:\n    pass",
      solution:
        "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n    def scale(self, factor):\n        self.width *= factor\n        self.height *= factor\n\n    def __repr__(self):\n        return f'Rectangle({self.width}, {self.height})'",
      hints: ["Store the sides on self in __init__."],
      checklist: [
        "Rectangle(2, 3).area() is 6",
        "scale changes the same object",
        "repr(Rectangle(2, 3)) is 'Rectangle(2, 3)'",
      ],
    },
  ],
  revisionNotes: [
    "__init__ sets instance attributes; self is the instance",
    "Class attributes are shared; assigning on an instance shadows them",
    "@classmethod gets cls, @staticmethod gets nothing",
    "__repr__ for developers, __str__ for readable text; default == compares identity",
  ],
  resources: [
    {
      label: "The Python Tutorial: Classes",
      url: "https://docs.python.org/3/tutorial/classes.html",
    },
    {
      label: "Data model: customizing class creation and basic customization",
      url: "https://docs.python.org/3/reference/datamodel.html#basic-customization",
    },
  ],
})
