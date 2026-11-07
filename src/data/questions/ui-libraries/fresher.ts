import { defineQuestions } from "../author"
import { q } from "../compact"

const T = "https://tailwindcss.com/docs"
const S = "https://ui.shadcn.com/docs"
const R = "https://recharts.github.io/en-US"

export default defineQuestions("ui-libraries", "fresher", [
  q({
    slug: "what-is-tailwind-utility-first",
    topic: "Tailwind CSS",
    d: "easy",
    title: "What is Tailwind CSS and what does utility-first mean?",
    kw: [
      "tailwind css",
      "utility-first",
      "utility classes",
      "styling",
      "markup",
    ],
    intent:
      "Checks you understand the idea behind Tailwind, not just its class names.",
    short:
      "Tailwind CSS is a utility-first CSS framework. Instead of writing custom CSS for each component, you build designs by combining small single-purpose classes directly in your markup, such as `flex`, `p-4`, `text-sm` and `bg-white`. Each class sets one or a few CSS declarations from a shared design scale for spacing, colours and type. You rarely leave the HTML to write CSS, names are not needed, and the output only contains the classes you use.",
    detail: [
      "Using a fixed scale keeps spacing and colours consistent across a project.",
      "Styles live next to the element, so changing one component does not break another.",
      "Repeated patterns are extracted into components, such as a React `Button`, not into new CSS classes.",
    ],
    ex: 'A card is written as `<div className="rounded-lg border p-4 shadow-sm">` with no separate stylesheet.',
    code: [
      [
        "Utility classes",
        "tsx",
        `<button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">\n  Save\n</button>`,
        [
          "Each class sets one concern.",
          "`hover:` applies the colour only on hover.",
        ],
      ],
    ],
    mistakes: [
      "Copying the same long class list everywhere instead of making a component.",
      "Thinking it replaces understanding CSS.",
    ],
    follow: ["How do you reuse a pattern in React?"],
    points: [
      "Small single-purpose classes",
      "Composed in markup",
      "Shared design scale",
      "Extract components, not classes",
    ],
    notes: ["Compose utilities, extract components."],
    src: [
      [
        "Tailwind CSS: Styling with utility classes",
        `${T}/styling-with-utility-classes`,
      ],
      ["Tailwind CSS: Reusing styles", `${T}/reusing-styles`],
    ],
  }),
  q({
    slug: "tailwind-setup-with-vite",
    topic: "Tailwind CSS",
    d: "easy",
    title: "How do you add Tailwind CSS to a Vite project?",
    kw: [
      "tailwind v4",
      "vite plugin",
      "@import tailwindcss",
      "installation",
      "setup",
    ],
    intent:
      "Checks you know the current setup rather than the old config-file approach.",
    short:
      'Install `tailwindcss` and the `@tailwindcss/vite` package, add the plugin to `vite.config`, and import Tailwind in your main CSS file with `@import "tailwindcss";`. Then use the utility classes in your components. In version 4 configuration is CSS-first, so most customisation is done in the CSS file instead of a JavaScript config, and the content files are detected automatically.',
    detail: [
      "Tailwind scans your source files for class names and generates only the CSS used.",
      "Custom design tokens are declared in CSS using `@theme`.",
      "Editor extensions provide class autocomplete.",
    ],
    ex: "A new React app adds the Vite plugin, one CSS import, and starts using classes immediately.",
    code: [
      [
        "Vite and CSS",
        "ts",
        `// vite.config.ts\nimport tailwindcss from "@tailwindcss/vite"\nexport default defineConfig({ plugins: [react(), tailwindcss()] })\n\n/* src/index.css */\n@import "tailwindcss";`,
        [
          "The plugin processes Tailwind during the build.",
          "The CSS import brings in the framework.",
        ],
      ],
    ],
    mistakes: [
      "Following old tutorials with tailwind.config.js and @tailwind directives for v4.",
      "Forgetting to import the CSS file in the entry point.",
    ],
    follow: ["Where do you customise the theme in v4?"],
    points: [
      "Install tailwindcss and the Vite plugin",
      '@import "tailwindcss"',
      "CSS-first configuration",
      "Automatic source detection",
    ],
    notes: ["Plugin plus one CSS import."],
    src: [
      ["Tailwind CSS: Installing with Vite", `${T}/installation/using-vite`],
    ],
  }),
  q({
    slug: "tailwind-state-variants",
    topic: "Tailwind CSS",
    d: "easy",
    title: "How do hover, focus and other state variants work in Tailwind?",
    kw: ["variants", "hover", "focus", "disabled", "pseudo-class"],
    intent: "Checks you can style interaction states without writing CSS.",
    short:
      "Tailwind variants are prefixes that apply a utility only in a given state or condition: `hover:bg-blue-700`, `focus:ring-2`, `disabled:opacity-50`, `first:mt-0`. The prefix is placed before the utility with a colon. Variants can be stacked, such as `md:hover:underline`, which applies on medium screens and up when hovered. Visible focus styles with `focus-visible:` keep keyboard users oriented.",
    detail: [
      "Variants map to CSS pseudo-classes, pseudo-elements and media queries.",
      "`group` and `peer` variants style an element based on a parent or sibling's state.",
      "Always keep a visible focus indicator on interactive elements.",
    ],
    ex: "A button uses `hover:bg-blue-700 focus-visible:ring-2 disabled:opacity-50` to cover mouse, keyboard and disabled states.",
    mistakes: [
      "Removing focus outlines with no replacement.",
      "Forgetting the disabled style so a disabled button looks active.",
    ],
    follow: ["How does group-hover work?"],
    points: [
      "Prefix:utility pattern",
      "Variants can stack",
      "Cover focus and disabled states",
      "group and peer for related elements",
    ],
    notes: ["state:utility."],
    src: [
      [
        "Tailwind CSS: Hover, focus, and other states",
        `${T}/hover-focus-and-other-states`,
      ],
    ],
  }),
  q({
    slug: "tailwind-responsive-mobile-first",
    topic: "Tailwind CSS",
    d: "medium",
    title: "How does responsive design work in Tailwind?",
    kw: ["responsive", "breakpoints", "sm md lg", "mobile-first", "min-width"],
    intent:
      "Checks you know the mobile-first direction of Tailwind breakpoints.",
    short:
      "Tailwind is mobile-first. A utility with no prefix applies at all sizes, and prefixes such as `sm:`, `md:`, `lg:`, `xl:` and `2xl:` apply from that breakpoint upwards, using a `min-width` media query. So `w-full md:w-1/2` means full width on small screens and half width from the `md` breakpoint (768px) up. Style the smallest screen first, then add overrides as the screen grows. To target only small screens you override upwards instead of using `sm:`.",
    detail: [
      "A common mistake is using `sm:` to mean 'on phones'; it means 'at 640px and up'.",
      "Breakpoints can be customised in the theme.",
      "Layout utilities such as `grid-cols-1 md:grid-cols-3` change the grid per size.",
    ],
    ex: "A card list uses `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`.",
    code: [
      [
        "Responsive grid",
        "tsx",
        `<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">\n  ...\n</ul>`,
        [
          "One column by default.",
          "Two columns from `md`.",
          "Three from `lg`.",
        ],
      ],
    ],
    mistakes: [
      "Thinking sm: means phones only.",
      "Writing desktop styles first and trying to undo them.",
    ],
    follow: ["What media query does md: generate?"],
    points: [
      "Mobile-first",
      "Prefix = from this size up",
      "Unprefixed applies everywhere",
      "Breakpoints are customisable",
    ],
    notes: ["Unprefixed = small; prefix = this size and up."],
    src: [["Tailwind CSS: Responsive design", `${T}/responsive-design`]],
  }),
  q({
    slug: "tailwind-dark-mode",
    topic: "Tailwind CSS",
    d: "medium",
    title: "How do you support dark mode with Tailwind?",
    kw: [
      "dark mode",
      "dark variant",
      "prefers-color-scheme",
      "class strategy",
      "theme toggle",
    ],
    intent: "Checks you can theme and let users toggle it.",
    short:
      "Use the `dark:` variant to set styles for dark mode, for example `bg-white dark:bg-gray-900`. By default it follows the operating system's `prefers-color-scheme`. To let users toggle the theme manually, redefine the `dark` variant to depend on a class or data attribute on an ancestor, for instance with `@custom-variant dark (&:where(.dark, .dark *))`, and add or remove that class from JavaScript, saving the choice. Combining design tokens with CSS variables can reduce the number of `dark:` classes.",
    detail: [
      "Remember to check colour contrast in both themes.",
      "Store the user's choice in `localStorage` and apply it early to avoid a flash of the wrong theme.",
      "Respect the system setting as the default.",
    ],
    ex: "A site follows the system theme at first, and a toggle in the header switches a `dark` class on `html`.",
    mistakes: [
      "Only styling the light theme and getting unreadable dark pages.",
      "Applying the stored theme late so the page flashes.",
    ],
    follow: ["How do you avoid a flash of the wrong theme?"],
    points: [
      "dark: variant",
      "Follows system by default",
      "Class or attribute strategy for toggles",
      "Check contrast in both themes",
    ],
    notes: ["dark: plus a toggle class."],
    src: [["Tailwind CSS: Dark mode", `${T}/dark-mode`]],
  }),
  q({
    slug: "tailwind-theme-customisation",
    topic: "Tailwind CSS",
    d: "medium",
    title:
      "How do you customise colours and spacing with the @theme directive?",
    kw: ["@theme", "design tokens", "custom colors", "css variables", "theme"],
    intent:
      "Checks you can extend the design system in the current Tailwind version.",
    short:
      "In Tailwind v4 you declare design tokens in CSS inside an `@theme` block, using variables with namespaced names, such as `--color-brand: #0a7;`. Tailwind generates matching utilities (`bg-brand`, `text-brand`) and also exposes the values as CSS variables. You can add new tokens or override the defaults. This keeps the design system in one place and makes it available both as classes and as plain CSS variables.",
    detail: [
      "Namespaces such as `--color-*`, `--font-*` and `--breakpoint-*` determine which utilities are created.",
      "Arbitrary values like `w-[137px]` are available for one-offs, but too many suggest a missing token.",
      "Brand colours defined once avoid scattering hex values through the code.",
    ],
    ex: "A project defines `--color-brand` once and uses `bg-brand` and `text-brand` everywhere.",
    code: [
      [
        "Add a token",
        "css",
        `@import "tailwindcss";\n\n@theme {\n  --color-brand: #0a7;\n  --font-display: "Inter", sans-serif;\n}`,
        [
          "`--color-brand` creates `bg-brand`, `text-brand` and similar utilities.",
          "The font token creates `font-display`.",
        ],
      ],
    ],
    mistakes: [
      "Scattering hard-coded hex values through class names.",
      "Using the old JavaScript theme.extend approach in v4 code.",
    ],
    follow: ["When is an arbitrary value fine?"],
    points: [
      "@theme in CSS",
      "Namespaced variables",
      "Generates utilities",
      "Single place for tokens",
    ],
    notes: ["Tokens in @theme."],
    src: [
      ["Tailwind CSS: Theme variables", `${T}/theme`],
      ["Tailwind CSS: Adding custom styles", `${T}/adding-custom-styles`],
    ],
  }),
  q({
    slug: "tailwind-dynamic-class-names",
    topic: "Tailwind CSS",
    d: "hard",
    title:
      "Why can't you build Tailwind class names dynamically with string concatenation?",
    kw: [
      "dynamic classes",
      "class detection",
      "source scanning",
      "template literals",
      "safelist",
    ],
    intent: "Checks you understand how Tailwind finds the classes to generate.",
    short:
      'Tailwind scans your source files as plain text and generates CSS for the complete class names it finds. It does not run your code, so a class assembled at runtime, such as `` `text-${color}-500` ``, is never seen as a whole and its CSS is not generated. Always write complete class names, for example by mapping a prop to full strings: `{ red: "text-red-500", blue: "text-blue-500" }[color]`. Conditional full class names in `clsx`-style helpers work fine.',
    detail: [
      "Anything that contains the whole class string in the source is detected.",
      "Sources not scanned by default can be added with the `@source` directive.",
      "Truly dynamic values, such as colours from a database, should use inline styles or CSS variables.",
    ],
    ex: "A badge component maps `status` to complete classes so the build includes every possible colour.",
    code: [
      [
        "Full class names",
        "tsx",
        `const colors = {\n  ok: "bg-green-100 text-green-800",\n  error: "bg-red-100 text-red-800",\n}\n\n<span className={colors[status]}>{label}</span>`,
        [
          "Every class appears in full in the source.",
          "The lookup chooses between them at runtime.",
        ],
      ],
    ],
    mistakes: [
      "Concatenating partial class names.",
      "Expecting arbitrary runtime values to produce CSS.",
    ],
    follow: ["How would you style from a database colour?"],
    points: [
      "Tailwind scans text, not runtime",
      "Write full class names",
      "Map props to full strings",
      "Inline style or CSS variables for truly dynamic values",
    ],
    notes: ["Complete strings only."],
    src: [
      [
        "Tailwind CSS: Detecting classes in source files",
        `${T}/detecting-classes-in-source-files`,
      ],
    ],
  }),
  q({
    slug: "tailwind-reuse-components-vs-apply",
    topic: "Tailwind CSS",
    d: "medium",
    title: "How do you avoid repeating long class lists in Tailwind?",
    kw: ["reuse", "components", "@apply", "duplication", "abstraction"],
    intent: "Checks you reuse patterns with the right tool.",
    short:
      "First, extract a component, such as a React `Button`, so the class list is written once and reused everywhere. Loops and template partials work the same way. Multi-cursor editing helps with repeated markup in one file. Using `@apply` inside CSS to build custom class names is possible but the documentation treats it as a last resort, since it brings back naming and separate-file problems. Tokens belong in `@theme`.",
    detail: [
      "Components keep markup, behaviour and styles together.",
      "Variant props like `size` and `intent` map to class sets.",
      "Do not over-abstract after seeing a pattern only twice.",
    ],
    ex: "A `Button` component takes a `variant` prop and maps it to class strings, used across the app.",
    mistakes: [
      "Replacing all utilities with @apply classes.",
      "Duplicating a long class list in dozens of files.",
    ],
    follow: ["What belongs in @theme instead?"],
    points: [
      "Extract components first",
      "Variants via props",
      "@apply only as a last resort",
      "Tokens in @theme",
    ],
    notes: ["Component, not @apply."],
    src: [
      ["Tailwind CSS: Reusing styles", `${T}/reusing-styles`],
      [
        "Tailwind CSS: Functions and directives",
        `${T}/functions-and-directives`,
      ],
    ],
  }),
  q({
    slug: "tailwind-preflight",
    topic: "Tailwind CSS",
    d: "easy",
    title:
      "What is Preflight in Tailwind and why does a heading look unstyled?",
    kw: ["preflight", "css reset", "base styles", "headings", "normalize"],
    intent: "Checks you know Tailwind resets browser defaults.",
    short:
      "Preflight is Tailwind's set of base styles, applied automatically, that removes browser defaults to give a consistent starting point. Headings lose their size and weight, lists lose bullets, margins are removed and images become block elements. That is why an `h1` looks like normal text until you add classes such as `text-3xl font-bold`. It is built on top of modern-normalize, and you can add your own base styles in a `@layer base` block.",
    detail: [
      "Having no default styles avoids fighting the browser stylesheet.",
      "Semantic elements still keep their meaning for accessibility, even if they look plain.",
      "Typography plugins can bring back prose styling for content.",
    ],
    ex: "Rendering markdown content looks flat until a typography class or base styles are added for headings and lists.",
    mistakes: [
      "Replacing semantic headings with divs because they 'look wrong'.",
      "Expecting default bullets on lists.",
    ],
    follow: ["Where would you add your own base styles?"],
    points: [
      "Automatic reset",
      "Removes default heading and list styles",
      "Based on modern-normalize",
      "Semantics remain",
    ],
    notes: ["Style it yourself; keep the element."],
    src: [["Tailwind CSS: Preflight", `${T}/preflight`]],
  }),
  q({
    slug: "tailwind-flex-grid-utilities",
    topic: "Tailwind CSS",
    d: "easy",
    title: "How do you build layouts with Tailwind's flex and grid utilities?",
    kw: ["flex", "grid", "gap", "justify-between", "items-center"],
    intent: "Checks you can map CSS layout knowledge to utility classes.",
    short:
      "Tailwind exposes each CSS layout property as a utility. `flex` makes a flex container, with `flex-col` for a column, `justify-between` and `items-center` for alignment, and `gap-4` for spacing. `grid` creates a grid with `grid-cols-3` for three columns, and `col-span-2` lets an item span columns. These map one-to-one to the underlying CSS, so knowing flexbox and grid is what matters.",
    detail: [
      "`flex-1` sets `flex: 1` so an item fills the remaining space.",
      "Spacing uses the numeric scale, where `4` is 1rem by default.",
      "Combine with responsive prefixes to change the layout by size.",
    ],
    ex: "A header is `flex items-center justify-between` with the logo on one side and the menu on the other.",
    code: [
      [
        "A header bar",
        "tsx",
        `<header className="flex items-center justify-between px-4 py-3">\n  <Logo />\n  <nav className="flex gap-4">...</nav>\n</header>`,
        [
          "`flex` and `justify-between` push the two parts apart.",
          "`items-center` aligns them vertically.",
          "`gap-4` spaces the links.",
        ],
      ],
    ],
    mistakes: [
      "Learning class names without learning the CSS behind them.",
      "Missing `flex` on the container and expecting alignment classes to work.",
    ],
    follow: ["What does flex-1 do?"],
    points: [
      "One utility per CSS property",
      "flex, grid, gap",
      "justify and items for alignment",
      "Knowledge of CSS still needed",
    ],
    notes: ["Classes mirror CSS."],
    src: [
      ["Tailwind CSS: flex", `${T}/flex`],
      ["Tailwind CSS: grid-template-columns", `${T}/grid-template-columns`],
    ],
  }),
  q({
    slug: "tailwind-group-and-peer",
    topic: "Tailwind CSS",
    d: "medium",
    title: "What are the group and peer variants in Tailwind?",
    kw: ["group", "peer", "group-hover", "peer-checked", "sibling state"],
    intent:
      "Checks you can style an element from the state of a related element.",
    short:
      "Plain variants react to the state of the element itself. To style a child when its parent is hovered or focused, mark the parent with the `group` class and use `group-hover:` or `group-focus:` on the child. To style an element based on the state of a previous sibling, mark that sibling with `peer` and use `peer-checked:` or `peer-invalid:` on the later element. Both patterns avoid JavaScript for common effects like a hover card or a custom checkbox.",
    detail: [
      "The peer must come before the element being styled in the DOM.",
      "Named groups, such as `group/item`, avoid confusion when groups are nested.",
      "Keep keyboard and screen reader behaviour in mind for custom controls built this way.",
    ],
    ex: "A card shows an arrow icon only when the whole card is hovered, using `group` on the card and `group-hover:opacity-100` on the icon.",
    code: [
      [
        "group-hover",
        "tsx",
        `<a className="group flex items-center gap-2" href="/docs">
  Read more
  <span className="opacity-0 transition group-hover:opacity-100">→</span>
</a>`,
        [
          "`group` marks the parent.",
          "The arrow reacts when the parent is hovered.",
        ],
      ],
    ],
    mistakes: [
      "Placing the peer element after the styled element.",
      "Nesting groups without names.",
    ],
    follow: ["How do you name a group?"],
    points: [
      "group: parent state affects children",
      "peer: sibling state affects later siblings",
      "Peer must come first",
      "Named groups for nesting",
    ],
    notes: ["group = parent, peer = earlier sibling."],
    src: [
      [
        "Tailwind CSS: Hover, focus, and other states",
        `${T}/hover-focus-and-other-states`,
      ],
    ],
  }),
  q({
    slug: "tailwind-arbitrary-values",
    topic: "Tailwind CSS",
    d: "medium",
    title:
      "What are arbitrary values in Tailwind and when should you use them?",
    kw: [
      "arbitrary values",
      "square brackets",
      "one-off",
      "w-[137px]",
      "design scale",
    ],
    intent: "Checks you know the escape hatch and its trade-off.",
    short:
      "Arbitrary values let you use a one-off value that is not in the design scale by putting it in square brackets: `w-[137px]`, `bg-[#1da1f2]`, `top-[117px]`, `grid-cols-[1fr_2fr]`. They generate the exact CSS without leaving the markup. They are good for rare, specific cases, but using many of them means the values should be tokens in `@theme` instead, so the design stays consistent.",
    detail: [
      "Spaces inside the brackets are written as underscores.",
      "Arbitrary variants and CSS variable references, such as `bg-(--my-colour)`, also exist in version 4.",
      "The full class must still be written out so that Tailwind can detect it.",
    ],
    ex: "A decorative shape is placed with `left-[13%]` once, while the brand colour used everywhere is defined as a theme token.",
    mistakes: [
      "Using arbitrary values for everything instead of tokens.",
      "Building the bracket value from variables at runtime.",
    ],
    follow: ["When should an arbitrary value become a token?"],
    points: [
      "Square bracket syntax",
      "Exact one-off values",
      "Tokens for repeated values",
      "Written in full for detection",
    ],
    notes: ["One-off: brackets; repeated: token."],
    src: [["Tailwind CSS: Adding custom styles", `${T}/adding-custom-styles`]],
  }),
  q({
    slug: "what-is-shadcn-ui",
    topic: "shadcn/ui",
    d: "easy",
    title:
      "What is shadcn/ui and how is it different from a normal component library?",
    kw: [
      "shadcn/ui",
      "open code",
      "component library",
      "copy components",
      "ownership",
    ],
    intent: "Checks you understand the code-ownership model.",
    short:
      "shadcn/ui is a set of accessible, well-designed components and a code distribution system. Its documentation says it is not a component library but how you build your own. Instead of installing a package and importing from it, you add components to your project, so you get the actual source code in your repository and can edit it directly. That removes the need to override styles or wrap components, and means you own and maintain the code.",
    detail: [
      "The components are styled with Tailwind CSS.",
      "You add only the components you need.",
      "Because the code is yours, updates from upstream are not automatic and are pulled in deliberately.",
    ],
    ex: "A team adds the Button and Dialog components, then edits the Button's variants to match its design system.",
    mistakes: [
      "Expecting npm updates to change the components automatically.",
      "Treating it as a black-box dependency.",
    ],
    follow: ["How do you get updates for a component you customised?"],
    points: [
      "Components copied into your project",
      "You own and edit the code",
      "Styled with Tailwind",
      "Add only what you need",
    ],
    notes: ["Open code, not a package."],
    src: [["shadcn/ui: Introduction", `${S}`]],
  }),
  q({
    slug: "shadcn-cli-init-add",
    topic: "shadcn/ui",
    d: "easy",
    title: "How do you set up shadcn/ui and add components with the CLI?",
    kw: ["shadcn cli", "init", "add", "components.json", "cn utility"],
    intent: "Checks you know the CLI workflow.",
    short:
      "Run `npx shadcn@latest init` in an existing project (or `pnpm dlx shadcn@latest init`). It installs the needed dependencies, adds the `cn` utility and configures CSS variables, and creates the `components.json` configuration file. Then `shadcn add button` copies the Button component source into your project, installing any dependencies it needs. The `components.json` file is only required when using the CLI; the copy-and-paste method needs no config.",
    detail: [
      "`add` takes one or more component names, and `--overwrite` replaces existing files.",
      "`--dry-run` previews changes before writing files.",
      "The components land in your source tree, where you can edit them.",
    ],
    ex: "`shadcn add dialog` puts a `dialog` component file into the project's components folder.",
    code: [
      [
        "CLI workflow",
        "bash",
        `pnpm dlx shadcn@latest init\npnpm dlx shadcn@latest add button dialog`,
        [
          "`init` configures the project.",
          "`add` copies the chosen components in.",
        ],
      ],
    ],
    mistakes: [
      "Editing a component and then overwriting it by re-running add.",
      "Not committing the generated components.",
    ],
    follow: ["What does components.json hold?"],
    points: [
      "init configures the project",
      "add copies component code",
      "components.json is for the CLI",
      "--dry-run previews",
    ],
    notes: ["init once, add as needed."],
    src: [
      ["shadcn/ui: CLI", `${S}/cli`],
      ["shadcn/ui: components.json", `${S}/components-json`],
    ],
  }),
  q({
    slug: "shadcn-theming-css-variables",
    topic: "shadcn/ui",
    d: "medium",
    title: "How does theming work in shadcn/ui?",
    kw: [
      "theming",
      "css variables",
      "semantic tokens",
      "primary foreground",
      "dark mode",
    ],
    intent: "Checks you know that theming is done through semantic tokens.",
    short:
      "shadcn/ui uses CSS variables for theming. It defines semantic tokens in pairs, a surface and the text colour on it: `background`/`foreground`, `primary`/`primary-foreground`, and so on. Components use utilities like `bg-primary text-primary-foreground`, so changing the variable values in your CSS changes the look of the whole app without touching component classes. Dark mode overrides the same variables inside a `.dark` selector.",
    detail: [
      "Tokens live under `:root` and `.dark` in the global CSS file.",
      "Tailwind maps the variables into utilities such as `bg-background` and `border-border`.",
      "A theme provider toggles the `dark` class.",
    ],
    ex: "Changing `--primary` in the CSS recolours every primary button at once.",
    code: [
      [
        "Semantic tokens",
        "tsx",
        `<div className="bg-primary text-primary-foreground">Hello</div>`,
        [
          "`bg-primary` uses the `--primary` variable.",
          "`text-primary-foreground` is the colour that sits on it.",
        ],
      ],
    ],
    mistakes: [
      "Hard-coding colours in components instead of using tokens.",
      "Forgetting the foreground pair and getting unreadable text.",
    ],
    follow: ["How does dark mode change these values?"],
    points: [
      "CSS variables as tokens",
      "Surface and foreground pairs",
      "Override under .dark",
      "Change values, not classes",
    ],
    notes: ["Token pairs: primary and primary-foreground."],
    src: [
      ["shadcn/ui: Theming", `${S}/theming`],
      ["shadcn/ui: Dark mode", `${S}/dark-mode`],
    ],
  }),
  q({
    slug: "shadcn-customising-components",
    topic: "shadcn/ui",
    d: "medium",
    title:
      "How do you customise a shadcn/ui component, such as a Button variant?",
    kw: [
      "customise component",
      "variants",
      "cn",
      "class variance",
      "open code",
    ],
    intent: "Checks you know customisation means editing your own copy.",
    short:
      "Because the component source is in your project, you customise it by editing the file: change the base classes, add a new variant such as `danger`, or adjust sizes. Components accept a `className` prop and merge it with their defaults using the `cn` helper, so a call site can adjust a single instance without touching the file. Keep shared decisions in the component and one-off tweaks at the call site.",
    detail: [
      "The `cn` helper combines class names and resolves conflicting Tailwind classes.",
      "Variants are usually defined in one place, so adding one is a small edit.",
      "Document any deliberate divergence from upstream to ease future updates.",
    ],
    ex: "A project adds a `success` variant to Button and uses it for confirmation actions.",
    mistakes: [
      "Overriding with many `!important` classes instead of editing the component.",
      "Customising each usage separately.",
    ],
    follow: ["What does the cn helper do?"],
    points: [
      "Edit the component source",
      "className merges via cn",
      "Add variants in one place",
      "One-offs at the call site",
    ],
    notes: ["It is your code now."],
    src: [
      ["shadcn/ui: Introduction", `${S}`],
      ["shadcn/ui: Button", `${S}/components/button`],
    ],
  }),
  q({
    slug: "shadcn-accessible-primitives",
    topic: "shadcn/ui",
    d: "medium",
    title:
      "Why does it matter that shadcn/ui components are accessible, and what remains your job?",
    kw: ["accessibility", "dialog", "keyboard", "aria", "focus management"],
    intent:
      "Checks you know library components help but do not guarantee an accessible app.",
    short:
      "Components such as Dialog, Select and Tabs need correct keyboard handling, focus management and ARIA attributes, which are hard to build by hand. shadcn/ui provides accessible components so you start from a good base. Your job remains to give controls proper labels, meaningful text, sensible heading structure, enough colour contrast in your theme, and to test with the keyboard. A component cannot add a label that you leave out.",
    detail: [
      "Dialogs should have a title so that screen readers announce their purpose.",
      "Icon-only buttons need an accessible name.",
      "Automated checks such as axe catch only part of the problems, so also test manually.",
    ],
    ex: "An icon-only close button gets an `aria-label` or visually hidden text, even though the Dialog handles focus trapping.",
    mistakes: [
      "Assuming a library makes the whole page accessible.",
      "Icon buttons with no name.",
    ],
    follow: ["What does a dialog need besides focus handling?"],
    points: [
      "Complex widgets need keyboard and ARIA support",
      "Library gives a base",
      "You supply labels and contrast",
      "Test with the keyboard",
    ],
    notes: ["Library helps; labels are yours."],
    src: [
      ["shadcn/ui: Dialog", `${S}/components/dialog`],
      ["shadcn/ui: Introduction", `${S}`],
    ],
  }),
  q({
    slug: "shadcn-forms-and-data-table",
    topic: "shadcn/ui",
    d: "hard",
    title: "How do shadcn/ui components fit with forms and tables?",
    kw: [
      "shadcn form",
      "react hook form",
      "data table",
      "tanstack table",
      "composition",
    ],
    intent:
      "Checks you know the library composes with other libraries instead of replacing them.",
    short:
      "shadcn/ui does not implement its own form state or table engine; it composes with specialised libraries. Its form examples show building forms with React Hook Form and Zod while using shadcn components for the fields and error messages, and its Data Table guide shows combining a styled table with TanStack Table, which provides sorting, filtering and pagination. The shadcn layer provides the UI; the other library provides the logic.",
    detail: [
      "The documentation pages give example code that you copy and adapt.",
      "Keeping logic and presentation separate makes either layer replaceable.",
      "Check the current docs for the recommended form approach, since it can change.",
    ],
    ex: "A users table uses TanStack Table for sorting and pagination, rendered through shadcn table components.",
    mistakes: [
      "Expecting built-in validation or sorting from the UI components alone.",
      "Copying examples without understanding the underlying library.",
    ],
    follow: ["Which library provides the table logic?"],
    points: [
      "UI layer only",
      "React Hook Form and Zod for forms",
      "TanStack Table for data tables",
      "Logic and presentation separated",
    ],
    notes: ["shadcn styles it; another library drives it."],
    src: [
      ["shadcn/ui: Data Table", `${S}/components/data-table`],
      ["shadcn/ui: Form", `${S}/components/form`],
    ],
  }),
  q({
    slug: "shadcn-charts-recharts",
    topic: "shadcn/ui",
    d: "medium",
    title: "How do shadcn/ui charts relate to Recharts?",
    kw: [
      "shadcn chart",
      "recharts",
      "chart component",
      "chart config",
      "theming",
    ],
    intent: "Checks you know shadcn charts are a layer on Recharts.",
    short:
      "The shadcn/ui Chart component is built on Recharts. Rather than wrapping every Recharts feature, it provides a small set of helpers, for example a container with a config for series labels and colours, and styled tooltip and legend content, while you compose the actual Recharts chart components such as `BarChart` and `Bar` yourself. Colours come from the theme's CSS variables, so charts follow light and dark themes.",
    detail: [
      "You still need to understand Recharts' data and `dataKey` model.",
      "The config object maps series keys to labels and colours.",
      "Because the code is in your project, you can adjust the helpers.",
    ],
    ex: "A dashboard's bar chart uses the Recharts `BarChart` with shadcn's tooltip styling and theme colours.",
    mistakes: [
      "Assuming there is a separate charting engine.",
      "Hard-coding colours rather than using the theme.",
    ],
    follow: ["Where do the series colours come from?"],
    points: [
      "Built on Recharts",
      "Config maps keys to labels and colours",
      "Themed tooltip and legend",
      "Compose Recharts parts yourself",
    ],
    notes: ["shadcn Chart = Recharts plus theme helpers."],
    src: [
      ["shadcn/ui: Chart", `${S}/components/chart`],
      ["Recharts: Getting started", `${R}/guide/getting-started/`],
    ],
  }),
  q({
    slug: "recharts-what-and-basic-chart",
    topic: "Recharts",
    d: "easy",
    title: "What is Recharts and how do you draw a basic line chart?",
    kw: ["recharts", "LineChart", "dataKey", "xaxis", "data array"],
    intent: "Checks you can compose a chart from declarative React components.",
    short:
      "Recharts is a charting library built with React components that render SVG. You pass an array of objects as `data` to a chart component such as `LineChart`, and compose children: `XAxis` and `YAxis`, `CartesianGrid`, `Tooltip`, `Legend` and one or more `Line` series. Each element's `dataKey` names the property of the data objects that it should read, so the chart is described declaratively in JSX.",
    detail: [
      "The chart needs a width and height, usually supplied by a `ResponsiveContainer`.",
      'Data points are plain objects, such as `{ month: "Jan", sales: 120 }`.',
      "Other chart types follow the same pattern: `BarChart`, `AreaChart`, `PieChart`.",
    ],
    ex: "A sales dashboard maps `month` to the X axis and `sales` to a line.",
    code: [
      [
        "A line chart",
        "tsx",
        `const data = [\n  { month: "Jan", sales: 120 },\n  { month: "Feb", sales: 180 },\n]\n\n<LineChart width={500} height={300} data={data}>\n  <CartesianGrid strokeDasharray="3 3" />\n  <XAxis dataKey="month" />\n  <YAxis />\n  <Tooltip />\n  <Line type="monotone" dataKey="sales" stroke="#2563eb" />\n</LineChart>`,
        [
          "`data` is an array of objects.",
          "`dataKey` connects the axis and line to fields.",
          "Child components add grid, axes and tooltip.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting dataKey so nothing is drawn.",
      "Giving the chart no size.",
    ],
    follow: ["How do you make the chart fill its container?"],
    points: [
      "React components rendering SVG",
      "data array plus children",
      "dataKey selects fields",
      "Declarative composition",
    ],
    notes: ["data + dataKey."],
    src: [
      ["Recharts: Getting started", `${R}/guide/getting-started/`],
      ["Recharts: LineChart", `${R}/api/LineChart/`],
      ["Recharts: Line", `${R}/api/Line/`],
    ],
  }),
  q({
    slug: "recharts-responsive-container",
    topic: "Recharts",
    d: "medium",
    title: "How do you make a Recharts chart responsive?",
    kw: [
      "ResponsiveContainer",
      "responsive chart",
      "width 100%",
      "parent height",
      "resize",
    ],
    intent: "Checks you know the common sizing pitfall.",
    short:
      'Wrap the chart in `ResponsiveContainer`, giving it `width="100%"` and a `height`, and it makes the chart fill its parent and resize with it. The parent element must itself have a defined size, because a container with percentage height inside a parent with no height collapses to zero and the chart is invisible. Charts must be given dimensions one way or another.',
    detail: [
      "A fixed `height` such as 300 on the container is the simplest reliable approach.",
      "In Flex or Grid layouts a parent may also need `min-width: 0` so it can shrink.",
      "Test the chart by resizing the window.",
    ],
    ex: "A dashboard card has a 320px high area, and the chart inside it fills the card's width at any screen size.",
    code: [
      [
        "Responsive wrapper",
        "tsx",
        `<div style={{ height: 320 }}>\n  <ResponsiveContainer width="100%" height="100%">\n    <BarChart data={data}>\n      <XAxis dataKey="month" />\n      <Bar dataKey="sales" fill="#2563eb" />\n    </BarChart>\n  </ResponsiveContainer>\n</div>`,
        [
          "The parent has a real height.",
          "The container sizes the chart to it.",
        ],
      ],
    ],
    mistakes: [
      "A percentage height inside a parent with no height, so nothing renders.",
      "Mixing fixed width props with the container.",
    ],
    follow: ["Why might the chart be invisible?"],
    points: [
      "ResponsiveContainer fills the parent",
      "Parent needs a defined size",
      "Set width and height on the container",
      "Test by resizing",
    ],
    notes: ["Parent needs a height."],
    src: [["Recharts: ResponsiveContainer", `${R}/api/ResponsiveContainer/`]],
  }),
  q({
    slug: "recharts-bar-chart-and-cells",
    topic: "Recharts",
    d: "medium",
    title: "How do you draw a bar chart and colour individual bars?",
    kw: ["BarChart", "Bar", "Cell", "fill", "categories"],
    intent: "Checks you can build and style a categorical chart.",
    short:
      "Use `BarChart` with `data`, an `XAxis` whose `dataKey` is the category field, and a `Bar` whose `dataKey` is the value field. Set a single colour with `fill`. To colour individual bars differently, render a `Cell` for each data point inside `Bar` and give each its own `fill`. Add `Tooltip` and `Legend` for details. Multiple `Bar` elements with different `dataKey`s draw grouped bars.",
    detail: [
      "`stackId` on several bars stacks them instead of grouping.",
      "Colour should not be the only way to convey meaning; add labels or patterns.",
      "Sort categories sensibly, such as by value or by time.",
    ],
    ex: "A bar chart of orders per status uses a green bar for delivered and red for cancelled.",
    code: [
      [
        "Colouring bars",
        "tsx",
        `<BarChart data={data}>\n  <XAxis dataKey="status" />\n  <YAxis />\n  <Bar dataKey="count">\n    {data.map((d) => (\n      <Cell key={d.status} fill={d.status === "cancelled" ? "#dc2626" : "#16a34a"} />\n    ))}\n  </Bar>\n</BarChart>`,
        [
          "`Bar` reads `count`.",
          "Each `Cell` overrides the colour of its bar.",
        ],
      ],
    ],
    mistakes: [
      "Using colour alone to carry meaning.",
      "Forgetting a key on mapped Cell elements.",
    ],
    follow: ["How do you stack bars?"],
    points: [
      "BarChart, XAxis, Bar",
      "fill sets colour",
      "Cell colours individual bars",
      "stackId stacks series",
    ],
    notes: ["Cell per bar for custom colours."],
    src: [
      ["Recharts: BarChart", `${R}/api/BarChart/`],
      ["Recharts: Bar", `${R}/api/Bar/`],
      ["Recharts: Cell", `${R}/api/Cell/`],
    ],
  }),
  q({
    slug: "recharts-pie-chart",
    topic: "Recharts",
    d: "medium",
    title: "How do you build a pie or donut chart in Recharts?",
    kw: ["PieChart", "Pie", "innerRadius", "nameKey", "donut"],
    intent: "Checks you know the props of the proportional chart.",
    short:
      "Use `PieChart` containing a `Pie` with `data`, a `dataKey` for the value, and a `nameKey` for the label. `Cell` elements colour each slice. Setting `innerRadius` greater than zero turns the pie into a donut. Add `Tooltip` and `Legend` for the exact numbers and labels. Pie charts suit a few categories that sum to a whole; for many categories or comparing close values a bar chart reads better.",
    detail: [
      "Slice sizes are calculated from the values automatically.",
      "Limit the number of slices, grouping small ones into 'Other'.",
      "Show the values as text or in the tooltip, not just as angles.",
    ],
    ex: "A donut chart shows the share of tickets by priority, with the total in the middle.",
    code: [
      [
        "Donut chart",
        "tsx",
        `<PieChart width={300} height={300}>\n  <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>\n    {data.map((d, i) => <Cell key={d.name} fill={colors[i % colors.length]} />)}\n  </Pie>\n  <Tooltip />\n</PieChart>`,
        [
          "`dataKey` is the value, `nameKey` the label.",
          "A non-zero `innerRadius` makes the hole.",
        ],
      ],
    ],
    mistakes: [
      "Too many slices.",
      "No labels or tooltip so values are unreadable.",
    ],
    follow: ["When is a bar chart better than a pie?"],
    points: [
      "Pie with dataKey and nameKey",
      "Cell colours slices",
      "innerRadius makes a donut",
      "Few categories only",
    ],
    notes: ["Pie for parts of a whole, few slices."],
    src: [
      ["Recharts: PieChart", `${R}/api/PieChart/`],
      ["Recharts: Pie", `${R}/api/Pie/`],
    ],
  }),
  q({
    slug: "recharts-tooltip-and-legend",
    topic: "Recharts",
    d: "medium",
    title: "How do you customise the Tooltip and Legend in Recharts?",
    kw: ["Tooltip", "Legend", "formatter", "custom content", "label"],
    intent: "Checks you can make chart details readable.",
    short:
      "Add `Tooltip` to show values on hover, and `Legend` to name each series. Use the `formatter` prop to format values (for example currency or units) and `labelFormatter` for the heading. For full control pass a React component to `content`; it receives props such as `active`, `payload` and `label`, and returns your own markup, or null when inactive. Series names come from the `name` prop on `Line`, `Bar` or `Pie`.",
    detail: [
      "A custom tooltip lets you apply the app's styling and theme.",
      "Keep tooltips supplementary; important values should also be visible or available in a table.",
      "Give each series a readable `name` rather than relying on raw field names.",
    ],
    ex: "A revenue chart formats tooltip values as currency and labels dates as 'Mar 2026'.",
    code: [
      [
        "Custom tooltip",
        "tsx",
        `function MoneyTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {\n  if (!active || !payload?.length) return null\n  return <div className="rounded border bg-white p-2">{label}: ₹{payload[0].value}</div>\n}\n\n<Tooltip content={<MoneyTooltip />} />`,
        [
          "The component receives the hovered data.",
          "It returns null when nothing is hovered.",
        ],
      ],
    ],
    mistakes: [
      "Raw field names in the legend.",
      "Relying on hover alone for essential values.",
    ],
    follow: ["What does the formatter prop do?"],
    points: [
      "Tooltip shows values on hover",
      "Legend names series",
      "formatter and labelFormatter",
      "content for full custom markup",
    ],
    notes: ["Name series; format values."],
    src: [
      ["Recharts: Tooltip", `${R}/api/Tooltip/`],
      ["Recharts: Legend", `${R}/api/Legend/`],
    ],
  }),
  q({
    slug: "recharts-data-shape-and-loading",
    topic: "Recharts",
    d: "easy",
    title:
      "How should data be prepared for a Recharts chart, and what about loading states?",
    kw: ["chart data", "data shape", "empty state", "loading", "transform"],
    intent: "Checks you prepare data before charting and handle empty cases.",
    short:
      'Recharts expects an array of flat objects, one per point or category, such as `{ month: "Jan", sales: 120, refunds: 8 }`. Transform API data into that shape before passing it in, and memoise the transformation if it is expensive. Handle states around the chart: show a skeleton while loading, a clear message when the data array is empty, and an error message on failure, rather than rendering an empty chart area.',
    detail: [
      "Parse dates and numbers to the right types; numbers sent as strings may not scale correctly.",
      "Aggregate on the server for large datasets instead of sending every row.",
      "Keys used in `dataKey` must match the property names exactly.",
    ],
    ex: "Raw orders are grouped by month on the server, and the page maps the response into `{ month, total }` objects.",
    mistakes: [
      "Passing nested, unflattened API responses.",
      "Showing a blank chart when there is no data.",
    ],
    follow: ["Why aggregate on the server?"],
    points: [
      "Flat array of objects",
      "Correct types",
      "Handle loading, empty and error states",
      "Match dataKey names",
    ],
    notes: ["Shape data first."],
    src: [
      ["Recharts: Getting started", `${R}/guide/getting-started/`],
      ["Recharts: LineChart", `${R}/api/LineChart/`],
    ],
  }),
  q({
    slug: "recharts-chart-accessibility",
    topic: "Recharts",
    d: "hard",
    title: "How do you make charts more accessible?",
    kw: [
      "chart accessibility",
      "data table",
      "colour contrast",
      "text alternative",
      "keyboard",
    ],
    intent: "Checks you consider users who cannot rely on seeing the visual.",
    short:
      "A chart is a visual summary, so provide the same information in another form: a heading and a short text summary of the key insight, and a data table or downloadable data as an alternative. Do not rely on colour alone: use distinct shapes, patterns or direct labels, and check contrast against the background. Make sure tooltips are not the only way to reach values. Test with the keyboard and a screen reader, and check what the library supports in its current docs.",
    detail: [
      "A caption such as 'Sales rose 20% between January and March' states the point of the chart.",
      "Charts rendered as SVG can be given a title and description.",
      "Avoid red and green as the only distinction.",
    ],
    ex: "A dashboard chart is accompanied by a collapsible table of the same numbers and a one-line summary above it.",
    mistakes: ["No text alternative.", "Distinguishing lines only by colour."],
    follow: ["What alternative would you offer for a screen reader user?"],
    points: [
      "Provide a text summary",
      "Offer a data table",
      "Do not rely on colour alone",
      "Do not hide values behind hover",
    ],
    notes: ["Chart plus words plus table."],
    src: [
      [
        "W3C WAI: Images tutorial",
        "https://www.w3.org/WAI/tutorials/images/decision-tree/",
      ],
      [
        "W3C: WCAG 2 quick reference",
        "https://www.w3.org/WAI/WCAG22/quickref/",
      ],
    ],
  }),
])
