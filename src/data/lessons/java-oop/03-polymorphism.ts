import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-oop", {
  slug: "polymorphism",
  title: "Polymorphism: overloading, overriding and dynamic dispatch",
  topic: "Polymorphism",
  minutes: 80,
  overview:
    "Tell overloading from overriding, understand dynamic dispatch, and use instanceof and casting safely.",
  objectives: [
    "Distinguish compile-time overloading from run-time overriding",
    "Predict which method runs when a superclass reference holds a subclass object",
    "Use instanceof pattern matching and avoid unsafe casts",
  ],
  prerequisites: ["lesson.java-oop.inheritance"],
  sections: [
    {
      kind: "explain",
      heading: "Overloading and overriding",
      body: [
        "**Overloading**: several methods in the same class with the same name and different parameter lists. The compiler chooses the method from the argument types, so it is decided at **compile time**. The return type alone cannot distinguish overloads.",
        "**Overriding**: a subclass provides its own version of an inherited method, with the same name and parameters. Which version runs depends on the **real type of the object** at **run time**. Use `@Override`, so the compiler checks that you really override something.",
        "The rules for overriding: the same signature, a return type that is the same or a subtype, access that is not narrower, and no new or broader checked exceptions. `static`, `private` and `final` methods are not overridden. A `static` method with the same signature in a subclass **hides** the parent's method.",
      ],
    },
    {
      kind: "code",
      heading: "Overload and override",
      example: {
        title: "Compile time and run time",
        language: "java",
        code: 'public class Main {\n  static class Printer {\n    String print(int n) { return "int " + n; }\n    String print(String s) { return "text " + s; }\n    String print(Object o) { return "object " + o; }\n  }\n\n  static class Animal { String speak() { return "..."; } }\n  static class Dog extends Animal { @Override String speak() { return "Woof"; } }\n\n  public static void main(String[] args) {\n    Printer p = new Printer();\n    Object o = "hello";\n    System.out.println(p.print(5) + ", " + p.print("a") + ", " + p.print(o));\n    Animal a = new Dog();\n    System.out.println(a.speak());\n  }\n}',
        walkthrough: [
          "The overload is chosen from the **declared** type of the argument. `o` is declared as `Object`, so `print(Object)` runs even though it holds a string.",
          "`a.speak()` is decided at run time from the real object, a `Dog`, so it prints `Woof`.",
          "The output is `int 5, text a, object hello` and `Woof`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Dynamic dispatch",
      body: [
        "When you call an overridden method through a superclass reference, Java runs the version of the **actual object**. This is **run-time polymorphism**, or dynamic dispatch. It lets you write code against a general type such as `Shape`, and add new kinds later without changing that code.",
        "Assigning a subclass object to a superclass variable is **upcasting**, and it is always safe. The compiler checks that the method exists in the **reference type**, and the JVM then picks the real implementation. Fields are not overridden: a field is chosen by the reference type.",
        "To use something that exists only in the subclass, you need a **downcast**, which can fail with `ClassCastException`. Test first with `instanceof`. Since Java 16, a pattern does both: `if (shape instanceof Circle c) { c.radius(); }`. Frequent downcasting suggests that the design could use polymorphism instead.",
      ],
    },
    {
      kind: "code",
      heading: "A list of shapes",
      example: {
        title: "One call, different behaviour",
        language: "java",
        code: 'public class Main {\n  static abstract class Shape {\n    abstract double area();\n  }\n  static class Circle extends Shape {\n    double r = 1;\n    double area() { return Math.PI * r * r; }\n  }\n  static class Square extends Shape {\n    double side = 2;\n    double area() { return side * side; }\n  }\n\n  public static void main(String[] args) {\n    Shape[] shapes = {new Circle(), new Square()};\n    for (Shape s : shapes) {\n      if (s instanceof Circle c) {\n        System.out.printf("circle r=%.1f%n", c.r);\n      }\n      System.out.printf("%.2f%n", s.area());\n    }\n  }\n}',
        walkthrough: [
          "Both objects are held in `Shape` references, and `s.area()` runs the right code for each.",
          "The pattern `instanceof Circle c` checks the type and creates `c` in one step.",
          "A new `Shape` subclass needs no change in the loop.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Expecting overloads to be chosen from the real type.",
          fix: "Overloads use the declared type. Overrides use the real type.",
        },
        {
          mistake:
            "Forgetting `@Override` and creating a new method by a typo.",
          fix: "Always write `@Override`.",
        },
        {
          mistake: "Casting without checking the type.",
          fix: "Use `instanceof`, or redesign with polymorphism.",
        },
        {
          mistake: "Expecting fields to be overridden.",
          fix: "Fields are chosen by the reference type. Use methods.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Payment processing",
      scenario:
        "A checkout accepts cards, wallets and bank transfers, and each calculates its fee differently.",
      body: [
        "Define `PaymentMethod` with `fee(double amount)` and implement it in each type. The checkout loops over a list of methods and calls `fee`, and never checks the type. Adding a new method needs a new class only.",
        "This is polymorphism replacing a chain of `if` and `instanceof` checks.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "poly-overload",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'public class Main {\n  static String f(Object o) { return "object"; }\n  static String f(String s) { return "string"; }\n  public static void main(String[] args) {\n    Object x = "text";\n    System.out.println(f(x) + " " + f("text"));\n  }\n}',
      },
      options: ["object string", "string string", "object object"],
      answer: 0,
      explanation:
        "The overload is chosen from the declared type: `x` is an `Object`, the literal is a `String`.",
    },
    {
      type: "single",
      id: "poly-runtime",
      prompt: "Which kind of polymorphism is decided at run time?",
      options: ["Overriding", "Overloading", "Both"],
      answer: 0,
      explanation:
        "Overridden methods are chosen from the real object. Overloads are chosen by the compiler.",
    },
    {
      type: "truefalse",
      id: "poly-field",
      statement:
        "Fields are chosen by the real type of the object, like methods.",
      answer: false,
      explanation: "Fields are resolved by the reference type.",
    },
    {
      type: "single",
      id: "poly-cast",
      prompt: "What can go wrong with a downcast?",
      options: [
        "ClassCastException if the object is not of that type",
        "Nothing, it is always safe",
        "A compile error always",
      ],
      answer: 0,
      explanation: "Test with `instanceof` first, or use pattern matching.",
    },
  ],
  assignment: {
    title: "Replace if-chains",
    task: [
      "Write a method that calculates a discount using `if (x instanceof ...)` for three customer types.",
      "Refactor it into an abstract class with an overridden method, and show that adding a fourth type needs no change in the calling code.",
    ],
    checklist: [
      "The calling code has no instanceof",
      "A new type is one new class",
      "I can explain overloading versus overriding",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "poly-ex",
      title: "Animals speak",
      task: [
        "Write `Animal` with `speak()`, subclasses `Dog` and `Cat` that override it, and print the result of calling `speak()` on every element of a `List<Animal>`.",
      ],
      language: "java",
      starter: "import java.util.*;\n\npublic class Zoo {\n  // your code\n}",
      solution:
        'import java.util.*;\n\npublic class Zoo {\n  static class Animal {\n    String speak() {\n      return "...";\n    }\n  }\n\n  static class Dog extends Animal {\n    @Override\n    String speak() {\n      return "Woof";\n    }\n  }\n\n  static class Cat extends Animal {\n    @Override\n    String speak() {\n      return "Meow";\n    }\n  }\n\n  public static void main(String[] args) {\n    List<Animal> animals = List.of(new Dog(), new Cat(), new Animal());\n    for (Animal a : animals) {\n      System.out.println(a.speak());\n    }\n  }\n}',
      hints: ["Hold all objects in a list of the superclass type."],
      checklist: [
        "Each subclass overrides speak",
        "The loop never checks the type",
        "@Override is used",
      ],
    },
  ],
  revisionNotes: [
    "Overloading: same class, compile time, declared types; overriding: subclass, run time, real type",
    "Use @Override; overriding rules: signature, return type, access, exceptions",
    "Upcasting is safe; downcast with instanceof or pattern matching",
    "Fields are not overridden",
  ],
  resources: [
    {
      label: "The Java Tutorials: Polymorphism",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html",
    },
    {
      label: "The Java Tutorials: Overriding and Hiding Methods",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/override.html",
    },
  ],
})
