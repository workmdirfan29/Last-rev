import { useMemo, useState } from "react"
import { format } from "date-fns"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ANALYTICS_WEEKS,
  MIN_SNAPSHOTS_FOR_TREND,
  activityByType,
  computeStreak,
  confidenceDistribution,
  streakRuns,
  weeklyMinutes,
  weakAndAverage,
} from "@/services/readiness/analytics"
import { useLearnerStore } from "@/stores/learner-store"
import { fromDateKey, toDateKey } from "@/utils/dates"

const TYPE_LABEL: Record<string, string> = {
  question: "Questions",
  lesson: "Lessons and plan blocks",
  hr: "HR",
  mock: "Mock interviews",
  linux: "Linux",
  english: "Spoken English",
  revision: "Revision",
  coding: "Coding exercises",
  project: "Projects",
}
const day = (k: string) => format(fromDateKey(k), "d MMM")

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>
}

/** Charts and tables from the activity log and progress records. A view is drawn only when there is data. */
export function AnalyticsSection() {
  const activity = useLearnerStore((s) => s.activity)
  const progress = useLearnerStore((s) => s.progress)
  const snapshots = useLearnerStore((s) => s.readinessSnapshots)
  const [today] = useState(() => toDateKey(new Date()))
  const weeks = useMemo(() => weeklyMinutes(activity, today), [activity, today])
  const types = useMemo(() => activityByType(activity), [activity])
  const runs = useMemo(
    () => streakRuns(activity.map((a) => a.date)),
    [activity]
  )
  const streak = useMemo(
    () =>
      computeStreak(
        activity.map((a) => a.date),
        today
      ),
    [activity, today]
  )
  const conf = useMemo(() => confidenceDistribution(progress), [progress])
  const weak = useMemo(() => weakAndAverage(progress), [progress])
  const sorted = [...snapshots].sort((a, b) => a.id.localeCompare(b.id))
  const confTotal = conf.rated.reduce((a, b) => a + b, 0) + conf.unrated

  return (
    <section
      className="space-y-6"
      aria-labelledby="analytics"
      data-testid="analytics"
    >
      <div className="space-y-1">
        <h2
          id="analytics"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          Analytics
        </h2>
        <p className="text-xs text-muted-foreground">
          From your activity log and progress records on this device. Nothing
          here is estimated, and a view appears only when it has data.
        </p>
      </div>

      <div className="space-y-2" data-testid="weekly-minutes">
        <h3 className="text-sm font-medium">
          Study minutes by week (last {ANALYTICS_WEEKS} weeks)
        </h3>
        {weeks.length === 0 ? (
          <Empty>No study time recorded yet.</Empty>
        ) : (
          <>
            <div className="h-44 w-full" aria-hidden>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeks.map((w) => ({
                    week: day(w.weekStart),
                    minutes: w.minutes,
                  }))}
                >
                  <CartesianGrid vertical={false} strokeOpacity={0.2} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    width={32}
                    allowDecimals={false}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="minutes"
                    fill="var(--chart-1, #a3e635)"
                    radius={[3, 3, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table className="sr-only">
              <caption>Study minutes by week</caption>
              <thead>
                <tr>
                  <th>Week starting</th>
                  <th>Minutes</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((w) => (
                  <tr key={w.weekStart}>
                    <td>{day(w.weekStart)}</td>
                    <td>{w.minutes}</td>
                    <td>{w.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <div className="space-y-2" data-testid="activity-types">
        <h3 className="text-sm font-medium">Activity by type</h3>
        {types.length === 0 ? (
          <Empty>No activity recorded yet.</Empty>
        ) : (
          <table className="w-full max-w-lg text-sm">
            <caption className="sr-only">Activity by type</caption>
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="py-1 font-medium">Type</th>
                <th className="py-1 text-right font-medium">Items</th>
                <th className="py-1 text-right font-medium">Minutes</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.type} className="border-t border-border">
                  <td className="py-1">{TYPE_LABEL[t.type] ?? t.type}</td>
                  <td className="py-1 text-right tabular-nums">{t.items}</td>
                  <td className="py-1 text-right tabular-nums">{t.minutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="space-y-2" data-testid="streaks">
        <h3 className="text-sm font-medium">Streak history</h3>
        {runs.length === 0 ? (
          <Empty>No study days recorded yet.</Empty>
        ) : (
          <>
            <p className="text-sm tabular-nums">
              Current streak {streak.current}{" "}
              {streak.current === 1 ? "day" : "days"} · longest {streak.longest}
            </p>
            <ul
              className="space-y-0.5 text-xs text-muted-foreground"
              aria-label="Recent runs of study days"
            >
              {runs.slice(0, 5).map((r) => (
                <li key={r.start} className="tabular-nums">
                  {day(r.start)}
                  {r.end !== r.start ? ` to ${day(r.end)}` : ""}: {r.days}{" "}
                  {r.days === 1 ? "day" : "days"}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="space-y-2" data-testid="confidence">
        <h3 className="text-sm font-medium">Question confidence</h3>
        {confTotal === 0 ? (
          <Empty>You have not rated any question yet.</Empty>
        ) : (
          <table className="w-full max-w-lg text-sm">
            <caption className="sr-only">
              Number of questions at each confidence rating
            </caption>
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="py-1 font-medium">Rating</th>
                <th className="py-1 font-medium">Questions</th>
                <th className="py-1 font-medium">
                  <span className="sr-only">Share</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ...conf.rated.map((n, i) => [`${i + 1} of 5`, n] as const),
                ["Not rated", conf.unrated] as const,
              ].map(([label, n]) => (
                <tr key={label} className="border-t border-border">
                  <td className="py-1">{label}</td>
                  <td className="py-1 tabular-nums">{n}</td>
                  <td className="w-1/2 py-1">
                    <div
                      className="h-2 rounded bg-primary/70"
                      style={{
                        width: `${(n / Math.max(1, confTotal)) * 100}%`,
                      }}
                      aria-hidden
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="space-y-2" data-testid="trend">
        <h3 className="text-sm font-medium">
          Readiness and weak topics over time
        </h3>
        <p className="text-xs text-muted-foreground tabular-nums">
          Now: {weak.weakTopics}{" "}
          {weak.weakTopics === 1 ? "question is" : "questions are"} flagged
          difficult or rated 1–2
          {weak.averageConfidence !== null
            ? ` · average confidence ${weak.averageConfidence}`
            : ""}
          .
        </p>
        {sorted.length < MIN_SNAPSHOTS_FOR_TREND ? (
          <Empty>
            A trend appears after {MIN_SNAPSHOTS_FOR_TREND} weekly snapshots;
            you have {sorted.length}. A snapshot is saved at most once a week
            from the week this feature started. Earlier weeks are not
            reconstructed.
          </Empty>
        ) : (
          <>
            <div className="h-44 w-full" aria-hidden>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={sorted.map((s) => ({
                    week: day(s.id),
                    overall: s.overall,
                    weak: s.weakTopics,
                  }))}
                >
                  <CartesianGrid vertical={false} strokeOpacity={0.2} />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={32} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="overall"
                    stroke="var(--chart-1, #a3e635)"
                    dot
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="weak"
                    stroke="var(--chart-2, #f59e0b)"
                    dot
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <table className="sr-only">
              <caption>Weekly snapshots</caption>
              <thead>
                <tr>
                  <th>Week starting</th>
                  <th>Overall readiness</th>
                  <th>Weak questions</th>
                  <th>Average confidence</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr key={s.id}>
                    <td>{day(s.id)}</td>
                    <td>{s.overall}%</td>
                    <td>{s.weakTopics}</td>
                    <td>{s.averageConfidence ?? "none"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground">
              Lines: overall readiness (%) and the number of weak questions, one
              point per weekly snapshot.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
