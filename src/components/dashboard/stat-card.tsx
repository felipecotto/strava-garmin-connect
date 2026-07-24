import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type StatCardProps = {
  title: string
  value: string
  hint?: string
  icon?: LucideIcon
  className?: string
}

export function StatCard({ title, value, hint, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "surface-soft grain-surface rounded-[24px] px-4 py-5",
        className
      )}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--label)]">
        {title}
      </p>
      <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--ink)] tabular-nums">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs text-[var(--ink-soft)]">{hint}</p>
      ) : null}
    </div>
  )
}
