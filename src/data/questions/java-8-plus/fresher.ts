import { defineQuestions } from "../author"
import { g } from "../brief"

const T = "https://docs.oracle.com/javase/tutorial"
const API = "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java"
const LANG = "https://docs.oracle.com/en/java/javase/21/language"

export default defineQuestions("java-8-plus", "fresher", [
  g({
    slug: "lambda-expressions",
    topic: "Lambdas",
    d: "easy",
    title: "What is a lambda expression and what is its syntax?",
    kw: [
      "lambda",
      "functional interface",
      "arrow",
      "anonymous function",
      "Java 8",
    ],
    intent: "Checks that you can read and write the basic lambda forms.",
    short:
      "A lambda expression is a short way to write an anonymous function that implements a functional interface, an interface with one abstract method. Its syntax is a parameter list, an arrow and a body: `(a, b) -> a + b`. Parameter types can usually be left out because the compiler infers them from the target interface, the parentheses can be dropped for a single parameter, and a body with one expression needs no braces or `return`. A longer body uses braces and an explicit `return`.",
    detail: [
      "A lambda can be assigned to a variable, passed as an argument or returned from a method.",
      "Its type is the functional interface that the context expects.",
      "Lambdas replaced many anonymous inner classes with much shorter code.",
    ],
    ex: "`names.sort((a, b) -> a.length() - b.length())` sorts a list by length with a lambda `Comparator`.",
    code: [
      "Forms of a lambda",
      'Runnable r = () -> System.out.println("run");\nFunction<Integer, Integer> square = n -> n * n;\nBinaryOperator<Integer> add = (a, b) -> a + b;\nComparator<String> byLength = (a, b) -> {\n  return Integer.compare(a.length(), b.length());\n};\nSystem.out.println(square.apply(5) + " " + add.apply(2, 3));',
      [
        "No parameters need empty parentheses.",
        "A single parameter needs none, and an expression body needs no `return`.",
        "A block body uses braces and `return`.",
        "The output is `25 5`.",
      ],
      "java",
    ],
    mistakes: [
      "Trying to use a lambda where the target type is not a functional interface.",
      "Writing long, multi-line lambdas that are better as named methods.",
    ],
    follow: ["What is a functional interface?"],
    points: [
      "Implements a functional interface",
      "(params) -> body",
      "Types are inferred",
    ],
    notes:
      "Lambda = `(params) -> expression-or-block` for a functional interface.",
    src: [
      [
        "The Java Tutorials: Lambda Expressions",
        `${T}/java/javaOO/lambdaexpressions.html`,
      ],
      [
        "Java SE API: java.util.function",
        `${API}/util/function/package-summary.html`,
      ],
    ],
  }),
  g({
    slug: "built-in-functional-interfaces",
    topic: "Lambdas",
    d: "easy",
    title:
      "Which functional interfaces in `java.util.function` do you use most?",
    kw: ["Function", "Predicate", "Consumer", "Supplier", "UnaryOperator"],
    intent: "Checks that you know the standard building blocks of lambda code.",
    short:
      "`Function<T, R>` takes a value and returns a result with `apply`. `Predicate<T>` takes a value and returns a boolean with `test`. `Consumer<T>` takes a value and returns nothing with `accept`. `Supplier<T>` takes nothing and returns a value with `get`. `UnaryOperator<T>` is a `Function<T, T>`, and `BinaryOperator<T>` takes two values of one type and returns one of the same type. There are also `Bi` versions with two inputs, and primitive versions such as `IntPredicate` that avoid boxing.",
    detail: [
      "`Predicate` has default methods `and`, `or` and `negate`, and `Function` has `andThen` and `compose`.",
      "`Runnable` and `Callable` are older functional interfaces from other packages.",
      "Use the primitive versions in hot code to avoid boxing and unboxing.",
    ],
    ex: "`list.removeIf(s -> s.isBlank())` uses a `Predicate`, and `map.computeIfAbsent(k, key -> new ArrayList<>())` uses a `Function`.",
    code: [
      "The four basic interfaces",
      'Function<String, Integer> length = String::length;\nPredicate<String> isLong = s -> s.length() > 5;\nConsumer<String> print = System.out::println;\nSupplier<List<String>> fresh = ArrayList::new;\n\nprint.accept("size " + length.apply("lambda"));\nSystem.out.println(isLong.and(s -> s.startsWith("l")).test("lambdas"));',
      [
        "`Function` maps a string to its length.",
        "`Predicate` tests a condition, and `and` combines two tests.",
        "`Consumer` uses a value, and `Supplier` creates one.",
      ],
      "java",
    ],
    mistakes: [
      "Writing your own interface when a standard one already fits.",
      "Using `Function<Integer, Integer>` in hot loops instead of `IntUnaryOperator`.",
    ],
    follow: ["How do you combine two predicates?"],
    points: [
      "Function: T → R",
      "Predicate: T → boolean",
      "Consumer: T → void, Supplier: () → T",
    ],
    notes:
      "Function (apply), Predicate (test), Consumer (accept), Supplier (get).",
    src: [
      [
        "Java SE API: java.util.function",
        `${API}/util/function/package-summary.html`,
      ],
      [
        "The Java Tutorials: Lambda Expressions (standard functional interfaces)",
        `${T}/java/javaOO/lambdaexpressions.html`,
      ],
    ],
  }),
  g({
    slug: "method-references",
    topic: "Lambdas",
    d: "medium",
    title: "What are method references and what kinds are there?",
    kw: [
      "method reference",
      "::",
      "static method",
      "constructor reference",
      "bound receiver",
    ],
    intent:
      "Checks that you can replace simple lambdas with method references.",
    short:
      "A method reference is a shorthand for a lambda that only calls an existing method, written with `::`. There are four kinds. A static method: `Integer::parseInt`. A method of a particular object: `System.out::println`. An instance method of an arbitrary object of a given type, where the first lambda argument becomes the receiver: `String::toUpperCase`. A constructor: `ArrayList::new`. They make code shorter and often clearer, when the lambda adds nothing but a call.",
    detail: [
      "`s -> s.toUpperCase()` and `String::toUpperCase` mean the same.",
      "If the lambda does more than one call, keep the lambda.",
      "The compiler matches the method's parameters to the functional interface's method.",
    ],
    ex: "`names.stream().map(String::trim).forEach(System.out::println)` uses two method references.",
    code: [
      "The four kinds",
      'Function<String, Integer> a = Integer::parseInt;            // static\nConsumer<String> b = System.out::println;                  // bound object\nFunction<String, String> c = String::toUpperCase;          // unbound instance\nSupplier<List<String>> d = ArrayList::new;                  // constructor\n\nSystem.out.println(c.apply("java"));',
      [
        "Each line shows one kind of method reference.",
        "In the third, the string argument is the receiver of `toUpperCase`.",
        "The output is `JAVA`.",
      ],
      "java",
    ],
    mistakes: [
      "Using a method reference when the overloaded method is ambiguous.",
      "Forcing a method reference where a clear lambda would be easier to read.",
    ],
    follow: [
      "What is the difference between System.out::println and String::length?",
    ],
    points: [
      "Static, bound, unbound, constructor",
      "Shorthand for a lambda that only calls a method",
      "Use only when clearer",
    ],
    notes:
      "`Class::staticMethod`, `obj::method`, `Class::instanceMethod`, `Class::new`.",
    src: [
      [
        "The Java Tutorials: Method References",
        `${T}/java/javaOO/methodreferences.html`,
      ],
      [
        "The Java Tutorials: Lambda Expressions",
        `${T}/java/javaOO/lambdaexpressions.html`,
      ],
    ],
  }),
  g({
    slug: "lambda-captured-variables",
    topic: "Lambdas",
    d: "medium",
    title:
      "Why must local variables used in a lambda be final or effectively final?",
    kw: ["effectively final", "capture", "closure", "lambda", "local variable"],
    intent: "Checks that you understand a common compile error.",
    short:
      "A lambda can use local variables of the enclosing method, but they must be `final` or effectively final, which means they are never reassigned after their first assignment. A lambda may run later or on another thread, after the method has returned, so it works with a copy of the value, and allowing the original variable to change would give confusing and unsafe results. Instance fields and static fields are different: a lambda can read and change them, because they live in the object, not on the stack.",
    detail: [
      "To accumulate a value, use a field, an array of one element, or an `AtomicInteger`, or better, use a stream reduction.",
      "The same rule applies to local and anonymous classes.",
      "Inside a lambda, `this` means the enclosing object, unlike in an anonymous class.",
    ],
    ex: "A loop variable cannot be used in a lambda, but a copy such as `final int id = i;` can.",
    code: [
      "The compile error and the fix",
      "int count = 0;\n// list.forEach(x -> count++);   // does not compile\n\nAtomicInteger counter = new AtomicInteger();\nlist.forEach(x -> counter.incrementAndGet());\n\nlong total = list.stream().count();",
      [
        "`count` is changed, so it is not effectively final.",
        "An `AtomicInteger` reference never changes, so it can be captured.",
        "A stream operation like `count()` avoids the problem completely.",
      ],
      "java",
    ],
    mistakes: [
      "Trying to change a local variable inside `forEach`.",
      "Working around the rule with shared mutable state in parallel code.",
    ],
    follow: ["What does this mean inside a lambda?"],
    points: [
      "Captured locals are effectively final",
      "Fields can be changed",
      "Prefer reductions over mutation",
    ],
    notes:
      "Lambdas capture local variables by value, so they must be effectively final.",
    src: [
      [
        "The Java Tutorials: Accessing Members of an Enclosing Class (lambdas)",
        `${T}/java/javaOO/lambdaexpressions.html`,
      ],
      [
        "Java Language Specification: Lambda Bodies",
        "https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.27.2",
      ],
    ],
  }),
  g({
    slug: "lambda-vs-anonymous-class",
    topic: "Lambdas",
    d: "medium",
    title:
      "What is the difference between a lambda and an anonymous inner class?",
    kw: [
      "lambda",
      "anonymous class",
      "this",
      "functional interface",
      "readability",
    ],
    intent:
      "Checks that you know they are not just two spellings of the same thing.",
    short:
      "An anonymous class can implement any interface or extend a class, with several methods and its own fields, and it creates a new object type. A lambda can only implement a functional interface, which has a single abstract method, and it is much shorter. The meaning of `this` differs: inside an anonymous class it refers to the anonymous object, and inside a lambda it refers to the enclosing object. A lambda also has no name or state of its own, and it is not a separate scope for variables, so it cannot shadow a local variable.",
    detail: [
      "Use an anonymous class when you need more than one method or state.",
      "Both can capture effectively final local variables.",
      "Lambdas are compiled differently from inner classes, and no extra `.class` file is generated for each lambda.",
    ],
    ex: "A `Runnable` that only prints is a lambda, while a listener with three callbacks and a counter is a class.",
    mistakes: [
      "Assuming that `this` has the same meaning in both.",
      "Using a lambda for an interface that has several abstract methods.",
    ],
    follow: ["What does this refer to in each case?"],
    points: [
      "Lambda: functional interface only",
      "this: enclosing object vs anonymous object",
      "Anonymous class: more flexible, more verbose",
    ],
    notes:
      "Lambda: one method, `this` = outer object. Anonymous class: any type, `this` = itself.",
    src: [
      [
        "The Java Tutorials: Anonymous Classes",
        `${T}/java/javaOO/anonymousclasses.html`,
      ],
      [
        "The Java Tutorials: Lambda Expressions",
        `${T}/java/javaOO/lambdaexpressions.html`,
      ],
    ],
  }),
  g({
    slug: "what-is-a-stream",
    topic: "Streams",
    d: "easy",
    title:
      "What is the Stream API and how is a stream different from a collection?",
    kw: ["Stream", "pipeline", "lazy", "collection", "functional"],
    intent:
      "Checks that you understand streams as a pipeline and not as storage.",
    short:
      "A stream is a sequence of elements that supports a pipeline of operations, such as filter, map and collect, written in a declarative style. Unlike a collection, a stream does not store elements, it only carries them from a source through the operations. It does not modify its source, it is lazy, so intermediate operations do nothing until a terminal operation is called, and it can be consumed only once. Streams make data processing code shorter and easier to read than manual loops.",
    detail: [
      "A pipeline has a source, zero or more intermediate operations and one terminal operation.",
      "A stream used a second time throws `IllegalStateException`.",
      "Streams can be sequential or parallel.",
    ],
    ex: "To get the names of adults, filter the people by age, map each to its name and collect the result into a list.",
    code: [
      "A basic pipeline",
      "List<String> names = people.stream()\n    .filter(p -> p.age() >= 18)\n    .map(Person::name)\n    .sorted()\n    .toList();",
      [
        "`people.stream()` is the source.",
        "`filter`, `map` and `sorted` are intermediate operations.",
        "`toList()` is the terminal operation that starts the work.",
      ],
      "java",
    ],
    mistakes: [
      "Trying to reuse a stream after a terminal operation.",
      "Expecting a stream to hold or change the original collection.",
    ],
    follow: [
      "What is the difference between intermediate and terminal operations?",
    ],
    points: [
      "Pipeline: source → intermediate → terminal",
      "Does not store data",
      "Single use and lazy",
    ],
    notes:
      "Stream = lazy, single-use pipeline over a source. Nothing runs without a terminal operation.",
    src: [
      [
        "The Java Tutorials: Aggregate Operations",
        `${T}/collections/streams/index.html`,
      ],
      [
        "Java SE API: java.util.stream",
        `${API}/util/stream/package-summary.html`,
      ],
    ],
  }),
  g({
    slug: "intermediate-vs-terminal-operations",
    topic: "Streams",
    d: "medium",
    title:
      "What are intermediate and terminal stream operations, and what does lazy evaluation mean?",
    kw: [
      "intermediate operation",
      "terminal operation",
      "lazy",
      "short-circuit",
      "peek",
    ],
    intent: "Checks that you know when stream code really runs.",
    short:
      "Intermediate operations, such as `filter`, `map`, `sorted`, `distinct` and `limit`, return another stream and do no work by themselves. Terminal operations, such as `collect`, `forEach`, `count`, `reduce`, `findFirst` and `anyMatch`, produce a result or a side effect and start the whole pipeline. This is lazy evaluation: because nothing happens until a terminal operation, the stream can process each element through all the steps one by one, and short-circuiting operations such as `findFirst` and `limit` can stop early without reading the rest.",
    detail: [
      "Without a terminal operation, a `peek` or `map` with a print statement prints nothing.",
      "Stateful operations like `sorted` must see all the elements before they pass any on.",
      "Avoid side effects inside intermediate operations, because the order and number of calls are not guaranteed.",
    ],
    ex: "`stream.filter(...).findFirst()` stops after the first match instead of filtering the whole list.",
    code: [
      "Nothing runs until the terminal call",
      'Stream<Integer> s = Stream.of(1, 2, 3, 4)\n    .filter(n -> { System.out.println("check " + n); return n % 2 == 0; });\nSystem.out.println("before");\n\nOptional<Integer> first = s.findFirst();\nSystem.out.println(first.get());',
      [
        "Creating the stream and the `filter` prints nothing.",
        "`before` is printed first.",
        "`findFirst` runs the pipeline and stops at `2`, so only `check 1` and `check 2` are printed.",
      ],
      "java",
    ],
    mistakes: [
      "Expecting a pipeline without a terminal operation to run.",
      "Relying on side effects in `map` or `filter`.",
    ],
    follow: ["Which operations are short-circuiting?"],
    points: [
      "Intermediate return a stream, terminal produce a result",
      "Lazy: runs only at the terminal operation",
      "Short-circuit operations stop early",
    ],
    notes:
      "Intermediate = lazy, return a stream. Terminal = triggers the work.",
    src: [
      [
        "Java SE API: java.util.stream (Stream operations and pipelines)",
        `${API}/util/stream/package-summary.html`,
      ],
      [
        "The Java Tutorials: Aggregate Operations",
        `${T}/collections/streams/index.html`,
      ],
    ],
  }),
  g({
    slug: "map-vs-flatmap",
    topic: "Streams",
    d: "medium",
    title: "What is the difference between `map` and `flatMap`?",
    kw: ["map", "flatMap", "nested streams", "flatten", "Stream<Stream>"],
    intent: "Checks that you can flatten nested collections.",
    short:
      "`map` transforms each element into exactly one new element, so a stream of `n` elements stays a stream of `n` elements. `flatMap` transforms each element into a stream and then flattens all of those streams into one, so each element can become zero, one or many elements. Use `flatMap` when your mapping function returns a collection or a stream and you want a single flat stream, instead of a stream of lists.",
    detail: [
      "`map(List::stream)` gives a `Stream<Stream<T>>`, and `flatMap(List::stream)` gives a `Stream<T>`.",
      "`Optional` has `map` and `flatMap` with the same idea.",
      "Splitting lines into words is a classic use.",
    ],
    ex: "A list of orders, each with a list of items, becomes one stream of all items with `orders.stream().flatMap(o -> o.items().stream())`.",
    code: [
      "Flatten lists of words",
      'List<String> lines = List.of("to be", "or not");\n\nList<List<String>> nested = lines.stream()\n    .map(l -> List.of(l.split(" ")))\n    .toList();\n\nList<String> words = lines.stream()\n    .flatMap(l -> Arrays.stream(l.split(" ")))\n    .toList();\n\nSystem.out.println(nested + " " + words);',
      [
        "`map` keeps one result per line, so we get a list of lists.",
        "`flatMap` merges the streams of words into one stream.",
        "The output is `[[to, be], [or, not]] [to, be, or, not]`.",
      ],
      "java",
    ],
    mistakes: [
      "Using `map` and ending up with a stream of streams or of lists.",
      "Using `flatMap` with a function that does not return a stream.",
    ],
    follow: ["How would you count the distinct words in a list of lines?"],
    points: [
      "map: one to one",
      "flatMap: one to many, flattened",
      "Use flatMap for nested collections",
    ],
    notes: "`map` = 1:1. `flatMap` = 1:many and flatten.",
    src: [
      [
        "Java SE API: Stream.flatMap",
        `${API}/util/stream/Stream.html#flatMap(java.util.function.Function)`,
      ],
      [
        "The Java Tutorials: Aggregate Operations",
        `${T}/collections/streams/index.html`,
      ],
    ],
  }),
  g({
    slug: "stream-filter-map-reduce",
    topic: "Streams",
    d: "easy",
    title:
      "How do you filter, map and reduce a list with streams? Show an example.",
    kw: ["filter", "map", "reduce", "sum", "IntStream"],
    intent:
      "Checks the three most common stream steps in one realistic example.",
    short:
      "`filter` keeps the elements that match a predicate, `map` transforms each element, and `reduce` combines all the elements into one value, such as a sum, using an identity value and an accumulator function. For numbers, primitive streams such as `IntStream` or `mapToInt(...)` give ready methods such as `sum`, `average`, `min` and `max`, and they avoid boxing. A typical pipeline is: filter the orders that are paid, map each to its amount, and sum them.",
    detail: [
      "`reduce(0, Integer::sum)` gives the sum, and without an identity it returns an `Optional`.",
      "`average()` returns an `OptionalDouble`, because the stream can be empty.",
      "The reduction function must be associative to be safe in a parallel stream.",
    ],
    ex: "The total of paid orders is the sum of the amounts of the orders whose status is `PAID`.",
    code: [
      "Total of paid orders",
      'record Order(String status, int amount) {}\n\nList<Order> orders = List.of(\n    new Order("PAID", 100), new Order("NEW", 50), new Order("PAID", 70));\n\nint total = orders.stream()\n    .filter(o -> o.status().equals("PAID"))\n    .mapToInt(Order::amount)\n    .sum();\n\nint viaReduce = orders.stream()\n    .map(Order::amount)\n    .reduce(0, Integer::sum);\n\nSystem.out.println(total + " " + viaReduce);',
      [
        "`filter` keeps the two paid orders.",
        "`mapToInt` and `sum` add `100 + 70`, giving `170`.",
        "The second pipeline sums all three amounts with `reduce`, giving `220`.",
      ],
      "java",
    ],
    mistakes: [
      "Using `reduce` where `sum()` or `collect` would be clearer.",
      "Calling `average().get()` on a possibly empty stream.",
    ],
    follow: ["What does the identity value in reduce mean?"],
    points: [
      "filter selects, map transforms, reduce combines",
      "Primitive streams have sum and average",
      "Empty streams need Optional results",
    ],
    notes: "`filter` → `mapToInt` → `sum()`; `reduce(identity, accumulator)`.",
    src: [
      [
        "The Java Tutorials: Reduction",
        `${T}/collections/streams/reduction.html`,
      ],
      ["Java SE API: Stream", `${API}/util/stream/Stream.html`],
    ],
  }),
  g({
    slug: "collectors-grouping",
    topic: "Streams",
    d: "medium",
    title: "How do you group and collect data with `Collectors`?",
    kw: ["Collectors", "groupingBy", "counting", "joining", "toMap"],
    intent: "Checks that you can do the stream version of SQL GROUP BY.",
    short:
      '`collect(Collectors.toList())` or `toList()` gathers the elements into a list, `toSet` into a set, and `joining(", ")` joins strings. `groupingBy(classifier)` groups elements into a `Map` by a key, and a downstream collector such as `counting()`, `summingInt` or `mapping` summarises each group. `partitioningBy(predicate)` splits the elements into two groups, true and false. `toMap(keyFn, valueFn)` builds a map, and it throws `IllegalStateException` on duplicate keys unless you give a merge function.',
    detail: [
      "`groupingBy` returns a `HashMap` by default, and you can pass a map factory such as `TreeMap::new`.",
      "`Stream.toList()`, added in Java 16, returns an unmodifiable list.",
      "`teeing` (Java 12) applies two collectors at once and combines the results.",
    ],
    ex: "A report counts employees per department with `groupingBy(Employee::dept, counting())`.",
    code: [
      "Group, count and join",
      'record Emp(String name, String dept) {}\nList<Emp> emps = List.of(\n    new Emp("Asha", "IT"), new Emp("Ravi", "IT"), new Emp("Meera", "HR"));\n\nMap<String, Long> perDept = emps.stream()\n    .collect(Collectors.groupingBy(Emp::dept, Collectors.counting()));\n\nString names = emps.stream().map(Emp::name).collect(Collectors.joining(", "));\n\nMap<String, String> byName = emps.stream()\n    .collect(Collectors.toMap(Emp::name, Emp::dept));',
      [
        "`groupingBy` with `counting` gives `{IT=2, HR=1}`.",
        "`joining` produces `Asha, Ravi, Meera`.",
        "`toMap` is safe here because the names are unique. Duplicates would throw an exception.",
      ],
      "java",
    ],
    mistakes: [
      "Using `toMap` on a key that can repeat without a merge function.",
      "Expecting `groupingBy` to keep the group order.",
    ],
    follow: ["How do you avoid an exception for duplicate keys in toMap?"],
    points: [
      "groupingBy = GROUP BY",
      "partitioningBy = two groups",
      "toMap needs a merge function for duplicate keys",
    ],
    notes:
      "`groupingBy(key, downstream)`, `partitioningBy`, `joining`, `toMap(k, v, merge)`.",
    src: [
      ["Java SE API: Collectors", `${API}/util/stream/Collectors.html`],
      [
        "The Java Tutorials: Reduction (collect)",
        `${T}/collections/streams/reduction.html`,
      ],
    ],
  }),
  g({
    slug: "stream-sorting-distinct-limit",
    topic: "Streams",
    d: "easy",
    title: "How do you sort, remove duplicates and limit results in a stream?",
    kw: ["sorted", "distinct", "limit", "skip", "Comparator"],
    intent: "Checks that you can finish a typical data query with streams.",
    short:
      "`sorted()` sorts by natural order, and `sorted(comparator)` sorts with a comparator such as `Comparator.comparing(Person::age).reversed()`. `distinct()` removes duplicates using `equals`. `limit(n)` keeps the first n elements, and `skip(n)` drops the first n, which together give simple paging. Both `limit` and `skip` are cheap on an ordered sequential stream, and `sorted` has to read all the elements first, so put `filter` before it to reduce the work.",
    detail: [
      "`distinct` needs a proper `equals` and `hashCode` on your element class.",
      "The order of the operations changes the result and the cost.",
      "`findFirst` is the right tool to get just one element.",
    ],
    ex: "A leaderboard shows the top three scores with `sorted(reverseOrder()).limit(3)`.",
    code: [
      "Top three distinct scores",
      "List<Integer> top = Stream.of(70, 90, 90, 85, 60)\n    .distinct()\n    .sorted(Comparator.reverseOrder())\n    .limit(3)\n    .toList();\nSystem.out.println(top);",
      [
        "`distinct` removes the second `90`.",
        "`sorted` with a reverse comparator orders them from the highest.",
        "`limit(3)` keeps `[90, 85, 70]`.",
      ],
      "java",
    ],
    mistakes: [
      "Sorting before filtering, which sorts more data than needed.",
      "Using `distinct` on objects that have no `equals`.",
    ],
    follow: ["What is the cost of sorted in a pipeline?"],
    points: [
      "sorted, distinct, limit, skip",
      "Filter before sorting",
      "distinct needs equals and hashCode",
    ],
    notes:
      "`distinct()`, `sorted(comparator)`, `limit(n)`, `skip(n)`: filter first to save work.",
    src: [
      ["Java SE API: Stream", `${API}/util/stream/Stream.html`],
      [
        "The Java Tutorials: Aggregate Operations",
        `${T}/collections/streams/index.html`,
      ],
    ],
  }),
  g({
    slug: "parallel-streams",
    topic: "Streams",
    d: "hard",
    title: "What is a parallel stream, and when should you not use it?",
    kw: [
      "parallel stream",
      "parallelStream",
      "ForkJoinPool",
      "common pool",
      "thread safety",
    ],
    intent: "Checks that you know parallelism is not a free speed-up.",
    short:
      "A parallel stream splits its source into parts and processes them on several threads of the common `ForkJoinPool`, then combines the results. You get one with `parallelStream()` or `stream().parallel()`. It can speed up CPU-heavy work on large data, but it has overhead, so it is often slower for small collections or cheap operations. The operations must be stateless and free of side effects, the reduction functions must be associative, and the source must split well, like an array or an `ArrayList`, unlike a `LinkedList`.",
    detail: [
      "Changing a shared non-thread-safe collection from a parallel stream gives wrong results.",
      "Blocking I/O in a parallel stream can starve the shared common pool.",
      "Measure with realistic data before and after. Do not assume that it is faster.",
    ],
    ex: "A heavy calculation over a million numbers may benefit, while summing ten numbers will be slower in parallel.",
    code: [
      "A wrong and a right way",
      "List<Integer> bad = new ArrayList<>();\nIntStream.range(0, 1000).parallel().forEach(bad::add);   // unsafe: ArrayList is not thread-safe\n\nList<Integer> good = IntStream.range(0, 1000).parallel()\n    .boxed()\n    .collect(Collectors.toList());                       // safe: uses a collector",
      [
        "Adding to a plain `ArrayList` from many threads can lose elements or throw exceptions.",
        "A collector is designed to combine partial results safely.",
      ],
      "java",
    ],
    mistakes: [
      "Using `parallelStream()` everywhere in the hope of a speed-up.",
      "Modifying shared state in a parallel pipeline.",
    ],
    follow: ["Which thread pool does a parallel stream use?"],
    points: [
      "Uses the common ForkJoinPool",
      "Needs stateless, side-effect-free operations",
      "Measure before using",
    ],
    notes:
      "Parallel streams help only with large, CPU-heavy, side-effect-free work. Measure.",
    src: [
      [
        "The Java Tutorials: Parallelism",
        `${T}/collections/streams/parallelism.html`,
      ],
      [
        "Java SE API: java.util.stream (Parallelism)",
        `${API}/util/stream/package-summary.html`,
      ],
    ],
  }),
  g({
    slug: "stream-match-find",
    topic: "Streams",
    d: "easy",
    title:
      "What are `anyMatch`, `allMatch`, `noneMatch`, `findFirst` and `findAny`?",
    kw: ["anyMatch", "allMatch", "noneMatch", "findFirst", "findAny"],
    intent: "Checks that you can ask yes/no questions of a stream.",
    short:
      "`anyMatch(predicate)` is true if at least one element matches, `allMatch` is true if every element matches, and `noneMatch` is true if no element matches. They are short-circuiting, so they stop as soon as the answer is known. `findFirst()` returns an `Optional` with the first element of the stream, and `findAny()` returns any element, which can be faster in a parallel stream. On an empty stream, `allMatch` and `noneMatch` return `true`, and `anyMatch` returns `false`.",
    detail: [
      "These replace loops with a flag variable.",
      "`findFirst` respects the encounter order of the stream.",
      "Combine `filter` with `findFirst` to find the first element with a property.",
    ],
    ex: "`orders.stream().anyMatch(o -> o.total() > 1000)` checks whether there is a large order.",
    code: [
      "Matching",
      "List<Integer> nums = List.of(2, 4, 6);\nSystem.out.println(nums.stream().allMatch(n -> n % 2 == 0));\nSystem.out.println(nums.stream().anyMatch(n -> n > 5));\nSystem.out.println(nums.stream().noneMatch(n -> n < 0));\nSystem.out.println(Stream.<Integer>empty().allMatch(n -> n > 100));",
      [
        "All numbers are even, so the first line is `true`.",
        "`6 > 5`, so `anyMatch` is `true`.",
        "No number is negative, so `noneMatch` is `true`.",
        "`allMatch` on an empty stream is `true`.",
      ],
      "java",
    ],
    mistakes: [
      "Forgetting that `allMatch` is true for an empty stream.",
      "Using `findAny` when the order matters.",
    ],
    follow: ["What does allMatch return for an empty stream?"],
    points: [
      "Short-circuiting yes/no checks",
      "findFirst vs findAny",
      "Empty stream: allMatch is true",
    ],
    notes:
      "`anyMatch`, `allMatch`, `noneMatch`, `findFirst` (ordered), `findAny`.",
    src: [
      ["Java SE API: Stream", `${API}/util/stream/Stream.html`],
      [
        "The Java Tutorials: Aggregate Operations",
        `${T}/collections/streams/index.html`,
      ],
    ],
  }),
  g({
    slug: "optional-basics",
    topic: "Optional",
    d: "easy",
    title: "What is `Optional` and why was it introduced?",
    kw: ["Optional", "null", "of", "ofNullable", "empty"],
    intent:
      "Checks that you know the purpose of Optional and how to create one.",
    short:
      "`Optional<T>` is a container that either holds a value or is empty. It was introduced in Java 8 to make it explicit in a method's return type that a result may be absent, instead of returning `null` and hoping that the caller remembers to check. You create one with `Optional.of(value)`, which throws if the value is `null`, `Optional.ofNullable(value)`, which gives an empty `Optional` for `null`, or `Optional.empty()`. The caller then handles the missing case with methods such as `orElse`, `map` and `ifPresent`.",
    detail: [
      "It is mainly designed as a return type, for methods such as `findById`.",
      "It does not remove the possibility of an `Optional` itself being `null`, so never return `null` from a method that returns an `Optional`.",
      "Streams use it for `findFirst`, `max` and `reduce`.",
    ],
    ex: "`userRepository.findById(id)` returns `Optional<User>`, and the caller decides what to do if there is no user.",
    code: [
      "Creating Optionals",
      'Optional<String> a = Optional.of("Asha");\nOptional<String> b = Optional.ofNullable(null);\nOptional<String> c = Optional.empty();\n\nSystem.out.println(a.isPresent() + " " + b.isPresent() + " " + c.isEmpty());',
      [
        "`of` requires a non-null value.",
        "`ofNullable(null)` gives an empty `Optional`.",
        "The output is `true false true`.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `Optional.of(null)` and getting a `NullPointerException`.",
      "Returning `null` from a method whose return type is `Optional`.",
    ],
    follow: ["How do you get the value out of an Optional safely?"],
    points: [
      "A value or empty",
      "of, ofNullable, empty",
      "Meant for return types",
    ],
    notes:
      "`Optional.of` (non-null), `ofNullable`, `empty`. Use it as a return type.",
    src: [
      ["Java SE API: Optional", `${API}/util/Optional.html`],
      [
        "Java SE API: java.util (Optional class description)",
        `${API}/util/Optional.html`,
      ],
    ],
  }),
  g({
    slug: "optional-orelse-vs-orelseget",
    topic: "Optional",
    d: "medium",
    title:
      "What is the difference between `orElse`, `orElseGet` and `orElseThrow`?",
    kw: [
      "orElse",
      "orElseGet",
      "orElseThrow",
      "default value",
      "lazy evaluation",
    ],
    intent:
      "Checks that you know a subtle performance and correctness difference.",
    short:
      "All three give a fallback when the `Optional` is empty. `orElse(value)` takes a value that is always evaluated, even if the `Optional` has a value, so an expensive or side-effecting expression there is wasted. `orElseGet(supplier)` takes a supplier that runs only when the `Optional` is empty, so use it when the default is costly to create. `orElseThrow(supplier)` throws the exception that you provide, and the no-argument `orElseThrow()`, added in Java 10, throws `NoSuchElementException`.",
    detail: [
      'A cheap constant such as `orElse("unknown")` is fine.',
      "`get()` without a check can throw, and `orElseThrow()` says that more clearly.",
      "`or(supplier)` in Java 9 provides another `Optional` as the fallback.",
    ],
    ex: "`findUser(id).orElseThrow(() -> new UserNotFoundException(id))` turns an empty result into a domain exception.",
    code: [
      "Eager and lazy defaults",
      'Optional<String> name = Optional.of("Asha");\n\nString a = name.orElse(loadDefault());          // loadDefault() runs even though name has a value\nString b = name.orElseGet(() -> loadDefault()); // not called\nString c = name.orElseThrow();                  // returns Asha\n\nOptional.empty().orElseThrow(() -> new IllegalStateException("missing"));',
      [
        "`orElse` evaluates `loadDefault()` before the call, always.",
        "`orElseGet` calls the supplier only if the value is missing.",
        "The last line throws the exception we supply.",
      ],
      "java",
    ],
    mistakes: [
      "Using `orElse` with a method that hits the database or creates a heavy object.",
      "Calling `get()` without checking `isPresent`.",
    ],
    follow: ["Why is Optional.get() discouraged?"],
    points: [
      "orElse: always evaluated",
      "orElseGet: only when empty",
      "orElseThrow: your own exception",
    ],
    notes:
      "`orElse` = eager value. `orElseGet` = lazy supplier. `orElseThrow` = exception.",
    src: [
      [
        "Java SE API: Optional.orElseGet",
        `${API}/util/Optional.html#orElseGet(java.util.function.Supplier)`,
      ],
      [
        "Java SE API: Optional.orElseThrow",
        `${API}/util/Optional.html#orElseThrow()`,
      ],
    ],
  }),
  g({
    slug: "optional-map-flatmap-filter",
    topic: "Optional",
    d: "medium",
    title: "How do `map`, `flatMap` and `filter` work on an `Optional`?",
    kw: [
      "Optional.map",
      "Optional.flatMap",
      "Optional.filter",
      "chaining",
      "ifPresentOrElse",
    ],
    intent: "Checks that you can replace nested null checks with a chain.",
    short:
      "`map(fn)` applies a function to the value if it is present and wraps the result in an `Optional`, and does nothing if it is empty. `flatMap(fn)` is for a function that already returns an `Optional`, and it avoids `Optional<Optional<T>>`. `filter(predicate)` keeps the value only if it matches, and otherwise gives an empty `Optional`. Chaining them replaces several nested `null` checks with one readable expression. `ifPresent` and `ifPresentOrElse` (Java 9) run an action at the end.",
    detail: [
      "A `map` whose function returns `null` gives an empty `Optional`.",
      "Use `flatMap` when each step in the chain can be absent.",
      "Keep the chain short. If it needs many steps, consider a clearer structure.",
    ],
    ex: '`user.flatMap(User::address).map(Address::city).orElse("unknown")` reads the city without a single `null` check.',
    code: [
      "A chain instead of nested ifs",
      'record Address(String city) {}\nrecord User(Optional<Address> address) {}\n\nOptional<User> user = Optional.of(new User(Optional.of(new Address("Pune"))));\n\nString city = user\n    .flatMap(User::address)\n    .map(Address::city)\n    .filter(c -> !c.isBlank())\n    .orElse("unknown");\nSystem.out.println(city);',
      [
        "`flatMap` is used because `address()` already returns an `Optional`.",
        "`map` extracts the city, and `filter` rejects a blank one.",
        "`orElse` provides the fallback. The output is `Pune`.",
      ],
      "java",
    ],
    mistakes: [
      "Using `map` with a function that returns an `Optional` and getting a nested one.",
      "Writing `if (opt.isPresent()) { opt.get() ... }`, which is just a null check again.",
    ],
    follow: ["When would you choose flatMap over map?"],
    points: [
      "map transforms the value",
      "flatMap flattens a nested Optional",
      "filter keeps a matching value",
    ],
    notes:
      "`map` (value → value), `flatMap` (value → Optional), `filter`, then `orElse`.",
    src: [
      ["Java SE API: Optional", `${API}/util/Optional.html`],
      [
        "Java SE API: Optional.flatMap",
        `${API}/util/Optional.html#flatMap(java.util.function.Function)`,
      ],
    ],
  }),
  g({
    slug: "optional-misuse",
    topic: "Optional",
    d: "medium",
    title: "Where should you not use `Optional`?",
    kw: ["Optional misuse", "field", "parameter", "collection", "Serializable"],
    intent: "Checks that you know the design intent and its limits.",
    short:
      "`Optional` was designed for return values that may be absent. Avoid it as a field in a class, because it adds an extra object, is not `Serializable`, and many frameworks do not expect it. Avoid it as a method parameter, because the caller then has to wrap values, and an overloaded method or a plain `null` check is simpler. Do not return `Optional` for collections or arrays, return an empty one instead. Never call `get()` without checking, and never use an `Optional` that is `null`.",
    detail: [
      "The Javadoc says that `Optional` is intended as a limited mechanism for method return types.",
      "A getter for an optional property can return `Optional<T>`, while the field itself stays a plain, possibly null, reference.",
      "Optionals of primitives have their own types: `OptionalInt`, `OptionalLong`, `OptionalDouble`.",
    ],
    ex: "A `User` class stores `String nickname` and offers `Optional<String> getNickname()`.",
    mistakes: [
      "Declaring a field as `Optional<String>`.",
      "Returning `Optional<List<T>>` instead of an empty list.",
    ],
    follow: ["How would you model an optional property in an entity?"],
    points: [
      "Best as a return type",
      "Not for fields or parameters",
      "Empty collections, not Optional of a collection",
    ],
    notes:
      "Use `Optional` for return values. Not for fields, parameters or collections.",
    src: [
      ["Java SE API: Optional (API Note)", `${API}/util/Optional.html`],
      ["Java SE API: OptionalInt", `${API}/util/OptionalInt.html`],
    ],
  }),
  g({
    slug: "what-are-records",
    topic: "Records",
    d: "easy",
    title: "What is a record in Java and what does it generate for you?",
    kw: [
      "record",
      "immutable data",
      "accessor",
      "equals hashCode toString",
      "Java 16",
    ],
    intent: "Checks that you know the modern way to write simple data classes.",
    short:
      "A record, final since Java 16, is a compact way to declare an immutable data carrier: `record Point(int x, int y) {}`. From its component list the compiler generates private final fields, a canonical constructor, accessor methods named after the components such as `x()`, and implementations of `equals`, `hashCode` and `toString` that use all the components. It replaces the boilerplate of a classic data class, so a record is the natural choice for DTOs, query results and map keys.",
    detail: [
      "A record is implicitly `final` and extends `java.lang.Record`, so it cannot extend another class.",
      "A record can implement interfaces and have methods and static members.",
      "Records are shallowly immutable: a component that is a mutable object can still be changed.",
    ],
    ex: "`record Money(long amount, String currency) {}` replaces a class with fields, a constructor, getters and three overridden methods.",
    code: [
      "A record in use",
      'record Point(int x, int y) {\n  double distanceFromOrigin() {\n    return Math.sqrt(x * x + y * y);\n  }\n}\n\nPoint p = new Point(3, 4);\nSystem.out.println(p);\nSystem.out.println(p.x() + " " + p.distanceFromOrigin());\nSystem.out.println(p.equals(new Point(3, 4)));',
      [
        "`toString` is generated, and prints `Point[x=3, y=4]`.",
        "Accessors are `x()` and `y()`, not `getX()`.",
        "`equals` compares the components, so the last line is `true`.",
      ],
      "java",
    ],
    mistakes: [
      "Expecting setters on a record.",
      "Assuming that a record holding a `List` is deeply immutable.",
    ],
    follow: ["Can a record extend a class?"],
    points: [
      "Immutable data carrier",
      "Generated constructor, accessors, equals, hashCode, toString",
      "Cannot extend, can implement",
    ],
    notes:
      "`record P(int x, int y) {}`: immutable, with generated accessors, equals, hashCode, toString.",
    src: [
      ["Java Language Updates: Record Classes", `${LANG}/records.html`],
      ["JEP 395: Records", "https://openjdk.org/jeps/395"],
    ],
  }),
  g({
    slug: "record-compact-constructor",
    topic: "Records",
    d: "medium",
    title: "How do you validate or customise a record's constructor?",
    kw: [
      "compact constructor",
      "canonical constructor",
      "validation",
      "record",
      "defensive copy",
    ],
    intent:
      "Checks that you can add rules to a record without losing its brevity.",
    short:
      "A compact constructor is written without a parameter list, and it runs before the fields are assigned. Inside it you can validate or normalise the component values, and the compiler assigns the fields at the end. For example, `record Age(int value) { Age { if (value < 0) throw new IllegalArgumentException(); } }`. You can also write the full canonical constructor, or add other constructors, as long as they delegate to the canonical one with `this(...)`. For a component that is a mutable collection, make a defensive copy, such as `List.copyOf(items)`.",
    detail: [
      "In a compact constructor you may reassign the parameters, for example `name = name.trim();`, but you cannot assign the fields directly.",
      "An accessor can be overridden, but it must return the component's type.",
      "Records cannot declare extra instance fields.",
    ],
    ex: "A `Range(int from, int to)` record rejects `from > to` and a `Basket` record copies its list.",
    code: [
      "Validation and a defensive copy",
      'record Range(int from, int to) {\n  Range {\n    if (from > to) {\n      throw new IllegalArgumentException("from must be <= to");\n    }\n  }\n}\n\nrecord Basket(List<String> items) {\n  Basket {\n    items = List.copyOf(items);\n  }\n}',
      [
        "The compact constructor has no parameter list and runs before assignment.",
        "The `Range` check stops an invalid object from ever existing.",
        "The `Basket` copies the list, so later changes by the caller do not affect the record.",
      ],
      "java",
    ],
    mistakes: [
      "Trying to assign `this.from = from` inside a compact constructor.",
      "Keeping a reference to a mutable list that the caller can still change.",
    ],
    follow: ["Can a record have additional constructors?"],
    points: [
      "Compact constructor: validate and normalise",
      "Fields are assigned at the end",
      "Copy mutable components",
    ],
    notes:
      "Compact constructor = validation without a parameter list. Copy mutable inputs.",
    src: [
      ["Java Language Updates: Record Classes", `${LANG}/records.html`],
      ["JEP 395: Records", "https://openjdk.org/jeps/395"],
    ],
  }),
  g({
    slug: "record-vs-class-vs-enum",
    topic: "Records",
    d: "medium",
    title: "When would you choose a record over a normal class?",
    kw: ["record vs class", "DTO", "immutable", "JPA entity", "inheritance"],
    intent:
      "Checks that you know the limits of records as well as the benefits.",
    short:
      "Choose a record when the type is a simple, immutable holder of values whose identity is its data, such as a DTO, a coordinate, a money amount, an API response or a map key. Choose a normal class when the object has a changing state, needs inheritance, has fields that are not part of its identity, or must work with a framework that needs a no-argument constructor and setters. In particular, a record is not a good fit for a JPA entity, which needs mutability and a default constructor.",
    detail: [
      "Records work well with pattern matching, where their components can be deconstructed.",
      "JSON libraries such as Jackson support records in recent versions.",
      "Use a class with the builder pattern when there are many optional fields.",
    ],
    ex: "A REST response `UserSummary(String id, String name)` is a record, and the `User` entity that Hibernate manages is a class.",
    mistakes: [
      "Using a record as a JPA entity.",
      "Using a record for an object whose state must change over time.",
    ],
    follow: ["Why is a record not suitable as a JPA entity?"],
    points: [
      "Records: immutable value holders",
      "Classes: mutable state, inheritance, frameworks",
      "DTOs and keys are ideal for records",
    ],
    notes:
      "Records for DTOs and values. Classes for entities, mutable state and inheritance.",
    src: [
      ["Java Language Updates: Record Classes", `${LANG}/records.html`],
      ["JEP 395: Records (Restrictions)", "https://openjdk.org/jeps/395"],
    ],
  }),
  g({
    slug: "record-patterns",
    topic: "Records",
    d: "hard",
    title: "What are record patterns?",
    kw: [
      "record pattern",
      "deconstruction",
      "pattern matching",
      "instanceof",
      "Java 21",
    ],
    intent:
      "Checks that you know how records connect to pattern matching in modern Java.",
    short:
      "A record pattern, final in Java 21, tests whether a value is a certain record and, at the same time, extracts its components into variables: `if (obj instanceof Point(int x, int y)) { ... }`. It can be used in `instanceof` and in `switch`, and the patterns can be nested to take apart a record inside a record. This replaces a chain of casts and accessor calls with one readable declaration.",
    detail: [
      "The variables are only in scope where the pattern matched.",
      "A pattern can use `var` for a component type that you do not need to write.",
      "In a `switch`, record patterns combine with sealed types to cover every case.",
    ],
    ex: "A function that computes a distance takes an `Object`, matches `Point(int x, int y)` and uses `x` and `y` directly.",
    code: [
      "Deconstructing a record",
      'record Point(int x, int y) {}\nrecord Line(Point from, Point to) {}\n\nstatic String describe(Object o) {\n  if (o instanceof Line(Point(var x1, var y1), Point(var x2, var y2))) {\n    return "line from " + x1 + "," + y1 + " to " + x2 + "," + y2;\n  }\n  return "something else";\n}\n\nSystem.out.println(describe(new Line(new Point(0, 0), new Point(3, 4))));',
      [
        "The pattern checks that `o` is a `Line` and that both its fields are `Point` records.",
        "The four coordinates are extracted into variables in one step.",
        "The output is `line from 0,0 to 3,4`.",
      ],
      "java",
    ],
    mistakes: [
      "Writing manual casts and getter calls where a pattern would do.",
      "Using the variables outside the scope where the pattern matched.",
    ],
    follow: ["How do record patterns work in a switch?"],
    points: [
      "Test and extract in one step",
      "Can be nested",
      "Works in instanceof and switch",
    ],
    notes:
      "`o instanceof Point(int x, int y)` tests and deconstructs a record (Java 21).",
    src: [
      [
        "Java Language Updates: Pattern Matching",
        `${LANG}/pattern-matching.html`,
      ],
      ["JEP 440: Record Patterns", "https://openjdk.org/jeps/440"],
    ],
  }),
  g({
    slug: "what-are-virtual-threads",
    topic: "Virtual threads",
    d: "medium",
    title: "What are virtual threads and what problem do they solve?",
    kw: [
      "virtual threads",
      "Project Loom",
      "platform threads",
      "blocking I/O",
      "Java 21",
    ],
    intent: "Checks that you know the main concurrency feature of Java 21.",
    short:
      "Virtual threads, final in Java 21, are lightweight threads managed by the JVM instead of the operating system. A normal platform thread is a thin wrapper around an OS thread, which is expensive, so a server can only afford thousands of them. A virtual thread is cheap, so you can have millions, and when it blocks on I/O, the JVM unmounts it from its carrier thread, which then runs another virtual thread. This lets you write simple blocking code, one thread per request, and still handle very many concurrent tasks.",
    detail: [
      "They are `Thread` objects, so existing code and debugging tools work with them.",
      "They are always daemon threads.",
      "They do not make CPU-bound work faster, and they help when tasks spend most of their time waiting.",
    ],
    ex: "A web server handles every request on its own virtual thread, even when each request waits for several slow network calls.",
    code: [
      "Starting virtual threads",
      'Thread t = Thread.ofVirtual().name("worker").start(() -> System.out.println("hello"));\nt.join();\n\ntry (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n  for (int i = 0; i < 1000; i++) {\n    int id = i;\n    executor.submit(() -> {\n      Thread.sleep(100);\n      return id;\n    });\n  }\n}',
      [
        "`Thread.ofVirtual().start` creates and starts one virtual thread.",
        "The executor starts a new virtual thread for every task.",
        "A thousand sleeping tasks use very few OS threads, and the `try` waits for them to finish.",
      ],
      "java",
    ],
    mistakes: [
      "Expecting virtual threads to speed up CPU-bound code.",
      "Treating them as a scarce resource and pooling them.",
    ],
    follow: ["Should you pool virtual threads?"],
    points: [
      "JVM-managed, very cheap threads",
      "Great for many blocking tasks",
      "Not for CPU-bound work",
    ],
    notes:
      "Virtual threads (Java 21): one thread per task, cheap blocking, no pooling.",
    src: [
      [
        "Java Core Libraries: Virtual Threads",
        "https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html",
      ],
      ["JEP 444: Virtual Threads", "https://openjdk.org/jeps/444"],
    ],
  }),
  g({
    slug: "virtual-threads-vs-platform-threads",
    topic: "Virtual threads",
    d: "hard",
    title:
      "When should you use virtual threads, and what should you watch out for?",
    kw: [
      "virtual threads",
      "pinning",
      "synchronized",
      "ThreadLocal",
      "thread pool",
    ],
    intent:
      "Checks that you know the guidance and the pitfalls and not only the headline.",
    short:
      "Use virtual threads for tasks that spend most of their time waiting, such as handling requests that call databases or remote services, with simple blocking code. Do not pool them: create one per task. Be careful with a few things. In Java 21, a virtual thread that blocks inside a `synchronized` block or a native call can pin its carrier thread, which reduces scalability, so prefer `ReentrantLock` for long blocking sections. Avoid heavy use of `ThreadLocal`, because many threads mean many copies. CPU-bound work gains nothing, and limits on shared resources, like a database connection pool, still apply, so use a semaphore where needed.",
    detail: [
      "Virtual threads are scheduled by the JVM on a small pool of carrier threads, which is a `ForkJoinPool`.",
      "A million threads cannot all use a database at once, so the real bottleneck moves to the resource.",
      "Check the documentation of your Java version, because the pinning behaviour has changed over releases.",
    ],
    ex: "A service replaces its fixed request pool with one virtual thread per request, and limits the calls to a partner API with a semaphore.",
    mistakes: [
      "Creating a pool of virtual threads to limit concurrency, instead of using a semaphore.",
      "Holding a `synchronized` lock while doing slow blocking I/O.",
    ],
    follow: ["What is pinning?"],
    points: [
      "Best for blocking, I/O-bound work",
      "One per task, never pooled",
      "Watch out for pinning and ThreadLocal",
    ],
    notes:
      "Virtual threads: I/O-bound, one per task. Beware `synchronized` pinning and `ThreadLocal`.",
    src: [
      [
        "Java Core Libraries: Virtual Threads",
        "https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html",
      ],
      ["JEP 444: Virtual Threads", "https://openjdk.org/jeps/444"],
    ],
  }),
  g({
    slug: "sealed-classes-and-interfaces",
    topic: "Sealed classes",
    d: "medium",
    title: "What are sealed classes and interfaces?",
    kw: ["sealed", "permits", "non-sealed", "final", "Java 17"],
    intent: "Checks that you know how to restrict a hierarchy.",
    short:
      "A sealed class or interface, final in Java 17, lists exactly which classes may extend or implement it with `permits`: `sealed interface Shape permits Circle, Square {}`. Each permitted subtype must declare how it continues the hierarchy: `final` (no more subclasses), `sealed` (with its own permitted list) or `non-sealed` (open again). The compiler then knows all the possible subtypes, which makes the design explicit and lets a `switch` check that it covers every case.",
    detail: [
      "The permitted subclasses must be in the same package, or in the same module.",
      "If the subtypes are in the same file, the `permits` clause can be left out.",
      "Records and enums can be the permitted subtypes, because records are final.",
    ],
    ex: "A payment result is either `Success`, `Declined` or `Failed`, and no other kind is allowed.",
    code: [
      "A closed hierarchy",
      "sealed interface Shape permits Circle, Square {}\nrecord Circle(double radius) implements Shape {}\nrecord Square(double side) implements Shape {}\n\n// record Triangle(double a) implements Shape {}  // compile error: not permitted",
      [
        "`permits` lists the only two implementations.",
        "Records are implicitly final, so they satisfy the subtype rule.",
        "Any other class that tries to implement `Shape` fails to compile.",
      ],
      "java",
    ],
    mistakes: [
      "Forgetting `final`, `sealed` or `non-sealed` on a permitted subclass.",
      "Sealing a hierarchy that is meant to be extended by library users.",
    ],
    follow: ["What does non-sealed mean?"],
    points: [
      "permits lists all subtypes",
      "Subtypes: final, sealed or non-sealed",
      "Closed, known hierarchy",
    ],
    notes:
      "`sealed ... permits A, B`: a closed hierarchy; subtypes are final, sealed or non-sealed.",
    src: [
      [
        "Java Language Updates: Sealed Classes",
        `${LANG}/sealed-classes-and-interfaces.html`,
      ],
      ["JEP 409: Sealed Classes", "https://openjdk.org/jeps/409"],
    ],
  }),
  g({
    slug: "switch-expressions-and-pattern-matching",
    topic: "Sealed classes",
    d: "hard",
    title:
      "How do switch expressions and pattern matching work with sealed types?",
    kw: [
      "switch expression",
      "pattern matching",
      "exhaustive",
      "sealed",
      "yield",
    ],
    intent:
      "Checks that you can use the features together, as modern Java is written.",
    short:
      "A switch expression, from Java 14, returns a value, uses arrows (`case A -> value`), does not fall through, and must cover all the possible values. Since Java 21, `switch` also supports patterns, so a case can test a type and bind a variable: `case Circle c -> ...`, with an optional `when` guard. When the selector has a sealed type and the cases cover all permitted subtypes, the switch is exhaustive and needs no `default`. If you later add a new subtype, the compiler reports every switch that does not handle it.",
    detail: [
      "A `null` selector throws a `NullPointerException` unless you add `case null`.",
      "Order matters for patterns: a more general pattern before a specific one is a compile error.",
      "Use `yield` to return a value from a block in a case.",
    ],
    ex: "`area(Shape s)` uses a switch over the sealed `Shape`, and adding a `Triangle` makes the compiler point at the places that need an update.",
    code: [
      "An exhaustive switch",
      "sealed interface Shape permits Circle, Square {}\nrecord Circle(double radius) implements Shape {}\nrecord Square(double side) implements Shape {}\n\nstatic double area(Shape s) {\n  return switch (s) {\n    case Circle c -> Math.PI * c.radius() * c.radius();\n    case Square q -> q.side() * q.side();\n  };\n}\n\nSystem.out.println(area(new Square(3)));",
      [
        "Both permitted types are handled, so no `default` is needed.",
        "Each case binds a typed variable, so no cast is needed.",
        "The output is `9.0`.",
      ],
      "java",
    ],
    mistakes: [
      "Adding `default` to a switch over a sealed type, which hides the missing-case error you want.",
      "Putting a general pattern before a specific one.",
    ],
    follow: ["What does exhaustive mean?"],
    points: [
      "Switch expression returns a value, no fall-through",
      "Type patterns with when guards",
      "Sealed types make it exhaustive",
    ],
    notes:
      "`switch` over a sealed type with type patterns is exhaustive. Avoid `default` to keep compile-time checks.",
    src: [
      [
        "Java Language Updates: Pattern Matching for switch",
        `${LANG}/pattern-matching.html`,
      ],
      ["JEP 441: Pattern Matching for switch", "https://openjdk.org/jeps/441"],
    ],
  }),
  g({
    slug: "sealed-vs-enum-vs-abstract",
    topic: "Sealed classes",
    d: "medium",
    title:
      "When would you use a sealed hierarchy instead of an enum or an abstract class?",
    kw: [
      "sealed",
      "enum",
      "abstract class",
      "algebraic data type",
      "closed hierarchy",
    ],
    intent:
      "Checks that you can choose the right tool for a fixed set of alternatives.",
    short:
      "An enum is for a fixed set of constants, where each value is a single instance of the same type, perhaps with the same fields. A sealed hierarchy is for a fixed set of kinds of things, where each kind can have a different shape and its own data, such as `Success(value)` and `Failure(error)`, and the compiler knows that the list is complete. An ordinary abstract class or interface is open, so anyone can add a new subtype, which is right for a plug-in point but wrong when your code must handle every case. Sealed types with records give you the algebraic data types of other languages.",
    detail: [
      "A sealed interface can be implemented by an enum too, to mix constants and data-carrying cases.",
      "If the set of kinds changes often from outside, keep the hierarchy open.",
      "Together with pattern-matching `switch`, sealed types replace the visitor pattern in many cases.",
    ],
    ex: "A `Result` is either `Ok(value)` or `Error(message)`, with different data in each, so it is a sealed interface and not an enum.",
    mistakes: [
      "Using an enum when each case needs different fields.",
      "Leaving a hierarchy open when the code needs to handle all cases.",
    ],
    follow: ["How do sealed types replace the visitor pattern?"],
    points: [
      "Enum: fixed constants, same shape",
      "Sealed: fixed kinds, different data",
      "Open hierarchy: extension by others",
    ],
    notes:
      "Enum = fixed values. Sealed = fixed kinds with their own data. Open = extensible.",
    src: [
      [
        "Java Language Updates: Sealed Classes",
        `${LANG}/sealed-classes-and-interfaces.html`,
      ],
      ["The Java Tutorials: Enum Types", `${T}/java/javaOO/enum.html`],
    ],
  }),
])
