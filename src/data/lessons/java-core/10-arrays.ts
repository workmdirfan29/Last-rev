import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-core", {
  slug: "arrays",
  title: "Arrays: storing many values",
  topic: "Arrays",
  minutes: 55,
  overview:
    "Create arrays, read and change elements, loop over them, and understand default values, fixed size and the difference between copying a reference and copying the data.",
  objectives: [
    "Declare, create and initialise arrays of primitives and objects",
    "Explain default values and `ArrayIndexOutOfBoundsException`",
    "Copy an array correctly and tell a shallow copy from a deep copy",
  ],
  prerequisites: ["lesson.java-core.loops"],
  sections: [
    {
      kind: "explain",
      heading: "What an array is",
      body: [
        "An **array** is a fixed-size row of values of one type. Each value sits at an **index**, and indexes start at 0, so an array of five items has indexes 0 to 4.",
        "The size is set when you create the array and can never change. The size is stored in the field `length`, written without parentheses: `scores.length`. Strings use `length()`, arrays use `length`.",
        "A new array is filled with default values: `0` for numbers, `false` for `boolean`, and `null` for object types such as `String`.",
      ],
    },
    {
      kind: "code",
      heading: "Creating and using arrays",
      example: {
        title: "Three ways to make an array",
        language: "java",
        code: 'int[] scores = new int[3];\nscores[0] = 90;\nSystem.out.println(scores.length);\nSystem.out.println(scores[1]);\n\nString[] names = {"Asha", "Ravi", "Meera"};\nSystem.out.println(names[2]);\n\nint[] primes = new int[]{2, 3, 5, 7};\nint total = 0;\nfor (int p : primes) {\n  total += p;\n}\nSystem.out.println(total);\n\nString[] empty = new String[2];\nSystem.out.println(empty[0]);',
        walkthrough: [
          "`new int[3]` creates three ints, all `0`. `scores.length` is `3`, and `scores[1]` prints `0`.",
          '`{"Asha", "Ravi", "Meera"}` is a shortcut that creates the array and fills it in one step.',
          "A for-each loop reads each prime. The total is `17`.",
          "A `String` array starts with `null` elements, so `empty[0]` prints `null`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Out of bounds and references",
      body: [
        "Reading or writing an index below 0 or at `length` or above throws `ArrayIndexOutOfBoundsException`. The last valid index is always `length - 1`.",
        "An array variable holds a **reference** to the array, not the data itself. Writing `int[] b = a;` makes both names point to the **same** array. A change through `b` is visible through `a`.",
        "To get an independent copy, use `Arrays.copyOf`, `Arrays.copyOfRange`, `System.arraycopy` or `clone()`. These copy the elements, but for an array of objects only the references are copied, so the objects themselves are still shared. That is a **shallow copy**.",
      ],
    },
    {
      kind: "code",
      heading: "Alias or copy?",
      example: {
        title: "Assignment versus copyOf",
        language: "java",
        code: "import java.util.Arrays;\n\nint[] a = {1, 2, 3};\nint[] alias = a;\nint[] copy = Arrays.copyOf(a, a.length);\n\na[0] = 99;\nSystem.out.println(alias[0]);\nSystem.out.println(copy[0]);\nSystem.out.println(Arrays.toString(a));\nSystem.out.println(Arrays.toString(Arrays.copyOfRange(a, 1, 3)));",
        walkthrough: [
          "`alias` points to the same array, so after `a[0] = 99` it also shows `99`.",
          "`copy` is a separate array and still shows `1`.",
          "Printing an array directly shows a code like `[I@1b6d3586`. `Arrays.toString` prints the elements: `[99, 2, 3]`.",
          "`copyOfRange(a, 1, 3)` copies indexes 1 and 2. The end index is excluded, so the result is `[2, 3]`.",
        ],
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          mistake: "Writing `i <= arr.length` in a loop.",
          fix: "Use `i < arr.length`. The last valid index is `length - 1`.",
        },
        {
          mistake: "Writing `arr.length()` or `list.length`.",
          fix: "Arrays use the field `arr.length`. Strings and lists use methods, `s.length()` and `list.size()`.",
        },
        {
          mistake: "Thinking `b = a` copies an array.",
          fix: "It copies the reference. Use `Arrays.copyOf(a, a.length)` for a separate array.",
        },
        {
          mistake: "Printing an array with `System.out.println(arr)`.",
          fix: "Use `Arrays.toString(arr)`, or `Arrays.deepToString` for nested arrays.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Weekly sales",
      scenario:
        "A shop records its sales for each day of the week and wants the total, the best day and the average.",
      body: [
        "Store the seven numbers in a `double[]`. Loop once to add them for the total and to track the largest. The average is the total divided by `sales.length`.",
        "Because the size is fixed, an array suits data whose count is known, like seven days. If the number of items changes, an `ArrayList` is the better choice.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "alias-change",
      prompt: "What is printed after the change through b?",
      code: {
        language: "java",
        code: "int[] a = {1, 2, 3};\nint[] b = a;\nb[0] = 9;\nSystem.out.println(a[0]);",
      },
      options: ["9", "1", "An exception is thrown"],
      answer: 0,
      explanation:
        "`b` and `a` refer to the same array, so a change through one is visible through the other.",
    },
    {
      type: "output",
      id: "default-string-element",
      prompt: "What is printed for a new String array element?",
      code: {
        language: "java",
        code: "String[] s = new String[2];\nSystem.out.println(s[1]);",
      },
      options: ["null", "An empty line", "0"],
      answer: 0,
      explanation: "Elements of an object array start as `null`.",
    },
    {
      type: "single",
      id: "array-length-syntax",
      prompt: "How do you get the number of elements in an array named `arr`?",
      options: ["arr.length", "arr.length()", "arr.size()"],
      answer: 0,
      explanation:
        "`length` is a field of an array. `length()` belongs to strings and `size()` to lists.",
    },
    {
      type: "truefalse",
      id: "array-resize",
      statement:
        "You can add more elements to an array after you have created it.",
      answer: false,
      explanation:
        "The size of an array is fixed. To grow it you create a new, larger array and copy the elements, or use an `ArrayList`.",
    },
  ],
  assignment: {
    title: "Marks analysis",
    task: [
      "Store the marks of six students in an `int[]`.",
      "Print the highest mark, the lowest mark, the average, and how many students scored above the average.",
    ],
    checklist: [
      "I used one loop for the total and the highest and lowest values",
      "The average is a decimal, not a truncated number",
      "I printed the array with Arrays.toString",
    ],
    hints: ["Start the highest and lowest values with the first element."],
    minutes: 25,
  },
  exercises: [
    {
      slug: "reverse-an-array",
      title: "Reverse in place",
      task: [
        "Write `static void reverse(int[] a)` that reverses the array in place without creating a second array. `{1, 2, 3, 4}` becomes `{4, 3, 2, 1}`.",
      ],
      language: "java",
      starter:
        "public class Rev {\n  static void reverse(int[] a) {\n    // your code\n  }\n}",
      solution:
        "public class Rev {\n  static void reverse(int[] a) {\n    int left = 0;\n    int right = a.length - 1;\n    while (left < right) {\n      int temp = a[left];\n      a[left] = a[right];\n      a[right] = temp;\n      left++;\n      right--;\n    }\n  }\n}",
      hints: [
        "Swap the first and last elements, then move towards the middle.",
      ],
      checklist: [
        "It works for an odd and an even number of elements",
        "An empty array and a one-element array do not throw an exception",
        "I did not create a second array",
      ],
    },
  ],
  revisionNotes: [
    "Fixed size, indexes from 0, last index is `length - 1`",
    "`arr.length` is a field, `s.length()` and `list.size()` are methods",
    "`b = a` copies the reference, `Arrays.copyOf` copies the data",
    "Use `Arrays.toString` to print an array",
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
