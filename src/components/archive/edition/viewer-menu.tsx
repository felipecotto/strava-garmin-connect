"use client"

import Link from "next/link"
import { useTransition } from "react"

import { logoutStrava } from "@/app/actions/strava"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { siteConfig } from "@/config/site"

export type ViewerSummary = {
  slug: string
  displayName: string
  avatarUrl: string | null
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function ViewerMenu({ viewer }: { viewer: ViewerSummary }) {
  const [isLoggingOut, startLogout] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Menu de ${viewer.displayName}`}
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <Avatar>
          {viewer.avatarUrl ? <AvatarImage src={viewer.avatarUrl} alt="" /> : null}
          <AvatarFallback className="font-mono text-xs">{initials(viewer.displayName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-popover-foreground/70">{viewer.displayName}</DropdownMenuLabel>
          <DropdownMenuItem render={<Link href={`/${viewer.slug}`} />}>Meu arquivo</DropdownMenuItem>
          <DropdownMenuItem render={<Link href={siteConfig.settingsPath} />}>Configurações</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isLoggingOut}
          onClick={() => startLogout(() => logoutStrava())}
        >
          {isLoggingOut ? "Saindo…" : "Sair"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
