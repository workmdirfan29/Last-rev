import { defineQuestions } from "../author"
import { g } from "../brief"

const D = "https://developer.android.com"
const P = "https://support.google.com/googleplay/android-developer/answer"

export default defineQuestions("android-release", "fresher", [
  g({
    slug: "apk-vs-aab-format",
    topic: "Android fundamentals",
    d: "easy",
    title: "What is the difference between an APK and an Android App Bundle?",
    kw: ["apk", "aab", "android app bundle", "publishing format", "optimized apks"],
    intent:
      "Checks that you know which file installs on a device and which one you upload to the store.",
    short:
      "An APK is an Android package, an archive with an .apk suffix, that contains the contents of the app required at runtime. It is the file Android devices install. An Android App Bundle is an archive with an .aab suffix that contains the project's contents plus metadata not needed at runtime. It is a publishing format and cannot be installed on a device. It defers APK generation and signing to a later stage, so when you publish on Google Play, Play generates optimised APKs containing only what each requesting device needs.",
    detail: [
      "Google Play requires new apps to be published as app bundles; this has applied since August 2021.",
      "With bundles you no longer have to build, sign and manage multiple APKs for different device configurations.",
      "Optional extras such as Play Feature Delivery build on the bundle format.",
    ],
    ex: "The team uploads one signed .aab to Google Play, and each user's phone downloads an APK made for its screen and CPU.",
    mistakes: [
      "Trying to install an .aab file directly on a phone.",
      "Uploading only an APK for a brand-new app on Google Play.",
    ],
    follow: ["How does Play App Signing relate to bundles?"],
    points: [
      "APK installs on devices",
      "AAB is a publishing format",
      "Play generates optimised APKs",
      "New apps need AAB",
    ],
    notes: "Install APK; publish AAB.",
    src: [
      ["Android Developers: Application fundamentals", `${D}/guide/components/fundamentals`],
      ["Android Developers: About Android App Bundles", `${D}/guide/app-bundle`],
    ],
  }),
  g({
    slug: "android-app-sandbox",
    topic: "Android fundamentals",
    d: "medium",
    title: "How does Android keep apps isolated from each other?",
    kw: ["sandbox", "linux user id", "process", "least privilege", "permissions"],
    intent:
      "Checks that you understand the basic security model behind app permissions.",
    short:
      "Each Android app lives in its own security sandbox. The operating system is a multi-user Linux system in which each app is a different user, and by default the system gives each app a unique Linux user ID. File permissions allow only that user ID to access the app's files, each process has its own virtual machine so code runs in isolation, and by default every app runs in its own process. The system also applies the principle of least privilege, so an app only reaches components it needs, plus anything the user explicitly grants through permissions.",
    detail: [
      "Two apps signed with the same certificate can arrange to share a user ID and so access each other's files.",
      "Apps with the same user ID can also arrange to run in the same process.",
      "An app can ask for device data such as location or camera, but the user has to grant it.",
    ],
    ex: "A notes app cannot read a banking app's files because the two run as different Linux users.",
    mistakes: [
      "Thinking apps can freely read each other's files.",
      "Forgetting that sharing a user ID requires the same signing certificate.",
    ],
    follow: ["What types of permissions does Android have?"],
    points: [
      "Each app is a separate Linux user",
      "Own process and VM by default",
      "Least privilege",
      "User grants sensitive permissions",
    ],
    notes: "One app, one Linux user, one sandbox.",
    src: [
      ["Android Developers: Application fundamentals", `${D}/guide/components/fundamentals`],
    ],
  }),
  g({
    slug: "four-app-components",
    topic: "Android fundamentals",
    d: "easy",
    title: "What are the four types of Android app components?",
    kw: ["activities", "services", "broadcast receivers", "content providers", "entry point"],
    intent:
      "Checks that you can name and distinguish the building blocks of an Android app.",
    short:
      "App components are the essential building blocks of an Android app, and each is an entry point through which the system or a user can enter your app. There are four types. An activity is the entry point for interacting with the user and represents a single screen with a user interface. A service keeps an app running in the background for long-running operations and has no user interface. A broadcast receiver lets the system deliver events to the app outside the regular user flow. A content provider manages a shared set of app data that other apps can query or modify if permitted.",
    detail: [
      "Each type has a distinct purpose and its own lifecycle that defines how it is created and destroyed.",
      "Broadcasts are delivered as Intent objects.",
      "A broadcast receiver is a subclass of BroadcastReceiver, and a content provider can be backed by a file, a SQLite database or the web.",
    ],
    ex: "An email app has an activity for the inbox, a service that syncs in the background and a receiver that reacts to a connectivity event.",
    mistakes: [
      "Saying a service has its own screen.",
      "Forgetting content providers and broadcast receivers.",
    ],
    follow: ["Where are the components declared?"],
    points: [
      "Activity, service, receiver, provider",
      "Each is an entry point",
      "Each has its own lifecycle",
      "All declared in the manifest",
    ],
    notes: "Activity = screen; service = background; receiver = events; provider = shared data.",
    src: [
      ["Android Developers: Application fundamentals", `${D}/guide/components/fundamentals`],
    ],
  }),
  g({
    slug: "what-is-an-activity",
    topic: "Android fundamentals",
    d: "easy",
    title: "What is an Activity in Android?",
    kw: ["activity", "screen", "main activity", "entry point", "window"],
    intent:
      "Checks that you know how Android differs from apps with a single main method.",
    short:
      "An activity is the entry point for interacting with the user and represents a single screen with a user interface. You implement it as a subclass of the Activity class, and it provides the window in which the app draws its UI. Unlike programs that start from a main method, the Android system initiates code in an Activity instance by invoking specific callback methods that correspond to stages of its lifecycle. One activity is typically the main activity, the first screen to appear when the user launches the app. You must register each activity in the manifest.",
    detail: [
      "A user's journey often begins in different places, for example when another app launches a screen in your app.",
      "When one app invokes another, it invokes an activity in the other app, not the app as a whole.",
      "In modern Compose apps one activity can host many composable destinations.",
    ],
    ex: "Tapping a shared link in a social app opens the compose-email activity directly inside the email app.",
    mistakes: [
      "Assuming every app starts at the same first screen.",
      "Forgetting to declare an activity in the manifest.",
    ],
    follow: ["What are the lifecycle callbacks of an activity?"],
    points: [
      "One screen with a UI",
      "Subclass of Activity",
      "System calls lifecycle callbacks",
      "Declared in the manifest",
    ],
    notes: "Activity = a screen the system can start at any point.",
    src: [
      ["Android Developers: Introduction to activities", `${D}/guide/components/activities/intro-activities`],
    ],
  }),
  g({
    slug: "activity-lifecycle-callbacks",
    topic: "Android fundamentals",
    d: "medium",
    title: "What are the activity lifecycle callbacks, and when is each called?",
    kw: ["onCreate", "onStart", "onResume", "onPause", "onStop"],
    intent:
      "Checks that you know where to put setup and cleanup code.",
    short:
      "The Activity class provides six core callbacks: onCreate, onStart, onResume, onPause, onStop and onDestroy. onCreate must be implemented and fires when the activity is first created; use it for one-time startup logic. onStart makes the activity visible. onResume is called when it comes to the foreground, the state in which the app interacts with the user. onPause is the first indication the user is leaving the activity; it is no longer in the foreground but may still be visible in multi-window mode. onStop and onDestroy follow as it is hidden and finally removed.",
    detail: [
      "onStart and onResume run in quick succession after onCreate.",
      "onPause does not always mean the activity is being destroyed.",
      "Code for dependent components should live in lifecycle-aware components rather than inside the activity callbacks.",
    ],
    ex: "A video screen pauses playback in onPause and releases heavier resources when it stops.",
    mistakes: [
      "Doing heavy work in onPause, which delays the next screen.",
      "Assuming onPause means the activity is gone.",
    ],
    follow: ["What happens when the screen rotates?"],
    points: [
      "Six core callbacks",
      "onCreate runs once per instance",
      "onResume is the interactive state",
      "onPause is not destruction",
    ],
    notes: "Create, Start, Resume, Pause, Stop, Destroy.",
    src: [
      ["Android Developers: The activity lifecycle", `${D}/guide/components/activities/activity-lifecycle`],
    ],
  }),
  g({
    slug: "configuration-change-recreation",
    topic: "Android fundamentals",
    d: "medium",
    title: "What happens to an activity when the screen is rotated or the configuration changes?",
    kw: ["configuration change", "activity recreation", "rotation", "onDestroy", "state"],
    intent:
      "Checks that you know why state can be lost on rotation.",
    short:
      "Some device configurations can change while the app is running, including display size, screen density, orientation, font size and weight, locale and dark theme. The platform handles this with activity recreation: the system calls onDestroy and destroys the existing activity instance, then creates a new instance with onCreate, initialised with the new configuration. This means any state held only in the old activity instance is lost unless you save or retain it. The documentation describes ways to store UI state so the recreated activity can restore it.",
    detail: [
      "Configuration changes can happen more often on foldables and on ChromeOS devices because they are more flexible.",
      "The savedInstanceState bundle passed to onCreate is one place state can be restored from.",
      "Resources are also re-selected for the new configuration at recreation.",
    ],
    ex: "A form activity keeps typed text in a ViewModel so it survives rotation.",
    mistakes: [
      "Keeping user input only in a field of the activity.",
      "Blocking rotation instead of handling state properly.",
    ],
    follow: ["How do alternative resources relate to configuration?"],
    points: [
      "Many settings can change at runtime",
      "System recreates the activity",
      "onDestroy then onCreate",
      "Save UI state to restore it",
    ],
    notes: "Configuration change = destroy and recreate the activity.",
    src: [
      ["Android Developers: Handle configuration changes", `${D}/guide/topics/resources/runtime-changes`],
      ["Android Developers: The activity lifecycle", `${D}/guide/components/activities/activity-lifecycle`],
    ],
  }),
  g({
    slug: "android-manifest-file",
    topic: "Android fundamentals",
    d: "easy",
    title: "What is AndroidManifest.xml and what must it declare?",
    kw: ["androidmanifest.xml", "manifest", "components", "permissions", "features"],
    intent: "Checks that you know what the build tools and Google Play read from the manifest.",
    short:
      "Every app project must have a file named exactly AndroidManifest.xml at the root of the project source set. It describes essential information about the app to the Android build tools, the Android operating system and Google Play. It must declare the app's components: activity, service, receiver and provider elements for each subclass. It also declares the permissions the app needs, and the hardware and software features it requires, which affect which devices can install the app from Google Play. If you subclass a component without declaring it, the system cannot start it.",
    detail: [
      "Android Studio creates the manifest and adds many of the essential elements as you build.",
      "Intent filters in the manifest describe how a component can be started.",
      "A leading period in a component name is prefixed with the namespace from the module's build file.",
    ],
    ex: "Adding a new screen requires an activity element in the manifest, or the system cannot launch it.",
    mistakes: [
      "Creating an activity class and never declaring it.",
      "Requesting hardware features that exclude many devices without meaning to.",
    ],
    follow: ["What is an intent filter?"],
    points: [
      "Named AndroidManifest.xml",
      "Declares components",
      "Declares permissions",
      "Declares required features",
    ],
    notes: "The manifest tells the system, the tools and Play what the app is.",
    src: [
      ["Android Developers: App manifest overview", `${D}/guide/topics/manifest/manifest-intro`],
    ],
  }),
  g({
    slug: "explicit-vs-implicit-intents",
    topic: "Android fundamentals",
    d: "medium",
    title: "What is the difference between explicit and implicit intents?",
    kw: ["intent", "explicit intent", "implicit intent", "intent filter", "componentname"],
    intent:
      "Checks that you know how components start each other and the security rule for services.",
    short:
      "An intent is a messaging object used to request an action from another app component. An explicit intent specifies which component of which application will satisfy it, by giving a full component name; you typically use it to start a component in your own app, because you know the class name. An implicit intent does not name a component but declares a general action to perform, which lets a component from another app handle it. Components declare intent filters in the manifest for the intents they accept. For security, always start a service with an explicit intent.",
    detail: [
      "An activity without intent filters can be started only with an explicit intent.",
      "Using an implicit intent to start a service is a security hazard, because you cannot be sure what service will respond and the user cannot see which starts.",
      "Intents are also used to deliver broadcasts.",
    ],
    ex: "An app starts its own settings screen with an explicit intent, and opens a link in another app with an implicit one.",
    mistakes: [
      "Starting a service with an implicit intent.",
      "Declaring an intent filter on a component that should be private.",
    ],
    follow: ["How are broadcasts delivered?"],
    points: [
      "Explicit names the component",
      "Implicit names an action",
      "Intent filters declare what is accepted",
      "Use explicit for services",
    ],
    notes: "Explicit = who; implicit = what.",
    src: [
      ["Android Developers: Intents and intent filters", `${D}/guide/components/intents-filters`],
    ],
  }),
  g({
    slug: "services-background-work",
    topic: "Android fundamentals",
    d: "medium",
    title: "What is a Service in Android and what is it for?",
    kw: ["service", "background", "long-running", "no user interface", "jobscheduler"],
    intent:
      "Checks that you know a service has no UI and when background work applies.",
    short:
      "A service is a general-purpose entry point for keeping an app running in the background for all kinds of reasons. It is a component that runs in the background to perform long-running operations or work for remote processes, and it does not provide a user interface. For example, a service might play music while the user is in another app, or fetch data over the network without blocking the activity. You declare it with a service element in the manifest. The fundamentals page suggests JobScheduler for scheduling work on Android 5.0 and above, because it conserves battery.",
    detail: [
      "Start a service with an explicit intent and do not declare intent filters on it.",
      "JobScheduler works with the Doze API to reduce power consumption.",
      "Like other components, a service is declared in the manifest.",
    ],
    ex: "A music app keeps a service running to continue playback after the user leaves its screen.",
    mistakes: [
      "Using a service for work that could be a scheduled job.",
      "Assuming a service shows a screen.",
    ],
    follow: ["Why should services use explicit intents?"],
    points: [
      "Background component with no UI",
      "Long-running operations",
      "Declared in the manifest",
      "Scheduling APIs save battery",
    ],
    notes: "Service = background work, never a screen.",
    src: [
      ["Android Developers: Application fundamentals", `${D}/guide/components/fundamentals`],
      ["Android Developers: Intents and intent filters", `${D}/guide/components/intents-filters`],
    ],
  }),
  g({
    slug: "android-permission-types",
    topic: "Android fundamentals",
    d: "medium",
    title: "What types of permissions does Android have?",
    kw: ["install-time permissions", "runtime permissions", "special permissions", "manifest", "protection level"],
    intent:
      "Checks that you know when a permission needs a user prompt.",
    short:
      "App permissions protect restricted data, such as system state and contact information, and restricted actions, such as recording audio. Android categorises them into install-time permissions, runtime permissions and special permissions. Install-time permissions give limited access that minimally affects the system or other apps, and they are granted automatically when the app is installed. Runtime permissions require your app to request them while it runs, and the user decides. First check whether you can do the job without declaring any permission; many use cases, such as taking photos, need none.",
    detail: [
      "The protection level of each permission is shown on the permissions API reference page.",
      "Install-time permissions appear to the user as a notice in the app store.",
      "You must declare permissions in the manifest.",
    ],
    ex: "An app asks for the camera at the moment the user taps a scan button, instead of at first launch.",
    mistakes: [
      "Declaring permissions the app does not need.",
      "Skipping the runtime request for a runtime permission.",
    ],
    follow: ["How do you request a runtime permission?"],
    points: [
      "Install-time, runtime and special",
      "Runtime needs a request in code",
      "Declare in the manifest",
      "Avoid permissions when possible",
    ],
    notes: "Ask only for what you need, and request runtime permissions in context.",
    src: [["Android Developers: Permissions on Android", `${D}/guide/topics/permissions/overview`]],
  }),
  g({
    slug: "app-resources-and-alternatives",
    topic: "Android fundamentals",
    d: "easy",
    title: "What are app resources, and how do alternative resources work?",
    kw: ["resources", "res directory", "strings.xml", "alternative resources", "configuration"],
    intent:
      "Checks that you keep strings and images out of code and support different devices.",
    short:
      "Resources are the additional files and static content your code uses, such as bitmaps, user interface strings and animation instructions. You should always externalise them from your code so they can be maintained independently. Each resource type goes in a subdirectory of the project's res directory, for example drawable, mipmap or values. You can provide alternative resources for specific device configurations by grouping them in specially named directories, and at runtime Android uses the appropriate resource for the current configuration, such as different strings for a language. You access them through generated IDs in the R class.",
    detail: [
      "A strings.xml file in values holds user interface text.",
      "Alternative resources are how you support different languages, screen sizes and densities.",
      "The runtime picks resources again when the configuration changes.",
    ],
    ex: "The app has res/values/strings.xml and a res/values-hi/strings.xml with Hindi text for users whose device uses Hindi.",
    mistakes: [
      "Hard-coding user-visible strings in code.",
      "Placing files in the wrong resource folder.",
    ],
    follow: ["What happens to resources when the locale changes?"],
    points: [
      "Externalise strings and images",
      "res/ subfolders by type",
      "Qualified folders give alternatives",
      "Accessed via the R class",
    ],
    notes: "Put content in res/ and let Android choose by configuration.",
    src: [["Android Developers: App resources overview", `${D}/guide/topics/resources/providing-resources`]],
  }),
  g({
    slug: "gradle-build-basics",
    topic: "App signing & builds",
    d: "easy",
    title: "How are Android apps built, and what is Gradle's role?",
    kw: ["gradle", "android gradle plugin", "tasks", "build phases", "build files"],
    intent:
      "Checks that you understand what happens when you press build.",
    short:
      "Android applications are typically built with the Gradle build system. A build transforms source code into an executable application using several tools to analyse, compile, link and package it. Gradle organises these commands as tasks, and plugins define tasks and their configuration. Applying the Android Gradle Plugin registers all the tasks needed to build an APK or an Android library. Gradle prefers convention over configuration, so plugins come with good defaults, and you configure the build through a declarative DSL in your build files. A build runs in three phases: initialisation, configuration and execution.",
    detail: [
      "Initialisation reads the settings file to decide which projects are in the build.",
      "Configuration registers tasks and runs the build files.",
      "The documentation advises keeping build logic in plugins and using build files to declare how to use it.",
    ],
    ex: "Running a Gradle build task compiles code and resources and packages them into an APK.",
    mistakes: [
      "Putting complicated logic directly in build files.",
      "Not knowing which build file configures the app module.",
    ],
    follow: ["What are build types and product flavours?"],
    points: [
      "Gradle runs tasks",
      "Plugins define tasks",
      "Android Gradle Plugin builds APKs",
      "Initialisation, configuration, execution",
    ],
    notes: "Gradle + Android Gradle Plugin turn source into an APK or AAB.",
    src: [["Android Developers: Gradle build overview", `${D}/build/gradle-build-overview`]],
  }),
  g({
    slug: "application-id-and-versions",
    topic: "App signing & builds",
    d: "medium",
    title: "What are applicationId, versionCode and versionName?",
    kw: ["applicationId", "versionCode", "versionName", "downgrade", "package name"],
    intent:
      "Checks that you know which values identify an app and how updates are ordered.",
    short:
      "The applicationId is defined in the module's build file and uniquely identifies your app; if you change it, Google Play treats the upload as a completely different app. To publish an update you must use the same application ID and the same signing certificate. versionCode is a positive integer used as an internal version number: higher means more recent, and the system uses it to prevent installing a lower version over a higher one. versionName is the string shown to users. Each release must use a greater versionCode, and you cannot upload a versionCode you have used before.",
    detail: [
      "The documentation notes that Google Play's greatest allowed versionCode is 2100000000.",
      "The first release usually has versionCode 1 and it increases with every release.",
      "versionCode need not resemble the version visible to users.",
    ],
    ex: "Version 1.2 is versionName, while its build number 14 is versionCode.",
    mistakes: [
      "Re-uploading a build with an old versionCode.",
      "Showing the versionCode to users instead of versionName.",
    ],
    follow: ["What happens if you change the application ID?"],
    points: [
      "applicationId identifies the app",
      "Updates need same ID and certificate",
      "versionCode orders releases",
      "versionName is for users",
    ],
    notes: "versionCode must keep increasing; applicationId must stay the same.",
    src: [
      ["Android Developers: Configure the app module", `${D}/build/configure-app-module`],
      ["Android Developers: Version your app", `${D}/studio/publish/versioning`],
    ],
  }),
  g({
    slug: "min-sdk-and-target-sdk",
    topic: "App signing & builds",
    d: "medium",
    title: "What do minSdk and targetSdk mean, and how does Google Play use them?",
    kw: ["minSdk", "targetSdk", "uses-sdk", "api level", "device filtering"],
    intent:
      "Checks that you know how the API level settings affect device support.",
    short:
      "The uses-sdk settings express an app's compatibility with versions of the Android platform by an API level integer. Google Play uses the attributes declared in the manifest to filter your app from devices that do not meet its platform version requirements. The Android system enforces system version compatibility as expressed by minSdk in the build files, which sets the minimum system API the app is compatible with. Setting minSdk too high excludes devices that cannot run the app. targetSdk designates the API level the app targets.",
    detail: [
      "The attributes sit in the uses-sdk element inside the manifest element, but are normally set in the Gradle build file.",
      "A maxSdkVersion attribute also exists in the same element.",
      "The version-information page notes the system does not enforce restrictions on third-party app compatibility, so your app must do that itself.",
    ],
    ex: "An app with minSdk 24 does not appear for devices running an older version of Android.",
    mistakes: [
      "Raising minSdk without checking how many devices it excludes.",
      "Confusing minSdk, which blocks installation on older systems, with targetSdk.",
    ],
    follow: ["Where do you set these values?"],
    points: [
      "API level integers",
      "minSdk is the minimum supported",
      "targetSdk is the tested level",
      "Play filters devices with them",
    ],
    notes: "minSdk decides who can install; targetSdk records what you tested for.",
    src: [
      ["Android Developers: uses-sdk element", `${D}/guide/topics/manifest/uses-sdk-element`],
      ["Android Developers: Version your app", `${D}/studio/publish/versioning`],
    ],
  }),
  g({
    slug: "build-types-variants-flavors",
    topic: "App signing & builds",
    d: "medium",
    title: "What are build types, product flavours and build variants?",
    kw: ["build types", "product flavors", "build variants", "debug", "release"],
    intent:
      "Checks that you can produce differently configured versions of one app.",
    short:
      "A build variant is the result of Gradle combining settings, code and resources from your build types and product flavours. You do not configure variants directly; you configure the build types and flavours that form them. A build type applies settings such as debug options and signing keys, and a product flavour can specify features and device requirements, such as custom source code, resources and minimum API levels. For example, a demo flavour combined with the debug build type gives a demoDebug variant. Variants let you build different versions of the app, for example targeting different devices.",
    detail: [
      "The debug build type applies different build and packaging settings, such as debug options and signing keys.",
      "Each variant includes the configuration and resources from its flavour and build type.",
      "You can build different versions of your app that target different devices, based on API level or other device variations.",
    ],
    ex: "A free flavour and a paid flavour each have debug and release variants, giving four variants in total.",
    mistakes: [
      "Mixing up a build type with a product flavour.",
      "Trying to configure a variant directly instead of its parts.",
    ],
    follow: ["How is a release build signed?"],
    points: [
      "Variant = build type + flavour",
      "Build types: debug and release",
      "Flavours change features and requirements",
      "Only parts are configured",
    ],
    notes: "demo + debug = demoDebug.",
    src: [["Android Developers: Configure build variants", `${D}/build/build-variants`]],
  }),
  g({
    slug: "r8-shrinking-release",
    topic: "App signing & builds",
    d: "medium",
    title: "What does R8 do, and should it be enabled for release builds?",
    kw: ["r8", "code shrinking", "optimization", "tree shaking", "release build"],
    intent:
      "Checks that you know how to make a release build smaller and faster.",
    short:
      "R8 is Android's app optimiser. It streamlines your app by removing unused code and resources and rewriting code to improve runtime performance. Its code shrinking, also called tree shaking, identifies unreachable code by analysing entry points such as activities and services defined in the manifest and removing anything unreferenced. It also applies logical optimisations such as method inlining and class merging. The documentation says you should always enable optimisation for the release build, but you probably don't want it for tests or libraries. For users this means faster startup, less memory use and fewer ANRs.",
    detail: [
      "Keep rules tell R8 which code must not be removed.",
      "R8 has an analyzer skill for finding redundant keep rules.",
      "Test and troubleshoot a release build, because optimisation can change behaviour.",
    ],
    ex: "Enabling optimisation on the release build type reduces the size of the app bundle.",
    mistakes: [
      "Releasing without testing the optimised build.",
      "Writing overly broad keep rules that prevent shrinking.",
    ],
    follow: ["Why can a release build behave differently from debug?"],
    points: [
      "Removes unused code and resources",
      "Optimises code for speed",
      "Enable for release builds",
      "Keep rules protect needed code",
    ],
    notes: "R8 shrinks and optimises release builds.",
    src: [
      ["Android Developers: Enable app optimization with R8", `${D}/topic/performance/app-optimization/enable-app-optimization`],
    ],
  }),
  g({
    slug: "why-sign-android-apps",
    topic: "App signing & builds",
    d: "easy",
    title: "Why must Android apps be signed?",
    kw: ["app signing", "certificate", "keystore", "digitally signed", "upload key"],
    intent:
      "Checks that you know signing is mandatory and what you sign with.",
    short:
      "Android requires that all APKs be digitally signed with a certificate before they are installed on a device or updated. When you release using Android App Bundles, you sign your bundle with an upload key before uploading it to Play Console, and Play App Signing takes care of the rest. For APKs distributed on the Play Store or other stores, you must sign the APKs yourself for upload. The high-level steps are to generate an upload key and keystore, sign the app with the upload key, configure Play App Signing, upload to Google Play, and then roll out the release.",
    detail: [
      "You can sign from Android Studio or from the command line with apksigner.",
      "An update must be signed with the same certificate as the version it replaces.",
      "Key upgrade in Play App Signing lets you change the app signing key if the existing one is compromised.",
    ],
    ex: "A developer generates a keystore in Android Studio and signs the release bundle with its upload key.",
    mistakes: [
      "Losing the keystore without a recovery plan.",
      "Forgetting that you must sign APKs yourself when you do not use app bundles.",
    ],
    follow: ["What is the difference between an upload key and an app signing key?"],
    points: [
      "All APKs must be signed",
      "Bundles are signed with an upload key",
      "Play App Signing handles the rest",
      "apksigner or Android Studio",
    ],
    notes: "Sign with an upload key; Play re-signs for users.",
    src: [["Android Developers: Sign your app", `${D}/studio/publish/app-signing`]],
  }),
  g({
    slug: "upload-key-vs-app-signing-key",
    topic: "App signing & builds",
    d: "hard",
    title: "What is the difference between the upload key and the app signing key in Play App Signing?",
    kw: ["play app signing", "upload key", "app signing key", "key reset", "keystore"],
    intent:
      "Checks that you know which key you hold and which one you can recover.",
    short:
      "With Play App Signing, Google manages and protects your app's signing key, and you deal with two keys. The upload key is held by you, stored in a Java keystore, and must be an RSA key of 2048 bits or more. You use it to sign your app bundle before uploading it, and Google uses it to verify your identity. If it is lost or compromised, Google can reset it. The app signing key is held by Google Play and is used to sign the final APKs delivered to users' devices. For maximum security your upload key and app signing key should be different.",
    detail: [
      "Google protects the signing key on its own secure infrastructure, using its Key Management Service.",
      "You can let Google generate the signing key or provide your own; a key you manage yourself cannot be reset if you lose it.",
      "Setting up Play App Signing requires admin permission.",
    ],
    ex: "The developer loses the upload keystore and asks Google Play to register a new upload key, while users keep receiving updates.",
    mistakes: [
      "Using the same key as both upload key and signing key.",
      "Assuming a lost self-managed signing key can be reset.",
    ],
    follow: ["How do you start with Play App Signing for a new app?"],
    points: [
      "You hold the upload key",
      "Google holds the app signing key",
      "Upload key can be reset",
      "Keep the two keys different",
    ],
    notes: "Upload key proves who you are; signing key signs what users install.",
    src: [["Play Console Help: Use Play App Signing", `${P}/9842756`]],
  }),
  g({
    slug: "create-app-in-play-console",
    topic: "Google Play Console",
    d: "easy",
    title: "How do you create an app in Google Play Console?",
    kw: ["play console", "create app", "package name", "developer account", "declarations"],
    intent:
      "Checks that you know the first steps of publishing and what cannot be changed later.",
    short:
      "First create a Google Play developer account. Then sign in to Play Console and click Create app. You enter the app name as you want it to appear, a package name, a default language, whether it is an app or a game, whether it is free or paid, and a contact email address for users. In the Declarations section you acknowledge the Developer Program Policies and US export laws declarations and accept the Play App Signing terms. The package name is unique and permanent, so name it carefully, because package names cannot be deleted or re-used.",
    detail: [
      "You can change the app name and the app or game choice later.",
      "After creating the app, the dashboard guides you through app content and the store listing, then release.",
      "Personal accounts created after a set date must meet testing requirements before the app can go public.",
    ],
    ex: "The developer creates the app, then follows the dashboard tasks until release management is available.",
    mistakes: [
      "Choosing a package name casually, when it is permanent.",
      "Skipping dashboard tasks, which leaves release creation disabled.",
    ],
    follow: ["What do the app content declarations cover?"],
    points: [
      "Create app in Play Console",
      "Name, package, language, type, price",
      "Package name is permanent",
      "Dashboard guides the setup",
    ],
    notes: "Create app, then work through the dashboard tasks.",
    src: [["Play Console Help: Create and set up your app", `${P}/9859152`]],
  }),
  g({
    slug: "app-content-declarations",
    topic: "Google Play Console",
    d: "medium",
    title: "What must you provide on the App content page before publishing?",
    kw: ["app content", "privacy policy", "ads declaration", "content rating", "target audience"],
    intent:
      "Checks that you know the policy declarations Play requires, not just the file upload.",
    short:
      "The App content page is where you submit mandatory safety, policy and legal declarations. You add a privacy policy, which you must link on your store listing and within your app even if you do not handle personal data. You declare whether the app contains ads, give instructions for accessing restricted parts of your app, describe the target audience and content, explain how you use high-risk or sensitive permissions, receive content ratings and describe your privacy and security practices. A Needs attention tab shows declarations to complete, and a privacy policy should be on a public, worldwide-accessible URL.",
    detail: [
      "The page has two tabs, Needs attention and Actioned.",
      "Review the information regularly and keep it up to date.",
      "Missing or poor declarations can delay review.",
    ],
    ex: "Before release the developer completes the ads declaration, content rating questionnaire and data safety details.",
    mistakes: [
      "Adding a privacy policy as a downloadable PDF.",
      "Forgetting to keep declarations current after adding new permissions.",
    ],
    follow: ["How are content ratings obtained?"],
    points: [
      "Privacy policy is required",
      "Declare ads and target audience",
      "Explain sensitive permissions",
      "Keep declarations up to date",
    ],
    notes: "Complete all App content declarations before release.",
    src: [["Play Console Help: Prepare your app for review", `${P}/9859455`]],
  }),
  g({
    slug: "play-testing-tracks",
    topic: "Store listing & release tracks",
    d: "medium",
    title: "What are the internal, closed and open testing tracks in Google Play?",
    kw: ["internal testing", "closed testing", "open testing", "testing tracks", "testers"],
    intent:
      "Checks that you can pick the right test audience before production.",
    short:
      "Play Console has three testing tracks before production. Internal testing distributes your app quickly to up to 100 testers for initial quality checks, and you can start it before completing app setup. Closed testing is for pre-release versions with a wider chosen set of testers to get targeted feedback, and you can create and name additional closed tracks. Open testing makes your test version visible on Google Play, where anyone can join and send private feedback. Google recommends starting with an internal test, then a small closed test. Feedback from testers does not affect your public rating.",
    detail: [
      "Testers need a Google Account or Google Workspace account to join.",
      "After first publishing a test, the link can take several hours to become available.",
      "For paid apps, internal testers can install for free, while open and closed testers must purchase.",
    ],
    ex: "A team ships each build to internal testing first, then promotes the stable one to a closed track.",
    mistakes: [
      "Expecting a new test link to work immediately.",
      "Opening a test before the store listing is ready for visibility.",
    ],
    follow: ["When is the test link available to testers?"],
    points: [
      "Internal up to 100 testers",
      "Closed for chosen testers",
      "Open is visible on Google Play",
      "Start with internal",
    ],
    notes: "Internal, then closed, then open, then production.",
    src: [["Play Console Help: Set up an open, closed, or internal test", `${P}/9845334`]],
  }),
  g({
    slug: "personal-account-testing-requirement",
    topic: "Store listing & release tracks",
    d: "hard",
    title: "What testing must a newer personal developer account complete before going to production?",
    kw: ["personal developer account", "closed test", "production access", "12 testers", "14 days"],
    intent:
      "Checks that you know a policy that can delay a first release.",
    short:
      "Google Play requires personal developer accounts created after November 13, 2023 to test their apps before they are eligible for distribution. The documented minimum is to run a closed test with at least 12 testers who have been opted in continuously for at least 14 days. Features such as Production and Pre-registration stay disabled until these requirements are met. When you meet the criteria, you apply for production access from the Dashboard in Play Console and answer questions about your app design, testing process and production readiness. Check the current help article, because policy details can change.",
    detail: [
      "The requirement applies to personal accounts, not to the same accounts created before that date.",
      "Testing consistently helps verify correctness, behaviour and usability before public release.",
      "Plan your timeline, because the test period delays the first production release.",
    ],
    ex: "A new developer starts a closed test early, recruits testers and applies for production access once the period is complete.",
    mistakes: [
      "Planning a launch date without allowing for the test period.",
      "Relying on an old description of the requirement.",
    ],
    follow: ["Which testing track would you use for this?"],
    points: [
      "Applies to newer personal accounts",
      "Closed test with minimum testers and days",
      "Production stays disabled until met",
      "Then apply for production access",
    ],
    notes: "Closed test first, then apply for production access.",
    src: [
      ["Play Console Help: App testing requirements for new personal developer accounts", `${P}/14151465`],
    ],
  }),
  g({
    slug: "create-and-roll-out-release",
    topic: "Store listing & release tracks",
    d: "medium",
    title: "How do you create and roll out a release in Play Console?",
    kw: ["release", "app bundle", "release notes", "staged rollout", "track"],
    intent:
      "Checks that you know the steps and the rules around releases.",
    short:
      "A release is one or more app versions you prepare to launch an app or roll out an update. You can create it on a testing track or in production. Go to the track, click Create new release, follow the instructions to set up Play App Signing if it is your first release, add your app bundles, name the release and enter localised release notes, then review and resolve any errors. For an existing app you can choose a rollout percentage, which is unavailable for a first release. You cannot create a new release while outstanding releases exist; roll staged releases to 100% or discard unpublished ones first.",
    detail: [
      "You need the Release apps to testing tracks account permission to create a new release.",
      "Errors block publishing, while warnings and minor issues still allow it.",
      "Complete outstanding dashboard tasks if the Create new release button is disabled.",
    ],
    ex: "The team uploads the bundle, adds release notes, selects a small rollout percentage and starts the rollout.",
    mistakes: [
      "Trying to create a release while a staged one is still partial.",
      "Ignoring warnings that point at real issues.",
    ],
    follow: ["What is a staged rollout?"],
    points: [
      "Create release on a track",
      "Add bundles and release notes",
      "Review errors before publishing",
      "Staged rollout for existing apps",
    ],
    notes: "Pick track, add bundle and notes, review, start rollout.",
    src: [["Play Console Help: Prepare and roll out a release", `${P}/9859348`]],
  }),
  g({
    slug: "app-publishing-statuses",
    topic: "Store listing & release tracks",
    d: "medium",
    title: "What do the app publishing statuses in Play Console mean?",
    kw: ["publishing status", "draft", "production", "unpublished", "suspended"],
    intent:
      "Checks that you can read the status of an app and tell what to do next.",
    short:
      "Play Console shows an app status under the app name. Draft means the app has no presence on Google Play because it has not been published or was rejected in review. Internal testing means it is available to testers by URL only and is not discoverable. Closed testing means it is discoverable but only selected testers can install it. Open testing means any user can become a tester. Production means it is available to users in your chosen countries. Unpublished means you removed it, and only existing users can find it. Removed or suspended by Google needs a compliant update or an appeal.",
    detail: [
      "There are three kinds of status: app, update and item.",
      "Update statuses include In review and Update rejected, and App rejected applies only to first-time drafts.",
      "Review can take longer for some developer accounts, with times up to seven days or more.",
    ],
    ex: "An app shows Draft after a rejected first submission, and the developer fixes the issue and resubmits.",
    mistakes: [
      "Treating Unpublished the same as Removed by Google.",
      "Waiting without checking the update status for a rejection.",
    ],
    follow: ["What do you do after Update rejected?"],
    points: [
      "App, update and item statuses",
      "Draft means no presence",
      "Production is public",
      "Removed or suspended needs action",
    ],
    notes: "Read the status first; each one tells you who can see the app.",
    src: [["Play Console Help: Publish your app", `${P}/9859751`]],
  }),
  g({
    slug: "store-listing-preview-assets",
    topic: "Store listing & release tracks",
    d: "easy",
    title: "What preview assets belong on a store listing?",
    kw: ["store listing", "feature graphic", "screenshots", "short description", "preview video"],
    intent:
      "Checks that you know the graphics and text that present an app to users.",
    short:
      "Preview assets showcase your app's features and functionality on its Google Play listing and help attract users. The feature graphic, screenshots, short description and videos are used to highlight and promote your app on Google Play and other Google promotional channels. You manage them on the Main store listing page in Play Console, where the Graphics section lets you upload images and add a preview video. Requirements on the help page are mandatory and failing them can result in removal or suspension, while the 'highly recommended' guidelines affect eligibility for recommendation and promotion.",
    detail: [
      "Assets are shown on your store listing across all test tracks once added.",
      "By making your app available you grant Google a licence to use its assets for promotion.",
      "An External marketing setting can restrict promotion across Google-owned properties.",
    ],
    ex: "The developer uploads screenshots for phones, a feature graphic and a short description, then checks them against the guidelines.",
    mistakes: [
      "Ignoring the mandatory requirements for assets.",
      "Ignoring the highly recommended guidelines and losing promotion opportunities.",
    ],
    follow: ["How do you localise a listing?"],
    points: [
      "Feature graphic, screenshots, short description, video",
      "Managed on Main store listing",
      "Requirements are mandatory",
      "Guidelines affect promotion",
    ],
    notes: "Complete the listing assets and follow the content requirements.",
    src: [["Play Console Help: Add preview assets to showcase your app", `${P}/9866151`]],
  }),
  g({
    slug: "app-category-and-tags",
    topic: "Store listing & release tracks",
    d: "easy",
    title: "How do category and tags help users find an app, and how many tags can you add?",
    kw: ["category", "tags", "discovery", "accessibility tags", "store listing"],
    intent:
      "Checks that you choose tags honestly for discovery.",
    short:
      "You choose a category and add tags to your app or game in Play Console. Categories and tags help users search for and discover the most relevant apps on Google Play in a browser and in the Google Play app. Choose tags that are most obviously relevant, where it would be clear to someone unfamiliar with the app why the tag applies. Do not add tags for related genres just to attract similar players. An app or game can have a maximum of five tags. You can also use accessibility tags, such as screen reader-friendly, to signal compatibility with assistive technologies.",
    detail: [
      "The help article suggests changing tags only after significant changes in content or functionality.",
      "When re-evaluating, make sure the five most relevant tags are selected.",
      "Pick the strongest tags if more than five apply.",
    ],
    ex: "A racing game with vintage cars uses the tags Racing and Car racing, not Stunt driving.",
    mistakes: [
      "Adding tags for genres the app does not belong to.",
      "Changing tags often without a change in the app.",
    ],
    follow: ["Where is the category set?"],
    points: [
      "Category and tags aid discovery",
      "Maximum five tags",
      "Choose obviously relevant tags",
      "Accessibility tags are available",
    ],
    notes: "Five relevant tags, chosen honestly.",
    src: [["Play Console Help: Choose a category and tags for your app or game", `${P}/9859673`]],
  }),
  g({
    slug: "localize-store-listing",
    topic: "Store listing & release tracks",
    d: "easy",
    title: "How can you localise a Google Play store listing?",
    kw: ["localization", "translations", "store listing", "manage translations", "languages"],
    intent:
      "Checks that you can present your app in the user's language.",
    short:
      "You can add translations for your store listing page, app strings or in-app products, either yourself or by purchasing and applying translations through Play Console. For the listing, go to the Store Listings page, select your store listing, click Manage translations, choose Select languages, and add the languages you want, then apply and save. You can add your own text translations and localised graphic assets. If a user's language preference matches a language you added, they see the translated version. Play Console also lets you opt in to automatic translation of your app strings.",
    detail: [
      "Translations cover the store listing, app strings and in-app products.",
      "Localised graphics can be provided along with text.",
      "Release notes can also be localised when you create a release.",
    ],
    ex: "An app adds Hindi and Tamil store listings so users with those language settings see a translated page.",
    mistakes: [
      "Translating the app but leaving the listing in one language.",
      "Adding languages in the app but not in the store listing.",
    ],
    follow: ["How are resources localised inside the app?"],
    points: [
      "Translate listing, strings and products",
      "Use Manage translations",
      "User language selects the version",
      "Localised graphics are possible",
    ],
    notes: "Add languages in Manage translations and supply the text.",
    src: [["Play Console Help: Translate and localize your app", `${P}/9844778`]],
  }),
])
