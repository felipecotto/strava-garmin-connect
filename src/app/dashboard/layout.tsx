import type { Metadata } from "next"
import { Suspense } from "react"

import { ConnectedBanner } from "@/components/dashboard/connected-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-nav"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <Suspense fallback={null}>
        <ConnectedBanner />
      </Suspense>
      <main className="flex-1">{children}</main>
    </div>
  )
}
