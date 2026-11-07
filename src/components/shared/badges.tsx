import { Badge } from "@/components/ui/badge"
import {
  LEVEL_META,
  type Difficulty,
  type ExperienceLevel,
} from "@/types/content"
import { cn } from "@/lib/utils"

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  easy: "bg-success/15 text-foreground",
  medium: "bg-warning/15 text-foreground",
  hard: "bg-destructive/15 text-foreground",
}

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty
  className?: string
}) {
  return (
    <Badge
      variant="ghost"
      className={cn("capitalize", DIFFICULTY_STYLE[difficulty], className)}
    >
      {difficulty}
    </Badge>
  )
}

export function LevelBadge({
  level,
  className,
}: {
  level: ExperienceLevel
  className?: string
}) {
  return (
    <Badge variant="outline" className={className}>
      {LEVEL_META[level].label}
    </Badge>
  )
}
