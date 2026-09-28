import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"

import { athleteCapacity, betaPhase, type BetaStatus } from "./state"

/** Contagem ao vivo de atletas conectados e da fila. Sem Supabase, o beta aparece aberto. */
export async function getBetaStatus(): Promise<BetaStatus> {
  const capacity = athleteCapacity()
  if (!isSupabaseConfigured()) {
    return { capacity, connected: 0, waiting: 0, phase: "aberto" }
  }

  const supabase = createSupabaseAdminClient()
  const [profiles, waitlist] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).is("strava_revoked_at", null),
    supabase.from("beta_waitlist").select("id", { count: "exact", head: true }).eq("status", "waiting"),
  ])

  if (profiles.error) {
    console.error("[beta] falha ao contar atletas conectados", profiles.error)
  }
  if (waitlist.error) {
    console.error("[beta] falha ao contar a fila", waitlist.error)
  }

  const connected = profiles.count ?? 0
  return {
    capacity,
    connected,
    waiting: waitlist.count ?? 0,
    phase: betaPhase(connected, capacity),
  }
}

/** Posição (1 = primeiro) de uma inscrição que ainda está esperando. */
export async function waitlistPosition(entryId: string): Promise<number | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = createSupabaseAdminClient()
  const { data: entry } = await supabase
    .from("beta_waitlist")
    .select("created_at, status")
    .eq("id", entryId)
    .maybeSingle()
  if (!entry || entry.status !== "waiting") return null

  const { count } = await supabase
    .from("beta_waitlist")
    .select("id", { count: "exact", head: true })
    .eq("status", "waiting")
    .lte("created_at", entry.created_at)
  return count ?? null
}
