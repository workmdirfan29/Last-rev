import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "objects-and-prototypes",
  title: "Objects, prototypes and classes",
  topic: "Objects & prototypes",
  minutes: 70,
  overview:
    "Create objects, understand the prototype chain, and see that classes are a clearer way to write prototypes.",
  objectives: [
    "Create and change objects, and use destructuring and spread",
    "Explain the prototype chain and property lookup",
    "Write a class with a constructor, methods, inheritance and private fields",
  ],
  prerequisites: ["lesson.javascript.this-keyword"],
  sections: [
    {
      kind: "explain",
      heading: "Objects",
      body: [
        "An **object** is a collection of key and value pairs. Keys are strings or symbols, and values can be anything, including functions, which are then called methods. You read a property with `obj.key` or `obj['key']`, and add or change it by assigning.",
        "`Object.keys(obj)`, `Object.values(obj)` and `Object.entries(obj)` give arrays that you can loop over. The spread syntax `{ ...a, ...b }` merges objects into a new one, and later keys win. `obj?.a?.b` reads a nested property and gives `undefined` instead of an error when something on the way is missing.",
        "`delete obj.key` removes a property, and `'key' in obj` tests whether it exists, including inherited ones. `Object.hasOwn(obj, 'key')` tests only the object's own properties.",
      ],
    },
    {
      kind: "code",
      heading: "Working with objects",
      example: {
        title: "Read, merge and loop",
        language: "javascript",
        code: "const base = { name: 'Asha', role: 'user' };\nconst update = { role: 'admin', active: true };\nconst merged = { ...base, ...update };\nconsole.log(merged);\nconst { name, role: kind = 'none' } = merged;\nconsole.log(name, kind);\nfor (const [key, value] of Object.entries(merged)) {\n  console.log(key + '=' + value);\n}\nconsole.log(merged?.address?.city);",
        walkthrough: [
          "The spread merges both objects, and `role` from `update` replaces the one from `base`.",
          "Destructuring takes `name` and renames `role` to `kind`, with a default if it is missing.",
          "`Object.entries` gives key and value pairs that can be destructured in the loop.",
          "Optional chaining avoids an error for the missing `address` and gives `undefined`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The prototype chain",
      body: [
        "Every object has a hidden link to another object, its **prototype**. When you read a property that the object does not have, JavaScript looks at its prototype, then at the prototype's prototype, and so on until the end of the chain, `null`. This is the **prototype chain**.",
        "Arrays get `map` and `filter` from `Array.prototype`, and every object gets `toString` from `Object.prototype`. `Object.create(proto)` makes an object with the given prototype, and `Object.getPrototypeOf(obj)` reads it.",
        "Writing to a property always writes to the object itself and never to the prototype. A method found on the prototype is shared by all the objects that use it, which saves memory.",
      ],
    },
    {
      kind: "code",
      heading: "Prototype lookup",
      example: {
        title: "Inherited properties",
        language: "javascript",
        code: "const animal = {\n  speak() {\n    return this.name + ' makes a sound';\n  },\n};\nconst dog = Object.create(animal);\ndog.name = 'Rex';\nconsole.log(dog.speak());\nconsole.log(Object.hasOwn(dog, 'name'), Object.hasOwn(dog, 'speak'));\nconsole.log(Object.getPrototypeOf(dog) === animal);",
        walkthrough: [
          "`dog` has no `speak` of its own, so JavaScript finds it on `animal` and calls it with `this` set to `dog`.",
          "`name` is an own property of `dog`, and `speak` is inherited, so the second line prints `true false`.",
          "The prototype of `dog` is `animal`, so the last line prints `true`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Classes",
      body: [
        "The `class` syntax is a cleaner way to write constructor functions and prototypes. A class has a `constructor`, methods that are placed on the prototype, and static members that belong to the class. `extends` sets up inheritance, and `super` calls the parent constructor or method.",
        "Fields that start with `#`, such as `#balance`, are truly private: code outside the class cannot read them. Getters and setters let you run code when a property is read or written.",
        "Classes are not a different system. Under the surface, they still use prototypes, and `typeof` of a class is `'function'`.",
      ],
    },
    {
      kind: "code",
      heading: "A class with inheritance",
      example: {
        title: "Class, extends and a private field",
        language: "javascript",
        code: "class Account {\n  #balance = 0;\n  constructor(owner) {\n    this.owner = owner;\n  }\n  deposit(amount) {\n    this.#balance += amount;\n    return this;\n  }\n  get balance() {\n    return this.#balance;\n  }\n}\nclass Savings extends Account {\n  addInterest(rate) {\n    return this.deposit(this.balance * rate);\n  }\n}\nconst s = new Savings('Asha');\ns.deposit(100).addInterest(0.1);\nconsole.log(s.balance, s instanceof Account);",
        walkthrough: [
          "`#balance` is private, so only methods of `Account` can use it.",
          "`deposit` returns `this`, which allows chained calls.",
          "`Savings` inherits `deposit` and the `balance` getter through the prototype chain.",
          "The balance is `100` plus `10`, so the output is `110 true`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Adding a method inside the constructor for every object.",
          fix: "Put methods in the class body, so they are shared through the prototype.",
        },
        {
          mistake:
            "Forgetting `super(...)` in a subclass constructor before using `this`.",
          fix: "Call `super(...)` first. Otherwise a `ReferenceError` is thrown.",
        },
        {
          mistake:
            "Looping over an object with `for...in` and getting inherited keys.",
          fix: "Use `Object.keys`, `Object.entries`, or check `Object.hasOwn`.",
        },
        {
          mistake: "Thinking that spread makes a deep copy.",
          fix: "Spread copies one level. Nested objects are still shared, so use `structuredClone` for a deep copy.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A user model",
      scenario:
        "An application has admins and ordinary users, who share most behaviour.",
      body: [
        "Put the shared code in a `User` class, and let `Admin extends User` add only what is different. Keep the data private where outside code should not change it.",
        "Prefer composition, putting an object inside another, when the relationship is not truly 'is a'.",
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "proto-lookup",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "const base = { hi: 'hello' };\nconst child = Object.create(base);\nchild.hi = 'hey';\nconsole.log(child.hi, base.hi);",
      },
      options: ["hey hello", "hey hey", "hello hello"],
      answer: 0,
      explanation:
        "Assigning creates an own property on `child` and leaves the prototype unchanged.",
    },
    {
      type: "output",
      id: "class-instanceof",
      prompt: "What does this print?",
      code: {
        language: "javascript",
        code: "class A {}\nclass B extends A {}\nconst b = new B();\nconsole.log(b instanceof A, typeof B);",
      },
      options: ["true function", "true class", "false function"],
      answer: 0,
      explanation:
        "`instanceof` follows the prototype chain, and a class is a function at run time.",
    },
    {
      type: "single",
      id: "hasown",
      prompt:
        "Which call tells you whether a property belongs to the object itself?",
      options: [
        "Object.hasOwn(obj, 'key')",
        "'key' in obj",
        "obj.key !== null",
      ],
      answer: 0,
      explanation:
        "`in` also finds inherited properties. `Object.hasOwn` checks only the object's own properties.",
    },
    {
      type: "truefalse",
      id: "spread-deep",
      statement: "`{ ...obj }` makes a deep copy of obj.",
      answer: false,
      explanation:
        "The spread syntax makes a shallow copy. Nested objects are still shared.",
    },
  ],
  assignment: {
    title: "A small class hierarchy",
    task: [
      "Write a class `Shape` with a method `area()` that returns `0`, and subclasses `Rectangle` and `Circle` that override it.",
      "Add a method `describe()` in `Shape` that uses `this.area()`, and test all three classes.",
    ],
    checklist: [
      "Subclasses override area",
      "describe works for every subclass",
      "I can draw the prototype chain of a Rectangle",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "count-keys",
      title: "Count own keys",
      task: [
        "Write `countOwnKeys(obj)` that returns the number of own enumerable keys of an object, and ignores inherited ones.",
      ],
      language: "javascript",
      starter: "function countOwnKeys(obj) {\n  // your code\n}",
      solution:
        "function countOwnKeys(obj) {\n  return Object.keys(obj).length;\n}",
      hints: ["`Object.keys` lists only own enumerable keys."],
      checklist: [
        "An empty object gives 0",
        "Nested objects count as one key",
        "Inherited keys are not counted",
      ],
      run: {
        entry: "countOwnKeys",
        cases: [
          {
            name: "empty",
            args: [{}],
            expected: 0,
          },
          {
            name: "flat",
            args: [
              {
                a: 1,
                b: 2,
              },
            ],
            expected: 2,
          },
          {
            name: "nested",
            args: [
              {
                a: {
                  b: 1,
                },
              },
            ],
            expected: 1,
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "Objects hold key/value pairs; spread merges, optional chaining reads safely",
    "Missing properties are looked up along the prototype chain",
    "Class = clearer syntax over prototypes; `extends`, `super`, `#private`",
    "Spread is shallow; use structuredClone for deep copies",
  ],
  resources: [
    {
      label: "MDN: Working with objects",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects",
    },
    {
      label: "MDN: Inheritance and the prototype chain",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain",
    },
    {
      label: "MDN: Classes",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes",
    },
  ],
})
