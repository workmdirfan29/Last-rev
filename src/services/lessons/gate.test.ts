import { describe, expect, it } from "vitest"
import { MODULE_BY_ID } from "@/data/catalog/modules"
import { defineLesson } from "@/data/lessons/author"
import { studyLessonSchema, type AuthoredStudyLesson } from "@/types/lesson"
import {
  balancedBrackets,
  releaseProblems,
  validateLesson,
  validateLessons,
  type GateContext,
} from "./gate"

const clone = <T>(x: T): T => structuredClone(x)

/** A small valid lesson for `java-core` / "Basics" (90 min in the catalogue). */
const base = (): AuthoredStudyLesson => ({
  slug: "first-program",
  title: "Your first Java program",
  topic: "Basics",
  minutes: 40,
  overview: "Write, compile and run a small Java program.",
  objectives: [
    "Explain what `main` is",
    "Compile a `.java` file and run the result",
  ],
  prerequisites: [],
  sections: [
    {
      kind: "explain",
      heading: "From source file to running program",
      body: ["You write Java in a **source file** that ends in `.java`."],
    },
    {
      kind: "code",
      heading: "Hello, Java",
      example: {
        title: "A complete program",
        language: "java",
        code: 'public class Hello {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java");\n  }\n}',
        walkthrough: ["`public class Hello` declares a class."],
      },
    },
    {
      kind: "mistakes",
      items: [{ mistake: "Wrong file name.", fix: "Name it like the class." }],
    },
    {
      kind: "practical",
      heading: "A greeting",
      scenario: "A tool greets whoever runs it.",
      body: ["Change the text, compile again, run it."],
    },
  ],
  check: [
    {
      type: "single",
      id: "compiler-output",
      prompt: "What does `javac Hello.java` produce?",
      options: ["Hello.class", "Hello.exe", "Hello.txt"],
      answer: 0,
      explanation: "`javac` produces bytecode in a `.class` file.",
    },
    {
      type: "truefalse",
      id: "main-needed",
      statement: "A Java program can start without a `main` method.",
      answer: false,
      explanation: "`java` calls `main` to start.",
    },
    {
      type: "output",
      id: "println-output",
      code: {
        language: "java",
        code: 'System.out.println("A");\nSystem.out.println("B");',
      },
      options: ["A then B on two lines", "AB on one line", "Nothing"],
      answer: 0,
      explanation: "`println` ends each print with a new line.",
    },
  ],
  assignment: {
    title: "Greet yourself",
    task: ["Print your name and city on two lines."],
    checklist: [
      "File name matches class",
      "It compiles",
      "It prints two lines",
    ],
    minutes: 15,
  },
  exercises: [],
  revisionNotes: ["`javac` compiles, `java` runs", "Entry point is `main`"],
  resources: [
    {
      label: "The Java Tutorials",
      url: "https://docs.oracle.com/javase/tutorial/getStarted/application/index.html",
    },
  ],
})

const ctx = (extra: string[] = []): GateContext => ({
  modules: MODULE_BY_ID,
  lessonIds: new Set(["lesson.java-core.first-program", ...extra]),
})
const lesson = (patch: (l: AuthoredStudyLesson) => void = () => {}) => {
  const l = clone(base())
  patch(l)
  return defineLesson("java-core", l)
}
const problems = (
  patch: (l: AuthoredStudyLesson) => void,
  extra: string[] = []
) => validateLesson(lesson(patch), ctx(extra))

