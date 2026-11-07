import { defineLesson } from "@/data/lessons/author"

export default defineLesson("rest-apis", {
  slug: "api-documentation-openapi",
  title: "API documentation with OpenAPI and Swagger",
  topic: "API documentation (Swagger/OpenAPI)",
  minutes: 60,
  overview:
    "Describe an API in an OpenAPI document: info, servers, paths, parameters, request bodies, responses and reusable schemas, and see how tools such as Swagger UI turn it into interactive documentation.",
  objectives: [
    "Explain what OpenAPI and Swagger are and how they relate",
    "Read and write the main parts of an OpenAPI 3 document",
    "Reuse schemas with $ref",
    "Name what tools do with the document: docs, mocks, tests and client code",
  ],
  prerequisites: ["lesson.rest-apis.status-codes"],
  sections: [
    {
      kind: "explain",
      heading: "Documentation as a contract",
      body: [
        "Good API documentation tells a developer what endpoints exist, what to send, what comes back and what can go wrong. The **OpenAPI Specification (OAS)** is a standard, language-neutral format for describing an HTTP API in a YAML or JSON file. It is an open standard maintained by the OpenAPI Initiative. **Swagger** is the name of the original specification and of a family of tools around it: **Swagger UI** renders the document as interactive pages where you can try requests, and **Swagger Editor** helps you write it.",
        "Because the document is machine-readable, tools can also generate server stubs and client libraries, validate requests and responses, create mock servers and drive automated tests. It becomes a **contract** between the teams that build and use the API.",
      ],
    },
    {
      kind: "diagram",
      heading: "Main parts of an OpenAPI 3 document",
      diagram: {
        kind: "table",
        title: "Top-level fields",
        headers: ["Field", "Purpose"],
        rows: [
          [
            "openapi",
            "The version of the specification used (for example 3.0.3)",
          ],
          ["info", "Title, version and description of your API"],
          ["servers", "Base URLs where the API runs"],
          [
            "paths",
            "Each URL path with its operations (get, post, put, delete...)",
          ],
          [
            "components",
            "Reusable pieces: schemas, parameters, responses, security schemes",
          ],
          [
            "security / tags",
            "How callers authenticate and how operations are grouped",
          ],
        ],
      },
    },
    {
      kind: "code",
      heading: "A small OpenAPI document",
      example: {
        title: "Books API (YAML)",
        language: "yaml",
        code: 'openapi: 3.0.3\ninfo:\n  title: Books API\n  version: 1.0.0\n  description: A small API for managing books.\nservers:\n  - url: http://localhost:8000\npaths:\n  /v1/books:\n    get:\n      summary: List books\n      operationId: listBooks\n      parameters:\n        - name: author\n          in: query\n          description: Only books by this author.\n          schema:\n            type: string\n        - name: limit\n          in: query\n          schema:\n            type: integer\n            minimum: 1\n            maximum: 50\n            default: 10\n      responses:\n        "200":\n          description: A page of books.\n          content:\n            application/json:\n              schema:\n                $ref: "#/components/schemas/BookPage"\n    post:\n      summary: Create a book\n      operationId: createBook\n      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              $ref: "#/components/schemas/BookInput"\n      responses:\n        "201":\n          description: The created book.\n          headers:\n            Location:\n              description: Address of the new book.\n              schema:\n                type: string\n          content:\n            application/json:\n              schema:\n                $ref: "#/components/schemas/Book"\n        "422":\n          description: Validation failed.\n          content:\n            application/problem+json:\n              schema:\n                $ref: "#/components/schemas/Problem"\n  /v1/books/{id}:\n    parameters:\n      - name: id\n        in: path\n        required: true\n        schema:\n          type: integer\n    get:\n      summary: Get one book\n      operationId: getBook\n      responses:\n        "200":\n          description: The book.\n          content:\n            application/json:\n              schema:\n                $ref: "#/components/schemas/Book"\n        "404":\n          description: No such book.\n          content:\n            application/problem+json:\n              schema:\n                $ref: "#/components/schemas/Problem"\n    delete:\n      summary: Delete a book\n      operationId: deleteBook\n      responses:\n        "204":\n          description: Deleted.\ncomponents:\n  schemas:\n    Book:\n      type: object\n      required: [id, title, author, year]\n      properties:\n        id:\n          type: integer\n        title:\n          type: string\n        author:\n          type: string\n        year:\n          type: integer\n    BookInput:\n      type: object\n      required: [title, author, year]\n      properties:\n        title:\n          type: string\n        author:\n          type: string\n        year:\n          type: integer\n    BookPage:\n      type: object\n      properties:\n        data:\n          type: array\n          items:\n            $ref: "#/components/schemas/Book"\n        meta:\n          type: object\n          properties:\n            page:\n              type: integer\n            total:\n              type: integer\n    Problem:\n      type: object\n      required: [title, status]\n      properties:\n        title:\n          type: string\n        status:\n          type: integer',
        walkthrough: [
          "`openapi`, `info` and `servers` identify the specification version, the API and where it runs.",
          "Each entry under `paths` is a URL. Its operations (`get`, `post`, `delete`) have a `summary`, an `operationId` (a unique name that tools use for generated code), `parameters`, an optional `requestBody` and `responses` keyed by status code (quoted, because YAML would otherwise read them as numbers).",
          "Path parameters such as `{id}` must be declared with `in: path` and `required: true`. Here it is declared once for the whole path and shared by `get` and `delete`.",
          '`$ref: "#/components/schemas/Book"` points to a reusable schema in the `components` section, so the shape of a book is written once and used in many responses. Schemas use JSON Schema keywords such as `type`, `required`, `properties`, `minimum` and `default`.',
          "Error responses are documented too (`422` and `404` use a `Problem` schema with the media type `application/problem+json`). This is the same document style tools such as Swagger UI render.",
        ],
      },
      intro:
        "You can paste this into Swagger Editor to see it rendered. It describes part of the practice API from this module.",
    },
    {
      kind: "explain",
      heading: "Workflow and quality",
      body: [
        "**Design-first**: write the OpenAPI document before the code, review it with the consumers, then implement. **Code-first**: generate the document from annotations in the code. Either way, keep the document in version control and check it in your build (lint it, and test that the real responses match the schemas) so it never drifts from the behaviour.",
        "Good documentation also has realistic **examples**, describes **errors** and authentication, states limits such as rate limits and maximum page sizes, and has a changelog. Postman and similar tools can import an OpenAPI file to create a collection of requests for testing.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Documenting only the success responses.",
          fix: "Document the error responses and their body format as well.",
        },
        {
          mistake: "A document that no longer matches the code.",
          fix: "Generate it from the code or test it against the running API in your build.",
        },
        {
          mistake: "Copy-pasting the same schema into many places.",
          fix: "Define it once under components and reference it with $ref.",
        },
        {
          mistake: "Forgetting to quote status codes in YAML.",
          fix: 'Write "200" as a string key so the document is valid.',
        },
      ],
    },
    {
      kind: "practical",
      heading: "Onboarding a front-end team",
      scenario:
        "A new team must use your API next week and you cannot join their meetings.",
      body: [
        "Publish the OpenAPI file, host Swagger UI so they can try requests, generate a typed client for their language and share a mock server built from the document so they can start before the real endpoints are ready. Questions about behaviour become changes to the document.",
        "Review the document in pull requests like any other code.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "swagger-ui",
      prompt: "What does Swagger UI do?",
      options: [
        "Renders an OpenAPI document as interactive documentation",
        "Compiles Java code",
        "Encrypts API traffic",
      ],
      answer: 0,
      explanation:
        "Swagger UI shows the endpoints and lets you try requests from the browser.",
    },
    {
      type: "single",
      id: "ref-purpose",
      prompt: "What is $ref used for in an OpenAPI document?",
      options: [
        "To reuse a definition, such as a schema, from another place",
        "To reference a database",
        "To redirect the request",
      ],
      answer: 0,
      explanation: "A $ref points to a reusable component.",
    },
    {
      type: "truefalse",
      id: "quote-codes",
      statement:
        'Response status codes should be written as quoted strings in YAML, such as "200".',
      answer: true,
      explanation:
        "Quoting keeps them as string keys, which the specification expects.",
    },
    {
      type: "blank",
      id: "path-param",
      prompt:
        "A path parameter such as {id} must be declared with in: path and ___: true.",
      answer: "required",
      explanation: "Path parameters are always required.",
    },
  ],
  assignment: {
    title: "Document an endpoint",
    task: [
      "Take two endpoints of an API you know and write the OpenAPI YAML: parameters, request body, a success response and two error responses, with the schemas under components.",
      "Validate it by pasting it into Swagger Editor or an OpenAPI linter and fix any warning.",
    ],
    checklist: [
      "The document has info, servers, paths and components",
      "Shared schemas are referenced with $ref",
      "Error responses are documented",
      "Path parameters are declared as required",
    ],
    hints: ["Start from the example in this lesson."],
    minutes: 30,
  },
  exercises: [
    {
      slug: "openapi-fragment",
      title: "Write a fragment",
      task: [
        "Write the YAML for GET /v1/books/{id}/reviews: a required integer path parameter id, a query parameter minRating (integer), and a 200 response that is an array of strings in JSON.",
      ],
      language: "yaml",
      starter: "/v1/books/{id}/reviews:\n",
      solution:
        '/v1/books/{id}/reviews:\n  get:\n    summary: List reviews of a book\n    parameters:\n      - name: id\n        in: path\n        required: true\n        schema:\n          type: integer\n      - name: minRating\n        in: query\n        schema:\n          type: integer\n    responses:\n      "200":\n        description: The reviews.\n        content:\n          application/json:\n            schema:\n              type: array\n              items:\n                type: string',
      hints: ["Quote the status code."],
      checklist: [
        "The path parameter has required: true",
        "minRating is a query parameter",
        "200 is quoted and returns an array of strings",
      ],
    },
  ],
  revisionNotes: [
    "OpenAPI is the standard format; Swagger is the original name and the tool family",
    "openapi, info, servers, paths, components",
    "Parameters, requestBody, responses by status code, operationId",
    "Reuse with $ref; document errors; keep the file in sync with the code",
  ],
  resources: [
    {
      label: "OpenAPI Specification",
      url: "https://spec.openapis.org/oas/latest.html",
    },
    {
      label: "OpenAPI Initiative: What is OpenAPI?",
      url: "https://www.openapis.org/what-is-openapi",
    },
    {
      label: "Swagger: About the OpenAPI specification",
      url: "https://swagger.io/docs/specification/about/",
    },
    {
      label: "Swagger UI installation",
      url: "https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/",
    },
  ],
})
