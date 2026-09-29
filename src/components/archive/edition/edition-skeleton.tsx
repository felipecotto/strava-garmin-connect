import { Skeleton } from "@/components/ui/skeleton"

const METRIC_PLACEHOLDERS = 4
const WEEK_BAR_PLACEHOLDERS = 40

/** Estado de carregamento da edição: mesma grade do hero e do odômetro. */
export function EditionSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando arquivo"
      className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-12"
    >
      <div className="flex h-16 items-center justify-between border-b">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-11 w-36 rounded-full" />
      </div>

      <div className="py-14 md:py-20">
        <Skeleton className="h-3 w-56" />
        <Skeleton className="mt-6 h-16 w-3/4 md:h-24" />
        <Skeleton className="mt-6 h-4 w-full max-w-xl" />
        <Skeleton className="mt-2 h-4 w-2/3 max-w-md" />
      </div>

      <div className="border-t border-foreground pt-8">
        <Skeleton className="h-24 w-2/3 md:h-40" />
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {Array.from({ length: METRIC_PLACEHOLDERS }, (_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
        <div className="mt-10 flex h-24 items-end gap-1">
          {Array.from({ length: WEEK_BAR_PLACEHOLDERS }, (_, index) => (
            <Skeleton
              key={index}
              className="flex-1 rounded-b-none rounded-t-[3px]"
              style={{ height: `${30 + ((index * 37) % 70)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
