import { defineQuestions } from "../author"
import { g } from "../brief"

const C = "https://docs.oracle.com/javase/tutorial/collections"
const GN = "https://docs.oracle.com/javase/tutorial/java/generics"
const API =
  "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util"

export default defineQuestions("java-collections", "fresher", [
  g({
    slug: "collections-framework-overview",
    topic: "List",
    d: "easy",
    title:
      "What is the Java Collections Framework and what are its main interfaces?",
    kw: ["collections framework", "Collection", "List", "Set", "Map"],
    intent: "Checks that you have a map of the framework in your head.",
    short:
      "The Java Collections Framework is a set of interfaces and classes for storing and working with groups of objects. The main interfaces are `Collection`, with its sub-interfaces `List` (ordered, allows duplicates), `Set` (no duplicates) and `Queue` (items processed in order, usually first in, first out), and `Map`, which stores key-value pairs and is not a `Collection`. Each interface has several implementations, such as `ArrayList`, `HashSet` and `HashMap`, with different performance characteristics.",
    detail: [
      "Program against the interface, for example `List<String> names = new ArrayList<>();`, so that the implementation can be changed.",
      "The `Collections` and `Arrays` utility classes provide sorting, searching and other algorithms.",
      "`Iterable` is the root that allows the for-each loop.",
    ],
    ex: "A shop keeps an ordered `List` of cart items, a `Set` of unique coupon codes and a `Map` from product id to stock.",
    mistakes: [
      "Saying that `Map` extends `Collection`.",
      "Declaring variables with the implementation type instead of the interface.",
    ],
    follow: ["Why declare a variable as List instead of ArrayList?"],
    points: [
      "Collection: List, Set, Queue",
      "Map is separate",
      "Code to the interface",
    ],
    notes:
      "List, Set, Queue extend Collection. Map is separate. Declare by interface.",
    src: [
      ["The Java Tutorials: Collections", `${C}/index.html`],
      ["The Java Tutorials: Interfaces", `${C}/interfaces/index.html`],
    ],
  }),
  g({
    slug: "arraylist-vs-linkedlist",
    topic: "List",
    d: "easy",
    title: "What is the difference between `ArrayList` and `LinkedList`?",
    kw: [
      "ArrayList",
      "LinkedList",
      "random access",
      "insertion",
      "performance",
    ],
    intent:
      "Checks that you can pick a list implementation from how it is used.",
    short:
      "`ArrayList` stores its elements in a resizable array, so `get(i)` is constant time, adding at the end is amortised constant time, and inserting or removing in the middle needs to shift elements. `LinkedList` stores each element in a node linked to its neighbours, so reaching the i-th element means walking the chain, while adding or removing at a node you already have is cheap. In most programs `ArrayList` is the better default, because the array is compact and fast to read.",
    detail: [
      "`LinkedList` also implements `Deque`, but `ArrayDeque` is usually faster for queue or stack use.",
      "Each `LinkedList` node costs extra memory for its two links.",
      "Measure before choosing for performance. For small lists the difference is negligible.",
    ],
    ex: "A list of search results that is read by index many times uses `ArrayList`.",
    mistakes: [
      'Choosing `LinkedList` because "insertion is O(1)" and then calling `add(index, x)` which still has to walk to the index.',
      "Calling `get(i)` in a loop on a `LinkedList`, which makes the loop quadratic.",
    ],
    follow: ["What happens when an ArrayList becomes full?"],
    points: [
      "ArrayList: array, fast index access",
      "LinkedList: nodes, slow index access",
      "ArrayList is the usual default",
    ],
    notes: "Default to `ArrayList`. `LinkedList` is rarely the right choice.",
    src: [
      [
        "The Java Tutorials: List Implementations",
        `${C}/implementations/list.html`,
      ],
      ["Java SE API: ArrayList", `${API}/ArrayList.html`],
    ],
  }),
  g({
    slug: "arraylist-growth",
    topic: "List",
    d: "medium",
    title: "How does an `ArrayList` grow? What is its capacity?",
    kw: ["ArrayList", "capacity", "ensureCapacity", "resize", "amortised"],
    intent: "Checks that you know what happens inside a dynamic array.",
    short:
      "An `ArrayList` keeps its elements in an internal array. The capacity is the size of that array, and the size is the number of elements in use. When you add an element and the array is full, the list allocates a larger array, about one and a half times bigger, and copies the elements into it. Because the capacity grows by a proportion, adding many elements is amortised constant time per add. If you know the expected size, giving it to the constructor or calling `ensureCapacity` avoids repeated copying.",
    detail: [
      "The exact growth factor is an implementation detail, so do not rely on it.",
      "`trimToSize` shrinks the array to the current size.",
      "Removing elements does not shrink the capacity.",
    ],
    ex: "Loading 100,000 records into `new ArrayList<>(100_000)` avoids many internal resizes.",
    mistakes: [
      "Confusing `size()` with the capacity.",
      "Assuming that `add` is always constant time, when it sometimes copies the whole array.",
    ],
    follow: ["What is amortised constant time?"],
    points: [
      "Backed by an array",
      "Grows by a proportion and copies",
      "Presize when the size is known",
    ],
    notes:
      "Capacity ≠ size. A full ArrayList allocates a bigger array and copies.",
    src: [
      ["Java SE API: ArrayList", `${API}/ArrayList.html`],
      [
        "The Java Tutorials: List Implementations",
        `${C}/implementations/list.html`,
      ],
    ],
  }),
  g({
    slug: "immutable-and-fixed-size-lists",
    topic: "List",
    d: "medium",
    title: "What is the difference between `Arrays.asList` and `List.of`?",
    kw: [
      "Arrays.asList",
      "List.of",
      "immutable",
      "fixed-size",
      "UnsupportedOperationException",
    ],
    intent:
      "Checks that you know two ways to create a list quickly and their limits.",
    short:
      "`Arrays.asList(...)` returns a fixed-size list backed by the array: you can change elements with `set`, and changes show in the array, but `add` and `remove` throw `UnsupportedOperationException`. `List.of(...)`, added in Java 9, returns an immutable list: nothing can be added, removed or replaced, and it does not allow `null` elements. For a list that you can modify, wrap either one in `new ArrayList<>(...)`.",
    detail: [
      "`List.copyOf(list)` makes an immutable copy of an existing collection.",
      "`Set.of` and `Map.of` follow the same idea and reject duplicates at creation.",
      "Immutable collections are safe to share between threads without locking.",
    ],
    ex: 'Constants such as the allowed roles use `List.of("user", "admin")`, and the code that must edit its own list copies it into an `ArrayList`.',
    code: [
      "Three kinds of list",
      'List<String> fixed = Arrays.asList("a", "b");\nfixed.set(0, "x");          // allowed\n// fixed.add("c");         // UnsupportedOperationException\n\nList<String> frozen = List.of("a", "b");\n// frozen.set(0, "x");      // UnsupportedOperationException\n\nList<String> editable = new ArrayList<>(frozen);\neditable.add("c");',
      [
        "`Arrays.asList` allows `set`, but not a change of size.",
        "`List.of` allows no change at all.",
        "`new ArrayList<>(...)` creates a normal, modifiable copy.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `add` on the result of `Arrays.asList` and getting an exception.",
      "Passing `null` to `List.of`.",
    ],
    follow: ["How do you make an unmodifiable view of an existing list?"],
    points: [
      "asList: fixed size, writes through",
      "List.of: immutable, no nulls",
      "Copy into ArrayList to modify",
    ],
    notes:
      "`asList` = fixed size. `List.of` = immutable. `new ArrayList<>(...)` = editable.",
    src: [
      ["Java SE API: Arrays.asList", `${API}/Arrays.html#asList(T...)`],
      ["Java SE API: List.of", `${API}/List.html`],
    ],
  }),
  g({
    slug: "fail-fast-iterators",
    topic: "List",
    d: "medium",
    title:
      "Why do you get `ConcurrentModificationException`, and how do you remove items while looping?",
    kw: [
      "ConcurrentModificationException",
      "fail-fast",
      "Iterator.remove",
      "removeIf",
      "modCount",
    ],
    intent: "Checks that you can remove from a collection safely.",
    short:
      "Most collections have fail-fast iterators. If the collection is structurally changed, by adding or removing items, while you iterate over it, in any way other than through the iterator itself, the next call to the iterator throws `ConcurrentModificationException`. This happens in a single thread too, for example when you call `list.remove(x)` inside a for-each loop. To remove safely, use `iterator.remove()`, or `removeIf(predicate)`, or collect the items to remove and remove them after the loop.",
    detail: [
      "The exception is best-effort, so you should not depend on it for correctness.",
      "In a multi-threaded program, use a concurrent collection or proper synchronisation.",
      "`removeIf` is the shortest and clearest option for most cases.",
    ],
    ex: "To delete every cancelled order from a list, you call `orders.removeIf(Order::isCancelled)`.",
    code: [
      "Safe removal",
      "List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4));\n\n// nums.forEach(n -> { if (n % 2 == 0) nums.remove(n); }); // exception\n\nnums.removeIf(n -> n % 2 == 0);\nSystem.out.println(nums);",
      [
        "Removing inside a for-each loop would throw the exception.",
        "`removeIf` removes the matching items safely.",
        "The output is `[1, 3]`.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `list.remove(item)` inside a for-each loop.",
      "Catching the exception instead of fixing the code.",
    ],
    follow: ["How does a for-each loop use an Iterator?"],
    points: [
      "Structural change during iteration throws",
      "Use iterator.remove or removeIf",
      "Not a thread-safety mechanism",
    ],
    notes:
      "Use `removeIf` or `iterator.remove()`, never `list.remove()` inside a for-each.",
    src: [
      ["The Java Tutorials: Iterator", `${C}/interfaces/collection.html`],
      [
        "Java SE API: ConcurrentModificationException",
        `${API}/ConcurrentModificationException.html`,
      ],
    ],
  }),
  g({
    slug: "comparable-vs-comparator",
    topic: "List",
    d: "medium",
    title: "What is the difference between `Comparable` and `Comparator`?",
    kw: ["Comparable", "Comparator", "compareTo", "sort", "natural order"],
    intent: "Checks that you can sort objects in more than one way.",
    short:
      "`Comparable` is implemented by the class itself and defines its natural order through `compareTo(other)`, so there is only one. `Comparator` is a separate object that defines an ordering through `compare(a, b)`, so you can have many, such as by name, by price or by date, without changing the class. `Collections.sort(list)` uses the natural order, and `list.sort(comparator)` uses the order you give. Both return a negative number, zero or a positive number.",
    detail: [
      "`Comparator.comparing(Person::name).thenComparing(Person::age)` builds an ordering from getters.",
      "`reversed()` reverses an order.",
      "The ordering should be consistent with `equals` when objects are used in sorted sets or maps.",
    ],
    ex: "Products have a natural order by id, and the shop page sorts them by price with a comparator.",
    code: [
      "Natural order and a comparator",
      'record Product(int id, String name, double price) implements Comparable<Product> {\n  public int compareTo(Product o) { return Integer.compare(id, o.id); }\n}\n\nList<Product> products = new ArrayList<>(List.of(\n  new Product(2, "Pen", 10), new Product(1, "Book", 120)));\n\nCollections.sort(products);\nproducts.sort(Comparator.comparingDouble(Product::price).reversed());',
      [
        "`compareTo` defines the natural order by id.",
        "`Collections.sort` uses that order.",
        "The comparator sorts by price, highest first, without changing the class.",
      ],
      "java",
    ],
    mistakes: [
      "Subtracting integers in `compare`, which can overflow. Use `Integer.compare`.",
      "Sorting a list of a class that is not `Comparable` without giving a comparator.",
    ],
    follow: ["How do you sort by two fields?"],
    points: [
      "Comparable: one natural order, in the class",
      "Comparator: any order, outside the class",
      "Use Integer.compare, not subtraction",
    ],
    notes:
      "`Comparable.compareTo` = natural order. `Comparator.compare` = custom orders.",
    src: [
      ["The Java Tutorials: Object Ordering", `${C}/interfaces/order.html`],
      ["Java SE API: Comparator", `${API}/Comparator.html`],
    ],
  }),
  g({
    slug: "hashset-treeset-linkedhashset",
    topic: "Set",
    d: "easy",
    title:
      "What are the differences between `HashSet`, `LinkedHashSet` and `TreeSet`?",
    kw: ["HashSet", "LinkedHashSet", "TreeSet", "ordering", "Set"],
    intent: "Checks that you can pick a set from the ordering you need.",
    short:
      "A `Set` holds no duplicates. `HashSet` is backed by a hash table, gives constant-time add, remove and contains on average, and has no guaranteed order. `LinkedHashSet` is the same with a linked list through the elements, so it iterates in insertion order. `TreeSet` keeps the elements sorted, by natural order or by a comparator, with logarithmic time for operations, and it offers methods such as `first`, `last` and `subSet`.",
    detail: [
      "`HashSet` allows one `null`, while `TreeSet` does not with natural ordering.",
      "`TreeSet` decides equality with `compareTo`, not `equals`.",
      "`EnumSet` is a very efficient set for enum values.",
    ],
    ex: "Unique tags in the order users added them go into a `LinkedHashSet`, and a sorted list of unique cities into a `TreeSet`.",
    mistakes: [
      "Relying on the iteration order of a `HashSet`.",
      "Putting objects without `equals` and `hashCode` into a `HashSet`.",
    ],
    follow: ["How does a HashSet find duplicates?"],
    points: [
      "HashSet: fast, unordered",
      "LinkedHashSet: insertion order",
      "TreeSet: sorted, logarithmic",
    ],
    notes: "HashSet unordered, LinkedHashSet insertion order, TreeSet sorted.",
    src: [
      [
        "The Java Tutorials: Set Implementations",
        `${C}/implementations/set.html`,
      ],
      ["The Java Tutorials: The Set Interface", `${C}/interfaces/set.html`],
    ],
  }),
  g({
    slug: "how-hashset-detects-duplicates",
    topic: "Set",
    d: "medium",
    title: "How does a `HashSet` decide that an element is a duplicate?",
    kw: ["HashSet", "duplicates", "equals", "hashCode", "HashMap"],
    intent: "Checks that you connect sets to the equals and hashCode contract.",
    short:
      "A `HashSet` is built on a `HashMap`, where the elements are the keys. When you call `add(x)`, it computes `x.hashCode()` to choose a bucket, and then uses `equals` to compare `x` with the elements already in that bucket. If an equal element exists, `add` returns `false` and the set is unchanged. So duplicates are detected correctly only when the element class overrides `hashCode` and `equals` consistently.",
    detail: [
      "`String` and the wrapper classes already do this correctly.",
      "For your own class without these methods, two equal-looking objects are different elements.",
      "Changing a field used in `hashCode` after adding the object can make the set lose it.",
    ],
    ex: "Two `Point(1, 2)` objects are one element in a `HashSet` only if `Point` overrides `equals` and `hashCode`.",
    mistakes: [
      "Adding objects of a class that has no `equals` and `hashCode` and expecting no duplicates.",
      "Mutating an element that is already in a hash-based set.",
    ],
    follow: ["What is the equals and hashCode contract?"],
    points: [
      "hashCode picks the bucket",
      "equals confirms equality",
      "Mutable keys are dangerous",
    ],
    notes: "HashSet → HashMap keys → `hashCode` then `equals`.",
    src: [
      ["Java SE API: HashSet", `${API}/HashSet.html`],
      [
        "Java SE API: Object (equals and hashCode)",
        "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html",
      ],
    ],
  }),
  g({
    slug: "set-operations",
    topic: "Set",
    d: "easy",
    title: "How do you do union, intersection and difference with sets?",
    kw: ["addAll", "retainAll", "removeAll", "containsAll", "set operations"],
    intent:
      "Checks that you can use the bulk methods of the Collection interface.",
    short:
      "The bulk methods give the set operations. `a.addAll(b)` makes `a` the union, `a.retainAll(b)` keeps only the elements that are also in `b`, which is the intersection, and `a.removeAll(b)` removes the elements that are in `b`, which is the difference. `a.containsAll(b)` checks whether `b` is a subset of `a`. These change the set they are called on, so copy it first if you still need the original.",
    detail: [
      "The methods return a boolean that says whether the set changed.",
      "They use `equals` and `hashCode`, so the element class must implement them well.",
      "Calling `removeAll` with a `List` as the argument can be slow on large data, so pass a `Set`.",
    ],
    ex: "To find the skills that a candidate has and a job needs, you copy the job's set and call `retainAll` with the candidate's set.",
    code: [
      "Set operations on copies",
      "Set<Integer> a = new HashSet<>(List.of(1, 2, 3));\nSet<Integer> b = new HashSet<>(List.of(3, 4));\n\nSet<Integer> union = new HashSet<>(a);\nunion.addAll(b);\n\nSet<Integer> common = new HashSet<>(a);\ncommon.retainAll(b);\n\nSet<Integer> onlyA = new HashSet<>(a);\nonlyA.removeAll(b);",
      [
        "Each operation works on a copy, so `a` and `b` stay unchanged.",
        "The union is `[1, 2, 3, 4]`, the intersection `[3]`, and the difference `[1, 2]`.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `retainAll` on the original set and losing its data.",
      "Using a list for the argument and making the operation slow.",
    ],
    follow: ["What does retainAll return?"],
    points: [
      "addAll = union",
      "retainAll = intersection",
      "removeAll = difference",
    ],
    notes:
      "`addAll`, `retainAll`, `removeAll`: copy first, they modify the set.",
    src: [
      [
        "The Java Tutorials: Set Interface Bulk Operations",
        `${C}/interfaces/set.html`,
      ],
      [
        "The Java Tutorials: Collection Bulk Operations",
        `${C}/interfaces/collection.html`,
      ],
    ],
  }),
  g({
    slug: "hashmap-basics",
    topic: "Map",
    d: "easy",
    title: "What is a `HashMap`, and how do you use it?",
    kw: ["HashMap", "put", "get", "key-value", "null key"],
    intent: "Checks the everyday use of the most common collection.",
    short:
      "A `HashMap` stores key-value pairs and finds a value by its key in constant time on average. Keys are unique: putting a value for an existing key replaces the old value. `put(key, value)` adds or replaces, `get(key)` returns the value or `null`, `containsKey`, `remove` and `size` work as expected. It allows one `null` key and many `null` values, it is not thread-safe, and it does not guarantee any iteration order.",
    detail: [
      "`getOrDefault(key, fallback)` avoids a `null` result.",
      "Keys should be immutable, or at least their `hashCode` and `equals` must not change.",
      "For a sorted map use `TreeMap`, and for insertion order use `LinkedHashMap`.",
    ],
    ex: "A word counter uses a `HashMap<String, Integer>` from word to count.",
    code: [
      "Counting words",
      'Map<String, Integer> counts = new HashMap<>();\nfor (String w : "to be or not to be".split(" ")) {\n  counts.put(w, counts.getOrDefault(w, 0) + 1);\n}\nSystem.out.println(counts.get("to"));',
      [
        "`getOrDefault` returns `0` for a word not yet seen.",
        "`put` stores the new count, replacing the old one.",
        "The word `to` appears twice, so the output is `2`.",
      ],
      "java",
    ],
    mistakes: [
      "Calling a method on the result of `get` without checking for `null`.",
      "Using a mutable object as a key and changing it later.",
    ],
    follow: ["How do you loop over a map?"],
    points: [
      "Unique keys, constant-time lookup",
      "get returns null for a missing key",
      "No guaranteed order",
    ],
    notes:
      "`put`, `get`, `getOrDefault`, `containsKey`; one null key allowed; no order.",
    src: [
      ["The Java Tutorials: The Map Interface", `${C}/interfaces/map.html`],
      ["Java SE API: HashMap", `${API}/HashMap.html`],
    ],
  }),
  g({
    slug: "map-implementations-compared",
    topic: "Map",
    d: "medium",
    title:
      "What are the differences between `HashMap`, `LinkedHashMap`, `TreeMap` and `Hashtable`?",
    kw: [
      "HashMap",
      "LinkedHashMap",
      "TreeMap",
      "Hashtable",
      "ConcurrentHashMap",
    ],
    intent: "Checks that you can pick a map implementation.",
    short:
      "`HashMap` is the general-purpose map with constant-time operations and no order. `LinkedHashMap` is a `HashMap` that also remembers insertion order, or access order if you ask for it, which makes it suitable for caches. `TreeMap` keeps its keys sorted in a red-black tree, with logarithmic time operations, and gives range methods. `Hashtable` is an old synchronised class that allows no nulls, and it is rarely used today. For concurrent use, `ConcurrentHashMap` is the usual choice.",
    detail: [
      "`TreeMap` does not allow a `null` key with natural ordering.",
      "A `LinkedHashMap` in access order can build a simple LRU cache by overriding `removeEldestEntry`.",
      "`EnumMap` is a compact map for enum keys.",
    ],
    ex: "A menu shown in the order the items were added uses a `LinkedHashMap`, while a sorted report by date uses a `TreeMap`.",
    mistakes: [
      "Using `Hashtable` in new code.",
      "Expecting a `HashMap` to return keys in the order they were inserted.",
    ],
    follow: ["How would you build an LRU cache with LinkedHashMap?"],
    points: [
      "HashMap: fast, no order",
      "LinkedHashMap: insertion order",
      "TreeMap: sorted keys",
      "ConcurrentHashMap for threads",
    ],
    notes:
      "HashMap fast; LinkedHashMap ordered; TreeMap sorted; ConcurrentHashMap for threads.",
    src: [
      [
        "The Java Tutorials: Map Implementations",
        `${C}/implementations/map.html`,
      ],
      ["Java SE API: TreeMap", `${API}/TreeMap.html`],
    ],
  }),
  g({
    slug: "iterating-a-map",
    topic: "Map",
    d: "easy",
    title: "What are the ways to iterate over a `Map`?",
    kw: ["entrySet", "keySet", "values", "forEach", "Map.Entry"],
    intent:
      "Checks that you pick the efficient way to read keys and values together.",
    short:
      "Use `entrySet()` when you need both the key and the value, because each `Map.Entry` gives both without a second lookup. Use `keySet()` when you need only keys and `values()` for only values. `map.forEach((k, v) -> ...)` is a short form with a lambda. Looping over `keySet()` and calling `get(key)` for every key works but does an extra lookup each time.",
    detail: [
      "These views are backed by the map, and removing from them removes from the map.",
      "`TreeMap` and `LinkedHashMap` iterate in their defined order. `HashMap` does not.",
      "Do not change the map structurally while iterating, except through the iterator.",
    ],
    ex: "To print each product with its stock, you loop over `stock.entrySet()`.",
    code: [
      "Two ways to loop",
      'Map<String, Integer> stock = new LinkedHashMap<>();\nstock.put("pen", 10);\nstock.put("book", 4);\n\nfor (Map.Entry<String, Integer> e : stock.entrySet()) {\n  System.out.println(e.getKey() + " = " + e.getValue());\n}\n\nstock.forEach((name, qty) -> System.out.println(name + ":" + qty));',
      [
        "`entrySet` gives key and value together.",
        "`forEach` with a lambda does the same in one line.",
        "A `LinkedHashMap` prints in insertion order.",
      ],
      "java",
    ],
    mistakes: [
      "Looping over `keySet()` and calling `get` for every key.",
      "Adding or removing entries inside the loop.",
    ],
    follow: ["Are keySet and values copies?"],
    points: [
      "entrySet for key and value",
      "keySet, values for one side",
      "Views are backed by the map",
    ],
    notes: "Loop over `entrySet()` for key + value, or use `map.forEach`.",
    src: [
      [
        "The Java Tutorials: Collection Views (Map)",
        `${C}/interfaces/map.html`,
      ],
      ["Java SE API: Map", `${API}/Map.html`],
    ],
  }),
  g({
    slug: "map-compute-and-merge",
    topic: "Map",
    d: "medium",
    title: "What do `computeIfAbsent`, `merge` and `getOrDefault` do?",
    kw: ["computeIfAbsent", "merge", "getOrDefault", "putIfAbsent", "grouping"],
    intent: "Checks that you write short, correct code for common map updates.",
    short:
      "`getOrDefault(key, d)` returns the value or a default without storing it. `putIfAbsent(key, v)` stores a value only when the key has none. `computeIfAbsent(key, fn)` creates a missing value with a function and stores it, which is the standard way to build a map of lists. `merge(key, value, fn)` inserts the value if the key is absent, and otherwise combines the old and new values with the function, which is ideal for counting. These replace the manual check, get and put steps.",
    detail: [
      "The function in `computeIfAbsent` runs only when the key is missing.",
      "`merge` with `Integer::sum` is a one-line counter.",
      "On a `ConcurrentHashMap`, these methods are atomic.",
    ],
    ex: "Grouping orders by customer uses `computeIfAbsent`, and counting words uses `merge`.",
    code: [
      "Group and count",
      'Map<String, List<String>> byCity = new HashMap<>();\nbyCity.computeIfAbsent("Pune", k -> new ArrayList<>()).add("Asha");\nbyCity.computeIfAbsent("Pune", k -> new ArrayList<>()).add("Ravi");\n\nMap<String, Integer> counts = new HashMap<>();\ncounts.merge("java", 1, Integer::sum);\ncounts.merge("java", 1, Integer::sum);',
      [
        "The list for `Pune` is created once and reused.",
        "`byCity` ends as `{Pune=[Asha, Ravi]}`.",
        "`merge` adds 1 to the existing count, so `java` is `2`.",
      ],
      "java",
    ],
    mistakes: [
      "Writing `if (!map.containsKey(k)) map.put(k, new ArrayList<>())` where `computeIfAbsent` is shorter and safer.",
      "Doing heavy work inside the function of `computeIfAbsent`.",
    ],
    follow: ["How would you count word frequencies in one line?"],
    points: [
      "computeIfAbsent creates missing values",
      "merge combines old and new",
      "getOrDefault does not store",
    ],
    notes:
      "`computeIfAbsent(k, k -> new ArrayList<>())` to group. `merge(k, 1, Integer::sum)` to count.",
    src: [
      ["Java SE API: Map", `${API}/Map.html`],
      [
        "The Java Tutorials: Map Interface (bulk and compute)",
        `${C}/interfaces/map.html`,
      ],
    ],
  }),
  g({
    slug: "how-hashmap-works",
    topic: "HashMap internals",
    d: "hard",
    title: "How does a `HashMap` work internally?",
    kw: ["HashMap", "bucket", "hashCode", "equals", "table"],
    intent:
      "Checks one of the most common interview questions about Java internals.",
    short:
      "A `HashMap` keeps an array of buckets. When you call `put(key, value)`, it calls `key.hashCode()`, mixes the bits of the result, and uses it to choose a bucket index in the array. If the bucket is empty, the entry is stored there. If it already holds entries, the map compares keys with `equals`: an equal key has its value replaced, and a different key is added to the same bucket. `get` follows the same steps, so it finds the bucket quickly and then compares the few keys inside it.",
    detail: [
      "The array length is always a power of two, so the index can be computed with a bit mask.",
      "Good hash codes spread the keys evenly, which keeps the buckets short.",
      "A bucket first holds a linked list of entries, and it may be converted to a tree when it gets long.",
    ],
    ex: 'Putting `"apple"` and `"Apple"` computes two hash codes, and the entries end up in the same or in different buckets, but they stay separate keys.',
    mistakes: [
      "Saying that the map compares only hash codes. The `equals` call is what decides that two keys are the same.",
      "Using keys with a poor `hashCode`, which puts everything in one bucket.",
    ],
    follow: ["What happens when two keys have the same hash code?"],
    points: [
      "Array of buckets",
      "hashCode picks the bucket, equals confirms the key",
      "Power-of-two table size",
    ],
    notes:
      "put: hashCode → bucket → equals on the keys there → store or replace.",
    src: [
      ["Java SE API: HashMap", `${API}/HashMap.html`],
      [
        "The Java Tutorials: Map Implementations",
        `${C}/implementations/map.html`,
      ],
    ],
  }),
  g({
    slug: "hash-collisions-and-treeification",
    topic: "HashMap internals",
    d: "hard",
    title: "What is a hash collision, and how does `HashMap` handle it?",
    kw: [
      "hash collision",
      "bucket",
      "linked list",
      "red-black tree",
      "treeify",
    ],
    intent: "Checks that you understand how the worst case is controlled.",
    short:
      "A collision happens when two different keys map to the same bucket. `HashMap` handles it by chaining: the entries in one bucket form a linked list, and a lookup walks it comparing keys with `equals`. Since Java 8, if a bucket becomes long, `HashMap` converts it into a balanced tree, so the worst-case lookup in that bucket becomes logarithmic instead of linear. When the bucket shrinks again, it turns back into a list. A good `hashCode` keeps collisions rare.",
    detail: [
      "Treeification needs the keys to be comparable to order the tree well, and otherwise it falls back on a less efficient tie-breaking rule.",
      "Many collisions make a map slow, and can be abused deliberately against a service that hashes user input.",
      "Resizing the table also redistributes entries and reduces collisions.",
    ],
    ex: "A key class whose `hashCode` always returns `1` puts every entry in one bucket, and the map behaves like a list or a tree.",
    mistakes: [
      "Thinking that a collision overwrites the older entry. It is added to the bucket.",
      "Writing a `hashCode` that returns a constant.",
    ],
    follow: ["Why is a good hashCode important?"],
    points: [
      "Collision: same bucket, different keys",
      "Chaining with a list",
      "Long buckets become trees since Java 8",
    ],
    notes:
      "Collisions are chained in the bucket; long buckets become balanced trees (Java 8+).",
    src: [
      ["Java SE API: HashMap", `${API}/HashMap.html`],
      [
        "Java SE API: Object (hashCode)",
        "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html",
      ],
    ],
  }),
  g({
    slug: "load-factor-and-resizing",
    topic: "HashMap internals",
    d: "hard",
    title:
      "What are the initial capacity and load factor of a `HashMap`, and when does it resize?",
    kw: ["load factor", "initial capacity", "resize", "rehash", "0.75"],
    intent:
      "Checks that you know how a HashMap keeps its operations fast as it grows.",
    short:
      "The capacity is the number of buckets, and the load factor is how full the map may get before it grows. The default load factor is 0.75, and the default initial capacity is 16. When the number of entries exceeds capacity times load factor, the map doubles the number of buckets and redistributes the entries, which is called rehashing. This keeps the buckets short, but a resize costs time proportional to the size of the map.",
    detail: [
      "If you know that you will store about N entries, create the map with a capacity of roughly `N / 0.75 + 1` to avoid resizes.",
      "A higher load factor saves memory and makes lookups slower, and a lower one does the opposite.",
      "Resizing is why adding to a `HashMap` is amortised constant time, not strictly constant.",
    ],
    ex: "A map that will hold 1,000,000 known entries is created with a large initial capacity, so it never has to resize while loading.",
    mistakes: [
      "Creating a huge map by repeated `put` without presizing and paying for many resizes.",
      "Setting a load factor above 1 without understanding the trade-off.",
    ],
    follow: ["How do you presize a HashMap?"],
    points: [
      "Default capacity 16, load factor 0.75",
      "Resize doubles the table",
      "Presize when the count is known",
    ],
    notes:
      "Resize at capacity × 0.75: the table doubles and entries are rehashed.",
    src: [
      ["Java SE API: HashMap", `${API}/HashMap.html`],
      [
        "The Java Tutorials: Map Implementations",
        `${C}/implementations/map.html`,
      ],
    ],
  }),
  g({
    slug: "mutable-keys-in-hashmap",
    topic: "HashMap internals",
    d: "medium",
    title:
      "What happens if you change a key object after putting it in a `HashMap`?",
    kw: ["mutable key", "hashCode", "HashMap", "lost entry", "immutable key"],
    intent: "Checks that you know why keys should be immutable.",
    short:
      "If the fields used by `hashCode` or `equals` change after the key is stored, its hash code changes, but the entry stays in the bucket chosen by the old hash code. A later `get` with the same object looks in the new bucket, and does not find the entry, so the value seems to be lost, though it still uses memory. For this reason keys should be immutable, such as `String`, `Integer` or records, or at least their hash-relevant fields must never change.",
    detail: [
      "The same applies to elements of a `HashSet`.",
      "A `List` used as a key is dangerous if the list changes later.",
      "If a key must change, remove it, change it and add it again.",
    ],
    ex: "A `User` key whose `email` is part of `hashCode` is stored, the email is edited, and `map.get(user)` returns `null`.",
    code: [
      "A lost entry",
      'class Key {\n  String id;\n  Key(String id) { this.id = id; }\n  @Override public boolean equals(Object o) { return o instanceof Key k && id.equals(k.id); }\n  @Override public int hashCode() { return id.hashCode(); }\n}\n\nMap<Key, String> m = new HashMap<>();\nKey k = new Key("a");\nm.put(k, "value");\nk.id = "b";\nSystem.out.println(m.get(k));',
      [
        "The entry was stored using the hash code of `a`.",
        "After the change, the hash code is that of `b`, so the lookup goes to another bucket.",
        "The output is `null`, though the entry is still in the map.",
      ],
      "java",
    ],
    mistakes: [
      "Using a mutable object as a key and changing it.",
      "Using an array as a key, because arrays use identity for `equals` and `hashCode`.",
    ],
    follow: ["Which types make good map keys?"],
    points: [
      "Hash changes, entry stays in the old bucket",
      "get cannot find it",
      "Use immutable keys",
    ],
    notes: "Never mutate fields used in `hashCode` while the object is a key.",
    src: [
      ["Java SE API: Map (key mutability)", `${API}/Map.html`],
      ["Java SE API: HashMap", `${API}/HashMap.html`],
    ],
  }),
  g({
    slug: "queue-and-deque",
    topic: "Queue & Deque",
    d: "easy",
    title: "What are `Queue` and `Deque`? Which implementations do you use?",
    kw: ["Queue", "Deque", "ArrayDeque", "LinkedList", "FIFO"],
    intent:
      "Checks that you know the collections for first-in, first-out and double-ended use.",
    short:
      "A `Queue` holds elements for processing, usually first in, first out: you add at the tail with `offer` and take from the head with `poll`. A `Deque` is a double-ended queue that adds and removes at both ends, so it can work as a queue or as a stack. The usual implementation for both is `ArrayDeque`, which is faster than `LinkedList` and uses less memory. `PriorityQueue` is a queue ordered by priority instead of arrival.",
    detail: [
      "`ArrayDeque` does not allow `null` elements.",
      "`LinkedList` also implements `Deque` and allows `null`, but is slower.",
      "For threads, use a `BlockingQueue` such as `LinkedBlockingQueue`.",
    ],
    ex: "A print-job list that handles jobs in arrival order uses an `ArrayDeque` as a queue.",
    mistakes: [
      "Using the legacy `Stack` class instead of `ArrayDeque`.",
      "Putting `null` into an `ArrayDeque`.",
    ],
    follow: ["How do you use a Deque as a stack?"],
    points: ["Queue: FIFO", "Deque: both ends", "ArrayDeque is the default"],
    notes:
      "`ArrayDeque` for queue and stack; `PriorityQueue` for priority order.",
    src: [
      ["The Java Tutorials: The Queue Interface", `${C}/interfaces/queue.html`],
      ["The Java Tutorials: The Deque Interface", `${C}/interfaces/deque.html`],
    ],
  }),
  g({
    slug: "queue-methods-offer-poll-peek",
    topic: "Queue & Deque",
    d: "easy",
    title:
      "What is the difference between `add`/`remove` and `offer`/`poll` in a `Queue`?",
    kw: ["offer", "poll", "peek", "add", "element"],
    intent: "Checks that you know the two families of queue methods.",
    short:
      "Each queue operation exists in two forms. The first form throws an exception on failure: `add` throws if the queue is full, `remove` and `element` throw `NoSuchElementException` if the queue is empty. The second form returns a special value: `offer` returns `false` if it cannot add, and `poll` and `peek` return `null` if the queue is empty. `peek` and `element` only look at the head, and `poll` and `remove` take it out. Use the second form when an empty or full queue is a normal situation.",
    detail: [
      "A bounded queue, such as an `ArrayBlockingQueue`, can be full, which is when `offer` returns `false`.",
      "Do not put `null` into a queue that uses `null` as the empty signal.",
      "The blocking queues add `put` and `take`, which wait.",
    ],
    ex: "A worker loops `while ((job = queue.poll()) != null)` so that it stops when the queue is empty.",
    code: [
      "Two styles on an empty queue",
      'Queue<String> q = new ArrayDeque<>();\nSystem.out.println(q.poll());   // null\nSystem.out.println(q.peek());   // null\n// q.remove();                 // NoSuchElementException\nq.offer("first");\nSystem.out.println(q.poll());   // first',
      [
        "`poll` and `peek` return `null` on an empty queue.",
        "`remove` would throw an exception instead.",
        "`offer` adds, and `poll` returns the head.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `remove` on a queue that may be empty without handling the exception.",
      "Mixing up `peek` (look) and `poll` (take).",
    ],
    follow: ["Which methods block in a BlockingQueue?"],
    points: [
      "add/remove/element throw",
      "offer/poll/peek return a special value",
      "peek looks, poll removes",
    ],
    notes:
      "Exceptions: add, remove, element. Special values: offer, poll, peek.",
    src: [
      ["The Java Tutorials: The Queue Interface", `${C}/interfaces/queue.html`],
      ["Java SE API: Queue", `${API}/Queue.html`],
    ],
  }),
  g({
    slug: "priority-queue",
    topic: "Queue & Deque",
    d: "medium",
    title:
      "How does `PriorityQueue` work, and in what order does it return elements?",
    kw: ["PriorityQueue", "heap", "comparator", "natural ordering", "poll"],
    intent:
      "Checks that you know it is ordered by priority and not by insertion.",
    short:
      "A `PriorityQueue` is a queue backed by a binary heap. `poll` and `peek` always give the smallest element according to the natural order, or according to the comparator you pass in the constructor, not the first one added. `offer` and `poll` take logarithmic time and `peek` takes constant time. The iteration order is not sorted, because only the head is guaranteed to be the smallest. It is not thread-safe, and it does not allow `null`.",
    detail: [
      "For a max-heap, pass `Comparator.reverseOrder()`.",
      "To get all the elements in order, call `poll` repeatedly, not iterate.",
      'It is the usual tool for "top K" problems and for scheduling by priority.',
    ],
    ex: "A task list returns the most urgent task first by comparing a priority number.",
    code: [
      "Smallest first",
      "PriorityQueue<Integer> pq = new PriorityQueue<>();\npq.offer(5);\npq.offer(1);\npq.offer(3);\nSystem.out.println(pq.poll());\nSystem.out.println(pq.poll());\n\nPriorityQueue<Integer> max = new PriorityQueue<>(Comparator.reverseOrder());",
      [
        "The elements are added in the order 5, 1, 3.",
        "`poll` returns the smallest each time, so `1` and then `3`.",
        "A reverse comparator makes a max-heap.",
      ],
      "java",
    ],
    mistakes: [
      "Printing a `PriorityQueue` and expecting a sorted list.",
      "Changing an element after it was added, which does not reorder the heap.",
    ],
    follow: ["How would you find the 3 largest numbers in a stream?"],
    points: ["Binary heap", "Head is the smallest", "Iteration is not sorted"],
    notes:
      "`PriorityQueue.poll()` = smallest by natural order or comparator. Iteration is not sorted.",
    src: [
      ["Java SE API: PriorityQueue", `${API}/PriorityQueue.html`],
      [
        "The Java Tutorials: Queue Implementations",
        `${C}/implementations/queue.html`,
      ],
    ],
  }),
  g({
    slug: "stack-with-deque",
    topic: "Queue & Deque",
    d: "easy",
    title: "How do you use a stack in Java? Why not the `Stack` class?",
    kw: ["Stack", "ArrayDeque", "push", "pop", "LIFO"],
    intent: "Checks that you know the modern replacement for a legacy class.",
    short:
      "A stack is last in, first out. The old `Stack` class extends `Vector`, so every method is synchronised, which makes it slower, and it exposes list methods that break the stack idea. The Javadoc recommends a `Deque` instead. With `ArrayDeque`, you use `push` to add on top, `pop` to remove the top, and `peek` to look at it. It is faster, and it has a clear stack interface.",
    detail: [
      "`pop` on an empty `ArrayDeque` throws `NoSuchElementException`, and `peek` returns `null`.",
      "Stacks are used for undo features, expression evaluation and depth-first search.",
      "For a stack shared between threads, use a concurrent deque.",
    ],
    ex: "A checker for balanced brackets pushes every opening bracket and pops it when the matching closing one appears.",
    code: [
      "A stack with ArrayDeque",
      "Deque<Character> stack = new ArrayDeque<>();\nstack.push('(');\nstack.push('[');\nSystem.out.println(stack.pop());\nSystem.out.println(stack.peek());",
      [
        "`push` puts an item on top.",
        "`pop` removes and returns the top item, which is `[`.",
        "`peek` shows the new top, `(`, without removing it.",
      ],
      "java",
    ],
    mistakes: [
      "Using `Stack` in new code.",
      "Calling `pop` on an empty deque without checking.",
    ],
    follow: ["Why is Stack considered a legacy class?"],
    points: [
      "Use ArrayDeque for a stack",
      "push, pop, peek",
      "Stack extends Vector and is legacy",
    ],
    notes:
      "Use `Deque<T> stack = new ArrayDeque<>()` with `push`, `pop`, `peek`.",
    src: [
      ["Java SE API: Deque", `${API}/Deque.html`],
      ["Java SE API: Stack", `${API}/Stack.html`],
    ],
  }),
  g({
    slug: "concurrenthashmap-vs-synchronized-map",
    topic: "Concurrent collections",
    d: "hard",
    title:
      "How is `ConcurrentHashMap` different from `HashMap`, `Hashtable` and `Collections.synchronizedMap`?",
    kw: [
      "ConcurrentHashMap",
      "Hashtable",
      "synchronizedMap",
      "thread-safe",
      "putIfAbsent",
    ],
    intent: "Checks that you pick the right map for multi-threaded code.",
    short:
      "`HashMap` is not thread-safe, so concurrent writes can corrupt it. `Hashtable` and `Collections.synchronizedMap` make every method hold one lock on the whole map, so only one thread works at a time, and compound actions such as check-then-put still need external locking. `ConcurrentHashMap` is designed for concurrency: many threads can read and write at once without locking the whole map, and it has atomic methods such as `putIfAbsent`, `computeIfAbsent` and `merge`. It does not allow `null` keys or values, and its iterators are weakly consistent and never throw `ConcurrentModificationException`.",
    detail: [
      "Even with a concurrent map, two separate calls such as `get` then `put` are not atomic as a pair. Use `compute` or `merge` instead.",
      "Its `size` is an estimate when other threads are modifying the map.",
      "If only one thread writes, and others only read after safe publication, a plain map may be enough.",
    ],
    ex: "A shared hit counter per page uses `ConcurrentHashMap` with `merge(page, 1, Integer::sum)` from many request threads.",
    code: [
      "An atomic counter map",
      "Map<String, Integer> hits = new ConcurrentHashMap<>();\n\nvoid record(String page) {\n  hits.merge(page, 1, Integer::sum);\n}",
      [
        "`merge` is atomic, so two threads cannot lose an update.",
        "A separate `get` followed by `put` would not be safe.",
      ],
      "java",
    ],
    mistakes: [
      "Using `get` and then `put` on a concurrent map and assuming the pair is atomic.",
      "Putting a `null` value into a `ConcurrentHashMap`.",
    ],
    follow: ["Why does ConcurrentHashMap not allow null?"],
    points: [
      "HashMap is not thread-safe",
      "synchronizedMap uses one lock",
      "ConcurrentHashMap: concurrent access and atomic compound methods",
    ],
    notes:
      "Use `ConcurrentHashMap` and its atomic methods (`merge`, `compute`) for shared maps.",
    src: [
      [
        "Java SE API: ConcurrentHashMap",
        `${API}/concurrent/ConcurrentHashMap.html`,
      ],
      [
        "The Java Tutorials: Concurrent Collections",
        "https://docs.oracle.com/javase/tutorial/essential/concurrency/collections.html",
      ],
    ],
  }),
  g({
    slug: "copy-on-write-array-list",
    topic: "Concurrent collections",
    d: "medium",
    title: "What is `CopyOnWriteArrayList` and when would you use it?",
    kw: [
      "CopyOnWriteArrayList",
      "snapshot iterator",
      "read-heavy",
      "thread-safe list",
      "concurrent",
    ],
    intent:
      "Checks that you understand a trade-off of a concurrent collection.",
    short:
      "`CopyOnWriteArrayList` is a thread-safe list where every write, such as `add` or `remove`, makes a fresh copy of the underlying array. Reads and iteration need no locking, and an iterator works on a snapshot of the array from when it was created, so it never throws `ConcurrentModificationException` and does not see later changes. It suits lists that are read very often and changed rarely, such as a list of listeners, and it is a poor choice when writes are frequent, because each one copies the whole array.",
    detail: [
      "Iterators do not support `remove`.",
      "A snapshot means an iterator may show data that is already out of date.",
      "`CopyOnWriteArraySet` follows the same idea.",
    ],
    ex: "An event system keeps its listeners in a `CopyOnWriteArrayList`: they are registered rarely and notified constantly.",
    mistakes: [
      "Using it for a list that is updated thousands of times per second.",
      "Expecting an iterator to show items added after it was created.",
    ],
    follow: ["What is the cost of adding to a CopyOnWriteArrayList?"],
    points: [
      "Copies the array on every write",
      "Lock-free reads, snapshot iterators",
      "For read-heavy, write-rare data",
    ],
    notes:
      "Copy-on-write: cheap reads, expensive writes. Use for listener lists.",
    src: [
      [
        "Java SE API: CopyOnWriteArrayList",
        `${API}/concurrent/CopyOnWriteArrayList.html`,
      ],
      [
        "The Java Tutorials: Concurrent Collections",
        "https://docs.oracle.com/javase/tutorial/essential/concurrency/collections.html",
      ],
    ],
  }),
  g({
    slug: "blocking-queues",
    topic: "Concurrent collections",
    d: "hard",
    title:
      "What is a `BlockingQueue` and how is it used in a producer-consumer design?",
    kw: [
      "BlockingQueue",
      "producer consumer",
      "put",
      "take",
      "ArrayBlockingQueue",
    ],
    intent: "Checks that you can connect threads with a safe hand-off.",
    short:
      "A `BlockingQueue` is a thread-safe queue whose operations can wait. `put` blocks when a bounded queue is full, and `take` blocks when the queue is empty. This makes it a simple way to build producer-consumer designs: producer threads `put` work items, consumer threads `take` them, and the queue handles the locking and waiting. A bounded queue, such as `ArrayBlockingQueue`, also gives back-pressure, because fast producers wait for slow consumers instead of using unlimited memory.",
    detail: [
      "`offer(item, timeout, unit)` and `poll(timeout, unit)` wait only for a limited time.",
      "`LinkedBlockingQueue` is optionally bounded, and `PriorityBlockingQueue` orders by priority.",
      "A common way to stop consumers is to put a special poison-pill item in the queue.",
    ],
    ex: "A web crawler's fetcher threads put URLs in a queue of 1,000 entries, and parser threads take them out.",
    code: [
      "A producer and a consumer",
      'BlockingQueue<String> queue = new ArrayBlockingQueue<>(100);\n\nRunnable producer = () -> {\n  try { queue.put("job-1"); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }\n};\n\nRunnable consumer = () -> {\n  try { System.out.println(queue.take()); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }\n};',
      [
        "`put` waits if the 100 slots are full.",
        "`take` waits until an item is available.",
        "No explicit `synchronized` or `wait` is needed.",
      ],
      "java",
    ],
    mistakes: [
      "Using an unbounded queue and running out of memory when the consumers are slow.",
      "Swallowing `InterruptedException` without restoring the interrupt flag.",
    ],
    follow: ["How do you stop the consumers?"],
    points: [
      "put and take block",
      "Bounded queue gives back-pressure",
      "Replaces manual wait and notify",
    ],
    notes: "`BlockingQueue`: `put` waits when full, `take` waits when empty.",
    src: [
      ["Java SE API: BlockingQueue", `${API}/concurrent/BlockingQueue.html`],
      [
        "The Java Tutorials: Concurrent Collections",
        "https://docs.oracle.com/javase/tutorial/essential/concurrency/collections.html",
      ],
    ],
  }),
  g({
    slug: "synchronized-wrappers",
    topic: "Concurrent collections",
    d: "medium",
    title:
      "What does `Collections.synchronizedList` do, and what are its limits?",
    kw: [
      "Collections.synchronizedList",
      "synchronized wrapper",
      "iteration",
      "thread-safe",
      "compound action",
    ],
    intent: "Checks that you know a wrapper is not a complete solution.",
    short:
      "`Collections.synchronizedList(list)` returns a wrapper where each method is synchronised on one lock, so single calls such as `add` and `get` are thread-safe. Its limits are that a sequence of calls is not atomic, for example check-then-add, and that iterating over it is not protected. You must hold the wrapper's lock with `synchronized (list)` for the whole loop, or you can get a `ConcurrentModificationException` or inconsistent data. A concurrent collection usually fits better.",
    detail: [
      "All access, including reads, goes through the single lock, which can limit performance.",
      "The wrapper does not make the original list safe if other code still holds a reference to it.",
      "`CopyOnWriteArrayList` or a `BlockingQueue` is often a better choice.",
    ],
    ex: "Code adds items from many threads with the wrapper, and iterates inside `synchronized (list) { ... }`.",
    code: [
      "Iterating a synchronised list",
      'List<String> list = Collections.synchronizedList(new ArrayList<>());\nlist.add("a");\n\nsynchronized (list) {\n  for (String s : list) {\n    System.out.println(s);\n  }\n}',
      [
        "Single calls such as `add` are safe on their own.",
        "The loop is wrapped in `synchronized (list)`, so no other thread can change the list during it.",
      ],
      "java",
    ],
    mistakes: [
      "Iterating without holding the lock.",
      "Assuming that two consecutive calls are atomic together.",
    ],
    follow: ["When would you choose a concurrent collection instead?"],
    points: [
      "Each method is synchronised",
      "Compound actions and iteration need your own lock",
      "Concurrent collections often scale better",
    ],
    notes:
      "Wrapper = one lock per call. Lock manually for iteration and compound actions.",
    src: [
      [
        "The Java Tutorials: Wrapper Implementations",
        `${C}/implementations/wrapper.html`,
      ],
      [
        "Java SE API: Collections.synchronizedList",
        `${API}/Collections.html#synchronizedList(java.util.List)`,
      ],
    ],
  }),
  g({
    slug: "why-generics",
    topic: "Generics",
    d: "easy",
    title: "What are generics and why were they added to Java?",
    kw: [
      "generics",
      "type safety",
      "type parameter",
      "ClassCastException",
      "diamond operator",
    ],
    intent: "Checks that you know what problem generics solve.",
    short:
      "Generics let a class, interface or method work with a type that is given as a parameter, such as `List<String>`. They provide compile-time type safety: the compiler rejects an `Integer` added to a `List<String>`, and you need no cast when you read an element. Before generics, collections held `Object`, so a wrong type was found only at run time as a `ClassCastException`. The diamond operator `<>` lets the compiler infer the type arguments, as in `new ArrayList<>()`.",
    detail: [
      "Type parameters are written with single capital letters by convention: `T` for type, `E` for element, `K` and `V` for key and value.",
      "Only reference types can be type arguments, so you use `List<Integer>` and not `List<int>`.",
      "Generics are a compile-time feature, because the types are erased in the compiled code.",
    ],
    ex: "A `List<Order>` guarantees that every element is an `Order`, so `orders.get(0).total()` needs no cast.",
    code: [
      "With and without generics",
      'List raw = new ArrayList();\nraw.add("text");\nraw.add(42);\n// String s = (String) raw.get(1); // fails at run time\n\nList<String> names = new ArrayList<>();\nnames.add("Asha");\n// names.add(42);                   // does not compile\nString first = names.get(0);',
      [
        "The raw list accepts anything, and the mistake appears only when the code runs.",
        "The generic list rejects the wrong type at compile time.",
        "No cast is needed when reading from `List<String>`.",
      ],
      "java",
    ],
    mistakes: [
      "Using raw types such as `List` in new code.",
      "Trying to write `List<int>`.",
    ],
    follow: ["What is type erasure?"],
    points: [
      "Type parameters give compile-time safety",
      "No casts when reading",
      "Reference types only",
    ],
    notes: "Generics = compile-time type safety. Avoid raw types.",
    src: [
      ["The Java Tutorials: Why Use Generics?", `${GN}/why.html`],
      ["The Java Tutorials: Generic Types", `${GN}/types.html`],
    ],
  }),
  g({
    slug: "generic-methods-and-bounds",
    topic: "Generics",
    d: "medium",
    title: "How do you write a generic method and a bounded type parameter?",
    kw: [
      "generic method",
      "bounded type",
      "extends",
      "Comparable",
      "type inference",
    ],
    intent:
      "Checks that you can write a reusable method with a type constraint.",
    short:
      "A generic method declares its own type parameter before the return type, as in `static <T> T first(List<T> list)`. The compiler infers `T` from the arguments. A bounded type parameter limits what `T` can be, with `extends`: `<T extends Comparable<T>>` means that `T` must be comparable, so inside the method you can call `compareTo`. For several bounds, you write `T extends A & B`, with at most one class and it must come first.",
    detail: [
      "`extends` in a bound is used for both classes and interfaces.",
      "A bound lets you use the bound type's methods on values of type `T`.",
      "Static methods cannot use the type parameter of the class, so they declare their own.",
    ],
    ex: "A `max` method works for integers, strings or dates, because they are all `Comparable`.",
    code: [
      "A bounded generic method",
      'static <T extends Comparable<T>> T max(List<T> items) {\n  T best = items.get(0);\n  for (T item : items) {\n    if (item.compareTo(best) > 0) {\n      best = item;\n    }\n  }\n  return best;\n}\n\nSystem.out.println(max(List.of(3, 9, 4)));\nSystem.out.println(max(List.of("pen", "book")));',
      [
        "`<T extends Comparable<T>>` allows only types that can be compared.",
        "That is why `compareTo` can be called on `item`.",
        "The same method works for `Integer` and `String`, giving `9` and `pen`.",
      ],
      "java",
    ],
    mistakes: [
      "Calling `compareTo` on an unbounded `T`, which does not compile.",
      "Passing a type that is not `Comparable` to the method.",
    ],
    follow: ["How do you give a type parameter two bounds?"],
    points: [
      "Type parameter before the return type",
      "extends sets a bound",
      "The compiler infers the type",
    ],
    notes: "`static <T extends Comparable<T>> T max(List<T> list)`.",
    src: [
      ["The Java Tutorials: Generic Methods", `${GN}/methods.html`],
      ["The Java Tutorials: Bounded Type Parameters", `${GN}/bounded.html`],
    ],
  }),
  g({
    slug: "wildcards-and-pecs",
    topic: "Generics",
    d: "hard",
    title: "What are wildcards (`? extends T`, `? super T`) and the PECS rule?",
    kw: ["wildcard", "? extends", "? super", "PECS", "covariance"],
    intent:
      "Checks that you understand why `List<Integer>` is not a `List<Number>`.",
    short:
      "Generic types are invariant: a `List<Integer>` is not a `List<Number>`, even though `Integer` is a `Number`. A wildcard relaxes this. `List<? extends Number>` accepts a list of `Number` or any subtype, and you can read elements as `Number`, but you cannot add to it (except `null`). `List<? super Integer>` accepts a list of `Integer` or any supertype, and you can add `Integer` values, but what you read is only `Object`. PECS is the memory aid: Producer Extends, Consumer Super.",
    detail: [
      "`List<?>` means a list of some unknown type, and it is read-only for practical purposes.",
      "Use `extends` when the structure only gives you values, and `super` when it only takes values.",
      "`Collections.copy(dest, src)` uses both: `dest` is `List<? super T>` and `src` is `List<? extends T>`.",
    ],
    ex: "A `sum(List<? extends Number>)` method can add up a list of integers or a list of doubles.",
    code: [
      "Producer extends, consumer super",
      "static double sum(List<? extends Number> numbers) {\n  double total = 0;\n  for (Number n : numbers) total += n.doubleValue();\n  return total;\n}\n\nstatic void fill(List<? super Integer> target) {\n  target.add(1);\n  target.add(2);\n}\n\nsum(List.of(1, 2, 3));\nsum(List.of(1.5, 2.5));",
      [
        "`sum` only reads from the list, so `? extends Number` is right.",
        "`fill` only writes `Integer` values, so `? super Integer` is right.",
        "The same `sum` works for a list of `Integer` and a list of `Double`.",
      ],
      "java",
    ],
    mistakes: [
      "Trying to add an element to a `List<? extends Number>`.",
      "Assuming that `List<Integer>` can be passed where `List<Number>` is expected.",
    ],
    follow: ["Why is List<Integer> not a subtype of List<Number>?"],
    points: [
      "Generics are invariant",
      "? extends: read (producer)",
      "? super: write (consumer)",
    ],
    notes: "PECS: Producer `? extends`, Consumer `? super`.",
    src: [
      ["The Java Tutorials: Wildcards", `${GN}/wildcards.html`],
      [
        "The Java Tutorials: Wildcard Guidelines",
        `${GN}/wildcardGuidelines.html`,
      ],
    ],
  }),
  g({
    slug: "type-erasure",
    topic: "Generics",
    d: "hard",
    title: "What is type erasure, and what limits does it cause?",
    kw: ["type erasure", "generics", "reifiable", "instanceof", "new T()"],
    intent:
      "Checks that you know generics are a compile-time feature with run-time consequences.",
    short:
      "Type erasure means that the compiler checks generic types, and then removes them: in the compiled code a `List<String>` is just a `List`, and a type parameter `T` becomes its bound, or `Object`. This keeps compatibility with older code. As a consequence, at run time you cannot test `obj instanceof List<String>`, you cannot create `new T()` or `new T[10]`, you cannot use primitives as type arguments, and you cannot overload two methods that differ only in the type arguments.",
    detail: [
      "The compiler inserts casts where needed, which is why you do not write them.",
      "Reflection can still see the declared generic types of fields and methods, but not of local objects.",
      "A `Class<T>` argument is the usual workaround when a method needs the actual type at run time.",
    ],
    ex: "A method `static <T> T create()` cannot call `new T()`, so it takes a `Supplier<T>` instead.",
    mistakes: [
      "Writing `if (list instanceof List<String>)`, which does not compile.",
      "Expecting `List<String>` and `List<Integer>` to be different classes at run time.",
    ],
    follow: ["How can you work around not being able to call new T()?"],
    points: [
      "Types are checked then erased",
      "No instanceof on parameterised types, no new T()",
      "Pass a Supplier or Class<T> when needed",
    ],
    notes:
      "Generic types exist only at compile time. Use `Supplier<T>` or `Class<T>` when you need the type.",
    src: [
      ["The Java Tutorials: Type Erasure", `${GN}/erasure.html`],
      [
        "The Java Tutorials: Restrictions on Generics",
        `${GN}/restrictions.html`,
      ],
    ],
  }),
])
