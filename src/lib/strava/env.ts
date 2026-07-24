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

function isLocalDev(): boolean {
  return process.env.NODE_ENV === "development"
}

function originFromRequest(request?: Request): string | null {
  if (!request) {
    return null
  }
  try {
    return new URL(request.url).origin
  } catch {
    return null
  }
}

/**
 * Quando STRAVA_REDIRECT_URI está definido com o domínio de produção (ex.: usectt.com.br),
 * reutilizamos essa origem para redirects — evita ficar preso ao hostname antigo de VERCEL_URL.
 * Em development isso é ignorado (ver getAppOrigin).
 */
function getOriginFromStravaRedirectUri(): string | null {
  const raw = process.env.STRAVA_REDIRECT_URI?.trim()
  if (!raw) {
    return null
  }
  try {
    const u = new URL(normalizeRedirectUri(raw))
    return `${u.protocol}//${u.host}`
  } catch {
    return null
  }
}

/**
 * Mesmo valor em /authorize e em POST /oauth/token.
 * Em development: sempre localhost (ignora STRAVA_REDIRECT_URI de produção).
 * Em produção: STRAVA_REDIRECT_URI ou origem canônica + path.
 */
export function getStravaRedirectUri(request?: Request): string {
  if (isLocalDev()) {
    return normalizeRedirectUri(`${getAppOrigin(request)}${CALLBACK_PATH}`)
  }

  const fromEnv = process.env.STRAVA_REDIRECT_URI?.trim()
  if (fromEnv) {
    return normalizeRedirectUri(fromEnv)
  }
  return normalizeRedirectUri(`${getAppOrigin(request)}${CALLBACK_PATH}`)
}

export function getStravaOAuthConfig(request?: Request) {
  return {
    clientId: required("STRAVA_CLIENT_ID"),
    clientSecret: required("STRAVA_CLIENT_SECRET"),
    redirectUri: getStravaRedirectUri(request),
  }
}

/** Mínimo 32 caracteres (iron-session). Em dev permite fallback local. */
export function getSessionSecret() {
  const v = process.env.SESSION_SECRET?.trim()
  if (v && v.length >= 32) {
    return v
  }
  if (isLocalDev()) {
    return "pace-insights-dev-only-secret-32chars-min!!"
  }
  throw new Error(
    "SESSION_SECRET deve ter pelo menos 32 caracteres. Defina em .env (produção)."
  )
}

/**
 * Origem usada em redirects OAuth (callback, erros).
 * Development: origem do request (localhost) — ignora NEXT_PUBLIC_APP_URL de produção.
 * Produção:
 * 1) NEXT_PUBLIC_APP_URL
 * 2) Origem derivada de STRAVA_REDIRECT_URI
 * 3) VERCEL_URL
 * 4) localhost fallback
 */
export function getAppOrigin(request?: Request): string {
  if (isLocalDev()) {
    return originFromRequest(request) ?? "http://localhost:3000"
  }

  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (explicit) {
    return explicit.replace(/\/$/, "")
  }
  const fromStravaRedirect = getOriginFromStravaRedirectUri()
  if (fromStravaRedirect) {
    return fromStravaRedirect
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
