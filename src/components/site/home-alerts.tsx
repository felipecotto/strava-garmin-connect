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
      ? "border-destructive/40 bg-[var(--bg)] text-destructive"
      : variant === "success"
        ? "border-[var(--accent)]/40 bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] text-[var(--ink)]"
        : "border-[var(--line)] bg-[var(--bg-alt)] text-[var(--ink)]"

  return (
    <div role="alert" className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${styles}`}>
      <p className="font-heading font-semibold">{title}</p>
      <div className="mt-1 text-[var(--ink-soft)] [&_code]:font-mono [&_code]:text-[var(--ink)]">
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

export async function HomeAlerts({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const err = typeof sp.error === "string" ? sp.error : undefined
  const disconnected = sp.disconnected === "1" || sp.disconnected === "true"
  const connected = sp.connected === "1" || sp.connected === "true"

  if (connected) {
    return (
      <AlertBox variant="success" title="Strava conectado">
        Seu arquivo está sendo sincronizado. Em alguns segundos os dados
        aparecem aqui.
      </AlertBox>
    )
  }

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
