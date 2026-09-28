"use client"

import { ArrowRight } from "lucide-react"
import { useActionState } from "react"

import { joinWaitlist, leaveWaitlist, type WaitlistState } from "@/app/actions/beta"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { siteConfig } from "@/config/site"
import type { BetaStatus } from "@/lib/beta/state"
import { formatNumber } from "@/lib/archive/format"
import { cn } from "@/lib/utils"

type BetaPanelProps = {
  status: BetaStatus
  /** Inscrição do visitante na fila, lida do cookie no servidor. */
  initial: WaitlistState
}

const PHASE_LABEL = {
  aberto: "Beta aberto",
  ultimas: "Últimas vagas",
  lotado: "Beta lotado",
} as const

function slotsLabel(free: number): string {
  return free === 1 ? "1 vaga" : `${formatNumber(free)} vagas`
}

/** Contador de atletas no beta e fila de espera quando as vagas acabam. */
export function BetaPanel({ status, initial }: BetaPanelProps) {
  const [joinState, join, joining] = useActionState(joinWaitlist, initial)
  const [leaveState, leave, leaving] = useActionState(leaveWaitlist, { status: "idle" } as WaitlistState)
  const current: WaitlistState = leaveState.status === "left" ? leaveState : joinState

  const free = Math.max(0, status.capacity - status.connected)
  const isFull = status.phase === "lotado"
  const joined = current.status === "joined"

  let headline: string
  if (joined) {
    headline = current.position ? `Você é o nº ${formatNumber(current.position)}` : "Você está na fila"
  } else if (isFull) {
    headline = status.waiting > 0 ? `${formatNumber(status.waiting)} na fila` : "Fila aberta"
  } else {
    headline = slotsLabel(free)
  }

  return (
    <div className="border-t border-foreground pt-5" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={cn("type-label flex items-center gap-2", status.phase === "ultimas" && "text-signal")}>
          <span aria-hidden className={cn("size-2 rounded-full", isFull ? "bg-foreground" : "bg-signal")} />
          {PHASE_LABEL[status.phase]}
        </p>
        <p className="type-label text-muted-foreground">
          {formatNumber(Math.min(status.connected, status.capacity))} de {status.capacity} atletas conectados
        </p>
      </div>

      <ol className="mt-5 grid grid-cols-10 gap-1.5" aria-label={`${status.connected} de ${status.capacity} vagas ocupadas`}>
        {Array.from({ length: status.capacity }, (_, index) => {
          const taken = index < status.connected
          return (
            <li
              key={index}
              className={cn(
                "type-label flex aspect-[50/64] items-end p-1.5 sm:p-2",
                taken ? "bg-signal text-white" : "border border-foreground text-muted-foreground"
              )}
            >
              <span className="sr-only">{taken ? "Ocupada" : "Livre"}: </span>
              {String(index + 1).padStart(2, "0")}
            </li>
          )
        })}
      </ol>

      <p className={cn("type-title mt-6", status.phase === "ultimas" && !joined && "text-signal")}>{headline}</p>
      <p className="mt-3 max-w-[48ch] text-ink-2">
        {joined
          ? `Confirmamos ${current.email}. Quando uma vaga abrir, avisamos por e-mail com um convite válido por 48 horas.`
          : isFull
            ? `As ${status.capacity} vagas estão ocupadas. Deixe seu e-mail: quando uma vaga abrir, você recebe um convite válido por 48 horas.`
            : status.phase === "ultimas"
              ? `Faltam ${slotsLabel(free)} no beta. Quando fechar, abrimos uma fila de espera.`
              : `Conecte o Strava e entre no beta. Nesta fase, o app pode ter até ${status.capacity} atletas conectados.`}
      </p>

      <div className="mt-6">
        {joined ? (
          <form action={leave}>
            <button type="submit" disabled={leaving} className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              {leaving ? "Saindo…" : "Sair da fila"}
            </button>
          </form>
        ) : isFull ? (
          <form action={join} className="grid gap-2" noValidate>
            <Label htmlFor="fila-email" className="type-label text-muted-foreground">
              Seu e-mail
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="fila-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="voce@email.com"
                defaultValue={current.status === "error" ? current.email : undefined}
                aria-invalid={current.status === "error" || undefined}
                aria-describedby={current.status === "error" ? "fila-erro" : undefined}
                className="h-12 rounded-none border-foreground bg-card text-base sm:max-w-80"
              />
              <button type="submit" disabled={joining} className={cn(buttonVariants({ size: "lg" }))}>
                {joining ? "Entrando…" : "Entrar na fila"}
                <ArrowRight aria-hidden />
              </button>
            </div>
            {current.status === "error" ? (
              <p id="fila-erro" className="text-sm text-destructive">
                {current.message}
              </p>
            ) : null}
            <a href={`${siteConfig.connectStravaPath}?retorno=1`} className="mt-2 w-fit text-sm text-ink-2 underline underline-offset-4 hover:text-foreground">
              Já está no beta? Entrar com o Strava
            </a>
          </form>
        ) : (
          <a href={siteConfig.connectStravaPath} className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-base")}>
            Conectar Strava
            <ArrowRight aria-hidden />
          </a>
        )}
      </div>
    </div>
  )
}
