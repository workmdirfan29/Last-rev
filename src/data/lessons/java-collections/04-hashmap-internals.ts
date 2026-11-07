import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-collections", {
  slug: "hashmap-internals",
  title: "How HashMap works inside",
  topic: "HashMap internals",
  minutes: 80,
  overview:
    "Understand buckets, hash codes, collisions, resizing and the rules for good keys, so you can explain HashMap in an interview and use it correctly.",
  objectives: [
    "Describe how put and get use hashCode and equals",
    "Explain collisions, load factor and resizing",
    "Show why mutable keys and bad hash codes break a map",
  ],
  prerequisites: ["lesson.java-collections.maps"],
  sections: [
    {
      kind: "explain",
      heading: "Buckets and hash codes",
      body: [
        "A `HashMap` keeps an **array of buckets**. When you call `put(key, value)`, it calls `key.hashCode()`, mixes the bits of the result, and uses it to pick a **bucket index** in the array. If the bucket is empty, the entry is stored there. If it already holds entries, the map compares the keys with `equals`: an equal key has its value replaced, and a different key is added to the same bucket.",
        "`get(key)` follows the same steps. It finds the bucket from the hash code, and then compares only the few keys in that bucket. This is why `get` is constant time on average. The array length is always a power of two, so the index is calculated with a bit mask.",
        "So **two things matter** for the key class: `hashCode` must spread the keys evenly, and `equals` must be consistent with it. Equal keys must have the same hash code.",
      ],
    },
    {
      kind: "explain",
      heading: "Collisions and trees",
      body: [
        "A **collision** happens when two different keys go to the same bucket. The entries in a bucket form a linked list, and a lookup walks it comparing keys. Since Java 8, if a bucket becomes long, it is converted into a **balanced tree**, so that the worst case in that bucket is logarithmic and not linear. When it shrinks again, it turns back into a list.",
        "A collision is not an overwrite: both entries are kept, and only an **equal** key replaces a value. A good `hashCode` makes collisions rare, and a bad one, such as a constant, puts everything in one bucket.",
      ],
    },
    {
      kind: "explain",
      heading: "Capacity, load factor and resizing",
      body: [
        "The **capacity** is the number of buckets, and the **load factor** says how full the map may get. The defaults are a capacity of 16 and a load factor of 0.75. When the number of entries exceeds capacity times load factor, the map **doubles** the table and redistributes the entries. This is called **rehashing**, and it costs time proportional to the size of the map.",
        "If you know how many entries you will store, give the map an initial capacity of about `n / 0.75 + 1`, so that it never needs to resize while loading. This is why adding to a `HashMap` is *amortised* constant time.",
      ],
    },
    {
      kind: "code",
      heading: "Hash codes and collisions",
      example: {
        title: "A bad hashCode",
        language: "java",
        code: 'public class Main {\n  static class BadKey {\n    final String id;\n    BadKey(String id) { this.id = id; }\n    @Override public int hashCode() { return 1; }\n    @Override public boolean equals(Object o) { return o instanceof BadKey k && id.equals(k.id); }\n  }\n\n  public static void main(String[] args) {\n    Map<BadKey, Integer> map = new HashMap<>();\n    map.put(new BadKey("a"), 1);\n    map.put(new BadKey("b"), 2);\n    map.put(new BadKey("a"), 3);\n    System.out.println(map.size() + " " + map.get(new BadKey("a")));\n    System.out.println("hello".hashCode() + " " + "Hello".hashCode());\n  }\n}',
        walkthrough: [
          "Every `BadKey` has the same hash code, so all go to one bucket. The map is still correct, only slow.",
          "The third `put` finds an equal key with `equals`, so it replaces the value, and the size is `2`.",
          "`String` has a well-spread hash code, and different strings usually have different codes.",
        ],
      },
    },
    {
      kind: "code",
      heading: "A lost entry",
      example: {
        title: "Mutating a key",
        language: "java",
        code: 'public class Main {\n  static class Key {\n    String id;\n    Key(String id) { this.id = id; }\n    @Override public int hashCode() { return id.hashCode(); }\n    @Override public boolean equals(Object o) { return o instanceof Key k && id.equals(k.id); }\n  }\n\n  public static void main(String[] args) {\n    Map<Key, String> m = new HashMap<>();\n    Key k = new Key("a");\n    m.put(k, "value");\n    k.id = "b";\n    System.out.println(m.get(k) + " " + m.size());\n  }\n}',
        walkthrough: [
          "The entry was stored using the hash code of `a`.",
          "After the change, the hash code is that of `b`, so the lookup goes to another bucket and finds nothing.",
          "The entry is still in the map, but unreachable. The output is `null 1`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Overriding `equals` without `hashCode` for a map key.",
          fix: "Override both with the same fields.",
        },
        {
          mistake: "Mutating a key after putting it in a map.",
          fix: "Use immutable keys.",
        },
        {
          mistake: "Saying that a collision overwrites the old entry.",
          fix: "Entries in a bucket are chained. Only an equal key replaces.",
        },
        {
          mistake: "Ignoring the initial capacity for a huge, known load.",
          fix: "Pass a capacity to avoid repeated resizes.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Explaining HashMap in an interview",
      scenario:
        "An interviewer asks: what happens when you call put on a HashMap?",
      body: [
        "Answer in steps: compute the hash code of the key, find the bucket, compare keys with equals inside the bucket, then add or replace; grow and rehash when the load factor is exceeded; long buckets become trees.",
        "Add the two rules: equal keys must have equal hash codes, and keys must not change while they are in the map.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "hm-index",
      prompt: "How does a HashMap choose the bucket for a key?",
      options: [
        "From the key's hash code",
        "From the key's length",
        "Randomly",
      ],
      answer: 0,
      explanation:
        "The hash code is mixed and masked to an index in the table.",
    },
    {
      type: "single",
      id: "hm-collision",
      prompt: "What happens when two different keys land in the same bucket?",
      options: [
        "Both entries are kept in the bucket",
        "The first is overwritten",
        "An exception is thrown",
      ],
      answer: 0,
      explanation:
        "Entries are chained. Only an equal key replaces an existing value.",
    },
    {
      type: "truefalse",
      id: "hm-load",
      statement:
        "A HashMap with default settings doubles its table when it is 75 percent full.",
      answer: true,
      explanation:
        "The default load factor is 0.75. Exceeding it triggers a resize and rehash.",
    },
    {
      type: "output",
      id: "hm-null",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: "Map<String, Integer> m = new HashMap<>();\nm.put(null, 1);\nSystem.out.println(m.get(null));",
      },
      options: ["1", "null", "NullPointerException"],
      answer: 0,
      explanation: "`HashMap` allows one `null` key, which goes to bucket 0.",
    },
  ],
  assignment: {
    title: "Inspect a hash map",
    task: [
      "Write a key class with a configurable `hashCode`, and put 10,000 keys into a map with a good and with a constant hash code.",
      "Time both, and explain the result with buckets and trees. Then mutate a key and show the lost entry.",
    ],
    checklist: [
      "I measured both versions",
      "I explained the result with buckets",
      "I reproduced the lost entry",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "hm-ex",
      title: "A key with equals and hashCode",
      task: [
        "Write a record-like class `Point` with `x` and `y` and correct `equals` and `hashCode`, and show that two equal points are one key in a `HashMap`.",
      ],
      language: "java",
      starter:
        "import java.util.*;\n\npublic class PointDemo {\n  // your code\n}",
      solution:
        'import java.util.*;\n\npublic class PointDemo {\n  static final class Point {\n    private final int x;\n    private final int y;\n\n    Point(int x, int y) {\n      this.x = x;\n      this.y = y;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n      if (this == o) return true;\n      if (!(o instanceof Point p)) return false;\n      return x == p.x && y == p.y;\n    }\n\n    @Override\n    public int hashCode() {\n      return Objects.hash(x, y);\n    }\n  }\n\n  public static void main(String[] args) {\n    Map<Point, String> map = new HashMap<>();\n    map.put(new Point(1, 2), "first");\n    map.put(new Point(1, 2), "second");\n    System.out.println(map.size() + " " + map.get(new Point(1, 2)));\n  }\n}',
      hints: [
        "Use the same fields in `equals` and `hashCode`, and make the fields final.",
      ],
      checklist: [
        "The two points are one key",
        "Fields are final",
        "hashCode uses the same fields as equals",
      ],
    },
  ],
  revisionNotes: [
    "put: hashCode → bucket → equals on the keys there → add or replace",
    "Collisions are chained; long buckets become trees (Java 8+)",
    "Default capacity 16, load factor 0.75; resize doubles and rehashes",
    "Immutable keys; equal keys must have equal hash codes",
  ],
  resources: [
    {
      label: "Java SE API: HashMap",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html",
    },
    {
      label: "The Java Tutorials: Map Implementations",
      url: "https://docs.oracle.com/javase/tutorial/collections/implementations/map.html",
    },
  ],
})
