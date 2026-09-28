"use client"

import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { EDITION_ANCHORS, type EditionAnchor } from "./anchors"

export function EditionMobileMenu({ anchors = EDITION_ANCHORS }: { anchors?: EditionAnchor[] }) {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Abrir seções" className="md:hidden" />}
      >
        <Menu aria-hidden />
      </SheetTrigger>
      <SheetContent side="right" className="bg-background text-foreground">
        <SheetHeader>
          <SheetTitle className="type-label text-muted-foreground">Seções</SheetTitle>
        </SheetHeader>
        <nav aria-label="Seções" className="flex flex-col px-4">
          {anchors.map((anchor) => (
            <SheetClose
              key={anchor.href}
              render={<a href={anchor.href} />}
              className="type-subtitle border-t border-border py-4"
            >
              {anchor.label}
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
