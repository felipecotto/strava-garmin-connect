import { auth, signIn } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6 max-w-sm text-center">

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F6E56] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12 L5 7 L9 9 L14 3" stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-medium text-[#0F6E56]">Pace</span>
        </div>

        <div>
          <h1 className="text-3xl font-medium tracking-tight mb-3">
            Entenda cada corrida.<br />
            <span className="text-[#0F6E56]">Evolua de verdade.</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Conecte sua conta Strava e veja seus dados de corrida em um dashboard limpo e inteligente.
          </p>
        </div>

        <form
          action={async () => {
            "use server"
            await signIn("strava", { redirectTo: "/dashboard" })
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#FC4C02] text-white text-sm font-medium px-5 py-3 rounded-lg hover:bg-[#e04400] transition-colors"
          >
            <span className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-xs font-bold">
              S
            </span>
            Conectar com Strava
          </button>
        </form>

      </div>
    </main>
  )
}