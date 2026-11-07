import { defineQuestions } from "../author"
import { q } from "../compact"

const MDN =
  "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects"
const JU =
  "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util"
const PY = "https://docs.python.org/3"

export default defineQuestions("dsa", "fresher", [
  q({
    slug: "big-o-notation-basics",
    topic: "Complexity",
    d: "easy",
    title: "What is Big-O notation and why do we use it?",
    kw: [
      "big o",
      "time complexity",
      "growth rate",
      "asymptotic analysis",
      "scalability",
    ],
    intent:
      "A foundation question: checks you can compare algorithms by how they scale.",
    short:
      "Big-O notation describes how the running time (or memory) of an algorithm grows as the input size n grows, ignoring constant factors and lower-order terms. An algorithm that takes 3n + 10 steps is O(n), and one that takes n² + n steps is O(n²). It lets you compare approaches independent of hardware and predict how they behave with large inputs. It usually describes the worst case, an upper bound. A constant-factor speed-up can matter in practice, but the growth rate decides what is feasible at scale.",
    detail: [
      "Common classes from fastest to slowest growth: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), O(n!).",
      "Drop constants and keep the dominant term.",
      "Measure real performance too; Big-O is a model, not a stopwatch.",
    ],
    ex: "Searching a sorted list of a million items by scanning is O(n), while binary search is O(log n), about 20 steps.",
    mistakes: [
      "Counting constants and lower-order terms.",
      "Confusing Big-O (upper bound) with average runtime.",
    ],
    follow: ["What is the Big-O of nested loops over n items?"],
    points: [
      "Growth rate as n grows",
      "Ignore constants and small terms",
      "Usually worst case",
      "Compare algorithms independent of hardware",
    ],
    notes: ["How does it scale?"],
    src: [
      ["Java: ArrayList (documented complexities)", `${JU}/ArrayList.html`],
      ["Java: TreeMap (log(n) guarantees)", `${JU}/TreeMap.html`],
    ],
  }),
  q({
    slug: "common-time-complexities-examples",
    topic: "Complexity",
    d: "easy",
    title:
      "What do O(1), O(log n), O(n), O(n log n) and O(n²) look like in code?",
    kw: ["o(1)", "o(log n)", "o(n)", "o(n log n)", "o(n^2)"],
    intent: "Checks you can recognise complexity classes by code shape.",
    short:
      "O(1), constant time, takes the same time regardless of input size, like reading `arr[i]` or a hash map lookup. O(log n) halves the problem each step, like binary search on a sorted array. O(n) touches each element once, like a single loop or a linear search. O(n log n) is typical of efficient sorting, such as merge sort and the sort built into most languages. O(n²) comes from nested loops over the same data, like comparing every pair or a simple bubble sort. Exponential O(2ⁿ) appears in naive recursion like an unmemoized Fibonacci.",
    detail: [
      "A loop that halves or doubles its counter is logarithmic.",
      "Two sequential loops are O(n), not O(n²).",
      "Hidden costs: string concatenation in loops, `includes` inside a loop.",
    ],
    ex: "A loop inside a loop that checks every pair is O(n²); with a Set it becomes O(n).",
    code: [
      [
        "Three shapes",
        "js",
        `const first = (arr) => arr[0]                       // O(1)\nconst sum = (arr) => arr.reduce((a, b) => a + b, 0) // O(n)\nconst hasDup = (arr) => {                          // O(n^2)\n  for (let i = 0; i < arr.length; i++)\n    for (let j = i + 1; j < arr.length; j++)\n      if (arr[i] === arr[j]) return true\n  return false\n}`,
        [
          "Direct access is constant.",
          "One pass is linear.",
          "Nested loops are quadratic.",
        ],
      ],
    ],
    mistakes: [
      "Calling nested loops O(n) because each loop is simple.",
      "Forgetting hidden linear operations inside loops.",
    ],
    follow: ["How would you make hasDup O(n)?"],
    points: [
      "O(1) direct access",
      "O(log n) halving",
      "O(n) one pass",
      "O(n²) nested loops",
    ],
    notes: ["Loops tell the story."],
    src: [
      ["Java: HashMap (constant-time get and put)", `${JU}/HashMap.html`],
      ["Java: PriorityQueue (log(n) operations)", `${JU}/PriorityQueue.html`],
    ],
  }),
  q({
    slug: "space-complexity-and-tradeoffs",
    topic: "Complexity",
    d: "medium",
    title: "What is space complexity, and how do time and space trade off?",
    kw: [
      "space complexity",
      "auxiliary space",
      "in-place",
      "memoization",
      "time-space tradeoff",
    ],
    intent: "Checks you consider memory as well as speed.",
    short:
      "Space complexity measures the extra memory an algorithm needs as the input grows, apart from the input itself (auxiliary space). Reversing an array in place uses O(1) extra space, while building a reversed copy uses O(n). Recursion uses stack space proportional to the depth, so a recursive traversal of a degenerate tree can use O(n) stack. Time and space often trade off: a hash set uses O(n) extra memory to make duplicate detection O(n) instead of O(n²), and memoization stores results to avoid recomputation. Choose based on which resource is scarcer.",
    detail: [
      "In-place algorithms modify the input to save memory.",
      "Deep recursion can overflow the call stack.",
      "Caching speeds things up at the expense of memory.",
    ],
    ex: "Using a Set to find duplicates takes more memory but turns a quadratic algorithm into a linear one.",
    mistakes: [
      "Ignoring recursion stack space.",
      "Assuming memory is unlimited.",
    ],
    follow: ["What space does a recursive DFS use?"],
    points: [
      "Extra memory as n grows",
      "In-place is O(1) extra",
      "Recursion uses stack depth",
      "Trade memory for speed",
    ],
    notes: ["Speed can cost memory."],
    src: [
      [
        "MDN: Call stack",
        "https://developer.mozilla.org/en-US/docs/Glossary/Call_stack",
      ],
      ["Python: functools.cache", `${PY}/library/functools.html`],
    ],
  }),
  q({
    slug: "best-average-worst-amortized",
    topic: "Complexity",
    d: "medium",
    title: "What do best, average, worst case and amortized analysis mean?",
    kw: [
      "worst case",
      "average case",
      "best case",
      "amortized",
      "dynamic array",
    ],
    intent:
      "Checks you understand that one operation can have different costs.",
    short:
      "The best case is the cheapest input (finding an item at the first position), the worst case the most expensive input (item last or absent), and the average case the expected cost over typical inputs. Big-O is most often quoted for the worst case because it is a guarantee. Amortized analysis averages the cost over a sequence of operations: appending to a dynamic array is usually O(1), occasionally O(n) when it must grow and copy, so the amortized cost per append is O(1). The Java documentation describes ArrayList's `add` as amortized constant time.",
    detail: [
      "Quicksort is O(n log n) on average but O(n²) in the worst case.",
      "Hash tables have O(1) average lookups if the hash function disperses keys well.",
      "Amortized is not average-case over random inputs; it is a guarantee over a sequence.",
    ],
    ex: "Inserting 1 million items into an ArrayList costs about 1 million steps overall, even though a few inserts trigger large copies.",
    mistakes: [
      "Quoting the average case as a guarantee.",
      "Confusing amortized with average.",
    ],
    follow: ["Why is appending to a dynamic array amortized O(1)?"],
    points: [
      "Best, average and worst case",
      "Big-O often quotes the worst",
      "Amortized = cost spread over a sequence",
      "Dynamic array growth is amortized O(1)",
    ],
    notes: ["Rare expensive steps average out."],
    src: [
      ["Java: ArrayList", `${JU}/ArrayList.html`],
      ["Java: HashMap", `${JU}/HashMap.html`],
    ],
  }),
  q({
    slug: "array-vs-linked-list",
    topic: "Arrays & strings",
    d: "easy",
    title: "What is the difference between an array and a linked list?",
    kw: [
      "array",
      "linked list",
      "random access",
      "insertion cost",
      "cache locality",
    ],
    intent: "A classic comparison of data structures.",
    short:
      "An array stores elements contiguously in memory, so indexing is O(1), iteration is cache-friendly and memory overhead is small, but inserting or deleting in the middle requires shifting elements, which is O(n), and a fixed-size array must be reallocated to grow. A linked list stores nodes with pointers to the next (and previous) node, so inserting or removing at a known node is O(1) with no shifting and it grows easily, but reaching the k-th element requires walking the list, which is O(k), and each node has pointer overhead and poor cache locality. In practice dynamic arrays such as ArrayList are the default choice.",
    detail: [
      "The Java documentation notes that indexing into a LinkedList traverses it from the nearest end.",
      "Linked lists suit frequent insertions at the ends or in the middle when you already hold the node.",
      "Queues are often implemented with a deque or ring buffer instead.",
    ],
    ex: "Reading the 500th item of an ArrayList is instant, whereas a LinkedList must traverse nodes.",
    mistakes: [
      "Choosing a linked list for 'fast insertion' without needing node-level access.",
      "Ignoring cache effects.",
    ],
    follow: ["Why can arrays be faster than linked lists in practice?"],
    points: [
      "Array: O(1) index, O(n) insert in the middle",
      "Linked list: O(1) insert at a node, O(n) access",
      "Contiguous memory is cache-friendly",
      "Dynamic arrays are the usual default",
    ],
    notes: ["Index versus insert."],
    src: [
      ["Java: ArrayList", `${JU}/ArrayList.html`],
      ["Java: LinkedList", `${JU}/LinkedList.html`],
    ],
  }),
  q({
    slug: "two-pointers-technique",
    topic: "Arrays & strings",
    d: "medium",
    title: "What is the two-pointer technique, and when does it apply?",
    kw: ["two pointers", "sorted array", "pair sum", "palindrome", "in-place"],
    intent: "Checks you know a common pattern that avoids nested loops.",
    short:
      "The two-pointer technique uses two indices that move through a sequence, often from opposite ends or at different speeds, to solve a problem in one pass instead of with nested loops. On a sorted array, to find two numbers that add up to a target, start with pointers at both ends: if the sum is too small move the left pointer right, if too large move the right pointer left. This is O(n) time and O(1) space, versus O(n²) for checking all pairs. It also fits palindrome checks, removing duplicates in place and merging sorted lists. The pattern relies on some order or monotonic property.",
    detail: [
      "A fast and a slow pointer detects cycles and finds the middle of a linked list.",
      "Check the loop condition and off-by-one boundaries carefully.",
      "If the data is unsorted, sort first or use a hash map instead.",
    ],
    ex: "In [1, 3, 4, 6, 9] searching for a sum of 10 moves the pointers inward until 1 and 9 match.",
    code: [
      [
        "Pair sum in a sorted array",
        "js",
        `function pairSum(sorted, target) {\n  let left = 0\n  let right = sorted.length - 1\n  while (left < right) {\n    const sum = sorted[left] + sorted[right]\n    if (sum === target) return [left, right]\n    if (sum < target) left++\n    else right--\n  }\n  return null\n}`,
        [
          "Pointers start at the ends.",
          "Each step discards one candidate.",
          "The loop is O(n).",
        ],
      ],
    ],
    mistakes: [
      "Using it on unsorted data without sorting.",
      "Off-by-one errors in the loop condition.",
    ],
    follow: ["What is the complexity of this approach?"],
    points: [
      "Two indices, one pass",
      "Opposite ends on sorted data",
      "O(n) time, O(1) space",
      "Fast and slow pointers for lists",
    ],
    notes: ["Shrink the search from both ends."],
    src: [
      ["MDN: Array", `${MDN}/Array`],
      ["Python: bisect (sorted data)", `${PY}/library/bisect.html`],
    ],
  }),
  q({
    slug: "sliding-window-technique",
    topic: "Arrays & strings",
    d: "medium",
    title: "What is the sliding window technique?",
    kw: [
      "sliding window",
      "subarray",
      "substring",
      "window size",
      "running sum",
    ],
    intent: "Checks you can optimise contiguous-range problems.",
    short:
      "A sliding window maintains a contiguous range of the array or string and moves it forward, updating its value incrementally instead of recomputing it from scratch. For the maximum sum of any k consecutive elements, compute the first window's sum, then slide: add the element entering, subtract the one leaving, and track the maximum, giving O(n) instead of O(n·k). For variable windows, such as the longest substring without repeating characters, expand the right end and shrink the left end when a condition breaks, usually with a set or map tracking window contents.",
    detail: [
      "It applies to problems about contiguous subarrays or substrings.",
      "Each element enters and leaves the window once, so total work is linear.",
      "Maintain exactly the information needed about the window.",
    ],
    ex: "Finding the best 7-day total in daily sales data takes one pass.",
    code: [
      [
        "Max sum of k elements",
        "js",
        `function maxSum(arr, k) {\n  let window = 0\n  for (let i = 0; i < k; i++) window += arr[i]\n  let best = window\n  for (let i = k; i < arr.length; i++) {\n    window += arr[i] - arr[i - k]\n    best = Math.max(best, window)\n  }\n  return best\n}`,
        [
          "The first window is summed once.",
          "Each slide adds one and removes one.",
          "Total time is O(n).",
        ],
      ],
    ],
    mistakes: [
      "Recomputing the sum for every window.",
      "Not handling arrays shorter than k.",
    ],
    follow: ["How does a variable-size window differ?"],
    points: [
      "Contiguous range that moves",
      "Update incrementally",
      "O(n) overall",
      "Fixed or variable size",
    ],
    notes: ["Add one, remove one."],
    src: [
      ["MDN: Array", `${MDN}/Array`],
      ["MDN: Set", `${MDN}/Set`],
    ],
  }),
  q({
    slug: "binary-search",
    topic: "Arrays & strings",
    d: "medium",
    title: "How does binary search work, and what must be true to use it?",
    kw: ["binary search", "sorted array", "o(log n)", "bisect", "midpoint"],
    intent:
      "A classic algorithm; checks you can write it without off-by-one bugs.",
    short:
      "Binary search finds a target in a sorted array by repeatedly comparing it with the middle element and discarding the half that cannot contain it, so it needs O(log n) steps instead of O(n). The data must be sorted (or the condition monotonic) and allow random access. Keep `low` and `high` bounds, compute `mid`, and move one bound past `mid` each time, stopping when `low` exceeds `high`. Beware off-by-one errors and integer overflow when computing the midpoint in languages with fixed-size integers. Python's `bisect` module provides ready-made binary search for sorted lists.",
    detail: [
      "The same idea finds the first or last occurrence, or the point where a condition changes.",
      "Sorting first costs O(n log n), so binary search pays off with many queries.",
      "A linked list does not support efficient binary search.",
    ],
    ex: "Searching 1 million sorted ids takes about 20 comparisons.",
    code: [
      [
        "Iterative binary search",
        "js",
        `function binarySearch(sorted, target) {\n  let low = 0\n  let high = sorted.length - 1\n  while (low <= high) {\n    const mid = low + Math.floor((high - low) / 2)\n    if (sorted[mid] === target) return mid\n    if (sorted[mid] < target) low = mid + 1\n    else high = mid - 1\n  }\n  return -1\n}`,
        [
          "The search range halves each step.",
          "`low + (high - low) / 2` avoids overflow.",
          "Returns -1 when absent.",
        ],
      ],
    ],
    mistakes: [
      "Using it on unsorted data.",
      "Infinite loops from not moving past mid.",
    ],
    follow: ["What is the complexity and why?"],
    points: [
      "Needs sorted data",
      "Halve the range each step",
      "O(log n) time",
      "Watch off-by-one and overflow",
    ],
    notes: ["Compare the middle, discard half."],
    src: [
      ["Python: bisect", `${PY}/library/bisect.html`],
      ["Java: Arrays.binarySearch", `${JU}/Arrays.html`],
    ],
  }),
  q({
    slug: "sorting-algorithms-overview",
    topic: "Arrays & strings",
    d: "medium",
    title:
      "How do the common sorting algorithms compare, and what is sort stability?",
    kw: ["merge sort", "quicksort", "bubble sort", "stable sort", "timsort"],
    intent: "Checks you know the main sorts and their trade-offs.",
    short:
      "Simple sorts such as bubble, selection and insertion sort are O(n²) in general, though insertion sort is fast on nearly sorted or small inputs. Merge sort is O(n log n) in all cases and stable, but needs O(n) extra space. Quicksort is O(n log n) on average with in-place partitioning, but O(n²) in the worst case with poor pivots. Heap sort is O(n log n) in place but not stable. A sort is stable if equal elements keep their original relative order, which matters when sorting by several keys. Python's sort uses Timsort, which is stable and exploits existing order; in practice use the built-in sort.",
    detail: [
      "Python guarantees that sorts are stable.",
      "JavaScript's `Array.prototype.sort` is required to be stable in modern engines.",
      "Comparison sorts cannot beat O(n log n) in general.",
    ],
    ex: "Sorting orders first by date and then by customer with a stable sort keeps the date order within each customer.",
    mistakes: [
      "Writing a custom sort when the built-in suffices.",
      "Forgetting that JavaScript's default sort compares as strings.",
    ],
    follow: ["What does stable mean?"],
    points: [
      "Simple sorts O(n²)",
      "Merge sort O(n log n), stable, extra space",
      "Quicksort average O(n log n), worst O(n²)",
      "Stability preserves equal-element order",
    ],
    notes: ["Use the built-in sort."],
    src: [
      ["Python: Sorting techniques", `${PY}/howto/sorting.html`],
      ["MDN: Array.prototype.sort", `${MDN}/Array/sort`],
    ],
  }),
  q({
    slug: "string-immutability-and-building",
    topic: "Arrays & strings",
    d: "medium",
    title:
      "How do strings behave in languages like JavaScript and Java, and how do you build them efficiently?",
    kw: [
      "string immutability",
      "string concatenation",
      "stringbuilder",
      "array join",
      "unicode",
    ],
    intent: "Checks you know hidden costs of string handling.",
    short:
      "Strings in JavaScript, Java and Python are immutable: operations like concatenation or `replace` create a new string rather than changing the original. Building a large string by repeated `+=` in a loop can create many temporary strings, which in some implementations costs O(n²) in total, so collect pieces in an array and `join` them in JavaScript, use `StringBuilder` in Java, or `''.join(parts)` in Python. Remember that strings are sequences of UTF-16 code units in JavaScript, so characters outside the basic plane, such as many emoji, take two units, which affects length and indexing.",
    detail: [
      "Use `for...of` to iterate by code points in JavaScript.",
      "Comparing and searching strings costs time proportional to their length.",
      "Normalise Unicode before comparing text.",
    ],
    ex: 'Joining 100,000 words with an array and `join(" ")` is far cheaper than a growing `+=`.',
    mistakes: [
      "Expecting a string method to modify in place.",
      "Treating string length as the number of user-visible characters.",
    ],
    follow: ["Why is repeated concatenation in a loop risky?"],
    points: [
      "Strings are immutable",
      "Build with join or StringBuilder",
      "Concatenation in loops can be quadratic",
      "JS strings use UTF-16 code units",
    ],
    notes: ["Collect, then join."],
    src: [
      ["MDN: String", `${MDN}/String`],
      [
        "Java: StringBuilder",
        "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/StringBuilder.html",
      ],
    ],
  }),
  q({
    slug: "stack-and-queue-basics",
    topic: "Arrays & strings",
    d: "easy",
    title: "What are a stack and a queue, and how do you implement them?",
    kw: ["stack", "queue", "lifo", "fifo", "deque"],
    intent: "Checks you know the two basic linear structures and their uses.",
    short:
      "A stack is last-in, first-out (LIFO): you push and pop at the same end, like a pile of plates. It underlies function calls (the call stack), undo features, backtracking and checking balanced brackets. A queue is first-in, first-out (FIFO): items are enqueued at the back and dequeued from the front, like a line, and are used for scheduling, buffering and breadth-first search. In JavaScript an array works as a stack with `push` and `pop`; a queue needs a structure with O(1) removal at the front. Python's `collections.deque` and Java's `ArrayDeque` give O(1) operations at both ends.",
    detail: [
      "`array.shift()` is O(n) in many engines, so avoid it for large queues.",
      "Java documents ArrayDeque as likely faster than Stack as a stack and than LinkedList as a queue.",
      "A priority queue serves the highest-priority item first, not the oldest.",
    ],
    ex: "Checking `{[()]}` for balanced brackets pushes opening brackets and pops on each closing bracket.",
    code: [
      [
        "Balanced brackets with a stack",
        "js",
        `function balanced(s) {\n  const pairs = { ")": "(", "]": "[", "}": "{" }\n  const stack = []\n  for (const ch of s) {\n    if ("([{".includes(ch)) stack.push(ch)\n    else if (pairs[ch]) {\n      if (stack.pop() !== pairs[ch]) return false\n    }\n  }\n  return stack.length === 0\n}`,
        [
          "Openers are pushed.",
          "Each closer must match the top.",
          "An empty stack at the end means balanced.",
        ],
      ],
    ],
    mistakes: [
      "Using array.shift() for large queues.",
      "Forgetting to check for an empty stack.",
    ],
    follow: ["What does LIFO mean?"],
    points: [
      "Stack: LIFO",
      "Queue: FIFO",
      "deque or ArrayDeque for O(1) ends",
      "Uses: calls, undo, BFS, scheduling",
    ],
    notes: ["Stack = pile, queue = line."],
    src: [
      ["Python: collections.deque", `${PY}/library/collections.html`],
      ["Java: ArrayDeque", `${JU}/ArrayDeque.html`],
    ],
  }),
  q({
    slug: "hash-table-how-it-works",
    topic: "Hashing",
    d: "easy",
    title: "How does a hash table work?",
    kw: ["hash table", "hash function", "buckets", "collision", "load factor"],
    intent: "A core structure; checks you understand why lookups are fast.",
    short:
      "A hash table stores key-value pairs in an array of buckets. A hash function converts a key into an integer, and the index into the array is derived from it, so a lookup computes the hash and goes directly to the bucket instead of searching, giving O(1) average time for get, put and remove. Different keys can map to the same bucket (a collision), which is handled by chaining (a list or tree per bucket) or open addressing (probing for the next free slot). As the table fills, performance drops, so it is resized when the load factor passes a threshold.",
    detail: [
      "Keys must have consistent equality and hash: equal keys must have equal hashes.",
      "Iteration order is not guaranteed in many hash tables.",
      "Worst case with many collisions degrades to O(n) (or O(log n) with tree buckets).",
    ],
    ex: "A word counter stores each word's count in a map keyed by the word.",
    mistakes: [
      "Mutating a key after inserting it.",
      "Assuming hash tables keep insertion order in every language.",
    ],
    follow: ["What is a collision?"],
    points: [
      "Hash function maps key to bucket",
      "O(1) average operations",
      "Collisions: chaining or probing",
      "Resize by load factor",
    ],
    notes: ["Hash, index, resolve."],
    src: [
      ["Java: HashMap", `${JU}/HashMap.html`],
      ["MDN: Map", `${MDN}/Map`],
    ],
  }),
  q({
    slug: "map-and-set-usage",
    topic: "Hashing",
    d: "easy",
    title: "When do you use a Map or a Set instead of an array?",
    kw: ["map", "set", "membership check", "frequency count", "deduplicate"],
    intent: "Checks you reach for the right structure to avoid slow lookups.",
    short:
      "Use a Set when you need to store unique values and check membership quickly: `set.has(x)` is O(1) on average, whereas `array.includes(x)` is O(n). Use a Map for key-value lookups where keys can be any type and you need insertion order, size and frequent additions and removals; plain objects are fine for fixed string keys. Typical uses are removing duplicates (`[...new Set(arr)]`), counting frequencies, caching results and indexing records by id for instant lookup. Replacing a nested loop that searches an array with a Set or Map often turns O(n²) into O(n).",
    detail: [
      "Map keys are compared by SameValueZero; objects are compared by reference.",
      "JavaScript Maps and Sets iterate in insertion order.",
      "Python's `dict` and `set` and Java's `HashMap` and `HashSet` work the same way.",
    ],
    ex: "Building a Map from an array of users by id lets each lookup avoid a scan.",
    code: [
      [
        "Frequency count with a Map",
        "js",
        `function countWords(words) {\n  const counts = new Map()\n  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1)\n  return counts\n}`,
        [
          "`get` with a default handles new keys.",
          "Each update is O(1) on average.",
        ],
      ],
    ],
    mistakes: [
      "array.includes inside a loop.",
      "Using objects as maps with arbitrary user keys.",
    ],
    follow: ["How do you remove duplicates from an array?"],
    points: [
      "Set: unique values, fast has",
      "Map: key-value with any key type",
      "O(1) average lookups",
      "Replace nested searches",
    ],
    notes: ["Lookups by hash, not by scanning."],
    src: [
      ["MDN: Set", `${MDN}/Set`],
      ["MDN: Map", `${MDN}/Map`],
    ],
  }),
  q({
    slug: "two-sum-with-hash-map",
    topic: "Hashing",
    d: "medium",
    title: "How do you solve two-sum efficiently?",
    kw: ["two sum", "hash map", "complement", "one pass", "time complexity"],
    intent: "The classic example of trading space for time.",
    short:
      "Given an array and a target, find two indices whose values add up to the target. The brute force checks all pairs in O(n²). With a hash map, make one pass: for each number, compute its complement (`target - num`), check whether the complement is already in the map (an O(1) average lookup) and if so return the pair, otherwise store the current number with its index. This is O(n) time and O(n) space. For sorted input, two pointers solve it in O(1) extra space. The key idea is replacing a search with a hash lookup.",
    detail: [
      "Handle duplicates carefully: check before inserting the current value.",
      "State assumptions: exactly one solution, no reuse of the same element.",
      "Mention the trade-offs of the alternatives.",
    ],
    ex: "For [2, 7, 11, 15] and target 9, when 7 is reached the complement 2 is already in the map.",
    code: [
      [
        "Two sum with a Map",
        "js",
        `function twoSum(nums, target) {\n  const seen = new Map() // value -> index\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i]\n    if (seen.has(need)) return [seen.get(need), i]\n    seen.set(nums[i], i)\n  }\n  return null\n}`,
        [
          "The map remembers earlier values.",
          "Each element does a constant-time lookup.",
          "Total O(n) time, O(n) space.",
        ],
      ],
    ],
    mistakes: [
      "Inserting before checking, using the same element twice.",
      "Nested loops when a map suffices.",
    ],
    follow: ["Which alternative uses O(1) space for sorted input?"],
    points: [
      "Brute force O(n²)",
      "Hash map complement lookup",
      "O(n) time and space",
      "Two pointers if sorted",
    ],
    notes: ["Look up the complement."],
    src: [
      ["MDN: Map", `${MDN}/Map`],
      ["Java: HashMap", `${JU}/HashMap.html`],
    ],
  }),
  q({
    slug: "hash-collisions-and-good-keys",
    topic: "Hashing",
    d: "hard",
    title:
      "How are hash collisions handled, and what makes a good hash function?",
    kw: [
      "collision resolution",
      "chaining",
      "open addressing",
      "hashcode equals",
      "uniform distribution",
    ],
    intent: "Checks deeper understanding of hash table internals.",
    short:
      "A collision happens when different keys hash to the same bucket. With separate chaining, each bucket holds a list (or a balanced tree in newer implementations) of entries, and a lookup scans the bucket. With open addressing, a colliding entry is placed in another slot found by probing, such as linear probing. A good hash function is fast, deterministic and spreads keys uniformly so that buckets stay short; equal keys must always produce equal hashes. In Java, objects used as keys must implement `equals` and `hashCode` consistently, and the HashMap documentation stresses that performance depends on the hash function dispersing elements properly.",
    detail: [
      "A poor hash such as a constant makes every operation O(n).",
      "Cryptographic hashes are slower and meant for security, not for tables.",
      "Resizing rehashes all keys.",
    ],
    ex: "Overriding `equals` without `hashCode` in a Java class breaks lookups in a HashMap.",
    mistakes: [
      "Inconsistent equals and hashCode.",
      "Using mutable fields in the hash and then changing them.",
    ],
    follow: ["What happens if all keys collide?"],
    points: [
      "Chaining or open addressing",
      "Uniform hash spreads keys",
      "Equal keys need equal hashes",
      "Bad hashing degrades to O(n)",
    ],
    notes: ["Spread the keys."],
    src: [
      ["Java: HashMap", `${JU}/HashMap.html`],
      [
        "Java: Object.hashCode",
        "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html",
      ],
    ],
  }),
  q({
    slug: "binary-tree-traversals",
    topic: "Trees",
    d: "medium",
    title:
      "What are the binary tree traversals: preorder, inorder, postorder and level order?",
    kw: [
      "tree traversal",
      "inorder",
      "preorder",
      "postorder",
      "level order bfs",
    ],
    intent:
      "A standard tree question; checks you know the orders and their uses.",
    short:
      "A binary tree node has up to two children. Depth-first traversals visit a subtree fully before moving on: preorder visits the node, then left, then right (used to copy a tree); inorder visits left, node, right, which yields the values of a binary search tree in sorted order; postorder visits left, right, then the node (used to delete or evaluate expression trees). Level order (breadth-first) visits nodes level by level using a queue. Depth-first is naturally recursive, using the call stack, and each traversal visits every node once, O(n) time, with O(h) stack space for height h.",
    detail: [
      "A skewed tree has height n, so recursion can overflow; use an explicit stack.",
      "Iterative versions use a stack (DFS) or queue (BFS).",
      "The traversal order is defined by when the node is processed relative to its children.",
    ],
    ex: "An inorder traversal of a BST prints the keys in ascending order.",
    code: [
      [
        "Recursive inorder",
        "js",
        `function inorder(node, visit) {\n  if (!node) return\n  inorder(node.left, visit)\n  visit(node.value)\n  inorder(node.right, visit)\n}`,
        [
          "Recurse left first.",
          "Visit the node in the middle.",
          "Then recurse right.",
        ],
      ],
    ],
    mistakes: ["Forgetting the base case.", "Deep recursion on skewed trees."],
    follow: ["Which traversal returns sorted order for a BST?"],
    points: [
      "Preorder: node, left, right",
      "Inorder: left, node, right",
      "Postorder: left, right, node",
      "Level order uses a queue",
    ],
    notes: ["Position of the node names the order."],
    src: [
      [
        "MDN: Call stack",
        "https://developer.mozilla.org/en-US/docs/Glossary/Call_stack",
      ],
      ["Python: collections.deque", `${PY}/library/collections.html`],
    ],
  }),
  q({
    slug: "binary-search-tree-and-balance",
    topic: "Trees",
    d: "medium",
    title: "What is a binary search tree, and why does balance matter?",
    kw: [
      "binary search tree",
      "bst",
      "balanced tree",
      "red-black tree",
      "treemap",
    ],
    intent: "Checks you understand ordered trees and their guarantees.",
    short:
      "A binary search tree keeps an ordering: for every node, keys in the left subtree are smaller and keys in the right subtree are larger. Search, insert and delete follow one path from the root, so they take O(h) time for height h. If the tree stays balanced, h is about log n, giving O(log n) operations; if keys are inserted in sorted order into a simple BST, it degenerates into a linked list with h = n and O(n) operations. Self-balancing trees such as red-black and AVL trees rebalance after changes. Java's TreeMap is a red-black tree and guarantees log(n) time for get, put, containsKey and remove.",
    detail: [
      "Sorted maps and sets in standard libraries use balanced trees.",
      "Inorder traversal gives sorted order.",
      "Databases use B-trees, a related balanced structure, for indexes.",
    ],
    ex: "A `TreeMap` lets you find the nearest key above a value in logarithmic time.",
    mistakes: [
      "Assuming every BST is O(log n).",
      "Not handling duplicates consistently.",
    ],
    follow: ["What happens when you insert sorted data into a plain BST?"],
    points: [
      "Left smaller, right larger",
      "Operations cost O(height)",
      "Balanced height is about log n",
      "Self-balancing trees guarantee it",
    ],
    notes: ["Balance keeps it logarithmic."],
    src: [
      ["Java: TreeMap", `${JU}/TreeMap.html`],
      [
        "PostgreSQL: Indexes (B-tree)",
        "https://www.postgresql.org/docs/current/indexes.html",
      ],
    ],
  }),
  q({
    slug: "heap-and-priority-queue",
    topic: "Trees",
    d: "medium",
    title: "What is a heap, and how does a priority queue use it?",
    kw: ["heap", "priority queue", "min-heap", "top k", "heapq"],
    intent: "Checks you know the structure behind priority queues.",
    short:
      "A heap is a complete binary tree stored in an array that satisfies the heap property: in a min-heap each parent is less than or equal to its children, so the smallest element is always at the root. A priority queue returns the highest-priority item first, and a heap implements it efficiently: peeking at the minimum is O(1), and inserting and removing the minimum are O(log n). Java's `PriorityQueue` documents O(log n) for `offer` and `poll` and constant time for `peek`; Python provides `heapq` using a list. Typical uses are scheduling, finding the k largest items, merging sorted lists and Dijkstra's algorithm.",
    detail: [
      "Finding the k largest of n items with a size-k min-heap takes O(n log k).",
      "Removing an arbitrary element from a heap is O(n) without extra bookkeeping.",
      "A heap is not fully sorted, only partially ordered.",
    ],
    ex: "A task scheduler always runs the task with the earliest deadline using a min-heap.",
    code: [
      [
        "heapq in Python",
        "python",
        `import heapq\n\nheap = []\nfor n in [5, 1, 8, 3]:\n    heapq.heappush(heap, n)\n\nprint(heapq.heappop(heap))  # 1, the smallest\nprint(heap[0])              # 3, the next smallest`,
        [
          "`heappush` and `heappop` keep the invariant.",
          "`heap[0]` is the minimum.",
        ],
      ],
    ],
    mistakes: [
      "Assuming iterating a heap gives sorted order.",
      "Using a sorted list when a heap fits.",
    ],
    follow: ["What is the complexity of inserting into a heap?"],
    points: [
      "Parent ≤ children in a min-heap",
      "Peek O(1), push and pop O(log n)",
      "Backs priority queues",
      "Top-k, scheduling, Dijkstra",
    ],
    notes: ["Always the smallest at the top."],
    src: [
      ["Python: heapq", `${PY}/library/heapq.html`],
      ["Java: PriorityQueue", `${JU}/PriorityQueue.html`],
    ],
  }),
  q({
    slug: "tree-height-depth-recursion",
    topic: "Trees",
    d: "easy",
    title:
      "How do you compute the height of a binary tree, and what is recursion's role?",
    kw: ["tree height", "depth", "recursion", "base case", "leaf"],
    intent: "Checks you can write a simple recursive tree function.",
    short:
      "The height of a tree is the number of edges (or nodes, depending on the definition) on the longest path from the root down to a leaf. Recursively, an empty tree has height 0 (or -1 in the edge definition), and a node's height is 1 plus the larger height of its left and right subtrees. Every recursive function needs a base case, here the empty node, and a step that moves toward it. The function visits each node once, so it takes O(n) time, and O(h) stack space for the call stack. For very deep trees an iterative version with a stack or level-order traversal avoids stack overflow.",
    detail: [
      "State clearly whether height counts nodes or edges.",
      "The same pattern computes size, sum, and checks for balance.",
      "Combine results of children after the recursive calls return.",
    ],
    ex: "A tree with a root and two leaf children has height 2 counting nodes.",
    code: [
      [
        "Tree height",
        "js",
        `function height(node) {\n  if (!node) return 0\n  return 1 + Math.max(height(node.left), height(node.right))\n}`,
        ["Base case: no node means 0.", "A node adds 1 to its taller child."],
      ],
    ],
    mistakes: ["Missing the base case.", "Mixing node and edge definitions."],
    follow: ["What is the stack space used?"],
    points: [
      "Base case: empty tree",
      "1 + max of children",
      "O(n) time, O(h) stack",
      "Define height clearly",
    ],
    notes: ["Recursion mirrors the tree."],
    src: [
      [
        "MDN: Call stack",
        "https://developer.mozilla.org/en-US/docs/Glossary/Call_stack",
      ],
      ["MDN: Math.max", `${MDN}/Math/max`],
    ],
  }),
  q({
    slug: "graph-representations",
    topic: "Graphs",
    d: "medium",
    title: "How can you represent a graph in code?",
    kw: ["graph", "adjacency list", "adjacency matrix", "edges", "directed"],
    intent: "Checks you can model relationships as graphs.",
    short:
      "A graph is a set of nodes (vertices) connected by edges, directed or undirected, optionally with weights. The usual representation is an adjacency list: a map from each node to the list of its neighbours, which uses O(V + E) space and makes iterating a node's neighbours efficient. An adjacency matrix is a V×V table where entry (i, j) shows whether an edge exists; it uses O(V²) space but answers 'is there an edge between i and j?' in O(1). Choose the list for sparse graphs, which are the most common, and the matrix for dense graphs or constant-time edge checks.",
    detail: [
      "For undirected graphs, store each edge in both directions.",
      "Weights can be stored alongside neighbours.",
      "Implicit graphs, such as grids, generate neighbours on the fly.",
    ],
    ex: "A social network stores each person's friends in an adjacency list.",
    code: [
      [
        "Adjacency list",
        "js",
        `const graph = {\n  A: ["B", "C"],\n  B: ["D"],\n  C: ["D"],\n  D: [],\n}`,
        [
          "Each key lists its outgoing neighbours.",
          "Space is proportional to nodes plus edges.",
        ],
      ],
    ],
    mistakes: [
      "A matrix for a huge sparse graph.",
      "Forgetting the reverse edge in undirected graphs.",
    ],
    follow: ["When is an adjacency matrix better?"],
    points: [
      "Nodes and edges",
      "Adjacency list: O(V+E) space",
      "Adjacency matrix: O(V²), O(1) edge check",
      "Lists suit sparse graphs",
    ],
    notes: ["Lists for sparse, matrix for dense."],
    src: [
      [
        "Python.org: Python Patterns - Implementing Graphs",
        "https://www.python.org/doc/essays/graphs/",
      ],
      ["Python: dict", `${PY}/library/stdtypes.html`],
    ],
  }),
  q({
    slug: "bfs-vs-dfs",
    topic: "Graphs",
    d: "medium",
    title:
      "What is the difference between BFS and DFS, and when do you use each?",
    kw: [
      "bfs",
      "dfs",
      "breadth-first search",
      "depth-first search",
      "visited set",
    ],
    intent: "A staple graph question.",
    short:
      "Breadth-first search explores a graph level by level from a start node using a queue, visiting all neighbours before going deeper. It finds the shortest path in terms of edge count in an unweighted graph. Depth-first search follows one path as far as possible before backtracking, using a stack or recursion, and suits exploring all possibilities, detecting cycles, finding connected components and topological sorting. Both visit each node and edge once, O(V + E), provided you keep a visited set to avoid revisiting nodes in graphs with cycles. BFS can use more memory on wide graphs, DFS on deep ones.",
    detail: [
      "Mark nodes as visited when they are enqueued (BFS) to avoid duplicates.",
      "Recursive DFS can overflow the stack on deep graphs.",
      "Python's `collections.deque` is a convenient queue for BFS.",
    ],
    ex: "Finding the fewest hops between two users in a social network uses BFS.",
    code: [
      [
        "BFS shortest hops",
        "js",
        `function bfs(graph, start, goal) {\n  const queue = [[start, 0]]\n  const seen = new Set([start])\n  while (queue.length) {\n    const [node, dist] = queue.shift()\n    if (node === goal) return dist\n    for (const next of graph[node]) {\n      if (!seen.has(next)) {\n        seen.add(next)\n        queue.push([next, dist + 1])\n      }\n    }\n  }\n  return -1\n}`,
        [
          "The queue gives level-by-level order.",
          "`seen` prevents revisiting.",
          "`dist` counts edges from the start.",
        ],
      ],
    ],
    mistakes: [
      "No visited set, causing infinite loops in cyclic graphs.",
      "Using DFS for shortest paths in unweighted graphs.",
    ],
    follow: ["Which gives the shortest path in an unweighted graph?"],
    points: [
      "BFS: queue, level by level, shortest hops",
      "DFS: stack or recursion, explores deep",
      "Both O(V+E)",
      "Use a visited set",
    ],
    notes: ["BFS for nearest, DFS for exhaustive."],
    src: [
      ["Python: collections.deque", `${PY}/library/collections.html`],
      [
        "Python.org: Implementing Graphs",
        "https://www.python.org/doc/essays/graphs/",
      ],
    ],
  }),
  q({
    slug: "shortest-path-dijkstra",
    topic: "Graphs",
    d: "hard",
    title: "How does Dijkstra's algorithm find shortest paths?",
    kw: [
      "dijkstra",
      "shortest path",
      "weighted graph",
      "priority queue",
      "non-negative weights",
    ],
    intent: "Checks you can extend BFS to weighted graphs.",
    short:
      "Dijkstra's algorithm finds the shortest path from a source to all nodes in a graph with non-negative edge weights. It keeps a distance estimate for each node (infinity at first, 0 for the source) and a priority queue ordered by distance. Repeatedly take the closest unfinalised node, and for each neighbour check whether going through this node is shorter than the known distance, updating it and pushing it to the queue if so. With a binary-heap priority queue the running time is O((V + E) log V). It does not work with negative weights, for which Bellman-Ford is used. BFS is the special case for unit weights.",
    detail: [
      "Python's `heapq` and Java's `PriorityQueue` provide the needed heap.",
      "Store predecessors to reconstruct the path.",
      "A* adds a heuristic to guide the search toward the goal.",
    ],
    ex: "A route planner finds the quickest route between two stops using travel times as weights.",
    code: [
      [
        "Dijkstra with heapq",
        "python",
        `import heapq\n\ndef dijkstra(graph, start):\n    dist = {start: 0}\n    heap = [(0, start)]\n    while heap:\n        d, node = heapq.heappop(heap)\n        if d > dist.get(node, float("inf")):\n            continue\n        for nxt, w in graph[node]:\n            nd = d + w\n            if nd < dist.get(nxt, float("inf")):\n                dist[nxt] = nd\n                heapq.heappush(heap, (nd, nxt))\n    return dist`,
        [
          "The heap yields the nearest node.",
          "Stale entries are skipped.",
          "Neighbours are relaxed if shorter.",
        ],
      ],
    ],
    mistakes: [
      "Using it with negative edge weights.",
      "Not skipping outdated heap entries.",
    ],
    follow: ["Why can't Dijkstra handle negative weights?"],
    points: [
      "Non-negative weights",
      "Priority queue by distance",
      "Relax neighbours",
      "O((V+E) log V)",
    ],
    notes: ["Greedy: closest first."],
    src: [
      ["Python: heapq", `${PY}/library/heapq.html`],
      ["Java: PriorityQueue", `${JU}/PriorityQueue.html`],
    ],
  }),
  q({
    slug: "cycle-detection-and-topological-sort",
    topic: "Graphs",
    d: "hard",
    title:
      "How do you detect a cycle and order tasks with dependencies (topological sort)?",
    kw: [
      "cycle detection",
      "topological sort",
      "dag",
      "dependencies",
      "kahn's algorithm",
    ],
    intent: "Checks you can apply graphs to dependency problems.",
    short:
      "A topological sort orders the nodes of a directed acyclic graph (DAG) so that every edge points forward, which is how build tools and course schedulers order dependent tasks. Kahn's algorithm computes each node's in-degree, starts a queue with all nodes of in-degree 0, repeatedly removes a node from the queue, appends it to the order and decrements its neighbours' in-degrees, adding any that reach 0. If the result contains fewer nodes than the graph, there is a cycle and no valid order exists. DFS can do the same with colouring (a back edge to a node being visited means a cycle). Both run in O(V + E).",
    detail: [
      "A valid order may not be unique.",
      "Cycle detection differs in undirected graphs: an edge to a visited non-parent node.",
      "Package managers and CI pipelines rely on this ordering.",
    ],
    ex: "To take course C you must finish A and B; a topological order lists A and B before C.",
    mistakes: [
      "Trying to topologically sort a graph with a cycle.",
      "Forgetting disconnected components.",
    ],
    follow: ["How does Kahn's algorithm reveal a cycle?"],
    points: [
      "Order nodes so edges point forward",
      "Kahn: in-degree queue",
      "Leftover nodes mean a cycle",
      "O(V+E)",
    ],
    notes: ["Zero in-degree first."],
    src: [
      ["Python: collections.deque", `${PY}/library/collections.html`],
      [
        "Python.org: Implementing Graphs",
        "https://www.python.org/doc/essays/graphs/",
      ],
    ],
  }),
  q({
    slug: "recursion-base-case-and-stack",
    topic: "Dynamic programming",
    d: "easy",
    title: "What is recursion, and what are its risks?",
    kw: [
      "recursion",
      "base case",
      "stack overflow",
      "call stack",
      "tail recursion",
    ],
    intent: "Checks you can reason about recursive functions.",
    short:
      "Recursion is when a function calls itself on a smaller version of the problem until it reaches a base case that returns directly. It expresses naturally recursive problems such as tree traversal, factorial and divide and conquer cleanly. Each call adds a frame to the call stack, so a missing base case or very deep recursion causes a stack overflow ('Maximum call stack size exceeded' in JavaScript), and naive recursion can repeat work exponentially, as with Fibonacci. Fixes are to add the base case, convert to a loop or explicit stack, or cache results with memoization.",
    detail: [
      "Every recursive call must move closer to the base case.",
      "Python limits recursion depth (about 1000 by default).",
      "JavaScript engines do not generally guarantee tail-call optimisation.",
    ],
    ex: "`factorial(n)` returns 1 for n ≤ 1 and otherwise n times `factorial(n - 1)`.",
    mistakes: [
      "No base case.",
      "Exponential blow-up from repeated subproblems.",
    ],
    follow: ["What causes a stack overflow?"],
    points: [
      "Function calls itself on a smaller problem",
      "Needs a base case",
      "Uses call stack space",
      "Memoize or iterate if deep or repetitive",
    ],
    notes: ["Base case first."],
    src: [
      [
        "MDN: Call stack",
        "https://developer.mozilla.org/en-US/docs/Glossary/Call_stack",
      ],
      ["Python: sys.setrecursionlimit", `${PY}/library/sys.html`],
    ],
  }),
  q({
    slug: "dynamic-programming-concepts",
    topic: "Dynamic programming",
    d: "medium",
    title: "What is dynamic programming, and when does it apply?",
    kw: [
      "dynamic programming",
      "overlapping subproblems",
      "optimal substructure",
      "memoization",
      "tabulation",
    ],
    intent: "A key technique; checks you can recognise a DP problem.",
    short:
      "Dynamic programming solves a problem by breaking it into overlapping subproblems and storing each subproblem's answer so that it is computed once. It applies when the problem has optimal substructure (the best solution is built from best solutions to subproblems) and overlapping subproblems (the same subproblems recur). There are two styles. Top-down memoization keeps the natural recursion and caches results, for example with a dictionary or `functools.cache`. Bottom-up tabulation fills a table from the smallest subproblems upward, using loops and often less memory. DP can turn exponential time into polynomial time.",
    detail: [
      "Define the state, the recurrence and the base cases first.",
      "Many DP tables can be compressed to a few variables.",
      "Greedy algorithms differ: they commit to a local choice without revisiting it.",
    ],
    ex: "Computing Fibonacci numbers by memoization takes O(n) time instead of O(2ⁿ).",
    mistakes: [
      "Jumping to code before defining the state.",
      "Using DP where a greedy method is simpler.",
    ],
    follow: ["What is the difference between memoization and tabulation?"],
    points: [
      "Optimal substructure and overlapping subproblems",
      "Memoization is top-down",
      "Tabulation is bottom-up",
      "Define state, recurrence, base cases",
    ],
    notes: ["Solve each subproblem once."],
    src: [
      ["Python: functools.cache", `${PY}/library/functools.html`],
      ["MDN: Map", `${MDN}/Map`],
    ],
  }),
  q({
    slug: "fibonacci-memoization-vs-tabulation",
    topic: "Dynamic programming",
    d: "easy",
    title: "How do you compute Fibonacci numbers efficiently?",
    kw: [
      "fibonacci",
      "memoization",
      "tabulation",
      "exponential recursion",
      "space optimisation",
    ],
    intent: "The standard first DP example.",
    short:
      "The naive recursion `fib(n) = fib(n-1) + fib(n-2)` recomputes the same values repeatedly and takes O(2ⁿ) time. Memoization caches each result: the first call to `fib(k)` computes and stores it, later calls return it, so the whole computation takes O(n) time and O(n) space. Tabulation fills an array from 0 upward in a loop, also O(n), and since each value needs only the previous two, you can keep two variables and use O(1) space. In Python, `@functools.cache` adds memoization to the recursive version in one line.",
    detail: [
      "Recursive memoization can still hit recursion depth limits for large n.",
      "Use BigInt in JavaScript for large Fibonacci values.",
      "The same pattern appears in climbing stairs and tiling problems.",
    ],
    ex: "`fib(50)` takes billions of calls naively but only 50 steps with memoization.",
    code: [
      [
        "Three approaches",
        "python",
        `from functools import cache\n\n@cache\ndef fib_memo(n):\n    return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)\n\ndef fib_iter(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a`,
        [
          "`@cache` memoizes the recursion.",
          "The loop keeps only two values.",
          "Time O(n); space O(n) vs O(1).",
        ],
      ],
    ],
    mistakes: [
      "Using the naive recursion beyond tiny inputs.",
      "Storing the whole table when two variables suffice.",
    ],
    follow: ["How do you reduce the space to O(1)?"],
    points: [
      "Naive recursion is O(2ⁿ)",
      "Memoization O(n)",
      "Tabulation with two variables O(1) space",
      "@functools.cache in Python",
    ],
    notes: ["Cache or iterate."],
    src: [
      ["Python: functools.cache", `${PY}/library/functools.html`],
      ["MDN: BigInt", `${MDN}/BigInt`],
    ],
  }),
  q({
    slug: "coin-change-knapsack-dp",
    topic: "Dynamic programming",
    d: "hard",
    title:
      "How would you solve the coin change problem with dynamic programming?",
    kw: ["coin change", "minimum coins", "dp table", "recurrence", "knapsack"],
    intent: "Checks you can build a DP recurrence from scratch.",
    short:
      "Given coin denominations and an amount, find the fewest coins that make the amount. Define `dp[a]` as the minimum coins needed for amount a, with `dp[0] = 0` and everything else infinity. For each amount from 1 to the target, try every coin c ≤ a: `dp[a] = min(dp[a], dp[a - c] + 1)`. The answer is `dp[amount]`, or -1 if it is still infinity. This is O(amount × coins) time and O(amount) space. Greedy 'take the largest coin' fails for some coin sets (coins 1, 3, 4 and amount 6: greedy gives 4+1+1, but 3+3 is better), which is why DP is needed.",
    detail: [
      "The recurrence uses optimal substructure: the best answer for a builds on the best for a - c.",
      "Counting the number of ways is a variant with a different recurrence.",
      "Top-down memoization gives the same complexity.",
    ],
    ex: "For coins [1, 3, 4] and amount 6, `dp[6] = 2` using 3 + 3.",
    code: [
      [
        "Minimum coins",
        "python",
        `def min_coins(coins, amount):\n    INF = float("inf")\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a:\n                dp[a] = min(dp[a], dp[a - c] + 1)\n    return -1 if dp[amount] == INF else dp[amount]`,
        [
          "`dp[a]` is the best count for amount a.",
          "Each coin is tried for each amount.",
          "Infinity marks unreachable amounts.",
        ],
      ],
    ],
    mistakes: [
      "Assuming greedy works for any coin system.",
      "Not handling impossible amounts.",
    ],
    follow: ["Why does greedy fail for coins 1, 3, 4?"],
    points: [
      "dp[a] = min over coins of dp[a-c] + 1",
      "Base case dp[0] = 0",
      "O(amount × coins)",
      "Greedy is not always optimal",
    ],
    notes: ["Build up from smaller amounts."],
    src: [
      ["Python: functools.cache", `${PY}/library/functools.html`],
      ["Python: min", `${PY}/library/functions.html`],
    ],
  }),
  q({
    slug: "greedy-vs-dp-vs-divide-and-conquer",
    topic: "Dynamic programming",
    d: "hard",
    title:
      "How do greedy algorithms, divide and conquer and dynamic programming differ?",
    kw: [
      "greedy",
      "divide and conquer",
      "dynamic programming",
      "merge sort",
      "interval scheduling",
    ],
    intent: "Checks you can choose a technique for a problem.",
    short:
      "Divide and conquer splits a problem into independent subproblems, solves each, and combines the results, as in merge sort and binary search; because the subproblems don't overlap, nothing needs caching. Dynamic programming also splits into subproblems but they overlap, so it stores results to avoid repeating work. A greedy algorithm makes the locally best choice at each step and never reconsiders, which is fast and simple but only correct for problems with a proven greedy-choice property, such as selecting the most non-overlapping intervals by earliest finish time, or Dijkstra's algorithm. Check by reasoning or small counter-examples before trusting a greedy approach.",
    detail: [
      "Recursion tree shape tells you: independent branches suggest divide and conquer, repeated nodes suggest DP.",
      "Merge sort is divide and conquer with O(n log n) time.",
      "Always test greedy ideas against brute force on small inputs.",
    ],
    ex: "Activity selection is greedy by earliest finish, while coin change with arbitrary coins needs DP.",
    mistakes: [
      "Assuming greedy always works.",
      "Memoizing a problem with no overlapping subproblems.",
    ],
    follow: ["How can you tell DP from divide and conquer?"],
    points: [
      "Divide and conquer: independent subproblems",
      "DP: overlapping subproblems, cached",
      "Greedy: local choice, needs proof",
      "Test with counter-examples",
    ],
    notes: ["Overlap means cache."],
    src: [
      [
        "Python: Sorting techniques (Timsort merge approach)",
        `${PY}/howto/sorting.html`,
      ],
      ["Python: functools.cache", `${PY}/library/functools.html`],
    ],
  }),
  q({
    slug: "choosing-data-structures-for-problems",
    topic: "Complexity",
    d: "medium",
    title: "How do you choose the right data structure for a problem?",
    kw: [
      "choosing data structures",
      "access patterns",
      "operations cost",
      "trade-offs",
      "standard library",
    ],
    intent: "Checks you reason from operations to structures.",
    short:
      "List the operations you need and how often: lookup by key, lookup by position, insertion, deletion, ordered traversal, min or max, and membership. Then match the structure: arrays or ArrayList for indexed access and iteration; a hash map or set for O(1) average lookup and membership; a balanced tree map for ordered keys and range queries in O(log n); a heap or priority queue for repeatedly getting the smallest or largest; a deque for fast operations at both ends; a stack for LIFO; and a graph for relationships. Prefer the standard library, whose documented complexities you can rely on, and measure when it matters.",
    detail: [
      "A simple array beats fancy structures for small n.",
      "Consider memory and cache behaviour for large data.",
      "State the complexity of your choice when explaining it.",
    ],
    ex: "A leaderboard that always shows the best few scores: a heap or sorted structure, not a repeatedly sorted array.",
    mistakes: [
      "Using a list for membership tests on large data.",
      "Over-engineering for tiny inputs.",
    ],
    follow: ["Which structure gives sorted iteration with log n updates?"],
    points: [
      "List the needed operations",
      "Hash for lookup, tree for order",
      "Heap for min/max, deque for ends",
      "Use the standard library",
    ],
    notes: ["Operations choose the structure."],
    src: [
      ["Java: HashMap", `${JU}/HashMap.html`],
      ["Java: TreeMap", `${JU}/TreeMap.html`],
      ["Java: PriorityQueue", `${JU}/PriorityQueue.html`],
    ],
  }),
])
