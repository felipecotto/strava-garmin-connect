import type { LucideIcon } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type StatCardProps = {
  title: string
  value: string
  hint?: string
  icon: LucideIcon
  className?: string
}

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "border-border/80 shadow-none transition-colors hover:border-primary/25",
        className
      )}
    >
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-2">
          <CardDescription className="text-xs font-medium uppercase tracking-wide">
            {title}
          </CardDescription>
          <Icon className="size-4 shrink-0 text-primary" aria-hidden />
        </div>
        <CardTitle className="text-3xl font-semibold tabular-nums tracking-tight">
          {value}
        </CardTitle>
        {hint ? (
          <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
        ) : null}
      </CardHeader>
    </Card>
  )
}
