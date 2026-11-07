import { defineQuestions } from "../author"
import { q } from "../compact"

const F = "https://fastapi.tiangolo.com"

export default defineQuestions("fastapi", "fresher", [
  q({
    slug: "what-is-fastapi",
    topic: "OpenAPI",
    d: "easy",
    title: "What is FastAPI, and what is it built on?",
    kw: ["fastapi", "starlette", "pydantic", "type hints", "asgi"],
    intent: "Checks the basic idea and building blocks.",
    short:
      "FastAPI is a Python web framework for building APIs that uses standard Python type hints to declare request and response data. It is built on Starlette, an ASGI toolkit that provides the web parts such as routing and middleware, and Pydantic, which provides data validation and serialisation. From your type-annotated function signatures, FastAPI validates incoming data, converts types, and generates an OpenAPI schema and interactive documentation automatically. It supports both `async def` and regular `def` endpoints, dependency injection, WebSockets and background tasks. You run it with an ASGI server such as Uvicorn, for example through the `fastapi dev` command during development.",
    detail: [
      "One declaration (the type hint) gives validation, conversion and documentation.",
      "The generated docs are available at `/docs` and `/redoc`.",
      "Editor autocompletion works because everything is typed.",
    ],
    ex: "A small service exposing `GET /items/{id}` with a typed path parameter and a validated JSON response.",
    code: [
      [
        "Smallest app",
        "python",
        `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/items/{item_id}")\nasync def read_item(item_id: int, q: str | None = None):\n    return {"item_id": item_id, "q": q}\n\n# run: fastapi dev main.py`,
        [
          "`item_id: int` is validated and converted.",
          "`q` is an optional query parameter.",
        ],
      ],
    ],
    mistakes: [
      "Thinking FastAPI replaces the need for an ASGI server.",
      "Ignoring the automatic validation errors.",
    ],
    follow: ["Which library provides validation in FastAPI?"],
    points: [
      "Type-hint driven API framework",
      "Starlette for web parts",
      "Pydantic for data",
      "Automatic OpenAPI docs",
    ],
    notes: ["Type hints do the work."],
    src: [
      ["FastAPI: Features", `${F}/features/`],
      ["FastAPI: First steps", `${F}/tutorial/first-steps/`],
    ],
  }),
  q({
    slug: "parameter-types-path-query-body",
    topic: "Pydantic",
    d: "easy",
    title:
      "How does FastAPI decide whether a parameter is a path, query or body parameter?",
    kw: [
      "path parameter",
      "query parameter",
      "request body",
      "pydantic model",
      "parameter rules",
    ],
    intent: "Checks the declaration rules every FastAPI developer uses.",
    short:
      "FastAPI infers the kind of each function parameter from its declaration. If the name appears in the path template (`/items/{item_id}`), it is a path parameter. A parameter with a simple type such as `int`, `str`, `float` or `bool` that is not in the path is treated as a query parameter, optional if it has a default. A parameter whose type is a Pydantic model is read from the JSON request body. You can use `Query()`, `Path()`, `Body()`, `Header()` and `Cookie()` to override or add validation. FastAPI converts the types and returns a 422 response with details if validation fails.",
    detail: [
      "A parameter with a default is optional; without one it is required.",
      "Several body models are expected as a JSON object keyed by parameter name.",
      "The docs for each endpoint show where each parameter comes from.",
    ],
    ex: "`PUT /items/5?notify=true` with a JSON body: `item_id` from the path, `notify` from the query, `item` from the body.",
    code: [
      [
        "All three kinds",
        "python",
        `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\nclass Item(BaseModel):\n    name: str\n    price: float\n\napp = FastAPI()\n\n@app.put("/items/{item_id}")\nasync def update(item_id: int, item: Item, notify: bool = False):\n    return {"id": item_id, "item": item, "notify": notify}`,
        ["`item_id`: path.", "`item`: body.", "`notify`: query."],
      ],
    ],
    mistakes: [
      "Expecting a simple type parameter to come from the body.",
      "Forgetting that path names must match the template.",
    ],
    follow: ["How do you require a minimum length for a query parameter?"],
    points: [
      "In the path template: path param",
      "Simple type: query param",
      "Pydantic model: JSON body",
      "Query, Path, Body for extra validation",
    ],
    notes: ["The declaration tells the source."],
    src: [
      ["FastAPI: Request body", `${F}/tutorial/body/`],
      ["FastAPI: Query parameters", `${F}/tutorial/query-params/`],
      ["FastAPI: Path parameters", `${F}/tutorial/path-params/`],
    ],
  }),
  q({
    slug: "pydantic-models-for-request-bodies",
    topic: "Pydantic",
    d: "easy",
    title:
      "How do you declare and validate a request body with Pydantic in FastAPI?",
    kw: [
      "pydantic basemodel",
      "request body",
      "validation",
      "json",
      "422 unprocessable",
    ],
    intent: "Checks body validation fundamentals.",
    short:
      "Define a class that inherits from `pydantic.BaseModel` with annotated attributes, and declare it as a parameter type of the path operation function. FastAPI reads the request's JSON, validates it against the model, converts types (for instance a numeric string to a float when allowed), and passes you a model instance with attribute access and editor support. If the data is missing a required field or has the wrong type, FastAPI does not call your function: it returns a `422 Unprocessable Entity` response with a JSON body that lists each error's location, message and type. Fields with defaults or `None` are optional.",
    detail: [
      "The model also appears as a JSON Schema in the generated documentation.",
      "Use `model_dump()` to convert an instance to a dict in Pydantic v2.",
      "Validation errors come from the model, so your function can trust its input.",
    ],
    ex: "A `POST /users` endpoint with a `UserCreate` model containing `email` and `password`.",
    code: [
      [
        "Body model",
        "python",
        `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\nclass Item(BaseModel):\n    name: str\n    price: float\n    in_stock: bool = True\n\napp = FastAPI()\n\n@app.post("/items")\nasync def create(item: Item):\n    return item\n\n# POST {"name": "pen"}  ->  422, "price" field required`,
        ["Missing `price` stops the request before the function runs."],
      ],
    ],
    mistakes: [
      "Re-validating data that FastAPI already validated.",
      "Putting secrets in response models.",
    ],
    follow: ["What does the 422 response contain?"],
    points: [
      "Subclass BaseModel",
      "Declare the model as a parameter",
      "Automatic validation and conversion",
      "422 with error details",
    ],
    notes: ["Describe the shape, get validation free."],
    src: [
      ["FastAPI: Request body", `${F}/tutorial/body/`],
      ["FastAPI: Handling errors", `${F}/tutorial/handling-errors/`],
    ],
  }),
  q({
    slug: "query-and-path-validation",
    topic: "Pydantic",
    d: "medium",
    title: "How do you add extra validation to query and path parameters?",
    kw: ["Query", "Path", "Annotated", "min_length", "ge le validation"],
    intent: "Checks additional validation constraints.",
    short:
      "Use `Query()` and `Path()` inside `Annotated` to attach constraints and metadata. For strings, `Query(min_length=3, max_length=50, pattern='^fixed')`; for numbers on a path, `Path(ge=1, le=1000)` (greater or equal, less or equal) or `gt` and `lt`. A parameter that can repeat, such as `?tag=a&tag=b`, is declared as a list: `Annotated[list[str] | None, Query()]`. You can also add `title`, `description` and `alias` for the documentation, or mark a parameter deprecated. Values that break a constraint produce a 422 response before your code runs, so the function can rely on valid input.",
    detail: [
      "Path parameters are always required, so they cannot have a default.",
      "Prefer `Annotated` style, which keeps defaults in the usual place.",
      "Validation rules appear in the OpenAPI schema and Swagger UI.",
    ],
    ex: "`GET /items/0` is rejected when the path parameter requires `ge=1`.",
    code: [
      [
        "Constraints",
        "python",
        `from typing import Annotated\nfrom fastapi import FastAPI, Path, Query\n\napp = FastAPI()\n\n@app.get("/items/{item_id}")\nasync def read(\n    item_id: Annotated[int, Path(ge=1)],\n    q: Annotated[str | None, Query(min_length=3, max_length=50)] = None,\n):\n    return {"id": item_id, "q": q}`,
        [
          "`Path(ge=1)` rejects zero and negatives.",
          "`Query` limits the string length.",
        ],
      ],
    ],
    mistakes: [
      "Trying to give a path parameter a default.",
      "Validating manually what constraints can express.",
    ],
    follow: ["How do you accept several values for one query parameter?"],
    points: [
      "Query and Path with Annotated",
      "min_length, max_length, pattern",
      "ge, gt, le, lt for numbers",
      "Lists for repeated parameters",
    ],
    notes: ["Constraints declared once."],
    src: [
      [
        "FastAPI: Query parameters and string validations",
        `${F}/tutorial/query-params-str-validations/`,
      ],
      [
        "FastAPI: Path parameters and numeric validations",
        `${F}/tutorial/path-params-numeric-validations/`,
      ],
    ],
  }),
  q({
    slug: "pydantic-field-constraints",
    topic: "Pydantic",
    d: "medium",
    title:
      "How do you add constraints and documentation to Pydantic model fields?",
    kw: [
      "pydantic Field",
      "field validation",
      "gt",
      "max_length",
      "description example",
    ],
    intent: "Checks field-level validation in models.",
    short:
      "Use `Field()` from Pydantic as the default value or in `Annotated` to add validation and metadata to model attributes: `price: float = Field(gt=0)`, `name: str = Field(min_length=1, max_length=100)`, and `description='...'` or `examples=[...]` for the documentation. Constraint failures produce the same 422 error format as other validation. For rules that involve several fields or custom logic, Pydantic's validators (`field_validator`, `model_validator`) let you write Python checks. Putting rules in the model keeps them in one place and makes them part of the generated schema, so API clients can see them.",
    detail: [
      "`EmailStr` and other special types need the matching optional dependency.",
      "Use `Optional` fields or `None` defaults to make fields optional.",
      "Keep business rules out of the schema when they depend on database state.",
    ],
    ex: "A `Product` model that rejects non-positive prices at the edge of the API.",
    code: [
      [
        "Field constraints",
        "python",
        `from pydantic import BaseModel, Field\n\nclass Product(BaseModel):\n    name: str = Field(min_length=1, max_length=100)\n    price: float = Field(gt=0, description="Price in INR")\n    quantity: int = Field(default=1, ge=1)`,
        [
          "Each field states its own limits.",
          "The description appears in the docs.",
        ],
      ],
    ],
    mistakes: [
      "Duplicating validation in the endpoint body.",
      "Putting database-dependent rules in static constraints.",
    ],
    follow: ["Where would you write a rule involving two fields?"],
    points: [
      "Field() adds constraints",
      "Descriptions and examples feed the docs",
      "Validators for custom rules",
      "Same 422 format",
    ],
    notes: ["Rules live on the model."],
    src: [
      ["FastAPI: Body - Fields", `${F}/tutorial/body-fields/`],
      [
        "FastAPI: Declare request example data",
        `${F}/tutorial/schema-extra-example/`,
      ],
    ],
  }),
  q({
    slug: "nested-models-and-collections",
    topic: "Pydantic",
    d: "medium",
    title:
      "How do nested models, lists and sets work in FastAPI request bodies?",
    kw: [
      "nested models",
      "list of models",
      "set type",
      "pydantic nesting",
      "deeply nested body",
    ],
    intent: "Checks modelling of structured JSON.",
    short:
      "A model field can have another Pydantic model as its type, which lets you describe nested JSON: `class Order(BaseModel): customer: Customer; items: list[Item]`. FastAPI validates every level, reports errors with the full location path (such as `body.items[1].price`) and documents the nested schema. Typed collections work as expected: `list[str]` for arrays, `set[str]` to drop duplicates, `dict[str, float]` for maps with typed values. A body can also be a list of models at the top level (`list[Item]`). The validation and the generated docs follow your type annotations exactly.",
    detail: [
      "Use `HttpUrl` and similar Pydantic types for stricter fields.",
      "Models can be reused in several endpoints.",
      "Deep nesting makes clients harder to use; keep payloads simple where possible.",
    ],
    ex: "An order containing a customer object and a list of line items.",
    code: [
      [
        "Nested body",
        "python",
        `from pydantic import BaseModel\n\nclass Item(BaseModel):\n    sku: str\n    qty: int\n\nclass Order(BaseModel):\n    customer: str\n    items: list[Item]\n    tags: set[str] = set()\n\n# error path example: body -> items -> 1 -> qty`,
        ["Each item in the list is validated as an `Item`."],
      ],
    ],
    mistakes: [
      "Using untyped list or dict, losing validation.",
      "Over-nesting API payloads.",
    ],
    follow: ["How does FastAPI report an error inside a nested item?"],
    points: [
      "Models as field types",
      "list, set and dict typed collections",
      "Errors show the full location",
      "Documented automatically",
    ],
    notes: ["Type the whole tree."],
    src: [
      ["FastAPI: Body - Nested models", `${F}/tutorial/body-nested-models/`],
      ["FastAPI: Python types intro", `${F}/python-types/`],
    ],
  }),
  q({
    slug: "response-model-filters-output",
    topic: "Pydantic",
    d: "medium",
    title:
      "What does `response_model` do, and how does it keep sensitive data out of responses?",
    kw: [
      "response_model",
      "output filtering",
      "hide password",
      "serialization",
      "return type",
    ],
    intent: "Checks safe response handling.",
    short:
      "Declaring a response model (with `response_model=UserOut` or a return type annotation) makes FastAPI validate, convert and filter the returned data to that model's fields before sending it. If your function returns a database object or a model with a `password_hash` field, the output model that does not declare it removes it from the response, which prevents accidental leaks. The response model also drives the documented response schema and the JSON serialisation. Options like `response_model_exclude_unset` omit fields that were not set. Use separate input and output models rather than one model with everything.",
    detail: [
      "The function can return a richer object than the response model exposes.",
      "Returned data that does not match the model raises a server error, which catches bugs.",
      "Return types are the modern alternative to the `response_model` argument.",
    ],
    ex: "A `GET /users/{id}` that returns database rows but exposes only `id`, `name` and `email`.",
    code: [
      [
        "Filtering output",
        "python",
        `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\nclass UserIn(BaseModel):\n    name: str\n    password: str\n\nclass UserOut(BaseModel):\n    name: str\n\napp = FastAPI()\n\n@app.post("/users", response_model=UserOut)\nasync def create(user: UserIn):\n    return user   # password is filtered out`,
        ["`UserOut` has no password field, so it is never sent."],
      ],
    ],
    mistakes: [
      "Returning the input model that includes secrets.",
      "Skipping response models for convenience.",
    ],
    follow: ["Why use separate input and output models?"],
    points: [
      "Output validated and filtered",
      "Prevents leaking fields",
      "Drives documentation",
      "Separate in/out models",
    ],
    notes: ["Declare what leaves the API."],
    src: [
      ["FastAPI: Response model", `${F}/tutorial/response-model/`],
      ["FastAPI: Extra models", `${F}/tutorial/extra-models/`],
    ],
  }),
  q({
    slug: "separate-models-for-create-read-update",
    topic: "Pydantic",
    d: "medium",
    title:
      "Why do FastAPI projects often use separate models for create, update and read?",
    kw: [
      "extra models",
      "UserCreate UserRead",
      "partial update",
      "model inheritance",
      "api schema design",
    ],
    intent: "Checks API model design.",
    short:
      "The data a client sends to create something differs from what it may update and from what the API returns. A creation model includes a plain password; the stored model has a password hash; the read model has an `id` and omits secrets; an update model makes fields optional for partial updates. Using separate models, possibly sharing a base class to avoid repetition, keeps each endpoint's contract precise, prevents clients from setting server-controlled fields like `id`, and keeps sensitive fields out of responses. FastAPI's documentation shows this with `UserIn`, `UserOut` and `UserInDB` and model inheritance.",
    detail: [
      "For partial updates, use `exclude_unset=True` when dumping so absent fields are not overwritten.",
      "A shared base model holds common fields.",
      "Mapping between models is explicit and easy to test.",
    ],
    ex: "`UserCreate` (email, password), `UserRead` (id, email), `UserUpdate` (optional email).",
    mistakes: [
      "Using the database model directly as the API model.",
      "Letting clients send fields like id or role.",
    ],
    follow: ["How do you support partial updates?"],
    points: [
      "Different shapes for different operations",
      "Read models hide secrets",
      "Update models make fields optional",
      "Base models reduce repetition",
    ],
    notes: ["One model per contract."],
    src: [
      ["FastAPI: Extra models", `${F}/tutorial/extra-models/`],
      ["FastAPI: Body updates", `${F}/tutorial/body-updates/`],
    ],
  }),
  q({
    slug: "validation-errors-422-and-custom-handlers",
    topic: "Pydantic",
    d: "easy",
    title:
      "What happens on invalid input, and how do you customise error responses?",
    kw: [
      "422 error",
      "RequestValidationError",
      "exception handler",
      "HTTPException",
      "error format",
    ],
    intent: "Checks error handling.",
    short:
      "When request data fails validation, FastAPI returns `422 Unprocessable Entity` with a JSON body whose `detail` is a list of errors, each with a `loc` (where the error is, such as `['body', 'price']`), a `msg` and a `type`. To signal your own errors raise `HTTPException(status_code=404, detail='Item not found')`; it produces a JSON response with that status. You can override how errors are rendered with `@app.exception_handler(RequestValidationError)` or define handlers for your own exception classes. Return consistent error shapes for clients, and avoid leaking internal details in error messages.",
    detail: [
      "`HTTPException` accepts extra `headers`, useful for authentication challenges.",
      "Unhandled exceptions produce a 500 response.",
      "Handlers can log errors centrally.",
    ],
    ex: "A lookup endpoint raising 404 when an item id does not exist.",
    code: [
      [
        "HTTPException and a handler",
        "python",
        `from fastapi import FastAPI, HTTPException\nfrom fastapi.exceptions import RequestValidationError\nfrom fastapi.responses import JSONResponse\n\napp = FastAPI()\n\n@app.exception_handler(RequestValidationError)\nasync def on_invalid(request, exc):\n    return JSONResponse(status_code=422, content={"errors": exc.errors()})\n\n@app.get("/items/{item_id}")\nasync def get(item_id: int):\n    raise HTTPException(status_code=404, detail="Item not found")`,
        [
          "The handler reshapes validation errors.",
          "`HTTPException` sets status and message.",
        ],
      ],
    ],
    mistakes: [
      "Returning 200 with an error message.",
      "Exposing stack traces to clients.",
    ],
    follow: ["Which status code does a validation failure return?"],
    points: [
      "422 for invalid input",
      "detail list with loc, msg, type",
      "HTTPException for your own errors",
      "Custom exception handlers",
    ],
    notes: ["Raise, don't return errors."],
    src: [
      ["FastAPI: Handling errors", `${F}/tutorial/handling-errors/`],
      ["FastAPI: Response status code", `${F}/tutorial/response-status-code/`],
    ],
  }),
  q({
    slug: "forms-and-file-uploads",
    topic: "Pydantic",
    d: "easy",
    title: "How do you handle form data and file uploads in FastAPI?",
    kw: ["Form", "UploadFile", "File", "python-multipart", "multipart form"],
    intent: "Checks non-JSON request handling.",
    short:
      "For HTML form data declare parameters with `Form()`, and for uploads use `File()` or the `UploadFile` type: `async def upload(file: UploadFile)`. The `python-multipart` package must be installed to parse form data and files. `UploadFile` holds the file in memory up to a limit and spills to disk beyond it, provides async methods like `read()`, plus `filename` and `content_type`, and is better than declaring `bytes` for large files. You cannot mix a JSON body with `Form` or `File` parameters in the same endpoint, since the request has one encoding. Validate size and type yourself before saving.",
    detail: [
      "Never trust the client's filename or content type; sanitise paths.",
      "Stream big uploads to storage instead of reading them fully into memory.",
      "Use `list[UploadFile]` to accept several files.",
    ],
    ex: "A profile-picture upload endpoint that checks the content type and saves to object storage.",
    code: [
      [
        "Upload",
        "python",
        `from fastapi import FastAPI, File, Form, UploadFile\n\napp = FastAPI()\n\n@app.post("/upload")\nasync def upload(title: str = Form(), file: UploadFile = File()):\n    data = await file.read()\n    return {"title": title, "filename": file.filename, "size": len(data)}`,
        [
          "`Form` reads a form field.",
          "`UploadFile` represents the uploaded file.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to install python-multipart.",
      "Using the client filename as a path.",
    ],
    follow: ["Can you combine a JSON body with file upload parameters?"],
    points: [
      "Form() and File()/UploadFile",
      "Needs python-multipart",
      "No JSON body mixed in",
      "Validate and sanitise uploads",
    ],
    notes: ["Forms are not JSON."],
    src: [
      ["FastAPI: Form data", `${F}/tutorial/request-forms/`],
      ["FastAPI: Request files", `${F}/tutorial/request-files/`],
    ],
  }),
  q({
    slug: "settings-with-environment-variables",
    topic: "Pydantic",
    d: "medium",
    title: "How do you manage configuration and secrets in a FastAPI app?",
    kw: [
      "BaseSettings",
      "pydantic-settings",
      "environment variables",
      "dotenv",
      "lru_cache",
    ],
    intent: "Checks configuration management.",
    short:
      "Keep configuration out of code and read it from environment variables. The FastAPI documentation uses Pydantic's settings support (the `pydantic-settings` package): define a `Settings(BaseSettings)` class with typed attributes such as `database_url: str` and `debug: bool = False`; values are read from the environment (and optionally a `.env` file), converted to the declared types and validated, so a missing or malformed setting fails at startup. Create the settings object once, typically in a function wrapped with `functools.lru_cache`, and expose it as a dependency with `Depends(get_settings)`, which also makes it easy to override in tests.",
    detail: [
      "Never commit `.env` files containing secrets.",
      "Different environments use different variable values, not different code.",
      "Typed settings catch typos early.",
    ],
    ex: "A production deployment sets `DATABASE_URL` in its environment while tests use an in-memory database.",
    code: [
      [
        "Settings dependency",
        "python",
        `from functools import lru_cache\nfrom fastapi import Depends, FastAPI\nfrom pydantic_settings import BaseSettings\n\nclass Settings(BaseSettings):\n    app_name: str = "demo"\n    database_url: str\n\n@lru_cache\ndef get_settings() -> Settings:\n    return Settings()\n\napp = FastAPI()\n\n@app.get("/info")\nasync def info(settings: Settings = Depends(get_settings)):\n    return {"app": settings.app_name}`,
        [
          "Values come from environment variables.",
          "The dependency can be overridden in tests.",
        ],
      ],
    ],
    mistakes: [
      "Hard-coding secrets.",
      "Reading environment variables all over the code.",
    ],
    follow: ["Why cache the settings function?"],
    points: [
      "Environment variables for config",
      "BaseSettings validates and converts",
      "lru_cache creates one instance",
      "Expose as a dependency",
    ],
    notes: ["Typed, validated configuration."],
    src: [
      [
        "FastAPI: Settings and environment variables",
        `${F}/advanced/settings/`,
      ],
      [
        "FastAPI: Testing dependencies with overrides",
        `${F}/advanced/testing-dependencies/`,
      ],
    ],
  }),
  q({
    slug: "dependency-injection-with-depends",
    topic: "Dependencies",
    d: "easy",
    title:
      "What is dependency injection in FastAPI, and how does `Depends` work?",
    kw: [
      "Depends",
      "dependency injection",
      "reusable logic",
      "dependency callable",
      "shared parameters",
    ],
    intent: "A core FastAPI concept.",
    short:
      "A dependency is a callable (usually a function) whose result FastAPI computes and passes to your path operation function. You declare it with `Depends`: `async def read(commons: Annotated[dict, Depends(common_parameters)])`. FastAPI calls the dependency for each request, resolving its own parameters (query, headers, other dependencies) the same way as for endpoints, and injects the return value. Use dependencies to share logic: pagination parameters, getting a database session, authenticating the current user, checking permissions. They reduce duplication, can be nested, and appear in the OpenAPI documentation when they declare parameters. They are also easy to replace in tests.",
    detail: [
      "Dependencies can be sync or async functions.",
      "The same dependency is evaluated once per request even if used several times.",
      "Raising `HTTPException` in a dependency stops the request.",
    ],
    ex: "A `get_current_user` dependency used by every protected endpoint.",
    code: [
      [
        "Shared pagination",
        "python",
        `from typing import Annotated\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\nasync def paging(skip: int = 0, limit: int = 10):\n    return {"skip": skip, "limit": limit}\n\n@app.get("/items")\nasync def items(p: Annotated[dict, Depends(paging)]):\n    return p`,
        [
          "`skip` and `limit` become query parameters of every endpoint that uses it.",
        ],
      ],
    ],
    mistakes: [
      "Duplicating parameter logic in each endpoint.",
      "Calling the dependency function yourself instead of using Depends.",
    ],
    follow: ["How often is a dependency evaluated per request?"],
    points: [
      "Callable resolved per request",
      "Injected via Depends",
      "Can declare parameters",
      "Great for auth, DB sessions, paging",
    ],
    notes: ["Declare what you need."],
    src: [
      ["FastAPI: Dependencies", `${F}/tutorial/dependencies/`],
      [
        "FastAPI: Classes as dependencies",
        `${F}/tutorial/dependencies/classes-as-dependencies/`,
      ],
    ],
  }),
  q({
    slug: "dependencies-with-yield",
    topic: "Dependencies",
    d: "medium",
    title:
      "How do dependencies with `yield` manage resources like database sessions?",
    kw: [
      "dependency yield",
      "database session",
      "cleanup",
      "resource lifecycle",
      "context manager",
    ],
    intent: "Checks resource management with dependencies.",
    short:
      "A dependency written as a generator with `yield` runs its setup code before the endpoint, provides the yielded value to it, and runs the code after `yield` for cleanup once the request has been handled. This is the standard way to open a database session per request and make sure it is closed even when an exception occurs, by wrapping the `yield` in `try`/`finally` or using a `with` block. It works for sync and async dependencies. One session per request keeps requests isolated. Only the cleanup should follow the `yield`; do not rely on sending extra data to the client from there.",
    detail: [
      "FastAPI turns the generator into a context manager internally.",
      "Dependencies with `yield` can also depend on other dependencies.",
      "Exception handling around the `yield` allows rollbacks.",
    ],
    ex: "A `get_session` dependency that yields a session and always closes it.",
    code: [
      [
        "Session per request",
        "python",
        `from typing import Annotated\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\ndef get_db():\n    db = SessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()\n\n@app.get("/users")\ndef users(db: Annotated[Session, Depends(get_db)]):\n    return db.query(User).all()`,
        ["`finally` closes the session after the request."],
      ],
    ],
    mistakes: [
      "Sharing one global session across requests.",
      "Forgetting try/finally around yield.",
    ],
    follow: ["Why use a generator dependency instead of a plain function?"],
    points: [
      "Setup, yield, cleanup",
      "One resource per request",
      "Use try/finally",
      "Sync and async supported",
    ],
    notes: ["Open, yield, close."],
    src: [
      [
        "FastAPI: Dependencies with yield",
        `${F}/tutorial/dependencies/dependencies-with-yield/`,
      ],
      ["FastAPI: SQL databases", `${F}/tutorial/sql-databases/`],
    ],
  }),
  q({
    slug: "sub-dependencies-and-global-dependencies",
    topic: "Dependencies",
    d: "medium",
    title:
      "How do sub-dependencies and router-level or app-level dependencies work?",
    kw: [
      "sub-dependencies",
      "dependencies parameter",
      "global dependencies",
      "router dependencies",
      "dependency tree",
    ],
    intent: "Checks composition of dependencies.",
    short:
      "A dependency can itself declare dependencies, forming a tree that FastAPI resolves: for example `get_current_active_user` depends on `get_current_user`, which depends on `get_token`. Each shared dependency is evaluated once per request. When you need a check but not its return value, such as verifying an API key, add it to the decorator: `@app.get('/x', dependencies=[Depends(verify_key)])`. The `dependencies` argument also exists on `APIRouter` and on `FastAPI(...)`, applying the check to every endpoint of the router or application. This keeps cross-cutting rules like authentication in one place instead of repeated in each function.",
    detail: [
      "Order of the list matters when dependencies have side effects.",
      "Dependencies from routers apply to all included routes.",
      "Overrides in tests apply anywhere in the tree.",
    ],
    ex: "An admin router where every route requires the `require_admin` dependency.",
    code: [
      [
        "Router-level dependency",
        "python",
        `from fastapi import APIRouter, Depends, HTTPException\n\nasync def require_admin(role: str = "user"):\n    if role != "admin":\n        raise HTTPException(status_code=403, detail="Admins only")\n\nrouter = APIRouter(prefix="/admin", dependencies=[Depends(require_admin)])\n\n@router.get("/stats")\nasync def stats():\n    return {"ok": True}`,
        ["Every route of the router runs the check first."],
      ],
    ],
    mistakes: [
      "Repeating auth checks in each endpoint.",
      "Assuming the dependency result is available when using dependencies=[...].",
    ],
    follow: ["How do you apply a dependency to the entire app?"],
    points: [
      "Dependencies can depend on others",
      "Evaluated once per request",
      "dependencies=[...] for checks without values",
      "Works on routers and the app",
    ],
    notes: ["Centralise cross-cutting checks."],
    src: [
      [
        "FastAPI: Sub-dependencies",
        `${F}/tutorial/dependencies/sub-dependencies/`,
      ],
      [
        "FastAPI: Global dependencies",
        `${F}/tutorial/dependencies/global-dependencies/`,
      ],
      [
        "FastAPI: Dependencies in path operation decorators",
        `${F}/tutorial/dependencies/dependencies-in-path-operation-decorators/`,
      ],
    ],
  }),
  q({
    slug: "oauth2-password-bearer-and-jwt",
    topic: "Dependencies",
    d: "hard",
    title:
      "How does authentication with OAuth2 password flow and JWT work in FastAPI?",
    kw: [
      "OAuth2PasswordBearer",
      "jwt",
      "access token",
      "password hashing",
      "security dependency",
    ],
    intent: "Checks token-based authentication design.",
    short:
      "The documented pattern: a login endpoint receives the username and password (form data through `OAuth2PasswordRequestForm`), verifies the password against a stored hash, and returns a signed JWT access token. Clients then send `Authorization: Bearer <token>`. A dependency using `OAuth2PasswordBearer(tokenUrl='token')` extracts the token, decodes and verifies the signature and expiry, loads the user and raises 401 if anything is wrong; endpoints depend on that `get_current_user`. Passwords must be stored only as salted hashes from a proper password-hashing library, the signing secret must be kept secret, and tokens should expire. `OAuth2PasswordBearer` also adds the Authorize button to the Swagger docs.",
    detail: [
      "A JWT is signed, not encrypted: do not put secrets in it.",
      "Use HTTPS so tokens are not exposed in transit.",
      "Consider refresh tokens and revocation for real applications; or use a dedicated identity provider.",
    ],
    ex: "`GET /users/me` is available only when a valid bearer token is sent.",
    mistakes: [
      "Storing plain-text passwords.",
      "Using long-lived tokens with a weak or hard-coded secret.",
    ],
    follow: ["Is the content of a JWT confidential?"],
    points: [
      "Login returns a signed token",
      "Bearer token on each request",
      "Dependency decodes and verifies it",
      "Hash passwords, protect the secret",
    ],
    notes: ["Verify the token in a dependency."],
    src: [
      [
        "FastAPI: OAuth2 with Password (and hashing), Bearer with JWT tokens",
        `${F}/tutorial/security/oauth2-jwt/`,
      ],
      [
        "FastAPI: Security - first steps",
        `${F}/tutorial/security/first-steps/`,
      ],
      [
        "FastAPI: Simple OAuth2 with Password and Bearer",
        `${F}/tutorial/security/simple-oauth2/`,
      ],
    ],
  }),
  q({
    slug: "cors-middleware-configuration",
    topic: "Dependencies",
    d: "medium",
    title: "How do you configure CORS in FastAPI?",
    kw: [
      "CORS",
      "CORSMiddleware",
      "allow_origins",
      "allow_credentials",
      "preflight",
    ],
    intent: "Checks cross-origin handling.",
    short:
      "Browsers block JavaScript on one origin from reading responses from another unless the server allows it with CORS headers. In FastAPI add `CORSMiddleware` with `app.add_middleware(CORSMiddleware, allow_origins=['https://app.example.com'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])`. Browsers send a preflight `OPTIONS` request for non-simple requests, which the middleware answers. List the specific origins you trust; the documentation notes that with `allow_credentials=True` the wildcard `'*'` for origins is not allowed, so you must name them. CORS is a browser rule, not authentication: it does not protect the API from non-browser clients.",
    detail: [
      "An origin is scheme, host and port together.",
      "In development you may allow `http://localhost:3000`; in production, only real front-end origins.",
      "Errors often show as 'blocked by CORS policy' in the browser console.",
    ],
    ex: "A React app on one domain calling an API on another needs its origin allowed.",
    code: [
      [
        "CORSMiddleware",
        "python",
        `from fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\n\napp = FastAPI()\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=["https://app.example.com"],\n    allow_credentials=True,\n    allow_methods=["GET", "POST"],\n    allow_headers=["Authorization", "Content-Type"],\n)`,
        ["Only the listed origin may call from a browser."],
      ],
    ],
    mistakes: [
      "Using * with credentials.",
      "Treating CORS as an access control mechanism.",
    ],
    follow: ["What is a preflight request?"],
    points: [
      "Browser same-origin rule",
      "CORSMiddleware with allowed origins",
      "Preflight OPTIONS handled",
      "Not a substitute for authentication",
    ],
    notes: ["Name the origins you trust."],
    src: [
      ["FastAPI: CORS (Cross-Origin Resource Sharing)", `${F}/tutorial/cors/`],
      ["FastAPI: Middleware", `${F}/tutorial/middleware/`],
    ],
  }),
  q({
    slug: "background-tasks",
    topic: "Async endpoints",
    d: "medium",
    title: "What are FastAPI background tasks, and when are they not enough?",
    kw: [
      "BackgroundTasks",
      "add_task",
      "after response",
      "send email",
      "celery",
    ],
    intent: "Checks use of post-response work.",
    short:
      "`BackgroundTasks` lets an endpoint schedule work to run after the response has been sent: add a parameter `background_tasks: BackgroundTasks` and call `background_tasks.add_task(send_email, address, message=...)`. The client gets its response immediately, and the function then runs in the same process, as a normal function in a threadpool or a coroutine in the event loop. This suits small jobs such as sending a notification or writing an audit log. For heavy computation, long jobs, retries or work that must survive a restart, the FastAPI documentation points to bigger tools such as Celery, because background tasks are not durable and share the process's resources.",
    detail: [
      "If the server stops, pending tasks are lost.",
      "Tasks can be added from dependencies too, and are combined.",
      "Errors in a background task do not change the already-sent response.",
    ],
    ex: "Returning 202 immediately and sending a welcome email afterwards.",
    code: [
      [
        "add_task",
        "python",
        `from fastapi import BackgroundTasks, FastAPI\n\napp = FastAPI()\n\ndef write_log(message: str):\n    with open("log.txt", "a") as f:\n        f.write(message + "\\n")\n\n@app.post("/signup")\nasync def signup(email: str, tasks: BackgroundTasks):\n    tasks.add_task(write_log, f"signup {email}")\n    return {"status": "ok"}`,
        ["The response is sent first, then `write_log` runs."],
      ],
    ],
    mistakes: [
      "Running heavy CPU work as a background task.",
      "Assuming tasks survive a crash.",
    ],
    follow: ["What would you use for long-running or critical jobs?"],
    points: [
      "Runs after the response",
      "Same process",
      "Small jobs only",
      "Not durable",
    ],
    notes: ["After-response, in-process."],
    src: [
      ["FastAPI: Background tasks", `${F}/tutorial/background-tasks/`],
      ["FastAPI: Async and await", `${F}/async/`],
    ],
  }),
  q({
    slug: "lifespan-startup-and-shutdown",
    topic: "Async endpoints",
    d: "medium",
    title: "How do you run code at application startup and shutdown?",
    kw: [
      "lifespan",
      "startup shutdown",
      "asynccontextmanager",
      "resource initialization",
      "on_event",
    ],
    intent: "Checks application lifecycle handling.",
    short:
      "Use a `lifespan` async context manager passed to `FastAPI(lifespan=lifespan)`. The code before `yield` runs once at startup, for example loading a machine-learning model, creating a connection pool or warming a cache; the code after `yield` runs at shutdown to release those resources. Store shared objects on `app.state` or in a module-level dictionary. This replaces the older `@app.on_event('startup')` and `'shutdown'` handlers, which the documentation marks as deprecated in favour of lifespan. Lifespan runs once per application process, so with several worker processes each one runs it.",
    detail: [
      "A failure at startup stops the application, which is what you want for missing resources.",
      "When testing, entering the `TestClient` as a context manager runs the lifespan.",
      "Keep startup work fast so deployments become healthy sooner.",
    ],
    ex: "Loading a large model once at startup instead of on every request.",
    code: [
      [
        "lifespan",
        "python",
        `from contextlib import asynccontextmanager\nfrom fastapi import FastAPI\n\nresources = {}\n\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    resources["model"] = "loaded"      # startup\n    yield\n    resources.clear()                  # shutdown\n\napp = FastAPI(lifespan=lifespan)`,
        ["Before `yield`: startup.", "After `yield`: shutdown."],
      ],
    ],
    mistakes: [
      "Loading heavy resources on each request.",
      "Using deprecated on_event in new code.",
    ],
    follow: ["How many times does lifespan run with four workers?"],
    points: [
      "lifespan async context manager",
      "Before yield: startup",
      "After yield: shutdown",
      "Replaces on_event",
    ],
    notes: ["Set up once, tear down once."],
    src: [
      ["FastAPI: Lifespan events", `${F}/advanced/events/`],
      ["FastAPI: Testing events", `${F}/advanced/testing-events/`],
    ],
  }),
  q({
    slug: "apirouter-and-bigger-applications",
    topic: "Dependencies",
    d: "medium",
    title:
      "How do you structure a larger FastAPI application with `APIRouter`?",
    kw: [
      "APIRouter",
      "include_router",
      "prefix tags",
      "project structure",
      "modular app",
    ],
    intent: "Checks project organisation.",
    short:
      "Split the application into modules, each with an `APIRouter` that groups related path operations: `router = APIRouter(prefix='/items', tags=['items'])`. The main file creates the `FastAPI` app and attaches routers with `app.include_router(items.router)`. A router can carry shared settings such as a `prefix`, `tags`, `dependencies` and `responses`, which apply to all of its routes. Typical layout: a package with `main.py`, a `routers/` directory, `dependencies.py`, schemas and models, and an `internal/` area. Routers can be included with extra prefixes or dependencies, so the same router can be mounted at different places.",
    detail: [
      "Tags group endpoints in the documentation.",
      "Use relative imports inside the package.",
      "Keep business logic out of route functions to make testing easier.",
    ],
    ex: "`users.py`, `items.py` and `admin.py` routers included in `main.py`.",
    code: [
      [
        "Router and include",
        "python",
        `# routers/items.py\nfrom fastapi import APIRouter\nrouter = APIRouter(prefix="/items", tags=["items"])\n\n@router.get("/")\nasync def list_items():\n    return []\n\n# main.py\nfrom fastapi import FastAPI\nfrom .routers import items\napp = FastAPI()\napp.include_router(items.router)`,
        ["The router defines its own prefix and tags."],
      ],
    ],
    mistakes: [
      "Putting all endpoints in one file.",
      "Repeating prefixes on every route.",
    ],
    follow: ["What can a router share across its routes?"],
    points: [
      "APIRouter groups routes",
      "include_router attaches them",
      "Shared prefix, tags, dependencies",
      "Package layout",
    ],
    notes: ["Split by feature."],
    src: [
      [
        "FastAPI: Bigger applications - multiple files",
        `${F}/tutorial/bigger-applications/`,
      ],
      ["FastAPI: Metadata and docs URLs", `${F}/tutorial/metadata/`],
    ],
  }),
  q({
    slug: "async-def-versus-def-endpoints",
    topic: "Async endpoints",
    d: "medium",
    title:
      "When should a FastAPI endpoint use `async def` and when plain `def`?",
    kw: [
      "async def",
      "def endpoint",
      "threadpool",
      "blocking code",
      "event loop",
    ],
    intent: "A top FastAPI question on concurrency.",
    short:
      "Use `async def` when the code inside awaits async libraries (an async HTTP client, an async database driver). FastAPI runs it directly on the event loop. Use plain `def` when you call blocking libraries that do not support `await`, such as a synchronous database driver or `requests`: FastAPI runs `def` endpoints in an external threadpool so they do not block the event loop. If you are unsure, the documentation says to use normal `def`. The mistake to avoid is calling blocking code inside an `async def` endpoint, which freezes the event loop and stalls every other request. Dependencies follow the same rules.",
    detail: [
      "CPU-heavy work blocks either way; send it to worker processes.",
      "You can mix `def` and `async def` endpoints in one app.",
      "Use `run_in_threadpool` or similar to call blocking functions from async code.",
    ],
    ex: "An endpoint calling `requests.get` should be `def`, or use an async client with `async def`.",
    code: [
      [
        "Right tool for each",
        "python",
        `import httpx\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/async")\nasync def fetch():\n    async with httpx.AsyncClient() as client:\n        r = await client.get("https://example.com")\n    return {"status": r.status_code}\n\n@app.get("/sync")\ndef compute():\n    import time\n    time.sleep(1)       # blocking, but runs in a threadpool\n    return {"done": True}`,
        [
          "`async def` awaits an async client.",
          "`def` may block safely in the threadpool.",
        ],
      ],
    ],
    mistakes: [
      "Blocking calls inside async def.",
      "Making everything async without async libraries.",
    ],
    follow: ["Where does a plain def endpoint run?"],
    points: [
      "async def for awaitable libraries",
      "def for blocking libraries",
      "def runs in a threadpool",
      "Blocking in async def stalls everything",
    ],
    notes: ["Match endpoint type to the libraries."],
    src: [
      ["FastAPI: Concurrency and async / await", `${F}/async/`],
      ["FastAPI: Deployment concepts", `${F}/deployment/concepts/`],
    ],
  }),
  q({
    slug: "websockets-in-fastapi",
    topic: "Async endpoints",
    d: "medium",
    title: "How do you add a WebSocket endpoint in FastAPI?",
    kw: [
      "websocket",
      "WebSocketDisconnect",
      "accept",
      "real-time",
      "receive_text",
    ],
    intent: "Checks real-time communication support.",
    short:
      "Declare a WebSocket route with `@app.websocket('/ws')` and a function that takes a `WebSocket` parameter. Call `await websocket.accept()` to complete the handshake, then loop: `data = await websocket.receive_text()` and `await websocket.send_text(...)` (or the JSON and bytes variants). When the client disconnects, FastAPI raises `WebSocketDisconnect`, which you catch to clean up. WebSockets keep a persistent two-way connection, which suits chat, live dashboards and notifications. For several connected clients keep a connection manager that stores them and broadcasts messages. Authentication is usually done with a token query parameter or cookie checked before accepting.",
    detail: [
      "Each connection holds resources; limit and monitor them.",
      "With several worker processes a broadcast reaches only clients on the same process unless you add a shared message broker.",
      "Server-sent events are simpler when only the server pushes data.",
    ],
    ex: "A live-notifications channel pushing updates to a browser tab.",
    code: [
      [
        "Echo socket",
        "python",
        `from fastapi import FastAPI, WebSocket, WebSocketDisconnect\n\napp = FastAPI()\n\n@app.websocket("/ws")\nasync def ws(websocket: WebSocket):\n    await websocket.accept()\n    try:\n        while True:\n            text = await websocket.receive_text()\n            await websocket.send_text(f"echo: {text}")\n    except WebSocketDisconnect:\n        print("client left")`,
        [
          "`accept` completes the handshake.",
          "The loop ends when the client disconnects.",
        ],
      ],
    ],
    mistakes: [
      "Not handling WebSocketDisconnect.",
      "Assuming broadcasts reach clients on other worker processes.",
    ],
    follow: ["What do you need to broadcast across multiple processes?"],
    points: [
      "@app.websocket route",
      "accept, receive, send",
      "Catch WebSocketDisconnect",
      "Manager for multiple clients",
    ],
    notes: ["A persistent two-way channel."],
    src: [
      ["FastAPI: WebSockets", `${F}/advanced/websockets/`],
      ["FastAPI: Concurrency and async / await", `${F}/async/`],
    ],
  }),
  q({
    slug: "http-middleware-in-fastapi",
    topic: "Async endpoints",
    d: "medium",
    title:
      "How do you write middleware in FastAPI, and how does it differ from a dependency?",
    kw: [
      "middleware",
      "call_next",
      "request timing",
      "add_middleware",
      "dependency vs middleware",
    ],
    intent: "Checks cross-cutting code placement.",
    short:
      "Middleware wraps every request and response of the application. Define it with the `@app.middleware('http')` decorator on an async function `(request, call_next)`: code before `await call_next(request)` runs before the endpoint, and code after it can modify the response, for example to add an `X-Process-Time` header or to log. Third-party and built-in middleware such as `CORSMiddleware` are added with `app.add_middleware`. Unlike dependencies, middleware runs for all routes (including docs and unknown paths), works at the HTTP level and cannot use the endpoint's parameters; dependencies are per route, can read validated parameters and show up in the OpenAPI docs.",
    detail: [
      "Middleware added last runs first on the way in.",
      "Heavy work in middleware slows every request.",
      "Use dependencies for authentication that needs the user and per-route rules.",
    ],
    ex: "A middleware measuring request duration and logging it with the path.",
    code: [
      [
        "Timing middleware",
        "python",
        `import time\nfrom fastapi import FastAPI, Request\n\napp = FastAPI()\n\n@app.middleware("http")\nasync def add_time(request: Request, call_next):\n    start = time.perf_counter()\n    response = await call_next(request)\n    response.headers["X-Process-Time"] = str(time.perf_counter() - start)\n    return response`,
        ["`call_next` runs the rest of the stack."],
      ],
    ],
    mistakes: [
      "Putting per-route logic in global middleware.",
      "Doing slow work in middleware.",
    ],
    follow: ["When would you prefer a dependency?"],
    points: [
      "Wraps all requests",
      "call_next",
      "add_middleware for packaged middleware",
      "Dependencies are per route",
    ],
    notes: ["Global wrapper around the app."],
    src: [
      ["FastAPI: Middleware", `${F}/tutorial/middleware/`],
      ["FastAPI: Advanced middleware", `${F}/advanced/middleware/`],
    ],
  }),
  q({
    slug: "status-codes-and-http-semantics",
    topic: "OpenAPI",
    d: "easy",
    title:
      "How do you set HTTP status codes and follow REST conventions in FastAPI?",
    kw: [
      "status_code",
      "201 created",
      "204 no content",
      "HTTPException",
      "status module",
    ],
    intent: "Checks use of correct status codes.",
    short:
      "Pass `status_code` to the path operation decorator: `@app.post('/items', status_code=201)`, or use named constants from `fastapi.status` such as `status.HTTP_201_CREATED`, for readability. The default is 200. Common choices: 201 after creating something, 204 with no response body after a delete, 400 for bad requests, 401 when authentication is missing or invalid, 403 when the user may not do it, 404 when the resource does not exist, 409 for conflicts and 422 for validation errors, which FastAPI produces itself. Raise `HTTPException(status_code=...)` for error cases. The status codes also appear in the generated documentation.",
    detail: [
      "A 204 response must not have a body.",
      "Use `responses=` to document additional possible statuses.",
      "Choose codes consistently across the API.",
    ],
    ex: "`DELETE /items/5` returns 204; deleting a missing item returns 404.",
    code: [
      [
        "Status codes",
        "python",
        `from fastapi import FastAPI, HTTPException, status\n\napp = FastAPI()\nitems = {}\n\n@app.post("/items", status_code=status.HTTP_201_CREATED)\nasync def create(name: str):\n    items[name] = {"name": name}\n    return items[name]\n\n@app.delete("/items/{name}", status_code=status.HTTP_204_NO_CONTENT)\nasync def delete(name: str):\n    if name not in items:\n        raise HTTPException(status_code=404, detail="Not found")\n    del items[name]`,
        ["Creation returns 201.", "A missing item raises 404."],
      ],
    ],
    mistakes: ["Returning 200 for every outcome.", "Sending a body with 204."],
    follow: ["Which status code does FastAPI return for invalid input?"],
    points: [
      "status_code in the decorator",
      "201, 204, 404, 422 are typical",
      "fastapi.status constants",
      "HTTPException for errors",
    ],
    notes: ["Say what happened with the code."],
    src: [
      ["FastAPI: Response status code", `${F}/tutorial/response-status-code/`],
      ["FastAPI: Handling errors", `${F}/tutorial/handling-errors/`],
    ],
  }),
  q({
    slug: "openapi-docs-swagger-redoc",
    topic: "OpenAPI",
    d: "easy",
    title:
      "How does FastAPI generate API documentation, and how do you improve it?",
    kw: ["openapi", "swagger ui", "redoc", "docs url", "metadata"],
    intent: "Checks the automatic documentation feature.",
    short:
      "FastAPI builds an OpenAPI schema from your routes, parameters, models and return types and serves it at `/openapi.json`. Interactive documentation is generated from it: Swagger UI at `/docs`, where you can try requests, and ReDoc at `/redoc`. You improve the docs with metadata: `title`, `description`, `version` and `summary` in `FastAPI(...)`, `tags` and `summary` on path operations, docstrings as descriptions, `response_model`, `responses` for extra status codes, and `examples` on fields. The URLs can be changed or disabled with `docs_url=None` for production if you do not want to expose them. Clients and SDKs can be generated from the schema.",
    detail: [
      "OpenAPI is a standard, so many tools consume the schema.",
      "Tag metadata can add descriptions for groups of endpoints.",
      "Keep the documentation consistent with behaviour by letting the types drive it.",
    ],
    ex: "A front-end team generates a typed client from `/openapi.json`.",
    code: [
      [
        "Metadata",
        "python",
        `from fastapi import FastAPI\n\napp = FastAPI(\n    title="Library API",\n    description="Manage books and authors.",\n    version="1.0.0",\n)\n\n@app.get("/books", tags=["books"], summary="List books")\nasync def list_books():\n    """Return all books in the library."""\n    return []`,
        ["Metadata and docstrings fill the docs."],
      ],
    ],
    mistakes: [
      "Leaving every endpoint undocumented.",
      "Exposing internal endpoints in public docs.",
    ],
    follow: ["Where is the raw OpenAPI schema served?"],
    points: [
      "/openapi.json schema",
      "/docs Swagger UI, /redoc ReDoc",
      "Metadata, tags and docstrings",
      "Can be disabled or moved",
    ],
    notes: ["Docs from code."],
    src: [
      ["FastAPI: Metadata and docs URLs", `${F}/tutorial/metadata/`],
      ["FastAPI: Features (automatic docs)", `${F}/features/`],
    ],
  }),
  q({
    slug: "documenting-examples-and-responses",
    topic: "OpenAPI",
    d: "medium",
    title: "How do you document example data and extra responses?",
    kw: [
      "schema examples",
      "json_schema_extra",
      "responses parameter",
      "documented errors",
      "swagger examples",
    ],
    intent: "Checks detail-level documentation.",
    short:
      "Examples make the generated docs far more useful. For models, add `examples` to `Field(...)` or set `model_config = {'json_schema_extra': {'examples': [...]}}`; for parameters, `Query(examples=[...])`, `Body(examples=[...])` and so on, which appear in Swagger UI as sample requests. To document responses beyond the default, such as a 404 or 409, use the `responses` argument: `@app.get('/items/{id}', responses={404: {'description': 'Item not found'}})`. Together with `response_model` and tags, this tells API users what to send and expect without reading the code.",
    detail: [
      "Examples are documentation only; they do not change validation.",
      "Document error shapes too, such as the 422 validation response.",
      "Keep examples realistic, with no real personal data.",
    ],
    ex: "A `POST /orders` showing a sample JSON body and a documented 409 for duplicates.",
    mistakes: [
      "Examples that do not match the schema.",
      "Leaving error responses undocumented.",
    ],
    follow: ["Does an example change what is accepted?"],
    points: [
      "examples on fields and parameters",
      "json_schema_extra on models",
      "responses= for extra statuses",
      "Documentation only, not validation",
    ],
    notes: ["Show, don't only tell."],
    src: [
      [
        "FastAPI: Declare request example data",
        `${F}/tutorial/schema-extra-example/`,
      ],
      [
        "FastAPI: Additional responses in OpenAPI",
        `${F}/advanced/additional-responses/`,
      ],
    ],
  }),
  q({
    slug: "database-access-with-sqlmodel-session",
    topic: "Dependencies",
    d: "medium",
    title: "How do you use a database in FastAPI?",
    kw: [
      "sql databases",
      "SQLModel",
      "session dependency",
      "sqlalchemy",
      "orm models",
    ],
    intent: "Checks the standard database pattern.",
    short:
      "FastAPI does not require a particular database library. The official SQL tutorial uses SQLModel (built on SQLAlchemy and Pydantic), but you can use SQLAlchemy directly or any async driver. The pattern is: create the engine at startup, define table models, and provide a session through a dependency with `yield` so each request gets its own session that is closed afterwards: `SessionDep = Annotated[Session, Depends(get_session)]`. Endpoints take `session: SessionDep`, query or add objects, commit and return results using separate response models so database-only fields stay hidden. Use a synchronous driver with `def` endpoints, or an async driver with `async def`.",
    detail: [
      "Create tables with migrations (for example Alembic) in real projects.",
      "Add pagination limits to list queries.",
      "Handle unique-constraint errors and return 409 or 400.",
    ],
    ex: "A heroes API where `POST /heroes` stores a record and `GET /heroes` lists them with `offset` and `limit`.",
    code: [
      [
        "Session dependency",
        "python",
        `from typing import Annotated\nfrom fastapi import Depends, FastAPI\nfrom sqlmodel import Session, create_engine\n\nengine = create_engine("sqlite:///app.db")\n\ndef get_session():\n    with Session(engine) as session:\n        yield session\n\nSessionDep = Annotated[Session, Depends(get_session)]\napp = FastAPI()\n\n@app.get("/ping")\ndef ping(session: SessionDep):\n    return {"ok": True}`,
        ["Each request gets its own session, closed afterwards."],
      ],
    ],
    mistakes: [
      "One global session for all requests.",
      "Returning database models with sensitive columns.",
    ],
    follow: ["Why use a yield dependency for the session?"],
    points: [
      "Engine once, session per request",
      "Yield dependency closes the session",
      "Separate API models",
      "Sync driver with def, async driver with async def",
    ],
    notes: ["A session per request."],
    src: [
      ["FastAPI: SQL (Relational) Databases", `${F}/tutorial/sql-databases/`],
      [
        "FastAPI: Dependencies with yield",
        `${F}/tutorial/dependencies/dependencies-with-yield/`,
      ],
    ],
  }),
  q({
    slug: "testing-fastapi-with-testclient",
    topic: "Testing FastAPI apps",
    d: "easy",
    title: "How do you test a FastAPI application?",
    kw: [
      "TestClient",
      "pytest",
      "fastapi testing",
      "httpx",
      "assert status_code",
    ],
    intent: "Checks the basic testing workflow.",
    short:
      "FastAPI provides `fastapi.testclient.TestClient`, built on HTTPX, which calls your application in-process without running a server. Create `client = TestClient(app)` and write ordinary test functions with pytest: `response = client.get('/items/1')`, then assert on `response.status_code` and `response.json()`. The test functions are plain `def` even when the endpoints are `async def`. Test the happy path and the error cases (404, 422, 401), send JSON with `client.post(url, json={...})`, and pass headers for authentication. Install `httpx` and `pytest` as test dependencies. Combine with dependency overrides to replace databases and external services.",
    detail: [
      "No network port is needed, so tests are fast.",
      "Reset state between tests, for example with a fresh in-memory database.",
      "Test validation: send bad data and assert 422.",
    ],
    ex: "Posting an item and asserting the response is 201 with the created data.",
    code: [
      [
        "First test",
        "python",
        `from fastapi import FastAPI\nfrom fastapi.testclient import TestClient\n\napp = FastAPI()\n\n@app.get("/ping")\nasync def ping():\n    return {"msg": "pong"}\n\nclient = TestClient(app)\n\ndef test_ping():\n    response = client.get("/ping")\n    assert response.status_code == 200\n    assert response.json() == {"msg": "pong"}`,
        [
          "The client calls the app directly.",
          "The test itself is a normal function.",
        ],
      ],
    ],
    mistakes: [
      "Testing only successful requests.",
      "Sharing state between tests.",
    ],
    follow: ["Do tests of async endpoints need to be async?"],
    points: [
      "TestClient wraps the app",
      "Plain pytest functions",
      "Assert status and JSON",
      "Test error paths too",
    ],
    notes: ["Call the app like a client."],
    src: [
      ["FastAPI: Testing", `${F}/tutorial/testing/`],
      ["FastAPI: Async tests", `${F}/advanced/async-tests/`],
    ],
  }),
  q({
    slug: "dependency-overrides-in-tests",
    topic: "Testing FastAPI apps",
    d: "medium",
    title:
      "How do you replace dependencies such as the database or auth in tests?",
    kw: [
      "dependency_overrides",
      "test doubles",
      "fake database",
      "mock user",
      "testing dependencies",
    ],
    intent: "Checks isolating tests from infrastructure.",
    short:
      "Set `app.dependency_overrides[original_dependency] = replacement` to swap a dependency for a test version. A test can replace `get_db` with a function that yields a session on an in-memory database, `get_current_user` with one that returns a fixed user so protected endpoints can be tested without tokens, or `get_settings` with test configuration. The key is the original dependency function object. Clear the overrides after the test (`app.dependency_overrides.clear()`), preferably in a pytest fixture so they cannot leak into other tests. This is why logic should be injected through `Depends` rather than imported and called directly.",
    detail: [
      "Overrides apply to the whole dependency tree, including sub-dependencies.",
      "Also keep a few tests that run the real authentication path.",
      "Fixtures with `yield` set up and clean the override.",
    ],
    ex: "Testing an admin-only endpoint by overriding `get_current_user` with an admin.",
    code: [
      [
        "Override in a fixture",
        "python",
        `import pytest\nfrom fastapi.testclient import TestClient\nfrom .main import app, get_current_user\n\n@pytest.fixture\ndef client():\n    app.dependency_overrides[get_current_user] = lambda: {"name": "test", "admin": True}\n    yield TestClient(app)\n    app.dependency_overrides.clear()`,
        ["The override is removed after each test."],
      ],
    ],
    mistakes: [
      "Forgetting to clear overrides.",
      "Never testing the real auth path.",
    ],
    follow: ["What is the key of dependency_overrides?"],
    points: [
      "app.dependency_overrides[orig] = fake",
      "Applies across the dependency tree",
      "Clear in fixture teardown",
      "Inject through Depends",
    ],
    notes: ["Swap the dependency, not the code."],
    src: [
      [
        "FastAPI: Testing dependencies with overrides",
        `${F}/advanced/testing-dependencies/`,
      ],
      ["FastAPI: Testing", `${F}/tutorial/testing/`],
    ],
  }),
  q({
    slug: "async-tests-and-lifespan-in-tests",
    topic: "Testing FastAPI apps",
    d: "hard",
    title:
      "How do you write async tests, and how do lifespan events run in tests?",
    kw: [
      "AsyncClient",
      "ASGITransport",
      "anyio",
      "pytest async",
      "lifespan testing",
    ],
    intent: "Checks testing of async code paths.",
    short:
      "When your test itself must call async functions, for example to query an async database after a request, use `httpx.AsyncClient` with `ASGITransport(app=app)` and an async test function marked for an async runner, such as `@pytest.mark.anyio` (the documentation uses AnyIO). Inside the test, `async with AsyncClient(transport=ASGITransport(app=app), base_url='http://test') as client:` then `response = await client.get('/')`. The async client does not run lifespan events by itself. With the synchronous `TestClient`, use it as a context manager (`with TestClient(app) as client:`) so startup and shutdown run; otherwise they are skipped. Choose the simple sync client unless the test needs `await`.",
    detail: [
      "Mixing event loops between fixtures and tests causes confusing errors.",
      "Use a lifespan-manager helper package if you need lifespan with the async client.",
      "Keep most tests synchronous and simple.",
    ],
    ex: "An async test that posts an item, then awaits a database query to confirm it was stored.",
    code: [
      [
        "AsyncClient test",
        "python",
        `import pytest\nfrom httpx import ASGITransport, AsyncClient\nfrom .main import app\n\n@pytest.mark.anyio\nasync def test_root():\n    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:\n        response = await ac.get("/")\n    assert response.status_code == 200`,
        ["The test is async so it can `await`.", "No server is started."],
      ],
    ],
    mistakes: [
      "Expecting lifespan to run with a bare AsyncClient.",
      "Using async tests where sync ones suffice.",
    ],
    follow: ["How do you trigger lifespan events with TestClient?"],
    points: [
      "AsyncClient with ASGITransport",
      "Mark tests for anyio",
      "TestClient as context manager runs lifespan",
      "Prefer sync tests when possible",
    ],
    notes: ["Async only when the test must await."],
    src: [
      ["FastAPI: Async tests", `${F}/advanced/async-tests/`],
      ["FastAPI: Testing events - lifespan", `${F}/advanced/testing-events/`],
    ],
  }),
  q({
    slug: "deploying-fastapi-workers-and-docker",
    topic: "OpenAPI",
    d: "medium",
    title: "How do you run FastAPI in production?",
    kw: [
      "uvicorn workers",
      "docker fastapi",
      "reverse proxy",
      "https",
      "deployment concepts",
    ],
    intent: "Checks production deployment concepts.",
    short:
      "Run the app with an ASGI server such as Uvicorn (the `fastapi run` command wraps it) in production mode, not with auto-reload. Use several worker processes to use all CPU cores and to survive a worker crash, and run the process under a supervisor or container orchestrator that restarts it. Terminate HTTPS in a proxy or load balancer in front of the application. The FastAPI deployment documentation lists concepts to plan for: HTTPS, startup on boot, restarts, replication (several processes or containers), memory, and previous steps such as database migrations. Packaging the app as a Docker image is the documented approach.",
    detail: [
      "With several workers each process has its own memory and runs lifespan separately.",
      "In Kubernetes you typically run one process per container and scale containers.",
      "Add health-check endpoints and structured logging.",
    ],
    ex: "A container started with `fastapi run --workers 4`, behind a load balancer that handles HTTPS.",
    mistakes: [
      "Using the development server in production.",
      "Keeping state in process memory when running several workers.",
    ],
    follow: ["Why run more than one worker?"],
    points: [
      "ASGI server in production mode",
      "Multiple workers or containers",
      "HTTPS at the proxy",
      "Plan for restarts and migrations",
    ],
    notes: ["Replicate, supervise, secure."],
    src: [
      ["FastAPI: Deployment concepts", `${F}/deployment/concepts/`],
      ["FastAPI: FastAPI in containers - Docker", `${F}/deployment/docker/`],
      ["FastAPI: Run a server manually", `${F}/deployment/server-workers/`],
    ],
  }),
])
