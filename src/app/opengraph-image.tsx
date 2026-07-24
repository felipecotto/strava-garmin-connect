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
          background: "#FAFAF8",
          color: "#131311",
          fontFamily: "system-ui, sans-serif",
          borderBottom: "8px solid #E8450A",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 22,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8A8A82",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <div style={{ width: 8, height: 8, background: "#E8450A" }} />
          CTT — Arquivo de Performance
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <p
            style={{
              fontSize: 64,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              maxWidth: 980,
              textTransform: "uppercase",
            }}
          >
            O que você treinou, fica registrado.
          </p>
          <p
            style={{
              fontSize: 24,
              margin: 0,
              color: "#5A5A54",
              maxWidth: 860,
              lineHeight: 1.4,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Sem feed. Sem ranking. Só o histórico.
          </p>
        </div>
      </div>
    ),
    { ...size }
  )
}
