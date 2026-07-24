import { cn } from "@/lib/utils"

export function ProfileStatCell({
  label,
  value,
  hint,
  className,
}: {
  label: string
  value: string
  hint?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-3 border border-border/80 px-4 py-5 sm:px-5",
        className
      )}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="font-mono text-3xl font-medium tracking-tight tabular-nums sm:text-4xl">
        {value}
      </p>
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
