import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pace",
  description: "Entenda cada corrida. Evolua de verdade.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
