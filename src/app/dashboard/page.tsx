import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f1efe8]">
      <div className="bg-white border border-black/10 rounded-2xl p-8 flex flex-col gap-4 max-w-sm w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0F6E56] flex items-center justify-center text-white font-medium">
            {session.user?.name?.[0] ?? "?"}
          </div>
          <div>
            <p className="font-medium text-sm">{session.user?.name}</p>
            <p className="text-xs text-muted-foreground">Strava conectado</p>
          </div>
        </div>
        <div className="h-px bg-black/10" />
        <p className="text-sm text-muted-foreground">
          Auth funcionando. Dashboard em construção.
        </p>
      </div>
    </main>
  )
}