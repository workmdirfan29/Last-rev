import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "two-dimensional-arrays-and-utilities",
  title: "2D arrays, sorting and searching",
  topic: "Arrays",
  minutes: 55,
  overview:
    "Work with tables of values using two-dimensional arrays, and use the `Arrays` class to sort, search, fill and compare arrays.",
  objectives: [
    "Create and loop over a two-dimensional array, including jagged arrays",
    "Sort an array and use `binarySearch` correctly",
    "Compare arrays with `Arrays.equals` and know why `==` is not enough",
  ],
  prerequisites: ["lesson.java-core.arrays"],
  sections: [
    {
      kind: "explain",
      heading: "Arrays of arrays",
      body: [
        "Java has no special matrix type. A **two-dimensional array** is an array whose elements are themselves arrays. `grid[r][c]` reads the element in row `r` and column `c`.",
        "`grid.length` is the number of rows, and `grid[r].length` is the length of row `r`. The rows do not have to be the same length. A table with rows of different lengths is called a **jagged array**.",
        "Use two nested loops to visit every element: the outer loop over the rows and the inner loop over the columns of that row.",
      ],
    },
    {
      kind: "code",
      heading: "A table of marks",
      example: {
        title: "Nested loops over a 2D array",
        language: "java",
        code: 'int[][] marks = {\n  {70, 80, 90},\n  {60, 75},\n  {88, 92, 95, 100}\n};\n\nfor (int r = 0; r < marks.length; r++) {\n  int sum = 0;\n  for (int c = 0; c < marks[r].length; c++) {\n    sum += marks[r][c];\n  }\n  System.out.println("Row " + r + " total: " + sum);\n}\n\nint[][] board = new int[2][3];\nSystem.out.println(board[1][2]);',
        walkthrough: [
          "`marks.length` is 3, one entry per row. Each row has its own length, so the loop reads `marks[r].length` for the columns.",
          "The totals are 240, 135 and 375. The second row has only two values, so the table is jagged.",
          "`new int[2][3]` creates two rows of three columns, all filled with `0`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The Arrays utility class",
      body: [
        "`Arrays.sort(a)` sorts in place in ascending order. For objects it uses their natural order, such as alphabetical order for strings.",
        "`Arrays.binarySearch(a, key)` finds a value quickly, but only in an array that is **already sorted**. If the value is missing, it returns a negative number.",
        "`Arrays.equals(a, b)` compares the contents of two arrays, while `a == b` and `a.equals(b)` only check whether they are the same object. `Arrays.fill(a, value)` sets every element, and `Arrays.asList` wraps an object array as a list.",
      ],
    },
    {
      kind: "code",
      heading: "Sort, search and compare",
      example: {
        title: "Common Arrays methods",
        language: "java",
        code: "import java.util.Arrays;\n\nint[] a = {5, 2, 9, 1};\nArrays.sort(a);\nSystem.out.println(Arrays.toString(a));\nSystem.out.println(Arrays.binarySearch(a, 5));\nSystem.out.println(Arrays.binarySearch(a, 4) < 0);\n\nint[] b = {1, 2, 5, 9};\nSystem.out.println(a == b);\nSystem.out.println(a.equals(b));\nSystem.out.println(Arrays.equals(a, b));\n\nint[] filled = new int[3];\nArrays.fill(filled, 7);\nSystem.out.println(Arrays.toString(filled));\nSystem.out.println(Arrays.deepToString(new int[][]{{1, 2}, {3}}));",
        walkthrough: [
          "After sorting, the array is `[1, 2, 5, 9]`, and `5` is found at index `2`.",
          "`4` is not in the array, so `binarySearch` returns a negative number and the comparison prints `true`.",
          "`a == b` and `a.equals(b)` are `false` because they are different objects. `Arrays.equals(a, b)` is `true` because the elements match.",
          "`fill` sets every element to 7. `deepToString` prints nested arrays as `[[1, 2], [3]]`.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Calling `binarySearch` on an array that is not sorted.",
          fix: "Sort first. The result on unsorted data is undefined.",
        },
        {
          mistake: "Comparing arrays with `==` or `equals`.",
          fix: "Use `Arrays.equals` for one-dimensional arrays and `Arrays.deepEquals` for nested ones.",
        },
        {
          mistake: "Assuming every row of a 2D array has the same length.",
          fix: "Read `grid[r].length` for each row instead of using `grid[0].length` everywhere.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A seating chart",
      scenario:
        "A cinema stores seat availability in a grid of rows and seats, and needs to find the first row with two free seats side by side.",
      body: [
        "Store the seats as a `boolean[][]` where `true` means taken. Loop over each row, and in each row look at pairs of neighbouring seats with `c` and `c + 1`.",
        "Stop at `c < row.length - 1` so that `c + 1` never goes past the end of the row.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "row-lengths",
      prompt: "What is printed for the length of the second row?",
      code: {
        language: "java",
        code: "int[][] t = {{1, 2, 3}, {4, 5}};\nSystem.out.println(t[1].length);",
      },
      options: ["2", "3", "5"],
      answer: 0,
      explanation:
        "`t[1]` is the second row, `{4, 5}`, which has two elements.",
    },
    {
      type: "output",
      id: "arrays-equals-result",
      prompt: "What do the two comparisons print?",
      code: {
        language: "java",
        code: "int[] a = {1, 2};\nint[] b = {1, 2};\nSystem.out.println(a == b);\nSystem.out.println(java.util.Arrays.equals(a, b));",
      },
      options: ["false then true", "true then true", "false then false"],
      answer: 0,
      explanation:
        "They are two different objects, so `==` is false. `Arrays.equals` compares the elements and is true.",
    },
    {
      type: "single",
      id: "binary-search-requirement",
      prompt:
        "What must be true about an array before you call `Arrays.binarySearch` on it?",
      options: [
        "It must be sorted",
        "It must contain no duplicates",
        "It must be a 2D array",
      ],
      answer: 0,
      explanation:
        "Binary search halves the range using the order of the values, so the array must be sorted.",
    },
    {
      type: "blank",
      id: "nested-array-print",
      prompt: "To print a nested array readably, use Arrays.___(grid).",
      answer: "deepToString",
      explanation:
        "`Arrays.deepToString` prints inner arrays too. `Arrays.toString` would print their references.",
    },
  ],
  assignment: {
    title: "Matrix tools",
    task: [
      "Create a 3 by 3 `int[][]` with numbers of your choice.",
      "Print the matrix as a table, the sum of each row, the sum of the main diagonal, and the transposed matrix.",
    ],
    checklist: [
      "I used nested loops with `length` and not fixed numbers",
      "The transposed matrix swaps rows and columns correctly",
      "I checked the diagonal sum by hand",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "second-largest",
      title: "Second largest number",
      task: [
        "Write `static int secondLargest(int[] a)` that returns the second largest distinct value. You may assume the array has at least two different values. For `{4, 9, 9, 7}` the result is 7.",
      ],
      language: "java",
      starter:
        "public class Second {\n  static int secondLargest(int[] a) {\n    // your code\n    return 0;\n  }\n}",
      solution:
        "public class Second {\n  static int secondLargest(int[] a) {\n    int largest = Integer.MIN_VALUE;\n    int second = Integer.MIN_VALUE;\n    for (int n : a) {\n      if (n > largest) {\n        second = largest;\n        largest = n;\n      } else if (n > second && n < largest) {\n        second = n;\n      }\n    }\n    return second;\n  }\n}",
      hints: [
        "Track the largest and the second largest in one pass, and ignore a value equal to the largest.",
      ],
      checklist: [
        "`{4, 9, 9, 7}` returns 7, not 9",
        "Negative numbers work",
        "I made only one pass over the array",
      ],
    },
  ],
  revisionNotes: [
    "`grid[r][c]`, rows are `grid.length`, columns are `grid[r].length`",
    "Rows may have different lengths (jagged arrays)",
    "`Arrays.sort` first, then `binarySearch`",
    "Compare with `Arrays.equals`, print with `toString` or `deepToString`",
  ],
  resources: [
    {
      label: "The Java Tutorials: Arrays",
      url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html",
    },
    {
      label: "Java SE API: Arrays",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html",
    },
  ],
})
