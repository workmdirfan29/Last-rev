import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-8-plus", {
  slug: "lambdas-and-functional-interfaces",
  title: "Lambdas, functional interfaces and method references",
  topic: "Lambdas",
  minutes: 70,
  overview:
    "Write lambda expressions, use the standard functional interfaces, and replace simple lambdas with method references.",
  objectives: [
    "Write lambdas for functional interfaces, with typed and untyped parameters",
    "Use Function, Predicate, Consumer, Supplier and Comparator",
    "Use method references and explain effectively final variables",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "What a lambda is",
      body: [
        "A **lambda expression** is a short way to write an anonymous function. It has a parameter list, an arrow and a body: `(a, b) -> a + b`. The parameter types are normally inferred by the compiler, the parentheses can be left out for one parameter, and a body with one expression needs no braces or `return`.",
        "A lambda can be used wherever a **functional interface** is expected. That is an interface with exactly **one abstract method**, such as `Runnable`, `Comparator<T>` or `Predicate<T>`. The lambda provides the body of that one method. The interface can have default and static methods as well. The annotation `@FunctionalInterface` is optional, but it makes the compiler check the rule.",
        "Lambdas replaced most anonymous inner classes, and made it simple to pass behaviour as an argument.",
      ],
    },
    {
      kind: "code",
      heading: "The standard interfaces",
      example: {
        title: "Function, Predicate, Consumer, Supplier",
        language: "java",
        code: 'Function<String, Integer> length = String::length;\n    Predicate<String> isLong = s -> s.length() > 5;\n    Consumer<String> print = s -> System.out.println("> " + s);\n    Supplier<List<String>> fresh = ArrayList::new;\n    BinaryOperator<Integer> add = (a, b) -> a + b;\n\n    print.accept("size " + length.apply("lambda"));\n    System.out.println(isLong.and(s -> s.startsWith("l")).test("lambdas"));\n    System.out.println(fresh.get().size() + " " + add.apply(2, 3));',
        walkthrough: [
          "`Function<T, R>` maps a value to a result with `apply`. `Predicate<T>` gives a boolean with `test`.",
          "`Consumer<T>` uses a value and returns nothing. `Supplier<T>` gives a value and takes nothing.",
          '`and` combines two predicates, so `"lambdas"` is long and starts with `l`.',
          "The output is `> size 6`, `true` and `0 5`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Capturing variables and method references",
      body: [
        "A lambda can use local variables of the surrounding method, but they must be **final or effectively final**, which means they are never reassigned. The lambda uses a copy of the value, so allowing the original to change would give confusing results. Fields can be changed freely. Inside a lambda, `this` refers to the surrounding object, unlike in an anonymous class.",
        "A **method reference** is a shorthand for a lambda that only calls a method. There are four kinds: a static method (`Integer::parseInt`), a method of a given object (`System.out::println`), an instance method of an arbitrary object of a type (`String::toUpperCase`), and a constructor (`ArrayList::new`).",
        "Use a method reference when it is clearer than the lambda, and a lambda when the body does more than call one method.",
      ],
    },
    {
      kind: "code",
      heading: "Sorting with comparators",
      example: {
        title: "Lambda and method reference",
        language: "java",
        code: 'List<String> words = new ArrayList<>(List.of("pear", "fig", "banana", "kiwi"));\n    words.sort(Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()));\n    System.out.println(words);\n\n    int base = 10;\n    Function<Integer, Integer> addBase = n -> n + base;\n    System.out.println(addBase.apply(5));',
        walkthrough: [
          "`Comparator.comparing` takes a function that extracts the sort key, here `String::length`.",
          "`thenComparing` breaks ties alphabetically, so `fig` comes before `kiwi` and `pear`, which have the same length as each other.",
          "`base` is effectively final, because it is never changed, so the lambda may use it.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Changing a local variable inside a lambda.",
          fix: "Use an array or an `AtomicInteger`, or better, a stream operation that returns a result.",
        },
        {
          mistake: "Writing a long, multi-line lambda.",
          fix: "Move the body into a named method and use a method reference.",
        },
        {
          mistake:
            "Writing your own functional interface when a standard one fits.",
          fix: "Look in `java.util.function` first.",
        },
        {
          mistake: "Assuming that `this` in a lambda refers to the lambda.",
          fix: "It refers to the enclosing object.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A configurable filter",
      scenario:
        "A report lists orders and the user chooses what to show: paid orders, large orders, or both.",
      body: [
        "Pass the condition as a `Predicate<Order>`. The report method does not change: it applies `filter(condition)`. Conditions are built with `and`, `or` and `negate`.",
        "New filters are added by writing a new lambda, and nothing else changes.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "lam-param",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'Function<Integer, Integer> square = n -> n * n;\nSystem.out.println(square.apply(6) + " " + square.andThen(n -> n + 1).apply(3));',
      },
      options: ["36 10", "12 10", "36 9"],
      answer: 0,
      explanation:
        "`square.apply(6)` is `36`. `andThen` squares `3` and then adds `1`, giving `10`.",
    },
    {
      type: "single",
      id: "lam-functional",
      prompt: "What is a functional interface?",
      options: [
        "An interface with exactly one abstract method",
        "An interface with only static methods",
        "An interface for math functions",
      ],
      answer: 0,
      explanation:
        "A lambda or method reference implements that single abstract method.",
    },
    {
      type: "truefalse",
      id: "lam-capture",
      statement:
        "A lambda may change a local variable of the surrounding method.",
      answer: false,
      explanation:
        "Captured locals must be final or effectively final. Fields can be changed.",
    },
    {
      type: "multi",
      id: "lam-refs",
      prompt: "Which are kinds of method references?",
      options: [
        "Static method",
        "Constructor",
        "Instance method of an arbitrary object",
        "Private field",
      ],
      answers: [0, 1, 2],
      explanation:
        "A method reference refers to a method or a constructor, and not to a field.",
    },
  ],
  assignment: {
    title: "Replace anonymous classes",
    task: [
      "Take five anonymous inner classes for `Runnable` and `Comparator` and rewrite them as lambdas or method references.",
      "Write a method `filterList(List<T>, Predicate<T>)` and call it with three different conditions.",
    ],
    checklist: [
      "No anonymous class is left",
      "filterList is generic",
      "I used at least one method reference",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "lam-ex",
      title: "Apply a function to a list",
      task: [
        "Write a generic method `static <T, R> List<R> mapAll(List<T> items, Function<T, R> fn)` that returns a new list with `fn` applied to every item, using a loop. Test it with `String::length`.",
      ],
      language: "java",
      starter:
        "import java.util.*;\nimport java.util.function.*;\n\npublic class MapAll {\n  // your code\n}",
      solution:
        'import java.util.*;\nimport java.util.function.*;\n\npublic class MapAll {\n  static <T, R> List<R> mapAll(List<T> items, Function<T, R> fn) {\n    List<R> result = new ArrayList<>();\n    for (T item : items) {\n      result.add(fn.apply(item));\n    }\n    return result;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(mapAll(List.of("a", "bb", "ccc"), String::length));\n  }\n}',
      hints: ["Declare the two type parameters before the return type."],
      checklist: [
        "The method is generic in T and R",
        "The input list is not changed",
        "It works with a method reference",
      ],
    },
  ],
  revisionNotes: [
    "Lambda: `(params) -> body`, for an interface with one abstract method",
    "Function, Predicate, Consumer, Supplier, Comparator are the standard building blocks",
    "Captured locals must be effectively final",
    "Method references: static, bound, unbound, constructor",
  ],
  resources: [
    {
      label: "The Java Tutorials: Lambda Expressions",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html",
    },
    {
      label: "The Java Tutorials: Method References",
      url: "https://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html",
    },
    {
      label: "Java SE API: java.util.function",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/function/package-summary.html",
    },
  ],
})
