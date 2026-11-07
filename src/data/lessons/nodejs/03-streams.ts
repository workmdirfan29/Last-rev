import { defineLesson } from "@/data/lessons/author"

export default defineLesson("nodejs", {
  slug: "streams",
  title: "Streams, pipelines and backpressure",
  topic: "Streams",
  minutes: 90,
  overview:
    "Process data piece by piece with Readable, Writable and Transform streams, connect them safely with pipeline, and understand backpressure.",
  objectives: [
    "Name the four stream types and what each does",
    "Connect streams with stream.pipeline and read a stream with async iteration",
    "Explain backpressure and how write() and the drain event handle it",
  ],
  prerequisites: ["lesson.nodejs.event-loop"],
  sections: [
    {
      kind: "explain",
      heading: "Why streams",
      body: [
        "A **stream** handles data in chunks as they arrive, instead of loading everything into memory first. Reading a very large file or an HTTP body as a stream keeps memory use small and lets you start work immediately.",
        "There are four types. A **Readable** is a source you read from, such as a file read stream or an incoming HTTP request. A **Writable** is a destination, such as a file write stream or an HTTP response. A **Duplex** is both, such as a TCP socket. A **Transform** is a duplex that changes data as it passes through, such as compression.",
        "Streams deal with bytes (Buffers) or strings by default. In **object mode** they carry any JavaScript values.",
      ],
    },
    {
      kind: "code",
      heading: "Connecting streams",
      example: {
        title: "Copy and compress a file with pipeline",
        language: "javascript",
        code: "import { createReadStream, createWriteStream } from 'node:fs';\nimport { createGzip } from 'node:zlib';\nimport { pipeline } from 'node:stream/promises';\n\nawait pipeline(\n  createReadStream('big.log'),\n  createGzip(),\n  createWriteStream('big.log.gz')\n);\nconsole.log('done');",
        walkthrough: [
          "`createReadStream` reads the file in chunks. `createGzip` is a Transform that compresses each chunk. `createWriteStream` writes the result.",
          "`pipeline` connects them in order and passes data along with backpressure handled for you.",
          "If any stream fails, `pipeline` destroys all of them and the promise rejects, so resources are cleaned up. A bare `.pipe()` does not do this for you.",
        ],
      },
    },
    {
      kind: "code",
      heading: "Reading and transforming",
      example: {
        title: "An upper-case Transform and async iteration",
        language: "javascript",
        code: "import { Transform, Readable } from 'node:stream';\n\nconst upper = new Transform({\n  transform(chunk, encoding, callback) {\n    callback(null, chunk.toString().toUpperCase());\n  },\n});\n\nconst source = Readable.from(['one ', 'two ', 'three']);\nfor await (const chunk of source.pipe(upper)) {\n  process.stdout.write(chunk);\n}",
        walkthrough: [
          "A Transform implements `transform(chunk, encoding, callback)`. Calling `callback(null, data)` passes the changed chunk on.",
          "`Readable.from` makes a stream from an iterable.",
          "A Readable is also an async iterable, so `for await` reads one chunk at a time and waits for the next.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "Backpressure",
      body: [
        "Backpressure is what happens when a destination is slower than the source. If a Readable keeps pushing data faster than a Writable can handle it, the data piles up in memory.",
        "`writable.write(chunk)` returns `false` when the internal buffer has passed its `highWaterMark`. You should then stop writing and wait for the `'drain'` event before writing more. `pipe()` and `pipeline()` do this automatically.",
        "Ignoring backpressure causes high memory use and extra work for the garbage collector, and can exhaust memory with very large data.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Reading a large file with readFile into memory.",
          fix: "Use createReadStream and process it in chunks.",
        },
        {
          mistake: "Using pipe() chains without error handling.",
          fix: "Use pipeline, which forwards errors and cleans up every stream.",
        },
        {
          mistake: "Ignoring the return value of write().",
          fix: "When it returns false, wait for the drain event before writing more.",
        },
        {
          mistake: "Forgetting that chunks are Buffers.",
          fix: "Call toString() or set an encoding when you need text.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Serving a large download",
      scenario:
        "An endpoint must send a very large file to the client without using a lot of memory.",
      body: [
        "Create a read stream for the file and `pipeline` it into the HTTP response. Memory use stays small because only a few chunks are in flight at once.",
        "If the client disconnects, `pipeline` destroys the read stream, so the file handle is released.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "transform-type",
      prompt: "Which stream type changes data as it passes through?",
      options: ["Transform", "Readable", "Writable"],
      answer: 0,
      explanation:
        "A Transform is a Duplex stream that modifies chunks, for example compression.",
    },
    {
      type: "truefalse",
      id: "write-false",
      statement: "When writable.write() returns false, you should keep writing immediately.",
      answer: false,
      explanation:
        "It means the buffer is full. Wait for the 'drain' event first.",
    },
    {
      type: "single",
      id: "pipeline-benefit",
      prompt: "Why prefer pipeline() over chaining pipe() calls?",
      options: [
        "It forwards errors and destroys all streams",
        "It makes streams faster",
        "It converts Buffers to strings",
      ],
      answer: 0,
      explanation:
        "pipeline handles errors and cleanup. It also manages backpressure.",
    },
    {
      type: "blank",
      id: "drain-event",
      prompt: "After write() returns false, wait for the '___' event.",
      answer: "drain",
      explanation:
        "The 'drain' event signals the buffer has emptied, so writing can resume.",
    },
  ],
  assignment: {
    title: "Stream a log filter",
    task: [
      "Write a script that reads a large text file as a stream, keeps only lines that contain a given word and writes them to a new file.",
      "Use pipeline and a Transform. Do not load the whole file into memory.",
    ],
    checklist: [
      "The file is read with createReadStream",
      "A Transform filters lines, including a line split across chunks",
      "pipeline connects the streams and handles errors",
      "Memory use stays low on a large file",
    ],
    hints: ["Keep the unfinished last line of a chunk and prepend it to the next chunk."],
    minutes: 40,
  },
  exercises: [
    {
      slug: "sum-chunks",
      title: "Sum numbers from chunks",
      task: [
        "Write `sumChunks(chunks)` that takes an array of arrays of numbers (as if each came from a stream chunk) and returns the total of all numbers.",
      ],
      language: "javascript",
      starter: "function sumChunks(chunks) {\n  // your code\n}",
      solution:
        "function sumChunks(chunks) {\n  let total = 0;\n  for (const chunk of chunks) {\n    for (const n of chunk) total += n;\n  }\n  return total;\n}",
      hints: ["Process one chunk at a time and keep a running total."],
      checklist: [
        "All chunks are included",
        "An empty list gives 0",
        "Empty chunks are fine",
      ],
      run: {
        entry: "sumChunks",
        cases: [
          { name: "two chunks", args: [[[1, 2], [3]]], expected: 6 },
          { name: "empty", args: [[]], expected: 0 },
          { name: "with empty chunk", args: [[[], [5, 5]]], expected: 10 },
        ],
      },
    },
  ],
  revisionNotes: [
    "Readable, Writable, Duplex and Transform handle data in chunks",
    "Use pipeline (or stream/promises) to connect streams safely",
    "write() returns false = buffer full: wait for 'drain'",
    "Readable streams are async iterables: for await (const chunk of stream)",
  ],
  resources: [
    {
      label: "Node.js: Stream",
      url: "https://nodejs.org/api/stream.html",
    },
    {
      label: "Node.js: How to use streams",
      url: "https://nodejs.org/en/learn/modules/how-to-use-streams",
    },
    {
      label: "Node.js: Backpressuring in streams",
      url: "https://nodejs.org/en/learn/modules/backpressuring-in-streams",
    },
  ],
})
