import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`stat-skeleton-${index}`}
            className="rounded-xl border border-border/70 bg-card/50 p-4"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-4 h-8 w-24" />
            <Skeleton className="mt-3 h-3 w-36" />
          </div>
        ))}
      </div>

      <section className="mt-14 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <div className="rounded-xl border border-border/70 bg-card/50 p-4">
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={`bar-skeleton-${index}`} className="h-28 w-full" />
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card/40">
          <div className="px-4 py-2">
            <Skeleton className="h-3 w-full" />
          </div>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`row-skeleton-${index}`} className="border-t border-border/60 px-4 py-3">
              <div className="grid grid-cols-[minmax(0,1.2fr)_auto_auto_auto] items-center gap-3">
                <div>
                  <Skeleton className="h-4 w-36 max-w-full" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-16 justify-self-end" />
                <Skeleton className="h-4 w-16 justify-self-end" />
                <Skeleton className="h-4 w-14 justify-self-end" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
