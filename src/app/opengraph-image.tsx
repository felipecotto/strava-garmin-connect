import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpengraphImage() {
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
          background:
            "linear-gradient(160deg, #E8450A 0%, #C73D09 38%, #FFF0EB 100%)",
          color: "#0f172a",
          fontFamily: "Geist, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 16,
            padding: "10px 18px",
            width: "fit-content",
            color: "#E8450A",
          }}
        >
          CTT.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p
            style={{
              fontSize: 62,
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Cotto Training Tracker
          </p>
          <p style={{ fontSize: 30, margin: 0, maxWidth: 980, lineHeight: 1.3 }}>
            Plataforma de análise de performance multiesporte com clareza e
            precisão para decisões de treino.
          </p>
          <p style={{ fontSize: 24, margin: 0, opacity: 0.85 }}>usectt.com.br</p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
