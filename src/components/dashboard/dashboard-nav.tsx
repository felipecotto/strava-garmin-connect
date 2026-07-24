"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

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
  { href: "/dashboard", label: "Arquivo" },
  { href: "/dashboard/profile", label: "Conta" },
  { href: "/dashboard/settings", label: "Settings" },
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
    <nav
      className={cn(
        "flex flex-col gap-1 md:flex-row md:items-center md:gap-6",
        className
      )}
    >
      {links.map(({ href, label }) => {
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
              "font-mono text-[13px] transition-colors",
              active
                ? "text-[var(--ink)]"
                : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color-mix(in_srgb,var(--line)_55%,transparent)] bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-mono text-[15px] font-bold tracking-tight text-[var(--ink)]"
        >
          <span className="mr-2 inline-block size-[7px] rounded-[2px] bg-[var(--brand)] align-middle shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_55%,transparent)]" />
          CTT
        </Link>

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
            <SheetContent
              side="right"
              className="w-[min(100%,20rem)] border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_92%,white)]"
            >
              <SheetHeader>
                <SheetTitle className="font-heading">Menu</SheetTitle>
              </SheetHeader>
              <NavLinks className="mt-6" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
