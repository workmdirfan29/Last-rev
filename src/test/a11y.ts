import axe from "axe-core"

/**
 * Runs axe-core on the rendered page and returns a readable list of violations. jsdom cannot compute layout or
 * colour, so those rules are off here; the real-browser pass (dark and light, 1280 and 390) covers contrast.
 */
export async function a11yViolations(
  root: Element = document.body
): Promise<string[]> {
  const result = await axe.run(root, {
    rules: {
      "color-contrast": { enabled: false },
      "scrollable-region-focusable": { enabled: false },
    },
    resultTypes: ["violations"],
  })
  return result.violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes[0].target.join(" ")} - ${v.help}`
  )
}
