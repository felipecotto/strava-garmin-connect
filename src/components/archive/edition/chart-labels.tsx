import type { LabelProps } from "recharts"

const LABEL_GAP = 6
const LABEL_CLASS = "font-mono text-[10.5px]"
/** Altura de uma linha de rótulo, usada para empilhar marcadores próximos. */
export const LABEL_ROW_HEIGHT = 13

type Box = { x: number; y: number; width: number; height: number }

function cartesianBox(viewBox: LabelProps["viewBox"]): Box | null {
  if (!viewBox || !("x" in viewBox)) return null
  const { x = 0, y = 0, width = 0, height = 0 } = viewBox
  return { x, y, width, height }
}

function hasValue(value: LabelProps["value"]): boolean {
  return value !== undefined && value !== null && value !== ""
}

/** Rótulo acima da barra, numa linha só (o padrão do Recharts quebra o texto na largura da barra). */
export function BarTopLabel({ viewBox, value, fill }: LabelProps) {
  const box = cartesianBox(viewBox)
  if (!box || !hasValue(value)) return null
  return (
    <text x={box.x + box.width / 2} y={box.y - LABEL_GAP} textAnchor="middle" fill={fill} className={LABEL_CLASS}>
      {value}
    </text>
  )
}

/** Rótulo à direita de uma barra horizontal. */
export function BarEndLabel({ viewBox, value, fill }: LabelProps) {
  const box = cartesianBox(viewBox)
  if (!box || !hasValue(value)) return null
  return (
    <text
      x={box.x + box.width + LABEL_GAP}
      y={box.y + box.height / 2}
      dominantBaseline="central"
      fill={fill}
      className={LABEL_CLASS}
    >
      {value}
    </text>
  )
}

type MarkerLabelProps = LabelProps & {
  row: number
  anchor: "start" | "middle" | "end"
}

/**
 * Rótulo no topo de uma linha de referência vertical; `row` empurra para cima marcadores vizinhos.
 * Some abaixo de `md`, onde não cabe; a informação continua no tooltip.
 */
export function MarkerLabel({ viewBox, value, fill, row, anchor }: MarkerLabelProps) {
  const box = cartesianBox(viewBox)
  if (!box || !hasValue(value)) return null
  return (
    <text
      x={box.x}
      y={box.y - LABEL_GAP - row * LABEL_ROW_HEIGHT}
      textAnchor={anchor}
      fill={fill}
      className={`${LABEL_CLASS} hidden md:inline`}
    >
      {value}
    </text>
  )
}
