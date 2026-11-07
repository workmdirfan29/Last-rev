import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "loops",
  title: "Loops: for, while, do-while and for-each",
  topic: "Control flow",
  minutes: 45,
  overview:
    "Repeat work with the four kinds of loop, control them with `break` and `continue`, and avoid the common mistakes.",
  objectives: [
    "Choose between `for`, `while`, `do-while` and for-each",
    "Use `break`, `continue` and labelled `break` correctly",
    "Spot and fix off-by-one errors and infinite loops",
  ],
  prerequisites: ["lesson.java-core.decisions-if-and-switch"],
  sections: [
    {
      kind: "explain",
      heading: "Four loops, four jobs",
      body: [
        "Use a **for** loop when you know how many times to repeat. It has three parts in one line: where to start, when to continue and how to step.",
        "Use a **while** loop when you repeat until something changes, such as reading input until it is empty. The condition is checked before each round, so the body may run zero times.",
        "A **do-while** loop checks the condition after the body, so the body always runs at least once. It suits menus that must show once.",
        "A **for-each** loop visits every element of an array or collection without an index. It is the simplest and safest choice when you only need the values.",
      ],
    },
    {
      kind: "code",
      heading: "The four loops",
      example: {
        title: "Same idea, four forms",
        language: "java",
        code: 'int[] marks = {70, 80, 90};\n\nfor (int i = 0; i < marks.length; i++) {\n  System.out.print(marks[i] + " ");\n}\n\nfor (int m : marks) {\n  System.out.print(m + " ");\n}\n\nint n = 3;\nwhile (n > 0) {\n  System.out.print(n + " ");\n  n--;\n}\n\nint k = 10;\ndo {\n  System.out.print(k + " ");\n} while (k < 5);',
        walkthrough: [
          "The classic `for` uses an index. `i < marks.length` stops before the end, because the last index is `length - 1`.",
          "The for-each loop reads each value into `m`, with no index to get wrong.",
          "The `while` loop must change `n` inside the body, otherwise it never ends.",
          "The `do-while` prints `10` once even though `k < 5` is false from the start.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "break, continue and labels",
      body: [
        "`break` leaves the nearest loop at once. `continue` skips the rest of the current round and goes to the next one. In a `for` loop the step part still runs after `continue`.",
        "A **label** names an outer loop, so `break outer;` can leave several nested loops in one step. Labels are valid, but a method with `return` is often clearer.",
        "A loop that never ends is an **infinite loop**. It happens when the condition never becomes false, usually because the counter is not changed, or `continue` skips the step in a `while` loop.",
      ],
    },
    {
      kind: "code",
      heading: "Searching a grid",
      example: {
        title: "A labelled break",
        language: "java",
        code: 'int[][] grid = {\n  {1, 2, 3},\n  {4, 5, 6},\n  {7, 8, 9}\n};\nint target = 5;\nint foundRow = -1;\nint foundCol = -1;\n\nouter:\nfor (int r = 0; r < grid.length; r++) {\n  for (int c = 0; c < grid[r].length; c++) {\n    if (grid[r][c] == target) {\n      foundRow = r;\n      foundCol = c;\n      break outer;\n    }\n  }\n}\nSystem.out.println(foundRow + "," + foundCol);',
        walkthrough: [
          "The outer loop walks the rows and the inner loop walks the columns of one row.",
          "When the target is found, `break outer` leaves both loops at once.",
          "A plain `break` would only leave the inner loop and the outer loop would continue.",
          "The result is `1,1`, the position of 5.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Writing `i <= marks.length` in a loop over an array.",
          fix: "Use `i < marks.length`. The last valid index is `length - 1`, and going further throws `ArrayIndexOutOfBoundsException`.",
        },
        {
          mistake: "Forgetting to change the counter in a `while` loop.",
          fix: "Update the variable the condition depends on inside the body.",
        },
        {
          mistake:
            "Removing items from a list inside a for-each loop over the same list.",
          fix: "Use an `Iterator` and `remove`, or `removeIf`. Changing the list during for-each throws `ConcurrentModificationException`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Totalling an order",
      scenario:
        "A cart has a price for each item and the program must show the total and the most expensive item.",
      body: [
        "A for-each loop is enough for the total: add each price to a running variable. To find the largest, keep a `max` variable and update it with an `if` inside the loop.",
        "Start `max` with the first element, not with 0, so that the code also works when every price is negative or the list holds only large numbers.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "dowhile-once",
      prompt: "How many times does the body of this loop run?",
      code: {
        language: "java",
        code: "int k = 10;\nint count = 0;\ndo {\n  count++;\n} while (k < 5);\nSystem.out.println(count);",
      },
      options: ["1", "0", "5"],
      answer: 0,
      explanation:
        "A do-while checks the condition after the body, so the body runs once even when the condition is false.",
    },
    {
      type: "output",
      id: "continue-effect",
      prompt: "What does this loop print?",
      code: {
        language: "java",
        code: "for (int i = 1; i <= 5; i++) {\n  if (i == 3) {\n    continue;\n  }\n  System.out.print(i);\n}",
      },
      options: ["1245", "12345", "12"],
      answer: 0,
      explanation:
        "`continue` skips the print for 3 and moves on to the next round, so the output is 1245.",
    },
    {
      type: "single",
      id: "loop-choice",
      prompt:
        "You need to visit every element of an array and you do not need the index. Which loop fits best?",
      options: ["for-each", "do-while", "A labelled break"],
      answer: 0,
      explanation:
        "A for-each loop reads each element directly, with no index to manage.",
    },
    {
      type: "blank",
      id: "exit-outer-loop",
      prompt:
        "To leave a named outer loop from inside an inner loop, write ___ outer;",
      answer: "break",
      explanation:
        "A labelled `break` leaves the loop with that label, however deeply it is nested.",
    },
  ],
  assignment: {
    title: "Multiplication table and a number search",
    task: [
      "Print the multiplication table of a number from 1 to 10 using a `for` loop.",
      "Then search an array of ten numbers for a target with a loop and print the index of the first match, or a message if it is missing.",
    ],
    checklist: [
      "The table prints exactly ten lines",
      "The search stops at the first match",
      "I tested a target that is missing",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "sum-of-even-numbers",
      title: "Sum of even numbers",
      task: [
        "Write `static int sumEven(int[] numbers)` that returns the sum of the even numbers in the array. For `{1, 2, 3, 4}` the result is 6.",
      ],
      language: "java",
      starter:
        "public class Sum {\n  static int sumEven(int[] numbers) {\n    // your code\n    return 0;\n  }\n}",
      solution:
        "public class Sum {\n  static int sumEven(int[] numbers) {\n    int total = 0;\n    for (int n : numbers) {\n      if (n % 2 == 0) {\n        total += n;\n      }\n    }\n    return total;\n  }\n}",
      hints: ["A number is even when `n % 2 == 0`."],
      checklist: [
        "An empty array returns 0",
        "Negative even numbers are included",
        "I used a loop and a running total",
      ],
    },
  ],
  revisionNotes: [
    "for: known count, while: until a condition, do-while: at least once, for-each: every element",
    "`break` leaves the loop, `continue` skips one round",
    "Last array index is `length - 1`",
    "Do not change a list inside a for-each over the same list",
  ],
  resources: [
    {
      label: "The Java Tutorials: The for Statement",
      url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html",
    },
    {
      label: "The Java Tutorials: The while and do-while Statements",
      url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html",
    },
    {
      label: "The Java Tutorials: Branching Statements",
      url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html",
    },
  ],
})
