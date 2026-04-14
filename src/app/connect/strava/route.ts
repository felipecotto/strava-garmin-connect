import { NextResponse } from "next/server"

import { getAppOrigin, getStravaOAuthConfig, isStravaConfigured } from "@/lib/strava/env"
import { STRAVA_OAUTH_STATE_COOKIE } from "@/lib/strava/oauth-state"

export async function GET() {
  const origin = getAppOrigin()

  if (!isStravaConfigured()) {
    return NextResponse.redirect(new URL("/dashboard?error=config", origin))
  }

  const { clientId, redirectUri } = getStravaOAuthConfig()
  const state = crypto.randomUUID()

  const authorize = new URL("https://www.strava.com/oauth/authorize")
  authorize.searchParams.set("client_id", clientId)
  authorize.searchParams.set("redirect_uri", redirectUri)
  authorize.searchParams.set("response_type", "code")
  authorize.searchParams.set("approval_prompt", "force")
  authorize.searchParams.set("scope", "read,activity:read")
  authorize.searchParams.set("state", state)

  const res = NextResponse.redirect(authorize.toString())
  res.cookies.set(STRAVA_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  })
  return res
}
