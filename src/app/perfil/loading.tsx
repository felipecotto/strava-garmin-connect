import { Skeleton } from "@/components/ui/skeleton"

const FIELD_PLACEHOLDERS = 4

export default function SettingsLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando configurações"
      className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-8"
    >
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-4 h-12 w-2/3" />
      <div className="mt-10 space-y-6 rounded-lg border p-6">
        {Array.from({ length: FIELD_PLACEHOLDERS }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
