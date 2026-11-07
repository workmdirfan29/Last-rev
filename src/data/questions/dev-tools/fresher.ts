import { defineQuestions } from "../author"
import { q } from "../compact"

const VS = "https://code.visualstudio.com/docs"
const FG = "https://help.figma.com/hc/en-us/articles"

const figma: Record<string, [string, string]> = {
  frames: [
    "Figma: Frames in Figma Design",
    `${FG}/360041539473-Frames-in-Figma-Design`,
  ],
  components: [
    "Figma: Guide to components",
    `${FG}/360038662654-Guide-to-components-in-Figma`,
  ],
  variants: [
    "Figma: Create and use variants",
    `${FG}/360056440594-Create-and-use-variants`,
  ],
  autoLayout: [
    "Figma: Guide to auto layout",
    `${FG}/1500005554982-Guide-to-auto-layout-in-Figma`,
  ],
  variables: [
    "Figma: Guide to variables",
    `${FG}/15339657135383-Guide-to-variables-in-Figma`,
  ],
  styles: [
    "Figma: Guide to styles",
    `${FG}/360039238753-Guide-to-styles-in-Figma`,
  ],
  devMode: [
    "Figma: Guide to Dev Mode",
    `${FG}/15023124644247-Guide-to-Dev-Mode-in-Figma`,
  ],
  prototyping: [
    "Figma: Guide to prototyping",
    `${FG}/360040314193-Guide-to-prototyping-in-Figma`,
  ],
  libraries: [
    "Figma: Guide to libraries",
    `${FG}/360041051154-Guide-to-libraries-in-Figma`,
  ],
  comments: [
    "Figma: Add comments to files",
    `${FG}/360041068574-Add-comments-to-files`,
  ],
}

