"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Activity, User, LogOut } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/activities", label: "Atividades", icon: Activity },
  { href: "/dashboard/profile", label: "Perfil", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-black/10 bg-white px-3 py-6">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-7 h-7 rounded-lg bg-[#0F6E56] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 12 L5 7 L9 9 L14 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-sm font-semibold text-[#0F6E56]">Pace</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[#0F6E56]/10 text-[#0F6E56] font-medium"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <a
        href="/api/auth/signout"
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
      >
        <LogOut size={16} />
        Sair
      </a>
    </aside>
  )
}
