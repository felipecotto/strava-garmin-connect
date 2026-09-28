import type { ArchiveData } from "@/lib/archive/types"

import { formDescription } from "./copy"
import { FormChart } from "./form-chart"
import { EditionSection, FinePrint } from "./section"

type FormSectionProps = Pick<ArchiveData, "load" | "pauses" | "races">

export function FormSection({ load, pauses, races }: FormSectionProps) {
  if (load.length === 0) return null

  return (
    <EditionSection
      id="forma"
      label="Forma"
      title="A curva que o feed não mostra."
      description={formDescription(pauses, races.length)}
    >
      <FormChart load={load} pauses={pauses} races={races} />
      <FinePrint>
        Carga calculada pela frequência cardíaca de cada atividade, incluindo pedal e musculação.
        Atividades sem frequência entram por uma estimativa baseada no tempo.
      </FinePrint>
    </EditionSection>
  )
}
