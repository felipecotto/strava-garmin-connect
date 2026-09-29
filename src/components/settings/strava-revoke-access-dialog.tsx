"use client"

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

export function StravaRevokeAccessDialog({ action }: { action: typeof logoutStrava }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" className="w-full" />}>
        Desconectar Strava
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desconectar o Strava?</AlertDialogTitle>
          <AlertDialogDescription>
            O CTT revoga o acesso na API do Strava e encerra a sessão neste navegador.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={action}>
            <AlertDialogAction type="submit">Desconectar</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
