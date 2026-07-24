import { formatShortDate } from "@/lib/profile/stats"
import { cn } from "@/lib/utils"

export function ProfileHeader({
  displayName,
  slug,
  bio,
  city,
  country,
  lastSyncedAt,
  className,
}: {
  displayName: string
  slug: string
  bio: string | null
  city: string | null
  country: string | null
  avatarUrl: string | null
  lastSyncedAt: string | null
  className?: string
}) {
  const location = [city, country].filter(Boolean).join(", ")

  return (
    <section className={cn("space-y-5", className)}>
      <div className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--label)]">
          Arquivo · /{slug}
        </p>
        <h1 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight text-[var(--ink)]">
          {displayName}
        </h1>
      </div>

      {bio ? (
        <p className="max-w-2xl text-base leading-relaxed text-[var(--ink-soft)]">
          {bio}
        </p>
      ) : null}

      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--label)]">
        {[
          location || null,
          lastSyncedAt ? `sync ${formatShortDate(lastSyncedAt)}` : null,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>
    </section>
  )
}
