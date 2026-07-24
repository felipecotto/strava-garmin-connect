"use server"

import { revalidatePath } from "next/cache"

import { getOwnerProfile } from "@/lib/profile/get-owner-profile"
import { isValidSlug, sanitizeSlug } from "@/lib/profile/slug"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export type UpdateSettingsResult =
  | { ok: true; slug: string }
  | { ok: false; error: string }

function readBool(formData: FormData, key: string): boolean {
  const value = formData.get(key)
  return value === "true" || value === "on" || value === "1"
}

export async function updateProfileSettings(
  formData: FormData
): Promise<UpdateSettingsResult> {
  const profile = await getOwnerProfile()
  if (!profile) {
    return { ok: false, error: "Faça login com o Strava para editar o arquivo." }
  }

  const rawSlug = String(formData.get("slug") ?? "").trim()
  const slug = sanitizeSlug(rawSlug)
  const bioRaw = String(formData.get("bio") ?? "").trim()
  const bio = bioRaw.length > 0 ? bioRaw.slice(0, 280) : null
  const isPublic = readBool(formData, "is_public")
  const showActivityNames = readBool(formData, "show_activity_names")

  if (!isValidSlug(slug)) {
    return {
      ok: false,
      error:
        "Slug inválido. Use 3–30 caracteres: letras minúsculas, números e hífen.",
    }
  }

  const supabase = createSupabaseAdminClient()

  if (slug !== profile.slug) {
    const { data: taken } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", slug)
      .neq("id", profile.id)
      .maybeSingle()

    if (taken) {
      return { ok: false, error: "Esse slug já está em uso." }
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      slug,
      bio,
      is_public: isPublic,
      show_activity_names: showActivityNames,
    })
    .eq("id", profile.id)

  if (error) {
    return { ok: false, error: error.message }
  }

  revalidatePath(`/${profile.slug}`)
  revalidatePath(`/${slug}`)
  revalidatePath("/")
  revalidatePath("/perfil")

  return { ok: true, slug }
}
