import { NextResponse } from "next/server"

import { getAppOrigin, getStravaOAuthConfig, isStravaConfigured } from "@/lib/strava/env"
import { createStravaOAuthState } from "@/lib/strava/oauth-state"

export async function GET() {
  const origin = getAppOrigin()

  if (!isStravaConfigured()) {
    return NextResponse.redirect(new URL("/dashboard?error=config", origin))
  }

  const { clientId, redirectUri } = getStravaOAuthConfig()
  const state = createStravaOAuthState()

  const authorize = new URL("https://www.strava.com/oauth/authorize")
  authorize.searchParams.set("client_id", clientId)
  authorize.searchParams.set("redirect_uri", redirectUri)
  authorize.searchParams.set("response_type", "code")
  authorize.searchParams.set("approval_prompt", "force")
  authorize.searchParams.set("scope", "read,activity:read")
  authorize.searchParams.set("state", state)

  return NextResponse.redirect(authorize.toString())
}
