import { defineQuestions } from "../author"
import { q } from "../compact"

const K = "https://www.kernel.org/doc/html/latest"
const MAN = "https://man7.org/linux/man-pages"
const MS = "https://learn.microsoft.com/en-us/windows/win32"

export default defineQuestions("operating-systems", "fresher", [
  q({
    slug: "what-does-an-operating-system-do",
    topic: "Processes & threads",
    d: "easy",
    title: "What does an operating system do?",
    kw: [
      "operating system",
      "kernel",
      "resource management",
      "abstraction",
      "protection",
    ],
    intent: "A foundation question: checks you can list the OS's core jobs.",
    short:
      "An operating system manages the computer's hardware and gives programs a safe, uniform way to use it. Its main jobs are process and thread management and scheduling, memory management including virtual memory, file systems and storage, device management through drivers, security and access control, and providing interfaces such as system calls, libraries and a shell. The kernel is the core part that runs with full hardware privileges, while applications run in user mode with restricted access and ask the kernel for services.",
    detail: [
      "It shares limited resources, CPU, memory and devices, among many programs fairly.",
      "It isolates programs from each other so one cannot corrupt another.",
      "Examples are Linux, Windows and macOS.",
    ],
    ex: "When a program saves a file, it asks the OS, which finds free blocks, writes the data and updates the file system.",
    mistakes: [
      "Confusing the kernel with the whole OS distribution.",
      "Thinking applications control hardware directly.",
    ],
    follow: ["What is the difference between user mode and kernel mode?"],
    points: [
      "Manages CPU, memory, storage, devices",
      "Kernel has full privileges",
      "Applications use system calls",
      "Isolation and protection",
    ],
    notes: ["Resource manager and protector."],
    src: [
      ["Linux kernel documentation", `${K}/`],
      [
        "Microsoft Learn: User mode and kernel mode",
        "https://learn.microsoft.com/en-us/windows-hardware/drivers/gettingstarted/user-mode-and-kernel-mode",
      ],
    ],
  }),
  q({
    slug: "user-mode-vs-kernel-mode",
    topic: "System calls",
    d: "medium",
    title: "What is the difference between user mode and kernel mode?",
    kw: [
      "user mode",
      "kernel mode",
      "privilege levels",
      "protection",
      "system call boundary",
    ],
    intent: "Checks you understand the privilege boundary.",
    short:
      "CPUs support privilege levels. Kernel mode can execute any instruction and access all memory and hardware, and the operating system kernel and drivers run in it. User mode is restricted: application code cannot touch hardware or other processes' memory directly, and a violation triggers a fault. When an application needs a privileged service it makes a system call, which switches to kernel mode, runs kernel code on its behalf, and returns. This boundary stops a buggy or malicious program from crashing or taking over the system.",
    detail: [
      "A crash in user mode usually kills one process, while a kernel or driver crash can bring down the system.",
      "Switching modes has a cost, so programs batch I/O where they can.",
      "Virtual memory enforces the memory side of the boundary.",
    ],
    ex: "Reading a file from a program triggers a system call, entering the kernel to read the data and return it.",
    mistakes: [
      "Assuming user programs can access hardware.",
      "Writing drivers without considering that bugs are system-wide.",
    ],
    follow: ["What happens if user code tries a privileged instruction?"],
    points: [
      "Kernel mode: full access",
      "User mode: restricted",
      "System calls cross the boundary",
      "Protects the system",
    ],
    notes: ["Ask the kernel, do not take."],
    src: [
      [
        "Microsoft Learn: User mode and kernel mode",
        "https://learn.microsoft.com/en-us/windows-hardware/drivers/gettingstarted/user-mode-and-kernel-mode",
      ],
      ["syscalls(2)", `${MAN}/man2/syscalls.2.html`],
    ],
  }),
  q({
    slug: "system-calls-explained",
    topic: "System calls",
    d: "medium",
    title: "What is a system call, and how do programs use them?",
    kw: ["system call", "syscall", "libc wrapper", "open read write", "strace"],
    intent:
      "A core OS question: checks you know how programs ask the kernel for services.",
    short:
      "A system call is the controlled entry point into the kernel for services such as opening files, reading and writing, creating processes, allocating memory, and using the network. Programs usually call a wrapper in a library such as the C library (for example `open`, `read`, `write`, `fork`), which puts the arguments in registers, triggers the switch to kernel mode, and returns a result or an error code. Higher-level functions like `printf` or Node's `fs.readFile` eventually rely on system calls. On Linux, `strace` shows the system calls a program makes.",
    detail: [
      "Linux has hundreds of system calls, listed in `syscalls(2)`.",
      "Errors are reported through return values, with the reason in `errno`.",
      "Every crossing into the kernel has overhead, so fewer, larger operations are faster.",
    ],
    ex: "`strace ls` shows calls such as `openat`, `getdents64` and `write` as ls lists a directory.",
    mistakes: [
      "Many tiny writes instead of buffered ones.",
      "Ignoring error return values.",
    ],
    follow: ["How can you see a program's system calls?"],
    points: [
      "Entry point to kernel services",
      "Wrapped by library functions",
      "Return value and errno",
      "strace shows them",
    ],
    notes: ["Apps ask, kernel does."],
    src: [
      ["syscalls(2)", `${MAN}/man2/syscalls.2.html`],
      ["open(2)", `${MAN}/man2/open.2.html`],
      ["read(2)", `${MAN}/man2/read.2.html`],
    ],
  }),
  q({
    slug: "process-states-and-lifecycle",
    topic: "Processes & threads",
    d: "medium",
    title: "What are the states of a process?",
    kw: ["process states", "running", "sleeping", "zombie", "ready"],
    intent: "Checks you can describe the life cycle of a process.",
    short:
      "A process moves between states as it runs. It is ready (runnable) when it can run and is waiting for a CPU, running when it is on a CPU, and waiting or sleeping when it is blocked on something such as I/O or a lock. It ends in a terminated state, and on Unix a finished process remains as a zombie until its parent reads its exit status with `wait`. A stopped state exists for processes paused by a signal. Tools such as `ps` and `top` show these states, for example R for running, S for sleeping, D for uninterruptible I/O wait, T for stopped and Z for zombie.",
    detail: [
      "The scheduler moves processes between ready and running.",
      "A zombie uses almost no resources but occupies a process table entry.",
      "Many processes in D state may indicate slow storage.",
    ],
    ex: "A web server thread waiting for a database reply sleeps, and wakes up when the reply arrives.",
    mistakes: [
      "Trying to kill a zombie instead of fixing its parent.",
      "Ignoring processes stuck in uninterruptible sleep.",
    ],
    follow: ["What is a zombie process?"],
    points: [
      "Ready, running, waiting, terminated",
      "Zombie awaits parent's wait",
      "ps shows letters R S D T Z",
      "Blocked processes use no CPU",
    ],
    notes: ["Ready, running, blocked."],
    src: [
      ["ps(1): process state codes", `${MAN}/man1/ps.1.html`],
      ["wait(2)", `${MAN}/man2/wait.2.html`],
    ],
  }),
  q({
    slug: "fork-exec-process-creation",
    topic: "Processes & threads",
    d: "medium",
    title: "How are processes created in Unix: fork and exec?",
    kw: ["fork", "exec", "child process", "pid", "copy-on-write"],
    intent: "Checks you know how a shell starts a program.",
    short:
      "On Unix-like systems a process is created with `fork`, which makes a child process that is a copy of the parent, with its own PID, and returns in both: the child gets 0 and the parent gets the child's PID. The child usually then calls `exec` (such as `execve`), which replaces its memory with a new program. The parent can wait for the child with `wait`. Memory is copied lazily using copy-on-write, so fork is cheap. A shell runs a command by forking and then exec-ing the program.",
    detail: [
      "The child inherits open files and environment variables from the parent.",
      "`posix_spawn` and `clone` are related, more flexible calls.",
      "Windows uses `CreateProcess` instead.",
    ],
    ex: "Typing `ls` in a shell forks a child, the child execs `/bin/ls`, and the shell waits for it to finish.",
    mistakes: [
      "Forgetting to wait for children, leaving zombies.",
      "Assuming fork copies memory immediately.",
    ],
    follow: ["What does fork return in the child?"],
    points: [
      "fork duplicates the process",
      "exec replaces the program",
      "wait collects the exit status",
      "Copy-on-write keeps fork cheap",
    ],
    notes: ["fork then exec."],
    src: [
      ["fork(2)", `${MAN}/man2/fork.2.html`],
      ["execve(2)", `${MAN}/man2/execve.2.html`],
      ["wait(2)", `${MAN}/man2/wait.2.html`],
    ],
  }),
  q({
    slug: "signals-in-unix",
    topic: "Processes & threads",
    d: "medium",
    title: "What are signals, and what do SIGTERM, SIGKILL and SIGINT do?",
    kw: ["signals", "sigterm", "sigkill", "sigint", "kill command"],
    intent: "Checks you know how processes are asked to stop.",
    short:
      "Signals are asynchronous notifications sent to a process. `SIGINT` is sent by Ctrl+C to interrupt a program, `SIGTERM` politely asks it to terminate and can be caught so the program cleans up, and `SIGKILL` forcibly ends it immediately and cannot be caught or ignored. `kill <pid>` sends SIGTERM by default, and `kill -9` sends SIGKILL. Programs can install handlers for most signals, for example to flush data and close connections for a graceful shutdown. Use SIGKILL only if SIGTERM fails, since it gives no chance to clean up.",
    detail: [
      "`SIGHUP` is often used to ask daemons to reload configuration.",
      "`docker stop` and systemd send SIGTERM first and SIGKILL after a timeout.",
      "Only async-signal-safe functions may be used inside handlers in C.",
    ],
    ex: "A Node server handles SIGTERM by closing its HTTP server and exiting when pending requests finish.",
    mistakes: [
      "Using kill -9 as the first resort.",
      "Not handling SIGTERM in long-running services.",
    ],
    follow: ["Which signal cannot be caught?"],
    points: [
      "SIGINT from Ctrl+C",
      "SIGTERM catchable termination request",
      "SIGKILL cannot be caught",
      "Handle SIGTERM for graceful shutdown",
    ],
    notes: ["TERM first, KILL last."],
    src: [["signal(7)", `${MAN}/man7/signal.7.html`]],
  }),
  q({
    slug: "ipc-mechanisms",
    topic: "Processes & threads",
    d: "medium",
    title: "How do processes communicate with each other?",
    kw: [
      "inter-process communication",
      "pipes",
      "sockets",
      "shared memory",
      "message queues",
    ],
    intent:
      "Checks you know the options for exchanging data between processes.",
    short:
      "Because processes have separate address spaces, they use inter-process communication (IPC) mechanisms provided by the OS. Pipes pass a byte stream one way between related processes (`cmd1 | cmd2` uses one). Unix domain sockets and network sockets provide two-way communication between local or remote processes. Shared memory maps the same memory into several processes for the fastest exchange but needs synchronisation. Message queues, semaphores and signals cover other cases. Files can also be used as a simple, slower channel.",
    detail: [
      "Choose by direction, data size, speed and whether processes are on the same machine.",
      "Shared memory leaves coordination, such as locks, to the programs.",
      "Higher-level systems add queues and brokers on top.",
    ],
    ex: "A web server and a local database communicate over a Unix domain socket instead of a network port.",
    mistakes: [
      "Using shared memory without synchronisation.",
      "Using files for frequent communication.",
    ],
    follow: ["When is shared memory the right choice?"],
    points: [
      "Pipes: one-way streams",
      "Sockets: two-way, local or remote",
      "Shared memory: fastest, needs locks",
      "Queues, semaphores, signals",
    ],
    notes: ["Separate memory needs a channel."],
    src: [
      ["pipe(7)", `${MAN}/man7/pipe.7.html`],
      ["unix(7)", `${MAN}/man7/unix.7.html`],
      ["shm_overview(7)", `${MAN}/man7/shm_overview.7.html`],
    ],
  }),
  q({
    slug: "thread-pools-and-thread-costs",
    topic: "Processes & threads",
    d: "medium",
    title: "What is a thread pool and why not create a thread per task?",
    kw: [
      "thread pool",
      "worker threads",
      "thread cost",
      "task queue",
      "context switching",
    ],
    intent: "Checks you know how servers bound concurrency.",
    short:
      "Creating a thread has costs: memory for its stack, time to create and schedule it, and context-switching overhead when there are many. A thread pool starts a fixed number of worker threads that take tasks from a queue, reuse threads for many tasks, and limit concurrency, which keeps resource use predictable and avoids overload. Size the pool by the work: CPU-bound tasks fit roughly the number of cores, while tasks that wait on I/O can use more threads. When the queue fills, the system should apply back-pressure or reject work.",
    detail: [
      "Operating systems and runtimes provide pools, such as the Windows thread pool and Java's executors.",
      "Node.js uses a libuv thread pool for some file and crypto work.",
      "Too many threads can be slower than too few.",
    ],
    ex: "A web server handles requests with 200 worker threads instead of starting a new thread for each of thousands of requests.",
    mistakes: [
      "Unbounded thread creation.",
      "A pool size unrelated to the workload.",
    ],
    follow: ["How would you size a pool for CPU-bound work?"],
    points: [
      "Threads cost memory and switching",
      "Pools reuse a fixed set of workers",
      "Task queue buffers work",
      "Size by CPU or I/O needs",
    ],
    notes: ["Reuse threads, bound concurrency."],
    src: [
      ["Microsoft Learn: Thread pools", `${MS}/procthread/thread-pools`],
      ["pthreads(7)", `${MAN}/man7/pthreads.7.html`],
    ],
  }),
  q({
    slug: "cpu-scheduling-algorithms",
    topic: "CPU scheduling",
    d: "medium",
    title: "What are the common CPU scheduling algorithms?",
    kw: [
      "cpu scheduling",
      "fcfs",
      "round robin",
      "priority scheduling",
      "shortest job first",
    ],
    intent: "A classic OS question: checks you know the trade-offs.",
    short:
      "A scheduler decides which ready thread runs next. First-come first-served runs threads in arrival order: simple but long jobs delay short ones. Shortest job first minimises average waiting time but needs run-time estimates and can starve long jobs. Round robin gives each thread a fixed time slice in turn, which is fair and responsive for interactive work. Priority scheduling favours important threads, risking starvation of low-priority ones unless priorities age. Real systems combine ideas, using multilevel queues and fair-share designs such as Linux's default scheduler.",
    detail: [
      "Goals include throughput, response time, fairness and low overhead.",
      "Preemptive schedulers can interrupt running threads; non-preemptive ones cannot.",
      "The time slice length is a trade-off between responsiveness and switching overhead.",
    ],
    ex: "An interactive desktop prefers short slices so that clicks feel responsive, while batch jobs get larger slices.",
    mistakes: [
      "Assuming one algorithm is best for every workload.",
      "Ignoring starvation.",
    ],
    follow: ["What is starvation?"],
    points: [
      "FCFS, SJF, round robin, priority",
      "Preemptive vs non-preemptive",
      "Trade throughput against latency",
      "Aging prevents starvation",
    ],
    notes: ["Fair, responsive, efficient: pick two."],
    src: [
      ["sched(7)", `${MAN}/man7/sched.7.html`],
      ["Linux kernel: Scheduler", `${K}/scheduler/index.html`],
    ],
  }),
  q({
    slug: "linux-scheduling-policies-and-nice",
    topic: "CPU scheduling",
    d: "medium",
    title: "How does Linux schedule processes, and what does nice do?",
    kw: ["nice", "priority", "sched_other", "real-time scheduling", "renice"],
    intent: "Checks you can influence CPU priority on Linux.",
    short:
      "Linux has scheduling policies: the normal time-sharing policy (`SCHED_OTHER`, also called normal) shares CPU time fairly among ordinary processes, while real-time policies (`SCHED_FIFO` and `SCHED_RR`) give strict priority to latency-critical tasks and need privileges. For normal processes, the nice value from -20 (highest priority) to 19 (lowest) influences how much CPU share they get. Start a command with lower priority using `nice -n 10 cmd`, and change a running one with `renice`. Only privileged users can raise priority.",
    detail: [
      "Nice values affect the share of CPU time, not an absolute guarantee.",
      "`top` shows each process's priority and nice value.",
      "cgroups can limit CPU for groups of processes, as containers do.",
    ],
    ex: "A nightly backup is run with `nice -n 19` so it does not slow the web server.",
    code: [
      [
        "Lower a job's priority",
        "bash",
        `nice -n 10 ./backup.sh\nrenice -n 15 -p 1234`,
        [
          "`nice` starts with a higher nice value.",
          "`renice` changes a running process.",
        ],
      ],
    ],
    mistakes: [
      "Using real-time policies casually.",
      "Expecting nice to cap CPU usage.",
    ],
    follow: ["Which nice value is the lowest priority?"],
    points: [
      "Normal policy shares fairly",
      "Real-time policies for strict priority",
      "Nice -20 to 19",
      "renice changes running processes",
    ],
    notes: ["Higher nice means lower priority."],
    src: [
      ["sched(7)", `${MAN}/man7/sched.7.html`],
      ["nice(2)", `${MAN}/man2/nice.2.html`],
    ],
  }),
  q({
    slug: "scheduling-metrics-and-starvation",
    topic: "CPU scheduling",
    d: "hard",
    title:
      "What metrics describe scheduler performance, and what is starvation?",
    kw: [
      "turnaround time",
      "waiting time",
      "response time",
      "throughput",
      "starvation",
    ],
    intent: "Checks you can reason about scheduling quality.",
    short:
      "Common metrics are CPU utilisation (how busy the CPU is), throughput (jobs completed per unit time), turnaround time (from submission to completion), waiting time (time spent ready but not running), and response time (from request to first response). Interactive systems care most about response time; batch systems about throughput. Starvation occurs when a ready thread never gets the CPU because others always take precedence, for example low-priority work under constant high-priority load; aging, which gradually raises the priority of waiting threads, prevents it.",
    detail: [
      "Average waiting time is minimised by shortest-job-first, but that can starve long jobs.",
      "Fairness is a goal that sometimes conflicts with throughput.",
      "Load average on Linux summarises runnable and waiting tasks.",
    ],
    ex: "Three jobs arrive together; running the short ones first lowers the average waiting time.",
    mistakes: [
      "Optimising throughput at the expense of response time for interactive users.",
      "Priority systems without aging.",
    ],
    follow: ["How does aging help?"],
    points: [
      "Utilisation, throughput, turnaround, waiting, response",
      "Interactive vs batch goals",
      "Starvation = never scheduled",
      "Aging raises waiting priority",
    ],
    notes: ["Measure what users feel."],
    src: [
      ["sched(7)", `${MAN}/man7/sched.7.html`],
      [
        "Microsoft Learn: Scheduling priorities",
        `${MS}/procthread/scheduling-priorities`,
      ],
    ],
  }),
  q({
    slug: "paging-vs-segmentation-allocation",
    topic: "Memory management",
    d: "medium",
    title:
      "How does the OS manage memory: paging, fragmentation and allocation?",
    kw: ["paging", "fragmentation", "page size", "frames", "memory allocation"],
    intent: "Checks you know how physical memory is divided and used.",
    short:
      "Modern operating systems divide virtual memory into fixed-size pages, usually 4 KB, and physical memory into frames of the same size, mapping pages to frames with page tables. Fixed-size units avoid external fragmentation, where free memory is split into pieces too small to use, although a little internal fragmentation remains because the last page of an allocation is rarely full. Within a process, allocators such as `malloc` manage the heap, requesting more pages from the kernel with calls like `brk` and `mmap` as needed.",
    detail: [
      "Large pages (huge pages) reduce translation overhead for big workloads.",
      "The kernel zeroes pages before giving them to a process.",
      "Memory-mapped files are paged in on demand.",
    ],
    ex: "A program allocating 10 bytes still uses part of a page, and the heap grows by whole pages.",
    mistakes: [
      "Confusing virtual pages with physical frames.",
      "Ignoring memory fragmentation in long-running programs.",
    ],
    follow: ["What is internal fragmentation?"],
    points: [
      "Pages and frames of fixed size",
      "Page tables map them",
      "Internal vs external fragmentation",
      "Heap grows via brk or mmap",
    ],
    notes: ["Fixed-size pages avoid external fragmentation."],
    src: [
      [
        "Linux kernel: Memory management concepts",
        `${K}/admin-guide/mm/concepts.html`,
      ],
      ["mmap(2)", `${MAN}/man2/mmap.2.html`],
      ["malloc(3)", `${MAN}/man3/malloc.3.html`],
    ],
  }),
  q({
    slug: "page-replacement-algorithms",
    topic: "Memory management",
    d: "hard",
    title: "What happens when RAM is full: page replacement and thrashing?",
    kw: ["page replacement", "lru", "fifo", "thrashing", "working set"],
    intent: "Checks you know how the OS chooses which memory to evict.",
    short:
      "When physical memory is full and a new page is needed, the OS must evict a page. FIFO evicts the oldest page, simple but poor; the optimal policy evicts the page not needed for longest, which is impossible to know in advance but serves as a benchmark; LRU evicts the least recently used page, based on locality, and real systems use approximations of it. Dirty pages are written back before reuse. If the working set of active programs exceeds RAM, the system spends its time swapping pages in and out (thrashing) and performance collapses, so the fix is more memory or fewer or lighter workloads.",
    detail: [
      "The working set is the set of pages a process is actively using.",
      "Clean file-backed pages can be dropped without writing.",
      "Linux balances page cache and anonymous memory dynamically.",
    ],
    ex: "A server with too many processes starts swapping heavily, and response times jump from milliseconds to seconds.",
    mistakes: [
      "Believing a full RAM is always bad: the cache fills free memory on purpose.",
      "Adding swap instead of fixing memory demand.",
    ],
    follow: ["What is the working set?"],
    points: [
      "FIFO, optimal, LRU",
      "LRU uses locality",
      "Dirty pages are written back",
      "Thrashing = constant swapping",
    ],
    notes: ["Keep the working set in RAM."],
    src: [
      [
        "Linux kernel: Memory management concepts",
        `${K}/admin-guide/mm/concepts.html`,
      ],
      ["Microsoft Learn: Working set", `${MS}/memory/working-set`],
    ],
  }),
  q({
    slug: "memory-mapped-files-mmap",
    topic: "Memory management",
    d: "hard",
    title: "What is memory-mapped I/O (mmap) and when is it useful?",
    kw: [
      "mmap",
      "memory-mapped file",
      "shared mapping",
      "page cache",
      "lazy loading",
    ],
    intent: "Checks you know a way to treat a file as memory.",
    short:
      "`mmap` maps a file (or anonymous memory) into a process's address space, so the file's contents can be read and written like an array in memory instead of through read and write calls. Pages are loaded from disk on demand through page faults and share the kernel's page cache, so mapped files can avoid extra copying and let several processes share the same data. It is used by program loaders for executables and libraries, databases and large-file processing. Errors such as accessing past the end of the file can cause signals rather than return codes.",
    detail: [
      "Shared mappings let processes communicate through the same pages.",
      "Changes are written back to the file according to the mapping type and flush calls.",
      "For simple sequential reads, ordinary buffered I/O is often just as fast.",
    ],
    ex: "A search tool maps a large index file and reads from it as if it were an in-memory array.",
    mistakes: [
      "Assuming mmap is always faster.",
      "Forgetting that I/O errors appear as signals.",
    ],
    follow: ["How are mapped pages loaded?"],
    points: [
      "File treated as memory",
      "Pages load on demand",
      "Uses the page cache",
      "Good for random access and sharing",
    ],
    notes: ["Map it, then index it."],
    src: [["mmap(2)", `${MAN}/man2/mmap.2.html`]],
  }),
  q({
    slug: "file-system-structure-inodes",
    topic: "File systems",
    d: "medium",
    title: "How do Unix file systems store files: inodes and directories?",
    kw: ["inode", "directory entry", "hard link", "block", "metadata"],
    intent: "Checks you understand what a file is on disk.",
    short:
      "In Unix-style file systems a file is described by an inode, a structure holding metadata (owner, permissions, size, timestamps, link count) and the location of the data blocks, but not the file's name. A directory is a special file that maps names to inode numbers, so one inode can have several names (hard links). Deleting a name reduces the link count, and the data is freed when the count reaches zero and no process has the file open. Symbolic links are separate small files that contain a path. `ls -i` shows inode numbers.",
    detail: [
      "A file system can run out of inodes before it runs out of space (`df -i`).",
      "Renaming within a file system only changes directory entries.",
      "Hard links cannot cross file systems.",
    ],
    ex: "`ln a.txt b.txt` creates a second name for the same inode, so editing one shows in the other.",
    mistakes: [
      "Confusing hard links with symbolic links.",
      "Ignoring inode exhaustion.",
    ],
    follow: ["What does a directory contain?"],
    points: [
      "Inode = metadata and block locations",
      "Directory maps names to inodes",
      "Hard links share an inode",
      "Link count controls deletion",
    ],
    notes: ["Names live in directories, data via inodes."],
    src: [
      ["inode(7)", `${MAN}/man7/inode.7.html`],
      ["Linux kernel: Overview of the Linux VFS", `${K}/filesystems/vfs.html`],
    ],
  }),
  q({
    slug: "file-permissions-and-access-control",
    topic: "File systems",
    d: "easy",
    title: "How do file permissions work in Unix?",
    kw: ["file permissions", "rwx", "chmod", "owner group others", "umask"],
    intent: "A staple question: checks you can read and set permissions.",
    short:
      "Each file has an owner, a group, and permission bits for three classes: owner, group and others. Each class can have read (r, 4), write (w, 2) and execute (x, 1) permission, so `rwxr-xr--` is 754. For directories, read lists the names, write allows creating and deleting entries, and execute allows entering and accessing items. Change them with `chmod` (for example `chmod 640 file` or `chmod u+x script.sh`), and change ownership with `chown`. The default permissions for new files are set by the process's umask.",
    detail: [
      "Special bits include setuid, setgid and the sticky bit, used for shared directories like /tmp.",
      "Follow least privilege: give only the access needed.",
      "`ls -l` shows the permissions.",
    ],
    ex: "A private key file is set to `chmod 600`, so only its owner can read and write it.",
    code: [
      [
        "Common chmod uses",
        "bash",
        `chmod 755 deploy.sh   # rwxr-xr-x\nchmod 600 key.pem      # rw-------\nchmod u+x run.sh       # add execute for owner`,
        [
          "Numbers add r=4, w=2, x=1 per class.",
          "Symbolic form adjusts specific bits.",
        ],
      ],
    ],
    mistakes: [
      "Using chmod 777 to fix errors.",
      "Forgetting directories need the execute bit.",
    ],
    follow: ["What does 755 mean?"],
    points: [
      "Owner, group, others",
      "r=4, w=2, x=1",
      "Directories need x to enter",
      "umask sets defaults",
    ],
    notes: ["Least privilege: avoid 777."],
    src: [
      ["inode(7): file mode", `${MAN}/man7/inode.7.html`],
      ["credentials(7)", `${MAN}/man7/credentials.7.html`],
    ],
  }),
  q({
    slug: "journaling-and-crash-consistency",
    topic: "File systems",
    d: "hard",
    title: "What is journaling in a file system?",
    kw: ["journaling", "crash consistency", "ext4", "fsck", "write-ahead log"],
    intent: "Checks you understand how file systems survive crashes.",
    short:
      "A journaling file system, such as ext4, first records the intended metadata changes in a log (the journal) and then applies them to the main structures. After a crash or power loss, the system replays or discards the journal, so the file system returns to a consistent state quickly instead of needing a long full scan with `fsck`. Journaling protects the file system's structure, and, depending on the mode, may not protect the contents of files being written, so applications that need durability must call `fsync`.",
    detail: [
      "Write-ahead logging is the same idea used by databases.",
      "Copy-on-write file systems like Btrfs take another approach to consistency.",
      "Disks and controllers can cache writes, which affects durability.",
    ],
    ex: "After an unclean shutdown, an ext4 volume mounts within seconds because the journal is replayed.",
    mistakes: [
      "Assuming journaling guarantees your data was saved.",
      "Skipping fsync for critical files.",
    ],
    follow: ["Why call fsync?"],
    points: [
      "Log intended changes first",
      "Replay after a crash",
      "Protects structure, not necessarily data",
      "fsync for durability",
    ],
    notes: ["Log first, then apply."],
    src: [
      ["Linux kernel: ext4 documentation", `${K}/filesystems/ext4/index.html`],
      ["Linux kernel: Filesystems", `${K}/filesystems/index.html`],
    ],
  }),
  q({
    slug: "file-descriptors-and-redirection",
    topic: "File systems",
    d: "medium",
    title: "What are file descriptors, and what are stdin, stdout and stderr?",
    kw: [
      "file descriptor",
      "stdin stdout stderr",
      "redirection",
      "open files limit",
      "ulimit",
    ],
    intent: "Checks you know how processes refer to open files.",
    short:
      "A file descriptor is a small integer a process uses to refer to an open file, socket, pipe or device. Every process starts with three: 0 is standard input (stdin), 1 is standard output (stdout) and 2 is standard error (stderr). Shells redirect them: `>` sends stdout to a file, `2>` sends stderr, and `|` connects one program's stdout to another's stdin. Each process has a limit on open descriptors (`ulimit -n`), and leaking them, by not closing files or sockets, eventually causes 'too many open files' errors.",
    detail: [
      "Network connections count as descriptors too.",
      "`lsof -p <pid>` lists a process's open files.",
      "Web servers handling many connections often need a higher limit.",
    ],
    ex: "`node app.js > out.log 2> err.log` writes normal output and errors to different files.",
    mistakes: [
      "Not closing files or sockets.",
      "Forgetting stderr when redirecting output.",
    ],
    follow: ["What causes 'too many open files'?"],
    points: [
      "Descriptor = integer handle",
      "0 stdin, 1 stdout, 2 stderr",
      "Redirect with > and 2>",
      "Limits and leaks",
    ],
    notes: ["Everything is a file descriptor."],
    src: [
      ["open(2)", `${MAN}/man2/open.2.html`],
      ["pipe(7)", `${MAN}/man7/pipe.7.html`],
    ],
  }),
  q({
    slug: "race-conditions-and-critical-sections",
    topic: "Synchronization & deadlocks",
    d: "medium",
    title: "What is a race condition and a critical section?",
    kw: [
      "race condition",
      "critical section",
      "shared state",
      "mutual exclusion",
      "atomicity",
    ],
    intent:
      "A core concurrency question: checks you can explain why locking exists.",
    short:
      "A race condition occurs when the result depends on the unpredictable timing of threads or processes accessing shared data. For example, two threads doing `counter++` can both read the same value and both write back the same result, losing an update, because the increment is a read, modify and write sequence, not one atomic step. The code that accesses the shared data is a critical section, and it must be protected so only one thread at a time can run it, with mutual exclusion using locks, or by using atomic operations or avoiding shared mutable state.",
    detail: [
      "Races are timing-dependent, so they appear rarely and are hard to reproduce.",
      "Immutable data and message passing avoid many races.",
      "Tools like thread sanitisers can detect them.",
    ],
    ex: "Two requests withdraw from the same account balance at the same time and both succeed, overdrawing the account.",
    mistakes: [
      "Assuming simple operations like ++ are atomic.",
      "Locking too little, or too much and hurting performance.",
    ],
    follow: ["How do you protect a critical section?"],
    points: [
      "Outcome depends on timing",
      "Read-modify-write is not atomic",
      "Critical section needs mutual exclusion",
      "Prefer immutability or atomics",
    ],
    notes: ["Shared mutable state needs protection."],
    src: [
      ["pthreads(7)", `${MAN}/man7/pthreads.7.html`],
      ["Microsoft Learn: Synchronization", `${MS}/sync/synchronization`],
    ],
  }),
  q({
    slug: "mutex-vs-semaphore",
    topic: "Synchronization & deadlocks",
    d: "medium",
    title: "What is the difference between a mutex and a semaphore?",
    kw: [
      "mutex",
      "semaphore",
      "binary semaphore",
      "ownership",
      "counting semaphore",
    ],
    intent: "A classic comparison question.",
    short:
      "A mutex (mutual exclusion lock) protects a critical section: a thread locks it before entering and unlocks it after, and the thread that locked it is its owner, so only that thread should unlock it. A semaphore holds a counter that controls access to a limited number of resources: `wait` (or P) decrements it and blocks at zero, and `post` (or V) increments it. A binary semaphore behaves like a lock but without ownership, and a counting semaphore lets up to N holders in, for example a pool of N connections. Use a mutex for exclusive access and a semaphore for counting or signalling.",
    detail: [
      "Semaphores can signal between threads: one posts when work is ready, another waits.",
      "A condition variable lets threads wait for a condition while releasing a mutex.",
      "Always unlock in all code paths, including errors.",
    ],
    ex: "A connection pool of 10 uses a counting semaphore so the eleventh thread waits until a connection is released.",
    mistakes: [
      "Forgetting to unlock a mutex.",
      "Using a semaphore where ownership matters.",
    ],
    follow: ["What does a counting semaphore do?"],
    points: [
      "Mutex: exclusive lock with an owner",
      "Semaphore: counter of permits",
      "Binary semaphore resembles a lock",
      "Counting semaphore limits concurrency",
    ],
    notes: ["Mutex excludes; semaphore counts."],
    src: [
      ["sem_overview(7)", `${MAN}/man7/sem_overview.7.html`],
      ["pthread_mutex_lock(3p)", `${MAN}/man3/pthread_mutex_lock.3p.html`],
    ],
  }),
  q({
    slug: "deadlock-conditions-and-prevention",
    topic: "Synchronization & deadlocks",
    d: "medium",
    title: "What is a deadlock, and how can it be prevented?",
    kw: [
      "deadlock",
      "coffman conditions",
      "lock ordering",
      "circular wait",
      "livelock",
    ],
    intent:
      "A core question: checks you know the four conditions and a practical fix.",
    short:
      "A deadlock occurs when threads wait for each other forever, each holding a resource another needs. It requires four conditions together: mutual exclusion (resources cannot be shared), hold and wait (a thread holds one resource while waiting for another), no preemption (resources cannot be taken away), and circular wait (a cycle of threads each waiting on the next). Break any one to prevent deadlock. The most practical method is a global lock ordering: every thread acquires locks in the same order. Other options are acquiring all locks at once, using timeouts with `trylock`, or avoiding locks.",
    detail: [
      "Livelock is when threads keep reacting to each other without making progress.",
      "Databases detect deadlocks and abort one transaction.",
      "Keep critical sections short and avoid calling unknown code while holding a lock.",
    ],
    ex: "Thread A locks X then Y while thread B locks Y then X; both block forever.",
    mistakes: [
      "Inconsistent lock ordering.",
      "Holding a lock while doing slow I/O.",
    ],
    follow: ["Name the four conditions."],
    points: [
      "Threads wait for each other forever",
      "Four necessary conditions",
      "Break one to prevent it",
      "Consistent lock ordering",
    ],
    notes: ["Always lock in the same order."],
    src: [
      ["pthread_mutex_lock(3p)", `${MAN}/man3/pthread_mutex_lock.3p.html`],
      ["Linux kernel: Mutex design", `${K}/locking/mutex-design.html`],
    ],
  }),
  q({
    slug: "producer-consumer-and-condition-variables",
    topic: "Synchronization & deadlocks",
    d: "hard",
    title: "What is the producer-consumer problem, and how is it solved?",
    kw: [
      "producer consumer",
      "bounded buffer",
      "condition variable",
      "blocking queue",
      "semaphores",
    ],
    intent:
      "A classic synchronisation pattern; checks you can coordinate threads.",
    short:
      "In the producer-consumer problem, producer threads add items to a shared buffer and consumer threads remove them. The buffer has a limited size, so producers must wait when it is full, and consumers must wait when it is empty, and access to the buffer itself must be mutually exclusive. It is solved with a mutex plus condition variables (or two counting semaphores for empty and full slots): a producer waits while full and signals after adding; a consumer waits while empty and signals after removing. Languages provide this ready-made as blocking queues.",
    detail: [
      "Always re-check the condition in a loop after waking, because wake-ups can be spurious.",
      "Queues decouple the speed of producers and consumers.",
      "Message brokers apply the same idea across processes and machines.",
    ],
    ex: "A web server's request threads (producers) put jobs in a queue and a worker pool (consumers) processes them.",
    mistakes: [
      "Checking the condition with `if` instead of a loop.",
      "Unbounded buffers that grow without limit.",
    ],
    follow: ["Why is the buffer bounded?"],
    points: [
      "Shared bounded buffer",
      "Wait when full or empty",
      "Mutex plus condition variables or semaphores",
      "Blocking queues package it",
    ],
    notes: ["Wait, signal, re-check."],
    src: [
      ["pthreads(7)", `${MAN}/man7/pthreads.7.html`],
      ["sem_overview(7)", `${MAN}/man7/sem_overview.7.html`],
    ],
  }),
  q({
    slug: "io-models-blocking-nonblocking-async",
    topic: "System calls",
    d: "hard",
    title:
      "What is the difference between blocking, non-blocking and asynchronous I/O?",
    kw: [
      "blocking io",
      "non-blocking io",
      "epoll",
      "event loop",
      "asynchronous io",
    ],
    intent:
      "Checks you understand the I/O models that Node.js and servers build on.",
    short:
      "With blocking I/O, a call such as `read` suspends the thread until data is available. With non-blocking I/O, the call returns immediately, perhaps with 'would block', and the program checks again or waits for readiness with a multiplexing call such as `select`, `poll` or Linux `epoll`, which reports which of many descriptors are ready. Asynchronous I/O starts an operation and gets notified on completion. Servers like nginx and Node.js use an event loop over non-blocking I/O to handle thousands of connections with few threads.",
    detail: [
      "Thread-per-connection is simple but uses more memory at high connection counts.",
      "CPU-heavy work still blocks an event loop, so it goes to workers.",
      "Readiness notification differs from completion notification.",
    ],
    ex: "Node's event loop uses the operating system's readiness mechanism to serve many sockets on one thread.",
    mistakes: [
      "Blocking the event loop with heavy computation.",
      "Assuming non-blocking means asynchronous completion.",
    ],
    follow: ["What does epoll do?"],
    points: [
      "Blocking waits",
      "Non-blocking returns at once",
      "epoll reports ready descriptors",
      "Event loops scale connections",
    ],
    notes: ["Do not wait, ask what is ready."],
    src: [
      ["epoll(7)", `${MAN}/man7/epoll.7.html`],
      ["aio(7)", `${MAN}/man7/aio.7.html`],
    ],
  }),
  q({
    slug: "containers-namespaces-cgroups",
    topic: "System calls",
    d: "hard",
    title: "How do Linux containers use namespaces and cgroups?",
    kw: ["namespaces", "cgroups", "containers", "isolation", "resource limits"],
    intent: "Checks you know what containers are built from.",
    short:
      "A Linux container is a normal process isolated with kernel features. Namespaces give a process its own view of system resources: separate process IDs, network interfaces, mount points, hostname, users and more, so the container sees only its own. Control groups (cgroups) limit and account for resources, such as CPU, memory and I/O, used by a group of processes. Combined with a layered file system image, they produce containers without a separate kernel, which is why they start fast and share the host kernel.",
    detail: [
      "A container's PID 1 is just a process in a PID namespace.",
      "Memory limits are enforced by cgroups, and exceeding them triggers the OOM killer inside the group.",
      "Isolation is weaker than a virtual machine because the kernel is shared.",
    ],
    ex: "`docker run --memory 512m` sets a cgroup memory limit for the container's processes.",
    mistakes: [
      "Calling containers lightweight VMs.",
      "Running containers as root without need.",
    ],
    follow: ["What do cgroups limit?"],
    points: [
      "Namespaces isolate views",
      "Cgroups limit resources",
      "Shared host kernel",
      "Weaker isolation than VMs",
    ],
    notes: ["Namespaces for view, cgroups for limits."],
    src: [
      ["namespaces(7)", `${MAN}/man7/namespaces.7.html`],
      ["cgroups(7)", `${MAN}/man7/cgroups.7.html`],
      ["Linux kernel: Control Group v2", `${K}/admin-guide/cgroup-v2.html`],
    ],
  }),
  q({
    slug: "virtualization-vs-containers-hypervisors",
    topic: "System calls",
    d: "medium",
    title:
      "What is a hypervisor, and how does virtualization differ from containers?",
    kw: ["hypervisor", "virtual machine", "kvm", "guest os", "virtualization"],
    intent:
      "Checks you understand the layers between hardware and applications.",
    short:
      "A hypervisor creates and runs virtual machines, each with virtualised hardware and its own guest operating system and kernel. A type 1 hypervisor runs directly on the hardware (as KVM in Linux does), and a type 2 runs on a host operating system. Virtual machines give strong isolation and can run different operating systems, but they are heavier and slower to start. Containers share the host's kernel and isolate processes instead, so they are lighter. Clouds typically run containers inside virtual machines to combine isolation and efficiency.",
    detail: [
      "Hardware support for virtualisation makes VMs efficient.",
      "VM images contain a full operating system; container images do not.",
      "The choice depends on isolation needs, startup time and density.",
    ],
    ex: "A cloud instance is a virtual machine on a hypervisor; the app inside it runs in containers.",
    mistakes: [
      "Assuming containers are as isolated as VMs.",
      "Running a different OS kernel inside a Linux container.",
    ],
    follow: ["What is the difference between type 1 and type 2 hypervisors?"],
    points: [
      "Hypervisor runs VMs with guest kernels",
      "Type 1 on hardware, type 2 on a host OS",
      "VMs: strong isolation, heavier",
      "Containers share the host kernel",
    ],
    notes: ["VMs virtualise hardware, containers virtualise the OS view."],
    src: [
      ["Linux kernel: documentation index", `${K}/`],
      ["namespaces(7)", `${MAN}/man7/namespaces.7.html`],
    ],
  }),
])
