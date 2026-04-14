import Link from "next/link"
import { MapPin } from "lucide-react"

import { getStravaProfileData, logoutStrava } from "@/app/actions/strava"
import { DashboardStravaAlerts } from "@/components/dashboard/dashboard-strava-alerts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

function formatMemberSince(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    })
  } catch {
    return "—"
  }
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const data = await getStravaProfileData()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-4">
        <DashboardStravaAlerts searchParams={searchParams} />
      </div>

      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">
          Dados da sua conta Strava (API{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">/athlete</code>
          ).
        </p>
      </div>

      <Separator className="my-10" />

      {data.ok === "config_missing" ? (
        <p className="text-sm text-muted-foreground">
          Configure o Strava no <code className="rounded bg-muted px-1">.env</code>{" "}
          para carregar o perfil.
        </p>
      ) : null}

      {data.ok === "unauthenticated" ? (
        <div className="max-w-xl space-y-4">
          <p className="text-muted-foreground">Conecte o Strava para ver seu perfil.</p>
          <Link
            href={siteConfig.connectStravaPath}
            className={cn(buttonVariants({ size: "default" }))}
          >
            Conectar Strava
          </Link>
        </div>
      ) : null}

      {data.ok === "error" ? (
        <p className="text-sm text-destructive">{data.message}</p>
      ) : null}

      {data.ok === "success" ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <Card className="h-fit border-border/80 shadow-none">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <Avatar className="size-16 border border-border">
                {data.athlete.profile_medium ? (
                  <AvatarImage
                    src={data.athlete.profile_medium}
                    alt=""
                  />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                  {`${data.athlete.firstname?.[0] ?? ""}${data.athlete.lastname?.[0] ?? ""}`.toUpperCase() ||
                    "?"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-xl">
                  {data.athlete.firstname} {data.athlete.lastname}
                </CardTitle>
                <CardDescription>
                  @{data.athlete.username ?? "atleta"}
                </CardDescription>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden />
                  {[data.athlete.city, data.athlete.state, data.athlete.country]
                    .filter(Boolean)
                    .join(", ") || "Local não informado"}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <form action={logoutStrava}>
                <Button type="submit" variant="outline" className="w-full">
                  Desconectar Strava
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                Remove os tokens deste navegador. Você pode autorizar de novo a
                qualquer momento.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/80 shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">Conta</CardTitle>
                <CardDescription>
                  Preferências e cadastro conforme o Strava.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Membro desde</span>
                  <span className="font-medium tabular-nums">
                    {formatMemberSince(data.athlete.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Medidas</span>
                  <span className="font-medium capitalize">
                    {data.athlete.measurement_preference === "meters"
                      ? "km / m"
                      : data.athlete.measurement_preference}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">Privacidade</CardTitle>
                <CardDescription>
                  Este app lê apenas o necessário para o escopo autorizado (
                  <code className="rounded bg-muted px-1 text-xs">read</code>,{" "}
                  <code className="rounded bg-muted px-1 text-xs">
                    activity:read
                  </code>
                  ).
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Tokens ficam em cookie criptografado no servidor (iron-session).
                Revogue o acesso pelo Strava se precisar.
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground">
              <Link
                href="/dashboard"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Voltar ao resumo
              </Link>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
