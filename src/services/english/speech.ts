import { normalise, words } from "./normalise"

/**
 * Browser speech features, behind small adapters so every path can be tested with fakes and so the UI can say
 * honestly what the browser does. Nothing here scores pronunciation. Three separate things:
 *  - LISTEN: the browser's text-to-speech reads an English sentence (speechSynthesis).
 *  - RECORD: the learner records themselves and plays it back (MediaRecorder), in memory only.
 *  - RECOGNISE: the browser's speech-to-text (SpeechRecognition), off by default, with a privacy notice,
 *    because in several browsers (Chrome) it sends the audio to the browser maker's service.
 */

/** The browser pieces used, passed in so tests can fake them. */
export interface SpeechEnv {
  speechSynthesis?: SpeechSynthesis
  SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance
  SpeechRecognition?: new () => RecognitionLike
  MediaRecorder?: typeof MediaRecorder
  getUserMedia?: (c: MediaStreamConstraints) => Promise<MediaStream>
  isSecureContext: boolean
}

export function browserEnv(): SpeechEnv {
  const w = globalThis as unknown as Record<string, unknown> & {
    navigator?: Navigator
  }
  return {
    speechSynthesis:
      (w.speechSynthesis as SpeechSynthesis | undefined) ?? undefined,
    SpeechSynthesisUtterance: w.SpeechSynthesisUtterance as
      typeof SpeechSynthesisUtterance | undefined,
    SpeechRecognition: (w.SpeechRecognition ?? w.webkitSpeechRecognition) as
      (new () => RecognitionLike) | undefined,
    MediaRecorder: w.MediaRecorder as typeof MediaRecorder | undefined,
    getUserMedia: w.navigator?.mediaDevices?.getUserMedia?.bind(
      w.navigator.mediaDevices
    ),
    isSecureContext: Boolean(w.isSecureContext),
  }
}

export interface VoiceLike {
  name: string
  lang: string
  localService: boolean
}

export interface VoicePick<V extends VoiceLike = SpeechSynthesisVoice> {
  voice: V
  /** The voice is provided by the browser's online service: the sentence text is sent to it. */
  remote: boolean
}

/** Rank for an English voice: Indian English first, then British, then American; a device voice before an online one. */
function rank(v: VoiceLike): number {
  const lang = v.lang.replace("_", "-").toLowerCase()
  if (!lang.startsWith("en")) return Number.POSITIVE_INFINITY
  const region =
    lang === "en-in" ? 0 : lang === "en-gb" ? 1 : lang === "en-us" ? 2 : 3
  return region * 2 + (v.localService ? 0 : 1)
}

/** The best English voice available, or null when there is none (the Listen control is then hidden). */
export function pickVoice<V extends VoiceLike>(
  voices: readonly V[]
): VoicePick<V> | null {
  const english = voices.filter((v) => Number.isFinite(rank(v)))
  if (english.length === 0) return null
  const voice = [...english].sort((a, b) => rank(a) - rank(b))[0]
  return { voice, remote: !voice.localService }
}

export interface Capabilities {
  listen: boolean
  /** The voice that will be used, and whether it is an online one. */
  voice: VoicePick | null
  record: boolean
  recognise: boolean
  secure: boolean
}

/** What this browser offers. "Present" is only a first check: recognition and recording can still fail on use. */
export function capabilities(
  env: SpeechEnv,
  voices: readonly SpeechSynthesisVoice[]
): Capabilities {
  const voice = pickVoice(voices)
  return {
    listen:
      Boolean(env.speechSynthesis && env.SpeechSynthesisUtterance) &&
      voice !== null,
    voice,
    record:
      Boolean(env.MediaRecorder && env.getUserMedia) && env.isSecureContext,
    recognise: Boolean(env.SpeechRecognition),
    secure: env.isSecureContext,
  }
}

export const RATE_MIN = 0.5
export const RATE_MAX = 1.2
export const SLOW_RATE = 0.6

/** Speak one English sentence. Hindi is never spoken. Returns a function that stops it. */
export function speak(
  env: SpeechEnv,
  text: string,
  opts: { voice: SpeechSynthesisVoice; rate: number; onEnd?: () => void }
): () => void {
  const synth = env.speechSynthesis
  const Utterance = env.SpeechSynthesisUtterance
  if (!synth || !Utterance) return () => {}
  synth.cancel()
  const u = new Utterance(text)
  u.voice = opts.voice
  u.lang = opts.voice.lang
  u.rate = Math.min(RATE_MAX, Math.max(RATE_MIN, opts.rate))
  u.onend = () => opts.onEnd?.()
  u.onerror = () => opts.onEnd?.()
  synth.speak(u)
  return () => synth.cancel()
}

/* ------------------------------- recording ------------------------------- */

export interface RecordingError {
  code: "unavailable" | "denied" | "failed"
}
export interface Recorder {
  /** Stop and return the recording (kept in memory only). */
  stop: () => Promise<Blob>
  /** Stop and throw everything away. */
  cancel: () => void
}

/**
 * Ask for the microphone and start recording. Call it only from a click. The audio stays in memory: the caller
 * makes an object URL to play it back and revokes it on leave. Nothing is saved or sent.
 */
