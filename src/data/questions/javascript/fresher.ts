import { defineQuestions } from "../author"

const MDN = "https://developer.mozilla.org/en-US/docs/Web/JavaScript"

export default defineQuestions("javascript", "fresher", [
  {
    slug: "var-let-const",
    topic: "Scope & hoisting",
    difficulty: "easy",
    title: "What is the difference between var, let and const?",
    keywords: [
      "var",
      "let",
      "const",
      "scope",
      "hoisting",
      "temporal dead zone",
    ],
    interviewerIntent:
      "A typical JavaScript opener. It tests scope, hoisting and mutability in one question.",
    shortAnswer:
      "`var` is function-scoped, hoisted and initialised as `undefined`, and can be redeclared. `let` and `const` are block-scoped and live in the temporal dead zone until their declaration runs. `const` cannot be reassigned, but an object it points to can still be mutated. Prefer `const`, use `let` when you must reassign, and avoid `var`.",
    detailedAnswer: [
      "**Scope:** `var` belongs to the enclosing *function*, so a `var` inside an `if` or `for` block leaks out. `let` and `const` belong to the enclosing *block* `{ }`.",
      "**Hoisting:** all three are hoisted, but `var` is initialised to `undefined` so you can read it early, while `let`/`const` stay uninitialised in the **temporal dead zone (TDZ)** — reading them before the declaration throws a `ReferenceError`.",
      "**Redeclaration:** `var x` can be declared twice in the same scope; `let` and `const` cannot.",
      "**Reassignment:** `const` forbids reassigning the binding. It does **not** make the value immutable — `const arr = []; arr.push(1)` is fine. Use `Object.freeze` for shallow immutability.",
      "At global level, `var` creates a property on `window`; `let`/`const` do not.",
    ],
    realWorldExample:
      "The classic loop bug: `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))` prints 3, 3, 3 because all callbacks share one function-scoped `i`. With `let i` each iteration gets its own binding and it prints 0, 1, 2.",
    codeExamples: [
      {
        title: "Scope and TDZ",
        language: "javascript",
        code: `console.log(a) // undefined (hoisted)
var a = 1

console.log(b) // ReferenceError (TDZ)
let b = 2

if (true) {
  var leaked = "visible outside"
  let scoped = "block only"
}
console.log(leaked) // "visible outside"
console.log(scoped) // ReferenceError

const user = { name: "Asha" }
user.name = "Ravi" // allowed: mutating the object
user = {}          // TypeError: assignment to constant`,
        walkthrough: [
          "`var a` is hoisted and set to `undefined`, so the first log prints `undefined`.",
          "`let b` exists but is in the TDZ until its line runs, so reading it early throws.",
          "`var leaked` ignores the block; `let scoped` does not.",
          "`const` protects the binding, not the object it points at.",
        ],
      },
    ],
    commonMistakes: [
      "Saying `let` and `const` are not hoisted (they are, but unusable in the TDZ).",
      "Believing `const` makes objects immutable.",
      "Using `var` in loops with async callbacks.",
    ],
    followUps: [
      { question: "What is the temporal dead zone?" },
      {
        question:
          "Does `const` make an object immutable? How would you make it so?",
        hint: "Object.freeze (shallow); deep-freeze for nested.",
      },
    ],
    answerTips: [
      "Use the loop + setTimeout example — it demonstrates scope and closures in ten seconds.",
    ],
    keyPoints: [
      "var: function scope; let/const: block scope",
      "TDZ for let/const",
      "const = no reassignment, not immutability",
      "Prefer const, then let",
    ],
    revisionNotes: ["const by default. let if reassigning. No var."],
    sourceRefs: [
      { label: "MDN: let", url: `${MDN}/Reference/Statements/let` },
      { label: "MDN: var", url: `${MDN}/Reference/Statements/var` },
    ],
    estimatedMinutes: 4,
    relatedIds: ["javascript.fresher.hoisting", "javascript.fresher.closures"],
  },
  {
    slug: "hoisting",
    topic: "Scope & hoisting",
    difficulty: "easy",
    title: "What is hoisting in JavaScript?",
    keywords: ["hoisting", "function declaration", "var", "execution context"],
    interviewerIntent:
      "Checks you understand how the JavaScript engine prepares scope before running code.",
    shortAnswer:
      "Hoisting is JavaScript's behaviour of registering declarations at the top of their scope before any code runs. Function declarations are hoisted with their body, so they can be called before they appear. `var` is hoisted as `undefined`. `let`, `const` and class declarations are hoisted but unusable until their line executes (the TDZ). Function expressions follow the rules of the variable that holds them.",
    detailedAnswer: [
      "Before executing a scope, the engine scans it and creates bindings for declarations. Code is not physically moved — it is a consequence of this two-phase process (creation, then execution).",
      "`function greet() {}` is fully hoisted, so `greet()` works above it. `var greet = function() {}` hoists only the variable (as `undefined`), so calling `greet()` early throws `TypeError: greet is not a function`.",
      "Arrow functions assigned to `const`/`let` behave like any `let`/`const` — they are in the TDZ before the line runs.",
      "Practical advice: declare variables before use and rely on `const`/`let`; do not depend on hoisting for readability.",
    ],
    realWorldExample:
      "A utility file defines helper function declarations at the bottom for readability, and main logic at the top calls them. That works only because function declarations are hoisted — it would fail with `const helper = () => {}`.",
    codeExamples: [
      {
        title: "Declaration vs expression",
        language: "javascript",
        code: `sayHi()        // "hi" — function declaration is hoisted
function sayHi() { console.log("hi") }

sayBye()       // TypeError: sayBye is not a function
var sayBye = function () { console.log("bye") }

sayLater()     // ReferenceError (TDZ)
const sayLater = () => console.log("later")`,
        walkthrough: [
          "`sayHi` is hoisted with its body, so the early call succeeds.",
          "`sayBye` is a `var`: the name exists as `undefined`, and calling `undefined` is a TypeError.",
          "`sayLater` is `const`, so it sits in the TDZ and throws a ReferenceError.",
        ],
      },
    ],
    commonMistakes: [
      "Saying hoisting 'moves code to the top'.",
      "Assuming `let`/`const` are not hoisted.",
    ],
    followUps: [
      {
        question:
          "What is the difference between a function declaration and a function expression?",
      },
      { question: "What is an execution context?" },
    ],
    answerTips: [
      "Mention 'creation phase and execution phase' — it shows you know the mechanism, not just the symptom.",
    ],
    keyPoints: [
      "Declarations are registered before execution",
      "Function declarations hoist fully",
      "var → undefined; let/const → TDZ",
      "Expressions follow their variable",
    ],
    revisionNotes: ["Declarations hoist; initialisations don't."],
    sourceRefs: [
      {
        label: "MDN: Hoisting",
        url: "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "closures",
    topic: "Closures",
    difficulty: "medium",
    title: "What is a closure? Give a practical example.",
    keywords: [
      "closure",
      "lexical scope",
      "private state",
      "function",
      "memory",
    ],
    interviewerIntent:
      "Closures separate people who memorised syntax from those who understand scope. Expect a follow-up with code.",
    shortAnswer:
      "A closure is a function bundled together with a reference to the variables in the scope where it was created. Because of this, the function can keep using those variables even after the outer function has finished. Closures enable private state, function factories, memoization and callbacks.",
    detailedAnswer: [
      "JavaScript uses **lexical scoping**: a function looks up variables in the scope where it was *written*, not where it is called.",
      "When an inner function is returned (or passed elsewhere), it carries a live reference to the outer variables it uses. That reference, plus the function, is the closure.",
      "The variables are shared by reference, not copied. Two closures created in the same call share the same variables; each call to the outer function creates a fresh set.",
      "Closures keep their captured variables alive, so retaining large objects in long-lived closures (event listeners, timers) can cause memory leaks.",
    ],
    realWorldExample:
      "A `createCounter()` factory returns `increment` and `getCount` functions. The `count` variable cannot be touched from outside — only through those functions — giving you encapsulation without classes. React hooks rely on the same idea.",
    codeExamples: [
      {
        title: "Private counter",
        language: "javascript",
        code: `function createCounter() {
  let count = 0 // private, captured by the returned functions
  return {
    increment() { return ++count },
    getCount() { return count },
  }
}

const a = createCounter()
const b = createCounter()
a.increment(); a.increment()
console.log(a.getCount()) // 2
console.log(b.getCount()) // 0 — separate closure
console.log(a.count)      // undefined — not accessible`,
        walkthrough: [
          "Each call to `createCounter` creates a new `count` variable.",
          "`increment` and `getCount` close over that same variable.",
          "`a` and `b` have independent counts because each has its own captured scope.",
          "`count` is not a property of the returned object, so it cannot be accessed directly.",
        ],
      },
    ],
    commonMistakes: [
      "Describing a closure only as 'a function inside a function'.",
      "Thinking closures copy variable values rather than keep references.",
      "Forgetting the `var` in a loop closure bug.",
    ],
    followUps: [
      {
        question:
          "Why does a `var` loop with setTimeout print the same number?",
        hint: "All callbacks close over the same function-scoped variable.",
      },
      { question: "How can closures cause memory leaks?" },
    ],
    answerTips: [
      "Define it, show the counter, then name a real use (React hooks, debounce, module pattern).",
    ],
    keyPoints: [
      "Function + lexical environment",
      "Variables captured by reference",
      "Enables private state and factories",
      "Can retain memory",
    ],
    revisionNotes: ["Closure = function remembers where it was born."],
    sourceRefs: [{ label: "MDN: Closures", url: `${MDN}/Guide/Closures` }],
    estimatedMinutes: 5,
    relatedIds: ["javascript.fresher.var-let-const"],
  },
  {
    slug: "equality-operators",
    topic: "Type coercion",
    difficulty: "easy",
    title: "What is the difference between == and === in JavaScript?",
    keywords: [
      "equality",
      "coercion",
      "strict equality",
      "==",
      "===",
      "Object.is",
    ],
    interviewerIntent:
      "Tests understanding of type coercion and whether you default to safe comparisons.",
    shortAnswer:
      "`===` (strict equality) compares value and type with no conversion. `==` (loose equality) converts operands to a common type first, which produces surprising results such as `0 == ''` being true. Use `===` by default; the main accepted use of `==` is `value == null` to check for both `null` and `undefined`.",
    detailedAnswer: [
      "With `===`, if the types differ the result is `false` immediately; otherwise values are compared. The exception is `NaN`: `NaN === NaN` is `false` — use `Number.isNaN` or `Object.is`.",
      "With `==`, the engine applies the Abstract Equality algorithm: it coerces types (strings to numbers, booleans to numbers, objects to primitives) before comparing. The rules are hard to remember, which is why teams avoid it.",
      "Objects and arrays are compared by **reference** in both operators: `[] === []` is `false` because they are two different objects.",
      "A common, deliberate use of `==`: `x == null` is true only for `null` and `undefined`.",
    ],
    realWorldExample:
      'A form field returns the string `"0"`. `if (value == 0)` passes, but `if (value === 0)` fails — and a bug appears depending on which the developer expected.',
    codeExamples: [
      {
        title: "Surprising coercion",
        language: "javascript",
        code: `0 == ""           // true
0 == "0"          // true
"" == "0"         // false  (not transitive!)
null == undefined // true
null === undefined// false
NaN === NaN       // false
Object.is(NaN, NaN) // true
[] === []         // false (different references)`,
        walkthrough: [
          '`0 == ""` and `0 == "0"` are true because strings are coerced to numbers.',
          'Yet `"" == "0"` is false — two strings compare as strings — showing `==` is not transitive.',
          "`NaN` is never equal to itself with `===`; `Object.is` treats it as equal.",
          "Arrays compare by reference, so two empty arrays are different objects.",
        ],
      },
    ],
    commonMistakes: [
      "Saying `==` 'only compares values' without mentioning coercion.",
      "Comparing objects or arrays with `===` to check content equality.",
      "Using `== true`.",
    ],
    followUps: [
      { question: "How do you check if two objects are deeply equal?" },
      { question: "How do you check for NaN?", hint: "Number.isNaN(x)" },
    ],
    answerTips: [
      "Mention that `x == null` is the one idiom where loose equality is convenient.",
    ],
    keyPoints: [
      "=== no coercion",
      "== coerces and surprises",
      "Objects compare by reference",
      "NaN !== NaN",
    ],
    revisionNotes: ["Use ===. Know why == is risky."],
    sourceRefs: [
      {
        label: "MDN: Equality comparisons",
        url: `${MDN}/Equality_comparisons_and_sameness`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "arrow-vs-regular-functions",
    topic: "Functions",
    difficulty: "medium",
    title: "How do arrow functions differ from regular functions?",
    keywords: [
      "arrow function",
      "this",
      "arguments",
      "constructor",
      "lexical this",
    ],
    interviewerIntent:
      "Tests understanding of `this` binding rules, not just the shorter syntax.",
    shortAnswer:
      "Arrow functions do not have their own `this`, `arguments`, `super` or `new.target` — they inherit `this` from the surrounding scope. They also cannot be used as constructors and have no `prototype`. Regular functions get `this` from how they are called.",
    detailedAnswer: [
      "In a regular function, `this` depends on the **call site**: `obj.method()` → `obj`; a plain call → `undefined` in strict mode (or the global object in sloppy mode); `new Fn()` → the new instance; `call/apply/bind` → the value you pass.",
      "An arrow function captures `this` **lexically** from where it is defined. `call/apply/bind` cannot change it.",
      "That makes arrows ideal for callbacks inside methods (`setTimeout`, `.map`) where you want to keep the outer `this`.",
      "Arrows are a poor choice for object methods that need `this` to be the object, for constructors, and for functions that need `arguments` (use rest parameters instead).",
    ],
    realWorldExample:
      "Inside a class method, `items.forEach(item => this.total += item.price)` works because the arrow keeps `this` as the class instance. With a regular callback, `this` would be `undefined` in strict mode.",
    codeExamples: [
      {
        title: "this in callbacks",
        language: "javascript",
        code: `const timer = {
  seconds: 0,
  startBroken() {
    setInterval(function () {
      this.seconds++ // this is NOT timer here
    }, 1000)
  },
  start() {
    setInterval(() => {
      this.seconds++ // this is timer (lexical)
    }, 1000)
  },
}`,
        walkthrough: [
          "The regular callback in `startBroken` is called by the timer, so its `this` is not `timer`.",
          "The arrow in `start` has no `this` of its own, so it uses the `this` of `start`, which is `timer`.",
          "The `this` of `start` is `timer` because it is called as `timer.start()`.",
        ],
      },
    ],
    commonMistakes: [
      "Using an arrow function as an object method and expecting `this` to be the object.",
      "Trying to `new` an arrow function.",
      "Using `arguments` inside an arrow.",
    ],
    followUps: [
      { question: "How do call, apply and bind differ?" },
      {
        question: "What is `this` at the top level of a module?",
        hint: "undefined in ES modules.",
      },
    ],
    answerTips: [
      "Lead with 'lexical this' — it is the keyword interviewers listen for.",
    ],
    keyPoints: [
      "No own this/arguments",
      "Lexical this",
      "Cannot be a constructor",
      "Great for callbacks, wrong for methods",
    ],
    revisionNotes: ["Arrow: this from outside. Regular: this from the call."],
    sourceRefs: [
      {
        label: "MDN: Arrow functions",
        url: `${MDN}/Reference/Functions/Arrow_functions`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "map-filter-reduce",
    topic: "Arrays",
    difficulty: "easy",
    title: "Explain map, filter and reduce. When would you use each?",
    keywords: [
      "map",
      "filter",
      "reduce",
      "array methods",
      "functional",
      "immutability",
    ],
    interviewerIntent:
      "Everyday fluency with array transformation. Often followed by a live coding task.",
    shortAnswer:
      "`map` transforms every element and returns a new array of the same length. `filter` keeps only elements that pass a test and returns a new, possibly shorter array. `reduce` folds an array into a single value — a number, object or even another array. None of them mutate the original array.",
    detailedAnswer: [
      "`map(fn)` → one output per input. Use it to turn data into another shape (ids → objects, objects → JSX).",
      "`filter(fn)` → keeps items where `fn` returns truthy. Use it to remove or search.",
      "`reduce(fn, initial)` → carries an **accumulator** through the array. Always provide the initial value; without it the first element is used and an empty array throws.",
      "They can be chained: `orders.filter(o => o.paid).map(o => o.total).reduce((a, b) => a + b, 0)`. For readability, prefer `map`/`filter` when they fit and use `reduce` when you genuinely need to combine.",
      "`forEach` is for side effects and returns `undefined`; do not use `map` just to loop.",
    ],
    realWorldExample:
      "Calculate the total of paid orders from an API response: filter paid ones, map to totals, reduce to a sum.",
    codeExamples: [
      {
        title: "Chaining",
        language: "javascript",
        code: `const orders = [
  { id: 1, total: 250, paid: true },
  { id: 2, total: 100, paid: false },
  { id: 3, total: 400, paid: true },
]

const revenue = orders
  .filter((o) => o.paid)
  .map((o) => o.total)
  .reduce((sum, t) => sum + t, 0)

console.log(revenue) // 650

// reduce can also group
const byPaid = orders.reduce((acc, o) => {
  ;(acc[o.paid] ??= []).push(o.id)
  return acc
}, {})`,
        walkthrough: [
          "`filter` keeps orders 1 and 3.",
          "`map` turns those orders into the numbers 250 and 400.",
          "`reduce` starts at 0 and adds each number: 0 + 250 + 400 = 650.",
          "The second `reduce` shows an object accumulator used for grouping.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting the initial value in `reduce`.",
      "Using `map` for side effects and ignoring the result.",
      "Mutating the accumulator's source or the original array.",
    ],
    followUps: [
      { question: "How would you implement `map` yourself?" },
      { question: "What is the difference between `find` and `filter`?" },
    ],
    answerTips: [
      "Always show the chained revenue example — it is short and practical.",
    ],
    keyPoints: [
      "map: transform",
      "filter: select",
      "reduce: combine",
      "Non-mutating",
      "Provide an initial value",
    ],
    revisionNotes: ["map → same length. filter → fewer. reduce → one value."],
    sourceRefs: [
      {
        label: "MDN: Array.prototype.reduce",
        url: `${MDN}/Reference/Global_Objects/Array/reduce`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "promises-basics",
    topic: "Asynchronous JavaScript",
    difficulty: "medium",
    title: "What is a Promise? How is async/await related to it?",
    keywords: ["promise", "async", "await", "then", "catch", "asynchronous"],
    interviewerIntent:
      "Asynchronous code is everywhere in real projects. This checks you understand states, chaining and error handling.",
    shortAnswer:
      "A Promise represents a value that will be available later. It is pending, then either fulfilled with a value or rejected with an error — and once settled it never changes. You consume it with `.then/.catch/.finally`. `async/await` is syntax built on Promises that lets you write asynchronous code that reads like synchronous code.",
    detailedAnswer: [
      "A Promise has three states: **pending**, **fulfilled**, **rejected**. `.then` handlers run asynchronously (as microtasks) after the promise settles, and each `.then` returns a **new** promise, which is what makes chaining possible.",
      "An `async` function always returns a Promise. `await` pauses *that function* until the promise settles, then returns the value or throws the rejection — so you handle errors with `try/catch`. The rest of the program keeps running; `await` does not block the thread.",
      "`Promise.all` waits for all (fails fast on the first rejection), `Promise.allSettled` waits for all and reports each result, `Promise.race` takes the first to settle, `Promise.any` takes the first fulfilled.",
      "Run independent requests **in parallel** (`Promise.all`), not with sequential `await`s, unless one depends on the previous.",
    ],
    realWorldExample:
      "A dashboard loads user, orders and notifications. Using `Promise.all([getUser(), getOrders(), getNotifications()])` takes as long as the slowest request instead of the sum of all three.",
    codeExamples: [
      {
        title: "Sequential vs parallel",
        language: "javascript",
        code: `async function loadSlow() {
  const user = await getUser()           // waits
  const orders = await getOrders()       // then waits again
  return { user, orders }
}

async function loadFast() {
  try {
    const [user, orders] = await Promise.all([getUser(), getOrders()])
    return { user, orders }
  } catch (err) {
    console.error("Failed to load", err)
    throw err
  }
}`,
        walkthrough: [
          "`loadSlow` starts the second request only after the first finishes.",
          "`loadFast` starts both at once and waits for both.",
          "If either rejects, `Promise.all` rejects and the `catch` block handles it.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting to return the promise inside `.then`, breaking the chain.",
      "Awaiting independent calls one by one.",
      "No error handling — unhandled rejections.",
      "Using `await` inside `forEach` (it does not wait).",
    ],
    followUps: [
      {
        question:
          "What is the difference between Promise.all and Promise.allSettled?",
      },
      {
        question:
          "In what order do promise callbacks and setTimeout callbacks run?",
        hint: "Microtasks (promises) run before the next macrotask (setTimeout).",
      },
    ],
    answerTips: ["Mention that `await` pauses the function, not the thread."],
    keyPoints: [
      "Pending / fulfilled / rejected",
      "then returns a new promise",
      "async functions return promises",
      "Parallelise with Promise.all",
      "Handle errors",
    ],
    revisionNotes: [
      "async/await = promises with nicer syntax. Parallel with all().",
    ],
    sourceRefs: [
      { label: "MDN: Using Promises", url: `${MDN}/Guide/Using_promises` },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "data-types",
    topic: "Data types",
    difficulty: "easy",
    title:
      "What are the data types in JavaScript? What is the difference between primitives and objects?",
    keywords: [
      "data types",
      "primitive",
      "object",
      "typeof",
      "reference",
      "immutable",
    ],
    interviewerIntent:
      "A warm-up that checks whether you know what is copied by value and what by reference.",
    shortAnswer:
      "JavaScript has seven primitive types: string, number, bigint, boolean, undefined, null and symbol. Everything else is an object, including arrays, functions and dates. Primitives are immutable and compared by value. Objects are compared by reference, so two objects with identical contents are not equal.",
    detailedAnswer: [
      "Primitives hold a single immutable value. Calling a method such as `toUpperCase()` returns a new string, it never changes the original.",
      "Variables holding objects store a reference. Assigning an object to another variable copies the reference, so both variables point to the same object.",
      '`typeof` reports the type of a primitive, but `typeof null` is `"object"`, a historical quirk, and `typeof` of a function is `"function"`.',
      'Use `Array.isArray` to detect arrays, because `typeof []` is also `"object"`.',
    ],
    realWorldExample:
      "A React state update that mutates an array in place does not trigger a re-render, because the reference is unchanged. Creating a new array gives React a different reference to compare.",
    codeExamples: [
      {
        title: "Value versus reference",
        language: "javascript",
        code: `let a = "hi"
let b = a
b = "bye"
console.log(a) // "hi"

const x = { n: 1 }
const y = x
y.n = 2
console.log(x.n)            // 2 - same object
console.log({ n: 1 } === { n: 1 }) // false - different references
console.log(typeof null)    // "object"`,
        walkthrough: [
          "Strings are primitives, so `b = a` copies the value and later changes to `b` do not affect `a`.",
          "`y = x` copies the reference, so changing `y.n` changes the one shared object.",
          "Two separate object literals are never equal, even if their contents match.",
          "`typeof null` returning `object` is a long-standing quirk, not a sign that null is an object.",
        ],
      },
    ],
    commonMistakes: [
      "Saying `null` is an object.",
      "Comparing objects or arrays with `===` and expecting a content comparison.",
      "Forgetting that `bigint` and `symbol` are also primitives.",
    ],
    followUps: [
      {
        question: "How do you check whether a value is an array?",
        hint: "Array.isArray.",
      },
      { question: "Why does `0.1 + 0.2 !== 0.3`?" },
    ],
    answerTips: [
      "List the seven primitives, then immediately explain value versus reference with a tiny example.",
    ],
    keyPoints: [
      "7 primitives, the rest are objects",
      "Primitives are immutable, compared by value",
      "Objects are compared by reference",
      'typeof null is "object"',
    ],
    revisionNotes: ["Seven primitives; objects are references."],
    sourceRefs: [
      {
        label: "MDN: JavaScript data types and data structures",
        url: `${MDN}/Guide/Data_structures`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "null-vs-undefined",
    topic: "Data types",
    difficulty: "easy",
    title: "What is the difference between null and undefined?",
    keywords: ["null", "undefined", "typeof", "default parameters", "nullish"],
    interviewerIntent:
      "Checks whether you treat missing values deliberately instead of by guesswork.",
    shortAnswer:
      "`undefined` means a value has not been assigned: an uninitialised variable, a missing property or a function with no return. `null` is an explicit value that means there is intentionally no value. They are loosely equal with `==` but not strictly equal, and `typeof null` is `object` while `typeof undefined` is `undefined`.",
    detailedAnswer: [
      "JavaScript itself produces `undefined` for missing things. You normally assign `null` yourself to say that something is empty on purpose.",
      "Default parameter values apply only to `undefined`, not to `null`. Passing `null` keeps `null`.",
      "`JSON.stringify` drops properties whose value is `undefined` but keeps `null`.",
      "To test for either, use `value == null` or the nullish operators `?.` and `??`.",
    ],
    realWorldExample:
      "An API response where `middleName: null` means the user has no middle name, while a missing `middleName` key means the server did not send that field at all.",
    codeExamples: [
      {
        title: "Defaults only fire for undefined",
        language: "javascript",
        code: `function greet(name = "friend") {
  return "Hello " + name
}
console.log(greet(undefined)) // Hello friend
console.log(greet(null))      // Hello null

console.log(null == undefined)  // true
console.log(null === undefined) // false
console.log(JSON.stringify({ a: undefined, b: null })) // {"b":null}`,
        walkthrough: [
          "`undefined` triggers the default parameter, so the name becomes `friend`.",
          "`null` is a real value, so the default is not used and the output prints `null`.",
          "Loose equality treats the two as equal, strict equality does not.",
          "JSON serialisation skips `undefined` properties but keeps `null`.",
        ],
      },
    ],
    commonMistakes: [
      "Using `null` and `undefined` interchangeably without a convention.",
      "Assuming a default parameter handles `null`.",
    ],
    followUps: [
      {
        question:
          "What does the `??` operator do and how is it different from `||`?",
      },
    ],
    answerTips: [
      "Say who produces each: the engine produces undefined, the developer assigns null.",
    ],
    keyPoints: [
      "undefined = not assigned",
      "null = intentional empty",
      "== treats them equal, === does not",
      "Defaults apply only to undefined",
    ],
    revisionNotes: ["undefined is missing, null is empty on purpose."],
    sourceRefs: [
      { label: "MDN: null", url: `${MDN}/Reference/Operators/null` },
      {
        label: "MDN: undefined",
        url: `${MDN}/Reference/Global_Objects/undefined`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "this-keyword",
    topic: "Functions",
    difficulty: "medium",
    title: "How does the this keyword work in JavaScript?",
    keywords: [
      "this",
      "call site",
      "method",
      "new",
      "arrow function",
      "strict mode",
    ],
    interviewerIntent:
      "`this` is a classic source of bugs. Interviewers want to see that you reason from how a function is called.",
    shortAnswer:
      "For regular functions, `this` is decided by how the function is called, not where it is written. A method call uses the object before the dot, a plain call gives `undefined` in strict mode, `new` creates a fresh object, and `call`, `apply` or `bind` set it explicitly. Arrow functions have no own `this` and use the one from the surrounding scope.",
    detailedAnswer: [
      "Method call: `user.greet()` sets `this` to `user`.",
      "Plain call: `greet()` has `this` as `undefined` in strict mode and modules, and as the global object in sloppy mode.",
      "Detaching a method loses its `this`: `const f = user.greet; f()` no longer points to `user`.",
      "Arrow functions capture `this` lexically, which is why they are convenient for callbacks inside methods.",
    ],
    realWorldExample:
      "A class method passed as an event handler loses its `this`, so the handler cannot read instance fields. Binding it in the constructor or using an arrow function fixes it.",
    codeExamples: [
      {
        title: "Losing and fixing this",
        language: "javascript",
        code: `const user = {
  name: "Asha",
  greet() { return "Hi " + this.name },
  later() { setTimeout(() => console.log(this.name), 0) },
}
console.log(user.greet()) // Hi Asha
const f = user.greet
// f() would not see user - this is not user any more
const g = user.greet.bind(user)
console.log(g())          // Hi Asha
user.later()              // Asha - arrow keeps this`,
        walkthrough: [
          "Calling `user.greet()` makes `this` equal to `user`.",
          "Copying the method into `f` removes the object before the dot, so `this` is lost.",
          "`bind(user)` returns a new function that always uses `user` as `this`.",
          "The arrow function inside `later` takes `this` from `later`, so it still points to `user`.",
        ],
      },
    ],
    commonMistakes: [
      "Using an arrow function as an object method and expecting `this` to be the object.",
      "Passing `obj.method` as a callback without binding.",
    ],
    followUps: [
      { question: "What is the difference between call, apply and bind?" },
    ],
    answerTips: [
      "Walk through the four binding rules in order: new, explicit, method call, default.",
    ],
    keyPoints: [
      "Decided by the call site",
      "Method call uses the object before the dot",
      "Arrow functions use outer this",
      "bind returns a new function",
    ],
    revisionNotes: ["this = how it is called, except arrow functions."],
    sourceRefs: [
      { label: "MDN: this", url: `${MDN}/Reference/Operators/this` },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "call-apply-bind",
    topic: "Functions",
    difficulty: "medium",
    title: "What is the difference between call, apply and bind?",
    keywords: ["call", "apply", "bind", "this", "partial application"],
    interviewerIntent:
      "Tests whether you can control `this` explicitly and know which method runs immediately.",
    shortAnswer:
      "All three set `this` for a function. `call` invokes the function immediately with arguments listed one by one. `apply` invokes it immediately with arguments in an array. `bind` does not invoke it: it returns a new function with `this`, and optionally some arguments, permanently fixed.",
    detailedAnswer: [
      "`fn.call(thisArg, a, b)` and `fn.apply(thisArg, [a, b])` differ only in how the arguments are passed.",
      "`bind` is useful when you need a function to run later, for example as an event handler or callback.",
      "`bind` can also do partial application by presetting leading arguments.",
      "A bound function cannot be re-bound to another `this`, and arrow functions ignore these methods for `this`.",
    ],
    realWorldExample:
      "Borrowing a method: `Math.max.apply(null, numbers)` was the old way to spread an array into arguments. Today you would write `Math.max(...numbers)`.",
    codeExamples: [
      {
        title: "Three ways to set this",
        language: "javascript",
        code: `function intro(city, country) {
  return this.name + " from " + city + ", " + country
}
const person = { name: "Ravi" }

console.log(intro.call(person, "Pune", "India"))
console.log(intro.apply(person, ["Pune", "India"]))
const bound = intro.bind(person, "Pune")
console.log(bound("India"))`,
        walkthrough: [
          "`call` runs `intro` now with `this` set to `person` and arguments passed separately.",
          "`apply` does the same but takes the arguments as one array.",
          "`bind` returns a new function and presets `this` and the first argument.",
          "Calling `bound` supplies the remaining argument.",
        ],
      },
    ],
    commonMistakes: [
      "Thinking `bind` runs the function.",
      "Trying to change `this` of an arrow function with `call`.",
    ],
    followUps: [{ question: "How would you implement your own bind?" }],
    answerTips: ["A memory hook: Call = Comma separated, Apply = Array."],
    keyPoints: [
      "call and apply invoke immediately",
      "apply takes an array",
      "bind returns a new function",
      "Arrow functions ignore the this you pass",
    ],
    revisionNotes: ["call, apply run now; bind returns a function."],
    sourceRefs: [
      {
        label: "MDN: Function.prototype.call",
        url: `${MDN}/Reference/Global_Objects/Function/call`,
      },
      {
        label: "MDN: Function.prototype.bind",
        url: `${MDN}/Reference/Global_Objects/Function/bind`,
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "event-loop",
    topic: "Asynchronous JavaScript",
    difficulty: "medium",
    title: "How does the JavaScript event loop work?",
    keywords: [
      "event loop",
      "call stack",
      "microtask",
      "macrotask",
      "setTimeout",
      "promise",
    ],
    interviewerIntent:
      "This is the standard question for understanding async behaviour and predicting output order.",
    shortAnswer:
      "JavaScript runs one piece of code at a time on a single call stack. Asynchronous work such as timers and network calls is handled by the host environment, which queues the callback when it is ready. The event loop moves callbacks onto the stack only when it is empty, and it runs all promise callbacks, the microtasks, before the next timer or event task.",
    detailedAnswer: [
      "Synchronous code runs to completion first. Nothing else can interrupt it, so a long loop freezes the page.",
      "Timers, I/O and DOM events place their callbacks in the task queue, also called the macrotask queue.",
      "Promise reactions and `queueMicrotask` use the microtask queue. After the current script or task finishes, the engine empties the microtask queue completely before taking the next task.",
      "That is why a resolved promise callback runs before a `setTimeout` with a delay of 0.",
    ],
    realWorldExample:
      "A heavy synchronous calculation in a click handler blocks rendering and other events. Splitting the work or moving it to a Web Worker keeps the page responsive.",
    codeExamples: [
      {
        title: "Order of output",
        language: "javascript",
        code: `console.log("1")
setTimeout(() => console.log("2"), 0)
Promise.resolve().then(() => console.log("3"))
console.log("4")
// Output: 1, 4, 3, 2`,
        walkthrough: [
          "`1` and `4` are synchronous, so they print first in order.",
          "The timer callback goes to the task queue.",
          "The promise callback goes to the microtask queue.",
          "After the script ends, microtasks run first, so `3` prints before `2`.",
        ],
      },
    ],
    diagram: {
      kind: "flow",
      title: "One turn of the event loop",
      steps: [
        {
          label: "Run script on the call stack",
          detail: "Synchronous code runs to completion.",
        },
        {
          label: "Drain the microtask queue",
          detail: "Promise callbacks and queueMicrotask.",
        },
        { label: "Render if needed", detail: "The browser may paint here." },
        {
          label: "Take the next task",
          detail: "A timer, an event or I/O callback.",
        },
      ],
    },
    commonMistakes: [
      "Saying JavaScript is multithreaded.",
      "Believing `setTimeout(fn, 0)` runs immediately.",
      "Forgetting that microtasks run before the next macrotask.",
    ],
    followUps: [
      {
        question:
          "What happens if a microtask keeps scheduling more microtasks?",
        hint: "It can starve rendering and timers.",
      },
      { question: "Where do async/await continuations run?" },
    ],
    answerTips: [
      "Use the 1, 4, 3, 2 example. It shows you can predict order, not only recite terms.",
    ],
    keyPoints: [
      "Single thread, one call stack",
      "Host handles async work",
      "Microtasks before next task",
      "Long sync code blocks everything",
    ],
    revisionNotes: ["Stack, then microtasks, then next task."],
    sourceRefs: [
      {
        label: "MDN: The event loop",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
      },
    ],
    estimatedMinutes: 6,
  },
  {
    slug: "prototype-chain",
    topic: "Objects & prototypes",
    difficulty: "medium",
    title:
      "What is the prototype chain and how does prototypal inheritance work?",
    keywords: [
      "prototype",
      "prototype chain",
      "inheritance",
      "Object.create",
      "__proto__",
    ],
    interviewerIntent:
      "Checks that you understand what `class` is built on and how property lookup really works.",
    shortAnswer:
      "Every object has an internal link to another object called its prototype. When you read a property that the object does not have, JavaScript looks at the prototype, then the prototype's prototype, and so on until it reaches `null`. This chain of lookups is prototypal inheritance, and the `class` syntax is built on top of it.",
    detailedAnswer: [
      "Properties set on the object itself are own properties. Anything found further up the chain is inherited.",
      "Array methods such as `map` live on `Array.prototype`, which is why every array can use them.",
      "Writing a property always creates or changes an own property; it does not modify the prototype.",
      "Use `Object.getPrototypeOf(obj)` instead of the legacy `__proto__`, and `Object.hasOwn(obj, key)` to test for own properties.",
    ],
    realWorldExample:
      "Adding a method to a constructor's `prototype` shares a single function between thousands of instances, rather than creating a copy per instance.",
    codeExamples: [
      {
        title: "Lookup through the chain",
        language: "javascript",
        code: `const animal = { eats: true }
const dog = Object.create(animal)
dog.barks = true

console.log(dog.barks)         // true  (own)
console.log(dog.eats)          // true  (inherited)
console.log(Object.hasOwn(dog, "eats")) // false
console.log(Object.getPrototypeOf(dog) === animal) // true`,
        walkthrough: [
          "`Object.create(animal)` makes a new object whose prototype is `animal`.",
          "`barks` is found directly on `dog`.",
          "`eats` is not on `dog`, so JavaScript finds it on `animal`.",
          "`hasOwn` confirms that `eats` is inherited, not an own property.",
        ],
      },
    ],
    commonMistakes: [
      "Confusing an object's prototype with a function's `prototype` property.",
      "Thinking `class` introduces a different inheritance model.",
    ],
    followUps: [
      {
        question:
          "What is the difference between a constructor function and a class?",
      },
    ],
    answerTips: [
      "Draw the chain: dog, then animal, then Object.prototype, then null.",
    ],
    keyPoints: [
      "Lookup walks the chain up to null",
      "Writes create own properties",
      "Methods are shared via the prototype",
      "class is syntactic sugar",
    ],
    revisionNotes: ["Not found here? Ask the prototype."],
    sourceRefs: [
      {
        label: "MDN: Inheritance and the prototype chain",
        url: `${MDN}/Guide/Inheritance_and_the_prototype_chain`,
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "destructuring",
    topic: "ES6 syntax",
    difficulty: "easy",
    title:
      "What is destructuring in JavaScript? Show array and object examples.",
    keywords: ["destructuring", "default values", "rename", "nested", "swap"],
    interviewerIntent:
      "A daily-use ES6 feature. Interviewers check that you can use defaults, renaming and nesting.",
    shortAnswer:
      "Destructuring unpacks values from arrays or properties from objects into separate variables in one statement. Arrays are matched by position and objects by property name. You can set default values, rename variables, skip items and destructure directly in function parameters.",
    detailedAnswer: [
      "Array destructuring: `const [first, , third] = list` reads by position.",
      "Object destructuring: `const { name, age } = user` reads by key. Rename with `{ name: userName }`.",
      'Defaults apply only when the value is `undefined`: `const { role = "guest" } = user`.',
      "It works in parameters, so `function Card({ title, price })` documents what the function needs.",
    ],
    realWorldExample:
      "React hooks return arrays, so `const [count, setCount] = useState(0)` uses array destructuring and lets you pick any names.",
    codeExamples: [
      {
        title: "Common patterns",
        language: "javascript",
        code: `const user = { name: "Meera", address: { city: "Delhi" } }
const { name, role = "guest", address: { city } } = user
console.log(name, role, city) // Meera guest Delhi

let a = 1, b = 2
;[a, b] = [b, a]
console.log(a, b) // 2 1

const [first, ...rest] = [10, 20, 30]
console.log(first, rest) // 10 [20, 30]`,
        walkthrough: [
          "`name` is read from the object, `role` falls back to its default, and `city` comes from the nested object.",
          "Swapping two variables needs no temporary variable.",
          "The rest element collects the remaining items into a new array.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting defaults to apply to `null`.",
      "Destructuring `null` or `undefined`, which throws a TypeError.",
    ],
    followUps: [
      { question: "What is the difference between rest and spread?" },
    ],
    answerTips: [
      "Mention useState as a familiar array example and function parameters as the object example.",
    ],
    keyPoints: [
      "Arrays by position, objects by name",
      "Defaults for undefined",
      "Rename with a colon",
      "Works in parameters",
    ],
    revisionNotes: ["Unpack now, name as you like."],
    sourceRefs: [
      {
        label: "MDN: Destructuring",
        url: `${MDN}/Reference/Operators/Destructuring`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "spread-vs-rest",
    topic: "ES6 syntax",
    difficulty: "easy",
    title: "What is the difference between the spread and rest operators?",
    keywords: ["spread", "rest", "three dots", "copy", "arguments"],
    interviewerIntent:
      "Both use the same `...` syntax. Interviewers check that you know which one expands and which one collects.",
    shortAnswer:
      "Both are written `...`. Spread expands an iterable or object into individual items, for example in a function call, an array literal or an object literal. Rest does the opposite: it collects the remaining items into an array in function parameters, or into an object when destructuring. Spread copies are shallow.",
    detailedAnswer: [
      "Spread in calls: `Math.max(...numbers)`. Spread in arrays: `[...a, ...b]`. Spread in objects: `{ ...defaults, ...overrides }`.",
      "Rest in parameters: `function sum(...nums)` gives a real array, unlike the old `arguments` object.",
      "Rest in destructuring: `const [head, ...tail] = list` or `const { id, ...others } = obj`.",
      "Spread creates a shallow copy. Nested objects are still shared between the original and the copy.",
    ],
    realWorldExample:
      "Immutable state updates in React and Redux use object spread: `{ ...state, loading: false }` creates a new object with one field changed.",
    codeExamples: [
      {
        title: "Spread and rest side by side",
        language: "javascript",
        code: `const base = { theme: "dark", size: "m" }
const next = { ...base, size: "l" }       // spread
console.log(next) // { theme: "dark", size: "l" }

function total(first, ...others) {         // rest
  return others.reduce((s, n) => s + n, first)
}
console.log(total(1, 2, 3, 4)) // 10

const { theme, ...remaining } = next       // rest in destructuring
console.log(remaining) // { size: "l" }`,
        walkthrough: [
          "Spread copies the properties of `base` into a new object, and the later `size` wins.",
          "Rest in the parameter list gathers every argument after the first into an array.",
          "Rest in destructuring collects the properties that were not named.",
        ],
      },
    ],
    commonMistakes: [
      "Believing spread makes a deep copy.",
      "Putting rest anywhere except last.",
    ],
    followUps: [{ question: "How do you make a deep copy of an object?" }],
    answerTips: ["Say it in one line: spread expands, rest collects."],
    keyPoints: [
      "Same syntax, opposite jobs",
      "Spread = expand",
      "Rest = collect, always last",
      "Spread copies are shallow",
    ],
    revisionNotes: ["Spread out, rest in."],
    sourceRefs: [
      {
        label: "MDN: Spread syntax",
        url: `${MDN}/Reference/Operators/Spread_syntax`,
      },
      {
        label: "MDN: Rest parameters",
        url: `${MDN}/Reference/Functions/rest_parameters`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "es-modules-vs-commonjs",
    topic: "Modules",
    difficulty: "medium",
    title: "What is the difference between ES modules and CommonJS?",
    keywords: [
      "ES modules",
      "CommonJS",
      "import",
      "require",
      "export",
      "module.exports",
    ],
    interviewerIntent:
      "Frontend and Node.js work both involve modules, so interviewers check that you know the two systems.",
    shortAnswer:
      "ES modules use `import` and `export`, are part of the language standard, are statically analysable and load asynchronously. CommonJS, used by older Node.js code, uses `require` and `module.exports` and loads synchronously at runtime. ES module imports are live bindings, while `require` gives you the exported value as it was at that moment.",
    detailedAnswer: [
      "Because `import` statements are static, bundlers can remove unused exports, which is called tree shaking.",
      "ES modules run in strict mode, have their own scope, and support top-level `await`.",
      'In Node.js a file is treated as an ES module if it ends in `.mjs` or the nearest package.json has `"type": "module"`.',
      "Dynamic `import()` loads a module on demand and returns a promise, which is how code splitting works.",
    ],
    realWorldExample:
      "A Vite or Next.js app uses ES modules and `import()` to split each page into its own chunk, loaded only when the user opens that route.",
    codeExamples: [
      {
        title: "Same idea in both systems",
        language: "javascript",
        code: `// ES module
export const add = (a, b) => a + b
export default function greet() { return "hi" }
// import greet, { add } from "./math.js"

// CommonJS
// module.exports = { add: (a, b) => a + b }
// const { add } = require("./math")`,
        walkthrough: [
          "ES modules use named exports and one optional default export.",
          "`import` statements are resolved before the code runs.",
          "CommonJS assigns whatever you want to export to `module.exports`.",
          "`require` is an ordinary function call that runs when execution reaches it.",
        ],
      },
    ],
    commonMistakes: [
      "Mixing `require` and `import` in one file without configuration.",
      "Forgetting the file extension in Node.js ES module imports.",
    ],
    followUps: [
      { question: "What is tree shaking and why does it need static imports?" },
    ],
    answerTips: [
      "Mention bundlers and tree shaking to show practical knowledge, not just syntax.",
    ],
    keyPoints: [
      "import/export are standard and static",
      "require/module.exports are CommonJS",
      "ESM supports tree shaking",
      "import() loads lazily",
    ],
    revisionNotes: ["Static import vs runtime require."],
    sourceRefs: [
      { label: "MDN: JavaScript modules", url: `${MDN}/Guide/Modules` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "shallow-vs-deep-copy",
    topic: "Objects & prototypes",
    difficulty: "medium",
    title:
      "What is the difference between a shallow copy and a deep copy? How do you deep clone an object?",
    keywords: [
      "shallow copy",
      "deep copy",
      "structuredClone",
      "JSON",
      "spread",
      "reference",
    ],
    interviewerIntent:
      "Checks whether you understand shared references, a common source of state bugs.",
    shortAnswer:
      "A shallow copy duplicates only the top level, so nested objects are still shared between the original and the copy. A deep copy duplicates every level. Spread, `Object.assign` and `slice` are shallow. For a deep copy use `structuredClone`, which handles most built-in types, rather than the JSON round trip, which loses functions, undefined values and dates.",
    detailedAnswer: [
      "After `const copy = { ...obj }`, changing `copy.address.city` also changes `obj.address.city` because `address` is the same object.",
      "`structuredClone(value)` is built into modern browsers and Node.js. It handles dates, maps, sets and circular references, but it throws on functions.",
      "`JSON.parse(JSON.stringify(x))` turns dates into strings and drops functions, `undefined` and symbols, and it fails on circular references.",
      "Often you do not need a deep copy. Copy only the path you change, which is what immutable updates do.",
    ],
    realWorldExample:
      "A form editor copies a saved record to hold unsaved edits. A shallow copy lets edits to a nested list leak into the saved record, so the editor must clone the nested parts too.",
    codeExamples: [
      {
        title: "Shared nested object",
        language: "javascript",
        code: `const original = { name: "Kiran", address: { city: "Pune" } }

const shallow = { ...original }
shallow.address.city = "Mumbai"
console.log(original.address.city) // "Mumbai" - shared

const deep = structuredClone(original)
deep.address.city = "Delhi"
console.log(original.address.city) // "Mumbai" - unchanged`,
        walkthrough: [
          "The spread copy has its own top-level object but points to the same `address` object.",
          "Changing the nested city through the copy changes the original too.",
          "`structuredClone` copies the nested object as well.",
          "Changing the deep copy leaves the original unchanged.",
        ],
      },
    ],
    commonMistakes: [
      "Assuming spread or Object.assign copies nested objects.",
      "Using JSON round trip on data that contains dates or undefined.",
    ],
    followUps: [
      {
        question: "Which values can structuredClone not copy?",
        hint: "Functions and some host objects.",
      },
    ],
    answerTips: [
      "Always demonstrate with a nested object, since a flat example hides the problem.",
    ],
    keyPoints: [
      "Shallow copies share nested references",
      "Spread and Object.assign are shallow",
      "structuredClone is the built-in deep copy",
      "JSON round trip has data loss",
    ],
    revisionNotes: ["Spread is one level deep."],
    sourceRefs: [
      {
        label: "MDN: structuredClone",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "truthy-and-falsy",
    topic: "Type coercion",
    difficulty: "easy",
    title: "What are truthy and falsy values in JavaScript?",
    keywords: ["truthy", "falsy", "coercion", "boolean", "NaN"],
    interviewerIntent:
      "Checks that you know exactly which values count as false in conditions, because wrong assumptions cause real bugs.",
    shortAnswer:
      'In a condition JavaScript converts a value to a boolean. The falsy values are false, 0, -0, 0n, the empty string, null, undefined and NaN. Everything else is truthy, including the strings "0" and "false", empty arrays and empty objects.',
    detailedAnswer: [
      "The list of falsy values is short and fixed, so memorise it. Anything not on the list is truthy.",
      "`if (items.length)` is a common idiom but `if (count)` is a bug when `0` is a valid value.",
      "`!!value` or `Boolean(value)` converts a value to an explicit boolean.",
      "`||` returns the first truthy operand, which is why `0 || 10` gives `10`. Use `??` when only null and undefined should trigger the fallback.",
    ],
    realWorldExample:
      "A quantity field with value `0` is hidden by `{quantity && <Badge />}` in React because `0` is falsy and gets rendered as the text 0. Comparing `quantity > 0` avoids it.",
    codeExamples: [
      {
        title: "Which of these are truthy?",
        language: "javascript",
        code: `const values = [0, "", "0", [], {}, null, undefined, NaN, -1]
values.forEach((v) => console.log(JSON.stringify(v), Boolean(v)))
// 0 false, "" false, "0" true, [] true, {} true,
// null false, undefined false, NaN false, -1 true`,
        walkthrough: [
          "`0`, the empty string, `null`, `undefined` and `NaN` are falsy.",
          "The string `0` is not empty, so it is truthy.",
          "Empty arrays and objects are still objects, so they are truthy.",
          "Negative numbers are truthy because only zero is falsy.",
        ],
      },
    ],
    commonMistakes: [
      "Assuming an empty array is falsy.",
      "Using `||` for defaults when `0` or an empty string is valid.",
    ],
    followUps: [{ question: "How is `??` different from `||`?" }],
    answerTips: [
      "List the eight falsy values from memory, and mention the empty array trap.",
    ],
    keyPoints: [
      "Eight falsy values",
      "Everything else is truthy",
      "Empty array and object are truthy",
      "Use ?? for null or undefined only",
    ],
    revisionNotes: ["false, 0, -0, 0n, empty string, null, undefined, NaN."],
    sourceRefs: [
      {
        label: "MDN: Falsy",
        url: "https://developer.mozilla.org/en-US/docs/Glossary/Falsy",
      },
      {
        label: "MDN: Truthy",
        url: "https://developer.mozilla.org/en-US/docs/Glossary/Truthy",
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "optional-chaining-nullish",
    topic: "ES6 syntax",
    difficulty: "easy",
    title:
      "What are optional chaining (?.) and the nullish coalescing operator (??)?",
    keywords: [
      "optional chaining",
      "nullish coalescing",
      "??",
      "?.",
      "default value",
    ],
    interviewerIntent:
      "Checks modern JavaScript fluency and the difference between `??` and `||`.",
    shortAnswer:
      "Optional chaining `?.` stops evaluating and returns `undefined` if the value before it is null or undefined, instead of throwing a TypeError. The nullish coalescing operator `??` returns its right side only when the left side is null or undefined, so valid values like `0` and the empty string are kept, unlike `||`.",
    detailedAnswer: [
      "`user?.address?.city` is safe even when `user` or `address` is missing.",
      "`?.` also works for calls and indexes: `callback?.()` and `list?.[0]`.",
      "`??` is for defaults: `const port = config.port ?? 3000` keeps `0` as a valid port value, while `||` would replace it.",
      "Mixing `??` with `||` or `&&` without parentheses is a syntax error.",
    ],
    realWorldExample:
      'Rendering data from an API that may be loading: `data?.user?.name ?? "Guest"` avoids crashes before the data arrives.',
    codeExamples: [
      {
        title: "Safe access and defaults",
        language: "javascript",
        code: `const user = { profile: null, visits: 0 }

console.log(user.profile?.name)        // undefined, no error
console.log(user.visits || 5)          // 5  (0 is falsy)
console.log(user.visits ?? 5)          // 0  (0 is kept)
console.log(user.settings?.theme ?? "light") // light`,
        walkthrough: [
          "`profile` is null, so `?.` returns undefined instead of throwing.",
          "`||` replaces the valid value `0` because zero is falsy.",
          "`??` keeps `0` because it only reacts to null or undefined.",
          "The two operators combine well for safe reads with a default.",
        ],
      },
    ],
    commonMistakes: [
      "Using `||` for defaults and losing `0`, `false` or the empty string.",
      "Overusing `?.` and hiding data that should always exist.",
    ],
    followUps: [
      {
        question:
          "Can you use optional chaining on the left side of an assignment?",
        hint: "No.",
      },
    ],
    answerTips: [
      "Use the `0 || 5` versus `0 ?? 5` example to make the difference concrete.",
    ],
    keyPoints: [
      "?. short-circuits on null or undefined",
      "?? defaults only for null or undefined",
      "|| defaults for any falsy value",
      "Do not mix ?? and || without parentheses",
    ],
    revisionNotes: ["?. avoids crashes, ?? keeps real zeros."],
    sourceRefs: [
      {
        label: "MDN: Optional chaining",
        url: `${MDN}/Reference/Operators/Optional_chaining`,
      },
      {
        label: "MDN: Nullish coalescing",
        url: `${MDN}/Reference/Operators/Nullish_coalescing`,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    slug: "event-bubbling-delegation",
    topic: "DOM & events",
    difficulty: "medium",
    title: "What is event bubbling and event delegation?",
    keywords: [
      "event bubbling",
      "event delegation",
      "capturing",
      "stopPropagation",
      "event.target",
    ],
    interviewerIntent:
      "Tests DOM event knowledge and whether you can reduce listeners in dynamic lists.",
    shortAnswer:
      "When an event happens on an element, it first travels down from the document to the target (capturing) and then bubbles back up through the parents. Event delegation uses this: you attach one listener to a parent and use `event.target` to find which child triggered it. That saves listeners and also works for elements added later.",
    detailedAnswer: [
      "`addEventListener` listens in the bubbling phase by default. Pass `true` or `{ capture: true }` to listen during capturing.",
      "`event.target` is the element that was actually clicked, and `event.currentTarget` is the element the listener is attached to.",
      'Use `event.target.closest("li")` or `matches` to handle clicks on nested elements safely.',
      "`stopPropagation()` stops the event from travelling further, but use it sparingly because it breaks other listeners that rely on bubbling.",
    ],
    realWorldExample:
      "A todo list with a thousand items uses one click listener on the `ul` to handle every delete button, including items added after the page loaded.",
    codeExamples: [
      {
        title: "One listener for a whole list",
        language: "javascript",
        code: `const list = document.querySelector("#todos")

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-delete]")
  if (!button || !list.contains(button)) return
  button.closest("li").remove()
})`,
        walkthrough: [
          "A single listener is attached to the parent list.",
          "`closest` finds the delete button even if the click landed on an icon inside it.",
          "The guard ignores clicks that did not come from a delete button.",
          "New items work automatically because the listener lives on the parent.",
        ],
      },
    ],
    commonMistakes: [
      "Confusing `target` and `currentTarget`.",
      "Adding a listener to every child in a long list.",
      "Assuming every event bubbles. `focus` and `blur` do not.",
    ],
    followUps: [
      {
        question: "Which events do not bubble, and what can you use instead?",
        hint: "focusin and focusout.",
      },
    ],
    answerTips: [
      "Describe capture, target and bubble phases in order, then give the list example.",
    ],
    keyPoints: [
      "Capture, then target, then bubble",
      "Delegation = one listener on the parent",
      "target vs currentTarget",
      "Works for dynamic elements",
    ],
    revisionNotes: ["Events bubble up, so listen at the parent."],
    sourceRefs: [
      {
        label: "MDN: EventTarget.addEventListener",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "debounce-vs-throttle",
    topic: "Asynchronous JavaScript",
    difficulty: "medium",
    title:
      "What is the difference between debounce and throttle? How would you implement debounce?",
    keywords: ["debounce", "throttle", "setTimeout", "closure", "performance"],
    interviewerIntent:
      "A very common coding question that combines closures, timers and practical performance thinking.",
    shortAnswer:
      "Debounce delays a function until the calls have stopped for a set time, so it runs once after the last call. Throttle lets a function run at most once per time interval, however often it is called. Use debounce for search-as-you-type and throttle for scroll or resize handlers.",
    detailedAnswer: [
      "A debounce keeps a timer in a closure. Every call clears the old timer and starts a new one, so only the final call in a burst fires.",
      "A throttle remembers the last run time and ignores calls until the interval has passed.",
      "Both reduce the work done by high-frequency events such as typing, scrolling and resizing.",
      "In React, remember to keep the debounced function stable between renders, for example with `useMemo` or `useRef`, otherwise each render creates a fresh timer.",
    ],
    realWorldExample:
      "A search box calls the API only after the user pauses typing for 300 ms, instead of sending one request for every keystroke.",
    codeExamples: [
      {
        title: "A simple debounce",
        language: "javascript",
        code: `function debounce(fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

const onSearch = debounce((text) => console.log("search", text), 300)
onSearch("r"); onSearch("re"); onSearch("rea") // logs once: search rea`,
        walkthrough: [
          "`timer` lives in the closure, so it is remembered between calls.",
          "Each call cancels the previous timer.",
          "Only the last call survives for the full delay, then runs the original function.",
          "`apply` forwards `this` and the arguments to the original function.",
        ],
      },
    ],
    commonMistakes: [
      "Mixing up the two names.",
      "Creating a new debounced function on every React render.",
      "Not clearing the previous timer.",
    ],
    followUps: [
      { question: "How would you add a leading-edge option to debounce?" },
    ],
    answerTips: [
      "Give the two real examples, search input and scroll handler, before showing code.",
    ],
    keyPoints: [
      "Debounce = wait until calls stop",
      "Throttle = at most once per interval",
      "Uses a closure and a timer",
      "Keep it stable in React",
    ],
    revisionNotes: ["Debounce waits, throttle paces."],
    sourceRefs: [
      {
        label: "MDN: setTimeout",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout",
      },
    ],
    estimatedMinutes: 5,
  },
  {
    slug: "web-storage-and-cookies",
    topic: "Browser APIs",
    difficulty: "easy",
    title:
      "What is the difference between localStorage, sessionStorage and cookies?",
    keywords: [
      "localStorage",
      "sessionStorage",
      "cookies",
      "web storage",
      "HttpOnly",
    ],
    interviewerIntent:
      "Checks that you can choose browser storage sensibly and know the security implications.",
    shortAnswer:
      "localStorage keeps string key-value data for an origin until it is cleared, and survives closing the browser. sessionStorage is the same API but lasts only for that tab's session. Cookies are small, can expire, and are sent to the server with matching requests. Server-set cookies can be marked HttpOnly so scripts cannot read them.",
    detailedAnswer: [
      "Web storage is synchronous, stores only strings, and is limited to the same origin. The limit is roughly 5 MB per origin in most browsers.",
      "Cookies are sent automatically with requests to their domain, so they suit sessions, but they also add to every request's size.",
      "Anything in localStorage or a non-HttpOnly cookie can be read by any script on the page, including injected ones. Avoid storing sensitive tokens there.",
      "For larger or structured data on the client, IndexedDB is the better choice.",
    ],
    realWorldExample:
      "A theme preference goes in localStorage so it survives restarts, a draft form can use sessionStorage, and a login session uses an HttpOnly cookie set by the server.",
    codeExamples: [
      {
        title: "Using web storage",
        language: "javascript",
        code: `localStorage.setItem("theme", "dark")
console.log(localStorage.getItem("theme")) // "dark"

const prefs = { fontSize: 16 }
localStorage.setItem("prefs", JSON.stringify(prefs))
const saved = JSON.parse(localStorage.getItem("prefs") ?? "{}")
console.log(saved.fontSize) // 16

sessionStorage.setItem("step", "2") // gone when the tab closes`,
        walkthrough: [
          "Values are stored as strings under a key.",
          "Objects must be converted with `JSON.stringify` before saving.",
          "Reading back needs `JSON.parse` and a safe fallback for a missing key.",
          "`sessionStorage` has the same API but a shorter lifetime.",
        ],
      },
    ],
    commonMistakes: [
      "Storing authentication tokens in localStorage without considering XSS.",
      "Forgetting that values are strings.",
      "Assuming storage is available, since it can be blocked in private modes.",
    ],
    followUps: [
      {
        question: "What do the HttpOnly, Secure and SameSite cookie flags do?",
      },
    ],
    answerTips: [
      "Compare them on lifetime, size, server visibility and script access.",
    ],
    keyPoints: [
      "localStorage persists, sessionStorage is per tab",
      "Cookies go to the server",
      "Web storage holds strings only",
      "HttpOnly hides cookies from scripts",
    ],
    revisionNotes: ["Lifetime, server, script access."],
    sourceRefs: [
      {
        label: "MDN: Web Storage API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API",
      },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "map-and-set",
    topic: "Data structures",
    difficulty: "easy",
    title:
      "What are Map and Set in JavaScript? How are they different from objects and arrays?",
    keywords: ["Map", "Set", "unique values", "object", "iteration", "keys"],
    interviewerIntent:
      "Checks whether you pick the right built-in collection instead of using plain objects and arrays for everything.",
    shortAnswer:
      "A Map stores key-value pairs where keys can be any type, remembers insertion order and has a `size` property. A plain object only allows string or symbol keys. A Set stores unique values of any type and ignores duplicates. A Set is the quickest way to remove duplicates from an array.",
    detailedAnswer: [
      "Use a Map when keys are not strings, when you add and delete keys often, or when you need the count cheaply.",
      "Objects inherit properties from their prototype, so a key like `toString` can collide. A Map has no such surprise.",
      "Set operations: `add`, `has`, `delete`, `size`. Membership checks are fast.",
      "Both are iterable, so they work with `for...of` and spread.",
    ],
    realWorldExample:
      "Counting word frequency with a Map, and removing duplicate ids from a list with `[...new Set(ids)]`.",
    codeExamples: [
      {
        title: "Map and Set in practice",
        language: "javascript",
        code: `const counts = new Map()
for (const word of ["a", "b", "a"]) {
  counts.set(word, (counts.get(word) ?? 0) + 1)
}
console.log(counts.get("a"), counts.size) // 2 2

const unique = [...new Set([1, 2, 2, 3, 3])]
console.log(unique) // [1, 2, 3]`,
        walkthrough: [
          "`get` returns undefined for a missing key, so `?? 0` supplies the start value.",
          "`set` stores the updated count.",
          "A Set keeps only one copy of each value.",
          "Spread turns the Set back into an array.",
        ],
      },
    ],
    commonMistakes: [
      "Using an object as a dictionary with user-supplied keys.",
      "Expecting two equal objects to count as one Set entry.",
    ],
    followUps: [{ question: "What is a WeakMap and when would you use it?" }],
    answerTips: [
      "Give the deduplicate-an-array one-liner; it is a common use.",
    ],
    keyPoints: [
      "Map keys can be any type",
      "Set keeps unique values",
      "Both preserve insertion order",
      "Both are iterable",
    ],
    revisionNotes: ["Map for any key, Set for uniqueness."],
    sourceRefs: [
      { label: "MDN: Map", url: `${MDN}/Reference/Global_Objects/Map` },
      { label: "MDN: Set", url: `${MDN}/Reference/Global_Objects/Set` },
    ],
    estimatedMinutes: 4,
  },
  {
    slug: "classes-vs-prototypes",
    topic: "Objects & prototypes",
    difficulty: "medium",
    title:
      "How do ES6 classes work in JavaScript? Are they different from constructor functions?",
    keywords: [
      "class",
      "constructor",
      "extends",
      "super",
      "private fields",
      "prototype",
    ],
    interviewerIntent:
      "Checks that you know classes are a cleaner syntax over prototypes and understand inheritance with `super`.",
    shortAnswer:
      "An ES6 class is syntax built over the same prototype system as constructor functions. Methods are placed on the class's prototype, `extends` sets up inheritance and `super` calls the parent. Differences are that a class must be called with `new`, its body runs in strict mode, and class declarations are not usable before they are defined.",
    detailedAnswer: [
      "`constructor` initialises each instance. Methods written in the class body are shared through the prototype, not copied per instance.",
      "`extends` links the child prototype to the parent's. Call `super(...)` before using `this` in a child constructor.",
      "Private fields start with `#`, for example `#balance`, and cannot be accessed outside the class.",
      "`static` members belong to the class itself rather than to instances.",
    ],
    realWorldExample:
      "An `ApiError extends Error` class adds a `status` field so callers can check `error.status` and still get a proper stack trace.",
    codeExamples: [
      {
        title: "A class with inheritance",
        language: "javascript",
        code: `class Account {
  #balance = 0
  deposit(n) { this.#balance += n; return this }
  get balance() { return this.#balance }
}
class Savings extends Account {
  constructor(rate) { super(); this.rate = rate }
}
const s = new Savings(0.04)
console.log(s.deposit(100).balance) // 100
console.log(typeof Account)         // "function"`,
        walkthrough: [
          "`#balance` is a private field that code outside the class cannot read.",
          "`Savings` extends `Account` and calls `super()` before using `this`.",
          "Methods are found through the prototype chain, so `deposit` works on a `Savings` instance.",
          "`typeof Account` is `function`, which shows that classes are built on functions.",
        ],
      },
    ],
    commonMistakes: [
      "Forgetting `super()` in a derived constructor.",
      "Believing classes introduce classical inheritance.",
      "Using arrow functions as class fields without understanding the memory cost per instance.",
    ],
    followUps: [
      {
        question: "What happens if you call a class without new?",
        hint: "It throws a TypeError.",
      },
    ],
    answerTips: [
      "Say it is sugar over prototypes, then list two real differences.",
    ],
    keyPoints: [
      "Syntax over prototypes",
      "extends and super for inheritance",
      "Private fields with #",
      "Must be called with new",
    ],
    revisionNotes: ["class = prototypes with nicer syntax."],
    sourceRefs: [{ label: "MDN: Classes", url: `${MDN}/Reference/Classes` }],
    estimatedMinutes: 5,
  },
  {
    slug: "json-stringify-parse",
    topic: "Browser APIs",
    difficulty: "easy",
    title:
      "What do JSON.stringify and JSON.parse do? What values cannot be serialised?",
    keywords: [
      "JSON",
      "stringify",
      "parse",
      "serialisation",
      "Date",
      "circular reference",
    ],
    interviewerIntent:
      "JSON is the language of APIs. Interviewers check that you know what survives a round trip.",
    shortAnswer:
      "`JSON.stringify` converts a JavaScript value into a JSON string and `JSON.parse` turns a JSON string back into a value. Functions, symbols and `undefined` properties are skipped, dates become ISO strings, `NaN` and `Infinity` become null, and circular references throw a TypeError. Invalid JSON passed to `parse` throws a SyntaxError.",
    detailedAnswer: [
      "Dates are converted by their `toJSON` method, so after `parse` you get a string, not a Date object.",
      "`undefined`, functions and symbols are omitted from objects, and become `null` inside arrays.",
      "`JSON.stringify(value, null, 2)` pretty-prints with two spaces of indentation.",
      "Always wrap `JSON.parse` of untrusted or stored text in try/catch.",
    ],
    realWorldExample:
      "Saving settings to localStorage with `JSON.stringify`, then reading them with `JSON.parse` inside a try/catch with a default object when the stored text is corrupt.",
    codeExamples: [
      {
        title: "What survives a round trip",
        language: "javascript",
        code: `const data = { n: 1, d: new Date(0), u: undefined, f() {} }
const text = JSON.stringify(data)
console.log(text) // {"n":1,"d":"1970-01-01T00:00:00.000Z"}

const back = JSON.parse(text)
console.log(typeof back.d) // "string"

try { JSON.parse("{bad json}") } catch (e) { console.log(e.name) } // SyntaxError`,
        walkthrough: [
          "The undefined value and the function are left out of the string.",
          "The date becomes an ISO string.",
          "After parsing, the date is only a string, so you must convert it back.",
          "Malformed JSON throws a `SyntaxError`, which is why a try/catch is needed.",
        ],
      },
    ],
    commonMistakes: [
      "Expecting dates, Maps or Sets to come back as the same type.",
      "Parsing without a try/catch.",
      "Using the round trip as a general deep clone.",
    ],
    followUps: [
      { question: "What are the replacer and reviver arguments for?" },
    ],
    answerTips: [
      "List the values that do not survive, it shows you have been bitten before.",
    ],
    keyPoints: [
      "stringify = object to text, parse = text to object",
      "Functions and undefined are dropped",
      "Dates become strings",
      "Parse can throw",
    ],
    revisionNotes: ["JSON loses functions, undefined and Date types."],
    sourceRefs: [
      { label: "MDN: JSON", url: `${MDN}/Reference/Global_Objects/JSON` },
    ],
    estimatedMinutes: 4,
  },
])
