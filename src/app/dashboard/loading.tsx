import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-3 w-24 bg-[var(--line)]" />
        <Skeleton className="h-8 w-56 bg-[var(--line)]" />
        <Skeleton className="h-4 w-80 max-w-full bg-[var(--line)]" />
      </div>

      <div className="grid gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`stat-skeleton-${index}`} className="bg-[var(--bg)] p-5">
            <Skeleton className="h-3 w-20 bg-[var(--line)]" />
            <Skeleton className="mt-4 h-8 w-24 bg-[var(--line)]" />
          </div>
        ))}
      </div>

      <div className="mt-10 border border-[var(--line)]">
        <div className="border-b border-[var(--line)] px-4 py-3">
          <Skeleton className="h-3 w-32 bg-[var(--line)]" />
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`row-skeleton-${index}`}
            className="border-b border-[var(--line)] px-4 py-3 last:border-b-0"
          >
            <div className="grid grid-cols-[1fr_auto_auto] gap-3">
              <Skeleton className="h-4 w-40 max-w-full bg-[var(--line)]" />
              <Skeleton className="h-4 w-14 bg-[var(--line)]" />
              <Skeleton className="h-4 w-16 bg-[var(--line)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
