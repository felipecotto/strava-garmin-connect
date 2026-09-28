"use server"

import { redirect } from "next/navigation"

import { fetchAthlete, getValidAccessToken } from "@/lib/strava/api"
import { deauthorizeAccessToken } from "@/lib/strava/auth"
import { isStravaConfigured } from "@/lib/strava/env"
import { getStravaIronSession } from "@/lib/strava/session"
import type { StravaAthlete } from "@/lib/strava/types"

export type ProfileStravaResult =
  | { ok: "config_missing" }
  | { ok: "unauthenticated" }
  | { ok: "success"; athlete: StravaAthlete }
  | { ok: "error"; message: string }

export async function getStravaProfileData(): Promise<ProfileStravaResult> {
  if (!isStravaConfigured()) {
    return { ok: "config_missing" }
  }
  try {
    const session = await getStravaIronSession()
    const token = await getValidAccessToken(session)
    if (!token) {
      return { ok: "unauthenticated" }
    }
    const athlete = await fetchAthlete(token)
    return { ok: "success", athlete }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao buscar perfil."
    return { ok: "error", message }
  }
}

export async function logoutStrava() {
  const session = await getStravaIronSession()
  const token = await getValidAccessToken(session)

  if (token) {
    try {
      await deauthorizeAccessToken(token)
    } catch {
      // Ainda limpamos a sessão local para garantir logout no app.
    }
  }

  session.destroy()
  await session.save()
  redirect("/?disconnected=1")
}
