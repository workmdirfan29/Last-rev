import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-collections", {
  slug: "sets",
  title: "Sets: HashSet, LinkedHashSet and TreeSet",
  topic: "Set",
  minutes: 50,
  overview:
    "Store unique values, choose the right set for the ordering you need, and use set operations.",
  objectives: [
    "Choose between HashSet, LinkedHashSet and TreeSet",
    "Explain how a HashSet finds duplicates",
    "Do union, intersection and difference with bulk methods",
  ],
  prerequisites: ["lesson.java-collections.lists"],
  sections: [
    {
      kind: "explain",
      heading: "What a set is",
      body: [
        "A `Set` holds **no duplicates**. `add` returns `false` if the element is already there. The three main implementations differ in ordering. `HashSet` is backed by a hash table, gives constant-time `add`, `remove` and `contains` on average, and has **no defined order**. `LinkedHashSet` is the same with a linked list through the elements, so it iterates in **insertion order**. `TreeSet` keeps the elements **sorted**, by natural order or a comparator, with logarithmic time, and offers `first`, `last`, `floor`, `ceiling` and `subSet`.",
        "A `HashSet` is built on a `HashMap`, and decides that two elements are the same with `hashCode` and then `equals`. So elements of your own class need correct `equals` and `hashCode`. A `TreeSet` uses `compareTo` or the comparator instead of `equals`.",
        "`EnumSet` is a very compact and fast set for enum values.",
      ],
    },
    {
      kind: "code",
      heading: "Three sets",
      example: {
        title: "Order and duplicates",
        language: "java",
        code: 'String[] input = {"pear", "apple", "pear", "fig"};\n    Set<String> hash = new HashSet<>(Arrays.asList(input));\n    Set<String> linked = new LinkedHashSet<>(Arrays.asList(input));\n    TreeSet<String> sorted = new TreeSet<>(Arrays.asList(input));\n    System.out.println(hash.size() + " " + linked + " " + sorted);\n    System.out.println(sorted.first() + " " + sorted.ceiling("b"));\n    System.out.println(linked.add("fig"));',
        walkthrough: [
          "All three remove the duplicate `pear`, so each has three elements.",
          "`LinkedHashSet` keeps insertion order and `TreeSet` sorts alphabetically.",
          '`ceiling("b")` is the smallest element that is not less than `b`, which is `fig`.',
          "`add` returns `false` for an element that is already present.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Set operations",
      body: [
        "The bulk methods give the set operations, and they **change the set they are called on**, so copy first if you need the original. `a.addAll(b)` makes `a` the **union**. `a.retainAll(b)` keeps only the elements that are also in `b`, the **intersection**. `a.removeAll(b)` removes the elements of `b`, the **difference**. `a.containsAll(b)` tests whether `b` is a **subset**.",
        "Pass a `Set` to `removeAll` and `retainAll`, because a `List` argument makes them slow for large data. Removing duplicates from a list is a typical use: `new LinkedHashSet<>(list)` removes them and keeps the order.",
      ],
    },
    {
      kind: "code",
      heading: "Union, intersection, difference",
      example: {
        title: "Bulk operations",
        language: "java",
        code: 'Set<Integer> a = new TreeSet<>(List.of(1, 2, 3));\n    Set<Integer> b = new TreeSet<>(List.of(3, 4));\n    Set<Integer> union = new TreeSet<>(a);\n    union.addAll(b);\n    Set<Integer> common = new TreeSet<>(a);\n    common.retainAll(b);\n    Set<Integer> onlyA = new TreeSet<>(a);\n    onlyA.removeAll(b);\n    System.out.println(union + " " + common + " " + onlyA);\n    System.out.println(new LinkedHashSet<>(List.of(3, 1, 3, 2, 1)));',
        walkthrough: [
          "Each operation works on a copy, so `a` and `b` stay unchanged.",
          "The union is `[1, 2, 3, 4]`, the intersection `[3]` and the difference `[1, 2]`.",
          "`LinkedHashSet` removes duplicates and keeps the first-seen order.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Relying on the iteration order of a HashSet.",
          fix: "Use `LinkedHashSet` or `TreeSet` when order matters.",
        },
        {
          mistake:
            "Putting your own objects into a HashSet without `equals` and `hashCode`.",
          fix: "Override both, with the same fields.",
        },
        {
          mistake:
            "Changing a field that is used in `hashCode` after adding the object.",
          fix: "The element is lost. Use immutable elements.",
        },
        {
          mistake: "Calling `retainAll` on the original set and losing data.",
          fix: "Copy first.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Unique visitors",
      scenario:
        "A site records the ids of the users who visited today, and counts how many different users came.",
      body: [
        "A `HashSet<Long>` stores the ids. `add` ignores repeats, and `size()` gives the number of different visitors. Checking `contains(id)` is constant time.",
        "If the report must list the visitors in sorted order, copy them into a `TreeSet`.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "set-order",
      prompt: "Which set iterates in insertion order?",
      options: ["LinkedHashSet", "HashSet", "TreeSet"],
      answer: 0,
      explanation: "`TreeSet` sorts, and `HashSet` has no defined order.",
    },
    {
      type: "output",
      id: "set-add",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'Set<String> s = new HashSet<>();\nSystem.out.println(s.add("a") + " " + s.add("a"));',
      },
      options: ["true false", "true true", "false false"],
      answer: 0,
      explanation:
        "The second `add` finds an equal element and returns `false`.",
    },
    {
      type: "truefalse",
      id: "set-equals",
      statement: "A HashSet uses `equals` and `hashCode` to find duplicates.",
      answer: true,
      explanation:
        "`hashCode` picks the bucket, and `equals` confirms equality.",
    },
    {
      type: "blank",
      id: "set-union",
      prompt: "To make `a` the union of `a` and `b`, call `a.___(b)`.",
      answer: "addAll",
      explanation:
        "`retainAll` is the intersection and `removeAll` the difference.",
    },
  ],
  assignment: {
    title: "Set algebra",
    task: [
      "Read two lists of words from two sentences.",
      "Print the words in both, in only the first, and the unique words of both sorted, using sets, and explain why you chose each set type.",
    ],
    checklist: [
      "No duplicates in any result",
      "The sorted output uses TreeSet",
      "The original sets are not damaged",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "set-ex",
      title: "Common elements",
      task: [
        "Write `static <T> Set<T> common(Collection<T> a, Collection<T> b)` that returns the elements in both, without changing the inputs.",
      ],
      language: "java",
      starter:
        "import java.util.*;\n\npublic class Common {\n  // your code\n}",
      solution:
        "import java.util.*;\n\npublic class Common {\n  static <T> Set<T> common(Collection<T> a, Collection<T> b) {\n    Set<T> result = new LinkedHashSet<>(a);\n    result.retainAll(new HashSet<>(b));\n    return result;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(common(List.of(1, 2, 3, 3), List.of(3, 4, 1)));\n  }\n}",
      hints: [
        "Copy the first collection into a new set, then retain the elements of the second.",
      ],
      checklist: [
        "The inputs are not changed",
        "Duplicates are removed",
        "The second argument is turned into a set for speed",
      ],
    },
  ],
  revisionNotes: [
    "Set = no duplicates; HashSet unordered, LinkedHashSet insertion order, TreeSet sorted",
    "HashSet relies on equals and hashCode",
    "addAll = union, retainAll = intersection, removeAll = difference (copy first)",
    "`new LinkedHashSet<>(list)` removes duplicates and keeps order",
  ],
  resources: [
    {
      label: "The Java Tutorials: The Set Interface",
      url: "https://docs.oracle.com/javase/tutorial/collections/interfaces/set.html",
    },
    {
      label: "The Java Tutorials: Set Implementations",
      url: "https://docs.oracle.com/javase/tutorial/collections/implementations/set.html",
    },
  ],
})
