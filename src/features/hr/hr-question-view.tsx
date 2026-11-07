import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { RichText } from "@/components/shared/rich-text"
import { SAMPLE_LABEL } from "@/data/hr/guidance"
import type { Question } from "@/types/content"
import { AnswerWorkspace, PracticePanel, Section } from "./answer-workspace"

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="lr-prose">
    {items.map((t, i) => (
      <li key={i}>
        <RichText text={t} />
      </li>
    ))}
  </ul>
)

/**
 * The HR layout of a question: what HR is asking, your own STAR answer (written and saved by you), a
 * sample that stays hidden until you reveal it, and a practice panel. Everything is self-directed: the
 * app stores and shows what you write and never evaluates it.
 */
export function HrQuestionView({
  question,
  onMarkPractised,
}: {
  question: Question
  onMarkPractised: () => void
}) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="space-y-8">
      <Section id="hr-why" title="Why HR asks this">
        <p className="lr-prose">
          <RichText text={question.interviewerIntent} />
        </p>
        {question.recruiterExpects && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-medium text-muted-foreground">
              What the recruiter expects
            </h3>
            <Bullets items={question.recruiterExpects} />
          </div>
        )}
      </Section>

      {question.answerFramework && (
        <Section id="hr-framework" title="A framework for your answer">
          <p className="text-xs text-muted-foreground">
            Fill each [bracket] with your own facts. Never use experience,
            achievements or numbers that are not yours.
          </p>
          <ol className="lr-prose list-decimal space-y-1.5 ps-5">
            {question.answerFramework.map((s, i) => (
              <li key={i}>
                <RichText text={s} />
              </li>
            ))}
          </ol>
        </Section>
      )}

      <AnswerWorkspace question={question} />

      <Section id="hr-sample" title="Sample answer">
        {revealed ? (
          <div className="space-y-6">
            <p
              role="note"
              className="rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs"
            >
              {SAMPLE_LABEL}
            </p>
            <div className="space-y-2 rounded-xl border border-success/40 bg-card p-4 sm:p-5">
              <h3 className="text-sm font-medium">A stronger answer</h3>
              <p className="lr-prose text-base">
                <RichText text={question.shortAnswer} />
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Why it works</h3>
              <div className="lr-prose">
                {question.detailedAnswer.map((p, i) => (
                  <p key={i}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            </div>
            {question.weakAnswer && (
              <div className="space-y-2 rounded-xl border border-destructive/40 bg-card p-4 sm:p-5">
                <h3 className="text-sm font-medium">A weaker answer</h3>
                <p className="lr-prose">
                  <RichText text={question.weakAnswer} />
                </p>
                {question.weakAnswerWhy && (
                  <>
                    <h4 className="pt-1 text-xs font-medium text-muted-foreground">
                      Why it is weak
                    </h4>
                    <Bullets items={question.weakAnswerWhy} />
                  </>
                )}
              </div>
            )}
            <Button variant="outline" onClick={() => setRevealed(false)}>
              <EyeOffIcon /> Hide the sample
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Try your own answer first, out loud or in writing. The sample is
              hidden until you want to compare.
            </p>
            <Button size="lg" onClick={() => setRevealed(true)}>
              <EyeIcon /> Show sample answer
            </Button>
          </div>
        )}
      </Section>

      <Section id="hr-mistakes" title="Mistakes to avoid">
        <Bullets items={question.commonMistakes} />
      </Section>

      {question.answerTips.length > 0 && (
        <Section id="hr-tips" title="Tips">
          <Bullets items={question.answerTips} />
        </Section>
      )}

      <Section id="hr-followups" title="Follow-up questions">
        <Accordion
          type="multiple"
          className="rounded-lg border border-border px-3"
        >
          {question.followUps.map((f, i) => (
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

      <PracticePanel
        questionId={question.id}
        onMarkPractised={onMarkPractised}
      />
    </div>
  )
}
