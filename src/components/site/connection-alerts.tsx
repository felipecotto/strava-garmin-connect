import type { ReactNode } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AlertVariant = "default" | "destructive" | "signal"

type AlertCopy = { variant: AlertVariant; title: string; body: ReactNode }

const errorCopy: Record<string, Omit<AlertCopy, "variant">> = {
  denied: {
    title: "Autorização cancelada",
    body: "Você não autorizou o acesso. Pode tentar de novo quando quiser.",
  },
  invalid_state: {
    title: "Sessão de login inválida",
    body: "Por segurança, inicie o fluxo novamente pelo botão Conectar Strava.",
  },
  token: {
    title: "Não foi possível obter o token",
    body: "Confira Client ID, Client Secret e Redirect URI no app Strava e no arquivo .env.",
  },
  config: {
    title: "Strava não configurado neste deploy",
    body: (
      <>
        O servidor não encontrou <code>STRAVA_CLIENT_ID</code> e/ou{" "}
        <code>STRAVA_CLIENT_SECRET</code>.
      </>
    ),
  },
  profile: {
    title: "Conta Strava conectada, mas o perfil não foi criado",
    body: (
      <>
        Confira <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
        <code>SUPABASE_SERVICE_ROLE_KEY</code> e tente conectar de novo.
      </>
    ),
  },
}

function alertFromSearchParams(
  params: Record<string, string | string[] | undefined>
): AlertCopy | null {
  const isOn = (value: unknown) => value === "1" || value === "true"

  if (isOn(params.connected)) {
    return {
      variant: "signal",
      title: "Strava conectado",
      body: "Estamos importando seus treinos. A primeira importação leva alguns minutos.",
    }
  }
  if (isOn(params.disconnected)) {
    return {
      variant: "default",
      title: "Conta desconectada",
      body: "Sua sessão Strava foi encerrada neste navegador.",
    }
  }
  const error = typeof params.error === "string" ? errorCopy[params.error] : undefined
  return error ? { variant: "destructive", ...error } : null
}

/** Aviso de volta do OAuth do Strava (`?connected`, `?disconnected`, `?error`). */
export async function ConnectionAlerts({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const alert = alertFromSearchParams(await searchParams)
  if (!alert) return null

  return (
    <Alert variant={alert.variant} className="mb-8 px-4 py-3">
      <AlertTitle>{alert.title}</AlertTitle>
      <AlertDescription className="[&_code]:font-mono [&_code]:text-foreground">
        {alert.body}
      </AlertDescription>
    </Alert>
  )
}
