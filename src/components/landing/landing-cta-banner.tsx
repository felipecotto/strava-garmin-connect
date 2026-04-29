import Link from "next/link"

import { siteConfig } from "@/config/site"

export function LandingCtaBanner() {
  return (
    <section className="bg-[#E8450A] py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-white/60">
          Pronto para começar?
        </p>
        <h2 className="mt-4 text-[clamp(2rem,3.5vw,2.25rem)] font-semibold tracking-tight text-white">
          Conecte e veja seus dados em 30 segundos.
        </h2>
        <p className="mt-3 text-base text-white/75">
          Sem formulário. Sem email. Só autorize o Strava.
        </p>
        <Link
          href={siteConfig.connectStravaPath}
          className="mt-8 inline-flex h-11 items-center gap-2.5 rounded-lg bg-white px-6 text-sm font-semibold text-[#E8450A] shadow-sm transition-[background-color,transform] duration-150 hover:bg-slate-50 active:scale-95"
        >
          <svg
            viewBox="0 0 16 16"
            className="size-3.5 shrink-0 fill-current"
            aria-hidden
          >
            <path d="M8 1.2 5.1 7h1.95L8 5.25 8.95 7h1.95L8 1.2Zm3.25 6.8L8 14.8 4.75 8h1.9L8 10.95 9.35 8h1.9Z" />
          </svg>
          Conectar com Strava — gratuito
        </Link>
      </div>
    </section>
  )
}
