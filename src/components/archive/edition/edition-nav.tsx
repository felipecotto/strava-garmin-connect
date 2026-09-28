import Link from "next/link"
import type { ReactNode } from "react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import { EDITION_ANCHORS } from "./anchors"
import { EditionMobileMenu } from "./edition-mobile-menu"
import { EditionContainer } from "./section"

export function EditionNav({ actions }: { actions?: ReactNode }) {
  return (
    <header className="border-b border-border">
      <EditionContainer className="flex items-center justify-between gap-4 py-5">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="text-[26px] leading-none font-black tracking-[-0.01em] [font-stretch:70%]">CTT</span>
          <span className="hidden font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase sm:inline">
            Arquivo de corrida
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-6">
          <NavigationMenu aria-label="Seções" className="hidden md:flex">
            <NavigationMenuList className="gap-6">
              {EDITION_ANCHORS.map((anchor) => (
                <NavigationMenuItem key={anchor.href}>
                  <NavigationMenuLink
                    href={anchor.href}
                    className="p-0 font-mono text-xs tracking-[0.06em] text-ink-2 uppercase transition-colors duration-150 hover:bg-transparent hover:text-foreground focus:bg-transparent"
                  >
                    {anchor.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          {actions}
          <EditionMobileMenu />
        </div>
      </EditionContainer>
    </header>
  )
}
