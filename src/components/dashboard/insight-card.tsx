import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type InsightTone = "positive" | "neutral" | "tip"

export type InsightCardProps = {
  title: string
  body: string
  tone?: InsightTone
  className?: string
}

const toneLabel: Record<InsightTone, string> = {
  positive: "Sinal positivo",
  neutral: "Atenção",
  tip: "Sugestão",
}

export function InsightCard({
  title,
  body,
  tone = "neutral",
  className,
}: InsightCardProps) {
  return (
    <Card
      className={cn(
        "border-border/80 shadow-none transition-colors hover:border-primary/20",
        className
      )}
    >
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{toneLabel[tone]}</Badge>
        </div>
        <CardTitle className="text-lg leading-snug">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed text-muted-foreground">
          {body}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
