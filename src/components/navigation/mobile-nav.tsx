import { Link, useLocation } from "react-router"
import { isNavActive, navItemsFor, SWITCH_MODE_ITEM } from "@/app/nav"
import { useActiveMode } from "@/app/use-active-mode"
import { cn } from "@/lib/utils"

/** Phone-first tab bar. The full sidebar remains reachable from the header. */
export function MobileNav() {
  const { pathname } = useLocation()
  const mode = useActiveMode()
  const items = [...navItemsFor(mode).filter((i) => i.mobile), SWITCH_MODE_ITEM]

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg auto-cols-fr grid-flow-col">
        {items.map((item) => {
          const active = isNavActive(item, pathname, true)
          return (
            <li key={item.id}>
              <Link
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-0.5 text-[0.6875rem] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="size-[18px]" aria-hidden />
                <span className="max-w-full truncate px-1">
                  {(item.mobileTitle ?? item.title)
                    .replace(" Zone", "")
                    .replace("Switch mode", "Switch")}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
