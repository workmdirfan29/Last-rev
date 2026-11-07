import { useMemo, useState } from "react"
import { Link } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { ScreenLoader } from "@/components/shared/screen-loader"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loadAllLessons } from "@/data/english/loaders"
import { ENGLISH_MODULES } from "@/data/english/modules"
import { lessonsOfModule } from "@/services/english/catalogue"
import {
  buildSession,
  TEXT_KINDS,
  type ExerciseKind,
} from "@/services/english/exercises"
import { shuffled, seededRandom } from "@/utils/random"
import type { EnglishItem, EnglishLesson } from "@/types/english"
import { Dictation } from "../dictation"
import { ExerciseSession, type SessionResult } from "../exercise-session"
import { SPEAKING_HONESTY } from "../copy"
import { ListenControls } from "../listen-controls"
import { useSpeech } from "../use-speech"
import { useTimeOnTask } from "../use-time-on-task"

const KIND_LABEL: Record<string, string> = {
  type: "Type the English",
  arrange: "Put words in order",
  blank: "Fill the blank",
  choose: "Choose the word",
  match: "Match English and Hindi",
}
const COUNTS = [5, 10, 15] as const

type Mode = "write" | "speak" | "listen"

function useAllLessons() {
  return useQuery({
    queryKey: ["english-all"],
    queryFn: loadAllLessons,
    staleTime: Infinity,
  })
}

function Scope({
  scope,
  setScope,
}: {
  scope: string
  setScope: (s: string) => void
}) {
  const modules = ENGLISH_MODULES.filter(
    (m) => lessonsOfModule(m.id).length > 0
  )
  return (
    <div className="space-y-1">
      <Label htmlFor="scope">Practise from</Label>
      <select
        id="scope"
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        className="h-9 w-full max-w-xs rounded-lg border border-input bg-background px-2 text-sm"
      >
        <option value="all">The whole course</option>
        {modules.map((m) => (
          <option key={m.id} value={m.id}>
            {m.title}
          </option>
        ))}
      </select>
    </div>
  )
}

function Summary({ text, onAgain }: { text: string; onAgain: () => void }) {
  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-card p-4"
      role="status"
    >
      <p className="text-sm font-medium">{text}</p>
      <Button type="button" onClick={onAgain}>
        Practise again
      </Button>
    </div>
  )
}

