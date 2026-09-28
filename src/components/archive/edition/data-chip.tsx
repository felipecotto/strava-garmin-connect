import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Etiqueta de dado sobre fotografia: quadrado em tinta com ícone + um único dado. */
export function DataChip({
  icon: Icon,
  value,
  label,
  className,
}: {
  icon: LucideIcon
  value: string
  /** Descrição para leitores de tela ("Total corrido"). */
  label: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-10 items-center gap-3 bg-white py-1 pr-4 pl-1 text-foreground shadow-[0_1px_0_rgb(0_0_0/0.08)]",
        className
      )}
    >
      <span className="grid size-8 place-items-center bg-ink text-paper" aria-hidden>
        <Icon className="size-[18px]" strokeWidth={2} />
      </span>
      <span className="text-base font-semibold tabular-nums">
        <span className="sr-only">{label}: </span>
        {value}
      </span>
    </span>
  )
}
