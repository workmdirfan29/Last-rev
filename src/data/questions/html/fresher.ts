import { defineQuestions } from "../author"
import { q } from "../compact"

const M = "https://developer.mozilla.org/en-US/docs"
const E = `${M}/Web/HTML/Element`

export default defineQuestions("html", "fresher", [
  q({
    slug: "what-is-semantic-html",
    topic: "Semantics",
    d: "easy",
    title: "What is semantic HTML and why does it matter?",
    kw: ["semantic", "html5", "meaning", "accessibility", "structure"],
    intent:
      "A warm-up that checks you choose elements for their meaning, not only their looks.",
    short:
      "Semantic HTML uses elements that describe the meaning of their content, such as `header`, `nav`, `main`, `article`, `button` and `h1` to `h6`, instead of generic `div` and `span` everywhere. Browsers, search engines and assistive technologies can then understand the page structure. It improves accessibility, keeps the code readable, and gives you built-in behaviour such as keyboard support for a real `button`.",
    detail: [
      "A semantic element tells the browser what something is. A `nav` is a navigation block, a `button` is something you can activate, a `ul` is a list.",
      "Screen readers use these meanings to let people jump between landmarks, headings and lists.",
      "Styling is separate: you can make any element look any way with CSS, so choose the element for its meaning.",
    ],
    ex: "A blog page built with `header`, `nav`, `main`, `article` and `footer` lets a screen reader user jump straight to the article, while a page of nested `div`s gives them nothing to jump to.",
    mistakes: [
      "Using `div` with a click handler instead of a `button`.",
      "Choosing a heading level because of its size rather than its place in the outline.",
    ],
    follow: ["Which semantic elements have you used and what does each mean?"],
    points: [
      "Elements describe meaning",
      "Helps accessibility and search engines",
      "Free built-in behaviour",
      "Style with CSS, not element choice",
    ],
    notes: ["Choose the element for its meaning."],
    src: [["MDN: Semantics (glossary)", `${M}/Glossary/Semantics`]],
  }),
  q({
    slug: "div-vs-semantic-elements",
    topic: "Semantics",
    d: "easy",
    title:
      "When is a div or span the right choice instead of a semantic element?",
    kw: ["div", "span", "generic container", "semantic", "styling hook"],
    intent:
      "Checks you know generic containers are a last resort, not a default.",
    short:
      "`div` and `span` have no meaning of their own. A `div` is a generic block container and a `span` a generic inline one. Use them when no semantic element fits and you only need a hook for styling or scripting, for example wrapping items in a layout grid. If an element such as `nav`, `button`, `article` or `ul` describes the content, use that instead.",
    detail: [
      "The MDN page for `div` calls it a generic container with no meaning, and says to use it only when no other semantic element is suitable.",
      "A `span` is the inline equivalent, useful for styling part of a sentence.",
      "Adding a `class` is how you attach styles; the tag itself adds nothing for assistive technology.",
    ],
    ex: "A card grid needs a wrapper to apply CSS Grid. Each card is an `article`, but the wrapper around all cards is a plain `div`.",
    code: [
      [
        "A div only where nothing else fits",
        "html",
        `<div class="card-grid">\n  <article class="card">...</article>\n  <article class="card">...</article>\n</div>`,
        [
          "The `div` exists only so CSS can lay the cards out.",
          "Each card is an `article`, which has meaning.",
        ],
      ],
    ],
    mistakes: [
      "Building a whole page out of nested `div`s.",
      "Using `span` where a `button` or `a` is needed.",
    ],
    follow: ["How would you mark up a navigation menu?"],
    points: [
      "div = generic block",
      "span = generic inline",
      "Use only when nothing fits",
      "A class adds styling, not meaning",
    ],
    notes: ["Reach for div last."],
    src: [["MDN: The div element", `${E}/div`]],
  }),
  q({
    slug: "heading-hierarchy",
    topic: "Semantics",
    d: "easy",
    title: "How should headings be structured on a page?",
    kw: ["headings", "h1", "outline", "hierarchy", "accessibility"],
    intent:
      "Checks you use headings to give the page a logical outline, not to change text size.",
    short:
      "Use `h1` to `h6` to describe a nested outline of the page. Start with an `h1` for the page title, use `h2` for main sections and `h3` for subsections, and do not skip levels. MDN advises against using more than one `h1` per page even though the HTML specification allows it. Choose the level for its place in the outline, and use CSS for size.",
    detail: [
      "Screen reader users often move through a page by headings, so a clear outline works like a table of contents.",
      "Skipping from `h2` to `h4` or picking a level because it looks right breaks that outline.",
      "If a heading looks too big, change its CSS, not its level.",
    ],
    ex: "A product page has an `h1` with the product name, `h2` sections for Details and Reviews, and `h3` headings for each review.",
    code: [
      [
        "A clean outline",
        "html",
        `<h1>Hiking boots</h1>\n<h2>Details</h2>\n<h2>Reviews</h2>\n<h3>Review by Asha</h3>`,
        [
          "One `h1` names the page.",
          "Sections are `h2`; items inside a section are `h3`.",
          "No level is skipped.",
        ],
      ],
    ],
    mistakes: [
      "Using a heading just to make text bold or large.",
      "Skipping levels.",
    ],
    follow: ["What does a screen reader user do with headings?"],
    points: [
      "Headings form an outline",
      "One h1 is the recommended practice",
      "Do not skip levels",
      "Size belongs in CSS",
    ],
    notes: ["Level = place in outline, not size."],
    src: [["MDN: Heading elements", `${E}/Heading_Elements`]],
  }),
  q({
    slug: "article-vs-section",
    topic: "Semantics",
    d: "medium",
    title: "What is the difference between article and section?",
    kw: [
      "article",
      "section",
      "sectioning content",
      "self-contained",
      "heading",
    ],
    intent:
      "Checks you can pick between two similar sectioning elements and justify it.",
    short:
      "`article` is for a self-contained piece of content that could be distributed or reused on its own, such as a blog post, a news story or a comment. `section` is a generic grouping of related content, normally with a heading, that is part of a larger whole and has no more specific element. A good test is whether the content makes sense standing alone: if so, `article`; if not, `section`.",
    detail: [
      "An article can contain sections, and a section can contain articles.",
      "A `section` without a heading is usually a sign that a `div` would be more honest.",
      "Both elements help the page outline, but neither is for styling.",
    ],
    ex: "A news site lists story summaries, each an `article`. Inside one story, the Background and Reactions parts are `section`s.",
    mistakes: [
      "Using `section` as a replacement for `div` with no heading.",
      "Wrapping every block in `article`.",
    ],
    follow: ["Can an article contain a section?"],
    points: [
      "article = standalone, reusable",
      "section = thematic grouping",
      "Can nest each other",
      "Not styling hooks",
    ],
    notes: ["Standalone? article. Part of a whole? section."],
    src: [
      ["MDN: The article element", `${E}/article`],
      ["MDN: The section element", `${E}/section`],
    ],
  }),
  q({
    slug: "main-element",
    topic: "Semantics",
    d: "easy",
    title: "What is the main element and how many can a page have?",
    kw: ["main", "landmark", "skip link", "dominant content"],
    intent: "Checks you know the main landmark and its single-use rule.",
    short:
      "`main` holds the dominant content of the page, the part that is directly related to its central topic, excluding things repeated across pages such as the header, site navigation and footer. A document should have only one visible `main`. Assistive technology exposes it as a landmark, so users can jump straight to the content, and a skip link can point at it.",
    detail: [
      "MDN states that a document must not have more than one `main` element that is not hidden.",
      "`main` is not placed inside `article`, `aside`, `header`, `footer` or `nav`.",
      "A skip-to-content link that targets the `main` element helps keyboard users bypass repeated navigation.",
    ],
    ex: "On a shop page, the product list is in `main`, while the site header, filters sidebar and footer sit outside it.",
    code: [
      [
        "A skip link and main",
        "html",
        `<a href="#content">Skip to content</a>\n<header>...</header>\n<main id="content">\n  <h1>Products</h1>\n</main>`,
        [
          "The skip link jumps to the element with id `content`.",
          "`main` wraps only the page's central content.",
        ],
      ],
    ],
    mistakes: [
      "Using several visible `main` elements.",
      "Putting the site header inside `main`.",
    ],
    follow: ["What is a skip link for?"],
    points: [
      "Dominant content",
      "Only one visible main",
      "A landmark for assistive technology",
      "Not for repeated blocks",
    ],
    notes: ["One main per page."],
    src: [["MDN: The main element", `${E}/main`]],
  }),
  q({
    slug: "page-landmark-elements",
    topic: "Semantics",
    d: "easy",
    title: "What are header, nav, aside and footer used for?",
    kw: ["header", "nav", "aside", "footer", "landmarks"],
    intent:
      "Checks you can name the common page-structure elements and their purpose.",
    short:
      "`header` is introductory content for a page or section, such as a logo and title. `nav` marks a block of major navigation links. `aside` holds content only tangentially related to the content around it, like a sidebar or a note. `footer` holds information about its nearest sectioning content or the page, such as authorship or links. Together with `main` they give a page its landmarks.",
    detail: [
      "`nav` is for major navigation blocks, not for every group of links.",
      "`header` and `footer` can also appear inside an `article` or `section` for that section's own heading or footer information.",
      "These elements describe roles; their appearance is entirely up to CSS.",
    ],
    ex: "A documentation page has a `header` with the logo, a `nav` with the section menu, `main` with the article, an `aside` with related links and a `footer` with copyright text.",
    mistakes: [
      "Wrapping all links, even in a sentence, in `nav`.",
      "Putting primary content in `aside`.",
    ],
    follow: ["Can a page have more than one nav?"],
    points: [
      "header = intro",
      "nav = major navigation",
      "aside = tangential",
      "footer = closing info",
    ],
    notes: ["They name roles, not looks."],
    src: [
      ["MDN: header", `${E}/header`],
      ["MDN: nav", `${E}/nav`],
      ["MDN: aside", `${E}/aside`],
      ["MDN: footer", `${E}/footer`],
    ],
  }),
  q({
    slug: "form-element-basics",
    topic: "Forms",
    d: "easy",
    title: "How does an HTML form send data to a server?",
    kw: ["form", "action", "method", "submit", "name attribute"],
    intent:
      "Checks the basics: which attributes control where and how a form submits.",
    short:
      "A `form` collects controls and, when submitted, sends their values to the URL in its `action` attribute using the HTTP method in `method`, either GET or POST. Each control is sent as a name and value pair, so a control without a `name` attribute is not submitted. A submit button, or pressing Enter in a text field, starts the submission, and the browser then loads the response.",
    detail: [
      "With GET the data is added to the URL as a query string; with POST it is sent in the request body.",
      "JavaScript can intercept the `submit` event to send the data with `fetch` instead.",
      "The default method is GET and the default action is the current page.",
    ],
    ex: "A login form posts `email` and `password` to `/login`, where the server reads those two named values.",
    code: [
      [
        "A basic form",
        "html",
        `<form action="/subscribe" method="post">\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required>\n  <button type="submit">Subscribe</button>\n</form>`,
        [
          "`action` and `method` say where and how to send.",
          '`name="email"` is the key the server receives.',
          "The submit button triggers the submission.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting the `name` attribute so the value is not sent.",
      "Putting passwords in a GET form.",
    ],
    follow: ["Why should a login form use POST?"],
    points: [
      "action = where",
      "method = how",
      "Controls need a name",
      "Submit button or Enter",
    ],
    notes: ["No name, no value sent."],
    src: [["MDN: The form element", `${E}/form`]],
  }),
  q({
    slug: "label-and-input-association",
    topic: "Forms",
    d: "easy",
    title:
      "Why should every form control have a label, and how do you connect them?",
    kw: ["label", "for", "id", "accessible name", "click target"],
    intent:
      "Checks you know labels give controls an accessible name and a larger click target.",
    short:
      "A `label` describes a control so users and assistive technology know what to enter. You connect them either by giving the control an `id` and the label a matching `for` attribute, or by nesting the control inside the label. Clicking the label then focuses or activates the control, which enlarges the target, and screen readers announce the label text when the control receives focus. A `placeholder` is not a substitute.",
    detail: [
      "The label text becomes the control's accessible name.",
      "The `for` value must equal the control's `id`; ids must be unique in the page.",
      "Placeholder text disappears when typing and is not a reliable label.",
    ],
    ex: "On a sign-up form, clicking the text 'Remember me' toggles the checkbox because the label is tied to it.",
    code: [
      [
        "Two ways to label",
        "html",
        `<label for="name">Name</label>\n<input id="name" name="name">\n\n<label>\n  <input type="checkbox" name="agree"> I agree\n</label>`,
        [
          "The first label uses `for` and `id`.",
          "The second wraps the checkbox, so no `for` is needed.",
        ],
      ],
    ],
    mistakes: [
      "Using only a placeholder instead of a label.",
      "A `for` value that does not match any `id`.",
    ],
    follow: ["What if the design has no visible label?"],
    points: [
      "Label gives the accessible name",
      "for = id or nest the control",
      "Bigger click target",
      "Placeholder is not a label",
    ],
    notes: ["Every control needs a label."],
    src: [["MDN: The label element", `${E}/label`]],
  }),
  q({
    slug: "input-types",
    topic: "Forms",
    d: "easy",
    title: "What are the HTML input types and why do they matter?",
    kw: [
      "input type",
      "email",
      "number",
      "date",
      "password",
      "checkbox",
      "radio",
    ],
    intent: "Checks you pick a suitable input type instead of text everywhere.",
    short:
      "The `type` attribute of `input` selects the control and its behaviour: `text`, `email`, `password`, `number`, `date`, `checkbox`, `radio`, `file`, `range`, `search`, `tel`, `url` and more. A suitable type gives free validation for that kind of value, shows a better keyboard on phones, and provides native widgets such as a date picker. Browsers fall back to `text` for types they do not support.",
    detail: [
      "`email` and `url` check the basic format when the form is validated.",
      "`number` supports `min`, `max` and `step`; `password` masks characters.",
      "Types give hints to the device, such as a numeric keypad for `tel` or `number`.",
    ],
    ex: 'A booking form uses `type="date"` for the check-in day and `type="email"` for contact details.',
    mistakes: [
      'Using `type="text"` for everything.',
      "Using `number` for values like phone numbers or postcodes that are not quantities.",
    ],
    follow: ["Why is a phone number not a good fit for type number?"],
    points: [
      "type picks control and behaviour",
      "Free format checks",
      "Better mobile keyboards",
      "Unknown types fall back to text",
    ],
    notes: ["Pick the narrowest type that fits."],
    src: [["MDN: The input element", `${E}/input`]],
  }),
  q({
    slug: "built-in-form-validation",
    topic: "Forms",
    d: "medium",
    title: "How does built-in HTML form validation work?",
    kw: [
      "required",
      "pattern",
      "minlength",
      "constraint validation",
      "novalidate",
    ],
    intent:
      "Checks you know what the browser validates for free and what it cannot do.",
    short:
      "Attributes such as `required`, `type`, `min`, `max`, `minlength`, `maxlength` and `pattern` tell the browser how to validate a control. When the user submits, the browser checks them, blocks the submission if any fail and shows a message. The Constraint Validation API lets JavaScript read validity and set custom messages, and `novalidate` on the form turns the built-in checks off. Client-side validation is for convenience; the server must validate again.",
    detail: [
      "`pattern` takes a regular expression that the whole value must match.",
      "The `:valid` and `:invalid` CSS pseudo-classes let you style the result.",
      "Anyone can bypass browser checks, so never rely on them for security.",
    ],
    ex: 'A sign-up form marks the email as `required type="email"` and the password `minlength="8"`, and the browser stops an empty submission before any request is made.',
    code: [
      [
        "Validation attributes",
        "html",
        `<input name="username" required minlength="3" maxlength="20"\n       pattern="[a-z0-9_]+" title="Lowercase letters, digits, underscore">`,
        [
          "`required` rejects an empty value.",
          "Length limits and `pattern` constrain the content.",
          "`title` explains the pattern to the user.",
        ],
      ],
    ],
    mistakes: [
      "Trusting client-side validation as the only check.",
      "A `pattern` that is wrong and blocks valid input.",
    ],
    follow: ["How would you show custom error messages?"],
    points: [
      "Attributes declare the rules",
      "Browser blocks invalid submit",
      "novalidate disables it",
      "Always validate on the server too",
    ],
    notes: ["Browser validation is convenience, not security."],
    src: [
      ["MDN: required attribute", `${M}/Web/HTML/Attributes/required`],
      ["MDN: pattern attribute", `${M}/Web/HTML/Attributes/pattern`],
      [
        "MDN: Client-side form validation",
        `${M}/Learn_web_development/Extensions/Forms/Form_validation`,
      ],
    ],
  }),
  q({
    slug: "get-vs-post-forms",
    topic: "Forms",
    d: "easy",
    title: "What is the difference between GET and POST in a form?",
    kw: ["get", "post", "query string", "request body", "idempotent"],
    intent:
      "Checks you know where the data goes and which method suits which job.",
    short:
      'With `method="get"` the browser appends the form data to the URL as a query string, so the result can be bookmarked and shared, and the request should not change anything on the server. With `method="post"` the data goes in the request body, which suits actions that create or change data and large or sensitive values. Neither is encrypted by itself; HTTPS protects both in transit.',
    detail: [
      "A search form is a good fit for GET because the results page can be linked to.",
      "Data in a URL ends up in browser history and server logs, so avoid secrets in GET.",
      'File uploads need POST with `enctype="multipart/form-data"`.',
    ],
    ex: "A product search uses GET (`/search?q=boots`), while a checkout form uses POST.",
    mistakes: [
      "Sending passwords with GET.",
      "Thinking POST is automatically secure without HTTPS.",
    ],
    follow: ["What does enctype multipart/form-data do?"],
    points: [
      "GET = query string, bookmarkable",
      "POST = body, changes data",
      "Secrets never in URLs",
      "HTTPS protects both",
    ],
    notes: ["GET reads, POST changes."],
    src: [["MDN: The form element", `${E}/form`]],
  }),
  q({
    slug: "fieldset-and-legend",
    topic: "Forms",
    d: "easy",
    title: "What are fieldset and legend used for?",
    kw: ["fieldset", "legend", "radio group", "grouping", "accessibility"],
    intent: "Checks you can group related controls in an accessible way.",
    short:
      "`fieldset` groups related controls in a form and `legend` gives that group a caption. They are most useful for radio buttons and checkboxes that answer one question, because assistive technology announces the legend together with each option, for example 'Delivery speed, Standard'. The browser draws a border by default, which CSS can change. A `disabled` fieldset disables all the controls inside it.",
    detail: [
      "The `legend` must be the first child of the `fieldset` to act as its caption.",
      "A group of radio buttons that share a `name` should usually be wrapped in a fieldset.",
      "The visual border is only a default style.",
    ],
    ex: "A shipping form groups three delivery radio buttons under the legend 'Delivery speed'.",
    code: [
      [
        "A radio group",
        "html",
        `<fieldset>\n  <legend>Delivery speed</legend>\n  <label><input type="radio" name="speed" value="std"> Standard</label>\n  <label><input type="radio" name="speed" value="fast"> Express</label>\n</fieldset>`,
        [
          "The `legend` names the group.",
          "The radios share `name` so only one can be chosen.",
        ],
      ],
    ],
    mistakes: [
      "Radio groups without any group label.",
      "Putting the legend somewhere other than first.",
    ],
    follow: ["What does disabling a fieldset do?"],
    points: [
      "Groups related controls",
      "legend is the caption",
      "Announced with each option",
      "disabled applies to all inside",
    ],
    notes: ["Radios and checkbox sets need a group label."],
    src: [["MDN: The fieldset element", `${E}/fieldset`]],
  }),
  q({
    slug: "button-types",
    topic: "Forms",
    d: "easy",
    title: "What are the types of a button element and what is the default?",
    kw: ["button", "type submit", "type button", "type reset", "form"],
    intent: "Checks you know why a button can unexpectedly submit a form.",
    short:
      'A `button` has three types: `submit`, `button` and `reset`. Inside a form, the default type is `submit`, so a button with no `type` submits the form when clicked. Use `type="button"` for buttons that only run JavaScript, and `type="reset"` to restore the form\'s initial values. Always set the type explicitly to avoid surprises.',
    detail: [
      "A `button` is a real control, so it is focusable and works with Enter and Space.",
      "Outside a form, a button does nothing until you attach script.",
      "Use `a` for navigation and `button` for actions.",
    ],
    ex: "A 'Show password' toggle inside a login form must be `type=\"button\"`, otherwise clicking it would submit the form.",
    mistakes: [
      "Leaving out `type` and submitting the form by accident.",
      "Using a `div` instead of a `button`.",
    ],
    follow: ["When should you use a link instead of a button?"],
    points: [
      "Types: submit, button, reset",
      "Default inside a form is submit",
      "Set the type explicitly",
      "Buttons act, links navigate",
    ],
    notes: ["Always write the type."],
    src: [["MDN: The button element", `${E}/button`]],
  }),
  q({
    slug: "alt-text-for-images",
    topic: "Accessibility",
    d: "easy",
    title: "How do you write good alternative text for images?",
    kw: ["alt", "img", "decorative image", "screen reader", "accessibility"],
    intent:
      "Checks you know the `alt` attribute purpose, including the empty value.",
    short:
      'The `alt` attribute gives an image a text alternative that is read by screen readers and shown if the image fails to load. Describe the purpose or information of the image, not just its look, and keep it short. For a purely decorative image use an empty `alt=""` so assistive technology skips it. An `img` without any `alt` is a mistake, because some screen readers then read out the file name.',
    detail: [
      "If the image is a link or button, the alt text should describe where it goes or what it does.",
      "Do not start with 'image of'; the screen reader already announces it as an image.",
      "Complex images such as charts need a longer description nearby as well.",
    ],
    ex: 'A product photo has `alt="Red running shoe, side view"`, while a decorative divider line has `alt=""`.',
    code: [
      [
        "Informative and decorative",
        "html",
        `<img src="shoe.jpg" alt="Red running shoe, side view">\n<img src="divider.svg" alt="">`,
        [
          "The first alt describes the information the image carries.",
          "The empty alt marks the second as decorative.",
        ],
      ],
    ],
    mistakes: [
      "Leaving out `alt` entirely.",
      "Stuffing keywords into alt text.",
    ],
    follow: ["How would you describe a chart?"],
    points: [
      "alt = text alternative",
      "Describe purpose, not decoration",
      'alt="" for decorative',
      "Never omit the attribute",
    ],
    notes: ["No alt is worse than empty alt."],
    src: [
      ["MDN: The img element", `${E}/img`],
      [
        "W3C WAI: Images tutorial",
        "https://www.w3.org/WAI/tutorials/images/decision-tree/",
      ],
    ],
  }),
  q({
    slug: "aria-basics",
    topic: "Accessibility",
    d: "medium",
    title: "What is ARIA and when should you use it?",
    kw: ["aria", "role", "aria-label", "native elements", "first rule of aria"],
    intent:
      "Checks you prefer native HTML and know ARIA only changes the accessibility tree.",
    short:
      "ARIA, Accessible Rich Internet Applications, is a set of attributes such as `role`, `aria-label`, `aria-expanded` and `aria-live` that add accessibility information to elements when native HTML cannot express it. ARIA changes only how assistive technology understands an element; it adds no behaviour or keyboard support. The first rule is to use a native element, such as `button`, when one exists, and add ARIA only where needed.",
    detail: [
      "`role` states what an element is, `aria-*` states its properties and current state.",
      "A custom widget with a role must also implement the keyboard interaction users expect.",
      "Wrong ARIA is worse than none, because it can mislead assistive technology.",
    ],
    ex: 'A disclosure button that shows a menu sets `aria-expanded="true"` or `"false"` as it opens and closes, so a screen reader announces its state.',
    code: [
      [
        "State on a toggle",
        "html",
        `<button aria-expanded="false" aria-controls="menu">Menu</button>\n<ul id="menu" hidden>...</ul>`,
        [
          "`aria-expanded` reports whether the menu is open.",
          "`aria-controls` points to the element it controls.",
        ],
      ],
    ],
    mistakes: [
      'Putting `role="button"` on a `div` and forgetting keyboard handling.',
      "Adding ARIA that contradicts the native meaning.",
    ],
    follow: ["What does aria-live do?"],
    points: [
      "ARIA adds accessibility info only",
      "Native HTML first",
      "No behaviour is added",
      "Wrong ARIA misleads",
    ],
    notes: ["No ARIA is better than bad ARIA."],
    src: [
      ["MDN: ARIA", `${M}/Web/Accessibility/ARIA`],
      [
        "MDN: aria-label",
        `${M}/Web/Accessibility/ARIA/Reference/Attributes/aria-label`,
      ],
    ],
  }),
  q({
    slug: "keyboard-accessibility",
    topic: "Accessibility",
    d: "medium",
    title: "How do you make a page usable with the keyboard only?",
    kw: ["keyboard", "focus", "tabindex", "tab order", "focus indicator"],
    intent: "Checks you know focus management basics.",
    short:
      'Use native interactive elements such as `a`, `button`, `input` and `select`, because they are focusable and respond to the keyboard by default. Keep the tab order the same as the visual order, always show a visible focus indicator, and make sure every action works without a mouse. `tabindex="0"` makes an element focusable in the natural order, `tabindex="-1"` makes it focusable only by script, and positive values should be avoided because they disrupt the order.',
    detail: [
      "Removing the focus outline with CSS without a replacement makes the page unusable for keyboard users.",
      "When opening a dialog, move focus into it and return it to the trigger when it closes.",
      "Skip links let keyboard users bypass repeated navigation.",
    ],
    ex: "A checkout page can be completed entirely with Tab, Shift+Tab, Enter and Space, with a clear outline on the focused control.",
    mistakes: [
      "`outline: none` with no replacement style.",
      "Positive `tabindex` values.",
    ],
    follow: ["What does tabindex -1 do?"],
    points: [
      "Native elements work by default",
      "Visible focus indicator",
      "Logical tab order",
      "Avoid positive tabindex",
    ],
    notes: ["If you cannot Tab to it, it is not accessible."],
    src: [
      ["MDN: tabindex", `${M}/Web/HTML/Reference/Global_attributes/tabindex`],
    ],
  }),
  q({
    slug: "lang-attribute",
    topic: "Accessibility",
    d: "easy",
    title: "Why set the lang attribute on the html element?",
    kw: [
      "lang",
      "html element",
      "screen reader",
      "pronunciation",
      "translation",
    ],
    intent:
      "Checks you know a small attribute with real accessibility benefit.",
    short:
      'The `lang` attribute declares the human language of the page or an element, for example `<html lang="en">`. Screen readers use it to choose the right pronunciation rules, browsers use it for hyphenation, spell checking and translation prompts, and search engines can use it too. For a passage in another language inside the page, put `lang` on that element, such as `lang="hi"` for Hindi text.',
    detail: [
      "The value is a language tag such as `en`, `en-IN` or `hi`.",
      "Without it, a screen reader may read text with the wrong accent.",
      "It is a global attribute, so it works on any element.",
    ],
    ex: 'An English page that quotes a Hindi sentence puts `lang="hi"` on that sentence so a screen reader switches to Hindi pronunciation.',
    mistakes: [
      "Leaving `lang` off the root element.",
      "Using a wrong language code.",
    ],
    follow: ["How do you mark a phrase in another language?"],
    points: [
      "Declares the language",
      "Helps screen readers pronounce",
      "Can be set per element",
      "Use language tags like en or hi",
    ],
    notes: ["Always set lang on html."],
    src: [["MDN: lang attribute", `${M}/Web/HTML/Global_attributes/lang`]],
  }),
  q({
    slug: "colour-contrast-and-wcag",
    topic: "Accessibility",
    d: "medium",
    title: "What are WCAG and colour contrast requirements?",
    kw: ["wcag", "contrast ratio", "accessibility guidelines", "aa", "colour"],
    intent: "Checks you know the standard behind accessibility requirements.",
    short:
      "WCAG, the Web Content Accessibility Guidelines from the W3C, is the standard for accessible web content, organised around being perceivable, operable, understandable and robust. At level AA, normal text needs a contrast ratio of at least 4.5 to 1 against its background, and large text at least 3 to 1. Colour must also never be the only way to convey information, for example an error shown only in red.",
    detail: [
      "Contrast can be measured with browser developer tools or checker tools.",
      "Provide a second cue such as an icon or text alongside colour.",
      "WCAG has levels A, AA and AAA; AA is the usual target.",
    ],
    ex: "A form error message uses red text plus an error icon and the words 'Email is required', so it works for people who cannot distinguish red.",
    mistakes: ["Light grey text on white.", "Relying on colour alone."],
    follow: ["What counts as large text?"],
    points: [
      "WCAG is the W3C standard",
      "AA: 4.5:1 normal, 3:1 large text",
      "Colour is never the only cue",
      "Perceivable, operable, understandable, robust",
    ],
    notes: ["4.5:1 for normal text at AA."],
    src: [
      [
        "W3C: WCAG 2 quick reference",
        "https://www.w3.org/WAI/WCAG22/quickref/",
      ],
    ],
  }),
  q({
    slug: "dialog-element",
    topic: "Accessibility",
    d: "medium",
    title: "What is the dialog element and how does it help accessibility?",
    kw: ["dialog", "showModal", "modal", "focus", "inert"],
    intent: "Checks you know the native way to build a modal.",
    short:
      "The `dialog` element represents a dialog box or popup. Calling `showModal()` opens it as a modal, shown above the page with a backdrop, and makes the rest of the document inert so keyboard and assistive technology users cannot interact with it. The Escape key closes it, and `close()` closes it from script. Using the native element gives you much of the focus handling that custom modals must build by hand.",
    detail: [
      "`show()` opens a non-modal dialog; `showModal()` opens a modal one.",
      'A form inside with `method="dialog"` closes the dialog when submitted.',
      "You still need a clear label for the dialog and sensible focus on open.",
    ],
    ex: "A delete confirmation opens with `showModal()`, and Cancel and Confirm buttons inside close it.",
    code: [
      [
        "Opening a modal",
        "html",
        `<dialog id="confirm">\n  <p>Delete this item?</p>\n  <form method="dialog">\n    <button>Cancel</button>\n    <button value="yes">Delete</button>\n  </form>\n</dialog>\n<script>\n  document.getElementById("confirm").showModal()\n</script>`,
        [
          "`showModal()` opens it as a modal.",
          'A form with `method="dialog"` closes it on submit.',
        ],
      ],
    ],
    mistakes: [
      "Building a modal from a `div` without focus handling.",
      "Opening with `show()` when a modal is intended.",
    ],
    follow: ["What does inert mean?"],
    points: [
      "Native modal dialog",
      "showModal makes the rest inert",
      "Escape closes it",
      "method=dialog closes via form",
    ],
    notes: ["Prefer dialog over a custom div modal."],
    src: [["MDN: The dialog element", `${E}/dialog`]],
  }),
  q({
    slug: "title-and-meta-description",
    topic: "SEO basics",
    d: "easy",
    title: "What are the title element and the meta description used for?",
    kw: ["title", "meta description", "seo", "search results", "head"],
    intent:
      "Checks you know the key head elements that affect how a page appears in search and tabs.",
    short:
      'The `title` element sets the page title shown in the browser tab, in bookmarks and usually as the headline in search results. It should be unique and describe the page. `<meta name="description" content="...">` supplies a short summary that search engines may show under the title. Neither guarantees a ranking, but clear, accurate ones help users decide to open the page.',
    detail: [
      "Every page should have its own title rather than one copied site-wide.",
      "Search engines may rewrite the snippet, so the description is a suggestion.",
      "Both belong inside `head`.",
    ],
    ex: "A recipe page has the title 'Masala Dosa Recipe - Crisp and Easy' and a one-sentence description of the dish.",
    code: [
      [
        "Head essentials",
        "html",
        `<head>\n  <title>Masala Dosa Recipe</title>\n  <meta name="description" content="A simple recipe for crisp masala dosa.">\n</head>`,
        ["`title` names the page.", "The meta description summarises it."],
      ],
    ],
    mistakes: ["The same title on every page.", "Keyword stuffing."],
    follow: ["Where is the title shown?"],
    points: [
      "title: tab, bookmarks, results",
      "Description summarises the page",
      "Unique per page",
      "Both go in head",
    ],
    notes: ["Unique, accurate title and description."],
    src: [
      ["MDN: The title element", `${E}/title`],
      ["MDN: The meta element", `${E}/meta`],
    ],
  }),
  q({
    slug: "viewport-and-charset-meta",
    topic: "SEO basics",
    d: "easy",
    title: "Why do pages include meta charset and meta viewport?",
    kw: ["charset", "utf-8", "viewport", "responsive", "meta"],
    intent: "Checks you know two meta tags nearly every page needs.",
    short:
      '`<meta charset="utf-8">` declares the character encoding so text, including accented letters and scripts such as Devanagari, is decoded correctly; it should appear early in the `head`. `<meta name="viewport" content="width=device-width, initial-scale=1">` tells mobile browsers to use the device width as the layout width instead of a wide default, which is needed for responsive CSS to work properly on phones.',
    detail: [
      "UTF-8 is the recommended encoding for new pages.",
      "Without the viewport tag, a phone may render the page as a wide desktop layout and shrink it.",
      "Mobile-friendliness also matters to search engines.",
    ],
    ex: "A responsive site that looks tiny and zoomed out on a phone is usually missing the viewport meta tag.",
    code: [
      [
        "The two tags",
        "html",
        `<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">`,
        [
          "The first sets UTF-8 decoding.",
          "The second makes the layout width equal the device width.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting the viewport tag.",
      "Declaring charset late so earlier text may be decoded wrongly.",
    ],
    follow: ["What happens without the viewport meta tag?"],
    points: [
      "charset utf-8 for correct text",
      "viewport enables responsive layout",
      "Both go in head",
      "Declare charset early",
    ],
    notes: ["utf-8 and width=device-width."],
    src: [["MDN: The meta element", `${E}/meta`]],
  }),
  q({
    slug: "descriptive-link-text",
    topic: "SEO basics",
    d: "easy",
    title: "What makes a good link, and what is the rel attribute?",
    kw: ["anchor", "href", "link text", "rel", "nofollow", "noopener"],
    intent: "Checks you write descriptive links and know common rel values.",
    short:
      "A good link has descriptive text that makes sense out of context, such as 'Read the pricing guide' rather than 'click here', because users, screen readers and search engines all use link text to understand the destination. The `rel` attribute describes the relationship to the target: for example `nofollow` asks search engines not to endorse the link, and `noopener` stops the new page getting a reference to the opener when using `target=\"_blank\"`.",
    detail: [
      "Use a real `a` element with an `href`, not a clickable `div`.",
      "Links navigate; buttons perform actions.",
      'Modern browsers already treat `target="_blank"` as `noopener`, but writing `rel` explicitly is harmless.',
    ],
    ex: 'A footer link to an outside article reads \'Official docs on forms\' and uses `rel="noopener"` with `target="_blank"`.',
    mistakes: [
      "Link text such as 'click here' or 'read more' with no context.",
      "A link with no `href`.",
    ],
    follow: ["When would you use nofollow?"],
    points: [
      "Descriptive link text",
      "Links navigate, buttons act",
      "rel describes the relationship",
      "noopener with target _blank",
    ],
    notes: ["Link text should work out of context."],
    src: [["MDN: The a element", `${E}/a`]],
  }),
  q({
    slug: "localstorage-vs-sessionstorage",
    topic: "Web storage",
    d: "easy",
    title: "What is the difference between localStorage and sessionStorage?",
    kw: [
      "localStorage",
      "sessionStorage",
      "web storage",
      "persistence",
      "origin",
    ],
    intent: "Checks you know lifetime and scope of the two storage objects.",
    short:
      "Both are part of the Web Storage API and store key and value pairs as strings in the browser for one origin. `localStorage` data has no expiry and survives closing the browser, while `sessionStorage` data is kept only for the lifetime of that tab or window session and is cleared when it closes. Neither is sent to the server automatically, and both are shared only with pages of the same origin.",
    detail: [
      "A separate tab on the same site gets its own `sessionStorage` but shares `localStorage`.",
      "Use `setItem`, `getItem`, `removeItem` and `clear`.",
      "Values are strings, so objects need `JSON.stringify` and `JSON.parse`.",
    ],
    ex: "A site stores the chosen colour theme in `localStorage` so it persists, and a half-filled wizard step in `sessionStorage`.",
    code: [
      [
        "Storing an object",
        "javascript",
        `localStorage.setItem("prefs", JSON.stringify({ theme: "dark" }))\nconst prefs = JSON.parse(localStorage.getItem("prefs") ?? "{}")`,
        [
          "`setItem` stores a string.",
          "`JSON.stringify` and `JSON.parse` convert the object.",
        ],
      ],
    ],
    mistakes: [
      "Storing objects without serialising them.",
      "Expecting `sessionStorage` to be shared across tabs.",
    ],
    follow: ["Is storage shared between different sites?"],
    points: [
      "Same API, different lifetime",
      "local persists, session ends with the tab",
      "Strings only",
      "Per origin, not sent to the server",
    ],
    notes: ["local = persistent, session = per tab."],
    src: [
      ["MDN: Web Storage API", `${M}/Web/API/Web_Storage_API`],
      ["MDN: localStorage", `${M}/Web/API/Window/localStorage`],
      ["MDN: sessionStorage", `${M}/Web/API/Window/sessionStorage`],
    ],
  }),
  q({
    slug: "web-storage-vs-cookies",
    topic: "Web storage",
    d: "medium",
    title: "How is web storage different from cookies?",
    kw: ["cookies", "web storage", "http header", "expiry", "httponly"],
    intent: "Checks you can choose between storage mechanisms.",
    short:
      "Cookies are small pieces of data the server sets with a `Set-Cookie` header and the browser sends back with every matching request, so they suit sessions and anything the server must see. Web storage is only for client-side script: it is not sent with requests, it is a larger store, and it has a simpler API. Cookies can be marked `HttpOnly`, which hides them from JavaScript, and `Secure` and `SameSite` to limit how they travel.",
    detail: [
      "Cookies add to the size of every request, so keep them small.",
      "`HttpOnly` cookies cannot be read by script, which helps protect session identifiers from theft through XSS.",
      "Web storage has no such protection: any script on the page can read it.",
    ],
    ex: "A session identifier is kept in an `HttpOnly` cookie, while the user's chosen language is kept in `localStorage`.",
    mistakes: [
      "Storing large data in cookies.",
      "Assuming `localStorage` data is hidden from page scripts.",
    ],
    follow: ["What does the HttpOnly flag do?"],
    points: [
      "Cookies are sent to the server",
      "Web storage stays in the browser",
      "HttpOnly hides cookies from script",
      "Cookies add request size",
    ],
    notes: ["Server needs it: cookie. Only the page needs it: storage."],
    src: [
      ["MDN: Using HTTP cookies", `${M}/Web/HTTP/Guides/Cookies`],
      ["MDN: Web Storage API", `${M}/Web/API/Web_Storage_API`],
    ],
  }),
  q({
    slug: "sensitive-data-in-web-storage",
    topic: "Web storage",
    d: "medium",
    title: "Is it safe to store sensitive data in localStorage?",
    kw: ["localStorage", "xss", "tokens", "security", "same origin"],
    intent:
      "Checks you understand the main risk of keeping secrets in web storage.",
    short:
      "It is risky. Any JavaScript that runs on your page can read `localStorage`, including a script injected through cross-site scripting. So passwords, payment details and long-lived authentication tokens should not be kept there. Storage is limited to the same origin, which stops other sites, but it does not protect against code running on your own site. Keep secrets on the server, and prefer `HttpOnly` cookies for session identifiers.",
    detail: [
      "The data is also stored unencrypted on the device.",
      "Preferences such as theme or a draft message are suitable uses.",
      "Defending against XSS reduces the risk but does not remove it.",
    ],
    ex: "A to-do app keeps the theme in `localStorage` but keeps the login session in an `HttpOnly` cookie.",
    mistakes: [
      "Saving access tokens in `localStorage` as if it were private.",
      "Saving unencrypted personal data.",
    ],
    follow: ["How does XSS relate to this?"],
    points: [
      "Page scripts can read it",
      "XSS exposes it",
      "Not for secrets or tokens",
      "Use server-side or HttpOnly cookies",
    ],
    notes: ["Storage is for preferences, not secrets."],
    src: [
      ["MDN: localStorage", `${M}/Web/API/Window/localStorage`],
      ["MDN: Web Storage API", `${M}/Web/API/Web_Storage_API`],
    ],
  }),
  q({
    slug: "indexeddb-overview",
    topic: "Web storage",
    d: "medium",
    title:
      "What is IndexedDB and when would you use it instead of localStorage?",
    kw: ["indexeddb", "offline", "structured data", "asynchronous", "storage"],
    intent: "Checks you know the larger, structured browser database.",
    short:
      "IndexedDB is a low-level browser API for storing large amounts of structured data, including files and blobs, in a transactional database inside the browser. Unlike `localStorage` it is asynchronous, so it does not block the main thread, it supports indexes for fast queries, and it can hold much more. Use it for offline-capable apps and larger datasets, usually through a small wrapper library, and keep `localStorage` for small simple values.",
    detail: [
      "Data is stored as JavaScript objects in object stores and is accessed through transactions.",
      "It follows the same-origin policy like other browser storage.",
      "The raw API is verbose, so many projects use a wrapper.",
    ],
    ex: "A note-taking app that works offline stores its notes and attachments in IndexedDB so they are available without a network.",
    mistakes: [
      "Using `localStorage` for large or structured data.",
      "Forgetting that the API is asynchronous.",
    ],
    follow: ["Why is localStorage a poor fit for large data?"],
    points: [
      "Structured, large, transactional storage",
      "Asynchronous",
      "Indexes for queries",
      "Good for offline apps",
    ],
    notes: ["Big or structured: IndexedDB."],
    src: [["MDN: IndexedDB API", `${M}/Web/API/IndexedDB_API`]],
  }),
])
