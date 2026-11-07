import { ArrowDownIcon, ArrowRightIcon } from "lucide-react"
import { Fragment } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RichText } from "@/components/shared/rich-text"
import type { Diagram } from "@/types/content"

export function DiagramView({ diagram }: { diagram: Diagram }) {
  return (
    <figure className="space-y-3">
      <figcaption className="text-xs font-medium text-muted-foreground">
        {diagram.title}
      </figcaption>
      {diagram.kind === "flow" ? (
        <ol className="flex flex-col items-stretch gap-1.5 md:flex-row md:items-stretch">
          {diagram.steps.map((step, i) => (
            <Fragment key={i}>
              <li className="flex-1 rounded-lg border border-border bg-secondary/40 p-3">
                <p className="text-xs font-semibold">
                  <span className="me-1.5 inline-flex size-4 items-center justify-center rounded-full bg-brand text-[0.625rem] text-brand-foreground tabular-nums">
                    {i + 1}
                  </span>
                  {step.label}
                </p>
                {step.detail && (
                  <p className="mt-1 text-xs/relaxed text-muted-foreground">
                    {step.detail}
                  </p>
                )}
              </li>
              {i < diagram.steps.length - 1 && (
                <li
                  aria-hidden
                  className="flex items-center justify-center text-muted-foreground"
                >
                  <ArrowRightIcon className="hidden size-4 md:block" />
                  <ArrowDownIcon className="size-4 md:hidden" />
                </li>
              )}
            </Fragment>
          ))}
        </ol>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                {diagram.headers.map((h, i) => (
                  <TableHead key={i}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {diagram.rows.map((row, r) => (
                <TableRow key={r}>
                  {row.map((cell, c) => (
                    <TableCell
                      key={c}
                      className={c === 0 ? "font-medium" : "whitespace-normal"}
                    >
                      <RichText text={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </figure>
  )
}
