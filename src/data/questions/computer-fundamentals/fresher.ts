import { defineQuestions } from "../author"
import { q } from "../compact"

const K = "https://www.kernel.org/doc/html/latest"
const MAN = "https://man7.org/linux/man-pages"
const MDN = "https://developer.mozilla.org/en-US/docs"
const MS = "https://learn.microsoft.com/en-us/windows/win32"

export default defineQuestions("computer-fundamentals", "fresher", [
  q({
    slug: "what-does-a-cpu-do",
    topic: "CPU & instruction cycle",
    d: "easy",
    title: "What does the CPU do, and what are cores, sockets and threads?",
    kw: ["cpu", "cores", "threads", "sockets", "processor"],
    intent:
      "A foundation question: checks you can describe the processor and its terms.",
    short:
      "The CPU, or processor, executes the instructions of programs: it performs arithmetic and logic, moves data and controls the flow of execution. A physical chip in a socket contains one or more cores, and each core can execute instructions independently, so more cores allow more work in parallel. Some cores run two hardware threads (simultaneous multithreading) that share the core's resources to keep it busy. On Linux, `lscpu` reports the number of sockets, cores, threads per core and caches.",
    detail: [
      "A program with a single thread uses one core at a time.",
      "More cores help only if the software can split work into parallel parts.",
      "Virtual machines show the CPU layout of the guest, which may differ from the host.",
    ],
    ex: "A laptop CPU with 8 cores and 2 threads per core appears as 16 logical processors.",
    mistakes: [
      "Assuming more cores always make one program faster.",
      "Confusing cores with threads.",
    ],
    follow: ["What does lscpu show?"],
    points: [
      "CPU executes instructions",
      "Sockets contain cores",
      "Cores can have several hardware threads",
      "Parallel speed-up needs parallel software",
    ],
    notes: ["Socket, core, thread."],
    src: [
      ["lscpu(1)", `${MAN}/man1/lscpu.1.html`],
      ["Linux kernel: CPU topology", `${K}/admin-guide/cputopology.html`],
    ],
  }),
  q({
    slug: "instruction-cycle-fetch-decode-execute",
    topic: "CPU & instruction cycle",
    d: "easy",
    title: "What is the fetch-decode-execute cycle?",
    kw: [
      "instruction cycle",
      "fetch decode execute",
      "program counter",
      "machine code",
      "pipeline",
    ],
    intent: "Checks you know how a CPU runs a program step by step.",
    short:
      "A CPU repeats a cycle for every instruction. It fetches the next instruction from memory at the address held in the program counter, decodes it to work out which operation and operands are involved, executes it (for example an addition or a memory access in the arithmetic logic unit), and writes back the result, then moves the program counter on. Modern CPUs overlap these steps in a pipeline and execute several instructions at once, but the programmer-visible effect is as if they ran one after another.",
    detail: [
      "Programs in high-level languages are compiled or interpreted into machine instructions.",
      "Jumps and function calls change the program counter.",
      "Tools such as `perf stat` report counts of CPU cycles and instructions.",
    ],
    ex: "Adding two numbers is fetched as an instruction, decoded, executed by the ALU and its result stored in a register.",
    mistakes: [
      "Thinking a CPU understands source code directly.",
      "Ignoring that memory access is much slower than register access.",
    ],
    follow: ["What does the program counter hold?"],
    points: [
      "Fetch, decode, execute, write back",
      "Program counter points to the next instruction",
      "Pipelines overlap the stages",
      "Machine code is the CPU's language",
    ],
    notes: ["Fetch, decode, execute, repeat."],
    src: [
      ["perf-stat(1): cycles and instructions", `${MAN}/man1/perf-stat.1.html`],
      ["lscpu(1)", `${MAN}/man1/lscpu.1.html`],
    ],
  }),
  q({
    slug: "clock-speed-vs-performance",
    topic: "CPU & instruction cycle",
    d: "medium",
    title: "Is a higher clock speed always faster?",
    kw: ["clock speed", "ghz", "ipc", "frequency scaling", "performance"],
    intent: "Checks you know performance is more than one number.",
    short:
      "Clock speed, in gigahertz, is how many cycles a core runs per second, but speed depends also on how much work each cycle does (instructions per cycle), the number of cores, cache sizes and memory speed. A newer design at a lower clock can beat an older one at a higher clock. CPUs also change frequency dynamically to save power or avoid overheating, so the speed varies with load; Linux exposes this through the cpufreq subsystem. Compare processors on real workloads, not on gigahertz alone.",
    detail: [
      "Power and heat limit how long a CPU can run at its peak frequency.",
      "Memory-bound programs may not speed up with a faster clock.",
      "Benchmarks should resemble the actual workload.",
    ],
    ex: "A server CPU with a lower clock but more cores and larger cache handles a web workload better than a faster dual-core chip.",
    mistakes: ["Comparing CPUs by GHz only.", "Ignoring thermal throttling."],
    follow: ["What else affects speed besides the clock?"],
    points: [
      "Clock = cycles per second",
      "Work per cycle matters",
      "Cores, cache and memory matter",
      "Frequency changes dynamically",
    ],
    notes: ["GHz is not the whole story."],
    src: [
      [
        "Linux kernel: CPU performance scaling",
        `${K}/admin-guide/pm/cpufreq.html`,
      ],
      ["perf-stat(1)", `${MAN}/man1/perf-stat.1.html`],
    ],
  }),
  q({
    slug: "registers-cache-ram-hierarchy",
    topic: "Memory (RAM and cache)",
    d: "easy",
    title: "What is the memory hierarchy: registers, cache, RAM and storage?",
    kw: ["memory hierarchy", "registers", "cpu cache", "ram", "latency"],
    intent: "A core question: checks you know why memory is layered.",
    short:
      "Computers use layers of memory that trade speed against size and cost. Registers inside the CPU are the fastest and tiniest. Next come CPU caches (L1, L2, often L3), small and very fast memories that hold recently used data. Main memory (RAM) is much larger but slower, and storage such as SSDs and disks is larger again, slower again, and keeps data when power is off. Programs run faster when the data they need is found in the upper layers, which is why locality of access matters.",
    detail: [
      "Each cache level is bigger and slower than the one above it.",
      "RAM is volatile; storage is persistent.",
      "`lscpu` lists the sizes of the CPU caches.",
    ],
    ex: "Looping over an array in order is fast because neighbouring elements are already in the cache.",
    mistakes: [
      "Treating all memory as equally fast.",
      "Confusing RAM with disk storage.",
    ],
    follow: ["Why do caches help?"],
    points: [
      "Registers, cache, RAM, storage",
      "Faster layers are smaller",
      "RAM is volatile",
      "Locality improves speed",
    ],
    notes: ["Small and fast to large and slow."],
    src: [
      ["lscpu(1): cache information", `${MAN}/man1/lscpu.1.html`],
      [
        "Linux kernel: Memory management concepts",
        `${K}/admin-guide/mm/concepts.html`,
      ],
    ],
  }),
  q({
    slug: "cache-hit-miss-and-locality",
    topic: "Memory (RAM and cache)",
    d: "medium",
    title: "What are cache hits, misses and locality of reference?",
    kw: [
      "cache hit",
      "cache miss",
      "spatial locality",
      "temporal locality",
      "cache line",
    ],
    intent: "Checks you understand why access patterns affect speed.",
    short:
      "A cache hit means the CPU finds the data in the cache and gets it quickly; a miss means it must fetch it from a slower level, which takes many more cycles. Caches work because programs show locality: temporal locality, using the same data again soon, and spatial locality, using data near what was just used. Data is moved in blocks called cache lines, so reading the next elements of an array is cheap after the first miss. Code that jumps around memory unpredictably suffers more misses.",
    detail: [
      "Arrays are more cache-friendly than linked structures scattered in memory.",
      "Iterating a 2D array in the wrong order can be several times slower.",
      "Measuring beats guessing; use a profiler.",
    ],
    ex: "Summing a big matrix row by row is faster than column by column when it is stored by rows.",
    mistakes: [
      "Optimising without measuring.",
      "Assuming memory access has a constant cost.",
    ],
    follow: ["What is a cache line?"],
    points: [
      "Hit = fast, miss = slow",
      "Temporal and spatial locality",
      "Data moves in cache lines",
      "Access order matters",
    ],
    notes: ["Keep related data close and in order."],
    src: [
      ["perf-stat(1): cache events", `${MAN}/man1/perf-stat.1.html`],
      ["lscpu(1): caches", `${MAN}/man1/lscpu.1.html`],
    ],
  }),
  q({
    slug: "virtual-memory-basics",
    topic: "Memory (RAM and cache)",
    d: "medium",
    title: "What is virtual memory and why do operating systems use it?",
    kw: [
      "virtual memory",
      "address translation",
      "mmu",
      "page table",
      "isolation",
    ],
    intent: "Checks you understand the illusion of private memory.",
    short:
      "Virtual memory gives every process its own address space that the CPU's memory management unit translates to physical memory using page tables. It hides the details of physical memory from applications, lets the system keep only the needed pages in RAM (demand paging), and provides protection and controlled sharing between processes, since one process cannot address another's memory by accident. It also makes each process see a large contiguous space even if the physical memory is fragmented.",
    detail: [
      "Memory is managed in fixed-size units called pages.",
      "A translation lookaside buffer (TLB) caches recent address translations.",
      "Shared libraries can be mapped into many processes while using one copy in RAM.",
    ],
    ex: "Two processes both use address 0x1000 but it maps to different physical pages.",
    mistakes: [
      "Thinking virtual memory means disk memory only.",
      "Believing processes share one address space.",
    ],
    follow: ["What does the MMU do?"],
    points: [
      "Per-process address spaces",
      "MMU translates with page tables",
      "Demand paging",
      "Protection and sharing",
    ],
    notes: ["Private addresses, shared hardware."],
    src: [
      [
        "Linux kernel: Memory management concepts",
        `${K}/admin-guide/mm/concepts.html`,
      ],
      [
        "Microsoft Learn: Virtual address space",
        `${MS}/memory/virtual-address-space`,
      ],
    ],
  }),
  q({
    slug: "stack-vs-heap-memory",
    topic: "Memory (RAM and cache)",
    d: "medium",
    title: "What is the difference between the stack and the heap?",
    kw: ["stack", "heap", "call stack", "dynamic allocation", "stack overflow"],
    intent:
      "A classic question: checks you know where data lives while a program runs.",
    short:
      "The stack holds the data of function calls: parameters, return addresses and local variables, in frames that are pushed when a function is called and popped when it returns, so allocation is automatic and fast but limited in size. The heap holds data allocated dynamically at run time, which can outlive the function that created it and can be large, but must be managed: freed manually in languages like C, or reclaimed by a garbage collector in languages like Java and JavaScript. Too-deep recursion overflows the stack.",
    detail: [
      "Each thread has its own stack, while the heap is shared by the process.",
      "Heap allocation is slower and can fragment memory.",
      "In JavaScript, primitives and references are on the stack while objects live on the heap.",
    ],
    ex: "A recursive function without a base case fills the call stack and crashes with a stack overflow.",
    mistakes: [
      "Unbounded recursion.",
      "Forgetting to free heap memory in languages that need it.",
    ],
    follow: ["What causes a stack overflow?"],
    points: [
      "Stack: call frames, automatic",
      "Heap: dynamic, flexible lifetime",
      "Stack is small and fast",
      "Heap needs freeing or GC",
    ],
    notes: ["Stack for calls, heap for long-lived data."],
    src: [
      ["MDN: Call stack", `${MDN}/Glossary/Call_stack`],
      [
        "MDN: Memory management",
        `${MDN}/Web/JavaScript/Guide/Memory_management`,
      ],
      ["Microsoft Learn: Heap functions", `${MS}/memory/heap-functions`],
    ],
  }),
  q({
    slug: "paging-and-page-faults",
    topic: "Memory (RAM and cache)",
    d: "medium",
    title: "What are pages and page faults?",
    kw: ["paging", "page fault", "demand paging", "page table", "swap"],
    intent: "Checks you know what happens when memory is not resident.",
    short:
      "Virtual memory is divided into fixed-size pages that map to frames of physical memory. A page fault occurs when a program touches a page that is not currently mapped to RAM. The operating system handles it: it may allocate and zero a new page, load the page from a file or from swap space on disk, or terminate the process if the access was invalid. Faults that need disk reads are slow, and heavy swapping (thrashing) makes a system crawl.",
    detail: [
      "Not every fault is an error; demand paging relies on them.",
      "Memory-mapped files are loaded page by page when first accessed.",
      "Monitor swapping and major faults when diagnosing slowness.",
    ],
    ex: "Starting a large program only loads the parts of it that are actually executed.",
    mistakes: [
      "Assuming all page faults are bugs.",
      "Ignoring swap activity on a slow server.",
    ],
    follow: ["What is thrashing?"],
    points: [
      "Pages map virtual to physical frames",
      "Fault = page not resident",
      "OS loads, allocates or kills",
      "Disk-backed faults are slow",
    ],
    notes: ["A fault is a request for memory."],
    src: [
      [
        "Linux kernel: Memory management concepts",
        `${K}/admin-guide/mm/concepts.html`,
      ],
      ["Microsoft Learn: Page state", `${MS}/memory/page-state`],
    ],
  }),
  q({
    slug: "swap-and-out-of-memory",
    topic: "Memory (RAM and cache)",
    d: "medium",
    title:
      "What is swap space, and what happens when a system runs out of memory?",
    kw: ["swap", "oom killer", "overcommit", "memory pressure", "free -h"],
    intent: "Checks you can reason about memory exhaustion on a server.",
    short:
      "Swap is disk space the operating system can use to move rarely used memory pages out of RAM, freeing RAM for active data. It lets a system hold more than RAM alone, but disk is far slower, so heavy swapping makes everything slow. If memory and swap are exhausted, the Linux kernel's out-of-memory (OOM) killer chooses a process to terminate to recover. Check usage with `free -h`, size servers with headroom, set memory limits for containers, and fix leaks rather than adding swap.",
    detail: [
      "Linux can allow allocations beyond available memory (overcommit) based on its accounting policy.",
      "`swapon --show` lists swap areas.",
      "A process killed by the OOM killer often shows exit code 137 in containers.",
    ],
    ex: "A Node process with a memory leak grows until the OOM killer ends it.",
    mistakes: [
      "Relying on swap to hide a memory leak.",
      "No memory limits on a shared host.",
    ],
    follow: ["What does the OOM killer do?"],
    points: [
      "Swap extends RAM using disk",
      "Swapping is slow",
      "OOM killer ends processes when exhausted",
      "Monitor and set limits",
    ],
    notes: ["Swap is a safety net, not capacity."],
    src: [
      ["free(1)", `${MAN}/man1/free.1.html`],
      ["swapon(8)", `${MAN}/man8/swapon.8.html`],
      [
        "Linux kernel: Overcommit accounting",
        `${K}/mm/overcommit-accounting.html`,
      ],
    ],
  }),
  q({
    slug: "memory-leaks-and-garbage-collection",
    topic: "Memory (RAM and cache)",
    d: "medium",
    title:
      "What is a memory leak and how does garbage collection relate to it?",
    kw: [
      "memory leak",
      "garbage collection",
      "reachability",
      "references",
      "heap growth",
    ],
    intent: "Checks you understand leaks even in managed languages.",
    short:
      "A memory leak is memory that is no longer needed but is never released, so usage keeps growing. In languages like C it happens when allocated memory is not freed. Garbage-collected languages such as JavaScript and Java free objects that are no longer reachable, but leaks still occur when something keeps a reference to unneeded objects, for example growing caches, forgotten event listeners, timers, or global variables. Heap profilers help find what is retaining memory.",
    detail: [
      "The collector frees unreachable objects automatically, not objects you no longer need but still reference.",
      "Bound caches with size limits and expiry.",
      "Remove listeners and clear timers when components are destroyed.",
    ],
    ex: "A server stores every request in a global array for debugging, and memory grows until it crashes.",
    mistakes: [
      "Assuming garbage collection prevents all leaks.",
      "Unbounded in-memory caches.",
    ],
    follow: ["What does reachable mean?"],
    points: [
      "Unneeded memory not released",
      "GC frees unreachable objects only",
      "Leaks come from lingering references",
      "Use heap profiling",
    ],
    notes: ["GC cannot free what you still hold."],
    src: [
      [
        "MDN: Memory management",
        `${MDN}/Web/JavaScript/Guide/Memory_management`,
      ],
      ["MDN: Garbage collection", `${MDN}/Glossary/Garbage_collection`],
    ],
  }),
  q({
    slug: "ram-vs-storage",
    topic: "Storage",
    d: "easy",
    title: "What is the difference between RAM and storage?",
    kw: ["ram", "storage", "volatile", "persistent", "ssd"],
    intent: "A basic question that interviewers use to check clarity.",
    short:
      "RAM is the computer's working memory: it is very fast and holds the programs and data currently in use, but it is volatile, so its contents are lost when the power goes off. Storage, such as an SSD or hard disk, is slower and larger and persistent: it keeps files and programs permanently. When you open a program, it is loaded from storage into RAM to run. More RAM lets you work with more data at once, while more storage lets you keep more files.",
    detail: [
      "Databases keep data on storage and cache hot data in RAM.",
      "When RAM runs out, systems may swap pages to storage, which is slow.",
      "RAM is accessed in bytes at very low latency; storage is accessed in blocks.",
    ],
    ex: "A 16 GB RAM laptop with a 1 TB SSD can store a lot but only hold 16 GB of active working data.",
    mistakes: [
      "Calling disk space 'memory' in a technical discussion.",
      "Expecting data in RAM to survive a restart.",
    ],
    follow: ["What happens to RAM contents at power off?"],
    points: [
      "RAM: fast, volatile, working memory",
      "Storage: slower, persistent",
      "Programs load from storage to RAM",
      "Both sizes matter for different reasons",
    ],
    notes: ["RAM is temporary, storage is permanent."],
    src: [
      [
        "Linux kernel: Memory management concepts",
        `${K}/admin-guide/mm/concepts.html`,
      ],
      ["free(1)", `${MAN}/man1/free.1.html`],
    ],
  }),
  q({
    slug: "hdd-vs-ssd",
    topic: "Storage",
    d: "easy",
    title: "What is the difference between an HDD and an SSD?",
    kw: ["hdd", "ssd", "nvme", "trim", "random access"],
    intent: "Checks you know the practical difference in speed and wear.",
    short:
      "A hard disk drive stores data on spinning magnetic platters read by a moving head, so it is cheap per gigabyte but slower, especially for random access, and sensitive to movement. A solid-state drive stores data in flash memory with no moving parts, so it is much faster, quieter and better at many small reads and writes, but flash cells wear with writes and cost more per gigabyte. NVMe SSDs connect over PCIe for even higher throughput. On Linux, `fstrim` tells an SSD which blocks are no longer used so it can maintain performance.",
    detail: [
      "Use SSDs for databases and operating systems, and HDDs for cheap bulk or archive storage.",
      "Drives can fail, so backups and redundancy matter for both.",
      "Performance is measured in throughput (MB/s), IOPS and latency.",
    ],
    ex: "A database server on SSD handles many more random reads than the same server on HDD.",
    mistakes: [
      "Assuming SSDs never fail.",
      "Putting a busy database on a slow disk.",
    ],
    follow: ["What does TRIM do?"],
    points: [
      "HDD: spinning platters",
      "SSD: flash, no moving parts",
      "SSD faster for random access",
      "Both need backups",
    ],
    notes: ["HDD for capacity, SSD for speed."],
    src: [
      ["fstrim(8)", `${MAN}/man8/fstrim.8.html`],
      ["Linux kernel: I/O statistics fields", `${K}/admin-guide/iostats.html`],
    ],
  }),
  q({
    slug: "file-system-basics",
    topic: "Storage",
    d: "easy",
    title: "What is a file system?",
    kw: ["file system", "ext4", "ntfs", "directories", "inodes"],
    intent: "Checks you know how data on disk becomes files and folders.",
    short:
      "A file system is the structure an operating system uses to organise data on a storage device into files and directories, tracking names, sizes, permissions, timestamps and where the data blocks are. Common examples are ext4 and XFS on Linux, NTFS on Windows, and APFS on macOS. Before use, a disk partition is formatted with a file system, then mounted at a location in the directory tree. Journaling file systems record changes first so they recover quickly and consistently after a crash.",
    detail: [
      "Different file systems differ in features such as maximum file size, permissions and snapshots.",
      "Virtual file systems like `/proc` expose kernel information as files.",
      "The Linux VFS layer lets many file systems share one interface.",
    ],
    ex: "A server's data disk is formatted as ext4 and mounted at `/data`.",
    mistakes: [
      "Confusing a partition with a file system.",
      "Removing a drive without unmounting it.",
    ],
    follow: ["What does journaling provide?"],
    points: [
      "Organises files and directories",
      "Formatting creates a file system",
      "Mounting attaches it to the tree",
      "Journaling aids crash recovery",
    ],
    notes: ["Partition, format, mount."],
    src: [
      [
        "Linux kernel: Filesystems documentation",
        `${K}/filesystems/index.html`,
      ],
      ["Microsoft Learn: File systems", `${MS}/fileio/file-systems`],
    ],
  }),
  q({
    slug: "partitions-mounting-fstab",
    topic: "Storage",
    d: "medium",
    title: "What are partitions, and how do mounting and /etc/fstab work?",
    kw: ["partition", "mount", "fstab", "lsblk", "mount point"],
    intent: "Checks you can attach storage on Linux.",
    short:
      "A partition is a section of a disk treated as a separate device, created with tools such as `fdisk`. After creating a file system on it with `mkfs`, you mount it at a directory, the mount point, with `mount /dev/sdb1 /data`, and then its files appear under that directory. The mount lasts until reboot unless it is listed in `/etc/fstab`, which describes which devices to mount, where, with which file system type and options, at boot. A mistake in fstab can stop the system booting normally, so test with `mount -a`.",
    detail: [
      "Prefer UUIDs in fstab because device names such as /dev/sdb can change.",
      "`lsblk` lists block devices and partitions.",
      "`df -h` shows free space on mounted file systems.",
    ],
    ex: "A new data disk is partitioned, formatted as ext4, and mounted at `/data` automatically through an fstab line.",
    mistakes: [
      "Using device names instead of UUIDs in fstab.",
      "Editing fstab without testing it.",
    ],
    follow: ["What does mount -a do?"],
    points: [
      "Partition, mkfs, mount",
      "Mount point is a directory",
      "fstab makes mounts permanent",
      "Use UUIDs and test",
    ],
    notes: ["fdisk, mkfs, mount, fstab."],
    src: [
      ["fdisk(8)", `${MAN}/man8/fdisk.8.html`],
      ["mount(8)", `${MAN}/man8/mount.8.html`],
      ["fstab(5)", `${MAN}/man5/fstab.5.html`],
    ],
  }),
  q({
    slug: "raid-levels-basics",
    topic: "Storage",
    d: "medium",
    title: "What is RAID and what do the common levels offer?",
    kw: ["raid", "striping", "mirroring", "parity", "redundancy"],
    intent:
      "Checks you understand redundancy versus performance, and that RAID is not a backup.",
    short:
      "RAID combines several disks into one logical device for performance, redundancy or both. RAID 0 stripes data across disks for speed and capacity but has no redundancy, so one failure loses everything. RAID 1 mirrors data on two disks, tolerating one failure at the cost of half the capacity. RAID 5 stripes with distributed parity and survives one disk failure, and RAID 6 survives two. RAID 10 combines mirroring and striping. RAID protects against disk failure but not against deletion, corruption or disasters, so it does not replace backups.",
    detail: [
      "Linux software RAID is provided by the md driver.",
      "Rebuilding after a failure takes time and stresses the remaining disks.",
      "Cloud block storage and managed databases handle redundancy for you.",
    ],
    ex: "A small file server mirrors two disks with RAID 1 and also backs up nightly to another location.",
    mistakes: [
      "Treating RAID as a backup.",
      "Using RAID 0 for important data.",
    ],
    follow: ["How many failures can RAID 5 tolerate?"],
    points: [
      "RAID 0 speed, no redundancy",
      "RAID 1 mirror",
      "RAID 5/6 parity",
      "Not a backup",
    ],
    notes: ["Redundancy is not backup."],
    src: [["Linux kernel: Software RAID (md)", `${K}/admin-guide/md.html`]],
  }),
  q({
    slug: "disk-space-monitoring-df-du",
    topic: "Storage",
    d: "easy",
    title: "How do you check free disk space and find what is using it?",
    kw: ["df -h", "du -sh", "disk full", "inodes", "log files"],
    intent: "Checks you can diagnose a full disk.",
    short:
      "`df -h` shows the size, used and free space of each mounted file system in human-readable units, and `df -i` shows inode usage, since running out of inodes also stops new files. `du -sh *` summarises the size of each item in the current directory, and `du -h --max-depth=1 /var` drills down to find the largest folders. Common culprits are logs, caches, old Docker images and temporary files. Clean up carefully, rotate logs, and set up monitoring to alert before the disk fills.",
    detail: [
      "A full disk can crash databases and make logins fail.",
      "Deleting a file that a process still has open does not free the space until the process closes it.",
      "`ncdu` is a handy interactive tool, if installed.",
    ],
    ex: "`du -h --max-depth=1 /var | sort -h` shows that `/var/log` holds most of the used space.",
    code: [
      [
        "Find the space hog",
        "bash",
        `df -h\ndu -h --max-depth=1 /var | sort -h | tail`,
        [
          "`df` shows which file system is full.",
          "`du` ranks directories by size.",
        ],
      ],
    ],
    mistakes: ["Deleting files at random.", "Forgetting to check inodes."],
    follow: ["What does df -i show?"],
    points: [
      "df shows file system usage",
      "du shows directory sizes",
      "Check inodes too",
      "Rotate logs, monitor",
    ],
    notes: ["df for where, du for what."],
    src: [
      ["df(1)", `${MAN}/man1/df.1.html`],
      ["du(1)", `${MAN}/man1/du.1.html`],
    ],
  }),
  q({
    slug: "program-vs-process",
    topic: "Processes & programs",
    d: "easy",
    title: "What is the difference between a program and a process?",
    kw: ["program", "process", "pid", "executable", "running instance"],
    intent:
      "A foundation question: checks you separate the file from the running thing.",
    short:
      "A program is a passive set of instructions stored on disk as an executable file. A process is a running instance of a program: the operating system gives it its own virtual address space, a process ID (PID), open files, and state, and schedules its threads on the CPU. The same program can run as several processes at once, each with its own memory. When a process ends, its resources are released by the operating system.",
    detail: [
      "A process contains at least one thread of execution.",
      "On Linux, `ps` and `top` list processes with their PIDs.",
      "Processes are isolated from each other and communicate via defined mechanisms.",
    ],
    ex: "Opening a browser twice creates two processes from the same program file.",
    mistakes: [
      "Calling the executable file a process.",
      "Assuming processes share memory by default.",
    ],
    follow: ["What identifies a process?"],
    points: [
      "Program = file on disk",
      "Process = running instance",
      "Own address space and PID",
      "Many processes per program possible",
    ],
    notes: ["Program is the recipe, process is the cooking."],
    src: [
      [
        "Microsoft Learn: About processes and threads",
        `${MS}/procthread/about-processes-and-threads`,
      ],
      ["ps(1)", `${MAN}/man1/ps.1.html`],
    ],
  }),
  q({
    slug: "process-vs-thread-basics",
    topic: "Processes & programs",
    d: "easy",
    title: "What is the difference between a process and a thread?",
    kw: ["process", "thread", "shared memory", "concurrency", "isolation"],
    intent: "One of the most common fundamentals questions.",
    short:
      "A process is an isolated running program with its own address space and resources. A thread is a unit of execution inside a process; the threads of one process share its memory and open files but each has its own stack and registers. Threads are cheaper to create and switch between and can share data easily, but that sharing needs synchronisation to avoid race conditions, and a crash in one thread can bring down the whole process. Separate processes are better isolated but must use inter-process communication to share data.",
    detail: [
      "Multithreading lets a program use several CPU cores.",
      "Node.js runs JavaScript on one main thread and offloads work to a thread pool and workers.",
      "Linux implements both through the same kernel mechanism with different sharing.",
    ],
    ex: "A browser uses separate processes for tabs for isolation, and many threads inside each for work.",
    mistakes: [
      "Sharing mutable data between threads without locks.",
      "Assuming more threads is always faster.",
    ],
    follow: ["What do threads in one process share?"],
    points: [
      "Process: isolated memory",
      "Thread: execution inside a process",
      "Threads share memory, own stack",
      "Sharing needs synchronisation",
    ],
    notes: ["Processes isolate, threads share."],
    src: [
      [
        "Microsoft Learn: About processes and threads",
        `${MS}/procthread/about-processes-and-threads`,
      ],
      ["pthreads(7)", `${MAN}/man7/pthreads.7.html`],
    ],
  }),
  q({
    slug: "process-memory-layout",
    topic: "Processes & programs",
    d: "medium",
    title: "How is a process's memory laid out?",
    kw: ["memory layout", "text segment", "data segment", "heap", "stack"],
    intent: "Checks you know the regions of a process address space.",
    short:
      "A process's virtual address space is divided into regions. The text (code) segment holds the machine instructions and is usually read-only and executable. The data segments hold global and static variables, initialised and uninitialised (BSS). The heap grows for dynamic allocations, and each thread has a stack for call frames and local variables. Shared libraries and memory-mapped files are mapped into other regions. On Linux you can view a process's mappings in `/proc/<pid>/maps`.",
    detail: [
      "Read-only code segments let multiple processes share the same physical pages.",
      "Writing to a read-only region causes a fault and the process is terminated.",
      "Address space layout randomisation makes addresses less predictable to attackers.",
    ],
    ex: "`cat /proc/self/maps` prints the mappings of the `cat` process itself.",
    mistakes: [
      "Confusing the heap and stack regions.",
      "Assuming addresses are the same on every run.",
    ],
    follow: ["Where do global variables live?"],
    points: [
      "Text, data/BSS, heap, stack",
      "Code is read-only and executable",
      "Libraries are mapped in",
      "/proc/pid/maps shows mappings",
    ],
    notes: ["Code, data, heap, stack."],
    src: [
      ["proc(5): /proc/pid/maps", `${MAN}/man5/proc.5.html`],
      [
        "Microsoft Learn: Virtual address space",
        `${MS}/memory/virtual-address-space`,
      ],
    ],
  }),
  q({
    slug: "context-switch-and-multitasking",
    topic: "Processes & programs",
    d: "medium",
    title: "How does a single CPU core run many programs at once?",
    kw: [
      "multitasking",
      "context switch",
      "time slice",
      "scheduler",
      "preemption",
    ],
    intent: "Checks you understand time-sharing.",
    short:
      "The operating system's scheduler gives each runnable thread a short time slice on a core and then switches to another, quickly enough that programs seem to run simultaneously. Saving the state of one thread (registers, program counter) and restoring another's is a context switch. Preemptive multitasking means the OS can interrupt a thread when its slice ends, rather than waiting for it to yield. Switching has a cost, so having far more runnable threads than cores adds overhead without adding speed.",
    detail: [
      "True parallelism needs multiple cores; one core only interleaves.",
      "Threads blocked on I/O do not use CPU time until ready.",
      "Priorities influence which threads run first.",
    ],
    ex: "A music player, browser and editor all appear to run at once on a single core machine.",
    mistakes: [
      "Assuming concurrency means parallelism.",
      "Creating thousands of CPU-bound threads.",
    ],
    follow: ["What is saved during a context switch?"],
    points: [
      "Time slices per thread",
      "Context switch saves and restores state",
      "Preemptive scheduling",
      "Switching has a cost",
    ],
    notes: ["Interleave quickly."],
    src: [
      [
        "Microsoft Learn: Context switches",
        `${MS}/procthread/context-switches`,
      ],
      ["sched(7)", `${MAN}/man7/sched.7.html`],
    ],
  }),
  q({
    slug: "compiled-vs-interpreted-execution",
    topic: "Processes & programs",
    d: "medium",
    title: "How does source code become something the CPU can run?",
    kw: ["compiler", "interpreter", "bytecode", "jit", "machine code"],
    intent: "Checks you know the main execution models.",
    short:
      "A CPU runs machine code. Compiled languages such as C and Go are translated ahead of time into machine code for a platform. Interpreted languages are executed by a program that reads and runs the code, often after turning it into an intermediate form. Many languages combine both: Java compiles to bytecode that the JVM interprets and compiles at run time with a just-in-time (JIT) compiler, and JavaScript engines also use JIT compilation for hot code. The choice trades start-up time, peak speed, portability and tooling.",
    detail: [
      "Compiled binaries are tied to an operating system and CPU architecture.",
      "Bytecode is portable across platforms with a runtime.",
      "JIT compilers optimise code based on how it actually runs.",
    ],
    ex: "A Java program is compiled to `.class` files, and the JVM turns frequently used methods into machine code while running.",
    mistakes: [
      "Calling a language 'slow' just because it is interpreted.",
      "Expecting a compiled binary to run on any OS.",
    ],
    follow: ["What does a JIT compiler do?"],
    points: [
      "CPU runs machine code",
      "Ahead-of-time compilation",
      "Interpreters and bytecode",
      "JIT compiles hot code at run time",
    ],
    notes: ["Compile early, interpret, or JIT."],
    src: [
      [
        "MDN: JavaScript technologies overview",
        `${MDN}/Web/JavaScript/Guide/Introduction`,
      ],
      [
        "Microsoft Learn: About processes and threads",
        `${MS}/procthread/about-processes-and-threads`,
      ],
    ],
  }),
  q({
    slug: "binary-and-hexadecimal",
    topic: "Binary & data representation",
    d: "easy",
    title: "How do binary and hexadecimal numbers work?",
    kw: ["binary", "hexadecimal", "base 2", "base 16", "bits and bytes"],
    intent:
      "A basic skill check: reading and converting numbers in other bases.",
    short:
      "Computers store everything as bits, which are 0 or 1. Binary is base 2, where each digit position is a power of two, so `1011` is 8 + 2 + 1 = 11. A byte is 8 bits and can hold 256 values (0 to 255). Hexadecimal is base 16 with digits 0 to 9 and A to F, and one hex digit represents exactly four bits, so a byte is two hex digits; `0xFF` is 255. Hex is a compact, readable way to write binary values such as colours, memory addresses and byte dumps.",
    detail: [
      "In JavaScript, `0b1011` and `0xff` are binary and hexadecimal literals, and `n.toString(2)` converts to binary text.",
      "Each extra bit doubles the number of values.",
      '`parseInt("ff", 16)` converts hex text to a number.',
    ],
    ex: "The CSS colour `#ff8800` is three bytes: red 255, green 136, blue 0.",
    code: [
      [
        "Bases in JavaScript",
        "js",
        `console.log(0b1011)        // 11\nconsole.log(0xff)          // 255\nconsole.log((11).toString(2))   // "1011"\nconsole.log(parseInt("ff", 16)) // 255`,
        [
          "Literals use 0b and 0x prefixes.",
          "`toString(2)` shows binary.",
          "`parseInt` reads other bases.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting that one byte holds 256 values, not 255.",
      "Mixing up bits and bytes.",
    ],
    follow: ["How many values fit in 10 bits?"],
    points: [
      "Bit = 0 or 1",
      "Byte = 8 bits",
      "Hex digit = 4 bits",
      "Prefixes 0b and 0x in JS",
    ],
    notes: ["Two hex digits make a byte."],
    src: [
      [
        "MDN: Numeric literals",
        `${MDN}/Web/JavaScript/Reference/Lexical_grammar#numeric_literals`,
      ],
      [
        "MDN: Bitwise operators",
        `${MDN}/Web/JavaScript/Reference/Operators/Bitwise_AND`,
      ],
    ],
  }),
  q({
    slug: "bitwise-operators-uses",
    topic: "Binary & data representation",
    d: "medium",
    title: "What are bitwise operators and when are they used?",
    kw: ["bitwise and or xor", "bit shift", "bit mask", "flags", "permissions"],
    intent: "Checks you can manipulate individual bits.",
    short:
      "Bitwise operators work on the binary representation of integers: AND (`&`) keeps bits set in both, OR (`|`) sets bits set in either, XOR (`^`) sets bits that differ, NOT (`~`) flips all bits, and shifts (`<<`, `>>`) move bits left or right, which multiplies or divides by powers of two. They are used for flags and permissions packed into one integer, masks that test or set particular bits, hashing, and low-level protocols. In JavaScript, bitwise operators convert operands to 32-bit signed integers.",
    detail: [
      "Test a flag with `value & FLAG`, set it with `value | FLAG`, clear it with `value & ~FLAG`.",
      "Linux file permissions are bits: read 4, write 2, execute 1.",
      "Use BigInt for integers larger than 32 bits.",
    ],
    ex: "Permissions `rwx` are 4 + 2 + 1 = 7, so `chmod 755` sets rwx for the owner and r-x for others.",
    code: [
      [
        "Flags with bit masks",
        "js",
        `const READ = 1, WRITE = 2, EXEC = 4\nlet perms = READ | WRITE        // 3\nconsole.log((perms & WRITE) !== 0) // true\nperms &= ~WRITE                 // clear write`,
        ["OR combines flags.", "AND tests a flag.", "AND with NOT clears it."],
      ],
    ],
    mistakes: [
      "Confusing & with &&.",
      "Expecting 64-bit behaviour from JavaScript's bitwise operators.",
    ],
    follow: ["How do you clear a bit?"],
    points: [
      "AND, OR, XOR, NOT, shifts",
      "Masks test and set bits",
      "Flags packed in integers",
      "JS uses 32-bit integers",
    ],
    notes: ["& tests, | sets, & ~ clears."],
    src: [
      [
        "MDN: Bitwise operators",
        `${MDN}/Web/JavaScript/Reference/Operators/Bitwise_AND`,
      ],
      ["MDN: BigInt", `${MDN}/Web/JavaScript/Reference/Global_Objects/BigInt`],
    ],
  }),
  q({
    slug: "twos-complement-signed-integers",
    topic: "Binary & data representation",
    d: "medium",
    title: "How are negative integers stored, and what is integer overflow?",
    kw: ["two's complement", "signed integer", "overflow", "32-bit", "range"],
    intent: "Checks you know how fixed-width integers behave.",
    short:
      "Most computers store signed integers in two's complement: the top bit indicates the sign, and a negative number is represented by inverting the bits of its magnitude and adding one. In n bits the range is -2^(n-1) to 2^(n-1)-1, so 32 bits give -2,147,483,648 to 2,147,483,647. If a calculation exceeds the range, it overflows and wraps around in many languages, producing a wrong value, while others raise errors or use arbitrary-precision integers. JavaScript's bitwise operators use 32-bit two's complement, and BigInt avoids overflow.",
    detail: [
      "Overflow bugs have caused security problems, so validate sizes and sums.",
      "Java's `int` is 32 bits and wraps silently; `Math.addExact` throws on overflow.",
      "Unsigned integers have no sign bit and a range from 0.",
    ],
    ex: "In a 32-bit `int`, 2,147,483,647 + 1 becomes -2,147,483,648.",
    mistakes: [
      "Ignoring overflow when summing large values.",
      "Using `int` for money or large counts.",
    ],
    follow: ["What range does a signed 8-bit integer have?"],
    points: [
      "Two's complement representation",
      "Range -2^(n-1) to 2^(n-1)-1",
      "Overflow wraps in many languages",
      "Use wider types or BigInt",
    ],
    notes: ["Fixed width means limits."],
    src: [
      [
        "MDN: Bitwise operators (two's complement)",
        `${MDN}/Web/JavaScript/Reference/Operators/Bitwise_AND`,
      ],
      ["MDN: BigInt", `${MDN}/Web/JavaScript/Reference/Global_Objects/BigInt`],
    ],
  }),
  q({
    slug: "floating-point-precision",
    topic: "Binary & data representation",
    d: "medium",
    title: "Why does 0.1 + 0.2 not equal 0.3?",
    kw: [
      "floating point",
      "ieee 754",
      "precision",
      "0.1 + 0.2",
      "decimal money",
    ],
    intent: "A classic: checks you understand binary floating point.",
    short:
      "Most programming languages store non-integer numbers as binary floating point (IEEE 754). Many decimal fractions, such as 0.1 and 0.2, have no exact binary representation, just like 1/3 has no exact decimal one, so they are stored as close approximations and the sum is `0.30000000000000004` in JavaScript. Compare floats with a tolerance instead of `===`, and never use floating point for money: use integers in the smallest unit (such as paise or cents) or a decimal type.",
    detail: [
      "JavaScript's Number is a 64-bit double, with about 15 to 17 significant digits.",
      "`Number.EPSILON` helps with tolerance comparisons.",
      "Rounding for display is done with `toFixed` or `Intl.NumberFormat`.",
    ],
    ex: "A billing system stores amounts as integer paise to avoid rounding errors.",
    code: [
      [
        "Float comparison",
        "js",
        `console.log(0.1 + 0.2)            // 0.30000000000000004\nconsole.log(0.1 + 0.2 === 0.3)    // false\nconsole.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON) // true`,
        ["The sum is an approximation.", "Compare with a tolerance."],
      ],
    ],
    mistakes: ["Comparing floats with ===.", "Storing money as floats."],
    follow: ["How do you store currency safely?"],
    points: [
      "Binary floating point approximates",
      "Not every decimal is exact",
      "Compare with tolerance",
      "Money as integers or decimals",
    ],
    notes: ["Floats approximate."],
    src: [
      [
        "MDN: Number (floating-point precision)",
        `${MDN}/Web/JavaScript/Reference/Global_Objects/Number`,
      ],
    ],
  }),
  q({
    slug: "ascii-unicode-utf8",
    topic: "Binary & data representation",
    d: "medium",
    title: "What are ASCII, Unicode and UTF-8?",
    kw: ["ascii", "unicode", "utf-8", "character encoding", "code point"],
    intent: "Checks you understand how text is stored as bytes.",
    short:
      "A character encoding maps characters to numbers and bytes. ASCII defines 128 characters, covering English letters, digits and punctuation, in 7 bits. Unicode is a universal character set that assigns a code point to characters from all writing systems, plus symbols and emoji. UTF-8 is the dominant encoding of Unicode: it uses one to four bytes per code point, is identical to ASCII for the first 128 characters, and is the recommended encoding for the web. Always declare and use UTF-8 consistently, or non-English text is garbled.",
    detail: [
      "The number of characters is not the number of bytes: `é` takes two bytes in UTF-8.",
      "In JavaScript, strings use UTF-16, so some emoji take two code units.",
      "`TextEncoder` converts a string to UTF-8 bytes.",
    ],
    ex: "The letter A is one byte (65), whereas the Hindi letter अ takes three bytes in UTF-8.",
    mistakes: [
      "Assuming one character equals one byte.",
      "Mixing encodings between database, file and web page.",
    ],
    follow: ["Why is UTF-8 compatible with ASCII?"],
    points: [
      "ASCII: 128 characters",
      "Unicode: code points for all scripts",
      "UTF-8: 1 to 4 bytes",
      "Use UTF-8 everywhere",
    ],
    notes: ["Unicode is the set, UTF-8 is a way to store it."],
    src: [
      ["MDN: ASCII", `${MDN}/Glossary/ASCII`],
      ["MDN: Unicode", `${MDN}/Glossary/Unicode`],
      ["MDN: UTF-8", `${MDN}/Glossary/UTF-8`],
    ],
  }),
  q({
    slug: "endianness-and-byte-order",
    topic: "Binary & data representation",
    d: "hard",
    title: "What is endianness?",
    kw: [
      "endianness",
      "little endian",
      "big endian",
      "byte order",
      "network byte order",
    ],
    intent: "Checks you know that multi-byte values have a byte order.",
    short:
      "Endianness is the order in which the bytes of a multi-byte number are stored in memory or sent over a wire. Little-endian stores the least significant byte first, as x86 and most ARM systems do, and big-endian stores the most significant byte first, as many network protocols do (network byte order). It matters when reading binary files, working with sockets, or exchanging raw data between systems. In JavaScript, `DataView` lets you read and write numbers in an explicit byte order.",
    detail: [
      "The value 0x12345678 is stored as 78 56 34 12 on a little-endian machine.",
      "Typed arrays use the platform's byte order, while DataView takes a flag.",
      "Text encodings like UTF-16 also have byte order variants.",
    ],
    ex: "A protocol parser uses `view.getUint16(0, false)` to read a big-endian length field.",
    mistakes: [
      "Assuming your machine's byte order in a file format.",
      "Ignoring byte order when parsing network packets.",
    ],
    follow: ["Which order does network byte order use?"],
    points: [
      "Order of bytes for multi-byte values",
      "Little-endian: least significant first",
      "Big-endian: most significant first",
      "DataView sets the order explicitly",
    ],
    notes: ["Know the order before you parse."],
    src: [
      ["MDN: Endianness", `${MDN}/Glossary/Endianness`],
      [
        "MDN: DataView",
        `${MDN}/Web/JavaScript/Reference/Global_Objects/DataView`,
      ],
    ],
  }),
  q({
    slug: "io-devices-drivers-interrupts",
    topic: "Input/output & devices",
    d: "medium",
    title:
      "How do input/output devices talk to the computer: drivers and interrupts?",
    kw: ["device driver", "interrupt", "polling", "io devices", "kernel mode"],
    intent: "Checks you understand how hardware events reach software.",
    short:
      "Devices such as keyboards, disks and network cards are controlled by device drivers, kernel-mode code that knows how to talk to the specific hardware and presents a uniform interface to the operating system. Instead of the CPU constantly checking a device (polling), devices signal events with hardware interrupts: the CPU pauses its current work, runs the interrupt handler, then resumes. Applications use system calls, such as reading from a file or socket, and never touch the hardware directly, which keeps the system protected and stable.",
    detail: [
      "A driver bug can crash the whole system because it runs with kernel privileges.",
      "Interrupt handlers do the minimum work and defer the rest.",
      "Polling can be better for very high-rate devices.",
    ],
    ex: "Pressing a key triggers an interrupt, the keyboard driver reads the key, and the OS delivers it to the active program.",
    mistakes: [
      "Thinking applications access hardware directly.",
      "Assuming polling is always worse than interrupts.",
    ],
    follow: ["What is the difference between polling and interrupts?"],
    points: [
      "Drivers control hardware in kernel mode",
      "Interrupts signal events",
      "Polling checks repeatedly",
      "Apps use system calls",
    ],
    notes: ["Hardware interrupts, drivers handle."],
    src: [
      ["Linux kernel: IRQs", `${K}/core-api/irq/index.html`],
      [
        "Microsoft Learn: User mode and kernel mode",
        "https://learn.microsoft.com/en-us/windows-hardware/drivers/gettingstarted/user-mode-and-kernel-mode",
      ],
    ],
  }),
  q({
    slug: "dma-and-io-performance",
    topic: "Input/output & devices",
    d: "hard",
    title: "What is DMA and why does it help input/output performance?",
    kw: [
      "dma",
      "direct memory access",
      "io throughput",
      "cpu offload",
      "buffering",
    ],
    intent: "Checks you know how bulk data moves without CPU copying.",
    short:
      "Direct memory access lets a device transfer data to or from main memory without the CPU copying each byte. The driver sets up the transfer, the device moves the data using DMA, and signals completion with an interrupt, leaving the CPU free for other work. This makes large transfers, such as disk reads and network packets, much faster and more efficient. Operating systems also buffer and cache I/O in memory, so repeated reads of the same file are served from RAM.",
    detail: [
      "The kernel provides a DMA API so drivers handle memory addresses correctly.",
      "I/O speed depends on the device, bus and software overhead.",
      "Asynchronous I/O lets programs continue while a transfer proceeds.",
    ],
    ex: "A network card writes incoming packets directly into memory buffers before the CPU processes them.",
    mistakes: [
      "Assuming the CPU copies all data between device and memory.",
      "Ignoring caching when benchmarking disk reads.",
    ],
    follow: ["What does the CPU do during a DMA transfer?"],
    points: [
      "Device moves data to memory itself",
      "Interrupt signals completion",
      "Frees the CPU",
      "OS caches I/O in RAM",
    ],
    notes: ["DMA moves data, the CPU does other work."],
    src: [
      [
        "Linux kernel: Dynamic DMA mapping guide",
        `${K}/core-api/dma-api-howto.html`,
      ],
    ],
  }),
  q({
    slug: "boot-process-overview",
    topic: "Input/output & devices",
    d: "medium",
    title: "What happens when a computer boots?",
    kw: [
      "boot process",
      "firmware uefi",
      "bootloader",
      "kernel",
      "init systemd",
    ],
    intent: "Checks you know the sequence from power-on to a login prompt.",
    short:
      "On power-up the firmware (BIOS or UEFI) initialises the hardware and finds a boot device. It starts a bootloader such as GRUB, which loads the operating system kernel and, usually, an initial RAM disk into memory. The kernel initialises memory management, drivers and the scheduler, mounts the root file system, and starts the first user-space process (PID 1), which on most Linux systems is systemd. systemd then starts services in dependency order until the system reaches its target, such as the multi-user or graphical target.",
    detail: [
      "`systemd-analyze` shows how long boot stages took.",
      "The kernel command line passes parameters to the kernel at boot.",
      "Problems at each stage show different symptoms, from no boot device to failed services.",
    ],
    ex: "A server that drops into emergency mode after boot often has a bad entry in /etc/fstab.",
    mistakes: [
      "Confusing the bootloader with the kernel.",
      "Editing fstab incorrectly and losing the boot.",
    ],
    follow: ["What is PID 1?"],
    points: [
      "Firmware, bootloader, kernel, init",
      "Initial RAM disk helps mount root",
      "systemd starts services",
      "Targets define the final state",
    ],
    notes: ["Firmware, loader, kernel, init."],
    src: [
      ["bootup(7)", "https://man7.org/linux/man-pages/man7/bootup.7.html"],
      ["boot(7)", `${MAN}/man7/boot.7.html`],
    ],
  }),
])
