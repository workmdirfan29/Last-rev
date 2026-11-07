import { defineQuestions } from "../author"

const TUT = "https://docs.oracle.com/javase/tutorial"

export default defineQuestions("java-core", "fresher", [
  {
    slug: "jdk-jre-jvm",
    topic: "Basics",
    difficulty: "easy",
    title: "What is the difference between JDK, JRE and JVM?",
    keywords: ["jdk", "jre", "jvm", "bytecode", "platform independent"],
    interviewerIntent:
      "The standard Java opener. It checks whether you understand how Java code is compiled and run.",
    shortAnswer:
      "The JVM is the virtual machine that runs Java bytecode. The JRE is the JVM plus the standard class libraries needed to run programs. The JDK is the JRE plus development tools such as the compiler (`javac`), debugger and `jar`. You need the JDK to develop, but only a runtime to run.",
    detailedAnswer: [
      "You write `.java` source. `javac` (part of the JDK) compiles it into platform-independent **bytecode** in `.class` files. The JVM then loads that bytecode and executes it, interpreting it and compiling hot paths to native code with the JIT compiler.",
      "This is why Java is 'write once, run anywhere': the bytecode is the same everywhere, and each platform has its own JVM that understands it.",
      "Since Java 11 there is no separate JRE download from Oracle; distributions (Temurin, Corretto, etc.) ship a JDK, and `jlink` can build a minimal custom runtime image.",
      "Note that the JVM is a *specification* with multiple implementations (HotSpot is the JVM implementation in OpenJDK).",
    ],
    realWorldExample:
      "A Spring Boot jar built on a developer's Windows laptop with JDK 21 runs unchanged in a Linux Docker container that only has a Java 21 runtime.",
    diagram: {
      kind: "flow",
      title: "From source to execution",
      steps: [
        { label: "Hello.java", detail: "Source code" },
        { label: "javac (JDK)", detail: "Compiles to bytecode" },
        { label: "Hello.class", detail: "Platform-independent bytecode" },
        { label: "JVM", detail: "Loads, verifies, interprets / JIT-compiles" },
        { label: "Machine code", detail: "Runs on the OS and CPU" },
      ],
    },
    commonMistakes: [
      "Saying the JVM is platform independent — the bytecode is; the JVM is platform specific.",
      "Mixing up compiling (javac) and running (java).",
    ],
    followUps: [
      { question: "What is bytecode?" },
      { question: "What does the JIT compiler do?" },
      {
        question: "Is Java compiled or interpreted?",
        hint: "Both: compiled to bytecode, then interpreted/JIT-compiled.",
      },
    ],
    answerTips: [
      "Draw the pipeline: source → javac → bytecode → JVM. One diagram answers all three terms.",
    ],
    keyPoints: [
      "JDK ⊃ JRE ⊃ JVM",
      "Bytecode is portable; JVM is platform specific",
      "javac compiles, java runs",
      "JIT optimises hot code",
    ],
    revisionNotes: ["JDK = tools + JRE. JRE = libs + JVM. JVM runs bytecode."],
    sourceRefs: [
      {
        label: "Oracle: The Java Tutorials",
        url: `${TUT}/getStarted/intro/definition.html`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "string-immutability",
    topic: "Strings",
    difficulty: "easy",
    title: "Why are Strings immutable in Java? What is the String pool?",
    keywords: [
      "string",
      "immutable",
      "string pool",
      "intern",
      "StringBuilder",
      "thread safety",
    ],
    interviewerIntent:
      "Tests deeper understanding than syntax: design reasons, memory and performance.",
    shortAnswer:
      "Once created, a `String` object's value never changes; every 'modification' creates a new object. This makes strings safe to share between threads, safe as `HashMap` keys (the hash can be cached), and secure for things like class names and file paths. String literals are stored in a pool so identical literals share one object, saving memory.",
    detailedAnswer: [
      "`String` is `final` and its internal data is never modified, so after construction nothing can change it. `s.toUpperCase()` returns a **new** string and leaves `s` unchanged.",
      "**Why immutable:** (1) thread safety without synchronisation; (2) `hashCode` can be cached, making strings efficient map keys; (3) security — values like URLs or class names can't be changed after validation; (4) enables the string pool.",
      '**String pool:** a cache inside the heap of unique string literals. `"java" == "java"` is `true` because both literals point to the same pooled object, while `new String("java")` creates a distinct object on the heap.',
      "Because every concatenation creates a new object, building strings in a loop with `+` is wasteful. Use `StringBuilder` (not thread-safe, fast) or `StringBuffer` (synchronised).",
    ],
    realWorldExample:
      "Building a CSV with 100,000 rows using `result += row` inside a loop creates 100,000 intermediate strings and can be orders of magnitude slower than a single `StringBuilder`.",
    codeExamples: [
      {
        title: "Pool, new, and equals",
        language: "java",
        code: `String a = "java";
String b = "java";
String c = new String("java");

System.out.println(a == b);        // true  (same pooled object)
System.out.println(a == c);        // false (different object)
System.out.println(a.equals(c));   // true  (same content)
System.out.println(a == c.intern());// true  (intern returns the pooled one)

String s = "hello";
s.toUpperCase();                    // result discarded
System.out.println(s);              // hello — unchanged`,
        walkthrough: [
          '`a` and `b` are literals, so both refer to the single pooled "java".',
          "`new String(...)` always allocates a new object, so `a == c` is false.",
          "`equals` compares content, so it is true.",
          "`toUpperCase()` returns a new string; ignoring the result leaves `s` unchanged.",
        ],
      },
    ],
    commonMistakes: [
      "Using `==` to compare strings.",
      "Concatenating in loops with `+`.",
      "Thinking `final String s` and an immutable `String` are the same thing — `final` stops reassignment of the variable.",
    ],
    followUps: [
      {
        question:
          "What is the difference between String, StringBuilder and StringBuffer?",
      },
      {
        question: 'How many objects does `new String("abc")` create?',
        hint: "Up to two: one pooled literal (if not already present) and one heap object.",
      },
    ],
    answerTips: [
      "List the four reasons — thread safety, hash caching, security, pooling — in order.",
    ],
    keyPoints: [
      "Immutable by design",
      "String pool shares literals",
      "== vs equals",
      "Use StringBuilder in loops",
    ],
    revisionNotes: ["Immutable → safe, cacheable, poolable."],
    sourceRefs: [
      { label: "Oracle: Strings", url: `${TUT}/java/data/strings.html` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "equals-vs-double-equals",
    topic: "Basics",
    difficulty: "easy",
    title: "What is the difference between == and equals() in Java?",
    keywords: ["==", "equals", "hashCode", "reference", "object comparison"],
    interviewerIntent:
      "Checks understanding of reference vs value comparison and the equals/hashCode contract.",
    shortAnswer:
      "`==` compares primitives by value and objects by reference (are they the same object in memory). `equals()` is a method meant to compare logical content; its default implementation in `Object` is the same as `==`, so classes like `String` and `Integer` override it. If you override `equals`, you must override `hashCode` consistently.",
    detailedAnswer: [
      "For primitives (`int`, `char`, ...), `==` compares values. For objects, `==` asks 'do both variables point to the same object?'.",
      "`equals` lets a class define its own idea of equality. `String.equals` compares characters; `List.equals` compares elements; your own class compares whatever fields you decide.",
      "**Contract:** equal objects must have equal hash codes. Violating it breaks `HashMap` and `HashSet` — an object may be 'lost' in the map after insertion.",
      "Beware `Integer` caching: `Integer a = 127, b = 127; a == b` is `true`, but with `128` it's `false` (cache covers -128 to 127 by default). Always use `equals` for wrapper objects.",
    ],
    realWorldExample:
      "A `User` entity used as a `HashSet` key without overriding `equals`/`hashCode` allows duplicates of the same user id to be inserted.",
    codeExamples: [
      {
        title: "Overriding equals and hashCode",
        language: "java",
        code: `public final class User {
    private final long id;
    private final String email;

    public User(long id, String email) { this.id = id; this.email = email; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User other)) return false;
        return id == other.id && email.equals(other.email);
    }

    @Override
    public int hashCode() { return java.util.Objects.hash(id, email); }
}`,
        walkthrough: [
          "Same reference → equal, a fast path.",
          "Different type (or null) → not equal; `instanceof` handles both.",
          "Otherwise compare the identity fields that define equality.",
          "`hashCode` uses the same fields, so equal objects always share a hash code.",
        ],
      },
    ],
    commonMistakes: [
      "Using `==` for Strings or wrapper types.",
      "Overriding `equals` without `hashCode`.",
      "Including mutable fields in `hashCode` for objects stored in hash-based collections.",
    ],
    followUps: [
      { question: "What is the equals-hashCode contract?" },
      { question: "Why does `Integer a = 128, b = 128; a == b` return false?" },
    ],
    answerTips: [
      "Mention the contract — it turns a basic answer into a strong one.",
    ],
    keyPoints: [
      "== references (objects) / values (primitives)",
      "equals = logical equality",
      "Override both equals and hashCode",
      "Integer cache -128..127",
    ],
    revisionNotes: ["== identity. equals content. Override pair."],
    sourceRefs: [
      {
        label: "Oracle: Object.equals",
        url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html#equals(java.lang.Object)",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "final-keyword",
    topic: "Basics",
    difficulty: "easy",
    title: "What does the final keyword do in Java?",
    keywords: ["final", "immutability", "constant", "override", "inheritance"],
    interviewerIntent:
      "A quick check on keyword semantics and the common misconception about final objects.",
    shortAnswer:
      "`final` means 'cannot be changed once set'. A `final` variable can be assigned only once, a `final` method cannot be overridden, and a `final` class cannot be extended. For reference variables, `final` stops reassigning the reference but does not make the object it points to immutable.",
    detailedAnswer: [
      "**Variables:** a final local, field or parameter can be assigned once. Final fields must be initialised by the end of the constructor, which is how immutable classes are built.",
      "**Methods:** final methods can't be overridden, used when behaviour must not change in subclasses.",
      "**Classes:** a final class can't be subclassed (`String`, `Integer`). It supports immutability and security.",
      '`final` is not the same as `const` in other languages for objects: `final List<String> list = new ArrayList<>(); list.add("x");` is legal — the list is still mutable; only the variable is fixed.',
      "Related terms: `static final` fields are constants (by convention `UPPER_SNAKE_CASE`); `finally` is a try-block clause; `finalize()` is a deprecated GC hook — three unrelated things interviewers love to compare.",
    ],
    realWorldExample:
      "A `Money` value class is declared `final` with `final` fields so that amounts can't be changed after construction, making it safe to share across threads.",
    codeExamples: [
      {
        title: "final reference vs final object",
        language: "java",
        code: `final List<String> names = new ArrayList<>();
names.add("Asha");        // OK: the list is mutable
// names = new ArrayList<>(); // compile error: cannot reassign

public class Config {
    public static final int MAX_RETRIES = 3;   // constant
    public final String env;                   // set once, in constructor
    public Config(String env) { this.env = env; }
}`,
        walkthrough: [
          "The `final` variable `names` can never point to a different list.",
          "The list it points to can still change, so `add` works.",
          "`MAX_RETRIES` is a compile-time constant shared by the class.",
          "`env` must be assigned in the constructor and then never changes.",
        ],
      },
    ],
    commonMistakes: [
      "Saying final objects are immutable.",
      "Confusing final, finally and finalize.",
    ],
    followUps: [
      { question: "How do you create a truly immutable class?" },
      {
        question: "Can a final method be overloaded?",
        hint: "Yes — only overriding is prevented.",
      },
    ],
    answerTips: [
      "Say 'final reference, not final object' — it's the sentence that shows you know the trap.",
    ],
    keyPoints: [
      "final variable: assign once",
      "final method: no override",
      "final class: no inheritance",
      "Reference fixed, object may change",
    ],
    revisionNotes: ["final = no reassign / override / extend."],
    sourceRefs: [
      {
        label: "Oracle: Writing Final Classes and Methods",
        url: `${TUT}/java/IandI/final.html`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "static-keyword",
    topic: "Basics",
    difficulty: "easy",
    title: "What does the static keyword mean in Java?",
    keywords: [
      "static",
      "class variable",
      "static method",
      "static block",
      "memory",
    ],
    interviewerIntent:
      "Checks understanding of class-level vs instance-level members.",
    shortAnswer:
      "`static` members belong to the class itself rather than to any object. A static field has a single copy shared by all instances, and a static method can be called without creating an object. Static methods cannot use `this` or access instance members directly.",
    detailedAnswer: [
      "**Static field:** one shared value, loaded when the class is initialised. Used for constants and counters.",
      "**Static method:** called as `ClassName.method()`. It can only directly access other static members because no instance exists. Utility classes such as `Math` and `Collections` are static-only.",
      "**Static block:** runs once when the class is loaded, used for complex static initialisation.",
      "**Static nested class:** a nested class without a reference to an outer instance.",
      "Static methods are **not polymorphic**: they are hidden, not overridden — the method called depends on the reference type, not the object.",
      "Overusing static state creates hidden global state, makes testing harder and is a thread-safety risk.",
    ],
    realWorldExample:
      "A `static int instanceCount` incremented in a constructor counts how many objects were created; a `static` factory method `User.of(...)` creates objects with validation.",
    codeExamples: [
      {
        title: "Shared counter",
        language: "java",
        code: `public class Order {
    private static int count = 0;      // shared by all orders
    private final int id;

    public Order() { this.id = ++count; }

    public static int getCount() { return count; }  // no instance needed
}

new Order(); new Order();
System.out.println(Order.getCount()); // 2`,
        walkthrough: [
          "`count` exists once for the whole class, not per Order.",
          "Each constructor call increments the shared counter and uses it as the id.",
          "`getCount()` is static, so it is called on the class and may only touch static state.",
        ],
      },
    ],
    commonMistakes: [
      "Accessing instance fields from a static method.",
      "Thinking static methods can be overridden.",
      "Using static mutable state for convenience.",
    ],
    followUps: [
      {
        question: "Why is `main` static?",
        hint: "The JVM needs to call it before any object exists.",
      },
      { question: "When is a static block executed?" },
    ],
    answerTips: ["Link it to memory: one copy per class, not per object."],
    keyPoints: [
      "Belongs to class not instance",
      "One shared copy",
      "No `this` in static context",
      "Static methods are hidden, not overridden",
    ],
    revisionNotes: ["static = class-level, shared, no this."],
    sourceRefs: [
      {
        label: "Oracle: Understanding Class Members",
        url: `${TUT}/java/javaOO/classvars.html`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "pass-by-value",
    topic: "Basics",
    difficulty: "medium",
    title: "Is Java pass-by-value or pass-by-reference?",
    keywords: [
      "pass by value",
      "reference",
      "method arguments",
      "parameter",
      "immutability",
    ],
    interviewerIntent:
      "A famous trick question. The correct answer needs precision about what is being copied.",
    shortAnswer:
      "Java is always pass-by-value. For primitives the value is copied. For objects, the value that is copied is the reference (the address), so the method gets its own copy of the reference pointing at the same object. The method can modify that object's contents but cannot make the caller's variable point to a different object.",
    detailedAnswer: [
      "When you call `foo(x)`, Java copies the value of `x` into the parameter. If `x` is an `int`, the copy is the number. If `x` is an object variable, the copy is the **reference**.",
      "Because both references point at the same object, changes made through the parameter (`list.add(...)`) are visible to the caller.",
      "But **reassigning** the parameter (`param = new Foo()`) only changes the local copy; the caller's variable still points to the original object. In true pass-by-reference, reassignment would be visible to the caller.",
      "`String` and wrapper types are immutable, so changes inside a method never appear to affect the caller.",
    ],
    realWorldExample:
      "A `sort(List<User> users)` utility can reorder the caller's list (mutating the shared object), but a method that tries `users = new ArrayList<>()` leaves the caller's list untouched.",
    codeExamples: [
      {
        title: "Mutate vs reassign",
        language: "java",
        code: `static void mutate(StringBuilder sb) { sb.append(" world"); }
static void reassign(StringBuilder sb) { sb = new StringBuilder("new"); }

StringBuilder a = new StringBuilder("hello");
mutate(a);
System.out.println(a);   // hello world — object was changed
reassign(a);
System.out.println(a);   // hello world — caller's reference unchanged`,
        walkthrough: [
          "`mutate` receives a copy of the reference and uses it to change the shared object.",
          "`reassign` points its own copy to a brand-new object; the caller's variable `a` isn't affected.",
          "That second behaviour proves Java is not pass-by-reference.",
        ],
      },
    ],
    commonMistakes: [
      "Saying 'objects are passed by reference'.",
      "Confusing mutation of an object with reassignment of a variable.",
    ],
    followUps: [
      {
        question: "How can you swap two integers with a method in Java?",
        hint: "You can't directly; use an array or wrapper object.",
      },
    ],
    answerTips: ["Use the mutate/reassign pair — it is the cleanest proof."],
    keyPoints: [
      "Always pass-by-value",
      "For objects, the reference is copied",
      "Mutation visible; reassignment not",
    ],
    revisionNotes: ["Copy of the reference — mutate yes, reassign no."],
    sourceRefs: [
      {
        label: "Oracle: Passing Information to a Method",
        url: `${TUT}/java/javaOO/arguments.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "main-method-signature",
    topic: "Basics",
    difficulty: "easy",
    title:
      "Explain the main method: public static void main(String[] args). Why is each keyword there?",
    keywords: [
      "main method",
      "public",
      "static",
      "void",
      "String args",
      "entry point",
    ],
    interviewerIntent:
      "A first-day question that checks whether you understand how the JVM starts a program.",
    shortAnswer:
      "The JVM starts a program by calling `main`. It is `public` so the JVM can call it from outside the class, `static` so it can run without creating an object, and `void` because it returns nothing to the JVM. `String[] args` holds the command-line arguments passed when the program starts.",
    detailedAnswer: [
      "The launcher loads the class you name, finds the `main` method with this signature and calls it.",
      "Because the method is `static`, no instance exists yet when it runs, so you cannot use instance fields from `main` without creating an object first.",
      "`args` is an array of strings. `java App one two` gives `args[0]` as `one` and `args[1]` as `two`. With no arguments the array is empty, not null.",
      "The parameter name is free: `String[] a` works. The type and the modifiers must match what the launcher expects. Newer Java versions allow simpler entry points, but this form works in every version.",
    ],
    realWorldExample:
      "A command-line tool reads `args[0]` as a file path. Spring Boot's `SpringApplication.run(App.class, args)` is also called from a normal `main`.",
    codeExamples: [
      {
        title: "Reading command-line arguments",
        language: "java",
        code: `public class Greeter {
    public static void main(String[] args) {
        String name = args.length > 0 ? args[0] : "world";
        System.out.println("Hello, " + name);
    }
}
// java Greeter Asha  ->  Hello, Asha`,
        walkthrough: [
          "The JVM calls `main` as the entry point of the class you run.",
          "`args.length` is checked first because the array is empty when no arguments are given.",
          "The ternary picks the first argument or a default.",
          "Running `java Greeter Asha` passes `Asha` as `args[0]`.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting `static` and getting 'main method not found' at startup.",
      "Reading `args[0]` without checking the length.",
    ],
    followUps: [
      {
        question: "Can you overload main? Which version does the JVM call?",
        hint: "Only the standard signature is the entry point.",
      },
    ],
    answerTips: [
      "Explain one keyword at a time, each with the reason, rather than listing them.",
    ],
    keyPoints: [
      "public: JVM can call it",
      "static: no object needed",
      "void: no return value",
      "args: command-line arguments",
    ],
    revisionNotes: [
      "public static void main: reachable, no object, returns nothing.",
    ],
    sourceRefs: [
      {
        label: "Oracle tutorial: The Hello World application",
        url: "https://docs.oracle.com/javase/tutorial/getStarted/application/index.html",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "features-of-java",
    topic: "Basics",
    difficulty: "easy",
    title: "What are the main features of Java?",
    keywords: [
      "features",
      "object-oriented",
      "platform independent",
      "garbage collection",
      "multithreading",
      "strongly typed",
    ],
    interviewerIntent:
      "An opener. A good answer links each feature to a practical benefit instead of reciting a list.",
    shortAnswer:
      "Java is object-oriented, statically and strongly typed, and platform independent because source compiles to bytecode that any JVM can run. It manages memory automatically with garbage collection, has built-in support for multithreading, and ships with a large standard library. It has no direct pointer arithmetic, which removes a class of memory errors.",
    detailedAnswer: [
      "**Platform independence:** `javac` produces bytecode, and each operating system has its own JVM to run it. 'Write once, run anywhere' is about the bytecode, not the source.",
      "**Automatic memory management:** objects live on the heap and the garbage collector reclaims the ones that are no longer reachable.",
      "**Strong static typing:** many mistakes are caught at compile time instead of in production.",
      "**Multithreading and a rich standard library:** threads, collections, I/O and networking are part of the platform.",
    ],
    realWorldExample:
      "A Spring Boot service built on a developer's laptop runs unchanged inside a Linux container in production because both run the same bytecode on a JVM.",
    commonMistakes: [
      "Saying Java is platform independent without mentioning bytecode and the JVM.",
      "Claiming Java has no memory leaks because of garbage collection.",
    ],
    followUps: [
      {
        question: "Is Java 100 percent object-oriented?",
        hint: "Primitives are not objects.",
      },
    ],
    answerTips: ["Pick three features and give a one-line benefit for each."],
    keyPoints: [
      "Bytecode runs on any JVM",
      "Garbage collection",
      "Strong static typing",
      "Built-in multithreading",
    ],
    revisionNotes: ["Bytecode, JVM, GC, types, threads."],
    sourceRefs: [
      {
        label: "Oracle tutorial: About the Java technology",
        url: "https://docs.oracle.com/javase/tutorial/getStarted/intro/definition.html",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "variables-and-scope",
    topic: "Basics",
    difficulty: "easy",
    title: "What are local, instance and static variables in Java?",
    keywords: [
      "local variable",
      "instance variable",
      "static variable",
      "scope",
      "class variable",
    ],
    interviewerIntent:
      "Checks that you know where a variable lives and how long it lasts.",
    shortAnswer:
      "A local variable is declared inside a method or block and exists only while that code runs. An instance variable is declared in a class without `static` and each object gets its own copy. A static variable is declared with `static`, belongs to the class and is shared by all objects. Instance and static variables get default values, local variables do not.",
    detailedAnswer: [
      "Local variables must be assigned before use, or the code does not compile. They live on the stack frame of the method call.",
      "Instance variables are created with the object and live as long as the object does. Each object has independent values.",
      "A static variable is created once when the class is initialised. Any change is visible through every instance and through the class name.",
      "Scope is limited by braces. A variable declared in a loop body is not visible after the loop.",
    ],
    realWorldExample:
      "In a `User` class, `name` is an instance variable because every user has their own. A static `userCount` shared by the class counts how many users were created.",
    codeExamples: [
      {
        title: "Three kinds of variables",
        language: "java",
        code: `public class Counter {
    static int created = 0;   // static: one copy for the class
    int value;                // instance: one copy per object

    Counter() { created++; }

    void bump() {
        int step = 2;         // local: exists only during this call
        value += step;
    }
}`,
        walkthrough: [
          "`created` is shared, so every new `Counter` increases the same number.",
          "`value` belongs to each object separately.",
          "`step` is created when `bump` runs and disappears when it returns.",
        ],
      },
    ],
    commonMistakes: [
      "Using a local variable before assigning it.",
      "Treating a static counter as if each object had its own.",
    ],
    followUps: [
      { question: "Where are local variables and objects stored in memory?" },
    ],
    answerTips: [
      "Compare them on three points: where declared, who owns it, how long it lives.",
    ],
    keyPoints: [
      "Local: method scope, no default",
      "Instance: per object",
      "Static: per class, shared",
      "Default values only for fields",
    ],
    revisionNotes: ["Local per call, instance per object, static per class."],
    sourceRefs: [
      {
        label: "Oracle tutorial: Variables",
        url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "default-values",
    topic: "Data types",
    difficulty: "easy",
    title: "What are the default values of variables in Java?",
    keywords: [
      "default value",
      "null",
      "zero",
      "initialisation",
      "local variable",
    ],
    interviewerIntent:
      "Checks that you know the difference between fields, which get defaults, and local variables, which do not.",
    shortAnswer:
      "Fields get a default value if you do not set one: `0` for numeric types, `0.0` for float and double, `false` for boolean, the null character for char, and `null` for every reference type. Local variables get no default. The compiler rejects code that reads a local variable before it is definitely assigned.",
    detailedAnswer: [
      "Array elements are fields of the array object, so a new `int[3]` holds three zeros and a new `String[3]` holds three nulls.",
      "The default for a reference is `null`, so calling a method on an unassigned object field throws a `NullPointerException` at runtime.",
      "Local variables must be initialised, which is a compile-time check called definite assignment.",
      "Do not rely on defaults for clarity: initialise important fields in the declaration or constructor.",
    ],
    realWorldExample:
      "A `boolean active` field defaults to `false`, so a new account is inactive until your code activates it. A `String email` field defaults to `null`, which is different from an empty string.",
    codeExamples: [
      {
        title: "Defaults for fields, none for locals",
        language: "java",
        code: `public class Defaults {
    int count;        // 0
    double price;     // 0.0
    boolean ready;    // false
    String name;      // null

    void show() {
        int local;
        // System.out.println(local); // compile error: might not have been initialized
        System.out.println(count + " " + price + " " + ready + " " + name);
    }
}`,
        walkthrough: [
          "The fields receive their type's default automatically.",
          "The reference field `name` is `null`, not an empty string.",
          "The commented line fails to compile because a local variable has no default.",
        ],
      },
    ],
    commonMistakes: [
      "Assuming local variables default to zero.",
      "Confusing a null string with an empty string.",
    ],
    followUps: [{ question: "What is the default value of an array element?" }],
    answerTips: ["Say the rule first: fields get defaults, locals do not."],
    keyPoints: [
      "Numbers 0, boolean false, references null",
      "Locals must be assigned",
      "Array elements get defaults too",
    ],
    revisionNotes: ["Fields default, locals must be set."],
    sourceRefs: [
      {
        label: "Oracle tutorial: Variables (default values)",
        url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "type-casting",
    topic: "Data types",
    difficulty: "easy",
    title:
      "What is type casting in Java? Explain widening and narrowing conversion.",
    keywords: [
      "type casting",
      "widening",
      "narrowing",
      "implicit",
      "explicit",
      "data loss",
    ],
    interviewerIntent:
      "Tests whether you know when Java converts types for you and when data can be lost.",
    shortAnswer:
      "Widening converts a smaller type to a larger one, such as int to long or int to double. It is automatic because no data is lost. Narrowing converts a larger type to a smaller one, such as double to int, and needs an explicit cast like `(int) 3.9`. Narrowing can lose information, because the fractional part is dropped or the value overflows.",
    detailedAnswer: [
      "The widening order for numbers is byte, short, int, long, float, double. Char also widens to int.",
      "A cast from double to int truncates toward zero, so `(int) 3.9` is `3` and `(int) -3.9` is `-3`. It does not round.",
      "A cast to a smaller integer type keeps only the low bits, so `(byte) 130` becomes `-126`.",
      "Integer division of two ints is an int: `7 / 2` is `3`. Cast one operand to double to get `3.5`.",
    ],
    realWorldExample:
      "Calculating an average with `sum / count` on two int values silently drops the decimals. Casting `(double) sum / count` returns the expected result.",
    codeExamples: [
      {
        title: "Widening and narrowing",
        language: "java",
        code: `int i = 42;
long l = i;          // widening, automatic
double d = i;        // widening, automatic

double price = 3.99;
int whole = (int) price;      // narrowing, explicit -> 3
byte b = (byte) 130;          // overflow -> -126

System.out.println(7 / 2);          // 3
System.out.println((double) 7 / 2); // 3.5`,
        walkthrough: [
          "Assigning an int to a long or double needs no cast.",
          "Casting a double to int drops the fraction instead of rounding.",
          "130 does not fit in a byte, so only the low eight bits remain and the value wraps to -126.",
          "Casting one operand to double makes the division use decimals.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting a cast from double to int to round.",
      "Dividing two ints and expecting decimals.",
    ],
    followUps: [
      {
        question:
          "Why does `byte b = 10; b = b + 1;` not compile but `b += 1;` does?",
        hint: "Compound assignment includes an implicit cast.",
      },
    ],
    answerTips: [
      "Use `(int) 3.9` and `7 / 2` as quick examples that show you know the traps.",
    ],
    keyPoints: [
      "Widening is automatic and safe",
      "Narrowing needs a cast and can lose data",
      "Cast truncates, it does not round",
      "int / int is an int",
    ],
    revisionNotes: ["Small to big is free, big to small needs a cast."],
    sourceRefs: [
      {
        label: "Java Language Specification: Conversions and Contexts",
        url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "wrapper-classes-autoboxing",
    topic: "Data types",
    difficulty: "easy",
    title: "What are wrapper classes? What are autoboxing and unboxing?",
    keywords: [
      "wrapper class",
      "Integer",
      "autoboxing",
      "unboxing",
      "primitive",
      "NullPointerException",
    ],
    interviewerIntent:
      "Checks that you know how primitives and objects connect, especially in collections.",
    shortAnswer:
      "Each primitive has a wrapper class, such as Integer for int, that turns the value into an object. Generic types like `List<Integer>` can only hold objects, so wrappers are needed. Autoboxing is the automatic conversion from primitive to wrapper, and unboxing is the reverse. Unboxing a null wrapper throws a NullPointerException.",
    detailedAnswer: [
      "Wrappers are immutable. `Integer` also provides helpers such as `parseInt`, `valueOf` and `compare`.",
      "`list.add(5)` boxes `5` to an `Integer`, and `int x = list.get(0)` unboxes it.",
      "A wrapper can be null while a primitive cannot, which is useful for 'no value' but dangerous when unboxed.",
      "Boxing in tight loops creates objects and can slow code down. Prefer primitives for heavy arithmetic.",
    ],
    realWorldExample:
      "A database column that may be empty is mapped to `Integer` in an entity so that null means 'no value', while a `int` field would force a default of 0.",
    codeExamples: [
      {
        title: "Boxing, unboxing and a null trap",
        language: "java",
        code: `List<Integer> scores = new ArrayList<>();
scores.add(90);               // autoboxing int -> Integer
int first = scores.get(0);    // unboxing Integer -> int

Integer missing = null;
// int x = missing;           // NullPointerException at runtime

scores.remove(Integer.valueOf(90)); // remove by value
scores.remove(0);                   // remove by index`,
        walkthrough: [
          "The compiler boxes the int so it can be stored in the list.",
          "Reading the element converts it back to a primitive.",
          "Unboxing a null wrapper fails at runtime.",
          "`remove(int)` removes by index while `remove(Object)` removes by value, which is a classic trap.",
        ],
      },
    ],
    commonMistakes: [
      "Unboxing a value that may be null.",
      "Confusing List.remove(int index) with remove(Object).",
    ],
    followUps: [
      {
        question:
          "Why does `Integer a = 128, b = 128; a == b` often print false?",
      },
    ],
    answerTips: ["Mention generics as the reason wrappers exist."],
    keyPoints: [
      "Wrappers turn primitives into objects",
      "Needed for generics",
      "Autoboxing and unboxing are automatic",
      "Null unboxing throws NPE",
    ],
    revisionNotes: ["Wrapper for objects, primitive for speed."],
    sourceRefs: [
      {
        label: "Oracle tutorial: Autoboxing and Unboxing",
        url: "https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "primitive-data-types",
    topic: "Data types",
    difficulty: "easy",
    title: "What are the primitive data types in Java and their sizes?",
    keywords: [
      "primitive types",
      "byte",
      "short",
      "int",
      "long",
      "float",
      "double",
      "char",
      "boolean",
    ],
    interviewerIntent:
      "A basic recall question. It also shows whether you pick the right type for a problem.",
    shortAnswer:
      "Java has eight primitive types: byte (8 bits), short (16), int (32), long (64), float (32), double (64), char (16, a UTF-16 code unit) and boolean (true or false). int is the default for whole numbers and double for decimals. Primitives hold values directly and are not objects.",
    detailedAnswer: [
      "Ranges: `int` is about minus 2.1 billion to plus 2.1 billion. Use `long` for larger values and add an `L` suffix to long literals.",
      "A decimal literal like `3.14` is a double. A float literal needs an `f` suffix: `3.14f`.",
      "`char` stores a single UTF-16 code unit, so some emoji need two chars.",
      "The size of a boolean is not exactly defined by the language, it only has two values.",
    ],
    realWorldExample:
      "A timestamp in milliseconds does not fit in an int, so it is stored in a long. A money amount in the smallest currency unit, like paise, can also be a long.",
    codeExamples: [
      {
        title: "Literals and suffixes",
        language: "java",
        code: `int age = 25;
long views = 3_000_000_000L;   // needs L, too big for int
float ratio = 0.75f;           // needs f
double pi = 3.14159;
char grade = 'A';
boolean passed = true;
System.out.println(Integer.MAX_VALUE);  // 2147483647`,
        walkthrough: [
          "Underscores in numeric literals are allowed for readability.",
          "Without `L`, the literal 3000000000 is an int and does not compile.",
          "Without `f`, 0.75 is a double and cannot be assigned to a float.",
          "`Integer.MAX_VALUE` prints the largest int.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting the `L` or `f` suffix.",
      "Saying String is a primitive type.",
    ],
    followUps: [
      {
        question: "What happens when an int overflows?",
        hint: "It wraps around silently.",
      },
    ],
    answerTips: [
      "Group them: four integers, two floating-point types, char and boolean.",
    ],
    keyPoints: [
      "Eight primitives",
      "int and double are the defaults",
      "char is a 16-bit UTF-16 unit",
      "String is not a primitive",
    ],
    revisionNotes: ["byte short int long, float double, char boolean."],
    sourceRefs: [
      {
        label: "Oracle tutorial: Primitive Data Types",
        url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "integer-cache",
    topic: "Data types",
    difficulty: "medium",
    title:
      "Why does Integer a = 127, b = 127 give a == b true but 128 give false?",
    keywords: [
      "Integer cache",
      "autoboxing",
      "==",
      "equals",
      "valueOf",
      "wrapper",
    ],
    interviewerIntent:
      "A well-known trap that checks whether you compare objects with equals instead of ==.",
    shortAnswer:
      "Autoboxing calls `Integer.valueOf`, which reuses cached Integer objects for values from -128 to 127. So two boxed 127s are the same object and `==` is true. A boxed 128 is usually a new object each time, so `==` compares different references and is false. Always compare wrapper objects with `equals`.",
    detailedAnswer: [
      "`==` on objects compares references, not values. It only looks right for small values because of the cache.",
      "The language specification guarantees caching for -128 to 127 when boxing. Outside that range the result is not guaranteed, so never depend on it.",
      "`new Integer(x)` is deprecated; use `Integer.valueOf(x)` or autoboxing.",
      "`equals` compares the numeric value, and `Objects.equals(a, b)` also handles nulls.",
    ],
    realWorldExample:
      "A bug appears only when an ID crosses 127: a comparison `order.getCustomerId() == id` on Integer fields passes in tests with small IDs and fails in production.",
    codeExamples: [
      {
        title: "The cache boundary",
        language: "java",
        code: `Integer a = 127, b = 127;
System.out.println(a == b);       // true  (cached)

Integer c = 128, d = 128;
System.out.println(c == d);       // false (different objects)
System.out.println(c.equals(d));  // true  (same value)`,
        walkthrough: [
          "Both 127 values come from the same cached object.",
          "128 is outside the guaranteed cache range and creates separate objects.",
          "`equals` compares values and is the correct way to compare wrappers.",
        ],
      },
    ],
    commonMistakes: [
      "Comparing wrapper objects with `==`.",
      "Assuming the cache range is the same on every JVM.",
    ],
    followUps: [
      { question: "Is the same true for Long, Short and Character?" },
    ],
    answerTips: [
      "End with the rule: use equals for objects, == for primitives.",
    ],
    keyPoints: [
      "valueOf caches -128 to 127",
      "== compares references for objects",
      "Use equals for wrappers",
      "Do not rely on the cache",
    ],
    revisionNotes: ["Small boxed ints are shared, big ones are not."],
    sourceRefs: [
      {
        label: "Java Language Specification: Boxing Conversion",
        url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html#jls-5.1.7",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "double-vs-bigdecimal",
    topic: "Data types",
    difficulty: "medium",
    title:
      "Why should you not use float or double for money? What do you use instead?",
    keywords: [
      "double",
      "BigDecimal",
      "floating point",
      "precision",
      "money",
      "rounding",
    ],
    interviewerIntent:
      "Checks that you understand binary floating-point error and the practical fix.",
    shortAnswer:
      "float and double store numbers in binary, so many decimal values like 0.1 cannot be represented exactly and small errors appear: `0.1 + 0.2` is `0.30000000000000004`. For money use `BigDecimal`, built from a String, or store the amount as a long in the smallest unit, such as paise. Compare BigDecimal values with `compareTo`, not `equals`.",
    detailedAnswer: [
      "Binary floating point is fine for measurements but not for exact decimal amounts that must add up to the cent.",
      'Create BigDecimal from a string, `new BigDecimal("0.10")`. `new BigDecimal(0.1)` captures the already inexact double.',
      "`equals` on BigDecimal also compares scale, so `2.0` and `2.00` are not equal. `compareTo` returns 0 for both.",
      "Division needs an explicit rounding mode or scale, otherwise a non-terminating result throws ArithmeticException.",
    ],
    realWorldExample:
      "An invoice total built from double prices is off by a paisa after hundreds of lines. Using BigDecimal with a fixed scale and rounding mode makes the total match the accounting system.",
    codeExamples: [
      {
        title: "double versus BigDecimal",
        language: "java",
        code: `System.out.println(0.1 + 0.2);  // 0.30000000000000004

BigDecimal a = new BigDecimal("0.1");
BigDecimal b = new BigDecimal("0.2");
System.out.println(a.add(b));   // 0.3

BigDecimal x = new BigDecimal("2.0");
BigDecimal y = new BigDecimal("2.00");
System.out.println(x.equals(y));       // false (different scale)
System.out.println(x.compareTo(y));    // 0`,
        walkthrough: [
          "The double sum shows the binary rounding error.",
          "BigDecimal built from strings adds exactly.",
          "`equals` also compares scale, so 2.0 and 2.00 differ.",
          "`compareTo` ignores scale and reports they are numerically equal.",
        ],
      },
    ],
    commonMistakes: [
      "Using `new BigDecimal(0.1)` instead of the String constructor.",
      "Comparing BigDecimal with equals.",
    ],
    followUps: [
      {
        question: "How do you divide two BigDecimals safely?",
        hint: "Provide a scale and RoundingMode.",
      },
    ],
    answerTips: [
      "Show 0.1 + 0.2 first, it makes the problem obvious in one line.",
    ],
    keyPoints: [
      "double cannot store most decimals exactly",
      "BigDecimal from String",
      "compareTo not equals",
      "Or keep money in a long of the smallest unit",
    ],
    revisionNotes: ["Money: BigDecimal from strings."],
    sourceRefs: [
      {
        label: "Java SE API: BigDecimal",
        url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "string-pool-and-new",
    topic: "Strings",
    difficulty: "medium",
    title:
      "What is the String pool? What is the difference between a string literal and new String()?",
    keywords: [
      "string pool",
      "intern",
      "string literal",
      "new String",
      "heap",
      "equals",
    ],
    interviewerIntent:
      "Tests whether you can explain object creation and why == on strings is unreliable.",
    shortAnswer:
      'String literals are interned: the JVM keeps one shared String object per distinct literal in a pool and reuses it. `new String("hi")` always creates a new object on the heap, even if the same text is in the pool. So two literals with the same text are `==`, but a literal and a `new String` are not, although `equals` is true for both.',
    detailedAnswer: [
      "The pool exists to save memory, which is safe because strings are immutable.",
      "`s.intern()` returns the pooled instance for that text, adding it if needed.",
      "Creating strings with `new String(...)` is rarely needed and wastes memory.",
      "Strings built at runtime, such as by concatenation with a variable, are new objects and are not pooled unless you call `intern`.",
    ],
    realWorldExample:
      'A bug where `if (status == "ACTIVE")` works for literals in tests but fails for values read from a database or request, because those strings are not the pooled objects.',
    codeExamples: [
      {
        title: "Pool versus heap",
        language: "java",
        code: `String a = "hello";
String b = "hello";
String c = new String("hello");

System.out.println(a == b);          // true  (same pooled object)
System.out.println(a == c);          // false (c is a new object)
System.out.println(a.equals(c));     // true  (same characters)
System.out.println(a == c.intern()); // true`,
        walkthrough: [
          "Both literals refer to the same pooled string.",
          "`new String` creates a separate object.",
          "`equals` compares the characters, so it is true.",
          "`intern` returns the pooled instance, which is the same object as `a`.",
        ],
      },
    ],
    commonMistakes: [
      "Comparing strings with `==`.",
      'Using `new String("x")` without a reason.',
    ],
    followUps: [
      {
        question: 'How many objects does `new String("hello")` create?',
        hint: "One on the heap, plus the pooled literal if not yet present.",
      },
    ],
    answerTips: ["Finish with the rule: use equals for content, never ==."],
    keyPoints: [
      "Literals share a pooled object",
      "new String creates a new object",
      "intern returns the pooled copy",
      "Use equals",
    ],
    revisionNotes: ["Literal = pooled, new = fresh object."],
    sourceRefs: [
      {
        label: "Java SE API: String.intern",
        url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "string-vs-builder-vs-buffer",
    topic: "Strings",
    difficulty: "easy",
    title:
      "What is the difference between String, StringBuilder and StringBuffer?",
    keywords: [
      "String",
      "StringBuilder",
      "StringBuffer",
      "mutable",
      "immutable",
      "thread-safe",
    ],
    interviewerIntent:
      "A classic. Checks that you know when to choose each and why repeated concatenation is slow.",
    shortAnswer:
      "String is immutable, so every change creates a new object. StringBuilder is mutable and fast but not thread-safe. StringBuffer is mutable and thread-safe because its methods are synchronized, which makes it slower. Use String for fixed text, StringBuilder for building text in a loop, and StringBuffer only when several threads share the same builder.",
    detailedAnswer: [
      "Concatenating in a loop with `+=` creates a new String each time, which is slow for many iterations.",
      "StringBuilder keeps a growing character buffer and only creates the final String when you call `toString()`.",
      "For simple one-line concatenation the compiler optimises `+`, so do not replace every `+` with a builder.",
      "Sharing a builder across threads is rare. Usually each thread uses its own StringBuilder.",
    ],
    realWorldExample:
      "Building a large CSV export row by row uses a StringBuilder, then writes the final string once instead of creating thousands of temporary strings.",
    codeExamples: [
      {
        title: "Building in a loop",
        language: "java",
        code: `// Slow for many iterations: new String every time
String s = "";
for (int i = 0; i < 5; i++) { s += i; }

// Better: one growing buffer
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 5; i++) { sb.append(i).append(','); }
sb.setLength(sb.length() - 1);   // remove trailing comma
System.out.println(sb);          // 0,1,2,3,4`,
        walkthrough: [
          "Each `+=` on a String creates a new object and copies the old text.",
          "StringBuilder appends into one buffer and avoids the copies.",
          "`setLength` trims the trailing comma.",
          "Printing the builder calls `toString()`.",
        ],
      },
    ],
    commonMistakes: [
      "Concatenating strings in a large loop.",
      "Using StringBuffer by default out of habit.",
    ],
    followUps: [
      { question: "Why is String immutable? What are the benefits?" },
    ],
    answerTips: ["Make a 3-row mental table: mutable, thread-safe, speed."],
    keyPoints: [
      "String immutable",
      "StringBuilder mutable, not synchronized",
      "StringBuffer mutable, synchronized",
      "Use a builder in loops",
    ],
    revisionNotes: ["Loop? StringBuilder."],
    sourceRefs: [
      {
        label: "Oracle tutorial: The StringBuilder Class",
        url: "https://docs.oracle.com/javase/tutorial/java/data/buffers.html",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "reverse-string-palindrome",
    topic: "Strings",
    difficulty: "easy",
    title:
      "How do you reverse a string and check whether it is a palindrome in Java?",
    keywords: [
      "reverse string",
      "palindrome",
      "StringBuilder",
      "two pointers",
      "charAt",
    ],
    interviewerIntent:
      "A coding warm-up. Interviewers watch whether you handle case and non-letter characters and know the two-pointer approach.",
    shortAnswer:
      "The shortest way to reverse is `new StringBuilder(s).reverse().toString()`. To check a palindrome without extra memory, use two indexes, one at each end, and compare characters while moving them inward. Decide up front whether case and spaces matter, and normalise the string first if they do not.",
    detailedAnswer: [
      "Strings are immutable, so a reversed string is always a new object.",
      "The two-pointer loop runs in O(n) time and O(1) extra space, because it stops at the middle.",
      'To ignore case and punctuation, first keep only letters and digits and lower-case them, for example with `replaceAll("[^A-Za-z0-9]", "")`.',
      "Mention edge cases: an empty string and a single character are palindromes, and null input should be handled or rejected.",
    ],
    realWorldExample:
      "Input validation for a puzzle game or a data-cleaning step often needs a palindrome check on user text after stripping spaces and punctuation.",
    codeExamples: [
      {
        title: "Reverse and palindrome check",
        language: "java",
        code: `static String reverse(String s) {
    return new StringBuilder(s).reverse().toString();
}

static boolean isPalindrome(String input) {
    String s = input.toLowerCase().replaceAll("[^a-z0-9]", "");
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s.charAt(left++) != s.charAt(right--)) return false;
    }
    return true;
}
// isPalindrome("A man, a plan, a canal: Panama") -> true`,
        walkthrough: [
          "`StringBuilder.reverse` does the reversal in one call.",
          "The string is lower-cased and stripped to letters and digits first.",
          "Two indexes start at the ends and move inward.",
          "Any mismatch returns false, and reaching the middle returns true.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting to handle case and punctuation when the question implies it.",
      "Comparing strings with == instead of equals.",
    ],
    followUps: [
      { question: "What is the time and space complexity of each approach?" },
    ],
    answerTips: [
      "State the complexity, and mention that you would ask whether case and spaces matter.",
    ],
    keyPoints: [
      "StringBuilder.reverse for reversing",
      "Two pointers for palindromes",
      "O(n) time, O(1) extra space",
      "Normalise input first",
    ],
    revisionNotes: ["Two pointers from the ends."],
    sourceRefs: [
      {
        label: "Java SE API: StringBuilder.reverse",
        url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/StringBuilder.html",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "break-continue-return",
    topic: "Control flow",
    difficulty: "easy",
    title:
      "What is the difference between break, continue and return? What is a labeled break?",
    keywords: [
      "break",
      "continue",
      "return",
      "labeled break",
      "loop",
      "nested loops",
    ],
    interviewerIntent:
      "Checks control-flow basics, including leaving nested loops cleanly.",
    shortAnswer:
      "`break` exits the nearest loop or switch immediately. `continue` skips the rest of the current iteration and moves on to the next one. `return` exits the whole method, optionally with a value. A labeled break names an outer loop so a single break can leave several nested loops at once.",
    detailedAnswer: [
      "In a `for` loop, `continue` still runs the update step before the next check.",
      "A label is an identifier followed by a colon placed before the loop: `outer: for (...)`.",
      "`break outer;` leaves the loop with that label. `continue outer;` jumps to the next iteration of the outer loop.",
      "Labels are valid but should be rare. Extracting a method and using `return` is often cleaner.",
    ],
    realWorldExample:
      "Searching a 2D seating grid for the first free seat uses a labeled break to stop both loops as soon as one is found.",
    codeExamples: [
      {
        title: "continue and labeled break",
        language: "java",
        code: `for (int i = 1; i <= 5; i++) {
    if (i == 3) continue;     // skip 3
    System.out.print(i + " ");
}                              // 1 2 4 5

outer:
for (int r = 0; r < 3; r++) {
    for (int c = 0; c < 3; c++) {
        if (r * c == 2) break outer;   // leaves both loops
        System.out.print(r + "" + c + " ");
    }
}`,
        walkthrough: [
          "`continue` skips printing for 3 and moves on to 4.",
          "The outer label names the first loop.",
          "When `r * c` equals 2, `break outer` ends both loops at once.",
          "A plain `break` there would only leave the inner loop.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting a plain break to leave nested loops.",
      "Using continue in a while loop and skipping the counter update, causing an infinite loop.",
    ],
    followUps: [
      {
        question:
          "Does break work inside an if statement that is not in a loop?",
      },
    ],
    answerTips: [
      "Give each keyword a one-word job: exit loop, skip iteration, exit method.",
    ],
    keyPoints: [
      "break leaves loop or switch",
      "continue skips to the next iteration",
      "return leaves the method",
      "Labels target outer loops",
    ],
    revisionNotes: ["Break out, continue on, return home."],
    sourceRefs: [
      {
        label: "Oracle tutorial: Branching Statements",
        url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "switch-statement",
    topic: "Control flow",
    difficulty: "easy",
    title:
      "How does the switch statement work in Java? What is fall-through, and what are switch expressions?",
    keywords: [
      "switch",
      "case",
      "break",
      "fall-through",
      "switch expression",
      "default",
    ],
    interviewerIntent:
      "Checks whether you know the classic switch pitfalls and the modern arrow syntax.",
    shortAnswer:
      "A switch compares one value against `case` labels. With the classic colon syntax, execution continues into the next case until a `break`, which is called fall-through. Switch accepts int types, char, enums and, since Java 7, String. Newer switch expressions use `->`, do not fall through and can return a value with no `break`.",
    detailedAnswer: [
      "`default` runs when no case matches. It can appear anywhere, but is usually last.",
      "Case labels must be constants. You cannot use a runtime variable as a case label.",
      "Switch expressions, standard from Java 14, produce a value: `int days = switch (m) { case 2 -> 28; default -> 30; };`.",
      "With an enum, a switch expression must cover every constant or have a default, and the compiler checks it.",
    ],
    realWorldExample:
      "Mapping an order status enum to a label for the UI is neater as a switch expression than as a chain of if-else statements.",
    codeExamples: [
      {
        title: "Classic and arrow forms",
        language: "java",
        code: `String day = "SAT";
switch (day) {
    case "SAT":
    case "SUN":
        System.out.println("weekend");   // both labels share this
        break;
    default:
        System.out.println("weekday");
}

String kind = switch (day) {
    case "SAT", "SUN" -> "weekend";
    default -> "weekday";
};`,
        walkthrough: [
          "Stacked labels share one block because there is no break between them.",
          "`break` stops the fall-through.",
          "The switch expression returns a value directly.",
          "Arrow cases never fall through, so no break is needed.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting `break` and running into the next case.",
      "Using a non-constant case label.",
    ],
    followUps: [{ question: "Which types can you switch on?" }],
    answerTips: [
      "Mention both syntaxes, interviewers like seeing that you know the modern form.",
    ],
    keyPoints: [
      "Classic cases fall through without break",
      "String switch since Java 7",
      "Arrow form has no fall-through",
      "Switch expressions return a value",
    ],
    revisionNotes: ["Colon falls through, arrow does not."],
    sourceRefs: [
      {
        label: "Oracle tutorial: The switch Statement",
        url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "loops-in-java",
    topic: "Control flow",
    difficulty: "easy",
    title:
      "What are the types of loops in Java? How does a do-while differ from a while loop?",
    keywords: [
      "for loop",
      "while loop",
      "do-while",
      "enhanced for",
      "for-each",
      "iteration",
    ],
    interviewerIntent:
      "A basic question. Look for the do-while guarantee and the right choice of loop for each situation.",
    shortAnswer:
      "Java has `for`, `while`, `do-while` and the enhanced `for` (for-each). Use `for` when you know the count, `while` when you loop until a condition changes, and for-each to visit every element of an array or collection. `do-while` checks its condition after the body, so the body always runs at least once.",
    detailedAnswer: [
      "The enhanced for loop hides the index. It cannot modify the array slot being visited and it is not suited to removing items from a list while iterating.",
      "Changing a collection inside a for-each loop throws a `ConcurrentModificationException`. Use an iterator's `remove` or `removeIf`.",
      "An infinite loop is written `while (true)` or `for (;;)` and exits with `break` or `return`.",
      "Prefer the simplest loop that states your intent clearly.",
    ],
    realWorldExample:
      "A menu that must show at least once before asking the user to quit is a natural do-while. Summing prices in an order uses a for-each over the list.",
    codeExamples: [
      {
        title: "The four loops",
        language: "java",
        code: `int[] marks = {70, 80, 90};

for (int i = 0; i < marks.length; i++) System.out.print(marks[i] + " ");
for (int m : marks) System.out.print(m + " ");

int n = 3;
while (n > 0) { System.out.print(n-- + " "); }

int k = 10;
do { System.out.print(k + " "); } while (k < 5);  // prints 10 once`,
        walkthrough: [
          "The classic for loop uses an index and a length check.",
          "The enhanced for loop reads each element directly.",
          "The while loop tests first and can run zero times.",
          "The do-while body runs once even though the condition is false from the start.",
        ],
      },
    ],
    commonMistakes: [
      "Removing from a list inside a for-each loop.",
      "Off-by-one errors with `<=` and `length`.",
    ],
    followUps: [
      {
        question:
          "How do you safely remove elements from a list while looping?",
      },
    ],
    answerTips: [
      "Say which loop you would choose for a given task, that shows judgement.",
    ],
    keyPoints: [
      "for: known count",
      "while: condition first",
      "do-while: runs at least once",
      "for-each: all elements, no index",
    ],
    revisionNotes: ["do-while checks after the body."],
    sourceRefs: [
      {
        label: "Oracle tutorial: The while and do-while Statements",
        url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html",
      },
      {
        label: "Oracle tutorial: The for Statement",
        url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "arrays-basics",
    topic: "Arrays",
    difficulty: "easy",
    title:
      "What are arrays in Java? What is the difference between an array and an ArrayList?",
    keywords: [
      "array",
      "ArrayList",
      "length",
      "fixed size",
      "ArrayIndexOutOfBoundsException",
      "default values",
    ],
    interviewerIntent:
      "Checks array fundamentals and when to move to a collection.",
    shortAnswer:
      "An array is a fixed-size, indexed container of elements of one type, with zero-based indexes. Its size is set at creation and cannot change. It can hold primitives or objects and exposes `length` as a field. An ArrayList is a resizable list of objects that grows automatically and offers methods like `add` and `remove`.",
    detailedAnswer: [
      "New arrays are filled with defaults: zeros, false or null.",
      "Accessing an index outside 0 to length minus 1 throws `ArrayIndexOutOfBoundsException`.",
      "Arrays can hold primitives directly, which is more memory efficient than a list of wrappers.",
      "Use an array when the size is known and fixed, or for performance-sensitive code. Use ArrayList when the size changes.",
    ],
    realWorldExample:
      "A 7-element array stores the days of the week, which never change. The items a user adds to a shopping cart live in an ArrayList because the count varies.",
    codeExamples: [
      {
        title: "Array and ArrayList",
        language: "java",
        code: `int[] scores = new int[3];        // {0, 0, 0}
scores[0] = 90;
System.out.println(scores.length); // 3 (field, no parentheses)
// scores[3] = 1;                  // ArrayIndexOutOfBoundsException

List<String> names = new ArrayList<>();
names.add("Asha");
names.add("Ravi");
System.out.println(names.size());  // 2 (method)`,
        walkthrough: [
          "A new int array holds three zeros.",
          "Arrays use the `length` field, while lists use the `size()` method.",
          "Writing outside the valid indexes throws at runtime.",
          "The list grows as items are added.",
        ],
      },
    ],
    commonMistakes: [
      "Writing `arr.length()` or `list.length`.",
      "Going out of bounds with `<=` in a loop.",
    ],
    followUps: [{ question: "How do you declare and initialise a 2D array?" }],
    answerTips: [
      "Mention that arrays can hold primitives but ArrayList cannot.",
    ],
    keyPoints: [
      "Fixed size, zero-based",
      "length field",
      "Defaults on creation",
      "ArrayList resizes",
    ],
    revisionNotes: ["Array fixed, ArrayList grows."],
    sourceRefs: [
      {
        label: "Oracle tutorial: Arrays",
        url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "copy-an-array",
    topic: "Arrays",
    difficulty: "medium",
    title:
      "How do you copy an array in Java? What is the difference between shallow and deep copy?",
    keywords: [
      "copy array",
      "Arrays.copyOf",
      "System.arraycopy",
      "clone",
      "shallow copy",
      "deep copy",
    ],
    interviewerIntent:
      "Checks that you know assignment copies a reference, and what copying an array of objects really does.",
    shortAnswer:
      "Assigning `b = a` copies the reference, so both names point to the same array. To copy the contents use `Arrays.copyOf`, `System.arraycopy` or `a.clone()`. These make a shallow copy: primitive elements are copied, but for object elements only the references are copied, so both arrays share the same objects.",
    detailedAnswer: [
      "`Arrays.copyOf(a, newLength)` returns a new array and can also truncate or pad it.",
      "`System.arraycopy(src, srcPos, dest, destPos, length)` copies into an existing array and is the low-level, fast option.",
      "For an array of objects, a deep copy needs you to copy each element yourself, for example with a copy constructor.",
      "`Arrays.copyOfRange` copies a slice.",
    ],
    realWorldExample:
      "A game keeps a backup of the board before a move. Copying only the outer array of `Cell` objects makes the backup change when a cell changes, so each Cell must be copied too.",
    codeExamples: [
      {
        title: "Reference versus copy",
        language: "java",
        code: `int[] a = {1, 2, 3};
int[] alias = a;                       // same array
int[] copy = Arrays.copyOf(a, a.length);

a[0] = 99;
System.out.println(alias[0]);  // 99 (same array)
System.out.println(copy[0]);   // 1  (independent copy)

int[] part = Arrays.copyOfRange(a, 1, 3);   // {2, 3}`,
        walkthrough: [
          "`alias` points to the same array, so it sees the change.",
          "`copyOf` creates a separate array with the same values.",
          "Changing `a` does not affect `copy`.",
          "`copyOfRange` copies the elements from index 1 up to but not including 3.",
        ],
      },
    ],
    commonMistakes: [
      "Thinking `b = a` copies the array.",
      "Assuming clone gives a deep copy of an object array.",
    ],
    followUps: [{ question: "How would you deep copy a 2D array?" }],
    answerTips: [
      "Use the alias example first, then name the three copy methods.",
    ],
    keyPoints: [
      "Assignment copies the reference",
      "copyOf, arraycopy and clone copy the contents",
      "All are shallow for objects",
      "Deep copy needs per-element copying",
    ],
    revisionNotes: ["= aliases, copyOf copies."],
    sourceRefs: [
      {
        label: "Oracle tutorial: Arrays (copying)",
        url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html",
      },
      {
        label: "Java SE API: Arrays",
        url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "access-modifiers",
    topic: "Packages",
    difficulty: "easy",
    title:
      "What are the access modifiers in Java? Explain public, protected, default and private.",
    keywords: [
      "access modifiers",
      "public",
      "protected",
      "private",
      "default",
      "package-private",
      "encapsulation",
    ],
    interviewerIntent:
      "Tests whether you understand visibility rules and apply encapsulation.",
    shortAnswer:
      "`public` is visible everywhere. `protected` is visible in the same package and in subclasses. With no modifier, which is called default or package-private, a member is visible only inside its own package. `private` is visible only inside its own class. Fields are normally private and exposed through methods.",
    detailedAnswer: [
      "A top-level class can only be `public` or package-private, never `private` or `protected`.",
      "`protected` gives subclasses in other packages access through inheritance, not through a plain object of the parent type.",
      "Choose the most restrictive modifier that works. This keeps the public surface small and easy to change.",
      "Modifiers apply to classes, fields, methods and constructors. A private constructor is how singletons and utility classes prevent instantiation.",
    ],
    realWorldExample:
      "A `BankAccount` keeps `balance` private and exposes `deposit` and `getBalance`, so no outside code can set a negative balance directly.",
    codeExamples: [
      {
        title: "Visibility at a glance",
        language: "java",
        code: `package bank;

public class Account {
    private double balance;        // only this class
    int branchCode;                // same package
    protected String owner;        // package + subclasses
    public String id;              // everyone

    public double getBalance() { return balance; }
    public void deposit(double amt) {
        if (amt > 0) balance += amt;
    }
}`,
        walkthrough: [
          "`balance` can only be changed through the class's own methods.",
          "`branchCode` has no modifier, so only classes in `bank` see it.",
          "`owner` is also available to subclasses in other packages.",
          "`deposit` guards the field and keeps the object valid.",
        ],
      },
    ],
    commonMistakes: [
      "Making every field public.",
      "Confusing protected with private-to-subclass only.",
    ],
    followUps: [
      {
        question:
          "What happens if you reduce visibility when overriding a method?",
        hint: "It is a compile error.",
      },
    ],
    answerTips: [
      "Order them from widest to narrowest and link private to encapsulation.",
    ],
    keyPoints: [
      "public everywhere",
      "protected: package + subclasses",
      "default: package only",
      "private: class only",
    ],
    revisionNotes: [
      "Widest to narrowest: public, protected, default, private.",
    ],
    sourceRefs: [
      {
        label: "Oracle tutorial: Controlling Access to Members of a Class",
        url: "https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "varargs",
    topic: "Advanced Java",
    difficulty: "medium",
    title: "What are varargs in Java? What are the rules for using them?",
    keywords: [
      "varargs",
      "variable arguments",
      "...",
      "overloading",
      "array parameter",
    ],
    interviewerIntent:
      "Checks that you can write flexible method signatures and know the restrictions.",
    shortAnswer:
      "Varargs let a method accept zero or more arguments of one type, declared as `int... nums`. Inside the method the parameter is an ordinary array. A method can have only one varargs parameter, and it must be the last parameter. The caller can pass separate values or an array.",
    detailedAnswer: [
      "`sum()` with no arguments gives an empty array, not null.",
      "When overloads exist, Java prefers a method without varargs if one matches, and uses the varargs version last.",
      "Varargs of a generic type can cause unchecked warnings, which is why `@SafeVarargs` exists.",
      "`String.format(String, Object...)` and `Arrays.asList(T...)` are well-known varargs methods.",
    ],
    realWorldExample:
      "A logging helper `log(String message, Object... args)` accepts any number of values to fill the placeholders in the message.",
    codeExamples: [
      {
        title: "A varargs method",
        language: "java",
        code: `static int sum(int... nums) {
    int total = 0;
    for (int n : nums) total += n;
    return total;
}

System.out.println(sum());          // 0
System.out.println(sum(5));         // 5
System.out.println(sum(1, 2, 3));   // 6
System.out.println(sum(new int[]{4, 5})); // 9`,
        walkthrough: [
          "`nums` is an int array inside the method.",
          "Calling with no arguments passes an empty array, so the total stays 0.",
          "Several values are packed into an array by the compiler.",
          "An existing array can also be passed directly.",
        ],
      },
    ],
    commonMistakes: [
      "Placing the varargs parameter before another parameter.",
      "Declaring two varargs parameters.",
    ],
    followUps: [
      {
        question:
          "What happens if you overload with both `m(int a)` and `m(int... a)` and call `m(1)`?",
      },
    ],
    answerTips: ["Stress that varargs is just an array underneath."],
    keyPoints: [
      "Syntax: Type... name",
      "One per method, last parameter",
      "Behaves as an array",
      "Zero arguments allowed",
    ],
    revisionNotes: ["Varargs = array in disguise."],
    sourceRefs: [
      {
        label:
          "Oracle tutorial: Passing Information to a Method (arbitrary number of arguments)",
        url: "https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html",
      },
    ],
    estimatedMinutes: 4,
  },
])
