import { NextResponse } from "next/server"

import { getBetaStatus } from "@/lib/beta/get-beta-status"

import { getAppOrigin, getStravaOAuthConfig, isStravaConfigured } from "@/lib/strava/env"
import { createStravaOAuthState } from "@/lib/strava/oauth-state"

export async function GET(request: Request) {
  const origin = getAppOrigin(request)

  if (!isStravaConfigured()) {
    return NextResponse.redirect(new URL("/?error=config", origin))
  }

  // Beta lotado: novos atletas vão para a fila. `?retorno=1` deixa passar quem já está no beta.
  const url = new URL(request.url)
  if (url.searchParams.get("retorno") !== "1") {
    const beta = await getBetaStatus()
    if (beta.phase === "lotado") {
      return NextResponse.redirect(new URL("/?error=capacity#conectar", origin))
    }
  }

  const { clientId, redirectUri } = getStravaOAuthConfig(request)
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
