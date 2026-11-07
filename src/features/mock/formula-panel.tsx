import { KEYWORD_COVERAGE, SCORE_CAPTION } from "@/data/mock/rubric"
import type { SessionResult } from "@/services/mock/score"
import type { MockSession } from "@/types/learner"

const round1 = (n: number) => Math.round(n * 10) / 10

/**
 * "How this score is calculated": the formula in words, the weights the session used, and the learner's own
 * ratings line by line, so every number on the result can be traced back to something they entered.
 */
export function FormulaPanel({
  session,
  result,
  titleOf,
}: {
  session: MockSession
  result: SessionResult
  titleOf: (id: string) => string
}) {
  const rated = result.questions.filter((q) => q.points !== null)
  return (
    <div className="space-y-5 text-sm" data-testid="formula-panel">
      <div className="space-y-2">
        <p>
          Every rating below is one you gave yourself, from 1 to 5. A rating of
          1 counts as 0 points, 2 as 25, 3 as 50, 4 as 75 and 5 as 100.
        </p>
        <ol className="list-decimal space-y-1 ps-5">
          <li>
            A question's points are its rated dimensions' points, multiplied by
            their weights, added up and divided by the weights of the dimensions
            you rated.
          </li>
          <li>
            Your score is the average of the points of the questions you
            answered and rated.
          </li>
          <li>
            Questions you did not answer or did not rate have no points. They
            are not counted in the score, and the line beside it shows the total
            if they counted as zero.
          </li>
          <li>
            {session.config.includeKeywords
              ? `You turned on keyword coverage: it is one extra line, weight ${session.rubric.keywordWeight}, worth the share of keywords found in your typed answer (a text match that cannot judge correctness).`
              : "Keyword coverage (a text match) is not part of this score. You can turn it on when you set up an interview."}
          </li>
        </ol>
        <p className="text-xs text-muted-foreground">{SCORE_CAPTION}</p>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Weights used by this session</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(session.rubric.kinds).map(([kind, dims]) => (
            <table key={kind} className="w-full text-xs">
              <caption className="pb-1 text-start font-medium capitalize">
                {kind === "hr" ? "HR questions" : "Technical questions"}
              </caption>
              <tbody>
                {dims.map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="py-1">{d.label}</td>
                    <td className="py-1 text-end tabular-nums">{d.weight}</td>
                  </tr>
                ))}
                {session.config.includeKeywords && (
                  <tr className="border-t border-border">
                    <td className="py-1">{KEYWORD_COVERAGE.label}</td>
                    <td className="py-1 text-end tabular-nums">
                      {session.rubric.keywordWeight}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Your ratings, question by question</h4>
        {rated.length === 0 ? (
          <p className="text-muted-foreground">
            No question was rated, so there is no score.
          </p>
        ) : (
          <ul className="space-y-3">
            {rated.map((q) => (
              <li
                key={q.questionId}
                className="rounded-lg border border-border p-3"
              >
                <p className="font-medium">{titleOf(q.questionId)}</p>
                <table className="mt-1 w-full text-xs">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th scope="col" className="text-start font-normal">
                        Dimension
                      </th>
                      <th scope="col" className="text-end font-normal">
                        Weight
                      </th>
                      <th scope="col" className="text-end font-normal">
                        Your rating
                      </th>
                      <th scope="col" className="text-end font-normal">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.lines
                      .filter((l) => l.used)
                      .map((l) => (
                        <tr key={l.id} className="border-t border-border">
                          <th
                            scope="row"
                            className="py-1 text-start font-normal"
                          >
                            {l.label}
                          </th>
                          <td className="py-1 text-end tabular-nums">
                            {l.weight}
                          </td>
                          <td className="py-1 text-end tabular-nums">
                            {l.rating !== null
                              ? `${l.rating} of 5`
                              : "text match"}
                          </td>
                          <td className="py-1 text-end tabular-nums">
                            {round1(l.weighted / l.weight)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <p className="mt-1 text-xs">
                  Points = sum of weight × points ÷ {q.weightUsed} ={" "}
                  <strong
                    className="tabular-nums"
                    data-testid={`points-${q.questionId}`}
                  >
                    {round1(q.points!)}
                  </strong>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {result.score !== null && (
        <p data-testid="formula-total">
          Score = ({rated.map((q) => round1(q.points!)).join(" + ")}) ÷{" "}
          {rated.length} ={" "}
          <strong className="tabular-nums">{round1(result.score)}</strong>
          {result.scoreIfZero !== null && (
            <>
              {". If the "}
              {result.asked - rated.length} unanswered or unrated counted as
              zero: ({rated.map((q) => round1(q.points!)).join(" + ")}) ÷{" "}
              {result.asked} ={" "}
              <strong className="tabular-nums">
                {round1(result.scoreIfZero)}
              </strong>
            </>
          )}
          .
        </p>
      )}
    </div>
  )
}
