import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google"

import { MonitoringProvider } from "@/components/analytics/monitoring-provider"
import { GrainOverlay } from "@/components/ui/atmosphere"

import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
})

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
})

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.usectt.com.br"),
  title: {
    default: "CTT — Arquivo de Performance",
    template: "%s | CTT",
  },
  description:
    "Sem feed. Sem ranking. Sem frase de efeito. Só o histórico — pace, volume, frequência — do jeito que aconteceu.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.usectt.com.br",
    siteName: "CTT",
    title: "CTT — Arquivo de Performance",
    description:
      "Sem feed. Sem ranking. Sem frase de efeito. Só o histórico — pace, volume, frequência — do jeito que aconteceu.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CTT — Arquivo de Performance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CTT — Arquivo de Performance",
    description:
      "Sem feed. Sem ranking. Sem frase de efeito. Só o histórico — pace, volume, frequência — do jeito que aconteceu.",
    images: ["/opengraph-image"],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <GrainOverlay />
        <MonitoringProvider />
        {children}
      </body>
    </html>
  )
}
