import { mod } from "./factory"

export const AI_MODULES = [
  mod(
    "python-fundamentals",
    "Python Fundamentals",
    "programming",
    "python",
    "beginner",
    "Syntax, data types, control flow, functions and idiomatic Python.",
    [
      ["Types", 70],
      ["Control flow", 60],
      ["Functions", 80],
      ["Comprehensions", 50],
      ["Modules", 50],
      ["Strings & I/O", 60],
      ["Virtual environments & pip", 40],
    ]
  ),
  mod(
    "python-data-structures",
    "Python Data Structures",
    "programming",
    "python",
    "beginner",
    "Lists, tuples, dicts, sets, their internals and complexity.",
    [
      ["list", 50],
      ["tuple", 30],
      ["dict", 60],
      ["set", 40],
      ["collections module", 50],
    ],
    { prerequisites: ["python-fundamentals"] }
  ),
  mod(
    "python-oop",
    "Python OOP",
    "programming",
    "python",
    "intermediate",
    "Classes, inheritance, dunder methods, dataclasses and the data model.",
    [
      ["Classes", 60],
      ["Inheritance & MRO", 70],
      ["Dunder methods", 70],
      ["dataclasses", 45],
      ["Properties", 40],
    ],
    { prerequisites: ["python-fundamentals"] }
  ),
  mod(
    "python-advanced",
    "Decorators, Generators & Iterators",
    "programming",
    "python",
    "intermediate",
    "Closures, decorators, iterators, generators and context managers.",
    [
      ["Closures", 45],
      ["Decorators", 70],
      ["Iterators", 50],
      ["Generators", 60],
      ["Context managers", 45],
    ],
    { prerequisites: ["python-oop"] }
  ),
  mod(
    "python-exceptions-files",
    "Exceptions & File Handling",
    "programming",
    "python",
    "beginner",
    "Exception design, file and path handling, serialization.",
    [
      ["Exceptions", 50],
      ["Files", 40],
      ["pathlib", 35],
      ["JSON/CSV", 45],
    ],
    { prerequisites: ["python-fundamentals"] }
  ),
  mod(
    "python-concurrency",
    "Threading & Multiprocessing",
    "programming",
    "python",
    "advanced",
    "The GIL, threads, processes and choosing the right concurrency model.",
    [
      ["GIL", 60],
      ["threading", 70],
      ["multiprocessing", 80],
      ["concurrent.futures", 60],
    ],
    { prerequisites: ["python-advanced"] }
  ),
  mod(
    "python-async",
    "Async Python",
    "programming",
    "python",
    "advanced",
    "asyncio, event loop, tasks and async I/O patterns.",
    [
      ["Event loop", 60],
      ["async/await", 60],
      ["Tasks", 60],
      ["Async I/O", 60],
    ],
    { prerequisites: ["python-advanced"] }
  ),
  mod(
    "python-internals",
    "Python Internals",
    "programming",
    "python",
    "advanced",
    "Memory model, reference counting, GC, bytecode and performance.",
    [
      ["Memory model", 50],
      ["Garbage collection", 60],
      ["Bytecode", 60],
      ["Profiling", 60],
    ],
    { prerequisites: ["python-advanced"] }
  ),
  mod(
    "django",
    "Django",
    "backend",
    "python",
    "intermediate",
    "ORM, views, middleware, DRF, project structure and the admin.",
    [
      ["ORM", 90],
      ["Views", 70],
      ["Middleware", 50],
      ["DRF", 110],
      ["Project structure & settings", 60],
      ["Auth & admin", 60],
    ],
    { prerequisites: ["python-oop"] }
  ),
  mod(
    "fastapi",
    "FastAPI",
    "backend",
    "python",
    "intermediate",
    "Type-driven APIs, dependency injection, async endpoints, validation and testing.",
    [
      ["Pydantic", 70],
      ["Dependencies", 60],
      ["Async endpoints", 60],
      ["OpenAPI", 40],
      ["Testing FastAPI apps", 45],
    ],
    { prerequisites: ["python-async"] }
  ),
  mod(
    "ai-fundamentals",
    "AI Fundamentals",
    "ai",
    "ai",
    "beginner",
    "What AI, machine learning and deep learning are, and how modern language models work at a high level.",
    [
      ["AI vs ML vs deep learning", 45],
      ["Machine learning basics", 90],
      ["How LLMs work (high level)", 60],
      ["Data handling with Python", 60],
    ],
    { prerequisites: ["python-fundamentals"] }
  ),
  mod(
    "llm-apis",
    "LLM APIs & Prompting",
    "ai",
    "ai",
    "intermediate",
    "Calling LLM APIs such as OpenAI, prompting, structured output, tool calling and evaluation.",
    [
      ["API basics", 60],
      ["OpenAI API usage", 60],
      ["Prompting", 75],
      ["Structured output", 60],
      ["Tool calling", 70],
      ["Evaluation", 45],
    ],
    { prerequisites: ["rest-apis"] }
  ),
  mod(
    "rag-agents",
    "RAG, Vector Search & Agents",
    "ai",
    "ai",
    "advanced",
    "Embeddings, vector databases, retrieval pipelines, LangChain and agent design.",
    [
      ["Embeddings", 70],
      ["Vector databases", 80],
      ["Chunking", 45],
      ["Retrieval", 70],
      ["RAG pipelines", 90],
      ["LangChain", 70],
      ["Agents", 90],
    ],
    { prerequisites: ["llm-apis"] }
  ),
  mod(
    "ai-production",
    "AI Evaluation & Production",
    "ai",
    "ai",
    "advanced",
    "Evaluating AI features and running them in production: accuracy, hallucination, cost, latency and safety.",
    [
      ["AI application evaluation", 75],
      ["Hallucination & accuracy testing", 60],
      ["Production AI integration", 80],
      ["Cost, latency & caching", 45],
      ["Safety & guardrails", 45],
    ],
    { prerequisites: ["llm-apis"] }
  ),
]
