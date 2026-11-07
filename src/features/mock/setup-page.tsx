import { useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { MODULE_BY_ID } from "@/data/catalog/modules"
import { MOCK_TYPES, MOCK_TYPE_DEFS, type MockType } from "@/data/mock/types"
import { useOwnQuestionEntries, useQuestionIndex } from "@/hooks/use-content"
import { cn } from "@/lib/utils"
import {
  buildPool,
  defaultLevels,
  drawQuestions,
  typeHasQuestions,
  typeModules,
  type PoolInput,
} from "@/services/mock/pool"
import { newSession } from "@/services/mock/session"
import { useLearnerStore } from "@/stores/learner-store"
import {
  EXPERIENCE_LEVELS,
  LEVEL_META,
  type ExperienceLevel,
} from "@/types/content"
import { mockConfigSchema, type MockConfig } from "@/types/learner"
import { SCORE_CAPTION } from "@/data/mock/rubric"

const COUNTS = [5, 10, 15, 20, 25, 30]
const DURATIONS = [10, 15, 20, 30, 45, 60, 90]

/** `/mock/new`: choose the type and the settings; the number of available questions updates as you change them. */
export function SetupPage() {
  const navigate = useNavigate()
  const { data: index } = useQuestionIndex()
  const profile = useLearnerStore((s) => s.profile)
  const progress = useLearnerStore((s) => s.progress)
  const own = useOwnQuestionEntries()
  const create = useLearnerStore((s) => s.createMockSession)
  // "Start another with the same settings" pre-fills this page from a finished session.
  const [params] = useSearchParams()
  const from = useLearnerStore((s) =>
    s.mockSessions.find((m) => m.id === params.get("from"))
  )?.config

  const [type, setType] = useState<MockType>(from?.type ?? "technical")
  const [levels, setLevels] = useState<ExperienceLevel[]>(
    () => from?.levels ?? defaultLevels(profile?.experience)
  )
  const [difficulty, setDifficulty] = useState<MockConfig["difficulty"]>(
    from?.difficulty ?? "any"
  )
  const [moduleIds, setModuleIds] = useState<string[]>(from?.moduleIds ?? [])
  const [count, setCount] = useState(from?.count ?? 10)
  const [duration, setDuration] = useState(from?.durationMinutes ?? 30)
  const [guide, setGuide] = useState(from?.perQuestionGuide ?? true)
  const [hints, setHints] = useState(from?.hints ?? true)
  const [prefer, setPrefer] = useState(from?.preferUnpractised ?? false)
  const [ratingMode, setRatingMode] = useState<MockConfig["ratingMode"]>(
    from?.ratingMode ?? "end"
  )
  const [keywords, setKeywords] = useState(from?.includeKeywords ?? false)

  const input = useMemo(
    () =>
      (t: MockType, narrowed: string[] = []): PoolInput => ({
        type: t,
        levels,
        difficulty,
        moduleIds: narrowed,
        index: index ?? [],
        own,
        profile,
        progress,
      }),
    [levels, difficulty, index, own, profile, progress]
  )
  const cards = useMemo(
    () =>
      MOCK_TYPES.map((t) => ({
        t,
        exists: typeHasQuestions(input(t)),
        available: buildPool(input(t, t === type ? moduleIds : [])).length,
      })),
    [input, type, moduleIds]
  )
  const pool = useMemo(
    () => buildPool(input(type, moduleIds)),
    [input, type, moduleIds]
  )
  const modules = useMemo(
    () =>
      MOCK_TYPE_DEFS[type].pickModules ? [...typeModules(input(type))] : [],
    [input, type]
  )

  if (!index) return <ScreenLoader />
  const def = MOCK_TYPE_DEFS[type]
  const available = pool.length
  const asked = Math.min(count, available)
  const needsModules = type === "custom" && moduleIds.length === 0
  const blocked =
    available === 0
      ? type === "custom" && moduleIds.length === 0
        ? "Choose at least one module."
        : "No questions match these settings. Change the level, difficulty or modules."
      : null

  function start() {
    const config = mockConfigSchema.parse({
      type,
      levels,
      difficulty,
      moduleIds,
      count,
      durationMinutes: duration,
      perQuestionGuide: guide,
      hints,
      preferUnpractised: prefer,
      ratingMode,
      includeKeywords: keywords,
    })
    const seed = Math.floor(Math.random() * 2 ** 31)
    const draw = drawQuestions(pool, type, {
      count,
      seed,
      preferUnpractised: prefer,
      progress,
    })
    if (draw.ids.length === 0) return
    const session = newSession({
      config,
      questionIds: draw.ids,
      requested: draw.requested,
      seed,
      now: new Date(),
    })
    void create(session).then(() => navigate(`/mock/${session.id}`))
  }

  const toggle = <T,>(list: T[], v: T, on: boolean) =>
    on ? [...list, v] : list.filter((x) => x !== v)

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <PageHeader
        eyebrow="Mock interview"
        title="New mock interview"
        description="Answer one question at a time against a timer, then reveal the model answers and rate your own answers. Questions come only from the question bank and your own questions."
        actions={
          <Button asChild variant="ghost">
            <Link to="/mock">Back</Link>
          </Button>
        }
      />

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Interview type</legend>
        <RadioGroup
          value={type}
          onValueChange={(v) => {
            setType(v as MockType)
            setModuleIds([])
          }}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map(({ t, exists, available: n }) => {
            const d = MOCK_TYPE_DEFS[t]
            const disabled = exists === 0 && t !== "custom"
            return (
              <Label
                key={t}
                htmlFor={`type-${t}`}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-xl border bg-card p-3 font-normal",
                  type === t
                    ? "border-primary ring-1 ring-primary/60"
                    : "border-border",
                  disabled && "cursor-not-allowed opacity-60"
                )}
              >
                <RadioGroupItem
                  id={`type-${t}`}
                  value={t}
                  disabled={disabled}
                  className="mt-0.5"
                />
                <span className="space-y-0.5">
                  <span className="block text-sm font-medium">{d.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {d.description}
                  </span>
                  <span className="block text-xs">
                    {disabled
                      ? "No questions yet for this type"
                      : `${n} available`}
                  </span>
                </span>
              </Label>
            )
          })}
        </RadioGroup>
      </fieldset>

      {!def.levelNeutral && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Experience level</legend>
          <div className="flex flex-wrap gap-4">
            {EXPERIENCE_LEVELS.map((l) => (
              <div key={l} className="flex items-center gap-2">
                <Checkbox
                  id={`level-${l}`}
                  checked={levels.includes(l)}
                  onCheckedChange={(v) =>
                    setLevels(toggle(levels, l, v === true))
                  }
                />
                <Label htmlFor={`level-${l}`} className="font-normal">
                  {LEVEL_META[l].label}
                </Label>
              </div>
            ))}
          </div>
        </fieldset>
      )}

      {modules.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">
            Modules{" "}
            <span className="font-normal text-muted-foreground">
              {type === "custom"
                ? "(choose at least one)"
                : "(none chosen means all of them)"}
            </span>
          </legend>
          <ul className="grid gap-2 sm:grid-cols-2">
            {modules.map((id) => (
              <li key={id} className="flex items-center gap-2">
                <Checkbox
                  id={`mod-${id}`}
                  checked={moduleIds.includes(id)}
                  onCheckedChange={(v) =>
                    setModuleIds(toggle(moduleIds, id, v === true))
                  }
                />
                <Label htmlFor={`mod-${id}`} className="font-normal">
                  {MODULE_BY_ID.get(id)?.title ?? id}
                </Label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={difficulty}
            onValueChange={(v) => setDifficulty(v as MockConfig["difficulty"])}
          >
            <SelectTrigger id="difficulty" aria-label="Difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["any", "easy", "medium", "hard"].map((d) => (
                <SelectItem key={d} value={d} className="capitalize">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="count">Number of questions</Label>
          <Select
            value={String(count)}
            onValueChange={(v) => setCount(Number(v))}
          >
            <SelectTrigger id="count" aria-label="Number of questions">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="duration">Duration</Label>
          <Select
            value={String(duration)}
            onValueChange={(v) => setDuration(Number(v))}
          >
            <SelectTrigger id="duration" aria-label="Duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Options</legend>
        {[
          ["Show a per-question time guide", guide, setGuide, "guide"],
          ["Allow hints", hints, setHints, "hints"],
          [
            "Prefer questions I have not practised",
            prefer,
            setPrefer,
            "prefer",
          ],
        ].map(([label, value, set, id]) => (
          <div key={id as string} className="flex items-center gap-2">
            <Switch
              id={`opt-${id}`}
              checked={value as boolean}
              onCheckedChange={set as (v: boolean) => void}
            />
            <Label htmlFor={`opt-${id}`} className="font-normal">
              {label as string}
            </Label>
          </div>
        ))}
        <div className="space-y-1.5">
          <p className="text-sm">When do you rate your answers?</p>
          <RadioGroup
            value={ratingMode}
            onValueChange={(v) => setRatingMode(v as MockConfig["ratingMode"])}
            className="gap-2"
          >
            <Label htmlFor="rate-end" className="font-normal">
              <RadioGroupItem id="rate-end" value="end" /> At the end, after the
              timed interview (recommended)
            </Label>
            <Label htmlFor="rate-each" className="font-normal">
              <RadioGroupItem id="rate-each" value="each" /> Right after each
              answer (the timer pauses while you rate)
            </Label>
          </RadioGroup>
        </div>
        <div className="flex items-start gap-2">
          <Switch
            id="opt-keywords"
            checked={keywords}
            onCheckedChange={setKeywords}
            className="mt-0.5"
          />
          <Label htmlFor="opt-keywords" className="font-normal">
            Include keyword coverage in my score
            <span className="block text-xs text-muted-foreground">
              Off by default. It is a plain text match that cannot judge
              correctness; if you turn it on it is one named line in the
              formula.
            </span>
          </Label>
        </div>
      </fieldset>

      <section
        aria-label="Summary"
        className="space-y-1 rounded-xl border border-border bg-card p-4 text-sm"
      >
        <p role="status" aria-live="polite" data-testid="available">
          {available === 0
            ? "0 questions are available for these settings."
            : `${available} ${available === 1 ? "question is" : "questions are"} available for these settings.`}
        </p>
        {available > 0 && available < count && (
          <p>
            Only {available} {available === 1 ? "question is" : "questions are"}{" "}
            available for these settings, so the interview will have {asked}.
            Nothing is repeated or invented.
          </p>
        )}
        {type === "mixed" && asked >= 4 && (
          <p className="text-muted-foreground">
            Mixed draws from technical and HR questions in proportion, with at
            least one HR question.
          </p>
        )}
        {blocked && <p className="text-destructive">{blocked}</p>}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          onClick={start}
          disabled={available === 0 || needsModules}
        >
          Start interview
        </Button>
        <p className="text-xs text-muted-foreground">
          {asked} questions, {duration} minutes.
        </p>
      </div>

      <details className="rounded-xl border border-border bg-card p-4 text-sm">
        <summary className="cursor-pointer font-medium">
          How the score is calculated
        </summary>
        <div className="mt-3 space-y-2">
          <p>
            Your score comes from ratings you give yourself, from 1 to 5, after
            you see the model answer. Nothing reads or judges what you type.{" "}
            {SCORE_CAPTION}
          </p>
          <p>
            You will see the formula, the weights and every rating you entered
            on the result page.
          </p>
        </div>
      </details>
    </div>
  )
}
