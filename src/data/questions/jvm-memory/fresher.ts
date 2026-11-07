import { defineQuestions } from "../author"
import { g } from "../brief"

const JVMS = "https://docs.oracle.com/javase/specs/jvms/se21/html"
const GC = "https://docs.oracle.com/en/java/javase/21/gctuning"
const TS = "https://docs.oracle.com/en/java/javase/21/troubleshoot"
const API =
  "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang"

export default defineQuestions("jvm-memory", "fresher", [
  g({
    slug: "jdk-jre-jvm",
    topic: "Class loading",
    d: "easy",
    title: "What is the difference between the JDK, the JRE and the JVM?",
    kw: ["JDK", "JRE", "JVM", "bytecode", "javac"],
    intent: "Checks that you know how Java source becomes a running program.",
    short:
      'The JVM, the Java Virtual Machine, is the engine that loads compiled classes and runs their bytecode. The JRE was the runtime package that contained the JVM and the standard class libraries. The JDK is the development kit: it contains everything in the runtime plus tools such as the compiler `javac`, `jar`, `jlink` and the diagnostic tools. The compiler turns `.java` source into platform-independent bytecode in `.class` files, and each platform has a JVM that runs that bytecode, which is how Java achieves "write once, run anywhere".',
    detail: [
      "Since Java 9, a separate JRE download is no longer offered, and a JDK or a custom runtime made with `jlink` is used.",
      "The JVM is a specification, and there are several implementations. HotSpot is the most common.",
      "The JVM also manages memory and runs the garbage collector and the JIT compiler.",
    ],
    ex: "You write `Hello.java`, compile it with `javac` into `Hello.class`, and run it with `java Hello`, where the JVM loads and executes the bytecode.",
    mistakes: [
      "Saying that Java source code is run directly by the JVM. It runs bytecode.",
      "Saying that the JVM is platform-independent. The bytecode is, and each platform has its own JVM.",
    ],
    follow: ["What is bytecode?"],
    points: [
      "javac: source → bytecode",
      "JVM runs bytecode",
      "JDK = tools + runtime",
    ],
    notes: "JDK = compiler and tools + runtime. JVM = executes bytecode.",
    src: [
      [
        "The Java Virtual Machine Specification: Introduction",
        `${JVMS}/jvms-1.html`,
      ],
      [
        "The Java Tutorials: The Java Platform",
        "https://docs.oracle.com/javase/tutorial/getStarted/intro/definition.html",
      ],
    ],
  }),
  g({
    slug: "class-loading-process",
    topic: "Class loading",
    d: "medium",
    title:
      "How does the JVM load a class? Explain loading, linking and initialisation.",
    kw: [
      "class loading",
      "linking",
      "verification",
      "preparation",
      "initialization",
    ],
    intent:
      "Checks that you know the stages between a `.class` file and a usable class.",
    short:
      "The JVM works on a class in three stages. Loading finds the binary form of the class, usually a `.class` file, and creates a `Class` object for it. Linking has three steps: verification checks that the bytecode is valid and safe, preparation allocates memory for static fields and gives them default values, and resolution turns symbolic references into direct references. Initialisation then runs the static initialisers and static blocks and assigns the real values to the static fields. Classes are loaded lazily, when they are first needed.",
    detail: [
      "A class is initialised only once, and the JVM makes this thread-safe.",
      "Initialisation is triggered by actions such as creating an instance, calling a static method or reading a non-constant static field.",
      "Verification is a reason why the JVM can run untrusted bytecode safely.",
    ],
    ex: "Printing in a static block shows the stage: the message appears the first time that the class is used, not when the program starts.",
    code: [
      "Initialisation happens on first use",
      'class Config {\n  static int value = init();\n  static {\n    System.out.println("Config initialised");\n  }\n  static int init() {\n    System.out.println("init() called");\n    return 42;\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("start");\n    System.out.println(Config.value);\n  }\n}',
      [
        "`start` is printed first, because `Config` has not been used yet.",
        "Reading `Config.value` triggers initialisation, in textual order.",
        "The output is `start`, `init() called`, `Config initialised`, `42`.",
      ],
      "java",
    ],
    mistakes: [
      "Thinking that all classes are loaded when the program starts.",
      "Mixing up preparation (default values) and initialisation (the assigned values).",
    ],
    follow: ["What triggers class initialisation?"],
    points: [
      "Loading → linking → initialisation",
      "Linking: verify, prepare, resolve",
      "Lazy and thread-safe",
    ],
    notes:
      "Load → Link (verify, prepare, resolve) → Initialise (static init). All lazy.",
    src: [
      [
        "The Java Virtual Machine Specification: Loading, Linking, and Initializing",
        `${JVMS}/jvms-5.html`,
      ],
      ["Java SE API: ClassLoader", `${API}/ClassLoader.html`],
    ],
  }),
  g({
    slug: "classloader-hierarchy",
    topic: "Class loading",
    d: "medium",
    title: "What are class loaders and what is parent delegation?",
    kw: [
      "ClassLoader",
      "bootstrap",
      "platform",
      "application class loader",
      "parent delegation",
    ],
    intent:
      "Checks that you know who loads which classes, and why core classes cannot be replaced.",
    short:
      "A class loader is the part of the runtime that finds and loads classes. In Java 9 and later there are three built-in loaders. The bootstrap loader loads the core Java classes, the platform loader loads other standard platform modules, and the application (system) loader loads classes from the application's class path. They follow parent delegation: a loader first asks its parent to load a class, and only if the parent cannot, it tries itself. This ensures that core classes, such as `java.lang.String`, always come from the trusted core loader, and not from an application's own copy.",
    detail: [
      "The same class loaded by two different loaders counts as two different types at run time.",
      "Frameworks and application servers use custom loaders, for example to isolate web applications from each other.",
      "`ClassLoader.getSystemClassLoader()` returns the application loader.",
    ],
    ex: "A web server gives each deployed application its own class loader, so two applications can use different versions of the same library.",
    code: [
      "Which loader loaded this class?",
      "public class Main {\n  public static void main(String[] args) {\n    System.out.println(Main.class.getClassLoader());\n    System.out.println(String.class.getClassLoader());\n  }\n}",
      [
        "`Main` is loaded by the application class loader, which is printed.",
        "`String` is a core class, loaded by the bootstrap loader, which is shown as `null`.",
      ],
      "java",
    ],
    mistakes: [
      "Writing a class named `java.lang.String` and expecting it to replace the real one.",
      "Assuming that one class loaded by two loaders is the same type.",
    ],
    follow: ["Why does parent delegation matter for security?"],
    points: [
      "Bootstrap, platform, application loaders",
      "Parent first, then self",
      "Same class, different loader = different type",
    ],
    notes:
      "Class loaders delegate to their parent first, so core classes stay trusted.",
    src: [
      ["Java SE API: ClassLoader", `${API}/ClassLoader.html`],
      [
        "The Java Virtual Machine Specification: Creation and Loading",
        `${JVMS}/jvms-5.html#jvms-5.3`,
      ],
    ],
  }),
  g({
    slug: "classnotfound-vs-noclassdeffound",
    topic: "Class loading",
    d: "medium",
    title:
      "What is the difference between `ClassNotFoundException` and `NoClassDefFoundError`?",
    kw: [
      "ClassNotFoundException",
      "NoClassDefFoundError",
      "classpath",
      "Class.forName",
      "ExceptionInInitializerError",
    ],
    intent:
      "Checks a classic question that tests understanding of class loading failures.",
    short:
      '`ClassNotFoundException` is a checked exception that is thrown when code asks the loader to load a class by name at run time, with `Class.forName("x.Y")` or `loadClass`, and the class is not on the class path. `NoClassDefFoundError` is an `Error` that is thrown when a class that was present when the code was compiled cannot be found or initialised at run time, for example when a dependency jar is missing in deployment, or when a static initialiser failed earlier. The first is about an explicit lookup that fails, and the second is about a normal reference to a class that is not available.',
    detail: [
      "A common fix for both is to check the class path or the build's dependencies.",
      "If a static initialiser throws, the first use gives `ExceptionInInitializerError`, and later uses give `NoClassDefFoundError`.",
      "`ClassNotFoundException` can be caught, but `NoClassDefFoundError` signals a broken environment.",
    ],
    ex: "A database driver loaded by name that is missing from the class path gives `ClassNotFoundException`, and a library jar left out of the deployed application gives `NoClassDefFoundError`.",
    mistakes: [
      "Treating both as the same problem.",
      "Looking only at the class path when the real cause was a failed static initialiser.",
    ],
    follow: ["What is ExceptionInInitializerError?"],
    points: [
      "ClassNotFoundException: checked, explicit lookup fails",
      "NoClassDefFoundError: Error, class missing at run time",
      "Static initialiser failures lead to the Error",
    ],
    notes:
      "ClassNotFoundException = lookup by name failed. NoClassDefFoundError = compiled-against class missing at run time.",
    src: [
      [
        "Java SE API: ClassNotFoundException",
        `${API}/ClassNotFoundException.html`,
      ],
      ["Java SE API: NoClassDefFoundError", `${API}/NoClassDefFoundError.html`],
    ],
  }),
  g({
    slug: "jvm-runtime-data-areas",
    topic: "Heap vs stack",
    d: "easy",
    title: "What are the main memory areas of the JVM?",
    kw: ["heap", "stack", "metaspace", "program counter", "runtime data areas"],
    intent: "Checks that you can name the areas and say what lives in each.",
    short:
      "The heap is shared by all threads and holds objects and arrays, and it is managed by the garbage collector. Each thread has its own stack, which holds a frame for every method call, with its local variables, parameters and partial results. Class metadata, such as the structure of classes, method code and the run-time constant pool, is kept in the method area, which HotSpot implements as Metaspace in native memory since Java 8. Each thread also has a program counter that points to the instruction being executed, and a native method stack for native code.",
    detail: [
      "The heap and the method area are shared, and the stack and program counter are per thread.",
      "The string pool lives in the heap since Java 7.",
      "Memory used by the JVM itself, such as thread stacks, the code cache and direct buffers, is outside the heap.",
    ],
    ex: "In `Order o = new Order();` the local variable `o` is in the stack frame, and the `Order` object is on the heap.",
    mistakes: [
      "Saying that all variables are stored on the heap.",
      "Believing that `-Xmx` limits all the memory that the JVM process uses.",
    ],
    follow: ["What is stored in a stack frame?"],
    points: [
      "Heap: objects, shared",
      "Stack: frames per thread",
      "Metaspace: class metadata",
    ],
    notes:
      "Heap (shared), stack (per thread), Metaspace (class data), PC register, native stack.",
    src: [
      [
        "The Java Virtual Machine Specification: Run-Time Data Areas",
        `${JVMS}/jvms-2.html#jvms-2.5`,
      ],
      [
        "Java Troubleshooting Guide: Memory",
        `${TS}/troubleshoot-memory-leaks.html`,
      ],
    ],
  }),
  g({
    slug: "heap-vs-stack",
    topic: "Heap vs stack",
    d: "easy",
    title: "What is the difference between stack memory and heap memory?",
    kw: ["stack", "heap", "local variable", "object", "StackOverflowError"],
    intent:
      "Checks one of the most common memory questions with a correct and precise answer.",
    short:
      "The stack is a small, fast, per-thread area where each method call gets a frame with its local variables and parameters. A frame is removed automatically when the method returns, so the stack needs no garbage collection, and it is limited in size, so very deep recursion causes `StackOverflowError`. The heap is a large area shared by all threads, where all objects and arrays are created with `new`. Objects stay there until the garbage collector finds that nothing refers to them, and if it fills up, you get `OutOfMemoryError`. Local primitives live on the stack, and local object variables are references on the stack that point to heap objects.",
    detail: [
      "Data on the stack is private to its thread, so it is thread-safe, and heap objects can be shared, so they may need synchronisation.",
      "The JIT compiler can sometimes avoid heap allocation for objects that never escape a method.",
      "The stack size per thread is set with `-Xss`, and the heap limits with `-Xms` and `-Xmx`.",
    ],
    ex: "A recursive method without a base case fills the stack and throws `StackOverflowError`, while a loop that keeps adding to a list fills the heap.",
    code: [
      "Where things live",
      'void process() {\n  int count = 5;                 // primitive: in this method\'s stack frame\n  String name = "Asha";          // reference in the frame, string object in the heap\n  List<Integer> list = new ArrayList<>(); // reference in the frame, list object in the heap\n}',
      [
        "`count` is a local primitive, held directly in the stack frame.",
        "`name` and `list` are references on the stack, pointing to objects on the heap.",
        "When `process` returns, the frame is gone, and the objects may be collected.",
      ],
      "java",
    ],
    mistakes: [
      "Saying that objects are stored on the stack.",
      "Confusing `StackOverflowError` (stack) with `OutOfMemoryError` (heap).",
    ],
    follow: ["What causes StackOverflowError?"],
    points: [
      "Stack: frames, per thread, no GC",
      "Heap: objects, shared, garbage collected",
      "StackOverflowError vs OutOfMemoryError",
    ],
    notes: "Stack = per-thread frames. Heap = shared objects with GC.",
    src: [
      [
        "The Java Virtual Machine Specification: Run-Time Data Areas",
        `${JVMS}/jvms-2.html#jvms-2.5`,
      ],
      ["Java SE API: StackOverflowError", `${API}/StackOverflowError.html`],
    ],
  }),
  g({
    slug: "young-and-old-generation",
    topic: "Heap vs stack",
    d: "medium",
    title: "What are the young and old generations of the heap?",
    kw: [
      "young generation",
      "old generation",
      "Eden",
      "survivor space",
      "promotion",
    ],
    intent: "Checks that you know why the heap is divided.",
    short:
      "Most collectors split the heap by object age because of the generational hypothesis: most objects die young. New objects are created in the young generation, in a part called Eden. When Eden fills, a minor collection copies the live objects into a survivor space, and the rest is freed. Objects that survive several collections are promoted to the old generation, which holds long-lived objects and is collected less often, but at a higher cost. Collecting only the young generation is quick, which is why this design gives good performance.",
    detail: [
      "There are two survivor spaces, and live objects move between them with each minor collection.",
      "The old generation can fill up with objects that should have been short-lived, if the young generation is too small.",
      "G1 uses the same idea with a heap that is divided into many equal regions.",
    ],
    ex: "Temporary strings created while handling a request die in Eden, and a cache that the application keeps for hours moves into the old generation.",
    mistakes: [
      "Thinking that every object is promoted to the old generation at once.",
      "Assuming that the layout is identical in all collectors.",
    ],
    follow: ["What is a minor GC?"],
    points: [
      "Most objects die young",
      "Eden → survivor → old",
      "Young collections are fast",
    ],
    notes:
      "Young gen (Eden + survivors) collected often; survivors are promoted to the old gen.",
    src: [
      [
        "HotSpot GC Tuning Guide: Garbage Collector Implementation",
        `${GC}/garbage-collector-implementation.html`,
      ],
      ["HotSpot GC Tuning Guide: Introduction", `${GC}/introduction.html`],
    ],
  }),
  g({
    slug: "metaspace-vs-permgen",
    topic: "Heap vs stack",
    d: "medium",
    title: "What is Metaspace and how is it different from PermGen?",
    kw: [
      "Metaspace",
      "PermGen",
      "class metadata",
      "MaxMetaspaceSize",
      "Java 8",
    ],
    intent: "Checks that you know a change between old and new JVM versions.",
    short:
      "Both hold class metadata. Before Java 8, HotSpot stored it in the Permanent Generation, a fixed-size part of the Java heap, so a large or growing number of classes could cause `OutOfMemoryError: PermGen space`. Since Java 8, the metadata is stored in Metaspace, which is in native memory and grows as needed, by default until the operating system's limit. You can still cap it with `-XX:MaxMetaspaceSize`. A Metaspace `OutOfMemoryError` still occurs, for example when an application keeps loading new classes without unloading them.",
    detail: [
      "Metaspace is cleaned up when the class loaders that loaded the classes become unreachable.",
      "Repeated redeployments in an application server can leak class loaders.",
      "Strings in the string pool moved to the heap in Java 7, so they are not in the Metaspace.",
    ],
    ex: "A server that is redeployed many times without a restart can run out of Metaspace because old class loaders are still referenced.",
    mistakes: [
      "Saying that PermGen still exists in current Java versions.",
      "Assuming that Metaspace is unlimited and cannot run out.",
    ],
    follow: ["How do you limit Metaspace?"],
    points: [
      "PermGen (up to Java 7): in the heap, fixed",
      "Metaspace (Java 8+): native memory, grows",
      "Cap with MaxMetaspaceSize",
    ],
    notes:
      "Metaspace replaced PermGen in Java 8: class metadata in native memory.",
    src: [
      [
        "HotSpot GC Tuning Guide: Other Considerations (Class Metadata)",
        `${GC}/other-considerations.html`,
      ],
      [
        "Java Troubleshooting Guide: Memory Leaks",
        `${TS}/troubleshoot-memory-leaks.html`,
      ],
    ],
  }),
  g({
    slug: "string-pool-and-heap",
    topic: "Heap vs stack",
    d: "medium",
    title: "Where is the string pool, and how does it relate to the heap?",
    kw: ["string pool", "intern", "string literal", "heap", "new String"],
    intent: "Checks that you connect string behaviour to memory.",
    short:
      'The string pool, or string intern pool, is a table of unique `String` objects that is kept in the heap since Java 7. String literals such as `"java"` are placed in the pool, so two equal literals refer to the same object. `new String("java")` always creates a separate object on the heap, even when an equal literal is in the pool. The `intern()` method returns the pooled instance for a string with the same content, adding it if needed. This is why `==` on strings can give surprising results, and `equals` should be used to compare contents.',
    detail: [
      "Pooled strings can be garbage collected when nothing refers to them.",
      "Because strings are immutable, sharing them is safe.",
      "Interning many unique strings can use a lot of memory and slow things down.",
    ],
    ex: '`"a" == "a"` is true because both are the same pooled literal, while `new String("a") == "a"` is false.',
    code: [
      "Pool and new",
      'String a = "java";\nString b = "java";\nString c = new String("java");\n\nSystem.out.println(a == b);\nSystem.out.println(a == c);\nSystem.out.println(a == c.intern());\nSystem.out.println(a.equals(c));',
      [
        "`a` and `b` are the same pooled object, so `a == b` is `true`.",
        "`c` is a separate heap object, so `a == c` is `false`.",
        "`c.intern()` returns the pooled object, so the third line is `true`.",
        "`equals` compares the contents, so the last line is `true`.",
      ],
      "java",
    ],
    mistakes: [
      "Comparing strings with `==`.",
      "Calling `intern()` on lots of unique strings.",
    ],
    follow: ["What does intern do?"],
    points: [
      "Pool is in the heap (Java 7+)",
      "Literals are pooled, new String is not",
      "Compare with equals",
    ],
    notes:
      "String pool is in the heap. Literals share one object; `new String` makes another.",
    src: [
      ["Java SE API: String.intern", `${API}/String.html#intern()`],
      [
        "The Java Virtual Machine Specification: Run-Time Constant Pool",
        `${JVMS}/jvms-5.html#jvms-5.1`,
      ],
    ],
  }),
  g({
    slug: "what-is-garbage-collection",
    topic: "Garbage collection",
    d: "easy",
    title:
      "What is garbage collection and how does the JVM decide that an object is garbage?",
    kw: [
      "garbage collection",
      "reachability",
      "GC roots",
      "unreachable",
      "automatic memory management",
    ],
    intent:
      "Checks that you know that it is reachability and not a reference count.",
    short:
      "Garbage collection is the automatic reclaiming of heap memory used by objects that the program can no longer use. The JVM treats an object as garbage when it is unreachable: no chain of references leads to it from a GC root. GC roots include local variables and parameters on the stacks of live threads, static fields of loaded classes, and references held by the JVM or native code. The collector finds all reachable objects by tracing from the roots, and reclaims the rest. This also handles cycles, because two objects that refer only to each other are still unreachable.",
    detail: [
      "Java does not use reference counting.",
      "You cannot free an object yourself. You can only make it unreachable, for example by setting a reference to `null` or letting it go out of scope.",
      "Objects with a finalizer used to need an extra step, but finalization is deprecated.",
    ],
    ex: "After `list = null`, the list and the elements that only it referred to become eligible for collection.",
    mistakes: [
      "Believing that an object is freed at the moment it goes out of scope.",
      "Saying that a reference cycle prevents collection.",
    ],
    follow: ["What counts as a GC root?"],
    points: [
      "Reclaims unreachable objects",
      "Tracing from GC roots",
      "Cycles are collected",
    ],
    notes:
      "GC frees objects not reachable from any GC root. No reference counting.",
    src: [
      ["HotSpot GC Tuning Guide: Introduction", `${GC}/introduction.html`],
      [
        "The Java Tutorials: Garbage Collection (Objects)",
        "https://docs.oracle.com/javase/tutorial/java/javaOO/objectcreation.html",
      ],
    ],
  }),
  g({
    slug: "minor-vs-major-gc",
    topic: "Garbage collection",
    d: "medium",
    title:
      "What are minor, major and full garbage collections? What is stop-the-world?",
    kw: ["minor GC", "major GC", "full GC", "stop-the-world", "pause"],
    intent: "Checks that you understand the cost model of collections.",
    short:
      "A minor (young) collection cleans only the young generation. It is frequent, usually short, and moves survivors on. A major or old collection cleans the old generation, and a full collection cleans the whole heap, sometimes including class metadata. They take longer. During some phases of a collection, all application threads must stop, which is called a stop-the-world pause. Modern collectors do much of their work concurrently with the application to keep pauses short, but some pauses remain. Long or frequent pauses show up as latency spikes.",
    detail: [
      "A full collection is often a sign of trouble, for example when the old generation is nearly full.",
      "Throughput is the share of time spent running the application, and latency is the length of the pauses. Collectors trade between them.",
      "GC logs show the type, the duration and the memory before and after each collection.",
    ],
    ex: "A web service that has a pause of two seconds every few minutes has probably got full collections, which a log can confirm.",
    mistakes: [
      "Saying that garbage collection never pauses the application.",
      "Ignoring a rising number of full collections.",
    ],
    follow: ["What is the difference between throughput and latency in GC?"],
    points: [
      "Minor: young only, frequent",
      "Full: whole heap, expensive",
      "Stop-the-world pauses",
    ],
    notes:
      "Minor = young generation. Full = whole heap. Stop-the-world = application threads paused.",
    src: [
      [
        "HotSpot GC Tuning Guide: Generations",
        `${GC}/garbage-collector-implementation.html`,
      ],
      [
        "HotSpot GC Tuning Guide: Garbage Collector Selection",
        `${GC}/available-collectors.html`,
      ],
    ],
  }),
  g({
    slug: "garbage-collectors-available",
    topic: "Garbage collection",
    d: "medium",
    title:
      "Which garbage collectors does HotSpot offer, and which is the default?",
    kw: ["G1", "ZGC", "Parallel GC", "Serial GC", "default collector"],
    intent: "Checks that you can name the collectors and what each is for.",
    short:
      "HotSpot offers several collectors. The Serial collector uses one thread and suits small heaps and single-processor machines. The Parallel collector uses several threads to maximise throughput. G1, the Garbage-First collector, divides the heap into regions and tries to meet a pause-time goal, and it is the default on server-class machines since Java 9. ZGC is designed for very short pauses, even on large heaps, by doing most of its work concurrently. You choose one with a flag such as `-XX:+UseG1GC` or `-XX:+UseZGC`.",
    detail: [
      "The default is chosen from the machine's memory and processors, so check the documentation of your Java version.",
      "Start with the default and change it only after measuring a real problem.",
      "The collector that is in use appears in the startup information and in the GC logs.",
    ],
    ex: "A batch job that runs for hours may prefer the Parallel collector, while a latency-sensitive service may choose G1 or ZGC.",
    mistakes: [
      "Switching collectors without measuring the application's pauses and throughput.",
      "Assuming that the default is always the same in every Java version.",
    ],
    follow: ["How would you find which collector a JVM is using?"],
    points: [
      "Serial, Parallel, G1, ZGC",
      "G1 is the usual default",
      "Choose by measuring",
    ],
    notes:
      "Serial (small), Parallel (throughput), G1 (balanced default), ZGC (low pauses).",
    src: [
      [
        "HotSpot GC Tuning Guide: Available Collectors",
        `${GC}/available-collectors.html`,
      ],
      ["HotSpot GC Tuning Guide: Ergonomics", `${GC}/ergonomics.html`],
    ],
  }),
  g({
    slug: "reference-types",
    topic: "Garbage collection",
    d: "hard",
    title: "What are strong, soft, weak and phantom references?",
    kw: [
      "WeakReference",
      "SoftReference",
      "PhantomReference",
      "strong reference",
      "WeakHashMap",
    ],
    intent:
      "Checks that you know how references influence what the collector can free.",
    short:
      "A strong reference, the normal kind, keeps its object alive. A `SoftReference` is cleared by the collector only when memory is low, before it would throw `OutOfMemoryError`, which suits memory-sensitive caches. A `WeakReference` does not keep its object alive: it is cleared at the next collection once the object is only weakly reachable, which is used for maps such as `WeakHashMap`. A `PhantomReference` always returns `null` from `get()` and, with a `ReferenceQueue`, tells you that an object has been collected, so that you can do cleanup afterwards.",
    detail: [
      "A `ReferenceQueue` receives the reference objects after the referent is cleared.",
      "`WeakHashMap` removes an entry when its key is no longer strongly reachable.",
      "`java.lang.ref.Cleaner` is the modern replacement for finalizers.",
    ],
    ex: "A cache of image previews holds the images through soft references, so the JVM can free them when memory is short.",
    code: [
      "A weak reference is cleared",
      "Object payload = new Object();\nWeakReference<Object> weak = new WeakReference<>(payload);\n\nSystem.out.println(weak.get() != null);\npayload = null;\nSystem.gc();\nSystem.out.println(weak.get() == null);",
      [
        "While `payload` is strongly reachable, the weak reference returns the object.",
        "After `payload = null`, only the weak reference remains, so the object can be collected.",
        "`System.gc()` is only a hint, so the second line is usually, but not always, `true`.",
      ],
      "java",
    ],
    mistakes: [
      "Using soft references as a precise cache with a size limit.",
      "Relying on `System.gc()` to clear a reference at a specific moment.",
    ],
    follow: ["How does WeakHashMap work?"],
    points: [
      "Strong keeps alive",
      "Soft: cleared when memory is low",
      "Weak: cleared at next GC; phantom: cleanup notification",
    ],
    notes:
      "Strong > soft (low memory) > weak (next GC) > phantom (post-mortem).",
    src: [
      [
        "Java SE API: java.lang.ref",
        "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/ref/package-summary.html",
      ],
      [
        "Java SE API: WeakHashMap",
        "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/WeakHashMap.html",
      ],
    ],
  }),
  g({
    slug: "system-gc-and-finalize",
    topic: "Garbage collection",
    d: "easy",
    title:
      "Does `System.gc()` force garbage collection? What about `finalize()`?",
    kw: ["System.gc", "finalize", "Cleaner", "hint", "deprecated"],
    intent:
      "Checks that you do not believe that the program controls the collector.",
    short:
      "`System.gc()` only suggests to the JVM that it might run a collection. The JVM may run it or ignore it, so it is not a way to free memory on demand, and calling it in a production program is usually a bad idea, because a full collection can cause a long pause. `finalize()` was a method that the collector called before reclaiming an object, but it has no guarantee about when or even whether it runs. It is deprecated for removal. Use try-with-resources to release resources, and `Cleaner` for last-resort cleanup.",
    detail: [
      "Some flags, such as `-XX:+DisableExplicitGC`, make the JVM ignore `System.gc()` calls.",
      "Code that depends on `finalize` for correctness is broken by design.",
      "A test that checks for collection with `System.gc()` is fragile.",
    ],
    ex: "A library that called `System.gc()` after each request caused long pauses until the call was removed.",
    mistakes: [
      'Calling `System.gc()` to "fix" memory problems.',
      "Closing files and connections in `finalize`.",
    ],
    follow: ["What should you use instead of finalize?"],
    points: [
      "System.gc() is a hint",
      "finalize is deprecated and unpredictable",
      "Use try-with-resources and Cleaner",
    ],
    notes: "`System.gc()` is only a hint. Do not rely on `finalize()`.",
    src: [
      ["Java SE API: Runtime.gc", `${API}/Runtime.html#gc()`],
      ["Java SE API: Object.finalize", `${API}/Object.html#finalize()`],
    ],
  }),
  g({
    slug: "jvm-memory-flags",
    topic: "Garbage collection",
    d: "easy",
    title: "What do `-Xms`, `-Xmx` and `-Xss` do?",
    kw: ["-Xms", "-Xmx", "-Xss", "heap size", "JVM options"],
    intent: "Checks that you can set the basic memory options of a JVM.",
    short:
      "`-Xms` sets the initial heap size, and `-Xmx` sets the maximum heap size. For example, `java -Xms512m -Xmx2g -jar app.jar` starts with 512 MB and lets the heap grow to 2 GB. `-Xss` sets the stack size of each thread, such as `-Xss1m`, which matters for deep recursion and for the memory used by many threads. In containers, the JVM can size the heap from the container's memory limit, and `-XX:MaxRAMPercentage` sets the share it may use. The total memory of the process is larger than the heap.",
    detail: [
      "Setting `-Xms` equal to `-Xmx` avoids resizing the heap at run time, and some teams do it for servers.",
      "A heap that is too large causes long collections, and one that is too small causes frequent ones.",
      "Metaspace, thread stacks, the code cache and direct buffers are not part of `-Xmx`.",
    ],
    ex: "A service in a container with a 2 GB limit gets `-XX:MaxRAMPercentage=70` so that the heap leaves room for the other memory.",
    mistakes: [
      "Setting `-Xmx` equal to the container's whole memory.",
      "Raising `-Xss` for all threads when only one task needs deep recursion.",
    ],
    follow: ["What memory does the JVM use outside the heap?"],
    points: [
      "-Xms initial, -Xmx maximum heap",
      "-Xss thread stack size",
      "Process memory is more than the heap",
    ],
    notes: "`-Xms` initial heap, `-Xmx` max heap, `-Xss` thread stack size.",
    src: [
      [
        "The java Command (options)",
        "https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html",
      ],
      [
        "HotSpot GC Tuning Guide: Sizing the Generations",
        `${GC}/factors-affecting-garbage-collection-performance.html`,
      ],
    ],
  }),
  g({
    slug: "gc-logging",
    topic: "Garbage collection",
    d: "medium",
    title: "How do you see what the garbage collector is doing?",
    kw: ["-Xlog:gc", "GC log", "jstat", "Java Flight Recorder", "jcmd"],
    intent: "Checks that you diagnose with data and not by guessing.",
    short:
      "Turn on GC logging with the unified logging option, such as `-Xlog:gc` for a summary of every collection, or `-Xlog:gc*` for more detail. Each line shows the collection type, the heap size before and after, and how long it took. The `jstat -gcutil <pid>` tool shows live GC statistics from a running JVM, and Java Flight Recorder records detailed events with little overhead. Look at the frequency of collections, the pause times and whether the memory after a full collection keeps growing.",
    detail: [
      "Logs can be written to a file with rotation: `-Xlog:gc:file=gc.log`.",
      "Tools such as GCViewer or a profiler can visualise the log.",
      "Always measure before changing flags.",
    ],
    ex: "A GC log shows that the heap after each full collection grows by 5%, which points to a memory leak.",
    mistakes: [
      "Tuning GC options without any log.",
      "Using the old, pre-Java 9 logging flags on a newer JVM.",
    ],
    follow: ["What does a growing heap after full GC suggest?"],
    points: [
      "-Xlog:gc for logs",
      "jstat and JFR for live data",
      "Look at pauses and memory after GC",
    ],
    notes:
      "`-Xlog:gc`, `jstat -gcutil`, JFR. Watch pauses and heap after full GC.",
    src: [
      [
        "The java Command (-Xlog)",
        "https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html",
      ],
      [
        "HotSpot GC Tuning Guide: Garbage Collector Implementation",
        `${GC}/garbage-collector-implementation.html`,
      ],
    ],
  }),
  g({
    slug: "what-is-jit",
    topic: "JIT",
    d: "medium",
    title: "What is the JIT compiler, and why is Java not just interpreted?",
    kw: ["JIT", "interpreter", "bytecode", "hot spot", "native code"],
    intent: "Checks that you know how Java reaches good run-time performance.",
    short:
      "When the JVM starts running a method, it interprets the bytecode, which starts fast but runs slowly. The JVM counts how often methods and loops run, and the ones that run often, the hot spots, are compiled by the Just-In-Time (JIT) compiler into optimised native machine code, which is then used for later calls. Because the JIT works at run time, it can use real profiling data, such as which branch is usually taken, to optimise. This combines platform-independent bytecode with performance that is close to native code for long-running programs.",
    detail: [
      "A program is slower when it has just started, until the hot code is compiled. This is the warm-up.",
      "Compiled code is stored in the code cache.",
      "If an assumption of the optimiser turns out to be wrong, the JVM can deoptimise the code and go back to interpreting.",
    ],
    ex: "A method called a million times in a loop is compiled early, and later calls run as native code.",
    mistakes: [
      "Benchmarking a method once, without warm-up, and drawing conclusions.",
      "Saying that Java is only interpreted.",
    ],
    follow: ["What is warm-up?"],
    points: [
      "Interpret first, compile the hot code",
      "Uses run-time profiling",
      "Warm-up affects benchmarks",
    ],
    notes:
      "JIT compiles hot bytecode to native code at run time, using profiling data.",
    src: [
      [
        "HotSpot Virtual Machine Performance Enhancements",
        "https://docs.oracle.com/en/java/javase/21/vm/java-hotspot-virtual-machine-performance-enhancements.html",
      ],
      [
        "The Java Virtual Machine Specification: Introduction",
        `${JVMS}/jvms-1.html`,
      ],
    ],
  }),
  g({
    slug: "tiered-compilation-and-c1-c2",
    topic: "JIT",
    d: "hard",
    title: "What is tiered compilation and what are the C1 and C2 compilers?",
    kw: ["tiered compilation", "C1", "C2", "code cache", "deoptimisation"],
    intent: "Checks that you know the structure of HotSpot's compilers.",
    short:
      "HotSpot has two JIT compilers. C1, the client compiler, compiles quickly and applies light optimisations. C2, the server compiler, takes longer and applies aggressive optimisations to code that proves to be very hot. Tiered compilation, the default, combines them with the interpreter: code starts in the interpreter, then moves to C1-compiled code, often with profiling, and finally to C2-compiled code if it stays hot. This gives a fast start-up and also high peak performance.",
    detail: [
      "Common optimisations are method inlining, loop unrolling and escape analysis.",
      "Compiled code goes into the code cache, and when it is full, compilation stops.",
      "`-XX:+PrintCompilation` shows which methods are being compiled, for diagnosis.",
    ],
    ex: "A server shows its best throughput only after some minutes, when the important methods have reached C2.",
    mistakes: [
      "Assuming that all code is compiled in the same way.",
      "Ignoring the code cache size on very large applications.",
    ],
    follow: ["What is method inlining?"],
    points: [
      "C1: fast, light optimisation",
      "C2: slower, aggressive optimisation",
      "Tiered: interpreter → C1 → C2",
    ],
    notes:
      "Tiered compilation: interpreter → C1 (quick) → C2 (best) for hot code.",
    src: [
      [
        "HotSpot Virtual Machine Performance Enhancements",
        "https://docs.oracle.com/en/java/javase/21/vm/java-hotspot-virtual-machine-performance-enhancements.html",
      ],
      [
        "The java Command (options)",
        "https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html",
      ],
    ],
  }),
  g({
    slug: "escape-analysis-and-inlining",
    topic: "JIT",
    d: "hard",
    title: "What are method inlining and escape analysis?",
    kw: [
      "inlining",
      "escape analysis",
      "scalar replacement",
      "JIT optimisation",
      "allocation",
    ],
    intent:
      "Checks that you know two of the optimisations that make small methods and short-lived objects cheap.",
    short:
      "Inlining replaces a method call with the body of the method at the call site, which removes the call overhead and lets the compiler optimise the combined code. It is why small getters cost almost nothing. Escape analysis checks whether an object is used only inside a method, so it does not escape. For such an object the JIT can avoid allocating it on the heap, by keeping its fields in registers or on the stack, which is called scalar replacement. This reduces the work of the garbage collector. These optimisations are done automatically, so writing clear, small methods is usually fine.",
    detail: [
      "Whether an optimisation happens depends on the JVM version and the code, so do not depend on it.",
      "Very large methods may not be inlined.",
      "Micro-optimising by hand, based on assumptions about the JIT, usually does not help.",
    ],
    ex: "A method that creates a temporary `Point` object, uses it and returns a number may never allocate that `Point` in the compiled code.",
    mistakes: [
      'Merging small methods into one large method to "avoid call overhead".',
      "Assuming that every temporary object is allocated on the heap.",
    ],
    follow: ["Why does writing small methods not hurt performance?"],
    points: [
      "Inlining removes call overhead",
      "Escape analysis can avoid heap allocation",
      "Automatic and version dependent",
    ],
    notes:
      "JIT inlines small methods and can avoid allocating objects that do not escape.",
    src: [
      [
        "HotSpot Virtual Machine Performance Enhancements",
        "https://docs.oracle.com/en/java/javase/21/vm/java-hotspot-virtual-machine-performance-enhancements.html",
      ],
      [
        "The Java Virtual Machine Specification: Run-Time Data Areas",
        `${JVMS}/jvms-2.html#jvms-2.5`,
      ],
    ],
  }),
  g({
    slug: "what-is-a-memory-leak-in-java",
    topic: "Memory leaks",
    d: "medium",
    title: "Java has garbage collection, so how can it have memory leaks?",
    kw: [
      "memory leak",
      "reachable",
      "static collection",
      "GC",
      "OutOfMemoryError",
    ],
    intent:
      "Checks that you know a leak in Java is about unintended references.",
    short:
      "The garbage collector frees only unreachable objects. A memory leak in Java happens when the program keeps a reference to objects that it will never use again, so they stay reachable and are never freed. The heap then grows slowly until it throws `OutOfMemoryError`. The collector is not wrong. The program is holding on to memory by mistake. A typical symptom is that the memory used after each full collection keeps increasing over hours or days.",
    detail: [
      "A leak is a logical problem. The memory is reachable, but useless.",
      "It often appears only in long-running programs.",
      "Finding the object that holds the reference, the path to a GC root, is the main step in a diagnosis.",
    ],
    ex: "A static `Map` that stores the data of every request and is never cleared grows until the application fails.",
    mistakes: [
      "Saying that Java cannot leak memory because of the garbage collector.",
      "Increasing `-Xmx` instead of looking for the leak.",
    ],
    follow: ["What are common causes of leaks in Java?"],
    points: [
      "Reachable but unused objects",
      "Heap grows after each full GC",
      "More heap only delays the failure",
    ],
    notes: "Java leak = unintended references keep objects reachable.",
    src: [
      [
        "Java Troubleshooting Guide: Troubleshoot Memory Leaks",
        `${TS}/troubleshoot-memory-leaks.html`,
      ],
      ["HotSpot GC Tuning Guide: Introduction", `${GC}/introduction.html`],
    ],
  }),
  g({
    slug: "common-causes-of-leaks",
    topic: "Memory leaks",
    d: "medium",
    title: "What are the common causes of memory leaks in Java applications?",
    kw: [
      "static field",
      "listener",
      "ThreadLocal",
      "unbounded cache",
      "unclosed resource",
    ],
    intent: "Checks that you can list real, typical causes.",
    short:
      "Common causes are static collections that only grow, such as a `static Map` used as a cache without a size limit or expiry. Listeners or callbacks that are registered and never removed. `ThreadLocal` values that are not removed in a thread pool. Resources, such as streams, connections and statements, that are not closed. Inner classes and lambdas that keep a hidden reference to a large outer object. Class loaders that stay referenced after a redeploy. Objects used as keys in a `HashMap` that are never removed from it.",
    detail: [
      "The fix is usually to remove the reference, bound the cache, or use weak references.",
      "A cache library with a maximum size and expiry avoids the unbounded cache problem.",
      "Always close resources with try-with-resources.",
    ],
    ex: "A UI screen registers a listener on a long-lived event bus and never unregisters it, so every closed screen stays in memory.",
    mistakes: [
      "Using a plain `HashMap` as a cache with no limit.",
      "Registering listeners without a matching removal.",
    ],
    follow: ["How would you fix an unbounded cache?"],
    points: [
      "Growing static collections",
      "Unremoved listeners and ThreadLocals",
      "Unclosed resources and leaked class loaders",
    ],
    notes:
      "Typical leaks: static collections, listeners, ThreadLocal, unclosed resources, unbounded caches.",
    src: [
      [
        "Java Troubleshooting Guide: Troubleshoot Memory Leaks",
        `${TS}/troubleshoot-memory-leaks.html`,
      ],
      ["Java SE API: ThreadLocal", `${API}/ThreadLocal.html`],
    ],
  }),
  g({
    slug: "outofmemoryerror-types",
    topic: "Memory leaks",
    d: "medium",
    title:
      "What kinds of `OutOfMemoryError` are there, and what does each mean?",
    kw: [
      "OutOfMemoryError",
      "Java heap space",
      "Metaspace",
      "GC overhead limit exceeded",
      "unable to create native thread",
    ],
    intent:
      "Checks that you read the message of the error, and not only its name.",
    short:
      "The message after `OutOfMemoryError` tells you which resource ran out. `Java heap space` means that the heap is full and the collector cannot free enough, which is either a leak or a heap that is too small for the workload. `GC overhead limit exceeded` means that the JVM spends nearly all of its time on collections and recovers almost nothing. `Metaspace` means that class metadata has run out. `unable to create native thread` means that the operating system could not create another thread, because of limits or lack of native memory, and `Direct buffer memory` refers to off-heap buffers.",
    detail: [
      "A different fix is needed for each: fix a leak, raise a limit, or reduce the number of threads.",
      "Add `-XX:+HeapDumpOnOutOfMemoryError` to get a heap dump automatically when it happens.",
      "`OutOfMemoryError` is an `Error`, and the application is often in a bad state after it.",
    ],
    ex: "A service that creates a new thread for every request fails with `unable to create native thread` under load, although the heap is nearly empty.",
    mistakes: [
      "Raising `-Xmx` for every `OutOfMemoryError` without reading the message.",
      "Catching `OutOfMemoryError` and carrying on.",
    ],
    follow: ["How do you capture a heap dump on failure?"],
    points: [
      "Read the message after the error",
      "Heap, GC overhead, Metaspace, native thread, direct buffer",
      "HeapDumpOnOutOfMemoryError for diagnosis",
    ],
    notes:
      "`Java heap space`, `GC overhead limit exceeded`, `Metaspace`, `unable to create native thread`.",
    src: [
      ["Java SE API: OutOfMemoryError", `${API}/OutOfMemoryError.html`],
      [
        "Java Troubleshooting Guide: Troubleshoot Memory Leaks",
        `${TS}/troubleshoot-memory-leaks.html`,
      ],
    ],
  }),
  g({
    slug: "diagnosing-memory-problems",
    topic: "Memory leaks",
    d: "hard",
    title: "How do you find a memory leak in a running Java application?",
    kw: ["heap dump", "jcmd", "jmap", "Eclipse MAT", "Java Flight Recorder"],
    intent: "Checks that you have a practical method and not only theory.",
    short:
      "First confirm the symptom: watch the heap after full collections in the GC log or with `jstat`. If it keeps rising, take a heap dump, with `jcmd <pid> GC.heap_dump file.hprof`, or automatically on failure with `-XX:+HeapDumpOnOutOfMemoryError`. Open the dump in an analyser such as Eclipse Memory Analyzer or VisualVM and look for the classes that hold the most memory, the dominator tree, and the path from a GC root to a suspicious object. Compare two dumps taken some time apart to see what grows. Java Flight Recorder can also show allocation and old-object samples.",
    detail: [
      "A heap dump pauses the application for a time and the file can be as large as the heap, so be careful in production.",
      "Heap dumps contain application data, and they should be protected like any sensitive file.",
      "After the fix, run the same test again to confirm that the memory is stable.",
    ],
    ex: "A dump shows 2 million `Session` objects held by one static map, and the fix is to remove sessions when they expire.",
    mistakes: [
      "Sending a heap dump with real customer data to someone outside the team.",
      "Guessing the cause without a dump or profile.",
    ],
    follow: ["What does the path to GC roots show?"],
    points: [
      "Confirm growth after full GC",
      "Heap dump and analyser",
      "Compare dumps and check the GC-root path",
    ],
    notes:
      "GC log → heap dump (`jcmd GC.heap_dump`) → analyser → path to GC root.",
    src: [
      [
        "Java Troubleshooting Guide: Troubleshoot Memory Leaks",
        `${TS}/troubleshoot-memory-leaks.html`,
      ],
      [
        "Java Troubleshooting Guide: Diagnostic Tools",
        `${TS}/diagnostic-tools.html`,
      ],
    ],
  }),
  g({
    slug: "weak-references-for-caches",
    topic: "Memory leaks",
    d: "medium",
    title: "How do you design a cache that does not leak memory?",
    kw: ["cache", "eviction", "WeakHashMap", "LinkedHashMap", "maximum size"],
    intent:
      "Checks that you bound a cache and choose a suitable eviction strategy.",
    short:
      "A cache must have a limit, because an unbounded `HashMap` is a leak waiting to happen. Set a maximum number of entries and an eviction rule. In plain Java, a `LinkedHashMap` in access order that overrides `removeEldestEntry` gives a simple least-recently-used cache. Expiry by time removes stale data. `WeakHashMap` removes an entry when its key is no longer used elsewhere, which fits caches keyed by objects with their own life cycle, but not caches keyed by values like strings or numbers. For real applications, a cache library with a size limit, expiry and statistics is usually the better choice.",
    detail: [
      "Soft references can make a cache that shrinks under memory pressure, but their behaviour is hard to predict.",
      "Cache invalidation, when the source data changes, is a separate problem.",
      "Monitor the hit rate, because a cache with a low hit rate only costs memory.",
    ],
    ex: "A product-details cache keeps 10,000 entries and drops the least recently used one when it is full.",
    code: [
      "A small LRU cache",
      "class LruCache<K, V> extends LinkedHashMap<K, V> {\n  private final int max;\n  LruCache(int max) {\n    super(16, 0.75f, true); // access order\n    this.max = max;\n  }\n  @Override\n  protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {\n    return size() > max;\n  }\n}",
      [
        "The `true` argument makes the map iterate in access order.",
        "After each `put`, `removeEldestEntry` is asked whether to drop the least recently used entry.",
        "The cache never holds more than `max` entries.",
      ],
      "java",
    ],
    mistakes: [
      "Using a `HashMap` with no limit as a cache.",
      "Using `WeakHashMap` with string keys that are held by the string pool.",
    ],
    follow: ["How would you measure whether a cache is useful?"],
    points: [
      "Always bound the size",
      "LinkedHashMap in access order gives LRU",
      "Weak keys only for objects with their own life cycle",
    ],
    notes:
      "Bound every cache: LRU with `LinkedHashMap` or a cache library with size and expiry.",
    src: [
      [
        "Java SE API: LinkedHashMap",
        "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/LinkedHashMap.html",
      ],
      [
        "Java SE API: WeakHashMap",
        "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/WeakHashMap.html",
      ],
    ],
  }),
  g({
    slug: "stack-frames-and-recursion",
    topic: "Heap vs stack",
    d: "medium",
    title: "What is a stack frame, and why does deep recursion fail?",
    kw: [
      "stack frame",
      "recursion",
      "StackOverflowError",
      "call stack",
      "-Xss",
    ],
    intent:
      "Checks that you can connect method calls to stack memory and recursion limits.",
    short:
      "Each method call pushes a new frame onto the calling thread's stack. The frame holds the method's parameters, local variables, the operand stack for calculations and a link back to the caller. When the method returns, its frame is popped. Recursion pushes one frame per call, so a recursion that is too deep or has no base case fills the thread's stack and throws `StackOverflowError`. The fix is a correct base case, an iterative loop, or in rare cases a larger stack size with `-Xss`.",
    detail: [
      "The stack depth that fits depends on the size of each frame and the stack size, so there is no fixed number.",
      "Java does not perform tail-call optimisation, so a tail-recursive method still uses one frame per call.",
      "Each thread has its own stack, so a deep recursion in one thread does not affect the stack of another.",
    ],
    ex: "A recursive factorial works for 1,000 but a recursive sum of a list with a million elements overflows the stack, while a loop handles it.",
    code: [
      "Recursion and a loop",
      "static long sumRecursive(int n) {\n  if (n == 0) return 0;\n  return n + sumRecursive(n - 1);   // one frame per call\n}\n\nstatic long sumLoop(int n) {\n  long total = 0;\n  for (int i = 1; i <= n; i++) total += i;\n  return total;\n}\n\nSystem.out.println(sumLoop(1_000_000));",
      [
        "`sumRecursive(1_000_000)` would need a million frames, and would very likely throw `StackOverflowError`.",
        "`sumLoop` uses one frame and a few variables, so it handles any `n`.",
        "The output is `500000500000`.",
      ],
      "java",
    ],
    mistakes: [
      "Writing a recursive method without a reachable base case.",
      "Expecting Java to optimise tail recursion.",
    ],
    follow: ["How would you turn a deep recursion into a loop?"],
    points: [
      "One frame per call",
      "Frame: locals, operand stack, caller link",
      "Deep recursion → StackOverflowError",
    ],
    notes:
      "Each call = one stack frame. Deep recursion overflows; use a loop or a base case.",
    src: [
      [
        "The Java Virtual Machine Specification: Frames",
        `${JVMS}/jvms-2.html#jvms-2.6`,
      ],
      ["Java SE API: StackOverflowError", `${API}/StackOverflowError.html`],
    ],
  }),
])
