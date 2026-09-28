import { Skeleton } from "@/components/ui/skeleton"

const FIELD_PLACEHOLDERS = 3

export function SettingsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando configurações"
      className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"
    >
      <div className="space-y-6 rounded-lg border border-border p-6">
        {Array.from({ length: FIELD_PLACEHOLDERS }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-lg border border-border p-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-11 w-full rounded-full" />
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  )
}
