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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { ProfileRow } from "@/lib/supabase/types"

const initialState: UpdateSettingsResult | null = null

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
    <form action={formAction} className="max-w-xl space-y-8">
      <div className="space-y-2">
        <Label htmlFor="slug">Slug público</Label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-[var(--label)]">/</span>
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
        <p className="text-xs text-[var(--label)]">
          URL: usectt.com.br/
          <span className="font-mono">{profile.slug}</span>
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
          placeholder="Uma linha sobre sua corrida..."
        />
        <p className="text-xs text-[var(--label)]">Até 280 caracteres.</p>
      </div>

      <div className="space-y-4 surface-soft rounded-3xl p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--ink)]">
              Arquivo público
            </p>
            <p className="text-xs text-[var(--label)]">
              Se desligado, /{profile.slug} retorna 404.
            </p>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={setIsPublic}
            aria-label="Arquivo público"
          />
        </div>

        <div className="h-px bg-[var(--line)]" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--ink)]">
              Mostrar nomes das atividades
            </p>
            <p className="text-xs text-[var(--label)]">
              No log público, exibe o título do Strava.
            </p>
          </div>
          <Switch
            checked={showNames}
            onCheckedChange={setShowNames}
            aria-label="Mostrar nomes das atividades"
          />
        </div>
      </div>

      {state?.ok === false ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      {state?.ok === true ? (
        <p className="text-sm text-[var(--ink-soft)]" role="status">
          Salvo.{" "}
          <Link
            href={`/${state.slug}`}
            className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
          >
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
