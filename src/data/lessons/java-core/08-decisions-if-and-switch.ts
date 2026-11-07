import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "decisions-if-and-switch",
  title: "Making decisions with if and switch",
  topic: "Control flow",
  minutes: 45,
  overview:
    "Choose between paths in your program with `if`, `else`, the ternary operator and `switch`, including the modern switch expression.",
  objectives: [
    "Write `if`, `else if` and `else` chains with correct conditions",
    "Combine conditions with `&&`, `||` and `!`, and know short-circuit evaluation",
    "Use classic `switch`, understand fall-through, and write a switch expression",
  ],
  prerequisites: ["lesson.java-core.variables-and-operators"],
  sections: [
    {
      kind: "explain",
      heading: "if, else if and else",
      body: [
        "An `if` statement runs a block only when its condition is `true`. The condition must be a `boolean`: Java does not treat `0` or `null` as false the way some languages do.",
        "Add `else if` for more choices and `else` for everything that is left. Java checks the conditions from the top and runs the **first** block whose condition is true, then skips the rest.",
        "Join conditions with `&&` (AND), `||` (OR) and `!` (NOT). Java uses **short-circuit** evaluation: in `a && b`, if `a` is false then `b` is never evaluated, which is why `s != null && s.length() > 3` is safe.",
      ],
    },
    {
      kind: "code",
      heading: "A grade calculator",
      example: {
        title: "An if chain and the ternary operator",
        language: "java",
        code: 'int marks = 72;\nString grade;\nif (marks >= 90) {\n  grade = "A";\n} else if (marks >= 75) {\n  grade = "B";\n} else if (marks >= 60) {\n  grade = "C";\n} else {\n  grade = "Fail";\n}\nSystem.out.println(grade);\n\nString result = marks >= 40 ? "pass" : "fail";\nSystem.out.println(result);\n\nString name = null;\nif (name != null && name.length() > 3) {\n  System.out.println("long name");\n}',
        walkthrough: [
          "The chain is checked from the top. `72` is not 90 or more and not 75 or more, so it reaches `marks >= 60` and `grade` becomes `C`.",
          "The ternary operator `condition ? a : b` picks one of two values in a single expression.",
          "`name != null && ...` stops at the first check, so `name.length()` is never called on `null`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "switch",
      body: [
        "`switch` chooses between many fixed values of one variable. It works with `int`, `char`, `String` and enums, and not with decimals.",
        "In the classic form each `case` ends with `break`. Without `break` execution **falls through** into the next case. Sometimes that is useful, as when several cases share one block, but it is a common source of bugs.",
        "The newer **switch expression** uses arrows. It has no fall-through, needs no `break`, and produces a value, which makes the code shorter and safer.",
      ],
    },
    {
      kind: "code",
      heading: "Classic switch and switch expression",
      example: {
        title: "Two ways to write the same decision",
        language: "java",
        code: 'String day = "SAT";\nswitch (day) {\n  case "SAT":\n  case "SUN":\n    System.out.println("weekend");\n    break;\n  default:\n    System.out.println("weekday");\n}\n\nString kind = switch (day) {\n  case "SAT", "SUN" -> "weekend";\n  default -> "weekday";\n};\nSystem.out.println(kind);',
        walkthrough: [
          '`case "SAT":` has no `break`, so it falls through to `case "SUN":` and both share one block.',
          "`break` stops the fall-through. `default` runs when no case matches.",
          'The switch expression returns a value directly. `case "SAT", "SUN"` lists two values with one arrow.',
          "Arrow cases never fall through, so no `break` is needed.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Writing `if (x = 5)` instead of `if (x == 5)`.",
          fix: "`=` assigns and `==` compares. In Java `if (x = 5)` is a compile error for an `int`, but `if (flag = true)` compiles and assigns.",
        },
        {
          mistake: "Forgetting `break` in a classic `switch`.",
          fix: "Add `break`, or use the arrow form, which never falls through.",
        },
        {
          mistake:
            "Ordering an `else if` chain from the most general to the most specific condition.",
          fix: "Put the most specific test first. `marks >= 60` before `marks >= 90` would hide the higher grades.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A shipping charge",
      scenario:
        "An online shop charges for delivery depending on the order total and the delivery type.",
      body: [
        "Use an `if` chain for ranges of the order total, and a `switch` on the delivery type, which is one of a few fixed words such as `STANDARD` and `EXPRESS`.",
        'Return the charge from a method. A switch expression fits well: `return switch (type) { case "EXPRESS" -> 120; default -> 40; };`.',
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "if-chain-order",
      prompt: "Which line is printed by this if chain?",
      code: {
        language: "java",
        code: 'int n = 80;\nif (n > 50) {\n  System.out.println("A");\n} else if (n > 70) {\n  System.out.println("B");\n}',
      },
      options: ["A", "B", "A and B"],
      answer: 0,
      explanation:
        "The first true condition wins and the rest are skipped. `80 > 50` is true, so `A` prints and the `else if` is never checked.",
    },
    {
      type: "output",
      id: "switch-fallthrough",
      prompt: "What does the classic switch print when `x` is 1?",
      code: {
        language: "java",
        code: 'int x = 1;\nswitch (x) {\n  case 1:\n    System.out.print("one ");\n  case 2:\n    System.out.print("two ");\n    break;\n  case 3:\n    System.out.print("three ");\n}',
      },
      options: ["one two", "one", "one two three"],
      answer: 0,
      explanation:
        "Case 1 has no `break`, so execution falls through to case 2 and stops at its `break`.",
    },
    {
      type: "single",
      id: "short-circuit",
      prompt: "In `a && b`, when is `b` evaluated?",
      options: ["Only if `a` is true", "Always", "Only if `a` is false"],
      answer: 0,
      explanation:
        "`&&` short-circuits: if `a` is false the whole expression is false, so `b` is skipped.",
    },
    {
      type: "truefalse",
      id: "switch-double",
      statement: "A `switch` statement can switch on a `double` value.",
      answer: false,
      explanation:
        "`switch` works with `int`-like types, `char`, `String` and enums, not with decimals.",
    },
  ],
  assignment: {
    title: "Ticket price calculator",
    task: [
      "Write a program that sets an age and a day of the week, and prints the ticket price.",
      "Children under 12 and seniors over 60 pay half price, and weekends cost 20 more. Use an `if` chain for the age and a `switch` for the day.",
    ],
    checklist: [
      "Ages 11, 12, 60 and 61 all give the right price",
      "Saturday and Sunday are handled in one switch block",
      "I tested at least six inputs by hand",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "days-in-month",
      title: "Days in a month",
      task: [
        "Write `static int daysIn(int month, boolean leapYear)` that returns the number of days. Month 1 is January. Use a switch expression.",
      ],
      language: "java",
      starter:
        "public class Days {\n  static int daysIn(int month, boolean leapYear) {\n    // your code\n    return 0;\n  }\n}",
      solution:
        "public class Days {\n  static int daysIn(int month, boolean leapYear) {\n    return switch (month) {\n      case 4, 6, 9, 11 -> 30;\n      case 2 -> leapYear ? 29 : 28;\n      default -> 31;\n    };\n  }\n}",
      hints: ["Group the months that share a value with commas."],
      checklist: [
        "February gives 28 or 29 depending on leapYear",
        "April, June, September and November give 30",
        "All other months give 31",
      ],
    },
  ],
  revisionNotes: [
    "The first true branch wins, the rest are skipped",
    "`&&` and `||` short-circuit",
    "Classic switch falls through without `break`",
    "A switch expression returns a value and does not fall through",
  ],
  resources: [
    {
      label: "The Java Tutorials: The if-then and if-then-else Statements",
      url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html",
    },
    {
      label: "The Java Tutorials: The switch Statement",
      url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html",
    },
  ],
})
