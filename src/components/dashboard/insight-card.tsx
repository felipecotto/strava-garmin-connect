import type { DashboardInsight } from "@/lib/strava/aggregate"
import { cn } from "@/lib/utils"

export function InsightCard({
  title,
  body,
  tone,
  className,
}: {
  title: string
  body: string
  tone?: DashboardInsight["tone"]
  className?: string
}) {
  return (
    <div
      className={cn(
        "surface-soft rounded-[24px] px-4 py-4",
        className
      )}
    >
      <p className="font-heading text-sm font-semibold text-[var(--ink)]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        {body}
      </p>
      {tone ? (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--label)]">
          {tone}
        </p>
      ) : null}
    </div>
  )
}
