import { defineLesson } from "@/data/lessons/author"

export default defineLesson("typescript", {
  slug: "generics",
  title: "Generics: functions and types that work for many types",
  topic: "Generics",
  minutes: 90,
  overview:
    "Write reusable code that keeps type information: generic functions, constraints with extends, generic interfaces and classes, and default type parameters.",
  objectives: [
    "Write a generic function and explain what the type parameter does",
    "Constrain a type parameter with extends and use keyof for safe property access",
    "Create generic interfaces, type aliases and classes, and use default type parameters",
  ],
  prerequisites: ["lesson.typescript.basic-types"],
  sections: [
    {
      kind: "explain",
      heading: "The problem generics solve",
      body: [
        "Suppose you write a function that returns its argument. Typed as `any`, it works for everything but forgets what it was given: the result is `any`. Typed as `number`, it works for numbers only.",
        "A **generic** function has a **type parameter**, a placeholder for a type that is decided when the function is used. It lets the output type depend on the input type.",
        "The usual names are `T`, `K`, `V` or a descriptive name such as `Item`. The parameter is declared in angle brackets after the function name.",
      ],
    },
    {
      kind: "code",
      heading: "A generic function",
      example: {
        title: "identity and first",
        language: "typescript",
        code: "function identity<T>(value: T): T {\n  return value;\n}\n\nfunction first<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconst a = identity('hello');\nconst b = identity<number>(42);\nconst c = first([1, 2, 3]);\nconst d = first(['x', 'y']);",
        walkthrough: [
          "`T` is declared once and then used for the parameter and the return type, so they are tied together.",
          "`identity('hello')` lets TypeScript **infer** `T` as `string`, so `a` is a string.",
          "`identity<number>(42)` gives the type argument explicitly. You usually do not need to.",
          "`first` takes an array of `T` and returns `T` or `undefined`. For `[1, 2, 3]` that is `number | undefined`, and for `['x', 'y']` it is `string | undefined`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Constraints",
      body: [
        "Sometimes you need to know a little about `T`. If you write `value.length` on an unconstrained `T`, the compiler objects, because not every type has a length.",
        "A **constraint** uses `extends` to say that `T` must have a certain shape: `function longest<T extends { length: number }>(a: T, b: T)`. Any type with a numeric `length`, such as strings and arrays, is accepted.",
        "`keyof` produces the union of an object type's property names. Combined with a constraint, `K extends keyof T` makes sure a property name really exists on the object.",
      ],
    },
    {
      kind: "code",
      heading: "Constraints and keyof",
      example: {
        title: "A safe property getter",
        language: "typescript",
        code: "function longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b;\n}\n\nfunction getProp<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst user = { name: 'Asha', age: 30 };\nconst n = getProp(user, 'name');\nconst len = longest('ab', 'abc');",
        walkthrough: [
          "`T extends { length: number }` lets the function read `.length` safely.",
          "`K extends keyof T` limits `key` to the property names of `obj`, so `getProp(user, 'email')` is an error.",
          "`T[K]` is an **indexed access type**: the type of that property. `n` is a string.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Generic types and classes",
      example: {
        title: "A reusable result type and a stack",
        language: "typescript",
        code: "interface ApiResult<T> {\n  data: T;\n  error?: string;\n}\n\ntype Pair<A, B = A> = { first: A; second: B };\n\nclass Stack<T> {\n  private items: T[] = [];\n  push(item: T): void {\n    this.items.push(item);\n  }\n  pop(): T | undefined {\n    return this.items.pop();\n  }\n}\n\nconst users: ApiResult<string[]> = { data: ['a', 'b'] };\nconst numbers = new Stack<number>();\nnumbers.push(1);",
        walkthrough: [
          "`ApiResult<T>` describes the same envelope for any kind of data.",
          "`B = A` is a **default type parameter**: if you write `Pair<string>`, the second type is also `string`.",
          "`Stack<T>` is a generic class, so a `Stack<number>` accepts only numbers.",
          "Generic classes are generic over the instance side, so static members cannot use the class's type parameter.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using any when a type parameter would keep the connection between input and output.",
          fix: "Introduce a type parameter such as T and use it on both sides.",
        },
        {
          mistake: "Adding a type parameter that is used only once.",
          fix: "If T appears only in one place, the function may not need to be generic.",
        },
        {
          mistake: "Using a property of T without a constraint.",
          fix: "Add extends with the shape you need.",
        },
        {
          mistake: "Writing explicit type arguments everywhere.",
          fix: "Let TypeScript infer them unless inference gives the wrong type.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A typed fetch helper",
      scenario:
        "Several parts of an app fetch JSON and each expects a different shape.",
      body: [
        "Write `async function getJson<T>(url: string): Promise<T>` that fetches and returns the parsed JSON typed as `T`. Callers write `getJson<User[]>('/users')` and the result is typed as an array of users.",
        "The type argument is a promise you make to the compiler about the shape of the response. It does not validate the data at runtime, so validate data from outside your program when it matters.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "infer-t",
      prompt: "For function identity<T>(v: T): T, what is the type of identity('hi')?",
      options: ["string", "any", "T"],
      answer: 0,
      explanation:
        "TypeScript infers T from the argument, so the result is a string.",
    },
    {
      type: "single",
      id: "constraint-keyword",
      prompt: "Which keyword adds a constraint to a type parameter?",
      options: ["extends", "implements", "typeof"],
      answer: 0,
      explanation:
        "`T extends Shape` says that T must be assignable to Shape.",
    },
    {
      type: "truefalse",
      id: "runtime-validation",
      statement: "A generic type argument such as getJson<User>() checks at runtime that the data is a User.",
      answer: false,
      explanation:
        "Types are erased at runtime. The argument only informs the compiler.",
    },
    {
      type: "blank",
      id: "keyof-operator",
      prompt: "The ___ operator produces the union of an object type's property names.",
      answer: "keyof",
      explanation:
        "`keyof T` gives the property names of T as a union of string literals.",
    },
  ],
  assignment: {
    title: "Generic utilities",
    task: [
      "Write generic functions `last<T>(items: T[])`, `pluck<T, K extends keyof T>(items: T[], key: K)` returning the values of one property, and a generic `Queue<T>` class with enqueue and dequeue.",
      "Use each with at least two different types.",
    ],
    checklist: [
      "last returns T or undefined",
      "pluck rejects a key that does not exist",
      "Queue<number> rejects a string",
      "Type arguments are inferred where possible",
    ],
    hints: ["Try calling pluck with a misspelt key and read the compiler error."],
    minutes: 40,
  },
  exercises: [
    {
      slug: "make-it-generic",
      title: "Make it generic",
      task: [
        "Rewrite this function so that it keeps the type of the array's items instead of returning any.",
      ],
      language: "typescript",
      starter:
        "function lastItem(items: any[]): any {\n  return items[items.length - 1];\n}",
      solution:
        "function lastItem<T>(items: T[]): T | undefined {\n  return items[items.length - 1];\n}",
      hints: ["Use one type parameter for both the array items and the result."],
      checklist: [
        "A type parameter T is declared",
        "The parameter is T[]",
        "The return type is T | undefined",
      ],
    },
    {
      slug: "constrain-the-key",
      title: "Constrain the key",
      task: [
        "Write getValue so that the key must be a real property name of the object, and the result has the type of that property.",
      ],
      language: "typescript",
      starter:
        "function getValue(obj: object, key: string) {\n  return (obj as any)[key];\n}",
      solution:
        "function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}",
      hints: ["Combine keyof with a second type parameter."],
      checklist: [
        "K extends keyof T",
        "The result type is T[K]",
        "No any is left",
      ],
    },
  ],
  revisionNotes: [
    "<T> declares a type parameter; inference usually fills it in",
    "T extends Shape constrains; K extends keyof T limits keys",
    "Generic interfaces, aliases and classes: ApiResult<T>, Pair<A, B = A>, Stack<T>",
    "Type arguments are erased at runtime; they do not validate data",
  ],
  resources: [
    {
      label: "TypeScript Handbook: Generics",
      url: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
    },
    {
      label: "TypeScript Handbook: Keyof Type Operator",
      url: "https://www.typescriptlang.org/docs/handbook/2/keyof-types.html",
    },
    {
      label: "TypeScript Handbook: Indexed Access Types",
      url: "https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html",
    },
  ],
})
