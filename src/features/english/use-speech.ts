import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  SLOW_RATE,
  browserEnv,
  capabilities,
  speak,
  type SpeechEnv,
} from "@/services/english/speech"

/** Voices load asynchronously in some browsers: read them now and again when the browser says they changed. */
export function useVoices(env: SpeechEnv): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(
    () => env.speechSynthesis?.getVoices() ?? []
  )
  useEffect(() => {
    const synth = env.speechSynthesis
    if (!synth) return
    const read = () => setVoices(synth.getVoices())
    read()
    synth.addEventListener?.("voiceschanged", read)
    return () => synth.removeEventListener?.("voiceschanged", read)
  }, [env])
  return voices
}

/** One place for the speech environment of a screen: what the browser supports, and Listen with rate and Slow. */
export function useSpeech(envOverride?: SpeechEnv) {
  const env = useMemo(() => envOverride ?? browserEnv(), [envOverride])
  const voices = useVoices(env)
  const caps = useMemo(() => capabilities(env, voices), [env, voices])
  const [rate, setRate] = useState(1)
  const [slow, setSlow] = useState(false)
  const [playing, setPlaying] = useState(false)
  const stopRef = useRef<() => void>(() => {})

  const stop = useCallback(() => {
    stopRef.current()
    setPlaying(false)
  }, [])
  const listen = useCallback(
    (text: string) => {
      if (!caps.voice) return
      stopRef.current()
      setPlaying(true)
      stopRef.current = speak(env, text, {
        voice: caps.voice.voice,
        rate: slow ? SLOW_RATE : rate,
        onEnd: () => setPlaying(false),
      })
    },
    [caps.voice, env, rate, slow]
  )
  // speech never keeps playing after the screen is left
  useEffect(() => () => stopRef.current(), [])

  return { env, caps, rate, setRate, slow, setSlow, playing, listen, stop }
}
export type SpeechController = ReturnType<typeof useSpeech>
