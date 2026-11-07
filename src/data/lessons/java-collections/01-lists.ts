import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-collections", {
  slug: "lists",
  title: "Lists: ArrayList, LinkedList and immutable lists",
  topic: "List",
  minutes: 60,
  overview:
    "Use the List interface well: choose an implementation, avoid the common traps, and sort with comparators.",
  objectives: [
    "Choose between ArrayList and LinkedList",
    "Create immutable lists and avoid ConcurrentModificationException",
    "Sort with Comparable and Comparator",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "The collections framework and List",
      body: [
        "The **Java Collections Framework** is a set of interfaces and classes for groups of objects. `Collection` has the sub-interfaces `List` (ordered, allows duplicates), `Set` (no duplicates) and `Queue`. `Map` is separate and stores key and value pairs. Declare variables with the **interface** type, `List<String> names = new ArrayList<>();`, so that the implementation can change.",
        "`ArrayList` keeps its elements in a resizable array: reading by index is constant time, adding at the end is amortised constant time, and inserting or removing in the middle shifts elements. `LinkedList` stores nodes that are linked together: reaching the i-th element means walking the chain, so `get(i)` is slow, and it uses more memory. `ArrayList` is the right default in almost every program.",
        "When the list is full, `ArrayList` allocates a larger array, about one and a half times bigger, and copies the elements. If you know the expected size, `new ArrayList<>(10_000)` avoids repeated copying.",
      ],
    },
    {
      kind: "code",
      heading: "Common list operations",
      example: {
        title: "ArrayList basics",
        language: "java",
        code: 'List<String> names = new ArrayList<>(List.of("Asha", "Ravi", "Meera"));\n    names.add("Karan");\n    names.add(1, "Dev");\n    names.remove("Ravi");\n    System.out.println(names + " " + names.indexOf("Meera") + " " + names.contains("Zoya"));\n    List<String> part = names.subList(1, 3);\n    System.out.println(part);\n    names.replaceAll(String::toUpperCase);\n    System.out.println(names.get(0));',
        walkthrough: [
          "`List.of` is copied into a new `ArrayList`, which can be changed.",
          "`add(1, x)` inserts at an index, and `remove(Object)` removes the first equal element.",
          "`subList(1, 3)` is a view of positions 1 and 2, because the end index is excluded.",
          "The output is `[Asha, Dev, Meera, Karan] 2 false`, `[Dev, Meera]` and `ASHA`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Fixed-size and immutable lists, and safe removal",
      body: [
        "`Arrays.asList(...)` gives a **fixed-size** list backed by the array: `set` is allowed, but `add` and `remove` throw `UnsupportedOperationException`. `List.of(...)`, from Java 9, is **immutable** and does not allow `null`. `List.copyOf(list)` makes an immutable copy. To get a list that you can change, wrap one of them in `new ArrayList<>(...)`.",
        "Changing a list structurally, by adding or removing, while you loop over it with a for-each loop throws **`ConcurrentModificationException`**. The iterators are *fail-fast*. Remove safely with `list.removeIf(predicate)`, with `iterator.remove()`, or by collecting what to remove first.",
        "Beware of `list.remove(int)` and `list.remove(Object)` on a `List<Integer>`: `remove(1)` removes the element at **index** 1, and `remove(Integer.valueOf(1))` removes the **value** 1.",
      ],
    },
    {
      kind: "code",
      heading: "Traps",
      example: {
        title: "Immutable list and safe removal",
        language: "java",
        code: 'List<Integer> fixed = Arrays.asList(1, 2, 3);\n    fixed.set(0, 9);\n    try {\n      fixed.add(4);\n    } catch (UnsupportedOperationException e) {\n      System.out.println("fixed size");\n    }\n    List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));\n    nums.removeIf(n -> n % 2 == 0);\n    System.out.println(nums);\n    List<Integer> ids = new ArrayList<>(List.of(10, 20, 30));\n    ids.remove(1);\n    ids.remove(Integer.valueOf(30));\n    System.out.println(ids);',
        walkthrough: [
          "`Arrays.asList` allows `set` but not `add`, so the exception is caught.",
          "`removeIf` removes the matching elements safely, and leaves `[1, 3, 5]`.",
          "`remove(1)` removes the element at index 1, which is `20`, and `remove(Integer.valueOf(30))` removes the value `30`, leaving `[10]`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Sorting",
      body: [
        "`Collections.sort(list)` and `list.sort(null)` use the **natural order**, defined by `Comparable.compareTo` of the elements. `list.sort(comparator)` uses the order that you give. A `Comparator` is a separate object, so you can have many orders for one class without changing it. Build them with `Comparator.comparing(Person::name).thenComparing(Person::age)` and reverse with `reversed()`.",
        "Return the result of `Integer.compare(a, b)`, and not `a - b`, which can overflow. The sorting algorithm is stable, so elements that compare equal keep their original order.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using `LinkedList` because insertion is O(1).",
          fix: "You must first find the position, which is O(n). `ArrayList` is usually faster.",
        },
        {
          mistake: "Removing items inside a for-each loop.",
          fix: "Use `removeIf` or an iterator.",
        },
        {
          mistake: "Calling `add` on `List.of` or `Arrays.asList` results.",
          fix: "Copy into `new ArrayList<>(...)` first.",
        },
        {
          mistake: "Subtracting integers in a comparator.",
          fix: "Use `Integer.compare`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A shopping cart",
      scenario:
        "A cart keeps items in the order added, and the page shows them sorted by price.",
      body: [
        "Keep an `ArrayList<Item>` for the order, and show `cart.stream().sorted(Comparator.comparing(Item::price))` without changing the cart. Removing sold-out items uses `removeIf`.",
        "The list changes only in one place, and the sorted views are calculated.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "list-remove",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: "List<Integer> l = new ArrayList<>(List.of(5, 6, 7));\nl.remove(1);\nSystem.out.println(l);",
      },
      options: ["[5, 7]", "[6, 7]", "[5, 6]"],
      answer: 0,
      explanation:
        "`remove(int)` removes by index, so index 1 (the value 6) is removed.",
    },
    {
      type: "single",
      id: "list-default",
      prompt: "Which implementation is the usual default for a List?",
      options: ["ArrayList", "LinkedList", "Vector"],
      answer: 0,
      explanation: "The array gives fast reading and a compact memory layout.",
    },
    {
      type: "truefalse",
      id: "list-aslist",
      statement:
        "You can add elements to the list returned by `Arrays.asList`.",
      answer: false,
      explanation:
        "It has a fixed size. `add` throws `UnsupportedOperationException`.",
    },
    {
      type: "single",
      id: "list-cme",
      prompt: "How do you remove elements safely while iterating?",
      options: [
        "list.removeIf(predicate) or iterator.remove()",
        "list.remove(x) inside a for-each",
        "Catch the exception",
      ],
      answer: 0,
      explanation:
        "Structural changes outside the iterator are detected and rejected.",
    },
  ],
  assignment: {
    title: "A sorted task list",
    task: [
      "Create a `Task` class with a name, a priority and a due date, and a list of at least eight tasks.",
      "Sort by priority and then by due date with a `Comparator`, remove finished tasks with `removeIf`, and print each stage.",
    ],
    checklist: [
      "Sorting uses a Comparator with thenComparing",
      "No ConcurrentModificationException occurs",
      "The original list is not changed by the display sort",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "list-ex",
      title: "Remove short words",
      task: [
        "Write `static List<String> withoutShort(List<String> words, int min)` that returns a new list without the words shorter than `min`. The input must not change.",
      ],
      language: "java",
      starter: "import java.util.*;\n\npublic class Words {\n  // your code\n}",
      solution:
        'import java.util.*;\n\npublic class Words {\n  static List<String> withoutShort(List<String> words, int min) {\n    List<String> copy = new ArrayList<>(words);\n    copy.removeIf(w -> w.length() < min);\n    return copy;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(withoutShort(List.of("a", "tree", "ok", "house"), 3));\n  }\n}',
      hints: ["Copy first, because the input may be immutable."],
      checklist: [
        "The input list is not changed",
        "removeIf is used",
        "An empty list works",
      ],
    },
  ],
  revisionNotes: [
    "ArrayList is the default; LinkedList is rarely better",
    "`Arrays.asList` is fixed-size, `List.of` is immutable; copy to change",
    "Never remove inside for-each: `removeIf` or an iterator",
    "`Comparator.comparing(...).thenComparing(...)`; `Integer.compare`, not subtraction",
  ],
  resources: [
    {
      label: "The Java Tutorials: The List Interface",
      url: "https://docs.oracle.com/javase/tutorial/collections/interfaces/list.html",
    },
    {
      label: "The Java Tutorials: List Implementations",
      url: "https://docs.oracle.com/javase/tutorial/collections/implementations/list.html",
    },
    {
      label: "The Java Tutorials: Object Ordering",
      url: "https://docs.oracle.com/javase/tutorial/collections/interfaces/order.html",
    },
  ],
})
