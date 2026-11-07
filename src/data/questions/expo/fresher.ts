import { defineQuestions } from "../author"
import { g } from "../brief"

const X = "https://docs.expo.dev"

export default defineQuestions("expo", "fresher", [
  g({
    slug: "what-is-expo",
    topic: "Expo SDK & workflow",
    d: "easy",
    title: "What is Expo and how does it relate to React Native?",
    kw: ["expo", "react native", "framework", "expo sdk", "expo router"],
    intent:
      "Checks that you know Expo is a framework and toolset built around React Native, not a separate runtime.",
    short:
      "Expo is a React Native framework that makes developing Android and iOS apps easier. It provides file-based routing, a standard library of native modules and other tools, and it is open source. An 'Expo app' is a React Native app that uses Expo tools, such as a package from the Expo SDK, Expo Router, Expo CLI or Continuous Native Generation. Because the tools can be adopted independently, the development process depends on which of them you choose to use.",
    detail: [
      "The Expo documentation says an Expo project is still a React Native app, which is itself a native app.",
      "Expo open-source tools are free and carry the MIT license.",
      "Expo also offers Expo Services, a separate set of hosted services.",
    ],
    ex: "A team creates a project with create-expo-app and uses a camera package from the Expo SDK without writing native code.",
    mistakes: [
      "Treating Expo as a competitor to React Native instead of a layer on top of it.",
      "Assuming that using Expo locks you into a hosted service.",
    ],
    follow: ["What are Expo Services?"],
    points: [
      "Framework for React Native apps",
      "File-based routing and native module library",
      "Tools can be adopted independently",
      "Open source under MIT",
    ],
    notes: "Expo = React Native + a framework of tools; the app is still native.",
    src: [
      ["Expo: Create a project", `${X}/get-started/create-a-project/`],
      ["Expo: Develop an app with Expo", `${X}/workflow/overview/`],
    ],
  }),
  g({
    slug: "expo-vs-expo-services",
    topic: "Expo SDK & workflow",
    d: "easy",
    title: "What is the difference between Expo and Expo Services, and do you have to use Services?",
    kw: ["expo services", "eas", "expo build", "expo update", "expo submit"],
    intent:
      "Checks that you separate the free open-source tools from the hosted services.",
    short:
      "Expo is the open-source project: Expo CLI, Expo Router and the Expo SDK packages. Expo Services is a suite of hosted services to build, submit and update your app, set up automation and collaborate with a team. You do not have to use Expo Services, because an Expo project is just a React Native app. You can use Fastlane or other native tools, self-host updates, or run builds locally or on your own CI. For most teams the documentation suggests the services save engineering time.",
    detail: [
      "Services solve problems that need physical resources, such as build servers and CDNs for over-the-air updates.",
      "Expo Services can also be used by React Native projects that do not use any Expo open-source tools.",
      "Services have a free plan, and paid plans add things such as build concurrency.",
    ],
    ex: "A team uses the Expo SDK for development but builds its release on its own CI instead of the hosted build service.",
    mistakes: [
      "Saying you must pay for Expo to ship an app.",
      "Mixing up the CLI tools with the hosted services.",
    ],
    follow: ["What does Expo Build do?"],
    points: [
      "Expo = open-source tools",
      "Services = hosted build, submit, update",
      "Services are optional",
      "Self-hosting options exist",
    ],
    notes: "Open-source tools are separate from the optional hosted services.",
    src: [["Expo: Develop an app with Expo", `${X}/workflow/overview/`]],
  }),
  g({
    slug: "expo-go-vs-development-build",
    topic: "Expo SDK & workflow",
    d: "medium",
    title: "What is the difference between Expo Go and a development build?",
    kw: ["expo go", "development build", "expo-dev-client", "native modules", "debug build"],
    intent:
      "Checks that you know why Expo Go is not enough for a production project.",
    short:
      "Expo Go is a playground app for students and learners to try Expo quickly; it is limited and not useful for building production-grade projects. A development build is a debug build of your own app that includes the expo-dev-client library. It is essentially your own version of Expo Go in which you are free to use any native libraries and change any native configuration. The documentation recommends a development build when you want to create your own app and release it to app stores.",
    detail: [
      "expo-dev-client adds tooling such as network request inspection and a launcher UI to switch between development servers and deployments.",
      "You can create a development build locally or with the hosted build service.",
      "Updates published with a runtimeVersion cannot be loaded in Expo Go.",
    ],
    ex: "A project that needs a custom native library moves from Expo Go to a development build.",
    mistakes: [
      "Expecting every native library to work inside Expo Go.",
      "Testing deep linking only in Expo Go, where incoming link support is limited.",
    ],
    follow: ["How do you create a development build?"],
    points: [
      "Expo Go is a limited playground",
      "Development build is your own debug app",
      "Includes expo-dev-client",
      "Supports custom native code",
    ],
    notes: "Expo Go for learning; development build for real projects.",
    src: [
      ["Expo: Set up your environment", `${X}/get-started/set-up-your-environment/`],
      [
        "Expo: Introduction to development builds",
        `${X}/develop/development-builds/introduction/`,
      ],
    ],
  }),
  g({
    slug: "create-and-run-expo-project",
    topic: "Expo SDK & workflow",
    d: "easy",
    title: "How do you create and start a new Expo project?",
    kw: ["create-expo-app", "npx expo start", "template", "node", "project"],
    intent: "Checks that you know the basic commands for starting work.",
    short:
      "Run npx create-expo-app@latest to create a project; the documentation recommends starting with the default project, which includes example code. Node.js (LTS) is required, and macOS, Windows and Linux are supported. You can choose a different template with the --template option or start from an example with --example. Then start the development server with npx expo start and open the app on a device, an emulator or a simulator. The documentation recommends developing on a real device where possible.",
    detail: [
      "From the terminal UI you can press a for Android or i for iOS, and w to open the web.",
      "The default project already includes Expo Router.",
      "Android emulators need Android Studio, and iOS simulators need macOS with Xcode.",
    ],
    ex: "A new developer runs create-expo-app, then npx expo start, and scans the QR code on a phone.",
    mistakes: [
      "Skipping the Node.js requirement and hitting install errors.",
      "Building the template from scratch when the default project gives a working start.",
    ],
    follow: ["Which tool would you use if you need a custom native library?"],
    points: [
      "create-expo-app creates the project",
      "Default template has example code",
      "npx expo start runs the dev server",
      "Real device is recommended",
    ],
    notes: "create-expo-app, then npx expo start.",
    src: [
      ["Expo: Create a project", `${X}/get-started/create-a-project/`],
      ["Expo: Set up your environment", `${X}/get-started/set-up-your-environment/`],
      ["Expo: Introduction to Expo Router", `${X}/router/introduction/`],
    ],
  }),
  g({
    slug: "expo-install-and-sdk-libraries",
    topic: "Expo SDK & workflow",
    d: "easy",
    title: "What is the Expo SDK, and why use npx expo install?",
    kw: ["expo sdk", "npx expo install", "compatible version", "react native directory", "libraries"],
    intent:
      "Checks that you know where core, SDK and third-party libraries come from.",
    short:
      "React Native core provides primitives such as View, Text and ScrollView. The Expo SDK picks up where those end, providing device and system functionality such as camera, audio, contacts, maps and OAuth authentication tools. You install a library with npx expo install, which picks a library version compatible with your project and then uses your package manager to install it. Each SDK API reference shows platform compatibility tags. For other libraries, React Native Directory is a searchable database to look at first.",
    detail: [
      "A typical API reference also shows config plugin usage if the library needs one.",
      "You can see which React Native version matches an Expo SDK version.",
      "Existing React Native apps can add Expo modules by installing the expo package.",
    ],
    ex: "To use the device information library the developer runs npx expo install expo-device instead of choosing a version by hand.",
    mistakes: [
      "Installing a version with a plain package manager command and getting a mismatch.",
      "Ignoring the platform tags and expecting a library to work everywhere.",
    ],
    follow: ["What does a config plugin do?"],
    points: [
      "Core primitives from react-native",
      "SDK adds device features",
      "expo install picks compatible versions",
      "Check platform tags",
    ],
    notes: "Use npx expo install so versions match your SDK.",
    src: [["Expo: Using libraries", `${X}/workflow/using-libraries/`]],
  }),
  g({
    slug: "continuous-native-generation",
    topic: "Expo SDK & workflow",
    d: "medium",
    title: "What is Continuous Native Generation (CNG)?",
    kw: ["continuous native generation", "cng", "prebuild", "native projects", "app config"],
    intent:
      "Checks that you understand why Expo treats native folders as generated output.",
    short:
      "Instead of creating native projects once and maintaining customisations for the lifetime of the codebase, Continuous Native Generation creates short-lived native projects only when needed, for example when debugging or building. They are generated from a standard template plus configuration or code that defines the customisations. You maintain only the definition of those customisations, mostly in the app config, not all the native code. In Expo this is done with npx expo prebuild. The system is optional, and you can stop using it at any time.",
    detail: [
      "The tools involved include the app config, the prebuild template, autolinking and credentials managed by the build service.",
      "Prebuild creates the android and ios directories, which are added to .gitignore in a new project.",
      "The build service runs prebuild itself when a project has no android and ios directories.",
    ],
    ex: "A team changes an app icon in the app config and regenerates the native projects instead of editing native files.",
    mistakes: [
      "Hand-editing generated android and ios files and losing the changes on the next clean prebuild.",
      "Assuming CNG is mandatory.",
    ],
    follow: ["What is a config plugin?"],
    points: [
      "Native projects are generated when needed",
      "You maintain the customisation definition",
      "Run with npx expo prebuild",
      "Fully optional",
    ],
    notes: "Native folders are output; configuration is the source of truth.",
    src: [
      ["Expo: Continuous Native Generation", `${X}/workflow/continuous-native-generation/`],
    ],
  }),
  g({
    slug: "prebuild-and-config-plugins",
    topic: "Expo SDK & workflow",
    d: "medium",
    title: "What does npx expo prebuild do, and what is a config plugin?",
    kw: ["prebuild", "config plugin", "--clean", "android directory", "ios directory"],
    intent:
      "Checks that you know how to customise native projects without losing changes.",
    short:
      "npx expo prebuild creates the android and ios directories for running your React code. If you edit the generated directories by hand, you risk losing your changes the next time you run prebuild with --clean, which deletes existing native directories before generating. Instead, use config plugins, which are functions that perform modifications on native projects during prebuild. Library authors use them to extend the app config, and many existing plugins cover common modifications. Without --clean, prebuild layers changes on top of existing files, which is faster but may not give the same result.",
    detail: [
      "Some config plugins are not idempotent, so a clean prebuild is the safest way.",
      "npx expo run:android and run:ios run prebuild first if the native directories do not exist.",
      "Plugins are listed in the plugins array of the app config.",
    ],
    ex: "A library needs a permission string in the native project, so its config plugin adds it during prebuild.",
    mistakes: [
      "Editing android files directly in a project that uses prebuild.",
      "Forgetting that a plugin change needs a new native build.",
    ],
    follow: ["What does --clean do?"],
    points: [
      "Prebuild generates android and ios",
      "--clean deletes first",
      "Config plugins modify native projects",
      "Avoid manual edits",
    ],
    notes: "Customise through config plugins, then prebuild.",
    src: [
      ["Expo: Continuous Native Generation", `${X}/workflow/continuous-native-generation/`],
      ["Expo: Configure with app config", `${X}/workflow/configuration/`],
    ],
  }),
  g({
    slug: "app-config-file",
    topic: "App configuration",
    d: "easy",
    title: "What is the Expo app config, and what is it used for?",
    kw: ["app.json", "app.config.js", "app config", "name", "slug"],
    intent:
      "Checks that you know where an Expo project's settings live.",
    short:
      "The app config (app.json, app.config.js or app.config.ts) configures Expo Prebuild generation, how a project loads in Expo Go and the over-the-air update manifest. It must be at the root of the project next to package.json. A minimal one has a name and a slug. It sets things such as the app name, icon, splash screen and deep linking scheme. If the file has a top-level expo object, that object is used and other keys are ignored. The reference lists every property.",
    detail: [
      "Most of the configuration is available at runtime through Constants.expoConfig.",
      "The Expo Tools extension for Visual Studio Code gives auto-completion for app.json.",
      "Library authors can extend the config with config plugins.",
    ],
    ex: "The developer sets the app name and icon in app.json and regenerates the native projects.",
    mistakes: [
      "Placing the file outside the project root.",
      "Importing app.json directly into app code instead of reading Constants.expoConfig.",
    ],
    follow: ["How do you make the config dynamic?"],
    points: [
      "app.json, app.config.js or .ts",
      "At the project root",
      "Drives prebuild, Expo Go and updates",
      "Read at runtime via Constants.expoConfig",
    ],
    notes: "One config file describes the app's name, icon, scheme and plugins.",
    src: [
      ["Expo: Configure with app config", `${X}/workflow/configuration/`],
      ["Expo: app.json / app.config.js reference", `${X}/versions/latest/config/app/`],
    ],
  }),
  g({
    slug: "dynamic-app-config-and-secrets",
    topic: "App configuration",
    d: "medium",
    title: "How do you make the app config dynamic, and what must never go into it?",
    kw: ["app.config.js", "extra", "Constants.expoConfig", "dynamic configuration", "sensitive information"],
    intent:
      "Checks that you know config is embedded in the app and is not a place for secrets.",
    short:
      "Use app.config.js or app.config.ts instead of app.json. These let you use comments, variables, ESM imports, TypeScript and environment information, and the config updates when the Metro bundler reloads. They do not support Promises. The extra key passes arbitrary data to your app, read at runtime with Constants.expoConfig.extra. You should not include sensitive information in the app config, because it is embedded in builds and updates and available at runtime. You can check what is embedded by running npx expo config --type public.",
    detail: [
      "A few fields, such as ios.config and android.config, are filtered out of the public config.",
      "Avoid importing app.config.js in app code, because that imports the raw file instead of the processed version.",
      "Use process.env inside the config to provide environment information.",
    ],
    ex: "The config reads a version from an environment variable and exposes an API base URL, not a key, in extra.",
    mistakes: [
      "Placing a private API key in extra.",
      "Returning a Promise from the config file.",
    ],
    follow: ["How do EXPO_PUBLIC_ variables differ from extra?"],
    points: [
      "JS or TS config allows logic",
      "extra passes data to the app",
      "Never store secrets in it",
      "Check with npx expo config --type public",
    ],
    notes: "Config is public inside the app; keep secrets on a server.",
    src: [["Expo: Configure with app config", `${X}/workflow/configuration/`]],
  }),
  g({
    slug: "expo-public-environment-variables",
    topic: "App configuration",
    d: "medium",
    title: "How do environment variables work in an Expo app, and are they secret?",
    kw: ["EXPO_PUBLIC_", ".env", "process.env", "environment variables", "plain text"],
    intent:
      "Checks that you know which variables reach the JavaScript bundle and how they are exposed.",
    short:
      "Expo CLI loads variables with the EXPO_PUBLIC_ prefix from .env files so you can read them in JavaScript, and replaces references to process.env.EXPO_PUBLIC_NAME in the bundle with the value. Each variable must be referenced statically with dot notation, so process.env['EXPO_PUBLIC_KEY'] or destructuring will not be inlined. They are not secret: the documentation says not to store private keys in EXPO_PUBLIC_ variables, because they are visible in plain text in the compiled application. Code inside node_modules is not affected.",
    detail: [
      "Development and production modes load different .env files, with files listed first taking priority.",
      ".env.local files are for settings specific to your machine and generally belong in .gitignore.",
      "After changing a value you may need a full reload to see it.",
    ],
    ex: "EXPO_PUBLIC_API_URL points to a staging server in development and the real server in production.",
    mistakes: [
      "Putting a private key in an EXPO_PUBLIC_ variable.",
      "Reading variables with dynamic keys, which are not inlined.",
    ],
    follow: ["How do you set variables for cloud builds?"],
    points: [
      "EXPO_PUBLIC_ prefix is required",
      "Static dot notation only",
      "Visible in the compiled app",
      "No private keys",
    ],
    notes: "EXPO_PUBLIC_ variables are inlined and public.",
    src: [["Expo: Environment variables in Expo", `${X}/guides/environment-variables/`]],
  }),
  g({
    slug: "expo-services-environment-variables",
    topic: "App configuration",
    d: "medium",
    title: "Why use Expo Services environment variables for cloud builds?",
    kw: ["eas env:pull", "environment variables", "visibility", "plain text", "secret"],
    intent:
      "Checks that you know why local .env files do not exist on the build server.",
    short:
      "During local development variables come from local .env files, which are usually kept out of version control, so they are not available to jobs on a remote server such as the hosted build service. Expo Services environment variables keep configuration in one place for cloud builds, updates and workflows without committing .env files. You can separate values by environment, such as development, preview and production, while reusing names. You also control visibility as plain text, sensitive or secret, and you can apply the same set locally with eas env:pull.",
    detail: [
      "Variables are managed through EAS CLI or the expo.dev dashboard.",
      "Most projects have several app variants and need several sets of values.",
      "Use secret visibility for values that only the right surfaces should read.",
    ],
    ex: "The production profile gets the production API URL, while the preview profile gets a staging URL.",
    mistakes: [
      "Committing .env files to share values with the build server.",
      "Assuming local files are uploaded with the build.",
    ],
    follow: ["Which variables still end up in the app bundle?"],
    points: [
      "Local .env files are not on the server",
      "Values per environment",
      "Plain text, sensitive or secret visibility",
      "eas env:pull for local use",
    ],
    notes: "Store build-time values in Expo Services, not in committed .env files.",
    src: [
      ["Expo: Environment variables in Expo Services", `${X}/eas/environment-variables/`],
    ],
  }),
  g({
    slug: "expo-router-file-based-routing",
    topic: "Expo SDK & workflow",
    d: "easy",
    title: "What is Expo Router and how does file-based routing work?",
    kw: ["expo router", "file-based routing", "app directory", "navigation", "universal"],
    intent:
      "Checks that you can explain how screens become routes in an Expo project.",
    short:
      "Expo Router is an open-source, file-based router for React Native and web applications built with Expo. It manages navigation between screens and lets you use the same components on Android, iOS and web. When a file is added to the app directory, it automatically becomes a route in your navigation. The default project created by create-expo-app comes with Expo Router installed and configured. It brings file-system routing concepts from the web to a universal app.",
    detail: [
      "It provides an API reference with components, hooks and methods.",
      "It brings file-system routing concepts from the web to a universal app, so the same routes work on every platform.",
      "Start with the default project, which already has it installed and configured.",
    ],
    ex: "Adding app/settings.tsx makes a settings screen reachable without registering it in a separate navigator file.",
    mistakes: [
      "Adding screen files outside the app directory and expecting routes.",
      "Mixing up file-based routes with manually registered screens.",
    ],
    follow: ["How do deep links map to routes?"],
    points: [
      "File-based router",
      "Files in app become routes",
      "Works on Android, iOS and web",
      "Included in the default template",
    ],
    notes: "Add a file under app/ to add a route.",
    src: [["Expo: Introduction to Expo Router", `${X}/router/introduction/`]],
  }),
  g({
    slug: "deep-links-and-universal-links",
    topic: "App configuration",
    d: "medium",
    title: "What is the difference between deep links, Android App Links and iOS Universal Links?",
    kw: ["deep links", "app links", "universal links", "custom scheme", "linking"],
    intent:
      "Checks that you know the three ways a URL can open an app.",
    short:
      "Linking lets a URL open your app and take the user to a specific screen. A deep link uses a custom scheme, such as example://, to link to your app from other apps or websites. Android App Links and iOS Universal Links use regular http and https URLs for your own web domain, and they require you to host a file that verifies you control the domain. With them the link opens your app when it is installed, and takes the user to your website if it is not. A third strategy is outgoing links from your app to other apps.",
    detail: [
      "The custom scheme for a build is set in the app config.",
      "App Links open your app directly instead of showing a chooser between the browser and another handler.",
      "The documentation says support for incoming links in Expo Go is limited, so use development builds to test.",
    ],
    ex: "A shared product URL on the company domain opens the product screen in the app if it is installed.",
    mistakes: [
      "Testing linking only in Expo Go.",
      "Forgetting the verification file on the web domain for universal linking.",
    ],
    follow: ["What should never be sent in a deep link?"],
    points: [
      "Custom scheme = deep link",
      "http(s) links = App Links and Universal Links",
      "Domain verification needed",
      "Test in a development build",
    ],
    notes: "Scheme links vs verified web-domain links.",
    src: [["Expo: Linking overview", `${X}/linking/overview/`]],
  }),
  g({
    slug: "permissions-in-expo",
    topic: "App configuration",
    d: "medium",
    title: "How do you configure app permissions in an Expo project?",
    kw: ["permissions", "android.permissions", "blockedPermissions", "config plugin", "runtime request"],
    intent:
      "Checks that you know permissions need both build-time configuration and a runtime request.",
    short:
      "An app must request the user's permission before using sensitive device data, for example by calling MediaLibrary.requestPermissionsAsync(). In standalone and development builds, permissions also require native build-time configuration before the runtime request works; this is not required in Expo Go. On Android you configure them with android.permissions and android.blockedPermissions in the app config. Most permissions are added automatically by libraries, so you only list extra ones. The only way to remove permissions added by a package is to block them in android.blockedPermissions.",
    detail: [
      "Not configuring or explaining permissions properly can get an app rejected or pulled from the stores.",
      "Google may reject apps that use dangerous permissions without valid reasons.",
      "For blocking, you give the full permission name, such as android.permission.RECORD_AUDIO.",
    ],
    ex: "To remove audio recording added by a camera library, the app lists RECORD_AUDIO in blockedPermissions.",
    mistakes: [
      "Assuming Expo Go behaviour matches a production build.",
      "Declaring dangerous permissions without a clear reason.",
    ],
    follow: ["What is a config plugin's role here?"],
    points: [
      "Runtime request plus build configuration",
      "android.permissions adds extras",
      "blockedPermissions removes",
      "Rejection risk if misconfigured",
    ],
    notes: "Configure at build time and request at runtime.",
    src: [["Expo: Permissions", `${X}/guides/permissions/`]],
  }),
  g({
    slug: "expo-secure-store",
    topic: "Expo SDK & workflow",
    d: "medium",
    title: "How do you store sensitive values such as tokens in an Expo app?",
    kw: ["expo-secure-store", "secure storage", "token", "encrypt", "key-value"],
    intent:
      "Checks that you know the Expo library for encrypted local storage.",
    short:
      "expo-secure-store provides a way to encrypt and securely store key-value pairs locally on the device. Each Expo project has a separate storage system and has no access to the storage of other Expo projects. You install it with npx expo install expo-secure-store. The documentation warns that large payloads can be rejected by the underlying platform, since some iOS releases refused values above roughly 2048 bytes, and that Expo does not enforce a limit, so you should handle native errors if you store very large strings.",
    detail: [
      "It has a built-in config plugin for properties that cannot be set at runtime.",
      "The requireAuthentication option is not supported in Expo Go when biometric authentication is available.",
      "It is included in Expo Go.",
    ],
    ex: "After sign-in the app saves a refresh token with SecureStore and reads it on launch.",
    mistakes: [
      "Putting a refresh token in plain, unencrypted storage.",
      "Storing a very large value and not handling the native error.",
    ],
    follow: ["Why can an API key in app code still be extracted?"],
    points: [
      "Encrypted key-value storage",
      "Separate storage per project",
      "Handle native errors for big values",
      "Install with expo install",
    ],
    notes: "SecureStore for small secrets on the device.",
    src: [["Expo: SecureStore", `${X}/versions/latest/sdk/securestore/`]],
  }),
  g({
    slug: "what-is-eas-build",
    topic: "EAS Build",
    d: "easy",
    title: "What is EAS Build (Expo Build) and when do you use it?",
    kw: ["eas build", "expo build", "eas cli", "app binary", "hosted service"],
    intent:
      "Checks that you know what the hosted build service gives you.",
    short:
      "Expo Build, run with EAS CLI, is a hosted service that builds app binaries for Expo and React Native projects. You run eas build --platform all, or android or ios, and it produces installable binaries. It provides defaults that work for Expo and React Native, can handle app signing credentials for you, supports internal distribution for sharing builds, integrates with Expo Submit for store submission and has first-class support for expo-updates. The documentation lists it as the choice for production builds, builds shared with testers, consistent team builds and CI.",
    detail: [
      "It also works for existing React Native projects, not only ones created with Expo tools.",
      "You need an Expo account and EAS CLI, installed with npm install --global eas-cli.",
      "It integrates with Expo Submit for sending builds to the app stores.",
    ],
    ex: "The team runs eas build --platform android --profile production to get a store-ready file.",
    mistakes: [
      "Thinking you must use it to ship an app.",
      "Forgetting to log in with eas login before building.",
    ],
    follow: ["What is eas.json?"],
    points: [
      "Hosted build service",
      "Commands start with eas",
      "Handles signing credentials",
      "Works with existing React Native projects",
    ],
    notes: "eas build runs your build in the cloud.",
    src: [
      ["Expo: Expo Build", `${X}/build/introduction/`],
      ["Expo: Create your first build", `${X}/build/setup/`],
    ],
  }),
  g({
    slug: "eas-json-build-profiles",
    topic: "EAS Build",
    d: "medium",
    title: "What are build profiles in eas.json?",
    kw: ["eas.json", "build profile", "development", "preview", "production"],
    intent:
      "Checks that you can configure different kinds of builds.",
    short:
      "eas.json is the configuration file for EAS CLI and services, generated when you first run eas build:configure, and it sits next to package.json. Build configuration lives under the build key. A build profile is a named group of settings for a certain type of build. A new project gets three: development, preview and production, though the names are not fixed. You run one with eas build --profile name, and if you omit the flag, EAS CLI uses the profile named production if it exists. Profiles can inherit from another with the extends option.",
    detail: [
      "Each profile can have android and ios fields for platform-specific options.",
      "Chained extends can go up to a depth of five, without circular dependencies.",
      "Build tool versions such as the Node.js version can be set per profile.",
    ],
    ex: "The preview profile extends production but sets distribution to internal for testers.",
    mistakes: [
      "Expecting the default profile name to be development.",
      "Creating circular extends.",
    ],
    follow: ["What does the development profile contain?"],
    points: [
      "Generated by eas build:configure",
      "Profiles under the build key",
      "Default profile is production",
      "extends shares settings",
    ],
    notes: "One profile per kind of build: development, preview, production.",
    src: [["Expo: Configure with eas.json", `${X}/build/eas-json/`]],
  }),
  g({
    slug: "development-preview-production-builds",
    topic: "EAS Build",
    d: "medium",
    title: "How do development, preview and production builds differ?",
    kw: ["development build", "preview build", "production build", "developmentClient", "distribution"],
    intent:
      "Checks that you match build type to purpose.",
    short:
      "Development builds have developmentClient set to true, include developer tools through expo-dev-client, and are never submitted to a store; the profile defaults to internal distribution. Preview builds do not include developer tools and are for your team and stakeholders to test in production-like conditions; they are either not signed for store distribution or packaged in a way not ideal for stores, for example an Android APK. Production builds are submitted to a store, either for the public or for a store testing process, and must be installed through the store.",
    detail: [
      "For Android the documentation recommends an APK for preview and an AAB for Google Play.",
      "A production build can be an APK only if you explicitly set buildType to apk, although AAB is recommended.",
      "It is common to have development and production builds installed on the same device.",
    ],
    ex: "Testers install the preview build from a link, while customers get the production build from Google Play.",
    mistakes: [
      "Sending a development build to the store.",
      "Expecting a production build to install directly on a device without the store.",
    ],
    follow: ["What does internal distribution do?"],
    points: [
      "Development = dev tools, never submitted",
      "Preview = team testing",
      "Production = store release",
      "AAB for stores, APK for direct install",
    ],
    notes: "Dev tools, tester builds, store builds.",
    src: [["Expo: Configure with eas.json", `${X}/build/eas-json/`]],
  }),
  g({
    slug: "internal-distribution",
    topic: "EAS Build",
    d: "medium",
    title: "What is internal distribution, and what does it change for Android and iOS?",
    kw: ["internal distribution", "apk", "ad hoc", "provisioning", "shareable url"],
    intent:
      "Checks that you know how testers get builds without a store.",
    short:
      "Setting distribution to internal on a build profile gives you a URL that lets testers install the app directly on a device. On Android, the default build command changes to produce an APK instead of an AAB, and the build service generates a keystore to sign it, or reuses one for the same package name. On iOS, the build uses ad hoc or enterprise provisioning; with ad hoc provisioning, only devices whose UDIDs were in the profile at build time can install it, and you add a device with eas device:create and make a new build.",
    detail: [
      "By default anybody with the URL can open the build page, identified by a 32 character UUID.",
      "You can require sign-in to an authorised Expo account in the project settings.",
      "Builds can run non-interactively on CI with the --non-interactive flag.",
    ],
    ex: "A QA team opens the shared link on their Android phones and installs the APK for testing.",
    mistakes: [
      "Expecting an iOS ad hoc build to install on a device that was not registered.",
      "Sharing the link publicly when the build is confidential.",
    ],
    follow: ["Why is an AAB not installable directly on a device?"],
    points: [
      "distribution: internal",
      "Android produces APK",
      "iOS uses ad hoc or enterprise provisioning",
      "Shareable URL",
    ],
    notes: "Internal distribution = installable link for testers.",
    src: [["Expo: Internal distribution", `${X}/build/internal-distribution/`]],
  }),
  g({
    slug: "apk-vs-aab",
    topic: "EAS Build",
    d: "easy",
    title: "What is the difference between an APK and an AAB, and which does Expo Build produce?",
    kw: ["apk", "aab", "android app bundle", "buildType", "google play"],
    intent:
      "Checks that you know which Android file format goes where.",
    short:
      "The default file format for Android builds with Expo Build is an Android App Bundle (AAB), which is optimised for distribution to the Google Play Store. An AAB cannot be installed directly on a device or emulator. To install a build directly you need an Android Package (APK). You get an APK by setting developmentClient to true, distribution to internal, android.buildType to apk, or android.gradleCommand to a Gradle command that produces an APK. Google Play requires new apps to be published as app bundles and generates optimised APKs for each device.",
    detail: [
      "Once an APK build finishes, eas build:run can download and install it on an Android emulator.",
      "On a physical device you can open the APK URL from the build details page.",
      "The profile name is yours to choose, such as preview or emulator.",
    ],
    ex: "A preview profile sets buildType to apk so testers can install it, while production stays on the default AAB.",
    mistakes: [
      "Trying to install an AAB on a phone.",
      "Uploading an APK for a new Google Play app instead of an AAB.",
    ],
    follow: ["How do you install a build on an emulator?"],
    points: [
      "AAB is the default",
      "AAB is for Google Play",
      "APK installs directly",
      "buildType: apk produces an APK",
    ],
    notes: "AAB for the Play Store, APK for direct install.",
    src: [
      ["Expo: Build APKs for Android Emulators and devices", `${X}/build-reference/apk/`],
      ["Expo: Submit to the Google Play Store", `${X}/submit/android/`],
    ],
  }),
  g({
    slug: "android-app-signing-credentials",
    topic: "EAS Build",
    d: "medium",
    title: "Why does an Android app need signing, and how are credentials handled in Expo Build?",
    kw: ["app signing", "keystore", "upload certificate", "credentials", "google play app signing"],
    intent:
      "Checks that you understand signing keys and what to do when they are lost.",
    short:
      "Google requires all Android apps to be digitally signed with a certificate before they are installed on a device or updated. The private key and its certificate are usually kept in a keystore. Expo Build can generate and store credentials for you when you run eas build, reusing them on later builds, or you can provide your own. With App Signing by Google Play you upload an APK or AAB signed with an upload certificate, and Google Play replaces it with the app signing certificate. If the upload keystore is lost or compromised, you can contact Google Play support to reset the key.",
    detail: [
      "To distribute through the stores, the app must be a signed application.",
      "The keystore should be kept private and never checked into your repository.",
      "The command eas credentials lets you download or manage credentials.",
    ],
    ex: "On the first eas build, the developer accepts the offer to generate a keystore, which is reused for later builds.",
    mistakes: [
      "Committing a release keystore to the repository.",
      "Losing the only copy of a keystore that is not managed anywhere.",
    ],
    follow: ["How do you reset a lost upload key?"],
    points: [
      "All Android apps must be signed",
      "Keystore holds key and certificate",
      "Upload certificate with Google Play signing",
      "Keep the keystore private",
    ],
    notes: "Signed builds are required; keep or let Expo manage the keystore.",
    src: [
      ["Expo: App credentials", `${X}/app-signing/app-credentials/`],
      [
        "Expo: Using automatically managed credentials",
        `${X}/app-signing/managed-credentials/`,
      ],
    ],
  }),
  g({
    slug: "app-version-and-version-code",
    topic: "App configuration",
    d: "medium",
    title: "What is the difference between version and versionCode, and how can builds auto-increment?",
    kw: ["version", "versionCode", "buildNumber", "appVersionSource", "autoIncrement"],
    intent:
      "Checks that you avoid the common upload failure caused by duplicate build numbers.",
    short:
      "Each platform has a user-facing version visible in stores and a developer-facing build version. In the app config, version is the user-facing one; on Android it maps to versionName. android.versionCode is the Android developer-facing build version, and ios.buildNumber is the iOS one. You set the user-facing version yourself for a production release. For the build version, you can let Expo Build increment it: set cli.appVersionSource to remote in eas.json and autoIncrement to true in the production profile. The documentation notes that submitting a build with a duplicate version number is a common cause of store rejection.",
    detail: [
      "The recommended source is remote, where Expo servers store and manage the build version.",
      "You can choose a local source and control versions manually in config files.",
      "expo-application can show both values inside the app.",
    ],
    ex: "Each production build raises versionCode automatically, so the Play Store upload is never a duplicate.",
    mistakes: [
      "Forgetting to raise versionCode before uploading a new build.",
      "Confusing the user-facing version with the build version.",
    ],
    follow: ["Where does Google Play read the version from?"],
    points: [
      "version is user-facing",
      "versionCode is Android build version",
      "Duplicate numbers cause rejection",
      "autoIncrement with remote source",
    ],
    notes: "version for users, versionCode for the store; auto-increment the latter.",
    src: [["Expo: App version management", `${X}/build-reference/app-versions/`]],
  }),
  g({
    slug: "expo-submit-to-google-play",
    topic: "EAS Build",
    d: "medium",
    title: "How do you submit an Android build to Google Play with Expo Submit?",
    kw: ["eas submit", "google play console", "service account key", "internal track", "aab"],
    intent:
      "Checks that you know the prerequisites and what the first release looks like.",
    short:
      "Expo Submit uploads your .aab to Google Play Console and places it in the track you choose: internal, alpha, beta or production. Before the first submission you need a Google Play Developer account, an app created in Play Console, and a Google Service Account key uploaded to Expo Services. You also include the Android package name in the app config. You then build a production AAB and run eas submit. For a brand-new app, the default command creates the first release on the internal testing track, even before the store listing is complete.",
    detail: [
      "To go beyond internal testing, finish the setup tasks in Play Console and promote the release.",
      "Setting releaseStatus to draft in eas.json uploads a build without rolling it out.",
      "Manual upload through Play Console is the alternative.",
    ],
    ex: "After a production build, the developer runs eas submit and the AAB appears on the internal testing track.",
    mistakes: [
      "Submitting before the app exists in Play Console.",
      "Leaving out the package name in the app config.",
    ],
    follow: ["How do you move a release from internal testing to production?"],
    points: [
      "Uploads an AAB",
      "Needs a service account key",
      "Package name in config",
      "First release goes to internal track",
    ],
    notes: "Build an AAB, then eas submit.",
    src: [
      ["Expo: Submit to the Google Play Store", `${X}/submit/android/`],
      ["Expo: Submit to app stores", `${X}/deploy/submit-to-app-stores/`],
    ],
  }),
  g({
    slug: "over-the-air-updates",
    topic: "EAS Build",
    d: "medium",
    title: "What are over-the-air updates in Expo, and what can they change?",
    kw: ["expo update", "expo-updates", "over-the-air", "eas update", "channel"],
    intent:
      "Checks that you know updates replace JavaScript and assets, not native code.",
    short:
      "Expo Update is a cloud service that serves updates for projects using the expo-updates library. It lets an app update its own non-native pieces, such as JavaScript, styling and images, over the air, which is useful for small bug fixes between app store submissions. You install expo-updates, run eas update:configure, create a new build that includes the library, and then publish with eas update --channel production. Users receive the new version on their next app launch. If an update performs badly, you can republish a previous stable version on top of it.",
    detail: [
      "The updates JavaScript API includes a useUpdates hook and checkForUpdateAsync and fetchUpdateAsync methods.",
      "A deployments dashboard shows which updates go to which builds.",
      "Changes to native code still need a new store build.",
    ],
    ex: "A typo fix in the checkout screen goes out as an update without a new store release.",
    mistakes: [
      "Expecting an update to deliver a new native library.",
      "Forgetting that the installed build must already include expo-updates.",
    ],
    follow: ["What is a runtime version?"],
    points: [
      "Updates JS, styling and images",
      "Needs expo-updates in the build",
      "Published to a channel",
      "Can republish a stable version",
    ],
    notes: "OTA updates change non-native parts only.",
    src: [["Expo: Expo Update", `${X}/eas-update/introduction/`]],
  }),
  g({
    slug: "channels-and-runtime-version",
    topic: "EAS Build",
    d: "hard",
    title: "What are channels and runtime versions, and why do they matter for updates?",
    kw: ["channel", "runtimeVersion", "binary compatibility", "native runtime", "update"],
    intent:
      "Checks that you can prevent an update from reaching an incompatible binary.",
    short:
      "Each build profile can be assigned a channel in eas.json, so builds from a profile only pull updates published to that channel, for example a production channel for production builds and a staging channel for internal builds. The native runtime can change with each build. If you publish a JavaScript bundle to a binary with an incompatible native runtime, the app may misbehave or crash. The documentation recommends a different runtime version for each binary version, and you should increment it any time the native runtime changes, for example when you add or remove a native library.",
    detail: [
      "The runtimeVersion field in the app config can use policies such as appVersion, nativeVersion, sdkVersion or fingerprint.",
      "Updates published with a runtimeVersion cannot be loaded in Expo Go.",
      "Use a development build to preview updates.",
    ],
    ex: "After adding a native library the team raises the runtime version so old binaries do not receive the new bundle.",
    mistakes: [
      "Publishing to a channel used by binaries with different native code.",
      "Not changing the runtime version after adding a native module.",
    ],
    follow: ["How would you roll back a bad update?"],
    points: [
      "Channel links a build to updates",
      "Runtime version marks native compatibility",
      "Raise it when native code changes",
      "Incompatible updates can crash",
    ],
    notes: "Channel picks the stream; runtime version guards compatibility.",
    src: [
      ["Expo: Using Expo Update with Expo Build", `${X}/build/updates/`],
      ["Expo: app.json / app.config.js reference", `${X}/versions/latest/config/app/`],
    ],
  }),
  g({
    slug: "what-happens-during-an-android-build",
    topic: "EAS Build",
    d: "hard",
    title: "What happens when you run eas build for Android?",
    kw: ["build process", "credentials", "docker container", "prebuild", "expo-doctor"],
    intent:
      "Checks that you can explain the local and remote stages of a cloud build.",
    short:
      "The process has a local phase and a remote one. Locally, EAS CLI checks that the git index is clean if cli.requireCommit is set, prepares the credentials from the local credentials.json or from Expo servers, creates a tarball of the repository, uploads it to a private storage bucket and sends the build request. Remotely, a new Docker container with the build tools is created for each build, the tarball is downloaded and unpacked, dependencies are installed, npx expo-doctor diagnoses configuration problems, and for projects using Continuous Native Generation, npx expo prebuild runs before compilation.",
    detail: [
      "A pre-install script named eas-build-pre-install runs from package.json if defined.",
      "If remote credentials are selected and none exist, you are prompted to generate a keystore.",
      "Every build gets its own fresh container with Java, the Android SDK and the NDK installed.",
    ],
    ex: "A build fails at the dependency step, so the developer checks the lock file and the build logs.",
    mistakes: [
      "Assuming uncommitted local files are included without checking the build configuration.",
      "Expecting builds to share state between runs.",
    ],
    follow: ["How can you build on your own machine instead?"],
    points: [
      "Local prepare, then remote build",
      "Fresh container per build",
      "Credentials prepared first",
      "Prebuild runs for CNG projects",
    ],
    notes: "Prepare locally, build in a fresh remote container.",
    src: [["Expo: Android build process", `${X}/build-reference/android-builds/`]],
  }),
  g({
    slug: "building-locally-with-expo-run",
    topic: "Expo SDK & workflow",
    d: "medium",
    title: "How do you build an Expo app on your own machine?",
    kw: ["expo run:android", "expo run:ios", "local build", "debug build", "android studio"],
    intent:
      "Checks that you know the local alternative to cloud builds and its prerequisites.",
    short:
      "Use the compile commands from Expo CLI: npx expo run:android and npx expo run:ios. They need Android Studio or Xcode installed. Each command compiles your project with the locally installed SDK into a debug build, installs it on your device or emulator, and starts the Metro bundler to serve your JavaScript. If the android and ios directories do not exist, they run npx expo prebuild first. You can add --device to choose a device, or --variant release for Android to build a production variant, but such builds are not signed, so you cannot submit them to app stores.",
    detail: [
      "You can also run the hosted build tool locally with eas build --local.",
      "Android Studio is also needed for emulators.",
      "After native dependencies or the app config change, run prebuild again before rebuilding.",
    ],
    ex: "A developer debugging a native crash runs npx expo run:android and uses Android Studio tools.",
    mistakes: [
      "Trying to submit an unsigned release build to a store.",
      "Not reinstalling after native dependency changes.",
    ],
    follow: ["When would you choose the cloud build instead?"],
    points: [
      "expo run:android and run:ios",
      "Needs Android Studio or Xcode",
      "Runs prebuild if needed",
      "Local release builds are unsigned",
    ],
    notes: "Local debug builds with expo run; cloud builds for releases.",
    src: [
      ["Expo: Create a debug build locally", `${X}/guides/local-app-development/`],
      ["Expo: Create a development build", `${X}/develop/development-builds/introduction/`],
    ],
  }),
  g({
    slug: "expo-app-icon-and-android-package",
    topic: "App configuration",
    d: "easy",
    title: "Which app config settings identify and brand an Android app?",
    kw: ["android.package", "icon", "splash screen", "app identity", "app config"],
    intent:
      "Checks that you know the basic identity settings to set before a release.",
    short:
      "The app config holds the name and slug, the icon, the splash screen and the deep linking scheme. For Android, android.package sets the package name, for example com.yourcompany.yourapp, which Expo Submit needs in the app config. The top-level icon is a local path or remote URL to an image used as the app icon, and the documentation recommends a 1024x1024 png. An android.icon value, if specified, overrides the top-level icon on Android. The scheme is a string that must start with a lowercase letter and may contain lowercase letters, digits, plus, dot or hyphen characters.",
    detail: [
      "Expo Submit needs the package name in the app config to submit an Android app.",
      "For an existing React Native app these settings are changed in the native files instead.",
      "Run prebuild again to apply changes to generated native projects.",
    ],
    ex: "Before first submission the developer sets android.package to the company's reverse-domain name.",
    mistakes: [
      "Leaving the package name out of the app config before submitting.",
      "Using an image of the wrong size for the icon.",
    ],
    follow: ["Where is the splash screen configured?"],
    points: [
      "android.package sets the package name",
      "icon is a 1024x1024 png recommended",
      "android.icon overrides on Android",
      "scheme follows a pattern",
    ],
    notes: "Set package name, icon and scheme in the app config.",
    src: [
      ["Expo: app.json / app.config.js reference", `${X}/versions/latest/config/app/`],
      ["Expo: Submit to the Google Play Store", `${X}/submit/android/`],
    ],
  }),
])
