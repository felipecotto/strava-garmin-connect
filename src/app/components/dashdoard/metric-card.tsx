interface MetricCardProps {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
}

export function MetricCard({ label, value, sub, icon }: MetricCardProps) {
  return (
    <div className="bg-white border border-black/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-neutral-300">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight text-neutral-900">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  )
}
