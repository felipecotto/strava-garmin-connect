import { getStravaOAuthConfig } from "@/lib/strava/env"
import type { StravaTokenResponse } from "@/lib/strava/types"

export async function exchangeAuthorizationCode(
  code: string
): Promise<StravaTokenResponse | null> {
  const { clientId, clientSecret, redirectUri } = getStravaOAuthConfig()
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  })
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    body,
  })
  if (!res.ok) {
    return null
  }
  return res.json() as Promise<StravaTokenResponse>
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<StravaTokenResponse | null> {
  const { clientId, clientSecret } = getStravaOAuthConfig()
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  })
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    body,
  })
  if (!res.ok) {
    return null
  }
  return res.json() as Promise<StravaTokenResponse>
}
