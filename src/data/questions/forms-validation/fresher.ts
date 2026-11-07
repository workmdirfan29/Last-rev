import { defineQuestions } from "../author"
import { q } from "../compact"

const H = "https://react-hook-form.com"
const HD = `${H}/docs`
const Z = "https://zod.dev"
const W = "https://web.dev/learn/forms"

export default defineQuestions("forms-validation", "fresher", [
  q({
    slug: "why-react-hook-form",
    topic: "React Hook Form",
    d: "easy",
    title: "What is React Hook Form and why use it instead of manual state?",
    kw: [
      "react hook form",
      "useForm",
      "uncontrolled inputs",
      "performance",
      "form library",
    ],
    intent: "Checks you know what a form library saves you from writing.",
    short:
      "React Hook Form is a library for building forms with hooks. It registers inputs and reads their values through refs, so inputs are mostly uncontrolled and typing does not re-render the whole form. It handles values, validation, errors, touched and dirty state and submission for you. Writing the same with a `useState` per field means many handlers and a re-render on each keystroke.",
    detail: [
      "`useForm` returns helpers such as `register`, `handleSubmit` and `formState`.",
      "Validation rules can be declared on `register` or supplied by a schema resolver.",
      "It has a small bundle size and no dependencies.",
    ],
    ex: "A sign-up form with eight fields is wired up with one `useForm` call and one `register` per input.",
    mistakes: [
      "Controlling every input with useState and re-rendering on each key.",
      "Mixing manual state with the library for the same field.",
    ],
    follow: ["What does uncontrolled mean for an input?"],
    points: [
      "Hook-based form state",
      "Uncontrolled inputs through refs",
      "Fewer re-renders",
      "Built-in validation and errors",
    ],
    notes: ["useForm replaces per-field state."],
    src: [
      ["React Hook Form: Get started", `${H}/get-started`],
      ["React Hook Form: useForm", `${HD}/useform`],
    ],
  }),
  q({
    slug: "register-and-handlesubmit",
    topic: "React Hook Form",
    d: "easy",
    title: "How do register and handleSubmit work together?",
    kw: ["register", "handleSubmit", "onSubmit", "form values", "validation"],
    intent: "Checks you can build a basic working form.",
    short:
      '`register("email", rules)` connects an input to the form by returning props such as `name`, `onChange`, `onBlur` and `ref`, which you spread onto the input. `handleSubmit(onValid, onInvalid)` returns the submit handler: it runs validation first and calls `onValid` with the collected values only if all fields pass, otherwise it populates `formState.errors` and optionally calls `onInvalid`. It also calls `preventDefault` for you.',
    detail: [
      "Field names become the keys of the submitted object, and dot names create nested objects.",
      "Validation rules include `required`, `minLength`, `maxLength`, `min`, `max`, `pattern` and `validate`.",
      "The handler may be async, and `isSubmitting` stays true until it finishes.",
    ],
    ex: "A login form registers `email` and `password`, and `onValid` sends the values to the API.",
    code: [
      [
        "A basic form",
        "tsx",
        `const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>()\n\n<form onSubmit={handleSubmit((values) => save(values))}>\n  <input {...register("email", { required: "Email is required" })} />\n  {errors.email && <p role="alert">{errors.email.message}</p>}\n  <button type="submit">Save</button>\n</form>`,
        [
          "`register` is spread onto the input.",
          "`handleSubmit` validates before calling the function.",
          "`errors.email.message` is shown.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to spread the register result onto the input.",
      "Calling the submit function directly instead of through handleSubmit.",
    ],
    follow: ["What happens when validation fails?"],
    points: [
      "register connects an input",
      "handleSubmit validates first",
      "Values keyed by field name",
      "Errors in formState.errors",
    ],
    notes: ["Spread register, wrap with handleSubmit."],
    src: [
      ["React Hook Form: register", `${HD}/useform/register`],
      ["React Hook Form: handleSubmit", `${HD}/useform/handlesubmit`],
    ],
  }),
  q({
    slug: "formstate-errors-dirty-submitting",
    topic: "React Hook Form",
    d: "medium",
    title: "What information does formState provide?",
    kw: ["formState", "errors", "isDirty", "isSubmitting", "touchedFields"],
    intent: "Checks you can use form status to drive the UI.",
    short:
      "`formState` describes the form's current status: `errors` holds the validation errors by field, `isDirty` says whether any value differs from the default values, `dirtyFields` and `touchedFields` list which fields changed or were visited, `isValid` tells if the form currently passes validation, and `isSubmitting` is true while an async submit handler runs. It is a proxy, so you only get updates for the properties you actually read.",
    detail: [
      "Read `formState` during render, not later, so the subscription is set up.",
      "`isSubmitting` is useful to disable the button and show a spinner.",
      "`isValid` depends on the validation mode, so check the `mode` option if it seems out of date.",
    ],
    ex: "A settings form enables 'Save' only when `isDirty` is true and shows 'Saving...' while `isSubmitting`.",
    mistakes: [
      "Destructuring formState values lazily so no updates arrive.",
      "Relying on isValid without understanding the mode.",
    ],
    follow: ["Why is formState a proxy?"],
    points: [
      "errors, isDirty, isValid, isSubmitting",
      "touchedFields and dirtyFields",
      "Subscribes to what you read",
      "Read it during render",
    ],
    notes: ["Read the property to subscribe."],
    src: [["React Hook Form: formState", `${HD}/useform/formstate`]],
  }),
  q({
    slug: "validation-modes",
    topic: "React Hook Form",
    d: "medium",
    title: "What are the validation modes mode and reValidateMode?",
    kw: ["mode", "reValidateMode", "onBlur", "onChange", "onTouched"],
    intent: "Checks you control when validation messages appear.",
    short:
      "The `mode` option sets when validation first runs: `onSubmit` is the default, `onBlur` validates when a field loses focus, `onChange` on each change, `onTouched` on the first blur and then on every change, and `all` on both blur and change. `reValidateMode` sets when fields that were already submitted are re-checked, with a default of `onChange`. Validating on blur or touched avoids showing errors while the user is still typing.",
    detail: [
      "`onChange` gives the fastest feedback but re-renders more and can feel noisy.",
      "`isValid` is only kept up to date in modes other than `onSubmit` unless you read it.",
      "Pick one mode per form for consistent behaviour.",
    ],
    ex: "A sign-up form uses `onTouched` so each field is checked after the user leaves it and then updates live as they fix it.",
    code: [
      [
        "Choose the mode",
        "ts",
        `const form = useForm({ mode: "onTouched", reValidateMode: "onChange" })`,
        [
          "Fields validate after the first blur.",
          "After an error they re-check on every change.",
        ],
      ],
    ],
    mistakes: [
      "Showing errors on the first keystroke.",
      "Never validating until submit on a long form.",
    ],
    follow: ["Which mode would you use for a long form?"],
    points: [
      "Default is onSubmit",
      "onBlur, onChange, onTouched, all",
      "reValidateMode after first submit",
      "Balance feedback and noise",
    ],
    notes: ["onTouched is a friendly default."],
    src: [["React Hook Form: useForm", `${HD}/useform`]],
  }),
  q({
    slug: "default-values-and-reset",
    topic: "React Hook Form",
    d: "medium",
    title:
      "How do defaultValues and reset work, for example when editing a record?",
    kw: ["defaultValues", "reset", "edit form", "async defaults", "dirty"],
    intent: "Checks you can pre-fill and clear forms correctly.",
    short:
      "`defaultValues` in `useForm` sets the initial value of each field and is what `isDirty` is compared with. `reset(values)` restores the form to the given values, or back to the defaults when called without arguments, and clears errors and touched state. For an edit form where data loads asynchronously, call `reset(data)` when the data arrives, or pass an async function as `defaultValues`. Always provide defaults so inputs are not undefined at first.",
    detail: [
      "Defaults are read at first render, so changing the defaults object later does nothing without `reset`.",
      "After a successful submit, `reset` clears the form for the next entry.",
      "Controlled inputs especially need defaults to avoid uncontrolled-to-controlled warnings.",
    ],
    ex: "An edit-profile page loads the user, then calls `reset(user)` so the fields show the saved values and the form is not dirty.",
    code: [
      [
        "Reset with loaded data",
        "tsx",
        `const { register, reset } = useForm<Profile>({ defaultValues: { name: "", email: "" } })\n\nuseEffect(() => {\n  if (profile) reset(profile)\n}, [profile, reset])`,
        [
          "Empty defaults avoid undefined values.",
          "`reset(profile)` fills the form once the data is available.",
        ],
      ],
    ],
    mistakes: [
      "Expecting later changes of defaultValues to update the form.",
      "Leaving fields without defaults.",
    ],
    follow: ["How does reset affect isDirty?"],
    points: [
      "defaultValues are the baseline",
      "reset restores or replaces values",
      "Call reset when async data arrives",
      "Clears errors and touched state",
    ],
    notes: ["Load data, then reset."],
    src: [
      ["React Hook Form: useForm", `${HD}/useform`],
      ["React Hook Form: reset", `${HD}/useform/reset`],
    ],
  }),
  q({
    slug: "controller-for-controlled-components",
    topic: "React Hook Form",
    d: "hard",
    title: "When do you need Controller or useController?",
    kw: [
      "Controller",
      "useController",
      "controlled component",
      "ui library",
      "custom input",
    ],
    intent: "Checks you know how to integrate inputs that cannot use register.",
    short:
      "`register` works with native inputs that expose a ref. Components from UI libraries and custom inputs, such as a date picker, a select or a rating widget, are controlled components that take `value` and `onChange` props. `Controller`, or the `useController` hook, wraps them: you give it the field name and `control`, and it passes `field` props (`value`, `onChange`, `onBlur`, `ref`, `name`) and the field state to your render function so the library tracks the value.",
    detail: [
      "Use `register` whenever the input is a native element.",
      "Pass `control` from `useForm`, or take it from context.",
      "Controlled fields re-render with their value, so use them only where needed.",
    ],
    ex: "A custom dropdown component is connected to the form through `Controller` and its `onChange` updates the form value.",
    code: [
      [
        "Controller",
        "tsx",
        `<Controller\n  name="country"\n  control={control}\n  render={({ field, fieldState }) => (\n    <CountrySelect {...field} error={fieldState.error?.message} />\n  )}\n/>`,
        [
          "`name` and `control` link it to the form.",
          "`field` carries value and handlers.",
          "`fieldState` carries that field's error.",
        ],
      ],
    ],
    mistakes: [
      "Using register on a component that does not forward a ref.",
      "Using Controller for every native input.",
    ],
    follow: ["What does the field object contain?"],
    points: [
      "register for native inputs",
      "Controller for controlled components",
      "Passes value and onChange",
      "Provides fieldState",
    ],
    notes: ["Native: register. Custom: Controller."],
    src: [
      ["React Hook Form: Controller", `${HD}/usecontroller/controller`],
      ["React Hook Form: useController", `${HD}/usecontroller`],
    ],
  }),
  q({
    slug: "watch-vs-usewatch",
    topic: "React Hook Form",
    d: "hard",
    title:
      "How do watch and useWatch differ, and why do they matter for performance?",
    kw: ["watch", "useWatch", "re-render", "dependent fields", "performance"],
    intent:
      "Checks you can react to field values without re-rendering the whole form.",
    short:
      "`watch` subscribes to field values and re-renders the component that called `useForm` whenever they change, so it can cause the whole form to re-render. `useWatch` subscribes in the component where you call it, isolating re-renders to that component. Use them for dependent UI, such as showing a field only when a checkbox is ticked. Prefer `useWatch` in a small child component for performance, and `getValues` to read values without subscribing.",
    detail: [
      "`getValues` reads the current values once and does not trigger renders.",
      "Calling `watch` with no argument watches the entire form, which re-renders the most.",
      "For validation that depends on another field, use `validate` with `getValues` or a schema.",
    ],
    ex: "A shipping form shows the 'Company name' field only when the 'Business address' box is ticked, using `useWatch` in a small component.",
    mistakes: [
      "Calling watch() on the whole form at the top of a large form.",
      "Using watch for a one-time read.",
    ],
    follow: ["When would you use getValues instead?"],
    points: [
      "watch re-renders the host component",
      "useWatch isolates re-renders",
      "getValues does not subscribe",
      "Watch only what you need",
    ],
    notes: ["Small useWatch beats big watch."],
    src: [
      ["React Hook Form: watch", `${HD}/useform/watch`],
      ["React Hook Form: useWatch", `${HD}/usewatch`],
    ],
  }),
  q({
    slug: "field-arrays-and-form-context",
    topic: "React Hook Form",
    d: "hard",
    title: "How do you handle dynamic lists of fields and nested components?",
    kw: [
      "useFieldArray",
      "FormProvider",
      "useFormContext",
      "dynamic fields",
      "append",
    ],
    intent: "Checks you can scale forms beyond a flat list of inputs.",
    short:
      "`useFieldArray` manages a dynamic list of fields, such as several phone numbers or order lines. It returns the `fields` array and helpers such as `append`, `remove`, `insert` and `move`. Use each field's generated `id` as the React key. To avoid passing form methods down through props, wrap the form in `FormProvider` and call `useFormContext` in child components to get `register`, `control` and the rest.",
    detail: [
      "Input names use an index path such as `items.0.name`.",
      "Do not use the array index as the key, because reordering would break input state.",
      "The context pattern fits multi-step forms split into components.",
    ],
    ex: "An invoice form lets users add and remove line items, each with a description and amount.",
    code: [
      [
        "Field array",
        "tsx",
        `const { control, register } = useForm<{ phones: { number: string }[] }>()\nconst { fields, append, remove } = useFieldArray({ control, name: "phones" })\n\n{fields.map((f, i) => (\n  <div key={f.id}>\n    <input {...register(\`phones.\${i}.number\`)} />\n    <button type="button" onClick={() => remove(i)}>Remove</button>\n  </div>\n))}\n<button type="button" onClick={() => append({ number: "" })}>Add</button>`,
        [
          "`fields` drives the list.",
          "`f.id` is the stable key.",
          "Indexed names place values in the array.",
        ],
      ],
    ],
    mistakes: [
      "Using the index as the key.",
      'Forgetting type="button" so the buttons submit the form.',
    ],
    follow: ["Why use FormProvider?"],
    points: [
      "useFieldArray for lists",
      "Use field.id as key",
      "append, remove, move",
      "FormProvider shares form methods",
    ],
    notes: ["Key by field.id."],
    src: [
      ["React Hook Form: useFieldArray", `${HD}/usefieldarray`],
      ["React Hook Form: useFormContext", `${HD}/useformcontext`],
    ],
  }),
  q({
    slug: "controlled-vs-uncontrolled-inputs",
    topic: "React Hook Form",
    d: "easy",
    title: "What is the difference between controlled and uncontrolled inputs?",
    kw: [
      "controlled input",
      "uncontrolled input",
      "value prop",
      "ref",
      "onChange",
    ],
    intent:
      "Checks you understand the model behind both manual forms and React Hook Form.",
    short:
      "A controlled input has its value held in React state: you pass `value` and update it in `onChange`, so React is the single source of truth and re-renders on every keystroke. An uncontrolled input keeps its value in the DOM, and you read it when needed through a ref or on submit. Controlled inputs make live validation and formatting easy; uncontrolled inputs need less code and fewer re-renders, which is the approach React Hook Form takes with `register`.",
    detail: [
      "Giving `value` without `onChange` makes a read-only field and React warns about it.",
      "Switching an input from uncontrolled to controlled is a common warning when the initial value is undefined.",
      "`defaultValue` sets the starting value of an uncontrolled input.",
    ],
    ex: "A search box that filters a list on every keystroke is controlled, while a long sign-up form reads its values once on submit.",
    code: [
      [
        "Controlled input",
        "tsx",
        `const [name, setName] = useState("")

<input value={name} onChange={(e) => setName(e.target.value)} />`,
        [
          "The state holds the value.",
          "`onChange` updates the state on each change.",
        ],
      ],
    ],
    mistakes: [
      "A value prop without onChange.",
      "Starting with undefined then switching to a defined value.",
    ],
    follow: ["Which kind does React Hook Form use by default?"],
    points: [
      "Controlled: React state owns the value",
      "Uncontrolled: the DOM owns it",
      "Controlled re-renders per keystroke",
      "Default value for uncontrolled",
    ],
    notes: ["Who owns the value?"],
    src: [
      [
        "React: <input>",
        "https://react.dev/reference/react-dom/components/input",
      ],
    ],
  }),
  q({
    slug: "what-is-zod",
    topic: "Zod schemas",
    d: "easy",
    title: "What is Zod and what is a schema?",
    kw: ["zod", "schema", "validation", "typescript", "runtime validation"],
    intent:
      "Checks you understand why TypeScript types alone do not validate data.",
    short:
      "Zod is a TypeScript-first library for declaring schemas and validating data at runtime. A schema describes the shape and rules of a value, for example an object with a string `email` and a number `age` of at least 18. TypeScript types disappear after compilation and cannot check data from a form, an API or storage, but a Zod schema checks the actual value and also gives you the matching static type.",
    detail: [
      "You write the rules once and get both validation and types.",
      "Schemas are composable: objects can contain other schemas.",
      "Input from outside your code, such as request bodies and form data, should be validated.",
    ],
    ex: "A sign-up schema validates the form in the browser and the same schema validates the request body on the server.",
    mistakes: [
      "Assuming a TypeScript type guarantees the runtime data is valid.",
      "Writing the type and the validation separately.",
    ],
    follow: ["How do you get the TypeScript type from a schema?"],
    points: [
      "Runtime validation",
      "Schema describes shape and rules",
      "Static type is inferred",
      "Validate all external input",
    ],
    notes: ["Types vanish at runtime; schemas do not."],
    src: [
      ["Zod: Introduction", `${Z}/`],
      ["Zod: Basic usage", `${Z}/basics`],
    ],
  }),
  q({
    slug: "zod-parse-vs-safeparse",
    topic: "Zod schemas",
    d: "easy",
    title: "What is the difference between parse and safeParse?",
    kw: ["parse", "safeParse", "ZodError", "validation result", "success"],
    intent:
      "Checks you can handle validation results without unhandled exceptions.",
    short:
      "`schema.parse(data)` returns the validated data or throws a `ZodError` if the data is invalid, so it needs a try/catch. `schema.safeParse(data)` never throws: it returns a result object with `success`, and either `data` when it succeeded or `error` with the list of issues when it failed. Use `safeParse` when invalid input is expected, such as user input, and handle the two branches explicitly.",
    detail: [
      "Each issue has a `path` to the field and a `message`.",
      "Async refinements need `parseAsync` and `safeParseAsync`.",
      "The parsed output can differ from the input if the schema transforms or applies defaults.",
    ],
    ex: "An API handler uses `safeParse` on the request body and returns a 400 response with the issues if it fails.",
    code: [
      [
        "safeParse",
        "ts",
        `const result = schema.safeParse(input)\nif (!result.success) {\n  return result.error.issues\n}\nconst user = result.data`,
        [
          "No exception is thrown.",
          "TypeScript narrows `result` to the success case after the check.",
        ],
      ],
    ],
    mistakes: [
      "Using parse without a try/catch on user input.",
      "Forgetting async refinements need parseAsync.",
    ],
    follow: ["What does a ZodError contain?"],
    points: [
      "parse throws",
      "safeParse returns a result",
      "Issues have path and message",
      "Async needs parseAsync",
    ],
    notes: ["User input: safeParse."],
    src: [["Zod: Basic usage", `${Z}/basics`]],
  }),
  q({
    slug: "zod-infer-types",
    topic: "Zod schemas",
    d: "easy",
    title: "How does z.infer give you a TypeScript type from a schema?",
    kw: [
      "z.infer",
      "type inference",
      "single source of truth",
      "output type",
      "typescript",
    ],
    intent: "Checks you avoid writing the same shape twice.",
    short:
      "`z.infer<typeof schema>` extracts the TypeScript type of the data a schema produces, so you declare the shape once as a schema and derive the type from it. The type and the validation can never drift apart. If a schema transforms its data or applies defaults, the inferred type is the output type, and `z.input` gives the type before parsing.",
    detail: [
      "Export both the schema and the type, with the type often using the same name.",
      "The type is erased at compile time, but the schema stays at runtime.",
      "Optional fields become optional properties in the type.",
    ],
    ex: "A form uses `type SignUp = z.infer<typeof signUpSchema>` as the generic type for `useForm`.",
    code: [
      [
        "Infer a type",
        "ts",
        `const userSchema = z.object({\n  name: z.string(),\n  age: z.number().int().min(18),\n})\n\ntype User = z.infer<typeof userSchema>\n// { name: string; age: number }`,
        ["The schema is the source of truth.", "`User` is derived from it."],
      ],
    ],
    mistakes: [
      "Writing the interface by hand next to the schema.",
      "Confusing input and output types when transforms are used.",
    ],
    follow: ["What is z.input for?"],
    points: [
      "Type derived from schema",
      "One source of truth",
      "Output type by default",
      "z.input for the pre-parse type",
    ],
    notes: ["Schema first, type inferred."],
    src: [["Zod: Basic usage", `${Z}/basics`]],
  }),
  q({
    slug: "zod-strings-numbers-validations",
    topic: "Zod schemas",
    d: "medium",
    title: "How do you express common field rules in Zod?",
    kw: ["z.string", "min", "email", "z.number", "z.enum"],
    intent: "Checks you know how to define typical form rules in a schema.",
    short:
      'Chain checks on primitive schemas: `z.string().min(3)` and `.max(50)` for length, `z.email()` for an email format, `z.number().int().min(18)` for a number range, `z.enum(["admin", "user"])` for a fixed set, and `.optional()` or `.nullable()` for missing values. Most checks accept a custom message as an argument, such as `z.string().min(8, "Use at least 8 characters")`. Collect the fields into `z.object({...})`.',
    detail: [
      "Strings in forms are never numbers, so use `z.coerce.number()` or convert before validating.",
      "Use `.trim()` on strings if surrounding spaces should not count.",
      "Empty inputs give an empty string, not undefined, so handle that for optional fields.",
    ],
    ex: "A registration schema requires a trimmed name, a valid email, a password of at least 8 characters and a role from a list.",
    code: [
      [
        "A registration schema",
        "ts",
        `const registerSchema = z.object({\n  name: z.string().trim().min(2, "Enter your name"),\n  email: z.email("Enter a valid email"),\n  password: z.string().min(8, "Use at least 8 characters"),\n  role: z.enum(["user", "admin"]),\n})`,
        [
          "Each field has its own rules and message.",
          "The object schema combines them.",
        ],
      ],
    ],
    mistakes: [
      "Expecting a number input to produce a number without coercion.",
      "Treating empty string as missing.",
    ],
    follow: ["How do you validate a number from an input field?"],
    points: [
      "Chain checks on primitives",
      "Custom messages as arguments",
      "enum for fixed sets",
      "Forms give strings, so coerce numbers",
    ],
    notes: ["Compose z.object from field schemas."],
    src: [
      ["Zod: Defining schemas", `${Z}/api`],
      ["Zod: Customizing errors", `${Z}/error-customization`],
    ],
  }),
  q({
    slug: "zod-refine-cross-field",
    topic: "Zod schemas",
    d: "medium",
    title: "How do you validate across fields, such as confirm password?",
    kw: [
      "refine",
      "superRefine",
      "cross-field validation",
      "path",
      "confirm password",
    ],
    intent: "Checks you can write rules that involve more than one field.",
    short:
      'Add `.refine()` on the object schema with a function that receives the whole parsed object and returns true when valid. Provide an error message and a `path` so the error attaches to the field that should show it, for example `path: ["confirm"]`. For several related checks or issues with custom codes, `superRefine` lets you add multiple issues. Cross-field refinements on an object run only after the individual field checks pass.',
    detail: [
      "Without `path`, the error is attached to the object as a whole and the field shows nothing.",
      "Simple custom rules on one field can use `.refine` on that field.",
      "Refinements can be async if they need to call an API, but then use `parseAsync`.",
    ],
    ex: "A change-password form checks that `confirm` equals `password` and shows the message under the confirm field.",
    code: [
      [
        "Confirm password",
        "ts",
        `const schema = z\n  .object({ password: z.string().min(8), confirm: z.string() })\n  .refine((d) => d.password === d.confirm, {\n    error: "Passwords do not match",\n    path: ["confirm"],\n  })`,
        [
          "`refine` receives the whole object.",
          "`path` places the error on `confirm`.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting path so no field shows the error.",
      "Expecting the refine to run when individual fields already failed.",
    ],
    follow: ["When would you use superRefine?"],
    points: [
      "refine on the object",
      "path targets a field",
      "superRefine adds multiple issues",
      "Runs after field checks pass",
    ],
    notes: ["Set the path."],
    src: [["Zod: Defining schemas (refinements)", `${Z}/api`]],
  }),
  q({
    slug: "zod-coerce-and-transform",
    topic: "Zod schemas",
    d: "hard",
    title:
      "What do coerce and transform do, and when do you need them for forms?",
    kw: [
      "z.coerce",
      "transform",
      "string to number",
      "date input",
      "output type",
    ],
    intent: "Checks you can bridge form strings and typed values.",
    short:
      "HTML inputs produce strings, so a numeric or date field arrives as text. `z.coerce.number()` converts the input with the JavaScript `Number` function before validating, and `z.coerce.date()` does the same for dates. `.transform()` runs a function on a value after it has been validated, for example to trim, normalise or reshape it. Both change the output type, so the type of the parsed data can differ from the input type.",
    detail: [
      "Coercion follows JavaScript rules, so an empty string becomes 0 for numbers; handle blanks explicitly.",
      "With React Hook Form, a mismatch between input and output types may need the `z.input` and `z.output` types.",
      "Alternatively `register(name, { valueAsNumber: true })` converts at the input.",
    ],
    ex: 'An age field typed as `"25"` is coerced to `25` before the minimum is checked.',
    code: [
      [
        "Coerce a number",
        "ts",
        `const schema = z.object({\n  age: z.coerce.number().int().min(18),\n  email: z.email().transform((v) => v.toLowerCase()),\n})`,
        [
          "`coerce` turns the string into a number first.",
          "`transform` lowercases the email after validating.",
        ],
      ],
    ],
    mistakes: [
      "Letting an empty number field become 0 and pass.",
      "Mixing up input and output types.",
    ],
    follow: ["What does valueAsNumber do in register?"],
    points: [
      "Inputs give strings",
      "coerce converts before checking",
      "transform reshapes after validating",
      "Output type may differ from input",
    ],
    notes: ["Beware empty string to 0."],
    src: [
      ["Zod: Defining schemas", `${Z}/api`],
      ["Zod: Basic usage", `${Z}/basics`],
    ],
  }),
  q({
    slug: "zod-optional-nullable-default",
    topic: "Zod schemas",
    d: "medium",
    title:
      "What is the difference between optional, nullable and default in Zod?",
    kw: ["optional", "nullable", "default", "undefined", "null"],
    intent: "Checks you distinguish missing, null and defaulted values.",
    short:
      "`.optional()` allows the value to be `undefined`, so the key may be missing. `.nullable()` allows `null` but not undefined. `.nullish()` allows both. `.default(value)` supplies a value when the input is undefined, so the output is never undefined. Choose them to match the data source: JSON from an API often uses `null`, while a missing form field is `undefined` or an empty string.",
    detail: [
      "A form text input that was left empty is an empty string, which is neither undefined nor null.",
      "To treat blank as missing, transform empty strings to undefined before validating.",
      "The inferred type changes accordingly, for example `string | undefined`.",
    ],
    ex: "A profile schema has an optional `bio`, a nullable `avatarUrl` from the API and a `theme` that defaults to `light`.",
    mistakes: [
      "Using optional when the API returns null.",
      "Expecting an empty string to count as undefined.",
    ],
    follow: ["How do you treat an empty string as missing?"],
    points: [
      "optional: undefined",
      "nullable: null",
      "nullish: both",
      "default fills undefined",
    ],
    notes: ["Match the data source."],
    src: [["Zod: Defining schemas", `${Z}/api`]],
  }),
  q({
    slug: "zodresolver-integration",
    topic: "Resolvers and integration",
    d: "medium",
    title: "How do you connect a Zod schema to React Hook Form?",
    kw: [
      "zodResolver",
      "resolver",
      "@hookform/resolvers",
      "useForm",
      "schema validation",
    ],
    intent: "Checks you can plug a schema into the form library.",
    short:
      "Install `@hookform/resolvers`, import `zodResolver` from `@hookform/resolvers/zod`, and pass it to `useForm` as the `resolver` option: `useForm({ resolver: zodResolver(schema) })`. React Hook Form then validates the whole form against the schema instead of the rules written on `register`, and maps each Zod issue to `formState.errors` by its path. Give `useForm` the inferred type so field names are type-checked.",
    detail: [
      "Do not mix schema validation and `register` rules for the same field.",
      "The same schema can be reused on the server.",
      "With coercion or transforms, the form values and the submitted data may have different types.",
    ],
    ex: "The sign-up form uses the shared schema through the resolver, and error messages come from the schema.",
    code: [
      [
        "Resolver",
        "tsx",
        `import { zodResolver } from "@hookform/resolvers/zod"\n\ntype SignUp = z.infer<typeof signUpSchema>\nconst { register, handleSubmit, formState: { errors } } = useForm<SignUp>({\n  resolver: zodResolver(signUpSchema),\n})`,
        [
          "The resolver delegates validation to Zod.",
          "Issues appear in `errors` under the matching field.",
        ],
      ],
    ],
    mistakes: [
      "Duplicating rules in register and the schema.",
      "Forgetting to pass the form generic type.",
    ],
    follow: ["How does an issue path map to a field?"],
    points: [
      "zodResolver in useForm",
      "Schema replaces register rules",
      "Paths map to field errors",
      "Reusable on the server",
    ],
    notes: ["resolver: zodResolver(schema)."],
    src: [
      ["React Hook Form: useForm (resolver)", `${HD}/useform`],
      ["Zod: Basic usage", `${Z}/basics`],
    ],
  }),
  q({
    slug: "server-side-validation-errors",
    topic: "Resolvers and integration",
    d: "medium",
    title: "How do you show server-side validation errors in a form?",
    kw: [
      "setError",
      "server errors",
      "field errors",
      "root error",
      "api validation",
    ],
    intent:
      "Checks you treat the server as the final authority and surface its errors.",
    short:
      'Client-side validation is for convenience; the server must validate again because requests can be sent without your form. When the server rejects a submission, map its error response to the form with `setError`: attach field errors with `setError("email", { message: "Already registered" })`, and use a root error such as `setError("root", ...)` for general failures. The user sees the problem next to the field and keeps their input.',
    detail: [
      "A shared schema keeps client and server rules consistent.",
      "Errors set with `setError` are cleared when the field is changed or revalidated, depending on settings.",
      "A 5xx or network failure should show a general message, not a field error.",
    ],
    ex: "A sign-up request returns 409 for a taken email; the form shows 'Email already registered' under the email field.",
    code: [
      [
        "Map a server error",
        "ts",
        `async function onValid(values: SignUp) {\n  const res = await fetch("/api/signup", { method: "POST", body: JSON.stringify(values) })\n  if (res.status === 409) {\n    setError("email", { message: "Email already registered" })\n  }\n}`,
        [
          "The server decides the email is taken.",
          "`setError` shows it at the field.",
        ],
      ],
    ],
    mistakes: [
      "Trusting the client validation alone.",
      "Clearing the form when the server rejects it.",
    ],
    follow: ["Why validate again on the server?"],
    points: [
      "Server always validates",
      "setError maps server errors",
      "Keep the user's input",
      "General failures get a general message",
    ],
    notes: ["Never skip server validation."],
    src: [["React Hook Form: setError", `${HD}/useform/seterror`]],
  }),
  q({
    slug: "native-vs-library-validation",
    topic: "Resolvers and integration",
    d: "medium",
    title:
      "How do HTML validation attributes, React Hook Form rules and a schema compare?",
    kw: [
      "html validation",
      "required attribute",
      "schema validation",
      "novalidate",
      "validation layers",
    ],
    intent:
      "Checks you understand the layers of validation and how they combine.",
    short:
      "HTML attributes such as `required`, `type=\"email\"` and `minlength` use the browser's built-in validation with its own bubbles. React Hook Form rules or a resolver schema run in JavaScript and give consistent messages and styling, and a schema can be shared with the server. Because both the browser and the library would validate, many forms add `noValidate` to the form so only the library's messages show, while keeping the attributes for semantics and mobile keyboards. The server is the final layer.",
    detail: [
      "Native validation needs no JavaScript but offers limited control over messages.",
      "A schema suits complex or cross-field rules.",
      "Keep the same rules on all layers so users do not see conflicting messages.",
    ],
    ex: 'A form has `noValidate`, inputs keep `type="email"` for the right keyboard, and messages come from the Zod schema.',
    mistakes: [
      "Two sets of validation messages competing.",
      "Relying on browser validation alone for security.",
    ],
    follow: ["What does noValidate do?"],
    points: [
      "Browser, library and server layers",
      "noValidate hands control to the library",
      "Shared schema for consistency",
      "Server is final",
    ],
    notes: ["Many layers, one set of rules."],
    src: [
      [
        "MDN: Client-side form validation",
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation",
      ],
      ["React Hook Form: useForm", `${HD}/useform`],
    ],
  }),
  q({
    slug: "accessible-error-messages",
    topic: "Form UX & errors",
    d: "medium",
    title: "How do you make form error messages accessible?",
    kw: [
      "aria-invalid",
      "aria-describedby",
      "role alert",
      "error message",
      "screen reader",
    ],
    intent: "Checks you tie error text to its field for assistive technology.",
    short:
      'Put the error message next to its field, in text, not only in colour. Set `aria-invalid="true"` on the invalid input and link the message with `aria-describedby` pointing at the message\'s id, so a screen reader announces the error when the field is focused. A message container with `role="alert"` is announced when it appears. Each input also needs a visible `label`, and on submit focus should move to the first invalid field.',
    detail: [
      "React Hook Form focuses the first error field by default after a failed submit.",
      "Say what is wrong and how to fix it, such as 'Enter an email like name@example.com'.",
      "Do not rely on red alone; add text or an icon.",
    ],
    ex: "An invalid email shows 'Enter a valid email' below the field, linked with `aria-describedby`, and a screen reader reads it on focus.",
    code: [
      [
        "Linked error",
        "tsx",
        `<label htmlFor="email">Email</label>\n<input\n  id="email"\n  aria-invalid={!!errors.email}\n  aria-describedby={errors.email ? "email-error" : undefined}\n  {...register("email")}\n/>\n{errors.email && <p id="email-error" role="alert">{errors.email.message}</p>}`,
        [
          "`aria-invalid` flags the input.",
          "`aria-describedby` connects the message.",
          '`role="alert"` announces it when shown.',
        ],
      ],
    ],
    mistakes: [
      "Showing errors only with a red border.",
      "Messages like 'Invalid' with no guidance.",
    ],
    follow: ["Where should focus go after a failed submit?"],
    points: [
      "Text next to the field",
      "aria-invalid and aria-describedby",
      "role=alert announces",
      "Focus the first error",
    ],
    notes: ["Link the message to the field."],
    src: [
      ["web.dev: Form validation", `${W}/validation`],
      [
        "MDN: ARIA",
        "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA",
      ],
    ],
  }),
  q({
    slug: "when-to-show-validation-errors",
    topic: "Form UX & errors",
    d: "medium",
    title: "When should a form show validation errors?",
    kw: [
      "inline validation",
      "on blur",
      "premature errors",
      "form ux",
      "feedback timing",
    ],
    intent:
      "Checks you design validation timing that helps rather than annoys.",
    short:
      "Avoid showing an error before the user has had a chance to finish. A good default is to validate a field when it loses focus, then update the message live as they correct it, and to validate everything on submit. Showing an error on the first keystroke of an email field is noisy. Clear errors as soon as the value becomes valid, and show a success cue only when it adds value.",
    detail: [
      "This matches the `onTouched` mode in React Hook Form.",
      "Long forms benefit from per-field feedback; short forms may only need submit-time validation.",
      "Do not disable the submit button without telling the user why.",
    ],
    ex: "A user leaves the email field with a typo, sees the message, fixes it, and the message disappears as they type.",
    mistakes: [
      "Errors on the first keystroke.",
      "A disabled submit button with no explanation.",
    ],
    follow: ["Which React Hook Form mode matches this?"],
    points: [
      "Validate on blur",
      "Update live after the first error",
      "Full check on submit",
      "Explain, do not just disable",
    ],
    notes: ["Blur first, then live."],
    src: [
      ["web.dev: Form validation", `${W}/validation`],
      ["React Hook Form: useForm", `${HD}/useform`],
    ],
  }),
  q({
    slug: "prevent-double-submit-and-loading",
    topic: "Form UX & errors",
    d: "easy",
    title: "How do you prevent double submission and show progress?",
    kw: [
      "isSubmitting",
      "disable button",
      "double submit",
      "loading state",
      "idempotent",
    ],
    intent: "Checks you handle the submitting state correctly.",
    short:
      "While the submit handler is running, disable the submit button and show progress using `formState.isSubmitting`, which is true as long as the async handler's promise is pending. This stops users clicking twice and creating duplicate records. Keep the form's values on screen, announce the result, and for actions that must not be duplicated, such as payments, the server should also be idempotent, for example by accepting an idempotency key.",
    detail: [
      "`handleSubmit` must receive an async function that returns its promise for `isSubmitting` to work.",
      "Do not rely only on the button; Enter in a text field also submits.",
      "Show a clear success or error result afterwards.",
    ],
    ex: "The 'Pay now' button turns into 'Processing...' and is disabled until the request finishes.",
    mistakes: [
      "Not returning the promise from the handler.",
      "Relying on the client alone to stop duplicates.",
    ],
    follow: ["Why make the server idempotent too?"],
    points: [
      "isSubmitting while pending",
      "Disable the button",
      "Return the promise",
      "Server idempotency for critical actions",
    ],
    notes: ["Disable while submitting."],
    src: [
      ["React Hook Form: formState", `${HD}/useform/formstate`],
      ["React Hook Form: handleSubmit", `${HD}/useform/handlesubmit`],
    ],
  }),
  q({
    slug: "labels-autocomplete-and-input-types",
    topic: "Form UX & errors",
    d: "easy",
    title: "Which small details make forms quicker to complete?",
    kw: ["autocomplete", "input type", "labels", "autofill", "mobile keyboard"],
    intent: "Checks you know low-effort improvements that help real users.",
    short:
      "Use a visible label for every field, the right `type` for each input, such as `email`, `tel` or `password`, so mobile devices show a suitable keyboard, and `autocomplete` values such as `email`, `name` or `new-password` so browsers and password managers can fill the form. Ask only for what you need, mark optional fields rather than required ones when most are required, and keep the order logical.",
    detail: [
      '`autocomplete="one-time-code"` helps with OTP fields on supporting devices.',
      "Allow pasting into password fields so password managers work.",
      "Group related fields and keep one column on small screens.",
    ],
    ex: "A checkout form with correct autocomplete tokens can be filled with a single tap on a saved address.",
    mistakes: [
      "Disabling paste on password fields.",
      "Using type text for everything.",
    ],
    follow: ["Why does autocomplete matter for accessibility?"],
    points: [
      "Visible labels",
      "Correct type",
      "autocomplete tokens",
      "Ask for less",
    ],
    notes: ["Help the browser fill it."],
    src: [
      ["web.dev: Autofill", `${W}/autofill`],
      [
        "MDN: autocomplete attribute",
        "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete",
      ],
    ],
  }),
  q({
    slug: "preserve-input-on-error",
    topic: "Form UX & errors",
    d: "easy",
    title: "What should happen to the user's input when submission fails?",
    kw: ["preserve input", "error recovery", "retry", "form state", "ux"],
    intent: "Checks you avoid making users retype after an error.",
    short:
      "Keep everything the user entered, show what went wrong at the right place, and let them fix it and try again. Never clear the form on a validation or server error, because retyping is frustrating and error-prone. Only reset the form after a successful submission, using `reset()`. Sensitive fields such as passwords can be cleared on failure if the security model requires it, but say so.",
    detail: [
      "Keep focus management in mind: move focus to the first problem.",
      "For long forms, saving a draft protects against accidental loss.",
      "Avoid page reloads that drop input; submit with JavaScript or keep values server-rendered.",
    ],
    ex: "A payment failure shows 'Card declined' while the address fields stay filled in.",
    mistakes: [
      "Clearing the form on failure.",
      "A full page reload that loses values.",
    ],
    follow: ["When is it right to call reset?"],
    points: [
      "Keep input on error",
      "Show the problem clearly",
      "Reset only after success",
      "Consider saving drafts",
    ],
    notes: ["Fix, do not retype."],
    src: [
      ["web.dev: Form validation", `${W}/validation`],
      ["React Hook Form: reset", `${HD}/useform/reset`],
    ],
  }),
  q({
    slug: "multi-step-forms",
    topic: "Form UX & errors",
    d: "hard",
    title: "How would you build a multi-step form?",
    kw: [
      "multi-step form",
      "wizard",
      "trigger",
      "form context",
      "step validation",
    ],
    intent:
      "Checks you can structure a longer form without losing data or validity.",
    short:
      'Keep one form instance for all steps, shared with `FormProvider`, so values survive moving between steps. Each step renders its own fields. Before going to the next step, call `trigger(["field1", "field2"])` to validate only the current step\'s fields, and move on only if it passes. Submit everything on the last step with `handleSubmit`. Show progress, allow going back without losing data, and consider saving a draft.',
    detail: [
      "A step-specific schema can be composed into the full schema.",
      "Unmounted fields keep their values by default, but check the `shouldUnregister` setting.",
      "Reflect the step in the URL so Back and refresh behave sensibly.",
    ],
    ex: "A job application has Personal details, Experience and Review steps, and each Next click validates only the current step.",
    code: [
      [
        "Validate one step",
        "tsx",
        `async function next() {\n  const ok = await trigger(["firstName", "lastName"])\n  if (ok) setStep((s) => s + 1)\n}`,
        [
          "`trigger` validates only the listed fields.",
          "The step advances only when they are valid.",
        ],
      ],
    ],
    mistakes: [
      "One form instance per step so data is lost.",
      "Validating the whole form at step one.",
    ],
    follow: ["How would you keep the step in the URL?"],
    points: [
      "One form instance, shared via context",
      "trigger validates a subset",
      "Submit on the last step",
      "Show progress and allow Back",
    ],
    notes: ["Trigger the step's fields."],
    src: [
      ["React Hook Form: useFormContext", `${HD}/useformcontext`],
      ["React Hook Form: trigger", `${HD}/useform/trigger`],
    ],
  }),
])
