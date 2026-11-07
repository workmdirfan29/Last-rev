import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "varargs-static-and-initialisation",
  title: "Varargs, static members and initialisation order",
  topic: "Advanced Java",
  minutes: 45,
  overview:
    "Write flexible methods with varargs, use static members and static blocks correctly, and know the order in which Java initialises a class and an object.",
  objectives: [
    "Write and call a method with varargs and state its rules",
    "Explain what `static` means for fields, methods and blocks",
    "Predict the order of static blocks, instance blocks and constructors",
  ],
  prerequisites: ["lesson.java-core.packages-and-access"],
  sections: [
    {
      kind: "explain",
      heading: "Varargs",
      body: [
        "A **varargs** parameter lets a method accept zero or more values of one type: `int... numbers`. Inside the method, `numbers` is an ordinary array.",
        "A method can have only one varargs parameter, and it must be the **last** parameter. The caller can pass separate values, nothing at all, or an existing array.",
        "Java prefers a method without varargs when one matches. Because of this, overloading a method with both a fixed and a varargs form can be confusing, so do it rarely.",
      ],
    },
    {
      kind: "code",
      heading: "A varargs method",
      example: {
        title: "Summing any number of values",
        language: "java",
        code: 'public class Maths {\n  static int sum(int... numbers) {\n    int total = 0;\n    for (int n : numbers) {\n      total += n;\n    }\n    return total;\n  }\n\n  static String describe(String label, int... values) {\n    return label + ":" + values.length;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(sum());\n    System.out.println(sum(5));\n    System.out.println(sum(1, 2, 3));\n    System.out.println(sum(new int[]{4, 5}));\n    System.out.println(describe("count", 7, 8));\n  }\n}',
        walkthrough: [
          "`sum()` with no arguments passes an empty array, not `null`, so the total is `0`.",
          "`sum(1, 2, 3)` packs the values into an array for you. An array can also be passed directly.",
          "In `describe`, the varargs parameter comes last, after the fixed `label`.",
          "`String.format` and `Arrays.asList` are well-known varargs methods in the standard library.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "static members",
      body: [
        "A **static** member belongs to the class, not to an object. A static field exists once for the whole class. A static method can be called with the class name and has no `this`, so it cannot use instance fields directly.",
        "Use static for things that do not depend on one object: constants (`static final`), helper methods such as `Math.max`, and counters shared by all objects.",
        "A **static block** runs once, when the class is first loaded. It is used to prepare static data that needs more than one line.",
      ],
    },
    {
      kind: "code",
      heading: "Initialisation order",
      example: {
        title: "Static block, instance block and constructor",
        language: "java",
        code: 'public class Order {\n  static int created;\n  int id;\n\n  static {\n    System.out.println("static block");\n  }\n\n  {\n    System.out.println("instance block");\n  }\n\n  Order() {\n    created++;\n    id = created;\n    System.out.println("constructor " + id);\n  }\n\n  public static void main(String[] args) {\n    new Order();\n    new Order();\n  }\n}',
        walkthrough: [
          "When the class loads, the **static block** runs first, and only once. It prints `static block`.",
          "Each `new Order()` then runs the **instance block**, and after it the **constructor**.",
          "The output is: `static block`, `instance block`, `constructor 1`, `instance block`, `constructor 2`.",
          "`created` is static, so it is shared and keeps counting. `id` is per object.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Placing the varargs parameter before another parameter.",
          fix: "Varargs must be the last parameter, and there can be only one.",
        },
        {
          mistake: "Using an instance field inside a static method.",
          fix: "A static method has no object. Pass the value in, or make the method non-static.",
        },
        {
          mistake:
            "Using a static field to hold data that is really per object.",
          fix: "Make it an instance field. A static field is shared, so one object would change it for every other.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A logging helper and an id generator",
      scenario:
        "A service needs a simple log method that accepts several values, and every new record needs a unique id.",
      body: [
        "A method `log(String message, Object... args)` can fill placeholders using `String.format(message, args)`, so callers can pass any number of values.",
        "For ids, a `private static int nextId` with a `static int next()` method gives numbers from one place. In a multi-threaded program that counter would need protection, which a later lesson covers.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "varargs-empty-call",
      prompt:
        "What is printed when the varargs method is called with no arguments?",
      code: {
        language: "java",
        code: "static int count(int... n) {\n  return n.length;\n}\nSystem.out.println(count());",
      },
      options: ["0", "null", "A compile error"],
      answer: 0,
      explanation:
        "With no arguments the parameter is an empty array, so its length is 0.",
    },
    {
      type: "output",
      id: "init-order",
      prompt: "In what order does this print?",
      code: {
        language: "java",
        code: 'class A {\n  static { System.out.print("S "); }\n  { System.out.print("I "); }\n  A() { System.out.print("C "); }\n}\nnew A();\nnew A();',
      },
      options: ["S I C I C", "S I C S I C", "I C I C S"],
      answer: 0,
      explanation:
        "The static block runs once, when the class loads. The instance block and the constructor run for every object.",
    },
    {
      type: "truefalse",
      id: "static-instance-access",
      statement:
        "A static method can use an instance field of its class directly.",
      answer: false,
      explanation:
        "A static method belongs to the class and has no current object, so it cannot reach instance fields without an object reference.",
    },
    {
      type: "multi",
      id: "varargs-rules",
      prompt: "Which statements about varargs are true?",
      options: [
        "It must be the last parameter",
        "A method can have only one",
        "Inside the method it behaves like an array",
        "It can be placed first, before other parameters",
      ],
      answers: [0, 1, 2],
      explanation:
        "The varargs parameter is last, only one is allowed, and it is an array inside the method.",
    },
  ],
  assignment: {
    title: "Statistics with varargs",
    task: [
      "Write a class `Stats` with static methods `max(int... values)` and `average(int... values)`.",
      "Decide what each method does when it is called with no values, and write your decision in a comment. Test with no values, one value and several values.",
    ],
    checklist: [
      "Both methods accept zero, one or many values",
      "The empty case is handled on purpose and documented",
      "`average` returns a decimal",
    ],
    hints: [
      "An empty array has no maximum. Throwing `IllegalArgumentException` is a clear choice.",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "join-with-separator",
      title: "Join words",
      task: [
        'Write `static String join(String separator, String... words)` that returns the words joined by the separator. `join("-", "a", "b", "c")` gives `a-b-c`, and no words gives an empty string.',
      ],
      language: "java",
      starter:
        'public class Joiner {\n  static String join(String separator, String... words) {\n    // your code\n    return "";\n  }\n}',
      solution:
        "public class Joiner {\n  static String join(String separator, String... words) {\n    StringBuilder sb = new StringBuilder();\n    for (int i = 0; i < words.length; i++) {\n      if (i > 0) {\n        sb.append(separator);\n      }\n      sb.append(words[i]);\n    }\n    return sb.toString();\n  }\n}",
      hints: ["Add the separator before every word except the first."],
      checklist: [
        "No words returns an empty string",
        "One word has no separator",
        "I used a StringBuilder",
      ],
    },
  ],
  revisionNotes: [
    "Varargs: last parameter, only one, an array inside",
    "static belongs to the class and has no `this`",
    "Static block once, then instance block and constructor per object",
    "Constants: `static final`",
  ],
  resources: [
    {
      label:
        "The Java Tutorials: Passing Information to a Method (arbitrary number of arguments)",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html",
    },
    {
      label: "The Java Tutorials: Understanding Class Members",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html",
    },
    {
      label: "The Java Tutorials: Initializing Fields",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/initial.html",
    },
  ],
})
