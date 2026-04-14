import type { ReactNode } from "react"

function AlertBox({
  variant,
  title,
  children,
}: {
  variant: "destructive" | "default" | "success"
  title: string
  children: ReactNode
}) {
  const styles =
    variant === "destructive"
      ? "border-destructive/40 bg-destructive/5 text-destructive"
      : variant === "success"
        ? "border-primary/30 bg-primary/5 text-foreground"
        : "border-border bg-muted/40 text-foreground"

  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm ${styles}`}
    >
      <p className="font-medium">{title}</p>
      <div className="mt-1 text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 [&_a]:hover:underline">
        {children}
      </div>
    </div>
  )
}

const errorCopy: Record<string, { title: string; body: ReactNode }> = {
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
    title: "Strava não configurado",
    body: (
      <>
        Defina <code className="rounded bg-muted px-1 py-0.5">STRAVA_CLIENT_ID</code>,{" "}
        <code className="rounded bg-muted px-1 py-0.5">STRAVA_CLIENT_SECRET</code>,{" "}
        <code className="rounded bg-muted px-1 py-0.5">STRAVA_REDIRECT_URI</code> e{" "}
        <code className="rounded bg-muted px-1 py-0.5">SESSION_SECRET</code> no{" "}
        <code className="rounded bg-muted px-1 py-0.5">.env</code>.
      </>
    ),
  },
}

export async function DashboardStravaAlerts({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const err = typeof sp.error === "string" ? sp.error : undefined
  const disconnected = sp.disconnected === "1" || sp.disconnected === "true"

  if (disconnected) {
    return (
      <AlertBox variant="default" title="Conta desconectada">
        Sua sessão Strava foi encerrada neste navegador.
      </AlertBox>
    )
  }

  if (err && errorCopy[err]) {
    const { title, body } = errorCopy[err]
    return (
      <AlertBox variant="destructive" title={title}>
        {body}
      </AlertBox>
    )
  }

  return null
}
