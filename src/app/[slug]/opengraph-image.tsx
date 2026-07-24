import { ImageResponse } from "next/og"

import { getPublicProfileBySlug } from "@/lib/profile/get-public-profile"
import { formatKm, formatRaceTime } from "@/lib/profile/stats"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"
export const runtime = "nodejs"

type ImageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProfileOpengraphImage({ params }: ImageProps) {
  const { slug } = await params

  let displayName = slug
  let line = "Arquivo de performance · CTT"
  let statsLine = ""

  if (isSupabaseConfigured()) {
    try {
      const data = await getPublicProfileBySlug(slug)
      if (data) {
        displayName = data.profile.display_name
        const best5k = data.records.find((r) => r.key === "5k")
        statsLine = [
          `${formatKm(data.stats.totalDistanceM, 0)} km`,
          `${data.stats.totalRuns} atividades`,
          best5k ? `5K ${formatRaceTime(best5k.movingTimeS)}` : null,
        ]
          .filter(Boolean)
          .join("  ·  ")
        line = `/${data.profile.slug}`
      }
    } catch {
      // fallback visual abaixo
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background: "#FAFAF8",
          color: "#131311",
          fontFamily: "system-ui, sans-serif",
          borderBottom: "8px solid #E8450A",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            <div style={{ width: 8, height: 8, background: "#E8450A" }} />
            CTT
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#8A8A82",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {line}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <p
            style={{
              fontSize: 68,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            {displayName}
          </p>
          <p
            style={{
              fontSize: 26,
              margin: 0,
              color: "#5A5A54",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {statsLine || "Arquivo de performance"}
          </p>
        </div>
      </div>
    ),
    { ...size }
  )
}
