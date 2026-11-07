import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-framework", {
  slug: "wiring-beans-qualifiers-and-cycles",
  title: "Wiring beans: stereotypes, ambiguity and circular dependencies",
  topic: "IoC & DI",
  minutes: 60,
  overview:
    "Register beans with stereotypes, resolve several candidates with Primary and Qualifier, and handle circular dependencies.",
  objectives: [
    "Use @Component and its specialisations",
    "Resolve ambiguity with @Primary and @Qualifier",
    "Recognise and fix a circular dependency",
  ],
  prerequisites: ["lesson.spring-framework.ioc-and-dependency-injection"],
  sections: [
    {
      kind: "explain",
      heading: "Stereotype annotations",
      body: [
        "`@Component` marks a class as a Spring-managed bean that **component scanning** finds. `@Service`, `@Repository` and `@Controller` are specialisations that describe the role of the class. `@Service` adds no behaviour: it marks business logic. `@Repository` marks the data access layer and also enables the **translation of persistence exceptions** into Spring's `DataAccessException` hierarchy. `@Controller` marks a web class, and `@RestController` adds `@ResponseBody`.",
        "Using the right stereotype documents the architecture. All of them are registered as singleton beans by default, and the default name of a bean is the class name with a lower-case first letter.",
      ],
    },
    {
      kind: "explain",
      heading: "When several beans match",
      body: [
        'Spring autowires by **type** first. If more than one bean of the required type exists, it throws `NoUniqueBeanDefinitionException`, unless it can decide. Mark one candidate `@Primary` so that it is the **default choice**, or use `@Qualifier("name")` at the injection point to pick a **specific** bean by name. A qualifier is more specific, so it wins over `@Primary`. If **no** bean matches, you get `NoSuchBeanDefinitionException`, unless the dependency is optional.',
        "To inject **all** the beans of a type, ask for a `List<Type>` or a `Map<String, Type>`. `ObjectProvider<Type>` handles an optional or prototype bean.",
      ],
    },
    {
      kind: "code",
      heading: "Picking one of two beans",
      example: {
        title: "@Qualifier and @Primary",
        language: "java",
        code: 'interface PaymentGateway {\n  boolean charge(double amount);\n}\n\n@Component("razorpay")\n@Primary\nclass RazorpayGateway implements PaymentGateway {\n  public boolean charge(double amount) { return true; }\n}\n\n@Component("stripe")\nclass StripeGateway implements PaymentGateway {\n  public boolean charge(double amount) { return true; }\n}\n\n@Service\nclass Checkout {\n  private final PaymentGateway gateway;\n  private final List<PaymentGateway> all;\n\n  Checkout(@Qualifier("stripe") PaymentGateway gateway, List<PaymentGateway> all) {\n    this.gateway = gateway;\n    this.all = all;\n  }\n}',
        walkthrough: [
          "Two beans implement the interface. Without `@Primary` or a qualifier, injection by type alone would be ambiguous.",
          '`@Qualifier("stripe")` selects that bean, even though another one is `@Primary`.',
          "A `List<PaymentGateway>` receives both implementations.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Circular dependencies",
      body: [
        "A **circular dependency** exists when bean A needs bean B and bean B needs bean A. With constructor injection, Spring cannot create either one first, and it fails with `BeanCurrentlyInCreationException`. Since Spring Boot 2.6, circular references are **prohibited by default**. The property `spring.main.allow-circular-references=true` hides the problem and should only be a temporary measure.",
        "A cycle is a sign that two classes know too much about each other, or have the wrong responsibilities. The best fix is to change the **design**: move the shared logic into a third class that both use, or break the cycle with an event or an interface. As a last resort, `@Lazy` on one parameter injects a proxy that resolves the real bean on first use.",
      ],
    },
    {
      kind: "code",
      heading: "Breaking a cycle",
      example: {
        title: "Extract a shared class",
        language: "java",
        code: "// before: UserService needs OrderService, and OrderService needs UserService\n\n// after: both use a small shared class\n@Service\nclass UserLookup {\n  User find(long id) { /* load the user */ return null; }\n}\n\n@Service\nclass UserService {\n  private final UserLookup lookup;\n  UserService(UserLookup lookup) { this.lookup = lookup; }\n}\n\n@Service\nclass OrderService {\n  private final UserLookup lookup;\n  OrderService(UserLookup lookup) { this.lookup = lookup; }\n}",
        walkthrough: [
          "The two services no longer depend on each other.",
          "The shared part has one clear responsibility, and the dependency graph has no loop.",
          "Constructor injection helped here, because it revealed the cycle at start-up.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Leaving two candidates without @Primary or a qualifier.",
          fix: "Mark one primary, or qualify the injection point.",
        },
        {
          mistake: "Enabling circular references to silence an error.",
          fix: "Redesign the dependency.",
        },
        {
          mistake: "Putting @Component on everything and losing the layers.",
          fix: "Use the stereotype that matches the role.",
        },
        {
          mistake: "Expecting @Service to add transactions.",
          fix: "It adds no behaviour. Use @Transactional.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Several payment providers",
      scenario:
        "A shop supports two payment providers, chooses one by the customer's country, and sometimes needs the list of all providers.",
      body: [
        "Give each provider a name, inject the list of all providers into a `PaymentRouter`, and let the router pick one by country. The default provider is marked `@Primary` for the simple cases.",
        "No `if` on provider names is spread through the code.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "wire-unique",
      prompt:
        "Which exception is thrown when several beans match and none is chosen?",
      options: [
        "NoUniqueBeanDefinitionException",
        "NoSuchBeanDefinitionException",
        "BeanCurrentlyInCreationException",
      ],
      answer: 0,
      explanation: "`NoSuchBeanDefinitionException` is for no match at all.",
    },
    {
      type: "single",
      id: "wire-qualifier",
      prompt:
        "Which wins when a bean is @Primary and the injection point has a @Qualifier?",
      options: ["The qualifier", "@Primary", "The first bean found"],
      answer: 0,
      explanation: "A qualifier is more specific.",
    },
    {
      type: "truefalse",
      id: "wire-repo",
      statement: "@Repository also translates persistence exceptions.",
      answer: true,
      explanation:
        "That is the one behaviour that stereotypes beyond @Component add.",
    },
    {
      type: "single",
      id: "wire-cycle",
      prompt: "What is the best fix for a circular dependency?",
      options: [
        "Change the design, for example extract a shared class",
        "Enable circular references",
        "Use field injection",
      ],
      answer: 0,
      explanation: "A cycle usually points to wrong responsibilities.",
    },
  ],
  assignment: {
    title: "Qualifiers and cycles",
    task: [
      "Create two implementations of an interface, inject each one by qualifier, and inject the list of all of them.",
      "Create a circular dependency on purpose, read the error, and break it by extracting a class.",
    ],
    checklist: [
      "I produced and read both errors",
      "The cycle is broken by a redesign",
      "No @Autowired field injection is used",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "wire-ex",
      title: "Mark a default",
      task: [
        "There are two `Notifier` beans, `EmailNotifier` and `SmsNotifier`. Make the email one the default, and inject the SMS one by name into `AlertService`.",
      ],
      language: "java",
      starter:
        "interface Notifier {\n  void send(String message);\n}\n\n@Component\nclass EmailNotifier implements Notifier {\n  public void send(String message) { }\n}\n\n@Component\nclass SmsNotifier implements Notifier {\n  public void send(String message) { }\n}\n\n@Service\nclass AlertService {\n  // your code\n}",
      solution:
        'interface Notifier {\n  void send(String message);\n}\n\n@Component\n@Primary\nclass EmailNotifier implements Notifier {\n  public void send(String message) { }\n}\n\n@Component\nclass SmsNotifier implements Notifier {\n  public void send(String message) { }\n}\n\n@Service\nclass AlertService {\n  private final Notifier notifier;\n\n  AlertService(@Qualifier("smsNotifier") Notifier notifier) {\n    this.notifier = notifier;\n  }\n}',
      hints: ["The default bean name of `SmsNotifier` is `smsNotifier`."],
      checklist: [
        "EmailNotifier is @Primary",
        "AlertService qualifies the SMS bean",
        "Constructor injection is used",
      ],
    },
  ],
  revisionNotes: [
    "@Component and its stereotypes; @Repository adds exception translation",
    "Several matches: @Primary (default) or @Qualifier (explicit); List<T> injects all",
    "Circular dependency → BeanCurrentlyInCreationException; redesign, `@Lazy` last",
    "Names default to the class name with a lower-case first letter",
  ],
  resources: [
    {
      label:
        "Spring Framework Reference: Classpath Scanning and Managed Components",
      url: "https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html",
    },
    {
      label:
        "Spring Framework Reference: Fine-tuning Annotation-based Autowiring with Qualifiers",
      url: "https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired-qualifiers.html",
    },
  ],
})
