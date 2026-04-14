"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ConnectedBanner() {
  const searchParams = useSearchParams()
  const fromOAuth = searchParams.get("connected") === "1"
  const [dismissed, setDismissed] = useState(false)
  const open = fromOAuth && !dismissed

  if (!open) {
    return null
  }

  return (
    <div className="border-b border-border/60 bg-primary/10 px-4 py-3 text-sm text-foreground sm:px-6">
      <div className="mx-auto flex max-w-6xl items-start justify-between gap-4">
        <p>
          <span className="font-medium">Strava conectado.</span> Os dados do
          dashboard vêm da API conforme as permissões que você autorizou.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          onClick={() => setDismissed(true)}
          aria-label="Fechar aviso"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
