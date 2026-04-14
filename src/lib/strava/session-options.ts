import type { SessionOptions } from "iron-session"

import { getSessionSecret } from "@/lib/strava/env"

export const STRAVA_SESSION_COOKIE = "strava_oauth"

export function getStravaSessionOptions(): SessionOptions {
  return {
    cookieName: STRAVA_SESSION_COOKIE,
    password: getSessionSecret(),
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  }
}