describe("lesson schema and defineLesson", () => {
  it("accepts a complete lesson and gives it its id", () => {
    const l = lesson()
    expect(l.id).toBe("lesson.java-core.first-program")
    expect(l.moduleId).toBe("java-core")
    expect(validateLesson(l, ctx())).toEqual([])
  })

  it("rejects what the schema can see: missing parts, bad quiz items, a runnable non-JavaScript exercise", () => {
    const fails = (patch: (l: AuthoredStudyLesson) => void) =>
      !studyLessonSchema.safeParse(
        (() => {
          const l = clone(base())
          patch(l)
          return l
        })()
      ).success
    expect(
      fails(
        (l) => (l.sections = l.sections.filter((s) => s.kind !== "mistakes"))
      )
    ).toBe(true)
    expect(fails((l) => (l.check = l.check.slice(0, 2)))).toBe(true)
    expect(fails((l) => (l.assignment.checklist = ["one", "two"]))).toBe(true)
    expect(fails((l) => (l.resources = []))).toBe(true)
    expect(
      fails(
        (l) =>
          (l.check[0] = {
            type: "single",
            id: "x",
            prompt: "p",
            options: ["a", "b", "c"],
            answer: 3,
            explanation: "e",
          })
      )
    ).toBe(true)
    expect(
      fails(
        (l) =>
          (l.check[0] = {
            type: "single",
            id: "x",
            prompt: "p",
            options: ["a", "A ", "c"],
            answer: 0,
            explanation: "e",
          })
      )
    ).toBe(true)
    expect(
      fails(
        (l) =>
          (l.check[0] = {
            type: "multi",
            id: "x",
            prompt: "p",
            options: ["a", "b", "c", "d"],
            answers: [0, 1, 2, 3],
            explanation: "e",
          })
      )
    ).toBe(true)
    expect(
      fails(
        (l) =>
          (l.check[0] = {
            type: "blank",
            id: "x",
            prompt: "no blank",
            answer: "a",
            explanation: "e",
          })
      )
    ).toBe(true)
    expect(
      fails(
        (l) =>
          (l.check[1] = {
            ...(l.check[0] as object),
            id: "compiler-output",
          } as never)
      )
    ).toBe(true)
    const run = {
      entry: "f",
      cases: ["a", "b", "c"].map((name) => ({ name, args: [], expected: 1 })),
    }
    expect(
      fails(
        (l) =>
          (l.exercises = [
            {
              slug: "e",
              title: "t",
              task: ["t"],
              language: "java",
              starter: "s",
              solution: "s",
              checklist: ["a", "b"],
              run,
            },
          ])
      )
    ).toBe(true)
    expect(
      fails(
        (l) =>
          (l.exercises = [
            {
              slug: "e",
              title: "t",
              task: ["t"],
              language: "javascript",
              starter: "function f(){}",
              solution: "function f(){return 1}",
              checklist: ["a", "b"],
              run,
            },
          ])
      )
    ).toBe(false)
  })
})

