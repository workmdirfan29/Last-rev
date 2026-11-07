import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ScheduledBlock } from "@/services/planner/schedule"

/** Move one block to another day. The block stays there; the rest of the plan packs around it. */
export function MoveBlockDialog({
  block,
  today,
  onMove,
  onClearMove,
  onClose,
}: {
  block: ScheduledBlock | null
  today: string
  onMove: (blockId: string, date: string) => void
  onClearMove: (blockId: string) => void
  onClose: () => void
}) {
  return (
    <Dialog open={block !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        {block && (
          <Form
            key={block.id}
            block={block}
            today={today}
            onMove={onMove}
            onClearMove={onClearMove}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function Form({
  block,
  today,
  onMove,
  onClearMove,
  onClose,
}: {
  block: ScheduledBlock
  today: string
  onMove: (id: string, date: string) => void
  onClearMove: (id: string) => void
  onClose: () => void
}) {
  const [date, setDate] = useState(block.date)
  const title = block.part
    ? `${block.moduleTitle}: ${block.topic} (part ${block.part.index} of ${block.part.of})`
    : `${block.moduleTitle}: ${block.topic}`
  const invalid = date < today || date === ""
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (invalid) return
        onMove(block.id, date)
        onClose()
      }}
      className="space-y-4"
    >
      <DialogHeader>
        <DialogTitle>Move this block</DialogTitle>
        <DialogDescription>
          {title}, {block.minutes} min. It stays on the day you choose; the rest
          of your plan fits around it.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-1.5">
        <Label htmlFor="move-date">Move to</Label>
        <Input
          id="move-date"
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-invalid={invalid}
          aria-describedby={invalid ? "move-date-error" : undefined}
        />
        {invalid && (
          <p
            id="move-date-error"
            role="alert"
            className="text-xs text-destructive"
          >
            Choose today or a later day.
          </p>
        )}
      </div>
      <DialogFooter className="gap-2 sm:justify-between">
        {block.moved ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onClearMove(block.id)
              onClose()
            }}
          >
            Put back in order
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={invalid}>
            Move block
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}
