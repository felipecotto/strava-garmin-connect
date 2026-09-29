import { revalidateTag } from "next/cache"

import { archiveCacheTag } from "@/lib/archive/cache-tags"
import { profileCacheTag, profileSlugCacheTag } from "@/lib/profile/get-profile"

/**
 * Quem acabou de conectar está esperando os próprios dados: expira na hora,
 * sem servir a versão antiga enquanto revalida.
 */
const EXPIRE_NOW = { expire: 0 }

/**
 * Perfil em cache (id e, se informado, slug). Só em Route Handlers e Server Functions.
 * Sem o slug, a busca por slug também expira, porque ela carrega a tag do id.
 */
export function expireProfileCache(profileId: string, slug?: string): void {
  revalidateTag(profileCacheTag(profileId), EXPIRE_NOW)
  if (slug) revalidateTag(profileSlugCacheTag(slug), EXPIRE_NOW)
}

/** Edição calculada a partir das atividades. Só em Route Handlers e Server Functions. */
export function expireArchiveCache(profileId: string): void {
  revalidateTag(archiveCacheTag(profileId), EXPIRE_NOW)
}
