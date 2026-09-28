import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function EditionContainer({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  )
}

export function MonoLabel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <p className={cn("type-label text-muted-foreground", className)}>{children}</p>
}

type EditionSectionProps = {
  id?: string
  label: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

export function EditionSection({
  id,
  label,
  title,
  description,
  children,
}: EditionSectionProps) {
  return (
    <section id={id} className="scroll-mt-4 border-t border-border py-14 md:py-28">
      <EditionContainer>
        <header className="mb-7 grid gap-5 md:mb-12 min-[860px]:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] min-[860px]:items-end lg:gap-16">
          <div>
            <MonoLabel>{label}</MonoLabel>
            <h2 className="type-headline mt-2.5 text-balance">{title}</h2>
          </div>
          {description ? <p className="max-w-[56ch] text-ink-2">{description}</p> : null}
        </header>
        {children}
      </EditionContainer>
    </section>
  )
}

export function FinePrint({ children }: { children: ReactNode }) {
  return <p className="mt-4.5 max-w-[70ch] text-[13px] text-muted-foreground">{children}</p>
}