function WritePractice({ lessons }: { lessons: readonly EnglishLesson[] }) {
  const [scope, setScope] = useState("all")
  const [kinds, setKinds] = useState<ExerciseKind[]>([...TEXT_KINDS])
  const [count, setCount] = useState<number>(10)
  const [run, setRun] = useState<{ seed: number } | null>(null)
  const [result, setResult] = useState<SessionResult | null>(null)

  const pool = useMemo(
    () => lessons.filter((l) => scope === "all" || l.moduleId === scope),
    [lessons, scope]
  )
  const plan = useMemo(
    () => (run ? buildSession(pool, { kinds, count, seed: run.seed }) : null),
    [run, pool, kinds, count]
  )
  const available = useMemo(
    () => buildSession(pool, { kinds, count: 9999, seed: 1 }).available,
    [pool, kinds]
  )

  if (result)
    return (
      <Summary
        text={`${result.correct} of ${result.total} correct.`}
        onAgain={() => {
          setResult(null)
          setRun(null)
        }}
      />
    )
  if (run && plan && plan.exercises.length > 0)
    return (
      <ExerciseSession
        exercises={plan.exercises}
        onDone={setResult}
        doneLabel="Finish"
      />
    )

  return (
    <div className="space-y-4">
      <Scope scope={scope} setScope={setScope} />
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Kinds of exercise</legend>
        <div className="flex flex-wrap gap-2">
          {TEXT_KINDS.map((k) => {
            const on = kinds.includes(k)
            return (
              <Button
                key={k}
                type="button"
                size="sm"
                variant={on ? "default" : "outline"}
                aria-pressed={on}
                onClick={() =>
                  setKinds(on ? kinds.filter((x) => x !== k) : [...kinds, k])
                }
              >
                {KIND_LABEL[k]}
              </Button>
            )
          })}
        </div>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">How many</legend>
        <div className="flex gap-2">
          {COUNTS.map((c) => (
            <Button
              key={c}
              type="button"
              size="sm"
              variant={count === c ? "default" : "outline"}
              aria-pressed={count === c}
              onClick={() => setCount(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </fieldset>
      <p className="text-xs text-muted-foreground" data-testid="available">
        {available === 0
          ? "There are no exercises for these choices."
          : available < count
            ? `Only ${available} exercises exist for these choices, so you will get ${available}.`
            : `${available} exercises available.`}
      </p>
      <Button
        type="button"
        disabled={available === 0 || kinds.length === 0}
        onClick={() => setRun({ seed: Date.now() })}
      >
        Start
      </Button>
    </div>
  )
}

function SpeakPractice({ lessons }: { lessons: readonly EnglishLesson[] }) {
  const [scope, setScope] = useState("all")
  const [count, setCount] = useState<number>(5)
  const [run, setRun] = useState<{ seed: number } | null>(null)
  const [done, setDone] = useState(false)
  const pool = useMemo(
    () => lessons.filter((l) => scope === "all" || l.moduleId === scope),
    [lessons, scope]
  )
  const plan = useMemo(
    () =>
      run
        ? buildSession(pool, { kinds: ["speak"], count, seed: run.seed })
        : null,
    [run, pool, count]
  )
  const available = useMemo(
    () =>
      buildSession(pool, { kinds: ["speak"], count: 9999, seed: 1 }).available,
    [pool]
  )
  if (done)
    return (
      <Summary
        text="Speaking practice finished. Your ratings are saved on this device."
        onAgain={() => {
          setDone(false)
          setRun(null)
        }}
      />
    )
  if (run && plan && plan.exercises.length > 0)
    return (
      <ExerciseSession
        exercises={plan.exercises}
        onDone={() => setDone(true)}
        doneLabel="Finish"
      />
    )
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{SPEAKING_HONESTY}</p>
      <Scope scope={scope} setScope={setScope} />
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">How many sentences</legend>
        <div className="flex gap-2">
          {[3, 5, 10].map((c) => (
            <Button
              key={c}
              type="button"
              size="sm"
              variant={count === c ? "default" : "outline"}
              aria-pressed={count === c}
              onClick={() => setCount(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </fieldset>
      <Button
        type="button"
        disabled={available === 0}
        onClick={() => setRun({ seed: Date.now() })}
      >
        Start
      </Button>
    </div>
  )
}

function ListenPractice({ lessons }: { lessons: readonly EnglishLesson[] }) {
  const speech = useSpeech()
  const [scope, setScope] = useState("all")
  const [run, setRun] = useState<number | null>(null)
  const [result, setResult] = useState<number | null>(null)
  const sentences = useMemo(
    () =>
      lessons
        .filter((l) => scope === "all" || l.moduleId === scope)
        .flatMap((l) => l.items)
        .filter(
          (i): i is Extract<EnglishItem, { kind: "sentence" }> =>
            i.kind === "sentence"
        ),
    [lessons, scope]
  )
  const picked = useMemo(
    () =>
      run === null ? [] : shuffled(sentences, seededRandom(run)).slice(0, 5),
    [run, sentences]
  )

  if (!speech.caps.listen)
    return (
      <EmptyState
        title="Listening practice needs a voice"
        description="This browser has no English voice for listening. You can still practise by writing and by speaking."
      />
    )
  if (result !== null)
    return (
      <Summary
        text={`${result} of ${picked.length} sentences typed correctly.`}
        onAgain={() => {
          setResult(null)
          setRun(null)
        }}
      />
    )
  if (run !== null && picked.length > 0)
    return <Dictation items={picked} speech={speech} onDone={setResult} />
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        You hear a sentence and type it. Use Slow if it is too fast.
      </p>
      <Scope scope={scope} setScope={setScope} />
      <ListenControls speech={speech} text="Hello, how are you?" />
      <Button
        type="button"
        disabled={sentences.length === 0}
        onClick={() => setRun(Date.now())}
      >
        Start
      </Button>
    </div>
  )
}

export function PracticePage() {
  useTimeOnTask("practice")
  const { data: lessons, isLoading } = useAllLessons()
  if (isLoading || !lessons) return <ScreenLoader />
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Spoken English"
        title="Practice"
        description="Write, speak or listen. Writing answers are checked against the lesson sentence; speaking is rated by you."
      />
      {lessons.length === 0 ? (
        <EmptyState
          title="Nothing to practise yet"
          description="Practice uses the lessons in the course, and there are none yet."
          action={
            <Button asChild variant="outline">
              <Link to="/english/course">Go to the course</Link>
            </Button>
          }
        />
      ) : (
        <Tabs defaultValue={"write" satisfies Mode}>
          <TabsList>
            <TabsTrigger value="write">Writing</TabsTrigger>
            <TabsTrigger value="speak">Speaking</TabsTrigger>
            <TabsTrigger value="listen">Listening</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="pt-4">
            <WritePractice lessons={lessons} />
          </TabsContent>
          <TabsContent value="speak" className="pt-4">
            <SpeakPractice lessons={lessons} />
          </TabsContent>
          <TabsContent value="listen" className="pt-4">
            <ListenPractice lessons={lessons} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
