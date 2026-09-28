"use client"

import { Check, Share2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

const COPIED_FEEDBACK_MS = 1800

/** Usa o compartilhamento nativo quando existe (celular); senão copia o link. */
export function ShareButton({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = `${window.location.origin}${path}`
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // Cancelar o menu nativo não é erro.
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button type="button" variant="outline" onClick={handleShare}>
      {copied ? <Check aria-hidden /> : <Share2 aria-hidden />}
      {copied ? "Link copiado" : "Compartilhar"}
    </Button>
  )
}
