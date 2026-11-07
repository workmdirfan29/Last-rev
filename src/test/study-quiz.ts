import { screen } from "@testing-library/react"
import type userEvent from "@testing-library/user-event"
import type { CheckItem } from "@/types/lesson"

/** Answer the knowledge-check item on screen through the UI, right or wrong, and press Check. */
/** The text a learner sees for an option: inline code and bold markers are not shown. */
const shown = (s: string) => s.replace(/[`*]/g, "")

export async function answerItem(
  user: ReturnType<typeof userEvent.setup>,
  item: CheckItem,
  right: boolean
) {
  switch (item.type) {
    case "single":
    case "output": {
      const pick = right
        ? item.answer
        : item.options.findIndex((_, i) => i !== item.answer)
      await user.click(
        screen
          .getAllByRole("radio")
          .find((r) =>
            r.closest("label")?.textContent?.includes(shown(item.options[pick]))
          )!
      )
      break
    }
    case "truefalse":
      await user.click(
        screen.getByRole("radio", {
          name: (right ? item.answer : !item.answer) ? "True" : "False",
        })
      )
      break
    case "multi":
      for (const a of item.answers)
        await user.click(
          screen
            .getAllByRole("checkbox")
            .find((c) =>
              c.closest("label")?.textContent?.includes(shown(item.options[a]))
            )!
        )
      break
    case "blank":
      await user.type(
        screen.getByLabelText("Your answer"),
        right ? item.answer : "zzz"
      )
  }
  await user.click(screen.getByRole("button", { name: "Check" }))
}

/**
 * The item the quiz is showing now, found by the key the form carries (`check.<module>.<lesson>.<item id>`).
 * `lessons` are the loaded lessons whose items may be shown.
 */
export function itemOnScreen(
  lessons: readonly { moduleId: string; slug: string; check: CheckItem[] }[]
): CheckItem {
  const key = document
    .querySelector("form[data-item-key]")!
    .getAttribute("data-item-key")!
  for (const l of lessons)
    for (const c of l.check)
      if (key === `check.${l.moduleId}.${l.slug}.${c.id}`) return c
  throw new Error(`no item for ${key}`)
}
