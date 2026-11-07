import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-oop", {
  slug: "classes-and-objects",
  title: "Classes, objects, constructors and static members",
  topic: "Classes & objects",
  minutes: 90,
  overview:
    "Design classes with fields, constructors and methods, understand references, and use static members and equals and hashCode correctly.",
  objectives: [
    "Write a class with private fields, constructors and methods",
    "Explain references, pass by value and the meaning of this",
    "Override equals and hashCode together, and use static members properly",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "Classes and objects",
      body: [
        "A **class** is a blueprint that defines the **fields** (state) and **methods** (behaviour) of a kind of thing. An **object** is an instance of a class, created with `new`, and it has its own values for the fields. One class can create many objects, and each keeps its own state.",
        "A variable of a class type holds a **reference** to an object, not the object itself. Writing `Account b = a;` copies the reference, so both names point to the same object. `null` means that the variable refers to no object, and using it throws `NullPointerException`.",
        "Keep fields `private` and give access through methods. This is **encapsulation**: the class can protect its own rules, such as an amount that must be positive, and change its inside without breaking the code that uses it.",
      ],
    },
    {
      kind: "explain",
      heading: "Constructors and this",
      body: [
        "A **constructor** has the name of the class and no return type. It runs when an object is created and sets the initial state. If you write no constructor, the compiler adds a default one with no arguments, and as soon as you write any constructor, that default is no longer added. Constructors can be **overloaded**, and one can call another with `this(...)`, which must be the first statement.",
        "`this` is a reference to the current object. It tells a field from a parameter with the same name (`this.owner = owner`), calls another constructor, and can be returned for chained calls. A `static` method has no `this`, because it does not belong to an object.",
      ],
    },
    {
      kind: "code",
      heading: "A class with a constructor chain",
      example: {
        title: "Account",
        language: "java",
        code: 'public class Main {\n  static class Account {\n    private final String owner;\n    private double balance;\n\n    Account(String owner) {\n      this(owner, 0);\n    }\n\n    Account(String owner, double balance) {\n      this.owner = owner;\n      this.balance = balance;\n    }\n\n    Account deposit(double amount) {\n      if (amount <= 0) {\n        throw new IllegalArgumentException("Amount must be positive");\n      }\n      balance += amount;\n      return this;\n    }\n\n    double getBalance() {\n      return balance;\n    }\n  }\n\n  public static void main(String[] args) {\n    Account a = new Account("Asha");\n    Account same = a;\n    a.deposit(100).deposit(50);\n    System.out.println(same.getBalance());\n  }\n}',
        walkthrough: [
          "The first constructor calls the second with `this(owner, 0)`, so the logic is in one place.",
          "`deposit` protects the rule and returns `this`, which allows chained calls.",
          "`same` refers to the same object as `a`, so it shows the balance `150.0`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Pass by value, static, equals and hashCode",
      body: [
        "Java is **always pass by value**. For an object, the value that is copied is the **reference**. A method can change the object through it, but if it assigns a new object to its parameter, the caller's variable is unchanged.",
        "`static` members belong to the class: one copy of a static field is shared by all objects, and a static method is called with the class name. Use them for constants (`static final`) and helper methods, not for state that is really per object.",
        "By default, `equals` compares references. For value equality, override `equals`, and also `hashCode`, so that **equal objects have equal hash codes**. If you break this rule, `HashMap` and `HashSet` cannot find your objects. Use the same fields in both, and `Objects.equals` and `Objects.hash`.",
      ],
    },
    {
      kind: "code",
      heading: "Equality and static",
      example: {
        title: "equals, hashCode and a counter",
        language: "java",
        code: 'public class Main {\n  static class Point {\n    static int created = 0;\n    final int x, y;\n\n    Point(int x, int y) {\n      this.x = x;\n      this.y = y;\n      created++;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n      if (this == o) return true;\n      if (!(o instanceof Point p)) return false;\n      return x == p.x && y == p.y;\n    }\n\n    @Override\n    public int hashCode() {\n      return Objects.hash(x, y);\n    }\n  }\n\n  public static void main(String[] args) {\n    Set<Point> set = new HashSet<>();\n    set.add(new Point(1, 2));\n    set.add(new Point(1, 2));\n    System.out.println(set.size() + " " + Point.created);\n  }\n}',
        walkthrough: [
          "`equals` and `hashCode` use the same two fields.",
          "The `HashSet` treats the two points as one, because they are equal.",
          "`created` is static, so it counts both objects. The output is `1 2`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Making fields public.",
          fix: "Use `private` and methods that protect the rules.",
        },
        {
          mistake: "Overriding `equals` without `hashCode`.",
          fix: "Override both, with the same fields.",
        },
        {
          mistake: "Saying that objects are passed by reference.",
          fix: "Java passes a copy of the reference, by value.",
        },
        {
          mistake: "Using static fields for data that is really per object.",
          fix: "Make it an instance field.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A shop catalogue",
      scenario: "A shop has products with a name, a price and a stock level.",
      body: [
        "A `Product` class keeps its fields private, validates the price in the constructor, and offers `reduceStock(int)` that refuses to go below zero. Two products with the same code are equal, so `equals` and `hashCode` use the code.",
        "The rest of the program cannot put a product into an invalid state.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "co-ref",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'StringBuilder a = new StringBuilder("x");\nStringBuilder b = a;\nb.append("y");\nSystem.out.println(a);',
      },
      options: ["xy", "x", "y"],
      answer: 0,
      explanation:
        "Both variables refer to the same object, so the change through `b` shows in `a`.",
    },
    {
      type: "single",
      id: "co-pass",
      prompt: "How does Java pass arguments?",
      options: [
        "By value; for objects the value is a reference",
        "By reference for objects",
        "By name",
      ],
      answer: 0,
      explanation:
        "A method gets a copy of the reference, so reassigning the parameter does not change the caller's variable.",
    },
    {
      type: "truefalse",
      id: "co-default-ctor",
      statement:
        "If you write a constructor with parameters, Java still adds a no-argument constructor.",
      answer: false,
      explanation:
        "The default constructor is added only when you write no constructor.",
    },
    {
      type: "blank",
      id: "co-hash",
      prompt:
        "If two objects are equal according to equals, their ___ must be the same.",
      answer: "hashCode",
      explanation: "This is the contract that hash-based collections rely on.",
    },
  ],
  assignment: {
    title: "Design a class",
    task: [
      "Design a `Book` class with a title, an author, a price and an isbn. Validate in the constructor, keep fields private, and write `equals` and `hashCode` based on the isbn.",
      "Put three books in a `HashSet` and show that a duplicate isbn is ignored. Add a static counter of created books.",
    ],
    checklist: [
      "Fields are private and validated",
      "equals and hashCode use the same field",
      "The static counter is correct",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "co-ex",
      title: "A guarded counter",
      task: [
        "Write a class `Counter` with a private `count`, a method `increment()` that stops at a maximum of 5, and `getCount()`. Show that ten calls leave the count at 5.",
      ],
      language: "java",
      starter: "public class CounterDemo {\n  // your code\n}",
      solution:
        "public class CounterDemo {\n  static class Counter {\n    private int count;\n\n    void increment() {\n      if (count < 5) {\n        count++;\n      }\n    }\n\n    int getCount() {\n      return count;\n    }\n  }\n\n  public static void main(String[] args) {\n    Counter c = new Counter();\n    for (int i = 0; i < 10; i++) {\n      c.increment();\n    }\n    System.out.println(c.getCount());\n  }\n}",
      hints: ["The rule lives in `increment`, because the field is private."],
      checklist: [
        "The field is private",
        "Ten calls give 5",
        "There is no setter that bypasses the rule",
      ],
    },
  ],
  revisionNotes: [
    "Class = blueprint, object = instance; variables hold references",
    "Private fields, constructors that validate, `this(...)` chaining",
    "Always pass by value; for objects the value is a reference",
    "Override equals and hashCode together; static = per class",
  ],
  resources: [
    {
      label: "The Java Tutorials: Classes",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/index.html",
    },
    {
      label: "The Java Tutorials: Providing Constructors",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html",
    },
    {
      label: "The Java Tutorials: Understanding Class Members",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html",
    },
  ],
})