export default defineQuestions("dev-tools", "fresher", [
  q({
    slug: "vscode-editor-vs-ide",
    topic: "VS Code",
    d: "easy",
    title:
      "What is Visual Studio Code, and how does it differ from a full IDE?",
    kw: ["vs code", "code editor", "ide", "extensions", "lightweight"],
    intent:
      "A foundation question: checks you know your main tool and what it is built on.",
    short:
      "Visual Studio Code is a free, extensible source-code editor for Windows, macOS and Linux. It provides editing, syntax highlighting, IntelliSense code completion, an integrated terminal, Git integration and debugging out of the box, and becomes a tailored environment for any language by installing extensions from the marketplace. A full IDE such as IntelliJ IDEA bundles heavier built-in language tooling, project models and refactorings, whereas VS Code stays lightweight and relies on extensions and language servers. Many developers use it for JavaScript, TypeScript, Python, Java and web work.",
    detail: [
      "It opens folders and workspaces rather than rigid project files.",
      "Settings and extensions can be shared and synced across machines.",
      "The editor is also usable remotely over SSH and in dev containers.",
    ],
    ex: "A React developer installs ESLint, Prettier and the TypeScript tooling in VS Code and gets a complete workflow.",
    mistakes: [
      "Installing dozens of extensions that slow the editor.",
      "Not learning the keyboard shortcuts.",
    ],
    follow: ["How do extensions add language support?"],
    points: [
      "Free, cross-platform editor",
      "Built-in terminal, Git, debugger",
      "Extensions add languages and tools",
      "Lighter than a full IDE",
    ],
    notes: ["Editor core plus extensions."],
    src: [
      ["VS Code: Getting started", `${VS}/getstarted/getting-started`],
      ["VS Code: User interface", `${VS}/getstarted/userinterface`],
    ],
  }),
  q({
    slug: "vscode-command-palette-shortcuts",
    topic: "VS Code",
    d: "easy",
    title: "Which VS Code features and shortcuts make you faster?",
    kw: [
      "command palette",
      "keyboard shortcuts",
      "quick open",
      "multi-cursor",
      "go to definition",
    ],
    intent: "Checks you work efficiently in your editor.",
    short:
      "The Command Palette (Ctrl or Cmd + Shift + P) runs any command by name, so you rarely need the menus. Quick Open (Ctrl or Cmd + P) jumps to a file by typing part of its name, and `Ctrl+Shift+F` searches across files. Multi-cursor editing (Alt+click or Ctrl/Cmd + D to select the next occurrence) edits many places at once, F12 goes to a definition, Shift+F12 finds references and F2 renames a symbol across the project. `Ctrl+`` toggles the terminal. You can view and change every shortcut in the Keyboard Shortcuts editor.",
    detail: [
      "Learn a few shortcuts for actions you repeat often.",
      "The Explorer, Search, Source Control and Run views sit in the Activity Bar.",
      "Zen mode and split editors help focus.",
    ],
    ex: "Pressing F2 on a variable renames it everywhere in the file or project.",
    mistakes: [
      "Hunting through menus for every action.",
      "Manual find and replace instead of rename symbol.",
    ],
    follow: ["How do you open any file by name?"],
    points: [
      "Command Palette for any command",
      "Quick Open by file name",
      "Multi-cursor and rename symbol",
      "Customisable keybindings",
    ],
    notes: ["Ctrl+Shift+P and Ctrl+P."],
    src: [
      ["VS Code: Tips and tricks", `${VS}/getstarted/tips-and-tricks`],
      ["VS Code: Keyboard shortcuts", `${VS}/getstarted/keybindings`],
    ],
  }),
  q({
    slug: "vscode-extensions-useful",
    topic: "VS Code",
    d: "easy",
    title:
      "How do VS Code extensions work, and which kinds help web developers?",
    kw: ["extensions", "marketplace", "eslint", "prettier", "language server"],
    intent: "Checks you can extend your editor sensibly.",
    short:
      "Extensions add languages, themes, linters, formatters, debuggers and tools, and are installed from the Extensions view or the marketplace; many provide language support through language servers. Useful kinds for web development are a linter such as ESLint, a formatter such as Prettier, language support for your stack, a spell checker and Git helpers. Extensions run with access to your machine, so install ones from trusted publishers, review permissions and ratings, and disable or uninstall ones you do not use. Recommendations can be shared with the team in `.vscode/extensions.json`.",
    detail: [
      "Extensions can be enabled per workspace.",
      "Too many extensions slow start-up; the Running Extensions view shows their cost.",
      "Profiles let you keep different sets for different kinds of work.",
    ],
    ex: "A repository lists recommended extensions so new developers get the same lint and format setup.",
    mistakes: [
      "Installing untrusted extensions.",
      "Conflicting formatters on the same files.",
    ],
    follow: ["How do you share extension recommendations with a team?"],
    points: [
      "Extensions add language and tool support",
      "Linters and formatters are common",
      "Trust publishers",
      "Recommend via extensions.json",
    ],
    notes: ["Install few, trust them."],
    src: [
      [
        "VS Code: Extension Marketplace",
        `${VS}/configure/extensions/extension-marketplace`,
      ],
      ["VS Code: Profiles", `${VS}/configure/profiles`],
    ],
  }),
  q({
    slug: "vscode-settings-workspace-sync",
    topic: "VS Code",
    d: "medium",
    title:
      "How do user settings, workspace settings and Settings Sync work in VS Code?",
    kw: [
      "settings.json",
      "workspace settings",
      ".vscode folder",
      "settings sync",
      "format on save",
    ],
    intent:
      "Checks you can configure the editor for yourself and for a project.",
    short:
      "VS Code has user settings, which apply to every project on your machine, and workspace settings stored in `.vscode/settings.json` inside the project, which override user settings and can be committed so that the whole team shares conventions such as formatter, tab size or `editor.formatOnSave`. You edit them in the Settings UI or directly as JSON. Settings Sync stores your settings, keybindings, extensions and snippets in your account so a new machine can be set up quickly. Profiles let you switch between different configurations, for example one for Python and one for front-end.",
    detail: [
      "Workspace settings take precedence over user settings.",
      "Do not commit personal preferences or secrets in `.vscode`.",
      "Language-specific settings use the `[javascript]` style blocks.",
    ],
    ex: "The project's `.vscode/settings.json` sets Prettier as the default formatter with format on save.",
    code: [
      [
        "Workspace settings",
        "json",
        `{\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode",\n  "files.eol": "\\n"\n}`,
        [
          "Format on save is enabled for this project.",
          "The formatter is chosen by extension id.",
        ],
      ],
    ],
    mistakes: [
      "Committing personal settings.",
      "Different formatters among teammates.",
    ],
    follow: ["Which settings take precedence?"],
    points: [
      "User vs workspace settings",
      ".vscode/settings.json is shareable",
      "Settings Sync across machines",
      "Profiles for different setups",
    ],
    notes: ["Workspace overrides user."],
    src: [
      ["VS Code: Settings", `${VS}/configure/settings`],
      ["VS Code: Settings Sync", `${VS}/configure/settings-sync`],
    ],
  }),
  q({
    slug: "vscode-intellisense-refactoring",
    topic: "VS Code",
    d: "medium",
    title: "What do IntelliSense and refactoring tools in VS Code offer?",
    kw: [
      "intellisense",
      "code completion",
      "rename symbol",
      "quick fix",
      "go to definition",
    ],
    intent: "Checks you use the language tooling for safer edits.",
    short:
      "IntelliSense provides smart completions, parameter hints and hover documentation based on the language and the types it understands; for JavaScript and TypeScript, VS Code uses the TypeScript language service. Navigation features include go to definition, peek definition and find all references. Refactoring features such as rename symbol (F2), extract to function or variable, and organise imports change code consistently across files, and quick fixes (the lightbulb) apply suggested corrections for errors and lint issues. They are safer than manual find and replace because they understand code structure.",
    detail: [
      "TypeScript types improve completions even in JavaScript projects through JSDoc or `jsconfig.json`.",
      "Code actions can run on save.",
      "Always run tests after large refactors.",
    ],
    ex: "Renaming a function with F2 updates every import and call site in the project.",
    mistakes: [
      "Find and replace that changes unrelated text.",
      "Ignoring the problems panel.",
    ],
    follow: ["Why is rename symbol safer than search and replace?"],
    points: [
      "Type-aware completions and hints",
      "Go to definition and references",
      "Rename and extract refactorings",
      "Quick fixes",
    ],
    notes: ["Let the tool understand your code."],
    src: [
      ["VS Code: IntelliSense", `${VS}/editing/intellisense`],
      ["VS Code: Refactoring", `${VS}/editing/refactoring`],
    ],
  }),
  q({
    slug: "vscode-integrated-terminal-tasks",
    topic: "VS Code",
    d: "easy",
    title: "How do you use the integrated terminal and tasks in VS Code?",
    kw: [
      "integrated terminal",
      "tasks.json",
      "run build task",
      "multiple terminals",
      "shell integration",
    ],
    intent: "Checks you can run commands without leaving the editor.",
    short:
      "The integrated terminal opens a shell in the project folder inside the editor (toggle with Ctrl+`), supports multiple terminals, split panes and different shell profiles, and lets you click file paths and links in the output. Tasks, defined in `.vscode/tasks.json`, wrap commands like build, test or lint so that you can run them from the Command Palette (Run Task) or a keyboard shortcut, and problems from the output can appear in the Problems panel. Scripts in `package.json` are also detected as tasks. Use a shared tasks file to make common commands discoverable for the team.",
    detail: [
      "Terminal output links open files at the failing line.",
      "Keep long-running dev servers in their own terminal.",
      "Dev containers and remote windows run the terminal in the remote environment.",
    ],
    ex: "A `build` task runs `npm run build` and reports TypeScript errors in the Problems panel.",
    mistakes: [
      "Running commands in the wrong folder.",
      "Leaving stray dev servers running on ports.",
    ],
    follow: ["Where are tasks defined?"],
    points: [
      "Terminal in the project folder",
      "Multiple terminals and splits",
      "tasks.json for repeatable commands",
      "npm scripts detected as tasks",
    ],
    notes: ["Terminal inside the editor."],
    src: [
      ["VS Code: Terminal basics", `${VS}/terminal/basics`],
      ["VS Code: Tasks", `${VS}/debugtest/tasks`],
    ],
  }),
  q({
    slug: "vscode-source-control-git",
    topic: "VS Code",
    d: "medium",
    title: "How do you use Git inside VS Code?",
    kw: [
      "source control view",
      "stage changes",
      "commit",
      "diff editor",
      "merge conflicts",
    ],
    intent: "Checks you can do daily Git tasks in the editor.",
    short:
      "The Source Control view lists changed files; click one to open a side-by-side diff, stage or unstage files and individual lines or hunks, write a commit message and commit. You can create and switch branches from the status bar, pull, push and sync, and view history through extensions or the timeline. When a merge conflict occurs, VS Code highlights the conflicting sections in the editor with options to accept current, incoming or both changes, or opens a three-way merge editor. The terminal remains available for anything the UI does not cover, and knowing the underlying Git commands matters.",
    detail: [
      "GitHub sign-in lets you clone and work with pull requests.",
      "Staging hunks lets you make small, focused commits.",
      "Review the diff before committing.",
    ],
    ex: "Stage only the lines that belong to the bug fix, commit, then stage the unrelated cleanup separately.",
    mistakes: [
      "Committing everything with 'git add .' without looking.",
      "Resolving conflicts without understanding both sides.",
    ],
    follow: ["How do you resolve a merge conflict in VS Code?"],
    points: [
      "Diff, stage, commit in the UI",
      "Stage hunks and lines",
      "Conflict resolution tools",
      "Terminal for the rest",
    ],
    notes: ["Review the diff, then commit."],
    src: [
      ["VS Code: Source Control overview", `${VS}/sourcecontrol/overview`],
      [
        "VS Code: Resolve merge conflicts",
        `${VS}/sourcecontrol/merge-conflicts`,
      ],
    ],
  }),
  q({
    slug: "vscode-debugging-launch-json",
    topic: "VS Code",
    d: "medium",
    title: "How do you debug code in VS Code?",
    kw: ["launch.json", "breakpoints", "debug console", "attach", "watch"],
    intent: "Checks you can use the integrated debugger.",
    short:
      "Open the Run and Debug view, set breakpoints by clicking the gutter, and start with F5. Simple projects work with the auto-detected configuration, and more control comes from `.vscode/launch.json`, where each configuration says what to launch or attach to, such as a Node script, a Chrome page or a Java application. While paused you can inspect variables, add watch expressions, view the call stack, step over, into and out, use conditional breakpoints and logpoints, and evaluate expressions in the Debug Console. Language support, for Node, Python, Java or others, comes from the built-in debugger or an extension.",
    detail: [
      "Use `--inspect` to attach to an already running Node process.",
      "Compound configurations launch the server and the browser together.",
      "Source maps let you debug TypeScript in place.",
    ],
    ex: "A launch configuration starts the Express app with `NODE_ENV=development`, and a breakpoint pauses inside a route.",
    code: [
      [
        "A Node launch config",
        "json",
        `{\n  "version": "0.2.0",\n  "configurations": [\n    {\n      "type": "node",\n      "request": "launch",\n      "name": "Run server",\n      "program": "\${workspaceFolder}/server.js"\n    }\n  ]\n}`,
        [
          "`type` selects the debugger.",
          "`request` launches or attaches.",
          "`program` is the entry file.",
        ],
      ],
    ],
    mistakes: [
      "Console.log debugging for complex flows.",
      "Wrong working directory in the configuration.",
    ],
    follow: ["What is a logpoint?"],
    points: [
      "Breakpoints and F5",
      "launch.json describes how to start or attach",
      "Inspect, watch, step",
      "Conditional breakpoints and logpoints",
    ],
    notes: ["F5 with a breakpoint."],
    src: [
      ["VS Code: Debugging", `${VS}/debugtest/debugging`],
      ["VS Code: Node.js debugging", `${VS}/nodejs/nodejs-debugging`],
    ],
  }),
  q({
    slug: "vscode-snippets-emmet",
    topic: "VS Code",
    d: "easy",
    title: "What are snippets and Emmet in VS Code?",
    kw: ["snippets", "emmet", "abbreviations", "boilerplate", "tab stops"],
    intent: "Checks you reduce repetitive typing.",
    short:
      "Emmet is built into VS Code: you type a short abbreviation and press Tab to expand it into HTML or CSS, for example `ul>li*3` becomes a list with three items, and `div.card>h2+p` creates a div with a class containing a heading and paragraph. Snippets are templates inserted by a prefix, with tab stops and placeholders so you can fill in the blanks, and you can define your own in a snippets file for code you repeat, such as a React component skeleton. Extensions also provide snippet collections for frameworks.",
    detail: [
      "In React files Emmet works with JSX when enabled.",
      "Snippets can be global or language-specific.",
      "Use them for consistent boilerplate, not to hide poor structure.",
    ],
    ex: "Typing `rafce` (with a React snippets extension) expands to a functional component with an export.",
    mistakes: [
      "Retyping boilerplate by hand.",
      "Snippets so large they hide the real structure.",
    ],
    follow: ["What does ul>li*3 expand to?"],
    points: [
      "Emmet expands abbreviations",
      "Snippets are templates with tab stops",
      "Custom snippets per language",
      "Extensions add collections",
    ],
    notes: ["Type less, expand more."],
    src: [
      ["VS Code: Emmet", `${VS}/editor/emmet`],
      ["VS Code: User-defined snippets", `${VS}/editing/userdefinedsnippets`],
    ],
  }),
  q({
    slug: "vscode-remote-ssh-dev-containers",
    topic: "VS Code",
    d: "hard",
    title: "What are Remote SSH and Dev Containers in VS Code?",
    kw: [
      "remote ssh",
      "dev containers",
      "remote development",
      "devcontainer.json",
      "reproducible environment",
    ],
    intent:
      "Checks you know how to develop on remote machines and in containers.",
    short:
      "Remote development runs the VS Code server on another machine while the interface stays on your computer. Remote - SSH lets you open folders on a Linux server, so editing, the terminal, debugging and extensions all run there, which is handy for working close to the deployed environment. Dev Containers run your workspace inside a Docker container described by `devcontainer.json`, giving every developer an identical, reproducible toolchain with the right Node or Java version and dependencies, with no manual setup. They reduce 'works on my machine' problems and keep your host clean.",
    detail: [
      "Use SSH keys for remote connections.",
      "Dev container configuration is committed with the project.",
      "Forwarded ports let you open the running app in your local browser.",
    ],
    ex: "A new teammate opens the repository in a dev container and gets the same Node version, extensions and database as everyone else.",
    mistakes: [
      "Editing production servers directly over SSH.",
      "Heavy bind mounts on slow file systems.",
    ],
    follow: ["What problem do dev containers solve?"],
    points: [
      "Remote SSH works on a remote machine",
      "Dev containers give reproducible environments",
      "devcontainer.json is shared",
      "Ports are forwarded",
    ],
    notes: ["Same environment for everyone."],
    src: [
      ["VS Code: Remote - SSH", `${VS}/remote/ssh`],
      ["VS Code: Dev Containers", `${VS}/devcontainers/containers`],
    ],
  }),
  q({
    slug: "vscode-linting-formatting-eslint-prettier",
    topic: "VS Code",
    d: "easy",
    title:
      "What is the difference between a linter and a formatter, and how do they work in VS Code?",
    kw: ["eslint", "prettier", "linter", "formatter", "format on save"],
    intent: "Checks you know why consistent style and static checks help.",
    short:
      "A linter such as ESLint analyses code for likely bugs and bad practice, like unused variables, undefined names or missing dependencies in React hooks, and reports them as squiggles and in the Problems panel; many issues have quick fixes. A formatter such as Prettier rewrites code layout (indentation, quotes, line breaks) to one consistent style so reviews focus on logic. In VS Code you install the extensions, configure the formatter as default with format on save, and share the rules through config files in the repository. Running both in CI keeps the codebase consistent.",
    detail: [
      "Formatting rules should be automatic, not debated in reviews.",
      "Avoid lint rules that conflict with the formatter.",
      "Fix warnings instead of disabling rules.",
    ],
    ex: "On save, Prettier formats the file and ESLint highlights an unused variable.",
    mistakes: [
      "Overriding project formatting with personal settings.",
      "Disabling lint rules to silence warnings.",
    ],
    follow: ["Which one finds bugs, which one fixes layout?"],
    points: [
      "Linter finds problems",
      "Formatter normalises style",
      "Format on save",
      "Share config in the repo",
    ],
    notes: ["Lint for logic, format for layout."],
    src: [
      ["VS Code: JavaScript in VS Code", `${VS}/languages/javascript`],
      ["VS Code: Settings", `${VS}/configure/settings`],
    ],
  }),
  q({
    slug: "vscode-workspaces-multi-root",
    topic: "VS Code",
    d: "medium",
    title:
      "What is a VS Code workspace, and when do you use multi-root workspaces?",
    kw: ["workspace", "multi-root", "code-workspace", "folders", "monorepo"],
    intent: "Checks you can organise multiple projects in the editor.",
    short:
      "A workspace is the folder (or folders) you open in VS Code together with its settings and recommendations. A multi-root workspace combines several folders in one window, saved in a `.code-workspace` file, which is useful when a front end, a back end and shared libraries live in separate repositories but you edit them together. Each folder can have its own settings and tasks, search covers all roots, and you can run debug configurations across them. For a monorepo, a single folder with workspace settings is usually enough.",
    detail: [
      "Workspace trust asks whether to allow code in an opened folder to run.",
      "Use consistent folder names for clarity.",
      "Commit the workspace file only if the team shares the same layout.",
    ],
    ex: "A `shop.code-workspace` opens the `web` and `api` repositories side by side.",
    mistakes: [
      "Opening a huge parent folder with unrelated projects.",
      "Trusting untrusted folders without checking.",
    ],
    follow: ["What does a .code-workspace file hold?"],
    points: [
      "Workspace = folders plus settings",
      "Multi-root for related repos",
      ".code-workspace file",
      "Workspace trust for safety",
    ],
    notes: ["Open related projects together."],
    src: [
      [
        "VS Code: What is a VS Code workspace?",
        `${VS}/editing/workspaces/workspaces`,
      ],
      [
        "VS Code: Multi-root workspaces",
        `${VS}/editing/workspaces/multi-root-workspaces`,
      ],
    ],
  }),
  q({
    slug: "vscode-accessibility-and-testing",
    topic: "VS Code",
    d: "medium",
    title: "How do you run tests and use accessibility features in VS Code?",
    kw: [
      "testing view",
      "test explorer",
      "run tests",
      "accessibility",
      "screen reader",
    ],
    intent:
      "Checks you know the Testing view and that the editor is usable for everyone.",
    short:
      "The Testing view discovers tests through the extension for your framework (such as Jest, Vitest, pytest or JUnit), lists them in a tree, runs or debugs one test, a file or the whole suite, and shows pass or fail status and failure messages inline in the editor. This gives fast feedback while coding. VS Code also has accessibility features, including screen reader support, keyboard-only navigation, audio cues and high-contrast themes, configurable under accessibility settings, which matters for developers who use assistive technology and shows how accessibility should be built into tools.",
    detail: [
      "Re-run failed tests only to save time.",
      "Test coverage can be shown in the editor with supported frameworks.",
      "Command Palette is fully keyboard accessible.",
    ],
    ex: "A developer runs a single failing test from the gutter icon and debugs it with a breakpoint.",
    mistakes: [
      "Running the whole suite for each tiny change.",
      "Ignoring keyboard accessibility in your own tools.",
    ],
    follow: ["How does the Testing view discover tests?"],
    points: [
      "Testing view with framework extensions",
      "Run or debug one test",
      "Inline failure messages",
      "Accessibility settings exist",
    ],
    notes: ["Fast feedback in the editor."],
    src: [
      ["VS Code: Testing", `${VS}/debugtest/testing`],
      ["VS Code: Accessibility", `${VS}/editor/accessibility`],
    ],
  }),
  q({
    slug: "figma-what-is-and-frames",
    topic: "Figma basics",
    d: "easy",
    title: "What is Figma, and how do frames structure a design?",
    kw: ["figma", "frames", "canvas", "design tool", "artboard"],
    intent:
      "Checks you know the common design tool and its basic building block.",
    short:
      "Figma is a collaborative, browser-based design tool for interface design, prototyping and handoff, where several people can work on the same file at once. The canvas holds frames, the basic containers for a screen, component or section, with a chosen size such as a phone or desktop preset. Layers such as shapes, text and images are placed inside frames, which can clip their content, have backgrounds, and be nested, so a page is a frame of sections of components. Constraints and auto layout control how contents respond when a frame is resized.",
    detail: [
      "Name layers and frames clearly, since developers read them.",
      "Pages in a file organise related screens.",
      "Frames are similar to divs in how they nest and contain.",
    ],
    ex: "A mobile app design has a 390 by 844 frame for each screen, grouped on a 'Checkout' page.",
    mistakes: [
      "Unnamed layers like 'Rectangle 482'.",
      "Mixing unrelated designs in one frame.",
    ],
    follow: ["What is a frame in Figma?"],
    points: [
      "Collaborative browser-based design tool",
      "Frames are containers for screens and sections",
      "Nested layers",
      "Constraints and auto layout",
    ],
    notes: ["Frames hold everything."],
    src: [figma.frames, figma.libraries],
  }),
  q({
    slug: "figma-components-and-variants",
    topic: "Figma basics",
    d: "medium",
    title:
      "What are components and variants in Figma, and why do designers use them?",
    kw: [
      "components",
      "main component",
      "instances",
      "variants",
      "design system",
    ],
    intent: "Checks you understand reuse in design.",
    short:
      "A component is a reusable design element, like a button, defined once as a main component. Copies of it, called instances, stay linked to the main component, so a change to the main component updates every instance, while instances can still override properties such as text. Variants group related versions of a component, for example a button with states (default, hover, disabled) and sizes, selectable through properties. Components keep designs consistent, save time and mirror how developers build UI components in React, so the structure translates well to code.",
    detail: [
      "Libraries publish components to be used across files and teams.",
      "Component properties expose text, booleans and instance swaps.",
      "Name variants to match code props where possible.",
    ],
    ex: "A Button component has variants for `primary`, `secondary` and `disabled`, used on every screen.",
    mistakes: [
      "Detaching instances and losing consistency.",
      "Creating separate buttons per screen.",
    ],
    follow: ["What happens to instances when the main component changes?"],
    points: [
      "Main component and instances",
      "Changes propagate",
      "Variants for states and sizes",
      "Libraries share components",
    ],
    notes: ["Define once, reuse everywhere."],
    src: [figma.components, figma.variants],
  }),
  q({
    slug: "figma-auto-layout-constraints",
    topic: "Figma basics",
    d: "medium",
    title:
      "How do auto layout and constraints make designs responsive in Figma?",
    kw: [
      "auto layout",
      "constraints",
      "padding and gap",
      "hug fill",
      "responsive design",
    ],
    intent: "Checks you can build designs that adapt like real UI.",
    short:
      "Auto layout makes a frame behave like a flexible container: it arranges children in a row or column with set spacing (gap) and padding, and resizes as content changes. Children can hug their content or fill the available space, and the direction, alignment and wrapping can be set, which maps closely to CSS flexbox. Constraints define how a layer behaves when its parent frame is resized, such as pinning to the left and right edges or centring. Using them lets designs adapt to different text lengths and screen sizes, and helps developers see the intended behaviour.",
    detail: [
      "Auto layout frames can be nested to build complex layouts.",
      "Test a design by changing text and resizing the frame.",
      "Use consistent spacing values from a scale.",
    ],
    ex: "A card with auto layout grows taller when the title wraps to two lines, pushing the button down.",
    mistakes: [
      "Fixed-size boxes that break with longer text.",
      "Random spacing values.",
    ],
    follow: ["How does auto layout relate to CSS?"],
    points: [
      "Auto layout = flexible container",
      "Gap, padding, hug and fill",
      "Constraints control resizing",
      "Maps to flexbox",
    ],
    notes: ["Design like CSS flexbox."],
    src: [figma.autoLayout, figma.frames],
  }),
  q({
    slug: "figma-styles-and-variables",
    topic: "Figma basics",
    d: "medium",
    title:
      "What are styles and variables in Figma, and how do they relate to design tokens?",
    kw: [
      "color styles",
      "text styles",
      "variables",
      "design tokens",
      "theming",
    ],
    intent: "Checks you know how design decisions are made reusable.",
    short:
      "Styles save reusable sets of properties, such as colours, text (font, size, line height), effects and grids, so that changing a style updates everything that uses it. Variables store values like colours, numbers, strings and booleans that can be applied to properties, organised in collections with modes (for example light and dark, or different brands), so switching the mode restyles a design. Together they are the design equivalent of design tokens, named values like `color-primary` or `spacing-4`, which developers can mirror in CSS custom properties or a Tailwind theme, keeping design and code in sync.",
    detail: [
      "Name tokens by purpose (semantic) not value (like 'blue-500' only).",
      "Variables can drive prototypes and responsive behaviours.",
      "Avoid hard-coded hex values on layers.",
    ],
    ex: "Switching a frame from the Light to the Dark mode of a colour collection restyles the whole screen.",
    mistakes: [
      "Hard-coded colours everywhere.",
      "Token names that describe appearance only.",
    ],
    follow: ["What is a variable mode?"],
    points: [
      "Styles reuse property sets",
      "Variables hold values in collections",
      "Modes for themes",
      "Equivalent to design tokens",
    ],
    notes: ["Tokens, not magic values."],
    src: [figma.styles, figma.variables],
  }),
  q({
    slug: "figma-prototyping-flows",
    topic: "Figma basics",
    d: "easy",
    title: "How do you make a clickable prototype in Figma?",
    kw: ["prototype", "flows", "interactions", "triggers", "smart animate"],
    intent: "Checks you can turn static screens into a testable flow.",
    short:
      "In prototype mode you connect frames with interactions: choose a trigger on a layer, such as on click or on drag, and an action, such as navigating to another frame, opening an overlay or scrolling, plus an animation like instant, dissolve, move or smart animate. You set a starting frame for a flow, then use Present or share a prototype link so people can click through it on a desktop or phone. A prototype lets you test the user journey and gather feedback before development. Components with variants and interactive components can model states like toggles and tabs.",
    detail: [
      "Prototypes simulate behaviour but are not real code.",
      "Share with comment access to collect feedback in context.",
      "Test with real users and observe, instead of explaining.",
    ],
    ex: "Tapping the 'Pay' button in the prototype navigates to a confirmation screen, so the checkout flow can be tested.",
    mistakes: [
      "Over-polishing a prototype before testing the idea.",
      "Explaining the prototype instead of observing users.",
    ],
    follow: ["What is a trigger and an action?"],
    points: [
      "Connect frames with interactions",
      "Trigger, action, animation",
      "Set the starting point",
      "Share and test",
    ],
    notes: ["Click through before you code."],
    src: [figma.prototyping, figma.comments],
  }),
  q({
    slug: "figma-dev-mode-handoff",
    topic: "Figma basics",
    d: "medium",
    title: "How does design-to-development handoff work with Figma Dev Mode?",
    kw: ["dev mode", "handoff", "inspect", "design specs", "code snippets"],
    intent: "Checks you can bridge design and implementation.",
    short:
      "Dev Mode is a view of a Figma file made for developers: it shows measurements, spacing, colours, typography and component properties for selected layers, can generate code snippets such as CSS, offers assets for export, and lets teams mark sections as ready for development and see changes. Good handoff depends on how the design was built: named layers, components that match the code components, auto layout, styles and variables instead of loose values, and annotations for behaviour. Developers should also check states, error cases and responsive behaviour with the designer, not only the happy-path screen.",
    detail: [
      "Generated code is a starting point; use your design system's components.",
      "Ask questions in comments on the specific layer.",
      "Agree on how design tokens map to code.",
    ],
    ex: "A developer selects a card in Dev Mode and reads its padding, font and colour variables to build it with matching tokens.",
    mistakes: [
      "Copying pixel values without using the design system.",
      "Building only the happy-path screen.",
    ],
    follow: ["What makes handoff smoother?"],
    points: [
      "Dev Mode shows specs and code hints",
      "Components and variables aid handoff",
      "Check states and responsive behaviour",
      "Collaborate through comments",
    ],
    notes: ["Inspect, map to tokens, ask."],
    src: [figma.devMode, figma.variables],
  }),
  q({
    slug: "ui-wireframe-vs-prototype-fidelity",
    topic: "UI prototyping",
    d: "easy",
    title:
      "What is the difference between a wireframe, a mockup and a prototype?",
    kw: ["wireframe", "mockup", "prototype", "low fidelity", "high fidelity"],
    intent: "A basic UX vocabulary question.",
    short:
      "A wireframe is a low-fidelity layout sketch showing structure and content placement, such as where the navigation, headings and buttons go, with little or no styling, used to agree on layout quickly. A mockup is a high-fidelity static design with colours, typography and imagery that shows what the interface will look like. A prototype is interactive: screens are linked so that users can click through flows and experience how it behaves. Start with low fidelity, which is cheap to change, and add detail as the idea is validated.",
    detail: [
      "Fidelity should match the question you are trying to answer.",
      "Feedback on a rough wireframe focuses on structure, not colours.",
      "Paper sketches are a valid first step.",
    ],
    ex: "The team sketches a checkout wireframe, tests the flow with a prototype, and only then polishes the visual mockups.",
    mistakes: [
      "Polishing visuals before validating the flow.",
      "Calling every design a prototype.",
    ],
    follow: ["Which one is interactive?"],
    points: [
      "Wireframe: low-fidelity structure",
      "Mockup: static high-fidelity visuals",
      "Prototype: interactive",
      "Increase fidelity gradually",
    ],
    notes: ["Sketch, mock, click."],
    src: [figma.prototyping, figma.frames],
  }),
  q({
    slug: "ui-design-system-and-consistency",
    topic: "UI prototyping",
    d: "medium",
    title: "What is a design system, and how does it help a team?",
    kw: [
      "design system",
      "component library",
      "design tokens",
      "consistency",
      "shared language",
    ],
    intent: "Checks you understand shared UI foundations.",
    short:
      "A design system is a shared set of design tokens (colours, typography, spacing), reusable components and usage guidelines that designers and developers both use. It keeps interfaces consistent, speeds up work because common pieces already exist, improves accessibility by building it into components once, and gives the team a shared vocabulary. In Figma it appears as libraries of components and styles or variables, and in code as a component library, often with matching names. A system needs ownership and versioning to stay current, or it quickly becomes outdated.",
    detail: [
      "Document when to use a component and when not.",
      "Treat the system as a product with contribution rules.",
      "Tools like shadcn/ui and Tailwind let teams build their own system quickly.",
    ],
    ex: "Every team uses the same Button, Input and Modal, so the product looks and behaves consistently.",
    mistakes: [
      "Letting design and code components drift apart.",
      "No owner for the system.",
    ],
    follow: ["What does a design system contain?"],
    points: [
      "Tokens, components, guidelines",
      "Consistency and speed",
      "Design and code stay aligned",
      "Needs ownership",
    ],
    notes: ["One source of truth for UI."],
    src: [figma.libraries, figma.components],
  }),
  q({
    slug: "ui-accessibility-in-design",
    topic: "UI prototyping",
    d: "medium",
    title: "How do you consider accessibility while designing a UI?",
    kw: [
      "accessibility",
      "colour contrast",
      "touch targets",
      "wcag",
      "focus states",
    ],
    intent: "Checks you build accessibility in from the start.",
    short:
      "Design for accessibility before development, because fixing it later costs more. Choose colours with enough contrast against their background (WCAG AA asks for at least 4.5 to 1 for normal text and 3 to 1 for large text) and do not rely on colour alone to convey meaning. Make touch and click targets large enough, show clear focus states for keyboard users, keep text readable and resizable, label form fields, give images meaningful alternatives in the spec, and design error messages that explain how to fix the problem. Check designs with a contrast checker and test prototypes with real users, including assistive technology users.",
    detail: [
      "Design the states too: hover, focus, disabled and error.",
      "Heading structure and reading order matter for screen readers.",
      "Document accessibility notes for developers in the handoff.",
    ],
    ex: "A form design includes visible labels, a focus ring, and an error message in text beside the red outline.",
    mistakes: ["Light grey text on white.", "Colour-only error indicators."],
    follow: ["What is the contrast ratio for normal text under WCAG AA?"],
    points: [
      "Contrast: 4.5:1 normal, 3:1 large",
      "Not colour alone",
      "Focus states and target size",
      "Annotate for developers",
    ],
    notes: ["Accessible by design."],
    src: [
      [
        "W3C: WCAG 2 quick reference",
        "https://www.w3.org/WAI/WCAG22/quickref/",
      ],
      figma.devMode,
    ],
  }),
  q({
    slug: "ui-responsive-design-in-mockups",
    topic: "UI prototyping",
    d: "medium",
    title: "How do you design for multiple screen sizes before building?",
    kw: [
      "responsive design",
      "breakpoints",
      "mobile first",
      "frame sizes",
      "grid",
    ],
    intent: "Checks you plan layouts across devices.",
    short:
      "Design the smallest screen first (mobile first), since it forces you to prioritise content, then adapt up to tablet and desktop. In Figma create frames at representative widths such as phone, tablet and desktop, use layout grids and consistent spacing, and use auto layout and constraints so elements show how they stretch, wrap or stack. Note where the layout changes (the breakpoints) and what changes: columns collapsing, navigation turning into a menu, or sections reordering. The design should match what CSS can do, such as flexbox and grid, so the handoff to development is realistic.",
    detail: [
      "Test long text, empty states and large numbers in the designs.",
      "Use relative units and fluid layouts in implementation.",
      "Include touch-friendly spacing on mobile.",
    ],
    ex: "A product grid shows four columns on desktop, two on tablet and one on mobile.",
    mistakes: [
      "Only designing the desktop layout.",
      "Designs that ignore content that varies in length.",
    ],
    follow: ["Why start with mobile?"],
    points: [
      "Mobile first",
      "Frames for each size",
      "Grids, auto layout and constraints",
      "Mark breakpoints and changes",
    ],
    notes: ["Design the smallest first."],
    src: [
      figma.autoLayout,
      [
        "MDN: Using media queries",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using",
      ],
    ],
  }),
  q({
    slug: "ui-user-testing-and-feedback",
    topic: "UI prototyping",
    d: "medium",
    title: "How do you test a prototype with users and use the feedback?",
    kw: [
      "usability testing",
      "user feedback",
      "task-based testing",
      "iterate",
      "observe users",
    ],
    intent: "Checks you validate designs with real people.",
    short:
      "Give a handful of representative users realistic tasks, such as 'find and buy a pair of shoes', using the prototype, and observe where they hesitate, make mistakes or misunderstand, asking them to think aloud and avoiding hints. Record what happens and what they say, look for patterns across several users rather than single opinions, and prioritise the issues that block the main tasks. Then change the design, retest and repeat. Testing early with a low-cost prototype is far cheaper than discovering problems after development.",
    detail: [
      "Even a small number of participants reveals the biggest problems.",
      "Watch behaviour more than you trust what people say.",
      "Share findings and decisions with the team and in the design file comments.",
    ],
    ex: "Three out of five testers could not find the 'Apply coupon' field, so it is moved above the total.",
    mistakes: ["Leading users to the answer.", "Testing only with colleagues."],
    follow: ["Why observe rather than ask?"],
    points: [
      "Realistic tasks, think aloud",
      "Look for patterns",
      "Prioritise blockers",
      "Iterate and retest",
    ],
    notes: ["Watch, don't explain."],
    src: [figma.prototyping, figma.comments],
  }),
  q({
    slug: "ui-image-assets-export-handoff",
    topic: "UI prototyping",
    d: "easy",
    title: "How should images, icons and assets be prepared for handoff?",
    kw: ["asset export", "svg icons", "image formats", "2x scale", "naming"],
    intent: "Checks you deliver assets that developers can use efficiently.",
    short:
      "Prepare assets in formats suited to their use: SVG for icons and simple illustrations because it is vector and scales without loss, and compressed raster formats such as WebP, AVIF or optimised PNG and JPEG for photographs. Export images at the sizes the layout needs, including higher-density versions where required, name files consistently and descriptively, and keep icons on a consistent grid and size. Mark purely decorative images so developers can give them empty alt text, and provide the intended alt text for meaningful ones. Dev Mode lists assets for export, and developers should optimise the files before shipping.",
    detail: [
      "Large unoptimised images slow pages and hurt Core Web Vitals.",
      "Icon sets are often better used from a library than exported individually.",
      "Use auto layout so assets keep consistent spacing.",
    ],
    ex: "An icon set is exported as optimised SVGs, while hero photos are delivered as WebP at two sizes.",
    mistakes: ["Huge PNGs for simple icons.", "Missing alt text guidance."],
    follow: ["Which format suits icons?"],
    points: [
      "SVG for icons",
      "Compressed raster for photos",
      "Right sizes and consistent names",
      "Alt text guidance",
    ],
    notes: ["Right format, right size."],
    src: [
      figma.devMode,
      [
        "MDN: The img element",
        "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img",
      ],
    ],
  }),
])
