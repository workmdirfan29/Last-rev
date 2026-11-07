import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format } from "date-fns"
import { formatMinuteTick, minuteTicks } from "@/services/analytics/chart-ticks"
import type { DayActivity } from "@/services/analytics/summary"
import { fromDateKey } from "@/utils/dates"

interface TipProps {
  active?: boolean
  payload?: { payload: DayActivity & { label: string } }[]
}

function ChartTip({ active, payload }: TipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md">
      <p className="font-medium">{format(fromDateKey(d.date), "EEE, d MMM")}</p>
      <p className="text-muted-foreground">
        {d.minutes} min · {d.items} {d.items === 1 ? "activity" : "activities"}
      </p>
    </div>
  )
}

/** Single series → no legend; the card title names it. Table alternative included for screen readers. */
export function WeeklyChart({ week }: { week: DayActivity[] }) {
  const data = week.map((d) => ({
    ...d,
    label: format(fromDateKey(d.date), "EEE"),
  }))
  const total = week.reduce((s, d) => s + d.minutes, 0)
  const axis = minuteTicks(Math.max(0, ...week.map((d) => d.minutes)))

  return (
    <div>
      <div
        className="h-44 w-full"
        role="img"
        aria-label={`Study minutes per day over the last 7 days, ${total} minutes in total`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 4, bottom: 0, left: -20 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              // Ticks come from the data maximum, so they are always distinct whole values.
              domain={[0, axis.top]}
              ticks={axis.ticks}
              interval={0}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={44}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickFormatter={formatMinuteTick}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              content={<ChartTip />}
            />
            <Bar
              dataKey="minutes"
              fill="var(--chart-1)"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Study minutes per day, last 7 days</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Minutes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <td>{d.date}</td>
              <td>{d.minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
