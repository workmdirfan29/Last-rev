import { defineLesson } from "@/data/lessons/author"

export default defineLesson("html", {
  slug: "forms-and-validation",
  title: "Forms: controls, labels and built-in validation",
  topic: "Forms",
  minutes: 60,
  overview:
    "Build a form with the right input types, connect every control to a label, and use the browser's built-in validation attributes.",
  objectives: [
    "Build a form with form, label, input, select, textarea and button",
    "Connect a label to its control and explain what the name attribute does",
    "Use required, min, max, minlength, maxlength and pattern for built-in validation",
  ],
  prerequisites: ["lesson.html.semantic-elements"],
  sections: [
    {
      kind: "explain",
      heading: "The parts of a form",
      body: [
        "A `<form>` groups controls and sends them to a server. Its `action` attribute is the address that receives the data and `method` is usually `get` or `post`.",
        "Each control that should be sent needs a `name`. The browser submits `name=value` pairs, so a control without a name sends nothing.",
        "The `type` of an `<input>` changes the control and the keyboard a phone shows: `text`, `email`, `number`, `password`, `date`, `checkbox`, `radio` and more. Use `<textarea>` for long text and `<select>` with `<option>` for a list of choices.",
      ],
    },
    {
      kind: "code",
      heading: "A small sign-up form",
      example: {
        title: "Labels, names and types",
        language: "html",
        code: '<form action="/signup" method="post">\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required>\n\n  <label>\n    Age\n    <input name="age" type="number" min="13" max="120">\n  </label>\n\n  <fieldset>\n    <legend>Plan</legend>\n    <label><input type="radio" name="plan" value="free" checked> Free</label>\n    <label><input type="radio" name="plan" value="pro"> Pro</label>\n  </fieldset>\n\n  <button type="submit">Create account</button>\n</form>',
        walkthrough: [
          "`for=\"email\"` on the label matches the `id` of the input, so clicking the label focuses the field and a screen reader announces the label.",
          "The second label wraps its input, which also connects them without `for` and `id`.",
          "`type=\"email\"` and `required` make the browser check the value before it submits.",
          "Radio buttons share one `name`, so only one can be chosen. `<fieldset>` and `<legend>` group them and give the group a name.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Built-in validation",
      body: [
        "Browsers check many rules for you. `required` demands a value, `min` and `max` limit numbers and dates, `minlength` and `maxlength` limit text length, `type=\"email\"` checks the shape of an address, and `pattern` takes a regular expression.",
        "When a rule fails, the browser blocks the submit and shows a message next to the control. The CSS pseudo-classes `:valid` and `:invalid` let you style the state.",
        "Client-side validation is a convenience for the user. A server must still check every value, because the browser check can be bypassed.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Using a placeholder instead of a label.",
          fix: "Always add a real `<label>`. A placeholder disappears when typing and is not a label.",
        },
        {
          mistake: "Forgetting the name attribute.",
          fix: "Give each control a `name`, or its value is not sent.",
        },
        {
          mistake: "Giving radio buttons different names.",
          fix: "Use the same `name` for the buttons of one group, with a different `value` for each.",
        },
        {
          mistake: "Relying on browser validation alone.",
          fix: "Check the same rules on the server.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A contact form",
      scenario:
        "You need a contact form with a name, an email and a message, and all three are required.",
      body: [
        "Use a text input, an email input and a textarea, each with a label and a name, and mark each with `required`. Add `maxlength` to the message if there is a limit.",
        "End with a `<button type=\"submit\">`. The browser then checks the fields, shows a message for the first problem and does not send until it is fixed.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "name-attribute",
      prompt: "What does a control need so that its value is sent with the form?",
      options: ["A name attribute", "A class attribute", "A placeholder"],
      answer: 0,
      explanation:
        "The browser submits name and value pairs, so a control without a name is left out.",
    },
    {
      type: "truefalse",
      id: "placeholder-label",
      statement: "A placeholder is a good replacement for a label.",
      answer: false,
      explanation:
        "A placeholder vanishes as the user types and is not reliably announced as a label. Use a `<label>`.",
    },
    {
      type: "multi",
      id: "validation-attributes",
      prompt: "Which of these are built-in HTML validation features?",
      options: ["required", "pattern", "maxlength", "onclick", "href"],
      answers: [0, 1, 2],
      explanation:
        "`required`, `pattern` and `maxlength` limit what can be submitted. `onclick` and `href` are not validation attributes.",
    },
    {
      type: "blank",
      id: "label-link",
      prompt: "A label connects to an input when its for attribute matches the input's ___.",
      answer: "id",
      explanation:
        "The label's `for` value must equal the `id` of the control.",
    },
  ],
  assignment: {
    title: "Registration form",
    task: [
      "Build a registration form with name, email, password, date of birth and a choice of two plans.",
      "Add labels, sensible input types, a required rule on name and email and a minimum length for the password.",
    ],
    checklist: [
      "Every control has a label",
      "Every control has a name",
      "The plan choice uses radio buttons in a fieldset with a legend",
      "Built-in validation blocks an empty email",
    ],
    hints: ["Open the page and try to submit it empty to test your rules."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "fix-the-form",
      title: "Fix the form",
      task: [
        "This form has no labels or names and uses the wrong input type. Fix it so it submits the values and checks the email.",
      ],
      language: "html",
      starter:
        '<form action="/join" method="post">\n  <input type="text" placeholder="Email">\n  <input type="text" placeholder="Age">\n  <button>Join</button>\n</form>',
      solution:
        '<form action="/join" method="post">\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required>\n  <label for="age">Age</label>\n  <input id="age" name="age" type="number" min="0">\n  <button type="submit">Join</button>\n</form>',
      hints: ["Which input type checks the shape of an email address?"],
      checklist: [
        "Each input has a label connected by for and id",
        "Each input has a name",
        "Email uses type email and required",
      ],
    },
  ],
  revisionNotes: [
    "form + named controls: the browser sends name=value pairs",
    "Always connect a label to its control (for/id, or wrap the input)",
    "Built-in rules: required, min, max, minlength, maxlength, pattern, input type",
    "Client validation helps users; the server must check again",
  ],
  resources: [
    {
      label: "MDN: The form element",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form",
    },
    {
      label: "MDN: Client-side form validation",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation",
    },
    {
      label: "MDN: The label element",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label",
    },
  ],
})
