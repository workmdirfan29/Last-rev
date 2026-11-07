import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "stringbuilder-and-formatting",
  title: "StringBuilder, formatting and text blocks",
  topic: "Strings",
  minutes: 45,
  overview:
    "Build text efficiently with `StringBuilder`, format output with `String.format`, and write multi-line text with text blocks.",
  objectives: [
    "Choose between `String`, `StringBuilder` and `StringBuffer`",
    "Build a string in a loop with `append`, `insert`, `reverse` and `setLength`",
    "Format numbers and text with `String.format` and `printf`",
  ],
  prerequisites: ["lesson.java-core.immutability-and-string-pool"],
  sections: [
    {
      kind: "explain",
      heading: "Why not just use +?",
      body: [
        "Joining a few strings with `+` is fine. Inside a loop it is slow, because each `+` creates a new string and copies the old text into it. A thousand joins copy a lot of text.",
        "`StringBuilder` keeps one growing buffer of characters. You change it in place with `append`, `insert`, `delete` and `reverse`, and call `toString()` once at the end.",
        "`StringBuffer` is the older version with synchronised methods, which makes it thread safe and slower. Use `StringBuilder` unless several threads write to the same builder, which is rare.",
      ],
    },
    {
      kind: "code",
      heading: "Building in a loop",
      example: {
        title: "A comma separated list",
        language: "java",
        code: 'StringBuilder sb = new StringBuilder();\nfor (int i = 1; i <= 5; i++) {\n  sb.append(i).append(",");\n}\nsb.setLength(sb.length() - 1);\nSystem.out.println(sb);\n\nSystem.out.println(new StringBuilder("stressed").reverse());\n\nStringBuilder t = new StringBuilder("Java");\nt.insert(0, "Core ").append(" 21");\nSystem.out.println(t);',
        walkthrough: [
          "`append` returns the builder, so calls can be chained.",
          "After the loop the text ends with a comma, so `setLength` cuts off the last character. The output is `1,2,3,4,5`.",
          "`reverse()` turns `stressed` into `desserts`.",
          "`insert(0, ...)` puts text at the start, and the output is `Core Java 21`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Formatting output",
      body: [
        "`String.format` and `System.out.printf` fill placeholders in a template. `%s` is text, `%d` a whole number, `%f` a decimal and `%n` a new line that works on every system.",
        "You can add a width and a precision. `%.2f` prints two decimals, `%5d` pads a number to five characters, and `%-10s` left-aligns text in ten characters.",
        "Formatting is about display. Keep the real number in a variable and format it only when you print it.",
      ],
    },
    {
      kind: "code",
      heading: "format, printf and text blocks",
      example: {
        title: "A small receipt",
        language: "java",
        code: 'String item = "Notebook";\nint qty = 3;\ndouble price = 49.5;\n\nSystem.out.printf("%-10s x%d  %8.2f%n", item, qty, qty * price);\nString line = String.format("Total: %.1f", 148.5);\nSystem.out.println(line);\n\nString json = """\n  {\n    "name": "Asha",\n    "city": "Pune"\n  }\n  """;\nSystem.out.print(json);',
        walkthrough: [
          "`%-10s` pads the item name to ten characters, left-aligned. `%8.2f` prints the amount with two decimals in a width of eight.",
          "`String.format` returns the formatted string instead of printing it.",
          "A **text block** starts and ends with three double quotes. It keeps line breaks and removes the common indent, which is handy for JSON or SQL.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Using `String +=` inside a large loop.",
          fix: "Use a `StringBuilder` and call `toString()` after the loop.",
        },
        {
          mistake: "Forgetting `%n` and getting output on one line.",
          fix: "End the template with `%n` for a portable new line.",
        },
        {
          mistake: "Using `%d` for a `double`.",
          fix: "Use `%f`. A mismatch throws an `IllegalFormatException`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A CSV line for a report",
      scenario: "A report exports rows of data as comma-separated text.",
      body: [
        "Build the line with one `StringBuilder` per row, append each field and a comma, then trim the last comma. For many rows, reuse the builder by calling `setLength(0)` between rows.",
        "Format money with `%.2f` at the moment you write it, so the stored value stays exact.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "builder-reverse",
      prompt: "What does the builder print?",
      code: {
        language: "java",
        code: 'StringBuilder sb = new StringBuilder("abc");\nsb.append("d").reverse();\nSystem.out.println(sb);',
      },
      options: ["dcba", "abcd", "dabc"],
      answer: 0,
      explanation:
        "After `append` the text is `abcd`, and `reverse` turns it into `dcba`.",
    },
    {
      type: "single",
      id: "builder-vs-buffer",
      prompt:
        "Which class is mutable and not synchronised, so it is fastest for single-threaded use?",
      options: ["StringBuilder", "StringBuffer", "String"],
      answer: 0,
      explanation:
        "`StringBuilder` is mutable and has no locking. `StringBuffer` is synchronised and `String` is immutable.",
    },
    {
      type: "blank",
      id: "format-decimal",
      prompt: "The format specifier ___ prints a decimal number.",
      answer: "%f",
      accepted: ["%.2f", "f"],
      explanation:
        "`%f` formats a `double`, and `%.2f` limits it to two decimals.",
    },
    {
      type: "truefalse",
      id: "textblock-indent",
      statement:
        "A text block keeps line breaks and removes the shared leading indent.",
      answer: true,
      explanation:
        "That is what makes text blocks convenient for multi-line text such as JSON or SQL.",
    },
  ],
  assignment: {
    title: "A formatted table",
    task: [
      "Store three product names and prices in arrays.",
      "Print them as a table with aligned columns and two decimals, using `printf`, and print a total line.",
    ],
    checklist: [
      "The name column is left-aligned and the price column is right-aligned",
      "Prices show exactly two decimals",
      "The total is computed in a variable, then formatted when printed",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "join-with-commas",
      title: "Join numbers with commas",
      task: [
        "Write `static String join(int[] numbers)` that returns the numbers separated by commas, with no comma at the end. For `{1, 2, 3}` the result is `1,2,3`.",
      ],
      language: "java",
      starter:
        'public class Join {\n  static String join(int[] numbers) {\n    // your code\n    return "";\n  }\n}',
      solution:
        'public class Join {\n  static String join(int[] numbers) {\n    StringBuilder sb = new StringBuilder();\n    for (int i = 0; i < numbers.length; i++) {\n      if (i > 0) {\n        sb.append(",");\n      }\n      sb.append(numbers[i]);\n    }\n    return sb.toString();\n  }\n}',
      hints: ["Add a comma before every number except the first."],
      checklist: [
        "An empty array returns an empty string",
        "A single number has no comma",
        "I used a StringBuilder, not +=",
      ],
    },
  ],
  revisionNotes: [
    "StringBuilder for loops, StringBuffer only for shared threads",
    "`append` returns the builder, so you can chain",
    "`%s %d %f %n` are the common placeholders",
    "Text blocks use three double quotes",
  ],
  resources: [
    {
      label: "The Java Tutorials: The StringBuilder Class",
      url: "https://docs.oracle.com/javase/tutorial/java/data/buffers.html",
    },
    {
      label: "Java SE API: Formatter",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Formatter.html",
    },
  ],
})
