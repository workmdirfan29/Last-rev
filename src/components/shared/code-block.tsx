import { useState } from "react"
import { Highlight, type PrismTheme } from "prism-react-renderer"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Code surfaces stay dark in both themes, like a terminal / editor. */
const theme: PrismTheme = {
  plain: { color: "#e4e4e7", backgroundColor: "#131316" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#71717a", fontStyle: "italic" },
    },
    {
      types: ["keyword", "atrule", "selector", "important", "tag"],
      style: { color: "#22d3ee" },
    },
    {
      types: ["string", "attr-value", "template-string"],
      style: { color: "#bef264" },
    },
    {
      types: ["number", "boolean", "constant", "symbol"],
      style: { color: "#fbbf24" },
    },
    {
      types: ["function", "class-name", "builtin"],
      style: { color: "#fafafa", fontWeight: "600" },
    },
    { types: ["punctuation", "operator"], style: { color: "#a1a1aa" } },
    {
      types: ["attr-name", "property", "variable"],
      style: { color: "#c4b5fd" },
    },
  ],
}

const LANGUAGE_ALIAS: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  py: "python",
}

export function CodeBlock({
  code,
  language = "text",
  title,
}: {
  code: string
  language?: string
  title?: string
}) {
  const [copied, setCopied] = useState(false)
  const lang = LANGUAGE_ALIAS[language] ?? language

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable (insecure context) — nothing to do */
    }
  }

  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-[#131316]">
      <figcaption className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="font-mono text-[0.6875rem] text-zinc-400">
          {title ?? lang}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={copy}
          className="text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </figcaption>
      <Highlight theme={theme} code={code.trim()} language={lang}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre
            className="lr-scroll overflow-x-auto p-3 font-mono text-[0.8125rem] leading-6"
            tabIndex={0}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </figure>
  )
}
