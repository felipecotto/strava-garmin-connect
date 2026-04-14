function required(name: string): string {
  const v = process.env[name]
  if (!v?.trim()) {
    throw new Error(
      `Variável de ambiente ausente: ${name}. Copie .env.example para .env e preencha.`
    )
  }
  return v.trim()
}

/** Strava rejeita redirect_uri se não bater com o domínio do app (Settings → API). */
export function normalizeRedirectUri(uri: string): string {
  const trimmed = uri.trim()
  if (!trimmed) {
    return trimmed
  }
  try {
    const u = new URL(trimmed)
    if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
      u.pathname = u.pathname.slice(0, -1)
    }
    return u.toString()
  } catch {
    return trimmed
  }
}

const CALLBACK_PATH = "/api/auth/strava/callback"

/**
 * Mesmo valor em /authorize e em POST /oauth/token.
 * Se STRAVA_REDIRECT_URI não existir, usa origem atual + path (útil na Vercel).
 */
export function getStravaRedirectUri(): string {
  const fromEnv = process.env.STRAVA_REDIRECT_URI?.trim()
  if (fromEnv) {
    return normalizeRedirectUri(fromEnv)
  }
  return normalizeRedirectUri(`${getAppOrigin()}${CALLBACK_PATH}`)
}

export function getStravaOAuthConfig() {
  return {
    clientId: required("STRAVA_CLIENT_ID"),
    clientSecret: required("STRAVA_CLIENT_SECRET"),
    redirectUri: getStravaRedirectUri(),
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
      process.env.STRAVA_CLIENT_SECRET?.trim()
  )
}
