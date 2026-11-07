import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "string-basics",
  title: "Working with strings",
  topic: "Strings",
  minutes: 45,
  overview:
    "Create strings, read their characters, and use the common methods to search, cut, compare and change text.",
  objectives: [
    "Create strings and join them with `+` and `concat`",
    "Use `length`, `charAt`, `substring`, `indexOf`, `contains` and `replace`",
    "Compare strings correctly with `equals` and `equalsIgnoreCase`",
  ],
  prerequisites: ["lesson.java-core.primitive-types"],
  sections: [
    {
      kind: "explain",
      heading: "What a String is",
      body: [
        'A `String` is a sequence of characters, such as `"Hello"`. It is a class, not a primitive, so a string variable holds a reference to a `String` object.',
        'Positions in a string start at **0**. In `"Java"`, `J` is at index 0 and `a` at index 3. The `length()` method returns the number of characters, which is 4.',
        "Strings in Java are **immutable**: no method changes the original. Each method that seems to change a string returns a new one, and you must store it.",
      ],
    },
    {
      kind: "code",
      heading: "Everyday methods",
      example: {
        title: "Reading and searching a string",
        language: "java",
        code: 'String s = "Learn Java today";\nSystem.out.println(s.length());\nSystem.out.println(s.charAt(0));\nSystem.out.println(s.substring(6, 10));\nSystem.out.println(s.indexOf("Java"));\nSystem.out.println(s.contains("today"));\nSystem.out.println(s.toUpperCase());\nSystem.out.println(s.replace("Java", "Spring"));\nSystem.out.println(s);',
        walkthrough: [
          "`length()` is `16`, counting letters and spaces.",
          "`charAt(0)` is `L`, the first character.",
          "`substring(6, 10)` starts at index 6 and stops before index 10, so it gives `Java`.",
          '`indexOf("Java")` returns `6`. If the text is missing it returns `-1`.',
          "`replace` and `toUpperCase` return new strings. The last line shows the original is unchanged.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Comparing strings",
      body: [
        "Use `equals` to check whether two strings have the same characters, and `equalsIgnoreCase` to ignore capital letters. The `==` operator compares references, not text, so it is not reliable for strings.",
        "Use `compareTo` when you need to sort. It returns a negative number, zero or a positive number depending on the alphabetical order.",
        'To avoid a `NullPointerException` when a value may be null, write the literal first: `"ADMIN".equals(role)`.',
      ],
    },
    {
      kind: "code",
      heading: "Equality and text blocks",
      example: {
        title: "equals versus ==",
        language: "java",
        code: 'String a = "java";\nString b = new String("java");\nSystem.out.println(a == b);\nSystem.out.println(a.equals(b));\nSystem.out.println("JAVA".equalsIgnoreCase(a));\n\nString name = null;\nSystem.out.println("admin".equals(name));\n\nString csv = " a, b ,c ";\nSystem.out.println(csv.trim().split(",").length);',
        walkthrough: [
          "`a == b` is `false`. `b` is a separate object, even though its text matches.",
          "`a.equals(b)` is `true` because the characters are the same.",
          "`equalsIgnoreCase` ignores letter case.",
          '`"admin".equals(name)` is safe when `name` is `null`. It returns `false` and does not throw.',
          '`trim` removes spaces at both ends, and `split(",")` cuts the text into three parts.',
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Writing `s.toUpperCase();` and expecting `s` to change.",
          fix: "Strings are immutable. Write `s = s.toUpperCase();` to keep the result.",
        },
        {
          mistake: "Comparing strings with `==`.",
          fix: "Use `equals`. Put the known literal first to be safe with null.",
        },
        {
          mistake:
            "Using `substring(a, b)` and expecting the end index to be included.",
          fix: "The end index is excluded. `substring(0, 3)` returns the first three characters.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Cleaning a username",
      scenario: "A sign-up form accepts a username typed by the user.",
      body: [
        "Trim spaces, convert to lower case and check that it is not empty. `String clean = input.trim().toLowerCase();` chains the methods, and each one works on the result of the one before.",
        "Then check `clean.isEmpty()` or `clean.length() < 3` before you save it.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "substring-range",
      prompt: "What is printed by the `substring` call?",
      code: {
        language: "java",
        code: 'String s = "Learning";\nSystem.out.println(s.substring(0, 4));',
      },
      options: ["Lear", "Learn", "earn"],
      answer: 0,
      explanation:
        "The start index is included and the end index is excluded, so indexes 0 to 3 give `Lear`.",
    },
    {
      type: "single",
      id: "string-compare-method",
      prompt:
        "Which should you use to check that two strings contain the same text?",
      options: ["equals", "==", "compareTo only"],
      answer: 0,
      explanation:
        "`equals` compares the characters. `==` compares references.",
    },
    {
      type: "truefalse",
      id: "string-immutable-method",
      statement: "Calling `s.toUpperCase()` changes the string stored in `s`.",
      answer: false,
      explanation:
        "Strings are immutable. The method returns a new string and `s` keeps its old value.",
    },
    {
      type: "blank",
      id: "index-missing",
      prompt: "`indexOf` returns ___ when the text is not found.",
      answer: "-1",
      explanation: "A result of `-1` means the text is not in the string.",
    },
  ],
  assignment: {
    title: "Initials from a full name",
    task: [
      'Write a program with a full name in a variable, such as "asha kumar verma".',
      "Print the initials in capital letters, for example AKV, and print the name with the first letter of each word capitalised.",
    ],
    checklist: [
      "I used `split` to get the words",
      "I used `charAt` and `toUpperCase`",
      "It still works when the name has two or four words",
    ],
    hints: ["Split on a space, then loop over the parts."],
    minutes: 20,
  },
  exercises: [
    {
      slug: "is-palindrome",
      title: "Palindrome check",
      task: [
        "Write `static boolean isPalindrome(String s)`. It returns true if the text reads the same forwards and backwards, ignoring case. For example `Level` is a palindrome.",
      ],
      language: "java",
      starter:
        "public class Pal {\n  static boolean isPalindrome(String s) {\n    // your code\n    return false;\n  }\n}",
      solution:
        "public class Pal {\n  static boolean isPalindrome(String s) {\n    String t = s.toLowerCase();\n    int left = 0;\n    int right = t.length() - 1;\n    while (left < right) {\n      if (t.charAt(left) != t.charAt(right)) {\n        return false;\n      }\n      left++;\n      right--;\n    }\n    return true;\n  }\n}",
      hints: ["Compare the first and last characters, then move inwards."],
      checklist: [
        "`Level` and `level` both return true",
        "An empty string and a single letter return true",
        "I did not use `==` to compare strings",
      ],
    },
  ],
  revisionNotes: [
    "Indexes start at 0, `length()` is the count",
    "Strings are immutable: methods return new strings",
    "Use equals, not ==, and put the literal first for null safety",
    "`substring(start, end)` excludes the end index",
  ],
  resources: [
    {
      label: "The Java Tutorials: Strings",
      url: "https://docs.oracle.com/javase/tutorial/java/data/strings.html",
    },
    {
      label: "Java SE API: String",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html",
    },
  ],
})
