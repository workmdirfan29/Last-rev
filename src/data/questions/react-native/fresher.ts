import { defineQuestions } from "../author"
import { g } from "../brief"

const RN = "https://reactnative.dev/docs"
const NAV = "https://reactnavigation.org/docs"

export default defineQuestions("react-native", "fresher", [
  g({
    slug: "what-is-react-native",
    topic: "Components & styling",
    d: "easy",
    title: "What is React Native and what are native components?",
    kw: ["react native", "native components", "views", "android", "ios"],
    intent:
      "Checks that you know React Native renders real platform views, not a web page.",
    short:
      "React Native is an open source framework for building Android and iOS apps using React and the platform's native capabilities. You write JavaScript and describe the UI with React components. At runtime React Native creates the matching Android and iOS views for those components, which the documentation calls native components. Because they are backed by the same views as native apps, the result looks and feels like any other app on the platform.",
    detail: [
      "A view is the basic building block of mobile UI: a small rectangular element that shows text, shows an image or responds to input.",
      "On Android views are written in Kotlin or Java and on iOS in Swift or Objective-C. React Native lets you use them from JavaScript through components.",
      "React Native ships a set of ready-made core components, and you can write your own native components when you need one.",
    ],
    ex: "A screen written with View and Text becomes an Android ViewGroup and TextView on Android, and a UIView and UITextView on iOS.",
    mistakes: [
      "Describing React Native as a website shown inside an app.",
      "Forgetting that platform differences still exist and need testing on both systems.",
    ],
    follow: ["What are the core components?"],
    points: [
      "Open source framework using React",
      "Components map to real native views",
      "JavaScript describes UI and behaviour",
      "Custom native components are possible",
    ],
    notes:
      "React Native = React components that create real Android and iOS views.",
    src: [
      [
        "React Native: Core Components and Native Components",
        `${RN}/intro-react-native-components`,
      ],
    ],
  }),
  g({
    slug: "core-components-mapping",
    topic: "Components & styling",
    d: "easy",
    title: "Which core components do you use most, and what do they map to?",
    kw: ["view", "text", "image", "scrollview", "textinput"],
    intent:
      "Checks that you can name the basic building blocks and their native and web equivalents.",
    short:
      "The basic core components are View, Text, Image, ScrollView and TextInput. View is a container that supports flexbox layout, style, some touch handling and accessibility, and is like a non-scrolling div. Text displays and styles strings. Image shows images. ScrollView is a generic scrolling container. TextInput lets the user type. On Android they are backed by ViewGroup, TextView, ImageView, ScrollView and EditText, and on iOS by UIView, UITextView, UIImageView, UIScrollView and UITextField.",
    detail: [
      "View is the container for layout and touch handling, while Text is the component that displays and styles strings.",
      "These components are the starting point for most screens, and many more are documented in the API section.",
      "Because they use native views underneath, they follow each platform's behaviour.",
    ],
    ex: "A login screen is a View containing a Text title, two TextInput fields and a button.",
    mistakes: [
      "Using web tags such as div or p instead of View and Text.",
      "Using a View where a Text is needed to show a string.",
    ],
    follow: ["How is ScrollView different from FlatList?"],
    points: [
      "View is the container",
      "Text shows strings",
      "TextInput takes user text",
      "Each maps to a native view",
    ],
    notes: "View, Text, Image, ScrollView, TextInput are the basic blocks.",
    src: [
      [
        "React Native: Core Components and Native Components",
        `${RN}/intro-react-native-components`,
      ],
    ],
  }),
  g({
    slug: "props-vs-state",
    topic: "Components & styling",
    d: "easy",
    title: "What is the difference between props and state in React Native?",
    kw: ["props", "state", "component", "re-render", "data flow"],
    intent:
      "Checks the core React data model, which carries over unchanged to mobile.",
    short:
      "Props are parameters a parent sets when it creates a component, and they stay fixed for that component's lifetime from its own point of view. State holds data that changes over time, such as whether a modal is open or what a user typed. When state changes the component re-renders. The documentation notes that state works the same way as in React. Use props to customise a component, and state for data the component itself changes.",
    detail: [
      "A Greeting component takes a name prop so one component can be reused with different values.",
      "Data from a server or from user input is typically kept in state, or in a state container such as Redux.",
      "State works the same way as in React, so the React documentation applies.",
    ],
    ex: "A product card receives title and price as props, while the quantity selector inside it keeps the chosen quantity in state.",
    mistakes: [
      "Trying to change props inside the child component.",
      "Storing a value in state that can be calculated from existing props.",
    ],
    follow: ["How would you share state between two screens?"],
    points: [
      "Props come from the parent",
      "State changes over time",
      "State change triggers re-render",
      "Same model as React",
    ],
    notes: "Props are given to you; state is owned by you and can change.",
    src: [
      ["React Native: Props", `${RN}/props`],
      ["React Native: State", `${RN}/state`],
    ],
  }),
  g({
    slug: "styling-with-stylesheet",
    topic: "Components & styling",
    d: "easy",
    title: "How do you style components in React Native?",
    kw: ["style", "stylesheet", "camel case", "inline style", "array styles"],
    intent:
      "Checks that you know styling is done with JavaScript objects, not CSS files.",
    short:
      "You style a component with its style prop, which takes a plain JavaScript object. Names usually match CSS but are written in camel case, so backgroundColor instead of background-color. You can pass an array of styles, and the last style in the array takes precedence. As a component grows, it is cleaner to define several styles in one place with StyleSheet.create. A component can also accept a style prop and pass it on to its children.",
    detail: [
      "There is no separate CSS file and no cascade by default. Styles are applied to each component.",
      "Passing an array lets a component combine a base style with a style given by its parent.",
      "Some web behaviour differs, for example the touch area never extends past the parent view bounds.",
    ],
    ex: "A button uses styles.button, and an error variant uses [styles.button, styles.error] so the error colour wins.",
    mistakes: [
      "Writing CSS property names with hyphens.",
      "Assuming styles inherit from parent views the way they do on a web page.",
    ],
    follow: ["How do you make a style change by platform?"],
    points: [
      "style prop takes an object",
      "camelCase names",
      "Last style in an array wins",
      "StyleSheet.create groups styles",
    ],
    notes: "Styles are JS objects with camelCase keys; arrays merge, last wins.",
    code: [
      "Styles in an array",
      `const styles = StyleSheet.create({
  button: { padding: 12, backgroundColor: "steelblue" },
  error: { backgroundColor: "crimson" },
})

<Pressable style={[styles.button, hasError && styles.error]} />`,
      [
        "StyleSheet.create keeps named styles in one place.",
        "The array applies button first, then error when hasError is true.",
        "The later style overrides matching keys from the earlier one.",
      ],
      "tsx",
    ],
    src: [["React Native: Style", `${RN}/style`]],
  }),
  g({
    slug: "flexbox-differences-from-web",
    topic: "Components & styling",
    d: "medium",
    title: "How does flexbox in React Native differ from flexbox on the web?",
    kw: ["flexbox", "flexDirection", "alignContent", "flexShrink", "layout"],
    intent:
      "Checks that you know the defaults that surprise web developers.",
    short:
      "Flexbox works as in CSS with a few exceptions. The default flexDirection is column instead of row, so children stack top to bottom. alignContent defaults to flex-start instead of stretch, flexShrink defaults to 0 instead of 1, and the flex property supports only a single number. You normally combine flexDirection, alignItems and justifyContent: justifyContent aligns children along the main axis, and alignItems along the cross axis.",
    detail: [
      "With flex values 1, 2 and 3 on three siblings, the space is split 1/6, 2/6 and 3/6.",
      "flexDirection values are column, row, column-reverse and row-reverse.",
      "Layout direction is left-to-right by default, and start and end follow the layout direction.",
    ],
    ex: "To put an icon and a label side by side you set flexDirection to row on their parent View.",
    mistakes: [
      "Expecting children to sit in a row by default.",
      "Mixing up justifyContent and alignItems after changing flexDirection.",
    ],
    follow: ["What does flex: 1 do?"],
    points: [
      "Default direction is column",
      "alignContent default flex-start",
      "flexShrink default 0",
      "flex takes one number",
    ],
    notes: "Same engine as CSS flexbox, different defaults, column first.",
    src: [["React Native: Layout with Flexbox", `${RN}/flexbox`]],
  }),
  g({
    slug: "sizing-fixed-flex-percentage",
    topic: "Components & styling",
    d: "easy",
    title: "How do you set the size of a component in React Native?",
    kw: ["width", "height", "flex", "percentage", "density-independent"],
    intent:
      "Checks that you know the three sizing approaches and the zero-size parent pitfall.",
    short:
      "There are three ways. Fixed dimensions use width and height in style; they are unitless and represent density-independent pixels. Flex dimensions use flex in style, usually flex: 1, which makes the component fill the available space shared among siblings with the same parent. Percentage dimensions use percentage values for a share of the parent. Flex and percentage sizes need a parent with a defined size, otherwise the parent has size zero and the children are not visible.",
    detail: [
      "A larger flex value gives a larger share of the space compared to siblings.",
      "There is no universal mapping from points to physical units, so a fixed size can differ physically between devices.",
      "Fixed sizes suit things that should always be the same, such as an icon.",
    ],
    ex: "A screen root View uses flex: 1 so it fills the whole screen, and its two children use flex: 1 and flex: 2.",
    mistakes: [
      "Using flex: 1 inside a parent that has no size.",
      "Assuming a fixed size is the same physical size on every device.",
    ],
    follow: ["How would you read the screen size at runtime?"],
    points: [
      "Fixed, flex or percentage",
      "Units are density-independent pixels",
      "flex: 1 fills available space",
      "Parent must have a size",
    ],
    notes: "Fixed = numbers, flex = share of space, percent needs sized parent.",
    src: [["React Native: Height and Width", `${RN}/height-and-width`]],
  }),
  g({
    slug: "usewindowdimensions-vs-dimensions",
    topic: "Components & styling",
    d: "medium",
    title: "What is the difference between useWindowDimensions and Dimensions?",
    kw: ["useWindowDimensions", "Dimensions", "rotation", "window", "fontScale"],
    intent:
      "Checks that you build responsive layouts that react to rotation and window changes.",
    short:
      "Both give the window width and height, but useWindowDimensions is the preferred API for components because it updates automatically when the window size or font scale changes, which fits the React model. Dimensions.get returns the values at the time you call it. Because dimensions can change, for example with device rotation or foldable devices, rendering logic that depends on them should read them on every render instead of caching them in a StyleSheet, or listen for the change event.",
    detail: [
      "useWindowDimensions returns width, height, scale and fontScale.",
      "fontScale tells you the user's font size setting, which lets you adapt padding and heights.",
      "On Android the window dimension is reduced by the status bar, if it is not translucent, and the bottom navigation bar.",
    ],
    ex: "A grid screen reads width from useWindowDimensions and shows two columns in portrait and four in landscape.",
    mistakes: [
      "Caching Dimensions.get at the top of a file and never updating it.",
      "Ignoring rotation when designing a layout.",
    ],
    follow: ["What does fontScale represent?"],
    points: [
      "Hook updates on change",
      "Dimensions.get is a snapshot",
      "Rotation and foldables change size",
      "Read on every render",
    ],
    notes: "Prefer useWindowDimensions inside components; it re-renders on change.",
    src: [
      ["React Native: useWindowDimensions", `${RN}/usewindowdimensions`],
      ["React Native: Dimensions", `${RN}/dimensions`],
    ],
  }),
  g({
    slug: "handling-text-input",
    topic: "Components & styling",
    d: "easy",
    title: "How do you handle text input in React Native?",
    kw: ["TextInput", "onChangeText", "onSubmitEditing", "controlled input", "state"],
    intent:
      "Checks that you can read and validate what a user types.",
    short:
      "TextInput is a core component for entering text. Its onChangeText prop takes a function that is called every time the text changes, and onSubmitEditing takes a function called when the text is submitted. Because the text changes over time, you store it in state and pass it back to the input, which is the controlled component pattern from React. You can validate the text while the user types by checking the value inside the handler.",
    detail: [
      "onChangeText gives you the new string directly, not an event object.",
      "Keep the value in useState and show validation messages from that state.",
      "Pair the input with a keyboard-aware container so the keyboard does not hide it.",
    ],
    ex: "A search box stores the query in state in onChangeText and filters a list as the user types.",
    mistakes: [
      "Reading event.target.value as on the web.",
      "Not keeping the typed value in state when other parts of the screen need it.",
    ],
    follow: ["How do you stop the keyboard covering an input?"],
    points: [
      "onChangeText runs on each change",
      "onSubmitEditing runs on submit",
      "Store text in state",
      "Validate in the handler",
    ],
    notes: "TextInput + onChangeText + useState = controlled input.",
    src: [["React Native: Handling Text Input", `${RN}/handling-text-input`]],
  }),
  g({
    slug: "button-pressable-touchables",
    topic: "Components & styling",
    d: "easy",
    title: "How do you handle taps: Button, Pressable and the Touchable components?",
    kw: ["Button", "Pressable", "TouchableOpacity", "onPress", "touch"],
    intent: "Checks that you pick the right component for touch handling.",
    short:
      "Button is the basic component that renders nicely on all platforms and calls onPress when tapped, but its look is limited. If it does not fit your design, you can build your own button with the Touchable components. The Touchable components, such as TouchableOpacity and TouchableHighlight, give feedback but have no default styling. Pressable is a core component wrapper that detects the stages of a press on any children, so you can make any child respond to presses.",
    detail: [
      "TouchableOpacity lowers the opacity while pressed, and TouchableHighlight darkens the background.",
      "TouchableNativeFeedback shows the ripple on Android.",
      "Any of them accepts onLongPress for press-and-hold.",
    ],
    ex: "A card list item is wrapped in Pressable with onPress that opens the detail screen.",
    mistakes: [
      "Using a Text with no touch handler and expecting taps to work.",
      "Expecting the Touchable components to come with button styling.",
    ],
    follow: ["What events does Pressable fire?"],
    points: [
      "Button is basic and fixed in look",
      "Touchables add feedback only",
      "Pressable wraps any children",
      "onLongPress handles press-and-hold",
    ],
    notes: "Button for simple; Pressable for custom touch targets.",
    src: [
      ["React Native: Handling Touches", `${RN}/handling-touches`],
      ["React Native: Pressable", `${RN}/pressable`],
    ],
  }),
  g({
    slug: "pressable-press-lifecycle",
    topic: "Components & styling",
    d: "medium",
    title: "What events does Pressable fire, and what are hitSlop and the long-press delay?",
    kw: ["Pressable", "onPressIn", "onPressOut", "onLongPress", "hitSlop"],
    intent:
      "Checks that you understand the order of press events and how to make small targets easier to hit.",
    short:
      "When a press is activated, onPressIn is called. If the person lifts their finger, onPressOut is called, followed by onPress. If they hold longer than 500 milliseconds, onLongPress is called, and onPressOut still fires on release. The 500 ms default can be changed with delayLongPress. The hitSlop prop sets extra distance outside the element in which a press can be detected, which helps with small targets. Touches never extend past the parent view bounds.",
    detail: [
      "pressRetentionOffset sets how far a finger may move away from the element and still count as a press.",
      "The disabled prop turns the press behaviour off.",
      "On Android, android_ripple enables the ripple effect.",
    ],
    ex: "A small close icon gets hitSlop of 12 points on each side so the tap area is easier to reach.",
    mistakes: [
      "Expecting hitSlop to extend outside the parent view.",
      "Assuming onPress fires before onPressIn.",
    ],
    follow: ["How would you show a pressed state?"],
    points: [
      "onPressIn, then onPressOut, then onPress",
      "Long press after 500 ms by default",
      "hitSlop enlarges the touch area",
      "Parent bounds still limit touches",
    ],
    notes: "In -> Out -> Press; hold 500 ms -> LongPress; hitSlop widens target.",
    src: [["React Native: Pressable", `${RN}/pressable`]],
  }),
  g({
    slug: "platform-specific-code",
    topic: "Native APIs",
    d: "easy",
    title: "How do you write platform-specific code in React Native?",
    kw: ["Platform", "Platform.OS", "Platform.select", "android", "ios"],
    intent:
      "Checks that you know how to handle differences between Android and iOS.",
    short:
      "Use the Platform module. Platform.OS returns 'android' or 'ios', so you can branch on it. Platform.select takes an object with the keys android, ios, native and default and returns the most fitting value for the platform you are running on. On a phone the android and ios keys take preference, then native, then default. It is commonly used inside StyleSheet.create to give different values per platform. Platform.Version returns the OS version.",
    detail: [
      "Platform.select can return any value, not only styles, for example a component.",
      "The default key covers other platforms, such as web.",
      "Platform.isPad and Platform.isTV are further checks for iOS and TV devices.",
    ],
    ex: "A shadow is set with ios shadow properties on iOS and elevation on Android through Platform.select.",
    mistakes: [
      "Branching on platform for things that already behave the same.",
      "Forgetting the default key when the app also runs on another platform.",
    ],
    follow: ["How do you test on both platforms?"],
    points: [
      "Platform.OS gives the system",
      "Platform.select picks a value",
      "Order: android or ios, native, default",
      "Platform.Version gives the OS version",
    ],
    notes: "Platform.OS to branch; Platform.select to choose a value.",
    code: [
      "Platform.select in styles",
      `const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: { backgroundColor: "green" },
      ios: { backgroundColor: "red" },
      default: { backgroundColor: "blue" },
    }),
  },
})`,
      [
        "flex: 1 applies on every platform.",
        "Platform.select returns the object for the running platform.",
        "The spread merges that object into the style.",
      ],
      "tsx",
    ],
    src: [["React Native: Platform", `${RN}/platform`]],
  }),
  g({
    slug: "keyboardavoidingview",
    topic: "Native APIs",
    d: "easy",
    title: "How do you stop the on-screen keyboard from covering inputs?",
    kw: ["KeyboardAvoidingView", "keyboard", "behavior", "padding", "keyboardVerticalOffset"],
    intent:
      "Checks that you handle a common form problem on mobile.",
    short:
      "Wrap the form in KeyboardAvoidingView. It automatically adjusts its height, position or bottom padding based on the keyboard height so its content stays visible while the virtual keyboard is displayed. The behavior prop selects how: height, position or padding. The documentation notes Android and iOS react differently to this prop and recommends setting it on both. keyboardVerticalOffset sets the distance between the top of the screen and the view, which may be non-zero when a header is above it.",
    detail: [
      "enabled can turn the behaviour on or off.",
      "With behavior set to position, contentContainerStyle styles the content container.",
      "keyboardVerticalOffset defaults to 0.",
    ],
    ex: "A sign-in screen wraps its fields in KeyboardAvoidingView so the password field stays above the keyboard.",
    mistakes: [
      "Leaving behavior unset and testing on only one platform.",
      "Forgetting the header height in keyboardVerticalOffset.",
    ],
    follow: ["What if the form is longer than the screen?"],
    points: [
      "Adjusts for keyboard height",
      "behavior: height, position or padding",
      "Set behavior on both platforms",
      "keyboardVerticalOffset for headers",
    ],
    notes: "KeyboardAvoidingView + behavior keeps inputs visible.",
    src: [["React Native: KeyboardAvoidingView", `${RN}/keyboardavoidingview`]],
  }),
  g({
    slug: "safeareaview-deprecated",
    topic: "Native APIs",
    d: "medium",
    title: "What is the safe area, and is SafeAreaView still recommended?",
    kw: ["safe area", "SafeAreaView", "notch", "react-native-safe-area-context", "padding"],
    intent:
      "Checks that you know about device cut-outs and that you read the current documentation.",
    short:
      "The safe area is the part of the screen not covered by navigation bars, tab bars, toolbars, rounded corners or camera notches. The built-in SafeAreaView renders content inside it by applying padding, but the documentation marks it as deprecated and says to use react-native-safe-area-context instead. The built-in version only applies to iOS 11 and later. Because it uses padding, padding set in styles on a SafeAreaView is ignored, which can give different results on each platform.",
    detail: [
      "To use it, you wrap the top level view and give it flex: 1.",
      "Match its background colour to the app design so the edges look continuous.",
      "React Navigation also lists react-native-safe-area-context as a peer dependency.",
    ],
    ex: "A screen uses the safe-area library's insets so a bottom button is not hidden behind the home indicator.",
    mistakes: [
      "Relying on the deprecated component in a new project.",
      "Setting padding on SafeAreaView and expecting it to apply.",
    ],
    follow: ["Where else does React Navigation use safe-area information?"],
    points: [
      "Safe area avoids notches and bars",
      "Built-in SafeAreaView is deprecated",
      "Use react-native-safe-area-context",
      "It applies padding itself",
    ],
    notes: "Prefer react-native-safe-area-context; built-in SafeAreaView is deprecated.",
    src: [
      ["React Native: SafeAreaView", `${RN}/safeareaview`],
      ["React Native: Navigating Between Screens", `${RN}/navigation`],
    ],
  }),
  g({
    slug: "modal-component-back-button",
    topic: "Native APIs",
    d: "medium",
    title: "How does the Modal component work, and why is onRequestClose important?",
    kw: ["Modal", "onRequestClose", "animationType", "transparent", "back button"],
    intent:
      "Checks that you handle the Android back button when showing overlays.",
    short:
      "Modal presents content above the enclosing view. animationType controls how it appears: slide, fade or none, with none the default. The transparent prop controls whether the modal fills the view with a background. The onRequestClose callback is called when the user taps the hardware back button on Android, and it is required there. The documentation warns that BackHandler events will not be emitted while the modal is open, so onRequestClose is where you close it.",
    detail: [
      "On iOS onRequestClose is called when the modal is dismissed by a drag gesture with a pageSheet or formSheet presentation style.",
      "onShow runs once the modal is shown.",
      "statusBarTranslucent lets an Android modal go under the status bar.",
    ],
    ex: "A confirm-delete dialog is a Modal whose onRequestClose sets its visible state to false.",
    mistakes: [
      "Omitting onRequestClose so the back button seems to do nothing.",
      "Expecting BackHandler listeners to fire while the modal is open.",
    ],
    follow: ["What other overlay options exist?"],
    points: [
      "Shows content above the screen",
      "animationType: slide, fade, none",
      "onRequestClose for the back button",
      "BackHandler is blocked while open",
    ],
    notes: "Modal needs onRequestClose to handle Android back.",
    src: [["React Native: Modal", `${RN}/modal`]],
  }),
  g({
    slug: "appstate-foreground-background",
    topic: "Native APIs",
    d: "medium",
    title: "How can an app know whether it is in the foreground or background?",
    kw: ["AppState", "active", "background", "inactive", "change event"],
    intent:
      "Checks that you know the app lifecycle states and how to react to them.",
    short:
      "Use the AppState module. AppState.currentState holds the current state, and you can subscribe to the change event with addEventListener to be notified when it changes. The states are active, meaning the app is running in the foreground; background, meaning the user is in another app or on the home screen; and, on iOS, inactive, which occurs while transitioning between foreground and background or during periods such as entering the multitasking view or an incoming call.",
    detail: [
      "addEventListener returns a subscription which you should remove in the effect cleanup.",
      "On Android, focus and blur events fire when the app gains or loses focus, for example when the notification drawer is pulled down.",
      "On iOS a memoryWarning event fires when the system sends a memory warning.",
    ],
    ex: "A chat app refreshes messages when the state changes from background to active.",
    mistakes: [
      "Forgetting to remove the listener when the component unmounts.",
      "Assuming the inactive state exists on Android.",
    ],
    follow: ["How would you pause a timer when the app is backgrounded?"],
    points: [
      "active, background and inactive",
      "currentState and change event",
      "inactive is iOS",
      "Clean up the subscription",
    ],
    notes: "AppState.addEventListener('change') reports foreground/background.",
    src: [["React Native: AppState", `${RN}/appstate`]],
  }),
  g({
    slug: "android-runtime-permissions",
    topic: "Native APIs",
    d: "medium",
    title: "How do Android permissions work in a React Native app?",
    kw: ["PermissionsAndroid", "dangerous permissions", "manifest", "rationale", "camera"],
    intent:
      "Checks that you separate permissions granted at install time from those that need a prompt.",
    short:
      "Android has normal and dangerous permissions. Normal permissions are granted when the app is installed as long as they are listed in AndroidManifest.xml. Dangerous permissions, such as camera, location or contacts, require a prompt to the user at runtime, and you use the PermissionsAndroid module for them. If the user previously turned a permission off, the system may advise showing a rationale, which you can pass as an optional argument. On devices before SDK 23 permissions listed in the manifest are granted automatically.",
    detail: [
      "PermissionsAndroid exposes constants such as PERMISSIONS.CAMERA and PERMISSIONS.ACCESS_FINE_LOCATION.",
      "Both the check and request methods work with those constants.",
      "The page notes this applies to projects with native code; Expo managed projects have their own permissions guide.",
    ],
    ex: "Before opening the camera screen the app requests the camera permission and shows an explanation if the user refused earlier.",
    mistakes: [
      "Listing a dangerous permission in the manifest and never prompting.",
      "Not handling the case where the user denies the request.",
    ],
    follow: ["How does this differ in an Expo managed project?"],
    points: [
      "Normal permissions: manifest only",
      "Dangerous permissions: runtime prompt",
      "PermissionsAndroid module",
      "Optional rationale dialog",
    ],
    notes: "Manifest for normal permissions; runtime request for dangerous ones.",
    src: [["React Native: PermissionsAndroid", `${RN}/permissionsandroid`]],
  }),
  g({
    slug: "debugging-react-native",
    topic: "Native APIs",
    d: "easy",
    title: "How do you debug a React Native app?",
    kw: ["dev menu", "react native devtools", "logbox", "console", "perf monitor"],
    intent:
      "Checks that you know the built-in debugging tools and their limits.",
    short:
      "Open the Dev Menu by shaking the device, or with Ctrl+M or Cmd+M on Android emulators and Ctrl+Cmd+Z on the iOS Simulator. From there you can open React Native DevTools, the built-in debugger, which gives you a console, the React Components inspector and the Profiler. You can also press j in the CLI. LogBox shows warnings and errors on screen. The Dev Menu, LogBox and DevTools are disabled in release builds.",
    detail: [
      "Console errors show as red badges and warnings as yellow ones.",
      "LogBox.ignoreLogs can hide noisy warnings you cannot fix, and ignoreAllLogs is useful for demos.",
      "The in-app Perf Monitor is a guide; for accurate measurements the documentation recommends native tooling such as Android Studio and Xcode.",
    ],
    ex: "A crash after navigating is investigated by opening DevTools and reading the console output and the component tree.",
    mistakes: [
      "Expecting the Dev Menu in a production build.",
      "Hiding all logs and missing a real error.",
    ],
    follow: ["Why should you measure performance in a release build?"],
    points: [
      "Dev Menu opens debugging tools",
      "React Native DevTools is built in",
      "LogBox shows warnings and errors",
      "Disabled in release builds",
    ],
    notes: "Dev Menu -> DevTools (console, components, profiler); not in release.",
    src: [["React Native: Debugging Basics", `${RN}/debugging`]],
  }),
  g({
    slug: "navigating-between-screens",
    topic: "React Navigation",
    d: "easy",
    title: "How do you navigate between screens in React Native?",
    kw: ["navigation", "react navigation", "navigator", "stack", "useNavigation"],
    intent:
      "Checks that you know React Native has no built-in router and what the common solution is.",
    short:
      "Mobile apps are rarely a single screen, and moving between screens is handled by a navigator. The documentation says that if you are getting started with navigation you will probably want React Navigation, a community library that supports stack and tabbed navigation on Android and iOS. You define a navigator with its screens, then navigate from a screen using the navigation object from the useNavigation hook, for example navigation.navigate('Details'), or with Link and Button components that take a screen prop.",
    detail: [
      "Navigators handle transitions between screens and provide UI such as the header and the tab bar.",
      "Each screen definition needs a screen property, which is a component or another navigator.",
      "react-native-navigation is another library that provides native navigation on both platforms.",
    ],
    ex: "A Home screen calls navigation.navigate('Profile') from a button to open the Profile screen.",
    mistakes: [
      "Looking for a built-in router in the core library.",
      "Not installing the peer dependencies the library needs.",
    ],
    follow: ["How do you pass data to the next screen?"],
    points: [
      "Navigator manages screens",
      "React Navigation is the common library",
      "useNavigation gives the navigation object",
      "Screens defined with names",
    ],
    notes: "Use a navigator (React Navigation) and navigation.navigate(name).",
    src: [
      ["React Native: Navigating Between Screens", `${RN}/navigation`],
      ["React Navigation: Moving between screens", `${NAV}/navigating/`],
    ],
  }),
  g({
    slug: "passing-route-params",
    topic: "React Navigation",
    d: "easy",
    title: "How do you pass data between screens with React Navigation?",
    kw: ["route params", "navigate", "route.params", "initialParams", "setParams"],
    intent:
      "Checks that you pass identifiers through navigation instead of copying large objects.",
    short:
      "Pass params as the second argument to a navigation method, such as navigation.navigate('Details', { itemId: 86 }), then read them from route.params in the destination screen. The documentation recommends params be JSON-serialisable so that state persistence works and screens have the right contract for deep linking. You can set default values with initialParams, which are shallow merged with the params you pass, and a screen can change its own params with navigation.setParams.",
    detail: [
      "navigation.push('Details', {...}) adds another copy of the same route on the stack.",
      "Params should contain the minimal information needed to show a screen, such as an id, or screen-specific state such as a sort order or filter.",
      "Some param names are reserved by React Navigation.",
    ],
    ex: "A list screen navigates to a product screen with { productId }, and the product screen fetches the details for that id.",
    mistakes: [
      "Passing whole objects as params when an id would identify the screen.",
      "Expecting params to exist when the screen is opened by a link without them.",
    ],
    follow: ["How do deep links relate to params?"],
    points: [
      "Second argument carries params",
      "Read with route.params",
      "Keep params JSON-serialisable",
      "initialParams for defaults",
    ],
    notes: "navigate(name, params) in; route.params out.",
    src: [["React Navigation: Passing parameters to routes", `${NAV}/params/`]],
  }),
  g({
    slug: "native-stack-vs-stack",
    topic: "React Navigation",
    d: "medium",
    title: "What is the difference between the native stack and the JavaScript stack navigator?",
    kw: ["native stack", "stack navigator", "UINavigationController", "Fragment", "transitions"],
    intent:
      "Checks that you can explain a performance and flexibility trade-off.",
    short:
      "The Native Stack navigator uses the native APIs, UINavigationController on iOS and Fragment on Android, so animations and gestures are handled by the platform. The documentation says this gives smoother transitions and better performance than the JavaScript-based Stack navigator, plus native features such as large titles. The trade-off is that because it relies on native components it may not support customisations the underlying platforms do not support. The performance guide adds that native transitions are not interrupted by dropped JavaScript frames.",
    detail: [
      "It is installed from @react-navigation/native-stack.",
      "The JavaScript stack navigator offers more freedom to customise.",
      "A tab navigator can contain a stack navigator in each tab.",
    ],
    ex: "An app uses the native stack for its main flow so screen transitions stay smooth while data loads.",
    mistakes: [
      "Choosing the JavaScript stack without a customisation need.",
      "Assuming every visual customisation is possible with the native stack.",
    ],
    follow: ["What happens to transitions when the JavaScript thread is busy?"],
    points: [
      "Native stack uses platform APIs",
      "Animations run on the native side",
      "Better performance by default",
      "Less customisation freedom",
    ],
    notes: "Native stack = smoother, platform-driven; JS stack = more customisable.",
    src: [
      ["React Navigation: Native Stack Navigator", `${NAV}/native-stack-navigator/`],
      ["React Native: Performance Overview", `${RN}/performance`],
    ],
  }),
  g({
    slug: "screens-stay-mounted-focus-events",
    topic: "React Navigation",
    d: "medium",
    title: "What happens to a screen when you navigate away, and how do you run code on focus?",
    kw: ["lifecycle", "focus", "blur", "useFocusEffect", "mounted"],
    intent:
      "Checks that you do not expect web-style unmounting and that you can refresh data when a screen returns.",
    short:
      "React Navigation does not unmount a screen when you navigate away. When you go from Home to Profile, Profile mounts and Home stays mounted; going back unmounts Profile and shows the existing Home instance. So a useEffect that fetches data runs once and not again on return. To react to a screen gaining or losing focus, listen to the focus and blur events, or use useFocusEffect, which behaves like useEffect but runs only while the screen is focused. Wrap its callback in useCallback.",
    detail: [
      "The cleanup of useFocusEffect runs when dependencies change and when the screen unmounts or blurs.",
      "For async work, cancel the request or ignore the result in cleanup to avoid race conditions.",
      "InteractionManager can defer expensive work until a transition finishes.",
    ],
    ex: "A Notifications tab refetches its list with useFocusEffect every time the user switches back to it.",
    mistakes: [
      "Expecting componentDidMount style code to rerun when returning.",
      "Passing an unwrapped function to useFocusEffect so it runs every render.",
    ],
    follow: ["How would you cancel a request when leaving a screen?"],
    points: [
      "Previous screens stay mounted",
      "focus and blur events exist",
      "useFocusEffect runs while focused",
      "Wrap callback in useCallback",
    ],
    notes: "Screens are kept mounted; use focus events or useFocusEffect to refresh.",
    src: [
      ["React Navigation: Navigation lifecycle", `${NAV}/navigation-lifecycle/`],
      ["React Navigation: useFocusEffect", `${NAV}/use-focus-effect/`],
    ],
  }),
  g({
    slug: "bottom-tabs-and-nesting",
    topic: "React Navigation",
    d: "medium",
    title: "How do bottom tabs work, and what happens when you nest a stack in each tab?",
    kw: ["bottom tabs", "tab navigator", "nested navigators", "lazy", "state preserved"],
    intent:
      "Checks that you can structure a typical app with tabs and stacks.",
    short:
      "The bottom tab navigator shows a tab bar at the bottom of the screen that lets you switch between routes. Its routes are lazily initialised, so a screen component is not mounted until it is first focused. A common structure is a tab navigator where each tab is its own stack navigator. In that case the navigation state of each stack is preserved when you switch tabs: go to a detail screen in one tab, switch away and back, and you see that detail screen again.",
    detail: [
      "It is installed from @react-navigation/bottom-tabs.",
      "In the documentation's example, headerShown is set to false on the tab navigator because each tab has a stack with its own header.",
      "A drawer navigator is the alternative for a side menu.",
    ],
    ex: "A shop app has Home and Settings tabs, each with its own stack, so a user's place in each tab is kept.",
    mistakes: [
      "Assuming that switching tabs resets each tab to its first screen.",
      "Assuming all tab screens mount at start.",
    ],
    follow: ["How would you add a side drawer?"],
    points: [
      "Tab bar switches routes",
      "Tab screens are lazy",
      "Each tab can hold a stack",
      "Stack state is preserved",
    ],
    notes: "Tabs are lazy; a stack per tab keeps each tab's position.",
    src: [
      ["React Navigation: Bottom Tabs Navigator", `${NAV}/bottom-tab-navigator/`],
      ["React Navigation: Navigation lifecycle", `${NAV}/navigation-lifecycle/`],
    ],
  }),
  g({
    slug: "authentication-flow-navigation",
    topic: "Mobile authentication",
    d: "medium",
    title: "How do you build a sign-in flow with React Navigation?",
    kw: ["authentication flow", "conditional screens", "sign in", "SecureStore", "back button"],
    intent:
      "Checks that you swap whole screen sets by auth state instead of redirecting manually.",
    short:
      "Load the authentication state from encrypted persistent storage when the app opens. When it has loaded, show the authentication screens or the main app depending on whether valid state exists. With React Navigation you define screens conditionally: in the static API a screen has an if property that takes a hook returning true or false, and in the dynamic API you render different Screen elements based on state. When the user signs in, the sign-in screens are removed and the home screen appears, so the back button cannot return to sign-in.",
    detail: [
      "The user signing out clears the auth state, which sends them back to the authentication screens.",
      "The order of screens matters when several match the condition: the first is shown.",
      "There is usually more than one auth screen, such as sign in, sign up and forgot password.",
    ],
    ex: "The app shows a splash screen while it restores the saved session, then shows either SignIn or Home.",
    mistakes: [
      "Navigating to Home manually and leaving the sign-in screen in the back stack.",
      "Flashing the sign-in screen before saved state has loaded.",
    ],
    follow: ["Where should the token be stored?"],
    points: [
      "Restore auth state at start",
      "Show screens by condition",
      "Auth screens unmount after sign-in",
      "Back button cannot return",
    ],
    notes: "Conditional screens by auth state; no manual redirects needed.",
    src: [["React Navigation: Authentication flows", `${NAV}/auth-flow/`]],
  }),
  g({
    slug: "secure-token-storage",
    topic: "Mobile authentication",
    d: "medium",
    title: "Where should a mobile app store an access token: AsyncStorage or secure storage?",
    kw: ["AsyncStorage", "Keychain", "Keystore", "secure storage", "token"],
    intent:
      "Checks that you match storage to sensitivity and know the platform options.",
    short:
      "Async Storage is a community-maintained, asynchronous, unencrypted key-value store, similar to localStorage on the web. The security guide says to use it for non-sensitive data such as persisting Redux state, and not for tokens or secrets. For sensitive data, React Native does not bundle a solution, but each platform has one: iOS Keychain Services, and on Android Encrypted Shared Preferences or the Keystore system. Libraries that wrap them include expo-secure-store and react-native-keychain.",
    detail: [
      "Persisted data is written to disk, so an attacker could reach it, while unpersisted data never touches the disk.",
      "Each app has its own sandbox, so Async Storage is not shared between apps.",
      "Do not accidentally persist sensitive form data inside a persisted Redux tree.",
    ],
    ex: "The refresh token goes into the Keychain through expo-secure-store, while the theme preference goes into Async Storage.",
    mistakes: [
      "Saving the access token in Async Storage.",
      "Sending user tokens to a monitoring service by accident.",
    ],
    follow: ["Why should API keys not be in the app code?"],
    points: [
      "Async Storage is unencrypted",
      "Not for tokens or secrets",
      "Keychain on iOS",
      "Keystore or encrypted preferences on Android",
    ],
    notes: "Tokens in Keychain/Keystore-backed storage, not Async Storage.",
    src: [["React Native: Security", `${RN}/security`]],
  }),
  g({
    slug: "api-keys-in-app-bundle",
    topic: "Mobile authentication",
    d: "medium",
    title: "Why must you never put secret API keys in a React Native app, and what do you do instead?",
    kw: ["api key", "secret", "app bundle", "environment variables", "orchestration layer"],
    intent:
      "Checks that you understand client code is readable by anyone.",
    short:
      "Never store sensitive API keys in your app code. Anything included in the code can be read in plain text by anyone inspecting the app bundle. Tools such as react-native-dotenv and react-native-config add environment-specific values like API endpoints, but they should not be confused with server-side environment variables that can hold secrets. If the app needs a key to reach some resource, the most secure approach is an orchestration layer between app and resource, for example a serverless function that forwards the request with the key.",
    detail: [
      "Secrets in server-side code cannot be read by API consumers the way secrets in app code can.",
      "Environment configuration in the app is fine for non-secret values like a base URL.",
      "Your API should use https so data is not readable in transit.",
    ],
    ex: "The app calls your own backend function, and only that function holds the third-party service key.",
    mistakes: [
      "Treating a .env file bundled in the app as private.",
      "Calling a paid third-party API directly from the app with a secret key.",
    ],
    follow: ["How does SSL pinning relate to network security?"],
    points: [
      "App bundles can be inspected",
      "No secrets in app code",
      "Use a server-side layer",
      "Config is not secret storage",
    ],
    notes: "Secrets live on a server; the app only calls your own endpoint.",
    src: [["React Native: Security", `${RN}/security`]],
  }),
  g({
    slug: "deep-links-are-not-secure",
    topic: "Mobile authentication",
    d: "hard",
    title: "What is a deep link, and why should you not send sensitive data in one?",
    kw: ["deep linking", "url scheme", "universal links", "PKCE", "oauth"],
    intent:
      "Checks awareness of a security issue that is specific to mobile.",
    short:
      "A deep link sends data directly to a native app from an outside source, for example app://products/1 where app is your URL scheme. The security guide says deep links are not secure and you should never send sensitive information, such as tokens, in them, because there is no central registry of URL schemes, so a malicious app could register the same scheme and receive the data. Universal links allow secure linking to app content on iOS. For OAuth2 redirects the guide adds PKCE, which verifies the token exchange comes from the same client.",
    detail: [
      "On Android, when several apps can open a link the user sees a disambiguation dialog; on iOS the system chooses.",
      "Standard https links can open the app when configured, which works better when a link is opened on a desktop too.",
      "React Navigation integrates with the Linking module through its linking prop.",
    ],
    ex: "A product link opens the product screen with only an id, and the sign-in uses an OAuth flow with PKCE.",
    mistakes: [
      "Putting a session token in a custom scheme URL.",
      "Handling deep links by hand when the linking prop would do it.",
    ],
    follow: ["How does React Navigation handle incoming links?"],
    points: [
      "Deep links send data to the app",
      "Custom schemes are not unique",
      "Never put secrets in them",
      "PKCE protects OAuth redirects",
    ],
    notes: "Any app can claim a custom scheme, so links carry ids, never secrets.",
    src: [
      ["React Native: Security", `${RN}/security`],
      ["React Navigation: Deep linking", `${NAV}/deep-linking/`],
    ],
  }),
  g({
    slug: "fetch-data-in-react-native",
    topic: "Mobile API integration",
    d: "easy",
    title: "How do you call a REST API from a React Native app?",
    kw: ["fetch", "networking", "async await", "json", "error handling"],
    intent:
      "Checks that you can make a request and handle failure, not just the happy path.",
    short:
      "React Native provides the Fetch API, which returns a Promise. You pass the URL and, for other methods, an options object with method, headers and a JSON string body. Use async and await or then, convert the response with response.json(), and catch errors, because the documentation warns that errors thrown by fetch are dropped silently if you do not catch them. XMLHttpRequest is also built in, so libraries such as axios that depend on it work. Remember to set the Content-Type header when you send JSON.",
    detail: [
      "WebSockets are supported for full-duplex communication.",
      "Keep loading and error state next to the data so the UI can show spinners and messages.",
      "A fetch call that gets a 404 or 500 still resolves, so check the response status yourself.",
    ],
    ex: "A screen calls fetch inside an effect, shows an ActivityIndicator while waiting, then renders the list or an error message.",
    mistakes: [
      "Not catching errors from the request.",
      "Treating any resolved fetch as success without checking the status.",
    ],
    follow: ["Why can a plain http URL fail on a device?"],
    points: [
      "Fetch returns a Promise",
      "POST needs method, headers and body",
      "Catch errors",
      "XMLHttpRequest and axios also work",
    ],
    notes: "fetch + await response.json() + try/catch; check status yourself.",
    code: [
      "POST request with fetch",
      `const createOrder = async () => {
  try {
    const response = await fetch("https://api.example.com/orders", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ item: "book" }),
    })
    if (!response.ok) throw new Error("Request failed")
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}`,
      [
        "The options object sets the method, headers and JSON body.",
        "response.ok is checked because fetch resolves on HTTP errors.",
        "The catch block prevents the error from being dropped silently.",
      ],
      "tsx",
    ],
    src: [
      ["React Native: Networking", `${RN}/network`],
      [
        "MDN: Using the Fetch API",
        "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
      ],
    ],
  }),
  g({
    slug: "cleartext-http-blocked",
    topic: "Mobile API integration",
    d: "medium",
    title: "Why does an http request fail on a phone but work in a browser, and how do you fix it?",
    kw: ["cleartext", "App Transport Security", "usesCleartextTraffic", "https", "CORS"],
    intent:
      "Checks that you know the platform defaults for insecure traffic and the difference from web.",
    short:
      "By default, iOS enforces App Transport Security, which requires HTTP connections to use HTTPS, and on Android from API level 28 clear text traffic is blocked by default too. The right fix is to serve your API over HTTPS. If you must use a cleartext URL, configure an exception: on iOS in Info.plist with NSAppTransportSecurity, preferably for specific domains with NSExceptionDomains instead of disabling it globally, and on Android with android:usesCleartextTraffic in the manifest. There is also no CORS in native apps.",
    detail: [
      "The documentation notes that Apple's App Store review requires justification for disabling ATS.",
      "Because there is no CORS concept in native apps, the security model of XMLHttpRequest differs from the web.",
      "Prefer exceptions for specific domains and avoid disabling the protection globally.",
    ],
    ex: "A developer points the app at a local http server and adds a cleartext exception for that debug build only.",
    mistakes: [
      "Disabling ATS for the whole app to fix one endpoint.",
      "Looking for CORS settings to fix a native request.",
    ],
    follow: ["Why should production APIs always use https?"],
    points: [
      "iOS ATS requires HTTPS",
      "Android blocks cleartext from API 28",
      "Prefer HTTPS to exceptions",
      "No CORS in native apps",
    ],
    notes: "Use HTTPS; exceptions are per domain and for development only.",
    src: [["React Native: Networking", `${RN}/network`]],
  }),
  g({
    slug: "scrollview-vs-flatlist",
    topic: "Lists & performance",
    d: "easy",
    title: "When should you use FlatList instead of ScrollView?",
    kw: ["FlatList", "ScrollView", "lazy rendering", "memory", "long list"],
    intent:
      "Checks that you pick the right list component for the amount of data.",
    short:
      "ScrollView renders all its child components at once. That is fine for a short, fixed amount of content, but for a long list, creating JavaScript components and native views for everything, much of it not shown, causes slow rendering and more memory use. FlatList renders items lazily, when they are about to appear, and removes items that scroll far off screen to save memory and processing. It also provides separators, multiple columns and infinite scroll loading. A ScrollView must also have a bounded height to work.",
    detail: [
      "Forgetting to pass flex: 1 down the view stack is a common cause of a ScrollView not scrolling.",
      "Use SectionList when you need grouped sections.",
      "FlatList is a convenience wrapper around VirtualizedList.",
    ],
    ex: "A settings page with eight rows uses ScrollView; a feed with hundreds of posts uses FlatList.",
    mistakes: [
      "Rendering a long array with map inside a ScrollView.",
      "Putting a FlatList inside a ScrollView that scrolls the same direction.",
    ],
    follow: ["What props does FlatList need at minimum?"],
    points: [
      "ScrollView renders everything",
      "FlatList renders lazily",
      "Lazy rendering saves memory",
      "ScrollView needs bounded height",
    ],
    notes: "Short fixed content = ScrollView; long data = FlatList.",
    src: [
      ["React Native: ScrollView", `${RN}/scrollview`],
      ["React Native: FlatList", `${RN}/flatlist`],
    ],
  }),
  g({
    slug: "flatlist-essential-props",
    topic: "Lists & performance",
    d: "medium",
    title: "Which FlatList props matter, and why does a list sometimes not update?",
    kw: ["FlatList", "renderItem", "keyExtractor", "extraData", "PureComponent"],
    intent:
      "Checks that you understand how FlatList decides to re-render.",
    short:
      "FlatList needs data, an array of items, and renderItem, which takes an item and renders it. By default it uses a key prop on each item as the React key; keyExtractor lets you provide your own, such as the item id. FlatList is a PureComponent, so it does not re-render if its props stay shallow-equal. If renderItem depends on something outside data, for example the selected id, pass it as extraData so the list knows to update. The numColumns prop renders multiple columns.",
    detail: [
      "Internal state of items is not preserved when they scroll out of the render window, so keep data in the item or an external store.",
      "Content renders asynchronously off-screen, so you can scroll faster than rendering and briefly see blank space.",
      "Use numColumns rather than a flexWrap layout for columns.",
    ],
    ex: "A selectable list passes extraData={selectedId} so the highlighted row updates when the selection changes.",
    mistakes: [
      "Relying on array index as the key.",
      "Changing outside state and wondering why rows do not re-render.",
    ],
    follow: ["How can you reduce re-renders of each row?"],
    points: [
      "data and renderItem are required",
      "keyExtractor sets the key",
      "extraData triggers updates",
      "FlatList is a PureComponent",
    ],
    notes: "keyExtractor for stable keys; extraData for outside dependencies.",
    src: [["React Native: FlatList", `${RN}/flatlist`]],
  }),
  g({
    slug: "optimizing-flatlist",
    topic: "Lists & performance",
    d: "hard",
    title: "How would you optimise a slow FlatList?",
    kw: ["getItemLayout", "windowSize", "initialNumToRender", "memo", "removeClippedSubviews"],
    intent:
      "Checks that you know the tuning props and their trade-offs, not just one trick.",
    short:
      "Start with the items: use basic, light components with little logic and nesting, avoid heavy images by using thumbnails, and wrap rows in React.memo so they re-render only when their props change. Then tune the list: implement getItemLayout so the list can skip measuring items, and adjust initialNumToRender, windowSize, maxToRenderPerBatch and removeClippedSubviews. Each has a trade-off, for example a bigger windowSize means fewer blank areas but more memory, and a bigger batch means less blank space but longer JavaScript work that can hurt responsiveness.",
    detail: [
      "windowSize defaults to 21, which is ten viewports above, ten below and one in between.",
      "removeClippedSubviews can cause missing content, mainly observed on iOS, and does not save much memory.",
      "Third-party list libraries such as FlashList are mentioned as alternatives in the performance guide.",
    ],
    ex: "A feed memoises its row component and sets initialNumToRender to cover the first screen.",
    mistakes: [
      "Changing many props at once without measuring.",
      "Making rows heavy with images and effects.",
    ],
    follow: ["Why can blank areas appear while scrolling fast?"],
    points: [
      "Light memoised row components",
      "getItemLayout skips measuring",
      "Tune window and batch props",
      "Every setting is a trade-off",
    ],
    notes: "Memoise rows, give fixed layouts, tune window props and measure.",
    src: [
      [
        "React Native: Optimizing FlatList Configuration",
        `${RN}/optimizing-flatlist-configuration`,
      ],
      ["React Native: Performance Overview", `${RN}/performance`],
    ],
  }),
  g({
    slug: "js-thread-vs-ui-thread",
    topic: "Lists & performance",
    d: "hard",
    title: "What are the JavaScript thread and the UI thread, and what is a dropped frame?",
    kw: ["js thread", "ui thread", "frames", "16.67ms", "dropped frame"],
    intent:
      "Checks that you understand why a busy JavaScript thread makes an app feel slow.",
    short:
      "Devices display at least 60 frames per second, which gives the UI at most 16.67 ms to produce each frame. If the work cannot be done in time, a frame is dropped and the UI looks unresponsive. React Native has two frame rates. The JavaScript thread runs your React code, API calls and touch handling, and if it is busy for a frame that is a dropped frame. The UI or main thread draws native views, so a ScrollView and native stack transitions keep moving even when the JavaScript thread is locked up.",
    detail: [
      "The guide gives the example that re-rendering an expensive subtree could take 200 ms and drop about 12 frames.",
      "Animations driven by JavaScript appear to freeze while the JavaScript thread is busy.",
      "The Perf Monitor in the Dev Menu shows both frame rates.",
    ],
    ex: "A button press triggers a heavy state update, so the pressed effect appears late because the JavaScript thread is busy.",
    mistakes: [
      "Doing heavy computation inside a press handler.",
      "Judging performance only from the JS frame rate.",
    ],
    follow: ["How can you move animation work off the JavaScript thread?"],
    points: [
      "About 16.67 ms per frame at 60 fps",
      "JS thread runs app logic",
      "UI thread draws native views",
      "Busy JS thread drops frames",
    ],
    notes: "Keep the JS thread free; the UI thread keeps native scrolling smooth.",
    src: [["React Native: Performance Overview", `${RN}/performance`]],
  }),
  g({
    slug: "common-performance-problems",
    topic: "Lists & performance",
    d: "medium",
    title: "What common mistakes make a React Native app slow?",
    kw: ["dev mode", "console.log", "release build", "image scale", "requestAnimationFrame"],
    intent:
      "Checks that you know practical causes, including how you measure.",
    short:
      "The performance guide lists several. Running in development mode makes JavaScript performance suffer greatly because extra work provides warnings, so always test performance in release builds. console.log calls can cause a major bottleneck in a bundled app, including calls from logging libraries, so remove them, for example with babel-plugin-transform-remove-console. Slow FlatLists need getItemLayout. On iOS, animating the width or height of an Image re-crops and scales it each time, so use a scale transform. Wrapping heavy work in requestAnimationFrame can help a sluggish press.",
    detail: [
      "LayoutAnimation is not affected by JavaScript thread frame drops but suits only fire-and-forget animations.",
      "Animated runs on the JavaScript thread unless useNativeDriver is true.",
      "renderToHardwareTextureAndroid can help when a view with alpha compositing is moved, but overuse increases memory.",
    ],
    ex: "A team removes console logging from release builds and measures again in a release build.",
    mistakes: [
      "Judging speed from a debug build.",
      "Leaving verbose logging in production.",
    ],
    follow: ["How does useNativeDriver help animations?"],
    points: [
      "Test in release builds",
      "Remove console.log in production",
      "Scale images with transforms",
      "Profile before tuning",
    ],
    notes: "Measure in release; strip logs; avoid animating image size.",
    src: [["React Native: Performance Overview", `${RN}/performance`]],
  }),
  g({
    slug: "animated-api-native-driver",
    topic: "Lists & performance",
    d: "medium",
    title: "How does the Animated API work, and what does useNativeDriver do?",
    kw: ["Animated", "Animated.Value", "useNativeDriver", "LayoutAnimation", "timing"],
    intent:
      "Checks that you can add an animation without blocking the JavaScript thread.",
    short:
      "React Native provides two animation systems: Animated, for granular and interactive control of specific values, and LayoutAnimation, for animated global layout transactions. With Animated you create an Animated.Value, usually with useRef, map it to a style such as opacity, and start an animation such as Animated.timing on it. The values update on each frame in an optimised way faster than calling setState. Animated calculates each frame on the JavaScript thread unless you set useNativeDriver: true, which moves the animation off that thread.",
    detail: [
      "Animated exports animatable View, Text, Image, ScrollView, FlatList and SectionList.",
      "Animations can be combined with sequence, parallel and delay.",
      "createAnimatedComponent makes your own component animatable.",
    ],
    ex: "A banner fades in by animating opacity from 0 to 1 with useNativeDriver set to true.",
    mistakes: [
      "Driving an animation with setState on every frame.",
      "Leaving useNativeDriver off and wondering why animations stutter when JavaScript is busy.",
    ],
    follow: ["When is LayoutAnimation a better choice?"],
    points: [
      "Animated.Value mapped to styles",
      "timing, spring and decay animations",
      "useNativeDriver offloads work",
      "LayoutAnimation for layout changes",
    ],
    notes: "Animated.Value + timing; set useNativeDriver for smoothness.",
    src: [
      ["React Native: Animations", `${RN}/animations`],
      ["React Native: Performance Overview", `${RN}/performance`],
    ],
  }),
  g({
    slug: "accessibility-basics",
    topic: "Components & styling",
    d: "medium",
    title: "How do you make a React Native screen accessible?",
    kw: ["accessibility", "accessibilityLabel", "accessible", "screen reader", "TalkBack"],
    intent:
      "Checks that you consider users of screen readers, not just visuals.",
    short:
      "Android and iOS provide APIs for assistive technologies such as the bundled screen readers TalkBack and VoiceOver, and React Native has complementary APIs. The accessible prop marks a view as discoverable by assistive technology; touchable elements are accessible by default. Set accessibilityLabel so the screen reader says a meaningful name when the element is selected, and accessibilityHint to describe the result of an action when the label alone is not clear, for example 'Navigates to the previous screen'.",
    detail: [
      "If accessibilityLabel is not set, a touchable's label defaults to the text of its Text children.",
      "On Android accessible maps to native focusable, and on iOS to isAccessibilityElement.",
      "Accessibility focus is only available on elements that are marked accessible.",
    ],
    ex: "An icon-only close button gets accessibilityLabel='Close' so a screen reader announces it.",
    mistakes: [
      "Leaving icon-only buttons without a label.",
      "Testing only with the screen reader turned off.",
    ],
    follow: ["How would you test with TalkBack or VoiceOver?"],
    points: [
      "TalkBack and VoiceOver",
      "accessible marks discoverable views",
      "accessibilityLabel names elements",
      "accessibilityHint explains the result",
    ],
    notes: "Label every control that has no readable text.",
    src: [["React Native: Accessibility", `${RN}/accessibility`]],
  }),
  g({
    slug: "native-modules-and-components",
    topic: "Native APIs",
    d: "hard",
    title: "What if you need a native feature React Native does not provide?",
    kw: ["turbo native module", "fabric native component", "codegen", "native code", "specification"],
    intent:
      "Checks that you know where the boundary of JavaScript is and what the extension options are.",
    short:
      "If your app needs a native platform API that React Native or an existing library does not provide, you can write the integration yourself as a Turbo Native Module. The steps in the guide are: define a typed JavaScript specification in Flow or TypeScript; configure dependency management to run Codegen, which turns the specification into native interfaces; write the app code against it; and write the native Android and iOS code using the generated interfaces. To wrap a native view, such as a new kind of checkbox, you build a Fabric Native Component in a similar way.",
    detail: [
      "The guide's example implements localStorage with Android SharedPreferences and iOS NSUserDefaults.",
      "Both start with a typed specification that Codegen turns into native interfaces.",
      "Check the community ecosystem first, since a library may already exist.",
    ],
    ex: "A team writes a Turbo Native Module to expose a device-specific API that no library covers.",
    mistakes: [
      "Writing a native module when a maintained library already exists.",
      "Skipping the typed specification that Codegen needs.",
    ],
    follow: ["What is the difference between a native module and a native component?"],
    points: [
      "Turbo Native Module for APIs",
      "Fabric Native Component for views",
      "Typed spec in Flow or TypeScript",
      "Codegen generates native interfaces",
    ],
    notes: "Module = native API; component = native view; both start with a spec.",
    src: [
      [
        "React Native: Native Modules Introduction",
        `${RN}/turbo-native-modules-introduction`,
      ],
      [
        "React Native: Fabric Native Components Introduction",
        `${RN}/fabric-native-components-introduction`,
      ],
    ],
  }),
])
