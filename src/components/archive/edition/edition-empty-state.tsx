import type { ProfileRow } from "@/lib/supabase/types"

import { ConnectStravaLink } from "./closing-sections"

const IN_PROGRESS_STATUSES: ProfileRow["sync_status"][] = ["pending", "syncing"]

export function EditionEmptyState({ syncStatus }: { syncStatus: ProfileRow["sync_status"] }) {
  const isImporting = IN_PROGRESS_STATUSES.includes(syncStatus)

  return (
    <div className="mt-10 border-t border-foreground pt-6 md:mt-18">
      <p className="type-headline text-balance">
        {isImporting ? "Importando os treinos do Strava." : "Nenhuma corrida neste arquivo ainda."}
      </p>
      <p className="mt-4 max-w-[52ch] text-ink-2">
        {isImporting
          ? "A primeira importação leva alguns minutos. Recarregue a página daqui a pouco."
          : "Assim que houver corridas no Strava, a edição monta o volume, a forma e os recordes. Se faltou algo, conecte de novo para reimportar."}
      </p>
      {isImporting ? null : (
        <div className="mt-6">
          <ConnectStravaLink />
        </div>
      )}
    </div>
  )
}
