import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "packages-and-access",
  title: "Packages, imports and access modifiers",
  topic: "Packages",
  minutes: 60,
  overview:
    "Organise code into packages, import what you need, and control who can see your classes and members with `public`, `protected`, default and `private`.",
  objectives: [
    "Create a package, place a class in it and import it from another package",
    "Explain the four access levels and choose the most restrictive one that works",
    "Describe how packages map to folders and how a project is usually laid out",
  ],
  prerequisites: ["lesson.java-core.first-program"],
  sections: [
    {
      kind: "explain",
      heading: "What a package is",
      body: [
        "A **package** is a named group of related classes. It does two jobs: it keeps a big project organised, and it prevents name clashes, because two classes with the same name can live in different packages.",
        "Package names are lower case and, by convention, start with a reversed web domain you own, such as `com.shopexample.orders`. The package name matches a folder path: `com/shopexample/orders/Order.java`.",
        "The first line of a file declares its package: `package com.shopexample.orders;`. If you leave it out, the class goes into the unnamed **default package**, which is fine for tiny experiments and wrong for real projects.",
      ],
    },
    {
      kind: "code",
      heading: "Two packages and an import",
      example: {
        title: "Using a class from another package",
        language: "java",
        code: '// file: com/shopexample/model/Product.java\npackage com.shopexample.model;\n\npublic class Product {\n  private final String name;\n  public Product(String name) {\n    this.name = name;\n  }\n  public String getName() {\n    return name;\n  }\n}\n\n// file: com/shopexample/app/Main.java\npackage com.shopexample.app;\n\nimport com.shopexample.model.Product;\nimport java.util.List;\n\npublic class Main {\n  public static void main(String[] args) {\n    Product p = new Product("Notebook");\n    List<String> names = List.of(p.getName());\n    System.out.println(names);\n  }\n}',
        walkthrough: [
          "`Product` is declared in the package `com.shopexample.model` and is `public`, so other packages can use it.",
          "`Main` is in a different package, so it must `import` `Product` before it can use the short name.",
          "`java.util.List` is imported the same way. Classes in `java.lang`, such as `String` and `System`, are imported automatically.",
          "You can skip the import by writing the full name, `com.shopexample.model.Product`, but that is long to read.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Access modifiers",
      body: [
        "`public` means visible everywhere. `protected` means visible in the same package and in subclasses. With no modifier, called **package-private** or default, a member is visible only inside its own package. `private` means visible only inside its own class.",
        "A top-level class can be only `public` or package-private. `private` and `protected` are for members: fields, methods, constructors and nested classes.",
        "Choose the **most restrictive** level that still works. Fields are normally `private` and reached through methods. That is **encapsulation**, and it lets you change the inside of a class without breaking the code that uses it.",
      ],
    },
    {
      kind: "diagram",
      heading: "Who can see what",
      diagram: {
        kind: "table",
        title: "Access levels",
        headers: [
          "Modifier",
          "Same class",
          "Same package",
          "Subclass in another package",
          "Everywhere",
        ],
        rows: [
          ["private", "Yes", "No", "No", "No"],
          ["default (none)", "Yes", "Yes", "No", "No"],
          ["protected", "Yes", "Yes", "Yes", "No"],
          ["public", "Yes", "Yes", "Yes", "Yes"],
        ],
      },
    },
    {
      kind: "code",
      heading: "Encapsulation in practice",
      example: {
        title: "A private field with a guarded setter",
        language: "java",
        code: 'public class Account {\n  private double balance;\n\n  public double getBalance() {\n    return balance;\n  }\n\n  public void deposit(double amount) {\n    if (amount <= 0) {\n      throw new IllegalArgumentException("Amount must be positive");\n    }\n    balance += amount;\n  }\n}',
        walkthrough: [
          "`balance` is `private`, so no code outside `Account` can set it to a negative number directly.",
          "`getBalance` lets other classes read it.",
          "`deposit` is the only way to change it, and it checks the rule first.",
          "If the storage later changes, only `Account` needs updating.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Making every field and method `public`.",
          fix: "Start with `private` and open up only what other classes need.",
        },
        {
          mistake:
            "Putting a file in a folder that does not match its package.",
          fix: "The folder path must equal the package name. Build tools and IDEs report errors when it does not.",
        },
        {
          mistake:
            "Using wildcard imports such as `import java.util.*;` everywhere.",
          fix: "They work, but explicit imports show which classes a file really uses, and avoid name clashes between packages.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A small project layout",
      scenario: "A team starts a student management application.",
      body: [
        "A common layout is `com.school.model` for data classes, `com.school.service` for business rules, `com.school.repository` for storage, and `com.school.app` for `main`. Each package has one job.",
        "Keep helper methods that only one class uses `private`. Make a class `public` only when code in another package needs it. A smaller public surface is easier to change later.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "private-visibility",
      prompt: "Where is a `private` field visible?",
      options: [
        "Only inside its own class",
        "In the whole package",
        "Everywhere",
      ],
      answer: 0,
      explanation: "`private` limits access to the declaring class.",
    },
    {
      type: "single",
      id: "default-visibility",
      prompt: "A method has no access modifier. Which code can call it?",
      options: [
        "Code in the same package",
        "Only code in the same class",
        "Code in any package",
      ],
      answer: 0,
      explanation:
        "With no modifier a member is package-private: visible to every class in its own package.",
    },
    {
      type: "truefalse",
      id: "private-top-level",
      statement: "A top-level class can be declared `private`.",
      answer: false,
      explanation:
        "A top-level class is `public` or package-private. `private` is only for members and nested classes.",
    },
    {
      type: "blank",
      id: "package-keyword",
      prompt:
        "The first line of a file that belongs to a package must start with the keyword ___.",
      answer: "package",
      explanation:
        "The `package` declaration comes first, before any `import` lines.",
    },
  ],
  assignment: {
    title: "A two-package program",
    task: [
      "Create a package `model` with a `Book` class that has private fields `title` and `price`, a constructor and getters.",
      "Create a package `app` with a `Main` class that imports `Book`, creates two books and prints them. Make `price` impossible to set to a negative value.",
    ],
    checklist: [
      "The folders match the package names",
      "`Main` uses an import and not the full class name",
      "The fields are private and the price rule is checked in one place",
      "It compiles and runs from the command line or the IDE",
    ],
    hints: [
      "Check the price inside the constructor, and throw `IllegalArgumentException` for a bad value.",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "guarded-counter",
      title: "A guarded counter",
      task: [
        "Write a class `Counter` with a private `int count`. Provide `increment()`, which adds 1 up to a maximum of 5 and then does nothing, and `getCount()`.",
      ],
      language: "java",
      starter: "public class Counter {\n  // your code\n}",
      solution:
        "public class Counter {\n  private int count;\n\n  public void increment() {\n    if (count < 5) {\n      count++;\n    }\n  }\n\n  public int getCount() {\n    return count;\n  }\n}",
      hints: ["The field is private, so the rule lives in `increment`."],
      checklist: [
        "Calling increment ten times leaves the count at 5",
        "The field is private",
        "There is no public setter that could bypass the rule",
      ],
    },
  ],
  revisionNotes: [
    "A package groups classes, and its name matches the folder path",
    "`import` brings in a class from another package, `java.lang` is automatic",
    "private, default, protected, public: from most to least restrictive",
    "Fields private, methods public only where needed",
  ],
  resources: [
    {
      label: "The Java Tutorials: Creating and Using Packages",
      url: "https://docs.oracle.com/javase/tutorial/java/package/index.html",
    },
    {
      label: "The Java Tutorials: Controlling Access to Members of a Class",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html",
    },
  ],
})
