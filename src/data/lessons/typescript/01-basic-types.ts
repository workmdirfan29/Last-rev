import { defineLesson } from "@/data/lessons/author"

export default defineLesson("typescript", {
  slug: "basic-types",
  title: "Basic types, inference and annotations",
  topic: "Basic types",
  minutes: 70,
  overview:
    "Learn the everyday TypeScript types, when to write annotations and when to let inference work, and how unions, literals, unknown and never fit in.",
  objectives: [
    "Use string, number, boolean, arrays, tuples and object types with annotations",
    "Explain type inference, any versus unknown, and the effect of strict null checking",
    "Combine types with unions and literal types, and describe functions and optional properties",
  ],
  prerequisites: ["javascript"],
  sections: [
    {
      kind: "explain",
      heading: "Types describe values",
      body: [
        "TypeScript adds a static type system to JavaScript. You describe what kind of values a variable, parameter or property holds, and the compiler reports mistakes before the code runs. The types are removed when the code is compiled to JavaScript.",
        "The primitive types are `string`, `number` and `boolean`, written in lower case. Arrays are written `number[]` or `Array<number>`. An object type lists properties, such as `{ x: number; y: number }`.",
        "You often do not need to write a type. TypeScript **infers** it: after `let count = 3`, `count` is known to be a number. Annotate where inference cannot know, such as function parameters, and let it infer the rest.",
      ],
    },
    {
      kind: "code",
      heading: "Annotations and inference",
      example: {
        title: "Where to write a type",
        language: "typescript",
        code: "const title = 'Asha';\nlet age: number = 30;\n\nfunction greet(person: string, times: number = 1): string {\n  return `Hello, ${person}`.repeat(times);\n}\n\nconst scores: number[] = [90, 85];\nconst pair: [string, number] = ['Asha', 30];\n\ngreet('Ravi', 2);",
        walkthrough: [
          "`title` has no annotation: TypeScript infers `string` from the value.",
          "Parameters need annotations, because TypeScript cannot guess what callers will pass. The return type `string` is optional here, because it can be inferred.",
          "`number[]` is an array of numbers, and `[string, number]` is a **tuple** with exactly two elements of known types.",
          "Calling `greet(42)` would be an error because 42 is not a string.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "any, unknown and strictness",
      body: [
        "`any` turns off type checking for a value: you can call it, index it or assign it anywhere. Use it rarely. When you do not know a type, prefer `unknown`, which accepts any value but forces you to check it before you use it.",
        "When you do not annotate and TypeScript cannot infer a type, it may fall back to `any`. The `noImplicitAny` option reports that as an error.",
        "Most projects turn on `strict`, which includes `strictNullChecks`. With it on, `null` and `undefined` are separate types, and you must handle them before using the value. With it off, they can be assigned to anything.",
      ],
    },
    {
      kind: "code",
      heading: "Unions, literals and optional properties",
      example: {
        title: "Describing choices",
        language: "typescript",
        code: "type Id = string | number;\ntype Direction = 'up' | 'down';\n\ninterface User {\n  name: string;\n  nickname?: string;\n  readonly id: Id;\n}\n\nfunction move(dir: Direction): void {\n  console.log(dir);\n}\n\nfunction showId(id: Id): string {\n  return String(id);\n}\n\nmove('up');",
        walkthrough: [
          "`string | number` is a **union**: the value can be either.",
          "A **literal type** such as `'up' | 'down'` allows only those exact values. `move('left')` would be an error.",
          "A `?` after a property name makes it optional, so its type is its declared type plus `undefined`. `readonly` stops the property being reassigned.",
          "`void` is the return type of a function that returns no useful value.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using any to silence an error.",
          fix: "Use unknown and narrow it, or give the value a real type.",
        },
        {
          mistake: "Annotating everything, including obvious local variables.",
          fix: "Let inference work for locals, and annotate function parameters and public APIs.",
        },
        {
          mistake: "Using capitalised String or Number as types.",
          fix: "Use lower-case string and number, which are the primitive types.",
        },
        {
          mistake: "Forgetting that optional properties can be undefined.",
          fix: "Check the property before using it, or provide a default.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Typing a function that reads settings",
      scenario:
        "A function receives a settings object where the theme is optional and the page size must be a number.",
      body: [
        "Write `interface Settings { theme?: 'light' | 'dark'; pageSize: number }` and annotate the parameter. The function must handle a missing `theme`, for example with `settings.theme ?? 'light'`.",
        "The compiler now tells you if a caller passes a theme such as `'blue'` or a page size written as text.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "infer-const",
      prompt: "What type does TypeScript infer for let count = 3?",
      options: ["number", "any", "unknown"],
      answer: 0,
      explanation:
        "It infers the type from the initial value, so count is a number.",
    },
    {
      type: "single",
      id: "unknown-vs-any",
      prompt: "What is the difference between unknown and any?",
      options: [
        "unknown must be narrowed before use, any is not checked",
        "They are identical",
        "any must be narrowed, unknown is not checked",
      ],
      answer: 0,
      explanation:
        "Both accept any value, but unknown requires a check before you use it.",
    },
    {
      type: "output",
      id: "tuple-access",
      prompt: "What does this print?",
      code: {
        language: "typescript",
        code: "const pair: [string, number] = ['Asha', 30];\nconsole.log(pair[1] + 1);",
      },
      options: ["31", "Asha1", "undefined"],
      answer: 0,
      explanation:
        "The tuple's second element is the number 30, so adding 1 gives 31.",
    },
    {
      type: "truefalse",
      id: "types-at-runtime",
      statement: "TypeScript types are checked while the program runs in the browser.",
      answer: false,
      explanation:
        "Types are checked at compile time and removed from the emitted JavaScript.",
    },
    {
      type: "blank",
      id: "optional-mark",
      prompt: "A property is optional when its name is followed by ___.",
      answer: "?",
      explanation:
        "`nickname?: string` means the property may be missing.",
    },
  ],
  assignment: {
    title: "Typed product list",
    task: [
      "Write an interface Product with id, name, price, an optional discount and a category limited to three literal values.",
      "Write a function that takes an array of products and returns the names of those in a given category, with all parameters and the return type annotated.",
    ],
    checklist: [
      "The interface uses an optional property and a literal union",
      "The function parameters are annotated",
      "The code compiles with strict turned on",
      "I did not use any",
    ],
    hints: ["Run the TypeScript compiler or an editor and read each error message."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "type-the-function",
      title: "Add the types",
      task: [
        "Add parameter and return types to this function, and make status accept only the three listed values.",
      ],
      language: "typescript",
      starter:
        "function label(status, count) {\n  return `${status}: ${count}`;\n}\n\nlabel('open', 3);",
      solution:
        "type Status = 'open' | 'closed' | 'pending';\n\nfunction label(status: Status, count: number): string {\n  return `${status}: ${count}`;\n}\n\nlabel('open', 3);",
      hints: ["A union of string literals limits the allowed values."],
      checklist: [
        "status uses a literal union type",
        "count is a number",
        "The return type is string",
      ],
    },
  ],
  revisionNotes: [
    "Annotate parameters; let inference handle locals",
    "string, number, boolean in lower case; T[] arrays; [A, B] tuples",
    "Prefer unknown to any; turn on strict (strictNullChecks, noImplicitAny)",
    "Unions and literal types describe choices; ? makes a property optional",
  ],
  resources: [
    {
      label: "TypeScript Handbook: Everyday Types",
      url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
    },
    {
      label: "TypeScript Handbook: Objects",
      url: "https://www.typescriptlang.org/docs/handbook/2/objects.html",
    },
    {
      label: "TypeScript: strict",
      url: "https://www.typescriptlang.org/tsconfig/",
    },
  ],
})
