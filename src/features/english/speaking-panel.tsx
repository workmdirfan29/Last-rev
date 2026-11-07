import { useEffect, useRef, useState } from "react"
import { MicIcon, SquareIcon } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  RECOGNISE_ERROR_MESSAGE,
  SPEECH_NOTICE,
  WORD_MATCH_LABEL,
  recognise,
  startRecording,
  wordMatch,
  type Recorder,
  type RecogniseErrorCode,
  type WordMatch,
} from "@/services/english/speech"
import { useLearnerStore } from "@/stores/learner-store"
import { Hi, En } from "./lang"
import { ListenControls } from "./listen-controls"
import { useEnglishActions } from "./use-english"
import { useSpeech } from "./use-speech"

const ANCHORS = [
  "I could not say it",
  "I said a few words",
  "I said it with some stops",
  "I said it well",
  "I said it clearly and smoothly",
]

/** Recognition is opt-in for each visit: a reload turns it off again (kept in memory only). */
let recognitionConsentThisSession = false
export const resetSpeechConsentForTests = () => {
  recognitionConsentThisSession = false
}

/**
 * Say a sentence aloud and rate yourself 1 to 5. Optional extras: record yourself and play it back (in memory
 * only), and try the browser's speech recognition (opt-in, with a privacy notice). The rating is yours: the
 * app never judges how you sounded.
 */
