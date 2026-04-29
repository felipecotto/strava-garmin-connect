import { Quote } from "lucide-react"

import { cn } from "@/lib/utils"

const testimonials = [
  {
    quote:
      "Finalmente entendo se estou treinando demais ou de menos.",
    author: "Corredor de rua",
    location: "SP",
    volume: "45 km/semana",
  },
  {
    quote:
      "O objetivo com contagem regressiva me mantém focado na maratona de junho.",
    author: "Corredor amador",
    location: "RJ",
    volume: "60 km/semana",
  },
  {
    quote:
      "Os insights me fizeram perceber que meu pace caiu nas últimas 2 semanas. Ajustei o treino.",
    author: "Trail runner",
    location: "MG",
    volume: "35 km/semana",
  },
] as const

export function LandingExperience() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 border-b border-border/80 bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="max-w-2xl space-y-3">
          <h2 className="text-[clamp(2rem,3vw,2.25rem)] font-semibold tracking-tight text-slate-950">
            Feito para corredores que levam o treino a sério
          </h2>
          <p className="text-lg text-slate-600">
            Não importa se você corre 20 km ou 100 km por semana.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-5 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_4px_24px_-16px_rgba(2,6,23,0.15)]"
            >
              <Quote
                className="size-5 shrink-0 text-[#E8450A]/40"
                aria-hidden
              />
              <p className="flex-1 text-base leading-relaxed text-slate-700">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm font-medium text-slate-900">
                  {item.author}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.location} · {item.volume}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof footer */}
        <p className="mt-10 text-center text-sm text-muted-foreground">
          847 atletas já conectaram · Gratuito · Sem cadastro
        </p>
      </div>
    </section>
  )
}
