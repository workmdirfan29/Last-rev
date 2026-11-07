import { defineQuestions } from "../author"
import { g } from "../brief"

const T = "https://docs.oracle.com/javase/tutorial/java"

export default defineQuestions("java-oop", "fresher", [
  g({
    slug: "class-vs-object",
    topic: "Classes & objects",
    d: "easy",
    title: "What is the difference between a class and an object in Java?",
    kw: ["class", "object", "instance", "new", "blueprint"],
    intent: "Checks the most basic vocabulary of object-oriented programming.",
    short:
      "A class is a blueprint that defines the fields (state) and methods (behaviour) of a kind of thing. An object is a concrete instance created from that class with `new`, and it has its own values for the fields. One class can create many objects, and each object has its own state, while the class itself is defined once.",
    detail: [
      "Variables of a class type hold a reference to an object, not the object itself.",
      "`static` members belong to the class and are shared by all objects.",
      "An object is created in the heap, and the reference variable that points to it lives where it is declared.",
    ],
    ex: "The class `Account` defines `balance` and `deposit`, and two customers each get their own `Account` object with a different balance.",
    code: [
      "One class, two objects",
      'class Account {\n  double balance;\n  void deposit(double amount) {\n    balance += amount;\n  }\n}\n\nAccount a = new Account();\nAccount b = new Account();\na.deposit(100);\nSystem.out.println(a.balance + " " + b.balance);',
      [
        "`Account` is the blueprint.",
        "`a` and `b` are two separate objects with their own `balance`.",
        "Depositing into `a` does not change `b`, so the output is `100.0 0.0`.",
      ],
      "java",
    ],
    mistakes: [
      "Saying that an object and a reference variable are the same thing.",
      "Thinking that two objects of one class share their instance fields.",
    ],
    follow: ["What does the new keyword do?"],
    points: [
      "Class = blueprint",
      "Object = instance with its own state",
      "Many objects from one class",
    ],
    notes: "Class = definition. Object = instance created with `new`.",
    src: [
      ["The Java Tutorials: What Is a Class?", `${T}/concepts/class.html`],
      ["The Java Tutorials: What Is an Object?", `${T}/concepts/object.html`],
    ],
  }),
  g({
    slug: "constructors",
    topic: "Classes & objects",
    d: "easy",
    title: "What is a constructor? What is the default constructor?",
    kw: [
      "constructor",
      "default constructor",
      "this()",
      "overloading",
      "initialisation",
    ],
    intent: "Checks that you know how objects are initialised.",
    short:
      "A constructor is a special block of code that runs when an object is created with `new`. It has the same name as the class and no return type, and it sets the object's initial state. If you write no constructor, the compiler adds a default no-argument constructor. As soon as you write any constructor, that default is no longer added. Constructors can be overloaded, and one can call another with `this(...)`, which must be the first statement.",
    detail: [
      "A constructor cannot be inherited, `static`, or `final`.",
      "Constructor chaining with `this(...)` avoids repeating initialisation code.",
      "A method with the class name and a return type, such as `void Account()`, is a method and not a constructor.",
    ],
    ex: '`new Account("Asha")` and `new Account("Asha", 500)` use two constructors, and the first calls the second with a default balance.',
    code: [
      "Overloaded constructors with chaining",
      "class Account {\n  private final String owner;\n  private double balance;\n\n  Account(String owner) {\n    this(owner, 0);\n  }\n\n  Account(String owner, double balance) {\n    this.owner = owner;\n    this.balance = balance;\n  }\n}",
      [
        "The first constructor delegates to the second with `this(owner, 0)`.",
        "Only the second one assigns the fields, so the logic is in one place.",
        "Because a constructor was written, there is no automatic default constructor.",
      ],
      "java",
    ],
    mistakes: [
      "Writing a constructor with arguments and then calling `new Account()` without one.",
      "Giving a constructor a return type by mistake.",
    ],
    follow: ["Can a constructor be private?"],
    points: [
      "Same name, no return type",
      "Default constructor only if none is written",
      "this(...) chains constructors",
    ],
    notes:
      "Constructor: class name, no return type. Default one disappears once you write any.",
    src: [
      [
        "The Java Tutorials: Providing Constructors",
        `${T}/javaOO/constructors.html`,
      ],
      [
        "The Java Tutorials: Using the this Keyword",
        `${T}/javaOO/thiskey.html`,
      ],
    ],
  }),
  g({
    slug: "this-keyword",
    topic: "Classes & objects",
    d: "easy",
    title: "What does the `this` keyword mean?",
    kw: ["this", "current object", "shadowing", "this()", "method chaining"],
    intent:
      "Checks that you understand how a method knows which object it works on.",
    short:
      "`this` is a reference to the current object, the one whose method or constructor is running. It is used to tell a field from a parameter with the same name, as in `this.name = name`, to call another constructor with `this(...)`, and to pass the current object to another method or return it for method chaining. It does not exist in a `static` method, because no object is involved.",
    detail: [
      "Without `this`, `name = name` assigns the parameter to itself and the field stays unchanged.",
      'Returning `this` from setters allows chained calls such as `builder.name("A").age(3)`.',
      "Inside an inner class, `Outer.this` refers to the enclosing object.",
    ],
    ex: "A constructor with the parameter `name` stores it with `this.name = name`.",
    mistakes: [
      "Writing `name = name` in a constructor and leaving the field `null`.",
      "Using `this` in a static method, which is a compile error.",
    ],
    follow: ["Why can you not use this in a static method?"],
    points: [
      "Refers to the current object",
      "Separates fields from parameters",
      "Not available in static methods",
    ],
    notes:
      "`this.field = param`; `this(...)` calls another constructor; no `this` in static code.",
    src: [
      [
        "The Java Tutorials: Using the this Keyword",
        `${T}/javaOO/thiskey.html`,
      ],
      [
        "The Java Tutorials: Providing Constructors",
        `${T}/javaOO/constructors.html`,
      ],
    ],
  }),
  g({
    slug: "static-vs-instance-members",
    topic: "Classes & objects",
    d: "easy",
    title: "What is the difference between static and instance members?",
    kw: ["static", "instance", "class variable", "static method", "shared"],
    intent:
      "Checks that you know what belongs to the class and what to an object.",
    short:
      "An instance field or method belongs to an object, so each object has its own copy of the field, and the method is called on an object. A `static` member belongs to the class: there is one copy of a static field shared by all objects, and a static method is called with the class name without creating an object. A static method cannot use instance fields or `this` directly, because it does not run on an object.",
    detail: [
      "Use `static final` for constants and `static` for utility methods such as `Math.max`.",
      "A static counter shared by all objects is easy to misuse in multi-threaded code.",
      "An instance method can use static members, but a static method cannot use instance members without an object.",
    ],
    ex: "A class counts how many `Order` objects were created with a static `count`, while `id` is an instance field.",
    code: [
      "A static counter and an instance id",
      "class Order {\n  static int count = 0;\n  final int id;\n\n  Order() {\n    count++;\n    id = count;\n  }\n}\n\nnew Order();\nnew Order();\nSystem.out.println(Order.count);",
      [
        "`count` exists once, and every constructor call increases it.",
        "`id` is a separate field in every object.",
        "The output is `2`, read through the class name.",
      ],
      "java",
    ],
    mistakes: [
      "Using an instance field in a static method.",
      "Making a field static just so that it is easy to reach from anywhere.",
    ],
    follow: ["Can a static method be overridden?"],
    points: [
      "Instance: per object",
      "Static: one copy per class",
      "Static code has no this",
    ],
    notes: "Static = class level, shared. Instance = per object.",
    src: [
      [
        "The Java Tutorials: Understanding Class Members",
        `${T}/javaOO/classvars.html`,
      ],
      ["The Java Tutorials: Classes and Objects", `${T}/javaOO/index.html`],
    ],
  }),
  g({
    slug: "pass-by-value",
    topic: "Classes & objects",
    d: "medium",
    title: "Is Java pass by value or pass by reference?",
    kw: [
      "pass by value",
      "reference",
      "method parameters",
      "swap",
      "object reference",
    ],
    intent:
      "Checks a classic question where many candidates give the wrong answer.",
    short:
      "Java is always pass by value. For a primitive, a copy of the value is passed, so the method cannot change the caller's variable. For an object, the value that is copied is the reference, so the method gets its own copy of the reference pointing to the same object. It can change the object's contents through that reference, but if it assigns a new object to the parameter, the caller's variable still points to the original object.",
    detail: [
      "This is why a swap method that exchanges two parameters does not work.",
      "Changing a field of the passed object is visible to the caller, because both references point to one object.",
      "Immutable objects such as `String` cannot be changed through any reference.",
    ],
    ex: "A method that appends to a passed `StringBuilder` changes it for the caller, but a method that assigns `sb = new StringBuilder()` does not.",
    code: [
      "Contents change, the reference does not",
      'static void change(StringBuilder sb) {\n  sb.append("!");\n  sb = new StringBuilder("new");\n}\n\nStringBuilder text = new StringBuilder("hi");\nchange(text);\nSystem.out.println(text);',
      [
        "`sb` starts as a copy of the reference to the same object as `text`.",
        "`append` changes that shared object, so it becomes `hi!`.",
        "Assigning a new object to `sb` only changes the local copy of the reference.",
        "The output is `hi!`.",
      ],
      "java",
    ],
    mistakes: [
      "Saying that objects are passed by reference.",
      "Expecting a method that reassigns its parameter to change the caller's variable.",
    ],
    follow: ["Can you write a method that swaps two ints?"],
    points: [
      "Always a copy of the value",
      "For objects the value is a reference",
      "Reassigning the parameter does not affect the caller",
    ],
    notes: "Java passes copies. For objects the copy is of the reference.",
    src: [
      [
        "The Java Tutorials: Passing Information to a Method",
        `${T}/javaOO/arguments.html`,
      ],
      ["The Java Tutorials: Defining Methods", `${T}/javaOO/methods.html`],
    ],
  }),
  g({
    slug: "equals-and-hashcode",
    topic: "Classes & objects",
    d: "medium",
    title: "What is the contract between `equals()` and `hashCode()`?",
    kw: ["equals", "hashCode", "contract", "HashMap", "Object"],
    intent:
      "Checks a rule that breaks hash-based collections when it is ignored.",
    short:
      "By default `equals` in `Object` compares references, so two objects are equal only if they are the same object. If your class has value equality, you override `equals`, and you must also override `hashCode`. The contract says that equal objects must return the same hash code. The reverse does not have to hold, as different objects may share a hash code. If you break the rule, hash-based collections such as `HashMap` and `HashSet` cannot find an object that you put in.",
    detail: [
      "`equals` must be reflexive, symmetric, transitive, consistent, and return `false` for `null`.",
      "Use the same fields in both methods, and use `Objects.equals` and `Objects.hash`.",
      "A record gets correct `equals` and `hashCode` for its components automatically.",
    ],
    ex: "Two `Point(1, 2)` objects must be equal and share a hash code, so a `HashSet` stores only one of them.",
    code: [
      "Overriding both methods",
      "import java.util.Objects;\n\nclass Point {\n  final int x, y;\n  Point(int x, int y) { this.x = x; this.y = y; }\n\n  @Override public boolean equals(Object o) {\n    if (this == o) return true;\n    if (!(o instanceof Point p)) return false;\n    return x == p.x && y == p.y;\n  }\n\n  @Override public int hashCode() {\n    return Objects.hash(x, y);\n  }\n}",
      [
        "The same two fields are used in both methods.",
        "`instanceof` handles `null` and a wrong type, and returns `false`.",
        "Equal points always give the same hash code.",
      ],
      "java",
    ],
    mistakes: [
      "Overriding `equals` but not `hashCode`.",
      "Using a field that changes in `hashCode`, so the object is lost in a `HashSet`.",
    ],
    follow: ["What happens in a HashMap if hashCode is not overridden?"],
    points: [
      "Equal objects, equal hash codes",
      "Override both or neither",
      "Records generate both",
    ],
    notes: "Override `equals` and `hashCode` together, using the same fields.",
    src: [
      [
        "Java SE API: Object (equals and hashCode)",
        "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html",
      ],
      [
        "The Java Tutorials: Object as a Superclass",
        `${T}/IandI/objectclass.html`,
      ],
    ],
  }),
  g({
    slug: "nested-and-inner-classes",
    topic: "Classes & objects",
    d: "medium",
    title: "What are nested, inner, local and anonymous classes?",
    kw: [
      "nested class",
      "inner class",
      "static nested",
      "anonymous class",
      "local class",
    ],
    intent:
      "Checks that you know the four kinds of classes declared inside another.",
    short:
      "A nested class is declared inside another class. A static nested class is like a normal class placed inside another for organisation, and it has no reference to an outer object. An inner class, which is non-static, belongs to an instance of the outer class and can use its fields. A local class is declared inside a method, and an anonymous class has no name and is declared and created in one expression, often to implement an interface once. Lambdas now replace most anonymous classes for functional interfaces.",
    detail: [
      "Prefer a static nested class unless you need access to the outer instance, because an inner class keeps the outer object alive.",
      "Local and anonymous classes can use local variables that are final or effectively final.",
      "An inner class is created from an outer object, for example `outer.new Inner()`.",
    ],
    ex: "A `LinkedList` class has a private static nested `Node` class, because a node does not need the list object.",
    mistakes: [
      "Making a nested class non-static by habit and keeping an unneeded reference to the outer object.",
      "Changing a local variable that an anonymous class uses.",
    ],
    follow: ["When would you use a static nested class?"],
    points: [
      "Static nested: no outer instance",
      "Inner: tied to an outer object",
      "Local and anonymous: declared in a method",
    ],
    notes:
      "Prefer static nested classes. Lambdas replace most anonymous classes.",
    src: [
      ["The Java Tutorials: Nested Classes", `${T}/javaOO/nested.html`],
      [
        "The Java Tutorials: Anonymous Classes",
        `${T}/javaOO/anonymousclasses.html`,
      ],
    ],
  }),
  g({
    slug: "encapsulation",
    topic: "Classes & objects",
    d: "easy",
    title: "What is encapsulation and how do you achieve it in Java?",
    kw: ["encapsulation", "private", "getter", "setter", "data hiding"],
    intent:
      "Checks that you can explain it as protecting rules, not just writing getters.",
    short:
      "Encapsulation means keeping an object's data private and controlling access to it through methods, so the object can protect its own rules. In Java you declare fields `private` and expose only the methods that other code needs. A setter can validate a value before storing it, and an operation like `deposit` can enforce rules that a plain field could not. It lets you change the internal representation later without breaking the code that uses the class.",
    detail: [
      "Getters and setters for every field is not real encapsulation. Expose behaviour, not just data.",
      "Immutable classes are the strongest form: no setters at all.",
      "Choose the most restrictive access modifier that works.",
    ],
    ex: "`Account.deposit` rejects a negative amount, so no other class can put the balance into an invalid state.",
    code: [
      "A guarded field",
      'class Account {\n  private double balance;\n\n  public void deposit(double amount) {\n    if (amount <= 0) {\n      throw new IllegalArgumentException("Amount must be positive");\n    }\n    balance += amount;\n  }\n\n  public double getBalance() { return balance; }\n}',
      [
        "`balance` is private, so it cannot be set directly from outside.",
        "`deposit` checks the rule before it changes the field.",
        "The inside could change, for example to cents as `long`, without affecting callers.",
      ],
      "java",
    ],
    mistakes: [
      "Making fields public.",
      "Adding a public setter for every field without any rule.",
    ],
    follow: ["What is the difference between abstraction and encapsulation?"],
    points: [
      "Private data, controlled access",
      "Protects the object's rules",
      "Lets the inside change safely",
    ],
    notes: "Encapsulation = private fields + methods that enforce rules.",
    src: [
      [
        "The Java Tutorials: Controlling Access to Members of a Class",
        `${T}/javaOO/accesscontrol.html`,
      ],
      ["The Java Tutorials: What Is an Object?", `${T}/concepts/object.html`],
    ],
  }),
  g({
    slug: "inheritance-and-super",
    topic: "Inheritance",
    d: "easy",
    title: "What is inheritance? What does the `super` keyword do?",
    kw: ["inheritance", "extends", "super", "subclass", "superclass"],
    intent: "Checks that you understand reuse through a class hierarchy.",
    short:
      'Inheritance lets a class, the subclass, acquire the fields and methods of another class, the superclass, with the `extends` keyword, and then add or change behaviour. It models an "is-a" relationship, for example a `Car` is a `Vehicle`. `super` refers to the superclass: `super(...)` calls its constructor, and `super.method()` calls its version of a method. Java allows a class to extend only one class, and every class ultimately extends `Object`.',
    detail: [
      "Private members of the superclass exist in the object but are not accessible from the subclass by name.",
      "If you do not call `super(...)` yourself, the compiler inserts a call to the superclass's no-argument constructor.",
      "Use inheritance for a real is-a relationship, and not only to reuse code.",
    ],
    ex: "`SavingsAccount extends Account` reuses `deposit`, and adds an interest calculation.",
    code: [
      "Extending a class",
      'class Vehicle {\n  void start() { System.out.println("Starting"); }\n}\n\nclass Car extends Vehicle {\n  @Override\n  void start() {\n    super.start();\n    System.out.println("Engine on");\n  }\n}',
      [
        "`Car` inherits from `Vehicle` with `extends`.",
        "`super.start()` runs the superclass version first.",
        "Then the subclass adds its own behaviour.",
      ],
      "java",
    ],
    mistakes: [
      "Using inheritance when the relationship is not is-a.",
      "Forgetting that the superclass has no no-argument constructor, so the subclass constructor fails to compile.",
    ],
    follow: ["Why does Java not allow multiple inheritance of classes?"],
    points: [
      "extends for is-a reuse",
      "super calls the superclass",
      "Single class inheritance",
    ],
    notes:
      "`extends` = is-a. `super(...)` and `super.method()` reach the parent.",
    src: [
      ["The Java Tutorials: Inheritance", `${T}/IandI/subclasses.html`],
      ["The Java Tutorials: Using the Keyword super", `${T}/IandI/super.html`],
    ],
  }),
  g({
    slug: "constructor-order-in-inheritance",
    topic: "Inheritance",
    d: "medium",
    title: "In what order are constructors called in an inheritance chain?",
    kw: [
      "constructor chaining",
      "super()",
      "initialisation order",
      "subclass",
      "implicit super",
    ],
    intent: "Checks that you can predict the output of a classic puzzle.",
    short:
      "The constructor of the superclass runs before the constructor of the subclass, all the way up to `Object`. The first statement of every constructor is a call to `super(...)` or `this(...)`, and the compiler inserts `super()` if you write neither. So creating a subclass object runs the constructors from the top of the hierarchy down to the class you instantiated.",
    detail: [
      "Field initialisers and instance blocks of a class run after its `super(...)` call and before the rest of its constructor body.",
      "Calling an overridable method from a constructor is risky, because it can run before the subclass has initialised its fields.",
      "If the superclass has only constructors with parameters, the subclass must call one explicitly.",
    ],
    ex: "Creating a `Dog` prints the `Animal` constructor message first and then the `Dog` message.",
    code: [
      "Parent first",
      'class Animal {\n  Animal() { System.out.println("Animal"); }\n}\n\nclass Dog extends Animal {\n  Dog() { System.out.println("Dog"); }\n}\n\nnew Dog();',
      [
        "`Dog()` starts with an implicit `super()`.",
        "The `Animal` constructor runs and prints `Animal`.",
        "Then the rest of the `Dog` constructor prints `Dog`.",
      ],
      "java",
    ],
    mistakes: [
      "Expecting the subclass constructor to run first.",
      "Calling an overridable method in a constructor and seeing uninitialised fields.",
    ],
    follow: [
      "Why is calling an overridable method in a constructor a problem?",
    ],
    points: [
      "Superclass constructor first",
      "Implicit super() if you write none",
      "Avoid overridable calls in constructors",
    ],
    notes: "Constructors run top-down: Object → superclass → subclass.",
    src: [
      [
        "The Java Tutorials: Using the Keyword super (Constructors)",
        `${T}/IandI/super.html`,
      ],
      ["The Java Tutorials: Initializing Fields", `${T}/javaOO/initial.html`],
    ],
  }),
  g({
    slug: "final-keyword",
    topic: "Inheritance",
    d: "easy",
    title:
      "What does the `final` keyword mean for a variable, a method and a class?",
    kw: ["final", "constant", "final method", "final class", "immutable"],
    intent: "Checks that you know the three uses of final.",
    short:
      "A `final` variable can be assigned only once, so it is a constant if it is also `static`. For an object it fixes the reference, not the contents of the object. A `final` method cannot be overridden by a subclass. A `final` class cannot be extended, as with `String` and the wrapper classes. It is used to keep behaviour from changing and to help design immutable classes.",
    detail: [
      "A `final` field must be assigned in its declaration, an initialiser block or every constructor.",
      "A final reference to a list still allows the list to be changed.",
      "Parameters and local variables can also be `final`, which stops reassigning them.",
    ],
    ex: "`final class Money` cannot be subclassed, so nobody can add changing behaviour to it.",
    mistakes: [
      "Believing that a `final` list cannot be modified.",
      "Extending a class that is `final`, which is a compile error.",
    ],
    follow: ["How is final different from immutable?"],
    points: [
      "final variable: assigned once",
      "final method: no override",
      "final class: no subclass",
    ],
    notes:
      "final variable = one assignment, final method = no override, final class = no subclass.",
    src: [
      [
        "The Java Tutorials: Writing Final Classes and Methods",
        `${T}/IandI/final.html`,
      ],
      [
        "The Java Tutorials: Understanding Class Members",
        `${T}/javaOO/classvars.html`,
      ],
    ],
  }),
  g({
    slug: "composition-vs-inheritance",
    topic: "Inheritance",
    d: "medium",
    title:
      "What is the difference between inheritance and composition? Which do you prefer?",
    kw: ["composition", "inheritance", "has-a", "is-a", "favour composition"],
    intent: "Checks that you can choose between two ways to reuse code.",
    short:
      "Inheritance models an is-a relationship and binds the subclass tightly to its superclass: a change in the parent can break the children. Composition models has-a: a class holds a reference to another object and delegates work to it. Composition is more flexible, because the part can be replaced at run time, tested alone, and shared between classes, while inheritance is fixed at compile time. A common guideline is to favour composition and use inheritance only for a true is-a relationship.",
    detail: [
      "A `Car` has an `Engine`, but it is not an engine.",
      "Java has no multiple class inheritance, but a class can hold many components.",
      "Inheritance is fine when the subclass really can be used anywhere its parent is expected.",
    ],
    ex: "A `Notifier` holds a `MessageSender`, which may be an email or an SMS sender, instead of extending a sender class.",
    code: [
      "Composition with a replaceable part",
      "interface MessageSender { void send(String text); }\n\nclass Notifier {\n  private final MessageSender sender;\n  Notifier(MessageSender sender) { this.sender = sender; }\n\n  void notifyUser(String text) {\n    sender.send(text);\n  }\n}",
      [
        "`Notifier` has a sender and delegates to it.",
        "Any `MessageSender` can be passed in, including a fake in tests.",
        "No inheritance chain is needed.",
      ],
      "java",
    ],
    mistakes: [
      "Extending a class only to reuse a method.",
      "Building deep inheritance trees that are hard to change.",
    ],
    follow: ["When is inheritance the right choice?"],
    points: [
      "Inheritance: is-a, tight coupling",
      "Composition: has-a, flexible",
      "Favour composition",
    ],
    notes: "Is-a → inheritance. Has-a → composition. Prefer composition.",
    src: [
      ["The Java Tutorials: Inheritance", `${T}/IandI/subclasses.html`],
      [
        "The Java Tutorials: What Is Inheritance?",
        `${T}/concepts/inheritance.html`,
      ],
    ],
  }),
  g({
    slug: "overloading-vs-overriding",
    topic: "Polymorphism",
    d: "easy",
    title: "What is the difference between method overloading and overriding?",
    kw: ["overloading", "overriding", "compile-time", "runtime", "@Override"],
    intent: "Checks one of the most common Java interview questions.",
    short:
      "Overloading means several methods in the same class with the same name but different parameter lists. The compiler picks which one to call from the argument types, so it is resolved at compile time. Overriding means a subclass provides its own version of a method inherited from a superclass, with the same name and parameters. The version that runs is chosen from the real type of the object at run time. Overloading is compile-time polymorphism, and overriding is run-time polymorphism.",
    detail: [
      "Changing only the return type does not overload a method.",
      "`@Override` makes the compiler check that you really override something.",
      "Overloaded methods can have different return types and access levels, but overriding methods have rules to follow.",
    ],
    ex: "`print(int)` and `print(String)` are overloads, while `Dog.speak()` overrides `Animal.speak()`.",
    code: [
      "Overload and override",
      'class Printer {\n  void print(int n) { System.out.println("int " + n); }\n  void print(String s) { System.out.println("text " + s); }\n}\n\nclass Animal { String speak() { return "..."; } }\nclass Dog extends Animal {\n  @Override String speak() { return "Woof"; }\n}',
      [
        "The two `print` methods are overloads, chosen by the argument type.",
        "`Dog.speak` overrides the parent's method with the same signature.",
        "`@Override` would give a compile error if the signature did not match.",
      ],
      "java",
    ],
    mistakes: [
      "Saying that overloading depends on the return type.",
      "Forgetting `@Override` and accidentally creating a new method with a typo.",
    ],
    follow: ["What are the rules for overriding a method?"],
    points: [
      "Overload: same class, different parameters, compile time",
      "Override: subclass, same signature, run time",
      "Use @Override",
    ],
    notes:
      "Overload = same name, different parameters. Override = subclass replaces behaviour.",
    src: [
      [
        "The Java Tutorials: Defining Methods (overloading)",
        `${T}/javaOO/methods.html`,
      ],
      [
        "The Java Tutorials: Overriding and Hiding Methods",
        `${T}/IandI/override.html`,
      ],
    ],
  }),
  g({
    slug: "overriding-rules",
    topic: "Polymorphism",
    d: "medium",
    title: "What rules must an overriding method follow?",
    kw: [
      "overriding rules",
      "covariant return",
      "access modifier",
      "checked exception",
      "static method",
    ],
    intent: "Checks that you know what the compiler allows when overriding.",
    short:
      "An overriding method must have the same name and parameter types. Its return type must be the same or a subtype (a covariant return). Its access cannot be more restrictive than the original, so a `public` method cannot be overridden as `protected`. It cannot throw broader checked exceptions than the original. `final`, `private` and `static` methods cannot be overridden: a `static` method in the subclass hides the parent's method instead.",
    detail: [
      "A subclass can make access wider, for example from `protected` to `public`.",
      "It may throw fewer checked exceptions, or none, and any unchecked exceptions.",
      "Fields are not overridden. A field with the same name in a subclass hides the parent's field.",
    ],
    ex: "`Animal.create()` returns `Animal`, and `Dog.create()` may return `Dog`, because that is a covariant return.",
    mistakes: [
      "Trying to override a `static` or `private` method.",
      "Narrowing the access level when overriding.",
    ],
    follow: ["What is method hiding?"],
    points: [
      "Same signature, covariant return",
      "Access not narrower",
      "No broader checked exceptions",
    ],
    notes:
      "Override rules: same signature, covariant return, no narrower access, no broader checked exceptions.",
    src: [
      [
        "The Java Tutorials: Overriding and Hiding Methods",
        `${T}/IandI/override.html`,
      ],
      ["The Java Tutorials: Hiding Fields", `${T}/IandI/hidevariables.html`],
    ],
  }),
  g({
    slug: "runtime-polymorphism",
    topic: "Polymorphism",
    d: "medium",
    title: "What is runtime polymorphism (dynamic dispatch)? Show an example.",
    kw: [
      "polymorphism",
      "dynamic dispatch",
      "upcasting",
      "virtual method",
      "late binding",
    ],
    intent:
      "Checks that you can explain how a superclass reference calls subclass code.",
    short:
      "Runtime polymorphism means that when you call an overridden method through a superclass reference, Java runs the version belonging to the actual object, decided at run time. This is called dynamic dispatch. It lets you write code against a general type, such as `Shape`, and add new types later, such as `Circle`, without changing that code. It applies to instance methods, and not to fields or static methods.",
    detail: [
      "Assigning a subclass object to a superclass variable is called upcasting, and it is always safe.",
      "The compiler checks that the method exists in the reference type. The JVM then picks the real implementation.",
      "To call a subclass-only method you need a cast, or better, a design that does not need it.",
    ],
    ex: "A `List<Shape>` holds circles and squares, and a loop calling `area()` runs the right code for each one.",
    code: [
      "One call, different behaviour",
      "abstract class Shape { abstract double area(); }\nclass Circle extends Shape {\n  double r = 1;\n  double area() { return Math.PI * r * r; }\n}\nclass Square extends Shape {\n  double side = 2;\n  double area() { return side * side; }\n}\n\nShape[] shapes = { new Circle(), new Square() };\nfor (Shape s : shapes) {\n  System.out.println(s.area());\n}",
      [
        "Both objects are stored in `Shape` references.",
        "`s.area()` runs `Circle.area` for the circle and `Square.area` for the square.",
        "A new `Shape` type needs no change to the loop.",
      ],
      "java",
    ],
    mistakes: [
      "Expecting a field to be chosen by the object's real type. Fields are resolved by the reference type.",
      "Casting down without checking the type first.",
    ],
    follow: ["What happens when you call a static method through a reference?"],
    points: [
      "Real object type decides the method",
      "Upcasting is safe",
      "Open for new types",
    ],
    notes:
      "Dynamic dispatch: the object's actual class decides which overridden method runs.",
    src: [
      ["The Java Tutorials: Polymorphism", `${T}/IandI/polymorphism.html`],
      [
        "The Java Tutorials: What Is Inheritance?",
        `${T}/concepts/inheritance.html`,
      ],
    ],
  }),
  g({
    slug: "instanceof-and-casting",
    topic: "Polymorphism",
    d: "medium",
    title: "How do `instanceof` and type casting work with objects?",
    kw: [
      "instanceof",
      "casting",
      "ClassCastException",
      "downcast",
      "pattern matching",
    ],
    intent: "Checks that you can safely convert a reference to a subtype.",
    short:
      "Upcasting, from a subclass to a superclass, is automatic and always safe. Downcasting, from a superclass reference to a subclass type, needs an explicit cast and can fail with a `ClassCastException` if the real object is not of that type. `instanceof` tests the real type first. Since Java 16, pattern matching for `instanceof` combines the test and the cast: `if (shape instanceof Circle c) { c.radius(); }`.",
    detail: [
      "`instanceof` is `false` for `null`.",
      "Frequent downcasting often means the design could use polymorphism instead.",
      "`getClass()` compares the exact class, while `instanceof` also accepts subclasses.",
    ],
    ex: "A method receives a `Shape` and only for a `Circle` prints its radius.",
    code: [
      "Safe downcast",
      "Shape s = new Circle();\n\nif (s instanceof Circle c) {\n  System.out.println(c.r);\n}\n\nShape q = new Square();\nCircle bad = (Circle) q; // ClassCastException at run time",
      [
        "The pattern test checks the type and declares `c` in one step.",
        "The last line compiles but fails at run time, because the object is a `Square`.",
      ],
      "java",
    ],
    mistakes: [
      "Casting without checking the type.",
      "Using many `instanceof` chains where an overridden method would be clearer.",
    ],
    follow: ["What does instanceof return for null?"],
    points: [
      "Upcast automatic, downcast explicit",
      "Wrong downcast: ClassCastException",
      "Pattern matching since Java 16",
    ],
    notes:
      "Check with `instanceof` before downcasting. Pattern matching: `x instanceof Type t`.",
    src: [
      [
        "The Java Tutorials: Polymorphism (casting objects)",
        `${T}/IandI/objectclass.html`,
      ],
      [
        "Java SE Language Specification: instanceof",
        "https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.20.2",
      ],
    ],
  }),
  g({
    slug: "abstract-class",
    topic: "Abstraction",
    d: "easy",
    title: "What is an abstract class? Can you create an object of it?",
    kw: [
      "abstract class",
      "abstract method",
      "template",
      "constructor",
      "instantiate",
    ],
    intent: "Checks that you know what abstract classes are for.",
    short:
      "An abstract class is declared with `abstract` and cannot be instantiated directly. It can hold abstract methods, which have no body and must be implemented by the first concrete subclass, and also normal methods, fields and constructors. It is used as a partial base class that shares code and state while forcing subclasses to supply the parts that differ. A class with at least one abstract method must be declared abstract.",
    detail: [
      "The constructor of an abstract class runs when a subclass object is created.",
      "An abstract class can also have no abstract methods at all.",
      "A subclass that does not implement every abstract method must itself be abstract.",
    ],
    ex: "`Report` is abstract with `generate()` that does the steps in order and an abstract `format()`, and `PdfReport` and `CsvReport` supply it.",
    code: [
      "A template with one abstract step",
      'abstract class Report {\n  public final String generate() {\n    return header() + format() ;\n  }\n  String header() { return "Report\\n"; }\n  abstract String format();\n}\n\nclass CsvReport extends Report {\n  String format() { return "a,b,c"; }\n}',
      [
        "`generate` is shared code and cannot be overridden.",
        "`format` has no body, so every subclass must supply it.",
        "`new Report()` would not compile, but `new CsvReport()` does.",
      ],
      "java",
    ],
    mistakes: [
      "Trying to create an instance of an abstract class.",
      "Using an abstract class where an interface would be more flexible.",
    ],
    follow: [
      "What is the difference between an abstract class and an interface?",
    ],
    points: [
      "Cannot be instantiated",
      "Can mix abstract and concrete methods",
      "Can hold state and constructors",
    ],
    notes:
      "Abstract class: partial implementation, no instances, can hold state.",
    src: [
      [
        "The Java Tutorials: Abstract Methods and Classes",
        `${T}/IandI/abstract.html`,
      ],
      ["The Java Tutorials: What Is a Class?", `${T}/concepts/class.html`],
    ],
  }),
  g({
    slug: "abstract-class-vs-interface",
    topic: "Abstraction",
    d: "medium",
    title: "What is the difference between an abstract class and an interface?",
    kw: [
      "abstract class",
      "interface",
      "default method",
      "multiple inheritance",
      "state",
    ],
    intent: "Checks that you can choose between two abstraction tools.",
    short:
      "A class can extend only one abstract class, but it can implement many interfaces. An abstract class can have instance fields (state), constructors and methods of any access level. An interface cannot have instance state or constructors, and its fields are constants. Since Java 8 an interface can also have `default` and `static` methods, and since Java 9 `private` methods. Use an interface to describe a capability that unrelated classes can share, and an abstract class for a family of closely related classes that share code and state.",
    detail: [
      "Interface methods are `public` and abstract by default unless they are `default`, `static` or `private`.",
      "A class can implement an interface even when it already extends another class.",
      "If you are unsure, start with an interface, and add an abstract base class only when you have shared code.",
    ],
    ex: "`Comparable` is an interface that many unrelated types implement, while `AbstractList` is a base class for list implementations.",
    mistakes: [
      "Saying that interfaces cannot have any method bodies, which is outdated since Java 8.",
      "Using an abstract class when a class might need to extend something else.",
    ],
    follow: [
      "Why can a class implement multiple interfaces but extend one class?",
    ],
    points: [
      "Many interfaces, one superclass",
      "Abstract class: state and constructors",
      "Interface: capability contract",
    ],
    notes:
      "Interface = contract (many allowed). Abstract class = shared code and state (one allowed).",
    src: [
      [
        "The Java Tutorials: Abstract Methods and Classes",
        `${T}/IandI/abstract.html`,
      ],
      ["The Java Tutorials: Interfaces", `${T}/IandI/createinterface.html`],
    ],
  }),
  g({
    slug: "abstraction-vs-encapsulation",
    topic: "Abstraction",
    d: "easy",
    title: "What is the difference between abstraction and encapsulation?",
    kw: ["abstraction", "encapsulation", "hiding", "interface", "private"],
    intent: "Checks that you can separate two ideas that are often mixed up.",
    short:
      "Abstraction is about showing what something does and hiding how it does it. You achieve it with interfaces and abstract classes, so callers depend on a simple contract. Encapsulation is about protecting an object's data by making fields private and allowing change only through methods that enforce rules. Abstraction works at the design level, and encapsulation works at the implementation level of one class. They support each other.",
    detail: [
      "A `List` interface is abstraction: you use `add` without knowing the storage.",
      "A private balance with a checked `deposit` is encapsulation.",
      "Both make code easier to change, because outside code relies less on the details.",
    ],
    ex: "Code uses the `PaymentGateway` interface (abstraction), and each implementation keeps its keys private (encapsulation).",
    mistakes: [
      "Giving the same definition for both terms.",
      "Thinking that private fields alone are abstraction.",
    ],
    follow: ["How do interfaces help with abstraction?"],
    points: [
      "Abstraction: what, not how",
      "Encapsulation: protect the data",
      "Different levels, same goal",
    ],
    notes:
      "Abstraction hides complexity (interfaces). Encapsulation protects state (private fields).",
    src: [
      [
        "The Java Tutorials: What Is an Interface?",
        `${T}/concepts/interface.html`,
      ],
      [
        "The Java Tutorials: Controlling Access to Members of a Class",
        `${T}/javaOO/accesscontrol.html`,
      ],
    ],
  }),
  g({
    slug: "interface-default-and-static-methods",
    topic: "Interfaces",
    d: "medium",
    title:
      "What are default and static methods in interfaces, and why were they added?",
    kw: [
      "default method",
      "static method",
      "interface",
      "backward compatibility",
      "Java 8",
    ],
    intent: "Checks that you know how interfaces can evolve.",
    short:
      "A `default` method has a body inside an interface, and every implementing class inherits it unless it overrides it. Default methods were added in Java 8 so that existing interfaces, such as `List` and `Iterable`, could get new methods, such as `forEach`, without breaking all the classes that already implement them. A `static` method in an interface belongs to the interface and is called with its name. Since Java 9 an interface can also have `private` methods that share code between default methods.",
    detail: [
      "Static interface methods are not inherited by implementing classes.",
      "A default method cannot use instance state, because interfaces have none.",
      "Use default methods to add optional behaviour, not to turn an interface into a class.",
    ],
    ex: "`Comparator.reversed()` is a default method, and `Comparator.comparing(...)` is a static one.",
    code: [
      "A default and a static method",
      'interface Greeter {\n  String name();\n\n  default String greet() {\n    return "Hello, " + name();\n  }\n\n  static Greeter of(String n) {\n    return () -> n;\n  }\n}\n\nSystem.out.println(Greeter.of("Asha").greet());',
      [
        "`name()` is the one abstract method.",
        "`greet()` has a default body that uses it.",
        "`Greeter.of` is a static factory on the interface.",
        "The output is `Hello, Asha`.",
      ],
      "java",
    ],
    mistakes: [
      "Calling a static interface method through an implementing object.",
      "Putting too much logic in default methods.",
    ],
    follow: ["What happens when two interfaces have the same default method?"],
    points: [
      "default: inherited body",
      "static: belongs to the interface",
      "Added to evolve interfaces safely",
    ],
    notes:
      "`default` methods let interfaces evolve; `static` methods are called on the interface.",
    src: [
      ["The Java Tutorials: Default Methods", `${T}/IandI/defaultmethods.html`],
      [
        "The Java Tutorials: Static Methods in Interfaces",
        `${T}/IandI/defaultmethods.html`,
      ],
    ],
  }),
  g({
    slug: "diamond-problem-and-default-conflict",
    topic: "Interfaces",
    d: "hard",
    title: "How does Java handle the diamond problem?",
    kw: [
      "diamond problem",
      "multiple inheritance",
      "default method conflict",
      "InterfaceName.super",
      "interfaces",
    ],
    intent:
      "Checks that you know why classes cannot have two parents but interfaces can be combined.",
    short:
      "Java does not allow a class to extend more than one class, which avoids the ambiguity of inheriting the same member from two parents. A class can implement several interfaces, and since Java 8 two interfaces can have a default method with the same signature. In that case the class must override the method and resolve the conflict itself. Inside it, you can choose one parent's version with `InterfaceName.super.method()`. A method defined in a class always wins over an interface's default method.",
    detail: [
      "If the class does not override the conflicting method, the code does not compile.",
      "The rule is: class wins, then the most specific interface, and otherwise you must decide.",
      "State is not inherited from interfaces, which removes the field part of the problem.",
    ],
    ex: "`Bird` and `Fish` both define `default move()`, and `Duck implements Bird, Fish` must override `move()` to say how it moves.",
    code: [
      "Resolving a default conflict",
      'interface Bird { default String move() { return "fly"; } }\ninterface Swimmer { default String move() { return "swim"; } }\n\nclass Duck implements Bird, Swimmer {\n  public String move() {\n    return Bird.super.move() + " and " + Swimmer.super.move();\n  }\n}',
      [
        "Both interfaces give `move` a default body, so `Duck` must override it.",
        "`Bird.super.move()` picks that interface's version explicitly.",
        "`Duck.move()` returns `fly and swim`.",
      ],
      "java",
    ],
    mistakes: [
      "Saying that Java has no multiple inheritance of any kind.",
      "Ignoring the compile error for a default conflict instead of overriding.",
    ],
    follow: ["Which wins: a class method or an interface default?"],
    points: [
      "One class parent only",
      "Conflicting defaults must be overridden",
      "Interface.super.method() chooses one",
    ],
    notes:
      "Conflicting defaults: override and use `Iface.super.method()`. Class methods win.",
    src: [
      [
        "The Java Tutorials: Default Methods (conflicts)",
        `${T}/IandI/defaultmethods.html`,
      ],
      [
        "The Java Tutorials: Multiple Inheritance of State, Implementation, and Type",
        `${T}/IandI/multipleinheritance.html`,
      ],
    ],
  }),
  g({
    slug: "functional-interfaces",
    topic: "Interfaces",
    d: "medium",
    title: "What is a functional interface?",
    kw: [
      "functional interface",
      "@FunctionalInterface",
      "single abstract method",
      "lambda",
      "Runnable",
    ],
    intent: "Checks that you connect interfaces with lambdas.",
    short:
      "A functional interface has exactly one abstract method. It can also have default and static methods. A lambda expression or a method reference can be used wherever a functional interface is expected, because it supplies that one method. `@FunctionalInterface` is optional, but it makes the compiler check the rule. Examples are `Runnable`, `Comparator`, and the interfaces in `java.util.function` such as `Function`, `Predicate` and `Supplier`.",
    detail: [
      "Methods of `Object`, such as `equals`, do not count towards the single abstract method.",
      "You can write your own functional interfaces for domain concepts.",
      "The lambda's parameter and return types come from the interface's method.",
    ],
    ex: "`list.sort((a, b) -> a.age() - b.age())` passes a lambda for the single method of `Comparator`.",
    code: [
      "A custom functional interface",
      "@FunctionalInterface\ninterface Discount {\n  double apply(double price);\n}\n\nDiscount tenPercent = price -> price * 0.9;\nSystem.out.println(tenPercent.apply(200));",
      [
        "`Discount` has one abstract method.",
        "The lambda supplies that method.",
        "The result is `180.0`.",
      ],
      "java",
    ],
    mistakes: [
      "Adding a second abstract method and breaking every lambda that used the interface.",
      "Thinking that a functional interface must have only one method of any kind.",
    ],
    follow: ["Name some interfaces from java.util.function."],
    points: [
      "Exactly one abstract method",
      "Target type for lambdas",
      "@FunctionalInterface checks the rule",
    ],
    notes: "Functional interface = one abstract method; lambdas implement it.",
    src: [
      [
        "The Java Tutorials: Lambda Expressions",
        `${T}/javaOO/lambdaexpressions.html`,
      ],
      [
        "Java SE API: java.util.function",
        "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/function/package-summary.html",
      ],
    ],
  }),
  g({
    slug: "interface-fields-and-marker",
    topic: "Interfaces",
    d: "easy",
    title: "What can an interface contain? What is a marker interface?",
    kw: [
      "interface",
      "constants",
      "marker interface",
      "Serializable",
      "public static final",
    ],
    intent: "Checks the rules for interface members.",
    short:
      "An interface can contain abstract methods, default, static and private methods, constants, and nested types. Its fields are implicitly `public static final`, so they are constants and need a value. Its methods are implicitly `public` unless they are `private`. An interface cannot contain a constructor or instance fields. A marker interface has no methods, such as `Serializable`, and it only tags a class so that code or the runtime can treat it in a particular way.",
    detail: [
      "A class implementing an interface must make its abstract methods `public`.",
      "Annotations now cover many cases where marker interfaces used to be used.",
      "Interfaces can extend other interfaces, and more than one.",
    ],
    ex: "A class marked `Serializable` tells the serialisation mechanism that its objects may be written to a stream.",
    mistakes: [
      "Declaring an interface method without `public` when implementing it.",
      "Putting mutable state in an interface and expecting it to be per object.",
    ],
    follow: ["Can an interface extend another interface?"],
    points: [
      "Constants are public static final",
      "No constructors or instance state",
      "Marker interface has no methods",
    ],
    notes:
      "Interface fields are constants. Marker interface = no methods, just a tag.",
    src: [
      [
        "The Java Tutorials: Defining an Interface",
        `${T}/IandI/interfaceDef.html`,
      ],
      [
        "The Java Tutorials: Implementing an Interface",
        `${T}/IandI/usinginterface.html`,
      ],
    ],
  }),
  g({
    slug: "solid-single-responsibility",
    topic: "SOLID",
    d: "medium",
    title: "What is the Single Responsibility Principle? Give an example.",
    kw: [
      "SOLID",
      "single responsibility",
      "cohesion",
      "reason to change",
      "design",
    ],
    intent: "Checks that you can apply a design principle to real code.",
    short:
      "The Single Responsibility Principle says that a class should have one reason to change, which means it should do one job. A class that both calculates an invoice, saves it to a database and sends an email changes whenever any of those three concerns change. Splitting it into an `InvoiceCalculator`, an `InvoiceRepository` and an `InvoiceMailer` makes each class smaller, easier to test and less likely to break the others.",
    detail: [
      "It is about reasons to change, not about the number of methods.",
      "Too much splitting is also a problem. Group things that change together.",
      "SOLID is a set of design guidelines from the object-oriented design community, and not a language rule.",
    ],
    ex: "A `UserService` that validates, hashes passwords, saves and emails is split so that each part can change on its own.",
    code: [
      "Separate jobs",
      "class InvoiceCalculator {\n  double total(Invoice i) { /* sum the lines */ return 0; }\n}\n\ninterface InvoiceRepository {\n  void save(Invoice i);\n}\n\nclass InvoiceMailer {\n  void send(Invoice i) { /* email it */ }\n}",
      [
        "Each class has one reason to change: pricing, storage or email.",
        "The repository is an interface, so storage can be swapped or faked in tests.",
      ],
      "java",
    ],
    mistakes: [
      "Putting business rules, database code and presentation in one class.",
      "Splitting into so many tiny classes that the flow is hard to follow.",
    ],
    follow: ["How does SRP help testing?"],
    points: ["One reason to change", "Higher cohesion", "Easier testing"],
    notes: "SRP: one class, one reason to change.",
    src: [
      ["The Java Tutorials: What Is a Class?", `${T}/concepts/class.html`],
      [
        "The Java Tutorials: Creating Interfaces",
        `${T}/IandI/createinterface.html`,
      ],
    ],
  }),
  g({
    slug: "solid-open-closed",
    topic: "SOLID",
    d: "medium",
    title: "What is the Open/Closed Principle?",
    kw: ["SOLID", "open closed", "extension", "polymorphism", "strategy"],
    intent: "Checks that you can add behaviour without editing tested code.",
    short:
      "The Open/Closed Principle says that classes should be open for extension but closed for modification: you should be able to add new behaviour without editing existing, tested code. In Java this is usually done with an interface and polymorphism. Instead of a long `if` or `switch` on a type that you must edit for each new case, you add a new class that implements the interface, and the existing code works with it unchanged.",
    detail: [
      "The strategy pattern is a common way to apply it.",
      "It does not mean never changing a class. It means designing the places where change is expected.",
      "Applying it too early can add abstractions you never need.",
    ],
    ex: "A `DiscountPolicy` interface lets the shop add `FestivalDiscount` without editing the checkout code.",
    code: [
      "Add a class instead of editing a switch",
      "interface DiscountPolicy {\n  double apply(double price);\n}\n\nclass NoDiscount implements DiscountPolicy {\n  public double apply(double p) { return p; }\n}\n\nclass FestivalDiscount implements DiscountPolicy {\n  public double apply(double p) { return p * 0.8; }\n}\n\ndouble pay(double price, DiscountPolicy policy) {\n  return policy.apply(price);\n}",
      [
        "`pay` depends on the interface only.",
        "A new discount is a new class, and `pay` does not change.",
      ],
      "java",
    ],
    mistakes: [
      "Growing one `switch` statement for every new type.",
      "Creating abstractions for changes that will never happen.",
    ],
    follow: ["Which design pattern helps here?"],
    points: [
      "Extend, do not modify",
      "Interfaces and polymorphism",
      "Apply where change is expected",
    ],
    notes:
      "OCP: add new classes behind an interface instead of editing a switch.",
    src: [
      ["The Java Tutorials: Polymorphism", `${T}/IandI/polymorphism.html`],
      ["The Java Tutorials: Interfaces", `${T}/IandI/createinterface.html`],
    ],
  }),
  g({
    slug: "solid-liskov-substitution",
    topic: "SOLID",
    d: "hard",
    title:
      "What is the Liskov Substitution Principle? What is a classic violation?",
    kw: ["SOLID", "Liskov", "substitution", "subtype", "Square Rectangle"],
    intent:
      "Checks that you understand that a subclass must keep its parent's promises.",
    short:
      "The Liskov Substitution Principle says that an object of a subclass must be usable wherever its superclass is expected, without breaking the correctness of the program. The subclass must keep the promises of the parent: it should not demand more from callers, give less in return, or throw unexpected exceptions. The classic violation is a `Square` that extends `Rectangle`: code that sets the width and height separately and expects the area to be width times height fails when it gets a square.",
    detail: [
      "A subclass that overrides a method to throw `UnsupportedOperationException` is a warning sign.",
      "A real is-a relationship in speech is not enough. The behaviour has to be substitutable.",
      "Prefer composition or a common interface, such as `Shape`, when substitution does not hold.",
    ],
    ex: "A method that resizes a `Rectangle` to 4 by 5 and expects an area of 20 breaks when it receives a `Square`.",
    code: [
      "A substitution that breaks",
      "class Rectangle {\n  protected int w, h;\n  void setWidth(int w) { this.w = w; }\n  void setHeight(int h) { this.h = h; }\n  int area() { return w * h; }\n}\n\nclass Square extends Rectangle {\n  @Override void setWidth(int w) { this.w = w; this.h = w; }\n  @Override void setHeight(int h) { this.w = h; this.h = h; }\n}\n\nRectangle r = new Square();\nr.setWidth(4);\nr.setHeight(5);\nSystem.out.println(r.area());",
      [
        "The code expects `4 * 5 = 20` from any `Rectangle`.",
        "A `Square` forces both sides to be equal, so the result is `25`.",
        "The subclass broke the parent's expected behaviour.",
      ],
      "java",
    ],
    mistakes: [
      'Choosing inheritance only because "a square is a rectangle" in maths.',
      "Overriding methods to disable them.",
    ],
    follow: ["How would you redesign Rectangle and Square?"],
    points: [
      "Subclasses must keep the parent's contract",
      "Watch for overrides that throw or restrict",
      "Fix with a common interface or composition",
    ],
    notes:
      "LSP: a subclass must be usable anywhere the parent is. Square/Rectangle is the classic break.",
    src: [
      ["The Java Tutorials: Inheritance", `${T}/IandI/subclasses.html`],
      [
        "The Java Tutorials: Overriding and Hiding Methods",
        `${T}/IandI/override.html`,
      ],
    ],
  }),
  g({
    slug: "solid-interface-segregation",
    topic: "SOLID",
    d: "medium",
    title: "What is the Interface Segregation Principle?",
    kw: [
      "SOLID",
      "interface segregation",
      "fat interface",
      "small interfaces",
      "implementation",
    ],
    intent: "Checks that you design small, focused interfaces.",
    short:
      "The Interface Segregation Principle says that no class should be forced to depend on or implement methods it does not use. A large interface with many unrelated methods makes implementers write empty or exception-throwing methods. The fix is to split it into small, focused interfaces, such as `Readable` and `Writable`, so that each class implements only the roles it really has, and each client depends only on the methods it calls.",
    detail: [
      "A class can implement several small interfaces, so splitting costs little in Java.",
      "A `read-only` consumer should accept a read interface, not the full one.",
      "The Java library is an example: `Comparable`, `Iterable` and `Closeable` each describe one small capability.",
    ],
    ex: "A `ReportExporter` that needs only `save` depends on a `Storage` interface with that one method, and not on a large file-manager interface.",
    code: [
      "Split a fat interface",
      'interface Reader { String read(String id); }\ninterface Writer { void write(String id, String data); }\n\nclass CacheView implements Reader {\n  public String read(String id) { return "cached " + id; }\n}\n\nclass Database implements Reader, Writer {\n  public String read(String id) { return "row " + id; }\n  public void write(String id, String data) { /* save */ }\n}',
      [
        "`CacheView` is read-only, so it implements only `Reader`.",
        "`Database` supports both and implements both.",
        "No class has an empty or unsupported method.",
      ],
      "java",
    ],
    mistakes: [
      "Implementing a large interface with methods that throw `UnsupportedOperationException`.",
      "Creating one interface for the whole service layer.",
    ],
    follow: ["How does ISP relate to SRP?"],
    points: [
      "Small, focused interfaces",
      "No forced unused methods",
      "Clients depend on what they use",
    ],
    notes: "ISP: many small interfaces beat one fat interface.",
    src: [
      [
        "The Java Tutorials: Defining an Interface",
        `${T}/IandI/interfaceDef.html`,
      ],
      [
        "The Java Tutorials: Implementing an Interface",
        `${T}/IandI/usinginterface.html`,
      ],
    ],
  }),
  g({
    slug: "solid-dependency-inversion",
    topic: "SOLID",
    d: "hard",
    title:
      "What is the Dependency Inversion Principle, and how does it relate to dependency injection?",
    kw: [
      "SOLID",
      "dependency inversion",
      "dependency injection",
      "abstraction",
      "constructor injection",
    ],
    intent:
      "Checks that you can separate a principle from the technique that supports it.",
    short:
      "The Dependency Inversion Principle says that high-level code should depend on abstractions, such as interfaces, and not on concrete low-level classes. An `OrderService` should depend on a `PaymentGateway` interface, not on `StripeGateway`. Dependency injection is a technique that supports it: the object does not create its dependencies with `new`, they are handed to it, usually through the constructor. A framework such as Spring can do the injection, but plain Java can do it too.",
    detail: [
      "The result is that you can swap implementations and test with fakes.",
      "Constructor injection makes the dependencies clear and the fields `final`.",
      "The principle is the design rule, and injection and frameworks are ways to apply it.",
    ],
    ex: "In a test, `OrderService` receives a `FakeGateway` that records calls, and in production it receives the real gateway.",
    code: [
      "Depend on an interface, inject it",
      "interface PaymentGateway {\n  boolean charge(double amount);\n}\n\nclass OrderService {\n  private final PaymentGateway gateway;\n\n  OrderService(PaymentGateway gateway) {\n    this.gateway = gateway;\n  }\n\n  boolean checkout(double total) {\n    return gateway.charge(total);\n  }\n}",
      [
        "`OrderService` knows only the interface.",
        "The implementation is passed in through the constructor.",
        "A test can pass a fake gateway without any network call.",
      ],
      "java",
    ],
    mistakes: [
      "Creating dependencies with `new` inside the class, which makes it hard to test.",
      "Confusing the principle with the dependency injection framework.",
    ],
    follow: ["Why is constructor injection preferred?"],
    points: [
      "Depend on abstractions",
      "Dependency injection supplies them",
      "Enables fakes in tests",
    ],
    notes:
      "DIP: depend on interfaces. DI: pass dependencies in, usually via the constructor.",
    src: [
      [
        "The Java Tutorials: What Is an Interface?",
        `${T}/concepts/interface.html`,
      ],
      [
        "The Java Tutorials: Providing Constructors",
        `${T}/javaOO/constructors.html`,
      ],
    ],
  }),
])
