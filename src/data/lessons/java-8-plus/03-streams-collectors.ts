import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-8-plus", {
  slug: "streams-collectors",
  title: "Streams: collectors, flatMap and parallel streams",
  topic: "Streams",
  minutes: 55,
  overview:
    "Collect results with groupingBy, partitioningBy and toMap, flatten nested data, and decide when a parallel stream is safe.",
  objectives: [
    "Group, partition and join elements with Collectors",
    "Use flatMap to flatten nested collections",
    "Explain the conditions for using parallel streams",
  ],
  prerequisites: ["lesson.java-8-plus.streams-pipelines"],
  sections: [
    {
      kind: "explain",
      heading: "Collectors",
      body: [
        '`collect(Collector)` is a terminal operation that gathers the elements into a result. `Collectors.toList()`, `toSet()` and the shorter `stream.toList()` build collections. `Collectors.joining(", ")` joins strings. `Collectors.groupingBy(classifier)` builds a `Map` from a key to a list of elements, like `GROUP BY`, and a **downstream collector** such as `counting()`, `summingInt` or `mapping` summarises each group.',
        "`partitioningBy(predicate)` splits the elements into two groups, `true` and `false`. `toMap(keyFn, valueFn)` builds a map, and it throws `IllegalStateException` if two elements give the same key, unless you pass a merge function as a third argument.",
        "`groupingBy` returns a `HashMap` by default, so the group order is not guaranteed. Pass a map factory such as `TreeMap::new` if you need an order.",
      ],
    },
    {
      kind: "code",
      heading: "Group and count",
      example: {
        title: "groupingBy and partitioningBy",
        language: "java",
        code: 'record Emp(String name, String dept, int salary) {}\n    List<Emp> emps = List.of(new Emp("Asha", "IT", 90), new Emp("Ravi", "IT", 70), new Emp("Meera", "HR", 60), new Emp("Karan", "HR", 80));\n\n    Map<String, Long> perDept = emps.stream()\n        .collect(Collectors.groupingBy(Emp::dept, TreeMap::new, Collectors.counting()));\n    System.out.println(perDept);\n    Map<String, Integer> total = emps.stream()\n        .collect(Collectors.groupingBy(Emp::dept, TreeMap::new, Collectors.summingInt(Emp::salary)));\n    System.out.println(total);\n    Map<Boolean, List<String>> split = emps.stream()\n        .collect(Collectors.partitioningBy(e -> e.salary() >= 80, Collectors.mapping(Emp::name, Collectors.toList())));\n    System.out.println(split);',
        walkthrough: [
          "`groupingBy` with `counting()` gives the number of employees per department, here sorted by a `TreeMap`.",
          "`summingInt` adds the salaries of each group.",
          "`partitioningBy` splits the names into those with a salary of at least 80 and the others.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "flatMap",
      body: [
        "`map` turns each element into exactly one new element. `flatMap` turns each element into a **stream** and then flattens all those streams into one. Use it when each element has several items, such as an order with many lines, or a sentence with many words.",
        '`orders.stream().flatMap(o -> o.lines().stream())` gives one stream of all the lines of all orders. Using `map` there would give a stream of lists. `Arrays.stream(text.split(" "))` makes a stream of words from a string, which is a typical thing to flatten.',
        "`mapMulti`, added in Java 16, is an alternative when a mapping produces few or no elements.",
      ],
    },
    {
      kind: "code",
      heading: "Flatten words",
      example: {
        title: "flatMap",
        language: "java",
        code: 'List<String> lines = List.of("to be or", "not to be");\n    List<String> words = lines.stream()\n        .flatMap(line -> Arrays.stream(line.split(" ")))\n        .toList();\n    System.out.println(words);\n    System.out.println(words.stream().distinct().count());',
        walkthrough: [
          "Each line becomes a stream of words, and `flatMap` joins the streams into one.",
          "`distinct().count()` counts the different words: `to`, `be`, `or` and `not`.",
          "The output is `[to, be, or, not, to, be]` and `4`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Parallel streams",
      body: [
        "`parallelStream()` or `stream().parallel()` splits the work over several threads from the common `ForkJoinPool`. It can speed up **CPU-heavy** work on **large** data, but it has an overhead, and it is often slower for small data or cheap operations. The operations must be **stateless** and free of side effects, and the functions used in `reduce` must be **associative**.",
        "Never change a shared non-thread-safe collection from a parallel stream, for example by adding to an `ArrayList` in `forEach`. Use a collector, which combines partial results safely. Blocking I/O in a parallel stream can starve the common pool.",
        "Measure with realistic data before and after. A sequential stream is the right default.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using `toMap` where keys can repeat.",
          fix: "Give a merge function: `toMap(k, v, (a, b) -> a)`.",
        },
        {
          mistake: "Assuming that `groupingBy` keeps the order of groups.",
          fix: "Pass a `TreeMap` or `LinkedHashMap` factory.",
        },
        {
          mistake: "Using `map` when each element has a list.",
          fix: "Use `flatMap` to get a flat stream.",
        },
        {
          mistake: "Using a parallel stream with side effects on shared state.",
          fix: "Use collectors, or stay sequential.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A sales report",
      scenario:
        "A manager wants the total sales per region, sorted by region, and the best employee in each region.",
      body: [
        "Group by region with a `TreeMap`, using `summingInt` for the totals. For the best employee, group again with `maxBy(comparingInt(Emp::sales))`. Each query is one pipeline.",
        "The same data is read twice, which is fine for a report, and keeps each pipeline simple.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "col-join",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'System.out.println(Stream.of("x", "y", "z").collect(Collectors.joining("-", "[", "]")));',
      },
      options: ["[x-y-z]", "x-y-z", "[xyz]"],
      answer: 0,
      explanation: "`joining` takes a delimiter, a prefix and a suffix.",
    },
    {
      type: "single",
      id: "col-flatmap",
      prompt: "When do you use `flatMap` instead of `map`?",
      options: [
        "When each element gives a stream or collection to flatten",
        "When you need to sort",
        "When you need a primitive stream",
      ],
      answer: 0,
      explanation:
        "`flatMap` merges the streams produced by each element into one stream.",
    },
    {
      type: "truefalse",
      id: "col-tomap",
      statement:
        "`Collectors.toMap` silently keeps the first value when two keys are equal.",
      answer: false,
      explanation:
        "It throws `IllegalStateException` unless a merge function is given.",
    },
    {
      type: "single",
      id: "col-parallel",
      prompt: "Which is a safe use of a parallel stream?",
      options: [
        "A CPU-heavy, stateless calculation on a large list",
        "Adding results to a shared ArrayList in forEach",
        "A tiny list with a trivial operation",
      ],
      answer: 0,
      explanation:
        "Parallel streams need stateless operations, and pay off only for enough work.",
    },
  ],
  assignment: {
    title: "Report with collectors",
    task: [
      "Create a list of at least 12 employees with a department, a city and a salary.",
      "Produce: the average salary per department, the highest paid per city, the names grouped by department in a `TreeMap`, and the set of cities, each with one collector pipeline.",
    ],
    checklist: [
      "No explicit loops are used",
      "Groups are sorted where order matters",
      "I checked one result by hand",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "col-ex",
      title: "Count the words",
      task: [
        "Write `static Map<String, Long> wordCount(List<String> lines)` that splits every line on spaces, and returns the number of times each word appears, using `flatMap` and `groupingBy`.",
      ],
      language: "java",
      starter:
        "import java.util.*;\nimport java.util.stream.*;\n\npublic class WordCount {\n  // your code\n}",
      solution:
        'import java.util.*;\nimport java.util.stream.*;\n\npublic class WordCount {\n  static Map<String, Long> wordCount(List<String> lines) {\n    return lines.stream()\n        .flatMap(line -> Arrays.stream(line.split(" ")))\n        .collect(Collectors.groupingBy(w -> w, TreeMap::new, Collectors.counting()));\n  }\n\n  public static void main(String[] args) {\n    System.out.println(wordCount(List.of("a b a", "b c")));\n  }\n}',
      hints: [
        "Use `groupingBy` with the word itself as the key and `counting()` as the downstream collector.",
      ],
      checklist: [
        "The words are counted across all lines",
        "The result is sorted by word",
        "No loop is used",
      ],
    },
  ],
  revisionNotes: [
    "`collect` with groupingBy, partitioningBy, joining, toMap (merge function for duplicate keys)",
    "flatMap flattens streams of streams",
    "Group order is not guaranteed unless you pass a sorted map factory",
    "Parallel streams: large, CPU-heavy, stateless work only; measure first",
  ],
  resources: [
    {
      label: "The Java Tutorials: Reduction",
      url: "https://docs.oracle.com/javase/tutorial/collections/streams/reduction.html",
    },
    {
      label: "The Java Tutorials: Parallelism",
      url: "https://docs.oracle.com/javase/tutorial/collections/streams/parallelism.html",
    },
    {
      label: "Java SE API: Collectors",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html",
    },
  ],
})
