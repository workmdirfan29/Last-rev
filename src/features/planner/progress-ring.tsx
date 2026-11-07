/** A ring showing done minutes of the day's minutes, with the same facts as text for everyone else. */
export function ProgressRing({
  done,
  total,
  size = 72,
}: {
  done: number
  total: number
  size?: number
}) {
  const r = (size - 10) / 2
  const c = 2 * Math.PI * r
  const pct = total > 0 ? Math.min(1, done / total) : 0
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={
        total > 0
          ? `${done} of ${total} minutes done today`
          : "Nothing planned today"
      }
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={6}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={6}
          strokeLinecap="round"
          className="stroke-brand-ink transition-[stroke-dashoffset]"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums"
      >
        {total > 0 ? `${Math.round(pct * 100)}%` : "–"}
      </span>
    </div>
  )
}
