import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-collections", {
  slug: "maps",
  title: "Maps: HashMap, LinkedHashMap, TreeMap and the helper methods",
  topic: "Map",
  minutes: 70,
  overview:
    "Use maps for key and value data, loop over them efficiently, and use compute, merge and getOrDefault to write short, correct code.",
  objectives: [
    "Choose between HashMap, LinkedHashMap and TreeMap",
    "Iterate over entries correctly",
    "Use getOrDefault, computeIfAbsent and merge",
  ],
  prerequisites: ["lesson.java-collections.sets"],
  sections: [
    {
      kind: "explain",
      heading: "The Map interface",
      body: [
        "A `Map<K, V>` stores **key and value** pairs. Keys are unique: putting a value for an existing key replaces the old value. `put(k, v)`, `get(k)`, which returns `null` for a missing key, `containsKey`, `remove` and `size` are the basic methods. A `Map` is not a `Collection`.",
        "`HashMap` is the general-purpose map with constant-time operations and no order. It allows one `null` key. `LinkedHashMap` also remembers insertion order, or access order if you ask for it, which makes it suitable for caches. `TreeMap` keeps the keys sorted, with logarithmic time, and offers `firstKey`, `floorKey` and `subMap`. `Hashtable` is an old synchronised class that is rarely used today, and `ConcurrentHashMap` is for concurrent use.",
        "Keys should be **immutable**, or at least their `hashCode` and `equals` must never change while they are in the map.",
      ],
    },
    {
      kind: "code",
      heading: "Iterating",
      example: {
        title: "entrySet and forEach",
        language: "java",
        code: 'Map<String, Integer> stock = new LinkedHashMap<>();\n    stock.put("pen", 10);\n    stock.put("book", 4);\n    stock.put("pen", 12);\n    for (Map.Entry<String, Integer> e : stock.entrySet()) {\n      System.out.println(e.getKey() + "=" + e.getValue());\n    }\n    stock.forEach((name, qty) -> System.out.print(name + ":" + qty + " "));\n    System.out.println();\n    System.out.println(stock.get("cup") + " " + stock.getOrDefault("cup", 0));',
        walkthrough: [
          "Putting `pen` again replaces its value, so there are two entries.",
          "`entrySet()` gives the key and the value together, without a second lookup.",
          "`get` returns `null` for a missing key, and `getOrDefault` gives a fallback.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "compute, merge and friends",
      body: [
        "These methods replace the manual check, get and put. `getOrDefault(k, d)` returns the value or a default without storing it. `putIfAbsent(k, v)` stores only if the key has no value. `computeIfAbsent(k, fn)` creates a missing value with a function and stores it, which is the standard way to build a **map of lists**. `merge(k, v, fn)` inserts the value if the key is absent, and otherwise combines the old and new values, which is ideal for **counting**.",
        "The function in `computeIfAbsent` runs only when the key is missing. On a `ConcurrentHashMap` these methods are atomic, so they are safe for concurrent use.",
      ],
    },
    {
      kind: "code",
      heading: "Counting and grouping",
      example: {
        title: "merge and computeIfAbsent",
        language: "java",
        code: 'Map<String, Integer> counts = new TreeMap<>();\n    for (String w : "to be or not to be".split(" ")) {\n      counts.merge(w, 1, Integer::sum);\n    }\n    System.out.println(counts);\n    Map<Integer, List<String>> byLength = new TreeMap<>();\n    for (String w : List.of("a", "bb", "cc", "d")) {\n      byLength.computeIfAbsent(w.length(), k -> new ArrayList<>()).add(w);\n    }\n    System.out.println(byLength);',
        walkthrough: [
          "`merge(w, 1, Integer::sum)` inserts `1` for a new word and adds `1` to an existing count.",
          "`computeIfAbsent` creates the list for a length once and then reuses it.",
          "The output is `{be=2, not=1, or=1, to=2}` and `{1=[a, d], 2=[bb, cc]}`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Calling a method on the result of `get` without a null check.",
          fix: "Use `getOrDefault`, or check `containsKey`.",
        },
        {
          mistake: "Looping over `keySet()` and calling `get` for each key.",
          fix: "Loop over `entrySet()`.",
        },
        {
          mistake: "Using a mutable object as a key and changing it.",
          fix: "Use immutable keys such as `String`, `Integer` or records.",
        },
        {
          mistake: "Expecting a HashMap to keep insertion order.",
          fix: "Use `LinkedHashMap`.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A word index",
      scenario:
        "A program reads a text and must list, for each first letter, the words that start with it, and count each word.",
      body: [
        "Use a `TreeMap<Character, List<String>>` with `computeIfAbsent` for the index, and a `HashMap<String, Integer>` with `merge` for the counts. Each takes one line per word.",
        "Both maps are built in a single pass over the words.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "map-put",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'Map<String, Integer> m = new HashMap<>();\nm.put("a", 1);\nm.put("a", 2);\nSystem.out.println(m.size() + " " + m.get("a"));',
      },
      options: ["1 2", "2 2", "1 1"],
      answer: 0,
      explanation: "Putting the same key again replaces the value.",
    },
    {
      type: "single",
      id: "map-count",
      prompt: "Which method is ideal for counting occurrences?",
      options: ["merge(key, 1, Integer::sum)", "putIfAbsent", "remove"],
      answer: 0,
      explanation: "`merge` inserts 1 or adds 1 to the existing count.",
    },
    {
      type: "truefalse",
      id: "map-collection",
      statement: "`Map` extends `Collection`.",
      answer: false,
      explanation: "A `Map` is a separate interface with its own methods.",
    },
    {
      type: "single",
      id: "map-ordered",
      prompt: "Which map keeps its keys sorted?",
      options: ["TreeMap", "HashMap", "LinkedHashMap"],
      answer: 0,
      explanation: "`TreeMap` sorts by natural order or a comparator.",
    },
  ],
  assignment: {
    title: "Phone book and word counts",
    task: [
      "Build a phone book with a `HashMap`, and print it sorted by name using a `TreeMap` copy.",
      "Count the letters of a paragraph with `merge`, and group names by length with `computeIfAbsent`.",
    ],
    checklist: [
      "No explicit containsKey-then-put code",
      "I looped over entrySet",
      "The output is sorted where needed",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "map-ex",
      title: "Group by first letter",
      task: [
        "Write `static Map<Character, List<String>> byFirstLetter(List<String> words)` returning a sorted map from the first letter to the words that start with it, in input order.",
      ],
      language: "java",
      starter: "import java.util.*;\n\npublic class Index {\n  // your code\n}",
      solution:
        'import java.util.*;\n\npublic class Index {\n  static Map<Character, List<String>> byFirstLetter(List<String> words) {\n    Map<Character, List<String>> result = new TreeMap<>();\n    for (String w : words) {\n      result.computeIfAbsent(w.charAt(0), k -> new ArrayList<>()).add(w);\n    }\n    return result;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(byFirstLetter(List.of("bee", "ant", "bat", "cow")));\n  }\n}',
      hints: ["Use `computeIfAbsent` to create the list for a letter."],
      checklist: [
        "The map is sorted by letter",
        "The words keep their input order",
        "No containsKey check is used",
      ],
    },
  ],
  revisionNotes: [
    "Map = unique keys; HashMap unordered, LinkedHashMap insertion order, TreeMap sorted",
    "Loop with `entrySet()` or `forEach`",
    "`getOrDefault`, `computeIfAbsent`, `merge` replace check-then-put",
    "Use immutable keys",
  ],
  resources: [
    {
      label: "The Java Tutorials: The Map Interface",
      url: "https://docs.oracle.com/javase/tutorial/collections/interfaces/map.html",
    },
    {
      label: "The Java Tutorials: Map Implementations",
      url: "https://docs.oracle.com/javase/tutorial/collections/implementations/map.html",
    },
    {
      label: "Java SE API: Map",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html",
    },
  ],
})
