import type { Metadata } from "next"
import { Archivo, Barlow_Condensed, Caveat, Geist_Mono } from "next/font/google"

import { MonitoringProvider } from "@/components/analytics/monitoring-provider"

import "./globals.css"

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
})

/** Display: números gigantes e títulos em caixa alta. */
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
})

/** Anotações à mão, no máximo quatro por página. */
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      className={`${archivo.variable} ${barlowCondensed.variable} ${caveat.variable} ${geistMono.variable} light h-full`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <MonitoringProvider />
        {children}
      </body>
    </html>
  )
}
