import { defineLesson } from "@/data/lessons/author"

export default defineLesson("javascript", {
  slug: "dom-and-events",
  title: "The DOM and events",
  topic: "DOM & events",
  minutes: 90,
  overview:
    "Select and change elements, build the page from data, and handle events, including bubbling and event delegation.",
  objectives: [
    "Select elements and change their text, attributes, classes and styles",
    "Create and insert elements safely",
    "Handle events, explain bubbling and capturing, and use event delegation",
  ],
  prerequisites: ["lesson.javascript.promises-and-async-await"],
  sections: [
    {
      kind: "explain",
      heading: "What the DOM is",
      body: [
        "The **Document Object Model (DOM)** is the browser's live representation of a page as a tree of objects. Each tag becomes an **element node**, and text becomes a **text node**. JavaScript reads and changes this tree through the global `document` object, and the browser redraws the page to match.",
        "You find elements with `document.querySelector(selector)`, which gives the first match or `null`, and `document.querySelectorAll(selector)`, which gives a list of all matches. The selector is the same CSS selector that you use in a stylesheet. `getElementById` is a direct way to find one element by its id.",
        "Scripts must run after the elements exist. Put the script at the end of the body, add the `defer` attribute, or use a module script, which is deferred automatically.",
      ],
    },
    {
      kind: "code",
      heading: "Reading and changing elements",
      example: {
        title: "Text, attributes, classes",
        language: "javascript",
        code: "const title = document.querySelector('#title');\ntitle.textContent = 'Hello';\ntitle.classList.add('big');\ntitle.classList.toggle('hidden');\ntitle.setAttribute('data-id', '7');\nconsole.log(title.dataset.id);\ntitle.style.color = 'teal';\n\nconst items = document.querySelectorAll('li');\nitems.forEach((li, index) => {\n  li.textContent = index + 1 + '. ' + li.textContent;\n});",
        walkthrough: [
          "`textContent` sets plain text, so it is safe for any value.",
          "`classList` adds, removes and toggles CSS classes without touching the others.",
          "`data-` attributes are available through the `dataset` object.",
          "`querySelectorAll` returns a list that can be looped with `forEach`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Creating elements safely",
      body: [
        "Create an element with `document.createElement('li')`, set its content, and insert it with `append`, `prepend`, `before`, `after` or `replaceWith`. Remove an element with `element.remove()`.",
        "**Never put untrusted text into `innerHTML`.** If the text contains a `<script>` tag or an `onerror` attribute, it can run code in the page, which is called a cross-site scripting (XSS) attack. Use `textContent` for text. When you really need HTML from a string, clean it first with a trusted sanitiser.",
        "Changing the page many times in a row can be slow, because each change may cause a new layout. Build the elements first, then add them in one step, for example with a `DocumentFragment` or by calling `append` once.",
      ],
    },
    {
      kind: "code",
      heading: "Building a list from data",
      example: {
        title: "createElement and append",
        language: "javascript",
        code: "const users = ['Asha', 'Ravi', 'Meera'];\nconst list = document.querySelector('#users');\nconst fragment = document.createDocumentFragment();\nfor (const name of users) {\n  const li = document.createElement('li');\n  li.textContent = name;\n  fragment.append(li);\n}\nlist.append(fragment);",
        walkthrough: [
          "Each `li` is created and filled with `textContent`, so special characters in a name cannot become HTML.",
          "The elements are collected in a fragment first, which is not part of the page.",
          "A single `append` puts all of them in the page at once.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Events",
      body: [
        "An **event** is a signal that something happened: a click, a key press, a form submit, a page load. You attach a **listener** with `element.addEventListener('click', handler)`. The browser calls `handler` with an **event object**, which has the `type`, the `target` (the element where it happened), and methods such as `preventDefault()` and `stopPropagation()`.",
        "`preventDefault()` cancels the browser's default action, such as a form being sent or a link being followed. `removeEventListener` needs the same function that was added, so keep the function in a variable if you plan to remove it. The option `{ once: true }` removes the listener after the first call.",
        "Events are not only for the DOM. Many browser APIs, and your own code, use the same listener pattern.",
      ],
    },
    {
      kind: "explain",
      heading: "Bubbling, capturing and delegation",
      body: [
        "An event travels in three phases. In the **capture** phase it goes from the top of the tree down to the target. At the **target** it runs the target's listeners. Then it **bubbles** up through the parents. Listeners run in the bubbling phase by default, so a click on a button also reaches the listeners of the button's parent and of the document.",
        "**Event delegation** uses this: instead of adding a listener to each of 100 list items, add **one** listener to the list. When a click bubbles up, `event.target` tells you which item was clicked, and `event.target.closest('li')` finds the item even when a child inside it was clicked. It works for items that are added later as well, and it saves memory.",
        "`event.currentTarget` is the element that the listener is attached to, and `event.target` is the element where the event started.",
      ],
    },
    {
      kind: "code",
      heading: "Delegation",
      example: {
        title: "One listener for many items",
        language: "javascript",
        code: "const list = document.querySelector('#todo');\nlist.addEventListener('click', (event) => {\n  const item = event.target.closest('li');\n  if (!item || !list.contains(item)) return;\n  item.classList.toggle('done');\n  console.log(item.dataset.id);\n});\n\nconst form = document.querySelector('form');\nform.addEventListener('submit', (event) => {\n  event.preventDefault();\n  const data = new FormData(form);\n  console.log(data.get('email'));\n});",
        walkthrough: [
          "A single listener on the list handles clicks on every item, including those added later.",
          "`closest('li')` finds the list item even if the click was on a span inside it.",
          "The form listener cancels the normal page reload with `preventDefault`, and reads the fields with `FormData`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Setting `innerHTML` from user input.",
          fix: "Use `textContent`, or create elements. Sanitise if HTML is really needed.",
        },
        {
          mistake:
            "Adding a listener inside another listener or a loop, repeatedly.",
          fix: "Add it once, or use delegation.",
        },
        {
          mistake:
            "Running the script before the elements exist, and getting `null`.",
          fix: "Use `defer`, a module script, or the end of the body.",
        },
        {
          mistake: "Writing `addEventListener('click', handle())`.",
          fix: "Pass the function, `handle`, and not its result.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A to-do list",
      scenario:
        "A page has a list of tasks, and users can mark them as done, delete them and add new ones.",
      body: [
        "Keep the tasks in an array, and write a `render` function that rebuilds the list from the array with `createElement`. One delegated listener on the list reads a `data-id` from the clicked item, changes the array and calls `render`.",
        "The array is the single source of truth, and the DOM only shows it.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "query-null",
      prompt:
        "What does `document.querySelector('.missing')` return if nothing matches?",
      options: ["null", "An empty array", "undefined"],
      answer: 0,
      explanation:
        "It returns `null`. `querySelectorAll` returns an empty list.",
    },
    {
      type: "single",
      id: "safe-text",
      prompt: "Which property is safe for putting user text into an element?",
      options: ["textContent", "innerHTML", "outerHTML"],
      answer: 0,
      explanation:
        "`textContent` treats the value as plain text, and `innerHTML` parses it as HTML, which can run scripts.",
    },
    {
      type: "multi",
      id: "bubbling-facts",
      prompt: "Which statements about event bubbling are true?",
      options: [
        "An event first reaches the target and then its parents",
        "event.target is the element where the event started",
        "stopPropagation prevents the default action",
        "Event delegation uses bubbling",
      ],
      answers: [0, 1, 3],
      explanation:
        "`stopPropagation` stops the event from travelling further. `preventDefault` cancels the default action.",
    },
    {
      type: "truefalse",
      id: "listener-fn",
      statement:
        "`removeEventListener` works with a new copy of the function, written again.",
      answer: false,
      explanation:
        "It needs the same function object that was added, so keep it in a variable.",
    },
  ],
  assignment: {
    title: "Interactive to-do list",
    task: [
      "Build a page with a form for new tasks, a list, a 'done' toggle and a delete button.",
      "Use one delegated listener on the list, keep the data in an array, and never use `innerHTML` with task text.",
    ],
    checklist: [
      "Adding a task with `<b>x</b>` shows the text and not bold",
      "Only one click listener is on the list",
      "The list is drawn from the array by a render function",
    ],
    minutes: 50,
  },
  exercises: [
    {
      slug: "class-list",
      title: "Build a class string",
      task: [
        "The DOM `classList` helps with classes. Write `toggleClass(classes, name)` that works on a string of space-separated class names: add `name` if it is missing, remove it if it is there, and return the new string in the original order with the new name last.",
      ],
      language: "javascript",
      starter: "function toggleClass(classes, name) {\n  // your code\n}",
      solution:
        "function toggleClass(classes, name) {\n  const list = classes.split(' ').filter(Boolean);\n  const index = list.indexOf(name);\n  if (index === -1) list.push(name);\n  else list.splice(index, 1);\n  return list.join(' ');\n}",
      hints: ["Split into an array, then use `indexOf`, `push` or `splice`."],
      checklist: [
        "Adding puts the name last",
        "Removing keeps the order of the others",
        "An empty string works",
      ],
      run: {
        entry: "toggleClass",
        cases: [
          {
            name: "add",
            args: ["a b", "c"],
            expected: "a b c",
          },
          {
            name: "remove",
            args: ["a b c", "b"],
            expected: "a c",
          },
          {
            name: "empty",
            args: ["", "x"],
            expected: "x",
          },
          {
            name: "only",
            args: ["x", "x"],
            expected: "",
          },
        ],
      },
    },
  ],
  revisionNotes: [
    "`querySelector`/`querySelectorAll` find elements; run scripts after the DOM exists",
    "`textContent` is safe; `innerHTML` with untrusted text is an XSS risk",
    "Events bubble from the target upwards; `preventDefault` cancels the default action",
    "Delegation: one listener on a parent, use `event.target.closest(...)`",
  ],
  resources: [
    {
      label: "MDN: Introduction to the DOM",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction",
    },
    {
      label: "MDN: Event bubbling",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling",
    },
    {
      label: "MDN: addEventListener",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",
    },
  ],
})
