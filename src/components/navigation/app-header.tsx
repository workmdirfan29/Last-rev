import { useMatches } from "react-router"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { CommandPaletteTrigger } from "./command-palette"
import { ThemeToggle } from "./theme-toggle"

interface RouteHandle {
  title?: string
}

export function AppHeader() {
  const matches = useMatches()
  const title = [...matches]
    .reverse()
    .find((m) => (m.handle as RouteHandle | undefined)?.title)?.handle as
    RouteHandle | undefined

  return (
    <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur">
      <SidebarTrigger aria-label="Toggle sidebar" />
      <Separator
        orientation="vertical"
        className="mx-1 data-vertical:h-4 data-vertical:self-center"
      />
      <p className="min-w-0 flex-1 truncate text-sm font-medium">
        {title?.title}
      </p>
      <CommandPaletteTrigger />
      <ThemeToggle />
    </header>
  )
}
