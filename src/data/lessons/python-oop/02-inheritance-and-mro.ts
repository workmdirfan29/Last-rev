import { defineLesson } from "@/data/lessons/author"

export default defineLesson("python-oop", {
  slug: "inheritance-and-mro",
  title: "Inheritance, super() and the MRO",
  topic: "Inheritance & MRO",
  minutes: 70,
  overview:
    "Reuse and specialise behaviour with inheritance, call parents with super(), understand multiple inheritance and the method resolution order, and use abstract base classes.",
  objectives: [
    "Create a subclass and override methods",
    "Use super() to extend, not replace, parent behaviour",
    "Read a class's __mro__ and predict which method runs",
    "Define an abstract base class and prefer composition when it fits",
  ],
  prerequisites: ["lesson.python-oop.classes"],
  sections: [
    {
      kind: "explain",
      heading: "Subclassing",
      body: [
        "A subclass is declared with the parent in parentheses: `class Kid(Base):`. It **inherits** every attribute and method of the parent and can **override** any of them by defining its own. `isinstance(obj, Base)` is true for instances of subclasses, and `issubclass(Kid, Base)` tests the relationship between classes.",
        "Inheritance models an 'is a' relationship: a `Dog` is an `Animal`. If the relationship is 'has a', for example a `Car` has an `Engine`, hold the other object as an attribute instead. This is **composition**, and it is often simpler and more flexible than a deep class tree.",
      ],
    },
    {
      kind: "code",
      heading: "super() in a constructor",
      example: {
        title: "Extending __init__",
        language: "python",
        code: "class Base:\n    def __init__(self):\n        self.v = \"base\"\n\nclass Kid(Base):\n    def __init__(self):\n        super().__init__()\n        self.w = \"kid\"\n\nprint(vars(Kid()))",
        walkthrough: [
          "If a subclass defines `__init__` and does not call the parent's, the parent's setup never runs and its attributes are missing.",
          "`super().__init__()` calls the next implementation in the method resolution order, here `Base.__init__`, which sets `v`. Then `Kid` sets `w`.",
          "`vars(obj)` shows the instance's attributes: `{'v': 'base', 'w': 'kid'}`.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Multiple inheritance and the MRO",
      example: {
        title: "The diamond",
        language: "python",
        code: "class A:\n    def hello(self):\n        return \"A\"\n\nclass B(A):\n    def hello(self):\n        return \"B>\" + super().hello()\n\nclass C(A):\n    def hello(self):\n        return \"C>\" + super().hello()\n\nclass D(B, C):\n    def hello(self):\n        return \"D>\" + super().hello()\n\nprint(D().hello())\nprint([k.__name__ for k in D.__mro__])\nprint(issubclass(D, A), isinstance(D(), C))",
        walkthrough: [
          "A class can have several parents: `class D(B, C)`. When a method is called, Python searches the classes in the **method resolution order (MRO)**, which you can see in `D.__mro__`.",
          "The MRO is computed with C3 linearisation. It keeps each class before its parents and respects the left-to-right order of the bases, so for `D` it is `D, B, C, A, object`.",
          "`super()` does not mean 'the parent'; it means 'the next class in the MRO'. So `B`'s `super().hello()` calls `C.hello`, not `A.hello`. The chain is `D>B>C>A`.",
          "Every class ends with `object`. Because each method here uses `super()`, each class in the diamond runs exactly once.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Abstract base classes",
      example: {
        title: "Forcing subclasses to implement a method",
        language: "python",
        code: "from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        ...\n\ntry:\n    Shape()\nexcept TypeError as e:\n    print(\"TypeError:\", e)\n\nclass Square(Shape):\n    def __init__(self, n):\n        self.n = n\n\n    def area(self):\n        return self.n ** 2\n\nprint(Square(3).area())",
        walkthrough: [
          "A class that inherits from `ABC` and has an `@abstractmethod` cannot be instantiated. Trying to do so raises a `TypeError` naming the missing method.",
          "A subclass becomes concrete once it implements all the abstract methods, as `Square` does with `area`.",
          "Abstract base classes document a contract: 'anything that is a Shape has an area'.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Overriding __init__ without calling super().__init__().",
          fix: "Call super().__init__(...) so the parent initialises its part.",
        },
        {
          mistake: "Using inheritance only to reuse code, such as a Stack inheriting from list.",
          fix: "Use composition when the relationship is not truly 'is a'.",
        },
        {
          mistake: "Assuming super() is always the direct parent.",
          fix: "It is the next class in the MRO; check __mro__ in multiple inheritance.",
        },
        {
          mistake: "Building deep hierarchies.",
          fix: "Keep hierarchies shallow and prefer small, focused classes.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Payment methods",
      scenario:
        "A shop accepts cards and bank transfers, and each has a different fee calculation.",
      body: [
        "Define an abstract `Payment` with `fee(amount)`, and subclasses `CardPayment` and `TransferPayment` that implement it. The checkout code works with any `Payment` and never checks which kind it is.",
        "Adding a new payment type means adding a class, not editing the checkout.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "mro-chain",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "class A:\n    pass\n\nclass B(A):\n    pass\n\nclass C(A):\n    pass\n\nclass D(B, C):\n    pass\n\nprint([k.__name__ for k in D.__mro__])",
      },
      options: [
        "['D', 'B', 'C', 'A', 'object']",
        "['D', 'B', 'A', 'C', 'object']",
        "['D', 'C', 'B', 'A', 'object']",
      ],
      answer: 0,
      explanation:
        "C3 keeps the left-to-right base order and puts A after both B and C.",
    },
    {
      type: "output",
      id: "super-init-vars",
      prompt: "What does this print?",
      code: {
        language: "python",
        code: "class Base:\n    def __init__(self):\n        self.v = \"base\"\n\nclass Kid(Base):\n    def __init__(self):\n        super().__init__()\n        self.w = \"kid\"\n\nprint(vars(Kid()))",
      },
      options: [
        "{'v': 'base', 'w': 'kid'}",
        "{'w': 'kid'}",
        "{'v': 'base'}",
      ],
      answer: 0,
      explanation:
        "super().__init__() runs the parent initialiser, so both attributes exist.",
    },
    {
      type: "single",
      id: "abstract-instantiate",
      prompt: "What happens when you instantiate a class that still has an abstract method?",
      options: ["TypeError", "The abstract method returns None", "It works but warns"],
      answer: 0,
      explanation:
        "Python refuses to create instances of classes with unimplemented abstract methods.",
    },
    {
      type: "truefalse",
      id: "has-a",
      statement: "A Car that holds an Engine object is better modelled with composition than with a Car subclass of Engine.",
      answer: true,
      explanation:
        "A car is not an engine. 'Has a' relationships are modelled by holding the object as an attribute.",
    },
  ],
  assignment: {
    title: "A small hierarchy",
    task: [
      "Create an abstract Employee with name and an abstract pay() method, and two subclasses (Salaried and Hourly) that compute pay differently.",
      "Write a function that takes a list of employees and prints each name with its pay, and print the MRO of one subclass.",
    ],
    checklist: [
      "Employee cannot be instantiated",
      "Subclasses call super().__init__",
      "The report function works for any employee type",
      "The MRO is printed and explained",
    ],
    hints: ["Use `from abc import ABC, abstractmethod`."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "animal-sounds",
      title: "Override and extend",
      task: [
        "Write Animal(name) with speak() returning '<name> makes a sound'. Write Dog(Animal) whose speak() returns the parent's text followed by ' - woof'. Dog('Rex').speak() is 'Rex makes a sound - woof'.",
      ],
      language: "python",
      starter: "class Animal:\n    pass\n\nclass Dog(Animal):\n    pass",
      solution:
        "class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f'{self.name} makes a sound'\n\nclass Dog(Animal):\n    def speak(self):\n        return super().speak() + ' - woof'",
      hints: ["Call super().speak() and add to its result."],
      checklist: [
        "Dog('Rex').speak() is 'Rex makes a sound - woof'",
        "Dog does not repeat the Animal code",
        "isinstance(Dog('x'), Animal) is True",
      ],
    },
  ],
  revisionNotes: [
    "Subclass inherits and overrides; isinstance and issubclass follow inheritance",
    "super() means the next class in the MRO; call super().__init__()",
    "D.__mro__ shows the search order (C3): bases keep their left-to-right order",
    "ABC with @abstractmethod prevents instantiation; prefer composition for 'has a'",
  ],
  resources: [
    {
      label: "The Python Tutorial: Inheritance",
      url: "https://docs.python.org/3/tutorial/classes.html#inheritance",
    },
    {
      label: "Python 2.3 Method Resolution Order",
      url: "https://docs.python.org/3/howto/mro.html",
    },
    {
      label: "abc: Abstract base classes",
      url: "https://docs.python.org/3/library/abc.html",
    },
  ],
})
