import "fake-indexeddb/auto"
import "@testing-library/jest-dom/vitest"
import { cleanup, configure } from "@testing-library/react"
import { afterEach } from "vitest"

// Route-level tests load lazily split chunks, which can take well over the 1 s default under a busy
// machine; a query that waits for the page should not fail because the CPU was busy.
configure({ asyncUtilTimeout: 10000 })

afterEach(() => {
  cleanup()
})

// Tests marked `@vitest-environment node` (PDF reading) have no window: the browser stubs are skipped there.
if (typeof window !== "undefined") {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList
  }

  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver ??=
    ResizeObserverStub as unknown as typeof ResizeObserver

  Element.prototype.scrollIntoView ??= () => {}

  // jsdom lacks pointer capture, which Radix Select and sonner call.
  Element.prototype.hasPointerCapture ??= () => false
  Element.prototype.setPointerCapture ??= () => {}
  Element.prototype.releasePointerCapture ??= () => {}
}
