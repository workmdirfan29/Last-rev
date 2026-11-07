import {
  AtomIcon,
  BlocksIcon,
  CoffeeIcon,
  LayersIcon,
  LineChartIcon,
  MonitorIcon,
  SparklesIcon,
  TerminalIcon,
  type LucideIcon,
} from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  Atom: AtomIcon,
  Blocks: BlocksIcon,
  Coffee: CoffeeIcon,
  Layers: LayersIcon,
  ChartLine: LineChartIcon,
  Monitor: MonitorIcon,
  Sparkles: SparklesIcon,
  Terminal: TerminalIcon,
}

export function RoleIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = ICONS[name] ?? BlocksIcon
  return <Icon className={className} aria-hidden />
}
