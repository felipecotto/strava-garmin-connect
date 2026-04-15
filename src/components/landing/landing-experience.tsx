import { BookMarked, Orbit, PanelsTopLeft } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const steps = [
  {
    icon: PanelsTopLeft,
    title: "Home do dashboard",
    body: "Resumo semanal, métricas-chave e faixa de insights gerada a partir dos seus treinos.",
  },
  {
    icon: Orbit,
    title: "Leitura orientada",
    body: "Cards explicam o “porquê” por trás dos números — ponte entre dados brutos e próximo passo de treino.",
  },
  {
    icon: BookMarked,
    title: "Design system vivo",
    body: "Componentes shadcn/ui documentados no Storybook: base para escalar UI com revisão e acessibilidade.",
  },
] as const

export function LandingExperience() {
  return (
    <section
      id="experiencia"
      className="scroll-mt-20 border-b border-border/80 bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <Badge
              variant="outline"
              className="border-transparent bg-[#FFF0EB] font-mono tracking-tighter text-[#C73D09]"
            >
              Atributos do App
            </Badge>
            <h2 className="text-[clamp(2rem,3vw,2.25rem)] font-medium tracking-tight text-slate-950">
              Da conexão ao insight
            </h2>
            <p className="text-lg text-slate-600">
              O fluxo foi desenhado para mostrar gestão de produto ponta a
              ponta: proposta de valor, navegação e superfície de dados coesa.
            </p>
          </div>
        </div>
        <Separator className="my-10" />
        <ol className="grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="glass-panel luxury-enter relative flex flex-col gap-3 rounded-xl border-slate-200/60 p-5 shadow-[0_8px_35px_-28px_rgba(2,6,23,0.25)] transition-all duration-200 hover:border-[#E8450A]/30 hover:shadow-sm"
            >
              <span className="font-mono text-xs font-medium tracking-tighter text-slate-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <step.icon className="size-8 text-[#0F6E56]" aria-hidden />
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="leading-relaxed text-slate-600">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