describe("the gate on one lesson", () => {
  it("needs a real topic of the module, spelt exactly", () => {
    expect(problems((l) => (l.topic = "Basicss")).join()).toMatch(
      /not a topic of java-core/
    )
    expect(problems((l) => (l.topic = "Basics")).length).toBe(0)
  })

  it("accepts official documentation only, over https", () => {
    expect(
      problems(
        (l) => (l.resources = [{ label: "x", url: "https://example.com/doc" }])
      ).join()
    ).toMatch(/allowlist/)
    expect(
      problems(
        (l) =>
          (l.resources = [
            { label: "x", url: "http://docs.oracle.com/javase/tutorial/" },
          ])
      ).join()
    ).toMatch(/allowlist/)
  })

  it("checks prerequisites resolve to a lesson or a module, and never to itself", () => {
    expect(
      problems((l) => (l.prerequisites = ["lesson.java-core.nope"])).join()
    ).toMatch(/is not a lesson/)
    expect(
      problems((l) => (l.prerequisites = ["no-such-module"])).join()
    ).toMatch(/neither a lesson id nor a module id/)
    expect(
      problems(
        (l) => (l.prerequisites = ["lesson.java-core.first-program"])
      ).join()
    ).toMatch(/its own prerequisite/)
    expect(problems((l) => (l.prerequisites = ["java-core"])).length).toBe(0)
  })

  it("rejects unbalanced code, empty code and an unclosed string", () => {
    const code = (c: string) => (l: AuthoredStudyLesson) => {
      const s = l.sections[1]
      if (s.kind === "code") s.example.code = c
    }
    expect(problems(code("class A {")).join()).toMatch(/unbalanced/)
    expect(problems(code('String s = "abc;')).join()).toMatch(/unbalanced/)
    expect(problems(code("class A { }")).length).toBe(0)
  })

  it("keeps frequency claims, statistics and company names out", () => {
    const text = (t: string) => (l: AuthoredStudyLesson) => {
      const s = l.sections[0]
      if (s.kind === "explain") s.body = [t]
    }
    expect(
      problems(text("This is asked in almost every interview.")).join()
    ).toMatch(/frequency claim/)
    expect(
      problems(text("Studies show most developers prefer it.")).join()
    ).toMatch(/statistic claim/)
    expect(problems(text("Flipkart uses this in production.")).join()).toMatch(
      /company or brand/
    )
    // a technology vendor naming its own technology is fine
    expect(
      problems(text("The Oracle JDK and AWS both ship tooling.")).length
    ).toBe(0)
  })

  it("rejects two check items that ask the same thing, but not two 'What does this print?' items with different code", () => {
    const same = problems((l) => {
      l.check[1] = { ...(l.check[0] as object), id: "again" } as never
    }).join()
    expect(same).toMatch(/ask the same thing/)
    // the default prompt is shared by every output item; the code and options tell them apart
    const out = (id: string, code: string) =>
      ({
        type: "output",
        id,
        code: { language: "java", code },
        options: ["1", "2", "3"],
        answer: 0,
        explanation: "e",
      }) as never
    expect(
      problems((l) => {
        l.check = [l.check[0], out("a", "int x = 1;"), out("b", "int x = 2;")]
      }).join()
    ).not.toMatch(/ask the same thing/)
    expect(
      problems((l) => {
        l.check = [l.check[0], out("a", "int x = 1;"), out("b", "int x = 1;")]
      }).join()
    ).toMatch(/ask the same thing/)
  })

  it("a runnable exercise must declare its entry in the starter and the solution", () => {
    const run = {
      entry: "add",
      cases: ["a", "b", "c"].map((name) => ({
        name,
        args: [1, 2],
        expected: 3,
      })),
    }
    const ex =
      (starter: string, solution: string) => (l: AuthoredStudyLesson) => {
        l.exercises = [
          {
            slug: "add",
            title: "Add",
            task: ["add two numbers"],
            language: "javascript",
            starter,
            solution,
            checklist: ["a", "b"],
            run,
          },
        ]
      }
    expect(
      problems(
        ex("function add(a, b) {}", "function add(a, b) { return a + b }")
      ).length
    ).toBe(0)
    expect(
      problems(ex("// nothing", "function add(a, b) { return a + b }")).join()
    ).toMatch(/starter code does not declare add/)
    expect(problems(ex("function add(a, b) {}", "return 3")).join()).toMatch(
      /solution does not declare add/
    )
  })
})

describe("the gate on the pool", () => {
  it("rejects duplicate lessons, duplicate titles and a repeated question across lessons", () => {
    const a = lesson()
    const b = defineLesson("java-core", { ...clone(base()), slug: "second" })
    expect(validateLessons([a, b], MODULE_BY_ID).join()).toMatch(/same title/)
    const c = defineLesson("java-core", {
      ...clone(base()),
      slug: "third",
      title: "Another title",
    })
    expect(validateLessons([a, c], MODULE_BY_ID).join()).toMatch(
      /repeats a question/
    )
    expect(validateLessons([a, a], MODULE_BY_ID).join()).toMatch(
      /duplicate lesson/
    )
  })

  it("finds prerequisite cycles", () => {
    const a = defineLesson("java-core", {
      ...clone(base()),
      prerequisites: ["lesson.java-core.second"],
    })
    const b = defineLesson("java-core", {
      ...clone(base()),
      slug: "second",
      title: "Second",
      prerequisites: ["lesson.java-core.first-program"],
      check: base().check.map((c) =>
        c.type === "truefalse"
          ? { ...c, statement: "A different statement for the second lesson." }
          : c.type === "single"
            ? { ...c, prompt: "A different prompt for the second lesson?" }
            : { ...c, prompt: "Another different output prompt?" }
      ),
    })
    expect(validateLessons([a, b], MODULE_BY_ID).join()).toMatch(
      /prerequisite cycle/
    )
  })

  it("never lets a topic's lessons run more than 25% over its minutes (Basics is 90 min)", () => {
    const mk = (slug: string, minutes: number) =>
      defineLesson("java-core", {
        ...clone(base()),
        slug,
        title: `Lesson ${slug}`,
        minutes,
        check: base().check.map(
          (c) =>
            ({
              ...c,
              id: `${c.id}-${slug}`,
              ...(c.type === "truefalse"
                ? { statement: `Statement for ${slug}` }
                : { prompt: `Prompt of kind ${c.type} for ${slug}` }),
            }) as never
        ),
      })
    expect(
      validateLessons([mk("a", 60), mk("b", 60)], MODULE_BY_ID).join()
    ).toMatch(/more than 25% over/)
    expect(
      validateLessons(
        [mk("a", 60), mk("b", 60)].slice(0, 1),
        MODULE_BY_ID
      ).join()
    ).not.toMatch(/over/)
  })
})

