import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "first-program",
  title: "Your first Java program",
  topic: "Basics",
  minutes: 45,
  overview:
    "Write, compile and run a small Java program, and learn what each line of it does and how the JDK, JRE and JVM fit together.",
  objectives: [
    "Explain what `main` is and why Java starts there",
    "Compile a `.java` file and run the result from the command line",
    "Tell the JDK, the JRE and the JVM apart",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "From source file to running program",
      body: [
        "You write Java in a **source file** that ends in `.java`. The compiler `javac` turns it into **bytecode** in a `.class` file, and the `java` command runs that bytecode on the **JVM** (Java Virtual Machine).",
        "Bytecode is the same on every operating system. Each system has its own JVM that understands it. This is why Java is called platform independent: the compiled program is portable, and the JVM adapts it to the machine.",
        "Every program starts at a method called `main`. If a class has no `main`, `java` has nowhere to begin.",
      ],
    },
    {
      kind: "diagram",
      heading: "The three names you will hear",
      diagram: {
        kind: "table",
        title: "JDK, JRE and JVM",
        headers: ["Name", "What it is", "What it contains"],
        rows: [
          ["JVM", "Runs bytecode", "The engine that executes `.class` files"],
          ["JRE", "Runs Java programs", "The JVM and the standard libraries"],
          [
            "JDK",
            "Builds and runs Java programs",
            "The JRE plus tools such as `javac`",
          ],
        ],
      },
    },
    {
      kind: "code",
      heading: "Hello, Java",
      intro: "This is the smallest complete program. Save it as Hello.java.",
      example: {
        title: "A complete program",
        language: "java",
        code: 'public class Hello {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java");\n  }\n}',
        walkthrough: [
          "`public class Hello` declares a class. The file must be named `Hello.java`.",
          "`public static void main(String[] args)` is the entry point the JVM calls.",
          "`System.out.println(...)` prints the text and moves to a new line.",
          "Each statement ends with a semicolon, and braces group the code that belongs together.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Compile and run",
      example: {
        title: "Two commands",
        language: "bash",
        code: "javac Hello.java\njava Hello",
        walkthrough: [
          "`javac Hello.java` checks the code and creates `Hello.class`.",
          "`java Hello` starts the JVM and runs the class. Write the class name, without `.class`.",
          "If the compiler finds an error, no `.class` file is created and nothing runs.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake:
            "Saving the file as `hello.java` while the class is `Hello`.",
          fix: "Name the file exactly like the public class: `Hello.java`. Java is case sensitive.",
        },
        {
          mistake:
            "Running `java Hello.java` or `java Hello.class` after compiling.",
          fix: "Run the class name only: `java Hello`.",
        },
        {
          mistake: "Forgetting a semicolon or a closing brace.",
          fix: "Read the first compiler error line number. One missing character often causes several errors.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A greeting for a user",
      scenario: "A small command line tool greets whoever runs it.",
      body: [
        "Change the printed text, compile again with `javac Hello.java`, then run `java Hello`. Compile after every change: `java` runs the last compiled version, not your latest edits.",
        "Real projects use build tools such as Maven or Gradle to do these steps for you, but they run exactly the same compiler underneath.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "compiler-output",
      prompt: "What does `javac Hello.java` produce?",
      options: ["Hello.class (bytecode)", "Hello.exe", "Hello.txt"],
      answer: 0,
      explanation:
        "`javac` compiles source into bytecode in a `.class` file, which the JVM runs.",
    },
    {
      type: "truefalse",
      id: "main-needed",
      statement: "A Java program can start without a `main` method.",
      answer: false,
      explanation:
        "`java` calls `main` to start the program. Without it there is no entry point.",
    },
    {
      type: "output",
      id: "println-output",
      prompt: "What appears on the screen when this code runs?",
      code: {
        language: "java",
        code: 'System.out.println("A");\nSystem.out.println("B");',
      },
      options: ["A then B on two lines", "AB on one line", "Nothing"],
      answer: 0,
      explanation: "`println` ends each print with a new line.",
    },
    {
      type: "single",
      id: "jdk-contains",
      prompt: "Which one includes the `javac` compiler?",
      options: ["The JDK", "The JRE only", "The JVM only"],
      answer: 0,
      explanation:
        "The JDK is the development kit. It contains the JRE and tools such as `javac`.",
    },
  ],
  assignment: {
    title: "Greet yourself",
    task: [
      "Write a program that prints your name and your city on two lines.",
      "Compile it and run it from the command line.",
    ],
    checklist: [
      "The file name matches the class name",
      "It compiles with no errors",
      "It prints two lines",
      "I ran it with `java ClassName`",
    ],
    hints: ["Use two `System.out.println` statements."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "three-lines",
      title: "Print three lines",
      task: ["Print the numbers 1, 2 and 3, each on its own line."],
      language: "java",
      starter:
        "public class Count {\n  public static void main(String[] args) {\n    // your code\n  }\n}",
      solution:
        "public class Count {\n  public static void main(String[] args) {\n    System.out.println(1);\n    System.out.println(2);\n    System.out.println(3);\n  }\n}",
      hints: ["`println` prints a value and then a new line."],
      checklist: ["I used println, not print", "I compiled and ran it myself"],
    },
  ],
  revisionNotes: [
    "`javac` compiles, `java` runs",
    "The entry point is `public static void main(String[] args)`",
    "JDK contains the JRE, and the JRE contains the JVM",
    "The file name must match the public class name",
  ],
  resources: [
    {
      label: "The Java Tutorials: A first application",
      url: "https://docs.oracle.com/javase/tutorial/getStarted/application/index.html",
    },
    {
      label: "The Java Tutorials: About the Java technology",
      url: "https://docs.oracle.com/javase/tutorial/getStarted/intro/definition.html",
    },
  ],
})
