import { defineLesson } from "@/data/lessons/author"

export default defineLesson("rest-apis", {
  slug: "hateoas",
  title: "HATEOAS and hypermedia links",
  topic: "HATEOAS",
  minutes: 30,
  overview:
    "Add links to responses so that clients follow them instead of building URLs: the _links pattern, the Link header and what hypermedia does and does not buy you.",
  objectives: [
    "Explain HATEOAS in one sentence",
    "Read and use a _links object",
    "Know the Link header and its relations",
    "Judge when hypermedia is worth the effort",
  ],
  prerequisites: ["lesson.rest-apis.crud-design"],
  sections: [
    {
      kind: "explain",
      heading: "Hypermedia as the engine of application state",
      body: [
        "**HATEOAS** (Hypermedia As The Engine Of Application State) is a REST constraint: a response contains **links** that tell the client what it can do next, so the client follows links instead of hard-coding URL patterns. A web page works this way: you open the home page and click links; you do not need to know the URL layout in advance.",
        'In an API a representation might include `"_links": {"self": ..., "collection": ..., "update": ..., "delete": ...}`. Each link has an `href` and sometimes the HTTP `method`. Links also expose **state-dependent actions**: an order in state `pending` might offer a `cancel` link, while a `shipped` order does not.',
      ],
    },
    {
      kind: "code",
      heading: "Following links",
      example: {
        title: "A _links object in practice",
        language: "bash",
        code: "curl -s localhost:8000/v1/books/3 | python3 -c \"import sys, json; d = json.load(sys.stdin); [print(k, v) for k, v in d['_links'].items()]\"\ncurl -s localhost:8000/v1/books/3 | python3 -c \"import sys, json; print(json.load(sys.stdin)['_links']['collection']['href'])\"\ncurl -s localhost:8000$(curl -s localhost:8000/v1/books/3 | python3 -c \"import sys, json; print(json.load(sys.stdin)['_links']['collection']['href'])\")?limit=1",
        walkthrough: [
          "The book has four links: `self` (its own address), `collection` (the list it belongs to), and `update` and `delete`, which carry the method to use.",
          "A client that reads `_links.collection.href` gets `/v1/books` without knowing how URLs are built.",
          "The last command builds the next request from that link and asks for one item. If the API moves the collection to another path, clients that follow links keep working.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "The Link header and trade-offs",
      body: [
        'HTTP has a standard way to put links in headers: the **`Link`** header (RFC 8288), for example `Link: </v1/books?page=2>; rel="next"`. The `rel` value says how the target relates to the current resource (`next`, `prev`, `self`, `successor-version`). Formats such as HAL, JSON:API and Siren define how to put links in the JSON body.',
        "Benefits: clients depend less on URL structure, the server can change addresses, and available actions come from the server's logic. Costs: larger responses, more design work, and many clients still hard-code URLs, so full hypermedia is less common in practice. A pragmatic middle path is to include `self`, pagination and a few key action links.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Claiming an API is RESTful with no links at all and hard-coded URL patterns everywhere.",
          fix: "Include at least self and navigation links, or be honest that the API is 'HTTP/JSON'.",
        },
        {
          mistake: "Links that are wrong or out of date.",
          fix: "Generate them from the same routing code that serves the endpoints.",
        },
        {
          mistake:
            "Absolute URLs with a host that differs from the public one.",
          fix: "Use relative links, or build them from the public base URL.",
        },
        {
          mistake: "Showing action links the user may not use.",
          fix: "Include an action link only if the caller is allowed to do it in the current state.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "An order with state-dependent actions",
      scenario: "An order moves from pending to paid to shipped.",
      body: [
        "A pending order has `pay` and `cancel` links. After payment it has `ship`. After shipping it has only `self` and `invoice`. The UI shows buttons only for the links present, so business rules stay on the server.",
        "Clients no longer duplicate the rule 'an order can be cancelled only while it is pending'.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "hateoas-meaning",
      prompt: "What does HATEOAS add to responses?",
      options: [
        "Links to related resources and next actions",
        "Encryption",
        "A version number",
      ],
      answer: 0,
      explanation: "Hypermedia controls tell the client what it can do next.",
    },
    {
      type: "single",
      id: "link-header",
      prompt:
        "Which standard header carries typed links such as next and prev?",
      options: ["Link", "Location", "Referer"],
      answer: 0,
      explanation: "The Link header is defined in RFC 8288.",
    },
    {
      type: "truefalse",
      id: "state-actions",
      statement:
        "With hypermedia, an action link can be present or absent depending on the resource's state.",
      answer: true,
      explanation:
        "For example, a shipped order no longer offers a cancel link.",
    },
    {
      type: "blank",
      id: "self-rel",
      prompt: "The link relation that points to the resource itself is ___.",
      answer: "self",
      explanation: 'rel="self" identifies the current resource.',
    },
  ],
  assignment: {
    title: "Add links",
    task: [
      "Take a response from an API you know (for example an order) and add a _links object with self, collection and two action links that depend on the order's state.",
      "Write down what a client must hard-code with and without these links.",
    ],
    checklist: [
      "The _links object has self and collection",
      "Two state-dependent actions are shown",
      "The client dependencies are compared",
      "A pagination Link header example is included",
    ],
    hints: ["Use relative hrefs."],
    minutes: 10,
  },
  exercises: [
    {
      slug: "links-json",
      title: "Write the links",
      task: [
        "Write the _links object (JSON) for a pending order 12: self, a cancel action using DELETE and a pay action using POST at /orders/12/payment.",
      ],
      language: "json",
      starter: "{\n}",
      solution:
        '{\n  "_links": {\n    "self": { "href": "/orders/12" },\n    "cancel": { "href": "/orders/12", "method": "DELETE" },\n    "pay": { "href": "/orders/12/payment", "method": "POST" }\n  }\n}',
      hints: ["Each link has an href and an optional method."],
      checklist: ["self is present", "cancel uses DELETE", "pay uses POST"],
    },
  ],
  revisionNotes: [
    "HATEOAS: responses contain links; clients follow links",
    "_links with href and method; Link header with rel (RFC 8288)",
    "Actions can depend on state",
    "Pragmatic: self, navigation and key actions",
  ],
  resources: [
    {
      label: "RFC 8288: Web linking",
      url: "https://www.rfc-editor.org/rfc/rfc8288.html",
    },
    {
      label: "MDN: Link header",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Link",
    },
    {
      label: "MDN: REST",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/REST",
    },
  ],
})
