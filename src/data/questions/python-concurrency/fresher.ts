import { defineQuestions } from "../author"
import { q } from "../compact"

const D = "https://docs.python.org/3"

export default defineQuestions("python-concurrency", "fresher", [
  q({
    slug: "concurrency-vs-parallelism",
    topic: "GIL",
    d: "easy",
    title: "What is the difference between concurrency and parallelism?",
    kw: ["concurrency", "parallelism", "multitasking", "cpu bound", "io bound"],
    intent: "Checks the vocabulary needed to choose a model.",
    short:
      "Concurrency means structuring a program so that several tasks make progress during overlapping periods of time, even if only one runs at any instant; for example, one thread waits for the network while another runs. Parallelism means tasks actually run at the same moment on multiple CPU cores. Concurrency helps with waiting-heavy (I/O-bound) work, while parallelism is needed to speed up computation-heavy (CPU-bound) work. In Python, threads and `asyncio` give concurrency, and multiple processes give parallelism for pure-Python code.",
    detail: [
      "Concurrency is about structure, parallelism about execution.",
      "More workers than CPU cores will not speed up CPU-bound work.",
      "The `concurrent execution` section of the standard library groups these tools.",
    ],
    ex: "A downloader that fetches 50 pages at once is concurrent; a video encoder using all cores is parallel.",
    mistakes: [
      "Using threads to speed up CPU-bound Python loops.",
      "Treating the two terms as the same.",
    ],
    follow: ["Which Python tools give true parallelism for CPU-bound code?"],
    points: [
      "Concurrency: overlapping progress",
      "Parallelism: simultaneous execution",
      "I/O-bound benefits from concurrency",
      "CPU-bound needs parallelism",
    ],
    notes: ["Waiting versus computing."],
    src: [
      ["Python: Concurrent execution", `${D}/library/concurrency.html`],
      ["Python: threading", `${D}/library/threading.html`],
    ],
  }),
  q({
    slug: "what-is-the-gil",
    topic: "GIL",
    d: "easy",
    title: "What is the Global Interpreter Lock (GIL) in CPython?",
    kw: [
      "gil",
      "global interpreter lock",
      "cpython",
      "bytecode execution",
      "threads",
    ],
    intent: "A core Python concurrency question.",
    short:
      "The GIL is a mutex in the standard CPython interpreter that lets only one thread execute Python bytecode at a time. It simplifies the interpreter's memory management and makes the C implementation of built-in types safer to use from threads. The consequence is that threads running pure-Python CPU-bound code do not run in parallel on several cores. The lock is released during blocking I/O and by some extension modules doing heavy work, such as compression or hashing, so threads still help for I/O-bound programs. Other implementations of Python may behave differently.",
    detail: [
      "The GIL is an implementation detail of CPython, not part of the language.",
      "The interpreter switches between threads at regular intervals.",
      "Use multiple processes for CPU-bound parallelism.",
    ],
    ex: "Two threads each counting to 100 million take about as long as one thread counting to 200 million.",
    mistakes: [
      "Thinking the GIL makes all code thread-safe.",
      "Using threads for number crunching.",
    ],
    follow: ["When is the GIL released?"],
    points: [
      "One thread runs bytecode at a time",
      "CPython implementation detail",
      "Released during I/O",
      "Use processes for CPU-bound work",
    ],
    notes: ["One bytecode runner at a time."],
    src: [
      ["Python: Glossary - global interpreter lock", `${D}/glossary.html`],
      [
        "Python: threading (CPython implementation detail)",
        `${D}/library/threading.html`,
      ],
    ],
  }),
  q({
    slug: "gil-cpu-bound-versus-io-bound",
    topic: "GIL",
    d: "medium",
    title:
      "Why do threads speed up I/O-bound programs but not CPU-bound ones in Python?",
    kw: [
      "io bound",
      "cpu bound",
      "thread speed up",
      "blocking calls",
      "gil release",
    ],
    intent: "Checks reasoning about where time goes.",
    short:
      "An I/O-bound program spends most of its time waiting for the network, disk or a database. While one thread waits, the GIL is released, so another thread can run; ten threads can overlap ten waits and finish in roughly the time of one. A CPU-bound program spends its time executing Python bytecode, and since only one thread can hold the GIL at a time, adding threads gives no speed-up and can add switching overhead. For CPU-bound work use `multiprocessing` or `ProcessPoolExecutor`, a native library that releases the GIL, or move the hot loop to compiled code. Measure first to know which kind of bound your task is.",
    detail: [
      "Profiling tells you whether time is spent waiting or computing.",
      "Libraries like NumPy do heavy work in C and can release the GIL.",
      "`asyncio` is another option for many concurrent I/O waits.",
    ],
    ex: "Downloading 100 files with 10 threads is much faster; hashing 100 big files in pure Python threads is not.",
    mistakes: [
      "Assuming more threads is always faster.",
      "Not measuring the real bottleneck.",
    ],
    follow: ["What would you use for 8-core number crunching?"],
    points: [
      "I/O waits release the GIL",
      "CPU-bound work holds it",
      "Threads for I/O, processes for CPU",
      "Profile first",
    ],
    notes: ["Waiting overlaps, computing does not."],
    src: [
      ["Python: threading", `${D}/library/threading.html`],
      ["Python: concurrent.futures", `${D}/library/concurrent.futures.html`],
    ],
  }),
  q({
    slug: "choosing-threads-processes-or-asyncio",
    topic: "GIL",
    d: "medium",
    title: "How do you choose between threads, processes and `asyncio`?",
    kw: [
      "threads vs processes",
      "asyncio vs threading",
      "multiprocessing",
      "choose concurrency model",
      "overhead",
    ],
    intent: "A design question asking for a decision rule.",
    short:
      "Pick by the kind of work. For CPU-bound pure-Python tasks use processes (`multiprocessing`, `ProcessPoolExecutor`), which sidestep the GIL at the cost of separate memory and data being pickled between processes. For I/O-bound tasks with a moderate number of blocking calls, threads (`ThreadPoolExecutor`) are simple and work with ordinary blocking libraries. For very many concurrent connections, such as thousands of sockets, `asyncio` uses a single thread with cooperative tasks and less overhead, but all code on the path must be non-blocking. When in doubt, start with the simplest executor and measure.",
    detail: [
      "Threads share memory, which is convenient and risky.",
      "Processes are isolated: safer, but communication is more explicit.",
      "A blocking call inside async code stalls every task.",
    ],
    ex: "A scraper with 20 workers uses threads; an image-resizing batch job uses processes; a chat server uses asyncio.",
    mistakes: [
      "Calling blocking libraries from async code.",
      "Using processes for tiny tasks where startup cost dominates.",
    ],
    follow: ["What is the main cost of using processes?"],
    points: [
      "CPU-bound: processes",
      "Blocking I/O: threads",
      "Many connections: asyncio",
      "Measure before deciding",
    ],
    notes: ["Match the model to the bottleneck."],
    src: [
      ["Python: Concurrent execution", `${D}/library/concurrency.html`],
      ["Python: asyncio", `${D}/library/asyncio.html`],
    ],
  }),
  q({
    slug: "gil-does-not-make-code-thread-safe",
    topic: "GIL",
    d: "hard",
    title:
      "If the GIL exists, do you still need locks in threaded Python code?",
    kw: [
      "thread safety",
      "atomic operations",
      "race condition",
      "counter increment",
      "lock needed",
    ],
    intent: "Checks a common misunderstanding.",
    short:
      "Yes. The GIL protects the interpreter's internal data structures, but it does not make your compound operations atomic. A statement such as `counter += 1` is several bytecode steps (load, add, store), and a thread switch can occur between them, so two threads can read the same value and one update is lost. Some single operations on built-in types, like `list.append`, are effectively atomic, but relying on that is fragile. Protect shared mutable state that is read-modify-written with a `threading.Lock`, or avoid sharing by passing messages through a `queue.Queue`.",
    detail: [
      "The Python FAQ lists which common operations are thread-safe in CPython.",
      "Keep critical sections small to limit contention.",
      "Immutable data and thread-local data avoid the problem.",
    ],
    ex: "Two threads incrementing a shared total 100,000 times each can end with less than 200,000 without a lock.",
    code: [
      [
        "Protecting a counter",
        "python",
        `import threading\n\ncount = 0\nlock = threading.Lock()\n\ndef work():\n    global count\n    for _ in range(100_000):\n        with lock:\n            count += 1\n\nts = [threading.Thread(target=work) for _ in range(4)]\n[t.start() for t in ts]; [t.join() for t in ts]\nprint(count)  # 400000`,
        ["The lock makes read-add-write one unit."],
      ],
    ],
    mistakes: ["Assuming += is atomic.", "Holding a lock during slow I/O."],
    follow: ["How can you avoid shared state altogether?"],
    points: [
      "GIL protects the interpreter, not your logic",
      "+= is not atomic",
      "Use Lock for shared state",
      "Prefer queues or thread-local data",
    ],
    notes: ["The GIL is not a lock for your data."],
    src: [
      [
        "Python FAQ: What kinds of global value mutation are thread-safe?",
        `${D}/faq/library.html`,
      ],
      ["Python: threading.Lock", `${D}/library/threading.html`],
    ],
  }),
  q({
    slug: "free-threaded-python-overview",
    topic: "GIL",
    d: "hard",
    title:
      "What is free-threaded Python, and how does it change the GIL story?",
    kw: [
      "free-threaded python",
      "no gil",
      "pep 703",
      "python 3.13",
      "experimental build",
    ],
    intent: "Checks awareness of recent developments without overclaiming.",
    short:
      "Recent CPython versions offer an optional free-threaded build in which the GIL is disabled, so threads running Python code can use several cores at once. It is a separate build of the interpreter (installed separately and identified by a `t` suffix), not the default one, and extension modules need to support it. Single-thread performance and library compatibility were the main trade-offs, and the status has been changing release by release, so read the current free-threading HOWTO for your version. Even without a GIL, code that shares mutable state still needs locks, so thread-safety habits stay important.",
    detail: [
      "`sys._is_gil_enabled()` reports whether the GIL is active in a given interpreter.",
      "Check that your dependencies support the free-threaded build.",
      "For most applications today, processes remain the standard route to CPU parallelism.",
    ],
    ex: "A CPU-heavy thread pool experiment running faster on the free-threaded build than on the default one.",
    mistakes: [
      "Assuming the default interpreter has no GIL.",
      "Dropping locks because 'there is no GIL'.",
    ],
    follow: ["Do you still need locks without the GIL?"],
    points: [
      "Optional separate build",
      "Threads can use several cores",
      "Extensions must support it",
      "Locks are still needed",
    ],
    notes: ["An opt-in build, not the default."],
    src: [
      [
        "Python: Python support for free threading",
        `${D}/howto/free-threading-python.html`,
      ],
      ["PEP 703: Making the GIL optional", "https://peps.python.org/pep-0703/"],
    ],
  }),
  q({
    slug: "thread-start-join-basics",
    topic: "threading",
    d: "easy",
    title: "How do you create and run threads with the `threading` module?",
    kw: ["threading.Thread", "start", "join", "target args", "thread subclass"],
    intent: "Checks basic thread usage.",
    short:
      "Create a thread with `threading.Thread(target=function, args=(arg1,))`, begin it with `start()`, and wait for it to finish with `join()`. Calling `target()` directly runs it in the current thread; only `start()` creates a new thread. Use `join()` before using results or exiting, and pass `timeout` to avoid waiting forever. Threads share the process's memory, so results are usually returned through a shared structure or a queue, since `Thread` does not give back the return value of the target. For many tasks a `ThreadPoolExecutor` is simpler than managing threads by hand.",
    detail: [
      "A thread can only be started once.",
      "Naming threads with `name=` helps debugging and logging.",
      "Subclassing `Thread` and overriding `run()` is possible but rarely necessary.",
    ],
    ex: "Starting three threads that each download one file, then joining them all.",
    code: [
      [
        "Start and join",
        "python",
        `import threading, time\n\ndef worker(n):\n    time.sleep(0.1)\n    print("done", n)\n\nthreads = [threading.Thread(target=worker, args=(i,)) for i in range(3)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint("all finished")`,
        ["`start()` launches each thread.", "`join()` waits for completion."],
      ],
    ],
    mistakes: [
      "Calling run() instead of start().",
      "Expecting a return value from the target.",
    ],
    follow: ["How do you get a result back from a thread?"],
    points: [
      "Thread(target, args)",
      "start begins, join waits",
      "No return value",
      "Executors are simpler for many tasks",
    ],
    notes: ["Start, then join."],
    src: [
      ["Python: threading.Thread", `${D}/library/threading.html`],
      [
        "Python: concurrent.futures.ThreadPoolExecutor",
        `${D}/library/concurrent.futures.html`,
      ],
    ],
  }),
  q({
    slug: "race-conditions-and-locks",
    topic: "threading",
    d: "medium",
    title: "What is a race condition, and how does a `Lock` prevent it?",
    kw: [
      "race condition",
      "threading.Lock",
      "critical section",
      "mutual exclusion",
      "with lock",
    ],
    intent: "A core concurrency concept.",
    short:
      "A race condition is when the result depends on the unpredictable timing of threads accessing shared data. For example two threads performing read-modify-write on the same variable can overwrite each other's update. A `threading.Lock` provides mutual exclusion: only one thread can hold it at a time, and others calling `acquire()` block until it is released. Use `with lock:` so it is always released, even when an exception occurs. Keep the locked section (the critical section) as short as possible, never do slow I/O while holding it, and guard every access to the shared data with the same lock.",
    detail: [
      "A lock protects data only if every access uses it.",
      "`lock.acquire(timeout=...)` avoids waiting forever.",
      "`RLock` can be re-acquired by the thread that already holds it.",
    ],
    ex: "Updating a shared inventory count from several worker threads under one lock.",
    mistakes: [
      "Forgetting to release the lock (not using with).",
      "Protecting writes but not reads.",
    ],
    follow: ["What is the difference between Lock and RLock?"],
    points: [
      "Timing-dependent bug",
      "Lock gives mutual exclusion",
      "Use with lock",
      "Short critical sections",
    ],
    notes: ["One at a time in the critical section."],
    src: [
      ["Python: threading.Lock", `${D}/library/threading.html`],
      [
        "Python: Lock objects as context managers",
        `${D}/library/threading.html`,
      ],
    ],
  }),
  q({
    slug: "deadlocks-and-lock-ordering",
    topic: "threading",
    d: "hard",
    title: "What is a deadlock, and how do you avoid it?",
    kw: [
      "deadlock",
      "lock ordering",
      "rlock",
      "circular wait",
      "acquire timeout",
    ],
    intent: "Checks understanding of lock hazards.",
    short:
      "A deadlock happens when threads wait for each other forever: thread A holds lock 1 and waits for lock 2 while thread B holds lock 2 and waits for lock 1. It needs several locks (or a non-reentrant lock acquired twice by the same thread). Avoid it by always acquiring multiple locks in the same global order, holding as few locks as possible, using timeouts (`lock.acquire(timeout=1)`) and handling failure, and preferring designs that avoid shared locks, such as message passing with queues. Acquiring a plain `Lock` twice in one thread deadlocks; `RLock` allows re-entry by the owning thread.",
    detail: [
      "Do not call unknown callbacks while holding a lock.",
      "Thread dumps (for example via `faulthandler.dump_traceback_later`) help diagnose hangs.",
      "Fewer, coarser locks are easier to reason about than many fine-grained ones.",
    ],
    ex: "Transferring money between two accounts, each with its own lock, can deadlock when two transfers go in opposite directions.",
    code: [
      [
        "Consistent ordering",
        "python",
        `import threading\n\na, b = threading.Lock(), threading.Lock()\n\ndef transfer():\n    # always take a before b, in every thread\n    with a:\n        with b:\n            pass`,
        ["Every thread follows the same lock order."],
      ],
    ],
    mistakes: [
      "Taking locks in different orders in different places.",
      "Calling external code while holding a lock.",
    ],
    follow: ["Why does acquiring a Lock twice in one thread hang?"],
    points: [
      "Circular waiting",
      "Same order for all locks",
      "Use timeouts",
      "Prefer message passing",
    ],
    notes: ["Order your locks."],
    src: [
      [
        "Python: threading (Lock and RLock objects)",
        `${D}/library/threading.html`,
      ],
      ["Python: faulthandler", `${D}/library/faulthandler.html`],
    ],
  }),
  q({
    slug: "event-semaphore-condition-barrier",
    topic: "threading",
    d: "medium",
    title: "What are `Event`, `Semaphore`, `Condition` and `Barrier` used for?",
    kw: [
      "threading.Event",
      "Semaphore",
      "Condition",
      "Barrier",
      "synchronization primitives",
    ],
    intent: "Checks breadth of the threading toolbox.",
    short:
      "An `Event` is a flag threads can wait on: one thread calls `set()` and waiting threads wake up, which is handy for start signals and for asking workers to stop. A `Semaphore(n)` allows at most n threads into a section at once, for limiting concurrent connections. A `Condition` combines a lock with `wait()` and `notify()` so threads sleep until some state changes, the basis of producer-consumer designs. A `Barrier(n)` makes n threads wait until all have arrived. For most producer-consumer work a `queue.Queue` is simpler than a hand-written `Condition`.",
    detail: [
      "Always re-check the condition in a loop after `Condition.wait()`.",
      "`BoundedSemaphore` raises an error if released too often.",
      "`Event.wait(timeout)` returns whether the flag was set.",
    ],
    ex: "Limiting a scraper to 5 simultaneous requests with `Semaphore(5)`.",
    code: [
      [
        "Stop flag with Event",
        "python",
        `import threading, time\n\nstop = threading.Event()\n\ndef worker():\n    while not stop.is_set():\n        time.sleep(0.05)\n    print("stopped")\n\nt = threading.Thread(target=worker)\nt.start()\ntime.sleep(0.2)\nstop.set()\nt.join()`,
        ["The worker polls the event.", "`set()` signals shutdown."],
      ],
    ],
    mistakes: [
      "Using a plain boolean flag across threads without thought.",
      "Not looping around Condition.wait.",
    ],
    follow: ["When would you use a Semaphore?"],
    points: [
      "Event: signal flag",
      "Semaphore: limit concurrency",
      "Condition: wait for state",
      "Barrier: rendezvous",
    ],
    notes: ["Choose the primitive by the question."],
    src: [
      [
        "Python: threading (Event, Semaphore, Condition, Barrier)",
        `${D}/library/threading.html`,
      ],
      ["Python: queue", `${D}/library/queue.html`],
    ],
  }),
  q({
    slug: "producer-consumer-with-queue",
    topic: "threading",
    d: "medium",
    title:
      "How do you implement a producer-consumer pattern with `queue.Queue`?",
    kw: [
      "queue.Queue",
      "producer consumer",
      "task_done",
      "sentinel",
      "thread-safe queue",
    ],
    intent: "Checks the standard safe way to share work.",
    short:
      "`queue.Queue` is a thread-safe FIFO queue with all locking built in. Producers call `put(item)`; consumers call `get()`, which blocks when the queue is empty. With `maxsize` set, `put` blocks when full, providing back-pressure. After processing an item, a consumer calls `task_done()`, and the main thread can call `queue.join()` to wait until every item has been processed. To tell workers to stop, put a sentinel value such as `None` (one per worker). Passing data through a queue avoids shared mutable state, which makes threaded programs far easier to get right.",
    detail: [
      "`get_nowait()` and `put_nowait()` raise `queue.Empty` and `queue.Full`.",
      "`PriorityQueue` and `LifoQueue` are variants.",
      "`multiprocessing.Queue` is the process-based counterpart.",
    ],
    ex: "One thread reads file names and several workers process them.",
    code: [
      [
        "Workers and sentinel",
        "python",
        `import queue, threading\n\nq = queue.Queue()\n\ndef worker():\n    while (item := q.get()) is not None:\n        print("processing", item)\n        q.task_done()\n    q.task_done()\n\nt = threading.Thread(target=worker)\nt.start()\nfor i in range(3):\n    q.put(i)\nq.put(None)\nq.join()\nt.join()`,
        [
          "`get` blocks until an item arrives.",
          "`None` tells the worker to stop.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting task_done, so join() hangs.",
      "Not stopping workers at the end.",
    ],
    follow: ["What does maxsize do?"],
    points: [
      "Thread-safe FIFO",
      "get blocks, put may block",
      "task_done and join",
      "Sentinel to stop workers",
    ],
    notes: ["Share by passing, not by locking."],
    src: [
      ["Python: queue", `${D}/library/queue.html`],
      ["Python: threading", `${D}/library/threading.html`],
    ],
  }),
  q({
    slug: "daemon-threads-and-shutdown",
    topic: "threading",
    d: "medium",
    title: "What is a daemon thread, and when is it a bad idea?",
    kw: [
      "daemon thread",
      "program exit",
      "shutdown",
      "cleanup",
      "background thread",
    ],
    intent: "Checks understanding of thread lifetimes.",
    short:
      "A daemon thread (`daemon=True`) does not keep the program alive: the interpreter exits when only daemon threads remain. Non-daemon threads must finish first. The documentation warns that daemon threads are abruptly stopped at shutdown, so their resources, such as open files or database transactions, may not be released properly. They suit disposable background work like periodic heartbeats, not work that must complete or clean up. For a graceful shutdown, use non-daemon threads with a stop `Event`, then `join()` them.",
    detail: [
      "`daemon` must be set before `start()`.",
      "Threads started by a daemon thread are daemon by default.",
      "Decide a shutdown protocol: signal, drain the queue, join.",
    ],
    ex: "A metrics sender thread can be a daemon, but a thread writing files must be joined.",
    mistakes: [
      "Using daemon threads for work that must finish.",
      "Setting daemon after start.",
    ],
    follow: ["How would you stop worker threads gracefully?"],
    points: [
      "Daemon threads do not block exit",
      "Stopped abruptly",
      "Not for must-finish work",
      "Use Event and join for graceful stops",
    ],
    notes: ["Daemon means disposable."],
    src: [
      [
        "Python: threading (thread objects, daemon)",
        `${D}/library/threading.html`,
      ],
      ["Python: threading.Event", `${D}/library/threading.html`],
    ],
  }),
  q({
    slug: "thread-local-data",
    topic: "threading",
    d: "medium",
    title: "What is thread-local data, and when do you use `threading.local`?",
    kw: [
      "threading.local",
      "thread local storage",
      "per-thread state",
      "request context",
      "contextvars",
    ],
    intent: "Checks per-thread state handling.",
    short:
      "`threading.local()` creates an object whose attributes are separate for each thread: setting `data.x = 1` in one thread does not change what another thread sees. It is used for per-thread resources, such as a database connection or a request context, so threads do not need locks around them. Values must be set in each thread; a new thread starts with an empty local. For asynchronous code, thread-locals are not suitable because many tasks share one thread; use `contextvars` there.",
    detail: [
      "Subclassing `local` allows setting default values per thread.",
      "Cleanup is the program's job: connections in thread-locals need closing.",
      "Prefer passing explicit arguments when possible, as global-like state hides dependencies.",
    ],
    ex: "Each worker thread keeps its own `sqlite3` connection in a thread-local.",
    code: [
      [
        "Per-thread value",
        "python",
        `import threading\n\nlocal = threading.local()\n\ndef work(name):\n    local.name = name\n    print(threading.current_thread().name, local.name)\n\nts = [threading.Thread(target=work, args=(n,)) for n in "ab"]\n[t.start() for t in ts]; [t.join() for t in ts]`,
        ["Each thread sees only its own `local.name`."],
      ],
    ],
    mistakes: [
      "Expecting values set in one thread to appear in another.",
      "Using thread-locals with asyncio tasks.",
    ],
    follow: ["What replaces thread-locals in async code?"],
    points: [
      "Attributes are per thread",
      "Set values in each thread",
      "Avoids locks for per-thread state",
      "contextvars for async",
    ],
    notes: ["Same name, separate values."],
    src: [
      ["Python: threading.local", `${D}/library/threading.html`],
      ["Python: contextvars", `${D}/library/contextvars.html`],
    ],
  }),
  q({
    slug: "exceptions-in-threads",
    topic: "threading",
    d: "medium",
    title: "What happens when an exception is raised inside a thread?",
    kw: [
      "thread exception",
      "threading.excepthook",
      "silent failure",
      "future exception",
      "error propagation",
    ],
    intent: "Checks error handling across threads.",
    short:
      "An exception that escapes a thread's target ends only that thread: the traceback is passed to `threading.excepthook`, which prints it to stderr by default, and the main thread and other threads keep running. The error does not propagate to the code that started the thread, and `join()` will not raise it. To handle errors, catch exceptions inside the target and report them through a queue or shared structure, customise `threading.excepthook`, or use `ThreadPoolExecutor`, where `future.result()` re-raises the exception in the caller.",
    detail: [
      "A crashed worker can silently stop processing, so monitor your threads.",
      "Log exceptions with tracebacks inside the worker.",
      "`sys.excepthook` is for the main thread; `threading.excepthook` is for others.",
    ],
    ex: "A worker thread dies from a `KeyError` while the program keeps running without that worker.",
    code: [
      [
        "Futures re-raise",
        "python",
        `from concurrent.futures import ThreadPoolExecutor\n\ndef fail():\n    raise ValueError("boom")\n\nwith ThreadPoolExecutor() as ex:\n    fut = ex.submit(fail)\n    try:\n        fut.result()\n    except ValueError as e:\n        print("caught:", e)`,
        ["The caller sees the worker's exception."],
      ],
    ],
    mistakes: [
      "Assuming join() raises the thread's error.",
      "Not logging worker failures.",
    ],
    follow: ["How does an executor expose a worker's exception?"],
    points: [
      "Exception ends only that thread",
      "Printed via threading.excepthook",
      "Not raised in the starter",
      "future.result() re-raises",
    ],
    notes: ["Threads fail quietly."],
    src: [
      ["Python: threading.excepthook", `${D}/library/threading.html`],
      [
        "Python: concurrent.futures.Future",
        `${D}/library/concurrent.futures.html`,
      ],
    ],
  }),
  q({
    slug: "multiprocessing-process-basics",
    topic: "multiprocessing",
    d: "easy",
    title:
      "How does the `multiprocessing` module work, and how is it different from threading?",
    kw: [
      "multiprocessing",
      "Process",
      "separate memory",
      "side-step gil",
      "main guard",
    ],
    intent: "Checks the basics of process-based parallelism.",
    short:
      "`multiprocessing` starts separate operating-system processes, each with its own interpreter and its own memory, so CPU-bound Python code can run in parallel on several cores and the GIL is sidestepped. The API resembles `threading`: `Process(target=f, args=(x,))`, `start()`, `join()`. The differences matter: processes do not share variables, so data must be passed with queues, pipes or shared memory, which means it is serialised (pickled); starting a process costs more than a thread; and on platforms that do not fork, the module is imported afresh in each child, so the entry point must be under `if __name__ == '__main__':`.",
    detail: [
      "A crash in a child does not take down the parent.",
      "Processes are better isolated, which helps with untrusted or leaky code.",
      "Pass only picklable arguments.",
    ],
    ex: "Resizing thousands of images, one worker process per CPU core.",
    code: [
      [
        "Process and main guard",
        "python",
        `from multiprocessing import Process\n\ndef square(n):\n    print(n * n)\n\nif __name__ == "__main__":\n    ps = [Process(target=square, args=(i,)) for i in range(3)]\n    for p in ps: p.start()\n    for p in ps: p.join()`,
        ["The guard prevents child processes re-running the launcher code."],
      ],
    ],
    mistakes: [
      "Missing the __main__ guard.",
      "Expecting shared variables between processes.",
    ],
    follow: ["Why must arguments be picklable?"],
    points: [
      "Separate processes and memory",
      "Avoids the GIL",
      "Data is pickled between processes",
      "Needs the __main__ guard",
    ],
    notes: ["More isolation, more overhead."],
    src: [
      ["Python: multiprocessing", `${D}/library/multiprocessing.html`],
      [
        "Python: multiprocessing programming guidelines",
        `${D}/library/multiprocessing.html`,
      ],
    ],
  }),
  q({
    slug: "multiprocessing-start-methods",
    topic: "multiprocessing",
    d: "hard",
    title: "What are the `fork`, `spawn` and `forkserver` start methods?",
    kw: ["start method", "fork", "spawn", "forkserver", "get_start_method"],
    intent: "Checks understanding of platform differences.",
    short:
      "A start method controls how a child process is created. `spawn` starts a fresh Python interpreter and re-imports the main module, which is slower but safe, and the only method on Windows. `fork` copies the parent process, which is fast and inherits memory, but the documentation calls it unsafe on macOS and problematic when the parent has threads, since locks held by other threads can be copied in a locked state. `forkserver` starts a clean server process that forks children on request. The default depends on platform and Python version, so check `multiprocessing.get_start_method()` and set it explicitly when your code relies on one.",
    detail: [
      "With `spawn` and `forkserver`, code and arguments must be importable and picklable.",
      "Globals set in the parent after import are not visible to spawned children.",
      "Tests that rely on fork behaviour may fail on other platforms.",
    ],
    ex: "A program that works on Linux with fork fails on Windows because a worker used a global defined only at runtime.",
    mistakes: [
      "Relying on inherited globals.",
      "Forking after starting threads.",
    ],
    follow: ["Why can fork be dangerous with threads?"],
    points: [
      "spawn: fresh interpreter",
      "fork: copy of parent",
      "forkserver: clean helper process",
      "Default depends on platform and version",
    ],
    notes: ["Make the start method explicit."],
    src: [
      [
        "Python: multiprocessing (contexts and start methods)",
        `${D}/library/multiprocessing.html`,
      ],
      ["Python: os.fork", `${D}/library/os.html`],
    ],
  }),
  q({
    slug: "multiprocessing-queue-pipe-communication",
    topic: "multiprocessing",
    d: "medium",
    title: "How do processes communicate: `Queue`, `Pipe` and shared state?",
    kw: ["multiprocessing.Queue", "Pipe", "Manager", "ipc", "message passing"],
    intent: "Checks inter-process communication options.",
    short:
      "Processes do not share memory by default, so they exchange messages. `multiprocessing.Queue` is a process-safe FIFO queue usable by many producers and consumers, and items are pickled when sent. `Pipe()` creates a connection with two ends for two-way communication between exactly two processes and is faster but not safe for several users of one end. A `Manager` runs a server process holding shared objects such as lists and dicts and gives proxies to other processes, which is flexible but slower. `Value`, `Array` and `shared_memory` provide true shared memory for numeric data when speed matters.",
    detail: [
      "Always read from a queue before joining a child that wrote large amounts of data, or it may block.",
      "Message passing is easier to reason about than shared memory.",
      "Large objects are expensive to pickle repeatedly.",
    ],
    ex: "Worker processes put results into a queue that the parent drains.",
    code: [
      [
        "Queue between processes",
        "python",
        `from multiprocessing import Process, Queue\n\ndef work(q):\n    q.put("result")\n\nif __name__ == "__main__":\n    q = Queue()\n    p = Process(target=work, args=(q,))\n    p.start()\n    print(q.get())   # read before join\n    p.join()`,
        ["Items are pickled across the process boundary."],
      ],
    ],
    mistakes: [
      "Joining before draining the queue.",
      "Sending very large objects repeatedly.",
    ],
    follow: ["When would you use a Manager?"],
    points: [
      "Queue for many-to-many messages",
      "Pipe for two endpoints",
      "Manager for shared proxies",
      "Value/Array/shared_memory for speed",
    ],
    notes: ["Pass messages between processes."],
    src: [
      [
        "Python: multiprocessing (exchanging objects)",
        `${D}/library/multiprocessing.html`,
      ],
      [
        "Python: multiprocessing.shared_memory",
        `${D}/library/multiprocessing.shared_memory.html`,
      ],
    ],
  }),
  q({
    slug: "multiprocessing-pool-map",
    topic: "multiprocessing",
    d: "medium",
    title:
      "How do you use `multiprocessing.Pool` to parallelise a function over many inputs?",
    kw: [
      "multiprocessing.Pool",
      "pool.map",
      "chunksize",
      "starmap",
      "apply_async",
    ],
    intent: "Checks the common data-parallel pattern.",
    short:
      "`Pool(processes)` creates a set of worker processes that reuse themselves for many tasks, avoiding the cost of starting one process per item. `pool.map(func, items)` splits the items into chunks, runs `func` in the workers and returns the results in input order; `starmap` unpacks argument tuples, `imap_unordered` yields results as they finish and `apply_async` submits single tasks. The function and its arguments must be picklable, so use a module-level function, not a lambda. Tune `chunksize` for many small tasks to reduce overhead. Use `with Pool() as pool:` to clean up, and put the call under the `__main__` guard.",
    detail: [
      "The default process count is the number of CPUs.",
      "Work must be heavy enough to outweigh pickling and process overhead.",
      "Exceptions in workers are re-raised in the parent when results are collected.",
    ],
    ex: "Computing a checksum for each of thousands of files, spread across all cores.",
    code: [
      [
        "Pool.map",
        "python",
        `from multiprocessing import Pool\n\ndef square(n):\n    return n * n\n\nif __name__ == "__main__":\n    with Pool(4) as pool:\n        print(pool.map(square, range(10)))`,
        [
          "Results come back in input order.",
          "`square` is a module-level function, so it can be pickled.",
        ],
      ],
    ],
    mistakes: [
      "Passing a lambda to map.",
      "Parallelising trivial work where overhead dominates.",
    ],
    follow: ["How do you get results as soon as they finish?"],
    points: [
      "Reusable workers",
      "map keeps order",
      "Picklable functions only",
      "Tune chunksize",
    ],
    notes: ["Map work over processes."],
    src: [
      [
        "Python: multiprocessing.pool.Pool",
        `${D}/library/multiprocessing.html`,
      ],
      ["Python: pickle (what can be pickled)", `${D}/library/pickle.html`],
    ],
  }),
  q({
    slug: "pickling-limits-in-multiprocessing",
    topic: "multiprocessing",
    d: "medium",
    title:
      "Why do lambdas and some objects fail in `multiprocessing`, and what can you do?",
    kw: [
      "pickling error",
      "lambda not picklable",
      "picklable",
      "cannot pickle",
      "module-level function",
    ],
    intent: "Checks a common practical error.",
    short:
      "Arguments, results and the target function are sent between processes by pickling. Pickle stores functions by reference to their module and name, so lambdas, nested functions and locally defined classes cannot be pickled and raise errors like `Can't pickle local object`. Open files, locks, sockets and database connections generally cannot be pickled either. The remedies: define worker functions at module top level, pass plain data (numbers, strings, lists, dicts, dataclasses) instead of live resources, create resources like connections inside each worker, and use `functools.partial` on a top-level function instead of a lambda.",
    detail: [
      "Large arguments are costly because they are copied for each task.",
      "Pickle is not safe for untrusted data, but between your own processes it is fine.",
      "Initialiser functions let each worker set up resources once.",
    ],
    ex: "A worker that receives a database connection fails; creating the connection inside the worker solves it.",
    mistakes: [
      "Using lambdas as targets.",
      "Sending open resources to workers.",
    ],
    follow: ["How do you give each worker its own database connection?"],
    points: [
      "Functions pickled by name",
      "Top-level functions only",
      "Resources cannot be pickled",
      "partial instead of lambda",
    ],
    notes: ["Send data, not live objects."],
    src: [
      [
        "Python: pickle (what can be pickled and unpickled)",
        `${D}/library/pickle.html`,
      ],
      [
        "Python: multiprocessing programming guidelines",
        `${D}/library/multiprocessing.html`,
      ],
    ],
  }),
  q({
    slug: "shared-memory-value-array",
    topic: "multiprocessing",
    d: "hard",
    title:
      "How can processes share data without copying, using `Value`, `Array` and `shared_memory`?",
    kw: [
      "multiprocessing.Value",
      "multiprocessing.Array",
      "shared_memory",
      "shared state",
      "locking",
    ],
    intent: "Checks advanced sharing options.",
    short:
      "For numeric data you can avoid pickling with shared memory. `multiprocessing.Value('i', 0)` and `Array('d', 10)` create ctypes objects in shared memory that child processes can read and write; they carry a lock (`get_lock()`) for compound updates such as incrementing. Python 3.8 added `multiprocessing.shared_memory.SharedMemory`, which exposes a raw block that several processes attach to by name, useful with NumPy arrays, and which must be closed and unlinked explicitly. Shared state brings back race conditions, so use locks and keep it to what is needed; message passing is simpler for most programs.",
    detail: [
      "`Manager` objects are easier but slower than shared memory.",
      "Forgetting `unlink()` leaves shared memory behind.",
      "Shared memory holds raw bytes, so you define the layout.",
    ],
    ex: "Several workers filling disjoint parts of one big NumPy array placed in shared memory.",
    code: [
      [
        "Shared counter",
        "python",
        `from multiprocessing import Process, Value\n\ndef add(counter):\n    for _ in range(1000):\n        with counter.get_lock():\n            counter.value += 1\n\nif __name__ == "__main__":\n    counter = Value("i", 0)\n    ps = [Process(target=add, args=(counter,)) for _ in range(4)]\n    [p.start() for p in ps]; [p.join() for p in ps]\n    print(counter.value)  # 4000`,
        ["The lock makes each increment safe."],
      ],
    ],
    mistakes: [
      "Updating shared values without the lock.",
      "Not unlinking shared_memory blocks.",
    ],
    follow: ["When is message passing better?"],
    points: [
      "Value and Array in shared memory",
      "get_lock for compound updates",
      "shared_memory for raw blocks",
      "Clean up with unlink",
    ],
    notes: ["Shared memory needs locks too."],
    src: [
      [
        "Python: multiprocessing (shared ctypes objects)",
        `${D}/library/multiprocessing.html`,
      ],
      [
        "Python: multiprocessing.shared_memory",
        `${D}/library/multiprocessing.shared_memory.html`,
      ],
    ],
  }),
  q({
    slug: "choosing-worker-count",
    topic: "multiprocessing",
    d: "easy",
    title: "How many workers should you use for processes and threads?",
    kw: [
      "worker count",
      "os.cpu_count",
      "max_workers",
      "oversubscription",
      "tuning",
    ],
    intent: "Checks practical sizing.",
    short:
      "For CPU-bound process pools, start with the number of available CPU cores (`os.cpu_count()`, or the pool's default); more workers than cores only adds switching and memory cost. For I/O-bound thread pools the limit is how many waits you can overlap and what the remote system tolerates, so values larger than the core count are fine; the standard library's default for `ThreadPoolExecutor` is based on CPU count plus a few, capped at 32. Then measure with realistic data and adjust. Respect external limits such as API rate limits, database connection pools and memory per process.",
    detail: [
      "`os.cpu_count()` can include cores your container is not allowed to use.",
      "Each process needs its own memory, so many workers on big data can exhaust RAM.",
      "More threads can overload the server you call.",
    ],
    ex: "A job processing images runs best at about the core count, while a crawler runs best near the site's allowed concurrency.",
    mistakes: [
      "Spawning hundreds of processes.",
      "Ignoring rate limits of external services.",
    ],
    follow: ["What limits the useful number of threads for I/O?"],
    points: [
      "CPU-bound: about the core count",
      "I/O-bound: more is fine, within limits",
      "Measure",
      "Mind memory and rate limits",
    ],
    notes: ["Size workers to the bottleneck."],
    src: [
      ["Python: os.cpu_count", `${D}/library/os.html`],
      [
        "Python: concurrent.futures.ThreadPoolExecutor",
        `${D}/library/concurrent.futures.html`,
      ],
    ],
  }),
  q({
    slug: "thread-pool-executor-basics",
    topic: "concurrent.futures",
    d: "easy",
    title: "How do you use `ThreadPoolExecutor` for concurrent I/O?",
    kw: [
      "ThreadPoolExecutor",
      "executor.map",
      "submit",
      "max_workers",
      "futures",
    ],
    intent: "Checks the high-level threading API.",
    short:
      "`concurrent.futures.ThreadPoolExecutor(max_workers=n)` manages a pool of threads. `executor.map(func, items)` runs the function on each item and returns results in input order; `executor.submit(func, *args)` schedules one call and returns a `Future` immediately. Using the executor as a context manager (`with`) waits for pending work and shuts the pool down. It is a much simpler interface than creating and joining threads yourself and returns results and exceptions through futures. It is the right default for I/O-bound work such as HTTP requests or reading many files.",
    detail: [
      "Threads in the pool are reused across tasks.",
      "Exceptions from `map` appear when you iterate over its results.",
      "Do not use it for CPU-bound pure-Python work.",
    ],
    ex: "Checking the status of 100 URLs with 10 worker threads.",
    code: [
      [
        "map with threads",
        "python",
        `import time\nfrom concurrent.futures import ThreadPoolExecutor\n\ndef slow(n):\n    time.sleep(0.2)\n    return n * 2\n\nwith ThreadPoolExecutor(max_workers=5) as ex:\n    print(list(ex.map(slow, range(10))))   # about 0.4s, not 2s`,
        ["Ten 0.2s waits overlap across five threads."],
      ],
    ],
    mistakes: [
      "Using threads for CPU-bound loops.",
      "Ignoring exceptions inside the results.",
    ],
    follow: ["What is the difference between map and submit?"],
    points: [
      "Pool of reusable threads",
      "map returns ordered results",
      "submit returns a Future",
      "Use as a context manager",
    ],
    notes: ["Concurrent I/O made easy."],
    src: [
      [
        "Python: concurrent.futures.ThreadPoolExecutor",
        `${D}/library/concurrent.futures.html`,
      ],
      [
        "Python: concurrent.futures.Executor.map",
        `${D}/library/concurrent.futures.html`,
      ],
    ],
  }),
  q({
    slug: "process-pool-executor-basics",
    topic: "concurrent.futures",
    d: "medium",
    title: "How does `ProcessPoolExecutor` differ from `ThreadPoolExecutor`?",
    kw: [
      "ProcessPoolExecutor",
      "cpu bound",
      "pickling",
      "BrokenProcessPool",
      "executor interface",
    ],
    intent: "Checks the process-based executor and its constraints.",
    short:
      "Both share the `Executor` interface (`submit`, `map`, context manager), so switching is often a one-word change. `ProcessPoolExecutor` runs tasks in separate processes, which gives real parallelism for CPU-bound pure-Python work. Because of that, functions and arguments must be picklable, results are pickled back, the main module must be importable (use the `__main__` guard), and each task has more overhead than a thread task. If a worker process dies abruptly, pending futures fail with `BrokenProcessPool`. The default number of workers is based on the CPU count.",
    detail: [
      "Pass chunky tasks; thousands of tiny ones will be dominated by overhead (`map` has a `chunksize` argument).",
      "An `initializer` runs once per worker to set up state.",
      "Interactive shells may not work well with process pools on spawn platforms.",
    ],
    ex: "Computing prime factors for a list of large numbers on all cores.",
    code: [
      [
        "CPU-bound with processes",
        "python",
        `from concurrent.futures import ProcessPoolExecutor\n\ndef count_primes(limit):\n    return sum(all(n % d for d in range(2, int(n ** 0.5) + 1)) for n in range(2, limit))\n\nif __name__ == "__main__":\n    with ProcessPoolExecutor() as ex:\n        print(list(ex.map(count_primes, [20_000, 30_000, 40_000])))`,
        [
          "Each call runs in its own process.",
          "The guard is required on spawn platforms.",
        ],
      ],
    ],
    mistakes: ["Using lambdas or closures as tasks.", "Submitting tiny tasks."],
    follow: ["What does BrokenProcessPool mean?"],
    points: [
      "Same interface as ThreadPoolExecutor",
      "Parallel CPU-bound work",
      "Picklable tasks and results",
      "Needs __main__ guard",
    ],
    notes: ["Same API, separate processes."],
    src: [
      [
        "Python: concurrent.futures.ProcessPoolExecutor",
        `${D}/library/concurrent.futures.html`,
      ],
      ["Python: multiprocessing", `${D}/library/multiprocessing.html`],
    ],
  }),
  q({
    slug: "as-completed-versus-map",
    topic: "concurrent.futures",
    d: "medium",
    title: "When do you use `executor.map`, `as_completed` and `wait`?",
    kw: [
      "as_completed",
      "executor.map",
      "futures.wait",
      "completion order",
      "first completed",
    ],
    intent: "Checks handling of results as they arrive.",
    short:
      "`executor.map` returns results in the order of the inputs, so a slow first task delays access to later results even if they are finished. `concurrent.futures.as_completed(futures)` yields futures as each one finishes, in completion order, which suits showing progress or handling results as soon as possible; keep a dictionary from future to input to know which item each belongs to. `wait(futures, return_when=FIRST_COMPLETED)` blocks until a condition is met and returns done and not-done sets, useful for 'first result wins' patterns. Each future's `result()` re-raises the task's exception.",
    detail: [
      "`as_completed` accepts a `timeout`.",
      "`map` is the simplest choice when order matters and tasks are similar.",
      "Wrap `result()` in `try`/`except` so one failure does not stop processing of the rest.",
    ],
    ex: "Downloading many files and updating a progress bar whenever any download finishes.",
    code: [
      [
        "as_completed",
        "python",
        `import time\nfrom concurrent.futures import ThreadPoolExecutor, as_completed\n\ndef fetch(n):\n    time.sleep(1 / n)\n    return n\n\nwith ThreadPoolExecutor() as ex:\n    futs = {ex.submit(fetch, n): n for n in (1, 2, 4)}\n    for f in as_completed(futs):\n        print("finished", futs[f], f.result())`,
        [
          "The fastest task prints first.",
          "The dict maps futures back to inputs.",
        ],
      ],
    ],
    mistakes: [
      "Assuming as_completed keeps input order.",
      "Letting one exception abort handling of all results.",
    ],
    follow: ["How does map order its results?"],
    points: [
      "map: input order",
      "as_completed: completion order",
      "wait for a condition",
      "Handle each future's exception",
    ],
    notes: ["Order versus speed of availability."],
    src: [
      [
        "Python: concurrent.futures.as_completed",
        `${D}/library/concurrent.futures.html`,
      ],
      [
        "Python: concurrent.futures.wait",
        `${D}/library/concurrent.futures.html`,
      ],
    ],
  }),
  q({
    slug: "future-exceptions-timeouts-cancel",
    topic: "concurrent.futures",
    d: "medium",
    title:
      "How do futures handle results, exceptions, timeouts and cancellation?",
    kw: [
      "Future",
      "result timeout",
      "future.exception",
      "cancel",
      "add_done_callback",
    ],
    intent: "Checks use of the Future object.",
    short:
      "A `Future` represents the eventual result of a call. `future.result()` blocks until it finishes and returns the value or re-raises the exception the task raised; `future.exception()` returns the exception instead of raising it. `result(timeout=5)` raises `TimeoutError` if it takes too long, but it does not stop the task: the work continues in its thread or process. `future.cancel()` succeeds only if the task has not started running yet. `done()` and `running()` report state, and `add_done_callback(fn)` runs `fn(future)` when it completes, which is useful for chaining without blocking.",
    detail: [
      "A timeout on `result` stops waiting, not working.",
      "Callbacks run in the thread that completes the future, or immediately if it is already done.",
      "Check `cancelled()` before calling `result()` on a cancelled future, which raises `CancelledError`.",
    ],
    ex: "Waiting at most two seconds for a remote call and falling back to cached data.",
    code: [
      [
        "Timeout does not cancel work",
        "python",
        `import time\nfrom concurrent.futures import ThreadPoolExecutor, TimeoutError\n\nwith ThreadPoolExecutor() as ex:\n    f = ex.submit(time.sleep, 2)\n    try:\n        f.result(timeout=0.1)\n    except TimeoutError:\n        print("gave up waiting, task still running:", f.running())`,
        ["The wait ends but the task continues."],
      ],
    ],
    mistakes: [
      "Assuming timeout cancels the task.",
      "Never calling result() and missing the exception.",
    ],
    follow: ["When can cancel() succeed?"],
    points: [
      "result() returns or re-raises",
      "exception() returns the error",
      "Timeout stops waiting, not working",
      "cancel only before start",
    ],
    notes: ["A promise of a result."],
    src: [
      [
        "Python: concurrent.futures.Future",
        `${D}/library/concurrent.futures.html`,
      ],
      ["Python: TimeoutError", `${D}/library/exceptions.html`],
    ],
  }),
  q({
    slug: "executor-shutdown-and-context-manager",
    topic: "concurrent.futures",
    d: "easy",
    title:
      "Why should executors be used with `with`, and what does `shutdown` do?",
    kw: [
      "executor shutdown",
      "with executor",
      "wait for tasks",
      "resource cleanup",
      "cancel_futures",
    ],
    intent: "Checks resource management for pools.",
    short:
      "An executor owns threads or processes, so it must be shut down to free them. Using `with ThreadPoolExecutor() as ex:` calls `ex.shutdown(wait=True)` on exit, which stops accepting new tasks and waits for pending ones to finish. Calling `shutdown(wait=False)` returns immediately while the workers finish in the background, and `cancel_futures=True` (3.9+) cancels tasks that have not started. Submitting work after shutdown raises `RuntimeError`. If you forget to shut down, the interpreter waits for worker threads at exit, which can look like a hang.",
    detail: [
      "Keep one long-lived executor for an application rather than creating one per task.",
      "Pending futures are still valid after the `with` block, with results available.",
      "Do not submit tasks that wait for other tasks in the same small pool, which can deadlock.",
    ],
    ex: "A script that never exits because an executor was created without a `with` block and still has idle threads.",
    mistakes: [
      "Creating a new executor for every task.",
      "Waiting on tasks that need a free worker in the same full pool.",
    ],
    follow: ["What does cancel_futures do?"],
    points: [
      "Use with for automatic shutdown",
      "shutdown(wait=True) waits for tasks",
      "cancel_futures cancels unstarted tasks",
      "No submissions after shutdown",
    ],
    notes: ["Always shut pools down."],
    src: [
      [
        "Python: concurrent.futures.Executor.shutdown",
        `${D}/library/concurrent.futures.html`,
      ],
      ["Python: concurrent.futures", `${D}/library/concurrent.futures.html`],
    ],
  }),
  q({
    slug: "executor-deadlock-nested-submit",
    topic: "concurrent.futures",
    d: "hard",
    title: "How can an executor deadlock when tasks wait on other tasks?",
    kw: [
      "executor deadlock",
      "nested submit",
      "pool starvation",
      "blocking on futures",
      "worker exhaustion",
    ],
    intent: "Checks understanding of pool limits.",
    short:
      "A deadlock occurs when a task running in the pool submits another task to the same pool and blocks waiting for its result. If all workers are busy running such waiting tasks, the inner tasks can never start, and everything stalls. The documentation gives this scenario for executors with a limited number of workers. Avoid it by not blocking on futures inside pool tasks, by structuring work in stages (collect results in the caller and submit the next stage), by using a separate executor for the inner work, or by giving the pool enough workers when nesting is unavoidable.",
    detail: [
      "The same starvation can happen with any bounded worker pool.",
      "Timeouts on `result()` help detect the problem rather than hanging forever.",
      "Asynchronous callbacks can chain work without blocking a worker.",
    ],
    ex: "A pool of two workers where each task submits a subtask and waits for it stalls permanently.",
    code: [
      [
        "Starvation",
        "python",
        `from concurrent.futures import ThreadPoolExecutor\n\nex = ThreadPoolExecutor(max_workers=1)\n\ndef outer():\n    inner = ex.submit(lambda: 42)   # needs a free worker\n    return inner.result(timeout=1)  # blocks the only worker\n\ntry:\n    ex.submit(outer).result()\nexcept Exception as e:\n    print(type(e).__name__)  # TimeoutError\nex.shutdown()`,
        ["The only worker waits for a task that can never start."],
      ],
    ],
    mistakes: [
      "Waiting for sub-tasks inside the same pool.",
      "Having no timeouts, so hangs go unnoticed.",
    ],
    follow: ["How can you restructure this work?"],
    points: [
      "Tasks waiting on tasks in the same pool",
      "All workers blocked, inner tasks never run",
      "Stage the work or use another pool",
      "Use timeouts",
    ],
    notes: ["Don't wait inside the pool for the pool."],
    src: [
      [
        "Python: concurrent.futures (deadlock example)",
        `${D}/library/concurrent.futures.html`,
      ],
      [
        "Python: concurrent.futures.Future.result",
        `${D}/library/concurrent.futures.html`,
      ],
    ],
  }),
])
