import { defineQuestions } from "../author"
import { q } from "../compact"

const D = "https://docs.python.org/3"
const PEP = "https://peps.python.org"

export default defineQuestions("python-async", "fresher", [
  q({
    slug: "what-is-asyncio-and-the-event-loop",
    topic: "Event loop",
    d: "easy",
    title: "What is `asyncio`, and what does the event loop do?",
    kw: [
      "asyncio",
      "event loop",
      "cooperative multitasking",
      "single thread",
      "coroutines",
    ],
    intent: "The foundation question for async Python.",
    short:
      "`asyncio` is the standard library's framework for writing concurrent code with `async` and `await`. At its centre is the event loop, which runs in one thread and keeps a collection of tasks. It runs a task until that task reaches an `await` on something that is not ready, such as a network read; then it switches to another ready task, and it resumes the first when its operation completes. This cooperative multitasking lets one thread handle thousands of waiting connections with little memory, but a task that never awaits blocks the whole loop. It is aimed at I/O-bound programs.",
    detail: [
      "The loop also schedules callbacks, timers and handles network and subprocess events.",
      "Tasks only switch at `await` points, which makes races rarer than with threads.",
      "`asyncio.run()` is the usual way to start the loop.",
    ],
    ex: "A server that handles many clients at once on a single thread.",
    code: [
      [
        "Two waits at once",
        "python",
        `import asyncio\n\nasync def job(name, delay):\n    await asyncio.sleep(delay)\n    print(name, "done")\n\nasync def main():\n    await asyncio.gather(job("a", 1), job("b", 1))  # about 1 second total\n\nasyncio.run(main())`,
        ["Both sleeps overlap.", "The loop switches while each waits."],
      ],
    ],
    mistakes: [
      "Blocking the loop with long synchronous calls.",
      "Using asyncio for CPU-bound work.",
    ],
    follow: ["What happens when a task never awaits?"],
    points: [
      "Single-threaded event loop",
      "Switches tasks at await",
      "Cooperative multitasking",
      "Best for I/O-bound work",
    ],
    notes: ["One thread, many waiting tasks."],
    src: [
      ["Python: asyncio", `${D}/library/asyncio.html`],
      ["Python: Event loop", `${D}/library/asyncio-eventloop.html`],
    ],
  }),
  q({
    slug: "asyncio-vs-threading",
    topic: "Event loop",
    d: "medium",
    title: "How does `asyncio` differ from threading?",
    kw: [
      "asyncio vs threading",
      "cooperative",
      "preemptive",
      "context switch",
      "scalability",
    ],
    intent: "Checks understanding of the concurrency models.",
    short:
      "Threads are scheduled preemptively by the operating system, which can switch between them at almost any point, so shared data needs locks. An `asyncio` program runs in one thread and tasks switch only at `await`, which is cooperative: it is easier to reason about shared state, and tasks are far lighter than threads, so tens of thousands can wait at once. The cost is that everything on the path must be async-aware; a blocking call such as `requests.get` or `time.sleep` freezes all tasks, whereas in threads it only blocks one. Threads suit existing blocking libraries, `asyncio` suits very many concurrent connections.",
    detail: [
      "Neither helps CPU-bound pure-Python code under the GIL.",
      "You can combine them: run blocking calls from async code with `asyncio.to_thread`.",
      "Async code spreads: callers of async functions generally must be async too.",
    ],
    ex: "A chat server with 10,000 idle connections fits asyncio well.",
    mistakes: [
      "Calling blocking libraries from async code.",
      "Assuming async code is automatically parallel.",
    ],
    follow: ["How do you call a blocking function from async code?"],
    points: [
      "Threads: preemptive, locks needed",
      "asyncio: cooperative, switches at await",
      "Tasks are lighter than threads",
      "Blocking calls freeze the loop",
    ],
    notes: ["Cooperative versus preemptive."],
    src: [
      ["Python: asyncio", `${D}/library/asyncio.html`],
      ["Python: threading", `${D}/library/threading.html`],
    ],
  }),
  q({
    slug: "asyncio-run-entry-point",
    topic: "Event loop",
    d: "easy",
    title:
      "How do you start an async program, and what does `asyncio.run()` do?",
    kw: [
      "asyncio.run",
      "entry point",
      "main coroutine",
      "event loop creation",
      "runtimeerror running loop",
    ],
    intent: "Checks the standard way to launch async code.",
    short:
      "`asyncio.run(main())` is the high-level entry point. It creates a new event loop, runs the given coroutine until it completes, finalises asynchronous generators, closes the loop and returns the coroutine's result. It should normally be called once, at the top of the program, usually under `if __name__ == '__main__':`. It cannot be called when another event loop is already running in the same thread, for example inside a Jupyter notebook cell or from inside an `async def`; there you simply `await` the coroutine. Calling an `async def` function directly only creates a coroutine object.",
    detail: [
      "`asyncio.run(main(), debug=True)` enables debug mode.",
      "Notebook environments already run a loop, so top-level `await` is used instead.",
      "Create resources like HTTP sessions inside the running loop.",
    ],
    ex: "A script's last lines: `if __name__ == '__main__': asyncio.run(main())`.",
    code: [
      [
        "Entry point",
        "python",
        `import asyncio\n\nasync def main():\n    await asyncio.sleep(0.1)\n    return "done"\n\nif __name__ == "__main__":\n    print(asyncio.run(main()))   # done`,
        ["`run` manages the whole loop lifecycle."],
      ],
    ],
    mistakes: [
      "Calling asyncio.run inside a running loop.",
      "Calling the async function without running or awaiting it.",
    ],
    follow: ["Why can't you call asyncio.run from async code?"],
    points: [
      "Creates, runs and closes a loop",
      "Call once at the top level",
      "Not inside a running loop",
      "Returns the coroutine result",
    ],
    notes: ["One call to start everything."],
    src: [
      ["Python: asyncio.run", `${D}/library/asyncio-runner.html`],
      ["Python: Coroutines and tasks", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "blocking-calls-freeze-the-event-loop",
    topic: "Event loop",
    d: "medium",
    title:
      "Why does `time.sleep()` or a slow synchronous call break async code?",
    kw: [
      "blocking call",
      "time.sleep",
      "asyncio.sleep",
      "event loop stall",
      "synchronous library",
    ],
    intent: "Checks the most common async mistake.",
    short:
      "The event loop can only switch tasks when the running task awaits. A synchronous call such as `time.sleep(1)`, a `requests.get`, a heavy computation or a blocking database driver does not yield, so the loop is stuck until it returns and every other task, timer and connection waits too. Replace sleeps with `await asyncio.sleep()`, use async-native libraries for network and database access, and move unavoidable blocking or CPU-heavy work to a thread or process with `asyncio.to_thread()` or `loop.run_in_executor()`. Debug mode logs callbacks that take too long, which helps find culprits.",
    detail: [
      "File I/O with ordinary `open()` also blocks, though briefly.",
      "A long CPU loop can be broken up with occasional `await asyncio.sleep(0)`, but a process pool is better.",
      "One blocking call can make a whole server look dead.",
    ],
    ex: "An async web handler that calls `requests.get` makes every other request wait for it.",
    code: [
      [
        "sleep versus time.sleep",
        "python",
        `import asyncio, time\n\nasync def good():\n    await asyncio.sleep(1)   # lets others run\n\nasync def bad():\n    time.sleep(1)            # freezes the loop\n\nasync def main():\n    start = time.perf_counter()\n    await asyncio.gather(good(), good(), good())\n    print(round(time.perf_counter() - start, 1))  # 1.0`,
        [
          "Three `good` calls overlap.",
          "Three `bad` calls would take about 3 seconds.",
        ],
      ],
    ],
    mistakes: [
      "Using requests or time.sleep in async def.",
      "Running CPU-heavy loops on the event loop.",
    ],
    follow: ["How do you run blocking code from async code?"],
    points: [
      "Loop switches only at await",
      "Sync calls block everything",
      "Use async libraries or asyncio.sleep",
      "Offload to a thread or process",
    ],
    notes: ["Never block the loop."],
    src: [
      [
        "Python: Developing with asyncio (running blocking code)",
        `${D}/library/asyncio-dev.html`,
      ],
      ["Python: asyncio.sleep", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "asyncio-to-thread-and-run-in-executor",
    topic: "Event loop",
    d: "medium",
    title:
      "How do `asyncio.to_thread` and `run_in_executor` let async code call blocking functions?",
    kw: [
      "asyncio.to_thread",
      "run_in_executor",
      "blocking function",
      "thread pool",
      "process pool",
    ],
    intent: "Checks bridging between sync and async code.",
    short:
      "`await asyncio.to_thread(func, *args)` (Python 3.9+) runs a blocking function in a worker thread and suspends the calling coroutine until it finishes, so the event loop stays free. `loop.run_in_executor(executor, func, *args)` does the same with a chosen executor: `None` for the default thread pool, or a `ProcessPoolExecutor` for CPU-bound work, where functions and arguments must be picklable. Threads help for blocking I/O libraries but not for CPU-bound Python code because of the GIL. The function you pass must be thread-safe and should not touch asyncio objects directly.",
    detail: [
      "`to_thread` also copies the current context variables to the worker thread.",
      "The default executor has a limited number of threads.",
      "Cancelling the awaiting task does not stop the thread, which keeps running.",
    ],
    ex: "Calling a legacy synchronous database client from an async API handler.",
    code: [
      [
        "to_thread",
        "python",
        `import asyncio, time\n\ndef blocking():\n    time.sleep(0.2)\n    return "ok"\n\nasync def main():\n    result = await asyncio.to_thread(blocking)\n    print(result)\n\nasyncio.run(main())`,
        ["The loop stays responsive during the sleep."],
      ],
    ],
    mistakes: [
      "Expecting cancellation to stop the thread.",
      "Using threads to speed up CPU-bound loops.",
    ],
    follow: ["When would you use a process pool executor instead?"],
    points: [
      "to_thread runs blocking code in a thread",
      "run_in_executor accepts any executor",
      "Threads for blocking I/O",
      "Processes for CPU-bound work",
    ],
    notes: ["Offload, then await."],
    src: [
      ["Python: asyncio.to_thread", `${D}/library/asyncio-task.html`],
      ["Python: loop.run_in_executor", `${D}/library/asyncio-eventloop.html`],
    ],
  }),
  q({
    slug: "asyncio-debug-mode",
    topic: "Event loop",
    d: "medium",
    title:
      "How do you debug async programs, and what does asyncio's debug mode report?",
    kw: [
      "asyncio debug mode",
      "slow callback",
      "never awaited",
      "PYTHONASYNCIODEBUG",
      "dev mode",
    ],
    intent: "Checks tooling knowledge for async bugs.",
    short:
      "Enable debug mode with `asyncio.run(main(), debug=True)`, the environment variable `PYTHONASYNCIODEBUG=1`, or Python's development mode `-X dev`. In debug mode asyncio logs callbacks and tasks that take longer than `loop.slow_callback_duration` (100 ms by default), which points to blocking code; it reports coroutines that were created but never awaited; it warns about non-thread-safe calls to the loop from other threads; and it shows where unhandled task exceptions originated. Also set the `asyncio` logger to `DEBUG` to see more. Debug mode adds overhead, so use it in development and tests.",
    detail: [
      "Messages such as 'coroutine was never awaited' are among the most useful clues.",
      "Task names (`name=` in `create_task`) make logs easier to read.",
      "Use `asyncio.all_tasks()` to inspect what is still running.",
    ],
    ex: "Debug mode shows 'Executing <Task ...> took 0.52 seconds', revealing a synchronous call in a handler.",
    mistakes: [
      "Leaving debug mode on in production.",
      "Ignoring never-awaited warnings.",
    ],
    follow: ["How do you find a call that blocks the loop?"],
    points: [
      "debug=True, env var or -X dev",
      "Slow callback logging",
      "Never-awaited coroutine warnings",
      "Development use only",
    ],
    notes: ["Turn on debug while developing."],
    src: [
      [
        "Python: Developing with asyncio (debug mode)",
        `${D}/library/asyncio-dev.html`,
      ],
      ["Python: asyncio.all_tasks", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "get-running-loop",
    topic: "Event loop",
    d: "medium",
    title: "How do you get the current event loop safely?",
    kw: [
      "get_running_loop",
      "get_event_loop",
      "event loop access",
      "call_soon_threadsafe",
      "run_coroutine_threadsafe",
    ],
    intent: "Checks use of loop access APIs.",
    short:
      "Inside a coroutine or callback, use `asyncio.get_running_loop()`, which returns the loop running in the current thread and raises `RuntimeError` if there is none. This is the recommended API. The older `get_event_loop()` has had changing behaviour across Python versions when no loop is running, so avoid it in new code. From another thread, never call loop methods directly; use `loop.call_soon_threadsafe(callback)` or `asyncio.run_coroutine_threadsafe(coro, loop)`, which is the safe way to hand work to a loop that runs in a different thread.",
    detail: [
      "Most code never needs the loop object; `asyncio.create_task` and friends find it themselves.",
      "Each thread needs its own event loop if it runs async code.",
      "Loop objects are not thread-safe.",
    ],
    ex: "A worker thread posts a result back to the async application using `run_coroutine_threadsafe`.",
    mistakes: [
      "Calling loop methods from other threads.",
      "Using get_event_loop() in new code.",
    ],
    follow: ["What does run_coroutine_threadsafe return?"],
    points: [
      "get_running_loop inside async code",
      "RuntimeError if none running",
      "Threadsafe variants for other threads",
      "Loops are not thread-safe",
    ],
    notes: ["Ask the running loop, not a default."],
    src: [
      [
        "Python: asyncio.get_running_loop",
        `${D}/library/asyncio-eventloop.html`,
      ],
      [
        "Python: asyncio.run_coroutine_threadsafe",
        `${D}/library/asyncio-task.html`,
      ],
    ],
  }),
  q({
    slug: "coroutine-function-versus-coroutine-object",
    topic: "async/await",
    d: "easy",
    title: "What does calling an `async def` function actually return?",
    kw: [
      "coroutine",
      "async def",
      "coroutine object",
      "await",
      "never awaited",
    ],
    intent: "A basic async concept often confused.",
    short:
      "Defining a function with `async def` makes a coroutine function. Calling it does not run its body; it returns a coroutine object, a suspended computation. The body runs only when the coroutine is awaited (`await fetch()`) or scheduled as a task (`asyncio.create_task(fetch())`), or passed to `asyncio.run`. If you call it and discard the result, Python warns `RuntimeWarning: coroutine 'fetch' was never awaited`, and nothing happens. Coroutines, tasks and futures are the awaitable objects that `await` accepts.",
    detail: [
      "`inspect.iscoroutinefunction(f)` tells whether `f` is `async def`.",
      "A coroutine can be awaited only once.",
      "PEP 492 introduced the `async`/`await` syntax.",
    ],
    ex: "Writing `fetch()` without `await` in a handler and wondering why no request was made.",
    code: [
      [
        "Calling does not run",
        "python",
        `import asyncio\n\nasync def greet():\n    print("hello")\n    return 42\n\nc = greet()          # nothing printed yet\nprint(type(c))       # <class 'coroutine'>\nprint(asyncio.run(c)) # hello, then 42`,
        ["Creating the coroutine does not execute the body."],
      ],
    ],
    mistakes: [
      "Forgetting await.",
      "Awaiting the same coroutine object twice.",
    ],
    follow: ["What are the main awaitable types?"],
    points: [
      "async def returns a coroutine object",
      "Body runs when awaited or scheduled",
      "Missing await gives a warning",
      "Awaitables: coroutines, tasks, futures",
    ],
    notes: ["Calling creates; awaiting runs."],
    src: [
      ["Python: Coroutines and tasks", `${D}/library/asyncio-task.html`],
      ["PEP 492: Coroutines with async and await syntax", `${PEP}/pep-0492/`],
    ],
  }),
  q({
    slug: "await-rules-and-awaitables",
    topic: "async/await",
    d: "easy",
    title: "Where can you use `await`, and what can you await?",
    kw: ["await keyword", "awaitable", "task", "future", "async def only"],
    intent: "Checks the rules of await.",
    short:
      "`await` can be used only inside an `async def` function (or at the top level of an async-aware shell such as the asyncio REPL), where it suspends the current coroutine until the awaited object completes and gives the event loop a chance to run other tasks. You can await any awaitable: a coroutine, a `Task` or a `Future`, or any object implementing `__await__`. It evaluates to the awaited result or raises its exception. Awaiting is what allows concurrency: while one coroutine waits, others run. Using `await` in a regular function is a `SyntaxError`.",
    detail: [
      "`await` does not by itself run things concurrently; sequential awaits run one after another.",
      "`asyncio.sleep(0)` yields control without waiting.",
      "Async functions can call normal functions freely, but not the reverse without `asyncio.run`.",
    ],
    ex: "`data = await reader.read(100)` suspends until bytes arrive.",
    mistakes: [
      "Using await in a normal function.",
      "Awaiting something that is not awaitable.",
    ],
    follow: ["Does await make code run concurrently by itself?"],
    points: [
      "Only inside async def",
      "Awaits coroutines, tasks, futures",
      "Suspends and lets others run",
      "Returns the result or raises",
    ],
    notes: ["Suspend until ready."],
    src: [
      [
        "Python: Coroutines and tasks (awaitables)",
        `${D}/library/asyncio-task.html`,
      ],
      ["Python: Expressions (await)", `${D}/reference/expressions.html`],
    ],
  }),
  q({
    slug: "forgetting-await-never-awaited-warning",
    topic: "async/await",
    d: "easy",
    title:
      "What does the warning 'coroutine ... was never awaited' mean, and how do you fix it?",
    kw: [
      "never awaited",
      "runtimewarning",
      "missing await",
      "create_task",
      "silent failure",
    ],
    intent: "Checks diagnosing the most common async bug.",
    short:
      "It means a coroutine object was created but never run: you called an `async def` function without `await`, or without scheduling it with `asyncio.create_task`. The call returned a coroutine, which was discarded when it went out of scope, so the code inside never executed and the program may seem to do nothing. Fix by adding `await`, or by wrapping the call in a task if it should run in the background (and keeping a reference to the task). Linters and type checkers such as mypy flag the pattern, and asyncio debug mode reports where the coroutine was created.",
    detail: [
      "Assigning the coroutine to a variable and never awaiting it gives the same warning.",
      "A common source is forgetting `await` before an async method of a client library.",
      "The warning appears when the object is garbage collected, so its timing can be confusing.",
    ],
    ex: "`session.close()` in an async library returns a coroutine; without `await` the session is never closed.",
    mistakes: [
      "Ignoring the warning.",
      "Wrapping in a task but not keeping a reference.",
    ],
    follow: ["How can you detect this earlier?"],
    points: [
      "Coroutine created but not run",
      "Add await or create_task",
      "Keep task references",
      "Debug mode and type checkers help",
    ],
    notes: ["Create, then run it."],
    src: [
      [
        "Python: Developing with asyncio (detect never-awaited coroutines)",
        `${D}/library/asyncio-dev.html`,
      ],
      ["Python: Coroutines and tasks", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "async-for-and-async-with",
    topic: "async/await",
    d: "medium",
    title: "What are `async for` and `async with`, and when do you need them?",
    kw: [
      "async for",
      "async with",
      "__aiter__",
      "__aenter__",
      "asynchronous iterator",
    ],
    intent: "Checks the async versions of loops and context managers.",
    short:
      "`async with` is the asynchronous context manager: it awaits `__aenter__` and `__aexit__`, so setup and cleanup can themselves wait on I/O, as when acquiring a database connection or closing a network session. `async for` iterates over an asynchronous iterator, whose `__anext__` method is awaited at each step, so fetching the next item (a row, a message, a chunk) can suspend the task. Both are allowed only inside `async def`. Use them whenever a library documents an async context manager or async iterator, and use plain `with`/`for` for ordinary objects.",
    detail: [
      "`contextlib.asynccontextmanager` builds async context managers from async generators.",
      "Async iterators raise `StopAsyncIteration` at the end.",
      "You can mix: a regular `for` over a list inside an `async def` is fine.",
    ],
    ex: "`async with pool.acquire() as conn:` followed by `async for row in conn.cursor(...)`.",
    code: [
      [
        "Async iterator and context manager",
        "python",
        `import asyncio\nfrom contextlib import asynccontextmanager\n\n@asynccontextmanager\nasync def session():\n    print("open")\n    try:\n        yield "s"\n    finally:\n        print("close")\n\nasync def ticker(n):\n    for i in range(n):\n        await asyncio.sleep(0)\n        yield i\n\nasync def main():\n    async with session() as s:\n        async for i in ticker(3):\n            print(s, i)\n\nasyncio.run(main())`,
        [
          "`async with` awaits setup and teardown.",
          "`async for` awaits each next item.",
        ],
      ],
    ],
    mistakes: [
      "Using a normal for loop over an async iterator.",
      "Using async with outside async def.",
    ],
    follow: ["Which methods define an async context manager?"],
    points: [
      "async with: __aenter__/__aexit__",
      "async for: __aiter__/__anext__",
      "Only inside async def",
      "asynccontextmanager helper",
    ],
    notes: ["Async setup, async iteration."],
    src: [
      [
        "Python: Compound statements (async for, async with)",
        `${D}/reference/compound_stmts.html`,
      ],
      [
        "Python: contextlib.asynccontextmanager",
        `${D}/library/contextlib.html`,
      ],
    ],
  }),
  q({
    slug: "async-generators",
    topic: "async/await",
    d: "hard",
    title: "What is an async generator?",
    kw: [
      "async generator",
      "async yield",
      "aclose",
      "pep 525",
      "stream of values",
    ],
    intent: "Checks advanced async syntax.",
    short:
      "An async generator is an `async def` function that contains `yield`. Calling it returns an asynchronous generator object that you consume with `async for`, and inside the function you can `await` between yields. It is ideal for producing a stream of values whose generation involves waiting, such as pages from an API or messages from a socket, without collecting everything first. PEP 525 introduced it. Like normal generators, it can be closed early with `aclose()`; if you break out of an `async for` early, close it explicitly or use `contextlib.aclosing` so cleanup in `finally` blocks runs promptly.",
    detail: [
      "A `return` with a value is not allowed in an async generator.",
      "Async comprehensions `[x async for x in agen()]` collect the values.",
      "Async generators are not awaited directly; they are iterated.",
    ],
    ex: "Yielding each page of results from a paginated API as it arrives.",
    code: [
      [
        "Async generator",
        "python",
        `import asyncio\n\nasync def pages(n):\n    for i in range(n):\n        await asyncio.sleep(0.01)   # pretend to fetch\n        yield f"page {i}"\n\nasync def main():\n    async for p in pages(3):\n        print(p)\n    print([p async for p in pages(2)])\n\nasyncio.run(main())`,
        [
          "`yield` inside `async def` makes an async generator.",
          "Consume it with `async for`.",
        ],
      ],
    ],
    mistakes: [
      "Breaking out of async for without closing the generator.",
      "Trying to use a normal for loop on it.",
    ],
    follow: ["How do you ensure cleanup after an early break?"],
    points: [
      "async def with yield",
      "Consumed with async for",
      "aclose() for early exit",
      "Defined by PEP 525",
    ],
    notes: ["Streams with waiting."],
    src: [
      ["PEP 525: Asynchronous generators", `${PEP}/pep-0525/`],
      ["Python: contextlib.aclosing", `${D}/library/contextlib.html`],
    ],
  }),
  q({
    slug: "sequential-versus-concurrent-awaits",
    topic: "async/await",
    d: "easy",
    title:
      "Why is `await a(); await b()` not concurrent, and how do you run them together?",
    kw: [
      "sequential await",
      "concurrent await",
      "gather",
      "create_task",
      "total time",
    ],
    intent: "Checks the most important performance idea in async code.",
    short:
      "Each `await` waits for its operation to finish before the next line runs, so `await fetch(1); await fetch(2)` takes the sum of both durations even in async code. To overlap them, schedule both before waiting: `await asyncio.gather(fetch(1), fetch(2))`, or create tasks with `asyncio.create_task` and await them afterwards, or use a `TaskGroup` (3.11+). With two one-second operations the sequential version takes about 2 seconds and the concurrent one about 1 second. Async code is concurrent only where you explicitly start things together.",
    detail: [
      "Use a semaphore to limit how many run at once.",
      "Results from `gather` come back in the order you passed the awaitables.",
      "Concurrency does not help if the work is CPU-bound.",
    ],
    ex: "Fetching ten URLs one by one takes ten times as long as fetching them together.",
    code: [
      [
        "Sequential versus concurrent",
        "python",
        `import asyncio, time\n\nasync def fetch(n):\n    await asyncio.sleep(1)\n    return n\n\nasync def main():\n    t = time.perf_counter()\n    await fetch(1); await fetch(2)\n    print("sequential", round(time.perf_counter() - t))   # 2\n    t = time.perf_counter()\n    await asyncio.gather(fetch(1), fetch(2))\n    print("concurrent", round(time.perf_counter() - t))   # 1\n\nasyncio.run(main())`,
        ["The first pair waits twice.", "`gather` overlaps the waits."],
      ],
    ],
    mistakes: [
      "Awaiting in a loop and expecting concurrency.",
      "Starting thousands of tasks with no limit.",
    ],
    follow: ["How do you limit how many run at once?"],
    points: [
      "await waits to completion",
      "Sequential awaits add up",
      "gather or tasks overlap them",
      "Limit with a semaphore",
    ],
    notes: ["Start together, then wait."],
    src: [
      ["Python: asyncio.gather", `${D}/library/asyncio-task.html`],
      ["Python: Coroutines and tasks", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "create-task-background-work",
    topic: "Tasks",
    d: "medium",
    title:
      "What does `asyncio.create_task` do, and how is a task different from a coroutine?",
    kw: [
      "create_task",
      "task",
      "background task",
      "scheduling",
      "fire and forget",
    ],
    intent: "Checks understanding of tasks.",
    short:
      "A coroutine is just a suspended computation; a `Task` wraps a coroutine and schedules it on the event loop so it starts running soon, concurrently with the code that created it. `asyncio.create_task(coro())` returns the task immediately, without waiting. You can later `await` the task to get its result or exception, call `cancel()`, add done callbacks, or give it a `name` for debugging. Tasks are how you run things in the background and overlap waiting. The caller must keep a reference to each task, because the loop holds only weak references and an unreferenced task can be garbage collected before it finishes.",
    detail: [
      "A created task begins running at the next opportunity when the current task yields.",
      "Exceptions in a task you never await are only reported when it is garbage collected.",
      "`asyncio.all_tasks()` lists the running tasks.",
    ],
    ex: "Starting a background cache-refresh task while the main handler continues.",
    code: [
      [
        "Tasks overlap",
        "python",
        `import asyncio\n\nasync def work(name):\n    await asyncio.sleep(0.1)\n    return name\n\nasync def main():\n    t1 = asyncio.create_task(work("a"), name="job-a")\n    t2 = asyncio.create_task(work("b"), name="job-b")\n    print(await t1, await t2)   # a b\n\nasyncio.run(main())`,
        ["Both tasks run as soon as `main` first yields."],
      ],
    ],
    mistakes: [
      "Not keeping references to tasks.",
      "Never awaiting tasks, so errors go unseen.",
    ],
    follow: ["Why must you keep a reference to a task?"],
    points: [
      "Task schedules a coroutine",
      "Returns immediately",
      "Await it for the result",
      "Keep a reference",
    ],
    notes: ["Tasks run in the background."],
    src: [
      ["Python: asyncio.create_task", `${D}/library/asyncio-task.html`],
      ["Python: Task objects", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "task-references-and-garbage-collection",
    topic: "Tasks",
    d: "hard",
    title:
      "Why can a fire-and-forget task disappear, and how do you prevent it?",
    kw: [
      "task reference",
      "weak reference",
      "garbage collected",
      "background tasks set",
      "fire and forget",
    ],
    intent: "Checks a subtle but documented pitfall.",
    short:
      "The event loop keeps only weak references to tasks, so if your code does not hold a strong reference, a pending task can be garbage collected before it finishes, and it silently stops. The `create_task` documentation says to save a reference to the result. A common pattern is a module-level or object-level set: add the task, and register `task.add_done_callback(tasks.discard)` so it removes itself on completion. A `TaskGroup` also holds references to its tasks for you. Also make sure the task's exceptions are observed, by awaiting it or inspecting it in a done callback.",
    detail: [
      "The symptom is work that sometimes never finishes, with no error.",
      "Await the saved tasks during shutdown so they complete or are cancelled cleanly.",
      "Name tasks so logs identify them.",
    ],
    ex: "A cache-warming task started with `create_task(...)` and never stored randomly stops partway.",
    code: [
      [
        "Keeping references",
        "python",
        `import asyncio\n\nbackground = set()\n\ndef spawn(coro):\n    task = asyncio.create_task(coro)\n    background.add(task)\n    task.add_done_callback(background.discard)\n    return task\n\nasync def main():\n    spawn(asyncio.sleep(0.1))\n    await asyncio.gather(*background)\n\nasyncio.run(main())`,
        ["The set keeps tasks alive.", "The callback removes finished ones."],
      ],
    ],
    mistakes: [
      "Calling create_task and discarding the result.",
      "Not awaiting background tasks at shutdown.",
    ],
    follow: ["Which structure keeps task references for you?"],
    points: [
      "Loop holds weak references",
      "Store tasks in a set",
      "Done callback discards them",
      "TaskGroup also keeps them",
    ],
    notes: ["Hold on to your tasks."],
    src: [
      [
        "Python: asyncio.create_task (save a reference)",
        `${D}/library/asyncio-task.html`,
      ],
      ["Python: Task groups", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "asyncio-gather-and-errors",
    topic: "Tasks",
    d: "medium",
    title:
      "How does `asyncio.gather` behave, including when one awaitable fails?",
    kw: [
      "asyncio.gather",
      "return_exceptions",
      "result order",
      "exception propagation",
      "concurrent awaitables",
    ],
    intent: "Checks a very common API and its error semantics.",
    short:
      "`asyncio.gather(*aws)` runs the awaitables concurrently, wrapping coroutines in tasks, and returns a list of results in the same order as the arguments. If one raises and `return_exceptions` is `False` (the default), the first exception propagates to the code awaiting `gather`, but the other awaitables are not cancelled and keep running. With `return_exceptions=True`, exceptions are returned in the result list alongside the successes, so you can inspect each. If the `gather` itself is cancelled, all its children are cancelled. For stricter cleanup and clearer errors, prefer a `TaskGroup` on Python 3.11+.",
    detail: [
      "You can pass already-created tasks too.",
      "Check each result with `isinstance(result, Exception)` when using `return_exceptions=True`.",
      "Gather does not limit concurrency; add a semaphore for large inputs.",
    ],
    ex: "Fetching profile, orders and recommendations in parallel for one page.",
    code: [
      [
        "return_exceptions",
        "python",
        `import asyncio\n\nasync def ok():\n    return 1\n\nasync def bad():\n    raise ValueError("no")\n\nasync def main():\n    results = await asyncio.gather(ok(), bad(), return_exceptions=True)\n    print(results)   # [1, ValueError('no')]\n\nasyncio.run(main())`,
        ["The exception is returned as a value."],
      ],
    ],
    mistakes: [
      "Assuming a failure cancels the other tasks.",
      "Gathering thousands of coroutines at once.",
    ],
    follow: ["What does return_exceptions=True change?"],
    points: [
      "Concurrent, ordered results",
      "First exception propagates",
      "Others keep running",
      "return_exceptions returns errors as values",
    ],
    notes: ["Fan out, collect in order."],
    src: [
      ["Python: asyncio.gather", `${D}/library/asyncio-task.html`],
      ["Python: Coroutines and tasks", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "taskgroup-structured-concurrency",
    topic: "Tasks",
    d: "hard",
    title:
      "What is `asyncio.TaskGroup`, and why is it preferred over `gather`?",
    kw: [
      "TaskGroup",
      "structured concurrency",
      "async with",
      "exception group",
      "python 3.11",
    ],
    intent: "Checks modern async patterns.",
    short:
      "`asyncio.TaskGroup` (Python 3.11+) is an async context manager for structured concurrency: `async with asyncio.TaskGroup() as tg: tg.create_task(work())`. The `async with` block does not exit until all its tasks finish, so tasks cannot outlive their scope. If any task fails, the remaining tasks are cancelled and the group raises an `ExceptionGroup` containing the failures, which you handle with `except*`. This gives clearer lifetimes, no leaked tasks and no silently ignored errors, which is why it is documented as having stronger safety guarantees than `gather`. The trade-off is that you handle exception groups.",
    detail: [
      "The group holds references to its tasks.",
      "Results are read from the task objects (`task.result()`) after the block.",
      "Cancelling the surrounding task cancels the group's tasks.",
    ],
    ex: "Fetching several resources where any failure should cancel the rest and be reported together.",
    code: [
      [
        "TaskGroup",
        "python",
        `import asyncio\n\nasync def job(n):\n    await asyncio.sleep(0.05)\n    return n * 2\n\nasync def main():\n    async with asyncio.TaskGroup() as tg:\n        t1 = tg.create_task(job(1))\n        t2 = tg.create_task(job(2))\n    print(t1.result(), t2.result())   # 2 4\n\nasyncio.run(main())`,
        [
          "The block waits for both tasks.",
          "Results are available afterwards.",
        ],
      ],
    ],
    mistakes: [
      "Using it on Python older than 3.11.",
      "Catching ExceptionGroup with plain except for specific errors.",
    ],
    follow: ["What happens to sibling tasks if one fails?"],
    points: [
      "Async context manager (3.11+)",
      "Waits for all tasks at exit",
      "Failure cancels siblings",
      "Raises ExceptionGroup",
    ],
    notes: ["Tasks live inside the block."],
    src: [
      ["Python: Task groups", `${D}/library/asyncio-task.html`],
      ["Python: Exception groups", `${D}/library/exceptions.html`],
    ],
  }),
  q({
    slug: "task-cancellation-and-cancellederror",
    topic: "Tasks",
    d: "hard",
    title:
      "How does task cancellation work, and why must `CancelledError` not be swallowed?",
    kw: [
      "task.cancel",
      "CancelledError",
      "shield",
      "cleanup finally",
      "cancellation",
    ],
    intent: "Checks careful handling of cancellation.",
    short:
      "`task.cancel()` requests cancellation: at the task's next `await`, `asyncio.CancelledError` is raised inside the coroutine. The task can use `try`/`finally` to clean up, and then the error should propagate so the task ends as cancelled. `CancelledError` derives from `BaseException` (since 3.8), so `except Exception` does not catch it; but a bare `except:` or `except BaseException` would. Swallowing it breaks timeouts and `TaskGroup`, which rely on cancellation to stop work. If you catch it to do cleanup, re-raise it. `asyncio.shield(aw)` protects an inner awaitable from cancellation of the outer one.",
    detail: [
      "Awaiting a cancelled task raises `CancelledError` in the awaiter.",
      "Cancellation is cooperative: code that never awaits cannot be cancelled.",
      "Long cleanup in a cancelled task can itself be cancelled again.",
    ],
    ex: "Cancelling a download task closes the connection in a `finally` block.",
    code: [
      [
        "Cleanup and re-raise",
        "python",
        `import asyncio\n\nasync def worker():\n    try:\n        await asyncio.sleep(10)\n    except asyncio.CancelledError:\n        print("cleaning up")\n        raise            # let it end as cancelled\n\nasync def main():\n    t = asyncio.create_task(worker())\n    await asyncio.sleep(0.1)\n    t.cancel()\n    try:\n        await t\n    except asyncio.CancelledError:\n        print("worker cancelled")\n\nasyncio.run(main())`,
        ["The worker cleans up, then re-raises."],
      ],
    ],
    mistakes: [
      "Catching CancelledError and continuing.",
      "Using bare except in async code.",
    ],
    follow: ["What base class is CancelledError?"],
    points: [
      "cancel() raises CancelledError at an await",
      "BaseException subclass",
      "Clean up and re-raise",
      "shield protects inner work",
    ],
    notes: ["Clean up, then re-raise."],
    src: [
      ["Python: Task cancellation", `${D}/library/asyncio-task.html`],
      ["Python: asyncio exceptions", `${D}/library/asyncio-exceptions.html`],
    ],
  }),
  q({
    slug: "asyncio-timeouts",
    topic: "Tasks",
    d: "medium",
    title: "How do you put a time limit on an async operation?",
    kw: [
      "asyncio.timeout",
      "wait_for",
      "TimeoutError",
      "deadline",
      "cancellation on timeout",
    ],
    intent: "Checks use of timeouts.",
    short:
      "Use `async with asyncio.timeout(seconds):` (Python 3.11+) to bound a block of awaits; if the time runs out, the block is cancelled and `TimeoutError` is raised. `asyncio.wait_for(aw, timeout)` bounds a single awaitable: on timeout it cancels the inner task and raises `TimeoutError`. Always set timeouts on network operations, since a peer that never answers would otherwise suspend a task forever. Handle `TimeoutError` to retry, fall back or report. Note that the cancelled work must handle `CancelledError` properly so cleanup runs, and a timeout only works at `await` points.",
    detail: [
      "`asyncio.timeout_at` takes an absolute deadline.",
      "Older versions rely on `wait_for` only.",
      "Combine timeouts with retries and back-off for flaky services.",
    ],
    ex: "Giving an external API call at most three seconds before using cached data.",
    code: [
      [
        "timeout",
        "python",
        `import asyncio\n\nasync def slow():\n    await asyncio.sleep(5)\n\nasync def main():\n    try:\n        async with asyncio.timeout(0.1):\n            await slow()\n    except TimeoutError:\n        print("too slow")\n\nasyncio.run(main())`,
        ["The block is cancelled after 0.1 s."],
      ],
    ],
    mistakes: [
      "Calling network operations without any timeout.",
      "Expecting a timeout to interrupt blocking synchronous code.",
    ],
    follow: ["What happens to the inner work on timeout?"],
    points: [
      "asyncio.timeout block (3.11+)",
      "wait_for for one awaitable",
      "TimeoutError on expiry",
      "Inner work is cancelled",
    ],
    notes: ["Never wait forever."],
    src: [
      ["Python: asyncio.timeout", `${D}/library/asyncio-task.html`],
      ["Python: asyncio.wait_for", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "asyncio-wait-and-as-completed",
    topic: "Tasks",
    d: "medium",
    title:
      "How do `asyncio.wait` and `asyncio.as_completed` differ from `gather`?",
    kw: [
      "asyncio.wait",
      "as_completed",
      "FIRST_COMPLETED",
      "done pending",
      "completion order",
    ],
    intent: "Checks handling results as they arrive.",
    short:
      "`gather` returns all results at once in input order. `asyncio.as_completed(aws)` yields awaitables in the order they finish, so you can process each result as soon as it is ready, for example to update progress. `asyncio.wait(tasks, return_when=...)` waits until a condition is met (`ALL_COMPLETED`, `FIRST_COMPLETED` or `FIRST_EXCEPTION`) and returns two sets, `done` and `pending`, without cancelling the pending ones; you decide what to do with them. In current Python versions `wait` must be given tasks (or futures), not bare coroutines. Use `wait` for patterns like 'first result wins, then cancel the rest'.",
    detail: [
      "Remember to cancel pending tasks you no longer need.",
      "Retrieve results or exceptions from the done tasks.",
      "A timeout argument returns the sets without raising.",
    ],
    ex: "Querying three mirrors and using whichever answers first.",
    code: [
      [
        "First completed",
        "python",
        `import asyncio\n\nasync def reply(name, delay):\n    await asyncio.sleep(delay)\n    return name\n\nasync def main():\n    tasks = [asyncio.create_task(reply("slow", 0.3)),\n             asyncio.create_task(reply("fast", 0.05))]\n    done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)\n    print(done.pop().result())   # fast\n    for t in pending:\n        t.cancel()\n\nasyncio.run(main())`,
        [
          "`wait` returns as soon as one finishes.",
          "The slower task is cancelled.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to cancel pending tasks.",
      "Passing bare coroutines to wait.",
    ],
    follow: ["What does as_completed yield?"],
    points: [
      "gather: all results in order",
      "as_completed: in finishing order",
      "wait: done and pending sets",
      "Cancel what you don't need",
    ],
    notes: ["Race or stream the results."],
    src: [
      ["Python: asyncio.wait", `${D}/library/asyncio-task.html`],
      ["Python: asyncio.as_completed", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "unretrieved-task-exceptions",
    topic: "Tasks",
    d: "medium",
    title: "What does 'Task exception was never retrieved' mean?",
    kw: [
      "task exception never retrieved",
      "error handling tasks",
      "done callback",
      "silent failure",
      "background task errors",
    ],
    intent: "Checks handling errors in background tasks.",
    short:
      "If a task finishes with an exception and nobody ever awaits it or calls `task.result()` or `task.exception()`, asyncio logs 'Task exception was never retrieved' when the task is garbage collected. It means an error was raised in background work and was effectively ignored. Handle it by awaiting the task at an appropriate time, by adding a done callback that inspects the outcome and logs the exception, or by wrapping the task's body in `try`/`except` that logs errors. Using a `TaskGroup` ensures failures propagate to the enclosing code instead of vanishing.",
    detail: [
      "Fire-and-forget tasks need explicit error logging.",
      "A done callback receives the finished task: `task.exception()` returns the error or `None`.",
      "Debug mode shows where the task was created.",
    ],
    ex: "A background email-sending task fails with a network error and no one notices until the log appears.",
    code: [
      [
        "Log errors from a callback",
        "python",
        `import asyncio\n\ndef report(task):\n    if not task.cancelled() and task.exception():\n        print("task failed:", task.exception())\n\nasync def boom():\n    raise RuntimeError("bad")\n\nasync def main():\n    t = asyncio.create_task(boom())\n    t.add_done_callback(report)\n    await asyncio.sleep(0.1)\n\nasyncio.run(main())`,
        ["The callback inspects the task outcome."],
      ],
    ],
    mistakes: [
      "Never looking at background task results.",
      "Calling exception() on a cancelled task.",
    ],
    follow: ["How does a TaskGroup help?"],
    points: [
      "Error occurred and nobody looked",
      "Await or add done callback",
      "Log inside the task",
      "TaskGroup propagates failures",
    ],
    notes: ["Look at every task's outcome."],
    src: [
      [
        "Python: Developing with asyncio (detect never-retrieved exceptions)",
        `${D}/library/asyncio-dev.html`,
      ],
      ["Python: Task.exception", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "asyncio-streams-tcp-client",
    topic: "Async I/O",
    d: "medium",
    title:
      "How do you write a simple TCP client or server with asyncio streams?",
    kw: [
      "asyncio streams",
      "open_connection",
      "start_server",
      "StreamReader",
      "drain",
    ],
    intent: "Checks practical async I/O.",
    short:
      "The streams API gives high-level, awaitable network I/O. A client does `reader, writer = await asyncio.open_connection(host, port)`, sends with `writer.write(data)` followed by `await writer.drain()` (which applies back-pressure), reads with `await reader.readline()` or `await reader.read(n)`, and finishes with `writer.close()` and `await writer.wait_closed()`. A server uses `await asyncio.start_server(handler, host, port)` where `handler(reader, writer)` is a coroutine run once per connection, so many clients are served concurrently on one thread. Data is bytes, so encode and decode text.",
    detail: [
      "`reader.readexactly(n)` and `readuntil(separator)` help with framing.",
      "Wrap reads in `asyncio.timeout` so a silent peer cannot hold a task forever.",
      "For HTTP use a library built on these primitives rather than raw sockets.",
    ],
    ex: "An echo server that reads a line from each client and writes it back.",
    code: [
      [
        "Echo server",
        "python",
        `import asyncio\n\nasync def handle(reader, writer):\n    data = await reader.readline()\n    writer.write(data)\n    await writer.drain()\n    writer.close()\n    await writer.wait_closed()\n\nasync def main():\n    server = await asyncio.start_server(handle, "127.0.0.1", 8888)\n    async with server:\n        await server.serve_forever()\n\n# asyncio.run(main())`,
        [
          "`handle` runs once per client connection.",
          "`drain` waits when the buffer is full.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting await writer.drain().",
      "Sending str instead of bytes.",
    ],
    follow: ["What does drain do?"],
    points: [
      "open_connection and start_server",
      "write then await drain",
      "Close and wait_closed",
      "Data is bytes",
    ],
    notes: ["Awaitable sockets."],
    src: [
      ["Python: asyncio streams", `${D}/library/asyncio-stream.html`],
      ["Python: asyncio.start_server", `${D}/library/asyncio-stream.html`],
    ],
  }),
  q({
    slug: "asyncio-queue-producer-consumer",
    topic: "Async I/O",
    d: "medium",
    title:
      "How do you build a producer-consumer pipeline with `asyncio.Queue`?",
    kw: [
      "asyncio.Queue",
      "producer consumer",
      "task_done",
      "backpressure",
      "worker tasks",
    ],
    intent: "Checks coordination of tasks.",
    short:
      "`asyncio.Queue` is the async counterpart of `queue.Queue`: `await queue.put(item)` waits if a bounded queue is full (back-pressure), `await queue.get()` waits if it is empty, and `task_done()` plus `await queue.join()` track completion. Start a fixed number of consumer tasks that loop on `get()`, have producers `put` work, wait for `join()`, then cancel the consumers. This limits concurrency and decouples producing from processing. The asyncio queue is not thread-safe, so do not use it from other threads; it is meant for tasks in the same event loop.",
    detail: [
      "`put_nowait` and `get_nowait` raise `QueueFull` and `QueueEmpty`.",
      "`PriorityQueue` and `LifoQueue` variants exist.",
      "A sentinel value can signal shutdown instead of cancellation.",
    ],
    ex: "A crawler where producers add URLs and ten consumers download them.",
    code: [
      [
        "Workers and join",
        "python",
        `import asyncio\n\nasync def worker(q):\n    while True:\n        item = await q.get()\n        print("handled", item)\n        q.task_done()\n\nasync def main():\n    q = asyncio.Queue(maxsize=5)\n    workers = [asyncio.create_task(worker(q)) for _ in range(3)]\n    for i in range(6):\n        await q.put(i)\n    await q.join()\n    for w in workers:\n        w.cancel()\n\nasyncio.run(main())`,
        [
          "`join` waits until every item is marked done.",
          "Workers are cancelled afterwards.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting task_done, so join hangs.",
      "Using asyncio.Queue across threads.",
    ],
    follow: ["What does maxsize provide?"],
    points: [
      "put and get are awaitable",
      "Bounded queue gives back-pressure",
      "task_done and join",
      "Not thread-safe",
    ],
    notes: ["Decouple producing from consuming."],
    src: [
      ["Python: asyncio queues", `${D}/library/asyncio-queue.html`],
      ["Python: queue", `${D}/library/queue.html`],
    ],
  }),
  q({
    slug: "asyncio-lock-event-semaphore",
    topic: "Async I/O",
    d: "medium",
    title:
      "Do you need locks in async code, and what are `asyncio.Lock`, `Event` and `Semaphore` for?",
    kw: [
      "asyncio.Lock",
      "asyncio.Semaphore",
      "asyncio.Event",
      "shared state",
      "limit concurrency",
    ],
    intent: "Checks synchronisation in async programs.",
    short:
      "Because tasks switch only at `await`, code between awaits runs without interruption, so many operations on shared data are safe without locks. But if a critical section contains an `await`, another task can run in the middle and see half-updated state; then use `asyncio.Lock` with `async with lock:`. `asyncio.Event` lets tasks wait for a signal, and `asyncio.Semaphore(n)` limits how many tasks run a section at once, such as capping concurrent HTTP requests. These primitives are for tasks in one event loop and are not thread-safe, and they are different objects from the `threading` ones.",
    detail: [
      "`Condition`, `BoundedSemaphore` and (3.11+) `Barrier` also exist.",
      "Holding a lock across a slow `await` serialises the tasks.",
      "Using `threading.Lock` in async code can block the whole loop.",
    ],
    ex: "A cache refresh protected by an `asyncio.Lock` so only one task fetches while others wait.",
    code: [
      [
        "Limit with Semaphore",
        "python",
        `import asyncio\n\nsem = asyncio.Semaphore(2)\n\nasync def fetch(i):\n    async with sem:\n        await asyncio.sleep(0.1)\n        return i\n\nasync def main():\n    print(await asyncio.gather(*(fetch(i) for i in range(6))))\n\nasyncio.run(main())   # runs two at a time`,
        ["Only two tasks hold the semaphore at once."],
      ],
    ],
    mistakes: [
      "Using threading.Lock in async code.",
      "Holding a lock during a long network wait.",
    ],
    follow: ["When is a lock unnecessary in async code?"],
    points: [
      "Switches only at await",
      "Lock when an await splits a critical section",
      "Semaphore limits concurrency",
      "Not thread-safe",
    ],
    notes: ["Locks matter around awaits."],
    src: [
      [
        "Python: asyncio synchronization primitives",
        `${D}/library/asyncio-sync.html`,
      ],
      ["Python: asyncio.Semaphore", `${D}/library/asyncio-sync.html`],
    ],
  }),
  q({
    slug: "async-http-and-blocking-libraries",
    topic: "Async I/O",
    d: "medium",
    title:
      "Can you use `requests` or a blocking database driver in async code?",
    kw: [
      "requests in async",
      "async http client",
      "aiohttp httpx",
      "blocking driver",
      "async database",
    ],
    intent: "Checks library choices for async programs.",
    short:
      "Not directly. `requests` and most traditional database drivers are blocking: calling them inside a coroutine freezes the event loop for the duration of each call. Use clients designed for asyncio, such as `aiohttp` or `httpx` (async API) for HTTP and async drivers for databases. If you must use a blocking library, call it through `asyncio.to_thread()` or an executor so it runs outside the loop. Reuse a single client session for many requests instead of creating one per call, create it inside the running loop, and close it with `async with` or an explicit close.",
    detail: [
      "Async libraries expose coroutine functions you `await`.",
      "Check that every library on the hot path is async-aware.",
      "Frameworks like FastAPI run plain `def` handlers in a thread pool for this reason.",
    ],
    ex: "Replacing `requests.get` with an async client session lets a crawler fetch 100 pages at once.",
    mistakes: [
      "Calling requests.get inside async def.",
      "Creating a new client session per request.",
    ],
    follow: ["How do you reuse a blocking library safely?"],
    points: [
      "Blocking clients freeze the loop",
      "Use async-native clients",
      "to_thread for unavoidable blocking calls",
      "Reuse one session",
    ],
    notes: ["Async all the way, or offload."],
    src: [
      [
        "Python: Developing with asyncio (running blocking code)",
        `${D}/library/asyncio-dev.html`,
      ],
      ["Python: asyncio.to_thread", `${D}/library/asyncio-task.html`],
    ],
  }),
  q({
    slug: "asyncio-subprocess",
    topic: "Async I/O",
    d: "medium",
    title: "How do you run external commands from async code?",
    kw: [
      "asyncio subprocess",
      "create_subprocess_exec",
      "communicate",
      "non-blocking command",
      "shell injection",
    ],
    intent: "Checks non-blocking process handling.",
    short:
      "Use `asyncio.create_subprocess_exec(program, *args, stdout=asyncio.subprocess.PIPE)` to start a process without blocking the loop, then `await proc.communicate()` to send input, read the output and wait for exit, or read `proc.stdout` line by line. Many processes can run concurrently with `gather`. Prefer `create_subprocess_exec` with a list of arguments over `create_subprocess_shell`, which passes a string to the shell and is vulnerable to injection when it contains user input. Check `proc.returncode` for the exit status. The synchronous `subprocess.run` would block the loop.",
    detail: [
      "Pass `stderr=asyncio.subprocess.STDOUT` to merge error output.",
      "Add timeouts and kill hung processes with `proc.kill()`.",
      "Large outputs can fill the pipe if you never read them.",
    ],
    ex: "Running several `ffmpeg` conversions at once and reporting each when finished.",
    code: [
      [
        "Run a command",
        "python",
        `import asyncio\n\nasync def main():\n    proc = await asyncio.create_subprocess_exec(\n        "echo", "hello", stdout=asyncio.subprocess.PIPE\n    )\n    out, _ = await proc.communicate()\n    print(out.decode().strip(), proc.returncode)   # hello 0\n\nasyncio.run(main())`,
        ["`communicate` reads output and waits for exit."],
      ],
    ],
    mistakes: [
      "Using shell variants with user input.",
      "Never reading the output pipes.",
    ],
    follow: ["Why prefer create_subprocess_exec?"],
    points: [
      "create_subprocess_exec",
      "await communicate()",
      "Avoid shell strings",
      "Check returncode",
    ],
    notes: ["Run commands without blocking."],
    src: [
      ["Python: asyncio subprocesses", `${D}/library/asyncio-subprocess.html`],
      ["Python: subprocess", `${D}/library/subprocess.html`],
    ],
  }),
  q({
    slug: "testing-async-code",
    topic: "Async I/O",
    d: "medium",
    title: "How do you test async functions?",
    kw: [
      "testing async",
      "IsolatedAsyncioTestCase",
      "pytest-asyncio",
      "asyncio.run in tests",
      "mock async",
    ],
    intent: "Checks testing practices for coroutines.",
    short:
      "A test function cannot simply `await` unless the test runner supports async tests. With the standard library use `unittest.IsolatedAsyncioTestCase`, whose test methods can be `async def` and which creates a fresh event loop per test; `unittest.mock.AsyncMock` mocks awaitable calls. With pytest, a plugin such as `pytest-asyncio` or `anyio` lets you mark tests as async. Alternatively, call `asyncio.run(coro())` inside a normal test. Mock the network and use short timeouts so tests are fast and deterministic, and avoid real sleeping: patch delays or use small values.",
    detail: [
      "`AsyncMock` returns coroutines and records awaits (`assert_awaited_once`).",
      "Every test should leave no pending tasks behind.",
      "Test cancellation and timeout behaviour explicitly.",
    ],
    ex: "Testing a function that fetches data by replacing the client with an `AsyncMock`.",
    code: [
      [
        "IsolatedAsyncioTestCase",
        "python",
        `import unittest\nfrom unittest.mock import AsyncMock\n\nasync def get_name(client):\n    return (await client.fetch())["name"]\n\nclass T(unittest.IsolatedAsyncioTestCase):\n    async def test_name(self):\n        client = AsyncMock()\n        client.fetch.return_value = {"name": "Asha"}\n        self.assertEqual(await get_name(client), "Asha")\n        client.fetch.assert_awaited_once()`,
        [
          "Test methods can be `async def`.",
          "`AsyncMock` stands in for async calls.",
        ],
      ],
    ],
    mistakes: [
      "Calling an async function in a sync test without running it.",
      "Using real network calls and sleeps in tests.",
    ],
    follow: ["Which mock class handles awaitables?"],
    points: [
      "IsolatedAsyncioTestCase",
      "AsyncMock for awaitable calls",
      "pytest-asyncio for pytest",
      "Avoid real sleeps and network",
    ],
    notes: ["Async tests need an async runner."],
    src: [
      [
        "Python: unittest.IsolatedAsyncioTestCase",
        `${D}/library/unittest.html`,
      ],
      ["Python: unittest.mock.AsyncMock", `${D}/library/unittest.mock.html`],
    ],
  }),
])
