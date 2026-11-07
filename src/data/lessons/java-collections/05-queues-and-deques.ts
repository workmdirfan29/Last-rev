import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-collections", {
  slug: "queues-and-deques",
  title: "Queue, Deque and PriorityQueue",
  topic: "Queue & Deque",
  minutes: 50,
  overview:
    "Use queues, deques and stacks correctly, know the two method families, and use a priority queue for ordered processing.",
  objectives: [
    "Use ArrayDeque as a queue and as a stack",
    "Tell the exception-throwing methods from the special-value ones",
    "Use PriorityQueue with a comparator",
  ],
  prerequisites: ["lesson.java-collections.maps"],
  sections: [
    {
      kind: "explain",
      heading: "Queue and Deque",
      body: [
        "A `Queue` holds elements for processing, usually **first in, first out**: you add at the tail and take from the head. A `Deque` is a **double-ended queue**: it adds and removes at both ends, so it can be a queue or a stack. The usual implementation for both is **`ArrayDeque`**, which is faster than `LinkedList` and uses less memory. It does not allow `null` elements.",
        "For a **stack**, use `Deque` with `push`, `pop` and `peek`. The old `Stack` class extends `Vector`, so every method is synchronised, and it exposes list methods that break the idea of a stack. The Javadoc recommends a `Deque` instead.",
        "For threads, use a `BlockingQueue` such as `LinkedBlockingQueue`.",
      ],
    },
    {
      kind: "explain",
      heading: "Two families of methods",
      body: [
        "Each queue operation exists in two forms. The first form **throws an exception** on failure: `add` throws if the queue is full, `remove` and `element` throw `NoSuchElementException` if it is empty. The second form returns a **special value**: `offer` returns `false` if it cannot add, and `poll` and `peek` return `null` if the queue is empty.",
        "`peek` and `element` only look at the head. `poll` and `remove` take it out. Use the special-value form when an empty or full queue is a normal situation, such as a worker loop `while ((job = queue.poll()) != null)`.",
      ],
    },
    {
      kind: "code",
      heading: "Queue, stack and priority",
      example: {
        title: "ArrayDeque and PriorityQueue",
        language: "java",
        code: 'Queue<String> q = new ArrayDeque<>();\n    q.offer("first");\n    q.offer("second");\n    System.out.println(q.poll() + " " + q.peek() + " " + new ArrayDeque<String>().poll());\n    Deque<Integer> stack = new ArrayDeque<>();\n    stack.push(1);\n    stack.push(2);\n    System.out.println(stack.pop() + " " + stack.peek());\n    PriorityQueue<Integer> pq = new PriorityQueue<>(List.of(5, 1, 3));\n    System.out.println(pq.poll() + " " + pq.poll());\n    PriorityQueue<String> longest = new PriorityQueue<>(Comparator.comparing(String::length).reversed());\n    longest.addAll(List.of("a", "ccc", "bb"));\n    System.out.println(longest.poll());',
        walkthrough: [
          "`poll` removes the head, and returns `null` for an empty queue instead of throwing.",
          "`push` and `pop` work at the same end, so the stack is last in, first out.",
          "A `PriorityQueue` always gives the smallest element first, or the first by the comparator, and not the first one added.",
          "The output is `first second null`, `2 1`, `1 3` and `ccc`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "PriorityQueue",
      body: [
        "A `PriorityQueue` is backed by a **binary heap**. `poll` and `peek` always give the **smallest** element by the natural order or by the comparator you pass to the constructor. `offer` and `poll` take logarithmic time, and `peek` constant time. Its **iteration order is not sorted**: only the head is guaranteed to be the smallest. To get all elements in order, call `poll` repeatedly.",
        'It is the usual tool for scheduling by priority and for the "top K" problem. For a max-heap, use `Comparator.reverseOrder()`. It is not thread-safe and does not allow `null`.',
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using `remove` on a queue that may be empty.",
          fix: "Use `poll`, which returns `null`.",
        },
        {
          mistake: "Using the legacy `Stack` class.",
          fix: "Use `ArrayDeque`.",
        },
        {
          mistake: "Printing a PriorityQueue and expecting a sorted result.",
          fix: "Only the head is ordered. Poll in a loop.",
        },
        {
          mistake: "Putting `null` into an ArrayDeque.",
          fix: "It throws. Use a different marker.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A task scheduler",
      scenario:
        "A scheduler runs the task with the highest priority first, and breaks ties by the time it was added.",
      body: [
        "Use a `PriorityQueue<Task>` with `Comparator.comparingInt(Task::priority).reversed().thenComparingLong(Task::createdAt)`. `poll` returns the next task to run.",
        "The ordering rule is in one comparator, and the queue does the rest.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "q-order",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: "Deque<Integer> d = new ArrayDeque<>();\nd.addLast(1);\nd.addFirst(2);\nd.addLast(3);\nSystem.out.println(d);",
      },
      options: ["[2, 1, 3]", "[1, 2, 3]", "[3, 1, 2]"],
      answer: 0,
      explanation:
        "`addFirst` puts `2` at the front, so the order is `2, 1, 3`.",
    },
    {
      type: "single",
      id: "q-null",
      prompt: "What does `poll()` return for an empty queue?",
      options: ["null", "An exception", "0"],
      answer: 0,
      explanation:
        "The special-value methods return `null`. `remove()` throws.",
    },
    {
      type: "truefalse",
      id: "q-stack",
      statement:
        "The `Stack` class is the recommended way to write a stack in new code.",
      answer: false,
      explanation: "Use `Deque<T> stack = new ArrayDeque<>()`.",
    },
    {
      type: "single",
      id: "q-pq",
      prompt: "In what order does a PriorityQueue return elements with `poll`?",
      options: [
        "Smallest first by the order",
        "Insertion order",
        "Largest first always",
      ],
      answer: 0,
      explanation:
        "The head is the smallest by the natural order or the comparator.",
    },
  ],
  assignment: {
    title: "Brackets and a scheduler",
    task: [
      "Write a method that checks whether the brackets in a string are balanced, using a `Deque` as a stack.",
      "Write a small scheduler with a `PriorityQueue` and a comparator for priority and creation time.",
    ],
    checklist: [
      "Unbalanced input is detected",
      "The scheduler runs tasks in the right order",
      "No Stack class is used",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "q-ex",
      title: "Balanced brackets",
      task: [
        "Write `static boolean balanced(String text)` for the brackets `()`, `[]` and `{}` using an `ArrayDeque` as a stack.",
      ],
      language: "java",
      starter:
        "import java.util.*;\n\npublic class Brackets {\n  // your code\n}",
      solution:
        "import java.util.*;\n\npublic class Brackets {\n  static boolean balanced(String text) {\n    Deque<Character> stack = new ArrayDeque<>();\n    for (char c : text.toCharArray()) {\n      if (c == '(' || c == '[' || c == '{') {\n        stack.push(c);\n      } else if (c == ')' || c == ']' || c == '}') {\n        if (stack.isEmpty()) return false;\n        char open = stack.pop();\n        if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{')) {\n          return false;\n        }\n      }\n    }\n    return stack.isEmpty();\n  }\n\n  public static void main(String[] args) {\n    System.out.println(balanced(\"{[()]}\") + \" \" + balanced(\"([)]\"));\n  }\n}",
      hints: ["Push openings, and pop and compare at each closing bracket."],
      checklist: [
        "A closing bracket on an empty stack gives false",
        "Leftover openings give false",
        "ArrayDeque is used",
      ],
    },
  ],
  revisionNotes: [
    "Queue: FIFO; Deque: both ends; ArrayDeque for queues and stacks",
    "add/remove/element throw; offer/poll/peek return a special value",
    "PriorityQueue: heap, smallest first by order; iteration is not sorted",
    "Use Deque instead of the legacy Stack",
  ],
  resources: [
    {
      label: "The Java Tutorials: The Queue Interface",
      url: "https://docs.oracle.com/javase/tutorial/collections/interfaces/queue.html",
    },
    {
      label: "The Java Tutorials: The Deque Interface",
      url: "https://docs.oracle.com/javase/tutorial/collections/interfaces/deque.html",
    },
    {
      label: "Java SE API: PriorityQueue",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/PriorityQueue.html",
    },
  ],
})
