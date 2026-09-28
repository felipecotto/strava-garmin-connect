import { unstable_rethrow } from "next/navigation"
import { ImageResponse } from "next/og"

import { formatKm, formatNumber, formatRaceTime } from "@/lib/archive/format"
import { getArchive } from "@/lib/archive/get-archive"
import { getProfileBySlug } from "@/lib/profile/get-profile"

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

  try {
    const profile = await getProfileBySlug(slug)
    if (profile?.is_public) {
      const { totals, records } = await getArchive(profile.id)
      const best5k = records.find((record) => record.key === "5k")
      displayName = profile.display_name
      statsLine = [
        `${formatKm(totals.km, 0)} km`,
        `${formatNumber(totals.runs)} corridas`,
        best5k ? `5K ${formatRaceTime(best5k.bestSec)}` : null,
      ]
        .filter(Boolean)
        .join("  ·  ")
      line = `/${profile.slug}`
    }
  } catch (error) {
    unstable_rethrow(error)
    // fallback visual abaixo
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
          background: "#F2F2EE",
          color: "#131311",
          fontFamily: "system-ui, sans-serif",
          borderBottom: "8px solid #2B34F5",
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
            <div style={{ width: 8, height: 8, background: "#2B34F5" }} />
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
