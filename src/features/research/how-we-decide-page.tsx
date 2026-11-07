import { Link } from "react-router"
import { PageHeader } from "@/components/shared/page-header"

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-heading text-lg font-semibold tracking-tight">
    {children}
  </h2>
)

/**
 * A plain explanation of how what you study is chosen. Every statement here is something the code enforces or
 * the content does; none is a claim about what interviewers ask.
 */
export function HowWeDecidePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Method"
        title="How we decide what to study"
        description="Questions and lessons are chosen by editors, not by data. Here is what that means and what we check."
      />

      <section className="space-y-2" aria-labelledby="chosen">
        <H2 id="chosen">What is chosen, and how</H2>
        <ul className="lr-prose list-disc space-y-1.5 ps-5">
          <li>
            Each module lists the topics a developer needs, with the time each
            takes. Questions and lessons are written to cover those topics, one
            at a time.
          </li>
          <li>
            Questions come at three levels (fresher, intermediate, advanced),
            with targets of 25, 50 and 75 per module. A module is only called
            ready when it reaches its target at the fresher level.
          </li>
          <li>
            The Study roadmaps put modules in a learning order (phases). That
            order is about what builds on what, not about popularity.
          </li>
        </ul>
      </section>

      <section className="space-y-2" aria-labelledby="sources">
        <H2 id="sources">Where the content comes from</H2>
        <ul className="lr-prose list-disc space-y-1.5 ps-5">
          <li>
            Every question and lesson cites official documentation. A check
            rejects any source that is not on a list of official sites, and a
            script checks the links.
          </li>
          <li>
            HR and behavioural questions are written in general terms. A check
            rejects company names, so nothing here is a company&apos;s own
            interview.
          </li>
          <li>
            Code examples are checked for structure, and exercises that run have
            their reference solution tested.
          </li>
        </ul>
      </section>

      <section className="space-y-2" aria-labelledby="no-data">
        <H2 id="no-data">What we do not have</H2>
        <ul className="lr-prose list-disc space-y-1.5 ps-5">
          <li>
            <strong>We have no data on how often any question is asked.</strong>{" "}
            A check rejects wording such as &quot;asked in most
            interviews&quot;, &quot;top 10&quot;, or &quot;guaranteed to come
            up&quot;, and wording that presents a number as a hiring statistic.
          </li>
          <li>
            Because of that, the library is a map of fundamentals, not a list of
            what will be asked. Do not read the order or the number of questions
            as a ranking.
          </li>
          <li>
            Your readiness numbers are coverage and your own confidence. They
            are not a prediction of results.
          </li>
        </ul>
      </section>

      <section className="space-y-2" aria-labelledby="evidence">
        <H2 id="evidence">When we do cite evidence</H2>
        <p className="lr-prose">
          The{" "}
          <Link className="underline underline-offset-4" to="/research">
            research page
          </Link>{" "}
          holds claims about what to study, each with its source, the date it
          was researched and a confidence. Predictions about 2027 are forecasts:
          they are labelled &quot;Prediction, not verified&quot; wherever they
          appear and are never shown as observed.
        </p>
      </section>

      <section className="space-y-2" aria-labelledby="use">
        <H2 id="use">How to use this</H2>
        <ul className="lr-prose list-disc space-y-1.5 ps-5">
          <li>
            Cover the fundamentals of your path first; use the questions to find
            gaps, not to guess the paper.
          </li>
          <li>
            Write your own answers and notes: the Interview Zone lets you add
            your own questions.
          </li>
          <li>
            If something here looks wrong or out of date, treat the official
            documentation it links to as the authority.
          </li>
        </ul>
      </section>
    </div>
  )
}
