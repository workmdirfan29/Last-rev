import { defineLesson } from "@/data/lessons/author"

export default defineLesson("java-oop", {
  slug: "solid-srp-ocp-lsp",
  title: "SOLID (1): single responsibility, open/closed and Liskov",
  topic: "SOLID",
  minutes: 50,
  overview:
    "Apply the first three SOLID principles to real code, with examples that show the problem and the fix.",
  objectives: [
    "Explain and apply the single responsibility principle",
    "Extend behaviour without editing tested code (open/closed)",
    "Recognise a Liskov substitution violation",
  ],
  prerequisites: ["lesson.java-oop.interfaces"],
  sections: [
    {
      kind: "explain",
      heading: "What SOLID is",
      body: [
        "**SOLID** is a set of five design guidelines from the object-oriented design community: Single responsibility, Open/closed, Liskov substitution, Interface segregation and Dependency inversion. They are not language rules. They are advice for keeping code easy to change and to test, and they help most when you notice a real problem, not as rules to apply everywhere.",
        "This lesson covers the first three. The next one covers the last two.",
      ],
    },
    {
      kind: "explain",
      heading: "Single responsibility",
      body: [
        "A class should have **one reason to change**, which means it should do one job. A class that calculates an invoice, saves it to a database and sends an email changes when the pricing rules, the database or the email text changes. Splitting it into an `InvoiceCalculator`, an `InvoiceRepository` and an `InvoiceMailer` makes each class smaller, easier to test, and less likely to break the others.",
        "It is about **reasons to change**, not the number of methods. Splitting too far is also a problem: group the things that change together.",
      ],
    },
    {
      kind: "explain",
      heading: "Open/closed",
      body: [
        "Code should be **open for extension, closed for modification**: you should be able to add behaviour without editing code that is already tested. In Java this is usually done with an interface and polymorphism. Instead of a long `if` or `switch` on a type that you must edit for each new case, you add a **new class** that implements the interface.",
        "The *strategy* pattern is a common way to apply it. Do not add abstractions for changes that will probably never happen. Apply the principle where change is expected.",
      ],
    },
    {
      kind: "code",
      heading: "Open/closed in practice",
      example: {
        title: "A new discount without editing checkout",
        language: "java",
        code: "public class Main {\n  interface DiscountPolicy {\n    double apply(double price);\n  }\n  static class NoDiscount implements DiscountPolicy {\n    public double apply(double p) { return p; }\n  }\n  static class FestivalDiscount implements DiscountPolicy {\n    public double apply(double p) { return p * 0.8; }\n  }\n\n  static double pay(double price, DiscountPolicy policy) {\n    return policy.apply(price);\n  }\n\n  public static void main(String[] args) {\n    System.out.println(pay(1000, new NoDiscount()));\n    System.out.println(pay(1000, new FestivalDiscount()));\n  }\n}",
        walkthrough: [
          "`pay` depends on the interface and never changes.",
          "A new discount is a new class that implements `DiscountPolicy`.",
          "The output is `1000.0` and `800.0`.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Liskov substitution",
      body: [
        "An object of a subclass must be usable **wherever its superclass is expected**, without breaking the correctness of the program. The subclass must keep the promises of the parent: it should not demand more from callers, give less in return, or throw unexpected exceptions.",
        "The classic violation is a `Square` that extends `Rectangle`. Code that sets the width and the height separately and expects the area to be `width * height` fails when it gets a square. A subclass that overrides a method to throw `UnsupportedOperationException` is another warning sign. When substitution does not hold, use a common interface or composition.",
      ],
    },
    {
      kind: "code",
      heading: "A Liskov violation",
      example: {
        title: "Square and Rectangle",
        language: "java",
        code: "public class Main {\n  static class Rectangle {\n    protected int w, h;\n    void setWidth(int w) { this.w = w; }\n    void setHeight(int h) { this.h = h; }\n    int area() { return w * h; }\n  }\n  static class Square extends Rectangle {\n    @Override void setWidth(int w) { this.w = w; this.h = w; }\n    @Override void setHeight(int h) { this.w = h; this.h = h; }\n  }\n\n  public static void main(String[] args) {\n    Rectangle r = new Square();\n    r.setWidth(4);\n    r.setHeight(5);\n    System.out.println(r.area());\n  }\n}",
        walkthrough: [
          "Code written for a `Rectangle` expects `4 * 5 = 20`.",
          "The `Square` forces both sides to be equal, so the result is `25`.",
          "The subclass broke an expectation of its parent, so it should not extend `Rectangle`.",
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Putting calculation, storage and email in one class.",
          fix: "Split by reason to change.",
        },
        {
          mistake: "Growing a single `switch` for every new type.",
          fix: "Add a class behind an interface.",
        },
        {
          mistake:
            'Making a subclass because "a square is a rectangle" in maths.',
          fix: "Check that behaviour is substitutable, not just the wording.",
        },
        {
          mistake: "Creating abstractions for changes that will never happen.",
          fix: "Apply the principles where change really occurs.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A report generator",
      scenario:
        "A `ReportService` loads data, formats it as PDF and e-mails it, and every change to the layout risks the other parts.",
      body: [
        "Split it into a loader, a formatter interface with `PdfFormatter` and `CsvFormatter`, and a mailer. Adding a format is a new class, and the others are untouched.",
        "Each part can be tested alone with a fake.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "solid-srp",
      prompt: "What does the single responsibility principle say?",
      options: [
        "A class should have one reason to change",
        "A class should have one method",
        "A class should have one field",
      ],
      answer: 0,
      explanation: "It is about reasons to change, not the number of members.",
    },
    {
      type: "single",
      id: "solid-ocp",
      prompt: "How is the open/closed principle usually applied in Java?",
      options: [
        "New behaviour is a new class behind an interface",
        "By editing the switch statement",
        "By making classes final",
      ],
      answer: 0,
      explanation:
        "Polymorphism lets you extend without modifying tested code.",
    },
    {
      type: "truefalse",
      id: "solid-lsp",
      statement:
        "A Square that extends Rectangle always satisfies the Liskov substitution principle.",
      answer: false,
      explanation:
        "Code that sets width and height separately breaks, so substitution fails.",
    },
    {
      type: "single",
      id: "solid-warning",
      prompt: "Which is a warning sign for a Liskov violation?",
      options: [
        "A subclass method that throws UnsupportedOperationException",
        "A subclass with extra methods",
        "A subclass in another package",
      ],
      answer: 0,
      explanation: "The subclass refuses something that the parent promised.",
    },
  ],
  assignment: {
    title: "Refactor with SRP and OCP",
    task: [
      "Take a class that calculates a total, saves it and prints a receipt, and split it into three classes.",
      "Replace a switch on payment type with a `PaymentMethod` interface, and add a new method without editing the old code.",
    ],
    checklist: [
      "Each class has one reason to change",
      "The switch is gone",
      "Adding a payment method edits no existing class",
    ],
    minutes: 20,
  },
  exercises: [
    {
      slug: "solid-ex",
      title: "Open for extension",
      task: [
        "Write an interface `Tax` with `double of(double amount)`, two implementations (`FlatTax` 10 percent and `NoTax`), and a method `total(double amount, Tax tax)` that returns amount plus tax.",
      ],
      language: "java",
      starter: "public class TaxDemo {\n  // your code\n}",
      solution:
        "public class TaxDemo {\n  interface Tax {\n    double of(double amount);\n  }\n\n  static class FlatTax implements Tax {\n    public double of(double amount) {\n      return amount * 0.10;\n    }\n  }\n\n  static class NoTax implements Tax {\n    public double of(double amount) {\n      return 0;\n    }\n  }\n\n  static double total(double amount, Tax tax) {\n    return amount + tax.of(amount);\n  }\n\n  public static void main(String[] args) {\n    System.out.println(total(200, new FlatTax()));\n    System.out.println(total(200, new NoTax()));\n  }\n}",
      hints: ["`total` depends only on the interface."],
      checklist: [
        "total does not change when a new tax is added",
        "Both implementations work",
        "No switch or if on the type",
      ],
    },
  ],
  revisionNotes: [
    "SRP: one reason to change; split by responsibility",
    "OCP: extend with new classes behind interfaces, do not edit tested code",
    "LSP: a subclass must keep the parent's promises; Square/Rectangle is the classic break",
    "SOLID is guidance, not law: apply it where change really happens",
  ],
  resources: [
    {
      label: "The Java Tutorials: Polymorphism",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html",
    },
    {
      label: "The Java Tutorials: Inheritance",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html",
    },
    {
      label: "The Java Tutorials: Interfaces",
      url: "https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html",
    },
  ],
})
