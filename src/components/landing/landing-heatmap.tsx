import type { HeatmapDay } from "@/lib/landing/evidence"
import { cn } from "@/lib/utils"

const LEVEL: Record<HeatmapDay["level"], string> = {
  0: "bg-[var(--line)]",
  1: "bg-[#F0D2C4]",
  2: "bg-[#F0A480]",
  3: "bg-[#EE7647]",
  4: "bg-[var(--brand)]",
}

export function LandingHeatmap({
  days,
  className,
}: {
  days: HeatmapDay[]
  className?: string
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: "repeat(26, 10px)",
          gridAutoRows: "10px",
        }}
      >
        {days.slice(-26 * 7).map((day) => (
          <div
            key={day.date}
            title={`${day.date} · ${day.km} km`}
            className={cn("size-[10px]", LEVEL[day.level])}
          />
        ))}
      </div>
    </div>
  )
}
