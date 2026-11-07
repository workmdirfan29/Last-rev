import { defineQuestions } from "../author"
import { q } from "../compact"

const D = "https://docs.python.org/3"
const PEP = "https://peps.python.org"

export default defineQuestions("python-oop", "fresher", [
  q({
    slug: "classes-objects-init-self",
    topic: "Classes",
    d: "easy",
    title: "What are a class, an object, `__init__` and `self` in Python?",
    kw: ["class", "object", "__init__", "self", "instance"],
    intent: "Checks the basic vocabulary of OOP in Python.",
    short:
      "A class is a blueprint that defines attributes and methods; an object (instance) is a concrete thing created from it by calling the class: `acct = Account('Asha')`. `__init__` is the initialiser that runs right after the instance is created and sets its starting state. `self` is the conventional name of the first parameter of an instance method; Python passes the instance there automatically, so `acct.deposit(50)` calls `Account.deposit(acct, 50)`. `self` is not a keyword, but you should always use that name. Attributes assigned on `self` belong to that instance.",
    detail: [
      "`__init__` should return `None` and not create the object itself; that is `__new__`.",
      "Instance attributes are stored in the instance's `__dict__` by default.",
      "Everything in Python, including classes, is an object.",
    ],
    ex: "A `BankAccount` class gives each account its own owner and balance.",
    code: [
      [
        "A simple class",
        "python",
        `class Account:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n\nacct = Account("Asha")\nacct.deposit(50)\nprint(acct.balance)  # 50`,
        [
          "`__init__` sets the state.",
          "`self` is the instance the method works on.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting self in a method signature.",
      "Assigning state to the class instead of self.",
    ],
    follow: ["What does Python pass as the first argument of a method?"],
    points: [
      "Class is a blueprint",
      "Instance holds state",
      "__init__ initialises",
      "self is the instance",
    ],
    notes: ["Blueprint and thing built from it."],
    src: [
      ["Python tutorial: Classes", `${D}/tutorial/classes.html`],
      [
        "Python: Data model (customizing class creation)",
        `${D}/reference/datamodel.html`,
      ],
    ],
  }),
  q({
    slug: "class-vs-instance-attributes",
    topic: "Classes",
    d: "medium",
    title:
      "What is the difference between class attributes and instance attributes?",
    kw: [
      "class attribute",
      "instance attribute",
      "shared state",
      "attribute lookup",
      "mutable class attribute",
    ],
    intent: "Checks attribute lookup and the shared-state trap.",
    short:
      "A class attribute is defined in the class body and shared by all instances; an instance attribute is set on `self` and belongs to one object. Attribute lookup checks the instance first and then the class (and its bases). Assigning `obj.count = 1` creates an instance attribute that shadows the class one without changing it. The risk is a mutable class attribute such as `items = []`: every instance appends to the same list, which the Python tutorial warns about. Put per-object data in `__init__`, and use class attributes for constants and shared defaults that are immutable.",
    detail: [
      "To change a class attribute use `ClassName.attr = value`.",
      "`vars(obj)` shows the instance attributes.",
      "Class attributes are good for constants such as `MAX_SIZE = 10`.",
    ],
    ex: "A `Cart` with `items = []` at class level makes all carts share one list.",
    code: [
      [
        "Shared list bug",
        "python",
        `class Cart:\n    items = []             # shared!\n    def add(self, x):\n        self.items.append(x)\n\na, b = Cart(), Cart()\na.add("pen")\nprint(b.items)   # ['pen']  (surprise)\n\nclass Fixed:\n    def __init__(self):\n        self.items = []`,
        [
          "The class-level list belongs to the class.",
          "Create it in `__init__` instead.",
        ],
      ],
    ],
    mistakes: [
      "Mutable class attributes as defaults.",
      "Assigning through an instance expecting to change the class.",
    ],
    follow: ["How does Python look up an attribute?"],
    points: [
      "Class attrs are shared",
      "Instance attrs are per object",
      "Lookup: instance then class",
      "Avoid mutable class attributes",
    ],
    notes: ["Per-object state goes in __init__."],
    src: [
      [
        "Python tutorial: Class and instance variables",
        `${D}/tutorial/classes.html`,
      ],
      [
        "Python: Data model (attribute access)",
        `${D}/reference/datamodel.html`,
      ],
    ],
  }),
  q({
    slug: "instance-class-and-static-methods",
    topic: "Classes",
    d: "medium",
    title:
      "What are the differences between instance methods, `@classmethod` and `@staticmethod`?",
    kw: [
      "classmethod",
      "staticmethod",
      "instance method",
      "alternative constructor",
      "cls",
    ],
    intent: "A staple question about method types.",
    short:
      "An instance method receives the instance as `self` and can use instance state. A `@classmethod` receives the class as `cls`; it is used for alternative constructors, like `Date.from_string('2026-11-04')`, and works correctly with subclasses because `cls` is whichever class was called. A `@staticmethod` receives neither: it is a plain function placed in the class namespace for organisation and cannot see instance or class state. Choose a static method only when the function relates to the class logically but needs none of its data; otherwise a module-level function is often simpler.",
    detail: [
      "Class methods can be called on the class or an instance.",
      "Returning `cls(...)` instead of the class name keeps inheritance working.",
      "Static methods are rarely necessary in Python.",
    ],
    ex: "`User.from_json(text)` builds a `User` from a JSON string.",
    code: [
      [
        "Three kinds",
        "python",
        `class Temp:\n    def __init__(self, c):\n        self.c = c\n    def to_f(self):                 # instance\n        return self.c * 9 / 5 + 32\n    @classmethod\n    def from_f(cls, f):             # alternative constructor\n        return cls((f - 32) * 5 / 9)\n    @staticmethod\n    def is_valid(c):                # utility\n        return c >= -273.15\n\nprint(Temp.from_f(212).c)  # 100.0`,
        [
          "`from_f` returns an instance via `cls`.",
          "`is_valid` uses no state.",
        ],
      ],
    ],
    mistakes: [
      "Hard-coding the class name in a classmethod.",
      "Using a static method when state is needed.",
    ],
    follow: ["Why use cls instead of the class name?"],
    points: [
      "Instance method gets self",
      "Classmethod gets cls",
      "Staticmethod gets nothing",
      "Classmethods are alternative constructors",
    ],
    notes: ["self, cls or nothing."],
    src: [
      ["Python: classmethod", `${D}/library/functions.html`],
      [
        "Python: Data model (static and class methods)",
        `${D}/reference/datamodel.html`,
      ],
    ],
  }),
  q({
    slug: "encapsulation-and-name-mangling",
    topic: "Classes",
    d: "medium",
    title: "Does Python have private attributes? What do `_x` and `__x` mean?",
    kw: [
      "encapsulation",
      "private attribute",
      "name mangling",
      "single underscore",
      "double underscore",
    ],
    intent: "Checks understanding of convention versus enforcement.",
    short:
      "Python has no truly private attributes. A single leading underscore, `_balance`, is a convention meaning 'internal, do not rely on it'; nothing prevents access. A double leading underscore, `__balance`, triggers name mangling: inside class `Account` the name is rewritten to `_Account__balance`, which avoids accidental clashes with attributes in subclasses, not a security feature, since `obj._Account__balance` still works. Encapsulation in Python relies on convention, properties for controlled access and clear public APIs. Names with double underscores at both ends are reserved for special methods.",
    detail: [
      "Use properties to expose validated attributes.",
      "`from module import *` skips names starting with an underscore unless `__all__` lists them.",
      "Document the public interface; treat the rest as internal.",
    ],
    ex: "A `_cache` attribute signals to other developers not to touch it.",
    mistakes: [
      "Using double underscores for privacy.",
      "Accessing underscore attributes of other classes.",
    ],
    follow: ["What does name mangling actually do?"],
    points: [
      "No true privacy",
      "_x is a convention",
      "__x is mangled to _Class__x",
      "Use properties for control",
    ],
    notes: ["We are all consenting adults."],
    src: [
      ["Python tutorial: Private variables", `${D}/tutorial/classes.html`],
      ["PEP 8: Designing for inheritance", `${PEP}/pep-0008/`],
    ],
  }),
  q({
    slug: "inheritance-super-basics",
    topic: "Inheritance & MRO",
    d: "easy",
    title: "How does inheritance work in Python, and what does `super()` do?",
    kw: ["inheritance", "super", "subclass", "method overriding", "base class"],
    intent: "Checks core inheritance mechanics.",
    short:
      "A subclass is declared `class Dog(Animal):` and inherits the attributes and methods of its base class, adding or overriding behaviour. Overriding means defining a method with the same name in the subclass. `super()` returns a proxy that delegates to the next class in the method resolution order, so `super().__init__(name)` runs the parent's initialiser without naming it, and `super().speak()` extends rather than replaces a parent method. If a subclass defines `__init__` and forgets to call `super().__init__`, the parent's setup does not run.",
    detail: [
      "Use inheritance for 'is-a' relationships.",
      "Every class inherits from `object` in Python 3.",
      "`isinstance(dog, Animal)` is True for a subclass instance.",
    ],
    ex: "`SavingsAccount(Account)` adds interest but reuses deposit and withdrawal logic.",
    code: [
      [
        "Subclass with super",
        "python",
        `class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed\n    def speak(self):\n        return super().speak() + " Woof"\n\nprint(Dog("Rex", "Lab").speak())  # ... Woof`,
        [
          "`super()` reaches the parent.",
          "The override extends the parent's result.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting super().__init__().",
      "Inheriting just to reuse code when no is-a relation exists.",
    ],
    follow: ["When would you avoid inheritance?"],
    points: [
      "Subclass inherits and overrides",
      "super() delegates up the MRO",
      "Call super().__init__",
      "Use for is-a relationships",
    ],
    notes: ["Reuse and specialise."],
    src: [
      ["Python tutorial: Inheritance", `${D}/tutorial/classes.html`],
      ["Python: super()", `${D}/library/functions.html`],
    ],
  }),
  q({
    slug: "method-resolution-order-c3",
    topic: "Inheritance & MRO",
    d: "hard",
    title: "What is the method resolution order (MRO), and how is it computed?",
    kw: [
      "mro",
      "c3 linearization",
      "diamond problem",
      "__mro__",
      "multiple inheritance",
    ],
    intent: "A core multiple-inheritance question.",
    short:
      "The MRO is the order in which Python searches a class and its bases for an attribute or method. It is computed with the C3 linearization algorithm, which guarantees that a class comes before its bases, that the order of bases listed in the class statement is preserved, and that the order is consistent for subclasses. In the diamond case `D(B, C)` where both inherit from `A`, the MRO is D, B, C, A: A is visited once, after both of its children. Inspect it with `D.__mro__` or `D.mro()`. If no consistent order exists, Python raises `TypeError` when the class is defined.",
    detail: [
      "`super()` follows the MRO of the instance's class, not simply the parent of the current class.",
      "Bases with conflicting orders cannot be combined.",
      "The Python 2.3 MRO write-up explains the algorithm.",
    ],
    ex: "In a diamond hierarchy each class's `__init__` runs once when all of them call `super().__init__()`.",
    code: [
      [
        "Diamond",
        "python",
        `class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\n\nprint([k.__name__ for k in D.__mro__])\n# ['D', 'B', 'C', 'A', 'object']`,
        ["`A` appears once, after both B and C.", "`object` is always last."],
      ],
    ],
    mistakes: [
      "Assuming a depth-first search order.",
      "Ignoring MRO conflicts when mixing bases.",
    ],
    follow: ["How does super() use the MRO?"],
    points: [
      "MRO is the lookup order",
      "C3 linearization",
      "Bases before parents, order preserved",
      "Inspect with __mro__",
    ],
    notes: ["Children first, order kept."],
    src: [
      ["Python: The Python 2.3 method resolution order", `${D}/howto/mro.html`],
      ["Python: Data model (class hierarchy)", `${D}/reference/datamodel.html`],
    ],
  }),
  q({
    slug: "cooperative-super-multiple-inheritance",
    topic: "Inheritance & MRO",
    d: "hard",
    title:
      "How does `super()` behave in multiple inheritance, and how do you write cooperative classes?",
    kw: [
      "cooperative inheritance",
      "super mro",
      "mixin __init__",
      "kwargs forwarding",
      "diamond init",
    ],
    intent: "Checks deeper understanding of super.",
    short:
      "`super()` does not mean 'my parent'. It means 'the next class after the current one in the instance's MRO', which may be a sibling. Classes in a multiple-inheritance hierarchy cooperate when every method calls `super()` to pass control along, so each implementation runs exactly once in MRO order. Because the next class is not known in advance, cooperative `__init__` methods usually accept and forward `**kwargs` to `super().__init__(**kwargs)`. Calling parent classes directly by name, such as `A.__init__(self)`, can run a shared base class twice or skip classes in diamonds.",
    detail: [
      "All classes in the chain must follow the same convention.",
      "The last class in the chain, usually `object`, should not receive unexpected keyword arguments.",
      "Prefer composition if cooperation gets hard to follow.",
    ],
    ex: "Two mixins add logging and validation, each calling `super().save()` to continue the chain.",
    code: [
      [
        "Cooperative init",
        "python",
        `class Base:\n    def __init__(self, **kw):\n        super().__init__(**kw)\n\nclass Named(Base):\n    def __init__(self, name, **kw):\n        super().__init__(**kw)\n        self.name = name\n\nclass Aged(Base):\n    def __init__(self, age, **kw):\n        super().__init__(**kw)\n        self.age = age\n\nclass Person(Named, Aged): pass\np = Person(name="Asha", age=30)\nprint(p.name, p.age)`,
        [
          "Each `__init__` takes its own argument.",
          "Remaining keywords go to the next class in the MRO.",
        ],
      ],
    ],
    mistakes: [
      "Calling base classes by name in diamonds.",
      "Not forwarding unknown keyword arguments.",
    ],
    follow: ["What does super() return in a diamond?"],
    points: [
      "super() is next in MRO",
      "Every class calls super()",
      "Forward **kwargs",
      "Avoid direct base calls in diamonds",
    ],
    notes: ["Pass control along the chain."],
    src: [
      ["Python: super()", `${D}/library/functions.html`],
      ["Python: The Python 2.3 method resolution order", `${D}/howto/mro.html`],
    ],
  }),
  q({
    slug: "composition-vs-inheritance",
    topic: "Inheritance & MRO",
    d: "medium",
    title: "When should you prefer composition over inheritance?",
    kw: ["composition", "inheritance", "has-a", "is-a", "design"],
    intent: "Checks design judgement.",
    short:
      "Inheritance models an 'is-a' relationship and ties the subclass tightly to its base class: changes in the base can break subclasses, and the subclass inherits everything, including methods that do not fit. Composition models 'has-a': a class holds other objects and delegates work to them, such as a `Car` that has an `Engine`. Prefer composition when you just want to reuse behaviour, when relationships may change at run time, or when the hierarchy would become deep. Use inheritance for true specialisation, where subclasses can substitute for the base class. In Python, duck typing makes composition with small collaborators especially easy.",
    detail: [
      "Delegation can be explicit methods or `__getattr__`.",
      "A deep hierarchy is a warning sign.",
      "Test composed parts separately with simple fakes.",
    ],
    ex: "A `Report` holds a formatter object (PDF or HTML) instead of subclassing for each format.",
    mistakes: [
      "Subclassing only to reuse a few methods.",
      "Deep inheritance chains.",
    ],
    follow: ["What is the is-a test?"],
    points: [
      "Inheritance is is-a",
      "Composition is has-a",
      "Prefer composition for reuse",
      "Inherit for true specialisation",
    ],
    notes: ["Has-a over is-a for reuse."],
    src: [
      ["Python tutorial: Classes", `${D}/tutorial/classes.html`],
      ["Python: Data model", `${D}/reference/datamodel.html`],
    ],
  }),
  q({
    slug: "isinstance-issubclass-type",
    topic: "Inheritance & MRO",
    d: "easy",
    title:
      "What is the difference between `type()`, `isinstance()` and `issubclass()`?",
    kw: [
      "isinstance",
      "issubclass",
      "type check",
      "polymorphism",
      "exact type",
    ],
    intent: "Checks type-checking idioms.",
    short:
      "`type(x)` returns the exact class of an object. `isinstance(x, C)` is True if x is an instance of C or of any subclass of C, and it accepts a tuple of classes: `isinstance(v, (int, float))`. `issubclass(A, B)` tests the relationship between two classes. Prefer `isinstance` over `type(x) is C` because it respects inheritance and substitutability. Often it is better to rely on duck typing and try the operation, or to check for abstract types such as `collections.abc.Sequence`, rather than for concrete classes.",
    detail: [
      "`bool` is a subclass of `int`, so `isinstance(True, int)` is True.",
      "Too many `isinstance` checks may signal that polymorphism would be cleaner.",
      "Abstract base classes can customise `isinstance` behaviour.",
    ],
    ex: "A function accepting either a single number or a list checks `isinstance(value, (list, tuple))`.",
    mistakes: [
      "Using type(x) == C and rejecting subclasses.",
      "Forgetting that bool is an int.",
    ],
    follow: ["Why is isinstance(True, int) True?"],
    points: [
      "type gives the exact class",
      "isinstance allows subclasses",
      "Accepts a tuple of types",
      "Prefer duck typing or ABCs",
    ],
    notes: ["Instance of it or a subclass."],
    src: [
      ["Python: isinstance and issubclass", `${D}/library/functions.html`],
      ["Python: collections.abc", `${D}/library/collections.abc.html`],
    ],
  }),
  q({
    slug: "polymorphism-and-duck-typing",
    topic: "Inheritance & MRO",
    d: "easy",
    title:
      "What is polymorphism in Python, and how does duck typing relate to it?",
    kw: [
      "polymorphism",
      "duck typing",
      "method overriding",
      "interface",
      "substitutability",
    ],
    intent: "Checks the concept in a Python context.",
    short:
      "Polymorphism means calling the same operation on different kinds of objects and getting behaviour appropriate to each. In Python it works by method overriding in subclasses and, more broadly, by duck typing: code only needs an object to have the methods it calls, not to inherit from a particular class. If something has a `read()` method, any function that calls `read()` accepts it, whether it is a file, a socket wrapper or a test double. This makes code flexible and easy to test, but errors appear at run time, so use tests and optional type hints, such as protocols, to catch mismatches.",
    detail: [
      "Built-ins such as `len()` and `iter()` are polymorphic through special methods.",
      "EAFP ('easier to ask forgiveness than permission') suits duck typing: try, then catch the error.",
      "Document the behaviour an argument must support.",
    ],
    ex: "A `save(storage)` function works with any object that has a `write` method.",
    mistakes: [
      "Requiring a concrete class when only a method is needed.",
      "Skipping tests because 'it quacks'.",
    ],
    follow: ["What is EAFP?"],
    points: [
      "Same call, different behaviour",
      "Overriding and duck typing",
      "Needs methods, not a class",
      "Protocols can describe it",
    ],
    notes: ["If it quacks, it works."],
    src: [
      ["Python: Glossary - duck-typing", `${D}/glossary.html`],
      ["Python tutorial: Classes", `${D}/tutorial/classes.html`],
    ],
  }),
  q({
    slug: "abstract-base-classes",
    topic: "Classes",
    d: "medium",
    title:
      "What is an abstract base class, and how do you create one with `abc`?",
    kw: [
      "abc",
      "abstractmethod",
      "abstract class",
      "interface",
      "typeerror instantiate",
    ],
    intent: "Checks how to enforce an interface.",
    short:
      "An abstract base class defines methods that subclasses must implement. Inherit from `abc.ABC` and decorate required methods with `@abstractmethod`. Trying to instantiate a class that still has abstract methods raises `TypeError`, so a subclass must override all of them before it can be created. This documents and enforces a contract, for example a `PaymentGateway` with an abstract `charge()`. ABCs can also include concrete helper methods. Python also supports structural interfaces with protocols and plain duck typing, so use ABCs when you want explicit inheritance and enforcement.",
    detail: [
      "`collections.abc` provides ABCs such as `Iterable` and `Mapping`.",
      "An abstract method can have a default body, callable through `super()`.",
      "`register()` lets a class count as a virtual subclass without inheriting.",
    ],
    ex: "A base `Notifier` with an abstract `send()` and subclasses for email and SMS.",
    code: [
      [
        "Abstract method",
        "python",
        `from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): ...\n\nclass Square(Shape):\n    def __init__(self, s): self.s = s\n    def area(self): return self.s ** 2\n\nprint(Square(3).area())  # 9\n# Shape()  -> TypeError`,
        [
          "`Shape` cannot be instantiated.",
          "`Square` implements the contract.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to inherit from ABC, so nothing is enforced.",
      "Using ABCs where duck typing would do.",
    ],
    follow: ["What happens if a subclass skips an abstract method?"],
    points: [
      "Inherit ABC",
      "@abstractmethod marks required methods",
      "Instantiation fails until implemented",
      "collections.abc has standard ABCs",
    ],
    notes: ["A contract subclasses must fulfil."],
    src: [
      ["Python: abc", `${D}/library/abc.html`],
      ["Python: collections.abc", `${D}/library/collections.abc.html`],
    ],
  }),
  q({
    slug: "protocols-structural-typing",
    topic: "Classes",
    d: "hard",
    title:
      "What is `typing.Protocol`, and how does it differ from an abstract base class?",
    kw: [
      "protocol",
      "structural subtyping",
      "typing",
      "runtime_checkable",
      "interface",
    ],
    intent: "Checks modern type-hint knowledge.",
    short:
      "A `Protocol` describes the methods and attributes an object must have, and a type checker accepts any class that has them, without explicit inheritance. This is structural subtyping, the typed counterpart of duck typing (PEP 544). An abstract base class, by contrast, uses nominal subtyping: a class must inherit from it, or be registered. Protocols are not enforced at run time by default, so a missing method shows up in the type checker, not when you define the class; `@runtime_checkable` allows `isinstance` checks for method presence only. Use protocols for lightweight interfaces on code you do not control.",
    detail: [
      "Third-party classes satisfy your protocol without changes.",
      "Protocol classes cannot be instantiated.",
      "Type hints are checked by tools such as mypy, not by the interpreter.",
    ],
    ex: "A `SupportsClose` protocol lets a helper accept files, sockets or custom resources that have `close()`.",
    code: [
      [
        "Protocol",
        "python",
        `from typing import Protocol\n\nclass Closeable(Protocol):\n    def close(self) -> None: ...\n\ndef shutdown(resource: Closeable) -> None:\n    resource.close()\n\nclass Conn:\n    def close(self) -> None:\n        print("closed")\n\nshutdown(Conn())  # fine: Conn has close()`,
        [
          "`Conn` never inherits from `Closeable`.",
          "A type checker accepts it because the shape matches.",
        ],
      ],
    ],
    mistakes: [
      "Expecting the interpreter to enforce protocols.",
      "Using isinstance with a non-runtime-checkable protocol.",
    ],
    follow: ["How is this different from an ABC?"],
    points: [
      "Structural, not nominal",
      "No inheritance needed",
      "Checked by type checkers",
      "runtime_checkable for isinstance",
    ],
    notes: ["Typed duck typing."],
    src: [
      ["Python: typing.Protocol", `${D}/library/typing.html`],
      ["PEP 544: Protocols", `${PEP}/pep-0544/`],
    ],
  }),
  q({
    slug: "dunder-methods-overview",
    topic: "Dunder methods",
    d: "easy",
    title: "What are dunder (special) methods, and why do they matter?",
    kw: [
      "dunder methods",
      "special methods",
      "data model",
      "__len__",
      "operator overloading",
    ],
    intent: "Checks understanding of Python's data model.",
    short:
      "Dunder methods, such as `__init__`, `__repr__`, `__len__` and `__add__`, have names with double underscores on both sides. Python calls them implicitly to implement language features: `len(x)` calls `x.__len__()`, `a + b` calls `a.__add__(b)`, `for` loops use `__iter__`, `with` uses `__enter__` and `__exit__`, and `obj(...)` uses `__call__`. By implementing them your classes behave like built-in types. You normally do not call them directly; use the public function or operator instead. The full list is the Python data model.",
    detail: [
      "Names with double underscores on both sides are reserved by Python; do not invent your own.",
      "Special methods are looked up on the type, not on the instance.",
      "Implement only what makes semantic sense for the class.",
    ],
    ex: "A `Playlist` class defines `__len__` and `__getitem__` so `len(p)` and `p[0]` work.",
    mistakes: [
      "Calling x.__len__() directly.",
      "Defining special methods that behave surprisingly.",
    ],
    follow: ["Which dunder method does len() use?"],
    points: [
      "Hook into language features",
      "Called implicitly by Python",
      "Make classes act like built-ins",
      "Documented in the data model",
    ],
    notes: ["Make objects feel native."],
    src: [
      [
        "Python: Data model - special method names",
        `${D}/reference/datamodel.html`,
      ],
      ["Python tutorial: Classes", `${D}/tutorial/classes.html`],
    ],
  }),
  q({
    slug: "str-versus-repr",
    topic: "Dunder methods",
    d: "easy",
    title: "What is the difference between `__str__` and `__repr__`?",
    kw: ["__str__", "__repr__", "string representation", "debugging", "print"],
    intent: "A very common dunder question.",
    short:
      "`__repr__` returns an unambiguous, developer-oriented representation, ideally one that looks like code that could recreate the object, such as `Point(x=1, y=2)`. It is used by the REPL, debuggers, logs of containers and `repr()`. `__str__` returns a readable, user-oriented string and is used by `print()`, `str()` and f-strings. If a class defines only `__repr__`, Python falls back to it for `str()`, so implementing `__repr__` first is a good habit. Containers show the `repr` of their items.",
    detail: [
      "`!r` in an f-string forces `repr`.",
      "Dataclasses generate a `__repr__` automatically.",
      "Never include secrets in `__repr__`, since it ends up in logs.",
    ],
    ex: "`print([Point(1, 2)])` shows `[Point(x=1, y=2)]` because lists use `repr` for items.",
    code: [
      [
        "Both methods",
        "python",
        `class Point:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __repr__(self):\n        return f"Point(x={self.x}, y={self.y})"\n    def __str__(self):\n        return f"({self.x}, {self.y})"\n\np = Point(1, 2)\nprint(p)        # (1, 2)\nprint([p])      # [Point(x=1, y=2)]`,
        ["`print` uses `__str__`.", "Lists display `repr` of items."],
      ],
    ],
    mistakes: [
      "Defining only __str__, leaving debugging output useless.",
      "Putting sensitive data in __repr__.",
    ],
    follow: ["What does str() do if only __repr__ exists?"],
    points: [
      "repr is for developers",
      "str is for users",
      "str falls back to repr",
      "Containers use repr",
    ],
    notes: ["Debug view versus display view."],
    src: [
      [
        "Python: Data model (__repr__ and __str__)",
        `${D}/reference/datamodel.html`,
      ],
      ["Python: repr()", `${D}/library/functions.html`],
    ],
  }),
  q({
    slug: "comparison-methods-and-total-ordering",
    topic: "Dunder methods",
    d: "medium",
    title: "How do you make objects comparable and sortable?",
    kw: [
      "__eq__",
      "__lt__",
      "total_ordering",
      "rich comparison",
      "sorted objects",
    ],
    intent: "Checks implementing ordering for custom classes.",
    short:
      "Python uses the rich comparison methods `__eq__`, `__lt__`, `__le__`, `__gt__` and `__ge__`. `sorted()` and `list.sort()` need only `__lt__`. Defining all six is repetitive, so decorate the class with `functools.total_ordering` and define `__eq__` plus one of the ordering methods; the rest are derived. Dataclasses with `order=True` generate them from the fields. Return `NotImplemented` for unsupported operand types so Python can try the reflected operation. Often the simplest approach is to avoid ordering methods and sort with `key=`.",
    detail: [
      "Equality and hash must stay consistent when you define `__eq__`.",
      "`total_ordering` is slightly slower than hand-written methods.",
      "Compare tuples of fields to get lexicographic order.",
    ],
    ex: "Sorting `Version` objects by comparing `(major, minor, patch)` tuples.",
    code: [
      [
        "total_ordering",
        "python",
        `from functools import total_ordering\n\n@total_ordering\nclass Version:\n    def __init__(self, major, minor):\n        self.t = (major, minor)\n    def __eq__(self, other):\n        return self.t == other.t\n    def __lt__(self, other):\n        return self.t < other.t\n\nprint(Version(1, 2) <= Version(1, 3))  # True`,
        [
          "Only `__eq__` and `__lt__` are written.",
          "The decorator fills in the rest.",
        ],
      ],
    ],
    mistakes: [
      "Raising errors instead of returning NotImplemented.",
      "Defining __eq__ without thinking about __hash__.",
    ],
    follow: ["Which method does sorted() need?"],
    points: [
      "Rich comparison methods",
      "sort needs __lt__",
      "total_ordering fills gaps",
      "Return NotImplemented",
    ],
    notes: ["Define few, derive the rest."],
    src: [
      ["Python: functools.total_ordering", `${D}/library/functools.html`],
      ["Python: Data model (rich comparison)", `${D}/reference/datamodel.html`],
    ],
  }),
  q({
    slug: "operator-overloading-notimplemented",
    topic: "Dunder methods",
    d: "medium",
    title:
      "How do you overload operators such as `+` and `*`, and what is `NotImplemented`?",
    kw: [
      "operator overloading",
      "__add__",
      "__radd__",
      "NotImplemented",
      "vector class",
    ],
    intent: "Checks binary operator protocol.",
    short:
      "Implement `__add__`, `__sub__`, `__mul__` and similar methods to define how operators work for your class. For `a + b`, Python calls `a.__add__(b)`. If that method returns the special value `NotImplemented`, meaning it does not know how to handle the operand, Python tries the reflected method `b.__radd__(a)`. Return `NotImplemented` (do not raise) for unsupported types; if both sides decline, Python raises `TypeError`. In-place forms such as `__iadd__` handle `+=`. Operators should return new objects and behave as users expect.",
    detail: [
      "`__radd__` is what makes `sum()` work with its starting value of `0`.",
      "Overload operators only when the meaning is obvious, such as vectors and money.",
      "Immutable value objects should return new instances.",
    ],
    ex: "A `Vector` class where `Vector(1, 2) + Vector(3, 4)` gives `Vector(4, 6)`.",
    code: [
      [
        "Vector addition",
        "python",
        `class Vector:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __add__(self, other):\n        if not isinstance(other, Vector):\n            return NotImplemented\n        return Vector(self.x + other.x, self.y + other.y)\n    def __repr__(self):\n        return f"Vector({self.x}, {self.y})"\n\nprint(Vector(1, 2) + Vector(3, 4))  # Vector(4, 6)`,
        [
          "Unsupported types return `NotImplemented`.",
          "A new vector is returned.",
        ],
      ],
    ],
    mistakes: [
      "Raising TypeError instead of returning NotImplemented.",
      "Mutating operands in __add__.",
    ],
    follow: ["When is __radd__ called?"],
    points: [
      "__add__ and friends",
      "NotImplemented lets Python try the other side",
      "Reflected methods __radd__",
      "Return new objects",
    ],
    notes: ["Decline politely with NotImplemented."],
    src: [
      [
        "Python: Data model (emulating numeric types)",
        `${D}/reference/datamodel.html`,
      ],
      ["Python: NotImplemented constant", `${D}/library/constants.html`],
    ],
  }),
  q({
    slug: "container-protocol-len-getitem-iter",
    topic: "Dunder methods",
    d: "medium",
    title:
      "How do you make a custom class behave like a container or iterable?",
    kw: [
      "__len__",
      "__getitem__",
      "__iter__",
      "__contains__",
      "container protocol",
    ],
    intent: "Checks use of the container special methods.",
    short:
      "Implement `__len__` for `len(obj)`, `__getitem__` for indexing and slicing `obj[i]`, `__contains__` for `x in obj`, and `__iter__` for `for` loops. If `__iter__` is missing but `__getitem__` exists, Python can still iterate by calling it with 0, 1, 2 and so on until `IndexError`, and `in` falls back to iteration when `__contains__` is absent. Mutable containers add `__setitem__` and `__delitem__`. Subclassing a `collections.abc` class such as `Sequence` gives many methods for free once you define the required ones.",
    detail: [
      "`__getitem__` receives a `slice` object for slicing.",
      "`__iter__` should return an iterator, often through a generator method.",
      "Raise `IndexError` or `KeyError` for bad indexes or keys.",
    ],
    ex: "A `Deck` class wrapping a list supports `len(deck)`, `deck[0]` and `for card in deck`.",
    code: [
      [
        "Container methods",
        "python",
        `class Deck:\n    def __init__(self, cards):\n        self._cards = list(cards)\n    def __len__(self):\n        return len(self._cards)\n    def __getitem__(self, i):\n        return self._cards[i]\n\nd = Deck(["A", "K", "Q"])\nprint(len(d), d[0], "K" in d)  # 3 A True\nprint(list(d))                  # ['A', 'K', 'Q']`,
        ["`in` and iteration work through `__getitem__`."],
      ],
    ],
    mistakes: [
      "Not raising IndexError at the end, causing endless iteration.",
      "Returning a list instead of an iterator from __iter__.",
    ],
    follow: ["How does iteration work with only __getitem__?"],
    points: [
      "__len__, __getitem__, __iter__, __contains__",
      "Slices arrive as slice objects",
      "Fallbacks use __getitem__",
      "collections.abc supplies mixins",
    ],
    notes: ["Teach your class the container protocol."],
    src: [
      [
        "Python: Data model (emulating container types)",
        `${D}/reference/datamodel.html`,
      ],
      ["Python: collections.abc", `${D}/library/collections.abc.html`],
    ],
  }),
  q({
    slug: "callable-objects-dunder-call",
    topic: "Dunder methods",
    d: "medium",
    title: "What does `__call__` do, and what is a callable?",
    kw: [
      "__call__",
      "callable",
      "function object",
      "stateful callable",
      "decorator class",
    ],
    intent: "Checks the idea of callable objects.",
    short:
      "A callable is anything you can call with parentheses: functions, methods, classes and any instance whose class defines `__call__`. Defining `__call__(self, ...)` lets `obj(args)` run that method, which gives you a function-like object that also keeps state between calls. `callable(x)` tells you whether `x` can be called. Callable instances are used for configurable handlers, counters, memoisation caches and class-based decorators. Calling a class itself creates an instance, because the class is an instance of `type`, whose `__call__` handles creation.",
    detail: [
      "A closure can hold state too; choose a class when behaviour is richer.",
      "Frameworks accept callables as handlers and callbacks.",
      "`functools.partial` creates a callable with some arguments fixed.",
    ],
    ex: "A `Multiplier(3)` object that triples any number when called.",
    code: [
      [
        "Stateful callable",
        "python",
        `class Counter:\n    def __init__(self):\n        self.n = 0\n    def __call__(self):\n        self.n += 1\n        return self.n\n\nc = Counter()\nprint(c(), c(), callable(c))  # 1 2 True`,
        ["The instance keeps `n` between calls."],
      ],
    ],
    mistakes: [
      "Calling an object whose class lacks __call__.",
      "Using a class when a plain function suffices.",
    ],
    follow: ["How does calling a class create an instance?"],
    points: [
      "Callable = supports ()",
      "__call__ makes instances callable",
      "State between calls",
      "callable() checks",
    ],
    notes: ["Objects that act like functions."],
    src: [
      ["Python: Data model (__call__)", `${D}/reference/datamodel.html`],
      ["Python: callable()", `${D}/library/functions.html`],
    ],
  }),
  q({
    slug: "new-versus-init",
    topic: "Dunder methods",
    d: "hard",
    title: "What is the difference between `__new__` and `__init__`?",
    kw: [
      "__new__",
      "__init__",
      "object creation",
      "singleton",
      "immutable subclass",
    ],
    intent: "Checks understanding of instance creation.",
    short:
      "`__new__` is a static method that creates and returns the new instance; `__init__` then initialises that instance. When you call `Cls(...)`, Python calls `Cls.__new__(Cls, ...)` and, if the result is an instance of `Cls`, calls `__init__` on it with the same arguments. You rarely need `__new__`. It matters when subclassing immutable types such as `int`, `str` or `tuple`, where the value must be set at creation, and for controlling instance creation, as in singletons or caching instances. Normal classes only need `__init__`.",
    detail: [
      "`__new__` should call `super().__new__(cls)` to actually allocate.",
      "If `__new__` returns an object of another class, `__init__` is skipped.",
      "A module or a function is often a simpler singleton than a custom `__new__`.",
    ],
    ex: "A `PositiveInt(int)` subclass checks the value in `__new__` because ints are immutable.",
    code: [
      [
        "Subclassing int",
        "python",
        `class Positive(int):\n    def __new__(cls, value):\n        if value <= 0:\n            raise ValueError("must be positive")\n        return super().__new__(cls, value)\n\nprint(Positive(5) + 1)  # 6\n# Positive(-1) -> ValueError`,
        [
          "The check must happen at creation time.",
          "`int` is immutable, so `__init__` is too late.",
        ],
      ],
    ],
    mistakes: [
      "Using __new__ where __init__ would do.",
      "Forgetting to return the instance from __new__.",
    ],
    follow: ["When is __init__ skipped?"],
    points: [
      "__new__ creates",
      "__init__ initialises",
      "Needed for immutable subclasses",
      "Must return the instance",
    ],
    notes: ["Create, then initialise."],
    src: [
      ["Python: Data model (object.__new__)", `${D}/reference/datamodel.html`],
      ["Python tutorial: Classes", `${D}/tutorial/classes.html`],
    ],
  }),
  q({
    slug: "slots-memory-savings",
    topic: "Classes",
    d: "hard",
    title: "What does `__slots__` do, and what are its trade-offs?",
    kw: [
      "__slots__",
      "memory",
      "__dict__",
      "attribute restriction",
      "many instances",
    ],
    intent: "Checks awareness of memory-optimising features.",
    short:
      "By default each instance stores attributes in a per-instance `__dict__`. Declaring `__slots__ = ('x', 'y')` in a class tells Python to reserve fixed space for exactly those attributes and not create `__dict__` (or `__weakref__`), which saves memory when you create very many small objects and makes attribute access slightly faster. The trade-offs: you cannot add attributes that are not listed, inheritance and multiple inheritance get more complicated, and weak references need `'__weakref__'` in the slots. Use it only when profiling shows memory matters.",
    detail: [
      "Dataclasses accept `slots=True` (Python 3.10+).",
      "Subclasses without their own `__slots__` get a `__dict__` again.",
      "Slotted classes cannot have class attributes that clash with slot names.",
    ],
    ex: "A program that holds millions of `Point` objects uses slots to cut memory.",
    code: [
      [
        "Slots",
        "python",
        `class Point:\n    __slots__ = ("x", "y")\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n\np = Point(1, 2)\ntry:\n    p.z = 3\nexcept AttributeError as e:\n    print("no z:", e)`,
        [
          "Only listed attributes are allowed.",
          "Adding `z` raises AttributeError.",
        ],
      ],
    ],
    mistakes: [
      "Adding slots without measuring.",
      "Expecting new attributes to work.",
    ],
    follow: ["Which tool tells you whether memory is a problem?"],
    points: [
      "Fixed attribute set",
      "No per-instance __dict__",
      "Saves memory for many objects",
      "Limits flexibility",
    ],
    notes: ["Optimise after measuring."],
    src: [
      ["Python: Data model (__slots__)", `${D}/reference/datamodel.html`],
      ["Python: dataclasses (slots)", `${D}/library/dataclasses.html`],
    ],
  }),
  q({
    slug: "dataclass-basics",
    topic: "dataclasses",
    d: "easy",
    title: "What is a dataclass, and what does the decorator generate?",
    kw: [
      "dataclass",
      "dataclasses",
      "__init__ generation",
      "type annotations",
      "boilerplate",
    ],
    intent: "Checks use of dataclasses for data holders.",
    short:
      "`@dataclass` turns a class with annotated fields into a data-holding class by generating methods from those fields: an `__init__` taking the fields as parameters, a `__repr__` showing them, and an `__eq__` comparing them as tuples. You write `name: str` and `price: float = 0.0` and get a complete class. Options include `frozen=True` for immutability, `order=True` for comparison methods, `slots=True` and `kw_only=True` (Python 3.10+). Helpers such as `asdict`, `astuple` and `replace` support common conversions. They remove boilerplate for classes that mainly hold data.",
    detail: [
      "Annotations define the fields; the types are not enforced at run time.",
      "Fields without defaults must come before fields with defaults.",
      "You can still add normal methods.",
    ],
    ex: "An `Order` record with id, items and total needs only three annotated lines.",
    code: [
      [
        "Basic dataclass",
        "python",
        `from dataclasses import dataclass\n\n@dataclass\nclass Product:\n    name: str\n    price: float = 0.0\n\np = Product("Pen", 10)\nprint(p)                      # Product(name='Pen', price=10)\nprint(p == Product("Pen", 10))  # True`,
        ["`__init__`, `__repr__` and `__eq__` are generated."],
      ],
    ],
    mistakes: [
      "Expecting type enforcement.",
      "Putting a default before a field without one.",
    ],
    follow: ["How do you make instances immutable?"],
    points: [
      "Generates __init__, __repr__, __eq__",
      "Fields come from annotations",
      "frozen, order, slots options",
      "Types are not enforced",
    ],
    notes: ["Boilerplate-free data classes."],
    src: [
      ["Python: dataclasses", `${D}/library/dataclasses.html`],
      ["PEP 557: Data classes", `${PEP}/pep-0557/`],
    ],
  }),
  q({
    slug: "dataclass-default-factory",
    topic: "dataclasses",
    d: "medium",
    title: "How do you give a dataclass field a list or dict default?",
    kw: [
      "default_factory",
      "field",
      "mutable default",
      "dataclass list",
      "valueerror mutable default",
    ],
    intent: "Checks the dataclass version of the mutable default trap.",
    short:
      "A plain mutable default such as `tags: list = []` is rejected: dataclasses raise `ValueError` for list, dict and set defaults because instances would share one object. Use `field(default_factory=list)`, which calls the factory to create a fresh object for each instance: `tags: list[str] = field(default_factory=list)`. `field()` also supports `repr=False` to hide a field, `compare=False` to exclude it from equality, and `init=False` for computed fields. Immutable defaults like numbers and strings can be written directly.",
    detail: [
      "The factory can be any zero-argument callable.",
      "A field with `init=False` is usually set in `__post_init__`.",
      "Fields with defaults must follow those without, unless `kw_only` is used.",
    ],
    ex: "A `Cart` dataclass whose `items` list starts empty for each cart.",
    code: [
      [
        "default_factory",
        "python",
        `from dataclasses import dataclass, field\n\n@dataclass\nclass Cart:\n    owner: str\n    items: list[str] = field(default_factory=list)\n\na, b = Cart("A"), Cart("B")\na.items.append("pen")\nprint(b.items)  # []`,
        ["Each instance gets its own list."],
      ],
    ],
    mistakes: [
      "Writing = [] and hitting ValueError.",
      "Passing a shared list object as the factory result.",
    ],
    follow: ["What does field(init=False) do?"],
    points: [
      "Mutable defaults raise ValueError",
      "field(default_factory=...)",
      "Fresh object per instance",
      "field options: repr, compare, init",
    ],
    notes: ["Factory, not shared default."],
    src: [
      [
        "Python: dataclasses (mutable default values)",
        `${D}/library/dataclasses.html`,
      ],
      [
        "Python tutorial: Default argument values",
        `${D}/tutorial/controlflow.html`,
      ],
    ],
  }),
  q({
    slug: "dataclass-frozen-post-init",
    topic: "dataclasses",
    d: "medium",
    title:
      "How do `frozen=True`, `order=True` and `__post_init__` work in dataclasses?",
    kw: [
      "frozen dataclass",
      "post_init",
      "order=True",
      "hashable dataclass",
      "validation",
    ],
    intent: "Checks dataclass options beyond basics.",
    short:
      "`@dataclass(frozen=True)` makes instances immutable: assigning to a field raises `FrozenInstanceError`, and with `eq=True` (the default) Python also generates `__hash__`, so frozen instances can be dict keys or set members. `order=True` generates `<`, `<=`, `>` and `>=` that compare the fields as a tuple in definition order. `__post_init__` is called right after the generated `__init__`, so it is the place for validation and computed fields: it can raise `ValueError` for bad data or set derived attributes (using `object.__setattr__` in a frozen class).",
    detail: [
      "`dataclasses.replace(obj, field=value)` makes a modified copy of a frozen instance.",
      "Fields declared with `field(init=False)` are good candidates for post-init computation.",
      "Frozen is shallow: a list field can still be mutated.",
    ],
    ex: "A frozen `Money(amount, currency)` that validates the amount in `__post_init__`.",
    code: [
      [
        "Frozen with validation",
        "python",
        `from dataclasses import dataclass\n\n@dataclass(frozen=True, order=True)\nclass Money:\n    amount: int\n    currency: str = "INR"\n    def __post_init__(self):\n        if self.amount < 0:\n            raise ValueError("negative amount")\n\nprint(Money(5) < Money(7))   # True\n# Money(5).amount = 1 -> FrozenInstanceError`,
        [
          "Validation runs after `__init__`.",
          "Ordering compares fields in order.",
        ],
      ],
    ],
    mistakes: [
      "Assuming frozen makes nested objects immutable.",
      "Skipping validation of bad input.",
    ],
    follow: ["Why is a frozen dataclass hashable?"],
    points: [
      "frozen blocks assignment",
      "order=True compares fields as a tuple",
      "__post_init__ validates or derives",
      "Frozen is shallow",
    ],
    notes: ["Immutable value object."],
    src: [
      ["Python: dataclasses", `${D}/library/dataclasses.html`],
      ["Python: Data model (__hash__)", `${D}/reference/datamodel.html`],
    ],
  }),
  q({
    slug: "dataclass-vs-namedtuple-vs-plain-class",
    topic: "dataclasses",
    d: "medium",
    title:
      "How do you choose between a dataclass, a namedtuple, a dict and a plain class?",
    kw: [
      "dataclass vs namedtuple",
      "record types",
      "plain class",
      "dict vs class",
      "typed dict",
    ],
    intent: "Checks design judgement for data containers.",
    short:
      "Use a dataclass for a typed record with named fields, defaults, optional mutability and your own methods; it is the usual choice for domain objects. Use a namedtuple when you want an immutable, lightweight record that also behaves like a tuple, for example to return multiple values or to unpack. Use a plain dict for dynamic data whose keys are not known in advance, such as parsed JSON, perhaps with a `TypedDict` for type checkers. Write a normal class when behaviour and invariants dominate, or when you need full control over creation and attribute handling.",
    detail: [
      "Dataclasses add features by options; namedtuples are fixed and immutable.",
      "Dicts have no fixed fields, so typos in keys appear only at run time.",
      "Pydantic and attrs add validation and are common in applications.",
    ],
    ex: "An API layer parses JSON into dicts, then builds dataclasses for the business logic.",
    mistakes: [
      "Passing around anonymous dicts for fixed structures.",
      "Using a namedtuple when mutation is needed.",
    ],
    follow: ["Which of these are immutable by default?"],
    points: [
      "Dataclass: typed record with methods",
      "Namedtuple: immutable tuple record",
      "Dict: dynamic keys",
      "Class: behaviour first",
    ],
    notes: ["Shape of the data picks the type."],
    src: [
      ["Python: dataclasses", `${D}/library/dataclasses.html`],
      ["Python: collections.namedtuple", `${D}/library/collections.html`],
    ],
  }),
  q({
    slug: "property-getter-setter",
    topic: "Properties",
    d: "easy",
    title:
      "What does `@property` do, and why use it instead of getter and setter methods?",
    kw: [
      "property",
      "getter setter",
      "attribute access",
      "validation",
      "encapsulation",
    ],
    intent: "Checks Pythonic attribute access.",
    short:
      "`@property` turns a method into an attribute-style accessor: `obj.balance` calls the method without parentheses. With a matching `@balance.setter`, assigning `obj.balance = 10` runs your validation code. This lets you start with a plain public attribute and later add validation or computation without changing the calling code, so Python code does not need Java-style `get_x()`/`set_x()` methods up front. The usual practice is to keep the real value in an underscore attribute like `_balance`. A property without a setter is read-only.",
    detail: [
      "Do not do slow or surprising work in a property; callers expect attribute-like speed.",
      "Use `@x.deleter` if deletion needs special handling.",
      "Setting a property without a setter raises `AttributeError`.",
    ],
    ex: "A `Temperature` class that rejects values below absolute zero in the setter.",
    code: [
      [
        "Validated property",
        "python",
        `class Account:\n    def __init__(self, balance=0):\n        self.balance = balance   # uses the setter\n    @property\n    def balance(self):\n        return self._balance\n    @balance.setter\n    def balance(self, value):\n        if value < 0:\n            raise ValueError("balance cannot be negative")\n        self._balance = value\n\na = Account(10)\na.balance = 25\nprint(a.balance)  # 25`,
        ["Reads call the getter.", "Writes go through validation."],
      ],
    ],
    mistakes: [
      "Setting self.balance inside its own setter, causing infinite recursion.",
      "Heavy work inside a property.",
    ],
    follow: ["How do you make a read-only attribute?"],
    points: [
      "Method used as an attribute",
      "Setter adds validation",
      "No getters and setters upfront",
      "Store the value in _name",
    ],
    notes: ["Start simple, add control later."],
    src: [
      ["Python: property", `${D}/library/functions.html`],
      ["Python: Descriptor HowTo (properties)", `${D}/howto/descriptor.html`],
    ],
  }),
  q({
    slug: "read-only-and-computed-properties",
    topic: "Properties",
    d: "medium",
    title:
      "How do you create read-only or computed attributes, and what is `cached_property`?",
    kw: [
      "read-only property",
      "computed property",
      "cached_property",
      "derived attribute",
      "lazy evaluation",
    ],
    intent: "Checks property use for derived values.",
    short:
      "A property with only a getter is read-only and can compute its value from other attributes, so `area` is always consistent with `width` and `height` and is never stale, and assigning to it raises `AttributeError`. When the computation is expensive, `functools.cached_property` runs the method once on first access and stores the result in the instance's `__dict__`, so later reads are plain attribute lookups. The cache is not invalidated automatically, and it needs an instance `__dict__`, so it does not work with `__slots__` unless a `__dict__` slot exists.",
    detail: [
      "To refresh a cached value, delete it with `del obj.attr`.",
      "Use a normal property if the underlying values change often.",
      "Mutable inputs make cached results stale.",
    ],
    ex: "A `Report` that parses a large file once through a cached property.",
    code: [
      [
        "Computed and cached",
        "python",
        `from functools import cached_property\n\nclass Rect:\n    def __init__(self, w, h):\n        self.w, self.h = w, h\n    @property\n    def area(self):\n        return self.w * self.h\n    @cached_property\n    def label(self):\n        print("computing")\n        return f"{self.w}x{self.h}"\n\nr = Rect(2, 3)\nprint(r.area)    # 6\nprint(r.label, r.label)  # computing printed once`,
        ["`area` is recomputed on every read.", "`label` is computed once."],
      ],
    ],
    mistakes: [
      "Caching values that change.",
      "Using cached_property on slotted classes.",
    ],
    follow: ["How do you reset a cached_property?"],
    points: [
      "Getter only means read-only",
      "Computed from current state",
      "cached_property computes once",
      "Cache can go stale",
    ],
    notes: ["Compute on demand, maybe once."],
    src: [
      ["Python: functools.cached_property", `${D}/library/functools.html`],
      ["Python: property", `${D}/library/functions.html`],
    ],
  }),
  q({
    slug: "descriptors-and-how-property-works",
    topic: "Properties",
    d: "hard",
    title:
      "What is a descriptor, and how does it relate to properties and methods?",
    kw: ["descriptor", "__get__", "__set__", "data descriptor", "bound method"],
    intent: "Checks deeper understanding of attribute access.",
    short:
      "A descriptor is an object stored as a class attribute whose class defines `__get__`, and optionally `__set__` or `__delete__`. When you access the attribute through an instance, Python calls the descriptor's methods instead of just returning the object. `property` is implemented as a descriptor, which is how `obj.x` can run code. Functions are descriptors too: their `__get__` returns a bound method, which is why `self` is passed automatically. A data descriptor (with `__set__`) takes priority over the instance `__dict__`, while a non-data descriptor does not. Descriptors also power `classmethod`, `staticmethod` and `__slots__`.",
    detail: [
      "Writing your own descriptor is useful for reusable validation across classes.",
      "`__set_name__` tells a descriptor the attribute name it was assigned to.",
      "The Descriptor HowTo shows pure-Python equivalents of `property` and methods.",
    ],
    ex: "A `Positive` descriptor reused on several attributes to validate that values are above zero.",
    code: [
      [
        "Custom descriptor",
        "python",
        `class Positive:\n    def __set_name__(self, owner, name):\n        self.name = "_" + name\n    def __get__(self, obj, owner=None):\n        return getattr(obj, self.name)\n    def __set__(self, obj, value):\n        if value <= 0:\n            raise ValueError("must be positive")\n        setattr(obj, self.name, value)\n\nclass Item:\n    price = Positive()\n    def __init__(self, price):\n        self.price = price\n\nprint(Item(5).price)  # 5`,
        [
          "The descriptor lives on the class.",
          "Every assignment to `price` passes through `__set__`.",
        ],
      ],
    ],
    mistakes: [
      "Storing per-instance data on the descriptor itself.",
      "Confusing descriptors with decorators.",
    ],
    follow: ["Why are functions descriptors?"],
    points: [
      "Class attribute with __get__/__set__",
      "property is a descriptor",
      "Functions bind via __get__",
      "Data descriptors win over instance dict",
    ],
    notes: ["Hooks in attribute lookup."],
    src: [
      ["Python: Descriptor HowTo Guide", `${D}/howto/descriptor.html`],
      [
        "Python: Data model (implementing descriptors)",
        `${D}/reference/datamodel.html`,
      ],
    ],
  }),
])
