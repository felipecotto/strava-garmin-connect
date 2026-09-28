import Link from "next/link"

import { ConnectStravaLink } from "@/components/archive/edition/closing-sections"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ArchiveNotFound() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-6 px-4 py-24 sm:px-6">
      <p className="type-label text-muted-foreground">404</p>
      <h1 className="type-headline text-balance">Arquivo não encontrado.</h1>
      <p className="text-ink-2">Esse endereço não existe ou o arquivo não é público.</p>
      <div className="flex flex-wrap items-center gap-3">
        <ConnectStravaLink />
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Ver o exemplo
        </Link>
      </div>
    </main>
  )
}
