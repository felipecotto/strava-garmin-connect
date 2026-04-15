"use client"

import type { ReactNode } from "react"
import type { logoutStrava } from "@/app/actions/strava"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type RevokeAction = typeof logoutStrava

export function StravaRevokeAccessDialog({
  action,
  triggerLabel = "Revogar Acesso",
}: {
  action: RevokeAction
  triggerLabel?: ReactNode
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" className="w-full" />}>
        {triggerLabel}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revogar acesso ao Strava?</AlertDialogTitle>
          <AlertDialogDescription>
            Vamos desconectar sua conta do CTT., revogar o token na API do Strava
            e limpar a sessão local deste navegador.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={action}>
            <AlertDialogAction type="submit">Revogar Acesso</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
