import { NextResponse } from "next/server"

import { exchangeAuthorizationCode } from "@/lib/strava/auth"
import { getAppOrigin, isStravaConfigured } from "@/lib/strava/env"
import { verifyStravaOAuthState } from "@/lib/strava/oauth-state"
import { getStravaIronSession } from "@/lib/strava/session"

export async function GET(request: Request) {
  const origin = getAppOrigin()
  const url = new URL(request.url)

  const redirectWith = (path: string) => {
    return NextResponse.redirect(new URL(path, origin))
  }

  if (!isStravaConfigured()) {
    return redirectWith("/dashboard?error=config")
  }

  const error = url.searchParams.get("error")
  if (error === "access_denied") {
    return redirectWith("/dashboard?error=denied")
  }

  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  if (!code || !verifyStravaOAuthState(state)) {
    return redirectWith("/dashboard?error=invalid_state")
  }

  const token = await exchangeAuthorizationCode(code)
  if (!token) {
    return redirectWith("/dashboard?error=token")
  }

  const session = await getStravaIronSession()
  session.accessToken = token.access_token
  session.refreshToken = token.refresh_token
  session.expiresAt = token.expires_at
  await session.save()

  return redirectWith("/dashboard?connected=1")
}
