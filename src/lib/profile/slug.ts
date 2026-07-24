/**
 * Gera slug válido para profiles.slug
 * Constraint: ^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$ (3–30 chars)
 */

export const RESERVED_SLUGS = new Set([
  "dashboard",
  "perfil",
  "connect",
  "api",
  "settings",
  "login",
  "logout",
  "admin",
  "app",
  "static",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "opengraph-image",
])

export function isValidSlug(slug: string): boolean {
  return (
    slug.length >= 3 &&
    slug.length <= 30 &&
    /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$/.test(slug) &&
    !RESERVED_SLUGS.has(slug)
  )
}

export function sanitizeSlug(raw: string): string {
  const cleaned = raw
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30)
    .replace(/-+$/g, "")

  if (cleaned.length >= 3 && /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$/.test(cleaned)) {
    return cleaned
  }

  const padded = `${cleaned}user`.replace(/[^a-z0-9]/g, "").slice(0, 30)
  if (padded.length >= 3) {
    return padded
  }

  return "runner"
}

export function buildSlugCandidates(input: {
  username: string | null
  firstname: string
  lastname: string
  athleteId: number
}): string[] {
  const fromUsername = input.username ? sanitizeSlug(input.username) : null
  const fromName = sanitizeSlug(`${input.firstname} ${input.lastname}`)
  const fromFirst = sanitizeSlug(input.firstname)
  const withId = sanitizeSlug(`${fromFirst || "runner"}-${input.athleteId}`)

  const ordered = [fromUsername, fromName, fromFirst, withId, `athlete-${input.athleteId}`]
  const unique: string[] = []
  for (const candidate of ordered) {
    if (!candidate) continue
    const slug = sanitizeSlug(candidate)
    if (!unique.includes(slug)) {
      unique.push(slug)
    }
  }
  return unique
}