export function SpeakingPanel({
  target,
  hi,
  itemId,
  day = null,
}: {
  target: string
  hi: string
  itemId: string
  day?: number | null
}) {
  const speech = useSpeech()
  const { caps, env } = speech
  const { rateSpeaking, noticeSeen } = useEnglishActions()
  const seen = useLearnerStore((s) => s.english?.speechNoticeSeen ?? false)

  // recording
  const recorder = useRef<Recorder | null>(null)
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordMessage, setRecordMessage] = useState<string | null>(null)
  const [rated, setRated] = useState<number | null>(null)

  // recognition
  const [recOn, setRecOn] = useState(recognitionConsentThisSession)
  const [askNotice, setAskNotice] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [match, setMatch] = useState<WordMatch | null>(null)
  const [error, setError] = useState<RecogniseErrorCode | null>(null)
  const stopRecognition = useRef<(() => void) | null>(null)

  // Leaving the screen discards the recording, releases the microphone and stops any recognition.
  useEffect(
    () => () => {
      recorder.current?.cancel()
      stopRecognition.current?.()
    },
    []
  )
  useEffect(
    () => () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    },
    [audioUrl]
  )

  async function startRec() {
    setRecordMessage(null)
    try {
      recorder.current = await startRecording(env)
      setRecording(true)
    } catch (e) {
      const code = (e as { code?: string }).code
      setRecordMessage(
        code === "denied"
          ? "The microphone is blocked. Allow it in your browser settings, or just say the sentence aloud and rate yourself."
          : "Recording is not working here. Say the sentence aloud and rate yourself."
      )
    }
  }
  async function stopRec() {
    const blob = await recorder.current?.stop()
    recorder.current = null
    setRecording(false)
    if (blob) setAudioUrl(URL.createObjectURL(blob))
  }

  function startRecognition() {
    setError(null)
    setTranscript(null)
    setMatch(null)
    setListening(true)
    stopRecognition.current = recognise(env, {
      onTranscript: (text) => {
        setTranscript(text)
        setMatch(wordMatch(target, text))
      },
      onError: (code) => {
        setError(code)
        setListening(false)
      },
      onEnd: () => setListening(false),
    })
    if (!stopRecognition.current) setListening(false)
  }
  function turnOn(on: boolean) {
    if (!on) {
      recognitionConsentThisSession = false
      setRecOn(false)
      return
    }
    if (!seen) setAskNotice(true)
    else {
      recognitionConsentThisSession = true
      setRecOn(true)
    }
  }

  return (
    <section
      aria-label="Speaking practice"
      className="space-y-4 rounded-xl border border-border bg-card p-4"
    >
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Say this aloud</p>
        <En as="p" className="text-lg font-medium">
          {target}
        </En>
        <Hi as="p" className="text-sm text-muted-foreground">
          {hi}
        </Hi>
      </div>
      <ListenControls speech={speech} text={target} />

      <div className="space-y-2">
        {caps.record ? (
          <>
            <p className="text-xs text-muted-foreground">
              Your recording stays in this tab's memory. It is played back to
              you and discarded when you leave. It is never saved or sent.
            </p>
            {recording ? (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => void stopRec()}
              >
                <SquareIcon /> Stop recording
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void startRec()}
              >
                <MicIcon /> Record yourself
              </Button>
            )}
            {audioUrl && (
              <audio
                controls
                src={audioUrl}
                aria-label="Your recording"
                className="w-full max-w-sm"
              />
            )}
            {recordMessage && (
              <p role="status" className="text-xs">
                {recordMessage}
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-muted-foreground" data-testid="no-record">
            Recording is not available here. Say the sentence aloud, then rate
            yourself.
          </p>
        )}
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          How did it go? Rate yourself
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Button
              key={n}
              type="button"
              size="lg"
              variant={rated === n ? "default" : "outline"}
              aria-pressed={rated === n}
              aria-label={`${n} of 5: ${ANCHORS[n - 1]}`}
              onClick={() => {
                setRated(n)
                void rateSpeaking(itemId, n, day).then(() =>
                  toast(`Saved: ${n} of 5`)
                )
              }}
              className="min-w-9 tabular-nums"
            >
              {n}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          1: {ANCHORS[0]} · 3: {ANCHORS[2]} · 5: {ANCHORS[4]}
        </p>
      </fieldset>

      <div
        className={cn(
          "space-y-2 rounded-lg border border-dashed border-border p-3"
        )}
      >
        <div className="flex items-center gap-2">
          <Switch
            id={`rec-${itemId}`}
            checked={recOn}
            onCheckedChange={turnOn}
            disabled={!caps.recognise}
          />
          <Label htmlFor={`rec-${itemId}`} className="font-normal">
            Try speech recognition (off by default)
          </Label>
        </div>
        {!caps.recognise ? (
          <p
            className="text-xs text-muted-foreground"
            data-testid="no-recognition"
          >
            {RECOGNISE_ERROR_MESSAGE.unsupported} Use the speaking rating above,
            or the text exercises.
          </p>
        ) : recOn ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{SPEECH_NOTICE}</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={listening}
              onClick={startRecognition}
            >
              <MicIcon /> {listening ? "Listening..." : "Start listening"}
            </Button>
            {error && (
              <p role="alert" className="text-sm" data-testid="recognise-error">
                {RECOGNISE_ERROR_MESSAGE[error]} You can use the text exercises
                instead.
              </p>
            )}
            {transcript !== null && match && (
              <div role="status" className="space-y-1" data-testid="word-match">
                <p className="text-sm">
                  Heard: <En>{transcript || "(nothing)"}</En>
                </p>
                <p
                  className="flex flex-wrap gap-1.5"
                  aria-label="Words of the sentence found in what was heard"
                >
                  {match.words.map((w, i) => (
                    <span
                      key={i}
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-sm",
                        w.found
                          ? "border-success/50"
                          : "border-warning/60 line-through"
                      )}
                    >
                      {w.found ? "✓ " : "✗ "}
                      <En>{w.word}</En>
                    </span>
                  ))}
                </p>
                <p className="text-sm">
                  {match.found} of {match.total} words found in order.
                </p>
                <p className="text-xs text-muted-foreground">
                  {WORD_MATCH_LABEL}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Turn it on to see a word match of what the browser heard. It may
            send your voice to the browser maker's service.
          </p>
        )}
      </div>

      <AlertDialog open={askNotice} onOpenChange={setAskNotice}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Before you use speech recognition
            </AlertDialogTitle>
            <AlertDialogDescription>
              {SPEECH_NOTICE} You can switch it off again at any time, and it
              turns off when you reload the page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void noticeSeen()
                recognitionConsentThisSession = true
                setRecOn(true)
              }}
            >
              I understand, turn it on
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
