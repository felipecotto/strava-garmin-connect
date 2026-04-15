import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { MonitoringProvider } from "@/components/analytics/monitoring-provider"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://usectt.com.br"),
  title: {
    default: "CTT — Cotto Training Tracker",
    template: "%s | CTT — Cotto Training Tracker",
  },
  description:
    "Plataforma de análise de performance multiesporte. Transforme dados do Strava em decisões de treino com clareza e precisão.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://usectt.com.br",
    siteName: "CTT — Cotto Training Tracker",
    title: "CTT — Cotto Training Tracker",
    description:
      "Plataforma de análise de performance multiesporte. Transforme dados do Strava em decisões de treino com clareza e precisão.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CTT — Cotto Training Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CTT — Cotto Training Tracker",
    description:
      "Plataforma de análise de performance multiesporte. Transforme dados do Strava em decisões de treino com clareza e precisão.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <MonitoringProvider />
        {children}
      </body>
    </html>
  )
}
