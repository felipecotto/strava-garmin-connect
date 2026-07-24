"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { MonthlyVolumePoint } from "@/lib/profile/stats"
import { cn } from "@/lib/utils"

export function ProfileVolumeChart({
  data,
  className,
}: {
  data: MonthlyVolumePoint[]
  className?: string
}) {
  return (
    <section className={cn("border border-border/80", className)}>
      <div className="border-b border-border/80 px-4 py-4 sm:px-5">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Volume mensal
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Distância de corridas · últimos {data.length} meses
        </p>
      </div>
      <div className="h-56 w-full px-2 py-4 sm:h-64 sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid
              vertical={false}
              stroke="currentColor"
              className="text-border"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-muted-foreground"
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={36}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-muted-foreground"
              unit="k"
              tickFormatter={(v: number) => String(Math.round(v))}
            />
            <Tooltip
              cursor={{ fill: "currentColor", opacity: 0.06 }}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--background)",
                fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                fontSize: 12,
              }}
              formatter={(value) => [
                `${Number(value).toLocaleString("pt-BR", {
                  maximumFractionDigits: 1,
                })} km`,
                "Distância",
              ]}
              labelFormatter={(label) => String(label)}
            />
            <Bar
              dataKey="distanceKm"
              fill="#e8450a"
              radius={[2, 2, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
