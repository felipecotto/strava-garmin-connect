import type { ProfileStats } from "@/lib/profile/stats"
import { formatDuration, formatKm } from "@/lib/profile/stats"
import { ProfileStatCell } from "@/components/profile/profile-stat-cell"
import { cn } from "@/lib/utils"

export function ProfileBentoStats({
  stats,
  className,
}: {
  stats: ProfileStats
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden border border-border/80 bg-border/80 sm:grid-cols-4",
        className
      )}
    >
      <ProfileStatCell
        label="Distância"
        value={`${formatKm(stats.totalDistanceM, 0)}`}
        hint="km totais · corridas"
        className="border-0 bg-background"
      />
      <ProfileStatCell
        label="Corridas"
        value={String(stats.totalRuns)}
        hint="atividades Run"
        className="border-0 bg-background"
      />
      <ProfileStatCell
        label="Tempo"
        value={formatDuration(stats.totalMovingTimeS)}
        hint="em movimento"
        className="border-0 bg-background"
      />
      <ProfileStatCell
        label="Streak"
        value={`${stats.currentStreakDays}d`}
        hint={`recorde ${stats.longestStreakDays}d`}
        className="border-0 bg-background"
      />
      <ProfileStatCell
        label="YTD"
        value={`${formatKm(stats.ytdDistanceM, 0)} km`}
        hint={`${stats.ytdRuns} corridas este ano`}
        className="border-0 bg-background sm:col-span-2"
      />
      <ProfileStatCell
        label="30 dias"
        value={`${formatKm(stats.last30dDistanceM, 0)} km`}
        hint={`${stats.last30dRuns} corridas`}
        className="border-0 bg-background sm:col-span-2"
      />
    </div>
  )
}
