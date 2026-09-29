"use server"

import { cookies } from "next/headers"

import { waitlistPosition } from "@/lib/beta/get-beta-status"
import { normalizeEmail, WAITLIST_COOKIE } from "@/lib/beta/state"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"

const COOKIE_MAX_AGE = 60 * 60 * 24 * 180

export type WaitlistState =
  | { status: "idle" }
  | { status: "error"; message: string; email?: string }
  | { status: "joined"; email: string; position: number | null }
  | { status: "left" }

const UNIQUE_VIOLATION = "23505"

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const raw = formData.get("email")
  const email = normalizeEmail(raw)
  if (!email) {
    return {
      status: "error",
      message: "Confira o e-mail: ele precisa ter um nome, @ e um domínio (ex.: voce@email.com).",
      email: typeof raw === "string" ? raw : undefined,
    }
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "A fila está indisponível agora. Tente de novo em alguns minutos.", email }
  }

  const supabase = createSupabaseAdminClient()
  let entryId: string | null = null

  const inserted = await supabase.from("beta_waitlist").insert({ email }).select("id").single()
  if (inserted.data) {
    entryId = inserted.data.id
  } else if (inserted.error?.code === UNIQUE_VIOLATION) {
    // Já estava na fila (ou saiu antes): reaproveita a inscrição e volta para a espera se tinha saído.
    const existing = await supabase.from("beta_waitlist").select("id, status").ilike("email", email).maybeSingle()
    if (existing.data) {
      entryId = existing.data.id
      if (existing.data.status === "left" || existing.data.status === "expired") {
        await supabase
          .from("beta_waitlist")
          .update({ status: "waiting", created_at: new Date().toISOString() })
          .eq("id", entryId)
      }
    }
  } else if (inserted.error) {
    console.error("[beta] falha ao entrar na fila", inserted.error)
  }

  if (!entryId) {
    return { status: "error", message: "Não deu para salvar agora. Tente de novo em alguns minutos.", email }
  }

  const store = await cookies()
  store.set(WAITLIST_COOKIE, entryId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })

  return { status: "joined", email, position: await waitlistPosition(entryId) }
}

export async function leaveWaitlist(): Promise<WaitlistState> {
  const store = await cookies()
  const entryId = store.get(WAITLIST_COOKIE)?.value
  if (entryId && isSupabaseConfigured()) {
    const { error } = await createSupabaseAdminClient()
      .from("beta_waitlist")
      .update({ status: "left" })
      .eq("id", entryId)
      .eq("status", "waiting")
    if (error) console.error("[beta] falha ao sair da fila", error)
  }
  store.delete(WAITLIST_COOKIE)
  return { status: "left" }
}
