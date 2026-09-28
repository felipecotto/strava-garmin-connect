import { formatKm, formatNumber } from "@/lib/archive/format"
import type { ArchiveData } from "@/lib/archive/types"

type TickerProps = Pick<ArchiveData, "totals" | "races">

function tickerItems({ totals, races }: TickerProps): string[] {
  const marathons = races.filter((race) => race.label === "42K").length
  return [
    `${formatKm(totals.km, 0)} km`,
    `${formatNumber(totals.runs)} corridas`,
    `${formatNumber(Math.round(totals.hours))} horas`,
    totals.elevationM > 0 ? `${formatNumber(totals.elevationM)} m de subida` : null,
    marathons > 0 ? `${marathons} ${marathons === 1 ? "maratona" : "maratonas"}` : null,
    totals.firstRunYear ? `Desde ${totals.firstRunYear}` : null,
  ].filter((item): item is string => item !== null)
}

/** Faixa em ultramar com os totais, rolando em loop lento (para no hover e com movimento reduzido). */
export function Ticker(props: TickerProps) {
  const items = tickerItems(props)
  if (items.length === 0) return null
  const sequence = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {[...items, ...items].map((item, index) => (
        <li key={`${item}-${index}`} className="type-label flex items-center gap-7 pr-7 whitespace-nowrap text-white">
          {item}
          <span aria-hidden>●</span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="overflow-hidden bg-signal py-3.5" role="region" aria-label="Totais do arquivo">
      <div className="animate-ticker flex w-max">
        {sequence(false)}
        {sequence(true)}
      </div>
    </div>
  )
}
