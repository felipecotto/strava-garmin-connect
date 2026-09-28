import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { getStravaProfileData, logoutStrava } from "@/app/actions/strava"
import { ConnectStravaLink, EditionFooter } from "@/components/archive/edition/closing-sections"
import { EditionNav } from "@/components/archive/edition/edition-nav"
import { EditionContainer, MonoLabel } from "@/components/archive/edition/section"
import { ViewerNavActions } from "@/components/archive/edition/viewer-slots"
import { SettingsForm } from "@/components/settings/settings-form"
import { SettingsSkeleton } from "@/components/settings/settings-skeleton"
import { StravaRevokeAccessDialog } from "@/components/settings/strava-revoke-access-dialog"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatMonth } from "@/lib/archive/format"
import { getOwnerProfile } from "@/lib/profile/get-owner-profile"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Configurações",
  robots: { index: false, follow: false },
}

export default function SettingsPage() {
  return (
    <>
      <EditionNav
        showSections={false}
        actions={
          <Suspense fallback={<Skeleton className="h-9 w-36 rounded-full" />}>
            <ViewerNavActions />
          </Suspense>
        }
      />
      <main>
        <EditionContainer className="pt-10 pb-14 md:pt-22 md:pb-28">
          <MonoLabel>Configurações</MonoLabel>
          <h1 className="type-headline mt-2.5 text-balance">Seu arquivo</h1>
          <p className="mt-4 max-w-[56ch] text-ink-2">
            Endereço, bio, privacidade e a conexão com o Strava.
          </p>
          <Suspense fallback={<SettingsSkeleton />}>
            <SettingsPanel />
          </Suspense>
        </EditionContainer>
      </main>
      <EditionFooter />
    </>
  )
}

async function SettingsPanel() {
  const [profile, strava] = await Promise.all([getOwnerProfile(), getStravaProfileData()])

  if (!profile && strava.ok !== "success") {
    return (
      <div className="mt-10 border-t border-foreground pt-6">
        <p className="max-w-[52ch] text-ink-2">Conecte o Strava para configurar o seu arquivo.</p>
        <div className="mt-6">
          <ConnectStravaLink />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <Card className="gap-6 py-6">
        <CardHeader className="px-6">
          <CardTitle>Arquivo</CardTitle>
          <CardDescription>Como o seu arquivo aparece para quem recebe o link.</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          {profile ? (
            <SettingsForm profile={profile} />
          ) : (
            <p className="text-sm text-ink-2">
              O perfil ainda não foi criado. Conecte o Strava de novo para criá-lo.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="gap-6 py-6">
        <CardHeader className="px-6">
          <CardTitle>Conta Strava</CardTitle>
          {strava.ok === "success" ? (
            <CardDescription>
              {strava.athlete.firstname} {strava.athlete.lastname}
              {strava.athlete.username ? ` · @${strava.athlete.username}` : null}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3 px-6">
          {strava.ok === "success" ? (
            <MonoLabel>No Strava desde {formatMonth(strava.athlete.created_at.slice(0, 7))}</MonoLabel>
          ) : strava.ok === "error" ? (
            <p className="text-sm text-destructive">{strava.message}</p>
          ) : null}
          {profile ? (
            <Link href={`/${profile.slug}`} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              Ver meu arquivo
            </Link>
          ) : null}
          <StravaRevokeAccessDialog action={logoutStrava} />
        </CardContent>
      </Card>
    </div>
  )
}
