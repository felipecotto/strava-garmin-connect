import Link from "next/link"
import type { ReactNode } from "react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import { EDITION_ANCHORS, type EditionAnchor } from "./anchors"
import { EditionMobileMenu } from "./edition-mobile-menu"
import { ReadingProgress } from "./reading-progress"
import { EditionContainer } from "./section"

/** `showSections` desliga as âncoras em páginas que não são a edição (ex.: configurações). */
export function EditionNav({
  actions,
  showSections = true,
  anchors = EDITION_ANCHORS,
}: {
  actions?: ReactNode
  showSections?: boolean
  anchors?: EditionAnchor[]
}) {
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <EditionContainer className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="font-[family-name:var(--font-display)] text-[28px] leading-none font-black">CTT</span>
          <span className="type-label hidden text-muted-foreground sm:inline">Arquivo de corrida</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-6">
          {showSections ? (
            <NavigationMenu aria-label="Capítulos" className="hidden md:flex">
              <NavigationMenuList className="gap-5">
                {anchors.map((anchor) => (
                  <NavigationMenuItem key={anchor.href}>
                    <NavigationMenuLink
                      href={anchor.href}
                      className="type-label p-0 text-ink-2 transition-colors duration-150 hover:bg-transparent hover:text-foreground focus:bg-transparent"
                    >
                      {anchor.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          ) : null}
          {showSections ? <ReadingProgress /> : null}
          {actions}
          {showSections ? <EditionMobileMenu anchors={anchors} /> : null}
        </div>
      </EditionContainer>
    </header>
  )
}
