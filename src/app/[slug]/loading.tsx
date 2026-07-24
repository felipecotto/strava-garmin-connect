export default function PublicProfileLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="h-10 w-full animate-pulse border-b border-border/80" />
      <div className="mt-10 space-y-4">
        <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
        <div className="h-10 w-64 animate-pulse bg-muted" />
        <div className="h-4 w-40 animate-pulse bg-muted" />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-px border border-border/80 bg-border/80 sm:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse bg-background" />
        ))}
      </div>
    </div>
  )
}
