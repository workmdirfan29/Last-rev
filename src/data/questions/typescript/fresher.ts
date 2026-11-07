import { defineQuestions } from "../author"

const TS = "https://www.typescriptlang.org/docs/handbook"

export default defineQuestions("typescript", "fresher", [
  {
    slug: "what-is-typescript",
    topic: "Basic types",
    difficulty: "easy",
    title: "What is TypeScript and why use it instead of plain JavaScript?",
    keywords: [
      "typescript",
      "static typing",
      "compiler",
      "javascript superset",
      "tooling",
    ],
    interviewerIntent:
      "A warm-up that checks whether you understand what TypeScript adds and what it does not.",
    shortAnswer:
      "TypeScript is a superset of JavaScript that adds static types. You write types, the compiler checks them before the code runs, and then it removes them to produce plain JavaScript. It catches many mistakes at build time, improves editor autocomplete and refactoring, and documents what functions expect. It does not change runtime behaviour or add runtime checks.",
    detailedAnswer: [
      "Every valid JavaScript file is valid TypeScript, so you can adopt it gradually.",
      "Types are erased during compilation, so there is no type information at runtime. Data from an API still needs validation.",
      "The biggest practical gains are safer refactoring, clearer function signatures and better autocomplete.",
      "TypeScript adds a build step, and type errors can be noisy at first, which is the main cost.",
    ],
    realWorldExample:
      "Renaming a field on an API response type makes the compiler list every component that used the old name, instead of failing in production.",
    codeExamples: [
      {
        title: "A type error caught before running",
        language: "typescript",
        code: `function total(price: number, qty: number): number {
  return price * qty
}

total(10, "2") // Error: Argument of type 'string' is not assignable to type 'number'`,
        walkthrough: [
          "The parameters are annotated as numbers.",
          "Passing a string is rejected by the compiler.",
          "Plain JavaScript would run and silently produce a wrong result.",
        ],
      },
    ],
    commonMistakes: [
      "Thinking TypeScript checks types at runtime.",
      "Using `any` everywhere and losing the benefit.",
    ],
    followUps: [
      {
        question: "Does TypeScript make code faster?",
        hint: "No, types are erased.",
      },
    ],
    answerTips: [
      "Say that types are erased, so runtime validation is still needed for external data.",
    ],
    keyPoints: [
      "Superset of JavaScript",
      "Static types checked at build time",
      "Types are erased",
      "Better tooling",
    ],
    revisionNotes: ["TS checks at compile time, not at runtime."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: The Basics",
        url: `${TS}/2/basic-types.html`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "primitive-and-basic-types",
    topic: "Basic types",
    difficulty: "easy",
    title:
      "What are the basic types in TypeScript? How do you annotate variables and functions?",
    keywords: [
      "string",
      "number",
      "boolean",
      "array",
      "tuple",
      "type annotation",
      "inference",
    ],
    interviewerIntent:
      "Checks that you know the everyday types and when you need to write annotations.",
    shortAnswer:
      "The basic types are string, number, boolean, bigint, symbol, null and undefined, plus arrays like `number[]`, tuples like `[string, number]`, and object types. You annotate with a colon: `let age: number`. TypeScript infers many types from initial values, so annotate function parameters and return types, and let inference handle simple local variables.",
    detailedAnswer: [
      "Inference means `const n = 5` is already typed as `number` (actually the literal type `5` for const).",
      "Function parameters are not inferred from calls, so they need annotations.",
      "A tuple is a fixed-length array with a type for each position.",
      "Annotating return types on exported functions documents the contract and catches accidental changes.",
    ],
    realWorldExample:
      "A `formatPrice(amount: number, currency: string): string` function makes misuse obvious at every call site.",
    codeExamples: [
      {
        title: "Annotations and inference",
        language: "typescript",
        code: `let name: string = "Asha"
let ids: number[] = [1, 2, 3]
let pair: [string, number] = ["age", 30]

const count = 5          // inferred as 5
let title = "Report"     // inferred as string

function greet(user: string, times = 1): string {
  return (user + "! ").repeat(times)
}`,
        walkthrough: [
          "Variables can be annotated explicitly, or inferred from the value.",
          "A tuple fixes both the length and the type at each position.",
          "The parameter `user` needs an annotation, while `times` is inferred from its default.",
          "The return type is declared so changes to the body cannot silently change it.",
        ],
      },
    ],
    commonMistakes: [
      "Annotating everything, including obvious locals.",
      "Leaving parameters untyped and getting implicit any.",
    ],
    followUps: [
      { question: "What is the difference between an array and a tuple?" },
    ],
    answerTips: ["Mention inference, it shows you do not over-annotate."],
    keyPoints: [
      "Primitive types",
      "Arrays and tuples",
      "Annotate parameters and returns",
      "Let inference handle locals",
    ],
    revisionNotes: ["Annotate boundaries, infer the inside."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Everyday Types",
        url: `${TS}/2/everyday-types.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "any-unknown-never",
    topic: "Basic types",
    difficulty: "medium",
    title:
      "What is the difference between any, unknown and never in TypeScript?",
    keywords: ["any", "unknown", "never", "type safety", "narrowing", "void"],
    interviewerIntent:
      "A very common question that checks whether you can keep type safety when a type is not known.",
    shortAnswer:
      "`any` turns off type checking for a value: you can do anything with it, so errors slip through. `unknown` is the safe version: you can assign anything to it, but you must narrow it before using it. `never` is the type of values that never happen, such as a function that always throws, and it is used for exhaustive checks. Prefer `unknown` over `any`.",
    detailedAnswer: [
      "With `any`, `value.foo.bar()` compiles even if it crashes at runtime. It also spreads: anything derived from `any` is `any`.",
      "With `unknown`, you must check first, for example with `typeof` or a type guard, before accessing properties.",
      "`never` is useful in a switch over a union: assigning the leftover value to `never` fails to compile when a case is missing.",
      "`void` is different: it means a function returns nothing useful.",
    ],
    realWorldExample:
      "`JSON.parse` returns `any`. Wrapping it as `unknown` and validating the shape prevents bad data from flowing through the app.",
    codeExamples: [
      {
        title: "Unknown requires narrowing, never checks exhaustiveness",
        language: "typescript",
        code: `function print(value: unknown) {
  if (typeof value === "string") {
    console.log(value.toUpperCase())   // narrowed to string
  }
}

type Shape = "circle" | "square"
function area(s: Shape): number {
  switch (s) {
    case "circle": return 3.14
    case "square": return 1
    default: {
      const _check: never = s   // error if a new Shape is added
      return _check
    }
  }
}`,
        walkthrough: [
          "`unknown` cannot be used until `typeof` narrows it to `string`.",
          "The switch handles every member of the union.",
          "In `default`, `s` has type `never`, so the assignment compiles.",
          "If a new shape is added without a case, the assignment fails and warns you.",
        ],
      },
    ],
    commonMistakes: [
      "Using any to silence errors.",
      "Confusing never with void.",
    ],
    followUps: [
      {
        question: "How do you validate data from an API at runtime?",
        hint: "A schema library or a type guard.",
      },
    ],
    answerTips: [
      "Say 'prefer unknown to any' and give the exhaustive switch example.",
    ],
    keyPoints: [
      "any disables checks",
      "unknown forces narrowing",
      "never = impossible",
      "Prefer unknown",
    ],
    revisionNotes: ["any = trust me, unknown = prove it."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Everyday Types",
        url: `${TS}/2/everyday-types.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "type-vs-interface",
    topic: "Type vs interface",
    difficulty: "medium",
    title: "What is the difference between type and interface in TypeScript?",
    keywords: [
      "type alias",
      "interface",
      "declaration merging",
      "extends",
      "union",
      "intersection",
    ],
    interviewerIntent:
      "A staple question. It checks that you know the real differences rather than repeating that they are the same.",
    shortAnswer:
      "Both describe the shape of an object. An interface can be extended with `extends` and merged by declaring it twice, which is called declaration merging. A type alias can name any type, including unions, intersections, tuples and primitives, but cannot be reopened. For object shapes either works. Teams usually pick one convention and use type for unions.",
    detailedAnswer: [
      "Only a `type` can express a union such as `string | number`.",
      "Interfaces support declaration merging, which libraries use to augment existing types.",
      "Both can be implemented by classes.",
      "Error messages and performance differences are minor. Consistency matters more than the choice.",
    ],
    realWorldExample:
      "A library augments the global `Window` interface to add a custom property, which only works because interfaces merge.",
    codeExamples: [
      {
        title: "Same object shape, different abilities",
        language: "typescript",
        code: `interface User { id: number; name: string }
interface User { email?: string }       // merged into one User

interface Admin extends User { role: "admin" }

type Id = string | number                // only a type can be a union
type Point = { x: number; y: number }
type Point3D = Point & { z: number }     // intersection`,
        walkthrough: [
          "The second `User` declaration adds a field to the first.",
          "`extends` builds a new interface from an existing one.",
          "A union needs a `type` alias.",
          "`&` combines two object types into one.",
        ],
      },
    ],
    commonMistakes: [
      "Saying one is always better.",
      "Trying to declare a union with interface.",
    ],
    followUps: [{ question: "Can a class implement a type alias?" }],
    answerTips: [
      "Mention declaration merging and unions, they are the real differences.",
    ],
    keyPoints: [
      "Interfaces merge and extend",
      "Types name any type",
      "Unions need type",
      "Pick one convention",
    ],
    revisionNotes: ["Interface merges, type unions."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Object Types",
        url: `${TS}/2/objects.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "union-and-intersection-types",
    topic: "Type vs interface",
    difficulty: "easy",
    title: "What are union and intersection types in TypeScript?",
    keywords: [
      "union",
      "intersection",
      "literal types",
      "discriminated union",
      "|",
      "&",
    ],
    interviewerIntent:
      "Checks that you can combine types and model values that can be one of several things.",
    shortAnswer:
      "A union type `A | B` means a value is either A or B, so you can only use what both share until you narrow it. An intersection type `A & B` means a value has all the members of A and B combined. Unions model alternatives, such as `string | number`, and intersections model combinations, such as an entity with timestamps added.",
    detailedAnswer: [
      'Literal types make unions precise: `"loading" | "success" | "error"`.',
      "To use a member that exists on only one side of a union, narrow first with `typeof`, `in` or a discriminant.",
      "Intersections of conflicting property types can collapse to `never`.",
      "Unions of object types with a shared literal field are called discriminated unions.",
    ],
    realWorldExample:
      "A function accepts `string | string[]` for a class name and normalises it to an array before use.",
    codeExamples: [
      {
        title: "Union and intersection",
        language: "typescript",
        code: `type Status = "loading" | "success" | "error"
let s: Status = "loading"
// s = "done"   // Error: not assignable

type WithId = { id: number }
type WithTime = { createdAt: Date }
type Row = WithId & WithTime     // has both

function size(x: string | string[]) {
  return typeof x === "string" ? x.length : x.length   // narrowing
}`,
        walkthrough: [
          "The union restricts `s` to three exact strings.",
          "The intersection `Row` requires both `id` and `createdAt`.",
          "`typeof` narrows the union inside each branch.",
        ],
      },
    ],
    commonMistakes: [
      "Using a union member without narrowing.",
      "Expecting & to mean 'or'.",
    ],
    followUps: [{ question: "What is a discriminated union?" }],
    answerTips: ["Use `|` is 'or' and `&` is 'and' as a quick memory hook."],
    keyPoints: [
      "| means either",
      "& means both",
      "Literal unions are precise",
      "Narrow before use",
    ],
    revisionNotes: ["Union = one of, intersection = all of."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Everyday Types (unions)",
        url: `${TS}/2/everyday-types.html`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "optional-readonly-index-signatures",
    topic: "Basic types",
    difficulty: "easy",
    title:
      "What are optional properties, readonly properties and index signatures?",
    keywords: [
      "optional property",
      "readonly",
      "index signature",
      "Record",
      "object type",
    ],
    interviewerIntent:
      "Checks everyday object typing: fields that may be missing, fields that must not change, and dictionaries.",
    shortAnswer:
      "An optional property is marked with `?`, so it may be missing and its type includes `undefined`. A `readonly` property cannot be reassigned after creation, which the compiler enforces. An index signature, such as `[key: string]: number`, describes an object used as a dictionary with any number of keys of one value type.",
    detailedAnswer: [
      "Optional fields must be checked before use, because their value may be `undefined`.",
      "`readonly` is compile-time only. It does not freeze the object at runtime. Use `Object.freeze` for that.",
      "`Record<string, number>` is a shorter way to write a simple index signature.",
      "With `noUncheckedIndexedAccess`, reading from an index signature also includes `undefined`, which is safer.",
    ],
    realWorldExample:
      "A config type has an optional `timeout` with a default, a readonly `apiUrl`, and a map of feature flags as an index signature.",
    codeExamples: [
      {
        title: "Three modifiers",
        language: "typescript",
        code: `interface Config {
  readonly apiUrl: string
  timeout?: number
  flags: { [name: string]: boolean }
}

const cfg: Config = { apiUrl: "/api", flags: { beta: true } }
// cfg.apiUrl = "/v2"   // Error: read-only
const t = cfg.timeout ?? 5000`,
        walkthrough: [
          "`timeout` may be absent, so a default is supplied with `??`.",
          "`apiUrl` cannot be reassigned.",
          "`flags` accepts any string key with a boolean value.",
        ],
      },
    ],
    commonMistakes: [
      "Assuming readonly prevents runtime changes.",
      "Using an optional field without checking.",
    ],
    followUps: [
      { question: "What does the noUncheckedIndexedAccess option do?" },
    ],
    answerTips: ["Say that readonly is only a compile-time check."],
    keyPoints: [
      "? makes it optional",
      "readonly blocks assignment",
      "Index signature = dictionary",
      "Compile-time only",
    ],
    revisionNotes: ["Optional may be undefined, readonly is compile-time."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Object Types",
        url: `${TS}/2/objects.html`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "type-inference-and-assertions",
    topic: "Basic types",
    difficulty: "medium",
    title: "What are type inference and type assertions? When is `as` risky?",
    keywords: [
      "type inference",
      "type assertion",
      "as",
      "non-null assertion",
      "satisfies",
    ],
    interviewerIntent:
      "Checks that you let the compiler infer where possible and know that assertions are promises, not checks.",
    shortAnswer:
      "Type inference means the compiler works out types from your code, so you do not annotate everything. A type assertion, `value as Type`, tells the compiler to treat a value as a type you know better. It does not convert or check anything at runtime, so a wrong assertion causes runtime errors that TypeScript cannot catch. Prefer narrowing or validation, and use `satisfies` to check a shape without widening.",
    detailedAnswer: [
      "The non-null assertion `value!` is a similar promise that a value is not null or undefined.",
      "Assertions are acceptable for DOM lookups you are sure about, but a guard is safer.",
      "`as const` makes a literal deeply readonly with narrow literal types.",
      "`satisfies` validates that a value matches a type while keeping its more precise inferred type.",
    ],
    realWorldExample:
      '`document.getElementById("app") as HTMLDivElement` compiles even if the element is missing, and then crashes when used.',
    codeExamples: [
      {
        title: "Assertion versus guard",
        language: "typescript",
        code: `const el = document.getElementById("app")
// risky: const div = el as HTMLDivElement
if (el instanceof HTMLDivElement) {
  el.textContent = "ready"     // safe: narrowed by a real check
}

const routes = { home: "/", about: "/about" } as const
type Route = (typeof routes)[keyof typeof routes]   // "/" | "/about"`,
        walkthrough: [
          "The assertion line would hide a missing element.",
          "`instanceof` checks at runtime and narrows the type.",
          "`as const` keeps the exact string values.",
          "The `Route` type is derived from the object, so it stays in sync.",
        ],
      },
    ],
    commonMistakes: [
      "Using `as any` to make errors disappear.",
      "Believing an assertion converts the value.",
    ],
    followUps: [{ question: "What does the `satisfies` operator do?" }],
    answerTips: ["Say 'assertions are promises, guards are proof'."],
    keyPoints: [
      "Inference reduces annotations",
      "as does not check at runtime",
      "Prefer guards",
      "as const and satisfies",
    ],
    revisionNotes: ["Assertion = trust me. Guard = proof."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Everyday Types (type assertions)",
        url: `${TS}/2/everyday-types.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "enums-vs-union-types",
    topic: "Basic types",
    difficulty: "medium",
    title: "What are enums in TypeScript? Should you use them or union types?",
    keywords: [
      "enum",
      "const enum",
      "union of literals",
      "runtime object",
      "tree shaking",
    ],
    interviewerIntent:
      "Checks that you know enums generate runtime code and that unions are a common lighter alternative.",
    shortAnswer:
      'An enum defines a named set of constants. Unlike most TypeScript features, it generates a real runtime object. Numeric enums also allow reverse mapping. Many teams prefer a union of string literals, such as `"admin" | "user"`, because it has no runtime cost and works naturally with JSON, or an `as const` object when they need runtime values.',
    detailedAnswer: [
      "String enums are safer than numeric ones, because any number can be assigned to a numeric enum in older behaviour.",
      "Enums are not purely types, so they affect bundle output and some build tools restrict them.",
      "Union types are erased and are easy to serialise.",
      "Use an enum when you want a runtime lookup object and the team already uses them consistently.",
    ],
    realWorldExample:
      'An order status stored as the string `"shipped"` in the API fits a string-literal union directly, while an enum needs conversion.',
    codeExamples: [
      {
        title: "Enum and alternatives",
        language: "typescript",
        code: `enum Role { Admin = "ADMIN", User = "USER" }
const r: Role = Role.Admin

type RoleLiteral = "ADMIN" | "USER"           // no runtime code

const ROLES = { Admin: "ADMIN", User: "USER" } as const
type RoleValue = (typeof ROLES)[keyof typeof ROLES]`,
        walkthrough: [
          "The enum creates a runtime object named `Role`.",
          "The literal union is only a type and disappears after compilation.",
          "The `as const` object gives runtime values and a derived union type.",
        ],
      },
    ],
    commonMistakes: [
      "Using numeric enums for values sent over the network.",
      "Mixing enums and string literals inconsistently.",
    ],
    followUps: [{ question: "What is a const enum and what is its drawback?" }],
    answerTips: ["Mention the runtime cost, it is the main point."],
    keyPoints: [
      "Enums create runtime objects",
      "String enums are safer",
      "Unions have no runtime cost",
      "as const object is a middle option",
    ],
    revisionNotes: ["Enum = runtime, union = type only."],
    sourceRefs: [
      { label: "TypeScript Handbook: Enums", url: `${TS}/enums.html` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "functions-and-overloads",
    topic: "Basic types",
    difficulty: "medium",
    title:
      "How do you type functions in TypeScript? What are optional parameters and overloads?",
    keywords: [
      "function types",
      "optional parameter",
      "default parameter",
      "rest",
      "overload",
      "callback type",
    ],
    interviewerIntent:
      "Checks everyday function typing, including callbacks and the few cases that need overloads.",
    shortAnswer:
      "Annotate parameters and the return type: `(a: number, b: number): number`. Optional parameters use `?` and must come after required ones; default values make a parameter optional too. Rest parameters collect extra arguments into a typed array. A function type is written `(x: string) => void`. Overloads declare several call signatures for one implementation when the return type depends on the arguments.",
    detailedAnswer: [
      "Callbacks are typed by their signature, so the caller gets autocomplete and checking inside the callback.",
      "`void` as a callback return type means the return value is ignored, not that it must be undefined.",
      "Overload signatures are visible to callers, the implementation signature is not.",
      "Often a union or a generic is simpler than an overload.",
    ],
    realWorldExample:
      "A `fetchJson<T>(url: string, init?: RequestInit): Promise<T>` helper has one optional parameter and a generic return type.",
    codeExamples: [
      {
        title: "Common function typing",
        language: "typescript",
        code: `function greet(name: string, greeting = "Hello", ...extra: string[]): string {
  return greeting + ", " + name + extra.join("")
}

type Handler = (event: string) => void
const on = (h: Handler) => h("click")

function toArray(x: string): string[]
function toArray(x: number): number[]
function toArray(x: string | number) {
  return [x]
}`,
        walkthrough: [
          "`greeting` has a default value, so callers can omit it.",
          "The rest parameter collects extra strings into an array.",
          "`Handler` describes a function type used for a callback.",
          "The two overload signatures decide the return type from the argument type.",
        ],
      },
    ],
    commonMistakes: [
      "Putting an optional parameter before a required one.",
      "Writing overloads when a union would do.",
    ],
    followUps: [
      { question: "What does `this` typing look like in a function?" },
    ],
    answerTips: ["Show a callback type, it appears in almost every codebase."],
    keyPoints: [
      "Annotate parameters and return",
      "? and defaults for optional",
      "Rest is a typed array",
      "Overloads for dependent return types",
    ],
    revisionNotes: ["Callback types describe the function you pass."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: More on Functions",
        url: `${TS}/2/functions.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "classes-and-access-modifiers",
    topic: "Basic types",
    difficulty: "medium",
    title:
      "How do classes work in TypeScript? What are public, private, protected and readonly?",
    keywords: [
      "class",
      "access modifiers",
      "private",
      "protected",
      "readonly",
      "parameter properties",
      "abstract",
    ],
    interviewerIntent:
      "Checks that you know class typing and that private is only enforced by the compiler unless you use #.",
    shortAnswer:
      "TypeScript classes add type annotations and access modifiers to JavaScript classes. `public` is the default, `protected` allows subclasses, and `private` limits a member to its class. `readonly` blocks reassignment. Parameter properties let you declare and assign fields in the constructor. TypeScript's `private` is compile-time only, while `#field` is truly private at runtime.",
    detailedAnswer: [
      "`abstract` classes cannot be instantiated and can declare methods that subclasses must implement.",
      "A class can `implements` an interface to promise a shape.",
      "TypeScript's structural typing means any object with the right shape fits a class type, not only instances.",
      "Prefer composition over deep inheritance, as in plain JavaScript.",
    ],
    realWorldExample:
      "A `UserService` takes its repository as a `private readonly` constructor parameter, which is the common dependency injection style.",
    codeExamples: [
      {
        title: "Modifiers and parameter properties",
        language: "typescript",
        code: `class Account {
  #pin = 1234                              // runtime private
  constructor(private readonly id: string, protected balance = 0) {}

  deposit(n: number): void { this.balance += n }
}

class Savings extends Account {
  addInterest() { this.balance *= 1.04 }   // protected is allowed here
}`,
        walkthrough: [
          "Parameter properties declare and assign `id` and `balance` in one place.",
          "`#pin` is private even at runtime, unlike the `private` keyword.",
          "`Savings` can use the protected `balance`.",
          "Outside the class, `account.balance` would be a compile error.",
        ],
      },
    ],
    commonMistakes: [
      "Thinking `private` hides data at runtime.",
      "Building deep inheritance chains.",
    ],
    followUps: [
      { question: "What is an abstract class and when would you use one?" },
    ],
    answerTips: ["Point out the difference between `private` and `#private`."],
    keyPoints: [
      "public, protected, private",
      "readonly blocks assignment",
      "Parameter properties",
      "# is runtime private",
    ],
    revisionNotes: ["private is a compile-time promise."],
    sourceRefs: [
      { label: "TypeScript Handbook: Classes", url: `${TS}/2/classes.html` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "generics-basics",
    topic: "Generics",
    difficulty: "medium",
    title: "What are generics in TypeScript and why are they useful?",
    keywords: [
      "generics",
      "type parameter",
      "reusable",
      "T",
      "type safety",
      "inference",
    ],
    interviewerIntent:
      "Generics are central to TypeScript. The interviewer wants to see that you can write reusable, type-safe code without any.",
    shortAnswer:
      "Generics let you write code that works with many types while keeping type information. You declare a type parameter, such as `T`, and use it in parameters and return types, so the output type follows the input type. Instead of returning `any` from an identity function, `identity<T>(x: T): T` returns exactly the type you passed in. TypeScript usually infers `T` from the arguments.",
    detailedAnswer: [
      "Generics are used in functions, interfaces, type aliases and classes, such as `Array<T>` and `Promise<T>`.",
      "They keep relationships between types, for example the element type of an array and the type of the returned element.",
      "Give type parameters meaningful names for complex cases, such as `TItem`.",
      "Do not add a generic that is used only once. It adds noise without safety.",
    ],
    realWorldExample:
      "A `useState<User | null>(null)` call in React tells TypeScript exactly what the state may hold.",
    codeExamples: [
      {
        title: "A generic function and interface",
        language: "typescript",
        code: `function first<T>(items: T[]): T | undefined {
  return items[0]
}

const n = first([1, 2, 3])        // number | undefined
const s = first(["a", "b"])       // string | undefined

interface ApiResponse<T> {
  data: T
  error?: string
}
const res: ApiResponse<{ id: number }> = { data: { id: 1 } }`,
        walkthrough: [
          "`T` is inferred from the array passed in.",
          "The return type follows the element type, so no casts are needed.",
          "`ApiResponse<T>` reuses one shape for different payloads.",
        ],
      },
    ],
    commonMistakes: [
      "Returning `any` instead of using a generic.",
      "Adding a type parameter that is used only once.",
    ],
    followUps: [
      {
        question: "How do you restrict a generic type parameter?",
        hint: "extends constraints.",
      },
    ],
    answerTips: ["Use the `first<T>` example, it is short and clear."],
    keyPoints: [
      "Type parameters keep type information",
      "Inference fills T",
      "Used in functions, interfaces and classes",
      "Avoid unnecessary generics",
    ],
    revisionNotes: ["Generic = type as a parameter."],
    sourceRefs: [
      { label: "TypeScript Handbook: Generics", url: `${TS}/2/generics.html` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "generic-constraints",
    topic: "Generics",
    difficulty: "medium",
    title: "What are generic constraints? How does `keyof` help with them?",
    keywords: [
      "generic constraint",
      "extends",
      "keyof",
      "indexed access",
      "type-safe property access",
    ],
    interviewerIntent:
      "Checks that you can limit what a generic accepts and write type-safe property helpers.",
    shortAnswer:
      "A constraint uses `extends` to say a type parameter must have certain properties: `<T extends { length: number }>`. Inside the function you can then use those properties safely. `keyof T` produces a union of the property names of T, so `<K extends keyof T>` restricts a key to real properties and lets the return type be `T[K]`.",
    detailedAnswer: [
      "Without a constraint, TypeScript only allows what is true for every type, which is almost nothing.",
      "The `get(obj, key)` pattern is the standard example for `keyof`.",
      "Constraints can reference other type parameters.",
      "You can also provide a default type: `<T = string>`.",
    ],
    realWorldExample:
      'A `pluck(users, "name")` helper only compiles when `name` is a real property of the user type and returns `string[]`.',
    codeExamples: [
      {
        title: "Constraints with keyof",
        language: "typescript",
        code: `function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}
longest("abc", "de")      // ok
longest([1, 2], [3])      // ok
// longest(1, 2)          // Error: number has no length

function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
get({ id: 1, name: "Asha" }, "name")   // string`,
        walkthrough: [
          "The constraint guarantees `length` exists, so the body can read it.",
          "A number is rejected because it has no `length`.",
          "`K extends keyof T` limits the key to real property names.",
          "`T[K]` gives the exact property type as the return type.",
        ],
      },
    ],
    commonMistakes: [
      "Using any for the key.",
      "Forgetting that a constraint also limits callers.",
    ],
    followUps: [{ question: "What does `T[K]` mean?" }],
    answerTips: [
      "Show the `get(obj, key)` example, it covers both constraints and keyof.",
    ],
    keyPoints: [
      "extends sets a minimum shape",
      "keyof gives property names",
      "T[K] is the property type",
      "Defaults for type parameters",
    ],
    revisionNotes: ["Constrain with extends, restrict keys with keyof."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Generics (constraints)",
        url: `${TS}/2/generics.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "typeof-keyof-indexed-access",
    topic: "Generics",
    difficulty: "medium",
    title: "What do the typeof, keyof and indexed access type operators do?",
    keywords: [
      "typeof",
      "keyof",
      "indexed access",
      "type operators",
      "derive types",
    ],
    interviewerIntent:
      "Checks that you can derive types from values instead of repeating them.",
    shortAnswer:
      'In a type position, `typeof value` gives the type of a value, `keyof Type` gives the union of its property names, and `Type["key"]` is an indexed access type that gives the type of that property. Together they let you derive types from existing code, so they stay in sync. For example, `keyof typeof routes` is the union of the keys of a `routes` object.',
    detailedAnswer: [
      "`typeof` in a type position is TypeScript's operator, not the JavaScript runtime one.",
      'Indexed access can use a union: `User["id" | "name"]`.',
      "For arrays, `Item[number]` gives the element type.",
      "Deriving avoids duplicate definitions that can drift apart.",
    ],
    realWorldExample:
      "A constants object is the single source of truth, and the union type of its values is derived from it.",
    codeExamples: [
      {
        title: "Deriving types",
        language: "typescript",
        code: `const config = { host: "localhost", port: 3000 }

type Config = typeof config               // { host: string; port: number }
type Key = keyof Config                    // "host" | "port"
type Port = Config["port"]                 // number

const sizes = ["sm", "md", "lg"] as const
type Size = (typeof sizes)[number]         // "sm" | "md" | "lg"`,
        walkthrough: [
          "`typeof config` turns the value's shape into a type.",
          "`keyof` lists the property names.",
          "Indexed access picks one property's type.",
          "`as const` plus `[number]` derives a union from an array.",
        ],
      },
    ],
    commonMistakes: [
      "Confusing the type-level typeof with the runtime typeof.",
      "Duplicating a union by hand.",
    ],
    followUps: [
      { question: "How do you get the element type of an array type?" },
    ],
    answerTips: ["Use the `as const` array example to show deriving a union."],
    keyPoints: [
      "typeof: value to type",
      "keyof: property names",
      "T[K]: property type",
      "Derive instead of duplicate",
    ],
    revisionNotes: ["Let the value define the type."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Typeof Type Operator",
        url: `${TS}/2/typeof-types.html`,
      },
      {
        label: "TypeScript Handbook: Keyof Type Operator",
        url: `${TS}/2/keyof-types.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "type-narrowing-and-guards",
    topic: "Narrowing",
    difficulty: "medium",
    title: "What is type narrowing? What are type guards in TypeScript?",
    keywords: [
      "narrowing",
      "type guard",
      "typeof",
      "instanceof",
      "in operator",
      "user-defined type guard",
      "is",
    ],
    interviewerIntent:
      "Narrowing is how you work safely with unions. The interviewer wants to see the built-in guards and a custom one.",
    shortAnswer:
      "Narrowing means TypeScript refines a broad type to a more specific one inside a code branch. It does this with checks like `typeof`, `instanceof`, the `in` operator, equality and truthiness. You can write your own type guard, a function with a return type like `value is User`, so that a true result narrows the type at the call site.",
    detailedAnswer: [
      "`typeof` narrows primitives, `instanceof` narrows class instances, and `in` narrows objects by property.",
      "Truthiness narrows away `null` and `undefined`.",
      "A custom guard is only as correct as the check you write, so TypeScript trusts it.",
      "Assertion functions, `asserts value is T`, throw instead of returning a boolean.",
    ],
    realWorldExample:
      "An `isApiError(e: unknown): e is ApiError` guard lets a catch block safely read `e.status`.",
    codeExamples: [
      {
        title: "Built-in and custom guards",
        language: "typescript",
        code: `function print(x: string | number | null) {
  if (x === null) return
  if (typeof x === "string") console.log(x.toUpperCase())
  else console.log(x.toFixed(1))
}

interface Cat { meow(): void }
interface Dog { bark(): void }
function isCat(a: Cat | Dog): a is Cat {
  return "meow" in a
}`,
        walkthrough: [
          "The null check removes null from the type for the rest of the function.",
          "`typeof` narrows to string, and the else branch is number.",
          "`a is Cat` tells TypeScript that a true result means a Cat.",
          "The `in` operator is the runtime check behind the guard.",
        ],
      },
    ],
    commonMistakes: [
      "Writing a guard whose check does not match its claim.",
      "Using `as` instead of narrowing.",
    ],
    followUps: [
      {
        question:
          "What is the difference between a type guard and a type assertion?",
      },
    ],
    answerTips: ["List the built-in guards, then show one custom guard."],
    keyPoints: [
      "Refine types inside branches",
      "typeof, instanceof, in",
      "Custom `is` guards",
      "TypeScript trusts your guard",
    ],
    revisionNotes: ["Check at runtime, narrow at compile time."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Narrowing",
        url: `${TS}/2/narrowing.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "discriminated-unions",
    topic: "Narrowing",
    difficulty: "medium",
    title: "What is a discriminated union? Show how it models state.",
    keywords: [
      "discriminated union",
      "tagged union",
      "literal type",
      "exhaustive switch",
      "state modelling",
    ],
    interviewerIntent:
      "A favourite design question. It shows whether you can make impossible states unrepresentable.",
    shortAnswer:
      "A discriminated union is a union of object types that share a literal property, the discriminant, such as `status`. Checking that property narrows the whole object to one member, so only the right fields are available. It models states cleanly: a `loading` state has no data, a `success` state has data and an `error` state has a message, so impossible combinations cannot be written.",
    detailedAnswer: [
      "Compare with one type that has optional `data` and `error` fields. Every combination is allowed, even invalid ones.",
      "Use a `switch` on the discriminant and a `never` check in `default` to make the compiler flag missing cases.",
      "Redux actions and API results are common examples.",
      "The discriminant must be a literal type such as a string literal.",
    ],
    realWorldExample:
      'A data-fetching hook returns `{ status: "error"; error: Error }` or `{ status: "success"; data: T }`, so the UI can never read `data` while in the error state.',
    codeExamples: [
      {
        title: "Request state",
        language: "typescript",
        code: `type State =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string }

function render(s: State) {
  switch (s.status) {
    case "loading": return "..."
    case "success": return s.data.join(", ")
    case "error":   return s.message
  }
}`,
        walkthrough: [
          "Each member has a unique `status` literal.",
          "Inside a case, `s` is narrowed to exactly one member.",
          "`s.data` is only available in the success case.",
          "Adding a new status without a case would be caught by an exhaustive check.",
        ],
      },
    ],
    commonMistakes: [
      "Using one type with many optional fields.",
      "Using a non-literal discriminant such as string.",
    ],
    followUps: [{ question: "How do you make the switch exhaustive?" }],
    answerTips: [
      "Contrast it with a type full of optional fields, that is the whole point.",
    ],
    keyPoints: [
      "Shared literal property",
      "Narrows the whole object",
      "Prevents impossible states",
      "Exhaustive switch with never",
    ],
    revisionNotes: ["One tag, one shape."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Narrowing (discriminated unions)",
        url: `${TS}/2/narrowing.html`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "utility-types-overview",
    topic: "Utility types",
    difficulty: "medium",
    title:
      "What are the common utility types: Partial, Required, Pick, Omit, Record and Readonly?",
    keywords: [
      "utility types",
      "Partial",
      "Pick",
      "Omit",
      "Record",
      "Readonly",
      "Required",
    ],
    interviewerIntent:
      "Utility types are used daily. The interviewer expects you to know them and when each fits.",
    shortAnswer:
      "Utility types transform existing types. `Partial<T>` makes all properties optional, `Required<T>` makes them all required, and `Readonly<T>` makes them read-only. `Pick<T, K>` keeps only the chosen keys, `Omit<T, K>` removes them, and `Record<K, V>` builds an object type with keys K and values V. They avoid rewriting similar types by hand.",
    detailedAnswer: [
      "`Partial<User>` suits update functions where only some fields are provided.",
      "`Pick` and `Omit` create variants, such as a public view of a user without the password hash.",
      '`Record<string, number>` types a dictionary, and `Record<"a" | "b", string>` requires exactly those keys.',
      "Utility types are built from mapped types, which you can also write yourself.",
    ],
    realWorldExample:
      '`updateUser(id, patch: Partial<User>)` accepts any subset of user fields, and `PublicUser = Omit<User, "passwordHash">` is safe to send to the client.',
    codeExamples: [
      {
        title: "Everyday utility types",
        language: "typescript",
        code: `interface User { id: number; name: string; email: string; passwordHash: string }

type Patch = Partial<User>
type PublicUser = Omit<User, "passwordHash">
type Preview = Pick<User, "id" | "name">
type Roles = Record<"admin" | "user", string[]>
const frozen: Readonly<User> = { id: 1, name: "A", email: "a@x.io", passwordHash: "x" }`,
        walkthrough: [
          "`Partial` makes every field optional for update payloads.",
          "`Omit` removes a sensitive field for a public type.",
          "`Pick` keeps only the fields needed for a preview.",
          "`Record` requires exactly the listed keys.",
        ],
      },
    ],
    commonMistakes: [
      "Redefining nearly identical interfaces by hand.",
      "Using Partial where some fields must stay required.",
    ],
    followUps: [
      {
        question: "How would you implement Partial yourself?",
        hint: "A mapped type with ?.",
      },
    ],
    answerTips: [
      "Give one real use for each, for example Omit for removing secrets.",
    ],
    keyPoints: [
      "Partial and Required",
      "Pick and Omit",
      "Record for dictionaries",
      "Readonly for immutability",
    ],
    revisionNotes: ["Transform types instead of rewriting them."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Utility Types",
        url: `${TS}/utility-types.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "returntype-parameters-awaited",
    topic: "Utility types",
    difficulty: "medium",
    title: "What do ReturnType, Parameters, Awaited and NonNullable do?",
    keywords: [
      "ReturnType",
      "Parameters",
      "Awaited",
      "NonNullable",
      "Exclude",
      "Extract",
      "utility types",
    ],
    interviewerIntent:
      "Checks that you can derive types from functions and promises instead of repeating them.",
    shortAnswer:
      "`ReturnType<typeof fn>` gives the type a function returns, and `Parameters<typeof fn>` gives its parameters as a tuple. `Awaited<T>` unwraps a Promise to its resolved type. `NonNullable<T>` removes null and undefined, while `Exclude<T, U>` and `Extract<T, U>` remove or keep union members. They keep derived types in sync with the code they come from.",
    detailedAnswer: [
      "Using `ReturnType` means a change to a function's return value automatically updates every type derived from it.",
      "`Awaited<ReturnType<typeof fetchUser>>` gives the resolved value of an async function.",
      '`Exclude<"a" | "b" | "c", "a">` gives `"b" | "c"`.',
      "These types are built with conditional types and `infer`.",
    ],
    realWorldExample:
      "A test helper takes `Parameters<typeof createOrder>` so its arguments always match the real function.",
    codeExamples: [
      {
        title: "Deriving from a function",
        language: "typescript",
        code: `async function fetchUser(id: number) {
  return { id, name: "Asha" }
}

type User = Awaited<ReturnType<typeof fetchUser>>   // { id: number; name: string }
type Args = Parameters<typeof fetchUser>             // [id: number]

type Letters = "a" | "b" | "c"
type NoA = Exclude<Letters, "a">                     // "b" | "c"
type Clean = NonNullable<string | null | undefined>  // string`,
        walkthrough: [
          "`ReturnType` reads the promise type, and `Awaited` unwraps it.",
          "`Parameters` gives a tuple of the argument types.",
          "`Exclude` removes a member from a union.",
          "`NonNullable` strips null and undefined.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting Awaited for async functions.",
      "Writing the type by hand and letting it drift.",
    ],
    followUps: [{ question: "What does `infer` do in a conditional type?" }],
    answerTips: ["Mention that it keeps types in sync with real functions."],
    keyPoints: [
      "ReturnType and Parameters",
      "Awaited unwraps promises",
      "Exclude, Extract, NonNullable",
      "Types stay in sync",
    ],
    revisionNotes: ["Derive types from the function."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Utility Types",
        url: `${TS}/utility-types.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "mapped-types",
    topic: "Utility types",
    difficulty: "hard",
    title:
      "What are mapped types? How would you write your own Partial or Readonly?",
    keywords: [
      "mapped type",
      "keyof",
      "in",
      "modifiers",
      "homomorphic",
      "key remapping",
    ],
    interviewerIntent:
      "A step beyond using utility types. It checks that you understand how they are built.",
    shortAnswer:
      "A mapped type creates a new object type by looping over the keys of another type: `{ [K in keyof T]: ... }`. You can change each property's type and add or remove modifiers such as `?` and `readonly` using `+` or `-`. `Partial<T>` is `{ [K in keyof T]?: T[K] }`. Key remapping with `as` can rename or filter keys.",
    detailedAnswer: [
      "`-?` removes optionality, which is how `Required<T>` works.",
      "Mapped types over `keyof T` preserve the original modifiers by default, which is called homomorphic mapping.",
      "With `as`, you can build types such as getters: `get${Capitalize<K>}`.",
      "They are a type-level for loop over keys.",
    ],
    realWorldExample:
      "A `Nullable<T>` helper makes every field of a form type accept `null` while the form is empty.",
    codeExamples: [
      {
        title: "Writing your own mapped types",
        language: "typescript",
        code: `type MyPartial<T> = { [K in keyof T]?: T[K] }
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }
type Nullable<T> = { [K in keyof T]: T[K] | null }
type Mutable<T> = { -readonly [K in keyof T]: T[K] }

interface Form { name: string; age: number }
type EmptyForm = Nullable<Form>   // { name: string | null; age: number | null }`,
        walkthrough: [
          "`K in keyof T` loops over every property name.",
          "`?` and `readonly` add modifiers to each property.",
          "`| null` changes each property's type.",
          "`-readonly` removes a modifier instead of adding it.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting that mapped types only work on keys you give them.",
      "Overusing them for simple cases.",
    ],
    followUps: [{ question: "How do you rename keys in a mapped type?" }],
    answerTips: ["Write Partial from memory, it is the usual live task."],
    keyPoints: [
      "[K in keyof T]",
      "Add or remove modifiers",
      "Change value types",
      "as for key remapping",
    ],
    revisionNotes: ["A for loop over keys, at type level."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Mapped Types",
        url: `${TS}/2/mapped-types.html`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "conditional-types-and-infer",
    topic: "Utility types",
    difficulty: "hard",
    title: "What are conditional types and the infer keyword?",
    keywords: [
      "conditional type",
      "extends ? :",
      "infer",
      "distributive",
      "ReturnType",
    ],
    interviewerIntent:
      "An advanced question that separates comfortable users from those who only use the basics.",
    shortAnswer:
      "A conditional type chooses between two types based on a check: `T extends U ? X : Y`. The `infer` keyword inside the check captures part of a type into a new type variable, for example the element type of an array or the return type of a function. Conditional types are distributive over unions: they are applied to each union member separately.",
    detailedAnswer: [
      "`type ElementOf<T> = T extends (infer U)[] ? U : never` extracts the item type.",
      "Many built-in utilities such as `ReturnType` and `Awaited` use conditional types.",
      "To stop distribution, wrap both sides in a tuple: `[T] extends [U]`.",
      "Keep them readable. Complex conditional types are hard to debug.",
    ],
    realWorldExample:
      'A typed event system maps an event name to its payload type with a conditional type, so `emit("login", payload)` checks the payload.',
    codeExamples: [
      {
        title: "A conditional type with infer",
        language: "typescript",
        code: `type ElementOf<T> = T extends (infer U)[] ? U : never
type A = ElementOf<string[]>      // string
type B = ElementOf<number>        // never

type MyReturn<F> = F extends (...args: any[]) => infer R ? R : never
type R = MyReturn<() => boolean>  // boolean

type ToArray<T> = T extends unknown ? T[] : never
type C = ToArray<string | number> // string[] | number[]  (distributes)`,
        walkthrough: [
          "`infer U` captures the item type when the check matches.",
          "A non-array falls into the `never` branch.",
          "`MyReturn` captures the return type of a function type.",
          "The last type distributes over each member of the union.",
        ],
      },
    ],
    commonMistakes: [
      "Being surprised by distribution over unions.",
      "Writing conditional types that nobody can read.",
    ],
    followUps: [{ question: "How can you prevent distribution?" }],
    answerTips: ["Explain with ElementOf, it is the smallest useful example."],
    keyPoints: [
      "T extends U ? X : Y",
      "infer captures a type",
      "Distributive over unions",
      "Keep them simple",
    ],
    revisionNotes: ["Conditional type = if at type level."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Conditional Types",
        url: `${TS}/2/conditional-types.html`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "tsconfig-strict-mode",
    topic: "Basic types",
    difficulty: "medium",
    title:
      "What does `strict` mode in tsconfig.json enable? Why should you use it?",
    keywords: [
      "tsconfig",
      "strict",
      "strictNullChecks",
      "noImplicitAny",
      "compiler options",
    ],
    interviewerIntent:
      "Checks that you configure the compiler for real safety and know the key flags.",
    shortAnswer:
      "`strict: true` turns on a group of checks: `strictNullChecks` (null and undefined are not assignable to other types), `noImplicitAny` (parameters must have types), `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict` and `useUnknownInCatchVariables`. It catches many real bugs, so new projects should enable it.",
    detailedAnswer: [
      "`strictNullChecks` is the most valuable single flag: it forces you to handle `null` and `undefined` explicitly.",
      "Additional flags outside strict, such as `noUncheckedIndexedAccess`, can add more safety.",
      "Migrating an old codebase can be done flag by flag.",
      "`target`, `module` and `moduleResolution` control output and import behaviour, and should match your bundler or runtime.",
    ],
    realWorldExample:
      "With `strictNullChecks`, `user.address.city` fails to compile when `address` may be undefined, preventing a runtime crash.",
    codeExamples: [
      {
        title: "A typical strict config",
        language: "json",
        code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true
  }
}`,
        walkthrough: [
          "`strict` enables the whole family of safety checks.",
          "`noUncheckedIndexedAccess` makes array and index reads possibly undefined.",
          "`skipLibCheck` speeds up builds by not checking declaration files of dependencies.",
        ],
      },
    ],
    commonMistakes: [
      "Turning strict off to fix errors.",
      "Mixing module settings that do not match the bundler.",
    ],
    followUps: [
      { question: "What does strictNullChecks change in everyday code?" },
    ],
    answerTips: ["Say that strictNullChecks is the flag that matters most."],
    keyPoints: [
      "strict is a group of flags",
      "strictNullChecks is key",
      "noImplicitAny",
      "Enable it in new projects",
    ],
    revisionNotes: ["Always start with strict."],
    sourceRefs: [
      {
        label: "TypeScript: TSConfig Reference (strict)",
        url: "https://www.typescriptlang.org/tsconfig#strict",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "declaration-files-and-definitelytyped",
    topic: "Basic types",
    difficulty: "medium",
    title: "What are .d.ts declaration files and @types packages?",
    keywords: [
      "declaration file",
      ".d.ts",
      "@types",
      "DefinitelyTyped",
      "ambient declarations",
    ],
    interviewerIntent:
      "Checks that you can use JavaScript libraries safely from TypeScript.",
    shortAnswer:
      "A `.d.ts` declaration file contains only type information, with no implementation. It describes the shape of JavaScript code so TypeScript can check calls to it. Many libraries ship their own types. For others, the community publishes `@types/package` from DefinitelyTyped, which you install as a dev dependency. You can also write your own declarations for untyped modules.",
    detailedAnswer: [
      "The `types` field in a package's package.json points to its bundled declarations.",
      '`declare module "some-lib";` quickly marks an untyped module as `any`, which is a stopgap.',
      "Global augmentations, such as adding a property to `Window`, go in a `.d.ts` file included by tsconfig.",
      "Compiling your own library with `declaration: true` generates `.d.ts` files for consumers.",
    ],
    realWorldExample:
      "Installing `@types/node` gives type information for `process`, `Buffer` and the built-in modules.",
    codeExamples: [
      {
        title: "A small declaration",
        language: "typescript",
        code: `// globals.d.ts
declare module "legacy-lib" {
  export function add(a: number, b: number): number
}

interface Window {
  appVersion: string
}`,
        walkthrough: [
          "`declare module` describes a module that has no types of its own.",
          "The function signature has no body, only types.",
          "Redeclaring `Window` merges a new property into the built-in interface.",
        ],
      },
    ],
    commonMistakes: [
      "Installing @types for a library that already ships types.",
      "Leaving untyped modules as any forever.",
    ],
    followUps: [
      {
        question: "How do you add a property to an existing global interface?",
      },
    ],
    answerTips: [
      "Mention that bundled types are better than @types when available.",
    ],
    keyPoints: [
      ".d.ts holds types only",
      "@types from DefinitelyTyped",
      "Libraries may ship types",
      "declare module for gaps",
    ],
    revisionNotes: [".d.ts describes JavaScript to TypeScript."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Declaration Files",
        url: `${TS}/declaration-files/introduction.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "structural-typing",
    topic: "Basic types",
    difficulty: "medium",
    title:
      "What is structural typing in TypeScript? How does it differ from nominal typing?",
    keywords: [
      "structural typing",
      "duck typing",
      "nominal typing",
      "type compatibility",
      "excess property check",
    ],
    interviewerIntent:
      "Checks a core idea behind how TypeScript decides whether one type fits another.",
    shortAnswer:
      "TypeScript uses structural typing: two types are compatible if their shapes match, regardless of their names. An object with at least the required properties can be used where a type is expected. Nominal typing, used in languages like Java, requires an explicit declared relationship. TypeScript can fake nominal types with branding. Fresh object literals also get an excess property check.",
    detailedAnswer: [
      "An object with extra properties is still assignable to a type with fewer ones when passed as a variable.",
      "Directly assigning an object literal with unknown properties triggers an excess property error, which catches typos.",
      "Branded types add a unique field so two structurally identical types, such as `UserId` and `OrderId`, are not interchangeable.",
      "Classes with private members behave more nominally.",
    ],
    realWorldExample:
      "A function that accepts `{ name: string }` can be called with a full `User` object that has more fields.",
    codeExamples: [
      {
        title: "Shape matters, name does not",
        language: "typescript",
        code: `interface Named { name: string }
const user = { name: "Asha", age: 30 }
const n: Named = user            // ok: has name

// const m: Named = { name: "A", age: 3 }  // Error: excess property in a literal

type UserId = string & { readonly brand: "UserId" }
type OrderId = string & { readonly brand: "OrderId" }
declare const uid: UserId
// const oid: OrderId = uid      // Error: brands differ`,
        walkthrough: [
          "The `user` variable has all the properties `Named` needs, so it fits.",
          "A fresh literal with an extra property is rejected to catch typos.",
          "Branding gives two string types distinct identities.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting two interfaces with the same shape to be different.",
      "Not knowing about the excess property check.",
    ],
    followUps: [{ question: "How would you prevent mixing up two ID types?" }],
    answerTips: ["Mention branded types as the workaround."],
    keyPoints: [
      "Compatibility by shape",
      "Extra properties allowed for variables",
      "Excess check on literals",
      "Brands add nominal behaviour",
    ],
    revisionNotes: ["If it quacks like the type, it is the type."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Type Compatibility",
        url: `${TS}/type-compatibility.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "typescript-with-react-props",
    topic: "Generics",
    difficulty: "medium",
    title:
      "How do you type props, state and events in a React component with TypeScript?",
    keywords: [
      "React",
      "props",
      "useState",
      "ChangeEvent",
      "children",
      "ReactNode",
    ],
    interviewerIntent:
      "Most TypeScript jobs are React jobs. The interviewer checks that you can type common component patterns.",
    shortAnswer:
      "Define a props type or interface and annotate the destructured parameter. Use `React.ReactNode` for `children`. Give `useState` a generic when the initial value does not tell the full type, such as `useState<User | null>(null)`. Type event handlers with React's event types, such as `React.ChangeEvent<HTMLInputElement>`. Avoid `React.FC` unless the team prefers it.",
    detailedAnswer: [
      "Optional props use `?`, and default values can be set in destructuring.",
      '`ComponentProps<"button">` reuses the native props of an element.',
      "Generic components, such as a `List<T>`, let one component work with typed items.",
      "Typed hooks like `useRef<HTMLInputElement>(null)` give you the element type on `.current`.",
    ],
    realWorldExample:
      "A reusable `Button` component extends the native button props and adds a `variant` prop, so every attribute like `disabled` still works.",
    codeExamples: [
      {
        title: "Typed component and handler",
        language: "tsx",
        code: `import { useState, type ReactNode, type ChangeEvent } from "react"

interface CardProps {
  title: string
  children: ReactNode
  onClose?: () => void
}

function Card({ title, children, onClose }: CardProps) {
  return <section><h2>{title}</h2>{children}<button onClick={onClose}>x</button></section>
}

function Search() {
  const [q, setQ] = useState("")
  const [user, setUser] = useState<{ id: number } | null>(null)
  function onChange(e: ChangeEvent<HTMLInputElement>) { setQ(e.target.value) }
  return <input value={q} onChange={onChange} />
}`,
        walkthrough: [
          "`CardProps` documents what the component needs, and `onClose` is optional.",
          "`children` is typed as `ReactNode`.",
          "The generic on `useState` allows null and an object.",
          "`ChangeEvent<HTMLInputElement>` gives `e.target.value` the right type.",
        ],
      },
    ],
    commonMistakes: [
      "Typing events as any.",
      "Using `useState(null)` and then failing to set an object.",
    ],
    followUps: [
      { question: "How do you type a custom hook that returns a tuple?" },
    ],
    answerTips: [
      "Show props, useState generic and an event type, the three everyday cases.",
    ],
    keyPoints: [
      "Props interface",
      "ReactNode for children",
      "useState generic",
      "Event types",
    ],
    revisionNotes: ["Type props, state and events."],
    sourceRefs: [
      {
        label: "React docs: Using TypeScript",
        url: "https://react.dev/learn/typescript",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "modules-and-type-only-imports",
    topic: "Basic types",
    difficulty: "medium",
    title: "How do modules work in TypeScript? What is `import type`?",
    keywords: [
      "modules",
      "import type",
      "export type",
      "isolatedModules",
      "ES modules",
      "verbatimModuleSyntax",
    ],
    interviewerIntent:
      "Checks that you understand that types are erased and how type-only imports keep bundles and builds correct.",
    shortAnswer:
      'TypeScript uses standard ES module syntax: `import` and `export`. `import type { User } from "./types"` imports only a type, and the compiler erases it completely, so no runtime import is left. This avoids circular dependencies and accidental bundling, and some tools that compile files one at a time need it, as with `isolatedModules`.',
    detailedAnswer: [
      "Types and interfaces have no runtime value, so a normal import of only types is removed anyway, but tools may not know that.",
      "`export type { Foo }` re-exports a type without a runtime export.",
      "A file is a module if it has a top-level import or export. Otherwise its declarations are global.",
      "`verbatimModuleSyntax` makes the compiler stricter about which imports are kept.",
    ],
    realWorldExample:
      "A types file imported with `import type` stops a circular import between two modules from appearing in the compiled output.",
    codeExamples: [
      {
        title: "Type-only import and re-export",
        language: "typescript",
        code: `// user.ts
export interface User { id: number; name: string }
export function makeUser(name: string): User { return { id: 1, name } }

// app.ts
import { makeUser } from "./user"
import type { User } from "./user"      // erased at compile time

export type { User }                    // re-export only the type
const u: User = makeUser("Asha")`,
        walkthrough: [
          "`makeUser` is a runtime value, so it is imported normally.",
          "`User` is only a type, so `import type` keeps it out of the output.",
          "`export type` re-exports the type without creating a runtime export.",
        ],
      },
    ],
    commonMistakes: [
      "Importing types as values and creating cycles.",
      "Forgetting that a file without imports or exports is a global script.",
    ],
    followUps: [{ question: "What does isolatedModules require?" }],
    answerTips: ["Say that type-only imports vanish at runtime."],
    keyPoints: [
      "ES module syntax",
      "import type is erased",
      "export type for re-exports",
      "Files with import/export are modules",
    ],
    revisionNotes: ["Types vanish, import type makes that explicit."],
    sourceRefs: [
      { label: "TypeScript Handbook: Modules", url: `${TS}/2/modules.html` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "typescript-errors-and-unknown-catch",
    topic: "Narrowing",
    difficulty: "medium",
    title:
      "How do you handle errors safely in TypeScript? What type is a caught error?",
    keywords: [
      "catch",
      "unknown",
      "Error",
      "instanceof",
      "custom error",
      "useUnknownInCatchVariables",
    ],
    interviewerIntent:
      "Checks that you do not assume what was thrown, since JavaScript can throw anything.",
    shortAnswer:
      "In JavaScript you can throw any value, so in TypeScript a caught error is `unknown` when `useUnknownInCatchVariables` is on, which is part of `strict`. You narrow it before using it: check `error instanceof Error` to read `message`, or use a custom type guard. For expected failures, return a typed result instead of throwing.",
    detailedAnswer: [
      "Custom errors extend `Error` and can carry extra fields such as a status code.",
      "`instanceof` fails across different realms or duplicated packages, so a property check can be safer.",
      "A result type such as `{ ok: true; value: T } | { ok: false; error: E }` makes failures part of the signature.",
      "Never assume `error.message` exists without checking.",
    ],
    realWorldExample:
      "An API helper catches a failed request, narrows the error to `HttpError`, and shows the status code, while unknown errors get a generic message.",
    codeExamples: [
      {
        title: "Narrowing a caught error",
        language: "typescript",
        code: `class HttpError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

try {
  await fetchData()
} catch (e) {                       // e is unknown
  if (e instanceof HttpError) console.log(e.status)
  else if (e instanceof Error) console.log(e.message)
  else console.log("Unknown failure")
}

type Result<T> = { ok: true; value: T } | { ok: false; error: string }`,
        walkthrough: [
          "`e` is unknown, so it cannot be used directly.",
          "`instanceof HttpError` narrows to the custom class and exposes `status`.",
          "`instanceof Error` handles standard errors.",
          "The `Result` type makes success and failure explicit in the return type.",
        ],
      },
    ],
    commonMistakes: [
      "Casting the caught value to Error without checking.",
      "Throwing strings or plain objects.",
    ],
    followUps: [
      { question: "When would you return a Result instead of throwing?" },
    ],
    answerTips: [
      "Mention that anything can be thrown, it explains why catch is unknown.",
    ],
    keyPoints: [
      "Caught value is unknown",
      "Narrow with instanceof",
      "Custom errors extend Error",
      "Result types for expected failures",
    ],
    revisionNotes: ["Never trust what was thrown."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Narrowing",
        url: `${TS}/2/narrowing.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "template-literal-and-literal-types",
    topic: "Utility types",
    difficulty: "hard",
    title: "What are literal types, template literal types and `as const`?",
    keywords: [
      "literal types",
      "template literal types",
      "as const",
      "string unions",
      "Capitalize",
    ],
    interviewerIntent:
      "Checks use of precise types to model strings such as event names or CSS values.",
    shortAnswer:
      'A literal type is a type with exactly one value, such as `"GET"` or `42`. Unions of literals model a fixed set of options. Template literal types build string types from other types: `` `on${Capitalize<Event>}` ``. `as const` freezes a value into its narrowest literal types and makes it readonly, so you can derive precise union types from data.',
    detailedAnswer: [
      'Without `as const`, `const x = { method: "GET" }` types `method` as `string`, which is too wide.',
      "Template literal types can combine unions to generate every combination.",
      "Helpers like `Uppercase`, `Lowercase` and `Capitalize` transform string literal types.",
      "They suit typed event names, route paths and design token names.",
    ],
    realWorldExample:
      "A typed event emitter derives handler names such as `onClick` and `onHover` from a list of event names.",
    codeExamples: [
      {
        title: "Literal and template literal types",
        language: "typescript",
        code: `type Method = "GET" | "POST"
type Endpoint = "users" | "orders"
type Route = \`\${Method} /\${Endpoint}\`   // "GET /users" | "GET /orders" | "POST /users" | ...

type EventName = "click" | "hover"
type Handler = \`on\${Capitalize<EventName>}\`   // "onClick" | "onHover"

const req = { method: "GET", url: "/users" } as const
// req.method has type "GET", not string`,
        walkthrough: [
          "A template literal type combines unions into every string combination.",
          "`Capitalize` changes the first letter of each literal.",
          '`as const` keeps `"GET"` as the exact literal.',
        ],
      },
    ],
    commonMistakes: [
      "Forgetting as const and getting wide string types.",
      "Creating huge unions with many combinations.",
    ],
    followUps: [
      {
        question:
          'Why does `const x = "a"` have a literal type but `let x = "a"` does not?',
      },
    ],
    answerTips: ["Mention that as const keeps data and types in sync."],
    keyPoints: [
      "Literal types are single values",
      "Unions of literals model options",
      "Template literal types build strings",
      "as const narrows",
    ],
    revisionNotes: ["Exact values as types."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Template Literal Types",
        url: `${TS}/2/template-literal-types.html`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "interfaces-extending-and-implementing",
    topic: "Type vs interface",
    difficulty: "easy",
    title: "How do you extend interfaces and implement them in classes?",
    keywords: [
      "extends",
      "implements",
      "interface",
      "inheritance",
      "contract",
      "multiple interfaces",
    ],
    interviewerIntent:
      "Checks the basics of using interfaces as contracts and composing them.",
    shortAnswer:
      "An interface can extend one or more interfaces with `extends`, inheriting their members and adding more. A class promises to follow an interface with `implements`, and the compiler checks that it provides every member. A class can implement several interfaces but extend only one class. Interfaces describe shape only and produce no runtime code.",
    detailedAnswer: [
      "`implements` only checks the class. It does not copy anything, so you still write the members.",
      "Extending interfaces is useful to build a base shape and specialise it.",
      "Prefer small, focused interfaces over one huge one.",
      "A function can take an interface type, which lets you pass any compatible object, not only classes.",
    ],
    realWorldExample:
      "A `Logger` interface is implemented by `ConsoleLogger` and `FileLogger`, so code can depend on the interface and swap implementations in tests.",
    codeExamples: [
      {
        title: "Extending and implementing",
        language: "typescript",
        code: `interface Entity { id: number }
interface Timestamped { createdAt: Date }
interface Post extends Entity, Timestamped { title: string }

interface Logger { log(message: string): void }

class ConsoleLogger implements Logger {
  log(message: string) { console.log(message) }
}

function run(logger: Logger) { logger.log("start") }
run(new ConsoleLogger())`,
        walkthrough: [
          "`Post` combines two interfaces and adds a field.",
          "`implements Logger` makes the compiler check the `log` method.",
          "`run` depends only on the interface, so any compatible object works.",
        ],
      },
    ],
    commonMistakes: [
      "Thinking implements copies the members.",
      "Writing very large interfaces.",
    ],
    followUps: [
      { question: "Can a class implement a type alias of an object type?" },
    ],
    answerTips: ["Use the Logger example to show why interfaces help testing."],
    keyPoints: [
      "extends builds on interfaces",
      "implements checks classes",
      "Multiple interfaces allowed",
      "No runtime output",
    ],
    revisionNotes: ["Interface = contract."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: Classes (implements clauses)",
        url: `${TS}/2/classes.html`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "this-and-callbacks-typing",
    topic: "Basic types",
    difficulty: "medium",
    title:
      "How does TypeScript help with `this` and callbacks? What is `noImplicitThis`?",
    keywords: [
      "this",
      "noImplicitThis",
      "arrow function",
      "callback",
      "this parameter",
      "bind",
    ],
    interviewerIntent:
      "Checks that you understand how TypeScript catches the classic lost-this bug.",
    shortAnswer:
      "With `noImplicitThis`, TypeScript reports an error when `this` would have an implicit `any` type. You can declare a `this` parameter as the first parameter of a function, such as `function f(this: User)`, which is erased at compile time but checked at call sites. Arrow functions capture `this` lexically, which is why they are used for callbacks inside methods.",
    detailedAnswer: [
      "Passing a method as a callback detaches it from its object, and TypeScript can flag misuse of the `this` parameter.",
      "Class fields that are arrow functions keep `this` bound to the instance.",
      "The `ThisType<T>` utility is used by some libraries to type `this` in object literals.",
      "Prefer arrow functions or explicit binding where `this` matters.",
    ],
    realWorldExample:
      "A class passes `this.handleClick` to an event listener, and TypeScript warns when the method needs `this` of its class but is called detached.",
    codeExamples: [
      {
        title: "A this parameter",
        language: "typescript",
        code: `interface User { name: string }

function greet(this: User, greeting: string) {
  return greeting + ", " + this.name
}

const u: User = { name: "Asha" }
greet.call(u, "Hello")        // ok
// greet("Hello")             // Error: 'this' context of type 'void' is not assignable

class Button {
  label = "Save"
  onClick = () => console.log(this.label)   // arrow keeps this
}`,
        walkthrough: [
          "The `this` parameter documents that `greet` must be called on a User.",
          "`call` supplies a matching `this`.",
          "A plain call has no suitable `this`, so TypeScript reports it.",
          "The arrow function field keeps `this` bound to the instance.",
        ],
      },
    ],
    commonMistakes: [
      "Passing methods as callbacks without binding.",
      "Thinking the `this` parameter exists at runtime.",
    ],
    followUps: [
      {
        question:
          "What is the difference between arrow and regular functions for this?",
      },
    ],
    answerTips: ["Connect it to the JavaScript lost-this bug."],
    keyPoints: [
      "noImplicitThis is part of strict",
      "this parameter is erased",
      "Arrow functions capture this",
      "Bind or use arrow fields",
    ],
    revisionNotes: ["this parameter is checked, not emitted."],
    sourceRefs: [
      {
        label: "TypeScript Handbook: More on Functions (declaring this)",
        url: `${TS}/2/functions.html`,
      },
    ],
    estimatedMinutes: 4,
  },
])
