import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-8-plus", {
  slug: "streams-pipelines",
  title: "Streams: building pipelines",
  topic: "Streams",
  minutes: 55,
  overview:
    "Process collections with stream pipelines: sources, intermediate operations, terminal operations and lazy evaluation.",
  objectives: [
    "Create a stream and build a pipeline with filter, map and sorted",
    "Distinguish intermediate from terminal operations and explain laziness",
    "Use primitive streams and reduction",
  ],
  prerequisites: ["lesson.java-8-plus.lambdas-and-functional-interfaces"],
  sections: [
    {
      kind: "explain",
      heading: "What a stream is",
      body: [
        "A **stream** is a sequence of elements that supports a pipeline of operations. It is not a collection: it does not store elements, it carries them from a **source**, such as a list, an array or `Stream.of(...)`, through the operations. A stream does not change its source, and it can be used **only once**.",
        "A pipeline has three parts: a source, zero or more **intermediate operations** that return another stream, such as `filter`, `map`, `sorted`, `distinct` and `limit`, and one **terminal operation** that produces a result or a side effect, such as `collect`, `forEach`, `count`, `reduce`, `findFirst` or `anyMatch`.",
        "Streams are **lazy**: intermediate operations do nothing until a terminal operation is called. Then each element goes through the whole pipeline one by one, and short-circuiting operations such as `findFirst` and `limit` can stop early.",
      ],
    },
    {
      kind: "code",
      heading: "A pipeline",
      example: {
        title: "filter, map, sorted, collect",
        language: "java",
        code: 'record Person(String name, int age) {}\n    List<Person> people = List.of(new Person("Asha", 31), new Person("Ravi", 17), new Person("Meera", 25), new Person("Karan", 40));\n\n    List<String> adults = people.stream()\n        .filter(p -> p.age() >= 18)\n        .sorted(Comparator.comparingInt(Person::age))\n        .map(Person::name)\n        .toList();\n    System.out.println(adults);\n    System.out.println(people.stream().mapToInt(Person::age).sum());',
        walkthrough: [
          "`filter` keeps the adults, `sorted` orders them by age, and `map` takes the names.",
          "`toList()` is the terminal operation. Nothing runs before it.",
          "`mapToInt` gives an `IntStream`, which has `sum()`. The ages add up to `113`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Laziness, primitives and reduction",
      body: [
        "Because of laziness, an operation with a side effect, such as a `peek` that prints, shows nothing without a terminal call, and with a short-circuiting operation it may not see all elements. Do not rely on side effects inside intermediate operations.",
        "`IntStream`, `LongStream` and `DoubleStream` avoid boxing and have extra methods such as `sum`, `average`, `max` and `range`. `IntStream.rangeClosed(1, 5)` gives the numbers 1 to 5. `reduce(identity, accumulator)` combines all elements into one value: `reduce(0, Integer::sum)`.",
        "`findFirst`, `findAny`, `anyMatch`, `allMatch` and `noneMatch` give an `Optional` or a boolean and stop as early as they can.",
      ],
    },
    {
      kind: "code",
      heading: "Laziness",
      example: {
        title: "Nothing runs without a terminal operation",
        language: "java",
        code: 'Stream<Integer> s = Stream.of(1, 2, 3, 4)\n        .peek(n -> System.out.println("look " + n))\n        .filter(n -> n % 2 == 0);\n    System.out.println("built");\n    System.out.println(s.findFirst().get());',
        walkthrough: [
          "Building the pipeline prints nothing from `peek`, so `built` comes first.",
          "`findFirst` starts the work and stops after the first match, `2`, so `peek` runs only for `1` and `2`.",
          "The output is `built`, `look 1`, `look 2`, `2`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Reusing a stream after a terminal operation.",
          fix: "A stream can be used once. Create a new one from the source.",
        },
        {
          mistake: "Changing the source collection while streaming it.",
          fix: "Do not change the source. Collect the result into a new collection.",
        },
        {
          mistake: "Using `peek` or `map` for side effects.",
          fix: "Use `forEach` at the end, or collect the data and act on it afterwards.",
        },
        {
          mistake: "Using a stream for a simple loop with a break.",
          fix: "A plain `for` loop can be clearer. Use streams when the pipeline reads better.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A report from orders",
      scenario:
        "A report needs the total of paid orders over a limit, sorted by customer.",
      body: [
        "Filter the paid orders, filter by total, sort by customer, map to a line of text and collect. Each step is a single, named idea, so the pipeline reads like the description.",
        "For the total, `mapToDouble(Order::total).sum()` gives the result without boxing.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "str-lazy",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'Stream.of("a", "b", "c")\n    .filter(s -> { System.out.print("f" + s + " "); return true; })\n    .map(s -> { System.out.print("m" + s + " "); return s; })\n    .findFirst();',
      },
      options: ["fa ma", "fa fb fc ma mb mc", "ma fa"],
      answer: 0,
      explanation:
        "Each element goes through the whole pipeline in turn, and `findFirst` stops after the first one.",
    },
    {
      type: "single",
      id: "str-terminal",
      prompt: "Which of these is a terminal operation?",
      options: ["count()", "filter()", "map()"],
      answer: 0,
      explanation:
        "`filter` and `map` return a stream. `count` produces a result.",
    },
    {
      type: "truefalse",
      id: "str-reuse",
      statement: "A stream can be reused after a terminal operation.",
      answer: false,
      explanation: "Using it again throws `IllegalStateException`.",
    },
    {
      type: "blank",
      id: "str-prim",
      prompt:
        "To add up the ages without boxing, use `mapTo___(Person::age).sum()`.",
      answer: "Int",
      explanation: "`mapToInt` gives an `IntStream`, which has `sum()`.",
    },
  ],
  assignment: {
    title: "Rewrite loops as pipelines",
    task: [
      "Take four loops that filter, transform, sum and find a first match, and rewrite each as a stream pipeline.",
      "Add a `peek` to one of them to show the order in which elements flow, and explain it.",
    ],
    checklist: [
      "The pipelines give the same results as the loops",
      "I explained laziness using the peek output",
      "No stream was reused",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "str-ex",
      title: "Sum of even squares",
      task: [
        "Write `static int sumOfEvenSquares(List<Integer> numbers)` using a stream: keep the even numbers, square them and add them up.",
      ],
      language: "java",
      starter:
        "import java.util.*;\n\npublic class Squares {\n  // your code\n}",
      solution:
        "import java.util.*;\n\npublic class Squares {\n  static int sumOfEvenSquares(List<Integer> numbers) {\n    return numbers.stream()\n        .filter(n -> n % 2 == 0)\n        .mapToInt(n -> n * n)\n        .sum();\n  }\n\n  public static void main(String[] args) {\n    System.out.println(sumOfEvenSquares(List.of(1, 2, 3, 4)));\n  }\n}",
      hints: ["Use `filter`, then `mapToInt`, then `sum`."],
      checklist: [
        "The result for 1, 2, 3, 4 is 20",
        "An empty list gives 0",
        "No loop is used",
      ],
    },
  ],
  revisionNotes: [
    "Stream = source → intermediate operations → terminal operation",
    "Lazy: nothing runs until the terminal call; short-circuiting stops early",
    "A stream is single-use and does not change its source",
    "IntStream/LongStream/DoubleStream avoid boxing",
  ],
  resources: [
    {
      label: "The Java Tutorials: Aggregate Operations",
      url: "https://docs.oracle.com/javase/tutorial/collections/streams/index.html",
    },
    {
      label: "The Java Tutorials: Reduction",
      url: "https://docs.oracle.com/javase/tutorial/collections/streams/reduction.html",
    },
    {
      label: "Java SE API: java.util.stream",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html",
    },
  ],
})