export async function startRecording(env: SpeechEnv): Promise<Recorder> {
  if (!env.MediaRecorder || !env.getUserMedia || !env.isSecureContext)
    throw Object.assign(new Error("recording unavailable"), {
      code: "unavailable",
    } satisfies RecordingError)
  let stream: MediaStream
  try {
    stream = await env.getUserMedia({ audio: true })
  } catch (e) {
    const denied =
      (e as { name?: string })?.name === "NotAllowedError" ||
      (e as { name?: string })?.name === "SecurityError"
    throw Object.assign(new Error("microphone"), {
      code: denied ? "denied" : "failed",
    } satisfies RecordingError)
  }
  const chunks: Blob[] = []
  const rec = new env.MediaRecorder(stream)
  rec.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data)
  const release = () => stream.getTracks().forEach((t) => t.stop())
  rec.start()
  return {
    stop: () =>
      new Promise<Blob>((resolve) => {
        rec.onstop = () => {
          release()
          resolve(new Blob(chunks, { type: rec.mimeType || "audio/webm" }))
        }
        if (rec.state !== "inactive") rec.stop()
        else {
          release()
          resolve(new Blob(chunks))
        }
      }),
    cancel: () => {
      rec.ondataavailable = null
      rec.onstop = null
      if (rec.state !== "inactive") rec.stop()
      release()
    },
  }
}

/* ------------------------------ recognition ------------------------------ */

export interface RecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  onresult:
    | ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void)
    | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

export type RecogniseErrorCode =
  | "unsupported"
  | "blocked"
  | "no-speech"
  | "network"
  | "no-microphone"
  | "failed"

/** Plain words for every way recognition can fail. The text alternative is always offered after any of them. */
export const RECOGNISE_ERROR_MESSAGE: Record<RecogniseErrorCode, string> = {
  unsupported: "Speech recognition is not available in this browser.",
  blocked:
    "The microphone or speech recognition is blocked. Allow it in your browser settings, or use the text exercises.",
  "no-speech":
    "Nothing was heard. Try again and speak after you press the button.",
  network: "The browser's speech recognition service could not be reached.",
  "no-microphone": "No microphone was found.",
  failed:
    "Speech recognition did not work here. You can use the text exercises instead.",
}

export function recogniseErrorFor(browserCode: string): RecogniseErrorCode {
  switch (browserCode) {
    case "not-allowed":
    case "service-not-allowed":
      return "blocked"
    case "no-speech":
      return "no-speech"
    case "network":
      return "network"
    case "audio-capture":
      return "no-microphone"
    case "aborted":
      return "failed"
    default:
      return "failed"
  }
}

export interface RecogniseHandlers {
  onTranscript: (text: string) => void
  onError: (code: RecogniseErrorCode) => void
  onEnd: () => void
}

/**
 * Start one recognition. Support is checked, and the start itself is guarded: a browser that exposes
 * SpeechRecognition but cannot use it reports an error here instead of throwing at the learner.
 * Returns a function that stops it, or null when recognition is not available.
 */
export function recognise(
  env: SpeechEnv,
  handlers: RecogniseHandlers
): (() => void) | null {
  const Ctor = env.SpeechRecognition
  if (!Ctor) {
    handlers.onError("unsupported")
    return null
  }
  try {
    const r = new Ctor()
    r.lang = "en-IN"
    r.interimResults = false
    r.maxAlternatives = 1
    r.continuous = false
    r.onresult = (e) => {
      const text = Array.from(e.results)
        .map((alt) => alt[0]?.transcript ?? "")
        .join(" ")
        .trim()
      handlers.onTranscript(text)
    }
    r.onerror = (e) => handlers.onError(recogniseErrorFor(e.error))
    r.onend = () => handlers.onEnd()
    r.start()
    return () => {
      try {
        r.stop()
      } catch {
        /* already stopped */
      }
    }
  } catch {
    handlers.onError("failed")
    return null
  }
}

export interface WordMatch {
  words: { word: string; found: boolean }[]
  found: number
  total: number
}

/**
 * Which words of the target sentence the transcript contains, in order. It compares text with text: it says
 * nothing about how the words sounded, and it is never a pronunciation score.
 */
export function wordMatch(target: string, transcript: string): WordMatch {
  const t = words(target)
  const s = words(transcript)
  const dp: number[][] = Array.from({ length: t.length + 1 }, () =>
    Array(s.length + 1).fill(0)
  )
  for (let i = t.length - 1; i >= 0; i--)
    for (let j = s.length - 1; j >= 0; j--)
      dp[i][j] =
        t[i] === s[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
  const found = new Set<number>()
  let i = 0
  let j = 0
  while (i < t.length && j < s.length) {
    if (t[i] === s[j]) {
      found.add(i)
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++
    else j++
  }
  const list = t.map((word, k) => ({ word, found: found.has(k) }))
  return { words: list, found: found.size, total: t.length }
}

export const WORD_MATCH_LABEL =
  "Word match from your browser's speech-to-text. It is not a pronunciation score."
export const SPEECH_NOTICE =
  "In some browsers, speech recognition sends your voice to the browser maker's service. LastRev itself never uploads anything."
export const ONLINE_VOICE_NOTE =
  "This voice comes from your browser's online service, so the text of the lesson sentence is sent to it. LastRev uploads nothing itself."
export const AUDIO_SOURCE_NOTE =
  "Audio comes from the voices installed on your device or provided by your browser."
export const NO_LISTEN_MESSAGE =
  "Listening audio is not available in this browser"

export { normalise }
