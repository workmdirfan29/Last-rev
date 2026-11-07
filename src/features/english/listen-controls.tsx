import { useId } from "react"
import { SquareIcon, Volume2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  AUDIO_SOURCE_NOTE,
  NO_LISTEN_MESSAGE,
  ONLINE_VOICE_NOTE,
  RATE_MAX,
  RATE_MIN,
} from "@/services/english/speech"
import type { SpeechController } from "./use-speech"

/**
 * Listen to an English sentence with the browser's voice. Shown only when the browser has speech and an
 * English voice; otherwise it says so. It always says where the audio comes from, and when the voice is an
 * online one, that the sentence text is sent to it. There is no pronunciation scoring anywhere.
 */
export function ListenControls({
  speech,
  text,
}: {
  speech: SpeechController
  text: string
}) {
  const { caps } = speech
  const slowId = useId()
  if (!caps.listen)
    return (
      <p className="text-xs text-muted-foreground" data-testid="no-listen">
        {NO_LISTEN_MESSAGE}.
      </p>
    )
  return (
    <div className="space-y-1.5" data-testid="listen-controls">
      <div className="flex flex-wrap items-center gap-3">
        {speech.playing ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={speech.stop}
          >
            <SquareIcon /> Stop
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => speech.listen(text)}
          >
            <Volume2Icon /> Listen
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Switch
            id={slowId}
            checked={speech.slow}
            onCheckedChange={speech.setSlow}
          />
          <Label htmlFor={slowId} className="text-xs font-normal">
            Slow
          </Label>
        </div>
        <label className="flex items-center gap-2 text-xs">
          Speed
          <input
            type="range"
            min={RATE_MIN}
            max={RATE_MAX}
            step={0.1}
            value={speech.rate}
            disabled={speech.slow}
            onChange={(e) => speech.setRate(Number(e.target.value))}
            aria-label="Speaking speed"
            className="w-24"
          />
        </label>
      </div>
      <p className="text-xs text-muted-foreground">
        {AUDIO_SOURCE_NOTE}
        {caps.voice?.remote && (
          <>
            {" "}
            <span data-testid="online-voice-note">{ONLINE_VOICE_NOTE}</span>
          </>
        )}
      </p>
    </div>
  )
}
