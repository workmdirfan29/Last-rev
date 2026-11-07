import { defineQuestions } from "../author"
import { g } from "../brief"

const MS = "https://learn.microsoft.com/en-us/azure/architecture/microservices"
const PAT = "https://learn.microsoft.com/en-us/azure/architecture/patterns"
const SB = "https://docs.spring.io/spring-boot/reference"
const K8S = "https://kubernetes.io/docs"

export default defineQuestions("microservices", "fresher", [
  g({
    slug: "what-are-microservices",
    topic: "Boundaries",
    d: "easy",
    title: "What are microservices, and how do they differ from a monolith?",
    kw: ["microservices", "monolith", "independent deployment", "service boundaries", "distributed system"],
    intent: "Checks that you can describe both styles fairly, with their costs.",
    short:
      "A microservices architecture splits an application into small services, each built around one business capability, owning its own data, and deployed and scaled independently, communicating over the network through APIs or messages. A monolith is one deployable unit with one codebase and usually one database. Microservices allow independent releases, scaling and technology choices per team, but they add the complexity of a distributed system: network failures, data consistency across services, harder testing and more operations work. A monolith is simpler to build and run, and is often the right start.",
    detail: [
      "A small team with one product often moves faster with a well-structured monolith.",
      "Splitting by technical layer, instead of by business capability, gives a distributed monolith, which has the costs of both styles.",
      "Each service should be able to change and deploy without coordinating with the others.",
    ],
    ex: "An online shop has separate catalogue, orders and payments services, each with its own database and release cycle.",
    mistakes: [
      "Saying that microservices are always better than a monolith.",
      "Splitting too early, before the domain is understood.",
    ],
    follow: ["When would you not use microservices?"],
    points: [
      "Small, independently deployable services",
      "Each owns its data",
      "Trade-off: autonomy versus distributed-system complexity",
    ],
    notes: "Microservices = independent, business-aligned services with their own data. Costs: distribution, consistency, operations.",
    src: [
      ["Microsoft Learn: Microservices architecture style", "https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices"],
      ["Microsoft Learn: Building microservices", `${MS}/index`],
    ],
  }),
  g({
    slug: "service-boundaries-domain-driven",
    topic: "Boundaries",
    d: "medium",
    title: "How do you decide the boundaries of a microservice?",
    kw: ["bounded context", "domain-driven design", "business capability", "cohesion", "coupling"],
    intent: "Checks that you split by business meaning and not by technical layers.",
    short:
      "Start from the business domain, not the technology. Domain-driven design offers the bounded context: a part of the domain inside which the terms and rules are consistent. A service usually maps to one bounded context or one business capability, such as ordering or inventory. A good boundary has high cohesion, so things that change together stay together, and low coupling, so a change in one service rarely needs a change in another. Warning signs of a wrong boundary are services that must always be changed and deployed together, or that call each other constantly.",
    detail: [
      "The same word can mean different things in different contexts, for example a \"customer\" in billing and in support.",
      "Event storming and domain analysis workshops help to find the boundaries.",
      "Boundaries can be changed, so it is safer to start with fewer, larger services and split later.",
    ],
    ex: "Shipping and billing both need an address, but they are separate contexts, and each keeps the data that it needs.",
    mistakes: [
      "Creating one service per database table.",
      "Splitting by layer, such as a \"data service\" and a \"UI service\".",
    ],
    follow: ["What is a bounded context?"],
    points: [
      "Boundaries follow the domain",
      "High cohesion, low coupling",
      "Wrong boundaries show up as constant joint changes",
    ],
    notes: "Service = bounded context / business capability. Split by domain, not by layer or table.",
    src: [
      ["Microsoft Learn: Using domain analysis to model microservices", `${MS}/model/domain-analysis`],
      ["Microsoft Learn: Building microservices", `${MS}/index`],
    ],
  }),
  g({
    slug: "distributed-monolith",
    topic: "Boundaries",
    d: "medium",
    title: "What is a distributed monolith and how do you recognise one?",
    kw: ["distributed monolith", "tight coupling", "shared database", "synchronous chain", "deployment coupling"],
    intent: "Checks that you know the most common failure of microservice adoption.",
    short:
      "A distributed monolith is a system split into several services that are still tightly coupled, so it has the operational cost of microservices without their benefits. Signs are: services that must be released together, a shared database that several services write to, long chains of synchronous calls where one failure breaks everything, and one change that needs edits in many services. The causes are usually wrong boundaries and shared data. The fix is to merge services that always change together, give each service its own data, and use asynchronous messages where a synchronous dependency is not needed.",
    detail: [
      "A shared database creates hidden coupling, because a schema change breaks every service that uses it.",
      "A \"release train\" that deploys all services at once is a warning sign.",
      "Merging services back is a valid decision, not a failure.",
    ],
    ex: "Five services read and write the same `orders` table, so none can change the table without the others.",
    mistakes: [
      "Sharing one database between services for convenience.",
      "Counting the number of services as a measure of success.",
    ],
    follow: ["Why is a shared database a problem?"],
    points: [
      "Services that cannot change or deploy alone",
      "Shared database, long synchronous chains",
      "Fix: right boundaries, own data, async where possible",
    ],
    notes: "Distributed monolith = coupled services. Signs: joint releases, shared database, chained sync calls.",
    src: [
      ["Microsoft Learn: Data considerations for microservices", `${MS}/design/data-considerations`],
      ["Microsoft Learn: Microservices architecture style", "https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices"],
    ],
  }),
  g({
    slug: "database-per-service",
    topic: "Data consistency & per-service databases",
    d: "medium",
    title: "Why does each microservice own its database, and how do services get data from each other?",
    kw: ["database per service", "data ownership", "API access", "data duplication", "eventual consistency"],
    intent: "Checks that you protect autonomy by keeping data private.",
    short:
      "Each service should own its data and be the only one that reads and writes it directly. Other services get the data through the owner's API or by consuming the events that it publishes. This lets a service change its schema, or even its database technology, without breaking others, and lets it scale independently. The price is that you cannot join across services with a single SQL query, and consistency across services becomes eventual. A service may keep a local copy of the data it needs from another service, updated from events, to avoid calling it on every request.",
    detail: [
      "\"Own\" can mean a separate schema or a separate database server, but not shared tables.",
      "A duplicated copy must have a clear owner, so there is one source of truth.",
      "Reporting needs a different approach, such as a read model or a data warehouse fed by events.",
    ],
    ex: "The orders service keeps a small copy of the customer's name, updated from `CustomerRenamed` events, and never reads the customers database.",
    mistakes: [
      "Letting a second service read another service's tables directly.",
      "Duplicating data without deciding who owns it.",
    ],
    follow: ["How do you build a report that spans services?"],
    points: [
      "Only the owner touches its data",
      "Others use the API or events",
      "Consistency across services is eventual",
    ],
    notes: "Database per service: private data, access through API or events, no cross-service joins.",
    src: [
      ["Microsoft Learn: Data considerations for microservices", `${MS}/design/data-considerations`],
      ["Microsoft Learn: Interservice communication", `${MS}/design/interservice-communication`],
    ],
  }),
  g({
    slug: "sync-vs-async-communication",
    topic: "Communication",
    d: "medium",
    title: "When do you use synchronous calls and when asynchronous messaging between services?",
    kw: ["synchronous", "asynchronous", "REST", "message broker", "temporal coupling"],
    intent: "Checks that you choose by the need for an immediate answer and by failure behaviour.",
    short:
      "Synchronous communication, such as HTTP or gRPC, is simple and gives an immediate answer, so it suits queries and steps where the caller needs the result now. Its drawback is temporal coupling: the caller waits, and if the other service is slow or down, the caller is affected. Asynchronous messaging, with a broker and queues or topics, decouples the services in time. The sender continues without waiting, and the receiver processes the message when it can, which gives better resilience and smoother load handling, but the design is more complex, and the result arrives later. Many systems use both.",
    detail: [
      "Use events to announce facts, such as `OrderPlaced`, and commands to ask for an action.",
      "Messages can be delivered more than once, so consumers must be idempotent.",
      "A long chain of synchronous calls multiplies the failure probability and the latency.",
    ],
    ex: "The checkout asks the pricing service for a price synchronously, and publishes `OrderPlaced` for shipping and email to handle asynchronously.",
    mistakes: [
      "Making every interaction a synchronous REST call.",
      "Using messaging for a request that needs an immediate answer.",
    ],
    follow: ["What does idempotent mean for a consumer?"],
    points: [
      "Sync: simple, immediate, temporally coupled",
      "Async: decoupled, resilient, more complex",
      "Combine both",
    ],
    notes: "Sync when you need the answer now; async to decouple in time. Consumers must be idempotent.",
    src: [
      ["Microsoft Learn: Interservice communication in microservices", `${MS}/design/interservice-communication`],
      ["Microsoft Learn: Competing Consumers pattern", `${PAT}/competing-consumers`],
    ],
  }),
  g({
    slug: "rest-client-in-spring",
    topic: "Communication",
    d: "easy",
    title: "How does one Spring service call another over HTTP? (`RestClient`, `WebClient`, OpenFeign)",
    kw: ["RestClient", "WebClient", "OpenFeign", "HTTP client", "timeout"],
    intent: "Checks that you know the clients and the need for timeouts.",
    short:
      "Spring offers several HTTP clients. `RestClient`, added in Spring 6.1, is a synchronous client with a fluent API and the modern replacement for `RestTemplate`. `WebClient` is the non-blocking, reactive client. Spring Cloud OpenFeign lets you declare an interface with annotations, and generates the client. Whichever you use, always set connection and read timeouts, because a call without a timeout can wait for a long time and block threads, and handle errors and failed responses explicitly. Use service names or a configured base URL, not addresses that are hard-coded in the code.",
    detail: [
      "A client bean is configured once with the base URL, the timeouts and any default headers.",
      "Treat every remote call as something that can fail.",
      "Add retries and a circuit breaker with care, and only for calls that are safe to repeat.",
    ],
    ex: "The orders service uses a `RestClient` bean for the pricing service with a 2-second timeout.",
    code: [
      "A RestClient call",
      "@Bean\nRestClient pricingClient(RestClient.Builder builder) {\n  return builder.baseUrl(\"http://pricing-service\").build();\n}\n\nPrice price(RestClient pricingClient, long productId) {\n  return pricingClient.get()\n      .uri(\"/prices/{id}\", productId)\n      .retrieve()\n      .body(Price.class);\n}",
      [
        "The base URL is configured once, as a service name.",
        "`retrieve().body(...)` makes the call and converts the JSON.",
        "A non-2xx response raises an exception that the caller must handle.",
      ],
      "java",
    ],
    mistakes: [
      "Calling another service without a timeout.",
      "Hard-coding addresses of other services.",
    ],
    follow: ["Why are timeouts essential?"],
    points: [
      "RestClient (sync), WebClient (reactive), OpenFeign (declarative)",
      "Always set timeouts",
      "Handle failures",
    ],
    notes: "Use `RestClient`/`WebClient`/OpenFeign with timeouts and explicit error handling.",
    src: [
      ["Spring Framework Reference: REST Clients", "https://docs.spring.io/spring-framework/reference/integration/rest-clients.html"],
      ["Spring Cloud OpenFeign Reference", "https://docs.spring.io/spring-cloud-openfeign/reference/index.html"],
    ],
  }),
  g({
    slug: "messaging-with-kafka-or-queues",
    topic: "Communication",
    d: "medium",
    title: "What is a message broker and how is it used between services?",
    kw: ["message broker", "Kafka", "topic", "consumer group", "at-least-once"],
    intent: "Checks that you understand the role of a broker and the delivery guarantees.",
    short:
      "A message broker is infrastructure that receives messages from producers and delivers them to consumers, so that the two do not need to be available at the same time. A queue gives each message to one consumer, which balances work. A topic, as in Kafka, can be read by many independent consumer groups, each getting every message. Most brokers guarantee at-least-once delivery, which means that a message can arrive twice, so consumers must handle duplicates safely, for example by recording processed message ids. Spring supports brokers through projects such as Spring for Apache Kafka.",
    detail: [
      "Ordering is usually guaranteed only within a partition or a queue, not globally.",
      "A message that keeps failing should go to a dead-letter queue, so it does not block the others.",
      "Message formats need a versioning plan, because producers and consumers change at different times.",
    ],
    ex: "The orders service publishes `OrderPlaced` to a topic, and the shipping and email services each consume it independently.",
    mistakes: [
      "Assuming that every message is delivered exactly once.",
      "Letting one bad message block a consumer forever.",
    ],
    follow: ["What is a dead-letter queue?"],
    points: [
      "Decouples producers and consumers in time",
      "At-least-once → idempotent consumers",
      "Dead-letter handling for bad messages",
    ],
    notes: "Broker = queue/topic between services. At-least-once delivery, so make consumers idempotent.",
    src: [
      ["Spring Boot Reference: Apache Kafka Support", `${SB}/messaging/kafka.html`],
      ["Microsoft Learn: Competing Consumers pattern", `${PAT}/competing-consumers`],
    ],
  }),
  g({
    slug: "idempotent-consumers",
    topic: "Communication",
    d: "hard",
    title: "What does it mean for an operation or a consumer to be idempotent, and how do you achieve it?",
    kw: ["idempotency", "idempotency key", "duplicate message", "retry", "deduplication"],
    intent: "Checks that you can make retries and redeliveries safe.",
    short:
      "An operation is idempotent when doing it several times has the same effect as doing it once. Networks and brokers fail and retry, so a request or message can arrive more than once, and a non-idempotent handler would, for example, charge a customer twice. To achieve it, give every request or message a unique id, an idempotency key, and have the receiver record the ids that it has processed, in the same transaction as the business change, and skip repeats. Some operations are naturally idempotent, such as setting a status to `SHIPPED`, while \"add 10 to the balance\" is not.",
    detail: [
      "Keep the processed-id record for as long as duplicates can arrive.",
      "A unique database constraint on the id is a reliable way to detect a repeat.",
      "HTTP `PUT` and `DELETE` are defined as idempotent, and `POST` is not, unless the API adds a key.",
    ],
    ex: "A payment API accepts an `Idempotency-Key` header, and a repeated request returns the first result without charging again.",
    code: [
      "Skip a message that was already processed",
      "@Transactional\nvoid handle(OrderPlaced event) {\n  try {\n    processedMessages.save(new ProcessedMessage(event.messageId()));   // unique id\n  } catch (DataIntegrityViolationException duplicate) {\n    return;                                                             // already handled\n  }\n  shipping.createShipment(event.orderId());\n}",
      [
        "The message id is stored first, with a unique constraint.",
        "A duplicate violates the constraint and is ignored.",
        "The record and the business change are in the same transaction.",
      ],
      "java",
    ],
    mistakes: [
      "Assuming that retries are harmless without checking the handler.",
      "Recording the id in a different transaction from the business change.",
    ],
    follow: ["Which HTTP methods are idempotent?"],
    points: [
      "Same effect once or many times",
      "Unique message or request id",
      "Record the id in the same transaction",
    ],
    notes: "Idempotency = safe repeats. Use unique ids and record them transactionally.",
    src: [
      ["Microsoft Learn: Interservice communication in microservices", `${MS}/design/interservice-communication`],
      ["Microsoft Learn: Retry pattern", `${PAT}/retry`],
    ],
  }),
  g({
    slug: "what-is-resilience",
    topic: "Resilience",
    d: "easy",
    title: "Why is resilience important in microservices, and what are the main techniques?",
    kw: ["resilience", "timeout", "retry", "circuit breaker", "bulkhead"],
    intent: "Checks that you design for failure of other services.",
    short:
      "In a distributed system, other services and the network will fail or be slow, so each service must protect itself and its callers. The main techniques are timeouts, so that a call does not wait forever; retries, with backoff, for temporary failures; a circuit breaker, which stops calling a service that keeps failing and gives it time to recover; a bulkhead, which limits the resources that one dependency can use, so that its problems do not take down everything; and fallbacks, which return a default or cached answer. Health checks let the platform replace unhealthy instances.",
    detail: [
      "Combine the techniques, because each one covers a different failure mode.",
      "Retries without a limit or backoff can make an outage worse.",
      "Test failure on purpose, for example by stopping a dependency in a test environment.",
    ],
    ex: "When the recommendations service is down, the product page still loads, and shows a default list.",
    mistakes: [
      "Assuming that remote calls always succeed quickly.",
      "Adding retries to calls that are not idempotent.",
    ],
    follow: ["What is a circuit breaker?"],
    points: [
      "Timeouts, retries, circuit breakers, bulkheads, fallbacks",
      "Design for partial failure",
      "Test failure",
    ],
    notes: "Resilience toolbox: timeout, retry with backoff, circuit breaker, bulkhead, fallback.",
    src: [
      ["Microsoft Learn: Circuit Breaker pattern", `${PAT}/circuit-breaker`],
      ["Microsoft Learn: Bulkhead pattern", `${PAT}/bulkhead`],
    ],
  }),
  g({
    slug: "circuit-breaker-pattern",
    topic: "Resilience",
    d: "medium",
    title: "How does the circuit breaker pattern work?",
    kw: ["circuit breaker", "closed", "open", "half-open", "failure threshold"],
    intent: "Checks that you know the three states and why it protects the system.",
    short:
      "A circuit breaker wraps a call to another service and counts failures. In the closed state, calls pass through normally. When failures reach a threshold, the breaker opens, and calls fail immediately, or return a fallback, without contacting the failing service, which saves resources and lets the service recover. After a wait time, the breaker goes half-open and lets a few trial calls through: if they succeed, it closes again, and if they fail, it opens again. It prevents a slow or broken dependency from using up all the threads of its callers.",
    detail: [
      "In Spring, Spring Cloud Circuit Breaker provides an abstraction that works with libraries such as Resilience4j.",
      "The thresholds and wait times must be tuned to the real behaviour of the dependency.",
      "An open circuit should be visible in monitoring.",
    ],
    ex: "After 10 failed calls in a row to the payment service, orders return a \"payments unavailable\" message immediately for 30 seconds.",
    code: [
      "A circuit breaker with a fallback",
      "@Service\nclass PriceClient {\n  private final CircuitBreakerFactory<?, ?> factory;\n  private final RestClient client;\n\n  PriceClient(CircuitBreakerFactory<?, ?> factory, RestClient client) {\n    this.factory = factory;\n    this.client = client;\n  }\n\n  Price price(long id) {\n    return factory.create(\"pricing\").run(\n        () -> client.get().uri(\"/prices/{id}\", id).retrieve().body(Price.class),\n        throwable -> Price.unknown(id));      // fallback\n  }\n}",
      [
        "The call is run inside a named circuit breaker.",
        "When the circuit is open or the call fails, the fallback returns a safe value.",
        "The breaker counts failures and changes state automatically.",
      ],
      "java",
    ],
    mistakes: [
      "Using a fallback that hides serious errors from monitoring.",
      "Leaving the default thresholds without checking them.",
    ],
    follow: ["What is the half-open state?"],
    points: [
      "Closed → open → half-open",
      "Fail fast while open",
      "Trial calls decide whether to close",
    ],
    notes: "Circuit breaker: count failures, open to fail fast, half-open to test recovery.",
    src: [
      ["Microsoft Learn: Circuit Breaker pattern", `${PAT}/circuit-breaker`],
      ["Spring Cloud Circuit Breaker Reference", "https://docs.spring.io/spring-cloud-circuitbreaker/reference/index.html"],
    ],
  }),
  g({
    slug: "retry-with-backoff",
    topic: "Resilience",
    d: "medium",
    title: "How should retries be designed, and what are the dangers?",
    kw: ["retry", "exponential backoff", "jitter", "retry storm", "transient fault"],
    intent: "Checks that you retry only what is safe and in a way that does not make an outage worse.",
    short:
      "Retries are useful for transient faults, such as a brief network problem, but only for operations that are safe to repeat, which means idempotent ones. A good retry has a small maximum number of attempts, waits between attempts with exponential backoff, which means longer waits each time, and adds random jitter, so that many clients do not retry at the same moment. Retries without limits, or in several layers of a call chain, multiply the load on a struggling service and can cause a retry storm. Do not retry errors that cannot succeed, such as a `400` response.",
    detail: [
      "Combine retries with a timeout for each attempt and a circuit breaker.",
      "Retry in one layer only, usually near the caller of the remote service.",
      "Log the retries, so that they can be seen in monitoring.",
    ],
    ex: "A client retries a failed `GET` up to three times, waiting 200 ms, 400 ms and 800 ms plus a random delay.",
    mistakes: [
      "Retrying non-idempotent operations such as a payment.",
      "Retrying immediately and without limit.",
    ],
    follow: ["What is a retry storm?"],
    points: [
      "Only for transient faults and idempotent calls",
      "Limited attempts, exponential backoff, jitter",
      "One layer, with a circuit breaker",
    ],
    notes: "Retry transient faults a few times with backoff and jitter; only idempotent calls.",
    src: [
      ["Microsoft Learn: Retry pattern", `${PAT}/retry`],
      ["Microsoft Learn: Circuit Breaker pattern", `${PAT}/circuit-breaker`],
    ],
  }),
  g({
    slug: "bulkhead-and-timeouts",
    topic: "Resilience",
    d: "medium",
    title: "What is the bulkhead pattern and why are timeouts so important?",
    kw: ["bulkhead", "thread pool isolation", "timeout", "cascading failure", "resource isolation"],
    intent: "Checks that you can stop one slow dependency from exhausting everything.",
    short:
      "The bulkhead pattern isolates resources, such as thread pools or connection pools, for different dependencies, like the compartments of a ship, so that a problem with one dependency uses up only its own share and the rest of the service keeps working. Timeouts are the simplest defence of all: without one, a slow dependency makes threads wait for a very long time, the threads run out, and the failure spreads to the callers, which is a cascading failure. Every remote call needs a timeout shorter than the timeout of whoever is waiting for it.",
    detail: [
      "Give the timeouts a budget: the sum of the calls in a chain must fit inside the first caller's timeout.",
      "A semaphore or a separate pool per dependency limits concurrency.",
      "Resource limits and monitoring show which compartment is full.",
    ],
    ex: "Calls to the slow reporting service use their own small pool, so they cannot take threads from the checkout flow.",
    mistakes: [
      "One shared thread pool for all remote calls.",
      "A timeout of the callee that is longer than the timeout of its caller.",
    ],
    follow: ["What is a cascading failure?"],
    points: [
      "Separate resource pools per dependency",
      "Timeouts stop threads waiting forever",
      "Timeout budget along the call chain",
    ],
    notes: "Bulkhead = separate pools per dependency. Every remote call needs a timeout.",
    src: [
      ["Microsoft Learn: Bulkhead pattern", `${PAT}/bulkhead`],
      ["Microsoft Learn: Interservice communication in microservices", `${MS}/design/interservice-communication`],
    ],
  }),
  g({
    slug: "what-is-saga",
    topic: "Saga",
    d: "hard",
    title: "What is the saga pattern and why is it used instead of a distributed transaction?",
    kw: ["saga", "distributed transaction", "compensating transaction", "eventual consistency", "two-phase commit"],
    intent: "Checks that you know how to keep business data consistent across services.",
    short:
      "Each service has its own database, so one ACID transaction cannot span them, and distributed two-phase commit is usually avoided because it is slow and couples the services. A saga splits a business operation into a sequence of local transactions, one in each service. After each step, the next one is triggered by an event or a command. If a step fails, the saga runs compensating transactions that undo the earlier steps, for example cancelling a reservation. The data is therefore eventually consistent, and the compensation logic must be designed and tested.",
    detail: [
      "A compensation is a business action, not a database rollback. A sent email cannot be unsent, so a correction is sent.",
      "Steps and compensations should be idempotent, because messages can be repeated.",
      "Intermediate states are visible to other requests, so the design has to allow for that.",
    ],
    ex: "An order saga creates the order, reserves stock, charges the payment, and if the payment fails, releases the stock and cancels the order.",
    mistakes: [
      "Expecting a saga to give isolation like a database transaction.",
      "Forgetting to design the compensation for each step.",
    ],
    follow: ["What is a compensating transaction?"],
    points: [
      "Sequence of local transactions",
      "Compensations undo earlier steps",
      "Eventual consistency",
    ],
    notes: "Saga = local transactions + compensations instead of one distributed transaction.",
    src: [
      ["Microsoft Learn: Saga distributed transactions pattern", `${PAT}/saga`],
      ["AWS Prescriptive Guidance: Saga pattern", "https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-data-persistence/saga-pattern.html"],
    ],
  }),
  g({
    slug: "choreography-vs-orchestration",
    topic: "Saga",
    d: "hard",
    title: "What is the difference between choreography and orchestration in a saga?",
    kw: ["choreography", "orchestration", "saga orchestrator", "event-driven", "coordination"],
    intent: "Checks that you can compare the two ways to coordinate a saga.",
    short:
      "In choreography, there is no central coordinator. Each service listens for events and decides what to do next, publishing its own event when it finishes, so the flow emerges from the interaction of the services. It is simple for small flows and keeps the services decoupled, but the whole process is hard to see and to change, and cyclic dependencies can appear. In orchestration, a central orchestrator tells each service what to do, tracks the state of the saga, and triggers the compensations on failure. It makes the flow explicit and easier to monitor, but the orchestrator is an extra component and must not hold all the business logic.",
    detail: [
      "Choreography suits sagas with few steps. Orchestration suits longer or more complex flows.",
      "Both need idempotent steps and a way to see the state of each saga.",
      "Workflow engines can provide orchestration with persistence and retries.",
    ],
    ex: "A five-step order process uses an orchestrator, so that support can see which step each order is in.",
    mistakes: [
      "Using choreography for a long flow and losing track of it.",
      "Putting the business rules of every service into the orchestrator.",
    ],
    follow: ["Which would you choose for a long process?"],
    points: [
      "Choreography: services react to events",
      "Orchestration: central coordinator",
      "Choose by the size and complexity of the flow",
    ],
    notes: "Choreography = events, no coordinator. Orchestration = a coordinator drives the saga.",
    src: [
      ["Microsoft Learn: Saga distributed transactions pattern", `${PAT}/saga`],
      ["AWS Prescriptive Guidance: Saga pattern", "https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-data-persistence/saga-pattern.html"],
    ],
  }),
  g({
    slug: "transactional-outbox",
    topic: "Data consistency & per-service databases",
    d: "hard",
    title: "What problem does the transactional outbox solve?",
    kw: ["outbox pattern", "dual write", "event publishing", "atomicity", "message relay"],
    intent: "Checks that you know how to update the database and publish an event reliably.",
    short:
      "A service often has to change its database and also publish an event. If it does the two steps separately, a crash between them leaves the system inconsistent: the data is saved but the event is lost, or the event is sent but the data is rolled back. This is the dual-write problem. With the outbox pattern, the service writes the event to an outbox table in the same local transaction as the data change, so both succeed or both fail. A separate process reads the outbox and publishes the events to the broker, marking them as sent. Delivery is at least once, so consumers must be idempotent.",
    detail: [
      "The relay can poll the table, or use the database's change log.",
      "Old outbox rows must be cleaned up.",
      "The pattern gives reliability without a distributed transaction.",
    ],
    ex: "Saving an order also inserts an `OrderPlaced` row in the outbox, and a relay sends it to the broker.",
    code: [
      "One transaction for data and event",
      "@Transactional\npublic void place(Order order) {\n  orders.save(order);\n  outbox.save(new OutboxEvent(\"OrderPlaced\", order.getId(), toJson(order)));\n}   // both rows commit together; a relay publishes the outbox later",
      [
        "The order and the event row are saved in one local transaction.",
        "If anything fails, neither is saved.",
        "A background relay sends the outbox rows to the broker.",
      ],
      "java",
    ],
    mistakes: [
      "Saving to the database and publishing to the broker in two separate steps.",
      "Assuming that exactly-once delivery comes for free.",
    ],
    follow: ["Why must consumers be idempotent with an outbox?"],
    points: [
      "Dual-write problem",
      "Event saved with the data in one transaction",
      "A relay publishes; delivery is at least once",
    ],
    notes: "Outbox: write the event with the data in one transaction; a relay publishes it later.",
    src: [
      ["Microsoft Learn: Data considerations for microservices", `${MS}/design/data-considerations`],
      ["AWS Prescriptive Guidance: Transactional outbox pattern", "https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html"],
    ],
  }),
  g({
    slug: "eventual-consistency-and-cqrs",
    topic: "Data consistency & per-service databases",
    d: "hard",
    title: "What are eventual consistency and CQRS?",
    kw: ["eventual consistency", "CQRS", "read model", "command", "query"],
    intent: "Checks that you understand why data may lag and one pattern that uses it.",
    short:
      "Eventual consistency means that, when data is copied or changed across services, the copies may differ for a short time, but they will agree if no more changes arrive. It is the usual consistency model between services, and the user interface and the business rules must be designed for it, for example by showing a \"processing\" state. CQRS, Command Query Responsibility Segregation, separates the model that handles changes, the commands, from the model that handles reads, the queries. The read model is shaped for fast queries and is updated from events, so it can be eventually consistent, which suits systems with very different read and write needs.",
    detail: [
      "CQRS adds complexity, so it should be used only where the benefits are clear.",
      "It does not require event sourcing, though the two are often combined.",
      "A read model can combine data from several services in one place.",
    ],
    ex: "A search page reads from a read model that is updated by `ProductChanged` events, and a change appears there after a second or two.",
    mistakes: [
      "Using CQRS for a simple CRUD service.",
      "Showing stale data as if it were certainly current.",
    ],
    follow: ["How would you show a user that an operation is still in progress?"],
    points: [
      "Copies agree after some time",
      "CQRS: separate write and read models",
      "Use only when the benefits are clear",
    ],
    notes: "Eventual consistency = lag, then agreement. CQRS = separate command and query models.",
    src: [
      ["Microsoft Learn: CQRS pattern", `${PAT}/cqrs`],
      ["Microsoft Learn: Data considerations for microservices", `${MS}/design/data-considerations`],
    ],
  }),
  g({
    slug: "api-gateway-pattern",
    topic: "API gateway",
    d: "easy",
    title: "What is an API gateway and what does it do?",
    kw: ["API gateway", "routing", "authentication", "rate limiting", "single entry point"],
    intent: "Checks that you know the role of the entry point for clients.",
    short:
      "An API gateway is a single entry point for clients in front of a set of services. It routes each request to the right service, so clients need to know only one address, and it can handle cross-cutting concerns in one place: authentication and token checks, TLS termination, rate limiting, request logging, caching and sometimes combining the responses of several services. This keeps the services simpler, and lets internal services change without breaking clients. The gateway must itself be highly available, because it is on the path of every request, and it should not contain business logic.",
    detail: [
      "Spring Cloud Gateway is a gateway built on Spring and reactive technology.",
      "A backend-for-frontend is a gateway shaped for one kind of client, such as mobile.",
      "Keep the gateway thin, so that it does not become a monolith of its own.",
    ],
    ex: "Mobile and web clients both call `api.shop.com`, and the gateway routes `/orders/**` to the orders service.",
    mistakes: [
      "Putting business rules into the gateway.",
      "Running a single gateway instance that becomes a single point of failure.",
    ],
    follow: ["What is a backend-for-frontend?"],
    points: [
      "Single entry point and routing",
      "Cross-cutting concerns in one place",
      "Keep it thin and highly available",
    ],
    notes: "API gateway = one entry point: routing, auth, rate limiting. No business logic.",
    src: [
      ["Microsoft Learn: Gateway Routing pattern", `${PAT}/gateway-routing`],
      ["Spring Cloud Gateway Reference", "https://docs.spring.io/spring-cloud-gateway/reference/index.html"],
    ],
  }),
  g({
    slug: "spring-cloud-gateway-routes",
    topic: "API gateway",
    d: "medium",
    title: "How do you define routes in Spring Cloud Gateway?",
    kw: ["Spring Cloud Gateway", "route", "predicate", "filter", "RouteLocator"],
    intent: "Checks that you know the three building blocks of a route.",
    short:
      "A route in Spring Cloud Gateway has an id, a destination URI, a set of predicates, and a set of filters. A predicate decides whether the route matches a request, for example by the path, the HTTP method or a header. If it matches, the request passes through the filters, which can change the request or the response, for example by stripping a path prefix, adding a header or applying a rate limit, and then it is forwarded to the destination. Routes are defined in configuration, in YAML or properties, or in Java code with a `RouteLocator` bean.",
    detail: [
      "A `lb://service-name` URI sends the request to a service found by a load balancer.",
      "Global filters apply to all routes, for example for logging or authentication.",
      "Test routes with real requests, because predicate order matters.",
    ],
    ex: "Requests with the path `/api/orders/**` are sent to the orders service after the `/api` prefix is removed.",
    code: [
      "A route in YAML",
      "spring:\n  cloud:\n    gateway:\n      routes:\n        - id: orders\n          uri: lb://orders-service\n          predicates:\n            - Path=/api/orders/**\n          filters:\n            - StripPrefix=1",
      [
        "The `Path` predicate matches requests for orders.",
        "`StripPrefix=1` removes `/api` before forwarding.",
        "`lb://` sends the request to an instance of `orders-service`.",
      ],
      "yaml",
    ],
    mistakes: [
      "Forgetting the route order, so that a broad predicate matches first.",
      "Putting heavy logic into gateway filters.",
    ],
    follow: ["What is a predicate?"],
    points: [
      "Route = id + uri + predicates + filters",
      "Predicates match, filters modify",
      "lb:// uses load balancing",
    ],
    notes: "Gateway route: predicates (match) + filters (modify) + uri (destination).",
    src: [
      ["Spring Cloud Gateway Reference", "https://docs.spring.io/spring-cloud-gateway/reference/index.html"],
      ["Microsoft Learn: Gateway Routing pattern", `${PAT}/gateway-routing`],
    ],
  }),
  g({
    slug: "service-discovery",
    topic: "Service discovery & configuration",
    d: "medium",
    title: "What is service discovery and why is it needed?",
    kw: ["service discovery", "registry", "client-side load balancing", "Kubernetes service", "dynamic addresses"],
    intent: "Checks that you know how services find each other when addresses change.",
    short:
      "In a cloud or container platform, instances start, stop and move, so their addresses change all the time and cannot be written into configuration. Service discovery solves it: a service registers its name and address, or the platform tracks it, and callers look up a service by name to get the addresses of healthy instances, then spread requests among them with load balancing. With a registry such as Eureka, the lookup is done by the client. On Kubernetes, the platform provides it: a `Service` gives a stable name and virtual address in front of a changing set of pods, and DNS resolves it.",
    detail: [
      "Health checks remove unhealthy instances from the list.",
      "On Kubernetes, you usually do not need a separate registry.",
      "Callers use logical service names, such as `http://orders`, not addresses.",
    ],
    ex: "The cart service calls `http://pricing/prices/5`, and Kubernetes routes the call to a healthy pricing pod.",
    mistakes: [
      "Hard-coding the IP addresses of other services.",
      "Running a separate registry on a platform that already provides discovery.",
    ],
    follow: ["How does Kubernetes provide discovery?"],
    points: [
      "Instances come and go",
      "Look up by name, balance across healthy instances",
      "Kubernetes Services do it natively",
    ],
    notes: "Service discovery = find healthy instances by name. Kubernetes Services provide it natively.",
    src: [
      ["Kubernetes: Service", `${K8S}/concepts/services-networking/service/`],
      ["Microsoft Learn: Interservice communication in microservices", `${MS}/design/interservice-communication`],
    ],
  }),
  g({
    slug: "externalised-configuration-microservices",
    topic: "Service discovery & configuration",
    d: "medium",
    title: "How do you manage configuration and secrets across many services?",
    kw: ["externalised configuration", "ConfigMap", "Secret", "Spring Cloud Config", "environment variables"],
    intent: "Checks that you keep configuration out of the build and secrets out of the repository.",
    short:
      "The same build artifact should run in every environment, so the configuration that differs, such as URLs, credentials and feature flags, lives outside the code and is supplied when the service starts. Options are environment variables, files mounted into the container, a central configuration server such as Spring Cloud Config, or the platform's own objects: on Kubernetes, a `ConfigMap` for ordinary settings and a `Secret` for sensitive values. Secrets must never be committed to the repository or written into images, and access to them should be limited. A change of configuration should be tracked and reviewed, like a code change.",
    detail: [
      "A Kubernetes `Secret` is only base64-encoded by default, so protect access and consider encryption at rest.",
      "Spring Boot reads environment variables, so `SPRING_DATASOURCE_URL` sets `spring.datasource.url`.",
      "Services should fail at start-up when a required setting is missing.",
    ],
    ex: "The same image runs in test and production, with different `ConfigMap` and `Secret` objects.",
    mistakes: [
      "Building a different image for each environment.",
      "Putting passwords in the image or in the repository.",
    ],
    follow: ["What is the difference between a ConfigMap and a Secret?"],
    points: [
      "One artifact, many environments",
      "ConfigMap for settings, Secret for credentials",
      "Never commit secrets",
    ],
    notes: "Externalise config (env vars, ConfigMap, Config Server). Secrets stay out of code and images.",
    src: [
      ["Kubernetes: ConfigMaps", `${K8S}/concepts/configuration/configmap/`],
      ["Spring Cloud Config Reference", "https://docs.spring.io/spring-cloud-config/reference/index.html"],
    ],
  }),
  g({
    slug: "health-checks-and-probes",
    topic: "Deploying with containers",
    d: "medium",
    title: "What are liveness and readiness probes, and how do they relate to Spring Boot Actuator?",
    kw: ["liveness probe", "readiness probe", "startup probe", "Actuator", "health endpoint"],
    intent: "Checks that you can let the platform manage unhealthy and starting instances.",
    short:
      "Kubernetes uses probes to decide what to do with a container. A liveness probe tells whether the container is still working, and if it fails, Kubernetes restarts the container. A readiness probe tells whether the container is ready to receive traffic, and if it fails, the pod is taken out of the service until it recovers, without a restart. A startup probe protects slow-starting applications. Spring Boot Actuator exposes health groups for these, `/actuator/health/liveness` and `/actuator/health/readiness`, and a liveness check should not depend on external systems, otherwise a database outage could restart every instance.",
    detail: [
      "A pod that is not ready receives no traffic, which allows rolling updates without errors.",
      "Set the probe delays and timeouts according to the real start-up time.",
      "The probe endpoints should be fast and cheap.",
    ],
    ex: "A pod loading a large cache reports not ready until it finishes, so no request reaches it too early.",
    code: [
      "Probes in a Deployment",
      "livenessProbe:\n  httpGet:\n    path: /actuator/health/liveness\n    port: 8080\n  periodSeconds: 10\nreadinessProbe:\n  httpGet:\n    path: /actuator/health/readiness\n    port: 8080\n  periodSeconds: 5",
      [
        "The liveness probe restarts a container that is stuck.",
        "The readiness probe decides whether the pod receives traffic.",
        "Both use the health groups of Spring Boot Actuator.",
      ],
      "yaml",
    ],
    mistakes: [
      "Making the liveness probe depend on the database.",
      "Using the same check for liveness and readiness.",
    ],
    follow: ["What does a failing readiness probe do?"],
    points: [
      "Liveness: restart; readiness: route traffic",
      "Startup probe for slow starts",
      "Liveness must not depend on other systems",
    ],
    notes: "Liveness restarts a container; readiness gates traffic. Use Actuator health groups.",
    src: [
      ["Kubernetes: Liveness, Readiness and Startup Probes", `${K8S}/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/`],
      ["Spring Boot Reference: Actuator Endpoints", `${SB}/actuator/endpoints.html`],
    ],
  }),
  g({
    slug: "observability-three-pillars",
    topic: "Observability (tracing and metrics)",
    d: "medium",
    title: "What are logs, metrics and traces, and why do microservices need all three?",
    kw: ["observability", "logs", "metrics", "traces", "correlation id"],
    intent: "Checks that you can find out what a distributed system is doing.",
    short:
      "Logs are records of events with details, which show what happened in one service. Metrics are numbers measured over time, such as request rate, error rate and latency, which show the health of a service and trigger alerts. Traces follow a single request as it passes through many services, showing the path and the time spent in each step. In microservices, one user action touches many services, so logs from one service are not enough. A shared trace or correlation id in every log line and call lets you find all the work done for one request. Together the three signals make a system observable.",
    detail: [
      "Centralise the logs, because looking at each instance is not practical.",
      "Alert on symptoms that users feel, such as errors and latency, rather than on every internal detail.",
      "Never log secrets or personal data.",
    ],
    ex: "An alert shows a rise in checkout errors, and a trace shows that the payment service is the slow step.",
    mistakes: [
      "Logging without a correlation id, so that requests cannot be followed.",
      "Collecting metrics that nobody looks at.",
    ],
    follow: ["What is a correlation id?"],
    points: [
      "Logs: events, metrics: numbers, traces: request paths",
      "Correlation or trace id across services",
      "Centralise and alert on symptoms",
    ],
    notes: "Observability = logs + metrics + traces, tied together with a trace id.",
    src: [
      ["Microsoft Learn: Logging and monitoring in microservices", `${MS}/logging-monitoring`],
      ["Spring Boot Reference: Observability", `${SB}/actuator/observability.html`],
    ],
  }),
  g({
    slug: "distributed-tracing",
    topic: "Observability (tracing and metrics)",
    d: "hard",
    title: "How does distributed tracing work in a Spring Boot application?",
    kw: ["distributed tracing", "trace id", "span", "context propagation", "Micrometer Tracing"],
    intent: "Checks that you know how a trace follows a request across services.",
    short:
      "A trace is the record of one request through the system, made of spans, where each span is one unit of work, such as handling an HTTP request or a database call, with a start time, a duration and a parent. The trace id stays the same for the whole request, and each service passes it on to the next one in a header of the outgoing call or message. This is context propagation. In Spring Boot, Micrometer Tracing, with Actuator, creates spans for incoming and outgoing requests automatically and adds the trace id to the log lines, and a tracing backend collects and shows the traces.",
    detail: [
      "The HTTP clients must be created from the Spring builders, so that the propagation headers are added.",
      "Sampling decides which requests are recorded, to limit the cost.",
      "Traces help to find the slow service in a chain, and metrics show the overall trend.",
    ],
    ex: "A trace for `POST /orders` shows the gateway, the orders service, and two database calls, with the time that each took.",
    mistakes: [
      "Creating HTTP clients with `new`, so that the headers are not propagated.",
      "Recording every trace at high traffic without sampling.",
    ],
    follow: ["What is a span?"],
    points: [
      "Trace = spans for one request",
      "Trace id propagated in headers",
      "Micrometer Tracing in Spring Boot",
    ],
    notes: "Trace id travels in headers; each unit of work is a span. Micrometer Tracing does it in Boot.",
    src: [
      ["Spring Boot Reference: Tracing", `${SB}/actuator/tracing.html`],
      ["Spring Boot Reference: Observability", `${SB}/actuator/observability.html`],
    ],
  }),
  g({
    slug: "metrics-and-alerting-microservices",
    topic: "Observability (tracing and metrics)",
    d: "medium",
    title: "Which metrics should every service expose, and how do you alert on them?",
    kw: ["RED method", "latency", "error rate", "Micrometer", "alerting"],
    intent: "Checks that you can pick a small, useful set of signals.",
    short:
      "A useful start for a request-driven service is three signals: the request rate, the error rate and the request duration, also called the RED method. Add the signals of the resources that it uses, such as the CPU, the memory, the thread and connection pool usage, and the garbage collection. Spring Boot Actuator and Micrometer collect many of these automatically, and a monitoring system stores and charts them. Alert on what users feel, such as a high error rate or a high latency over a period, rather than on one small spike, and link each alert to a clear action.",
    detail: [
      "Latency should be measured as percentiles, such as the 95th, and not only as the average.",
      "Add business metrics too, such as orders placed.",
      "Too many alerts create alert fatigue, and people stop reacting.",
    ],
    ex: "An alert fires when more than 2% of requests fail for five minutes, and it links to the runbook.",
    mistakes: [
      "Watching only averages, which hide slow requests.",
      "Alerting on every metric.",
    ],
    follow: ["Why use percentiles for latency?"],
    points: [
      "Rate, errors, duration",
      "Resource and business metrics",
      "Alert on user-visible symptoms",
    ],
    notes: "Start with rate, errors and duration (RED), use percentiles, alert on symptoms.",
    src: [
      ["Spring Boot Reference: Metrics", `${SB}/actuator/metrics.html`],
      ["Microsoft Learn: Logging and monitoring in microservices", `${MS}/logging-monitoring`],
    ],
  }),
  g({
    slug: "testing-microservices",
    topic: "Testing microservices",
    d: "medium",
    title: "How do you test microservices? (unit, integration, contract and end-to-end tests)",
    kw: ["test pyramid", "contract testing", "integration test", "end-to-end", "Testcontainers"],
    intent: "Checks that you can balance fast tests with realistic ones.",
    short:
      "Use several levels. Unit tests check the business logic of one service quickly and in large numbers. Integration tests check a service with its real infrastructure, such as its database, and Testcontainers can start these in a container. Contract tests check that a consumer and a provider agree on the API: the consumer states what it expects, and the provider is verified against it, so that a change that would break a consumer is found before deployment, without running both services together. A few end-to-end tests cover the most important user journeys, but they are slow and fragile, so they should be few.",
    detail: [
      "Spring Cloud Contract is one tool for consumer-driven contracts.",
      "Fake the other services in a service's own tests, with stubs, and rely on contract tests to keep the stubs honest.",
      "Test failure cases too, such as timeouts and error responses.",
    ],
    ex: "The orders team publishes a contract for the pricing API, and the pricing service's build fails if a change breaks it.",
    mistakes: [
      "Relying only on slow end-to-end tests.",
      "Mocking another service in a way that no longer matches its real API.",
    ],
    follow: ["What is a consumer-driven contract?"],
    points: [
      "Many unit tests, fewer integration tests, few end-to-end tests",
      "Contract tests protect API agreements",
      "Test failures as well",
    ],
    notes: "Test pyramid + contract tests between services; Testcontainers for real infrastructure.",
    src: [
      ["Spring Cloud Contract Reference", "https://docs.spring.io/spring-cloud-contract/reference/index.html"],
      ["Spring Boot Reference: Testing", `${SB}/testing/index.html`],
    ],
  }),
  g({
    slug: "api-versioning-and-compatibility",
    topic: "Communication",
    d: "medium",
    title: "How do you change an API without breaking the other services?",
    kw: ["API versioning", "backward compatibility", "breaking change", "tolerant reader", "deprecation"],
    intent: "Checks that you can evolve interfaces while services deploy independently.",
    short:
      "Because services are deployed independently, a change must not break callers that have not been updated yet. Prefer backward-compatible changes: add new optional fields and new endpoints, and never remove or rename a field or change its meaning in place. Callers should follow the tolerant reader idea, ignoring fields that they do not know. When a breaking change is unavoidable, publish a new version, for example in the path or a header, run the old and new versions together, announce a deprecation period, watch the usage of the old version, and remove it only when nobody uses it.",
    detail: [
      "Contract tests show which consumers depend on which fields.",
      "The same care is needed for message formats and events.",
      "Document each version and its status.",
    ],
    ex: "The orders API adds an optional `currency` field, and the old clients simply ignore it.",
    mistakes: [
      "Renaming a field in place.",
      "Removing an old version before checking who still calls it.",
    ],
    follow: ["What is a tolerant reader?"],
    points: [
      "Add, do not remove or change",
      "Tolerant readers",
      "Version, deprecate, then remove",
    ],
    notes: "Evolve APIs by adding optional fields; version breaking changes and retire old versions slowly.",
    src: [
      ["Microsoft Learn: API design for microservices", `${MS}/design/api-design`],
      ["Microsoft Learn: Web API design best practices", "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design"],
    ],
  }),
  g({
    slug: "containerising-spring-boot-services",
    topic: "Deploying with containers",
    d: "medium",
    title: "How do you package a Spring Boot service as a container image?",
    kw: ["Dockerfile", "buildpacks", "layered jar", "container image", "JRE base image"],
    intent: "Checks that you can produce a small, repeatable image.",
    short:
      "A Spring Boot application is built into an executable jar, and that jar is packaged into an image that runs `java -jar`. There are two common ways. Cloud Native Buildpacks, available through the build plugin command `spring-boot:build-image` or `bootBuildImage`, create an optimised image without a Dockerfile. Or you write a Dockerfile, ideally using Boot's layered jar support, so that the rarely changing dependencies are in an early layer and the frequently changing application code is in a late one, which makes rebuilds and pushes much faster. Run as a non-root user, and keep the image small, with only a runtime and the application.",
    detail: [
      "Do not put secrets or environment-specific settings into the image.",
      "Tag images with a version or the commit id, and not only with `latest`.",
      "Set the JVM memory with percentage options, so that it respects the container limit.",
    ],
    ex: "The pipeline builds the image once, tags it with the commit hash, and promotes the same image from test to production.",
    code: [
      "Build an image without a Dockerfile",
      "# Maven\n./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=shop/orders:1.4.0\n\n# Gradle\n./gradlew bootBuildImage --imageName=shop/orders:1.4.0",
      [
        "The plugin creates an image using buildpacks.",
        "The image name carries an explicit version.",
        "No Dockerfile has to be maintained.",
      ],
    ],
    mistakes: [
      "Running the container as root.",
      "Baking environment-specific configuration into the image.",
    ],
    follow: ["Why use layers for the jar?"],
    points: [
      "Buildpacks or a Dockerfile with layers",
      "Small, non-root, versioned images",
      "No secrets in the image",
    ],
    notes: "`spring-boot:build-image` or a layered Dockerfile; versioned tags; non-root; no secrets.",
    src: [
      ["Spring Boot Reference: Container Images", `${SB}/packaging/container-images/index.html`],
      ["Spring Boot Reference: Efficient Container Images", `${SB}/packaging/container-images/efficient-images.html`],
    ],
  }),
  g({
    slug: "kubernetes-deployments-and-scaling",
    topic: "Deploying with containers",
    d: "medium",
    title: "How does Kubernetes run and update a microservice? (Deployment, replicas, rolling update)",
    kw: ["Deployment", "replicas", "rolling update", "Horizontal Pod Autoscaler", "resource limits"],
    intent: "Checks that you know the objects that keep a service running and updated.",
    short:
      "A Deployment describes the desired state of a service: the container image, the number of replicas, and the settings. Kubernetes keeps that many pods running, replacing any that fail. To update, you change the image version, and the Deployment performs a rolling update, starting new pods and removing old ones gradually, so the service stays available, and readiness probes decide when a new pod can take traffic. A rollback returns to the previous version. A Horizontal Pod Autoscaler can change the number of replicas from metrics such as CPU. Set resource requests and limits for every container, so that scheduling and scaling work predictably.",
    detail: [
      "A `Service` in front of the pods gives a stable address.",
      "More than one replica is needed for availability during updates and failures.",
      "Configuration and secrets are supplied separately, as ConfigMaps and Secrets.",
    ],
    ex: "The orders Deployment runs three replicas, and a new image version is rolled out one pod at a time.",
    code: [
      "A small Deployment",
      "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: orders\nspec:\n  replicas: 3\n  selector:\n    matchLabels: { app: orders }\n  template:\n    metadata:\n      labels: { app: orders }\n    spec:\n      containers:\n        - name: orders\n          image: shop/orders:1.4.0\n          resources:\n            requests: { cpu: 250m, memory: 512Mi }\n            limits: { memory: 768Mi }",
      [
        "Three replicas are kept running.",
        "Changing the image tag triggers a rolling update.",
        "Resource requests and limits let Kubernetes schedule the pods.",
      ],
      "yaml",
    ],
    mistakes: [
      "Running a single replica and expecting no downtime during updates.",
      "Leaving out resource requests and limits.",
    ],
    follow: ["How do you roll back a bad release?"],
    points: [
      "Deployment keeps the desired replicas",
      "Rolling update with readiness probes",
      "Requests and limits",
    ],
    notes: "Deployment = desired replicas + rolling updates; readiness probes gate traffic; set resources.",
    src: [
      ["Kubernetes: Deployments", `${K8S}/concepts/workloads/controllers/deployment/`],
      ["Kubernetes: Service", `${K8S}/concepts/services-networking/service/`],
    ],
  }),
  g({
    slug: "strangler-fig-migration",
    topic: "Boundaries",
    d: "hard",
    title: "How do you migrate from a monolith to microservices safely? (strangler fig)",
    kw: ["strangler fig", "incremental migration", "anti-corruption layer", "monolith decomposition", "routing"],
    intent: "Checks that you prefer gradual migration over a rewrite.",
    short:
      "A big-bang rewrite is risky and delivers nothing until the end. The strangler fig pattern migrates gradually. Put a routing layer, such as a gateway, in front of the monolith. Build one capability as a new service, and route the matching requests to it, while everything else still goes to the monolith. Repeat for further capabilities, until the monolith has shrunk or disappeared. An anti-corruption layer translates between the old model and the new service's model, so that the old design does not leak into the new one. Choose the first piece for its business value and low coupling, and migrate the data with care.",
    detail: [
      "Each step can be released and rolled back on its own.",
      "Data is the hardest part, because the new service must take over its tables and the monolith must stop writing them.",
      "Stop and review whether a modular monolith would already solve the problem.",
    ],
    ex: "The notifications module is extracted first, and the gateway sends `/notifications/**` to the new service.",
    mistakes: [
      "Starting with the most tangled part of the monolith.",
      "Letting both the monolith and the new service write the same tables.",
    ],
    follow: ["What is an anti-corruption layer?"],
    points: [
      "Gradual replacement behind a router",
      "Anti-corruption layer for the old model",
      "Move data ownership deliberately",
    ],
    notes: "Strangler fig: route by capability to new services, shrink the monolith step by step.",
    src: [
      ["Microsoft Learn: Strangler Fig pattern", `${PAT}/strangler-fig`],
      ["Microsoft Learn: Anti-corruption Layer pattern", `${PAT}/anti-corruption-layer`],
    ],
  }),
  g({
    slug: "microservices-security",
    topic: "Communication",
    d: "hard",
    title: "How do you secure communication and access between microservices?",
    kw: ["zero trust", "mutual TLS", "JWT propagation", "service-to-service authentication", "least privilege"],
    intent: "Checks that internal traffic is not trusted by default.",
    short:
      "Do not treat the internal network as safe. Authenticate the user at the edge, usually in the gateway, with a token such as a JWT, and pass the token or a derived identity to the services, so that each service can check what the user may do. For service-to-service calls, use mutual TLS, where both sides present certificates, or short-lived service tokens, so that a service knows who is calling it. Give each service only the permissions that it needs, and each credential a narrow scope. Keep secrets in a secret store, validate the input of every service, and log security events.",
    detail: [
      "A service that is reachable inside the cluster should still check authorisation, and not rely on the gateway alone.",
      "Network policies can limit which services may talk to each other.",
      "Rotate certificates and tokens automatically.",
    ],
    ex: "The payment service accepts calls only from the orders service, checked with a certificate, and verifies the user's token for each request.",
    mistakes: [
      "Trusting every request that comes from inside the cluster.",
      "Sharing one powerful credential between all services.",
    ],
    follow: ["What does mutual TLS add?"],
    points: [
      "Authenticate users at the edge, pass identity on",
      "Authenticate services to each other",
      "Least privilege everywhere",
    ],
    notes: "Zero trust inside: user token propagation, mTLS or service tokens, least privilege.",
    src: [
      ["Microsoft Learn: Interservice communication in microservices", `${MS}/design/interservice-communication`],
      ["Kubernetes: Network Policies", `${K8S}/concepts/services-networking/network-policies/`],
    ],
  }),
])
