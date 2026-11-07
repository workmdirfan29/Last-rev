import { defineLesson } from "@/data/lessons/author"

export default defineLesson("typescript", {
  slug: "type-vs-interface",
  title: "type or interface?",
  topic: "Type vs interface",
  minutes: 30,
  overview:
    "Compare type aliases and interfaces: what they share, where they differ, and a simple rule for choosing one.",
  objectives: [
    "Describe an object shape with both a type alias and an interface",
    "Name the key differences: extending, merging and what only a type alias can express",
    "Choose between them with a clear, consistent rule",
  ],
  prerequisites: ["lesson.typescript.basic-types"],
  sections: [
    {
      kind: "explain",
      heading: "Two ways to name an object type",
      body: [
        "A **type alias** gives a name to any type, and an **interface** names an object type. For object shapes they are very similar, and the Handbook says that in many cases you can choose between them freely.",
        "Almost all features of an interface are available in a type alias. The key distinction is that a type alias cannot be re-opened to add new properties, whereas an interface is always extendable.",
        "TypeScript is **structurally typed**: it only cares about the shape of a value. A value matches either one if it has the right properties, whichever you used to describe it.",
      ],
    },
    {
      kind: "code",
      heading: "Extending and merging",
      example: {
        title: "extends, intersection and declaration merging",
        language: "typescript",
        code: "interface Animal {\n  name: string;\n}\ninterface Bear extends Animal {\n  honey: boolean;\n}\n\ntype AnimalT = { name: string };\ntype BearT = AnimalT & { honey: boolean };\n\ninterface Window2 {\n  title: string;\n}\ninterface Window2 {\n  ts: number;\n}\n\ntype Id = string | number;\ntype Point = [number, number];\n\nconst b: Bear = { name: 'Bo', honey: true };",
        walkthrough: [
          "An interface extends another with `extends`. A type alias builds the same thing with an intersection, `&`.",
          "Declaring the same interface twice **merges** the declarations, so `Window2` has both `title` and `ts`. Declaring the same type alias twice is an error.",
          "Only a type alias can name a union such as `string | number`, a tuple or other non-object types.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Comparing them",
      diagram: {
        kind: "table",
        title: "type alias and interface",
        headers: ["Feature", "interface", "type alias"],
        rows: [
          ["Describe an object shape", "Yes", "Yes"],
          ["Extend another type", "extends", "Intersection with &"],
          ["Add properties later (merging)", "Yes", "No, cannot be re-opened"],
          ["Union, tuple, primitive alias", "No", "Yes"],
          ["Implemented by a class", "Yes", "Yes, for object shapes"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "A simple rule",
      body: [
        "Pick one convention for the whole project and keep to it. A common rule is to use `interface` for the shape of objects and public APIs that others may extend, and `type` for unions, tuples, function types and anything computed from other types.",
        "Use a type alias when you need something an interface cannot express. Use an interface when you want declaration merging, for example to extend a type that a library declares.",
        "Whichever you choose, give the type a clear name and keep it near where it is used.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Mixing both styles for the same kind of thing without a rule.",
          fix: "Agree a convention and apply it throughout the project.",
        },
        {
          mistake: "Declaring a type alias twice and expecting it to merge.",
          fix: "Only interfaces merge. Use an interface, or one combined type.",
        },
        {
          mistake: "Trying to write a union with interface.",
          fix: "Use a type alias for unions, tuples and primitives.",
        },
        {
          mistake: "Treating the choice as a big decision.",
          fix: "For plain object shapes both work. Consistency matters more than the choice.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Choosing in a codebase",
      scenario:
        "A team keeps debating whether to write type or interface in each pull request.",
      body: [
        "Decide once, write it down and, if you use a linter, enforce it with a rule. A sensible choice is interfaces for object shapes and type aliases for unions and computed types.",
        "That removes the debate and gives readers a clue: seeing `type` suggests a union or a derived type, and seeing `interface` suggests an object shape.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "only-type-union",
      prompt: "Which can name a union such as string | number?",
      options: ["A type alias", "An interface", "Both"],
      answer: 0,
      explanation:
        "Only a type alias can name a union, a tuple or a primitive.",
    },
    {
      type: "truefalse",
      id: "interfaces-merge",
      statement: "Declaring an interface with the same name twice merges the declarations.",
      answer: true,
      explanation:
        "Interfaces are open: repeated declarations are combined into one.",
    },
    {
      type: "single",
      id: "intersection-symbol",
      prompt: "Which operator combines two object types in a type alias, like extends does for interfaces?",
      options: ["&", "|", "??"],
      answer: 0,
      explanation:
        "`A & B` is an intersection that has the properties of both.",
    },
    {
      type: "blank",
      id: "structural",
      prompt: "TypeScript compares values by their shape, which is called ___ typing.",
      answer: "structural",
      explanation:
        "Structural typing only cares that a value has the expected properties.",
    },
  ],
  assignment: {
    title: "Pick a convention",
    task: [
      "Write a short style note for a project that says when to use type and when to use interface, with an example of each.",
      "Rewrite five declarations from your own code to follow it.",
    ],
    checklist: [
      "The note gives a clear rule and the reason",
      "Unions and tuples use type",
      "Object shapes follow the rule consistently",
      "I tried extending an interface and an intersection",
    ],
    hints: ["Keep the rule short enough to remember."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "convert-to-interface",
      title: "Interface and type together",
      task: [
        "Write an interface Shape with a name, an interface Circle that extends it with a radius, and a type alias Size that is the union 'small' | 'large'.",
      ],
      language: "typescript",
      starter: "// your declarations",
      solution:
        "interface Shape {\n  name: string;\n}\n\ninterface Circle extends Shape {\n  radius: number;\n}\n\ntype Size = 'small' | 'large';",
      hints: ["Which of the two can express a union?"],
      checklist: [
        "Circle extends Shape",
        "Size is a type alias with a union",
        "Shape uses an interface",
      ],
    },
  ],
  revisionNotes: [
    "Both describe object shapes; TypeScript is structurally typed",
    "Interfaces extend with extends and merge when redeclared",
    "Type aliases can name unions, tuples and computed types; no merging",
    "Choose one convention and apply it consistently",
  ],
  resources: [
    {
      label: "TypeScript Handbook: Everyday Types (type aliases and interfaces)",
      url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
    },
    {
      label: "TypeScript Handbook: Objects",
      url: "https://www.typescriptlang.org/docs/handbook/2/objects.html",
    },
    {
      label: "TypeScript Handbook: Declaration Merging",
      url: "https://www.typescriptlang.org/docs/handbook/declaration-merging.html",
    },
  ],
})
