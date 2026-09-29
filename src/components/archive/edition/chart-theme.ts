/** Classes comuns aos gráficos da edição: altura fixa e eixos em Geist Mono 10,5px. */
export const CHART_FRAME_CLASS =
  "aspect-auto w-full [&_.recharts-cartesian-axis-tick_text]:font-mono [&_.recharts-cartesian-axis-tick_text]:text-[10.5px]"

export const BAR_RADIUS: [number, number, number, number] = [3, 3, 0, 0]

export const GRID_STROKE = "var(--chart-5)"

export const BASELINE_AXIS = { stroke: "var(--foreground)" }

export const BAR_CURSOR = { fill: "var(--muted)" }

/** Margem lateral para rótulos de barras nas pontas do gráfico não serem cortados. */
export const EDGE_LABEL_ROOM = 12

export const LINE_CURSOR = { stroke: "var(--foreground)", strokeOpacity: 0.35 }
