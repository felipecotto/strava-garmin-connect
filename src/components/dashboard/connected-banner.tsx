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
    <div className="border-b border-[var(--line)] bg-[var(--bg-alt)] px-4 py-3 text-sm text-[var(--ink)] sm:px-6">
      <div className="mx-auto flex max-w-6xl items-start justify-between gap-4">
        <p>
          <span className="font-heading font-semibold">Strava conectado.</span>{" "}
          <span className="text-[var(--ink-soft)]">
            Os dados vêm da API conforme as permissões autorizadas.
          </span>
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
