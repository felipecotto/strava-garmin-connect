"use client"

import { useState } from "react"
import { Check, Link2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ProfileShareButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${path}` : path
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="font-mono text-[11px] uppercase tracking-[0.12em]"
    >
      {copied ? (
        <>
          <Check className="size-3.5" />
          Copiado
        </>
      ) : (
        <>
          <Link2 className="size-3.5" />
          Share
        </>
      )}
    </Button>
  )
}
