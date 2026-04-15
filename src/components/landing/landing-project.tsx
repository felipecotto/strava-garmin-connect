import { Layers, LineChart, Shield } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { siteConfig } from "@/config/site"

const pillars = [
  {
    icon: Layers,
    title: "Visão de produto",
    text: "Landing clara, jornada de valor e dashboard orientado a decisões — não só gráficos, mas leitura do que importa para o corredor.",
  },
  {
    icon: LineChart,
    title: "Insights acionáveis",
    text: "Volume, consistência e sinais de fadiga traduzidos em linguagem simples, prontos para ajustar carga e técnica.",
  },
  {
    icon: Shield,
    title: "Privacidade em mente",
    text: "Escopo mínimo de permissões na API e transparência sobre o que é exibido — base para evoluir com backend real.",
  },
] as const

export function LandingProject() {
  return (
    <section
      id="projeto"
      className="scroll-mt-20 border-b border-border/80 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-6">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-[clamp(2rem,3vw,2.25rem)] font-medium tracking-tight text-slate-950">
            O que é o {siteConfig.name}
          </h2>
          <p className="text-lg text-slate-600">
            Um estudo de caso de produto digital para corredores: conectar dados
            do Strava, consolidar sinais de treino e apoiar decisões semana a
            semana — com interface consistente e componentes documentados.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map((item) => (
            <Card
              key={item.title}
              className="glass-panel luxury-enter border-slate-200/60 shadow-[0_6px_30px_-24px_rgba(2,6,23,0.3)] transition-all duration-200 hover:border-[#E8450A]/30 hover:shadow-sm"
            >
              <CardHeader>
                <item.icon
                  className="mb-2 size-8 text-[#0F6E56]"
                  aria-hidden
                />
                <CardTitle className="text-lg text-slate-900">{item.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed text-slate-600">
                  {item.text}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
