"use client"

import { useActionState, useState } from "react"
import Link from "next/link"

import {
  updateProfileSettings,
  type UpdateSettingsResult,
} from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig } from "@/config/site"
import type { ProfileRow } from "@/lib/supabase/types"

const initialState: UpdateSettingsResult | null = null

function SettingSwitch({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  )
}

export function SettingsForm({ profile }: { profile: ProfileRow }) {
  const [isPublic, setIsPublic] = useState(profile.is_public)
  const [showNames, setShowNames] = useState(profile.show_activity_names)

  const [state, formAction, pending] = useActionState(
    async (
      _prev: UpdateSettingsResult | null,
      formData: FormData
    ): Promise<UpdateSettingsResult> => {
      formData.set("is_public", isPublic ? "true" : "false")
      formData.set("show_activity_names", showNames ? "true" : "false")
      return updateProfileSettings(formData)
    },
    initialState
  )

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="slug">Endereço</Label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">{siteConfig.domain}/</span>
          <Input
            id="slug"
            name="slug"
            defaultValue={profile.slug}
            required
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?"
            className="font-mono"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Letras minúsculas, números e hífen, de 3 a 30 caracteres.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio ?? ""}
          maxLength={280}
          rows={4}
          placeholder="Uma linha sobre a sua corrida"
        />
        <p className="text-xs text-muted-foreground">
          Aparece no topo do arquivo, no lugar do texto padrão. Até 280 caracteres.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-4">
        <SettingSwitch
          label="Arquivo público"
          description={`Desligado, ${siteConfig.domain}/${profile.slug} só abre para você.`}
          checked={isPublic}
          onCheckedChange={setIsPublic}
        />
        <Separator />
        <SettingSwitch
          label="Mostrar nomes das atividades"
          description="Nos recordes, mostra o título que a corrida tem no Strava."
          checked={showNames}
          onCheckedChange={setShowNames}
        />
      </div>

      {state?.ok === false ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      {state?.ok === true ? (
        <p className="text-sm text-ink-2" role="status">
          Salvo.{" "}
          <Link href={`/${state.slug}`} className="font-medium text-foreground underline-offset-4 hover:underline">
            Ver arquivo
          </Link>
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando…" : "Salvar"}
      </Button>
    </form>
  )
}
