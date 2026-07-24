import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export default function PublicProfileNotFound() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-6 px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--label)]">
        404
      </p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-[var(--ink)]">
        Arquivo não encontrado
      </h1>
      <p className="text-[var(--ink-soft)]">
        Esse slug não existe ou o arquivo não é público.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={cn(buttonVariants())}>
          {siteConfig.name}
        </Link>
        <Link
          href={siteConfig.connectStravaPath}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Conectar Strava
        </Link>
      </div>
    </div>
  )
}
