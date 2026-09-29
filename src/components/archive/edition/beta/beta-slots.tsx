import { cookies } from "next/headers"
import { connection } from "next/server"

import type { WaitlistState } from "@/app/actions/beta"
import { Skeleton } from "@/components/ui/skeleton"
import { getBetaStatus, waitlistPosition } from "@/lib/beta/get-beta-status"
import { WAITLIST_COOKIE } from "@/lib/beta/state"

import { BetaPanel } from "./beta-panel"

/** Lê a contagem ao vivo e a inscrição do visitante; renderize dentro de <Suspense>. */
export async function BetaSlots() {
  await connection()
  const [status, store] = await Promise.all([getBetaStatus(), cookies()])
  const entryId = store.get(WAITLIST_COOKIE)?.value
  const position = entryId ? await waitlistPosition(entryId) : null
  const initial: WaitlistState =
    position !== null ? { status: "joined", email: "seu e-mail", position } : { status: "idle" }

  return <BetaPanel status={status} initial={initial} />
}

export function BetaSlotsSkeleton() {
  return (
    <div className="border-t border-foreground pt-5">
      <Skeleton className="h-4 w-48 rounded-none" />
      <div className="mt-5 grid grid-cols-10 gap-1.5">
        {Array.from({ length: 10 }, (_, index) => (
          <Skeleton key={index} className="aspect-[50/64] rounded-none" />
        ))}
      </div>
      <Skeleton className="mt-6 h-12 w-40 rounded-none" />
    </div>
  )
}
