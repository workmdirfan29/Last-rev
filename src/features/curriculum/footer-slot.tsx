import { createContext, useContext } from "react"

/**
 * An element in a page's bottom action bar where the curriculum summary can
 * render, so the summary and the Back / Start buttons are one bar. When there
 * is none (Settings), the summary floats on its own.
 */
export const FooterSlotContext = createContext<HTMLElement | null>(null)
export const useFooterSlot = () => useContext(FooterSlotContext)
