import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-collections", {
  slug: "generics",
  title: "Generics: type parameters, bounds, wildcards and erasure",
  topic: "Generics",
  minutes: 90,
  overview:
    "Write generic classes and methods, use bounded types and wildcards correctly, and understand type erasure and its limits.",
  objectives: [
    "Write a generic class and a generic method",
    "Use bounded type parameters and the PECS rule for wildcards",
    "Explain type erasure and what it prevents",
  ],
  prerequisites: ["lesson.java-collections.lists"],
  sections: [
    {
      kind: "explain",
      heading: "Why generics",
      body: [
        "**Generics** let a class, interface or method work with a type that is given as a **parameter**, such as `List<String>`. The compiler checks the types at **compile time**: it rejects an `Integer` added to a `List<String>`, and you need no cast when you read an element. Before generics, collections held `Object`, so a wrong type was found only at run time as a `ClassCastException`.",
        "By convention, type parameters are single capital letters: `T` for a type, `E` for an element, `K` and `V` for key and value. Only **reference types** can be type arguments, so you write `List<Integer>` and not `List<int>`. The **diamond operator** `<>` lets the compiler infer the arguments: `new ArrayList<>()`. Avoid **raw types** such as `List` in new code.",
      ],
    },
    {
      kind: "code",
      heading: "A generic class and method",
      example: {
        title: "Box and max",
        language: "java",
        code: 'public class Main {\n  static class Box<T> {\n    private T value;\n    Box(T value) { this.value = value; }\n    T get() { return value; }\n    void set(T value) { this.value = value; }\n  }\n\n  static <T extends Comparable<T>> T max(List<T> items) {\n    T best = items.get(0);\n    for (T item : items) {\n      if (item.compareTo(best) > 0) best = item;\n    }\n    return best;\n  }\n\n  public static void main(String[] args) {\n    Box<String> box = new Box<>("hi");\n    System.out.println(box.get().length());\n    System.out.println(max(List.of(3, 9, 4)) + " " + max(List.of("pen", "book")));\n  }\n}',
        walkthrough: [
          "`Box<T>` works for any type, and `Box<String>` gives back a `String` with no cast.",
          "`<T extends Comparable<T>>` is a **bounded** type parameter: only comparable types are allowed, so `compareTo` can be called.",
          "The same `max` method works for `Integer` and `String`. The output is `2` and `9 pen`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Wildcards and PECS",
      body: [
        "Generic types are **invariant**: a `List<Integer>` is **not** a `List<Number>`, even though `Integer` is a `Number`. A **wildcard** relaxes this. `List<? extends Number>` accepts a list of `Number` or any subtype, and you can **read** elements as `Number`, but you cannot add to it. `List<? super Integer>` accepts a list of `Integer` or any supertype, and you can **add** `Integer` values, but what you read is only `Object`.",
        "The memory aid is **PECS: Producer Extends, Consumer Super.** If a structure only gives you values, use `extends`. If it only takes values, use `super`. `List<?>` means a list of an unknown type. `Collections.copy(dest, src)` uses both: `dest` is `List<? super T>` and `src` is `List<? extends T>`.",
      ],
    },
    {
      kind: "code",
      heading: "Producer extends, consumer super",
      example: {
        title: "Wildcards in use",
        language: "java",
        code: 'public class Main {\n  static double sum(List<? extends Number> numbers) {\n    double total = 0;\n    for (Number n : numbers) total += n.doubleValue();\n    return total;\n  }\n\n  static void fill(List<? super Integer> target) {\n    target.add(1);\n    target.add(2);\n  }\n\n  public static void main(String[] args) {\n    System.out.println(sum(List.of(1, 2, 3)) + " " + sum(List.of(1.5, 2.5)));\n    List<Number> numbers = new ArrayList<>();\n    fill(numbers);\n    System.out.println(numbers);\n  }\n}',
        walkthrough: [
          "`sum` only reads from the list, so `? extends Number` is right, and it accepts both integer and double lists.",
          "`fill` only writes `Integer` values, so `? super Integer` is right, and it accepts a `List<Number>`.",
          "The output is `6.0 4.0` and `[1, 2]`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Type erasure",
      body: [
        "Generics are a **compile-time** feature. After the compiler has checked the types, it **erases** them: a `List<String>` becomes a plain `List` in the compiled code, and a type parameter `T` becomes its bound, or `Object`. The compiler inserts the casts for you. This kept compatibility with older code.",
        "The consequences: you cannot write `obj instanceof List<String>`, you cannot create `new T()` or `new T[10]`, you cannot use primitives as type arguments, and you cannot overload two methods that differ only in their type arguments. Pass a `Supplier<T>` or a `Class<T>` when a method needs to create or know the type at run time.",
        "At run time, `List<String>` and `List<Integer>` are the **same class**.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using raw types such as `List`.",
          fix: "Always write the type argument, or `<>`.",
        },
        {
          mistake:
            "Assuming that `List<Integer>` can be passed where `List<Number>` is expected.",
          fix: "Use `List<? extends Number>`.",
        },
        {
          mistake: "Trying to write `new T()` or `instanceof List<String>`.",
          fix: "Pass a `Supplier<T>` or `Class<T>`; check `instanceof List<?>`.",
        },
        {
          mistake: "Trying to add to a `List<? extends Number>`.",
          fix: "A wildcard with extends is read-only. Use `super` to write.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A reusable pair and a utility",
      scenario:
        "A project needs a `Pair<A, B>` and a method that copies one list into another.",
      body: [
        "`record Pair<A, B>(A first, B second) {}` is a generic record. The copy method is `static <T> void copy(List<? super T> dest, List<? extends T> src)`, the PECS signature that the standard library uses.",
        "The signature says exactly what the method reads and what it writes.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "gen-invariant",
      prompt: "Is `List<Integer>` a subtype of `List<Number>`?",
      options: [
        "No, generic types are invariant",
        "Yes, because Integer extends Number",
        "Only for immutable lists",
      ],
      answer: 0,
      explanation: "Use `List<? extends Number>` to accept both.",
    },
    {
      type: "single",
      id: "gen-pecs",
      prompt: "What does PECS stand for?",
      options: [
        "Producer Extends, Consumer Super",
        "Public Extends, Private Super",
        "Parse Extend Copy Set",
      ],
      answer: 0,
      explanation:
        "Use `extends` when you read from a structure, and `super` when you write to it.",
    },
    {
      type: "truefalse",
      id: "gen-runtime",
      statement:
        "At run time, `List<String>` and `List<Integer>` are different classes.",
      answer: false,
      explanation:
        "Type erasure removes the type arguments, so both are `List`.",
    },
    {
      type: "output",
      id: "gen-box",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: "List<String> a = new ArrayList<>();\nList<Integer> b = new ArrayList<>();\nSystem.out.println(a.getClass() == b.getClass());",
      },
      options: ["true", "false", "Compile error"],
      answer: 0,
      explanation: "After erasure both are `ArrayList`.",
    },
  ],
  assignment: {
    title: "Generic toolbox",
    task: [
      "Write a generic `Pair<A, B>`, a bounded method `max(List<T>)` for comparable types, and a PECS method `copy(dest, src)`.",
      "Try to add a value to a `List<? extends Number>` and read the compiler message.",
    ],
    checklist: [
      "The bounded method rejects non-comparable types",
      "copy uses wildcards correctly",
      "I can explain type erasure in my own words",
    ],
    minutes: 35,
  },
  exercises: [
    {
      slug: "gen-ex",
      title: "A generic swap and count",
      task: [
        "Write `static <T> int countMatching(Collection<? extends T> items, Predicate<? super T> test)` that returns how many items pass the test. Use it with a list of integers.",
      ],
      language: "java",
      starter:
        "import java.util.*;\nimport java.util.function.*;\n\npublic class Count {\n  // your code\n}",
      solution:
        "import java.util.*;\nimport java.util.function.*;\n\npublic class Count {\n  static <T> int countMatching(Collection<? extends T> items, Predicate<? super T> test) {\n    int count = 0;\n    for (T item : items) {\n      if (test.test(item)) {\n        count++;\n      }\n    }\n    return count;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(countMatching(List.of(1, 2, 3, 4), n -> n % 2 == 0));\n  }\n}",
      hints: [
        "The collection produces items (`extends`), and the predicate consumes them (`super`).",
      ],
      checklist: [
        "The signature follows PECS",
        "It works for a list of Integer",
        "No raw types are used",
      ],
    },
  ],
  revisionNotes: [
    "Generics give compile-time type safety; no casts; avoid raw types",
    "Bounded types: `<T extends Comparable<T>>`",
    "Invariance; PECS: producer extends, consumer super",
    "Type erasure: no `new T()`, no `instanceof List<String>`, no primitives",
  ],
  resources: [
    {
      label: "The Java Tutorials: Generics",
      url: "https://docs.oracle.com/javase/tutorial/java/generics/index.html",
    },
    {
      label: "The Java Tutorials: Wildcards",
      url: "https://docs.oracle.com/javase/tutorial/java/generics/wildcards.html",
    },
    {
      label: "The Java Tutorials: Type Erasure",
      url: "https://docs.oracle.com/javase/tutorial/java/generics/erasure.html",
    },
  ],
})
