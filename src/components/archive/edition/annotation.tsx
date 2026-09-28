import { cn } from "@/lib/utils"

/**
 * Nota à mão, como a de um treinador na planilha. No máximo quatro por página.
 * A seta aponta para a direita/baixo; gire o conjunto para apontar para outro lado.
 */
export function Annotation({
  children,
  className,
  arrow = true,
}: {
  children: string
  className?: string
  arrow?: boolean
}) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none inline-flex -rotate-3 items-start gap-1 text-signal select-none", className)}
    >
      <span className="type-note whitespace-nowrap">{children}</span>
      {arrow ? (
        <svg width="44" height="32" viewBox="0 0 56 40" fill="none" className="mt-2 shrink-0">
          <path d="M2 6C18 4 38 10 50 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M42 30l8 3 1-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  )
}
