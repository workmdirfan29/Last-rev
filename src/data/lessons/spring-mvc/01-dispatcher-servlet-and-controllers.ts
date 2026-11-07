import { defineLesson } from "@/data/lessons/author"

export default defineLesson("spring-mvc", {
  slug: "dispatcher-servlet-and-controllers",
  title: "How a request is handled: DispatcherServlet and controllers",
  topic: "Controllers",
  minutes: 70,
  overview:
    "Follow a request through Spring MVC, write controllers with the right annotations, and know where filters and interceptors run.",
  objectives: [
    "Describe the DispatcherServlet request flow",
    "Choose between @Controller and @RestController",
    "Explain filters versus interceptors, and data binding",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "The front controller",
      body: [
        "Spring MVC is built on the **front controller** pattern. The **`DispatcherServlet`** receives every request first. It asks the **`HandlerMapping`** which controller method should handle the request, and calls it through a **`HandlerAdapter`**, which resolves the method's arguments, such as path variables and the request body. The controller returns a view name or a body. For a view, the **`ViewResolver`** finds the template and renders it. For a REST response, an **`HttpMessageConverter`** writes the returned object as JSON. Exceptions are given to `HandlerExceptionResolver` beans, such as the one that handles `@ExceptionHandler`.",
        "Spring Boot configures and registers the `DispatcherServlet` for you. **Filters** run before the `DispatcherServlet`, at the servlet level, and **interceptors** run inside it, around the handler, and know which handler will run. Spring Security is a chain of filters.",
      ],
    },
    {
      kind: "explain",
      heading: "@Controller and @RestController",
      body: [
        "`@Controller` marks a web class whose handler methods normally return a **view name**, which the view resolver turns into an HTML page. `@RestController` is `@Controller` plus `@ResponseBody`: the return value of every method is written straight to the response body by a message converter, with no view. Use `@Controller` for server-rendered pages, and `@RestController` for APIs.",
        "A handler method can declare many arguments, and Spring resolves them: annotated values such as `@PathVariable`, `@RequestParam`, `@RequestHeader` and `@RequestBody`, and objects such as `Principal`, `Locale` and `Model`. It can return a view name, an object, a `ResponseEntity`, or `void`.",
      ],
    },
    {
      kind: "code",
      heading: "A view and a JSON response",
      example: {
        title: "Two kinds of controller",
        language: "java",
        code: '@Controller\nclass PageController {\n  @GetMapping("/orders")\n  String page(Model model) {\n    model.addAttribute("title", "Orders");\n    return "orders";            // a view name\n  }\n\n  @PostMapping("/orders")\n  String create(@ModelAttribute OrderForm form, RedirectAttributes redirect) {\n    // save the order\n    redirect.addFlashAttribute("message", "Order created");\n    return "redirect:/orders";   // Post/Redirect/Get\n  }\n}\n\n@RestController\nclass OrderApi {\n  @GetMapping("/api/orders/{id}")\n  OrderDto get(@PathVariable long id) {\n    return new OrderDto(id, "PAID");   // written as JSON\n  }\n}',
        walkthrough: [
          "`PageController` returns a view name, and a template is rendered.",
          "After a successful form post, the method returns `redirect:/orders`, so that a browser refresh does not submit the form again. This is the Post/Redirect/Get pattern.",
          "`OrderApi` returns an object, and a message converter writes JSON.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Filters, interceptors and data binding",
      body: [
        "A servlet **`Filter`** is part of the container. It sees the raw request and response of every request, including static resources, and suits low-level concerns: request logging, security, compression. A **`HandlerInterceptor`** is part of Spring MVC, with `preHandle`, `postHandle` and `afterCompletion`, and it knows the handler, which suits logic that depends on which controller method runs. `preHandle` can stop the request by returning `false`.",
        "For form submissions and query parameters, Spring creates an object of the parameter's type and **binds** the request parameters to its properties by name. `@ModelAttribute` makes this explicit. Spring converts text to numbers, dates and your own types with registered converters. Bind to a **form object or DTO**, and not to an entity, because a client could set fields it must not control. `@RequestBody` is different: it converts a JSON body with a message converter, not by parameter names.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Describing the controller as the first thing that receives the request.",
          fix: "The DispatcherServlet and the filters come first.",
        },
        {
          mistake:
            "Using `@Controller` for an API and getting a view-not-found error.",
          fix: "Use `@RestController`.",
        },
        {
          mistake: "Binding request parameters directly to an entity.",
          fix: "Use a form object or a DTO.",
        },
        {
          mistake: "Mixing up filters and interceptors.",
          fix: "Filters are servlet-level, interceptors are MVC-level.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A request id on every call",
      scenario:
        "Every request should get a correlation id that appears in all logs.",
      body: [
        "A servlet filter reads or creates the id and stores it in the logging context for the whole request, including security and static resources. An interceptor, in contrast, would be used to time only the controller methods.",
        "Choosing the right layer makes the behaviour apply to the right requests.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "dc-front",
      prompt: "Which component receives every request first in Spring MVC?",
      options: ["DispatcherServlet", "The controller", "The ViewResolver"],
      answer: 0,
      explanation: "It is the front controller.",
    },
    {
      type: "single",
      id: "dc-rest",
      prompt: "@RestController is equal to...",
      options: [
        "@Controller + @ResponseBody",
        "@Component + @Service",
        "@Controller only",
      ],
      answer: 0,
      explanation: "Return values are written to the body.",
    },
    {
      type: "truefalse",
      id: "dc-filter",
      statement:
        "A servlet filter runs inside the DispatcherServlet, around the handler.",
      answer: false,
      explanation: "Filters run before it. Interceptors run inside it.",
    },
    {
      type: "blank",
      id: "dc-prg",
      prompt:
        "After a successful form POST, return `redirect:/orders` to follow the Post/___/Get pattern.",
      answer: "Redirect",
      explanation: "It prevents a duplicate submission on refresh.",
    },
  ],
  assignment: {
    title: "Two controllers",
    task: [
      "Build a page controller with a form that uses Post/Redirect/Get, and a REST controller returning JSON.",
      "Add a filter that logs a request id and an interceptor that times the handler, and show the order in the log.",
    ],
    checklist: [
      "The form does not resubmit on refresh",
      "The filter and interceptor both run",
      "No entity is bound directly",
    ],
    minutes: 25,
  },
  exercises: [
    {
      slug: "dc-ex",
      title: "Fix the controller type",
      task: [
        "This class should return JSON but returns view names and fails. Fix it with one annotation change.\n",
      ],
      language: "java",
      starter:
        '@Controller\nclass StatusController {\n  @GetMapping("/api/status")\n  StatusDto status() {\n    return new StatusDto("ok");\n  }\n}',
      solution:
        '@RestController\nclass StatusController {\n  @GetMapping("/api/status")\n  StatusDto status() {\n    return new StatusDto("ok");\n  }\n}',
      hints: [
        "Return values of an API controller are written to the response body.",
      ],
      checklist: [
        "The class uses @RestController",
        "The method is unchanged",
        "The response is JSON",
      ],
    },
  ],
  revisionNotes: [
    "DispatcherServlet → HandlerMapping → HandlerAdapter → controller → view or message converter",
    "@Controller returns views; @RestController returns bodies",
    "Filter: servlet level; interceptor: MVC level and knows the handler",
    "Bind forms to DTOs; Post/Redirect/Get after a form POST",
  ],
  resources: [
    {
      label: "Spring Framework Reference: DispatcherServlet",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html",
    },
    {
      label: "Spring Framework Reference: Annotated Controllers",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann.html",
    },
    {
      label: "Spring Framework Reference: Interception",
      url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet/handlermapping-interceptor.html",
    },
  ],
})
