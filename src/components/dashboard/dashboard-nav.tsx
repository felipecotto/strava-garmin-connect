"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Menu, User } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Início", icon: LayoutGrid },
  { href: "/dashboard/profile", label: "Perfil", icon: User },
] as const

function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col gap-1 md:flex-row md:items-center", className)}>
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-bold tracking-tighter text-foreground"
          >
            CTT.
          </Link>
          <span className="hidden text-muted-foreground md:inline">/</span>
          <span className="hidden text-sm text-muted-foreground md:inline">
            Dashboard
          </span>
        </div>

        <NavLinks className="hidden md:flex" />

        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger
              aria-label="Abrir menu"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon-sm" })
              )}
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <NavLinks className="mt-6" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
