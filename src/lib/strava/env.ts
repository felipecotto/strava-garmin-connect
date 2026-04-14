function required(name: string): string {
  const v = process.env[name]
  if (!v?.trim()) {
    throw new Error(
      `Variável de ambiente ausente: ${name}. Copie .env.example para .env e preencha.`
    )
  }
  return v.trim()
}

export function getStravaOAuthConfig() {
  return {
    clientId: required("STRAVA_CLIENT_ID"),
    clientSecret: required("STRAVA_CLIENT_SECRET"),
    redirectUri: required("STRAVA_REDIRECT_URI"),
  }
}

/** Mínimo 32 caracteres (iron-session). Em dev permite fallback local. */
export function getSessionSecret() {
  const v = process.env.SESSION_SECRET?.trim()
  if (v && v.length >= 32) {
    return v
  }
  if (process.env.NODE_ENV === "development") {
    return "pace-insights-dev-only-secret-32chars-min!!"
  }
  throw new Error(
    "SESSION_SECRET deve ter pelo menos 32 caracteres. Defina em .env (produção)."
  )
}

/**
 * Origem usada em redirects OAuth (callback, erros).
 * Na Vercel, `VERCEL_URL` existe sem protocolo — não dependa só de localhost.
 */
export function getAppOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (explicit) {
    return explicit.replace(/\/$/, "")
  }
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "")
    return `https://${host}`
  }
  return "http://localhost:3000"
}

export function isStravaConfigured(): boolean {
  return Boolean(
    process.env.STRAVA_CLIENT_ID?.trim() &&
      process.env.STRAVA_CLIENT_SECRET?.trim() &&
      process.env.STRAVA_REDIRECT_URI?.trim()
  )
}
