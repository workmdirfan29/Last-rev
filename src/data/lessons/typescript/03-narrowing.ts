import { defineLesson } from "@/data/lessons/author"

export default defineLesson("typescript", {
  slug: "narrowing",
  title: "Narrowing: from wide types to specific ones",
  topic: "Narrowing",
  minutes: 60,
  overview:
    "Learn how TypeScript narrows a union type with typeof, truthiness, equality, in, instanceof, type predicates and discriminated unions, and how never gives exhaustive checks.",
  objectives: [
    "Narrow a value with typeof, truthiness, equality, in and instanceof",
    "Write a user-defined type guard with a type predicate",
    "Model a discriminated union and check it exhaustively with never",
  ],
  prerequisites: ["lesson.typescript.basic-types"],
  sections: [
    {
      kind: "explain",
      heading: "Why narrowing",
      body: [
        "A value of a union type such as `string | number` can only be used in ways that are valid for both types. To use it as a string, you first check that it is a string. TypeScript follows your checks and **narrows** the type inside the branch where the check holds.",
        "This works through **control flow analysis**: the compiler tracks assignments and conditions and knows the more specific type at each point of the code.",
      ],
    },
    {
      kind: "code",
      heading: "Built-in checks",
      example: {
        title: "typeof, truthiness, in and instanceof",
        language: "typescript",
        code: "function pad(value: string | number): string {\n  if (typeof value === 'number') {\n    return value.toFixed(2);\n  }\n  return value.trim();\n}\n\nfunction shout(text?: string): string {\n  if (text) {\n    return text.toUpperCase();\n  }\n  return '';\n}\n\ntype Fish = { swim: () => void };\ntype Bird = { fly: () => void };\n\nfunction move(animal: Fish | Bird): void {\n  if ('swim' in animal) {\n    animal.swim();\n  } else {\n    animal.fly();\n  }\n}\n\nfunction when(d: Date | string): string {\n  return d instanceof Date ? d.toISOString() : d;\n}",
        walkthrough: [
          "`typeof value === 'number'` narrows to `number` in the if branch, so `toFixed` is allowed. After the return, the type is `string`.",
          "A **truthiness** check removes `undefined` (and other falsy values) from `string | undefined`.",
          "The `in` operator checks whether a property exists and narrows to the type that has it.",
          "`instanceof` narrows to a class type, here `Date`. Equality checks such as `x === y` also narrow.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Type predicates",
      body: [
        "When the built-in checks are not enough, write a function whose return type is a **type predicate**, such as `pet is Fish`. When it returns `true`, TypeScript narrows the argument to that type in the calling code.",
        "A predicate is a promise. TypeScript trusts it, so make sure the check inside really proves the type.",
      ],
    },
    {
      kind: "code",
      heading: "Discriminated unions",
      example: {
        title: "A tagged union and an exhaustive switch",
        language: "typescript",
        code: "type Circle = { kind: 'circle'; radius: number };\ntype Square = { kind: 'square'; side: number };\ntype Shape = Circle | Square;\n\nfunction isCircle(shape: Shape): shape is Circle {\n  return shape.kind === 'circle';\n}\n\nfunction area(shape: Shape): number {\n  switch (shape.kind) {\n    case 'circle':\n      return Math.PI * shape.radius ** 2;\n    case 'square':\n      return shape.side ** 2;\n    default: {\n      const unreachable: never = shape;\n      return unreachable;\n    }\n  }\n}",
        walkthrough: [
          "Each member has a common property `kind` with a different literal type. That property is the **discriminant**.",
          "In each `case`, TypeScript narrows `shape` to the matching member, so `radius` and `side` are available only where they exist.",
          "In `default`, every member has been handled, so `shape` has type `never`. Assigning it to a `never` variable proves the switch is exhaustive.",
          "If you add `Triangle` to the union and forget a case, that assignment becomes a compile error.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using a type assertion (as) instead of checking.",
          fix: "Narrow with a check. An assertion only tells the compiler to trust you.",
        },
        {
          mistake: "Truthiness checks on values where 0 or an empty string are valid.",
          fix: "Compare with undefined or null explicitly in those cases.",
        },
        {
          mistake: "Writing a type predicate that does not really prove the type.",
          fix: "Make the check inside the function match the claim.",
        },
        {
          mistake: "Leaving a switch on a union without a default exhaustiveness check.",
          fix: "Assign the value to a never variable in default.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Handling an API response",
      scenario:
        "A function receives a response that is either a success with data or a failure with a message.",
      body: [
        "Model it as `{ ok: true; data: User } | { ok: false; message: string }`. After `if (res.ok)`, TypeScript knows `res.data` exists, and in the else branch it knows `res.message` exists.",
        "This removes the need for optional properties and non-null assertions, and the compiler reminds you to handle both cases.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "typeof-narrow",
      prompt: "Inside if (typeof x === 'string'), where x: string | number, what is the type of x?",
      options: ["string", "number", "string | number"],
      answer: 0,
      explanation:
        "The typeof check narrows x to string inside the branch.",
    },
    {
      type: "single",
      id: "never-meaning",
      prompt: "When is a value narrowed to never?",
      options: [
        "When all possibilities have been removed",
        "When it is null",
        "When it is any",
      ],
      answer: 0,
      explanation:
        "never represents a state that cannot occur, which is why it works for exhaustiveness checks.",
    },
    {
      type: "truefalse",
      id: "assertion-vs-narrowing",
      statement: "A type assertion with as checks the value at runtime.",
      answer: false,
      explanation:
        "An assertion only changes what the compiler believes. It does not check anything when the program runs.",
    },
    {
      type: "blank",
      id: "predicate-syntax",
      prompt: "A function with return type pet ___ Fish is a type predicate.",
      answer: "is",
      explanation:
        "The form `param is Type` tells TypeScript how to narrow when the function returns true.",
    },
  ],
  assignment: {
    title: "Event handler union",
    task: [
      "Model three events (click with coordinates, key with a key name, and resize with width and height) as a discriminated union.",
      "Write a function that handles each kind and fails to compile if a new kind is added and not handled.",
    ],
    checklist: [
      "Each event has a literal kind property",
      "The handler uses a switch on kind",
      "The default case assigns to never",
      "Adding a fourth event causes a compile error",
    ],
    hints: ["Add a fourth event type to the union and read the error message."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "narrow-the-input",
      title: "Narrow the input",
      task: [
        "Write describe so it returns 'text of length N' for a string, 'number N' for a number and 'nothing' for undefined, with no type assertions.",
      ],
      language: "typescript",
      starter:
        "function describe(value: string | number | undefined): string {\n  // your code\n}",
      solution:
        "function describe(value: string | number | undefined): string {\n  if (typeof value === 'string') return `text of length ${value.length}`;\n  if (typeof value === 'number') return `number ${value}`;\n  return 'nothing';\n}",
      hints: ["Handle string, then number; what remains is undefined."],
      checklist: [
        "The string branch uses length",
        "The number branch prints the number",
        "No as assertion is used",
      ],
    },
  ],
  revisionNotes: [
    "Narrowing uses typeof, truthiness, ===, in, instanceof and type predicates",
    "A discriminated union has a literal discriminant property such as kind",
    "In default, never proves the switch is exhaustive",
    "as is not a check; narrow instead",
  ],
  resources: [
    {
      label: "TypeScript Handbook: Narrowing",
      url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
    },
    {
      label: "TypeScript Handbook: Everyday Types",
      url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
    },
  ],
})
