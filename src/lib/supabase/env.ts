function required(name: string): string {
  const v = process.env[name]
  if (!v?.trim()) {
    throw new Error(
      `Variável de ambiente ausente: ${name}. Copie .env.example para .env e preencha.`
    )
  }
  return v.trim()
}

export function getSupabaseUrl(): string {
  return required("NEXT_PUBLIC_SUPABASE_URL")
}

/** Service role — apenas server-side (sync, webhooks, cron). */
export function getSupabaseServiceRoleKey(): string {
  return required("SUPABASE_SERVICE_ROLE_KEY")
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  )
}
