import { MapPin, Medal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// ─── race config ──────────────────────────────────────────────────────────────

const RACE = {
  name: "Maratona do Rio",
  location: "Rio de Janeiro, RJ",
  date: new Date("2026-06-07T00:00:00"),
  dateLabel: "07 de junho de 2026",
} as const

// ─── training phases ──────────────────────────────────────────────────────────

type Phase = {
  label: string
  description: string
  tone: "base" | "build" | "taper" | "race" | "done"
}

function getPhase(daysLeft: number): Phase {
  if (daysLeft > 56)
    return {
      label: "Fase de Base",
      description: "Construa o volume aeróbio e a consistência. Sem pressa.",
      tone: "base",
    }
  if (daysLeft > 35)
    return {
      label: "Fase de Construção",
      description:
        "Volume alto com primeiros estímulos de intensidade. Foco no longo semanal.",
      tone: "build",
    }
  if (daysLeft > 21)
    return {
      label: "Início do Tapering",
      description:
        "Reduza o volume gradualmente. Mantenha os estímulos de qualidade.",
      tone: "taper",
    }
  if (daysLeft > 0)
    return {
      label: "Tapering Final",
      description:
        "Pernas frescas, confiança alta. Durma bem e hidrate-se.",
      tone: "taper",
    }
  if (daysLeft === 0)
    return {
      label: "Dia da Prova",
      description: "É hoje! Confie no seu treino.",
      tone: "race",
    }
  return {
    label: "Prova Realizada",
    description: "Parabéns pelo desempenho na prova!",
    tone: "done",
  }
}

const TONE_BADGE: Record<Phase["tone"], string> = {
  base: "bg-sky-50 text-sky-700 border border-sky-200",
  build: "bg-amber-50 text-amber-700 border border-amber-200",
  taper: "bg-violet-50 text-violet-700 border border-violet-200",
  race: "bg-primary/10 text-primary border border-primary/20",
  done: "bg-emerald-50 text-emerald-700 border border-emerald-200",
}

// ─── component ───────────────────────────────────────────────────────────────

export function GoalTracker({ className }: { className?: string }) {
  const now = new Date()
  const msLeft = RACE.date.getTime() - now.getTime()
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
  const phase = getPhase(daysLeft)

  return (
    <Card
      className={cn(
        "flex flex-col border-l-[3px] border-l-sky-500 bg-white shadow-none",
        "border-r-border/80 border-t-border/80 border-b-border/80",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Medal className="size-4 shrink-0 text-sky-500" aria-hidden />
            <span className="text-sm font-semibold">Objetivo Principal</span>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold",
              TONE_BADGE[phase.tone]
            )}
          >
            {phase.label}
          </span>
        </div>

        {/* Race info */}
        <div>
          <p className="text-base font-semibold tracking-tight">{RACE.name}</p>
          <div className="mt-0.5 flex items-center gap-1">
            <MapPin className="size-3 text-muted-foreground" aria-hidden />
            <p className="text-xs text-muted-foreground">{RACE.location}</p>
          </div>
        </div>

        {/* Countdown — central hero */}
        <div className="flex flex-1 items-center justify-center py-3">
          {daysLeft > 0 ? (
            <div className="text-center">
              <p className="font-mono text-[3.25rem] font-bold leading-none tracking-tight text-sky-600 tabular-nums">
                {daysLeft}
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                dias restantes
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {RACE.dateLabel}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-primary">
                Boa prova!
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {RACE.dateLabel}
              </p>
            </div>
          )}
        </div>

        {/* Phase description */}
        <div className="rounded-lg bg-sky-50/70 px-3 py-2.5">
          <p className="text-[11px] leading-relaxed text-sky-700">
            {phase.description}
          </p>
        </div>
      </div>
    </Card>
  )
}
