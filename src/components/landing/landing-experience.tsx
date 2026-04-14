import { BookOpen, LayoutDashboard, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const steps = [
  {
    icon: LayoutDashboard,
    title: "Home do dashboard",
    body: "Resumo semanal, métricas-chave e faixa de insights gerada a partir dos seus treinos.",
  },
  {
    icon: Sparkles,
    title: "Leitura orientada",
    body: "Cards explicam o “porquê” por trás dos números — ponte entre dados brutos e próximo passo de treino.",
  },
  {
    icon: BookOpen,
    title: "Design system vivo",
    body: "Componentes shadcn/ui documentados no Storybook: base para escalar UI com revisão e acessibilidade.",
  },
] as const

export function LandingExperience() {
  return (
    <section
      id="experiencia"
      className="scroll-mt-20 border-b border-border/60 bg-muted/30 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <Badge variant="secondary">Experiência no app</Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Da conexão ao insight
            </h2>
            <p className="text-lg text-muted-foreground">
              O fluxo foi desenhado para mostrar gestão de produto ponta a
              ponta: proposta de valor, navegação e superfície de dados coesa.
            </p>
          </div>
        </div>
        <Separator className="my-10" />
        <ol className="grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <step.icon className="size-8 text-primary" aria-hidden />
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
