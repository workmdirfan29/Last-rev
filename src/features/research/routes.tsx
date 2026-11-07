import { HowWeDecidePage } from "./how-we-decide-page"
import { ResearchPage } from "./research-page"

/** `/research` and `/how-we-decide`: static pages open to every journey. */
export function Component() {
  return <ResearchPage />
}
export function HowWeDecideComponent() {
  return <HowWeDecidePage />
}
