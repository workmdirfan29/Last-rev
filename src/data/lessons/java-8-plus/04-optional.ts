import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-8-plus", {
  slug: "optional",
  title: "Optional: handling absent values",
  topic: "Optional",
  minutes: 45,
  overview:
    "Use Optional as a return type, transform it with map and flatMap, choose between orElse, orElseGet and orElseThrow, and avoid its misuse.",
  objectives: [
    "Create and consume Optional values",
    "Use map, flatMap, filter and the or-else methods correctly",
    "Know where Optional should and should not be used",
  ],
  prerequisites: ["lesson.java-8-plus.lambdas-and-functional-interfaces"],
  sections: [
    {
      kind: "explain",
      heading: "Why Optional",
      body: [
        "`Optional<T>` is a container that holds a value or is **empty**. It makes it visible in a method's return type that a result may be absent, instead of returning `null` and hoping that the caller remembers to check. Create one with `Optional.of(value)`, which throws for `null`, `Optional.ofNullable(value)`, or `Optional.empty()`.",
        "The caller then handles absence with methods and not with null checks: `ifPresent(consumer)` runs code if there is a value, `map(fn)` transforms it, `flatMap(fn)` is for functions that return an `Optional`, `filter(predicate)` keeps it only if it matches, and `orElse`, `orElseGet` and `orElseThrow` give a value or an exception when it is empty.",
        "Streams use it as well: `findFirst()`, `max()` and `reduce(...)` return an `Optional`.",
      ],
    },
    {
      kind: "code",
      heading: "A chain",
      example: {
        title: "map, filter and a default",
        language: "java",
        code: 'record Address(String city) {}\n    record User(String name, Address address) {}\n\n    Optional<User> user = Optional.of(new User("Asha", new Address("Pune")));\n    String city = user.map(User::address).map(Address::city).filter(c -> !c.isBlank()).orElse("unknown");\n    System.out.println(city);\n\n    Optional<User> nobody = Optional.empty();\n    System.out.println(nobody.map(User::name).orElse("anonymous"));\n    nobody.ifPresentOrElse(u -> System.out.println(u.name()), () -> System.out.println("no user"));',
        walkthrough: [
          "`map` is applied only when a value is present, so the chain needs no null check.",
          "`filter` rejects a blank city, and `orElse` supplies the default.",
          "For an empty Optional, `map` gives another empty Optional, and `ifPresentOrElse` runs the second action.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "orElse, orElseGet and orElseThrow",
      body: [
        "`orElse(value)` takes a value that is **always evaluated**, even when the Optional has a value, so an expensive expression there is wasted. `orElseGet(supplier)` runs the supplier **only when empty**. `orElseThrow(supplier)` throws the exception that you provide, and the version without an argument, added in Java 10, throws `NoSuchElementException`.",
        "`get()` without a check can throw and is easy to misuse. Prefer `orElseThrow()`, which says what happens.",
        "**Where not to use it:** as a field, because it adds an object and is not `Serializable`; as a method parameter, because it forces callers to wrap values; and for collections, where an empty collection is better than an `Optional<List<T>>`. The Javadoc describes it as intended for method return types.",
      ],
    },
    {
      kind: "code",
      heading: "Eager and lazy defaults",
      example: {
        title: "orElse versus orElseGet",
        language: "java",
        code: 'public class Main {\n  static String expensive() {\n    System.out.println("computing");\n    return "default";\n  }\n\n  public static void main(String[] args) {\n    Optional<String> present = Optional.of("value");\n    System.out.println(present.orElse(expensive()));\n    System.out.println(present.orElseGet(() -> expensive()));\n    try {\n      Optional.empty().orElseThrow(() -> new IllegalStateException("missing"));\n    } catch (IllegalStateException e) {\n      System.out.println(e.getMessage());\n    }\n  }\n}',
        walkthrough: [
          "`orElse(expensive())` calls `expensive()` before `orElse` runs, even though a value is present.",
          "`orElseGet` does not call the supplier, because a value exists.",
          "`orElseThrow` throws the exception that you give, which is caught here.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Calling `get()` without checking.",
          fix: "Use `orElseThrow()`, `orElse` or `ifPresent`.",
        },
        {
          mistake: "Using `orElse` with a costly method call.",
          fix: "Use `orElseGet` so that it runs only when needed.",
        },
        {
          mistake: "Returning `null` from a method that returns `Optional`.",
          fix: "Return `Optional.empty()`.",
        },
        {
          mistake: "Using `Optional` for fields and parameters.",
          fix: "Use it for return values. Use plain types with `null` checks elsewhere.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A repository lookup",
      scenario:
        "A repository method finds a user by id, and the id may not exist.",
      body: [
        "`Optional<User> findById(long id)` makes the possibility clear. The service writes `repo.findById(id).orElseThrow(() -> new UserNotFoundException(id))`, so the missing case becomes a domain exception in one line.",
        "No caller can forget to handle the missing user, because the type reminds them.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "opt-empty",
      prompt: "What does `Optional.ofNullable(null)` return?",
      options: ["An empty Optional", "It throws NullPointerException", "null"],
      answer: 0,
      explanation:
        "`ofNullable` accepts `null` and returns an empty `Optional`. `of(null)` throws.",
    },
    {
      type: "single",
      id: "opt-orelse",
      prompt: "What is the difference between `orElse(x)` and `orElseGet(s)`?",
      options: [
        "orElse always evaluates x; orElseGet runs the supplier only when empty",
        "They are identical",
        "orElseGet throws an exception",
      ],
      answer: 0,
      explanation: "A costly default should be passed as a supplier.",
    },
    {
      type: "truefalse",
      id: "opt-field",
      statement: "`Optional` is a good type for fields of a class.",
      answer: false,
      explanation:
        "It is meant for return values. It adds an object and is not serialisable.",
    },
    {
      type: "output",
      id: "opt-flatmap",
      prompt: "What does this print?",
      code: {
        language: "java",
        code: 'Optional<String> a = Optional.of("5");\nSystem.out.println(a.map(Integer::parseInt).filter(n -> n > 3).isPresent());',
      },
      options: ["true", "false", "5"],
      answer: 0,
      explanation:
        "The value `5` passes the filter, so the Optional is still present.",
    },
  ],
  assignment: {
    title: "Replace null with Optional",
    task: [
      "Take a small program with three methods that return `null` when nothing is found, and change them to return `Optional`.",
      "Write the callers with `map`, `orElseThrow` and `ifPresentOrElse`, and remove every `if (x != null)`.",
    ],
    checklist: [
      "No method returns null for 'not found'",
      "No get() call is left",
      "I can explain orElse versus orElseGet",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "opt-ex",
      title: "Find a user",
      task: [
        "Write `static Optional<String> findEmail(Map<String, String> emails, String name)` that returns the email of the name, or an empty Optional. Then print `name has no email` when it is empty.",
      ],
      language: "java",
      starter:
        "import java.util.*;\n\npublic class Emails {\n  // your code\n}",
      solution:
        'import java.util.*;\n\npublic class Emails {\n  static Optional<String> findEmail(Map<String, String> emails, String name) {\n    return Optional.ofNullable(emails.get(name));\n  }\n\n  public static void main(String[] args) {\n    Map<String, String> emails = Map.of("Asha", "asha@example.com");\n    System.out.println(findEmail(emails, "Asha").orElse("none"));\n    findEmail(emails, "Ravi").ifPresentOrElse(System.out::println, () -> System.out.println("Ravi has no email"));\n  }\n}',
      hints: [
        "`Map.get` returns `null` for a missing key, and `ofNullable` handles that.",
      ],
      checklist: [
        "A missing key gives an empty Optional",
        "No null check is written",
        "The empty case is handled",
      ],
    },
  ],
  revisionNotes: [
    "Optional holds a value or is empty; use it as a return type",
    "map, flatMap, filter, ifPresentOrElse, orElse / orElseGet / orElseThrow",
    "orElse evaluates eagerly; orElseGet lazily",
    "Not for fields, parameters or collections; avoid get()",
  ],
  resources: [
    {
      label: "Java SE API: Optional",
      url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html",
    },
  ],
})
