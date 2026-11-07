import { defineLesson } from "@/data/lessons/author"

export default defineLesson("typescript", {
  slug: "utility-types",
  title: "Utility types: transforming types",
  topic: "Utility types",
  minutes: 70,
  overview:
    "Use the built-in utility types Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType and Parameters to build new types from existing ones.",
  objectives: [
    "Use Partial, Required, Readonly, Pick and Omit to reshape object types",
    "Use Record, Exclude, Extract and NonNullable for maps and unions",
    "Use ReturnType and Parameters to take types from functions, and know how a mapped type works",
  ],
  prerequisites: ["lesson.typescript.basic-types", "lesson.typescript.generics"],
  sections: [
    {
      kind: "explain",
      heading: "Types from types",
      body: [
        "You often need a variation of a type you already have, for example the same object with every property optional. Instead of writing it twice, TypeScript provides **utility types**: generic types that transform other types.",
        "They are global, so you can use them without importing. They are built from mapped and conditional types, but you can use them without knowing how.",
      ],
    },
    {
      kind: "code",
      heading: "Reshaping an object type",
      example: {
        title: "Partial, Required, Readonly, Pick and Omit",
        language: "typescript",
        code: "interface Todo {\n  title: string;\n  description: string;\n  completed: boolean;\n  createdAt: number;\n}\n\ntype TodoUpdate = Partial<Todo>;\ntype FullTodo = Required<TodoUpdate>;\ntype FrozenTodo = Readonly<Todo>;\ntype TodoPreview = Pick<Todo, 'title' | 'completed'>;\ntype NewTodo = Omit<Todo, 'createdAt'>;\n\nfunction update(todo: Todo, changes: Partial<Todo>): Todo {\n  return { ...todo, ...changes };\n}",
        walkthrough: [
          "`Partial<Todo>` makes every property optional, which suits an update that changes only some fields.",
          "`Required<T>` is the opposite: all properties become required.",
          "`Readonly<T>` makes every property read-only.",
          "`Pick<Todo, 'title' | 'completed'>` keeps only the listed properties, and `Omit<Todo, 'createdAt'>` keeps everything except them.",
          "`update` accepts `Partial<Todo>`, so callers can pass just the fields they want to change.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Records, unions and functions",
      example: {
        title: "Record, Exclude, Extract, NonNullable, ReturnType, Parameters",
        language: "typescript",
        code: "type Role = 'admin' | 'editor' | 'viewer';\ntype Permissions = Record<Role, boolean>;\n\ntype NotAdmin = Exclude<Role, 'admin'>;\ntype OnlyAdmin = Extract<Role, 'admin' | 'owner'>;\n\ntype Name = NonNullable<string | null | undefined>;\n\nfunction makeUser(name: string, age: number) {\n  return { name, age };\n}\n\ntype User = ReturnType<typeof makeUser>;\ntype MakeUserArgs = Parameters<typeof makeUser>;\n\nconst perms: Permissions = { admin: true, editor: true, viewer: false };",
        walkthrough: [
          "`Record<Role, boolean>` is an object type with one `boolean` property for each role. A missing role is an error.",
          "`Exclude<Role, 'admin'>` removes members from a union and gives `'editor' | 'viewer'`. `Extract<Role, 'admin' | 'owner'>` keeps only the members that match and gives `'admin'`.",
          "`NonNullable<T>` removes `null` and `undefined`, so `Name` is `string`.",
          "`ReturnType<typeof makeUser>` takes the type a function returns. `Parameters<typeof makeUser>` gives its parameters as a tuple, `[name: string, age: number]`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "How they work",
      body: [
        "Many utility types are **mapped types**, which loop over the keys of a type: `{ [K in keyof T]?: T[K] }` is how `Partial<T>` is built. The `?` adds optionality for each key.",
        "Others are **conditional types**, of the form `T extends U ? X : Y`. `Exclude` and `ReturnType` use them.",
        "You can write your own utility types the same way, and combine them: `Readonly<Pick<User, 'id' | 'name'>>`.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Copying a type and editing it by hand.",
          fix: "Derive it with Pick, Omit or Partial so it follows the original.",
        },
        {
          mistake: "Using Partial for a value that must be complete after validation.",
          fix: "Use Partial only for input. Use Required or the original type for validated data.",
        },
        {
          mistake: "Confusing Pick and Omit.",
          fix: "Pick lists what to keep. Omit lists what to remove.",
        },
        {
          mistake: "Expecting Readonly to freeze objects at runtime.",
          fix: "It is a compile-time check. Use Object.freeze if you need runtime protection.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Form values from a model",
      scenario:
        "A User model has an id, name, email and createdAt, and a form lets people edit only the name and email.",
      body: [
        "Define `type UserForm = Pick<User, 'name' | 'email'>` for the form state, and `type UserPatch = Partial<UserForm>` for a save request that changes some fields.",
        "If the User model gets a new field, the derived types stay in sync automatically.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "partial-effect",
      prompt: "What does Partial<T> do?",
      options: [
        "Makes every property optional",
        "Makes every property required",
        "Removes all properties",
      ],
      answer: 0,
      explanation:
        "Partial constructs a type with all the properties of T set to optional.",
    },
    {
      type: "output",
      id: "exclude-result",
      prompt: "Which type is Result?",
      code: {
        language: "typescript",
        code: "type Role = 'admin' | 'editor' | 'viewer';\ntype Result = Exclude<Role, 'admin' | 'viewer'>;",
      },
      options: ["'editor'", "'admin' | 'viewer'", "Role"],
      answer: 0,
      explanation:
        "Exclude removes the listed members from the union, leaving 'editor'.",
    },
    {
      type: "truefalse",
      id: "readonly-runtime",
      statement: "Readonly<T> prevents changes to an object while the program runs.",
      answer: false,
      explanation:
        "It affects type checking only. Use Object.freeze for runtime protection.",
    },
    {
      type: "blank",
      id: "function-return",
      prompt: "To get the type a function returns, use ___<typeof fn>.",
      answer: "ReturnType",
      explanation:
        "`ReturnType<typeof fn>` extracts the return type.",
    },
  ],
  assignment: {
    title: "Derive the types",
    task: [
      "Define a Product interface with id, name, price, stock and createdAt.",
      "Derive ProductInput (without id and createdAt), ProductPatch (all of ProductInput optional), ProductSummary (name and price only) and a Record from a category union to arrays of products.",
    ],
    checklist: [
      "Every derived type uses a utility type, not a copy",
      "ProductPatch accepts a partial update",
      "The Record requires every category",
      "Adding a field to Product updates the derived types",
    ],
    hints: ["Build ProductPatch from ProductInput with Partial."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "derive-types",
      title: "Derive the types",
      task: [
        "Using only utility types, define PublicUser (no password), UserPatch (all fields optional, no id) and Roles (a record from the role union to boolean).",
      ],
      language: "typescript",
      starter:
        "interface User {\n  id: number;\n  name: string;\n  password: string;\n}\n\ntype Role = 'admin' | 'user';\n\n// your types",
      solution:
        "interface User {\n  id: number;\n  name: string;\n  password: string;\n}\n\ntype Role = 'admin' | 'user';\n\ntype PublicUser = Omit<User, 'password'>;\ntype UserPatch = Partial<Omit<User, 'id'>>;\ntype Roles = Record<Role, boolean>;",
      hints: ["Compose: Partial<Omit<User, 'id'>>."],
      checklist: [
        "PublicUser removes password",
        "UserPatch is optional and has no id",
        "Roles uses Record",
      ],
    },
  ],
  revisionNotes: [
    "Partial, Required, Readonly change optionality and mutability",
    "Pick keeps listed keys; Omit removes listed keys",
    "Record<K, V> makes a map; Exclude/Extract/NonNullable filter unions",
    "ReturnType and Parameters read function types; Readonly is compile-time only",
  ],
  resources: [
    {
      label: "TypeScript Handbook: Utility Types",
      url: "https://www.typescriptlang.org/docs/handbook/utility-types.html",
    },
    {
      label: "TypeScript Handbook: Mapped Types",
      url: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html",
    },
    {
      label: "TypeScript Handbook: Conditional Types",
      url: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
    },
  ],
})
