import { Link } from "react-router"
import { ExternalLinkIcon } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CodeBlock } from "@/components/shared/code-block"
import { RichText } from "@/components/shared/rich-text"
import type { Question, QuestionIndexEntry } from "@/types/content"
import { DiagramView } from "./diagram-view"

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-base font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="lr-prose">
      {items.map((t, i) => (
        <li key={i}>
          <RichText text={t} />
        </li>
      ))}
    </ul>
  )
}

/** ~2.5 spoken words per second, rounded to the nearest 5 seconds. */
function speakSeconds(text: string) {
  const words = text.trim().split(/\s+/).length
  return Math.max(5, Math.round(words / 2.5 / 5) * 5)
}

export function QuickAnswer({ q }: { q: Question }) {
  return (
    <div className="space-y-7">
      <section className="space-y-2 rounded-xl border border-primary/40 bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-base font-semibold tracking-tight">
            Say it in an interview
          </h2>
          <span className="text-xs text-muted-foreground">
            ≈ {speakSeconds(q.shortAnswer)} seconds spoken
          </span>
        </div>
        <p className="lr-prose text-base">
          <RichText text={q.shortAnswer} />
        </p>
      </section>

      <Section title="Why interviewers ask this">
        <p className="lr-prose">
          <RichText text={q.interviewerIntent} />
        </p>
      </Section>

      <Section title="Key points to remember">
        <Bullets items={q.keyPoints} />
      </Section>

      {q.answerTips.length > 0 && (
        <Section title="How to answer confidently">
          <Bullets items={q.answerTips} />
        </Section>
      )}

      {q.revisionNotes.length > 0 && (
        <Section title="Revision notes">
          <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3">
            <Bullets items={q.revisionNotes} />
          </div>
        </Section>
      )}
    </div>
  )
}

export function DeepAnswer({
  q,
  related,
}: {
  q: Question
  related: QuestionIndexEntry[]
}) {
  return (
    <div className="space-y-8">
      <Section title="Explanation">
        <div className="lr-prose">
          {q.detailedAnswer.map((p, i) => (
            <p key={i}>
              <RichText text={p} />
            </p>
          ))}
        </div>
      </Section>

      <Section title="Real-world example">
        <p className="lr-prose">
          <RichText text={q.realWorldExample} />
        </p>
      </Section>

      {q.codeExamples.map((ex, i) => (
        <Section key={i} title={ex.title}>
          <CodeBlock code={ex.code} language={ex.language} />
          <div>
            <h3 className="mb-1.5 text-xs font-medium text-muted-foreground">
              Step by step
            </h3>
            <ol className="lr-prose list-decimal space-y-1.5 ps-5">
              {ex.walkthrough.map((s, j) => (
                <li key={j}>
                  <RichText text={s} />
                </li>
              ))}
            </ol>
          </div>
        </Section>
      ))}

      {q.diagram && (
        <Section title="Visual explanation">
          <DiagramView diagram={q.diagram} />
        </Section>
      )}

      <Section title="Common mistakes">
        <Bullets items={q.commonMistakes} />
      </Section>

      <Section title="Tricky follow-up questions">
        <Accordion
          type="multiple"
          className="rounded-lg border border-border px-3"
        >
          {q.followUps.map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`}>
              <AccordionTrigger className="text-left text-sm">
                <span>
                  <RichText text={f.question} />
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  {f.hint ? (
                    <RichText text={f.hint} />
                  ) : (
                    "Try answering this out loud before moving on."
                  )}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {related.length > 0 && (
        <Section title="Related questions">
          <ul className="space-y-1.5">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  to={`/interview/question/${r.id}`}
                  className="text-sm text-tech hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {q.sourceRefs.length > 0 && (
        <Section title="Sources">
          <ul className="space-y-1.5">
            {q.sourceRefs.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-sm text-tech hover:underline"
                >
                  {s.label} <ExternalLinkIcon className="size-3" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}
