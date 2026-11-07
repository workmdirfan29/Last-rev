import { defineLesson } from "@/data/lessons/author"

export default defineLesson("react", {
  slug: "forms",
  title: "Forms: controlled inputs and submitting",
  topic: "Forms",
  minutes: 60,
  overview:
    "Build forms with controlled inputs, handle one change handler for many fields, validate, and submit.",
  objectives: [
    "Write controlled inputs with value and onChange",
    "Handle several fields with one state object",
    "Validate input and handle the submit event",
  ],
  prerequisites: ["lesson.react.state"],
  sections: [
    {
      kind: "explain",
      heading: "Controlled inputs",
      body: [
        "In a **controlled input**, React state is the single source of truth for the field. The input gets its `value` from state, and an `onChange` handler writes every change back to state. The input shows what the state says, so the code always knows the current value.",
        "For text inputs and text areas the value is `event.target.value`. For a checkbox, you use `checked` and `event.target.checked`. For a select, `value` and `event.target.value`. If you set `value` without `onChange`, the input becomes read-only, and React warns you.",
        "An **uncontrolled** input keeps its value in the DOM, and you read it when needed, for example with a ref or with `FormData` on submit. This is simpler for forms that need no live validation.",
      ],
    },
    {
      kind: "code",
      heading: "A controlled form",
      example: {
        title: "One state object for many fields",
        language: "jsx",
        code: 'function SignupForm() {\n  const [form, setForm] = useState({ name: \'\', email: \'\', agree: false });\n\n  function handleChange(event) {\n    const { name, type, value, checked } = event.target;\n    setForm({ ...form, [name]: type === \'checkbox\' ? checked : value });\n  }\n  function handleSubmit(event) {\n    event.preventDefault();\n    console.log(form);\n  }\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name="name" value={form.name} onChange={handleChange} />\n      <input name="email" type="email" value={form.email} onChange={handleChange} />\n      <label>\n        <input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} />\n        I agree\n      </label>\n      <button disabled={!form.agree}>Sign up</button>\n    </form>\n  );\n}',
        walkthrough: [
          "One handler serves every field, using the `name` attribute as the key in the state object.",
          "Checkboxes use `checked`, so the handler reads the right property for each type.",
          "`preventDefault` stops the browser from reloading the page when the form is submitted.",
          "The button is disabled until the box is ticked, calculated from state.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Validation and submitting",
      body: [
        "Validate **on submit** at least, and show errors next to the fields. Some checks, such as a required field or a minimum length, can run as the user types, but showing an error before the user has finished is unfriendly. A common choice is to show an error after the field has been left, or after the first submit.",
        'Client-side validation helps users, but it can be bypassed, so the **server must validate again**. Use the right input types and attributes, such as `type="email"`, `required` and `minLength`, which the browser also checks and which help assistive technology. Connect each label to its input with `htmlFor` and `id`, and show errors with `role="alert"` or `aria-describedby`.',
        "While a form is being sent, disable the button and show progress, to avoid duplicate submissions, and handle failures with a message and without losing what the user typed.",
      ],
    },
    {
      kind: "code",
      heading: "Errors and submit state",
      example: {
        title: "Validating on submit",
        language: "jsx",
        code: "function validate(form) {\n  const errors = {};\n  if (!form.email.includes('@')) errors.email = 'Enter a valid email';\n  if (form.password.length < 8) errors.password = 'Use at least 8 characters';\n  return errors;\n}\n\nasync function onSubmit(event) {\n  event.preventDefault();\n  const found = validate(form);\n  setErrors(found);\n  if (Object.keys(found).length > 0) return;\n  setSending(true);\n  try {\n    await send(form);\n  } finally {\n    setSending(false);\n  }\n}",
        walkthrough: [
          "`validate` is a pure function that returns an object of messages, which is easy to test.",
          "The handler stops when there are errors, and otherwise sends the data.",
          "`finally` makes sure that the sending state is reset even if the request fails.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Setting `value` without `onChange`.",
          fix: "Add `onChange`, or use `defaultValue` for an uncontrolled input.",
        },
        {
          mistake: "Forgetting `event.preventDefault()` in the submit handler.",
          fix: "Call it, or the page reloads.",
        },
        {
          mistake: "Changing a state object in place: `form.name = value`.",
          fix: "Create a new object with spread.",
        },
        {
          mistake: "Trusting client-side checks only.",
          fix: "Validate on the server too, because the client can be bypassed.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A login form",
      scenario:
        "A login screen needs an email, a password, a loading state and an error message from the server.",
      body: [
        'Keep the field values in state, validate on submit, disable the button while sending, and show a server error in an element with `role="alert"`. Keep the typed email after a failed attempt, and clear only the password.',
        "Labels and error messages that are linked to the inputs make the form usable with a keyboard and a screen reader.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "controlled-def",
      prompt: "What makes an input controlled?",
      options: [
        "Its value comes from React state and changes go through onChange",
        "It has a name attribute",
        "It is inside a form",
      ],
      answer: 0,
      explanation:
        "A controlled input is driven by state: `value` plus `onChange`.",
    },
    {
      type: "single",
      id: "checkbox-prop",
      prompt: "Which prop holds the state of a controlled checkbox?",
      options: ["checked", "value", "selected"],
      answer: 0,
      explanation:
        "A checkbox uses `checked`, and `event.target.checked` in the handler.",
    },
    {
      type: "truefalse",
      id: "server-validate",
      statement:
        "If the browser validates a form, the server does not need to.",
      answer: false,
      explanation:
        "The client can be bypassed, so the server must always validate.",
    },
    {
      type: "blank",
      id: "prevent",
      prompt:
        "In a submit handler, call event.___() to stop the page from reloading.",
      answer: "preventDefault",
      explanation:
        "`preventDefault` cancels the browser default of sending the form.",
    },
  ],
  assignment: {
    title: "A registration form",
    task: [
      "Build a form with name, email, password, a country select and a terms checkbox, using controlled inputs.",
      "Validate on submit with a pure function, show messages next to the fields, and disable the button while sending.",
    ],
    checklist: [
      "Every input has a label",
      "Errors are shown next to the fields",
      "validate is a separate function that I tested",
    ],
    minutes: 30,
  },
  exercises: [
    {
      slug: "form-validate",
      title: "Write the validator",
      task: [
        "Write `validateSignup({ email, password })` that returns an object with an `email` message when the email has no `@`, and a `password` message when the password has fewer than 8 characters. It returns an empty object when both are fine. Show how a submit handler uses it.",
      ],
      language: "jsx",
      starter: "function validateSignup(values) {\n  // your code\n}",
      solution:
        "function validateSignup({ email, password }) {\n  const errors = {};\n  if (!email.includes('@')) errors.email = 'Enter a valid email';\n  if (password.length < 8) errors.password = 'Use at least 8 characters';\n  return errors;\n}\n\n// in the handler:\n// const errors = validateSignup(form);\n// setErrors(errors);\n// if (Object.keys(errors).length === 0) send(form);",
      hints: ["Return an empty object when there is nothing wrong."],
      checklist: [
        "Each problem has its own message",
        "A valid form gives an empty object",
        "The function does not use state",
      ],
    },
  ],
  revisionNotes: [
    "Controlled input = value from state + onChange writes back",
    "One handler for many fields: use `name` and a computed key",
    "preventDefault on submit; validate on submit; the server validates too",
    "Link labels and errors to inputs for accessibility",
  ],
  resources: [
    {
      label: "React: Reacting to Input with State",
      url: "https://react.dev/learn/reacting-to-input-with-state",
    },
    {
      label: "React: <input>",
      url: "https://react.dev/reference/react-dom/components/input",
    },
    {
      label: "React: <form>",
      url: "https://react.dev/reference/react-dom/components/form",
    },
  ],
})
