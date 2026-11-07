import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-multithreading", {
  slug: "completablefuture",
  title: "CompletableFuture: asynchronous pipelines",
  topic: "CompletableFuture",
  minutes: 80,
  overview:
    "Compose asynchronous work with CompletableFuture: chain, combine, run in parallel, and handle errors and timeouts.",
  objectives: [
    "Start work with supplyAsync and chain steps",
    "Choose between thenApply, thenCompose and thenCombine",
    "Handle failures with exceptionally, handle and timeouts",
  ],
  prerequisites: ["lesson.java-multithreading.executors"],
  sections: [
    {
      kind: "explain",
      heading: "Beyond Future",
      body: [
        "A plain `Future` can only be waited on with a blocking `get()`. A `CompletableFuture` can also be **composed**: you start work with `supplyAsync` or `runAsync`, which run on the common `ForkJoinPool` by default or on an executor that you pass, and chain steps that run **when the previous step completes**, without blocking a thread to wait. Pass your own executor for blocking work, so that you do not block the shared pool.",
        "`thenApply(fn)` transforms the result, like `map`. `thenAccept` consumes it. `thenCompose(fn)` is for a function that itself returns a `CompletableFuture`, like `flatMap`, and avoids a nested future. `thenCombine(other, fn)` waits for two independent futures and merges their results. `join()` and `get()` block, and are used at the very end, if at all.",
      ],
    },
    {
      kind: "code",
      heading: "A pipeline",
      example: {
        title: "supplyAsync, thenApply, thenCombine",
        language: "java",
        code: 'CompletableFuture<String> name = CompletableFuture.supplyAsync(() -> "asha");\n    CompletableFuture<Integer> age = CompletableFuture.supplyAsync(() -> 31);\n    CompletableFuture<String> text = name\n        .thenApply(String::toUpperCase)\n        .thenCombine(age, (n, a) -> n + " is " + a);\n    System.out.println(text.join());\n    CompletableFuture<Integer> chained = CompletableFuture.supplyAsync(() -> 5)\n        .thenCompose(n -> CompletableFuture.supplyAsync(() -> n * 10));\n    System.out.println(chained.join());',
        walkthrough: [
          "The two `supplyAsync` calls start at once, so they run at the same time.",
          "`thenApply` changes the name, and `thenCombine` waits for both results and joins them.",
          "`thenCompose` is used because the next step returns a future. The output is `ASHA is 31` and `50`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Errors and timeouts",
      body: [
        "If a step throws, the future completes **exceptionally**, and the later steps are skipped. `exceptionally(fn)` turns the failure into a fallback value. `handle((value, error) -> ...)` runs in both cases and returns a result. `whenComplete` observes the outcome without changing it. `orTimeout(time, unit)` and `completeOnTimeout(value, time, unit)`, added in Java 9, limit how long you wait.",
        "`join()` wraps a failure in an unchecked `CompletionException`, and `get()` wraps it in a checked `ExecutionException`. The original exception is the cause. An exception that nobody handles is silent until you call `join` or `get`, so attach a handler.",
      ],
    },
    {
      kind: "code",
      heading: "A fallback",
      example: {
        title: "exceptionally and handle",
        language: "java",
        code: 'CompletableFuture<Integer> bad = CompletableFuture.supplyAsync(() -> {\n      if (true) throw new IllegalStateException("price service down");\n      return 100;\n    });\n    System.out.println(bad.exceptionally(ex -> -1).join());\n    String described = bad.handle((v, ex) -> ex == null ? "ok" : "failed: " + ex.getCause().getMessage()).join();\n    System.out.println(described);\n    try {\n      bad.join();\n    } catch (CompletionException e) {\n      System.out.println(e.getCause().getClass().getSimpleName());\n    }',
        walkthrough: [
          "The step throws, so the future completes exceptionally and `exceptionally` supplies `-1`.",
          "`handle` receives both the value and the error, and here sees the error, whose cause is the original exception.",
          "`join` wraps the exception in a `CompletionException`. The output is `-1`, `failed: price service down` and `IllegalStateException`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Waiting for many",
      body: [
        "To run several calls in parallel, **start all the futures first**, and then wait: `CompletableFuture.allOf(f1, f2, f3).join()` completes when every one has completed. It returns a `CompletableFuture<Void>`, so you read each result from its own future afterwards. `anyOf` completes with the first one that finishes. If one future fails, `allOf` completes exceptionally as well.",
        "Joining each future right after creating it, one by one, makes the calls **sequential**. Create them all, then join.",
      ],
    },
    {
      kind: "code",
      heading: "Fan out and collect",
      example: {
        title: "allOf",
        language: "java",
        code: "List<CompletableFuture<Integer>> futures = new ArrayList<>();\n    for (int i = 1; i <= 3; i++) {\n      int n = i;\n      futures.add(CompletableFuture.supplyAsync(() -> n * 100));\n    }\n    CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();\n    int total = 0;\n    for (CompletableFuture<Integer> f : futures) total += f.join();\n    System.out.println(total);",
        walkthrough: [
          "All three futures start immediately, so they overlap in time.",
          "`allOf(...).join()` waits until all have finished.",
          "Each result is read from its own future. The total is `600`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Calling `get()` or `join()` in every step.",
          fix: "Chain with `thenApply` and block only at the end.",
        },
        {
          mistake: "Using `thenApply` with a function that returns a future.",
          fix: "Use `thenCompose`.",
        },
        {
          mistake: "Running blocking I/O on the common pool.",
          fix: "Pass an executor.",
        },
        {
          mistake: "Never attaching an error handler.",
          fix: "Use `exceptionally`, `handle` or `whenComplete`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A product page",
      scenario:
        "A page needs the product, its price and its reviews from three services.",
      body: [
        "Start the three calls together with `supplyAsync` on an I/O executor, wait with `allOf`, and combine them into one view. A price lookup has `orTimeout` and `exceptionally`, so a slow price service shows a cached price and not an error page.",
        "The page waits for the slowest call, not for the sum of the three.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "cf-compose",
      prompt: "When do you use `thenCompose` instead of `thenApply`?",
      options: [
        "When the function returns a CompletableFuture",
        "When the function returns a number",
        "Never",
      ],
      answer: 0,
      explanation: "`thenCompose` flattens the nested future.",
    },
    {
      type: "single",
      id: "cf-allof",
      prompt: "What does `CompletableFuture.allOf` return?",
      options: [
        "A CompletableFuture<Void>",
        "A list of the results",
        "The first result",
      ],
      answer: 0,
      explanation: "Read each result from its own future after it completes.",
    },
    {
      type: "truefalse",
      id: "cf-join",
      statement: "`join()` throws a checked exception.",
      answer: false,
      explanation:
        "`join()` throws `CompletionException`, which is unchecked. `get()` throws `ExecutionException`.",
    },
    {
      type: "output",
      id: "cf-then",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: "System.out.println(CompletableFuture.completedFuture(4).thenApply(n -> n + 1).join());",
      },
      options: ["5", "4", "CompletableFuture"],
      answer: 0,
      explanation: "`thenApply` adds one to the completed value.",
    },
  ],
  assignment: {
    title: "A parallel dashboard",
    task: [
      "Write three methods that simulate remote calls with `sleep`, and combine them with `allOf` and `thenCombine`.",
      "Add a timeout and a fallback to one of them, and show the total time is about the slowest call.",
    ],
    checklist: [
      "The three calls run in parallel",
      "A failing call does not break the page",
      "I did not call join inside the stages",
    ],
    minutes: 35,
  },
  exercises: [
    {
      slug: "cf-ex",
      title: "Combine two async values",
      task: [
        "Write `static CompletableFuture<Integer> addAsync(int a, int b)` that computes `a` and `b` in separate `supplyAsync` tasks and adds them with `thenCombine`.",
      ],
      language: "java",
      starter:
        "import java.util.concurrent.*;\n\npublic class Async {\n  // your code\n}",
      solution:
        "import java.util.concurrent.*;\n\npublic class Async {\n  static CompletableFuture<Integer> addAsync(int a, int b) {\n    CompletableFuture<Integer> fa = CompletableFuture.supplyAsync(() -> a);\n    CompletableFuture<Integer> fb = CompletableFuture.supplyAsync(() -> b);\n    return fa.thenCombine(fb, Integer::sum);\n  }\n\n  public static void main(String[] args) {\n    System.out.println(addAsync(2, 3).join());\n  }\n}",
      hints: [
        "`thenCombine` takes the other future and a function of two values.",
      ],
      checklist: [
        "Both values are computed asynchronously",
        "thenCombine is used",
        "No join inside addAsync",
      ],
    },
  ],
  revisionNotes: [
    "`supplyAsync` + `thenApply`/`thenCompose`/`thenCombine` build pipelines without blocking",
    "`exceptionally`, `handle`, `orTimeout` for failures and time limits",
    "Start futures first, then `allOf(...).join()`",
    "Pass an executor for blocking work; join only at the end",
  ],
  resources: [
    {
      label: "The Java Tutorials: High Level Concurrency Objects",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/highlevel.html",
    },
    {
      label: "Java SE API: CompletableFuture",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html",
    },
  ],
})
