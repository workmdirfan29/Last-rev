import { defineLesson } from "@/data/lessons/author"

export default defineLesson("jvm-memory", {
  slug: "class-loading",
  title: "From source to a running class: the JVM, bytecode and class loading",
  topic: "Class loading",
  minutes: 60,
  overview:
    "Understand the JDK, JRE and JVM, and how the JVM loads, links and initialises a class, with class loaders and parent delegation.",
  objectives: [
    "Explain how javac, bytecode and the JVM work together",
    "Describe loading, linking and initialisation, and when each happens",
    "Explain class loaders and parent delegation",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "JDK, JRE and JVM",
      body: [
        "Java source code in `.java` files is compiled by `javac` into **bytecode** in `.class` files. Bytecode does not depend on the platform. The **JVM** (Java Virtual Machine) loads the classes and runs the bytecode, and each platform has its own JVM. The **JDK** is the development kit: the compiler and tools, plus the runtime. A separate JRE download is no longer offered since Java 9, and a JDK or a custom runtime built with `jlink` is used.",
        "The JVM is a **specification**, and there are several implementations. HotSpot is the most common. The JVM also manages memory, runs the garbage collector, and compiles hot code to native code with the JIT compiler, which later lessons cover.",
      ],
    },
    {
      kind: "explain",
      heading: "Loading, linking, initialisation",
      body: [
        "The JVM prepares a class in three stages, and does it **lazily**, when the class is first needed. **Loading** finds the binary form of the class, usually a `.class` file, and creates a `Class` object. **Linking** has three steps: *verification* checks that the bytecode is valid and safe, *preparation* allocates memory for static fields and gives them **default values**, and *resolution* turns symbolic references into direct ones. **Initialisation** then runs the static initialisers and static blocks and assigns the **real values** to static fields.",
        "A class is initialised **once**, and the JVM makes this thread-safe. It is triggered by actions such as creating an instance, calling a static method, or reading a non-constant static field.",
      ],
    },
    {
      kind: "code",
      heading: "Initialisation happens on first use",
      example: {
        title: "A static block",
        language: "java",
        code: 'public class Main {\n  static class Config {\n    static int value = init();\n    static {\n      System.out.println("Config initialised");\n    }\n    static int init() {\n      System.out.println("init() called");\n      return 42;\n    }\n  }\n\n  public static void main(String[] args) {\n    System.out.println("start");\n    System.out.println(Config.value);\n    System.out.println(Config.value);\n  }\n}',
        walkthrough: [
          "`start` is printed first, because `Config` has not been used yet.",
          "Reading `Config.value` triggers initialisation, and the initialisers run in the order they are written.",
          "The second read does not initialise again. The output is `start`, `init() called`, `Config initialised`, `42`, `42`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Class loaders",
      body: [
        "A **class loader** finds and loads classes. Since Java 9 there are three built in. The **bootstrap** loader loads the core classes, the **platform** loader loads the other standard platform modules, and the **application** loader loads the classes from your class path. They follow **parent delegation**: a loader first asks its parent to load a class, and only if the parent cannot, it tries itself.",
        "This ensures that core classes such as `java.lang.String` always come from the trusted core loader, so an application cannot replace them with its own copy. A class loaded by two different loaders counts as **two different types** at run time. Frameworks and application servers use custom loaders, for example to isolate web applications.",
      ],
    },
    {
      kind: "code",
      heading: "Who loaded this class?",
      example: {
        title: "getClassLoader",
        language: "java",
        code: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(String.class.getClassLoader());\n    System.out.println(Main.class.getClassLoader().getName());\n    System.out.println(Main.class.getClassLoader().getParent().getName());\n  }\n}",
        walkthrough: [
          "`String` is a core class, loaded by the bootstrap loader, which is shown as `null`.",
          "`Main` is loaded by the application loader, called `app`.",
          "Its parent is the platform loader. The output is `null`, `app`, `platform`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Thinking that all classes are loaded when the program starts.",
          fix: "Classes load lazily, on first use.",
        },
        {
          mistake:
            "Mixing up preparation (default values) and initialisation (assigned values).",
          fix: "Preparation gives `0` or `null`. Initialisation runs your code.",
        },
        {
          mistake:
            "Writing your own `java.lang.String` and expecting it to be used.",
          fix: "Parent delegation loads the core class.",
        },
        {
          mistake:
            "Confusing ClassNotFoundException with NoClassDefFoundError.",
          fix: "The first is a failed lookup by name. The second means that a class present at compile time is missing at run time.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A missing jar",
      scenario:
        "An application starts fine but fails with NoClassDefFoundError when a certain page is opened.",
      body: [
        "Classes are loaded lazily, so a missing dependency is noticed only when the code that needs it runs for the first time. Check the class path of the deployed application, and the first error in the log, which may be an `ExceptionInInitializerError` from a failed static initialiser.",
        "Understanding the lazy loading explains why the failure appears late.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "cl-order",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'public class Main {\n  static class A { static { System.out.println("A"); } }\n  public static void main(String[] args) {\n    System.out.println("main");\n    new A();\n    new A();\n  }\n}',
      },
      options: ["main then A once", "A then main", "main then A twice"],
      answer: 0,
      explanation: "The static block runs once, when the class is first used.",
    },
    {
      type: "single",
      id: "cl-delegation",
      prompt: "What does parent delegation mean?",
      options: [
        "A loader asks its parent first",
        "A loader loads everything itself",
        "Loaders load in parallel",
      ],
      answer: 0,
      explanation: "It keeps core classes trusted.",
    },
    {
      type: "truefalse",
      id: "cl-lazy",
      statement: "The JVM loads every class of the program when it starts.",
      answer: false,
      explanation: "Classes are loaded lazily, when they are first needed.",
    },
    {
      type: "single",
      id: "cl-cnfe",
      prompt:
        "A class that existed at compile time is missing at run time. Which is thrown?",
      options: [
        "NoClassDefFoundError",
        "ClassNotFoundException",
        "ClassCastException",
      ],
      answer: 0,
      explanation:
        "`ClassNotFoundException` is for an explicit lookup by name.",
    },
  ],
  assignment: {
    title: "Trace class loading",
    task: [
      "Run a program with `-Xlog:class+load` and find where your own classes appear compared with the core ones.",
      "Write a class with a static block and show exactly when it runs, including when it throws.",
    ],
    checklist: [
      "I can point to my class in the log",
      "I showed lazy initialisation",
      "I can explain NoClassDefFoundError after a failed static block",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "cl-ex",
      title: "Show the order",
      task: [
        "Write a class `Holder` with a static field initialised by a method that prints a message. Print `before` in `main`, then read the field twice, and observe that the message appears once.",
      ],
      language: "java",
      starter: "public class Holder {\n  // your code\n}",
      solution:
        'public class Holder {\n  static int value = load();\n\n  static int load() {\n    System.out.println("loading");\n    return 7;\n  }\n\n  public static void main(String[] args) {\n    System.out.println("before");\n    System.out.println(value + value);\n  }\n}',
      hints: [
        "In this form the class is initialised before `main` runs, so move the field to a nested class to see the laziness.",
      ],
      checklist: [
        "The message is printed once",
        "I can explain when the initialiser ran",
        "The output is correct",
      ],
    },
  ],
  revisionNotes: [
    "javac → bytecode → JVM; JDK = tools + runtime",
    "Load → link (verify, prepare, resolve) → initialise; all lazy; initialisation runs once",
    "Bootstrap, platform and application loaders; parent delegation",
    "ClassNotFoundException (lookup by name) vs NoClassDefFoundError (missing at run time)",
  ],
  resources: [
    {
      label:
        "The Java Virtual Machine Specification: Loading, Linking, and Initializing",
      url: "https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-5.html",
    },
    {
      label: "Java SE API: ClassLoader",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/ClassLoader.html",
    },
  ],
})
