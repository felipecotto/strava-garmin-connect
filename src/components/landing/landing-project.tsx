import {
  AlignJustify,
  BarChart3,
  Clock,
  Lock,
  Star,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"

const features = [
  {
    icon: BarChart3,
    title: "Carga semanal",
    description:
      "Quantos km você fez, quanto tempo se moveu e quanto subiu — comparado com sua meta semanal.",
    featured: true,
  },
  {
    icon: Clock,
    title: "Objetivo com contagem regressiva",
    description:
      "Defina sua prova, veja os dias restantes e a fase atual do treino — Construção, Polimento ou Pico.",
    featured: false,
  },
  {
    icon: Zap,
    title: "Insights automáticos",
    description:
      "Volume aumentou? Ritmo caiu? O CTT detecta padrões e explica em linguagem simples, não em números brutos.",
    featured: false,
  },
  {
    icon: AlignJustify,
    title: "Feed de atividades",
    description:
      "Todas as suas corridas com pace, distância e duração. Com gráfico de barras por volume para leitura rápida.",
    featured: false,
  },
  {
    icon: Star,
    title: "Última corrida em destaque",
    description:
      "A corrida mais recente com pace médio, tempo em movimento e comparação com a média do período.",
    featured: false,
  },
  {
    icon: Lock,
    title: "Privacidade primeiro",
    description:
      "Permissão mínima de leitura. O CTT nunca escreve, apaga ou compartilha seus dados do Strava.",
    featured: false,
  },
] as const

export function LandingProject() {
  return (
    <section
      id="projeto"
      className="scroll-mt-20 border-b border-border/80 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="max-w-2xl space-y-4">
          <h2 className="text-[clamp(2rem,3vw,2.25rem)] font-semibold tracking-tight text-slate-950">
            O que você vê quando conecta
          </h2>
          <p className="text-lg text-slate-600">
            Não são só gráficos. São respostas para as perguntas que você faz
            depois de cada semana de treino.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <div
              key={item.title}
              className={cn(
                "flex flex-col gap-4 rounded-2xl border p-6 transition-all duration-200",
                item.featured
                  ? "border-[#E8450A] bg-[#E8450A] text-white hover:bg-[#C73D09]"
                  : "border-slate-200/70 bg-white hover:border-[#E8450A]/30 hover:shadow-sm"
              )}
            >
              <item.icon
                className={cn(
                  "size-6 shrink-0",
                  item.featured ? "text-white/80" : "text-[#E8450A]"
                )}
                aria-hidden
              />
              <div className="space-y-1.5">
                <h3
                  className={cn(
                    "text-base font-semibold",
                    item.featured ? "text-white" : "text-slate-900"
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    item.featured ? "text-white/80" : "text-slate-600"
                  )}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
