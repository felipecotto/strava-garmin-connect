import { cookies } from "next/headers"
import { getIronSession, type IronSession } from "iron-session"

import { getStravaSessionOptions } from "@/lib/strava/session-options"
import type { StravaSessionData } from "@/lib/strava/types"

export async function getStravaIronSession(): Promise<
  IronSession<StravaSessionData>
> {
  const store = await cookies()
  return getIronSession<StravaSessionData>(store, getStravaSessionOptions())
}