describe("release rule", () => {
  it("needs every topic with minutes covered, minutes within 25%, and at least 3 lessons", () => {
    const mod = MODULE_BY_ID.get("java-core")!
    expect(releaseProblems(mod, [lesson()]).join()).toMatch(
      /1 lessons, at least 3/
    )
    expect(releaseProblems(mod, [lesson()]).join()).toMatch(
      /topic "Strings" has no lesson/
    )
    expect(releaseProblems(mod, [lesson()]).join()).toMatch(
      /lessons for "Basics" add up to 40 min, the topic is 90 min/
    )
    const tiny = { id: "tiny", topicList: [{ title: "Only", minutes: 60 }] }
    const mk = (slug: string, minutes: number) =>
      ({
        ...lesson(),
        id: `lesson.tiny.${slug}`,
        moduleId: "tiny",
        slug,
        topic: "Only",
        minutes,
      }) as ReturnType<typeof lesson>
    expect(
      releaseProblems(tiny, [mk("a", 20), mk("b", 20), mk("c", 20)])
    ).toEqual([])
    expect(
      releaseProblems(tiny, [mk("a", 20), mk("b", 20), mk("c", 40)]).join()
    ).toMatch(/add up to 80 min/)
  })
})

describe("the bracket check", () => {
  it("balances brackets outside strings and comments, and handles both comment styles and triple quotes", () => {
    expect(balancedBrackets("f(a[1]) { }", "java")).toBe(true)
    expect(balancedBrackets("f(a[1) { }", "java")).toBe(false)
    expect(balancedBrackets('s = "}" // )\n{ }', "java")).toBe(true)
    expect(balancedBrackets("/* ( */ x", "javascript")).toBe(true)
    expect(balancedBrackets("/* ( x", "javascript")).toBe(false)
    expect(balancedBrackets("x = 1 # (", "python")).toBe(true)
    expect(balancedBrackets('"""doc (""" + f()', "python")).toBe(true)
    expect(balancedBrackets("`a ${b} (`", "javascript")).toBe(true)
    expect(balancedBrackets("SELECT ( FROM", "sql")).toBe(true) // not checked
  })
})

describe("runnable exercises (the gate's one rule that runs code)", () => {
  const withExercise = (starter: string, solution: string, expected = 3) =>
    defineLesson("java-core", {
      ...clone(base()),
      exercises: [
        {
          slug: "add",
          title: "Add",
          task: ["Add two numbers."],
          language: "javascript",
          starter,
          solution,
          checklist: ["a", "b"],
          run: {
            entry: "add",
            cases: ["one", "two", "three"].map((name) => ({
              name,
              args: [1, 2],
              expected,
            })),
          },
        },
      ],
    })
  it("accepts a solution that passes and a starter that does not", async () => {
    const { runnableExerciseProblems } = await import("./runnable-gate")
    expect(
      await runnableExerciseProblems([
        withExercise(
          "function add(a, b) { return 0 }",
          "function add(a, b) { return a + b }"
        ),
      ])
    ).toEqual([])
  })
  it("rejects a solution that fails a case", async () => {
    const { runnableExerciseProblems } = await import("./runnable-gate")
    const p = await runnableExerciseProblems([
      withExercise(
        "function add(a, b) { return 0 }",
        "function add(a, b) { return a * b }"
      ),
    ])
    expect(p.join()).toMatch(/reference solution fails/)
  })
  it("rejects a starter that already passes", async () => {
    const { runnableExerciseProblems } = await import("./runnable-gate")
    const p = await runnableExerciseProblems([
      withExercise(
        "function add(a, b) { return 3 }",
        "function add(a, b) { return a + b }"
      ),
    ])
    expect(p.join()).toMatch(/starter code already passes/)
  })
})
