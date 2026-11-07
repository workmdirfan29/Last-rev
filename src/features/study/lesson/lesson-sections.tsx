import { CodeBlock } from "@/components/shared/code-block"
import { RichText } from "@/components/shared/rich-text"
import { DiagramView } from "@/features/interview/components/diagram-view"
import type { LessonSection } from "@/types/lesson"
import type { CodeExample } from "@/types/content"

export function CodeExampleView({ example }: { example: CodeExample }) {
  return (
    <div className="space-y-3">
      <CodeBlock
        code={example.code}
        language={example.language}
        title={example.title}
      />
      <ol
        className="lr-prose list-decimal space-y-1 ps-5"
        aria-label={`Walkthrough: ${example.title}`}
      >
        {example.walkthrough.map((step, i) => (
          <li key={i}>
            <RichText text={step} />
          </li>
        ))}
      </ol>
    </div>
  )
}

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2
    id={id}
    className="scroll-mt-20 font-heading text-lg font-semibold tracking-tight"
  >
    {children}
  </h2>
)

/** One authored section: explanation, code with walkthrough, diagram, common mistakes or a practical example. */
export function SectionView({
  section,
  id,
}: {
  section: LessonSection
  id: string
}) {
  switch (section.kind) {
    case "explain":
      return (
        <section className="space-y-3" aria-labelledby={id}>
          <H2 id={id}>{section.heading}</H2>
          {section.body.map((p, i) => (
            <p key={i} className="lr-prose">
              <RichText text={p} />
            </p>
          ))}
        </section>
      )
    case "code":
      return (
        <section className="space-y-3" aria-labelledby={id}>
          <H2 id={id}>{section.heading}</H2>
          {section.intro && (
            <p className="lr-prose">
              <RichText text={section.intro} />
            </p>
          )}
          <CodeExampleView example={section.example} />
        </section>
      )
    case "diagram":
      return (
        <section className="space-y-3" aria-labelledby={id}>
          <H2 id={id}>{section.heading}</H2>
          <DiagramView diagram={section.diagram} />
        </section>
      )
    case "mistakes":
      return (
        <section className="space-y-3" aria-labelledby={id}>
          <H2 id={id}>{section.heading}</H2>
          <ul className="space-y-3">
            {section.items.map((m, i) => (
              <li
                key={i}
                className="space-y-1 rounded-lg border border-border bg-card p-3 text-sm"
              >
                <p>
                  <span className="font-medium">Mistake: </span>
                  <RichText text={m.mistake} />
                </p>
                <p>
                  <span className="font-medium">Fix: </span>
                  <RichText text={m.fix} />
                </p>
              </li>
            ))}
          </ul>
        </section>
      )
    case "practical":
      return (
        <section className="space-y-3" aria-labelledby={id}>
          <H2 id={id}>{section.heading}</H2>
          <p className="lr-prose rounded-lg border border-border bg-secondary/40 p-3 text-sm">
            <span className="font-medium">Situation: </span>
            <RichText text={section.scenario} />
          </p>
          {section.body.map((p, i) => (
            <p key={i} className="lr-prose">
              <RichText text={p} />
            </p>
          ))}
          {section.example && <CodeExampleView example={section.example} />}
        </section>
      )
  }
}
