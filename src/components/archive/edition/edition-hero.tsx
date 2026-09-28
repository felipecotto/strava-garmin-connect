import type { ReactNode } from "react"

import { MonoLabel } from "./section"

type EditionHeroProps = {
  label: string
  title: ReactNode
  lede: string
  actions?: ReactNode
  badge?: ReactNode
}

export function EditionHero({ label, title, lede, actions, badge }: EditionHeroProps) {
  return (
    <div className="grid gap-6 min-[860px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[860px]:items-end lg:gap-18">
      <div>
        {badge ? <div className="mb-4">{badge}</div> : null}
        <MonoLabel>{label}</MonoLabel>
        <h1 className="type-display mt-3.5 text-balance">{title}</h1>
      </div>
      <div>
        <p className="mb-6 max-w-[44ch] text-lg text-ink-2">{lede}</p>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  )
}
