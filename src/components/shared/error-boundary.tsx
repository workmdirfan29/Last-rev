import { Component, type ErrorInfo, type ReactNode } from "react"
import { isPrivatePath } from "@/utils/private-routes"

interface Props {
  children: ReactNode
  fallback: ReactNode
  /** Changing this value clears a caught error (e.g. pass the pathname). */
  resetKey?: string
}

/** Error boundaries must be classes — React has no hook equivalent yet. */
export class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // On pages that show the learner's resume, nothing about the error is logged: it could carry their text.
    if (isPrivatePath(window.location.pathname)) return
    console.error("LastRev render error:", error, info.componentStack)
  }

  componentDidUpdate(prev: Props) {
    if (this.state.hasError && prev.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
