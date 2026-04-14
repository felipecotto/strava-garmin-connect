import Link from "next/link"
import { Clock, Footprints, Mountain, Timer } from "lucide-react"

import { getDashboardStravaData } from "@/app/actions/strava"
import { DashboardStravaAlerts } from "@/components/dashboard/dashboard-strava-alerts"
import { InsightCard } from "@/components/dashboard/insight-card"
import { StatCard } from "@/components/dashboard/stat-card"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

function formatKm(meters: number) {
  return (meters / 1000).toFixed(1)
}

function formatHours(seconds: number) {
  return (seconds / 3600).toFixed(1)
}

export default async function DashboardHomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const data = await getDashboardStravaData()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-4">
        <DashboardStravaAlerts searchParams={searchParams} />
      </div>

      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Resumo dos treinos
        </h1>
        <p className="text-muted-foreground">
          {data.ok === "success"
            ? `Corridas registradas no Strava — ${data.periodLabel.toLowerCase()}, apenas atividades tipo “Run”.`
            : "Conecte sua conta Strava para ver distância, tempo e insights reais."}
        </p>
      </div>

      <Separator className="my-10" />

      {data.ok === "config_missing" ? (
        <div className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6 text-sm">
          <p className="font-medium">Variáveis de ambiente (local e Vercel)</p>
          <p className="text-muted-foreground leading-relaxed">
            Crie um app em{" "}
            <a
              href="https://www.strava.com/settings/api"
              className="text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Strava → Settings → API
            </a>{" "}
            e use o Client ID e o Client Secret no servidor. Na Vercel, defina as
            mesmas variáveis para <strong>Production</strong> e{" "}
            <strong>Preview</strong>, senão o link de preview do PR não enxerga as
            chaves. Inclua <code className="rounded bg-muted px-1.5 py-0.5">SESSION_SECRET</code>{" "}
            (≥32 caracteres). O callback pode ser omitido no env; o app monta{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">…/api/auth/strava/callback</code> a
            partir do domínio — o Strava deve ter o mesmo host em Authorization
            Callback Domain.
          </p>
        </div>
      ) : null}

      {data.ok === "unauthenticated" ? (
        <div className="max-w-xl space-y-6">
          <p className="text-muted-foreground">
            Você ainda não conectou o Strava neste dispositivo.
          </p>
          <Link
            href={siteConfig.connectStravaPath}
            className={cn(buttonVariants({ size: "lg" }), "inline-flex")}
          >
            Conectar com a API do Strava
          </Link>
        </div>
      ) : null}

      {data.ok === "error" ? (
        <div className="max-w-xl rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Erro ao carregar dados</p>
          <p className="mt-1 text-muted-foreground">{data.message}</p>
          <Link
            href={siteConfig.connectStravaPath}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-4 inline-flex"
            )}
          >
            Reconectar Strava
          </Link>
        </div>
      ) : null}

      {data.ok === "success" ? (
        <>
          <section aria-labelledby="weekly-heading">
            <h2 id="weekly-heading" className="sr-only">
              Indicadores — {data.periodLabel}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Distância"
                value={`${formatKm(data.stats.distanceM)} km`}
                hint="Somatório das corridas (tipo Run) no período."
                icon={Footprints}
              />
              <StatCard
                title="Atividades"
                value={String(data.stats.runCount)}
                hint="Sessões de corrida no período."
                icon={Timer}
              />
              <StatCard
                title="Tempo em movimento"
                value={`${formatHours(data.stats.movingTimeSec)} h`}
                hint="Tempo em movimento somado nas corridas."
                icon={Clock}
              />
              <StatCard
                title="Elevação"
                value={`${Math.round(data.stats.elevationM)} m`}
                hint="Ganho de elevação acumulado."
                icon={Mountain}
              />
            </div>
          </section>

          <section className="mt-14" aria-labelledby="insights-heading">
            <div className="mb-6 max-w-2xl space-y-2">
              <h2
                id="insights-heading"
                className="text-xl font-semibold tracking-tight"
              >
                Insights
              </h2>
              <p className="text-sm text-muted-foreground">
                Leituras automáticas com base nos seus dados agregados — não
                substituem orientação profissional.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {data.insights.map((item) => (
                <InsightCard
                  key={item.id}
                  title={item.title}
                  body={item.body}
                  tone={item.tone}
                />
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
