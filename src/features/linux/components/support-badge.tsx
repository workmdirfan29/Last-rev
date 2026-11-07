import { Badge } from "@/components/ui/badge"
import { exampleSupport, SUPPORT_LABEL, type Support } from "../engine/support"

const VARIANT: Record<Support, "secondary" | "outline"> = {
  simulated: "secondary",
  sample: "outline",
  "not-simulated": "outline",
}

/** Says plainly whether the practice terminal can run this example. */
export function SupportBadge({ example }: { example: string }) {
  const support = exampleSupport(example)
  return <Badge variant={VARIANT[support]}>{SUPPORT_LABEL[support]}</Badge>
}
